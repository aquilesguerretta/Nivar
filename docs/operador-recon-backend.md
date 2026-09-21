# Portal do Operador — Wave 1 · reconhecimento de backend

**Status:** reconhecimento concluído. Nenhum model, migration, endpoint,
service, dependência ou código de produto foi criado nesta wave. Este
documento é a entrega.

**Autor:** CURSOR. **Data:** 3 de setembro de 2026.

**Reconhecimentos travados**

- Anotação sobre documento é domínio **novo**. A forma abaixo é desenho
  para o brief de build; **zero schema aplicado**.
- Intake de Diagnóstico: os dois caminhos (ficha cresce × operador
  preenche na call) estão reportados com custo de schema. **Esta recon
  não escolhe.**

## Numeração e método

### Esta é a Wave 1 desta trilha

Varredura contra o estado permanente e o log:

| fonte | o que tem de operador / portal |
| --- | --- |
| `AGENTS.md` · Ativos hoje | CURSOR possui `app/`; nenhuma wave de portal do operador listada |
| `docs/registro-de-waves.md` | headings de Diagnóstico, CLE, Solar, Método; **zero** `PORTAL DO OPERADOR` |
| `docs/*operador*` | **não existe** |
| `docs/*recon*` | oito recons de Advisory (front/back de CLE, Solar, Diagnóstico, marcação CLE) |

Não há seção anterior desta trilha. O e-mail `ADVISORY_OPERATOR_EMAIL` e
os endpoints `/api/operator/conversations` são capacidade **de produto
Advisory**, não um console. Portanto esta é trilha nova e começa em
**Wave 1**.

### Estado da sessão

- worktree `C:\dev\gridalpha-v2-operador-backend`, branch
  `wave/operador-backend` nascida de `feature/full-shell-buildout`
  (`c340459`);
- `git fetch` + `rev-list --left-right --count` contra origin: `0 0`;
- ARCHITECT em voo paralelo no front, worktree próprio, zero arquivo em
  comum esperado;
- posse: **CRIAR** só este arquivo; **MODIFICAR** nenhum; `app/` só
  leitura.

### Escopo lido

Toda a árvore `app/`, com ênfase no que o console vai tocar:

- models: `conta_luz.py`, `solar_proposal.py`, `diagnostico.py`,
  `conversation.py`, `product_access.py`, `user.py`, `progress.py`;
- migrations `0001`–`0008`;
- routers: `conta_luz.py`, `solar_proposal.py`, `diagnostico.py`,
  `conversations.py`, `products.py`, `auth.py`, `main.py`;
- services: `advisory_operator.py`, `conta_luz_email.py`,
  `solar_proposal_email.py`, `conta_luz_storage.py`,
  `solar_proposal_storage.py`;
- precedente de marcação não implementada:
  `docs/conta-luz-express-recon-marcacao-backend.md` (CURSOR CLE Wave 3,
  23/08/2026);
- `docs/diagnostico-energetico-recon-backend.md`,
  `docs/diagnostico-energetico-wave-2-backend.md`,
  `docs/pendencias-infra.md`.

## Resultado executivo

| # | Hipótese | Achado |
| --- | --- | --- |
| 1 | Estado real dos três produtos Advisory | CLE e Solar são irmãs BYTEA (`submitted`/`ready` + deliverable PDF). Diagnóstico é ficha de quatro textos, **sem** BYTEA, **sem** ciclo de deliverable, **sem** e-mail transacional. Operador de CLE/Solar anexa PDF por id; **não há fila de submissão** em nenhum dos três. |
| 2 | `/api/operator/conversations` | Lista **todas** as conversas `open`, qualquer `productId`, sem paginação, sem lido/não-lido, sem nome do cliente. Serve os três **como fios**, se existirem; hoje só Diagnóstico liga `origin_*`. **Não** lista submissões CLE/Solar. Histórico `closed` some da lista. |
| 3 | Anotação como domínio novo | **Confirmada.** 16 tabelas, zero conceito. A recon CLE Wave 3 já tinha fechado o terreno de marcação e não foi construída. Desenho abaixo; não implementado. |
| 4 | Diagnóstico precisa de deliverable? | Hoje **não existe** endpoint nem coluna de entrega. A copy do produto descreve relatório. O que faltaria está listado; a decisão de construir é do Aquiles. |
| 5 | Intake de Diagnóstico (localização, metragem, equipamentos, custo) | **Nenhum** desses campos existe. Dois caminhos de schema reportados, sem escolha. |
| 6 | Retenção e LGPD | **Nada.** Sem política, sem TTL de dado, sem endpoint de exclusão. `ON DELETE CASCADE` a partir de `users` é o único apagamento, e não há API que o dispare. Histórico permanente é o comportamento de fato, não uma decisão documentada. |

