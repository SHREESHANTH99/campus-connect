# app/models/comment.py  — Phase 2 new model

import uuid
from datetime import datetime
from sqlalchemy import Integer, DateTime, Text, ForeignKey, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Comment(Base):
    __tablename__ = "comments"

    # ── Identity ──────────────────────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # ── Content ───────────────────────────────────────────────────────────────
    content: Mapped[str] = mapped_column(Text, nullable=False)

    # ── Relationships ─────────────────────────────────────────────────────────
    confession_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("confessions.id", ondelete="CASCADE"), nullable=False
    )
    author_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    # ── Threaded replies (self-referential, max 1 level deep) ─────────────────
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("comments.id", ondelete="CASCADE"), nullable=True
    )
    replies = relationship("Comment", backref="parent", remote_side="Comment.id")
    author  = relationship("User", backref="comments")

    # ── Engagement ────────────────────────────────────────────────────────────
    upvotes:   Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    downvotes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ── Moderation ────────────────────────────────────────────────────────────
    is_removed:        Mapped[bool]  = mapped_column(Boolean, default=False)
    moderation_score:  Mapped[float] = mapped_column(Float, default=0.0)

    # ── Timestamps ────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<Comment id={self.id} confession={self.confession_id}>"
