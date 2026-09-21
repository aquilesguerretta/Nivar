# ARCHITECT — TOPOLOGIA DE SHELL WAVE 1

Auditoria de reconhecimento. **Zero edição de código** — o único arquivo
escrito por esta wave é este relatório. Todo caminho citado foi
confirmado contra o disco antes de ser nomeado.

**Objetivo:** achar o ponto exato onde o Terminal US pode sair da
navegação sem tocar seus internals e sem deletar código, para que a wave
de execução não precise presumir caminho nenhum.

---

## Nota preliminar — a numeração N, resolvida contra o CLAUDE.md

O brief instrui: "procure a última `ARCHITECT WAVE` fechada — esse
número +1 é o N desta wave", com a alternativa "se ARCHITECT nunca
fechou wave nenhuma, essa é a primeira".

**Nenhum dos dois casos se aplica, e reporto em vez de escolher em
silêncio.** A string literal `ARCHITECT WAVE` aparece **zero vezes** no
CLAUDE.md — mas ARCHITECT fechou **cinco** waves, todas namespaçadas por
trilha:

| linha do CLAUDE.md | seção |
| --- | --- |
| 631 | `ARCHITECT — PORTAL BR WAVE 1` |
| 980 | `ARCHITECT — PORTAL BR WAVE 2 · JAGUAR` |
| 1225 | `ARCHITECT — PORTAL BR WAVE 3 · HERO IMERSIVO E RODAPÉ` |
| 1417 | `ARCHITECT — PORTAL BR WAVE 4 · AUDITORIA LIVRE` |
| 3184 | `ARCHITECT — IDENTIDADE DE PLATAFORMA WAVE 1` |

São **duas sequências concorrentes** — Portal BR em 4, Identidade em 1 —
e não existe um contador único de onde tirar "+1". O assunto desta wave
(topologia entre Terminal US, Portal e Alexandria) não pertence a
nenhuma das duas: não é Portal BR e não é Identidade.

**Resolução adotada:** trilha nova, `TOPOLOGIA DE SHELL`, wave **1** —
seguindo a convenção que o próprio repositório já usa para ARCHITECT.
Se o war room preferir um contador único de ARCHITECT, a renumeração é
uma linha neste cabeçalho.

### Estado do repositório na abertura

`git pull --rebase origin feature/full-shell-buildout` **recusou** por
haver mudança não commitada de sessão paralela (a seção `CURSOR WAVE 12`
em `CLAUDE.md` e portas de dev em `.claude/launch.json`). Nada foi
stashado nem sobrescrito. O pull era **no-op**, verificado em vez de
presumido:

```
git rev-parse HEAD                              → 8fe158f
git rev-parse origin/feature/full-shell-buildout → 8fe158f
git log HEAD..origin/…                          → (vazio)
git log origin/…..HEAD                          → (vazio)
```

Local e remoto no mesmo commit; não havia o que puxar.

### Auditoria paralela relacionada, lida antes de duplicar

`docs/atlas-alexandria-migration-audit.md` (commits `889e7c3`, `9852777`,
`e0e56a6`, `c432097`) auditou posse do shell **interno da Alexandria** —
`AlexandriaRouter.tsx`, `TrilhasHub.tsx`, `CaminhoExpedicao.tsx`,
`AlexandriaHome.tsx`, mais `AlexandriaHeader.tsx` / `AlexandriaFooter.tsx`.
Concluiu: os seis são posse **LYCEUM**.

Aquela auditoria cobre a camada **dentro** de `/alexandria/*`. Esta cobre
a camada **acima**, onde Terminal US, Portal e Alexandria são irmãos.
Não há sobreposição de arquivo entre as duas, e o método é o mesmo
(`git log --all --diff-filter=A`).

---

## Fase 1 — a raiz real

### A hipótese do brief está metade certa

O brief registra `GlobalShell.tsx` como "raiz da aplicação", vindo do
relatório de abril/2026, e pede para tratar isso como hipótese.
**Medido: o arquivo existe, continua sendo o shell do Terminal US, e
NÃO é a raiz da aplicação.**

A cadeia real, do HTML para dentro:

| passo | evidência no disco |
| --- | --- |
| `index.html:17` | `<script type="module" src="/src/main.tsx">` |
| `src/main.tsx` | **95 linhas.** Cria o root React, monta `BrowserRouter` → `AuthProvider` → a tabela de rotas inteira |
| `src/components/GlobalShell.tsx` | **1.876 linhas.** Componente de view, `export default function GlobalShell({ initialView = 'nest' })` (L1716) |

