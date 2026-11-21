"""Synchronous SQLAlchemy engine and session factory (Postgres + PostGIS)."""

from __future__ import annotations

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

_DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
if not _DATABASE_URL:
    # Allow local / CI without DB; routers that need DB must handle missing URL.
    _DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/gridalpha"

# Railway sometimes uses postgres:// — SQLAlchemy 2 prefers postgresql://
if _DATABASE_URL.startswith("postgres://"):
    _DATABASE_URL = "postgresql://" + _DATABASE_URL[len("postgres://") :]

engine = create_engine(
    _DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency — yields a scoped session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
