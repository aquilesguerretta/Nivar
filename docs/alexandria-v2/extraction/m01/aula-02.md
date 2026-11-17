# M01·A02: Sete símbolos. Toda a linguagem.

Arquivo de dados: [`aula-02.json`](aula-02.json). Gerado por `extratores/gen-aulas01-02.mjs` e verificado por `extratores/verify-aulas01-02.mjs`.

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A aula ocupa as linhas 1482 a 1580. O instrumento está nas linhas 1533 a 1562 e o script, nas linhas 2752 a 2792. O exercício vinculado está nas linhas 2400 a 2407.
- **Como foi extraído:** script node sobre fatias do HTML por linha; o percorredor lança erro em qualquer linha que não reconhece. Nenhuma prosa foi digitada. `html` guarda o innerHTML literal; `texto` guarda o mesmo conteúdo sem tags.
- **Cobertura por token (§5):** 527 de 527 tokens casados (100%), sem contar o markup do instrumento. A sequência de tokens extraída é idêntica à da fonte, em ordem. Instrumento: 60 de 60 tokens, sequência idêntica.

## Contagens

- **Blocos:** 19 (lead 1, titulo 5, paragrafo 8, tabela 2, formula 2, instrumento 1). Seções 2.1, 2.2, 2.3, 2.4, 2.5.
- **Tabelas:** 2 (linhas de dados: 7 e 3; 30 células). **Fórmulas:** 2, 2 com `desc`. **Destaques (callouts):** 0, com 0 parágrafo(s). **Painéis de três níveis:** 0.
- **Figuras, listas e "Vale lembrar":** 0, 0 e 0 (medido na section).
- **Instrumento:** 1 (3 entradas, 1 saída, 41 linhas de script, 12 cenários executados). **Invocações no texto:** 0. **Remissões a outras aulas:** 2.
- **Exercício vinculado:** 1 (Ex · 02 · Aula 02). **Relacionados sem vínculo:** 2. **Termos do léxico (candidatos):** 15 de 38.
- **Divergências da fonte:** 3. **Divergências com o código:** 12.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `aula` | Marcador, título do h2 (html e texto) e a pergunta do § MAP (L1340): "O que volt, ampere, watt, kVA e kVAr realmente medem?". Duração, dificuldade e vídeo ficam em `null`, com nota |
| `blocos[]` | 19 blocos na ordem da fonte. Cada um tem `origem {seletor, trecho_inicial, linha_aprox}`; tabelas, parágrafos de callout, abas e painéis têm origem por linha |
| `instrumentos[0]` | Campos (com atributos literais), saída, nota estática, script verbatim por linha, execução do script em DOM simulado e resíduos |
| `exercicios[0]` | Enunciado e gabarito verbatim, cálculos em destaque, critério `null` (com o critério do § Drill citado à parte) |
| `relacionados_nao_vinculados[]` | Itens do quiz e do checklist que tratam do mesmo tema, sem tag de aula (P9) |
| `divergencias[]` | Divergências da fonte, cada uma com as leituras verbatim e sem escolha |
| `comparacao_codigo` | Verificações programáticas, o que está conforme e as divergências COD-xx |

## Estrutura da aula, na ordem da fonte

