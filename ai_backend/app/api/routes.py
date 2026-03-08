import uuid

from fastapi import APIRouter, HTTPException

from app.agents.matchmaking_agent import find_matches
from app.models.profile import (
    MatchResponse,
    ProfileCreate,
    ProfileResponse,
)
from app.services.profile_service import create_profile, get_profile

router = APIRouter()


@router.post("/profiles", response_model=ProfileResponse, status_code=201)
async def create_profile_endpoint(data: ProfileCreate):
    try:
        return await create_profile(data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/profiles/{user_id}", response_model=ProfileResponse)
async def get_profile_endpoint(user_id: uuid.UUID):
    profile = await get_profile(user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.get("/matches/{user_id}", response_model=MatchResponse)
async def get_matches_endpoint(user_id: uuid.UUID, top_k: int = 10):
    try:
        return await find_matches(user_id, top_k=top_k)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
