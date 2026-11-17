# M04 · Grupo "instrumentos"

**Fonte (só leitura):** `alexandria_modulo04.html`. O markup está em L351–935 e o `<script>`, em L1320–1854.
**Arquivo gerado:** [`instrumentos.json`](instrumentos.json).
**Extratores:**
- [`extratores/m04_extrator.py`](extratores/m04_extrator.py) lê o markup e as linhas do script;
- [`extratores/m04_harness_script.mjs`](extratores/m04_harness_script.mjs) executa o `<script>` **original** num DOM
  simulado, e a saída fica em [`extratores/m04_harness_saida.json`](extratores/m04_harness_saida.json);
- [`extratores/m04_inst01_limite.mjs`](extratores/m04_inst01_limite.mjs) percorre o espaço inteiro do INST 01.

## Método

- **Markup.** Para cada `div.inst`: título (`span.nm`), id literal (`span.id`), intro, campos (par
  `input[number]` + `input[range]`), readouts (`.ro .k`/`.n`, sub-rótulo), veredito, nota `p.disc`, barras e SVG com
  a legenda.
- **Script.** Linhas literais, sem reescrita:
  - as constantes do bloco;
  - `calculo`, as linhas de `run()` entre a leitura das entradas e a primeira saída;
  - `run_completo`;
  - a expressão exata de cada readout (`$id(x).textContent|innerHTML = …`);
  - os ramos `vd(v,'classe', …)`, com a condição e a expressão JS do texto.
- **Cenário-padrão.** Vem da execução do script original com os `value` do markup (Node v24, `toLocaleString`
  pt-BR). Não foi recalculado à mão.
- **Comparação com a porta.** O harness empacota `INSTRUMENT_CALCULATORS` com esbuild e compara o veredito (string
  exata) numa grade de até 9 pontos por campo, com o produto cartesiano completo.

## Resumo

| Id fonte | Título | Aula | Posição (L) | Entradas | Saídas | Ramos | Script (L) | Código |
|---|---|---|---|---|---|---|---|---|
| Inst · 01 | Simulador · Formador de preço | 01 | 351, depois do callout "A fila real" (1.3) | 4 | 4 (2 textuais) | 4 | 1399–1453 | divergente |
| Inst · 02 | Simulador · PLD ao longo do ano | 02 | 447, depois de "Leia esses dois números juntos" (2.3), antes do h3 2.4 | 3 | 4 (1 textual) | 4 | 1455–1504 | divergente |
| Inst · 03 | Simulador · O dinheiro que falta | 03 | 536, depois de "A frase que resolve…" (3.3), antes do h3 3.4 | 4 | 4 | 3 | 1506–1534 | divergente |
| Inst · 04 | Simulador · Sala do leilão reverso | 04 | 621, no fim de 4.1, antes do h3 4.2 | 2 | 4 | 5 | 1536–1583 | divergente |
| Inst · 05 | Simulador · Contrato × spot ao longo de 12 meses | 05 | 732, depois de "Números vivos" (5.5), antes do `lv` | 4 | 4 (2 textuais) | 4 | 1585–1629 | divergente |
| Inst · 06 | Mesa de hedge · swap simples | 06 | 818, no fim de 6.4, antes do `lv` | 3 | 4 | 5 | 1631–1653 | divergente |
| Inst · 07 | Simulador · Portfólio em camadas | 07 | 900, no fim de 7.3, antes do h3 7.4 | 4 | 4 (1 textual) | 5 | 1655–1721 | divergente |

**Totais.**
- 7 instrumentos, todos de aula, 1 por aula. Nenhum instrumento de módulo, nenhum § Lab.
- 24 entradas, 28 saídas (6 textuais) e 30 ramos de veredito.
- `kind`: todos `simulador`, como na taxonomia. A "Mesa de hedge" tem a mesma mecânica.

**Status "divergente" nos 7.** A porta do **cálculo e do veredito é fiel**: o harness comparou 38.200 combinações
(INST 01: 8.100 · 02: 1.000 · 03: 10.000 · 04: 100 · 05: 10.000 · 06: 900 · 07: 8.100) e achou **0 vereditos
divergentes**. A divergência está no contrato e na apresentação (lista abaixo). Nenhum instrumento está
"não portado".

