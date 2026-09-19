"""Regression tests for the Founder-approved NIV-45 Signal Gold Set v0.1-alpha."""

from __future__ import annotations

import copy
import importlib.util
import json
import shutil
from pathlib import Path

import pytest

from app.services.argos_ons_capacidade_geracao_diff import (
    DIFF_VERSION,
    PARSER_VERSION,
    DuplicateRowIdentityError,
    SchemaError,
    diff_capacidade_geracao,
    parse_capacidade_geracao,
)


REPO_ROOT = Path(__file__).resolve().parents[2]
GOLD_SET_DIR = REPO_ROOT / "tests" / "argos_memory" / "gold_sets" / "ons_capacidade" / "v0_1"
MANIFEST_PATH = GOLD_SET_DIR / "manifest.json"

_validator_spec = importlib.util.spec_from_file_location(
    "signal_gold_set_v01_validator", GOLD_SET_DIR / "validator.py"
)
assert _validator_spec and _validator_spec.loader
validator = importlib.util.module_from_spec(_validator_spec)
_validator_spec.loader.exec_module(validator)


def _manifest() -> dict:
    return validator.load_manifest(MANIFEST_PATH)


def _case(case_id: str) -> dict:
    return next(case for case in _manifest()["cases"] if case["case_id"] == case_id)


def _evidence_bytes(case: dict, role: str, repo_root: Path = REPO_ROOT) -> bytes:
    ref = next(ref for ref in case["evidence_refs"] if ref["role"] == role)
    return (repo_root / ref["path"]).read_bytes()


def _serialise_delta(delta) -> dict:
    return {
        "content_equal": delta.content_equal,
        "added": delta.added,
        "removed": delta.removed,
        "changed": [
            {
                "identity": changed_row.identity,
                "changes": [
                    {"field": field.field, "before": field.before, "after": field.after}
                    for field in changed_row.changes
                ],
            }
            for changed_row in delta.changed
        ],
    }


def _delta_for(case: dict, repo_root: Path = REPO_ROOT):
    return diff_capacidade_geracao(
        parse_capacidade_geracao(_evidence_bytes(case, "from", repo_root)),
        parse_capacidade_geracao(_evidence_bytes(case, "to", repo_root)),
    )


def _context(case: dict) -> dict:
    ref = next(ref for ref in case["evidence_refs"] if ref["role"].endswith("context"))
    return json.loads((REPO_ROOT / ref["path"]).read_text(encoding="utf-8"))


# Test-only inventory. Explicit keys are intentional: deriving this from the
# schema would silently bless a newly allowed field, recreating NIV-45's gap.
A = "EXACT_FROZEN"
B = "DETERMINISTIC_RECOMPUTE"
C = "CROSS_FIELD_INVARIANT"
D = "CONTEXT_CROSSCHECK"
E = "MUST_BE_NULL_OR_FORBIDDEN"
NON_DELTA_CASES = ("SG-001", "SG-015", "SG-016", "SG-017", "SG-018")
CASE_FIELD_AUTHORITIES = {
    "case_id": (A, C),
    "gold_set_version": (A, C),
    "source_id": (A, C),
    "evidence_kind": (A,),
    "evidence_refs": (A, C, D),
    "parser_version": (A, B, E),
    "diff_version": (A, B, E),
    "byte_relation": (A, B),
    "deterministic_result_kind": (A, C),
    "content_delta": (B, C),  # A+C+E instead for NON_DELTA_CASES, checked below.
    "candidate_event_kind": (A, C),
    "candidate_event_facts": (A, B, C, D),
    "source_health_state": (A, D),
    "rights_state_for_surface": (A, C, D),
    "expected_decision": (A, C),
    "decision_reason_code": (A, C),
    "materiality_rationale": (A,),
    "expected_factual_claim": (A, C, E),
    "forbidden_claims": (A,),
    "required_evidence_refs": (A, C, D),
    "required_caveats": (A, C),
    "human_gold_reviewer": (A,),
    "human_gold_reviewed_at": (A,),
    "human_gold_rationale_version": (A,),
    "claim_guard": (A, C, D, E),
}
ROOT_FIELD_AUTHORITIES = {
    "gold_set_version": (A,),
    "released_identifier_reserved": (A,),
    "release_status": (A,),
    "canonical_policy_ref": (A,),
    "source_id": (A,),
    "cases": (A, C),
}
# Each list element and nested dictionary child is explicitly inventoried.
NESTED_FIELD_AUTHORITIES = {
    **dict.fromkeys((
        "evidence_refs[]", "evidence_refs[].role", "evidence_refs[].type",
        "evidence_refs[].path", "evidence_refs[].value",
        "evidence_refs[].local_resolution_expected",
        "candidate_event_facts.revision", "candidate_event_facts.sha256",
        "candidate_event_facts.bytes", "candidate_event_facts.raw_bytes_differ",
        "candidate_event_facts.normalization", "candidate_event_facts.identity",
        "candidate_event_facts.field", "candidate_event_facts.before",
        "candidate_event_facts.after", "candidate_event_facts.membership",
        "candidate_event_facts.error_class", "candidate_event_facts.failure_mode",
        "candidate_event_facts.identity_column", "candidate_event_facts.observation",
        "candidate_event_facts.required_evidence_reconstructible",
        "rights_state_for_surface.surface", "rights_state_for_surface.state",
        "rights_state_for_surface.rights_record_ref",
        "rights_state_for_surface.attribution_required",
        "forbidden_claims[]", "required_evidence_refs[]", "required_caveats[]",
        "claim_guard.candidate_wording", "claim_guard.result",
        "claim_guard.reason_code", "claim_guard.prohibited_reason_codes",
        "claim_guard.prohibited_reason_codes[]", "claim_guard.fallback_claim",
    ), (A,)),
    **dict.fromkeys((
        "content_delta.content_equal", "content_delta.added", "content_delta.added[]",
        "content_delta.removed", "content_delta.removed[]", "content_delta.changed",
        "content_delta.changed[]", "content_delta.changed[].identity",
        "content_delta.changed[].changes", "content_delta.changed[].changes[]",
        "content_delta.changed[].changes[].field",
        "content_delta.changed[].changes[].before",
        "content_delta.changed[].changes[].after",
    ), (B, C)),
}
CONTEXT_FIELD_AUTHORITIES = {
    "SG-017": dict.fromkeys((
        "context_kind", "controlled", "not_publisher_history",
        "source_health_state", "observation", "prohibition",
    ), (A, D)),
    "SG-018": dict.fromkeys((
        "context_kind", "controlled", "not_publisher_history",
        "required_evidence_ref", "required_evidence_available", "observation",
    ), (A, D)),
    "SG-019": dict.fromkeys((
        "context_kind", "controlled", "not_publisher_history",
        "intended_surface", "rights_state", "rights_record_ref", "invariant",
    ), (A, D)),
    "SG-020": dict.fromkeys((
        "context_kind", "controlled", "candidate_wording", "result",
        "reason_code", "prohibited_reason_codes", "prohibited_reason_codes[]",
        "fallback_claim",
    ), (A, D)),
}