## Hipótese 1 — estado real dos três produtos

**Achado: CLE e Solar são o mesmo ciclo arquivo→PDF; Diagnóstico não
é. Premissa do brief sobre Diagnóstico sem deliverable: verdadeira.**

### Tabelas medidas

Dezesseis `__tablename__` em `app/db/models/` (a recon de Diagnóstico
Wave 1 mediu **13**, até `0006`; `0007` acrescentou `conversation` /
`message`, `0008` acrescentou `diagnostico_energetico_submission`):

| tabela | migration | papel |
| --- | --- | --- |
| `users`, `product_access` | `0002` | identidade / ativação |
| `conta_luz_submission` | `0005` | fatura BYTEA + PDF BYTEA |
| `solar_proposal_submission` | `0006` | proposta BYTEA + PDF BYTEA |
| `conversation`, `message` | `0007` | fio humano, qualquer produto |
| `diagnostico_energetico_submission` | `0008` | ficha de scoping, quatro textos |

Não há tabela genérica de “pedido”, “fila” ou “família”.

### Conta de Luz Express — `conta_luz_submission`

Model: `app/db/models/conta_luz.py`. Router:
`app/routers/conta_luz.py`, prefixo `/api/conta-luz-express`.

O que a linha guarda:

| coluna | papel |
| --- | --- |
| `user_id` | dono |
| `status` ∈ `{submitted, ready}` | CHECK acoplado ao BYTEA de entrega |
| `source_*` (filename, content_type, size, sha256, data) | arquivo do cliente (PDF/JPEG/PNG/WebP) |
| `deliverable_*` + `delivered_at` | PDF do operador; todos nulos em `submitted`, todos preenchidos em `ready` |
| `operator_email_id` / `operator_notified_at` | Resend da notificação ao operador |
| `customer_email_id` / `customer_notified_at` | Resend da entrega ao cliente |
| `created_at` / `updated_at` | |

Zero coluna de texto estruturado (sem CNPJ, endereço, kWh — isso vive
**dentro** do BYTEA).

Endpoints:

| método | caminho | quem |
| --- | --- | --- |
| `POST` | `/submissions` | cliente com entitlement; multipart; **falha se o e-mail ao operador falhar** (502) |
| `GET` | `/submissions` | cliente — **só os próprios** |
| `GET` | `/submissions/{id}` | dono **ou** operador (404 para o resto) |
| `GET` | `/submissions/{id}/source` | dono ou operador |
| `POST` | `/submissions/{id}/deliverable` | **só operador** (`require_advisory_operator`) |
| `GET` | `/submissions/{id}/deliverable` | dono ou operador, 404 se ainda não `ready` |

**Não existe** `GET` de operador listando submissões `submitted`. A
“fila” de CLE é o e-mail Resend em
`app/services/conta_luz_email.py` (`notify_operator_new_submission`),
cujo link aponta para a **URL da API**
(`/api/conta-luz-express/submissions/{id}`), não para uma superfície
de console.

### Solar Proposal Validator — `solar_proposal_submission`

Model: `app/db/models/solar_proposal.py`. Router:
`app/routers/solar_proposal.py`, prefixo `/api/solar-proposal-validator`.

Irmã de forma da CLE: mesmas colunas, mesmo CHECK
`submitted`/`ready`, mesmos seis endpoints, mesmo gate extraído. E-mail
em `app/services/solar_proposal_email.py`, assunto distinto, mesma
ideia de fila-por-inbox.

O model declara a intenção: *“the second Advisory product tests the
shared workflow before a third instance justifies a generic submission
domain.”* O terceiro produto **não** virou essa genericidade —
Diagnóstico saiu por outro caminho.

### Diagnóstico Energético — `diagnostico_energetico_submission`

Model: `app/db/models/diagnostico.py`. Router:
`app/routers/diagnostico.py`, prefixo `/api/diagnostico-energetico`.
Migration `0008` (cabeçalho: *“No BYTEA — the intake is four text
fields.”*).

O que a linha guarda:

