from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class PollCreateSchema(BaseModel):
    question: str = Field(min_length=5, max_length=1000)
    options: list[str] = Field(min_length=2, max_length=8)
    ends_at: datetime | None = None

    @field_validator("options")
    @classmethod
    def validate_options(cls, value: list[str]) -> list[str]:
        normalized = [option.strip() for option in value if option.strip()]
        if len(normalized) < 2:
            raise ValueError("At least 2 options are required")
        return normalized


class PollVoteSchema(BaseModel):
    option_index: int = Field(ge=0)


class PollResponseSchema(BaseModel):
    id: UUID
    question: str
    options: list
    votes: dict
    creator_id: UUID
    total_votes: int
    ends_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}
