# Diagnóstico Energético — Wave 1 · reconhecimento de intake rico e mensagem

**Status:** reconhecimento concluído. Nenhum model, migration, endpoint,
service, dependência ou integração foi criado nesta wave. Este documento é a
entrega.

**Autor:** CURSOR. **Data:** 1 de setembro de 2026.

**Reconhecimento declarado:** mensagem é capacidade de **qualquer cliente
pagante**, modelada geral desde agora. Diagnóstico Energético é o primeiro
consumidor; Conta de Luz Express e Solar Proposal Validator ganham o mesmo
acesso numa wave de ligação posterior. Nada abaixo amarra o schema de
conversa a `diagnostico-energetico`.

## Numeração e método

### Esta é a Wave 1 desta trilha

O `CLAUDE.md` foi varrido pelo heading esperado
`CURSOR — DIAGNÓSTICO ENERGÉTICO WAVE N` e pelos headings CURSOR existentes.

| heading no disco | domínio |
| --- | --- |
| `CURSOR WAVE 8` … `12` | infra, identidade, OWID, progresso, Atlas qualitativo |
| `CURSOR — CATÁLOGO /CONTA WAVE 1` | tupla `PRODUCT_CATALOG` |

Não existe seção anterior chamada Diagnóstico Energético. O id
`diagnostico-energetico` já vive no catálogo (`PRODUCT_CATALOG`) e na família
Advisory do Portal (`br-familias.ts`), mas isso é inventário de produto, não
trilha de backend. Solar Proposal Validator Wave 2 (backend) fechou sem
seção no `CLAUDE.md` — lacuna herdada, não desta recon.

Portanto esta é uma trilha nova e começa em **Wave 1**.

### Estado da sessão

Antes da leitura:

- branch confirmada: `feature/full-shell-buildout`;
- `git pull --rebase` contra origin (árvore suja de outras sessões —
  autostash quando necessário);
- diff rastreado alheio: `.claude/launch.json`, ruído de CRLF em
  `app/services/advisory_email.py` e `app/services/solar_proposal_email.py`
  (`git diff --stat` vazio nesses dois);
- staged vazio nesta recon;
- nenhum arquivo preexistente modificado.

### Escopo lido

Backend inteiro, com ênfase no que a Conta de Luz Express e o Solar
Proposal Validator deixaram no disco:

- models: `conta_luz.py`, `solar_proposal.py`, `product_access.py`,
  `user.py`, `progress.py`;
- migrations `0001`–`0006`;
- routers: `conta_luz.py`, `solar_proposal.py`, `products.py`, `progress.py`,
  `ai.py`, `stream.py`, `main.py`;
- services: `conta_luz_*`, `solar_proposal_*`, `advisory_files.py`,
  `advisory_email.py`;
- `docs/pendencias-infra.md`, recon Solar Wave 1, contrato V2.

Near-matches fora do backend (frontend) foram lidos só para **excluir**
reuso: `conversationStore.ts`, `annotationStore`, `anthropic.ts`,
`src/lib/submissoes/api.ts`.

## Hipótese 1 — o modelo de submissão é "um arquivo, um envio"?

**Achado: sim.** CLE e Solar assumem um BYTEA de origem obrigatório e um
POST multipart com um único `UploadFile`. **Não cabe** num intake que é
formulário rico (vários campos de texto, não um arquivo).

### Forma medida nas duas tabelas

`conta_luz_submission` e `solar_proposal_submission` são irmãs, mesma
forma, **zero coluna de texto estruturado**:

| coluna | papel |
| --- | --- |
| `user_id` | dono |
| `status` ∈ `{submitted, ready}` | ciclo arquivo → PDF |
| `source_*` (BYTEA + MIME + tamanho + hash) | o único insumo do cliente |
| `deliverable_*` (BYTEA PDF opcional) | parecer do operador |
| ids/timestamps de email | notificação transacional |

Não há `product_id` na tabela. Não há JSONB. Não há campo de questionário.
O CHECK de `source_size_bytes > 0` **proíbe** linha sem arquivo.

Intake: `POST …/submissions` com `file: UploadFile = File(...)`. Entitlement
via `product_access`. O operador anexa um **segundo** arquivo (PDF) em
`POST …/deliverable`.

O cliente canônico do frontend (`src/lib/submissoes/api.ts`) fecha o mesmo
contrato: `enviar(arquivo: File)` — FormData campo `file`. Alargou
`productId` de literal para `string` porque CLE e Solar compartilham a
**forma arquivo+parecer**, não porque a forma sirva Diagnóstico.