- L1489 · lead · lead
- L1491 · titulo · **2.1** Volt — a "pressão" do circuito
- L1492 · paragrafo · parágrafo: "Volt (V) mede tensão elétrica: a diferença de potencial que empurra a …"
- L1494 · paragrafo · parágrafo: "No Brasil, você verá tensões em escalas muito diferentes ao longo da c…"
- L1496–1509 · tabela · tabela 3×7: Tensão / Onde aparece / Quem consome
- L1511 · titulo · **2.2** Ampere — o fluxo de carga
- L1512 · paragrafo · parágrafo: "Ampere (A) mede corrente elétrica: o fluxo de carga elétrica passando …"
- L1514 · titulo · **2.3** Watt — a potência ativa
- L1515 · paragrafo · parágrafo: "Watt (W) mede potência. Em corrente contínua (e como aproximação inici…"
- L1517–1520 · formula · fórmula: P (W) = V (volts) × I (amperes) · desc: Cadeia: V × A → W → kW → kWh × tarifa = custo
- L1522 · titulo · **2.4** Lei de Ohm — a relação fundamental
- L1523 · paragrafo · parágrafo: "Em qualquer circuito elétrico, três grandezas se relacionam de forma r…"
- L1525–1528 · formula · fórmula: V = I × R · desc: Tensão · Corrente · Resistência
- L1530 · paragrafo · parágrafo: "Resistência é a oposição que o material oferece à passagem de carga. T…"
- L1532–1562 · instrumento · **instrumento m01-inst-02**: Calculadora · Lei de Ohm
- L1564 · titulo · **2.5** kVA e kVAr — quando a rede vê mais do que trabalho útil
- L1565 · paragrafo · parágrafo: "Em corrente alternada (que é o padrão da rede pública), a história é m…"
- L1567–1576 · tabela · tabela 3×3: Grandeza / Unidade / Função
- L1578 · paragrafo · parágrafo: "Essas três grandezas formam um triângulo retângulo: kW e kVAr são os c…"

## INST·02: resumo da especificação

- **Título:** "Calculadora · Lei de Ohm". O id na fonte é "INST · 02". Taxonomia: `calculadora` (ver nota no JSON).
- **Pergunta:** `null`. Instrução da prancha: "Preencha dois campos. O terceiro é calculado." (L1539).
- **Entradas:**

  | Id | Rótulo | Unidade | Padrão | Mín. | Passo | Máx. | Placeholder |
  |---|---|---|---|---|---|---|---|
  | `i02-v` | Tensão | V | vazio | — | any | sem máx. | ex: 220 |
  | `i02-i` | Corrente | A | vazio | — | any | sem máx. | ex: 10 |
  | `i02-r` | Resistência | Ω | vazio | — | any | sem máx. | calculado |

- **Saída `i02-status`:** "Status" (texto de status, sem unidade). Valor inicial na marcação: "Aguardando 2 valores...".
- **Nota (estática):** "Em 220 V × 10 A, a potência aproximada é 2.200 W = 2,2 kW. Ligando por 5 horas: 11 kWh. Essa cadeia V × A → W → kW → kWh × tarifa = R$ é a espinha física da fatura elétrica."
- **Fonte dos números:** `null`. **Tolerâncias:** só a coerência relativa de 0.01 (`diff < 0.01`).

### Execução do script-fonte em DOM simulado

| Cenário | Passo final | V | I | R | Status |
|---|---|---|---|---|---|
| carga | carga (sem eventos; o texto vem da marcação, o script não chama calc() no carregamento) | — | — | — | Aguardando 2 valores... |
| só V preenchido | V = "220" | 220 | — | — | Aguardando 2 valores... |
| V e I → calcula R | I = "10" | 220 | 10 | 22.000 | R = V ÷ I = 22.000 Ω |
| V e R → calcula I | R = "22" | 220 | 10.00 | 22 | I = V ÷ R = 10.00 A |
| I e R → calcula V | R = "22" | 220.00 | 10 | 22 | V = I × R = 220.00 V |
| V e I (R calculado = 22,000), depois V = 110 → coerência | V = "110" | 110 | 10 | 22.000 | Inconsistente — limpe um campo |
| I e R (V calculado = 220,00), depois V redigitado = 220 → coerente | V = "220" | 220 | 10 | 22 | Coerente: 220 V |
| V e I (R calculado), depois R editado = 25 (os três preenchidos, handler de R) | R = "25" | 220 | 10 | 22.000 | R = V ÷ I = 22.000 Ω |
| V e I (R calculado), depois V esvaziado | V = "" | — | 10 | — | Aguardando 2 valores... |
| V e I (R calculado), depois I esvaziado | I = "" | 220 | — | — | Aguardando 2 valores... |
| I e R (V calculado = 220,00), depois V = 0 | V = "0" | 0 | 10 | 22 | Inconsistente — limpe um campo |
| V e I (R calculado), depois R esvaziado (o handler de R reescreve R = V ÷ I) | R = "" | 220 | 10 | 22.000 | R = V ÷ I = 22.000 Ω |

