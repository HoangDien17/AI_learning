from functools import lru_cache
from typing import Literal, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Matchmaker"
    debug: bool = False

    # Embeddings & LLM
    embedding_provider: Literal["local", "openai"] = "local"
    embedding_dimensions: int = 384

    openai_api_key: Optional[str] = None
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o-mini"

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "matchmaker"
    postgres_password: str = "matchmaker"
    postgres_db: str = "matchmaker"

    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_collection: str = "profiles"

    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def postgres_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
