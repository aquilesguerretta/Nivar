# Eixo 3 — Explicação interativa

Pesquisa de campo para a Alexandria v3. Tudo aqui foi aberto no navegador e
medido no DOM. Onde não consegui dirigir a coisa, está dito.

Capturas e o que cada uma prova: `capturas/03-interativo/LEGENDAS.md`.

---

## 0. A medição que decide o eixo

Antes de qualquer opinião, três números.

**Primeiro — o contrato texto-figura do Ciechanowski não é estilo, é regra.**
Rodei o mesmo teste nos três artigos: para cada `<canvas>`, qual o último
caractere do bloco de texto imediatamente anterior.

| Artigo | Figuras | Terminam em `:` | Palavras | `<input>` no DOM |
| --- | --- | --- | --- | --- |
| Gears | 30 | **30** | 4.816 | 0 |
| Sound | 48 | **48** | 8.023 | 1 (botão do microfone) |
| Mechanical Watch | 93 | **93** | 8.117 | 0 |
| **Total** | **171** | **171 (100%)** | 20.956 | 1 |

Cento e setenta e uma figuras, cento e setenta e uma precedidas por um
parágrafo terminado em dois-pontos. Zero exceções em três artigos
independentes, escritos ao longo de cinco anos.

**Segundo — a Alexandria é muito mais leve do que a v2 a tratou.** Rodei a
distribuição de entradas sobre os 165 instrumentos de
`instrumentos.json`:

| Entradas por instrumento | Instrumentos | Acumulado |
| --- | --- | --- |
| 0 | 8 | 5% |
| 1 | **45** | 32% |
| 2 | 25 | 47% |
| 3 | 20 | **59%** |
| 4 | 30 | **78%** |
| 5 | 10 | 84% |
| 6–8 | 24 | 99% |
| 9+ | 3 | 100% |

**78% dos instrumentos da Alexandria têm 4 entradas ou menos. 32% têm uma
só.** Só 27 instrumentos (16%) passam de cinco. A premissa de que
instrumento exige painel é falsa para quatro em cada cinco deles.

**Terceiro — metade do aparato pedagógico que as melhores referências
constroem à mão já está escrito na Alexandria, e a outra metade não.**

| Campo já especificado | Cobertura |
| --- | --- |
| `formulas_da_fonte` (linhas literais do fonte, com número de linha) | **159/165** |
| `previsao.pergunta` + `cenario` + `resposta_no_cenario_padrao` | **108/165** |
| `cenario_padrao.entradas` preenchidas | 109/165 |
| `cenario_padrao.veredito` (prosa interpretando o estado inicial) | **42/165** |
| `forma_prometida.promete` | 121/165 |
| `desenho_declarado_na_fonte` | **41/165** |
| Entradas com unidade | 336/515 (65%) |
| Entradas com faixa | 293/515 (57%) |
| **Saídas com unidade explícita** | **68/580 (12%)** |

Duas lacunas medidas, e são as duas que mais importam — volto a elas na §7.

---

## 1. Ciechanowski, parágrafo a parágrafo

Esta é a pergunta que o brief manda responder com atenção, então vou devagar.

### A figura é o objeto da frase

Ciechanowski não escreve "veja a Figura 3". Ele escreve uma frase que **não
termina** — termina em dois-pontos — e a figura é o complemento. Os doze
primeiros parágrafos de *Gears*, verbatim no final:

> "…to create a fluid, unified motion**:**"
> "…you can control the fan's speed using a slider**:**"
> "…the change in object's angle of rotation per unit of time**:**"
> "…control its angular velocity with a slider**:**"
> "…the points leave a trace of the path they followed**:**"
> "…the points' distances from the center**:**"
> "…the green disc that isn't powered by anything**:**"
> "…the paths that two points on the surfaces of these discs trace**:**"
> "…affected by the ratio of radii of the two wheels**:**"
> "…roughly how big of a force would be needed**:**"
> "…ends up counting towards the torque**:**"
> "…use its radius rt as the basis for the torque calculation**:**"

Três consequências mecânicas:

1. **Não existe legenda.** Medi: depois do canvas vem ou outro canvas ou um
   parágrafo que começa assunto novo. O texto explicativo da figura é o
   parágrafo **anterior**, não o posterior. Isso inverte a convenção
   acadêmica (figura + caption embaixo) e é por isso que se lê sem saltos:
   você nunca precisa descer, ler a legenda e voltar.
2. **A prosa é o rótulo do controle.** O slider do ventilador não tem rótulo,
   não tem unidade e não tem leitura numérica — só trilho, punho e um entalhe
   no valor inicial (`ciechanowski-gears-slider-sem-rotulo.jpg`). O que diz o
   que ele faz é a frase: *"In the demonstration below you can control the
   fan's speed using a slider:"*. O controle não precisa de chrome porque a
   frase já o nomeou.
