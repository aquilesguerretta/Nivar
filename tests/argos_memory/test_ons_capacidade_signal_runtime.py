"""Runtime contract tests for the first bounded Argos Signal vertical (NIV-51)."""

from __future__ import annotations

import json
import os
import re
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.services.argos_memory import capture_snapshot
from app.services.argos_ons_capacidade_geracao_diff import SOURCE_ID
from app.services.argos_ons_capacidade_geracao_signal import (
    EvidenceGapObservation,
    GOLD_SET_VERSION,
    PayloadObservation,
    PromotionContext,
    ReferenceReceiptObservation,
    RightsContext,
    SignalRuntimeError,
    SnapshotPairObservation,
    SourceHealthObservation,
    build_candidate_events,
    build_candidate_events_from_snapshots,
    evaluate_promotion,
    make_signal_claim_pack,
)


REPO_ROOT = Path(__file__).resolve().parents[2]
GOLD_DIR = REPO_ROOT / "tests" / "argos_memory" / "gold_sets" / "ons_capacidade" / "v0_1"
MANIFEST_PATH = GOLD_DIR / "manifest.json"


def _manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def _ref(case: dict, role: str) -> dict:
    return next(ref for ref in case["evidence_refs"] if ref["role"] == role)


def _ref_value(ref: dict) -> str:
    if ref["type"] == "local_path":
        return Path(ref["path"]).name
    return ref["value"]


def _read_ref(ref: dict) -> bytes:
    return (REPO_ROOT / ref["path"]).read_bytes()


def _read_context(case: dict, role: str) -> dict:
    ref = _ref(case, role)
    return json.loads((REPO_ROOT / ref["path"]).read_text(encoding="utf-8"))


def _observation(case: dict):
    result_kind = case["deterministic_result_kind"]
    if result_kind == "CONTENT_DELTA":
        from_ref = _ref(case, "from")
        to_ref = _ref(case, "to")
        return SnapshotPairObservation(
            source_id=SOURCE_ID,
            from_bytes=_read_ref(from_ref),
            to_bytes=_read_ref(to_ref),
            from_evidence_ref=_ref_value(from_ref),
            to_evidence_ref=_ref_value(to_ref),
        )
    if result_kind == "PARSER_FAILURE":
        payload_ref = _ref(case, "payload")
        return PayloadObservation(
            source_id=SOURCE_ID,
            payload=_read_ref(payload_ref),
            evidence_ref=_ref_value(payload_ref),
        )
    if result_kind == "REFERENCE_RECEIPT":
        receipt = _ref(case, "m3_receipt")["value"]
        match = re.fullmatch(r"sha256:([0-9a-f]{64});bytes:([1-9][0-9]*)", receipt)
        assert match is not None
        return ReferenceReceiptObservation(
            source_id=SOURCE_ID,
            from_snapshot_ref=_ref(case, "from_snapshot")["value"],
            to_snapshot_ref=_ref(case, "to_snapshot")["value"],
            sha256=match.group(1),
            byte_size=int(match.group(2)),
        )
    if case["candidate_event_kind"] == "SOURCE_HEALTH_FAILURE":
        context = _read_context(case, "source_health_context")
        return SourceHealthObservation(
            source_id=SOURCE_ID,
            source_health_state=context["source_health_state"],
            observation=context["observation"],
            evidence_ref=Path(_ref(case, "source_health_context")["path"]).name,
        )
    if case["candidate_event_kind"] == "EVIDENCE_GAP":
        context = _read_context(case, "evidence_gap_context")
        return EvidenceGapObservation(
            source_id=SOURCE_ID,
            required_evidence_ref=context["required_evidence_ref"],
            required_evidence_reconstructible=context["required_evidence_available"],
        )
    raise AssertionError(case["case_id"])


def _materiality_for(event) -> str:
    if (
        event.event_kind == "EFFECTIVE_POWER_CHANGED"
        and event.facts["before"] == "20.00"
        and event.facts["after"] == "20.01"
    ):
        # This is the one released case-level non-material judgment.  It is
        # deliberately not converted into a numeric threshold.
        return "NON_MATERIAL"
    if event.event_kind in {
        "EFFECTIVE_POWER_CHANGED",
        "UNIT_ADDED_TO_DATASET",
        "OPERATION_DATE_RECORDED_OR_CHANGED",
        "DEACTIVATION_DATE_RECORDED_OR_CHANGED",
        "OWNER_RECORD_CHANGED",
        "OPERATOR_RECORD_CHANGED",
        "FUEL_CLASSIFICATION_CHANGED",
    }:
        return "MATERIAL"
    return "NOT_APPLICABLE"


