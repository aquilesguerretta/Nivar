import json
from dataclasses import replace
from datetime import date, timedelta

import pytest

from app.services.argos_entity_linker import IdentityLinker, Status
from app.services.argos_entity_linker.model import (
    CHINA, J3_CHINA, Authority, Basis, Effect, Identifier, Namespace, ObjectRef,
    Predicate, Role, Scope, Triple,
)
from .sample import (
    AREA, AS_OF, CNODC, CNODC_CNPJ, CNOOC, CNOOC_CNPJ, CONTEXT, FIELD, INSTALLATION,
    PETROBRAS, PETROBRAS_CIK, PETROBRAS_CNPJ, PROFILE, RESERVOIR, SHIPOWNER, TRANSFER_DATE,
    UNION, VESSEL, fixture_assertion, fixture_assertions, fixture_policy, sample_payload,
)


INTEREST = Predicate.CONTRACTUAL_PARTICIPATING_INTEREST


@pytest.fixture
def linker():
    return IdentityLinker(fixture_assertions(), can_read=fixture_policy)


def test_j3_china_is_an_exact_jurisdiction_alias(linker):
    result = linker.read(J3_CHINA, Predicate.SAME_AS, CONTEXT)
    assert result.status is Status.RESOLVED
    assert result.data.triple.object == CHINA
    assert result.data.provenance[0].authority is Authority.JURISDICTION_CROSSWALK
    assert linker.read(CHINA, Predicate.SAME_AS, CONTEXT).status is Status.UNKNOWN


def test_china_statistical_boundary_or_wrong_authority_cannot_prove_same_jurisdiction():
    with pytest.raises(ValueError, match="national jurisdiction"):
        ObjectRef(CHINA.id, Scope.STATISTICAL_TERRITORY)
    mainland = ObjectRef("synthetic:mainland-china", Scope.STATISTICAL_TERRITORY)
    with pytest.raises(ValueError, match="scopes"):
        fixture_assertion(Triple(J3_CHINA, Predicate.SAME_AS, mainland),
                          Authority.JURISDICTION_CROSSWALK, "invalid-territory")
    with pytest.raises(ValueError, match="Source authority"):
        fixture_assertion(Triple(J3_CHINA, Predicate.SAME_AS, CHINA),
                          Authority.SOURCE_ATTRIBUTED_NAME, "invalid-authority")


def test_petrobras_profile_and_identifier_namespaces_use_distinct_bridges(linker):
    profile = linker.read(PROFILE, Predicate.PROFILE_ANCHOR, CONTEXT)
    cnpj = linker.read(PETROBRAS_CNPJ, Predicate.IDENTIFIES, CONTEXT)
    cik = linker.read(PETROBRAS_CIK, Predicate.IDENTIFIES, CONTEXT)
    assert profile.data.triple.object == cnpj.data.triple.object == cik.data.triple.object == PETROBRAS
    assert PROFILE != PETROBRAS
    assert PETROBRAS_CNPJ.namespace != PETROBRAS_CIK.namespace
    assert cnpj.data.provenance[0].pin.source_id != cik.data.provenance[0].pin.source_id
    assert linker.read(PROFILE, Predicate.SAME_AS, CONTEXT).status is Status.UNKNOWN
    for namespace, value in [(Namespace.CNPJ, "33000167"), (Namespace.CIK, "1119639")]:
        with pytest.raises(ValueError, match="normalized"):
            Identifier(namespace, value)


def test_profile_cannot_be_merged_or_hold_a_legal_identifier():
    with pytest.raises(ValueError, match="scopes"):
        fixture_assertion(Triple(PROFILE, Predicate.SAME_AS, PETROBRAS),
                          Authority.SAME_OBJECT_BRIDGE, "invalid-profile")
    with pytest.raises(ValueError, match="registered legal entity"):
        fixture_assertion(Triple(PETROBRAS_CNPJ, Predicate.IDENTIFIES, PROFILE),
                          Authority.LEGAL_IDENTIFIER_BRIDGE, "invalid-registration")


