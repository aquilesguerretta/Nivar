# Eixo 1 — Orientação e estrutura, sem mapa

**Pergunta:** a v2 usou cartografia para responder *onde estou, o que faço agora, o
que mais existe*. Como os melhores produtos respondem isso sem desenhar território?

**Resposta curta, para quem não vai ler o resto:** eles respondem com **três peças
separadas, nunca com uma peça só** — (1) um **índice colapsado** no nível do módulo,
(2) um **estado por item** que cabe em poucos pixels, e (3) um **marcador de "você
está aqui" que viaja com a aula**, geralmente uma linha de texto ou um contador
`Unit 1 of 7`. Nenhum dos produtos que aguentam escala desenha o currículo como
espaço. Os dois que desenham — Exercism (grafo) e roadmap.sh (mapa de nós) —
pagam o preço em pixels e nenhum dos dois consegue mostrar as aulas, só os módulos.

---

## 0. Método, e o que não consegui ver

Abri **44 produtos** em navegador real (Chrome, 1440×900) — mais dois que não
renderizaram, Maven e LinkedIn Learning —, naveguei, cliquei menus e acordeões,
e **medi no DOM** as alturas que cito. Toda captura está em
`docs/alexandria-v3/pesquisa/capturas/01-orientacao/`, com legenda em
`_legendas.md` dizendo o que cada uma prova.

**Não consegui ver (muro de login, marcado como tal e nunca descrito como se eu
tivesse visto):**

| Produto | O que ficou atrás do login | Como sei que existe |
| --- | --- | --- |
| **Duolingo** | a trilha inteira — `/learn` redireciona para a tela de cadastro | `duolingo-learn-nologin.png` |
| **Khan Academy** | o estado real de domínio (minha grade está 0%/"Not started") | legenda da grade visível sem login |
| **Brilliant** | a aula e a sequência; `/courses/<slug>/` redireciona para o índice de tópicos | `brilliant-course-page.png` |
| **O'Reilly** | a plataforma inteira; `oreilly.com/search` devolve 403 Akamai | `oreilly-search-paths.png` |
| **Coursera / edX** | a sala de aula; a página pública para no nível de módulo/semana | `coursera-syllabus.png` |
| **Josh Comeau** | o curso; só a página de venda lista os 10 módulos | `joshcomeau-css.png` |
| **Execute Program / Educative / Boot.dev / Scrimba / Pluralsight / DataCamp** | o estado de progresso; a estrutura é pública | capturas respectivas |
| **Maven** | páginas voltaram em branco nas duas tentativas (`/browse` e uma página de curso); capturas vazias descartadas | — |

O que digo sobre o **estado logado** desses produtos vem do que a própria interface
deslogada declara — `"Sign in to save progress"` (Next.js Learn), `"Account required
to save your progress"` (Scrimba), `"Sign in to view lists and track study
progress"` (LeetCode), `"Join 184.069+ others tracking their progress on this
roadmap"` (roadmap.sh). Isso é evidência de **que existe**, não de **como é**.

As capturas `.jpg` numeradas (01–08) já estavam na pasta quando este eixo começou.
Conferi cada uma contra captura própria do mesmo produto e do mesmo mecanismo
(os `.png`); cito só as que a minha medição confirma.

---

## 1. O problema concreto, em números

A Alexandria tem **3 trilhas → 17 módulos → 141 aulas**, média de **8,3 aulas por
módulo**, mais 165 instrumentos, 2.124 termos e 214 exercícios pendurados nessas
aulas. Trilha I = M01–M05, II = M06–M12, III = M13–M17.

Isso coloca a Alexandria **exatamente na faixa onde os produtos quebram**. Não é
coincidência que os três melhores casos que encontrei tenham o mesmo tamanho:

- **Khan Academy, Algebra 1:** `17 UNITS`, **182 skills**.
- **Exercism, trilha Python:** **17 conceitos**, **146 exercícios**.
- **Boot.dev, Backend Path:** **17 cursos**, 203 capítulos.

Três produtos independentes, 17 módulos cada, três respostas estruturalmente
diferentes — e dá para medir qual custa o quê. É a comparação mais útil deste
documento.

---

## 2. Os produtos, um a um — mecanismo, não aparência

### 2.1 Os que resolvem bem