def _field_paths(value, prefix=""):
    if isinstance(value, dict):
        for key, child in value.items():
            path = f"{prefix}.{key}" if prefix else key
            yield path
            yield from _field_paths(child, path)
    elif isinstance(value, list):
        yield f"{prefix}[]"
        for child in value:
            yield from _field_paths(child, f"{prefix}[]")


def _assert_coverage_complete():
    policy = validator._expected_policy
    assert set(ROOT_FIELD_AUTHORITIES) == set(policy.EXPECTED_MANIFEST_FIELDS)
    assert set(ROOT_FIELD_AUTHORITIES) - {"cases"} == set(policy.EXPECTED_MANIFEST_METADATA)
    assert set(CASE_FIELD_AUTHORITIES) - {"claim_guard"} == set(policy.BASE_CASE_FIELDS)
    assert set(policy.EXPECTED_CASE_FIELDS_BY_CASE) == set(validator.EXPECTED_CASE_IDS)
    observed_paths = set()
    frozen_paths = set()
    for case in _manifest()["cases"]:
        case_id = case["case_id"]
        fields = set(CASE_FIELD_AUTHORITIES) - ({"claim_guard"} if case_id != "SG-020" else set())
        assert fields == set(policy.EXPECTED_CASE_FIELDS_BY_CASE[case_id]) == set(case)
        frozen = {
            "case_id": case_id,
            "source_id": policy.EXPECTED_MANIFEST_METADATA["source_id"],
            "gold_set_version": policy.GOLD_SET_VERSION,
            "evidence_refs": policy.EXPECTED_EVIDENCE_REFS_BY_CASE[case_id],
            **policy.HUMAN_PROVENANCE,
            **policy.EXPECTED_POLICY_BY_CASE[case_id],
        }
        if case_id in NON_DELTA_CASES:
            assert set(frozen) == fields
            assert frozen["content_delta"] is None
            assert frozen["deterministic_result_kind"] in {
                "REFERENCE_RECEIPT", "PARSER_FAILURE", "CONTROLLED_CONTEXT"
            }
        else:
            assert set(frozen) == fields - {"content_delta"}
            assert frozen["deterministic_result_kind"] == "CONTENT_DELTA"
        for field in fields - {"content_delta"}:
            assert A in CASE_FIELD_AUTHORITIES[field] and field in frozen
        frozen_paths.update(_field_paths(frozen))
        observed_paths.update(_field_paths(case))
    all_authorities = {**CASE_FIELD_AUTHORITIES, **NESTED_FIELD_AUTHORITIES}
    assert observed_paths == set(all_authorities)
    assert frozen_paths <= set(all_authorities)
    for authority_map in (ROOT_FIELD_AUTHORITIES, all_authorities, *CONTEXT_FIELD_AUTHORITIES.values()):
        assert all(authorities and set(authorities) <= {A, B, C, D, E} for authorities in authority_map.values())
    for path, authorities in all_authorities.items():
        assert authorities and set(authorities) <= {A, B, C, D, E}
        if A in authorities:
            assert path in frozen_paths, f"EXACT_FROZEN has no independent value: {path}"
    assert set(CONTEXT_FIELD_AUTHORITIES) == set(policy.EXPECTED_CONTROLLED_CONTEXTS_BY_CASE)
    contexts = validator.load_controlled_contexts(REPO_ROOT)
    for case_id, authorities in CONTEXT_FIELD_AUTHORITIES.items():
        expected = policy.EXPECTED_CONTROLLED_CONTEXTS_BY_CASE[case_id]
        assert set(expected) == {"path", "evidence_role", "payload"}
        assert set(authorities) == set(_field_paths(expected["payload"]))
        assert set(authorities) == set(_field_paths(contexts[case_id]))


