"""Frozen Founder-approved policy contract for the released Signal Gold Set v0.1.

This module is deliberately independent of ``manifest.json``. It defines the
closed released-v0.1 manifest shape, exact evidence references, policy semantics,
and controlled-context payloads. Fixture bytes and recomputed parser/diff
outputs remain covered by the focused regression tests.
"""

from __future__ import annotations

from typing import Any


GOLD_SET_VERSION = "argos.signal-gold.ons-capacidade@0.1"
EXPECTED_MANIFEST_METADATA = {
    "gold_set_version": GOLD_SET_VERSION,
    "release_status": "RELEASED",
    "canonical_policy_ref": "https://app.notion.com/p/3e09ca62107081f48f1fc4d376d4382c",
    "source_id": "ons.capacidade_geracao",
}
EXPECTED_MANIFEST_FIELDS = (*EXPECTED_MANIFEST_METADATA, "cases")

BASE_CASE_FIELDS = (
    "case_id",
    "gold_set_version",
    "source_id",
    "evidence_kind",
    "evidence_refs",
    "parser_version",
    "diff_version",
    "byte_relation",
    "deterministic_result_kind",
    "content_delta",
    "candidate_event_kind",
    "candidate_event_facts",
    "source_health_state",
    "rights_state_for_surface",
    "expected_decision",
    "decision_reason_code",
    "materiality_rationale",
    "expected_factual_claim",
    "forbidden_claims",
    "required_evidence_refs",
    "required_caveats",
    "human_gold_reviewer",
    "human_gold_reviewed_at",
    "human_gold_rationale_version",
)
EXPECTED_CASE_FIELDS_BY_CASE = {
    f"SG-{number:03d}": (
        (*BASE_CASE_FIELDS, "claim_guard") if number == 20 else BASE_CASE_FIELDS
    )
    for number in range(1, 21)
}
HUMAN_PROVENANCE = {
    "human_gold_reviewer": "Aquiles Guerretta",
    "human_gold_reviewed_at": "2026-09-19",
    "human_gold_rationale_version": "founder-approved-alpha-2026-09-19",
}

PARSER_VERSION = "ons.capacidade_geracao.parser@1"
DIFF_VERSION = "ons.capacidade_geracao.diff@1"
ONS_RIGHTS_RECORD_REF = "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"

REFERENCE_RIGHTS = {"surface": "reference_behavior", "state": "NOT_APPLICABLE"}
HUMAN_SIGNAL_RIGHTS = {
    "surface": "human_signal_display",
    "state": "CLEARED_WITH_ATTRIBUTION",
    "rights_record_ref": ONS_RIGHTS_RECORD_REF,
    "attribution_required": True,
}
MACHINE_API_RIGHTS = {
    "surface": "machine_api_redistribution",
    "state": "UNCLEAR",
    "rights_record_ref": ONS_RIGHTS_RECORD_REF,
}


def _local_ref(role: str, path: str) -> dict[str, Any]:
    return {"role": role, "type": "local_path", "path": path}


_SHARED_FIXTURE_DIR = "tests/argos_memory/fixtures/ons_capacidade_geracao"
_GOLD_FIXTURE_DIR = "tests/argos_memory/gold_sets/ons_capacidade/v0_1/fixtures"
_CONTEXT_DIR = "tests/argos_memory/gold_sets/ons_capacidade/v0_1/contexts"

