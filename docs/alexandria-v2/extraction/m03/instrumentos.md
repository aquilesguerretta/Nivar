# M03 · Grupo "instrumentos"

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo03.html` (3.585 linhas; `<script>` L2802–L3581).
**Arquivo gerado:** [`instrumentos.json`](instrumentos.json). **Data:** 2026-09-17.
**Gerado por:** `extratores/m03_instrumentos.mjs` (dados) e `extratores/m03_md_instrumentos.mjs` (este arquivo).

## Método

- **Markup:** entradas, saídas, nota e posição na aula lidas linha a linha do `div.instrument`.
- **Script:** o IIFE de cada instrumento está verbatim em `script.codigo_verbatim`. Os ramos de leitura (condição → texto) estão em `ramos_de_leitura`, com as condições envolventes e os irmãos anteriores.
- **Execução (protocolo §10):** o script original rodou em `node:vm` com DOM simulado. O cenário-padrão usa os `value` do markup. A varredura cobre **todo** o espaço finito (min/max/step de cada campo, todas as pílulas, seleções e chaves).
- **Código:** a definição em `alexandria-modulo-03-content.ts` e a calculadora em `alexandria-instrument-calculators.ts` (avaliada com `module.stripTypeScriptTypes`) foram comparadas com o original sobre o **mesmo** espaço de entrada.
- **Nada foi digitado.** As instruções de teste citadas em `testes_da_nota` são conferidas como substring literal da fonte, e o extrator falha se não forem.

## Resumo

| Id | Título (literal) | Aula | Kind (taxonomia) | Entradas | Saídas | Ramos | Combinações varridas | Ramos atingidos | Código |
|---|---|---|---|---|---|---|---|---|---|
| INST · 01 | Explorador · A matriz nas duas lentes | Aula 01 | explorador | 1 | 0 | 1 | 2 | 1/1 | divergente |
| INST · 02 | Calculadora · FC × energia anual | Aula 01 | calculadora | 2 | 3 | 3 | 182.000 | 3/3 | divergente |
| INST · 03 | Simulador · A bateria do Brasil (EAR ao longo do ano) | Aula 02 | simulador | 2 | 3 | 4 | 256 | 4/4 | divergente |
| INST · 04 | Comparador · Reservatório × fio d'água sob a mesma seca | Aula 03 | comparador | 1 | 4 | 3 | 16 | 2/3 | divergente |
| INST · 05 | Simulador · O dia do sistema: solar, vento e o resíduo | Aula 05 | simulador | 2 | 3 | 3 | 493 | 2/3 | divergente |
| INST · 06 | Simulador · A pilha de CVU: monte a ordem de mérito | Aula 06 | simulador | 3 | 3 | 5 | 11.880 | 3/5 | divergente |
| INST · 07 | Dimensionador · MW, MWh e o preço da viagem no tempo | Aula 09 | dimensionador | 3 | 4 | 3 | 8.400 | 3/3 | divergente |
| INST · 08 | Comparador · LCOE por tecnologia — e seus limites | Aula 10 | comparador | 3 | 4 | 5 | 5.395 | 5/5 | divergente |
| INST · 09 | Quebra-cabeça · O encaixe sazonal das fontes | Aula 10 | quebra-cabeca | 1 | 2 | 4 | 16 | 4/4 | divergente |

**Contagens.** 9 instrumentos `INST · NN`, todos dentro de aulas. Não há instrumento de módulo: o M03 não tem § Lab nem `LAB · NN` (0 ocorrências). Aulas sem instrumento: 04, 07 e 08. A Aula 01 e a Aula 10 têm dois instrumentos cada.

**Status no código.** Os 9 estão **portados**: definição presente, título e nota iguais e vínculo com a aula correto. Nos 8 que calculam (02–09), o cálculo numérico do código é idêntico ao original em 100% das comparações. O INST · 01 não calcula: o código porta só a troca de lente, e as participações do script (`DATA`) e a pilha desenhada ficaram de fora. Os 9 são **divergentes** pelo mesmo motivo principal: o texto do veredito no código é paráfrase ou resumo, e perde as interpolações numéricas. As divergências adicionais estão por instrumento, abaixo.

| Id | Comparações numéricas iguais | Ramo do veredito 1:1 com o original | Divergências de definição | Divergências de cálculo/saída |
|---|---|---|---|---|
| INST · 01 | n/a (sem cálculo) | n/a | campo divergente (ver campos_codigo); pílulas viraram select com rótulo "Seleção" (rótulo não existe na fonte) | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas); veredito do código devolve a chave da lente ("cap"/"ene"), não o texto; as participações (DATA do script) não estão no código; desenho (pilha_html #i01-stack) não portado (§12) |
| INST · 02 | 546.000/546.000 | sim | — | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas) |
| INST · 03 | 768/768 | sim | — | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas); desenho (svg #i03-svg) não portado (§12) |
| INST · 04 | 64/64 | sim | — | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas) |
| INST · 05 | 1.479/1.479 | sim | — | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas); desenho (svg #i05-svg) não portado (§12) |
| INST · 06 | 35.640/35.640 | **não** | — | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas); seleção de ramo do veredito não corresponde 1:1 ao original; desenho (pilha_html #i06-stack) não portado (§12) |
| INST · 07 | 33.600/33.600 | sim | — | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas) |
| INST · 08 | 16.185/16.185 | sim | campo divergente (ver campos_codigo); pílulas viraram select com rótulo "Seleção" (rótulo não existe na fonte) | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas); clique na pílula não reescreve o FC com o fc do preset (o original faz fcEl.value = pr.fc) — sinalizado no próprio código; saída "Premissas do preset" (label do preset) não é devolvida pela calculadora |
| INST · 09 | 32/32 | sim | — | texto do veredito não é o da fonte (paráfrase/resumo; interpolações numéricas perdidas); desenho (svg #i09-svg) não portado (§12) |

## INST · 01 · Explorador · A matriz nas duas lentes

- **Aula:** Aula 01 (`aula-03-01`). Markup L1479–L1495; script L2837–L2885 (comentário `INSTRUMENT 01: Matriz nas duas lentes`).
- **Kind:** `explorador` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1444):** "Quanto o Brasil tem de quê — e por que MW instalado não é MWh entregue?"
- **Onde é invocado:** logo depois de L1477 (`<p>Agora a segunda lente — e o choque pedagógico do módulo. Em <em>cap`…) e antes de L1497 (`<div class="callout red">`). Citado pelo id em L1571 (Aula 01).
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Participações didáticas, em ordem de grandeza, construídas sobre ANEEL/SIGA (capacidade, incl." "MMGD no total) e ONS/EPE (geração) — composições típicas recentes, não foto de um mês específico." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i01-pills` | pilulas | null (sem rótulo na fonte) | — | — | cap | cap = Capacidade instalada; ene = Energia gerada |

**Saídas (atribuição exata no script)**

Nenhum readout. A saída é o veredito e o desenho.

**Desenho:** `pilha_html` `#i01-stack` (1.094 caracteres gerados no cenário-padrão). Não portável como valor (§12).

**Cenário-padrão (execução do script original)**