`GlobalShell` é **montado por rota, com prop** — não envolve a árvore.
`main.tsx` importa (L6) e o monta em nove rotas passando
`initialView`. Ele é irmão de `LandingPage`, `PortalBR` e
`AlexandriaHome` na mesma tabela, não pai de nenhum.

**A raiz real é `src/main.tsx`.**

### Posse — a pergunta que `--diff-filter=A` não responde aqui

| arquivo | commit de criação | prefixo |
| --- | --- | --- |
| `src/main.tsx` | `586fbe4` · `phase-1: infrastructure, mapbox config, SSE scaffold, zustand store` | **nenhum** |
| `src/components/GlobalShell.tsx` | `a9fdb70` · `feat: GridAlpha V2 shell integration complete` | **nenhum** |
| `src/components/LandingPage.tsx` | `27f1ffa` · `feat: GridAlpha auth flow + landing port` | **nenhum** |
| `src/pages/br/PortalBR.tsx` | `0ad40e5` · `architect: portal br routes` | **architect** |
| `src/pages/alexandria/AlexandriaHome.tsx` | `1df0c84` · `lyceum: alexandria wave 2 route and visual verification` | **lyceum** |

**Os três arquivos mais antigos precedem a convenção de prefixo por
agente — não há prefixo a ler neles.** A criação, sozinha, não decide
posse aqui; foi preciso medir quem de fato escreve.

`src/main.tsx` — **13 commits em toda a história**, na ordem do mais
recente para o mais antigo:

| commit | agente |
| --- | --- |
| `f8a355e` identidade wave 1 conta antes do arquetipo | **architect** |
| `f90019a` identidade wave 1 perfil de plataforma | **architect** |
| `e1a0b51` identidade wave 1 entrar e criar conta | **architect** |
| `22d3771` identidade wave 1 auth context | **architect** |
| `821d0ff` alexandria wave 3 internal routing | lyceum |
| `0ad40e5` portal br routes | **architect** |
| `1df0c84` alexandria wave 2 route and visual verification | lyceum |
| `5cf7617` entry routing · `91ec85a` lesson routing | scribe |
| `dfbcae8` extend shell — Peregrine top-level, Vault sub-routes | arch |
| `27f1ffa` · `a9fdb70` · `586fbe4` | pré-convenção |

**Posse de fato: ARCHITECT.** Cinco dos treze commits são `architect:`
(mais um `arch:`, a abreviação antiga), incluindo os quatro mais
recentes e toda a mudança estrutural. Os demais agentes tocam o arquivo
cirurgicamente — uma linha de rota quando entregam um destino próprio
(LYCEUM ×2 para Alexandria, SCRIBE ×2 para lição/entrada). Isso bate com
o roster do CLAUDE.md L50, que declara `src/main.tsx` a ARCHITECT — mas
agora está confirmado por histórico, não só por declaração.

`src/components/GlobalShell.tsx` — **53 commits**, último em
**2026-05-12** (`548d8af` · `chroma: wave 5.1 pure-neutral remediation`).
Os últimos a tocá-lo foram CHROMA, CONDUIT e `arch:`. Está **estático há
cerca de três meses**, enquanto `main.tsx` foi mexido em 2026-07-29 e
`PortalBR.tsx` no mesmo dia. O produto andou para Portal e Alexandria; o
shell americano ficou onde estava.

### Nenhum outro ponto de montagem

Varredura por `GlobalShell` em todo o `src/`: o componente é importado
como default **por um único arquivo**, `src/main.tsx:6`. Não há segundo
ponto de montagem, nem lazy import, nem re-export que o monte.

**Uma dependência lateral, que importa para a wave de execução:**
`src/components/AnalyticsPage.tsx:8` faz
`import { PeregrineFeedMarketAlerts } from './GlobalShell'`. É import de
**export nomeado**, não montagem. Consequência prática: **ocultar o
Terminal US da navegação é seguro; deletar `GlobalShell.tsx` não é** —
quebraria `AnalyticsPage`. Como a decisão do Aquiles é exatamente
"código fica no disco, some da navegação", isso não bloqueia nada — mas
fecha a porta para qualquer wave futura que confunda ocultar com remover.

---

## Fase 2 — a navegação de nível superior

### Os três produtos NÃO são irmãos na navegação

