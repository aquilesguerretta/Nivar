"""Read-only inspection adapter for the bounded NIV-51 Signal runtime.

The browser may choose one named demonstration scenario. It cannot provide
snapshot references, promotion context, rights, source health, semantics, or
materiality. Exact snapshot pairs come from server configuration and every
surfaceable claim is minted by the evidence-attested NIV-51 path.
"""

from __future__ import annotations

import json
import os
import uuid
from dataclasses import dataclass
from typing import Literal, Mapping

from sqlalchemy.orm import Session

from app.services.argos_ons_capacidade_geracao_signal import (
    RIGHTS_RECORD_REF,
    PromotionContext,
    RightsContext,
    SignalRuntimeError,
    build_candidate_events_from_snapshots,
    evaluate_promotion,
    make_signal_claim_pack,
)


SNAPSHOT_CONFIG_ENV = "ARGOS_SIGNAL_INSPECTION_SNAPSHOTS"
ScenarioId = Literal[
    "promote-effective-power",
    "hold-removal-health-unresolved",
    "reject-presentation-only",
]


class InspectionConfigurationError(RuntimeError):
    """The server-owned inspection scenario is absent or malformed."""


class InspectionInvariantError(RuntimeError):
    """Stored evidence no longer matches the bounded scenario contract."""


@dataclass(frozen=True)
class InspectionScenario:
    scenario_id: ScenarioId
    label: str
    gold_reference: str
    expected_event_kind: str
    expected_facts: tuple[tuple[str, str], ...]
    source_health_state: str
    evidence_reconstructible: bool
    semantics_understood: bool
    materiality_state: Literal["MATERIAL", "NON_MATERIAL", "NOT_APPLICABLE"]
    rights: RightsContext
    expected_decision: Literal["PROMOTE", "HOLD", "REJECT"]
    expected_reason_code: str


SCENARIOS: Mapping[str, InspectionScenario] = {
    "promote-effective-power": InspectionScenario(
        scenario_id="promote-effective-power",
        label="Potência efetiva registrada",
        gold_reference="SG-004",
        expected_event_kind="EFFECTIVE_POWER_CHANGED",
        expected_facts=(
            ("identity", "TEST-EQ-002"),
            ("field", "val_potenciaefetiva"),
            ("before", "20.0"),
            ("after", "22.5"),
        ),
        source_health_state="HEALTHY_COMPLETE",
        evidence_reconstructible=True,
        semantics_understood=True,
        materiality_state="MATERIAL",
        rights=RightsContext(
            surface="human_signal_display",
            state="CLEARED_WITH_ATTRIBUTION",
            rights_record_ref=RIGHTS_RECORD_REF,
            attribution_required=True,
        ),
        expected_decision="PROMOTE",
        expected_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
    ),
    "hold-removal-health-unresolved": InspectionScenario(
        scenario_id="hold-removal-health-unresolved",
        label="Ausência com cobertura não resolvida",
        gold_reference="SG-007",
        expected_event_kind="UNIT_REMOVED_FROM_DATASET",
        expected_facts=(
            ("identity", "TEST-EQ-003"),
            ("membership", "absent_from_later_observation"),
        ),
        source_health_state="UNRESOLVED",
        evidence_reconstructible=True,
        semantics_understood=True,
        materiality_state="NOT_APPLICABLE",
        rights=RightsContext(
            surface="reference_behavior",
            state="NOT_APPLICABLE",
        ),
        expected_decision="HOLD",
        expected_reason_code="SOURCE_HEALTH_UNRESOLVED",
    ),
    "reject-presentation-only": InspectionScenario(
        scenario_id="reject-presentation-only",
        label="Mudança apenas de apresentação",
        gold_reference="SG-013",
        expected_event_kind="PRESENTATION_LABEL_CHANGED",
        expected_facts=(
            ("identity", "TEST-GOLD-008-014"),
            ("field", "nom_unidadegeradora"),
            ("before", "UNIDADE GOLD BASE"),
            ("after", "UNIDADE GOLD LABEL ALTERADA"),
        ),
        source_health_state="HEALTHY_COMPLETE",
        evidence_reconstructible=True,
        semantics_understood=True,
        materiality_state="NOT_APPLICABLE",
        rights=RightsContext(
            surface="reference_behavior",
            state="NOT_APPLICABLE",
        ),
        expected_decision="REJECT",
        expected_reason_code="PRESENTATION_ONLY_CHANGE",
    ),
}


