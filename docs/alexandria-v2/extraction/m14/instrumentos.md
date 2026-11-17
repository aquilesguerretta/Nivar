# M14 · grupo "instrumentos"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo14.html` (4.352 linhas, LF). Saída: [`instrumentos.json`](instrumentos.json). Extrator: [`extratores/m14_instrumentos.mjs`](extratores/m14_instrumentos.mjs); este arquivo é gerado por [`extratores/m14_md.mjs`](extratores/m14_md.mjs).
Camada **fonte**: todo texto entre aspas ou em tabela saiu do JSON, e o JSON saiu do HTML por programa; nada foi
digitado nem parafraseado (as tags inline foram removidas na versão .md; o `html` fica no JSON). `L` é a linha
aproximada no HTML-fonte. As divergências ficam com todas as leituras, e nenhuma é resolvida aqui (P17–P24 valem só
na camada de produto).

**Método.** Markup lido da árvore de elementos (div.inst). Blocos de script separados pelos comentários /* === INST·NN — ... === */; constantes avaliadas a partir do literal; ramos pela cadeia if/else do veredito. Cenário-padrão, varreduras e exemplos por ramo obtidos EXECUTANDO o `<script>` original inteiro num DOM simulado (extratores/m14_dom.mjs) — nenhuma linha de lógica reescrita. Números formatados com toLocaleString pt-BR do Node (ICU completo).

**Estado no código.** 0 portados, 10 não portados e 0 divergentes. `alexandria-modulo-14-content.ts`: `MODULO_14_INSTRUMENTOS: Instrument[] = []` e `instruments: []` nas 8 aulas; nenhum id da fonte em `alexandria-instrument-calculators.ts`; `RecursosDoModulo.tsx` sem `modulo-14`; o catálogo canônico registra "14 | 10 | **0** | `MODULO_14_INSTRUMENTOS = []`". Como nada foi portado, não há comparação por execução; o porte futuro deve transliterar o `script.codigo_verbatim` de cada item (protocolo §10).

**Cobertura por token** (markup / strings do script): INST·01 100% (118/118) / 99,1% (654/660); INST·02 100% (177/177) / 98,9% (274/277); INST·03 100% (176/176) / 98,6% (350/355); INST·04 100% (127/127) / 98,3% (578/588); INST·05 100% (197/197) / 95,5% (490/513); INST·06 100% (184/184) / 94,2% (343/364); INST·07 100% (170/170) / 95,4% (415/435); INST·08 100% (190/190) / 97% (609/628); INST·09 99,2% (122/123) / 99,8% (1.864/1.868); INST·10 100% (115/115) / 99,7% (1.440/1.444). O resíduo do script são ids de elemento (`mp`, `dim`…), não texto.

## Os 10 instrumentos

| Id | Título (span.nm) | Onde | Invocação (ponto do texto) | Kind sugerido | Campos / seleções / saídas / ramos | Fonte dos números | Código | Catálogo |
|---|---|---|---|---|---|---|---|---|
| INST·01 | "Mapa de rotas — insumo, conversão, produto, mercado, órgão" | §MAP (L939), **fora de aula** | depois de paragrafo L935 ("O módulo cobre seis rotas. Duas delas usam o mesmo insumo — o bagaço alimenta a caldeira d"…); antes de titulo L968 | explorador | 0 / 1 / 0 / 0 | `null` | não portado | nome igual |
| INST·02 | "Calculadora de paridade por custo/km" | Aula 01, em §01.3 (L1164) | depois de formula L1156 ("Índice de paridade — triagem, não decisão Índice = Preço do hidratado ÷ Preço da gasolina"…); antes de paragrafo L1216; id citado fora da seção: L2637 (markup, §Erros item 02: "Ver INST·02.") | calculadora | 4 / 0 / 5 / 5 | `null` | não portado | nome igual |
| INST·03 | "Régua de mix açúcar-etanol" | Aula 02, em §02.3 (L1323) | depois de paragrafo L1316 ("A consequência é direta: um sinal de preço favorável ao etanol não move nenhum ATR se a pl"…); antes de callout L1376; invocado: "Concluir sobre uma arbitragem a partir de preço relativo isolado é o erro estrutural desta aula, e o instrumento abaixo recusa fazê-lo." (L1316) | simulador | 3 / 1 / 4 / 4 | `null` | não portado | nome igual |
| INST·04 | "Comparador de rotas de etanol — três rotas, sete dimensões" | Aula 03, em §03.2 (L1525) | depois de callout L1515 ("Projeto de rota nova — 2G, biometano, combustível de aviação — chega ao mercado em quatro"…); antes de fim da seção | comparador | 0 / 2 / 0 / 0 | `null` | não portado | nome igual |
| INST·05 | "Calculadora de demanda derivada por conteúdo obrigatório" | Aula 04, em §04.3 (L1638) | depois de paragrafo L1630 ("A aritmética é trivial e as consequências não são. A demanda teórica de B100 é o produto e"…); antes de titulo L1698 | calculadora | 3 / 2 / 4 / 5 | parcial | não portado | nome igual |
| INST·06 | "Simulador de cogeração sazonal — as três grandezas lado a lado" | Aula 05, em §05.2 (L1815) | depois de callout L1801 ("O Balanço Energético Nacional 2026 registra, para o mesmo ano de 2025, uma redução de 1,7%"…); antes de titulo L1868 | simulador | 4 / 0 / 5 / 5 | `null` | não portado | nome igual |
| INST·07 | "Régua de biometano — escala mínima e rota de entrega" | Aula 06, em §06.2 (L1973) | depois de tabela L1961 ("Rota de entrega Vantagem Limitação que decide"…); antes de titulo L2031 | simulador | 4 / 1 / 4 / 5 | `null` | não portado | nome igual |
| INST·08 | "Régua de crédito de descarbonização" | Aula 07, em §07.4 (L2254) | depois de callout L2242 ("Preço de crédito de descarbonização é a grandeza mais volátil deste módulo inteiro, e por"…); antes de callout L2316; invocado: "Ele existe apenas como entrada editável do instrumento abaixo, com fonte e data no próprio painel." (L2242); id citado fora da seção: L3207 (markup, §Ref (B3): valor padrão "carregado no INST·08") | simulador | 3 / 2 / 5 / 6 | parcial | não portado | nome igual |
| INST·09 | "Classificador de insumo — rota, produto, órgão e concorrente" | Aula 08, em §08.1 (L2422) | depois de titulo L2420 ("§08.1 O classificador: dado um insumo, o que sai e o que deixa de sair"…); antes de titulo L2454; invocado: "Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve." (L2344) | explorador | 0 / 1 / 0 / 0 | `null` | não portado | nome ≠ ("Classificador de insumo") |
| INST·10 | "Verificador de base temporal e rota — instrumento assinatura" | Aula 08, em §08.2 (L2462) | depois de paragrafo L2456 ("Este é o instrumento assinatura do módulo, e ele funciona como o Verificador de Lacuna do"…); antes de callout L2490; invocado: "Ele é exercício: preencha-o antes de olhar o instrumento seguinte, e depois confira contra o que o verificador devolve." (L2344); invocado: "Este é o instrumento assinatura do módulo, e ele funciona como o Verificador de Lacuna do Módulo 13." (L2456); id citado fora da seção: L646 (comentário CSS no `<style>`, não visível); id citado fora da seção: L828 (markup, §00.3: apresenta o INST·10 como instrumento assinatura) | explorador | 0 / 1 / 0 / 0 | parcial | não portado | nome ≠ ("Verificador de base temporal e rota (instrumento assinatura)") |

O kind é anotação desta extração pela taxonomia (`docs/alexandria/instrument-taxonomy.md`), não texto da fonte. Nenhum instrumento tem pergunta própria (`pergunta: null`) e nenhum declara tolerância (`tolerancias: null`).

## INST·01 — "Mapa de rotas — insumo, conversão, produto, mercado, órgão"

- **Onde:** §MAP, fora de aula (Recursos do Módulo). Cabeçalho em L939. Script L3308–L3409, comentário "MAPA DE ROTAS".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L945):** "Escolha primeiro a dimensão de ordenação. A grade de rotas é reconstruída conforme a dimensão — o mesmo conjunto de seis rotas se organiza de forma diferente conforme a pergunta que você está fazendo. Depois escolha uma rota para ver a cadeia completa e o produto concorrente pelo mesmo insumo."
- **Aviso (p.disc):** "A ordenação não muda os fatos da rota — muda apenas qual delas fica ao lado de qual. Se duas rotas que você lia como equivalentes aparecem em grupos distintos quando a dimensão muda, é sinal de que a equivalência estava na sua cabeça e não no objeto."
- **Mecânica (kind sugerido `explorador`):** Anotação desta extração (taxonomia): seleção de dimensão reordena 6 chips; seleção de rota revela texto (fluxo de 5 camadas + 3 cartões). Zero campo numérico. Mesmo prefixo "Mapa" do M05/M06 (taxonomia): aqui é consulta discreta, como o M06.
- **Menções na seção (leitura desta extração):** nenhuma; o texto da aula não chama o instrumento fora do próprio bloco.
- **Catálogo:** "Mapa de rotas — insumo, conversão, produto, mercado, órgão" — "Seis rotas reorganizadas conforme a dimensão de ordenação escolhida; cada rota abre a cadeia completa e o produto concorrente pelo mesmo insumo." (nome igual ao span.nm: true).

**Seleção `mp-dim`** "Ordenar as rotas por:" (L951): "Insumo de origem" [`insumo`] (ativo no markup), "Produto final" [`produto`], "Sazonalidade" [`sazon`], "Órgão competente" [`orgao`].

**Leitura das entradas no script:** `var d=segVal('mp-dim','data-d')||'insumo';` (L3401).

**Contêineres gerados por script:** `mp-chips` (painel/desenho gerado pelo script, L958); `mp-flux` (painel/desenho gerado pelo script, L960); `mp-panel` (painel/desenho gerado pelo script, L961).

**Cenário-padrão** (script original executado em DOM simulado): entradas {}; seleções {"mp-dim":"insumo"}.

**Ramos:** nenhum. Sem cadeia de ramos: o texto de leitura vem das tabelas de dados (dados_do_script) conforme a seleção.

**Templates de texto fora das tabelas:** 4 trechos (L3380, L3385, L3387–L3397, L3404). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Dados do script (3), literais avaliados:**

**`ROTAS`** (L3311–L3372):
- `cana1g`: n="Etanol de cana · 1G"; insumo="Caldo e melaço de cana-de-açúcar"; conv="Moagem, fermentação, destilação e — para o anidro — desidratação"; prod="Etanol hidratado e etanol anidro"; merc="Bomba (hidratado) e mistura obrigatória (anidro)"; org="ANP para especificação; CNPE para o teor de mistura"; matriz="Matriz energética · transportes"; conc="Açúcar, pelo mesmo ATR"; gi="Cana-de-açúcar"; gp="Líquido de ciclo Otto"; gs="Sazonal por safra"; go="ANP + teor fixado pelo CNPE"; nota="A rota de referência do setor. Todo número dela precisa de ano-safra, porque o ciclo do Centro-Sul atravessa dois anos-calendário — e precisa do mix, porque o mesmo ATR poderia ter virado açúcar."
- `milho`: n="Etanol de milho"; insumo="Milho, sobretudo de segunda safra"; conv="Moagem do grão, liquefação, sacarificação, fermentação e destilação"; prod="Etanol, mais DDGS, óleo de milho e dióxido de carbono biogênico"; merc="Mesmos mercados da rota de cana; coprodutos em mercados próprios"; org="ANP — mesma especificação de produto da rota de cana"; matriz="Matriz energética · transportes"; conc="Milho para ração, exportação e alimentação humana"; gi="Milho"; gp="Líquido de ciclo Otto"; gs="Operação quase contínua"; go="ANP · sem teor próprio"; nota="Grão armazenável quebra a sazonalidade de safra — e o preço disso é uma fonte térmica externa contratada, que a rota de cana não precisa comprar e que entra na intensidade de carbono."
- `e2g`: n="Etanol de 2ª geração"; insumo="Frações celulósicas de bagaço e palha"; conv="Pré-tratamento, hidrólise enzimática, fermentação e separação"; prod="Etanol — a mesma molécula da rota de cana"; merc="Mesmos mercados; prêmio potencial por baixa intensidade de carbono"; org="ANP — sem marco próprio de rota; diferença está na certificação de carbono"; matriz="Matriz energética · transportes, reduzindo a contribuição elétrica da mesma planta"; conc="Vapor de processo, eletricidade exportada e venda de biomassa"; gi="Cana-de-açúcar"; gp="Líquido de ciclo Otto"; gs="Sazonal por safra"; go="ANP · sem teor próprio"; nota="A ilustração mais limpa da Lente de Arbitragem: a fibra que vira etanol aqui é a fibra que não vira vapor nem eletricidade na mesma unidade."
- `biodiesel`: n="Biodiesel"; insumo="Óleos e gorduras, com predominância de óleo de soja"; conv="Transesterificação com álcool, gerando ésteres e glicerina"; prod="B100 para mistura no diesel A, mais glicerina"; merc="Demanda inteiramente derivada do teor obrigatório no diesel B"; org="ANP para especificação; CNPE para o teor de mistura"; matriz="Matriz energética · transportes"; conc="Óleo de soja para alimentação e exportação; diesel verde e combustível de aviação"; gi="Óleo e gordura"; gp="Líquido de ciclo Diesel"; gs="Operação contínua"; go="ANP + teor fixado pelo CNPE"; nota="O caso mais puro de mercado criado por regra: sem teor obrigatório, a demanda não cai — some. Por isso o percentual, com os seus quatro estados, é o dado central desta rota."
- `biometano`: n="Biogás e biometano"; insumo="Resíduos orgânicos distribuídos: vinhaça, torta, dejeto, aterro e esgoto"; conv="Digestão anaeróbia e purificação até a especificação"; prod="Biogás para uso local; biometano para rede, indústria, carreta ou frota"; merc="Substituição de gás natural, com camada de certificado de origem"; org="ANP para especificação e certificação; CNPE para a meta de descarbonização do gás"; matriz="Matriz energética como gás; matriz elétrica apenas na parcela cogerada"; conc="Outros destinos do mesmo resíduo, inclusive a emissão do metano"; gi="Resíduo orgânico"; gp="Gasoso"; gs="Contínua, com sazonalidade de substrato"; go="ANP + meta fixada pelo CNPE"; nota="A economia é de logística e de escala mínima, não de tecnologia. O insumo está espalhado, e é a dispersão que define o raio econômico de coleta."
- `cogeracao`: n="Cogeração a bagaço"; insumo="Bagaço da moagem e palha recolhida"; conv="Queima em caldeira, expansão em turbina, extração de vapor de processo"; prod="Vapor de processo e eletricidade — autoconsumida e exportada"; merc="Ambiente regulado e ambiente livre, com sazonalização declarada"; org="ANEEL e ONS para capacidade e operação; CCEE para comercialização"; matriz="Matriz elétrica — a única rota do módulo cujo produto principal é eletricidade"; conc="Etanol de segunda geração e venda de biomassa, pelo mesmo bagaço"; gi="Cana-de-açúcar"; gp="Eletricidade"; gs="Sazonal por safra"; go="ANEEL, ONS e CCEE"; nota="Três grandezas para a mesma planta, e a sazonalidade como complementaridade à hidrologia. É a rota em que confundir potência instalada com energia exportada custa mais caro."

