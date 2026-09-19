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
EXPECTED_CONTROLLED_CONTEXTS_BY_CASE = (
    _expected_policy.EXPECTED_CONTROLLED_CONTEXTS_BY_CASE
)
EXPECTED_CASE_FIELDS_BY_CASE = _expected_policy.EXPECTED_CASE_FIELDS_BY_CASE
EXPECTED_EVIDENCE_REFS_BY_CASE = _expected_policy.EXPECTED_EVIDENCE_REFS_BY_CASE
EXPECTED_MANIFEST_FIELDS = _expected_policy.EXPECTED_MANIFEST_FIELDS
EXPECTED_MANIFEST_METADATA = _expected_policy.EXPECTED_MANIFEST_METADATA
EXPECTED_POLICY_BY_CASE = _expected_policy.EXPECTED_POLICY_BY_CASE
EXPECTED_HUMAN_PROVENANCE = _expected_policy.HUMAN_PROVENANCE

if _expected_policy.GOLD_SET_VERSION != GOLD_SET_VERSION:
    raise RuntimeError("frozen expected-policy contract has the wrong Gold Set version")
if tuple(EXPECTED_POLICY_BY_CASE) != EXPECTED_CASE_IDS:
    raise RuntimeError("frozen expected-policy contract must contain exactly SG-001 through SG-020")
if tuple(EXPECTED_EVIDENCE_REFS_BY_CASE) != EXPECTED_CASE_IDS:
    raise RuntimeError("frozen evidence-ref contract must contain exactly SG-001 through SG-020")
if tuple(EXPECTED_CASE_FIELDS_BY_CASE) != EXPECTED_CASE_IDS:
    raise RuntimeError("frozen case-field contract must contain exactly SG-001 through SG-020")

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

COMMON_CASE_FIELDS = _expected_policy.BASE_CASE_FIELDS


class ManifestValidationError(ValueError):
    """The checked-in Gold Set does not preserve the approved contract."""


def same_json_value(actual: Any, expected: Any) -> bool:
    """Exact JSON value equality; Python's True == 1 is not a frozen boolean."""
    if type(actual) is not type(expected):
        return False
    if isinstance(expected, dict):
        return actual.keys() == expected.keys() and all(
            same_json_value(actual[key], value) for key, value in expected.items()
        )
    if isinstance(expected, list):
        return len(actual) == len(expected) and all(
            same_json_value(left, right) for left, right in zip(actual, expected)
        )
    return actual == expected


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
        if not same_json_value(actual_value, expected_value):
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
        if not same_json_value(actual_value, expected_value):
            raise ManifestValidationError(
                f"{case_id}: frozen policy mismatch for {field}: "
                f"expected {expected_value!r}, got {actual_value!r}"
            )

    expected_evidence_refs = EXPECTED_EVIDENCE_REFS_BY_CASE[case_id]
    if not same_json_value(case["evidence_refs"], expected_evidence_refs):
        raise ManifestValidationError(
            f"{case_id}: frozen policy mismatch for evidence_refs: "
            f"expected {expected_evidence_refs!r}, got {case['evidence_refs']!r}"
        )


def _validate_sg001_reference_integrity(case: dict[str, Any]) -> None:
    refs_by_role = {ref.get("role"): ref for ref in case["evidence_refs"]}
    if set(refs_by_role) != {"from_snapshot", "to_snapshot", "m3_receipt"}:
        raise ManifestValidationError("SG-001: unexpected evidence reference roles")

    from_snapshot = refs_by_role["from_snapshot"]["value"]
    to_snapshot = refs_by_role["to_snapshot"]["value"]
    receipt = refs_by_role["m3_receipt"]["value"]
    facts = case["candidate_event_facts"]
    expected_receipt = f"sha256:{facts['sha256']};bytes:{facts['bytes']}"

    if receipt != expected_receipt:
        raise ManifestValidationError(
            "SG-001: m3_receipt does not agree with candidate_event_facts"
        )
    for snapshot_id in (from_snapshot, to_snapshot):
        if snapshot_id not in case["required_evidence_refs"]:
            raise ManifestValidationError(
                "SG-001: snapshot evidence_refs do not agree with required_evidence_refs"
            )

    rights_record_ref = case["rights_state_for_surface"].get("rights_record_ref")
    if rights_record_ref != ONS_RIGHTS_RECORD_REF:
        raise ManifestValidationError("SG-001: wrong rights_record_ref")
    if rights_record_ref not in case["required_evidence_refs"]:
        raise ManifestValidationError(
            "SG-001: rights_record_ref is missing from required_evidence_refs"
        )


