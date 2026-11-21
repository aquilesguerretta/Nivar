# NIV-87 · Piloto EIA API v2

O piloto cobre o **preço médio mensal da eletricidade vendida a consumidores residenciais no Colorado**. A documentação da própria EIA usa esses filtros e demonstra a unidade, o formato mensal, os limites por data e os valores JSON em string. A EIA divulga valores mensais preliminares e finais, o que permite exercitar revisões sem inventar frequência de revisão ou data de publicação por linha. [Documentação da API v2](https://www.eia.gov/opendata/documentation.php) · [Série de preços e status dos dados](https://www.eia.gov/tools/faqs/faq.php?id=507) · [Formulário EIA-861M](https://www.eia.gov/electricity/data/eia861m/)

| Campo | Valor |
| --- | --- |
| `source_id` candidato (NIV-90) | `eia.electricity.retail_sales.co.res.price.monthly` |
| `canonical_route` | `https://api.eia.gov/v2/electricity/retail-sales/data` |
| Publisher | U.S. Energy Information Administration (EIA) |
| Seleção | `data[]=price`, `stateid=CO`, `sectorid=RES` |
| Frequência e referência | `monthly`, `YYYY-MM`, 1 a 13 meses inclusivos, a partir de 2001 |
| Unidade da fonte | `cents per kilowatthour` |

## Coleta e revisão

- `EiaConnector.collect(Window(...))` usa uma porta de transporte HTTP injetada e um único intervalo. Sem transporte, retorna `disabled` com zero tentativas. O transporte de fixture recebe a rota sem credencial, os parâmetros e um timeout de cinco segundos.
- O conector limita as tentativas a três por chamada. Cada instância espaça os inícios das requisições em pelo menos um segundo. Falhas transitórias de I/O e HTTP 408/429/500/502/503/504 usam backoff de 1 s e 2 s mais jitter de até 0,25 s entre tentativas e respeitam `Retry-After` em segundos ou data HTTP. Se a espera exigida superar 30 s, retorna a falha e preserva o prazo para chamadas futuras na mesma instância. A cadência do piloto é conservadora em relação aos limites orientativos da EIA. [FAQ da API](https://www.eia.gov/opendata/faqs.php)
- Uma página válida deve confirmar frequência, formato, unidade, facetas, meses únicos e quantidade retornada. Páginas truncadas, avisos e campos inválidos deixam a janela inteira `unverified`, preservando o último sucesso. O `404` é `not_found`. Uma resposta válida sem observações é `no_data`. Mês omitido e preço explicitamente nulo aparecem como `missing_row` e `missing_value`. Zero explícito mantém `observed`. Se um mês observado anteriormente perde cobertura, a saída marca `coverage_lost` e preserva a versão anterior no histórico.
- `published_value` preserva o texto de origem da versão e `value` o representa como `Decimal` na mesma unidade. `published_at` fica nulo, pois a data de publicação por linha está ausente. `collected_at` registra a hora UTC da coleta que criou aquela versão no replay. A saída mantém a versão técnica da resposta em `api_version` quando disponível. O corpo e o eco da requisição ficam fora da projeção.
- A identidade de versão usa SHA-256 do SourceId, mês, unidade, valor decimal canônico e versão anterior. Repetição ou alteração apenas de zeros decimais preserva a versão. Uma correção acrescenta outra versão com `supersedes`. Em A → B → A, a volta a A tem novo ID. O histórico é imutável e retornado ao chamador. Para persistência futura, o chamador deve serializar por SourceId ou aplicar a mudança com comparação atômica do estado anterior para evitar bifurcações.

## Contrato com o Source Registry

`CollectionResult` expõe `source_id`, `canonical_route`, `rights_summary_state`, `rights_record_ref`, `last_success_at`, `ref_period` e `adapter_version`. `ref_period` é o maior mês observado na tentativa atual. `last_success_at` só avança quando toda a janela é coberta, inclusive para um replay idempotente. O mês associado a esse sucesso fica em `history.last_success_ref_period`.

Todo resultado tem `environment="fixture"`. Esses timestamps são de replay e devem ficar fora da saúde operacional do Registry. O SourceId é tipado localmente como `NewType` sobre string e tem o mesmo formato do contrato NIV-83. O consumidor futuro deve mapear o identificador para o tipo canônico e consultar `read_source(session, source_id, channel, now=...)` antes de qualquer uso governado. Estado de direitos e estado de cobertura são independentes. [Contrato NIV-83](https://linear.app/nivarenergy/issue/NIV-83/argos-source-registry-runtime-v0-executable-rightshealth-contract#comment-5a076fc3-089f-48b7-ad7e-b3997c15b529)

O estado da fonte é `unknown`, com `rights_record_ref=null`. `local_archive`, `client_display` e `external_api` ficam sujeitos à negativa por padrão do Registry. Os termos da API descrevem o uso do serviço, atribuição à EIA, limites técnicos e condições de apresentação. A pesquisa NIV-90 identificou os usos propostos. A decisão de uso do recurso por canal permanece pendente. A aquisição live fica desabilitada neste piloto. Um smoke futuro depende de autorização explícita de aquisição para a rota, revisão dos termos, chave de desenvolvimento e opt-in `--allow-live`. [Termos da API EIA](https://www.eia.gov/opendata/terms-of-service.php) · [Matriz NIV-74](https://linear.app/nivarenergy/issue/NIV-74/argos-global-source-rights-and-evidence-onboarding-matrix-for-first) · [Pesquisa NIV-90](https://linear.app/nivarenergy/issue/NIV-90/argos-source-rights-and-cadence-p1-evidence-for-first-global-api#comment-2b2952de-78b2-4071-8449-85b599407b8a)

## Exemplo higienizado

Execute a partir da raiz do repositório. Os valores e a hora abaixo são inteiramente sintéticos.

```python
from datetime import UTC, datetime
from pathlib import Path

from app.adapters.argos_eia_v2.connector import EiaConnector, HttpResponse
from app.adapters.argos_eia_v2.series import Window

fixture = Path("tests/argos_eia_v2/fixtures/co_res_monthly_synthetic.json")

def replay(route, query, *, timeout):
    return HttpResponse(200, {"Content-Type": "application/json"}, fixture.read_bytes())

connector = EiaConnector(replay, clock=lambda: datetime(2024, 5, 1, tzinfo=UTC))
result = connector.collect(Window("2024-01", "2024-02"))
print(result.environment, result.status, result.ref_period, result.last_success_at.isoformat())
print([(row.ref_period, row.version.published_value) for row in result.periods])
```

```text
fixture complete 2024-02 2024-05-01T00:00:00+00:00
[('2024-01', '42.01'), ('2024-02', '42.02')]
```

```console
python -m pytest -q tests/argos_eia_v2
```
