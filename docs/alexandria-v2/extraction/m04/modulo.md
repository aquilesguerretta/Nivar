# M04 · Grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo04.html` (1.856 linhas, LF).
Saída: [`modulo.json`](modulo.json). Extrator: [`extratores/m04_extrator.py`](extratores/m04_extrator.py).

**Como foi extraído.** Python 3 + BeautifulSoup (`html.parser`, que guarda a linha de cada tag) percorre a árvore do
DOM. Nenhum texto de conteúdo foi digitado. O M04 usa o vocabulário `sec-id` / `lede` / `inst` / `box` / `lv` /
`det-bd`; nenhum seletor do M01 (`aula-marker`, `glossary-item`) casa aqui, por isso o extrator do M01 não foi
reaproveitado linha a linha. A estrutura do JSON segue a do M01.

**Verificação.** 1.307 strings de conteúdo foram conferidas como substring da fonte (HTML cru, texto sem tags ou
literal do `<script>`, com espaços colapsados), sem nenhuma falha. Todas as `origem.trecho_inicial` estão a até
±3 linhas de `linha_aprox`. Os campos de anotação (`nota`, `marcacao_p14`, `divergencias`, `comparacao_codigo`)
não passam por essa conferência e estão marcados com `anotacao_da_extracao`.

## Estrutura do JSON

| Chave | O que contém |
|---|---|
| `identidade` | `<title>`, kicker, h1 (`titulo`), `subtitulo` (p.sub), os **7 pills** do hero, `horas` (a string "3–4h de estudo"), `eixos: null`, `trilha_declarada: null` e as 3 linhas do rodapé |
| `tese` | §00 "A commodity que não espera": lede e **12 blocos** (5 parágrafos, 1 tabela de 6 propriedades, 2 h3 "0.1"/"0.2", 2 callouts) |
| `resultado_esperado` | `null`. A fonte não tem "Resultado esperado" nem capacidades enumeradas |
| `mapa` | §MAP "Sete aulas, do instante ao horizonte": intro e **7 cartões** (número, título do cartão, descrição), ligados a `aula-04-NN`. `perguntas: null` |
| `roteiro` | As **17** `section` na ordem da fonte: **7 aulas + 10 aparatos**. Cada uma traz marcador, rótulo, h2 e lede. Nas aulas: subseções `x.y`, instrumento, explicador de três níveis, callouts e tabelas |
| `criterio` | 4 critérios literais: §00, pill do hero, §Quiz (com as 2 mensagens do script) e §Final (**20 itens**) |
| `laboratorios` | Vazio: não há § Lab |
| `voz` | §Voz: **32** perguntas-relâmpago (V.1), **6** ataques de decisor com persona (V.2), roteiro de **5** minutos (V.3) e o callout "Como treinar" |
| `principios_editoriais` | **12** callouts: 1 "Ideia central do módulo", 3 "Números vivos", 1 "Disciplina do caso" e 7 "Onde isso entra no produto" (`exibir_ao_learner: false`, P7/P24) |
| `erros_comuns` | §Erros "Dez erros que custam caro": **10** itens (título em `<b>` + corpo) |
| `explicadores_tres_niveis_indice` | Índice dos **6** `div.lv` (A01, A02, A03, A05, A06, A07). O texto fica com as aulas |
| `tradutor` | `null`: não há § Map/Tradutor |
| `comparacao_codigo` | Contagem de aulas por 8 sinais e títulos fonte × código × catálogo |
| `divergencias` | 8 itens com `leitura_a` / `leitura_b`, nenhum resolvido |

## Roteiro (17 seções)

| # | Marcador | Rótulo | h2 | Linha |
|---|---|---|---|---|
| 1 | §00 | Tese | A commodity que não espera | 257 |
| 2 | §MAP | Percurso | Sete aulas, do instante ao horizonte | 304 |
| 3 | Aula 01 | Formação de preço | Ordem de mérito como formador de preço | 322 |
| 4 | Aula 02 | Curto prazo | PLD: o preço do curto prazo | 405 |
| 5 | Aula 03 | Desenho de mercado | Energia × capacidade e o missing money | 509 |
| 6 | Aula 04 | Descoberta de preço | Leilões: como o regulador descobre o preço | 609 |
| 7 | Aula 05 | Longo prazo | PPA: onde mora a economia real | 682 |
| 8 | Aula 06 | Gestão de risco | Hedge: travando exposição ao PLD | 793 |
| 9 | Aula 07 | Síntese | Portfólio de contratação | 868 |
| 10 | §Caso | Operação A — Parte 4 | A planta pela lente do risco de mercado | 968 |
| 11 | §Erros | Armadilhas | Dez erros que custam caro | 1006 |
| 12 | §Ex | Exercícios | Nove exercícios com gabarito | 1027 |
| 13 | §Quiz | Verificação interativa de domínio | Dez perguntas. Resposta imediata. | 1092 |
| 14 | §Voz | Domínio oral | Se você não consegue falar, ainda não sabe. | 1107 |
| 15 | §Final | Critério de conclusão | Você domina o Bloco 4 quando | 1180 |
| 16 | §Lex | Glossário Alexandria | Cinquenta e oito termos | 1211 |
| 17 | §Ref | Fontes | Onde verificar cada afirmação | 1292 |

