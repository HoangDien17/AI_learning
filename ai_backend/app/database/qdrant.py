from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.utils.config import get_settings
from app.utils.logger import log

_client: QdrantClient | None = None


def get_qdrant() -> QdrantClient:
    global _client
    if _client is None:
        settings = get_settings()
        _client = QdrantClient(host=settings.qdrant_host, port=settings.qdrant_port)
        log.info("Qdrant client created (%s:%s)", settings.qdrant_host, settings.qdrant_port)
    return _client


def ensure_collection() -> None:
    settings = get_settings()
    client = get_qdrant()
    collections = [c.name for c in client.get_collections().collections]
    if settings.qdrant_collection not in collections:
        client.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=VectorParams(
                size=settings.embedding_dimensions,
                distance=Distance.COSINE,
            ),
        )
        log.info("Created Qdrant collection '%s'", settings.qdrant_collection)
    else:
        log.info("Qdrant collection '%s' already exists", settings.qdrant_collection)


def upsert_profile_vector(
    point_id: str,
    vector: list[float],
    payload: dict,
) -> None:
    settings = get_settings()
    client = get_qdrant()
    client.upsert(
        collection_name=settings.qdrant_collection,
        points=[
            PointStruct(
                id=point_id,
                vector=vector,
                payload=payload,
            )
        ],
    )


def search_similar(
    vector: list[float],
    limit: int = 20,
    score_threshold: float = 0.0,
    query_filter=None,
) -> list:
    settings = get_settings()
    client = get_qdrant()
    return client.query_points(
        collection_name=settings.qdrant_collection,
        query=vector,
        limit=limit,
        score_threshold=score_threshold,
        query_filter=query_filter,
    ).points