**Microsoft Learn** — `mslearn-path.png`, `mslearn-unit-rail.png`,
`mslearn-unit-dropdown-open.png`
A hierarquia é *learning path → module → unit*, três níveis como a Alexandria.
A página do path é uma **pilha de cartões de módulo colapsados**: cada cartão traz
título, descrição de uma linha, `28 min • Module • 7 Units`, selo de XP, botão
`Start` e um disclosure `Overview ⌄`. **Só o primeiro vem aberto**, revelando as 7
unidades com o minuto de cada uma. O cabeçalho carrega `2 hr 48 min • Learning Path
• 5 Modules` e um bloco "At a glance" (Level, Product, Role, Subject).
Dentro da unidade, **toda a orientação é um único controle centralizado no topo:
`Unit 1 of 7 ⌄`**. Clicado, abre um menu com o nome do módulo no título e as 7
unidades listadas com minutos, a atual marcada com barra azul à esquerda e um ✓
verde. Mais nada: sem sidebar, sem mapa, sem trilha desenhada. O rodapé da unidade
diz `Next unit: What is Microsoft Azure`.
**É a solução mais econômica que vi.** Três elementos — breadcrumb, contador
`N of M` com menu, e "próxima unidade" nomeada — e a orientação está completa.

**Tutorial do Svelte** — `svelte-tutorial-tree.png`, `svelte-tutorial-menu-open.png`
Escala quase idêntica à da Alexandria: **4 partes → ~30 seções → ~130 exercícios**.
A barra fina acima do conteúdo tem, da esquerda para a direita: **hambúrguer**,
**← →**, e **o caminho inteiro em uma linha de texto**: `Basic Svelte / Introduction
/ Welcome to Svelte`. O hambúrguer abre uma **árvore em overlay** que mostra as 4
partes, **expande só a parte atual** em suas seções, **expande só a seção atual** em
suas aulas, e pinta a aula corrente de laranja. Todo o resto são linhas de uma
linha. O overlay fecha e some.
E o texto da própria aula diz: *"This tutorial is split into four main parts: Basic
Svelte (you are here)…"* e *"If necessary, you can navigate via the menu above."* —
ou seja, **até quem tem árvore boa escreve o "você está aqui" em prosa**.

**Next.js Learn** — `nextjs-learn.png`, `nextjs-learn-pill-list-open.png`
Toda a navegação é **uma pílula flutuante no rodapé**, presente em qualquer scroll:
ícone de lista · anel de progresso com o número do capítulo · `Chapter 1 / Getting
Started` · `Sign in to save progress` · seta ↑ (próximo). Clicando a lista, abre um
painel com **4 cursos como cartões no topo** — `App Router 0/15 Chapters`,
`Pages Router 0/46`, `React Foundations 0/10`, `SEO 0/33`, o atual com ✓ — e
abaixo os 15 capítulos **numerados `01`–`15` em duas colunas**, com `Introduction`
e `Next Steps` como extremos.
Progresso = **fração por curso** (`0/15`), posição = **número + título na pílula**.
Zero cromo permanente roubando largura da aula.

**Khan Academy** — `01-khan-academy-grade-de-dominio.jpg`, `khan-course-units-scroll.png`
Dois níveis simultâneos. **Coluna esquerda fixa**: `17 UNITS` e as 17 unidades,
`UNIT 1 Algebra foundations` … `UNIT 17`, rolável, unidade atual destacada.
**Coluna direita, topo**: a **grade de domínio** — `182 skills ⓘ`, legenda
(`Mastered / Proficient / Familiar / Attempted / Not started / ⚡ Quiz / ★ Unit
test`) e **17 linhas de quadradinhos, um por skill**, em duas colunas, com ⚡ e ★
nas posições onde entram quiz e prova. Unidades sem exercício dizem por escrito
`This unit does not include exercises` em vez de sumirem. Termina com um cartão
`COURSE CHALLENGE`.
**Medido: a grade inteira — 182 itens, 17 unidades, legenda e cartão final —
ocupa 1.212 px** (da legenda ao fim do cartão). **6,6 px por item.** É a
representação mais densa que existe de "o que mais existe + em que pé estou".
Abaixo da grade, a mesma página repete tudo em prosa: cartão por unidade com
`Unit mastery: 0% ⓘ` e as aulas agrupadas por sub-tópico, com ícone por tipo
(▶ vídeo, 📄 artigo, ✎ exercício). A página toda tem 16.964 px — **a grade é o
resumo executivo dela**.
Dentro da unidade (`khan-unit-inside-scroll.png`), o grupo de aulas é partido em
**duas colunas rotuladas `Learn` e `Practice`**, com o estado escrito por extenso
(`Not started`) em cada item de prática, um cartão **`Up next for you:` com o nome
do próximo item e um botão `Start`**, e no fim `Quiz 1 — Level up on the above
skills and collect up to 240 Mastery points`. O "próximo passo" é um cartão
nomeado, não uma seta.

