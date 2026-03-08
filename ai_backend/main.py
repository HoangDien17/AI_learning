from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes import router
from app.database.postgres import init_db, shutdown_db
from app.database.qdrant import ensure_collection
from app.utils.config import get_settings
from app.utils.logger import log


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    log.info("Starting %s", settings.app_name)
    await init_db()
    ensure_collection()
    yield
    await shutdown_db()
    log.info("Shutdown complete")


app = FastAPI(
    title="AI Matchmaker",
    description="AI-powered matchmaking system using embeddings and vector search",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(router, tags=["matchmaking"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