3. **A figura nunca é referenciada, logo nunca pode ser deslocada.** Não há
   numeração. A figura só existe naquele ponto do texto. Isso é uma restrição
   dura: proíbe galeria, proíbe "todos os instrumentos do módulo", proíbe
   reordenar.

### O índice compartilhado entre texto e desenho é a cor

Em *Sound* medi **438 trechos inline coloridos, em 27 cores distintas**. A
palavra "pressure increases" está escrita no mesmo vermelho da região
vermelha do desenho; "pressure decreases" no mesmo azul; "amplitude" no mesmo
dourado da seta de amplitude. Alguns exemplos, com a cor computada:

| Trecho no texto | Cor |
| --- | --- |
| `red`, `pressure increases` | `rgb(225,44,17)` |
| `blue`, `pressure decreases`, `reduces the pressure` | `rgb(40,133,200)` |
| `length`, `how far the plate moves`, `amplitude` | `rgb(195,141,8)` |
| `small cube of air` | `rgb(132,164,204)` |
| `plate`, `circular plate` | `rgb(85,85,85)` |

Isso substitui "(veja a curva vermelha)". O leitor nunca faz busca visual: a
palavra **já é** a coisa. É o mecanismo mais barato e mais subestimado do
conjunto, e é o único que funciona igual em qualquer largura de tela.

O Red Blob Games chegou na mesma solução por outro caminho: as figuras dele
declaram `--heightColor`, `--widthColor`, `--circumradiusColor`,
`--inradiusColor` como custom properties CSS, consumidas tanto pelo SVG quanto
pelos spans da prosa. **Duas das melhores referências do mundo convergiram
independentemente na mesma ideia.** Isso não é coincidência de estilo.

### O estado inicial ensina sozinho, e ele planeja isso

Toda figura nasce **rodando** — não parada esperando interação. O terceiro
parágrafo de *Gears*, antes da primeira figura interativa, é um parágrafo de
consentimento:

> "Movement is important in this article so most of the visualizations are
> animated — you can play and pause them by tapping on the button in their
> bottom left corner. By default the animations are enabled, but if you find
> them distracting, or you want to save power, you can globally pause all
> animations, just make sure to unpause them as needed."

Três coisas de uma vez: avisa que haverá movimento, ensina o controle local
(canto inferior esquerdo), e oferece um **desligamento global**. Antes de
qualquer figura. Isso é respeito pelo leitor implementado como mecanismo, não
como declaração de acessibilidade.

### Quantos controles por figura

Zero ou um, quase sempre. Das 30 figuras de *Gears*, a esmagadora maioria tem
um único slider ou nenhum controle (só arrastar a própria figura). Quando são
dois, o segundo é tempo. Nunca vi três.

### A largura da figura é `min(intrínseca, coluna de texto)`

Medido em *Gears* a 1440 px: coluna de texto 704 px; larguras de canvas 500,
350, 650, 280, 704, 350, 550, 550, 600, 500. **Nenhuma passa de 704.** A
figura é dimensionada pelo que precisa mostrar, centralizada, e no limite
iguala a coluna — nunca a excede.

### Celular

Em 375 px: coluna de texto 337 px, e **todos** os canvas viram 337 px. A
figura que era 280 continua 280 (é intrinsecamente pequena). Zero overflow,
zero scroll horizontal, zero "gire o telefone". `devicePixelRatio` 2, e ele
redesenha em 2x em vez de esticar bitmap.

A regra é simples: **no celular a figura vira a coluna.** Nada é descartado,
nada ganha scroll próprio, nada encolhe o tipo.

### O preço que ele paga, e que a Alexandria não pode pagar

**Zero `<input>` em 171 figuras.** Todos os sliders são pixels desenhados em
canvas. Isso significa: não há foco de teclado, não há leitor de tela, não há
`aria-label`, não há valor anunciado, não há como copiar o número. É lindo e é
inacessível.

E o mais importante para a Alexandria: **o slider dele não tem leitura
numérica**. Você sente "mais rápido", não lê "1.400 rpm". Para um artigo sobre
engrenagens isso é suficiente — a grandeza é qualitativa. Para um aluno que
precisa *defender um número em reunião com a fonte ao lado*, é insuficiente.

O Falstad confirma o limite por outro lado: os sliders dele se chamam
**Capacitance, Inductance, Resistance** — e também não têm valor nem unidade.
O número só existe desenhado no esquema ("1H", "1uF"). Dois simuladores
excelentes, mesma omissão.

**Conclusão parcial:** o Ciechanowski resolve texto-figura-controle melhor que
qualquer outro, mas resolve para um leitor que quer *entender*, não para um
leitor que precisa *citar*. A Alexandria tem de herdar a gramática e corrigir
a leitura.

---

## 2. Os seis modelos de acoplamento que existem

Todos medidos, não lidos.

