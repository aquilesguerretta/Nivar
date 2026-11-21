"""Intake/workflow metadata; canonical confirmed inputs/results remain in Core."""

import uuid
from datetime import datetime
from sqlalchemy import (
    Text,
    DateTime,
    ForeignKeyConstraint,
    UniqueConstraint,
    CheckConstraint,
    LargeBinary,
    func,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class CloseReview(Base):
    __tablename__ = "ariadne_close_review"
    __table_args__ = (
        UniqueConstraint("id", "workspace_id"),
        UniqueConstraint("workspace_id", "scope", "period"),
        ForeignKeyConstraint(["workspace_id"], ["ariadne_operator_workspace.id"]),
        ForeignKeyConstraint(
            ["object_id", "tenant_id"],
            ["ariadne_private_object.id", "ariadne_private_object.tenant_id"],
        ),
        ForeignKeyConstraint(
            ["assumption_set_id", "tenant_id"],
            ["ariadne_assumption_set.id", "ariadne_assumption_set.tenant_id"],
        ),
        CheckConstraint(
            "tenant_id = 'ariadne-operator-workspace:' || workspace_id::text"
        ),
    )
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    tenant_id: Mapped[str] = mapped_column(Text)
    scope: Mapped[str] = mapped_column(Text)
    period: Mapped[str] = mapped_column(Text)
    object_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    assumption_set_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class CloseSource(Base):
    __tablename__ = "ariadne_close_source"
    __table_args__ = (
        UniqueConstraint("id", "review_id", "workspace_id"),
        UniqueConstraint("review_id", "role", "sha256"),
        ForeignKeyConstraint(
            ["review_id", "workspace_id"],
            ["ariadne_close_review.id", "ariadne_close_review.workspace_id"],
        ),
        ForeignKeyConstraint(
            ["supersedes_id", "review_id", "workspace_id"],
            [
                "ariadne_close_source.id",
                "ariadne_close_source.review_id",
                "ariadne_close_source.workspace_id",
            ],
        ),
        UniqueConstraint("supersedes_id"),
        ForeignKeyConstraint(
            ["object_id", "tenant_id"],
            ["ariadne_private_object.id", "ariadne_private_object.tenant_id"],
        ),
        ForeignKeyConstraint(
            ["evidence_id", "tenant_id"],
            ["ariadne_evidence_ref.id", "ariadne_evidence_ref.tenant_id"],
        ),
        CheckConstraint(
            "tenant_id = 'ariadne-operator-workspace:' || workspace_id::text"
        ),
        CheckConstraint("role IN ('invoice','quantity','price','context')"),
    )
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    review_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    tenant_id: Mapped[str] = mapped_column(Text)
    object_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    evidence_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    supersedes_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True
    )
    role: Mapped[str] = mapped_column(Text)
    filename: Mapped[str] = mapped_column(Text)
    content_type: Mapped[str] = mapped_column(Text)
    sha256: Mapped[str] = mapped_column(Text)
    original: Mapped[bytes] = mapped_column(LargeBinary)
    preview: Mapped[dict] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class CloseReceipt(Base):
    __tablename__ = "ariadne_close_receipt"
    workspace_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True
    )
    request_key: Mapped[str] = mapped_column(Text, primary_key=True)
    fingerprint: Mapped[str] = mapped_column(Text)
    response: Mapped[dict] = mapped_column(JSONB)
    __table_args__ = (
        ForeignKeyConstraint(["workspace_id"], ["ariadne_operator_workspace.id"]),
    )


class CloseTreatment(Base):
    __tablename__ = "ariadne_close_treatment"
    __table_args__ = (
        ForeignKeyConstraint(
            ["review_id", "workspace_id"],
            ["ariadne_close_review.id", "ariadne_close_review.workspace_id"],
        ),
        ForeignKeyConstraint(
            ["result_id", "tenant_id"],
            ["ariadne_result.id", "ariadne_result.tenant_id"],
        ),
        CheckConstraint(
            "tenant_id = 'ariadne-operator-workspace:' || workspace_id::text"
        ),
        CheckConstraint("status IN ('open','explained','accepted','follow_up')"),
    )
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    review_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    tenant_id: Mapped[str] = mapped_column(Text)
    result_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    item_id: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Text)
    reason: Mapped[str] = mapped_column(Text)
    note: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class ClosePackage(Base):
    __tablename__ = "ariadne_close_package"
    __table_args__ = (
        ForeignKeyConstraint(
            ["review_id", "workspace_id"],
            ["ariadne_close_review.id", "ariadne_close_review.workspace_id"],
        ),
        ForeignKeyConstraint(
            ["result_id", "tenant_id"],
            ["ariadne_result.id", "ariadne_result.tenant_id"],
        ),
        CheckConstraint(
            "tenant_id = 'ariadne-operator-workspace:' || workspace_id::text"
        ),
    )
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    review_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    tenant_id: Mapped[str] = mapped_column(Text)
    result_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    manifest: Mapped[dict] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
