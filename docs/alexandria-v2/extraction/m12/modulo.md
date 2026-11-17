# M12 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo12.html` (4.059 linhas, LF).
Saída: [`modulo.json`](modulo.json). Extrator: [`extratores/m12_modulo.mjs`](extratores/m12_modulo.mjs).

**Como foi extraído.** Um percorredor de elementos de topo (`div.wrap` de cada `section`) com contagem balanceada de
tags, mais regex. As perguntas do tabuleiro e as mensagens do quiz saem do texto do `<script>`. Nenhum texto de
conteúdo foi digitado.

**Verificação.** `extratores/m12_verify.mjs` conferiu 747 strings de conteúdo como substring da fonte (HTML cru ou
texto sem tags, espaço colapsado): 0 falhas. As 139 origens têm `trecho_inicial` na linha declarada (±3): 0 falhas.

## Estrutura do JSON

| Chave | O que contém |
|---|---|
| `identidade` | kicker, h1, subtítulo (`p.sub`), 11 pills do hero, rodapé (4 linhas), `horas: null`, `eixos: null`, marca na fonte |
| `tese` | §00 em 20 blocos, os **3 vetores** (`div.chain`), as **2 colunas × 5 itens** (`div.par`) e a frase organizadora |
| `resultado_esperado` | `null`: a fonte não tem bloco de capacidades |
| `mapa` | §MAP em 8 blocos, as **5 frentes**, `perguntas_por_aula: null`, as **3 perguntas de verificação** do INST·01 e o bloco **três níveis** (`div.lv`) |
| `roteiro` | as **18** seções (**8 aulas + 10 aparatos**). Cada aula traz lede, subseções `NN.x`, instrumentos, fichas, callouts, estruturas especiais e a comparação com o código |
| `criterio` | 5 formas literais: conversa (§00.4), quiz (§Quiz + script), §Ex, §Final (28 itens com P14) e §Voz |
| `laboratorios` | `null`: não há § Lab |
| `voz` | §Voz: lede e 5 trechos cronometrados ("Minutos 0 a 2" … "Minutos 8 a 10") |
| `principios` | box "Números vivos" do §00, rodapé de neutralidade, lede do §Ref, lede do §Caso e ponteiro para a taxonomia da Aula 08 |
| `erros_comuns` | §Erros: **20 itens** (`erro` + `correcao`), sem vínculo de aula |
| `fichas` | as **6 fichas de campo fixo**, com linhas chave × valor |
| `callouts` | índice dos **24** `div.box`: 9 "Onde isso entra no produto", 6 "Números vivos", 4 cy (§00, Aulas 02 e 05, §Caso) e 5 cy do §Voz |
| `tradutor` | `null`: não há Tradutor. O equivalente é `mapa.niveis_de_leitura` |
| `divergencias` | 13 itens com `leitura_a` / `leitura_b`, nenhum resolvido |
| `comparacao` | catálogo canônico e código (`bloco-12`, `AULAS_POR_BLOCO`, títulos, leads, gravuras, o que falta) |

## Identidade e catálogo (P24)

- **Título.** O h1 "Geopolítica Energética do Brasil" é igual ao do catálogo canônico e ao do `bloco-12`. Não há
  subtítulo com dois-pontos; o `p.sub` é a frase do paradoxo.
- **Kicker.** "Alexandria · GridAlpha · Módulo 12". A trilha "Setor Elétrico Brasileiro" é **atribuída** pelo
  catálogo; o código usa `track: 'brasil'`, `level: 2`.
- **Horas.** A fonte não declara horas. O código tem 4–5 h sem origem (div-m-01).
- **Escala.** As 11 pills batem com o markup: 8 aulas, 11 instrumentos, 6 fichas, 152 termos, 14 exercícios, 20 erros,
  quiz 8/10, roteiro oral 10 min, 28 itens, 34 referências e "verificado em 02·08·2026".
- **Aulas no catálogo.** As 8 linhas (rótulo e título) batem com a fonte, sem divergência.

## Roteiro e contagem de aulas (P8)

Os quatro sinais concordam em **8 aulas**: os marcadores `Aula NN`, a pill "8 aulas", o código (`totalInModule: 8`,
8 aulas) e `AULAS_POR_BLOCO['bloco-12'] = 8`.

| Aula | Rótulo (sec-id) | Título (h2) | Subseções | Instr. | Fichas |
|---|---|---|---|---|---|
| 01 | O paradoxo | Oitenta e sete por cento de quê, exatamente | 01.1–01.4 | 02, 03 | — |
| 02 | COP30 e o ciclo climático | O que foi decidido, o que ficou de fora, e por que a distinção é o conteúdo | 02.1–02.4 | 04 | — |
| 03 | China | Complementaridade forte, concentração alta, e a diferença entre as duas | 03.1–03.3 | 05 | 1 de 4 |
| 04 | Estados Unidos | Duas políticas simultâneas que puxam em direções opostas | 04.1–04.3 | 06 | 2 de 4 |
| 05 | Europa e capital multilateral | Quando a regra é o produto de exportação | 05.1–05.3 | 07 | 3 e 4 de 4 |
| 06 | Hidrogênio de baixa emissão | Duas leis sancionadas, um regime que ainda não opera | 06.1–06.4 | 08 | 5 de 6 |
| 07 | Minerais críticos e estratégicos | Vinte e cinco por cento da reserva, menos de um por cento da produção | 07.1–07.4 | 09 | 6 de 6 |
| 08 | Síntese | Os trinta minutos: oito movimentos, nenhum argumento repetido | 08.1–08.4 | 10, 11 | — |

- **Títulos no código.** `title` = h2 e `subtitle` = rótulo em **8/8**.
- **Lead × lede.** O texto é igual em 3/8 e igual em 8/8 depois de normalizar o espaço antes da pontuação: o código
  removeu `<em>`/`<b>` e deixou " ." (div-m-08).