def _rights(case: dict) -> RightsContext:
    rights = case["rights_state_for_surface"]
    return RightsContext(
        surface=rights["surface"],
        state=rights["state"],
        rights_record_ref=rights.get("rights_record_ref"),
        attribution_required=rights.get("attribution_required"),
    )


def _rights_dict(rights: RightsContext) -> dict:
    result = {"surface": rights.surface, "state": rights.state}
    if rights.rights_record_ref is not None:
        result["rights_record_ref"] = rights.rights_record_ref
    if rights.attribution_required is not None:
        result["attribution_required"] = rights.attribution_required
    return result


def _context(case: dict, event) -> PromotionContext:
    additional_refs: list[str] = []
    candidate_wording = None
    for ref in case["evidence_refs"]:
        if ref["role"] in {"rights_context", "claim_guard_context"}:
            additional_refs.append(Path(ref["path"]).name)
    if case["deterministic_result_kind"] == "REFERENCE_RECEIPT":
        rights_ref = case["rights_state_for_surface"].get("rights_record_ref")
        if rights_ref:
            additional_refs.append(rights_ref)
    if any(ref["role"] == "claim_guard_context" for ref in case["evidence_refs"]):
        candidate_wording = _read_context(case, "claim_guard_context")[
            "candidate_wording"
        ]

    return PromotionContext(
        source_health_state=case["source_health_state"],
        evidence_reconstructible=(event.event_kind != "EVIDENCE_GAP"),
        semantics_understood=(event.event_kind != "OPERATING_MODALITY_CHANGED"),
        materiality_state=_materiality_for(event),
        rights=_rights(case),
        additional_evidence_refs=tuple(additional_refs),
        candidate_wording=candidate_wording,
    )


def _serialise_delta(delta) -> dict | None:
    if delta is None:
        return None
    return {
        "content_equal": delta.content_equal,
        "added": delta.added,
        "removed": delta.removed,
        "changed": [
            {
                "identity": row.identity,
                "changes": [
                    {"field": change.field, "before": change.before, "after": change.after}
                    for change in row.changes
                ],
            }
            for row in delta.changed
        ],
    }


def _claim_guard_dict(guard) -> dict | None:
    if guard is None:
        return None
    return {
        "candidate_wording": guard.candidate_wording,
        "result": guard.result,
        "reason_code": guard.reason_code,
        "prohibited_reason_codes": list(guard.prohibited_reason_codes),
        "fallback_claim": guard.fallback_claim,
    }


CASES = _manifest()["cases"]


@pytest.mark.parametrize("case", CASES, ids=[case["case_id"] for case in CASES])
def test_released_gold_case_executes_through_runtime(case):
    """The manifest is the oracle; the app path receives no Gold case ID."""
    events = build_candidate_events(_observation(case))
    matching = [
        event
        for event in events
        if event.event_kind == case["candidate_event_kind"]
        and dict(event.facts) == case["candidate_event_facts"]
    ]
    assert len(matching) == 1, case["case_id"]
    event = matching[0]

    assert event.source_id == case["source_id"]
    assert event.deterministic_result_kind == case["deterministic_result_kind"]
    assert event.byte_relation == case["byte_relation"]
    assert event.parser_version == case["parser_version"]
    assert event.diff_version == case["diff_version"]
    assert _serialise_delta(event.content_delta) == case["content_delta"]

    evaluation = evaluate_promotion(event, _context(case, event))
    assert (evaluation.decision, evaluation.reason_code) == (
        case["expected_decision"],
        case["decision_reason_code"],
    )
    assert list(evaluation.evidence_refs) == case["required_evidence_refs"]
    assert list(evaluation.required_caveats) == case["required_caveats"]
    assert list(evaluation.forbidden_claims) == case["forbidden_claims"]

    claim_pack = make_signal_claim_pack(evaluation)
    if case["expected_decision"] != "PROMOTE":
        assert claim_pack is None
        assert evaluation.claim_guard is None
        return

    assert claim_pack is not None
    assert claim_pack.gold_set_version == GOLD_SET_VERSION == case["gold_set_version"]
    assert claim_pack.factual_claim == case["expected_factual_claim"]
    assert list(claim_pack.evidence_refs) == case["required_evidence_refs"]
    assert list(claim_pack.required_caveats) == case["required_caveats"]
    assert list(claim_pack.forbidden_claims) == case["forbidden_claims"]
    assert _rights_dict(claim_pack.rights) == case["rights_state_for_surface"]
    assert _claim_guard_dict(claim_pack.claim_guard) == case.get("claim_guard")