- Entradas: `{"i01-pills":"cap"}`
- Saídas: `{}`
- Veredito (classe `verdict`, ramo L2874): "Lente da capacidade: o tamanho dos motores. A solar já é a segunda fonte — um quarto do parque — e a hidráulica caiu para menos da metade. É a foto que sai na manchete. Agora troque a lente e veja a foto que paga as contas."

**Ramos de leitura**

| Chave | Pílula | Texto (renderizado) |
|---|---|---|
| cap | Capacidade instalada | Lente da capacidade: o tamanho dos motores. A solar já é a segunda fonte — um quarto do parque — e a hidráulica caiu para menos da metade. É a foto que sai na manchete. Agora troque a lente e veja a foto que paga as contas. |
| ene | Energia gerada | Lente da energia: quanto cada motor andou. A hidráulica volta a dominar (~55–60%), a solar encolhe para ~1/10 e a nuclear mais que dobra de peso. A diferença entre as duas fotos tem um único nome: fator de capacidade. Quem cita capacidade sem citar FC está contando meia história. |

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L2874 | `(sem condição)` | `verdict` | 2 | Lente da capacidade: o tamanho dos motores. A solar já é a segunda fonte — um quarto do parque — e a hidráulica caiu para menos da metade. É a foto que sai na manchete. Agora troque a lente e veja a foto que paga as contas. |

**Nota do instrumento (literal, L1491):** Participações didáticas, em ordem de grandeza, construídas sobre ANEEL/SIGA (capacidade, incl. MMGD no total) e ONS/EPE (geração) — composições típicas recentes, não foto de um mês específico. Hidrologia e expansão mudam esses números continuamente. Não usar para citação externa sem reverificar na fonte.

**Campos divergentes no código:**

- `i01-pills`: rotulo_igual (código: "Seleção")

## INST · 02 · Calculadora · FC × energia anual

