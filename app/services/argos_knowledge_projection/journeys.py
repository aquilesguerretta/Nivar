"""Bounded adapter for the merged J1, J3 and J4 local catalogs.

Callers supply trusted, in-memory snapshots of the existing journeys. Loading a
snapshot does not establish rights, and the adapter does not fetch or store it.
"""

from calendar import monthrange
from dataclasses import replace
from datetime import date, datetime
from re import match

from .model import (
    CatalogObject, Claim, ComparisonBasis, Document, EffectivePeriod, EvidenceRef,
    Fact, Measurement, ObjectType, Observation, Predicate, Relation, RightsPolicy, Source, VersionRef,
)
from .projection import KnowledgeProjection


def _instant(value: str | None) -> datetime | None:
    if not value:
        return None
    parsed = datetime.fromisoformat(value)
    return parsed if parsed.utcoffset() is not None else None


def _documented_by(value: str) -> date:
    # For a month-precision publication, require the full month to have elapsed.
    stamp = match(r"^(\d{4})-(\d{2})(?:-(\d{2}))?(?= |$)", value)
    if stamp is None:
        raise ValueError("J4 publication date has unknown precision")
    year, month = int(stamp[1]), int(stamp[2])
    return date(year, month, int(stamp[3]) if stamp[3] else monthrange(year, month)[1])


def _version(identifier: str, version: str | int) -> VersionRef:
    return VersionRef(identifier, str(version))


class _Catalog:
    def __init__(self):
        self.objects: dict[str, CatalogObject] = {}
        self.sources: dict[str, Source] = {}
        self.documents: dict[VersionRef, Document] = {}
        self.facts: list[Fact] = []

    def cite(self, document: Document, publisher: str, locator: str) -> EvidenceRef:
        other = self.documents.get(document.ref)
        if other is not None and replace(other, locators=frozenset()) != document:
            raise ValueError("conflicting bibliographic editions")
        self.sources.setdefault(document.source_id, Source(document.source_id, publisher))
        locators = other.locators if other else frozenset()
        self.documents[document.ref] = replace(document, locators=locators | {locator})
        return EvidenceRef(document.ref, locator)


def _j1(catalog: _Catalog, data: dict):
    objects = data["objects"]
    documents = data["catalog"]["documents"]
    metric = data["metric"]
    for item in objects.values():
        terms = tuple(item["aliases"])
        if item["id"] in {objects["china"]["id"], objects["pv-wafer"]["id"]}:
            terms += ("China wafer wafers",)
        catalog.objects[item["id"]] = CatalogObject(item["id"], ObjectType(item["kind"]), item["name"], terms)

    def cite(ref: str, version: int, locator: str) -> EvidenceRef:
        item = next(record for record in documents[ref]["versions"] if record["version"] == version)
        old = item["supersedes"]
        return catalog.cite(
            Document(
                _version(ref, version), item["sourceRef"], item["title"], frozenset(),
                published_on=item["publishedOn"], retrieved_at=_instant(item["retrievedAt"]),
                known_at=_instant(item["knownAt"]), official_url=item["url"],
                rights_ref="NIV-76",
                supersedes=str(old) if old is not None else None,
                restricted=item["access"] != "local", synthetic=item.get("synthetic", False),
            ),
            data["publishers"][item["sourceRef"]], locator,
        )

    doe = data["document_refs"]["doe"]
    architecture = cite(doe, 1, "Arquiteturas e fabricação")
    for key, item in objects.items():
        if item["kind"] == "TechnologyVariant":
            catalog.facts.append(Fact(
                VersionRef(f"claim:j1:primary-parent:{key}", "1"), item["id"],
                Claim("nivar_analysis", item["summary"]), (architecture,),
                relations=(Relation(Predicate.HAS_VARIANT, item["id"], source=item["parentRef"]),),
            ))
    wafer, topcon = objects["pv-wafer"], objects["topcon"]
    catalog.facts.append(Fact(
        VersionRef("claim:j1:wafer-context", "1"), wafer["id"],
        Claim("nivar_analysis", wafer["summary"]), (architecture,),
        relations=tuple(Relation(Predicate.HAS_ELEMENT, wafer["id"], source=tech)
                        for tech in (wafer["technologyContext"], topcon["id"])),
    ))

    for series in data["catalog"]["observations"].values():
        for item in series["versions"]:
            doc_ref = item["documentRef"]
            doc_version = item["documentVersion"]
            proof = cite(doc_ref, doc_version, "Capacidade industrial · wafers fotovoltaicos")
            doc = catalog.documents[proof.document]
            catalog.facts.append(Fact(
                _version(item["id"], item["version"]), item["subjectRef"],
                Observation(
                    item["kind"], item["estimate"],
                    ComparisonBasis(metric["measure"], metric["unit"], metric["denominator"],
                                    "capacidade industrial nacional / mundial", "estimativa IEA por etapa",
                                    str(item["referenceYear"]), metric["stage"]),
                    "Capacidade instalada da etapa wafer. O denominador absoluto em GW não consta do gráfico.",
                ),
                (proof,), supersedes=str(item["supersedes"]) if item["supersedes"] is not None else None,
                effective=EffectivePeriod(date(item["referenceYear"], 12, 31)),
                known_at=_instant(item["knownAt"]), published_on=doc.published_on,
                relations=(Relation(Predicate.COUNTRY_MANUFACTURES, item["elementRef"]),),
                restricted=item["access"] != "local", synthetic=item.get("synthetic", False),
            ))


