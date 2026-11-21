"""Synthetic evidence for the NIV-89 acceptance scenarios, with no publisher payloads."""

import json
from dataclasses import replace
from datetime import date, datetime, timedelta, timezone

from app.services.argos_entity_linker import IdentityLinker, ReadContext
from app.services.argos_entity_linker.model import (
    CHINA, J3_CHINA, Assertion, Authority, Basis, Effect, EvidencePin, Identifier, Namespace,
    ObjectRef, Predicate, Role, Scope, Triple,
)


PROFILE = ObjectRef("niv79:profile:petrobras", Scope.COMPANY_PROFILE)
PETROBRAS = ObjectRef("niv79:entity:petrobras", Scope.REGISTERED_ENTITY)
CNODC = ObjectRef("niv79:entity:cnodc", Scope.REGISTERED_ENTITY)
CNOOC = ObjectRef("niv79:entity:cnooc", Scope.REGISTERED_ENTITY)
FIELD = ObjectRef("niv79:asset:mero", Scope.OIL_FIELD)
VESSEL = ObjectRef("niv79:asset:marechal-duque-de-caxias", Scope.FPSO)
RESERVOIR = ObjectRef("synthetic:mero:reservoir", Scope.SHARED_RESERVOIR)
AREA = ObjectRef("synthetic:mero:contracted-area", Scope.CONTRACTED_AREA)
INSTALLATION = ObjectRef("synthetic:mero:installation", Scope.OPERATING_INSTALLATION)
UNION = ObjectRef("niv79:legal-party:uniao", Scope.PUBLIC_LEGAL_PARTY)
SHIPOWNER = ObjectRef("synthetic:entity:shipowner", Scope.REGISTERED_ENTITY)
TECHNICAL_OPERATOR = ObjectRef("synthetic:entity:technical-operator", Scope.REGISTERED_ENTITY)

# These case inputs are from NIV-71. The bridge records and dates below are synthetic.
PETROBRAS_CNPJ = Identifier(Namespace.CNPJ, "33000167000101")
PETROBRAS_CIK = Identifier(Namespace.CIK, "0001119639")
CNODC_CNPJ = Identifier(Namespace.CNPJ, "19233194000101")
CNOOC_CNPJ = Identifier(Namespace.CNPJ, "19246634000157")

LOCAL_CHANNEL = "local_private"
AS_OF = date(2026, 11, 18)
KNOWN_AT = datetime(2026, 11, 18, 12, tzinfo=timezone.utc)
CONTEXT = ReadContext(AS_OF, KNOWN_AT, LOCAL_CHANNEL)
TRANSFER_DATE = date(2027, 3, 1)


def fixture_assertion(
    triple: Triple, authority: Authority, fact: str, *, source: str = "curation",
    valid_to: date | None = None,
) -> Assertion:
    return Assertion(
        triple,
        EvidencePin(f"synthetic:source:{source}", f"synthetic:document:{source}", "v1",
                    f"synthetic:fact:{fact}", 1),
        authority,
        KNOWN_AT,
        AS_OF,
        valid_to,
    )


