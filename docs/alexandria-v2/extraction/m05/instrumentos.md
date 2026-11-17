# M05 · Grupo "instrumentos": como ler a extração

**Arquivo gerado:** [`instrumentos.json`](instrumentos.json), produzido por [`extratores/m05_instrumentos.mjs`](extratores/m05_instrumentos.mjs).
**Data:** 2026-09-17.

## Método

- **Leitura.** Markup por div.inst (percorredor walk); script por cabeçalho /* ---------- INST 0N */; cenário-padrão e testes executando o <script> original inteiro em DOM simulado (node:vm); SIG avaliado do literal. Código: bundle esbuild de alexandria-modulo-05-content.ts e alexandria-instrument-calculators.ts.
- **Total.** São 6 instrumentos, todos dentro de aula (Aulas 01–06, um por aula). Fora de aula: 0. Nenhum instrumento de módulo (§Lab/§MAP) no M05.
- **Fórmulas e vereditos.** Ficam no JSON como código verbatim do `<script>` (L1460–1761): `formulas_script`, `script.codigo[]`, `veredito.ramos[].expressao_js`.
  - Os formatadores comuns (L1384–) estão em `formatadores_comuns`.
  - Esta página não reescreve fórmula nenhuma; ela só aponta as linhas.
- **Cenário-padrão.** Vem da execução do script original inteiro em DOM simulado (`node:vm`), com os `value=` do markup.
- **Comparação com o código.** Grade exaustiva por instrumento: script original × `INSTRUMENT_CALCULATORS` (bundle esbuild). Mede o valor numérico, o ramo do veredito e o texto verbatim.

## Resumo

| Id | Título | Aula · posição | Entradas | Saídas (textuais) | Ramos | Cenário-padrão (saídas) | Ramo padrão | Status no código |
|---|---|---|---|---|---|---|---|---|
| Inst · 01 | Simulador · Quando duplicar a rede fica caro | A01 §1.3, L395–424 | 4 | 4 (—) | 4 | R$ 630/ano ; R$ 630/ano ; zero ; R$ 900 mi | ok (L1493) | **divergente** |
| Inst · 02 | Simulador · Grau de separação | A02 §2.5, L500–526 | 3 | 4 (i2-b) | 3 | 32 ; 30 ; 63 ; Jurídica | ok (L1544) | **divergente** |
| Inst · 03 | Simulador · Composição de contratação | A03 §3.4, L590–618 | 4 | 4 (—) | 5 | R$ 227,50/MWh ; R$ 319,90/MWh ; R$ 184,80/MWh ; 15% | ok (L1585) | **divergente** |
| Inst · 04 | Termômetro · Risco de captura | A04 §4.5, L699–719 | 1 + 8 sinais | 4 (i4-r) | 4 | 0/8 ; 0/100 ; R$ 0 mi/ano ; sim | ok (L1640) | **divergente** |
| Inst · 05 | Simulador · Ciclo de revisão tarifária | A05 §5.7, L832–867 | 6 | 4 (—) | 4 | R$ 1,1 bi ; R$ 78,57/MWh ; R$ 40 mi/ano ; R$ 1,21 bi | ok (L1701) | **divergente** |
| Inst · 06 | Mapa · Posição no desenho de mercado | A06 §6.4, L935–961 | 3 | 4 (i6-q, i6-r) | 3 | Custo · só energia ; 84/100 ; 0 ; Opacidade metodológica | ok (L1755) | **divergente** |

- **Status.** Os 6 estão portados, mas **divergentes**: todos têm o veredito parafraseado. Os detalhes estão nas fichas abaixo e em `divergencias`.
- **Pergunta.** Nenhum instrumento tem pergunta própria (`pergunta` = null). O `inst-intro` é instrução, e a pergunta de previsão fica para a camada Alexandria (P19).
- **Fonte dos números.** É null nos 6. Cada disclaimer declara o instrumento "Didático/ilustrativo".
- **Tolerâncias.** São null nos 6, porque nenhuma é declarada.
- **Invocação no texto.** Nenhuma frase de aula chama o instrumento. As ligações indiretas estão em `invocacoes_nota`.

## Inst · 01 — Simulador · Quando duplicar a rede fica caro

