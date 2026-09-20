"""Internal, authenticated operator API for Ariadne Core v0."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException, Path, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.models.ariadne_core import (
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
from app.db.models.ariadne_operator import AriadneOperatorObjectPresentation
from app.db.models.user import User
from app.db.session import get_db
from app.services.ariadne_core import (
    TenantScopeError,
    create_assumption_set,
    create_assumption_set_version,
    create_evidence_ref,
    create_private_object,
    create_scenario,
    create_state_version,
    execute_scenario,
    get_current_state_version,
    reconstruct_result_lineage,
    replay_result,
)
from app.services.ariadne_operator import (
    WorkspaceNotFound,
    create_object_presentation,
    create_workspace,
    list_workspaces,
    provision_registered_model,
    require_operator,
    require_workspace,
    tenant_id_for,
)
from app.services.auth_service import get_current_user


router = APIRouter(prefix="/api/operator/ariadne", tags=["operator-ariadne"])


class StrictRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CreateWorkspaceRequest(StrictRequest):
    label: str = Field(min_length=1, max_length=160)
    synthetic: bool = False


class CreateEvidenceRequest(StrictRequest):
    source_artifact_id: str = Field(alias="sourceArtifactId", min_length=1, max_length=240)
    source_version: str = Field(alias="sourceVersion", min_length=1, max_length=120)
    locator: str = Field(min_length=1, max_length=500)
    observed_at: datetime | None = Field(default=None, alias="observedAt")
    transform_ref: str | None = Field(default=None, alias="transformRef", max_length=500)


class CreateObjectRequest(StrictRequest):
    object_type: str = Field(alias="objectType", min_length=1, max_length=160)
    display_label: str | None = Field(
        default=None, alias="displayLabel", min_length=1, max_length=160
    )


class CreateStateRequest(StrictRequest):
    payload: dict[str, Any]
    evidence_ref_ids: list[uuid.UUID] = Field(alias="evidenceRefIds", min_length=1)
    valid_from: datetime | None = Field(default=None, alias="validFrom")
    valid_to: datetime | None = Field(default=None, alias="validTo")


class CreateAssumptionSetRequest(StrictRequest):
    name: str = Field(min_length=1, max_length=160)


class CreateAssumptionVersionRequest(StrictRequest):
    values: dict[str, Any]
    origin: Literal["human_defined", "rule", "other"]
    value_schema: dict[str, Any] = Field(default_factory=dict, alias="valueSchema")


class CreateScenarioRequest(StrictRequest):
    name: str = Field(min_length=1, max_length=160)
    state_version_id: uuid.UUID = Field(alias="stateVersionId")
    assumption_set_version_id: uuid.UUID = Field(alias="assumptionSetVersionId")
    hypothetical_state: dict[str, Any] = Field(default_factory=dict, alias="hypotheticalState")


class EnableInternalTestModelRequest(StrictRequest):
    pass


class CreateRunRequest(StrictRequest):
    scenario_id: uuid.UUID = Field(alias="scenarioId")
    model_version_id: uuid.UUID = Field(alias="modelVersionId")


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


def _workspace_payload(workspace) -> dict[str, Any]:
    return {
        "id": str(workspace.id),
        "label": workspace.label,
        "synthetic": workspace.synthetic,
        "createdAt": _iso(workspace.created_at),
    }


def _authorized_context(
    workspace_id: uuid.UUID, user: User, db: Session
):
    require_operator(user)
    try:
        workspace = require_workspace(
            db, workspace_id=workspace_id, owner_user_id=user.id
        )
    except WorkspaceNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return workspace, tenant_id_for(workspace.id)


def _unprocessable(exc: Exception) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        detail=str(exc),
    )


def _conflict(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)


def _workspace_snapshot(db: Session, workspace, tenant_id: str) -> dict[str, Any]:
    evidence = list(
        db.execute(
            select(AriadneEvidenceRef)
            .where(AriadneEvidenceRef.tenant_id == tenant_id)
            .order_by(AriadneEvidenceRef.recorded_at, AriadneEvidenceRef.id)
        ).scalars()
    )
    objects = list(
        db.execute(
            select(AriadnePrivateObject)
            .where(AriadnePrivateObject.tenant_id == tenant_id)
            .order_by(AriadnePrivateObject.created_at, AriadnePrivateObject.id)
        ).scalars()
    )
    object_presentations = {
        row.object_id: row
        for row in db.execute(
            select(AriadneOperatorObjectPresentation).where(
                AriadneOperatorObjectPresentation.workspace_id == workspace.id
            )
        ).scalars()
    }
    states = list(
        db.execute(
            select(AriadnePrivateStateVersion)
            .where(AriadnePrivateStateVersion.tenant_id == tenant_id)
            .order_by(
                AriadnePrivateStateVersion.object_id,
                AriadnePrivateStateVersion.version,
            )
        ).scalars()
    )
    state_evidence_rows = list(
        db.execute(
            select(AriadneStateEvidence)
            .where(AriadneStateEvidence.tenant_id == tenant_id)
            .order_by(AriadneStateEvidence.created_at, AriadneStateEvidence.evidence_ref_id)
        ).scalars()
    )
    evidence_by_state: dict[uuid.UUID, list[str]] = {}
    for binding in state_evidence_rows:
        evidence_by_state.setdefault(binding.state_version_id, []).append(
            str(binding.evidence_ref_id)
        )

    assumption_sets = list(
        db.execute(
            select(AriadneAssumptionSet)
            .where(AriadneAssumptionSet.tenant_id == tenant_id)
            .order_by(AriadneAssumptionSet.created_at, AriadneAssumptionSet.id)
        ).scalars()
    )
    assumption_versions = list(
        db.execute(
            select(AriadneAssumptionSetVersion)
            .where(AriadneAssumptionSetVersion.tenant_id == tenant_id)
            .order_by(
                AriadneAssumptionSetVersion.assumption_set_id,
                AriadneAssumptionSetVersion.version,
            )
        ).scalars()
    )
    scenarios = list(
        db.execute(
            select(AriadneScenario)
            .where(AriadneScenario.tenant_id == tenant_id)
            .order_by(AriadneScenario.created_at, AriadneScenario.id)
        ).scalars()
    )
    definitions = list(
        db.execute(
            select(AriadneModelDefinition).where(
                AriadneModelDefinition.tenant_id == tenant_id
            )
        ).scalars()
    )
    definitions_by_id = {row.id: row for row in definitions}
    model_versions = list(
        db.execute(
            select(AriadneModelVersion)
            .where(AriadneModelVersion.tenant_id == tenant_id)
            .order_by(AriadneModelVersion.created_at, AriadneModelVersion.id)
        ).scalars()
    )
    runs = list(
        db.execute(
            select(AriadneModelRun)
            .where(AriadneModelRun.tenant_id == tenant_id)
            .order_by(AriadneModelRun.started_at, AriadneModelRun.id)
        ).scalars()
    )
    results = list(
        db.execute(
            select(AriadneResult)
            .where(AriadneResult.tenant_id == tenant_id)
            .order_by(AriadneResult.produced_at, AriadneResult.id)
        ).scalars()
    )
    current_by_object = {
        row.id: get_current_state_version(db, tenant_id=tenant_id, object_id=row.id)
        for row in objects
    }

    versions_by_set: dict[uuid.UUID, list[dict[str, Any]]] = {}
    for version in assumption_versions:
        versions_by_set.setdefault(version.assumption_set_id, []).append(
            {
                "id": str(version.id),
                "version": version.version,
                "values": version.values,
                "valueSchema": version.value_schema,
                "origin": version.origin,
                "previousVersionId": (
                    str(version.previous_version_id) if version.previous_version_id else None
                ),
                "createdAt": _iso(version.created_at),
            }
        )

    return {
        "workspace": _workspace_payload(workspace),
        "evidenceRefs": [
            {
                "id": str(row.id),
                "sourceArtifactId": row.source_artifact_id,
                "sourceVersion": row.source_version,
                "locator": row.locator,
                "observedAt": _iso(row.observed_at),
                "recordedAt": _iso(row.recorded_at),
                "transformRef": row.transform_ref,
            }
            for row in evidence
        ],
        "objects": [
            {
                "id": str(row.id),
                "objectType": row.object_type,
                "displayLabel": (
                    object_presentations[row.id].display_label
                    if row.id in object_presentations
                    else None
                ),
                "createdAt": _iso(row.created_at),
                "currentStateVersionId": (
                    str(current_by_object[row.id].id) if current_by_object[row.id] else None
                ),
            }
            for row in objects
        ],
        "stateVersions": [
            {
                "id": str(row.id),
                "objectId": str(row.object_id),
                "version": row.version,
                "payload": row.payload,
                "recordedAt": _iso(row.recorded_at),
                "validFrom": _iso(row.valid_from),
                "validTo": _iso(row.valid_to),
                "previousVersionId": (
                    str(row.previous_version_id) if row.previous_version_id else None
                ),
                "evidenceRefIds": evidence_by_state.get(row.id, []),
                "current": current_by_object.get(row.object_id) is not None
                and current_by_object[row.object_id].id == row.id,
            }
            for row in states
        ],
        "assumptionSets": [
            {
                "id": str(row.id),
                "name": row.name,
                "createdAt": _iso(row.created_at),
                "versions": versions_by_set.get(row.id, []),
            }
            for row in assumption_sets
        ],
        "scenarios": [
            {
                "id": str(row.id),
                "name": row.name,
                "stateVersionId": str(row.state_version_id),
                "assumptionSetVersionId": str(row.assumption_set_version_id),
                "hypotheticalState": row.hypothetical_state,
                "createdAt": _iso(row.created_at),
            }
            for row in scenarios
        ],
        "models": [
            {
                "id": str(row.id),
                "definitionId": str(row.model_definition_id),
                "name": definitions_by_id[row.model_definition_id].name,
                "semanticVersion": row.semantic_version,
                "implementationIdentity": row.implementation_identity,
                "inputContract": row.input_contract,
                "outputContract": row.output_contract,
                "createdAt": _iso(row.created_at),
            }
            for row in model_versions
        ],
        "runs": [
            {
                "id": str(row.id),
                "modelVersionId": str(row.model_version_id),
                "scenarioId": str(row.scenario_id),
                "stateVersionId": str(row.state_version_id),
                "assumptionSetVersionId": str(row.assumption_set_version_id),
                "executionConfiguration": row.execution_configuration,
                "startedAt": _iso(row.started_at),
                "producedAt": _iso(row.produced_at),
            }
            for row in runs
        ],
        "results": [
            {
                "id": str(row.id),
                "modelRunId": str(row.model_run_id),
                "resultKey": row.result_key,
                "payload": row.payload,
                "unit": row.unit,
                "producedAt": _iso(row.produced_at),
            }
            for row in results
        ],
    }


@router.get("/workspaces")
def get_workspaces(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    require_operator(user)
    return {"data": [_workspace_payload(row) for row in list_workspaces(db, owner_user_id=user.id)]}


@router.post("/workspaces", status_code=status.HTTP_201_CREATED)
def post_workspace(
    body: CreateWorkspaceRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_operator(user)
    try:
        workspace = create_workspace(
            db,
            owner_user_id=user.id,
            label=body.label,
            synthetic=body.synthetic,
        )
        db.commit()
        db.refresh(workspace)
    except (ValueError, RuntimeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return _workspace_payload(workspace)


@router.get("/workspaces/{workspace_id}")
def get_workspace(
    workspace_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace, tenant_id = _authorized_context(workspace_id, user, db)
    return _workspace_snapshot(db, workspace, tenant_id)


@router.post("/workspaces/{workspace_id}/evidence", status_code=201)
def post_evidence(
    body: CreateEvidenceRequest,
    workspace_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        row = create_evidence_ref(
            db,
            tenant_id=tenant_id,
            source_artifact_id=body.source_artifact_id,
            source_version=body.source_version,
            locator=body.locator,
            observed_at=body.observed_at,
            transform_ref=body.transform_ref,
        )
        db.commit()
        db.refresh(row)
    except (ValueError, TypeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return {"id": str(row.id)}


@router.post("/workspaces/{workspace_id}/objects", status_code=201)
def post_object(
    body: CreateObjectRequest,
    workspace_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workspace, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        row = create_private_object(db, tenant_id=tenant_id, object_type=body.object_type)
        if body.display_label is not None:
            create_object_presentation(
                db,
                workspace_id=workspace.id,
                object_id=row.id,
                display_label=body.display_label,
            )
        db.commit()
        db.refresh(row)
    except (ValueError, TypeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return {"id": str(row.id)}


@router.post("/workspaces/{workspace_id}/objects/{object_id}/states", status_code=201)
def post_state(
    body: CreateStateRequest,
    workspace_id: uuid.UUID = Path(...),
    object_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        row = create_state_version(
            db,
            tenant_id=tenant_id,
            object_id=object_id,
            payload=body.payload,
            evidence_ref_ids=body.evidence_ref_ids,
            valid_from=body.valid_from,
            valid_to=body.valid_to,
        )
        db.commit()
        db.refresh(row)
    except (TenantScopeError, ValueError, TypeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return {"id": str(row.id), "version": row.version}


@router.post("/workspaces/{workspace_id}/assumption-sets", status_code=201)
def post_assumption_set(
    body: CreateAssumptionSetRequest,
    workspace_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        row = create_assumption_set(db, tenant_id=tenant_id, name=body.name)
        db.commit()
        db.refresh(row)
    except IntegrityError as exc:
        db.rollback()
        raise _conflict(
            "assumption set already exists; refresh the workspace before retrying"
        ) from exc
    except (ValueError, TypeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return {"id": str(row.id)}


@router.post(
    "/workspaces/{workspace_id}/assumption-sets/{set_id}/versions", status_code=201
)
def post_assumption_version(
    body: CreateAssumptionVersionRequest,
    workspace_id: uuid.UUID = Path(...),
    set_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        row = create_assumption_set_version(
            db,
            tenant_id=tenant_id,
            assumption_set_id=set_id,
            values=body.values,
            origin=body.origin,
            value_schema=body.value_schema,
        )
        db.commit()
        db.refresh(row)
    except (TenantScopeError, ValueError, TypeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return {"id": str(row.id), "version": row.version}


@router.post("/workspaces/{workspace_id}/scenarios", status_code=201)
def post_scenario(
    body: CreateScenarioRequest,
    workspace_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        row = create_scenario(
            db,
            tenant_id=tenant_id,
            name=body.name,
            state_version_id=body.state_version_id,
            assumption_set_version_id=body.assumption_set_version_id,
            hypothetical_state=body.hypothetical_state,
        )
        db.commit()
        db.refresh(row)
    except (TenantScopeError, ValueError, TypeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return {"id": str(row.id)}


@router.get("/workspaces/{workspace_id}/models")
def get_models(
    workspace_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    rows = list(
        db.execute(
            select(AriadneModelVersion).where(AriadneModelVersion.tenant_id == tenant_id)
        ).scalars()
    )
    return {"data": [{"id": str(row.id), "semanticVersion": row.semantic_version} for row in rows]}


@router.post("/workspaces/{workspace_id}/models/internal-test", status_code=201)
def post_internal_test_model(
    body: EnableInternalTestModelRequest,
    workspace_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Enable the one server-approved, domain-neutral model idempotently."""
    del body
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        row = provision_registered_model(db, tenant_id=tenant_id)
        db.commit()
        db.refresh(row)
    except (RuntimeError, ValueError, TypeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return {
        "id": str(row.id),
        "semanticVersion": row.semantic_version,
    }


@router.post("/workspaces/{workspace_id}/runs", status_code=201)
def post_run(
    body: CreateRunRequest,
    workspace_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        executed = execute_scenario(
            db,
            tenant_id=tenant_id,
            scenario_id=body.scenario_id,
            model_version_id=body.model_version_id,
        )
        db.commit()
        db.refresh(executed.model_run)
        db.refresh(executed.result)
    except (TenantScopeError, ValueError, TypeError) as exc:
        db.rollback()
        raise _unprocessable(exc) from exc
    return {
        "runId": str(executed.model_run.id),
        "resultId": str(executed.result.id),
        "payload": executed.result.payload,
    }


@router.get("/workspaces/{workspace_id}/results/{result_id}/lineage")
def get_lineage(
    workspace_id: uuid.UUID = Path(...),
    result_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        lineage = reconstruct_result_lineage(db, tenant_id=tenant_id, result_id=result_id)
    except (TenantScopeError, RuntimeError) as exc:
        raise _unprocessable(exc) from exc
    return {
        "result": {"id": str(lineage.result.id), "payload": lineage.result.payload},
        "run": {
            "id": str(lineage.model_run.id),
            "executionConfiguration": lineage.model_run.execution_configuration,
        },
        "model": {
            "definitionId": str(lineage.model_definition.id),
            "versionId": str(lineage.model_version.id),
            "name": lineage.model_definition.name,
            "semanticVersion": lineage.model_version.semantic_version,
        },
        "scenario": {"id": str(lineage.scenario.id), "name": lineage.scenario.name},
        "assumptions": {
            "setId": str(lineage.assumption_set.id),
            "versionId": str(lineage.assumption_set_version.id),
            "name": lineage.assumption_set.name,
            "version": lineage.assumption_set_version.version,
            "values": lineage.assumption_set_version.values,
        },
        "state": {
            "id": str(lineage.state_version.id),
            "version": lineage.state_version.version,
            "payload": lineage.state_version.payload,
        },
        "object": {
            "id": str(lineage.private_object.id),
            "objectType": lineage.private_object.object_type,
        },
        "evidenceRefs": [
            {
                "id": str(row.id),
                "sourceArtifactId": row.source_artifact_id,
                "sourceVersion": row.source_version,
                "locator": row.locator,
            }
            for row in lineage.evidence_refs
        ],
    }


@router.post("/workspaces/{workspace_id}/results/{result_id}/replay")
def post_replay(
    workspace_id: uuid.UUID = Path(...),
    result_id: uuid.UUID = Path(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, tenant_id = _authorized_context(workspace_id, user, db)
    try:
        replayed = replay_result(db, tenant_id=tenant_id, result_id=result_id)
    except (TenantScopeError, RuntimeError, ValueError) as exc:
        raise _unprocessable(exc) from exc
    return {
        "resultId": str(replayed.result_id),
        "storedPayload": replayed.stored_payload,
        "replayedPayload": replayed.replayed_payload,
        "matches": replayed.matches,
    }