**Invocação no texto.** Duas aulas citam o instrumento:
- A01, callout "A fila real": "Todo simulador de ordem de mérito — inclusive o desta página — mostra apenas o
  primeiro termo dessa soma."
- A06, callout "Teste de sanidade", depois do instrumento: "O instrumento acima mostra exatamente o ponto em que a
  curva atravessa essa fronteira."

**Pergunta.** Nenhum instrumento tem pergunta própria (`pergunta: null`). A `inst-intro` é instrução. Uma pergunta de
previsão é camada Alexandria (P19).

**Tolerâncias.** Nenhuma declarada (`tolerancias: null`).

**Fonte dos números.**
- Os três limites (`PLD_MIN=57.31`, `PLD_MAX_H=1611.04`, `PLD_MAX_E=785.27`, L1338) vêm do comentário "limites
  regulatórios vigentes 2026 — ANEEL Despacho 3.850/2025" (L1337) e são confirmados em §Ref ref-01.
- Os demais parâmetros não têm fonte externa declarada, e cada nota diz "Didático/ilustrativo — não usar para
  dimensionamento real". São eles: frota, curvas SEAS/WAVE/RAMP, lances, preços de camada e consumo de
  10.000 MWh/mês. Na interface: "cenário didático, fonte externa não declarada" (P19).

## Por instrumento

A fórmula exata de cada saída está em `saidas[].expressao_script` e o cálculo, em `script.calculo` (texto literal).
Abaixo vão só o essencial e o cenário-padrão renderizado pelo original.

### Inst · 01 · Simulador · Formador de preço (Aula 01)

| Entrada | Unidade | Faixa / passo | Padrão |
|---|---|---|---|
| Demanda do sistema | MW | 300–1600 / 25 | 1000 |
| Disponibilidade renovável | % | 0–100 / 5 | 100 |
| Nível de reservatório | % | 0–100 / 5 | 100 |
| Preço do gás no CVU | R$/MWh | 120–600 / 10 | 250 |

- **Cálculo (L1404–1425).**
  - `agua=30+(100-Hh)/100*320`.
  - Frota: Solar `200*R`/0; Eólica `300*R`/12; Hidráulica 350/`agua`; Gás 400/`G`; Óleo 250/900.
  - A frota é ordenada por CVU e atendida em fila; o preço é o CVU da última usina usada.
  - Em déficit, o preço vai a `PLD_MAX_H`. Os limites são aplicados em seguida.
- **Saídas.** Preço formado `brl(price)+"/MWh"` · Usina marginal (texto) · Déficit `num(def)+"MW"` · Limite aplicado
  (texto).
- **Ramos.** Déficit (per) · `price<=120` (ok) · `price<=400` (att) · senão (per).
- **Padrão.** Preço R$ 250/MWh · Usina marginal Gás · Déficit 0 MW · Limite aplicado "nenhum" · ramo 3, "Sistema em
  atenção. …".
- **Observação da fonte (provada no espaço inteiro, 1.145.277 combinações).** O ramo `lim='teto horário'` (L1424) é
  **inalcançável**: em déficit o preço fica *igual* ao teto, e o readout mostra "acima do teto estrutural" com a
  usina marginal "déficit". Os rótulos alcançados são "nenhum", "piso R$ 57,31" e "acima do teto estrutural". Com
  óleo na margem, o preço é R$ 900, acima do estrutural (o simulador não aplica o teto da média).

### Inst · 02 · Simulador · PLD ao longo do ano (Aula 02)

| Entrada | Unidade | Faixa / passo | Padrão |
|---|---|---|---|
| ENA — afluência | % da MLT | 40–140 / 2 | 100 |
| EAR inicial em janeiro | % | 10–95 / 1 | 60 |
| Variação da carga | % | −5–10 / 1 | 0 |

- **Cálculo (L1460–1471).**
  - `pres=0.50*pE+0.35*pA+0.15*pC`.
  - Para cada mês: `pld=clamp(PLD_MIN+(PLD_MAX_H-PLD_MIN)*p^2.2)`, com `p=clamp(pres*SEAS[i])`.
  - `med=soma/12`.