- **Aula:** 01 (`aula-05-01`).
- **Posição:** L395–424, na §1.3 "As outras três razões, além do custo de rede". Fica depois de box (L389) e antes de tres_niveis "Monopólio natural · três níveis" (L426).
- **Kind:** `simulador`. O gráfico é svg e não porta (§12).
- **Intro (literal, L398):** "Divida um mercado entre operadores concorrentes e observe o que acontece com o custo médio por consumidor. O ponto do instrumento não é o número — é a forma da curva, e a pergunta de quando ela deixa de subir o suficiente para importar."
- **Invocações:** Nenhuma frase das aulas chama o instrumento ("abaixo", "use o simulador"…): zero ocorrências. Ligações textuais indiretas: Ex·01 "A rua com cinco redes".

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| `i1-q` | Consumidores no mercado | mil | 5 a 1000 | 5 | 200 |
| `i1-f` | Custo fixo de uma rede completa | R$ mi | 50 a 3000 | 25 | 900 |
| `i1-c` | Custo incremental por consumidor | R$/ano | 20 a 1200 | 10 | 180 |
| `i1-n` | Operadores concorrentes na área | redes | 1 a 6 | 1 | 1 |

| Saída | Rótulo | Textual | Atribuição (linha do script) | Padrão |
|---|---|---|---|---|
| `i1-cm` | Custo médio | não | L1487 | R$ 630/ano |
| `i1-c1` | Com rede única | não | L1488 | R$ 630/ano |
| `i1-w` | Desperdício | não | L1489 | zero |
| `i1-tf` | Custo fixo total | não | L1490 | R$ 900 mi |

**Fórmulas:** L1463, L1464, L1466, L1467, L1468, L1469, L1471, L1472. O código exato está em `formulas_script`.

**Ramos do veredito** (a expressão literal está em `veredito.ramos[].expressao_js`):

| # | Condição | Classe | Linha |
|---|---|---|---|
| 1 | `if (N===1)` | ok | L1493 |
| 2 | `else if (pct<=10)` | att | L1494 |
| 3 | `else if (pct<=50)` | per | L1495 |
| 4 | `else` | per | L1496 |

**Veredito no cenário-padrão (literal, calculado):** "Rede única. O custo fixo de R$ 900 mi é diluído entre 200.000 consumidores, o que dá R$ 450 por consumidor por ano só de infraestrutura. Repare quanto disso é custo de existir a rede, e não custo de entregar energia: é essa proporção que define quão forte é o monopólio natural aqui."

**Disclaimer (L422):** "Didático/ilustrativo — não usar para dimensionamento real. O modelo assume que cada operador replica integralmente o custo fixo e divide os consumidores igualmente, e converte o custo fixo em anuidade por um fator de recuperação de capital único de 10% ao ano. Redes reais têm compartilhamento parcial de infraestrutura, densidades muito diferentes por área e estrutura de custo por nível de tensão — nada disso está aqui."

**Comparação com o código:**

- **Status:** **divergente**. Título igual: true. Nota igual ao disclaimer: true.
- **Campos divergentes:** `i1-n` (id "i1" ≠ fonte "i1-n").
- **Saídas:** extras no código: i1-pct. Textuais omitidas em `valores`: nenhuma.
- **Grade (360 casos):**
  - numérico como o painel semeia: 0 ok / 360 falhas;
  - numérico com os ids da fonte: 360/0;
  - ramo do veredito: 27/333;
  - veredito verbatim: 0/360;
  - ramos da fonte cobertos: 4/4.

## Inst · 02 — Simulador · Grau de separação

- **Aula:** 02 (`aula-05-02`).
- **Posição:** L500–526, na §2.5 "O que unbundling não resolve". Fica depois de paragrafo (L497) e antes de tres_niveis "Unbundling · três níveis" (L528).
- **Kind:** `simulador`. O gráfico é svg e não porta (§12).
- **Intro (literal, L503):** "Escolha o grau de unbundling e o quanto o desenho depende de coordenação entre segmentos. O instrumento decompõe o resultado em duas parcelas que se movem em direções opostas — conflito residual e custo de coordenação — e mostra onde a soma das duas é menor."
- **Invocações:** Nenhuma frase das aulas chama o instrumento ("abaixo", "use o simulador"…): zero ocorrências. Ligações textuais indiretas: Ex·02 (discriminação vertical) e a tabela §2.2 (quatro graus).

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| `i2-g` | Grau de separação | 1 contábil → 4 societária | 1 a 4 | 1 | 3 |
| `i2-c` | Dependência de coordenação | índice | 0 a 100 | 5 | 50 |
| `i2-f` | Qualidade da fiscalização de acesso | índice | 0 a 100 | 5 | 55 |

| Saída | Rótulo | Textual | Atribuição (linha do script) | Padrão |
|---|---|---|---|---|
| `i2-r` | Conflito residual | não | L1538 | 32 |
| `i2-k` | Custo de coordenação | não | L1539 | 30 |
| `i2-t` | Atrito total | não | L1540 | 63 |
| `i2-b` | Grau de menor atrito | sim | L1541 | Jurídica |

**Fórmulas:** L1505, L1506, L1507, L1508, L1509, L1510, L1511, L1514, L1515, L1516, L1517, L1518, L1519. O código exato está em `formulas_script`.