**`ORD`** (L3373–L3378):
- `insumo`: 0="cana1g"; 1="e2g"; 2="cogeracao"; 3="milho"; 4="biodiesel"; 5="biometano"
- `produto`: 0="cana1g"; 1="milho"; 2="e2g"; 3="biodiesel"; 4="biometano"; 5="cogeracao"
- `sazon`: 0="cana1g"; 1="e2g"; 2="cogeracao"; 3="biometano"; 4="milho"; 5="biodiesel"
- `orgao`: 0="cana1g"; 1="biodiesel"; 2="biometano"; 3="milho"; 4="e2g"; 5="cogeracao"

**`GK`** (L3379–L3379):
- `insumo`: "gi"
- `produto`: "gp"
- `sazon`: "gs"
- `orgao`: "go"


**Fonte dos números:** `null`. Nenhuma fonte declarada para a tabela ROTAS (texto descritivo, sem número).

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

## INST·02 — "Calculadora de paridade por custo/km"

- **Onde:** Aula 01 (`aula-14-01`), subseção §01.3 "A paridade, e por que a regra dos 70% é uma aproximação histórica e não uma lei". Cabeçalho em L1164. Script L3411–L3471, comentário "PARIDADE POR CUSTO/KM".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L1170):** "Quatro entradas, todas editáveis, nenhum limiar cravado. O instrumento recusa concluir a partir do índice de preço isolado: ele cruza o índice com a razão de rendimento medida e devolve a diferença de custo por quilômetro, mais o que ainda falta para a conclusão ser utilizável."
- **Aviso (p.disc):** "Preços de referência são entradas editáveis, não constantes: use a pesquisa de preços da própria agência para a sua praça, ou nota fiscal, com data. O rendimento precisa ser medido no mesmo veículo, mesmo trajeto e mesmo período — computador de bordo não validado por abastecimento completo é estimativa, não medição. Carga tributária estadual e diferença de frete a partir do Centro-Sul já estão embutidas no preço de bomba que você digitou, e são a razão pela qual o mesmo par de preços não se repete entre estados."
- **Mecânica (kind sugerido `calculadora`):** Anotação desta extração (taxonomia): 4 campos numéricos (range gêmeo) → 5 saídas + veredito textual por faixa.
- **Menções na seção (leitura desta extração):** L1071 falso_positivo — o "instrumento" é o corante obrigatório (instrumento de detecção de adulteração), não o INST·02.
- **Catálogo:** "Calculadora de paridade por custo/km" — "Quatro entradas editáveis, nenhum limiar cravado; cruza índice de preço com razão de rendimento medida → diferença de custo por quilômetro, e o que falta para a conclusão ser utilizável." (nome igual ao span.nm: true).

**Entradas numéricas (4).**

| Id | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Tipo | Linha |
|---|---|---|---|---|---|---|
| `pd-pg-n` | "Preço da gasolina C" | "R$/L" | 3–12, 0.01 | 6.20 | number + range gêmeo | L1176 |
| `pd-pe-n` | "Preço do etanol hidratado" | "R$/L" | 2–10, 0.01 | 4.15 | number + range gêmeo | L1181 |
| `pd-cg-n` | "Rendimento com gasolina" | "km/L" | 4–22, 0.1 | 11.5 | number + range gêmeo | L1186 |
| `pd-ce-n` | "Rendimento com etanol" | "km/L" | 3–18, 0.1 | 8.0 | number + range gêmeo | L1191 |

**Leitura das entradas no script:** `var pg=numOf($id('pd-pg-n'),6.20,3,12);` (L3415); `var pe=numOf($id('pd-pe-n'),4.15,2,10);` (L3416); `var cg=numOf($id('pd-cg-n'),11.5,4,22);` (L3417); `var ce=numOf($id('pd-ce-n'),8.0,3,18);` (L3418).

**Saídas (5).** Valor no markup antes do script: "—".

| Id | Rótulo | Formatação no script (exata) | Cenário-padrão |
|---|---|---|---|
| `pd-ix` | "Índice de preço" | `$id('pd-ix').textContent=fmt(ix*100,1)+'%';` (L3423) | "66,9%" |
| `pd-ef` | "Razão de rendimento" | `$id('pd-ef').textContent=fmt(ef*100,1)+'%';` (L3424) | "69,6%" |
| `pd-cg` | "Custo/km · gasolina" | `$id('pd-cg').textContent='R$ '+fmt(kg,3)+'/km';` (L3425) | "R$ 0,539/km" |
| `pd-ce` | "Custo/km · etanol" | `$id('pd-ce').textContent='R$ '+fmt(ke,3)+'/km';` (L3426) | "R$ 0,519/km" |
| `pd-df` | "Diferença" | `$id('pd-df').textContent=(dif>0?'+':'')+fmt(dif,1)+'%';` (L3427) | "-3,8%" |

**Fórmulas (código exato do script):**

```js
var ix=pe/pg;   // L3419
var ef=ce/cg;   // L3420
var kg=pg/cg, ke=pe/ce;   // L3421
var dif=(ke-kg)/kg*100;   // L3422
```

**Contêineres gerados por script:** `pd-vd` (veredito, L1206).

**Cenário-padrão** (script original executado em DOM simulado): entradas {"pd-pg-n":6.2,"pd-pe-n":4.15,"pd-cg-n":11.5,"pd-ce-n":8}; seleções {}; classe do veredito `verdict ok`.

Veredito no carregamento (`pd-vd`):

> "ETANOL MAIS BARATO POR QUILÔMETRO, COM MARGEM ESTREITA. O índice de preço é 66,9% e a razão de rendimento medida é 69,6% — os dois sinais precisam ser lidos juntos, e a regra dos 70% não entra na conta. Diferença de 3,8%, dentro da faixa em que uma variação normal de preço semanal ou um erro de medição de consumo inverte o resultado. Trate como empate técnico até ter três abastecimentos completos medidos."

**Ramos do veredito (5).** O texto completo de cada ramo, com a concatenação exata, está em `ramos_do_veredito[].expressao_texto_verbatim`.

| Condição (literal) | Classe | Rótulo em negrito | Linhas |
|---|---|---|---|
| `if(dif<=-5)` | `ok` | "ETANOL MAIS BARATO POR QUILÔMETRO, COM MARGEM CONFORTÁVEL." | L3432–L3438 |
| `else if(dif<=-2)` | `ok` | "ETANOL MAIS BARATO POR QUILÔMETRO, COM MARGEM ESTREITA." | L3438–L3444 |
| `else if(dif<2)` | `att` | "INDIFERENÇA TÉCNICA ENTRE OS DOIS COMBUSTÍVEIS." | L3444–L3450 |
| `else if(dif<5)` | `att` | "GASOLINA MAIS BARATA POR QUILÔMETRO, COM MARGEM ESTREITA." | L3450–L3456 |
| `else` | `per` | "GASOLINA MAIS BARATA POR QUILÔMETRO, COM MARGEM CONFORTÁVEL." | L3456–L3462 |

Exemplo por ramo (execução real): 5 ramos alcançados, entradas em `exemplo_por_ramo`.

**Templates de texto fora das tabelas:** 3 trechos (L3423–L3427, L3429–L3431, L3463). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Fonte dos números:** `null`. Padrões (6,20; 4,15; 11,5; 8,0) sem fonte declarada. O p.disc manda usar "a pesquisa de preços da própria agência para a sua praça, ou nota fiscal, com data" e medir o rendimento no mesmo veículo.

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

## INST·03 — "Régua de mix açúcar-etanol"

- **Onde:** Aula 02 (`aula-14-02`), subseção §02.3 "A restrição que o preço não mostra". Cabeçalho em L1323. Script L3473–L3549, comentário "RÉGUA DE MIX AÇÚCAR-ETANOL".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L1329):** "Primeiro escolha o perfil industrial da planta — é ele que define a faixa de alternância. Depois ajuste a remuneração relativa por quilo de ATR em cada destino e o mix já praticado nesta safra. O veredito cruza dois sinais e recusa concluir por um só."
- **Aviso (p.disc):** "As remunerações por quilo de ATR em cada destino são entradas editáveis, não constantes: elas dependem de preço de açúcar em bolsa internacional, câmbio, prêmio de polarização, preço regional de hidratado e de anidro, e da estrutura tributária aplicável a cada produto. Reconstrua-as com data e fonte antes de qualquer uso externo. A faixa de alternância de uma unidade real precisa ser confirmada com a própria unidade — as faixas usadas aqui são ilustrativas de perfil, não de qualquer planta específica."
- **Mecânica (kind sugerido `simulador`):** Anotação desta extração (taxonomia): 1 seleção de perfil + 3 campos (range) → 4 saídas (3 textuais) + barras + veredito. Nome "Régua" fora do enum; mecânica campo→readout→veredito.
- **Menções na seção (leitura desta extração):** L1316 invoca — "o instrumento abaixo recusa fazê-lo".
- **Catálogo:** "Régua de mix açúcar-etanol" — "Perfil industrial da planta define a faixa de alternância; remuneração relativa por quilo de ATR em cada destino e mix já praticado → veredito que cruza dois sinais." (nome igual ao span.nm: true).

**Entradas numéricas (3).**

| Id | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Tipo | Linha |
|---|---|---|---|---|---|---|
| `mx-pa-n` | "Remuneração do ATR · açúcar" | "R$/kg ATR" | 0.4–2.5, 0.01 | 1.18 | number + range gêmeo | L1341 |
| `mx-pe-n` | "Remuneração do ATR · etanol" | "R$/kg ATR" | 0.4–2.5, 0.01 | 1.26 | number + range gêmeo | L1346 |
| `mx-mx-n` | "Mix já praticado nesta safra" | "% para açúcar" | 0–100, 1 | 48 | number + range gêmeo | L1351 |

**Seleção `mx-perf`** "Perfil industrial da unidade:" (L1334): "Mista equilibrada" [`mista`] (ativo no markup), "Vocacionada a açúcar" [`acuc`], "Destilaria autônoma" [`dest`].

**Leitura das entradas no script:** `var pk=segVal('mx-perf','data-p')||'mista';` (L3485); `var pa=numOf($id('mx-pa-n'),1.18,0.4,2.5);` (L3487); `var pe=numOf($id('mx-pe-n'),1.26,0.4,2.5);` (L3488); `var mx=numOf($id('mx-mx-n'),48,0,100);` (L3489).

**Saídas (4).** Valor no markup antes do script: "—".

| Id | Rótulo | Formatação no script (exata) | Cenário-padrão |
|---|---|---|---|
| `mx-fa` | "Faixa de alternância" | `$id('mx-fa').textContent = (P.min===P.max) ? P.min+'% fixo' : P.min+'% a '+P.max+'%';` (L3495) | "30% a 65%" |
| `mx-pr` | "Prêmio relativo" | `$id('mx-pr').textContent = (premio>0?'+':'')+fmt(premio,1)+'%';` (L3496) | "-6,6%" |
| `mx-di` | "Destino indicado pelo preço" | `$id('mx-di').textContent = Math.abs(premio)<1.5 ? 'Indiferente' : (premio>0?'Açúcar':'Etanol');` (L3497) | "Etanol" |
| `mx-de` | "Deslocamento executável" | `$id('mx-de').textContent = (P.min===P.max) ? 'Nenhum' : ((desloc>0?'+':'')+fmt(desloc,0)+' p.p.');` (L3498) | "-18 p.p." |

**Fórmulas (código exato do script):**

```js
var premio=(pa-pe)/((pa+pe)/2)*100;   // L3490
var alvo = premio>0 ? P.max : P.min;   // L3491
var atual= clamp(mx,P.min,P.max);   // L3492
var desloc= alvo-atual;   // L3493
var pctA=atual, pctE=100-atual;   // L3501
var b=' Perfil industrial: '+P.n+'. '+P.d;   // L3512
```

**Contêineres gerados por script:** `mx-bars` (painel/desenho gerado pelo script, L1365); `mx-vd` (veredito, L1366).

**Cenário-padrão** (script original executado em DOM simulado): entradas {"mx-pa-n":1.18,"mx-pe-n":1.26,"mx-mx-n":48}; seleções {"mx-perf":"mista"}; classe do veredito `verdict ok`.

Veredito no carregamento (`mx-vd`):

> "DOIS SINAIS CRUZADOS: HÁ PRÊMIO E HÁ FAIXA DISPONÍVEL. Perfil industrial: Mista equilibrada. Unidade com capacidade de cristalização e de destilação instaladas, capaz de deslocar mix dentro de uma faixa ampla ao longo da safra. O preço aponta para etanol com prêmio de 6,6%, e restam 18 pontos percentuais de deslocamento dentro da faixa. Isto ainda não é uma conclusão: falta a terceira informação, que é quanto da produção já está vendida a termo e quanto de proteção de preço já foi montada — porque ATR com preço já travado não responde a sinal novo."

**Ramos do veredito (4).** O texto completo de cada ramo, com a concatenação exata, está em `ramos_do_veredito[].expressao_texto_verbatim`.