def fixture_assertions() -> tuple[Assertion, ...]:
    return (
        fixture_assertion(Triple(J3_CHINA, Predicate.SAME_AS, CHINA),
                          Authority.JURISDICTION_CROSSWALK, "china-jurisdiction"),
        fixture_assertion(Triple(PROFILE, Predicate.PROFILE_ANCHOR, PETROBRAS),
                          Authority.PROFILE_CURATION, "petrobras-profile"),
        fixture_assertion(Triple(PETROBRAS_CNPJ, Predicate.IDENTIFIES, PETROBRAS),
                          Authority.LEGAL_IDENTIFIER_BRIDGE, "petrobras-cnpj", source="cnpj-bridge"),
        fixture_assertion(Triple(PETROBRAS_CIK, Predicate.IDENTIFIES, PETROBRAS),
                          Authority.LEGAL_IDENTIFIER_BRIDGE, "petrobras-cik", source="issuer-bridge"),
        fixture_assertion(Triple(CNODC_CNPJ, Predicate.IDENTIFIES, CNODC),
                          Authority.LEGAL_IDENTIFIER_BRIDGE, "cnodc-cnpj", source="cnpj-bridge"),
        fixture_assertion(Triple(CNOOC_CNPJ, Predicate.IDENTIFIES, CNOOC),
                          Authority.LEGAL_IDENTIFIER_BRIDGE, "cnooc-cnpj", source="cnpj-bridge"),
        fixture_assertion(Triple(PETROBRAS, Predicate.OPERATOR, FIELD,
                                Role(Basis.FIELD_OPERATION, "synthetic:instrument:field-operation")),
                          Authority.OPERATION_RECORD, "field-operation"),
        fixture_assertion(Triple(SHIPOWNER, Predicate.ASSET_OWNER, VESSEL,
                                Role(Basis.VESSEL_TITLE, "synthetic:instrument:vessel-title")),
                          Authority.TITLE_RECORD, "vessel-title"),
        fixture_assertion(Triple(TECHNICAL_OPERATOR, Predicate.OPERATOR, INSTALLATION,
                                Role(Basis.INSTALLATION_OPERATION, "synthetic:instrument:installation")),
                          Authority.OPERATION_RECORD, "installation-operation"),
        fixture_assertion(Triple(UNION, Predicate.GOVERNANCE_CONTROL, PETROBRAS,
                                Role(Basis.ISSUER_VOTING_SHARES, "synthetic:instrument:issuer-votes", 5026)),
                          Authority.GOVERNANCE_INSTRUMENT, "issuer-governance"),
        fixture_assertion(Triple(PETROBRAS, Predicate.CONTRACTUAL_PARTICIPATING_INTEREST, RESERVOIR,
                                Role(Basis.WHOLE_SHARED_RESERVOIR, "synthetic:instrument:unitisation", 3860)),
                          Authority.EFFECTIVE_PARTICIPATION, "reservoir-baseline",
                          valid_to=AS_OF + timedelta(days=1)),
        fixture_assertion(Triple(PETROBRAS, Predicate.CONTRACTUAL_PARTICIPATING_INTEREST, AREA,
                                Role(Basis.CONTRACTED_AREA, "synthetic:instrument:production-sharing", 4000)),
                          Authority.EFFECTIVE_PARTICIPATION, "contracted-baseline",
                          valid_to=AS_OF + timedelta(days=1)),
        fixture_assertion(Triple(PETROBRAS, Predicate.CONTRACTUAL_PARTICIPATING_INTEREST, RESERVOIR,
                                Role(Basis.ACQUIRED_BLOCK, "synthetic:instrument:auction", 8000, Effect.CONDITIONAL)),
                          Authority.ANNOUNCED_PARTICIPATION, "block-allocation"),
        fixture_assertion(Triple(PETROBRAS, Predicate.CONTRACTUAL_PARTICIPATING_INTEREST, RESERVOIR,
                                Role(Basis.WHOLE_SHARED_RESERVOIR, "synthetic:instrument:transfer",
                                     4140, Effect.CONDITIONAL, TRANSFER_DATE)),
                          Authority.ANNOUNCED_PARTICIPATION, "conditional-transfer"),
    )


def fixture_policy(pin: EvidencePin, channel: str) -> bool:
    return channel == LOCAL_CHANNEL and pin in _FIXTURE_PINS


_FIXTURE_PINS = frozenset(row.pin for row in fixture_assertions())


def sample_payload() -> dict:
    rows = fixture_assertions()
    linker = IdentityLinker(rows, can_read=fixture_policy)
    future = replace(CONTEXT, as_of=date(2027, 3, 2))
    forecast = rows[-1].triple
    return {
        "synthetic": True,
        "context": {"as_of": AS_OF.isoformat(), "known_at": KNOWN_AT.isoformat(), "channel": LOCAL_CHANNEL},
        "triples": [
            linker.read(row.triple.subject, row.triple.predicate, CONTEXT,
                        basis=row.triple.basis, effect=row.triple.effect, pin=row.pin).to_dict()
            for row in rows
        ],
        "later_as_of_same_known_at": {
            "as_of": future.as_of.isoformat(),
            "established": linker.read(forecast.subject, forecast.predicate, future,
                                       basis=forecast.basis).to_dict(),
            "conditional": linker.read(forecast.subject, forecast.predicate, future,
                                       basis=forecast.basis, effect=Effect.CONDITIONAL).to_dict(),
        },
        "name_only": linker.read("CNOOC", Predicate.SAME_AS, CONTEXT).to_dict(),
        "public_channel": linker.read(J3_CHINA, Predicate.SAME_AS,
                                      replace(CONTEXT, channel="public_display")).to_dict(),
    }


if __name__ == "__main__":
    print(json.dumps(sample_payload(), indent=2, ensure_ascii=True))