**Mathigon** — `mathigon-course-top.png`, `08-mathigon-sidebar-secoes.jpg`
Sidebar colorida com a capa do curso e uma **régua vertical de seções**, cada uma
com um **círculo vazio** (estado) ligado por um fio, a atual destacada, ícone de
ferramenta em algumas. No conteúdo, canto superior: `Reading time: ~35 min` e
`Reveal all steps ›`. O tutor Archie explica o modelo: *"Our content is divided into
small steps. You have to complete the activities to reveal what's next."* —
**revelação progressiva travada**. Testei: sem conta, **nada persiste** (nenhuma
chave de progresso em `localStorage`; recarregar volta ao topo, `scrollY = 0`).
Relevante para a Alexandria por outro motivo: o conteúdo usa **gravuras clássicas**
(o universo ptolomaico) dentro de uma UI moderna, sem transformar a UI em atlas.

**Exercism** — `exercism-concepts-full.png`, `05-exercism-grade-busca-filtros-estado.jpg`
Duas abas, duas estruturas, e o contraste entre elas é a lição.
A aba **Learn** é um **DAG vertical**: 17 conceitos como cartões com monograma de
duas letras, ligados por fios tracejados, cada cartão com uma fileira de bolinhas —
uma por exercício do conceito. **Medido: a página tem 4.846 px** (5,4 telas) e
**não mostra nenhuma aula**: os 146 exercícios viraram bolinhas sem nome.
A aba **Practice** é o oposto: **campo "Search by title"**, **chips de filtro com
contagem** (`All Exercises 146 · Completed 0 · In Progress 0 · Available 146 ·
Locked 0`) e grade de cartões com ícone, nome, selo de tipo e uma linha de
descrição. **146 itens — a escala das 141 aulas — navegáveis por busca e filtro.**
O mesmo produto escolheu grafo para 17 nós e busca+grade para 146 itens. Ele
já respondeu a pergunta da Alexandria.

**Educative** — `educative-toc.png`, `educative-toc-top.png`
Acordeão numerado: `3. Preliminary System Design Concepts … 4 Lessons ⌄`. Módulo
aberto mostra linhas de aula **com círculo de estado por linha**. Barra fixa no topo
com selo `COURSE`, título, `Course Content` e `Start Learning` — o "onde estou"
sobrevive ao scroll.

**Codecademy** — `codecademy-syllabus.png`, `06-codecademy-acordeao-tipo-por-linha.jpg`
Cabeçalho do syllabus declara a composição em vez do tamanho:
`14 lessons • 14 projects • 13 quizzes` + `Expand all sections`. Mostra **7 de 13
módulos** e corta em `Show all 13 modules`. Cartão lateral com `Skill level:
Beginner`, `Time to complete: 24 hours`, `Projects: 14`, `Prerequisites: None`.

**LeetCode (Study Plan)** — `leetcode-studyplan.png`
Tabela agrupada por tema (`Array / String`), uma linha por item com **círculo vazio
à esquerda**, título, link `Solution` e rótulo de dificuldade. Painel direito
"Summary" com `150 Original & Classic Questions`, `Best for 3+ months of prep
time`. **150 itens ≈ 141 aulas**, lidos como checklist, sem nenhuma metáfora.
`Sign in to view lists and track study progress`.

**Scrimba** — `scrimba-path.png`
Acordeão de 13 seções, cada linha com **duas pastilhas**: `0 / 80 🎓` (feitos/total)
e `6,3 hrs`. Cabeçalho com `81,6 hrs · Beginner · Pro · Hot · 77.716 students · 10
languages`. **Medido: 13 seções somando 947 itens em 4.271 px** — porque os itens
**não são renderizados**, só contados. A fração por seção é o truque que deixa um
currículo de quase mil peças caber em menos de cinco telas.

