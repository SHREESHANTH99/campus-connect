"""phase2_confession_feed_upgrade

Revision ID: b4f8c2a91d3e
Revises: (replace with your Phase 1 revision ID from alembic/versions/)
Create Date: 2024-01-01 00:00:00.000000

What this migration adds:
  confessions  — view_count, comment_count, trending_score, reactions,
                 moderation_status, moderation_score, mod_reject_reason, report_count
  comments     — brand new table
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# !! IMPORTANT !!
# Replace the string below with the actual revision ID of your Phase 1 migration.
# Find it by running:  alembic history
# It looks like: a1b2c3d4e5f6

revision = "b4f8c2a91d3e"
down_revision = "1fb888bd0696"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── 1. New ENUM types ─────────────────────────────────────────────────────
    moderation_status = postgresql.ENUM(
        "pending", "approved", "flagged", "rejected",
        name="moderation_status",
        create_type=True,
    )
    moderation_status.create(op.get_bind(), checkfirst=True)

    # ── 2. Add columns to confessions ────────────────────────────────────────
    op.add_column("confessions", sa.Column("view_count",          sa.Integer(),   nullable=False, server_default="0"))
    op.add_column("confessions", sa.Column("comment_count",       sa.Integer(),   nullable=False, server_default="0"))
    op.add_column("confessions", sa.Column("trending_score",      sa.Float(),     nullable=False, server_default="0.0"))
    op.add_column("confessions", sa.Column("reactions",           sa.JSON(),      nullable=False,
                                           server_default='{"relatable":0,"shocking":0,"supportive":0,"spicy":0}'))
    op.add_column("confessions", sa.Column("moderation_status",
                                           sa.Enum("pending","approved","flagged","rejected",
                                                   name="moderation_status"),
                                           nullable=False, server_default="approved"))
    op.add_column("confessions", sa.Column("moderation_score",    sa.Float(),     nullable=False, server_default="0.0"))
    op.add_column("confessions", sa.Column("mod_reject_reason",   sa.String(200), nullable=True))
    op.add_column("confessions", sa.Column("report_count",        sa.Integer(),   nullable=False, server_default="0"))

    # ── 3. Index for trending feed ────────────────────────────────────────────
    op.create_index("ix_confessions_trending_score", "confessions", ["trending_score"])
    op.create_index("ix_confessions_college_category", "confessions", ["college_id", "category"])

    # ── 4. Create comments table ─────────────────────────────────────────────
    op.create_table(
        "comments",
        sa.Column("id",               postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("confession_id",    postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("confessions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("author_id",        postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id",       ondelete="SET NULL"), nullable=True),
        sa.Column("parent_id",        postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("comments.id",    ondelete="CASCADE"), nullable=True),
        sa.Column("content",          sa.Text(),    nullable=False),
        sa.Column("upvotes",          sa.Integer(), nullable=False, server_default="0"),
        sa.Column("downvotes",        sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_removed",       sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("moderation_score", sa.Float(),   nullable=False, server_default="0.0"),
        sa.Column("created_at",       sa.DateTime(), nullable=False,
                  server_default=sa.text("NOW()")),
    )
    op.create_index("ix_comments_confession_id", "comments", ["confession_id"])
    op.create_index("ix_comments_parent_id",     "comments", ["parent_id"])


def downgrade() -> None:
    op.drop_table("comments")
    op.drop_index("ix_confessions_trending_score",    table_name="confessions")
    op.drop_index("ix_confessions_college_category",  table_name="confessions")
    for col in [
        "view_count", "comment_count", "trending_score", "reactions",
        "moderation_status", "moderation_score", "mod_reject_reason", "report_count",
    ]:
        op.drop_column("confessions", col)

    op.execute("DROP TYPE IF EXISTS moderation_status")
