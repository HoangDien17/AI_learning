import asyncio
from typing import Optional

from openai import AsyncOpenAI
from sentence_transformers import SentenceTransformer

from app.utils.config import get_settings
from app.utils.logger import log

_client: AsyncOpenAI | None = None
_local_model: Optional[SentenceTransformer] = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        settings = get_settings()
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not configured")
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


def _get_local_model() -> SentenceTransformer:
    global _local_model
    if _local_model is None:
        log.info("Loading local embedding model 'all-MiniLM-L6-v2'")
        _local_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _local_model


async def _generate_local_embedding(text: str) -> list[float]:
    model = _get_local_model()
    loop = asyncio.get_running_loop()
    embedding = await loop.run_in_executor(None, model.encode, text)
    try:
        # numpy array → list
        return embedding.tolist()
    except AttributeError:
        return list(embedding)


async def generate_embedding(text: str) -> list[float]:
    settings = get_settings()
    provider = settings.embedding_provider
    log.info(
        "Generating embedding (%d chars) using provider='%s'",
        len(text),
        provider,
    )

    if provider == "local":
        return await _generate_local_embedding(text)

    # Fallback/default: OpenAI embeddings
    client = _get_client()
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

    settings = get_settings()
    try:
        client = _get_client()
    except RuntimeError:
        log.warning(
            "OPENAI_API_KEY not set; returning fallback compatibility explanation"
        )
        return (
            "Compatibility explanation is unavailable because the LLM API is not "
            "configured, but the numeric compatibility score still reflects the "
            "underlying match quality."
        )

    response = await client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        temperature=0.7,
    )
    log.info("=============Compatibility explanation: %s", response.choices[0].message.content.strip())
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
