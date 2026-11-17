# PORTAR.md — ordem recomendada de porte dos 165 instrumentos

> Gerado por `extratores/gerar-portar.mjs` a partir de `instrumentos.json`. A prosa é escrita;
> **toda contagem e todo custo são derivados do próprio documento**, nunca digitados. Esta lista
> é ordem de trabalho, não promessa de prazo.

## Como ler o custo

O custo é o da **forma prometida** — a figura —, não o do instrumento inteiro. Entradas, saídas e
fórmulas já estão especificadas linha a linha em `instrumentos.md`, e portá-las é transcrição.

| Nível | O que é | Ordem de grandeza |
|---|---|---|
| **P** | Régua, tabela transposta, duas ou três barras, cascata curta | meio dia |
| **M** | Uma figura com eixos: trajetória, pilha ordenada, matriz completa, plano de quadrantes | um dia e meio |
| **G** | Figura composta: grafo sobre geometria fixa, duas pilhas com o fluxo entre elas | três dias |

Somando os 165, se cada figura fosse feita do zero: **184,5 dias**. As famílias da Onda 1 existem para que não sejam.

## O que esta especificação corrige no diagnóstico de partida

O brief desta rodada diz que **só um instrumento desenha a forma que o nome promete**. Essa
medida é do código. Na camada fonte o quadro é outro, e é melhor:

- **121 prometem uma forma** no título ou na própria intro.
- **53 a fonte já desenha**, e outros 7 desenham em parte. O HTML original tem svg, pilha, cadeia, grade e quadrante — com legenda, rótulo de eixo e viewBox literais.
- **61 prometem e não desenham nada.** É aqui que está a dívida de C5 dentro da própria fonte.
- **44 não prometem forma** e não devem ganhar figura por decoração (C6).

Isso inverte a ordem do trabalho: **boa parte do que falta na tela não precisa ser desenhada,
precisa ser portada.** Os instrumentos com *alerta de porte* na Onda 3 têm figura na fonte que o
código perdeu.

Sobre tolerância, a medida da camada fonte é mais dura que a do brief: **2 instrumento de 165**
declara tolerância — `m01-inst-02, m08-inst-04`, três pontos percentuais por fonte. Nos outros 164,
`"tolerancia": null`, e portanto **nenhum veredito “dentro/fora”**: autoavaliação em três níveis
(atende · atende em parte · não atende), como manda C7. Nenhuma margem foi inventada (P6).

Os cinco instrumentos do M01 sem extração de camada fonte — `` —
saem com **ausência declarada** em todos os campos. Eles existem no código, mas o código não é
fonte: especificá-los a partir dele seria inventar a fonte a partir do porte.

## Onda 0 — decisões antes de qualquer porte

Nada aqui é trabalho de builder. São decisões do Founder ou de content QA, e cada uma trava um
readout específico. O resto do instrumento pode ser portado em paralelo.

### 0.1 · Reconciliações que travam um número na tela

| Instrumento | O que está em conflito |
|---|---|
| `m01-lab-01` · Laboratório · Comparador de perfil elétrico | DIVERGÊNCIA NÃO RECONCILIADA (P8/P5): o markup mostra Fábrica A R$ 52.375 e Fábrica B R$ 1.800 / R$ 67.425, enquanto o script calcula R$ 3.200 / R$ 68.825. A resposta de referência não pode ser fixada antes da reconciliação — a pergunta de previsão só entra depois dela. |
| `m14-inst-07` · Régua de biometano — escala mínima e rota de entrega | Registrado no README do M14: o instrumento mostra "1 TJ/ano" no cenário-padrão, enquanto o Ex 08 implica 540 TJ — a expressão en = vol × 36 / 1000 carrega uma divisão a mais dado que o volume entra em milhões de Nm³. As duas leituras ficam preservadas (P5/P8). O readout de energia entregue não pode ser portado como está nem usado como resposta de referência. |
| `m14-inst-08` · Régua de crédito de descarbonização | Registrado no README do M14: a entrada "Diferencial de intensidade de carbono" tem unidade gCO₂e/MJ e é usada no cálculo como percentual (dic/100), e o resultado de emissões evitadas aparece como 102.389 t e como 116.050 t em leituras diferentes. As duas ficam preservadas (P5/P8). Reconciliar antes de portar o readout. |

Enquanto não houver decisão, esses readouts **não são portados como estão**, e as perguntas de
previsão correspondentes ficam fora do ar.

### 0.2 · Pedido de revisão técnica de tolerância

Estes comparam a resposta do learner — ou uma premissa declarada — com uma referência, emitem
juízo por faixa, e a fonte não declara a faixa. **Não inventar (P6).** São candidatos a
tolerância declarada, e a decisão é do Founder:

| Instrumento | O que se pede |
|---|---|
| `m10-inst-09` · Reconstrutor de fatura — estime antes de ver | Este é o gêmeo exato do m08-inst-04, que declara 3 pontos percentuais por bloco. Aqui a fonte não declara nada e o instrumento mesmo assim emite diagnóstico. Pedido ao Founder: fixar (ou recusar) uma tolerância por bloco. Enquanto não houver, o instrumento não pode dizer "dentro" nem "fora" — oferece a autoavaliação em três níveis de C7 sobre a leitura do viés. |
| `m11-inst-06` · Verificador de geração estimada — desvio contra referência independente | O veredito classifica o desvio em faixas (o cenário-padrão cai em "faixa de desvio material"), e os limiares não têm procedência declarada. Pedido ao Founder: fixar a faixa de desvio aceitável entre geração declarada e geração reconstruída, com fonte. Enquanto não houver, o instrumento descreve o desvio e não emite aprovação nem reprovação. |
| `m11-inst-07` · Verificador de degradação declarada — planilha contra garantia do fabricante | A faixa de atenção do veredito é acionada por uma divergência de 0,15 ponto percentual ao ano sem procedência declarada. Pedido ao Founder: fixar, com fonte, a divergência aceitável entre taxa de projeção e taxa garantida. |
| `m11-inst-08` · Verificador de trajetória tarifária — premissa contra ancoragem histórica | Mesmo pedido do m11-inst-06 e do m11-inst-07: os limiares de faixa do veredito não têm procedência. Tratá-los como um conjunto só na revisão técnica. |
| `m12-inst-02` · Separador de grandeza — quanto a eletricidade explica da energia total | ATENÇÃO — possível tolerância já declarada e não classificada: o texto do veredito da fonte diz, literalmente, que o resultado é consistente quando "a renovabilidade agregada implícita fica dentro de dois pontos percentuais do valor oficial que você informou". A extração registra tolerancias: null. Pedido ao Founder: decidir se esses dois pontos percentuais são tolerância declarada — e então o veredito "dentro/fora" é legítimo aqui — ou apenas limiar de ramo de texto. Até a decisão, não exibir veredito de aprovação. |

