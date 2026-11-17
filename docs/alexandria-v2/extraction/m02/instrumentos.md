# M02 · instrumentos

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo02.html` (3843 linhas). Saída: [`instrumentos.json`](instrumentos.json).
Camada: **fonte**. Todo texto entre aspas ou em tabela saiu do JSON, que saiu do HTML por script
(`extratores/`); nada foi digitado. `L` = linha aproximada no HTML-fonte. Divergências ficam com as duas
leituras e nenhuma é resolvida aqui (P17–P24 valem só na camada de produto).

Método: Markup por regex escopada em div.instrument (balanceada); script lido por bloco de comentário INSTRUMENT NN e executado sem reescrita em DOM simulado; código lido com typescript.transpileModule (bloco m02 das calculadoras isolado). O cenário-padrão e os ramos alcançados vêm da **execução do script original sem reescrita**
em DOM simulado; a comparação com o código varre o espaço de entrada inteiro do markup
(689.556 combinações).

## Resumo

| Id fonte | Título literal | Aula · subseção | Kind (código) | Prefixo ids | Entradas | Saídas | Combinações | Ramos alcançados | Status no código |
|---|---|---|---|---|---|---|---|---|---|
| INST · 01 | Explorador · Camadas da rede | Aula 01 · 1.5 Quem é dono, quem opera, quem cobra | explorador | i01 | 1 | 7 | 4 | 0 | não portado |
| INST · 02 | Simulador · Perdas na transmissão | Aula 02 · 2.5 Sinta a equação na mão | simulador | i02 | 4 | 5 | 82160 | 4 | divergente |
| INST · 03 | Cadeia de transformação · por perfil | Aula 03 · 3.4 O caminho da energia até cada perfil de cliente | cadeia-de-transformacao | i03 | 1 | 1 | 3 | 0 | divergente |
| INST · 04 | Simulador · Curva líquida e a rampa do fim da tarde | Aula 04 · 4.3 Monte o dia você mesmo | simulador | i08 (≠) | 3 | 4 | 3588 | 3 | divergente |
| INST · 05 | Simulador · Despacho por ordem de mérito | Aula 05 · 5.4 Opere a pilha você mesmo | simulador | i04 (≠) | 4 | 5 | 385434 | 6 | divergente |
| INST · 06 | Calculadora · Bateria: potência × energia | Aula 07 · 7.3 A rede moderna: a demanda vira recurso | calculadora | i09 (≠) | 2 | 3 | 1794 | 3 | divergente |
| INST · 07 | Simulador · Excursão de frequência | Aula 08 · 8.5 Simule a perda de uma grande usina | simulador | i05 (≠) | 3 | 4 | 3348 | 4 | divergente |
| INST · 08 | Calculadora · Perda embutida na conta | Aula 09 · 9.4 Quanto da sua fatura é perda? | calculadora | i06 (≠) | 3 | 3 | 204600 | 1 | portado |
| INST · 09 | Simulador · Dois submercados, um fio | Aula 10 · 10.6 Dois submercados, um fio — opere o paradoxo | simulador | i07 (≠) | 3 | 5 | 8625 | 4 | divergente |

Instrumentos de módulo: nenhum. O M02 não tem instrumento fora de aula (sem § Lab, sem LAB·NN). Todos os 9 estão dentro de aulas; a Aula 06 é a única sem instrumento.

Menções textuais fora do cabeçalho:
- INST · 03 em § Caso (L2510): "…ula 03: Rede Básica, subtransmissão, SE da distribuidora, rede de 13,8 kV. Pelo INST·03, isso significa algo como 5–6% d…"
- INST · 04 em script (texto de veredito) (L3620): "…barriga solar do meio-dia e descarrega das 17h às 21h — exatamente a janela do INST·04. É a logística temporal que a cu…"

Pergunta própria: null nos 9. Fonte dos números: null nos 9. Tolerâncias: null nos 9 (nenhuma declarada).

## INST · 01 · Explorador · Camadas da rede

- **Id:** `m02-inst-01` · comentário HTML "INSTRUMENT 01: Layer explorer" · bloco de script "INSTRUMENT 01: Layer explorer" (L3137–3168) · origem L1527
- **Onde é invocado:** Aula 01, subseção 1.5 "Quem é dono, quem opera, quem cobra" (L1523)
  - antes: "Use o instrumento abaixo como mapa mental permanente. Para cada camada: dono típico, operador, regulador, forma de remuneração e onde a camada aparece na fatura de um cliente industrial." (L1524)
  - logo depois: —
- **Pergunta:** null. Candidatas literais: § MAP "Por que a energia atravessa quatro camadas — e quem é dono de cada uma?"; subseção "Quem é dono, quem opera, quem cobra".
- **Nota do instrumento:** null
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i01-pills | — | — | pilulas | ger |  | ger=Geração*; tra=Transmissão; dis=Distribuição; con=Consumo | L1533 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i01-volt | Tensões típicas | celula | 13,8 – 18 kV no terminal; elevação na SE da usina |
| i01-dono | Dono típico | celula | Agentes de geração — estatais, privados, autoprodutores |
| i01-oper | Quem opera | celula | O próprio agente, sob comando de despacho do ONS |
| i01-reg | Regulador | celula | ANEEL (outorga e fiscalização) |
| i01-rem | Como é remunerado | celula | Venda de energia: contratos ACR/ACL, liquidação na CCEE |
| i01-fat | Onde aparece na fatura | celula | No preço da energia (TE no cativo; contrato no livre) |
| i01-note | — | nota_dinamica | A geração é o elo competitivo da cadeia: o preço se forma em leilão ou negociação — não em tarifa. É o território do Módulo 03 (tecnologias) e do Bloco 5 (mercado livre). |

Cenário-padrão (entradas): `{"i01-pills":"ger"}`

**Leitura das entradas (verbatim)**

```js
show(p.dataset.layer);  // L3163
```

**Cálculo (verbatim)**

```js
// sem cálculo numérico: consulta a tabela do script
```

**Formatação das saídas (verbatim)**

```js
$id("i01-volt").textContent = d.volt;  // L3151
$id("i01-dono").textContent = d.dono;  // L3152
$id("i01-oper").textContent = d.oper;  // L3153
$id("i01-reg").textContent = d.reg;  // L3154
$id("i01-rem").textContent = d.rem;  // L3155
$id("i01-fat").textContent = d.fat;  // L3156
$id("i01-note").textContent = d.note;  // L3157
```

**Ramos alcançados na varredura** (0; NaN/Infinity: 0)

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|

**Dados por opção (tabela do script, renderizada)**

| Opção | Tensões típicas | Dono típico | Quem opera | Regulador | Como é remunerado | Onde aparece na fatura | i01-note |
|---|---|---|---|---|---|---|---|
| ger (Geração) | 13,8 – 18 kV no terminal; elevação na SE da usina | Agentes de geração — estatais, privados, autoprodutores | O próprio agente, sob comando de despacho do ONS | ANEEL (outorga e fiscalização) | Venda de energia: contratos ACR/ACL, liquidação na CCEE | No preço da energia (TE no cativo; contrato no livre) | A geração é o elo competitivo da cadeia: o preço se forma em leilão ou negociação — não em tarifa. É o território do Módulo 03 (tecnologias) e do Bloco 5 (mercado livre). |
| tra (Transmissão) | 230 – 765 kV em AC; ±600 / ±800 kV em DC | Transmissoras concessionárias (Eletrobras, ISA, Taesa, State Grid…) | ONS — operação centralizada da Rede Básica | ANEEL (leilões, RAP, fiscalização) | RAP por disponibilidade, definida em leilão de menor receita | Dentro do fio: TUST repassada via TUSD (Fio A) | Monopólio natural com receita por disponibilidade: a linha ganha por existir e estar disponível, não por MWh transportado. Por isso transmissão virou o ativo de infraestrutura mais disputado do setor. |
| dis (Distribuição) | 69 – 138 kV (AT) · 13,8 – 34,5 kV (MT) · 127 – 440 V (BT) | Distribuidoras concessionárias, com área de concessão exclusiva | A própria distribuidora, do seu centro de operação | ANEEL — REN 1.000/2021, PRODIST | TUSD (Fio B + repasses), homologada em revisão tarifária | TUSD: demanda (R$/kW) e energia (R$/MWh) no Grupo A | Monopólio regulado por território: você não escolhe a distribuidora — escolhe, no máximo, quem vende a energia que passa pelo fio dela. |
| con (Consumo) | Grupo A (2,3 a 230 kV) · Grupo B (baixa tensão) | Unidades consumidoras — a fábrica, o comércio, a casa | O consumidor, da fronteira para dentro | ANEEL (direitos e deveres — REN 1.000/2021) | — | É quem paga a soma: energia + fio + encargos + tributos | Do ponto de conexão para dentro, ativos, perdas e riscos são do consumidor — por isso a subestação particular é item de auditoria do PQA. |

**Código atual — não portado** O código só devolve a chave da pílula; os 7 textos por camada (a substância do explorador) não existem em src/.

| Parte | Status |
|---|---|
| metadados | divergente |
| calculo | não se aplica (consulta a tabela textual) |
| textos_de_leitura | não se aplica |
| saidas_textuais_curtas | não se aplica |
| dados_textuais_por_opcao | não portado |
| nota_dinamica | não portado |
| visual | não se aplica |

Cálculo: 0 combinações comparadas, 0 divergentes. Problemas: metadados (campos/saídas) diferentes; dados textuais por opção (tabela do script) não portados.

## INST · 02 · Simulador · Perdas na transmissão

- **Id:** `m02-inst-02` · comentário HTML "INSTRUMENT 02: Transmission loss simulator" · bloco de script "INSTRUMENT 02: Transmission losses" (L3169–3209) · origem L1638
- **Onde é invocado:** Aula 02, subseção 2.5 "Sinta a equação na mão" (L1634)
  - antes: "O simulador abaixo é o coração da aula. Transmita um bloco de potência por uma distância, escolha o nível de tensão e o número de circuitos em paralelo, e observe o que acontece com as perdas. Depois tente transmitir 1.000 MW por 800 km em 138 kV — e entenda, no corpo, por que essa linha não existe." (L1635)
  - logo depois: "O insight final da aula: cada nível de tensão existe porque, para algum par potência × distância, ele é o ponto ótimo entre capital e perdas. A escada de tensões do sistema é a equação I²R resolvida em concreto, alumínio e aço — espalhada por um continente." (L1686)
- **Pergunta:** null. Candidatas literais: § MAP "Por que 500 kV? E por que nenhuma linha transporta energia infinita?"; subseção "Sinta a equação na mão".
- **Nota do instrumento:** "Modelo didático simplificado: linha trifásica, cos φ = 0,95, resistências típicas por nível de tensão (condutores em feixe), carregamento constante. Não usar para dimensionamento real. *Energia anual estimada com fator de utilização de 55% e valorada a R$ 250/MWh ilustrativos — a ordem de grandeza é o que importa." (L1682)
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i02-p | Potência transmitida | MW | numero+deslizador | 1000 | 100–4000 / 50 |  | L1645 |
| i02-d | Distância | km | numero+deslizador | 800 | 50–2600 / 50 |  | L1650 |
| i02-v | Tensão da linha | kV | selecao | 500 |  | 138=138 kV; 230=230 kV; 345=345 kV; 500=500 kV*; 765=765 kV | L1655 |
| i02-n | Circuitos em paralelo | — | selecao | 2 |  | 1=1 circuito; 2=2 circuitos*; 3=3 circuitos; 4=4 circuitos | L1665 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i02-i | Corrente total | readout | 1.215 A |
| i02-loss | Perdas | readout | 39,0 MW |
| i02-pct | Perda relativa | readout | 3,9 % |
| i02-yr | Energia perdida / ano* | readout | R$ 47,0 mi |
| i02-verdict | — | veredito | Dentro da faixa de engenharia. 3,9% de perdas para 1.000 MW em 800 km — este é o tipo de compromisso capital × perdas que desenhou os troncos reais do SIN. |

Cenário-padrão (entradas): `{"i02-p":1000,"i02-d":800,"i02-v":"500","i02-n":"2"}`

**Leitura das entradas (verbatim)**

```js
var P = parseFloat(p.value) || 0;  // L3178
var D = parseFloat(d.value) || 0;  // L3179
var V = parseFloat(v.value);  // L3180
var N = parseInt(n.value, 10);  // L3181
```

**Cálculo (verbatim)**

```js
var I = P * 1e6 / (Math.sqrt(3) * V * 1000 * 0.95);  // L3182
var R = rk[V] * D;  // L3183
var loss = 3 * R * I * I / N / 1e6;  // L3184
var pct = P > 0 ? loss / P * 100 : 0;  // L3185
var lossShown = Math.min(loss, P);  // L3186
var yr = lossShown * 8760 * 0.55 * 250;  // L3190
```

**Formatação das saídas (verbatim)**

```js
iOut.textContent = fb(I, 0) + " A";  // L3187
lossOut.textContent = fb(lossShown, 1) + " MW";  // L3188
pctOut.textContent = (pct > 100 ? "> 100" : fb(pct, 1)) + " %";  // L3189
yrOut.textContent = "R$ " + fb(yr / 1e6, 1) + " mi";  // L3191
```

**Ramos de leitura (verbatim; 1 grupo(s))**

| Grupo | Tipo | Condição | Atribuições (verbatim) | Linha |
|---|---|---|---|---|
| 1 | if | pct > 30 | verd.className = "verdict danger"; verd.innerHTML = "<b>Inviável.</b> Nessa configuração as perdas consomem " + (pct > 100 ? "mais de 100" : fb(pct, 0)) + "% do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor."; | 3192 |
| 1 | else if | pct > 8 | verd.className = "verdict warn"; verd.innerHTML = "<b>Caro.</b> Perdas de " + fb(pct, 1) + "% estão acima do razoável para um tronco. Em projeto real, subir a tensão ou adicionar um circuito tende a se pagar só com a energia que deixa de virar calor."; | 3195 |
| 1 | else | — | verd.className = "verdict"; verd.innerHTML = "<b>Dentro da faixa de engenharia.</b> " + fb(pct, 1) + "% de perdas para " + fb(P, 0) + " MW em " + fb(D, 0) + " km — este é o tipo de compromisso capital × perdas que desenhou os troncos reais do SIN."; | 3198 |

**Ramos alcançados na varredura** (4; NaN/Infinity: 0)

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|
| 26092 | {"i02-p":100,"i02-d":50,"i02-v":"138","i02-n":"1"} | Dentro da faixa de engenharia. 4,7% de perdas para 100 MW em 50 km — este é o tipo de compromisso capital × perdas que desenhou os troncos reais do SIN. |
| 14523 | {"i02-p":100,"i02-d":100,"i02-v":"138","i02-n":"1"} | Caro. Perdas de 9,3% estão acima do razoável para um tronco. Em projeto real, subir a tensão ou adicionar um circuito tende a se pagar só com a energia que deixa de virar calor. |
| 13080 | {"i02-p":100,"i02-d":350,"i02-v":"138","i02-n":"1"} | Inviável. Nessa configuração as perdas consomem 33% do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor. |
| 28465 | {"i02-p":100,"i02-d":1100,"i02-v":"138","i02-n":"1"} | Inviável. Nessa configuração as perdas consomem mais de 100% do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor. |

**Código atual — divergente** 

| Parte | Status |
|---|---|
| metadados | portado |
| calculo | portado |
| textos_de_leitura | divergente |
| saidas_textuais_curtas | não se aplica |
| dados_textuais_por_opcao | não se aplica |
| nota_dinamica | não se aplica |
| visual | não se aplica |

Cálculo: 82160 combinações comparadas, 0 divergentes. Problemas: textos de leitura não são verbatim (abreviados/parafraseados, sem interpolação numérica).

Vereditos lado a lado (um exemplo por forma de texto):

| Fonte (renderizado) | Código | Igual |
|---|---|---|
| Dentro da faixa de engenharia. 4,7% de perdas para 100 MW em 50 km — este é o tipo de compromisso capital × perdas que desenhou os troncos reais do SIN. | Dentro da faixa de engenharia. Este é o tipo de compromisso capital × perdas que desenhou os troncos reais do SIN. | não |
| Caro. Perdas de 9,3% estão acima do razoável para um tronco. Em projeto real, subir a tensão ou adicionar um circuito tende a se pagar só com a energia que deixa de virar calor. | Caro. Perdas acima do razoável para um tronco. Em projeto real, subir a tensão ou adicionar um circuito tende a se pagar só com a energia que deixa de virar calor. | não |
| Inviável. Nessa configuração as perdas consomem 33% do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor. | Inviável. Nessa configuração as perdas consomem a maior parte do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor. | não |
| Inviável. Nessa configuração as perdas consomem mais de 100% do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor. | Inviável. Nessa configuração as perdas consomem a maior parte do bloco — é por isso que essa linha não existe no mundo real. Suba o nível de tensão ou adicione circuitos e veja o quadrado da corrente trabalhar a seu favor. | não |

## INST · 03 · Cadeia de transformação · por perfil

- **Id:** `m02-inst-03` · comentário HTML "INSTRUMENT 03: Chain explorer" · bloco de script "INSTRUMENT 03: Transformation chain by consumer profile" (L3210–3256) · origem L1736
- **Onde é invocado:** Aula 03, subseção 3.4 "O caminho da energia até cada perfil de cliente" (L1732)
  - antes: "O instrumento abaixo monta a cadeia completa de transformações para três perfis de consumidor — e acumula as perdas técnicas típicas de cada trecho. A conclusão econômica aparece sozinha: quem se conecta mais cedo na cadeia usa menos rede, carrega menos perda embutida e por isso paga estrutura de fio mais barata por MWh. É a Aula 06 do Módulo 01 vista agora do lado do sistema." (L1733)
  - logo depois: —
- **Pergunta:** null. Candidatas literais: § MAP "O que acontece nas articulações da rede — e como uma proteção mal coordenada vira apagão?"; subseção "O caminho da energia até cada perfil de cliente".
- **Nota do instrumento:** "Percentuais ilustrativos de ordem de grandeza por trecho (transformação + condução). Os valores regulatórios reais por distribuidora são definidos pela ANEEL nos processos tarifários — sempre consultar o valor vigente antes de uso externo." (L1752)
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i03-pills | — | — | pilulas | a2 |  | a2=Eletrointensiva · A2 (138 kV)*; a4=Indústria média · A4 (13,8 kV); bt=Residencial · B (220 V) | L1742 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i03-total | Perda técnica acumulada típica até a entrega | output | ~3,1% |

Visuais gerados: cadeia (html gerado) #i03-chain (não portáveis, §12).

Cenário-padrão (entradas): `{"i03-pills":"a2"}`

**Leitura das entradas (verbatim)**

```js
render(p.dataset.prof);  // L3251
```

**Cálculo (verbatim)**

```js
total += s.l;  // L3240
```

**Formatação das saídas (verbatim)**

```js
chainEl.innerHTML = html;  // L3243
totalEl.innerHTML = "~" + total.toFixed(1).replace(".", ",") + "<span class='unit'>%</span>";  // L3244
```

**Ramos alcançados na varredura** (0; NaN/Infinity: 0)

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|

**Dados por opção (tabela do script, renderizada)**

| Opção | Perda técnica acumulada típica até a entrega | Trechos (tensão · trecho · perda) |
|---|---|---|
| a2 (Eletrointensiva · A2 (138 kV)) | ~3,1% | 13,8 → 500 kV · SE elevadora da usina · ~0,5% típ. → 500 kV · Tronco de transmissão · Rede Básica · ~1,8% típ. → 500 → 138 kV · SE abaixadora regional · ~0,4% típ. → 138 kV · Linha dedicada até a planta · ~0,4% típ. |
| a4 (Indústria média · A4 (13,8 kV)) | ~5,6% | 13,8 → 500 kV · SE elevadora da usina · ~0,5% típ. → 500 kV · Tronco de transmissão · Rede Básica · ~1,8% típ. → 500 → 138 kV · SE abaixadora regional · ~0,4% típ. → 138 kV · Rede de subtransmissão · ~0,8% típ. → 138 → 13,8 kV · SE da distribuidora · ~0,5% típ. → 13,8 kV · Rede de média tensão até a planta · ~1,6% típ. |
| bt (Residencial · B (220 V)) | ~10,0% | 13,8 → 500 kV · SE elevadora da usina · ~0,5% típ. → 500 kV · Tronco de transmissão · Rede Básica · ~1,8% típ. → 500 → 138 kV · SE abaixadora regional · ~0,4% típ. → 138 kV · Rede de subtransmissão · ~0,8% típ. → 138 → 13,8 kV · SE da distribuidora · ~0,5% típ. → 13,8 kV · Rede de média tensão · ~1,6% típ. → 13,8 kV → 220 V · Transformador de poste · ~1,5% típ. → 220 V · Rede de baixa tensão até o medidor · ~2,9% típ. |

**Código atual — divergente** 

| Parte | Status |
|---|---|
| metadados | divergente |
| calculo | portado |
| textos_de_leitura | não se aplica |
| saidas_textuais_curtas | não se aplica |
| dados_textuais_por_opcao | não portado |
| nota_dinamica | não se aplica |
| visual | não portado (limitação §12) |

Cálculo: 3 combinações comparadas, 0 divergentes. Problemas: metadados (campos/saídas) diferentes; dados textuais por opção (tabela do script) não portados; visual não portado (cadeia (html gerado)) — limitação §12.

## INST · 04 · Simulador · Curva líquida e a rampa do fim da tarde

- **Id:** `m02-inst-04` · comentário HTML "INSTRUMENT 08: Net load curve (display 04)" · bloco de script "INSTRUMENT 08: Net load curve & evening ramp" (L3525–3593) · origem L1795
- **Onde é invocado:** Aula 04, subseção 4.3 "Monte o dia você mesmo" (L1791)
  - antes: "No simulador abaixo, controle quanta solar existe no sistema e como está o céu. Observe a curva total (ciano) e a curva líquida (dourado) se separarem ao meio-dia e se reencontrarem violentamente às 18h. O número que importa está no painel: a rampa máxima, em GW por hora." (L1792)
  - logo depois: —
- **Pergunta:** null. Candidatas literais: § MAP "Como a demanda respira ao longo do dia — e por que o pôr do sol virou a hora mais tensa do operador?"; subseção "Monte o dia você mesmo".
- **Nota do instrumento:** "Curvas didáticas com formato típico do SIN (pico no início da noite). A operação real considera eólica, intercâmbios, sazonalidade e dias atípicos. O objetivo é um único insight: quanto mais solar, mais funda a barriga do meio-dia e mais íngreme a rampa do pôr do sol." (L1830)
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i08-pico | Pico de carga do dia | GW | numero+deslizador | 95 | 80–105 / 1 |  | L1802 |
| i08-solar | Solar instalada (UFV + MMGD) | GW | numero+deslizador | 30 | 0–45 / 1 |  | L1807 |
| i08-ceu | Condição do céu | — | selecao | 1 |  | 1=Céu limpo*; 0.6=Parcialmente nublado; 0.25=Encoberto | L1812 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i08-min | Carga líquida mínima | readout | 56 GW às 12h |
| i08-rampa | Rampa máxima | readout | +11,4 GW/h (16→17h) |
| i08-solpico | Solar no pico do dia | readout | 30 GW |
| i08-verdict | — | veredito | Rampa crítica: +11,4 GW em uma hora. É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. A hora mais tensa do dia, todos os dias. |

Visuais gerados: svg #i08-svg (não portáveis, §12).

Cenário-padrão (entradas): `{"i08-pico":95,"i08-solar":30,"i08-ceu":"1"}`

**Leitura das entradas (verbatim)**

```js
var pico = parseFloat(picoEl.value) || 95;  // L3535
var S = parseFloat(solarEl.value) || 0;  // L3536
var cond = parseFloat(ceuEl.value);  // L3537
```

**Cálculo (verbatim)**

```js
var L = pico * f[h];  // L3540
var s = (h >= 6 && h <= 18) ? S * cond * Math.pow(Math.max(0, Math.sin(Math.PI * (h - 6) / 12)), 1.5) : 0;  // L3541
var minNet = Infinity, minH = 0, rampa = -Infinity, rH = 0;  // L3544
var solPico = S * cond;  // L3547
msg = "<b>Rampa crítica: +" + fb(rampa,1) + " GW em uma hora.</b> É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. A hora mais tensa do dia, todos os dias.";  // L3554
msg = "<b>Carga líquida mínima muito baixa (" + fb(minNet,0) + " GW às " + minH + "h).</b> Com inflexibilidades e renovável compulsória, sobra geração no meio do dia: CMO no piso, risco de excesso e de corte de renovável — a barriga solar que antecipa a discussão de curtailment da Aula 10.";  // L3557
msg = "<b>Rampa exigente: +" + fb(rampa,1) + " GW/h no pôr do sol.</b> Dentro da capacidade do parque flexível, mas é exatamente esta janela que valoriza bateria, resposta da demanda e a hidro com reservatório — os recursos da Aula 07.";  // L3560
msg = "<b>Dia tranquilo: rampa máxima de +" + fb(rampa,1) + " GW/h.</b> Com pouca solar, a curva líquida quase coincide com a total e a transição do fim da tarde é suave. Suba a solar instalada e veja a barriga do meio-dia se formar — e a rampa ficar íngreme.";  // L3563
var ymax = pico + 5, ymin = Math.max(0, minNet - 10);  // L3567
```

**Formatação das saídas (verbatim)**

```js
minOut.textContent = fb(minNet, 0) + " GW às " + minH + "h";  // L3548
rampaOut.textContent = "+" + fb(rampa, 1) + " GW/h (" + rH + "→" + (rH+1) + "h)";  // L3549
solOut.textContent = fb(solPico, 0) + " GW";  // L3550
svgEl.innerHTML = svg;  // L3586
```

**Ramos de leitura (verbatim; 1 grupo(s))**

| Grupo | Tipo | Condição | Atribuições (verbatim) | Linha |
|---|---|---|---|---|
| 1 | if | rampa > 10 | cls = "verdict danger"; msg = "<b>Rampa crítica: +" + fb(rampa,1) + " GW em uma hora.</b> É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. A hora mais tensa do dia, todos os dias."; | 3552 |
| 1 | else if | minNet < 35 | cls = "verdict warn"; msg = "<b>Carga líquida mínima muito baixa (" + fb(minNet,0) + " GW às " + minH + "h).</b> Com inflexibilidades e renovável compulsória, sobra geração no meio do dia: CMO no piso, risco de excesso e de corte de renovável — a barriga solar que antecipa a discussão de curtailment da Aula 10."; | 3555 |
| 1 | else if | rampa > 6 | cls = "verdict warn"; msg = "<b>Rampa exigente: +" + fb(rampa,1) + " GW/h no pôr do sol.</b> Dentro da capacidade do parque flexível, mas é exatamente esta janela que valoriza bateria, resposta da demanda e a hidro com reservatório — os recursos da Aula 07."; | 3558 |
| 1 | else | — | cls = "verdict"; msg = "<b>Dia tranquilo: rampa máxima de +" + fb(rampa,1) + " GW/h.</b> Com pouca solar, a curva líquida quase coincide com a total e a transição do fim da tarde é suave. Suba a solar instalada e veja a barriga do meio-dia se formar — e a rampa ficar íngreme."; | 3561 |

**Ramos alcançados na varredura** (3; NaN/Infinity: 0) · **não alcançados:** else if (minNet < 35) L3555

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|
| 1063 | {"i08-pico":80,"i08-solar":0,"i08-ceu":"1"} | Dia tranquilo: rampa máxima de +4,8 GW/h. Com pouca solar, a curva líquida quase coincide com a total e a transição do fim da tarde é suave. Suba a solar instalada e veja a barriga do meio-dia se formar — e a rampa ficar íngreme. |
| 1839 | {"i08-pico":80,"i08-solar":10,"i08-ceu":"1"} | Rampa exigente: +6,2 GW/h no pôr do sol. Dentro da capacidade do parque flexível, mas é exatamente esta janela que valoriza bateria, resposta da demanda e a hidro com reservatório — os recursos da Aula 07. |
| 686 | {"i08-pico":80,"i08-solar":28,"i08-ceu":"1"} | Rampa crítica: +10,2 GW em uma hora. É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. A hora mais tensa do dia, todos os dias. |

**Código atual — divergente** 

| Parte | Status |
|---|---|
| metadados | portado |
| calculo | portado |
| textos_de_leitura | divergente |
| saidas_textuais_curtas | não se aplica |
| dados_textuais_por_opcao | não se aplica |
| nota_dinamica | não se aplica |
| visual | não portado (limitação §12) |

Cálculo: 3588 combinações comparadas, 0 divergentes. Problemas: textos de leitura não são verbatim (abreviados/parafraseados, sem interpolação numérica); visual não portado (svg) — limitação §12.

Vereditos lado a lado (um exemplo por forma de texto):

| Fonte (renderizado) | Código | Igual |
|---|---|---|
| Dia tranquilo: rampa máxima de +4,8 GW/h. Com pouca solar, a curva líquida quase coincide com a total e a transição do fim da tarde é suave. Suba a solar instalada e veja a barriga do meio-dia se formar — e a rampa ficar íngreme. | Dia tranquilo. Com pouca solar, a curva líquida quase coincide com a total e a transição do fim da tarde é suave. | não |
| Rampa exigente: +6,2 GW/h no pôr do sol. Dentro da capacidade do parque flexível, mas é exatamente esta janela que valoriza bateria, resposta da demanda e a hidro com reservatório — os recursos da Aula 07. | Rampa exigente no pôr do sol. Dentro da capacidade do parque flexível, mas é esta janela que valoriza bateria, resposta da demanda e a hidro com reservatório. | não |
| Rampa crítica: +10,2 GW em uma hora. É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. A hora mais tensa do dia, todos os dias. | Rampa crítica. É substituir uma Itaipu de geração em sessenta minutos — hidro flexível, térmicas, baterias e intercâmbios subindo juntos, com o operador contando reserva. | não |

## INST · 05 · Simulador · Despacho por ordem de mérito

- **Id:** `m02-inst-05` · comentário HTML "INSTRUMENT 04: Merit order dispatch (display 05)" · bloco de script "INSTRUMENT 04: Merit-order dispatch" (L3257–3354) · origem L1897
- **Onde é invocado:** Aula 05, subseção 5.4 "Opere a pilha você mesmo" (L1893)
  - antes: "O simulador abaixo é uma maquete didática do SIN. Mova a demanda, o vento do Nordeste, o sol do meio-dia e — o mais importante — o estado dos reservatórios, que reposiciona a hidroeletricidade na pilha via valor da água. Procure três regimes: reservatórios cheios com renovável forte (CMO no chão, risco de corte de geração), hidro na margem (o estado normal do Brasil), e estiagem com noite sem vento (térmica cara na margem, custo disparado). Cada regime é um capítulo da história recente do setor." (L1894)
  - logo depois: —
- **Pergunta:** null. Candidatas literais: § MAP "Quem decide qual usina liga agora — e por que a mais barata nem sempre é a escolhida?"; subseção "Opere a pilha você mesmo".
- **Nota do instrumento:** "Maquete pedagógica com capacidades e custos ilustrativos (CVUs fictícios em R$/MWh; valor da água como função simplificada do armazenamento). O despacho real do ONS considera restrições elétricas, intercâmbios, inflexibilidades e reserva — nada aqui é o modelo oficial. O objetivo é fixar a lógica: estado dos reservatórios comanda a posição da hidro na pilha, e a usina marginal comanda o custo do sistema." (L1935)
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i04-dem | Demanda do SIN | GW | numero+deslizador | 82 | 60–105 / 1 |  | L1904 |
| i04-vento | Vento no NE | % do parque | numero+deslizador | 55 | 0–100 / 5 |  | L1909 |
| i04-sol | Geração solar | % do parque | numero+deslizador | 40 | 0–100 / 5 |  | L1914 |
| i04-res | Reservatórios | % EAR | numero+deslizador | 60 | 10–100 / 5 |  | L1919 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i04-cmo | CMO (proxy didático) | readout | R$ 278 |
| i04-marg | Usina marginal | readout | Hidro reservatório |
| i04-term | Térmica despachada | readout | 9,0 GW |
| i04-cut | Corte de renovável | readout | 0,0 GW |
| i04-verdict | — | veredito | Hidro na margem — CMO = valor da água (R$ 278). O estado normal do Brasil: o preço não é o custo de queimar combustível hoje, é o custo de não ter água amanhã. Mexa nos reservatórios e veja o preço inteiro se deslocar. |

Visuais gerados: pilha de despacho (html gerado) #i04-stack (não portáveis, §12).

Cenário-padrão (entradas): `{"i04-dem":82,"i04-vento":55,"i04-sol":40,"i04-res":60}`

**Leitura das entradas (verbatim)**

```js
var D = parseFloat(demEl.value) || 0;  // L3283
var v = parseFloat(ventoEl.value) || 0;  // L3284
var s = parseFloat(solEl.value) || 0;  // L3285
var r = parseFloat(resEl.value) || 0;  // L3286
```

**Cálculo (verbatim)**

```js
var va = Math.max(PISO, Math.min(650, Math.round(650 - 6.2 * r)));  // L3267
var excess = mustCap - D;  // L3294
var cs = Math.min(excess, byId["sol"].cap); disp["sol"] -= cs; excess -= cs;  // L3296
var ce = Math.min(excess, byId["eol"].cap); disp["eol"] -= ce; excess -= ce;  // L3297
var ch = Math.min(excess, byId["hfio"].cap); disp["hfio"] -= ch; excess -= ch;  // L3298
cut = cs + ce + ch;  // L3299
var dd = Math.min(p.cap, rem);  // L3304
rem -= dd;  // L3307
deficit = rem > 1e-6 ? rem : 0;  // L3309
cmo = marg ? Math.max(PISO, marg.cost) : PISO;  // L3310
var pf = p.cap > 0 ? dGW / p.cap * 100 : 0;  // L3316
var term = (disp["gn1"] || 0) + (disp["car"] || 0) + (disp["gn2"] || 0) + (disp["ole"] || 0) + (disp["gnl"] || 0);  // L3325
```

**Formatação das saídas (verbatim)**

```js
stackEl.innerHTML = html;  // L3322
cmoOut.textContent = "R$ " + cmo;  // L3323
margOut.textContent = deficit > 0 ? "Pilha esgotada" : (marg ? marg.name : "— · piso (excedente renovável)");  // L3324
termOut.textContent = g(term) + " GW";  // L3326
cutOut.textContent = g(cut) + " GW";  // L3327
```

**Ramos de leitura (verbatim; 1 grupo(s))**

| Grupo | Tipo | Condição | Atribuições (verbatim) | Linha |
|---|---|---|---|---|
| 1 | if | deficit > 0 | verd.className = "verdict danger"; verd.innerHTML = "<b>Déficit de " + g(deficit) + " GW — a pilha esgotou.</b> No mundo real isso é corte de carga: ERAC, racionamento, manchete. Note o caminho até aqui: cada GW extra de demanda subiu degraus cada vez mais caros antes de faltar."; | 3328 |
| 1 | else if | cut > 0 | verd.className = "verdict warn"; verd.innerHTML = "<b>Excedente renovável: " + g(cut) + " GW cortados.</b> Geração compulsória maior que a demanda — CMO no piso e curtailment. É a fotografia do Nordeste em madrugada ventosa de baixa carga, e a ponte direta para a Aula 09."; | 3331 |
| 1 | else if | marg && marg.id === "hres" | verd.className = "verdict"; verd.innerHTML = "<b>Hidro na margem — CMO = valor da água (R$ " + marg.cost + ").</b> O estado normal do Brasil: o preço não é o custo de queimar combustível hoje, é o custo de não ter água amanhã. Mexa nos reservatórios e veja o preço inteiro se deslocar."; | 3334 |
| 1 | else if | marg && (marg.id === "gn1" \|\| marg.id === "car" \|\| marg.id === "gn2") | verd.className = "verdict warn"; verd.innerHTML = "<b>Térmica na margem (R$ " + marg.cost + ").</b> Estiagem e/ou noite sem vento e sol: cada GW adicional sobe um degrau da pilha. É o regime em que bandeira tarifária e PLD sobem juntos."; | 3337 |
| 1 | else if | marg && (marg.id === "ole" \|\| marg.id === "gnl") | verd.className = "verdict danger"; verd.innerHTML = "<b>Topo da pilha (R$ " + marg.cost + ").</b> Óleo e GNL na margem — padrão de crise hídrica, como 2021. O sistema atende, mas a que preço: é aqui que teto de PLD e encargos viram assunto de jornal."; | 3340 |
| 1 | else | — | verd.className = "verdict"; verd.innerHTML = "<b>Renovável e nuclear cobrem a carga.</b> CMO no piso — condição de demanda muito baixa com oferta compulsória abundante."; | 3343 |

**Ramos alcançados na varredura** (6; NaN/Infinity: 0)

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|
| 246697 | {"i04-dem":60,"i04-vento":0,"i04-sol":0,"i04-res":10} | Hidro na margem — CMO = valor da água (R$ 588). O estado normal do Brasil: o preço não é o custo de queimar combustível hoje, é o custo de não ter água amanhã. Mexa nos reservatórios e veja o preço inteiro se deslocar. |
| 82231 | {"i04-dem":60,"i04-vento":0,"i04-sol":0,"i04-res":75} | Térmica na margem (R$ 190). Estiagem e/ou noite sem vento e sol: cada GW adicional sobe um degrau da pilha. É o regime em que bandeira tarifária e PLD sobem juntos. |
| 76 | {"i04-dem":60,"i04-vento":95,"i04-sol":100,"i04-res":10} | Excedente renovável: 0,9 GW cortados. Geração compulsória maior que a demanda — CMO no piso e curtailment. É a fotografia do Nordeste em madrugada ventosa de baixa carga, e a ponte direta para a Aula 09. |
| 19 | {"i04-dem":62,"i04-vento":100,"i04-sol":100,"i04-res":10} | Renovável e nuclear cobrem a carga. CMO no piso — condição de demanda muito baixa com oferta compulsória abundante. |
| 33098 | {"i04-dem":78,"i04-vento":0,"i04-sol":0,"i04-res":10} | Topo da pilha (R$ 950). Óleo e GNL na margem — padrão de crise hídrica, como 2021. O sistema atende, mas a que preço: é aqui que teto de PLD e encargos viram assunto de jornal. |
| 23313 | {"i04-dem":86,"i04-vento":0,"i04-sol":0,"i04-res":10} | Déficit de 1,0 GW — a pilha esgotou. No mundo real isso é corte de carga: ERAC, racionamento, manchete. Note o caminho até aqui: cada GW extra de demanda subiu degraus cada vez mais caros antes de faltar. |

**Código atual — divergente** 

| Parte | Status |
|---|---|
| metadados | portado |
| calculo | portado |
| textos_de_leitura | divergente |
| saidas_textuais_curtas | não portado |
| dados_textuais_por_opcao | não se aplica |
| nota_dinamica | não se aplica |
| visual | não portado (limitação §12) |

Cálculo: 385434 combinações comparadas, 0 divergentes. Problemas: textos de leitura não são verbatim (abreviados/parafraseados, sem interpolação numérica); visual não portado (pilha de despacho (html gerado)) — limitação §12.

Vereditos lado a lado (um exemplo por forma de texto):

| Fonte (renderizado) | Código | Igual |
|---|---|---|
| Hidro na margem — CMO = valor da água (R$ 588). O estado normal do Brasil: o preço não é o custo de queimar combustível hoje, é o custo de não ter água amanhã. Mexa nos reservatórios e veja o preço inteiro se deslocar. | Hidro na margem — CMO = valor da água. O estado normal do Brasil: o preço não é o custo de queimar combustível hoje, é o custo de não ter água amanhã. | não |
| Térmica na margem (R$ 190). Estiagem e/ou noite sem vento e sol: cada GW adicional sobe um degrau da pilha. É o regime em que bandeira tarifária e PLD sobem juntos. | Térmica na margem. Estiagem e/ou noite sem vento e sol: cada GW adicional sobe um degrau da pilha. É o regime em que bandeira tarifária e PLD sobem juntos. | não |
| Excedente renovável: 0,9 GW cortados. Geração compulsória maior que a demanda — CMO no piso e curtailment. É a fotografia do Nordeste em madrugada ventosa de baixa carga, e a ponte direta para a Aula 09. | Excedente renovável cortado. Geração compulsória maior que a demanda — CMO no piso e curtailment. É a fotografia do Nordeste em madrugada ventosa de baixa carga. | não |
| Renovável e nuclear cobrem a carga. CMO no piso — condição de demanda muito baixa com oferta compulsória abundante. | Renovável e nuclear cobrem a carga. CMO no piso. | não |
| Topo da pilha (R$ 950). Óleo e GNL na margem — padrão de crise hídrica, como 2021. O sistema atende, mas a que preço: é aqui que teto de PLD e encargos viram assunto de jornal. | Topo da pilha — óleo e GNL na margem, padrão de crise hídrica como 2021. O sistema atende, mas a que preço. | não |
| Déficit de 1,0 GW — a pilha esgotou. No mundo real isso é corte de carga: ERAC, racionamento, manchete. Note o caminho até aqui: cada GW extra de demanda subiu degraus cada vez mais caros antes de faltar. | Déficit — a pilha esgotou. No mundo real isso é corte de carga: ERAC, racionamento, manchete. | não |

## INST · 06 · Calculadora · Bateria: potência × energia

- **Id:** `m02-inst-06` · comentário HTML "INSTRUMENT 09: Battery MW x MWh (display 06)" · bloco de script "INSTRUMENT 09: Battery MW x MWh" (L3594–3627) · origem L2099
- **Onde é invocado:** Aula 07, subseção 7.3 "A rede moderna: a demanda vira recurso" (L2089)
  - antes: "A rede tradicional era uma via de mão única: grandes usinas → transmissão → distribuição → consumidor passivo. A rede moderna é bidirecional: telhados geram (MMGD), baterias carregam e descarregam, indústrias deslocam consumo. Três recursos novos importam para este módulo:" (L2090)
  - antes: "Baterias — não geram energia: armazenam energia gerada antes. Têm duas dimensões independentes, e confundi-las é erro de iniciante: MW (potência — a vazão máxima) e MWh (energia — o tanque). Uma bateria de 10 MW / 40 MWh entrega potência máxima por cerca de 4 horas. A combinação define a vocação: tanques curtos servem regulação rápida de frequência; tanques longos vencem a rampa do fim da tarde." (L2092)
  - antes: "Resposta da demanda — consumidores ajustando consumo para ajudar o sistema ou reduzir custo: deslocar produção para fora do pico, reduzir carga não essencial na rampa, mudar horário de bombeamento. A demanda deixa de ser passiva e vira recurso operacional — e, em desenhos de mercado maduros, vira receita." (L2094)
  - antes: "Microrredes — sistemas locais (solar + bateria + geração de apoio + controle) capazes de operar conectados ou ilhados da rede principal. Aplicações naturais: hospitais, mineração, comunidades isoladas, data centers, indústrias com carga crítica. Não é só instalar equipamento: exige engenharia de controle, proteção e operação." (L2096)
  - logo depois: —
- **Pergunta:** null. Candidatas literais: § MAP "Por que o sistema paga usinas para ficarem prontas — e o que mantém os bastidores funcionando?"; subseção "A rede moderna: a demanda vira recurso".
- **Nota do instrumento:** "Duração = MWh ÷ MW, desconsiderando perdas, profundidade de descarga e degradação. É a versão sistêmica do kW × kWh do Módulo 01 — a mesma distinção, três ordens de grandeza acima." (L2122)
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i09-mw | Potência | MW | numero+deslizador | 20 | 5–50 / 1 |  | L2106 |
| i09-mwh | Energia armazenada | MWh | numero+deslizador | 80 | 10–200 / 5 |  | L2111 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i09-h | Duração na potência máxima | readout | 4,0 h |
| i09-voc | Vocação típica | readout | Rampa do fim da tarde · deslocamento de energia |
| i09-verdict | — | veredito | 4,0 horas de fôlego: perfil de rampa. Carrega na barriga solar do meio-dia e descarrega das 17h às 21h — exatamente a janela do INST·04. É a logística temporal que a curva líquida pede; geração, que é bom, continua vindo de quem converte fonte primária. |

Cenário-padrão (entradas): `{"i09-mw":20,"i09-mwh":80}`

**Leitura das entradas (verbatim)**

```js
var P = parseFloat(mwEl.value) || 1;  // L3603
var E = parseFloat(mwhEl.value) || 0;  // L3604
```

**Cálculo (verbatim)**

```js
var h = E / P;  // L3605
```

**Formatação das saídas (verbatim)**

```js
hOut.textContent = fb(h, 1) + " h";  // L3606
vocOut.textContent = voc;  // L3611
```

**Ramos de leitura (verbatim; 2 grupo(s))**

| Grupo | Tipo | Condição | Atribuições (verbatim) | Linha |
|---|---|---|---|---|
| 1 | if | h < 1 | voc = "Regulação rápida · serviços ancilares"; | 3608 |
| 1 | else if | h <= 3 | voc = "Corte de pico · arbitragem curta"; | 3609 |
| 1 | else | — | voc = "Rampa do fim da tarde · deslocamento de energia"; | 3610 |

| Grupo | Tipo | Condição | Atribuições (verbatim) | Linha |
|---|---|---|---|---|
| 2 | if | h < 1 | verd.className = "verdict warn"; verd.innerHTML = "<b>Tanque curto (" + fb(h,1) + " h): potência sem fôlego.</b> Vocação para resposta rápida — frequência, suavização — não para atravessar o pico. E o princípio de sempre: <b>bateria não gera, desloca</b> — ela só vale o spread entre a energia que a carrega e a que ela substitui."; | 3612 |
| 2 | else if | h <= 3 | verd.className = "verdict"; verd.innerHTML = "<b>" + fb(h,1) + " horas na potência máxima.</b> O formato clássico para cortar pico de demanda e arbitrar as horas caras. Lembre: bateria não gera — desloca energia do horário em que sobra para o horário em que falta."; | 3615 |
| 2 | else | — | verd.className = "verdict"; verd.innerHTML = "<b>" + fb(h,1) + " horas de fôlego: perfil de rampa.</b> Carrega na barriga solar do meio-dia e descarrega das 17h às 21h — exatamente a janela do INST·04. É a logística temporal que a curva líquida pede; geração, que é bom, continua vindo de quem converte fonte primária."; | 3618 |

**Ramos alcançados na varredura** (3; NaN/Infinity: 0)

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|
| 515 | {"i09-mw":5,"i09-mwh":10} | 2,0 horas na potência máxima. O formato clássico para cortar pico de demanda e arbitrar as horas caras. Lembre: bateria não gera — desloca energia do horário em que sobra para o horário em que falta. |
| 1099 | {"i09-mw":5,"i09-mwh":20} | 4,0 horas de fôlego: perfil de rampa. Carrega na barriga solar do meio-dia e descarrega das 17h às 21h — exatamente a janela do INST·04. É a logística temporal que a curva líquida pede; geração, que é bom, continua vindo de quem converte fonte primária. |
| 180 | {"i09-mw":11,"i09-mwh":10} | Tanque curto (0,9 h): potência sem fôlego. Vocação para resposta rápida — frequência, suavização — não para atravessar o pico. E o princípio de sempre: bateria não gera, desloca — ela só vale o spread entre a energia que a carrega e a que ela substitui. |

**Código atual — divergente** 

| Parte | Status |
|---|---|
| metadados | portado |
| calculo | portado |
| textos_de_leitura | divergente |
| saidas_textuais_curtas | portado (concatenado no veredito) |
| dados_textuais_por_opcao | não se aplica |
| nota_dinamica | não se aplica |
| visual | não se aplica |

Cálculo: 1794 combinações comparadas, 0 divergentes. Problemas: textos de leitura não são verbatim (abreviados/parafraseados, sem interpolação numérica).

Vereditos lado a lado (um exemplo por forma de texto):

| Fonte (renderizado) | Código | Igual |
|---|---|---|
| 2,0 horas na potência máxima. O formato clássico para cortar pico de demanda e arbitrar as horas caras. Lembre: bateria não gera — desloca energia do horário em que sobra para o horário em que falta. | Corte de pico · arbitragem curta — O formato clássico para cortar pico de demanda e arbitrar as horas caras. Bateria não gera — desloca energia do horário em que sobra para o horário em que falta. | não |
| 4,0 horas de fôlego: perfil de rampa. Carrega na barriga solar do meio-dia e descarrega das 17h às 21h — exatamente a janela do INST·04. É a logística temporal que a curva líquida pede; geração, que é bom, continua vindo de quem converte fonte primária. | Rampa do fim da tarde · deslocamento de energia — Perfil de rampa: carrega na barriga solar do meio-dia e descarrega das 17h às 21h. É a logística temporal que a curva líquida pede. | não |
| Tanque curto (0,9 h): potência sem fôlego. Vocação para resposta rápida — frequência, suavização — não para atravessar o pico. E o princípio de sempre: bateria não gera, desloca — ela só vale o spread entre a energia que a carrega e a que ela substitui. | Regulação rápida · serviços ancilares — Tanque curto: potência sem fôlego. Vocação para resposta rápida, não para atravessar o pico. E o princípio de sempre: bateria não gera, desloca. | não |

## INST · 07 · Simulador · Excursão de frequência

- **Id:** `m02-inst-07` · comentário HTML "INSTRUMENT 05: Frequency excursion (display 07)" · bloco de script "INSTRUMENT 05: Frequency excursion (SVG)" (L3355–3421) · origem L2200
- **Onde é invocado:** Aula 08, subseção 8.5 "Simule a perda de uma grande usina" (L2196)
  - antes: "Escolha o tamanho da perda, a carga do momento e a inércia do mix. Compare o mesmo evento em um sistema pesado (hidro-dominado clássico) e em um sistema leve (alta penetração de inversores). A diferença entre as duas curvas é a conversa de engenharia mais importante da década no setor." (L2197)
  - logo depois: —
- **Pergunta:** null. Candidatas literais: § MAP "O que acontece nos dez segundos após a perda de uma grande usina — e como uma falha local vira cascata?"; subseção "Simule a perda de uma grande usina".
- **Nota do instrumento:** "Modelo didático de resposta inercial + regulação primária (parâmetros ilustrativos; limiares de ERAC simplificados). Sistemas reais têm resposta distribuída, dinâmica de tensão e proteções múltiplas. O objetivo é um único insight: mesma perda, menos inércia, afundamento mais profundo." (L2235)
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i05-dp | Geração perdida | GW | numero+deslizador | 6 | 1–16 / 0.5 |  | L2207 |
| i05-carga | Carga do SIN | GW | numero+deslizador | 80 | 65–100 / 1 |  | L2212 |
| i05-h | Inércia do mix | — | selecao | 4.2 |  | 5.5=Alta · hidro-dominado clássico; 4.2=Média · mix atual*; 2.8=Baixa · alta penetração de inversores | L2217 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i05-rocof | RoCoF inicial | readout | −0,54 Hz/s |
| i05-nadir | Nadir de frequência | readout | 59,04 Hz |
| i05-status | Veredito | readout | Severo, contido |
| i05-verdict | — | veredito | Afundamento severo, contido. Inércia + regulação primária seguram o nadir acima do ERAC; a reserva foi consumida e o CAG recompõe nos minutos seguintes. Margem curta: o mesmo evento com menos inércia cruzaria a linha — troque o mix e confira. |

Visuais gerados: svg #i05-svg (não portáveis, §12).

Cenário-padrão (entradas): `{"i05-dp":6,"i05-carga":80,"i05-h":"4.2"}`

**Leitura das entradas (verbatim)**

```js
var DP = parseFloat(dpEl.value) || 0;  // L3364
var P = parseFloat(cargaEl.value) || 1;  // L3365
var H = parseFloat(hEl.value);  // L3366
```

**Cálculo (verbatim)**

```js
var rocof = (DP / P) * 60 / (2 * H);  // L3367
var dfn = (DP / P) * 60 * 1.8 / (2 * H);  // L3368
var nadir = 60 - dfn;  // L3369
var f = 60 - dfn * (t / 5) * Math.exp(1 - t / 5);  // L3398
```

**Formatação das saídas (verbatim)**

```js
rocofOut.textContent = "−" + fb(rocof, 2) + " Hz/s";  // L3370
nadirOut.textContent = fb(nadir, 2) + " Hz";  // L3371
statusOut.textContent = st;  // L3390
svgEl.innerHTML = svg;  // L3414
```

**Ramos de leitura (verbatim; 1 grupo(s))**

| Grupo | Tipo | Condição | Atribuições (verbatim) | Linha |
|---|---|---|---|---|
| 1 | if | nadir < 57.5 | st = "Colapso parcial"; verd.className = "verdict danger"; verd.innerHTML = "<b>Nadir abaixo de 57,5 Hz.</b> Múltiplos estágios de ERAC e risco de colapso parcial — milhões de consumidores desligados automaticamente para salvar o restante. Compare com a noite de Itaipu, 2009."; | 3373 |
| 1 | else if | nadir < 58.5 | st = "ERAC dispara"; verd.className = "verdict danger"; verd.innerHTML = "<b>ERAC dispara.</b> O afundamento cruza o primeiro estágio (~58,5 Hz): blocos de carga são cortados sem nenhum humano no circuito. O sistema sobrevive sacrificando consumo — é o desenho funcionando, não falhando."; | 3377 |
| 1 | else if | nadir < 59.5 | st = "Severo, contido"; verd.className = "verdict warn"; verd.innerHTML = "<b>Afundamento severo, contido.</b> Inércia + regulação primária seguram o nadir acima do ERAC; a reserva foi consumida e o CAG recompõe nos minutos seguintes. Margem curta: o mesmo evento com menos inércia cruzaria a linha — troque o mix e confira."; | 3381 |
| 1 | else | — | st = "Estabilizado"; verd.className = "verdict"; verd.innerHTML = "<b>Excursão absorvida.</b> A inércia limita o RoCoF, a regulação primária estanca a queda e o CAG devolve o sistema a 60,00 Hz. Rotina de operador — invisível para o consumidor."; | 3385 |

**Ramos alcançados na varredura** (4; NaN/Infinity: 0)

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|
| 525 | {"i05-dp":1,"i05-carga":65,"i05-h":"5.5"} | Excursão absorvida. A inércia limita o RoCoF, a regulação primária estanca a queda e o CAG devolve o sistema a 60,00 Hz. Rotina de operador — invisível para o consumidor. |
| 1378 | {"i05-dp":2,"i05-carga":65,"i05-h":"2.8"} | Afundamento severo, contido. Inércia + regulação primária seguram o nadir acima do ERAC; a reserva foi consumida e o CAG recompõe nos minutos seguintes. Margem curta: o mesmo evento com menos inércia cruzaria a linha — troque o mix e confira. |
| 975 | {"i05-dp":5.5,"i05-carga":65,"i05-h":"2.8"} | ERAC dispara. O afundamento cruza o primeiro estágio (~58,5 Hz): blocos de carga são cortados sem nenhum humano no circuito. O sistema sobrevive sacrificando consumo — é o desenho funcionando, não falhando. |
| 470 | {"i05-dp":8.5,"i05-carga":65,"i05-h":"2.8"} | Nadir abaixo de 57,5 Hz. Múltiplos estágios de ERAC e risco de colapso parcial — milhões de consumidores desligados automaticamente para salvar o restante. Compare com a noite de Itaipu, 2009. |

**Código atual — divergente** 

| Parte | Status |
|---|---|
| metadados | portado |
| calculo | portado |
| textos_de_leitura | divergente |
| saidas_textuais_curtas | portado (concatenado no veredito) |
| dados_textuais_por_opcao | não se aplica |
| nota_dinamica | não se aplica |
| visual | não portado (limitação §12) |

Cálculo: 3348 combinações comparadas, 0 divergentes. Problemas: textos de leitura não são verbatim (abreviados/parafraseados, sem interpolação numérica); visual não portado (svg) — limitação §12.

Vereditos lado a lado (um exemplo por forma de texto):

| Fonte (renderizado) | Código | Igual |
|---|---|---|
| Excursão absorvida. A inércia limita o RoCoF, a regulação primária estanca a queda e o CAG devolve o sistema a 60,00 Hz. Rotina de operador — invisível para o consumidor. | Estabilizado — Excursão absorvida. A inércia limita o RoCoF, a regulação primária estanca a queda e o CAG devolve o sistema a 60,00 Hz. Rotina de operador. | não |
| Afundamento severo, contido. Inércia + regulação primária seguram o nadir acima do ERAC; a reserva foi consumida e o CAG recompõe nos minutos seguintes. Margem curta: o mesmo evento com menos inércia cruzaria a linha — troque o mix e confira. | Severo, contido — Inércia + regulação primária seguram o nadir acima do ERAC; a reserva foi consumida e o CAG recompõe nos minutos seguintes. Margem curta. | não |
| ERAC dispara. O afundamento cruza o primeiro estágio (~58,5 Hz): blocos de carga são cortados sem nenhum humano no circuito. O sistema sobrevive sacrificando consumo — é o desenho funcionando, não falhando. | ERAC dispara — O afundamento cruza o primeiro estágio (~58,5 Hz): blocos de carga são cortados sem nenhum humano no circuito. O sistema sobrevive sacrificando consumo — é o desenho funcionando, não falhando. | não |
| Nadir abaixo de 57,5 Hz. Múltiplos estágios de ERAC e risco de colapso parcial — milhões de consumidores desligados automaticamente para salvar o restante. Compare com a noite de Itaipu, 2009. | Colapso parcial — Nadir abaixo de 57,5 Hz. Múltiplos estágios de ERAC e risco de colapso parcial — milhões de consumidores desligados automaticamente para salvar o restante. | não |

## INST · 08 · Calculadora · Perda embutida na conta

- **Id:** `m02-inst-08` · comentário HTML "INSTRUMENT 06: Loss cost calculator" · bloco de script "INSTRUMENT 06: Embedded loss cost" (L3422–3446) · origem L2309
- **Onde é invocado:** Aula 09, subseção 9.4 "Quanto da sua fatura é perda?" (L2306)

  - logo depois: —
- **Pergunta:** null. Candidatas literais: § MAP "Por que você paga pela energia que a rede perde antes de chegar em você?"; subseção "Quanto da sua fatura é perda?".
- **Nota do instrumento:** "Modelo didático: injetada = consumo ÷ (1 − perdas). O rateio tarifário real segue o nível regulatório reconhecido por distribuidora e as regras de contabilização da CCEE no ACL — este instrumento mostra a ordem de grandeza do custo que viaja escondido dentro do preço da energia." (L2337)
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i06-c | Consumo medido | MWh/mês | numero+deslizador | 500 | 50–5000 / 50 |  | L2316 |
| i06-p | Perdas do sistema a montante | % | numero+deslizador | 14 | 5–35 / 1 |  | L2321 |
| i06-t | Custo da energia | R$/MWh | numero+deslizador | 350 | 150–800 / 10 |  | L2326 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i06-inj | Energia injetada p/ te atender | readout | 581 MWh |
| i06-perd | Perdas atribuíveis | readout | 81,4 MWh |
| i06-rs | Custo de perdas / mês | readout | R$ 28,5 mil |

Cenário-padrão (entradas): `{"i06-c":500,"i06-p":14,"i06-t":350}`

**Leitura das entradas (verbatim)**

```js
var C = parseFloat(c.value) || 0;  // L3431
var P = (parseFloat(p.value) || 0) / 100;  // L3432
var T = parseFloat(t.value) || 0;  // L3433
```

**Cálculo (verbatim)**

```js
var P = (parseFloat(p.value) || 0) / 100;  // L3432
var inj = P < 1 ? C / (1 - P) : C;  // L3434
var perd = inj - C;  // L3435
var custo = perd * T;  // L3436
```

**Formatação das saídas (verbatim)**

```js
injOut.textContent = fb(inj, 0) + " MWh";  // L3437
perdOut.textContent = fb(perd, 1) + " MWh";  // L3438
rsOut.textContent = custo >= 1e6 ? "R$ " + fb(custo / 1e6, 2) + " mi" : "R$ " + fb(custo / 1000, 1) + " mil";  // L3439
```

**Ramos alcançados na varredura** (1; NaN/Infinity: 0)

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|
| 204600 | {"i06-c":50,"i06-p":5,"i06-t":150} | — |

**Código atual — portado** 

| Parte | Status |
|---|---|
| metadados | portado |
| calculo | portado |
| textos_de_leitura | não se aplica |
| saidas_textuais_curtas | não se aplica |
| dados_textuais_por_opcao | não se aplica |
| nota_dinamica | não se aplica |
| visual | não se aplica |

Cálculo: 204600 combinações comparadas, 0 divergentes. Problemas: nenhum.

## INST · 09 · Simulador · Dois submercados, um fio

- **Id:** `m02-inst-09` · comentário HTML "INSTRUMENT 07: Two submarkets (display 09)" · bloco de script "INSTRUMENT 07: Two submarkets, one wire" (L3447–3524) · origem L2410
- **Onde é invocado:** Aula 10, subseção 10.6 "Dois submercados, um fio — opere o paradoxo" (L2406)
  - antes: "O instrumento final do módulo destila tudo num modelo de dois nós: um Nordeste ventoso e um Sudeste pesado, ligados por um intercâmbio com limite. Encha o fio e veja os preços se separarem; encha mais e veja o vento ser cortado enquanto térmica cara liga do outro lado. É o Caso 1 de qualquer manual — energia barata presa — rodando na sua mão." (L2407)
  - logo depois: —
- **Pergunta:** null. Candidatas literais: § MAP "Como o limite de uma linha vira tarifa, encargo e corte de geração?"; subseção "Dois submercados, um fio — opere o paradoxo".
- **Nota do instrumento:** "Modelo de dois nós com pilhas de custo ilustrativas (NE: eólica + térmica local; SE: hidro + térmicas). O SIN real tem quatro submercados, dezenas de troncos e despacho horário — este brinquedo existe para fixar um único mecanismo: fio com folga = preço único; fio saturado = preços separados + corte." (L2440)
- **Fonte dos números:** null. **Tolerâncias:** null.

**Entradas**

| Id | Rótulo | Unidade | Tipo | Padrão | Faixa (min–max / passo) | Opções | Origem |
|---|---|---|---|---|---|---|---|
| i07-vento | Vento no NE | GW disponíveis | numero+deslizador | 18 | 4–26 / 1 |  | L2417 |
| i07-dse | Demanda no SE | GW | numero+deslizador | 50 | 38–62 / 1 |  | L2422 |
| i07-lim | Limite do intercâmbio | GW | numero+deslizador | 8 | 0–14 / 1 |  | L2427 |

**Saídas**

| Id | Rótulo | Tipo | Cenário-padrão renderizado |
|---|---|---|---|
| i07-ne | PLD proxy · NE | readout | R$ 360 |
| i07-se | PLD proxy · SE | readout | R$ 360 |
| i07-flow | Fluxo NE → SE | readout | 6,0 / 8,0 GW · com folga |
| i07-cut | Vento cortado | readout | 0,0 GW |
| i07-verdict | — | veredito | Intercâmbio com folga: preço único. A usina marginal de um lado precifica os dois — os submercados se comportam como um sistema só. É o regime em que o spread NE–SE do Brazil Pulse marca zero. |

Cenário-padrão (entradas): `{"i07-vento":18,"i07-dse":50,"i07-lim":8}`

**Leitura das entradas (verbatim)**

```js
var W = parseFloat(ventoEl.value) || 0;  // L3468
var DSE = parseFloat(dseEl.value) || 0;  // L3469
var L = parseFloat(limEl.value) || 0;  // L3470
```

**Cálculo (verbatim)**

```js
var d = Math.min(stack[i].cap, Math.max(0, rem));  // L3459
rem -= d;  // L3462
var rj = dispatchIsland(joint, DNE + DSE);  // L3478
var genNE = rj.disp[0] + rj.disp[3];  // L3479
var flow = genNE - DNE;  // L3480
pne = pse = Math.max(PISO, rj.marg.cost);  // L3484
cut = W - rj.disp[0];  // L3485
f = flow > 0 ? L : -L;  // L3488
var demNE = Math.max(0, DNE + f);  // L3489
cut = W - demNE;  // L3491
var tneed = demNE - W;  // L3495
pne = tneed <= 8 + 1e-9 ? 480 : 980;  // L3496
var rse = dispatchIsland([{ cap: 38, cost: 160 }, { cap: 14, cost: 360 }, { cap: 99, cost: 980 }], DSE - f);  // L3498
pse = Math.max(PISO, rse.marg.cost);  // L3499
```

**Formatação das saídas (verbatim)**

```js
neOut.textContent = "R$ " + pne;  // L3501
seOut.textContent = "R$ " + pse;  // L3502
flowOut.textContent = g(f) + " / " + g(L) + " GW · " + (sat ? "SATURADO" : "com folga");  // L3503
cutOut.textContent = g(cut) + " GW";  // L3504
```

**Ramos de leitura (verbatim; 1 grupo(s))**

| Grupo | Tipo | Condição | Atribuições (verbatim) | Linha |
|---|---|---|---|---|
| 1 | if | !sat | verd.className = "verdict"; verd.innerHTML = "<b>Intercâmbio com folga: preço único.</b> A usina marginal de um lado precifica os dois — os submercados se comportam como um sistema só. É o regime em que o spread NE–SE do Brazil Pulse marca zero."; | 3505 |
| 1 | else if | cut > 1e-9 | verd.className = "verdict danger"; verd.innerHTML = "<b>Fio cheio + vento sobrando: " + g(cut) + " GW cortados no NE</b> enquanto o SE despacha térmica a R$ " + pse + ". Os preços se separam (spread de R$ " + (pse - pne) + "), o gerador eólico perde receita e a disputa do constrained-off entra em cena. Este é o paradoxo que abre qualquer conversa de Summit."; | 3508 |
| 1 | else if | f > 0 | verd.className = "verdict warn"; verd.innerHTML = "<b>Intercâmbio saturado: submercados separados.</b> O NE exporta no limite físico; o SE completa com geração própria mais cara. O spread de PLD (R$ " + (pse - pne) + ") é o preço visível do congestionamento — a restrição física virando número que qualquer agente enxerga na tela."; | 3511 |
| 1 | else | — | verd.className = "verdict warn"; verd.innerHTML = "<b>Vento fraco: o NE importa até o limite.</b> Com o fio saturado no sentido contrário, é o NE que fica caro (térmica local a R$ " + pne + ") enquanto o SE segue mais barato. Congestionamento não tem lado fixo — tem a direção do dia."; | 3514 |

**Ramos alcançados na varredura** (4; NaN/Infinity: 0)

| Combinações | Exemplo de entrada | Texto renderizado (exemplo) |
|---|---|---|
| 500 | {"i07-vento":4,"i07-dse":38,"i07-lim":0} | Vento fraco: o NE importa até o limite. Com o fio saturado no sentido contrário, é o NE que fica caro (térmica local a R$ 480) enquanto o SE segue mais barato. Congestionamento não tem lado fixo — tem a direção do dia. |
| 5140 | {"i07-vento":4,"i07-dse":38,"i07-lim":8} | Intercâmbio com folga: preço único. A usina marginal de um lado precifica os dois — os submercados se comportam como um sistema só. É o regime em que o spread NE–SE do Brazil Pulse marca zero. |
| 360 | {"i07-vento":6,"i07-dse":54,"i07-lim":1} | Intercâmbio saturado: submercados separados. O NE exporta no limite físico; o SE completa com geração própria mais cara. O spread de PLD (R$ 500) é o preço visível do congestionamento — a restrição física virando número que qualquer agente enxerga na tela. |
| 2625 | {"i07-vento":13,"i07-dse":38,"i07-lim":0} | Fio cheio + vento sobrando: 1,0 GW cortados no NE enquanto o SE despacha térmica a R$ 160. Os preços se separam (spread de R$ 99), o gerador eólico perde receita e a disputa do constrained-off entra em cena. Este é o paradoxo que abre qualquer conversa de Summit. |

**Código atual — divergente** 

| Parte | Status |
|---|---|
| metadados | portado |
| calculo | portado |
| textos_de_leitura | divergente |
| saidas_textuais_curtas | não portado |
| dados_textuais_por_opcao | não se aplica |
| nota_dinamica | não se aplica |
| visual | não se aplica |

Cálculo: 8625 combinações comparadas, 0 divergentes. Problemas: textos de leitura não são verbatim (abreviados/parafraseados, sem interpolação numérica).

Vereditos lado a lado (um exemplo por forma de texto):

| Fonte (renderizado) | Código | Igual |
|---|---|---|
| Vento fraco: o NE importa até o limite. Com o fio saturado no sentido contrário, é o NE que fica caro (térmica local a R$ 480) enquanto o SE segue mais barato. Congestionamento não tem lado fixo — tem a direção do dia. | Vento fraco: o NE importa até o limite. Com o fio saturado no sentido contrário, é o NE que fica caro enquanto o SE segue mais barato. Congestionamento não tem lado fixo. | não |
| Intercâmbio com folga: preço único. A usina marginal de um lado precifica os dois — os submercados se comportam como um sistema só. É o regime em que o spread NE–SE do Brazil Pulse marca zero. | Intercâmbio com folga: preço único. A usina marginal de um lado precifica os dois — os submercados se comportam como um sistema só. | não |
| Intercâmbio saturado: submercados separados. O NE exporta no limite físico; o SE completa com geração própria mais cara. O spread de PLD (R$ 500) é o preço visível do congestionamento — a restrição física virando número que qualquer agente enxerga na tela. | Intercâmbio saturado: submercados separados. O NE exporta no limite físico; o SE completa com geração própria mais cara. O spread de PLD é o preço visível do congestionamento. | não |
| Fio cheio + vento sobrando: 1,0 GW cortados no NE enquanto o SE despacha térmica a R$ 160. Os preços se separam (spread de R$ 99), o gerador eólico perde receita e a disputa do constrained-off entra em cena. Este é o paradoxo que abre qualquer conversa de Summit. | Fio cheio + vento sobrando: corte no NE enquanto o SE despacha térmica. Os preços se separam, o gerador eólico perde receita e a disputa do constrained-off entra em cena. | não |

## Divergências (8)

| Id | Tipo | Sev. | Tema | Leitura A | Leitura B | Nota |
|---|---|---|---|---|---|---|
| div-i02-01 | fonte×fonte | baixa | Numeração INST · NN × prefixo dos ids internos | INST · 04 → i08-*; INST · 05 → i04-*; INST · 06 → i09-*; INST · 07 → i05-*; INST · 08 → i06-*; INST · 09 → i07-* (L1795; L1897; L2099; L2200; L2309; L2410) | INST · 01–03 usam i01–i03 (batem) (L1527) | Resíduo de reordenação (protocolo §10). Os ids internos são o que o script lê; o código já registra o mesmo quirk no cabeçalho. |
| div-i02-02 | fonte (script) | baixa | Ramo de leitura nunca exibido no espaço de entrada do markup | INST · 04: else if (minNet < 35) "Carga líquida mínima muito baixa (" L3555 (L3555) | Varredura exaustiva de todas as combinações do markup não alcança o ramo (uma condição anterior sempre vence). (—) | Registrado, não corrigido. O ramo continua literal em script.ramos_de_leitura_verbatim. |
| div-i02-03 | fonte (script) | baixa | Campo vazio vira valor não nulo (fallback "\|\| 1" / "\|\| 95") | INST · 04: var pico = parseFloat(picoEl.value) \|\| 95; \| INST · 06: var P = parseFloat(mwEl.value) \|\| 1; \| INST · 07: var P = parseFloat(cargaEl.value) \|\| 1; (L3535; L3603; L3365) | Os demais campos numéricos usam "\|\| 0". (—) | Protocolo §10: resíduo do original sinalizado, nunca corrigido em silêncio. Com o campo vazio, a potência (INST · 06) e a carga (INST · 07) valem 1 e o pico do dia (INST · 04) vale 95. |
| div-i02-04 | fonte×código | alta | Textos de leitura (vereditos) não são verbatim no código | INST · 02, INST · 04, INST · 05, INST · 06, INST · 07, INST · 09 (L3169; L3525; L3257; L3594; L3355; L3447) | alexandria-instrument-calculators.ts devolve vereditos abreviados/parafraseados, sem a interpolação numérica da fonte (exemplos lado a lado em instrumentos[].codigo.textos_de_leitura) (src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)) | O cálculo numérico bate em 100% das combinações; só a prosa diverge. Porte por transliteração mecânica (protocolo §10) resolveria na camada de código. |
| div-i02-05 | fonte×código | alta | Explorador e cadeia: tabela textual por opção não portada | INST · 01: 4 opções × 7 saídas textuais (inclui a nota dinâmica i01-note); INST · 03: 3 perfis com 4/6/8 trechos (L1527; L1736) | INST · 01: não portado; INST · 03, dados_textuais_por_opcao: não portado (src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)) | A substância do explorador (tensões, dono, operador, regulador, remuneração, lugar na fatura) não existe em src/. |
| div-i02-06 | fonte×código | média | Saídas textuais curtas ausentes do código | INST · 05: i04-marg (ex.: "Hidro reservatório"); INST · 09: i07-flow (ex.: "0,0 / 0,0 GW · SATURADO") (—; —) | Nem saída própria nem prefixo do veredito no código. (src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)) | INST · 06 (i09-voc) e INST · 07 (i05-status) ficam preservadas como prefixo do veredito do código; estas não. |
| div-i02-07 | código sem origem | baixa | Rótulos que a fonte não tem | A fonte não rotula div.verdict nem o grupo de pílulas. (—) | INST · 01 i01-pills: "Seleção"; INST · 02 i02-verdict: "Veredito"; INST · 03 i03-pills: "Seleção"; INST · 04 i08-verdict: "Veredito"; INST · 05 i04-verdict: "Veredito"; INST · 06 i09-verdict: "Veredito"; INST · 07 i05-verdict: "Veredito"; INST · 09 i07-verdict: "Veredito" (src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)) | No INST · 07 isso produz duas saídas "Veredito" (i05-status, rótulo literal da fonte, e i05-verdict). |
| div-i02-08 | fonte×código (limitação §12) | média | Visuais gerados pelo script não portados | INST · 03: cadeia (html gerado) #i03-chain; INST · 04: svg #i08-svg; INST · 05: pilha de despacho (html gerado) #i04-stack; INST · 07: svg #i05-svg (L1736; L1795; L1897; L2200) | O contrato de instrumento só carrega números e veredito. (—) | O conteúdo textual da cadeia (INST · 03) está em dados_por_opcao; a pilha do INST · 05 e as curvas SVG são desenho. |

## Lacunas (5)

| Id | Campo | Valor | Nota |
|---|---|---|---|
| lac-i02-01 | instrumentos[].pergunta | null | Nenhum dos 9 tem pergunta própria; candidatas literais em pergunta_candidatas (P19: pergunta de previsão é camada Alexandria). |
| lac-i02-02 | instrumentos[].fonte_dos_numeros | null | Nenhuma constante, cenário-padrão ou limiar tem fonte externa declarada; as notas dizem "didático", "ilustrativos", "maquete pedagógica" (P19/P20). |
| lac-i02-03 | instrumentos[].tolerancias | null | Nenhuma tolerância declarada. |
| lac-i02-04 | instrumentos_de_modulo | [] | Sem § Lab / LAB·NN; a Aula 06 não tem instrumento. |
| lac-i02-05 | fórmula por instrumento | null | Não há div.formula dentro de instrumento; a relação aparece só na nota (INST · 06, INST · 08) e no script. O código tem formula: null nos 9 (coerente). |


## Verificação

Verificador independente (scripts próprios, fora desta pasta), contra o HTML-fonte:

- **Literalidade.** ~2.000 strings varridas no corpus normalizado; 1.766 conferidas também na janela da própria origem
  (linha_aprox −6/+80). As únicas "falhas" são campos de metadado (ids, classes, seções, faixas derivadas), não conteúdo.
- **Quiz (100%).** O literal `const questions` foi avaliado à parte: 10/10 enunciados, 40/40 alternativas (ordem e
  `correta`), 10/10 explicações e o gabarito BBBCBBBBCB são idênticos; as origens estão a ±3.
- **Checklist (100%).** 18/18 itens idênticos em html e texto, com origens a ±3. Três viram badge (itens 1, 11 e 15),
  conferido em `alexandria-badges.ts`.
- **Instrumentos (100% das fórmulas).** 172 linhas de script (leitura de entradas, cálculo, formatação, condições e
  atribuições dos ramos) conferidas verbatim a ±3 linhas; os 9 `codigo_completo` batem com as linhas declaradas
  (a menos de espaços). O ramo `minNet < 35` do INST · 04 foi re-simulado: nas 3.588 combinações ele só ocorre com
  `rampa > 10` (44 casos), portanto é de fato inalcançável.
- **Origens.** Todo `trecho_inicial` com `linha_aprox` fica a ±3 linhas.
- **Contagens recontadas no HTML.** Todas conferem:
  - 20 seções e 10 aulas, com subseções 5,5,5,4,4,4,3,6,4,6.
  - 9 instrumentos: 24 entradas (22 `.field` + 2 grupos de pílulas), 37 saídas e 689.556 combinações, recalculadas
    a partir das faixas.
  - 65 termos, 10 `div.exercise` (8 com aula) e 18 itens de checklist.
  - 16 referências (13 + 3), 11 delas com `span.mono`.
  - 8 erros, 30 perguntas-relâmpago e 7 parágrafos no roteiro.
  - 18 painéis "três níveis", em 6 blocos.
  - 21 callouts: 4 de "Números vivos" e 7 de produto/marca.
  - 16 ocorrências de "GridAlpha"; 0 LAB; 0 `<img>`, `<video>` ou `<iframe>`.
- **Esclarecimento (sem mudar número).** `ramos_de_leitura_alcancados` (25) conta *chaves de texto mascaradas*
  distintas, e não ramos `if/else` do script. O script tem 27 ramos literais, e 26 são alcançados:
  - o INST · 02 dá 4 chaves para 3 ramos, porque o "> 100" muda o texto;
  - o INST · 06 dá 3 chaves para 6 ramos, porque vocação e veredito andam juntos;
  - o INST · 08 conta "(sem veredito)" como 1.

**Correções feitas por esta verificação:** nenhuma neste grupo. As duas correções estão em `modulo.json`.

### Segunda verificação adversarial (2026-09-17)

Outro verificador, com método próprio (scripts fora desta pasta, sem reaproveitar `m02_verificar.mjs`):

- **Literalidade.** Todo valor string dos três JSONs, fora os ramos de metadado, foi procurado no HTML-fonte
  (tags removidas, e também com o markup cru). Resultado: 0 falhas de conteúdo. As únicas "falhas" são ids,
  faixas derivadas do placar, `tom` dos callouts, dados do catálogo e textos *renderizados* pelos scripts. Estes
  últimos foram conferidos de outro jeito, rodando o `<script>` original num DOM mínimo próprio.
- **Quiz (100%).** O array `questions` foi avaliado direto da fonte e comparado campo a campo (10 enunciados,
  40 alternativas, `correta`, 10 explicações, gabarito BBBCBBBBCB, origens a ±3). Tudo idêntico.
- **Checklist (100%).** Os 18 `.checklist-text` foram comparados em html e texto, e as origens estão a ±3. As
  marcações P14 (16 oral/livre, 2 desenho, 2 limite de extensão, 1 cálculo) e os 3 badges (itens 1, 11 e 15
  em `alexandria-badges.ts`) conferem.
- **Fórmulas dos instrumentos (100%).** 185 trechos de script (leitura, cálculo, formatação, condições e
  atribuições de ramo) foram conferidos verbatim a ±3 linhas. Os 9 `codigo_completo` são idênticos às linhas
  declaradas, a menos da quebra final. O cenário-padrão dos 9 foi refeito rodando o script original: os
  valores batem, e o INST · 02 também foi conferido à mão (1.215 A; 39,0 MW; 3,9 %; R$ 47,0 mi).
- **Contagens.** Todas foram recontadas no HTML e batem:
  - seções, aulas e subseções por aula (também em `MODULO_02_CORPO`);
  - instrumentos, entradas, saídas e combinações (recalculadas a partir das faixas do markup);
  - termos (65 `details`, em ordem alfabética), exercícios (10, dos quais 8 com tag de aula) e checklist;
  - referências (16; 11 com `span.mono`; 0 URL, já que os 5 `http` do arquivo são fontes/SVG);
  - callouts (21 = 8 neutros + 9 gold + 4 red), painéis "três níveis" (18, e 0 no código), "GridAlpha" (16, nas
    linhas listadas), "Summit", "Bloco N" e `<img>`.
- **Divergências.** As 32 foram reconferidas, e nenhuma foi inventada.

**Correções feitas pela segunda verificação:** nenhuma neste grupo.
