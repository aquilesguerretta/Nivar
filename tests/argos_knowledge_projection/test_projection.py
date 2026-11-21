"""Bitemporal, rights, malformed-reference and synthetic J2 acceptance cases."""

import json
from dataclasses import replace
from datetime import date, datetime, timezone

import pytest

from app.services.argos_knowledge_projection import (
    Capability, CatalogObject, Claim, ComparisonBasis, ContractScope, Document,
    EffectivePeriod, EvidenceRef, Fact, KnowledgeProjection, ObjectType, Observation,
    Predicate, ReadContext, Relation, Source, VersionRef,
)


def utc(y, m, d):
    return datetime(y, m, d, tzinfo=timezone.utc)


SOURCE = Source("fixture.editorial", "TEST FIXTURE")
LOCATOR = "synthetic test table"
DOC1 = Document(
    VersionRef("document:fixture", "edition-1"), SOURCE.id, "Fixture original",
    frozenset({LOCATOR}), published_on="2025-02-05", known_at=utc(2025, 2, 10),
    retrieved_at=utc(2025, 2, 8), official_url="https://example.invalid/edition-1",
)
DOC2 = replace(
    DOC1, ref=VersionRef(DOC1.ref.id, "edition-2"), supersedes=DOC1.ref.version,
    title="Fixture correction", published_on="2025-05-10", known_at=utc(2025, 5, 16),
    retrieved_at=utc(2025, 5, 15), official_url="https://example.invalid/edition-2",
)
COUNTRY = CatalogObject("country:CHN", ObjectType.COUNTRY, "China")
WAFER = CatalogObject("element:wafer", ObjectType.TECHNOLOGY_ELEMENT, "Wafers")
BASIS = ComparisonBasis("manufacturing-capacity", "%", "global capacity", "territorial", "fixture method", "2024", "wafer")
ORIGINAL = Fact(
    VersionRef("observation:fixture", "v1"), COUNTRY.id, Observation("estimated", 91, BASIS),
    (EvidenceRef(DOC1.ref, LOCATOR),), effective=EffectivePeriod(date(2024, 12, 31)),
    known_at=DOC1.known_at, published_on=DOC1.published_on,
    relations=(Relation(Predicate.COUNTRY_MANUFACTURES, WAFER.id),),
)
CORRECTION = replace(
    ORIGINAL, ref=VersionRef(ORIGINAL.ref.id, "v2"), value=replace(ORIGINAL.value, value=92),
    evidence=(EvidenceRef(DOC2.ref, LOCATOR),), supersedes=ORIGINAL.ref.version,
    known_at=DOC2.known_at, published_on=DOC2.published_on,
)
EARLY = ReadContext(date(2025, 1, 1), utc(2025, 3, 2))
LATE = ReadContext(EARLY.as_of, utc(2025, 6, 1))


def allow_fixture(source, document, channel, use):
    return source == SOURCE.id and channel == "local"


def projection(*, objects=(COUNTRY, WAFER), facts=(ORIGINAL, CORRECTION),
               documents=(DOC1, DOC2), sources=(SOURCE,), rights=allow_fixture):
    return KnowledgeProjection(objects=objects, sources=sources, documents=documents, facts=facts, rights=rights)


def test_valid_on_known_on_and_exact_history_are_independent():
    model = projection()
    for context, fact, doc in ((EARLY, ORIGINAL, DOC1), (LATE, CORRECTION, DOC2)):
        selected = model.read_fact(fact.ref.id, context)
        assert selected["data"]["value"]["value"] == fact.value.value
        assert selected["data"]["effective_from"] == "2024-12-31"
        assert selected["data"]["views"] == sorted([COUNTRY.id, WAFER.id])
        for item in (COUNTRY, WAFER):
            view = model.read_object(item.id, context)["data"]
            assert view["facts"] == [selected["data"]["ref"]]
            assert view["relations"][0]["fact"] == selected["data"]["ref"]
            assert '"value"' not in json.dumps(view)
        evidence = model.read_evidence(fact.ref, context)["data"]["evidence"][0]
        assert evidence["source"]["id"] == SOURCE.id
        assert evidence["document"]["ref"]["version"] == doc.ref.version
        assert evidence["document"]["known_at"] == doc.known_at.isoformat()
        assert evidence["document"]["retrieved_at"] == doc.retrieved_at.isoformat()
    assert model.read_fact(ORIGINAL.ref, LATE)["data"]["value"]["value"] == 91
    assert model.read_fact(CORRECTION.ref, EARLY)["status"] == "UNKNOWN"
    assert model.read_fact(CORRECTION.ref, replace(LATE, as_of=date(2024, 1, 1)))["status"] == "UNKNOWN"
    assert model.read_evidence(ORIGINAL.ref, LATE, document=DOC2.ref)["status"] == "UNRESOLVED"
    assert model.read_evidence(ORIGINAL.ref, LATE, document=DOC1.ref, locator=LOCATOR)["status"] == "RESOLVED"


