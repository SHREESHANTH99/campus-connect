# app/services/trending_service.py
# Phase 2 — Trending score engine
#
# Uses a modified Hacker News gravity formula with extra signals:
#
#   trending_score = (votes + engagement_bonus) / (age_hours + 2) ^ gravity
#
# Where:
#   votes            = upvotes − downvotes  (raw signal)
#   engagement_bonus = comment_count * 1.5  + view_count * 0.05
#                      + reactions_total * 0.3
#   age_hours        = hours since post was created
#   gravity          = 1.5  (higher = older posts decay faster)
#
# This ensures:
#   - New posts with fast engagement shoot up quickly
#   - Old posts with stale scores naturally sink
#   - Comments and views give a secondary boost (not just votes)

import math
import json
import redis
from datetime import datetime
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.confession import Confession

_redis = redis.from_url(settings.REDIS_URL, decode_responses=True)

GRAVITY        = 1.5
COMMENT_WEIGHT = 1.5
VIEW_WEIGHT    = 0.05
REACTION_WEIGHT = 0.3
TRENDING_CACHE_KEY   = "trending:feed"
TRENDING_CACHE_TTL   = 300   # seconds — refresh every 5 minutes


# ── Core formula ──────────────────────────────────────────────────────────────

def compute_trending_score(
    score:         int,
    comment_count: int,
    view_count:    int,
    reactions:     dict,
    created_at:    datetime,
) -> float:
    """
    Returns a float trending score. Higher = more trending.
    Safe: never returns NaN or negative.
    """
    age_hours = max(
        (datetime.utcnow() - created_at).total_seconds() / 3600,
        0.0,
    )

    reactions_total = sum(reactions.values()) if reactions else 0

    engagement_bonus = (
        comment_count * COMMENT_WEIGHT
        + view_count  * VIEW_WEIGHT
        + reactions_total * REACTION_WEIGHT
    )

    numerator   = max(score + engagement_bonus, 0)
    denominator = math.pow(age_hours + 2, GRAVITY)

    return round(numerator / denominator, 6)


# ── Batch refresh (called periodically / on each write) ──────────────────────

def refresh_trending_scores(db: Session) -> int:
    """
    Recompute trending_score for all non-removed confessions
    and persist to the DB.  Returns the count of updated rows.
    """
    confessions = (
        db.query(Confession)
        .filter(Confession.is_removed == False)
        .all()
    )

    for c in confessions:
        c.trending_score = compute_trending_score(
            score=c.score,
            comment_count=c.comment_count,
            view_count=c.view_count,
            reactions=c.reactions or {},
            created_at=c.created_at,
        )

    db.commit()

    # Invalidate Redis cache so next feed request gets fresh data
    _redis.delete(TRENDING_CACHE_KEY)
    return len(confessions)


# ── Redis-cached trending feed ────────────────────────────────────────────────

def get_trending_feed_cached(db: Session, limit: int = 20) -> list[dict]:
    """
    Returns the trending feed as a list of dicts.
    Served from Redis cache when available; falls back to DB.
    """
    cached = _redis.get(TRENDING_CACHE_KEY)
    if cached:
        data = json.loads(cached)
        return data[:limit]

    # Cache miss — query DB, cache result
    confessions = (
        db.query(Confession)
        .filter(Confession.is_removed == False)
        .order_by(Confession.trending_score.desc())
        .limit(50)   # cache top 50, slice per request
        .all()
    )

    serialised = [
        {
            "id":             str(c.id),
            "content":        c.content,
            "category":       c.category.value,
            "score":          c.score,
            "upvotes":        c.upvotes,
            "downvotes":      c.downvotes,
            "comment_count":  c.comment_count,
            "view_count":     c.view_count,
            "reactions":      c.reactions,
            "trending_score": c.trending_score,
            "college_id":     c.college_id,
            "created_at":     c.created_at.isoformat(),
        }
        for c in confessions
    ]

    _redis.setex(TRENDING_CACHE_KEY, TRENDING_CACHE_TTL, json.dumps(serialised))
    return serialised[:limit]


def invalidate_trending_cache() -> None:
    """Call after any write that could affect trending order."""
    _redis.delete(TRENDING_CACHE_KEY)
