"""Small stdlib-only validator for the NIV-45 Signal Gold Set reference data."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


GOLD_SET_VERSION = "argos.signal-gold.ons-capacidade@0.1-alpha"
RESERVED_RELEASED_IDENTIFIER = "argos.signal-gold.ons-capacidade@0.1"
EXPECTED_CASE_IDS = tuple(f"SG-{number:03d}" for number in range(1, 21))

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
    if not case["human_gold_reviewer"] or not case["human_gold_reviewed_at"]:
        raise ManifestValidationError(f"{case_id}: missing human Gold review provenance")

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


def validate_manifest(manifest: dict[str, Any], repo_root: Path) -> None:
    """Validate only the approved v0.1-alpha materialization contract."""
    if manifest.get("gold_set_version") != GOLD_SET_VERSION:
        raise ManifestValidationError("manifest has wrong gold_set_version")
    if manifest.get("released_identifier_reserved") != RESERVED_RELEASED_IDENTIFIER:
        raise ManifestValidationError("released identifier is not preserved as reserved")
    if manifest.get("release_status") != "ALPHA_MATERIALIZED_NOT_RELEASED":
        raise ManifestValidationError("manifest must remain alpha and not released")

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
    "EXPECTED_CASE_IDS",
    "GOLD_SET_VERSION",
    "ManifestValidationError",
    "RESERVED_RELEASED_IDENTIFIER",
    "load_manifest",
    "validate_manifest",
]