Até a decisão, os cinco descrevem o desvio e **não aprovam nem reprovam**.

O caso do `m12-inst-02` é o mais urgente dos cinco: o texto do veredito da fonte já diz, com
todas as letras, que o resultado é consistente quando fica **dentro de dois pontos percentuais**
do valor oficial. Ou isso é tolerância declarada — e então o veredito dentro/fora é legítimo ali
—, ou é limiar de ramo de texto. A extração registrou `tolerancias: null`; a frase diz outra
coisa. É reconciliação de uma linha.

## Onda 1 — as famílias de figura, feitas uma vez

Doze famílias cobrem quase toda a dívida de desenho. Construí-las antes dos módulos é o que
transforma um inventário de figuras num sistema — e é o que faz a Alexandria parecer uma coisa
só, em vez de 165 coisas.

| Família | Instrumentos | Custo isolado | O que é |
|---|---:|---:|---|
| **F1 · coluna estável recolorida por lente** | 8 | 11,0 d | Uma lista fixa que não muda; um seletor de lente que reclassifica todos os itens de uma vez; um painel de detalhe que abre sem tirar os outros da tela. A reclassificação simultânea é o conteúdo. |
| **F2 · matriz de leitura lateral** | 18 | 23,0 d | Linhas × colunas com todas as células visíveis e a célula ativa aberta abaixo. Serve a todo instrumento cujo intro declara produto cartesiano completo ou leitura lateral — nesses casos a promessa é a completude. |
| **F3 · barra de tempo segmentada** | 7 | 4,5 d | Uma faixa de duração total dividida em segmentos proporcionais aos tempos que a fonte declara, preenchendo-se conforme o percurso. Onde há duas trilhas, duas faixas paralelas com conectores de sincronização. |
| **F4 · régua com faixas e marcas** | 14 | 14,0 d | Um eixo de uma grandeza, faixas nomeadas sombreadas ao longo dele e uma ou mais marcas. É a figura mais barata e a mais reutilizada do currículo. |
| **F5 · trajetória sobre eixo de tempo** | 17 | 25,5 d | Uma ou duas curvas sobre horas, meses ou anos, com marcas de mínimo, de máximo ou de cruzamento, e a área entre curvas sombreada quando é ela o resultado. |
| **F6 · pilha ordenada e barra composta** | 16 | 17,0 d | Faixas empilhadas por custo, por camada ou por mês, com a marginal ou o total destacados. Cobre despacho, composição de preço, custo mensal por camada e comparação de duas pilhas. |
| **F7 · plano de dois eixos com quadrantes** | 3 | 4,5 d | Dois eixos, quadrantes nomeados e um ponto que migra. Inclui a diagonal de indiferença quando a pergunta é qual dos dois lados ganha. |
| **F8 · grafo sobre geometria fixa** | 3 | 9,0 d | Nós em posições fixas e conjuntos de arestas alternáveis. É a família mais cara e a mais insubstituível: a fixidez da geometria é o que permite comparar os fluxos. |
| **F9 · cascata de reduções** | 4 | 6,0 d | Degraus sucessivos sobre a mesma base, cada um rotulado com o que o reduziu. Onde o primeiro e o último número diferem por uma ordem de grandeza, é a cascata que explica. |
| **F10 · duas pizzas lado a lado** | 2 | 3,0 d | Duas composições de 100% com as mesmas categorias e as mesmas cores, com a troca de posição marcada. A fonte já desenha no m08-inst-02; o m08-inst-04 precisa delas e da banda de tolerância. |
| **F11 · eixo de tempo datado com estado** | 4 | 5,0 d | Marcos posicionados pela data real, pintados pelo estado, com faixa fora do eixo para os marcos que a fonte declara sem data. |
| **F12 · duas barras comparadas com a diferença marcada** | 5 | 5,5 d | Duas alturas na mesma escala e a distância entre os topos rotulada. É a figura de todo verificador — e a que exige escala logarítmica declarada quando as duas diferem por ordens de grandeza. |

As doze cobrem **101 dos 165 instrumentos**. Somadas isoladamente dariam 128,0 dias; feitas como
componente parametrizável, a conta vira o custo de doze figuras mais a parametrização de cada uso.

**F1 · coluna estável recolorida por lente** — `m03-inst-01`, `m10-inst-01`, `m11-inst-01`, `m13-inst-01`, `m14-inst-01`, `m15-inst-01`, `m16-inst-01`, `m17-inst-01`

**F2 · matriz de leitura lateral** — `m07-inst-02`, `m08-inst-05`, `m09-inst-03`, `m09-inst-06`, `m10-inst-07`, `m11-inst-09`, `m12-inst-01`, `m12-inst-05`, `m13-inst-09`, `m13-inst-10`, `m13-inst-11`, `m14-inst-04`, `m14-inst-09`, `m15-inst-02`, `m16-inst-03`, `m16-inst-10`, `m17-inst-04`, `m17-inst-05`

**F3 · barra de tempo segmentada** — `m07-inst-04`, `m07-inst-06`, `m09-inst-10`, `m10-inst-10`, `m11-inst-11`, `m12-inst-11`, `m13-inst-04`

**F4 · régua com faixas e marcas** — `m08-inst-03`, `m10-inst-03`, `m12-inst-08`, `m13-inst-08`, `m14-inst-03`, `m14-inst-05`, `m14-inst-07`, `m15-inst-03`, `m15-inst-06`, `m15-inst-09`, `m16-inst-02`, `m16-inst-05`, `m17-inst-07`, `m17-inst-10`

**F5 · trajetória sobre eixo de tempo** — `m02-inst-04`, `m02-inst-07`, `m03-inst-03`, `m03-inst-04`, `m03-inst-05`, `m04-inst-02`, `m05-inst-05`, `m06-inst-02`, `m06-inst-03`, `m06-inst-04`, `m06-inst-07`, `m08-inst-06`, `m08-inst-10`, `m11-inst-05`, `m11-inst-07`, `m11-inst-08`, `m16-inst-06`

**F6 · pilha ordenada e barra composta** — `m01-lab-01`, `m02-inst-03`, `m02-inst-05`, `m03-inst-06`, `m04-inst-01`, `m04-inst-04`, `m04-inst-05`, `m04-inst-07`, `m12-inst-02`, `m14-inst-06`, `m15-inst-04`, `m15-inst-05`, `m15-inst-07`, `m16-inst-08`, `m17-inst-03`, `m17-inst-11`

**F7 · plano de dois eixos com quadrantes** — `m05-inst-06`, `m08-inst-08`, `m14-inst-02`

**F8 · grafo sobre geometria fixa** — `m07-inst-01`, `m08-inst-01`, `m09-inst-01`

**F9 · cascata de reduções** — `m14-inst-08`, `m16-inst-04`, `m16-inst-09`, `m17-inst-09`

**F10 · duas pizzas lado a lado** — `m08-inst-02`, `m08-inst-04`

