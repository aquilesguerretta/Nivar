"""ORM model — Solar Proposal Validator submissions and deliverables.

This is a sibling domain to ``conta_luz_submission``. It intentionally does
not extend or discriminate the Conta de Luz Express table: the second Advisory
product tests the shared workflow before a third instance justifies a generic
submission domain.

V1 stores one uploaded proposal and one final PDF in PostgreSQL BYTEA. The
review remains manual and bounded by strict request-size limits.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    LargeBinary,
    Text,
    desc,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


SOLAR_PROPOSAL_STATUSES: tuple[str, ...] = ("submitted", "ready")


class SolarProposalSubmission(Base):
    __tablename__ = "solar_proposal_submission"
    __table_args__ = (
        Index(
            "solar_proposal_submission_user_created_idx",
            "user_id",
            desc("created_at"),
        ),
        Index(
            "solar_proposal_submission_status_created_idx",
            "status",
            "created_at",
        ),
        CheckConstraint(
            "status IN ('submitted', 'ready')",
            name="solar_proposal_submission_status_check",
        ),
        CheckConstraint(
            "source_size_bytes > 0",
            name="solar_proposal_submission_source_size_bytes_check",
        ),
        CheckConstraint(
            """
            (
              status = 'submitted'
              AND deliverable_data IS NULL
              AND deliverable_filename IS NULL
              AND deliverable_content_type IS NULL
              AND deliverable_size_bytes IS NULL
              AND deliverable_sha256 IS NULL
              AND delivered_at IS NULL
            )
            OR
            (
              status = 'ready'
              AND deliverable_data IS NOT NULL
              AND deliverable_filename IS NOT NULL
              AND deliverable_content_type = 'application/pdf'
              AND deliverable_size_bytes > 0
              AND deliverable_sha256 IS NOT NULL
              AND delivered_at IS NOT NULL
            )
            """,
            name="solar_proposal_submission_deliverable_state_check",
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
    status: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        server_default="submitted",
    )

    source_filename: Mapped[str] = mapped_column(Text, nullable=False)
    source_content_type: Mapped[str] = mapped_column(Text, nullable=False)
    source_size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    source_sha256: Mapped[str] = mapped_column(Text, nullable=False)
    source_data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)

    deliverable_filename: Mapped[str | None] = mapped_column(Text, nullable=True)
    deliverable_content_type: Mapped[str | None] = mapped_column(Text, nullable=True)
    deliverable_size_bytes: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    deliverable_sha256: Mapped[str | None] = mapped_column(Text, nullable=True)
    deliverable_data: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)

    operator_email_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    operator_notified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    customer_email_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    customer_notified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

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
    delivered_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
