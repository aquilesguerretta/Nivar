"""Internal archive gate. A future NIV-83 adapter can implement this port."""

from dataclasses import dataclass
from typing import Literal, NewType, Protocol

from app.services.argos_ons_capacidade_geracao_diff import SOURCE_ID
from app.services.argos_ons_capacidade_geracao_signal import RIGHTS_RECORD_REF

DATASET_URL = "https://dados.ons.org.br/dataset/capacidade-geracao"
ATTRIBUTION = "Operador Nacional do Sistema Elétrico (ONS) — Capacidade Instalada de Geração"
SourceId = NewType("SourceId", str)
UsageChannel = Literal["local_archive", "client_display", "external_api"]


@dataclass(frozen=True)
class ArchiveRequest:
    source_id: SourceId
    resource_url: str
    channel: UsageChannel = "local_archive"
    synthetic: bool = True


@dataclass(frozen=True)
class ArchiveDecision:
    allowed: bool = False
    channel_state: Literal["allowed", "denied", "hold", "unknown"] = "unknown"
    policy_version: int | None = None
    rights_record_ref: str | None = None
    license_notice_version: str | None = None
    attribution: str | None = None
    retention: Literal["disposable_only"] | None = None

    def allows_capture(self) -> bool:
        return (
            self.allowed is True
            and self.channel_state == "allowed"
            and self.policy_version is not None
            and self.policy_version >= 1
            and self.rights_record_ref == RIGHTS_RECORD_REF
            and bool(self.license_notice_version)
            and self.attribution == ATTRIBUTION
            and self.retention == "disposable_only"
        )


class ArchivePolicy(Protocol):
    def __call__(self, request: ArchiveRequest) -> ArchiveDecision: ...


def deny_archive(request: ArchiveRequest) -> ArchiveDecision:
    return ArchiveDecision()


def synthetic_archive_policy(resource_url: str) -> ArchivePolicy:
    """One explicitly selected fixture URL, with no publisher acquisition grant."""
    expected = ArchiveRequest(source_id=SourceId(SOURCE_ID), resource_url=resource_url)

    def decide(request: ArchiveRequest) -> ArchiveDecision:
        if request != expected:
            return ArchiveDecision()
        return ArchiveDecision(
            allowed=True,
            channel_state="allowed",
            policy_version=1,
            rights_record_ref=RIGHTS_RECORD_REF,
            license_notice_version="ons-portal-notice@2026-09-16",
            attribution=ATTRIBUTION,
            retention="disposable_only",
        )

    return decide
