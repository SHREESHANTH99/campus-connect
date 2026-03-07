# app/db/base.py
# Import this everywhere models need Base, so Alembic can discover all tables.

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