| coluna | null | teto na API |
| --- | --- | --- |
| `sector` | não | 200 |
| `monthly_consumption_band` | não | 80 |
| `tariff_modality` | sim | 80 |
| `concern` | não | 4000 |
| `created_at` / `updated_at` | — | — |

**Não há** `status`, `source_*`, `deliverable_*`, `delivered_at`, nem
colunas de e-mail. Sem `submitted`/`ready`. O caso existe; o
andamento vive em `conversation` / `message`.

Endpoints:

| método | caminho | quem |
| --- | --- | --- |
| `POST` | `/submissions` | cliente com entitlement; JSON; **sem** Resend |
| `GET` | `/submissions` | cliente — só os próprios |
| `GET` | `/submissions/{id}` | dono **ou** operador |

**Não há** `POST …/deliverable`. Confirmado por grep de
`deliverable` em `app/routers/diagnostico.py`: zero. O operador de
Diagnóstico hoje só lê a ficha (se souber o UUID) e fala pelo
`operator_router` de conversas.

### Gate de operador — um, compartilhado

`app/services/advisory_operator.py`: um e-mail,
`ADVISORY_OPERATOR_EMAIL`. 503 se a env falta; 403 se o e-mail da
sessão não casa. Sem role no `User`, sem allowlist de vários
operadores, sem audit log. Extraído na Diagnóstico Wave 2; CLE e Solar
já importam.

`docs/pendencias-infra.md` ainda lista `ADVISORY_OPERATOR_EMAIL` como
pendência de produção. Esta recon **não** re-mediu o Railway; o código
continua dormente até a env existir.

### Catálogo e famílias — o backend não conhece as cinco famílias

`PRODUCT_CATALOG` em `app/db/models/product_access.py` é uma tupla
plana de seis ids:

```
alexandria
terminal-brasil
energy-brief
conta-de-luz-express
solar-proposal-validator
diagnostico-energetico
```

Servido em `GET /api/products/me` como `catalog`. **Zero** agrupamento
por família (Advisory, Intelligence, Academy, Hardware, Software).
Hardware e Software não têm id. Academy aparece só como `alexandria`.
Intelligence como `energy-brief` e `terminal-brasil`.

Premissa a corrigir no brief de build do esqueleto: o nav
multi-família **não tem backing de dado no backend**. Ou o front
carrega a taxonomia sozinho (como já faz no Portal), ou o backend
ganha um catálogo de família — hoje não há o que ligar além dos três
produtos Advisory.

### O que o operador consegue operar hoje, produto a produto

| produto | saber que chegou | ver o caso | responder | entregar PDF |
| --- | --- | --- | --- | --- |
| CLE | e-mail Resend (se env viva) | `GET` por UUID | **não** (conversa não ligada) | `POST …/deliverable` |
| Solar | e-mail Resend (se env viva) | `GET` por UUID | **não** (conversa não ligada) | `POST …/deliverable` |
| Diagnóstico | só se o cliente abrir conversa | `GET` da ficha por UUID; lista de fios `open` | `POST /api/operator/conversations/{id}/messages` | **não existe** |

Não há fila unificada de “pedidos”. Há inbox de e-mail (CLE/Solar) e
lista de conversas abertas (Diagnóstico, se o cliente abriu fio).

## Hipótese 2 — `/api/operator/conversations` hoje

**Achado: endpoint real, útil como lista de fios abertos, insuficiente
como fila do console. Premissa “foi construído para Diagnóstico”:
parcialmente verdadeira — o schema é genérico; a ligação de origem é
só Diagnóstico.**

Arquivo: `app/routers/conversations.py`. Montado em `app/main.py`:

```
app.include_router(conversations.operator_router)  # /api/operator/conversations/*
```

Três rotas, todas `require_advisory_operator`:

| método | caminho | o que faz |
| --- | --- | --- |
| `GET` | `/api/operator/conversations` | `Conversation.status == "open"`, `ORDER BY updated_at DESC` |
| `GET` | `/api/operator/conversations/{id}` | fio + mensagens, qualquer status |
| `POST` | `/api/operator/conversations/{id}/messages` | `INSERT` `role=operator`; 409 se o fio está `closed` |

### O que `GET ""` devolve exatamente

`_conversation_payload` sem mensagens e **sem** `messageCount`:

```json
{
  "id": "<uuid>",
  "userId": "<uuid>",
  "productId": "diagnostico-energetico",
  "status": "open",
  "subject": null,
  "originKind": "diagnostico_energetico_submission",
  "originId": "<uuid>",
  "createdAt": "…",
  "updatedAt": "…"
}
```