**web.dev (Learn CSS)** — `webdev-css-lesson-rail.png`
Três colunas: esquerda = **campo `Filter` sobre a lista de aulas** (busca dentro do
índice, não no site); centro = aula; direita = `On this page` com as âncoras da
própria aula. Acima de tudo, barra de categorias (`HTML · CSS · Performance · …`).
Dois níveis de "onde estou" ao mesmo tempo: no currículo e dentro do texto.

**Trailhead (Salesforce)** — `trailhead-trail.png`
*Trail → badge → unit*. Cartão de identidade à esquerda, à direita uma faixa de
metadados (`+11.900 points · Intermediate · Developer · ~14 hrs 10 mins`) e a lista
de badges, cada um com **círculo de conclusão à esquerda**, selo `Badge`, descrição,
pontos e tempo. `Hide Details` colapsa tudo. É o mesmo esqueleto do Microsoft Learn
com pontos no lugar de minutos.

### 2.2 Os que resolvem mal, e o que isso ensina

**Udemy** — `udemy-course-content-accordion.png`
O cabeçalho é honesto: `21 sections • 332 lectures • 71h 10m total length` +
`Expand all sections`. Mas o acordeão **renderiza 11 das 21 seções e esconde o resto
atrás de `11 more sections`** — o próprio índice precisou de um "ver mais". E, no
meio do currículo, existe uma seção chamada **`How to Navigate This Course`,
2 lectures • 4min**. **Quando o curso precisa de uma aula sobre como navegar o
curso, a navegação falhou.** É o aviso mais barato que a Alexandria pode comprar.

**Boot.dev** — `bootdev-tracks.png`
17 cursos + 8 projetos, **todos expandidos de uma vez**, cada um com a lista inteira
de capítulos inline (`Ch 1. Introduction`, `Ch 2. Variables`, …), numerados 1–25,
com selo de tipo (`Course` / `Guided Project`) e `Last updated: Nov 2026`.
**Medido: 12.121 px — 13,5 telas — para 203 capítulos. 60 px por item.** Tudo
visível, nada localizável. É a lista linear levada ao limite.
(Nota lateral, útil ao eixo 4: o Boot.dev é um produto **moderno** vestido de
**clássico** — navy escuro, ouro, serifa, filete gravado com uma gema no centro —
e funciona, porque o clássico está na superfície de identidade e **não** no
vocabulário de navegação.)

**The Rust Book** — `rust-book.png`
Sidebar permanente com árvore numerada em decimal (`1.`, `1.1`, `1.2`, `2.`, `3.`,
`3.1`…), hambúrguer para colapsar, busca, tema, e setas ‹ › gigantes nas bordas da
tela. **Medido: 111 links, 4.205 px de altura de rolagem interna num viewport de
900.** A árvore completa e sempre visível custa **quase cinco telas de scroll
próprio** — e, por ser livro, **não tem nenhum estado**: nada diz onde você parou.

**roadmap.sh** — `roadmapsh-backend.png`, `roadmapsh-node-drawer.png`
O mapa de nós com legenda de cores (`Personal Recommendation / Opinion`,
`Alternative Option`, `Order not strict / Learn anytime`). Clicar num nó abre uma
gaveta lateral com recursos. Verifiquei no `localStorage`: **clicar e navegar não
grava nada** — o progresso exige conta (`Join 184.069+ others tracking their
progress on this roadmap · Sign up free`). O mapa é ótimo como **pôster de domínio**
e inútil como **lugar onde você mora**: é consultado uma vez, não habitado.

**Coursera / edX** — `coursera-syllabus.png`, `coursera-module-details-open.png`, `edx-course.png`
A página pública **some com o nível da aula**. O curso tem `3 modules`, e cada um
aparece como `Week 1 • 7 hours to complete` + um link `Module details`. A hierarquia
curso→módulo→aula existe, mas **só dentro da sala**. Para a Alexandria isso é o
anti-padrão: esconder as 141 aulas do visitante joga fora o maior ativo de prova
do produto.

**Pluralsight** — `pluralsight-path-real-scroll.png`
Lista de itens com selo de tipo (`Course`, `Lab`), autor, duração e data. Útil
numa coisa: **a data por item** (`Aug 29, 2026`) é um sinal de frescor que
currículo técnico de energia pode querer. (A URL `/paths/python` deu 404 — tive de
descobrir um path válido pelo índice.)

