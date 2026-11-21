# NIV-84 · ARGOS Source Watch

O piloto observa um CSV sintético no formato de `ons.capacidade_geracao`. O CLI roda em primeiro plano com opt-in explícito, emite uma linha JSON por checagem e grava somente na cadeia `test.argos_memory.ons_capacidade_geracao.controlled_revision.source_watch`.

## Reprodução local em Windows

Use Python com as dependências de `requirements.txt` e PostgreSQL 17 com PostGIS. Execute da raiz do repositório. Reserve `127.0.0.1:5284` para a fixture e `127.0.0.1:54884` para um cluster novo e descartável.

```powershell
$pg = 'C:/Program Files/PostgreSQL/17/bin'
$pgData = 'C:/dev/niv84-wave2-local/pgdata'
New-Item -ItemType Directory -Force (Split-Path $pgData) | Out-Null
& "$pg/initdb.exe" -D $pgData -U argos_watch -A trust --encoding=UTF8 --no-locale
& "$pg/pg_ctl.exe" -D $pgData -l 'C:/dev/niv84-wave2-local/postgres.log' -o '-h 127.0.0.1 -p 54884' -w start
& "$pg/createdb.exe" -h 127.0.0.1 -p 54884 -U argos_watch argos_watch_test
$env:DATABASE_URL = 'postgresql://argos_watch@127.0.0.1:54884/argos_watch_test'
py -m alembic upgrade 0011_argos_same_source_lineage
```

Em outro terminal, inicie a fixture HTTP. Reinicie a fixture e use um banco de demonstração vazio para repetir a sequência completa.

```powershell
py -m tests.argos_source_watch.fixture_server
```

```powershell
py -m app.scripts.argos_watch_ons --run --synthetic-url http://127.0.0.1:5284/capacity.csv --checks 6 --interval-seconds 1 --jitter-seconds 0.1 --stale-after-seconds 1.5
```

O recorte abaixo mostra a sequência esperada. `last_outcome=failed` preserva o resultado da tentativa quando o último sucesso ultrapassa a janela de saúde.

| Status | HTTP | Base ou efeito |
| --- | ---: | --- |
| `not_checked` | — | Estado inicial |
| `last_success` | 200 | Snapshot A |
| `no_content_change` | 304 | Revalidação de A |
| `stale` | 503 | Falha após três tentativas |
| `changed` | 200 | Recuperação após 429. Snapshot B com um campo alterado |
| `no_content_change` | 200 | Snapshot C com bytes novos e linhas reordenadas |
| `no_content_change` | 200 | SHA-256 igual ao de C |

Ao final da demonstração, `metrics` registra 6 checagens, 5 sucessos, 1 falha, 9 tentativas HTTP, 3 retries e 3 capturas. Reexecute o diff a partir dos IDs de A e B emitidos no JSON, mantendo `DATABASE_URL` no banco de demonstração. O resultado identifica a linha sintética `TEST-EQ-002`, cujo campo `val_potenciaefetiva` muda de `20.0` para `22.5`.

```powershell
py -m app.scripts.diff_argos_ons_capacidade_geracao --from <ID A> --to <ID B>
```

## Operação e direitos

- `--once` executa uma checagem. `--run` executa imediatamente e aguarda a cadência mais jitter uniforme entre checagens. `--checks` limita os ticks. A cadência é uma escolha do operador e a publicação upstream permanece desconhecida neste exercício. O CLI sai com 0 se o último tick produziu evidência, 1 se falhou ou foi retido/ignorado, 2 para erro de argumentos e 130 ao interromper.
- HTTP usa `ETag` e `Last-Modified` quando disponíveis. O prazo é por tentativa, com backoff exponencial e espera máxima de 5 s. Um `Retry-After` superior a esse limite encerra a checagem; o próximo tick segue a cadência configurada. O limite da resposta é 8 MiB. Redirect, CSV inválido e respostas incompletas falham. As datas do host acompanham a aquisição e a data de publicação continua ausente.
- A transação mantém o lock da fonte antes da requisição até o commit. Um segundo worker registra `source_check_in_progress` sem se apropriar do resultado do primeiro. Em 304 ou hash idêntico, reutiliza-se o ID de evidência do head. Cada alteração de bytes que passa pelo parser acrescenta um snapshot; o diff reutiliza as regras do Gold Set e produz apenas candidatos sem atestação. A avaliação de promoção permanece `not_run`.
- O CLI usa uma sessão explícita no banco descartável e transporta apenas HTTP loopback, sem proxy ou redirecionamento. O histórico e os validadores das capturas sobrevivem ao processo no Argos Memory. Contadores, falhas e horários de revalidação sem captura são memória do processo. Um novo processo pode recuperar o horário da última captura; para histórico de saúde, guarde as linhas JSON no ambiente interno descartável.
- A porta `ArchivePolicy` confere por checagem a decisão de `local_archive`, a versão da política, a atribuição e a retenção. A fixture carrega `NIV7-EXT-ONS-OPEN-DATA-2026-09-16` como referência de governança e `ons-portal-notice@2026-09-16` como identificador da nota, cuja versão jurídica exata permanece desconhecida. O adaptador real do NIV-83 deve conferir a decisão e a projeção atuais do recurso e mapear estas condições antes de qualquer integração. Display e API ficam fora da porta de arquivo. [Contrato de direitos e saúde do NIV-83](https://linear.app/nivarenergy/issue/NIV-83/argos-source-registry-runtime-v0-executable-rightshealth-contract#comment-5a076fc3-089f-48b7-ad7e-b3997c15b529)
- Pare a fixture com Ctrl+C. Ao terminar, pare o cluster com `& "$pg/pg_ctl.exe" -D $pgData -m fast -w stop`. Descarte o cluster e os logs conforme a política local, sem copiar a evidência sintética para outros ambientes. Uma implantação futura exige autorização para aquisição real, reavaliação de retenção, operação e alertas.

## Verificação

Crie um banco separado `argos_watch_verify` no mesmo cluster descartável. O opt-in abaixo aplica o Alembic existente e limpa as tabelas Argos desse banco antes de cada caso de persistência. Execute com a porta 5284 livre e sem paralelismo entre testes da fixture.

```powershell
& "$pg/createdb.exe" -h 127.0.0.1 -p 54884 -U argos_watch argos_watch_verify
$env:ARGOS_WATCH_TEST_POSTGRES = '1'
py -m pytest -q -rs tests/argos_source_watch
```