- **Aparatos, na ordem:** §00 Tese, §MAP O tabuleiro, §Caso, §Erros, §Ex, §Quiz, §Voz, §Final, §Lex, §Ref.
- **Duração, dificuldade e vídeo.** São `null` medidos: zero `<video>`, `<iframe>` e `<img>`.

## Critérios (P14 e P18)

| Forma | Onde | Texto-chave (literal) | P14 |
|---|---|---|---|
| Conversa | §00.4 (L671) e §Final item 1 | "sustentar trinta minutos de conversa com um interlocutor cético sem repetir um argumento" | cronometrado · oral · não automatizável |
| Quiz | pill, h2, lede e script | "Dez questões, critério de oito acertos"; `acertos>=8` | automatizável; o limiar não é evidência (P18) |
| Exercícios | lede do §Ex | "O critério de domínio deste bloco é de conversa sustentada…" | oral · autoavaliado, sem registro |
| Checklist | §Final | 28 itens em primeira pessoa; item 1 = conversa de 30 min | 28/28 autodeclarados; 2 cronometrados (1 e 27); 7 orais ou livres; 4 de conduta negativa |
| Roteiro oral | §Voz | "Leia em voz alta, cronometrado." | cronometrado · oral · sem limiar |

- **Quiz coerente.** Ao contrário do M01, o script do quiz é coerente com o limiar: `>=8` dá "Critério atingido…" e
  `<8` dá "Abaixo do critério de oito acertos…".
- **Onde está a contradição.** Ela é de espécie: o §00.4 diz que o critério é oral e "diferente em espécie", mas o quiz
  chama de "critério" um limiar automático (div-m-04).
- **Leitura de P14.** A marcação é inferência desta extração, não texto da fonte.

## Divergências registradas

1. **div-m-01 · horas.** A fonte não declara horas; o código tem 4–5 h.
2. **div-m-02 · trilha.** A trilha é atribuída pelo catálogo; a fonte só tem o kicker.
3. **div-m-03 · nomes dos instrumentos.** O catálogo encurta 8 dos 11 nomes: 02, 03, 04, 05, 06, 09 e 10 são cortados
   no travessão; o 11 perde ", sem repetição"; 01, 07 e 08 ficam iguais.
4. **div-m-04 · critério.** Há quatro formas (conversa × quiz × §Ex × §Voz). Ver P18.
5. **div-m-05 · caso.** O caso é "Operação A — **Parte 12**", e o lede cita "onze partes anteriores". Isso choca com a
   leitura de P17, decidida sobre o M01.
6. **div-m-06 · marca.** "GridAlpha" aparece no kicker, no box.gd da Aula 02 ("da GridAlpha") e no rodapé (2×). Pelo
   P24, ela não aparece ao learner. O código ainda carrega "da GridAlpha" em uma nota da aula-12-02.
7. **div-m-07 · gravuras.** Há 5 gravuras `geo-*` no código e zero imagens na fonte.
8. **div-m-08 · lead.** O lead do código tem espaço antes da pontuação.
9. **div-m-09 · campos do INST·02.** A intro diz "Os três campos abaixo", mas há 4 campos.
10. **div-m-10 · anglicismo.** A taxonomia (categoria 4) diz "nunca published", resíduo em inglês.
11. **div-m-11 · referências.** Ember, CFR e Wilson Center são nomeados no §Ref. É compatível com a categoria 5, mas a
    fonte não classifica cada um.
12. **div-m-12 · fichas.** O contador das fichas tem duas séries: "1–4 de 4" e "5–6 de 6".
13. **div-m-13 · categorias.** A taxonomia tem "seis categorias", mas o INST·10 tem uma classe 0 "Fora da restrição".

## Ausências declaradas

| Campo | Valor | Motivo |
|---|---|---|
| `identidade.horas` | `null` | A fonte não declara horas |
| `identidade.eixos` | `null` | A fonte fala em "vetores" e "frentes", ambos extraídos com o nome da fonte |
| `resultado_esperado` | `null` | Não há bloco de capacidades |
| `mapa.perguntas_por_aula` | `null` | O §MAP não tem tabela aula × pergunta |
| `laboratorios` | `null` | Não há § Lab |
| `tradutor` | `null` | Não há Tradutor |
| `erros_comuns.itens[].vinculo_aula` | `null` | Nenhum erro declara aula |
| `roteiro[aula].duracao/dificuldade/video` | `null` | Nada disso aparece na fonte |

## O que o código não tem

No código faltam tese, §MAP (exceto o INST·01), critérios, §Caso, §Erros, §Quiz, §Voz, §Final, §Ref, §Lex (0 de 152) e
as pills do hero. `alexandria-badges.ts` não cita o M12. `alexandria-curriculo.ts` importa só `MODULO_12_AULAS`,
`_CORPO` e `_LEAD`.

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

**Correções neste grupo:**
- **div-m-14 removida.** Era inventada: o comentário "PRIMEIRO módulo da Trilha 3" de `alexandria-trilhas.ts` L79 fica
  acima de `'bloco-13'` e descreve o bloco-13. A convenção do arquivo é comentário antes da entrada.
- **div-m-03.** A nota foi precisada: 7 nomes cortados no travessão, e o 11 perde ", sem repetição".
- **Callouts cy.** A descrição foi corrigida para §00, Aulas 02 e 05 e §Caso.

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

**Correção neste grupo:**
- **div-m-10, `leitura_b`.** A paráfrase "jargão em inglês vem com glosa em português" deu lugar ao literal do lede
  do §Lex (L2847): "Onde houver jargão em inglês corrente no mercado, ele vem com glosa em português."
