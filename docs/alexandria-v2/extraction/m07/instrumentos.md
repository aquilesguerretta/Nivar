# M07 · instrumentos

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo07.html`, com o markup em `div.inst` e
  o script em L1918–3035.
- **Saída:** [`instrumentos.json`](instrumentos.json)
- **Extrator:** [`extratores/m07_instrumentos.mjs`](extratores/m07_instrumentos.mjs)
- **Harness:** [`extratores/m07_sim.mjs`](extratores/m07_sim.mjs), que executa o `<script>` **original** em DOM simulado.

## Método (protocolo §10)

- **Dados.** São os literais do script, avaliados sem digitação: `var D` (7 exploradores), `var M` e `FIXO` (Inst 10),
  `N/ORD/AUT/DAD/INFO/LEGS` (Inst 01) e `LB/CO` (Inst 04 e 06).
- **Estados renderizados.** O script original roda, e cada chip ou mês é clicado. O `innerHTML` do painel e dos cartões
  fica em `painel_renderizado_html` e `cartoes_renderizados_html`.
- **Fórmulas e ramos.** São o **texto exato do script** (`expressao_fonte`), com a linha de origem. A ordem dos ramos é a
  do if/else.
- **Código.** As calculadoras `m07-inst-04` e `m07-inst-06` de `alexandria-instrument-calculators.ts` foram executadas
  contra o original numa grade:

  | Instrumento | Combinações | Vereditos diferentes | Valores diferentes |
  |---|---|---|---|
  | Inst 04 | 4.860 | 0 | 0 |
  | Inst 06 | 1.440 | 0 | 0 |

  Todos os ramos foram exercitados.

**Campos comuns.** Cada instrumento traz `posicao_no_texto`, com seção, subseção, bloco anterior e bloco seguinte, e
`invocacoes_no_texto`, com as menções em prosa e nos retornos do quiz.

**Campos que a fonte não preenche:**
- `pergunta: null`, porque a fonte não tem pergunta própria de instrumento;
- `fonte_dos_numeros: null`, porque todos os instrumentos são "Didático/ilustrativo" (`aviso_didatico`);
- `tolerancias: null`, porque a fonte não declara nenhuma.

## Os 10 instrumentos

| Id | Título | Onde | Mecânica | Entradas | Saídas | Itens | `kind` no código | Código |
|---|---|---|---|---|---|---|---|---|
| inst-01 | Mapa institucional · autoridade × dado | **§ MAP (módulo)**, L442–458 | grafo com 2 fluxos (3 botões) + chips de órgão → ficha | fluxo (aut/dad/amb, padrão aut); órgão (8 chips, padrão CNPE) | SVG, legenda, ficha | 8 fichas; 9 arestas de autoridade e 9 de dado | explorador | divergente |
| inst-02 | Comparador de instrumentos jurídicos | Aula 01, após 1.5 | seleção revela ficha (6 linhas) | grade de 11 | painel | 11 | comparador | divergente |
| inst-03 | Estante da EPE · qual documento responde qual pergunta | Aula 02, após 2.5 | seleção revela ficha (5 linhas) | grade de 7 | painel | 7 | explorador | divergente |
| inst-04 | Anatomia de um ato regulatório · rito e janela de influência | Aula 03, após 3.8 | 6 prazos → somas e razão → readouts + regime + veredito | 6 campos em dias | 4 readouts + veredito | 13 ramos | simulador | cálculo idêntico; apresentação divergente |
| inst-05 | Cadeia temporal da operação · produto, decisão e leitura | Aula 04, após 4.7 | chips revelam ficha (5 linhas) | 5 chips | painel | 5 | explorador | divergente |
| inst-06 | Régua do ciclo mensal · contabilização, garantia e liquidação | Aula 05, após 5.7 | 5 prazos → readouts + regime + veredito | 5 campos em dias | 4 readouts + veredito | 17 ramos | simulador | cálculo idêntico; apresentação divergente |
| inst-07 | Escada do travamento · o que parou o projeto e quem destrava | Aula 06, após 6.3 | seleção revela ficha (5 linhas) | grade de 9 | painel | 9 | explorador | divergente |
| inst-08 | Roteador de decisão | Aula 07, após 7.2 | seleção revela painel e 6 cartões | grade de 12 | painel + cartões | 12 | explorador | divergente |
| inst-09 | Localizador de dado | Aula 07, após 7.3 | seleção revela painel e 6 cartões | grade de 12 | painel + cartões | 12 | explorador | divergente |
| inst-10 | Calendário institucional · o que sai quando e de quem | Aula 07, após 7.4 | mês revela o ciclo anual (3 eventos) e a ação do mês, sobre a camada fixa | 12 meses | painel | 12 | explorador | divergente |

A Aula 07 tem três instrumentos. As contagens declaradas nas intros conferem com os arrays:

| Instrumento | Intro declara | Array |
|---|---|---|
| Inst 02 | "Onze instrumentos" | 11 |
| Inst 03 | "Sete perguntas" | 7 |
| Inst 05 | "Cinco horizontes" | 5 |
| Inst 07 | "Nove travamentos" | 9 |

### Entradas, fórmulas e cenário-padrão dos paramétricos

**Inst 04.** Todos os campos são `number` + `range` gêmeos, com as mesmas faixas.

| Campo | Faixa | Padrão |
|---|---|---|
| Tomada de subsídios (dias) | 0–180 | 45 |
| Elaboração de minuta e AIR | 15–540 | 120 |
| Consulta pública | 0–180 | 45 |
| Análise das contribuições | 10–540 | 90 |
| Relatoria e deliberação | 7–360 | 60 |
| Vacância até a vigência | 0–730 | 90 |

- **Fórmulas (L2412–2414):** `var tot=a+b+c+d+e+f;` · `var jan=a+c;` · `var r=tot>0?jan/tot:0;`
- **Leitor:** `parseFloat(e.value)||0`.
- **Regime:** `jan===0` → "Fechado à contribuição"; `r>=0.28` → "Aberto e previsível"; `r>=0.15` → "Aberto com janela
  estreita"; senão, "Formalmente aberto, praticamente fechado".
- **Aviso (`av`):** 5 faixas de `f`: 0 / <30 / <90 / <180 / ≥180.
- **Veredito:** `jan===0` (per); `r>=0.28 && f>=90` (ok); `r>=0.15` (att); senão, per.
- **Divergência interna (`divergencias_fonte`).** A etapa b tem dois rótulos na fonte: "Elaboração de minuta e AIR"
  no campo (L847) e "Minuta e análise de impacto" na barra (`var LB`, L2405). Não resolvido. No Inst 06, os rótulos
  do campo e da barra coincidem.
- **Padrão:** ciclo de 450 dias, janela de 90 dias, aviso de 90 dias. Regime "Aberto com janela estreita"; veredito att,
  "Aberto, mas exige monitoramento ativo.".

**Inst 06.**

| Campo | Faixa | Padrão |
|---|---|---|
| Fechamento da medição (dias após o mês) | 1–30 | 8 |
| Apuração e prévia | 2–45 | 12 |
| Janela de contestação | 0–30 | 5 |
| Aporte de garantia | 1–30 | 6 |
| Liquidação financeira | 1–30 | 4 |

- **Fórmula (L2530):** `var tot=a+b+c+d+e, fol=c+d, prev=a+b;`. O readout "Janela de contestação" é `c`.
- **Regime:** `tot<=25` curto; `<=40` padrão; `<=55` longo; senão, muito longo. Soma-se " · sem contestação" quando
  `c===0` e " · janela mínima" quando `c<=3`.
- **Veredito:** `c===0` (per); `c<=3` (per); `fol<5` (att); `tot<=40` (ok); senão, att. Todos terminam com `cap`.
- **Padrão:** 35 dias, janela de 5, folga de 11. Regime "Ciclo padrão"; veredito ok, "Ciclo equilibrado.".

### Previsão pedida pela própria fonte

- **Inst 01.** O parágrafo anterior diz: "se você conseguir prever o painel de cada nó antes de clicar, o mapa está
  internalizado".
- **Inst 08.** A intro diz: "leia o tipo de decisão, responda os seis campos de cabeça, e só então clique". A mensagem de
  reprovação do quiz repete a instrução.

Os dois casos estão em `tarefa_declarada_na_fonte`.

### Onde a prosa invoca cada instrumento

| Instrumento | Invocações |
|---|---|
| Inst 01 | L439 ("Use o instrumento abaixo…"); retorno de Q03 |
| Inst 02 | caixa de produto da A01 (L590); retornos de Q01, Q08 e Q10 |
| Inst 03 | retorno de Q04 |
| Inst 04 | retornos de Q01 e Q06 |
| Inst 05 | retorno de Q05 |
| Inst 06 | nenhuma |
| Inst 07 | retorno de Q09 |
| Inst 08 | § 00 0.4 (L423); cartão da A07 no § MAP (L467); retornos de Q02, Q05, Q06, Q07 e Q08; mensagem de reprovação (L3016) |
| Inst 09 | cartão da A07 (L467); 7.3 (L1328, "o instrumento seguinte existe"); lede do § Voz (L1568) |
| Inst 10 | § 00 0.4 (L423); cartão da A07 (L467, "o calendário do setor") |

## Comparação com o código

Status por instrumento (`codigo.status` e `codigo.divergencias`):

- **Inst 01, `divergente`.** O código tem `m07-inst-01` em `MODULO_07_INSTRUMENTOS` / `M07_INST01_ORGAOS`.
  - **Portado igual:** as 8 fichas (kicker, título, corpo, linhas e leitura).
  - **Não portado:** o SVG, com os 8 nós, as 18 arestas e os rótulos das arestas.
  - **Inventado:** o rótulo "Órgão" e a `note` ("Os oito órgãos que governam o setor…"), ambos sem origem na fonte.
  - **Legenda "amb":** os `<span>` foram concatenados sem separador ("AutoridadeDadoRótulos…").
  - **Veredito:** tem prefixos próprios.
- **Inst 02, 03, 05 e 07, `divergente`.** O corpo portado (`MODULO_07_EXPLORADORES`) guarda **só a 1ª linha** da ficha
  e **perde as outras 4 ou 5**:
  - Inst 02: "O que pode dispor", "O que não pode dispor", "Prazo típico de alteração", "Onde é publicado", "Quem pode
    contestar";
  - Inst 03: "Seção a ler primeiro", "Defasagem típica", "Erro clássico", "O que não se responde ali";
  - Inst 05: "Cadência", "O que se lê primeiro", "Dado que sai no portal", "Erro clássico";
  - Inst 07: "Instrumento que resolve", "Prazo típico", "Erro de endereçamento", "O que fazer em paralelo".

  O campo `select` tem o rótulo "Item", que a fonte não tem.
- **Inst 08 e 09, `divergente`.** Os 6 valores dos cartões estão no código, mas **sem os rótulos**. No Inst 08, os
  rótulos perdidos são "Órgão emissor … Quem pode contestar"; no Inst 09, "Órgão que publica … Armadilha de uso". Os
  valores viram uma linha única separada por " · ". O campo também tem o rótulo "Item".
- **Inst 10, `divergente`.**
  - O corpo começa com **"3"**: é o campo `e`, a contagem exibida no chip, virando texto, nos 12 meses.
  - **Ausentes:** a camada fixa (`FIXO`, "Camada fixa"), o texto explicativo do painel e os rótulos "Ciclo anual · N",
    "O que fazer no mês" e "Mês N de 12".
- **Inst 04 e 06, cálculo e veredito idênticos** ao original na grade.
  - **Divergem só na apresentação:** o readout textual "Regime" / "Regime de caixa" não é saída; `unit: null`, enquanto a
    fonte imprime "dias"; as barras por etapa não foram portadas; a classe ok/att/per do veredito se perde.
  - **Resíduo sem efeito:** o código tem `void av` / `void prev`.
- **Posição na aula.** `aula.instruments` bate com a fonte nos 9 instrumentos de aula. A posição **dentro** da aula (o
  instrumento entre subseções) não está no dado do código. Ver `posicao_no_texto`.

## Registro para a taxonomia

- **Inst 01.** `instrument-taxonomy.md` ainda diz "nunca materializado", mas ele existe como `explorador` desde a Wave 38.
- **Inst 02.** A forma é idêntica à dos exploradores, e o `kind` comparador fica por semântica. É nuance já registrada.
- **Tipo de saída.** Os 7 exploradores têm saída textual (`valores: {}`). Os readouts "Regime" são texto e não cabem em
  `Record<string, number>` (protocolo §12).
- **Desenho.** O SVG do Inst 01 e as barras dos Inst 04 e 06 não portam (§12).

## Verificação

`extratores/m07_verify.mjs` conferiu:
- **Strings:** 1.837 strings de conteúdo, 0 falhas.
- **Origens:** 121 origens, 0 falhas.

Os campos compostos em tempo de execução ficaram de fora da conferência de substring e estão marcados no JSON:
- `rotulo_renderizado`;
- `kicker_renderizado`;
- `painel_renderizado_html`;
- `camada_fixa.texto_concatenado`.

A contagem de `div.inst` dá 10, igual ao pill "10 instrumentos".

**Segunda passada (`extratores/m07_verify_estrito.mjs`).** Esta passada pula só metadado e comparação com o código.
Resultado: 2.540 strings conferidas, 255 não encontradas como substring. Todas as 255 foram inspecionadas e são
composição em tempo de execução ou metadado, sem nenhum conteúdo parafraseado:
- `painel_renderizado_html` e `cartoes_renderizados_html`;
- os readouts "450dias";
- os rótulos compostos kicker · título (51, marcados com `rotulo_nota`);
- "Ciclo anual · N";
- `mecanica` e `posicao_no_texto.secao`.

As 42 fórmulas e ramos conferem literalmente com o script.

### Terceira passada (verificador adversarial, 2026-09-17)

Conferência independente, com script próprio (fora de `extratores/`), direto no HTML.

- **Fórmulas, ramos e auxiliares (100%).** 84 checagens: `formulas[].expressao`, `ramos[].condicao` e
  `ramos[].expressao_fonte`, `funcoes_auxiliares`, `leitor_de_entrada`, e `min`/`max`/`step`/`value` de cada
  `<input>` dos Inst 04 e 06 contra o markup. Todas batem literalmente, a até 3 linhas da origem. O cenário-padrão
  também confere: Inst 04 dá 450/90/90 e "vacância razoável" (f = 90 < 180); Inst 06 dá 35/5/11.
- **Itens.** As contagens 8, 11, 7, 5, 9, 12, 12, 12 conferem, e a posição dos 10 `div.inst` também: L442 (§ MAP),
  L564, L670, L839, L1003, L1121, L1245 e, na Aula 07, L1314, L1331 e L1346.
- **Rótulos compostos.** Os rótulos "kicker · título" das opções e o `rotulo` das arestas do Inst 01 não aparecem
  como substring única. Cada parte foi conferida separadamente na fonte, e todas existem. A composição já está
  declarada em `rotulo_nota`.

**Correção aplicada (1).**
- **Problema.** `etapas_barras[]` dos Inst 04 e 06 (11 itens) vinha sem `origem`.
- **Correção.** Cada item ganhou `origem` = `{seletor: "script › INST·NN › var LB[j] / var CO[j]", trecho_inicial,
  linha_aprox}`:
  - Inst 04: L2405 (j = 0–2) e L2406 (j = 3–5);
  - Inst 06: L2523 (j = 0–2) e L2524 (j = 3–4).
- **Onde.** `m07_instrumentos.mjs` foi ajustado. O JSON regenerado é byte-idêntico ao corrigido.
- **Efeito.** `m07_verify.mjs` agora confere 132 origens, com 0 falhas; antes eram 121.

### Quinta passada (verificador adversarial, 2ª rodada, 2026-09-17)

Conferência independente, com scripts próprios no scratchpad (fora de `extratores/`), direto no HTML.

- **Cobertura dos literais do script.** Todo literal JS com 12 caracteres ou mais em L1919–3035 foi procurado nos três
  JSONs. São 1.003 literais. Só 22 não aparecem, e 20 deles são markup de template (`<button class="tr-chip`, atributos
  SVG, `bar-fill` e seletores `input[name="qq`), sem conteúdo. Os 2 restantes são conteúdo e foram corrigidos.
