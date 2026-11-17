# M06 · grupo "instrumentos"

Fonte (só leitura): `alexandria_modulo06.html` (markup L383–1051; script L1519–2359). Saída:
[`instrumentos.json`](instrumentos.json). Extrator: [`extratores/m06_instrumentos.mjs`](extratores/m06_instrumentos.mjs).

## Método

**Markup.** Um parser de pilha extrai o título (`.nm`), o id (`.id`), `inst-intro`, os campos (number + range gêmeo),
os controles segmentados, os readouts, a legenda, a cadeia e o `p.disc`.

**Script.** Cada item é guardado como linha literal:
- constantes;
- funções auxiliares;
- `formula_exata_script`, que são as linhas de `run()` antes do desenho;
- a linha de atribuição de cada saída;
- os ramos do veredito. Cada ramo traz a condição literal, a classe, a expressão JS literal, o `texto_template` legível
  e `dentro_de` para `if` aninhado.

**Cenário-padrão e prova de porte.**
- **Cenário-padrão.** O `<script>` original roda num DOM simulado (`vm`), e o cenário é lido de lá.
- **Único ajuste no script.** O harness só troca `vd(v,` por `__vd(<linha>,v,`, para registrar o ramo disparado; a fonte
  não muda.
- **Prova de porte.** Cada caso roda com as mesmas entradas no script e em `INSTRUMENT_CALCULATORS`, tirado do bundle
  esbuild do código. O veredito é comparado por igualdade exata de string. As saídas numéricas são comparadas depois de
  formatar o valor do código com os formatadores **literais da fonte** (`num`, `pct`, `mmi`, L1523–1528).

**Verificação.** `verify-m06.mjs` conferiu 565 strings e 77 origens, com 0 falhas.

## Contagens

- **Total.** 8 instrumentos: 7 de aula e 1 de módulo (o Inst · 01 fica no §MAP). A Aula 06 tem 2.
- **Por instrumento.**

| Inst | Entradas (campos + segmentados) | Saídas (readouts) | Ramos de leitura | Dados de script |
|---|---|---|---|---|
| 01 | 0 (chips + ◄/►) | 0 (painel com 4 campos) | 0 | 14 marcos |
| 02 | 5 | 4 | 4 | — |
| 03 | 5 | 4 | 4 | — |
| 04 | 4 | 4 | 5 | — |
| 05 | 1 + 1 | 4 | 3 | 3 regimes × 7 chaves |
| 06 | 4 | 4 | 4 | — |
| 07 | 2 + 2 | 4 | 7 (aninhados) | — |
| 08 | 0 (grade de 11 chips) | 0 (cadeia com 4 quadros) | 2 | 11 pressões |

- **Faixas.** Em todos os campos, o number e o range gêmeo têm a mesma faixa (`faixa_igual_no_range: true`). O script
  lê sempre o range.

## Tabela de instrumentos

| Inst | Título literal | Aula | kind no código | Status | Prova (casos · falhas de veredito/número) |
|---|---|---|---|---|---|
| 01 | Linha do tempo · quatorze marcos, de 1879 a 2028 | §MAP | explorador | **divergente** | 14 · 0/0 (espaço inteiro) |
| 02 | Simulador · a erosão do custo histórico | 01 | simulador | **portado** | 3.003 · 0/0 |
| 03 | Simulador · como se forma uma dívida intrassetorial | 02 | simulador | **portado** | 3.003 · 0/0 |
| 04 | Termômetro do racionamento · balanço de energia num período seco | 03 | simulador | **portado** | 3.003 · 0/0 |
| 05 | Comparador · três arquiteturas e onde o risco pousa | 04 | comparador | **divergente** | 21 (7 comparáveis) · 0/0 |
| 06 | Simulador · o efeito de uma liminar num sistema de rateio | 05 | simulador | **portado** | 3.003 · 0/0 |
| 07 | Linha da abertura · quando cada consumidor passou a poder escolher | 06 | simulador | **divergente** | 34.000 (espaço inteiro do ramo padrão) · 0/0 |
| 08 | Mapa trauma → cicatriz regulatória | 06 | explorador | **portado** | 11 · 0/0 (espaço inteiro) |

"Portado" quer dizer que cálculo e veredito são equivalentes em todo o espaço testado. Em todos os 8, porém:
- `inst-intro` e `p.disc` **não estão no código**, e `note` é `null` (exceto no Inst 01, cujo `note` é paráfrase). Uma
  varredura de `src/` não encontrou nenhum dos dois textos.
- as saídas textuais ficam fora de `valores`, que só aceita números (protocolo §12).

## Por instrumento

A lista completa de campos, fórmulas, ramos e textos está no JSON. Os números do cenário-padrão abaixo foram lidos do
script original.