- **Saídas.** PLD médio do ano · Mês crítico (texto) · Pico do ano · "1 MW médio descoberto" = `mi(mx*730)`, com o
  sub-rótulo "custo no mês crítico · 730 MWh".
- **Ramos.** `mx<=120` (ok) · `mx<=350` (att) · `mx<=PLD_MAX_E` (per) · senão (per).
- **Padrão.** R$ 106/MWh · Set · R$ 158/MWh · R$ 115 mil · ramo 2, "Pico em Set a R$ 158/MWh. …".
- **Gráfico.** SVG com 12 meses, faixa do período seco (Mai–Nov) e linhas de teto estrutural e piso. A legenda tem
  4 itens.

### Inst · 03 · Simulador · O dinheiro que falta (Aula 03)

| Entrada | Unidade | Faixa / passo | Padrão |
|---|---|---|---|
| Potência do ativo | MW | 10–500 / 10 | 200 |
| Horas de despacho por ano | h | 10–3000 / 10 | 200 |
| Margem líquida quando gera | R$/MWh | 20–1400 / 10 | 400 |
| Custo fixo de disponibilidade | R$/kW-ano | 80–700 / 10 | 300 |

- **Cálculo (L1511–1513).** `rec=P*Hh*M` · `cst=P*1000*F` · `gap=cst-rec` · `need=gap>0?gap/(P*1000):0` ·
  `fc=Hh/8760*100` (só no veredito).
- **Saídas.** Receita de energia · Custo fixo anual · Dinheiro que falta (`'zero'` se `gap<=0`) · Preço de capacidade
  necessário (`'não precisa'` se `gap<=0`).
- **Ramos.** `gap<=0` (ok) · `need<80` (att) · senão (per).
- **Padrão.** R$ 16 mi · R$ 60 mi · R$ 44 mi · R$ 220/kW-ano · ramo 3, "Falta R$ 44 mi. …".

### Inst · 04 · Simulador · Sala do leilão reverso (Aula 04)

| Entrada | Unidade | Faixa / passo | Padrão |
|---|---|---|---|
| Quantidade demandada | MW | 0–2100 / 50 | 1000 |
| Preço-teto do edital | R$/MWh | 150–400 / 5 | 300 |

- **Lances fixos (L1539–1546).** Solar A 500 MW/170 · Eólica B 400/195 · Hidro C 150/230 · Gás D 600/265 ·
  Biomassa E 120/280 · Térmica F 300/340.
- **Cálculo (L1548–1558).** Um lance com preço acima do teto soma em `barrado`. Os demais atendem a demanda em fila;
  `corte` é o preço do último lance aceito e `med=somaRS/somaMW`.
- **Saídas.** Contratado (MW) · Preço de corte (`'—'` se nada contratado) · Preço médio por lance (`brl2`, `'—'` se
  nada) · Demanda não atendida (MW).
- **Ramos.** Deserto (per) · demanda zero (att) · falta com barrado ≥ falta (per) · falta por oferta (per) ·
  integral (att).
- **Padrão.** 1.000 MW · R$ 230/MWh · R$ 186,00/MWh · 0 MW · ramo 5, "Contratado integralmente. …diferença de
  R$ 44,00 por MWh…".

### Inst · 05 · Simulador · Contrato × spot ao longo de 12 meses (Aula 05)

| Entrada | Unidade | Faixa / passo | Padrão |
|---|---|---|---|
| Parcela contratada em PPA | % | 0–100 / 5 | 70 |
| Preço do PPA | R$/MWh | 180–500 / 5 | 355 |
| PLD médio do cenário | R$/MWh | 57–800 / 1 | 250 |
| Amplitude mensal do PLD | ± R$/MWh | 0–350 / 10 | 120 |

- **Cálculo (L1591–1600).** `fix=C*P*CONS` (CONS = 10000); para cada mês,
  `pld=clamp(L+S*WAVE[i],PLD_MIN,PLD_MAX_H)` e `total=fix+(1-C)*pld*CONS`.