Por aula: A01 tem 3 subseções (1.1–1.3); A02, A03, A04, A06 e A07 têm 4; A05 tem 5 (5.1–5.5). Cada aula tem
exatamente 1 instrumento (Inst · 01 a 07, na ordem).

## Contagem de aulas (P8)

Os oito sinais concordam em **7**: os marcadores `Aula NN`, os cartões do §MAP, a prosa "Sete aulas", o pill "7 aulas",
`MODULO_04_AULAS`, `totalInModule: 7`, `AULAS_POR_BLOCO['bloco-04']` e as 7 linhas do catálogo canônico.

Títulos: o `title` do código é igual ao h2 nas 7 aulas, e o `subtitle` do código é igual ao rótulo do `sec-id` nas 7.
O catálogo canônico também usa o h2. **Uma divergência entre fonte e fonte:** o cartão do §MAP da Aula 04 diz
"Leilões: descoberta de preço", mas o h2 diz "Leilões: como o regulador descobre o preço".

## Identidade e catálogo (P24)

- **Título.** O h1 é "Economia de Mercados de Energia". É igual ao `<title>` (depois de "Alexandria · Módulo 04 — "),
  ao rodapé, a `alexandria-blocks.ts` (bloco-04) e ao catálogo canônico. Não há divergência de título.
- **Subtítulo.** O p.sub diz: "Como a fila física de despacho que você já conhece vira um número em R$/MWh — e por
  que esse número não é o preço que a fábrica paga." O catálogo o cita como "recorte do módulo".
- **Horas.** A fonte traz "3–4h de estudo". O código tem 3 e 4, e o catálogo diz "3–4 h declaradas". Concordam.
- **Pills.** 7 aulas · 7 instrumentos · 9 exercícios · "10 questões · critério 8/10" · 32 perguntas-relâmpago ·
  58 termos · 3–4h. **As seis contagens conferem com o markup.**
- **Trilha.** A fonte não declara trilha. O código usa `universal`, e o catálogo a marca como "atribuída".
- **Marca.** A fonte diz "GridAlpha" no kicker, no rodapé e em 2 callouts de produto. O texto fica literal; o
  produto aplica P24.
- **Unidade.** A fonte alterna "Bloco 4" (§00 e §Final) e "Módulo 04" (title, kicker e rodapé).

## Critérios (P14 e P18)

| Id | Onde | Critério literal (resumo do lugar) | Marcação P14 (inferida) |
|---|---|---|---|
| `m04-crit-00-tese` | §00, callout gd (L294) | "Você domina o Bloco 4 quando consegue explicar, sem consultar nada, …" | oral/livre, sem consulta |
| `m04-crit-hero` | pill (L246) | "10 questões · critério 8/10" | quiz |
| `m04-crit-quiz` | §Quiz, lede (L1094) | "pelo menos **8 de 10** sem consultar" + script: `sc>=8` → "Critério de domínio atingido…"; senão "…Não avance para o §Voz antes de fechar 8." | quiz |
| `m04-crit-final` | §Final (L1181) | "Vinte verificações. Responda sem travar e sem consultar." + 20 itens | oral/livre, sem consulta |

**Critérios cronometrados, todos no §Voz:**
- V.1: "Onde você hesitar mais de três segundos, marque".
- V.2: "cada uma deve caber em noventa segundos".
- V.3: roteiro de cinco minutos para gravar.

Os 20 itens do §Final são todos de produção oral ou livre. O item 19 diz "de memória" e o item 20, "em voz alta".
Nenhum é cronometrado.

Diferente do M01, **o script do placar é coerente com o limiar 8/10**. A tensão entre os critérios é só de forma
(oral × quiz × checklist). Pelo P18, nenhum deles vira "aprovado".

