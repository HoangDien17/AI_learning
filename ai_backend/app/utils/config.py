from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "AI Matchmaker"
    debug: bool = False

    openai_api_key: str
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o-mini"
    embedding_dimensions: int = 1536

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
