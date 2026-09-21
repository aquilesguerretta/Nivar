# AGENTS.md — instrução permanente

Fonte única de instrução para qualquer agente que abra este repositório.
Curto de propósito: cada linha está aqui porque a ausência dela já custou
uma wave. Histórico de fechamento fica em `docs/registro-de-waves.md` —
lá é o que aconteceu, aqui é o que fazer.

## O produto

**NIVAR** — plataforma de inteligência energética, fundada solo por
Aquiles Guerretta. Três superfícies vivas:

- **Portal Brasil** (`/br`) — cinco famílias comerciais (Hardware,
  Academy, Software, Advisory, Intelligence), landing e páginas de
  família.
- **Alexandria** (`/alexandria`) — currículo de energia, 17 módulos, três
  trilhas, com Atlas Mundial 3D. Identidade visual PRÓPRIA (navy sobre
  pergaminho), separada do resto.
- **Produtos Advisory** — Conta de Luz Express, Solar Proposal Validator,
  Diagnóstico Energético. Fluxo de envio + parecer humano.
- **Terminal americano** (`/`, `/nest`) — mercado PJM. Superfície mais
  antiga, hoje uma entre várias, não o produto inteiro.

## Stack real

| Camada | O que é |
| --- | --- |
| Front | React 19 · TypeScript 5.9 · Vite 7 · react-router-dom 6 · Zustand 5 |
| Visual | Mapbox GL 3 · Three 0.183 · Recharts 3 · @react-pdf/renderer 4 |
| Back | FastAPI · SQLAlchemy 2 · Alembic · Postgres 17 + PostGIS 3.7 |
| Auth | Argon2id (`argon2-cffi`) · PyJWT · cookie `httpOnly` de sessão |
| Deploy | Front no Vercel (`nivar.com.br`) · Back no Railway |

**Topologia que importa:** front e back estão em hosts diferentes, e todo
cliente de API usa **caminho relativo** (`/api/...`). Isso é deliberado —
o cookie de sessão é `SameSite=lax` e não viaja cross-site. O `/api/*` é
reescrito para o Railway pelo `vercel.json` em produção e pelo
`server.proxy` do `vite.config.ts` em dev. Trocar para URL absoluta
derruba a sessão.

## Comandos que não são óbvios

```
npx tsc -b                                        # gate de tipo REAL
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src   # auditor de padrão
npm run build                                     # tsc -b && vite build
npm run test:games                                # testes dos jogos da Alexandria
```

- **`tsc -b`, nunca `tsc --noEmit`.** O `--noEmit` sobre o tsconfig raiz
  **não typecheca os arquivos da app** — já deixou bug passar por três
  fases achando estar limpo.
- **`gridalpha-detect`**: P0 bloqueia, P1/P2 são informativos. Linha de
  base da árvore hoje: **0 P0 / 27 P2**. Supressão de linha exige `//`
  literal no texto cru da linha anterior — em JSX,
  `{/* // gridalpha-detect-disable-next-line <regra> — razão */}`.
- **`.husky/pre-commit` existe mas NÃO está instalado** (não há
  `.git/hooks/pre-commit` nem script `prepare`). Rode o auditor à mão; não
  conte com o hook.

## Fronteiras de posse

Todo brief declara três listas — **CRIAR/MODIFICAR**, **SOMENTE LEITURA**,
**NUNCA MODIFICAR**. Isso não é organização: é prevenção de conflito de
merge real, porque várias sessões rodam em paralelo na mesma árvore.
Nenhum agente escreve fora da própria posse sem confirmar que o
território está livre.

**Ativos hoje:**

| Agente | Posse |
| --- | --- |
| **ARCHITECT** | Roteamento (`src/main.tsx`), shell e superfície do Portal BR, `/conta`, produtos Advisory no front, config de raiz (`vercel.json`, este arquivo) |
| **LYCEUM** | Alexandria inteira — shell, tokens, navegação, viewer, glossário, perfil, Atlas Mundial |
| **CURSOR** | Backend inteiro (`app/`), ingestão de dado real, identidade, migrations. Roda no IDE Cursor, não em janela de Claude Code |
| **FOUNDRY** | Tipo compartilhado (`src/lib/types/`), mock (`src/lib/mock/`), primitivo de design, skills |

**Herdados, sem atividade recente:** TERMINAL (Nests por perfil), ATLAS
(Grid Atlas americano, Analytics, Vault), CHROMA (auditor), CONDUIT
(saved views, export), ORACLE (IA), FORGE (features analíticas), SCRIBE
(currículo legado do Vault — **nunca autor**).

**Fronteira dura:** `app/` é do CURSOR. Front nunca edita backend, e
backend nunca edita `src/`.

## Disciplina de git

- Trabalho só em `feature/full-shell-buildout` — a única exceção é a
  branch `wave/<assunto>` de vida curta em worktree (abaixo). **Nunca
  push para `main`.** Sem PR.
- **Nunca `git add -A` nem `git add .`** — sempre caminho explícito. Já
  houve commit carregando trabalho não commitado de sessão paralela sob a
  mensagem errada (`f955e62`).
- **`git diff --cached --stat` antes de cada commit**, conferindo que
  nada de outro agente entrou.
- `git commit <caminho>` captura o estado do arquivo **no instante do
  commit**, não o que você verificou minutos antes. Com sessão paralela
  no mesmo arquivo, a janela entre verificar e commitar é onde o trabalho
  alheio entra.