**Ramos do veredito** (a expressão literal está em `veredito.ramos[].expressao_js`):

| # | Condição | Classe | Linha |
|---|---|---|---|
| 1 | `if (G===best)` | ok | L1544 |
| 2 | `else if (Math.abs(G-best)===1)` | att | L1545 |
| 3 | `else` | per | L1546 |

**Veredito no cenário-padrão (literal, calculado):** "Separação jurídica é o ponto de menor atrito para esta combinação. Conflito residual em 32 e custo de coordenação em 30: nenhum dos dois domina. Note que o ótimo se desloca com a fiscalização — melhorar a fiscalização de acesso é frequentemente mais barato que aprofundar a separação."

**Disclaimer (L524):** "Didático/ilustrativo — não usar para dimensionamento real. Os índices são adimensionais e construídos apenas para tornar visível o formato do trade-off: o conflito residual cai com o grau de separação e é atenuado pela fiscalização de acesso; o custo de coordenação sobe com o grau e é amplificado pela dependência de coordenação. Nenhum dos dois é mensurável desta forma em um sistema real."

**Comparação com o código:**

- **Status:** **divergente**. Título igual: true. Nota igual ao disclaimer: true.
- **Campos divergentes:** nenhum.
- **Saídas:** extras no código: nenhuma. Textuais omitidas em `valores`: i2-b.
- **Grade (1764 casos):**
  - numérico como o painel semeia: 1764 ok / 0 falhas;
  - numérico com os ids da fonte: 1764/0;
  - ramo do veredito: 1764/0;
  - veredito verbatim: 0/1764;
  - ramos da fonte cobertos: 3/3.

## Inst · 03 — Simulador · Composição de contratação

- **Aula:** 03 (`aula-05-03`).
- **Posição:** L590–618, na §3.4 "O híbrido brasileiro, em três dimensões". Fica depois de paragrafo (L587) e antes de tres_niveis "Pool e bilateral · três níveis" (L620).
- **Kind:** `simulador`. O gráfico é barras html e não porta (§12).
- **Intro (literal, L593):** "Distribua o volume de um consumidor entre contratação de longo prazo, contratação de curto prazo e exposição descoberta. Observe o que muda no custo esperado e, principalmente, o que muda na largura da faixa de resultados possíveis — que é onde mora o risco."
- **Invocações:** Nenhuma frase das aulas chama o instrumento ("abaixo", "use o simulador"…): zero ocorrências. Ligações textuais indiretas: nenhuma no §Ex; a Aula 03 remete ao Módulo 04 para contratos.

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| `i3-l` | Contrato longo | % do volume | 0 a 100 | 5 | 60 |
| `i3-c` | Contrato curto | % do volume | 0 a 100 | 5 | 25 |
| `i3-p` | Prêmio do contrato longo | R$/MWh | -60 a 160 | 5 | 40 |
| `i3-v` | Volatilidade do curto prazo | índice | 0 a 100 | 5 | 55 |

| Saída | Rótulo | Textual | Atribuição (linha do script) | Padrão |
|---|---|---|---|---|
| `i3-e` | Custo esperado | não | L1577 | R$ 227,50/MWh |
| `i3-w` | Cenário ruim | não | L1578 | R$ 319,90/MWh |
| `i3-a` | Amplitude | não | L1579 | R$ 184,80/MWh |
| `i3-d` | Descoberto | não | L1580 | 15% |

**Fórmulas:** L1555, L1557, L1558, L1559, L1560, L1561, L1562, L1563. O código exato está em `formulas_script`.

**Ramos do veredito** (a expressão literal está em `veredito.ramos[].expressao_js`):

| # | Condição | Classe | Linha |
|---|---|---|---|
| 1 | `if (over>0)` | per | L1583 |
| 2 | `else if (D===0)` | att | L1584 |
| 3 | `else if (D<=15)` | ok | L1585 |
| 4 | `else if (D<=35)` | att | L1586 |
| 5 | `else` | per | L1587 |

**Veredito no cenário-padrão (literal, calculado):** "Exposição residual de 15%, custo esperado de R$ 227,50/MWh e amplitude de R$ 184,80/MWh. É a faixa em que a folga absorve variação operacional sem transformar o orçamento numa aposta direcional. Repare que o prêmio pago no contrato longo comprou redução de dispersão, não redução de custo."

**Disclaimer (L616):** "Didático/ilustrativo — não usar para dimensionamento real. Preço de referência do curto prazo fixado em R$ 200/MWh, com dispersão proporcional ao índice de volatilidade e cenário ruim tomado como a cauda superior da faixa simulada. Não há modelagem hidrológica, sazonalidade, submercado, encargo, perda nem tributo — o instrumento existe apenas para mostrar como a composição desloca simultaneamente nível e dispersão do custo."

