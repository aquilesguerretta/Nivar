# NIVAR — Handover Técnico do Código

**ARCHITECT · Handover Wave 1 · setembro de 2026.** Metade de código do
handover da plataforma. A metade estratégica e de infraestrutura
(domínio, DNS, Vercel, Railway, Resend, variáveis, método, doutrina,
pendências) é o documento **"NIVAR — Handover de Plataforma"**, escrito
fora do repositório e **não versionado aqui**. Este arquivo não repete
aquele; referencia.

Medido contra `feature/full-shell-buildout` em `7928971`. Tudo o que está
aqui foi lido no código, rodado no worktree ou medido contra produção —
o que não está no repositório está declarado como ausente, não inferido.

> **Numeração.** O registro de waves numera por trilha
> (`ARCHITECT — PORTAL BR WAVE 10`, `LYCEUM — ALEXANDRIA WAVE 49`…), sem
> N global. "Handover" não aparece em nenhum título: é trilha nova, N = 1.

---

## Fase 1 — Levantamento

### Achado que não espera a Fase 2

**O Atlas Mundial da Alexandria está quebrado em produção.** Medido por
clique real em `https://nivar.com.br/alexandria/atlas`:

```
Access to fetch at 'https://gridalpha-v2-production.up.railway.app/api/atlas/world/countries'
from origin 'https://nivar.com.br' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Causa, em três peças:

1. `src/lib/atlas/worldApi.ts:181` chama a API por `BASE_URL` **absoluto**
   (`src/services/api/client.ts:12`), não por caminho relativo. O
   comentário em `worldApi.ts:164-168` justifica isso com "um caminho
   relativo cairia no próprio frontend" — premissa que o `vercel.json`
   desfez em setembro.
2. O CORS do backend (`app/main.py:44-66`) aceita `gridalpha.vercel.app`,
   `*.vercel.app` e localhost. `nivar.com.br` só entra por `CORS_ORIGINS`,
   que em produção **não o contém**. Medido com controle: a mesma
   requisição com `Origin: https://gridalpha.vercel.app` recebe
   `access-control-allow-origin`; com `Origin: https://nivar.com.br`, não
   recebe, e o preflight responde 400.
3. `montarMundo()` (`worldApi.ts:201-205`) usa `Promise.all` sobre
   TopoJSON + perfis, então a falha dos perfis rejeita a montagem inteira.

**O esquema faltando no `VITE_BACKEND_URL` não é a causa.** O bundle de
produção traz `"//gridalpha-v2-production.up.railway.app"` (confirmado em
`/assets/index-Dl8BZII7.js`), e o protocolo-relativo resolve para
`https:` corretamente. O que bloqueia é a **origem**, não o esquema.

**Mesmo mecanismo, mesma falha, em toda chamada absoluta feita a partir
de `nivar.com.br`** — o middleware de CORS é global. Atinge o terminal
americano inteiro (`src/services/api/*`, SSE em `stream.ts:89`), Peregrine
(`components/peregrine/*`) e os hooks de `src/hooks/data/`. Identidade,
progresso, os três produtos Advisory e conversas usam caminho relativo e
não são afetados.

Duas correções, nenhuma na posse deste handover:

| Correção | Onde | Dono | Alcance |
| --- | --- | --- | --- |
| `CORS_ORIGINS=https://nivar.com.br,https://www.nivar.com.br` | painel do Railway | Aquiles | conserta tudo de uma vez, sem deploy de front |
| trocar `BASE_URL` por caminho relativo em `worldApi.ts` | `src/lib/atlas/` | LYCEUM | conserta o Atlas; é a correção durável, porque o rewrite do `vercel.json` já cobre `/api/*` |

---

### Divergências contra o handover estratégico

Numeradas para citação. "Estratégico" = o documento de plataforma.

**D1 · Contagem de endpoints.** Estratégico e brief: "39". Medido:
**62 rotas sob `/api` + `/health` = 63.** Por domínio: plataforma
(identidade 4, produtos 2, progresso 3, atlas mundial 2, CLE 6, Solar 6,
Diagnóstico 3, conversas 7) = **33**; terminal e legado (LMP 6, atlas
legado 6, news 3, energy 2, weather 2, infra 3, ai 1, fuel-mix 1,
reserve-margin 1, outages 1, ancillary 1, spark-spread 1, stream 1) =
**29**. Nenhuma partição dá 39. O `docs/v2-backend-contract.md` numera
24 (Endpoints 1–24) e documenta mais 2 sem número (atlas mundial).

**D2 · "Todos os três Advisory compartilham storage BYTEA e email nos dois
sentidos."** Só CLE e Solar. O Diagnóstico **não tem BYTEA** (é ficha
estruturada: `sector`, `monthly_consumption_band`, `tariff_modality`,
`concern` — `app/db/models/diagnostico.py`) e **não envia email nenhum**:
`app/routers/diagnostico.py` não importa serviço de email, e nem a criação
do caso nem mensagem em conversa avisam o operador.

