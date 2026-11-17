# M03 · Grupo "modulo"

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo03.html` (3.585 linhas, LF).
**Arquivo gerado:** [`modulo.json`](modulo.json). **Data:** 2026-09-17.
**Gerado por:** `extratores/m03_modulo.mjs`, com a biblioteca comum `extratores/lib.mjs`.

**Como foi extraído.** Busca ancorada por número de linha e regex sobre o HTML. Nenhum texto de conteúdo foi digitado.
Campos de texto:
- `html`: o fragmento literal, com espaços colapsados e o inline preservado;
- `texto`: o mesmo fragmento sem tags e com as entidades decodificadas.

Todo item traz `id` estável (`m03-…`), `tipo` e `origem {seletor, trecho_inicial, linha_aprox}`. Todo `null` vem com
nota.

**Vocabulário da fonte.** Igual ao do M01 (`aula-marker`, `aula-title`, `instrument`, `exercise-tag`,
`glossary-item`), com zero `sec-id`. Foi conferido no arquivo, não herdado.

## Estrutura do JSON

| Chave | O que contém | Contagem |
|---|---|---|
| `identidade` | `<title>`, eyebrow, h1 (`titulo`), `subtitulo` (hero-subtitle), 4 `hero-meta`, `horas`, `eixos: null`, cabeçalho e rodapé | 4 metas · 3 parágrafos de rodapé |
| `tese` | § 00: marcador, h2, lead, 2 parágrafos, a grade "Família 1 / Família 2", a fórmula "Papel na matriz = f (…)" e a pull-quote com atribuição | 5 blocos |
| `resultado_esperado` | Preâmbulo "Além disso, ao final você consegue:" e as capacidades (`m03-cap-01..08`). `titulo: null`: o M03 não tem o cabeçalho "Resultado esperado" | **8 capacidades** |
| `mapa` | § MAP: h2 "Dez aulas, do mapa ao portfólio.", intro, cabeçalho da tabela e as linhas (aula, tema, pergunta), ligadas a `aula-03-NN` | **10 perguntas** |
| `roteiro` | As `section.aula` em ordem, com marcador, rótulo, h2, intervalo de linhas, instrumentos da seção e vínculo com o código | **20 seções = 10 aulas + 10 aparatos** |
| `subsecoes_por_aula` | Os h3 numerados `x.y` de cada aula | 22 subseções (01:1 · 02:3 · 03:2 · 04:2 · 05:2 · 06:2 · 07:3 · 08:2 · 09:3 · 10:2) |
| `criterio` | As formas literais de critério e as regras de estudo, com marcação P14 | 5 (3 critérios + 2 regras) |
| `laboratorios` | `null`. O M03 não tem § Lab nem `LAB · NN` | 0 |
| `voz` | § Voz (30 perguntas-relâmpago + roteiro de cinco minutos em 6 parágrafos) e 4 princípios editoriais | 30 · 6 · 4 |
| `erros_comuns` | § Erros: tabela "O mito / A correção em uma frase" | **8 erros** |
| `tradutor` | `null`. O M03 não tem § Map (Tradutor) | 0 |
| `tres_niveis` | Os blocos "três níveis" das aulas (Criança de 12 anos / Executivo não-técnico / Especialista de setor) | 5 blocos × 3 painéis (Aulas 01, 02, 05, 06, 10) |
| `onde_entra_no_produto` | Só ponteiros para os callouts "Onde isso entra no produto" (P7: fora da interface) | 10 ponteiros, um por aula |
| `divergencias` | Cada uma com as leituras literais e `decisao: não escolhida` | 10 |
| `comparacao_codigo` | Contagens e títulos (fonte × código × catálogo), linhas do catálogo e o que falta no código | — |

## Identidade (P24)

| Campo | Literal | Linha |
|---|---|---|
| `<title>` | Alexandria · Módulo 03 — Tecnologias de Geração | L6 |
| Eyebrow | Nível 1 · Fundamentos Universais · Módulo 03 | L1343 |
| h1 | Tecnologias de geração: o cardápio completo, de *Itaipu ao telhado* — e por que o sistema não compra fontes, compra atributos. | L1344 |
| Rodapé | Módulo 03 · Tecnologias de Geração · Nível 1 — Fundamentos Universais · v3.0 | L2796 |
| Catálogo canônico | Módulo 03 — Tecnologias de Geração | — |
| `alexandria-blocks.ts` | `title: 'Tecnologias de Geração'` | L9 |

`<title>`, rodapé, catálogo canônico e código concordam no nome curto **"Tecnologias de Geração"**. O h1 é o título
editorial longo. Pelo P24, o catálogo governa o nome, e o h1 só pode virar subtítulo ou descritor na camada de
produto. O subtítulo literal da fonte é o `hero-subtitle` (L1345, começa em "No Módulo 02 você aprendeu a máquina…").

**Hero-meta.** Os quatro pares literais são:
- Tempo estimado: "4 – 5 horas";
- Nível do currículo: "Fundamentos · Nível 1";
- Produtos GridAlpha: "Simulate · CLE · Brazil Pulse";
- Próximo módulo: "04 · Economia de Mercados".

**Horas.** `horas.texto` = "4 – 5 horas", com `min`/`max` = `null`, porque a fonte só dá a string. O catálogo
canônico diz "4–5 h declaradas", e `alexandria-blocks.ts` ainda tem `estimatedHoursMin/Max: null` com
`priority: 'confirmar'`.

**Eixos.** `null`. A fonte não declara eixos. O mais próximo é a fórmula do § 00 (quatro variáveis: estrutura de custo,
despachabilidade, fator de capacidade, localização), que o JSON guarda em `tese` e não promove a eixo.

## Resultado esperado e P14

O M03 não tem o h4 "Resultado esperado". O equivalente é a lista de 8 capacidades depois do critério do § 00 (L1408–1415).

`marcacao_p14` é **anotação inferida** (verbo inicial, menção a tempo ou voz), não texto da fonte, e precisa de
revisão humana.

| Lista | Itens | Cronometrado ou fluência | Oral ou livre | Desenho | Cálculo | Escrita |
|---|---|---|---|---|---|---|
| Capacidades (§ 00) | 8 | 0 | 8 | 0 | 0 | 0 |
| Checklist (§ Final, em `aparato.json`) | 18 | 1 (item 17, "roteiro de 5 minutos sem travar") | 16 | 1 (item 01) | 1 (item 16) | 1 (item 10) |
| Perguntas-relâmpago (§ Voz) | 30 | 30 (etiqueta `fluencia_sem_travar`) | 30 (etiqueta `producao_oral`) | — | — | — |
| Roteiro de cinco minutos (§ Voz) | 1 | sim | sim | — | — | — |

Pelo P14, nada disso vira evidência automatizada. O único item automatizável é o quiz, e pelo P18 o limiar dele não
declara domínio.

## Critérios literais (P18)

| Id | Seção | Literal (resumo do lugar, texto completo no JSON) | P14 |
|---|---|---|---|
| `m03-crit-tese` | § 00 (L1403–1404) | "Você passa no Bloco 3 quando consegue, sem consultar nada: (1) desenhar num guardanapo… (2) explicar em voz alta…" + "O teste honesto: … você responde em três frases sem travar." | desenho, oral, sem consulta, fluência |
| `m03-crit-quiz` | § Quiz (L2379) | "…acertar pelo menos 8 de 10 sem consultar." + as 4 mensagens do placar (L3571–3574) | automatizável, limiar legado |
| `m03-crit-final` | § Final (L2464) | "Você só passa neste módulo se conseguir… fazer todas as ações abaixo… e o quiz fechar em 8/10 ou mais…" (18 itens) | autodeclarado, sem registro |
| `m03-regra-ex` | § Ex (L2278) | Regra de estudo: escreva ou fale antes de revelar o gabarito | tentativa antes do gabarito |
| `m03-regra-voz` | § Voz (L2398) | Regra de estudo: 30 perguntas-relâmpago sem travar e roteiro de cinco minutos | oral, cronometrado |

As formas coexistem e **nenhuma foi escolhida** (ver `div-m03-mod-04-criterio`).

## Comparação com o código e o catálogo (P8)

- **Contagem de aulas: 10 em todos os sinais.** Marcadores `Aula NN` (10), linhas do § MAP (10), prosa do § MAP
  ("Dez aulas"), `MODULO_03_AULAS` (10), `AULAS_POR_BLOCO['bloco-03']` (10) e catálogo canônico (10).
- **Títulos das 10 aulas: zero divergência de código.** O `title` do código é igual ao h2 da fonte, e o `subtitle`
  do código é igual ao rótulo do marcador. O catálogo canônico usa os mesmos pares. A única diferença é interna à
  fonte (Aula 05, ver `div-m03-mod-05`).
- **Instrumentos.** Os 9 nomes do catálogo canônico são iguais aos títulos da fonte. Detalhe em
  [`instrumentos.md`](instrumentos.md).
- **`alexandria-curriculo.ts`.** Agrega `MODULO_03_AULAS`, `MODULO_03_CORPO` e `MODULO_03_LEAD` sem transformação. Não há
  divergência própria.
- **`alexandria-trilhas.ts`.** `'bloco-03': 10`. O comentário do código diz que "o hero declara 'Dez aulas'", mas a frase
  está no h2 do § MAP (`div-m03-mod-06`). A contagem está certa.
- **`alexandria-badges.ts`.** 3 badges usam itens do checklist (01, 02 e 16). A linha citada e o `criterion` são
  literais. `name`, `category` ("conteudo"/"dominio") e `expReward` não têm origem na fonte, e a categoria "dominio" é
  afirmação que o P18 não sustenta sem evidência.
- **O que o código não tem** (grep literal em `alexandria-modulo-03-content.ts`): tese e famílias, as 8 capacidades,
  as perguntas do § MAP, os critérios, a tabela de erros, as 30 perguntas de voz e o roteiro, e os blocos de três
  níveis.
- **Catálogo canônico × fonte.** O catálogo cita o critério do § 00 cortado em "por que ela ocupa o lugar que ocupa."
  e sem a frase "O teste honesto" (`div-m03-mod-10`). A escala do catálogo confere com a fonte: 10 aulas,
  9 instrumentos, 63 termos, 10 exercícios, 30 perguntas-relâmpago e 4–5 h.

## Divergências (registradas, nenhuma resolvida)

1. **`div-m03-mod-01-titulo`.** O h1 longo convive com o nome curto de `<title>`, rodapé e catálogos (P24).
2. **`div-m03-mod-02-horas`.** A fonte diz "4 – 5 horas", e `alexandria-blocks.ts` ainda tem `null`.
3. **`div-m03-mod-03-proximo-modulo`.** A fonte diz "Economia de Mercados" (hero, § Final, placar, rodapé), e o
   catálogo e o código dizem "Economia de Mercados de Energia".
4. **`div-m03-mod-04-criterio` (P18).**
   - O § 00 fala em "passa no **Bloco 3**" com duas capacidades orais ou de desenho.
   - O § Quiz pede 8 de 10.
   - O § Final pede os 18 itens **e** quiz ≥ 8/10.
   - O script manda avançar já com 7 acertos ("Bom… depois avance para o próximo módulo"), dá a mesma mensagem com 8
     e só diz "Pronto para o Módulo 04" com 9 ou mais.
   - Com 4 ou menos, a mensagem repete "O critério de domínio é 8/10".
5. **`div-m03-mod-05-map-aula05`.** O § MAP diz "Solar: UFV e MMGD", e o marcador diz "Solar — UFV e MMGD".
   O código e o catálogo seguem o marcador.
6. **`div-m03-mod-06-dez-aulas-origem`.** Os comentários do código atribuem "Dez aulas" ao hero, mas a frase está no
   § MAP.
7. **`div-m03-mod-07-marca` (P24).** "GridAlpha" aparece em cinco lugares visíveis ao learner: cabeçalho, hero-meta,
   atribuição da pull-quote, rodapé e callouts ("Linguagem GridAlpha para esse caso", "GridAlpha Simulate", "toda
   entrega GridAlpha"). O texto foi mantido literal.
8. **`div-m03-mod-08-cabecalho-versao`.** O cabeçalho mostra "Módulo 03 · Cobaia Zero v3.0" (rótulo interno visível).
   O `<style>` tem um bloco comentado "Módulo 02 — estilos adicionais" (resíduo de template).
9. **`div-m03-mod-09-comentario-caso`.** A fonte declara o caso como "Parte 3" no comentário, na etiqueta e no lead
   (ver [`aparato.md`](aparato.md), P17).
10. **`div-m03-mod-10-catalogo-criterio`.** O catálogo corta a citação do critério do § 00.

**Achados de leitura, sem divergência.**
- **"Bloco 3" × "Módulo 03".** O § 00 chama o módulo de "Bloco 3", o resto da fonte diz "Módulo 03", e o código usa
  `bloco-03` como id. Está registrado dentro da div-04, sem item próprio.
- **Sigla FC (P21).** No M03 "FC" significa sempre fator de capacidade (60 ocorrências de `FC`, zero de "fator de
  carga"). Não há ambiguidade interna. Na camada de produto vale o padrão FCap.

## Ausências declaradas

| Campo | Valor | Motivo |
|---|---|---|
| `identidade.eixos` | `null` | Não há eixos rotulados na fonte |
| `identidade.horas.min` / `max` | `null` | A fonte só tem a string "4 – 5 horas" |
| `resultado_esperado.titulo` | `null` | O M03 não tem o h4 "Resultado esperado" |
| `laboratorios` | `null` | Não há § Lab nem `LAB · NN` (0 ocorrências) |
| `tradutor` | `null` | Não há § Map (Tradutor). O equivalente são os 5 blocos `tres_niveis` dentro das aulas |
| `voz.secao.perguntas_relampago.itens[].resposta_referencia` | `null` | A fonte não dá resposta para as 30 perguntas |

## Verificação

Feita por `extratores/m03_verificar.mjs`, **independente** de `lib.mjs`, com resultado em
[`verificacao.json`](verificacao.json):
- **Literalidade:** 1.266 strings de conteúdo dos três JSONs, 0 falhas. As 47 leituras de divergência que citam a
  fonte também são literais.
- **Origens:** 378 `origem`, todas encontradas a até 3 linhas da linha declarada.
- **Cobertura por token:** 100% em § 00, § MAP, § Erros, § Voz e hero.
- **Recontagem:** 10 aulas, confirmadas pelo roteiro e pelo § MAP.

**Correções feitas nesta rodada** (extração anterior da mesma pasta, sem .md):
1. Duas leituras de `div-m03-mod-07` juntavam rótulo e valor, ou três trechos, em uma frase que não existe na fonte.
   Agora usam o separador " | ", declarado em `nota_literal`.
2. A marcação P14 passou a reconhecer imperativos ("Explique", "Defenda", "Corrija", "Calcule") e perdeu as etiquetas
   duplicadas.

### Verificação adversarial (2026-09-17)

Um verificador externo refez a extração com parse próprio, sem reusar `lib.mjs` nem `m03_verificar.mjs`.

**Contagens recalculadas no HTML, todas iguais às declaradas:**
- **Seções e aulas:** 20 `section.aula` (10 aulas + 10 aparatos) e 22 subseções `x.y` nos h3 das aulas.
- **§ 00 e § MAP:** 8 capacidades e 10 linhas no § MAP.
- **Critérios:** 3 critérios e 2 regras de estudo.
- **§ Voz:** 30 perguntas-relâmpago e 6 parágrafos no roteiro de cinco minutos.
- **§ Erros:** 8 erros comuns.
- **Aulas:** 5 blocos `three-levels` (Aulas 01, 02, 05, 06 e 10), 10 callouts "Onde isso entra no produto" e 5
  `callout red`.
- **Ausências:** 0 ocorrências de "Trava", `LAB ·`, § Map, `<video>`, `<iframe>` e `<img>`.

**Conferências campo a campo, todas sem diferença:**
- **§ Voz:** `html` e linha das 30 perguntas e das 6 falas do roteiro.
- **§ Erros:** mito e correção dos 8 erros.
- **§ 00 e § MAP:** as 8 capacidades, e o tema, a pergunta e a linha das 10 linhas do § MAP.
- **Três níveis:** os 15 painéis dos 5 blocos e as linhas de cada um.

**Correção feita** (inequívoca; `m03_modulo.mjs` foi regenerado):
1. **`div-m03-mod-02-horas`.** A leitura do `alexandria-blocks.ts` trocava a ordem dos campos. A extração dizia
   "estimatedHoursMin: null, estimatedHoursMax: null, priority: 'confirmar'", mas o código real é
   "priority: 'confirmar',  estimatedHoursMin: null, estimatedHoursMax: null", com dois espaços, como no arquivo.
   Arquivos alterados: `extratores/m03_modulo.mjs` e `modulo.json`.
2. **Contagem de leituras de divergência.** Passou de 44 para 47 porque uma leitura do grupo aparato foi corrigida.
   Os detalhes estão em `aparato.md`.

**Conferido sem correção:**
- **Leituras compostas.** As leituras com " | " e " / " são compostas, e cada parte é literal.
- **Leitura do código.** `"o hero declara \"Dez aulas\""` existe em `alexandria-modulo-03-content.ts:11`.
- **Leitura do catálogo.** A citação cortada do critério confere com `catalogo-modulos-alexandria.md` (L340–L344).
- **Contagem de linhas.** `linhas_total` = 3585 segue a convenção `split('\n')` do M01 e do M02. Pelo `wc -l`, o
  arquivo tem 3584 quebras de linha e termina em `\n`.

### Segunda verificação adversarial (2026-09-17)

Segundo verificador externo, com parse, harness DOM e varredura próprios (sem reusar `lib.mjs`, `m03_verificar.mjs` nem o primeiro verificador).

**Conferido sem diferença:**
- **Literalidade:** todos os 256 `html` e 321 `texto` dos três JSONs (100%, não amostra), e todas as demais folhas de string de conteúdo. As únicas ausências na fonte são valores executados, anotações e `convencoes`, como esperado.
- **Origens:** as 378 `origem` estão a até 3 linhas.
- **Quiz, checklist e fórmulas:** 100% do quiz (10 × 4, gabaritos, explicações e linhas), dos 18 itens do checklist e dos 9 scripts de instrumento mais os helpers, linha a linha.
- **Contagens recalculadas no HTML:** todas iguais às declaradas (20 · 10 · 22 · 8 · 10 · 3+2 · 0 · 9 · 31 · 4 · 63 · 10 (9+1) · 18 · 10×4 · 4 · 17 · 30 · 8 · 5 · caso 6/4/5/0/0).
- **Instrumentos re-executados:** os cenários-padrão dos 9 conferem. A varredura exaustiva confirma as mesmas combinações por instrumento e os 4 ramos inalcançáveis (L3017, L3056, L3166 e L3172).
- **Divergências:** as 54 leituras `literal`/`trecho` foram conferidas contra a fonte, o código e o catálogo. Nenhuma divergência é inventada.

**Correção feita** (inequívoca; `m03_modulo.mjs` e `m03_aparato.mjs` foram regenerados, e `m03_instrumentos.mjs` e `m03_verificar.mjs` saíram byte a byte iguais):
1. **`div-m03-mod-04-criterio` e `div-m03-ap-01-criterio-P18`.** A leitura do placar trazia prefixos entre colchetes (`[correct >= 9]` e `[9–10]`), que não são texto da fonte. Eles apareciam dentro de `literal` sem nota. Agora cada uma tem `nota_literal`, que declara o separador " / " e o prefixo como anotação desta extração. O texto das mensagens não mudou.