def test_current_rights_apply_to_old_versions_and_all_outputs():
    grants = set()

    def policy(source, document, channel, use):
        return (source, document, channel, use) in grants

    model = projection(rights=policy)
    for use in (Capability.FACT, Capability.EVIDENCE_METADATA, Capability.EVIDENCE_LINK):
        grants.add((SOURCE.id, DOC1.ref, "local", use))
    assert model.read_fact(ORIGINAL.ref, LATE)["status"] == "RESOLVED"
    assert model.read_fact(ORIGINAL.ref.id, LATE)["status"] == "RESTRICTED"  # no fallback
    assert model.read_object(COUNTRY.id, LATE)["data"]["facts"] == []
    assert model.read_object(WAFER.id, LATE)["data"]["relations"] == []
    assert model.read_evidence(ORIGINAL.ref, EARLY)["data"]["evidence"][0]["document"]["official_url"]
    grants.remove((SOURCE.id, DOC1.ref, "local", Capability.EVIDENCE_LINK))
    assert model.read_evidence(ORIGINAL.ref, EARLY)["data"]["evidence"][0]["document"]["official_url"] is None
    grants.remove((SOURCE.id, DOC1.ref, "local", Capability.FACT))
    assert model.read_fact(ORIGINAL.ref, EARLY)["data"] is None
    assert model.read_evidence(ORIGINAL.ref, EARLY)["status"] == "RESOLVED"
    grants.clear()
    denied = model.read_evidence(ORIGINAL.ref, EARLY)
    assert denied == {"status": "RESTRICTED", "reason": "use_denied", "data": None}
    assert model.read_fact(ORIGINAL.ref, replace(EARLY, channel="external_api"))["status"] == "RESTRICTED"


@pytest.mark.parametrize("proof,documents,sources", [
    (EvidenceRef(VersionRef(DOC1.ref.id, "missing"), LOCATOR), (DOC1,), (SOURCE,)),
    (EvidenceRef(DOC1.ref, "unreviewed locator"), (DOC1,), (SOURCE,)),
    (EvidenceRef(DOC1.ref, LOCATOR), (DOC1,), ()),
    (EvidenceRef(DOC2.ref, LOCATOR), (DOC2,), (SOURCE,)),  # missing document predecessor
])
def test_broken_source_document_version_and_locator(proof, documents, sources):
    model = projection(facts=(replace(ORIGINAL, evidence=(proof,)),), documents=documents, sources=sources)
    for result in (model.read_fact(ORIGINAL.ref, LATE), model.read_evidence(ORIGINAL.ref, LATE)):
        assert result == {"status": "UNRESOLVED", "reason": "invalid_evidence_reference", "data": None}
    assert not model.read_object(COUNTRY.id, LATE)["data"]["relations"]


def test_tainted_policy_or_restricted_native_revision_cannot_authorize():
    def unavailable(*args):
        raise TimeoutError("non-public details")

    for model in (
        projection(rights=unavailable), projection(rights=lambda *args: "allowed"),
        projection(documents=(replace(DOC1, restricted=True), DOC2)),
        projection(facts=(replace(ORIGINAL, restricted=True), CORRECTION)),
    ):
        assert model.read_evidence(ORIGINAL.ref, EARLY) == {
            "status": "RESTRICTED", "reason": "use_denied", "data": None,
        }


def test_metadata_allowlists_links_and_never_serializes_document_on_fact_read():
    malicious = replace(DOC1, official_url="https://user:token@example.invalid/raw")
    model = projection(documents=(malicious, DOC2))
    assert "official_url" not in json.dumps(model.read_fact(ORIGINAL.ref, EARLY))
    evidence = model.read_evidence(ORIGINAL.ref, EARLY)["data"]["evidence"][0]
    assert evidence["document"]["official_url"] is None
    assert model.read_evidence(ORIGINAL.ref.id, EARLY)["status"] == "UNRESOLVED"
    assert model.read_evidence(ORIGINAL.ref, EARLY, locator=LOCATOR)["status"] == "UNRESOLVED"
    assert model.read_evidence(ORIGINAL.ref, EARLY, document=DOC1.ref, locator="invalid")["status"] == "UNRESOLVED"


def test_one_denied_document_blocks_a_multi_document_fact():
    compound = replace(ORIGINAL, evidence=(EvidenceRef(DOC1.ref, LOCATOR), EvidenceRef(DOC2.ref, LOCATOR)))
    model = projection(facts=(compound,), rights=lambda source, document, channel, use: document == DOC1.ref)
    assert model.read_fact(compound.ref, LATE)["status"] == "RESTRICTED"
    assert model.read_evidence(compound.ref, LATE)["status"] == "RESTRICTED"


