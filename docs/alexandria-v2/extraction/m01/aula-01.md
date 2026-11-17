# M01·A01: Energia é volume. Potência é velocidade.

Arquivo de dados: [`aula-01.json`](aula-01.json). Gerado por `extratores/gen-aulas01-02.mjs` e verificado por `extratores/verify-aulas01-02.mjs`.

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A aula ocupa as linhas 1356 a 1479. O instrumento está nas linhas 1424 a 1448 e o script, nas linhas 2737 a 2750. O exercício vinculado está nas linhas 2391 a 2398.
- **Como foi extraído:** script node sobre fatias do HTML por linha; o percorredor lança erro em qualquer linha que não reconhece. Nenhuma prosa foi digitada. `html` guarda o innerHTML literal; `texto` guarda o mesmo conteúdo sem tags.
- **Cobertura por token (§5):** 828 de 828 tokens casados (100%), sem contar o markup do instrumento. A sequência de tokens extraída é idêntica à da fonte, em ordem. Instrumento: 57 de 57 tokens, sequência idêntica.

## Contagens

- **Blocos:** 21 (lead 1, titulo 6, paragrafo 6, destaque 3, tabela 2, formula 1, instrumento 1, tres_niveis 1). Seções 1.1, 1.2, 1.3, 1.4, 1.5, 1.6.
- **Tabelas:** 2 (linhas de dados: 4 e 7; 33 células). **Fórmulas:** 1, 1 com `desc`. **Destaques (callouts):** 3, com 5 parágrafo(s). **Painéis de três níveis:** 3.
- **Figuras, listas e "Vale lembrar":** 0, 0 e 0 (medido na section).
- **Instrumento:** 1 (2 entradas, 1 saída, 14 linhas de script, 6 cenários executados). **Invocações no texto:** 1. **Remissões a outras aulas:** 0.
- **Exercício vinculado:** 1 (Ex · 01 · Aula 01). **Relacionados sem vínculo:** 3. **Termos do léxico (candidatos):** 9 de 38.
- **Divergências da fonte:** 2. **Divergências com o código:** 11.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `aula` | Marcador, título do h2 (html e texto) e a pergunta do § MAP (L1339): "Por que kW e kWh não são a mesma coisa?". Duração, dificuldade e vídeo ficam em `null`, com nota |
| `blocos[]` | 21 blocos na ordem da fonte. Cada um tem `origem {seletor, trecho_inicial, linha_aprox}`; tabelas, parágrafos de callout, abas e painéis têm origem por linha |
| `instrumentos[0]` | Campos (com atributos literais), saída, nota estática, script verbatim por linha, execução do script em DOM simulado e resíduos |
| `exercicios[0]` | Enunciado e gabarito verbatim, cálculos em destaque, critério `null` (com o critério do § Drill citado à parte) |
| `relacionados_nao_vinculados[]` | Itens do quiz e do checklist que tratam do mesmo tema, sem tag de aula (P9) |
| `divergencias[]` | Divergências da fonte, cada uma com as leituras verbatim e sem escolha |
| `comparacao_codigo` | Verificações programáticas, o que está conforme e as divergências COD-xx |

## Estrutura da aula, na ordem da fonte

- L1363 · lead · lead
- L1365 · titulo · **1.1** Energia, primeiro
- L1366 · paragrafo · parágrafo: "Energia é a capacidade de realizar trabalho ou produzir transformação.…"
- L1368 · paragrafo · parágrafo: "Eletricidade é apenas uma das formas de energia — a forma que predomin…"
- L1370–1373 · destaque · callout neutro "Princípio físico subjacente" (1 parágrafo)
- L1375 · titulo · **1.2** Potência é a taxa
- L1376 · paragrafo · parágrafo: "Potência é a velocidade com que energia é usada, gerada ou transformad…"
- L1378 · paragrafo · parágrafo: "A analogia mais útil é a torneira enchendo uma caixa d'água:"
- L1380–1392 · tabela · tabela 3×4: Analogia hidráulica / Equivalente elétrico / O que mede
- L1394 · paragrafo · parágrafo: "Uma torneira muito forte por dois minutos enche pouco volume — alta po…"
- L1396 · titulo · **1.3** A cadeia de unidades
- L1397–1412 · tabela · tabela 3×7: Unidade / Significa / Escala típica
- L1414 · titulo · **1.4** A fórmula que conecta tudo
- L1416–1419 · formula · fórmula: Energia = Potência × Tempo · desc: kWh = kW × horas
- L1421 · paragrafo · parágrafo: "Um motor de 10 kW ligado por 5 horas consome 50 kWh. Um equipamento de…" (6 destaques inline)
- L1423–1448 · instrumento · **instrumento m01-inst-01**: Calculadora · kWh = kW × h
- L1450 · titulo · **1.5** O erro fatal: confundir kW com kWh
- L1452–1457 · destaque · callout red "Erro de fluência" (3 parágrafos)
- L1459 · titulo · **1.6** O conceito em três níveis
- L1461–1472 · tres_niveis · três níveis: 01 · 12 anos / 02 · Executivo não técnico / 03 · Especialista de setor
- L1474–1477 · destaque · callout neutro "Onde isso entra no produto" (1 parágrafo)

