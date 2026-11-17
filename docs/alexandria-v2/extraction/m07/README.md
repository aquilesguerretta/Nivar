# Extração M07: Estrutura Institucional do Setor Elétrico Brasileiro

**Camada fonte.** Esta extração é literal e registra a origem de cada item. A fonte é o HTML do M07
(`C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo07.html`: 3.039 linhas, 378.316 bytes, LF, script em
L1918–3035), lido só para leitura. Nenhuma contradição foi resolvida aqui; as duas leituras ficam em `divergencias[]`.
As decisões P17–P24 ([`../../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md))
valem para a camada Alexandria, no produto. Nos JSONs, elas só aparecem como notas.

## Arquivos

| Grupo | Arquivos | Conteúdo | Verificação |
|---|---|---|---|
| modulo | `modulo.json`, [`modulo.md`](modulo.md) | identidade, horas, tese, § MAP, roteiro de 17 seções, contagem de aulas, 15 critérios (P14), § Voz, princípios, § Erros, blocos de produto (P7), comparação com o código e o catálogo | 538 strings e 196 origens, 0 falhas |
| aparato | `aparato.json`, [`aparato.md`](aparato.md) | caso (Operação A · Parte 7), quiz, checklist final, exercícios, referências, glossário | 1.136 strings e 312 origens, 0 falhas |
| instrumentos | `instrumentos.json`, [`instrumentos.md`](instrumentos.md) | os 10 instrumentos: entradas, fórmulas e ramos literais, cenário-padrão executado, itens, posição e invocações, comparação com o código, 1 divergência interna | 1.843 strings e 132 origens, 0 falhas; calculadoras 04/06 idênticas ao original em 6.300 combinações |

**Extratores** (`extratores/`, Node 24, sem dependências):

| Arquivo | Função |
|---|---|
| `m07_lib.mjs` | Utilitários de texto e origem, fatiamento de `section`, walker de blocos, avaliação de literais JS e TS |
| `m07_sim.mjs` | Executa o `<script>` original em DOM simulado |
| `m07_modulo.mjs`, `m07_aparato.mjs`, `m07_instrumentos.mjs` | Geram os três JSONs |
| `m07_verify.mjs` | Verificação adversarial; grava `verificacao.log.json` |
| `m07_verify_estrito.mjs` | Segunda passada, sem pular caminhos de conteúdo; grava `verificacao_estrita.log.json` |

Para regenerar, rode os quatro na ordem `instrumentos → aparato → modulo → verify`.

**Diferença de vocabulário.** O vocabulário do M07 (`sec-id`/`lede`/`inst`/`fi`/`box`) não é o do M01
(`aula-marker`), então os extratores do M01 foram reescritos, não reaproveitados. O M07 também não tem
`aula-NN.json`: este pedido cobre módulo, aparato e instrumentos.

## Contagens

| Item | Fonte (markup) | Prosa da fonte | Código atual |
|---|---|---|---|
| Aulas | **7** | "7 aulas" (hero) | 7 (`MODULO_07_AULAS`, `AULAS_POR_BLOCO`) |
| Seções | 17 (7 aulas + 10 aparatos) | — | — |
| Instrumentos | **10** (1 de módulo, no § MAP; 9 de aula, sendo 3 na Aula 07) | "10 instrumentos" | 10 (9 de aula + `m07-inst-01`) |
| Itens dos exploradores | 8 fichas (Inst 01), 11, 7, 5, 9, 12, 12, 12 | intros conferem | igual, mas com o corpo truncado |
| Termos do glossário | **118** em 7 grupos | "118 termos" | 118 idênticos |
| Exercícios | **12** (6 de roteamento, 6 de navegação); 0 com aula, 12 soltos (P9) | "Doze exercícios" | 12 soltos, com divergências |
| Checklist final | **26** | "Vinte e seis afirmações" | não extraído |
| Quiz | **10** questões × 4 alternativas; 2 faixas de placar | "10 questões · critério 8/10" | não extraído |
| Referências | **27** (24 com URL) | "Vinte e cinco fontes" | não extraído |
| Fichas institucionais | 8 | "8 fichas institucionais" | **ausentes** do corpo |
| Perguntas-relâmpago, ataques, movimentos | 40, 7, 8 | "40", "Sete", "oito" | não extraído |
| Erros comuns | 18 | "Dezoito frases" | não extraído |
| Critérios literais | 15 (marcados pelo P14) | — | — |
| Caso | 5 subseções, 4 perguntas da própria fonte (já respondidas), decisão `null` | "Parte 7" | não extraído |

## Divergências principais

A lista completa está em cada JSON: 13 em módulo, 9 em aparato e as `codigo.divergencias` de cada instrumento.

**Fonte × fonte.**
- O § Ref declara "Vinte e cinco fontes, todas primárias", mas tem 27 itens, e um deles é "GridAlpha · documentos
  internos".
- O § 00 diz "Os seis módulos anteriores", mas enumera cinco.
- "Módulo 07" convive com "Bloco 7".
- O critério aparece em três formas que se somam: "duplo" (oral em 15 s + navegação), "8/10" e 26 afirmações.
- Os retornos do quiz Q03, Q08 e Q10 (Inst·01, Inst·02) e Q02, Q05, Q06, Q07 e Q08 (Inst·08, que vive na Aula 07) apontam instrumentos que estão em outra seção.
- A etapa b do Inst 04 se chama "Elaboração de minuta e AIR" no campo e "Minuta e análise de impacto" na barra.
- As travas: "trava 4" (linguagem, no caso) e "Trava 1" (independência). No M01, a trava de linguagem é 3 ou 4 (P23).

**Fonte × decisões.**
- O caso é numerado "Parte 7" (P17).
- O quiz diz "Critério de domínio atingido" e "não avance" (P18).
- "GridAlpha" aparece 8 vezes, inclusive no kicker e no rodapé (P24).
- O quiz e os vereditos usam classes de semáforo.

**Fonte × código.**
- **Corpo das Aulas 01–06:** a cobertura por token é de 49–76%. Faltam as **8 fichas institucionais** (`div.fi`), 6
  `ol.num-list`, 4 `ol.stp` e 2 `h4`. A Aula 07 tem 99,9%.
- **Exploradores 02, 03, 05 e 07:** o código guarda só a 1ª linha de cada ficha.
- **Inst 08 e 09:** os cartões perderam os rótulos.
- **Inst 10:** o "3" do chip virou texto, e faltam a camada fixa e os rótulos.
- **Inst 01:** o SVG não foi portado, e o rótulo "Órgão" e a `note` não têm origem.
- **Inst 04 e 06:** o cálculo é idêntico. Faltam o readout textual "Regime", a unidade, as barras e a classe do
  veredito.
- **Exercícios:** os parágrafos foram concatenados; ex-03, ex-07 e ex-11 têm espaço antes da pontuação; `points: 1` não
  tem origem.
- **Fora do código:** caso, quiz, checklist, § Voz, § Erros, tese, cartões do § MAP e § Ref existem só no HTML.
- **Gravuras:** a fonte não tem nenhuma; as `ins-*` do código vêm do acervo.

**Fonte × catálogo.**
- **Título:** a fonte e o catálogo canônico usam "…do Setor Elétrico Brasileiro"; o catálogo do repositório
  (`alexandria-blocks.ts`) usa "Estrutura Institucional Detalhada" (P24: não resolvido).
- **Referências:** o catálogo repete "25 fontes".
- **Trilha:** o catálogo diz "atribuída"; a fonte não declara.
- **Taxonomia:** `instrument-taxonomy.md` ainda diz que o Inst · 01 "nunca foi materializado".

## Lacunas (a fonte não tem)

- **Módulo:**
  - não há "Resultado esperado" nem capacidades;
  - não há perguntas no § MAP (os cartões descrevem);
  - não há § Lab nem Tradutor;
  - não há eixos, trilha nem nível;
  - as horas só existem como string ("6–8h de estudo").
- **Caso:** não há tabela de dados nem decisão pedida. As perguntas já vêm respondidas pela própria fonte.
- **Quiz:** não há letras; o feedback é o mesmo para acerto e erro.
- **Exercícios:** nenhum tem critério próprio nem vínculo com aula.
- **Referências:**
  - 3 itens sem URL;
  - nenhum tipo de fonte;
  - nenhuma data de verificação por item (só a do módulo, 29/07/2026);
  - faltam os campos D5.
- **Glossário:** nenhum vínculo entre termo e aula.
- **Instrumentos:**
  - nenhuma pergunta própria (só as tarefas de previsão declaradas no Inst 01 e no Inst 08);
  - nenhuma fonte externa para os números (todos são "Didático/ilustrativo");
  - nenhuma tolerância.
- **Mídia:** duração, dificuldade, vídeo e imagens não existem na fonte (medido: 0 `<img>`/`<video>`/`<iframe>`).

## Segunda passada (2026-09-17)

A extração acima foi reexecutada e conferida de forma independente.

**O que foi feito.**
- **Reprodutibilidade.** Os 4 extratores foram rodados de novo. `modulo.json` e `aparato.json` saíram byte-idênticos, e
  `instrumentos.json` mudou só pelo acréscimo abaixo.
- **Ponto cego encontrado.** O `m07_verify.mjs` pula caminhos de conteúdo (`aulas`, `fichas_institucionais`,
  `tres_niveis`, `perguntas_da_fonte`, `entradas`, `saidas`, `vinculos`, `frase`, `valor`). O novo
  `extratores/m07_verify_estrito.mjs` pula só metadado e comparação com o código ou o catálogo, e grava
  `verificacao_estrita.log.json`.
- **Resultado da verificação estrita.**

  | Arquivo | Conferidas | Não encontradas |
  |---|---|---|
  | modulo | 751 | 12 |
  | aparato | 1.309 | 59 |
  | instrumentos | 2.540 | 255 |

  Todas as não encontradas foram inspecionadas. São ids de código, notas desta extração, rótulos compostos pelo
  script ("Questão N de 10", "0 / 10", "Ciclo anual · N", kicker · título) e HTML renderizado. Nenhuma é conteúdo
  parafraseado.
- **Recontagens diretas no HTML.** Todas conferem:
  - 7 `sec-id` "Aula NN" e 10 `div.inst`;
  - 118 `span.term` (16+17+15+14+18+22+16);
  - 26 `li` no § Final e 27 no § Ref;
  - 12 `details` no § Ex e 19 `tr` no § Erros (18 mais o cabeçalho).
- **Glossário, comparação independente.** Os 118 termos da fonte foram comparados um a um com os blocos `gl-m07-*` de
  `alexandria-glossario.ts`: 0 ausentes e 0 definições diferentes.
- **Fórmulas e ramos.** As 42 fórmulas e ramos dos Inst 04 e 06 são substrings literais do script. O cenário-padrão foi
  recalculado à mão:
  - Inst 04: 450/90, r = 0,2, veredito att;
  - Inst 06: 35/5/11, veredito ok.
- **Afirmações conferidas na fonte.**
  - "Os seis módulos anteriores" enumera 02–06 (L376).
  - "Linguagem — trava 4" (L1411) e "Trava 1" (L1373).
  - "GridAlpha" aparece 8 vezes, nas linhas listadas.
  - O catálogo canônico usa "Estrutura Institucional do Setor Elétrico Brasileiro" (L54, L637) e declara "25 fontes".
  - `alexandria-badges.ts` não tem entrada do M07.
  - Os ex-03, ex-07 e ex-11 do código têm o espaço espúrio.

**Acréscimo.** Uma divergência fonte × fonte nova, `instrumentos[m07-inst-04].divergencias_fonte`: a etapa b se chama
"Elaboração de minuta e AIR" no campo (L847) e "Minuta e análise de impacto" na barra (`var LB`, L2405). Ela é gerada
por comparação, não digitada.

Para regenerar: `instrumentos → aparato → modulo → verify → verify_estrito`.

## Uso nas peças (camada Alexandria, depois)

- **P17.** Título "Caso — Operação A", sem "Parte 7". O Desafio de decisão usa só os fatos de C.1–C.5.
- **P18.** Nenhum dos três critérios vira aprovação. "Concluído" vale só para consumo.
- **P19 e P20, por analogia.** Os valores dos Inst 04 e 06 são cenários didáticos sem fonte externa.
- **P21.** Não se aplica: o M07 não usa FC.
- **P24.** O nome principal vem do catálogo canônico. A marca GridAlpha fica só na proveniência.

## Terceira passada: verificador adversarial (2026-09-17)

Verificação independente, feita com scripts próprios direto no HTML. O detalhe está nas seções "Verificação" dos
três `.md`.

**Conferido.**
- **Com igualdade exata (100%):** o quiz (por avaliação de `var Q`), os 26 itens do checklist e as 84 checagens de
  fórmulas, ramos e entradas dos instrumentos.
- **Com igualdade exata, grupo inteiro:** as 40 perguntas-relâmpago, os 7 ataques, os 8 movimentos, os 18 erros, as
  27 referências, os 118 termos, os 12 exercícios e os 8 cabeçalhos de ficha.
- **Por substring:** as strings de conteúdo, mais de 1.300, sem nenhum texto ausente.
- **Origens:** 1.236, todas a até 3 linhas.
- **Contagens:** todas recontadas e confirmadas.

**Correção.** `instrumentos.json › etapas_barras[]` dos Inst 04 e 06 ganhou `origem`: são 11 itens que antes não
tinham origem. O extrator foi ajustado, e os logs foram regenerados; `m07_verify` agora confere 132 origens em
instrumentos.

**Observação.** Em `modulo.json › divergencias[]`, 2 das 13 entradas (`div-m07-lex-ordem` e `div-m07-horas`) são
verificações que conferem. Não são divergências.

## Quarta passada: reprodução (2026-09-17)

- **Entradas inalteradas.** A fonte (md5 `dfc63e0cea241ffb426e600f7abeebd5`, de 29/07/2026) e os arquivos de `src/lib/data` (de 16/09) são anteriores à extração.
- **Reprodução.** Os 5 extratores foram rodados de novo, na ordem `instrumentos → aparato → modulo → verify → verify_estrito`. Os três JSONs saíram byte-idênticos.
- **Verificação.** `verificacao.log.json` segue com 0 falhas (538 + 1.136 + 1.839 strings; 196 + 312 + 132 origens) e 0 contagens divergentes.
- **Recontagem no HTML.** Confere: 118 `span.term`, 10 `div.inst`, 12 `details` no § Ex, 26 `li` no § Final, 27 `li` no § Ref e 8 "GridAlpha".
- **Ausências confirmadas.** Não há "Resultado esperado", "Tradutor", "§ Lab"/"LAB·", `<img>`, `<video>` nem `<iframe>`.

## Quinta passada: verificador adversarial, 2ª rodada (2026-09-17)

Verificação independente, com scripts próprios no scratchpad, direto no HTML. O detalhe está na seção "Quinta
passada" de cada `.md`.

**Conferido.**
- **Com igualdade exata (100%):** o quiz, reavaliado de `var Q`, e os 26 itens do checklist.
- **Fórmulas, ramos e expressões dos instrumentos:** 80 campos, todos literais e a até 3 linhas.
- **Com igualdade exata, grupo inteiro:** as 40 perguntas-relâmpago, os 7 ataques, os 8 movimentos, os 18 erros, as
  27 referências, os 118 termos (também contra `alexandria-glossario.ts`) e os 12 exercícios.
- **Por substring:** mais de 4.300 strings. As não encontradas são só metadado ou composição declarada.
- **Origens:** 611, todas a até 3 linhas.
- **Contagens:** todas as contagens declaradas foram recontadas no HTML com método próprio, e todas conferem.
- **Cobertura:** todo nó de texto das seções que não são aula está nos JSONs. Dos 1.003 literais do script, só 2
  faltavam, ambos corrigidos abaixo.

**Correções.**
1. **Ramos do Inst 04.** `instrumentos.json › m07-inst-04.ramos[]` não tinha os 4 ramos do readout "Regime"
   (L2427–2430, forma `if(x){ reg='…'; }`, que o extrator não capturava). O extrator foi corrigido e o JSON
   regenerado.
   - **Efeito:** os ramos dos Inst 04 e 06 passam de 42 para 46; `m07_verify` passa a conferir 1.843 strings (antes
     1.839), com 0 falhas; `m07_verify_estrito` passa a conferir 2.559 (antes 2.540).
   - **Terceira passada:** ela declarava "100%" nesse grupo e deixou essa omissão passar.
2. **Divergência do quiz.** `aparato.json › div-m07-quiz-retornos-cruzados` estava incompleta pelo próprio critério.
   Faltavam os retornos Q02, Q05, Q06, Q07 e Q08, que citam o Inst·08 (Aula 07, L1314) junto de outra aula. A
   entrada foi completada no extrator e o JSON regenerado; a contagem continua 9.

**Reprodução.** `modulo.json` saiu byte-idêntico. Em `aparato.json` e `instrumentos.json`, os diffs se limitam às
duas correções acima.
