# Avaliação do M01 — exercícios por aula e prova do módulo

Dados: `src/lib/alexandria/avaliacao.ts` (tipos e leituras) e `avaliacao.dados.ts` (GERADO por
`tools/alexandria-dados/gerar-avaliacao.mjs`; nunca à mão). Conferência:
`node tools/alexandria-dados/verificar-avaliacao.mjs`. Fonte única: `docs/alexandria-v2/extraction/m01/`
(`aula-0N.json`, `aparato.json`); o HTML original não foi reaberto — a extração já traz a linha dele.

**Estado: 28 itens por aula (7 da fonte + 21 derivados) · 1 síntese sem aula · prova de 10 questões · checklist de 16 itens.
Os 21 itens `derivado-da-aula` esperam a aprovação do Founder antes do deploy** (lista completa na seção 3).

## 1. Contagem por aula e origem

| Aula | Fonte (Ex·NN) | Derivado da aula | Total |
|---|---|---|---|
| A01 | Ex·01 | 2 | 3 |
| A02 | Ex·02 | 2 | 3 |
| A03 | — | 4 | 4 |
| A04 | Ex·03 | 2 | 3 |
| A05 | Ex·04, Ex·07 | 0 | 2 |
| A06 | — | 3 | 3 |
| A07 | Ex·05 | 2 | 3 |
| A08 | Ex·06 | 2 | 3 |
| A09 | — | 4 | 4 |
| **Soma** | **7** | **21** | **28** |

Mais: **Ex·08 (Síntese)** — a fonte não o liga a aula (`exerciciosDoModulo`); **prova** de 10 × 4; **checklist final** de 16 itens.
Os 8 Ex·NN da fonte são 7 vinculados a aula (A01, A02, A04, A05 ×2, A07, A08) + Ex·08 solto. A03, A06 e A09 não têm exercício na fonte
(medido em cada `aula-0N.json`: `exercicios: []`).

## 2. Tabela aula × item × origem × fonte

`fonte` é `arquivo :: campo @ linha do HTML`. Itens derivados citam o bloco da própria aula (`aula-0N.json`).

