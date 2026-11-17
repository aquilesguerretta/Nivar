# Extração M14 — Biocombustíveis e Bioenergia

Esta é a camada **fonte** do Módulo 14: texto literal, sempre com origem, e nenhuma contradição resolvida. A fonte é
`C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo14.html` (4.352 linhas, LF, 340.247 bytes, 18 `section`,
`<script>` L3241–4350, instrumentos a partir de L3308), lida só para leitura. As resoluções P17–P24
([`../../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md))
valem para a camada de produto e não foram aplicadas aqui.

## Arquivos

| Grupo | Arquivos | Conteúdo |
|---|---|---|
| modulo | `modulo.json`, `modulo.md` | identidade e catálogo (P24), tese §00 (29 blocos, três lentes), § MAP (pergunta em cinco partes, tabela de camadas, 8 cartões), roteiro de 18 seções, 6 critérios literais (P14), §Voz e princípios, 18 erros comuns, callouts P7, divergências e comparação com o código; ausências declaradas (resultado esperado, § Lab, Tradutor, horas, eixos) |
| aparato | `aparato.json`, `aparato.md` | §Caso (Operação A — Parte 14), §Quiz (10 questões, gabarito, explicações, 2 faixas do placar), §Final (26 itens), §Ex (14 exercícios), §Ref (34 referências), §Lex (158 termos em 8 famílias, comparados com `alexandria-glossario.ts`) |
| instrumentos | `instrumentos.json`, `instrumentos.md` | os 10 `INST·NN`: markup, entradas (rótulo, unidade, faixa, padrão), saídas com a formatação exata do script, fórmulas, ramos do veredito com a concatenação verbatim, dados do script avaliados, script inteiro verbatim, cenário-padrão executado, varreduras, fonte dos números, tolerâncias, ponto de invocação e estado no código e no catálogo |

**Verificação** (`extratores/m14_verify.mjs`, independente dos extratores; relatório em `extratores/verificacao.json`):
- 1.951 strings de conteúdo são substring da fonte normalizada: 0 falhas (eram 1.937 antes da verificação adversarial).
- 431 origens caem na janela da linha declarada: 0 falhas (eram 424).
- 25 checagens exatas, 0 falhas:
  - as contagens batem com o markup (seções, aulas, instrumentos, termos, exercícios, checklist, referências, erros,
    quiz, blocos de voz, cartões e pills);
  - checklist e termos batem item a item, e o quiz bate campo a campo contra o literal `var Q` avaliado;
  - os scripts dos 10 instrumentos são verbatim, e templates e ramos estão nas linhas declaradas;
  - o cenário-padrão foi reexecutado;
  - cinco números-chave foram recalculados por aritmética independente.
- **Cobertura por token.**
  - 100% em §00, § MAP, §Erros, §Voz, hero/rodapé, §Caso, §Final, §Ex, §Ref e §Lex, e no markup do quiz.
  - 96,4% nas strings do script do quiz. O resíduo são nomes de variável (`var`, `q`, `f`) e índices.
  - Instrumentos: 99,2–100% no markup e 94,2–99,8% nas strings do script. O resíduo são ids de elemento.

**Extratores** (em `extratores/`, Node 24, sem dependências; ordem de execução):

1. `m14_modulo.mjs`, `m14_aparato.mjs` e `m14_instrumentos.mjs` escrevem os três JSONs. Usam `m14_lib.mjs`, que traz
   a árvore de elementos com offset e linha, os normalizadores e a cobertura por token, e `m14_dom.mjs`, um DOM
   simulado que executa o `<script>` original sem reescrever lógica.
2. `m14_verify.mjs` escreve `verificacao.json`.
3. `m14_md.mjs` gera os três `.md` a partir dos JSONs, sem digitar conteúdo. Ele também grava duas anotações em
   `instrumentos.json`:
   - `comparacao_codigo.catalogo`: o nome e a descrição do catálogo canônico, mais a divergência
     `div-m14-inst-nomes-catalogo`;
   - `leitura_desta_extracao`: a classificação de cada menção a "instrumento" na seção.

   **Se `m14_instrumentos.mjs` rodar de novo, rode `m14_md.mjs` depois**, senão as anotações se perdem. Depois,
   rode `m14_verify.mjs` outra vez.

## Contagens

| Item | Fonte | Observação |
|---|---|---|
| Seções | 18 | 8 aulas + 10 aparatos (§00, §MAP, §Caso, §Erros, §Ex, §Quiz, §Voz, §Final, §Lex, §Ref) |
| Aulas | **8** | três sinais concordam: 8 seções `Aula NN`, 8 cartões no §MAP.2 e a pill "8 aulas"; o código (`MODULO_14_AULAS`, `totalInModule`, `'bloco-14': 8`) e o catálogo também dão 8 (P8 sem conflito) |
| Instrumentos | **10** | 9 de aula + 1 de módulo (INST·01 no § MAP). A Aula 08 tem dois (INST·09 e INST·10). No total: 21 campos numéricos, 11 grupos de seleção, 27 saídas e 30 ramos de veredito. Kinds sugeridos (anotação): explorador 3 (01, 09, 10), calculadora 2 (02, 05), simulador 4 (03, 06, 07, 08), comparador 1 (04). **0 portados, 10 não portados, 0 divergentes** |
| Termos (§Lex) | **158** | 8 famílias (12+20+22+20+20+20+24+20). A prosa, a pill, a soma das famílias e o markup concordam (P22 sem conflito). **Os 158 faltam no código**; 13 têm homônimo em outro módulo (`gl-m02…m08`) |
| Exercícios (§Ex) | **14** | **0 vinculados a aula, 14 soltos (P9)**. À parte, fora do §Ex: 6 exercícios embutidos nas fichas de rota da Aula 08 (`exercicios.exercicios_embutidos_em_aula`, acrescentados na verificação). Os 14 são idênticos a `MODULO_14_EXERCICIOS_SOLTOS`, mas nenhuma tela os mostra. Nenhum tem critério próprio |
| Itens do checklist (§Final) | **26** | P14 inferida: 1 cronometrado (item 01), 3 orais/livres (02, 11, 26) e 22 autodeclarados. A fonte não tem caixa de seleção nem script |
| Questões do quiz | **10** | 4 alternativas cada (40). Gabarito **C A D B D A C B D C**. 2 faixas de placar (`acertos>=8` / senão). O feedback é o mesmo para acerto e erro |
| Critérios literais | 6 | §00.3 (construído, cronometrado + oral), §Quiz 8/10, §Voz ("é falado"), §Final, §08.2 ("sequência de um minuto"), §Ex |
| Perguntas do § MAP | 1 + 6 | 1 pergunta em cinco partes (lede) e 6 "Pergunta central", uma por camada. Os cartões de aula não têm pergunta (`null` × 8) |
| Caso | 1 seção | 3 subseções, 5 perguntas diagnósticas (sem resposta), 1 pergunta respondida pela própria fonte e 3 colunas com 9 itens. Sem dados, sem decisão pedida |
| Referências | 34 | 5 grupos (10+10+8+3+3). 0 com URL ou domínio, 12 com data por extenso |
| Erros comuns | 18 | 1 cita instrumento em prosa (erro 02 → INST·02) |
| Voz | 8 blocos | "roteiro oral 8 min", mais 1 callout "O que ouvir na gravação" e 3 princípios (§00.4 taxonomia de nomeação, §00.5, "Números vivos") |
| Divergências | 28 | 11 em modulo, 6 em aparato e 11 em instrumentos |

## Divergências principais

**Fonte × fonte (nenhuma resolvida):**
- **`div-m14-inst07-energia` (alta).** O INST·07 calcula `var en=vol*36/1000` com `vol` em milhões de Nm³, e o painel
  mostra "1 TJ/ano" no padrão (15 milhões de Nm³). Pelo Ex 08 (8 milhões × 36 = 288 TJ), 15 milhões dariam 540 TJ.
  É defeito do script, sinalizado e não corrigido (protocolo §10).
- **`div-m14-inst08-unidade` (alta).** O rótulo do campo diz "gCO₂e/MJ", mas o script usa o valor como % da
  referência fóssil. O painel dá 102.389 t no padrão, e o Ex 13 dá cerca de 116.050 t para os "mesmos" 100 milhões
  de litros e 55. A densidade também difere (21,3 × 21,1 MJ/L).
- **`div-m14-criterio`.** O critério aparece em seis formas: o construído (§00.3), 8/10 no quiz (h2, lede, pill e
  script), o 1º item do checklist ("é o critério"), "o teste real… é falado" (§Voz) e a sequência de um minuto
  (§08.2). Pelo P18, nenhuma vira aprovação. A mensagem `>=8` do script afirma competência ("A matéria sustenta uma
  conversa de uma hora…").
- **`div-m14-cinco-camadas`.** O h3 diz "cinco camadas", mas a tabela tem 6 linhas. As "cinco partes" do lede são
  outra lista.
- **`div-m14-quatro-defeitos` e `div-m14-ex-familias`.** As "quatro" categorias mudam entre §Ex, quiz, placar e
  INST·10. As tags do §Ex usam 6 rótulos.
- **`div-m14-trilha`.** O rodapé diz "Trilha 2 · Bloco 14", o §00.3 fala em "blocos finais do Nível 3" e o código
  diz `level: 3`, `track: 'brasil'`.
- **INST·05, INST·09, INST·10 e INST·06** (média/baixa):
  - no INST·05, o estado "prazo vencido" da gasolina mostra 30%;
  - o intro do INST·09 promete órgão e matriz, que o painel não mostra;
  - no INST·10, o enunciado e3 tem o rótulo "estado de política" e a categoria "base";
  - o INST·06 omite as perdas da fórmula da aula.
- **`div-m14-caso-familia`.** A trava de anonimização cita o "caso da família", mas o caso do módulo é uma mineração.
- **`div-m14-titulos-curtos-map`.** 6 dos 8 cartões do § MAP usam um título curto diferente do marcador da aula.

**Fonte × código:**
- **`div-m14-horas`.** A fonte não declara horas. O código traz `estimatedHoursMin/Max: 2` sem origem, e o catálogo
  também não traz horas.
- **`div-m14-codigo-nao-renderizado`.** Os 14 exercícios existem em `MODULO_14_EXERCICIOS_SOLTOS`, mas
  `RecursosDoModulo.tsx` só vai até `modulo-09`. `MODULO_14_INSTRUMENTOS = []`, e as 8 aulas têm `instruments: []`.
- **O que o código não tem:**
  - tese, lentes, critérios, perguntas e tabela do § MAP, descrições dos cartões;
  - §Voz, §Erros e princípios;
  - caso, quiz, checklist e referências;
  - os 158 termos e os 10 instrumentos.

  `alexandria-badges.ts` não referencia o M14.
- **Os exercícios no código.** `kind: discursiva` e `points: 10` não têm origem na fonte.
- **O que confere.** Nas 8 aulas, `title` é igual ao rótulo do marcador e `subtitle` é igual ao h2.

**Fonte × catálogo (`C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md`):**
- **Título.** O h1, o `<title>`, o rodapé, o catálogo e `alexandria-blocks.ts` coincidem: "Biocombustíveis e
  Bioenergia". O p.sub é candidato a descritor editorial (P24), nunca a segundo título.
- **Escala.** Confere item a item com as 11 pills.
- **`div-m14-catalogo-criterio`.** O catálogo corta a última oração do critério construído ("e por que isso é
  complementaridade e não defeito") sem marcar o corte.
- **`div-m14-lex-familia-04`.** O catálogo encurta o nome da Família 04.
- **`div-m14-inst-nomes-catalogo`.** O catálogo dá nomes diferentes a dois instrumentos:
  - INST·09 "Classificador de insumo" contra o span.nm "…— rota, produto, órgão e concorrente";
  - INST·10 "(instrumento assinatura)" contra o span.nm "— instrumento assinatura".

  A descrição do INST·09 no catálogo repete a promessa do intro que o painel não cumpre.

**Fonte × produto (P24/P23/P7):**
- **`div-m14-marca`.** "GridAlpha" aparece 14 vezes em 13 linhas do markup e 1 vez no script (feedback da Q10): eyebrow, rodapé,
  §00.4, os callouts "Onde isso entra no produto" e "Documentos internos do GridAlpha" no §Ref.
- **`div-m14-war-room`.** O vocabulário "Travas do War Room" fica visível ao learner, mas sem conflito de numeração
  neste módulo.
- **Callouts P7.** 8 callouts "Onde isso entra no produto" estão registrados só por posição.
- **`div-m14-caso-parte`.** O caso se chama literalmente "Operação A — Parte 14", numa série de 14 partes ao longo dos
  módulos (P17: "Parte" não vira estrutura).

## Lacunas (a fonte não tem)

- **Módulo.**
  - Não tem "Resultado esperado" nem lista de capacidades.
  - Não tem § Lab, Tradutor nem § Map minúsculo.
  - Horas, `min` e `max` são null.
  - Eixos são null: a fonte declara "três lentes" e não as chama de eixos.
  - Os cartões do § MAP não têm pergunta por aula.
- **Instrumentos.** Os 10 têm `pergunta: null` e `tolerancias: null`.
  - **Fonte dos números.** 7 têm `null`. Os outros 3 são parciais: INST·05 ("Referência verificada em 2 de agosto de
    2026"), INST·08 (só o preço, via p.disc e §Ref B3) e INST·10 ("dados reais verificados em 2 de agosto de 2026",
    sem documento por enunciado).
  - **Padrões sem fonte.** Os padrões numéricos dos simuladores são declarados "ilustrativos" nos p.disc. Pelo P19,
    o rótulo é "cenário didático; fonte externa não declarada".
  - **Invocação no texto.** Só INST·03, INST·08, INST·09 e INST·10 são chamados pelo texto da aula. INST·02 e INST·08
    também são citados por id fora da aula (§Erros e §Ref). INST·01, 04, 05, 06 e 07 aparecem só no próprio bloco.
- **Caso.**
  - Não tem grade de dados, e nenhum volume, preço ou consumo da operação é dado.
  - As 5 perguntas do §Caso.1 não têm resposta de referência nem são dirigidas ao learner.
  - Não há decisão pedida: "diagnóstico, não recomendação". O Desafio de decisão do P17 seria da camada Alexandria.
- **Exercícios e aparato.**
  - Nenhum exercício do §Ex tem vínculo de aula nem critério próprio. Os 6 exercícios das fichas da Aula 08 são de aula e não têm gabarito na ficha.
  - Nenhum termo declara vínculo com aula.
  - O checklist não tem mecânica.
  - O quiz não tem persistência e mostra correção por cor (classes `right`/`wrong`).
- **Referências.** Nenhuma tem URL nem domínio (zero `<a>` e zero `<em>` no §Ref), nem campo de instituição separado.
- **Anotações a revisar.**
  - `marcacao_p14` (critérios e checklist), `kind_sugerido` e `leitura_desta_extracao` são inferências desta extração
    e precisam de revisão humana.
  - As falhas de renderização possíveis no código não foram medidas na tela, porque nada do M14 além das aulas está
    renderizado.
- **Sigla FC (P21).** O INST·06 rotula uma saída "FC dentro da safra" (fator de capacidade), e o léxico tem "Fator de
  capacidade" com homônimos no M03 e no M08. Na camada de produto, vale FCap.

## Uso pelas peças (camada Alexandria, depois)

| Necessidade | Onde está | Cuidado |
|---|---|---|
| Página do módulo (C1) | `modulo.json`: identidade, pills, 8 cartões, critérios, roteiro | Título pelo catálogo (P24). Critério em 6 formas: mostrar sem escolher (P18). Horas `null`: não exibir "2 h" do código sem origem |
| Aulas com instrumento (C5) | `instrumentos.json` → `posicao`, entradas, formatação, ramos e `script.codigo_verbatim` | Portar por transliteração mecânica (§10). Registrar os defeitos do INST·07 e do INST·08, não corrigi-los em silêncio. Cenário "didático; fonte não declarada" (P19) |
| Tentativa antes da referência (C7) | `aparato.json` → 14 exercícios (`<details>` revela direto) e quiz com feedback idêntico | Nenhum critério por exercício. `points: 10` do código sem origem |
| Recursos do Módulo | INST·01 (fora de aula) e os 14 exercícios soltos | `RecursosDoModulo.tsx` ainda não registra `modulo-14` |
| Glossário | 158 termos com definição literal e família | Todos ausentes no código. 13 homônimos em outros módulos são verbetes distintos (ids namespaçados) |
| Caso e decisão (C8) | `aparato.json` → caso | "Parte 14" literal. Sem decisão pedida: o desafio é da camada Alexandria, só com fatos do caso (P17) |

## Verificação

Verificação adversarial independente (2026-09-17). Parser próprio (fora de `extratores/`), sem reaproveitar a
árvore de elementos dos extratores:
- **Verbatim.** Todas as strings de conteúdo dos três JSONs foram testadas contra a fonte normalizada. Amostra
  completa, não parcial: quiz 10/10 (40 alternativas, gabarito e explicações contra `var Q` avaliado), checklist
  26/26, fórmulas de instrumento 30 + 7, scripts 10/10 linha a linha, 158 termos e 14 exercícios contra o código.
  Só sobraram saídas calculadas em tempo de execução e anotações.
- **Origens.** Todas a ±3 linhas.
- **Contagens.** Todas as contagens declaradas foram recalculadas direto no HTML e conferem (seções, aulas,
  instrumentos, campos, seleções, ramos, termos, famílias, homônimos, exercícios, checklist, quiz, referências por
  grupo, datas por extenso, URLs, erros, voz, cartões, pills, "GridAlpha").
- **Divergências.** As 28 foram conferidas na fonte, no código e no catálogo. Nenhuma foi inventada.
- **Correções aplicadas.**
  1. `instrumentos.json`/`.md`: o `trecho_inicial` do bloco anterior ao INST·02 tinha ": " entre nome e equação, e
     esse texto não existe na fonte. Corrigido também em `m14_instrumentos.mjs`.
  2. `aparato.json`/`.md`: faltava registrar os 6 exercícios embutidos nas fichas de rota da Aula 08
     (`div.emp-row.aberto`, L2357–L2417, instrução em L2344). Acrescentados com origem, fora da contagem do §Ex.
     Nenhum extrator gera esse campo: se `m14_aparato.mjs` rodar de novo, ele some.
  3. `extratores/verificacao.json` foi regerado com `m14_verify.mjs`: 1.951 strings, 431 origens, 25 exatas, 0 falhas.
- **Manual.** As seções "Verificação" dos três .md foram escritas à mão, e o `m14_md.mjs` não as gera.