| Modelo | Onde fica o controle | Quem dirige | Exemplar medido |
| --- | --- | --- | --- |
| **Figura no fluxo** | dentro do canvas, embaixo | leitor, opcional | Ciechanowski — 171 fig., 0 input DOM |
| **Cartão com barra interna** | dentro da moldura, rodapé | leitor, opcional | Josh Comeau — 129 inputs nativos / 5.525 palavras |
| **Duas colunas** | rádios na coluna de texto; figura no rail | leitor | Red Blob — 51 inputs, **11 dentro de `<p>`** |
| **Passo travado** | inline, na frase e na fórmula | **obrigatório p/ avançar** | Mathigon — 18 `<x-step>` com `goal` |
| **Figura fixa, texto rola** | não há controle; scroll é o controle | **autor** | The Pudding — `div.scroll-graphic` sticky |
| **Aplicativo** | rail global permanente | leitor, sem roteiro | Falstad (canvas 1274×930), Desmos |

Dois eixos de densidade, para calibrar:

| Produto | Palavras | Figuras | Palavras/figura | Controles DOM |
| --- | --- | --- | --- | --- |
| Mechanical Watch | 8.117 | 93 | 87 | 0 |
| Setosa (eigenvectors) | 1.275 | 12 | 106 | 1 |
| Gears | 4.816 | 30 | 160 | 0 |
| Sound | 8.023 | 48 | 167 | 1 |
| Josh Comeau (flexbox) | 5.525 | ~36 blocos | 153 | **129** |
| Distill (momentum) | 10.272 | 85 SVG | — | 0 |
| Seeing Theory (cap. inteiro) | **483** | 3 instrumentos | — | 12 |

Seeing Theory é o extremo oposto do Ciechanowski: um capítulo inteiro em 483
palavras, que é essencialmente um índice de três instrumentos com miniatura da
própria figura. Funciona — mas ensina *a forma de um conceito*, não como
reconstruí-lo. Ciechanowski ensina a reconstruir.

---

## 3. Como as referências rotulam unidade, faixa e fonte

Aqui a hierarquia é clara e o vencedor não é o mais famoso.

### Distill — o melhor rótulo de controle que existe

```
Step-size   α = 0.02        Momentum   β = 0.99
├────●──────────────┤       ├─────────────●────┤
0      0.003    0.006       0.00   0.500   0.990
```

**Nome em português claro + símbolo da fórmula + `=` + valor vivo**, e a faixa
marcada com três valores no trilho. O símbolo é o mesmo que aparece nas
equações do artigo. Ao lado dos controles, dentro da mesma moldura, um bloco
de prosa dizendo o que observar. Embaixo, assinatura e citação.

Isso é exatamente "defender um número com a fonte ao lado", resolvido em três
linhas de interface.

### Our World in Data — a moldura de seis partes

Medido no grapher de matriz elétrica do Brasil:

1. Título + escopo — "Electricity generation by source · Brazil, 1990 to 2025"
2. **Linha de unidade como frase** — "Measured in terawatt-hours." com
   sublinhado pontilhado em *terawatt-hours* (abre definição)
3. Abas de forma — **Table · Area · Bar**, com **Table em primeiro lugar**
4. O gráfico — unidade repetida em **cada tick** ("0 TWh … 800 TWh"), e as
   nove séries **rotuladas no fim da própria faixa**, sem legenda
5. Controle de tempo — play + duas alças (1990 / 2025)
6. **Procedência em três linhas** — `Data source: Ember (2026) and other
   sources – Learn more about this data` / `Note: Other renewables include
   geothermal, wave, and tidal; bioenergy may be included prior to 2000 due to
   limited data availability.` / `OurWorldinData.org/electricity-mix | CC BY`

A linha `Note:` é a peça que ninguém mais tem: **a ressalva fica colada no
gráfico**, entre o dado e a fonte, não em rodapé de página nem em FAQ.

Em 375 px nada disso cai. Os nove rótulos de série sobrevivem com linhas-guia,
a unidade continua em cada tick, a linha de unidade continua lá. O que muda é
só o chrome: Table/Area/Bar viram ícones; "Edit countries" **mantém a
palavra**. A regra implícita é boa: *trocador de vista perde texto; controle de
escopo não*.

### Electricity Maps — mesmo domínio, procedência por módulo

Cada módulo do painel do Brasil Central repete a mesma moldura, e acrescenta
duas coisas que a Alexandria precisa:

- **Selo de qualidade do dado ao lado do título**: `preliminary`,
  `Flow-traced`. O estado epistêmico do número é parte do rótulo.
- **O endpoint que produziu o número**: `Source: Electricity Maps` ·
  `Methodology` · `Explore the API /v4/carbon-intensity`.

E a decisão que coincide com o `AGENTS.md` da própria NIVAR: fontes sem dado
aparecem como **`?`** — "biomass ?", "coal ?", "gas ?" — nunca como zero,
nunca omitidas. "Ausência se declara, nunca se preenche por plausibilidade",
confirmado de forma independente pelo líder do domínio.