@pytest.mark.parametrize("label", ["CNODC", "CNOOC", "Petrobras", "Mero", "China"])
def test_ambiguous_or_untyped_names_are_unresolved(linker, label):
    result = linker.read(label, Predicate.SAME_AS, CONTEXT)
    assert result.to_dict() == {"status": "UNRESOLVED", "reason": "typed_subject_required", "data": None}


def test_cnodc_and_cnooc_remain_independent_even_with_same_source_label():
    name_rows = [
        fixture_assertion(Triple(company, Predicate.NAME, "Common company label"),
                          Authority.SOURCE_ATTRIBUTED_NAME, company.id)
        for company in (CNODC, CNOOC)
    ]
    rows = [*fixture_assertions(), *name_rows]
    linker = IdentityLinker(rows, can_read=lambda *_: True)
    c1 = linker.read(CNODC_CNPJ, Predicate.IDENTIFIES, CONTEXT)
    c2 = linker.read(CNOOC_CNPJ, Predicate.IDENTIFIES, CONTEXT)
    assert c1.data.triple.object == CNODC
    assert c2.data.triple.object == CNOOC
    assert all(linker.read(row.triple.subject, Predicate.NAME, CONTEXT).status is Status.RESOLVED
               for row in name_rows)
    assert linker.read(CNODC, Predicate.SAME_AS, CONTEXT).status is Status.UNKNOWN


@pytest.mark.parametrize("target", [AREA, RESERVOIR, VESSEL, INSTALLATION])
def test_mero_field_does_not_merge_with_reservoir_contract_vessel_or_installation(target):
    with pytest.raises(ValueError, match="scopes"):
        fixture_assertion(Triple(FIELD, Predicate.SAME_AS, target),
                          Authority.SAME_OBJECT_BRIDGE, "invalid-asset")


def test_same_ref_cannot_change_asset_granularity_across_sources():
    other = ObjectRef(FIELD.id, Scope.FPSO)
    label = fixture_assertion(Triple(other, Predicate.NAME, "Named asset"), Authority.SOURCE_ATTRIBUTED_NAME, "label")
    with pytest.raises(ValueError, match="different scopes"):
        IdentityLinker([*fixture_assertions(), label])


def test_explicit_same_scope_bridge_never_implies_a_transitive_link():
    candidate = ObjectRef("synthetic:field:candidate", Scope.OIL_FIELD)
    second = ObjectRef("synthetic:field:second", Scope.OIL_FIELD)
    rows = [
        fixture_assertion(Triple(candidate, Predicate.SAME_AS, second), Authority.SAME_OBJECT_BRIDGE, "bridge-1"),
        fixture_assertion(Triple(second, Predicate.SAME_AS, FIELD), Authority.SAME_OBJECT_BRIDGE, "bridge-2"),
    ]
    linker = IdentityLinker(rows, can_read=lambda *_: True)
    assert linker.read(candidate, Predicate.SAME_AS, CONTEXT).data.triple.object == second
    assert linker.read(FIELD, Predicate.SAME_AS, CONTEXT).status is Status.UNKNOWN


def test_operator_title_and_governance_are_independent(linker):
    operator = linker.read(PETROBRAS, Predicate.OPERATOR, CONTEXT, basis=Basis.FIELD_OPERATION)
    title = linker.read(SHIPOWNER, Predicate.ASSET_OWNER, CONTEXT, basis=Basis.VESSEL_TITLE)
    governance = linker.read(UNION, Predicate.GOVERNANCE_CONTROL, CONTEXT, basis=Basis.ISSUER_VOTING_SHARES)
    assert operator.data.triple.object == FIELD
    assert title.data.triple.object == VESSEL
    assert governance.data.triple.object == PETROBRAS
    assert governance.data.triple.role.share_bps == 5026
    assert linker.read(PETROBRAS, Predicate.ASSET_OWNER, CONTEXT, basis=Basis.VESSEL_TITLE).status is Status.UNKNOWN
    assert linker.read(UNION, Predicate.OPERATOR, CONTEXT, basis=Basis.FIELD_OPERATION).status is Status.UNKNOWN
    with pytest.raises(ValueError, match="Source authority"):
        fixture_assertion(Triple(PETROBRAS, Predicate.ASSET_OWNER, VESSEL,
                                Role(Basis.VESSEL_TITLE, "synthetic:operations")),
                          Authority.OPERATION_RECORD, "operation-is-not-title")


