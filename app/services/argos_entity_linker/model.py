"""Typed inputs for the internal ARGOS identity linker."""

import re
from dataclasses import dataclass
from datetime import date, datetime
from enum import StrEnum


class Scope(StrEnum):
    NATIONAL_JURISDICTION = "national_jurisdiction"
    STATISTICAL_TERRITORY = "statistical_territory"
    COMPANY_PROFILE = "company_profile"
    REGISTERED_ENTITY = "registered_entity"
    PUBLIC_LEGAL_PARTY = "public_legal_party"
    OIL_FIELD = "oil_field"
    SHARED_RESERVOIR = "shared_reservoir"
    CONTRACTED_AREA = "contracted_area"
    FPSO = "fpso"
    OPERATING_INSTALLATION = "operating_installation"


_OBJECT_TYPES = {
    Scope.NATIONAL_JURISDICTION: "Country",
    Scope.STATISTICAL_TERRITORY: "Country",
    Scope.COMPANY_PROFILE: "CompanyProfile",
    Scope.REGISTERED_ENTITY: "CorporateEntity",
    Scope.PUBLIC_LEGAL_PARTY: "LegalParty",
}
_CHINA_IDS = {"j3:country:CHN", "country:CHN"}


@dataclass(frozen=True)
class ObjectRef:
    id: str
    scope: Scope

    def __post_init__(self) -> None:
        if not self.id.strip() or not isinstance(self.scope, Scope):
            raise ValueError("Object reference requires an ID and a defined scope")
        if self.id in _CHINA_IDS and self.scope is not Scope.NATIONAL_JURISDICTION:
            raise ValueError("The China journey references identify a national jurisdiction")

    def to_dict(self) -> dict[str, str]:
        return {"id": self.id, "type": _OBJECT_TYPES.get(self.scope, "Asset"), "scope": self.scope}


J3_CHINA = ObjectRef("j3:country:CHN", Scope.NATIONAL_JURISDICTION)
CHINA = ObjectRef("country:CHN", Scope.NATIONAL_JURISDICTION)


class Namespace(StrEnum):
    CNPJ = "br.cnpj"
    CIK = "us.sec.cik"


@dataclass(frozen=True)
class Identifier:
    namespace: Namespace
    value: str

    def __post_init__(self) -> None:
        # Callers preserve the full registry ID, including leading zeros.
        width = {Namespace.CNPJ: 14, Namespace.CIK: 10}.get(self.namespace)
        if not isinstance(self.namespace, Namespace) or not re.fullmatch(rf"[0-9]{{{width}}}", self.value):
            raise ValueError("Identifier must be normalized within its issuing namespace")

    def to_dict(self) -> dict[str, str]:
        return {"type": "ExternalIdentifier", "namespace": self.namespace, "value": self.value}


class Predicate(StrEnum):
    SAME_AS = "same_as"
    PROFILE_ANCHOR = "profile_anchor"
    IDENTIFIES = "identifies"
    NAME = "name"
    ASSET_OWNER = "asset_owner"
    OPERATOR = "operator"
    CONTRACTUAL_PARTICIPATING_INTEREST = "contractual_participating_interest"
    GOVERNANCE_CONTROL = "governance_control"


class Basis(StrEnum):
    FIELD_OPERATION = "field_operation"
    FPSO_OPERATIONS_AND_MAINTENANCE = "fpso_operations_and_maintenance"
    INSTALLATION_OPERATION = "installation_operation"
    PHYSICAL_FIELD_TITLE = "physical_field_title"
    VESSEL_TITLE = "vessel_title"
    INSTALLATION_TITLE = "installation_title"
    WHOLE_SHARED_RESERVOIR = "whole_shared_reservoir"
    CONTRACTED_AREA = "contracted_area"
    ACQUIRED_BLOCK = "acquired_block"
    ISSUER_VOTING_SHARES = "issuer_voting_shares"


class Effect(StrEnum):
    ESTABLISHED = "established"
    CONDITIONAL = "conditional"


