from openai import AsyncOpenAI

from app.utils.config import get_settings
from app.utils.logger import log

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=get_settings().openai_api_key)
    return _client


async def generate_embedding(text: str) -> list[float]:
    settings = get_settings()
    client = _get_client()
    log.info("Generating embedding (%d chars)", len(text))
    response = await client.embeddings.create(
        input=text,
        model=settings.openai_embedding_model,
    )
    return response.data[0].embedding


async def generate_compatibility_explanation(
    profile_a: dict,
    profile_b: dict,
    score: float,
) -> str:
    settings = get_settings()
    client = _get_client()

    prompt = (
        "You are an AI matchmaking assistant. Given two user profiles and their "
        "compatibility score, write a short, warm, 2‑3 sentence explanation of "
        "why these two people could be a great match. Focus on shared values, "
        "interests, and complementary traits.\n\n"
        f"Compatibility score: {score:.0%}\n\n"
        f"Person A:\n{_profile_summary(profile_a)}\n\n"
        f"Person B:\n{_profile_summary(profile_b)}\n\n"
        "Explanation:"
    )

    response = await client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


def _profile_summary(p: dict) -> str:
    return (
        f"Name: {p.get('name')}, Age: {p.get('age')}, Gender: {p.get('gender')}, "
        f"Location: {p.get('location')}, Occupation: {p.get('occupation')}\n"
        f"Interests: {p.get('interests')}\n"
        f"Personality: {p.get('personality')}\n"
        f"Lifestyle: {p.get('lifestyle')}\n"
        f"Relationship goals: {p.get('relationship_goals')}\n"
        f"Partner preferences: {p.get('partner_preferences')}"
    )