## INST·01: resumo da especificação

- **Título:** "Calculadora · kWh = kW × h". O id na fonte é "INST · 01". Taxonomia: `calculadora` (ver nota no JSON).
- **Pergunta:** `null`.
- **Entradas:**

  | Id | Rótulo | Unidade | Padrão | Mín. | Passo | Máx. | Placeholder |
  |---|---|---|---|---|---|---|---|
  | `i01-kw` | Potência | kW | 10 | 0 | 0.5 | sem máx. | — |
  | `i01-h` | Tempo | h | 5 | 0 | 0.5 | sem máx. | — |

- **Saída `i01-out`:** "Energia consumida" em kWh. Valor inicial na marcação: "50".
- **Nota (estática):** "Experimente comparar dois cenários: 50 kW × 1 h e 1 kW × 50 h. Mesmo kWh, perfis completamente diferentes. A primeira instalação exige rede para 50 kW de pico. A segunda, para 1 kW. O kWh igual mascara que são problemas de engenharia opostos."
- **Fonte dos números:** `null`. **Tolerâncias:** `null`.

### Execução do script-fonte em DOM simulado

| Cenário | kW | h | Saída |
|---|---|---|---|
| carga (valores da marcação) | 10 | 5 | 50 |
| nota da fonte, cenário 1: 50 kW × 1 h | 50 | 1 | 50 |
| nota da fonte, cenário 2: 1 kW × 50 h | 1 | 50 | 50 |
| campos vazios | (vazio) | (vazio) | 0 |
| arredondamento: 0,333 kW × 1 h | 0.333 | 1 | 0,33 |
| milhar: 1500 kW × 2 h | 1500 | 2 | 3.000 |

**Resíduos do script (sinalizados, não corrigidos):**

- O cálculo é `(parseFloat(kw.value) || 0) * (parseFloat(h.value) || 0)`: campo vazio ou não numérico vale 0 e a saída é "0".
- A saída é `toLocaleString('pt-BR', { maximumFractionDigits: 2 })`: no máximo 2 casas, sem mínimo (50 → "50"; 0,333 → "0,33").
- O `calc()` roda uma vez no carregamento (linha `calc();` antes do `})();`) e a cada evento `input` dos dois campos.
- Não há max nem validação de negativo: o atributo min="0" é só do navegador, e o script aceita um valor negativo digitado.

## Onde o instrumento é invocado (C5)

- **Linha 1421:** o parágrafo termina em "Pratique abaixo."; o `div.instrument` vem logo depois (linhas 1423 a 1448).

## Exercício vinculado

- **Ex · 01 · Aula 01** (L2391–2398). Enunciado: "Um motor de 15 kW opera por 8 horas. Qual o consumo em kWh? E se o motor operar 12 horas, o que muda: kW, kWh ou ambos?"
- **Gabarito:** "Consumo: 15 × 8 = 120 kWh. Operando por 12 horas: 15 × 12 = 180 kWh. O kW (potência) não muda — a máquina continua sendo 15 kW. O que muda é apenas o kWh acumulado, porque o tempo de operação aumentou. Para um gestor industrial: "a potência da máquina é a mesma; ela só ficou ligada por mais horas"."
- **Critério:** `null` por exercício; o § Drill diz "Resolva cada exercício mentalmente ou no papel antes de revelar a resposta. Os exercícios alcançam todas as nove aulas. O critério de domínio é resolver pelo menos seis dos oito sem consulta."

