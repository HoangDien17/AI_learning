"""
Scoring helpers used by the matchmaking agent.

compatibility_score =
    0.6 * embedding_similarity
  + 0.2 * shared_interests
  + 0.1 * location_distance
  + 0.1 * relationship_goal_match
"""

from difflib import SequenceMatcher


def shared_interests_score(a_interests: str, b_interests: list[str]) -> float:
    a_set = {i.strip().lower() for i in a_interests.split(",")}
    b_set = {i.strip().lower() for i in b_interests}
    if not a_set or not b_set:
        return 0.0
    return len(a_set & b_set) / max(len(a_set), len(b_set))


def location_score(a_location: str, b_location: str) -> float:
    """Fuzzy text similarity as a proxy for geographic closeness."""
    return SequenceMatcher(
        None, a_location.lower(), b_location.lower()
    ).ratio()


def relationship_goal_score(a_goal: str, b_goal: str) -> float:
    return SequenceMatcher(
        None, a_goal.lower(), b_goal.lower()
    ).ratio()


def compute_compatibility(
    embedding_sim: float,
    interests: float,
    location: float,
    rel_goal: float,
) -> float:
    return round(
        0.6 * embedding_sim
        + 0.2 * interests
        + 0.1 * location
        + 0.1 * rel_goal,
        4,
    )
