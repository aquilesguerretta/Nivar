"""Typed Source Registry metadata and fail-closed channel decisions."""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from typing import Annotated, Literal, NewType
from urllib.parse import urlsplit

from pydantic import (
    AfterValidator,
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    StrictBool,
    StringConstraints,
    model_validator,
)

SourceId = NewType("SourceId", str)
_SOURCE_ID = re.compile(r"[a-z0-9]+(?:[._-][a-z0-9]+)*\.[a-z0-9]+(?:[._-][a-z0-9]+)*")


def valid_source_id(value: str) -> bool:
    return isinstance(value, str) and len(value) <= 160 and _SOURCE_ID.fullmatch(value) is not None


def _source_id(value: SourceId) -> SourceId:
    if not valid_source_id(value):
        raise ValueError("expected a namespaced source ID")
    return value


def _metadata_url(value: str) -> str:
    # Registry locators identify reviewed resources. Credentials, query parameters
    # and temporary signed URLs belong outside the registry.
    try:
        parts = urlsplit(value)
        if (
            parts.scheme == "https"
            and parts.hostname
            and parts.netloc == parts.hostname
            and not any(char.isspace() or ord(char) < 32 for char in value)
            and not any(char in value for char in "?#\\")
        ):
            return value
    except ValueError:
        pass
    raise ValueError("expected a credential-free HTTPS resource locator")


MetadataURL = Annotated[str, AfterValidator(_metadata_url)]
Text = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class UsageChannel(StrEnum):
    LOCAL_ARCHIVE = "local_archive"
    CLIENT_DISPLAY = "client_display"
    EXTERNAL_API = "external_api"


class ChannelState(StrEnum):
    ALLOWED = "allowed"
    DENIED = "denied"
    HOLD = "hold"
    UNKNOWN = "unknown"


class DecisionReason(StrEnum):
    ALLOWED = "allowed"
    INVALID_CHANNEL = "invalid_channel"
    UNKNOWN_SOURCE = "unknown_source"
    INVALID_RECORD = "invalid_record"
    SOURCE_INACTIVE = "source_inactive"
    SOURCE_RESTRICTED = "source_restricted"
    SOURCE_DELETED = "source_deleted"
    RIGHTS_REVOKED = "rights_revoked"
    RIGHTS_EXPIRED = "rights_expired"
    POLICY_DRIFT = "policy_drift"
    CHANNEL_NOT_ALLOWED = "channel_not_allowed"
    RIGHTS_UNVERIFIED = "rights_unverified"


class HealthStatus(StrEnum):
    NOT_CHECKED = "not_checked"
    HEALTHY = "healthy"
    STALE = "stale"
    BROKEN = "broken"
    POLICY_DRIFT = "policy_drift"


class _RegistryMetadata(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True, hide_input_in_errors=True, revalidate_instances="always")


class ChannelRight(_RegistryMetadata):
    channel: UsageChannel
    state: ChannelState
    expires_at: AwareDatetime | None = None


class SourceRights(_RegistryMetadata):
    rights_record_ref: Text | None = None
    rights_summary_state: Literal["cleared", "restricted", "unclear", "unknown"] = "unknown"
    license_notice_url: MetadataURL | None = None
    license_notice_version: Text | None = None
    license_version: Text = "unknown"
    attribution_requirement_ref: Text | None = None
    attribution: Text | None = None
    revoked: StrictBool = False
    channels: tuple[ChannelRight, ...] = ()

    @model_validator(mode="after")
    def unique_channels(self) -> SourceRights:
        if len({item.channel for item in self.channels}) != len(self.channels):
            raise ValueError("duplicate usage channel")
        return self