def test_every_allowed_field_has_an_explicit_validation_authority():
    _assert_coverage_complete()


def test_coverage_guard_rejects_new_allowed_fields_and_missing_authorities(monkeypatch):
    policy = validator._expected_policy
    with monkeypatch.context() as patch:
        patch.setattr(policy, "BASE_CASE_FIELDS", (*policy.BASE_CASE_FIELDS, "future_semantics"))
        with pytest.raises(AssertionError):
            _assert_coverage_complete()
    with monkeypatch.context() as patch:
        patch.setitem(policy.EXPECTED_POLICY_BY_CASE["SG-008"]["candidate_event_facts"], "future_semantics", True)
        with pytest.raises(AssertionError):
            _assert_coverage_complete()
    with monkeypatch.context() as patch:
        patch.delitem(policy.EXPECTED_POLICY_BY_CASE["SG-008"], "materiality_rationale")
        with pytest.raises(AssertionError):
            _assert_coverage_complete()
    with monkeypatch.context() as patch:
        patch.setitem(policy.EXPECTED_CASE_FIELDS_BY_CASE, "SG-020", (*policy.BASE_CASE_FIELDS, "claim_guard", "future_semantics"))
        with pytest.raises(AssertionError):
            _assert_coverage_complete()


def _assert_content_delta(case, repo_root=REPO_ROOT):
    """B + C: observed bytes -> real diff -> declared delta -> frozen event facts."""
    assert case["parser_version"] == PARSER_VERSION
    assert case["diff_version"] == DIFF_VERSION
    byte_relation = "UNCHANGED" if _evidence_bytes(case, "from", repo_root) == _evidence_bytes(case, "to", repo_root) else "CHANGED"
    assert case["byte_relation"] == byte_relation
    actual = _serialise_delta(_delta_for(case, repo_root))
    assert validator.same_json_value(actual, case["content_delta"]), case["case_id"]
    policy = validator.EXPECTED_POLICY_BY_CASE[case["case_id"]]
    facts = policy["candidate_event_facts"]
    if policy["candidate_event_kind"] == "NO_CONTENT_CHANGE":
        assert actual["content_equal"] is True
    elif "field" in facts:
        assert actual["added"] == actual["removed"] == []
        assert actual["changed"] == [{
            "identity": facts["identity"],
            "changes": [{key: facts[key] for key in ("field", "before", "after")}],
        }]
    else:
        # SG-006/007 intentionally select different events in the same pair.
        assert case["case_id"] in {"SG-006", "SG-007"}
        assert actual["changed"] == []
        assert actual["added"] == [validator.EXPECTED_POLICY_BY_CASE["SG-006"]["candidate_event_facts"]["identity"]]
        assert actual["removed"] == [validator.EXPECTED_POLICY_BY_CASE["SG-007"]["candidate_event_facts"]["identity"]]


@pytest.mark.parametrize("case_id", NON_DELTA_CASES)
def test_non_delta_cases_reject_every_non_null_payload(case_id):
    for payload in (
        {"content_equal": False, "added": ["PUBLISHER-ASSET-FAKE"], "removed": [], "changed": []},
        {"content_equal": True, "added": [], "removed": [], "changed": []},
        {}, [], False, 0, "null",
    ):
        manifest = _manifest()
        case = next(case for case in manifest["cases"] if case["case_id"] == case_id)
        case["content_delta"] = payload
        with pytest.raises(validator.ManifestValidationError, match=rf"{case_id}: .*content_delta"):
            validator.validate_manifest(manifest, REPO_ROOT)


def _locations(value, path=()):
    """Visit every actual JSON field, list item and collection for mutation."""
    yield path, value
    children = value.items() if isinstance(value, dict) else enumerate(value) if isinstance(value, list) else ()
    for key, child in children:
        yield from _locations(child, (*path, key))


def _replace_at(value, path, replacement):
    result = copy.deepcopy(value)
    if not path:
        return replacement
    parent = result
    for key in path[:-1]:
        parent = parent[key]
    parent[path[-1]] = replacement
    return result