**F11 · eixo de tempo datado com estado** — `m06-inst-01`, `m11-inst-03`, `m12-inst-04`, `m16-inst-07`

**F12 · duas barras comparadas com a diferença marcada** — `m10-inst-09`, `m11-inst-06`, `m12-inst-09`, `m13-inst-02`, `m13-inst-07`

## Onda 2 — os 55 que não têm porte nenhum

Os módulos **M09, M13, M14, M16, M17** somam 55 instrumentos e nenhum objeto no código. Vêm primeiro
porque a ausência aqui é total: não é uma figura faltando, é a aula sem o instrumento que ela
invoca.

A ordem dentro da onda é por módulo, e dentro do módulo é a da fonte — o instrumento de módulo
(§ MAP) primeiro, porque enquadra os outros, e depois aula a aula. Meio módulo portado não é
metade de um módulo utilizável.

Total da onda: **60,0 dias de figura**, antes do desconto das famílias.

### M09 — 11 instrumentos · 13,0 dias de figura

| # | Instrumento | Estado da forma | Custo | Família |
|---|---|---|---|---|
| 1 | `m09-inst-01` · Mapa do mercado — energia, contrato, dinheiro | cumprido na fonte | G | F8 |
| 2 | `m09-inst-02` · Comparador componente a componente | cumprido em parte — a fonte conta as classes e detalha um componente por vez; o "lado a lado nos dois ambientes" que o intro promete não está desenhado | M | — |
| 3 | `m09-inst-03` · Anatomia do produto de leilão | promessa sem desenho | M | F2 |
| 4 | `m09-inst-04` · Régua de elegibilidade e cronograma condicionado | promessa sem desenho | M | — |
| 5 | `m09-inst-05` · Montador de contrato — perfil de risco resultante | promessa sem desenho | M | — |
| 6 | `m09-inst-06` · Matriz contrato × risco — produto cartesiano completo | promessa sem desenho — e é a promessa mais explícita do módulo: o instrumento se chama matriz, declara 42 células e mostra uma | M | F2 |
| 7 | `m09-inst-07` · Simulador de exposição residual | sem promessa de forma | P | — |
| 8 | `m09-inst-08` · Anatomia do fator de ajuste | sem promessa de forma | P | — |
| 9 | `m09-inst-09` · Roteador — vale investigar, não vale, ou não dá para dizer | sem promessa de forma | P | — |
| 10 | `m09-inst-10` · Régua do ciclo comercial — o que pode dar errado em cada etapa | promessa sem desenho | P | F3 |
| 11 | `m09-inst-11` · Localizador de dado de mercado | sem promessa de forma | P | — |

### M13 — 11 instrumentos · 9,5 dias de figura

| # | Instrumento | Estado da forma | Custo | Família |
|---|---|---|---|---|
| 1 | `m13-inst-01` · Painel de controle setorial | promessa sem desenho | M | F1 |
| 2 | `m13-inst-02` · Calculadora de múltiplo com alavancagem | promessa sem desenho | P | F12 |
| 3 | `m13-inst-03` · Simulador de DCF de concessão com prazo definido | cumprido na fonte | M | — |
| 4 | `m13-inst-04` · Roteiro cronometrado de leitura | promessa sem desenho | P | F3 |
| 5 | `m13-inst-05` · Verificador de lacuna | sem promessa de forma | P | — |
| 6 | `m13-inst-06` · Classificador de arquétipo de controle | sem promessa de forma | P | — |
| 7 | `m13-inst-07` · Comparador de participação e voto | cumprido na fonte | P | F12 |
| 8 | `m13-inst-08` · Régua de estrutura de capital e cobertura | promessa sem desenho | M | F4 |
| 9 | `m13-inst-09` · Matriz de risco em duas lentes | promessa sem desenho | M | F2 |
| 10 | `m13-inst-10` · Comparador empresa × indicador | cumprido na fonte | P | F2 |
| 11 | `m13-inst-11` · Andaime de tese de investimento · instrumento assinatura | promessa sem desenho | P | F2 |

### M14 — 10 instrumentos · 12,0 dias de figura

| # | Instrumento | Estado da forma | Custo | Família |
|---|---|---|---|---|
| 1 | `m14-inst-01` · Mapa de rotas — insumo, conversão, produto, mercado, órgão | cumprido na fonte | M | F1 |
| 2 | `m14-inst-02` · Calculadora de paridade por custo/km | promessa sem desenho | M | F7 |
| 3 | `m14-inst-03` · Régua de mix açúcar-etanol | cumprido na fonte | P | F4 |
| 4 | `m14-inst-04` · Comparador de rotas de etanol — três rotas, sete dimensões | cumprido em parte — a fonte compara as três rotas, mas só numa dimensão por vez, e o título promete sete | M | F2 |
| 5 | `m14-inst-05` · Calculadora de demanda derivada por conteúdo obrigatório | promessa sem desenho | M | F4 |
| 6 | `m14-inst-06` · Simulador de cogeração sazonal — as três grandezas lado a lado | cumprido na fonte | P | F6 |
| 7 | `m14-inst-07` · Régua de biometano — escala mínima e rota de entrega | promessa sem desenho | M | F4 |
| 8 | `m14-inst-08` · Régua de crédito de descarbonização | promessa sem desenho | M | F9 |
| 9 | `m14-inst-09` · Classificador de insumo — rota, produto, órgão e concorrente | promessa sem desenho | M | F2 |
| 10 | `m14-inst-10` · Verificador de base temporal e rota — instrumento assinatura | sem promessa de forma | P | — |

### M16 — 11 instrumentos · 13,5 dias de figura

| # | Instrumento | Estado da forma | Custo | Família |
|---|---|---|---|---|
| 1 | `m16-inst-01` · Mapa das seis tendências | cumprido na fonte | M | F1 |
| 2 | `m16-inst-02` · Régua de estágio de maturidade | promessa sem desenho | M | F4 |
| 3 | `m16-inst-03` · Comparador de gargalo | cumprido em parte — a fonte compara os cinco candidatos dentro de uma tendência, e o título promete a comparação entre as seis | M | F2 |
| 4 | `m16-inst-04` · Conversor de frota em carga | sem promessa de forma | M | F9 |
| 5 | `m16-inst-05` · Régua de armazenamento | promessa sem desenho | M | F4 |
| 6 | `m16-inst-06` · Rampa de medição avançada | promessa sem desenho — o instrumento se chama rampa e não desenha rampa nenhuma | M | F5 |
| 7 | `m16-inst-07` · Verificador de estado da política de carbono | sem promessa de forma | P | F11 |
| 8 | `m16-inst-08` · Calculadora de escopo 2 — os dois métodos lado a lado | promessa sem desenho — e a fonte declara, no intro, que exibir um método sozinho é o defeito | P | F6 |
| 9 | `m16-inst-09` · Decompositor de demanda de centro de dados | sem promessa de forma | M | F9 |
| 10 | `m16-inst-10` · Grade de mapeamento de posicionamento | promessa sem desenho — o instrumento se chama grade e mostra uma célula | M | F2 |
| 11 | `m16-inst-11` · Verificador de estágio e de gargalo | sem promessa de forma | P | — |

