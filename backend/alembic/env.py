# alembic/env.py

import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# ── Make sure app/ is importable ─────────────────────────────────────────────
# Run alembic from the backend/ directory: `alembic revision --autogenerate`
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.config import settings
from app.db.base import Base

# Import all models so Alembic can discover them for autogenerate
from app.models.user import User              # noqa: F401
from app.models.confession import Confession  # noqa: F401
from app.models.comment import Comment        # noqa: F401
from app.models.vote import Vote              # noqa: F401
from app.models.report import Report          # noqa: F401
from app.models.chat_session import ChatSession  # noqa: F401

# ── Alembic config object ────────────────────────────────────────────────────
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Override sqlalchemy.url from our settings (reads .env automatically)
# Escape % signs for ConfigParser interpolation
database_url = settings.DATABASE_URL.replace('%', '%%')
config.set_main_option("sqlalchemy.url", database_url)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations without a live DB connection (generates SQL only)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations against a live DB connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