Envelope:

```json
{ "data": [ … ], "summary": { "count": N, "product": "any" } }
```

`product: "any"` é **string fixa** no handler (`list_open_conversations`),
não um filtro. Não há query param de produto, família, status, cursor
ou página.

O que **não** vem:

- nome / e-mail do cliente (`userId` opaco; join com `users` não
  acontece);
- última mensagem, preview, `messageCount`;
- campos da ficha Diagnóstico (setor, faixa, tarifa, preocupação) —
  o console precisaria de um segundo `GET /api/diagnostico-energetico/submissions/{originId}`;
- lido / não-lido: **nenhuma** coluna `read_at`, `last_read_at`,
  `seen_at` em `conversation` nem em `message` (grep em `app/`);
- paginação: o `SELECT` não tem `LIMIT`/`OFFSET` (o `limit(1)` do
  arquivo é só o check de entitlement do cliente).

### Sabe de qual produto veio cada fio?

**Sim, no campo.** `conversation.product_id` é obrigatório, indexado
(`conversation_product_created_idx`), validado na abertura contra
`PRODUCT_IDS`. A lista devolve `productId`.

O que o campo **não** faz: o operador não pode pedir “só Advisory” ou
“só CLE” — o filtro não existe. Qualquer `product_id` do catálogo
(incluindo `alexandria`) pode aparecer se alguém abrir um fio.

### Distingue lido / não-lido?

**Não.** `message` é append-only (`body` + `created_at`, sem
`updated_at`). Não há tabela de cursor de leitura por operador.

### Foi construído para Diagnóstico — serve os três sem alteração?

Schema: **sim, parcialmente.** O model
(`app/db/models/conversation.py`) diz explicitamente que não é
Diagnóstico-específico; `origin_kind` é TEXT, não enum; o unique
parcial `(origin_kind, origin_id)` admite um fio por caso de qualquer
irmã. `ORIGIN_DIAGNOSTICO_SUBMISSION = "diagnostico_energetico_submission"`
é constante de aplicação; o comentário no model: *“CLE / Solar kinds
enter later without a migration.”*

Router: **não serve os três iguais.** `_verify_diagnostico_origin`
só corre quando `originKind == diagnostico_energetico_submission`.
Abrir fio com `originKind` de CLE/Solar **passa sem checar** se o
UUID existe ou se o caller é o dono. Constantes
`conta_luz_submission` / `solar_proposal_submission` **não existem**
no código. Nenhum POST de CLE/Solar abre conversa.

Lista do operador: devolve fios `open` de **qualquer** produto, então
um fio CLE apareceria **se existisse**. Hoje o caminho que cria fios
com origem é só Diagnóstico.

Outras lacunas para o console, mesmo nos três:

1. **Submissão ≠ conversa.** CLE/Solar prontos ou em fila **não
   aparecem** nesta lista. Operador de fatura continua dependente do
   e-mail.
2. **Histórico.** `GET ""` filtra `status == "open"`. Conversas
   `closed` somem da fila. Não há endpoint que **feche** um fio
   (grep de `close` / `status = "closed"` em routers: zero). O CHECK
   `open|closed` existe; a transição não.
3. **Lista do cliente** (`GET /api/conversations`) não filtra status
   — o cliente vê os próprios, inclusive `closed` se algum dia
   existirem. Assimétrico com o operador.
4. `POST …/messages` do lado cliente recusa o operador (403
   `operator access required` se `conversation.user_id != user.id`).
   Correto. Operador responde só no prefixo `/api/operator/…`.

**Veredito para o brief de build:** o endpoint lista fios abertos e
já carrega `productId` + `origin_*`. Não é fila de pedidos, não é
paginado, não marca leitura, não junta identidade do cliente, não
lista casos CLE/Solar sem conversa, e esconde o que estiver
`closed`. Precisa crescer — ou o console precisa de um segundo
recurso de fila de submissão — antes de a UI presumir uma inbox
única.

## Hipótese 3 — anotação como domínio novo (desenho, sem implementar)

**Achado: a hipótese é verdadeira.** Zero tabela, zero coluna, zero
endpoint, zero tipo Pydantic de marca. O único JSONB da árvore
continua sendo `progress_event.metadata` (domínio pedagógico, sem
leitura na API de perfil).

Grep de `annotation` / `anotacao` / `highlight` / `overlay` em
`app/**/*.py`: hits irrelevantes (comentários, `follow_redirects`,
família de combustível PJM).