**D3 · "Head em `0008`, com `0009` proposta."** A `0009` já está
**escrita e commitada**: `app/db/migrations/versions/0009_operator_queue.py`
(194 linhas) em `wave/operador-api`, commit `629e82c` ("cursor: fase 2
wave 2 — status nos tres produtos"), junto com mudança em três routers e
três models e um `advisory_status.py` novo. Não mergeada. Em
`feature/full-shell-buildout` o head segue `0008_diagnostico_energetico`.

**D4 · "Hook bloqueia `git add -A`, `git add .`, `git reset --hard`."**
O único hook (`.claude/hooks/block-git-add-all.mjs`) bloqueia só
variações de `git add` (`-A`, `--all`, `.`, `./`, `:/`, `*`,
`--no-ignore-removal`, cacho curto com `A`). **Nada bloqueia
`git reset --hard`** — nem `.claude/settings.json`, nem
`~/.claude/settings.json`. Pior: `.claude/settings.local.json` da árvore
principal tem `"Bash(git reset *)"` na lista **`allow`**, ou seja, o
reset passa sem nem pedir confirmação.

**D5 · "`VITE_BACKEND_URL` sem esquema afeta só dado de mercado; funciona
hoje por protocolo-relativo."** Duas correções: afeta também o **Atlas
Mundial** (produto publicado da Academy), e **não funciona** a partir de
`nivar.com.br` — ver o achado acima. O esquema é cosmético; a origem é o
defeito.

**D6 · "`ADVISORY_OPERATOR_EMAIL` — destino do aviso de submissão nova."**
É isso **e é a única definição de quem é operador**
(`app/services/advisory_operator.py:20-44`). Trocar o valor troca quem
anexa entregável, lê submissão de qualquer conta e responde conversa.
Sem ele: endpoints de operador → 503, e o `email_config()` de CLE/Solar
exige a variável, então **submissão nova de cliente também → 503**.

**D7 · Tabela de variáveis incompleta.** O código lê, além do que o
estratégico lista: `CORS_ORIGINS` (decisivo — ver achado),
`SESSION_TTL_DAYS`, `SESSION_COOKIE_{NAME,PATH,DOMAIN,SAMESITE,SECURE}`,
`{CLE,SPV}_MAX_{SOURCE,DELIVERABLE}_BYTES`, `{CLE,SPV}_RESEND_API_URL`,
`PJM_SUBSCRIPTION_KEY`, `HIFLD_TRANSMISSION_LAYER_URL`, `EIA_860_ZIP_URL`
(ingestão). Todas têm default, exceto o efeito de `CORS_ORIGINS`. No
front, além das cinco listadas: `VITE_MOCK_API` (`client.ts:26`).

**D8 · `VITE_API_URL` aponta para um backend que não existe mais.**
`src/hooks/data/useLiveOpsData.ts:23-25` usa `VITE_API_URL` com fallback
`https://gridalpha-production.up.railway.app` — o backend **V1**, não o
`-v2-`. Medido: o Railway responde `"Application not found"`
(`x-railway-fallback: true`). O estratégico lista `VITE_API_URL` sem
dizer isso.

**D9 · "Todas as páginas setam `document.title` em `useEffect`."** Seis
arquivos: `PortalBR`, `FamiliaPage`, as três páginas Advisory e
`NotFound`. Alexandria, `/conta`, `/operador` e o terminal não setam. O
scraper lê o `<title>` do `index.html`
("NIVAR — Inteligência independente do setor elétrico brasileiro"), não
"NIVAR".

**D10 · Elenco de agentes.** O estratégico dá território ativo a ATLAS,
SCRIBE ("renderizador verbatim") e CHROMA; o `AGENTS.md` os lista como
herdados sem atividade, e SCRIBE como "currículo legado do Vault — nunca
autor". FOUNDRY também diverge (estratégico: tokens, tipo, taxonomia;
`AGENTS.md`: tipo compartilhado, mock, primitivo, skills). E o histórico
já tem commits `codex:` (`7655a80` e anteriores, "phase 1–3 wave 1") —
o Codex agiu como agente sem constar do elenco de nenhum dos dois.

**D11 · "Oito ocorrências de defeito do harness."** O registro
(Método Wave 1, "O hook de harness não foi construído") conta **sete**,
heterogêneas, e só **duas** do bug de caixa contra `innerText` (L8836,
L9134). O `AGENTS.md` diz sete.

**D12 · Baseline do auditor.** Estratégico, brief e `AGENTS.md`:
0 P0 / 27 P2. Medido hoje: **0 P0 / 0 P1 / 25 P2**, todos
`equal-weight-grid`. Os outros dois gates batem: `tsc -b` exit 0,
`test:games` 14/14.

**D13 · Operador "invisível" ao backend.** Impreciso. CLE e Solar são
**visíveis por id** ao operador (`_require_visible_submission` libera
quem passa em `is_advisory_operator`) — ele lê, baixa a fonte e anexa o
entregável. O que não existe é **listagem**: nenhum endpoint devolve
submissões de outras contas. O operador só chega ao id pelo link do
email.

**D14 · Comentários que viraram falsos** — o estratégico aponta um
(`authApi.ts`); são pelo menos seis, todos com a mesma raiz (a saída do
front para o Vercel):

| Onde | O que afirma |
| --- | --- |
| `src/lib/auth/authApi.ts:36` | "prod — frontend e backend já dividem a origem no Railway" |
| `src/lib/auth/authApi.ts:16-17` | "`BASE_URL` é reaproveitado" — o arquivo não importa `BASE_URL` |
| `app/services/auth_service.py:5-6` | "Today frontend and backend share one Railway origin" |
| `docs/v2-backend-contract.md:696-698` | "same-origin Railway deploy" + "see the Wave 9 section of `CLAUDE.md`" (a seção não existe mais) |
| `src/main.tsx:75` | "não há `vercel.json`, `netlify.toml`…" |
| `src/lib/atlas/worldApi.ts:164-168` | relativo "cairia no próprio frontend" |

