# Portal do Operador — recon de frontend

**Wave:** ARCHITECT — Portal do Operador Wave 1. **N confirmado:**
`docs/registro-de-waves.md` não tem nenhuma seção `OPERADOR`; a única
ocorrência da palavra em contexto de produto é uma pendência da
Diagnóstico Energético Wave 3 (linha 10188: *"O lado do operador não pôde
ser exercitado ponta a ponta"*). Trilha nova, Wave 1.

**Escopo:** recon. **Zero código escrito, zero componente novo.** Único
arquivo criado é este.

**Worktree:** `C:\dev\gridalpha-v2-operador-frontend`, branch
`wave/operador-frontend`, aberta de `feature/full-shell-buildout` em
`c340459`. A recon CURSOR do mesmo produto roda em
`C:\dev\gridalpha-v2-operador-backend` (`wave/operador-backend`, mesmo
commit) — zero arquivo em comum, confirmado por `git worktree list`.

**`npm ci` não foi rodado neste worktree, de propósito.** Nenhum gate
desta wave precisa dele: não há código a typechecar (`tsc -b` rodaria
sobre árvore idêntica à do pai) nem superfície a renderizar. O guia
(`docs/worktrees.md`) manda copiar `.env.local` e rodar `npm ci` para
worktree que vai *construir*; ~1 GB por uma wave só de leitura é preço
sem contrapartida. A wave de build precisará dos dois.

**Método:** varredura de `src/` por import, por seletor CSS, por
elemento e por rota; leitura dos candidatos a precedente; leitura de
`.claude/skills/NIVAR Design System/` como referência de sistema (não é
código de produção); leitura de `docs/` para recons anteriores desta
mesma superfície. **`app/` não foi aberto** — território CURSOR, e a
recon paralela dela cobre esse lado.

---

## Veredito curto

| Hipótese | Achado |
| --- | --- |
| H1 · Shell, roteamento e gate de `/operador` | **Rota entra sem atrito; o gate NÃO existe e não pode ser construído no frontend.** O padrão de gate por sessão é uniforme nos três produtos, mas `PlatformUser` **não tem papel** — nem no tipo, nem no contrato. Verificação de operador é campo que a CURSOR precisa criar. |
| H2 · `field.css` portado | **Confirmado, e a contagem bate: 44 de 89.** Mas não é arquivo `.css` — é CSS injetado em `src/components/nivar/campos.tsx`. Cobre formulário; **não cobre nada do que um console pede**. |
| H3 · Precedente de lista/tabela densa | **Existe no sistema, e é excelente. Não existe em `src/`.** O NIVAR tem tabela, ordenação, linha expansível, zebra, paginação, densidade e busca — 104 blocos em `data.css`, zero portados. `PublicationList` + `Collapsible` é forma **parcialmente errada** para fila operacional. |
| H4 · Visualizador de documento | **Não existe — e já foi medido em detalhe.** `docs/conta-luz-express-recon-marcacao-frontend.md` (CLE Wave 4) é uma recon inteira sobre exatamente esta peça. **É grande demais para caber junto com o resto. Ver §4.4.** |
| H5 · Identidade visual | **A doutrina vale igual — e o próprio sistema já traz a alavanca de densidade.** Ferramenta interna não é exceção de estilo; é o caso de uso para o qual o NIVAR já tem `DensityToggle`. Leitura, não decisão. |

**Achado fora das hipóteses que mais pesa:** os três produtos Advisory
**não compartilham vocabulário de estado**. CLE e Solar têm
`'submitted' | 'ready'`; Diagnóstico Energético **não tem campo `status`
nenhum**. Não existe conceito de "em análise", "atribuído" ou
"devolvido". A fila do console não tem estados para exibir hoje — §6.1.

---

## 1. H1 — shell, roteamento e o gate de `/operador`

### 1.1 Onde `/operador` entra

`src/main.tsx` (178 linhas) é um `<Routes>` plano dentro de
`<AuthProvider>` (linha 35), que envolve a árvore inteira. Uma rota nova
de topo é uma linha, e há dois precedentes de forma:

- **Rota rasa**, o que os três produtos Advisory usam —
  `main.tsx:124`, `:131`, `:139`.
- **Splat com router próprio**, o que Portal BR e Alexandria usam —
  `main.tsx:116` (`/alexandria/*`) e `:160` (`/br/*`).
  `src/pages/br/PortalBRRouter.tsx:31-38` é o modelo exato: `<Routes>`
  com `<Route index>`, uma rota paramétrica (`familia/:familiaId`) e
  `<Route path="*" element={<NotFound />} />`.

**Leitura:** o console é navegação por família → produto → fila →
pedido. Isso é hierarquia de URL, não estado em store. `/operador/*` com
router próprio é a forma que o repo já tem, e o `PortalBRRouter` é o
gabarito literal — 38 linhas.

`main.tsx:173` já tem catch-all real (`NotFound`, Portal Debt Wave 1),
então endereço errado dentro de `/operador` cai certo sem trabalho novo.

### 1.2 O gate por sessão existe, e é uniforme

Padrão idêntico, verbatim, nos três produtos e no perfil:

| Arquivo | Linha |
| --- | --- |
| `src/pages/conta-de-luz-express/ContaDeLuzExpressPage.tsx` | 307-308 |
| `src/pages/solar-proposal-validator/SolarProposalValidatorPage.tsx` | 289-290 |
| `src/pages/diagnostico-energetico/DiagnosticoEnergeticoPage.tsx` | 324-325 |
| `src/pages/conta/PerfilPlataforma.tsx` | 167, 176 |

```
const { user, loading } = useAuth();
if (!loading && !user) {
  return <Navigate to="/entrar" replace state={{ de: location.pathname }} />;
}
```

O detalhe que importa, e está comentado nos três: **`loading` é
verificado antes**, para que ninguém conclua "não logado" enquanto o
`GET /api/auth/me` ainda não respondeu. O gate mora **no componente**,
não numa rota-guarda — não existe `<RotaProtegida>` no repo. Serve para
`/operador` sem invenção.

### 1.3 O gate de OPERADOR não existe — e é fronteira dura

`src/lib/auth/authApi.ts:44-52`:

```
export interface PlatformUser {
  id: string; email: string; name: string;
  authMethods: string[]; createdAt: string; updatedAt: string;
}
```

**Nenhum campo de papel, permissão, `isStaff` ou equivalente.**
`docs/v2-backend-contract.md` (1112 linhas, Endpoints 1-24) não menciona
`role`, `admin`, `operador` nem `staff` em lugar nenhum — a única
ocorrência da palavra "Role" é cabeçalho de tabela de dado de geração
(linha 897).

**O único lugar do sistema onde papel existe** é
`src/lib/conversas/api.ts:23-25`, e é por mensagem, não por sessão:

> `role` vem do SERVIDOR — quem é a casa e quem é o cliente não é
> decisão da tela. `customer` é o dono da conta; qualquer outro papel é
> operador.

Ou seja: o backend **já sabe** distinguir operador de cliente ao gravar
uma mensagem, mas **não expõe** esse fato em `GET /api/auth/me`. O
frontend não tem como perguntar "esta sessão é de operador?".

**Consequência, sem margem:** um gate de operador não é construível no
frontend hoje. Depende de a CURSOR expor papel na sessão (campo em
`PlatformUser`, ou endpoint irmão). **Classe 3 do protocolo de
incerteza** — dependência fora da posse, reportada e não resolvida. A
recon CURSOR paralela é onde isso se decide.

**O que NÃO fazer, e a razão:** um gate por lista de e-mail no cliente
(`user.email === '…'`) daria a aparência do gate sem a substância — a
rota continuaria buscando dado de todo mundo, e a proteção real é do
endpoint, não da tela. Esconder o console de quem não é operador só vale
se o backend recusar o mesmo. Registrado como armadilha, não como opção.

---

## 2. H2 — o que existe de `field.css` em `src/`

### 2.1 Confirmado, com uma correção de forma

**Não existe `field.css` em `src/`.** O que existe é
`src/components/nivar/campos.tsx` (381 linhas), que injeta o CSS por
componente (`<EstilosCampos />`, linha 48) em vez de importar folha
global. A razão está no próprio arquivo (linhas 38-42): não depende de
ordem de import, e página sem formulário não carrega o CSS de formulário.

**A contagem do brief bate exatamente.** `campos.tsx:9-22` declara, e a
medição confirma: `.claude/skills/NIVAR Design System/components/forms/field.css`
tem **89 blocos de regra** (`grep -c`, 115 linhas). Vieram dois grupos:

| Grupo | Blocos | Estado |
| --- | --- | --- |
| `.nv-campo*` | 26 | **portado** — Input, NumberInput, Select, UnitField |
| `.nv-escolha*` | 18 | **portado** — Checkbox, Radio |
| `.nv-acesso*` | 15 | ficou no skill — é o AuthForm; `/entrar` e `/criar-conta` já usam `.conta-campo` local |
| `.nv-multi*` | 16 | ficou no skill — MultiSelect, sem tela prevista |
| `.nv-desl*` | 14 | ficou no skill — Slider, sem tela prevista |

26 + 18 = **44**. Confirmado por contagem, não por leitura do comentário.

**Exports reais** (`campos.tsx`): `EstilosCampos`, `CampoTexto`,
`CampoSelect`, `Escolha`, `EscolhaPilha`, `EscolhaFila`, `ApenasLeitor`.
**Consumidor único:** `DiagnosticoEnergeticoPage.tsx:73`.

### 2.2 Cobre o que um console precisa? Não.

O que foi portado é vocabulário de **entrada de formulário**. Um console
operacional precisa de vocabulário de **leitura densa**. O que falta está
em §3.2 — e é todo CSS que existe no skill e não em `src/`.

A regra de como trazer já está escrita, e é do próprio sistema
(`src/design/nivar/LEIA.md`): *"o CSS de componente entra POR DEMANDA,
conforme cada tela usar — nada aterrissa em `src/` sem uso"*. Portar o
grupo que o console usar é procedimento normal, não exceção.

---

## 3. H3 — precedente de lista e tabela densa

### 3.1 Em `src/`, o precedente NIVAR não existe

Varredura por `<table>` em `src/`:

| Arquivo | Sistema |
| --- | --- |
| `src/components/terminal/DataTable.tsx` (111 linhas) | **terminal americano** — `C`, `F`, `S` de `design/tokens.ts`, Geist Mono 10px no cabeçalho / 13px na célula, `compact` a 32px de linha |
| `src/components/nest/analyst/QueryBuilder/QueryResultsTable.tsx` | terminal |
| `src/components/alexandria/atlas/ComparadorPaises.tsx` | Alexandria |
| `src/components/alexandria/viewer/ApostilaPanel.tsx` | Alexandria |
| `src/components/ui/table.tsx`, `design/figma-reference/**` | shadcn / referência legada |
| `src/components/landing/TheCase.tsx`, `vault/MarkdownProse.tsx` | landing / vault |

**Nenhuma tabela NIVAR em `src/`.** `terminal/DataTable.tsx` é uma boa
tabela densa e a forma de `ColumnDef` é reaproveitável **como estrutura**
— mas fala outro sistema (`R.md` de raio incluído), e o `AGENTS.md` é
explícito: NIVAR e terminal *"nunca se importam"*.

`Collapsible` em `src/components/ui/collapsible.tsx` é o Radix do lado
americano, não o `Collapsible` do NIVAR. **`PublicationList` não existe
em `src/`** — só no skill.

### 3.2 No sistema NIVAR, o vocabulário de console está inteiro

`.claude/skills/NIVAR Design System/components/data/data.css` —
**104 blocos, 135 linhas**, nenhum em `src/`:

| Família | Papel | Componente `.jsx` |
| --- | --- | --- |
| `.nv-tab*` | tabela densa, com `--zebra`, `--hover`, `.nv-tab-rolo` (contêiner de rolagem) e `.nv-tab__painel` | `DataTable.jsx` |
| `.nv-ord*` | cabeçalho ordenável, com `--ativa` e marca de direção | `SortHeader.jsx` |
| `.nv-exp*` | **linha que expande em painel abaixo**, com célula indentada e fio desenhado | `ExpandableRow.jsx` |
| `.nv-num` | numérico tabular (usado por `DataTable.jsx:30` e `:45`) | — |
| `.nv-card*`, `.nv-cardgrid` | cartão de dado com valor, unidade, delta, família | `DataCard.jsx` |
| `.nv-frescor*` | estado do dado — `vivo` / `desatualizado` / `ilustrativa`, com ponto | `DataFreshness.jsx` |
| `.nv-comp*` | comparação lado a lado | `Comparison.jsx` |
| `.nv-metodo*`, `.nv-proc*` | divulgação de método e procedência | `MethodDisclosure.jsx`, `Provenance.jsx` |

E ao redor, tudo o que uma fila de trabalho pede:

| Peça | Caminho no skill | Linhas |
| --- | --- | --- |
| Paginação | `navigation/Pagination.jsx` | 38 |
| Busca | `controls/SearchField.jsx` | 71 |
| Barra de filtro | `controls/FilterBar.jsx` | 24 |
| **Alternância de densidade** | `controls/DensityToggle.jsx` | 37 |
| Abas | `controls/Tabs.jsx` | — |
| Estado vazio | `states/EmptyState.jsx` | 60 |
| Toast | `overlay/Toast.jsx` | 23 |
| Confirmação | `overlay/ConfirmDialog.jsx` | — |
| Colapsável (`.nv-recol*`) | `structure/Collapsible.jsx` + `structure.css` | — |

### 3.3 `PublicationList` + `Collapsible` — forma parcialmente errada

A Diagnóstico Wave 1 apontou os dois como precedente
(`docs/diagnostico-energetico-recon-frontend.md:210-211, 226-227`), e
**para o que ela precisava estava certo: uma timeline do lado do
cliente**, poucos itens, um caso só.

Para fila operacional é outra coisa. `editorial/editorial.css` tem
**19 blocos**, e a estrutura de `.nv-pub*` é editorial — família, título,
resumo, meta à direita. Ela lê como publicação, não como linha de
trabalho: **não ordena, não pagina, não tem coluna comparável entre
itens, e não densifica**. Uma fila de pedidos quer varredura vertical por
coluna alinhada; `PublicationList` quer leitura sequencial.

**Leitura:** `.nv-tab*` + `.nv-ord*` + `.nv-exp*` é a forma certa para a
fila. `Collapsible` (`.nv-recol*`) continua certo, mas **dentro do
pedido**, não como a fila inteira — e `ExpandableRow` já é essa ideia
dentro da tabela. `PublicationList` não é erro grave; é o instrumento de
outra tela.

---

## 4. H4 — visualizador de documento

### 4.1 Confirmado: não existe. Medido em quatro direções.

- **`package.json`:** a única dependência de PDF é
  `@react-pdf/renderer@^4.5.1`, que **escreve** PDF. Sem `pdfjs-dist`,
  `pdf-lib`, `react-pdf`, `@react-pdf-viewer/*`. Nenhuma lib de anotação,
  canvas 2D, crop ou imagem em escala.
- **`src/`:** os 19 imports de `@react-pdf/renderer` estão todos em
  `src/services/pdfExport.ts` e `src/services/pdfTemplates/**` — geração,
  direção oposta.
- **Nenhum `<embed>`, `<object>` ou `<iframe>` de PDF.** As duas
  ocorrências de `application/pdf` em `src/` são o `accept` do input de
  upload (`ContaDeLuzExpressPage.tsx:82`,
  `SolarProposalValidatorPage.tsx:83`). O intake **envia e nunca exibe**.
- **Nenhum overlay posicionado sobre imagem** em `src/`.

### 4.2 Mas o terreno já foi levantado — e com profundidade

**`docs/conta-luz-express-recon-marcacao-frontend.md`** (284 linhas,
ARCHITECT · CLE Wave 4) é uma recon inteira sobre exatamente esta peça, e
**`docs/conta-luz-express-recon-marcacao-backend.md`** (284 linhas,
CURSOR) é a contraparte. As duas convergem nos requisitos de dado. O
brief desta wave supunha território inexplorado; o território está
mapeado. O que segue é o que aquelas recons fixaram, sem repetir a
medição:

**O que já está resolvido no papel:**

- **A técnica de overlay existe e é precedente direto:** o mapa do
  `src/components/br/PortalHero.tsx` — SVG único, coordenada em `viewBox`,
  halo de texto por `paintOrder: stroke`, acessibilidade completa
  (`role="button"`, `tabIndex`, `aria-label`, `onKeyDown`), hover
  sincronizado. Transferível sem invenção.
- **O contrato de coordenada converge** entre os dois lados: base
  normalizada `0..1` relativa à página, com o frontend multiplicando
  pelas dimensões que mede ao carregar
  (`naturalWidth` / `naturalHeight`). O backend não precisa conhecer pixel.
- **O tipo real do arquivo já está no backend** (`source_content_type`,
  detectado por bytes mágicos) — a UI sabe se é PDF ou imagem sem
  adivinhar por extensão.
- **`lazy` + chunk próprio** (`AtlasGlobo`) é o precedente para trazer
  pdf.js sem inflar o bundle de entrada.

**O que continua em aberto, e cada item é trabalho:**

- **Rasterizar PDF** — inexistente nos dois lados. Três caminhos
  (`pdfjs-dist` no cliente, rasterizar no servidor, `<object>` nativo), e
  **é decisão de brief, não de recon**.
- **`Content-Disposition: attachment`** em `GET …/source` faz o browser
  **baixar** em vez de exibir. Bloqueia `<img>`, `<object>` e `<iframe>`.
  O caminho `fetch` → `blob:` funciona sem tocar o backend, ao custo de
  segurar os bytes em memória. A alternativa é mudança de uma linha em
  território CURSOR.
- **Contagem de páginas e rotação do PDF** — ninguém tem, e só um parser
  fornece.

### 4.3 O que a anotação exige, listado como peça

Sem implementar nada, o tamanho da peça em componentes:

1. **Capacidade de rasterização** (dependência nova + worker, ou endpoint
   novo de PNG por página).
2. **Transporte que exiba** (`fetch` → `blob:`, ou rota `inline`).
3. **Moldura de página** — imagem em escala com `objectFit: contain`, fio
   em cima e embaixo, medindo as dimensões naturais no `onLoad`.
4. **Navegação entre páginas** — a fatura tem N; o mapa tinha 1.
5. **Zoom/pan** — A4 com texto pequeno provavelmente pede; `viewBox`
   dinâmico do mesmo SVG resolve sem biblioteca, mas é trabalho.
6. **Camada de captura** — arrastar para desenhar retângulo, converter
   pixel de tela em coordenada `0..1`, estado de "desenhando".
7. **Camada de exibição** — SVG com os retângulos e números, halo, hover
   sincronizado com a lista de comentários ao lado.
8. **Painel de comentário** — escrever, editar e apagar a explicação de
   cada marcador, ligado por número.
9. **Persistência** — contrato de marcação, que **a CURSOR define**.

### 4.4 Veredito de tamanho: NÃO cabe junto com o resto

**Isto é uma wave inteira, e provavelmente duas.**

A razão não é o número de itens — é que **os itens 1, 2 e 9 são
dependências externas ao frontend**, cada uma com decisão própria: uma
dependência nova de ~1 MB com worker (ou um serviço de rasterização no
backend), uma mudança de header ou uma estratégia de blob, e um contrato
de dado que outro agente escreve. Nenhuma delas é "escrever componente".
Uma wave de build que tente carregar isso junto com navegação, fila, três
telas de produto e indicador de notificação vai gastar a maior parte do
tempo em decisão de infraestrutura e entregar o console pela metade.

**Recomendação de divisão** (proposta, não decisão):

| Wave | Entrega |
| --- | --- |
| **Build 1 — o console** | `/operador/*`, navegação por família orientada a dado, fila, idade do pedido, três telas de produto com a natureza de dado de cada uma, indicador de notificação. A tela do pedido mostra os metadados e o **link de download** do arquivo — o que já é possível hoje. |
| **Build 2 — o visualizador** | Rasterização, transporte, moldura, páginas, zoom. Só exibir. |
| **Build 3 — a anotação** | Captura, camada de exibição, painel de comentário, persistência. Depende do contrato da CURSOR. |

Build 1 é entregável e útil sozinha: o operador ganha a fila, o contexto
e o caminho para o arquivo, que é mais do que ele tem hoje — hoje não tem
nada. Build 2 sem Build 3 também é útil: ver a fatura na tela sem baixar
já muda o trabalho.

**Se o Aquiles quiser as três juntas, é decisão dele** — mas o preço está
declarado aqui, e o risco é o console sair inteiro no papel e parcial na
tela.

---

## 5. H5 — identidade visual de ferramenta interna

### 5.1 A doutrina vale igual. Leitura, não decisão.

Os invariantes do `AGENTS.md` — **raio zero**, **zero `box-shadow`**,
**zero semáforo**, densidade de 40-60 elementos por tela, sem Tailwind em
layout — são enforced por máquina, não por gosto. Regras em
`tools/gridalpha-detect/src/rules/`:

| Regra | Severidade |
| --- | --- |
| `no-tailwind-on-layout` | **P0** |
| `no-pure-black-white` | **P0** |
| `no-inter-no-system` | **P0** |
| `no-gradient-text` | **P0** |
| `no-decorative-svg` | **P0** |
| `no-easeOutBounce` | **P0** |
| `no-box-shadow-on-cards` | P1 |
| `no-pill-chip-default` | P1 |
| `require-tabular-nums` | P1 |
| `equal-weight-grid` | P2 |

O auditor roda sobre `src/` inteiro. **Não há exceção por diretório, por
audiência ou por "é interno"** — um console em `src/pages/operador/` passa
pelo mesmo P0 que a landing. A linha de base é 0 P0 / 27 P2, e o
`AGENTS.md` a trata como gate. Uma exceção para ferramenta interna teria
de ser regra nova no auditor: território FOUNDRY, mudança de sistema, não
de tela.

### 5.2 Densidade maior não precisa de exceção — o sistema já a tem

A pergunta do brief ("ferramenta interna admite densidade maior?") tem
resposta dentro do próprio NIVAR, e ela é melhor que uma exceção:

- **`controls/DensityToggle.jsx`** (37 linhas) existe no sistema
  justamente para isso — alternância explícita de densidade, com `target`.
- **`.nv-tab--zebra`** e **`.nv-tab-rolo`** em `data.css` são vocabulário
  de tabela longa e densa, não de página de marketing.
- **`terminal/DataTable.tsx:31`** dá o precedente numérico de densidade no
  repo: `rowHeight = compact ? 32 : 44`.
- O piso de 40-60 elementos por tela do `AGENTS.md` é **piso**, não teto.
  Um console que mostre 80 linhas não viola nada.

**Leitura, para o Aquiles decidir:** o console fala NIVAR, com a mesma
disciplina de fio e raio, e ganha densidade por `DensityToggle` e por
`.nv-tab--zebra` — não por relaxar invariante. A diferença entre o console
e o Portal não deve estar no *sistema*, e sim na *escolha de componente*:
o Portal usa cartão e prosa, o console usa tabela e mono tabular. Mesma
tinta, outro instrumento.

**Uma nota de risco.** *"Tudo diferente, sempre diferente"* (três telas de
produto com ferramenta própria) e "sistema de design único" não conflitam
— desde que o que muda por produto seja o **instrumento** (o que a tela
mostra e como se opera nela) e não o **vocabulário** (cor, fio, tipo,
espaço). O momento em que uma das três telas quiser um raio ou uma sombra
é o momento em que a diferenciação virou deriva.

---

## 6. Achados fora das hipóteses

### 6.1 A fila não tem estados para mostrar

Os três produtos Advisory **não compartilham vocabulário de estado**:

| Produto | Cliente | Estado |
| --- | --- | --- |
| CLE | `src/lib/submissoes/api.ts` (`prefixo: '/api/conta-luz-express'`, `:154`) | `'submitted' \| 'ready'` (`:44`) |
| Solar | mesmo cliente (`prefixo: '/api/solar-proposal-validator'`, `:170`) | `'submitted' \| 'ready'` |
| Diagnóstico | `src/lib/diagnostico/api.ts` — cliente **próprio** | **sem campo `status`** (`:27` declara a ausência) |

O comentário em `submissoes/api.ts:43` é explícito: *"Os DOIS estados do
backend. 'Nada enviado' não é status: é lista vazia."*

**Consequência para o console:** não existe "em análise", "atribuído",
"devolvido" nem "arquivado". Um pedido é `submitted` até virar `ready`, e
a transição acontece quando o entregável sobe. Uma fila com coluna de
estado teria dois valores e nada mais. **Se o console precisar de estados
intermediários, isso é campo novo no backend** — CURSOR.

Que a divisão de clientes já exista em código é, aliás, a confirmação
técnica do que o Aquiles disse: **são três naturezas de dado diferentes**,
e o repo já parou de fingir que são uma só.

### 6.2 Não existe endpoint de fila

`ClienteSubmissoes` (`src/lib/submissoes/api.ts:74-79`) expõe dois
métodos, e o comentário da linha 78 é o ponto:

> `GET {prefixo}/submissions` — **as submissões da conta**, mais recente
> primeiro.

Tudo o que o frontend sabe ler hoje é escopado ao usuário logado. **Não há
"todas as submissões" nem filtro por operador.** Um console precisa de
endpoint novo, e ele nasce junto com o papel de sessão de §1.3 — são a
mesma dependência.

`FLUXOS_SUBMISSAO` (`:151-187`) registra que CLE e Solar estão
`aoVivo: true` (backends no ar, medidos); Diagnóstico não está na lista
por ter cliente próprio.

### 6.3 "Idade do pedido" não tem formatador

Varredura por `Intl.RelativeTimeFormat`, `timeAgo`, `tempoRelativo`: **as
15 ocorrências de `timeAgo` em `src/` são strings literais de mock** do
terminal americano (`GlobalShell.tsx:415-433` — `'1 hr ago'`, `'2 hr ago'`;
`PeregrinePreview.tsx:16-30`). Nenhuma é calculada.

`Submissao` tem `createdAt`, `updatedAt` e `deliveredAt`
(`submissoes/api.ts:48-50`) — o dado para calcular idade **já chega**.
Falta a função. Peça pequena (uma função pura e um teste), mas peça que
não existe.

**A doutrina de não prometer prazo tem apoio no sistema:**
`data/DataFreshness.jsx` já é o componente de "estado do dado no tempo"
(`vivo` / `desatualizado` / `ilustrativa`), com ponto e detalhe, e sem
nenhuma noção de meta ou atraso. É o vocabulário certo para idade sem SLA
— e não precisa de barra de progresso porque não tem barra de progresso.

### 6.4 Indicador de notificação no portal não tem precedente

Varredura por `unread`, `naoLida`, `badge` em `src/lib`,
`src/pages/conta` e `src/components/br`: **zero**. Os únicos `Badge` do
repo são os selos da Alexandria (`src/lib/data/alexandria-badges.ts`) —
conquista de aluno, outra coisa.

`Conversa` (`src/lib/conversas/api.ts:47`) tem `messageCount`, mas **não
tem estado de leitura** — não dá para derivar "não lida" dele. O skill tem
`overlay/Toast.jsx` (23 linhas), que é aviso **transitório**, não
indicador persistente.

**Consequência:** o indicador dentro do portal é peça nova nos dois lados
— marca de "lido" no backend, contador na tela. O canal de email (que o
Aquiles diz já funcionar) não cobre isso.

### 6.5 Correção de premissa: quais famílias têm produto

O brief diz *"Hardware e Software não têm produto nomeado"*. O catálogo
medido (`src/lib/data/br-familias.ts:63-121`,
`src/lib/data/br-destinos.ts:29-95`) diz outra coisa:

| Família | `produtoIds` | Status do produto |
| --- | --- | --- |
| Hardware | `[]` | **prateleira vazia, declarada** (`br-familias.ts:74`) |
| Academy | `['alexandria']` | `disponivel`, rota `/alexandria?trilha=brasil` |
| Software | `['terminal-brasil']` | `em-breve`, `rota: null` |
| Advisory | `['conta-de-luz-express', 'solar-proposal-validator', 'diagnostico-energetico']` | 1 `disponivel`, 2 `em-breve` (rota existe, catálogo fechado) |
| Intelligence | `['energy-brief']` | `em-breve`, `rota: null` |

**Hardware é a única família sem produto.** As outras quatro têm produto
nomeado; o que nenhuma delas exceto Advisory tem é **fila de pedidos** —
Alexandria, Terminal Brasil e Energy Brief não recebem submissão de
cliente, então não há nada a operar.

**A conclusão do brief permanece correta; a premissa é que muda.** O
critério para a lateral não é "a família tem produto?", é **"o produto tem
fila?"**. Orientado a dado, isso é derivável hoje sem tabela nova: os
produtos com fila são exatamente os que têm cliente de submissão
(`FLUXOS_SUBMISSAO` + Diagnóstico). Uma lateral que renderize só o que tem
fila mostra Advisory com três produtos e mais nada — sem aba vazia, sem
estado "em construção", sem decisão codificada à mão.

---

## 7. O que a wave de build herda pronto

- **Rota e router:** `PortalBRRouter.tsx` (38 linhas) como gabarito de
  `/operador/*`; `NotFound` já ligado no catch-all.
- **Gate por sessão:** o padrão `!loading && !user → <Navigate to="/entrar">`,
  verbatim, com `state={{ de: location.pathname }}`.
- **Formulário:** `src/components/nivar/campos.tsx` inteiro —
  `CampoTexto`, `CampoSelect`, `Escolha`, e o `<EstilosCampos />` que monta
  a folha.
- **Leitura de dado:** `criarClienteSubmissoes(prefixo)` já é parametrizado
  por produto; `src/lib/diagnostico/api.ts` para o formulário;
  `src/lib/conversas/api.ts` para a mensagem operador↔cliente, que **já
  existe e já distingue papel**.
- **Vocabulário de console no skill NIVAR**, pronto para portar por
  demanda: `data.css` (104 blocos), `DataTable`, `SortHeader`,
  `ExpandableRow`, `Pagination`, `SearchField`, `FilterBar`,
  `DensityToggle`, `EmptyState`, `Toast`, `ConfirmDialog`, `Collapsible`.
- **Precedente de densidade numérica:** `terminal/DataTable.tsx:31`
  (`compact ? 32 : 44`) — o número, não o código.
- **Técnica de overlay**, se e quando a Build do visualizador vier:
  `PortalHero.tsx` (§4.2 e a recon de marcação).

## 8. O que precisa ser construído

**No frontend, e cabe numa wave:**

1. `/operador/*` com router próprio e gate por sessão.
2. Lateral orientada a dado, derivada de "produto com fila" (§6.5).
3. Porte do grupo `.nv-tab*` / `.nv-ord*` / `.nv-exp*` de `data.css`, no
   idioma de `campos.tsx` (folha injetada por componente).
4. Fila de pedidos — tabela densa, ordenável, com linha expansível.
5. Formatador de idade (`createdAt` → "há 3 dias"), sem prazo, sem barra,
   sem rótulo de atraso.
6. Três telas de pedido com ferramenta própria: CLE (fatura), Solar
   (proposta), Diagnóstico (quatro campos, sem arquivo).
7. Indicador de notificação no portal — a parte de tela.

**Fora da posse do frontend, e bloqueia:**

- **Papel de operador na sessão** (§1.3) — sem isso não há gate real.
- **Endpoint de fila** não escopado à conta (§6.2).
- **Estado de leitura** para o indicador (§6.4).
- **Estados intermediários** de pedido, se o console precisar deles (§6.1).

**Wave própria, e não deve ser forçada junto (§4.4):**

- Rasterização e exibição de documento.
- Captura e persistência de marcação.

## Registrado, não resolvido

- **`.mcp.json` aponta o servidor `gridalpha-tokens` para um caminho de
  OneDrive que não existe mais**; ele falhou com `CONNECTION_CLOSED` nesta
  sessão, como já falhara na Método Wave 2. A consulta de token foi feita
  lendo `src/design/nivar/` e o skill diretamente. Atinge toda worktree;
  fora da posse desta wave.
- **`npm ci` não rodado neste worktree** (justificado no cabeçalho). A wave
  de build precisa dele e do `.env.local`.
- **A recon de marcação da CLE Wave 4 não foi reexecutada.** Este documento
  cita as conclusões dela; se algo mudou em `app/` desde aquele fechamento,
  a citação de §4.2 envelheceu junto.
- **O critério "produto com fila" (§6.5) não está materializado em lugar
  nenhum** — `FLUXOS_SUBMISSAO` chega perto, mas não inclui Diagnóstico. Se
  a lateral for derivar dele, ele precisa passar a incluir os três, ou
  nascer uma lista irmã. Decisão da wave de build.

---

## Adendo — cruzamento com a recon CURSOR (Wave 1 de backend)

`docs/operador-recon-backend.md` (714 linhas, `1baba6e`) entrou em
`feature/full-shell-buildout` enquanto esta wave rodava, escrita em
paralelo e sem ver este documento. Lida no fechamento da Fase 2. As duas
convergem no essencial; **uma afirmação daqui precisa de correção, e três
dependências que eu declarei em aberto têm resposta parcial.**

### Correção — existe namespace `/api/operator/*`, e eu não o vi

§6.2 diz que não há endpoint de fila. **Correto para submissão, incompleto
como afirmação.** Existe `GET /api/operator/conversations`, que lista
**todas** as conversas com `status: 'open'`, de qualquer `productId`.

O que muda e o que não muda:

- **O frontend não tem cliente para ele.** Varredura por `api/operator` em
  `src/`: **zero ocorrências**. `src/lib/conversas/api.ts:17` aponta para
  `/api/conversations` (o lado do cliente), não para o lado do operador.
  Um cliente novo é peça da wave de build.
- **Não é fila de pedidos, é caixa de fios.** A CURSOR mede: sem
  paginação, sem filtro por produto ou família, sem nome ou e-mail do
  cliente (o `userId` vem opaco, sem join), sem preview de última
  mensagem, e **sem `messageCount`** (que existe em `GET /{id}` mas não
  na listagem — `src/lib/conversas/api.ts:47` documenta o campo como
  opcional, e isto explica por quê). `summary.product` é a string fixa
  `"any"`, não um filtro.
- **Não lista submissão de CLE nem de Solar** — só conversa, e hoje só o
  Diagnóstico liga `originKind`/`originId`. Conversa `closed` some da
  lista, então não há histórico por ali.

**Consequência para a fila:** o console precisaria de **duas leituras
por caso** — a conversa em `/api/operator/conversations` e a ficha em
`GET /api/diagnostico-energetico/submissions/{originId}`. E para CLE e
Solar não há caminho de operador nenhum: a CURSOR mede que o operador
"sabe que chegou" **por e-mail**, e vê o caso **por UUID**. Não existe
lista.

Isso **reforça** §8: o endpoint de fila continua sendo dependência
bloqueante. O que muda é que o namespace onde ele vai morar já existe.

### Confirmações vindas do outro lado

- **Papel de operador (§1.3).** Confirmado dos dois lados, e o mecanismo
  real é mais estreito do que eu supus: `app/services/advisory_operator.py`
  compara o e-mail da sessão contra a env `ADVISORY_OPERATOR_EMAIL` — 503
  se a env falta, 403 se não casa. **Sem `role` no `User`**, sem allowlist
  de vários operadores, sem audit log. E `ADVISORY_OPERATOR_EMAIL` segue
  como pendência de produção em `docs/pendencias-infra.md`, ou seja, o
  gate está **dormente**.

  A armadilha que registrei em §1.3 fica ainda mais afiada: como o
  e-mail de operador é **env de servidor**, o frontend não o conhece e não
  pode replicar o gate. Ele continua precisando que o servidor diga se a
  sessão é de operador — hoje o único jeito de descobrir é chamar um
  endpoint de operador e ler o 403.

- **Lido / não-lido (§6.4).** Confirmado: nenhuma coluna `read_at`,
  `last_read_at` ou `seen_at` em `conversation` nem em `message`, e
  `message` é append-only. O indicador é peça nova nos dois lados, como
  eu disse.

- **Estados de pedido (§6.1).** Confirmado: CLE e Solar são irmãs
  `submitted`/`ready` com deliverable PDF; Diagnóstico **não tem ciclo de
  deliverable nem e-mail transacional**. A CURSOR acrescenta o que eu não
  podia ver: o Diagnóstico **não tem endpoint nem coluna de entrega** — o
  operador não tem como devolver documento nenhum. A tela de Diagnóstico
  do console, portanto, não é só "outra natureza de dado": é a única das
  três **sem caminho de saída**.

- **Famílias (§6.5).** Convergência exata, medida de dois lugares
  diferentes. A CURSOR: `PRODUCT_CATALOG` é tupla plana de seis ids, com
  **zero agrupamento por família**; Hardware e Software não têm id nenhum.
  Eu, do lado do front: a taxonomia inteira vive em
  `src/lib/data/br-familias.ts`. As duas recons chegam à mesma frase — o
  nav multi-família **não tem backing de dado no backend**, e ou o front
  carrega a taxonomia sozinho (como já faz no Portal), ou o backend ganha
  catálogo de família.

  Registro a diferença de contagem, que não é discordância: a CURSOR lê o
  catálogo do backend, onde Hardware e Software não existem; eu leio o
  catálogo do front, onde Software tem `terminal-brasil`. Os dois estão
  certos sobre a própria fonte. O que vale para a lateral é o critério de
  §6.5 — **produto com fila** —, e por ele nenhuma das duas contagens
  muda a resposta: só Advisory aparece.

- **Anotação (§4).** A CURSOR chega ao mesmo veredito por outro caminho:
  16 tabelas, zero conceito de marcação, e a recon da CLE Wave 3 já tinha
  fechado o terreno sem que nada fosse construído. **Duas recons de
  frontend e duas de backend agora apontam para a mesma peça não
  construída.** Isso é argumento a favor da divisão de §4.4, não contra:
  a peça não é grande por falta de estudo.

### O que a CURSOR levanta e este documento não cobria

Fora da posse do frontend, mas o brief de build precisa saber que existe:

- **Diagnóstico pode precisar de deliverable** — decisão do Aquiles, não
  há endpoint nem coluna hoje.
- **O intake de Diagnóstico não tem os campos** de localização, metragem,
  equipamentos e custo; dois caminhos de schema reportados sem escolha.
- **Retenção e LGPD: nada.** Sem política, sem TTL, sem endpoint de
  exclusão. Histórico permanente é comportamento de fato, não decisão
  documentada. Um console que exponha arquivo de cliente aumenta a
  superfície disso.