`marcacao_p14` é inferência por palavra-chave e precisa de revisão humana.

## Divergências (detalhe em `divergencias[]`)

1. **`div-m04-titulo-aula04`.** O cartão do §MAP diz "Leilões: descoberta de preço"; o h2 diz "Leilões: como o
   regulador descobre o preço".
2. **`div-m04-bloco-x-modulo`.** A fonte alterna "Bloco 4" e "Módulo 04", e o §Ref cita o "Bloco 9".
3. **`div-m04-marca`.** GridAlpha aparece no kicker, no rodapé e nos callouts de produto (P24/P7).
4. **`div-m04-criterio-formas`.** O critério aparece em três formas (P18).
5. **`div-m04-horas`.** Concordância, registrada por completude.
6. **`div-m04-trilha`.** A trilha não é declarada na fonte.
7. **`div-m04-dominio-oral-regra`.** "A regra Alexandria" é citada na fonte (registro).
8. **`div-m04-quiz-gating-voz`.** A mensagem do placar trava o §Voz, o que contraria o P18.

## Ausências declaradas

| Campo | Valor | Motivo |
|---|---|---|
| `resultado_esperado` | `null` | Não há "Resultado esperado" nem lista de capacidades |
| `mapa.perguntas` | `null` | O §MAP é uma grade de cartões com descrição, sem coluna de pergunta |
| `identidade.eixos` | `null` | Não há eixos rotulados |
| `identidade.horas.min/max` | `null` | A fonte só tem a string "3–4h de estudo" |
| `identidade.trilha_declarada` | `null` | Não declarada |
| `laboratorios.itens` | `[]` | Não há § Lab nem instrumento fora de aula |
| `tradutor` | `null` | Não há § Map/Tradutor |

## O que o código não tem (nível módulo)

O código não tem a tese do §00, os cartões do §MAP, os critérios, o §Voz, o §Erros e os badges do M04
(`BLOCOS_COM_CONTEUDO` vai só de bloco-01 a bloco-03). O §Caso, o §Quiz, o §Final e o §Ref estão em
[`aparato.md`](aparato.md).

## Cobertura por token (§5 do protocolo)

§00 100% · §MAP 100% · §Erros 100% · §Voz 100% · hero 100%. O resíduo das outras seções são os marcadores `sec-id`,
que ficam no `roteiro`.

## Verificação (verificador adversarial independente, 2026-09-17)

Método próprio, sem reusar o extrator: normalização de espaços/entidades e comparação de substring contra o HTML
cru e contra o texto sem tags; pareamento estrutural por regex direto na fonte; `var Q` e o `<script>` avaliados em
node com DOM mínimo próprio.

- **Verbatim.** 2.500 strings dos três JSON percorridas; todas as de conteúdo são substring da fonte. As que não são
  são anotações da extração (`*_nota`, `divergencias`, `codigo`, valores renderizados), como esperado.
- **Pareamento 100%.** Quiz 10/10 (enunciado, 4 alternativas na ordem, gabarito, explicação, aula citada, 2 faixas);
  checklist 20/20 na ordem; 58 termos com a definição e a família certas; 10 erros; 8 perguntas do caso; 32 + 6 + 5
  do §Voz; 11 referências (5 URLs, texto do link); 9 exercícios (enunciado e parágrafos do gabarito); 7 cartões do §MAP.
- **Instrumentos 100%.** 376 linhas `{linha, codigo}` idênticas à linha da fonte; 30 ramos (condição e texto na linha
  declarada); 28 saídas (expressão na linha declarada; 6 textuais: i1-m, i1-lim, i2-mes, i5-lo, i5-w, i7-w); 24 entradas
  (rótulo, padrão, min, max, passo conferidos no `<input type="number">`). Cenário-padrão dos 7 reexecutado: 0 diferenças.
  Harness: 8.100 + 1.000 + 10.000 + 100 + 10.000 + 900 + 8.100 = 38.200. Ramo inalcançável do INST 01 confirmado
  (gás máx. 600 < óleo 900; no déficit `price` = PLD_MAX_H, não maior).
