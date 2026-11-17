# Extração M17 — Cenário Internacional Comparativo

Camada **fonte** do M17: texto literal, com origem `{seletor, trecho_inicial, linha_aprox}`, ausências declaradas
(`null` + nota) e contradições registradas com as duas leituras, sem resolver nenhuma (as decisões P17–P24 valem na
camada de produto). A fonte é `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo17.html` (5.308 linhas,
só leitura).

## Arquivos

| Grupo | Arquivos | Conteúdo |
|---|---|---|
| modulo | `modulo.json`, `modulo.md` | identidade e pills do hero, §00 inteiro (36 blocos, 6 glosas), capacidades (só em blocos P7), §MAP (4 dimensões + grade 17), roteiro de 22 seções, 6 critérios literais com marcação P14, laboratórios (null), §Voz + princípios, §Erros (20), tradutor (null), comparação com o código e o catálogo, divergências |
| aparato | `aparato.json`, `aparato.md` | Caso Operação A (Parte 17), §Fichas (6 × 7), quiz (10 × 4 + placar), checklist final (30), exercícios (18 + 6 implícitos), referências (8 blocos + hierarquia de 6 categorias), glossário (192 termos em 8 famílias) |
| instrumentos | `instrumentos.json`, `instrumentos.md` | os 12 instrumentos: instrução, ponto de invocação, entradas, fórmulas, cenário-padrão, ramos e 96 estados capturados executando o script original; grades `#jg-main`/`#jg-us` |

**Extratores** (`extratores/`): `lib.mjs` (parser de DOM próprio, sem dependência; avaliação de literais do
`<script>` com `vm`; DOM simulado que executa os dois `<script>` originais), `blocos.mjs` (walker do vocabulário
`sec-id`/`box`/`p7`/`cn5`/`esc`/`grg`/`tri`/`glo`/`conf`/`lv`/`par3`/`clk`/`fi`, com fallback que avisa: 0 estruturas
desconhecidas), `m17_modulo.mjs`, `m17_aparato.mjs`, `m17_instrumentos.mjs`, `gen_md.mjs` (gera os três `.md` a partir
dos JSONs) e `verify.mjs`. Os extratores do M01 trabalham por número de linha no vocabulário antigo (`aula-marker`) e
não servem aqui. Ordem de execução: modulo → aparato → instrumentos → verify → gen_md. Os extratores leem o código
(`src/lib/data/*.ts`) só para comparar, via `import()` com remoção de tipos do Node 24.

## Verificação

`extratores/verify.mjs` (resultado em `extratores/verify-resultado.json`):
- **Campos de conteúdo.** 2.300 campos `html`/`texto` conferidos como substring normalizada da fonte: 0 falhas.
- **Origens.** 427 origens conferidas contra a linha declarada (janela −4/+12): 0 falhas.
- **Vereditos capturados.** 372 fragmentos conferidos contra o script, depois de juntar as concatenações `'a'+'b'`: 0 falhas.

**Verificação adversarial (2026-09-17)**, com método próprio, independente de `verify.mjs`:
- **Contagens.** Todas recalculadas por regex direto no HTML e por `vm` sobre `var Q`/`var J`/`var M`. Todas conferem (ver "Verificação" em cada `.md`).
- **Verbatim 100%.** Quiz, checklist, glossário (192 + linhas), erros, exercícios, fichas, caso, voz, roteiro e as fórmulas dos 12 instrumentos. Mais uma amostra de 298 campos com origem: 0 falha.
- **Três correções inequívocas, feitas nos extratores e regeneradas** (o pipeline é determinístico: sem as correções, a saída era idêntica byte a byte):
  1. As mensagens do placar do quiz saíam como `"pass"`/`"fail"`, que é a classe CSS, em `aparato.json` (`faixas[].mensagem`) e em `modulo.json` (`m17-crit-quiz.script.mensagens`). Agora saem as duas frases literais (L5288–5289). O `verify.mjs` não pegou o erro porque pula `faixas_de_placar_script` e `script`.
  2. `div-m17-09` dizia "7 blocos de fonte". São 8, e 8 + 6 = 14.
  3. Faltava `div-m17-inst-10` (escape duplo no Instrumento 12).
  4. **Reexecução em 2026-09-17.** `instrumentos.json › comparacao_codigo.calculadoras_com_m17` saía como
     `"verificar"`: a regex casava os ids `i01-`…`i12-`, que também existem em calculadoras de outros módulos. Agora
     o campo conta as chaves `'m17-…'` do mapa, e o resultado é 0, o que confirma "0 de 12 portados". Nessa
     reexecução, o pipeline inteiro foi rodado de novo sobre entradas inalteradas (a fonte é de 2026-08-04 e o código
     de 2026-09-16), e todas as saídas ficaram idênticas byte a byte, exceto esse campo. As contagens também foram
     refeitas por grep direto na fonte: 22 `sec-id`, 12 `div.inst`, 192 `.term`, 18 `det-bd` no §Ex, 30 `<li>` no
     §Final e 10 `{q:` em `var Q`.

