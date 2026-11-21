"""Read-only identity and scoped relation lookup for NIV-85."""

from collections.abc import Callable, Iterable
from dataclasses import asdict, dataclass
from datetime import date, datetime
from enum import StrEnum

from .model import Assertion, Authority, Basis, Effect, EvidencePin, Identifier, ObjectRef, Predicate, Scope, Triple


# A decision permits this exact assertion and its minimal provenance in this channel.
# Source policy and proof inspection remain at the caller boundary.
RightsCheck = Callable[[EvidencePin, str], bool]


@dataclass(frozen=True)
class ReadContext:
    as_of: date
    known_at: datetime
    channel: str

    def __post_init__(self) -> None:
        if type(self.as_of) is not date or self.known_at.utcoffset() is None or not self.channel.strip():
            raise ValueError("Read requires a calendar as_of, timezone-aware known_at and explicit channel")


class Status(StrEnum):
    RESOLVED = "RESOLVED"
    UNKNOWN = "UNKNOWN"
    UNRESOLVED = "UNRESOLVED"
    RESTRICTED = "RESTRICTED"


@dataclass(frozen=True)
class Provenance:
    pin: EvidencePin
    authority: Authority
    known_at: datetime
    valid_from: date
    valid_to: date | None

    def to_dict(self) -> dict:
        return {
            "pin": asdict(self.pin),
            "authority": self.authority,
            "known_at": self.known_at.isoformat(),
            "valid_from": self.valid_from.isoformat(),
            "valid_to": self.valid_to.isoformat() if self.valid_to else None,
        }


@dataclass(frozen=True)
class ResolvedTriple:
    triple: Triple
    provenance: tuple[Provenance, ...]

    def to_dict(self) -> dict:
        return {
            "triple": self.triple.to_dict(),
            "provenance": [record.to_dict() for record in self.provenance],
        }


@dataclass(frozen=True)
class ReadResult:
    status: Status
    reason: str
    data: ResolvedTriple | None = None

    def to_dict(self) -> dict:
        return {
            "status": self.status,
            "reason": self.reason,
            "data": self.data.to_dict() if self.data else None,
        }


class IdentityLinker:
    def __init__(
        self, assertions: Iterable[Assertion], *, can_read: RightsCheck | None = None,
    ) -> None:
        self._assertions = tuple(assertions)
        self._can_read = can_read
        streams: dict[tuple[str, str], tuple[ObjectRef | Identifier, Predicate, Basis | None]] = {}
        versions: set[tuple[str, str, int]] = set()
        scopes: dict[str, Scope] = {}
        for row in self._assertions:
            for ref in (row.triple.subject, row.triple.object):
                if isinstance(ref, ObjectRef) and scopes.setdefault(ref.id, ref.scope) != ref.scope:
                    raise ValueError("An object ID cannot occupy different scopes")
            stream = (row.pin.source_id, row.pin.fact_id)
            key = (row.triple.subject, row.triple.predicate, row.triple.basis)
            if streams.setdefault(stream, key) != key:
                raise ValueError("A fact stream must keep its subject, predicate and basis")
            version = (*stream, row.pin.fact_version)
            if version in versions:
                raise ValueError("Duplicate source-specific fact version")
            versions.add(version)

    def read(
        self,
        subject: ObjectRef | Identifier | str,
        predicate: Predicate,
        context: ReadContext,
        *,
        basis: Basis | None = None,
        effect: Effect = Effect.ESTABLISHED,
        source_id: str | None = None,
        pin: EvidencePin | None = None,
    ) -> ReadResult:
        """Resolve one scoped value directly, with no name matching or transitive linking."""
        if isinstance(subject, str):
            return ReadResult(Status.UNRESOLVED, "typed_subject_required")
        if (
            not isinstance(predicate, Predicate) or not isinstance(effect, Effect)
            or (basis is not None and not isinstance(basis, Basis))
        ):
            raise ValueError("Read requires typed predicate, effect and optional basis")

        latest: dict[tuple[str, str], Assertion] = {}
        for row in self._assertions:
            if (
                (row.triple.subject, row.triple.predicate, row.triple.basis)
                != (subject, predicate, basis)
                or row.known_at > context.known_at
                or (source_id is not None and row.pin.source_id != source_id)
                or (pin is not None and row.pin != pin)
            ):
                continue
            stream = (row.pin.source_id, row.pin.fact_id)
            previous = latest.get(stream)
            if previous is None or row.pin.fact_version > previous.pin.fact_version:
                latest[stream] = row

        # Filter after selecting the source revision so a correction that narrows
        # validity or changes effect cannot resurrect its superseded version.
        applicable = sorted(
            (row for row in latest.values()
             if row.valid_from <= context.as_of
             and (row.valid_to is None or context.as_of < row.valid_to)
             and row.triple.effect is effect),
            key=lambda row: row.pin,
        )
        if not applicable:
            return ReadResult(Status.UNKNOWN, "no_applicable_assertion")
        if self._can_read is None or any(
            self._can_read(row.pin, context.channel) is not True for row in applicable
        ):
            return ReadResult(Status.RESTRICTED, "rights_not_granted")
        if len({row.triple for row in applicable}) != 1:
            return ReadResult(Status.UNRESOLVED, "conflicting_assertions")
        provenance = tuple(
            Provenance(row.pin, row.authority, row.known_at, row.valid_from, row.valid_to)
            for row in applicable
        )
        data = ResolvedTriple(applicable[0].triple, provenance)
        return ReadResult(Status.RESOLVED, "supported_by_evidence", data)