**Comparação com o código:**

- **Status:** **divergente**. Título igual: true. Nota igual ao disclaimer: true.
- **Campos divergentes:** nenhum.
- **Saídas:** extras no código: nenhuma. Textuais omitidas em `valores`: nenhuma.
- **Grade (1815 casos):**
  - numérico como o painel semeia: 1815 ok / 0 falhas;
  - numérico com os ids da fonte: 1815/0;
  - ramo do veredito: 1815/0;
  - veredito verbatim: 0/1815;
  - ramos da fonte cobertos: 5/5.

## Inst · 04 — Termômetro · Risco de captura

- **Aula:** 04 (`aula-05-04`).
- **Posição:** L699–719, na §4.5 "O teste de sete perguntas". Fica depois de paragrafo (L696) e antes de titulo "4.6 Onde isso vira a tese da GridAlpha" (L721).
- **Kind:** `quebra-cabeca (instrument-taxonomy.md; nome fora do enum)`. O gráfico é barras html e não porta (§12).
- **Intro (literal, L702):** "Marque os sinais presentes num processo decisório concreto — uma revisão tarifária, uma consulta pública, uma mudança de metodologia. O veredito não acusa ninguém: ele indica quanto do resultado é verificável por terceiros e onde a verificação falha."
- **Invocações:** Nenhuma frase das aulas chama o instrumento ("abaixo", "use o simulador"…): zero ocorrências. Ligações textuais indiretas: título do Ex·09 "O termômetro dá vermelho" (aparato.json m05-ex-09); os pesos/sinais espelham o "teste de sete perguntas" (§4.5).

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| `i4-m` | Materialidade da decisão | R$ mi/ano em jogo | 1 a 2000 | 1 | 120 |

**Sinais (8 checkboxes, soma dos pesos 100; padrão: todos desmarcados (checkbox sem checked); array `SIG` em L1596):**

| # | Peso | Título | Descrição |
|---|---|---|---|
| 0 | 22 | Resultado não reproduzível por terceiro | Um analista competente, com a metodologia e os dados publicados, não chega ao mesmo número. |
| 1 | 20 | Metodologia divulgada depois da decisão | O critério apareceu junto com o resultado, ou foi ajustado durante o processo sem justificativa. |
| 2 | 20 | Dados de entrada não disponíveis | A memória de cálculo não é pública, ou está em formato que impede reprocessamento. |
| 3 | 12 | Contribuições sem resposta motivada | As manifestações contrárias foram registradas, mas não respondidas com argumento técnico. |
| 4 | 12 | Tratamento assimétrico entre pares | Concessionárias comparáveis receberam critérios diferentes no mesmo ciclo, sem razão declarada. |
| 5 | 6 | Decisão contraria metodologia publicada | O ato se afasta do critério vigente sem justificativa técnica explícita no processo. |
| 6 | 5 | Trânsito de quadros sem quarentena efetiva | Circulação recente entre a empresa afetada e a instância decisória, sem impedimento observado. |
| 7 | 3 | Participação concentrada no próprio setor | A quase totalidade das contribuições veio de agentes economicamente interessados no resultado. |

| Saída | Rótulo | Textual | Atribuição (linha do script) | Padrão |
|---|---|---|---|---|
| `i4-n` | Sinais marcados | não | L1634 | 0/8 |
| `i4-o` | Índice de opacidade | não | L1635 | 0/100 |
| `i4-e` | Exposição | não | L1636 | R$ 0 mi/ano |
| `i4-r` | Reprodutibilidade | sim | L1637 | sim |

**Fórmulas:** L1596, L1597, L1598, L1599, L1600, L1601, L1602, L1603, L1604, L1605, L1614, L1615, L1616, L1617, L1618, L1619, L1621, L1622. O código exato está em `formulas_script`.

**Ramos do veredito** (a expressão literal está em `veredito.ramos[].expressao_js`):

| # | Condição | Classe | Linha |
|---|---|---|---|
| 1 | `if (op===0)` | ok | L1640 |
| 2 | `else if (op<=25)` | att | L1641 |
| 3 | `else if (op<=55)` | per | L1642 |
| 4 | `else` | per | L1643 |

**Veredito no cenário-padrão (literal, calculado):** "Nenhum sinal marcado. O processo é verificável: metodologia anterior, dados disponíveis, contribuições respondidas e resultado reproduzível. Isso não significa que o resultado agrade — significa que ele pode ser contestado no mérito técnico, que é a única forma produtiva de contestar."