**Segunda verificação adversarial (2026-09-17, outro verificador, scripts próprios fora da árvore).** Nenhuma
correção foi necessária.
- **Verbatim, 100%.** Conferidos campo a campo contra a fonte: quiz (`var Q` avaliado: enunciados, 40
  alternativas, gabaritos, explicações e as 2 mensagens de placar), checklist (30 `<li>` do `ul.ck`, com
  html, texto e linha), exercícios (18, com categoria pelo `div.dvs`), glossário (192 termos e definições, com
  famílias e linhas) e erros (20 linhas da tabela). Todos os 1.993 campos `html`/`texto`/`termo`/`rotulo`/`titulo`
  fora de anotação também foram conferidos: só falham os 4 textos de `convencoes`, que são metadado.
- **Entradas e cenário-padrão.** As entradas dos instrumentos 06, 09, 10 e 11 (id, rótulo, unidade, padrão,
  mín., máx. e passo) conferem com os `CFG`. O cenário-padrão foi recalculado à mão nos quatro e confere.
- **Origens.** 427 conferidas, com janela de ±3 linhas. Há 3 fora da janela, e nenhuma é erro: o título na L6
  usa `&oacute;`, o `#jg-main` é id e não texto, e `m17-cap-08` aponta para a abertura do bloco.
- **Contagens.** Recalculadas por outro caminho: filhos diretos de `.wrap` (§00 36, §Caso 13), `J`
  (17 jurisdições, 15 assinaturas, 13 exclusivas, Jaccard 0,094/0,190/0,500/0,125/0,125/0,395), `M` (13 de 24),
  25 sentidos de glosa, 6 lacunas "(c)", 42 `fi-k`, 10 `OBJ`, 8 `MEC`, 12 `corr` e 96 estados. Todas conferem.
- **Observação sem correção.** "5.308 linhas" é o tamanho de `split('\n')`. O arquivo tem 5.307 quebras de
  linha e termina em `\n`.

Duas conferências cruzadas foram feitas ainda:
- **Contagens do hero.** Recalculadas no DOM com a regra do próprio script (11 aulas, 12 instrumentos, 17 mercados,
  192 termos, 18 exercícios, 20 erros, 30 itens, 14 "referências").
- **Instrumento 02.** O espaço inteiro de 128 combinações foi percorrido.

## Contagens

| Item | Fonte | Código atual |
|---|---|---|
| Seções | 22 = 11 aulas + 11 aparatos (§00, §MAP, §Fichas, §Caso, §Erros, §Ex, §Quiz, §Voz, §Final, §Lex, §Ref) | 11 aulas (`MODULO_17_AULAS`) |
| Aulas | 11 (seções "Aula NN" = regra do hero = código = `AULAS_POR_BLOCO` = catálogo) | 11; títulos e subtítulos iguais 11/11; leads iguais 11/11 |
| Instrumentos | 12 (11 em aula, 1 fora de aula: Instrumento 01 no §MAP) | **0 portados** |
| Termos do glossário | 192 em 8 famílias (25+19+26+27+20+23+23+29) | **0** (faltam os 192). Em outros módulos há 11 homônimos exatos e 18 parentes por prefixo (ex.: `gl-m04-capacidade`), só como informação: nenhum cobre o verbete do M17 |
| Exercícios | 18 (5+5+4+4 por categoria estrutural), todos sem aula (P9); mais 6 implícitos nas fichas | 18 idênticos (prompt e gabarito), sem categoria, `points: 1` sem origem, não importados |
| Itens de checklist | 30 (todos autodeclarados; nenhum cronometrado) | 0 |
| Questões do quiz | 10 × 4 alternativas; 2 faixas de placar (>=8 / <8) | 0 |
| Caso | 2 perguntas, 5 etapas, 7 declarações (6 ausentes) | 0 |
| Erros comuns | 20 no §Erros + 3 destaques de erro em aula | 0 |
| Referências | 8 blocos de fonte + 6 categorias de hierarquia; 0 URL; data geral 4/8/2026 | 0 |
| Fichas | 6 × 7 campos | 0 |
| Critérios literais | 6 (currículo citado, método, quiz 8/10, §Ex, §Final, §Voz 10 min) | — |
| Divergências | modulo 13 + código 9 · aparato 6 · instrumentos 10 | — |

