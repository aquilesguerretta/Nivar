# M01·A07: Triângulo de potência e fator de potência

Arquivo de dados: [`aula-07.json`](aula-07.json). Gerador: [`extratores/gen-aula07.mjs`](extratores/gen-aula07.mjs). Verificador: [`extratores/verify-aula07.mjs`](extratores/verify-aula07.mjs).

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A aula ocupa as linhas 1898 (comentário) e 1900 a 2001 (`section.aula`). O script do INST·05 está nas linhas 2858 a 2932 (63 linhas não vazias, todas literais no JSON).
- **Como foi extraído:** um script node caminha as linhas da section e **lança erro diante de qualquer linha que não reconheça**, então nada é descartado em silêncio. Nenhuma prosa foi digitada. O campo `html` guarda o innerHTML literal. O campo `texto` guarda o mesmo conteúdo sem tags.
- **Cobertura por token (§5):** 623 de 623 tokens casados (**100%**), sem contar o markup do instrumento (linhas 1950 a 1973). A figura `triangle-vis` **não** está dentro do instrumento, então entra no denominador e no extraído.
- **Posição na fonte, na ordem:** parágrafo de 7.2 (L1915), figura `triangle-vis` (L1917–1948), INST·05 (L1950–1973), h3 7.3 (L1975).

## Pendente de decisão do Founder: QA-M01-A07

**Não corrigido nesta extração e sem frase substituta.** A frase fica como está na fonte. As duas leituras:

**Leitura A, a frase (7.3, linha 1981, verbatim):**

> Um FP de 0,85 significa que apenas 85% da potência aparente vira trabalho útil; os outros 15% são reativos circulando pela rede.

**Leitura B, os números da própria Aula 07 (verbatim):**

| O que | Valor na fonte | Linha |
|---|---|---|
| Pot. ativa | 800 kW | 1942 |
| Pot. reativa | 480 kVAr | 1943 |
| Pot. aparente | 933 kVA | 1944 |
| Fator de potência | 0,86 | 1945 |
| Ângulo φ | 31,0° | 1946 |
| Fórmula | `FP = kW ÷ kVA = cos φ` | 1977 |
| Triângulo | "As três potências formam um triângulo retângulo:" (L1915), com catetos kW e kVAr e hipotenusa kVA no SVG (L1929–1931, 1935–1937) | 1915 |

No cenário-padrão da aula, 480 kVAr sobre 933 kVA. O reativo **não** é 14% da aparente (nem 15%). A relação kVA² = kW² + kVAr² é a mesma da A02 (L1578, "kW e kVAr são os catetos, kVA é a hipotenusa") e a do quiz Q07 (L3122).

**Aritmética derivada, não está na fonte (só para o Founder ler os dois lados):** 480 ÷ 933 ≈ 0,514. Com FP = 0,85 e kVA = 100, kW = 85 e kVAr = √(100² − 85²) ≈ 52,7. O complemento de 0,85 é 0,15, mas esse número é o complemento do FP, e a fonte o chama de "reativos".

Registro no JSON: `divergencias[0]` (DIV-01), com `status: "PENDENTE DE DECISÃO DO FOUNDER"` e a chave `derivado`.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `meta` | Fonte, linhas, método, convenções |
| `aula` | Marcador ("Aula 07 · Triângulo de potência e fator de potência"), h2 e a pergunta do § MAP (L1345): "Por que existe energia que ocupa a rede mas não vira produção?". Duração, dificuldade e vídeo são `null` |
| `blocos[]` | 19 blocos na ordem da fonte (tabela abaixo). Cada um com `origem {seletor, trecho_inicial, linha_aprox}` |
| `figuras[]` | `m01-a07-fig-01`, `div.triangle-vis`: 11 elementos SVG (cada um com a linha literal) e 5 leituras |
| `instrumentos[0]` | INST·05, com a camada de script completa |
| `exercicios[0]` | Ex·05 |
| `relacionados_nao_vinculados[]` | Quiz Q06 e Q07, 2 itens do checklist final |
| `remissoes_de_outras_partes[]` | 1: a A02 (L1578) promete a A07 |
| `termos_lexico` | 14 candidatos por correspondência textual (ver abaixo) |
| `divergencias[]` | 5 divergências da fonte (DIV-01 a DIV-05) |
| `comparacao_codigo` | Verificações programáticas e 11 divergências com o código (COD-01 a COD-11) |
| `contagens` | Totais |