EXPECTED_EVIDENCE_REFS_BY_CASE: dict[str, list[dict[str, Any]]] = {
    "SG-001": [
        {
            "role": "from_snapshot",
            "type": "production_snapshot_id",
            "value": "878e4f37-234b-4ab0-a46e-e206ec894bb5",
            "local_resolution_expected": False,
        },
        {
            "role": "to_snapshot",
            "type": "production_snapshot_id",
            "value": "a2e31407-5957-4e8c-84c0-f9629e4a03cd",
            "local_resolution_expected": False,
        },
        {
            "role": "m3_receipt",
            "type": "verified_receipt",
            "value": "sha256:25fa69f8faa81cf19afa768d2dda5799481a845d276611a08ca706b9c6368916;bytes:1280293",
            "local_resolution_expected": False,
        },
    ],
    "SG-002": [
        _local_ref("from", f"{_SHARED_FIXTURE_DIR}/fixture_a.csv"),
        _local_ref("to", f"{_SHARED_FIXTURE_DIR}/fixture_b_order_only.csv"),
    ],
    "SG-003": [
        _local_ref("from", f"{_GOLD_FIXTURE_DIR}/sg003_padding_a.csv"),
        _local_ref("to", f"{_GOLD_FIXTURE_DIR}/sg003_padding_b.csv"),
    ],
    "SG-004": [
        _local_ref("from", f"{_SHARED_FIXTURE_DIR}/fixture_a.csv"),
        _local_ref("to", f"{_SHARED_FIXTURE_DIR}/fixture_b_known_field_change.csv"),
    ],
    "SG-005": [
        _local_ref("from", f"{_GOLD_FIXTURE_DIR}/sg005_de_minimis_a.csv"),
        _local_ref("to", f"{_GOLD_FIXTURE_DIR}/sg005_de_minimis_b.csv"),
    ],
    "SG-006": [
        _local_ref("from", f"{_SHARED_FIXTURE_DIR}/fixture_a.csv"),
        _local_ref("to", f"{_SHARED_FIXTURE_DIR}/fixture_b_added_removed.csv"),
    ],
    "SG-007": [
        _local_ref("from", f"{_SHARED_FIXTURE_DIR}/fixture_a.csv"),
        _local_ref("to", f"{_SHARED_FIXTURE_DIR}/fixture_b_added_removed.csv"),
    ],
    **{
        case_id: [
            _local_ref("from", f"{_GOLD_FIXTURE_DIR}/gold_baseline.csv"),
            _local_ref("to", f"{_GOLD_FIXTURE_DIR}/{fixture}"),
        ]
        for case_id, fixture in {
            "SG-008": "sg008_operation_entry_b.csv",
            "SG-009": "sg009_deactivation_b.csv",
            "SG-010": "sg010_owner_b.csv",
            "SG-011": "sg011_operator_b.csv",
            "SG-012": "sg012_fuel_b.csv",
            "SG-013": "sg013_presentation_label_b.csv",
            "SG-014": "sg014_modality_b.csv",
        }.items()
    },
    "SG-015": [_local_ref("payload", f"{_GOLD_FIXTURE_DIR}/sg015_bad_schema.csv")],
    "SG-016": [
        _local_ref(
            "payload",
            f"{_SHARED_FIXTURE_DIR}/fixture_invalid_duplicate_identity.csv",
        )
    ],
    "SG-017": [
        _local_ref("source_health_context", f"{_CONTEXT_DIR}/sg017_source_health.json")
    ],
    "SG-018": [
        _local_ref("evidence_gap_context", f"{_CONTEXT_DIR}/sg018_evidence_gap.json")
    ],
    "SG-019": [
        _local_ref("from", f"{_SHARED_FIXTURE_DIR}/fixture_a.csv"),
        _local_ref("to", f"{_SHARED_FIXTURE_DIR}/fixture_b_known_field_change.csv"),
        _local_ref("rights_context", f"{_CONTEXT_DIR}/sg019_rights_gate.json"),
    ],
    "SG-020": [
        _local_ref("from", f"{_SHARED_FIXTURE_DIR}/fixture_a.csv"),
        _local_ref("to", f"{_SHARED_FIXTURE_DIR}/fixture_b_known_field_change.csv"),
        _local_ref("claim_guard_context", f"{_CONTEXT_DIR}/sg020_claim_guard.json"),
    ],
}


