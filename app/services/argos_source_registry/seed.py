"""The reviewed ONS internal-archive example. Contains only source metadata."""

from .contract import ChannelRight, ChannelState, Source, SourceId, SourceRights, UsageChannel

_LANDING_URL = "https://dados.ons.org.br/dataset/capacidade-geracao"
_RIGHTS_REF = "NIV7-EXT-ONS-OPEN-DATA-2026-09-16"

ONS_CAPACITY_SOURCE = Source(
    source_id=SourceId("ons.capacidade_geracao"),
    source_name="Capacidade Instalada de Geração",
    publisher_name="Operador Nacional do Sistema Elétrico (ONS)",
    authority_scope="Capacidade nominal atual das unidades despachadas pelo ONS e cobertas pelo conjunto.",
    source_class="current_state_snapshot",
    canonical_landing_url=_LANDING_URL,
    resource_locator=(
        "https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/"
        "capacidade-geracao/CAPACIDADE_GERACAO.csv"
    ),
    access_method="http_file",
    retrieval_method="HTTPS GET do recurso CSV por meio do adaptador ONS existente.",
    primary_format="text/csv",
    expected_cadence="Diária. Horários indicados pelo catálogo na revisão NIV-11: 12h e 19h locais.",
    source_timezone="America/Sao_Paulo",
    reference_time_semantics="Estado corrente; o recurso não declara período histórico para cada captura.",
    publication_time_semantics="not_provided",
    revision_mode="overwrite_current",
    upstream_history_availability="none",
    snapshot_priority="required",
    status="active",
    known_limitations=("Last-Modified e ETag do host são metadados de aquisição.",),
    stale_after_seconds=48 * 60 * 60,
    rights=SourceRights(
        rights_record_ref=_RIGHTS_REF,
        rights_summary_state="restricted",
        license_notice_url=_LANDING_URL,
        license_notice_version="ons-dados-abertos-notice@2026-09-16",
        license_version="unknown",
        attribution_requirement_ref=f"{_RIGHTS_REF}#attribution-baseline",
        attribution="Creditar ONS, indicar a fonte e a versão consultada, identificar alterações e evitar endosso.",
        channels=(
            ChannelRight(channel=UsageChannel.LOCAL_ARCHIVE, state=ChannelState.ALLOWED),
            ChannelRight(channel=UsageChannel.CLIENT_DISPLAY, state=ChannelState.HOLD),
            ChannelRight(channel=UsageChannel.EXTERNAL_API, state=ChannelState.HOLD),
        ),
    ),
)