| Condição (literal) | Classe | Rótulo em negrito | Linhas |
|---|---|---|---|
| `if(P.min===P.max)` | `per` | "ARBITRAGEM INEXECUTÁVEL POR RESTRIÇÃO ESTRUTURAL." | L3513–L3520 |
| `else if(Math.abs(premio)<1.5)` | `att` | "SINAL DE PREÇO INDIFERENTE ENTRE OS DOIS DESTINOS." | L3520–L3526 |
| `else if(Math.abs(desloc)<3)` | `att` | "SINAL CLARO, MAS A UNIDADE JÁ ESTÁ NO LIMITE DA FAIXA." | L3526–L3533 |
| `else` | `ok` | "DOIS SINAIS CRUZADOS: HÁ PRÊMIO E HÁ FAIXA DISPONÍVEL." | L3533–L3540 |

Exemplo por ramo (execução real): 4 ramos alcançados, entradas em `exemplo_por_ramo`.

**Templates de texto fora das tabelas:** 5 trechos (L3495–L3498, L3500, L3503–L3508, L3510–L3512, L3541). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Dados do script (1), literais avaliados:**

**`PERFIS`** (L3476–L3483):
- `mista`: n="Mista equilibrada"; min=30; max=65; d="Unidade com capacidade de cristalização e de destilação instaladas, capaz de deslocar mix dentro de uma faixa ampla ao longo da safra."
- `acuc`: n="Vocacionada a açúcar"; min=55; max=80; d="Unidade com capacidade de cristalização dimensionada acima da destilação, e com piso de açúcar imposto por contrato de fornecimento e por logística de escoamento."
- `dest`: n="Destilaria autônoma"; min=0; max=0; d="Unidade sem capacidade de cristalização: teto de açúcar igual a zero. Nenhum sinal de preço a favor do açúcar desloca um quilo de ATR."


**Fonte dos números:** `null`. O p.disc declara que "as faixas usadas aqui são ilustrativas de perfil, não de qualquer planta específica" e que as remunerações por kg de ATR são entradas editáveis a reconstruir "com data e fonte".

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

## INST·04 — "Comparador de rotas de etanol — três rotas, sete dimensões"

- **Onde:** Aula 03 (`aula-14-03`), subseção §03.2 "Segunda geração: a rota que disputa o bagaço com a caldeira". Cabeçalho em L1525. Script L3551–L3612, comentário "COMPARADOR DE ROTAS DE ETANOL".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L1531):** "Escolha a dimensão e compare as três rotas de etanol lado a lado. Cada dimensão traz uma coluna de ressalva de comparabilidade: a advertência do que precisa ser igualado antes de a comparação naquela dimensão significar alguma coisa. Comparar sem igualar a base é como comparar dois volumes de anos-safra diferentes."
- **Aviso (p.disc):** "O comparador não classifica nenhuma rota como superior. Ele devolve, para cada dimensão, o que muda entre as três e o que precisa ser igualado antes de comparar — porque a resposta a "qual rota é melhor" depende de logística, escala e política locais, e não existe em abstrato."
- **Mecânica (kind sugerido `comparador`):** Anotação desta extração (taxonomia): 2 grupos de seleção (7 dimensões) → tabela das 3 rotas lado a lado + ressalva. Zero campo numérico.
- **Menções na seção (leitura desta extração):** nenhuma; o texto da aula não chama o instrumento fora do próprio bloco.
- **Catálogo:** "Comparador de rotas de etanol — três rotas, sete dimensões" — "Cada dimensão traz coluna de ressalva de comparabilidade: o que precisa ser igualado antes de a comparação significar algo." (nome igual ao span.nm: true).

**Seleção `rt-dim`** "Dimensão de comparação:" (L1537): "Insumo" [`insumo`] (ativo no markup), "Sazonalidade" [`sazon`], "Fonte térmica" [`termica`], "Coprodutos" [`copro`].

**Seleção `rt-dim2`** (sem rótulo: sem div.seg-lb própria (segunda linha do grupo anterior)) (L1543): "Intensidade de carbono" [`carb`] (ativo no markup), "Produto concorrente" [`conc`], "Maturidade da rota" [`matur`].

**Contêineres gerados por script:** `rt-out` (painel/desenho gerado pelo script, L1549); `rt-vd` (veredito, L1550).

**Cenário-padrão** (script original executado em DOM simulado): entradas {}; seleções {"rt-dim":"insumo","rt-dim2":"carb"}; classe do veredito `verdict att`.

Veredito no carregamento (`rt-vd`):

> "RESSALVA DE COMPARABILIDADE NESTA DIMENSÃO. Ressalva: quantidade de insumo não é comparável entre rotas sem converter para a mesma base energética ou para litros de produto. Tonelada de cana, saca de milho e tonelada seca de fibra não se somam. O comparador não classifica nenhuma rota como superior — a resposta a "qual rota é melhor" depende de logística, escala e política locais, e não existe em abstrato."

**Ramos:** nenhum. Sem cadeia de ramos: o texto de leitura vem das tabelas de dados (dados_do_script) conforme a seleção.

**Templates de texto fora das tabelas:** 5 trechos (L3591, L3594–L3600, L3602–L3605, L3607, L3610). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Dados do script (1), literais avaliados:**

**`D`** (L3554–L3590):
- `insumo`: t="Insumo"; a="Caldo e melaço de cana. Insumo perecível: moagem em horas após a colheita."; b="Grão de milho, sobretudo de segunda safra. Insumo armazenável, comprável fora da janela de colheita."; c="Frações celulósicas de bagaço e palha — insumo já presente dentro da própria unidade, e já disputado."; r="Ressalva: quantidade de insumo não é comparável entre rotas sem converter para a mesma base energética ou para litros de produto. Tonelada de cana, saca de milho e tonelada seca de fibra não se somam."
- `sazon`: t="Sazonalidade"; a="Sazonal por construção: a operação industrial acompanha a janela de moagem, que no Centro-Sul concentra-se entre abril e novembro."; b="Operação quase contínua ao longo do ano, limitada por programação industrial e por estoque de grão, não por colheita."; c="Herda a sazonalidade da unidade que a hospeda: sem moagem não há bagaço fresco, e o estoque de fibra tem limite prático."; r="Ressalva: comparar volumes anuais entre rotas com sazonalidades diferentes exige declarar se o número é de ano-safra ou de ano-calendário. É a comparação em que a base temporal mais engana."
- `termica`: t="Fonte térmica"; a="Autossuficiente: o bagaço fornece o vapor de processo e ainda pode gerar excedente elétrico exportável."; b="Depende de fonte térmica externa contratada — biomassa comprada, cavaco ou gás —, com custo e exposição a preço próprios."; c="Consome fibra que estaria no circuito térmico da unidade: cada tonelada hidrolisada é vapor ou eletricidade que deixa de existir."; r="Ressalva: custo de produção por litro não é comparável entre rotas sem declarar a fonte térmica e o seu preço. É a linha de custo que mais varia entre rotas que produzem a mesma molécula."
- `copro`: t="Coprodutos"; a="Vinhaça, torta de filtro, bagaço e palha — todos com uso alternativo dentro ou fora da unidade, e nenhum deles gratuito."; b="DDGS para ração, óleo de milho e dióxido de carbono biogênico — cada um com mercado, especificação e logística próprios."; c="Lignina e resíduos de processo, com destino energético ou material a definir por projeto."; r="Ressalva: receita de coproduto só é comparável quando há mercado comprovado à distância econômica. DDGS sem confinamento próximo é custo de disposição, não receita."
- `carb`: t="Intensidade de carbono"; a="Depende de produtividade agrícola, consumo de diesel na operação, fertilização, raio médio e cogeração renovável cobrindo a demanda térmica."; b="Depende de origem do grão, secagem, fonte térmica contratada e método de alocação atribuído aos coprodutos."; c="Tende a ser distinta da rota de primeira geração da mesma unidade, e é o principal argumento comercial da rota."; r="Ressalva: intensidade de carbono é por unidade produtora certificada, não por rota nem por combustível. Comparar médias de rota esconde a dispersão que decide a nota de cada planta."
- `conc`: t="Produto concorrente"; a="Açúcar, pelo mesmo ATR, dentro da faixa de alternância da unidade."; b="Milho para ração, exportação e alimentação humana — e a rota devolve parte do grão como DDGS."; c="Vapor de processo, eletricidade exportada e venda de biomassa — três destinos, dentro da mesma planta."; r="Ressalva: o produto concorrente muda completamente o significado de um crescimento de volume. Crescer etanol de cana pode ser deslocamento de mix; crescer etanol de milho é competição com outra cadeia inteira."
- `matur`: t="Maturidade da rota"; a="Rota madura, com parque instalado de escala nacional e décadas de operação comercial."; b="Rota em expansão rápida, com parque em construção e nova geografia produtiva se formando."; c="Rota em estágio inicial em escala comercial: exige prova de rendimento em regime, curva de ramp-up e disponibilidade de fibra."; r="Ressalva: aplique a régua de maturidade antes de somar qualquer coisa — memorando, estudo conceitual, planta anunciada e planta com contrato e financiamento são estágios que não se somam na mesma tabela."


**Fonte dos números:** `null`. Tabela qualitativa, sem número nem fonte.

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

**Divergências:** `div-m14-inst04-dois-on`.

## INST·05 — "Calculadora de demanda derivada por conteúdo obrigatório"

- **Onde:** Aula 04 (`aula-14-04`), subseção §04.3 "A demanda que a regra cria". Cabeçalho em L1638. Script L3614–L3694, comentário "DEMANDA DERIVADA POR CONTEÚDO OBRIGATÓRIO".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L1644):** "O percentual aqui carrega estado além de valor. Escolha primeiro o combustível base, depois o estado do percentual que você quer simular — e repare que o instrumento se recusa a tratar os quatro estados como equivalentes no veredito, mesmo quando o número digitado é o mesmo."
- **Aviso (p.disc):** "Volume e percentuais são entradas editáveis com fonte e data a declarar pelo usuário: o volume de diesel B e de gasolina C comercializado está nas séries da agência, e o percentual em vigor está na resolução do conselho. A conta é volumétrica e ignora deliberadamente ajuste de estoque, variação de densidade e cronograma de transição entre teores — que existem e deslocam o resultado no curto prazo. Ela serve para dimensionar a ordem de grandeza do mercado criado pela regra, não para prever compra mensal de nenhum agente."
- **Mecânica (kind sugerido `calculadora`):** Anotação desta extração (taxonomia): 2 seleções (base, estado) + 3 campos (range) → 4 saídas + veredito. Mecanicamente igual aos simulador; o nome "Calculadora" decide por convenção (taxonomia, regra 4).
- **Menções na seção (leitura desta extração):** L1717 falso_positivo — "instrumento energético" é a política de mistura, não o INST·05.
- **Catálogo:** "Calculadora de demanda derivada por conteúdo obrigatório" — "O percentual carrega estado além de valor: o instrumento recusa tratar os quatro estados como equivalentes, mesmo com o mesmo número digitado." (nome igual ao span.nm: true).

**Entradas numéricas (3).**

| Id | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Tipo | Linha |
|---|---|---|---|---|---|---|
| `dm-vol-n` | "Volume do combustível base" | "bilhões de litros/ano" | 1–90, 0.1 | 60 | number + range gêmeo | L1664 |
| `dm-pct-n` | "Percentual de mistura" | "% em volume" | 0–40, 0.5 | 15 | number + range gêmeo | L1669 |
| `dm-cmp-n` | "Percentual de comparação" | "% em volume" | 0–40, 0.5 | 16 | number + range gêmeo | L1674 |

**Seleção `dm-base`** "Combustível base:" (L1650): "Diesel B · biodiesel" [`diesel`] (ativo no markup), "Gasolina C · etanol anidro" [`gasolina`].

**Seleção `dm-est`** "Estado do percentual simulado:" (L1656): "Em vigor" [`vigente`] (ativo no markup), "Teto legal autorizado" [`teto`], "Anunciado / trajetória" [`anunciado`], "Prazo vencido, não implementado" [`vencido`].

**Leitura das entradas no script:** `var bk=segVal('dm-base','data-b')||'diesel';` (L3634); `var ek=segVal('dm-est','data-e')||'vigente';` (L3635); `var vol=numOf($id('dm-vol-n'),60,1,90);` (L3637); `var p1=numOf($id('dm-pct-n'),15,0,40);` (L3638); `var p2=numOf($id('dm-cmp-n'),16,0,40);` (L3639).

**Saídas (4).** Valor no markup antes do script: "—".

| Id | Rótulo | Formatação no script (exata) | Cenário-padrão |
|---|---|---|---|
| `dm-q1` | "Demanda derivada" | `$id('dm-q1').textContent=fmt(q1,2)+' bi L';` (L3642) | "9,00 bi L" |
| `dm-q2` | "No percentual de comparação" | `$id('dm-q2').textContent=fmt(q2,2)+' bi L';` (L3643) | "9,60 bi L" |
| `dm-pp` | "Diferença por ponto" | `$id('dm-pp').textContent=fmt(pp,2)+' bi L / p.p.';` (L3644) | "0,60 bi L / p.p." |
| `dm-fo` | "Base fóssil deslocada" | `$id('dm-fo').textContent=fmt(vol-q1,2)+' bi L';` (L3645) | "51,00 bi L" |

**Fórmulas (código exato do script):**

```js
var q1=vol*p1/100, q2=vol*p2/100;   // L3640
var pp=vol*0.01;   // L3641
var ref = ek==='vigente'?B.vig : ek==='teto'?B.teto : ek==='anunciado'?B.anun : B.venc;   // L3647
var bate = Math.abs(p1-ref)<0.25;   // L3648
```

**Contêineres gerados por script:** `dm-vd` (veredito, L1688).

**Cenário-padrão** (script original executado em DOM simulado): entradas {"dm-vol-n":60,"dm-pct-n":15,"dm-cmp-n":16}; seleções {"dm-base":"diesel","dm-est":"vigente"}; classe do veredito `verdict ok`.

Veredito no carregamento (`dm-vd`):

