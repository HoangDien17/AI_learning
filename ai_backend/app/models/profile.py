from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase


# ── SQLAlchemy ORM ──────────────────────────────────────────────────────────

class Base(DeclarativeBase):
    pass


class ProfileRow(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(120), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(30), nullable=False)
    location = Column(String(200), nullable=False)
    occupation = Column(String(200), nullable=False)
    interests = Column(Text, nullable=False)
    personality = Column(Text, nullable=False)
    lifestyle = Column(Text, nullable=False)
    relationship_goals = Column(Text, nullable=False)
    partner_preferences = Column(Text, nullable=False)
    profile_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


# ── Pydantic Schemas ───────────────────────────────────────────────────────

class ProfileCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    age: int = Field(..., ge=18, le=120)
    gender: str = Field(..., min_length=1, max_length=30)
    location: str = Field(..., min_length=1, max_length=200)
    occupation: str = Field(..., max_length=200, default="")
    interests: str = Field(..., description="Comma-separated list of interests")
    personality: str = Field(..., description="Short personality description")
    lifestyle: str = Field(default="", description="Lifestyle description")
    relationship_goals: str = Field(..., description="What the user is looking for")
    partner_preferences: str = Field(
        ..., description="Preferred partner characteristics"
    )

    model_config = {"json_schema_extra": {
        "examples": [
            {
                "name": "Alice",
                "age": 29,
                "gender": "female",
                "location": "San Francisco, CA",
                "occupation": "Software Engineer",
                "interests": "hiking, traveling, reading psychology books, yoga",
                "personality": "Curious, empathetic, and adventurous",
                "lifestyle": "Active and health-conscious, enjoys weekends outdoors",
                "relationship_goals": "Long-term relationship leading to marriage",
                "partner_preferences": "Someone who values family, personal growth, and enjoys outdoor activities",
            }
        ]
    }}


class ProfileResponse(BaseModel):
    id: uuid.UUID
    name: str
    age: int
    gender: str
    location: str
    occupation: str
    interests: str
    personality: str
    lifestyle: str
    relationship_goals: str
    partner_preferences: str
    profile_text: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MatchResult(BaseModel):
    profile: ProfileResponse
    compatibility_score: float = Field(
        ..., ge=0.0, le=1.0, description="Overall compatibility 0‑1"
    )
    embedding_similarity: float
    shared_interests_score: float
    location_score: float
    relationship_goal_score: float
    explanation: str = ""


class MatchResponse(BaseModel):
    user_id: uuid.UUID
    matches: list[MatchResult]