**Duolingo** — `duolingo-learn-nologin.png`
Muro de cadastro. **O caminho gamificado é o produto mais copiado do setor e o que
menos tem a dizer para a Alexandria**: a trilha de bolhas existe porque a lição dura
3 minutos e o conteúdo é intercambiável. Uma aula da Alexandria tem prosa autoral,
instrumento e exercício com resposta de referência — a unidade é grande demais para
virar bolha, e o adulto que precisa defender um número não aceita ser conduzido por
uma fila de ícones.

### 2.3 Os que não são cursos, e por isso ensinam melhor

**Our World in Data** — `owid-energy-topic.png`
**Domínio idêntico ao da Alexandria.** A página de tópico "Energy" tem autoria
assinada (`By Hannah Ritchie, Pablo Rosado, and Max Roser`), `Cite this work`,
`Reuse this work`, e **três abas: `Introduction · Research & Writing · Charts`**.
Um tópico, três superfícies — prosa, pesquisa, dados. Esse corte é quase literalmente
**aula / exercício+caso / instrumento**, e é a prova de que dá para ser erudito,
sério, citável e **completamente moderno** sem nenhuma metáfora espacial.

**Stanford Encyclopedia of Philosophy** — `stanford-encyclopedia-index.png`
O extremo "busca como entrada": `Table of Contents`, fileira de botões `A`–`Z`,
campo `Search SEP`, e verbetes em lista com autoria entre parênteses. Zero
progresso, zero ordem. **É o modelo certo para os 2.124 termos do glossário da
Alexandria e o modelo errado para as 141 aulas** — e vale dizer isso em voz alta,
porque a tentação de usar o mesmo padrão nos dois lugares é real.

**CS50 (Harvard)** — `cs50-syllabus.png`
Sidebar preta com identidade do curso, o professor com e-mail e redes, e
`Week 0 Scratch · Week 1 C · Week 2 Arrays · …` — **número em preto, assunto em
cinza**. Rótulo de duas camadas numa linha só. O corpo explica o fluxo de cada
semana como um fluxograma de quatro caixas.

**Full Stack Open** — `fullstackopen.png`
`Part 0 … Part 13`, numeração começando em zero, e **`Search from the material`
como item fixo da barra de navegação** — busca promovida a nível de navegação
principal num curso de ~100 capítulos.

**Execute Program** — `executeprogram-courses.png`
Mede o curso por densidade, não por tempo: **`882 code examples in 66 lessons`**.
Para um produto com 165 instrumentos e 214 exercícios, esse é o rótulo honesto —
"26 h" não diz nada, "165 instrumentos em 141 aulas" diz tudo.

**Outros abertos, em uma linha cada:**
`mdn-learn.png` (árvore lateral + módulos numerados) · `supabase-docs.png` e
`stripe-docs.png` (sidebar com grupos colapsáveis + ⌘K; o padrão de documentação
moderna) · `mit-ocw-course.png` (academia pura: menu lateral por tipo de material) ·
`kaggle-learn.png` (grade de cartões por curso com nº de lições) ·
`cloudskillsboost-path.png` e `dataquest-path.png` e `udacity-nanodegree.png` e
`ztm-course.png` (variações do acordeão numerado) · `odin-course.png` (lista linear
com títulos de seção, ~45 itens, sem nenhum estado visível deslogado) ·
`fcc-learn.png` (lista de certificações, sem hierarquia) ·
`mathigon-courses.png` (índice por nível escolar com `Under construction` escrito
nos capítulos incompletos — **declara ausência em vez de esconder**, que é
exatamente a regra do `AGENTS.md`) · `frontendmasters-course.png` ·
`sololearn-course.png` · `iea-topics.png` · `ember-insights.png` ·
`datacamp-track.png` (`View All 11 Track Items`) · `brilliant-courses-index.png`
(tópicos rotulados por faixa: `GRADES 7–9`, `INTERMEDIATE`, `ADVANCED` — nível como
etiqueta, não como posição num mapa).

---

## 3. As quatro formas, medidas

Tudo em px reais, medidos no DOM a 1440×900.