@pytest.mark.parametrize("lineage", [
    (CORRECTION,),
    (ORIGINAL, CORRECTION, replace(CORRECTION, ref=VersionRef(CORRECTION.ref.id, "v3"))),
    (replace(ORIGINAL, supersedes=CORRECTION.ref.version), CORRECTION),
    (ORIGINAL, replace(CORRECTION, known_at=utc(2025, 2, 1))),
])
def test_ambiguous_incomplete_or_cyclic_history_has_no_implicit_head(lineage):
    model = projection(facts=lineage)
    assert model.read_fact(ORIGINAL.ref.id, LATE)["status"] == "UNRESOLVED"
    assert model.read_fact(CORRECTION.ref, LATE)["status"] == "UNRESOLVED"


def test_missing_knowledge_time_blocks_as_known_replay():
    missing_fact_time = projection(facts=(ORIGINAL, replace(CORRECTION, known_at=None)))
    missing_doc_time = projection(documents=(DOC1, replace(DOC2, known_at=None)))
    for model in (missing_fact_time, missing_doc_time):
        assert model.read_fact(CORRECTION.ref, LATE)["reason"] == "knowledge_date_unrecorded"
        assert model.read_fact(CORRECTION.ref, replace(LATE, known_at=None))["status"] == "RESOLVED"
    with pytest.raises(ValueError, match="timezone"):
        ReadContext(EARLY.as_of, datetime(2025, 1, 1))


def test_comparability_distinguishes_incompatible_missing_and_same_series():
    def other(basis):
        return replace(
            ORIGINAL, ref=VersionRef("observation:comparison", "1"),
            value=replace(ORIGINAL.value, basis=basis),
        )

    incompatible = other(replace(BASIS, metric="actual-production", methodology=None))
    incomplete = other(replace(BASIS, methodology=None))
    for item, expected in ((incompatible, "NOT_COMPARABLE"), (incomplete, "UNRESOLVED")):
        model = projection(facts=(ORIGINAL, CORRECTION, item))
        assert model.compare(ORIGINAL.ref, item.ref, LATE)["status"] == expected
    assert projection().compare(ORIGINAL.ref, CORRECTION.ref, LATE)["status"] == "COMPARABLE_WITH_QUALIFICATION"
    assert projection().compare(ORIGINAL.ref, ORIGINAL.ref, LATE)["status"] == "COMPARABLE"


def test_deterministic_json_and_name_search_without_identity_merge():
    separate = CatalogObject("country:fixture-separate", ObjectType.COUNTRY, COUNTRY.label)
    models = (
        projection(objects=(COUNTRY, WAFER, separate)), projection(
            objects=(separate, WAFER, COUNTRY), documents=(DOC2, DOC1), facts=(CORRECTION, ORIGINAL),
        ),
    )
    for query in ("", "China", "WAFÉRS 2024"):
        left, right = (json.dumps(model.search(query, LATE), allow_nan=False) for model in models)
        assert left == right
    results = models[0].search("China", LATE)["data"]["groups"][0]["items"]
    assert {item["id"] for item in results} == {COUNTRY.id, separate.id}
    assert models[0].read_object("China", LATE)["status"] == "UNRESOLVED"
    with pytest.raises(ValueError, match="canonical Country"):
        projection(objects=(COUNTRY, replace(COUNTRY, id="j3:country:CHN")))


def test_second_parent_and_cycles_produce_no_primary_relation():
    tech = CatalogObject("technology:fixture", ObjectType.TECHNOLOGY, "Fixture technology")
    a = CatalogObject("variant:fixture:a", ObjectType.TECHNOLOGY_VARIANT, "A")
    b = CatalogObject("variant:fixture:b", ObjectType.TECHNOLOGY_VARIANT, "B")

    def edge(parent, child):
        return replace(
            ORIGINAL, ref=VersionRef(f"claim:{parent.id}:{child.id}", "1"), subject=parent.id,
            value=Claim("nivar_analysis", "Fixture ancestry"),
            relations=(Relation(Predicate.HAS_VARIANT, child.id),),
        )

    cycle = (edge(a, b), edge(b, a))
    ambiguous = (edge(tech, b), edge(a, b))
    for facts in (cycle, ambiguous):
        model = projection(objects=(tech, a, b), facts=facts)
        assert all(model.read_fact(fact.ref, LATE)["status"] == "UNRESOLVED" for fact in facts)
        assert model.read_object(b.id, LATE)["data"]["relations"] == []


