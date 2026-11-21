# Diagnóstico Energético — Wave 2 · backend real

**Status:** fechada. Schema aplicado em produção (`0007` + `0008`).
Smoke ponta a ponta: **75 PASS / 0 FAIL**.

**Autor:** CURSOR. **Data:** 1 de setembro de 2026.

## Numeração

O `CLAUDE.md` segue sem heading `CURSOR — DIAGNÓSTICO ENERGÉTICO WAVE N`.
A Wave 1 desta trilha é a recon `docs/diagnostico-energetico-recon-backend.md`
(commit `08eb35f`). A ARCHITECT está em voo paralelo na UI (recon
frontend + intake mock) — trilha distinta, mesmo produto.

Esta construção é **Wave 2**.

## Reconhecimentos (travados)

- Intake é **ficha de scoping**, não coleta dos 25–40 páginas do
  relatório.
- Lado do operador é **endpoint**, zero painel admin.
- Extração de `_require_operator` é mecânica: mesmos status, mesmas
  strings de `detail`, mesmo e-mail de env. CLE e Solar não mudam de
  comportamento.
- Mensagem é capacidade de qualquer conta com `product_access` em
  **algum** produto; o `product_id` do fio é o produto daquela
  conversa. Não é gate de pagante.
- `diagnostico-energetico` **já está** em `PRODUCT_CATALOG` (Wave 9 /
  catálogo `/conta`). A Fase 3 **não toca** `product_access.py` — o id
  novo que o brief previa já existe. Diff esperado na Fase 5: zero
  linhas naquele arquivo.

## Fase 1 — as três hipóteses

### 1. Número de migration livre

**0007**, revisa `0006_solar_proposal_validator`.

Medido no disco: `app/db/migrations/versions/` tem `0001` … `0006`.
Nenhum `0007`. A recon citava o estado até 0006; reconfirmado agora,
não herdado.

### 2. Nomes `conversation` / `message`

**Sem colisão de tabela.** Varredura de `__tablename__` no backend:

| tabela | domínio |
| --- | --- |
| `progress_event` | log de aula Alexandria — near-match da recon, domínio errado |
| `conta_luz_submission` / `solar_proposal_submission` | arquivo+PDF |
| demais | infra, users, product_access, OWID |

Zero `conversation`, zero `message`. `conversationStore` no frontend é
sessionStorage do ORACLE — outra camada, não Postgres.

Nomes finais, como a recon desenhou e o brief desta wave nomeou:

- tabelas: `conversation`, `message`
- model: `app/db/models/conversation.py` (as duas classes no mesmo
  arquivo, precedente de `progress.py`)
- `origin_kind` TEXT + `origin_id` UUID, ambos nullable, **sem FK**.
  CHECK: os dois nulos juntos **ou** os dois preenchidos. Índice único
  parcial `(origin_kind, origin_id) WHERE origin_id IS NOT NULL` — um
  fio por caso, reabrir devolve o existente.
- `product_id` TEXT, validado na API contra `PRODUCT_IDS`, sem CHECK.
- `message.role` CHECK `customer` | `operator`. `body` TEXT, linha
  imutável (sem `updated_at`). Papel derivado do caller, nunca do
  payload.
- `conversation.status` `open` | `closed`, default `open` — para o
  endpoint de operador listar “abertas” ter significado sem inventar
  painel.

### 3. Campos do intake — ficha de scoping

**Colunas normalizadas, não JSONB.** São quatro fatos conhecidos; JSONB
caberia num questionário que vai crescer até o relatório completo, e
essa coleta **não é desta wave**. Null honesto na tarifa (o cliente
pode não saber). Valores de setor/faixa em TEXT livre com teto de
comprimento na API — um CHECK de vocabulário trava o mock da ARCHITECT
antes de existir contrato compartilhado.

Tabela: `diagnostico_energetico_submission` (irmã de nome, **não** de
forma, das duas de arquivo).