## Termos do léxico (correspondência textual, não posse)

Demanda (3); Energia (35); Grupo A (1); kW (22); kWh (18); Potência (17); Tensão (1); TUSD (2); Watt (W) (1).

## Divergências na fonte (sem escolha)

- **DIV-01** — A analogia hidráulica atribui papéis diferentes a "vazão" e "corrente" na A01 e na A02.
  - A01, tabela 1.2, L1386: "Vazão da torneira (L/s) \| Potência (kW) \| Quanto fluxo neste instante"
  - A01, tabela 1.2, L1389: "Diâmetro do cano \| Corrente (A) \| Quanta carga atravessa"
  - A02, 2.2, L1512: "Ampere (A) mede corrente elétrica: o fluxo de carga elétrica passando pelo condutor por segundo. Se tensão é pressão, corrente é vazão. Cargas grandes — motores industriais, britadores, fornos — puxam mais corrente, especialmente em tensões mais baixas."
  - § Lex, Ampere (A), L2529: "Unidade de medida de corrente elétrica — o fluxo de carga que atravessa um condutor por segundo. Analogia hidráulica: vazão de água. Em instalações industriais, cargas grandes (motores, britadores, fornos) puxam alta corrente especialmente quando operam em tensões mais baixas."
  - Na tabela 1.2 a vazão (L/s) corresponde à potência e o diâmetro do cano à corrente; na 2.2 e no verbete, a corrente é a vazão. Já registrada como R5 em docs/alexandria-v2/m01/aulas.md.
- **DIV-02** — A fórmula de energia aparece com "horas" por extenso na aula e com "h" no título do instrumento e no léxico.
  - div.formula.desc (1.4), L1418: "kWh = kW × horas"
  - título do INST·01, L1426: "Calculadora · kWh = kW × h"
  - § Lex, kWh, L2617: "Quilowatt-hora. Unidade de energia equivalente a um quilowatt durante uma hora. É a grandeza que aparece como "consumo" em qualquer fatura elétrica. kWh = kW × h."
  - Mesma relação; só a grafia da unidade de tempo difere ("horas" × "h").

## Divergências em relação ao código portado

Código lido: `src/lib/data/alexandria-modulo-01-content.ts`, chaves `aula-01-01` (corpo, lead, aula) e `inst-01`, e `alexandria-instrument-calculators.ts`.