> "ESTADO COERENTE: PERCENTUAL EM VIGOR, VALOR CONFERIDO. Base: diesel B, biocombustível: biodiesel B100. Estado simulado: em vigor — É o único estado que descreve litros efetivamente comercializados hoje. Pode ser citado como fato, com norma e data. Referência verificada em 2 de agosto de 2026 para este estado: 15%. Em vigor desde 1º de agosto de 2025. Teto legal de 25% na Lei nº 14.993/2024, mediante viabilidade técnica comprovada. Trajetória legal apontando para 20% até março de 2030. B16 com prazo legal de março de 2026 não implementado. A diferença entre 15,0% e 16,0% move 0,60 bilhão de litros de demanda derivada sobre o volume informado. Este é o único par estado-valor que pode ser citado como fato sem qualificação adicional — e ainda assim exige norma e data, porque medidas temporárias existem."

**Ramos do veredito (5).** O texto completo de cada ramo, com a concatenação exata, está em `ramos_do_veredito[].expressao_texto_verbatim`.

| Condição (literal) | Classe | Rótulo em negrito | Linhas |
|---|---|---|---|
| `if(ek==='vigente' && bate)` | `ok` | "ESTADO COERENTE: PERCENTUAL EM VIGOR, VALOR CONFERIDO." | L3655–L3660 |
| `else if(ek==='vigente' && !bate)` | `per` | "ESTADO INCOERENTE: DECLARADO COMO VIGENTE, VALOR DIVERGENTE." | L3660–L3666 |
| `else if(ek==='teto')` | `att` | "TETO LEGAL: DIMENSIONA O MÁXIMO POSSÍVEL, NÃO O MERCADO ATUAL." | L3666–L3672 |
| `else if(ek==='anunciado')` | `att` | "PERCENTUAL ANUNCIADO OU DE TRAJETÓRIA: TEM DATA, NÃO TEM VIGÊNCIA." | L3672–L3677 |
| `else` | `per` | "PRAZO LEGAL VENCIDO E NÃO IMPLEMENTADO: O VOLUME NÃO EXISTE." | L3677–L3684 |

Exemplo por ramo (execução real): 5 ramos alcançados, entradas em `exemplo_por_ramo`.

**Templates de texto fora das tabelas:** 5 trechos (L3637–L3639, L3642–L3645, L3647, L3649–L3653, L3685). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Dados do script (2), literais avaliados:**

**`BASES`** (L3617–L3622):
- `diesel`: n="diesel B"; bio="biodiesel B100"; vig=15; teto=25; anun=20; venc=16; not="Em vigor desde 1º de agosto de 2025. Teto legal de 25% na Lei nº 14.993/2024, mediante viabilidade técnica comprovada. Trajetória legal apontando para 20% até março de 2030. B16 com prazo legal de março de 2026 não implementado."
- `gasolina`: n="gasolina C comum"; bio="etanol anidro"; vig=32; teto=35; anun=35; venc=30; not="E32 em vigor desde 1º de agosto de 2026 por resolução do conselho, em caráter excepcional e temporário, com 180 dias prorrogáveis uma vez. Teto legal de 35% na Lei nº 14.993/2024, com adoção definitiva condicionada aos testes para E35. E30 foi o teor vigente até 31 de julho de 2026."

**`EST`** (L3623–L3632):
- `vigente`: n="em vigor"; d="É o único estado que descreve litros efetivamente comercializados hoje. Pode ser citado como fato, com norma e data."
- `teto`: n="teto legal autorizado"; d="Descreve o máximo que o conselho pode fixar sem lei nova. Não descreve nenhum litro vendido. Citá-lo como se fosse o teor em vigor é o erro mais frequente de material de imprensa sobre este tema."
- `anunciado`: n="anunciado ou de trajetória"; d="Descreve intenção com data futura, sujeita a condicionante técnica e a deliberação. Citável apenas com a data e a condicionante declaradas."
- `vencido`: n="prazo legal vencido e não implementado"; d="Existe no texto da lei, a data passou, e o percentual não entrou em vigor. É o estado que só aparece para quem confere a resolução depois de ler a lei."


**Fonte dos números:** "Script: "Referência verificada em 2 de agosto de 2026 para este estado" + textos BASES[].not (citam a Lei nº 14.993/2024 e "resolução do conselho").". O volume padrão (60 bilhões de litros) não tem fonte; o p.disc diz que o volume "está nas séries da agência" e o percentual "na resolução do conselho", a declarar pelo usuário.

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

**Divergências:** `div-m14-inst05-vencido-gasolina`, `div-m14-inst05-troca-base`.

## INST·06 — "Simulador de cogeração sazonal — as três grandezas lado a lado"

- **Onde:** Aula 05 (`aula-14-05`), subseção §05.2 "A sazonalidade como complementaridade, não como defeito". Cabeçalho em L1815. Script L3696–L3775, comentário "SIMULADOR DE COGERAÇÃO SAZONAL".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L1821):** "O instrumento que resolve a frase "energia firme na safra". Ajuste potência instalada, dias efetivos de safra, autoconsumo de processo e disponibilidade da planta, e veja as três grandezas simultaneamente — nunca apenas a que parecer mais impressionante. O veredito cruza fator de capacidade anual com dias de safra e recusa classificar por um sinal só."
- **Aviso (p.disc):** "Todos os valores são entradas editáveis. Autoconsumo de processo varia enormemente conforme o desenho térmico da planta e a pressão da caldeira, e é a variável que mais desloca o resultado — uma unidade com caldeira de baixa pressão pode não ter nenhum excedente exportável, e isso não a torna uma planta ruim: torna-a uma planta que resolveu o próprio vapor e não vende energia. Dias de safra dependem de região, clima e programação de manutenção. Nenhum número aqui descreve nenhuma unidade específica."
- **Mecânica (kind sugerido `simulador`):** Anotação desta extração (taxonomia): 4 campos (range) → 5 saídas + barras + veredito.
- **Menções na seção (leitura desta extração):** nenhuma; o texto da aula não chama o instrumento fora do próprio bloco.
- **Catálogo:** "Simulador de cogeração sazonal — as três grandezas lado a lado" — "Potência instalada, dias de safra, autoconsumo e disponibilidade → potência, energia gerada e energia exportada simultaneamente; cruza fator de capacidade anual com dias de safra." (nome igual ao span.nm: true).

**Entradas numéricas (4).**

| Id | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Tipo | Linha |
|---|---|---|---|---|---|---|
| `cg-pot-n` | "Potência instalada" | "MW" | 5–300, 1 | 80 | number + range gêmeo | L1827 |
| `cg-dia-n` | "Dias efetivos de safra" | "dias/ano" | 60–365, 1 | 210 | number + range gêmeo | L1832 |
| `cg-aut-n` | "Autoconsumo de processo" | "% da geração bruta" | 0–95, 1 | 55 | number + range gêmeo | L1837 |
| `cg-dis-n` | "Disponibilidade na safra" | "% das horas" | 30–100, 1 | 88 | number + range gêmeo | L1842 |

**Leitura das entradas no script:** `var pot=numOf($id('cg-pot-n'),80,5,300);` (L3700); `var dia=numOf($id('cg-dia-n'),210,60,365);` (L3701); `var aut=numOf($id('cg-aut-n'),55,0,95);` (L3702); `var dis=numOf($id('cg-dis-n'),88,30,100);` (L3703).

**Saídas (5).** Valor no markup antes do script: "—".

| Id | Rótulo | Formatação no script (exata) | Cenário-padrão |
|---|---|---|---|
| `cg-p1` | "Potência instalada" | `$id('cg-p1').textContent=fmt(pot,0)+' MW';` (L3709) | "80 MW" |
| `cg-p2` | "Energia gerada" | `$id('cg-p2').textContent=fmt(ger,0)+' GWh';` (L3710) | "355 GWh" |
| `cg-p3` | "Energia exportada" | `$id('cg-p3').textContent=fmt(exp,0)+' GWh';` (L3711) | "160 GWh" |
| `cg-fc` | "Fator de capacidade anual" | `$id('cg-fc').textContent=fmt(fca,1)+'%';` (L3712) | "22,8%" |
| `cg-fs` | "FC dentro da safra" | `$id('cg-fs').textContent=fmt(fcs,1)+'%';` (L3713) | "39,6%" |

**Fórmulas (código exato do script):**

```js
var hs=dia*24;   // L3704
var ger=pot*hs*(dis/100)/1000;          /* GWh brutos */   // L3705
var exp=ger*(1-aut/100);                 /* GWh exportados */   // L3706
var fca=exp*1000/(pot*8760)*100;         /* fator de capacidade anual, % */   // L3707
var fcs=exp*1000/(pot*hs)*100;           /* fator de capacidade dentro da safra, % */   // L3708
var teto=pot*8760/1000;   // L3715
var pg=ger/teto*100, pe=exp/teto*100;   // L3716
```

**Contêineres gerados por script:** `cg-bars` (painel/desenho gerado pelo script, L1857); `cg-vd` (veredito, L1858).

**Cenário-padrão** (script original executado em DOM simulado): entradas {"cg-pot-n":80,"cg-dia-n":210,"cg-aut-n":55,"cg-dis-n":88}; seleções {}; classe do veredito `verdict ok`.

Veredito no carregamento (`cg-vd`):

> "PERFIL COERENTE COM COGERAÇÃO SUCROENERGÉTICA SAZONAL. Três grandezas para a mesma planta: 80 MW instalados, 355 GWh gerados e 160 GWh exportados. A multiplicação ingênua de potência por 8.760 horas daria 701 GWh — uma planta que não existe. Dois sinais cruzados: fator de capacidade anual de 22,8% e 210 dias efetivos de safra. Nenhum dos dois se lê sozinho. Fator de capacidade anual na faixa em que uma unidade que mói meio ano e consome vapor de processo costuma operar. Dentro da safra o fator sobe para 39,6% — e é a diferença entre os dois números que resolve a frase "energia firme na safra": firme enquanto mói, e o contrato precisa dizer quem cobre a entressafra."

**Ramos do veredito (5).** O texto completo de cada ramo, com a concatenação exata, está em `ramos_do_veredito[].expressao_texto_verbatim`.

| Condição (literal) | Classe | Rótulo em negrito | Linhas |
|---|---|---|---|
| `if(aut>=90)` | `per` | "PLANTA SEM EXCEDENTE RELEVANTE: A ENERGIA VIRA PROCESSO." | L3732–L3739 |
| `else if(dia>=330)` | `att` | "OPERAÇÃO QUASE CONTÍNUA: VERIFIQUE SE O COMBUSTÍVEL FECHA O ANO." | L3739–L3746 |
| `else if(fca>=35)` | `ok` | "FATOR DE CAPACIDADE ANUAL ALTO PARA UMA FONTE SAZONAL." | L3746–L3752 |
| `else if(fca>=18)` | `ok` | "PERFIL COERENTE COM COGERAÇÃO SUCROENERGÉTICA SAZONAL." | L3752–L3759 |
| `else` | `att` | "FATOR DE CAPACIDADE ANUAL BAIXO: A EXPORTAÇÃO É MARGINAL." | L3759–L3766 |

Exemplo por ramo (execução real): 5 ramos alcançados, entradas em `exemplo_por_ramo`.

**Templates de texto fora das tabelas:** 5 trechos (L3700–L3703, L3709–L3713, L3717–L3723, L3725–L3730, L3767). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Fonte dos números:** `null`. O p.disc declara: "Nenhum número aqui descreve nenhuma unidade específica". Os padrões (80 MW, 210 dias, 55%, 88%) são os mesmos do Ex 02, da Q04 do quiz e do enunciado e7 do INST·10.

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

**Divergências:** `div-m14-inst06-perdas`.

## INST·07 — "Régua de biometano — escala mínima e rota de entrega"

- **Onde:** Aula 06 (`aula-14-06`), subseção §06.2 "A rota de entrega decide a economia". Cabeçalho em L1973. Script L3777–L3851, comentário "RÉGUA DE BIOMETANO".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L1979):** "Escolha a rota de entrega e ajuste volume, distância até o cliente e preço líquido na planta. O instrumento devolve energia entregue, custo logístico incremental e a margem por metro cúbico normal — e recusa concluir sobre viabilidade a partir do preço isolado, porque a mesma tarifa por Nm³ significa coisas opostas em rotas diferentes."
- **Aviso (p.disc):** "Os parâmetros logísticos por rota são ilustrativos de ordem de grandeza e existem para ensinar a estrutura do problema — não são benchmark de mercado nem devem ser citados como tal. Preço líquido, custo operacional e poder calorífico precisam vir do contrato e da especificação do projeto real, com data. Nenhuma conclusão deste instrumento é recomendação de adoção de rota."
- **Mecânica (kind sugerido `simulador`):** Anotação desta extração (taxonomia): 1 seleção + 4 campos (range) → 4 saídas + veredito. Nome "Régua" fora do enum.
- **Menções na seção (leitura desta extração):** nenhuma; o texto da aula não chama o instrumento fora do próprio bloco.
- **Catálogo:** "Régua de biometano — escala mínima e rota de entrega" — "Rota, volume, distância e preço líquido → energia entregue, custo logístico incremental e margem por metro cúbico normal." (nome igual ao span.nm: true).

**Entradas numéricas (4).**

| Id | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Tipo | Linha |
|---|---|---|---|---|---|---|
| `bm-vol-n` | "Volume vendável" | "milhões de Nm³/ano" | 0.5–60, 0.1 | 15 | number + range gêmeo | L1993 |
| `bm-dis-n` | "Distância até o cliente" | "km" | 0–600, 5 | 80 | number + range gêmeo | L1998 |
| `bm-prc-n` | "Preço líquido na planta" | "R$/Nm³" | 0.5–6, 0.05 | 2.30 | number + range gêmeo | L2003 |
| `bm-opx-n` | "Custo operacional na planta" | "R$/Nm³" | 0.2–4, 0.05 | 0.85 | number + range gêmeo | L2008 |

**Seleção `bm-rota`** "Rota de entrega:" (L1985): "Térmica local" [`local`] (ativo no markup), "Comprimido em carreta" [`gnc`], "Injeção em rede" [`rede`], "Veicular dedicado" [`frota`].

