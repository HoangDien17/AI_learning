"""
Matchmaking Agent

Orchestrates the full match pipeline:
1. Load the requesting user's profile
2. Retrieve (or generate) the user's embedding
3. Query Qdrant for similar profiles
4. Filter by preferences (gender, age range, location)
5. Compute composite compatibility score
6. Ask the LLM for a human-readable explanation
7. Return ranked results
"""

from __future__ import annotations

import uuid

from qdrant_client.models import FieldCondition, Filter, MatchValue, Range

from app.database.postgres import get_session_factory
from app.database.qdrant import search_similar
from app.models.profile import MatchResponse, MatchResult, ProfileResponse
from app.services.embedding_service import (
    generate_compatibility_explanation,
    generate_embedding,
)
from app.services.matching_service import (
    compute_compatibility,
    location_score,
    relationship_goal_score,
    shared_interests_score,
)
from app.services.profile_service import get_profile, get_profile_row
from app.utils.logger import log

AGE_RANGE_DELTA = 10
TOP_K_VECTOR = 30
TOP_K_RESULTS = 10


async def find_matches(
    user_id: uuid.UUID,
    top_k: int = TOP_K_RESULTS,
) -> MatchResponse:
    log.info("Agent: starting match search for user %s", user_id)

    user_profile = await get_profile(user_id)
    if user_profile is None:
        raise ValueError(f"Profile not found: {user_id}")

    # Step 1 — embedding
    embedding = await generate_embedding(user_profile.profile_text)

    # Step 2 — build Qdrant filter from user preferences
    qdrant_filter = _build_filter(user_profile)

    # Step 3 — vector search
    raw_hits = search_similar(
        vector=embedding,
        limit=TOP_K_VECTOR,
        score_threshold=0.3,
        query_filter=qdrant_filter,
    )
    log.info("Agent: Qdrant returned %d candidates", len(raw_hits))

    # Step 4 — score and enrich
    session_factory = get_session_factory()
    scored: list[MatchResult] = []

    async with session_factory() as session:
        for hit in raw_hits:
            candidate_id = hit.payload.get("user_id") if hit.payload else None
            if candidate_id is None or candidate_id == str(user_id):
                continue

            candidate_row = await get_profile_row(session, uuid.UUID(candidate_id))
            if candidate_row is None:
                continue

            candidate = ProfileResponse.model_validate(candidate_row)

            emb_sim = float(hit.score)
            interests = shared_interests_score(
                user_profile.interests,
                hit.payload.get("interests", []),
            )
            loc = location_score(user_profile.location, candidate.location)
            rel = relationship_goal_score(
                user_profile.relationship_goals, candidate.relationship_goals
            )
            total = compute_compatibility(emb_sim, interests, loc, rel)

            scored.append(
                MatchResult(
                    profile=candidate,
                    compatibility_score=total,
                    embedding_similarity=round(emb_sim, 4),
                    shared_interests_score=round(interests, 4),
                    location_score=round(loc, 4),
                    relationship_goal_score=round(rel, 4),
                )
            )

    scored.sort(key=lambda m: m.compatibility_score, reverse=True)
    top_matches = scored[:top_k]

    # Step 5 — LLM explanations for top matches
    user_dict = user_profile.model_dump()
    for match in top_matches:
        try:
            explanation = await generate_compatibility_explanation(
                profile_a=user_dict,
                profile_b=match.profile.model_dump(),
                score=match.compatibility_score,
            )
            match.explanation = explanation
        except Exception:
            log.exception("Failed to generate explanation for %s", match.profile.id)
            match.explanation = "Compatibility explanation unavailable."

    log.info("Agent: returning %d matches for user %s", len(top_matches), user_id)
    return MatchResponse(user_id=user_id, matches=top_matches)


def _build_filter(profile: ProfileResponse) -> Filter | None:
    """Heuristic filter: exclude same-gender, constrain age range."""
    conditions = []

    # Exclude the requesting user's own gender (simple heuristic).
    # A real app would store an explicit "looking for" gender field.
    conditions.append(
        FieldCondition(
            key="gender",
            match=MatchValue(
                value=_opposite_gender(profile.gender),
            ),
        )
    )

    conditions.append(
        FieldCondition(
            key="age",
            range=Range(
                gte=profile.age - AGE_RANGE_DELTA,
                lte=profile.age + AGE_RANGE_DELTA,
            ),
        )
    )

    return Filter(must=conditions) if conditions else None


def _opposite_gender(gender: str) -> str:
    mapping = {"male": "female", "female": "male"}
    return mapping.get(gender.lower(), gender.lower())
