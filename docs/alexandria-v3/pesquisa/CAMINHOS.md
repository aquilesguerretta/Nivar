# CAMINHOS — síntese dos sete eixos

Data: 13/11/2026. Escopo: ler os sete eixos juntos, dizer onde concordam, onde
brigam, e propor três caminhos para a Alexandria v3.

**Nada aqui entra na Alexandria.** Este documento é insumo de decisão.

---

## 0. O que eu li, e o que eu não fiz

**Li inteiros, não em resumo:**
[`01-orientacao.md`](01-orientacao.md) · [`02-aula.md`](02-aula.md) ·
[`03-interativo.md`](03-interativo.md) ·
[`04-classico-moderno.md`](04-classico-moderno.md) ·
[`05-evidencia.md`](05-evidencia.md) · [`06-galerias.md`](06-galerias.md) ·
[`07-movimento.md`](07-movimento.md).

**Abri a composição do herói antes de escrever qualquer linha:**
`docs/alexandria-v2/captures/A/r09/home-E2-1440.png`. O que está lá: o Titã
gravado segurando o globo impresso na mesma chapa, nuvem gravada atrás, divisão
50/50 com a coluna de texto à esquerda — e, em cima da gravura, um cartucho
"VOCÊ ESTÁ AQUI · M01 · Aula 08 de 9", 17 bandeirolas numeradas sobre o globo,
três rótulos de trilha com linhas de chamada, e uma bandeirola "CONTINUAR ·
M01·A08". A linha de rodapé "Sobre esta figura · o globo é modelo do currículo,
não mapa geográfico; o Titã e o céu são gravura gerada, não documental" também
está lá. **Essa única tela contém o que fica e o que sai, lado a lado** — e é
por isso que ela vale mais que qualquer descrição: a gravura é excelente, e tudo
que foi desenhado para combinar com ela é o que o Founder rejeitou.

**Abri as capturas que os eixos deixaram.** O acervo tem 466 arquivos em oito
pastas (`01-orientacao` 76 · `02-aula` 32 · `03-interativo` 17 ·
`04-classico-moderno` 28 · `04-identidade` 22 · `05-evidencia` 17 ·
`06-galerias` 56 · `07-movimento` 218). Olhei, uma a uma, as que carregam as
decisões deste documento: Stripe Press (`04-classico-moderno/01`), Works in
Progress (`04-classico-moderno/02`), Lapham's Quarterly
(`04-classico-moderno/07`), a grade de domínio do Khan (`01-orientacao/01`), o
dropdown "Unit 1 of 7" do Microsoft Learn
(`01-orientacao/mslearn-unit-dropdown-open.png`), o DAG do Exercism
(`01-orientacao/03`), o cartão com barra de controle interna do Josh Comeau
(`03-interativo/joshcomeau-cartao...`) e a moldura de seis partes do OWID
(`03-interativo/owid-grapher-brasil-moldura-completa.jpg`). Li também as
legendas (`LEGENDA.md` / `LEGENDAS.md` / `_legendas.md`) de cada pasta.

**O que eu não fiz:** não abri nenhum produto novo e não acrescentei nenhuma
captura. Toda afirmação sobre produto neste documento vem do eixo que o abriu,
e está atribuída. Onde um eixo declarou que não abriu, eu repito a declaração
em vez de preencher (§6).

---

## 1. Onde os sete concordam

Seis convergências. Nenhuma delas é "os sete usaram a mesma palavra" — em cada
uma, eixos diferentes chegaram ao mesmo lugar **por instrumentos diferentes**,
e é isso que torna o sinal forte.

### 1.1 O clássico não mora na navegação. Seis eixos, seis métodos, uma frase.

Esta é a convergência mais forte do conjunto, e responde diretamente a pergunta
central do briefing.

| Eixo | Instrumento usado | Onde chegou |
|---|---|---|
| **01** | medição de rolagem e densidade em ~25 produtos de currículo | "o clássico mora no herói, na tipografia, na gravura e no aparato de citação; o moderno mora na navegação, no estado e na busca" (Boot.dev, Mathigon, OWID) |
| **02** | anatomia de aula em Immersive LA, Distill, Ciechanowski | "o aparato clássico é carga, não decoração: a numeração serve para citar, a legenda para dizer o que fazer, o crédito para defender o número" |
| **03** | DOM medido em 17 instrumentos interativos | "ilustração e instrumento são linguagens diferentes e não devem se misturar no mesmo objeto — o Titã segura o globo; ele não deve segurar o slider" |
| **04** | sonda de estilo computado em 27 sites | "clássico e moderno não se misturam, se estratificam: a imagem carrega toda a carga clássica, o tipo e a interface carregam toda a carga moderna; a colagem acontece quando as camadas vazam" |
| **06** | taxonomia de 25 galerias + 20 precedentes editoriais | "em nenhum dos seis melhores casos a metáfora clássica atravessa a navegação; ela está em objetos que o leitor olha, não em controles que o leitor opera" |
| **07** | amostragem por `rAF` em 41 produtos | "o Titã não se move, nunca; a modernidade entra pela latência, não pela decoração" |

Quatro métodos independentes (rolagem, anatomia, DOM, estilo computado) e duas
varreduras de acervo produziram a mesma regra. **Nenhum eixo encontrou um
contraexemplo**: não há, nos ~90 produtos abertos somados, um único caso em que
uma navegação ornamentada funcione. Os dois que tentaram — Public Domain Review
(gravura encaixotada, barra lateral emoldurada, 6 sombras) e David Rumsey (Times
New Roman, 251 bordas, portal de três colunas) — são os dois piores resultados
do eixo 04, e ambos têm o acervo mais parecido com o nosso.