Também vale o alternador **% / GW**: a mesma série legível em duas unidades,
escolha do leitor. A Alexandria hoje **não consegue fazer isso**, e a §7 diz
por quê.

### Mathigon — o vocabulário de elementos que a Alexandria deveria ter

Medido no DOM do curso de círculos. São custom elements, e cada um tem
contraparte direta num ativo que a Alexandria já possui:

| Elemento Mathigon | Mecanismo | Ativo correspondente na Alexandria |
| --- | --- | --- |
| `<x-var bind="n1\|6\|6,30,2">` | stepper **dentro da frase**: nome, padrão, min, max, passo | `entradas[]` com `rotulo`, `padrao`, `faixa` (293 com faixa) |
| `<x-blank-mc>` | lacuna na frase **e dentro da fórmula** — "C = ???" | `previsao.pergunta` (**108 já escritas**) |
| `<x-gloss>` | definição completa no hover, com "Learn more…" | **2.124 termos** com definição literal |
| `<x-step goal="…">` | passo só libera quando o instrumento é usado | — (não existe) |
| `<x-slider steps="400">` | slider com play, vira controle de tempo | `entradas` contínuas |

E a frase inteira, verbatim, com a lacuna: *"Here is a wheel with diameter 1.
As you 'unroll' the circumference, you can see that its length is exactly
**???** [3 · π · 2π]**:**"* — note que **também termina em dois-pontos**.

`<x-var>` é a ideia mais transferível do lote: `bind="nome|padrão|min,max,passo"`
é literalmente o shape de `entradas[]` da Alexandria, faltando só a unidade.

### Josh Comeau — a prova de que moderno e sério cabem juntos

129 controles **nativos** (15 `range`, 21 `radio`, 9 `select`) em 5.525
palavras — um controle a cada 43 palavras. E as opções dos selects são o
vocabulário literal da fonte: `row`, `column`, `flex-start`, `center`,
`space-between`, `space-around`, `space-evenly`. Os mesmos tokens aparecem como
chips de código na prosa.

O cartão: moldura de 1px, preview em cima, **barra de controle dentro da
borda, no rodapé**, rotulada com o nome da propriedade e dois-pontos
(`flex-direction:` `[row ▾]`). Um toggle de exibição ("Show Primary Axis") no
canto superior, separado dos parâmetros do modelo. Modo escuro. Rail direito
com sumário e seção corrente destacada.

Isso responde diretamente o requisito do Founder: **"moderno" não é remover
peso, é usar controle nativo, moldura de 1px, rótulo com o nome real da coisa,
e dois modos.** Nenhuma dessas decisões briga com erudição.

---

## 4. Previsão antes do resultado

Três implementações reais, em ordem crescente de dureza:

1. **Nenhuma** — Ciechanowski, Falstad, Setosa, OWID. A figura já mostra a
   resposta. Você aprende olhando, não errando.
2. **Convite em prosa** — Ciechanowski às vezes faz: "You can observe what
   happens to the green disc that isn't powered by anything:". Convida a
   reparar, não cobra compromisso.
3. **Travada estruturalmente** — Mathigon. `<x-blank-mc>` no meio da frase, e
   `goal="…"` em cada var/slider/blank. **O texto não continua enquanto você
   não responder.** Há escotilha ("Reveal all steps"), mas o default é
   compromisso.

E há um quarto caso, que é da própria Alexandria. O `m08-inst-04` declara, na
própria fonte:

> "Este é o instrumento que atende diretamente o critério de domínio, e é o
> **único do sistema Alexandria que exige que você produza a resposta antes de
> ver a correção**. Sem consultar as fichas acima: estime a fatia de cada
> fonte, primeiro em capacidade, depois em geração. O instrumento devolve o
> erro por fonte, o erro total e o diagnóstico do seu viés."

Um de 165. Mas **108 instrumentos já têm `previsao.pergunta`,
`previsao.cenario` e `previsao.resposta_no_cenario_padrao` escritos.** O
mecanismo do Mathigon está especificado em 65% do catálogo e não está ligado.

Exemplo real, verbatim, de `previsao.pergunta`:

> "Consumo de 10.000 MWh/mês, swap de 8.000 MWh travado a R$ 300/MWh e PLD
> realizado de R$ 250/MWh: qual o custo efetivo, em R$/MWh?"

Isso é um `<x-blank>` pronto. Termina em dois-pontos, inclusive.

---

## 5. O que o estado inicial ensina sozinho

Esta é a pergunta mais negligenciada do brief e a mais rentável.

Todas as boas referências nascem em um estado que já é uma afirmação:

- Ciechanowski: a animação **já está rodando**, com um entalhe marcando o
  valor padrão do slider — você pode voltar.
- Distill: já começa com `α = 0.02, β = 0.99` e a trajetória desenhada; ao
  lado, prosa dizendo o que aquilo significa.
