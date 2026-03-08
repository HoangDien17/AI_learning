import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.postgres import get_session_factory
from app.database.qdrant import upsert_profile_vector
from app.models.profile import ProfileCreate, ProfileResponse, ProfileRow
from app.services.embedding_service import generate_embedding
from app.utils.logger import log


def build_profile_text(data: ProfileCreate) -> str:
    """Compose a single natural-language paragraph used for embedding."""
    parts = [
        f"A {data.age}-year-old {data.gender}",
        f"based in {data.location}",
    ]
    if data.occupation:
        parts.append(f"working as a {data.occupation}")
    parts.append(
        f"who enjoys {data.interests}. "
        f"Personality: {data.personality}. "
    )
    if data.lifestyle:
        parts.append(f"Lifestyle: {data.lifestyle}. ")
    parts.append(
        f"Looking for {data.relationship_goals}. "
        f"Ideal partner: {data.partner_preferences}."
    )
    return " ".join(parts)


async def create_profile(data: ProfileCreate) -> ProfileResponse:
    profile_text = build_profile_text(data)
    profile_id = uuid.uuid4()

    embedding = await generate_embedding(profile_text)

    row = ProfileRow(
        id=profile_id,
        name=data.name,
        age=data.age,
        gender=data.gender,
        location=data.location,
        occupation=data.occupation,
        interests=data.interests,
        personality=data.personality,
        lifestyle=data.lifestyle,
        relationship_goals=data.relationship_goals,
        partner_preferences=data.partner_preferences,
        profile_text=profile_text,
    )

    session_factory = get_session_factory()
    async with session_factory() as session:
        async with session.begin():
            session.add(row)
        await session.refresh(row)

    qdrant_payload = {
        "user_id": str(profile_id),
        "gender": data.gender.lower(),
        "age": data.age,
        "location": data.location.lower(),
        "relationship_goals": data.relationship_goals.lower(),
        "interests": [i.strip().lower() for i in data.interests.split(",")],
    }
    upsert_profile_vector(
        point_id=str(profile_id),
        vector=embedding,
        payload=qdrant_payload,
    )
    log.info("Profile created: %s (%s)", data.name, profile_id)
    return ProfileResponse.model_validate(row)


async def get_profile(user_id: uuid.UUID) -> ProfileResponse | None:
    session_factory = get_session_factory()
    async with session_factory() as session:
        result = await session.execute(
            select(ProfileRow).where(ProfileRow.id == user_id)
        )
        row = result.scalar_one_or_none()
        if row is None:
            return None
        return ProfileResponse.model_validate(row)


async def get_profile_row(session: AsyncSession, user_id: uuid.UUID) -> ProfileRow | None:
    result = await session.execute(
        select(ProfileRow).where(ProfileRow.id == user_id)
    )
    return result.scalar_one_or_none()