**Por que isto importa:** o Founder pediu duas coisas na mesma frase ("ainda
quero essa vibe, mas também quero algo moderno"). A pesquisa diz que as duas
cabem porque são **camadas**, não uma mistura. A v2 não errou por ter uma
gravura; errou por ter deixado a gravura vazar para a camada de controle.

### 1.2 A negativa cartográfica tem prova dura, e ela não é de gosto

Dois eixos, dois produtos, a mesma demonstração:

- **David Rumsey** (eixo 06, `g08`): 151.758 mapas históricos — a maior coleção
  do mundo — e a navegação é **busca e lista**. A home não é um mapa. A
  instituição com mais direito do planeta de usar mapa como navegação usa mapa
  como conteúdo e busca como navegação.
- **Exercism** (eixo 01, `01-orientacao/03`): a aba *Learn* é um DAG de 17
  conceitos numa página de 4.846 px onde **as 146 aulas desaparecem** (viram
  bolinhas anônimas dentro de cartões); a aba *Practice*, no mesmo produto, é
  busca + chips com contagem + grade. **O mesmo produto já respondeu a pergunta
  da Alexandria**, e escolheu a lista.

Abri a captura do DAG. Ela é, visualmente, a v2 em outra fantasia: nós com
círculos sem rótulo, arestas pontilhadas, e o nível que o learner precisa —
o exercício, a aula — invisível.

O diagnóstico do eixo 01 é o mais preciso dos sete, e eu assinaria: **"a v2
errou menos por ser mapa e mais por ser grafo: o problema não é a ilustração, é
que a forma não comporta o nível da aula."** 17 nós cabem num território. 141
aulas não cabem — nem num globo, nem num DAG, nem em rota nenhuma.

### 1.3 O aparato é a identidade — e a Alexandria já o tem escrito

É a contrapartida positiva de 1.1, e aparece em cinco eixos:

- **06**: a categoria "Cream & serif" do Refero, aberta, contém Savor, Amrit
  Palace, Alison Roman, Ghia, re_grocery — comida. **Pergaminho + serifa,
  sozinhos, não leem como erudição; leem como gastronomia artesanal.** O que
  produz erudição nos precedentes é legenda de figura, crédito, citação,
  unidade, faixa, fonte.
- **03**: a procedência colada no instrumento (Electricity Maps: `Source` +
  `Methodology` + endpoint; OWID: a linha `Note:` entre o dado e a fonte). A
  Alexandria tem **fórmula da fonte com módulo e número de linha em 159/165**.
- **05**: OWID põe "Cite this work" e "Reuse this work" **acima do primeiro
  parágrafo**. Para quem precisa "defender um número em reunião com a fonte ao
  lado", procedência não é detalhe de rodapé: é a função principal.
- **01**: o metadado que nenhum concorrente tem para mostrar —
  `M07 · 9 aulas · 14 instrumentos · 112 termos`.
- **02**: numeração funcional ("INST·06", "Série 4.2") que torna a figura
  citável no parágrafo e reusável entre aulas.

**O aparato já está escrito.** 165 instrumentos com entrada rotulada, unidade,
faixa e fórmula literal; 2.124 termos com definição e módulo de origem; 214
exercícios; 159/165 fórmulas da fonte. A pesquisa não pede para criar a
erudição — pede para **parar de enterrá-la embaixo de cartucho e deixá-la
aparecer**.

### 1.4 O estado inicial nunca é vazio, e o veredito em prosa é o ativo exclusivo

O eixo 03 mediu: Ciechanowski abre com a animação **rodando**, com entalhe no
valor padrão; Distill abre em `α = 0,02, β = 0,99` com a trajetória desenhada;
OWID abre no Brasil, 1990–2025, em TWh, com as nove séries rotuladas;
Electricity Maps abre no instante atual com três números de manchete. **Nenhuma
boa referência abre vazia esperando você mexer.**

A Alexandria tem isso especificado — `cenario_padrao` com entradas, saídas
renderizadas e **veredito em prosa** — e o eixo 03, que abriu dezessete
instrumentos de referência, escreveu a frase mais importante dos sete
documentos sobre o ativo: *"Isso é melhor do que tudo que abri hoje. Nenhuma
referência tem equivalente."* O veredito do swap ("isso não é um erro: é o
preço do seguro num ano em que não houve sinistro") é a voz de quem já
defendeu o número em reunião.

Existem **42 de 165**. Fechar essa lacuna é prosa de domínio, não engenharia, e
é o item de maior retorno em toda a pesquisa.

### 1.5 Corte, não animação. Densidade de tinta, não semáforo.

O eixo 07 mediu 41 produtos e achou que, nos que de fato se sentem modernos, a
mediana da transição é **100–200 ms de cor**, a caixa não muda um pixel no
hover (`boxDelta: [0,0]` em Linear e Stripe), o foco aparece em corte, o tooltip
do OWID tem `transition: all | 0s`, e a figura que ensina **não se mexe
sozinha** (Ciechanowski: 30 canvas, `document.getAnimations().length === 0`).

O eixo 01, por outro caminho, achou que **nenhum dos bons usa verde/vermelho**
para feito/não feito: Khan usa densidade de tinta, LeetCode e Educative usam
círculo vazio/cheio, Microsoft Learn usa um ✓ discreto.

As duas coincidem com invariantes que já valem no repositório (zero semáforo,
zero `box-shadow`, raio zero). **É o caso raro em que a medição externa confirma
a regra da casa** — e o eixo 07 acrescenta o que faltava: a regra precisa de
**teste automático**, não de disciplina, porque animação infinita é a categoria
que sobrevive a todas as revisões (Linear mantém 150 delas mesmo sob
`prefers-reduced-motion: reduce`).

### 1.6 Uma coluna, uma largura, e o celular já tem resposta medida

- **03**: a figura é `min(largura intrínseca, coluna de texto)`. Em 375 px a
  coluna é 337 e **todos** os canvas viram 337. "No celular a figura vira a
  coluna." Nada é descartado; só o chrome é reetiquetado (OWID: o trocador de
  vista perde a palavra, o controle de escopo a mantém).
