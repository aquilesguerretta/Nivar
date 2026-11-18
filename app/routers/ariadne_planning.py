"""Small development-only routes using existing session and ownership checks."""

import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, Header, Response
from pydantic import Field, StrictBool
from app.routers.ariadne_close import (
    BoundedCloseRoute,
    Strict,
    context,
    _error,
    _write,
    require_development,
)
from app.db.session import get_db
from app.services.auth_service import get_current_user
from app.services import (
    ariadne_close as close,
    ariadne_planning as service,
    ariadne_core as core,
)


def require_planning():
    require_development()
    if os.environ.get("ARIADNE_PLAN_DEV") != "1":
        raise HTTPException(404, "Planejamento experimental desativado")


class PlanningRoute(BoundedCloseRoute):
    def get_route_handler(self):
        handler = super().get_route_handler()

        async def gated(request):
            require_planning()
            return await handler(request)

        return gated


router = APIRouter(
    prefix="/api/operator/ariadne/workspaces/{workspace_id}/close/reviews/{review_id}/calculations/{baseline_id}/planning",
    tags=["ariadne-planning-experimental"],
    dependencies=[Depends(require_planning)],
    route_class=PlanningRoute,
)


class Assumptions(Strict):
    candidateKw: str = Field(pattern=r"^\d+(?:\.\d{1,6})?$", max_length=16)
    normalRegime: StrictBool = False
    tariffApplicability: StrictBool = False


class Save(Assumptions):
    name: str = Field(min_length=1, max_length=160)
    acknowledgeHistoricalBaseline: StrictBool = False


class Duplicate(Strict):
    name: str = Field(min_length=1, max_length=160)
    acknowledgeHistoricalBaseline: StrictBool = False


class Compare(Strict):
    resultIds: list[uuid.UUID] = Field(min_length=1, max_length=6)


def access(workspace_id, review_id, user, db):
    workspace = context(workspace_id, user, db)
    try:
        return workspace, close.review_row(db, workspace, review_id)
    except LookupError as exc:
        raise _error(exc) from exc


@router.get("")
def baseline(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    _, review = access(workspace_id, review_id, user, db)
    try:
        l = service.baseline(db, review, baseline_id)
        return service.preview(
            db,
            review,
            baseline_id,
            {
                "candidateKw": service.engine.actual_contract(l.state_version.payload),
                "normalRegime": False,
                "tariffApplicability": False,
            },
        )
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.post("/preview")
def preview(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    body: Assumptions,
    curve: bool = False,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    _, review = access(workspace_id, review_id, user, db)
    try:
        return service.preview(db, review, baseline_id, body.model_dump(), curve)
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.get("/scenarios")
def saved(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    _, review = access(workspace_id, review_id, user, db)
    try:
        return service.saved(db, review, baseline_id)
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.post("/scenarios", status_code=201)
def save(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    body: Save,
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    w, r = access(workspace_id, review_id, user, db)
    return _write(
        db,
        w,
        key,
        "planning-save",
        {
            "reviewId": str(review_id),
            "baselineId": str(baseline_id),
            **body.model_dump(),
        },
        lambda: service.save(db, r, baseline_id, body.model_dump()),
    )


@router.get("/scenarios/{result_id}")
def result(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    result_id: uuid.UUID,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    _, r = access(workspace_id, review_id, user, db)
    try:
        return service.result_payload(db, r, baseline_id, result_id)
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.post("/scenarios/{result_id}/duplicate", status_code=201)
def duplicate(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    result_id: uuid.UUID,
    body: Duplicate,
    key: uuid.UUID = Header(alias="Idempotency-Key"),
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    w, r = access(workspace_id, review_id, user, db)
    return _write(
        db,
        w,
        key,
        "planning-duplicate",
        {
            "reviewId": str(review_id),
            "baselineId": str(baseline_id),
            "parent": str(result_id),
            **body.model_dump(),
        },
        lambda: service.duplicate(db, r, baseline_id, result_id, body.model_dump()),
    )


@router.get("/scenarios/{result_id}/replay")
def replay(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    result_id: uuid.UUID,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    _, r = access(workspace_id, review_id, user, db)
    try:
        service.result_lineage(db, r, baseline_id, result_id)
        replayed = core.replay_result(db, tenant_id=r.tenant_id, result_id=result_id)
        return {"matches": replayed.matches, "output": replayed.replayed_payload}
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.post("/compare")
def compare(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    body: Compare,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    _, r = access(workspace_id, review_id, user, db)
    try:
        return [service.result_payload(db, r, baseline_id, id) for id in body.resultIds]
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc


@router.get("/scenarios/{result_id}/export")
def export(
    workspace_id: uuid.UUID,
    review_id: uuid.UUID,
    baseline_id: uuid.UUID,
    result_id: uuid.UUID,
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    _, r = access(workspace_id, review_id, user, db)
    try:
        payload = service.result_payload(db, r, baseline_id, result_id)
        # Immutable output includes source/version/locators, assumptions, policy and coverage.
        import json

        payload.pop("newerBaselineExists")
        return Response(
            json.dumps(payload, ensure_ascii=False, indent=2),
            media_type="application/json",
            headers={
                "Content-Disposition": 'attachment; filename="planning-scenario.json"',
                "Cache-Control": "no-store",
            },
        )
    except (ValueError, LookupError) as exc:
        raise _error(exc) from exc
