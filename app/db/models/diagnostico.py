"""ORM model — Diagnóstico Energético scoping intake.

Sibling domain to the file-upload submissions, not an extension of them.
The row is a call-scoping sheet (sector, consumption band, optional tariff,
open concern) — not the 25–40 page report and not a BYTEA.

Status is not ``submitted``/``ready``: there is no PDF deliverable in this
wave. The case exists; the ongoing exchange lives in ``conversation`` /
``message``, pointed at by opaque ``origin_kind`` / ``origin_id``.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Text, desc, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DiagnosticoEnergeticoSubmission(Base):
    __tablename__ = "diagnostico_energetico_submission"
    __table_args__ = (
        Index(
            "diagnostico_energetico_submission_user_created_idx",
            "user_id",
            desc("created_at"),
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    sector: Mapped[str] = mapped_column(Text, nullable=False)
    monthly_consumption_band: Mapped[str] = mapped_column(Text, nullable=False)
    tariff_modality: Mapped[str | None] = mapped_column(Text, nullable=True)
    concern: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