- OWID: abre no Brasil, 1990–2025, em TWh, com as nove séries rotuladas.
- Electricity Maps: abre com o instante atual e os três números de manchete
  (119 g/kWh · 86% carbon-free · 83% renovável).

Nenhum abre vazio esperando você mexer.

A Alexandria tem isso especificado, e tem melhor: **`cenario_padrao` com
`entradas`, `saidas_renderizadas` e `veredito` em prosa.** O veredito do swap,
verbatim:

> "O PLD ficou abaixo do preço travado. O swap custou R$ 400 mil e o custo
> efetivo subiu para R$ 290,00/MWh. **Isso não é um erro: é o preço do seguro
> num ano em que não houve sinistro.** A pergunta correta é se a
> previsibilidade valeu esse valor, não se o mercado caiu."

Isso é melhor do que tudo que abri hoje. Nenhuma referência tem equivalente —
Distill chega perto, mas com prosa genérica sobre o fenômeno, não sobre
*aquele* estado com *aqueles* números. É a voz de quem já defendeu o número em
reunião, e é exatamente o que separa "calculadora" de "currículo".

**Só 42 dos 165 têm.** É o maior buraco e o mais barato de fechar: é prosa, não
engenharia.

---

## 6. A pergunta que decide a Alexandria

> *Uma página com UM instrumento bem feito ensina mais que uma página com prosa
> e instrumento anexado?*

**Sim — mas a pergunta está mal colocada, e a formulação errada é exatamente o
erro que a v2 cometeu.**

O que a medição mostra é que "prosa + instrumento anexado" e "um instrumento
bem feito" não são os dois polos reais. Os polos reais são:

- **anexado** — o instrumento está na página, mas a prosa funciona sem ele e
  ele funciona sem a prosa. É o Falstad: 1274×930 de canvas, rail de
  Capacitance/Inductance/Resistance, zero palavras. Ensina quem já sabe o que
  variar. Para quem não sabe, não ensina nada.
- **acoplado** — a frase não fecha sem a figura, e a figura não se explica sem
  a frase. É o Ciechanowski, 171 vezes seguidas.

Uma página com um instrumento *acoplado* ensina mais que uma página com dez
instrumentos anexados. E uma página com um instrumento acoplado **mais** os
dois ou três parágrafos que o acoplam ensina mais do que o instrumento sozinho
— porque o parágrafo é onde moram a unidade, a faixa, a ressalva e a fonte,
que é precisamente o que o aluno-alvo precisa levar para a reunião.

Seeing Theory prova que dá pra ensinar com 483 palavras. Mas ensina *a forma de
um conceito*. O aluno da Alexandria não precisa da forma do conceito de PLD —
precisa saber que R$ 290,00/MWh é o custo efetivo, por que, com que fórmula, de
que linha do fonte, e o que responder quando alguém na mesa disser que o swap
foi um erro.

**Então: um instrumento por página, acoplado por prosa, com a prosa carregando
procedência.** Não é "instrumento no centro em vez de texto". É **o instrumento
como objeto da frase**, que é a descoberta de 171 em 171.

E uma restrição que cai daí, porque o Ciechanowski não numera nem referencia
figura: **se a figura só existe naquele ponto do texto, não existe "página de
instrumentos do módulo".** Um catálogo navegável dos 165 é uma segunda
superfície (índice/busca), nunca a superfície de aula.

---

## 7. Como os 165 instrumentos deveriam aparecer

### 7.1 Uma forma só, com três tamanhos — e o tamanho vem do dado

A distribuição manda, não o gosto:

| Porte | Entradas | Quantos | Forma |
| --- | --- | --- | --- |
| **Inline** | 0–1 | **53 (32%)** | `<x-var>`: o valor é uma palavra editável **dentro da frase**, com stepper. Sem moldura, sem cartão, sem título. A saída muda na mesma frase ou na figura logo abaixo. |
| **Cartão** | 2–4 | **75 (45%)** | Moldura de 1px no fluxo da coluna: figura/leitura em cima, barra de controle dentro da borda embaixo (padrão Josh Comeau), rodapé de procedência. Largura = `min(intrínseca, coluna)`. |
| **Bancada** | 5+ | **37 (22%)** | Cartão de largura total, controles agrupados por grupo declarado em `entradas[].grupo`, tabela de saídas sempre visível. Ainda no fluxo da aula, ainda com a frase que o invoca terminando em dois-pontos. |

**78% são inline ou cartão.** Só 22% chegam a parecer painel, e mesmo esses não
viram aplicativo com rail global — isso é o Falstad, e o Falstad não ensina.

### 7.2 A anatomia obrigatória de um instrumento

Juntando o melhor de Distill, OWID, Electricity Maps e Mathigon:

```
  ┌─ a frase que o invoca, terminando em dois-pontos: ──────────────
  │
  │  ┌──────────────────────────────────────────────┐
  │  │  [figura, ou a leitura grande]               │
  │  │                                              │
  │  │  Custo efetivo                               │
  │  │  R$ 290,00 /MWh                              │   ← valor e unidade separados
  │  │                                              │
  │  ├──────────────────────────────────────────────┤
  │  │  Preço travado   F = 300 R$/MWh   ├──●────┤  │   ← nome · símbolo · valor · unidade · faixa
  │  │  PLD realizado   P = 250 R$/MWh   ├─●─────┤  │
  │  │  Volume          V = 8.000 MWh    ├────●──┤  │
  │  ├──────────────────────────────────────────────┤
  │  │  Fórmula da fonte · M12, linhas 1636–1637    │   ← formulas_da_fonte (159/165)
  │  │  Fonte: HTML original do M12 · ver no Atlas  │
  │  └──────────────────────────────────────────────┘
  │
  └─ o veredito, em prosa, sobre o estado inicial. ──────────────────
```

Sete regras, cada uma com origem medida:

1. **A frase que invoca termina em dois-pontos.** Ciechanowski, 171/171.
2. **Nome + símbolo + valor + unidade, na mesma linha do controle.** Distill
   (`Step-size α = 0.02`), corrigido com a unidade que Distill não precisa e a
   Alexandria precisa. Corrige a omissão do Ciechanowski e do Falstad.
3. **A faixa é visível no trilho.** Distill marca 0 / 0.003 / 0.006. A
   Alexandria tem `faixa` em 293 das 515 entradas — onde não tem, declarar
   ausência, não inventar extremo.
4. **A unidade é um campo, não parte da string.** OWID e Electricity Maps
   alternam % ↔ GW porque a unidade é dado. Hoje a Alexandria renderiza
   `"R$ 290,00/MWh"` como string: **só 68 das 580 saídas têm `unidade`
   explícita (12%)**, contra 65% das entradas. Para o produto cuja promessa é
   defender um número, a unidade do número defendido é o campo mais fraco do
   schema. **Arrumar isso é pré-requisito, não melhoria.**
5. **Procedência colada no instrumento.** `Source:` + `Methodology` + endpoint
   (Electricity Maps) vira, aqui: fórmula da fonte com **módulo e número de
   linha** — já existe em 159/165 — mais link para o Atlas. Nada de rodapé de
   página.
6. **Ausência se declara.** `?` como no Electricity Maps, para toda entrada sem
   padrão, saída sem fórmula, ou faixa não declarada. Já é regra da casa.
7. **Veredito em prosa embaixo, sobre o estado inicial.** O ativo exclusivo da
   Alexandria. 42/165 hoje.

### 7.3 Controle nativo, não canvas

Ciechanowski, Falstad, Distill, Setosa, Nicky Case: **zero `<input>`**. Josh
Comeau: 129 nativos. Mathigon: custom elements sobre DOM real, com
`aria-label="Fill in this blank"` e `tabindex`.

Para a Alexandria a escolha é óbvia e é a minoritária entre as referências:
**controle nativo**. Motivos, em ordem: o número precisa ser selecionável e
copiável (vai para a reunião); o aluno pode estar no teclado; o valor precisa
ser anunciável; e `<input type=range>` + `<select>` + `<input type=number>`
cobrem 515 entradas sem um pixel de canvas. Canvas fica para o **desenho**, não
para o controle — e `desenho_declarado_na_fonte` só existe em 41 instrumentos,
então canvas é minoria do trabalho de qualquer jeito.

### 7.4 Correferência cromática em vez de "(veja a curva azul)"

Ciechanowski (438 spans / 27 cores) e Red Blob (custom properties por
grandeza) chegaram nisso independentemente. Na Alexandria: cada entrada e cada
saída recebe uma cor do sistema; a palavra na prosa, o rótulo do controle e o
traço na figura usam a mesma. Isso resolve o acoplamento sem gastar uma
palavra, e é o único mecanismo da lista que funciona igual em 375 px.

Restrição da casa: zero semáforo. A cor indexa *grandeza*, nunca *estado*.

### 7.5 Celular

Regra única, do Ciechanowski: **a figura vira a coluna** —
`min(intrínseca, coluna)`, sem scroll horizontal, sem rotacionar, redesenho em
2x. E a regra do OWID: **nada é descartado, só o chrome é reetiquetado.** O
rótulo de série vira linha-guia, não legenda; o trocador de forma vira ícone;
o controle de escopo mantém a palavra. Unidade em todo tick, em toda largura.

Para a bancada (5+ entradas) em 375 px: os grupos de `entradas[].grupo` viram
seções empilhadas, e a tabela de saídas sobe para o topo — o resultado nunca
fica abaixo da dobra dos controles.

### 7.6 Os 165 como catálogo é uma segunda superfície