- **Saídas.** Custo médio · Mês mais barato (texto) · Mês mais caro (texto) · Amplitude anual.
- **Ramos.** `C>=0.999` (att) · `amp<=400000` (ok) · `amp<=1500000` (att) · senão (per).
- **Padrão.** R$ 3,25 mi · "Fev · R$ 2,87 mi" · "Ago · R$ 3,6 mi" · R$ 720 mil · ramo 3.

### Inst · 06 · Mesa de hedge · swap simples (Aula 06)

| Entrada | Unidade | Faixa / passo | Padrão |
|---|---|---|---|
| Preço fixo do swap | R$/MWh | 150–600 / 5 | 300 |
| PLD realizado no mês | R$/MWh | 57–1611 / 1 | 250 |
| Volume travado | MWh | 0–16000 / 500 | 8000 |

- **Cálculo (L1637).** `pay=(P-F)*V` · `semH=CONS*P` · `comH=semH-pay` · `efe=comH/CONS`.
- **Saídas.** Resultado do swap (`"+ "`/`"− "` + `mi(|pay|)`) · Custo sem hedge · Custo com hedge · Custo efetivo
  (`brl2` + "/MWh").
- **Ramos.** `V>CONS+0.5` (per, "deixou de ser hedge") · `V===0` (att) · `P>F` (ok) · `P<F` (att) · igual (ok).
- **Padrão.** "− R$ 400 mil" · R$ 2,5 mi · R$ 2,9 mi · R$ 290,00/MWh · ramo 4, "O PLD ficou abaixo do preço
  travado. …".

### Inst · 07 · Simulador · Portfólio em camadas (Aula 07)

| Entrada | Unidade | Faixa / passo | Padrão |
|---|---|---|---|
| Base longa · R$ 330/MWh | % | 0–120 / 5 | 50 |
| Camada média · R$ 348/MWh | % | 0–120 / 5 | 25 |
| Camada curta · R$ 366/MWh | % | 0–120 / 5 | 15 |
| Choque de PLD no 2º semestre | intensidade | 0–100 / 5 | 0 |

- **Cálculo (L1663–1680).**
  - `over=max(0,soma-100)` · `resid=max(0,100-soma)` · `custoFixo=(A*330+B*348+C*366)/100*CONS`.
  - Para cada mês: `pld=clamp(200*SEAS[i]*(1+S/100*RAMP[i]))` e `t=custoFixo+resid%*pld*CONS-over%*pld*CONS`.
- **Saídas.** Exposição residual (`−over` ou `resid`, em %) · Custo médio anual · Pior mês (texto) · Amplitude do
  ano.
- **Ramos.** `over>0` (per) · `resid===0` (att) · `resid<=15` (ok) · `resid<=35` (att) · senão (per).
- **Padrão.** 10% · R$ 3,27 mi · "Set · R$ 3,33 mi" · R$ 120 mil · ramo 3, "Exposição residual de 10%, … Custo médio
  de R$ 327,03/MWh. …".

## Fonte × código (valem para os 7, salvo indicação)

Status: **portado com divergências** (`divergente`). O `Instrument` está em `alexandria-modulo-04-content.ts` e a
calculadora, em `alexandria-instrument-calculators.ts`.

