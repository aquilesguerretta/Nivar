from datetime import UTC, datetime, timedelta

import pytest
from pydantic import ValidationError

from app.services.argos_source_registry import (
    ChannelRight,
    ChannelState,
    DecisionReason,
    HealthStatus,
    Source,
    SourceHealth,
    SourceProjection,
    SourceRights,
    UsageChannel,
)
from app.services.argos_source_registry.contract import decide_source
from app.services.argos_source_registry.seed import ONS_CAPACITY_SOURCE

NOW = datetime(2026, 9, 16, tzinfo=UTC)


def change_source(**fields) -> Source:
    return Source.model_validate({**ONS_CAPACITY_SOURCE.model_dump(), **fields})


def decision(source: Source, channel: UsageChannel = UsageChannel.LOCAL_ARCHIVE, *, now=NOW):
    health = SourceHealth(HealthStatus.BROKEN, NOW)
    return decide_source(SourceProjection(source.source_id, 1, source, health), channel, now=now)


def test_seed_grants_internal_archive_only_and_preserves_provenance():
    allowed = decision(ONS_CAPACITY_SOURCE)
    assert allowed.allowed and allowed.source is not None
    rights = allowed.source.definition.rights
    assert rights.rights_record_ref == "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"
    assert rights.rights_summary_state == "restricted"
    assert rights.license_version == "unknown"
    assert rights.license_notice_version == "ons-dados-abertos-notice@2026-09-16"
    assert rights.attribution and "ONS" in rights.attribution
    assert allowed.source.health.status == HealthStatus.BROKEN
    for channel in (UsageChannel.CLIENT_DISPLAY, UsageChannel.EXTERNAL_API):
        denied = decision(ONS_CAPACITY_SOURCE, channel)
        assert not denied.allowed and denied.source is None
        assert denied.channel_state == ChannelState.HOLD


@pytest.mark.parametrize("summary", ["unknown", "unclear", "restricted", "cleared"])
def test_aggregate_rights_cannot_grant_a_missing_channel(summary):
    source = change_source(rights=SourceRights(rights_summary_state=summary))
    denied = decision(source)
    assert denied.channel_state == ChannelState.UNKNOWN
    assert not denied.allowed


@pytest.mark.parametrize(
    ("key", "value"),
    [
        ("rights_record_ref", None),
        ("license_notice_url", None),
        ("license_notice_version", None),
        ("attribution_requirement_ref", None),
        ("attribution", None),
        ("rights_summary_state", "unknown"),
    ],
)
def test_allow_flag_requires_a_review_with_attribution(key, value):
    source = change_source(rights={**ONS_CAPACITY_SOURCE.rights.model_dump(), key: value})
    denied = decision(source)
    assert denied.reason == DecisionReason.RIGHTS_UNVERIFIED
    assert not denied.allowed


def test_channel_decisions_validate_flags_and_reject_duplicates():
    with pytest.raises(ValidationError):
        SourceRights(channels=(ChannelRight(channel="unrecognized", state="allowed"),))
    with pytest.raises(ValidationError):
        SourceRights(channels=(ChannelRight(channel="local_archive", state=True),))
    with pytest.raises(ValidationError):
        SourceRights(revoked="false")
    right = ONS_CAPACITY_SOURCE.rights.channels[0]
    with pytest.raises(ValidationError, match="duplicate usage channel"):
        SourceRights(channels=(right, right))


def test_expiry_denies_only_the_affected_channel_at_its_boundary():
    rights = ONS_CAPACITY_SOURCE.rights
    expiring = ChannelRight(channel=UsageChannel.CLIENT_DISPLAY, state=ChannelState.ALLOWED, expires_at=NOW)
    source = change_source(rights=rights.model_copy(update={"channels": (rights.channels[0], expiring)}))
    assert decision(source, UsageChannel.CLIENT_DISPLAY, now=NOW - timedelta(microseconds=1)).allowed
    assert decision(source, UsageChannel.CLIENT_DISPLAY).reason == DecisionReason.RIGHTS_EXPIRED
    assert decision(source).allowed


@pytest.mark.parametrize("source_id", ["ONS.capacidade_geracao", "ons", "ons..capacidade", "ons.capacidade geraçao"])
def test_invalid_source_id_is_rejected(source_id):
    with pytest.raises(ValidationError, match="expected a namespaced source ID"):
        change_source(source_id=source_id)


@pytest.mark.parametrize("url", [
    "https://user:synthetic-secret@example.test/series",
    "https://example.test/series?api_key=synthetic-secret",
    "https://example.test/series#synthetic-secret",
])
def test_credential_bearing_locators_are_rejected_without_echoing_the_value(url):
    with pytest.raises(ValidationError) as error:
        change_source(resource_locator=url)
    assert "synthetic-secret" not in str(error.value)