## Divergências principais

A lista completa está em cada JSON, em `divergencias`, e cada item traz as duas leituras. O id `div-m17-05` não existe
de propósito: a tabela de concordância foi reproduzida e virou `ver-m17-01`.

**Fonte contra fonte.**
1. **Qual aula separa os quatro números de penetração.** A Aula 02 (três níveis, Especialista) diz "a Aula 08 os
   separa". A Aula 07 diz "a Aula 09 separa". Na marcação, é a Aula 09.
2. **Aula da glosa "carbono".** A glosa do §00 aponta a Aula 07 como objeto, mas o carbono é tratado na Aula 08.
3. **Onde mora a glosa "capacidade".** A glosa (sentido E) diz "Aula 04, onde mora esta glosa". O §Lex remete à
   "glosa quíntupla do §00", que é onde ela está de fato.
4. **Assinaturas únicas.** O §MAP diz "Quinze das dezessete jurisdições têm assinatura de quatro dimensões única".
   Nos dados do script há 15 assinaturas distintas, mas só 13 jurisdições têm assinatura exclusiva. As duas colisões
   declaradas conferem.
5. **Contagem da Aula 06.** O texto anuncia "Duas coisas mudaram", e a tabela seguinte tem 4 linhas.
6. **Barra do exemplo estático da Aula 02.** Dotação e desenho têm o mesmo peso (flex 2), mas a prosa diz que desenho
   "é a que menos explica".
7. **Teto do leilão de capacidade.** A Aula 05 e o feedback da Q7 dizem que "a diferença entre o teto e a estimativa
   sem teto é maior que o próprio teto". Pelos números da própria fonte, 554,72 − 325 = 229,72, que é menor que 325.
   O Instrumento 07 ("cerca de 70% acima") confere. Registrado como CONTENT QA (P20).
8. **As seis declarações que faltam.** O Ex 02 e a Q1 do quiz listam conjuntos diferentes para o mesmo caso canônico.
9. **Rótulos da régua de estágio.** O Instrumento 07 usa Anunciado/Proposto/Aprovado/Regulamentado/Em operação e
   classifica o sistema brasileiro como "Regulamentado". A ficha, o caso e o §Lex dizem "regulado e não construído".
10. **Momento do gabarito.** O lede do §Quiz diz que o gabarito aparece "ao responder"; o script só o mostra no botão
    "Corrigir".
11. **Instrumento 09.** A instrução diz que a parcela elétrica "altera o resultado mais do que qualquer outro
    parâmetro". No cenário-padrão ela muda o resultado em +15,6%, contra +100% do fator de entrada (5→10%) e +20% do
    preço (75→90 €/t).
12. **Instrumento 03.** Em 13 das 24 células, "A parcela que não explica nada aqui: X" aparece com X de peso 1, não 0.
13. **Instrumento 05.** O ramo de leilão de longo prazo usa o texto do instrumento brasileiro ("obrigação de lastro",
    "as duas frases erradas") também para o Chile.
14. **Instrumento 08.**
    - Em "Mercado central de capacidade", a síntese diz "Duas das cinco funções mudariam de natureza", mas a tabela
      tem 2 com natureza distinta e 1 ausente.
    - Em "Sistema de teto e comércio", a classe é `ok` junto com "nenhuma em operação".
15. **Instrumento 12, enunciado 2.** O `corr` traz `&ldquo;`/`&rdquo;` e o render o passa por `esc()`: o learner vê as entidades como texto (`div-m17-inst-10`, acrescentada na verificação).
16. **Recorte dos Instrumentos 04 e 05.** O 04 anuncia "quatro perguntas" e mostra 3 chips e 4 linhas. O 05 diz
    "para cada jurisdição", mas só oferece as 6 com ficha.
17. **Vocabulário interno visível ao learner.** "Trava 2 estendida" (§MAP) e "War Room — quatro travas" (§Ref)
    caem sob P23/P24. "GridAlpha" aparece 23 vezes no corpo (P24/P7).

