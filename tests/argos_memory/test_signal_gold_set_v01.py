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
    )
    for mutation in mutations:
        manifest = copy.deepcopy(valid)
        mutation(manifest)
        with pytest.raises(validator.ManifestValidationError):
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
    assert _case("SG-019")["rights_state_for_surface"]["state"] == "NOT_CLEARED"
    assert _context(_case("SG-019"))["invariant"] == "Factual truth does not expand distribution rights."


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
    assert claim_guard["fallback_claim"] == sg004["expected_factual_claim"]
    assert "UNSUPPORTED_PUBLISHER_REVISION" in claim_guard["prohibited_reason_codes"]


def test_all_cases_carry_the_approved_claim_contract_and_consistent_versions():
    for case in _manifest()["cases"]:
        assert case["gold_set_version"] == "argos.signal-gold.ons-capacidade@0.1-alpha"
        assert case["forbidden_claims"]
        assert case["required_evidence_refs"]
        if case["expected_decision"] == "PROMOTE":
            assert case["expected_factual_claim"]