### O que já existia e não foi construído

`docs/conta-luz-express-recon-marcacao-backend.md` (CURSOR, CLE
Wave 3, 23/08/2026) fechou o terreno de **marcação manual** e não
escolheu schema. Fatos dela que **ainda valem** (reconfirmados agora):

- MIME do source é detectado por assinatura (`%PDF-`, JPEG, PNG,
  WebP) em `conta_luz_storage` / `solar_proposal_storage`;
- o backend **não** persiste page count, dimensões, DPI, MediaBox;
- não há parser de PDF no caminho de intake;
- coordenada x/y sozinha não é reproduzível sem um sistema de
  coordenadas declarado;
- precedente de domínio com identidade própria aponta para **tabela
  nova**, não array JSONB na submissão.

O que **mudou** desde aquela recon e o brief de build precisa usar:

- `origin_kind` / `origin_id` nasceu em `0007` e é o padrão da casa
  para ponteiro opaco (a recon de agosto ainda não tinha isso);
- o gate `_require_operator` foi extraído para
  `require_advisory_operator`;
- Solar é irmã BYTEA; o console é multi-produto. Uma coluna JSONB em
  `conta_luz_submission` **não** serve o segundo arquivo.

### Forma recomendada

Tabela nova `document_annotation`. Não é coluna na submissão. Não é
`message`. Não é `progress_event.metadata`.

Princípio: a anotação aponta para o **documento** com o mesmo par
opaco que a conversa usa para apontar para o **caso**. O BYTEA
continua morando na linha de submissão; não há (e não precisa haver)
tabela `document`. O `origin_kind` discrimina **qual blob** — source
do cliente versus, no futuro, o PDF entregue.

| coluna | null | papel |
| --- | --- | --- |
| `id` | não | UUID |
| `origin_kind` | não | TEXT, teto ~80. Valores de aplicação, **sem CHECK de vocabulário** (mesmo idioma de `conversation.origin_kind`: CLE/Solar/futuros entram sem migration de enum) |
| `origin_id` | não | UUID do caso (`conta_luz_submission.id`, etc.). **Sem FK** cruzando irmãs |
| `author_user_id` | não | FK `users.id` |
| `kind` | não | CHECK `highlight` \| `comment` \| `overlay` |
| `page` | sim | 1-indexed; **obrigatório** se o MIME do source for PDF; **null** se imagem |
| `quote` | sim | trecho destacado, se extraível; o backend não OCR |
| `geometry` | não | JSONB — único JSONB **desta** tabela, e só geometria |
| `body` | sim | texto do comentário; obrigatório na API quando `kind=comment` |
| `created_at` | não | append-only no V1 (sem `updated_at`, como `message`) |

`geometry`, contrato mínimo a travar no brief de build (não nesta
wave):

```json
{
  "scheme": "normalized-v1",
  "rects": [{ "x": 0.12, "y": 0.40, "w": 0.31, "h": 0.035 }]
}
```

Unidades **normalizadas 0..1** relativas à página (PDF) ou à imagem.
A recon CLE Wave 3 já mostrou que o backend não conhece pontos PDF
nem pixels; gravar user-space sem MediaBox torna a marca irreproduzível
no viewer. `scheme` versiona se um dia houver outra base.

`kind`:

- `highlight` — `quote` e/ou `rects`; `body` opcional;
- `comment` — `body` obrigatório + âncora (`rects` e/ou `page`);
- `overlay` — `rects` obrigatórios (região pintada); `body` opcional.

Valores iniciais de `origin_kind` (constantes de aplicação, como
`ORIGIN_DIAGNOSTICO_SUBMISSION`):

| kind | documento |
| --- | --- |
| `conta_luz_submission_source` | fatura que o cliente enviou |
| `solar_proposal_submission_source` | proposta que o cliente enviou |

Diagnóstico **não tem documento** hoje — a tabela nasce sem um kind
para ele. Se o produto ganhar PDF (hipótese 4), o mesmo par opaco
serve sem redesenhar.

Índice `(origin_kind, origin_id)` — não único: N marcas por
documento. Índice `author_user_id` se a auditoria “quem marcou”
for consulta, não só coluna.

CHECK de par: `origin_kind` e `origin_id` ambos preenchidos (aqui
não são opcionais: anotação sem documento não existe).