class Authority(StrEnum):
    JURISDICTION_CROSSWALK = "jurisdiction_crosswalk"
    SAME_OBJECT_BRIDGE = "same_object_bridge"
    PROFILE_CURATION = "profile_curation"
    LEGAL_IDENTIFIER_BRIDGE = "legal_identifier_bridge"
    SOURCE_ATTRIBUTED_NAME = "source_attributed_name"
    TITLE_RECORD = "title_record"
    OPERATION_RECORD = "operation_record"
    EFFECTIVE_PARTICIPATION = "effective_participation"
    ANNOUNCED_PARTICIPATION = "announced_participation"
    GOVERNANCE_INSTRUMENT = "governance_instrument"


@dataclass(frozen=True)
class Role:
    basis: Basis
    instrument_ref: str
    share_bps: int | None = None
    effect: Effect = Effect.ESTABLISHED
    scheduled_for: date | None = None

    def __post_init__(self) -> None:
        if not isinstance(self.basis, Basis) or not self.instrument_ref:
            raise ValueError("Role requires a defined basis and an instrument reference")
        if not isinstance(self.effect, Effect):
            raise ValueError("Role requires a defined effect state")
        if self.share_bps is not None and (
            type(self.share_bps) is not int or not 0 <= self.share_bps <= 10_000
        ):
            raise ValueError("Role share must be stated in integer basis points")
        if self.scheduled_for is not None:
            if type(self.scheduled_for) is not date or self.effect is not Effect.CONDITIONAL:
                raise ValueError("A scheduled calendar date belongs to a conditional role")

    def to_dict(self) -> dict:
        return {
            "basis": self.basis,
            "instrument_ref": self.instrument_ref,
            "share_bps": self.share_bps,
            "effect": self.effect,
            "scheduled_for": self.scheduled_for.isoformat() if self.scheduled_for else None,
        }


_INTEREST = Predicate.CONTRACTUAL_PARTICIPATING_INTEREST
_ROLE_SCOPE = {
    Basis.FIELD_OPERATION: (Predicate.OPERATOR, Scope.OIL_FIELD),
    Basis.FPSO_OPERATIONS_AND_MAINTENANCE: (Predicate.OPERATOR, Scope.FPSO),
    Basis.INSTALLATION_OPERATION: (Predicate.OPERATOR, Scope.OPERATING_INSTALLATION),
    Basis.PHYSICAL_FIELD_TITLE: (Predicate.ASSET_OWNER, Scope.OIL_FIELD),
    Basis.VESSEL_TITLE: (Predicate.ASSET_OWNER, Scope.FPSO),
    Basis.INSTALLATION_TITLE: (Predicate.ASSET_OWNER, Scope.OPERATING_INSTALLATION),
    Basis.WHOLE_SHARED_RESERVOIR: (_INTEREST, Scope.SHARED_RESERVOIR),
    Basis.CONTRACTED_AREA: (_INTEREST, Scope.CONTRACTED_AREA),
    Basis.ACQUIRED_BLOCK: (_INTEREST, Scope.SHARED_RESERVOIR),
    Basis.ISSUER_VOTING_SHARES: (Predicate.GOVERNANCE_CONTROL, Scope.REGISTERED_ENTITY),
}
_LEGAL_PARTIES = {Scope.REGISTERED_ENTITY, Scope.PUBLIC_LEGAL_PARTY}
_ROLE_AUTHORITIES = {
    Predicate.ASSET_OWNER: Authority.TITLE_RECORD,
    Predicate.OPERATOR: Authority.OPERATION_RECORD,
    Predicate.GOVERNANCE_CONTROL: Authority.GOVERNANCE_INSTRUMENT,
}
_OBJECT_BRIDGE_SCOPES = set(Scope) - {
    Scope.NATIONAL_JURISDICTION, Scope.STATISTICAL_TERRITORY, Scope.COMPANY_PROFILE,
}