def _mutations(value):
    for path, current in _locations(value):
        if isinstance(current, dict):
            yield path, _replace_at(value, path, {**current, "universal_materiality_threshold_mw": 0.01})
            for key in current:
                missing = dict(current)
                del missing[key]
                yield (*path, key), _replace_at(value, path, missing)
        if isinstance(current, list):
            yield path, _replace_at(value, path, [*current, "unapproved"])
            if len(current) > 1:
                yield path, _replace_at(value, path, list(reversed(current)))
        # These are JSON values, including aliases that Python == overlooks.
        replacement = int(current) if type(current) is bool else float(current) if type(current) is int else "unapproved" if current is None else None
        yield path, _replace_at(value, path, replacement)


def _assert_pack(manifest, repo_root=REPO_ROOT):
    validator.validate_manifest(manifest, repo_root)
    for case in manifest["cases"]:
        if case["deterministic_result_kind"] == "CONTENT_DELTA":
            _assert_content_delta(case, repo_root)


def test_every_manifest_field_rejects_value_type_shape_and_nested_injections():
    for path, mutated in _mutations(_manifest()):
        with pytest.raises((validator.ManifestValidationError, AssertionError)) as rejected:
            _assert_pack(mutated)
        assert rejected.value is not None, path


def test_every_controlled_context_field_rejects_value_type_and_shape_drift():
    manifest = _manifest()
    contexts = validator.load_controlled_contexts(REPO_ROOT)
    for case_id, payload in contexts.items():
        for path, mutated in _mutations(payload):
            changed = {**contexts, case_id: mutated}
            with pytest.raises(validator.ManifestValidationError) as rejected:
                validator.validate_controlled_contexts(manifest, REPO_ROOT, context_payloads=changed)
            assert rejected.value is not None, (case_id, path)


def _copy_local_pack(repo_root, manifest):
    for case in manifest["cases"]:
        for ref in case["evidence_refs"]:
            if ref["type"] == "local_path":
                destination = repo_root / ref["path"]
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(REPO_ROOT / ref["path"], destination)


def test_actual_context_artifacts_are_loaded_and_type_checked(tmp_path):
    manifest = _manifest()
    _copy_local_pack(tmp_path, manifest)
    validator.validate_manifest(manifest, tmp_path)
    for expected in validator.EXPECTED_CONTROLLED_CONTEXTS_BY_CASE.values():
        path = tmp_path / expected["path"]
        original = path.read_bytes()
        payload = json.loads(original)
        payload["controlled"] = 1
        path.write_text(json.dumps(payload), encoding="utf-8")
        with pytest.raises(validator.ManifestValidationError, match="controlled context mismatch for controlled"):
            validator.validate_manifest(manifest, tmp_path)
        path.write_bytes(original)


@pytest.mark.parametrize("case_id", (
    "SG-002", "SG-003", "SG-004", "SG-005", "SG-006", "SG-007", "SG-008",
    "SG-009", "SG-010", "SG-011", "SG-012", "SG-013", "SG-014", "SG-019", "SG-020",
))
def test_coordinated_fixture_and_delta_drift_cannot_detach_frozen_event_facts(case_id, tmp_path):
    manifest = _manifest()
    _copy_local_pack(tmp_path, manifest)
    case = next(case for case in manifest["cases"] if case["case_id"] == case_id)
    facts = case["candidate_event_facts"]
    for ref in case["evidence_refs"]:
        if ref["role"] not in {"from", "to"}:
            continue
        path = tmp_path / ref["path"]
        data = path.read_bytes()
        if "identity" in facts:
            data = data.replace(facts["identity"].encode(), b"PUBLISHER-ASSET-FAKE")
        elif ref["role"] == "to":
            data = data.replace(b"10.0", b"99.0")
        path.write_bytes(data)
    # A correct recomputation can still describe the wrong Gold event.
    case["content_delta"] = _serialise_delta(_delta_for(case, tmp_path))
    validator.validate_manifest(manifest, tmp_path)
    with pytest.raises(AssertionError):
        _assert_content_delta(case, tmp_path)


def test_manifest_has_exactly_the_twenty_approved_case_ids_and_validates():
    manifest = _manifest()

    validator.validate_manifest(manifest, REPO_ROOT)

    assert [case["case_id"] for case in manifest["cases"]] == list(validator.EXPECTED_CASE_IDS)
    assert len({case["case_id"] for case in manifest["cases"]}) == 20
    assert manifest["gold_set_version"] == "argos.signal-gold.ons-capacidade@0.1-alpha"
    assert manifest["released_identifier_reserved"] == "argos.signal-gold.ons-capacidade@0.1"
    assert manifest["release_status"] == "ALPHA_MATERIALIZED_NOT_RELEASED"
    assert manifest["canonical_policy_ref"] == validator.CANONICAL_POLICY_REF