A pergunta do brief é se Terminal US, Portal e Alexandria aparecem hoje
como irmãos. **Não aparecem.** São irmãos apenas na TABELA DE ROTAS de
`src/main.tsx`; na navegação visível, a relação é assimétrica:

| de → para | existe? | onde |
| --- | --- | --- |
| Portal BR → Alexandria | **sim** | `src/lib/data/br-destinos.ts:36` — `rota: '/alexandria?trilha=brasil'`, único destino com `status: 'disponivel'` |
| Portal BR → Terminal US | **sim, ×2** | `src/components/br/SeletorMercado.tsx:30` (cabeçalho) e `src/pages/br/PortalBR.tsx:460` (rodapé, coluna "Mercados") |
| Alexandria → Portal BR | **não** | varredura em `src/components/alexandria/shell/` e `src/pages/alexandria/`: zero link para fora de `/alexandria` |
| Alexandria → Terminal US | **não** | idem |
| Terminal US → Portal BR | **não** | zero ocorrência de `/br` em `src/components/landing/` ou `GlobalShell.tsx` |
| Terminal US → Alexandria | **não** (produto atual) | `GlobalShell` tem rotas `/vault/alexandria*`, que são a **Alexandria LEGADA dentro do Vault** — outro artefato, não o produto em `/alexandria` |

**O Portal Brasil é o único nó que conhece os outros dois.** Alexandria
e Terminal US não sabem que o Portal existe.

### As cinco portas de entrada do Terminal US

"Terminal US" tem duas camadas distintas, e a distinção decide onde a
remoção se aplica:

- **superfície de marketing** — `LandingPage`, em `/` e no catch-all `*`
- **aplicação de terminal** — `GlobalShell`, em `/nest`, `/atlas`,
  `/peregrine`, `/analytics`, `/vault` (+ 4 sub-rotas de vault)

Todo caminho que um usuário pode percorrer até uma das duas:

| # | porta | arquivo · linha | chega em |
| --- | --- | --- | --- |
| 1 | Rota raiz `/` | `src/main.tsx:32` | `LandingPage` |
| 2 | Catch-all `*` | `src/main.tsx:90` | `LandingPage` |
| 3 | Seletor de mercado do Portal | `src/components/br/SeletorMercado.tsx:30` → `/us` → `src/main.tsx:88` | `LandingPage` |
| 4 | Rodapé do Portal, coluna "Mercados" | `src/pages/br/PortalBR.tsx:460` → `/us` → `src/main.tsx:88` | `LandingPage` |
| 5 | Funil de arquétipo | `landing/Nav.tsx:101` e `landing/FinalCta.tsx:55` → `/signup` → `SignupGate` → `/signup/profile` → `/details` → `/success` → `SignupSuccessPage.tsx:95` `navigate('/nest')` | `GlobalShell` |

Mais duas portas que **não** contam como navegação de usuário, medidas e
descartadas:

- `src/pages/auth/LoginPage.tsx:23` navega para `/nest`, mas `/login` já
  não é alcançável por header nenhum — o próprio comentário de
  `main.tsx:43-46` registra que a rota fica de pé só para não quebrar
  link antigo.
- `src/components/dev/ProfileSwitcher.tsx` lista as cinco views com seus
  paths, mas é renderizado atrás de `import.meta.env.DEV`
  (`GlobalShell.tsx:1873`) — não existe em produção.

E uma superfície que **nomeia sem navegar**: `/conta`
(`src/pages/conta/PerfilPlataforma.tsx`) lista o catálogo de produtos
vindo do BACKEND, que inclui `us-terminal`, rotulado "Terminal Estados
Unidos" por `TITULO_EXTRA` (L38). Mas o link "Abrir" só renderiza quando
`destino?.status === 'disponivel'` (L220), e `us-terminal` **não existe
em `DESTINOS_BR`** — então `rota` é `null` e nenhum link é desenhado. O
produto aparece na lista com "Não ativado" e nada mais.

### Correção à hipótese do relatório de abril: são CINCO botões, não quatro

`src/components/GlobalShell.tsx:76` — `const navItems: NavItem[]`:

| code | id | label |
| --- | --- | --- |
| 01 | `nest` | THE NEST |
| 02 | `atlas` | GRID ATLAS |
| 03 | `peregrine` | **PEREGRINE** |
| 04 | `analytics` | ANALYTICS |
| 05 | `vault` | VAULT |