@dataclass(frozen=True)
class Triple:
    subject: ObjectRef | Identifier
    predicate: Predicate
    object: ObjectRef | str
    role: Role | None = None

    @property
    def basis(self) -> Basis | None:
        return self.role.basis if self.role else None

    @property
    def effect(self) -> Effect:
        return self.role.effect if self.role else Effect.ESTABLISHED

    def required_authority(self) -> Authority:
        subject, predicate, target = self.subject, self.predicate, self.object
        if not isinstance(predicate, Predicate):
            raise ValueError("Triple requires a defined predicate")
        if predicate is Predicate.IDENTIFIES:
            if (
                self.role is None and isinstance(subject, Identifier)
                and isinstance(target, ObjectRef) and target.scope is Scope.REGISTERED_ENTITY
            ):
                return Authority.LEGAL_IDENTIFIER_BRIDGE
            raise ValueError("A registry identifier can only identify a registered legal entity")
        if not isinstance(subject, ObjectRef):
            raise ValueError("Triple requires a typed subject")
        if self.role is not None:
            return self._role_authority(subject, target)
        if predicate is Predicate.NAME and isinstance(target, str) and target.strip():
            return Authority.SOURCE_ATTRIBUTED_NAME
        if isinstance(target, ObjectRef):
            if (
                predicate is Predicate.PROFILE_ANCHOR and subject.scope is Scope.COMPANY_PROFILE
                and target.scope is Scope.REGISTERED_ENTITY
            ):
                return Authority.PROFILE_CURATION
            if predicate is Predicate.SAME_AS and subject.id != target.id:
                if (subject, target) == (J3_CHINA, CHINA):
                    return Authority.JURISDICTION_CROSSWALK
                if subject.scope == target.scope and subject.scope in _OBJECT_BRIDGE_SCOPES:
                    return Authority.SAME_OBJECT_BRIDGE
        raise ValueError("Triple crosses unsupported identity or predicate scopes")

    def _role_authority(self, subject: ObjectRef, target: ObjectRef | str) -> Authority:
        assert self.role is not None
        role = self.role
        if (
            subject.scope not in _LEGAL_PARTIES or not isinstance(target, ObjectRef)
            or (self.predicate, target.scope) != _ROLE_SCOPE[role.basis]
        ):
            raise ValueError("Role predicate, legal subject, or object scope conflicts with its basis")
        if self.predicate is _INTEREST:
            if role.share_bps is None:
                raise ValueError("Participation requires a share in its stated denominator")
            if role.effect is Effect.CONDITIONAL:
                return Authority.ANNOUNCED_PARTICIPATION
            if role.basis is Basis.ACQUIRED_BLOCK:
                raise ValueError("Auction allocation cannot be read as an effective participation")
            return Authority.EFFECTIVE_PARTICIPATION
        if role.effect is not Effect.ESTABLISHED:
            raise ValueError("Conditional roles are scoped to participation in this linker")
        if self.predicate is not Predicate.GOVERNANCE_CONTROL and role.share_bps is not None:
            raise ValueError("Physical title and operation have no share denominator in this linker")
        return _ROLE_AUTHORITIES[self.predicate]

    def to_dict(self) -> dict:
        result = {
            "subject": self.subject.to_dict(),
            "predicate": self.predicate,
            "object": self.object.to_dict() if isinstance(self.object, ObjectRef) else self.object,
        }
        if self.role is not None:
            result["role"] = self.role.to_dict()
        return result


@dataclass(frozen=True, order=True)
class EvidencePin:
    source_id: str
    document_id: str
    document_version: str
    fact_id: str
    fact_version: int

    def __post_init__(self) -> None:
        if not all((self.source_id, self.document_id, self.document_version, self.fact_id)):
            raise ValueError("An evidence pin requires exact Source, Document and fact references")
        if type(self.fact_version) is not int or self.fact_version < 1:
            raise ValueError("Fact version must be a positive integer within its source stream")


@dataclass(frozen=True)
class Assertion:
    triple: Triple
    pin: EvidencePin
    authority: Authority
    known_at: datetime
    valid_from: date
    valid_to: date | None = None

    def __post_init__(self) -> None:
        if self.authority is not self.triple.required_authority():
            raise ValueError("Source authority does not support this triple")
        if self.known_at.utcoffset() is None:
            raise ValueError("known_at requires a timezone")
        if type(self.valid_from) is not date or (self.valid_to is not None and type(self.valid_to) is not date):
            raise ValueError("Assertion validity requires calendar dates")
        if self.valid_to is not None and self.valid_to <= self.valid_from:
            raise ValueError("Assertion interval must be nonempty")