def load_controlled_contexts(repo_root: Path) -> dict[str, dict[str, Any]]:
    contexts: dict[str, dict[str, Any]] = {}
    for case_id, expected in EXPECTED_CONTROLLED_CONTEXTS_BY_CASE.items():
        path = repo_root / expected["path"]
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise ManifestValidationError(
                f"{case_id}: cannot load controlled context {path}: {exc}"
            ) from exc
        if not isinstance(payload, dict):
            raise ManifestValidationError(f"{case_id}: controlled context must be an object")
        contexts[case_id] = payload
    return contexts


def validate_controlled_contexts(
    manifest: dict[str, Any],
    repo_root: Path,
    *,
    context_payloads: dict[str, dict[str, Any]] | None = None,
) -> None:
    cases = {case["case_id"]: case for case in manifest["cases"]}
    contexts = (
        load_controlled_contexts(repo_root)
        if context_payloads is None
        else context_payloads
    )
    if set(contexts) != set(EXPECTED_CONTROLLED_CONTEXTS_BY_CASE):
        raise ManifestValidationError(
            "controlled context payloads must contain exactly SG-017 through SG-020"
        )

    for case_id, expected in EXPECTED_CONTROLLED_CONTEXTS_BY_CASE.items():
        case = cases[case_id]
        actual = contexts[case_id]
        expected_payload = expected["payload"]
        if not isinstance(actual, dict):
            raise ManifestValidationError(f"{case_id}: controlled context must be an object")
        for field, expected_value in expected_payload.items():
            if field not in actual:
                raise ManifestValidationError(
                    f"{case_id}: controlled context is missing {field}"
                )
            if not same_json_value(actual[field], expected_value):
                raise ManifestValidationError(
                    f"{case_id}: controlled context mismatch for {field}: "
                    f"expected {expected_value!r}, got {actual[field]!r}"
                )
        unexpected_fields = set(actual) - set(expected_payload)
        if unexpected_fields:
            raise ManifestValidationError(
                f"{case_id}: controlled context has unexpected fields: "
                f"{sorted(unexpected_fields)!r}"
            )

        context_refs = [
            ref
            for ref in case["evidence_refs"]
            if ref.get("role") == expected["evidence_role"]
        ]
        expected_ref = {
            "role": expected["evidence_role"],
            "type": "local_path",
            "path": expected["path"],
        }
        if context_refs != [expected_ref]:
            raise ManifestValidationError(
                f"{case_id}: manifest context evidence reference does not match frozen context"
            )

    sg017 = cases["SG-017"]
    sg017_context = contexts["SG-017"]
    if sg017_context["source_health_state"] != sg017["source_health_state"]:
        raise ManifestValidationError(
            "SG-017: context source_health_state does not match manifest"
        )
    manifest_observation = sg017["candidate_event_facts"]["observation"].rstrip(".")
    if manifest_observation not in sg017_context["observation"]:
        raise ManifestValidationError(
            "SG-017: context observation does not preserve manifest event facts"
        )

    sg018 = cases["SG-018"]
    sg018_context = contexts["SG-018"]
    if sg018_context["required_evidence_available"] is not False:
        raise ManifestValidationError("SG-018: controlled evidence must remain unavailable")
    if sg018["candidate_event_facts"]["required_evidence_reconstructible"] is not False:
        raise ManifestValidationError("SG-018: manifest evidence must remain unreconstructible")
    if sg018_context["required_evidence_ref"] not in sg018["required_evidence_refs"]:
        raise ManifestValidationError(
            "SG-018: context evidence ref does not match required_evidence_refs"
        )
    if (sg018["expected_decision"], sg018["decision_reason_code"]) != (
        "HOLD",
        "EVIDENCE_NOT_RECONSTRUCTIBLE",
    ):
        raise ManifestValidationError("SG-018: context is inconsistent with manifest gate")

    sg019 = cases["SG-019"]
    sg019_context = contexts["SG-019"]
    sg019_rights = sg019["rights_state_for_surface"]
    for context_field, manifest_field in (
        ("intended_surface", "surface"),
        ("rights_state", "state"),
        ("rights_record_ref", "rights_record_ref"),
    ):
        if sg019_context[context_field] != sg019_rights[manifest_field]:
            raise ManifestValidationError(
                f"SG-019: context {context_field} does not match manifest rights"
            )
    if sg019["candidate_event_kind"] != "EFFECTIVE_POWER_CHANGED":
        raise ManifestValidationError(
            "SG-019: rights context must not replace the observed Event kind"
        )

    sg020 = cases["SG-020"]
    sg020_context = contexts["SG-020"]
    claim_guard = sg020["claim_guard"]
    for field in (
        "candidate_wording",
        "result",
        "reason_code",
        "prohibited_reason_codes",
        "fallback_claim",
    ):
        if sg020_context[field] != claim_guard[field]:
            raise ManifestValidationError(
                f"SG-020: context {field} does not match manifest claim_guard"
            )
    sg004_claim = cases["SG-004"]["expected_factual_claim"]
    if claim_guard["fallback_claim"] != sg004_claim:
        raise ManifestValidationError(
            "SG-020: fallback_claim must equal the approved SG-004 factual claim"
        )


