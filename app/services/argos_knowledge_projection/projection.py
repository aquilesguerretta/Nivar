"""Resolve scoped objects, typed links and exact bibliography without an I/O backend."""

from collections import defaultdict
from dataclasses import asdict
from datetime import datetime, timezone
from math import isfinite
from typing import Iterable, TypeVar
from unicodedata import category, normalize
from urllib.parse import urlsplit

from .model import (
    Capability, CatalogObject, Claim, Document, Fact, ObjectType, Observation, Relation,
    Predicate, ReadContext, RightsPolicy, Source, Status, VersionRef,
)

_TECHNOLOGY = {ObjectType.TECHNOLOGY, ObjectType.TECHNOLOGY_VARIANT}
_VARIANT = {ObjectType.TECHNOLOGY_VARIANT}
_MILESTONE = {ObjectType.RESEARCH_MILESTONE}
_ELEMENT = {ObjectType.TECHNOLOGY_ELEMENT}
_EVENT = {ObjectType.EVENT}
_COUNTRY = {ObjectType.COUNTRY}
_ENTITY = {ObjectType.CORPORATE_ENTITY}
_ASSET = {ObjectType.ASSET}
_ENDPOINTS = {
    Predicate.HAS_VARIANT: (_TECHNOLOGY, _VARIANT),
    Predicate.HAS_ELEMENT: (_TECHNOLOGY, _ELEMENT),
    Predicate.COUNTRY_MANUFACTURES: (_COUNTRY, _ELEMENT),
    Predicate.ISSUING_JURISDICTION: (_EVENT, _COUNTRY),
    Predicate.CONTROLLED_ITEM: (_EVENT, _ELEMENT),
    Predicate.MATERIAL_APPLICATION: (_ELEMENT, _VARIANT),
    Predicate.ADVANCES_VARIANT: (_MILESTONE, _VARIANT),
    Predicate.BOTTOM_CELL_VARIANT: (_MILESTONE, _VARIANT),
    Predicate.OPERATOR: (_ENTITY, _ASSET),
    Predicate.CONTRACTUAL_INTEREST: (_ENTITY, _ASSET),
}

T = TypeVar("T", Fact, Document)
_CHINA_ALIAS = "j3:country:CHN"
_CHINA = "country:CHN"


def _index(records, key):
    result = {}
    for record in records:
        identifier = key(record)
        if identifier in result:
            raise ValueError("duplicate ARGOS projection record")
        result[identifier] = record
    return result


def _histories(records: Iterable[T]) -> dict[str, tuple[T, ...]]:
    """Index head-to-root chains. An empty chain marks invalid or ambiguous lineage."""
    per_id: dict[str, list[T]] = defaultdict(list)
    for record in records:
        per_id[record.ref.id].append(record)
    histories = {}
    for identifier, series in per_id.items():
        by_version = {record.ref.version: record for record in series}
        parents = {record.supersedes for record in series if record.supersedes is not None}
        heads = by_version.keys() - parents
        chain = []
        if len(heads) == 1 and parents <= by_version.keys():
            version = next(iter(heads))
            while version is not None and len(chain) < len(series):
                record = by_version[version]
                chain.append(record)
                version = record.supersedes
            if version is None and len(chain) == len(series) and _ordered_known_times(chain):
                histories[identifier] = tuple(chain)
                continue
        histories[identifier] = ()
    return histories


def _ordered_known_times(chain: Iterable[Fact | Document]) -> bool:
    prior = None
    for record in chain:
        known = record.known_at
        if known is None:
            continue
        if known.utcoffset() is None or (prior is not None and known > prior):
            return False
        prior = known
    return True


def _result(status: Status = Status.RESOLVED, data: dict | None = None, reason: str | None = None):
    return {"status": status.value, "reason": reason, "data": data}


def _instant(instant: datetime | None) -> str | None:
    return None if instant is None else instant.astimezone(timezone.utc).isoformat()