**Confirmados sem divergência:** `.mcp.json` com caminho do OneDrive
(e esta sessão teve `gridalpha-tokens` em `CONNECTION_CLOSED`);
`lang="en"` ausente no terminal (pendência escrita no `index.html:41-44`);
Solar e Diagnóstico ativam trocando `status`/`rota` em
`src/lib/data/br-destinos.ts:74-90`; `/operador/*` sem gate, alcançável
por digitação, com `PlatformUser` sem papel; `/us` sem nenhum link,
`navigate()` ou `href` em `src/` (só comentários); `PRODUCT_CATALOG` sem
`us-terminal`.

### Divergências contra o brief

**B1 · "~39 endpoints"** — ver D1.

**B2 · "Os 7 erros de Recharts em `nest/student/*`"** — **não existem
mais.** Estão registrados em várias waves (registro L599, L1072, L1187;
`docs/architect-shell-topology-audit.md:345`), mas `npx tsc -b` sai com
exit 0 hoje.

**B3 · "`DestinoCard.tsx` é código morto"** — **o arquivo é vivo.** O
componente `DestinoCard` não tem consumidor, mas o mesmo arquivo exporta
`PlantaBaixa`, importado por `PortalBR.tsx:114` e pelas três páginas
Advisory. Apagar o arquivo quebra o build. `FaixaIndependencia.tsx` e
`jaguar-tokens.ts`: **mortos confirmados**, zero importadores (o
`index.html:35` ainda cita `FaixaIndependencia.tsx:73` como fonte de
copy).

**B4 · "`campos.tsx`: 44 de 89 blocos"** — é o que o código declara
(`campos.tsx:9-22`). Recontagem de `field.css` do skill, excluindo os
quadros de `@keyframes` e o bloco dentro de `@media`: **90** (campo 27,
escolha 18, desl 14, multi 16, acesso 15). Um bloco de diferença em
`.nv-campo*`, dentro da ambiguidade de método — o código não define o
que conta como bloco.

**B5 · "Três clientes em vez de um"** — a justificativa do brief está
correta e está escrita no próprio código (`src/lib/diagnostico/api.ts:9-21`).
Mas o número real de embrulhos de `fetch` com o mesmo idioma de erro é
**cinco** (`authApi`, `submissoes`, `diagnostico`, `conversas`,
`progressApi`), todos lançando `AuthError` — inclusive para erro que não
é de autenticação.

**B6 · "Cache de módulo do Vite em troca de arquivo durante A/B"** —
registrado, com outras palavras: CLE Wave 5, "trocar o arquivo por baixo
do Vite deixou o grafo de módulo preso numa versão antiga" (~L9869).

### Esperava achar e não achei

- **Teste de backend.** Nenhum. `tests/` só tem `alexandria-games/`; os
  únicos `test_*.py` são do MCP de tokens.
- **CI.** Nenhum `.github/`. O `tools/gridalpha-detect/ci-integration.md`
  descreve integração que não foi ligada, e o `.husky/pre-commit` não
  está instalado (já no `AGENTS.md`).
- **Migração no deploy.** `Procfile` e `nixpacks.toml` só sobem o
  uvicorn. Migração é manual: `railway run py -3 -m alembic upgrade head`
  (`docs/diagnostico-energetico-wave-2-backend.md:144`).
- **Endpoint que fecha conversa.** O status `closed` existe no schema e
  bloqueia mensagem com 409 (`conversations.py:238-242`), mas nada o seta.
- **Cliente de front para `/api/operator/conversations`.** Nenhum. O
  console lê 100% de `src/lib/operador/mock.ts`.
- **Cliente para `GET /api/diagnostico-energetico/submissions/{id}`.**
  O endpoint existe; o front não o chama.
- **Code splitting.** Zero `React.lazy` em `main.tsx`: Three, Mapbox,
  deck.gl e o terminal inteiro entram no bundle do Portal (8 MB de JS
  medido no bundle de produção).
- **Registro atualizado.** O `docs/registro-de-waves.md` parou em
  2026-09-03 (Método Wave 2). **21 commits depois disso não estão lá**:
  as waves do operador, o piloto do Codex, patronos, as revisões visuais
  do console e o catálogo dos 17 módulos.

### Achado de segurança, lido no código e não testado

`POST /api/ai/complete` (`app/routers/ai.py`) é **passthrough sem
autenticação** para a API da Anthropic com a chave do servidor. Qualquer
pessoa que conheça o host — ou que chame `nivar.com.br/api/ai/complete`,
que o rewrite encaminha — gasta a `ANTHROPIC_API_KEY`, com `model` e
`max_tokens` escolhidos por ela. Não testado de propósito: testar é
gastar. `VITE_ANTHROPIC_API_KEY` aparece em `src/` só numa string de UI;
nenhuma chave no bundle de produção (medido).

---

### Baseline medido nesta wave

| Gate | Resultado | Como |
| --- | --- | --- |
| `npx tsc -b` | exit 0 | worktree com `npm ci` próprio |
| `npm run test:games` | 14/14 | idem |
| `gridalpha-detect src` | 0 P0 · 0 P1 · 25 P2 | `--json`, todos `equal-weight-grid` |
| Migration head | `0008_diagnostico_energetico` | cadeia linear `0001 → 0008` |
| Rotas de API | 62 + `/health` | contagem dos decoradores em `app/routers/` |

---

## 1 · Mapa do repositório por responsabilidade

