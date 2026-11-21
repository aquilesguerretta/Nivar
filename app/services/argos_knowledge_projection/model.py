"""Inputs to the internal, read-only ARGOS projection."""

from dataclasses import dataclass
from datetime import date, datetime
from enum import StrEnum
from typing import Callable, Literal


class ObjectType(StrEnum):
    ASSET = "Asset"
    CORPORATE_ENTITY = "CorporateEntity"
    COUNTRY = "Country"
    EVENT = "Event"
    RESEARCH_MILESTONE = "ResearchMilestone"
    TECHNOLOGY = "Technology"
    TECHNOLOGY_ELEMENT = "TechnologyElement"
    TECHNOLOGY_VARIANT = "TechnologyVariant"


class Predicate(StrEnum):
    HAS_VARIANT = "technology_has_variant"
    HAS_ELEMENT = "technology_has_element"
    COUNTRY_MANUFACTURES = "country_manufactures_element"
    ISSUING_JURISDICTION = "issuing_jurisdiction"
    CONTROLLED_ITEM = "controlled_item"
    MATERIAL_APPLICATION = "material_application"
    ADVANCES_VARIANT = "milestone_advances_variant"
    BOTTOM_CELL_VARIANT = "milestone_bottom_cell_variant"
    OPERATOR = "operator"
    CONTRACTUAL_INTEREST = "contractual_participating_interest"


class Status(StrEnum):
    RESOLVED = "RESOLVED"
    UNKNOWN = "UNKNOWN"
    UNRESOLVED = "UNRESOLVED"
    RESTRICTED = "RESTRICTED"
    COMPARABLE = "COMPARABLE"
    COMPARABLE_WITH_QUALIFICATION = "COMPARABLE_WITH_QUALIFICATION"
    NOT_COMPARABLE = "NOT_COMPARABLE"


class Capability(StrEnum):
    FACT = "fact"
    EVIDENCE_METADATA = "evidence_metadata"
    EVIDENCE_LINK = "evidence_link"


@dataclass(frozen=True, order=True)
class VersionRef:
    id: str
    version: str


# Source, exact Document edition, channel, permitted use. Grant only on literal True.
RightsPolicy = Callable[[str, VersionRef, str, Capability], bool]


@dataclass(frozen=True)
class ReadContext:
    as_of: date
    known_at: datetime | None = None
    channel: str = "local"
    include_synthetic: bool = False

    def __post_init__(self):
        if type(self.as_of) is not date:
            raise ValueError("as_of must be a calendar date")
        if self.known_at is not None and self.known_at.utcoffset() is None:
            raise ValueError("known_at must include a timezone")


@dataclass(frozen=True)
class EffectivePeriod:
    """Half-open valid/effective period, with day precision."""

    start: date
    end: date | None = None

    def __post_init__(self):
        if self.end is not None and self.end <= self.start:
            raise ValueError("invalid effective period")

    def contains(self, day: date) -> bool:
        return self.start <= day and (self.end is None or day < self.end)


@dataclass(frozen=True)
class CatalogObject:
    id: str
    kind: ObjectType
    label: str
    search_terms: tuple[str, ...] = ()
    scope: str | None = None
    # If the identity label itself carries a material assertion, gate it on this fact.
    identity_fact: str | None = None
    synthetic: bool = False


@dataclass(frozen=True)
class Source:
    id: str
    publisher: str


@dataclass(frozen=True)
class Document:
    ref: VersionRef
    source_id: str
    title: str
    locators: frozenset[str]
    published_on: str | None = None
    retrieved_at: datetime | None = None
    known_at: datetime | None = None
    language: str | None = None
    native_id: str | None = None
    authority: str | None = None
    official_url: str | None = None
    rights_ref: str | None = None
    supersedes: str | None = None
    restricted: bool = False
    synthetic: bool = False


@dataclass(frozen=True)
class EvidenceRef:
    document: VersionRef
    locator: str


@dataclass(frozen=True)
class Claim:
    kind: Literal["observed_fact", "actor_statement", "third_party_interpretation", "nivar_analysis"]
    statement: str
    qualification: str | None = None
    attributed_to: str | None = None


@dataclass(frozen=True)
class ComparisonBasis:
    metric: str
    unit: str
    denominator: str | None = None
    geography_basis: str | None = None
    methodology: str | None = None
    reference_period: str | None = None
    specimen_scope: str | None = None


@dataclass(frozen=True)
class Measurement:
    metric: str
    value: float | int
    unit: str
    denominator: str
    uncertainty: float | None = None
    digits: int | None = None


@dataclass(frozen=True)
class Observation:
    kind: Literal["measured", "reported", "estimated", "forecast"]
    value: float | int
    basis: ComparisonBasis
    qualification: str | None = None
    uncertainty: float | None = None
    reported_by: str | None = None
    measured_by: str | None = None
    subject_scope: str | None = None
    digits: int | None = None
    additional_measurements: tuple[Measurement, ...] = ()


@dataclass(frozen=True)
class ContractScope:
    instrument_type: str
    instrument_id: str
    jurisdiction: str
    denominator: str


@dataclass(frozen=True)
class Relation:
    predicate: Predicate
    target: str
    contract: ContractScope | None = None
    source: str | None = None


@dataclass(frozen=True)
class Fact:
    ref: VersionRef
    subject: str
    value: Claim | Observation
    evidence: tuple[EvidenceRef, ...]
    supersedes: str | None = None
    effective: EffectivePeriod | None = None
    known_at: datetime | None = None
    published_on: str | None = None
    relations: tuple[Relation, ...] = ()
    # Other views that cite this same versioned fact. These refs do not create relations.
    cited_by: tuple[str, ...] = ()
    restricted: bool = False
    synthetic: bool = False