| # | Divergência | Onde |
|---|---|---|
| 1 | O título, o `kind` (`simulador`), os rótulos, as unidades e as faixas das 24 entradas são **idênticos**. O id do campo no código é o do `number` (`iN-x-n`); o script lê o `range` | todos |
| 2 | **Saídas textuais ausentes** (`Record<string, number>`): `i1-m`, `i1-lim`, `i2-mes`, `i5-lo`, `i5-w`, `i7-w`. O texto sobrevive no veredito só em parte (o veredito do INST 01 não cita a usina marginal) | 01, 02, 05, 07 |
| 3 | **Unidade de saída**: a fonte renderiza "/MWh" (`i1-p`, `i2-p`, `i2-max`, `i4-c`, `i4-m`, `i6-u`), "MW" (`i4-q`, `i4-f`) e "%" (`i7-e`); o código declara `unit: null` | 01, 02, 04, 06, 07 |
| 4 | `note: null`, mas a fonte tem `p.disc` (a nota didática) e `p.inst-intro`. Nenhuma das duas está no `Instrument` | todos |
| 5 | A porta emite números crus; a fonte formata (`brl`/`brl2`/`mi`/`num`). Onde a fonte mostra texto (`i3-g` "zero", `i3-k` "não precisa", `i4-c`/`i4-m` "—"), a porta emite 0. `i6-r` tem prefixo "+ "/"− " na fonte | 03, 04, 06 |
| 6 | **Visual não portado**: barras (`i1-bars`, `i3-bars`, `i4-bars`) e SVG com legenda (`i2-svg` 4 itens, `i5-svg` 3, `i7-svg` 5) | 01–05, 07 |
| 7 | A classe do veredito (ok/att/per = verde/âmbar/vermelho) não foi portada. É semáforo, que o design proíbe | todos |
| 8 | **Entrada vazia.** Na fonte, `link()` devolve o valor do deslizador e aplica os limites da faixa. Na porta, o valor vira 0, sem limite | todos |
| 9 | **Posição.** Na fonte, o instrumento fica no fluxo da aula (tabela acima). `MODULO_04_CORPO` não tem bloco de instrumento, e `aula.instruments` é renderizado à parte (lido no código, **não verificado na tela**) | todos |
| 10 | `formula: null` é coerente: a fonte não tem `div.formula` | todos |

## Lacunas

- Não há pergunta, previsão, gabarito nem tolerância por instrumento.
- A fonte dos parâmetros didáticos não é declarada.
- Os 6 explicadores de três níveis (`div.lv`) são interativos, mas não calculam. Ficam com as aulas e não entram
  aqui.

## Verificação (verificador adversarial independente, 2026-09-17)

Método próprio, sem reusar o extrator: normalização de espaços/entidades e comparação de substring contra o HTML
cru e contra o texto sem tags; pareamento estrutural por regex direto na fonte; `var Q` e o `<script>` avaliados em
node com DOM mínimo próprio.

- **Verbatim.** 2.500 strings dos três JSON percorridas; todas as de conteúdo são substring da fonte. As que não são
  são anotações da extração (`*_nota`, `divergencias`, `codigo`, valores renderizados), como esperado.
- **Pareamento 100%.** Quiz 10/10 (enunciado, 4 alternativas na ordem, gabarito, explicação, aula citada, 2 faixas);
  checklist 20/20 na ordem; 58 termos com a definição e a família certas; 10 erros; 8 perguntas do caso; 32 + 6 + 5
  do §Voz; 11 referências (5 URLs, texto do link); 9 exercícios (enunciado e parágrafos do gabarito); 7 cartões do §MAP.
- **Instrumentos 100%.** 376 linhas `{linha, codigo}` idênticas à linha da fonte; 30 ramos (condição e texto na linha
  declarada); 28 saídas (expressão na linha declarada; 6 textuais: i1-m, i1-lim, i2-mes, i5-lo, i5-w, i7-w); 24 entradas
  (rótulo, padrão, min, max, passo conferidos no `<input type="number">`). Cenário-padrão dos 7 reexecutado: 0 diferenças.
  Harness: 8.100 + 1.000 + 10.000 + 100 + 10.000 + 900 + 8.100 = 38.200. Ramo inalcançável do INST 01 confirmado
  (gás máx. 600 < óleo 900; no déficit `price` = PLD_MAX_H, não maior).
- **Origens.** 0 `trecho_inicial` fora de ±3 linhas.
- **Contagens recontadas no HTML.** 17 `sec-id`; 7 aulas; 28 subseções (3+4+4+4+5+4+4); 7 `div.inst`; 24 entradas; 28
  readouts; 30 ramos; 58 termos (15+14+16+13); 9 `details` em §Ex; 20 `ul.ck li`; 10 questões × 4; 32 / 6 / 5 no §Voz;
  10 erros; 8 perguntas; 11 referências (5 com URL); 6 `div.lv`; 20 `div.box` (12 de aparato/princípio + 2 capturados
  em `criterio` e `voz.como_treinar` + 6 de corpo de aula, estes deixados ao grupo aulas; ver 2ª verificação); 7 "Onde isso entra no produto". Todas conferem com o declarado.
