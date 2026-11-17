# M12 · grupo "aparato"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo12.html`.
Saída: [`aparato.json`](aparato.json). Extrator: [`extratores/m12_aparato.mjs`](extratores/m12_aparato.mjs).

**Verificação.** 1.146 strings de conteúdo são substring da fonte, e as 266 origens estão na linha declarada (±3).
Nenhuma falha. As questões do quiz saem da avaliação do literal `var Q` do script (L3941–4012), sem digitação.

## Caso — "Operação A — Parte 12" (§Caso, L2291)

- **Título na fonte.** O rótulo é "Operação A — Parte 12", e o h2 é "Quando o capital estrangeiro bate na porta de uma
  operação de porte médio". A fonte numera a parte, e o lede remete às "onze partes anteriores" e à "Parte 11"
  (div-m-05 em `modulo.json`).
- **Estrutura.** São 13 blocos: lede, §C.1 "A conversa que o CBAM torna cada vez mais comum" e §C.2 "O que a política
  de minerais críticos poderia mudar, e o que ainda não dá para saber".
- **Perguntas (5).** Quatro perguntas em `ol.stp`, cada uma com título e etiqueta de vetor, que "a Operação A
  precisaria fazer antes de olhar o número":
  1. "quem compra a participação quando este investidor sair, e a Operação A tem direito de preferência?"
  2. "a exposição cambial do financiamento é natural ou adicional à que já existe?"
  3. "o que exatamente o contrato me impede de fazer daqui a cinco anos?"
  4. "qual é o prazo de firmeza da proposta, e o que é condição suspensiva?"

  O quinto item é verificação interna: "A Operação A tem inventário corporativo, tem inventário de produto, ou não tem
  nenhum dos dois?". **Nenhuma** delas é pergunta ao learner.
- **Tabela §C.2.** 5 linhas × 3 colunas: Frente / "O que o texto aprovado na Câmara prevê" / "O que ainda não dá para
  saber".
- **`dados: null`.** O lede declara "nunca valor específico, operação sempre anonimizada".
- **`decisao: null`.** A fonte recusa decisão: "A leitura correta não é "aceite" nem "recuse"". O Desafio de decisão
  fica para a camada Alexandria (P17).
- **Vínculos em prosa.** Aula 05, Instrumento 07 e Módulo 11.

## Quiz (§Quiz + script)

São 10 questões com 4 alternativas cada. O gabarito, na ordem, é **c a d b d a b c a d**. Cada questão tem uma
explicação (`f`), que o script mostra em todas as questões ao corrigir, respondidas ou não.

| # | Tema (início do enunciado) | Gabarito |
|---|---|---|
| 01 | "87% de energia renovável": resposta correta | c |
| 02 | Estado do regime de incentivos ao hidrogênio em 2/8/2026 | a |
| 03 | Situação da política de minerais críticos | d |
| 04 | O preço de carbono brasileiro reduz a exposição ao mecanismo europeu? | b |
| 05 | O que o tratamento tarifário americano de 2026 revela | d |
| 06 | Presidência brasileira da COP em 2/8/2026 | a |
| 07 | Por que há dois números para a reserva de terras-raras | b |
| 08 | Aquífero Guarani como "reserva hídrica estratégica" | c |
| 09 | Créditos fiscais americanos à eólica e solar | a |
| 10 | Capacidade de hidrogênio anunciada × polo exportador | d |

