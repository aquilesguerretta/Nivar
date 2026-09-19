"""Regression tests for the Founder-approved NIV-45 Signal Gold Set v0.1-alpha."""

from __future__ import annotations

import copy
import importlib.util
import json
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


def _evidence_bytes(case: dict, role: str) -> bytes:
    ref = next(ref for ref in case["evidence_refs"] if ref["role"] == role)
    return (REPO_ROOT / ref["path"]).read_bytes()


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


def _delta_for(case: dict):
    return diff_capacidade_geracao(
        parse_capacidade_geracao(_evidence_bytes(case, "from")),
        parse_capacidade_geracao(_evidence_bytes(case, "to")),
    )


def _context(case: dict) -> dict:
    ref = next(ref for ref in case["evidence_refs"] if ref["role"].endswith("context"))
    return json.loads((REPO_ROOT / ref["path"]).read_text(encoding="utf-8"))


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
        assert case["parser_version"] == PARSER_VERSION
        assert case["diff_version"] == DIFF_VERSION
        assert _evidence_bytes(case, "from") != _evidence_bytes(case, "to")
        assert _serialise_delta(_delta_for(case)) == case["content_delta"]


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