def _policy(
    *,
    evidence_kind: str,
    parser_version: str | None,
    diff_version: str | None,
    byte_relation: str,
    deterministic_result_kind: str,
    candidate_event_kind: str,
    candidate_event_facts: dict[str, Any],
    source_health_state: str,
    rights_state_for_surface: dict[str, Any],
    expected_decision: str,
    decision_reason_code: str,
    materiality_rationale: str,
    expected_factual_claim: str | None,
    forbidden_claims: list[str],
    required_evidence_refs: list[str],
    required_caveats: list[str],
    claim_guard: dict[str, Any] | None = None,
) -> dict[str, Any]:
    contract = {
        "evidence_kind": evidence_kind,
        "parser_version": parser_version,
        "diff_version": diff_version,
        "byte_relation": byte_relation,
        "deterministic_result_kind": deterministic_result_kind,
        "candidate_event_kind": candidate_event_kind,
        "candidate_event_facts": candidate_event_facts,
        "source_health_state": source_health_state,
        "rights_state_for_surface": rights_state_for_surface,
        "expected_decision": expected_decision,
        "decision_reason_code": decision_reason_code,
        "materiality_rationale": materiality_rationale,
        "expected_factual_claim": expected_factual_claim,
        "forbidden_claims": forbidden_claims,
        "required_evidence_refs": required_evidence_refs,
        "required_caveats": required_caveats,
    }
    if claim_guard is not None:
        contract["claim_guard"] = claim_guard
    # These states have no parsed delta. Real ContentDelta values remain
    # behavioral expectations, recomputed from fixture bytes, never frozen here.
    if deterministic_result_kind in {
        "REFERENCE_RECEIPT", "PARSER_FAILURE", "CONTROLLED_CONTEXT"
    }:
        contract["content_delta"] = None
    return contract


