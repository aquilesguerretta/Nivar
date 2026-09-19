"""Small stdlib-only validator for the NIV-45 Signal Gold Set reference data."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from typing import Any


GOLD_SET_VERSION = "argos.signal-gold.ons-capacidade@0.1-alpha"
RESERVED_RELEASED_IDENTIFIER = "argos.signal-gold.ons-capacidade@0.1"
CANONICAL_POLICY_REF = "https://app.notion.com/p/3e09ca62107081f48f1fc4d376d4382c"
HUMAN_GOLD_REVIEWER = "Aquiles Guerretta"
ONS_RIGHTS_RECORD_REF = "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"
HUMAN_SIGNAL_RIGHTS = {
    "surface": "human_signal_display",
    "state": "CLEARED_WITH_ATTRIBUTION",
    "rights_record_ref": ONS_RIGHTS_RECORD_REF,
    "attribution_required": True,
}
EXPECTED_CASE_IDS = tuple(f"SG-{number:03d}" for number in range(1, 21))


def _load_expected_policy_contract():
    contract_path = Path(__file__).with_name("expected_policy.py")
    spec = importlib.util.spec_from_file_location(
        "signal_gold_set_v01_expected_policy", contract_path
    )
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load frozen expected-policy contract: {contract_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_expected_policy = _load_expected_policy_contract()
EXPECTED_POLICY_BY_CASE = _expected_policy.EXPECTED_POLICY_BY_CASE
EXPECTED_HUMAN_PROVENANCE = _expected_policy.HUMAN_PROVENANCE

if _expected_policy.GOLD_SET_VERSION != GOLD_SET_VERSION:
    raise RuntimeError("frozen expected-policy contract has the wrong Gold Set version")
if tuple(EXPECTED_POLICY_BY_CASE) != EXPECTED_CASE_IDS:
    raise RuntimeError("frozen expected-policy contract must contain exactly SG-001 through SG-020")

REASON_CODES_BY_DECISION = {
    "PROMOTE": {"MATERIAL_RECONSTRUCTIBLE_CHANGE"},
    "REJECT": {
        "NO_PARSED_CONTENT_CHANGE",
        "NON_MATERIAL_CHANGE",
        "PRESENTATION_ONLY_CHANGE",
    },
    "HOLD": {
        "SOURCE_HEALTH_UNRESOLVED",
        "SEMANTICS_UNRESOLVED",
        "SCHEMA_DRIFT",
        "IDENTITY_AMBIGUITY",
        "EVIDENCE_NOT_RECONSTRUCTIBLE",
        "RIGHTS_NOT_CLEARED",
    },
}

COMMON_CASE_FIELDS = (
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


class ManifestValidationError(ValueError):
    """The checked-in Gold Set does not preserve the approved contract."""


def load_manifest(path: Path) -> dict[str, Any]:
    """Load a manifest without introducing a YAML or schema-framework dependency."""
    try:
        loaded = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ManifestValidationError(f"cannot load manifest {path}: {exc}") from exc
    if not isinstance(loaded, dict):
        raise ManifestValidationError("manifest root must be an object")
    return loaded


def _require(case: dict[str, Any], field: str) -> Any:
    if field not in case:
        raise ManifestValidationError(f"{case.get('case_id', '<unknown>')}: missing {field}")
    return case[field]


def _validate_local_evidence_paths(case: dict[str, Any], repo_root: Path) -> None:
    refs = _require(case, "evidence_refs")
    if not isinstance(refs, list) or not refs:
        raise ManifestValidationError(f"{case['case_id']}: evidence_refs must be a non-empty list")

    for ref in refs:
        if not isinstance(ref, dict):
            raise ManifestValidationError(f"{case['case_id']}: evidence ref must be an object")
        local_path = ref.get("path")
        if local_path is None:
            if ref.get("local_resolution_expected") is True:
                raise ManifestValidationError(
                    f"{case['case_id']}: locally resolvable evidence is missing a path"
                )
            continue
        if ref.get("type") != "local_path":
            raise ManifestValidationError(
                f"{case['case_id']}: evidence path must be explicitly typed local_path"
            )
        resolved = repo_root / local_path
        if not resolved.is_file():
            raise ManifestValidationError(
                f"{case['case_id']}: evidence path does not exist: {local_path}"
            )


def _validate_frozen_policy(case: dict[str, Any]) -> None:
    case_id = case["case_id"]
    expected = EXPECTED_POLICY_BY_CASE[case_id]

    for field, expected_value in expected.items():
        actual_value = _require(case, field)
        if actual_value != expected_value:
            raise ManifestValidationError(
                f"{case_id}: frozen policy mismatch for {field}: "
                f"expected {expected_value!r}, got {actual_value!r}"
            )

    if "claim_guard" in case and "claim_guard" not in expected:
        raise ManifestValidationError(
            f"{case_id}: frozen policy does not define a claim_guard"
        )

    for field, expected_value in EXPECTED_HUMAN_PROVENANCE.items():
        actual_value = _require(case, field)
        if actual_value != expected_value:
            raise ManifestValidationError(
                f"{case_id}: frozen policy mismatch for {field}: "
                f"expected {expected_value!r}, got {actual_value!r}"
            )


def _validate_case(case: dict[str, Any], repo_root: Path) -> None:
    case_id = case.get("case_id", "<unknown>")
    for field in COMMON_CASE_FIELDS:
        _require(case, field)

    if case["gold_set_version"] != GOLD_SET_VERSION:
        raise ManifestValidationError(f"{case_id}: wrong gold_set_version")
    if case["source_id"] != "ons.capacidade_geracao":
        raise ManifestValidationError(f"{case_id}: wrong source_id")

    decision = case["expected_decision"]
    if decision not in REASON_CODES_BY_DECISION:
        raise ManifestValidationError(f"{case_id}: invalid decision value {decision!r}")
    if case["decision_reason_code"] not in REASON_CODES_BY_DECISION[decision]:
        raise ManifestValidationError(
            f"{case_id}: invalid decision/reason combination "
            f"{decision}/{case['decision_reason_code']}"
        )
    if decision == "PROMOTE" and not case["expected_factual_claim"]:
        raise ManifestValidationError(f"{case_id}: PROMOTE requires expected_factual_claim")
    if decision == "HOLD" and not case["required_caveats"]:
        raise ManifestValidationError(f"{case_id}: HOLD requires a caveat")
    if not isinstance(case["forbidden_claims"], list) or not case["forbidden_claims"]:
        raise ManifestValidationError(f"{case_id}: forbidden_claims must be a non-empty list")
    if not isinstance(case["required_evidence_refs"], list) or not case["required_evidence_refs"]:
        raise ManifestValidationError(f"{case_id}: required_evidence_refs must be a non-empty list")
    if case["human_gold_reviewer"] != HUMAN_GOLD_REVIEWER:
        raise ManifestValidationError(f"{case_id}: wrong human Gold reviewer")
    if case["human_gold_reviewed_at"] != "2026-09-19":
        raise ManifestValidationError(f"{case_id}: wrong human Gold review date")
    if case["human_gold_rationale_version"] != "founder-approved-alpha-2026-09-19":
        raise ManifestValidationError(f"{case_id}: wrong human Gold rationale version")

    rights = case["rights_state_for_surface"]
    if not isinstance(rights, dict):
        raise ManifestValidationError(f"{case_id}: rights_state_for_surface must be an object")
    if rights.get("surface") == "approved_signal_surface":
        raise ManifestValidationError(f"{case_id}: approved_signal_surface is not canonical")
    if rights.get("state") == "CLEARED":
        raise ManifestValidationError(f"{case_id}: generic CLEARED rights state is not canonical")
    if decision == "PROMOTE" and rights != HUMAN_SIGNAL_RIGHTS:
        raise ManifestValidationError(
            f"{case_id}: PROMOTE on the human Signal surface requires attributed ONS clearance"
        )

    evidence_kind = case["evidence_kind"]
    if evidence_kind == "CONTROLLED_DIFF" and (
        not case["parser_version"] or not case["diff_version"]
    ):
        raise ManifestValidationError(
            f"{case_id}: controlled diff requires parser_version and diff_version"
        )
    if evidence_kind == "CONTROLLED_PARSER_FAILURE" and not case["parser_version"]:
        raise ManifestValidationError(f"{case_id}: parser failure requires parser_version")
    if case["deterministic_result_kind"] == "CONTENT_DELTA" and (
        not case["parser_version"] or not case["diff_version"]
    ):
        raise ManifestValidationError(
            f"{case_id}: ContentDelta requires parser_version and diff_version"
        )

    _validate_local_evidence_paths(case, repo_root)

    if case_id == "SG-020":
        claim_guard = case.get("claim_guard")
        if not isinstance(claim_guard, dict):
            raise ManifestValidationError("SG-020: missing claim_guard expectation")
        required_guard_fields = ("candidate_wording", "result", "reason_code", "fallback_claim")
        if any(not claim_guard.get(field) for field in required_guard_fields):
            raise ManifestValidationError("SG-020: incomplete claim_guard expectation")
        if claim_guard["result"] != "FAIL" or claim_guard["reason_code"] != "UNSUPPORTED_CAUSALITY":
            raise ManifestValidationError("SG-020: claim_guard must fail for UNSUPPORTED_CAUSALITY")

    if case_id == "SG-019":
        expected_rights = {
            "surface": "machine_api_redistribution",
            "state": "UNCLEAR",
            "rights_record_ref": ONS_RIGHTS_RECORD_REF,
        }
        if case["candidate_event_kind"] != "EFFECTIVE_POWER_CHANGED":
            raise ManifestValidationError("SG-019: rights gate must not replace the observed Event kind")
        if rights != expected_rights:
            raise ManifestValidationError("SG-019: wrong machine/API rights-gate representation")
        if (decision, case["decision_reason_code"]) != ("HOLD", "RIGHTS_NOT_CLEARED"):
            raise ManifestValidationError("SG-019: wrong rights-gate decision")

    _validate_frozen_policy(case)


def validate_manifest(manifest: dict[str, Any], repo_root: Path) -> None:
    """Validate only the approved v0.1-alpha materialization contract."""
    if manifest.get("gold_set_version") != GOLD_SET_VERSION:
        raise ManifestValidationError("manifest has wrong gold_set_version")
    if manifest.get("released_identifier_reserved") != RESERVED_RELEASED_IDENTIFIER:
        raise ManifestValidationError("released identifier is not preserved as reserved")
    if manifest.get("release_status") != "ALPHA_MATERIALIZED_NOT_RELEASED":
        raise ManifestValidationError("manifest must remain alpha and not released")
    if manifest.get("canonical_policy_ref") != CANONICAL_POLICY_REF:
        raise ManifestValidationError("manifest is missing the canonical policy reference")

    cases = manifest.get("cases")
    if not isinstance(cases, list):
        raise ManifestValidationError("manifest cases must be a list")
    case_ids = [case.get("case_id") for case in cases if isinstance(case, dict)]
    if len(case_ids) != len(set(case_ids)):
        raise ManifestValidationError("manifest contains duplicate case_id")
    if tuple(case_ids) != EXPECTED_CASE_IDS:
        raise ManifestValidationError("manifest must contain exactly SG-001 through SG-020")

    for case in cases:
        if not isinstance(case, dict):
            raise ManifestValidationError("manifest case must be an object")
        _validate_case(case, repo_root)


__all__ = [
    "CANONICAL_POLICY_REF",
    "EXPECTED_CASE_IDS",
    "EXPECTED_HUMAN_PROVENANCE",
    "EXPECTED_POLICY_BY_CASE",
    "GOLD_SET_VERSION",
    "HUMAN_GOLD_REVIEWER",
    "HUMAN_SIGNAL_RIGHTS",
    "ManifestValidationError",
    "ONS_RIGHTS_RECORD_REF",
    "RESERVED_RELEASED_IDENTIFIER",
    "load_manifest",
    "validate_manifest",
]
