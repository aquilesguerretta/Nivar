# Extração M08: Matriz Elétrica Brasileira em Profundidade

**Camada fonte.** Esta extração é literal e registra a origem de cada item. A fonte é o HTML do M08
(`C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo08.html`: 3.132 linhas, 326.382 bytes, LF, `<script>` em
L2042–3130), lido só para leitura. Nenhuma contradição foi resolvida aqui; as duas leituras ficam em `divergencias[]`
(`modulo.json`, `aparato.json`) e em `divergencias_fonte[]` (`instrumentos.json`). As decisões P17–P24
([`../../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md))
valem para a camada Alexandria, no produto. Nos JSONs, elas só aparecem como notas.

## Arquivos

| Grupo | Arquivos | Conteúdo | Verificação |
|---|---|---|---|
| modulo | `modulo.json`, [`modulo.md`](modulo.md) | identidade (título, subtítulo, eyebrow, 12 pílulas, horas, 3 eixos), tese, resultado esperado (`null` + o que existe), § MAP (8 cartões, `perguntas: null`), roteiro de 17 seções, contagem de aulas (P8), 8 critérios literais (P14), § Voz/princípios, 18 erros, 9 blocos P7, comparação com código, fatos e catálogos | 493 strings e 167 origens, 0 falhas |
| aparato | `aparato.json`, [`aparato.md`](aparato.md) | caso (Operação A · Parte 8), quiz (10 × 4, gabarito, explicações, 2 faixas), checklist final (26), exercícios (12), § Voz (40 + 7 + roteiro de 8 blocos), referências (28), glossário (124) | 1.075 strings e 337 origens, 0 falhas |
| instrumentos | `instrumentos.json`, [`instrumentos.md`](instrumentos.md) | os 11 instrumentos: entradas, rótulos fixos, fórmulas e ramos literais (com corpo), dados do script, cenário-padrão executado, fonte dos números, tolerância, posição e invocação, comparação com o código, 9 divergências internas | 146 strings e 93 origens, 0 falhas; 240.174 casos diferenciais fonte × código, 0 divergências numéricas |

**Extratores** (`extratores/`, Node 24; `esbuild` do repositório só para importar os `.ts` de `src/` em modo leitura):

| Arquivo | Função |
|---|---|
| `m08_lib.mjs` | Texto e origem, fatiamento de `section`, walker de filhos do `.wrap` por profundidade, blocos tipados, execução do `<script>` original em DOM simulado, import de `.ts` |
| `m08_instrumentos.mjs`, `m08_aparato.mjs`, `m08_modulo.mjs` | Geram os três JSONs |
| `m08_verify.mjs` | Verificação adversarial (substring de conteúdo, origem a ±3 linhas, contagens por sinais independentes, cobertura por token); grava `verificacao.json` |
| `m08_verify_estrito.mjs` | Segunda passada, sem lista de chaves de conteúdo; grava `verificacao_estrita.json` |
| `m08_md.mjs` | Gera os três `.md` a partir dos JSONs |

Para regenerar: `instrumentos → aparato → modulo → verify → verify_estrito → md`. A regeneração é determinística
(sementes fixas nas provas diferenciais).

**Vocabulário.** O M08 usa `sec-id`/`lede`/`inst`/`box rd|gd|cy`/`lv`/`form`/`src-card`/`ck` (vocabulário M04–M17).
Os extratores do M01 (`aula-marker`) não servem; os do M08 foram escritos para este arquivo e conferidos contra ele.

## Contagens

| Item | Fonte (markup) | Prosa da fonte | Código atual |
|---|---|---|---|
| Aulas | **7** | "7 aulas" (hero), 7 cartões no § MAP | 7 (`MODULO_08_AULAS`, `totalInModule` 7, `AULAS_POR_BLOCO` 7); catálogo canônico 7 |
| Seções | 17 (7 aulas + 10 aparatos) | — | — |
| Instrumentos | **11**: 1 de módulo (INST 01, § MAP) e 10 de aula (Aulas 01, 02 e 03 têm dois) | "11 instrumentos" | 11 portados (12 ids: o INST 04 virou `-cap` e `-ger`): **3 portado, 8 divergente, 0 não portado** |
| Termos do glossário | **124** em 7 grupos (18+16+18+16+20+16+20) | h2 "124 termos", hero 124, soma dos grupos 124 | 124 `gl-m08-*`, 0 ausentes, 0 definições diferentes |
| Exercícios | **12** (3 blocos × 4); 0 com aula → 12 soltos (P9); 1 com critério próprio (Ex 02) | "Doze exercícios" | 12 soltos; `prompt: ""`, `points: 1` sem origem |
| Checklist final | **26** | "Vinte e seis verificações" | não extraído |
| Quiz | **10** questões × 4 alternativas; 2 faixas (`n >= 8`) | "Dez perguntas", "8 de 10" | não extraído |
| Referências | **28** (0 com URL, 8 com data ou ano no texto) | "Vinte e oito fontes primárias" | não extraído |
| Fichas de fonte (`src-card`) | 6 na Aula 02 (+2 na Aula 06 = 8) | "6 fichas de fonte" | 100% dos tokens, como `titulo` + `tabela` (protocolo §15) |
| Erros comuns | 18 | "Dezoito" | não extraído |
| § Voz | 40 perguntas-relâmpago, 7 ataques, roteiro de 8 blocos | "Quarenta", "Sete", "dez minutos" | não extraído |
| Critérios literais | 8 formas (P14 marcado) | — | — |
| Caso | 4 subseções (C.1–C.4), 2 tabelas, perguntas `null`, decisão `null` | "Parte 8" | não extraído |
| Síntese 7.5 | 11 itens | — | dentro do corpo da Aula 07 |
| Blocos "Onde isso entra no produto" (P7) | 9 (tese, 7 aulas, caso) | — | 7 (os das aulas), como `nota` |

Todas as contagens foram cruzadas por pelo menos três sinais independentes (`extratores/verificacao.json › sinais`), e
todos concordam. Diferente do M01, **prosa e markup não divergem em nenhuma contagem** do M08.

## Divergências principais

**Fonte × fonte.**
- **Ordem da pizza de geração** (inst-div-01, alta): o Conversor (INST 02, valores iniciais) dá
  `hid > eol > sol > fos > bio > nuc`; a referência do Reconstrutor (INST 04) dá `hid > eol > fos > sol > bio > nuc`.
  Quem reconstrói o que o INST 02 mostrou é corrigido pelo INST 04.
- **Faixas de fator de capacidade** (inst-div-04, alta, **P20 · CONTENT QA — AUTHORITATIVE VERIFICATION REQUIRED**):
  INST 03, INST 05 e as fichas da Aula 02 declaram faixas diferentes (ex.: hidro 40–60% × 45–60%), e o FC inicial da
  solar no INST 02 (15,5%) fica abaixo da faixa típica solar declarada (20–30%).
- **Ordem de capacidade** (inst-div-02): o gabarito do Ex 02 agrega a térmica em 3º (~20%) e põe a eólica em 4º; o INST 04
  separa biomassa e fóssil e põe eólica em 3º.
- **Biomassa × fóssil "não aparecem separadas"** na pizza de capacidade (INST 05), mas o INST 04 e o INST 02 as separam
  (inst-div-03).
- **INST 08:** readout "Quadrante" corta em 100% da MLT e o veredito em 70%; no estado inicial um diz "fluxo fraco" e o
  outro "fluxo próximo do normal" (inst-div-06). A fotografia carregada não reescreve o mês (inst-div-07).
- **INST 09:** P2 + dia útil + rede normal cai no texto da madrugada (inst-div-08).
- **INST 10:** a intro promete "demanda de ponta implícita", que nenhuma saída mostra; o "fator de carga anual" do script
  não é a razão média/máxima do § Lex; 24×7 dá 99,7% (inst-div-09).
- **INST 05:** o aviso diz que os textos são "os mesmos das fichas", mas são versões encurtadas (inst-div-05).
- **Critério em quatro formas** (mod-div-07, P18): destaque do § 00 (três cláusulas), quiz "8 de 10", § Final (26 itens,
  "o primeiro item é o critério oficial"), e os vereditos do INST 04, que chamam "Ordem correta" com fatias fora da
  tolerância de "aprovação no critério que importa", contra o item 1 do § Final (tolerância de três pontos).
- **"Módulo 08" × "Bloco 8"** (mod-div-06); "único instrumento de todo o sistema Alexandria que exige que você produza a
  resposta" (mod-div-08: o protocolo §3 registra um "Reconstrutor" no M10).
- **Checklist:** o lead diz que cada item "aponta uma aula específica", e nenhum item nomeia aula (apa-div-04).
- **Quiz:** "49,5%" e "renovação … por trinta anos" só existem no quiz (apa-div-02, apa-div-03).

**Fonte × decisões.**
- **P17:** o caso declara "Parte 8" no marcador e no cartão do § MAP (mod-div-12); caso seriado entre módulos.
- **P18:** "Critério de domínio atingido" e "Abaixo do critério de 8 em 10" (script do quiz); classes `pass`/`fail`.
- **P21:** "FC" aparece uma vez, no rótulo de unidade gerado pelo INST 02 ("GW · FC %", L2224), no sentido de fator de
  capacidade; "MLT" sem expansão no INST 08 (apa-div-09).
- **P23:** "Trava 1" (bloco P7 da Aula 07, L1467) e "trava de verificação"/"trava de dados verificados" sem definição no
  módulo (mod-div-09).
- **P24:** "GridAlpha" 2 vezes (L516 no § 00; L2038 no rodapé, "Trilha 2 do currículo GridAlpha").
- **P7:** 9 blocos citam "Brazil Pulse", "Brasil Terminal" e "Diagnóstico Energético".

**Fonte × código.**
- **Aula 01 perdeu o único `div.form` do módulo** (L584–587: a fórmula do fator de capacidade e a nota sobre o
  denominador). As outras seis aulas têm 100% de cobertura por token; a Aula 01, 95,4%.
- **`</b>` órfão** em 10 parágrafos, exatamente onde a fonte tem `span.hl` (mesmo defeito do M01).
- **Lead da Aula 02:** espaço antes do ponto final (resíduo do `span.hl`).
- **Instrumentos (nenhuma divergência numérica em 240.174 casos):**
  - INST 02, 03, 10: campo `formula` com texto que a fonte não escreve;
  - INST 03: falta o readout textual "Faixa típica · {fonte}";
  - INST 04: dois instrumentos com título acrescido; faltam "Ordem das fontes" e a lista de erro por fonte; `details` de
    referência editável não portado; a tolerância 3 vive em `M08_INST04_TOL`;
  - INST 01, 05, 06, 07: intro e/ou aviso não verbatim na `note`; SVG e curvas não portam (protocolo §12);
  - INST 08, 09, 11: portados sem diferença.
- **Exercícios:** gabarito achatado em texto, `prompt` vazio, `points: 1` sem origem (apa-div-07).
- **Fora do código:** caso, quiz, checklist final, § Voz, § Erros, critérios, eixos, cartões do § MAP e § Ref (medido
  por busca literal em `src/lib/data`, apa-div-08). `alexandria-badges.ts` não tem item do M08.
- **Comentário de cabeçalho** de `alexandria-modulo-08-content.ts` ainda diz "SÓ O INST · 04 PORTADO" (mod-div-11).
- **Fatos canônicos** (`alexandria-modulo-08-fatos.ts`): os 10 textos de `M08_FATOS` e os 4 universos de capacidade
  existem literalmente na fonte. Sem divergência.
- **Glossário:** 124 = 124, 0 diferenças; 4 verbetes têm `aulaIds` no código (a fonte não vincula termo a aula); 25
  termos têm homônimo em outro módulo (P22, lista em `aparato.md`).

**Fonte × catálogo.**
- **Título:** fonte e catálogo canônico usam "Matriz Elétrica Brasileira em Profundidade" (L728). O catálogo do
  repositório (`alexandria-blocks.ts`) usa "Matriz Elétrica" (`priority: 'confirmar'`), e a tabela-resumo do canônico
  abrevia para "Matriz Elétrica Brasileira" (L1839). P24: o canônico governa; nada resolvido aqui.
- **Horas:** a fonte declara "4-5 h de estudo"; o repo tem `estimatedHoursMin/Max: null`.
- **Critério citado** no canônico (L809–813) termina em "complementaridade hidro-eólica." e omite "-solar nas três escalas
  … sem consultar gráfico nenhum" (mod-div-04).
- **Frase atribuída ao módulo** no canônico ("a tese diz que não existe a pizza", L816–817) não existe na fonte (mod-div-05).
- **Taxonomia:** `docs/alexandria/instrument-taxonomy.md` ainda lista 9 `kind`; o código tem o 10º (`reconstrutor`,
  criado para o INST 04 do M08) e o próprio tipo registra a pendência (FOUNDRY).
- **Conferem:** trilha (declarada, "Trilha 2 — Setor Elétrico Brasileiro"), escala (7 · 11 · 124 · 6 · 12 · 18 · 40 · 7 ·
  26 · 28), títulos das 7 aulas e dos 11 instrumentos, e os 7 grupos do glossário com as contagens.

## Lacunas (a fonte não tem)

- **Módulo:** "Resultado esperado" e lista de capacidades; perguntas por aula no § MAP; § Lab; Tradutor; horas numéricas
  (só a string "4-5 h de estudo"); nível.
- **Caso:** perguntas dirigidas ao learner e decisão pedida (`null`); células de dado numérico da planta (consumo,
  demanda, custo). Os dados literais são estado, submercado, perfil de carga e "aproximadamente 25%" (C.3).
- **Quiz:** letras de alternativa (o feedback usa "opção N"); embaralhamento.
- **Checklist:** vínculo item → aula.
- **Exercícios:** vínculo com aula (todos soltos); critério próprio em 11 dos 12.
- **Referências:** URL e domínio (0 das 28); tipo de fonte; data de verificação por item (a data de corte é única: 1º de
  agosto de 2026); instituição em campo próprio (só 2 das 28 a trazem logo após o título; nas demais ela está no
  título ou aparece por perífrase: "operador nacional", "agência", "câmara de comercialização").
- **Glossário:** vínculo termo → aula.
- **Instrumentos:** pergunta própria (`null` nos 11); fonte dos números (`null` em 8 dos 11; só INST 02, 04 e 08 têm
  `span.srcnote`); tolerância (`null` em 10 dos 11; só o INST 04 declara, 3 pontos percentuais por fonte).
- **Mídia:** 0 `<img>`, `<video>`, `<iframe>`; duração e dificuldade por aula inexistentes.

## Uso nas peças (camada Alexandria, depois)

- **P17.** Título "Caso — Operação A" sem "Parte 8" (ou derivado do caso: "A planta pela lente da matriz"). O Desafio de
  decisão usa só os fatos de C.1–C.4.
- **P18.** Nenhuma das quatro formas de critério vira aprovação; "Concluído" só para consumo. As mensagens do quiz e os
  vereditos "aprovação no critério que importa" do INST 04 ficam como registro legado.
- **P19, por analogia.** O cenário do INST 03 (300 MW, 1.200 GWh, 8.760 h) e os vetores dos INST 02/04 são cenário didático
  presente no módulo; só o INST 02, o INST 04 e o INST 08 declaram procedência (`srcnote`).
- **P20.** Nenhuma faixa de FC vira verdade transversal (inst-div-04); a ordem de geração (inst-div-01) também exige
  verificação antes de o produto corrigir o learner por ela.
- **P21.** "FCap" na exibição do INST 02 ("GW · FC %") e em qualquer fórmula do código que use "FC".
- **P22.** Contagem 124 derivada da coleção; decidir os 25 homônimos com justificativa semântica.
- **P23.** "Trava 1" e "trava de verificação" não aparecem ao learner sem definição.
- **P24.** Nome principal pelo catálogo canônico; "GridAlpha" do § 00 e do rodapé só na proveniência.
- **Corrigir no produto (fonte × código):** restaurar o `div.form` da Aula 01; remover os 10 `</b>` órfãos; o readout
  "Faixa típica" do INST 03; "Ordem das fontes" e a lista de erro por fonte do INST 04.

## Retomada e segunda passada (2026-09-17)

Esta extração foi iniciada numa sessão que parou antes dos `.md` e do README. Nesta sessão:
- os três extratores foram reexecutados: `modulo.json` e `aparato.json` saíram byte-idênticos; `instrumentos.json`
  diferiu só pelo que os extratores já tinham mudado depois da última gravação (`frases_com_palavra_instrumento`,
  espaçamento de `trecho`);
- **corrigido:** `referencias.data_de_corte` apontava para o `sec-id` do § Ref, não para o `box rd` "Data de corte deste
  módulo" (a cobertura por token do § Ref subiu de 98,5% para 100%);
- **corrigido:** `trecho_inicial` com espaço antes de pontuação (fronteira de tag); as 17 falhas de origem do log antigo
  eram do verificador anterior e hoje são 0;
- **acrescentado:** `corpo_verbatim` em cada ramo de leitura; `html` + `texto` com fronteiras de tag nos estados
  renderizados (painéis, legendas, fichas); cobertura por token do corpo portado por aula, com segundo sinal de início
  de bloco (achou o `div.form` perdido); conferência de `alexandria-modulo-08-fatos.ts`; `apa-div-08` passou a ser
  medido; `apa-div-09` reclassificado (não é P23) e com a medição de "FC"/"MLT"; condição do placar do quiz agora é
  literal (`n >= 8`, ramo verdadeiro/falso);
- **passada estrita** (`verificacao_estrita.json`): 2.287 folhas; 76 não achadas literalmente, todas inspecionadas —
  estados renderizados pelo script (vereditos com número interpolado, painéis), os 40 rótulos "opção N" compostos pelo
  script, descrições desta extração dos controles gerados e identificadores. Nenhum texto parafraseado.

## Verificação (verificador adversarial, 2026-09-17)

Conferência independente contra o HTML, com scripts próprios (não os extratores):
- **Verbatim:** todas as folhas de conteúdo dos três JSONs (cerca de 2.600) buscadas na fonte com espaços, entidades e tags tolerados. As não achadas são as já declaradas: estados renderizados, rótulos "opção N", descrições de controle e citações do catálogo e do código, estas conferidas nos próprios arquivos. **100%** das questões do quiz (contra o array `QZ` avaliado), dos 26 itens do checklist e das 112 linhas de fórmula e readout, mais os 38 ramos, dos instrumentos.
- **Origens:** 594 origens a ±3 linhas. Duas acusações do script próprio eram falsos positivos: o lead do § MAP com `<strong>` e a tag do `box cy` em outra linha.
- **Contagens:** recalculadas no markup, todas iguais às declaradas (17/7/10/11/1/10, 124 em 7 grupos, 12 exercícios com 1 critério e 0 tags de aula, 26, 10×4, 2 faixas, 28 referências com 0 URL, 18, 40, 7, 8, 4 subseções e 2 tabelas no caso, 8 `map-card`, 8 `src-card` (6 na Aula 02), 11 itens na 7.5, 9 blocos P7, 1 `div.form`, 0 mídia). Nas contagens do código, `formula` não nula aparece em 3 instrumentos (INST 02, 03 e 10), 124 ids `gl-m08-*`, nenhum item do M08 em `alexandria-badges.ts` e a Aula 01 sem "geração do período".
- **Divergências:** todas rechecadas. Os cenários-padrão dos INST 02, 08, 09 e 10 foram recalculados. Nenhuma divergência é inventada.
- **Corrigido (1 defeito, 2 campos):** o catálogo canônico era citado com uma linha a menos. `criterio_citado` e `mod-div-04` paravam na L812, antes da L813, onde está a evidência ("complementaridade hidro-eólica."). `frase_entre_aspas` e `mod-div-05` paravam na L816, antes do fecho "pizza" da L817. O extrator `m08_modulo.mjs` foi corrigido, e `modulo.json`, os três `.md` (`m08_md.mjs`), `verificacao.json` e `verificacao_estrita.json` foram regenerados. O diff do `modulo.json` se limita a esses campos.


## Verificação (segundo verificador adversarial, 2026-09-17)

Esta conferência foi independente, com scripts próprios. A fonte foi comparada sem tags e sem espaços, com as entidades e os escapes JS decodificados.
- **Verbatim:** todas as folhas dos três JSONs foram buscadas na fonte. As não achadas são as já declaradas: metadados, marcações P14, estados renderizados e rótulos compostos pelo script. Três conjuntos foram conferidos por inteiro (100%):
  - o quiz, byte a byte contra o `QZ` avaliado (10 × 4, gabarito `0,1,2,3,1,3,0,1,2,3`);
  - o checklist (26), o glossário (124: termo, definição, grupo e linha), os 12 exercícios (resumo e `det-bd` inteiros) e as 28 referências;
  - as 112 linhas de cálculo e readout e os 38 ramos dos instrumentos.
- **Origens:** 168 + 337 + 93 a ±3 linhas.
- **Contagens:** todas recalculadas e todas iguais às declaradas:
  - estrutura: 17 `section`, 7 `sec-id` "Aula", 11 `div.inst` (1 no § MAP; 2 em cada uma das Aulas 01, 02 e 03);
  - glossário: 124 `span.term` (18+16+18+16+20+16+20);
  - exercícios e checklist: 12 `details` no § Ex (1 "Critério de acerto") e 26 `li` no § Final;
  - quiz e referências: `QZ` com 10 × 4 e 28 `li` no § Ref (0 URL);
  - § Erros e § Voz: 18 linhas de erro, 40 `li` e 7 `details` no § Voz, e 8 linhas no roteiro;
  - blocos: 8 `map-card`, 8 `src-card` estáticos, 9 "Onde isso entra no produto", 11 `li` na 7.5 e 12 pílulas;
  - caso: 4 subseções e 2 tabelas.
  - No código: 12 ids `m08-inst-*`, 124 `gl-m08-*`, `formula` não nula nos INST 02, 03 e 10, 10 `</b>` órfãos e o `div.form` da Aula 01 ausente.
- **Cobertura:** foi medida por bloco de texto (hero, § 00, § MAP, caso, § Erros, § Ex, § Quiz, § Voz, § Final, § Lex, § Ref) e por nó de texto em cada `div.inst`. **Corrigido:** faltavam 4 rótulos fixos de markup:
  - no INST 02, os `h5` "Pizza 1 · capacidade instalada (GW)" (L615) e "Pizza 2 · geração efetiva (TWh/ano)" (L620);
  - no INST 08, os `div.th-lb` "Fluxo · afluência" (L1030) e "Estoque · armazenamento" (L1031).

  Entrou o campo `rotulos_estaticos[]`, com origem, em `m08_instrumentos.mjs` e, por remendo idêntico, em `instrumentos.json` (só inserções). Foram regenerados `verificacao.json`, `verificacao_estrita.json` e os três `.md`. Nenhum dos quatro rótulos existe em `src/`. O status dos instrumentos não mudou (3 portados, 8 divergentes).
- **Divergências:** inst-div-01, inst-div-03, inst-div-05, inst-div-09, mod-div-04, mod-div-05, mod-div-08, apa-div-02, apa-div-03 e apa-div-04 foram rechecadas na fonte, no catálogo e no protocolo. Nenhuma é inventada.
