import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum as PgEnum, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class EventRSVPStatus(str, enum.Enum):
    going = "going"
    waitlist = "waitlist"


class Event(Base):
    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    location: Mapped[str] = mapped_column(String(180), nullable=False)

    organizer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    club_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id", ondelete="SET NULL"), nullable=True)

    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    attendee_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    is_public: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    allow_waitlist: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    banner_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    tags: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    schedule: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    speakers: Mapped[list] = mapped_column(JSON, nullable=False, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    is_cancelled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class EventRSVP(Base):
    __tablename__ = "event_rsvps"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[EventRSVPStatus] = mapped_column(
        PgEnum(EventRSVPStatus, name="event_rsvp_status"),
        nullable=False,
        default=EventRSVPStatus.going,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