O relatório de abril registra quatro (Nest, Grid Atlas, Analytics,
Vault). **PEREGRINE entrou depois**, no commit `dfbcae8` · `arch: extend
shell — Peregrine top-level, Vault sub-routes, profile-routed Nest,
EveryoneNest extraction` — o mesmo commit que criou as sub-rotas de
Vault. Essa nav é **interna ao GlobalShell**: só aparece depois que o
usuário já está dentro do terminal, e nenhuma outra superfície do
produto a lê.

### O ponto exato de remoção

**`src/main.tsx` — a tabela de rotas, 95 linhas, posse ARCHITECT
confirmada na Fase 1.**

É o único arquivo que mapeia todas as cinco portas: as duas primeiras
são linhas dele (`:32` e `:90`), a terceira e a quarta passam
obrigatoriamente por `:88`, e a quinta entra pelas rotas de `:47-53` e
sai por `:65-76`. **Nenhuma outra edição é necessária para tirar o
Terminal US de vista**, e nenhum internals precisa ser tocado.

A mudança é de **redirecionamento, não de deleção**: os `import` de
`GlobalShell`, `LandingPage` e das telas de arquétipo continuam; os
arquivos continuam no disco; `GlobalShell.tsx` continua compilando. Isso
atende literalmente a decisão do Aquiles — "código fica no disco, some
da navegação".

**Por que a remoção NÃO pode ser só nos dois links do Portal:** tirar
`SeletorMercado.tsx:30` e `PortalBR.tsx:460` deixa `/` e o catch-all `*`
servindo `LandingPage`. Qualquer pessoa que digite o domínio sem caminho
— ou erre qualquer URL — cai no produto americano. A remoção pelos links
é insuficiente por construção; ela tem que passar pela tabela de rotas.

**Por que NÃO se pode deletar `GlobalShell.tsx`:**
`src/components/AnalyticsPage.tsx:8` faz
`import { PeregrineFeedMarketAlerts } from './GlobalShell'` — import de
export nomeado, não montagem. Ocultar é seguro; deletar quebra o build.
Fica registrado para que nenhuma wave futura confunda as duas coisas.

### Efeito de segunda ordem que a wave de execução precisa decidir

Se `/` passar a servir o Portal, a rota `/us` (`main.tsx:88`,
`<Navigate to="/" replace />`) passa a devolver o usuário **ao próprio
Portal**. As duas entradas de "Estados Unidos" viram no-op silencioso:
o usuário clica e continua onde estava.

Isso não é defeito do plano — é uma decisão de produto que o plano
expõe. Três saídas possíveis, todas fora do escopo desta auditoria:
esconder a opção "Estados Unidos" do `SeletorMercado` e do rodapé;
mantê-la apontando para um estado "em breve" explícito; ou dar ao
mercado US uma página própria. **A auditoria não escolhe** — só registra
que a escolha é obrigatória e que ela vive em dois arquivos nomeados
acima, não em `main.tsx`.

---

## Fase 3 — síntese e brief de execução

### As três respostas, em uma tela

| pergunta | resposta | evidência |
| --- | --- | --- |
| **Raiz real** | `src/main.tsx` — 95 linhas, cria o root React e detém a tabela de rotas inteira. **`GlobalShell.tsx` NÃO é a raiz**: é um componente de view montado por 9 rotas com prop `initialView` | `index.html:17` · `main.tsx:6,65-76` · `GlobalShell.tsx:1716` |
| **Dono confirmado** | **ARCHITECT**, por histórico e não só por declaração: 5 dos 13 commits de `main.tsx` são `architect:` (+1 `arch:`), incluindo os 4 mais recentes e toda mudança estrutural | `git log --all -- src/main.tsx` |
| **Ponto exato de remoção** | **`src/main.tsx`**, a tabela de rotas. É o único arquivo por onde passam as cinco portas de entrada do Terminal US | Fase 2, tabela das cinco portas |

### O subtree do Terminal US é autocontido — medido, não presumido

Nenhum arquivo fora do Terminal US navega para dentro dele, e as
dependências internas não vazam:

