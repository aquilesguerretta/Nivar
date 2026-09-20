"""First bounded Argos Signal runtime for ``ons.capacidade_geracao``.

The module deliberately keeps three layers separate:

* deterministic observation -> :class:`CandidateEvent`;
* policy context + event -> :class:`PromotionEvaluation`;
* promoted evaluation -> :class:`SignalClaimPack`.

It is source-specific by design.  It neither reads the Gold Set nor accepts a
Gold case identifier, and it never contacts ONS.  Stored-snapshot execution
reconstructs the exact Argos Memory artifacts selected by the caller; the pure
    builder is also usable with already-preserved bytes, but only the Argos
    Memory adapter can attest evidence for Signal surfacing.
"""

from __future__ import annotations

import csv
import hashlib
import hmac
import io
import json
import re
import secrets
import uuid
from dataclasses import dataclass, field
from types import MappingProxyType
from typing import Literal, Mapping, TypeAlias

from sqlalchemy.orm import Session

from app.services.argos_memory import reconstruct_snapshot
from app.services.argos_ons_capacidade_geracao_diff import (
    DELIMITER,
    DIFF_VERSION,
    EXPECTED_HEADER,
    PARSER_VERSION,
    SOURCE_ID,
    ContentDelta,
    DuplicateRowIdentityError,
    SchemaError,
    diff_capacidade_geracao,
    parse_capacidade_geracao,
)


GOLD_SET_VERSION = "argos.signal-gold.ons-capacidade@0.1"
RIGHTS_RECORD_REF = "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"

Decision: TypeAlias = Literal["PROMOTE", "HOLD", "REJECT"]
MaterialityState: TypeAlias = Literal["MATERIAL", "NON_MATERIAL", "NOT_APPLICABLE"]


class SignalRuntimeError(ValueError):
    """The bounded runtime received an input outside its explicit contract."""


@dataclass(frozen=True)
class RightsContext:
    """Rights state for one intended surface; never an observed Event."""

    surface: str
    state: str
    rights_record_ref: str | None = None
    attribution_required: bool | None = None


@dataclass(frozen=True)
class SnapshotPairObservation:
    """Caller-supplied payloads/refs for deterministic, unattested computation."""

    source_id: str
    from_bytes: bytes
    to_bytes: bytes
    from_evidence_ref: str
    to_evidence_ref: str


@dataclass(frozen=True)
class PayloadObservation:
    """One preserved payload expected to exercise fail-closed parsing."""

    source_id: str
    payload: bytes
    evidence_ref: str


@dataclass(frozen=True)
class ReferenceReceiptObservation:
    """Verified unchanged receipt whose production bytes need not be loaded."""

    source_id: str
    from_snapshot_ref: str
    to_snapshot_ref: str
    sha256: str
    byte_size: int


@dataclass(frozen=True)
class SourceHealthObservation:
    """Honest operational context when no trustworthy new content exists."""

    source_id: str
    source_health_state: str
    observation: str
    evidence_ref: str


@dataclass(frozen=True)
class EvidenceGapObservation:
    """Honest context for a missing required reconstruction reference."""

    source_id: str
    required_evidence_ref: str
    required_evidence_reconstructible: bool


SignalObservation: TypeAlias = (
    SnapshotPairObservation
    | PayloadObservation
    | ReferenceReceiptObservation
    | SourceHealthObservation
    | EvidenceGapObservation
)


@dataclass(frozen=True)
class CandidateEvent:
    """A deterministic observation with no causality or materiality judgment."""

    source_id: str
    event_kind: str
    facts: Mapping[str, str | int | bool]
    evidence_refs: tuple[str, ...]
    deterministic_result_kind: str
    byte_relation: str
    parser_version: str | None
    diff_version: str | None
    from_snapshot_ref: str | None = None
    to_snapshot_ref: str | None = None
    content_delta: ContentDelta | None = None
    _runtime_marker: object | None = field(
        default=None,
        init=False,
        repr=False,
        compare=False,
    )
    _integrity_digest: str | None = field(
        default=None,
        init=False,
        repr=False,
        compare=False,
    )
    _evidence_attestation: object | None = field(
        default=None,
        init=False,
        repr=False,
        compare=False,
    )

    def __post_init__(self) -> None:
        object.__setattr__(self, "facts", MappingProxyType(dict(self.facts)))


@dataclass(frozen=True)
class PromotionContext:
    """Non-event inputs required by the released v0.1 promotion gate."""

    source_health_state: str
    evidence_reconstructible: bool
    semantics_understood: bool
    materiality_state: MaterialityState
    rights: RightsContext
    additional_evidence_refs: tuple[str, ...] = field(default_factory=tuple)
    candidate_wording: str | None = None


@dataclass(frozen=True)
class ClaimGuardEvaluation:
    candidate_wording: str
    result: Literal["FAIL"]
    reason_code: Literal["UNSUPPORTED_CAUSALITY", "UNSUPPORTED_PUBLISHER_REVISION"]
    prohibited_reason_codes: tuple[str, ...]
    fallback_claim: str


