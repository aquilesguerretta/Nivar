# M06 · grupo "aparato"

Fonte (só leitura): `alexandria_modulo06.html`. Saída: [`aparato.json`](aparato.json).
Extrator: [`extratores/m06_aparato.mjs`](extratores/m06_aparato.mjs).

**Método.** Um parser de pilha lê cada `section#id`. O quiz sai da avaliação do literal `var Q=[...]` do `<script>`
(L2249–2310) num `vm` isolado. A comparação com o código usa o bundle esbuild, só para leitura.

**Verificação.** `verify-m06.mjs` conferiu 796 strings e 225 origens, com 0 falhas. A cobertura por token ficou em 100%
em Caso, Quiz (a section e o literal `Q`), Final, Ex, Ref e Lex.

## Contagens

| Item | Contagem |
|---|---|
| Caso | 1 section, 4 subseções (C.1–C.4), 14 blocos, 1 caixa, 10 perguntas de diagnóstico na prosa, **0 dados numéricos**, 0 decisão pedida |
| Quiz | **10 questões × 4 alternativas**, 2 faixas de mensagem (≥8 / resto) |
| Checklist final | **24 itens** (a prosa diz "Vinte e quatro") |
| Exercícios | **10**; **0 com aula**; 10 soltos (P9) |
| Referências | **21**; 5 com URL (7 links); 4 com data no texto; 3 com "Números vivos" |
| Glossário | **99 termos** em 6 famílias (21 / 22 / 14 / 16 / 13 / 13); contagem declarada = markup em todas |

## Caso — Operação A (P17)

- **Marcador** (L1083): "§Caso · Operação A — mineração em Minas Gerais · **Parte 6**".
- **h2**: "A planta pela lente da história".
- **Parte.** A fonte numera a parte literalmente e diz que "as cinco partes anteriores" estão em outros módulos. O campo
  `parte` guarda "Parte 6", com nota. P17 vale para a camada de produto.
- **Seções.**
  - C.1 A primeira pergunta é a idade.
  - C.2 Quem atende, e desde quando.
  - C.3 Quando esta operação ficou elegível.
  - C.4 O que este bloco permite dizer — e o que não permite. Inclui a caixa "Disciplina de linguagem".
- **Dados: nenhum.** C.3 manda usar "a demanda contratada da Operação A", mas não traz o valor. Nada foi preenchido.
- **Perguntas.** `perguntas_na_prosa` guarda 10 perguntas literais que o caso dirige ao analista. Exemplos: "Desde quando
  a operação opera nesse local?" e "Com a demanda contratada da Operação A, em que ano ela cruzou o limiar de
  elegibilidade ao mercado livre?". Não têm gabarito.
- **Decisão pedida: `null`.** O caso diz que a migração "precisa ser uma escolha consciente" e que a parte não produz
  "recomendação fechada".
- **Entregável** (L1110): "uma folha só: linha do tempo da própria Operação A, com quatro faixas paralelas".
- **Vínculo declarado.** "Use a escada da Aula 05 e o instrumento da Aula 06". A Aula 06 tem 2 instrumentos (div-04).
- **No código:** ausente.

## Quiz (P18)

| Q | Gabarito | Aula declarada no feedback |
|---|---|---|
| 01 | B | Aula 01 |
| 02 | B | Aula 01 |
| 03 | B | Aula 01 e Inst·02 |
| 04 | C | Aula 02 |
| 05 | B | Aula 02 |
| 06 | B | Aula 03 |
| 07 | B | Aula 03 |
| 08 | B | Aula 04 |
| 09 | B | Aula 05 e Inst·06 |
| 10 | B | Aulas 05 e 06 e Inst·07 |

**Mensagens do script.**
- `sc>=8` (L2337): "Critério de domínio atingido. Passe para o §Voz… O critério oficial deste bloco é oral, não
  escrito."
- `else` (L2340): "Abaixo do critério de 8/10… Não avance para o §Voz antes de fechar 8."

O placar aparece como `sc+' / 10'`. Diferente do M01, prosa, pill e script concordam no limiar 8. A contradição que
sobra é outra: 8/10 contra o critério oral (div-01).

**Mecânica da fonte (registro).**
- Todas as questões aparecem de uma vez.
- "Corrigir" mostra a explicação de todas, inclusive das não respondidas, e marca em verde e vermelho.
- "Refazer" limpa. Não há persistência.
- A explicação é a mesma para acerto e erro.

**Para content QA.**
- **Viés de gabarito:** 9 das 10 respostas são a alternativa B.
- **Instrumentos não citados:** o quiz não cita os Inst · 01, 03, 04, 05 e 08.
- **Código:** o quiz não existe no código.

## Checklist final

São 24 itens literais (L1325–1348), todos autodeclarados e "sem consultar" (lede). `marcacao_p14` é inferida pelo verbo
inicial:
- o item 01 é cronometrado ("em dez minutos");
- os itens que começam por Cita, Dá, Diz, Nomeia, Enumera e Recita são de recordação;
- os demais são de produção oral ou livre.

O item 24 pede defender "a independência analítica da GridAlpha" (P24). O lede promete que cada falha "aponta uma aula
específica", mas nenhum item declara aula (`aula_vinculada: null`). No código não há checklist nem badge do M06.

## Exercícios (P9)

