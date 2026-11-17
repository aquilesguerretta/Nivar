# M16 · grupo "instrumentos"

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html`.
- **Saída:** [`instrumentos.json`](instrumentos.json).
- **Extratores:** [`extratores/m16_instrumentos.mjs`](extratores/m16_instrumentos.mjs) (dados) e
  [`extratores/m16_instrumentos_md.mjs`](extratores/m16_instrumentos_md.mjs) (este arquivo).

## Método

- **Marcação.** Cada `div.inst` é lido do HTML: título (`span.nm`), intro (`p.inst-intro`), campos, readouts e nota de
  rodapé (`p.disc`). O lugar de invocação é a seção e a última subseção `h3` antes do instrumento.
- **Script.** As linhas de leitura, cálculo, formatação e veredito estão em `logica`, copiadas do `<script>` com o
  número de linha. Os dados literais (`var X={…}`) foram avaliados sem alteração e estão em `dados`.
- **Execução.** O `<script>` original foi executado num DOM simulado (`lib.mjs/runScript`, protocolo §10). Isso gerou o
  `cenario_padrao` (todos os readouts e o veredito com os valores iniciais) e as `renderizacoes` dos instrumentos de
  texto (todas as combinações).
- **Ramos.** Nos 5 numéricos, `ramos_alcancados` vem de 2^n cantos (mín./máx.) mais 4.000 combinações
  pseudoaleatórias na grade de `step` de cada campo. A assinatura de cada ramo é a classe do veredito mais as frases em
  `<b>`.
- **Pergunta e tolerância.** Nenhum dos 11 instrumentos formula pergunta ao learner nem declara tolerância. Por isso
  `pergunta` e `tolerancias` são `null`, com nota. Nenhuma pergunta foi derivada aqui (P17 e P19 valem na camada
  Alexandria).

## Visão geral

| Id | Título (literal) | Onde é invocado | Mecânica (anotação) | `kind` candidato (anotação) | Código |
|---|---|---|---|---|---|
| INST·01 | Mapa das seis tendências | §MAP (módulo, fora de aula) · L1313 | seletor de dimensão (4) × chip de tendência (6) → painel de texto fixo; sem cálculo, sem veredito computado | explorador (seleção × seleção → texto; reordena a fila) | não portado |
| INST·02 | Régua de estágio de maturidade | aula-16-01 · depois de "01.2 A régua aplicada às seis tendências" · L1394 | seletor de tendência (6) × posição (5) → 3 cartões de texto + veredito por comparação p vs REAL[t] (3 ramos) | explorador (seleção × seleção → texto + veredito por comparação) | não portado |
| INST·03 | Comparador de gargalo | aula-16-02 · depois de "02.2 Por que conexão à rede é o mais subestimado" · L1518 | seletor de tendência (6) → 5 linhas (vincula / não vincula, texto G[t][c]) + veredito fixo com nome do candidato | comparador (5 candidatos lado a lado para a tendência escolhida) | não portado |
| INST·04 | Conversor de frota em carga | aula-16-03 · depois de "03.2 A conversão, e por que ela precisa de duas contas" · L1649 | 8 campos numéricos (número + deslizador gêmeo) → 6 readouts + barras + veredito com interpolação | simulador (campo → readout → veredito) | não portado |
| INST·05 | Régua de armazenamento | aula-16-04 · depois de "04.5 Por que arbitragem sozinha raramente paga" · L1994 | 7 campos numéricos (número + deslizador gêmeo) → 6 readouts + barras + veredito com interpolação | simulador (ou dimensionador, cf. M03; revisar) | não portado |
| INST·06 | Rampa de medição avançada | aula-16-05 · depois de "05.4 Convertendo a obrigação em quantidade" · L2254 | 6 campos numéricos (número + deslizador gêmeo) → 6 readouts + barras + veredito com interpolação | simulador (campo → readout → veredito) | não portado |
| INST·07 | Verificador de estado da política de carbono | aula-16-07 · depois de "07.2 A governança, e o órgão que ainda não existe" · L2571 | chips (um por dispositivo, 15) → painel de texto (data, nome, estado, corpo, "A pergunta que você faz") | explorador (chip → texto) | não portado |
| INST·08 | Calculadora de escopo 2 — os dois métodos lado a lado | aula-16-07 · depois de "07.5 Escopo 2: dois métodos, nenhum errado" · L2703 | 5 campos numéricos (número + deslizador gêmeo) + 1 seletor → 4 readouts + 2 colunas lado a lado + barras + veredito com interpolação | comparador (dois métodos sempre lado a lado, com campos numéricos) | não portado |
| INST·09 | Decompositor de demanda de centro de dados | aula-16-08 · depois de "08.3 A conversão correta, e o que ela exige" · L2929 | 6 campos numéricos (número + deslizador gêmeo) → 6 readouts + barras + veredito com interpolação | simulador (campo → readout → veredito) | não portado |
| INST·10 | Grade de mapeamento de posicionamento | aula-16-10 · depois de "10.1 Posicionamento é ocupar um elo, não estar no setor" · L3262 | seletor de tendência (6) × elo (5) → capacidade exigida + 3 perguntas + caixa fixa "O que este painel não faz" | explorador (seleção × seleção → texto) | não portado |
| INST·11 | Verificador de estágio e de gargalo | aula-16-10 · depois de "10.2 O instrumento assinatura: estágio e gargalo" · L3329 | filtro por defeito (5) → chips dos enunciados filtrados → cartão (enunciado, defeito dominante, o que falta, pergunta, forma corrigida, nota fixa) | explorador com filtro (chip → cartão); nenhuma resposta do learner é conferida | não portado |

**Contagens.** São 11 instrumentos: 1 de módulo e 10 de aula; 5 numéricos e 6 de seleção e texto.
As aulas sem instrumento são aula-16-06 e aula-16-09, e a aula-16-07 e a aula-16-10 têm dois cada.
No código: 0 portados, 11 não portados e 0 divergentes. `MODULO_16_INSTRUMENTOS` é `[]`,
as 10 aulas têm `instruments: []` e `alexandria-instrument-calculators.ts` não tem calculadora do M16.

## INST·01 · Mapa das seis tendências

- **Invocação.** Seção `map` ("§MAP · Mapa das seis tendências"), h2 "Seis famílias, quatro maneiras de reagrupá-las".
  Fica fora de aula, em Recursos do Módulo. Título na L1313.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Escolha a dimensão de reagrupamento e depois a tendência. O painel devolve a leitura daquela tendência sob aquela dimensão — e a ordem dos cartões muda a cada dimensão escolhida."
- **Nota de rodapé (literal).** "Fontes por tendência declaradas no painel. Estágio e gargalo referem-se a 4 de agosto de 2026 e são as duas categorias que mais rapidamente envelhecem."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado. O comentário do código chama MODULO_16_INSTRUMENTOS de "Instrumento de MÓDULO — o do § MAP, fora de qualquer aula", mas o array está vazio.

- **seletor-segmentado** `mp-dim`, "Dimensão de reagrupamento", com 4 opções: Estágio [padrão] · Gargalo vinculante · Efeito sobre a carga · Horizonte de decisão.
- **chips-gerados-pelo-script** `mp-chips`: as seis tendências, na ordem de ORD[dimensão], com o rótulo ROT[dimensão][tendência].

- Saída `mp-flux` · anotação: fila ordenada 1º..6º com a primeira palavra do nome da tendência e ROT.
- Saída `mp-panel` · anotação: painel LAB[d] / nome — D[d][k].t / D[d][k].d / "Nota de leitura" + D[d][k].f.

**Cenário-padrão.** Entradas: `mp-dim`=est, `mp-chips`=ele.
Painel (texto renderizado, início): "Estágio na régua de cinco posiçõesEletrificação de transporte — Em operação em escalaSérie mensal de emplacamento com mais de uma década, taxonomia por tecnologia e apurações sucessivas de pontos de recarga. É a única da…"

**Renderizações.** 24 combinações renderizadas e guardadas no JSON (`renderizacoes`). Contagens: {"dimensoes":4,"tendencias":6,"paineis":24}.

**Fonte dos números.** "Fontes por tendência declaradas no painel. Estágio e gargalo referem-se a 4 de agosto de 2026 e são as duas categorias que mais rapidamente envelhecem." Nota: A fonte diz que as fontes por tendência estão declaradas no painel (campo D[...].f); não há referência bibliográfica ligada.

## INST·02 · Régua de estágio de maturidade

- **Invocação.** Seção `a01` ("Aula 01 · Lente de Estágio"), h2 "Cinco posições, e a evidência que cada uma exige".
  Vem depois da subseção "01.2 A régua aplicada às seis tendências". Título na L1394.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Escolha a tendência e a posição. O painel devolve três coisas: a evidência que aquela posição exigiria, a evidência efetivamente disponível em 4 de agosto de 2026, e o veredito sobre se a tendência está naquela posição, abaixo dela ou acima dela. O produto cartesiano tem trinta células e todas estão preenchidas."
- **Nota de rodapé (literal).** "Classificação em 4 de agosto de 2026. A posição de uma tendência muda com um único ato normativo ou com a realização de um certame; reverifique antes de qualquer uso externo."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

- **seletor-segmentado** `rg-tnd`, "Tendência", com 6 opções: Eletrificação [padrão] · Armazenamento · Medição · Agregação · Carbono regulado · Centros de dados.
- **seletor-segmentado** `rg-pos`, "Posição testada", com 5 opções: 1 · escala [padrão] · 2 · piloto · 3 · regulado · 4 · anunciado · 5 · projeção.

- Saída `rg-out`: rótulos fixos "Posição testada", "Evidência que esta posição exigiria", "Evidência disponível em 04/08/2026".
- Saída `rg-vd` (veredito).

**Cenário-padrão.** Entradas: `rg-tnd`=ele, `rg-pos`=1.
Veredito (`verdict ok`): "É esta a posição. Eletrificação de transporte está classificada como em operação em escala em 4 de agosto de 2026, e a evidência disponível satisfaz o que a posição exige. Registre a data: um único ato normativo ou a realização de um certame reclassifica esta linha."

**Renderizações.** 30 combinações renderizadas e guardadas no JSON (`renderizacoes`). Contagens: {"tendencias":6,"posicoes":5,"celulas":30,"ramos_veredito":3}.

**Fonte dos números.** `null`. Nota: Os números de DISP (215.023, 167.026, 25.429, 21.061, 627 GWh, 7,8 TWh, 38 GW, 7,1 GW, R$ 159 bilhões, 26,3 GW, 1,2%–12,9%) não trazem referência ligada no instrumento; a nota de rodapé declara só a data de classificação. Várias descrições coincidem com itens do § Ref (ver aparato.json), sem vínculo declarado.

## INST·03 · Comparador de gargalo

- **Invocação.** Seção `a02` ("Aula 02 · Lente de Gargalo"), h2 "Cinco candidatos, e quase nunca é o primeiro".
  Vem depois da subseção "02.2 Por que conexão à rede é o mais subestimado". Título na L1518.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Trinta combinações: seis tendências por cinco candidatos. Para cada uma, o painel diz se aquele candidato vincula ou não vincula, por quê, e o que precisaria mudar. Dizer que um candidato não vincula é uma afirmação com conteúdo, e está sujeita à mesma verificação que a afirmação contrária."
- **Nota de rodapé (literal).** "Classificação em 4 de agosto de 2026. Gargalo se desloca: uma norma publicada em setembro reclassifica a linha de “regra habilitante” e provavelmente transfere o vínculo para conexão ou para sinal econômico."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

- **seletor-segmentado** `gg-tnd`, "Tendência", com 6 opções: Eletrificação [padrão] · Armazenamento · Medição · Agregação · Carbono regulado · Centros de dados.

- Saída `gg-out`: rótulos fixos "Vincula", "Não vincula".
- Saída `gg-vd` (veredito).

**Cenário-padrão.** Entradas: `gg-tnd`=ele.
Veredito (`verdict att`): "Gargalo vinculante em 4 de agosto de 2026: cadeia de suprimento. Os outros quatro candidatos foram avaliados e não vinculam — e dizer isso é parte da análise, não educação. Relaxar uma restrição folgada não altera trajetória nenhuma. Registre a data: gargalo se desloca, e o caso do armazenamento demonstra isso — a regra vinculava até junho de 2026 e deixou de vincular com a publicação das resoluções normativas."

**Renderizações.** 6 combinações renderizadas e guardadas no JSON (`renderizacoes`). Contagens: {"tendencias":6,"candidatos":5,"combinacoes":30,"ramos_veredito":1}.

**Fonte dos números.** `null`. Nota: Nenhuma referência ligada; a nota de rodapé declara a data de classificação (4 de agosto de 2026).

## INST·04 · Conversor de frota em carga

- **Invocação.** Seção `a03` ("Aula 03 · Lente de Carga"), h2 "Eletrificação de transporte: converter frota em MW".
  Vem depois da subseção "03.2 A conversão, e por que ela precisa de duas contas". Título na L1649.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Todos os valores de referência são editáveis. O padrão inicial usa a frota plug-in comercializada no primeiro semestre de 2026 (167.026 unidades) e o consumo de referência do cenário de referência do plano decenal para 2035 (939 TWh). O veredito recusa concluir por um único sinal: cruza a participação no agregado nacional com a pressão sobre o limite local declarado."
- **Nota de rodapé (literal).** "O instrumento devolve a carga da frota comercializada no período, não da frota circulante acumulada — são dois números diferentes, e o segundo é maior. Nenhuma projeção de adoção é feita aqui."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

**Entradas numéricas** (número com deslizador gêmeo; faixa e passo do campo número):

| Rótulo | Unidade | Id | Mín. | Máx. | Passo | Padrão |
|---|---|---|---|---|---|---|
| Veículos com tomada | unidades | `fc-n-n` | 1000 | 5000000 | 1 (deslizador: 1000) | 167026 |
| Quilometragem anual | km/ano | `fc-km-n` | 5000 | 60000 | 100 | 12000 |
| Consumo específico | kWh/km | `fc-e-n` | 0,10 | 0,40 | 0,005 | 0,170 |
| Eficiência de recarga | % | `fc-ef-n` | 80 | 98 | 0,5 | 90 |
| Potência por ponto | kW | `fc-p-n` | 3,7 | 350 | 0,1 | 7,4 |
| Fator de coincidência | % | `fc-fc-n` | 5 | 100 | 1 | 30 |
| Consumo de referência do sistema | TWh/ano | `fc-ref-n` | 300 | 1200 | 1 | 939 |
| Limite local disponível | MW | `fc-lim-n` | 0,1 | 5000 | 0,1 | 100 |

**Saídas (readouts)**, com o valor no cenário-padrão, obtido pela execução do script original:

| Id | Rótulo | Cenário-padrão |
|---|---|---|
| `fc-en` | Energia anual da rede | 378.592MWh/ano |
| `fc-sh` | Participação no agregado | 0,040% |
| `fc-pc` | Potência coincidente | 370,8MW |
| `fc-ul` | Uso do limite local | 370,8% |
| `fc-ev` | Energia por veículo | 2.267kWh/veículo |
| `fc-he` | Horas equivalentes na potência máxima | 1.021h/ano |

**Fórmulas exatas do script** (`logica.calculo`, verbatim, com o número da linha):

```js
/* L5218 */ var evKWh = km*e/ef;                 /* kWh por veículo por ano, retirados da rede */
/* L5219 */ var eMWh  = N*evKWh/1000;            /* MWh por ano */
/* L5220 */ var eTWh  = eMWh/1e6;
/* L5221 */ var share = eTWh/rf*100;             /* % do consumo de referência */
/* L5222 */ var pMW   = N*pp*co/1000;            /* MW coincidentes */
/* L5223 */ var usoL  = pMW/lm*100;              /* % do limite local */
/* L5224 */ var hEq   = pMW>0 ? eMWh/pMW : 0;    /* horas equivalentes na potência coincidente */
```

A leitura das entradas, a formatação e o veredito completo estão em `logica` no JSON.

**Cenário-padrão.** Entradas: `fc-n-n`=167026, `fc-km-n`=12000, `fc-e-n`=0.170, `fc-ef-n`=90, `fc-p-n`=7.4, `fc-fc-n`=30, `fc-ref-n`=939, `fc-lim-n`=100.
Veredito (`verdict per`): "No agregado, abaixo do ruído. 0,040% do consumo de referência não move planejamento de suprimento nem de geração. Localmente, excede. 370,8 MW coincidentes contra 100,0 MW disponíveis: a instalação não atende sem reforço, sem gestão de recarga ou sem ampliação de janela. O veredito cruza os dois sinais por construção, porque nenhum deles conclui sozinho: eletrificação de transporte é problema de potência local e não de energia nacional, e o fator de coincidência de 30% é a variável que decide o segundo resultado. Antes de usar qualquer número acima, pergunte o perfil de chegada e a janela de recarga — sem eles, a potência coincidente é arbitrada, não calculada."

**Ramos do veredito alcançados (9):**

- `verdict att`: <b>No agregado, abaixo do ruído.</b> + <b>Localmente, aperta.</b>
- `verdict att`: <b>No agregado, material.</b> + <b>Localmente, aperta.</b>
- `verdict att`: <b>No agregado, visível.</b> + <b>Localmente, aperta.</b>
- `verdict ok`: <b>No agregado, abaixo do ruído.</b> + <b>Localmente, folgado.</b>
- `verdict ok`: <b>No agregado, material.</b> + <b>Localmente, folgado.</b>
- `verdict ok`: <b>No agregado, visível.</b> + <b>Localmente, folgado.</b>
- `verdict per`: <b>No agregado, abaixo do ruído.</b> + <b>Localmente, excede.</b>
- `verdict per`: <b>No agregado, material.</b> + <b>Localmente, excede.</b>
- `verdict per`: <b>No agregado, visível.</b> + <b>Localmente, excede.</b>

**Fonte dos números.** "O padrão inicial usa a frota plug-in comercializada no primeiro semestre de 2026 (167.026 unidades) e o consumo de referência do cenário de referência do plano decenal para 2035 (939 TWh)." Nota: Declaração do próprio intro. Os padrões 12.000 km/ano, 0,170 kWh/km, 90%, 7,4 kW, 30% e 100 MW não têm fonte declarada.

**Divergência local (fonte × fonte, registrada e não corrigida):**
- No campo "Veículos com tomada", o passo do número é 1 e o do deslizador é 1000. Arrastar o deslizador pula de 1000 em 1000, e digitar aceita qualquer inteiro.

## INST·05 · Régua de armazenamento

- **Invocação.** Seção `a04` ("Aula 04 · Lente de Carga"), h2 "Armazenamento: potência, energia e duração são três números".
  Vem depois da subseção "04.5 Por que arbitragem sozinha raramente paga". Título na L1994.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Os valores iniciais reproduzem os parâmetros mínimos do certame de dezembro de 2026 — 30 MW, quatro horas, teto de 366 ciclos — e todos são editáveis. O veredito recusa concluir por arbitragem isolada: devolve a margem e devolve o quanto falta, e diz explicitamente que a decisão exige uma segunda fonte de receita e a verificação de compatibilidade entre elas."
- **Nota de rodapé (literal).** "Margem bruta de arbitragem. Não incorpora encargo de uso da rede sobre consumo e injeção, tributos, custo de operação, reposição de células nem custo de capital — todos reduzem o resultado. Nenhuma recomendação de investimento decorre deste instrumento."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

**Entradas numéricas** (número com deslizador gêmeo; faixa e passo do campo número):

| Rótulo | Unidade | Id | Mín. | Máx. | Passo | Padrão |
|---|---|---|---|---|---|---|
| Potência | MW | `ar-p-n` | 1 | 500 | 1 | 30 |
| Duração | horas | `ar-d-n` | 0,5 | 8 | 0,1 | 4 |
| Profundidade de descarga | % | `ar-dod-n` | 50 | 100 | 1 | 90 |
| Eficiência de ciclo | % | `ar-rte-n` | 70 | 95 | 0,5 | 86 |
| Preço de compra | R$/MWh | `ar-pc-n` | 0 | 500 | 1 | 80 |
| Preço de venda | R$/MWh | `ar-pv-n` | 0 | 1500 | 1 | 400 |
| Ciclos por ano | ciclos | `ar-cy-n` | 50 | 730 | 1 | 366 |

**Saídas (readouts)**, com o valor no cenário-padrão, obtido pela execução do script original:

| Id | Rótulo | Cenário-padrão |
|---|---|---|
| `ar-en` | Energia nominal | 120,0MWh |
| `ar-eu` | Energia útil por ciclo | 108,00MWh |
| `ar-ea` | Energia entregue no ano | 39.528MWh/ano |
| `ar-ec` | Energia comprada no ano | 45.963MWh/ano |
| `ar-sp` | Spread mínimo de equilíbrio | R$ 93,02/MWh |
| `ar-mg` | Margem por MW-ano | R$ 404mil/MW-ano |

**Fórmulas exatas do script** (`logica.calculo`, verbatim, com o número da linha):

```js
/* L5269 */ var enNom = P*d;                 /* MWh nominais */
/* L5270 */ var euCic = enNom*dod;           /* MWh úteis por ciclo */
/* L5271 */ var eAno  = euCic*cy;            /* MWh entregues no ano */
/* L5272 */ var ecAno = eAno/rte;            /* MWh comprados no ano */
/* L5273 */ var spMin = pc/rte;              /* spread mínimo de equilíbrio, R$/MWh */
/* L5274 */ var receita = eAno*pv;
/* L5275 */ var custo   = ecAno*pc;
/* L5276 */ var margem  = receita-custo;
/* L5277 */ var margemMW= margem/P;
```

A leitura das entradas, a formatação e o veredito completo estão em `logica` no JSON.

**Cenário-padrão.** Entradas: `ar-p-n`=30, `ar-d-n`=4, `ar-dod-n`=90, `ar-rte-n`=86, `ar-pc-n`=80, `ar-pv-n`=400, `ar-cy-n`=366.
Veredito (`verdict att`): "Margem relevante e ainda insuficiente sozinha. R$ 404 mil por MW-ano é magnitude que entra na conta, mas não a fecha isoladamente. A duração de 4,0 h atende o parâmetro mínimo de quatro horas consecutivas do produto contratado nos certames de dezembro de 2026. Este instrumento recusa concluir por arbitragem isolada. A margem acima é bruta: não incorpora o encargo de uso da rede, que desde junho de 2026 incide cumulativamente sobre a parcela de consumo e a de injeção, nem tributos, operação, reposição de células e custo de capital. Uma decisão exige pelo menos duas fontes de receita e a verificação de que elas são compatíveis — a mesma potência e o mesmo estado de carga não podem ser vendidos para obrigações incompatíveis."

**Ramos do veredito alcançados (8):**

- `verdict att`: <b>Margem elevada — e é o caso em que mais se erra.</b>
- `verdict att`: <b>Margem elevada — e é o caso em que mais se erra.</b> + <b>Atenção de grandeza:</b>
- `verdict att`: <b>Margem relevante e ainda insuficiente sozinha.</b>
- `verdict att`: <b>Margem relevante e ainda insuficiente sozinha.</b> + <b>Atenção de grandeza:</b>
- `verdict per`: <b>Margem insuficiente isoladamente.</b>
- `verdict per`: <b>Margem insuficiente isoladamente.</b> + <b>Atenção de grandeza:</b>
- `verdict per`: <b>O ciclo destrói valor.</b>
- `verdict per`: <b>O ciclo destrói valor.</b> + <b>Atenção de grandeza:</b>

**Fonte dos números.** "Os valores iniciais reproduzem os parâmetros mínimos do certame de dezembro de 2026 — 30 MW, quatro horas, teto de 366 ciclos — e todos são editáveis." Nota: Declaração do intro para 30 MW, 4 h e 366 ciclos. 90% de profundidade, 86% de eficiência, R$ 80 e R$ 400/MWh não têm fonte declarada (86% aparece também na fórmula da aula, 04.5).

## INST·06 · Rampa de medição avançada

- **Invocação.** Seção `a05` ("Aula 05 · Lente de Gargalo"), h2 "Medição avançada: o que ela habilita, quem paga, e de quem é o dado".
  Vem depois da subseção "05.4 Convertendo a obrigação em quantidade". Título na L2254.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Converte uma regra — “2% ao ano” — em pontos, anos e capital. Todos os parâmetros são editáveis, inclusive o ritmo obrigatório, para que se possa testar cenários alternativos de norma. O veredito cruza dois sinais — cobertura alcançada e intensidade de capital — e recusa afirmar que o programa vale a pena, porque essa afirmação depende da análise de custo-benefício que ainda não existe."
- **Nota de rodapé (literal).** "Custo por ponto é parâmetro editável e não um valor de referência oficial: ele varia com tecnologia de comunicação, densidade da área e escopo de sistemas incluído. O instrumento converte regra em quantidade; ele não avalia mérito."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

**Entradas numéricas** (número com deslizador gêmeo; faixa e passo do campo número):

| Rótulo | Unidade | Id | Mín. | Máx. | Passo | Padrão |
|---|---|---|---|---|---|---|
| Unidades consumidoras | mil UCs | `am-uc-n` | 10 | 30000 | 10 | 3000 |
| Ritmo obrigatório | %/ano | `am-ro-n` | 0 | 10 | 0,1 | 2 |
| Ritmo adicional voluntário | %/ano | `am-ra-n` | 0 | 15 | 0,1 | 0 |
| Custo por ponto | R$ | `am-cp-n` | 100 | 1500 | 10 | 550 |
| Horizonte | anos | `am-hz-n` | 1 | 20 | 1 | 10 |
| Referência de investimento anual | R$ bi/ano | `am-rf-n` | 1 | 100 | 0,5 | 20 |

**Saídas (readouts)**, com o valor no cenário-padrão, obtido pela execução do script original:

| Id | Rótulo | Cenário-padrão |
|---|---|---|
| `am-pa` | Pontos por ano | 60mil/ano |
| `am-cb` | Cobertura no horizonte | 20,0% |
| `am-pt` | Pontos acumulados | 600mil pontos |
| `am-ca` | Capital anual | R$ 0,03bi/ano |
| `am-cc` | Capital acumulado | R$ 0,33bi |
| `am-at` | Anos para cobertura total | 50,0anos |

**Fórmulas exatas do script** (`logica.calculo`, verbatim, com o número da linha):

```js
/* L5321 */ var ritmo = ro+ra;
/* L5322 */ var cob   = Math.min(100, ritmo*hz);
/* L5323 */ var ptAno = uc*ritmo/100;                 /* mil pontos por ano */
/* L5324 */ var ptAcm = uc*cob/100;                   /* mil pontos acumulados */
/* L5325 */ var capAno= ptAno*cp/1e6;                 /* R$ bilhões por ano */
/* L5326 */ var capAcm= ptAcm*cp/1e6;                 /* R$ bilhões acumulados */
/* L5327 */ var intens= capAno/rf*100;
/* L5328 */ var anosT = ritmo>0 ? 100/ritmo : Infinity;
```

A leitura das entradas, a formatação e o veredito completo estão em `logica` no JSON.

**Cenário-padrão.** Entradas: `am-uc-n`=3000, `am-ro-n`=2, `am-ra-n`=0, `am-cp-n`=550, `am-hz-n`=10, `am-rf-n`=20.
Veredito (`verdict ok`): "Cobertura parcial. 20,0% das unidades em 10 anos. No ritmo obrigatório isolado de 2% ao ano, a cobertura total levaria 50 anos. Intensidade de capital baixa: 0,2% da referência anual declarada. Este instrumento converte regra em quantidade e recusa avaliar mérito. Cobertura e capital não dizem se o programa vale a pena — essa resposta depende da análise de custo-benefício, cuja metodologia foi remetida a processo regulatório próprio e cujo prazo de entrega pelas distribuidoras é 29 de fevereiro de 2028. Até lá, qualquer afirmação sobre retorno do programa é projeção de autor com interesse declarável."

**Ramos do veredito alcançados (12):**

- `verdict att`: <b>Cobertura ampla.</b> + <b>Intensidade de capital relevante:</b>
- `verdict att`: <b>Cobertura completa dentro do horizonte.</b> + <b>Intensidade de capital relevante:</b>
- `verdict att`: <b>Cobertura marginal.</b> + <b>Intensidade de capital relevante:</b>
- `verdict att`: <b>Cobertura parcial.</b> + <b>Intensidade de capital relevante:</b>
- `verdict ok`: <b>Cobertura ampla.</b> + <b>Intensidade de capital baixa:</b>
- `verdict ok`: <b>Cobertura completa dentro do horizonte.</b> + <b>Intensidade de capital baixa:</b>
- `verdict ok`: <b>Cobertura marginal.</b> + <b>Intensidade de capital baixa:</b>
- `verdict ok`: <b>Cobertura parcial.</b> + <b>Intensidade de capital baixa:</b>
- `verdict per`: <b>Cobertura ampla.</b> + <b>Intensidade de capital alta:</b>
- `verdict per`: <b>Cobertura completa dentro do horizonte.</b> + <b>Intensidade de capital alta:</b>
- `verdict per`: <b>Cobertura marginal.</b> + <b>Intensidade de capital alta:</b>
- `verdict per`: <b>Cobertura parcial.</b> + <b>Intensidade de capital alta:</b>

**Fonte dos números.** "Custo por ponto é parâmetro editável e não um valor de referência oficial: ele varia com tecnologia de comunicação, densidade da área e escopo de sistemas incluído. O instrumento converte regra em quantidade; ele não avalia mérito." Nota: A fonte declara que o custo por ponto (R$ 550) não é valor de referência oficial. 3.000 mil UCs, 10 anos e R$ 20 bi/ano não têm fonte declarada; 2%/ano corresponde à obrigação citada na aula (portaria ministerial nº 126/2026 no § Ref), sem vínculo declarado no instrumento.

## INST·07 · Verificador de estado da política de carbono

- **Invocação.** Seção `a07` ("Aula 07 · Lente de Estágio"), h2 "Carbono: dois mercados sem relação de substituição".
  Vem depois da subseção "07.2 A governança, e o órgão que ainda não existe". Título na L2571.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Cada dispositivo ou ato do sistema, classificado nos quatro estados de política, com data e com a evidência que sustenta a classificação. Escolha o dispositivo. Repare em quantos estão em estados diferentes ao mesmo tempo — é a razão pela qual “em formação” não descreve nada."
- **Nota de rodapé (literal).** "Verificado em 4 de agosto de 2026. Duas consultas públicas correm nesta data e alteram a classificação de pelo menos três linhas quando encerrarem."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

- **chips-gerados-pelo-script** `cb-chips`, "(sem rótulo)", com 15 opções: Lei do sistema de comércio de emissões (12/12/2024) · Prazo original da fase I (12/12/2025) · Prórroga da fase I (até 12/12/2026) · Secretaria com competências de órgão gestor (16/10/2025) · Órgão gestor permanente (meta até 12/2026) · Comitê técnico consultivo permanente (11/05/2026) · Cobertura setorial (19/05/2026) · Etapas de mensuração, relato e verificação (até 28/08/2026) · Registro central (desde 01/2026) · Patamares de 10 mil e 25 mil toneladas (previstos em lei) · Exclusão da produção primária agropecuária (12/12/2024) · Obrigação do setor segurador em ativos ambientais (desde a vigência) · Vedação de tributação sobre emissões reguladas (12/12/2024) · Ativos como valores mobiliários (12/12/2024) · Mercado de ativos e primeiro plano de alocação (previsto para 2030).

- Saída `cb-panel`: rótulos fixos "A pergunta que você faz".

**Cenário-padrão.** Entradas: `cb-chips`=lei.
Painel (texto renderizado, início): "12/12/2024Lei do sistema de comércio de emissõesEm vigor na data da publicaçãoA lei instituiu o sistema, definiu os ativos, a governança em três instâncias, os patamares de emissão e o período transitório de cinco fases.…"

**Renderizações.** 15 combinações renderizadas e guardadas no JSON (`renderizacoes`). Contagens: {"dispositivos":15,"por_codigo_estado":{"vige":7,"venc":1,"anun":4,"teto":3}}.

**Fonte dos números.** `null`. Nota: Datas e dispositivos sem referência ligada no instrumento; coincidem com itens do § Ref (Lei nº 15.042/2024, decreto de 16/10/2025, resoluções do comitê de 11/05/2026, proposta de 19/05/2026, consulta até 28/08/2026), sem vínculo declarado.

## INST·08 · Calculadora de escopo 2 — os dois métodos lado a lado

- **Invocação.** Seção `a07` ("Aula 07 · Lente de Estágio"), h2 "Carbono: dois mercados sem relação de substituição".
  Vem depois da subseção "07.5 Escopo 2: dois métodos, nenhum errado". Título na L2703.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Os dois métodos são calculados sempre juntos, e o seletor apenas destaca qual está sendo discutido — porque exibir um sozinho é exatamente o defeito que a aula combate. O veredito recusa tratar a diferença como redução física de emissão."
- **Nota de rodapé (literal).** "Fatores de emissão são entradas editáveis. O fator médio da rede brasileira é publicado oficialmente e varia mensalmente com a hidrologia; o fator residual não tem publicação oficial consolidada, o que é em si um achado analítico relevante."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

**Entradas numéricas** (número com deslizador gêmeo; faixa e passo do campo número):

| Rótulo | Unidade | Id | Mín. | Máx. | Passo | Padrão |
|---|---|---|---|---|---|---|
| Consumo anual | GWh | `e2-cs-n` | 0,1 | 5000 | 0,1 | 120 |
| Fator médio da rede | tCO2e/MWh | `e2-fm-n` | 0,01 | 0,60 | 0,001 | 0,080 |
| Fator residual da rede | tCO2e/MWh | `e2-fr-n` | 0,01 | 0,80 | 0,001 | 0,120 |
| Consumo com atributo contratado | % | `e2-at-n` | 0 | 100 | 1 | 0 |
| Fator do instrumento contratado | tCO2e/MWh | `e2-fi-n` | 0 | 0,60 | 0,001 | 0,000 |

- **seletor-segmentado** `e2-mt`, "Método em discussão (os dois são sempre exibidos)", com 2 opções: Baseado em localização [padrão] · Baseado em mercado.

**Saídas (readouts)**, com o valor no cenário-padrão, obtido pela execução do script original:

| Id | Rótulo | Cenário-padrão |
|---|---|---|
| `e2-df` | Diferença entre métodos | -4.800tCO2e |
| `e2-rz` | Razão mercado / localização | 1,50× |
| `e2-cb` | Consumo coberto por atributo | 0MWh |
| `e2-fis` | Emissão física da rede alterada | 0tCO2e alterada |
| `e2-loc` | (coluna/barra) | 9.600tCO2e |
| `e2-locm` | (coluna/barra) | Consumo integral a 0,080 tCO2e/MWh, o fator médio da rede no período. |
| `e2-mkt` | (coluna/barra) | 14.400tCO2e |
| `e2-mktm` | (coluna/barra) | 100% do consumo ao fator residual de 0,120 e 0% ao fator do instrumento contratado, de 0,000. |

**Fórmulas exatas do script** (`logica.calculo`, verbatim, com o número da linha):

```js
/* L5372 */ var MWh = cs*1000;
/* L5373 */ var loc = MWh*fm;
/* L5374 */ var mkt = MWh*(1-at)*fr + MWh*at*fi;
/* L5375 */ var dif = loc-mkt;
/* L5376 */ var raz = loc>0 ? mkt/loc : 0;
```

A leitura das entradas, a formatação e o veredito completo estão em `logica` no JSON.

**Cenário-padrão.** Entradas: `e2-cs-n`=120, `e2-fm-n`=0.080, `e2-fr-n`=0.120, `e2-at-n`=0, `e2-fi-n`=0.000, `e2-mt`=loc.
Veredito (`verdict att`): "O método de mercado reporta mais que o de localização. Isso não é anomalia: acontece quando o fator residual excede o fator médio, o que é o normal onde parte relevante dos atributos de baixa emissão já foi reivindicada por terceiros. É o caso que desmonta a ideia de que o método de mercado sempre favorece o relator. Nota sobre o método em discussão: o fator médio da rede brasileira é baixo e volátil por hidrologia. Uma queda no número reportado entre dois anos pode significar apenas que choveu mais — e não que a empresa mudou alguma coisa. E a recusa central deste instrumento: a diferença de 4.800 tCO2e entre os dois métodos não é redução física de emissão. A rede emitiu exatamente o mesmo. Um número mede a alegação contratual de uma empresa; o outro mede a física de um sistema — e os dois são verdadeiros."

**Ramos do veredito alcançados (8):**

- `verdict att`: <b>Diferença material entre os métodos.</b> + <b>não é redução física de emissão</b> @ e2-mt=loc
- `verdict att`: <b>Diferença material entre os métodos.</b> + <b>não é redução física de emissão</b> @ e2-mt=mkt
- `verdict att`: <b>O método de mercado reporta mais que o de localização.</b> + <b>não é redução física de emissão</b> @ e2-mt=loc
- `verdict att`: <b>O método de mercado reporta mais que o de localização.</b> + <b>não é redução física de emissão</b> @ e2-mt=mkt
- `verdict ok`: <b>Métodos convergentes.</b> + <b>não é redução física de emissão</b> @ e2-mt=loc
- `verdict ok`: <b>Métodos convergentes.</b> + <b>não é redução física de emissão</b> @ e2-mt=mkt
- `verdict per`: <b>O método de mercado reporta menos de um quarto do método de localização.</b> + <b>não é redução física de emissão</b> @ e2-mt=loc
- `verdict per`: <b>O método de mercado reporta menos de um quarto do método de localização.</b> + <b>não é redução física de emissão</b> @ e2-mt=mkt

**Fonte dos números.** "Fatores de emissão são entradas editáveis. O fator médio da rede brasileira é publicado oficialmente e varia mensalmente com a hidrologia; o fator residual não tem publicação oficial consolidada, o que é em si um achado analítico relevante." Nota: Fatores declarados como entradas editáveis; 120 GWh, 0,080 e 0,120 coincidem com o Ex 14 (que usa 60% de atributo; o instrumento abre com 0%). Sem fonte declarada para os valores.

## INST·09 · Decompositor de demanda de centro de dados

- **Invocação.** Seção `a08` ("Aula 08 · Lente de Carga"), h2 "Centros de dados: os cinco números do mesmo empreendimento".
  Vem depois da subseção "08.3 A conversão correta, e o que ela exige". Título na L2929.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Converte a potência de tecnologia da informação em carga média e em energia anual, e devolve a razão entre o que foi solicitado e o que seria consumido. O veredito separa os cinco números e recusa concluir que o pedido descreve demanda."
- **Nota de rodapé (literal).** "A rampa é modelada como linear até a ocupação plena, o que é simplificação didática: rampas reais dependem de contratação de cliente âncora e costumam ser irregulares. Nenhuma projeção de mercado decorre deste instrumento."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

**Entradas numéricas** (número com deslizador gêmeo; faixa e passo do campo número):

| Rótulo | Unidade | Id | Mín. | Máx. | Passo | Padrão |
|---|---|---|---|---|---|---|
| Potência de tecnologia da informação | MW | `dc-ti-n` | 1 | 1000 | 1 | 100 |
| Eficiência do uso de energia | PUE | `dc-pue-n` | 1,05 | 2,00 | 0,01 | 1,30 |
| Fator de carga médio | % | `dc-fc-n` | 10 | 100 | 1 | 90 |
| Potência no pedido de acesso | MW | `dc-sol-n` | 1 | 3000 | 1 | 200 |
| Prazo de rampa até a ocupação | anos | `dc-rp-n` | 0,5 | 10 | 0,5 | 4 |
| Consumo de referência do sistema | TWh/ano | `dc-ref-n` | 300 | 1200 | 1 | 939 |

**Saídas (readouts)**, com o valor no cenário-padrão, obtido pela execução do script original:

| Id | Rótulo | Cenário-padrão |
|---|---|---|
| `dc-cm` | Carga média | 117,0MW |
| `dc-pn` | Potência de conexão necessária | 130,0MW |
| `dc-ea` | Energia anual em regime | 1.025GWh/ano |
| `dc-rz` | Razão solicitado / carga média | 1,71× |
| `dc-sh` | Participação no agregado | 0,109% |
| `dc-a1` | Carga média no primeiro ano | 29,3MW |

**Fórmulas exatas do script** (`logica.calculo`, verbatim, com o número da linha):

```js
/* L5417 */ var cm  = ti*pue*fc;              /* MW médios */
/* L5418 */ var pn  = ti*pue;                 /* MW de conexão sem utilização */
/* L5419 */ var ea  = cm*8.76;                /* GWh por ano */
/* L5420 */ var raz = cm>0 ? sol/cm : 0;
/* L5421 */ var sh  = (ea/1000)/rf*100;
/* L5422 */ var a1  = rp>=1 ? cm/rp : cm;
```

A leitura das entradas, a formatação e o veredito completo estão em `logica` no JSON.

**Cenário-padrão.** Entradas: `dc-ti-n`=100, `dc-pue-n`=1.30, `dc-fc-n`=90, `dc-sol-n`=200, `dc-rp-n`=4, `dc-ref-n`=939.
Veredito (`verdict ok`): "Folga usual. Razão de 1,71× entre solicitado e carga média é compatível com redundância de projeto e rampa de ocupação. Continua sendo folga, e não carga. Os cinco números deste empreendimento, separados: solicitado 200 MW; potência de conexão necessária pela carga instalada 130,0 MW; carga média em regime 117,0 MW; carga média no primeiro ano da rampa 29,3 MW; e energia anual em regime de 1.025 GWh, ou 0,109% do consumo de referência declarado. Apenas o penúltimo e o último descrevem consumo, e nenhum deles é o número que circula publicamente. Este instrumento não projeta mercado e não conclui que a demanda vai crescer — separa os números e devolve qual deles o interlocutor está usando."

**Ramos do veredito alcançados (4):**

- `verdict att`: <b>Folga grande.</b>
- `verdict ok`: <b>Folga usual.</b>
- `verdict ok`: <b>Pedido próximo da carga.</b>
- `verdict per`: <b>O pedido não descreve carga.</b>

**Fonte dos números.** "A rampa é modelada como linear até a ocupação plena, o que é simplificação didática: rampas reais dependem de contratação de cliente âncora e costumam ser irregulares. Nenhuma projeção de mercado decorre deste instrumento." Nota: Padrões 100 MW, 1,30, 90% coincidem com o exemplo da ficha 06 e do Ex 12; 200 MW solicitados, 4 anos e 939 TWh sem fonte declarada no instrumento (939 TWh é o cenário de referência do caderno de demanda citado no § Ref).

## INST·10 · Grade de mapeamento de posicionamento

- **Invocação.** Seção `a10` ("Aula 10 · Síntese"), h2 "Mapear posicionamento sem emitir veredito sobre ninguém".
  Vem depois da subseção "10.1 Posicionamento é ocupar um elo, não estar no setor". Título na L3262.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Escolha a tendência e o elo. O painel devolve a capacidade que uma empresa precisa ter para ocupar aquele elo e três perguntas de verificação — formuladas de modo que a resposta seja um documento ou um número, nunca uma impressão. Trinta combinações, todas preenchidas. Nenhum ocupante é nomeado: os ocupantes são descritos por estrutura, e o preenchimento com nomes é conversa, não ativo publicado."
- **Nota de rodapé (literal).** "A grade descreve o que verificar, e não quem está bem ou mal posicionado. Nenhum veredito sobre empresa determinada decorre deste instrumento, por decisão declarada no §00.6."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

- **seletor-segmentado** `gp-tnd`, "Tendência", com 6 opções: Eletrificação [padrão] · Armazenamento · Medição · Agregação · Carbono regulado · Centros de dados.
- **seletor-segmentado** `gp-elo`, "Elo de captura de valor", com 5 opções: Fabricação e fornecimento [padrão] · Instalação e integração · Operação e serviço · Financiamento · Domínio do dado.

**Cenário-padrão.** Entradas: `gp-tnd`=ele, `gp-elo`=fab.
Painel (texto renderizado, início): "Eletrificação de transporte · Fabricação e fornecimentoCapacidade exigida para ocupar este eloCapacidade produtiva instalada de veículo, de conversor ou de equipamento de recarga, com conteúdo local suficiente diante do …"

**Renderizações.** 30 combinações renderizadas e guardadas no JSON (`renderizacoes`). Contagens: {"tendencias":6,"elos":5,"combinacoes":30,"perguntas":90}.

**Fonte dos números.** `null`. Nota: Não há números de mercado; as perguntas não citam fonte.

## INST·11 · Verificador de estágio e de gargalo

- **Invocação.** Seção `a10` ("Aula 10 · Síntese"), h2 "Mapear posicionamento sem emitir veredito sobre ninguém".
  Vem depois da subseção "10.2 O instrumento assinatura: estágio e gargalo". Título na L3329.
- **Pergunta.** `null`. O instrumento não formula pergunta própria ao learner: o markup traz só a instrução (p.inst-intro). Nenhuma pergunta foi derivada aqui (camada fonte).
- **Intro (literal).** "Doze enunciados, três por categoria de defeito. Para cada um, o painel devolve o defeito dominante, o que exatamente falta, a pergunta que você faz e a forma corrigida do enunciado. Use o filtro para treinar uma categoria de cada vez."
- **Nota de rodapé (literal).** "Os enunciados usam números verificados em 4 de agosto de 2026. Nenhum deles é falso — e nenhum sustenta a conclusão que aparenta sustentar."
- **Tolerância.** `null`. A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Código.** não portado.

- **seletor-segmentado** `vf-flt`, "Filtrar por defeito dominante", com 5 opções: Todos [padrão] · A · estágio · B · gargalo · C · carga · D · comparação.
- **chips-gerados-pelo-script** `vf-chips`, "(sem rótulo)", com 12 opções: 38 GW em acesso (A) · Leilão de baterias (A) · Capacidades somadas (A) · Bateria e custo (B) · Medição e tecnologia (B) · Cinco desafios (B) · Frota e demanda (C) · Carbono e demanda elétrica (C) · Bateria e rede (C) · Atraso em rede inteligente (D) · Emissão que caiu (D) · Participação que dobrou (D).

**Cenário-padrão.** Entradas: `vf-flt`=all, `vf-chips`=e1.
Cartão (texto renderizado, início): ""O Brasil tem 38 GW de projetos de centros de dados pedindo acesso à rede — mais de um terço da carga média projetada do país para 2035."Defeito dominanteA · estágio confundidoO que exatamente faltaA frase é verdadeira e…"

**Renderizações.** 16 combinações renderizadas e guardadas no JSON (`renderizacoes`). Contagens: {"enunciados":12,"por_familia":{"A":3,"B":3,"C":3,"D":3}}.

**Fonte dos números.** "Os enunciados usam números verificados em 4 de agosto de 2026. Nenhum deles é falso — e nenhum sustenta a conclusão que aparenta sustentar." Nota: A nota declara a data de verificação; números sem referência ligada.

## Comparação com o catálogo canônico

- **Títulos.** Os 11 títulos da tabela "Instrumentos" do catálogo (`catalogo-modulos-alexandria.md`, Módulo 16) são iguais
  aos `span.nm` da fonte. A comparação foi feita por programa: 11 de 11.
- **Descrições.** As do catálogo são paráfrases que concordam com a mecânica medida: 4 dimensões; 30 células; 30
  combinações; padrões 167.026 e 939 TWh; 30 MW, 4 h e 366 ciclos; dispositivos nos 4 estados de política (a fonte
  tem 15, e o catálogo não dá número); 12 enunciados, 3 por categoria.
- **Resultado.** Não há divergência de conteúdo. O catálogo também registra que os 11 "não estão extraídos", o que
  confere com o código.

## Lacunas

- **Pergunta ao learner e tolerância.** Nenhum dos 11 declara. Pelo P19, uma pergunta de previsão ou uma regra de
  pontuação é da camada Alexandria.
- **Fonte dos padrões numéricos.** Só é declarada em parte:
  - o INST·04 declara 167.026 e 939 TWh;
  - o INST·05 declara 30 MW, 4 h e 366 ciclos;
  - os demais padrões não têm fonte ligada (ver a nota de cada um).
  Pelo P19, esses números são "cenário didático presente no módulo".
- **Desenho.** Barras e colunas não portam como desenho (protocolo §12). O conteúdo textual e numérico delas está
  em `cenario_padrao` e em `logica`.
- **Saída textual.** INST·01, 02, 03, 07, 10 e 11 não têm saída numérica. A saída deles é texto e não cabe em
  `valores` (protocolo §12).

## Verificação

### Verificação adversarial independente (2026-09-17)

Esta seção foi escrita à mão. Se `m16_instrumentos_md.mjs` for rodado de novo, ela precisa ser reposta.

- **Fórmulas e código (100%).** Os 196 pares `{linha, codigo}` são idênticos a `lines[linha-1]` da fonte. Nos 5
  instrumentos numéricos (04, 05, 06, 08 e 09), todas as linhas aritméticas do bloco do script estão capturadas.
- **Dados.** Os 17 literais `var KEY=` foram avaliados de forma independente, e 16 são idênticos. O `L` do INST·07
  difere só pela entidade "veda&ccedil;ão" (L5504), que foi decodificada; isso já está declarado em
  `entidades_decodificadas`.
- **Contagens.** São 11 `div.inst`: INST·01 no §MAP, 01 por aula em a01–a05 e a08, 02 em a07 e 02 em a10, e nenhum em
  a06 e a09. Os 5 numéricos têm `type="number"` (8, 7, 6, 5 e 6 campos). Os 6 de seleção são 01, 02, 03, 07, 10 e 11.
  No código há 0 portados (`MODULO_16_INSTRUMENTOS = []`, sem calculadora e sem badge do M16).
- **Cenário-padrão do INST·09.** A conta à mão dá 117,0 MW, 130,0 MW, 1.025 GWh, 1,71×, 0,109% e 29,3 MW. **É igual**
  à execução registrada.
- **Origens.** Nenhuma está fora de ±3 linhas.
- **Não-literais esperados.** `renderizacoes`, `cenario_padrao`, `ramos_alcancados` e os campos `mecanica`/`descricao`
  são saídas da execução do script ou anotações. Não contam como texto de fonte.
- **Correções.** Nenhuma foi necessária.