### M17 — 12 instrumentos · 12,0 dias de figura

| # | Instrumento | Estado da forma | Custo | Família |
|---|---|---|---|---|
| 1 | `m17-inst-01` · Mapa das jurisdições · reagrupamento por dimensão | promessa sem desenho | M | F1 |
| 2 | `m17-inst-02` · Verificador de perímetro de preço | sem promessa de forma | P | — |
| 3 | `m17-inst-03` · Decompositor de diferença | cumprido na fonte | P | F6 |
| 4 | `m17-inst-04` · Comparador de desenho de despacho | promessa sem desenho | M | F2 |
| 5 | `m17-inst-05` · Grade de remuneração de disponibilidade | promessa sem desenho | M | F2 |
| 6 | `m17-inst-06` · Conversor de preço de disponibilidade | sem promessa de forma | P | — |
| 7 | `m17-inst-07` · Régua de estágio aplicada a política estrangeira | promessa sem desenho, com a figura já especificada em outro módulo | P | F4 |
| 8 | `m17-inst-08` · Verificador de pressuposto institucional | promessa sem desenho | M | — |
| 9 | `m17-inst-09` · Calculadora de ajuste de fronteira | promessa sem desenho | M | F9 |
| 10 | `m17-inst-10` · Decompositor de penetração renovável | promessa sem desenho | P | F4 |
| 11 | `m17-inst-11` · Normalizador de preço ao consumidor | promessa sem desenho — o intro manda montar uma pilha e nada é empilhado | M | F6 |
| 12 | `m17-inst-12` · Verificador de comparação · instrumento assinatura | sem promessa de forma | P | — |

## Onda 3 — a figura que a fonte tem e o porte perdeu

Casos em que **não há nada a projetar**: o HTML original desenha e o objeto no código guardou só
os readouts. Custo baixo, ganho alto, e cada um fecha um problema que o bar registra por nome.

| Instrumento | Alerta |
|---|---|
| `m02-inst-04` · Simulador · Curva líquida e a rampa do fim da tarde | O C5/C6 do bar registra como problema "CURVA LÍQUIDA sem curva nenhuma". A fonte TEM a curva. Quem portar precisa portar o svg, não só os readouts. |
| `m08-inst-02` · Conversor de três eixos · as duas pizzas lado a lado | A fonte desenha as duas pizzas. Qualquer porte que entregue só os quatro readouts perde o instrumento inteiro — o título promete o arranjo lado a lado, não os totais. |

Além desses, **todo instrumento marcado “cumprido na fonte” tem desenho declarado na extração — são 53.**
Antes de desenhar qualquer um deles do zero, abrir o `desenho_declarado_na_fonte`
correspondente: legenda, rótulo de eixo, cor por série e viewBox costumam estar literais.

## Onda 4 — as promessas sem desenho nos módulos já portados

São 32 instrumentos fora dos cinco módulos da Onda 2: existem no código, funcionam, e não
desenham o que o nome promete. Vêm por último porque a tela já tem alguma coisa — mas é aqui que
está a diferença entre um instrumento que calcula e um que ensina.

Total da onda: **43,5 dias de figura.**