EXPECTED_POLICY_BY_CASE: dict[str, dict[str, Any]] = {
    "SG-001": _policy(
        evidence_kind="REAL_REFERENCE",
        parser_version=None,
        diff_version=None,
        byte_relation="UNCHANGED",
        deterministic_result_kind="REFERENCE_RECEIPT",
        candidate_event_kind="NO_CONTENT_CHANGE",
        candidate_event_facts={
            "revision": "unchanged",
            "sha256": "25fa69f8faa81cf19afa768d2dda5799481a845d276611a08ca706b9c6368916",
            "bytes": 1280293,
        },
        source_health_state="NOT_APPLICABLE_REFERENCE_ONLY",
        rights_state_for_surface={
            "surface": "reference_only",
            "state": "NOT_APPLICABLE",
            "rights_record_ref": ONS_RIGHTS_RECORD_REF,
        },
        expected_decision="REJECT",
        decision_reason_code="NO_PARSED_CONTENT_CHANGE",
        materiality_rationale="The verified retrieval receipt records no byte or parsed-content change to surface.",
        expected_factual_claim=None,
        forbidden_claims=[
            "ONS changed the dataset",
            "ONS corrected the dataset",
            "ONS revised the dataset",
        ],
        required_evidence_refs=[
            "878e4f37-234b-4ab0-a46e-e206ec894bb5",
            "a2e31407-5957-4e8c-84c0-f9629e4a03cd",
            ONS_RIGHTS_RECORD_REF,
        ],
        required_caveats=["Reference-only M3 verification; CI must not connect to production."],
    ),
    "SG-002": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="NO_CONTENT_CHANGE",
        candidate_event_facts={"raw_bytes_differ": True},
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="REJECT",
        decision_reason_code="NO_PARSED_CONTENT_CHANGE",
        materiality_rationale="Row order changes bytes but not parsed business content.",
        expected_factual_claim=None,
        forbidden_claims=["a business-content change from row reordering"],
        required_evidence_refs=["fixture_a.csv", "fixture_b_order_only.csv"],
        required_caveats=["Byte change does not imply content change."],
    ),
    "SG-003": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="NO_CONTENT_CHANGE",
        candidate_event_facts={"normalization": "leading_trailing_whitespace_trim_only"},
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="REJECT",
        decision_reason_code="NO_PARSED_CONTENT_CHANGE",
        materiality_rationale="Allowed export padding normalization leaves parsed business content unchanged.",
        expected_factual_claim=None,
        forbidden_claims=["export padding as a business change"],
        required_evidence_refs=["sg003_padding_a.csv", "sg003_padding_b.csv"],
        required_caveats=["No parser normalization is broadened for this case."],
    ),
    "SG-004": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="EFFECTIVE_POWER_CHANGED",
        candidate_event_facts={
            "identity": "TEST-EQ-002",
            "field": "val_potenciaefetiva",
            "before": "20.0",
            "after": "22.5",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=HUMAN_SIGNAL_RIGHTS,
        expected_decision="PROMOTE",
        decision_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
        materiality_rationale="This approved case is a reconstructible material effective-power change.",
        expected_factual_claim="The effective power recorded for unit TEST-EQ-002 changed from 20.0 MW to 22.5 MW between two stored observations of the ONS dataset.",
        forbidden_claims=[
            "ONS corrected the capacity",
            "the plant expanded",
            "the owner invested in new equipment",
        ],
        required_evidence_refs=["fixture_a.csv", "fixture_b_known_field_change.csv"],
        required_caveats=["The claim describes the recorded dataset field, not a causal explanation."],
    ),
    "SG-005": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="EFFECTIVE_POWER_CHANGED",
        candidate_event_facts={
            "identity": "TEST-GOLD-005",
            "field": "val_potenciaefetiva",
            "before": "20.00",
            "after": "20.01",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="REJECT",
        decision_reason_code="NON_MATERIAL_CHANGE",
        materiality_rationale="This approved edge case is non-material; it establishes no universal numeric materiality threshold.",
        expected_factual_claim=None,
        forbidden_claims=[
            "a Signal claim based on this de-minimis change",
            "a universal numeric materiality threshold",
        ],
        required_evidence_refs=["sg005_de_minimis_a.csv", "sg005_de_minimis_b.csv"],
        required_caveats=["The parsed content genuinely differs even though the Gold decision is REJECT."],
    ),
    "SG-006": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="UNIT_ADDED_TO_DATASET",
        candidate_event_facts={"identity": "TEST-EQ-004", "membership": "added_to_later_observation"},
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=HUMAN_SIGNAL_RIGHTS,
        expected_decision="PROMOTE",
        decision_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
        materiality_rationale="The approved candidate is an added unit in a healthy, complete observation.",
        expected_factual_claim="Unit TEST-EQ-004 appears in the later stored ONS dataset and was absent from the earlier stored observation.",
        forbidden_claims=[
            "The unit entered commercial operation",
            "the plant was built between observations",
        ],
        required_evidence_refs=["fixture_a.csv", "fixture_b_added_removed.csv"],
        required_caveats=["The claim is dataset membership, not physical commissioning."],
    ),
    "SG-007": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="UNIT_REMOVED_FROM_DATASET",
        candidate_event_facts={"identity": "TEST-EQ-003", "membership": "absent_from_later_observation"},
        source_health_state="UNRESOLVED",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="HOLD",
        decision_reason_code="SOURCE_HEALTH_UNRESOLVED",
        materiality_rationale="A removal cannot be surfaced until source-health and coverage are resolved.",
        expected_factual_claim=None,
        forbidden_claims=["TEST-EQ-003 was decommissioned", "TEST-EQ-003 no longer exists"],
        required_evidence_refs=["fixture_a.csv", "fixture_b_added_removed.csv"],
        required_caveats=["Absence is not zero."],
    ),
    "SG-008": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="OPERATION_DATE_RECORDED_OR_CHANGED",
        candidate_event_facts={
            "identity": "TEST-GOLD-008-014",
            "field": "dat_entradaoperacao",
            "before": "",
            "after": "2099-01-08",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=HUMAN_SIGNAL_RIGHTS,
        expected_decision="PROMOTE",
        decision_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
        materiality_rationale="The approved case promotes the newly recorded dataset field without physical-state inference.",
        expected_factual_claim="The ONS dataset began recording an operation-entry date of 2099-01-08 for unit TEST-GOLD-008-014 between the two stored observations.",
        forbidden_claims=["Unit TEST-GOLD-008-014 entered operation on 2099-01-08"],
        required_evidence_refs=["gold_baseline.csv", "sg008_operation_entry_b.csv"],
        required_caveats=["This is dataset-record language, not an assertion of the physical event date."],
    ),
    "SG-009": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="DEACTIVATION_DATE_RECORDED_OR_CHANGED",
        candidate_event_facts={
            "identity": "TEST-GOLD-008-014",
            "field": "dat_desativacao",
            "before": "",
            "after": "2099-02-09",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=HUMAN_SIGNAL_RIGHTS,
        expected_decision="PROMOTE",
        decision_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
        materiality_rationale="The approved case promotes the newly recorded dataset field without causal interpretation.",
        expected_factual_claim="The ONS dataset began recording a deactivation date of 2099-02-09 for unit TEST-GOLD-008-014.",
        forbidden_claims=["a physical or causal interpretation beyond the recorded dataset field"],
        required_evidence_refs=["gold_baseline.csv", "sg009_deactivation_b.csv"],
        required_caveats=["No causal or physical interpretation is established by this record alone."],
    ),
    "SG-010": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="OWNER_RECORD_CHANGED",
        candidate_event_facts={
            "identity": "TEST-GOLD-008-014",
            "field": "nom_agenteproprietario",
            "before": "EMPRESA A",
            "after": "EMPRESA B",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=HUMAN_SIGNAL_RIGHTS,
        expected_decision="PROMOTE",
        decision_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
        materiality_rationale="The approved case promotes the recorded-owner field change only.",
        expected_factual_claim="The recorded owner for unit TEST-GOLD-008-014 changed from EMPRESA A to EMPRESA B in the ONS dataset.",
        forbidden_claims=[
            "EMPRESA A sold the asset to EMPRESA B",
            "EMPRESA B acquired the plant",
            "a transaction occurred",
        ],
        required_evidence_refs=["gold_baseline.csv", "sg010_owner_b.csv"],
        required_caveats=["The claim is about the recorded field, not a transaction."],
    ),
    "SG-011": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="OPERATOR_RECORD_CHANGED",
        candidate_event_facts={
            "identity": "TEST-GOLD-008-014",
            "field": "nom_agenteoperador",
            "before": "OPERADOR A",
            "after": "OPERADOR B",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=HUMAN_SIGNAL_RIGHTS,
        expected_decision="PROMOTE",
        decision_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
        materiality_rationale="The approved case promotes the recorded-operator field change only.",
        expected_factual_claim="The recorded operator for unit TEST-GOLD-008-014 changed from OPERADOR A to OPERADOR B in the ONS dataset.",
        forbidden_claims=["a contractual transfer occurred", "a control transfer occurred"],
        required_evidence_refs=["gold_baseline.csv", "sg011_operator_b.csv"],
        required_caveats=["The claim is about the recorded field, not contractual or operational control."],
    ),
    "SG-012": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="FUEL_CLASSIFICATION_CHANGED",
        candidate_event_facts={
            "identity": "TEST-GOLD-008-014",
            "field": "nom_combustivel",
            "before": "COMBUSTIVEL SINTETICO A",
            "after": "COMBUSTIVEL SINTETICO B",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=HUMAN_SIGNAL_RIGHTS,
        expected_decision="PROMOTE",
        decision_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
        materiality_rationale="The approved case promotes a recorded fuel-classification change only.",
        expected_factual_claim="The fuel classification recorded for unit TEST-GOLD-008-014 changed from COMBUSTIVEL SINTETICO A to COMBUSTIVEL SINTETICO B in the ONS dataset.",
        forbidden_claims=["the plant physically converted fuel"],
        required_evidence_refs=["gold_baseline.csv", "sg012_fuel_b.csv"],
        required_caveats=["A recorded classification change does not establish physical conversion."],
    ),
    "SG-013": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="PRESENTATION_LABEL_CHANGED",
        candidate_event_facts={
            "identity": "TEST-GOLD-008-014",
            "field": "nom_unidadegeradora",
            "before": "UNIDADE GOLD BASE",
            "after": "UNIDADE GOLD LABEL ALTERADA",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="REJECT",
        decision_reason_code="PRESENTATION_ONLY_CHANGE",
        materiality_rationale="Only the presentation-derived unit label changed; substantive fields are stable.",
        expected_factual_claim=None,
        forbidden_claims=["a presentation-derived label change as a business-state change"],
        required_evidence_refs=["gold_baseline.csv", "sg013_presentation_label_b.csv"],
        required_caveats=["The parser remains unchanged; this is a Gold judgment about the field."],
    ),
    "SG-014": _policy(
        evidence_kind="CONTROLLED_DIFF",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="OPERATING_MODALITY_CHANGED",
        candidate_event_facts={
            "identity": "TEST-GOLD-008-014",
            "field": "nom_modalidadeoperacao",
            "before": "TIPO I",
            "after": "TIPO II",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="HOLD",
        decision_reason_code="SEMANTICS_UNRESOLVED",
        materiality_rationale="The field changed but the meaning of TIPO II is not established by this case.",
        expected_factual_claim=None,
        forbidden_claims=["an invented meaning for TIPO II"],
        required_evidence_refs=["gold_baseline.csv", "sg014_modality_b.csv"],
        required_caveats=["Operating-modality semantics are unresolved; do not infer the meaning of TIPO II."],
    ),
    "SG-015": _policy(
        evidence_kind="CONTROLLED_PARSER_FAILURE",
        parser_version=PARSER_VERSION,
        diff_version=None,
        byte_relation="NOT_APPLICABLE",
        deterministic_result_kind="PARSER_FAILURE",
        candidate_event_kind="SCHEMA_DRIFT",
        candidate_event_facts={"error_class": "SchemaError", "failure_mode": "fail_closed"},
        source_health_state="NOT_APPLICABLE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="HOLD",
        decision_reason_code="SCHEMA_DRIFT",
        materiality_rationale="Malformed schema cannot be treated as a ContentDelta or surfaced Signal.",
        expected_factual_claim=None,
        forbidden_claims=["a Signal derived from the malformed payload", "a permissive parser fallback"],
        required_evidence_refs=["sg015_bad_schema.csv"],
        required_caveats=["Fail closed and route to source/parser investigation."],
    ),
    "SG-016": _policy(
        evidence_kind="CONTROLLED_PARSER_FAILURE",
        parser_version=PARSER_VERSION,
        diff_version=None,
        byte_relation="NOT_APPLICABLE",
        deterministic_result_kind="PARSER_FAILURE",
        candidate_event_kind="IDENTITY_CONFLICT",
        candidate_event_facts={"error_class": "DuplicateRowIdentityError", "identity_column": "cod_equipamento"},
        source_health_state="NOT_APPLICABLE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="HOLD",
        decision_reason_code="IDENTITY_AMBIGUITY",
        materiality_rationale="Duplicate identities are ambiguous and must never be collapsed into a candidate event.",
        expected_factual_claim=None,
        forbidden_claims=["silently collapsing duplicate cod_equipamento rows"],
        required_evidence_refs=["fixture_invalid_duplicate_identity.csv"],
        required_caveats=["No row collapsing; identity ambiguity remains unresolved."],
    ),
    "SG-017": _policy(
        evidence_kind="CONTROLLED_CONTEXT",
        parser_version=None,
        diff_version=None,
        byte_relation="NOT_APPLICABLE",
        deterministic_result_kind="CONTROLLED_CONTEXT",
        candidate_event_kind="SOURCE_HEALTH_FAILURE",
        candidate_event_facts={"observation": "No trustworthy new content observation exists."},
        source_health_state="UNAVAILABLE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="HOLD",
        decision_reason_code="SOURCE_HEALTH_UNRESOLVED",
        materiality_rationale="No trustworthy observation exists while source health is unavailable or incomplete.",
        expected_factual_claim=None,
        forbidden_claims=[
            "the asset disappeared",
            "generation equals zero",
            "capacity equals zero",
            "the unit was removed",
        ],
        required_evidence_refs=["sg017_source_health.json"],
        required_caveats=["Source-health state is not an asset Signal."],
    ),
    "SG-018": _policy(
        evidence_kind="CONTROLLED_CONTEXT",
        parser_version=None,
        diff_version=None,
        byte_relation="NOT_APPLICABLE",
        deterministic_result_kind="CONTROLLED_CONTEXT",
        candidate_event_kind="EVIDENCE_GAP",
        candidate_event_facts={"required_evidence_reconstructible": False},
        source_health_state="NOT_APPLICABLE",
        rights_state_for_surface=REFERENCE_RIGHTS,
        expected_decision="HOLD",
        decision_reason_code="EVIDENCE_NOT_RECONSTRUCTIBLE",
        materiality_rationale="An otherwise interesting candidate cannot surface without reconstructible evidence.",
        expected_factual_claim=None,
        forbidden_claims=["a Signal without reconstructible required evidence"],
        required_evidence_refs=["controlled:missing-reconstruction-receipt"],
        required_caveats=["The controlled evidence-gap reference is intentionally unavailable; no real artifact is corrupted."],
    ),
    "SG-019": _policy(
        evidence_kind="CONTROLLED_CONTEXT",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="EFFECTIVE_POWER_CHANGED",
        candidate_event_facts={
            "identity": "TEST-EQ-002",
            "field": "val_potenciaefetiva",
            "before": "20.0",
            "after": "22.5",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=MACHINE_API_RIGHTS,
        expected_decision="HOLD",
        decision_reason_code="RIGHTS_NOT_CLEARED",
        materiality_rationale="A valid deterministic change cannot be distributed on an intended surface whose rights are not cleared.",
        expected_factual_claim=None,
        forbidden_claims=["machine/API redistribution without cleared rights"],
        required_evidence_refs=[
            "fixture_a.csv",
            "fixture_b_known_field_change.csv",
            "sg019_rights_gate.json",
        ],
        required_caveats=["Factual truth does not expand distribution rights."],
    ),
    "SG-020": _policy(
        evidence_kind="CONTROLLED_CLAIM_GUARD",
        parser_version=PARSER_VERSION,
        diff_version=DIFF_VERSION,
        byte_relation="CHANGED",
        deterministic_result_kind="CONTENT_DELTA",
        candidate_event_kind="EFFECTIVE_POWER_CHANGED",
        candidate_event_facts={
            "identity": "TEST-EQ-002",
            "field": "val_potenciaefetiva",
            "before": "20.0",
            "after": "22.5",
        },
        source_health_state="HEALTHY_COMPLETE",
        rights_state_for_surface=HUMAN_SIGNAL_RIGHTS,
        expected_decision="PROMOTE",
        decision_reason_code="MATERIAL_RECONSTRUCTIBLE_CHANGE",
        materiality_rationale="The underlying event is the approved SG-004 material reconstructible change; only unsupported wording fails the claim guard.",
        expected_factual_claim="The effective power recorded for unit TEST-EQ-002 changed from 20.0 MW to 22.5 MW between two stored observations of the ONS dataset.",
        forbidden_claims=[
            "The plant expanded after new investment.",
            "ONS corrected or revised the dataset",
        ],
        required_evidence_refs=[
            "fixture_a.csv",
            "fixture_b_known_field_change.csv",
            "sg020_claim_guard.json",
        ],
        required_caveats=["AI may summarize deterministic truth but may not create causal or publisher-revision evidence."],
        claim_guard={
            "candidate_wording": "The plant expanded after new investment.",
            "result": "FAIL",
            "reason_code": "UNSUPPORTED_CAUSALITY",
            "prohibited_reason_codes": [
                "UNSUPPORTED_CAUSALITY",
                "UNSUPPORTED_PUBLISHER_REVISION",
            ],
            "fallback_claim": "The effective power recorded for unit TEST-EQ-002 changed from 20.0 MW to 22.5 MW between two stored observations of the ONS dataset.",
        },
    ),
}


EXPECTED_CONTROLLED_CONTEXTS_BY_CASE: dict[str, dict[str, Any]] = {
    "SG-017": {
        "path": "tests/argos_memory/gold_sets/ons_capacidade/v0_1/contexts/sg017_source_health.json",
        "evidence_role": "source_health_context",
        "payload": {
            "context_kind": "SOURCE_HEALTH",
            "controlled": True,
            "not_publisher_history": True,
            "source_health_state": "UNAVAILABLE",
            "observation": "No trustworthy new content observation exists while the source is unavailable.",
            "prohibition": "Do not turn source unavailability into asset absence, zero generation, or zero capacity.",
        },
    },
    "SG-018": {
        "path": "tests/argos_memory/gold_sets/ons_capacidade/v0_1/contexts/sg018_evidence_gap.json",
        "evidence_role": "evidence_gap_context",
        "payload": {
            "context_kind": "EVIDENCE_GAP",
            "controlled": True,
            "not_publisher_history": True,
            "required_evidence_ref": "controlled:missing-reconstruction-receipt",
            "required_evidence_available": False,
            "observation": "The candidate cannot be reconstructed from its required evidence reference.",
        },
    },
    "SG-019": {
        "path": "tests/argos_memory/gold_sets/ons_capacidade/v0_1/contexts/sg019_rights_gate.json",
        "evidence_role": "rights_context",
        "payload": {
            "context_kind": "RIGHTS_GATE",
            "controlled": True,
            "not_publisher_history": True,
            "intended_surface": "machine_api_redistribution",
            "rights_state": "UNCLEAR",
            "rights_record_ref": ONS_RIGHTS_RECORD_REF,
            "invariant": "Factual truth does not expand distribution rights.",
        },
    },
    "SG-020": {
        "path": "tests/argos_memory/gold_sets/ons_capacidade/v0_1/contexts/sg020_claim_guard.json",
        "evidence_role": "claim_guard_context",
        "payload": {
            "context_kind": "CLAIM_GUARD",
            "controlled": True,
            "candidate_wording": "The plant expanded after new investment.",
            "result": "FAIL",
            "reason_code": "UNSUPPORTED_CAUSALITY",
            "prohibited_reason_codes": [
                "UNSUPPORTED_CAUSALITY",
                "UNSUPPORTED_PUBLISHER_REVISION",
            ],
            "fallback_claim": "The effective power recorded for unit TEST-EQ-002 changed from 20.0 MW to 22.5 MW between two stored observations of the ONS dataset.",
        },
    },
}


__all__ = [
    "BASE_CASE_FIELDS",
    "EXPECTED_CASE_FIELDS_BY_CASE",
    "EXPECTED_CONTROLLED_CONTEXTS_BY_CASE",
    "EXPECTED_EVIDENCE_REFS_BY_CASE",
    "EXPECTED_MANIFEST_FIELDS",
    "EXPECTED_MANIFEST_METADATA",
    "EXPECTED_POLICY_BY_CASE",
    "GOLD_SET_VERSION",
    "HUMAN_PROVENANCE",
]
