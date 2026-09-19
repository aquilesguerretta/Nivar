"""Ariadne Core v0 service layer (NIV-46).

This module proves one narrow invariant: current private state can advance
while a historical model run remains bound to the exact evidence, state,
assumptions, scenario, model version, and execution configuration it used.

Functions flush but do not commit.  The caller owns the transaction, matching
the repository's existing service convention.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session, aliased

from app.db.models.ariadne_core import (
    ASSUMPTION_ORIGINS,
    AriadneAssumptionSet,
    AriadneAssumptionSetVersion,
    AriadneEvidenceRef,
    AriadneModelDefinition,
    AriadneModelRun,
    AriadneModelVersion,
    AriadnePrivateObject,
    AriadnePrivateStateVersion,
    AriadneResult,
    AriadneScenario,
    AriadneStateEvidence,
)


DETERMINISTIC_SCALAR_MODEL = "deterministic_scalar_model"
DETERMINISTIC_SCALAR_IMPLEMENTATION = "ariadne.deterministic_scalar.multiply.v1"
DETERMINISTIC_SCALAR_CONFIGURATION = {"arithmetic": "integer"}


class TenantScopeError(LookupError):
    """Raised when an entity cannot be resolved inside the supplied tenant."""


@dataclass(frozen=True)
class ExecutedRun:
    model_run: AriadneModelRun
    result: AriadneResult


@dataclass(frozen=True)
class AriadneLineage:
    result: AriadneResult
    model_run: AriadneModelRun
    model_version: AriadneModelVersion
    model_definition: AriadneModelDefinition
    scenario: AriadneScenario
    assumption_set_version: AriadneAssumptionSetVersion
    assumption_set: AriadneAssumptionSet
    state_version: AriadnePrivateStateVersion
    private_object: AriadnePrivateObject
    evidence_refs: tuple[AriadneEvidenceRef, ...]


@dataclass(frozen=True)
class ReplayResult:
    result_id: uuid.UUID
    stored_payload: dict[str, Any]
    replayed_payload: dict[str, Any]
    matches: bool


def _require_text(value: str, field: str) -> str:
    normalized = value.strip()
    if not normalized:
        raise ValueError(f"{field} must not be empty")
    return normalized


def _tenant_row(
    session: Session,
    model: type,
    row_id: uuid.UUID,
    tenant_id: str,
    label: str,
):
    row = session.execute(
        select(model).where(model.id == row_id, model.tenant_id == tenant_id)
    ).scalar_one_or_none()
    if row is None:
        raise TenantScopeError(f"{label} {row_id} is not available in tenant {tenant_id!r}")
    return row


def create_private_object(
    session: Session, *, tenant_id: str, object_type: str
) -> AriadnePrivateObject:
    private_object = AriadnePrivateObject(
        tenant_id=_require_text(tenant_id, "tenant_id"),
        object_type=_require_text(object_type, "object_type"),
    )
    session.add(private_object)
    session.flush()
    return private_object


def create_evidence_ref(
    session: Session,
    *,
    tenant_id: str,
    source_artifact_id: str,
    source_version: str,
    locator: str,
    observed_at: datetime | None = None,
    transform_ref: str | None = None,
) -> AriadneEvidenceRef:
    evidence = AriadneEvidenceRef(
        tenant_id=_require_text(tenant_id, "tenant_id"),
        source_artifact_id=_require_text(source_artifact_id, "source_artifact_id"),
        source_version=_require_text(source_version, "source_version"),
        locator=_require_text(locator, "locator"),
        observed_at=observed_at,
        transform_ref=transform_ref,
    )
    session.add(evidence)
    session.flush()
    return evidence


def _locked_private_object(
    session: Session, *, tenant_id: str, object_id: uuid.UUID
) -> AriadnePrivateObject:
    private_object = session.execute(
        select(AriadnePrivateObject)
        .where(
            AriadnePrivateObject.id == object_id,
            AriadnePrivateObject.tenant_id == tenant_id,
        )
        .with_for_update()
    ).scalar_one_or_none()
    if private_object is None:
        raise TenantScopeError(
            f"private object {object_id} is not available in tenant {tenant_id!r}"
        )
    return private_object


def get_current_state_version(
    session: Session, *, tenant_id: str, object_id: uuid.UUID
) -> AriadnePrivateStateVersion | None:
    """Resolve the tenant/object lineage head, never by timestamp ordering."""
    _tenant_row(session, AriadnePrivateObject, object_id, tenant_id, "private object")
    successor = aliased(AriadnePrivateStateVersion)
    has_successor = (
        select(successor.id)
        .where(
            successor.previous_version_id == AriadnePrivateStateVersion.id,
            successor.object_id == AriadnePrivateStateVersion.object_id,
            successor.tenant_id == AriadnePrivateStateVersion.tenant_id,
        )
        .exists()
    )
    return session.execute(
        select(AriadnePrivateStateVersion).where(
            AriadnePrivateStateVersion.tenant_id == tenant_id,
            AriadnePrivateStateVersion.object_id == object_id,
            ~has_successor,
        )
    ).scalar_one_or_none()


def create_state_version(
    session: Session,
    *,
    tenant_id: str,
    object_id: uuid.UUID,
    payload: dict[str, Any],
    evidence_ref_ids: Iterable[uuid.UUID],
    valid_from: datetime | None = None,
    valid_to: datetime | None = None,
) -> AriadnePrivateStateVersion:
    """Append a new state version and bind one or more same-tenant evidence refs."""
    if not isinstance(payload, dict):
        raise TypeError("payload must be an object")
    evidence_ids = tuple(dict.fromkeys(evidence_ref_ids))
    if not evidence_ids:
        raise ValueError("a private state version requires at least one evidence reference")
    if valid_from is not None and valid_to is not None and valid_from > valid_to:
        raise ValueError("valid_from must be before or equal to valid_to")

    _locked_private_object(session, tenant_id=tenant_id, object_id=object_id)
    current = get_current_state_version(session, tenant_id=tenant_id, object_id=object_id)
    evidence = tuple(
        _tenant_row(session, AriadneEvidenceRef, evidence_id, tenant_id, "evidence ref")
        for evidence_id in evidence_ids
    )
    state = AriadnePrivateStateVersion(
        tenant_id=tenant_id,
        object_id=object_id,
        version=1 if current is None else current.version + 1,
        payload=payload,
        valid_from=valid_from,
        valid_to=valid_to,
        previous_version_id=None if current is None else current.id,
    )
    session.add(state)
    session.flush()
    session.add_all(
        AriadneStateEvidence(
            state_version_id=state.id,
            evidence_ref_id=evidence_ref.id,
            tenant_id=tenant_id,
        )
        for evidence_ref in evidence
    )
    session.flush()
    return state


def create_assumption_set(
    session: Session, *, tenant_id: str, name: str
) -> AriadneAssumptionSet:
    assumption_set = AriadneAssumptionSet(
        tenant_id=_require_text(tenant_id, "tenant_id"),
        name=_require_text(name, "name"),
    )
    session.add(assumption_set)
    session.flush()
    return assumption_set


def create_assumption_set_version(
    session: Session,
    *,
    tenant_id: str,
    assumption_set_id: uuid.UUID,
    values: dict[str, Any],
    origin: str,
    value_schema: dict[str, Any] | None = None,
) -> AriadneAssumptionSetVersion:
    if not isinstance(values, dict):
        raise TypeError("values must be an object")
    if origin not in ASSUMPTION_ORIGINS:
        raise ValueError(f"origin must be one of {ASSUMPTION_ORIGINS}")
    assumption_set = session.execute(
        select(AriadneAssumptionSet)
        .where(
            AriadneAssumptionSet.id == assumption_set_id,
            AriadneAssumptionSet.tenant_id == tenant_id,
        )
        .with_for_update()
    ).scalar_one_or_none()
    if assumption_set is None:
        raise TenantScopeError(
            f"assumption set {assumption_set_id} is not available in tenant {tenant_id!r}"
        )
    successor = aliased(AriadneAssumptionSetVersion)
    current = session.execute(
        select(AriadneAssumptionSetVersion).where(
            AriadneAssumptionSetVersion.tenant_id == tenant_id,
            AriadneAssumptionSetVersion.assumption_set_id == assumption_set_id,
            ~select(successor.id)
            .where(
                successor.previous_version_id == AriadneAssumptionSetVersion.id,
                successor.assumption_set_id == AriadneAssumptionSetVersion.assumption_set_id,
                successor.tenant_id == AriadneAssumptionSetVersion.tenant_id,
            )
            .exists(),
        )
    ).scalar_one_or_none()
    version = AriadneAssumptionSetVersion(
        tenant_id=tenant_id,
        assumption_set_id=assumption_set_id,
        version=1 if current is None else current.version + 1,
        values=values,
        value_schema=value_schema or {},
        origin=origin,
        previous_version_id=None if current is None else current.id,
    )
    session.add(version)
    session.flush()
    return version


def create_model_definition(
    session: Session, *, tenant_id: str, name: str
) -> AriadneModelDefinition:
    definition = AriadneModelDefinition(
        tenant_id=_require_text(tenant_id, "tenant_id"),
        name=_require_text(name, "name"),
    )
    session.add(definition)
    session.flush()
    return definition


def create_model_version(
    session: Session,
    *,
    tenant_id: str,
    model_definition_id: uuid.UUID,
    semantic_version: str,
    implementation_identity: str,
    input_contract: dict[str, Any],
    output_contract: dict[str, Any],
) -> AriadneModelVersion:
    _tenant_row(
        session,
        AriadneModelDefinition,
        model_definition_id,
        tenant_id,
        "model definition",
    )
    version = AriadneModelVersion(
        tenant_id=tenant_id,
        model_definition_id=model_definition_id,
        semantic_version=_require_text(semantic_version, "semantic_version"),
        implementation_identity=_require_text(
            implementation_identity, "implementation_identity"
        ),
        input_contract=input_contract,
        output_contract=output_contract,
    )
    session.add(version)
    session.flush()
    return version


def create_scenario(
    session: Session,
    *,
    tenant_id: str,
    name: str,
    state_version_id: uuid.UUID,
    assumption_set_version_id: uuid.UUID,
    hypothetical_state: dict[str, Any] | None = None,
) -> AriadneScenario:
    _tenant_row(
        session, AriadnePrivateStateVersion, state_version_id, tenant_id, "state version"
    )
    _tenant_row(
        session,
        AriadneAssumptionSetVersion,
        assumption_set_version_id,
        tenant_id,
        "assumption-set version",
    )
    if hypothetical_state is not None and not isinstance(hypothetical_state, dict):
        raise TypeError("hypothetical_state must be an object")
    scenario = AriadneScenario(
        tenant_id=tenant_id,
        name=_require_text(name, "name"),
        state_version_id=state_version_id,
        assumption_set_version_id=assumption_set_version_id,
        hypothetical_state=hypothetical_state or {},
    )
    session.add(scenario)
    session.flush()
    return scenario


def execute_deterministic_scalar(
    *,
    state_payload: dict[str, Any],
    assumption_values: dict[str, Any],
    execution_configuration: dict[str, Any],
) -> dict[str, int]:
    """Pure domain-neutral v1 implementation: integer state value × multiplier."""
    if execution_configuration != DETERMINISTIC_SCALAR_CONFIGURATION:
        raise ValueError(
            "deterministic scalar v1 requires execution configuration "
            f"{DETERMINISTIC_SCALAR_CONFIGURATION!r}"
        )
    value = state_payload.get("value")
    multiplier = assumption_values.get("multiplier")
    if isinstance(value, bool) or not isinstance(value, int):
        raise ValueError("state payload field 'value' must be an integer")
    if isinstance(multiplier, bool) or not isinstance(multiplier, int):
        raise ValueError("assumption field 'multiplier' must be an integer")
    return {"value": value * multiplier}


def _execute_model_version(
    model_definition: AriadneModelDefinition,
    model_version: AriadneModelVersion,
    state_version: AriadnePrivateStateVersion,
    assumption_version: AriadneAssumptionSetVersion,
    configuration: dict[str, Any],
) -> dict[str, Any]:
    if (
        model_definition.name != DETERMINISTIC_SCALAR_MODEL
        or model_version.implementation_identity != DETERMINISTIC_SCALAR_IMPLEMENTATION
    ):
        raise ValueError(
            "no registered deterministic executor for model definition/version "
            f"{model_definition.name!r}/{model_version.implementation_identity!r}"
        )
    return execute_deterministic_scalar(
        state_payload=state_version.payload,
        assumption_values=assumption_version.values,
        execution_configuration=configuration,
    )


def execute_scenario(
    session: Session,
    *,
    tenant_id: str,
    scenario_id: uuid.UUID,
    model_version_id: uuid.UUID,
    execution_configuration: dict[str, Any] | None = None,
) -> ExecutedRun:
    """Execute exact scenario/model versions and persist an immutable run/result."""
    scenario = _tenant_row(session, AriadneScenario, scenario_id, tenant_id, "scenario")
    model_version = _tenant_row(
        session, AriadneModelVersion, model_version_id, tenant_id, "model version"
    )
    model_definition = _tenant_row(
        session,
        AriadneModelDefinition,
        model_version.model_definition_id,
        tenant_id,
        "model definition",
    )
    state_version = _tenant_row(
        session,
        AriadnePrivateStateVersion,
        scenario.state_version_id,
        tenant_id,
        "state version",
    )
    assumption_version = _tenant_row(
        session,
        AriadneAssumptionSetVersion,
        scenario.assumption_set_version_id,
        tenant_id,
        "assumption-set version",
    )
    configuration = (
        dict(DETERMINISTIC_SCALAR_CONFIGURATION)
        if execution_configuration is None
        else dict(execution_configuration)
    )
    payload = _execute_model_version(
        model_definition,
        model_version,
        state_version,
        assumption_version,
        configuration,
    )
    started_at = datetime.now(timezone.utc)
    produced_at = datetime.now(timezone.utc)
    model_run = AriadneModelRun(
        tenant_id=tenant_id,
        model_version_id=model_version.id,
        scenario_id=scenario.id,
        state_version_id=state_version.id,
        assumption_set_version_id=assumption_version.id,
        execution_configuration=configuration,
        started_at=started_at,
        produced_at=produced_at,
    )
    session.add(model_run)
    session.flush()
    result = AriadneResult(
        tenant_id=tenant_id,
        model_run_id=model_run.id,
        result_key="scalar_result",
        payload=payload,
        unit=None,
        produced_at=produced_at,
    )
    session.add(result)
    session.flush()
    return ExecutedRun(model_run=model_run, result=result)


def reconstruct_result_lineage(
    session: Session, *, tenant_id: str, result_id: uuid.UUID
) -> AriadneLineage:
    """Start from one result ID and resolve its exact stored historical chain."""
    result = _tenant_row(session, AriadneResult, result_id, tenant_id, "result")
    model_run = _tenant_row(
        session, AriadneModelRun, result.model_run_id, tenant_id, "model run"
    )
    model_version = _tenant_row(
        session,
        AriadneModelVersion,
        model_run.model_version_id,
        tenant_id,
        "model version",
    )
    model_definition = _tenant_row(
        session,
        AriadneModelDefinition,
        model_version.model_definition_id,
        tenant_id,
        "model definition",
    )
    scenario = _tenant_row(
        session, AriadneScenario, model_run.scenario_id, tenant_id, "scenario"
    )
    if (
        scenario.state_version_id != model_run.state_version_id
        or scenario.assumption_set_version_id != model_run.assumption_set_version_id
    ):
        raise RuntimeError("stored model-run manifest disagrees with its scenario binding")
    state_version = _tenant_row(
        session,
        AriadnePrivateStateVersion,
        model_run.state_version_id,
        tenant_id,
        "state version",
    )
    private_object = _tenant_row(
        session,
        AriadnePrivateObject,
        state_version.object_id,
        tenant_id,
        "private object",
    )
    assumption_version = _tenant_row(
        session,
        AriadneAssumptionSetVersion,
        model_run.assumption_set_version_id,
        tenant_id,
        "assumption-set version",
    )
    assumption_set = _tenant_row(
        session,
        AriadneAssumptionSet,
        assumption_version.assumption_set_id,
        tenant_id,
        "assumption set",
    )
    evidence_refs = tuple(
        session.execute(
            select(AriadneEvidenceRef)
            .join(
                AriadneStateEvidence,
                AriadneStateEvidence.evidence_ref_id == AriadneEvidenceRef.id,
            )
            .where(
                AriadneStateEvidence.state_version_id == state_version.id,
                AriadneStateEvidence.tenant_id == tenant_id,
                AriadneEvidenceRef.tenant_id == tenant_id,
            )
            .order_by(AriadneEvidenceRef.id)
        ).scalars()
    )
    if not evidence_refs:
        raise RuntimeError(f"state version {state_version.id} has no evidence refs")
    return AriadneLineage(
        result=result,
        model_run=model_run,
        model_version=model_version,
        model_definition=model_definition,
        scenario=scenario,
        assumption_set_version=assumption_version,
        assumption_set=assumption_set,
        state_version=state_version,
        private_object=private_object,
        evidence_refs=evidence_refs,
    )


def replay_result(
    session: Session, *, tenant_id: str, result_id: uuid.UUID
) -> ReplayResult:
    """Re-execute the stored historical manifest; never resolve current versions."""
    lineage = reconstruct_result_lineage(session, tenant_id=tenant_id, result_id=result_id)
    replayed = _execute_model_version(
        lineage.model_definition,
        lineage.model_version,
        lineage.state_version,
        lineage.assumption_set_version,
        lineage.model_run.execution_configuration,
    )
    return ReplayResult(
        result_id=lineage.result.id,
        stored_payload=lineage.result.payload,
        replayed_payload=replayed,
        matches=replayed == lineage.result.payload,
    )


__all__ = [
    "AriadneLineage",
    "DETERMINISTIC_SCALAR_CONFIGURATION",
    "DETERMINISTIC_SCALAR_IMPLEMENTATION",
    "DETERMINISTIC_SCALAR_MODEL",
    "ExecutedRun",
    "ReplayResult",
    "TenantScopeError",
    "create_assumption_set",
    "create_assumption_set_version",
    "create_evidence_ref",
    "create_model_definition",
    "create_model_version",
    "create_private_object",
    "create_scenario",
    "create_state_version",
    "execute_deterministic_scalar",
    "execute_scenario",
    "get_current_state_version",
    "reconstruct_result_lineage",
    "replay_result",
]