Contagens de arquivo medidas com `find`. Posse segundo o `AGENTS.md`.

### `src/`

| Responsabilidade | Onde | Notas |
| --- | --- | --- |
| Entrada e roteamento | `main.tsx` · `pages/br/PortalBRRouter.tsx` · `pages/alexandria/AlexandriaHome.tsx` + `AlexandriaRouter.tsx` · `pages/operador/OperadorRouter.tsx` · `pages/NotFound.tsx` | §3 |
| Identidade de plataforma | `lib/auth/authApi.ts`, `AuthContext.tsx` · `pages/conta/` (`EntrarView`, `CriarContaView`, `PerfilPlataforma`, `ContaShell`) | `AuthProvider` envolve a árvore inteira |
| Portal BR | `pages/br/PortalBR.tsx`, `FamiliaPage.tsx` · `components/br/` (8) | Catálogo em `lib/data/br-destinos.ts` e `br-familias.ts` — lateral e console derivam dele |
| Produtos Advisory | `pages/conta-de-luz-express/` · `pages/solar-proposal-validator/` · `pages/diagnostico-energetico/` | Clientes em `lib/submissoes/`, `lib/diagnostico/`, `lib/conversas/` (§7) |
| Console do operador | `pages/operador/` (8) · `lib/operador/{catalogo,mock,idade}.ts` | 100% mock |
| NIVAR em código | `design/nivar/` (6 CSS) · `components/nivar/` (`campos`, `tabela`, `marcas`, `patrono`) · `components/br/portalChrome.tsx` | §8 |
| Alexandria | `pages/alexandria/` (7) · `components/alexandria/` (31) · `design/alexandria-tokens.ts` · `lib/data/alexandria-*` (17 módulos, glossário, trilhas, badges) · `lib/{curriculum,games,atlas,progress}` | LYCEUM |
| Terminal americano | `components/` `nest` (82), `vault` (24), `landing` (17), `terminal` (14), `atlas` (13), `shared` (18), `ui` (27, shadcn), `peregrine`, `analytics`, `editorial` · `pages/auth/` · `services/` · `hooks/data/` (22) · `stores/` (Zustand) · `design/tokens.ts` + `index.css` | Herdado |
| Compartilhado | `lib/types/` (17) · `lib/mock/` · `lib/backendBase.ts` | FOUNDRY |
| Fora do build | `design/figma-reference/` | excluído no `tsconfig.app.json` |

### `app/`

| Responsabilidade | Onde |
| --- | --- |
| App | `main.py` — CORS (§0), 21 routers, `lifespan` do hub SSE |
| Identidade | `routers/auth.py`, `products.py` · `services/auth_service.py` · `db/models/user.py`, `product_access.py` |
| Advisory | `routers/conta_luz.py`, `solar_proposal.py`, `diagnostico.py`, `conversations.py` · `services/advisory_{operator,files,email}.py` · `services/conta_luz_{storage,email}.py` (cópias não extraídas) · `services/solar_proposal_{storage,email}.py` |
| Alexandria | `routers/progress.py` + `services/progress_service.py` · `routers/atlas_world.py` + `models/country_energy.py` + `scripts/ingest_owid_energy.py` |
| Terminal | canônicos: `routers/{lmp,spark_spread,fuel_mix,reserve_margin,outages_v2,ancillary,stream}.py`, `routers/infra/` · legado congelado: `routers/{atlas,energy,weather,news,ai}.py` · `services/pjm_*`, `intelligence_*` · `scripts/ingest_eia_860{,m}.py`, `ingest_hifld_transmission.py` |
| Banco | `db/session.py` (sem `DATABASE_URL` cai em localhost) · `db/migrations/env.py` · `versions/0001…0008` |

Raiz: `vercel.json`, `vite.config.ts` (alias `@`, proxy `/api`), `Procfile`/`nixpacks.toml` (só uvicorn), `tools/` (`gridalpha-detect`, `gridalpha-tokens-mcp`, `screenshot-loop` — só docs), `scripts/` (avulsos, nenhum no `package.json`), `tests/alexandria-games/`.

---

## 2 · Fronteira entre os três sistemas de design

| Sistema | Tokens | Como chega na tela | Fontes |
| --- | --- | --- | --- |
| NIVAR | `src/design/nivar/*.css` | cada página NIVAR importa `fonts`, `colors`, `typography`, `space`, `motion`; `base.css` **não** (restila elemento global) | `@font-face` local: Zilla Slab, Work Sans, JetBrains Mono |
| Alexandria | `src/design/alexandria-tokens.ts` (`A`, `A2`, `AT`, `AS`, `AR`) | estilo inline | Cinzel + Lora por `<link>` injetado pelo `AlexandriaShell.tsx:34-48` |
| Terminal | `src/design/tokens.ts` + `:root` do `src/index.css` | inline + Tailwind + shadcn | Inter (`@fontsource`), Geist Mono, Instrument Serif |

**O que impede vazamento: só disciplina e comentário.** Nenhum
`no-restricted-imports`, nenhum `tsconfig` por superfície, nenhuma regra
do `gridalpha-detect` sobre fronteira. Medido por import, a disciplina é
cumprida: zero import cruzado de token entre os três.

**O vazamento real é CSS global.** `src/index.css` (preflight do
Tailwind, Inter, `:root` do terminal) entra pela árvore inteira; o NIVAR
também declara em `:root`; sem code splitting, tudo vira uma folha só.
Duas variáveis colidem:

