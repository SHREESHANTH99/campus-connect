from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.event import EventRSVPStatus


class EventCreateSchema(BaseModel):
    title: str = Field(min_length=3, max_length=180)
    description: str = Field(min_length=10, max_length=5000)
    category: str = Field(min_length=2, max_length=80)
    location: str = Field(min_length=2, max_length=180)
    start_time: datetime
    end_time: datetime
    club_id: UUID | None = None
    capacity: int | None = Field(default=None, ge=1)
    is_public: bool = True
    allow_waitlist: bool = False
    banner_url: str | None = None
    tags: list[str] = []
    schedule: dict = {}
    speakers: list[dict] = []


class EventUpdateSchema(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=180)
    description: str | None = Field(default=None, min_length=10, max_length=5000)
    category: str | None = Field(default=None, min_length=2, max_length=80)
    location: str | None = Field(default=None, min_length=2, max_length=180)
    start_time: datetime | None = None
    end_time: datetime | None = None
    capacity: int | None = Field(default=None, ge=1)
    is_public: bool | None = None
    allow_waitlist: bool | None = None
    banner_url: str | None = None
    tags: list[str] | None = None
    schedule: dict | None = None
    speakers: list[dict] | None = None


class EventResponseSchema(BaseModel):
    id: UUID
    title: str
    description: str
    category: str
    location: str
    organizer_id: UUID
    club_id: UUID | None
    start_time: datetime
    end_time: datetime
    capacity: int | None
    attendee_count: int
    is_public: bool
    allow_waitlist: bool
    banner_url: str | None
    tags: list
    schedule: dict
    speakers: list
    created_at: datetime
    is_cancelled: bool

    model_config = {"from_attributes": True}


class RSVPResponseSchema(BaseModel):
    attending: bool
    attendee_count: int
    status: EventRSVPStatus | None = None