| dependência | onde vive | veredito |
| --- | --- | --- |
| `AnalyticsPage` importa `PeregrineFeedMarketAlerts` de `GlobalShell` | `AnalyticsPage.tsx:8` | contido — `AnalyticsPage` só é montado por `GlobalShell.tsx:1782` |
| `AIAssistant` linka `/vault/alexandria/entry/:slug` | `shared/AIAssistant.tsx:755` | contido — apesar de morar em `shared/`, é montado **só** por `GlobalShell.tsx:1870-1871` |
| Componentes de `src/components/vault/*` linkam entre si | `Alexandria.tsx`, `Entry.tsx`, `CaseStudyView.tsx`, `CrossLinkResolver.tsx` | contido — todos vivem sob a view `vault` do `GlobalShell` |
| `LoginPage` e `SignupSuccessPage` navegam para `/nest` | `LoginPage.tsx:23`, `SignupSuccessPage.tsx:95` | pertencem ao próprio funil americano |

**Consequência:** ocultar as rotas em `main.tsx` não deixa link órfão em
nenhuma superfície viva. Portal e Alexandria não apontam para dentro do
Terminal US em ponto nenhum.

### O brief de execução

Este documento é o brief; a execução é de outra wave. O que ela deve
fazer, e o que ela não deve:

**Arquivo único a editar: `src/main.tsx`.**

| linha atual | o que ela faz hoje | ação recomendada |
| --- | --- | --- |
| `:32` `<Route path="/" element={<LandingPage />} />` | raiz serve o marketing americano | repontar para a superfície brasileira |
| `:90` `<Route path="*" element={<LandingPage />} />` | catch-all serve o marketing americano | idem — **é esta que faz a remoção só-por-link ser insuficiente** |
| `:47-53` bloco `AuthLayout` (`/login`, `/signup`, `/signup/*`) | funil de arquétipo, termina em `/nest` | redirecionar ou remover da tabela |
| `:65-76` as 9 rotas de `GlobalShell` | as cinco views + 4 sub-rotas de vault | redirecionar |
| `:88` `/us` → `<Navigate to="/" replace />` | alias do mercado americano | ver "decisão obrigatória" abaixo |

**Forma da mudança: redirecionamento, nunca deleção.** Os `import` de
`GlobalShell`, `LandingPage` e das telas de arquétipo permanecem; os
arquivos permanecem no disco; `GlobalShell.tsx` continua compilando.
É literalmente a decisão registrada — "código fica no disco, some da
navegação".

**O que NÃO fazer:**

- **Não deletar `GlobalShell.tsx`** — `AnalyticsPage.tsx:8` importa um
  export nomeado dele. Quebra o build.
- **Não editar `SeletorMercado.tsx` nem `PortalBR.tsx` achando que
  resolve** — `/` e `*` continuariam servindo `LandingPage`.
- **Não tocar `src/components/GlobalShell.tsx` nem nada sob
  `src/components/vault/`, `src/components/landing/`,
  `src/components/nest/`** — são os internals que a decisão manda
  preservar.

**Verificação sugerida para a wave de execução**, nesta ordem: `/`
serve Portal · uma URL inexistente serve Portal, não a landing ·
`/nest`, `/atlas`, `/peregrine`, `/analytics`, `/vault` não abrem o
terminal · `npx tsc -b` sem erro novo (os 7 pré-existentes de Recharts
em `nest/student/*` permanecem) · `/alexandria` e `/conta` intactos.

### A decisão obrigatória que a auditoria não toma

Se `/` passar a servir o Portal, a rota `/us` (`main.tsx:88`) devolve o
usuário **ao próprio Portal**, e as duas entradas de "Estados Unidos"
— `SeletorMercado.tsx:30` e `PortalBR.tsx:460` — viram no-op silencioso.

Três saídas, todas de produto e nenhuma desta auditoria: esconder a
opção do seletor e do rodapé; mantê-la apontando para um estado "em
breve" declarado; ou dar ao mercado US página própria. **A escolha vive
nesses dois arquivos, não em `main.tsx`** — e é o único trabalho fora da
raiz que a execução vai precisar.

### Registrado, não resolvido

- **A hipótese dos quatro botões estava desatualizada** — são cinco
  (`GlobalShell.tsx:76`), com PEREGRINE acrescentado em `dfbcae8`.
  Qualquer documento futuro que cite "os quatro" está lendo abril/2026.
- **`us-terminal` está no catálogo do BACKEND** (CURSOR Wave 9) e
  aparece nomeado em `/conta` sem link. Se o produto americano sair de
  vista por completo, alguém precisa decidir se o catálogo do backend
  continua anunciando-o — isso é mudança de servidor, fora do frontend.
- **`GlobalShell.tsx` está estático desde 2026-05-12.** A
  reestruturação americana que o Aquiles adiou vai encontrar 1.876
  linhas que não acompanharam três meses de evolução do resto do
  produto.