- **Aula:** Aula 01 (`aula-03-01`). Markup L1526–L1554; script L2890–L2918 (comentário `INSTRUMENT 02: FC x energia anual`).
- **Kind:** `calculadora` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1444):** "Quanto o Brasil tem de quê — e por que MW instalado não é MWh entregue?"
- **Onde é invocado:** logo depois de L1524 (`<p>Repare na linha do gás: o FC de uma térmica <span class="hl">não é `…) e antes de L1556 (`<div class="three-levels">`). Nenhuma outra menção pelo id.
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "*Consumo nacional tomado em ~550 TWh/ano (EPE/ONS — número vivo)." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i02-mw` | numero | Potência instalada | MW | 1–2000, 1 | 100 | — |
| `i02-fc` | numero | Fator de capacidade | % | 5–95, 1 | 27 | — |

**Saídas (atribuição exata no script)**

| Id | Rótulo | Atribuição |
|---|---|---|
| `i02-gwh` | Energia anual | L2901: `gwhOut.textContent = fb(gwh, 0) + " GWh/ano";` |
| `i02-heq` | Equivale a rodar pleno | L2902: `heqOut.textContent = fb(heq, 0) + " h/ano";` |
| `i02-pct` | Do consumo nacional* | L2903: `pctOut.textContent = fb(pct, 3) + " %";` |

**Cálculo (linhas verbatim do script)**

```js
L2898: var gwh = MW * 8760 * FC / 100 / 1000;
L2899: var heq = 8760 * FC / 100;
L2900: var pct = gwh / 550000 * 100;
```

**Cenário-padrão (execução do script original)**

- Entradas: `{"i02-mw":100,"i02-fc":27}`
- Saídas: `{"i02-gwh":"237 GWh/ano","i02-heq":"2.365 h/ano","i02-pct":"0,043 %"}`
- Veredito (classe `verdict`, ramo L2906): "Perfil de fonte variável (FC 27%). 100 MW entregam 237 GWh/ano — o mesmo que ~31 MW nucleares. Nenhum dos dois é melhor: são produtos diferentes. A pergunta certa nunca é quantos MW — é quantos MWh, quando, e com que firmeza."

**Ramos de leitura**

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L2906 | `if(FC < 35){` | `verdict` | 60.000 | Perfil de fonte variável (FC 5%). 1 MW entregam 0 GWh/ano — o mesmo que ~0 MW nucleares. Nenhum dos dois é melhor: são produtos diferentes. A pergunta certa nunca é quantos MW — é quantos MWh, quando, e com que firmeza. |
| L2909 | `} else if(FC < 70){` | `verdict` | 70.000 | Faixa de hidro, eólica premium ou térmica bem despachada (FC 35%). Equivale a rodar pleno 3.066 horas no ano. Repare: para térmica, esse número não é atributo da máquina — é o diário de quantas vezes o sistema precisou dela. |
| L2912 | `} else {` | `verdict warn` | 52.000 | Território de base (FC 70%). Só nuclear e térmicas rodando quase sempre vivem aqui. Cada MW vira ~6,1 GWh/ano — é por isso que 2 GW nucleares pesam o dobro do tamanho deles na coluna de energia. |

**Nota do instrumento (literal, L1550):** Didático. *Consumo nacional tomado em ~550 TWh/ano (EPE/ONS — número vivo). A mesma potência com FC diferente é, na prática, outra usina: compare 100 MW solares (FC 27) com 100 MW nucleares (FC 88) e veja a energia mais que triplicar.

**Teste declarado pela fonte** ("compare 100 MW solares (FC 27) com 100 MW nucleares (FC 88)", nota do instrumento (markup)):

- `{"i02-mw":100,"i02-fc":27}` → `{"i02-gwh":"237 GWh/ano","i02-heq":"2.365 h/ano","i02-pct":"0,043 %"}`, ramo L2906
- `{"i02-mw":100,"i02-fc":88}` → `{"i02-gwh":"771 GWh/ano","i02-heq":"7.709 h/ano","i02-pct":"0,140 %"}`, ramo L2912

## INST · 03 · Simulador · A bateria do Brasil (EAR ao longo do ano)

- **Aula:** Aula 02 (`aula-03-02`). Markup L1598–L1627; script L2923–L2984 (comentário `INSTRUMENT 03: A bateria do Brasil (EAR)`).
- **Kind:** `simulador` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1445):** "Por que o Brasil construiu as maiores baterias do mundo antes da primeira célula de lítio?"
- **Onde é invocado:** logo depois de L1596 (`<p>Características operacionais que você cita de cabeça: <strong>flexí`…) e antes de L1629 (`<p>O instrumento ensina a leitura que o mercado inteiro faz `). Citado pelo id em L2593 (§ Lex), L2769 (§ Ref).
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Não é o NEWAVE — é a intuição do NEWAVE." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i03-ena` | numero | Cenário hidrológico | ENA % da média | 55–130, 5 | 100 | — |
| `i03-ear` | numero | EAR inicial (1º de janeiro) | % | 20–95, 5 | 60 | — |

**Saídas (atribuição exata no script)**

| Id | Rótulo | Atribuição |
|---|---|---|
| `i03-min` | EAR mínima do ano | L2943: `minOut.textContent = fb(minP, 0) + " %";` |
| `i03-mes` | Mês crítico | L2944: `mesOut.textContent = MESES[minM];` |
| `i03-term` | Meses com térmica pesada | L2945: `termOut.textContent = termM + (termM === 1 ? " mês" : " meses");` |

**Cálculo (linhas verbatim do script)**

```js
L2930: var ena = (parseFloat(enaEl.value) || 100) / 100;
L2931: var ear = (parseFloat(earEl.value) || 60) / 100 * CAPAC;
L2934: var inflow = SHAPE[m] * ena;
L2935: var gen = Math.min(1, ear + inflow);
L2937: ear = Math.min(CAPAC, Math.max(0, ear + inflow - gen));
L2938: var pct = ear / CAPAC * 100;
```

**Desenho:** `svg` `#i03-svg` (3.390 caracteres gerados no cenário-padrão). Não portável como valor (§12).

**Cenário-padrão (execução do script original)**

- Entradas: `{"i03-ena":100,"i03-ear":60}`
- Saídas: `{"i03-min":"52 %","i03-mes":"Out","i03-term":"0 meses"}`
- Veredito (classe `verdict`, ramo L2957): "Ano confortável: a bateria faz o trabalho dela. Carrega na estação úmida, descarrega na seca, mínimo de 52% em Out. Energia barata o ano inteiro — e ninguém fora do setor percebe o ciclo gigante acontecendo."

**Ramos de leitura**

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L2948 | `if(deficit > 0.05){` | `verdict danger` | 77 | Estoque zerado: território de racionamento. A bateria do Brasil esvaziou antes da chuva voltar — a hidráulica não cumpre o alvo e o sistema vive de térmica cara e corte. É o desenho de 2001. EAR mínima de 0% em Mai. |
| L2951 | `} else if(minP < 12){` | `verdict danger` | 20 | EAR mínima de 1% (Dez): o desenho de 2021. O estoque não zera, mas o valor da água dispara, térmicas a CVU altíssimo rodam meses (4 meses abaixo de 30%) e a conta chega via bandeira. A bateria salvou o suprimento — cobrando caro. |
| L2954 | `} else if(minP < 30){` | `verdict warn` | 25 | Ano apertado: mínimo de 13% em Dez. 4 meses na zona de atenção — térmica pesada para poupar água, preço de curto prazo nervoso. É o regime em que o mercado vigia o boletim de ENA toda semana. |
| L2957 | `} else {` | `verdict` | 134 | Ano confortável: a bateria faz o trabalho dela. Carrega na estação úmida, descarrega na seca, mínimo de 31% em Nov. Energia barata o ano inteiro — e ninguém fora do setor percebe o ciclo gigante acontecendo. |

**Nota do instrumento (literal, L1623):** Modelo didático de balanço mensal: afluência sazonal típica do SIN (cheia dez–abr, seca mai–nov), geração hidráulica alvo constante, estoque limitado. Não é o NEWAVE — é a intuição do NEWAVE. Ajuste a ENA para ~75% e veja o desenho de 2021; para ~60%, o fantasma de 2001.

**Teste declarado pela fonte** ("Ajuste a ENA para ~75% e veja o desenho de 2021; para ~60%, o fantasma de 2001.", nota do instrumento (markup)):

- `{"i03-ena":75,"i03-ear":60}` → `{"i03-min":"0 %","i03-mes":"Nov","i03-term":"5 meses"}`, ramo L2948
- `{"i03-ena":60,"i03-ear":60}` → `{"i03-min":"0 %","i03-mes":"Set","i03-term":"7 meses"}`, ramo L2948

## INST · 04 · Comparador · Reservatório × fio d'água sob a mesma seca

- **Aula:** Aula 03 (`aula-03-03`). Markup L1672–L1696; script L2989–L3025 (comentário `INSTRUMENT 04: Reservatório x fio d'água`).
- **Kind:** `comparador` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1446):** "Por que o país parou de construir reservatórios — e o que essa escolha custou em firmeza?"
- **Onde é invocado:** logo depois de L1670 (`<p>Eis o efeito agregado que separa o analista do torcedor: cada GW hi`…) e antes de L1698 (`<p>Complete o quadro com as outras hidráulicas do cardápio: `). Nenhuma outra menção pelo id.
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "nenhuma" P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i04-ena` | numero | Hidrologia do ano | ENA % da média | 55–130, 5 | 100 | — |

**Saídas (atribuição exata no script)**

| Id | Rótulo | Atribuição |
|---|---|---|
| `i04-fcfio` | Fio d'água · FC anual | L3008: `fcOut.textContent = fb(fcFio, 0) + " %";` |
| `i04-minfio` | Fio · pior mês (% da capac.) | L3009: `minOut.textContent = fb(fioMin / FIO_CAP * 100, 0) + " %";` |
| `i04-firme` | Reservatório · entrega firme | L3010: `firmeOut.textContent = fb(firmeMin * 100, 0) + " % do alvo";` |
| `i04-stk` | Reservatório · estoque final | L3011: `stkOut.textContent = fb(stor / RES_CAP * 100, 0) + " %";` |

**Cálculo (linhas verbatim do script)**

```js
L2995: var ena = (parseFloat(enaEl.value) || 100) / 100;
L2999: var inflow = SHAPE[m] * ena;
L3000: var gFio = Math.min(FIO_CAP, inflow);
L3001: fioSum += gFio;
L3003: var gRes = Math.min(1, stor + inflow);
L3004: stor = Math.min(RES_CAP, Math.max(0, stor + inflow - gRes));
L3007: var fcFio = fioSum / 12 / FIO_CAP * 100;
```

**Cenário-padrão (execução do script original)**

- Entradas: `{"i04-ena":100}`
- Saídas: `{"i04-fcfio":"63 %","i04-minfio":"31 %","i04-firme":"100 % do alvo","i04-stk":"55 %"}`
- Veredito (classe `verdict`, ramo L3020): "Ano bom esconde a diferença. Com água sobrando, até a fio d'água parece firme (pior mês em 31% da capacidade) e o reservatório nem sua (estoque final 55%). É por isso que matriz se julga no ano ruim — arraste a ENA para baixo e veja os produtos se separarem."

**Ramos de leitura**

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L3014 | `if(firmeMin < 0.7){` | `verdict danger` | 5 | A seca venceu as duas — de jeitos diferentes. A fio d'água caiu a 17% da capacidade no pior mês, como sempre faria. Mas o alarme é o reservatório: o estoque acabou e a entrega firme desabou para 28% do alvo. Quando até a usina-bateria falha, o que sobra é térmica, corte e crise — a firmeza tem limite, e o limite é o estoque. |
| L3017 | `} else if(fioMin / FIO_CAP < 0.25){` | `verdict warn` | 0 (**inalcançável**) | — (nunca renderizado; expressão em ramos_de_leitura[].expressao_js) |
| L3020 | `} else {` | `verdict` | 11 | Ano bom esconde a diferença. Com água sobrando, até a fio d'água parece firme (pior mês em 25% da capacidade) e o reservatório nem sua (estoque final 3%). É por isso que matriz se julga no ano ruim — arraste a ENA para baixo e veja os produtos se separarem. |

**Nota do instrumento (literal, L1692):** Duas usinas didáticas sob a mesma afluência sazonal: a fio d'água gera o que o rio manda (limitada pela turbina); a de reservatório tenta sustentar entrega constante usando o estoque. Didático — não usar para dimensionamento real. O ponto não é qual "ganha": é ver que entregam produtos diferentes — energia média vs energia firme.

**Teste declarado pela fonte** ("arraste a ENA para baixo e veja os produtos se separarem", texto do ramo "Ano bom" do veredito (script)):

- `{"i04-ena":100}` → `{"i04-fcfio":"63 %","i04-minfio":"31 %","i04-firme":"100 % do alvo","i04-stk":"55 %"}`, ramo L3020
- `{"i04-ena":75}` → `{"i04-fcfio":"47 %","i04-minfio":"23 %","i04-firme":"70 % do alvo","i04-stk":"1 %"}`, ramo L3014
- `{"i04-ena":55}` → `{"i04-fcfio":"34 %","i04-minfio":"17 %","i04-firme":"28 % do alvo","i04-stk":"0 %"}`, ramo L3014

## INST · 05 · Simulador · O dia do sistema: solar, vento e o resíduo

- **Aula:** Aula 05 (`aula-03-05`). Markup L1766–L1795; script L3030–L3092 (comentário `INSTRUMENT 05: O dia do sistema`).
- **Kind:** `simulador` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1448):** "O que acontece quando a fonte mais barata do leilão é também a mais rígida do relógio?"
- **Onde é invocado:** logo depois de L1764 (`<p>Operacionalmente, a solar é a fonte mais previsível e mais rígida d`…) e antes de L1797 (`<div class="three-levels">`). Citado pelo id em L1992 (Aula 09), L2769 (§ Ref), L3218 (script (texto de veredito)).
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "nenhuma" P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i05-sol` | numero | Solar total no sistema | GW instalados | 0–80, 5 | 35 | — |
| `i05-eol` | numero | Eólica gerando | GW médios no dia | 0–28, 1 | 12 | — |

**Saídas (atribuição exata no script)**

| Id | Rótulo | Atribuição |
|---|---|---|
| `i05-min` | Resíduo mínimo (meio-dia) | L3051: `minOut.textContent = fb(minR, 0) + " GW";` |
| `i05-rampa` | Rampa do pôr do sol | L3052: `rampaOut.textContent = "+" + fb(rampa, 1) + " GW/h";` |
| `i05-exc` | Excedente didático | L3053: `excOut.textContent = fb(exc, 0) + " GWh/dia";` |

**Cálculo (linhas verbatim do script)**

```js
L3042: var gs = (h >= 6 && h <= 18) ? S * 0.78 * Math.sin(Math.PI * (h - 6) / 12) : 0;
L3043: var gw = W * WFAC[h];
L3044: var r = LOAD[h] - gs - gw;
```

**Desenho:** `svg` `#i05-svg` (3.056 caracteres gerados no cenário-padrão). Não portável como valor (§12).

**Cenário-padrão (execução do script original)**

- Entradas: `{"i05-sol":35,"i05-eol":12}`
- Saídas: `{"i05-min":"47 GW","i05-rampa":"+12,5 GW/h","i05-exc":"0 GWh/dia"}`
- Veredito (classe `verdict warn`, ramo L3059): "Rampa pesada: +12,5 GW/h entre 17h e 20h. O sol sai, o consumo sobe, e alguém despachável precisa escalar o equivalente a uma Itaipu em poucas horas — hidro com estoque, gás flexível e, daqui em diante, bateria. O resíduo do meio-dia caiu a 47 GW: a barriga e a rampa são o mesmo fenômeno, visto de horas diferentes."

**Ramos de leitura**

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L3056 | `if(exc > 1){` | `verdict danger` | 0 (**inalcançável**) | — (nunca renderizado; expressão em ramos_de_leitura[].expressao_js) |
| L3059 | `} else if(rampa > 9){` | `verdict warn` | 370 | Rampa pesada: +9,0 GW/h entre 17h e 20h. O sol sai, o consumo sobe, e alguém despachável precisa escalar o equivalente a uma Itaipu em poucas horas — hidro com estoque, gás flexível e, daqui em diante, bateria. O resíduo do meio-dia caiu a 68 GW: a barriga e a rampa são o mesmo fenômeno, visto de horas diferentes. |
| L3062 | `} else {` | `verdict` | 123 | Dia administrável. Resíduo mínimo de 68 GW às 2h e rampa de +6,0 GW/h — dentro do que o parque flexível resolve sem drama. Suba a solar e veja a barriga afundar e a rampa empinar: é a curva líquida do Módulo 02, agora com as tecnologias nomeadas. |

**Nota do instrumento (literal, L1791):** Carga didática típica do SIN (~70–100 GW), solar em perfil de dia claro, eólica com leve reforço noturno (perfil NE). O resíduo é o que sobra para hidro despachável + térmicas + baterias. Didático — não usar para análise real de operação.

**Teste declarado pela fonte** ("Suba a solar e veja a barriga afundar e a rampa empinar", texto do ramo "Dia administrável" do veredito (script)):

- `{"i05-sol":35,"i05-eol":12}` → `{"i05-min":"47 GW","i05-rampa":"+12,5 GW/h","i05-exc":"0 GWh/dia"}`, ramo L3059
- `{"i05-sol":80,"i05-eol":12}` → `{"i05-min":"12 GW","i05-rampa":"+21,6 GW/h","i05-exc":"0 GWh/dia"}`, ramo L3059
- `{"i05-sol":80,"i05-eol":28}` → `{"i05-min":"0 GW","i05-rampa":"+20,8 GW/h","i05-exc":"1 GWh/dia"}`, ramo L3059

**Saídas que só existem no código:** `i05-minh`.

## INST · 06 · Simulador · A pilha de CVU: monte a ordem de mérito

- **Aula:** Aula 06 (`aula-03-06`). Markup L1844–L1881; script L3097–L3185 (comentário `INSTRUMENT 06: Pilha de CVU / ordem de mérito`).
- **Kind:** `simulador` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1449):** "Por que a usina mais cara de rodar pode ser a mais valiosa de ter?"
- **Onde é invocado:** logo depois de L1842 (`<p>O cenário institucional completa o quadro: o <strong>Novo Mercado d`…) e antes de L1883 (`<div class="callout red">`). Citado pelo id em L2685 (§ Lex).
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Pilha didática com capacidades e CVUs ilustrativos em ordem de grandeza (faixas inspiradas em CVUs homologados pela ANEEL/CCEE — vivos, mudam a cada revisão e a cada cotação de combustível)." "Piso de R$ 61 como referência do piso regulatório do PLD." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i06-dem` | numero | Demanda do sistema | GW | 40–105, 1 | 75 | — |
| `i06-agua` | numero | Valor da água | R$/MWh | 60–650, 10 | 150 | — |
| `i06-gas` | selecao | Preço do gás / GNL | — | — | 1 | 0.7 = Baixo (mercado folgado); 1 = Médio; 1.8 = Alto (crise global, 2021/2022) |