def _j3(catalog: _Catalog, data: dict):
    event, material, alias = data["event"], data["material"], data["jurisdiction"]
    if alias != {"id": "j3:country:CHN", "kind": "Country", "iso3": "CHN"} or event["jurisdiction"] != alias["id"]:
        raise ValueError("unresolved J3 jurisdiction")
    if catalog.objects["country:CHN"].kind != ObjectType.COUNTRY:
        raise ValueError("unresolved J1 country identity")

    claims = data["claims"]
    documents = {_version(doc["id"], doc["version"]): doc for doc in data["documents"].values()}
    event_terms = ("MOFCOM", "GACC", "terras raras", "Anúncio 18/2025")
    catalog.objects[event["id"]] = CatalogObject(
        event["id"], ObjectType.EVENT, data["event_label"], event_terms, identity_fact=event["claim"]["id"],
    )
    catalog.objects[material["id"]] = CatalogObject(
        material["id"], ObjectType.TECHNOLOGY_ELEMENT, data["material_label"],
        scope=material["role"], identity_fact=claims["item"]["id"],
    )
    applications = data["applications"]
    machine_technology = applications["primaryTechnologyCandidate"]
    catalog.objects[machine_technology] = CatalogObject(
        machine_technology, ObjectType.TECHNOLOGY, "Máquinas elétricas",
    )
    variants = [applications[key] for key in ("motor", "generator")]
    for variant in variants:
        catalog.objects[variant["id"]] = CatalogObject(
            variant["id"], ObjectType.TECHNOLOGY_VARIANT, variant["name"],
            identity_fact=f"claim:j3:primary-parent:{variant['id']}",
        )

    def record(item: dict, subject: str, relations: tuple[Relation, ...] = ()) -> Fact:
        proof = []
        for ref in item["evidence"]:
            pin = _version(ref["document"]["id"], ref["document"]["version"])
            doc = documents[pin]
            source = doc["source"]
            proof.append(catalog.cite(
                Document(
                    pin, source["id"], doc["title"], frozenset(), language=doc["language"],
                    published_on=(doc["publication"] or {}).get("date"), known_at=_instant(doc["knownAt"]),
                    retrieved_at=_instant(doc["retrievedAt"]), authority=doc["authority"],
                    native_id=doc["nativeId"], official_url=doc["url"], rights_ref=source["rights"]["review"],
                ),
                source["publisher"], ref["locator"],
            ))
        first_document = documents[proof[0].document]
        # Latest publication/review is independent of the date of the April Event.
        effective = None
        if item["id"] != claims["application"]["id"]:
            effective = EffectivePeriod(date.fromisoformat(event["occurredOn"]))
        attributed_to = first_document["source"]["publisher"] if item["kind"] == "actor_statement" else None
        fact = Fact(
            _version(item["id"], item["version"]), subject,
            Claim(item["kind"], item["text"], item["qualification"], attributed_to), tuple(proof),
            effective=effective, published_on=(first_document["publication"] or {}).get("date"),
            relations=relations,
        )
        catalog.facts.append(fact)
        return fact

    record(event["claim"], event["id"])
    record(claims["item"], material["id"], (Relation(Predicate.CONTROLLED_ITEM, material["id"], source=event["id"]),))
    application = record(claims["application"], material["id"],
                         tuple(Relation(Predicate.MATERIAL_APPLICATION, variant["id"]) for variant in variants))
    for variant in variants:
        catalog.facts.append(Fact(
            VersionRef(f"claim:j3:primary-parent:{variant['id']}", "1"), variant["id"],
            Claim("nivar_analysis", f"{variant['name']} é uma arquitetura de máquina elétrica."),
            application.evidence, relations=(Relation(Predicate.HAS_VARIANT, variant["id"], source=machine_technology),),
        ))
    record(claims["jurisdiction"], alias["id"], (Relation(Predicate.ISSUING_JURISDICTION, alias["id"], source=event["id"]),))
    record(claims["rationale"], event["id"])