**Leitura das entradas no script:** `var rk=segVal('bm-rota','data-r')||'local';` (L3791); `var vol=numOf($id('bm-vol-n'),15,0.5,60);` (L3793); `var dis=numOf($id('bm-dis-n'),80,0,600);` (L3794); `var prc=numOf($id('bm-prc-n'),2.30,0.5,6);` (L3795); `var opx=numOf($id('bm-opx-n'),0.85,0.2,4);` (L3796).

**Saídas (4).** Valor no markup antes do script: "—".

| Id | Rótulo | Formatação no script (exata) | Cenário-padrão |
|---|---|---|---|
| `bm-en` | "Energia entregue" | `$id('bm-en').textContent=fmt(en,0)+' TJ/ano';` (L3800) | "1 TJ/ano" |
| `bm-lg` | "Custo logístico" | `$id('bm-lg').textContent='R$ '+fmt(log,2)+'/Nm³';` (L3801) | "R$ 0,07/Nm³" |
| `bm-mg` | "Margem unitária" | `$id('bm-mg').textContent='R$ '+fmt(mg,2)+'/Nm³';` (L3802) | "R$ 1,38/Nm³" |
| `bm-es` | "Escala mínima da rota" | `$id('bm-es').textContent=fmt(R1.esc,0)+' mi Nm³/ano';` (L3803) | "2 mi Nm³/ano" |

**Fórmulas (código exato do script):**

```js
var log=R1.fix + R1.km*dis;   // L3797
var mg=prc-opx-log;   // L3798
var en=vol*36/1000;  /* TJ, a 36 MJ/Nm3 */   // L3799
var b=' Rota: '+R1.n+'. '+R1.d+' Custo logístico de R$ '+fmt(log,2)+'/Nm³ a '+fmt(dis,0)+' km.';   // L3806
```

**Contêineres gerados por script:** `bm-vd` (veredito, L2022).

**Cenário-padrão** (script original executado em DOM simulado): entradas {"bm-vol-n":15,"bm-dis-n":80,"bm-prc-n":2.3,"bm-opx-n":0.85}; seleções {"bm-rota":"local"}; classe do veredito `verdict ok`.

Veredito no carregamento (`bm-vd`):

> "DOIS SINAIS FAVORÁVEIS: ESCALA ACIMA DA REFERÊNCIA E MARGEM FOLGADA. Rota: térmica local. Sem compressão e sem frete longo. A restrição não é econômica, é de localização: exige cliente térmico junto à fonte, com demanda compatível e contínua. Custo logístico de R$ 0,07/Nm³ a 80 km. Dois sinais cruzados: margem unitária de R$ 1,38/Nm³ e escala de 15,0 milhões de Nm³/ano contra a referência de 2 milhões desta rota. Isto ainda não é conclusão de viabilidade. Faltam três verificações que nenhum instrumento substitui: o substrato está contratado e é contínuo? existe cliente com contrato de prazo compatível? e a receita de atributo ambiental, se houver, está fora do caso base — como deve estar, porque atributo é ganho adicional, não salvamento de projeto."

**Ramos do veredito (5).** O texto completo de cada ramo, com a concatenação exata, está em `ramos_do_veredito[].expressao_texto_verbatim`.

| Condição (literal) | Classe | Rótulo em negrito | Linhas |
|---|---|---|---|
| `if(mg<=0)` | `per` | "MARGEM UNITÁRIA NEGATIVA OU NULA NESTA CONFIGURAÇÃO." | L3810–L3816 |
| `else if(vol<R1.esc*0.6)` | `per` | "ESCALA MUITO ABAIXO DA REFERÊNCIA DA ROTA." | L3816–L3822 |
| `else if(vol<R1.esc)` | `att` | "ESCALA PRÓXIMA DA REFERÊNCIA, MAS AINDA ABAIXO." | L3822–L3828 |
| `else if(mg<0.4)` | `att` | "ESCALA SUFICIENTE, MARGEM ESTREITA." | L3828–L3834 |
| `else` | `ok` | "DOIS SINAIS FAVORÁVEIS: ESCALA ACIMA DA REFERÊNCIA E MARGEM FOLGADA." | L3834–L3841 |

Exemplo por ramo (execução real): 5 ramos alcançados, entradas em `exemplo_por_ramo`.

**Templates de texto fora das tabelas:** 4 trechos (L3793–L3796, L3800–L3803, L3805–L3808, L3842). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Dados do script (1), literais avaliados:**

**`R`** (L3780–L3789):
- `local`: n="térmica local"; fix=0.05; km=0.0002; esc=2; d="Sem compressão e sem frete longo. A restrição não é econômica, é de localização: exige cliente térmico junto à fonte, com demanda compatível e contínua."
- `gnc`: n="comprimido em carreta"; fix=0.45; km=0.0035; esc=8; d="Compressão, cilindros, frete e retorno vazio da carreta. É a rota que mais degrada com distância, e a que mais depende de escala para diluir o investimento em compressão."
- `rede`: n="injeção em rede"; fix=0.35; km=0.0008; esc=12; d="Escala e fungibilidade física com o gás natural, ao custo de qualidade, ponto de conexão, tarifa de acesso e capacidade disponível na malha — quatro condições que não dependem do projeto."
- `frota`: n="veicular dedicado"; fix=0.55; km=0.003; esc=6; d="Desloca diesel e reduz emissões locais, mas exige frota adaptada, estação de abastecimento e contrato de prazo longo dos dois lados."


**Fonte dos números:** `null`. O p.disc declara que os parâmetros logísticos por rota "são ilustrativos de ordem de grandeza ... não são benchmark de mercado nem devem ser citados como tal". PCI fixo de 36 MJ/Nm³ no script (comentário "a 36 MJ/Nm3"), sem fonte.

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

**Divergências:** `div-m14-inst07-energia`.

## INST·08 — "Régua de crédito de descarbonização"

- **Onde:** Aula 07 (`aula-14-07`), subseção §07.4 "O preço, e por que ele é a grandeza mais volátil do módulo". Cabeçalho em L2254. Script L3853–L3954, comentário "RÉGUA DE CRÉDITO DE DESCARBONIZAÇÃO".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L2260):** "Escolha a rota certificada e ajuste volume comercializado, diferencial de intensidade de carbono e preço corrente. O instrumento devolve a ordem de grandeza de créditos emissíveis e a receita associada — e o veredito recusa tratar essa receita como firme sem elegibilidade, certificação vigente e titularidade contratada."
- **Aviso (p.disc):** "Fonte e data do preço: ordem de grandeza observada no primeiro semestre de 2026, a partir de análise de mercado sobre dados da bolsa registradora; consulta em 2 de agosto de 2026. Substitua pelo índice corrente antes de qualquer uso externo. As densidades energéticas por rota são valores de referência e devem ser conferidas contra a especificação aplicável. O resultado é teto conceitual: a quantidade regulatória efetiva depende de fatores de elegibilidade, arredondamentos e janelas de solicitação definidos pela agência."
- **Mecânica (kind sugerido `simulador`):** Anotação desta extração (taxonomia): 2 seleções + 3 campos (range) → 5 saídas + veredito. Nome "Régua" fora do enum.
- **Menções na seção (leitura desta extração):** L2242 invoca — "entrada editável do instrumento abaixo".
- **Catálogo:** "Régua de crédito de descarbonização" — "Rota certificada, volume, diferencial de intensidade de carbono e preço → ordem de grandeza de créditos emissíveis e receita associada; recusa tratá-la como firme sem elegibilidade, certificação e titularidade." (nome igual ao span.nm: true).

**Entradas numéricas (3).**

| Id | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Tipo | Linha |
|---|---|---|---|---|---|---|
| `cb-vol-n` | "Volume elegível comercializado" | "milhões de litros ou Nm³/ano" | 1–500, 1 | 100 | number + range gêmeo | L2281 |
| `cb-dic-n` | "Diferencial de intensidade de carbono" | "gCO₂e/MJ" | 5–95, 1 | 55 | number + range gêmeo | L2286 |
| `cb-prc-n` | "Preço corrente do crédito" | "R$/crédito · editável" | 5–250, 1 | 30 | number + range gêmeo | L2291 |

**Seleção `cb-rota`** "Rota certificada:" (L2266): "Etanol de cana 1G" [`e1g`] (ativo no markup), "Etanol de milho" [`milho`], "Biodiesel" [`bio`], "Biometano" [`bmet`].

**Seleção `cb-cert`** "Estado da certificação:" (L2274): "Certificado vigente" [`vigente`] (ativo no markup), "Em renovação" [`renov`], "Sem certificação" [`sem`].

**Leitura das entradas no script:** `var rk=segVal('cb-rota','data-r')||'e1g';` (L3876); `var ck=segVal('cb-cert','data-c')||'vigente';` (L3877); `var vol=numOf($id('cb-vol-n'),100,1,500);` (L3879); `var dic=numOf($id('cb-dic-n'),55,5,95);` (L3880); `var prc=numOf($id('cb-prc-n'),30,5,250);` (L3881).

**Saídas (5).** Valor no markup antes do script: "—".

| Id | Rótulo | Formatação no script (exata) | Cenário-padrão |
|---|---|---|---|
| `cb-en` | "Energia comercializada" | `$id('cb-en').textContent=fmt(energiaMJ/1e6,0)+' TJ';` (L3889) | "2.130 TJ" |
| `cb-ev` | "Emissões evitadas" | `$id('cb-ev').textContent=fmt(evit,0)+' t CO₂e';` (L3890) | "102.389 t CO₂e" |
| `cb-qt` | "Créditos · teto conceitual" | `$id('cb-qt').textContent=C1.f?fmt(qt,0)+' '+(rk==='bmet'?'unid.':'CBIO'):'0';` (L3891) | "102.389 CBIO" |
| `cb-rc` | "Receita associada" | `$id('cb-rc').textContent='R$ '+fmt(rec/1e6,2)+' mi';` (L3892) | "R$ 3,07 mi" |
| `cb-mg` | "Sobre a margem do produto" | `$id('cb-mg').textContent='R$ '+fmt(unit,3)+'/'+(rk==='bmet'?'Nm³':'L');` (L3893) | "R$ 0,031/L" |

**Fórmulas (código exato do script):**

```js
var energiaMJ=vol*1e6*R1.mj;   // L3883
var evit=energiaMJ*R1.ref*(dic/100)/1e6;   /* toneladas de CO2 equivalente */   // L3884
var qt=evit*C1.f;   // L3885
var rec=qt*prc;   // L3886
var unit=vol>0?(rec/(vol*1e6)):0;   // L3887
```

**Contêineres gerados por script:** `cb-vd` (veredito, L2306).

**Cenário-padrão** (script original executado em DOM simulado): entradas {"cb-vol-n":100,"cb-dic-n":55,"cb-prc-n":30}; seleções {"cb-rota":"e1g","cb-cert":"vigente"}; classe do veredito `verdict ok`.

Veredito no carregamento (`cb-vd`):

> "ORDEM DE GRANDEZA COERENTE: COMPLEMENTO DE RECEITA, NÃO PILAR. Rota: etanol de cana · 1G, contra gasolina A como referência fóssil, com diferencial de intensidade de 55%. Instrumento aplicável: CBIO. Rota madura no programa, com nota de eficiência calculada por unidade produtora a partir de produtividade agrícola, consumo de diesel na operação, fertilização e cobertura térmica por bagaço. Dois sinais cruzados: estado da certificação (certificado vigente) e efeito sobre a margem (R$ 0,031 por litro). O crédito adiciona R$ 0,031 por litro — relevante numa indústria de margem estreita, e insuficiente para sustentar sozinho qualquer decisão de investimento. É exatamente assim que ele deve entrar num caso base: fora dele, como sensibilidade declarada."

**Ramos do veredito (6).** O texto completo de cada ramo, com a concatenação exata, está em `ramos_do_veredito[].expressao_texto_verbatim`.

| Condição (literal) | Classe | Rótulo em negrito | Linhas |
|---|---|---|---|
| `if(ck==='sem')` | `per` | "SEM CERTIFICAÇÃO NÃO HÁ CRÉDITO — E ISSO NÃO É DETALHE DE PROCESSO." | L3901–L3908 |
| `else if(ck==='renov')` | `att` | "CERTIFICAÇÃO EM RENOVAÇÃO: RECEITA CONDICIONADA, NÃO FIRME." | L3908–L3915 |
| `else if(dic>=85)` | `att` | "DIFERENCIAL DE INTENSIDADE NO LIMITE SUPERIOR: VERIFIQUE A NOTA REAL." | L3915–L3922 |
| `else if(prc>=90)` | `att` | "PREÇO ACIMA DA FAIXA CORRENTE: O CENÁRIO DESCREVE OUTRO ANO." | L3922–L3930 |
| `else if(unit<0.05)` | `ok` | "ORDEM DE GRANDEZA COERENTE: COMPLEMENTO DE RECEITA, NÃO PILAR." | L3930–L3936 |
| `else` | `att` | "CONTRIBUIÇÃO UNITÁRIA ALTA: CONFIRME PREÇO, NOTA E TITULARIDADE." | L3936–L3944 |

Exemplo por ramo (execução real): 6 ramos alcançados, entradas em `exemplo_por_ramo`.

**Templates de texto fora das tabelas:** 4 trechos (L3879–L3881, L3889–L3893, L3895–L3899, L3945). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Dados do script (2), literais avaliados:**

**`R`** (L3856–L3869):
- `e1g`: n="etanol de cana · 1G"; u="milhões de litros"; us="mi L"; mj=21.3; ref=87.4; rn="gasolina A"; cr="CBIO"; d="Rota madura no programa, com nota de eficiência calculada por unidade produtora a partir de produtividade agrícola, consumo de diesel na operação, fertilização e cobertura térmica por bagaço."
- `milho`: n="etanol de milho"; u="milhões de litros"; us="mi L"; mj=21.3; ref=87.4; rn="gasolina A"; cr="CBIO"; d="A nota depende fortemente da fonte térmica contratada e do método de alocação atribuído aos coprodutos — duas variáveis que não existem na rota de cana, e que produzem dispersão grande entre plantas da mesma rota."
- `bio`: n="biodiesel"; u="milhões de litros"; us="mi L"; mj=32.6; ref=86.4; rn="diesel A"; cr="CBIO"; d="A nota depende da matéria-prima: soja, sebo, óleo residual e outras oleaginosas entram no cálculo com trajetórias distintas, e a mesma planta pode ter notas diferentes conforme a cesta de insumos do período."
- `bmet`: n="biometano"; u="milhões de Nm³"; us="mi Nm³"; mj=36; ref=77; rn="gás natural fóssil"; cr="CBIO e CGOB"; d="Rota com dois instrumentos possíveis sobre o mesmo lastro: o crédito de descarbonização e a garantia de origem. A norma admite emissão concomitante sobre a mesma nota fiscal, desde que o registro declare expressamente a concomitância — o que transforma a pergunta de auditoria de "houve dupla contagem?" em "a concomitância foi declarada, e o comprador sabe o que está comprando?"."