@dataclass(frozen=True)
class PromotionEvaluation:
    candidate_event: CandidateEvent
    context: PromotionContext
    decision: Decision
    reason_code: str
    evidence_refs: tuple[str, ...]
    required_caveats: tuple[str, ...]
    forbidden_claims: tuple[str, ...]
    claim_guard: ClaimGuardEvaluation | None = None


@dataclass(frozen=True, init=False)
class SignalClaimPack:
    """Surfaceable factual claim minted only by :func:`make_signal_claim_pack`."""

    gold_set_version: str
    source_id: str
    candidate_event: CandidateEvent
    decision: Literal["PROMOTE"]
    reason_code: str
    factual_claim: str
    evidence_refs: tuple[str, ...]
    required_caveats: tuple[str, ...]
    forbidden_claims: tuple[str, ...]
    rights: RightsContext
    claim_guard: ClaimGuardEvaluation | None
    _surface_marker: object = field(init=False, repr=False, compare=False)

    def __init__(self, *args: object, **kwargs: object) -> None:
        raise SignalRuntimeError(
            "SignalClaimPack can only be constructed by make_signal_claim_pack"
        )


_FIELD_EVENT_KIND = {
    "val_potenciaefetiva": "EFFECTIVE_POWER_CHANGED",
    "dat_entradaoperacao": "OPERATION_DATE_RECORDED_OR_CHANGED",
    "dat_desativacao": "DEACTIVATION_DATE_RECORDED_OR_CHANGED",
    "nom_agenteproprietario": "OWNER_RECORD_CHANGED",
    "nom_agenteoperador": "OPERATOR_RECORD_CHANGED",
    "nom_combustivel": "FUEL_CLASSIFICATION_CHANGED",
    "nom_unidadegeradora": "PRESENTATION_LABEL_CHANGED",
    "nom_modalidadeoperacao": "OPERATING_MODALITY_CHANGED",
}

_PROMOTABLE_EVENT_KINDS = frozenset(
    {
        "EFFECTIVE_POWER_CHANGED",
        "UNIT_ADDED_TO_DATASET",
        "OPERATION_DATE_RECORDED_OR_CHANGED",
        "DEACTIVATION_DATE_RECORDED_OR_CHANGED",
        "OWNER_RECORD_CHANGED",
        "OPERATOR_RECORD_CHANGED",
        "FUEL_CLASSIFICATION_CHANGED",
    }
)

_PROHIBITED_CLAIM_REASONS = (
    "UNSUPPORTED_CAUSALITY",
    "UNSUPPORTED_PUBLISHER_REVISION",
)

_PUBLISHER_REVISION_PATTERN = re.compile(
    r"\b(ons\s+(corrected|revised)|publisher\s+(corrected|revised|revision)|"
    r"corrected\s+the\s+(capacity|dataset))\b",
    re.IGNORECASE,
)

_RUNTIME_EVENT_MARKER = object()
_RUNTIME_EVENT_INTEGRITY_KEY = secrets.token_bytes(32)
_ARGOS_MEMORY_EVIDENCE_ATTESTATION = object()
_RUNTIME_CLAIM_PACK_MARKER = object()


def _validate_source_id(source_id: str) -> None:
    if source_id != SOURCE_ID:
        raise SignalRuntimeError(
            f"this runtime accepts only {SOURCE_ID!r}, got {source_id!r}"
        )


def _event(
    *,
    event_kind: str,
    facts: Mapping[str, str | int | bool],
    evidence_refs: tuple[str, ...],
    deterministic_result_kind: str,
    byte_relation: str,
    parser_version: str | None,
    diff_version: str | None,
    from_snapshot_ref: str | None = None,
    to_snapshot_ref: str | None = None,
    content_delta: ContentDelta | None = None,
) -> CandidateEvent:
    event = CandidateEvent(
        source_id=SOURCE_ID,
        event_kind=event_kind,
        facts=facts,
        evidence_refs=evidence_refs,
        deterministic_result_kind=deterministic_result_kind,
        byte_relation=byte_relation,
        parser_version=parser_version,
        diff_version=diff_version,
        from_snapshot_ref=from_snapshot_ref,
        to_snapshot_ref=to_snapshot_ref,
        content_delta=content_delta,
    )
    object.__setattr__(event, "_runtime_marker", _RUNTIME_EVENT_MARKER)
    object.__setattr__(event, "_integrity_digest", _candidate_event_digest(event))
    return event


def _delta_payload(delta: ContentDelta | None) -> dict | None:
    if delta is None:
        return None
    return {
        "added": delta.added,
        "removed": delta.removed,
        "changed": [
            {
                "identity": row.identity,
                "changes": [
                    {
                        "field": change.field,
                        "before": change.before,
                        "after": change.after,
                    }
                    for change in row.changes
                ],
            }
            for row in delta.changed
        ],
    }


