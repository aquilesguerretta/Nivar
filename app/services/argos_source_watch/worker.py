"""Check one source, append immutable evidence, and report local check health."""

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from math import isfinite
from random import uniform
from time import sleep
from typing import Callable, Iterator, Literal
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.models.argos_memory import ArgosSnapshot
from app.services.argos_memory import (
    capture_snapshot,
    classify_relation,
    compute_sha256,
    get_current_snapshot,
    reconstruct_snapshot,
)
from app.services.argos_ons_capacidade_geracao_diff import (
    CONTROLLED_TEST_SOURCE_NAMESPACE,
    PARSER_VERSION,
    SOURCE_ID,
    DuplicateRowIdentityError,
    SchemaError,
    parse_capacidade_geracao,
)
from app.services.argos_ons_capacidade_geracao_signal import (
    GOLD_SET_VERSION,
    SignalRuntimeError,
    SnapshotPairObservation,
    build_candidate_events,
)
from app.services.argos_source_watch.http import FetchFailed, FetchResult, Validators, fetch_fixture, fixture_target
from app.services.argos_source_watch.rights import (
    DATASET_URL,
    ArchiveDecision,
    ArchivePolicy,
    ArchiveRequest,
    SourceId,
    deny_archive,
)

FIXTURE_SOURCE_ID = CONTROLLED_TEST_SOURCE_NAMESPACE + ".source_watch"
ADAPTER_VERSION = "ons.capacidade_geracao.source_watch@1"
Outcome = Literal["not_checked", "last_success", "changed", "no_content_change", "failed", "rights_hold"]


def _now() -> datetime:
    return datetime.now(timezone.utc)


@dataclass(frozen=True)
class WatchConfig:
    interval: float = 60
    jitter: float = 5
    stale_after: float = 180
    timeout: float = 5
    max_attempts: int = 3

    def __post_init__(self):
        durations = (self.interval, self.jitter, self.stale_after, self.timeout)
        if not all(isfinite(value) for value in durations) or not (
            0 <= self.jitter <= self.interval
            and 0 < self.interval < self.stale_after
            and 0 < self.timeout <= 30
            and 1 <= self.max_attempts <= 5
        ):
            raise ValueError("require 0 <= jitter <= interval < stale-after, timeout in (0, 30], and 1–5 attempts")


@dataclass
class Metrics:
    checks: int = 0
    successes: int = 0
    failures: int = 0
    consecutive_failures: int = 0
    rights_holds: int = 0
    skipped_busy: int = 0
    http_attempts: int = 0
    retries: int = 0
    captures: int = 0


@dataclass(frozen=True)
class Observation:
    outcome: Outcome
    http_status: int
    evidence: dict
    basis: str
    captured: bool = False


def _evidence(snapshot: ArgosSnapshot, data: bytes) -> dict:
    return {
        "snapshot_id": str(snapshot.id),
        "prior_snapshot_id": str(snapshot.prior_snapshot_id) if snapshot.prior_snapshot_id else None,
        "sha256": compute_sha256(data),
        "byte_size": len(data),
        "retrieved_at": snapshot.retrieved_at.astimezone(timezone.utc).isoformat(),
        "published_at": None,
        "reference_time": None,
        "adapter_version": snapshot.adapter_version,
        "parser_version": PARSER_VERSION,
        "snapshot_byte_relation": snapshot.revision_relation,
    }


def _delta(head: ArgosSnapshot, prior: bytes, snapshot: ArgosSnapshot, current: bytes) -> dict:
    # The canonical source ID selects the ONS rules. The actual evidence IDs
    # point solely to the synthetic chain, so these events remain unattested.
    events = build_candidate_events(
        SnapshotPairObservation(SOURCE_ID, prior, current, str(head.id), str(snapshot.id))
    )
    event = events[0]
    delta = event.content_delta
    if delta is None:
        raise SchemaError("the ONS runtime could not interpret the snapshot pair")
    return {
        "from_snapshot_id": str(head.id),
        "from_sha256": compute_sha256(prior),
        "parser_version": event.parser_version,
        "diff_version": event.diff_version,
        "content_equal": delta.content_equal,
        "counts": {"added": len(delta.added), "removed": len(delta.removed), "changed": len(delta.changed)},
        "candidate_event_kinds": sorted({item.event_kind for item in events}),
    }


