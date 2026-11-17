# M07 · grupo "aparato"

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo07.html`
- **Saída:** [`aparato.json`](aparato.json)
- **Extrator:** [`extratores/m07_aparato.mjs`](extratores/m07_aparato.mjs)
- **Data:** 2026-09-17

## Método

As seções foram localizadas por `<section id>`, e os blocos, por um walker de elemento. O quiz foi lido avaliando o
literal `var Q=[…]` do `<script>`. O placar veio da execução do script original em DOM simulado
(`extratores/m07_sim.mjs`), com 0 a 10 acertos. O glossário e os exercícios foram comparados com os literais TS
avaliados.

Os campos seguem três regras:
- `html` é literal, com os espaços colapsados;
- `texto` não tem tags;
- `null` sempre vem com nota.

## Estrutura e contagens

| Chave | Seção | Contagem | No código |
|---|---|---|---|
| `caso` | § Caso (L1380) | 5 subseções (C.1–C.5), 14 blocos, 4 perguntas da própria fonte, 4 degraus, 5 itens `ck` e 1 callout | **Não extraído** |
| `avaliacao` | § Quiz (L1546) e script (Q: L2925–2986; placar: L3010–3017) | 10 questões × 4 alternativas; 2 faixas de placar | **Não extraído** |
| `checklist_final` | § Final (L1675) | 26 itens, mais a "Sequência recomendada" | **Não extraído** |
| `exercicios` | § Ex (L1469) | 12: 6 no Bloco A (roteamento) e 6 no Bloco B (navegação); 0 com aula e 12 soltos (P9) | 12 em `MODULO_07_EXERCICIOS_SOLTOS`, com divergências |
| `referencias` | § Ref (L1866) e rodapé | 27 itens: 24 com URL, 3 sem (ref-08, ref-13, ref-27) e 5 com data citada | **Não extraído** |
| `glossario` | § Lex (L1718) | 118 termos em 7 grupos | 118 idênticos em `alexandria-glossario.ts` |
| `divergencias` | — | 9 | — |

## Caso: Operação A, Parte 7

- **Título:** "A planta pela lente institucional".
- **sec-id:** "Operação A — mineração em Minas Gerais · Parte 7".
- **Card do § MAP:** "Operação A · Parte 7".

**Partes.** Diferente do M01, **a fonte numera a parte**. O lede abre com "Seis partes construíram o caso…". O dado fica
literal em `parte`. Pelo P17, a interface não usa "Parte" como estrutura.

**Subseções.**
- C.1 Aumento de demanda contratada: quem decide?
- C.2 A escada de reclamação: quatro degraus (`ol.stp`)
- C.3 O calendário da distribuidora, com o callout **"Linguagem — trava 4"**
- C.4 Se a operação decidir migrar: quais órgãos, em que ordem
- C.5 A pergunta que o bloco inteiro serve para responder: 5 portais (`ul.ck`)

**Campos vazios ou limitados.**
- **`dados`:** `null`. Não há tabela nem cifra da planta.
- **`perguntas`:** as 4 perguntas que a própria fonte formula, todas já **respondidas** por ela com "Diagnóstico:". São
  elas: a do lede, o h3 de C.1, a frase de C.1 e a frase de C.5.
- **`decisao_pedida`:** `null`. A fonte diz "Diagnóstico, sempre. Nenhuma recomendação fechada", e a decisão de migrar "é
  escopo do Bloco 9".

O Desafio de decisão do P17 fica para a camada Alexandria. Único vínculo declarado: "A Aula 05 tem a sequência completa
em nove passos" (C.4).

## Quiz: "Dez questões · critério 8/10"

**Cada questão guarda:**
- enunciado;
- 4 alternativas (índice e texto; a letra é só índice, porque a fonte não exibe letras);
- gabarito;
- explicação (`f`, igual para acerto e erro);
- os vínculos declarados no prefixo da explicação.

**Vínculos declarados.** O prefixo da explicação liga cada questão a aulas e instrumentos, por exemplo "Aula 01 e
Inst·02.". Resultado: Aula 01 (Q1); Aula 02 (Q4); Aula 03 (Q6 e Q10); Aula 04 (Q3, Q5 e Q8); Aula 05 (Q2, Q5 e Q8);
Aula 06 (Q7 e Q9). O Inst·08 é citado em 5 questões.

**Distribuição do gabarito:** índice 0 em 2 questões, 1 em 3, 2 em 2 e 3 em 3.

**Mecânica da fonte.**
- "Corrigir" corrige tudo de uma vez, e "Refazer" limpa as marcações.
- A alternativa certa recebe `opt right` e a errada, `opt wrong`.
- O placar mostra `sc / 10`.

**Faixas do script.** São coerentes com a prosa, diferente do M01.
- **`sc>=8`:** "Critério de domínio atingido. Passe para o §Voz…"
- **else:** "Abaixo do critério de 8/10. … Não avance para o §Voz antes de fechar 8."

Pelo P18, as duas mensagens ficam só como registro legado.

## Checklist final

**26 itens literais** (`m07-check-01..26`). A prosa ("Vinte e seis") e o markup conferem.

**P14.** Todos os itens são `producao_oral_ou_livre`, porque o lede manda "sustentar em voz alta, sem consultar". O item
26 ("Encontro, sem tutorial: …") é também operacional. A "Sequência recomendada de fechamento" pede os exercícios de
navegação "com o cronômetro rodando".

## Exercícios

12 no total. A tag é só o número (01–12), e **nenhum aponta aula**. A varredura "Aula NN" no summary e na resposta deu
zero, então os 12 são soltos (P9).

Cada exercício traz:
- `enunciado`, que é o summary sem o número;
- `resposta_de_referencia`, com os parágrafos literais;
- `rotulos_inline_da_resposta` ("Quem:", "Caminho:"…);
- `criterio: null`, porque a fonte não dá critério por exercício, e o lede do § Ex diz que "o gabarito descreve o
  caminho".

**No código (`MODULO_07_EXERCICIOS_SOLTOS`), divergente nos 12:**
- os parágrafos foram concatenados num só texto, sem os negritos de rótulo;
- `prompt: ""`, com o enunciado dentro de `config.tag`;
- `points: 1`, sem origem na fonte;
- em **ex-03, ex-07 e ex-11**, o gabarito tem um espaço espúrio antes da pontuação: "gun jumping .", "anexos tarifários
  .", "vigência :".

## Referências

A prosa diz "Vinte e cinco fontes, todas primárias". O markup tem **27** `<li>`.

**Campos de cada item:**
- `titulo` (o `span.src`);
- `instituicao` (só quando o prefixo é uma sigla);
- descrição (`html` e `texto`);
- `url` e `texto_do_link` (do `<a>`);
- `datas_citadas`.

**Sem URL:**
- ref-08, reorganização regimental da ANEEL (REN 1.061, de 19/04/2023, com efeito a partir de 02/05/2023);
- ref-13, Lei nº 13.848/2019;
- ref-27, **"GridAlpha · documentos internos"** (Currículo Definitivo, War Room e Plano de Negócios), que contradiz o
  "todas primárias".

**Datas.**
- **Do módulo:** a data de verificação institucional é **29 de julho de 2026** (lede e caixa final).
- **Por item:** ref-08, ref-15 (PDE 2035), ref-16 (PNE 2055), ref-19 (26/08/1998) e ref-23 (governança da CCEE, jan. e
  mar. de 2026).
- **Última verificação:** nenhum item traz a data da sua própria verificação.

Faltam os campos D5: o que responde, o que não responde, tema e recorte. `referencias.rodape` traz a frase e os avisos
do `<footer>`.

## Glossário

118 termos em 7 grupos. As contagens declaradas nos `summary` conferem com o markup:

| Grupo | Termos |
|---|---|
| Instituições e natureza jurídica | 16 |
| Instrumentos jurídicos e atos | 17 |
| Rito, processo e participação | 15 |
| Planejamento e seus produtos | 14 |
| Operação: centros, produtos e modelos | 18 |
| Comercialização: contabilização, contratos e sistemas | 22 |
| Regulação econômica, periferia e controle | 16 |

**Comparação com `alexandria-glossario.ts` (ids `gl-m07-*`):**
- 118 idênticos em termo, grupo (`unit`) e definição com HTML inline;
- 0 divergentes, **0 ausentes no código** e 0 só no código.

A fonte não declara vínculo entre termo e aula. Os `aulaIds` do código são derivados (Wave 34) e aparecem em 18 termos.

## Divergências (registradas, nenhuma resolvida)

1. **`div-m07-caso-parte`.** A fonte numera "Parte 7"; o P17 não usa "Partes" na interface.
2. **`div-m07-ref-contagem`.** A prosa diz "Vinte e cinco fontes"; o markup tem 27. O catálogo canônico repete 25.
3. **`div-m07-ref-primarias`.** A prosa diz "todas primárias", mas o ref-27 é um documento interno.
4. **`div-m07-trava`.** O caso diz "Linguagem — trava 4"; a Aula 07 fala em "Trava 1" (independência). O M01 usa Trava 3
   e Trava 4 para a regra de linguagem (P23).
5. **`div-m07-quiz-avancar`.** "Abaixo de oito, não avance" e "Critério de domínio atingido" conflitam com o P18.
6. **`div-m07-glossario-grupo-comercializacao`.** O catálogo abrevia o rótulo do grupo; a contagem confere.
7. **`div-m07-quiz-retornos-cruzados`.** Q03 aponta "Aula 04 e Inst·01", mas o Inst·01 está no § MAP. Q08 e Q10 citam o
   Inst·02, que está na Aula 01. Q02, Q05, Q06, Q07 e Q08 citam o Inst·08, que está na Aula 07, junto de outra aula
   (completado na quinta passada).
8. **`div-m07-semaforo`.** Verde e vermelho no quiz, e ok/att/per nos vereditos, contra o "zero semáforo".
9. **`div-m07-ex-gabarito-codigo`.** Três gabaritos no código não batem com a fonte.

## Verificação

`extratores/m07_verify.mjs` conferiu:
- **Strings:** 1.136 strings de conteúdo, 0 falhas.
- **Origens:** 312 origens, com o trecho a até 3 linhas: 0 falhas.

Contagens cruzadas por varredura independente, todas conferindo:

| Item | Contagem |
|---|---|
| Termos | 118 |
| Exercícios | 12 |
| Itens de checklist | 26 |
| Questões do quiz | 10 |
| Referências | 27 |

### Terceira passada (verificador adversarial, 2026-09-17)

Conferência independente, com script próprio, direto no HTML. Não houve nenhuma correção neste arquivo.

- **Quiz (100%).** O array `var Q` foi avaliado a partir do script. As 10 questões conferem com igualdade exata em
  enunciado, nas 4 alternativas, no gabarito (índice e texto) e no feedback `f`. As origens de cada alternativa e de
  cada feedback ficam a até 3 linhas. As 2 faixas de placar (`sc>=8` e `else`) conferem.
- **Checklist (100%).** Os 26 `li` do § Final conferem com igualdade exata no texto e no html, e as linhas ficam a
  até 3 da origem.
- **Exercícios.** Os 12 `summary` e todos os parágrafos de resposta conferem exatamente. Os grupos `h4` são 2 (Bloco A
  e Bloco B), com 6 itens cada.
- **Referências.** Os 27 itens conferem exatamente em título, descrição, URL e texto do link: 24 com URL e 3 sem.
- **Glossário.** Os 118 termos conferem exatamente em termo e definição, e os 7 grupos conferem nos rótulos e nas
  contagens. A comparação com `alexandria-glossario.ts` também confere: 118 idênticos em termo, grupo e definição
  html.
- **Caso.** As 5 subseções conferem. As 4 frases interrogativas da seção, recontadas, conferem com
  `perguntas[]`.
- **Strings e origens.** O único grupo que não aparece como substring do texto sem tags é o quiz, porque vive em
  literais JS. Por isso ele foi conferido por avaliação. As 602 origens ficam todas a até 3 linhas.
- **Código.** Confirmado o espaço espúrio em m07-ex-03 ("gun jumping ."), m07-ex-07 ("tarifários .") e m07-ex-11
  ("vigência :").

### Quinta passada (verificador adversarial, 2ª rodada, 2026-09-17)

Conferência independente, com scripts próprios no scratchpad, direto no HTML.

- **Quiz (100%).** `var Q` foi reavaliado. As 10 questões, as 4 alternativas de cada uma, os gabaritos (índice e
  texto), as explicações `f` e o `prefixo_literal` conferem exatamente. Os vínculos aula/instrumento de cada retorno
  batem com o prefixo.
- **Checklist (100%).** Os 26 `li` conferem em html e texto, com as linhas a até 3 da origem.
- **Grupos inteiros, igualdade exata:**
  - os 27 títulos, URLs (24) e descrições das referências;
  - os 118 `termo_bruto_html` e as definições;
  - os 12 `summary` e todos os parágrafos de resposta dos exercícios.
  A comparação com `alexandria-glossario.ts` foi refeita: 118 blocos `gl-m07-*`, 0 ausentes e 0 definições ou grupos
  divergentes. 18 blocos têm `aulaIds`, derivados só no código.
- **Caso.** As frases interrogativas da seção foram recontadas: são 4.
- **Strings e origens.** São 1.256 strings de conteúdo. As não encontradas são só metadado: ids de vínculo, "Questão N
  de 10", intervalos e campos D5. As 297 origens ficam todas a até 3 linhas.
- **Correção aplicada (1).**
  - **Problema.** `div-m07-quiz-retornos-cruzados` estava incompleta pelo próprio critério ("o vínculo aula↔instrumento
    do retorno não coincide com a posição do instrumento"). Ela listava só Q03 (Inst·01) e Q08/Q10 (Inst·02). Mas o
    Inst·08 vive em `section#a07` (L1314) e é citado junto de outra aula em Q02 ("Aula 05 e Inst·08."), Q05 ("Aulas
    04 e 05, Inst·05 e Inst·08."), Q06 ("Aula 03, Inst·04 e Inst·08."), Q07 ("Aula 06 e Inst·08.") e Q08.
  - **Correção.** `leitura_a.texto`, `leitura_a.linhas` (mais L2937, L2955, L2961, L2967) e `leitura_b.texto` (mais
    "Inst · 08 em section#a07 (L1314)") foram completados. A correção foi feita em `m07_aparato.mjs`, e o JSON foi
    regenerado. O diff se limita a essa entrada; a contagem de divergências continua 9. Os demais retornos conferem
    com a posição: Q01 (Inst·02 na A01), Q04 (Inst·03 na A02), Q05 (Inst·05 na A04), Q06 (Inst·04 na A03) e Q09
    (Inst·07 na A06).

Item 7 da lista de divergências, atualizado: Q03 aponta o Inst·01, que está no § MAP. Q08 e Q10 citam o Inst·02, que
está na Aula 01. Q02, Q05, Q06, Q07 e Q08 citam o Inst·08, que está na Aula 07, junto de outra aula.
