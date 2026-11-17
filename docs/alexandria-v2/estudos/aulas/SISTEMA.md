# Aulas da Alexandria v2 — sistema de arquétipos

**Estudo de 2026-09-17.** O mapa aula a aula está em [`mapa-aulas.json`](mapa-aulas.json), que é gerado a partir das
leituras [`m01.json`](m01.json) … [`m17.json`](m17.json).

**Status.** Proposta da camada Alexandria para o Design Loop da Peça C. Tudo aqui pode ser revisado (P3/P11), e nada
aqui é texto de fonte.

**Régua.** [`../../bar.md`](../../bar.md) (§0, §4, S1–S7, §7, §9) e
[`../../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md)
(P17–P25).

> **Pedido do Founder:** "nem toda aula precisa ter o mesmo layout; estude a melhor forma de representar cada uma,
> mas todas têm que ser do alto nível."
>
> **Resposta:** dez arquétipos escolhidos pelo **mecanismo** que a aula ensina, montados sobre **um tronco comum** que
> não varia. A variedade fica no corpo da aula. Orientação, ato, fonte, camada e registro são iguais em todas as 141
> aulas.

---

## Sumário

0. [Como este sistema foi feito](#0-como-este-sistema-foi-feito)
1. [A regra que escolhe o arquétipo](#1-a-regra-que-escolhe-o-arquétipo)
2. [Tronco comum: o que nunca varia](#2-tronco-comum-o-que-nunca-varia)
3. [Os dez arquétipos](#3-os-dez-arquétipos)
4. [Distribuição nas 141 aulas](#4-distribuição-nas-141-aulas)
5. [Catálogo de componentes e visualizações](#5-catálogo-de-componentes-e-visualizações)
6. [O que construir, em ordem](#6-o-que-construir-em-ordem)
7. [Aulas-protótipo](#7-aulas-protótipo)
8. [Riscos transversais e pendências](#8-riscos-transversais-e-pendências)
9. [Esquema do `mapa-aulas.json`](#9-esquema-do-mapa-aulasjson)

---

## 0. Como este sistema foi feito

### Material lido

- As 17 leituras por módulo (`m01`–`m17`, `.json` e `.md`), que cobrem as 141 aulas com natureza, representação,
  abertura, ato, visualização, instrumento, checagem, recuperação, mídia, 390 px, lacunas e dependências.
- O bar inteiro nas partes pedidas e as decisões P17–P25.
- Os planos de curadoria de imagem que já existem: `media-lab/aulas/{m01,m04,m05,m06,m07,m09,m11,m13,m14,m15}/plano.json`.
  A contagem de colocações por aula está em `midia_planejada` no mapa.

### Estado da extração

A pasta `extraction/` tem agora os 17 módulos. Parte dela foi gerada depois das leituras:
- m08 e m13 ainda não têm README de verificação;
- m01 tem extração verificada da aula 08.

### Método

1. Cada estudo propôs uma representação própria por aula, e surgiram cerca de 60 rótulos diferentes.
2. Esses rótulos foram agrupados pelo **trabalho cognitivo** que o layout precisa fazer. A aparência não entrou no
   critério.
3. Cada grupo virou um arquétipo quando cumpriu três condições:
   - tem um critério objetivo de entrada;
   - tem uma gramática de layout que os outros grupos não servem;
   - reúne pelo menos 8 aulas.
4. As aulas híbridas recebem um **arquétipo secundário**: um movimento que aparece dentro da aula sem trocar a
   gramática dela.

### Resultado

| Arquétipo | Slug | Aulas | Mecanismo que o layout precisa mostrar |
|---|---|---:|---|
| Prancha de mecanismo | `PRANCHA` | 32 | Uma relação quantitativa entre grandezas, operada num instrumento |
| Diagrama de sistema | `SISTEMA` | 18 | Uma estrutura de partes: cadeia, camadas, balança, fluxo |
| Mesa de classificação e leitura lateral | `MESA` | 17 | Uma taxonomia, ou N objetos lidos pelos mesmos campos |
| Número sob lupa | `LUPA` | 16 | Um número publicado que só significa algo com grandeza, escopo, critério e data |
| Régua do tempo | `REGUA` | 13 | Uma ordem ou um estado no tempo: rito, norma, história |
| Carta de posicionamento | `CARTA` | 10 | Uma posição num espaço: escada, plano, mapa, régua de estágio |
| Palco de série | `SERIE` | 9 | Uma forma que muda no tempo: dia, ano, segundos, horizonte |
| Anatomia anotada | `ANATOMIA` | 9 | Um documento ou objeto técnico que o learner vai ler na vida real |
| Síntese de módulo | `SINTESE` | 9 | Um procedimento ou produto que mobiliza o módulo inteiro |
| Dossiê de decisão | `DOSSIE` | 8 | Um julgamento sob informação incompleta, com consequências |

---

## 1. A regra que escolhe o arquétipo

**Regra-mãe da escolha.** O arquétipo é o do **ato principal** (C9), não o do assunto. Uma aula de história cujo ato
é prever uma curva é `PRANCHA`. Uma aula de cálculo cujo ato é ler uma fatura é `ANATOMIA`.

Aplique as perguntas na ordem abaixo. A primeira resposta "sim" decide.

| # | Pergunta (critério objetivo) | Se sim |
|---|---|---|
| 1 | É a última aula do módulo, e o ato mobiliza itens de pelo menos três aulas anteriores? Ou a fonte traz um "instrumento assinatura" de enunciados ou de produção (grade, partitura, roteiro cronometrado)? | `SINTESE` |
| 2 | O ato principal é uma **decisão** sob informação incompleta, com "não é possível concluir" legítimo, e há consequência em pelo menos duas dimensões (C8)? | `DOSSIE` |
| 3 | O objeto de estudo é um **artefato** que o learner vai encontrar fora do produto (fatura, contrato, portaria, release, planilha, unifilar) e o ato é marcá-lo ou anotá-lo? | `ANATOMIA` |
| 4 | O mecanismo central é **qualificar um número publicado** (percentual de quê, qual critério, qual data, qual degrau) e o erro-alvo é aceitá-lo cru? | `LUPA` |
| 5 | O mecanismo é uma **forma no tempo** (curva do dia, ano hidrológico, segundos após a falha, fluxos até um termo) e a previsão útil é de forma ou de ponto na série? | `SERIE` |
| 6 | O mecanismo é **ordem ou estado no tempo** (rito, vigência, prazo vencido, sequência histórica), sem série numérica contínua? | `REGUA` |
| 7 | O ato principal é **posicionar** algo num espaço com eixos (escada de tensão, plano 2D, mapa, régua de estágio)? | `CARTA` |
| 8 | Existe uma **relação quantitativa** operável (fórmula, instrumento com controles) e o ato é prever, manipular até uma meta ou calcular? | `PRANCHA` |
| 9 | O mecanismo é uma **estrutura de partes** (cadeia, camadas, balança, conservação, restrição ativa) que se entende desenhada? | `SISTEMA` |
| 10 | Nenhuma das anteriores: o ato é classificar itens em categorias ou comparar objetos pelos mesmos campos. | `MESA` |

**Desempate.** Quando duas perguntas dizem "sim", ganha a que define **onde fica o instrumento**. A outra vira
secundária. Exemplo: M01·A05 é laboratório (8) e termina em decisão (2). O instrumento é o palco, então a aula é
`PRANCHA`, com `DOSSIE` como fecho.

**O que não decide o arquétipo:**
- o tema (história, regulação, física);
- a trilha;
- a existência de imagem;
- a vontade de variar.

Variar sem mudança de mecanismo é inconsistência.

---

## 2. Tronco comum: o que nunca varia

A variedade só é aceitável se o learner reconhece, em qualquer aula, **onde está, o que fazer, de onde vem o número,
o que é da Alexandria e o que ficou registrado**. O tronco é a parte fixa. Nenhum arquétipo pode removê-lo nem
reordená-lo.

### 2.1 Moldura canônica (ordem fixa)

```
[T1 header + localizador]  →  [T2 abertura]  →  [corpo do arquétipo: T8 leitura + atos + prancha/figuras]
→  [T10 registro]  →  [T11 próximo passo]  →  [rodapé com colofão de créditos da rota]
```

O corpo é a única região que varia. Dentro dele, T3–T9 e T12–T14 aparecem sempre com a mesma forma.

### 2.2 Os catorze elementos do tronco

| ID | Elemento | Regra (gate que protege) |
|---|---|---|
| T1 | **Shell e localizador** | Header com as seis funções do S5. Localizador "Trilha › Módulo › Aula NN" com nomes iguais aos do catálogo (P8, P24); o item atual não é link. O localizador sobrevive à rolagem, compacto (≈ 32 px). Sem sidebar nem rail. O "Sumário da aula" é uma gaveta com gatilho rotulado, fecha com Esc e começa fechada. |
| T2 | **Abertura** | Veja a seção 2.3. |
| T3 | **Ato registrado** | Todos os atos usam **a mesma máquina de estados**: vazio → registrado → comparação → próximo. A referência fica velada até o registro (C7), e não existe "Revelar gabarito". Estados por silhueta + palavra, nunca por cor (S2). Onde há veredito, "não é possível concluir" é opção de primeira classe. No mesmo quadro do registro, "Praticado" muda (S6). Em E0, o ato funciona e uma linha informa que registrar exige conta (C9). **O véu cobre tudo que entrega a referência** (§2.6): controle de instrumento, linha de fonte, rótulo, `aria-label`, célula de tabela vizinha. **"N de M atos"** conta todos os atos da página, e cada ato leva "Ato k de M". |
| T4 | **Fonte** | O bloco de fonte fica a ≈ 24 px abaixo de toda figura, tabela ou instrumento com número factual, antes da prosa que o interpreta (S4), e abre a ficha em até 2 ações. Rótulos fixos: "Cenário didático presente no módulo; fonte externa dos valores não declarada." (P19) · "Faixas do módulo · verificação pendente" (P20) · "verificado em DD/MM/AAAA". |
| T5 | **Camada Alexandria marcada** | Toda peça criada pela Alexandria (pergunta, previsão, ato, relato composto, figura esquemática, espécime de documento) usa **uma única voz de aparato**: rótulo em versalete, por exemplo "PERGUNTA DA AULA", "ATO", "ESQUEMA", "DOCUMENTO DE EXERCÍCIO". Nunca recebe rótulo de fonte. A forma exata é decidida no Loop da Peça C, mas **é a mesma nos dez arquétipos**. Figuras sem escala levam "esquemático". |
| T6 | **Termo ligado** | Termo do léxico → prévia (1 ação) → verbete (2 ações), com volta à mesma posição (C4, D6). A 390, nada depende de hover. |
| T7 | **Três níveis** | Onde a fonte tem o explicador de três níveis, ele fica em disclosure no ponto de uso, nunca em aba nem no fim (C4). Vários módulos perderam níveis na extração (M03 T1, M05 T1, M01 T01). |
| T8 | **Leitura** | Coluna de 60–72 caracteres, 16–18 px. A figura fica junto do parágrafo que ela explica. Heurística: no máximo ≈ 1.350 px sem ato a 1440. Trechos maiores recebem um ato intermediário da seção. |
| T9 | **Recuperação** | Cartão com a **origem visível** ("De M01·A01"). A nova tentativa vem antes da resposta antiga (C10). Posição: na abertura ou logo antes da seção que depende da aula de origem. Itens do quiz ficam para a Avaliação do módulo (P18; M01 T08). |
| T10 | **Registro final** | "Percorrido · Praticado · Serve a [capacidade/critério ou 'ainda não disponível']". Nunca "concluída", "Aprovado" ou "Dominado" (C9, P18, S3). Antes do ato, existe "Registrar leitura sem prática". |
| T11 | **Próximo passo condicional** | "Não atende" leva a "Rever [seção]". Leitura sem prática leva a "Fazer o ato desta aula" (ao lado, "Próxima"). Nos demais casos: "Próxima · [código — título]". Na última aula: Revisão → Avaliação, com o critério mostrado antes (C10), nos dois estados, com a sequência Aula → Revisão → Avaliação visível; "Depois do módulo: Mnn" não substitui essa linha. |
| T12 | **Ausência honesta** | Linha de metadado sem aparência de controle, com três rótulos possíveis: "em desenho", "ainda não disponível", "não declarado". Nunca no topo da aula e nunca como zero. Vocabulário interno proibido (S4). A "experiência jogável em desenho" é linha **do módulo**, não da aula (P25). |
| T13 | **Acessibilidade e responsivo** | Tudo que é arrastável tem alternativa por teclado e por lista. Alvos ≥ 24 px (≥ 44 px na ação principal a 390). Texto ≥ 11 px. Foco visível e nunca sob o header. Movimento reduzido chega ao mesmo estado final. A 390, sem rolagem horizontal, e toda figura reflui em versão vertical própria, nunca como miniatura da versão de 1440 (S7). A troca de versão usa `.dsk-only`/`.mob-only` com `!important` nos dois lados, porque regra local de figura (`.caixa svg{display:block}`) reexibe a versão errada. **O que o 1º ato pergunta precisa estar no cartão do ato a 390**: dado escondido no mobile (nota, limite, unidade) não pode ser premissa da pergunta. Rótulo de SVG a 390 e a 1440 fica dentro da viewBox e com ≥ 11 px **renderizados** (viewBox larga em coluna estreita encolhe a fonte). |
| T14 | **Mídia** | Toda imagem declara a classe (documental, explicação ou atmosfera, §7) e passa no teste de remoção. Nenhuma imagem acima do primeiro ato. Vídeo nunca é herói. Imagem gerada nunca nomeia lugar real. Nada vai ao build sem revisão factual (M6). |

Mais um componente pertence ao tronco:
- **T-AUTOAV (autoavaliação em três níveis):** atende · atende em parte · não atende, com nova tentativa. É usado por
  T3 sempre que não há tolerância real (P6).

### 2.3 Abertura (T2), igual em todos os arquétipos

**Gramática a 1440** (grade de 12 colunas, largura útil ≈ 1.200 px):

| Colunas | Conteúdo |
|---|---|
| 1–7 | Código · título do catálogo (serifa, caixa alta e baixa) · subtítulo da fonte (P24), se existir · **pergunta ou objetivo** (camada Alexandria, marcada) |
| 8–12 | **Primeiro ato**: o campo de previsão com os valores do cenário, ou a ação nomeada que leva a ele (S1). Abaixo, a **mini-rota do módulo com "você está aqui"** (marcador anti-LMS 1) e a recuperação (T9), quando ela abre a aula |

- A abertura ocupa **uma única região dominante** (S1).
- Não há vídeo, card de ausência nem imagem acima dela.

**Gramática a 390**, em uma coluna:

1. localizador;
2. código e título (até 3 linhas);
3. pergunta;
4. primeiro ato ou ação nomeada, **ainda no 1º viewport** (S7);
5. mini-rota recolhida numa linha ("Aula 08 de 09 · Módulo 01").

**Ação principal.** Exatamente uma por abertura (S1). O rótulo nomeia objeto e motivo, por exemplo "Registrar
previsão · fator de capacidade" ou "Começar leitura → ato: classificar sintomas".

### 2.4 Teste anti-LMS aplicado ao tronco

O teste pede pelo menos três marcadores no 1º ou no 2º viewport a 1440. O tronco garante três deles em toda aula:

| Marcador | Quem garante | Cobertura |
|---|---|---|
| 1 | Mini-rota com posição | T2, em todas as aulas |
| 3 | Ato registrado | T3, obrigatório |
| 4 | Previsão | Nas 131 aulas com previsão útil |

**As 10 aulas sem previsão útil** (M01·A02, M01·A06, M01·A09, M11·A07, M12·A08, M13·A06, M13·A08, M14·A08,
M16·A09, M17·A11) precisam do marcador 2 (fonte junto a um número) ou do 6 (cartografia que trabalha) até o 2º
viewport. O critério de aceite de cada arquétipo indica qual deles.

### 2.5 Como a variedade não vira inconsistência

- **Invariantes visuais.** A abertura, o componente de ato, o bloco de fonte, a voz da camada, o registro e o próximo
  passo têm a mesma forma, a mesma posição relativa e o mesmo rótulo em todos os arquétipos. O critic System verifica
  isso sobrepondo capturas de três arquétipos diferentes.
- **Um palco por aula.** Cada arquétipo tem um palco principal (a prancha, a série, a carta…). Outros movimentos
  entram como estações menores, sem disputar a região dominante.
- **Mesma escala de largura.**

  | Região | Largura a 1440 |
  |---|---|
  | Coluna de leitura | ≈ 680 px |
  | Palco | ≈ 70% da largura útil (≈ 840–1.000 px) |
  | Matriz ou série larga | Até 100% da largura útil |

  Nenhuma coluna lateral fica fixa.
- **Glifos compartilhados.** Os estados (vigente, vencido, anunciado; declarado, ausente; vincula, não vincula) usam a
  mesma família de silhuetas do sistema de estados do S3. Um módulo não inventa uma família própria.
- **Recorrência intencional.** Uma figura que volta em várias aulas (plano P×t em M01; régua de marcos em M12; fatura
  esquemática em M02, M09 e M10; régua de estágio em M16 e M17) é o mesmo componente com preset por aula (`C-PRESET`),
  nunca um redesenho.

### 2.6 Lições de correção (critic, 2026-09-17)

Quatro protótipos reprovaram por defeitos que qualquer aula pode repetir. Regra de sistema a partir daqui:

| # | Defeito | Regra |
|---|---|---|
| L1 | Figura do instrumento renderizada duas vezes (versão 390 visível a 1440) | Guarda de versão no tronco (T13). O verificador (`prototipos/_src/verificar.mjs`) conta `.dsk-only`/`.mob-only` visíveis por largura. |
| L2 | Véu furado: o valor velado aparecia num controle, na linha de fonte e no enunciado da meta | Tudo que permite ler **ou calcular** a referência fica velado (T3). Entradas que, somadas, dão a resposta também. Linha de fonte e enunciado têm versão inicial sem o número. O verificador procura os números proibidos só em nós de texto com retângulo > 0 (o `innerText` do Chrome inclui `<text>` de SVG oculto). |
| L3 | Tabela de referência entregava o ato vizinho (matriz → bandeja) | Em `MESA`, o ato vem **antes** da matriz; no estado inicial só uma linha-exemplo fica aberta, as outras mostram só a categoria. A matriz inteira abre no registro. |
| L4 | Numeração da fonte que não fecha com o próprio aparato ("seis… a sexta" × oito linhas) | P23: rótulo semântico no título e na seção, contagem reconstruível ao lado (5 + 1 + 2 = 8), título literal na ficha de fonte. |
| L5 | Trecho longo sem ato (≈ 2.800 px) | T8 vale também depois do palco: seções com quadro, cronologia ou decisão ganham ato próprio da seção ("ler o instituto", "afirmar hoje", "o que pedir"), com referência logo abaixo e velada quando é a frase seguinte. |
| L6 | Unidade ausente em entrada da fonte ("intensidade 100") | A fonte manda no rótulo; a Alexandria acrescenta a leitura da fórmula, marcada como camada ("100 = PLD até 2× em outubro · leitura da Alexandria"). |
| L7 | Figura lateral empurrando o parágrafo seguinte | A prosa de uma seção corre inteira na coluna de leitura; figuras da seção empilham na coluna lateral (`.pilha`). Vão entre parágrafos por causa de figura reprova. |
| L8 | Linha de tabela ilustrada sem miniatura | Lacuna de curadoria vira ficha tipográfica declarada ("CCGT · sem foto"), com a razão na legenda. Nada de célula vazia nem imagem gerada para tema documental. |
| L9 | Campo com a unidade no placeholder e no sufixo | Placeholder diz o que digitar ("seu cálculo"), em itálico e menor; a unidade fica só no sufixo. |

### 2.6.1 Lições da rodada 3 da Peça C (critic, 2026-09-20)

A L2 quebrou de novo, num arquétipo já construído, e o foco faltou no controle mais importante da peça. As três
regras abaixo existem para que nenhuma das duas volte por uma porta nova.

| # | Defeito medido | Regra |
|---|---|---|
| L10 | **O véu da L2 furado no ENUNCIADO.** Na M01·A08 o Ato 2 mandava "mover a geração até a usina cair na faixa da **Hidrelétrica (BR · média)**", e uma das quatro alternativas era essa mesma string. A régua da figura 8.3 casava nome e faixa logo abaixo, e a nota do Brasil dava o número da hidro. | O enunciado dá a **premissa** (o alvo numérico), nunca o **nome** que o ato pede. Quando a referência é uma figura, uma tabela ou um parágrafo, vela-se a **região** (`Velatura` no tronco), e ela abre no registro do ato que responde — mesmo movimento da L3. Nenhum lugar da página, fora da bandeja de opções, pode conter a resposta antes do registro. |
| L11 | **O número vivo do instrumento escapando pela linha de estado do ato seguinte.** "ainda abaixo da faixa · FCap 25,1%" (M01·A08) e "a rampa já passou do limiar (+11,4 GW/h)" (M02·A04): dois arquétipos, o mesmo defeito. | A linha de estado diz **onde** o learner está (acima, abaixo, dentro) e nunca **quanto**, até o ato que vela a grandeza ser registrado. No tronco isso é uma peça só: `Medida`. |
| L12 | **Elemento substituído não renderiza `::after`.** A marca de canto da casa é um pseudo-elemento; `input`, `select` e `textarea` são replaced elements e não a desenham. O campo de previsão — o primeiro ato e a porta do loop — recebia foco de teclado sem marca nenhuma, a 1440 e a 390. | A marca de foco passa para o **hospedeiro** (o pai direto do controle), por `:has(> input:focus-visible)` em `CSS_CHROME`. Vale para qualquer campo da casa sem o autor da tela precisar saber. |
| L13 | **Dobra de entrada sem matéria.** Só tipo e fio de 1 px, com a coluna de leitura morrendo ~280 px antes do trilho: a aula perdeu 3–0 no cego para a página de Módulo de onde ela é aberta. | A abertura recebe uma **prancha de entrada** (`PranchaDeEntrada`): gravura da camada Alexandria na coluna de leitura, **abaixo da tese**, com trabalho cognitivo nomeado no título-afirmação (C6) e sem nenhum valor que o ato peça. Ela é **preenchimento de dobra**: se ajusta ao vão que o texto deixa, nunca o estoura, e não entra a 390, onde a dobra pertence ao primeiro ato. Nenhuma fotografia sobe para o topo: a imagem curada continua entrando junto do parágrafo que ela explica (C4). |
| L14 | **A linha de 1440 espremida a 390.** A cabeceira do `Palco` é uma linha só — versalete · nome · modo — e a 390 o `flex: 1` do nome colapsava para **26 px de largura por 177 de altura**: "Calculadora · Fator de capacidade de uma usina" despencava uma palavra por linha, por baixo de "prever → calcular → comparar" (D1 da r12). O mesmo defeito, de outra porta: "Registrar os três sinais" com `white-space: nowrap` pedia 264 px numa coluna de ato de 244 a 390 e sangrava 20 px. | Nenhuma cabeceira a 390 é a linha de 1440 encolhida: ela é **composição própria**. No `Palco`, grade de duas fileiras com posição explícita — o par de aparato (número à esquerda, modo à direita) corre na primeira, o nome do instrumento ocupa a segunda inteira —, **sem mudar a ordem do DOM**. E o rótulo de ação segue a receita curta do tronco (`Registrar <substantivo>`): o que não cabe na cartela vai para o campo `objeto`, que mora fora dela. |
| L15 | **O medidor que não espera a fonte acusa defeito que não existe.** O `verificar-foco.mjs` media antes de `document.fonts.ready`. Cinzel entra por `font-display: swap`: entre o primeiro paint e a troca, o rótulo é desenhado com a métrica da fallback e volta ~4 px mais largo, e a `CartelaAcao` remede a própria caixa por `ResizeObserver` **um quadro depois**. Na janela entre as duas coisas o verificador leu 5 sangramentos em "Registrar previsão", "Registrar meta" e "Fazer o ato desta aula" — e, pior, só na m02-a04, porque a m01-a08 rodava com o contexto frio e passava. Verificador cujo veredito depende da ORDEM das rotas não mede nada. | Toda medida de geometria espera `document.fonts.ready` antes do primeiro `getBoundingClientRect` (`capture.mjs` e `verificar-veu.mjs` já esperavam; o do foco era o único que não). E toda correção de verificador se prova com um defeito INJETADO: depois da espera, o `--only m02-a04` continua acusando um `nowrap` real (caixa 40 px, pede 85 px). Medidor que passou a calar precisa provar que ainda grita. |
| L16 | **"Não renderiza em render nenhum" era "o harness nunca fotografou".** O fechamento da aula (T10 + T11) mora em y≈4293 a 1440 e y≈7314 a 390, e o orçamento de rolagem dos filmstrips somava ~2020 px: a rota não quebrava e o seletor existia — a câmera é que parava no meio do caminho. O quadro final em branco era outra coisa ainda: `back: true` depois de clicar o "próximo passo", que é **salto de âncora no mesmo documento** e não empilha entrada de histórico, então `goBack()` voltava para o `about:blank` anterior ao `goto`. | Alvo que muda de posição entre rotas se persegue por **seletor, não por pixel**: `scrollTo` no plano e nas `frameActions` (`capture.mjs`). E `back` só depois de navegação que **trocou de documento** — a legend.json registra a URL de cada quadro justamente para que "página em branco" seja diagnosticável em vez de misteriosa. Antes de reportar que o produto não renderiza, prove que a câmera chegou lá. |

**O verificador do foco e da caixa.** `tools/alexandria-foco/verificar-foco.mjs`, com as rotas em
`tools/alexandria-foco/rotas.json`, mede as três coisas que a leitura de código não pega, em toda rota e nas duas
larguras da régua: **(1)** todo controle focável tem marca de foco, aceita no `outline` do próprio elemento, no
`::after`/`::before` dele ou no do **hospedeiro** — que é onde a L12 mandou a marca dos campos morar; **(2)** nenhum
controle focado fica coberto por elemento colado (o rolador da Alexandria é o `<main>`, então o cabeçalho é irmão e
não cobre nada; quem cobre é o quadro previsto × calculado, `sticky` a 390); **(3)** nenhum texto sangra da própria
caixa (`scrollWidth > clientWidth` com `overflow: visible`), que é a assinatura da L14. A r13 fechou com **337
controles varridos, 0 sem marca, 0 cobertos, 0 sangrando**.

**O verificador do véu.** `tools/alexandria-veu/verificar-veu.mjs`, com o caderno de casos em `tools/alexandria-veu/veu.json`,
mede o véu no render. Cada nó de texto vira um `Range` e só entra na varredura com `getClientRects()` somando área
> 0 — a medida por **retângulo** que a L2 pede, porque o `innerText` do Chrome inclui `<text>` de SVG oculto. Varre
também os atributos visíveis (`aria-label`, `title`, `alt`, `placeholder`, `value`, `aria-valuetext`) e a **linha
composta** de cada elemento, porque o React parte uma frase em vários nós. A bandeja de escolha (`data-veu="escolhas"`)
é o único lugar isento: uma múltipla escolha contém a resposta por construção. Cada caso tem duas metades —
`proibidos` antes do registro e `exigidoApos` depois —, para que **apagar** o conteúdo não passe no gate: o véu cai,
não some.

Na primeira passagem o verificador achou, além do defeito relatado, três vazamentos que ninguém tinha visto: a linha
de estado da M01·A08 e a da M02·A04 (L11) e, na M12·A01, a legenda do bloco-diagrama do aquífero mais o parágrafo de
correção, os dois imediatamente ao lado do ato que pergunta exatamente aquilo.

---

## 3. Os dez arquétipos

Cada arquétipo segue o mesmo formato:
- quando usar;
- gramática a 1440 e a 390;
- abertura e primeiro ato;
- visualizações;
- conclusão e recuperação;
- requisitos de componente;
- riscos contra o bar;
- critérios de aceite verificáveis no render;
- protótipo.

Os critérios de aceite somam-se aos do tronco (§2), que valem sempre.

**Legenda das gramáticas.**

| Sigla | Região |
|---|---|
| L | Leitura |
| X | Ato |
| P | Palco (prancha, série, carta etc.) |
| F | Fonte |
| K | Comparação resposta × referência |
| R | Recuperação |

### 3.1 `PRANCHA` · Prancha de mecanismo (32 aulas)

**Quando usar.** A aula afirma uma relação quantitativa (fórmula, curva, degraus, razão) e existe um instrumento, na
fonte ou na camada Alexandria, que a opera com controles rotulados e unidade. O ato é prever, calcular ou manipular
até uma meta.

**Não usar quando** o instrumento só consulta texto (vira `MESA`) ou quando o número em jogo é publicado e precisa ser
qualificado (vira `LUPA`).

**Gramática a 1440**
1. T2, com a previsão numérica no bloco do primeiro ato.
2. L: prosa até o ponto em que a fonte invoca o instrumento ("Pratique abaixo", "Veja:", "Use a calculadora"). Se a
   fonte põe o instrumento no fim, ele **sobe** para esse ponto (Regra-mãe 1; ver `instrumento.posicao` no mapa).
3. **P, a prancha, em ≈ 70% da largura.** Ordem interna fixa (heurística C5):
   1. número e título com escopo ("INST·06 · Fator de capacidade de uma usina");
   2. pergunta;
   3. à esquerda, os controles (rótulo + unidade, campo numérico e deslizador com a mesma faixa);
   4. à direita, a figura que desenha a forma prometida;
   5. saídas legíveis sob a figura;
   6. F;
   7. a leitura de um parágrafo, que mostra só o ramo ativo.
4. **Quadro previsto × calculado**, fixo no topo da prancha enquanto o learner explora (C5).
5. X secundário: meta ("encontre…") dentro da prancha, com estado por palavra ("meta atingida" / "ainda abaixo").
6. L: a prosa que interpreta o resultado **depois** da prancha. Números da prosa que entregariam a resposta ficam
   velados até o registro (M01·A08: o "25,1%" do parágrafo 8.2).
7. K: o exercício da fonte ligado à aula, com a referência só depois da tentativa.
8. T10, T11.

**Gramática a 390**
1. T2 com a previsão.
2. L.
3. Prancha empilhada:
   - pergunta;
   - quadro previsto × calculado **fixo no topo da prancha** (sticky dentro da prancha);
   - figura em largura total;
   - controles em grade de 1 coluna, com alvos ≥ 44 px;
   - saídas em grade 2×N;
   - F.
4. Os eixos com faixas incompatíveis ganham quebra explícita ou escala log (M01·A01).

**Abertura e primeiro ato típicos.** A pergunta traz os valores do cenário-padrão ("usina solar de 100 MW, 1 ano,
220.000 MWh: FCap, %"). A resposta derivada pode aceitar arredondamento como **regra de entrada da Alexandria** (P19),
nunca como tolerância da fonte (P6).

**Visualizações típicas.**

| ID | Figura |
|---|---|
| `V-XY` | Parábola, LCOE × FCap, custo × nº de redes |
| `V-RET` | Plano P×t, caixa teórica |
| `V-DEG` | Ordem de mérito, curva de lances |
| `V-FAIXA` | Faixas com o ponto do learner |
| `V-BAR` | Barras comparativas |
| `V-TRI` | Triângulo de potência |

Imagens: 0–2, só documentais que provam a grandeza (a placa de potência na M01·A08). Nunca acima da prancha.

**Conclusão.** "Praticado" registra previsão, meta e exercício. "Serve a" nomeia a capacidade do módulo.

**Recuperação.** Pergunta de uma aula anterior que usa a mesma grandeza (M01·A08 recupera a frase-erro da M01·A01).

**Requisitos de componente.**
- Obrigatórios: `C-PRANCHA`, `C-PREVISAO`, `C-META`.
- Frequentes: `C-PRESET`, `C-CLASSIF` (atos secundários).
- A figura prometida pelo nome do instrumento é requisito, não enfeite (C5, §9 "desenho das formas").

**Riscos contra o bar.**
- Instrumento como apêndice (Regra-mãe 1).
- Tolerância inventada (P6).
- Mostrador arredondado que declara a meta atingida por engano (M01·A07: 350 kVAr exibe "0,92").
- Semáforo herdado da fonte (M01·A07, M08·A03).
- Instrumento que não desenha a forma que o nome promete (C5).
- Leitura dinâmica que mostra o ramo errado (M01·A08 DIV-01).

**Critérios de aceite (render).**
- **PR-1 (C3, S7).** A 390, em E0, pergunta e campo de previsão com os valores do cenário estão no 1º viewport.
- **PR-2 (Regra-mãe 1, C5).** Em captura de página inteira a 1440, a prancha começa antes de 60% da altura da aula e
  logo após o parágrafo que a invoca.
- **PR-3 (C5).** Filmstrip vazio → registrado → comparação → exploração. O quadro previsto × calculado aparece no
  mesmo cenário e continua visível no quadro de exploração.
- **PR-4 (C5, C6).** A figura desenha a relação nomeada no título do instrumento. Mover um controle muda traçado e
  número no mesmo quadro (S6).
- **PR-5 (S4).** O bloco de fonte está sob a prancha. Cenário didático aparece com o rótulo P19.
- **PR-6 (S2).** Nenhuma cor indica "dentro/fora"; a meta aparece por palavra e silhueta.
- **PR-7 (C7).** Nenhum número da prosa entrega a resposta antes do registro.
- **PR-8 (S7).** A 390, o quadro previsto × calculado continua visível enquanto um controle é manipulado.

**Protótipo:** **M01·A08 — 100 MW solar ≠ 100 MW térmica** (obrigatório; captura do bar). Detalhes na §7.

### 3.2 `SERIE` · Palco de série (9 aulas)

**Quando usar.** O mecanismo é uma **forma no tempo**:
- carga do dia e rampa;
- EAR no ano hidrológico;
- frequência após a perda;
- fluxos até o termo da concessão;
- mapa de calor dia × hora.

A previsão útil é de forma, de ponto ou de mês.

**Gramática a 1440**
1. T2. O primeiro ato é "desenhe a sua curva" ou "em que mês/hora…?".
2. L curta.
3. **P, a série em 100% da largura útil.**
   - Eixo x com unidade de tempo e marcas nomeadas (vale, rampa, pico; cheia, seca).
   - Rótulos diretos na ponta das séries e até 4 séries com cor; as demais ficam neutras.
   - O traço do learner é uma terceira linha tracejada, rotulada "sua previsão".
4. Os controles ficam **sob** o eixo (não ao lado), para a série manter a largura.
5. Uma troca de escala (ano | dia | hora), quando houver, fica sobre o palco como controle segmentado com rótulos.
6. Revelação: a série calculada sobreposta ao traço, com a maior distância anotada em texto e **sem pontuação** da
   distância.
7. X de meta sobre a mesma série ("menor solar em que a rampa passa de 10 GW/h").
8. L de interpretação, K, T10, T11.

**Gramática a 390**
- A série é redesenhada em **retrato**: tempo no eixo vertical ou série com rolagem interna rotulada e sem rolagem
  horizontal da página. Preferir o eixo vertical para 24 h e 12 meses.
- O traço é feito por **pontos em passos** (um controle por marca de tempo), com alternativa por teclado.
- Controles sob a figura.

**Abertura e primeiro ato típicos.**
- "Desenhe a curva líquida para 30 GW de solar em céu limpo" (M02·A04).
- "Em que mês a EAR chega ao mínimo?" (M03·A02).

**Visualizações típicas.**

| ID | Figura |
|---|---|
| `V-SER` | Série com fantasma do cenário anterior (F-M02-8) |
| `V-HEAT` | Mapa de calor |
| Relógio de 24 h | Faixa ou anel |
| `V-TL` | Calendário anual de fases |

Imagens: raramente. A série é a figura.

**Conclusão e recuperação.**
- O registro guarda o traço previsto. Ele pode reaparecer em aulas seguintes (a janela da rampa da M02·A04 volta na
  M02·A07; `C-CADERNO`).
- A recuperação pergunta uma relação da aula anterior sobre a mesma curva.

**Requisitos de componente.**
- `C-PREV-TRACO` (previsão desenhada acessível; F-M02-1, F-M03-1).
- Calculadores que **devolvem a série inteira**; hoje vários devolvem só mínimo ou mês.
- `C-META`, `C-PRANCHA` na variante larga.

**Riscos contra o bar.**
- Precisão motora virar critério.
- Série ilustrativa sem rótulo "esquemático" (M10·A05).
- Escala anual que contradiz a prosa (M08 T4).
- Vermelho e branco da fonte (M08 T6).
- Nomear a ausência de uma série como curva.
- Rolagem horizontal a 390.

**Critérios de aceite (render).**
- **SE-1 (C3).** A 390, a pergunta e o controle do traço aparecem no 1º viewport, e o traço pode ser registrado só
  com teclado (filmstrip Tab).
- **SE-2 (C5, C6).** Depois do registro, traço previsto e série calculada ficam no mesmo eixo, e a série responde ao
  controle no mesmo quadro.
- **SE-3 (C6).** O título da figura afirma a relação ("O pôr do sol virou a hora mais tensa"), o subtítulo traz a
  unidade e F fica logo abaixo.
- **SE-4 (S7).** A 390, sem rolagem horizontal; a figura em retrato mantém os rótulos diretos legíveis (≥ 11 px).
- **SE-5 (S6).** Com movimento reduzido, o desenho da série chega ao mesmo estado final sem animar o traço.
- **SE-6 (S2).** Nenhuma zona "crítica" é codificada só por cor; os limiares do modelo aparecem como faixa cinza
  rotulada "limiar do modelo".

**Protótipo:** **M02·A04 — A demanda respira — e o operador respira junto** (captura obrigatória do bar: "curva
líquida, que precisa ser desenhada").

### 3.3 `CARTA` · Carta de posicionamento (10 aulas)

**Quando usar.** O ato principal é **pôr algo num lugar** com eixos significativos:
- uma tensão na escada tarifária;
- um subsistema no plano afluência × armazenamento;
- uma tendência na régua de estágio;
- uma jurisdição na matriz de desenho;
- uma decisão no mapa institucional;
- uma térmica no mapa do Brasil.

A posição **é** a resposta.

**Gramática a 1440**
1. T2. O primeiro ato é "onde fica…?", com o objeto a posicionar já visível como ficha.
2. **P, a carta, em ≈ 70% da largura e já no 1º ou 2º viewport**, porque ela é o objeto-mundo da aula (marcador
   anti-LMS 6).
   - Eixos rotulados com unidade (kV em log, % da MLT, ordinal de estágio).
   - Faixas e quadrantes com nome.
   - Vazios da fonte desenhados como "não declarado" (M01·A06).
3. À direita da carta (colunas 10–12), a **bandeja de fichas** a posicionar.
4. L entra entre ou depois das posições, ancorada à região da carta que explica. Uma região ativa acende enquanto o
   parágrafo correspondente está em leitura.
5. Registro das posições, depois a **posição de referência** de cada ficha com a linha da fonte que a justifica (K).
6. Diagnóstico ou consequência ("o que muda no período úmido?").
7. T10, T11.

**Gramática a 390**
- A carta vira eixo vertical em largura total.
- **Não se arrasta:** cada ficha tem uma lista "posicionar em…" com as faixas.
- Os quadrantes de um plano 2D viram dois seletores (eixo x, eixo y) e um mini-plano de confirmação.

**Abertura e primeiro ato típicos.**
- "13,8 kV: que grupo, que subgrupo, que fatura?" (M01·A06).
- "Nordeste com 89% do útil e 59% da MLT: qual se sustenta melhor?" (M08·A04).

**Visualizações típicas.**

| ID | Figura |
|---|---|
| `V-ESC` | Escada ordinal ou log |
| `V-PLANO` | Plano 2D |
| `V-MAPA` | Mapa (Natural Earth, nunca gerado) ou mapa esquemático rotulado "posições esquemáticas" |

Imagens: satélite documental quando localiza (Sobradinho visto do espaço).

**Conclusão e recuperação.**
- A posição registrada pode virar artefato (a "ficha do cliente" da M01·A06 volta no M10; `C-CADERNO`).
- A recuperação reposiciona um objeto de aula anterior.

**Requisitos de componente.** `C-POSIC` (posicionador com teclado e lista), `C-PRANCHA` para os pontos móveis de
instrumento, `C-SELO` para posições datadas.

**Riscos contra o bar.**
- Mapa decorativo.
- Posição geográfica inventada (fronteira de operador não é Natural Earth; M17·A05).
- Limiar do instrumento lido como limiar regulatório (M08·A04).
- Contradição interna da tabela que a carta tornaria visível (M01·A06: 6.1 × 6.2) sem content QA.

**Critérios de aceite (render).**
- **CA-1 (anti-LMS 6).** A 1440, em E1, a carta está no 1º ou 2º viewport, e o critic nomeia o trabalho dela em uma
  frase.
- **CA-2 (C7).** A posição de referência não aparece antes do registro. Depois dele, cada ficha mostra a própria
  posição, a da referência e a linha da fonte.
- **CA-3 (S4).** Vazios da fonte aparecem como "não declarado"; posições esquemáticas são declaradas como tal.
- **CA-4 (S7).** A 390, todas as posições são registráveis sem arrastar, e os alvos têm ≥ 44 px.
- **CA-5 (S2, S3).** As regiões da carta se distinguem em captura em cinza (fio, hachura, rótulo).
- **CA-6 (C6).** Cada faixa ou quadrante tem nome escrito na própria carta, sem depender de legenda separada.

**Protótipo:** **M08·A04 — O maior sistema de armazenamento de energia do mundo não tem uma bateria.** Alternativa:
M01·A06, bloqueada por content QA.

### 3.4 `SISTEMA` · Diagrama de sistema (18 aulas)

**Quando usar.** O mecanismo é uma **estrutura** que só se entende desenhada:
- cadeia de conversão ou de delegação;
- camadas (física × dinheiro; estratos de uma relação; quatro camadas da rede);
- balança (geração × consumo; contratado × medido);
- conservação (funil de perdas, Sankey, rateio fechado);
- restrição ativa (trajetória sob tetos);
- decomposição (três parcelas).

**Gramática a 1440**
1. T2. O primeiro ato é uma previsão sobre o comportamento do sistema ("o consumo sobe e a geração não acompanha: a
   frequência…?") ou uma montagem ("monte a cadeia").
2. **P, o diagrama, em ≈ 70% da largura**, logo após a primeira seção.
   - Nós com rótulo direto, fluxos com unidade quando a fonte dá número.
   - Sem escala quando não dá, com o selo "esquemático".
3. O diagrama funciona como **índice vivo**: cada seção da leitura acende o seu trecho (espinha de unidades da
   M01·A02; estratos da M09·A02).
4. X: desligar um componente, mudar um prato da balança, ligar um fluxo. O diagrama muda no mesmo quadro, e a
   consequência aparece em texto.
5. Um instrumento, quando existe, é uma lupa sobre um nó (M09·A07: lupa do participante no condomínio).
6. K, T10, T11.

**Gramática a 390**
- Diagramas horizontais viram **trilho vertical** (espinha de 24 px à esquerda com as estações).
- Camadas ficam empilhadas em ordem de dependência.
- A seção ativa fica indicada no trilho, sem fixar coluna.

**Abertura e primeiro ato típicos.**
- "Qual delas vira produção, e qual ocupa a rede sem virar?" (M01·A02).
- "Se só uma restrição fosse removida amanhã, qual mudaria a trajetória?" (M16·A02).

**Visualizações típicas.**

| ID | Figura |
|---|---|
| `V-CADEIA` | Cadeia |
| `V-FLUXO` | Fluxo |
| `V-ONDA` | Onda (quando o sistema é físico) |
| `V-BAR` | Barra de parcelas com a parcela nula como traço vazio (F-M17-1) |

Imagens: uma, quando dá corpo a um nó (anel de Faraday na M01·A03), com classe e atribuição corrigidas.

**Conclusão e recuperação.** "Serve a" nomeia a capacidade estrutural. A recuperação pede para refazer uma ligação
do diagrama de uma aula anterior.

**Requisitos de componente.** `C-DIAG` (nós, fluxos, estados, acender por seção, desligar componente), `V-CADEIA`,
`V-FLUXO`, `C-CLASSIF` e `C-ORDEM` (montagem).

**Riscos contra o bar.**
- Diagrama puramente decorativo (C6).
- Contador ou dinâmica inventados (M01·A03: "86.400 vezes por dia"; nenhuma constante de tempo sem fonte).
- Proporções desenhadas sem dado (M09·A01/A02: "sem proporção de valor").
- Quantidade demais de nós, o que quebra a heurística de 4 categorias sem justificativa.

**Critérios de aceite (render).**
- **SI-1 (C6).** O diagrama tem título-afirmação, e o critic nomeia a relação em uma frase. Removido o diagrama, a
  seção perde o mecanismo (teste de remoção).
- **SI-2 (C3, C9).** Existe ato registrado sobre o sistema antes de o diagrama "reagir".
- **SI-3 (S6).** Mudar um elemento muda o diagrama e o texto de consequência no mesmo quadro; com movimento reduzido,
  o estado final é o mesmo.
- **SI-4 (S4, T5).** Diagramas sem escala mostram "esquemático"; números nos fluxos têm F junto.
- **SI-5 (S7).** A 390, o trilho vertical preserva a ordem dos nós, sem rolagem horizontal.
- **SI-6 (anti-LMS).** Nas aulas sem previsão (M01·A02), o 2º viewport mostra F junto a número (tabela de tensões).

**Protótipo:** **M01·A03 — A rede tem um batimento cardíaco. Ele se chama 60 Hz.** A aula não tem instrumento nem
exercício na fonte (M01 T07) e testa o C9 dentro do módulo-padrão. Alternativa: M02·A01.

### 3.5 `MESA` · Mesa de classificação e leitura lateral (17 aulas)

**Quando usar.** A aula é uma **taxonomia** (fenômenos, atribuições, graus, causas, riscos) ou uma **leitura lateral**
de N objetos pelos mesmos campos (regimes, fichas, encargos). O ato é classificar, ligar ou comparar células. Nenhuma
das perguntas 1–9 da §1 disse "sim".

**Gramática a 1440**
1. T2. O primeiro ato é classificar um primeiro item, ou prever uma célula.
2. **P, a mesa, como palco desde o início** (M09·A05: matriz 6×7 logo após o bloco 0).
   - Linhas e colunas com rótulo.
   - Foco por linha (ler um objeto) ou por coluna (ler um campo).
   - A célula abre **no lugar**, sem modal e sem aba.
3. As seções da leitura acendem a linha ou coluna correspondente.
4. X: bandeja de itens → caixas (`C-CLASSIF`). Cada compromisso revela eixo, motivo e "o que não autoriza concluir"
   só depois do registro (C7).
5. K: comparação célula a célula com silhueta e palavra ("mesmo eixo da referência" / "eixo diferente").
6. Uma figura de forma, quando a taxonomia tem forma: pequenos múltiplos de onda (M01·A09), escada de graus
   (M05·A02).
7. T10, T11.

**Gramática a 390**
- A matriz vira **cartões por linha** com os campos empilhados, mais um seletor "ler por: objeto | campo".
- A classificação fica em botões por caixa (sem arrastar).
- Pequenos múltiplos em grade 2×N.

**Abertura e primeiro ato típicos.**
- "A fatura não tem linha de 'qualidade'. Como tensão ruim sai mais cara?" (M01·A09).
- "Onde esse risco aparece antes de acontecer?" (M13·A06).

**Visualizações típicas.** `V-MATRIZ`, `V-ONDA`, `V-ESC` (quando a taxonomia é ordinal).

**Conclusão e recuperação.** "Praticado" conta os itens registrados. "Não atende" leva a "Rever [seção]". A
recuperação reclassifica um item de uma aula anterior.

**Requisitos de componente.** `C-CLASSIF` (com revelação pós-tentativa; F-M12-5), `C-MATRIZ`, `C-ORDEM`.

**Riscos contra o bar.**
- **Quiz temático disfarçado.** A classificação precisa exercitar o mecanismo central, não a memória do texto.
- Tabela como parede de texto.
- Categorias demais (heurística de 4) sem foco.
- Cor por categoria certa/errada (S2).
- Revelar a coluna de referência no clique, como fazem os instrumentos-consulta da fonte (M13).

**Critérios de aceite (render).**
- **ME-1 (C7).** Filmstrip vazio → registrado → comparação: nenhuma célula de referência aparece antes do registro.
- **ME-2 (C9).** O critic lê o enunciado da classificação e nomeia o mecanismo que ela exercita (ex.: "sintoma →
  fenômeno", não "lembrar a tabela").
- **ME-3 (S2, S3).** Em captura em cinza, com palavras cobertas, os estados das células se distinguem por silhueta.
- **ME-4 (S7).** A 390, cartões por linha sem rolagem horizontal, e classificação por botão com alvo ≥ 44 px.
- **ME-5 (anti-LMS).** Para as aulas sem previsão (M01·A09, M13·A06, M16·A09), F junto a um número ou a um item de
  consulta aparece até o 2º viewport.
- **ME-6 (C4).** Nenhuma tabela ocupa mais de ≈ 1.350 px sem ato.

**Protótipo:** **M13·A06 — Seis categorias de risco, e a sexta é a que o currículo não nomeia.** É a captura
obrigatória "aula de M13, sem instrumento nem exercício portado". O ato é da camada Alexandria, derivado das células
da matriz da fonte (`extraction/m13/instrumentos.json`, verificação a confirmar). Alternativa: M01·A09.

### 3.6 `LUPA` · Número sob lupa (16 aulas)

**Quando usar.** O mecanismo é **qualificar um número publicado** antes de usá-lo:
- grandeza (capacidade × energia; potência × energia);
- denominador (99% × 88%; 87% de quê);
- critério (1P/2P/3P);
- degrau (solicitado × energizado × consumido);
- perímetro (sete declarações);
- data;
- camada do preço.

O erro-alvo é aceitar o número cru. É a família mais característica das Trilhas 2 e 3.

**Gramática a 1440**
1. T2. O primeiro ato é **"de quê?"**: o número aparece grande, com a pergunta.
2. **P, o par de números** (`C-LUPA`): dois (ou N) cartões-número lado a lado, cada um com a fonte embaixo.
   - Entre eles, os **trilhos de declaração** (grandeza, escopo, critério, data, degrau).
   - Cada trilho fica aceso (declarado) ou vazio (ausente), com palavra e silhueta.
3. X: marcar quais declarações o enunciado realmente faz, antes do veredito (M17·A01), ou posicionar os números na
   escada (M16·A08).
4. Figura de decomposição: mosaico (`V-PARTES`), cascata (`V-CASC`), barras em log com a razão escrita (`V-BAR`).
   Um instrumento, quando existe, manipula essa figura.
5. **Forma corrigida.** Depois do registro, a frase reescrita com as declarações (fonte ou Alexandria, marcada).
6. K, T10, T11.

**Gramática a 390**
- Cartões-número empilhados, cada um com F.
- Os trilhos viram lista de verificação sob o par.
- A figura de decomposição vem em largura total, depois do ato.

**Abertura e primeiro ato típicos.**
- "Quando alguém diz que o Brasil é '87% renovável', de qual conta está falando?" (M12·A01).
- "'38 GW de data centers a caminho': em que degrau está esse número?" (M16·A08).

**Visualizações típicas.** `V-PARTES`, `V-CASC`, `V-BAR` (log), `V-ESC` (degraus do número).

Imagens: nenhuma, via de regra. Números não se fotografam (M15·A02).

**Conclusão e recuperação.** "Praticado" registra a marcação e a forma corrigida. A recuperação traz um número de
aula anterior para ser qualificado de novo (M15·A09; M17·A11).

**Requisitos de componente.** `C-LUPA`, `C-SELO` (números vivos com data), `C-PREVISAO`, `C-PRANCHA` (quando há
instrumento), e F com **data de verificação obrigatória**.

**Riscos contra o bar.**
- Fonte escondida em rodapé (S4).
- Número vivo sem data ou vencido (F-M12-1).
- Somar números de degraus diferentes na própria figura (M16·A08: trilhos separados).
- Transformar a lupa em "pegadinha".
- Ranking implícito entre jurisdições (M17 recusa ranking).
- Barra linear que apaga a assimetria (M12·A07).

**Critérios de aceite (render).**
- **LU-1 (S4).** Todo cartão-número tem fonte e data **no mesmo bloco**; filmstrip fonte → ficha em ≤ 2 ações.
- **LU-2 (C3).** Antes de qualquer decomposição aparecer, o learner registra a própria leitura do número (previsão,
  marcação ou posição).
- **LU-3 (C6).** A figura de decomposição desenha a relação afirmada (a área total igual ao agregado; a razão escrita
  entre barras log).
- **LU-4 (S2).** "Declarado" e "ausente" se distinguem sem cor.
- **LU-5 (anti-LMS 2 + 3 + 4).** A 1440, os três marcadores ficam no 1º viewport: fonte junto a número, ato e
  previsão.
- **LU-6 (S7).** A 390, os cartões-número não truncam unidade nem data.

**Protótipo:** **M12·A01 — Oitenta e sete por cento de quê, exatamente** (instrumento portado, mosaico de dois
denominadores; F-M12-3). Alternativa: M17·A01, com instrumento não portado.

### 3.7 `ANATOMIA` · Anatomia anotada (9 aulas)

**Quando usar.** O objeto de estudo é um **artefato** que o learner vai encontrar no trabalho:
- fatura;
- term sheet ou contrato;
- portaria;
- release ou Formulário de Referência;
- projeção em planilha;
- diagrama unifilar.

O ato é marcar, anotar, desmontar ou achar o que falta.

**Gramática a 1440**
1. T2. O primeiro ato é uma pergunta de leitura ("o que você ainda não sabe?", "o que sai, o que fica?").
2. **P, o espécime, em ≈ 60% da largura (colunas 1–7).** É um documento **esquemático** da camada Alexandria:
   - rotulado "DOCUMENTO DE EXERCÍCIO";
   - sem marca, sem distribuidora, sem empresa e sem preço real (M04·A05, M09·A04);
   - com zonas numeradas.
3. **Margem de anotação (colunas 8–12)** alinhada às zonas: é o lugar das perguntas da fonte e das marcações do
   learner. Não é coluna fixa: rola com o documento.
4. X: marcar zonas, classificar linhas (fato com fonte / premissa ancorada / solta / omissa) ou apontar a cláusula
   ausente.
5. Depois do registro, a margem abre "o que decide / onde costuma doer" (fonte), zona a zona.
6. Instrumento, quando existe, logo após o espécime (M04·A05: contrato × spot).
7. K, T10, T11.

**Gramática a 390**
- O espécime vira **sequência de zonas**: cada zona é um bloco com a anotação logo abaixo.
- Uma miniatura do documento inteiro, fixa no topo da seção, mostra a zona ativa (`aria-current`).

**Abertura e primeiro ato típicos.**
- "Por que a conta pode subir quando o consumo cai, e de qual eixo vem a explicação?" (M10·A01).
- "Um contrato diz: 'garantia de 25 anos'. O que você ainda não sabe?" (M11·A07).

**Visualizações típicas.** `V-DOC`, `V-UNIF`, `V-RET` (preço × quantidade), `V-GANTT` (trilho de minutos da
leitura).

Imagens: nunca fac-símile real sem licença. A "imagem" é o documento desenhado (explicação, programática).

**Conclusão e recuperação.**
- O documento anotado pode virar artefato do learner (fatura própria privada; F-M10-09; `C-CADERNO`).
- A recuperação reabre uma zona já estudada.

**Requisitos de componente.** `C-DOC` + `V-DOC` (zonas, margem, estado por zona). A fatura esquemática é **uma
peça só**, reusada em M02·A09/A10, M09·A01, M10·A01 e M10·A09.

**Riscos contra o bar.**
- **Imitar documento real** (hard gate do Artifact e do §6: nunca parecer fatura de distribuidora real).
- Inventar valores no espécime.
- Anotação em aba.
- Margem fixa virando sidebar (S5).
- "GridAlpha" em contrato didático (P24).

**Critérios de aceite (render).**
- **AN-1 (T5, §7).** O espécime traz o rótulo de documento de exercício e nenhuma marca, CNPJ, logotipo ou valor real.
- **AN-2 (C7).** As anotações de referência só aparecem depois das marcações do learner.
- **AN-3 (S5).** Rolando 2.000 px, a margem acompanha o documento e não fica fixa na viewport.
- **AN-4 (S7).** A 390, cada zona tem a própria anotação logo abaixo, sem modal.
- **AN-5 (anti-LMS).** Fonte junto à regra que decide cada zona (REN, lei, tabela) até o 2º viewport.
- **AN-6 (C9).** Sem instrumento na fonte (M10·A01), o ato de classificar causas existe, é registrado e muda
  "Praticado".

**Protótipo:** **M10·A01 — Os quatro eixos de controle** (fatura esquemática, peça de maior reuso; aula sem
instrumento). Alternativa: M04·A05.

### 3.8 `REGUA` · Régua do tempo (13 aulas)

**Quando usar.** O mecanismo é **ordem ou estado no tempo**:
- sequência de um rito (dias);
- estado de um dispositivo (vigente, vencido, anunciado, em regulamentação);
- controvérsia jurídica em etapas;
- horizontes de planejamento;
- escada histórica.

Não há série numérica contínua (se houver, é `SERIE`).

**Gramática a 1440**
1. T2. O primeiro ato é "em que estado está…?" ou "em que ano…?".
2. **P, a régua, em 100% da largura, como palco horizontal.**
   - Faixas por instituição ou por dispositivo (raias).
   - Marcos com data literal da fonte.
   - Glifo de estado (silhueta + palavra).
   - Linha vertical **"verificado em DD/MM/AAAA"** distinta da linha **"hoje"**.
3. Marcos da aula atual em destaque, demais em espera (F-M12-2).
4. X: arrastar cartões para estados ou ordenar eventos.
5. Depois do registro, a régua revela a posição da referência com norma e data, mais "o que ainda falta".
6. A prosa se ancora nos marcos: o parágrafo sobre o marco fica abaixo da régua, com o marco aceso.
7. Um instrumento de rito (dias) usa a mesma régua com durações empilhadas (`V-GANTT`; M07·A03).
8. K, T10, T11.

**Gramática a 390**
- A régua vira **vertical** (tempo de cima para baixo), com raias viradas em etiquetas por marco.
- As linhas "verificado em" e "hoje" continuam como marcos distintos.

**Abertura e primeiro ato típicos.**
- "Quando alguém diz 'a COP30 decidiu X', como saber se foi decisão, iniciativa ou anúncio?" (M12·A02).
- "A mistura de biodiesel é de 16%. Isso está em vigor?" (M14·A04).

**Visualizações típicas.** `V-TL`, `V-GANTT`, `V-ESC` (degraus datados).

Imagens: raras. Um documento público como evidência, só com licença (M16·A07).

**Conclusão e recuperação.** O registro guarda o estado atribuído. **Quando a validade do selo vence, a aula passa a
mostrar "verificar: o estado pode ter mudado"** (F-M12-1). A recuperação pergunta o estado de um dispositivo de aula
anterior.

**Requisitos de componente.** `C-TL` (raias, marcos, glifos, duas linhas de data), `C-SELO` (data e validade),
`C-CLASSIF`, `C-ORDEM`, `C-PRESET` (régua do módulo com marcos por aula).

**Riscos contra o bar.**
- **Estado vencido mostrado como atual** (dado falso por omissão; M08 T8, M12, M16).
- Data inventada para preencher degrau (M09·A03: degraus 1995–2019 "não declarados").
- "Em formação" como estado.
- Cor para vigente e vencido (S2).
- Timeline decorativa com aforismos.

**Critérios de aceite (render).**
- **RE-1 (S4).** Todo marco tem data e fonte; a linha "verificado em" aparece e é distinta de "hoje".
- **RE-2 (S2, S3).** Em captura em cinza, os estados se distinguem por silhueta e palavra, e a legenda de glifos é
  acessível.
- **RE-3 (C7).** A posição de referência só aparece depois do registro.
- **RE-4 (S7).** A 390, régua vertical, sem rolagem horizontal, com as raias legíveis.
- **RE-5 (T12).** Degraus sem data aparecem como "não declarado", nunca interpolados.
- **RE-6 (C3).** Pergunta e primeiro cartão a classificar estão no 1º viewport a 390.

**Protótipo:** **M12·A02 — O que foi decidido, o que ficou de fora, e por que a distinção é o conteúdo**
(instrumento portado, régua de 12 marcos que volta em A03–A06). Alternativa: M06·A02, a variante histórica.

### 3.9 `DOSSIE` · Dossiê de decisão (8 aulas)

**Quando usar.** O ato principal é **decidir** com informação incompleta, e o bar C8 se aplica:
- nada aparece abaixo da decisão antes do registro;
- as consequências têm pelo menos duas dimensões;
- nenhum escore único.

O padrão vem do P17 (Desafio de decisão): o learner explicita a decisão, cita evidências, declara premissas, reconhece
um trade-off e, opcionalmente, diz o que o faria mudar.

**Gramática a 1440**
1. T2. O primeiro ato é o dilema, enunciado com os fatos da aula ("Concluir, abandonar ou continuar esperando?").
2. **Dossiê em colunas (1–7):** ficha de caso com números datados e fonte, linha do tempo só de eventos datados
   (`C-TL`) e, quando há, o palco do instrumento.
3. **Mesa de decisão (colunas 8–12)**, alinhada ao dossiê:
   1. opções de mesmo peso visual, **incluindo "não é possível concluir"**;
   2. campo "evidência que você usa" (selecionar itens do dossiê);
   3. "premissa";
   4. "trade-off".
4. **Barreira de registro.** Abaixo da mesa não há nada visível antes do registro (C8). Rolar mostra só a linha "as
   consequências aparecem depois da sua decisão".
5. Consequências em pelo menos duas dimensões (ex.: custo médio × exposição no pior mês; M04·A07), em texto e figura,
   sem escore.
6. **Balanço:** ligação às aulas e termos que a decisão mobilizou, e "o que faria mudar de decisão".
7. T10, T11.

**Gramática a 390**
1. Dossiê recolhido em seções (disclosures com rótulo).
2. Decisão em botões empilhados.
3. Campos em sequência.
4. A barreira de registro continua valendo.

**Abertura e primeiro ato típicos.**
- "Monte a carteira que cumpre a política no pior mês" (M04·A07).
- "O contrato foi descumprido?" (M05·A03, fecho).

**Visualizações típicas.** `V-DOC` (política de uma página), `V-SER` (custo mensal empilhado), `V-TL`, `V-BAR`.

Imagens: documentais do objeto do caso, com crédito e sem afirmar mais do que a imagem prova (Angra, M03·A08).

**Conclusão e recuperação.** "Praticado" registra a decisão e a justificativa. Não existe "decisão correta" pontuada;
existe referência da fonte ou do modelo e critério. A recuperação traz um conceito de aula anterior que a decisão
precisava usar.

**Requisitos de componente.** `C-DOSSIE` (decisão, justificativa estruturada, barreira, consequências
multidimensionais, balanço), `C-DOC`, `C-TL`, `C-CADERNO` (a decisão persiste). É o mesmo componente que o **Desafio
de decisão** do Caso — Operação A (P17) usa na Revisão do módulo.

**Riscos contra o bar.**
- Consequência binária ou escore único (C8).
- **Chamar de jogo** (P4, P25: jogo fora desta wave).
- Rubrica por contagem de caracteres.
- Fato novo inventado no cenário (P17: só fatos do caso).
- "Parte N" do caso (P17).
- Números vivos sem data (M03·A08: "em aberto em jun/2026").

**Critérios de aceite (render).**
- **DO-1 (C8).** Filmstrip dossiê → decisão → registro → consequências: no quadro da decisão, nenhuma consequência
  está visível nem alcançável por rolagem.
- **DO-2 (C8).** As consequências mostram pelo menos duas dimensões com nome e unidade; nenhum número único resume o
  resultado.
- **DO-3 (C7, P18).** "Não é possível concluir" tem o mesmo peso visual das outras opções; não aparece "correto",
  "aprovado" nem cor de acerto.
- **DO-4 (§6).** A palavra "jogo" não aparece. No M08, o rótulo "Exercício de decisão" continua valendo (P4).
- **DO-5 (S4).** Todo número do dossiê tem fonte e data.
- **DO-6 (S7).** A 390, a barreira continua valendo, e a decisão é registrável com alvos ≥ 44 px.

**Protótipo:** **M04·A07 — Portfólio de contratação** (instrumento portado; consequências em custo e exposição;
política preenchível). Alternativa: M03·A08, a variante sem instrumento.

### 3.10 `SINTESE` · Síntese de módulo (9 aulas)

**Quando usar.** A última aula do módulo, quando o ato mobiliza o módulo inteiro. Há três variantes com a mesma
gramática de base.

| Variante | O que é | Aulas |
|---|---|---|
| **Banca de enunciados** | N frases verdadeiras e insuficientes; o learner tria o defeito e escreve a pergunta que desarma | M14·A08, M15·A09, M16·A10, M17·A11 |
| **Procedimento com veredito** | Roteiro cronometrado que termina em um de três vereditos | M10·A09, M11·A08 |
| **Ateliê de produção** | Grade com subcampos obrigatórios, partitura ou cadeias escritas de memória | M06·A06, M12·A08, M13·A08 |

**Gramática a 1440**
1. T2. O primeiro ato é o primeiro item da banca, o primeiro passo do procedimento ou a primeira casa da grade.
2. **P:**
   - **Banca:** um enunciado por vez, centralizado (≈ 60%), e as bandejas de defeito como colunas sob ele, com
     contador.
   - **Procedimento:** o documento esquemático com passos que acendem, mais o trilho de tempo (`V-GANTT`) com
     envelope.
   - **Ateliê:** a grade com estado por casa (vazia, rascunho, registrada, comparada), com a ficha de consulta ao
     lado, **recolhível**.
3. **Recuperação embutida.** Cada item carrega a **origem visível** (A0x do módulo). A resposta antiga do learner, se
   existir, só aparece depois da nova (T9).
4. Depois do registro de cada item, o painel da fonte: "o que exatamente falta · a pergunta · a forma corrigida".
5. Fechamento editorial curto (ex.: "fechamento sem ranking", M17·A11), sem aforismos em série.
6. T10 e T11. O próximo passo é **Revisão → Avaliação do módulo**, com o critério mostrado antes (P18, C10).

**Gramática a 390**
- Banca: um enunciado por tela, bandejas como botões.
- Procedimento: passos em lista com o trecho do documento abaixo.
- Ateliê: casas em sequência com subcampos; a ficha de consulta vira disclosure.

**Abertura e primeiro ato típicos.**
- "Doze frases, todas verdadeiras, todas levam a uma conclusão errada. Qual é o defeito de cada uma?" (M17·A11).

**Visualizações típicas.** `V-MATRIZ`, `V-GANTT`, `V-ESC` (escada de estados da margem equatorial, M15·A09),
`V-DOC`.

**Conclusão.**
- A síntese é onde "Serve a" fica mais explícito: lista das capacidades do módulo que os itens exercitaram.
- **Nunca "módulo concluído" como competência** (P18).
- Demonstrado continua "ainda não avaliado" até existir tarefa portadora de evidência (S3).

**Requisitos de componente.** `C-BANCA`, `C-ANDAIME`, `C-CADERNO` (traz o campo em branco da aula anterior; M13
A07→A08), `C-MATRIZ`, `C-POSIC`.

**Riscos contra o bar.**
- Virar quiz temático (§6 "jogo falso"; C8).
- Texto aberto como ato na maioria dos itens (C9: fallback).
- Completude medida por caracteres.
- Painel da fonte revelado no clique (instrumentos-consulta da fonte).
- Usar itens do quiz, que pertencem à Avaliação (M01 T08).

**Critérios de aceite (render).**
- **SN-1 (C7).** Para cada item, o filmstrip mostra item → escolha e pergunta registradas → painel da fonte; o painel
  nunca aparece antes.
- **SN-2 (C10).** Cada item mostra a aula de origem; filmstrip da recuperação sem a resposta antiga antes da nova.
- **SN-3 (C9, C8).** A maioria dos itens tem ato fechado (bandeja, ordem, posição); o texto aberto é complemento.
- **SN-4 (S3, P18).** No fim, só aparecem "Percorrido · Praticado · Serve a" e o caminho para Revisão → Avaliação; nada
  de "Aprovado" nem de percentual sem escopo.
- **SN-5 (S7).** A 390, um item por tela, sem rolagem horizontal, com bandejas ≥ 44 px.
- **SN-6 (anti-LMS).** Nas variantes sem previsão, a fonte junto ao enunciado (ou a escada/carta) aparece até o 2º
  viewport.

**Protótipo:** **M15·A09 — Ler um número ponta a ponta, e o dilema apresentado pelos dois lados** (banca com
instrumento portado; é a variante mais frequente). Alternativa: M13·A08, o ateliê.

---

## 4. Distribuição nas 141 aulas

A lista completa por arquétipo está em `mapa-aulas.json → aulas_por_arquetipo`. A tabela abaixo mostra quantas aulas
cada módulo tem em cada arquétipo.

| Módulo | PRANCHA | SISTEMA | MESA | LUPA | REGUA | CARTA | SERIE | ANATOMIA | SINTESE | DOSSIE | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| M01 | 5 | 2 | 1 | · | · | 1 | · | · | · | · | 9 |
| M02 | 3 | 2 | 1 | · | · | · | 2 | 1 | · | 1 | 10 |
| M03 | 4 | · | · | 1 | · | 1 | 3 | · | · | 1 | 10 |
| M04 | 4 | 1 | · | · | · | · | · | 1 | · | 1 | 7 |
| M05 | 2 | 1 | 1 | · | · | 1 | · | · | · | 1 | 6 |
| M06 | 1 | 1 | 1 | · | 1 | · | · | · | 1 | 1 | 6 |
| M07 | · | 1 | 2 | · | 2 | 1 | · | 1 | · | · | 7 |
| M08 | · | · | 1 | 2 | · | 2 | 1 | · | · | 1 | 7 |
| M09 | 1 | 2 | 1 | · | 1 | · | · | 2 | · | 1 | 8 |
| M10 | 1 | · | 2 | 1 | 1 | · | 2 | 1 | 1 | · | 9 |
| M11 | 1 | · | 1 | · | 2 | 1 | · | 2 | 1 | · | 8 |
| M12 | · | 2 | 1 | 2 | 1 | 1 | · | · | 1 | · | 8 |
| M13 | 2 | · | 2 | · | · | · | 1 | 1 | 1 | 1 | 8 |
| M14 | 3 | 1 | · | 2 | 1 | · | · | · | 1 | · | 8 |
| M15 | 3 | 1 | 1 | 2 | 1 | · | · | · | 1 | · | 9 |
| M16 | 1 | 2 | 1 | 2 | 2 | 1 | · | · | 1 | · | 10 |
| M17 | 1 | 2 | 1 | 4 | 1 | 1 | · | · | 1 | · | 11 |
| **Total** | **32** | **18** | **17** | **16** | **13** | **10** | **9** | **9** | **9** | **8** | **141** |

**Leitura.**
- **A Trilha 1 (M01–M05) é de mecanismo:** 18 das 42 aulas são `PRANCHA`.
- **A Trilha 2 (M06–M12) é de instituição e documento:** concentra `REGUA`, `ANATOMIA` e `MESA`.
- **A Trilha 3 (M13–M17) é de leitura crítica:** 10 das 16 `LUPA` e 5 das 9 `SINTESE` estão nela.
- Todo módulo usa pelo menos 4 arquétipos. Nenhum usa um só.

**Outros números do mapa.**

| Item | Valor |
|---|---|
| Previsão útil | 131 aulas: categórica 67, numérica 54, posição 7, traço 3 |
| Sem previsão útil | 10 aulas (§2.4) |
| Sem instrumento na fonte | 11 aulas (ato da camada Alexandria): M01·A03, M01·A06, M01·A09, M02·A06, M03·A04, M03·A07, M03·A08, M10·A01, M10·A07, M16·A06, M16·A09 |
| Instrumento não portado (§9) | 43 aulas, de M09, M13, M14, M16 e M17 (55 instrumentos). Nessas aulas, o protótipo depende do porte **ou** de um ato Alexandria derivado da tabela da fonte |
| Arquétipo secundário | 95 aulas. Os mais comuns: `MESA` 28, `DOSSIE` 15, `PRANCHA` 13, `REGUA` 12 |

**A taxa de previsão é alta.** 131 aulas com previsão útil pede vigilância: previsão que só repete o parágrafo
anterior é recordação, não previsão (C3). Cada protótipo verifica isso (§8).

---

## 5. Catálogo de componentes e visualizações

### 5.1 Tronco (vale para as 141 aulas)

`T-SHELL` · `T-LOCALIZADOR` · `T-ABERTURA` · `T-ATO` · `T-AUTOAV` · `T-FONTE` · `T-CAMADA` · `T-TERMO` ·
`T-NIVEIS` · `T-RECUP` · `T-REGISTRO` · `T-PROXIMO` · `T-AUSENCIA` · `T-A11Y` (ver §2.2).

### 5.2 Componentes de ato e de layout

| ID | O que é | Aulas |
|---|---|---:|
| `C-PREVISAO` | Caixa de previsão (numérica, categórica, posição) + quadro previsto × calculado fixo | 128 |
| `C-CLASSIF` | Mesa de classificação: itens → caixas, teclado e botões, revelação pós-tentativa | 71 |
| `C-PRANCHA` | Prancha dividida na ordem fixa do C5 | 65 |
| `C-META` | Meta a alcançar: detecção sem arredondamento, estado por palavra | 34 |
| `C-TL` | Linha do tempo de estado: raias, marcos, glifos, "verificado em" × "hoje" | 27 |
| `C-SELO` | Selo de estado datado, com validade (F-M12-1) | 25 |
| `C-DIAG` | Diagrama de sistema com estados: acender por seção, desligar componente | 25 |
| `C-DOSSIE` | Mesa de decisão: "não é possível concluir", evidência, premissa, trade-off, barreira, consequências multidimensionais, balanço | 22 |
| `C-POSIC` | Posicionador em escada, plano ou mapa, com alternativa por lista | 22 |
| `C-MATRIZ` | Matriz de leitura lateral: foco por linha ou coluna, célula que abre no lugar, referência velada por célula | 22 |
| `C-LUPA` | Par de números com trilhos de declaração e forma corrigida | 18 |
| `C-ORDEM` | Ordenador acessível (teclado, "mover para cima/baixo") | 15 |
| `C-DOC` | Documento esquemático com zonas e margem de anotação | 14 |
| `C-CADERNO` | Artefato do learner que atravessa aulas (ficha, carteira, campo em branco, traço previsto) | 13 |
| `C-BANCA` | Banca de enunciados: um por vez, bandejas, pergunta escrita, painel da fonte | 7 |
| `C-ANDAIME` | Grade de produção com subcampos obrigatórios e completude por partes | 5 |
| `C-PRESET` | Instrumento com cenário e controles travados por aula (F-M03-4) | 5 (subestimado: toda figura recorrente usa) |
| `C-PREV-TRACO` | Previsão desenhada com alternativa por pontos e teclado | 3 |

### 5.3 Visualizações programáticas

| ID | Figura | Aulas |
|---|---|---:|
| `V-CADEIA` | Cadeia, camadas, nós, rota institucional | 40 |
| `V-MATRIZ` | Matriz de leitura lateral (a figura do `C-MATRIZ`) | 32 |
| `V-TL` | Linha do tempo em faixas com glifos | 30 |
| `V-ESC` | Escada ordinal ou log com limiares | 26 |
| `V-SER` | Série temporal com traço e fantasma | 25 |
| `V-BAR` | Barras comparativas com rótulo direto (inclui log com razão) | 25 |
| `V-DOC` | Documento esquemático | 14 |
| `V-XY` | Curva y = f(x) com ponto atual | 12 |
| `V-RET` | Retângulo de energia / caixa teórica (P × t) | 9 |
| `V-MAPA` | Cartografia Natural Earth / mapa esquemático | 9 |
| `V-PARTES` | Partes de um todo com escopo (barra 100%, mosaico, pizza desenhável) | 9 |
| `V-FAIXA` | Barras de faixa com ponto do learner, régua com limiares | 8 |
| `V-CASC` | Cascata aditiva com termo negativo | 8 |
| `V-FLUXO` | Fluxo, Sankey, funil com conservação | 6 |
| `V-GANTT` | Trilho de duração: rito, minutos, partitura | 6 |
| `V-DEG` | Curva de oferta em degraus | 4 |
| `V-PLANO` | Plano 2D de posição | 3 |
| `V-ONDA` · `V-TRI` · `V-UNIF` · `V-HEAT` | Onda · triângulo (já existe) · unifilar · mapa de calor | 2 · 2 · 1 · 1 |

**Regras comuns às figuras (C6, S2):**
- título-afirmação → subtítulo com unidade → figura → F → classe;
- até 4 categorias com cor (as demais neutras) e rótulos diretos;
- zero semáforo;
- toda cor casa com token;
- "esquemático" quando não há escala.

---

## 6. O que construir, em ordem

**Critério de ordenação** (a mesma lista está em `mapa-aulas.json → construcao_priorizada`, com contagens calculadas
do mapa):
1. o que destrava gates da Regra-mãe e de C3/C7/C9 em mais aulas;
2. o que os protótipos precisam;
3. o número de aulas atendidas.

| # | Onda | Peça | Aulas | Protótipos que dependem |
|---:|---|---|---:|---|
| 1 | 0 · tronco | **Tronco T-\*** (§2.2) | 141 | todos os 10 |
| 2 | 1 · ato | `C-PREVISAO` + quadro previsto × calculado | 128 | M01·A03, M01·A08, M04·A07, M08·A04, M10·A01, M12·A01, M12·A02, M15·A09 |
| 3 | 1 · ato | `C-CLASSIF` | 71 | M01·A03, M10·A01, M12·A02, M13·A06 |
| 4 | 2 · layout | `C-PRANCHA` | 65 | M01·A08, M02·A04, M08·A04, M12·A01 |
| 5 | V · figura | `V-CADEIA` | 40 | M01·A03 |
| 6 | 1 · ato | `C-META` | 34 | M02·A04, M12·A01 |
| 7 | V · figura | `V-TL` | 30 | M12·A02, M13·A06 |
| 8 | 2 · layout | `C-TL` + `C-SELO` | 37 | M01·A08, M08·A04, M12·A02, M13·A06 |
| 9 | 2 · layout | `C-MATRIZ` + `V-MATRIZ` | 34 | M13·A06, M15·A09 |
| 10 | V · figura | `V-ESC` | 26 | M15·A09 |
| 11 | V · figura | `V-SER` | 25 | M02·A04, M04·A07 |
| 12 | 1 · ato | `C-PREV-TRACO` | 3 | M02·A04 (captura obrigatória do bar) |
| 13 | V · figura | `V-BAR` | 25 | — |
| 14 | 1 · ato | `C-POSIC` | 22 | M08·A04, M15·A09 |
| 15 | 2 · layout | `C-DIAG` | 25 | M01·A03 |
| 16 | 2 · layout | `C-DOSSIE` (serve também ao Desafio de decisão, P17) | 22 | M04·A07 |
| 17 | 2 · layout | `C-LUPA` | 18 | M12·A01 |
| 18 | V · figura | `V-RET` | 9 | M01·A08, M10·A01 |
| 19 | V · figura | `V-FAIXA` | 8 | M01·A08 |
| 20 | 1 · ato | `C-ORDEM` | 15 | — |
| 21 | 2 · layout | `C-DOC` + `V-DOC` | 17 | M04·A07, M10·A01 |
| 22 | 2 · layout | `C-CADERNO` | 13 | M04·A07, M10·A01, M15·A09 |
| 23 | V · figura | `V-XY` | 12 | — |
| 24 | V · figura | `V-PARTES` | 9 | M12·A01 |
| 25 | V · figura | `V-CASC` | 8 | — |
| 26 | V · figura | `V-MAPA` | 9 | — |
| 27 | 2 · layout | `C-BANCA` | 7 | M15·A09 |
| 28 | V · figura | `V-FLUXO` | 6 | — |
| 29 | V · figura | `V-GANTT` | 6 | — |
| 30 | 2 · layout | `C-ANDAIME` | 5 | — |
| 31 | 2 · layout | `C-PRESET` | 5 | M12·A02 |
| 32 | V · figura | `V-DEG` | 4 | — |
| 33 | V · figura | `V-PLANO` | 3 | M08·A04 |
| 34 | V · figura | `V-ONDA` · `V-TRI` · `V-UNIF` · `V-HEAT` | 6 | M01·A03 |

**Dependências de §9 que atravessam a lista** (não são componentes, mas bloqueiam o aceite):

| Dependência | Alcance |
|---|---|
| **Emissão e persistência de tentativas** (previsão, resposta, classificação, decisão, autoavaliação, texto) | Todas as 141. Sem isso, T3 e T10 só mostram estado de sessão, e o gate S6 fica "aguardando dependência" |
| **Porte dos instrumentos** de M09, M13, M14, M16 e M17 | 43 aulas |
| **Desenho das formas prometidas** pelos instrumentos já portados | Veja `dependencias` no mapa |
| **Re-extração do corpo** (listas, fórmulas e três níveis perdidos) | M01, M03, M05, M07 (T1 de cada estudo) |
| **Modelo de dados de fonte** (ficha, data de verificação, validade) | T4 e `C-SELO` |
| **Extração e renderização** de Caso, Revisão e Avaliação | Próximo passo da `SINTESE` e da última aula de cada módulo |

---

## 7. Aulas-protótipo

Um protótipo por arquétipo. A ordem de construção vem abaixo.

| Ordem | Arquétipo | Protótipo | Por que esta | Bloqueios a resolver antes |
|---:|---|---|---|---|
| 1 | `PRANCHA` | **M01·A08** — 100 MW solar ≠ 100 MW térmica | Peça-piloto do bar; única aula da fonte com previsão, instrumento, figura e exercício; `V-RET` volta em M01·A01/A05, M02·A07 e M16·A04 | P19 (rótulo do cenário), P20 (faixas: selo "verificação pendente"), fórmula da 8.2 re-extraída, DIV-01/COD-06 (só o ramo ativo), P21 FCap, revisão factual das 10 colocações de mídia |
| 2 | `MESA` | **M13·A06** — Riscos, e o crédito que o currículo não nomeia (título literal da fonte: "Seis categorias de risco…"; P23) | Captura obrigatória "aula de M13"; sem instrumento portado nem exercício da fonte; testa o C9 com ato Alexandria derivado das células | Dados da matriz a partir de `extraction/m13/instrumentos.json` (sem README de verificação); "estado verificado em 02/08/2026"; Caso — Operação A para a aplicação |
| 3 | `SERIE` | **M02·A04** — A demanda respira… | Captura obrigatória "curva líquida, que precisa ser desenhada"; introduz `C-PREV-TRACO` | COD-M02-07 (o calculador devolve a série), traço acessível |
| 4 | `LUPA` | **M12·A01** — Oitenta e sete por cento de quê | Família mais característica de T2/T3; instrumento portado; mosaico prova C6 | Desenho do mosaico, fichas de fonte (§Ref), rótulo do 41% como cenário |
| 5 | `CARTA` | **M08·A04** — O maior sistema de armazenamento… | Plano diagnóstico com quatro pontos datados; o marcador anti-LMS 6 trabalhando | Limiares 100%/50% rotulados como do instrumento; números vivos com data; "fotografias" restauradas |
| 6 | `SISTEMA` | **M01·A03** — A rede tem um batimento cardíaco… | Sem instrumento nem exercício na fonte, dentro do módulo-padrão (M01 T07) | Content QA "86.400 vezes"; figura AC×DC re-extraída; atribuição do anel de Faraday (Uppenborn 1889) |
| 7 | `ANATOMIA` | **M10·A01** — Os quatro eixos de controle | Fatura esquemática: peça de maior reuso (M02, M09, M10); aula sem instrumento | F-M10-01; recuperação depende da extração do M09 |
| 8 | `REGUA` | **M12·A02** — O que foi decidido, o que ficou de fora… | Régua portada com 12 marcos que volta em A03–A06 (`C-PRESET`); `C-SELO` com validade | Reverificação dos estados (COP31 etc.); fichas UNFCCC/Planalto |
| 9 | `DOSSIE` | **M04·A07** — Portfólio de contratação | Instrumento portado com consequências em custo e exposição (C8 verificável); base do Desafio de decisão (P17) | Persistência da política e da carteira; saída "pior mês" (T4); nenhuma questão do quiz para checagem objetiva |
| 10 | `SINTESE` | **M15·A09** — Ler um número ponta a ponta… | Banca com instrumento portado (variante presente em 4 módulos de T3) | Estado "a revisar" persistido; Avaliação do módulo extraída; imagem de satélite com M6 |

**Por que esta ordem.**
- 1–3 são as capturas que o bar exige na Peça C (A08, M13 e M02·A04), com arquétipos bem diferentes. Isso força o
  tronco a provar que é realmente comum antes de a variedade crescer.
- 4–10 cobrem os arquétipos restantes do mais frequente (em T2/T3) ao mais específico.

**Linha "Além do conceito" dos protótipos** (Peça C, verificável no render):
- **M01·A08.** A previsão registrada reaparece no instrumento como previsto × calculado, e a caixa teórica enche até o
  valor do learner antes do calculado.
- **M02·A04.** O traço do learner fica sobre a curva calculada, e a maior distância é anotada em texto.
- **Os demais.** Em cada um, a recuperação repete uma pergunta de aula anterior, com a origem visível, antes da
  resposta antiga.

---

## 8. Riscos transversais e pendências

1. **Previsão em excesso.** O mapa marca 131 aulas com previsão útil.
   - **Teste de aceite:** se a resposta da previsão está no parágrafo imediatamente anterior, ela vira recordação, e a
     aula troca a previsão por outro ato do catálogo C9 (meta, comparação, condição a encontrar).
   - O critic Brief aplica esse teste em todo protótipo.
2. **Classificação que vira quiz.** `C-CLASSIF` aparece em 71 aulas.
   - Cada uso nomeia, no dado, o mecanismo que a classificação exercita. O mapa traz isso em `ato.descricao`.
   - Classificação que só pede memória do texto reprova (§6 "jogo falso"; C9).
3. **Consistência do tronco.** A variedade só passa se a sobreposição de capturas de três arquétipos diferentes
   mostrar abertura, ato, fonte, camada e registro no mesmo lugar e com a mesma forma (critic System).
4. **Instrumentos-consulta da fonte revelam no clique** (M07, M12, M13, M16, M17). Todo porte precisa velar a
   referência até o registro (C7).
5. **Content QA que bloqueia desenho.**
   - M01·A06 (6.1 × 6.2);
   - M01·A07 (7.3 "15% reativos");
   - M01·A04 ("exponencial");
   - M14·A06 (QA-M14-01, energia errada em três ordens de grandeza);
   - M12·A04 ("seis categorias" com sete itens);
   - M13·A06 ("seis categorias… a sexta" × oito linhas no INST·09; resolvido no protótipo por rótulo semântico, §2.6 L4);
   - M09·A01 (contagem 1/3/4/2 × 1/4/3/2).

   Figura viva ao lado de texto errado é pior que tabela: o QA vem antes do render.
6. **P24.** "GridAlpha" aparece em prosa de aula em M01 (A05, A06, A07, A09), M05·A04, M07·A07 e M09·A08. A troca é
   editorial e fica registrada. Os blocos "onde isso entra no produto" continuam fora (P7).
7. **Jogos (P25).** Nenhum arquétipo é jogo, e `DOSSIE` não se chama jogo. A linha "experiência jogável em desenho"
   vive na página do módulo, não na aula.
8. **Arquétipos atribuídos por julgamento.** Onde o desempate foi apertado (M04·A02, M08·A05, M13·A04, M17·A05,
   M17·A08), o mapa registra o arquétipo secundário. O Design Loop pode trocar, desde que a troca siga a árvore da §1
   e fique registrada no mapa.

---

## 9. Esquema do `mapa-aulas.json`

```jsonc
{
  "schema": "alexandria-v2/mapa-aulas@1",
  "arquetipos": { "PRANCHA": "Prancha de mecanismo", … },
  "tronco_comum": ["T-SHELL", …],
  "contagens": { "por_arquetipo": {…}, "por_modulo": {…}, "componentes": {…}, "visualizacoes": {…}, … },
  "aulas_por_arquetipo": { "PRANCHA": ["M01·A01", …], … },
  "exemplos": { "aula-01-08": "PRANCHA", … },
  "construcao_priorizada": [ { "ordem", "onda", "id", "nome", "aulas_atendidas", "prototipos_que_dependem", "porque" } ],
  "aulas": [
    {
      "aulaId": "aula-01-08", "codigo": "M01·A08", "titulo": "…",
      "arquetipo": "PRANCHA", "arquetipo_nome": "…", "arquetipo_secundario": null,
      "ato": { "tipo": "prever → calcular → comparar", "descricao": "…", "camada": "alexandria …" },
      "previsao": true, "previsao_forma": "numérica",            // numérica · categórica · traço · posição · null
      "visualizacao": { "ids": ["V-RET", "V-FAIXA"], "requerida": "…" },
      "instrumento": { "ids": ["m01-inst-06"], "portado": true, "posicao": "após bloco 4 …" },
      "componentes": ["C-PREVISAO", "C-PRANCHA", "C-SELO"],     // além do tronco
      "dependencias": ["§9 registro de previsão e resposta", "P20 …", …],
      "midia_planejada": 10,                                    // null = plano.json ainda não existe
      "exemplo_do_arquetipo": true
    }
  ]
}
```

**Fontes do mapa.**
- `titulo` e `previsao` são lidos dos estudos `mNN.json`.
- `midia_planejada` vem dos `plano.json`.
- As demais colunas são a síntese deste documento, a partir das leituras por aula. A justificativa longa de cada aula
  (bloco, lacunas, QA, 390 px, ambição) continua nos estudos por módulo, que são a referência detalhada.