**Resíduos do script (sinalizados, não corrigidos):**

- O script NÃO chama calc() no carregamento: o texto "Aguardando 2 valores..." vem da marcação, e não de um primeiro cálculo.
- `filled` conta só valores > 0, mas os ramos testam `!isNaN(...)`. Com V = 0 digitado, `filled` não conta o V, mas o ramo "V ausente" também não dispara (V = 0 não é NaN): cai na checagem de coerência (divisão por zero → "Inconsistente — limpe um campo").
- Os handlers de V e de I chamam `calc()` sem argumento; o de R chama `calc('R')`. Por isso, editar R com V e I preenchidos recalcula e SOBRESCREVE R (R = V ÷ I), em vez de checar coerência. O ramo `changed === 'V'` nunca é alcançado (ninguém chama calc('V')).
- Esvaziar V ou I zera o campo R e volta o status para "Aguardando 2 valores...". Esvaziar R com V e I preenchidos não esvazia nada: o handler de R chama calc('R'), que reescreve R = V ÷ I (o campo volta a 22.000 no cenário).
- O campo calculado vira valor do input: o campo "calculado" deixa de estar vazio, e uma edição posterior de V ou I cai na checagem de coerência contra o valor antigo (cenário "V = 110").
- Formatos: V e I com `toFixed(2)`, R com `toFixed(3)`, coerência com `toFixed(0)`; tolerância de coerência 1% (`diff < 0.01`).

## Onde o instrumento é invocado (C5)

- A fonte não tem frase de invocação. O instrumento vem logo depois do parágrafo da linha 1530 e antes do h3 seguinte. A posição é por adjacência.

## Exercício vinculado

- **Ex · 02 · Aula 02** (L2400–2407). Enunciado: "Um equipamento opera em 220 V e puxa 20 A. Qual a potência aproximada em kW? Se ficar ligado 6 horas, qual o consumo?"
- **Gabarito:** "Potência: 220 × 20 = 4.400 W = 4,4 kW. Consumo em 6 horas: 4,4 × 6 = 26,4 kWh. Observe a cadeia completa: V × A → W → kW → kWh."
- **Critério:** `null` por exercício; o § Drill diz "Resolva cada exercício mentalmente ou no papel antes de revelar a resposta. Os exercícios alcançam todas as nove aulas. O critério de domínio é resolver pelo menos seis dos oito sem consulta."

## Termos do léxico (correspondência textual, não posse)

Ampere (A) (2); Corrente alternada (AC) (2); Corrente contínua (DC) (1); Fator de potência (FP) (1); Grupo A (1); kVA (5); kVAr (5); kW (7); kWh (4); Lei de Ohm (3); Perdas técnicas (1); Potência (9); Tensão (13); Volt (V) (2); Watt (W) (2).

## Divergências na fonte (sem escolha)

- **DIV-01** — A lista de unidades do lead, a do § MAP e as unidades que os títulos 2.1–2.5 nomeiam não coincidem.
  - marcador da aula, L1486: "As sete unidades essenciais"
  - lead (7 símbolos), L1489: "V, A, W, kW, kWh, kVA, kVAr. Quem domina essas sete unidades e a relação entre elas consegue ler qualquer fatura industrial brasileira sem precisar perguntar o que cada linha significa."
  - § MAP (5 unidades), L1340: "O que volt, ampere, watt, kVA e kVAr realmente medem?"
  - títulos 2.1, 2.2, 2.3, 2.4, 2.5, L1491: "Volt — a "pressão" do circuito \| Ampere — o fluxo de carga \| Watt — a potência ativa \| Lei de Ohm — a relação fundamental \| kVA e kVAr — quando a rede vê mais do que trabalho útil"
  - O lead lista V, A, W, kW, kWh, kVA, kVAr. O § MAP lista volt, ampere, watt, kVA e kVAr. Os títulos nomeiam Volt, Ampere, Watt, Lei de Ohm e kVA/kVAr: a Lei de Ohm introduz o ohm (Ω), que não está na lista de sete, e kW e kWh não têm subseção própria na A02 (kW aparece na tabela 2.5 e kWh na cadeia da fórmula 2.3).