| Tag | Aula | Rótulo da resposta |
|---|---|---|
| 01 · Ordem institucional | — | Gabarito. |
| 02 · Corrigir uma afirmação de mesa | — | Gabarito. |
| 03 · Aplicar a régua dos seis | — | Gabarito. |
| 04 · Racionamento e blecaute | — | Gabarito. |
| 05 · A lógica e o problema da MP 579 | — | Gabarito. |
| 06 · O rateio como sistema fechado | — | Gabarito. |
| 07 · Capitalização versus venda direta | — | Gabarito. |
| 08 · O que muda e o que não muda com uma marca | — | Gabarito. |
| 09 · A escada da abertura | — | Gabarito. |
| 10 · Trauma, cicatriz e risco novo | — | Gabarito (uma composição possível). |

**Vínculo com aula.** A varredura por "Aula NN", "Inst · NN" e "§" nos três campos (summary, pergunta, gabarito) deu
zero. Os 10 são soltos. Nenhum tem critério próprio; o que existe é a instrução geral do lede.

**No código** (`MODULO_06_EXERCICIOS_SOLTOS`): os 10 estão lá, com tag igual e status **divergente**.
- `prompt: ""`.
- `config.gabarito` junta "Pergunta. … Gabarito. …" num só campo.
- `points: 1` não tem origem na fonte.
- A concatenação é exata em 9 dos 10. No Ex 03 há um espaço inserido onde havia `<em>` ("o quando , não o se .").

## Referências

Cada item traz: título literal (`span.src`), descrição, links (href e texto como estão), datas encontradas no texto e a
marca "Números vivos". `instituicao` é `null`: quando a instituição aparece, está dentro do título.

**URLs.**

| Ref | Endereço |
|---|---|
| 01 | memoriadaeletricidade.com.br |
| 14 | PDF da Portaria 514/2018 em gov.br/mme |
| 16 | gov.br/mme, reforma e abertura |
| 19 | ri.axia.com.br |
| 20 | gov.br/aneel, ons.org.br e ccee.org.br |

**Números vivos:** refs 13, 17 e 19.

**Lacunas D5.** Nenhuma referência traz tipo, data de verificação, "o que responde / o que não responde" ou recorte. As
referências não estão no código.

## Glossário

Há 99 termos com definição literal (`termo_marcado` é o span com o ponto; `termo` é o mesmo sem o ponto).

**Comparação com `alexandria-glossario.ts` (`gl-m06-*`).**

| Resultado | Termos |
|---|---|
| Idênticos | 99 (termo, família = `unit`, definição) |
| Divergentes | 0 |
| Ausentes no código | 0 |
| Só no código | 0 |

**Nenhum termo falta no código.** Os `aulaIds` do código são derivação e não vêm da fonte. O catálogo canônico abrevia
alguns nomes, como "Imposto Único" e "Revisão extraordinária".

## Divergências

| Id | Tema |
|---|---|
| ap-div-01 | Quiz 8/10 × critério "oficial" oral, na mesma mensagem |
| ap-div-02 | Vínculo questão → aula só pelo prefixo do feedback; o quiz cita 3 dos 8 instrumentos |
| ap-div-03 | "Parte 6" e "cinco partes anteriores" com quatro lentes |
| ap-div-04 | "o instrumento da Aula 06" sem número (Inst 07 ou 08) |
| ap-div-05 | Estrutura dos exercícios no código |
| ap-div-06 | Glossário: 99 = 99, sem divergência de texto |
| ap-div-07 | O quiz manda não avançar ao §Voz antes de 8/10 (gate da fonte, que P18 não adota) |

## Lacunas

- **Caso:** não tem dados nem decisão.
- **Quiz:** não tem vínculo estrutural com aula, e o feedback é único para acerto e erro.
- **Checklist:** nenhum item tem aula.
- **Exercícios:** não têm critério nem aula.
- **Referências:**
  - não têm tipo nem data de verificação;
  - 16 das 21 não têm URL.
- **Fora do código:** caso, quiz, checklist e referências só existem no HTML.

## Verificação (verificador adversarial, 2026-09-17)

- **Quiz:** 100% conferido. O array `Q` foi avaliado direto do script e comparado com os 10 enunciados, as 40
  alternativas, os 10 gabaritos (a=1 em 9 questões e a=2 na Q4) e os 10 feedbacks. Tudo idêntico, e as 2 faixas e
  mensagens também.
- **Checklist:** 100% dos 24 itens idênticos, com a linha exata.
- **Glossário:** os 99 termos e definições são idênticos, estão na linha exata e caem nas 6 famílias com as contagens
  declaradas.
- **Exercícios:** 10, com pergunta e gabarito em 2 `<p>` cada, e nenhum vínculo de aula.
- **Referências:** 21 itens, dos quais 5 com URL (7 links), 3 com "Números vivos" e 4 com data por extenso no texto.
- **Caso:** 4 subseções e 10 "?" na prosa. Não há dados nem decisão pedida.
- **Correções:** nenhuma.

## Verificação (2ª passada, verificador adversarial, 2026-09-17)

Recontagem independente com scripts próprios, direto no HTML:
- **Quiz:** conferido de novo a 100%, avaliando o `var Q` (L2249–2310). Os 10 enunciados, as 40 alternativas, os
  gabaritos (9 B e 1 C), os feedbacks, a aula declarada e as origens (±3) conferem.
- **Checklist:** os 24 `li` (html e texto) conferem, com origem a ±3 linhas.
- **Glossário:** os 99 termos, definições e famílias conferem (21/22/14/16/13/13).
- **Referências:** 21 títulos e URLs conferem (5 com URL, 7 links).
- **Caso:** as 10 perguntas conferem com os "?" da prosa.

**Correção 1.** Duas origens estavam sem `trecho_inicial`, que o protocolo exige: `caso.vinculos.declarados_na_fonte[0]`
(L1098) e `avaliacao.mecanica_fonte` (L2321). Os trechos literais da linha foram acrescentados no JSON e em
`extratores/m06_aparato.mjs`.