| Aula | Item | Origem | Tipo | Verificação | Fonte (campo @ linha) |
|---|---|---|---|---|---|
| A01 | `m01-ex-01` | fonte | aberto | autoavaliação | aula-01.json :: `exercicios[0].enunciado_texto` @ L2391 |
| A01 | `m01-a01-d01` | derivado-da-aula | escolha | alternativa correta | aula-01.json :: `blocos[6].texto` @ L1376 |
| A01 | `m01-a01-d02` | derivado-da-aula | aberto | autoavaliação | aula-01.json :: `blocos[17].paragrafos[1].texto` @ L1455 |
| A02 | `m01-ex-02` | fonte | aberto | autoavaliação | aula-02.json :: `exercicios[0].enunciado_texto` @ L2400 |
| A02 | `m01-a02-d01` | derivado-da-aula | escolha | alternativa correta | aula-02.json :: `blocos[6].texto` @ L1512 |
| A02 | `m01-a02-d02` | derivado-da-aula | escolha | alternativa correta | aula-02.json :: `blocos[18].texto` @ L1578 |
| A03 | `m01-a03-d01` | derivado-da-aula | escolha | alternativa correta | aula-03.json :: `blocos[13].texto` @ L1636 |
| A03 | `m01-a03-d02` | derivado-da-aula | aberto | autoavaliação | aula-03.json :: `blocos[7].texto` @ L1622 |
| A03 | `m01-a03-d03` | derivado-da-aula | escolha | alternativa correta | aula-03.json :: `blocos[14].texto` @ L1638 |
| A03 | `m01-a03-d04` | derivado-da-aula | aberto | autoavaliação | aula-03.json :: `blocos[16].texto` @ L1644 |
| A04 | `m01-ex-03` | fonte | aberto | autoavaliação | aula-04.json :: `exercicios[0].enunciado_texto` @ L2409 |
| A04 | `m01-a04-d01` | derivado-da-aula | escolha | alternativa correta | aula-04.json :: `blocos[2].texto` @ L1659 |
| A04 | `m01-a04-d02` | derivado-da-aula | escolha | alternativa correta | aula-04.json :: `blocos[11].linhas[1].celulas[0].texto` @ L1717 |
| A05 | `m01-ex-04` | fonte | aberto | autoavaliação | aula-05.json :: `exercicios[0].enunciado_texto` @ L2418 |
| A05 | `m01-ex-07` | fonte | aberto | autoavaliação | aula-05.json :: `exercicios[1].enunciado_texto` @ L2445 |
| A06 | `m01-a06-d01` | derivado-da-aula | aberto | autoavaliação | aula-06.json :: `blocos[4].texto` @ L1851 |
| A06 | `m01-a06-d02` | derivado-da-aula | aberto | autoavaliação | aula-06.json :: `blocos[9].texto` @ L1871, L1872 |
| A06 | `m01-a06-d03` | derivado-da-aula | escolha | alternativa correta | aula-06.json :: `blocos[14].linhas[2].celulas[0].texto` @ L1888 |
| A07 | `m01-ex-05` | fonte | aberto | autoavaliação | aula-07.json :: `exercicios[0].enunciado_texto` @ L2427 |
| A07 | `m01-a07-d01` | derivado-da-aula | escolha | alternativa correta | aula-07.json :: `blocos[2].texto` @ L1908 |
| A07 | `m01-a07-d02` | derivado-da-aula | aberto | autoavaliação | aula-07.json :: `blocos[13].texto` @ L1984 |
| A08 | `m01-ex-06` | fonte | aberto | autoavaliação | aula-08.json :: `exercicios[0].enunciado_texto` @ L2436 |
| A08 | `m01-a08-d01` | derivado-da-aula | escolha | alternativa correta | aula-08.json :: `blocos[3].texto` @ L2016 |
| A08 | `m01-a08-d02` | derivado-da-aula | aberto | autoavaliação | aula-08.json :: `blocos[3].texto` @ L2016 |
| A09 | `m01-a09-d01` | derivado-da-aula | escolha | alternativa correta | aula-09.json :: `blocos[3].linhas[0].celulas[0].texto` @ L2114 |
| A09 | `m01-a09-d02` | derivado-da-aula | escolha | alternativa correta | aula-09.json :: `blocos[5].linhas[1].celulas[0].texto` @ L2127 |
| A09 | `m01-a09-d03` | derivado-da-aula | escolha | alternativa correta | aula-09.json :: `blocos[8].linhas[1].celulas[0].texto` @ L2144 |
| A09 | `m01-a09-d04` | derivado-da-aula | escolha | alternativa correta | aula-09.json :: `blocos[9].texto` @ L2152 |
| — | `m01-ex-08` (síntese) | fonte | aberto | autoavaliação | aparato.json :: `exercicios.soltos_P9[0].enunciado.texto` @ L2456 |

### Prova (`aparato.json`, `avaliacao`)

Critério literal (L2473): "O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar." → `acertosMinimos: 8`, `total: 10` (lidos do "N de M" do critério).

| Questão | Linha | Correta |
|---|---|---|
| `m01-quiz-q01` — Um motor de 20 kW opera por 4 horas. Qual o consumo? | L3078 | C. 80 kWh |
| `m01-quiz-q02` — Em corrente contínua aproximada, qual a relação entre tensão, corrente e potênc… | L3084 | B. P = V × I |
| `m01-quiz-q03` — Se a corrente em um cabo triplica, o que acontece com as perdas resistivas? | L3090 | D. Aumentam 9 vezes |
| `m01-quiz-q04` — Por que uma fábrica paga demanda além de consumo? | L3096 | B. Porque a rede precisa ser dimensionada para o pico de potên… |
| `m01-quiz-q05` — Uma instalação tem demanda média de 200 kW e demanda máxima de 500 kW. Qual o f… | L3107 | A. 0,40 |
| `m01-quiz-q06` — No Brasil, fator de potência mínimo de referência regulatória para Grupo A é: | L3113 | C. 0,92 |
| `m01-quiz-q07` — Qual a relação correta entre as três potências em um triângulo de potência? | L3119 | B. kVA² = kW² + kVAr² |
| `m01-quiz-q08` — Uma usina solar de 50 MW gerou 100.000 MWh em um ano (8.760 h). Qual o fator de… | L3130 | B. 22,8% |
| `m01-quiz-q09` — Qual subgrupo tarifário concentra a maioria do mercado livre potencial industri… | L3136 | C. A4 |
| `m01-quiz-q10` — Um cliente diz: 'Minha conta de luz está cara, quero mercado livre.' Qual a pri… | L3142 | C. Pedir 12 faturas e diagnosticar a estrutura atual de custo … |