**Fonte contra catálogo.** O catálogo canônico diz que o hero tem travessão em "sete campos" e lista oito. Diz também
que o total de referências "não é declarado em lugar nenhum", mas o script calcula 14 (e conta as categorias de
hierarquia como referências). Título do módulo, títulos das 11 aulas e títulos dos 12 instrumentos conferem (12/12).

**Fonte contra código.**

| Id | Divergência |
|---|---|
| COD-M17-01 | Os 6 rótulos dos blocos "três níveis" se perderam. São os únicos tokens não casados na cobertura por palavra (99,1–100%). |
| COD-M17-02 | 6 tabelas vêm de estruturas sem `<th>`, e a primeira linha de dado vira cabeçalho (protocolo §15). |
| COD-M17-03 | Os 3 exemplos do `#par3-demo` foram fundidos numa nota, sem as proporções e com um "<" solto. |
| COD-M17-04 | O `div.conf` da Aula 05 virou título. |
| COD-M17-05 | A grade `#jg-us` (7 operadores) está ausente. |
| COD-M17-06 | Nenhum dos 12 instrumentos foi portado. |
| COD-M17-07 | Os exercícios estão sem categoria, com `points` sem origem, e não são consumidos. |
| COD-M17-08 | Todo o aparato do módulo está ausente do código (§00, §MAP, §Fichas, §Caso, §Erros, §Quiz, §Voz, §Final, §Lex, §Ref). |
| COD-M17-09 | O código traz horas 2–3 que não têm origem na fonte. Além disso, o comentário do código diz que o markup não marca a categoria dos exercícios, mas os `div.dvs` marcam. |

## Lacunas (a fonte não tem)

- **Módulo.**
  - Não há horas, trilha nem eixos.
  - Não há seção "Resultado esperado": as capacidades existem só dentro de blocos "Onde isso entra no produto" (P7).
  - Não há § Lab nem Tradutor.
  - O §MAP não traz tabela aula × pergunta.
- **Caso.**
  - Não há decisão pedida: a fonte recusa recomendação fechada.
  - Não há tabela de dados.
  - Não há vínculo com aula por id.
- **Instrumentos.**
  - Nenhum tem pergunta própria.
  - Nenhum declara tolerância.
  - Os Instrumentos 01–05, 08 e 12 não têm nota de fonte dos números. O 03 declara pesos "ordinais e ilustrativos".
  - Os valores de partida do 09 não têm fonte valor a valor; a nota de fonte cita o regulamento de modo genérico.
- **Exercícios e checklist.**
  - Nenhum exercício tem aula nem critério próprio.
  - O item (c) das 6 fichas não tem resposta de referência.
  - O checklist não tem regra de aprovação.
- **Referências.**
  - Não há URL, domínio nem título individual: são blocos descritos por estrutura.
  - Faltam os campos D5 (o que cada referência responde, tema, recorte e última verificação individual).
  - Só 2 blocos trazem "Consulta em".
- **Anotações a revisar.** `marcacao_p14` e `kind_sugerido` são inferência desta extração e precisam de revisão
  humana.
- **Não verificado.**
  - A régua de 5 posições do M16 não foi conferida por inteiro; só foram medidos dois rótulos no HTML do M16.
  - Não houve verificação na tela, porque nada foi portado.

## Uso por gate (resumo)

| Gate | O que a extração fornece | Cuidado |
|---|---|---|
| **C1** | Título, subtítulo e kicker literais; 11 aulas com rótulo e título; 4 dimensões do critério; 6 formas de critério | Sem horas nem capacidades fora de P7. P18: nenhum limiar é "o" critério. |
| **C2** | Roteiro de 22 seções; 12 instrumentos (1 fora de aula); fichas, caso, erros, quiz, voz, checklist e léxico | O aparato inteiro está fora do código. |
| **C5** | Posição exata de cada instrumento; entradas com faixa e padrão; fórmulas; cenário-padrão formatado; ramos capturados | Falta fonte dos números em 7 instrumentos. Divergências dos Instrumentos 03, 05, 08 e 09 (P20). |
| **C7/C8** | 18 exercícios com resposta de referência; caso com 2 perguntas literais | Revelação direta na fonte. Não há decisão pedida no caso (P17 autoriza a camada Alexandria). |
| **C9/C10** | Roteiro oral cronometrado (P14); placar do quiz (>=8) com duas mensagens | O quiz é o único item automatizável. |