def test_founder_amendment_rights_and_human_provenance_contract():
    manifest = _manifest()
    manifest_text = json.dumps(manifest)
    promote_case_ids = {
        "SG-004",
        "SG-006",
        "SG-008",
        "SG-009",
        "SG-010",
        "SG-011",
        "SG-012",
        "SG-020",
    }

    assert "approved_signal_surface" not in manifest_text
    assert all(
        case["rights_state_for_surface"]["state"] != "CLEARED"
        for case in manifest["cases"]
    )
    assert {
        case["case_id"] for case in manifest["cases"] if case["expected_decision"] == "PROMOTE"
    } == promote_case_ids

    for case in manifest["cases"]:
        assert case["human_gold_reviewer"] == "Aquiles Guerretta"
        assert case["human_gold_reviewed_at"] == "2026-09-19"
        assert case["human_gold_rationale_version"] == "founder-approved-alpha-2026-09-19"
        if case["case_id"] in promote_case_ids:
            assert case["rights_state_for_surface"] == validator.HUMAN_SIGNAL_RIGHTS

    sg019 = next(case for case in manifest["cases"] if case["case_id"] == "SG-019")
    assert sg019["candidate_event_kind"] == "EFFECTIVE_POWER_CHANGED"
    assert sg019["rights_state_for_surface"] == {
        "surface": "machine_api_redistribution",
        "state": "UNCLEAR",
        "rights_record_ref": "NIV7-EXT-ONS-OPEN-DATA-2026-09-16",
    }
    assert (sg019["expected_decision"], sg019["decision_reason_code"]) == (
        "HOLD",
        "RIGHTS_NOT_CLEARED",
    )
    assert sg019["required_caveats"] == ["Factual truth does not expand distribution rights."]


def test_validator_rejects_required_contract_failures():
    valid = _manifest()

    def without_case(manifest):
        manifest["cases"].pop()

    def duplicate_case(manifest):
        manifest["cases"][-1]["case_id"] = "SG-001"

    def wrong_version(manifest):
        manifest["cases"][0]["gold_set_version"] = "wrong"

    def invalid_decision(manifest):
        manifest["cases"][1]["expected_decision"] = "MAYBE"

    def invalid_reason_combo(manifest):
        manifest["cases"][3]["decision_reason_code"] = "NON_MATERIAL_CHANGE"

    def promoted_without_claim(manifest):
        manifest["cases"][3]["expected_factual_claim"] = None

    def hold_without_caveat(manifest):
        manifest["cases"][6]["required_caveats"] = []

    def missing_evidence_path(manifest):
        manifest["cases"][1]["evidence_refs"][0]["path"] = "tests/missing.csv"

    def controlled_diff_without_versions(manifest):
        manifest["cases"][1]["parser_version"] = None

    def sg020_without_claim_guard(manifest):
        manifest["cases"][-1].pop("claim_guard")

    def missing_canonical_policy_ref(manifest):
        manifest.pop("canonical_policy_ref")

    def wrong_human_reviewer(manifest):
        manifest["cases"][0]["human_gold_reviewer"] = "Founder-approved policy"

    def generic_human_rights_clearance(manifest):
        manifest["cases"][3]["rights_state_for_surface"]["state"] = "CLEARED"

    def sg019_rights_replaces_event(manifest):
        manifest["cases"][18]["candidate_event_kind"] = "RIGHTS_GATE_FAILURE"

    mutations = (
        without_case,
        duplicate_case,
        wrong_version,
        invalid_decision,
        invalid_reason_combo,
        promoted_without_claim,
        hold_without_caveat,
        missing_evidence_path,
        controlled_diff_without_versions,
        sg020_without_claim_guard,
        missing_canonical_policy_ref,
        wrong_human_reviewer,
        generic_human_rights_clearance,
        sg019_rights_replaces_event,
    )
    for mutation in mutations:
        manifest = copy.deepcopy(valid)
        mutation(manifest)
        with pytest.raises(validator.ManifestValidationError):
            validator.validate_manifest(manifest, REPO_ROOT)


def test_closed_contract_rejects_evidence_swaps_and_unknown_manifest_fields():
    valid = _manifest()

    def case(manifest, case_id):
        return next(item for item in manifest["cases"] if item["case_id"] == case_id)

    def swap_sg002_evidence_refs(manifest):
        case(manifest, "SG-002")["evidence_refs"] = copy.deepcopy(
            case(manifest, "SG-003")["evidence_refs"]
        )

    def change_top_level_source(manifest):
        manifest["source_id"] = "unapproved.publisher_history"

    def add_top_level_materiality_threshold(manifest):
        manifest["materiality_threshold"] = 0.01

    def add_top_level_confidence_score(manifest):
        manifest["confidence_score"] = 0.99

    def add_top_level_confidence_model(manifest):
        manifest["confidence_model"] = "unapproved"

    def add_top_level_rights_override(manifest):
        manifest["rights_override"] = "machine_api_redistribution"

    def add_case_materiality_threshold(manifest):
        case(manifest, "SG-005")["materiality_threshold"] = 0.01

    def add_case_rights_override(manifest):
        case(manifest, "SG-004")["rights_override"] = "machine_api_redistribution"

    def add_case_confidence(manifest):
        case(manifest, "SG-007")["confidence"] = 1.0

    corruptions = (
        (swap_sg002_evidence_refs, r"SG-002: frozen policy mismatch for evidence_refs"),
        (change_top_level_source, r"manifest frozen mismatch for source_id"),
        (add_top_level_materiality_threshold, r"manifest has unexpected top-level fields"),
        (add_top_level_confidence_score, r"manifest has unexpected top-level fields"),
        (add_top_level_confidence_model, r"manifest has unexpected top-level fields"),
        (add_top_level_rights_override, r"manifest has unexpected top-level fields"),
        (add_case_materiality_threshold, r"SG-005: unexpected frozen case fields"),
        (add_case_rights_override, r"SG-004: unexpected frozen case fields"),
        (add_case_confidence, r"SG-007: unexpected frozen case fields"),
    )

    for mutate, expected_message in corruptions:
        manifest = copy.deepcopy(valid)
        mutate(manifest)
        with pytest.raises(validator.ManifestValidationError, match=expected_message):
            validator.validate_manifest(manifest, REPO_ROOT)