**Saídas (atribuição exata no script)**

| Id | Rótulo | Atribuição |
|---|---|---|
| `i06-marg` | Fonte marginal | L3161: `margOut.textContent = D <= mustCap ? "Renovável (sobra)" : (marg ? marg.name : "—");` |
| `i06-cmo` | CMO didático | L3162: `cmoOut.textContent = "R$ " + fb(cmo, 0) + "/MWh";` |
| `i06-term` | Térmica despachada | L3163: `termOut.textContent = fb(termGW, 1) + " GW";` |

**Cálculo (linhas verbatim do script)**

```js
L3121: var agua = Math.round(parseFloat(aguaEl.value) || 150);
L3123: var ps = plantList(agua, gm).sort(function(a, b){ return a.cost - b.cost; });
L3130: var excess = mustCap - D;
L3135: cut = cs + ce + ch;
L3140: var dd = Math.min(p.cap, rem);
L3143: rem -= dd;
L3145: deficit = rem > 1e-6 ? rem : 0;
L3146: cmo = marg ? Math.max(PISO, marg.cost) : PISO;
L3153: var pf = p.cap > 0 ? dGW / p.cap * 100 : 0;
```

**Desenho:** `pilha_html` `#i06-stack` (2.198 caracteres gerados no cenário-padrão). Não portável como valor (§12).