| Forma | Caso medido | Itens | Altura | px/item | Mostra a aula? |
| --- | --- | --- | --- | --- | --- |
| **Grade de estado** | Khan, grade de domínio | 182 skills / 17 unid. | **1.212 px** | **6,6** | não (quadrado anônimo) |
| **Fração por seção** | Scrimba, Frontend Path | 947 itens / 13 seções | **4.271 px** | 4,5 (amortizado) | não (só a contagem) |
| **Acordeão colapsado** | MS Learn, path | 41 units / 5 módulos | ~2.600 px | ~63 quando aberto | sob demanda |
| **Lista toda expandida** | Boot.dev, Backend Path | 203 caps / 17 cursos | **12.121 px** | **60** | sim, todas |
| **Árvore permanente** | The Rust Book, sidebar | 111 links | **4.205 px** de scroll interno | ~38 | sim, sempre |
| **Grafo / DAG** | Exercism, 17 conceitos | 17 nós | **4.846 px** de página | **285 por nó** | **não** |
| **Busca + filtro** | Exercism, 146 exercícios | 146 | 1 tela + rolagem | — | sim, por consulta |

**Lista linear.** Aguenta até ~40 itens com cabeçalhos de seção (Odin, CS50). Nas
141 aulas vira 6.000–8.500 px — sete a nove telas — e o custo não é o scroll, é que
**nada é localizável**: sem busca, achar "a aula do fator de capacidade" exige
varrer. Boot.dev é a prova viva: 13,5 telas, tudo visível, nada encontrável.

**Árvore.** É a única forma que mostra os três níveis ao mesmo tempo. O custo é
largura permanente (280–300 px roubados da prosa) e scroll interno: a árvore
completa da Alexandria teria **~161 linhas** (3 + 17 + 141) ≈ 5.500 px de rolagem
própria, pior que a do Rust Book. **Só funciona com expansão parcial** — é o que
o Svelte faz: 4 partes visíveis, 1 expandida, 1 seção expandida, ~20 linhas na
tela em vez de 161.

**Grade.** Imbatível em densidade e a única forma que responde "o que mais existe"
e "em que pé estou" **na mesma imagem**. O preço é o anonimato: um quadrado não tem
título. Khan resolve isso usando a grade como **sumário** no topo e repetindo tudo
em lista nomeada embaixo. Para a Alexandria, 141 quadrados em 17 linhas caberiam em
**~950 px — uma tela.**

**Busca como entrada principal.** Certa para o acervo (2.124 termos, 165
instrumentos, 214 exercícios); **errada sozinha para as 141 aulas**, porque busca
pressupõe que você sabe o nome do que procura. O SEP é o caso puro: perfeito para
consultar, inútil para aprender em ordem. O híbrido que funciona é o do web.dev e
do Exercism/Practice: **campo de filtro em cima do índice**, não no lugar dele.

---

## 4. "Onde eu parei" — as cinco respostas reais

Nenhum produto resolve isso com desenho. Todos resolvem com **texto curto e
persistente**:

1. **Contador na barra da aula** — `Unit 1 of 7 ⌄` (Microsoft Learn). Clicável,
   abre o módulo inteiro. Custo: ~120 px de largura. Melhor relação custo/benefício
   que vi.
2. **Pílula flutuante** — `Chapter 1 / Getting Started` + anel + seta (Next.js
   Learn). Sobrevive a qualquer scroll, inclui o próximo passo e o atalho para o
   índice.
3. **Caminho em uma linha** — `Basic Svelte / Introduction / Welcome to Svelte`.
   Três níveis em uma linha de texto, sem cromo nenhum.
4. **Fração por grupo** — `0 / 80` por seção (Scrimba), `0/15 Chapters` por curso
   (Next.js), `Unit mastery: 0%` por unidade (Khan). Lê-se de relance ao longo de
   uma lista longa.
5. **Estado por item** — círculo vazio/cheio por linha (LeetCode, Educative,
   Trailhead, Mathigon, Exercism). É o único que responde "o que **ainda** falta"
   com precisão de aula.

**E a volta depois de duas semanas?** Observável sem login: a resposta universal é
**retomada explícita** — todos esses produtos guardam o último item e oferecem um
botão de continuar; nenhum pede que você se reoriente sozinho. Também observei o
contrário: os que **não** guardam nada (Rust Book, Mathigon deslogado, roadmap.sh
deslogado, Odin) devolvem você ao topo. Testei o Mathigon de propósito — rolei um
curso inteiro, recarreguei, `scrollY = 0`, `localStorage` sem nenhuma chave de
progresso.

**O "ONDE VOCÊ PAROU" que a v2 já tem na home é correto e deve sobreviver.** Na
captura do herói, o cartão `M01·A08 — 100 MW solar ≠ 100 MW térmica`, com
`em leitura desde 14 de setembro`, `as 7 aulas anteriores do M01 já estão
percorridas` e `CONTINUAR · M01·A08`, é mais informativo que a retomada de qualquer
produto que abri — inclusive a data e o contexto. **Isso não é cartografia, é bom
produto.** O que precisa sair é a bandeirola, o cartucho e a palavra "percorridas";
o mecanismo fica.