**Disclaimer (L717):** "Didático/ilustrativo — não usar para dimensionamento real, e jamais como imputação a instituição ou pessoa. Os pesos são arbitrários e servem para treinar a hierarquia dos sinais: irreprodutibilidade e metodologia posterior pesam mais que participação desigual, porque as duas primeiras impedem qualquer verificação externa enquanto a terceira apenas a dificulta. A exposição é a materialidade ponderada pela opacidade."

**Comparação com o código:**

- **Status:** **divergente**. Título igual: true. Nota igual ao disclaimer: true.
- **Campos divergentes:** `i4-s0` (checkbox da fonte virou select Presente/Ausente; rótulo "Resultado não reproduzível por terceiro (22 pts)" = t + " (p pts)" (consistente); descrição d do sinal ausente); `i4-s1` (checkbox da fonte virou select Presente/Ausente; rótulo "Metodologia divulgada depois da decisão (20 pts)" = t + " (p pts)" (consistente); descrição d do sinal ausente); `i4-s2` (checkbox da fonte virou select Presente/Ausente; rótulo "Dados de entrada não disponíveis (20 pts)" = t + " (p pts)" (consistente); descrição d do sinal ausente); `i4-s3` (checkbox da fonte virou select Presente/Ausente; rótulo "Contribuições sem resposta motivada (12 pts)" = t + " (p pts)" (consistente); descrição d do sinal ausente); `i4-s4` (checkbox da fonte virou select Presente/Ausente; rótulo "Tratamento assimétrico entre pares (12 pts)" = t + " (p pts)" (consistente); descrição d do sinal ausente); `i4-s5` (checkbox da fonte virou select Presente/Ausente; rótulo "Decisão contraria metodologia publicada (6 pts)" = t + " (p pts)" (consistente); descrição d do sinal ausente); `i4-s6` (checkbox da fonte virou select Presente/Ausente; rótulo "Trânsito de quadros sem quarentena efetiva (5 pts)" = t + " (p pts)" (consistente); descrição d do sinal ausente); `i4-s7` (checkbox da fonte virou select Presente/Ausente; rótulo "Participação concentrada no próprio setor (3 pts)" = t + " (p pts)" (consistente); descrição d do sinal ausente).
- **Saídas:** extras no código: nenhuma. Textuais omitidas em `valores`: i4-r.
- **Grade (768 casos):**
  - numérico como o painel semeia: 768 ok / 0 falhas;
  - numérico com os ids da fonte: 768/0;
  - ramo do veredito: 768/0;
  - veredito verbatim: 3/768;
  - ramos da fonte cobertos: 4/4.

## Inst · 05 — Simulador · Ciclo de revisão tarifária

- **Aula:** 05 (`aula-05-05`).
- **Posição:** L832–867, na §5.7 "Por que isso aparece na conta industrial mesmo no mercado livre". Fica depois de paragrafo (L829) e antes de tres_niveis "WACC regulatório · três níveis" (L869).
- **Kind:** `simulador`. O gráfico é svg e não porta (§12).
- **Intro (literal, L835):** "Monte a Parcela B de uma distribuidora hipotética e acompanhe a trajetória dela ao longo de um ciclo — a revisão no ano zero, seguida dos reajustes anuais corrigidos por índice de preços menos o Fator X. Repare no efeito de um único ponto percentual no custo de capital."
- **Invocações:** Nenhuma frase das aulas chama o instrumento ("abaixo", "use o simulador"…): zero ocorrências. Ligações textuais indiretas: Ex·04 (efeito de variação do custo de capital) e o lede da aula ("identidade central").

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| `i5-b` | Base de remuneração líquida | R$ mi | 200 a 20000 | 100 | 4000 |
| `i5-w` | WACC regulatório | % real a.a. | 3 a 14 | 0.1 | 7.5 |
| `i5-o` | OPEX eficiente | R$ mi/ano | 30 a 3000 | 10 | 620 |
| `i5-d` | Reintegração regulatória | R$ mi/ano | 10 a 1500 | 10 | 180 |
| `i5-e` | Energia faturada | GWh/ano | 500 a 60000 | 500 | 14000 |
| `i5-x` | Índice de preços − Fator X | % a.a. | -4 a 12 | 0.5 | 2.5 |

| Saída | Rótulo | Textual | Atribuição (linha do script) | Padrão |
|---|---|---|---|---|
| `i5-p` | Parcela B ano 0 | não | L1691 | R$ 1,1 bi |
| `i5-c` | Componente médio | não | L1692 | R$ 78,57/MWh |
| `i5-s` | Efeito de +1 p.p. no WACC | não | L1693 | R$ 40 mi/ano |
| `i5-f` | Parcela B ano 4 | não | L1694 | R$ 1,21 bi |

**Fórmulas:** L1654, L1655, L1656, L1657, L1658, L1659, L1660, L1661, L1663, L1664, L1666, L1667, L1696, L1697. O código exato está em `formulas_script`.