- **Correção aplicada (2).**
  - **Problema.** Em `ramos[]` do Inst 04 faltavam os 4 ramos do readout "Regime" (L2427–2430): `jan===0` →
    'Fechado à contribuição'; `r>=0.28` → 'Aberto e previsível'; `r>=0.15` → 'Aberto com janela estreita'; `else` →
    'Formalmente aberto, praticamente fechado'. Eles existiam só na prosa deste `.md`. A causa: a forma com chaves na
    mesma linha (`if(x){ reg='…'; }`) não era capturada pelo extrator. No Inst 06 os ramos de `reg` já estavam
    completos, porque lá a forma é sem chaves.
  - **Correção.** `m07_instrumentos.mjs` ganhou os dois padrões com chaves, e o JSON foi regenerado. O único diff é
    o acréscimo dos 4 ramos, antes dos 5 ramos de `av`. A terceira passada dizia "100%" em fórmulas e ramos, mas não
    tinha visto essa omissão.
  - **Efeito.** O Inst 04 passa de 13 para 17 ramos, e o total de fórmulas e ramos dos Inst 04 e 06 vai de 42 para 46.
    Com as 7 cadeias de `entradas`, `m07_verify.mjs` agora confere 1.843 strings (antes 1.839), com 0 falhas.
    `m07_verify_estrito.mjs` confere 2.559 (antes 2.540), com as mesmas 255 não encontradas já inspecionadas.
- **Fórmulas, ramos e auxiliares, 100% (80 checagens).** Os campos `expressao`, `condicao` e `expressao_fonte`
  aparecem literalmente no script, a até 3 linhas de `linha_aprox`. As entradas min/max/padrão dos Inst 04 e 06
  batem com os `<input type="range">` (L846–861 e L1128–1140). O cenário-padrão foi recalculado pelo código-fonte:
  - Inst 04: 450 / 90 / 90, `r` = 0,2, regime "Aberto com janela estreita", "vacância razoável", veredito att;
  - Inst 06: 35 / 5 / 11, regime "Ciclo padrão", veredito ok.
- **Itens.** A recontagem dos literais `{k:` / `{n:` por IIFE dá 11, 7, 5, 9, 12, 12, 12. As 8 fichas do Inst 01
  (`cnpe:{k:…}` etc.) conferem.
- **Código.** Foram amostradas as divergências dos Inst 02, 08 e 10 em `alexandria-modulo-07-content.ts`, e todas se
  confirmam:
  - o Inst 02 guarda só a 1ª linha `r[0]` ("Quem emite");
  - as opções têm o rótulo "Item";
  - no Inst 10, o corpo começa por "3\n".