| Variável | Terminal | NIVAR | Vence |
| --- | --- | --- | --- |
| `--text-muted` | `rgba(241,241,243,.35)` | `var(--cinza-quente)` | NIVAR (vem depois) |
| `--radius` | `8px` (em `@layer base`) | `0` (sem camada) | NIVAR |

Medido no render de `nivar.com.br/us`: `--text-muted` = `#6E6659`,
`--radius` = `0`. **O terminal hoje herda cor e raio do NIVAR** —
acidental, e é o que um code split inverteria em silêncio (§10).

---

## 3 · Roteamento

Um `BrowserRouter`, um `AuthProvider`, **nenhuma rota lazy**.

```
/                         PortalBR
/br/*                     PortalBRRouter → index PortalBR · familia/:familiaId FamiliaPage · * NotFound
/entrar /criar-conta      EntrarView / CriarContaView
/conta                    PerfilPlataforma (redireciona sozinha para /entrar)
/conta-de-luz-express     ContaDeLuzExpressPage
/solar-proposal-validator SolarProposalValidatorPage   (catálogo 'em-breve', rota viva)
/diagnostico-energetico   DiagnosticoEnergeticoPage    (catálogo 'em-breve', rota viva)
/alexandria/*             AlexandriaHome → /alexandria exato: Entrada (hero + hub)
                            demais → AlexandriaRouter: index Hub · trilha/:t · …/modulo/:m
                            · …/jogo · …/aula/:n · biblioteca · perfil · atlas · glossario
                            · * HubRoute (200, não 404)
/operador/*               OperadorRouter (sem gate) → ConsoleLayout: index FilaView
                            · <produtoId> FilaView · <produtoId>/:pedidoId PedidoView
                            · * NotFound (fora do layout, de propósito)
/us                       LandingPage
/login /signup[/profile|/details|/success]   dentro de AuthLayout — fluxo de arquétipo
/nest /atlas /peregrine /analytics /vault[/…]  GlobalShell initialView=…
*                         NotFound
```

- **`/us` só por digitação**: não há guarda, há ausência de porta. Busca
  por `"/us` em `src/` só acha comentário. O resto do US só é alcançável
  da landing (`landing/Nav.tsx:101`, `FinalCta.tsx:55`).
- **Nomes que enganam**: `PerfilStub`, `AtlasStub`, `GlossarioStub` não
  são stubs. `/vault/alexandria` é a Alexandria **legada** do terminal.
- **Catch-alls**: `main.tsx`, Portal e operador → `NotFound` real;
  Alexandria → hub com 200 (pendência LYCEUM, `pendencias-alexandria.md` §4).

---

## 4 · Contrato de API

63 rotas. `docs/v2-backend-contract.md` cobre 26 (Endpoints 1–24 +
atlas mundial) e segue certo na forma. Os 22 de Advisory e conversas só
estão aqui.

### Guardas e códigos

| Guarda | Código | `detail` |
| --- | --- | --- |
| `JWT_SECRET` ausente | 503 | `auth unavailable: JWT_SECRET is not configured` |
| sem token / expirado / inválido / usuário apagado | 401 | `not authenticated` / `session expired` / `invalid session` / `account no longer exists` |
| entitlement | 403 | `product '<id>' is not active for this account` |
| operador: env ausente / email diferente | 503 / 403 | `ADVISORY_OPERATOR_EMAIL is not configured` / `operator access required` |
| id de outra conta | 404 | `submission not found` / `conversation not found` |
| upload vazio / grande / tipo / assinatura | 422 / 413 / 415 / 415 | |
| config de email incompleta | 503 | nome da variável |
| Resend falhou | 502 | rollback — sem email, sem linha |

**Toda requisição autenticada por cookie reemite o cookie** (janela
deslizante de 30 dias), não só o `/me`.

### Referência ao contrato existente

Identidade 16–21, progresso 22–24, atlas mundial, terminal 1–15 e a
tabela de legado: ver o contrato. Mudou desde então: o front ainda chama
`/api/infra/transmission-segments` (`services/api/transmission.ts:75`)
contra a rota `/api/infra/transmission`; `POST /api/ai/complete` é
passthrough sem auth (§0); o texto de "Session transport" está vencido
(D14). `/me` não traz papel; `activate` ativa inclusive produto
`em-breve`.

### CLE e Solar — `/api/conta-luz-express`, `/api/solar-proposal-validator`

```
Submissao { id, productId, status: 'submitted'|'ready',
            source: { filename, contentType, sizeBytes, sha256, downloadUrl },
            deliverable: {…} | null, createdAt, updatedAt, deliveredAt | null }
```

| Rota | Quem | Entrada → Saída | Guardas em ordem |
| --- | --- | --- | --- |
| `POST /submissions` | dono + entitlement | multipart `file` PDF/JPEG/PNG/WebP ≤15 MiB → 201 | 401 → 403 → 503 email → 422/413/415 → 502 |
| `GET /submissions` | sessão | → `{data, summary:{count,submitted,ready}}` | 401 (sem checar entitlement) |
| `GET /submissions/{id}` | dono ou operador | → `Submissao` | 401 → 404 |
| `GET /submissions/{id}/source` | dono ou operador | → bytes, `attachment`, `no-store` | 401 → 404 |
| `POST /submissions/{id}/deliverable` | operador | multipart PDF ≤20 MiB → 200 + `alreadyReady` | 401 → 503/403 → 503 email → 422/413/415 → 404 → 409 se `ready` com outro sha → 502. Mesmo sha → `alreadyReady: true` |
| `GET /submissions/{id}/deliverable` | dono ou operador | → PDF | 401 → 404 → 404 `deliverable not ready` |