**Cenário-padrão (execução do script original)**

- Entradas: `{"i06-dem":75,"i06-agua":150,"i06-gas":"1"}`
- Saídas: `{"i06-marg":"Hidro reservatório","i06-cmo":"R$ 150/MWh","i06-term":"0,0 GW"}`
- Veredito (classe `verdict`, ramo L3178): "Margem comportada: Hidro reservatório define CMO de R$ 150/MWh. O valor da água (R$ 150) está posicionando a hidro na pilha exatamente como a Aula 05 do Módulo 02 descreveu — suba a seca (valor da água) ou o preço do gás e veja a fila se reorganizar."

**Ramos de leitura**

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L3166 | `if(deficit > 0){` | `verdict danger` | 0 (**inalcançável**) | — (nunca renderizado; expressão em ramos_de_leitura[].expressao_js) |
| L3169 | `} else if(D <= mustCap){` | `verdict warn` | 1.800 | Sobra renovável: 9,0 GW cortados. A demanda é menor que o bloco must-run — meio-dia de sol e vento fortes. Preço encosta no piso (R$ 61) e o sistema corta geração de custo zero: o curtailment didático. A pergunta de 2026 em diante: quanto disso uma bateria captura? |
| L3172 | `} else if(cmo > 900){` | `verdict danger` | 0 (**inalcançável**) | — (nunca renderizado; expressão em ramos_de_leitura[].expressao_js) |
| L3175 | `} else if(cmo > 350){` | `verdict warn` | 2.820 | Ponta térmica cara na margem: Hidro reservatório a R$ 360/MWh. 22,5 GW térmicos despachados. Note o efeito do seletor de gás: a mesma pilha física muda de preço porque a térmica é um conversor de preço de combustível — o sistema importa o humor do mercado global. |
| L3178 | `} else {` | `verdict` | 7.260 | Margem comportada: Hidro reservatório define CMO de R$ 61/MWh. O valor da água (R$ 60) está posicionando a hidro na pilha exatamente como a Aula 05 do Módulo 02 descreveu — suba a seca (valor da água) ou o preço do gás e veja a fila se reorganizar. |

**Nota do instrumento (literal, L1877):** Pilha didática com capacidades e CVUs ilustrativos em ordem de grandeza (faixas inspiradas em CVUs homologados pela ANEEL/CCEE — vivos, mudam a cada revisão e a cada cotação de combustível). Piso de R$ 61 como referência do piso regulatório do PLD. Não usar para análise real de despacho. Suba o preço do gás e veja o "conversor de preço" em ação: o mesmo sistema, a mesma demanda — e o custo marginal multiplicado.

**Teste declarado pela fonte** ("Suba o preço do gás e veja o "conversor de preço" em ação: o mesmo sistema, a mesma demanda — e o custo marginal multiplicado.", nota do instrumento (markup)):

- `{"i06-dem":75,"i06-agua":150,"i06-gas":"1"}` → `{"i06-marg":"Hidro reservatório","i06-cmo":"R$ 150/MWh","i06-term":"0,0 GW"}`, ramo L3178
- `{"i06-dem":75,"i06-agua":150,"i06-gas":"1.8"}` → `{"i06-marg":"Hidro reservatório","i06-cmo":"R$ 150/MWh","i06-term":"0,0 GW"}`, ramo L3178
- `{"i06-dem":100,"i06-agua":150,"i06-gas":"1"}` → `{"i06-marg":"GN ciclo combinado","i06-cmo":"R$ 180/MWh","i06-term":"9,0 GW"}`, ramo L3178
- `{"i06-dem":100,"i06-agua":150,"i06-gas":"1.8"}` → `{"i06-marg":"Carvão","i06-cmo":"R$ 280/MWh","i06-term":"9,0 GW"}`, ramo L3178

**Saídas que só existem no código:** `i06-cut`, `i06-deficit`.

## INST · 07 · Dimensionador · MW, MWh e o preço da viagem no tempo