def test_frozen_policy_contract_rejects_material_semantic_mutations():
    valid = _manifest()

    def hold_to_reject(case):
        case["expected_decision"] = "REJECT"
        case["decision_reason_code"] = "NO_PARSED_CONTENT_CHANGE"

    def corrupt_sg004_claim(case):
        case["expected_factual_claim"] = (
            "ONS corrected the plant capacity after new investment."
        )

    def corrupt_sg020_claim_and_fallback(case):
        corrupted = "ONS corrected the plant capacity after new investment."
        case["expected_factual_claim"] = corrupted
        case["claim_guard"]["fallback_claim"] = corrupted

    def corrupt_sg020_fallback_only(case):
        case["claim_guard"]["fallback_claim"] = (
            "ONS corrected the plant capacity after new investment."
        )

    def broaden_sg003_normalization(case):
        case["candidate_event_facts"]["normalization"] = (
            "trim_casefold_round_and_blank_to_zero"
        )

    def drift_event_kind(case):
        case["candidate_event_kind"] = "UNIT_REMOVED_FROM_DATASET"

    def drift_reason_code(case):
        case["decision_reason_code"] = "NON_MATERIAL_CHANGE"

    def rewrite_required_caveat(case):
        case["required_caveats"] = ["Removal means the unit no longer exists."]

    def broaden_rights(case):
        case["rights_state_for_surface"] = validator.HUMAN_SIGNAL_RIGHTS

    def change_sg001_from_snapshot(case):
        case["evidence_refs"][0]["value"] = "00000000-0000-0000-0000-000000000000"

    def change_sg001_to_snapshot(case):
        case["evidence_refs"][1]["value"] = "11111111-1111-1111-1111-111111111111"

    def change_sg001_receipt_sha(case):
        case["evidence_refs"][2]["value"] = "sha256:deadbeef;bytes:1280293"

    def change_sg001_receipt_bytes(case):
        case["evidence_refs"][2]["value"] = (
            "sha256:25fa69f8faa81cf19afa768d2dda5799481a845d276611a08ca706b9c6368916;bytes:1"
        )

    corruptions = (
        ("SG-007", hold_to_reject, "expected_decision"),
        ("SG-014", hold_to_reject, "expected_decision"),
        ("SG-015", hold_to_reject, "expected_decision"),
        ("SG-017", hold_to_reject, "expected_decision"),
        ("SG-018", hold_to_reject, "expected_decision"),
        ("SG-004", corrupt_sg004_claim, "expected_factual_claim"),
        ("SG-020", corrupt_sg020_claim_and_fallback, "expected_factual_claim"),
        ("SG-020", corrupt_sg020_fallback_only, "claim_guard"),
        ("SG-003", broaden_sg003_normalization, "candidate_event_facts"),
        ("SG-006", drift_event_kind, "candidate_event_kind"),
        ("SG-002", drift_reason_code, "decision_reason_code"),
        ("SG-007", rewrite_required_caveat, "required_caveats"),
        ("SG-007", broaden_rights, "rights_state_for_surface"),
        ("SG-001", change_sg001_from_snapshot, "evidence_refs"),
        ("SG-001", change_sg001_to_snapshot, "evidence_refs"),
        ("SG-001", change_sg001_receipt_sha, "evidence_refs"),
        ("SG-001", change_sg001_receipt_bytes, "evidence_refs"),
    )

    for case_id, mutate, expected_field in corruptions:
        manifest = copy.deepcopy(valid)
        case = next(case for case in manifest["cases"] if case["case_id"] == case_id)
        mutate(case)
        with pytest.raises(
            validator.ManifestValidationError,
            match=rf"{case_id}: frozen policy mismatch for {expected_field}",
        ):
            validator.validate_manifest(manifest, REPO_ROOT)


def test_all_fixture_backed_content_deltas_recompute_with_existing_parser_and_diff():
    for case in _manifest()["cases"]:
        if case["deterministic_result_kind"] != "CONTENT_DELTA":
            continue
        _assert_content_delta(case)


def test_sg003_bytes_differ_but_parsed_content_does_not():
    case = _case("SG-003")
    delta = _delta_for(case)

    assert _evidence_bytes(case, "from") != _evidence_bytes(case, "to")
    assert delta.content_equal is True
    assert delta.added == delta.removed == delta.changed == []
    assert case["expected_decision"] == "REJECT"
    assert case["decision_reason_code"] == "NO_PARSED_CONTENT_CHANGE"


