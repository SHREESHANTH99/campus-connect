from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ClubCreateSchema(BaseModel):
    name: str = Field(min_length=2, max_length=140)
    category: str = Field(min_length=2, max_length=60)
    description: str = Field(min_length=10, max_length=5000)
    logo_url: str | None = None
    banner_url: str | None = None
    founded_year: int | None = Field(default=None, ge=1900, le=2100)


class ClubUpdateSchema(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=140)
    category: str | None = Field(default=None, min_length=2, max_length=60)
    description: str | None = Field(default=None, min_length=10, max_length=5000)
    logo_url: str | None = None
    banner_url: str | None = None
    founded_year: int | None = Field(default=None, ge=1900, le=2100)
    is_verified: bool | None = None


class ClubResponseSchema(BaseModel):
    id: UUID
    name: str
    category: str
    description: str
    logo_url: str | None
    banner_url: str | None
    lead_id: UUID
    member_count: int
    event_count: int
    founded_year: int | None
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ClubJoinResponseSchema(BaseModel):
    joined: bool
    member_count: int