O anexo lê o arquivo inteiro antes de checar se o id existe.

### Diagnóstico — `/api/diagnostico-energetico`

Sem arquivo, status, entregável ou email.
`{ id, productId, sector, monthlyConsumptionBand, tariffModality|null, concern, createdAt, updatedAt }`

| Rota | Quem | Entrada → Saída | Guardas |
| --- | --- | --- | --- |
| `POST /submissions` | dono + entitlement | JSON: `sector` ≤200, `monthlyConsumptionBand` ≤80, `tariffModality` ≤80 opcional (vazio → null), `concern` ≤4000 → 201 | 401 → 422 → 403 |
| `GET /submissions` | sessão | → `{data, summary:{count}}` | 401 |
| `GET /submissions/{id}` | dono ou operador | → ficha | 401 → 404 · **o front não chama** |

### Conversas — `/api/conversations`, `/api/operator/conversations`

```
Conversa { id, userId, productId, status: 'open'|'closed', subject|null,
           originKind|null, originId|null, createdAt, updatedAt, messages?, messageCount? }
Mensagem { id, conversationId, authorUserId, role: 'customer'|'operator', body, createdAt }
```

| Rota | Quem | Comportamento |
| --- | --- | --- |
| `POST /api/conversations` | dono + entitlement no `productId` | `originKind`+`originId` juntos ou nenhum (422); origem Diagnóstico exige `productId` certo (422) e caso da conta (404). **Idempotente por origem**: existente → 200 `alreadyOpen: true`; nova → 201. Par de outra conta → 404 |
| `GET /api/conversations` | qualquer produto ativo | 403 `messaging requires an active product…`; sem mensagens |
| `GET /api/conversations/{id}` | dono ou operador | com mensagens; 404 |
| `POST /api/conversations/{id}/messages` | só o dono | 201; operador aqui → **403 com texto `operator access required`** (invertido); fechada → 409 |
| `GET /api/operator/conversations` | operador | só `open` |
| `GET /api/operator/conversations/{id}` | operador | qualquer status; 404 |
| `POST /api/operator/conversations/{id}/messages` | operador | 201 `role: operator`; 409 fechada |

**Nenhuma mensagem gera email.** A posse do `originId` só é checada
para o kind do Diagnóstico — outros kinds são aceitos opacos; quando
CLE/Solar entrarem, sem checagem uma conta pode ocupar o par de outra.

---

## 5 · Modelo de dados

Head **`0008_diagnostico_energetico`**, cadeia linear. Migração **não roda
no deploy** (`railway run py -3 -m alembic upgrade head`). 16 tabelas;
toda tabela de usuário tem `user_id → users.id ON DELETE CASCADE` — o
único apagamento que existe.

| Tabela | Guarda | Restrições | Nulo por decisão | Nulo por falta de dado |
| --- | --- | --- | --- | --- |
| `users` | conta | `email` UNIQUE minúsculo; `google_id` UNIQUE; CHECK senha ou google | `password_hash` | `google_id` (OAuth não shipou) |
| `product_access` | ativação | UNIQUE `(user_id, product_id)`; `product_id` validado na API, sem CHECK | — | — |
| `conta_luz_submission`, `solar_proposal_submission` | pedido + arquivos BYTEA | CHECK status; CHECK de máquina de estado (`ready` ⇔ todo `deliverable_*` presente e PDF) | `deliverable_*`, `delivered_at`, `customer_*` | — |
| `diagnostico_energetico_submission` | ficha | índice por usuário | `tariff_modality` ("não sei") | — |
| `conversation` | thread | CHECK status; CHECK par de origem; UNIQUE parcial `(origin_kind, origin_id)`; **sem FK em `origin_id`** | `subject`, origem | — |
| `message` | log append-only | CHECK role; corpo não vazio | — | — |
| `progress_event` | log imutável (verdade) | CHECK 5 tipos; `entity_id` opaco | `metadata` JSONB | — |
| `aula_status`, `badge_award`, `study_streak` | caches derivadas — o log vence | PKs compostas | datas de estado | — |
| `country_energy_profile` | OWID | UNIQUE `iso_code` | — | as 12 métricas |
| `country_energy_field_source` | unidade + citação | PK `field_name` | — | — |
| `generation_units`, `battery_assets`, `transmission_segments` | EIA/HIFLD, PostGIS | PK texto | — | `owner`, ids EIA, datas, `capacity_mwh`, `duration_hours`, `name` |

O backend não tem tabela de aula nem de módulo; currículo vive no front.

---

## 6 · Autenticação e sessão

1. **Signup** — email `strip().lower()`, 409 se existe (UNIQUE fecha a
   corrida), Argon2id, JWT, cookie, 201. `token` no corpo só com
   `X-Auth-Transport: bearer`.
2. **Login** — 401 idêntico para todo modo de falha; rehash transparente.
3. **JWT** — HS256, `iss: gridalpha`, `sub`, 30 dias. Stateless: logout só
   apaga o cookie.
4. **`get_current_user`** — Bearer vence cookie; por cookie, reemite em
   toda chamada.
5. **Front** — `AuthProvider` chama `me()` no mount; 401 = não logado. Sem
   guarda de rota genérica.
6. **`product_access`** — criado ao **entrar** no produto: as páginas
   Advisory e o `PerfilStub` fazem `myProducts()` e, se faltar,
   `activateProduct()`. O servidor exige a linha ao criar submissão e
   conversa.
