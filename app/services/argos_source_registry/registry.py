"""Internal Source Registry reads and writes within a caller-owned transaction."""

from __future__ import annotations

from datetime import UTC, datetime

from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.db.models.argos_source_registry import ArgosSourceRevision

from .contract import (
    ChannelState,
    DecisionReason,
    HealthStatus,
    Source,
    SourceDecision,
    SourceHealth,
    SourceId,
    SourceProjection,
    UsageChannel,
    decide_source,
    policy_has_drifted,
    valid_source_id,
)

_TOMBSTONE = {"status": "deleted"}


class SourceRegistryConflict(ValueError):
    """The requested write conflicts with the source's current policy."""


def _utc(value: datetime) -> datetime:
    if value.utcoffset() is None:
        raise ValueError("source timestamps must include a timezone")
    return value.astimezone(UTC)


def _latest(session: Session, source_id: SourceId) -> ArgosSourceRevision | None:
    return session.scalar(
        select(ArgosSourceRevision)
        .where(ArgosSourceRevision.source_id == source_id)
        .order_by(ArgosSourceRevision.policy_version.desc())
        .limit(1)
        .execution_options(populate_existing=True)
    )


def _current_for_write(
    session: Session, source_id: SourceId, expected_policy_version: int
) -> ArgosSourceRevision:
    # Version one is the stable lock for all writes to this identity, even
    # while a different transaction is installing a new policy version.
    lock = session.scalar(
        select(ArgosSourceRevision.source_id)
        .where(ArgosSourceRevision.source_id == source_id, ArgosSourceRevision.policy_version == 1)
        .with_for_update()
    )
    if lock is None:
        raise SourceRegistryConflict("source is not registered")
    current = _latest(session, source_id)
    assert current is not None  # The locked first revision cannot be deleted.
    if current.policy_version != expected_policy_version:
        raise SourceRegistryConflict("source policy has changed")
    if current.definition == _TOMBSTONE:
        raise SourceRegistryConflict("source is deleted")
    return current


def register_source(session: Session, source: Source) -> int:
    """Insert the first reviewed definition. Duplicate IDs cannot replace it."""
    source = Source.model_validate(source)
    if source.status == "deleted":
        raise SourceRegistryConflict("cannot register a deleted source")
    version = session.scalar(
        insert(ArgosSourceRevision)
        .values(source_id=source.source_id, policy_version=1, definition=source.model_dump(mode="json"))
        .on_conflict_do_nothing(index_elements=["source_id", "policy_version"])
        .returning(ArgosSourceRevision.policy_version)
    )
    if version is None:
        raise SourceRegistryConflict("source ID is already registered")
    return version


def revise_source(session: Session, source: Source, *, expected_policy_version: int) -> int:
    """Append an explicit policy review or terminal tombstone for this source."""
    source = Source.model_validate(source)
    current = _current_for_write(session, source.source_id, expected_policy_version)
    version = current.policy_version + 1
    definition = _TOMBSTONE if source.status == "deleted" else source.model_dump(mode="json")
    session.add(ArgosSourceRevision(source_id=source.source_id, policy_version=version, definition=definition))
    session.flush()
    return version


def record_source_check(
    session: Session,
    source_id: SourceId,
    *,
    policy_version: int,
    checked_at: datetime,
    succeeded: bool,
    resource_locator: str,
    license_notice_version: str | None = None,
) -> bool:
    """Record a check against the policy it used. Return False for obsolete check times."""
    checked_at = _utc(checked_at)
    if not valid_source_id(source_id) or type(succeeded) is not bool or not resource_locator:
        raise ValueError("invalid source check")
    if checked_at > datetime.now(UTC):
        raise ValueError("source check cannot be in the future")
    current = _current_for_write(session, source_id, policy_version)
    source = Source.model_validate(current.definition)
    drifted = policy_has_drifted(source, resource_locator, license_notice_version)
    if current.check_status == HealthStatus.POLICY_DRIFT:
        return False
    if current.last_checked_at is not None and checked_at <= current.last_checked_at:
        if not drifted:
            return False
        # A late detection is still material for the current reviewed policy.
        checked_at = current.last_checked_at

    current.last_checked_at = checked_at
    if drifted:
        current.check_status = HealthStatus.POLICY_DRIFT
    elif succeeded:
        current.check_status = HealthStatus.HEALTHY
        current.last_success_at = checked_at
    else:
        current.check_status = HealthStatus.BROKEN
    session.flush()
    return True


def read_source(
    session: Session,
    source_id: SourceId | str,
    channel: UsageChannel | str,
    *,
    now: datetime,
    observed_resource_locator: str | None = None,
    observed_license_notice_version: str | None = None,
) -> SourceDecision:
    """Project current policy metadata only for an explicitly allowed use."""
    key = SourceId(source_id) if valid_source_id(source_id) else None
    try:
        usage = UsageChannel(channel)
    except (ValueError, TypeError):
        return SourceDecision(key, None, reason=DecisionReason.INVALID_CHANNEL)
    if key is None:
        return SourceDecision(None, usage)
    current = _latest(session, key)
    if current is None:
        return SourceDecision(key, usage)
    if current.definition == _TOMBSTONE:
        return SourceDecision(key, usage, ChannelState.DENIED, DecisionReason.SOURCE_DELETED)

    try:
        source = Source.model_validate(current.definition)
        status = HealthStatus(current.check_status)
    except (ValidationError, ValueError):
        return SourceDecision(key, usage, reason=DecisionReason.INVALID_RECORD)
    if source.source_id != key:
        return SourceDecision(key, usage, reason=DecisionReason.INVALID_RECORD)

    now = _utc(now)
    checked = _utc(current.last_checked_at) if current.last_checked_at is not None else None
    success = _utc(current.last_success_at) if current.last_success_at is not None else None
    if policy_has_drifted(source, observed_resource_locator, observed_license_notice_version):
        status = HealthStatus.POLICY_DRIFT
    elif status == HealthStatus.HEALTHY and success is not None and source.stale_after_seconds is not None:
        if (now - success).total_seconds() >= source.stale_after_seconds:
            status = HealthStatus.STALE

    health = SourceHealth(status, checked, success)
    return decide_source(SourceProjection(key, current.policy_version, source, health), usage, now=now)