- **Origens.** 0 `trecho_inicial` fora de ±3 linhas.
- **Contagens recontadas no HTML.** 17 `sec-id`; 7 aulas; 28 subseções (3+4+4+4+5+4+4); 7 `div.inst`; 24 entradas; 28
  readouts; 30 ramos; 58 termos (15+14+16+13); 9 `details` em §Ex; 20 `ul.ck li`; 10 questões × 4; 32 / 6 / 5 no §Voz;
  10 erros; 8 perguntas; 11 referências (5 com URL); 6 `div.lv`; 20 `div.box` (12 de aparato/princípio + 2 capturados
  em `criterio` e `voz.como_treinar` + 6 de corpo de aula, estes deixados ao grupo aulas; ver 2ª verificação); 7 "Onde isso entra no produto". Todas conferem com o declarado.
- **Código.** Saídas no código 22; `unit: null` em 21 saídas, das quais 9 renderizam unidade na fonte; 7 `note: null`;
  13 `</b>` × 6 `<b>` no conteúdo do M04 (7 órfãos); 5 " ." nos gabaritos (Ex·06 ×1, Ex·08 ×4). Catálogo: família 3
  lista 15 nomes (sem "PPA"). Conferem.

Nenhuma correção neste grupo.

## Verificação (2º verificador adversarial, 2026-09-17)

Método próprio, sem reusar extrator nem o harness: substring normalizada (espaços/entidades) de todas as 2.757
strings dos três JSON contra o HTML cru e sem tags; pareamento exato por regex direto na fonte; `var Q` avaliado em
node; `<script>` original executado num DOM mínimo próprio.

- **Verbatim.** Todas as strings de conteúdo são substring da fonte. As 526 que não são: ids, `tipo`, `marcacao_p14`,
  `tipo_saida`, `classe_veredito` e valores renderizados pelo script (estes reproduzidos pela execução, abaixo).
- **Pareamento 100% (igualdade exata após normalização).** Quiz 10/10 (enunciado, 4 alternativas na ordem, índice,
  letra, gabarito, explicação, aula citada; 2 faixas); checklist 20/20 (html, texto, ordem); §Caso 8 (tema + pergunta);
  §Erros 10 (título + corpo); §Voz 32 + 6 (persona + pergunta) + 5 minutos; §Ex 9 (summary, enunciado, todos os
  parágrafos do gabarito); §Lex 58 (termo, definição, família; 15+14+16+13); §Ref 11 (rótulo, descrição, 5 URLs e texto
  do link); tabela do §00 (7 linhas × 3 células).
- **Instrumentos 100%.** 376 linhas `{linha, codigo}` iguais à linha da fonte (349 idênticas byte a byte, 27 só com
  diferença de indentação); 24 entradas (rótulo, unidade, padrão, min, max, passo, igualdade number/range); 28 saídas
  (rótulo, id, expressão na linha declarada); 30 ramos (4+4+3+5+4+5+5, condição e texto na linha declarada);
  6 textuais. Cenário-padrão dos 7 reexecutado: saídas renderizadas, `valor_padrao_bruto`, veredito e classe sem
  diferença. Ramo inalcançável do INST 01 reconferido no script (L1420–1425). Soma do harness: 38.200.
- **Origens.** 349 `trecho_inicial` checados; nenhum fora de ±3 linhas.
- **Contagens recontadas.** Todas as declaradas conferem (17 · 7 · 28 · 7 · 0 · 0 · 24 · 28 · 6 · 30 · 58 · 9 · 9 ·
  20 · 10 · 4 · 2 · 32 · 6 · 10 · 8 · 11 · 5 · 4 · 12 · 6).
- **Escopo.** Sem Tradutor, §Lab, "Resultado esperado" ou trilha na fonte (ausências corretas). As 5 `table.tbl`:
  a do §00 está extraída; as 4 restantes são de corpo de aula (L420, L649, L693, L878).
- **Divergências.** Todas reconferidas na fonte (título da Aula 04 L311 × L610; "Bloco 4" L296/L1181 × "Bloco 9"
  L1302; "Parte 4"; ramo do INST 01). Nenhuma inventada.

**Correção aplicada.** O texto da 1ª verificação dizia "20 `div.box` (12 de aparato/princípio + 8 de corpo de aula)".
A recontagem por seção dá 12 em `principios_editoriais` + 2 capturados em outro campo ("Critério de domínio deste
módulo" em `criterio.itens[0]` e "Como treinar" em `voz.como_treinar`) + **6** de corpo de aula ("A fila real",
"Leia esses dois números juntos", "A frase que resolve a pergunta do Módulo 03", "Conecte com o Módulo 03", "O que ler
num resultado de leilão", "Teste de sanidade"). A frase foi corrigida nos quatro `.md`. Os JSON não mudaram.