class Source(_RegistryMetadata):
    source_id: Annotated[SourceId, AfterValidator(_source_id)]
    source_name: Text
    publisher_name: Text
    publisher_entity_ref: Text | None = None
    authority_scope: Text
    source_class: Literal[
        "current_state_snapshot", "revisionable_timeseries", "published_market_timeseries", "document_feed", "unknown"
    ]
    canonical_landing_url: MetadataURL
    resource_locator: MetadataURL
    access_method: Literal["http_file", "api", "ckan_datastore", "web_document", "unknown"]
    retrieval_method: Text
    primary_format: Text
    schema_or_dictionary_ref: Text | None = None
    expected_cadence: Text = "unknown"
    source_timezone: Text = "unknown"
    reference_time_semantics: Text = "unknown"
    publication_time_semantics: Text = "unknown"
    revision_mode: Literal["overwrite_current", "revisable_history", "append_or_replace", "unknown"] = "unknown"
    upstream_history_availability: Literal["full", "partial", "none", "unknown"] = "unknown"
    snapshot_priority: Literal["required", "recommended", "not_required", "unknown"] = "unknown"
    status: Literal["candidate", "active", "paused", "retired", "blocked_rights", "restricted", "deleted"] = "candidate"
    known_limitations: tuple[Text, ...] = ()
    owner_family: Literal["ARGOS"] = "ARGOS"
    stale_after_seconds: Annotated[int, Field(strict=True, gt=0)] | None = None
    rights: SourceRights = Field(default_factory=SourceRights)


@dataclass(frozen=True, slots=True)
class SourceHealth:
    status: HealthStatus
    last_checked_at: datetime | None = None
    last_success_at: datetime | None = None


@dataclass(frozen=True, slots=True)
class SourceProjection:
    source_id: SourceId
    policy_version: int
    definition: Source
    health: SourceHealth


@dataclass(frozen=True, slots=True)
class SourceDecision:
    source_id: SourceId | None
    channel: UsageChannel | None
    channel_state: ChannelState = ChannelState.UNKNOWN
    reason: DecisionReason = DecisionReason.UNKNOWN_SOURCE
    source: SourceProjection | None = None

    @property
    def allowed(self) -> bool:
        return self.source is not None


def policy_has_drifted(
    source: Source,
    observed_resource_locator: str | None,
    observed_license_notice_version: str | None,
) -> bool:
    return (
        observed_resource_locator is not None and observed_resource_locator != source.resource_locator
    ) or (
        observed_license_notice_version is not None
        and observed_license_notice_version != source.rights.license_notice_version
    )


def decide_source(projection: SourceProjection, channel: UsageChannel, *, now: datetime) -> SourceDecision:
    source = projection.definition
    rights = source.rights
    grant = next((item for item in rights.channels if item.channel == channel), None)
    if source.status == "deleted":
        reason = DecisionReason.SOURCE_DELETED
    elif source.status in ("restricted", "blocked_rights"):
        reason = DecisionReason.SOURCE_RESTRICTED
    elif source.status != "active":
        reason = DecisionReason.SOURCE_INACTIVE
    elif rights.revoked:
        reason = DecisionReason.RIGHTS_REVOKED
    elif projection.health.status == HealthStatus.POLICY_DRIFT:
        reason = DecisionReason.POLICY_DRIFT
    elif grant is None or grant.state != ChannelState.ALLOWED:
        state = grant.state if grant is not None else ChannelState.UNKNOWN
        return SourceDecision(source.source_id, channel, state, DecisionReason.CHANNEL_NOT_ALLOWED)
    elif grant.expires_at is not None and now >= grant.expires_at:
        reason = DecisionReason.RIGHTS_EXPIRED
    elif rights.rights_summary_state == "unknown" or not all((
        rights.rights_record_ref,
        rights.license_notice_url,
        rights.license_notice_version,
        rights.attribution_requirement_ref,
        rights.attribution,
    )):
        reason = DecisionReason.RIGHTS_UNVERIFIED
    else:
        return SourceDecision(source.source_id, channel, grant.state, DecisionReason.ALLOWED, projection)
    return SourceDecision(source.source_id, channel, ChannelState.DENIED, reason)