- **Aula:** Aula 09 (`aula-03-09`). Markup L1994–L2028; script L3190–L3225 (comentário `INSTRUMENT 07: Bateria MW x MWh`).
- **Kind:** `dimensionador` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1452):** "Bateria gera energia ou desloca energia — e o que o leilão de 2026 está comprando de verdade?"
- **Onde é invocado:** logo depois de L1992 (`<p>Toda bateria é definida por dois números independentes: <strong>pot`…) e antes de L2030 (`<h3><span class="num">9.2</span>O leilão de 2026: o que o Br`). Nenhuma outra menção pelo id.
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "nenhuma" P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i07-mw` | numero | Potência | MW | 10–500, 10 | 100 | — |
| `i07-h` | numero | Duração | horas | 0.5–6, 0.5 | 4 | — |
| `i07-eff` | numero | Eficiência de ciclo | % | 82–95, 1 | 88 | — |

**Saídas (atribuição exata no script)**

| Id | Rótulo | Atribuição |
|---|---|---|
| `i07-mwh` | Tanque (energia) | L3202: `mwhOut.textContent = fb(E, 0) + " MWh";` |
| `i07-desl` | Deslocado por dia (1 ciclo) | L3203: `deslOut.textContent = fb(E, 0) + " MWh/dia";` |
| `i07-perda` | Perdido no caminho / dia | L3204: `perdaOut.textContent = fb(perda, 0) + " MWh/dia";` |
| `i07-voc` | Vocação | L3209: `vocOut.textContent = voc;` |

**Cálculo (linhas verbatim do script)**

```js
L3198: var eff = (parseFloat(effEl.value) || 88) / 100;
L3199: var E = P * H;
L3200: var carga = E / eff;
L3201: var perda = carga - E;
```

**Cenário-padrão (execução do script original)**

- Entradas: `{"i07-mw":100,"i07-h":4,"i07-eff":88}`
- Saídas: `{"i07-mwh":"400 MWh","i07-desl":"400 MWh/dia","i07-perda":"55 MWh/dia","i07-voc":"Rampa do pôr do sol"}`
- Veredito (classe `verdict`, ramo L3218): "4,0 h de fôlego: perfil de rampa. Carrega ao meio-dia, descarrega das 17h às 21h — exatamente a janela do INST·05. Desloca 400 MWh/dia perdendo 55 no caminho. Acima disso, o deslocamento longo é território da reversível e do reservatório — fusos diferentes de estoque."

**Ramos de leitura**

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L3212 | `if(H < 1){` | `verdict warn` | 700 | Tanque curto (0,5 h): potência sem fôlego. 10 MW prontos em milissegundos — vocação para frequência e suavização, o serviço que a perda de inércia valorizou. Mas não atravessa a rampa: para o LRCAP, que compra potência sustentada sob comando do ONS, a duração mínima exigida no edital é parte do produto. |
| L3215 | `} else if(H <= 3){` | `verdict` | 3.500 | 1,0 h na potência máxima: o formato de ponta. Desloca 10 MWh/dia da barriga solar para as horas caras, pagando pedágio de 2 MWh em calor (22% a mais na carga). Bateria não gera — cobra frete temporal. |
| L3218 | `} else {` | `verdict` | 4.200 | 3,5 h de fôlego: perfil de rampa. Carrega ao meio-dia, descarrega das 17h às 21h — exatamente a janela do INST·05. Desloca 35 MWh/dia perdendo 8 no caminho. Acima disso, o deslocamento longo é território da reversível e do reservatório — fusos diferentes de estoque. |

**Nota do instrumento (literal, L2024):** Didático: um ciclo completo por dia, eficiência aplicada na carga. Não usar para dimensionamento real — projeto de verdade modela degradação, profundidade de descarga, temperatura e estratégia de ciclagem. O ponto pedagógico: potência e energia são produtos diferentes — e o leilão de 2026 compra um deles.

## INST · 08 · Comparador · LCOE por tecnologia — e seus limites

- **Aula:** Aula 10 (`aula-03-10`). Markup L2067–L2103; script L3230–L3290 (comentário `INSTRUMENT 08: Comparador de LCOE`).
- **Kind:** `comparador` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1453):** "Por que a planilha que ordena os custos não é a planilha que decide o despacho?"
- **Onde é invocado:** logo depois de L2065 (`<p>Duas alavancas dominam a fórmula. <strong>O denominador é o fator d`…) e antes de L2105 (`<h3><span class="num">10.1</span>Os quatro limites do LCOE —`). Nenhuma outra menção pelo id.
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Presets didáticos em ordem de grandeza (CAPEX, O&M, vida útil, custo variável inspirados em EPE / Lazard LCOE+ — vivos)." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i08-pills` | pilulas | null (sem rótulo na fonte) | — | — | solar | solar = Solar UFV; eolica = Eólica NE; gas = Gás CC; hidro = Hidro grande; nuclear = Nuclear |
| `i08-fc` | numero | Fator de capacidade | % | 10–92, 1 | 27 | — |
| `i08-wacc` | numero | WACC real | % a.a. | 8–14, 0.5 | 10 | — |

**Saídas (atribuição exata no script)**

| Id | Rótulo | Atribuição |
|---|---|---|
| `i08-lcoe` | LCOE | L3252: `lcoeOut.textContent = "R$ " + fb(lcoe, 0) + "/MWh";` |
| `i08-cap` | Parcela de capital | L3253: `capOut.textContent = "R$ " + fb(lcoeCap, 0) + " (" + fb(lcoeCap / lcoe * 100, 0) + "%)";` |
| `i08-om` | O&M + variável | L3254: `omOut.textContent = "R$ " + fb(lcoeOM, 0) + "/MWh";` |
| `i08-pre` | Premissas do preset | L3255: `preOut.textContent = p.label;` |

**Cálculo (linhas verbatim do script)**

```js
L3246: var r = (parseFloat(waccEl.value) || 10) / 100;
L3247: var crf = r * Math.pow(1 + r, p.n) / (Math.pow(1 + r, p.n) - 1);
L3248: var energiaMWh = 8.76 * fc / 100;
L3249: var lcoeCap = p.capex * crf / energiaMWh;
L3250: var lcoeOM = p.om / energiaMWh + p.vr;
L3251: var lcoe = lcoeCap + lcoeOM;
```

**Cenário-padrão (execução do script original)**

- Entradas: `{"i08-pills":"solar","i08-fc":27,"i08-wacc":10}`
- Saídas: `{"i08-lcoe":"R$ 184/MWh","i08-cap":"R$ 163 (89%)","i08-om":"R$ 21/MWh","i08-pre":"CAPEX R$ 3.500/kW · O&M R$ 50/kW·a · 25 anos"}`
- Veredito (classe `verdict`, ramo L3269): "R$ 184/MWh: o número que venceu os leilões. Custo quase todo de capital (89%), combustível zero, FC ditado pelo recurso — não pelo despacho. Mas lembre os limites 1 e 3: este MWh chega no horário que o recurso quiser e captura preço cada vez menor conforme a fonte cresce. Barato não é sinônimo de suficiente."

**Ramos de leitura**

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L3259 | `if(tech === "gas"){ › if(fc < 25){` | `verdict warn` | 195 | O limite 2 em carne viva: R$ 868/MWh a FC 10%. A mesma usina que custava ~R$ 400 rodando metade do tempo agora parece um desastre — sem mudar um parafuso. O LCOE de térmica flexível é um termômetro do despacho, não do projeto: ela existe para rodar pouco, e o valor dela está exatamente nas horas que a planilha pune. |
| L3262 | `if(tech === "gas"){ › } else {` | `verdict` | 884 | Gás CC a FC 25%: R$ 497/MWh — 250 dos quais são combustível. Agora arraste o FC para 15% e assista ao LCOE quase dobrar. É a circularidade: o custo unitário do gás depende de quantas horas o resto do sistema o deixa rodar. Comparar este número com o da solar é comparar um seguro com uma commodity. |
| L3266 | `} else if(tech === "nuclear"){` | dinâmica (expressão no script; ex.: `verdict warn`) | 1.079 | R$ 3.264/MWh — e 85% disso é capital. Suba o WACC um ponto e veja dezenas de reais aparecerem do nada: em ativo de CAPEX dominante, juro pesa mais que engenharia. Agora imagine esse CAPEX parado 39 anos compondo — está explicada a tarifa de referência de Angra 3 na casa de R$ 800/MWh, sem falar uma palavra de física nuclear. |
| L3269 | `} else if(tech === "solar" \|\| tech === "eolica"){` | `verdict` | 2.158 | R$ 431/MWh: o número que venceu os leilões. Custo quase todo de capital (87%), combustível zero, FC ditado pelo recurso — não pelo despacho. Mas lembre os limites 1 e 3: este MWh chega no horário que o recurso quiser e captura preço cada vez menor conforme a fonte cresce. Barato não é sinônimo de suficiente. |
| L3272 | `} else {` | `verdict` | 1.079 | Hidro grande didática: R$ 854/MWh em 50 anos de vida. O segredo está no n do CRF — vida longa dilui capital como nenhuma outra fonte. O problema é que este preset é quase teórico: os sítios viáveis com reservatório acabaram (ou custam um licenciamento que nenhum WACC paga). A hidro barata do Brasil já foi construída — por isso ela é legado, não opção de expansão. |

**Nota do instrumento (literal, L2099):** Presets didáticos em ordem de grandeza (CAPEX, O&M, vida útil, custo variável inspirados em EPE / Lazard LCOE+ — vivos). Fórmula: capital anualizado pelo CRF + O&M fixo, dividido pela energia anual, mais variável. Não usar para decisão de investimento. Faça o teste-chave: selecione Gás CC e arraste o FC de 45% para 15% — o LCOE quase dobra sem mudar nada na usina. Esse é o limite nº 2 abaixo.

**Teste declarado pela fonte** ("selecione Gás CC e arraste o FC de 45% para 15% — o LCOE quase dobra sem mudar nada na usina.", nota do instrumento (markup)):

- `{"i08-pills":"gas","i08-fc":45,"i08-wacc":10}` → `{"i08-lcoe":"R$ 406/MWh","i08-cap":"R$ 126 (31%)","i08-om":"R$ 280/MWh","i08-pre":"CAPEX R$ 4.500/kW · combustível R$ 250/MWh · 25 anos"}`, ramo L3262
- `{"i08-pills":"gas","i08-fc":15,"i08-wacc":10}` → `{"i08-lcoe":"R$ 719/MWh","i08-cap":"R$ 377 (53%)","i08-om":"R$ 341/MWh","i08-pre":"CAPEX R$ 4.500/kW · combustível R$ 250/MWh · 25 anos"}`, ramo L3259

**Campos divergentes no código:**

- `i08-pills`: rotulo_igual (código: "Seleção")

**Saídas que só existem no código:** `i08-cappct`.

## INST · 09 · Quebra-cabeça · O encaixe sazonal das fontes

- **Aula:** Aula 10 (`aula-03-10`). Markup L2125–L2147; script L3295–L3363 (comentário `INSTRUMENT 09: Quebra-cabeça sazonal`).
- **Kind:** `quebra-cabeca` (instrument-taxonomy.md; mecânica conferida no script).
- **Pergunta própria:** `null`. O instrumento não tem pergunta própria na fonte. A pergunta do § MAP da aula é contexto, não pergunta do instrumento; uma pergunta de previsão seria camada Alexandria (P3/P11/P19).
- **Pergunta do § MAP da aula (contexto, L1453):** "Por que a planilha que ordena os custos não é a planilha que decide o despacho?"
- **Onde é invocado:** logo depois de L2123 (`<p>Feche o módulo com a imagem que organiza tudo — e que se sustenta n`…) e antes de L2149 (`<div class="three-levels">`). Citado pelo id em L2769 (§ Ref).
- **Fonte dos números:** `null`. Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Perfis mensais didáticos (índice 100 = média do ano de cada fonte; pesos aproximados de participação na energia), inspirados nas sazonalidades reais ONS/UNICA/ABEEólica." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Tolerâncias:** `null`. A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Entradas**

| Id | Tipo | Rótulo | Unidade | Faixa (min–max, passo) | Padrão | Opções |
|---|---|---|---|---|---|---|
| `i09-checks` | chaves_booleanas | null (sem rótulo na fonte) | — | — | — | hidro = Hidro (ENA) (ligada); eolica = Eólica NE; solar = Solar; bio = Biomassa (safra) |

**Saídas (atribuição exata no script)**

| Id | Rótulo | Atribuição |
|---|---|---|
| `i09-ratio` | Mês mais fraco vs mais forte | L3320: `ratioOut.textContent = active.length ? fb(ratio, 0) + " %" : "—";` |
| `i09-vale` | Vale do portfólio | L3321: `valeOut.textContent = active.length ? MESES[minM] : "—";` |

**Cálculo (linhas verbatim do script)**

```js
L3319: var ratio = active.length && maxV > 0 ? minV / maxV * 100 : 0;
L3337: var bw = (x1 - x0) / 12 - 8;
L3346: var h = PROF[k].w * PROF[k].m[m] / 100;
L3347: var hp = h / ymax * (y1 - y0);
L3349: base -= hp;
```

**Desenho:** `svg` `#i09-svg` (3.363 caracteres gerados no cenário-padrão). Não portável como valor (§12).

**Cenário-padrão (execução do script original)**

- Entradas: `{"i09-checks-hidro":"on","i09-checks-eolica":"off","i09-checks-solar":"off","i09-checks-bio":"off"}`
- Saídas: `{"i09-ratio":"32 %","i09-vale":"Ago"}`
- Veredito (classe `verdict danger`, ramo L3327): "Time de um jogador: o mês fraco entrega só 32% do mês forte. Era a matriz quase-só-hidro: setembro a 25 contra um verão a 78 — a diferença atravessada com reservatório e reza. Adicione a eólica e veja o vale de Ago começar a se erguer."

**Ramos de leitura**

| Linha | Condição (literal) | Classe | Vezes na varredura | Exemplo renderizado |
|---|---|---|---|---|
| L3324 | `if(!active.length){` | `verdict warn` | 1 | Ligue ao menos uma fonte. Comece pela hidro sozinha — o Brasil dos anos 1990 — e adicione as outras na ordem em que o país as adicionou. |
| L3327 | `} else if(ratio < 40){` | `verdict danger` | 3 | Time de um jogador: o mês fraco entrega só 32% do mês forte. Era a matriz quase-só-hidro: setembro a 25 contra um verão a 78 — a diferença atravessada com reservatório e reza. Adicione a eólica e veja o vale de Ago começar a se erguer. |
| L3330 | `} else if(ratio < 55){` | `verdict warn` | 6 | O encaixe começou: razão fraco/forte em 52%. O vento do 2º semestre está preenchendo exatamente os meses em que a ENA some. Falta a peça da seca profunda — ligue a biomassa e repare onde a safra cai no calendário. |
| L3333 | `} else {` | `verdict` | 6 | Portfólio trabalhando: 67% — o vale de Jul subiu sem ninguém construir uma usina a mais. Hidro no verão, vento e cana na seca, sol o ano todo: é a complementaridade convertendo perfis em firmeza estatística. O que o gráfico não mostra — e a Aula 05 do Módulo 02 lembrou — é que esse encaixe só existe se houver fio entre as regiões. |

**Nota do instrumento (literal, L2143):** Perfis mensais didáticos (índice 100 = média do ano de cada fonte; pesos aproximados de participação na energia), inspirados nas sazonalidades reais ONS/UNICA/ABEEólica. Ligue as fontes uma a uma, na ordem, e observe o índice mês-fraco/mês-forte subir: o encaixe é o produto. Não usar para análise real.

**Teste declarado pela fonte** ("Ligue as fontes uma a uma, na ordem, e observe o índice mês-fraco/mês-forte subir", nota do instrumento (markup)):

- `{"i09-checks-hidro":"on","i09-checks-eolica":"off","i09-checks-solar":"off","i09-checks-bio":"off"}` → `{"i09-ratio":"32 %","i09-vale":"Ago"}`, ramo L3327
- `{"i09-checks-hidro":"on","i09-checks-eolica":"on","i09-checks-solar":"off","i09-checks-bio":"off"}` → `{"i09-ratio":"52 %","i09-vale":"Ago"}`, ramo L3330
- `{"i09-checks-hidro":"on","i09-checks-eolica":"on","i09-checks-solar":"on","i09-checks-bio":"off"}` → `{"i09-ratio":"58 %","i09-vale":"Jul"}`, ramo L3333
- `{"i09-checks-hidro":"on","i09-checks-eolica":"on","i09-checks-solar":"on","i09-checks-bio":"on"}` → `{"i09-ratio":"67 %","i09-vale":"Jul"}`, ramo L3333

## Divergências da fonte ligadas a instrumentos

### `div-m03-inst-01-fc-fio-dagua` — FCap do fio d'água: tabela da Aula 01 × cenário-padrão do INST · 04 (P20 — CONTENT QA)

- **Aula 01, tabela "FC típico no Brasil" (L1514):** "Hidro fio d'água | ~40–55%, sazonal | A vazão do rio, sem direito a opinião"
- **INST · 04, saída i04-fcfio no cenário-padrão (execução do script; constante L2993):** saída `63 %`; `var FIO_CAP = 1.6, RES_CAP = 4, RES_START = 2.5;`

O modelo do INST · 04 (FIO_CAP = 1.6 sobre a curva SHAPE) produz FC anual de 63% com ENA 100%, acima da faixa "~40–55%" que a própria aula declara. A nota do instrumento o declara modelo didático; nenhuma faixa vira verdade (P20).

Decisão: não escolhida — CONTENT QA, verificação autoritativa pendente (P20).

### `div-m03-inst-02-ramo-prometido-inalcancavel` — INST · 04: o texto do ramo "Ano bom" manda buscar um estado que a varredura nunca atinge

- **script L3020 (ramo else, "Ano bom"):** "arraste a ENA para baixo e veja os produtos se separarem"
- **script L3017 (ramo "Dois produtos, escancarados"):** "Dois produtos, escancarados."

Varredura exaustiva do espaço do markup (ENA 55–130, passo 5; 16 valores): o ramo "Dois produtos" é atingido 0 vezes; ao baixar a ENA o script salta de "Ano bom" direto para "A seca venceu as duas" (ENA 75 já cai lá).

Decisão: registrado; defeito ou intenção da fonte não decidido aqui.

### `div-m03-inst-03-ramos-inalcancaveis` — Ramos de leitura nunca atingidos no espaço de entrada declarado

- **INST · 04 script L3017 (} else if(fioMin / FIO_CAP < 0.25){):** "Dois produtos, escancarados."
- **INST · 05 script L3056 (if(exc > 1){):** "verd.innerHTML = "<b>Sobra estrutural: " + fb(exc,0) + " GWh sem destino no meio-dia.</b> O resíduo bate em zero — preço"
- **INST · 06 script L3166 (if(deficit > 0){):** "verd.innerHTML = "<b>Déficit de " + g(deficit) + " GW: a pilha acabou.</b> Toda a oferta despachada — incluindo GNL a R$"
- **INST · 06 script L3172 (} else if(cmo > 900){):** "verd.innerHTML = "<b>CMO de R$ " + fb(cmo,0) + "/MWh: território de crise.</b> Marginal = " + marg.name + ". É o desenho"

Medido executando o script original sobre todas as combinações min/max/step do markup. Um ramo inalcançável é texto da fonte que o learner nunca vê no instrumento original.

Decisão: registrado.

## Lacunas (a fonte não tem)

- **Pergunta própria:** nenhum dos 9 instrumentos tem. A pergunta do § MAP é da aula. Uma pergunta de previsão seria da camada Alexandria (P3/P11, P19).
- **Fonte dos números:** nenhuma constante do script traz fonte por valor. As notas declaram o estatuto em prosa ("Didático", "número vivo", "ilustrativos em ordem de grandeza", "inspirados em EPE / Lazard LCOE+"). Na interface vale a formulação do P19: cenário didático, fonte externa dos valores não declarada.
- **Tolerâncias, previsão e gabarito:** não declarados para nenhum instrumento (P6).
- **Rótulo das fileiras de pílulas e chaves (INST · 01, 08, 09):** a fonte não rotula. O código inventou "Seleção" e "Ligada/Desligada".
- **Desenhos (INST · 01, 03, 05, 06, 09):** SVG ou pilha HTML gerados pelo script, não portáveis como valor (§12).

## Verificação

- **Literalidade:** 1266 strings de conteúdo dos três JSONs conferidas contra a fonte, com 0 falhas. Leituras de divergência: 47 conferidas, 0 não literais.
- **Origens:** 378 `origem` localizadas a até 3 linhas, com 0 falhas.
- **Recontagem independente:** 9 `instrument-id` na fonte, 9 extraídos.
- **Espaço de entrada:** coberto por inteiro. Todos os campos numéricos têm deslizador gêmeo com a mesma faixa, então o espaço é o do `input number`.

### Verificação adversarial (2026-09-17)

Verificador externo, com parse e varredura próprios (sem reusar `lib.mjs` nem `m03_verificar.mjs`):
- **Script verbatim, 100%:** as 10 linhas de helpers e as linhas de todos os 9 IIFEs conferem byte a byte com a fonte; cada intervalo começa logo após o comentário `INSTRUMENT NN` e termina em `})();`.
- **Ramos:** as 31 linhas com atribuição ao veredito, achadas por grep próprio, coincidem com `ramos_de_leitura` (9 instrumentos).
- **Entradas:** `value`, `min`, `max` e `step` de todos os `input number` conferem com o markup.
- **Inalcançáveis, re-executados:** INST · 04 (16 valores de ENA: 11 "Ano bom", 5 "A seca venceu", 0 "Dois produtos"); INST · 05 (493 combinações: 370 "Rampa pesada", 123 "Dia administrável", 0 "Sobra estrutural"); INST · 06 (66 × 60 × 3 opções de gás = 11.880: 1.800 "Sobra renovável", 2.820 "Ponta térmica", 7.260 "Margem", 0 "Déficit", 0 "território de crise"). Batem com a `cobertura` declarada.
- **FCap do fio d'água no cenário-padrão do INST · 04:** 63 %, confirmado (`i04-fcfio`).
- **Código:** confirmados os rótulos inventados "Seleção" (i01-pills, i08-pills) e "Ligada/Desligada" (i09-checks-*) e a saída extra `i08-cappct`.
- **Correção nesta rodada (reflete aqui):** a contagem de leituras de divergência passou de 44 para 47 porque a leitura não literal "INST·07 (script) e Ex·08" de `div-m03-ap-04-perda-bateria` virou três leituras literais, e o `m03_verificar.mjs` perdeu a exceção que a tirava da checagem. Detalhes em `aparato.md`.