@pytest.mark.parametrize(("basis", "effect", "target", "share_bps"), [
    (Basis.WHOLE_SHARED_RESERVOIR, Effect.ESTABLISHED, RESERVOIR, 3860),
    (Basis.CONTRACTED_AREA, Effect.ESTABLISHED, AREA, 4000),
    (Basis.ACQUIRED_BLOCK, Effect.CONDITIONAL, RESERVOIR, 8000),
])
def test_mero_shares_keep_their_denominator(linker, basis, effect, target, share_bps):
    result = linker.read(PETROBRAS, INTEREST, CONTEXT, basis=basis, effect=effect)
    assert result.data.triple.object == target
    assert result.data.triple.role.basis is basis
    assert result.data.triple.role.share_bps == share_bps
    assert linker.read(PETROBRAS, INTEREST, CONTEXT).status is Status.UNKNOWN


def test_participation_requires_compatible_predicate_scope_and_denominator():
    with pytest.raises(ValueError, match="scope"):
        fixture_assertion(Triple(PETROBRAS, INTEREST, VESSEL,
                                Role(Basis.WHOLE_SHARED_RESERVOIR, "synthetic:instrument", 3860)),
                          Authority.EFFECTIVE_PARTICIPATION, "wrong-object")
    with pytest.raises(ValueError, match="stated denominator"):
        fixture_assertion(Triple(PETROBRAS, INTEREST, AREA, Role(Basis.CONTRACTED_AREA, "synthetic:instrument")),
                          Authority.EFFECTIVE_PARTICIPATION, "no-share")
    with pytest.raises(ValueError, match="Auction allocation"):
        fixture_assertion(Triple(PETROBRAS, INTEREST, RESERVOIR,
                                Role(Basis.ACQUIRED_BLOCK, "synthetic:instrument", 8000)),
                          Authority.EFFECTIVE_PARTICIPATION, "invalid-auction")


@pytest.mark.parametrize(("as_of", "status"), [
    (AS_OF, Status.RESOLVED),
    (TRANSFER_DATE, Status.UNKNOWN),
    (date(2028, 1, 1), Status.UNKNOWN),
])
def test_clock_cannot_promote_2027_projection(linker, as_of, status):
    context = replace(CONTEXT, as_of=as_of, known_at=CONTEXT.known_at + timedelta(days=600))
    effective = linker.read(PETROBRAS, INTEREST, context, basis=Basis.WHOLE_SHARED_RESERVOIR)
    forecast = linker.read(PETROBRAS, INTEREST, context,
                           basis=Basis.WHOLE_SHARED_RESERVOIR, effect=Effect.CONDITIONAL)
    assert effective.status is status
    if status is Status.RESOLVED:
        assert effective.data.triple.role.share_bps == 3860
    else:
        assert effective.data is None
    assert forecast.data.triple.role.share_bps == 4140
    assert forecast.data.triple.role.scheduled_for == TRANSFER_DATE
    assert linker.read(PETROBRAS, INTEREST, context, basis=Basis.WHOLE_SHARED_RESERVOIR,
                       pin=forecast.data.provenance[0].pin).status is Status.UNKNOWN


def test_signed_transfer_alone_cannot_prove_effective_participation():
    role = Role(Basis.WHOLE_SHARED_RESERVOIR, "synthetic:instrument:signed", 4140)
    with pytest.raises(ValueError, match="Source authority"):
        fixture_assertion(Triple(PETROBRAS, INTEREST, RESERVOIR, role),
                          Authority.ANNOUNCED_PARTICIPATION, "invalid-transfer")