- **DIV-02** — A cadeia de conversão termina em "custo" na fórmula 2.3 e em "R$" na nota do INST·02.
  - div.formula.desc (2.3), L1519: "Cadeia: V × A → W → kW → kWh × tarifa = custo"
  - div.instrument-note (INST·02), L1559: "Em 220 V × 10 A, a potência aproximada é 2.200 W = 2,2 kW. Ligando por 5 horas: 11 kWh. Essa cadeia V × A → W → kW → kWh × tarifa = R$ é a espinha física da fatura elétrica."
  - Mesma sequência V × A → W → kW → kWh × tarifa; o último termo é "custo" numa e "R$" na outra.
- **DIV-03** — Na A02 a corrente é a vazão; a tabela 1.2 da A01 dá à vazão o papel da potência.
  - A02, 2.2, L1512: "Ampere (A) mede corrente elétrica: o fluxo de carga elétrica passando pelo condutor por segundo. Se tensão é pressão, corrente é vazão. Cargas grandes — motores industriais, britadores, fornos — puxam mais corrente, especialmente em tensões mais baixas."
  - A01, tabela 1.2, L1386: "Vazão da torneira (L/s) \| Potência (kW) \| Quanto fluxo neste instante"
  - Mesma contradição registrada como DIV-01 em aula-01.md; repetida aqui porque a A02 é o lado que diz "corrente é vazão".

## Divergências em relação ao código portado

Código lido: `src/lib/data/alexandria-modulo-01-content.ts`, chaves `aula-01-02` (corpo, lead, aula) e `inst-02`, e `alexandria-instrument-calculators.ts`.