## Blocos

19 blocos: lead 1, título 5, parágrafo 8, figura 1, instrumento 1, fórmula 1, destaque 2. Não há tabela, lista nem "Vale lembrar".

| Bloco | Linha | O que |
|---|---|---|
| b01 lead | 1905 | "Esta aula é o coração técnico do módulo…" |
| b02 título | 1907 | 7.1 Por que existe potência reativa |
| b03–b05 parágrafos | 1908, 1910, 1912 | resistivos × indutivos × "Essa parcela é a potência reativa (kVAr)…" |
| b06 título | 1914 | 7.2 O triângulo de potência |
| b07 parágrafo | 1915 | "As três potências formam um triângulo retângulo:" |
| b08 figura | 1917–1948 | `triangle-vis` (SVG + 5 leituras) |
| b09 instrumento | 1950–1973 | INST·05 "Controles · Triângulo de potência" |
| b10 título | 1975 | 7.3 A fórmula do fator de potência |
| b11 fórmula | 1976–1979 | `FP = kW ÷ kVA = cos φ`, com `desc` "φ é o ângulo entre tensão e corrente em regime senoidal" |
| b12 parágrafo | 1981 | FP 1,00 e **FP 0,85** (a frase do QA) |
| b13 título | 1983 | 7.4 Por que isso vira cobrança regulatória |
| b14–b15 parágrafos | 1984, 1986 | externalidades; referência 0,92 e UFER |
| b16 destaque | 1988–1991 | "Referência regulatória" (callout neutro) |
| b17 título | 1993 | 7.5 A solução clássica: banco de capacitores |
| b18 parágrafo | 1994 | banco de capacitores |
| b19 destaque | 1996–1999 | "Cuidado · diagnóstico antes de solução" (`callout red`) |

## Figura `triangle-vis` (`m01-a07-fig-01`)

- **Fora do instrumento.** É irmã do `div.instrument`, e vem antes dele.
- **SVG** `viewBox 0 0 320 280`, com rótulos `kW`, `kVAr`, `kVA` e `φ`. Os catetos são `#tri-kw` e `#tri-kvar`, a hipotenusa é `#tri-kva`, e o arco do ângulo é `#tri-angle`. Não há eixo numerado.
- **5 leituras** (L1942–1946), com valores iniciais da marcação: 800 kW, 480 kVAr, 933 kVA, 0,86 e 31,0°.
- **Título e fonte citada:** `null`. A figura não tem título, legenda nem fonte.

## INST·05: resumo da especificação

- **Título:** "Controles · Triângulo de potência". Id na fonte: "INST · 05". Taxonomia: `controles`.
- **Pergunta:** `null`. Não há pergunta própria. A pergunta da aula está no § MAP (L1345).
- **Entradas** (cada uma é um campo numérico e um deslizador gêmeos, com faixas diferentes):

  | Id | Rótulo | Unidade | Padrão | Número: mín. / passo | Deslizador: faixa / passo |
  |---|---|---|---|---|---|
  | `i05-kw` | Potência ativa | kW | 800 | 0 / 50 | 100–1500 / 10 |
  | `i05-kvar` | Potência reativa | kVAr | 480 | 0 / 20 | 0–1200 / 10 |

  O campo numérico não tem `max`.
- **Saídas dentro do instrumento:** nenhuma. As 5 leituras estão na figura.
- **Texto de leitura:** estático (`div.instrument-note`, sem id): "Reduza a potência reativa e veja o fator de potência subir. Esse é o efeito esperado de um banco de capacitores bem dimensionado: menos kVAr → mais FP → menos cobrança regulatória → menos kVA exigido da rede."
- **Script** (L2858–2932):
  - `kva = Math.sqrt(kw*kw + kvar*kvar)`; `fp = kva > 0 ? kw / kva : 1`; `angleRad = Math.atan2(kvar, kw)`.
  - Coerção `parseFloat(...) || 0` (resíduo do original, sinalizado, não corrigido).
  - Formatação: kW, kVAr e kVA com 0 casa; FP com exatamente 2 casas; ângulo com exatamente 1 casa.
  - **Semáforo de cor** no readout do FP, pelo valor não arredondado: `fp >= 0.92` → `green`; `fp >= 0.85` → `gold`; senão `red`. Não há texto de veredito nesses ramos.
  - `render()` roda no carregamento e sobrescreve a marcação.