- **Código.** Saídas no código 22; `unit: null` em 21 saídas, das quais 9 renderizam unidade na fonte; 7 `note: null`;
  13 `</b>` × 6 `<b>` no conteúdo do M04 (7 órfãos); 5 " ." nos gabaritos (Ex·06 ×1, Ex·08 ×4). Catálogo: família 3
  lista 15 nomes (sem "PPA"). Conferem.

Nenhuma correção neste grupo.

## Verificação (2º verificador adversarial, 2026-09-17)

Método próprio, sem reusar extrator nem o harness: substring normalizada (espaços/entidades) de todas as 2.757
strings dos três JSON contra o HTML cru e sem tags; pareamento exato por regex direto na fonte; `var Q` avaliado em
node; `<script>` original executado num DOM mínimo próprio.

- **Verbatim.** Todas as strings de conteúdo são substring da fonte. As 526 que não são: ids, `tipo`, `marcacao_p14`,
  `tipo_saida`, `classe_veredito` e valores renderizados pelo script (estes reproduzidos pela execução, abaixo).
- **Pareamento 100% (igualdade exata após normalização).** Quiz 10/10 (enunciado, 4 alternativas na ordem, índice,
  letra, gabarito, explicação, aula citada; 2 faixas); checklist 20/20 (html, texto, ordem); §Caso 8 (tema + pergunta);
  §Erros 10 (título + corpo); §Voz 32 + 6 (persona + pergunta) + 5 minutos; §Ex 9 (summary, enunciado, todos os
  parágrafos do gabarito); §Lex 58 (termo, definição, família; 15+14+16+13); §Ref 11 (rótulo, descrição, 5 URLs e texto
  do link); tabela do §00 (7 linhas × 3 células).
- **Instrumentos 100%.** 376 linhas `{linha, codigo}` iguais à linha da fonte (349 idênticas byte a byte, 27 só com
  diferença de indentação); 24 entradas (rótulo, unidade, padrão, min, max, passo, igualdade number/range); 28 saídas
  (rótulo, id, expressão na linha declarada); 30 ramos (4+4+3+5+4+5+5, condição e texto na linha declarada);
  6 textuais. Cenário-padrão dos 7 reexecutado: saídas renderizadas, `valor_padrao_bruto`, veredito e classe sem
  diferença. Ramo inalcançável do INST 01 reconferido no script (L1420–1425). Soma do harness: 38.200.
- **Origens.** 349 `trecho_inicial` checados; nenhum fora de ±3 linhas.
- **Contagens recontadas.** Todas as declaradas conferem (17 · 7 · 28 · 7 · 0 · 0 · 24 · 28 · 6 · 30 · 58 · 9 · 9 ·
  20 · 10 · 4 · 2 · 32 · 6 · 10 · 8 · 11 · 5 · 4 · 12 · 6).
- **Escopo.** Sem Tradutor, §Lab, "Resultado esperado" ou trilha na fonte (ausências corretas). As 5 `table.tbl`:
  a do §00 está extraída; as 4 restantes são de corpo de aula (L420, L649, L693, L878).
- **Divergências.** Todas reconferidas na fonte (título da Aula 04 L311 × L610; "Bloco 4" L296/L1181 × "Bloco 9"
  L1302; "Parte 4"; ramo do INST 01). Nenhuma inventada.

**Correção aplicada.** O texto da 1ª verificação dizia "20 `div.box` (12 de aparato/princípio + 8 de corpo de aula)".
A recontagem por seção dá 12 em `principios_editoriais` + 2 capturados em outro campo ("Critério de domínio deste
módulo" em `criterio.itens[0]` e "Como treinar" em `voz.como_treinar`) + **6** de corpo de aula ("A fila real",
"Leia esses dois números juntos", "A frase que resolve a pergunta do Módulo 03", "Conecte com o Módulo 03", "O que ler
num resultado de leilão", "Teste de sanidade"). A frase foi corrigida nos quatro `.md`. Os JSON não mudaram.