**Ramos do veredito** (a expressão literal está em `veredito.ramos[].expressao_js`):

| # | Condição | Classe | Linha |
|---|---|---|---|
| 1 | `if (X<0)` | att | L1699 |
| 2 | `else if (share>=48)` | att | L1700 |
| 3 | `else if (share>=25)` | ok | L1701 |
| 4 | `else` | att | L1702 |

**Veredito no cenário-padrão (literal, calculado):** "Composição equilibrada: 27% de remuneração de capital, o restante em operação e reintegração. O componente médio de R$ 78,57/MWh é a parcela da tarifa que responde à eficiência da distribuidora — e é apenas uma parte do que a fatura cobra. Um ponto percentual no custo de capital move R$ 40 mi por ano."

**Disclaimer (L865):** "Didático/ilustrativo — não usar para dimensionamento real. Todos os valores são hipotéticos. O modelo mantém base, OPEX e reintegração constantes ao longo do ciclo e aplica o índice líquido do Fator X apenas sobre a Parcela B — simplificação grosseira: na prática a base cresce com investimento, a reintegração acompanha a base, o mercado varia e há componentes financeiros. O componente médio em R$/MWh não é tarifa: exclui Parcela A, perdas, tributos e estrutura horária."

**Comparação com o código:**

- **Status:** **divergente**. Título igual: true. Nota igual ao disclaimer: true.
- **Campos divergentes:** nenhum.
- **Saídas:** extras no código: nenhuma. Textuais omitidas em `valores`: nenhuma.
- **Grade (972 casos):**
  - numérico como o painel semeia: 972 ok / 0 falhas;
  - numérico com os ids da fonte: 972/0;
  - ramo do veredito: 0/972;
  - veredito verbatim: 0/972;
  - ramos da fonte cobertos: 4/4.

## Inst · 06 — Mapa · Posição no desenho de mercado

- **Aula:** 06 (`aula-05-06`).
- **Posição:** L935–961, na §6.4 "A dicotomia falsa que você precisa desmontar". Fica depois de box (L929) e antes de titulo "6.5 A matriz que você leva para qualquer desenho" (L963).
- **Kind:** `simulador (instrument-taxonomy.md; "Mapa", nome fora do enum)`. O gráfico é svg e não porta (§12).
- **Intro (literal, L938):** "Mova os dois eixos e observe em que quadrante a configuração cai, o que ela compra e onde ela tende a quebrar. Os três pontos de referência são configurações genéricas e anônimas, incluídas apenas para dar escala ao mapa — não representam nenhum sistema identificável."
- **Invocações:** Nenhuma frase das aulas chama o instrumento ("abaixo", "use o simulador"…): zero ocorrências. Ligações textuais indiretas: Ex·10 pede plotar um sistema "no mapa de dois eixos" (m05-ex-10); §6.1 define os dois eixos.

| Entrada | Rótulo | Unidade | Faixa | Passo | Padrão |
|---|---|---|---|---|---|
| `i6-x` | Revelação de custo | 0 oferta → 100 custo declarado | 0 a 100 | 5 | 85 |
| `i6-y` | Remuneração de capacidade | 0 só energia → 100 formal | 0 a 100 | 5 | 45 |
| `i6-h` | Peso do recurso armazenável plurianual | % | 0 a 100 | 5 | 60 |

| Saída | Rótulo | Textual | Atribuição (linha do script) | Padrão |
|---|---|---|---|---|
| `i6-q` | Quadrante | sim | L1749 | Custo · só energia |
| `i6-co` | Coerência com o parque | não | L1750 | 84/100 |
| `i6-d` | Distância do Brasil | não | L1751 | 0 |
| `i6-r` | Risco dominante | sim | L1752 | Opacidade metodológica |

**Fórmulas:** L1711, L1712, L1713, L1714, L1715, L1716, L1718, L1719, L1720, L1721, L1722, L1723, L1724, L1725, L1726, L1727, L1728, L1729. O código exato está em `formulas_script`.

**Ramos do veredito** (a expressão literal está em `veredito.ramos[].expressao_js`):

| # | Condição | Classe | Linha |
|---|---|---|---|
| 1 | `if (coer>=80)` | ok | L1755 |
| 2 | `else if (coer>=55)` | att | L1756 |
| 3 | `else` | per | L1757 |

**Veredito no cenário-padrão (literal, calculado):** "Configuração coerente com um parque em que o recurso armazenável plurianual pesa 60%. Quadrante: custo · só energia. O risco que sobra é opacidade metodológica — nenhum desenho elimina risco, apenas escolhe qual carregar. Saber nomear qual você escolheu é o que distingue desenho de improviso."