Faixas de placar (literais do script, L3199):

| Acertos | Mensagem da fonte |
|---|---|
| 9–10 | Domínio sólido. Pronto para o Módulo 02. |
| 7–8 | Bom. Revise os pontos errados, depois avance para o próximo módulo. |
| 5–6 | Domínio parcial. Volte às aulas onde errou antes de avançar. |
| 0–4 | Refaça o estudo. O critério de domínio é 8/10 — sem atalho. |

## 3. Itens `derivado-da-aula` — para o Founder revisar

Todo item abaixo tem a resposta **literalmente** no texto da aula (campo `evidencias`, conferido por substring pelo verificador).
Nenhum número, unidade ou afirmação vem de fora. Em `escolha`, os distratores são termos ou frases que aparecem nas aulas do M01;
os marcados ◇ aparecem só em **outra** aula do módulo (não na própria aula) — é decisão sua se mantém. Nenhum item é cálculo: os cenários
numéricos pertencem aos instrumentos e aos Ex·NN, e um item derivado não pode entregá-los.

Para aprovar: ler a pergunta, a resposta e o trecho. Se algum não serve, diga o id; ele sai de `ESPECIFICACOES` no gerador e o dado é regenerado.

### `m01-a01-d01` — A01 · escolha

**Pergunta.** Segundo a aula, qual é a pergunta que a potência responde?

- A. Quanto foi usado no total?
- B. Com que ritmo está sendo usado agora? ← **resposta**
- C. Subiu por kWh, por kW, por horário, por bandeira, por reativo, por imposto, ou por reajuste?

**Trecho da aula** (aula-01.json, `blocos[6].texto`, L1376): "Potência responde "com que ritmo está sendo usado agora?"."

### `m01-a01-d02` — A01 · aberto

**Pergunta.** A aula traz, como erro de fluência, a frase "A empresa consumiu 500 kW no mês." Por que ela está errada, e o que a aula diz que seria o correto?

**Resposta (trecho literal da aula)** (aula-01.json, `blocos[17].paragrafos[1].texto`, L1455): ""A empresa consumiu 500 kW no mês." Errado. Ela demandou 500 kW em algum momento e consumiu X kWh ao longo do mês."

### `m01-a02-d01` — A02 · escolha

**Pergunta.** Na analogia da torneira que a aula usa, a corrente elétrica corresponde a quê?

- A. Pressão da água
- B. Volume ◇
- C. Vazão ← **resposta**

**Trecho da aula** (aula-02.json, `blocos[6].texto`, L1512): "Se tensão é pressão, corrente é vazão."

### `m01-a02-d02` — A02 · escolha

**Pergunta.** Em corrente alternada, qual das três potências "ocupa a rede sem virar produção"?

- A. kW
- B. kVA
- C. kVAr ← **resposta**

**Trecho da aula** (aula-02.json, `blocos[18].texto`, L1578): "kW é o que vira produção; kVAr ocupa a rede sem virar produção; kVA é o que a rede precisa dimensionar."

### `m01-a03-d01` — A03 · escolha

**Pergunta.** Se o consumo aumenta e a geração não acompanha, o que acontece com a frequência da rede?

- A. Oscila sessenta vezes por segundo
- B. A frequência sobe
- C. A frequência da rede cai ← **resposta**

**Trecho da aula** (aula-03.json, `blocos[13].texto`, L1636): "Se o consumo aumenta e a geração não acompanha, a frequência da rede cai."

### `m01-a03-d02` — A03 · aberto

**Pergunta.** Por que a corrente alternada venceu a Guerra das Correntes, segundo a aula?

