from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.user import UserRole, UserStatus


class ProfileResponseSchema(BaseModel):
    id: UUID
    anonymous_username: str
    college_id: str | None
    branch: str | None
    year: int | None
    bio: str | None
    karma: int
    role: UserRole
    status: UserStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class ProfileUpdateSchema(BaseModel):
    college_id: str | None = Field(default=None, max_length=100)
    branch: str | None = Field(default=None, max_length=80)
    year: int | None = Field(default=None, ge=1, le=8)
    bio: str | None = Field(default=None, max_length=240)