**Disclaimer (L959):** "Didático/ilustrativo — não usar para dimensionamento real. Os eixos são índices adimensionais construídos para este módulo; os pontos A, B e C são configurações genéricas de referência, não representações de sistemas reais. A "coerência com o parque" é uma heurística que penaliza revelação por oferta quando o peso do recurso armazenável plurianual é alto, e penaliza remuneração puramente de energia quando esse peso é baixo — nada além disso."

**Comparação com o código:**

- **Status:** **divergente**. Título igual: true. Nota igual ao disclaimer: true.
- **Campos divergentes:** nenhum.
- **Saídas:** extras no código: nenhuma. Textuais omitidas em `valores`: i6-q, i6-r.
- **Grade (9261 casos):**
  - numérico como o painel semeia: 9261 ok / 0 falhas;
  - numérico com os ids da fonte: 9261/0;
  - ramo do veredito: 9261/0;
  - veredito verbatim: 0/9261;
  - ramos da fonte cobertos: 3/3.

## Divergências do grupo

| id | Tipo | Sev. | Tema | Nota |
|---|---|---|---|---|
| div-m05-inst-01 | fonte_x_codigo | alta | INST·01: id do campo "Operadores concorrentes" quebra o cálculo no produto | O campo do código tem id "i1" (fonte: range "i1-n"), mas a calculadora lê i['i1-n']; o painel semeia por field.id, então N = 0 sempre. Resultado medido na grade (360 casos): numérico como o painel semeia 0 ok / 360 falhas; com os ids da fonte 360 ok / 0 falhas. |
| div-m05-inst-02 | fonte_x_codigo | alta | Vereditos parafraseados (não verbatim) nos seis instrumentos | Inst · 01: verbatim 0/360, ramo 27/360; Inst · 02: verbatim 0/1764, ramo 1764/1764; Inst · 03: verbatim 0/1815, ramo 1815/1815; Inst · 04: verbatim 3/768, ramo 768/768; Inst · 05: verbatim 0/972, ramo 0/972; Inst · 06: verbatim 0/9261, ramo 9261/9261. Os textos do código encurtam os ramos e removem a interpolação numérica (R$, %, atrito, opacidade). |
| div-m05-inst-03 | fonte_x_codigo | alta | INST·05: veredito único no código | A fonte tem 4 ramos (X<0; participação da remuneração ≥48%, ≥25%, senão); o código devolve sempre o mesmo texto, que não existe na fonte. |
| div-m05-inst-04 | codigo_x_taxonomia_x_fonte | — | kind fora do enum e descrição da taxonomia | Código: INST·04 kind "quebra-cabeca", INST·06 kind "simulador" — iguais a docs/alexandria/instrument-taxonomy.md. Mas a taxonomia descreve o Termômetro pelo CÓDIGO ("8 campos select booleanos (Presente/Ausente), cada um com peso fixo documentado no rótulo" e "5 saídas"); na FONTE são 8 checkboxes sem peso no rótulo (o peso só aparece como "N pts" na barra de um sinal marcado) e 4 readouts + veredito. |
| div-m05-inst-05 | limitacao_contrato | — | Saídas textuais fora de valores | i2-b, i4-r, i6-q, i6-r são texto na fonte; o código as omite de valores e as cita no veredito parafraseado (i6-q/i6-r e i4-r) ou nem isso (i2-b só aparece no nome do grau). Protocolo §12. |
| div-m05-inst-06 | fonte_x_codigo | media | INST·04: sinais como select e sem descrição | A fonte usa 8 checkboxes com título (b) e descrição; o código usa 8 selects "Presente/Ausente" com rótulo "título (N pts)" — o peso vira texto visível (a fonte não mostra peso no sinal; mostra "N pts" só na barra) e a descrição d some. |
| div-m05-inst-07 | fonte_x_codigo | baixa | Formatação das saídas | A fonte formata cada saída com unidade embutida (R$ …/ano, R$ … mi, …/100, …/8, "zero"); o código devolve número cru com unit null em todos os outputs. i1-pct existe só no código. |
| div-m05-inst-08 | lacuna_fonte | — | Constantes sem procedência | CRF 10% (INST·01), BC/BK (INST·02), SP R$ 200/MWh e fatores 0,35/0,90/1,6 (INST·03), pesos 22…3 (INST·04 — "Os pesos são arbitrários"), posição do Brasil (85,45) e referências A/B/C (INST·06) não têm fonte externa; os disclaimers as declaram ilustrativas. |

## Lacunas

- **Por instrumento:** pergunta, fonte dos números e tolerâncias são null nos 6 (P6, P19).
- **Constantes:** não têm procedência (div-m05-inst-08). O disclaimer do INST·04 diz literalmente que os pesos são arbitrários.
- **Invocação:** nenhuma aula tem frase que chame o instrumento. A posição é só a do markup.
- **Desenho:** SVG e barras não portam. Legendas e rótulos literais estão em `grafico`.

