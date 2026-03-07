# app/models/confession.py  — Phase 2 upgrade

import uuid
from datetime import datetime
from sqlalchemy import (
    String, Integer, Float, DateTime, Text,
    ForeignKey, Enum as PgEnum, Boolean, JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum


class ConfessionCategory(str, enum.Enum):
    academics       = "academics"
    love_crush      = "love_crush"
    hostel_life     = "hostel_life"
    professor_roast = "professor_roast"
    campus_secrets  = "campus_secrets"
    career_anxiety  = "career_anxiety"
    placement_tea   = "placement_tea"
    general         = "general"


class ModerationStatus(str, enum.Enum):
    pending  = "pending"    # awaiting auto-mod check
    approved = "approved"   # passed moderation
    flagged  = "flagged"    # needs human review
    rejected = "rejected"   # removed by moderation


class Confession(Base):
    __tablename__ = "confessions"

    # ── Identity ──────────────────────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # ── Content ───────────────────────────────────────────────────────────────
    content:  Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[ConfessionCategory] = mapped_column(
        PgEnum(ConfessionCategory, name="confession_category"),
        default=ConfessionCategory.general,
        nullable=False,
    )

    # ── Author & College ──────────────────────────────────────────────────────
    author_id:  Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    college_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    author = relationship("User", backref="confessions")

    # ── Engagement counters (denormalised for fast reads) ─────────────────────
    score:         Mapped[int]   = mapped_column(Integer, default=0, nullable=False)
    upvotes:       Mapped[int]   = mapped_column(Integer, default=0, nullable=False)
    downvotes:     Mapped[int]   = mapped_column(Integer, default=0, nullable=False)
    view_count:    Mapped[int]   = mapped_column(Integer, default=0, nullable=False)
    comment_count: Mapped[int]   = mapped_column(Integer, default=0, nullable=False)

    # ── Trending score (Hacker News formula, refreshed periodically) ──────────
    trending_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # ── Emoji reactions  {"relatable":12, "shocking":3, "supportive":8, "spicy":1}
    reactions: Mapped[dict] = mapped_column(
        JSON,
        default=lambda: {"relatable": 0, "shocking": 0, "supportive": 0, "spicy": 0},
        nullable=False,
    )

    # ── Moderation ────────────────────────────────────────────────────────────
    moderation_status: Mapped[ModerationStatus] = mapped_column(
        PgEnum(ModerationStatus, name="moderation_status"),
        default=ModerationStatus.pending,
        nullable=False,
    )
    moderation_score:  Mapped[float]      = mapped_column(Float, default=0.0)
    mod_reject_reason: Mapped[str | None] = mapped_column(String(200), nullable=True)
    is_flagged:        Mapped[bool]       = mapped_column(Boolean, default=False)
    is_removed:        Mapped[bool]       = mapped_column(Boolean, default=False)
    report_count:      Mapped[int]        = mapped_column(Integer, default=0)

    # ── Timestamps ────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    comments = relationship("Comment", backref="confession", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Confession id={self.id} category={self.category} score={self.score}>"