Porque a figura não é numerada nem referenciada, o instrumento pertence à aula.
Um índice dos 165 existe, mas como busca/consulta — e aí vale o truque do
Seeing Theory: **indexar cada instrumento pela miniatura da sua própria
figura**, não por ícone genérico. Para os 124 sem desenho declarado, a
miniatura é a leitura principal em tipo grande, que já é uma assinatura.

---

## 8. O que muda na aula se o instrumento vira o centro

Oito mudanças concretas. Cada uma troca algo que existe hoje.

1. **A aula passa a ser escrita a partir do instrumento, não ilustrada por
   ele.** O roteiro vira: o que o aluno precisa poder defender → qual
   instrumento produz esse número → que frase o invoca → que veredito fecha. A
   prosa deixa de ser capítulo e vira acoplamento.

2. **Toda invocação de instrumento termina em dois-pontos.** Regra de escrita,
   verificável por lint, derivada de 171/171. Se a frase anterior ao
   instrumento fecha com ponto final, o acoplamento falhou.

3. **A legenda desaparece.** O que explicaria a figura sobe para o parágrafo
   anterior. Legenda vira ressalva (`Note:` do OWID) e procedência, no rodapé
   do cartão.

4. **A previsão vira o default em 108 aulas.** Já estão escritas. O instrumento
   abre com a pergunta de previsão no lugar da resposta; responder revela o
   `cenario_padrao`. Com escotilha ("ver o resultado"), como o "Reveal all
   steps" do Mathigon — mas o default é compromisso. Hoje isso existe em 1 de
   165.

5. **O veredito vira peça obrigatória, e 123 precisam ser escritos.** É o maior
   trabalho de conteúdo que esta pesquisa recomenda, e o de maior retorno:
   é o que faz o estado inicial ensinar sozinho, e é a única coisa na Alexandria
   que nenhum concorrente tem.

6. **As 2.124 definições viram `<x-gloss>` inline.** Primeira ocorrência de
   cada termo na aula vira sublinhado pontilhado com a definição literal e o
   módulo de origem no hover. É o mesmo gancho que o OWID usa em
   "terawatt-hours". Deixa de existir "ir ao glossário".

7. **O progresso passa a ser medido por instrumento usado, não por rolagem.**
   `goal` do Mathigon. A aula sabe que você mexeu, que você previu, que você
   errou — e `m08-inst-04` já prova que o sistema sabe diagnosticar viés.
   Cuidado: isso é gating, não gamificação (§9).

8. **O schema ganha unidade de saída e a interface ganha troca de unidade.**
   68/580 hoje. Sem isso não há "R$/MWh ↔ R$/mês", não há "MW ↔ GW", e o aluno
   não consegue apresentar o mesmo número na unidade que a mesa usa.

E uma mudança de contagem: pela contabilidade do próprio arquivo, **121
instrumentos prometem uma forma — 53 cumpridas na fonte, 7 em parte e 61
promessas sem desenho**. A v3 precisa decidir instrumento a
instrumento se desenha, se promete menos, ou se declara ausência — e a §7.2
dá a saída honesta: um instrumento sem desenho ainda é um instrumento completo
se tiver leitura grande, unidade, faixa, fórmula e veredito. **Forma prometida
não é dívida de figura; é dívida de clareza.**

---

## 9. Bom ≠ famoso

- **Duolingo, Khan, Brilliant** não entram nesta recomendação. O aluno-alvo é
  profissional de energia; ofensiva, streak e vida não sobrevivem ao primeiro
  dia útil corrido, e transformam "não sei" em "perdi pontos" — que é
  exatamente o oposto do que o veredito do swap ensina ("isso não é um erro").
  Gating por instrumento usado (Mathigon) é outra coisa: a trava é de
  compreensão, não de assiduidade, e não há moeda.

- **explorabl.es** é a casa do movimento e se define assim: *"a hub for
  learning through play"*, "reunite play and learning". Como catálogo de
  técnica é ótimo. Como ideologia, não serve: a Alexandria não é jogo, e o
  Founder já disse que não quer virar startup de curso. **Pegar o mecanismo,
  deixar o manifesto.**

- **Nicky Case** é brilhante e é o caso mais fácil de copiar errado. O que
  vale: declarar o orçamento de tempo antes ("playing time: 30 min") — o
  Mathigon faz igual ("Reading time: ~35 min") e a Alexandria deveria, por
  aula. O que não vale: canvas único, sem DOM, sem link profundo, sem citação.

- **PhET** tem alcance enorme e é o caso de "famoso e parcialmente bom": o
  recorte em telas nomeadas com miniatura da própria cena é excelente; mas a
  sim que abri (Energy Forms and Changes) não expõe DOM acessível nenhum, e a
  grandeza raramente aparece com unidade na tela.