- **04**: a 375×812 a Ronda Noturna continua **100vw × 100vh** com
  `object-fit: cover` — **no celular o bom herói corta, não encolhe.** Quem
  reduz a imagem a uma faixa de 160 px perde o herói e fica com um selo. Para a
  Alexandria, o ponto de ancoragem óbvio do recorte é **o globo**, não o rosto.
- **02**: uma publicação de coluna única significa que a página a 390 é a mesma
  de 1440, mais estreita — só a **prancha** precisa de composição própria em
  retrato.

### 1.7 A unidade de consumo é menor que o módulo

**01** (Execute Program mede o curso por densidade, não por horas), **02**
(orçamento declarado por unidade: minutos no MS Learn, "Reading time ~10 min" no
Mathigon), **05** (a sessão com tamanho declarado, o on-ramp de duas semanas, o
compromisso declarado que sobe conclusão ~40% contra lembrete ≈ 0). Os três
querem a mesma coisa: **um objeto com começo, fim e tamanho dito antes de
começar.** Hoje a Alexandria não tem nenhum — a menor unidade declarada é a
aula, e ela não declara tamanho.

(Os eixos 01 e 05 brigam sobre *qual número* vai na home. Isso é o §2.1.)

---

## 2. Onde brigam

Três conflitos reais. Em cada um eu digo de que lado ficaria, e por quê. Não
vou conciliar os dois primeiros: eles são incompatíveis no mesmo pixel.

### 2.1 Conflito do inventário — o eixo 01 contra o eixo 05, na mesma linha da home

**O eixo 01 diz:** *"Medir o currículo em horas: '26 h' não diferencia nada;
'165 instrumentos' diferencia tudo."* E: *"Esconder o nível da aula do visitante
(Coursera, edX) é anti-padrão — as 141 aulas nomeadas, 165 instrumentos e 214
exercícios são o argumento de venda; mostrá-los é gratuito e nenhum concorrente
imita."*

**O eixo 05 diz:** *"141 aulas é, pela evidência, um fator de abandono, não um
argumento de valor."* Jordan (2015), 221 MOOCs: conclusão mediana **12,6%**, e
**cursos mais longos concluem menos**. *"A Home vende inventário; a evidência
diz para vender tempo."*

Isso é oposição direta, não ênfase diferente. E os dois estão certos sobre
leitores diferentes: o 01 está certo sobre **quem ainda está decidindo se isto é
sério** (diferenciação); o 05 está certo sobre **quem já decidiu e precisa
terminar** (conclusão).

**De que lado eu fico: do 05, na posição; do 01, na página.** O contrato de
tempo ocupa o lugar onde o olho cai e onde o "CONTINUAR · M01·A08" já está; o
inventário desce para **aparato** — 11–13 px, caixa alta espacejada, o registro
que Noema (10px/+0,75px), Quanta (10px/+3px) e Lapham's (14px/+2,52px) usam
para olho e crédito.

**E há um desempate que não é meu:** o eixo 06 catalogou "contagem do acervo
como manchete" como **tique genérico T40** ("2.931 hand-picked websites",
"1.084.659 items"), e escreveu, antes de saber do conflito, exatamente a
resolução: *"A Alexandria tem números reais (17/141/165/2.124) — eles valem como
aparato de sumário, não como manchete."* Três eixos, uma saída.

O que o 01 ganha e não perde: o nível da aula continua **visível ao visitante**,
nomeado, nos 17 cartões de módulo. O que sai é a manchete, não a transparência.

### 2.2 Conflito do ato — o que a evidência quer contra o que o corpus suporta