def configured_snapshot_pairs() -> dict[str, tuple[uuid.UUID, uuid.UUID]]:
    """Read exact scenario UUID pairs from one server-only environment value."""
    raw = os.environ.get(SNAPSHOT_CONFIG_ENV, "").strip()
    if not raw:
        raise InspectionConfigurationError(f"{SNAPSHOT_CONFIG_ENV} is not configured")
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise InspectionConfigurationError(
            f"{SNAPSHOT_CONFIG_ENV} must be valid JSON"
        ) from exc
    if not isinstance(parsed, dict) or set(parsed) != set(SCENARIOS):
        raise InspectionConfigurationError(
            f"{SNAPSHOT_CONFIG_ENV} must define exactly the bounded scenario IDs"
        )

    result: dict[str, tuple[uuid.UUID, uuid.UUID]] = {}
    for scenario_id, value in parsed.items():
        if not isinstance(value, dict) or set(value) != {"from", "to"}:
            raise InspectionConfigurationError(
                f"snapshot pair for {scenario_id!r} must contain only from/to"
            )
        try:
            pair = (uuid.UUID(value["from"]), uuid.UUID(value["to"]))
        except (ValueError, TypeError, AttributeError) as exc:
            raise InspectionConfigurationError(
                f"snapshot pair for {scenario_id!r} must contain UUID strings"
            ) from exc
        if pair[0] == pair[1]:
            raise InspectionConfigurationError(
                f"snapshot pair for {scenario_id!r} must contain two snapshots"
            )
        result[scenario_id] = pair
    return result


def _delta_read_model(delta) -> dict | None:
    if delta is None:
        return None
    return {
        "contentEqual": delta.content_equal,
        "added": list(delta.added),
        "removed": list(delta.removed),
        "changed": [
            {
                "identity": row.identity,
                "changes": [
                    {
                        "field": change.field,
                        "before": change.before,
                        "after": change.after,
                    }
                    for change in row.changes
                ],
            }
            for row in delta.changed
        ],
    }


def _rights_read_model(rights: RightsContext) -> dict:
    return {
        "surface": rights.surface,
        "state": rights.state,
        "rightsRecordRef": rights.rights_record_ref,
        "attributionRequired": rights.attribution_required,
    }