class SourceWatch:
    def __init__(
        self,
        url: str,
        sessions: Callable[[], Session],
        config: WatchConfig,
        *,
        policy: ArchivePolicy = deny_archive,
        now: Callable[[], datetime] = _now,
        wait: Callable[[float], None] = sleep,
    ):
        fixture_target(url)
        self.url = url
        self.sessions = sessions
        self.config = config
        self.policy = policy
        self.now = now
        self.wait = wait
        self.metrics = Metrics()
        self.last_outcome: Outcome = "not_checked"
        self.last_checked_at: datetime | None = None
        self.last_success_at: datetime | None = None
        self._validators: tuple[UUID, Validators] | None = None

    def report(self, **details) -> dict:
        observed_at = self.now()
        age = (observed_at - self.last_success_at).total_seconds() if self.last_success_at else None
        status = self.last_outcome
        health = "not_checked"
        if age is not None and age >= self.config.stale_after:
            health = "stale"
            if status != "rights_hold":
                status = "stale"
        elif status == "failed":
            health = "broken"
        elif age is not None:
            health = "healthy"
        return {
            "mode": "non_prod_synthetic",
            "source_id": SOURCE_ID,
            "evidence_source_id": FIXTURE_SOURCE_ID,
            "observed_at": observed_at.isoformat(),
            "status": status,
            "last_outcome": self.last_outcome,
            "health": health,
            "last_checked_at": self.last_checked_at.isoformat() if self.last_checked_at else None,
            "last_success_at": self.last_success_at.isoformat() if self.last_success_at else None,
            "seconds_since_success": age,
            "metrics": asdict(self.metrics),
            "publisher_revision_confirmed": False,
            "signal": {"gold_set": GOLD_SET_VERSION, "evaluation": "not_run", "claim_published": False},
            **details,
        }

    def _fetch(self, validators: Validators) -> FetchResult:
        try:
            result = fetch_fixture(
                self.url, validators, timeout=self.config.timeout,
                max_attempts=self.config.max_attempts, wait=self.wait,
            )
        except FetchFailed as exc:
            self.metrics.http_attempts += exc.attempts
            self.metrics.retries += exc.attempts - 1
            raise
        self.metrics.http_attempts += result.attempts
        self.metrics.retries += result.attempts - 1
        return result

    def _observe(self, db: Session, rights: ArchiveDecision) -> tuple[Observation, UUID, Validators]:
        head = get_current_snapshot(db, FIXTURE_SOURCE_ID)
        validators = Validators()
        if head is not None and (head.acquisition_metadata or {}).get("url") == self.url:
            metadata = head.acquisition_metadata
            if self.last_success_at is None:
                self.last_success_at = head.retrieved_at.astimezone(timezone.utc)
            validators = Validators(metadata.get("hosting_etag"), metadata.get("hosting_last_modified"))
            if self._validators is not None and self._validators[0] == head.id:
                validators = self._validators[1]
        fetched = self._fetch(validators)
        data = fetched.body
        prior = b""
        if head is not None:
            _, prior = reconstruct_snapshot(db, head.id)
            same_hash = data is not None and classify_relation(
                compute_sha256(prior), compute_sha256(data),
            ) == "unchanged"
            if fetched.status == 304 or same_hash:
                basis = "http_not_modified" if fetched.status == 304 else "identical_sha256"
                return (
                    Observation("no_content_change", fetched.status, _evidence(head, prior), basis),
                    head.id,
                    fetched.validators,
                )

        if not data or not parse_capacidade_geracao(data):
            raise SchemaError("no capacity rows")
        snapshot = capture_snapshot(
            db,
            source_id=FIXTURE_SOURCE_ID,
            data=data,
            content_type="text/csv",
            adapter_version=ADAPTER_VERSION,
            retrieved_at=self.now(),
            source_timezone="America/Sao_Paulo",
            rights_record_ref=rights.rights_record_ref,
            rights_summary_state="cleared",
            acquisition_metadata={
                "mode": "non_prod_synthetic",
                "url": self.url,
                "http_status": fetched.status,
                "response_content_type": fetched.content_type,
                "hosting_etag": fetched.validators.etag,
                "hosting_last_modified": fetched.validators.last_modified,
                "policy_version": rights.policy_version,
                "license_notice_version": rights.license_notice_version,
                "attribution": rights.attribution,
                "dataset_url": DATASET_URL,
                "retention": rights.retention,
            },
        )
        evidence = _evidence(snapshot, data)
        if head is None:
            observation = Observation("last_success", fetched.status, evidence, "baseline", captured=True)
        else:
            delta = _delta(head, prior, snapshot, data)
            evidence["delta"] = delta
            outcome = "no_content_change" if delta["content_equal"] else "changed"
            observation = Observation(outcome, fetched.status, evidence, "deterministic_diff", captured=True)
        return observation, snapshot.id, fetched.validators

    def check(self) -> dict:
        try:
            rights = self.policy(ArchiveRequest(SourceId(SOURCE_ID), self.url))
            allowed = rights.allows_capture()
        except Exception:
            allowed = False
        if not allowed:
            self.metrics.rights_holds += 1
            self.last_outcome = "rights_hold"
            return self.report(reason="local_archive_not_cleared")

        locked = False
        try:
            with self.sessions() as db, db.begin():
                # Match Argos Memory's source lock. Own the check before reading
                # validators so concurrent workers cannot capture the same update.
                locked = db.scalar(
                    text("SELECT pg_try_advisory_xact_lock(hashtext(:source_id)::bigint)"),
                    {"source_id": FIXTURE_SOURCE_ID},
                )
                if not locked:
                    self.metrics.skipped_busy += 1
                    return self.report(skipped="source_check_in_progress")
                self.metrics.checks += 1
                self.last_checked_at = self.now()
                observation, snapshot_id, validators = self._observe(db, rights)
        except FetchFailed as exc:
            return self._fail(str(exc), http_status=exc.status)
        except (SchemaError, DuplicateRowIdentityError, SignalRuntimeError):
            return self._fail("ons_schema_or_diff_rejected")
        except SQLAlchemyError:
            if not locked:
                self.metrics.checks += 1
                self.last_checked_at = self.now()
            return self._fail("argos_memory_unavailable")

        self._validators = (snapshot_id, validators)
        self.last_success_at = self.now()
        self.last_outcome = observation.outcome
        self.metrics.successes += 1
        self.metrics.consecutive_failures = 0
        self.metrics.captures += int(observation.captured)
        return self.report(
            http_status=observation.http_status,
            captured=observation.captured,
            basis=observation.basis,
            evidence=observation.evidence,
            rights={
                "channel": "local_archive",
                "policy_version": rights.policy_version,
                "rights_record_ref": rights.rights_record_ref,
                "license_notice_version": rights.license_notice_version,
                "attribution": rights.attribution,
                "dataset_url": DATASET_URL,
                "retention": rights.retention,
            },
        )

    def _fail(self, reason: str, **details) -> dict:
        self.metrics.failures += 1
        self.metrics.consecutive_failures += 1
        self.last_outcome = "failed"
        return self.report(reason=reason, **details)

    def run(self, checks: int | None = None) -> Iterator[dict]:
        remaining = checks
        while remaining is None or remaining > 0:
            yield self.check()
            if remaining is not None:
                remaining -= 1
                if remaining == 0:
                    break
            self.wait(self.config.interval + uniform(0, self.config.jitter))