**Resposta (trecho literal da aula)** (aula-03.json, `blocos[7].texto`, L1622): "a corrente alternada venceu por uma razão técnica decisiva: com AC é simples elevar e reduzir tensão usando transformadores. Em DC, o equivalente é tecnologicamente muito mais caro e complexo."

### `m01-a03-d03` — A03 · escolha

**Pergunta.** Quantas vezes por dia, segundo a aula, o ONS precisa equilibrar oferta e demanda?

- A. 60
- B. 86.400 ← **resposta**
- C. 8.760 ◇
- D. 24 ◇

**Trecho da aula** (aula-03.json, `blocos[14].texto`, L1638): "Coordena um sistema físico que precisa equilibrar oferta e demanda 86.400 vezes por dia — uma vez por segundo, todos os segundos."

### `m01-a03-d04` — A03 · aberto

**Pergunta.** Segundo a aula, que equipamentos sensíveis são afetados por quedas ou desvios relevantes de frequência, e como?

**Resposta (trecho literal da aula)** (aula-03.json, `blocos[16].texto`, L1644): "motores síncronos perdem sincronismo, drives de velocidade variável desarmam por proteção, sistemas de controle de processo travam."

### `m01-a04-d01` — A04 · escolha

**Pergunta.** Como a aula chama o fenômeno em que parte da energia elétrica se transforma em calor ao passar por um condutor com resistência?

- A. Lei de Ohm ◇
- B. Efeito Joule ← **resposta**
- C. TUSD-fio
- D. UFER ◇

**Trecho da aula** (aula-04.json, `blocos[2].texto`, L1659): "parte da energia elétrica se transforma em calor. Isso é dissipação resistiva — o famoso "efeito Joule"."

### `m01-a04-d02` — A04 · escolha

**Pergunta.** Segundo a tabela da aula, qual destes é exemplo de perda não técnica?

- A. Aquecimento de cabos
- B. Perdas em transformadores
- C. Furto de energia ← **resposta**
- D. Perdas magnéticas

**Trecho da aula** (aula-04.json, `blocos[11].linhas[1].celulas[0].texto`, L1717): "Não técnicas — Comerciais — furto de energia, fraude no medidor, inadimplência, erro de medição"

### `m01-a06-d01` — A06 · aberto

**Pergunta.** Segundo a aula, qual é a diferença entre a estrutura tarifária do Grupo B e a do Grupo A?

**Resposta (trecho literal da aula)** (aula-06.json, `blocos[4].texto`, L1851): "Grupo B paga uma tarifa simples (essencialmente: kWh × tarifa). Grupo A paga uma estrutura tarifária binômia: uma componente para consumo (kWh) e outra para demanda (kW)."

### `m01-a06-d02` — A06 · aberto

**Pergunta.** Por que, em geral, quanto mais alta a tensão de fornecimento, menor a tarifa? Cite o que a aula lista.

**Resposta (trecho literal da aula)** (aula-06.json, `blocos[9].texto`, L1871, L1872): "Quanto mais alta a tensão de fornecimento, mais próximo o consumidor está fisicamente da geração e da transmissão troncal, e menos camadas de rede ele atravessa. Menos perdas técnicas embutidas na sua tarifa; Menos uso de ativos de distribuição de baixa tensão; Menor componente de TUSD comparada à TE."

### `m01-a06-d03` — A06 · escolha

**Pergunta.** Qual sistema de fornecimento a aula descreve como "padrão industrial"?

- A. Monofásico
- B. Bifásico
- C. Trifásico ← **resposta**

**Trecho da aula** (aula-06.json, `blocos[14].linhas[2].celulas[0].texto`, L1888): "Trifásico — Padrão industrial; comércios médios e grandes; motores trifásicos"

### `m01-a07-d01` — A07 · escolha

**Pergunta.** Qual destes equipamentos a aula cita como puramente resistivo, com a corrente em fase com a tensão?

- A. Motores
- B. Uma resistência de chuveiro ← **resposta**
- C. Transformadores
- D. Compressores

**Trecho da aula** (aula-07.json, `blocos[2].texto`, L1908): "Em equipamentos puramente resistivos — uma resistência de chuveiro, uma lâmpada incandescente — a corrente está perfeitamente em fase com a tensão."