def _search_text(text: str) -> str:
    return "".join(char for char in normalize("NFD", text.casefold()) if category(char) != "Mn")


def _official_link(url: str | None) -> str | None:
    if not url or any(char.isspace() or ord(char) < 32 for char in url):
        return None
    try:
        parsed = urlsplit(url)
    except ValueError:
        return None
    return url if parsed.scheme == "https" and parsed.hostname and not parsed.username and not parsed.password else None


class KnowledgeProjection:
    def __init__(
        self, *, objects: Iterable[CatalogObject], sources: Iterable[Source],
        documents: Iterable[Document], facts: Iterable[Fact], rights: RightsPolicy | None = None,
    ):
        self._objects = _index(objects, lambda item: item.id)
        china = self._objects.get(_CHINA)
        if _CHINA_ALIAS in self._objects or (china is not None and china.kind != ObjectType.COUNTRY):
            raise ValueError("conflicting canonical Country identity")
        self._sources = _index(sources, lambda item: item.id)
        self._documents = _index(documents, lambda item: item.ref)
        self._facts = _index(facts, lambda item: item.ref)
        self._fact_histories = _histories(self._facts.values())
        self._document_histories = _histories(self._documents.values())
        self._rights = rights
        self._by_object = defaultdict(set)
        for fact in self._facts.values():
            for object_id in self._members(fact):
                self._by_object[object_id].add(fact.ref.id)
        self._invalid_parents = self._invalid_variant_parents()

    def _canonical(self, identifier: str) -> str:
        return _CHINA if identifier == _CHINA_ALIAS else identifier

    def _members(self, fact: Fact) -> set[str]:
        refs = {fact.subject, *fact.cited_by}
        for relation in fact.relations:
            refs.update((relation.source or fact.subject, relation.target))
        return {self._canonical(identifier) for identifier in refs}

    def _invalid_variant_parents(self) -> set[str]:
        parents = defaultdict(set)
        for fact in self._facts.values():
            for relation in fact.relations:
                if relation.predicate == Predicate.HAS_VARIANT:
                    parents[relation.target].add(relation.source or fact.subject)
        invalid = {child for child, choices in parents.items() if len(choices) > 1}
        for child in parents:
            visited = set()
            current = child
            while current in parents and current not in invalid:
                if current in visited:
                    invalid.update(visited)
                    break
                visited.add(current)
                current = next(iter(parents[current]))
        return invalid

    def _fact_at(self, ref: str | VersionRef, context: ReadContext):
        identifier = ref.id if isinstance(ref, VersionRef) else ref
        history = self._fact_histories.get(identifier)
        if not history:
            return None, _result(Status.UNRESOLVED, reason="invalid_fact_reference")
        if isinstance(ref, VersionRef):
            pinned = self._facts.get(ref)
            if pinned is None:
                return None, _result(Status.UNRESOLVED, reason="invalid_fact_reference")
            history = (pinned,)
        for fact in history:
            if fact.effective and not fact.effective.contains(context.as_of):
                continue
            if context.known_at is not None:
                if fact.known_at is None:
                    return None, _result(Status.UNKNOWN, reason="knowledge_date_unrecorded")
                if fact.known_at > context.known_at:
                    continue
            return fact, None
        return None, _result(Status.UNKNOWN, reason="outside_temporal_coverage")

    def _synthetic_visible(self, synthetic: bool, context: ReadContext) -> bool:
        return not synthetic or (context.channel == "local" and context.include_synthetic)

    def _relation_is_valid(self, fact: Fact) -> bool:
        return all(self._valid_edge(fact, relation) for relation in fact.relations)

    def _valid_edge(self, fact: Fact, relation: Relation) -> bool:
        subject = self._objects[self._canonical(relation.source or fact.subject)]
        target = self._objects[self._canonical(relation.target)]
        if self._canonical(fact.subject) not in {subject.id, target.id}:
            return False
        domains = _ENDPOINTS.get(relation.predicate)
        if not domains or subject.kind not in domains[0] or target.kind not in domains[1]:
            return False
        if relation.predicate == Predicate.HAS_VARIANT and target.id in self._invalid_parents:
            return False
        if relation.predicate == Predicate.CONTRACTUAL_INTEREST:
            value, scope = fact.value, relation.contract
            return (
                isinstance(value, Observation) and value.kind in {"reported", "measured"}
                and value.basis.unit == "%" and 0 <= value.value <= 100
                and scope is not None and all(part.strip() for part in asdict(scope).values())
                and value.basis.denominator == scope.denominator
                and target.scope in {"field", "contract_scope", "block"}
                and fact.effective is not None
            )
        return relation.contract is None

    def _allowed(self, document: Document, context: ReadContext, use: Capability) -> bool:
        if self._rights is None or document.restricted or context.channel != "local":
            return False
        try:
            return self._rights(document.source_id, document.ref, context.channel, use) is True
        except Exception:
            # An unavailable policy cannot authorize a disclosure.
            return False

    def _resolve(self, ref: str | VersionRef, context: ReadContext, use: Capability):
        if context.channel != "local":
            return None, (), _result(Status.RESTRICTED, reason="channel_denied")
        fact, failure = self._fact_at(ref, context)
        if failure is not None:
            return None, (), failure
        if fact.restricted or not self._synthetic_visible(fact.synthetic, context):
            return None, (), _result(Status.RESTRICTED, reason="use_denied")
        members = [self._objects.get(identifier) for identifier in self._members(fact)]
        if any(item is None for item in members) or not self._relation_is_valid(fact):
            return None, (), _result(Status.UNRESOLVED, reason="invalid_object_or_relation")
        if any(not self._synthetic_visible(item.synthetic, context) for item in members):
            return None, (), _result(Status.RESTRICTED, reason="use_denied")
        if not fact.evidence:
            return None, (), _result(Status.UNRESOLVED, reason="evidence_missing")
        citations = []
        for citation in sorted(set(fact.evidence), key=lambda item: (item.document, item.locator)):
            document = self._documents.get(citation.document)
            if (
                document is None or document.source_id not in self._sources
                or not self._document_histories[document.ref.id]
            ):
                return None, (), _result(Status.UNRESOLVED, reason="invalid_evidence_reference")
            if not self._synthetic_visible(document.synthetic, context) or not self._allowed(document, context, use):
                return None, (), _result(Status.RESTRICTED, reason="use_denied")
            if citation.locator not in document.locators or not citation.locator:
                return None, (), _result(Status.UNRESOLVED, reason="invalid_evidence_reference")
            if context.known_at is not None:
                if document.known_at is None:
                    return None, (), _result(Status.UNKNOWN, reason="knowledge_date_unrecorded")
                if document.known_at > context.known_at:
                    return None, (), _result(Status.UNKNOWN, reason="outside_temporal_coverage")
            citations.append((document, citation.locator))
        if isinstance(fact.value, Observation):
            value = fact.value
            numbers = [value.value, value.uncertainty]
            for measurement in value.additional_measurements:
                numbers.extend((measurement.value, measurement.uncertainty))
            if any(number is not None and not isfinite(number) for number in numbers):
                return None, (), _result(Status.UNRESOLVED, reason="invalid_observation")
        return fact, citations, None

    def _relations_data(self, fact: Fact, context: ReadContext) -> list[dict]:
        edges = []
        for relation in sorted(fact.relations, key=lambda item: (item.predicate, item.source or fact.subject, item.target)):
            source = self._canonical(relation.source or fact.subject)
            target = self._canonical(relation.target)
            if all(self._available_object(endpoint, context, identity=fact)[1] is None for endpoint in (source, target)):
                edges.append({
                    "predicate": relation.predicate.value,
                    "from": source, "to": target,
                    "contract": asdict(relation.contract) if relation.contract else None,
                    "fact": asdict(fact.ref),
                })
        return edges

    def _available_object(self, identifier: str, context: ReadContext, *, identity: Fact | None = None):
        if context.channel != "local":
            return None, _result(Status.RESTRICTED, reason="channel_denied")
        item = self._objects.get(self._canonical(identifier))
        if item is None:
            return None, _result(Status.UNRESOLVED, reason="invalid_object_reference")
        if not self._synthetic_visible(item.synthetic, context):
            return None, _result(Status.RESTRICTED, reason="use_denied")
        has_pinned_identity = identity is not None and identity.ref.id == item.identity_fact and (
            self._canonical(identity.subject) == item.id
        )
        if item.identity_fact and not has_pinned_identity:
            identity, _, failure = self._resolve(item.identity_fact, context, Capability.FACT)
            if failure is not None:
                return None, failure
            if self._canonical(identity.subject) != item.id:
                return None, _result(Status.UNRESOLVED, reason="invalid_identity_fact")
        return item, None

    def _object_data(self, item: CatalogObject) -> dict:
        return {"id": item.id, "type": item.kind.value, "label": item.label,
                "scope": item.scope, "synthetic": item.synthetic}

    def _matches(self, item: CatalogObject, terms: list[str], context: ReadContext) -> bool:
        haystack = _search_text(" ".join((item.id, item.label, *item.search_terms)))
        pending = [term for term in terms if term not in haystack]
        if not pending:
            return True
        eligible_terms = []
        for fact_id in sorted(self._by_object.get(item.id, ())):
            fact, _, failure = self._resolve(fact_id, context, Capability.FACT)
            if (failure is None and item.id in self._members(fact) and isinstance(fact.value, Observation)
                    and self._available_object(fact.subject, context, identity=fact)[1] is None):
                basis = fact.value.basis
                eligible_terms.extend(value for value in (basis.reference_period, basis.metric) if value)
        index = _search_text(" ".join(eligible_terms))
        return all(term in index for term in pending)

    def search(self, query: str, context: ReadContext, *, kind: ObjectType | None = None) -> dict:
        """Return stable groups and identifiers suitable for navigation."""
        if context.channel != "local":
            return _result(Status.RESTRICTED, reason="channel_denied")
        terms = _search_text(query).split()
        groups = defaultdict(list)
        for item in sorted(self._objects.values(), key=lambda candidate: candidate.id):
            if kind is not None and kind != item.kind:
                continue
            if self._available_object(item.id, context)[1] is None and self._matches(item, terms, context):
                groups[item.kind.value].append(self._object_data(item))
        return _result(data={"groups": [{"type": key, "items": groups[key]} for key in sorted(groups)]})

    def read_object(self, ref: str, context: ReadContext) -> dict:
        item, failure = self._available_object(ref, context)
        if failure is not None:
            return failure
        pins, relations = [], []
        for fact_id in sorted(self._by_object.get(item.id, ())):
            fact, _, failure = self._resolve(fact_id, context, Capability.FACT)
            if failure is not None or item.id not in self._members(fact):
                continue
            if self._available_object(fact.subject, context, identity=fact)[1] is not None:
                continue
            pins.append(asdict(fact.ref))
            for relation in self._relations_data(fact, context):
                if item.id in (relation["from"], relation["to"]):
                    relations.append(relation)
        return _result(data={**self._object_data(item), "facts": pins, "relations": relations})

    def read_fact(self, ref: str | VersionRef, context: ReadContext) -> dict:
        fact, citations, failure = self._resolve(ref, context, Capability.FACT)
        if failure is not None:
            return failure
        _, failure = self._available_object(fact.subject, context, identity=fact)
        if failure is not None:
            return failure
        period = fact.effective
        views = [
            member for member in sorted(self._members(fact))
            if self._available_object(member, context, identity=fact)[1] is None
        ]
        return _result(data={
            "ref": asdict(fact.ref), "subject": self._canonical(fact.subject),
            "type": "Claim" if isinstance(fact.value, Claim) else "Observation",
            "value": asdict(fact.value), "relations": self._relations_data(fact, context),
            "views": views,
            "effective_from": period.start.isoformat() if period else None,
            "effective_to": period.end.isoformat() if period and period.end else None,
            "published_on": fact.published_on, "known_at": _instant(fact.known_at),
            "supersedes": fact.supersedes, "synthetic": fact.synthetic or any(doc.synthetic for doc, _ in citations),
        })

    def read_evidence(
        self, pin: VersionRef, context: ReadContext, *,
        document: VersionRef | None = None, locator: str | None = None,
    ) -> dict:
        if not isinstance(pin, VersionRef):
            return _result(Status.UNRESOLVED, reason="exact_fact_pin_required")
        fact, citations, failure = self._resolve(pin, context, Capability.EVIDENCE_METADATA)
        if failure is not None:
            return failure
        if locator is not None and document is None:
            return _result(Status.UNRESOLVED, reason="exact_document_pin_required")
        if document is not None:
            citations = [
                (doc, position) for doc, position in citations
                if doc.ref == document and (locator is None or position == locator)
            ]
            if not citations:
                return _result(Status.UNRESOLVED, reason="invalid_evidence_reference")
        evidence = []
        for doc, locator in citations:
            evidence.append({
                "source": asdict(self._sources[doc.source_id]),
                "document": {
                    "ref": asdict(doc.ref), "title": doc.title, "native_id": doc.native_id,
                    "locator": locator, "language": doc.language, "authority": doc.authority,
                    "published_on": doc.published_on, "retrieved_at": _instant(doc.retrieved_at),
                    "known_at": _instant(doc.known_at), "supersedes": doc.supersedes,
                    "rights_ref": doc.rights_ref, "synthetic": doc.synthetic,
                    "official_url": _official_link(doc.official_url)
                    if self._allowed(doc, context, Capability.EVIDENCE_LINK) else None,
                },
            })
        return _result(data={"fact": asdict(fact.ref), "evidence": evidence,
                             "synthetic": fact.synthetic or any(doc.synthetic for doc, _ in citations)})

    def compare(self, left: VersionRef, right: VersionRef, context: ReadContext) -> dict:
        """Conservative equality check of the comparison basis for two exact observations."""
        if not isinstance(left, VersionRef) or not isinstance(right, VersionRef):
            return _result(Status.UNRESOLVED, reason="exact_fact_pin_required")
        readings = []
        for pin in (left, right):
            fact, _, failure = self._resolve(pin, context, Capability.FACT)
            if failure is not None:
                return failure
            _, failure = self._available_object(fact.subject, context, identity=fact)
            if failure is not None:
                return failure
            if not isinstance(fact.value, Observation):
                return _result(Status.UNRESOLVED, reason="observation_required")
            readings.append(fact.value)
        first, second = readings
        if left == right:
            return _result(Status.COMPARABLE, {"left": asdict(left), "right": asdict(right)}, "same_observation_revision")
        differences, absent = [], []
        second_basis = asdict(second.basis)
        for field, value in asdict(first.basis).items():
            other = second_basis[field]
            if not value or not other:
                absent.append(field)
            elif value != other:
                differences.append(field)
        if first.kind != second.kind:
            differences.append("observation_kind")
        pins = {"left": asdict(left), "right": asdict(right)}
        if differences:
            return _result(Status.NOT_COMPARABLE, {"differences": sorted(differences)}, "incompatible_basis")
        if absent:
            return _result(Status.UNRESOLVED, {"missing": sorted(absent)}, "comparison_basis_missing")
        if left.id == right.id:
            return _result(Status.COMPARABLE_WITH_QUALIFICATION, pins, "same_observation_series")
        return _result(Status.COMPARABLE, pins)