### Diagnóstico já é o terceiro produto Advisory — e isso NÃO justifica
consolidar as tabelas de arquivo

A recon Solar Wave 1 recomendou domínio irmão na segunda instância e
reservou `advisory_submission` para a **terceira instância do mesmo
contrato**. Solar Wave 2 executou o irmão. Diagnóstico é o terceiro
produto da família Advisory (`br-familias.ts`: CLE + Solar + Diagnóstico)
e já está em `PRODUCT_CATALOG`.

Não é a terceira instância do contrato arquivo+PDF:

- consolidar CLE+Solar numa tabela genérica de BYTEA **ainda não
  guardaria um formulário**;
- forçar Diagnóstico numa terceira tabela BYTEA seria mentir o intake.

Recomendação para o brief de build: **não** estender CLE/Solar com
colunas de texto; **não** clonar a tabela BYTEA. Intake de Diagnóstico
pede tabela/router próprios (campos tipados ou JSONB de questionário;
arquivos opcionais depois). Ativação já existe (`POST /api/products/
{id}/activate`); não há router nem tabela para este produto.
`main.py` monta CLE e Solar e para aí. No frontend o destino segue
`em-breve` / `rota: null`.

## Hipótese 2 — existe conversa/thread em algum lugar?

**Achado: não no backend.** Não presuma ausência — foi medida.

### Tabelas Postgres hoje (migrations 0001–0006)

Infraestrutura, `users`, `product_access`, OWID (2), progresso (4),
`conta_luz_submission`, `solar_proposal_submission`. **Zero** tabela
`conversation`, `thread` ou `message`.

Grep em `app/` por `conversation|thread|mensagem` como domínio de
atendimento: hits são e-mail transacional (assunto/corpo Resend) e
copy de erro — não persistência de diálogo.

### Near-matches — domínio errado, não reutilizáveis

| o que existe | por que não é isto |
| --- | --- |
| `POST /api/ai/complete` + `useConversationStore` + `useAIChat` | chat ORACLE do terminal US; **sessionStorage**; proxy Anthropic **sem auth**; sem `user_id` |
| `progress_event.metadata` JSONB | log **imutável** de aprendizagem; `GET /api/progress/me` devolve aulas/badges/streak, **sem metadata**; Wave 39 já registrou: escrever nota ali é escrita sem leitura |
| CONDUIT `annotationStore` / anotações de sandbox | notas de gráfico/trade em **localStorage** |
| e-mails Resend de CLE/Solar | notify pontual (`submitted` / `ready`), não thread |
| `GET /api/stream` | SSE de mercado PJM |
| Toast NIVAR `mensagem` | copy de UI |

Notas da Alexandria continuam bloqueadas na falta de tabela de anotação
(Wave 39). Isso confirma a lacuna; não é um thread de operador.

## Hipótese 3 — `_require_operator` serve para "operador responde mensagem"?

**Achado: a regra de identidade é reutilizável; a implementação não é
compartilhada e só está ligada a anexar PDF.**

Copiada **duas vezes**, não extraída:

- `app/routers/conta_luz.py`
- `app/routers/solar_proposal.py`

Comportamento idêntico: usuário da sessão; `user.email` comparado (case
insensitive) a `ADVISORY_OPERATOR_EMAIL`; **503** se a variável não
existe; **403** se o e-mail não é o do operador. Único caller em cada
router: `POST …/deliverable`. Leitura de submissão: dono **ou** operador
(`_is_operator`); demais **404**.

O brief desta recon ainda cita `CLE_OPERATOR_EMAIL`. O disco e
`docs/pendencias-infra.md` usam **`ADVISORY_OPERATOR_EMAIL`** (renomeado
na Solar Wave 2 Fase 3), compartilhado entre os dois produtos com fluxo
de envio. Variável **ausente no Railway** na última medição — o gate
segue dormente, como na CLE Wave 2.

`operator_email()` vive em **cada** módulo de e-mail
(`conta_luz_email.py`, `solar_proposal_email.py`), ambos lendo a mesma
env. Não há helper compartilhado. CLE e Solar não importam o
`_require_operator` um do outro.

O que reusa para "operador responde":

- o **teste de identidade** (um e-mail de casa vs. o cliente);
- o par 503/403 já conhecido.

O que **não** reusa:

- ACL de thread ("pode postar nesta conversa");
- papéis além de um único operador;
- corpo de mensagem — o endpoint existente só aceita `UploadFile` PDF;
- FastAPI `Depends` extraído: hoje é função local chamada no handler.

Terceiro uso do padrão (responder mensagem) é o gatilho natural para
extrair um `require_advisory_operator` único — decisão do brief de
build, não desta recon.

