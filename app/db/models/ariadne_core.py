"""Relational persistence primitives for Ariadne Core v0 (NIV-46).

The schema deliberately separates stable identities from immutable versions:
private objects from state versions, assumption sets from assumption versions,
and model definitions from executable model versions.  Scenarios and model
runs bind exact version IDs; they never resolve "latest" while executing or
reconstructing a historical result.

Every private reference carries ``tenant_id``.  Composite foreign keys make
tenant isolation a database invariant as well as a service-layer check.  The
Alembic migration installs append-only triggers for every historical record.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKeyConstraint,
    Index,
    Integer,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


ASSUMPTION_ORIGINS: tuple[str, ...] = ("human_defined", "rule", "other")


class AriadnePrivateObject(Base):
    """Stable tenant-scoped identity for a private organizational object."""

    __tablename__ = "ariadne_private_object"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_object_id_tenant_key"),
        CheckConstraint("length(tenant_id) > 0", name="ariadne_object_tenant_check"),
        CheckConstraint("length(object_type) > 0", name="ariadne_object_type_check"),
        Index("ariadne_object_tenant_type_idx", "tenant_id", "object_type"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    object_type: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AriadneEvidenceRef(Base):
    """Tenant-scoped pointer to source evidence, without copying source content."""

    __tablename__ = "ariadne_evidence_ref"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_evidence_id_tenant_key"),
        CheckConstraint("length(tenant_id) > 0", name="ariadne_evidence_tenant_check"),
        CheckConstraint(
            "length(source_artifact_id) > 0", name="ariadne_evidence_source_check"
        ),
        CheckConstraint("length(source_version) > 0", name="ariadne_evidence_version_check"),
        CheckConstraint("length(locator) > 0", name="ariadne_evidence_locator_check"),
        Index("ariadne_evidence_tenant_source_idx", "tenant_id", "source_artifact_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    source_artifact_id: Mapped[str] = mapped_column(Text, nullable=False)
    source_version: Mapped[str] = mapped_column(Text, nullable=False)
    locator: Mapped[str] = mapped_column(Text, nullable=False)
    observed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    transform_ref: Mapped[str | None] = mapped_column(Text, nullable=True)


class AriadnePrivateStateVersion(Base):
    """One immutable state version in a private object's linear history."""

    __tablename__ = "ariadne_private_state_version"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_state_id_tenant_key"),
        UniqueConstraint(
            "id", "object_id", "tenant_id", name="ariadne_state_id_object_tenant_key"
        ),
        UniqueConstraint("object_id", "version", name="ariadne_state_object_version_key"),
        UniqueConstraint("previous_version_id", name="ariadne_state_previous_version_key"),
        ForeignKeyConstraint(
            ["object_id", "tenant_id"],
            ["ariadne_private_object.id", "ariadne_private_object.tenant_id"],
            name="ariadne_state_object_tenant_fkey",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["previous_version_id", "object_id", "tenant_id"],
            [
                "ariadne_private_state_version.id",
                "ariadne_private_state_version.object_id",
                "ariadne_private_state_version.tenant_id",
            ],
            name="ariadne_state_previous_object_tenant_fkey",
            ondelete="RESTRICT",
        ),
        CheckConstraint("version > 0", name="ariadne_state_version_check"),
        CheckConstraint(
            "jsonb_typeof(payload) = 'object'", name="ariadne_state_payload_object_check"
        ),
        CheckConstraint(
            "valid_from IS NULL OR valid_to IS NULL OR valid_from <= valid_to",
            name="ariadne_state_valid_time_check",
        ),
        Index(
            "ariadne_state_one_root_per_object_idx",
            "object_id",
            unique=True,
            postgresql_where=text("previous_version_id IS NULL"),
        ),
        Index("ariadne_state_tenant_object_idx", "tenant_id", "object_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    object_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    valid_from: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    valid_to: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    previous_version_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True
    )