- **The Pudding** tem o mecanismo mais sedutor e o mais perigoso aqui:
  scrollytelling tira o controle do leitor e entrega a sequência ao autor.
  Serve para argumento ("mostre que o bolso feminino é menor"), não para
  ferramenta ("quanto custa o meu swap"). A Alexandria tem 17 partes de um caso
  de decisão — **ali**, e só ali, scrollytelling é a forma certa.

- **O melhor do lote não é o mais famoso.** Ciechanowski, Distill e
  Electricity Maps resolvem, cada um, uma parte do problema da Alexandria
  melhor do que qualquer plataforma educacional que abri.

---

## 10. Onde isso toca o herói, e o requisito "moderno"

Não é o meu eixo, mas o eixo interativo decide uma parte da tensão, então
registro.

A composição do Titã com o globo gravado é **ilustração**, e a lição mais
consistente desta pesquisa é que **ilustração e instrumento são linguagens
diferentes e não devem se misturar no mesmo objeto**. A v2 misturou: pôs
módulos como ilhas gravadas no globo, isto é, usou a ilustração como
instrumento de navegação. É por isso que "as trilhas não fazem sentido" — um
globo gravado não tem affordance de controle, não tem rótulo, não tem faixa,
não tem estado.

A saída que as referências mostram:

- **Distill** tem assinatura, citação e tipografia de publicação séria, e os
  instrumentos dele são despojados, nativos e cinzentos. A erudição mora na
  **moldura e na procedência**, não na decoração do controle.
- **Josh Comeau** é a prova direta de que moderno é compatível com peso:
  moldura de 1px, controle nativo, dois modos, rótulo com o nome real da coisa.
  Nada de "startup de curso", nada de gravura dentro do controle.
- **OWID** carrega autoridade institucional inteira em seis linhas de texto ao
  redor de um gráfico sem ornamento nenhum.

Traduzindo para o requisito do Founder: **o Titã fica onde ilustração é o
assunto** — a abertura, a capa do módulo, o índice, os momentos de respiro — e
**some de onde o assunto é um número**. Dentro do instrumento, o vocabulário é
moderno, nativo, de 1px, com unidade e fonte. O clássico não vira enfeite
porque continua sendo a primeira coisa que se vê e a moldura de tudo; o moderno
não vira template porque a procedência, a ressalva e o veredito são conteúdo
autoral que template nenhum tem.

Dito do jeito mais curto que consegui: **o Titã segura o globo; ele não deve
segurar o slider.**

---

## 11. Inventário desta pesquisa

**Abertos e medidos em primeira mão** (DOM medido, não só lido):

ciechanow.ski/gears · ciechanow.ski/sound · ciechanow.ski/mechanical-watch ·
ourworldindata.org/grapher/electricity-mix (BR, desktop e 375 px) ·
app.electricitymaps.com/zone/BR-CS · falstad.com/circuit (LRC) ·
distill.pub/2017/momentum · redblobgames.com/grids/hexagons ·
mathigon.org/course/circles · joshwcomeau.com/css/interactive-guide-to-flexbox ·
pudding.cool/2018/08/pockets · setosa.io/ev/eigenvectors-and-eigenvalues ·
seeing-theory.brown.edu/basic-probability · explorabl.es ·
phet.colorado.edu (Energy Forms and Changes; Circuit Construction Kit DC) ·
ncase.me/trust · desmos.com/calculator

**E a fonte interna:** `docs/alexandria-v2/extraction/instrumentos/instrumentos.json`
— 165 registros, lidos e agregados por script (distribuição de entradas/saídas,
cobertura de unidade, faixa, fórmula, previsão, cenário e veredito).

**Limites honestos — não descrevo o que não vi:**

- **ncase.me/trust**: medi a tela de título (canvas único, 0 inputs, "playing
  time: 30 min", 40 traduções). **Não consegui avançar além dela** — o painel
  Browser estava oculto e aba oculta estrangula `requestAnimationFrame`, então
  cliques em canvas não registram. O jogo em si não foi exercido.
- **PhET Energy Forms and Changes**: cheguei ao seletor de telas. Mesma causa,
  mesmo limite. A sim não expõe PDOM (`aria-label`/`role` = 0), então também
  não dava para ler por acessibilidade.
- **Desmos**: layout de dois painéis verificado; **o comportamento de oferecer
  slider para variável indefinida não foi exercido** — a digitação não chegou
  ao campo matemático pelo mesmo motivo.
- **Observable** (`@observablehq/plot`): abriu, mas o conteúdo vive no runtime
  OJS e não chegou ao DOM que li (`words: 1`). Medi 45 controles e 34 SVGs.
  **Não descrevo a experiência.**
- **GeoGebra e 3Blue1Brown** não foram abertos — o limite de abas do painel
  estava saturado por sessões paralelas e preferi aprofundar os que já tinha a
  listar superficialmente mais dois.
- O painel Browser é compartilhado com outras sessões desta máquina, que
  renavegaram abas durante o trabalho; todas as medições acima foram
  reconfirmadas com a URL impressa junto do resultado.