---

## 5. As três melhores soluções, o custo de cada uma, e a que eu usaria

### Solução A — Índice colapsado de módulo + contador `N de M` na aula
*(Microsoft Learn, Trailhead, Educative)*

Uma página de trilha com **17 cartões de módulo colapsados**, cada um com título,
uma linha de descrição, `8 aulas · 3 instrumentos · 42 termos`, estado, e um
disclosure que abre a lista das 8 aulas com o seu rótulo. Dentro da aula, um único
controle `Aula 8 de 9 ⌄` que abre o módulo, mais `Próxima aula: <nome>` no rodapé.

- **Custo:** o nível da aula fica a um clique de distância, sempre. Comparar duas
  aulas de módulos diferentes exige dois cliques. A página da trilha não mostra
  as 141 aulas — mostra 17 linhas.
- **Ganho:** ~1.700 px para a trilha inteira. Zero largura permanente roubada da
  prosa. Funciona no celular sem mudar de desenho.
- **Risco:** se o rótulo do módulo for fraco, o colapso esconde o produto. Exige
  escrever 17 descrições boas.

### Solução B — Árvore de expansão parcial em overlay
*(Tutorial do Svelte)*

Hambúrguer + caminho em uma linha na barra da aula. O hambúrguer abre a árvore das
3 trilhas, com **só a trilha atual aberta em seus módulos** e **só o módulo atual
aberto em suas aulas** — ~20 linhas na tela em vez de 161. Fecha e some.

- **Custo:** é um menu, não uma página; não serve de vitrine para quem chega de
  fora, e não cabe nele metadado nenhum (nem contagem, nem estado, nem instrumento).
  Precisa de uma segunda superfície pública para o currículo.
- **Ganho:** os três níveis visíveis simultaneamente, com a posição marcada, a
  custo zero de layout. É a melhor navegação **durante** o estudo que existe.
- **Risco:** descoberta. Quem não clica no hambúrguer nunca vê que há 17 módulos.
  O Svelte compensa escrevendo "you are here" em prosa — sinal de que o menu
  sozinho não basta.

### Solução C — Grade de estado como sumário, lista nomeada embaixo
*(Khan Academy)*

Topo da página de currículo: **141 marcas em 17 linhas**, uma por aula, com legenda
de estado e marcas distintas para quiz, checklist e caso — **~950 px, uma tela, o
currículo inteiro**. Abaixo, a mesma informação em cartões por módulo com as aulas
nomeadas e o ícone de tipo por linha.

- **Custo:** a grade não nomeia nada; sozinha é um painel de controle, não um
  índice. Exige a lista embaixo (a página do Khan tem 16.964 px por causa disso).
  Precisa de *hover*/toque para revelar o nome — e no celular a grade de 17×9
  precisa reflow.
- **Ganho:** é a **única** forma que entrega "o que existe" + "onde estou" + "o
  que falta" numa imagem só, a 6,6 px por item. E é a forma que mais se parece com
  um **instrumento de domínio** — placa, painel, tabela de dados — que é o que a
  Alexandria é.
- **Risco:** se vier com cores de semáforo, vira jogo (e viola a regra de zero
  semáforo do `AGENTS.md`). O estado tem de ser dito por **densidade de tinta e
  preenchimento**, não por verde/vermelho.

### O que eu usaria para 141 aulas de domínio técnico

**A + B + C, nessa ordem de prioridade, nessas três posições distintas** — que é
exatamente o que os três produtos de 17 módulos fazem, cada um escolhendo uma e
sofrendo por não ter as outras duas:

1. **Página da trilha = Solução A.** 17 cartões de módulo colapsados. É a superfície
   pública, é o que o visitante vê, é onde cabem os metadados que mais importam
   aqui — **instrumentos por módulo, exercícios, termos** — e que nenhum concorrente
   tem para mostrar. Rótulo no estilo Execute Program: `M07 · 9 aulas · 14
   instrumentos · 112 termos`, não "3 h 20 min".