**`C`** (L3870–L3874):
- `vigente`: n="certificado vigente"; f=1
- `renov`: n="em renovação"; f=1
- `sem`: n="sem certificação"; f=0


**Fonte dos números:** "p.disc: "Fonte e data do preço: ordem de grandeza observada no primeiro semestre de 2026, a partir de análise de mercado sobre dados da bolsa registradora; consulta em 2 de agosto de 2026." § Ref item 29 (B3) diz que é a referência que deve substituir o valor padrão.". Só o preço tem fonte declarada. Densidades (mj) e intensidades fósseis de referência (ref) são "valores de referência" sem documento citado.

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

**Divergências:** `div-m14-inst08-unidade`, `div-m14-inst08-estoque`, `div-m14-inst08-renovacao`.

## INST·09 — "Classificador de insumo — rota, produto, órgão e concorrente"

- **Onde:** Aula 08 (`aula-14-08`), subseção §08.1 "O classificador: dado um insumo, o que sai e o que deixa de sair". Cabeçalho em L2422. Script L3956–L4127, comentário "CLASSIFICADOR DE DESTINO DE INSUMO".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L2428):** "Produto cartesiano completo: cada insumo cruzado com cada destino tecnicamente possível. Escolha o insumo e depois o destino; o painel devolve rota, produto, órgão competente, onde entra na matriz e — a informação que quase nunca acompanha o número — o que deixou de ser feito com aquele mesmo insumo."
- **Aviso (p.disc):** "Nem todo destino existe para todo insumo — o instrumento diz explicitamente quando a combinação não é tecnicamente aplicável, em vez de devolver um painel vazio. Ausência de resposta é uma resposta ruim; "esta rota não se aplica a este insumo, e a razão é esta" é uma resposta boa."
- **Mecânica (kind sugerido `explorador`):** Anotação desta extração (taxonomia): 2 seleções (5 insumos × 7 destinos) → 4 readouts textuais + veredito textual. Zero campo numérico. Nome "Classificador" fora do enum.
- **Menções na seção (leitura desta extração):** L2344 invoca — "o instrumento seguinte" às seis fichas de rota é o INST·09 (§08.1); L2456 outro_instrumento — a frase apresenta o INST·10 ("instrumento assinatura").
- **Catálogo:** "Classificador de insumo" — "Produto cartesiano insumo × destino → rota, produto, órgão competente, onde entra na matriz, e o que deixou de ser feito com aquele insumo." (nome igual ao span.nm: false).

**Seleção `cl-ins`** "Insumo de partida:" (L2434): "Cana-de-açúcar" [`cana`] (ativo no markup), "Bagaço e palha" [`bagaco`], "Milho" [`milho`], "Óleo e gordura" [`oleo`], "Resíduo orgânico" [`resid`].

**Contêineres gerados por script:** `cl-dest` (painel/desenho gerado pelo script, L2443); `cl-out` (painel/desenho gerado pelo script, L2445); `cl-vd` (veredito, L2446).

**Cenário-padrão** (script original executado em DOM simulado): entradas {}; seleções {"cl-ins":"cana"}; classe do veredito `verdict ok`.

Veredito no carregamento (`cl-vd`):

> "DESTINO CONSOLIDADO. Destino central e histórico da cana. A unidade com flexibilidade de mix decide entre açúcar e etanol dentro de uma faixa, e a decisão é tomada safra a safra, às vezes semana a semana. Destino deslocado: Etanol, pelo mesmo ATR. Toda vez que esta rota cresce, aquele destino recua na mesma unidade de insumo. Um crescimento de produção de açúcar pode ser apenas deslocamento de mix dentro da mesma moagem — e não expansão de cana. Verifique a moagem antes de ler o volume de produto."

**Ramos:** nenhum. Sem cadeia de ramos: o texto de leitura vem das tabelas de dados (dados_do_script) conforme a seleção.

**Templates de texto fora das tabelas:** 8 trechos (L4092, L4096, L4098–L4103, L4105, L4108–L4109, L4113, L4115, L4121). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Dados do script (3), literais avaliados:**

**`DEST`** (L3959–L3967):
- [0] k="acucar"; n="Açúcar"
- [1] k="etanol"; n="Etanol"
- [2] k="eletr"; n="Vapor e eletricidade"
- [3] k="bmet"; n="Biometano"
- [4] k="diesel"; n="Biodiesel e diesel renovável"
- [5] k="racao"; n="Ração e alimento"
- [6] k="mat"; n="Uso material"

**`M`** (L3968–L4084):
- `cana`: n="cana-de-açúcar"; acucar={s="sim"; c="Etanol, pelo mesmo ATR"; d="Destino central e histórico da cana. A unidade com flexibilidade de mix decide entre açúcar e etanol dentro de uma faixa, e a decisão é tomada safra a safra, às vezes semana a semana."; q="Um crescimento de produção de açúcar pode ser apenas deslocamento de mix dentro da mesma moagem — e não expansão de cana. Verifique a moagem antes de ler o volume de produto."}; etanol={s="sim"; c="Açúcar, pelo mesmo ATR"; d="Destino alternativo do mesmo ATR, dividido ainda entre anidro e hidratado — dois produtos com demandas de natureza distinta."; q="É o caso que a Lente de Arbitragem existe para tratar: a mesma tonelada, dois produtos, uma decisão. Volume de etanol crescendo com moagem estável significa açúcar caindo."}; eletr={s="indireto"; c="—"; d="A cana como colmo não vai para a caldeira. Quem vai é o bagaço, depois da extração do caldo, e a palha, quando recolhida."; q="A combinação existe fisicamente, mas o insumo correto para classificar este destino é bagaço e palha, não cana. Trocar o insumo no seletor muda completamente o painel — e é essa troca que revela a cascata."}; bmet={s="indireto"; c="Fertirrigação e adubação"; d="A rota real parte de vinhaça e torta de filtro, resíduos do processamento, não da cana em si."; q="A vinhaça já tem uso consolidado em fertirrigação. Direcioná-la à biodigestão não cria valor do nada: desloca um uso existente, e a comparação precisa incluir o custo do fertilizante que deixará de ser substituído."}; diesel={s="nao"; c="—"; d="Combinação não aplicável em escala comercial: a cana não é matéria-prima de biodiesel nem de diesel renovável."; q="Rotas de conversão de açúcares em hidrocarbonetos existem em desenvolvimento, e nenhuma delas descreve o parque instalado brasileiro hoje. Se aparecer numa apresentação, o pedido correto é a régua de maturidade: memorando, planta-piloto ou planta com contrato?"}; racao={s="marginal"; c="Moagem"; d="Cana forrageira e ponta de cana são usadas como volumoso na pecuária, em circuito local, e não na cadeia industrial sucroenergética."; q="É um uso real e de escala pequena diante da moagem industrial. Não confunda os dois circuitos ao somar área plantada: nem toda cana plantada entra em usina."}; mat={s="marginal"; c="Etanol e açúcar"; d="Química renovável a partir de açúcares — polímeros, ácidos e intermediários — existe em escala comercial limitada e cresce a partir do mesmo ATR."; q="Toda expansão desta rota disputa o mesmo ATR que já tem dois destinos consolidados. A pergunta é sempre a mesma: a que preço este destino ganha do açúcar e do etanol?"}
- `bagaco`: n="bagaço e palha"; acucar={s="nao"; c="—"; d="Combinação não aplicável: o açúcar sai do caldo, e o bagaço é justamente o que sobra depois da extração."; q="A ordem física importa. Bagaço é resíduo de processo, e nenhum processo o converte de volta em sacarose."}; etanol={s="sim"; c="Vapor, eletricidade e venda de biomassa"; d="É a rota de segunda geração: hidrólise das frações celulósicas para produzir etanol a partir da fibra."; q="Aqui está o erro mais comum do bloco inteiro — dizer que a 2G aproveita resíduo que seria descartado. Não seria: o bagaço já é o combustível da unidade. Cada tonelada hidrolisada é vapor ou eletricidade que deixa de existir."}; eletr={s="sim"; c="Etanol de 2ª geração e venda de biomassa"; d="Destino consolidado e majoritário: o bagaço responde pela maior parte da bioeletricidade brasileira, com o licor preto da celulose em segundo lugar."; q="É o destino que sustenta a complementaridade sazonal — a safra do Centro-Sul coincide com o período seco, quando a hidrelétrica recua. Verifique se a energia é exportada ou consumida internamente antes de somá-la à matriz."}; bmet={s="limitado"; c="Vapor e eletricidade"; d="Material lignocelulósico é pouco favorável à digestão anaeróbia convencional: a lignina resiste, e o rendimento em metano é baixo diante do de resíduos ricos em matéria orgânica facilmente degradável."; q="Quando um projeto de biometano cita bagaço como substrato principal, o pedido correto é o ensaio de potencial bioquímico de metano do substrato específico — não a média da literatura."}; diesel={s="nao"; c="—"; d="Combinação não aplicável em escala comercial no parque brasileiro atual."; q="Rotas termoquímicas de conversão de biomassa em hidrocarbonetos existem em desenvolvimento. Aplique a régua de maturidade antes de somá-las a qualquer tabela de capacidade."}; racao={s="marginal"; c="Vapor e eletricidade"; d="Bagaço hidrolisado ou tratado é usado como volumoso em confinamento, em escala local e sazonal."; q="Uso real, mercado pequeno e dependente de distância. Nunca é a variável que decide o destino do bagaço de uma unidade de porte industrial."}; mat={s="limitado"; c="Vapor e eletricidade"; d="Painéis, papel, embalagem moldada e extração de lignina para uso químico. Existe, cresce, e ainda é pequeno diante do volume gerado."; q="Cada tonelada desviada para uso material também sai do circuito térmico. O balanço energético da unidade precisa fechar antes de a receita material entrar na conta."}
- `milho`: n="milho"; acucar={s="nao"; c="—"; d="Combinação não aplicável no sentido próprio do termo: o milho produz adoçantes de amido, não açúcar de cana."; q="A distinção não é vocabular. São cadeias industriais distintas, com plantas, especificações e mercados distintos."}; etanol={s="sim"; c="Ração, exportação e alimentação humana"; d="Rota em expansão rápida no Centro-Oeste, sobretudo a partir do grão de segunda safra, com operação quase contínua ao longo do ano."; q="Diferente da cana, aqui o concorrente não está dentro da usina — é uma cadeia inteira. E a rota devolve parte do grão ao mercado de ração como DDGS, o que significa que o deslocamento líquido é menor que o volume bruto processado."}; eletr={s="nao"; c="—"; d="Combinação não aplicável: o grão não é o combustível da planta. A rota de milho consome energia térmica de fonte externa contratada — biomassa comprada, cavaco ou gás."; q="É a assimetria estrutural entre as duas rotas de etanol, e a origem do erro de dizer que "a usina é autossuficiente em energia" sem declarar a rota. Na de milho, a fonte térmica é linha de custo e exposição a preço."}; bmet={s="limitado"; c="Ração"; d="A rota parte da vinhaça de milho e de resíduos do processo, não do grão, e depende da escala e da continuidade do efluente."; q="O substrato tem sazonalidade menor que o da cana, por a planta operar quase o ano inteiro — o que muda o dimensionamento do biodigestor."}; diesel={s="sim"; c="Óleo alimentício e ração"; d="O óleo de milho extraído no processo é matéria-prima de biodiesel — e é o ponto onde as duas cadeias deste módulo se cruzam dentro da mesma planta."; q="Coproduto com mercado alternativo real. Ele só vira biodiesel quando o preço do biodiesel ganha do preço do óleo alimentício — mais uma arbitragem, dentro de uma rota que já é feita de arbitragens."}; racao={s="sim"; c="Etanol e exportação"; d="Destino histórico e majoritário do milho brasileiro, e principal concorrente da rota de etanol — que devolve ao mesmo mercado o DDGS."; q="É a combinação que impede de ler o crescimento do etanol de milho como ganho líquido do agro. Parte do grão volta como ração; a pergunta correta é qual o deslocamento líquido, não o volume processado."}; mat={s="limitado"; c="Ração e etanol"; d="Amido industrial, adoçantes e insumos para a indústria química e de papel."; q="Cadeia estabelecida, com escala própria e independente do ciclo de combustíveis."}
- `oleo`: n="óleo e gordura"; acucar={s="nao"; c="—"; d="Combinação não aplicável: não há rota de conversão de material graxo em sacarose."; q="Se aparecer, é erro de classificação de insumo, não hipótese tecnológica."}; etanol={s="nao"; c="—"; d="Combinação não aplicável: etanol vem de açúcares ou de amido, não de material graxo."; q="A confusão costuma vir de tratar "biocombustível" como categoria única. Não é: são moléculas diferentes, com insumos, plantas e mercados diferentes."}; eletr={s="marginal"; c="Biodiesel e oleoquímica"; d="Queima direta em motogerador é possível e economicamente inferior à conversão em biodiesel na quase totalidade dos casos."; q="Quando aparece, costuma ser solução para óleo residual sem logística de coleta estruturada, não escolha de destino."}; bmet={s="limitado"; c="Biodiesel e ração"; d="Gordura residual entra como cossubstrato em biodigestão, elevando o rendimento de metano — em proporção limitada, sob pena de inibir o processo."; q="É cossubstrato, não substrato principal. Projetos que dimensionam o biodigestor pela gordura disponível costumam descobrir o limite de inibição depois da partida."}; diesel={s="sim"; c="Óleo alimentício, ração e oleoquímica"; d="Destino central: soja, sebo bovino, óleo residual e outras oleaginosas, cada um com trajetória própria de intensidade de carbono e disponibilidade."; q="Nesta rota o concorrente é sempre alimentar ou industrial. É por isso que o teor obrigatório de mistura no diesel move preço em cadeias que nada têm a ver com energia — a demanda derivada é a Lente de Política operando sobre o mercado de alimentos."}; racao={s="sim"; c="Biodiesel e oleoquímica"; d="Gordura e farelo são destinos consolidados, com mercado, especificação e preço próprios."; q="Concorrência direta e permanente. Elevar o teor obrigatório de mistura não cria oleaginosa — desloca a existente."}; mat={s="sim"; c="Biodiesel, ração e alimento"; d="Oleoquímica: tensoativos, lubrificantes, cosméticos e insumos industriais, com valor unitário frequentemente superior ao energético."; q="É o destino que mais frequentemente ganha do energético em valor por tonelada. Um projeto de biodiesel que assume disponibilidade plena de matéria-prima sem verificar a demanda oleoquímica local está subestimando o próprio custo de insumo."}
- `resid`: n="resíduo orgânico"; acucar={s="nao"; c="—"; d="Combinação não aplicável."; q="Sem rota física. Classificação incorreta de insumo."}; etanol={s="nao"; c="—"; d="Combinação não aplicável em escala comercial no Brasil hoje."; q="Rotas de resíduo sólido urbano a etanol existem em desenvolvimento. Régua de maturidade antes de qualquer tabela."}; eletr={s="sim"; c="Biometano"; d="Biogás queimado em motogerador — rota de menor investimento e de menor exigência de qualidade do gás, porque dispensa a purificação a especificação de biometano."; q="É a alternativa que todo projeto de biometano precisa vencer no caso base. Gerar eletricidade é mais simples; o biometano só ganha quando existe cliente térmico, veicular ou rede acessível."}; bmet={s="sim"; c="Eletricidade a partir de biogás"; d="Destino central da rota: purificação do biogás a especificação de gás natural, com marco regulatório consolidado entre 2025 e 2026 e primeiro agente certificador de origem credenciado em abril de 2026."; q="A decisão não é técnica, é de destino de entrega. A régua do INST·07 existe para isso: rota térmica local, comprimido em carreta, injeção em rede ou veicular dedicado mudam mais o resultado que o preço do gás."}; diesel={s="nao"; c="—"; d="Combinação não aplicável por rota direta."; q="A exceção é a fração graxa separada do resíduo, que pertence à classificação de óleo e gordura, não à de resíduo orgânico genérico."}; racao={s="nao"; c="—"; d="Combinação não aplicável: restrição sanitária, não econômica."; q="É a única linha deste instrumento em que a barreira é regulatória de saúde animal, e não de preço, escala ou logística."}; mat={s="sim"; c="Biometano e eletricidade"; d="Compostagem e digestato como fertilizante orgânico — e, no caso da biodigestão, o digestato é coproduto, não alternativa."; q="Aqui os dois destinos convivem: a mesma tonelada gera biometano e devolve digestato. É a única linha do classificador em que a concorrência não é excludente — e por isso mesmo a que mais exige verificar se a receita de fertilizante já está contratada ou é apenas suposta."}