Papel: escrito pelo operador (`require_advisory_operator`). O
cliente **lê**? Fora desta recon — o Aquiles descreveu a superfície
de trabalho dele, não um Grammarly visível no portal do cliente.
V1 pode ser operador-only na API; a tabela não impede leitura
posterior do dono do caso.

O que **não** fazer:

- array JSONB em `conta_luz_submission` / `solar_proposal_submission`
  (sem identidade por marca, sem query, amarra ao produto);
- FK para `conta_luz_submission.id` (o segundo produto e o
  deliverable futuro quebram);
- reusar `message.body` com coordenadas no texto;
- parser de PDF nesta wave de construção da tabela — o viewer
  calcula `rects` no front e manda `normalized-v1`.

### O que isso implica de migration

Próximo número livre: **`0009`**, revisa `0008_diagnostico_energetico`.
Só `CREATE TABLE` + dois índices. Additive. Não altera as três
tabelas de submissão, `conversation` nem `message`.

Não criar a migration nesta wave.

Endpoints (para o brief, não para agora): lista/cria por
`(origin_kind, origin_id)` sob `/api/operator/annotations` ou
aninhado no documento. Delete individual se a marca tiver identidade
— a tabela acima já permite; o V1 pode ser só POST+GET.

## Hipótese 4 — Diagnóstico precisa de deliverable?

**Achado: hoje não há entrega de documento. A premissa do brief
(“Diagnóstico não tem ciclo de deliverable”) é verdadeira no
código. A copy do produto descreve um relatório; isso ainda não é
fato de máquina.**

Medido:

- model `diagnostico.py` (docstring: *“Status is not submitted/ready:
  there is no PDF deliverable in this wave.”*);
- router: três rotas, nenhuma `deliverable`;
- Wave 2 (`docs/diagnostico-energetico-wave-2-backend.md`): *“Sem
  BYTEA. Sem submitted/ready de parecer em PDF — o ciclo deste
  produto nesta wave é caso → conversa → mensagens. Sem e-mail
  transacional.”*

O operador **não** tem onde anexar um PDF de Diagnóstico. A
conversa é o único canal de volta.

### Se a resposta for que também precisa entregar um documento

O que faltaria, espelhando CLE/Solar (não é recomendação de copiar
as colunas BYTEA para a ficha — é o inventário da lacuna):

1. **Blob de entrega** — colunas `deliverable_*` + `delivered_at` na
   ficha, **ou** tabela irmã `diagnostico_energetico_deliverable`
   (um PDF por caso). A ficha hoje não tem CHECK de estado; entrar
   `submitted`/`ready` **muda o ciclo** de “conversa aberta” para
   “conversa + PDF”, e precisa decidir o que acontece com o fio
   quando o PDF sai.
2. **`POST /api/diagnostico-energetico/submissions/{id}/deliverable`**
   com `require_advisory_operator`, teto de bytes, MIME PDF — o
   precedente está nos dois routers irmãos.
3. **`GET …/deliverable`** para dono ou operador.
4. **E-mail ao cliente** (“seu diagnóstico está pronto”). Diagnóstico
   hoje **não** chama Resend; o POST da ficha não tem o 503 de
   `CLE_APP_BASE_URL`. Ligar e-mail **acopla** o intake ao mesmo
   bloqueio de produção que CLE/Solar já têm (`pendencias-infra.md`).
5. **Não** reusar `message` como veículo do PDF (a recon de
   Diagnóstico Wave 1 já separou os dois).
6. Viewer de anotação sobre o **entregável** (kind
   `diagnostico_energetico_submission_deliverable`) só depois do
   blob existir.

A conversa pode continuar existindo como contraditório **depois** da
entrega — isso é decisão de produto, não lacuna de schema. O que o
disco não tem é o arquivo.

## Hipótese 5 — intake de Diagnóstico: dois caminhos, sem escolha

**Achado: localização, metragem, equipamentos que consomem e custo
não existem.** Colunas reais: `sector`, `monthly_consumption_band`,
`tariff_modality`, `concern`. Grep de `location` / `metragem` /
`equipment` / `custo` / `cnpj` / `endereço` em `app/db/models/`:
zero no domínio Diagnóstico.

O Aquiles decide. Abaixo, só custo de schema.

### Caminho A — o intake cresce (o cliente preenche)

Alteração em `diagnostico_energetico_submission` (`0009` ou
posterior) e em `CreateDiagnosticoRequest`
(`app/routers/diagnostico.py`).