## Verificação

Verificação adversarial independente em 2026-09-17. Parser e normalização próprios (sem m05_lib): tags removidas, entidades decodificadas e espaços ignorados; texto comparado contra a janela da fonte em torno de linha_aprox (±3 linhas, alargada pelo tamanho do texto). Quiz: o literal var Q avaliado de novo e comparado campo a campo. Script: cada {linha, codigo} comparado com a linha da fonte.

- **textos_e_origens_aparato:** 694 checagens, 0 falhas (todos os itens com texto e origem)
- **textos_e_origens_modulo:** 640 checagens; 9 acusações, todas falso-positivo do medidor (convenções, título do catálogo L441 de outro arquivo, títulos de instrumento no roteiro ancorados por linhas[] e não pela origem do pai)
- **textos_e_origens_instrumentos:** 143 checagens, 0 falhas
- **quiz:** 10/10 questões: enunciado, 4 alternativas, gabarito e explicação idênticos ao var Q avaliado; rótulo "Questão N de 10"; linha ±3; 2 faixas de placar (L1872, L1875) conferidas
- **checklist:** 21/21 itens: html idêntico ao <li> e linha exata (ul.ck única, L1224)
- **formulas_script:** 403/403 pares {linha, codigo} idênticos; cobertura das linhas não vazias de cada bloco INST 01–06 completa; 23/23 ramos de veredito (condição e expressao_js) idênticos às linhas 1493–1757
- **exercicios:** 10/10: tag, enunciado e cada parágrafo do gabarito (html e linha) idênticos
- **referencias:** 16/16 (texto igual, exceto <br> → espaço), 4 URLs idênticas
- **glossario:** 72/72: termo, definição e linha; 5 resumos de família literais
- **voz_e_erros:** 34/34 perguntas-relâmpago, 6/6 ataques e 12/12 erros: html e linha idênticos
- **Contagens:** Todas as contagens declaradas conferem com a recontagem direta no HTML: 16 sec-id; 6 aulas; 6 div.inst; 21 ranges (4+3+4+1+6+3); 8 sinais (array SIG, pesos somam 100); 24 readouts (4 por instrumento), 4 textuais; 23 ramos vd() (4+3+5+4+4+3); 72 termos (12/12/11/17/20; 92 span.term − 20 do §Ex); 10 exercícios; 21 itens; 10 × 4 no quiz; 8 perguntas no caso; 16 referências (4 com href); 6 map-card; 7 pílulas; 34/6/5 na §Voz; 12 erros; 6 painéis lv; 7 boxes "Onde isso entra no produto"; 10 linhas com "GridAlpha"; 30 h3 nas aulas; 0 Lab/Tradutor/Resultado esperado/vídeo.
- **Reproduções:** Cenários-padrão refeitos à mão pelas fórmulas do script: INST·01 R$ 630; INST·02 32/30/63; INST·03 227,50 / 319,90 / 184,80; INST·05 R$ 1,1 bi, 78,57, participação 27%; INST·06 coerência 84, distância 0, quadrante e risco. Grade INST·01: 360 casos e 27 ramos coincidentes reproduzidos; tamanhos das demais grades (1764, 1815, 768, 972, 9261) conferem. m05_verify.mjs rodado de novo: saída idêntica (2227/0).
- **Divergências:** As 25 conferidas contra a fonte e o código (inst-01 id "i1" × i['i1-n'] em alexandria-instrument-calculators.ts L2870; inst-03 texto único; inst-06 selects "(N pts)"; mod-06 "Criança de 12 anos Executivo Especialista" num <b> só; literal da taxonomia citado em inst-04 confere). Nenhuma inventada.

**Correções aplicadas:**

- div-m05-mod-02, leitura_b.onde: listava "§Voz lede, Aula 05 lede" sob o literal "Bloco 5", mas nessas linhas a fonte diz só "Neste bloco" (L1148) e "do bloco" (L761). O literal "Bloco 5" está em L287, L325 e L1222. Corrigido em modulo.json e em m05_modulo.mjs, com as 7 linhas de "bloco" em minúscula listadas à parte.

**Observações sem correção:**

- marcacao_p14 do checklist: o item 01 ("Aplica a régua…") não recebe "aplicacao" e o item 17 ("Aplica o teste… a uma decisão concreta") recebe. É a regra declarada no extrator (só "a uma decisão concreta" ou "Plota"), não um erro; continua como anotação a revisar.
- O lead da Aula 06 no código difere da fonte só pelo escape das aspas (\"), então lead_igual = true se mantém.