class AriadneStateEvidence(Base):
    """Many-to-many binding between state versions and their evidence refs."""

    __tablename__ = "ariadne_state_evidence"
    __table_args__ = (
        ForeignKeyConstraint(
            ["state_version_id", "tenant_id"],
            ["ariadne_private_state_version.id", "ariadne_private_state_version.tenant_id"],
            name="ariadne_state_evidence_state_tenant_fkey",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["evidence_ref_id", "tenant_id"],
            ["ariadne_evidence_ref.id", "ariadne_evidence_ref.tenant_id"],
            name="ariadne_state_evidence_ref_tenant_fkey",
            ondelete="RESTRICT",
        ),
        Index("ariadne_state_evidence_tenant_idx", "tenant_id"),
    )

    state_version_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True
    )
    evidence_ref_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AriadneAssumptionSet(Base):
    """Stable identity for a tenant's named group of assumptions."""

    __tablename__ = "ariadne_assumption_set"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_assumption_set_id_tenant_key"),
        UniqueConstraint("tenant_id", "name", name="ariadne_assumption_set_tenant_name_key"),
        CheckConstraint("length(tenant_id) > 0", name="ariadne_assumption_set_tenant_check"),
        CheckConstraint("length(name) > 0", name="ariadne_assumption_set_name_check"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AriadneAssumptionSetVersion(Base):
    """Immutable values and origin metadata for an assumption-set version."""

    __tablename__ = "ariadne_assumption_set_version"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_assumption_version_id_tenant_key"),
        UniqueConstraint(
            "id",
            "assumption_set_id",
            "tenant_id",
            name="ariadne_assumption_version_id_set_tenant_key",
        ),
        UniqueConstraint(
            "assumption_set_id", "version", name="ariadne_assumption_set_version_key"
        ),
        UniqueConstraint(
            "previous_version_id", name="ariadne_assumption_previous_version_key"
        ),
        ForeignKeyConstraint(
            ["assumption_set_id", "tenant_id"],
            ["ariadne_assumption_set.id", "ariadne_assumption_set.tenant_id"],
            name="ariadne_assumption_version_set_tenant_fkey",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["previous_version_id", "assumption_set_id", "tenant_id"],
            [
                "ariadne_assumption_set_version.id",
                "ariadne_assumption_set_version.assumption_set_id",
                "ariadne_assumption_set_version.tenant_id",
            ],
            name="ariadne_assumption_previous_set_tenant_fkey",
            ondelete="RESTRICT",
        ),
        CheckConstraint("version > 0", name="ariadne_assumption_version_number_check"),
        CheckConstraint(
            "jsonb_typeof(values) = 'object'", name="ariadne_assumption_values_object_check"
        ),
        CheckConstraint(
            "jsonb_typeof(value_schema) = 'object'",
            name="ariadne_assumption_schema_object_check",
        ),
        CheckConstraint(
            "origin IN ('human_defined', 'rule', 'other')",
            name="ariadne_assumption_origin_check",
        ),
        Index(
            "ariadne_assumption_one_root_per_set_idx",
            "assumption_set_id",
            unique=True,
            postgresql_where=text("previous_version_id IS NULL"),
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    assumption_set_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    values: Mapped[dict] = mapped_column(JSONB, nullable=False)
    value_schema: Mapped[dict] = mapped_column(
        JSONB, nullable=False, server_default=text("'{}'::jsonb")
    )
    origin: Mapped[str] = mapped_column(Text, nullable=False)
    previous_version_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AriadneModelDefinition(Base):
    """Stable tenant-scoped identity for a deterministic model."""

    __tablename__ = "ariadne_model_definition"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_model_definition_id_tenant_key"),
        UniqueConstraint("tenant_id", "name", name="ariadne_model_definition_tenant_name_key"),
        CheckConstraint("length(tenant_id) > 0", name="ariadne_model_definition_tenant_check"),
        CheckConstraint("length(name) > 0", name="ariadne_model_definition_name_check"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AriadneModelVersion(Base):
    """Immutable executable identity and contracts for one model version."""

    __tablename__ = "ariadne_model_version"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_model_version_id_tenant_key"),
        UniqueConstraint(
            "model_definition_id",
            "semantic_version",
            name="ariadne_model_definition_semantic_version_key",
        ),
        ForeignKeyConstraint(
            ["model_definition_id", "tenant_id"],
            ["ariadne_model_definition.id", "ariadne_model_definition.tenant_id"],
            name="ariadne_model_version_definition_tenant_fkey",
            ondelete="RESTRICT",
        ),
        CheckConstraint(
            "length(semantic_version) > 0", name="ariadne_model_semantic_version_check"
        ),
        CheckConstraint(
            "length(implementation_identity) > 0",
            name="ariadne_model_implementation_identity_check",
        ),
        CheckConstraint(
            "jsonb_typeof(input_contract) = 'object'",
            name="ariadne_model_input_contract_object_check",
        ),
        CheckConstraint(
            "jsonb_typeof(output_contract) = 'object'",
            name="ariadne_model_output_contract_object_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    model_definition_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    semantic_version: Mapped[str] = mapped_column(Text, nullable=False)
    implementation_identity: Mapped[str] = mapped_column(Text, nullable=False)
    input_contract: Mapped[dict] = mapped_column(JSONB, nullable=False)
    output_contract: Mapped[dict] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AriadneScenario(Base):
    """Immutable analysis binding: observed state, assumptions, and hypotheses."""

    __tablename__ = "ariadne_scenario"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_scenario_id_tenant_key"),
        UniqueConstraint(
            "id",
            "tenant_id",
            "state_version_id",
            "assumption_set_version_id",
            name="ariadne_scenario_manifest_key",
        ),
        ForeignKeyConstraint(
            ["state_version_id", "tenant_id"],
            ["ariadne_private_state_version.id", "ariadne_private_state_version.tenant_id"],
            name="ariadne_scenario_state_tenant_fkey",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            ["assumption_set_version_id", "tenant_id"],
            ["ariadne_assumption_set_version.id", "ariadne_assumption_set_version.tenant_id"],
            name="ariadne_scenario_assumption_tenant_fkey",
            ondelete="RESTRICT",
        ),
        CheckConstraint(
            "jsonb_typeof(hypothetical_state) = 'object'",
            name="ariadne_scenario_hypothetical_object_check",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    state_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    assumption_set_version_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False
    )
    hypothetical_state: Mapped[dict] = mapped_column(
        JSONB, nullable=False, server_default=text("'{}'::jsonb")
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AriadneModelRun(Base):
    """Immutable execution manifest bound to exact historical versions."""

    __tablename__ = "ariadne_model_run"
    __table_args__ = (
        UniqueConstraint("id", "tenant_id", name="ariadne_model_run_id_tenant_key"),
        ForeignKeyConstraint(
            ["model_version_id", "tenant_id"],
            ["ariadne_model_version.id", "ariadne_model_version.tenant_id"],
            name="ariadne_model_run_model_tenant_fkey",
            ondelete="RESTRICT",
        ),
        ForeignKeyConstraint(
            [
                "scenario_id",
                "tenant_id",
                "state_version_id",
                "assumption_set_version_id",
            ],
            [
                "ariadne_scenario.id",
                "ariadne_scenario.tenant_id",
                "ariadne_scenario.state_version_id",
                "ariadne_scenario.assumption_set_version_id",
            ],
            name="ariadne_model_run_scenario_manifest_fkey",
            ondelete="RESTRICT",
        ),
        CheckConstraint(
            "jsonb_typeof(execution_configuration) = 'object'",
            name="ariadne_model_run_config_object_check",
        ),
        CheckConstraint("produced_at >= started_at", name="ariadne_model_run_time_check"),
        Index("ariadne_model_run_tenant_scenario_idx", "tenant_id", "scenario_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    model_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    scenario_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    state_version_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    assumption_set_version_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False
    )
    execution_configuration: Mapped[dict] = mapped_column(JSONB, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    produced_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class AriadneResult(Base):
    """Immutable model output belonging to exactly one immutable run."""

    __tablename__ = "ariadne_result"
    __table_args__ = (
        ForeignKeyConstraint(
            ["model_run_id", "tenant_id"],
            ["ariadne_model_run.id", "ariadne_model_run.tenant_id"],
            name="ariadne_result_run_tenant_fkey",
            ondelete="RESTRICT",
        ),
        UniqueConstraint("model_run_id", "result_key", name="ariadne_result_run_key"),
        CheckConstraint("length(result_key) > 0", name="ariadne_result_key_check"),
        CheckConstraint(
            "jsonb_typeof(payload) = 'object'", name="ariadne_result_payload_object_check"
        ),
        Index("ariadne_result_tenant_run_idx", "tenant_id", "model_run_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tenant_id: Mapped[str] = mapped_column(Text, nullable=False)
    model_run_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    result_key: Mapped[str] = mapped_column(Text, nullable=False)
    payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    unit: Mapped[str | None] = mapped_column(Text, nullable=True)
    produced_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


__all__ = [
    "ASSUMPTION_ORIGINS",
    "AriadneAssumptionSet",
    "AriadneAssumptionSetVersion",
    "AriadneEvidenceRef",
    "AriadneModelDefinition",
    "AriadneModelRun",
    "AriadneModelVersion",
    "AriadnePrivateObject",
    "AriadnePrivateStateVersion",
    "AriadneResult",
    "AriadneScenario",
    "AriadneStateEvidence",
]