_UNITS = {"pce": "%", "relative-pce-loss": "%", "max-power": "W", "installed-module-count": "modules"}


def _j4(catalog: _Catalog, data: dict):
    tandem = data["tandem"]
    if data["solar_pv"] != "technology:solar-pv" or data["topcon"] != "variant:solar-pv:c-si:topcon":
        raise ValueError("unresolved J4 technology identity")
    catalog.objects[tandem] = CatalogObject(
        tandem, ObjectType.TECHNOLOGY_VARIANT, "Tandem perovskita–silício", ("pesquisa tandem",),
        identity_fact="claim:j4:tandem-parent",
    )

    def cite(ref: dict) -> EvidenceRef:
        pin = _version(ref["documentId"], ref["version"])
        item = data["documents"][pin.id]
        if pin.version != item["version"] or ref["locator"] != item["locator"]:
            raise ValueError("unresolved J4 evidence edition")
        return catalog.cite(
            Document(
                pin, item["source"], item["title"], frozenset(), published_on=item["date"],
                language=item["language"], native_id=item.get("nativeId"),
                official_url=item.get("url"), rights_ref=item["rightsRef"],
            ),
            item["sourceName"], ref["locator"],
        )

    catalog.facts.append(Fact(
        VersionRef("claim:j4:tandem-parent", "1"), tandem,
        Claim("nivar_analysis", "Arquitetura fotovoltaica em tandem de perovskita e silício."),
        (cite(data["context_evidence"]),), relations=(Relation(
            Predicate.HAS_VARIANT, tandem, source=data["solar_pv"],
        ),),
    ))
    for milestone in data["milestones"]:
        identifier, device = milestone["id"], milestone["device"]
        series = milestone["versions"]
        if milestone["variant"] != tandem or any(item["subject"] != device["id"] for item in series):
            raise ValueError("unresolved J4 milestone subject")
        catalog.objects[identifier] = CatalogObject(
            identifier, ObjectType.RESEARCH_MILESTONE, milestone["title"],
            ("pesquisa tandem", device["kind"]), identity_fact=series[0]["id"],
        )
        first_documented = _documented_by(series[-1]["publishedOn"])
        relations = [Relation(Predicate.ADVANCES_VARIANT, tandem)]
        if device.get("silicon") == "TOPCon":
            relations.append(Relation(Predicate.BOTTOM_CELL_VARIANT, data["topcon"]))
        for item in series:
            metric = item["metrics"][0]
            setup, area = item["setup"], item["area"]
            catalog.facts.append(Fact(
                _version(item["id"], item["version"]), identifier,
                Observation(
                    "reported", metric["value"],
                    ComparisonBasis(
                        metric["kind"], _UNITS[metric["kind"]], metric["denominator"],
                        area["basis"] if area else None,
                        (setup.get("protocol") or setup["regime"]) if setup else None,
                        item["observedPeriod"], device["kind"],
                    ),
                    qualification=item["limitations"], uncertainty=metric["uncertainty"],
                    reported_by=item["reporter"], measured_by=item["measurer"],
                    subject_scope=device["id"], digits=metric["digits"],
                    additional_measurements=tuple(
                        Measurement(
                            extra["kind"], extra["value"], _UNITS[extra["kind"]],
                            extra["denominator"], extra["uncertainty"], extra["digits"],
                        )
                        for extra in item["metrics"][1:]
                    ),
                ),
                tuple(cite(ref) for ref in item["evidence"]),
                supersedes=item.get("previousVersion"), known_at=_instant(item["knownOn"]),
                effective=EffectivePeriod(first_documented),
                published_on=item["publishedOn"], relations=tuple(relations),
            ))


def from_merged_journeys(snapshot: dict, *, rights: RightsPolicy | None = None) -> KnowledgeProjection:
    """Use the scoped payload demonstrated by the adjacent test exporter and README."""
    catalog = _Catalog()
    _j1(catalog, snapshot["j1"])
    _j3(catalog, snapshot["j3"])
    _j4(catalog, snapshot["j4"])
    return KnowledgeProjection(
        objects=catalog.objects.values(), sources=catalog.sources.values(),
        documents=catalog.documents.values(), facts=catalog.facts, rights=rights,
    )