- **Faixas.** `acertos>=8` dá a classe `pass` ("Critério atingido. …"); `acertos<8` dá a classe `fail` ("Abaixo do
  critério de oito acertos. …"). O texto das mensagens está em `modulo.json`, `criterio` `m12-crit-quiz`.
- **Botões.** "Corrigir" e "Refazer". Não há persistência.
- **Vínculo de aula.** Nenhuma questão declara aula (`vinculo_aula: null`).

## Checklist final (§Final)

São **28 itens** (o h2 diz "Vinte e oito itens"), em lista estática sem script. Os itens 1 e 28 estão em negrito. A
marcação P14 fica em `modulo.json`.

## Exercícios (§Ex) — índice (P9)

| Nº | Tipo | Tem "Enunciado."? | Resposta de referência | P14 | Aula |
|---|---|---|---|---|---|
| 01 | Sustentação | sim | Resposta-modelo | cronometrado (2 min) · oral | — |
| 02 | Atualização | sim | Resposta-modelo | oral | — |
| 03 | Articulação | sim | Resposta-modelo | oral | — |
| 04 | Classificação de nome | sim | Resposta-modelo | classificação · oral | — |
| 05 | Sustentação | sim | Resposta-modelo | cronometrado · oral | — |
| 06 | Atualização | sim | Resposta-modelo | oral | — |
| 07 | Articulação | **não** | Resposta-modelo | oral | — |
| 08 | Sustentação | **não** | Resposta-modelo | cronometrado · oral | — |
| 09 | Classificação de número | sim | Resposta-modelo | classificação · oral | — |
| 10 | Articulação | **não** | Resposta-modelo | oral | — |
| 11 | Sustentação | **não** | Resposta-modelo | cronometrado · oral | — |
| 12 | Atualização | **não** | Resposta-modelo | oral | — |
| 13 | Articulação | sim | Resposta-modelo | oral | — |
| 14 | Sustentação final | **não** | Resposta-modelo | oral | — |

- **Rótulo literal.** Cada exercício guarda `summary_literal` ("Exercício 01 · Sustentação — …"), além de `numero`, `tag` e
  `resumo` decompostos.
- **Vínculo de aula.** Os **14 estão sem aula**: nenhum summary aponta aula, e a prosa não cita "Aula NN". O 14 cita o
  "Módulo 11", o que não é tag de posse.
- **Critério próprio.** Nenhum exercício tem. O critério comum vem do lede: responder em voz alta antes de abrir o
  gabarito.
- **Enunciado ausente.** Nos 6 exercícios sem "Enunciado.", a consigna é o próprio resumo do `summary`.
- **No código** (`MODULO_12_EXERCICIOS_SOLTOS`, 14 itens):
  - `prompt` = summary em 14/14.
  - `config.gabarito` = Enunciado + Resposta-modelo concatenados em 14/14; nos 8 que têm enunciado, ele fica escondido
    no gabarito (div-a-01, gate C7).
  - `points: 10` não tem origem (div-a-02).

## Referências (§Ref)

- **Total.** São **34** itens (o h2 diz "Trinta e quatro fontes, todas consultadas em 2 de agosto de 2026"). Cada um
  tem `span.src` "Instituição · categoria", título e link. Todos têm URL.
- **Links encurtados.** Em 2 itens, o texto do link encurta a URL: ref-10 (Câmara, sem `?idProposicao=2621643`) e
  ref-24 (Comissão Europeia, caminho cortado) (div-a-04). No ref-08 (Lei 15.269) o texto é igual à URL; a URL é que
  aponta para um diretório (`…/2025/lei/`), sem o arquivo da lei — ponto de content QA, não de texto de link.
- **Datas.** 7 itens trazem data no título: ref-05, 06, 07, 19, 20, 25 e 27. A data de consulta é única, vinda do h2.
- **Instituições.** EPE/MME, MME (×3), ANP (×2), Planalto (×4), Senado, Câmara, Ministério da Fazenda (×2), ANM (×2),
  SGB, USGS, UNFCCC (×2), Presidência da COP30, MMA, Comissão Europeia (×2), Registro federal dos EUA, USTR, Congresso
  dos EUA, Itamaraty, AIE, "Instituto internacional de pesquisa em energia" (Ember), "Centro de estudos de política
  externa" (CFR), "Centro de estudos regionais" (Wilson Center), BCB e MDIC.
- **Campos que faltam.** Os campos D5 (o que responde, tema, recorte, última verificação) não existem na fonte.

## Glossário (§Lex)

As contagens concordam em **152** termos: h2 "Cento e cinquenta e dois termos", pill "152 termos", soma das famílias
declaradas = 152, markup = 152, `span.term` no arquivo = 152. Cada família também confere (declarados = contados).

| Família | Termos |
|---|---|
| 1 · Grandezas e contabilidade energética | 19 |
| 2 · Instituições, normas e instrumentos brasileiros | 20 |
| 3 · Clima, carbono e compromissos | 20 |
| 4 · Comércio, tarifa e instrumentos externos | 19 |
| 5 · Capital, financiamento e condicionalidade | 18 |
| 6 · Hidrogênio e derivados | 19 |
| 7 · Minerais, mineração e cadeia de valor | 19 |
| 8 · Método de análise geopolítica | 18 |

- **No código.** `alexandria-glossario.ts` tem **0** verbetes `gl-m12-*`, então **os 152 faltam** (lista completa em
  `glossario.termos[]`, com definição literal e origem).
- **Homônimos.** 12 termos têm homônimo em outro módulo do código, com definição própria (não é duplicata a fundir):
  Matriz elétrica, Matriz energética, Oferta Interna de Energia, Oferta Interna de Energia Elétrica, Balanço Energético
  Nacional, Capacidade instalada, Geração efetiva e Consumo final (M08); Ano-base (M07); Curtailment (M02, M03); Lei nº
  15.269/2025 e Verticalização (M06).

## Divergências

1. **div-a-01.** No código, o enunciado fica escondido no gabarito em 8 exercícios.
2. **div-a-02.** `points: 10` não tem origem.
3. **div-a-03.** 6 exercícios não têm parágrafo "Enunciado.".
4. **div-a-04.** O texto do link encurta a URL em 2 referências (ref-10 e ref-24).
5. **div-a-05.** O glossário do M12 não existe no código.
6. **div-a-06.** Caso, quiz, checklist e referências estão ausentes em `src/lib/data`.
7. **div-a-07.** O catálogo lista subconjuntos de termos por família.
8. **div-a-08.** A sigla "CBAM" aparece uma única vez, no h3 do §C.1, sem glosa.

## Verificação

Verificador adversarial independente (2026-09-17), com script próprio, sem reaproveitar o `m12_verify.mjs`.

- **Quiz, 100%.** O literal `var Q` (L3941–4012) foi avaliado de novo. Enunciado, 4 alternativas, gabarito e
  explicação são **idênticos** nas 10 questões. O gabarito confere: c a d b d a b c a d.
- **Checklist, 100%.** Os 28 `li` de `ul.ck` conferem com `html`, `texto` e negrito (itens 1 e 28).
- **Erros, referências e glossário, 100%.** Os 20 erros, as 34 referências (rótulo, título, URL e texto do link) e os
  152 termos (termo e definição) conferem.
- **Exercícios, 100%.** Os 14 conferem: summary, 8 enunciados, resposta-modelo inteira e os 6 sem enunciado com
  `null`.
- **Fórmulas, 100%.** As 13 `funcoes_verbatim` dos instrumentos são substring **exata** do script, nas linhas
  declaradas. As 24 condições e expressões de ramo conferem depois de colapsar o espaço.
- **Amostra geral.** 1.664 strings de conteúdo com mais de 25 caracteres, nos três JSONs, conferidas contra a fonte.
  Não houve falha em campo de conteúdo. Os 30 não casamentos são campos de contexto: nome de gravura do código, id de
  glossário, `mensagem_ref`, `trecho` de menção cortado no meio de tag e `texto_literal_concatenado` com "…".
- **Origens.** As 519 origens foram conferidas pelo `trecho_inicial`, com tolerância de ±3 linhas. Nenhuma ficou
  fora.
- **Contagens recontadas no HTML (grep/regex próprios).** Todas conferem: 18 `section`, 8 `Aula NN`, 11 `div.inst`,
  22 `details` (14 do §Ex e 8 do §Lex), 8 "Enunciado.", 152 `span.term` (19/20/20/19/18/19/19/18), 6 `div.fi`, 24
  `div.box` (9 gd, 6 rd e 9 cy), 28 itens de checklist, 20 erros, 34 referências, 10 questões × 4, 10 `srcnote` (o
  INST·10 não tem), 3 "Pergunta de verificação" (uma por lente), 12 homônimos no glossário do código e 0 `gl-m12`.
  A única contagem errada foi a de links encurtados (ver abaixo).

**Correção neste grupo:**
- **ref-08.** `link_texto_igual_url` passou de `false` para `true`. O texto e a URL são iguais; a diferença vinha só
  da barra final, que o extrator removia de um lado apenas.
- **Contagens e div-a-04.** `contagens.referencias.link_encurtado` passou de 3 para 2, e a div-a-04 cita agora só o
  ref-10 e o ref-24.
- **Extrator.** `m12_aparato.mjs` foi corrigido.

### Segunda verificação (2026-09-17)

Um segundo verificador adversarial conferiu tudo de novo, com scripts próprios em Python e Node.

- **Varredura completa.** Todas as 2.398 strings de conteúdo com mais de 12 caracteres, nos três JSONs, foram
  conferidas contra a fonte. As 77 que não casam são só de três tipos:
  - leituras descritivas de divergência;
  - saídas renderizadas do script (`cenario_padrao_renderizado`);
  - rótulos do lado do código.
- **Números do cenário-padrão.** Foram recalculados à mão: INST·02 dá 49,7 · +37,1 · −0,3 · 16,5, e INST·09 dá
  24,7% · 0,0051% · 4.818× · 1.050.000.
- **Origens.** As 519 conferem (±3 linhas).
- **Conferência integral.** Quiz (10 × 4, gabarito c a d b d a b c a d, linhas), checklist (28), erros (20),
  referências (34), termos (152), exercícios (14) e as 13 funções e 24 ramos dos instrumentos conferem.
- **Contagens recontadas.** Todas as contagens declaradas conferem, entre elas:
  - 7 referências com data de mês no título;
  - 5 perguntas do caso (4 `li` mais o "quinto item" em prosa);
  - lead 3/8 exato e 8/8 depois de normalizar;
  - 12 homônimos.
- **Divergências.** Foram rechecadas contra a fonte, o código e o catálogo. Nenhuma é inventada.
- **Falhas de literalidade.** Três leituras com cara de citação estavam parafraseadas ou repetidas e foram corrigidas
  nos extratores. Depois disso, os quatro extratores rodaram de novo.

**Correções neste grupo:**
- **div-a-07, `leitura_b`.** Antes era idêntica à `leitura_a` (mesmos nomes e contagens de família). Agora é o trecho
  literal do catálogo da Família 1, com os 12 nomes citados para 19 verbetes. A nota agora diz que nomes e contagens
  coincidem e que a diferença é só de recorte e de agrupamento com "×".
- **div-a-08, `leitura_b`.** A paráfrase deu lugar ao literal do lede do §Lex e ao nome do verbete da Família 4. O
  "sem a sigla" passou para a nota.
- **Cobertura informativa do corpo das aulas.** Passou de 95,54% para 95,55%, porque a nova leitura literal cobre
  uma palavra a mais.
