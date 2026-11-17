# Extração da camada fonte — índice dos 17 módulos

Este índice reúne a extração literal (camada **fonte**) dos 17 HTMLs de `C:/dev/GridAlpha v2/Alexandria modulos/`,
lidos só para leitura. Em cada pasta `mNN/`, o texto é verbatim e traz a origem (linha ±3). As contradições ficam
registradas com as duas leituras e **nenhuma foi resolvida**. As decisões P17–P24
([`../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../decisoes/2026-09-16-ambiguidades-de-conteudo.md)) valem só
na camada Alexandria (produto).

**Fontes deste índice** (estado de 2026-09-17, 05:10):
- o `README.md` e os `.md` de cada módulo (`modulo.md`, `aparato.md`, `instrumentos.md`; no M01, `aula-08.md`),
  inclusive as seções "Verificação" de todas as passadas;
- os resultados dos extratores e verificadores de cada pasta;
- uma contagem direta, com `grep`, de "GridAlpha", "War Room", "Trava N" e "Cobaia" nos 17 HTMLs.

Esta versão substitui a das 03:50, que era anterior às últimas passadas de M02, M06–M09 e M11–M17. Nenhum outro
arquivo foi alterado.

## 1. Arquivos por módulo

Todos os módulos têm `README.md`, `modulo.json`/`.md`, `aparato.json`/`.md` e `extratores/`. As diferenças são estas:

| Módulo | Título (catálogo canônico) | Arquivos além do núcleo | Observação |
|---|---|---|---|
| [M01](m01/README.md) | Física de Energia e Eletricidade | `aula-08.json`/`.md` | **Não tem `instrumentos.json`.** Só foram extraídos o INST·06 (na aula 08) e o LAB·01 (em `modulo`) |
| [M02](m02/README.md) | Como Funciona uma Rede Elétrica | `instrumentos.*`, `verificacao.json` | `m02_instrumentos.mjs` varre 689.556 combinações (cerca de 1 min 30 s) |
| [M03](m03/README.md) | Tecnologias de Geração | `instrumentos.*`, `verificacao.json` | `m03_verificar.mjs` é independente de `lib.mjs` |
| [M04](m04/README.md) | Economia de Mercados de Energia | `instrumentos.*` | Extrator em Python. O harness fica em `extratores/m04_harness_saida.json` |
| [M05](m05/README.md) | Regulação e Desenho de Mercados | `instrumentos.*`, `verificacao.json` | `aparato.md` foi escrito à mão |
| [M06](m06/README.md) | História do Setor Elétrico Brasileiro | `instrumentos.*` | `m06_instrumentos` roda o script original 43 mil vezes |
| [M07](m07/README.md) | Estrutura Institucional do Setor Elétrico Brasileiro | `instrumentos.*` | Logs `verificacao*.log.json` em `extratores/` |
| [M08](m08/README.md) | Matriz Elétrica Brasileira em Profundidade | `instrumentos.*` | `verificacao*.json` em `extratores/` |
| [M09](m09/README.md) | Os Mercados ACR e ACL em Profundidade | `instrumentos.*` | Resultado em `extratores/verify-resultado.json` |
| [M10](m10/README.md) | Tarifas e a Conta de Luz Industrial | `instrumentos.*` | Resultado em `extratores/verify-report.json` |
| [M11](m11/README.md) | Geração Distribuída e a Anatomia de uma Proposta Solar | `instrumentos.*` | Resultado em `extratores/verify-saida.txt` |
| [M12](m12/README.md) | Geopolítica Energética do Brasil | `instrumentos.*`, `verificacao.json` | — |
| [M13](m13/README.md) | Análise Financeira de Empresas e Projetos | `instrumentos.*` | Resultado em `extratores/verify-report.json` |
| [M14](m14/README.md) | Biocombustíveis e Bioenergia | `instrumentos.*` | Rodar `m14_md.mjs` depois de `m14_instrumentos.mjs`. Os 6 exercícios da Aula 08 foram acrescentados à mão (ver §8) |
| [M15](m15/README.md) | Petróleo, Gás e Petrobras | `instrumentos.*` | Resultado em `extratores/verify-m15.result.json` |
| [M16](m16/README.md) | Tendências e Disrupções | `instrumentos.*` | Resultados em `verify`, `verify-extra` e `coverage` (`*.result.json`) |
| [M17](m17/README.md) | Cenário Internacional Comparativo | `instrumentos.*` | Resultado em `extratores/verify-resultado.json` |

**Escopo comum.** Nenhum pacote extrai o corpo das aulas, exceto a aula 08 do M01. Nos outros módulos, as aulas
aparecem só como roteiro, lead, subseções, painéis "três níveis" e ponteiros. Se a Peça C precisar de outra aula,
falta o grupo `aula-NN`.

## 2. Contagens por módulo

As contagens vêm do markup da fonte, e não da prosa.
- **Instr.** soma instrumentos de aula e de módulo. No M01, são INST·01–06 mais o LAB·01.
- **Seções** é o roteiro de `section`: aulas mais aparatos (§00, §MAP e os demais).
- **Quiz** é o número de questões. Todas têm 4 alternativas.

| Módulo | Seções | Aulas | Instr. (de módulo) | Termos | Exercícios | Checklist | Quiz | Faixas do placar |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| M01 | 19 | 9 | 7 (LAB·01) | 38 | 8 | 16 | 10 | 4 |
| M02 | 20 | 10 | 9 (0) | 65 | 10 | 18 | 10 | 4 |
| M03 | 20 | 10 | 9 (0) | 63 | 10 | 18 | 10 | 4 |
| M04 | 17 | 7 | 7 (0) | 58 | 9 | 20 | 10 | 2 |
| M05 | 16 | 6 | 6 (0) | 72 | 10 | 21 | 10 | 2 |
| M06 | 16 | 6 | 8 (1) | 99 | 10 | 24 | 10 | 2 |
| M07 | 17 | 7 | 10 (1) | 118 | 12 | 26 | 10 | 2 |
| M08 | 17 | 7 | 11 (1) | 124 | 12 | 26 | 10 | 2 |
| M09 | 18 | 8 | 11 (1) | 136 | 14 | 28 | 10 | 2 |
| M10 | 19 | 9 | 11 (1) | 161 | 14 | 28 | 10 | 2 |
| M11 | 18 | 8 | 11 (1) | 150 | 14 | 28 | 10 | 2 |
| M12 | 18 | 8 | 11 (1) | 152 | 14 | 28 | 10 | 2 |
| M13 | 18 | 8 | 11 (1) | 180 | 14 | 28 | 10 | 2 |
| M14 | 18 | 8 | 10 (1) | 158 | 14 | 26 | 10 | 2 |
| M15 | 19 | 9 | 10 (1) | 174 | 15 | 28 | 10 | 2 |
| M16 | 21 | 10 | 11 (1) | 184 | 16 | 30 | 10 | 2 |
| M17 | 22 | 11 | 12 (1) | 192 | 18 | 30 | 10 | 2 |
| **Total** | **313** | **141** | **165** | **2.124** | **214** | **423** | **170** | |

**Exercícios fora da contagem**, porque não estão no §Ex/Drill:
- 6 exercícios nas fichas de rota da Aula 08 do M14;
- 6 fichas de elo "Preencha." do M15 (aulas 01 ×2, 05, 07 ×2 e 08);
- 6 perguntas implícitas nas fichas do M17.

**Gabarito do quiz** (anotado nas extrações):

| Módulo | Gabarito | Observação |
|---|---|---|
| M02 | BBBCBBBBCB | 8 B |
| M03 | — | B 5, C 4, A 1, nunca D |
| M04 | todas B (`a:1`) | 10 B |
| M05 | todas B (`a:1`) | 10 B |
| M06 | — | 9 B, 1 C |
| M08 | 0,1,2,3,1,3,0,1,2,3 | — |
| M10 | CADBCDABDC | — |
| M11 | CADBDACBDA | — |
| M12 | CADBDABCAD | — |
| M13 | DBABCBADCB | — |
| M14 | CADBDACBDC | — |
| M16 | — | A 3, B 2, C 3, D 2 |

## 3. Reconciliação com o preflight

O [`../preflight.md`](../preflight.md) §2 declara 141 aulas, 165 instrumentos, 2.124 termos, 313 seções,
214 exercícios e 423 itens de checklist. **As seis somas desta extração batem exatamente**, e não há diferença
numérica. As diferenças são de definição, de escopo e de estado no código:

| Item | Preflight | Extração | Explicação |
|---|---:|---:|---|
| Aulas | 141 | 141 | Em cada módulo, a contagem do markup concorda com a pill, o código (`AULAS_POR_BLOCO`) e o catálogo. O P8 não tem conflito em nenhum módulo. |
| Instrumentos | 165 | 165 | O M01 conta 7: INST·01–06 mais o LAB·01. **No código há 111 objetos** (preflight): os 110 instrumentos de M01–M08, M10–M12 e M15, e mais um porque o INST·04 do M08 virou dois ids (`-cap`/`-ger`). Os **55** de M09, M13, M14, M16 e M17 não têm porte, mas **agora estão extraídos**. Os INST·01–05 do M01 existem no código, mas não têm extração de camada fonte (não há `instrumentos.json` no M01). |
| Termos | 2.124 | 2.124 | É a soma do markup (`span.term`/`glossary-item`). No M01, a prosa diz "Vinte e oito", mas o markup tem 38, e vale 38 (P22). O código tem **637** verbetes (M01–M08, todos idênticos à fonte), e faltam **1.487** (M09–M17). A soma 637 + 1.487 = 2.124 fecha. |
| Seções | 313 | 313 | São as `section` do roteiro (aulas e aparatos). O M10 conta §00 e §MAP como "aparato" em `modulo.json` (10 + 9 = 19), e o README dele fala em "8 de aparato + §00 + §MAP". A soma é a mesma. |
| Exercícios | 214 | 214 | Conta só os exercícios do §Ex/Drill. Os 18 exercícios embutidos da §2 ficam de fora. No M02, a prosa diz "Oito exercícios", mas o markup tem 10, e vale 10. **O preflight registra 215 atividades no código.** Nenhum pacote compara o total de exercícios do código, e a atividade a mais não foi localizada. Isso fica em aberto (§8). |
| Checklist final | 423 | 423 | São os `li` do §Final. No M01, no M02 e no M03, alguns itens também viraram badge no código (3 no M02 e 3 no M03), o que não altera a contagem. |
| Quiz | — | 170 | O preflight não dá total. São 17 × 10 questões, todas fora de `src/lib/data`. |

**Exercícios no código que nenhuma tela mostra.** O preflight conta **119**, os exercícios de M10–M17
(14 + 14 + 14 + 14 + 14 + 15 + 16 + 18). `RecursosDoModulo.tsx` só registra até `modulo-09`, e os READMEs de M10, M11,
M13, M14, M15, M16 e M17 confirmam isso. O README do M12 não mede esse ponto.

**O que o preflight listava como "ainda não extraído" e agora existe:**
- quiz, caso, checklist final, erros, voz e referências dos 17 módulos;
- os 55 instrumentos de M09, M13, M14, M16 e M17;
- os glossários de M09–M17.

## 4. Verificação e estado no código

**Veredito.** É o estado final depois das passadas adversariais independentes de 2026-09-16/17.
- **corrigido:** alguma passada achou e corrigiu defeitos da extração (origem, completude, leitura não literal,
  contagem em `.md`).
- **ok:** a passada não precisou corrigir nada.

Nenhum módulo ficou com falha aberta.

| Módulo | Verificação automática (strings / origens, 0 falhas) | Passadas adversariais e veredito | Instrumentos não portados (status dos demais) | Termos ausentes do código |
|---|---|---|---|---|
| M01 | modulo 276 strings; aula-08 62 checagens; aparato 165 checagens | 1 (09-16): **corrigido**. Modulo: 2 origens e o `html` do rodapé. Aula-08: 4 erros (total de linhas, DIV-01, DIV-05, COD-06). Aparato: 5 (colofão não verbatim, rótulos de interface, botão de gabarito, nota do placar, linhas) | 0 dos 2 comparados: INST·06 e LAB·01 divergentes. INST·01–05 não comparados | 0 de 38 |
| M02 | 1.604 / 378; cobertura por token de 100% | 2: **corrigido** nas duas. 1ª: 2 origens (`div-m02-04`, `div-m02-09`). 2ª (2.180 itens): origens do hero, cabeçalho e rodapé 1 linha cedo, seletor do rodapé e `nota_p18` | **1** (INST·01: tabela e nota não portadas). 1 portado, 7 divergentes | 0 de 65 |
| M03 | 1.266 / 378; 47 leituras de divergência | 2: **corrigido** nas duas. 1ª: leitura não literal em `div-m03-ap-04` (44 → 47 leituras), campos de horas fora de ordem. 2ª (1.266): `nota_literal` nos prefixos do placar | 0. 9 divergentes (cálculo idêntico em 100%) | 0 de 63 |
| M04 | 1.307 / 0 fora de ±3; harness de 38.200 casos com 0 vereditos divergentes | 2: **corrigido** nas duas. 1ª (2.500 strings): Q10 reclassificada (não é contradição). 2ª (2.757): contagem de `div.box` de corpo, de 8 para 6, nos 4 `.md` | 0. 7 divergentes | 0 de 58 |
| M05 | 2.227 checagens | 2. 1ª: **corrigido** (linhas de "Bloco 5" em `div-m05-mod-02`). 2ª (1.967): **ok**, sem correções | 0. 6 divergentes (INST·01 com bug de id) | 0 de 72 |
| M06 | 504 + 796 + 565 strings; 552 origens (249 + 226 + 77) | 2: **corrigido** nas duas. 1ª: rótulo dos critérios no README. 2ª (1.300): `trecho_inicial` em 2 origens, linhas de "Bloco N" (+L867, L1454, L1505), resíduos do original 6 → 7, origens 560 → 552 | 0. 5 portados, 3 divergentes (01, 05, 07) | 0 de 99 |
| M07 | 538 + 1.136 + 1.843 strings; 196 + 312 + 132 origens; passada estrita de 751 + 1.309 + 2.559 | 2 adversariais (3ª e 5ª passadas) mais 2 de reprodução: **corrigido**. 3ª: origem de 11 itens de `etapas_barras`. 5ª: 4 ramos "Regime" do Inst 04 (42 → 46) e retornos Q02, Q05–Q08 na divergência do quiz | 0. 10 divergentes | 0 de 118 |
| M08 | 493 + 1.075 + 146 strings; 167 + 337 + 93 origens; 240.174 casos diferenciais | 2: **corrigido** nas duas. 1ª: catálogo citado com uma linha a menos (`mod-div-04`/`05`). 2ª: 4 rótulos estáticos (`rotulos_estaticos[]`) dos INST 02 e 08 | 0. 3 portados, 8 divergentes | 0 de 124 |
| M09 | 1.032 + 1.318 + 683 strings; 255 + 267 + 57 origens | 2. 1ª: **ok**. 2ª (604 origens): **corrigido**, 2 leituras de divergência em `modulo` (`div-m09-caso-parte`, `div-m09-badge-pld`) | **11** (nenhum portado) | **136** |
| M10 | 578 + 1.245 + 927 strings; 131 + 284 + 124 origens | 2. 1ª: **corrigido** (origem das 2 mensagens do placar; texto dos Inst · 08/10). 2ª (533 origens): **ok** | 0. 1 portado, 10 divergentes | **161** |
| M11 | 386 + 1.093 + 118 strings; 156 + 266 + 60 origens | 2: **corrigido** nas duas. 1ª: 2 divergências reclassificadas como informativas. 2ª (482 origens): 2 notas (`horas_nota`, `resultado_esperado.nota`) | 0. 11 divergentes (textos iguais em 3.387 casos) | **150** |
| M12 | 2.871 / 519 | 2: **corrigido** nas duas. 1ª: `div-m-14` removida por ser inventada, links encurtados 3 → 2, nota da `div-m-03`. 2ª (2.398 strings): 3 leituras tornadas literais (`div-m-10`, `div-a-07`, `div-a-08`) | 0. 4 portados, 7 divergentes (07 e 08 com veredito inventado) | **152** |
| M13 | 3.489 / 614 | 2: **corrigido** nas duas. 1ª (4.741 strings): caixas "Números vivos" 8 → 5, aviso `codigo_verbatim`. 2ª: nota de "marca morta" (Energy Brief) e "9 caixas" → 8 no README | **11** (nenhum portado) | **180** |
| M14 | 1.951 / 431; 25 checagens exatas | **Só 1**: **corrigido**. `trecho_inicial` antes do INST·02; registro dos 6 exercícios embutidos da Aula 08; verificação regerada (1.937 → 1.951 strings, 424 → 431 origens) | **10** (nenhum portado) | **158** |
| M15 | 691 + 1.538 + 504 strings; 558 origens; 1.549 casos de fidelidade | 2. 1ª: **corrigido** (blocos P7 9 → 10, origem de `cl-gr2`, templates de painel, 4141 → 4140 linhas). 2ª (548 origens): **ok** | 0. 3 portados, 7 divergentes | **174** |
| M16 | 578 + 1.058 + 124 strings; 270 + 340 + 92 origens; 783 linhas de script; `verify-extra` e `coverage` | **Só 1** (3.411 strings, 863 origens): **corrigido**. Só no README: 22 entradas de divergência, 19 efetivas | **11** (nenhum portado) | **184** |
| M17 | 2.300 / 427; 372 fragmentos de veredito | 2. 1ª: **corrigido** (mensagens do placar eram a classe CSS, "7 → 8 blocos", `div-m17-inst-10`, `calculadoras_com_m17`). 2ª (1.993 campos): **ok** | **12** (nenhum portado) | **192** |

**Totais.**
- **Instrumentos sem nenhum porte:** 55 (11 + 11 + 10 + 11 + 12). O INST·01 do M02 também está marcado
  "não portado", embora o objeto exista.
- **Termos ausentes do código:** 1.487.
- **Módulos com uma só passada adversarial:** M01, M14 e M16. Os outros 14 têm duas ou mais.

**Ausências no código comuns a todos os módulos.** Estes itens só existem no HTML:
- caso, quiz e checklist final (salvo os badges de M01, M02 e M03);
- §Voz, §Erros, tese, cartões do §MAP e referências.

**Outros problemas de código recorrentes:**
- `points` (1 ou 10) sem origem na fonte;
- espaço antes da pontuação, resíduo de tag inline, no lead (M04, M06, M08, M10, M12, M13) ou no gabarito
  (M04, M06, M07);
- `</b>` órfão (M01, M04, M08);
- no M09, os 14 exercícios têm o mesmo id (`m09-ex-null`).

## 5. Principais divergências por módulo

Estes padrões aparecem em quase todos os módulos e não se repetem na tabela:
- o critério de domínio aparece em várias formas (P18);
- o caso "Operação A — Parte NN" é numerado do M02 ao M17 e não tem partes no M01 (P17);
- a marca GridAlpha aparece no texto (P24; ver §7);
- há blocos "Onde isso entra no produto" (P7);
- instrumentos não têm pergunta, fonte dos números nem tolerância (P19);
- exercícios são soltos (P9);
- nenhum item de aparato declara vínculo com aula.

| Módulo | Principais divergências (detalhe no README do módulo) |
|---|---|
| M01 | O placar do script contradiz o 8/10: com 7 acertos manda avançar. "Trava 3" × "Trava 4". Léxico: prosa 28 × markup 38. A sigla FC tem dois sentidos (P21). Faixas do INST·06 × figura cf-chart. LAB·01: markup R$ 1.800 × script R$ 3.200. No código, falta a figura cf-chart (COD-01) e o instrumento vem depois da apostila (COD-02). |
| M02 | Critério em 5 formas, e o placar diz "avance" com 7. "Oito exercícios", mas há 10 (o catálogo também diz 8). A numeração INST·NN não bate com os ids. **Os 18 painéis "três níveis" faltam no código.** Os vereditos de 6 instrumentos são paráfrase sem interpolação. O gabarito do Ex·07 está truncado (170 de 969 caracteres). "Bloco 5/9" pode não bater com o catálogo atual. |
| M03 | A perda do ciclo de bateria aparece com bases diferentes. O FCap do fio d'água é 40–55% na tabela e 63% no INST·04. Há 4 ramos de veredito inalcançáveis. Os 9 vereditos são paráfrase. INST·01 e 08 viraram select com o rótulo "Seleção". O próximo módulo se chama "Economia de Mercados" × "…de Energia". |
| M04 | O ramo "teto horário" do INST 01 é inalcançável (1.145.277 combinações). O título da Aula 04 difere entre o §MAP e o h2. O placar trava o §Voz. O código não tem 6 saídas textuais, as unidades de 9 readouts nem o comportamento de campo vazio (vira 0). No catálogo, falta "PPA" numa família. `MODULO_04_CORPO` tem 7 `</b>` órfãos. |
| M05 | **INST·01 com bug de id** (`i1` × `i1-n`): N = 0 sempre, 0 de 360 casos corretos. O INST·05 devolve um texto único que não existe na fonte (0 de 972 ramos). O código só tem o painel 0 dos explicadores em três níveis. O gabarito do quiz é sempre B: chutar B dá 10/10. "Em cinco deles há conta", mas só o Ex·04 tem cálculo. |
| M06 | O Inst 05 só tem o regime 0; o Inst 07 não tem os toggles. O "Nível final" do Inst 04 passa de 100%. O Inst 07 mostra "Elegível" para qualquer unidade de baixa tensão. "Cinco partes anteriores" enumera quatro lentes. `instrument-taxonomy.md` está desatualizado. O catálogo marca "completo". 9 das 10 respostas do quiz são B. |
| M07 | O §Ref diz "Vinte e cinco fontes", mas há 27. "Os seis módulos anteriores" enumera cinco. O código perdeu as 8 fichas institucionais (cobertura de 49–76% nas Aulas 01–06), e os exploradores guardam só a 1ª linha. O quiz aponta instrumentos de outras seções (Q02, Q03, Q05–Q08, Q10). A etapa b do Inst 04 tem dois nomes. No repositório, o título é "Estrutura Institucional Detalhada". |
| M08 | Ordem da pizza de geração: INST 02 × INST 04. Faixas de FCap divergentes (P20). O INST 04 aprova fora da tolerância. O quadrante do INST 08 corta em 100% da MLT, e o veredito em 70%. O código perdeu o único `div.form` (Aula 01) e tem 10 `</b>` órfãos. No repositório, o título é "Matriz Elétrica". |
| M09 | **Nenhum instrumento, termo ou aparato no código**, e os 14 exercícios têm o mesmo id. O readout do INST·02 está errado (3/4 × 4/3). "6 de cinco" no INST·05. Texto morto no INST·09. O critério de domínio é citado na Aula 08, mas não tem texto. "Quatro dos sete sinais", com só 2 na tabela. |
| M10 | Viés invertido no diagnóstico do Inst·09. Tempo dos três passos: "menos de um minuto" × "um minuto e meio" × 75 s. A árvore do Inst·11 foi reescrita no código (títulos inventados, `rt-score`). A distribuição dos exercícios é 4/4/4/2 no texto e 3/3/3 + 5 no markup. As horas 8–10 só existem no código. Cabeçalho do código: "359.726 bytes" (são caracteres). |
| M11 | Pontos de sincronização: "três" × dois. A divisão dos 30 minutos tem três leituras. O INST·04 com 1.000 kW exatos cai no ramo de 2,5% × 5%. Portaria Inmetro 140: 2022 × 2021. Teto da FV com bateria: 3 MW × 5 MW. **No repositório, o título é "Energia Solar e Análise de Propostas".** Os exercícios e o INST·01 não aparecem na tela. |
| M12 | Os vereditos dos INST·07 e 08 no código são inventados (cobertura de 38–45%). A intro do INST·02 diz "três campos", mas há 4. As fichas contam "de 4" e depois "de 6". "Seis categorias" × classe 0. As horas 4–5 e as gravuras `geo-*` não têm origem. A `div-m-14` (trilha) foi removida por ser inventada. |
| M13 | Taxa real: 8,7% × 8,64%. Tempo do critério: "uma hora" × 30 + 60 min. Riscos: "seis" × "oito" × sete termos. AXIA estatal × não estatal. A JV tem dois nomes. INST·05: "cinco" × 6. **Nenhum instrumento portado.** As fórmulas do código guardam HTML em campo de texto. |
| M14 | **O INST·07 mostra "1 TJ/ano"** (divisão extra por 1000; o Ex 08 implica 540 TJ). **INST·08:** a unidade gCO₂e/MJ é usada como %, e o resultado é 102.389 t × 116.050 t. "Cinco camadas", mas a tabela tem 6. "Caso da família" num caso de mineração. Rodapé "Trilha 2 · Bloco 14" × "Nível 3". As horas (2) só existem no código. |
| M15 | Os nove elos do §MAP × os do INST·01 ("natureza do preço": 4 grupos × 9 valores). Refinaria: 1.800 mil bpd × cerca de 2,5 milhões implícitos (P20). IRR 146,6% × 147,03%. No INST·09, a porta publica negativo onde a fonte mostra "—". Rótulo com `&amp;` cru. "Oito tópicos" × 9 aulas. Falta a MP nº 1.363/2026 no §Ref. |
| M16 | Estágio da medição avançada: "implantação inicial" × "não construído". O §Erros promete "a pergunta que o evita", que não existe. O §Ex diz "gabarito fechado", mas o `details` abre. Ortografia mantida literal ("prórroga" ×15 etc.). O catálogo descreve o hero antes do `setTxt()`. São 19 divergências efetivas (22 entradas). |
| M17 | O teto do leilão de capacidade é aritmeticamente falso (229,72 < 325; P20). "Aula 08" × "Aula 09" para quem separa os números. "Quinze" × 13 assinaturas exclusivas. Régua "Regulamentado" × "regulado e não construído". O INST·12 mostra entidades como texto. O catálogo diz "sete campos" e lista oito. O código perdeu os rótulos dos 6 blocos "três níveis" e a grade `#jg-us`. |

## 6. Contradições para CONTENT QA (P20)

P20: nenhuma faixa ou número vira verdade até haver verificação autoritativa. A lista tem duas partes:
- os itens que a própria extração rotulou como P20/CONTENT QA;
- os candidatos numéricos fonte × fonte sem esse rótulo, que precisam da mesma verificação antes de o produto corrigir
  o learner com base neles.

**Marcadas P20 / CONTENT QA na extração**

| Módulo | Item | Leituras em conflito |
|---|---|---|
| M01 | Faixas do INST·06 × figura cf-chart | Solar: 20–28% na figura × corte em 0,25 no script. Carvão: 55–75% × ≥ 0,85. CCGT: 40–60% × ≥ 0,55. O Ex06 diz "abaixo de 15%". |
| M02 | `lac-i02-02` (fonte dos números) | Nenhuma constante, cenário-padrão ou limiar dos 9 instrumentos tem fonte externa. As notas dizem "didático", "ilustrativos" e "maquete pedagógica" (P19/P20). |
| M03 | `div-m03-ap-04-perda-bateria` | 10–15% (§Erros) × "uns dez por cento" (§Voz) × eficiência de 85–90% (Aula 09, Lex) × perda sobre a energia entregue no INST·07 e no Ex·08 (400 → 455 MWh, cerca de 13,6%). A base não é declarada. |
| M03 | `div-m03-inst-01-fc-fio-dagua` | Tabela da Aula 01: fio d'água "~40–55%" × FC de 63% no cenário-padrão do INST·04 (`FIO_CAP = 1.6`). |
| M03 | Fonte dos números dos 9 instrumentos | `null` em todos. Tratar como cenário didático e não apresentar como dado (P19/P20). |
| M04 | Limites do PLD 2026 e caixas "Números vivos" (3) | A fonte já diz "verificar na fonte". Verificar antes de apresentar como dado real. |
| M06 | Resíduos do script e viés do quiz | "Nível final" do Inst 04 acima de 100% (153%). O Inst 04 testa d ≤ 0 antes de E ≤ 15. Parâmetros 8 e 0,25 fora do disc. O Inst 05 não declara F0/S0 nem os expoentes. O Inst 07 mostra "Elegível" para qualquer unidade de baixa tensão em 2027, mas a prosa 6.3 restringe a indústria e comércio. Patamar de 3.000 kW (1996–2018). 9 de 10 respostas do quiz são B. |
| M08 | `inst-div-04` (alta) | Faixas de FC do INST 03 × INST 05 × fichas da Aula 02 (ex.: hidro 40–60% × 45–60%). FC solar inicial de 15,5% no INST 02 × faixa típica de 20–30%. |
| M08 | `inst-div-01` (alta) | Ordem da geração: o INST 02 dá hid > eol > sol > fos, e o INST 04 dá hid > eol > fos > sol. |
| M12 | Faixas e limiares dos INST·07, 08 e 09 | O script as trata como verdade, e nenhum número dos cenários foi verificado contra fonte primária. |
| M12 | ref-08 (Lei 15.269) | A URL aponta para um diretório (`…/2025/lei/`), sem o arquivo da lei. |
| M13 | Taxa real e categorias de risco | Taxa: "≈ 8,7%" e "passa de meio ponto" (Aula 02) × 8,64% e 0,45 p.p. (INST·03, Ex 03, script). Riscos: "seis" (h2 da Aula 06) × "oito" (corpo, INST·09) × sete termos no §Lex. Os números vivos (Selic, estados societários) foram verificados pela fonte em 02·08·2026, e a extração não os reverificou. |
| M15 | Capacidade de refino (INST·06) | Padrão de 1.800 mil bpd, atribuído ao anuário, × 2,2 milhões de bpd a 86,4% (Aula 05), o que implica cerca de 2,5 milhões. |
| M15 | Reservas (INST·03) | IRR 146,6%, 2P 24,256 e 3P 28,873 × 147,03%, 24,265 e 28,877 na Aula 02 (razões arredondadas). |
| M17 | Teto do leilão de capacidade | Aula 05 e Q7: "a diferença … é maior que o próprio teto" × a conta da própria fonte, 554,72 − 325 = 229,72 < 325. O Instrumento 07 ("cerca de 70% acima") confere. |
| M17 | Instrumentos 03, 05, 08 e 09 | **03:** "parcela que não explica nada" com peso 1 em 13 de 24 células. **05:** texto brasileiro aplicado ao Chile. **08:** "Duas das cinco funções" × 2 + 1 ausente, e classe `ok` com "nenhuma em operação". **09:** a parcela elétrica muda o resultado em +15,6%, contra +100% do fator de entrada. |

**Candidatos numéricos fonte × fonte (sem rótulo P20 na extração)**

| Módulo | Item |
|---|---|
| M01 | Q05: FC = 0,40 cai na fronteira fechada de duas faixas da tabela da A05 (L1814–1815). |
| M02 | Placar do quiz: com 7 acertos diz "avance" e com 8 diz "Revise", contra o 8/10. Fallbacks para campo vazio: `\|\| 95` no pico e `\|\| 1` na potência e na carga. |
| M03 | "1,4 GW" (Angra 3) só aparece no distrator da Q08. A remissão ao "erro nº 5" depende da ordem do §Erros. |
| M04 | Com óleo na margem, o INST 01 dá R$ 900, acima do teto estrutural, sem aplicar o teto da média. |
| M05 | Constantes sem procedência: CRF 10%, BC/BK, SP 200, pesos e posição do Brasil (85/45). O disclaimer diz que "os pesos são arbitrários". |
| M07 | Etapa b do Inst 04: "Elaboração de minuta e AIR" × "Minuta e análise de impacto". |
| M08 | Ex 02: térmica agregada em 3º × INST 04 com eólica em 3º. "Fator de carga anual" do INST 10 × definição do §Lex (24×7 dá 99,7%). Quadrante do INST 08: corte em 100% da MLT × veredito em 70%. "49,5%" só aparece no quiz. |
| M09 | INST·02: o markup diz 3 e 4 componentes, e os dados dizem 4 e 3. INST·05: os pesos somam 6, mas o texto diz "de cinco". |
| M10 | Três primeiros passos: "menos de um minuto" × "menos de um minuto e meio" × 75 s. Um desvio de 12 p.p. no Inst·09 dá "Estimativa calibrada". Inst·05/06: o resultado depende da ordem das edições. |
| M11 | INST·04 com 1.000 kW: ramo de 2,5% × 5% "a partir de 1.000 kW". Teto da FV com bateria: 3 MW × 5 MW. "Seis instrumentos" × "sete marcos". Portaria Inmetro 140: 2022 × 2021. |
| M13 | Datas do INST·07 "em cada caso", mas só um caso tem data. "A mais alta entre as abertas" (alavancagem da Auren). |
| M14 | INST·07: "1 TJ/ano" × 540 TJ implícitos. INST·08: unidade gCO₂e/MJ × % da referência; 102.389 t × cerca de 116.050 t; densidade 21,3 × 21,1 MJ/L. INST·05: o estado "prazo vencido" mostra 30%. INST·06 omite as perdas da fórmula da aula. |
| M16 | Estágio da medição avançada: ficha 03/INST·01 × INST·02 × régua. INST·04: passo 1 no número × 1.000 no deslizador. |
| M17 | Assinaturas únicas: "Quinze" × 13 exclusivas. Aula 06: "Duas coisas mudaram" × tabela de 4 linhas. Barra estática da Aula 02 com o mesmo peso para dotação e desenho. |

**Viés de posição no gabarito** (é P18, mas cabe no mesmo QA): M04 e M05 têm 10 de 10 respostas B, M06 tem 9 e
M02 tem 8. No M03, a resposta nunca é D.

## 7. Marca antiga "GridAlpha" (P24)

P24: o produto é Alexandria e a empresa é NIVAR; "GridAlpha" fica só na proveniência.

A contagem abaixo foi feita com `grep` direto em cada HTML, em 2026-09-17. Ela inclui `<title>`, comentários e script:
- **Ocorrências:** `grep -o | wc -l`.
- **Linhas:** `grep -c`.

A coluna de vocabulário interno também vem do `grep` ("War Room", "Trava N" e "Cobaia"). No M04, o único "trava N" é
o verbo ("trava 7.000 MWh") e não entra.

| Módulo | Ocorrências (linhas) | Onde aparece (segundo a extração) | Outro vocabulário interno visível |
|---|---:|---|---|
| M01 | 12 (12) | Header, hero-meta e blocos de produto | "War Room" (4 linhas), "Trava 3/4" (4), "Cobaia Zero" (2) |
| M02 | 16 (16) | 7 callouts de produto/marca, hero-meta "Produtos GridAlpha", "Linguagem GridAlpha para esse caso". **O código ainda tem 9 ocorrências e 6 desses callouts** | "Cobaia Zero v2.0", "Summit" (3), "Bloco 2/5/9" |
| M03 | 11 (11) | Cabeçalho, hero-meta "Produtos GridAlpha", pull-quote, rodapé, callouts | "Cobaia Zero v3.0", CSS comentado "Módulo 02" |
| M04 | 5 (4) | Kicker, rodapé e callouts "Onde isso entra no produto" (7 no total) | "Bloco 4/9" |
| M05 | 10 (10) | L255 (kicker); L721, **h3 4.6 "Onde isso vira a tese da GridAlpha"**; L722 e L728 (§4.6); L732 (box da Aula 04); L996 (box de produto da Aula 06); L1190 e L1195 (§Voz); **L1242 (item do §Final)**; L1376 (rodapé) | "Bloco 5/6/9" |
| M06 | 13 (13) | Kicker, rodapé, caixas de produto, **critério do §00**, lede da A06, 6.3, ataques 5–6 da V.2, **item 24 do §Final**, scripts dos Inst 01 e 08 | "Bloco 6/7/9" |
| M07 | 8 (8) | Kicker, rodapé, **ref. "GridAlpha · documentos internos"** no §Ref | "Trava 1", "trava 4", "War Room" (1 linha), "Bloco 7" |
| M08 | 2 (2) | L516 (§00) e L2038 (rodapé, "Trilha 2 do currículo GridAlpha"). Os 9 blocos P7 citam "Brazil Pulse", "Brasil Terminal" e "Diagnóstico Energético" | "Trava 1", "trava de verificação", "Bloco 8" |
| M09 | 5 (5) | 4 dos 9 destaques de produto e **prosa comum da Aula 08** (L1695) | — |
| M10 | 4 (4) | L551 (§00), L1872 (Aula 05), **L3521 (ref. 32 do §Ref)**, L3547 (rodapé) | — |
| M11 | 10 (10) | L425, 550, 580, 1749, 2378, 2982, 2986, 2989, 2994 e 3037: kicker, corpo, **refs. 25–27**, rodapé | "War Room" (1 linha) |
| M12 | 4 (4) | Kicker, box.gd da Aula 02 e rodapé (3 lugares) | — |
| M13 | 21 (21) | Kicker (1), 8 caixas de produto (15), "O que nunca devolver" do INST·11 (1), **§Ref (2)**, rodapé (1), **explicação da Q10 do quiz** (script, 1) | — |
| M14 | 15 (14) | Eyebrow, rodapé, §00.4, callouts de produto, **"Documentos internos do GridAlpha" no §Ref**, **feedback da Q10** (script, L4304) | "Trava 1 do War Room" / "Travas do War Room" (3 linhas) |
| M15 | 11 (11) | Kicker, rodapé, régua de nomeação, blocos P7 (7 dos 10), **explicação da Q10** | "Trava 2 do War Room" (3 linhas; "War Room" em 2) |
| M16 | 9 (9) | Kicker ("Alexandria · GridAlpha · Módulo 16"), rodapé, §00.8, blocos de produto, **§Ref 38** | "Trava 2 do War Room", "Travas" |
| M17 | 23 (23) | Corpo (P24/P7), inclusive os blocos de produto que carregam as capacidades | "Trava 2 estendida" (§MAP), "War Room — quatro travas" (§Ref) |
| **Total** | **179 (177)** | | |

**Onde P24 pesa mais.** Nestes pontos, a marca aparece fora dos blocos P7 (que já ficam ocultos), em conteúdo que o
learner vê. Esconder o bloco P7 não basta:
- critério e checklist: M05 (item do §Final) e M06 (critério do §00 e item 24);
- prosa de aula: M05 (h3 e §4.6) e M09 (Aula 08);
- referências: M07, M10, M11, M13, M14 e M16;
- explicação ou feedback do quiz: M13, M14 e M15;
- vocabulário interno ("War Room", "Trava N", "Cobaia Zero", "Summit", "Bloco N"): P23/P24.

**Títulos (P24; o catálogo canônico governa).** O repositório (`alexandria-blocks.ts`) diverge do catálogo em três
módulos:

| Módulo | Título no repositório |
|---|---|
| M07 | "Estrutura Institucional Detalhada" |
| M08 | "Matriz Elétrica" |
| M11 | "Energia Solar e Análise de Propostas" |

Outras variações:
- O M01 chama o M02 de "02 · A Rede Elétrica".
- A ref. 25 do M11 chama o M11 de "…Geração Distribuída e o Boom Solar".
- Nos M01, M02, M03, M13, M14 e M16, o h1 longo ou o `p.sub` é candidato a descritor editorial, nunca a segundo
  título.

## 8. Pendências abertas

- **Cobertura da extração.**
  - M01: os INST·01–05 não têm extração de camada fonte (`instrumentos.json`).
  - Corpo das aulas: só a aula 08 do M01 foi extraída. As outras 140 aulas precisam de grupos `aula-NN` se a Peça C
    as usar.
- **Verificação.**
  - M01, M14 e M16 têm só uma passada adversarial independente. Os outros 14 módulos têm duas.
  - M14: os 6 exercícios embutidos da Aula 08 foram acrescentados à mão em `aparato.json`. Se `m14_aparato.mjs` rodar
    de novo, eles somem. As seções "Verificação" dos `.md` do M14 também são manuais.
- **Contagem do código.** A 215ª atividade de exercício do código (preflight) não foi localizada.
- **Revisão humana.** `marcacao_p14` e `kind_sugerido` são inferência em todos os módulos.
- **Verificação na tela.** Várias divergências de código foram deduzidas da leitura dos componentes e não foram
  medidas na tela. Exemplos: M01 COD-02/06/07, a posição do instrumento no M04, o efeito do bug do INST·01 no M05 e os
  recursos não registrados em M10–M17.
- **FOUNDRY.** `docs/alexandria/instrument-taxonomy.md` está desatualizado:
  - M05: Termômetro descrito pelo código, kinds fora do enum;
  - M06 e M07: Inst 01 "nunca materializado";
  - M08: `reconstrutor`;
  - M15: kinds ausentes.
