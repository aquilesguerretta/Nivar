# M08 · instrumentos

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html`; markup em `div.inst` (precedido de `<!-- INST NN -->`), script em L2042–3130 com um cabeçalho `INST NN — …` por instrumento.
- **Saída:** [`instrumentos.json`](instrumentos.json). **Extrator:** [`extratores/m08_instrumentos.mjs`](extratores/m08_instrumentos.mjs).

## Método (protocolo §10)

- Markup lido por regex com índice de linha; comportamento da fonte obtido executando o `<script>` original num DOM falso (só chamadas de ambiente simuladas); código comparado importando INSTRUMENT_CALCULATORS e MODULO_08_* reais.
- **Fórmulas:** `saidas.calculo_verbatim` são as linhas `var …` da função de cálculo, literais, com linha; `saidas.readouts_do_script` são os `div.ro` montados pelo script (rótulo, expressão, unidade).
- **Ramos:** `ramos_de_leitura[]` traz a condição, a linha e o `corpo_verbatim` (classe e mensagem literais do ramo). O bloco inteiro do instrumento está em `script.codigo_verbatim`.
- **Cenário-padrão:** estado renderizado pelo script original sem nenhuma interação (valores do markup e do objeto `I{n}`).
- **Prova diferencial:** 240.174 casos, fonte executada × `INSTRUMENT_CALCULATORS` do código. Espaço inteiro quando é finito (INST 01, 05, 06, 07, 08, 09, 11); grade + aleatórios de semente fixa nos contínuos.

**Campos que a fonte não preenche:** `pergunta: null` em todos (nenhuma pergunta própria de instrumento); `fonte_dos_numeros: null` onde não há `span.srcnote`; `tolerancia: null` onde a fonte não declara.

## Os 11 instrumentos

| Id | Título | Onde | Entradas | Saídas | Ramos | Fonte dos números | Tolerância | `kind` no código | Estado |
|---|---|---|---|---|---|---|---|---|---|
| inst-01 | Mapa físico do Brasil elétrico · geração × escoamento | **§ MAP (módulo)**, L536–552 | Fluxo exibido (3); controles gerados | painel textual | 0 | `null` | `null` | explorador | divergente |
| inst-02 | Conversor de três eixos · as duas pizzas lado a lado | Aula 01, após 1.1, L608–630 | 6 campos gerados | Capacidade total; Geração implícita; Fator de capacidade médio; Fontes que trocam de posição + veredito | 3 | srcnote | `null` | comparador | divergente |
| inst-03 | Calculadora de fator de capacidade · com faixa típica por fonte | Aula 01, após 1.3, L679–713 | Fonte de referência (6); Potência instalada; Energia gerada no período; Período | Energia teórica máxima; Fator de capacidade; Horas equivalentes a plena carga + veredito | 4 | `null` | `null` | calculadora | divergente |
| inst-04 | Reconstrutor de matriz · desenhe as duas pizzas de memória | Aula 02, L803–827 | Rodada (2); 6 campos gerados | Fontes dentro da tolerância; Erro absoluto total; Sua soma; Ordem das fontes + veredito | 9 | srcnote | 3 pontos percentuais por fonte | reconstrutor | divergente |
| inst-05 | Leitura lateral · o mesmo campo nas seis fontes | Aula 02, L832–841 | Campo em exibição (chips); controles gerados | painel textual | 0 | `null` | `null` | explorador | divergente |
| inst-06 | Curvas de complementaridade · três escalas sobrepostas | Aula 03, após 3.2, L915–931 | Escala de tempo (3); controles gerados | Fontes ligadas; Pontos com excedente; Maior excedente; Maior déficit contra a carga + veredito | 5 | `null` | `null` | quebra-cabeca | divergente |
| inst-07 | Calendário sazonal · doze meses do sistema | Aula 03, após 3.3, L940–948 | controles gerados | painel textual | 0 | `null` | `null` | explorador | divergente |
| inst-08 | Termômetro hidrológico · estoque contra fluxo | Aula 04, após 4.1, L1001–1039 | Carregar fotografia de (4); Afluência do mês; Energia armazenada; Posição no ciclo anual | Quadrante; Tendência do estoque; Posição no ciclo; Folga aproximada + veredito | 4 | srcnote | `null` | simulador | portado |
| inst-09 | Anatomia do corte de geração · causa, hora e quem paga | Aula 05, após 5.5, L1185–1218 | Patamar horário (4); Dia (2); Região da usina (4); Condição da rede (3) | Causa predominante; Sobre quem recai; O que efetivamente resolve; Carga líquida no patamar + veredito | 5 | `null` | `null` | simulador | portado |
| inst-10 | Perfil de carga · casamento com a curva de geração | Aula 06, após 6.4, L1325–1355 | Consumo anual; Horas de operação por dia; Dias de operação por semana; Concentração no turno diurno | Demanda média em operação; Fator de carga anual; Horas de operação por ano; Cobertura solar teórica + veredito | 8 | `null` | `null` | simulador | divergente |
| inst-11 | Roteador de recorte · qual base responde a qual pergunta | Aula 07, após 7.4, L1418–1445 | Sobre o que é a pergunta (6); Granularidade necessária (3); Uso pretendido (2) | painel textual | 0 | `null` | `null` | explorador | portado |

Contagem: 11 (10 de aula + 1 de módulo). As Aulas 01, 02 e 03 têm dois cada. Código: 8 divergente, 3 portado; nenhum "não portado".

## Inst · 01 — Mapa físico do Brasil elétrico · geração × escoamento

- **Escopo:** instrumento de módulo (§MAP). **Invocação:** seção `map`; `div.inst` em L536–552.
- **Antes:** `p` L533 "Use o instrumento abaixo antes de ler as aulas e outra vez depois de fechar a Aula 07. Na …". **Depois:** `p` L554 "Repare no que acontece quando você alterna. No fluxo de geração, o Nordeste é o nó mais de…"
- **Frases da seção com "instrumento/reconstrutor"** (sinal, não vínculo): L533: "Use o instrumento abaixo antes de ler as aulas e outra vez depois de fechar a Aula 07."
- **Pergunta:** `null`. **Intro:** "Dois fluxos sobre a mesma geografia. No fluxo de geração, os nós dimensionam onde cada fonte está concentrada. No fluxo de escoamento, os mesmos pontos viram origem, corredor ou destino — e os gargalos aparecem. Clique em qualquer nó ou etiqueta para abrir o painel."
- **Entrada "Fluxo exibido"** (`i1-seg`): Geração · onde nasce (padrão) · Escoamento · por onde sai · Os dois
- **Controles:** Nós do SVG (.mp-node) e chips (.tl-chip) gerados por i1render(); clique troca I1.sel. Estado inicial sel = "exp".
- **Cálculo (`i1render`, literal):**

```js
var svg = ['<svg viewBox="0 0 560 470" xmlns="http://www.w3.org/2000/svg" style="width:100%;   // L2157
var byId = {};   // L2159
var showE = (I1.cur === 'esc' || I1.cur === 'amb');   // L2161
var showG = (I1.cur === 'ger' || I1.cur === 'amb');   // L2162
var a = byId[p[0]], b = byId[p[1]];   // L2165
var mx = (a.x + b.x)/2 + (b.y - a.y)*0.12, my = (a.y + b.y)/2 - (b.x - a.x)*0.12;   // L2167
var on = (n.id === I1.sel);   // L2174
var col = n.sub === 'Gargalo' ? '#EF4444' : (on ? '#F59E0B' : '#06B6D4');   // L2175
var n = byId[I1.sel];   // L2197
var txt = I1.cur === 'ger' ? n.ger : (I1.cur === 'esc' ? n.esc : '<b>Geração.</b> ' + n.ger + '<br><br><b>Escoamento.</b> ' + n.esc);   // L2198
```

- **Cenário-padrão (fonte executada):** painel: "Gargalo Fronteira de exportação Norte e Nordeste Não é ponto de geração: é o limite através do qual a produção do Norte e do Nordeste alcança o maior centro de carga do país. Fluxo em exibição Geração…" · legenda: "Corredor de escoamento Vizinhança de recurso Gargalo estruturante Nó selecionado"
- **Fonte dos números:** `null`. Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Aviso:** "Didático/ilustrativo. A geografia é esquemática e as posições são aproximadas: o instrumento mostra a topologia de onde nasce e por onde escoa, não um mapa cartográfico. Submercados são zonas de contabilização e preço, não fronteiras administrativas. Grandezas verificadas em fonte oficial em 1º de agosto de 2026 — todas são números vivos."
- **Tolerância:** `null` (não declarada)
- **Código — divergente** (`m08-inst-01`). Problemas: intro (p.inst-intro) não aparece verbatim na nota do código; disclaimer (p.disc) não aparece verbatim na nota do código.
  Prova diferencial: exaustivo (3 fluxos × 14 nós = 42); 42 casos; numéricas iguais 0, diferentes 0; texto completo 42, incompleto 0; veredito da fonte contido no do código 0.

## Inst · 02 — Conversor de três eixos · as duas pizzas lado a lado

- **Escopo:** instrumento de aula. **Invocação:** seção `a01` (`aula-08-01`), subseção 1.1 "Eixo 1 — potência mede tamanho, energia mede utilização"; `div.inst` em L608–630.
- **Antes:** `div` L593 "Capacidade não é geração · três níveis Criança de 12 anos Executivo Especialista Capacidad…". **Depois:** `h3` L632 "1.2 Eixo 2 — elétrica e energética diferem em quarenta pontos…"
- **Pergunta:** `null`. **Intro:** "Digite a capacidade instalada e o fator de capacidade de cada fonte. O instrumento devolve as duas pizzas e marca em dourado toda fonte que trocou de posição entre elas. Os valores iniciais são a fotografia de 2025 declarada abaixo; substitua qualquer um deles e a lição continua funcionando — é essa a razão de o instrumento existir."
- **Entradas geradas pelo script:** Hidrelétrica (GW · FC %; `i2c-hid` 0–400, padrão 110.2, `i2f-hid` 0–100, padrão 41.6); Solar (GW · FC %; `i2c-sol` 0–400, padrão 64.8, `i2f-sol` 0–100, padrão 15.5); Eólica (GW · FC %; `i2c-eol` 0–400, padrão 34.7, `i2f-eol` 0–100, padrão 38.3); Biomassa (GW · FC %; `i2c-bio` 0–400, padrão 17.5, `i2f-bio` 0–100, padrão 41.1); Térmica fóssil (GW · FC %; `i2c-fos` 0–400, padrão 31.8, `i2f-fos` 0–100, padrão 27.5); Nuclear (GW · FC %; `i2c-nuc` 0–400, padrão 2, `i2f-nuc` 0–100, padrão 90.4)
- **Rótulos fixos do markup:** "Pizza 1 · capacidade instalada (GW)" L615 · "Pizza 2 · geração efetiva (TWh/ano)" L620
- **Cálculo (`i2calc`, literal):**

```js
var A = I2.src.map(function(s){ return {nm:s.nm, col:s.col, v:s.cap, k:s.k};   // L2258
var B = I2.src.map(function(s){ return {nm:s.nm, col:s.col, v:s.cap*(s.fc/100)*8.76, k:s.k};   // L2259
var tA = A.reduce(function(a,b){ return a+b.v;   // L2260
var tB = B.reduce(function(a,b){ return a+b.v;   // L2261
var rA = A.slice().sort(function(a,b){ return b.v-a.v;   // L2262
var rB = B.slice().sort(function(a,b){ return b.v-a.v;   // L2263
var posA = {}, posB = {};   // L2264
var moved = pos[x.k] !== other[x.k];   // L2271
var trocas = I2.src.filter(function(s){ return posA[s.k] !== posB[s.k];   // L2278
var maiorSubida = null, maiorQueda = null;   // L2279
var pa = tA>0 ? s.cap/tA*100 : 0;   // L2281
var pb = tB>0 ? (s.cap*(s.fc/100)*8.76)/tB*100 : 0;   // L2282
var d = pb - pa;   // L2283
```

| Saída | Expressão (script) | Unidade | Linha |
|---|---|---|---|
| Capacidade total | `f1(tA)` | GW | 2288 |
| Geração implícita | `f0(tB)` | TWh/ano | 2289 |
| Fator de capacidade médio | `(tA>0? f1(tB/(tA*8.76)*100):'0,0')` | % | 2290 |
| Fontes que trocam de posição | `trocas.length` | — | 2291 |

- **Ramos de leitura (3):** L2293 `trocas.length === 0` → L2296 `trocas.length <= 2` → L2299 `else`
- **Cenário-padrão (fonte executada):** Capacidade total = 261,0 GW; Geração implícita = 761 TWh/ano; Fator de capacidade médio = 33,3 %; Fontes que trocam de posição = 2 · veredito (`verdict ok`): "2 trocas de posição. A fonte que mais ganha participação ao passar de capacidade para geração é Hidrelétrica, com 10,5 pontos percentuais de ganho; a que mais perde é Solar, com 13,3 pontos de perda. A direção do movimen…" · legenda_pizza1: "Hidrelétrica · 42,2% Solar · 24,8% ↔ trocou Eólica · 13,3% ↔ trocou Térmica fóssil · 12,2% Biomassa · 6,7% Nuclear · 0,8%" · legenda_pizza2: "Hidrelétrica · 52,7% Eólica · 15,3% ↔ trocou Solar · 11,6% ↔ trocou Térmica fóssil · 10,1% Biomassa · 8,3% Nuclear · 2,1%"
- **Fonte dos números:** "Referência inicial: capacidade e geração por fonte no conceito amplo do balanço energético, ano-base 2025, publicado em junho de 2026; fatores de capacidade derivados da razão entre as duas séries. Consulta em 1º de agosto de 2026."
- **Aviso:** "Didático/ilustrativo. O cálculo usa capacidade média do período implícita nos valores digitados; não modela entrada de usinas ao longo do ano, indisponibilidade nem corte de geração. Serve para ensinar a relação entre as grandezas, não para dimensionar projeto."
- **Tolerância:** `null` (não declarada)
- **Código — divergente** (`m08-inst-02`). Problemas: campo formula do código não existe como texto na fonte: "TWh/ano = GW × (FC ÷ 100) × 8,76".
  Prova diferencial: 401 casos (padrão, 4 com capacidade zero, 396 aleatórios semente fixa); ks=hid,sol,eol,bio,fos,nuc; 401 casos; numéricas iguais 1.604, diferentes 0; texto completo 401, incompleto 0; veredito da fonte contido no do código 401.

## Inst · 03 — Calculadora de fator de capacidade · com faixa típica por fonte

- **Escopo:** instrumento de aula. **Invocação:** seção `a01` (`aula-08-01`), subseção 1.3 "Eixo 3 — o recorte, que é invisível e decide tudo"; `div.inst` em L679–713.
- **Antes:** `p` L675 "Quando duas fontes dão percentuais diferentes para a mesma fonte no mesmo ano, a primeira …". **Depois:** `div class="box gd"` L715 "Onde isso entra no produto Os três eixos são a especificação de metadado de qualquer paine…"
- **Pergunta:** `null`. **Intro:** "Entre com a potência instalada, a energia gerada e o período. O instrumento devolve o fator de capacidade e o compara com a faixa típica da fonte selecionada — e diz o que um valor fora da faixa costuma indicar."
- **Entrada "Fonte de referência"** (`i3-seg`): Hidrelétrica (padrão) · Eólica · Solar · Biomassa · Gás natural · Nuclear
- **Entrada "Potência instalada"** (MW): `i3-p` range 1–15000, passo 1, padrão 300; `i3-pn` number 1–15000, passo 1, padrão 300
- **Entrada "Energia gerada no período"** (GWh): `i3-e` range 1–80000, passo 1, padrão 1200; `i3-en` number 1–80000, passo 1, padrão 1200
- **Entrada "Período"** (horas): `i3-h` range 24–8784, passo 1, padrão 8760; `i3-hn` number 24–8784, passo 1, padrão 8760
- *Campo number pareado com range gêmeo (mesmas faixas no markup); pairSlider grampeia pelo min/max do range. Campo vazio no number é ignorado até o blur.*
- **Cálculo (`i3calc`, literal):**

```js
var p = i3get.p(), e = i3get.e(), h = i3get.h();   // L2336
var teor = p * h / 1000;   // L2337
var fc = teor > 0 ? (e / teor) * 100 : 0;   // L2338
var fx = I3.faixas[I3.s];   // L2339
var horasEq = p > 0 ? (e*1000)/p : 0;   // L2340
```

| Saída | Expressão (script) | Unidade | Linha |
|---|---|---|---|
| Energia teórica máxima | `f0(teor)` | GWh | 2342 |
| Fator de capacidade | `f1(fc)` | % | 2343 |
| Horas equivalentes a plena carga | `f0(horasEq)` | h | 2344 |

- **Ramos de leitura (4):** L2347 `fc > 100` → L2350 `fc < fx.lo` → L2353 `fc > fx.hi` → L2356 `else`
- **Cenário-padrão (fonte executada):** Energia teórica máxima = 2628 GWh; Fator de capacidade = 45,7 %; Horas equivalentes a plena carga = 4000 h; Faixa típica · Hidrelétrica = 40% a 60% · veredito (`verdict ok`): "Dentro da faixa típica de Hidrelétrica. As 4000 horas equivalentes a plena carga são a tradução mais intuitiva do resultado: é como se a usina tivesse operado no máximo durante esse número de horas e ficado parada no res…"
- **Fonte dos números:** `null`. Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Aviso:** "Didático/ilustrativo. As faixas típicas são ordens de grandeza para leitura rápida, não parâmetros de projeto: o valor real varia por sítio, ano, altura de torre, tecnologia, disponibilidade e corte de geração. Um fator fora da faixa é sinal para investigar, nunca prova de erro."
- **Tolerância:** `null` (não declarada)
- **Código — divergente** (`m08-inst-03`). Problemas: campo formula do código não existe como texto na fonte: "FC = energia gerada ÷ (potência × período) × 100"; 1104 casos com texto da fonte incompleto no código.
  Prova diferencial: 6 fontes × 184 pontos (4 bordas, 120 aleatórios, 60 com FC ≤ 100%); 1.104 casos; numéricas iguais 3.312, diferentes 0; texto completo 0, incompleto 1.104; veredito da fonte contido no do código 1.104. Tokens ausentes mais frequentes: a (1104), hidrelétrica (184), eólica (184), solar (184), biomassa (184), gás (184), natural (184), nuclear (184).

## Inst · 04 — Reconstrutor de matriz · desenhe as duas pizzas de memória

- **Escopo:** instrumento de aula. **Invocação:** seção `a02` (`aula-08-02`); `div.inst` em L803–827.
- **Antes:** `p` L799 "Todos os percentuais e volumes destas seis fichas referem-se a 2025, no conceito amplo do …". **Depois:** `p` L829 "Dois vieses aparecem quase sempre na primeira rodada, e vale saber deles antes de tentar. …"
- **Frases da seção com "instrumento/reconstrutor"** (sinal, não vínculo): L845: "E o reconstrutor é o raro objeto de produto que também é objeto de marketing — é a peça que circula sozinha, porque quem a usa erra, descobre que errou e quer contar para alguém."
- **Pergunta:** `null`. **Intro:** "Este é o instrumento que atende diretamente o critério de domínio, e é o único do sistema Alexandria que exige que você produza a resposta antes de ver a correção. Sem consultar as fichas acima: estime a fatia de cada fonte, primeiro em capacidade, depois em geração. O instrumento devolve o erro por fonte, o erro total e o diagnóstico do seu viés."
- **Entrada "Rodada"** (`i4-seg`): 1 · Capacidade instalada (padrão) · 2 · Geração efetiva
- **Entradas geradas pelo script:** Hidrelétrica (% da pizza; `i4i-hid` 0–100, padrão vazio "—"); Solar (% da pizza; `i4i-sol` 0–100, padrão vazio "—"); Eólica (% da pizza; `i4i-eol` 0–100, padrão vazio "—"); Biomassa (% da pizza; `i4i-bio` 0–100, padrão vazio "—"); Térmica fóssil (% da pizza; `i4i-fos` 0–100, padrão vazio "—"); Nuclear (% da pizza; `i4i-nuc` 0–100, padrão vazio "—")
- **Botões:** "Corrigir esta rodada", "Normalizar para 100%", "Zerar"
- **Cálculo (`i4check`, literal):**

```js
var pal = I4.pal[I4.r], ref = I4.ref[I4.r];   // L2415
var faltando = I4.fontes.filter(function(f){ return pal[f.k] === undefined;   // L2416
var soma = I4.fontes.reduce(function(a,f){ return a + pal[f.k];   // L2424
var rows = [], errTotal = 0, acertos = 0, superest = [], subest = [];   // L2425
var d = pal[f.k] - ref[f.k];   // L2427
var w = Math.min(50, Math.abs(d)/30*50);   // L2431
var cls = Math.abs(d) <= I4.tol ? '' : (d > 0 ? ' over' : ' under');   // L2432
var style = d >= 0 ? 'left:50%;   // L2433
var ordPal = I4.fontes.slice().sort(function(a,b){ return pal[b.k]-pal[a.k];   // L2438
var ordRef = I4.fontes.slice().sort(function(a,b){ return ref[b.k]-ref[a.k];   // L2439
var ordemOk = ordPal === ordRef;   // L2440
var cls, msg = '';   // L2448
var pal = I4.pal[I4.r];   // L2487
var s = I4.fontes.reduce(function(a,f){ return a + (pal[f.k]||0);   // L2488
```

| Saída | Expressão (script) | Unidade | Linha |
|---|---|---|---|
| Fontes dentro da tolerância | `acertos` | de 6 | 2443 |
| Erro absoluto total | `f1(errTotal)` | pp | 2444 |
| Sua soma | `f1(soma)` | % | 2445 |
| Ordem das fontes | `(ordemOk?'Correta':'Incorreta')` | — | 2446 |

- **Ramos de leitura (9):** L2418 `faltando.length` → L2449 `Math.abs(soma-100) > 8` → L2452 `ordemOk && acertos === 6` → L2455 `ordemOk` → L2458 `else` → L2462 `superest.length || subest.length` → L2466 `I4.r === 'cap' && subest.indexOf('Térmica fóssil') >= 0` → L2469 `I4.r === 'ger' && superest.indexOf('Solar') >= 0` → L2472 `I4.r === 'ger' && subest.indexOf('Hidrelétrica') >= 0`
- **Cenário-padrão (fonte executada):**  · veredito (`verdict att`): "Rodada de capacidade instalada. Estime a fatia de cada fonte na potência nominal instalada, no conceito amplo — incluindo geração distribuída e autoprodução. Pense em tamanho de parque, não em energia produzida."
- **Fonte dos números:** "Fonte da referência: balanço energético nacional, relatório síntese, ano-base 2025, publicado em junho de 2026, complementado pelo anuário estatístico de energia elétrica do mesmo ciclo. Consulta: 1º de agosto de 2026."
- **Aviso:** "Didático/ilustrativo. A tolerância de acerto é de 3 pontos percentuais por fonte, escolhida porque abaixo disso o exercício vira decoreba de decimal, que é exatamente o que este módulo não quer treinar. O que conta é a ordem e a ordem de grandeza."
- **Tolerância:** 3 pontos percentuais por fonte (declarada: L2385, L825)
- **Detalhe (`details`):** "Valores de referência usados na correção — abra só depois de tentar"
- **Código — divergente** (`m08-inst-04-cap`, `m08-inst-04-ger`). Problemas: título do código difere: "Reconstrutor de matriz · desenhe as duas pizzas de memória — 1 · Capacidade instalada"; título do código difere: "Reconstrutor de matriz · desenhe as duas pizzas de memória — 2 · Geração efetiva"; 783 casos com texto da fonte incompleto no código.
  Prova diferencial: 2 rodadas × 400 (10 com campos vazios, 190 perto da referência, 200 aleatórios); 800 casos; numéricas iguais 2.349, diferentes 0; texto completo 17, incompleto 783; veredito da fonte contido no do código 800. Tokens ausentes mais frequentes: pp (783), eólica (783), biomassa (783), fontes (783), ordem (783), das (783), solar (783), térmica (783).

## Inst · 05 — Leitura lateral · o mesmo campo nas seis fontes

- **Escopo:** instrumento de aula. **Invocação:** seção `a02` (`aula-08-02`); `div.inst` em L832–841.
- **Antes:** `p` L829 "Dois vieses aparecem quase sempre na primeira rodada, e vale saber deles antes de tentar. …". **Depois:** `div class="box gd"` L843 "Onde isso entra no produto A ficha de campo fixo é a estrutura de dados de um painel de fo…"
- **Frases da seção com "instrumento/reconstrutor"** (sinal, não vínculo): L845: "E o reconstrutor é o raro objeto de produto que também é objeto de marketing — é a peça que circula sozinha, porque quem a usa erra, descobre que errou e quer contar para alguém."
- **Pergunta:** `null`. **Intro:** "As fichas acima se leem na vertical, uma fonte de cada vez. Este instrumento vira a tabela: escolha um campo e veja as seis fontes lado a lado. É onde os padrões do sistema aparecem — e onde fica claro que sazonalidade, e não volume, é o que organiza a operação."
- **Entrada "Campo em exibição"** (`i5-chips`): opções geradas pelo script
- **Controles:** Sete chips .tr-chip gerados por i5render() a partir de I5.campos; clique troca I5.sel.
- **Cálculo (`i5render`, literal):**

```js
var rows = Object.keys(I5.dados).map(function(f){ return '<div class="src-row"><div class="src-k">'+esc(f)+'</div><div class="src-v">'+I5.dados[f][I5.sel]+'</div></div>';   // L2583
```

- **Cenário-padrão (fonte executada):** corpo_texto: "Hidrelétrica Segue o regime de chuvas de cada bacia. Úmido de novembro a abril no Sudeste/Centro-Oeste. A diversidade entre bacias é o que a integração nacional existe para aproveitar. Eólica No Norde…"
- **Fonte dos números:** `null`. Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Aviso:** "Didático/ilustrativo. Os textos são os mesmos das fichas, reorganizados por campo. Grandezas verificadas em 1º de agosto de 2026 e sujeitas a atualização anual."
- **Tolerância:** `null` (não declarada)
- **Código — divergente** (`m08-inst-05`). Problemas: disclaimer (p.disc) não aparece verbatim na nota do código.
  Prova diferencial: exaustivo (7 campos); 7 casos; numéricas iguais 0, diferentes 0; texto completo 7, incompleto 0; veredito da fonte contido no do código 0.

## Inst · 06 — Curvas de complementaridade · três escalas sobrepostas

- **Escopo:** instrumento de aula. **Invocação:** seção `a03` (`aula-08-03`), subseção 3.2 "Escala do dia — a carga líquida e a rampa"; `div.inst` em L915–931.
- **Antes:** `div` L900 "Complementaridade · três níveis Criança de 12 anos Executivo Especialista Imagina um time …". **Depois:** `p` L933 "Alterne para "domingo de sol" e observe o que muda. A carga cai porque a indústria e o com…"
- **Pergunta:** `null`. **Intro:** "Alterne a escala de tempo e ligue ou desligue cada fonte. A linha branca é a carga; a linha tracejada é a carga líquida, ou seja, a carga menos o que o operador não comanda. Quando a soma das fontes ligadas ultrapassa a carga líquida, a área de excedente aparece em vermelho — e essa área é o corte de geração antes de ele ter nome."
- **Entrada "Escala de tempo"** (`i6-seg`): Mês a mês · o ano (padrão) · Hora a hora · dia útil · Hora a hora · domingo de sol
- **Controles:** Chaves .src-t[data-k] geradas por i6render(): uma por fonte (hid, eol, sol, bio, fos), alternam I6.on[k]; mais duas etiquetas fixas "Soma das ligadas" e "Carga e carga líquida".
- **Cálculo (`i6render`, literal):**

```js
var d = I6.dados[I6.e], lb = I6.eixos[I6.e];   // L2640
var W = 700, H = 300, ml = 42, mr = 12, mt = 14, mb = 26;   // L2641
var pw = W-ml-mr, ph = H-mt-mb, n = 12;   // L2642
var maxV = 100;   // L2643
var s = ['<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">'];   // L2646
var yv = g*25, y = Y(yv);   // L2648
var soma = [];   // L2655
var t = 0;   // L2657
var exc = [];   // L2661
var pts = [];   // L2663
var poly = [];   // L2666
var p = arr.map(function(v,i){ return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1);   // L2672
var k = t.getAttribute('data-k');   // L2687
var horasExc = exc.filter(function(v){ return v > 0;   // L2690
var maxExc = Math.max.apply(null, exc);   // L2691
var deficit = [];   // L2692
var maxDef = Math.max.apply(null, deficit);   // L2694
var ligadas = Object.keys(I6.on).filter(function(k){ return I6.on[k];   // L2695
```

| Saída | Expressão (script) | Unidade | Linha |
|---|---|---|---|
| Fontes ligadas | `ligadas` | de 5 | 2697 |
| Pontos com excedente | `horasExc` | de 12 | 2698 |
| Maior excedente | `f0(maxExc)` | un. | 2699 |
| Maior déficit contra a carga | `f0(maxDef)` | un. | 2700 |

- **Ramos de leitura (5):** L2665 `pts.length` → L2702 `ligadas === 0` → L2705 `horasExc === 0` → L2708 `horasExc <= 3` → L2711 `else`
- **Cenário-padrão (fonte executada):** Fontes ligadas = 5 de 5; Pontos com excedente = 12 de 12; Maior excedente = 23 un.; Maior déficit contra a carga = 4 un. · veredito (`verdict per`): "Escala anual. A hidráulica desce de janeiro a setembro e sobe de volta com as chuvas; a eólica faz o caminho inverso, com pico entre julho e setembro; a biomassa acompanha a safra da cana, de abril a novembro; a térmica …"
- **Fonte dos números:** `null`. Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Aviso:** "Didático/ilustrativo. As curvas são perfis estilizados construídos para tornar visível a relação entre as fontes e a carga; não são séries medidas e não devem ser usadas para dimensionamento. Para série real, o portal de dados abertos do operador publica geração por fonte e por submercado em resolução horária."
- **Tolerância:** `null` (não declarada)
- **Código — divergente** (`m08-inst-06`). Problemas: disclaimer (p.disc) não aparece verbatim na nota do código.
  Prova diferencial: exaustivo (3 escalas × 32 combinações de fontes = 96); 96 casos; numéricas iguais 384, diferentes 0; texto completo 96, incompleto 0; veredito da fonte contido no do código 96.

## Inst · 07 — Calendário sazonal · doze meses do sistema

- **Escopo:** instrumento de aula. **Invocação:** seção `a03` (`aula-08-03`), subseção 3.3 "O calendário do sistema"; `div.inst` em L940–948.
- **Antes:** `p` L937 "Juntando as três escalas, o ano do sistema elétrico brasileiro tem um formato reconhecível…". **Depois:** `div class="box gd"` L950 "Onde isso entra no produto As curvas sobrepostas e o perfil intradiário são, literalmente,…"
- **Pergunta:** `null`. **Intro:** "Clique em qualquer mês. O painel mostra o que está acontecendo simultaneamente com chuva, vento, safra, carga e risco de corte — porque a leitura útil não é de uma variável de cada vez, é da coincidência entre elas."
- **Controles:** Doze células .cal-m geradas por i7render() com m.nm.slice(0,3); clique troca I7.sel.
- **Cálculo (`i7render`, literal):**

```js
var m = I7.meses[I7.sel-1];   // L2760
```

- **Cenário-padrão (fonte executada):** painel: "Mês 7 Julho Começa a safra dos ventos no Nordeste, e com ela o período de maior tensão de escoamento do ano. Vento forte, carga baixa e sol razoável coincidem, e a fronteira de exportação da região pa…"
- **Fonte dos números:** `null`. Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Aviso:** "Didático/ilustrativo. Regimes típicos e aproximados: o comportamento real de cada ano varia com fenômenos climáticos de grande escala e com a distribuição regional de precipitação. O calendário ensina o padrão, não prevê o ano."
- **Tolerância:** `null` (não declarada)
- **Código — divergente** (`m08-inst-07`). Problemas: disclaimer (p.disc) não aparece verbatim na nota do código.
  Prova diferencial: exaustivo (12 meses); cabeçalho "Mês N" comparado à parte (saída numérica i7-mes); 12 casos; numéricas iguais 0, diferentes 0; texto completo 12, incompleto 0; veredito da fonte contido no do código 0.

## Inst · 08 — Termômetro hidrológico · estoque contra fluxo

- **Escopo:** instrumento de aula. **Invocação:** seção `a04` (`aula-08-04`), subseção 4.1 "Duas grandezas que apontam para lados opostos"; `div.inst` em L1001–1039.
- **Antes:** `p` L998 "Olhe o Nordeste e o Sudeste/Centro-Oeste lado a lado. O Nordeste tem quase o dobro do esto…". **Depois:** `h3` L1041 "4.2 O piso que ninguém vê…"
- **Frases da seção com "instrumento/reconstrutor"** (sinal, não vínculo): L998: "A leitura correta precisa das duas dimensões simultaneamente — que é exatamente o que o instrumento abaixo faz." · L1043: "Some a isso o fato de a geração hidráulica ser o principal instrumento de controle de frequência do sistema, e o resultado é um piso de geração hidráulica abaixo do qual o operador não desce."
- **Pergunta:** `null`. **Intro:** "Duas dimensões, quatro quadrantes, quatro diagnósticos completamente diferentes. Mova os controles e observe o ponto migrar. Os valores iniciais são a fotografia declarada abaixo; substitua-os pelo dado do dia e o instrumento continua correto."
- **Entrada "Carregar fotografia de"** (`i8-seg`): Sudeste/Centro-Oeste (padrão) · Sul · Nordeste · Norte
- **Entrada "Afluência do mês"** (% da média de longo termo): `i8-ena` range 10–200, passo 1, padrão 93; `i8-enan` number 10–200, passo 1, padrão 93
- **Entrada "Energia armazenada"** (% do volume útil): `i8-ear` range 0–100, passo 1, padrão 66; `i8-earn` number 0–100, passo 1, padrão 66
- **Entrada "Posição no ciclo anual"** (mês): `i8-mes` range 1–12, passo 1, padrão 6; `i8-mesn` number 1–12, passo 1, padrão 6
- *Campo number pareado com range gêmeo (mesmas faixas no markup); pairSlider grampeia pelo min/max do range. Campo vazio no number é ignorado até o blur.*
- **Rótulos fixos do markup:** "Fluxo · afluência" (unidade "% MLT", `#i8-vena`) L1030 · "Estoque · armazenamento" (unidade "% útil", `#i8-vear`) L1031
- **Cálculo (`i8calc`, literal):**

```js
var ena = i8get.ena(), ear = i8get.ear(), mes = i8get.mes();   // L2782
var umido = (mes >= 11 || mes <= 4);   // L2783
var qx = clamp((ena-10)/190*100, 0, 100);   // L2786
var qy = 100 - ear;   // L2787
var tend = ena >= 100 ? 'recompondo' : (ena >= 80 ? 'estável' : 'deteriorando');   // L2796
var meses = ena > 0 ? Math.max(0, Math.round(ear / Math.max(4, (100-ena)/6))) : 0;   // L2797
```

| Saída | Expressão (script) | Unidade | Linha |
|---|---|---|---|
| Quadrante | `(ear>=50?'Estoque alto':'Estoque baixo')+' · '+(ena>=100?'fluxo forte':'fluxo fraco')` | — | 2799 |
| Tendência do estoque | `tend` | — | 2800 |
| Posição no ciclo | `(umido?'Período úmido':'Período seco')` | — | 2801 |
| Folga aproximada | `meses` | meses | 2802 |

- **Ramos de leitura (4):** L2804 `ear >= 50 && ena >= 100` → L2807 `ear >= 50 && ena < 100` → L2813 `ear < 50 && ena >= 100` → L2816 `else`
- **Cenário-padrão (fonte executada):** Quadrante = Estoque alto · fluxo fraco; Tendência do estoque = estável; Posição no ciclo = Período seco; Folga aproximada = 17 meses · termômetro 93% MLT / 66% útil · veredito (`verdict ok`): "Estoque alto com fluxo próximo do normal. Situação que se sustenta. Está entrando aproximadamente o normal para o mês e o estoque está acima da metade. É o estado em que a operação tem liberdade para modular e usar a hid…"
- **Fonte dos números:** "Fotografias iniciais: afluência e armazenamento por subsistema em junho de 2026, conforme reportado ao comitê de monitoramento do setor elétrico. Consulta: 1º de agosto de 2026."
- **Aviso:** "Didático/ilustrativo. O diagnóstico é qualitativo e serve para treinar a leitura conjunta das duas grandezas. Não substitui o programa mensal de operação, que incorpora previsão meteorológica, restrição de uso múltiplo, cronograma de manutenção e limites de intercâmbio."
- **Tolerância:** `null` (não declarada)
- **Código — portado** (`m08-inst-08`). Sem problemas.
  Prova diferencial: exaustivo (afluência 10–200 × armazenamento 0–100 × mês 1–12 = 231492); 231.492 casos; numéricas iguais 231.492, diferentes 0; texto completo 231.492, incompleto 0; veredito da fonte contido no do código 231.492.

## Inst · 09 — Anatomia do corte de geração · causa, hora e quem paga

- **Escopo:** instrumento de aula. **Invocação:** seção `a05` (`aula-08-05`), subseção 5.5 "O gargalo e o corte"; `div.inst` em L1185–1218.
- **Antes:** `p` L1182 "O que esse resultado diz não é que a geração distribuída seja indesejável. Diz que o corte…". **Depois:** `p` L1220 "Sobre o horizonte: o plano da operação elétrica de médio prazo indicou, para o ciclo 2026-…"
- **Pergunta:** `null`. **Intro:** "Monte um cenário: escolha o patamar horário, o dia da semana, a região e a condição da rede. O instrumento devolve qual causa de corte predomina, sobre qual fonte ela recai e o que efetivamente resolveria aquele caso — que quase nunca é o que a manchete sugere."
- **Entrada "Patamar horário"** (`i9-pat`): P1 · 00h–07h · P2 · transição · P3 · 09h–16h (padrão) · P4 · 18h–24h
- **Entrada "Dia"** (`i9-dia`): Dia útil (padrão) · Domingo ou feriado
- **Entrada "Região da usina"** (`i9-reg`): Nordeste (padrão) · Norte · Sudeste/Centro-Oeste · Sul
- **Entrada "Condição da rede"** (`i9-rede`): Normal (padrão) · Limite de exportação atingido · Equipamento indisponível
- **Cálculo (`i9calc`, literal):**

```js
var p = I9.pat, d = I9.dia, r = I9.reg, n = I9.rede;   // L2840
var diurno = (p === 'P3');   // L2841
var transic = (p === 'P2');   // L2842
var noturno = (p === 'P1' || p === 'P4');   // L2843
var cargaBaixa = diurno || p === 'P1' || (d === 'fds');   // L2844
var causa, fonte, resolve, sev, expl;   // L2845
```

| Saída | Expressão (script) | Unidade | Linha |
|---|---|---|---|
| Causa predominante | `esc(causa)` | — | 2883 |
| Sobre quem recai | `esc(fonte)` | — | 2884 |
| O que efetivamente resolve | `esc(resolve)` | — | 2885 |
| Carga líquida no patamar | `(cargaBaixa?'Baixa':'Elevada')` | — | 2886 |

- **Ramos de leitura (5):** L2846 `n === 'ind'` → L2852 `diurno || (transic && d === 'fds')` → L2860 `n === 'lim' && (r === 'ne' || r === 'no')` → L2867 `n === 'lim'` → L2873 `else`
- **Cenário-padrão (fonte executada):** Causa predominante = Razão energética; Sobre quem recai = Predominantemente fotovoltaica centralizada, com parcela eólica no rateio; O que efetivamente resolve = Armazenamento, flexibilidade de demanda, resposta da carga e moderação da expansão correlacionada; Carga líquida no patamar = Baixa · veredito (`verdict per`): "No patamar de maior irradiância, a soma da geração distribuída, da solar centralizada, da eólica, da térmica inflexível e da hidráulica no piso pode exceder a carga líquida. Quando isso acontece, o corte ocorreria mesmo …"
- **Fonte dos números:** `null`. Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Aviso:** "Didático/ilustrativo. O instrumento aplica a lógica de classificação publicada pelo operador — quando há simultaneidade de causas, prevalece a razão energética, porque o corte ocorreria mesmo com transmissão infinita. Não reproduz despacho real nem regra de ressarcimento; para o caso concreto, valem os procedimentos de rede e a regulação vigente."
- **Tolerância:** `null` (não declarada)
- **Código — portado** (`m08-inst-09`). Sem problemas.
  Prova diferencial: exaustivo (4 × 2 × 4 × 3 = 96); 96 casos; numéricas iguais 0, diferentes 0; texto completo 96, incompleto 0; veredito da fonte contido no do código 96.

## Inst · 10 — Perfil de carga · casamento com a curva de geração

- **Escopo:** instrumento de aula. **Invocação:** seção `a06` (`aula-08-06`), subseção 6.4 "Quem consome, quanto e em que formato"; `div.inst` em L1325–1355.
- **Antes:** `p` L1322 "A segunda: o ambiente livre respondeu por cerca de 45% do consumo em 2025, contra cerca de…". **Depois:** `h3` L1357 "6.5 A carga que ainda não existe…"
- **Frases da seção com "instrumento/reconstrutor"** (sinal, não vínculo): L1277: "É o mesmo instrumento nos dois casos abaixo."
- **Pergunta:** `null`. **Intro:** "Duas plantas com o mesmo consumo anual podem ter custo e risco completamente diferentes. Monte um perfil e veja o fator de carga resultante, a demanda de ponta implícita e qual fonte casa melhor com a curva — e qual introduz descasamento que precisaria ser coberto."
- **Entrada "Consumo anual"** (GWh/ano): `i10-c` range 1–600, passo 1, padrão 120; `i10-cn` number 1–600, passo 1, padrão 120
- **Entrada "Horas de operação por dia"** (h): `i10-h` range 4–24, passo 1, padrão 24; `i10-hn` number 4–24, passo 1, padrão 24
- **Entrada "Dias de operação por semana"** (dias): `i10-d` range 1–7, passo 1, padrão 7; `i10-dn` number 1–7, passo 1, padrão 7
- **Entrada "Concentração no turno diurno"** (% do consumo): `i10-t` range 0–100, passo 1, padrão 40; `i10-tn` number 0–100, passo 1, padrão 40
- *Campo number pareado com range gêmeo (mesmas faixas no markup); pairSlider grampeia pelo min/max do range. Campo vazio no number é ignorado até o blur.*
- **Cálculo (`i10calc`, literal):**

```js
var c = i10get.c(), h = i10get.h(), d = i10get.d(), t = i10get.t();   // L2902
var horasAno = h * d * 52;   // L2903
var demMed = horasAno > 0 ? (c*1000)/horasAno : 0;   // L2904
var demMedAnual = c*1000/8760;   // L2905
var fatorCarga = demMed > 0 ? (demMedAnual/demMed)*100 : 0;   // L2906
var horasDiurnas = Math.min(h, 7);   // L2907
var energiaDiurna = c * (t/100);   // L2908
var potDiurna = (horasDiurnas*d*52) > 0 ? (energiaDiurna*1000)/(horasDiurnas*d*52) : 0;   // L2909
var coberturaSolar = demMed > 0 ? Math.min(100, (potDiurna/demMed)*100*(horasDiurnas/Math.max(h,1))) : 0;   // L2910
```

| Saída | Expressão (script) | Unidade | Linha |
|---|---|---|---|
| Demanda média em operação | `f1(demMed)` | MW | 2912 |
| Fator de carga anual | `f1(fatorCarga)` | % | 2913 |
| Horas de operação por ano | `f0(horasAno)` | h | 2914 |
| Cobertura solar teórica | `f0(coberturaSolar)` | % | 2915 |

- **Ramos de leitura (8):** L2917 `fatorCarga >= 85` → L2920 `fatorCarga >= 55` → L2923 `fatorCarga >= 30` → L2926 `else` → L2930 `t >= 70 && horasDiurnas >= 6` → L2932 `t <= 35` → L2934 `else` → L2937 `h >= 20 && d >= 6`
- **Cenário-padrão (fonte executada):** Demanda média em operação = 13,7 MW; Fator de carga anual = 99,7 %; Horas de operação por ano = 8736 h; Cobertura solar teórica = 40 % · veredito (`verdict ok`): "Perfil praticamente contínuo, fator de carga de 99,7%. É o perfil típico de mineração, metalurgia, química de base e papel e celulose. A boa notícia: demanda contratada bem aproveitada e previsibilidade alta. A notícia r…"
- **Fonte dos números:** `null`. Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Aviso:** "Didático/ilustrativo. O modelo é simplificado e trabalha com perfil retangular por turno; a curva real de uma planta tem picos de partida, paradas e sazonalidade de produção que só a medição de quinze minutos revela. Não trata de estrutura tarifária nem de modalidade, que são matéria do Bloco 10."
- **Tolerância:** `null` (não declarada)
- **Código — divergente** (`m08-inst-10`). Problemas: campo formula do código não existe como texto na fonte: "fator de carga = (consumo ÷ 8.760) ÷ demanda média em operação × 100".
  Prova diferencial: grade (h 4–24 × d 1–7 × t 0–100 passo 5, c=120) + 3000 aleatórios + padrão = 6088; 6.088 casos; numéricas iguais 24.352, diferentes 0; texto completo 6.088, incompleto 0; veredito da fonte contido no do código 6.088.

## Inst · 11 — Roteador de recorte · qual base responde a qual pergunta

- **Escopo:** instrumento de aula. **Invocação:** seção `a07` (`aula-08-07`), subseção 7.4 "Duas armadilhas de série temporal"; `div.inst` em L1418–1445.
- **Antes:** `p` L1415 "A segunda armadilha tem um exemplo concreto e recente neste próprio bloco: até março de 20…". **Depois:** `h3` L1447 "7.5 O que sobra quando os números vencerem…"
- **Pergunta:** `null`. **Intro:** "Diga que pergunta você precisa responder e com que granularidade. O instrumento devolve qual base abrir, qual universo ela cobre, com que defasagem publica e qual é a armadilha específica daquela série. É o fechamento do ciclo aberto no Módulo 07."
- **Entrada "Sobre o que é a pergunta"** (`i11-tema`): Capacidade instalada (padrão) · Geração por fonte · Condição hidrológica · Corte de geração · Consumo e mercado · Expansão futura
- **Entrada "Granularidade necessária"** (`i11-gran`): Tempo real ou diária (padrão) · Mensal · Anual consolidada
- **Entrada "Uso pretendido"** (`i11-uso`): Análise interna (padrão) · Material publicado
- **Cálculo (`i11render`, literal):**

```js
var d = I11DB[I11.tema][I11.gran];   // L2987
var pub = I11.uso === 'pub';   // L2988
```

- **Cenário-padrão (fonte executada):** ficha_texto: "Sistema de informações de geração da agência reguladora Base indicada Universo que ela cobre Usinas centralizadas outorgadas, em construção e em operação, por empreendimento Cadência e defasagem Atual…"
- **Fonte dos números:** `null`. Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Aviso:** "Didático/ilustrativo. O roteador indica a base de referência mais apropriada e as cadências típicas; datas exatas de publicação e nomes de arquivo mudam a cada ciclo, e a nomenclatura das séries pode ser revista. Confirme sempre no portal da fonte antes de citar."
- **Tolerância:** `null` (não declarada)
- **Código — portado** (`m08-inst-11`). Sem problemas.
  Prova diferencial: exaustivo (6 × 3 × 2 = 36); 36 casos; numéricas iguais 0, diferentes 0; texto completo 36, incompleto 0; veredito da fonte contido no do código 36.

### Leitura dos "divergentes"

- **Nenhuma divergência numérica** em nenhum instrumento (0 em todas as provas).
- **INST 02, 03, 10:** o código tem um campo `formula` com texto que a fonte não escreve (fórmula didática redigida no porte).
- **INST 03:** falta no código o quarto readout textual "Faixa típica · {fonte}" / "lo% a hi%".
- **INST 04:** o toggle de rodada virou dois instrumentos (`-cap`, `-ger`) com título acrescido; faltam o readout "Ordem das fontes" (Correta/Incorreta) e a lista de erro por fonte em pp; o `details` de referência editável não foi portado.
- **INST 01, 05, 06, 07:** intro e/ou aviso não aparecem verbatim na `note` do código; SVG/curvas/calendário não portam (protocolo §12).

## Divergências internas da fonte

| Id | Severidade | Tipo | Instrumentos | Tema |
|---|---|---|---|---|
| `inst-div-01` | alta | fonte×fonte | m08-inst-02, m08-inst-04 | Ordem da pizza de geração: o Conversor (INST 02, valores iniciais) e a referência do Reconstrutor (INST 04) não concordam |
| `inst-div-02` | média | fonte×fonte | m08-inst-04 | Ordem de capacidade: o Ex·02 fala em "térmica agregada em terceiro, perto de vinte por cento" e "eólica em quarto"; o INST 04 separa biomassa e fóssil e põe eólica (13,3) em 3º e fóssil (12,2) em 4º |
| `inst-div-03` | média | fonte×fonte | m08-inst-04, m08-inst-05 | Biomassa e térmica fóssil "não aparecem separadas na pizza de capacidade" (INST 05, leitura "cap", e fichas da Aula 02), mas o INST 04 pede e corrige as duas separadamente na rodada de capacidade, e o INST 02 também as separa |
| `inst-div-04` | alta | fonte×fonte (P20 · CONTENT QA) | m08-inst-02, m08-inst-03, m08-inst-05 | Faixas típicas de fator de capacidade divergem entre a calculadora (INST 03), a leitura lateral (INST 05) e as fichas da Aula 02; e o FC inicial da solar no INST 02 (15,5%) fica abaixo da faixa típica solar declarada em todas elas (20–30%) |
| `inst-div-05` | baixa | fonte×fonte | m08-inst-05 | O disclaimer do INST 05 diz "Os textos são os mesmos das fichas, reorganizados por campo", mas os textos do script são versões encurtadas/reescritas das fichas |
| `inst-div-06` | média | fonte (interna) | m08-inst-08 | INST 08: o readout "Quadrante" corta em 100% da MLT (fluxo forte/fraco), mas o veredito corta em 70% ("fraco" × "próximo do normal"). No estado inicial (93% / 66%) o readout diz "fluxo fraco" e o veredito diz "fluxo próximo do normal"; "Tendência" corta em 80% e diz "estável" |
| `inst-div-07` | baixa | fonte (interna) | m08-inst-08 | INST 08: "Carregar fotografia de" reescreve afluência e armazenamento, mas não o mês; as quatro fotografias são de junho de 2026 (srcnote) e o campo mês só coincide porque nasce em 6 |
| `inst-div-08` | média | fonte (interna) | m08-inst-09 | INST 09: com P2 (transição) + dia útil + rede normal, o último ramo usa o texto da madrugada ("Na madrugada, a carga é baixa…") porque só testa p === "P4"; o readout do mesmo caso diz carga líquida "Elevada" |
| `inst-div-09` | média | fonte (interna) | m08-inst-10 | INST 10: o inst-intro promete "a demanda de ponta implícita", mas nenhuma saída a mostra; e o "fator de carga anual" do script é (consumo/8760)/(consumo/(h×d×52)), não a razão demanda média/demanda máxima do § Lex. Com operação 24×7 dá 99,7% (52 semanas = 8.736 h), não 100% |

As duas leituras de cada uma estão no JSON. `inst-div-04` é **CONTENT QA — AUTHORITATIVE VERIFICATION REQUIRED** (P20).

## Verificação

- **Verificador adversarial (2026-09-17), sem mudança:** 100% das 112 linhas de cálculo/readout (`calculo_verbatim`, `readouts_do_script`) e dos 38 ramos (condição e corpo) conferidos na linha declarada (±3; as duas instruções de várias linhas conferem com espaço tolerado); os 11 `codigo_verbatim` são idênticos às linhas declaradas; cenário-padrão do INST 02 recalculado à mão (261,0 GW, 761 TWh, 33,3%, 2 trocas, +10,5/−13,3, ordem de geração hid > eol > sol > fos > bio > nuc), assim como os de INST 08 (fluxo fraco × próximo do normal, 17 meses), 09 (P2 útil normal → texto da madrugada, carga "Elevada") e 10 (8.736 h, 99,7%). As divergências inst-div-01…09 conferem na fonte.
- **Segundo verificador adversarial (2026-09-17), corrigido:** a cobertura por nó de texto de cada `div.inst` (script próprio) achou 4 rótulos fixos do markup ausentes do JSON: os `h5` "Pizza 1 · capacidade instalada (GW)" (L615) e "Pizza 2 · geração efetiva (TWh/ano)" (L620) do INST 02, e os `div.th-lb` "Fluxo · afluência" (L1030, unidade "% MLT") e "Estoque · armazenamento" (L1031, unidade "% útil") do INST 08, cujos valores já estavam em `cenario_padrao.termometro` sem rótulo. Acrescentado o campo `rotulos_estaticos[]` (com origem) nos 11 instrumentos (vazio nos outros 9), no extrator `m08_instrumentos.mjs` e, por remendo idêntico, no `instrumentos.json` (só inserções). Nenhum desses quatro rótulos existe em `src/` (limitação de contrato, protocolo §12); o status dos INST 02 e 08 não mudou, porque o critério de status do extrator não mede rótulos fixos.
- **Segundo verificador adversarial (2026-09-17), sem mudança:** 112 linhas de cálculo/readout e 38 ramos rechecados contra a fonte (2 acusações do script próprio eram instruções de várias linhas, falso positivo); 93 origens a ±3 (89 anteriores + 4 novas); os outros 9 `div.inst` têm 100% dos nós de texto no JSON; contagens de status (3 portado, 8 divergente) e de `formula` não nula (INST 02, 03, 10) conferidas no código.
- `m08_verify.mjs`: 146 strings de conteúdo e 93 origens, 0 falhas; passada estrita: 805 folhas, 33 não achadas literalmente (todas inspecionadas, ver abaixo).
- Não achadas na passada estrita: estados renderizados pelo script (vereditos com número interpolado, painéis, legendas), descrições desta extração dos controles gerados e o identificador de módulo. Nenhum texto parafraseado.
