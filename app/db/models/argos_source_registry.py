"""Durable source-policy revisions, separate from Argos snapshot lineage."""

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Integer, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ArgosSourceRevision(Base):
    __tablename__ = "argos_source_revision"

    source_id: Mapped[str] = mapped_column(Text, primary_key=True)
    policy_version: Mapped[int] = mapped_column(Integer, primary_key=True)
    definition: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    check_status: Mapped[str] = mapped_column(Text, server_default="not_checked")
    last_checked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