- **Cenário-padrão** (800 / 480): executando a mesma lógica, as 5 leituras coincidem com as da marcação. O ramo ativo é `else if (fp >= 0.85)` (FP bruto 0,8575, classe `gold`).
- **Fonte dos números:** `null`. **Tolerâncias:** `null`.
- **A prosa não invoca o instrumento por nome.** O parágrafo de 7.2 termina em dois-pontos e a figura e o instrumento vêm em seguida.

## Ex·05 (vinculado: tag "Ex · 05 · Aula 07")

- **Enunciado:** "Uma instalação industrial usa **900 kW de potência ativa** e exige **1.000 kVA** de potência aparente. Qual o fator de potência? Está dentro do esperado para Grupo A? Qual cuidado antes de recomendar solução?"
- **Gabarito:** `900 ÷ 1.000 = 0,90`, "abaixo da referência prática de 0,92 para Grupo A — alerta", e o cuidado é não recomendar banco de capacitores automaticamente (texto completo, literal, no JSON).
- Sem critério próprio. A varredura das 8 tags do § Drill acha uma só com "Aula 07".

## Relacionados, sem vínculo declarado

- **Quiz Q06** (L3113): "No Brasil, fator de potência mínimo de referência regulatória para Grupo A é:", correta 0,92.
- **Quiz Q07** (L3119): "Qual a relação correta entre as três potências em um triângulo de potência?", correta `kVA² = kW² + kVAr²`.
- **Checklist final** (L2506): "Desenhar o triângulo kW, kVAr, kVA e identificar cada lado." (L2507): "Calcular fator de potência e explicar por que abaixo de 0,92 pode virar cobrança."

## Termos do léxico (candidatos por texto, não posse)

A fonte não declara aula por termo. Ler a frase antes de ligar (§2).

| Termo | Ocorrências | Leitura da frase |
|---|---|---|
| Fator de potência (FP) | 7 + 9 (sigla) | o conceito do verbete |
| kW, kVA, kVAr | 5, 5, 5 | o conceito, na figura, no instrumento e na fórmula |
| Banco de capacitores | 5 | o conceito (7.5 e o instrument-note) |
| UFER | 1 | o conceito (7.4) |
| Grupo A | 2 | o conceito (lead e 7.4) |
| Harmônicos | 2 | o conceito (callout 7.4 e callout red) |
| PRODIST | 1 | o conceito (callout 7.4) |
| REN ANEEL 1.000/2021 | 2 | o verbete tem outro nome; a aula diz "Resolução Normativa ANEEL nº 1.000/2021" (casou pelo identificador numérico) |
| Tensão | 4 | o conceito (7.1 e 7.3) |
| Potência | 23 | **quase só composto** ("potência reativa", "fator de potência", "triângulo de potência"); o verbete é a taxa instantânea |
| Energia | 2 | "Existe energia que ocupa a rede" (h2, uso solto) e "Energia Reativa" (nome do UFER): não é o conceito kWh = kW × h |
| Eficiência | 1 | "indicador de eficiência elétrica" (lead), uso solto |

## Divergências na fonte (sem escolha)

- **DIV-01 (QA-M01-A07), pendente de decisão do Founder.** Ver a seção própria acima.
- **DIV-02.** O script usa dois limiares de FP (0,92 e 0,85), mas a prosa de 7.4 só nomeia o 0,92 como referência. O 0,85 do ramo `gold` não tem procedência declarada.
- **DIV-03.** O 0,92 é "fator de potência mínimo de referência" da regulação (7.4), "referência prática" no gabarito do Ex·05, "mínimo de referência regulatória" no quiz Q06 e "Referência prática regulatória brasileira" no léxico.
- **DIV-04.** Campos gêmeos com faixas diferentes (Q07 do DECIDIR): número min 0, passo 50 e 20, sem max; deslizador 100–1500 e 0–1200, passo 10. O script copia um valor no outro. Um valor digitado abaixo do mínimo do deslizador (kW < 100) é clampado pelo deslizador, e `render()` lê o campo numérico.
- **DIV-05.** O desenho e a leitura usam escalas diferentes. kW: 200 px para 1500 kW. kVAr: 170 px (0,85 × 200) para 1200 kVAr. O ângulo exibido sai de `atan2(kVAr, kW)` sobre os valores, e não sobre os pixels. *Derivado:* no cenário-padrão, o ângulo lido é 30,96° e o desenhado é 32,52°. A geometria estática da marcação (antes de `render()` rodar) tem `tri-kw` até x=240 e `tri-kvar` até y=120.