7. **Operador** — igualdade de email com `ADVISORY_OPERATOR_EMAIL`, só no
   servidor (D6). O front não sabe quem é operador.

**Onde o `SameSite=lax` nasce:** `app/services/auth_service.py:63-66`
(env `SESSION_COOKIE_SAMESITE`, default `lax`), aplicado em `:145-155` e
`:158-166`. Cookie `ga_session`, `httpOnly`, `Secure`, host-only.

**Quem depende dele** (quebra se virar absoluto): o rewrite do
`vercel.json` e o proxy do `vite.config.ts`; `authApi`, `progressApi`,
`submissoes`, `diagnostico`, `conversas` (relativo + `credentials:
'include'`); os `downloadUrl` relativos do backend. Host-only também
separa a sessão de `nivar.com.br` da de `gridalpha.vercel.app`.

---

## 7 · Camada de cliente do frontend

### Por que três módulos Advisory

| | `lib/submissoes` (CLE, Solar) | `lib/diagnostico` | `lib/conversas` |
| --- | --- | --- | --- |
| Envio | `enviar(arquivo: File)` multipart | `enviarEscopo` JSON | `abrirConversa`, `enviarMensagem` JSON |
| Tipo | `Submissao` com `status`, `source` obrigatório, `deliverable`, `deliveredAt` | nenhum desses | `Conversa`, `Mensagem` |
| `summary` | `{count, submitted, ready}` | `{count}` | `{count}` |

Alargar `Submissao` tornaria `source`/`status` opcionais para todos —
enfraquecendo o que CLE e Solar leem. Escrito no próprio código
(`lib/diagnostico/api.ts:9-21`). `conversas` é domínio de plataforma,
não do Diagnóstico.

**O que compartilham sem dizer:** cinco embrulhos de `fetch` idênticos
(`authApi`, `progressApi`, `submissoes`, `diagnostico`, `conversas`), todos
lançando `AuthError` — inclusive para 413 de upload.

### Os clientes absolutos

| Cliente | Base | Estado em `nivar.com.br` |
| --- | --- | --- |
| `services/api/client.ts` + `batteries`, `generation`, `transmission`, `stream` | `BASE_URL` (`VITE_BACKEND_URL ?? railway`) | bloqueado por CORS |
| `lib/atlas/worldApi.ts` | `BASE_URL` | **quebrado** (§0) |
| `lib/backendBase.ts` → `peregrine/*`, `hooks/data/*`, `useNewsData` | absoluto em prod | bloqueado por CORS |
| `hooks/data/useLiveOpsData.ts` | `VITE_API_URL` → V1 | host não existe |

Dois resolvedores de base diferentes, e nenhum precisa existir desde que
o `vercel.json` reescreve `/api/*`.

**Dois "auth"**: `AuthContext` é identidade; `stores/authStore.ts` é o
arquétipo do terminal (`trader`, `analyst`…). Não se falam.

---

## 8 · Sistema de design em código

| Peça NIVAR | `src/` | Só no skill |
| --- | --- | --- |
| `base`, `colors`, `motion`, `space`, `typography` | byte-idênticos (sha256) | — |
| `fonts.css` | `@font-face` local (`7655a80`, Codex) | `@import` Google — **diverge**; `LEIA.md` desatualizado |
| Formulário | `components/nivar/campos.tsx`: `.nv-campo*` + `.nv-escolha*` (44 declarados); `CampoTexto`, `CampoSelect`, `Escolha`… | `.nv-acesso*`, `.nv-multi*`, `.nv-desl*` (B4) |
| Tabela, marca, patrono | `components/nivar/{tabela,marcas,patrono}.tsx` | — |
| Button, ModeToggle, MethodDisclosure | subconjunto verbatim em `components/br/portalChrome.tsx` | resto de `actions/`, `controls/` |
| `charts`, `editorial`, `errors`, `export`, `glossary`, `labels`, `loading`, `navigation`, `overlay`, `states`, `structure`, `mobile.css`, `guidelines/`, UI kit | **não existe** | só no skill |

Terceira cópia do sistema em `docs/Design/Carregamento NIVAR animado/_ds/`.

**Idioma de porte:** CSS de componente entra por demanda, verbatim, e
viaja num `<style>` dentro do componente (`EstilosCampos`), não como
folha global. **Modo noturno:** `useState` local por página →
`data-mode="noturno"` na raiz → `colors.css:55` remapeia. **Não persiste**
entre páginas nem visitas.

Alexandria: TS + inline; dois `TODO: confirmar com Aquiles`
(`alexandria-tokens.ts:144`, `:151`). Terminal: `tokens.ts` espelhado à
mão no `index.css`; `jaguar-tokens.ts` morto. O MCP `gridalpha-tokens`
indexa só o terminal.

---

## 9 · Build, scripts e gates

| Script | Faz |
| --- | --- |
| `dev` | Vite; proxy `/api` → `VITE_BACKEND_URL` ‖ `VITE_NEWS_API_URL` ‖ Railway |
| `build` | `tsc -b && vite build` |
| `lint` | `eslint .` (configs recomendadas; fora do build; baseline não medido nesta wave) |
| `preview` | serve `dist/` |
| `test:games` | `node --experimental-strip-types --test` em `modulo-08-{engine,fatos}` — **só o Módulo 8 tem teste** |

Sem script de backend, migração ou teste Python.