def test_explicit_effectiveness_evidence_can_replace_forecast_from_its_effective_date():
    forecast = fixture_assertions()[-1]
    completion = replace(
        forecast,
        triple=replace(forecast.triple, role=replace(forecast.triple.role,
                                                    effect=Effect.ESTABLISHED, scheduled_for=None)),
        pin=replace(forecast.pin, document_version="v2-confirmed", fact_version=2),
        authority=Authority.EFFECTIVE_PARTICIPATION,
        known_at=CONTEXT.known_at + timedelta(days=150),
        valid_from=TRANSFER_DATE,
    )
    context = replace(CONTEXT, known_at=completion.known_at, as_of=TRANSFER_DATE)
    linker = IdentityLinker([forecast, completion], can_read=lambda *_: True)
    assert linker.read(PETROBRAS, INTEREST, context,
                       basis=Basis.WHOLE_SHARED_RESERVOIR).data.triple.role.share_bps == 4140
    earlier = replace(context, as_of=TRANSFER_DATE - timedelta(days=1))
    assert linker.read(PETROBRAS, INTEREST, earlier, basis=Basis.WHOLE_SHARED_RESERVOIR).status is Status.UNKNOWN
    replay = replace(context, known_at=CONTEXT.known_at)
    assert linker.read(PETROBRAS, INTEREST, replay, basis=Basis.WHOLE_SHARED_RESERVOIR).status is Status.UNKNOWN


@pytest.fixture
def names():
    initial = fixture_assertion(Triple(PETROBRAS, Predicate.NAME, "Synthetic label v1"),
                                Authority.SOURCE_ATTRIBUTED_NAME, "label", source="editor")
    correction = replace(
        initial, triple=replace(initial.triple, object="Synthetic label v2"),
        pin=replace(initial.pin, fact_version=2, document_version="2026-edition-b"),
        known_at=initial.known_at + timedelta(days=2),
    )
    other = fixture_assertion(Triple(PETROBRAS, Predicate.NAME, "Distinct source label"),
                              Authority.SOURCE_ATTRIBUTED_NAME, "label", source="catalog")
    return initial, correction, other


def test_exact_pin_and_known_at_are_independent_of_as_of(names):
    v1, v2, _ = names
    linker = IdentityLinker([v2, v1], can_read=lambda *_: True)
    new_context = replace(CONTEXT, known_at=v2.known_at)
    assert linker.read(PETROBRAS, Predicate.NAME, new_context).data.triple.object == v2.triple.object
    assert linker.read(PETROBRAS, Predicate.NAME, CONTEXT).data.triple.object == v1.triple.object
    assert linker.read(PETROBRAS, Predicate.NAME, new_context, pin=v1.pin).data.triple.object == v1.triple.object
    assert linker.read(PETROBRAS, Predicate.NAME, CONTEXT, pin=v2.pin).status is Status.UNKNOWN
    for pin in [replace(v2.pin, document_version="wrong-version"), replace(v2.pin, fact_version=99)]:
        assert linker.read(PETROBRAS, Predicate.NAME, new_context, pin=pin).status is Status.UNKNOWN
    assert linker.read(CNOOC, Predicate.NAME, new_context, pin=v2.pin).status is Status.UNKNOWN


def test_source_specific_resolution_avoids_cross_source_latest_wins(names):
    v1, v2, other = names
    context = replace(CONTEXT, known_at=v2.known_at)
    linker = IdentityLinker([v1, other, v2], can_read=lambda *_: True)
    assert linker.read(PETROBRAS, Predicate.NAME, context).status is Status.UNRESOLVED
    assert linker.read(PETROBRAS, Predicate.NAME, context, source_id=other.pin.source_id).data.triple.object == (
        other.triple.object
    )
    assert linker.read(PETROBRAS, Predicate.NAME, context,
                       source_id=other.pin.source_id, pin=v2.pin).status is Status.UNKNOWN