Este é o conflito duro, e é o que o briefing previu ("entre o que engaja e o que
ensina").

**O eixo 05** traz os efeitos mais robustos da literatura e constata que valem
**zero** hoje: espaçamento (g ≈ 0,74 para recuperação espaçada), recuperação
(g ≈ 0,50), intercalação (g ≈ 0,42, e cresce com similaridade), doer effect
(~6× ler). E conclui: *"A maior lacuna da Alexandria não é visual. É que nada
volta. Qualquer redesign que preserve essa ausência estará discutindo
acabamento."*

**O eixo 02** foi medir o corpus e achou a aritmética que proíbe a forma forte:
**1,17 instrumento e 1,52 exercício por aula**; a aula medida (`m01/aula-08`)
tem **289 palavras**, não prosa densa. Para chegar à densidade do Mathigon (uma
lacuna a cada ~40 palavras) seriam **1.000 a 1.400 atos novos**, todos da camada
Alexandria, todos sujeitos ao véu — *"e foi exatamente por aí que vieram os
defeitos mais caros da trilha (L2 véu furado, L10 véu furado no enunciado, L11
número vivo vazando pela linha de estado, L3 tabela entregando o ato
vizinho)"*. E: **164 dos 165 instrumentos não têm tolerância declarada pela
fonte** — não existe certo/errado a entregar na maior parte do currículo.

**De que lado eu fico: do 02 dentro da aula, do 05 fora dela.** E essa não é
uma conciliação diplomática — é uma escolha que custa alguma coisa aos dois.

- **Dentro da aula, o 02 vence e o 05 perde a densidade que gostaria.** Não se
  inventa ato por aula. A aula ganha dois atos, não dez: a previsão na entrada
  (já escrita em **108/165**) e o registro na saída. O histórico de defeitos é
  evidência de primeira mão, e vale mais aqui que uma meta-análise feita em
  estudante com prazo — que é a ressalva que o próprio eixo 05 abre seu
  documento declarando.
- **Fora da aula, o 05 vence e o 02 não tem objeção**, porque o material já
  existe. A Decisão 5 do eixo 05 — o exercício intercalado de discriminação
  ("qual destes instrumentos responde a esta pergunta?", "isto é potência ou
  energia?") — é o único item da lista dele que **não precisa de uma linha de
  conteúdo novo**: os distratores saem dos instrumentos vizinhos no
  `instrumentos.json`, que já tem rótulo, unidade e faixa. Fator de capacidade ×
  fator de carga × disponibilidade; MW × MWh; energia assegurada × garantia
  física; tarifa × preço × custo. É exatamente o material em que a intercalação
  rende mais, e está de bandeja.

**O que isso compra:** espaçamento e intercalação deixam de ser zero sem
multiplicar as superfícies por onde a referência escapa. O véu quebra onde há
ato inventado perto de prosa; um item de discriminação numa superfície separada
não tem prosa vizinha para furar.

**O que isso não resolve, e eu não vou fingir que resolve:** com tolerância em
1 de 165, o eixo "Demonstrado" continua vazio e a correção continua sendo
autoavaliação em três níveis. O eixo 05 está certo de que isso é fraco. Mas
escrever tolerância é trabalho de domínio revisável, não de design — é a
Pergunta 5 do §5, e é do Founder.

### 2.3 Conflito da tipografia — "manter a vibe" contra o que foi medido

Menor que os dois primeiros, mas é o que tem a correção mais barata dos sete
documentos, então registro.

Os eixos 01, 02 e 06 dizem "o clássico mora na tipografia". O eixo 04 foi medir
a tipografia e achou o seguinte: **todo elemento em tamanho de display da
Alexandria é Cinzel caixa alta com tracking positivo** — `display` 46px
**+0,10em**, `h1` 32px +0,12em, `h2` 22px +0,14em — enquanto o polo moderno
medido (Vercel, Railway, Clerk, Linear, Asimov, Getty, Resend) opera entre
**−0,02 e −0,06em**. Distância de 0,12 a 0,16em.

E a consequência, que é o achado que eu levaria ao Founder antes de qualquer
outro: *"Mesmo que você apagasse hoje todos os mapas, trilhas, bandeirolas e
cartuchos, a Alexandria continuaria lendo como antiga — porque a tipografia,
sozinha, é uma inscrição romana."*

**De que lado eu fico: do 04, sem reservas** — porque ele é o único que mediu, e
porque a correção não contradiz os outros três. Cinzel não sai; **muda de
posto**. A v2 já contém a resposta num token: `tese` é Lora 500 a 50px com
**−0,01em em caixa mista**, que é precisamente o registro medido em Asimov,
Getty, Wellcome e Resend. Promover `tese` a display e rebaixar Cinzel caixa alta
+0,18em para o aparato de 11–13 px — que é onde Noema, Quanta e Lapham's
colocam o deles — mantém a erudição e faz o display ler como 2026.

**A prova de que isso é o eixo certo são duas capturas que eu abri lado a
lado.** Lapham's Quarterly (`04-classico-moderno/07`) é Adobe Caslon — revival
de 1722 — em tudo, wordmark centralizado sobre foto do produto impresso: o
clássico sem contraparte moderna, e lê como 2014. Stripe Press
(`04-classico-moderno/01`) é Ivar em 16–25 px nas margens, com os livros como
objetos 3D num campo marrom-quase-preto: o clássico confinado ao objeto, e lê
como agora. **A diferença não é a fonte ser serifada. É o tamanho em que cada
registro mora.**

---

## 3. Três caminhos

Os três mantêm o Titã e o globo, porque é requisito do Founder. **A diferença
entre eles não é intensidade: é o que o produto é, e por onde o leitor entra** —
e, em consequência, qual é o *trabalho* do herói.

| | O produto é… | Entra-se por… | O Titã é… |
|---|---|---|---|
| **I — A PUBLICAÇÃO** | um tratado que roda | a trilha | a **capa** da obra |
| **II — O GABINETE** | um acervo de 165 instrumentos com currículo que ensina a operá-los | o índice e a busca | a **portada** do gabinete |
| **III — O OBJETO** | um objeto único num campo contínuo | o próprio objeto | o **produto** |

Uma **rodada** aqui é uma wave de construção que fecha com captura nos três
viewports e auditoria — a unidade que o repositório já usa.

---

### CAMINHO I — A PUBLICAÇÃO

**Tese em uma frase.** A Alexandria é um tratado que roda: uma publicação de
coluna única com aparato funcional, navegação moderna e sem metáfora, e o Titã
é a capa da obra — grande, imóvel, uma vez.

**O que muda na tela.**

1. **Herói:** modo A/B do eixo 04. O Titã recebe o campo inteiro — 100vw,
   sangrado, **sem a divisão 50/50, sem cartucho, sem bandeirola, sem marca de
   carta**. No celular permanece 100vw × 100vh com `object-fit: cover` ancorado
   no globo. A linha "Sobre esta figura" **fica** — é o mecanismo que o eixo 06
   identificou em Monocle e NYPL como o que impede a imagem de virar enfeite.
2. **Home:** acima da dobra, o contrato de tempo (§2.1) e o "ONDE VOCÊ PAROU"
   que já existe — o eixo 01 abriu ~25 produtos e disse que **a retomada da v2
   é melhor que a de qualquer um deles**; o que sai é a bandeirola e a palavra
   "percorridas", não o mecanismo. O inventário desce a aparato de 11–13 px.
3. **Trilha:** 17 cartões de módulo colapsados (modelo Microsoft Learn/
   Trailhead), ≤96 px por cartão, ~1.700 px no total, com o metadado que ninguém
   tem: `M07 · 9 aulas · 14 instrumentos · 112 termos`.
4. **Visão geral:** uma superfície só, a grade de 141 marcas em 17 linhas
   (modelo Khan, `01-orientacao/01`), ~950 px, com estado por **densidade de
   tinta** e marcas distintas para quiz, checklist e caso. **É aqui que o Titã
   fica ao lado da grade, não por baixo dela** — a grade é o objeto gravado.
5. **Aula:** um documento, coluna única, rolagem contínua. Localizador mínimo do
   MS Learn (`Aula 8 de 9 ⌄` + caminho em uma linha + `Próxima: <nome>`), **sem
   sidebar permanente**. Ato de entrada (previsão) → leitura em 60–72 ch → a
   **prancha numerada** na casa da figura com a linha de fonte logo abaixo →
   prosa que interpreta → registro.
6. **Arquétipos:** os dez deixam de ser dez gramáticas de página. Oito viram
   **classes de prancha numerada** dentro de uma publicação única (124 aulas);
   DOSSIE e SINTESE (17 aulas) sobem para a camada de módulo, como Khan, MS
   Learn e Codecademy fazem com avaliação.
7. **Tipografia:** a reatribuição do §2.3 — `tese` promovido a display, Cinzel
   rebaixado a aparato.
8. **Movimento:** o vocabulário fechado do eixo 07. Corte para estado, valor,
   aba, verbete e foco; 100 ms para cor; 250 ms para bloco que entra. O herói
   entra **uma vez**, em opacidade, 250 ms, e depois é mobília.

**O que aproveita.**
- **165 instrumentos:** três portes vindos da própria distribuição medida —
  inline (0–1 entradas, 53) · cartão (2–4, 75) · bancada (5+, 37). 78% são
  inline ou cartão: **a premissa de que instrumento exige painel é falsa para
  quatro em cada cinco deles.**
- **2.124 termos:** `<x-gloss>` inline na primeira ocorrência (modelo OWID
  "terawatt-hours") + índice bidirecional (termo → aulas que o usam; aula →
  termos que introduz), mecanismo pronto em Typewolf e The Component Gallery.
- **10 arquétipos:** 8 sobrevivem como tipos de prancha, 2 viram atos de módulo.
  Nada é jogado fora.
- **107 imagens:** vão para dentro do conteúdo, como figura com legenda e
  crédito — o modelo Mathigon (gravura clássica dentro do conteúdo, interface
  moderna em volta).
- **Backend de progresso:** usado como está. "Onde você parou" sobrevive
  inteiro; a grade de 141 marcas é a mesma chave de estado em outra forma.
- **Harness de captura:** ganha **uma** gramática de página para medir em vez de
  dez — o eixo 02 mostra que é daí que vieram a L1, a L7 e a L14.
- **Auditor:** as cinco asserções mecânicas do eixo 07 §8.5 (`boxDelta` zero,
  diff normal × `reduce`, amostragem `rAF`, nenhuma propriedade de layout em
  transição, `getAnimations().length === 0` em repouso) entram como regras — o
  que transforma "zero animação ambiente" de disciplina em gate.

**Custo: 3 a 4 rodadas.** É majoritariamente **subtração e reatribuição**, não
construção. (1) tokens e tipografia + herói de campo inteiro; (2) trilha de 17
cartões + grade de 141; (3) aula de coluna única + as oito classes de prancha;
(4) glossário bidirecional + busca ⌘K sobre quatro índices.

**Risco.** É o caminho mais imitável. O próprio eixo 06 avisa sobre o modelo de
três colunas do Stripe Docs: *"é o padrão correto e também o mais genérico — a
identidade tem de vir da matéria, não da estrutura."* Se o aparato não aparecer
com força (fórmula da fonte, unidade, faixa, veredito, crédito), isto lê como
documentação boa com uma capa bonita. E o Titã corre o risco específico que o
eixo 04 nomeia na Direção 3: **vira splash de abertura**, e a vibe erudita passa
a depender só de tipografia.

---

### CAMINHO II — O GABINETE

**Tese em uma frase.** A Alexandria não é um curso com calculadoras anexadas: é
um gabinete de 165 instrumentos de energia, e o currículo é o manual que ensina
a operá-los — então a porta de entrada é o índice dos instrumentos, não a
trilha.

**O que muda na tela.**

1. **A superfície primária passa a ser o índice**, no modelo que o Exercism já
   provou ser o lado certo do seu próprio produto (aba *Practice*): busca por
   título + chips de filtro com contagem (`165 instrumentos · 141 aulas · 2.124
   termos · 214 exercícios`) + grade. Cada instrumento é indexado **pela
   miniatura da sua própria figura** (truque do Seeing Theory); para os 124 sem
   desenho declarado, a miniatura é a leitura principal em tipo grande — que já
   é uma assinatura.
2. **Cada instrumento tem página citável**, com a anatomia do eixo 03 §7.2:
   nome · símbolo · valor · unidade na mesma linha do controle; faixa visível no
   trilho; **fórmula da fonte com módulo e número de linha**; a aula que o
   ensina; o veredito em prosa sobre o estado inicial. Procedência acima da
   dobra, modelo OWID.
3. **A aula é escrita a partir do instrumento, não ilustrada por ele.** O
   roteiro vira: o que o learner precisa poder defender → qual instrumento
   produz esse número → que frase o invoca (terminando em dois-pontos:
   171/171 no Ciechanowski) → que veredito fecha.
4. **O schema ganha unidade de saída.** Hoje **68 de 580 saídas** têm unidade
   explícita (12%), contra 65% das entradas. Sem isso não existe "R$/MWh ↔
   R$/mês" nem "MW ↔ GW", e o learner não consegue apresentar o número na
   unidade que a mesa usa. O eixo 03 é categórico: *"para o produto cuja promessa
   é defender um número, a unidade do número defendido é o campo mais fraco do
   schema. Arrumar isso é pré-requisito, não melhoria."*
5. **O Titã é a portada do gabinete**: aparece na abertura, grande e imóvel, e
   **some de onde o assunto é um número**. Dentro do instrumento o vocabulário é
   moderno, nativo, de 1 px, com unidade e fonte — o cartão do Josh Comeau com
   barra de controle dentro da borda (`03-interativo/joshcomeau-...`), que eu
   abri e que prova que moderno e sério cabem juntos sem gravura dentro do
   controle.
6. **A trilha continua existindo**, com os 17 cartões do Caminho I — ela só
   deixa de ser a porta.

**O que aproveita.** Este é o caminho que **saca o ativo que nenhum concorrente
tem**, e o saque é específico:
- **165 instrumentos:** deixam de ser anexo e viram o produto. 159/165 fórmulas
  da fonte, 160/165 cenários-padrão, 293/515 faixas, 336/515 unidades de entrada
  — tudo já escrito, tudo hoje invisível.
- **108/165 previsões já escritas** com cenário e resposta. O eixo 03 mediu e
  escreveu a frase que mais dói: *"o mecanismo do Mathigon está especificado em
  65% do catálogo e não está ligado."* Hoje a previsão existe em **1** de 165.
- **2.124 termos:** viram a camada léxica do instrumento, com a entrada A–Z
  (modelo Stanford Encyclopedia) servindo ao acervo, não ao currículo.
- **10 arquétipos:** viram os tipos de desenho do gabinete; os **61 instrumentos
  que prometem forma e a fonte não desenha** viram backlog de oito tipos de
  prancha em vez de 141 layouts.
- **107 imagens / backend / harness / auditor:** como no Caminho I.

**Custo: 5 a 6 rodadas**, e uma delas não é de design: a correção do schema de
unidade de saída (580 saídas) e a escrita dos **123 vereditos** faltantes.

**Risco.** Três, e o primeiro é sério.
1. **Busca sozinha é a entrada errada para um currículo.** O eixo 01 é
   explícito: *"busca pressupõe que você sabe o nome do que procura — certa para
   o acervo, errada para o currículo."* Este caminho aposta que o learner-alvo
   (profissional que precisa defender um número) chega sabendo, e isso é uma
   aposta sobre quem é o público, não sobre design.
2. **Expõe a dívida na vitrine.** 61 promessas de forma sem desenho e 12% de
   unidades de saída ficam na página principal.
3. **O Titã fica mais exposto a virar splash** do que no Caminho I, porque o
   índice é o produto.

---

### CAMINHO III — O OBJETO

*Este é o caminho que deve assustar.*

**Tese em uma frase.** O Titã e o globo deixam de ser uma imagem numa página e
passam a ser **o único objeto do produto** — um campo contínuo escuro em que o
globo é o instrumento de índice dos 17 módulos, e toda a interface recua a
16–21 px nas margens.

**O que muda na tela.**

1. **Modo C do eixo 04, o do Stripe Press.** Abri a captura: **zero `<img>`**,
   um canvas **WebGL2 de 1919×1023** desenhando os livros como objetos 3D com
   capas marmorizadas, flutuando em marrom quase preto (32,24,25); em cima
   disso, **zero sombra, uma borda, raio máximo 3 px**, e tipo de 16 a 25 px.
   Na margem esquerda, uma **régua de traços** — um traço por item, o atual mais
   grosso — e um "?" no canto. **É a interface inteira.**
2. **A régua substitui o stepper.** O eixo 06 §4.2: para um produto cujo tema é
   energia e cujo aparelho são 165 instrumentos com unidade e faixa, a régua é
   nativa de um jeito que o círculo nunca vai ser. É o mesmo serviço do contador
   "7 de 9", com vocabulário de instrumento de medida em vez de vocabulário de
   formulário.
3. **O globo vira índice, e essa é a distinção política inteira deste
   caminho:** os 17 módulos são **posições sobre um objeto**, com rótulo, estado
   e faixa — não estações numa trilha, não ilhas num território. O que o Founder
   rejeitou foi a cartografia; o globo ele mandou ficar.
4. **O objeto não se mexe em repouso.** O eixo 07 dá a disciplina que separa
   isto de papel de parede animado: zero animação infinita, zero laço ambiente,
   zero pulsação — o objeto só se move **1:1 sob a mão**, como o Vaul
   (`translateY` igual ao deslocamento do ponteiro, `transition-property: none`
   durante o toque) e o Desmos (um valor por quadro de arrasto). *"Uma página
   com uma gravura imóvel no centro e controles que respondem em 100 ms lê como
   moderna; a mesma página com a gravura flutuando lê como site de agência de
   2014."*
5. **A linha vermelha, que precisa ser escrita antes de começar:** no instante
   em que qualquer coisa sobre o globo ganhar uma **rota entre dois pontos**,
   uma **ilha**, uma **estação** ou uma **bandeirola**, este caminho falhou e
   volta para o Caminho I. O globo é instrumento ou não é nada.

**O que aproveita.**
- **O Titã renderizado em Blender e o Blender no fluxo** — o eixo 04 diz que,
  das três formas de ter identidade que mediu, a do Stripe Press (identidade no
  objeto + inversão de escala) *"é a única que a Alexandria pode executar hoje,
  porque o Titã já existe"* e porque não depende de o público reconhecer a obra
  de antemão (que é a dependência do Rijksmuseum).
- **107 imagens** como material do campo contínuo.
- **165 instrumentos / 2.124 termos / 10 arquétipos:** exatamente como no
  Caminho I — **este caminho muda a casca, não o interior.** A aula continua
  sendo coluna única com prancha numerada, porque nenhum eixo achou alternativa.
- **Harness de captura:** indispensável aqui, e já existe nos três viewports.
- **Auditor:** as cinco asserções do eixo 07 §8.5 deixam de ser higiene e viram
  **a condição de sobrevivência** do caminho: são elas que provam, sem olho
  humano, que o objeto não está flutuando.
- **Backend de progresso:** o estado por aula passa a ser a densidade de tinta
  das 17 posições.

**Custo: 7 a 9 rodadas**, mais produção em Blender, mais uma **retokenização
inteira** da Alexandria (o campo escuro rompe navy-sobre-pergaminho — o eixo 04
avisa que isso *"é uma decisão de identidade, não um ajuste"*), mais o celular.
Só a parte do celular já tem resposta medida: o herói **corta**, ancorado no
globo.

**Risco.** O maior dos três, e de três naturezas:
1. **É o caminho que o Founder acabou de rejeitar, com roupa melhor.** O modo de
   falha não é feiura: é o globo reconquistar geografia. A disciplina está
   escrita acima, mas ela precisa ser sustentada por meses.
2. **Não há atalho.** O eixo 06 abriu as 43 categorias de estilo do Refero —
   destiladas de milhares de produtos reais — e **nenhuma** é "gravura",
   "prancha", "imagem de arquivo" ou "ilustração clássica". Não há concorrente
   nesse terreno e também não há quem copiar.
3. **A identidade fica refém de um ativo.** Se o render do Titã não aguentar
   100vw × 100vh num campo escuro contínuo, não há plano B — e o eixo 04 já
   registra o aviso correlato no Rijksmuseum: *"quem identifica é a obra, não o
   desenho; se a arte fosse genérica, não sobraria nada."*

**Por que ele merece existir apesar de tudo isso:** é o único dos três que passa
**com folga** no teste do logotipo coberto do eixo 04. Cubra a marca do Caminho
I e sobra uma publicação muito bem-feita. Cubra a marca do Caminho III e sobra
algo que não se parece com nada.

---

## 4. Minha recomendação

**Caminho I como espinha, com a compra imediata de duas peças — uma do Caminho
II e uma do eixo 05 — e o Caminho III tratado como prova de uma tela, não como
caminho.**

O argumento, na ordem em que me convenceu:

**1. Seis dos sete eixos, com seis instrumentos diferentes, descrevem o Caminho
I.** Não é um eixo com uma tese; é uma convergência que nenhum deles planejou
(§1.1). O Caminho III é o único que contradiz essa convergência — e contradiz de
propósito, o que é exatamente a razão de ele merecer um teste e não um
compromisso.

**2. O Caminho I muda precisamente o que o Founder nomeou, e nada do que ele não
nomeou.** A reclamação foi sobre trilhas, caminhos, banners e bandeiras. Não foi
sobre a aula, não foi sobre o instrumento, não foi sobre o Titã — e ele disse
explicitamente que o Titã e o atlas ficam. O Caminho I tira a cartografia da
navegação, mantém a gravura, e devolve o campo inteiro a ela. O Caminho II
reorganiza o produto inteiro para resolver uma queixa que não foi feita.

**3. O que faria a v3 falhar não é visual, e nenhum caminho sozinho resolve.**
A frase mais desconfortável dos sete documentos é do eixo 05: *"a maior lacuna
da Alexandria não é visual — é que nada volta."* Espaçamento e intercalação são
hoje exatamente zero. Por isso a recomendação **não é só o Caminho I**: é o
Caminho I **mais** a superfície de revisão alimentada pelo exercício de
discriminação (§2.2), que é a única peça da lista do eixo 05 que custa zero
conteúdo novo. Sem isso, qualquer escolha entre os três é, nas palavras dele,
"discutir acabamento".

**4. A peça do Caminho II que eu compraria junto, e só ela:** a **anatomia do
instrumento** (nome · símbolo · valor · unidade na linha do controle; faixa no
trilho; fórmula da fonte com módulo e linha; veredito em prosa) e a correção da
**unidade de saída** no schema. Não a inversão da porta de entrada — a anatomia.
É o que torna o aparato visível, e o aparato é a identidade (§1.3). Sem isso o
Caminho I é documentação bonita; com isso é um tratado.

**5. Duas coisas que eu faria em qualquer caminho, e faria primeiro**, porque
são as de maior retorno por hora e independem da escolha:
- **A reatribuição tipográfica do eixo 04** (`tese` a display, Cinzel a
  aparato). É um arquivo de tokens. É a maior quantidade de "lê como 2026" por
  hora de trabalho em toda a pesquisa, e sobrevive aos três caminhos.
- **O colapso dos dez arquétipos em uma gramática + oito pranchas** (eixo 02).
  Tira dez portas da L14, transforma o problema de 390 de página em prancha, e
  dá numeração citável. É a vitória estrutural mais barata dos sete documentos.

**A ressalva honesta da minha própria recomendação.** Se "moderno", para o
Founder, significar *"ninguém olha e pensa documentação"*, o Caminho I vai
decepcioná-lo, e eu prefiro dizer isso agora a descobrir na r02. Nesse caso a
resposta certa **não** é o Caminho III — é a porta do Caminho II, porque o
índice de 165 instrumentos com unidade, faixa e fórmula é a única superfície dos
três que **nenhum concorrente pode imitar** (eixo 06: nenhuma das 25 galerias
contém esse ativo; eixo 01: nenhum concorrente tem `M07 · 9 aulas · 14
instrumentos · 112 termos` para mostrar). O Caminho III é a aposta de
identidade; o Caminho II é a aposta de diferenciação. O Caminho I é a aposta de
que o aparato, aparecendo, basta — e é a única das três que a evidência
sustenta diretamente.

**Sobre o Caminho III, concretamente:** eu o faria como **uma tela**, não como
uma rodada — o herói em campo escuro contínuo com a régua de traços na margem,
rodado contra o herói do Caminho I no mesmo julgamento cego que já elegeu o
Titã 3×0. Custa uma fração de uma rodada e resolve a Pergunta 2 do §5 com
evidência em vez de opinião.

---

## 5. O que precisa do Founder

Sete perguntas fechadas. Cada uma trava ou destrava trabalho.

**1. O display da Alexandria.** Hoje é Cinzel caixa alta a +0,10em / 46 px; o
polo moderno medido está entre −0,02 e −0,06em.
- **(a)** Promover `tese` (Lora, caixa mista, −0,01em) a display e rebaixar
  Cinzel caixa alta +0,18em para o aparato de 11–13 px. *(recomendado)*
- **(b)** Manter Cinzel no display, aceitando que o produto leia como inscrição
  romana mesmo sem mapa nenhum.
- **(c)** Aposentar Cinzel e adotar uma serifa de corte contemporâneo (Ivar,
  Domaine, Source Serif 4 — todas medidas no eixo 04).

**2. Navy sobre pergaminho continua sendo a identidade?**
- **(a)** Sim. Pergaminho fica, e o Caminho III sai de cogitação agora.
- **(b)** Aberto a campo escuro contínuo (a referência medida é 32,24,25) **se**
  a prova de uma tela vencer o herói atual em julgamento cego. *(recomendado)*
- **(c)** Os dois, como modos.

**3. O que a home anuncia acima da dobra.**
- **(a)** Contrato de tempo — "Trilha I · 5 módulos · ~6 h · 20 min/dia por 12
  dias" — com o inventário rebaixado a aparato de 11 px. *(recomendado; eixo 05
  + T40 do eixo 06)*
- **(b)** Inventário como manchete — "17 módulos · 3 trilhas · 141 aulas" —
  como hoje. *(eixo 01)*
- **(c)** Inventário como manchete e tempo como subtítulo.

**4. Por onde o leitor entra no produto.**
- **(a)** Pela trilha — Caminho I. *(recomendado)*
- **(b)** Pelo índice de instrumentos com busca e filtro — Caminho II.
- **(c)** Pelo objeto — Caminho III.

**5. Orçamento de conteúdo.** É o gargalo, não é trabalho de design, e nenhuma
decisão visual o toca. Há apetite para escrever:
- **(a)** Os **123 vereditos em prosa** faltantes (42/165 existem) — o único
  ativo que nenhum concorrente tem, segundo o eixo que abriu dezessete
  instrumentos de referência. *(recomendado)*
- **(b)** **Tolerância declarada** por instrumento (1/165 hoje) — é o que
  destrava veredito conferível e, em consequência, a superfície de revisão.
- **(c)** Os dois.
- **(d)** Nenhum agora; a v3 se limita a desenho — e o eixo "Demonstrado"
  continua vazio.

**6. A superfície de revisão** (espaçamento + intercalação, hoje exatamente
zero).
- **(a)** Entra na v3 como objeto nomeado com tamanho declarado — "Revisão: 8
  itens, ~4 min" — alimentada pelo exercício de discriminação derivado do
  `instrumentos.json`, que **não exige conteúdo novo**. *(recomendado)*
- **(b)** Fica para depois; a v3 é só superfície — e os dois efeitos mais
  robustos da literatura permanecem em zero.

**7. O globo.**
- **(a)** Fica como figura dentro da composição do herói, **sem função de
  navegação**. *(recomendado no Caminho I)*
- **(b)** Vira instrumento de índice dos 17 módulos, com a linha dura escrita:
  sem rota, sem ilha, sem estação, sem bandeirola.
- **(c)** Decide depois da prova de uma tela da Pergunta 2.

**Bônus, se houver apetite para uma oitava:** progresso por item **antes** do
cadastro. Scrimba, Boot.dev, LeetCode, roadmap.sh e Khan jogam todos o estado
atrás do login, e o eixo 01 testou Mathigon e roadmap.sh deslogados — nenhuma
chave em `localStorage`, recarregar volta ao topo. Guardar estado deslogado
entrega de graça o que cinco concorrentes só entregam logados.

---

## 6. O que os eixos declararam não ter visto

Repetido aqui para que nenhuma afirmação deste documento pareça mais firme do
que é.

- **Brilliant por dentro** — login obrigatório. Declarado pelos eixos 02 e 05.
  É o produto citado primeiro no briefing e o menos observado. O eixo 02 sugere
  que, se for decisivo, vale uma conta paga de um mês.
- **Mobbin** — HTTP 403 ao painel (eixo 06). Nada neste documento vem de dentro
  dele.
- **Page Flows e Nicelydone** — acervo atrás de login/trial; vistas só as homes.
  **Screenlane** e **UI Sources** não existem mais (redirecionam).
- **Internet Archive Scholar** — não aberto (eixo 04).
- **Getty** — medido com o herói **não pintado**; a captura prova a medição, não
  a composição. **Wellcome** — primeira tentativa HTTP 429; números da segunda
  visita.
- **ncase.me/trust, PhET e Desmos** — a interação **não foi exercida** (painel
  oculto estrangula `requestAnimationFrame`); o eixo 03 descreve o que mediu e
  nada além. **GeoGebra e 3Blue1Brown** não foram abertos.
- **Linear dentro do app, Arc, Family, Notion e Figma por dentro** — login ou
  fora do navegador (eixo 07). A demo do **cmdk** redireciona e não foi medida.
- **Coursera, Educative, Boot.dev, Hyperskill por dentro** — login, 404 ou erro
  (eixo 02). **OLI** — interior exige matrícula (eixo 05).
- **Nenhum curso técnico pago de energia** foi encontrado aberto o bastante para
  medir (eixo 02). O substituto honesto é o Microsoft Learn.
- **A extração completa das 141 aulas não existe.** As 289 palavras são de
  **uma** aula (`m01/aula-08.json`); os outros 16 módulos têm `modulo.json` e
  `aparato.json`. O eixo 02 declara isso e eu repito: é uma medição, não uma
  média.

### Uma divergência entre eixos, não reconciliada

**Tolerância declarada pela fonte: 1/165 ou 2/111?** O eixo 02 mediu
direto no `instrumentos.json` e achou **1 de 165** (`m08-inst-04`). O eixo 05
leu o `bar.md` e reporta **2 de 111**, e registra a divergência de denominador
do próprio `bar.md` (§0 diz 165 instrumentos; C5 usa 111).

Não reconciliei e não inventei. Pelo AGENTS.md — *"o que foi medido vale mais
que o que o brief presumia"* — a contagem do eixo 02, feita sobre a fonte, é a
que eu usaria para orçar; mas quem for orçar a Pergunta 5 do §5 precisa fechar
isso primeiro, porque o denominador muda o custo da tolerância por um fator de
1,5.