def _candidate_event_digest(event: CandidateEvent) -> str:
    payload = {
        "source_id": event.source_id,
        "event_kind": event.event_kind,
        "facts": dict(event.facts),
        "evidence_refs": event.evidence_refs,
        "deterministic_result_kind": event.deterministic_result_kind,
        "byte_relation": event.byte_relation,
        "parser_version": event.parser_version,
        "diff_version": event.diff_version,
        "from_snapshot_ref": event.from_snapshot_ref,
        "to_snapshot_ref": event.to_snapshot_ref,
        "content_delta": _delta_payload(event.content_delta),
    }
    encoded = json.dumps(
        payload,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return hmac.new(
        _RUNTIME_EVENT_INTEGRITY_KEY,
        encoded,
        hashlib.sha256,
    ).hexdigest()


def _require_event(condition: bool, message: str) -> None:
    if not condition:
        raise SignalRuntimeError(f"invalid CandidateEvent: {message}")


def _validate_delta_shape(delta: ContentDelta) -> None:
    _require_event(
        delta.added == sorted(set(delta.added)),
        "added identities must be unique and sorted",
    )
    _require_event(
        delta.removed == sorted(set(delta.removed)),
        "removed identities must be unique and sorted",
    )
    _require_event(
        not (set(delta.added) & set(delta.removed)),
        "one identity cannot be both added and removed",
    )
    changed_identities = [row.identity for row in delta.changed]
    _require_event(
        changed_identities == sorted(set(changed_identities)),
        "changed identities must be unique and sorted",
    )
    _require_event(
        not (set(changed_identities) & (set(delta.added) | set(delta.removed))),
        "membership and field changes cannot share an identity",
    )
    header_order = {field_name: index for index, field_name in enumerate(EXPECTED_HEADER)}
    for row in delta.changed:
        _require_event(bool(row.identity), "changed identity must not be blank")
        _require_event(bool(row.changes), "changed row must contain a field change")
        fields = [change.field for change in row.changes]
        _require_event(len(fields) == len(set(fields)), "changed fields must be unique")
        _require_event(
            all(field_name in header_order for field_name in fields),
            "changed field must belong to the released parser schema",
        )
        _require_event(
            fields == sorted(fields, key=header_order.__getitem__),
            "changed fields must follow released parser order",
        )
        _require_event(
            all(change.before != change.after for change in row.changes),
            "field change must have different before and after values",
        )


def _expected_atomic_events(
    delta: ContentDelta,
) -> tuple[tuple[str, Mapping[str, str]], ...]:
    expected: list[tuple[str, Mapping[str, str]]] = []
    expected.extend(
        (
            "UNIT_ADDED_TO_DATASET",
            {"identity": identity, "membership": "added_to_later_observation"},
        )
        for identity in delta.added
    )
    expected.extend(
        (
            "UNIT_REMOVED_FROM_DATASET",
            {"identity": identity, "membership": "absent_from_later_observation"},
        )
        for identity in delta.removed
    )
    for row in delta.changed:
        for change in row.changes:
            event_kind = _FIELD_EVENT_KIND.get(change.field)
            _require_event(
                event_kind is not None,
                f"field {change.field!r} has no released Event semantics",
            )
            assert event_kind is not None
            expected.append(
                (
                    event_kind,
                    {
                        "identity": row.identity,
                        "field": change.field,
                        "before": change.before,
                        "after": change.after,
                    },
                )
            )
    return tuple(expected)


def _validate_candidate_event(event: CandidateEvent) -> None:
    _require_event(
        event._runtime_marker is _RUNTIME_EVENT_MARKER,
        "event was not produced by the bounded deterministic runtime",
    )
    expected_digest = _candidate_event_digest(event)
    _require_event(
        event._integrity_digest is not None
        and hmac.compare_digest(event._integrity_digest, expected_digest),
        "event changed after deterministic construction",
    )
    _validate_source_id(event.source_id)
    _require_event(
        bool(event.evidence_refs)
        and all(isinstance(ref, str) and bool(ref.strip()) for ref in event.evidence_refs),
        "evidence references must be present and non-blank",
    )

    result_kind = event.deterministic_result_kind
    if result_kind == "CONTENT_DELTA":
        _require_event(event.parser_version == PARSER_VERSION, "parser version mismatch")
        _require_event(event.diff_version == DIFF_VERSION, "diff version mismatch")
        _require_event(
            isinstance(event.content_delta, ContentDelta),
            "CONTENT_DELTA event must carry its deterministic delta",
        )
        _require_event(
            event.from_snapshot_ref is not None and event.from_snapshot_ref.strip() != "",
            "CONTENT_DELTA event requires a from evidence reference",
        )
        _require_event(
            event.to_snapshot_ref is not None and event.to_snapshot_ref.strip() != "",
            "CONTENT_DELTA event requires a to evidence reference",
        )
        _require_event(
            event.evidence_refs
            == (event.from_snapshot_ref, event.to_snapshot_ref),
            "CONTENT_DELTA evidence refs must match from/to refs",
        )
        _require_event(
            event.byte_relation in {"CHANGED", "UNCHANGED"},
            "CONTENT_DELTA byte relation must be CHANGED or UNCHANGED",
        )
        delta = event.content_delta
        assert delta is not None
        _validate_delta_shape(delta)
        if delta.content_equal:
            _require_event(event.event_kind == "NO_CONTENT_CHANGE", "equal delta event kind")
            if event.byte_relation == "UNCHANGED":
                facts = dict(event.facts)
                _require_event(
                    set(facts) == {"revision", "sha256", "bytes"}
                    and facts["revision"] == "unchanged"
                    and isinstance(facts["sha256"], str)
                    and re.fullmatch(r"[0-9a-f]{64}", facts["sha256"]) is not None
                    and type(facts["bytes"]) is int
                    and facts["bytes"] > 0,
                    "unchanged facts do not match the verified receipt shape",
                )
            else:
                _require_event(
                    dict(event.facts)
                    in (
                        {"raw_bytes_differ": True},
                        {"normalization": "leading_trailing_whitespace_trim_only"},
                    ),
                    "changed bytes with equal content require bounded no-change facts",
                )
            return

        _require_event(event.byte_relation == "CHANGED", "content change requires changed bytes")
        _require_event(
            any(
                event.event_kind == expected_kind
                and dict(event.facts) == dict(expected_facts)
                for expected_kind, expected_facts in _expected_atomic_events(delta)
            ),
            "event kind/facts do not describe an atomic change in content_delta",
        )
        return

    _require_event(event.content_delta is None, f"{result_kind} must not carry content_delta")
    if result_kind == "PARSER_FAILURE":
        _require_event(
            event.from_snapshot_ref is None and event.to_snapshot_ref is None,
            "parser failure must not carry from/to snapshot refs",
        )
        _require_event(event.byte_relation == "NOT_APPLICABLE", "parser failure byte relation")
        _require_event(event.parser_version == PARSER_VERSION, "parser version mismatch")
        _require_event(event.diff_version is None, "parser failure must not carry diff version")
        expected = {
            "SCHEMA_DRIFT": {"error_class": "SchemaError", "failure_mode": "fail_closed"},
            "IDENTITY_CONFLICT": {
                "error_class": "DuplicateRowIdentityError",
                "identity_column": "cod_equipamento",
            },
        }
        _require_event(
            event.event_kind in expected
            and dict(event.facts) == expected[event.event_kind],
            "parser failure kind/facts mismatch",
        )
        _require_event(len(event.evidence_refs) == 1, "parser failure requires one payload ref")
        return

    if result_kind == "REFERENCE_RECEIPT":
        _require_event(event.event_kind == "NO_CONTENT_CHANGE", "reference receipt event kind")
        _require_event(event.byte_relation == "UNCHANGED", "reference receipt byte relation")
        _require_event(
            event.parser_version is None and event.diff_version is None,
            "reference receipt must not claim parser/diff execution",
        )
        _require_event(
            event.from_snapshot_ref is not None
            and event.to_snapshot_ref is not None
            and event.evidence_refs
            == (event.from_snapshot_ref, event.to_snapshot_ref),
            "reference receipt evidence refs must match from/to snapshot refs",
        )
        facts = dict(event.facts)
        _require_event(
            set(facts) == {"revision", "sha256", "bytes"}
            and facts["revision"] == "unchanged"
            and isinstance(facts["sha256"], str)
            and re.fullmatch(r"[0-9a-f]{64}", facts["sha256"]) is not None
            and type(facts["bytes"]) is int
            and facts["bytes"] > 0,
            "reference receipt facts mismatch",
        )
        return

    if result_kind == "CONTROLLED_CONTEXT":
        _require_event(
            event.from_snapshot_ref is None and event.to_snapshot_ref is None,
            "controlled context must not carry from/to snapshot refs",
        )
        _require_event(event.byte_relation == "NOT_APPLICABLE", "controlled byte relation")
        _require_event(
            event.parser_version is None and event.diff_version is None,
            "controlled context must not claim parser/diff execution",
        )
        expected = {
            "SOURCE_HEALTH_FAILURE": {
                "observation": "No trustworthy new content observation exists."
            },
            "EVIDENCE_GAP": {"required_evidence_reconstructible": False},
        }
        _require_event(
            event.event_kind in expected
            and dict(event.facts) == expected[event.event_kind],
            "controlled context kind/facts mismatch",
        )
        _require_event(len(event.evidence_refs) == 1, "controlled context requires one ref")
        return

    raise SignalRuntimeError(
        f"invalid CandidateEvent: unsupported deterministic result {result_kind!r}"
    )


def _csv_rows(data: bytes) -> tuple[tuple[str, ...], ...]:
    """Return raw CSV cells for classifying a proven no-content delta.

    The production parser has already accepted the payload before this helper
    runs.  Raw-row equality distinguishes newline/BOM byte changes from actual
    cell padding, while stripped-row equality proves the v0.1 trim-only case.
    """
    text = data.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    rows = csv.reader(io.StringIO(text), delimiter=DELIMITER)
    return tuple(tuple(cell for cell in row) for row in rows if any(cell for cell in row))


def _no_content_facts(from_bytes: bytes, to_bytes: bytes) -> Mapping[str, str | int | bool]:
    if from_bytes == to_bytes:
        return {
            "revision": "unchanged",
            "sha256": hashlib.sha256(to_bytes).hexdigest(),
            "bytes": len(to_bytes),
        }

    from_rows = _csv_rows(from_bytes)
    to_rows = _csv_rows(to_bytes)
    from_trimmed = tuple(tuple(cell.strip() for cell in row) for row in from_rows)
    to_trimmed = tuple(tuple(cell.strip() for cell in row) for row in to_rows)
    if from_rows != to_rows and from_trimmed == to_trimmed:
        return {"normalization": "leading_trailing_whitespace_trim_only"}
    return {"raw_bytes_differ": True}


def _parser_failure_event(
    exc: SchemaError | DuplicateRowIdentityError,
    evidence_ref: str,
) -> CandidateEvent:
    if isinstance(exc, DuplicateRowIdentityError):
        return _event(
            event_kind="IDENTITY_CONFLICT",
            facts={
                "error_class": "DuplicateRowIdentityError",
                "identity_column": "cod_equipamento",
            },
            evidence_refs=(evidence_ref,),
            deterministic_result_kind="PARSER_FAILURE",
            byte_relation="NOT_APPLICABLE",
            parser_version=PARSER_VERSION,
            diff_version=None,
        )
    return _event(
        event_kind="SCHEMA_DRIFT",
        facts={"error_class": "SchemaError", "failure_mode": "fail_closed"},
        evidence_refs=(evidence_ref,),
        deterministic_result_kind="PARSER_FAILURE",
        byte_relation="NOT_APPLICABLE",
        parser_version=PARSER_VERSION,
        diff_version=None,
    )


def _build_from_snapshot_pair(
    observation: SnapshotPairObservation,
) -> tuple[CandidateEvent, ...]:
    try:
        from_rows = parse_capacidade_geracao(observation.from_bytes)
    except (SchemaError, DuplicateRowIdentityError) as exc:
        return (_parser_failure_event(exc, observation.from_evidence_ref),)
    try:
        to_rows = parse_capacidade_geracao(observation.to_bytes)
    except (SchemaError, DuplicateRowIdentityError) as exc:
        return (_parser_failure_event(exc, observation.to_evidence_ref),)

    delta = diff_capacidade_geracao(from_rows, to_rows)
    common = {
        "evidence_refs": (
            observation.from_evidence_ref,
            observation.to_evidence_ref,
        ),
        "deterministic_result_kind": "CONTENT_DELTA",
        "byte_relation": (
            "UNCHANGED" if observation.from_bytes == observation.to_bytes else "CHANGED"
        ),
        "parser_version": PARSER_VERSION,
        "diff_version": DIFF_VERSION,
        "from_snapshot_ref": observation.from_evidence_ref,
        "to_snapshot_ref": observation.to_evidence_ref,
        "content_delta": delta,
    }

    if delta.content_equal:
        return (
            _event(
                event_kind="NO_CONTENT_CHANGE",
                facts=_no_content_facts(observation.from_bytes, observation.to_bytes),
                **common,
            ),
        )

    events: list[CandidateEvent] = []
    for identity in delta.added:
        events.append(
            _event(
                event_kind="UNIT_ADDED_TO_DATASET",
                facts={
                    "identity": identity,
                    "membership": "added_to_later_observation",
                },
                **common,
            )
        )
    for identity in delta.removed:
        events.append(
            _event(
                event_kind="UNIT_REMOVED_FROM_DATASET",
                facts={
                    "identity": identity,
                    "membership": "absent_from_later_observation",
                },
                **common,
            )
        )
    for changed_row in delta.changed:
        for change in changed_row.changes:
            event_kind = _FIELD_EVENT_KIND.get(change.field)
            if event_kind is None:
                raise SignalRuntimeError(
                    f"field {change.field!r} has no released v0.1 Event semantics"
                )
            events.append(
                _event(
                    event_kind=event_kind,
                    facts={
                        "identity": changed_row.identity,
                        "field": change.field,
                        "before": change.before,
                        "after": change.after,
                    },
                    **common,
                )
            )
    return tuple(events)


def build_candidate_events(observation: SignalObservation) -> tuple[CandidateEvent, ...]:
    """Build deterministic, evidence-unattested Events without promotion policy."""
    _validate_source_id(observation.source_id)

    if isinstance(observation, SnapshotPairObservation):
        return _build_from_snapshot_pair(observation)

    if isinstance(observation, PayloadObservation):
        try:
            parse_capacidade_geracao(observation.payload)
        except (SchemaError, DuplicateRowIdentityError) as exc:
            return (_parser_failure_event(exc, observation.evidence_ref),)
        raise SignalRuntimeError("a valid payload requires a second snapshot for a diff")

    if isinstance(observation, ReferenceReceiptObservation):
        if not re.fullmatch(r"[0-9a-f]{64}", observation.sha256):
            raise SignalRuntimeError("reference receipt sha256 must be 64 lowercase hex chars")
        if observation.byte_size <= 0:
            raise SignalRuntimeError("reference receipt byte_size must be positive")
        return (
            _event(
                event_kind="NO_CONTENT_CHANGE",
                facts={
                    "revision": "unchanged",
                    "sha256": observation.sha256,
                    "bytes": observation.byte_size,
                },
                evidence_refs=(
                    observation.from_snapshot_ref,
                    observation.to_snapshot_ref,
                ),
                deterministic_result_kind="REFERENCE_RECEIPT",
                byte_relation="UNCHANGED",
                parser_version=None,
                diff_version=None,
                from_snapshot_ref=observation.from_snapshot_ref,
                to_snapshot_ref=observation.to_snapshot_ref,
            ),
        )

    if isinstance(observation, SourceHealthObservation):
        if observation.source_health_state == "HEALTHY_COMPLETE":
            raise SignalRuntimeError("healthy source state is not a source-health failure")
        if not observation.observation.strip():
            raise SignalRuntimeError("source-health observation must not be blank")
        return (
            _event(
                event_kind="SOURCE_HEALTH_FAILURE",
                # Reduce operational detail to the released, non-causal Event
                # fact.  The source-health state remains promotion context.
                facts={"observation": "No trustworthy new content observation exists."},
                evidence_refs=(observation.evidence_ref,),
                deterministic_result_kind="CONTROLLED_CONTEXT",
                byte_relation="NOT_APPLICABLE",
                parser_version=None,
                diff_version=None,
            ),
        )

    if isinstance(observation, EvidenceGapObservation):
        if observation.required_evidence_reconstructible:
            raise SignalRuntimeError("reconstructible evidence is not an evidence gap")
        return (
            _event(
                event_kind="EVIDENCE_GAP",
                facts={"required_evidence_reconstructible": False},
                evidence_refs=(observation.required_evidence_ref,),
                deterministic_result_kind="CONTROLLED_CONTEXT",
                byte_relation="NOT_APPLICABLE",
                parser_version=None,
                diff_version=None,
            ),
        )

    raise SignalRuntimeError(f"unsupported observation type: {type(observation).__name__}")


def build_candidate_events_from_snapshots(
    session: Session,
    from_snapshot_id: uuid.UUID,
    to_snapshot_id: uuid.UUID,
) -> tuple[CandidateEvent, ...]:
    """Reconstruct exact stored snapshots and mint evidence-attested Events."""
    from_snapshot, from_bytes = reconstruct_snapshot(session, from_snapshot_id)
    to_snapshot, to_bytes = reconstruct_snapshot(session, to_snapshot_id)
    if from_snapshot.source_id != to_snapshot.source_id:
        raise SignalRuntimeError("snapshot pair must belong to the same source")
    _validate_source_id(from_snapshot.source_id)
    events = build_candidate_events(
        SnapshotPairObservation(
            source_id=from_snapshot.source_id,
            from_bytes=from_bytes,
            to_bytes=to_bytes,
            from_evidence_ref=str(from_snapshot.id),
            to_evidence_ref=str(to_snapshot.id),
        )
    )
    for event in events:
        _validate_candidate_event(event)
        object.__setattr__(
            event,
            "_evidence_attestation",
            _ARGOS_MEMORY_EVIDENCE_ATTESTATION,
        )
    return events


def _safe_claim(event: CandidateEvent) -> str:
    facts = event.facts
    identity = str(facts.get("identity", ""))
    before = str(facts.get("before", ""))
    after = str(facts.get("after", ""))

    if event.event_kind == "EFFECTIVE_POWER_CHANGED":
        return (
            f"The effective power recorded for unit {identity} changed from {before} MW "
            f"to {after} MW between two stored observations of the ONS dataset."
        )
    if event.event_kind == "UNIT_ADDED_TO_DATASET":
        return (
            f"Unit {identity} appears in the later stored ONS dataset and was absent "
            "from the earlier stored observation."
        )
    if event.event_kind == "OPERATION_DATE_RECORDED_OR_CHANGED":
        return (
            "The ONS dataset began recording an operation-entry date of "
            f"{after} for unit {identity} between the two stored observations."
        )
    if event.event_kind == "DEACTIVATION_DATE_RECORDED_OR_CHANGED":
        return (
            f"The ONS dataset began recording a deactivation date of {after} "
            f"for unit {identity}."
        )
    if event.event_kind == "OWNER_RECORD_CHANGED":
        return (
            f"The recorded owner for unit {identity} changed from {before} to {after} "
            "in the ONS dataset."
        )
    if event.event_kind == "OPERATOR_RECORD_CHANGED":
        return (
            f"The recorded operator for unit {identity} changed from {before} to {after} "
            "in the ONS dataset."
        )
    if event.event_kind == "FUEL_CLASSIFICATION_CHANGED":
        return (
            f"The fuel classification recorded for unit {identity} changed from {before} "
            f"to {after} in the ONS dataset."
        )
    raise SignalRuntimeError(f"no factual claim template for {event.event_kind}")


def _claim_guard(
    event: CandidateEvent,
    candidate_wording: str | None,
) -> ClaimGuardEvaluation | None:
    if candidate_wording is None:
        return None
    fallback = _safe_claim(event)
    if candidate_wording.strip() == fallback:
        return None
    reason = (
        "UNSUPPORTED_PUBLISHER_REVISION"
        if _PUBLISHER_REVISION_PATTERN.search(candidate_wording)
        else "UNSUPPORTED_CAUSALITY"
    )
    # The allowlist is the deterministic factual template.  Unrecognized
    # alternative wording (including text without a recognized causal marker)
    # also fails closed instead of becoming a claim.
    return ClaimGuardEvaluation(
        candidate_wording=candidate_wording,
        result="FAIL",
        reason_code=reason,
        prohibited_reason_codes=_PROHIBITED_CLAIM_REASONS,
        fallback_claim=fallback,
    )


def _rights_allow_surface(rights: RightsContext) -> bool:
    return (
        rights.surface == "human_signal_display"
        and rights.state == "CLEARED_WITH_ATTRIBUTION"
        and rights.rights_record_ref == RIGHTS_RECORD_REF
        and rights.attribution_required is True
    )


def _unique_refs(*groups: tuple[str, ...]) -> tuple[str, ...]:
    result: list[str] = []
    for group in groups:
        for ref in group:
            if ref not in result:
                result.append(ref)
    return tuple(result)


def _policy_metadata(
    event: CandidateEvent,
    reason_code: str,
    guard: ClaimGuardEvaluation | None,
) -> tuple[tuple[str, ...], tuple[str, ...]]:
    """Return (forbidden claims, caveats) for released v0.1 semantics."""
    kind = event.event_kind
    facts = event.facts
    identity = str(facts.get("identity", ""))
    after = str(facts.get("after", ""))

    if kind == "NO_CONTENT_CHANGE":
        if "revision" in facts:
            return (
                ("ONS changed the dataset", "ONS corrected the dataset", "ONS revised the dataset"),
                ("Reference-only M3 verification; CI must not connect to production.",),
            )
        if "normalization" in facts:
            return (
                ("export padding as a business change",),
                ("No parser normalization is broadened for this case.",),
            )
        return (
            ("a business-content change from row reordering",),
            ("Byte change does not imply content change.",),
        )

    if kind == "EFFECTIVE_POWER_CHANGED":
        if reason_code == "NON_MATERIAL_CHANGE":
            return (
                (
                    "a Signal claim based on this de-minimis change",
                    "a universal numeric materiality threshold",
                ),
                (
                    "The parsed content genuinely differs even though the Gold decision is REJECT.",
                ),
            )
        if reason_code == "RIGHTS_NOT_CLEARED":
            return (
                ("machine/API redistribution without cleared rights",),
                ("Factual truth does not expand distribution rights.",),
            )
        if guard is not None:
            return (
                (guard.candidate_wording, "ONS corrected or revised the dataset"),
                (
                    "AI may summarize deterministic truth but may not create causal or "
                    "publisher-revision evidence.",
                ),
            )
        return (
            (
                "ONS corrected the capacity",
                "the plant expanded",
                "the owner invested in new equipment",
            ),
            ("The claim describes the recorded dataset field, not a causal explanation.",),
        )

    metadata = {
        "UNIT_ADDED_TO_DATASET": (
            ("The unit entered commercial operation", "the plant was built between observations"),
            ("The claim is dataset membership, not physical commissioning.",),
        ),
        "UNIT_REMOVED_FROM_DATASET": (
            (f"{identity} was decommissioned", f"{identity} no longer exists"),
            ("Absence is not zero.",),
        ),
        "OPERATION_DATE_RECORDED_OR_CHANGED": (
            (f"Unit {identity} entered operation on {after}",),
            ("This is dataset-record language, not an assertion of the physical event date.",),
        ),
        "DEACTIVATION_DATE_RECORDED_OR_CHANGED": (
            ("a physical or causal interpretation beyond the recorded dataset field",),
            ("No causal or physical interpretation is established by this record alone.",),
        ),
        "OWNER_RECORD_CHANGED": (
            (
                f"{facts.get('before', '')} sold the asset to {after}",
                f"{after} acquired the plant",
                "a transaction occurred",
            ),
            ("The claim is about the recorded field, not a transaction.",),
        ),
        "OPERATOR_RECORD_CHANGED": (
            ("a contractual transfer occurred", "a control transfer occurred"),
            ("The claim is about the recorded field, not contractual or operational control.",),
        ),
        "FUEL_CLASSIFICATION_CHANGED": (
            ("the plant physically converted fuel",),
            ("A recorded classification change does not establish physical conversion.",),
        ),
        "PRESENTATION_LABEL_CHANGED": (
            ("a presentation-derived label change as a business-state change",),
            ("The parser remains unchanged; this is a Gold judgment about the field.",),
        ),
        "OPERATING_MODALITY_CHANGED": (
            (f"an invented meaning for {after}",),
            (
                "Operating-modality semantics are unresolved; do not infer the meaning "
                f"of {after}.",
            ),
        ),
        "SCHEMA_DRIFT": (
            ("a Signal derived from the malformed payload", "a permissive parser fallback"),
            ("Fail closed and route to source/parser investigation.",),
        ),
        "IDENTITY_CONFLICT": (
            ("silently collapsing duplicate cod_equipamento rows",),
            ("No row collapsing; identity ambiguity remains unresolved.",),
        ),
        "SOURCE_HEALTH_FAILURE": (
            (
                "the asset disappeared",
                "generation equals zero",
                "capacity equals zero",
                "the unit was removed",
            ),
            ("Source-health state is not an asset Signal.",),
        ),
        "EVIDENCE_GAP": (
            ("a Signal without reconstructible required evidence",),
            (
                "The controlled evidence-gap reference is intentionally unavailable; "
                "no real artifact is corrupted.",
            ),
        ),
    }
    try:
        return metadata[kind]
    except KeyError as exc:
        raise SignalRuntimeError(f"no released policy metadata for {kind}") from exc


def evaluate_promotion(
    event: CandidateEvent,
    context: PromotionContext,
) -> PromotionEvaluation:
    """Apply the released source-specific gate without changing Event facts."""
    _validate_candidate_event(event)
    kind = event.event_kind

    if kind == "NO_CONTENT_CHANGE":
        decision: Decision = "REJECT"
        reason = "NO_PARSED_CONTENT_CHANGE"
    elif kind == "SCHEMA_DRIFT":
        decision, reason = "HOLD", "SCHEMA_DRIFT"
    elif kind == "IDENTITY_CONFLICT":
        decision, reason = "HOLD", "IDENTITY_AMBIGUITY"
    elif kind == "SOURCE_HEALTH_FAILURE":
        decision, reason = "HOLD", "SOURCE_HEALTH_UNRESOLVED"
    elif (
        kind == "EVIDENCE_GAP"
        or not context.evidence_reconstructible
        or not event.evidence_refs
        or any(not ref.strip() for ref in event.evidence_refs)
    ):
        decision, reason = "HOLD", "EVIDENCE_NOT_RECONSTRUCTIBLE"
    elif context.source_health_state != "HEALTHY_COMPLETE":
        decision, reason = "HOLD", "SOURCE_HEALTH_UNRESOLVED"
    elif kind == "PRESENTATION_LABEL_CHANGED":
        decision, reason = "REJECT", "PRESENTATION_ONLY_CHANGE"
    elif not context.semantics_understood or kind == "OPERATING_MODALITY_CHANGED":
        decision, reason = "HOLD", "SEMANTICS_UNRESOLVED"
    elif context.materiality_state == "NON_MATERIAL":
        decision, reason = "REJECT", "NON_MATERIAL_CHANGE"
    elif kind not in _PROMOTABLE_EVENT_KINDS:
        decision, reason = "HOLD", "SEMANTICS_UNRESOLVED"
    elif context.materiality_state != "MATERIAL":
        decision, reason = "HOLD", "SEMANTICS_UNRESOLVED"
    elif not _rights_allow_surface(context.rights):
        decision, reason = "HOLD", "RIGHTS_NOT_CLEARED"
    else:
        decision, reason = "PROMOTE", "MATERIAL_RECONSTRUCTIBLE_CHANGE"

    guard = (
        _claim_guard(event, context.candidate_wording)
        if decision == "PROMOTE"
        else None
    )
    forbidden_claims, caveats = _policy_metadata(event, reason, guard)
    return PromotionEvaluation(
        candidate_event=event,
        context=context,
        decision=decision,
        reason_code=reason,
        evidence_refs=_unique_refs(event.evidence_refs, context.additional_evidence_refs),
        required_caveats=caveats,
        forbidden_claims=forbidden_claims,
        claim_guard=guard,
    )


def _mint_signal_claim_pack(
    canonical: PromotionEvaluation,
    factual_claim: str,
) -> SignalClaimPack:
    pack = object.__new__(SignalClaimPack)
    values = {
        "gold_set_version": GOLD_SET_VERSION,
        "source_id": canonical.candidate_event.source_id,
        "candidate_event": canonical.candidate_event,
        "decision": "PROMOTE",
        "reason_code": canonical.reason_code,
        "factual_claim": factual_claim,
        "evidence_refs": canonical.candidate_event.evidence_refs,
        "required_caveats": canonical.required_caveats,
        "forbidden_claims": canonical.forbidden_claims,
        "rights": canonical.context.rights,
        "claim_guard": canonical.claim_guard,
        "_surface_marker": _RUNTIME_CLAIM_PACK_MARKER,
    }
    for name, value in values.items():
        object.__setattr__(pack, name, value)
    return pack


def make_signal_claim_pack(
    evaluation: PromotionEvaluation,
) -> SignalClaimPack | None:
    """Mint a pack only for canonical, evidence-attested PROMOTE results."""
    _validate_candidate_event(evaluation.candidate_event)
    if (
        evaluation.candidate_event._evidence_attestation
        is not _ARGOS_MEMORY_EVIDENCE_ATTESTATION
    ):
        raise SignalRuntimeError(
            "CandidateEvent is not attested by reconstructed Argos Memory evidence"
        )
    canonical = evaluate_promotion(
        evaluation.candidate_event,
        evaluation.context,
    )
    if evaluation != canonical:
        raise SignalRuntimeError(
            "PromotionEvaluation does not match the canonical promotion gate"
        )
    if canonical.decision != "PROMOTE":
        return None
    if canonical.context.additional_evidence_refs:
        raise SignalRuntimeError(
            "additional evidence refs are not accepted for surfaceable claim packs"
        )
    claim = _safe_claim(canonical.candidate_event)
    if canonical.claim_guard is not None:
        claim = canonical.claim_guard.fallback_claim
    return _mint_signal_claim_pack(canonical, claim)


__all__ = [
    "CandidateEvent",
    "ClaimGuardEvaluation",
    "EvidenceGapObservation",
    "GOLD_SET_VERSION",
    "PayloadObservation",
    "PromotionContext",
    "PromotionEvaluation",
    "ReferenceReceiptObservation",
    "RIGHTS_RECORD_REF",
    "RightsContext",
    "SignalClaimPack",
    "SignalRuntimeError",
    "SnapshotPairObservation",
    "SourceHealthObservation",
    "build_candidate_events",
    "build_candidate_events_from_snapshots",
    "evaluate_promotion",
    "make_signal_claim_pack",
]