**`gridalpha-detect`** — `node tools/gridalpha-detect/bin/gridalpha-detect.mjs src`
(via `tsx`; exige `npm ci` em `tools/gridalpha-detect/`). Sai 1 com P0.
Auditor **do terminal** aplicado a `src/` inteiro:

| Regra | Sev. |
| --- | --- |
| `no-tailwind-on-layout`, `no-decorative-svg`, `no-inter-no-system`, `no-pure-black-white`, `no-gradient-text`, `no-easeOutBounce` | P0 |
| `require-tabular-nums`, `no-pill-chip-default`, `no-box-shadow-on-cards` | P1 |
| `equal-weight-grid` | P2 |

Nenhuma cobre raio, semáforo ou fronteira.

**Baseline medido:** `tsc -b` exit 0 · `test:games` 14/14 ·
`gridalpha-detect` 0 P0 / 0 P1 / 25 P2 · erros de Recharts em
`nest/student/*`: **não existem mais**.

---

## 10 · Débito técnico

**Morto:** `FaixaIndependencia.tsx`, `jaguar-tokens.ts`,
`useLiveOpsData.ts` (V1). **`DestinoCard.tsx`**: só o componente é morto;
o arquivo exporta `PlantaBaixa` (4 páginas). `SignupCredentialsPage.tsx`:
não roteado, vive por `ProgressDots`.

**Supressões:** `gridalpha-detect` 10 (1 `no-decorative-svg` na marca, 9
`equal-weight-grid`, todas com razão exceto `FamiliaPage.tsx:343`) ·
ESLint 18 (13 `exhaustive-deps`, 5 `no-console`) · 3 `@ts-ignore`, 32
`as any` · Python 13 `noqa` (registro de model no Alembic), 2
`type: ignore`.

**TODO que importa:** `LoginPage.tsx:22`, `SignupDetailsPage.tsx:834` —
plano Supabase/VPS anterior à Wave 9, obsoleto.

**Duplicação já madura para extrair:** `conta_luz_storage.py` +
`_download_headers` + `conta_luz_email.py` repetem o que
`advisory_files`/`advisory_email` extraíram (o Solar já usa, a CLE não);
`_require_entitlement` em quatro routers; os cinco embrulhos de `fetch`.

**A Alexandria ainda mostra progresso de mock** no hub (`TrilhasHub`,
`TrilhaCard`, `AlexandriaRouter` leem `alexandria-progress-mock.ts`).

### O que um refator quebraria sem perceber

1. Cliente relativo virando absoluto — derruba a sessão (§6). O inverso
   conserta os absolutos (§7).
2. **Code splitting** — devolve ao terminal `--text-muted` e `--radius`
   próprios (§2), e páginas NIVAR perdem o preflight que recebem de graça.
3. Remover `index.css` global ou Tailwind — mesmo efeito.
4. Inverter a ordem do `vercel.json`.
5. Renomear/mudar `ADVISORY_OPERATOR_EMAIL` — muda o operador; sem ela,
   submissão nova → 503.
6. Unificar os três modelos de submissão — os CHECK de estado não cabem
   no Diagnóstico.
7. Novo `originKind` em conversas sem checagem de posse.
8. Apagar `DestinoCard.tsx` — leva `PlantaBaixa`.
9. Migração nova esperando o deploy aplicar.
10. Mudar texto de `detail` — o front mostra o `detail` como mensagem.
11. Apagar "órfão" de `public/alexandria/` sem o LYCEUM.

---

## 11 · Armadilhas medidas

"L" = linha do `docs/registro-de-waves.md`.

| Armadilha | Sintoma | Resolve | Onde |
| --- | --- | --- | --- |
| `innerText` + `text-transform: uppercase` | asserção falha com produto certo | normalizar case, ou `textContent`/`aria-*` | L8836, L9134 |
| A/B por troca de arquivo sob o Vite | `does not provide an export named …` com o export no disco | reescrever o arquivo ou aba nova | ~L9869 |
| grep no transform do Vite | comentários somem no transform | procurar o valor | ~L6494 |
| `loading="lazy"` em container sem scroll | `naturalWidth` 0 para sempre | tirar `lazy`; `decoding="async"` | L1889 |
| Painel do Browser oculto / 0×0 | rAF a ~1 Hz, lazy não dispara | medir `innerWidth`/`visibilityState`; `playwright-core` no Chrome do sistema | L8472; repetiu nesta wave |
| `align-items: stretch` em grade | rótulo 13 → 32 px | `alignItems: 'start'` | L9977 |
| `scrollIntoView` smooth em scroller aninhado | rola 0 | `container.scrollTo` | L1703 |
| `tsc --noEmit` na raiz | não typecheca a app | `tsc -b` | `AGENTS.md` |
| StrictMode em dev | GET duplicado | contar POST | L3511 |
| Índice com fim de linha pendente | ~98 linhas "modificadas" | `git update-index --refresh` | L7758 |
| `readPixels` em WebGL | lê fora do render | ler a geometria | ~L6490 |
| `git worktree remove` | recusa com não rastreado | olhar antes do `--force` | `docs/worktrees.md` |
| grep casando comentário | falso import (nesta wave: `DestinoCard`, `blocosFamilia`) | buscar `from '…'` | esta wave |
| variável com caractere invisível | 503 com a variável visível | recriar digitando | estratégico, Parte III |
| CORS mascarado pelo preview | absoluto funciona em `*.vercel.app`, falha no domínio | testar com `Origin` do domínio real | §0 |