| Instrumento | O que falta desenhar | Custo |
|---|---|---|
| `m01-lab-01` · Laboratório · Comparador de perfil elétrico | Duas barras empilhadas lado a lado, Fábrica A e Fábrica B, na MESMA escala vertical, cada uma segmentada nas quatro linhas que a fonte já nomeia: Energia, Demanda, Reativo excedente, Adicional ponta; … | M |
| `m02-inst-09` · Simulador · Dois submercados, um fio | Duas pilhas de despacho lado a lado — NE e SE — com uma seta entre elas cuja espessura é o fluxo e cujo limite é uma barra fixa. Quando o fluxo encosta no limite, as duas pilhas passam a ter marginais… | G |
| `m03-inst-04` · Comparador · Reservatório × fio d'água sob a mesma seca | Duas trajetórias mensais desenhadas sobre a MESMA série de afluência: a geração do fio d'água (limitada pela capacidade) e a entrega firme do reservatório (limitada pelo alvo). Abaixo delas, numa faix… | M |
| `m03-inst-08` · Comparador · LCOE por tecnologia — e seus limites | Cinco barras, uma por tecnologia, cada uma partida em duas parcelas — capital e O&M mais variável — na mesma escala; a tecnologia selecionada destacada e as outras quatro presentes ao mesmo tempo, por… | M |
| `m07-inst-02` · Comparador de instrumentos jurídicos | A régua dos onze instrumentos na ordem declarada pela fonte — do mais forte (lei ordinária) ao mais operacional — como uma escada vertical, e ao lado a leitura lateral: os cinco campos fixos (quem emi… | M |
| `m07-inst-05` · Cadeia temporal da operação · produto, decisão e leitura | Os cinco horizontes como faixas encaixadas sobre um mesmo eixo de tempo, do plurianual ao tempo real, cada faixa com a cadência de publicação marcada como repetição — porque o que distingue os cinco p… | M |
| `m07-inst-07` · Escada do travamento · o que parou o projeto e quem destrava | Os sintomas como degraus de uma escada, ordenados pelo prazo típico que a fonte declara para cada um, com o comprimento do degrau proporcional a esse prazo e o órgão competente rotulado no degrau. O s… | M |
| `m08-inst-03` · Calculadora de fator de capacidade · com faixa típica por fonte | Uma régua horizontal de fator de capacidade de 0 a 100%, com a faixa típica da fonte selecionada sombreada entre os seus dois limites e o FCap calculado como marca sobre a régua. Nada mais: é uma figu… | P |
| `m08-inst-10` · Perfil de carga · casamento com a curva de geração | Um dia de 24 horas com duas curvas sobrepostas: o perfil de carga da planta, construído a partir das horas de operação por dia e da concentração no turno diurno, e a curva de geração solar; a área de … | M |
| `m10-inst-01` · Mapa da fatura — três lentes sobre a mesma estrutura | As catorze linhas da fatura empilhadas numa única coluna, sempre as mesmas e sempre na mesma ordem, recoloridas de uma vez conforme a lente ativa: quem define o valor unitário, quem define a quantidad… | M |
| `m10-inst-02` · Comparador de modalidades — diferença estrutural por linha | As linhas da fatura em coluna e, ao lado de cada uma, a direção da mudança em relação à situação atual — sobe, desce, indiferente, ou falta saber — representada por posição e silhueta, nunca por cor d… | M |
| `m10-inst-03` · Dimensionador de demanda — faixas de diagnóstico | Uma régua horizontal de utilização do contrato, com as faixas de diagnóstico do array FAIXA sombreadas e nomeadas ao longo dela — inclusive a faixa de subutilização, que o intro cita expressamente — e… | P |
| `m10-inst-04` · Simulador de ultrapassagem — todos os parâmetros editáveis | O valor faturado de demanda contra a demanda medida, varrendo uma faixa em torno do limite: uma reta até o limite de disparo e, a partir dele, uma segunda inclinação multiplicada. A quebra tem de esta… | M |
| `m10-inst-07` · Anatomia dos encargos — quem financia, quem paga, o que mudou | A matriz dos onze itens de encargo nas linhas e dos quatro campos fixos nas colunas — o que financia, quem paga, como aparece na fatura, o que mudou ou pode mudar por norma recente — com o item seleci… | M |
| `m10-inst-08` · Régua do ciclo tarifário — do processo à linha da fatura | As oito etapas numa régua em sequência, da abertura do processo até o efeito na fatura, cada etapa com o estado de verificação do dossiê marcado; a seta final aponta explicitamente para a linha da fat… | P |
| `m10-inst-09` · Reconstrutor de fatura — estime antes de ver | Duas barras empilhadas de cem pontos lado a lado — a estimativa e o real — com os seis blocos nas mesmas cores; abaixo, uma barra de erro por bloco divergindo de um eixo central, que é o que torna a d… | M |
| `m10-inst-10` · Ordem de leitura cronometrada — o instrumento assinatura | Uma barra de tempo de zero a 280 segundos dividida em nove segmentos com o comprimento de cada passo declarado pela fonte, preenchendo-se conforme o learner marca cada um. O passo 07 — reconciliação d… | P |
| `m11-inst-01` · Mapa da proposta — quatro lentes sobre a mesma estrutura | Os itens da proposta numa coluna fixa, recoloridos pela lente ativa — a que eixo pertence, qual fonte independente confirma, o que o comprador confirma sozinho, o que falta se estiver ausente — com o … | M |
| `m11-inst-02` · Separador de eixos — a que categoria pertence cada afirmação | As doze afirmações separadas em colunas pelos eixos que a fonte nomeia — físico, regulatório, financeiro — com a afirmação escolhida destacada na sua coluna e o painel abaixo trazendo método de verifi… | M |
| `m11-inst-03` · Régua do marco regulatório — sete marcos com data, efeito e estado | Um eixo de tempo com os cinco marcos datados posicionados pela data real e, separada do eixo por uma quebra explícita, uma faixa de "sem data declarada" com os dois últimos. Os dois não vão para o fim… | M |
| `m11-inst-04` · Classificador de porte e modalidade — produto cartesiano completo | Duas coisas na mesma prancha: uma régua de potência instalada em corrente alternada, de 1 kW ao teto máximo, com os limiares de porte marcados e a potência informada como marca sobre ela; e a grade fo… | M |
| `m11-inst-05` · Roteador de regime — data de protocolo determina tudo | Uma escada de percentual ao longo dos anos de referência, uma trajetória por classe de faturamento, com o ano escolhido marcado por uma vertical e o ponto da classe aplicável destacado sobre ela. As q… | M |
| `m11-inst-06` · Verificador de geração estimada — desvio contra referência independente | Duas colunas na mesma escala — geração declarada na proposta e geração de referência reconstruída a partir da irradiação da localidade — com a diferença entre os topos marcada e rotulada como o desvio… | M |
| `m11-inst-07` · Verificador de degradação declarada — planilha contra garantia do fabricante | Duas curvas de produção relativa ao longo do horizonte, partindo do mesmo primeiro ano: uma sob a premissa da proposta e outra sob a taxa máxima garantida no datasheet. A área entre as duas é a energi… | M |
| `m11-inst-08` · Verificador de trajetória tarifária — premissa contra ancoragem histórica | Duas curvas de índice ao longo do horizonte, partindo de 100: uma sob o reajuste assumido na proposta e outra sob a média histórica homologada da concessionária. A área entre elas é o excesso acumulad… | M |
| `m12-inst-01` · Tabuleiro geopolítico — três vetores sobre cinco frentes | A grade 3 × 5 inteira: três vetores nas linhas, cinco frentes nas colunas, quinze células preenchidas e visíveis, com a célula ativa aberta abaixo. Um tabuleiro com uma casa por vez não é tabuleiro.… | M |
| `m12-inst-04` · Régua diplomático-regulatória — o que existe, em que estado, com que prazo | Os doze marcos numa linha do tempo, posicionados pela data que cada um declara, e cada marco pintado pelo seu estado — em vigor, em regulamentação, anunciado, prazo vencido. O estado tem de ser atribu… | M |
| `m12-inst-05` · Comparador de parceiros bilaterais — quatro parceiros, três vetores | A grade 4 × 3 inteira — quatro parceiros nas linhas, três vetores nas colunas — com o cruzamento ativo aberto abaixo em cartões. Doze células visíveis, porque a afirmação do intro é sobre a variação e… | M |
| `m12-inst-08` · Régua de maturidade de projeto anunciado | Uma régua de 0 a 18 com as cinco faixas de estágio nomeadas ao longo dela e a pontuação atual como marca; abaixo, os nove itens de evidência em linhas, cada um mostrando o seu estado (ausente 0, indic… | M |
| `m12-inst-11` · Andaime de conversa — trinta minutos, oito movimentos, sem repetição | Uma barra de trinta minutos dividida nos oito movimentos pelas janelas de minuto que a fonte declara, com o movimento atual destacado e todos os oito clicáveis — porque o intro manda treinar entrando … | P |
| `m15-inst-02` · Comparador de regimes | A matriz 3 × 4 — concessão, partilha e cessão onerosa nas linhas; titularidade da molécula, o que o Estado recebe, como se disputa a área e quem corre o risco nas colunas — com a célula ativa aberta e… | M |
| `m15-inst-06` · Régua de refino · capacidade contra produto | Uma régua em mil bpd com quatro marcas encaixadas — capacidade instalada, carga processada, diesel produzido e demanda nacional — e o descompasso desenhado como a distância entre as duas últimas. A ca… | P |

## Tabela completa — os 165, com custo, tolerância e previsão

| Instrumento | Promete forma | Estado | Custo | Tolerância | Previsão |
|---|---|---|---|---|---|
| `m01-inst-01` · Calculadora · kWh = kW × h | — | — | — | null | — |
| `m01-inst-02` · Calculadora · Lei de Ohm | — | — | — | **declarada** | — |
| `m01-inst-03` · Calculadora · Perdas resistivas | — | — | — | null | — |
| `m01-inst-04` · Calculadora · Demanda média e fator de carga | — | — | — | null | — |
| `m01-inst-05` · Controles · Triângulo de potência | — | — | — | null | — |
| `m01-inst-06` · Calculadora · Fator de capacidade | não | sem promessa de forma | P | null | sim |
| `m01-lab-01` · Laboratório · Comparador de perfil elétrico | sim | promessa sem desenho | M | null | bloqueada |
| `m02-inst-01` · Explorador · Camadas da rede | não | sem promessa de forma | P | null | outro ato |
| `m02-inst-02` · Simulador · Perdas na transmissão | não | sem promessa de forma | M | null | sim |
| `m02-inst-03` · Cadeia de transformação · por perfil | sim | cumprido na fonte | P | null | sim |
| `m02-inst-04` · Simulador · Curva líquida e a rampa do fim da tarde | sim | cumprido na fonte | M | null | sim |
| `m02-inst-05` · Simulador · Despacho por ordem de mérito | sim | cumprido na fonte | M | null | sim |
| `m02-inst-06` · Calculadora · Bateria: potência × energia | não | sem promessa de forma | P | null | sim |
| `m02-inst-07` · Simulador · Excursão de frequência | sim | cumprido na fonte | M | null | sim |
| `m02-inst-08` · Calculadora · Perda embutida na conta | não | sem promessa de forma | P | null | sim |
| `m02-inst-09` · Simulador · Dois submercados, um fio | sim | promessa sem desenho | G | null | sim |
| `m03-inst-01` · Explorador · A matriz nas duas lentes | sim | cumprido na fonte | P | null | sim |
| `m03-inst-02` · Calculadora · FC × energia anual | não | sem promessa de forma | P | null | sim |
| `m03-inst-03` · Simulador · A bateria do Brasil (EAR ao longo do ano) | sim | cumprido na fonte | M | null | sim |
| `m03-inst-04` · Comparador · Reservatório × fio d'água sob a mesma seca | sim | promessa sem desenho | M | null | sim |
| `m03-inst-05` · Simulador · O dia do sistema: solar, vento e o resíduo | sim | cumprido na fonte | M | null | sim |
| `m03-inst-06` · Simulador · A pilha de CVU: monte a ordem de mérito | sim | cumprido na fonte | M | null | sim |
| `m03-inst-07` · Dimensionador · MW, MWh e o preço da viagem no tempo | não | sem promessa de forma | P | null | sim |
| `m03-inst-08` · Comparador · LCOE por tecnologia — e seus limites | sim | promessa sem desenho | M | null | sim |
| `m03-inst-09` · Quebra-cabeça · O encaixe sazonal das fontes | sim | cumprido na fonte | M | null | sim |
| `m04-inst-01` · Simulador · Formador de preço | sim | cumprido na fonte | M | null | sim |
| `m04-inst-02` · Simulador · PLD ao longo do ano | sim | cumprido na fonte | M | null | sim |
| `m04-inst-03` · Simulador · O dinheiro que falta | sim | cumprido na fonte | P | null | sim |
| `m04-inst-04` · Simulador · Sala do leilão reverso | sim | cumprido na fonte | M | null | sim |
| `m04-inst-05` · Simulador · Contrato × spot ao longo de 12 meses | sim | cumprido na fonte | M | null | sim |
| `m04-inst-06` · Mesa de hedge · swap simples | não | sem promessa de forma | P | null | sim |
| `m04-inst-07` · Simulador · Portfólio em camadas | sim | cumprido na fonte | M | null | sim |
| `m05-inst-01` · Simulador · Quando duplicar a rede fica caro | sim | cumprido na fonte | M | null | sim |
| `m05-inst-02` · Simulador · Grau de separação | sim | cumprido na fonte | M | null | sim |
| `m05-inst-03` · Simulador · Composição de contratação | sim | cumprido na fonte, mas a promessa é de faixa e | M | null | sim |
| `m05-inst-04` · Termômetro · Risco de captura | não | sem promessa de forma | P | null | outro ato |
| `m05-inst-05` · Simulador · Ciclo de revisão tarifária | sim | cumprido na fonte | M | null | sim |
| `m05-inst-06` · Mapa · Posição no desenho de mercado | sim | cumprido na fonte | M | null | outro ato |
| `m06-inst-01` · Linha do tempo · quatorze marcos, de 1879 a 2028 | sim | cumprido na fonte | M | null | outro ato |
| `m06-inst-02` · Simulador · a erosão do custo histórico | sim | cumprido na fonte | M | null | sim |
| `m06-inst-03` · Simulador · como se forma uma dívida intrassetorial | sim | cumprido na fonte | M | null | sim |
| `m06-inst-04` · Termômetro do racionamento · balanço de energia num período se | sim | cumprido na fonte | M | null | sim |
| `m06-inst-05` · Comparador · três arquiteturas e onde o risco pousa | sim | cumprido na fonte para a grade; o trade-off pe | M | null | sim |
| `m06-inst-06` · Simulador · o efeito de uma liminar num sistema de rateio | sim | cumprido na fonte | M | null | sim |
| `m06-inst-07` · Linha da abertura · quando cada consumidor passou a poder esco | sim | cumprido na fonte | M | null | sim |
| `m06-inst-08` · Mapa trauma → cicatriz regulatória | sim | cumprido na fonte | M | null | outro ato |
| `m07-inst-01` · Mapa institucional · autoridade × dado | sim | cumprido na fonte | G | null | outro ato |
| `m07-inst-02` · Comparador de instrumentos jurídicos | sim | promessa sem desenho | M | null | outro ato |
| `m07-inst-03` · Estante da EPE · qual documento responde qual pergunta | não | sem promessa de forma | P | null | outro ato |
| `m07-inst-04` · Anatomia de um ato regulatório · rito e janela de influência | sim | cumprido na fonte | P | null | sim |
| `m07-inst-05` · Cadeia temporal da operação · produto, decisão e leitura | sim | promessa sem desenho | M | null | outro ato |
| `m07-inst-06` · Régua do ciclo mensal · contabilização, garantia e liquidação | sim | cumprido na fonte | P | null | sim |
| `m07-inst-07` · Escada do travamento · o que parou o projeto e quem destrava | sim | promessa sem desenho | M | null | outro ato |
| `m07-inst-08` · Roteador de decisão | não | sem promessa de forma | P | null | outro ato |
| `m07-inst-09` · Localizador de dado | não | sem promessa de forma | P | null | outro ato |
| `m07-inst-10` · Calendário institucional · o que sai quando e de quem | sim | cumprido em parte — a fonte dá a fileira dos d | M | null | outro ato |
| `m08-inst-01` · Mapa físico do Brasil elétrico · geração × escoamento | sim | cumprido na fonte | G | null | outro ato |
| `m08-inst-02` · Conversor de três eixos · as duas pizzas lado a lado | sim | cumprido na fonte | M | null | sim |
| `m08-inst-03` · Calculadora de fator de capacidade · com faixa típica por font | sim | promessa sem desenho | P | null | sim |
| `m08-inst-04` · Reconstrutor de matriz · desenhe as duas pizzas de memória | sim | cumprido em parte — a fonte desenha o erro, nã | M | **declarada** | sim |
| `m08-inst-05` · Leitura lateral · o mesmo campo nas seis fontes | sim | cumprido na fonte | P | null | outro ato |
| `m08-inst-06` · Curvas de complementaridade · três escalas sobrepostas | sim | cumprido na fonte | M | null | sim |
| `m08-inst-07` · Calendário sazonal · doze meses do sistema | sim | cumprido em parte — a fonte dá a grade dos doz | M | null | outro ato |
| `m08-inst-08` · Termômetro hidrológico · estoque contra fluxo | sim | cumprido na fonte | M | null | sim |
| `m08-inst-09` · Anatomia do corte de geração · causa, hora e quem paga | não | sem promessa de forma | P | null | sim |
| `m08-inst-10` · Perfil de carga · casamento com a curva de geração | sim | promessa sem desenho | M | null | sim |
| `m08-inst-11` · Roteador de recorte · qual base responde a qual pergunta | não | sem promessa de forma | P | null | outro ato |
| `m09-inst-01` · Mapa do mercado — energia, contrato, dinheiro | sim | cumprido na fonte | G | null | outro ato |
| `m09-inst-02` · Comparador componente a componente | sim | cumprido em parte — a fonte conta as classes e | M | null | sim |
| `m09-inst-03` · Anatomia do produto de leilão | sim | promessa sem desenho | M | null | outro ato |
| `m09-inst-04` · Régua de elegibilidade e cronograma condicionado | sim | promessa sem desenho | M | null | sim |
| `m09-inst-05` · Montador de contrato — perfil de risco resultante | sim | promessa sem desenho | M | null | sim |
| `m09-inst-06` · Matriz contrato × risco — produto cartesiano completo | sim | promessa sem desenho — e é a promessa mais exp | M | null | outro ato |
| `m09-inst-07` · Simulador de exposição residual | não | sem promessa de forma | P | null | sim |
| `m09-inst-08` · Anatomia do fator de ajuste | não | sem promessa de forma | P | null | sim |
| `m09-inst-09` · Roteador — vale investigar, não vale, ou não dá para dizer | não | sem promessa de forma | P | null | outro ato |
| `m09-inst-10` · Régua do ciclo comercial — o que pode dar errado em cada etapa | sim | promessa sem desenho | P | null | outro ato |
| `m09-inst-11` · Localizador de dado de mercado | não | sem promessa de forma | P | null | outro ato |
| `m10-inst-01` · Mapa da fatura — três lentes sobre a mesma estrutura | sim | promessa sem desenho | M | null | outro ato |
| `m10-inst-02` · Comparador de modalidades — diferença estrutural por linha | sim | promessa sem desenho | M | null | sim |
| `m10-inst-03` · Dimensionador de demanda — faixas de diagnóstico | sim | promessa sem desenho | P | null | sim |
| `m10-inst-04` · Simulador de ultrapassagem — todos os parâmetros editáveis | sim | promessa sem desenho — e a promessa é a mais l | M | null | sim |
| `m10-inst-05` · Deslocador de carga entre postos — volume, nunca dinheiro | não | sem promessa de forma | P | null | sim |
| `m10-inst-06` · Apurador de excedente reativo — limites e janelas editáveis | não | sem promessa de forma | P | null | sim |
| `m10-inst-07` · Anatomia dos encargos — quem financia, quem paga, o que mudou | sim | promessa sem desenho | M | null | outro ato |
| `m10-inst-08` · Régua do ciclo tarifário — do processo à linha da fatura | sim | promessa sem desenho | P | null | outro ato |
| `m10-inst-09` · Reconstrutor de fatura — estime antes de ver | sim | promessa sem desenho | M | revisão pedida | sim |
| `m10-inst-10` · Ordem de leitura cronometrada — o instrumento assinatura | sim | promessa sem desenho | P | null | outro ato |
| `m10-inst-11` · Roteador de diagnóstico — três classes de veredito | não | sem promessa de forma | P | null | outro ato |
| `m11-inst-01` · Mapa da proposta — quatro lentes sobre a mesma estrutura | sim | promessa sem desenho | M | null | outro ato |
| `m11-inst-02` · Separador de eixos — a que categoria pertence cada afirmação | sim | promessa sem desenho | M | null | sim |
| `m11-inst-03` · Régua do marco regulatório — sete marcos com data, efeito e es | sim | promessa sem desenho | M | null | outro ato |
| `m11-inst-04` · Classificador de porte e modalidade — produto cartesiano compl | sim | promessa sem desenho | M | null | sim |
| `m11-inst-05` · Roteador de regime — data de protocolo determina tudo | sim | promessa sem desenho | M | null | sim |
| `m11-inst-06` · Verificador de geração estimada — desvio contra referência ind | sim | promessa sem desenho | M | revisão pedida | sim |
| `m11-inst-07` · Verificador de degradação declarada — planilha contra garantia | sim | promessa sem desenho | M | revisão pedida | sim |
| `m11-inst-08` · Verificador de trajetória tarifária — premissa contra ancorage | sim | promessa sem desenho | M | revisão pedida | sim |
| `m11-inst-09` · Anatomia dos oito sinais de alerta — sinal, fonte, conta, perg | não | sem promessa de forma | P | null | outro ato |
| `m11-inst-10` · Roteador de veredito — três classes, todas alcançáveis | não | sem promessa de forma | P | null | outro ato |
| `m11-inst-11` · Ordem de avaliação em trinta minutos — duas trilhas sincroniza | sim | cumprido em parte — a fonte tem barras de temp | M | null | outro ato |
| `m12-inst-01` · Tabuleiro geopolítico — três vetores sobre cinco frentes | sim | promessa sem desenho | M | null | outro ato |
| `m12-inst-02` · Separador de grandeza — quanto a eletricidade explica da energ | sim | cumprido na fonte | P | revisão pedida | sim |
| `m12-inst-03` · Verificador de fonte de número — de onde vem, o que mede, o qu | não | sem promessa de forma | P | null | outro ato |
| `m12-inst-04` · Régua diplomático-regulatória — o que existe, em que estado, c | sim | promessa sem desenho | M | null | outro ato |
| `m12-inst-05` · Comparador de parceiros bilaterais — quatro parceiros, três ve | sim | promessa sem desenho | M | null | outro ato |
| `m12-inst-06` · Roteador de instrumento comercial — a base jurídica decide o c | não | sem promessa de forma | P | null | sim |
| `m12-inst-07` · Diagnóstico de prontidão de dado de carbono para exportação | não | sem promessa de forma | P | null | sim |
| `m12-inst-08` · Régua de maturidade de projeto anunciado | sim | promessa sem desenho | M | null | sim |
| `m12-inst-09` · Razão reserva-produção — a assimetria medida, não afirmada | sim | cumprido na fonte, com um defeito de escala qu | M | null | sim |
| `m12-inst-10` · Classificador de nome — em que categoria cai, e o que fazer co | não | sem promessa de forma | P | null | sim |
| `m12-inst-11` · Andaime de conversa — trinta minutos, oito movimentos, sem rep | sim | promessa sem desenho | P | null | outro ato |
| `m13-inst-01` · Painel de controle setorial | sim | promessa sem desenho | M | null | outro ato |
| `m13-inst-02` · Calculadora de múltiplo com alavancagem | sim | promessa sem desenho | P | null | sim |
| `m13-inst-03` · Simulador de DCF de concessão com prazo definido | sim | cumprido na fonte | M | null | sim |
| `m13-inst-04` · Roteiro cronometrado de leitura | sim | promessa sem desenho | P | null | outro ato |
| `m13-inst-05` · Verificador de lacuna | não | sem promessa de forma | P | null | sim |
| `m13-inst-06` · Classificador de arquétipo de controle | não | sem promessa de forma | P | null | sim |
| `m13-inst-07` · Comparador de participação e voto | sim | cumprido na fonte | P | null | sim |
| `m13-inst-08` · Régua de estrutura de capital e cobertura | sim | promessa sem desenho | M | null | sim |
| `m13-inst-09` · Matriz de risco em duas lentes | sim | promessa sem desenho | M | null | outro ato |
| `m13-inst-10` · Comparador empresa × indicador | sim | cumprido na fonte | P | null | outro ato |
| `m13-inst-11` · Andaime de tese de investimento · instrumento assinatura | sim | promessa sem desenho | P | null | outro ato |
| `m14-inst-01` · Mapa de rotas — insumo, conversão, produto, mercado, órgão | sim | cumprido na fonte | M | null | outro ato |
| `m14-inst-02` · Calculadora de paridade por custo/km | sim | promessa sem desenho | M | null | sim |
| `m14-inst-03` · Régua de mix açúcar-etanol | sim | cumprido na fonte | P | null | sim |
| `m14-inst-04` · Comparador de rotas de etanol — três rotas, sete dimensões | sim | cumprido em parte — a fonte compara as três ro | M | null | outro ato |
| `m14-inst-05` · Calculadora de demanda derivada por conteúdo obrigatório | sim | promessa sem desenho | M | null | sim |
| `m14-inst-06` · Simulador de cogeração sazonal — as três grandezas lado a lado | sim | cumprido na fonte | P | null | sim |
| `m14-inst-07` · Régua de biometano — escala mínima e rota de entrega | sim | promessa sem desenho | M | null | outro ato |
| `m14-inst-08` · Régua de crédito de descarbonização | sim | promessa sem desenho | M | null | outro ato |
| `m14-inst-09` · Classificador de insumo — rota, produto, órgão e concorrente | sim | promessa sem desenho | M | null | sim |
| `m14-inst-10` · Verificador de base temporal e rota — instrumento assinatura | não | sem promessa de forma | P | null | sim |
| `m15-inst-01` · Mapa da cadeia · quatro reagrupamentos | sim | cumprido na fonte | M | null | outro ato |
| `m15-inst-02` · Comparador de regimes | sim | promessa sem desenho | M | null | outro ato |
| `m15-inst-03` · Régua de grandeza de subsolo | sim | cumprido na fonte | P | null | sim |
| `m15-inst-04` · Calculadora de parcela do Estado | sim | cumprido na fonte | P | null | sim |
| `m15-inst-05` · Decompositor de preço de combustível | sim | cumprido na fonte | P | null | sim |
| `m15-inst-06` · Régua de refino · capacidade contra produto | sim | promessa sem desenho | P | null | sim |
| `m15-inst-07` · Régua de contrato de gás | sim | cumprido na fonte | M | null | sim |
| `m15-inst-08` · Classificador de elo | não | sem promessa de forma | P | null | sim |
| `m15-inst-09` · Simulador de acoplamento gás → despacho | sim | cumprido na fonte | M | null | sim |
| `m15-inst-10` · Verificador de regime e de camada · instrumento assinatura | não | sem promessa de forma | P | null | sim |
| `m16-inst-01` · Mapa das seis tendências | sim | cumprido na fonte | M | null | outro ato |
| `m16-inst-02` · Régua de estágio de maturidade | sim | promessa sem desenho | M | null | sim |
| `m16-inst-03` · Comparador de gargalo | sim | cumprido em parte — a fonte compara os cinco c | M | null | sim |
| `m16-inst-04` · Conversor de frota em carga | não | sem promessa de forma | M | null | sim |
| `m16-inst-05` · Régua de armazenamento | sim | promessa sem desenho | M | null | sim |
| `m16-inst-06` · Rampa de medição avançada | sim | promessa sem desenho — o instrumento se chama  | M | null | sim |
| `m16-inst-07` · Verificador de estado da política de carbono | não | sem promessa de forma | P | null | sim |
| `m16-inst-08` · Calculadora de escopo 2 — os dois métodos lado a lado | sim | promessa sem desenho — e a fonte declara, no i | P | null | sim |
| `m16-inst-09` · Decompositor de demanda de centro de dados | não | sem promessa de forma | M | null | sim |
| `m16-inst-10` · Grade de mapeamento de posicionamento | sim | promessa sem desenho — o instrumento se chama  | M | null | outro ato |
| `m16-inst-11` · Verificador de estágio e de gargalo | não | sem promessa de forma | P | null | sim |
| `m17-inst-01` · Mapa das jurisdições · reagrupamento por dimensão | sim | promessa sem desenho | M | null | outro ato |
| `m17-inst-02` · Verificador de perímetro de preço | não | sem promessa de forma | P | null | sim |
| `m17-inst-03` · Decompositor de diferença | sim | cumprido na fonte | P | null | sim |
| `m17-inst-04` · Comparador de desenho de despacho | sim | promessa sem desenho | M | null | sim |
| `m17-inst-05` · Grade de remuneração de disponibilidade | sim | promessa sem desenho | M | null | sim |
| `m17-inst-06` · Conversor de preço de disponibilidade | não | sem promessa de forma | P | null | sim |
| `m17-inst-07` · Régua de estágio aplicada a política estrangeira | sim | promessa sem desenho, com a figura já especifi | P | null | sim |
| `m17-inst-08` · Verificador de pressuposto institucional | sim | promessa sem desenho | M | null | sim |
| `m17-inst-09` · Calculadora de ajuste de fronteira | sim | promessa sem desenho | M | null | sim |
| `m17-inst-10` · Decompositor de penetração renovável | sim | promessa sem desenho | P | null | sim |
| `m17-inst-11` · Normalizador de preço ao consumidor | sim | promessa sem desenho — o intro manda montar um | M | null | sim |
| `m17-inst-12` · Verificador de comparação · instrumento assinatura | não | sem promessa de forma | P | null | sim |