def test_restricted_endpoint_is_omitted_even_when_fact_can_be_read():
    identity = replace(CORRECTION, ref=VersionRef("claim:wafer:identity", "1"), subject=WAFER.id,
                       value=Claim("observed_fact", "Fixture identity"), supersedes=None, relations=())
    model = projection(
        objects=(COUNTRY, replace(WAFER, identity_fact=identity.ref.id)), facts=(ORIGINAL, identity),
        rights=lambda source, document, channel, use: document == DOC1.ref,
    )
    assert model.read_object(WAFER.id, LATE)["status"] == "RESTRICTED"
    assert model.read_object(COUNTRY.id, LATE)["data"]["relations"] == []
    fact = model.read_fact(ORIGINAL.ref, LATE)["data"]
    assert fact["views"] == [COUNTRY.id]
    assert fact["relations"] == []


def test_lawful_historic_pin_replays_when_current_identity_version_is_denied():
    model = projection(
        objects=(replace(COUNTRY, identity_fact=ORIGINAL.ref.id), WAFER),
        rights=lambda source, doc, channel, use: doc == DOC1.ref,
    )
    assert model.read_object(COUNTRY.id, LATE)["status"] == "RESTRICTED"
    assert model.read_fact(ORIGINAL.ref, LATE)["status"] == "RESOLVED"


def test_j2_synthetic_contract_timeline_distinguishes_field_fpso_and_forecast():
    # Invented identities and figures. PR #40 is outside this fixture.
    company = CatalogObject("fixture:entity:operator", ObjectType.CORPORATE_ENTITY, "Companhia sintética J2", synthetic=True)
    field = CatalogObject("fixture:asset:field", ObjectType.ASSET, "Campo sintético J2", scope="field", synthetic=True)
    fpso = replace(field, id="fixture:asset:fpso", label="FPSO sintético J2", scope="fpso")
    proof = replace(DOC1, synthetic=True)
    basis = replace(BASIS, metric="participating-interest", denominator="synthetic unitised field")
    contract = ContractScope("unitisation fixture", "SYN-01", "fixture", basis.denominator)
    switch = date(2027, 3, 1)
    current = replace(
        ORIGINAL, ref=VersionRef("fixture:fact:j2-interest-now", "1"), subject=company.id,
        value=Observation("reported", 12, basis), evidence=(EvidenceRef(proof.ref, LOCATOR),),
        effective=EffectivePeriod(date(2025, 1, 1), switch),
        relations=(Relation(Predicate.CONTRACTUAL_INTEREST, field.id, contract),), synthetic=True,
    )
    future = replace(current, ref=VersionRef("fixture:fact:j2-interest-next", "1"),
                     effective=EffectivePeriod(switch), known_at=utc(2026, 4, 1), value=replace(current.value, value=18))
    forecast = replace(
        current, ref=VersionRef("fixture:fact:j2-forecast", "1"), value=Observation("forecast", 25, basis),
        relations=(), cited_by=(field.id,),
    )
    invalid_forecast = replace(forecast, ref=VersionRef("fixture:invalid:forecast-edge", "1"), relations=current.relations)
    invalid_fpso = replace(current, ref=VersionRef("fixture:invalid:fpso-edge", "1"),
                           relations=(Relation(Predicate.CONTRACTUAL_INTEREST, fpso.id, contract),))
    operator = replace(
        current, ref=VersionRef("fixture:fact:j2-operator", "1"), value=Claim("observed_fact", "Operação sintética"),
        relations=(Relation(Predicate.OPERATOR, fpso.id),), effective=EffectivePeriod(date(2025, 1, 1)),
    )
    model = projection(
        objects=(company, field, fpso), documents=(proof,),
        facts=(current, future, forecast, invalid_forecast, invalid_fpso, operator),
    )
    assert model.read_object(company.id, LATE)["status"] == "RESTRICTED"
    assert model.search("J2", LATE)["data"]["groups"] == []
    before = ReadContext(date(2026, 11, 20), utc(2026, 11, 20), include_synthetic=True)
    after = replace(before, as_of=switch)
    assert model.read_fact(future.ref, before)["status"] == "UNKNOWN"
    assert model.read_fact(current.ref, after)["status"] == "UNKNOWN"
    assert model.read_fact(future.ref, replace(after, known_at=LATE.known_at))["status"] == "UNKNOWN"
    assert model.read_fact(future.ref, after)["data"]["value"]["value"] == 18
    assert model.read_fact(forecast.ref, before)["data"]["relations"] == []
    assert model.read_fact(invalid_forecast.ref, before)["status"] == "UNRESOLVED"
    assert model.read_fact(invalid_fpso.ref, before)["status"] == "UNRESOLVED"
    assert model.read_object(field.id, before)["data"]["synthetic"] is True
    assert model.read_fact(current.ref, before)["data"]["synthetic"] is True
    assert model.read_evidence(current.ref, before)["data"]["synthetic"] is True
    assert [edge["predicate"] for edge in model.read_object(fpso.id, before)["data"]["relations"]] == ["operator"]
    assert model.read_object(field.id, replace(before, channel="preview"))["status"] == "RESTRICTED"