| campo desejado | forma possível | custo |
| --- | --- | --- |
| localização | `TEXT` (endereço livre) e/ou `NUMERIC` lat/lon; PostGIS já está no banco (`0001`) mas **nenhum** model Advisory o usa | 1–3 colunas; teto de comprimento; se for ponto, decisão de SRID e de se o cliente geocoda ou manda texto |
| metragem | `NUMERIC` m², ou `TEXT` faixa (como consumo) | 1 coluna; unidade travada na API |
| equipamentos | `TEXT` livre, ou JSONB de lista `{nome, potencia}`, ou tabela filha `diagnostico_energetico_equipment` | TEXT é barato e opaco; JSONB/tabela filha dá identidade por equipamento e complica o POST |
| custo | `NUMERIC` (R$/mês) ou `TEXT` faixa | 1 coluna; moeda implícita |

Linhas **já existentes**: as colunas novas precisam ser `NULL`
(não há backfill). Tornar obrigatório no POST quebra só clientes
novos — o CHECK `NOT NULL` no banco contra linhas antigas **falha**
a menos que a migration preencha sentinela. Sentinela é o que o
`AGENTS.md` proíbe (*ausência se declara*). Logo: nullable no
banco + required só na API nova, **ou** required no banco só se
ainda não houver casos em produção que se queira preservar.

Não mexe em `conversation`. Não cria BYTEA. O POST deixa de ser
quatro campos; o payload do `GET` cresce. Entitlement igual.

Custo colateral: a ficha deixa de ser “scoping para a call” e vira
coleta do que a copy do produto promete. Validação de vocabulário
(setor, faixa) continua TEXT livre — um CHECK de enum ainda
travaria o front.

### Caminho B — o operador insere na call de scoping

O POST do cliente **não muda**. As quatro colunas permanecem a
ficha. Localização / metragem / equipamentos / custo entram por
escrita privilegiada.

Três formas, em ordem de peso:

1. **Colunas nullable na mesma tabela**, preenchidas só pelo
   operador (`PATCH` novo com `require_advisory_operator`). Uma
   migration `ADD COLUMN` ×4 (ou as que o Aquiles quiser), todas
   NULL. O `GET` da ficha passa a devolver esses campos; o cliente
   vê o que o operador anotou, a menos que o payload do operador
   seja outro DTO. Barato. Mistura “o que o cliente disse” com “o
   que a casa mediu” na mesma linha — auditoria de autoria fica
   fraca (não há `filled_by` / `filled_at` por campo).
2. **Tabela irmã** `diagnostico_energetico_scope` (1:1 com a ficha,
   `origin` desnecessário: FK direta aqui **é** a mesma irmã, não
   cruzamento). Colunas dos quatro fatos + `author_user_id` +
   `updated_at`. O operador UPSERT. A ficha do cliente permanece
   imutável. Custa uma tabela e um router; preserva a fronteira
   “intake do cliente × nota da casa”.
3. **Só a conversa.** Zero schema. O operador pergunta e escreve em
   `message`. Custo de banco: zero. Custo de produto: os quatro
   fatos não são consultáveis, não alimentam fila, não viram filtro,
   não entram em análise futura — contradiz “histórico permanente
   para consulta e análise” se esses campos forem a matéria da
   análise.

Nenhuma das três cria BYTEA. Nenhuma entrega PDF. O caminho B.1 e
B.2 ainda deixam o cliente **sem** localização no intake — a call
é que coleta. Se a UI do produto “mostrar” esses dados ao cliente
antes da call, B não basta.

### O que os dois caminhos não resolvem sozinhos

- deliverable (hipótese 4);
- anotação sobre arquivo (Diagnóstico não tem arquivo);
- LGPD: localização e custo de planta são dado pessoal/empresarial
  a mais, qualquer que seja o autor.

## Hipótese 6 — retenção e LGPD

**Achado: não existe política de retenção no backend. A premissa
“provavelmente nada” é verdadeira.**

Grep de `lgpd` / `gdpr` / `retenção` / `purge` / `anonymiz` /
`direito` em `app/`: zero. `docs/pendencias-infra.md`: zero.
`SESSION_TTL_DAYS` (`app/services/auth_service.py`, default 30) é
TTL do **cookie de sessão**, não do dado.

`docs/conta-luz-express-recon-backend.md` (Wave 1 do produto) já
listava *“retenção, exclusão ou autorização de download”* entre os
contratos que um brief **não** deveria presumir. Download foi
construído na Wave 2. Retenção e exclusão **não**.

