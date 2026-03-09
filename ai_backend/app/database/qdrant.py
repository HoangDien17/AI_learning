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
    expected_dim = settings.embedding_dimensions
    coll_name = settings.qdrant_collection
    collections = [c.name for c in client.get_collections().collections]

    if coll_name not in collections:
        client.create_collection(
            collection_name=coll_name,
            vectors_config=VectorParams(
                size=expected_dim,
                distance=Distance.COSINE,
            ),
        )
        log.info("Created Qdrant collection '%s' (dim=%s)", coll_name, expected_dim)
        return

    # If collection exists, ensure vector size matches config (e.g. after switching embedding provider)
    info = client.get_collection(coll_name)
    try:
        current_dim = info.config.params.vectors.size
    except AttributeError:
        current_dim = None
    if current_dim is None or current_dim != expected_dim:
        log.warning(
            "Qdrant collection '%s' has vector size %s but config expects %s; recreating collection",
            coll_name,
            current_dim if current_dim is not None else "?",
            expected_dim,
        )
        client.delete_collection(coll_name)
        client.create_collection(
            collection_name=coll_name,
            vectors_config=VectorParams(
                size=expected_dim,
                distance=Distance.COSINE,
            ),
        )
        log.info("Recreated Qdrant collection '%s' with dim=%s", coll_name, expected_dim)
    else:
        log.info("Qdrant collection '%s' already exists (dim=%s)", coll_name, expected_dim)


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