def test_sg004_exact_material_effective_power_delta_and_claim_contract():
    case = _case("SG-004")
    delta = _delta_for(case)

    assert _serialise_delta(delta)["changed"] == [
        {
            "identity": "TEST-EQ-002",
            "changes": [
                {"field": "val_potenciaefetiva", "before": "20.0", "after": "22.5"}
            ],
        }
    ]
    assert case["expected_decision"] == "PROMOTE"
    assert "ONS corrected the capacity" in case["forbidden_claims"]
    assert any("plant expanded" in claim for claim in case["forbidden_claims"])
    assert any("owner invested in new equipment" in claim for claim in case["forbidden_claims"])


def test_sg005_has_a_real_delta_but_the_approved_decision_remains_reject():
    case = _case("SG-005")
    delta = _delta_for(case)

    assert delta.content_equal is False
    assert _serialise_delta(delta)["changed"] == [
        {
            "identity": "TEST-GOLD-005",
            "changes": [
                {"field": "val_potenciaefetiva", "before": "20.00", "after": "20.01"}
            ],
        }
    ]
    assert (case["expected_decision"], case["decision_reason_code"]) == (
        "REJECT",
        "NON_MATERIAL_CHANGE",
    )
    assert any(
        "universal numeric materiality threshold" in claim
        for claim in case["forbidden_claims"]
    )


def test_sg006_and_sg007_isolate_the_approved_added_and_removed_candidate_events():
    added_case = _case("SG-006")
    removed_case = _case("SG-007")

    assert _delta_for(added_case).added == ["TEST-EQ-004"]
    assert added_case["candidate_event_facts"]["identity"] == "TEST-EQ-004"
    assert _delta_for(removed_case).removed == ["TEST-EQ-003"]
    assert removed_case["candidate_event_facts"]["identity"] == "TEST-EQ-003"
    assert removed_case["required_caveats"] == ["Absence is not zero."]


@pytest.mark.parametrize(
    ("case_id", "field"),
    [
        ("SG-008", "dat_entradaoperacao"),
        ("SG-009", "dat_desativacao"),
        ("SG-010", "nom_agenteproprietario"),
        ("SG-011", "nom_agenteoperador"),
        ("SG-012", "nom_combustivel"),
        ("SG-013", "nom_unidadegeradora"),
        ("SG-014", "nom_modalidadeoperacao"),
    ],
)
def test_sg008_through_sg014_each_change_exactly_one_approved_field(case_id, field):
    case = _case(case_id)
    delta = _delta_for(case)

    assert delta.added == []
    assert delta.removed == []
    assert len(delta.changed) == 1
    assert len(delta.changed[0].changes) == 1
    change = delta.changed[0].changes[0]
    assert change.field == field
    assert {"field": change.field, "before": change.before, "after": change.after} == {
        key: case["candidate_event_facts"][key] for key in ("field", "before", "after")
    }


def test_sg015_and_sg016_fail_closed_with_the_approved_error_classes():
    schema_case = _case("SG-015")
    duplicate_case = _case("SG-016")

    with pytest.raises(SchemaError):
        parse_capacidade_geracao(_evidence_bytes(schema_case, "payload"))
    with pytest.raises(DuplicateRowIdentityError):
        parse_capacidade_geracao(_evidence_bytes(duplicate_case, "payload"))

    assert schema_case["candidate_event_facts"]["error_class"] == "SchemaError"
    assert duplicate_case["candidate_event_facts"]["error_class"] == "DuplicateRowIdentityError"


def test_sg017_through_sg019_are_honest_controlled_contexts():
    for case_id, expected_kind in (
        ("SG-017", "SOURCE_HEALTH"),
        ("SG-018", "EVIDENCE_GAP"),
        ("SG-019", "RIGHTS_GATE"),
    ):
        case = _case(case_id)
        context = _context(case)
        assert case["evidence_kind"] == "CONTROLLED_CONTEXT"
        assert context["controlled"] is True
        assert context["not_publisher_history"] is True
        assert context["context_kind"] == expected_kind

    assert _case("SG-017")["source_health_state"] == "UNAVAILABLE"
    assert _case("SG-018")["candidate_event_facts"]["required_evidence_reconstructible"] is False
    sg019 = _case("SG-019")
    sg019_context = _context(sg019)
    assert sg019["candidate_event_kind"] == "EFFECTIVE_POWER_CHANGED"
    assert sg019_context["intended_surface"] == "machine_api_redistribution"
    assert sg019_context["rights_state"] == "UNCLEAR"
    assert sg019_context["rights_record_ref"] == "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"
    assert sg019_context["invariant"] == "Factual truth does not expand distribution rights."