| Id | Gravidade | Onde | Divergência | Fonte |
|---|---|---|---|---|
| COD-01 | alta | MODULO_01_CORPO["aula-01-01"] callout "Erro de fluência" | Callout vermelho com 3 parágrafos na fonte; o código tem 1. Faltam 2 parágrafos ("A empresa consumiu 500 kW no mês." e "Esse deslize, em conversa com diretor de energia…"). O rótulo virou nota{tom:"red", label:null, html:rótulo} (o tom "red" foi preservado; o texto do rótulo ocupa o corpo da nota). Os parágrafos 2 e 3, os ausentes, levam style="margin-top: 12px;" na fonte. | linhas 1452–1457 |
| COD-02 | alta | MODULO_01_CORPO["aula-01-01"] seção 1.6 | O h3 1.6 "O conceito em três níveis" foi portado, mas o componente three-levels inteiro não: 0 de 3 painéis e 0 de 3 rótulos de aba ("01 · 12 anos", "02 · Executivo não técnico", "03 · Especialista de setor") estão no código. A seção 1.6 fica sem conteúdo e é seguida direto pelo callout "Onde isso entra no produto". | linhas 1459–1472 |
| COD-03 | média | MODULO_01_CORPO["aula-01-01"] fórmula 1.4 | desc = null no código; a fonte tem div.desc "kWh = kW × horas". O eq é igual ("Energia = Potência × Tempo"). | linhas 1416–1419 |
| COD-04 | média | MODULO_01_CORPO["aula-01-01"] parágrafo 1.4 (L190 do .ts) | Parágrafo não verbatim: os 6 <span class="hl"> foram removidos e os 6 </span> de fechamento ficaram (HTML malformado: "Um motor de 10 kW</span> ligado por 5 horas</span> consome 50 kWh</span>…"). Texto sem tags igual ao da fonte. | linha 1421 |
| COD-05 | média | MODULO_01_CORPO["aula-01-01"] callouts neutros | 2 callouts neutros ("Princípio físico subjacente", "Onde isso entra no produto") portados como nota { tom: "neutro", label: null, html: <rótulo> } seguida de parágrafo solto: o rótulo ocupa o corpo e o corpo vira parágrafo comum, e a hierarquia rótulo → corpo se perde. Os parágrafos em si são verbatim (2 de 2). | linhas 1370–1373 e 1474–1477 |
| COD-06 | alta | AulaViewer.tsx + MODULO_01_AULAS aula-01-01 | O instrumento não tem posição no fluxo: está em aula.instruments e AulaViewer.tsx (L125) o renderiza depois da apostila inteira e antes dos exercícios. Na fonte ele fica entre o parágrafo 1.4, que termina em "Pratique abaixo.", e o h3 1.5. O "abaixo" do texto passa a apontar para a seção 1.5 e os blocos seguintes. Viola bar C5 e a Regra-mãe 1. | linhas 1423–1448 |
| COD-07 | média | INSTRUMENTOS_MODULO_01 inst-01 .formula | formula = "kWh = kW × h" é o sufixo do título "Calculadora · kWh = kW × h"; o instrumento não declara fórmula própria. O texto literal na prosa é o div.desc da 1.4, "kWh = kW × horas" (fora do instrumento). Ver DIV-02. | linhas 1418, 1426 |
| COD-08 | baixa | MODULO_01_CORPO["aula-01-01"] tabelas | As 2 tabelas (1.2 e 1.3) têm 33 células de dados no total; 26 são verbatim, 7 só diferem por atributo class (a tabela 1.3 usa <b class="mono"> e o código grava <b>) e 0 divergem de outra forma. Os cabeçalhos são verbatim. | linhas 1380–1392 e 1397–1412 |
| COD-09 | baixa | MODULO_01_AULAS aula-01-01 activities[0].points | `points: 1` não tem origem na fonte (o § Drill não pontua exercícios). O enunciado, o gabarito e a tag do Ex·01 são verbatim. | linhas 2391–2398 |
| COD-10 | baixa | alexandria-instrument-calculators.ts n() | n() usa Number(v) e o original usa parseFloat(v) \|\| 0. Diferem em strings com sufixo não numérico ("12abc": parseFloat → 12, Number → 0). Com input[type=number] a diferença é praticamente inalcançável; registrada por fidelidade (§10). | linha 2745 (script) |
| COD-11 | informativa | ids | Código usa "inst-01", "ex-01", "aula-01-01"; esta extração usa "m01-inst-01", "m01-ex-01", "m01-a01". Mapeamento 1:1. | — |

**O que está conforme:**
- Lead verbatim em MODULO_01_LEAD["aula-01-01"].
- Títulos 1.1–1.6 com número e texto corretos.
- Cabeçalhos das tabelas 1.2 e 1.3 verbatim.
- Ex·01: tag, enunciado e gabarito verbatim; vinculado à aula pela tag.
- INST·01: título, ids dos campos, rótulos, unidades, padrões (10 e 5), min 0, step 0,5, ausência de max, rótulo/unidade da saída e nota verbatim.
- durationMinutes/difficulty/video = null, coerente com a fonte.

## O que a fonte não tem

- Duração, dificuldade, vídeo, imagens, figuras, listas, "Vale lembrar" e referências por aula: ausentes (`null`/vazio, medido).
- Procedência dos números da tabela 1.3 (lâmpada LED ≈ 9 W, chuveiro ≈ 5,5 kW, britador ≈ 2 MW, Itaipu ≈ 14 GW, geladeira ≈ 40 kWh/mês, cimenteira ≈ 5.000 MWh/mês, Brasil ≈ 530 TWh/ano) e dos cenários do instrumento: não declarada. Nada foi conferido fora da fonte.
- Pergunta própria do instrumento, previsão, gabarito do instrumento e tolerâncias (nenhuma declarada): ausentes.
- Vínculo declarado entre aula e termo do léxico, instrumento e exercício: só o exercício (pela tag).