### O que o disco faz hoje com dado de cliente

Persistido, sem prazo:

| onde | o que |
| --- | --- |
| `users` | e-mail (chave), nome |
| `conta_luz_submission.source_data` | fatura — na prática CNPJ, endereço da unidade, perfil de consumo, valores |
| `solar_proposal_submission.source_data` | proposta de fornecedor — planta, potência, valores |
| `diagnostico_energetico_submission` | setor, faixa, tarifa, texto livre de preocupação |
| `message.body` | o que cliente e operador escreveram |
| colunas `*_email_id` | ids Resend |

Não há job, coluna `expires_at`, nem `DELETE` de aplicação sobre
esses recursos. `auth.py` expõe `signup` / `login` / `logout` /
`me` — **sem** exclusão de conta.

O único apagamento medido é `ON DELETE CASCADE` a partir de
`users.id`, exercitado no smoke da Diagnóstico Wave 2 (*“ON DELETE
CASCADE limpou caso, fio e mensagens”*). Não há endpoint que
apague o `User`. Histórico permanente, na prática: as linhas
ficam. Se um dia a conta for apagada, **some tudo** — o contrário
de arquivo morto consultável.

`status = ready` / conversa `closed` **não** arquivam: não movem
de tabela, não escondem BYTEA, não anonimizam. `ready` **trava** o
PDF (409 se o operador mandar outro hash). `closed` só tiraria o
fio da lista do operador — e nada fecha o fio.

Operador: uma identidade por e-mail, sem log de acesso (“quem
abriu qual fatura, quando”). O `GET` do BYTEA não deixa rastro.

### O que precisaria existir (não resolvido aqui)

Para o Aquiles, não para esta wave construir:

1. **Finalidade e base legal** escritas fora do código — o BYTEA da
   fatura não é “arquivo técnico”; é documento fiscal de terceiro.
2. **Prazo de retenção** por classe (conta de luz, proposta,
   ficha, mensagens, marcas) distinto do “nada some”.
3. **Caminho de exclusão / anonimização** que não seja CASCADE
   cego: apagar a conta hoje destrói o arquivo que o console
   queria permanente; permanente sem exclusão choca com pedido de
   titular.
4. **Minimização** no intake (hipótese 5): localização e custo só
   existem se alguém os coletar — o caminho A aumenta a superfície
   LGPD no POST do cliente; o B, na escrita do operador.
5. **Registro de tratamento / acesso do operador** se o console
   passa a ser a superfície habitual sobre o BYTEA, não o e-mail
   pontual.
6. **Contrato com o front** para não baixar o source ao browser do
   operador sem HTTPS + cookie já existentes — isso já é o padrão;
   o que falta é a política, não o transporte.

Brief de build do console **não** deve presumir TTL, direito ao
esquecimento, nem arquivo morto separado. O comportamento atual é:
guarda para sempre, apaga em cascata se o `User` sumir, e o User
não some.

## Premissas que um brief de build do console não deve carregar

1. Existe fila de submissão Advisory no backend. **Não.** Existe
   inbox de e-mail (CLE/Solar) e lista de conversas `open`.
2. `/api/operator/conversations` é a fila dos três produtos.
   **Não**, até CLE/Solar abrirem fio e a lista incluir `closed` /
   submissões sem conversa.
3. O backend conhece as cinco famílias. **Não.** Tupla plana de
   seis `product_id`.
4. Diagnóstico tem PDF. **Não.**
5. Localização / metragem / equipamentos / custo já estão na
   ficha. **Não.**
6. Anotação já tem tabela (a recon de Diagnóstico não achou; a de
   marcação CLE desenhou e não construiu). **Ainda não.**
7. Lido/não-lido, paginação, nome do cliente na lista de fios.
   **Não.**
8. Política de retenção. **Não.**
9. Vários operadores / role no JWT. **Não** — um e-mail.
10. Fechar conversa. O status existe; o endpoint não.

## O que o terreno já dá de graça para a Wave 2

- identidade de operador extraída e usada nos três produtos;
- `origin_kind` / `origin_id` como ponteiro opaco;
- `product_id` no fio;
- GET de submissão por UUID para dono **ou** operador nos três;
- download do source CLE/Solar (o viewer de anotação tem de onde
  puxar bytes);
- MIME detectado no source (PDF × imagem);
- mensagens append-only com `role` derivado do caller;
- próximo número de migration livre: `0009`.