**`S`** (L4085–L4091):
- `sim`: r="DESTINO CONSOLIDADO"; c="ok"
- `indireto`: r="APLICÁVEL POR ROTA INDIRETA — O INSUMO CORRETO É OUTRO"; c="att"
- `limitado`: r="TECNICAMENTE POSSÍVEL, LIMITADO EM ESCALA"; c="att"
- `marginal`: r="USO REAL, MERCADO MARGINAL"; c="att"
- `nao`: r="COMBINAÇÃO NÃO APLICÁVEL"; c="per"


**Fonte dos números:** `null`. Tabela qualitativa sem fonte. Uma entrada cita "primeiro agente certificador de origem credenciado em abril de 2026".

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

**Divergências:** `div-m14-inst09-campos-prometidos`.

## INST·10 — "Verificador de base temporal e rota — instrumento assinatura"

- **Onde:** Aula 08 (`aula-14-08`), subseção §08.2 "O verificador: enunciados verdadeiros e insuficientes". Cabeçalho em L2462. Script L4129–L4229, comentário "VERIFICADOR DE BASE TEMPORAL E ROTA".
- **Pergunta:** `null`. O instrumento não traz pergunta própria no markup. A tarefa declarada é o p.inst-intro (abaixo). Pergunta de previsão seria da camada Alexandria (P19).
- **Tarefa declarada (p.inst-intro, L2468):** "Doze enunciados. Escolha um, decida qual o defeito, e confira. O painel devolve o defeito dominante, o que exatamente falta, a pergunta que você faria ao interlocutor, e a forma corrigida do enunciado."
- **Aviso (p.disc):** "Os doze enunciados são construídos a partir de dados reais verificados em 2 de agosto de 2026, e são deliberadamente apresentados na forma em que circulariam numa conversa ou numa apresentação. Nenhum deles é uma armadilha retórica: são exatamente as frases que se ouve, e o exercício é reconhecer o que falta antes de responder a elas."
- **Mecânica (kind sugerido `explorador`):** Anotação desta extração (taxonomia): filtro por tipo + seleção de 1 de 12 enunciados → painel textual. A prosa pede "decida antes de clicar", mas não há campo para o learner produzir a resposta: não é `reconstrutor` (que exige produção antes da correção). Nome "Verificador" fora do enum; decisão de kind fica para a FOUNDRY.
- **Menções na seção (leitura desta extração):** L2344 invoca — "confira contra o que o verificador devolve"; L2456 invoca — "Este é o instrumento assinatura do módulo".
- **Catálogo:** "Verificador de base temporal e rota (instrumento assinatura)" — "Doze enunciados: defeito dominante, o que falta, a pergunta a fazer, e a forma corrigida do enunciado." (nome igual ao span.nm: false).

**Seleção `vf-tipo`** "Filtrar por tipo de defeito:" (L2473): "Todos" [`todos`] (ativo no markup), "Base temporal" [`base`], "Rota não declarada" [`rota`], "Grandeza confundida" [`grand`], "Concorrente omitido" [`conc`].

**Contêineres gerados por script:** `vf-chips` (painel/desenho gerado pelo script, L2481); `vf-panel` (painel/desenho gerado pelo script, L2482).

**Cenário-padrão** (script original executado em DOM simulado): entradas {}; seleções {"vf-tipo":"todos"}.

**Ramos:** nenhum. Sem cadeia de ramos: o texto de leitura vem das tabelas de dados (dados_do_script) conforme a seleção.

**Templates de texto fora das tabelas:** 5 trechos (L4195, L4197, L4202–L4213, L4217–L4218, L4223). Linhas do bloco que montam texto fora das tabelas de dados e da cadeia de ramos (prefixos compartilhados do veredito como `var b=`/`var s=`, rótulos de painel gerados por pinta(), formatos de readout). Verbatim, com linha.

**Dados do script (2), literais avaliados:**

**`E`** (L4132–L4193):
- [0] k="e1"; t="base"; n="“A gasolina brasileira tem 30% de etanol anidro.”"; y="base temporal"; df="Base temporal vencida — por vinte e quatro horas."; fa="A norma e a data. O teor de 30% vigorou até 31 de julho de 2026. Desde 1º de agosto de 2026 o teor da gasolina C comum é de 32%, por resolução do conselho publicada em edição extra do Diário Oficial em 30 de julho, aprovada na reunião de 14 de julho."; pg="“Isso é da resolução de qual ano? Porque houve resolução número 9 em 2025 fixando E30, e resolução número 9 em 2026 fixando E32.”"; co="“Desde 1º de agosto de 2026, a gasolina C comum tem 32% de etanol anidro, em caráter excepcional e temporário por 180 dias prorrogáveis uma vez. A premium permanece em 25%.”"
- [1] k="e2"; t="base"; n="“O Brasil produz 40,7 bilhões de litros de etanol por ano.”"; y="base temporal"; df="Mistura de base de safra com base de ano-calendário."; fa="Declarar qual das duas bases. Os 40,69 bilhões de litros são a estimativa de safra 2026/27 do primeiro levantamento de abril de 2026. A produção de ano-calendário 2025 apurada foi de 35,94 bilhões de litros — quase cinco bilhões de diferença entre dois números igualmente corretos."; pg="“Esse número é de safra ou de ano-calendário? E é levantamento estimado ou apuração fechada?”"; co="“A estimativa para a safra 2026/27 é de 40,69 bilhões de litros; a produção apurada no ano-calendário de 2025 foi de 35,94 bilhões.”"
- [2] k="e3"; t="base"; n="“O biodiesel está em B16 desde março de 2026.”"; y="estado de política"; df="Prazo legal vencido tratado como percentual em vigor."; fa="A distinção entre o que a lei calendarizou e o que a resolução implementou. A Lei nº 14.993/2024 apontava março de 2026 para o B16; a data passou e o percentual não entrou em vigor. O teor vigente segue sendo B15, desde 1º de agosto de 2025."; pg="“A lei previa, mas o conselho deliberou? Qual resolução colocou o B16 em vigor?”"; co="“A lei apontava B16 para março de 2026, mas o percentual não foi implementado. O teor em vigor é B15, com teto legal de 25% e trajetória apontando para 20% até março de 2030.”"
- [3] k="e4"; t="rota"; n="“Usina de etanol é autossuficiente em energia — ela queima o próprio bagaço.”"; y="rota não declarada"; df="Generalização de uma rota para todas as rotas."; fa="Declarar a rota. A afirmação descreve a rota de cana, em que o bagaço fornece o vapor de processo e ainda gera excedente exportável. A rota de milho não tem bagaço: depende de fonte térmica externa contratada, que é linha de custo e exposição a preço."; pg="“Estamos falando de qual rota? Porque em milho a fonte térmica é comprada, e o preço dela entra no custo por litro.”"; co="“Usina de cana é autossuficiente em energia térmica e frequentemente exportadora de eletricidade; usina de milho depende de fonte térmica contratada.”"
- [4] k="e5"; t="rota"; n="“O etanol tem intensidade de carbono de tantos gramas por megajoule.”"; y="rota não declarada"; df="Atributo de unidade produtora tratado como atributo de combustível."; fa="A unidade a que o número se refere. No programa de descarbonização, a nota de eficiência é calculada por unidade produtora certificada, a partir da produtividade agrícola, do consumo de diesel, da fertilização e da fonte térmica daquela planta. Duas usinas da mesma rota, na mesma safra, têm notas diferentes."; pg="“Essa nota é da unidade específica ou é média da rota? Porque se for média, não serve para precificar o crédito de nenhuma planta.”"; co="“A unidade tal, certificada na safra tal, tem nota de eficiência energético-ambiental de tantos gramas por megajoule.”"
- [5] k="e6"; t="rota"; n="“Essa nova planta de etanol vai adicionar excedente elétrico ao sistema.”"; y="rota não declarada"; df="Atribuição de um efeito de uma rota a um projeto de outra rota."; fa="A rota da planta e o desenho da caldeira. Planta de milho consome energia térmica de fonte externa e não exporta eletricidade a partir do próprio insumo. Mesmo em cana, exportar excedente depende de caldeira de alta pressão, de eficiência no uso de vapor e de conexão sem restrição."; pg="“É planta de cana ou de milho? E, se for cana, qual a pressão da caldeira e qual o autoconsumo previsto?”"; co="“Planta de cana com caldeira de alta pressão e autoconsumo de tantos por cento tende a exportar tantos gigawatts-hora dentro da safra.”"
- [6] k="e7"; t="grand"; n="“A usina tem 80 MW instalados, então gera cerca de 700 GWh por ano.”"; y="grandeza confundida"; df="Potência instalada multiplicada por 8.760 horas numa fonte sazonal."; fa="Os dias efetivos de safra, a disponibilidade e o autoconsumo. Uma unidade que mói cerca de 210 dias opera aproximadamente 5.040 horas, não 8.760 — e boa parte da geração é absorvida internamente como vapor de processo, antes de qualquer exportação."; pg="“Quantos dias de safra, qual a disponibilidade e quanto é autoconsumo? Porque a diferença entre gerado e exportado costuma ser metade.”"; co="“80 MW instalados, cerca de 210 dias de safra e autoconsumo de 55% resultam em algo próximo de 350 GWh gerados e 160 GWh exportados.”"
- [7] k="e8"; t="grand"; n="“As vendas de hidratado caíram 5,9%, logo a produção caiu na mesma proporção.”"; y="grandeza confundida"; df="Venda tratada como produção."; fa="A distinção entre as duas séries. A queda de 5,9% no hidratado em 2025 é de vendas. No mesmo ano, a produção de anidro subiu 3,1% — puxada pelo teor obrigatório na gasolina, que é demanda derivada de política, não de escolha do consumidor no posto."; pg="“Esse número é de vendas, de produção ou de moagem? E é do total ou só do hidratado?”"; co="“As vendas de hidratado caíram 5,9% em 2025, enquanto a produção de anidro cresceu 3,1% no mesmo período.”"
- [8] k="e9"; t="grand"; n="“O projeto de biometano tem margem de R$ 1,20 por metro cúbico. É viável.”"; y="grandeza confundida"; df="Margem unitária tratada como viabilidade de projeto."; fa="A escala e a continuidade do substrato. Margem por metro cúbico não dilui investimento em compressão, medição e infraestrutura de entrega. Um projeto com margem unitária excelente e volume abaixo da referência da rota é o modo mais comum de um caso de biometano falhar."; pg="“Qual o volume anual, e o substrato está contratado e é contínuo ao longo do ano?”"; co="“O projeto tem margem de R$ 1,20 por metro cúbico sobre volume de tantos milhões de metros cúbicos por ano, com substrato contratado por tantos anos.”"
- [9] k="e10"; t="conc"; n="“A produção de etanol de cana cresceu; o setor está em expansão.”"; y="concorrente omitido"; df="Crescimento de produto lido como crescimento de insumo."; fa="A moagem e o mix. A mesma tonelada de cana produz açúcar ou etanol dentro de uma faixa de alternância. Crescimento de etanol com moagem estável significa açúcar recuando — deslocamento de mix, não expansão. No primeiro levantamento de 2026/27, o etanol cresce 8,5% e o açúcar recua 0,5%."; pg="“A moagem cresceu quanto? Porque se ela ficou estável, o que cresceu foi a fatia, não o bolo.”"; co="“Com moagem estimada em alta de 5,3%, o etanol cresce 8,5% e o açúcar recua 0,5% — parte do crescimento é expansão e parte é deslocamento de mix.”"
- [10] k="e11"; t="conc"; n="“O etanol de milho cresceu 12%; é ganho líquido para o agro.”"; y="concorrente omitido"; df="Volume processado tratado como deslocamento líquido."; fa="O destino alternativo do grão e o retorno do coproduto. O milho processado sairia para ração, exportação ou alimentação humana; e a rota devolve ao mercado de ração o DDGS. O deslocamento líquido é menor que o volume processado, e a diferença depende da alocação atribuída ao coproduto."; pg="“Qual o volume de DDGS gerado, e ele encontra confinamento a que distância? Porque DDGS sem comprador próximo é custo de disposição, não receita.”"; co="“A rota processou tantos milhões de toneladas de milho e devolveu tantas ao mercado de ração como DDGS; o deslocamento líquido foi de tanto.”"
- [11] k="e12"; t="conc"; n="“A segunda geração aproveita resíduo que hoje é descartado.”"; y="concorrente omitido"; df="Insumo com uso consolidado descrito como resíduo sem destino."; fa="O uso atual da fibra. O bagaço não é descartado: é o combustível que gera o vapor de processo e a bioeletricidade que responde por parte relevante da matriz elétrica brasileira. Cada tonelada desviada para hidrólise é vapor ou eletricidade que deixa de existir."; pg="“De onde vem a fibra? Sai da caldeira, do estoque de palha, ou de recolhimento adicional no campo? Porque as três têm custos de oportunidade diferentes.”"; co="“A segunda geração converte fibra que hoje tem destino energético dentro da unidade; o ganho líquido depende de comparar o valor do etanol adicional com o da energia deslocada.”"

