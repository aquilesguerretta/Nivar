# Eixo 2 — A aula como unidade

**Pesquisa de 2026-11-13.** Capturas e legendas em
[`capturas/02-aula/`](capturas/02-aula/LEGENDAS.md) — 29 imagens, cada uma com o que prova.

Nada aqui entra na Alexandria. Este documento não desenha tela; mede produtos reais e
diz o que a medição implica.

---

## Sumário

0. [Antes de tudo: uma medição que contradiz a premissa do brief](#0-antes-de-tudo-uma-medição-que-contradiz-a-premissa-do-brief)
1. [O que foi aberto, e o que ficou de segunda mão](#1-o-que-foi-aberto-e-o-que-ficou-de-segunda-mão)
2. [Cinco mecanismos, não vinte produtos](#2-cinco-mecanismos-não-vinte-produtos)
3. [As perguntas do brief, respondidas com número](#3-as-perguntas-do-brief-respondidas-com-número)
4. [O ponto decisivo: "ler e depois praticar" × "a prática É a aula"](#4-o-ponto-decisivo-ler-e-depois-praticar--a-prática-é-a-aula)
5. [Quem tentou e voltou atrás](#5-quem-tentou-e-voltou-atrás)
6. [A estrutura de aula que eu recomendaria](#6-a-estrutura-de-aula-que-eu-recomendaria)
7. [O que isso implica para os dez arquétipos](#7-o-que-isso-implica-para-os-dez-arquétipos)
8. [O que eu não consegui ver](#8-o-que-eu-não-consegui-ver)

---

## 0. Antes de tudo: uma medição que contradiz a premissa do brief

O brief diz que a Alexandria tem "141 aulas com **prosa autoral densa**". Fui medir na
única aula extraída string a string, `docs/alexandria-v2/extraction/m01/aula-08.json`:

| O que | Medida |
|---|---:|
| Palavras de prosa da fonte na aula M01·A08 | **289** |
| Blocos | 12 (1 lead, 3 títulos, 4 parágrafos, 1 fórmula, 1 instrumento, 1 figura, 1 destaque) |
| Seções numeradas | 3 (8.1, 8.2, 8.3) |
| Instrumentos | 1 (3 entradas numéricas → 1 saída + 1 leitura dinâmica) |
| Exercícios vinculados | 1 |
| Termos de léxico candidatos | 2 (o módulo inteiro tem 38 verbetes) |

E, no corpus inteiro (`extraction/instrumentos/instrumentos.json`, 165 instrumentos):

| O que | Medida |
|---|---:|
| Instrumentos por aula | **1,17** (165 ÷ 141) |
| Exercícios por aula | **1,52** (214 ÷ 141) |
| Termos de glossário por aula | **15,1** (2.124 ÷ 141) |
| Entradas especificadas, total | 515 (média 3,12 por instrumento) |
| Saídas especificadas, total | 580 (média 3,52) |
| Instrumentos com fórmula da fonte | 159 / 165 |
| Instrumentos com cenário-padrão | 160 / 165 |
| **Instrumentos com previsão útil já escrita, com resposta no cenário-padrão** | **108 / 165** |
| **Instrumentos com tolerância declarada pela fonte** | **1 / 165** (`m08-inst-04`) |
| Veredito permitido pelo resto | **autoavaliação em três níveis**, 164 / 165 |
| Instrumentos que prometem forma desenhada | 121 — dos quais **61 prometem e a fonte não desenha** |

Três consequências que mudam o enquadramento deste eixo inteiro:

1. **A aula da Alexandria não é um ensaio longo.** 289 palavras são ~2 minutos de
   leitura. Está na mesma ordem de grandeza de uma aula do Execute Program (415
   palavras, medidas) e de uma unidade do Microsoft Learn (1–4 min declarados). Está
   **uma ordem de grandeza abaixo** de Ciechanowski (8.116 palavras), do Comeau (5.352)
   e do Immersive Linear Algebra (7.598). Tudo que se decidir aqui tem que ser decidido
   para uma página curta e densa, não para um ensaio.
2. **O aparato é raro por aula, não abundante.** ~1 instrumento e ~1,5 exercícios por
   aula. Mathigon consegue "a prática É a aula" porque tem uma lacuna a cada ~40
   palavras; Ciechanowski, uma figura a cada 77. A Alexandria tem **um** palco por aula.
   Qualquer desenho que exija ato a cada dois parágrafos exige **inventar** ato — que é
   exatamente o que o bar chama de "quiz temático disfarçado" e proíbe.
3. **Em 164 dos 165 instrumentos a fonte não declara tolerância.** Não existe
   "certo/errado" a entregar. O que existe é **distância entre o previsto e o
   calculado** e autoavaliação em três níveis. Isso elimina de saída toda a família de
   produtos cujo motor é o veredito (Codecademy, freeCodeCamp, Khan, MS Learn) e
   aproxima a Alexandria de uma família completamente diferente, descrita no §2.

Registro como divergência (AGENTS.md, protocolo de incerteza, classe 2): **o brief
presume prosa densa; a medição diz prosa curta e aparato caro.** O resto deste
documento segue a medição.

---

## 1. O que foi aberto, e o que ficou de segunda mão

**Aberto, navegado e medido no render** (DOM medido na própria página, não lido em
descrição): Mathigon · Bartosz Ciechanowski · Josh Comeau · Khan Academy (artigo **e**
exercício, incluindo o comportamento ao errar) · Execute Program (aula completa em
modo estático) · Exercism (exercício **e** artigo de conceito) · Svelte Tutorial ·
SQLBolt · Select Star SQL · Immersive Linear Algebra · The Rust Book · Crafting
Interpreters · Red Blob Games · Setosa · Distill · PhET (simulação **e** aba de
atividades) · Microsoft Learn (módulo **e** avaliação) · Our World in Data (bloco de
fonte de um gráfico de geração elétrica) · Nicky Case · Explorable Explanations ·
Scrimba (catálogo e casca do player) · Codecademy (sílabo) · Brilliant (catálogo e
onboarding) · DataCamp (página de curso).

**Segunda mão, declarado como tal:**

| Produto | O que não deu para ver | Por quê |
|---|---|---|
| **Brilliant** | O interior da aula | Login obrigatório. Vi catálogo e onboarding ("Hi, I'm Koji! I'll be your personal tutor"). **Não afirmo nada sobre a aula do Brilliant neste documento.** |
| **DataCamp** | O campus (teoria + editor no mesmo quadro) | `campus.datacamp.com` devolve 404 sem sessão. Vi só a página de curso: 4 capítulos, "Start Chapter". |
| **Codecademy** | O editor | Redireciona para a página do curso. O sílabo público, esse sim medido: **14 lessons · 14 projects · 13 quizzes**, 24 h. |
| **Scrimba** | O scrim tocando | Paywall mole ("You can access 2 more locked scrims before signing in"). Vi a casca: painéis FILES / DEPENDENCIES / CONSOLE — um IDE com screencast dentro. Catálogo declara **140+ desafios em 9,4 h**. |
| **Coursera / Educative / Boot.dev / Hyperskill** | Interior da aula | Login, 404 ou erro 500 no momento da visita. |
| **Duolingo** | Guidebook | `/guidebook/es/1` redireciona para login. Deixo Duolingo fora: é o caso mais famoso e o menos pertinente — gamificação de hábito para língua, não currículo técnico de adulto que precisa citar fonte. |

---

## 2. Cinco mecanismos, não vinte produtos

Agrupei pelo **mecanismo**, que é o que transfere, e não pela marca.

### A. Livro com figura viva — a figura numerada que roda

**Quem:** Immersive Linear Algebra, Distill, Bartosz Ciechanowski, Josh Comeau, Red Blob
Games, Setosa, The Rust Book, Crafting Interpreters.

**Mecanismo.** Documento único, coluna de leitura, rolagem contínua. O objeto
interativo ocupa **o lugar da figura** — e, nos melhores, mantém o aparato do livro:
numeração, legenda e citação no meio do parágrafo. Immersive Linear Algebra escreve
"…is shown in **Interactive Illustration 2.1**" como link, põe o canvas ali, e legenda
embaixo: *"Interactive Illustration 2.1: This little breakout game shows the concept of
a vector. Play along for an interactive introduction. Control the paddle with left/right
keys, or touch/swipe."* No mesmo capítulo convivem **Definition 2.x, Theorem 2.x,
Example 2.x e 19 Interactive Illustrations** — a ilustração viva é só mais uma classe de
objeto numerado do tratado.

Distill faz a mesma coisa por cima: a figura viva é o **herói** da página (t-SNE rodando,
sliders `Points Per Side` / `Perplexity` / `Epsilon`, contador `Step`, play e restart) e
logo abaixo dela vem a linha de crédito do periódico — autores, afiliação, data,
`Citation: Wattenberg, et al., 2016`.

**Densidade medida** (palavras de prosa entre objetos manipuláveis):

| Produto | Palavras | Objetos vivos | Mediana entre objetos | Máximo |
|---|---:|---:|---:|---:|
| Ciechanowski, *Mechanical Watch* | 8.116 | 93 canvas | 77 | **266** |
| Josh Comeau, *Flexbox* | 5.352 | 28 (15 sliders, 9 selects) | 71 | 651 |
| Select Star SQL, cap. 1 | 1.572 | ~9 queries vivas | — | **228** |
| Red Blob Games, *A** | 2.704 | 17 SVG | — | 451 |
| The Rust Book 3.2 | 2.720 | 16 exemplos executáveis | — | — |
| Distill, *Misread t-SNE* | 2.611 | 20 canvas, 3 sliders | — | — |

**A faixa é consistente: 70 a 270 palavras de prosa antes do próximo objeto
manipulável**, com os extremos (451, 651) só onde nada é corrigido. A heurística T8 da
v2 — "no máximo ≈ 1.350 px sem ato a 1440", que é ~200–250 palavras — **cai dentro
dessa faixa**. É o único número da v2 que a pesquisa independente confirma, e ele
sobrevive à troca de visual inteira.

**Diferença que importa dentro da família.** Ciechanowski não tem **nenhum** controle
rotulado: 93 canvas, zero `input`, zero `button`, zero `h2` em 8.116 palavras —
manipulação direta do objeto, sem rótulo, sem unidade, sem faixa. Comeau, Distill e
Setosa têm sliders rotulados com leitura numérica ao lado. **A Alexandria precisa da
segunda forma e não pode usar a primeira**: o bar exige rótulo, unidade, faixa e fonte.
Setosa resolve o problema de descoberta com uma frase no topo: *"This explanation is
interactive! Dials allow you to adjust scalar values. Points that have a gray circle
around them are draggable."* — a página declara as próprias afordâncias antes do
conteúdo.

**Nenhum produto desta família corrige nada.** Não há gabarito, não há portão, não há
contagem. Josh Comeau é explícito sem querer ser: a palavra "exercises" só aparece no
artigo gratuito para **vender o curso pago**. O artigo é para entender; o exercício é
outro produto.

### B. A lacuna dentro da frase — Mathigon

**Mecanismo.** A aula é uma sequência de `<x-step>`; cada step declara `goals`. Step sem
goal é prosa; step com goal **não libera o seguinte** até os goals caírem. O ato é uma
pílula "???" **dentro da oração**: *"A graph consists of certain points called `???`,
some of which are connected by `???`."* Ao errar, a palavra entra na frase e o elemento
ganha `class="invalid"` — sem placar, sem limite de tentativas, sem revelar a resposta.
No pé: *"To reveal more content, you have to complete all the activities and exercises
above. Are you stuck? Skip to the next step or **reveal all steps**."*

**Por que funciona ali e não aqui.** Mathigon consegue portar a leitura porque tem uma
lacuna a cada ~40 palavras — o portão vira ritmo. Com 1,5 atos por aula, o mesmo portão
na Alexandria vira **uma parede por aula**. E a lacuna dentro da frase é frágil contra o
véu: a v2 já quebrou a regra do véu três vezes (L2, L10, L11) justamente porque a
resposta vazava pelo texto vizinho. Pôr a resposta **dentro** da frase multiplica essa
superfície.

**O que transfere:** a escada de escape nomeada. Todo produto que porta conteúdo tem
uma e a nomeia. Mathigon: "Skip to the next step" e "reveal all steps". Svelte: o botão
`solve`, com uma frase editorial ao lado — *"Try not to rely on it too much; you will
learn faster by figuring out where to put each suggested code block and manually typing
it in to the editor."* **Portão sem saída nomeada não existe em produto bom nenhum.**

### C. Previsão do resultado — Execute Program

**Mecanismo, e é o parente mais próximo da Alexandria.** A aula é uma sequência curta de
exemplos. Cada exemplo mostra o código e uma linha `RESULT:`. Na versão interativa, **a
linha `RESULT:` está vazia e o learner digita a previsão**. A prosa entre exemplos tem 1
a 3 frases. A aula inteira que medi ("Type Intersections") tem **415 palavras, 6
exemplos, 4 `RESULT:`**.

O curso declara o próprio orçamento: *"There are 56 lessons containing 421 code
examples. Most people finish this course in **7 hours over 12 calendar days**."* — 7,5
itens por aula, ~7,5 min de trabalho por aula, e o curso é **desenhado para ser
espalhado no calendário**, não consumido numa sentada. A revisão espaçada é o produto.

**Isso é literalmente o `quadro previsto × calculado` da v2**, repetido 421 vezes. E a
Alexandria já tem o insumo: **108 dos 165 instrumentos têm pergunta de previsão escrita,
com cenário e `resposta_no_cenario_padrao`** (ex.: *"Usina de 100 MW que gerou 220.000
MWh em 8.760 horas: qual o fator de capacidade, em %?"* → 25,1 %). Não é hipótese; está
no `instrumentos.json`.

**O limite.** Execute Program consegue corrigir porque a saída do programa **é** a
verdade. A Alexandria consegue a mesma coisa nos 108 — a saída da calculadora é a
verdade dado o cenário. Nos outros 57 **não há previsão útil**, e aí o ato tem que ser
de outra natureza (classificar, posicionar, anotar), ou não existir.

### D. Painel dividido: prosa × bancada

**Quem:** Svelte Tutorial, DataCamp, Codecademy, Scrimba, Boot.dev, freeCodeCamp.

**Mecanismo, medido no Svelte a 1440:** prosa **475 px (33 %)**, bancada **965 px
(67 %)**, editor 765 px, preview abaixo. Prosa do passo: **302 palavras**. Localizador de
três níveis na barra ("Basic Svelte / Introduction / Welcome to Svelte") com `solve` à
direita.

**Por que não serve para a Alexandria, e a razão é geométrica, não estética.** Um painel
de 33 % cabe ~300 palavras por passo. A Alexandria tem 289 palavras **na aula inteira**,
e essas 289 palavras vêm com obrigações que o painel quebra:

- T4 manda o **bloco de fonte ficar ≈ 24 px abaixo da figura, antes da prosa que a
  interpreta**. Painel dividido separa fisicamente a prosa da figura: a fonte fica de um
  lado e o número do outro.
- T8 manda a **figura ficar junto do parágrafo que ela explica**. Painel dividido fixa a
  figura e faz a prosa rolar por baixo dela: a adjacência vira coincidência.
- A promessa comercial inteira é "defender um número com a fonte ao lado". **Ao lado**
  é literal. Dividir a tela em dois mundos é exatamente o que a promessa proíbe.

### E. Artigo e exercício como itens irmãos

**Quem:** Khan Academy, Microsoft Learn, Exercism, PhET, Codecademy, Coursera.

**Mecanismo.** A unidade que o learner abre é **um item de uma lista**, e a lista mistura
tipos. No Khan, a lição "Newton's first law: Mass and inertia" é: vídeo · vídeo · artigo
· artigo · **exercício** · artigo. O artigo é 100 % estático; o exercício é página
própria com "Do 4 problems", "Skip" e "Check".

**O que o Khan faz bem e vale copiar na hora:** a tabela de equações com três colunas —
**equação · decomposição dos símbolos · significado em palavras** — e a seção nominal
**"Common mistakes and misconceptions"**. A Alexandria tem 159 fórmulas literais da
fonte e um conceito de "erro-alvo" em todo arquétipo `LUPA`: as duas peças já existem e
não têm forma canônica.

**O que o Khan faz bem no erro:** medido ao vivo — ao errar, a barra de ação troca de
`Skip | Check` para **`Hints | Try again`**. A referência não aparece por erro; a ajuda
aparece **só depois** do erro, a pedido. Não há placar visível, não há limite.

**Microsoft Learn é o padrão da formação técnica profissional, e é onde "famoso ≠ bom"
fica mais evidente.** Módulo "Describe cloud computing": **8 unidades, 24 min**, cada
unidade com minutos publicados (1 · 3 · 3 · 4 · 3 · **5 de avaliação** · 2), "Learning
objectives" com 6 verbos, "Prerequisites", 900 XP. E o ato, no fim: *"Unit 7 of 8 ·
Module assessment · 5 minutes · 200 XP · Check your knowledge"* com **três múltiplas
escolhas de recordação de definição** ("What is cloud computing?" → três paráfrases) e um
único "Submit answers". É o maior currículo técnico profissional do mundo e o ato dele é
exatamente o que o bar da Alexandria chama de quiz temático e proíbe. **Não copiar o
ato. Copiar o orçamento de minutos publicado por unidade e o localizador "Unit 7 of 8".**

**PhET é o contra-exemplo mais forte do "a prática É a aula", e vem do lugar mais
inesperado.** A simulação de circuitos mais usada do mundo em ensino de física **não tem
ato nenhum embutido**. As abas são `About · Teaching Resources · Activities · Presets ·
Translations · Credits`, e a aba Activities lista **103 atividades submetidas por
professores para aquela única simulação**, filtráveis por Grade Level, Subject, Activity
Type, Setting e Duration. O instrumento é caro e reusado; o ato é barato e numeroso;
eles são objetos **separados**, 1→N. É a mesma ideia do `C-PRESET` da v2 ("o mesmo
componente com preset por aula"), levada ao extremo e validada em escala mundial.

---

## 3. As perguntas do brief, respondidas com número

**A aula é página longa, sequência de telas, ou ambiente?**
As três existem e a escolha é previsível pelo tamanho da prosa, não pelo gosto:

| Forma | Palavras por unidade | Quem | Por quê |
|---|---:|---|---|
| Página longa com rolagem | 1.500 – 8.100 | Ciechanowski, Comeau, Immersive LA, Distill, Rust Book, Select Star SQL, Red Blob | A prosa é o produto; a figura serve a ela |
| Sequência de telas | 300 – 450 | Execute Program, Svelte, Mathigon, DataCamp, Codecademy | A prosa é andaime; o ato é o produto |
| Ambiente | ~0 de prosa de referência | PhET, Nicky Case (`playing time: 30 min`) | Não há tese a defender, há sistema a sentir |

A Alexandria mede **289 palavras de prosa de fonte por aula mais um instrumento, uma
fonte citável, 1,5 exercícios e 15 termos**. Pelo volume, cai na faixa do meio. Pelas
obrigações (fonte colada ao número, termo ligado, três níveis no ponto de uso,
recuperação com origem visível, registro), **não cabe em tela de 300 palavras**: essas
obrigações são o conteúdo. O resultado é uma página de rolagem **curta** — na ordem de 2
a 4 viewports a 1440 —, não um ensaio e não uma sequência de telas.

**Onde entra a interação — no meio do texto, no fim, ou é a própria aula?**
Nos produtos bons, **no meio**, e na casa da figura. A faixa medida é 70–270 palavras
entre objetos manipuláveis. Nos produtos de mercado (Khan, MS Learn, Codecademy,
Exercism, PhET), **no fim ou fora**, como item irmão. Nenhum produto que eu abri com
prosa autoral e fonte citável põe a interação **só** no fim.

**O exercício é parte da aula ou vem depois?**
Separação quase universal entre **manipular** (no meio, sem veredito) e **ser corrigido**
(no fim ou fora). SQLBolt deixa isso visível com uma régua literal rotulada
**"Exercise"** no meio da página: acima dela, prosa e sintaxe; abaixo, o banco real e a
tarefa. Khan e MS Learn separam por URL. Exercism separa por aba ("Dig Deeper" é o
ensino **depois** da tentativa). PhET separa por documento.

**O feedback é imediato, após tentativa, ou nunca?**
Três regimes, e o terceiro é o maior:

1. **Nunca** — Ciechanowski, Comeau, Red Blob, Rust Book, Distill, Setosa, PhET. O
   feedback é o próprio comportamento do objeto. Não existe certo nem errado.
2. **Imediato e binário** — Mathigon (`class="invalid"` na hora), Khan (`Try again`).
3. **Imediato e comparativo** — Execute Program (sua previsão × o `RESULT`), Select Star
   SQL (sua query × a tabela devolvida). **Este é o regime da Alexandria**, porque é o
   único que funciona quando não há tolerância declarada: você não é julgado, você é
   posto ao lado.

**Dá para errar sem punição?**
Em todos. Nenhum produto que abri mostra placar de erro, limite de tentativa ou cor de
reprovação no corpo da aula. O mais severo (Khan) só troca o rótulo do botão. O ponto
sensível não é punição — **é se a referência aparece por erro.** Dois comportamentos:

- Khan: a referência **nunca** aparece por erro; vem "Hints" a pedido.
- Select Star SQL: **"Show Solution" insere a solução no editor comentada entre `/* */`**
  — a referência chega como **material ao lado da sua**, inerte, que você tem que
  descomentar para usar. Não é veredito sobre a sua resposta; é um segundo documento.

Essa é a melhor invenção que encontrei nesta pesquisa inteira, e resolve a tensão que a
v2 tratou proibindo ("não existe 'Revelar gabarito'"). O problema nunca foi revelar: foi
revelar **como veredito**, no lugar da sua resposta. Revelar **ao lado**, inerte, com a
sua intacta, não quebra o C7.

**Quanto texto cabe antes de o produto exigir ação?**
Medido: **mediana 71–77 palavras, p90 ~160, máximo 266** nos produtos de prosa densa com
figura viva. Nos que corrigem, menos: Mathigon ~40, Execute Program ~70. Nos que não
pedem nada, mais: Red Blob 451, Comeau 651. A heurística T8 da v2 (~200–250 palavras)
está certa e deve ser mantida — agora com lastro externo em vez de intuição.

---

## 4. O ponto decisivo: "ler e depois praticar" × "a prática É a aula"

A v2 adotou o segundo. A pergunta do brief é se isso se sustenta em 141 aulas.

**Resposta curta: não na forma forte, e a aritmética diz por quê.**

"A prática É a aula" só funciona com **densidade de ato**. Os três produtos que fazem
isso bem têm:

| Produto | Atos por unidade | Como conseguem |
|---|---:|---|
| Mathigon | ~1 lacuna a cada 40 palavras | O ato é uma palavra; o autor escreve a lacuna junto com a frase |
| Execute Program | 7,5 exemplos por aula (421 ÷ 56) | O ato é "preveja a saída"; a saída já existe no runtime |
| Scrimba | 140+ desafios em 9,4 h | O ato é editar o código que o vídeo acabou de escrever |

A Alexandria tem **1,17 instrumento e 1,52 exercício por aula**. Para chegar à densidade
do Mathigon ela precisaria autorar algo como **7 a 10 atos por aula × 141 aulas ≈ mil a
mil e quatrocentos atos novos**, todos da camada Alexandria, todos sujeitos ao véu,
todos sem tolerância declarada pela fonte. Foi para isso que a v2 caminhou — as 131
aulas com "previsão útil" são **derivadas**, não extraídas — e é de lá que vieram os
defeitos mais caros da trilha: o véu furado no enunciado (L10), o número vivo vazando
pela linha de estado (L11), a tabela de referência entregando o ato vizinho (L3). Não é
coincidência: **quanto mais atos inventados por aula, mais superfícies por onde a
referência escapa.**

E tem o problema do veredito. **164 dos 165 instrumentos não têm tolerância declarada
pela fonte.** Um produto cujo motor é "a prática é a aula" precisa fechar o loop. A
Alexandria, na maior parte do corpus, só pode fechar com autoavaliação em três níveis —
que é honesto, e é fraco como motor de uma aula inteira. Funciona como **fecho**, não
como **estrutura**.

**Mas a forma fraca se sustenta, e é ela que eu recomendaria.** Não "a prática é a
aula", e sim: **a aula não começa sem um ato e não termina sem outro, e no meio ela é
leitura com um instrumento na casa da figura.** Execute Program prova que a previsão
numérica antes da revelação é o mecanismo mais barato e mais forte que existe para
transformar leitura em ato — e a Alexandria **já tem a previsão escrita para 108 dos 165
instrumentos**, com cenário e resposta. Não precisa inventar mil atos. Precisa usar 108.

**Quem faz bem:** Execute Program (previsão + revisão espaçada, com orçamento declarado),
Mathigon (lacuna na frase, em conteúdo com densidade que permite), Select Star SQL
(instrumento real sobre dado real, com a referência chegando como material).

**Quem não faz e acerta assim mesmo:** Ciechanowski, Distill, Immersive Linear Algebra,
Rust Book, Red Blob, PhET. Entre os produtos mais respeitados que abri, **a maioria não
corrige nada**. Isso é um dado desconfortável para quem está construindo um currículo,
e precisa ser dito: a excelência reconhecida em explicação interativa quase nunca passa
por avaliação.

---

## 5. Quem tentou e voltou atrás

**Exercism é o caso documentado, e eu vi as duas pontas.** A plataforma foi construída
como exercício + mentoria humana, sem ensino. Hoje `exercism.org/tracks/python/concepts/numbers`
é um **artigo didático de 1.088 palavras** com "Numbers in 78 exercises" ao lado. O
documento de racional da própria v3 diz, com todas as letras: *"At no point does
Exercism actually go about teaching the concepts that someone needs to learn a
language."* E registra o diagnóstico: os exercícios originais "were never designed to
teach language concepts". Eles descobriram que exercício não ensina; ensina quem
escreve. ([rationale-for-v3](https://github.com/exercism/v3/blob/master/docs/rationale-for-v3.md))

**Khan Academy veio do outro lado e encontrou no mesmo ponto.** Nasceu vídeo + exercício;
hoje a lição que abri tem **dois artigos** no meio da lista, e o artigo de revisão é
puro aparato de referência — tabela de termos, tabela de equações, erros comuns. O
produto prático acrescentou leitura; o produto de leitura (Exercism) acrescentou prática.
Os dois convergiram para **itens irmãos de tipos diferentes numa lista**.

**Mathigon mantém o portão mas pagou com uma porta.** "Reveal all steps" existe porque
conteúdo portado sem saída perde o learner. Svelte idem, com o `solve` e uma frase
pedindo que você não use.

**Codecademy mantém o editor como unidade mas rodeou de outras.** O sílabo público
declara **14 lessons · 14 projects · 13 quizzes** — três tipos de item, e o quiz é irmão
da lição, não parte dela.

**Ninguém que eu abri foi na direção oposta** — nenhum produto que tinha leitura
removeu a leitura para virar só prática.

---

## 6. A estrutura de aula que eu recomendaria

Um documento. Coluna única. Rolagem contínua. **A aula é uma prancha de um tratado que
roda**, e não uma tela de curso.

A síntese que o Founder pediu — clássico ilustrado convivendo com produto moderno —
**já existe executada, em Immersive Linear Algebra e em Distill**, e a receita dos dois é
a mesma e é de uma linha: *o aparato erudito permanece e é funcional; o objeto
interativo entra como mais uma classe numerada e legendada desse aparato.* Definition
2.1, Theorem 2.3 e **Interactive Illustration 2.1** são irmãos. A figura não é enfeite
clássico e não é widget moderno colado: é **a prancha do tratado, que agora funciona**.

A ordem:

```
[1 localizador]   Trilha › Módulo › Aula NN de M   ·   ~N min   ·   o item atual não é link
[2 cabeça]        código · título · subtítulo da fonte
[3 ATO DE ENTRADA] a pergunta de previsão do instrumento, com os valores do cenário,
                   ANTES de qualquer prosa — a única ação principal da dobra
[4 leitura]       prosa em 60–72 ch, corrida, sem quebra por figura
[5 PRANCHA Nn]    o instrumento na casa da figura: numerado, legendado, citado no texto
                  → logo abaixo: a linha de fonte (campos do §6.3)
                  → fixo na prancha: previsto × calculado
[6 leitura]       a prosa que interpreta o resultado, com os números velados até o registro
[7 ATO DE SAÍDA]  o exercício da fonte; a referência chega AO LADO, inerte
[8 registro]      Percorrido · Praticado · Serve a …
[9 próximo passo] condicional
```

### 6.1 As sete decisões, com a evidência de cada uma

**1. Um documento, não dois painéis.** Painel dividido cabe ~300 palavras de prosa
(Svelte, medido) e separa fisicamente a figura da fonte — o que T4 proíbe e o que a
promessa comercial ("a fonte ao lado") proíbe antes ainda.

**2. O ato de entrada vem antes da prosa.** É o movimento do Execute Program, e é o que
o T2 da v2 já manda. A diferença é que agora tem lastro: a previsão feita **antes** da
leitura é o único mecanismo barato que transforma leitura em ato sem inventar atos.
Insumo pronto: **108 instrumentos com pergunta, cenário e resposta**.

**3. Um palco por aula, na casa da figura, numerado.** Todo produto bom tem exatamente
um objeto dominante por unidade. Numerar e legendar não é nostalgia: é o que permite
**citar** o instrumento no parágrafo, voltar a ele, e reusá-lo entre aulas — que é
exatamente o que o `C-PRESET` precisa. Immersive LA cita por link no meio da frase; a
Alexandria deve citar "INST·06" do mesmo jeito.

**4. Entre dois objetos manipuláveis, no máximo ~250 palavras.** Faixa medida:
70–270. T8 fica como está, com fonte externa agora.

**5. A referência chega ao lado, nunca no lugar.** Select Star SQL insere a solução
**comentada** no editor. Khan nunca revela por erro. Isso permite à Alexandria ter uma
saída honesta sem violar o C7: nada de "Revelar gabarito" que substitui a sua resposta;
sim a "forma corrigida" entregue como **segundo documento, marcado como camada**, com a
sua intacta ao lado. O que a v2 já chama de `K` (comparação resposta × referência) é
isso — falta só dizer que a referência é material, não veredito.

**6. Saída nomeada, no nível da aula, não do ato.** Todo produto que porta tem uma e a
nomeia. A Alexandria já tem a certa: **"Registrar leitura sem prática"** (T10). Ela deve
ser visível desde a abertura, não só no fim — e deve ser a única saída. Nenhum ato
individual ganha botão de pular.

**7. A prancha declara as próprias afordâncias, numa frase, antes do conteúdo.** Setosa
faz isso em uma linha: *"This explanation is interactive! Dials allow you to adjust
scalar values. Points that have a gray circle around them are draggable."* Custa nada,
elimina a descoberta por tentativa, e é o jeito mais barato de cumprir o T13 ("tudo que
é arrastável tem alternativa por teclado e por lista") **em palavras**, e não só em
código. Numa aula com um palco só, essa frase pertence à legenda da prancha.

### 6.2 O orçamento declarado

Microsoft Learn publica minutos por unidade. Execute Program publica horas por curso e
**dias de calendário**. Mathigon publica "Reading time: ~10 min". Scrimba publica minutos
por seção. Isso é barato, é honesto, e a Alexandria não tem.

Com 289 palavras + 1 instrumento + 1 exercício, a aula-padrão é algo entre **6 e 12
minutos**. Recomendo publicar o número por aula no localizador, computado da contagem
real (palavras, atos, instrumento), nunca estimado por plausibilidade.

### 6.3 O bloco de fonte, e um presente do Our World in Data

A promessa é "defender um número em reunião com a fonte ao lado". O melhor bloco de
fonte que encontrei é o do Our World in Data, e ele tem **um campo que ninguém mais
tem**:

```
Métrica · Fonte · Última atualização · PRÓXIMA ATUALIZAÇÃO · Intervalo · Unidade
```

Para o gráfico de geração elétrica: *"Ember (2026); Energy Institute – Statistical Review
of World Energy (2026); … – with major processing by Our World in Data"*, "Last updated:
June 30, 2026", **"Next update: June 2027"**, "1900–2025", "terawatt-hours". Mais
citação curta para texto corrido e citação longa para bibliografia, e download do dado.

A v2 já quer isso no `C-SELO` ("quando a validade do selo vence, a aula passa a mostrar
'verificar: o estado pode ter mudado'"). **"Próxima atualização" é o campo que faz o selo
funcionar** e deve entrar no bloco canônico de fonte, ao lado de "verificado em".

### 6.4 Duas peças do Khan que a Alexandria deveria ter ontem

- **A tabela de fórmula em três colunas**: *equação · decomposição dos símbolos ·
  significado em palavras*. A Alexandria tem **159 fórmulas literais da fonte** e nenhuma
  forma canônica de apresentá-las. Esta é a forma, e resolve de quebra a L6 ("unidade
  ausente em entrada da fonte").
- **A seção nominal "Erros comuns"**. Todo arquétipo `LUPA` tem um erro-alvo declarado
  ("o erro-alvo é aceitar o número cru"). Hoje ele vive no critério de aceite, não na
  página. O Khan põe na página, com nome.

### 6.5 Onde cabem 15 termos de glossário numa aula de 289 palavras

Este é o problema de densidade que ninguém no corpus de produtos enfrenta, e a aritmética
é brutal: **2.124 termos ÷ 141 aulas = 15,1 termos por aula**, contra **289 palavras de
prosa**. Dá **um termo ligado a cada 19 palavras**. Se cada um virar sublinhado, popover
e link, a coluna de leitura morre.

Dois mecanismos observados resolvem isso, e nenhum é o que a v2 escolheu:

- **Mathigon põe a definição no próprio link, inline, sem navegação.** Medido no DOM: o
  termo "graphs" carrega, no mesmo nó, *"A graph is a collection of vertices connected by
  edges."* Um nível, uma frase, zero salto.
- **Crafting Interpreters põe o segundo nível na margem direita, fora da coluna.** A
  digressão sobre "scanning" × "lexing" — dois parágrafos — mora na margem; a prosa corre
  inteira sem ser cortada. Os blocos de código levam anotação de arquivo na mesma margem
  (`lox/Lox.java — create new file`).

A margem **não** viola a L7 da v2 ("figura lateral empurrando o parágrafo seguinte"),
porque o que vai para a margem é **texto**, não figura, e a prosa da seção continua
correndo inteira na coluna. E ela resolve o T7 ("três níveis em disclosure no ponto de
uso") melhor do que o disclosure: o terceiro nível fica **visível sem ação** para quem
quer, e invisível para quem não olha, em vez de exigir um clique de todo mundo.

Recomendo: **nível 1 na própria frase (uma linha, Mathigon), nível 2 na margem
(Crafting Interpreters), verbete completo só no glossário.** Hoje o T6 gasta duas ações
para chegar ao verbete, quinze vezes por aula.

---

## 7. O que isso implica para os dez arquétipos

**O sistema dos dez arquétipos sobrevive. O que não sobrevive é tratá-los como dez
gramáticas de página.**

A `SISTEMA.md` define cada arquétipo por "gramática a 1440 e a 390" — ou seja, cada um é
um **layout**. É daí que vieram os defeitos mais caros da r12/r13: a L1 (figura
renderizada duas vezes), a L14 (a cabeceira de 1440 espremida a 390, "26 px de largura
por 177 de altura"), a L7 (figura lateral empurrando parágrafo). Dez gramáticas é dez
vezes a chance de cada um desses.

### A troca

**De:** dez layouts de página sobre um tronco comum.
**Para:** **uma** publicação de coluna única, e **dez classes de prancha numerada** que
ocupam a casa da figura dentro dela.

| Arquétipo | Deixa de ser | Passa a ser | Aulas |
|---|---|---|---:|
| `PRANCHA` | layout de página | **Instrumento Nn** — controles rotulados + forma | 32 |
| `SISTEMA` | layout de página | **Esquema Nn** — nós, fluxos, acender por seção | 18 |
| `MESA` | layout de página | **Matriz Nn** — linha/coluna, célula abre no lugar | 17 |
| `LUPA` | layout de página | **Par de números Nn** — cartões + trilhos de declaração | 16 |
| `REGUA` | layout de página | **Régua Nn** — raias, marcos, duas linhas de data | 13 |
| `CARTA` | layout de página | **Carta Nn** — eixos, faixas nomeadas, bandeja de fichas | 10 |
| `SERIE` | layout de página | **Série Nn** — eixo de tempo, traço do learner | 9 |
| `ANATOMIA` | layout de página | **Documento Nn** — zonas numeradas + margem | 9 |

Oito dos dez viram tipos de prancha. Os dois que faltam são os que **não são figura**:

- **`DOSSIE` (8 aulas) e `SINTESE` (9 aulas) não são pranchas: são atos de módulo.** A
  barreira de registro do `DOSSIE` ("abaixo da mesa não há nada visível antes do
  registro") e a banca de enunciados da `SINTESE` não cabem numa casa de figura dentro de
  uma página de leitura — elas **são** a página. E todo produto que abri com currículo
  (Khan, MS Learn, Codecademy, Coursera) coloca a avaliação como **item irmão com URL
  própria**, não dentro da aula. **Recomendo mover `DOSSIE` e `SINTESE` da camada de
  aula para a camada de módulo** (Revisão → Avaliação, que já existe no T11). Isso tira
  **17 aulas** do problema de layout de aula e resolve a contradição do `SINTESE`, cujo
  critério de entrada já é "é a última aula do módulo".
- Restam **124 aulas** servidas por oito tipos de prancha sobre uma página só.

### O que isso ganha, concretamente

1. **Uma gramática de página para auditar, não dez.** O verificador de foco (337
   controles varridos na r13) e o do véu passam a medir uma composição, com dez
   conteúdos. A L14 deixa de ter dez portas.
2. **O 390 vira trabalho de prancha, não de página.** Hoje cada arquétipo redesenha a
   página inteira a 390. Com coluna única, a página a 390 é a mesma de 1440, mais
   estreita; **só a prancha** precisa de composição própria em retrato — que é
   exatamente o que o T13 já pede ("toda figura reflui em versão vertical própria").
3. **Os 61 instrumentos que "prometem forma e a fonte não desenha" viram backlog de
   tipo de prancha, não de aula.** Oito tipos de prancha × presets cobre 165
   instrumentos; 141 layouts de aula, não.
4. **A numeração vira funcional.** "INST·06", "Série 4.2", "Régua 12.1" passam a ser
   endereçáveis, citáveis no parágrafo e reusáveis entre aulas — que é o que a
   "recorrência intencional" do §2.5 já quer e hoje não tem nome.

### E o Titã

Este eixo não decide identidade, mas a aula é onde o clássico corre o maior risco de
virar enfeite — e os dois produtos que resolveram isso mostram a regra: **em Immersive
Linear Algebra e em Distill, o aparato clássico é carga, não decoração.** A numeração
serve para citar. A legenda serve para dizer o que fazer. A linha de crédito serve para
você defender o número. Nada ali é bandeirola.

A tradução para a aula da Alexandria é direta: **mantenha do clássico tudo que trabalha
— numeração, legenda, fonte, citação cruzada, coluna de leitura medida, serifa — e tire
tudo que só evoca.** Carta, rota, ilha, cartucho e bandeirola não trabalham em nenhuma
aula; prancha numerada trabalha em 124.

---

## 8. O que eu não consegui ver

- **Brilliant por dentro.** É o produto citado primeiro no brief e é o que menos consegui
  observar: login obrigatório na aula. Qualquer afirmação sobre "a aula interativa do
  Brilliant" neste documento seria inventada, e por isso não há nenhuma. **Se isso for
  decisivo, vale uma conta paga de um mês** — é o único jeito honesto.
- **DataCamp e Codecademy por dentro** (teoria + exercício no mesmo quadro). Vi só os
  sílabos. O mecanismo do painel dividido eu medi no Svelte, que é da mesma família e
  está aberto.
- **Scrimba tocando.** Vi a casca do player, não o scrim.
- **Coursera, Educative, Boot.dev, Hyperskill** — login, 404 ou erro do servidor na
  visita.
- **Curso técnico pago de energia.** Não achei nenhum aberto o bastante para medir. O
  substituto mais próximo e honesto é o Microsoft Learn, que é formação técnica
  profissional de verdade, aberta, e cujo padrão de ato está medido no §2.E.
- **A extração completa das 141 aulas.** Só `m01/aula-08.json` tem extração aula a aula;
  os outros 16 módulos têm `modulo.json` e `aparato.json`. A medição de 289 palavras é
  **uma aula**, não uma média, e está declarada assim no §0. Antes de fechar qualquer
  decisão de densidade, essa contagem precisa rodar nas 141.
