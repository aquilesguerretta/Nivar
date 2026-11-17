# Extração M12 — Geopolítica Energética do Brasil

Esta é a camada **fonte** do Módulo 12: texto literal, sempre com origem, e sem nenhuma contradição resolvida. A
fonte é `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo12.html` (4.059 linhas, 18 `section`, script
L3114–4057), lida só para leitura. As resoluções P17–P24 (ver
[`../../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md))
valem para a camada de produto e não foram aplicadas aqui.

## Arquivos

| Grupo | Arquivos | Conteúdo | Verificação |
|---|---|---|---|
| modulo | `modulo.json`, `modulo.md` | identidade, tese (§00), §MAP, roteiro de 18 seções, critérios, §Voz, princípios, §Erros, fichas, callouts, 13 divergências, comparação com catálogo e código | 747 strings e 139 origens, 0 falhas |
| aparato | `aparato.json`, `aparato.md` | §Caso, §Quiz, §Final, índice do §Ex, §Ref e §Lex | 1.146 strings e 266 origens, 0 falhas |
| instrumentos | `instrumentos.json`, `instrumentos.md` | os 11 `Inst · NN`: markup, script verbatim, dados, ramos, cenário-padrão e comparação com o código **por execução** | 978 strings e 114 origens, 0 falhas |

**Extratores** (em `extratores/`, Node 24, sem dependências):
- `m12_lib.mjs`: leitura, origem, percorredor de elementos balanceados e literais do script.
- `ts-hooks.mjs`: importa os `.ts` de `src/lib/data` por type stripping, só para leitura.
- `m12_dom.mjs`: DOM simulado que roda o `<script>` original sem alteração.
- `m12_modulo.mjs`, `m12_aparato.mjs` e `m12_instrumentos.mjs`: um por grupo.
- `m12_cobertura.mjs`: cobertura por token de cada seção de aparato, hero/rodapé, markup dos instrumentos e questões
  do quiz contra as strings dos três JSONs; roda o `m12_verify.mjs` e grava `verificacao.json`.
- `m12_verify.mjs`: confere que toda string de conteúdo é substring da fonte e que toda origem está na linha declarada
  (±3).

Para regenerar, rode `node m12_modulo.mjs && node m12_aparato.mjs && node m12_instrumentos.mjs && node m12_cobertura.mjs`
dentro de `extratores/`.

O M12 usa o vocabulário dos M04+ (`sec-id`, `lede`, `inst`, `det-bd`, `box`, `fi`), não o do M01. Por isso os
extratores do M01 serviram de **modelo de saída**, não de código reaproveitável.

## Verificação (`verificacao.json`)

- **Literalidade.** 2.871 strings de conteúdo (747 + 1.146 + 978) são substring da fonte; 519 origens (139 + 266 + 114)
  estão na linha declarada (±3). Nenhuma falha.
- **Cobertura por token.** 100% em hero e rodapé, §00, §MAP, §Caso, §Erros, §Ex, §Quiz (markup e script), §Voz,
  §Final, §Lex, §Ref e markup dos 11 instrumentos.
- **Corpo das aulas.** Fica fora do escopo (não há `aula-NN.json` nesta rodada); a cobertura de 95,55% é só
  informativa.

## Contagens

| Item | Contagem | Observação |
|---|---|---|
| Seções | **18** | 8 aulas e 10 aparatos |
| Aulas | **8** | fonte, pill, código e `AULAS_POR_BLOCO` concordam |
| Instrumentos | **11** | 10 de aula e 1 fora de aula (INST·01 no §MAP) |
| Termos (§Lex) | **152** | 8 famílias; prosa, pill, famílias e markup concordam; **0 no código** |
| Exercícios | **14** | **todos sem aula**; 8 com "Enunciado."; tipos: Sustentação 5, Atualização 3, Articulação 4, Classificação 2; 4 cronometrados |
| Checklist (§Final) | **28** | P14 inferido: 28 autodeclarados, 2 cronometrados, 7 orais ou livres |
| Quiz | **10 × 4** | gabarito c a d b d a b c a d; 2 faixas (≥8 pass / <8 fail) |
| Caso | 2 subseções, 13 blocos, 5 perguntas, tabela 5×3 | `dados: null`, `decisao: null` |
| Referências | **34** | 34 com URL, 2 com texto de link encurtado, 7 com data no título |
| Erros comuns | **20** | erro + correção, sem aula |
| Roteiro oral (§Voz) | 5 trechos | Minutos 0–2 … 8–10 |
| Fichas de campo fixo | 6 | contador em duas séries ("de 4" e "de 6") |
| Callouts (`div.box`) | 24 | 9 "Onde isso entra no produto", 6 "Números vivos" |
| Perguntas do §MAP por aula | **0** | há só as 3 "Pergunta de verificação" do INST·01 |
| Laboratórios / Tradutor | 0 / 0 | o equivalente ao Tradutor é o `div.lv` "três níveis" do §MAP |
| Critérios literais | 5 formas | conversa, quiz, §Ex, §Final, §Voz |

## Estado no código

Arquivos comparados, todos só para leitura: `alexandria-modulo-12-content.ts`, `alexandria-instrument-calculators.ts`,
`alexandria-curriculo.ts`, `alexandria-trilhas.ts`, `alexandria-glossario.ts`, `alexandria-badges.ts` e
`alexandria-blocks.ts`.

- **Aulas.** 8/8 com `title` = h2 e `subtitle` = rótulo. O lead só difere por espaço antes da pontuação.
- **Instrumentos.** 11/11 portados em código.
  - **4 portados** sem diferença de conteúdo: 02, 04, 05 e 09.
  - **7 divergentes**: **08 e 07 com texto de veredito inventado** e cobertura média de só 45% e 38% do texto da fonte (mínima 22% e 25%); 11 com as âncoras
    coladas por vírgula; 10, 01, 06 e 03 com rótulos trocados.
  - Todos os literais de dado são idênticos à fonte.
- **Exercícios.** 14 soltos. `prompt` = summary, `gabarito` = Enunciado + Resposta-modelo, `points: 10` sem origem.
- **O que não está no código.** Tese, §MAP, critérios, §Caso, §Erros, §Quiz, §Voz, §Final, §Ref e §Lex (0/152).
- **Números sem origem.** Horas 4–5 (`bloco-12`) e as 5 gravuras `geo-*` não vêm da fonte.

## Divergências (resumo; detalhe nos `.md` e nos JSONs)

**Fonte × fonte**
- O critério aparece em quatro formas: conversa de 30 min, quiz 8/10, §Ex e §Voz (div-m-04, P18).
- A intro do INST·02 diz "três campos", mas há 4 (div-m-09).
- As fichas contam "1–4 de 4" e depois "5–6 de 6" (div-m-12).
- A taxonomia tem "seis categorias", mas o INST·10 tem uma classe 0 (div-m-13).
- "nunca published" (div-m-10) e "CBAM" sem glosa (div-a-08).
- 6 exercícios não têm parágrafo "Enunciado." (div-a-03).
- 2 links têm texto encurtado (div-a-04).
- Nomes próprios no §Ref × taxonomia (div-m-11).

**Fonte × decisões e marca**
- O caso é "Operação A — **Parte 12**", ao passo que P17 foi decidida sobre o M01 ("não existe Parte 1") (div-m-05).
- "GridAlpha" aparece no kicker, no box.gd da Aula 02 e no rodapé (div-m-06, P24).

**Fonte × código**
- Horas 4–5 (div-m-01) e gravuras (div-m-07).
- Lead com espaço antes da pontuação (div-m-08).
- Instrumentos 07, 08, 11, 10, 01, 06 e 03 (ver `instrumentos.md`).
- Exercícios: enunciado dentro do gabarito e `points` (div-a-01/02).
- Glossário ausente (div-a-05) e aparato ausente (div-a-06).

**Fonte × catálogo**
- O título "Geopolítica Energética do Brasil" é **igual** no h1, no catálogo e em `bloco-12`.
- As 8 aulas do catálogo batem com a fonte.
- Diferenças:
  - a trilha é atribuída pelo catálogo (div-m-02);
  - o catálogo encurta o nome de 8 instrumentos (div-m-03);
  - o catálogo lista subconjuntos de termos por família, com nomes e contagens iguais (div-a-07).

## Lacunas (a fonte não tem)

- **Módulo.**
  - Faltam horas, eixos (a fonte fala em "vetores" e "frentes"), "Resultado esperado"/capacidades, perguntas do §MAP
    por aula, § Lab e Tradutor.
  - Duração, dificuldade e vídeo das aulas também faltam; não há `<img>`/`<video>`.
- **Aparato.**
  - Nenhum item (quiz, checklist, exercício, erro, referência, termo) declara aula.
  - O caso não tem dado numérico nem decisão pedida, e as perguntas dele são dirigidas ao investidor, não ao learner.
  - As referências não trazem os campos D5 nem data própria (a única data é a de consulta, no h2).
- **Instrumentos.**
  - Nenhum tem pergunta própria, tolerância, gabarito ou previsão.
  - O INST·10 não tem srcnote.
  - Nenhum número dos cenários foi verificado contra fonte primária (P19/P20).
- **Anotações a revisar.** `marcacao_p14` (checklist, critérios, exercícios) é inferência desta extração.
- **Instrumentos 02 e 09.** A comparação usou uma grade (243 e 227 casos), não o espaço contínuo inteiro.

## Uso pela camada Alexandria (P17–P24)

| Achado | Resolução aplicável |
|---|---|
| Caso sem decisão e com "Parte 12" | P17: Desafio de decisão da camada Alexandria só com fatos do caso; a numeração de parte fica na proveniência |
| Critério em cinco formas; quiz 8/10 | P18: separar conclusão, desempenho e evidência; o quiz não aprova |
| Cenários dos instrumentos sem fonte verificada | P19: "Cenário didático presente no módulo; fonte externa dos valores não declarada" |
| Faixas e limiares dos scripts (07, 08, 09) | P20: content QA |
| Glossário 152 | P22: derivar a contagem da coleção (hoje vazia no código) |
| GridAlpha em kicker, rodapé e box.gd | P24: Alexandria/NIVAR; o catálogo governa o título (igual ao h1) |

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

**Correções aplicadas** (extrator corrigido e `m12_modulo.mjs`, `m12_aparato.mjs` e `m12_cobertura.mjs` rodados de
novo; o diff dos JSONs contra a cópia anterior mostra só estas mudanças):

1. **div-m-14 removida: era divergência inventada.** Em `alexandria-trilhas.ts`, o comentário vem **acima** da
   entrada que descreve. O "SÉTIMO e último módulo da Trilha 2" está acima de `'bloco-12'`, e o "SEGUNDO", o
   "TERCEIRO" e o "QUARTO" estão acima de 14, 15 e 16, com aulas que conferem (9 no 15, 10 no 16). Logo, o "PRIMEIRO
   módulo da Trilha 3" (L79) descreve o **bloco-13**, não o M12. Código, content e catálogo concordam: M12 na Trilha 2.
   Com isso, `divergencias_modulo` passa de 14 para **13**.
2. **div-a-04 e ref-08.** O extrator tirava a barra final só do href, e o ref-08 (texto igual à URL, com barra) virou
   um falso "encurtado". Agora `link_texto_igual_url` do ref-08 é `true`, e `link_encurtado` passa de 3 para **2**
   (ref-10 e ref-24).
3. **div-m-03, nota.** Nem todos os 8 nomes são cortados no travessão: 7 são (02, 03, 04, 05, 06, 09 e 10), e o 11 perde
   ", sem repetição".
4. **modulo.md.** Os 4 callouts cy ficam em §00, Aulas 02 e 05 e §Caso (antes: "de aula/caso").
5. **Cobertura informativa do corpo das aulas.** Passou de 95,55% para 95,54% por causa da remoção da div-m-14.

**Contagens corrigidas:** `divergencias_modulo` 13 e `referencias.link_encurtado` 2. As demais contagens declaradas
conferem.

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

**Correções da segunda verificação:**
- **Leituras literais.** div-m-10, div-a-07 e div-a-08 têm agora `leitura_b` literal. Antes eram paráfrase ou
  repetiam a `leitura_a`.
- **INST·11.** A frase sobre o relógio foi precisada em `instrumentos.md`.
- **Cobertura informativa.** Passou a 95,55%.

Nenhuma contagem declarada mudou. A extração está estruturalmente correta.