- Prefixo `<agente>: <assunto>` (ex.: `architect:`).
- `git pull --rebase` no início da sessão. Se houver mudança não commitada
  de outra sessão na árvore, use `git fetch` + `git rev-list
  --left-right --count` em vez de stashar trabalho alheio.
- `.claude/launch.json` carrega entradas de várias sessões — **não
  commite**.

## Worktree por wave concorrente

Duas waves ao mesmo tempo na mesma árvore compartilham o index, e é assim
que commit de uma sessão carrega trabalho da outra. Worktree dá a cada
wave HEAD e index próprios sobre o mesmo repositório. O eixo é **wave
concorrente, não ferramenta** — duas janelas do mesmo agente colidem
igual.

- Pasta `C:\dev\gridalpha-v2-<assunto>`, branch `wave/<assunto>`.
  **Prefixo de branch nunca leva nome de agente** (`cursor`,
  `architect`, `lyceum` são agentes, não branches).
- **Branch de worktree tem vida curta**: nasce na abertura da wave, morre
  no fechamento. `feature/full-shell-buildout` segue sendo a fonte da
  verdade o tempo todo.
- **A fase de fechamento de toda wave feita em worktree termina com
  rebase, merge `--ff-only`, branch apagada e worktree removido.** Wave
  fechada não deixa branch nem pasta pendurada.
- Sessão única sem concorrência **não** justifica worktree: custa ~1 GB e
  um `npm ci`.

Comando, checklist do que copiar à mão e armadilhas medidas em
`docs/worktrees.md`.

## Disciplina de verificação

- **Verificação é por clique real, nunca por inspeção de código.** Tag
  presente não prova imagem carregada — `naturalWidth > 0` prova.
- **Meça no render, não na leitura.** Vários defeitos desta trilha só
  apareceram medindo o estilo computado: textura que nunca renderizou,
  altura de rótulo inflada por `align-items: stretch`, `loading="lazy"`
  que nunca dispara em container sem scroll.
- **Falha de verificação investigada até a causa quase sempre é defeito
  do harness, não do produto.** Aconteceu sete vezes. Antes de reportar
  regressão, confirme que a asserção mede o que você pensa.
- **Normalize case ao comparar contra `innerText`.** Rótulo com
  `text-transform: uppercase` volta em caixa alta e derruba comparação
  case-sensitive. Prefira `getAttribute`, `aria-*` ou `textContent` de um
  nó conhecido.
- **Meça `window.innerWidth` antes de confiar em qualquer medida de
  layout.** O painel Browser às vezes nasce 0×0 ou oculto — e aba oculta
  estrangula `requestAnimationFrame` e `setTimeout` a ~1 Hz, o que torna
  estado de sub-segundo invisível à amostragem.
- Dois modos (claro/noturno) e pelo menos dois viewports antes de fechar
  qualquer superfície visual.

## Fontes de verdade

- **EIA Form 860/860M** — geração americana. **HIFLD** — transmissão
  americana.
- **Our World in Data** — perfil energético mundial, 188 países, fonte
  citada por campo.
- **ONS, ANEEL, CCEE, EPE** — fontes primárias brasileiras.
- **Natural Earth (TopoJSON)** — toda fronteira geográfica. **Nunca
  gerada por IA de imagem.**
- **HTML original dos módulos** — única fonte de aula, exercício e
  instrumento da Alexandria. Protocolo completo em
  `docs/alexandria/extraction-protocol.md`.
- **Contrato de backend** — `docs/v2-backend-contract.md`. Leia o router
  real antes de chamar; nunca aproxime contrato de memória.

**Onde não existe fonte confiável, o sistema inteiro usa a mesma
linguagem:** `null`, `'confirmar'`, "sem dado disponível", "conteúdo em
produção". **Ausência se declara, nunca se preenche por plausibilidade.**

## Sistema de design

Dois sistemas, que nunca se importam:

- **NIVAR** (`src/design/nivar/`, skill `NIVAR Design System`) — Portal
  BR, `/conta`, produtos Advisory. Papel/tinta, dois modos por
  `data-mode="noturno"`, escala de incandescência (hardware → academy →
  software → advisory → intelligence).
- **Alexandria** (`src/design/alexandria-tokens.ts`) — navy sobre
  pergaminho, Cinzel + Lora. Só a Alexandria.
- **Terminal** (`src/design/tokens.ts`, skill `gridalpha-terminal`) —
  superfície americana. Geist Mono travado em dado e rótulo.

Invariantes que valem nos três: **raio zero** (exceto círculo pleno),
**zero `box-shadow`** — profundidade vem de fio de 1px —, **zero
semáforo** (nada de vermelho/verde para estado), densidade de 40–60
elementos por tela. Sem Tailwind em elemento crítico de layout: estilo
inline com token, enforced por `no-tailwind-on-layout` (P0).

## Protocolo de incerteza

Três classes:

1. **Resolve local** — ambiguidade pequena, dentro da posse, resolvida
   com julgamento e documentada no relatório.
2. **Registra e continua** — real mas não bloqueante: sinaliza, o
   trabalho segue.
3. **Para e reporta** — toca arquivo fora da posse, fonte conflita,
   contagem não reconcilia depois da segunda checagem, mudança de tipo
   compartilhado necessária, sinal de regressão em produto fechado, ou
   instrução do brief que contradiz o estado real medido na Fase 1.

Em qualquer dos três: **o que foi medido vale mais que o que o brief
presumia.** Brief que contradiz medição é premissa a corrigir, não ordem
a cumprir — reporte a divergência com a medição ao lado.
