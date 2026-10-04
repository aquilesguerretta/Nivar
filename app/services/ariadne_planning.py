"""Planning branches reference retained Core state; no second baseline store."""

import uuid
from decimal import Decimal, localcontext
from sqlalchemy import select
from app.db.models.ariadne_core import (
    AriadneModelDefinition,
    AriadneModelVersion,
    AriadneResult,
    AriadneModelRun,
    AriadneScenario,
)
from app.services import (
    ariadne_core as core,
    ariadne_close as close,
    ariadne_planning_engine as engine,
)


def baseline(db, review, result_id):
    lineage = close.result_lineage(db, review, result_id)
    engine.actual_contract(lineage.state_version.payload)
    return lineage


def stale(db, lineage):
    return (
        core.get_current_state_version(
            db, tenant_id=lineage.result.tenant_id, object_id=lineage.private_object.id
        ).id
        != lineage.state_version.id
    )


def calculate(lineage, assumptions):
    return engine.execute_planning(
        state_payload=lineage.state_version.payload,
        assumption_values=assumptions,
        execution_configuration=engine.POLICY,
    )


def preview(db, review, result_id, assumptions, curve=False):
    lineage = baseline(db, review, result_id)
    output = calculate(lineage, assumptions)
    points = []
    if curve:
        with localcontext() as ctx:
            ctx.prec = 48
            c = Decimal(output["baselineKw"])
            lo = max(Decimal(30), c - 60)
            hi = min(Decimal(100000), c + 60)
            for i in range(61):
                kw = (lo + (hi - lo) * i / 60).quantize(Decimal(".000001"))
                p = calculate(lineage, {**assumptions, "candidateKw": format(kw, "f")})
                points.append(
                    {
                        "candidateKw": format(kw, "f"),
                        "cost": p["cost"],
                        "covered": p["coverage"]["covered"],
                    }
                )
    supported = [p for p in points if p["cost"] is not None]
    return {
        "baselineId": str(result_id),
        "stateVersionId": str(lineage.state_version.id),
        "newerBaselineExists": stale(db, lineage),
        "output": output,
        "curve": points,
        "lowestExplored": (
            min(supported, key=lambda p: Decimal(p["cost"])) if supported else None
        ),
    }


def _model(db, tenant):
    definition = db.execute(
        select(AriadneModelDefinition).where(
            AriadneModelDefinition.tenant_id == tenant,
            AriadneModelDefinition.name == engine.MODEL,
        )
    ).scalar_one_or_none()
    if not definition:
        definition = core.create_model_definition(
            db, tenant_id=tenant, name=engine.MODEL
        )
    version = db.execute(
        select(AriadneModelVersion).where(
            AriadneModelVersion.model_definition_id == definition.id,
            AriadneModelVersion.semantic_version == engine.VERSION,
        )
    ).scalar_one_or_none()
    if not version:
        version = core.create_model_version(
            db,
            tenant_id=tenant,
            model_definition_id=definition.id,
            semantic_version=engine.VERSION,
            implementation_identity=engine.IMPLEMENTATION,
            input_contract=engine.INPUT_CONTRACT,
            output_contract=engine.OUTPUT_CONTRACT,
        )
    return version


def result_lineage(db, review, baseline_id, result_id):
    base = baseline(db, review, baseline_id)
    lineage = core.reconstruct_result_lineage(
        db, tenant_id=review.tenant_id, result_id=result_id
    )
    if (
        lineage.state_version.id != base.state_version.id
        or lineage.result.result_key != engine.MODEL
        or lineage.scenario.hypothetical_state.get("baselineId") != str(baseline_id)
        or lineage.scenario.hypothetical_state.get("reviewId") != str(review.id)
    ):
        raise LookupError("Cenário não pertence a este baseline privado")
    return lineage


def result_payload(db, review, baseline_id, result_id):
    l = result_lineage(db, review, baseline_id, result_id)
    return {
        "id": str(l.result.id),
        "runId": str(l.model_run.id),
        "name": l.scenario.name,
        "baselineId": str(baseline_id),
        "stateVersionId": str(l.state_version.id),
        "assumptionVersionId": str(l.assumption_set_version.id),
        "modelVersionId": str(l.model_version.id),
        "implementation": l.model_version.implementation_identity,
        "producedAt": l.result.produced_at.isoformat(),
        "parentResultId": l.scenario.hypothetical_state.get("parentResultId"),
        "newerBaselineExists": stale(db, l),
        "output": l.result.payload,
    }


def save(db, review, baseline_id, body, parent_id=None):
    l = baseline(db, review, baseline_id)
    if stale(db, l) and not body.get("acknowledgeHistoricalBaseline"):
        raise close.Conflict(
            "Existe baseline revisado mais recente; reconheça explicitamente o histórico"
        )
    assumptions = {
        k: body[k] for k in ("candidateKw", "normalRegime", "tariffApplicability")
    }
    calculate(l, assumptions)  # reject invalid assumptions before any write
    branch = core.create_assumption_set(
        db, tenant_id=review.tenant_id, name=f"demand_planning:{uuid.uuid4()}"
    )
    av = core.create_assumption_set_version(
        db,
        tenant_id=review.tenant_id,
        assumption_set_id=branch.id,
        values=assumptions,
        origin="human_defined",
        value_schema=engine.INPUT_CONTRACT,
    )
    scenario = core.create_scenario(
        db,
        tenant_id=review.tenant_id,
        name=body["name"],
        state_version_id=l.state_version.id,
        assumption_set_version_id=av.id,
        hypothetical_state={
            "purpose": engine.MODEL,
            "baselineId": str(baseline_id),
            "reviewId": str(review.id),
            "parentResultId": str(parent_id) if parent_id else None,
        },
    )
    run = core.execute_scenario(
        db,
        tenant_id=review.tenant_id,
        scenario_id=scenario.id,
        model_version_id=_model(db, review.tenant_id).id,
        execution_configuration=engine.POLICY,
    )
    return result_payload(db, review, baseline_id, run.result.id)


def duplicate(db, review, baseline_id, result_id, body):
    l = result_lineage(db, review, baseline_id, result_id)
    return save(
        db,
        review,
        baseline_id,
        {**body, **l.assumption_set_version.values},
        parent_id=result_id,
    )


def saved(db, review, baseline_id):
    l = baseline(db, review, baseline_id)
    ids = db.execute(
        select(AriadneResult.id)
        .join(AriadneModelRun, AriadneModelRun.id == AriadneResult.model_run_id)
        .join(AriadneScenario, AriadneScenario.id == AriadneModelRun.scenario_id)
        .where(
            AriadneResult.tenant_id == review.tenant_id,
            AriadneResult.result_key == engine.MODEL,
            AriadneScenario.state_version_id == l.state_version.id,
        )
        .order_by(AriadneResult.produced_at.desc())
        .limit(50)
    ).scalars()
    return [
        result_payload(db, review, baseline_id, id)
        for id in ids
        if core.reconstruct_result_lineage(
            db, tenant_id=review.tenant_id, result_id=id
        ).scenario.hypothetical_state.get("baselineId")
        == str(baseline_id)
    ]