### `m01-a07-d02` — A07 · aberto

**Pergunta.** Segundo a aula, por que o fator de potência baixo de uma instalação afeta outros clientes da mesma rede?

**Resposta (trecho literal da aula)** (aula-07.json, `blocos[13].texto`, L1984): "ela força a distribuidora a entregar mais kVA para produzir o mesmo kW útil. Isso ocupa capacidade de transformadores, cabos e proteção, além de aumentar perdas — externalidades que afetam todos os outros clientes daquela rede."

### `m01-a08-d01` — A08 · escolha

**Pergunta.** Em que unidade a aula diz que a geração efetiva é medida?

- A. MW
- B. kVA ◇
- C. MWh ← **resposta**
- D. %

**Trecho da aula** (aula-08.json, `blocos[3].texto`, L2016): "Geração efetiva é o que a usina realmente produziu em um período, medido em MWh."

### `m01-a08-d02` — A08 · aberto

**Pergunta.** Segundo a aula, por que uma usina não gera sua capacidade instalada o tempo todo? Dê os exemplos que a aula traz.

**Resposta (trecho literal da aula)** (aula-08.json, `blocos[3].texto`, L2016): "A solar não gera à noite. A eólica depende do vento. A hidrelétrica depende de chuva e reservatório. A térmica depende de combustível disponível e despacho do sistema."

### `m01-a09-d01` — A09 · escolha

**Pergunta.** Segundo a tabela das três dimensões da qualidade, a qual delas pertencem os indicadores DEC e FEC?

- A. Qualidade do produto (tensão)
- B. Qualidade comercial
- C. Qualidade do serviço (continuidade) ← **resposta**

**Trecho da aula** (aula-09.json, `blocos[3].linhas[0].celulas[0].texto`, L2114): "Qualidade do serviço (continuidade) — DEC, FEC (coletivos) · DIC, FIC, DMIC, DICRI (individuais)"

### `m01-a09-d02` — A09 · escolha

**Pergunta.** Na tabela de indicadores de continuidade, o que mede o FEC?

- A. Tempo total médio de interrupção por consumidor no ano (em horas)
- B. Maior interrupção individual no período
- C. Número médio de interrupções por consumidor no ano ← **resposta**
- D. Número de interrupções naquela unidade no período

**Trecho da aula** (aula-09.json, `blocos[5].linhas[1].celulas[0].texto`, L2127): "FEC — Frequência Equivalente de interrupção por unidade Consumidora — Número médio de interrupções por consumidor no ano"

### `m01-a09-d03` — A09 · escolha

**Pergunta.** Qual fenômeno a aula descreve como "queda rápida e temporária da tensão"?

- A. Sobretensão
- B. Harmônicos
- C. Flicker (flutuação de tensão)
- D. Afundamento de tensão (voltage sag) ← **resposta**

**Trecho da aula** (aula-09.json, `blocos[8].linhas[1].celulas[0].texto`, L2144): "Afundamento de tensão (voltage sag) — Queda rápida e temporária da tensão"

### `m01-a09-d04` — A09 · escolha

**Pergunta.** Na medição de conformidade de tensão (intervalos de 10 minutos por pelo menos sete dias consecutivos), quantas leituras a aula diz que isso totaliza?

- A. 86.400 ◇
- B. 8.760 ◇
- C. 1.008 ← **resposta**
- D. 24 ◇

**Trecho da aula** (aula-09.json, `blocos[9].texto`, L2152): "com medição integralizada em intervalos de 10 minutos por pelo menos sete dias consecutivos, totalizando 1.008 leituras."

## 4. O que o Founder precisa saber (alertas medidos)

1. **Ex·04 é o cenário-padrão do INST·04** (144.000 kWh · 720 h · 800 kW; `aula-05.json`, `instrumentos[0].coincidencia_com_exercicio`).
   O item carrega `alertas`. Quem renderiza a Aula 05 não deve abrir o instrumento nesse cenário antes da tentativa do Ex·04. O verificador
   confere que nenhum derivado repete valor do cenário-padrão de instrumento e que o único enunciado da fonte que repete (Ex·04) tem o alerta.