## Divergências em relação ao código portado

Código: `src/lib/data/alexandria-modulo-01-content.ts`, chaves `aula-01-07` (corpo, lead, entrada em `MODULO_01_AULAS`) e `inst-05`, mais `alexandria-instrument-calculators.ts` (`inst-05`).

| Id | Gravidade | Resumo |
|---|---|---|
| COD-01 | alta | A figura `triangle-vis` (SVG + 5 leituras) não existe no corpo. O parágrafo de 7.2 termina em ":" e o bloco seguinte já é o título 7.3 |
| COD-02 | alta | O instrumento é renderizado depois da apostila inteira (`aula.instruments`), e não depois da figura e antes de 7.3. Viola C5 e a Regra-mãe 1 |
| COD-03 | alta | `inst-05.outputs: []`. As 5 leituras não estão no objeto. O desenho depende de `InstrumentPanel.tsx` (`ehDiagrama`, por id). Deduzido da leitura do código, não medido na tela |
| COD-04 | alta | Os 3 textos de veredito do calculador `inst-05` ("FP dentro do mínimo regulatório de 0,92." etc.) **não existem no HTML**: a fonte só troca a cor do readout. Conferido por substring, 3 ausentes |
| COD-05 | média | A fórmula de 7.3 foi portada com `desc: null`. A fonte tem "φ é o ângulo entre tensão e corrente em regime senoidal" |
| COD-06 | média | Os dois callouts viraram `nota {label: null, html: rótulo}` + parágrafo solto ("Referência regulatória" e "Cuidado · diagnóstico antes de solução", este com `tom: red`). Na fonte o texto é o rótulo e o parágrafo é o corpo |
| COD-07 | média | O corpo do callout red não é verbatim: a fonte diz "A linguagem GridAlpha correta é…" e o código diz "NIVAR". Troca editorial (P24) |
| COD-08 | média | Os campos viraram só `range` (100–1500 e 0–1200, passo 10). Os parâmetros do campo numérico (min 0, passo 50 e 20, sem max) se perderam |
| COD-09 | baixa | `points: 1` no Ex·05 não tem origem na fonte |
| COD-10 | baixa | `aulaIds` do glossário ligam 13 verbetes à `aula-01-07`: derivação do código, não da fonte. Conferido contra os candidatos textuais; nenhum ligado fica sem ocorrência, e "Eficiência" tem ocorrência sem ligação (uso solto) |
| COD-11 | info | Ids: `inst-05` / `ex-05` / `aula-01-07` equivalem a `m01-inst-05` / `m01-ex-05` / `m01-a07` |

**Medido e sem divergência:** nenhum `</span>` órfão no corpo de `aula-01-07` (0). Não há lista `<ul>` nesta aula (medido: 0), então os "Veja:" e "Logo:" não valem aqui.

**O que está conforme:**
- Lead e os 8 parágrafos verbatim, inclusive o de 7.3 com a frase do QA, preservada como está na fonte.
- Títulos 7.1 a 7.5 com número e texto corretos.
- Título do INST·05, texto do `instrument-note`, ids, rótulos, unidades e padrões (800 / 480) dos 2 campos.
- Ex·05: tag, enunciado e gabarito verbatim.

## Lacunas (a fonte não tem)

- Pergunta própria do instrumento, previsão, meta, tolerância e gabarito do instrumento.
- Procedência do cenário-padrão (800 kW / 480 kVAr) e do limiar 0,85.
- Título, legenda e fonte citada da figura.
- Duração, dificuldade, vídeo, imagem e referência por aula.
- Texto de veredito para as cores do FP.

## Verificação

`node extratores/gen-aula07.mjs` e depois `node extratores/verify-aula07.mjs`. O verificador prova por substring contra o HTML, confere a `origem` com ±3 linhas e recalcula a cobertura por token só a partir do JSON. Teste negativo feito: uma palavra trocada (`resistivos` por `resistivas`) e uma linha deslocada em 9 fazem o verificador falhar e sair com código 1.