### Inst · 01 — Linha do tempo (§MAP, L383)
- **Mecânica.** 14 marcos (array `M`, L1597–1640), com chips, botões "◄ Marco anterior"/"Próximo marco ►" e SVG. O
  painel mostra ano, título, corpo e "Cicatriz que ainda opera hoje". O cenário-padrão é o marco 1 (1879–1889).
- **Invocação.** Lede do §MAP (L381): "Comece pela linha do tempo abaixo".
- **Fonte dos números.** O disc diz que as datas "correspondem à norma de origem indicada em §Ref".
- **Divergências com o código.**
  - O título está encurtado ("…quatorze marcos").
  - O `note` é paráfrase.
  - O campo `select` "Marco" é rótulo do código.
  - O legado aparece como "O que ficou" em vez de "Cicatriz que ainda opera hoje".
  - A navegação anterior/próximo e o eixo SVG não foram portados.
  - O corpo dos 14 marcos está íntegro.

### Inst · 02 — Erosão do custo histórico (Aula 01, L451)
- **Entradas** (padrão, faixa, passo):

| Campo | Padrão | Faixa | Passo |
|---|---|---|---|
| Investimento original reconhecido (índice) | 100 | 20–500 | 5 |
| Inflação média anual (% a.a.) | 12 | 0–40 | 1 |
| Anos desde o investimento (anos) | 15 | 1–30 | 1 |
| Parcela importada do equipamento (%) | 60 | 0–100 | 5 |
| Câmbio acima da inflação (p.p. a.a.) | 4 | 0–15 | 1 |

- **Fórmula** (L1699–1713): `fator=(1-m)(1+i)^n + m(1+i+c)^n`; `cb=1/fator`; `rep=H·fator`; `pc=R·H/(1+i)^N`, com
  `R=0.10`. "Anos até cair a 50%" procura até 60.
- **Cenário-padrão.** Cobertura 12,9%, reposição 775 índice, poder de compra 1,8 a.a. real, 6 anos. Veredito `per`
  (ramo `else`, L1743).
- **Ramos.** ≥0,90 ok · ≥0,65 att · ≥0,35 per · senão per.
- **Invocação.** "O instrumento abaixo mostra a mecânica dessa erosão." (L449). O feedback da Q03 cita "Inst·02".
- **Fonte dos números.** Didática; o disc declara a taxa de 10%.
- **Código.** "Anos até cair a 50%" (texto) está fora de `valores`.

### Inst · 03 — Dívida intrassetorial (Aula 02, L556)
- **Entradas.**

| Campo | Padrão | Faixa | Passo |
|---|---|---|---|
| Investimento anual exigido | 100 | 20–300 | 5 |
| Tarifa em relação ao custo do serviço (%) | 72 | 35–130 | 1 |
| Participação da dívida externa (%) | 45 | 0–90 | 5 |
| Câmbio acima da inflação (p.p.) | 9 | 0–30 | 1 |
| Anos de regime | 8 | 3–12 | 1 |

- **Fórmula** (L1757–1771): autofinanciamento ≤ 55%·T, teto de captação de 50% e acumulação da dívida em câmbio.
- **Cenário-padrão.** 40%, 468, 83 e 5,5× o ano. Veredito `per` (L1806).
- **Invocação.** Nenhuma menção explícita. Fica depois do último parágrafo de 2.4 (L554).
- **Código.** Porte completo.

### Inst · 04 — Termômetro do racionamento (Aula 03, L682)
- **Entradas.**

| Campo | Padrão | Faixa | Passo |
|---|---|---|---|
| Armazenamento inicial (% do máximo) | 32 | 5–100 | 1 |
| Afluência (% da média) | 72 | 30–140 | 1 |
| Margem firme (% da carga) | 3 | 0–30 | 1 |
| Meses até o período úmido | 7 | 1–12 | 1 |

- **Constantes.** `BASE=11, FLOOR=15, RES=5` (L1818), declaradas no disc. `extra=max(0,8−Mg)·0,25` (L1821) **não** está
  no disc.
- **Cenário-padrão.** Corte 21,4%, 3,9 meses, nível final 2%, queda 4,33 p.p./mês. Veredito `per`: o ramo ≤0,40
  (L1866), não o de 2001 (≤0,20).
- **Ramos.** ≤0,0005 · ≤0,08 · ≤0,20 · ≤0,40 · senão.
- **Invocação.** A caixa do produto na A03 diz "o instrumento acima é o esqueleto do raciocínio" (L736).
- **Código.**
  - "Meses até o limite" e "Nível final sem corte" (texto) não foram portados.
  - `i4-qm` sai negativo sem o rótulo "+ … · recompõe" que a fonte exibe quando o balanço é positivo.
  - Mapeado para `simulador` (Termômetro ≠ o do M05).