## Hipótese 4 — como mensagem liga a produto e usuário (desenho, sem implementar)

Decisão de arquitetura fica no brief de build. Forma **recomendada**
abaixo, para não partir de um schema Diagnóstico-only.

### Princípio

Domínio de **mensagem** separado das tabelas de submissão BYTEA e do
intake rico. CLE/Solar provam arquivo+PDF+e-mail. Diagnóstico é o
primeiro caso **formulário + thread contínuo**. Consolidar submissões
de arquivo continua pergunta à parte; **mensagem é o que se modela
geral no dia um**, como o Aquiles pediu.

Não usar `/api/ai/complete` como canal de operador. Não usar
`progress_event`. Não acrescentar colunas de chat em
`conta_luz_submission` / `solar_proposal_submission`.

### Forma sugerida

**`conversation`** (o fio):

| campo | papel |
| --- | --- |
| `id` | UUID |
| `user_id` | FK `users.id` ON DELETE CASCADE — o cliente dono do fio |
| `product_id` | TEXT, validado na API contra `PRODUCT_CATALOG` (mesmo idioma de `product_access`: **sem CHECK** no banco, catálogo cresce sem migration) |
| `subject` | TEXT nullable |
| `created_at` / `updated_at` | |
| `origin_kind` + `origin_id` | opcional; ponteiro opaco (`diagnostico_case`, `conta_luz_submission`, `solar_proposal_submission`, …) **sem FK cruzando tabelas irmãs** — mesma honestidade de `progress_event` com `aula_id` cru |

**`message`** (linha imutável):

| campo | papel |
| --- | --- |
| `id` | UUID |
| `conversation_id` | FK CASCADE |
| `author_user_id` | FK `users` |
| `role` | `customer` \| `operator` |
| `body` | TEXT |
| `created_at` | imutável |

Anexos: fora do V1 (texto basta). Um BYTEA por mensagem depois, se
preciso — não misturar com o BYTEA de fatura/proposta.

### Quem pode abrir um fio

Qualquer conta com **alguma** linha em `product_access` (capacidade de
cliente com produto ativado). Entitlement de Diagnóstico gateia o
**intake** de Diagnóstico, não a existência de messaging.

"Pagante" ainda não é fato de máquina: ativar produto é gratuito até
haver gate de pagamento (`pendencias-infra.md`). O ACL deve ser escrito
contra `product_access` (ou flag de billing futura), **não** contra uma
coluna só de Diagnóstico. Quando o paywall existir, o mesmo predicado
sobe de grau sem redesenhar o fio.

`product_id` no fio já admite
`{conta-de-luz-express, solar-proposal-validator, diagnostico-energetico, …}`.
Ligar UI de CLE/Solar é wave posterior; o schema não deve impedir.

### Operador

Mesmo gate de e-mail, extraído uma vez (terceiro uso). Operador vê fios
de clientes com entitlement; o cliente vê só os seus. Resposta do
operador é `INSERT` em `message` com `role=operator`, não `UploadFile`.

### Intake de Diagnóstico (ao lado, não dentro da mensagem)

Tabela/router próprios: questionário (colunas ou JSONB) + talvez
arquivos opcionais. Abrir um caso **pode** abrir ou amarrar uma
`conversation` (`origin_*`). O blob do formulário **não** mora em
`message`.

### O que o brief de build ainda decide

- um fio por produto vs. um fio por caso (`origin_id`);
- status de conversa (`open`/`closed`) ou só derivado da última
  mensagem;
- notificação (Resend de "nova mensagem") vs. só persistência nesta
  primeira entrega;
- extrair `_require_operator` agora ou na terceira cópia inline.

## Estado do produto no catálogo (contexto, não schema)

`diagnostico-energetico` já é id canônico. `GET /api/products/me` já o
serve no `catalog`. Sem endpoints próprios. Curriculum Alexandria
(Módulos 08–10) descreve análise 360° (demanda, deslocamento de carga,
reativo, tarifa, tributo, score) — **insumo de produto**, não contrato
de tabela.

Operador Advisory: uma env, dois produtos com fluxo de envio; Diagnóstico
seria o terceiro leitor da mesma identidade.

E-mail de CLE/Solar ainda 503 em produção sem Resend + FROM +
`APP_BASE_URL` (nomes em `pendencias-infra.md`). Mensagem não depende
disso para persistir; notificar por e-mail herdaria a mesma pendência.

## O que esta recon não é

Não é brief de build. Não escolhe nomes finais de tabela. Não autoriza
migration. Zero código novo além deste arquivo.