| coluna | null | papel |
| --- | --- | --- |
| `sector` | não | setor / tipo de instalação |
| `monthly_consumption_band` | não | faixa de consumo mensal |
| `tariff_modality` | sim | modalidade tarifária, se já souber |
| `concern` | não | “o que mais preocupa você hoje” |

Sem BYTEA. Sem `submitted`/`ready` de parecer em PDF — o ciclo deste
produto nesta wave é caso → conversa → mensagens. Sem e-mail
transacional (não herdar o 503 de `CLE_APP_BASE_URL` num POST de
ficha). Entitlement: `product_access` em `diagnostico-energetico`,
igual aos outros dois.

Kind opaco ao ligar mensagem: `diagnostico_energetico_submission`.
Não é enum no banco — CLE/Solar entram depois sem migration.

## O que as fases seguintes construíram

2. Tabelas `conversation`/`message` + helper `advisory_operator` +
   CLE/Solar passam a importar.
3. Model/router de Diagnóstico (JSON, não arquivo).
4. Cliente abre conversa com `origin_*`; operador lista abertas de
   qualquer produto e responde.
5. Ciclo ponta a ponta + prova de fronteira.

## Endpoints

Prefixo de intake: `/api/diagnostico-energetico`

| método | caminho | quem |
| --- | --- | --- |
| `POST` | `/submissions` | cliente com entitlement — ficha JSON, 201 |
| `GET` | `/submissions` | cliente — só os próprios casos |
| `GET` | `/submissions/{id}` | dono **ou** operador (404 para o resto) |

Prefixo de mensagem: `/api/conversations` — qualquer conta com
`product_access` em **algum** produto. Papel `customer` vem do caller,
nunca do body. Sem Anthropic.

| método | caminho | quem |
| --- | --- | --- |
| `POST` | `/` | abre fio (`productId`, `originKind`/`originId` opcionais, `body` opcional). Reabrir o mesmo origin devolve 200 + `alreadyOpen: true` |
| `GET` | `/` | lista os fios do caller |
| `GET` | `/{id}` | dono **ou** operador |
| `POST` | `/{id}/messages` | só o dono, `role=customer` |

Prefixo de operador: `/api/operator/conversations` — `require_advisory_operator`.
Zero painel. 503 se `ADVISORY_OPERATOR_EMAIL` falta; 403 se o e-mail não casa.

| método | caminho |
| --- | --- |
| `GET` | `/` — todas as conversas `open`, qualquer produto |
| `GET` | `/{id}` |
| `POST` | `/{id}/messages` — `role=operator` |

Kind opaco desta wave: `diagnostico_energetico_submission`. Sem FK.

## Fase 5 — verificação

`railway run py -3 -m alembic upgrade head` em produção:
`0006_solar_proposal_validator` → `0007_conversation` →
`0008_diagnostico_energetico`.

Ciclo real (TestClient + banco de produção, contas descartáveis):
ativar `diagnostico-energetico` → POST da ficha (tarifa vazia vira
`null`) → abrir conversa no caso → cliente manda follow-up → operador
vê na lista de abertas e responde → cliente lê a resposta. 401 sem
sessão. 403 sem entitlement. 404 para conta alheia. 503/403 do
operador com as **mesmas** `detail` que CLE/Solar tinham nas cópias
locais. `ON DELETE CASCADE` limpou caso, fio e mensagens.

**75 PASS / 0 FAIL.**

### Fronteira

| arquivo | diff desta wave |
| --- | --- |
| `product_access.py` | **zero** — o id já estava no catálogo; nenhum commit da wave o toca |
| `conta_luz_submission` / `solar_proposal_submission` | **zero** — BYTEA intactas no banco |
| `conta_luz.py` / `solar_proposal.py` | só extração: `_require_operator` / `_is_operator` saem, `require_advisory_operator` / `is_advisory_operator` entram. Status e `detail` idênticos |
| pagamento | zero código novo; a única ocorrência de "payment" é o comentário do helper dizendo que **não** é flag de pagamento |
| `src/` | intocado |
| proxy Anthropic | intocado |

Helper único: `app/services/advisory_operator.py`. Grep de
`_require_operator` em `app/routers/` depois da extração: zero.