### Inst · 05 — Comparador de arquiteturas (Aula 04, L790)
- **Entradas.** Segmentado "Regime histórico" com 3 opções ("1962–1993 · estatal"* / "1995–2003 · transição" /
  "2004– · híbrido") e "Horizonte de contratação obrigatória (anos)", padrão 0, faixa 0–6, passo 1.
- **Dados** (L1879–1891). O array `REG` tem F0/S0 45/28, 88/12 e 58/58, 7 respostas da régua por regime e o
  "horizonte efetivo". O cenário-padrão exibe a grade de 8 linhas do regime 0.
- **Fórmula.** `falta=F0·max(0,1−h/7)^1,6`; `sobra=S0·clamp(h/6)^1,4`; menor atrito por varredura de 0 a 6.
- **Cenário-padrão.** 45 / 0 / 45 / "4 anos". Veredito `att`.
- **Invocação.** "o instrumento abaixo mostra qual." (4.3, L781).
- **Código (divergente).**
  - O seletor de regime **não virou campo**, e a calculadora fixa o regime 0. Os 14 cenários dos regimes 1 e 2 e a
    grade da régua (7 chaves × 3 regimes) não existem no código.
  - A saída "Horizonte de menor atrito" (texto) não foi portada.
  - No regime 0, a porta é exata.

### Inst · 06 — Liminar num sistema de rateio (Aula 05, L876)
- **Entradas.**

| Campo | Padrão | Faixa | Passo |
|---|---|---|---|
| Valor a liquidar (R$ mi) | 1500 | 200–6000 | 50 |
| Parcela protegida (%) | 35 | 0–80 | 1 |
| Garantias (% do devido) | 8 | 0–40 | 1 |
| Credores (agentes) | 120 | 10–600 | 5 |

- **Fórmula** (L1959–1965). Três ciclos com realimentação de +30% do corte, limitada a 85%. O disc declara esses
  valores.
- **Cenário-padrão.** 73,0%, R$ 405 mi, R$ 3 mi e R$ 1,62 bi. Veredito `per` (L1984).
- **Invocação.** Só o feedback da Q09 ("Inst·06"). Fica depois de 5.3 (L874).
- **Código.** Porte completo.

### Inst · 07 — Linha da abertura (Aula 06, L991)
- **Entradas.**
  - Ano: padrão 2024, faixa 1995–2028.
  - Carga (kW): padrão 800, faixa 5–5000, passo 5.
  - Segmentado "Grupo tarifário da unidade": "Grupo A · média/alta tensão"* / "Grupo B · baixa tensão".
  - Segmentado "Origem da energia pretendida": "Convencional"* / "Fonte incentivada".
- **Saídas.** Todas textuais: Situação, Limiar no ano, Norma habilitante, Elegível a partir de.
- **Funções.** `thr` (L1998–2017), `norma` (L2018–2031), `elig` (L2032–2037).
- **Cenário-padrão.** Elegível · sem limite · "Port. Norm. 50/2022" · 2023. Veredito `ok` (L2113).
- **Ramos** (aninhados; `dentro_de` no JSON):
  - dentro de `if(grupo===1)`: L2106 (≥2028), L2107 (≥2027), L2108 (else);
  - dentro de `else if(t<0)`: L2110;
  - dentro de `else if(ok)`: L2113 (t===0), L2114 (else);
  - dentro de `else`: L2116.
- **Fonte dos números.** Normas citadas no disc (Portarias 514/2018, 465/2019, 50/2022; Leis 15.269/2025 e 9.074/1995).
- **Invocação.**
  - O §Caso C.3 diz "o instrumento da Aula 06" (ambíguo entre 07 e 08).
  - O feedback da Q10 diz "Inst·07".
  - O veredito L2114 remete ao §Caso.
  - O instrumento fica depois da caixa "Números vivos" de 6.3 (L986).
- **Código (divergente).**
  - Os toggles de grupo e de fonte não viraram campo.
  - `thr`/`norma` só têm o ramo padrão, então **os ramos L2106–2108 (baixa tensão) ficam inalcançáveis**, e também o
    limiar de incentivada.
  - Não há o sufixo "· prazo legal".
  - As 4 saídas estão fora de `valores`.
  - No ramo padrão, os vereditos batem em todo o espaço (34 anos × 1.000 cargas).

### Inst · 08 — Mapa trauma → cicatriz (Aula 06, L1037)
- **Dados.** 11 pressões (array `T`, L2145–2201): período, título, problema, resposta, cicatriz e risco novo, exibidos
  nos quadros "Problema revelado", "Resposta institucional", "Cicatriz que opera hoje" e "Risco novo em troca".