| Id | Gravidade | Onde | Divergência | Fonte |
|---|---|---|---|---|
| COD-01 | alta | MODULO_01_CORPO["aula-01-02"] fórmulas 2.3 e 2.4 | As 2 fórmulas têm div.desc na fonte e desc = null no código (2 descrições perdidas): "P (W) = V (volts) × I (amperes)" → "Cadeia: V × A → W → kW → kWh × tarifa = custo"; "V = I × R" → "Tensão · Corrente · Resistência". A desc da 2.3 é a única ocorrência literal da cadeia V × A → W → kW → kWh × tarifa = custo na apostila (a outra está na nota do INST·02, com "R$"). O eq das duas fórmulas é igual ao da fonte. | linhas 1517–1520 e 1525–1528 |
| COD-02 | alta | INSTRUMENTOS_MODULO_01 inst-02 | A instrução do instrumento, "Preencha dois campos. O terceiro é calculado." (p dentro de div.instrument-body), não existe no código: o tipo Instrument não tem campo para ela e a nota é só o texto de div.instrument-note. É a única frase da prancha que diz o que fazer. | linha 1539 |
| COD-03 | média | INSTRUMENTOS_MODULO_01 inst-02 .note | Nota não verbatim: os 2 <span class="hl"> (2.200 W = 2,2 kW; 11 kWh) foram removidos e os 2 </span> de fechamento ficaram ("…2.200 W = 2,2 kW</span>. Ligando por 5 horas: 11 kWh</span>."). Texto sem tags igual ao da fonte. | linha 1559 |
| COD-04 | média | INSTRUMENTOS_MODULO_01 inst-02 .fields | Os 3 campos nascem com defaultValue: '' e sem os atributos da fonte: placeholder "ex: 220", "ex: 10" e "calculado", e step="any". O tipo InstrumentField (src/lib/types/alexandria.ts:271) não tem campo `placeholder`, e `step` do tipo é number, sem "any". Mudança de tipo compartilhado: é da FOUNDRY, não foi tocada. | linhas 1543, 1547, 1551 |
| COD-05 | alta | AulaViewer.tsx + MODULO_01_AULAS aula-01-02 | Instrumento sem posição no fluxo (AulaViewer.tsx L125, depois da apostila inteira). Na fonte ele fica entre o parágrafo 2.4 ("Resistência é a oposição… perdas técnicas do sistema elétrico.") e o h3 2.5. A fonte não tem frase de invocação ("abaixo", "pratique"): a posição é só por adjacência. Viola bar C5 e a Regra-mãe 1. | linhas 1532–1562 |
| COD-06 | média | INSTRUMENTOS_MODULO_01 inst-02 .formula | formula = "V = I × R" não existe dentro do instrumento. Vem do div.formula da 2.4 e do campo de unidade do verbete "Lei de Ohm" no léxico (ambos fora do instrumento). O título é só "Calculadora · Lei de Ohm". | linhas 1526, 1535 |
| COD-07 | média | alexandria-instrument-calculators.ts inst-02 (L1683–1712) | A porta é uma função pura que ignora o argumento `changed` do original (o handler de R chama calc('R'); os de V e I chamam calc()). Pela leitura, 2 casos medidos no script-fonte (cenários da camada de execução) saem diferentes: (a) R editado com V e I preenchidos — o original recalcula R = V ÷ I e mostra "R = V ÷ I = …"; a porta mostra "Coerente: …" ou "Inconsistente — limpe um campo"; (b) V = 0 digitado com I e R preenchidos — o original cai na checagem de coerência (divisão por zero → "Inconsistente"); a porta trata V = 0 como ausente e calcula V = I × R. Deduzido da leitura do .ts; o TS não foi executado nesta extração. | linhas 2761–2791 (script) |
| COD-08 | baixa | alexandria-instrument-calculators.ts inst-02 | Os handlers de V e I que esvaziam R quando o campo é esvaziado não foram portados. O próprio código já sinaliza isso (comentário nas L1676–1682). Registrado por fidelidade. | linhas 2789–2790 |
| COD-09 | informativa | MODULO_01_CORPO["aula-01-02"] tabelas | As 2 tabelas (2.1 e 2.5) têm 30 células de dados e 30 são verbatim (0 só diferem por class e 0 de outra forma); os cabeçalhos são verbatim. 10 células carregam <td class="mono"> na fonte (colunas "Tensão" da 2.1 e "Unidade" da 2.5); o tipo de tabela do código guarda a célula como string de conteúdo, então a classe de apresentação não é representável. Conteúdo sem perda. | linhas 1496–1509 e 1567–1576 |
| COD-10 | baixa | MODULO_01_AULAS aula-01-02 activities[0].points | `points: 1` não tem origem na fonte. O enunciado, o gabarito e a tag do Ex·02 são verbatim. | linhas 2400–2407 |
| COD-11 | baixa | MODULO_01_AULAS aula-01-02 illustrations | `illustrations: ['fis-04-triangulo-potencia.png']` mapeia uma gravura que a fonte não tem: o HTML não tem nenhum <img> na A02. O vínculo é decisão editorial do código (o triângulo é o assunto do parágrafo final, 2.5), não declarado pela fonte. | linhas 1578 |
| COD-12 | informativa | ids | Código usa "inst-02", "ex-02", "aula-01-02"; esta extração usa "m01-inst-02", "m01-ex-02", "m01-a02". Mapeamento 1:1. | — |

**O que está conforme:**
- Lead verbatim em MODULO_01_LEAD["aula-01-02"].
- Títulos 2.1–2.5 com número e texto corretos.
- Cabeçalhos das tabelas 2.1 e 2.5 verbatim.
- Ex·02: tag, enunciado e gabarito verbatim; vinculado à aula pela tag.
- INST·02: título, ids e rótulos dos 3 campos, unidades; saída "Status"; textos dos 4 estados e fórmulas toFixed (2/2/3/0) iguais às do script.
- durationMinutes/difficulty/video = null, coerente com a fonte.

## O que a fonte não tem

- Duração, dificuldade, vídeo, imagens, figuras, listas, "Vale lembrar" e referências por aula: ausentes (`null`/vazio, medido).
- Procedência dos números da tabela 2.1 e dos exemplos do instrumento: não declarada. Nada foi conferido fora da fonte.
- Pergunta própria do instrumento, previsão, gabarito do instrumento e tolerâncias (exceto a coerência de 1% do script do INST·02): ausentes.
- Vínculo declarado entre aula e termo do léxico, instrumento e exercício: só o exercício (pela tag).