2. **QA-M01-A06 e QA-M01-A07 (suas): nenhum item depende delas.** O verificador reprova item que cite as linhas L1845/L1846/L1863 (A06) ou L1981 (A07),
   ou que use "2,3 kV", "AS", "15%", "0,85". Os três derivados da A06 tratam de estrutura tarifária (L1851), de por que tensão maior tem tarifa menor (L1871–1872)
   e do sistema trifásico (L1888); nenhum usa o limiar de 2,3 kV. Os dois da A07 são de 7.1 (L1908) e 7.4 (L1984), longe do 7.3 em dúvida.
3. **QA-FCap-01 (P20) ainda aberta**: a referência do Ex·06 e a explicação da Q08 trazem faixas de fator de capacidade ("~20–28%", hidro, nuclear).
   Literais da fonte, com `alertas` no item; nenhum derivado da A08 usa essas faixas.
4. **Palavra "domínio" nas faixas.** 3 das 4 mensagens literais usam "Domínio"/"domínio" sem Demonstrado, o que o bar.md S3 reserva a Demonstrado.
   O dado preserva o literal; **quem renderiza decide a redação** (regra do Founder: a avaliação do módulo é "Avaliação do módulo: aprovada · X/10 · critério da fonte").
   `resultadoDaProva()` devolve esse rótulo. O rótulo de quem não atinge o critério ("ainda não aprovada") é **texto novo** — você assina ou troca.
5. **A fonte se contradiz entre a faixa 7–8 e o critério.** A faixa 7–8 diz "Bom. Revise os pontos errados, depois avance", mas o critério é 8/10: com 7 acertos a
   mensagem manda avançar e o critério não aprova. Preservado como está; `aprovada` usa só o critério.
6. **A fonte não liga questão da prova a aula** (`vinculos.aulas_declaradas: []` nas 10). Por isso a questão não tem `aula`, e o "Rever [seção]" do bar.md C10
   não tem de onde sair: ausência declarada, não preenchida.
7. **Não há critério por exercício na fonte.** O único é o do § Drill, "resolver pelo menos seis dos oito sem consulta" (módulo inteiro); vai em `criterio` dos
   8 Ex·NN, com `contaParaCriterioDoDrill: true`. Derivados têm `false`: não entram em "seis dos oito".
8. **Nenhuma tolerância.** `tolerancia: null` em todos. Resposta aberta/numérica fecha por autoavaliação (atende · atende em parte · não atende; `NIVEIS_DE_AUTOAVALIACAO`);
   só `escolha` tem alternativa correta. Os tipos `numerico` e `ordenar` existem no contrato e **não têm uso no M01**.
9. **Checklist final: 16 afirmações de capacidade ("Explicar…", "Calcular…"), não perguntas** — não viraram exercício. Estão em `checklistDoModulo`, como autodeclaração.
   O item 1 é o único cronometrado na fonte ("em 30 segundos").
10. **Troca editorial P24** (GridAlpha → NIVAR) aplicada ao texto visível (a extração segue literal; o verificador aplica a mesma troca do lado dela antes de comparar).
11. A mecânica da fonte (acerto verde, erro vermelho; "Revelar gabarito" direto) não está no dado e **não deve ser portada** (S2, C7); é decisão do consumidor.

## 5. Como regenerar e conferir

```
node tools/alexandria-dados/gerar-avaliacao.mjs      # reescreve avaliacao.dados.ts; para se um trecho não existir na extração
node tools/alexandria-dados/verificar-avaliacao.mjs  # 0 falhas
```

O verificador confere: (A) todo trecho citado existe por substring no campo indicado, com a linha certa; (B) itens da fonte e prova são iguais à extração;
(C) toda resposta derivada está no texto da aula e todo distrator aparece nas aulas do módulo; (D) nenhum item entrega a resposta de outro da mesma aula nem repete cenário de instrumento;
(E) nada depende de QA-M01-A06/A07; (F) ≥ 2 itens por aula, 10 × 4, faixas cobrindo 0–10, sem tolerância, sem "Demonstrado".