- **Ramos.** Último item `att`; demais `ok` ("Marco N de 11…").
- **Invocação.**
  - A intro remete ao "teste de dez minutos".
  - Fica depois de 6.4 (L1035).
  - O §Caso diz "instrumento da Aula 06" (ambíguo).
- **Código.** Portado: os 11 pares de `MODULO_06_TRAUMA_CICATRIZ` são literais, e o fecho é igual nos 11. Há duas
  diferenças de apresentação:
  - os 4 quadros viram um único veredito com os rótulos literais;
  - o campo "Pressão histórica" é rótulo do código.

## Fonte dos números e tolerâncias (P6/P19)

- **Cenários didáticos.** Os Inst 02–06 e 08 têm disc "Didático/ilustrativo" e **não declaram fonte externa dos
  valores** (`fonte_externa_declarada: null`).
- **Normas.** O Inst 07 e o Inst 01 citam normas, e não dados medidos.
- **Tolerâncias.** Nenhuma foi declarada (`tolerancias: null` em todos).

## Resíduos do original (sinalizados, não corrigidos)

1. **Inst 04, L1859.** "Nível final sem corte" não é limitado a 100%: mostra 153% com 100 / 140 / 30 / 12 meses, e o
   gráfico limita.
2. **Inst 04, L1831.** Com armazenamento 10 e balanço positivo, mostra "não atinge", e não "já abaixo".
3. **Inst 04, L1821.** Os parâmetros 8 e 0,25 não estão no disc.
4. **Inst 05, L1879.** F0/S0 e os expoentes não estão no disc.
5. **Inst 07, L2033.** Qualquer unidade de baixa tensão aparece "Elegível" em 2027. O veredito e a prosa (6.3)
   restringem 2027 a indústria e comércio. Não há controle de classe de consumo.
6. **Inst 07, L2015.** 3.000 kW de 1996 a 2018 e 500 kW para incentivada desde 1998. O disc só diz "simplificado".
7. **Inst 02, L1712.** A busca de 50% vai até 60 anos; o gráfico e o campo vão até 30.

## Divergências com a taxonomia

`instrument-taxonomy.md` diz que o Inst · 01 "nunca foi materializado" e que o Inst 07 tem "4 saídas". O código tem
`m06-inst-01` (explorador) e o 07 com 0 saídas. O restante do mapeamento de kind confere: 02, 03, 04, 06 e 07
simulador; 05 comparador; 01 e 08 explorador.

## Verificação (verificador adversarial, 2026-09-17)

- **Script:** 100% das 273 linhas `{linha, codigo|condicao_literal|expressao_literal}` estão verbatim na linha
  declarada, sem desvio. Isso cobre fórmulas, constantes, formatadores, atribuições de saída e ramos de leitura dos
  8 instrumentos.
- **Contagens:** conferem no script. Os marcos `M` são 14, as pressões `T` são 11 e os regimes `REG` são 3. Os
  instrumentos são 8 `div.inst`: 1 no §MAP, 1 em cada uma das A01–A05 e 2 na A06.
- **Achados conferidos:**
  - Com `g===1` e ano ≥2027, `thr` devolve 0, e o Inst 07 mostra "Elegível" para qualquer unidade de baixa tensão.
  - O Inst 04 permite `fim` > 100 (ex.: E=100, A=140, Mg=8, T=7 dá 130,8%).
  - O código tem `m06-inst-07` com `outputs: []`, e `instrument-taxonomy.md` está desatualizado.
- **Prova de porte:** não foi reexecutada; a amostra estrutural conferiu.
- **Correções:** nenhuma.

## Verificação (2ª passada, verificador adversarial, 2026-09-17)

- **Fórmulas:** 282 campos `codigo`, `condicao_literal` e `expressao_literal` conferem, verbatim, na linha exata
  declarada (sem desvio).
- **Ramos:** o script tem 29 chamadas `vd(v,…)`, e a extração tem 29 ramos (4/4/5/3/4/7/2 nos Inst 02–08).
- **Dados:** conferem os 14 marcos (`M`), as 11 pressões (`T`) e os 3 regimes (`REG`, com grade de 7 chaves mais o
  horizonte).
- **Resíduos:** os 7 foram conferidos no script.
  - Inst 04: com E=100, A=140, Mg=30 e T=12, o resultado é 152,8, exibido como "153%".
  - Inst 04: o teste `d<=0.0001` vem antes do `E<=FLOOR`.
  - Inst 07: com `thr` e g=1, o ano 2027 dá 0.
  - Inst 02: o laço vai até 60, e `NMAX` é 30.
- **Contagem:** `residuos_do_original` tem **7** itens, e não 6 como dizia a contagem repassada ao orquestrador. O
  JSON e a lista acima já estavam certos.
- **Correções:** nenhuma neste arquivo.