**`LB`** (L4194–L4194):
- `base`: "Base temporal"
- `rota`: "Rota não declarada"
- `grand`: "Grandeza confundida"
- `conc`: "Concorrente omitido"


**Fonte dos números:** "p.disc: "Os doze enunciados são construídos a partir de dados reais verificados em 2 de agosto de 2026"". Nenhum enunciado cita documento; os números (40,69; 35,94; 5,9%; 3,1%; 8,5%; 5,3%) coincidem com a prosa das aulas e com o § Ref (Conab, ANP), sem vínculo declarado.

**Tolerâncias:** `null`. A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Código:** não portado (MODULO_14_INSTRUMENTOS: [] (vazio); instruments_nas_aulas: 8 de 8 aulas com instruments: []; ids_da_fonte_em_calculators: []; titulo_em_codigo: false).

**Divergências:** `div-m14-inst10-e3`.

## Divergências (11)

### div-m14-inst07-energia — Saída "Energia entregue" 1.000 vezes menor (severidade alta)

Classe: fonte × fonte (defeito do script) · instrumento INST·07.

- **Leitura A** (script INST·07): "var en=vol*36/1000; /* TJ, a 36 MJ/Nm3 */ → com 15 milhões de Nm³: 1 TJ/ano"
- **Leitura B** (Ex 08): "8 milhões de Nm³ × 36 MJ/Nm³ = 288 milhões de MJ = 288 TJ (logo 15 milhões → 540 TJ)"

Nota: vol está em milhões de Nm³; vol×36 já dá TJ. A divisão extra por 1000 faz o painel mostrar "1 TJ/ano" no padrão. Sinalizado, não corrigido (§10).
Decisão: `null` (não resolvido).

### div-m14-inst08-unidade — Diferencial de intensidade: gCO₂e/MJ no rótulo, % no cálculo (severidade alta)

Classe: fonte × fonte · instrumento INST·08.

- **Leitura A** (markup (rótulo do campo)): "Diferencial de intensidade de carbono · gCO₂e/MJ"
- **Leitura B** (script): "var evit=energiaMJ*R1.ref*(dic/100)/1e6; ... diferencial de intensidade de '+fmt(dic,0)+'%"
- **Leitura C** (Ex 13): "100.000.000 × 21,1 × 55 = 116,05 bilhões de gramas (55 usado como gCO₂e/MJ, 21,1 MJ/L)"
- **Leitura D** (Aula 07, div.fx (L2191)): "Estimativa conceitual — não é a fórmula regulatória: Créditos ≈ Volume × Densidade energética × (IC fóssil − IC da rota) ÷ 10⁶"

Nota: No padrão (100 mi L, 55, etanol de cana 1G com mj 21.3 e ref 87.4) o painel mostra 102.389 t CO₂e; o Ex 13 dá cerca de 116.050 t para os mesmos 100 mi L e 55. Duas divergências somadas: unidade do diferencial e densidade (21,3 × 21,1 MJ/L). A fórmula exibida na própria Aula 07 usa a diferença de intensidades (IC fóssil − IC da rota), que é grandeza em gCO₂e/MJ, como o Ex 13; o script usa ref × dic%.
Decisão: `null` (não resolvido).

### div-m14-inst08-estoque — Tamanho do estoque de créditos (severidade baixa)

Classe: fonte × fonte · instrumento INST·08.

- **Leitura A** (script INST·08 (ramo prc>=90)): "estoque acumulado da ordem de dezenas de milhões de unidades no início do ano"
- **Leitura B** (Aula 07 §07.4): "cerca de 19,5 milhões de créditos em estoque"
- **Leitura C** (§Voz 6:00–7:00): "estoque estrutural de quase vinte milhões de créditos"

Nota: "Dezenas de milhões" não descreve 19,5 milhões. Registrado, não resolvido.
Decisão: `null` (não resolvido).

### div-m14-inst08-renovacao — "Em renovação" calcula igual a "vigente" (severidade baixa)

Classe: comportamento declarado · instrumento INST·08.

- **Leitura A** (script): "renov:{n:'em renovação',f:1}"
- **Leitura B** (veredito do ramo renov): "Os números do painel descrevem o que existiria com a certificação vigente."

Nota: Coerente com o texto do ramo; registrado para quem portar (f=1 não é erro).
Decisão: `null` (não resolvido).

### div-m14-inst05-vencido-gasolina — Referência do estado "prazo vencido" para a gasolina (severidade média)

Classe: fonte × fonte · instrumento INST·05.

- **Leitura A** (script BASES.gasolina): "venc:30"
- **Leitura B** (script BASES.gasolina.not): "E30 foi o teor vigente até 31 de julho de 2026."
- **Leitura C** (script EST.vencido.d): "Existe no texto da lei, a data passou, e o percentual não entrou em vigor. É o estado que só aparece para quem confere a resolução depois de ler a lei."

Nota: Para o diesel, 16 é de fato prazo legal vencido não implementado (B16). Para a gasolina, 30 é teor que vigorou e foi substituído, não prazo vencido. O veredito do estado "vencido" mostra 30% como referência.
Decisão: `null` (não resolvido).

### div-m14-inst05-troca-base — Trocar a base não troca o percentual (severidade baixa)

Classe: comportamento do script · instrumento INST·05.

- **Leitura A** (script): "segBind('dm-base',calc) — os campos dm-pct/dm-cmp mantêm 15 e 16"
- **Leitura B** (resultado): "gasolina + "Em vigor" no padrão cai no ramo "ESTADO INCOERENTE" (15 ≠ 32)"

Nota: Ver varredura_de_selecoes_no_padrao.
Decisão: `null` (não resolvido).

### div-m14-inst09-campos-prometidos — Intro promete órgão competente e matriz; o painel não mostra (severidade média)

Classe: fonte × fonte · instrumento INST·09.

- **Leitura A** (p.inst-intro): "o painel devolve rota, produto, órgão competente, onde entra na matriz e — a informação que quase nunca acompanha o número — o que deixou de ser feito"
- **Leitura B** (script (tabela M e pinta())): "cada combinação só tem s, c, d, q; o painel mostra Insumo, Destino, Estado da combinação e O que deixa de ser feito"

Nota: Órgão e matriz existem no INST·01 (ROTAS.org / ROTAS.matriz), não no INST·09. Título do markup ("Classificador de insumo — rota, produto, órgão e concorrente") × comentário do script ("CLASSIFICADOR DE DESTINO DE INSUMO").
Decisão: `null` (não resolvido).

### div-m14-inst10-e3 — Enunciado e3: rótulo "estado de política", categoria "base" (severidade média)

Classe: fonte × fonte · instrumento INST·10.

- **Leitura A** (script E[2].y): "estado de política"
- **Leitura B** (script E[2].t → LB): "Base temporal"

Nota: O chip mostra "estado de política", o painel mostra "Categoria: Base temporal", e o filtro "Base temporal" o lista. "Estado de política" não é um dos quatro tipos do filtro.
Decisão: `null` (não resolvido).

### div-m14-inst04-dois-on — Markup com duas dimensões ativas (severidade baixa)

Classe: markup × script · instrumento INST·04.

- **Leitura A** (markup): "rt-dim: "Insumo" .on e rt-dim2: "Intensidade de carbono" .on"
- **Leitura B** (script): "limpa('rt-dim2'); pinta(); — só Insumo fica ativo"

Nota: Na tela vale o script.
Decisão: `null` (não resolvido).

### div-m14-inst06-perdas — Perdas na fórmula da aula, ausentes no script (severidade baixa)

Classe: fonte × fonte · instrumento INST·06.

- **Leitura A** (Aula 05, div.fx (L1776)): "Energia exportável: Exportado = Geração bruta − Autoconsumo de processo − Perdas"
- **Leitura B** (script INST·06): "var exp=ger*(1-aut/100); /* GWh exportados */"

Nota: O simulador desconta só o autoconsumo; a fórmula da aula também desconta perdas. A disponibilidade entra na geração bruta.
Decisão: `null` (não resolvido).

### div-m14-inst-nomes-catalogo — Nome do instrumento: span.nm da fonte × tabela do catálogo canônico (severidade baixa)

Classe: fonte × catálogo · instrumento INST·09, INST·10.

- (INST·09 — fonte × catálogo): "Classificador de insumo — rota, produto, órgão e concorrente × Classificador de insumo"
- (INST·10 — fonte × catálogo): "Verificador de base temporal e rota — instrumento assinatura × Verificador de base temporal e rota (instrumento assinatura)"

Nota: O catálogo encurta ou reformata o nome. A descrição do INST·09 no catálogo ("órgão competente, onde entra na matriz") repete a promessa do p.inst-intro que o painel não cumpre (div-m14-inst09-campos-prometidos).
Decisão: `null` (não resolvido).

## Consistência (conferida, sem divergência)

| Tema | Texto da fonte | Painel no padrão | Resultado |
|---|---|---|---|
| INST·06 × Ex 02 × Q04 × INST·10 e7 | Ex 02: "cerca de 355 GWh brutos e entregam cerca de 160 GWh ... fator de capacidade anual em torno de 23%" | 355 GWh / 160 GWh / 22,8% | coerente (arredondamento) |
| INST·06 × §Voz 4:00–5:00 | "Uma cogeração de 80 MW pode ter fator de capacidade anual em torno de 20%" | 22,8% | aproximação da prosa ("em torno de"); não tratado como divergência |
| INST·06 teto × §Erros 14 | "Esta usina tem 80 MW, então gera 700 GWh por ano." | teto teórico de 701 GWh no desenho de barras | coerente |
| INST·02 × §01.3 | regra dos 70% não entra na conta | ETANOL MAIS BARATO POR QUILÔMETRO, COM MARGEM ESTREITA. O índice de preço é 66,9 | coerente |

## Contagens

| Item | Contagem |
|---|---|
| instrumentos | 10 |
| de_aula | 9 |
| fora_de_aula | 1 |
| campos_numericos | 21 |
| grupos_de_selecao | 11 |
| saidas | 27 |
| ramos_de_veredito | 30 |
| portados | 0 |
| nao_portados | 10 |
| divergentes | 0 |
| enunciados_inst10 | 12 |
| combinacoes_inst09 | 35 |
| divergencias | 11 |

## Verificação

Verificação adversarial independente (2026-09-17), com parser próprio:
- **Scripts.** Os 10 `script.codigo_verbatim` são idênticos, linha a linha, às faixas L3308–L4229 da fonte.
- **Fórmulas.** 100%: as 30 linhas de `formulas_script` existem a ±3 linhas; as 7 `formulas_exibidas_na_secao` (nome,
  eq, desc) batem com os 7 `div.fx` da fonte (L1148, 1156, 1258, 1266, 1776, 1946, 2191); as 30 condições de ramo
  existem nas linhas declaradas; todos os `fragmentos_literais` são substring da fonte.
- **Contagens recalculadas.** 10 `div.inst` (9 em aula, 1 no § MAP; 2 na Aula 08), 21 `div.field`, 11 `div.seg`,
  30 ramos (a atribuição inicial `cls=` não conta). Conferem.
- **Cenário-padrão recalculado à mão.** INST·02: 4,15 ÷ 6,20 = 66,9% e 8,0 ÷ 11,5 = 69,6%. INST·07: logística
  0,05 + 0,0002 × 80 = R$ 0,07/Nm³, margem R$ 1,38/Nm³, `en` = 15 × 36 ÷ 1000 = 0,54 → "1 TJ/ano". INST·08:
  100e6 × 21,3 × 87,4 × 0,55 ÷ 1e6 = 102.389 t. Os defeitos `div-m14-inst07-energia` e `div-m14-inst08-unidade`
  são reais (rótulo L2287 "gCO₂e/MJ"; script usa `dic/100`).
- **Correção 1.** O `trecho_inicial` do bloco anterior ao INST·02 juntava nome e equação da fórmula com ": ", que
  não existe na fonte. Passou a "Índice de paridade — triagem, não decisão Índice = Preço do hidratado ÷ Preço da
  gasolina" (texto sem tags de L1157–1158), no JSON, na tabela acima e em `m14_instrumentos.mjs` (função `resumo`).
  As leituras das divergências `div-m14-inst06-perdas` e `div-m14-inst08-unidade` ainda usam "nome: eq" como
  composição de dois trechos literais; ficaram assim.
- **Atenção.** Esta seção foi escrita à mão. Se `m14_md.mjs` rodar de novo, reponha-a.