2. **Dentro da aula = Solução B, reduzida ao mínimo do Microsoft Learn.** `Aula 8
   de 9` clicável + caminho em uma linha (`Trilha I · M01 Física de Energia ·
   Aula 08`) + `Próxima: <nome>`. Nada de sidebar permanente: a prosa autoral e o
   instrumento precisam da largura.
3. **Uma única superfície de visão geral = Solução C.** A grade de 141 marcas, numa
   página só (`/alexandria/atlas` ou o que vier a se chamar), como **painel do
   currículo inteiro**. É aqui — e só aqui — que o produto mostra os 17 módulos de
   uma vez. É também o lugar natural do herói: **a grade é o objeto gravado; o Titã
   com o globo fica ao lado dela, não por baixo dela.**
4. **Busca por cima de tudo**, no modelo `⌘K` da documentação moderna (Stripe,
   Supabase, Scrimba, Next.js), **indexando as quatro coisas separadamente**: aula,
   instrumento, termo, exercício. Com 2.124 termos e 165 instrumentos, a busca não é
   conveniência — é a porta principal do profissional que já sabe o que procura,
   que é exatamente o learner-alvo descrito ("defender um número em reunião com a
   fonte ao lado"). O glossário ganha, além disso, o índice A–Z do SEP.

**Se só der para fazer uma coisa:** a Solução A. É a que todos os produtos sérios
de escala convergiram, é a mais barata, e é a que não quebra no celular.

---

## 6. Contraindicações — o que medi e recomendo não copiar

- **Grafo/DAG para o currículo.** 285 px por nó, 17 nós em 4.846 px, e as aulas
  desaparecem. A v2 errou menos por ser mapa e mais por ser **grafo**: o problema
  não é a ilustração, é que a forma não comporta o nível da aula.
- **Lista inteira expandida.** Boot.dev, 12.121 px. Tudo visível, nada encontrável.
- **Acordeão que precisa de "ver mais".** Udemy esconde 11 de 21 seções; Codecademy
  mostra 7 de 13. Se o índice de 17 módulos precisar de um "mostrar todos", o
  módulo está grande demais ou o cartão está gordo demais. Mire em **≤ 96 px por
  cartão de módulo**.
- **Esconder o nível da aula do visitante** (Coursera, edX). A Alexandria tem 141
  aulas nomeadas, 165 instrumentos e 214 exercícios — esse inventário *é* o
  argumento de venda. Mostrá-lo é gratuito e nenhum concorrente consegue imitar.
- **Trilha gamificada de bolhas** (Duolingo). A unidade da Alexandria é grande
  demais e o leitor é adulto demais.
- **Medir o currículo em horas.** "26 h" não diferencia nada. "165 instrumentos"
  diferencia tudo.
- **Progresso que só existe logado.** Scrimba, Boot.dev, LeetCode, roadmap.sh e
  Khan todos jogam o estado atrás do cadastro, e sem ele a lista fica morta.
  Se a Alexandria puder guardar estado por item **antes** do cadastro, ela entrega
  deslogada o que esses produtos só entregam logados.
- **Semáforo no estado.** Nenhum dos bons usa verde/vermelho para "feito/não feito":
  Khan usa densidade de tinta, LeetCode e Educative usam círculo vazio/cheio,
  Microsoft Learn usa um ✓ discreto. Isso coincide com a regra de zero semáforo já
  vigente no repositório.

---

## 7. Observação final, para o eixo do clássico-moderno

Três produtos abertos aqui já resolvem a pergunta central do Founder, e nenhum deles
resolve com navegação:

- **Boot.dev** — navy, ouro, serifa, filete gravado com gema. O clássico está na
  **superfície de identidade**; a navegação é lista moderna e chata, e funciona.
- **Mathigon** — gravuras clássicas (o universo ptolomaico) **dentro do conteúdo**,
  sidebar e controles completamente modernos.
- **Our World in Data** — erudição por **aparato** (autoria assinada, `Cite this
  work`, `Reuse this work`, abas Introduction/Research/Charts), não por ornamento.

O padrão é consistente e vale como hipótese para a v3: **o clássico mora no herói,
na tipografia, na gravura e no aparato de citação; o moderno mora na navegação, no
estado e na busca.** A v2 inverteu — colocou o clássico na navegação (carta, rota,
ilha, bandeirola) e deixou o aparato pedagógico, que é o ativo real, enterrado
embaixo dele. O Titã com o globo não precisa ser tirado; precisa parar de ser o
sistema de navegação e voltar a ser o que ele é: **a capa da obra.**