def _validate_case(case: dict[str, Any], repo_root: Path) -> None:
    case_id = case.get("case_id", "<unknown>")
    expected_fields = set(EXPECTED_CASE_FIELDS_BY_CASE.get(case_id, ()))
    actual_fields = set(case)
    missing_fields = expected_fields - actual_fields
    unexpected_fields = actual_fields - expected_fields
    if missing_fields:
        raise ManifestValidationError(
            f"{case_id}: missing frozen case fields: {sorted(missing_fields)!r}"
        )
    if unexpected_fields:
        raise ManifestValidationError(
            f"{case_id}: unexpected frozen case fields: {sorted(unexpected_fields)!r}"
        )

    for field in COMMON_CASE_FIELDS:
        _require(case, field)

    # Freeze values and nested shapes before interpreting their relationships.
    _validate_frozen_policy(case)
    result_kind = case["deterministic_result_kind"]
    if result_kind == "CONTENT_DELTA":
        if not isinstance(case["content_delta"], dict):
            raise ManifestValidationError(f"{case_id}: CONTENT_DELTA requires a content_delta object")
    elif case["content_delta"] is not None:
        raise ManifestValidationError(f"{case_id}: {result_kind} requires content_delta null")

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

    if case_id == "SG-001":
        _validate_sg001_reference_integrity(case)


def validate_manifest(manifest: dict[str, Any], repo_root: Path) -> None:
    """Validate only the approved v0.1-alpha materialization contract."""
    if not isinstance(manifest, dict):
        raise ManifestValidationError("manifest root must be an object")
    expected_fields = set(EXPECTED_MANIFEST_FIELDS)
    actual_fields = set(manifest)
    missing_fields = expected_fields - actual_fields
    unexpected_fields = actual_fields - expected_fields
    if missing_fields:
        raise ManifestValidationError(
            f"manifest is missing frozen top-level fields: {sorted(missing_fields)!r}"
        )
    if unexpected_fields:
        raise ManifestValidationError(
            f"manifest has unexpected top-level fields: {sorted(unexpected_fields)!r}"
        )

    for field, expected_value in EXPECTED_MANIFEST_METADATA.items():
        if not same_json_value(manifest[field], expected_value):
            raise ManifestValidationError(
                f"manifest frozen mismatch for {field}: "
                f"expected {expected_value!r}, got {manifest[field]!r}"
            )

    cases = manifest.get("cases")
    if not isinstance(cases, list):
        raise ManifestValidationError("manifest cases must be a list")
    if any(not isinstance(case, dict) for case in cases):
        raise ManifestValidationError("manifest case must be an object")
    case_ids = [case.get("case_id") for case in cases]
    if any(not isinstance(case_id, str) for case_id in case_ids):
        raise ManifestValidationError("case_id must be a string")
    if len(case_ids) != len(set(case_ids)):
        raise ManifestValidationError("manifest contains duplicate case_id")
    if tuple(case_ids) != EXPECTED_CASE_IDS:
        raise ManifestValidationError("manifest must contain exactly SG-001 through SG-020")

    for case in cases:
        if not isinstance(case, dict):
            raise ManifestValidationError("manifest case must be an object")
        _validate_case(case, repo_root)

    validate_controlled_contexts(manifest, repo_root)


__all__ = [
    "CANONICAL_POLICY_REF",
    "EXPECTED_CASE_IDS",
    "EXPECTED_CONTROLLED_CONTEXTS_BY_CASE",
    "EXPECTED_HUMAN_PROVENANCE",
    "EXPECTED_POLICY_BY_CASE",
    "GOLD_SET_VERSION",
    "HUMAN_GOLD_REVIEWER",
    "HUMAN_SIGNAL_RIGHTS",
    "ManifestValidationError",
    "ONS_RIGHTS_RECORD_REF",
    "RESERVED_RELEASED_IDENTIFIER",
    "load_manifest",
    "load_controlled_contexts",
    "same_json_value",
    "validate_controlled_contexts",
    "validate_manifest",
]
