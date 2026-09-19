"""Private operator workspace boundary for the Ariadne Core workbench.

The workspace is intentionally not an energy-domain entity.  It only binds an
authenticated operator to one private Ariadne tenant context.  HTTP clients
never submit that tenant identifier; the service derives it from this row.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Index, Text, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AriadneOperatorWorkspace(Base):
    __tablename__ = "ariadne_operator_workspace"
    __table_args__ = (
        CheckConstraint("length(label) > 0", name="ariadne_operator_workspace_label_check"),
        Index(
            "ariadne_operator_workspace_owner_created_idx",
            "owner_user_id",
            "created_at",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    label: Mapped[str] = mapped_column(Text, nullable=False)
    synthetic: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text("true")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


__all__ = ["AriadneOperatorWorkspace"]
