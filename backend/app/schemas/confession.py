# app/schemas/confession.py  — Phase 2 full upgrade

from __future__ import annotations
from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, field_validator
from app.models.confession import ConfessionCategory
from app.models.report import ReportReason


# ── Request schemas ───────────────────────────────────────────────────────────

class ConfessionCreateSchema(BaseModel):
    content:    str
    category:   ConfessionCategory = ConfessionCategory.general
    college_id: Optional[str]      = None

    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 10:
            raise ValueError("Confession must be at least 10 characters.")
        if len(v) > 2000:
            raise ValueError("Confession cannot exceed 2000 characters.")
        return v

    @field_validator("college_id")
    @classmethod
    def validate_college_id(cls, v: str | None) -> str | None:
        if v and len(v) > 100:
            raise ValueError("college_id too long.")
        return v


class VoteSchema(BaseModel):
    vote_type: str  # "up" | "down"

    @field_validator("vote_type")
    @classmethod
    def validate_vote(cls, v: str) -> str:
        if v not in ("up", "down"):
            raise ValueError("vote_type must be 'up' or 'down'")
        return v


class ReactionSchema(BaseModel):
    reaction: str   # relatable | shocking | supportive | spicy


class CommentCreateSchema(BaseModel):
    content:   str
    parent_id: Optional[UUID] = None

    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Comment too short.")
        if len(v) > 500:
            raise ValueError("Comment cannot exceed 500 characters.")
        return v


class ReportSchema(BaseModel):
    reason:      ReportReason
    description: Optional[str] = None

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        if v and len(v) > 500:
            raise ValueError("Description cannot exceed 500 characters.")
        return v


# ── Response schemas ──────────────────────────────────────────────────────────

class CommentResponseSchema(BaseModel):
    id:         UUID
    content:    str
    upvotes:    int
    downvotes:  int
    parent_id:  Optional[UUID]
    created_at: datetime
    replies:    list[CommentResponseSchema] = []

    model_config = {"from_attributes": True}

CommentResponseSchema.model_rebuild()


class ConfessionResponseSchema(BaseModel):
    id:             UUID
    content:        str
    category:       ConfessionCategory
    college_id:     Optional[str]
    score:          int
    upvotes:        int
    downvotes:      int
    view_count:     int
    comment_count:  int
    reactions:      dict
    trending_score: float
    created_at:     datetime

    model_config = {"from_attributes": True}


class FeedResponseSchema(BaseModel):
    items:       list[ConfessionResponseSchema]
    next_cursor: Optional[str]
    total_hint:  Optional[int]


class VoteResponseSchema(BaseModel):
    score:     int
    upvotes:   int
    downvotes: int


class ConfessionDetailSchema(ConfessionResponseSchema):
    comments: list[CommentResponseSchema] = []