def test_controlled_context_contract_rejects_semantic_mutations():
    manifest = _manifest()
    valid_contexts = validator.load_controlled_contexts(REPO_ROOT)

    def sg017_health_broadened(contexts):
        contexts["SG-017"]["source_health_state"] = "HEALTHY_COMPLETE"

    def sg017_prohibition_reversed(contexts):
        contexts["SG-017"]["prohibition"] = (
            "Treat source unavailability as asset absence and zero capacity."
        )

    def sg018_evidence_available(contexts):
        contexts["SG-018"]["required_evidence_available"] = True

    def sg018_claims_reconstructibility(contexts):
        contexts["SG-018"]["observation"] = (
            "The candidate is fully reconstructible from its evidence reference."
        )

    def sg019_rights_cleared(contexts):
        contexts["SG-019"]["rights_state"] = "CLEARED"

    def sg019_surface_changed(contexts):
        contexts["SG-019"]["intended_surface"] = "human_signal_display"

    def sg019_broader_rights_added(contexts):
        contexts["SG-019"]["redistribution_allowed"] = True

    def sg019_invariant_removed(contexts):
        contexts["SG-019"].pop("invariant")

    def sg020_safe_candidate_wording(contexts):
        contexts["SG-020"]["candidate_wording"] = _case("SG-004")[
            "expected_factual_claim"
        ]

    def sg020_narrowed_prohibitions(contexts):
        contexts["SG-020"]["prohibited_reason_codes"] = [
            "UNSUPPORTED_CAUSALITY"
        ]

    def sg020_passes(contexts):
        contexts["SG-020"]["result"] = "PASS"

    def sg020_reason_changed(contexts):
        contexts["SG-020"]["reason_code"] = "UNSUPPORTED_PUBLISHER_REVISION"

    def sg020_fallback_changed(contexts):
        contexts["SG-020"]["fallback_claim"] = "ONS corrected the capacity."

    corruptions = (
        (sg017_health_broadened, "SG-017: controlled context mismatch for source_health_state"),
        (sg017_prohibition_reversed, "SG-017: controlled context mismatch for prohibition"),
        (sg018_evidence_available, "SG-018: controlled context mismatch for required_evidence_available"),
        (sg018_claims_reconstructibility, "SG-018: controlled context mismatch for observation"),
        (sg019_rights_cleared, "SG-019: controlled context mismatch for rights_state"),
        (sg019_surface_changed, "SG-019: controlled context mismatch for intended_surface"),
        (sg019_broader_rights_added, "SG-019: controlled context has unexpected fields"),
        (sg019_invariant_removed, "SG-019: controlled context is missing invariant"),
        (sg020_safe_candidate_wording, "SG-020: controlled context mismatch for candidate_wording"),
        (sg020_narrowed_prohibitions, "SG-020: controlled context mismatch for prohibited_reason_codes"),
        (sg020_passes, "SG-020: controlled context mismatch for result"),
        (sg020_reason_changed, "SG-020: controlled context mismatch for reason_code"),
        (sg020_fallback_changed, "SG-020: controlled context mismatch for fallback_claim"),
    )

    for mutate, expected_message in corruptions:
        contexts = copy.deepcopy(valid_contexts)
        mutate(contexts)
        with pytest.raises(validator.ManifestValidationError, match=expected_message):
            validator.validate_controlled_contexts(
                manifest,
                REPO_ROOT,
                context_payloads=contexts,
            )

    for case_id in ("SG-017", "SG-018", "SG-019", "SG-020"):
        contexts = copy.deepcopy(valid_contexts)
        contexts[case_id]["unknown_policy_field"] = "must fail closed"
        with pytest.raises(
            validator.ManifestValidationError,
            match=rf"{case_id}: controlled context has unexpected fields",
        ):
            validator.validate_controlled_contexts(
                manifest,
                REPO_ROOT,
                context_payloads=contexts,
            )


def test_sg020_promotes_the_event_but_rejects_unsupported_causal_wording():
    sg004 = _case("SG-004")
    case = _case("SG-020")
    context = _context(case)
    claim_guard = case["claim_guard"]

    assert _serialise_delta(_delta_for(case)) == case["content_delta"]
    assert (case["expected_decision"], case["decision_reason_code"]) == (
        "PROMOTE",
        "MATERIAL_RECONSTRUCTIBLE_CHANGE",
    )
    assert claim_guard["result"] == context["result"] == "FAIL"
    assert claim_guard["reason_code"] == context["reason_code"] == "UNSUPPORTED_CAUSALITY"
    assert claim_guard["candidate_wording"] == context["candidate_wording"]
    assert claim_guard["prohibited_reason_codes"] == context["prohibited_reason_codes"]
    assert claim_guard["fallback_claim"] == context["fallback_claim"]
    assert claim_guard["fallback_claim"] == sg004["expected_factual_claim"]
    assert "UNSUPPORTED_PUBLISHER_REVISION" in claim_guard["prohibited_reason_codes"]


def test_all_cases_carry_the_approved_claim_contract_and_consistent_versions():
    for case in _manifest()["cases"]:
        assert case["gold_set_version"] == "argos.signal-gold.ons-capacidade@0.1-alpha"
        assert case["human_gold_reviewer"] == "Aquiles Guerretta"
        assert case["forbidden_claims"]
        assert case["required_evidence_refs"]
        if case["expected_decision"] == "PROMOTE":
            assert case["expected_factual_claim"]