def inspect_scenario(
    session: Session,
    scenario_id: str,
    *,
    snapshot_pairs: Mapping[str, tuple[uuid.UUID, uuid.UUID]] | None = None,
) -> dict:
    """Execute one server-owned scenario through stored evidence and NIV-51."""
    scenario = SCENARIOS.get(scenario_id)
    if scenario is None:
        raise KeyError(scenario_id)
    pairs = configured_snapshot_pairs() if snapshot_pairs is None else snapshot_pairs
    try:
        from_snapshot_id, to_snapshot_id = pairs[scenario_id]
    except KeyError as exc:
        raise InspectionConfigurationError(
            f"no server-owned snapshot pair for {scenario_id!r}"
        ) from exc

    events = build_candidate_events_from_snapshots(
        session,
        from_snapshot_id,
        to_snapshot_id,
    )
    expected_facts = dict(scenario.expected_facts)
    matches = [
        event
        for event in events
        if event.event_kind == scenario.expected_event_kind
        and dict(event.facts) == expected_facts
    ]
    if len(matches) != 1:
        raise InspectionInvariantError(
            f"stored evidence does not yield the declared {scenario.gold_reference} event"
        )
    event = matches[0]
    exact_refs = (str(from_snapshot_id), str(to_snapshot_id))
    if event.evidence_refs != exact_refs:
        raise InspectionInvariantError("runtime evidence refs do not equal snapshot UUIDs")

    context = PromotionContext(
        source_health_state=scenario.source_health_state,
        evidence_reconstructible=scenario.evidence_reconstructible,
        semantics_understood=scenario.semantics_understood,
        materiality_state=scenario.materiality_state,
        rights=scenario.rights,
    )
    evaluation = evaluate_promotion(event, context)
    if (
        evaluation.decision != scenario.expected_decision
        or evaluation.reason_code != scenario.expected_reason_code
    ):
        raise InspectionInvariantError(
            "canonical promotion result differs from the server-owned scenario"
        )
    if evaluation.evidence_refs != exact_refs:
        raise InspectionInvariantError("evaluation evidence refs changed")

    try:
        claim_pack = make_signal_claim_pack(evaluation)
    except SignalRuntimeError as exc:
        raise InspectionInvariantError(
            "runtime refused to mint an evidence-attested claim pack"
        ) from exc
    if evaluation.decision == "PROMOTE" and claim_pack is None:
        raise InspectionInvariantError("PROMOTE did not mint a SignalClaimPack")
    if evaluation.decision != "PROMOTE" and claim_pack is not None:
        raise InspectionInvariantError("non-PROMOTE result produced a claim pack")
    if claim_pack is not None and claim_pack.evidence_refs != exact_refs:
        raise InspectionInvariantError("claim-pack evidence refs changed")

    claim = None
    if claim_pack is not None:
        guard = claim_pack.claim_guard
        claim = {
            "factualClaim": claim_pack.factual_claim,
            "caveats": list(claim_pack.required_caveats),
            "forbiddenClaims": list(claim_pack.forbidden_claims),
            "claimGuard": None
            if guard is None
            else {
                "result": guard.result,
                "reasonCode": guard.reason_code,
                "prohibitedReasonCodes": list(guard.prohibited_reason_codes),
                "fallbackClaim": guard.fallback_claim,
            },
        }

    return {
        "scenario": {
            "id": scenario.scenario_id,
            "label": scenario.label,
            "goldReference": scenario.gold_reference,
            "synthetic": True,
        },
        "source": {"sourceId": event.source_id},
        "observations": {
            "fromSnapshotId": str(from_snapshot_id),
            "toSnapshotId": str(to_snapshot_id),
        },
        "event": {
            "kind": event.event_kind,
            "facts": dict(event.facts),
            "deterministicResultKind": event.deterministic_result_kind,
            "byteRelation": event.byte_relation,
            "parserVersion": event.parser_version,
            "diffVersion": event.diff_version,
            "delta": _delta_read_model(event.content_delta),
        },
        "promotion": {
            "decision": evaluation.decision,
            "reasonCode": evaluation.reason_code,
            "sourceHealthState": context.source_health_state,
            "evidenceState": (
                "RECONSTRUCTIBLE"
                if context.evidence_reconstructible
                else "NOT_RECONSTRUCTIBLE"
            ),
            "semanticsState": (
                "UNDERSTOOD" if context.semantics_understood else "UNRESOLVED"
            ),
            "materialityState": context.materiality_state,
            "rights": _rights_read_model(context.rights),
            "caveats": list(evaluation.required_caveats),
            "forbiddenClaims": list(evaluation.forbidden_claims),
        },
        "claim": claim,
        "evidence": {
            "refs": list(event.evidence_refs),
            "fromSnapshotId": event.from_snapshot_ref,
            "toSnapshotId": event.to_snapshot_ref,
        },
    }


__all__ = [
    "InspectionConfigurationError",
    "InspectionInvariantError",
    "SCENARIOS",
    "SNAPSHOT_CONFIG_ENV",
    "configured_snapshot_pairs",
    "inspect_scenario",
]