def test_added_and_removed_delta_emits_two_independent_atomic_events():
    case = next(case for case in CASES if case["case_id"] == "SG-006")
    events = build_candidate_events(_observation(case))
    assert [(event.event_kind, event.facts["identity"]) for event in events] == [
        ("UNIT_ADDED_TO_DATASET", "TEST-EQ-004"),
        ("UNIT_REMOVED_FROM_DATASET", "TEST-EQ-003"),
    ]


def test_claim_guard_fails_closed_for_unsupported_publisher_revision_wording():
    case = next(case for case in CASES if case["case_id"] == "SG-004")
    event = build_candidate_events(_observation(case))[0]
    context = _context(case, event)
    guarded = PromotionContext(
        source_health_state=context.source_health_state,
        evidence_reconstructible=context.evidence_reconstructible,
        semantics_understood=context.semantics_understood,
        materiality_state=context.materiality_state,
        rights=context.rights,
        candidate_wording="ONS corrected the capacity.",
    )

    evaluation = evaluate_promotion(event, guarded)
    claim_pack = make_signal_claim_pack(evaluation)

    assert evaluation.decision == "PROMOTE"
    assert claim_pack is not None
    assert claim_pack.claim_guard is not None
    assert claim_pack.claim_guard.reason_code == "UNSUPPORTED_PUBLISHER_REVISION"
    assert claim_pack.factual_claim == case["expected_factual_claim"]


def test_runtime_is_source_bounded_and_contains_no_gold_case_lookup():
    observation = SnapshotPairObservation(
        source_id="some.other.source",
        from_bytes=b"x",
        to_bytes=b"y",
        from_evidence_ref="x",
        to_evidence_ref="y",
    )
    with pytest.raises(SignalRuntimeError, match="accepts only"):
        build_candidate_events(observation)

    service_path = (
        REPO_ROOT / "app" / "services" / "argos_ons_capacidade_geracao_signal.py"
    )
    source = service_path.read_text(encoding="utf-8")
    assert "SG-" not in source
    assert "case_id" not in source
    assert "tests.argos_memory" not in source


def _database_url() -> str | None:
    return os.environ.get("DATABASE_URL", "").strip() or None


def _reachable(url: str) -> bool:
    try:
        engine = create_engine(url)
        with engine.connect():
            pass
        engine.dispose()
        return True
    except OperationalError:
        return False


@pytest.fixture()
def runtime_db_session():
    url = _database_url()
    if url is None or not _reachable(url):
        pytest.skip("DATABASE_URL not set or disposable Postgres is unreachable")

    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url)
    command.upgrade(config, "head")
    engine = create_engine(url)
    session = Session(bind=engine)
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        engine.dispose()
        command.downgrade(config, "base")


def test_stored_snapshot_pair_reconstructs_end_to_end_signal(runtime_db_session):
    fixture_dir = REPO_ROOT / "tests" / "argos_memory" / "fixtures" / "ons_capacidade_geracao"
    first = capture_snapshot(
        runtime_db_session,
        source_id=SOURCE_ID,
        data=(fixture_dir / "fixture_a.csv").read_bytes(),
        content_type="text/csv",
        adapter_version="test.runtime@1",
        retrieved_at=datetime.now(timezone.utc),
    )
    runtime_db_session.commit()
    second = capture_snapshot(
        runtime_db_session,
        source_id=SOURCE_ID,
        data=(fixture_dir / "fixture_b_known_field_change.csv").read_bytes(),
        content_type="text/csv",
        adapter_version="test.runtime@1",
        retrieved_at=datetime.now(timezone.utc) + timedelta(minutes=1),
    )
    runtime_db_session.commit()

    [event] = build_candidate_events_from_snapshots(
        runtime_db_session,
        uuid.UUID(str(first.id)),
        uuid.UUID(str(second.id)),
    )
    evaluation = evaluate_promotion(
        event,
        PromotionContext(
            source_health_state="HEALTHY_COMPLETE",
            evidence_reconstructible=True,
            semantics_understood=True,
            materiality_state="MATERIAL",
            rights=RightsContext(
                surface="human_signal_display",
                state="CLEARED_WITH_ATTRIBUTION",
                rights_record_ref="NIV7-EXT-ONS-OPEN-DATA-2026-09-16",
                attribution_required=True,
            ),
        ),
    )
    claim_pack = make_signal_claim_pack(evaluation)

    assert event.from_snapshot_ref == str(first.id)
    assert event.to_snapshot_ref == str(second.id)
    assert evaluation.decision == "PROMOTE"
    assert claim_pack is not None
    assert claim_pack.evidence_refs == (str(first.id), str(second.id))
    assert claim_pack.factual_claim == (
        "The effective power recorded for unit TEST-EQ-002 changed from 20.0 MW "
        "to 22.5 MW between two stored observations of the ONS dataset."
    )