def test_scope_correction_does_not_resurrect_superseded_version(names):
    v1, v2, _ = names
    narrower = replace(v2, valid_from=AS_OF + timedelta(days=1), valid_to=AS_OF + timedelta(days=6))
    linker = IdentityLinker([v1, narrower], can_read=lambda *_: True)
    context = replace(CONTEXT, known_at=narrower.known_at)
    assert linker.read(PETROBRAS, Predicate.NAME, context).status is Status.UNKNOWN
    for as_of, expected in [(narrower.valid_from, Status.RESOLVED), (narrower.valid_to, Status.UNKNOWN)]:
        assert linker.read(PETROBRAS, Predicate.NAME, replace(context, as_of=as_of)).status is expected


def test_typed_input_order_does_not_change_result_or_provenance(names):
    v1, v2, other = names
    matching = replace(other, triple=v2.triple)
    rows = [v1, v2, matching]
    context = replace(CONTEXT, known_at=v2.known_at)
    first = IdentityLinker(rows, can_read=lambda *_: True).read(PETROBRAS, Predicate.NAME, context)
    second = IdentityLinker(reversed(rows), can_read=lambda *_: True).read(PETROBRAS, Predicate.NAME, context)
    assert first.to_dict() == second.to_dict()
    assert {record.pin for record in first.data.provenance} == {v2.pin, matching.pin}


def test_inconsistent_or_duplicate_fact_stream_is_rejected(names):
    v1, v2, _ = names
    with pytest.raises(ValueError, match="Duplicate"):
        IdentityLinker([v1, replace(v1, pin=replace(v1.pin, document_version="other-version"))])
    with pytest.raises(ValueError, match="keep its subject"):
        IdentityLinker([v1, replace(v2, triple=replace(v2.triple, subject=CNOOC))])


def test_default_and_channel_rights_never_return_reference_or_content(linker):
    denied = {"status": "RESTRICTED", "reason": "rights_not_granted", "data": None}
    assert IdentityLinker(fixture_assertions()).read(J3_CHINA, Predicate.SAME_AS, CONTEXT).to_dict() == denied
    for channel in ("public_display", "client_display", "api", "export", "unknown"):
        context = replace(CONTEXT, channel=channel)
        assert linker.read(J3_CHINA, Predicate.SAME_AS, context).to_dict() == denied


def test_current_policy_revokes_historic_pin_and_prevents_latest_fallback(names):
    v1, v2, other = names
    grants = {v1.pin}
    linker = IdentityLinker([v1, v2, other], can_read=lambda pin, _: pin in grants)
    context = replace(CONTEXT, known_at=v2.known_at)
    assert linker.read(PETROBRAS, Predicate.NAME, context, source_id=v1.pin.source_id).status is Status.RESTRICTED
    assert linker.read(PETROBRAS, Predicate.NAME, CONTEXT, pin=v1.pin).status is Status.RESOLVED
    grants.clear()
    result = linker.read(PETROBRAS, Predicate.NAME, CONTEXT, pin=v1.pin)
    assert result.status is Status.RESTRICTED
    assert result.data is None


def test_restricted_conflict_is_opaque(names):
    v1, _, other = names
    linker = IdentityLinker([v1, other], can_read=lambda pin, _: pin == v1.pin)
    result = linker.read(PETROBRAS, Predicate.NAME, CONTEXT)
    assert result.status is Status.RESTRICTED
    assert result.data is None


def test_read_only_sample_returns_synthetic_typed_json_with_redaction():
    payload = json.loads(json.dumps(sample_payload()))
    assert payload["synthetic"] is True
    assert len(payload["triples"]) == len(fixture_assertions())
    assert all(item["status"] == "RESOLVED" for item in payload["triples"])
    assert payload["later_as_of_same_known_at"]["established"]["status"] == "UNKNOWN"
    assert payload["later_as_of_same_known_at"]["conditional"]["data"]["triple"]["role"]["share_bps"] == 4140
    assert payload["name_only"]["status"] == "UNRESOLVED"
    assert payload["public_channel"]["data"] is None
