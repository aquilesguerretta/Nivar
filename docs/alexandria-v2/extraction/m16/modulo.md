# M16 · grupo "modulo"

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html`, com 5.821 linhas, LF e 438 KB.
  O arquivo tem 7.842 entidades nomeadas, de 29 tipos, e nenhuma entidade numérica.
- **Saída:** [`modulo.json`](modulo.json).
- **Extrator:** [`extratores/m16_modulo.mjs`](extratores/m16_modulo.mjs), que usa [`extratores/lib.mjs`](extratores/lib.mjs).

## Como foi extraído

- **Leitura por programa.** O Node lê o HTML com regex e com um balanceador de `div`. Nenhum texto de conteúdo foi
  digitado.
- **Entidades.** Todas são decodificadas, e o extrator falha se aparecer uma entidade sem tradução. O campo `html`
  mantém as tags inline; o campo `texto` sai sem elas.
- **Hero.** Parte dele é preenchida pelo `<script>` na hora da renderização. Por isso o script original foi executado
  num DOM simulado (`lib.mjs/runScript`), que é o mesmo método usado nos instrumentos.
- **Origem.** Todo item traz `origem {seletor, trecho_inicial, linha_aprox}`.

## Estrutura do JSON

| Chave | Conteúdo | Contagem |
|---|---|---|
| `identidade` | `<title>`, kicker, h1, subtítulo, **11 pills** (5 delas com "—" no markup, preenchidas pelo script), rodapé com 4 linhas. `horas` e `eixos` são `null`, com nota | 11 pills |
| `tese` | §00: sec-id, h2, lede, 9 subseções (§00.1–§00.9), 8 caixas, 12 parágrafos, **3 lentes**, **régua de 5 posições**, **5 candidatos a gargalo**, **4 glosas** (14 sentidos), **régua de nomeação** (3 estados) e **"o que o módulo não faz"** (6 linhas) | — |
| `resultado_esperado` | `null`, com nota | 0 |
| `mapa` | §MAP: sec-id, h2, lede, parágrafo, referência ao INST·01, caixa "Como ler o mapa". `perguntas_por_aula` é `null` | 6 tendências |
| `roteiro` | as **21 seções** em ordem (**10 aulas e 11 aparatos**), com sec-id, marcador, rótulo (lente), h2, subseções h3, instrumentos e linhas | 21 |
| `criterio` | 5 formulações literais, com marcação P14 | 5 |
| `laboratorios` | `null`: não há § Lab | 0 |
| `voz` | §Voz (roteiro oral de 10 blocos) e 7 princípios (régua de nomeação, conflito de interesse, recusas, números vivos, extensão da Trava 2, regra do verbo, política de fontes) | 10 blocos |
| `erros_comuns` | §Erros com **20 linhas** (erro e correção). `pergunta_que_evita` é `null` | 20 |
| `tradutor` | `null`: não há Tradutor nem § Map em minúsculas | 0 |
| `comparacao_codigo` | contagem de aulas por 6 sinais; comparação de título, lente, subseções e lead por aula entre fonte, código e catálogo; linha `bloco-16` | 10 aulas |
| `divergencias` | 13 itens, cada um com `leitura_a` e `leitura_b` | 13 |

## Roteiro (21 seções)

| # | Seção | Marcador · rótulo | h2 | h3 | Instrumentos |
|---|---|---|---|---|---|
| 1 | tese | §00 · Tese | Toda tendência tem um estágio e um gargalo | 9 | — |
| 2 | map | §MAP · Mapa das seis tendências | Seis famílias, quatro maneiras de reagrupá-las | 0 | INST·01 |
| 3 | a01 | Aula 01 · Lente de Estágio | Cinco posições, e a evidência que cada uma exige | 2 | INST·02 |
| 4 | a02 | Aula 02 · Lente de Gargalo | Cinco candidatos, e quase nunca é o primeiro | 2 | INST·03 |
| 5 | a03 | Aula 03 · Lente de Carga | Eletrificação de transporte: converter frota em MW | 5 | INST·04 |
| 6 | a04 | Aula 04 · Lente de Carga | Armazenamento: potência, energia e duração são três números | 6 | INST·05 |
| 7 | a05 | Aula 05 · Lente de Gargalo | Medição avançada: o que ela habilita, quem paga, e de quem é o dado | 5 | INST·06 |
| 8 | a06 | Aula 06 · Lente de Gargalo | Descentralização depois da geração distribuída | 3 | — |
| 9 | a07 | Aula 07 · Lente de Estágio | Carbono: dois mercados sem relação de substituição | 6 | INST·07, INST·08 |
| 10 | a08 | Aula 08 · Lente de Carga | Centros de dados: os cinco números do mesmo empreendimento | 5 | INST·09 |
| 11 | a09 | Aula 09 · Lente de Gargalo | Inteligência artificial aplicada: separar previsão de decisão | 4 | — |
| 12 | a10 | Aula 10 · Síntese | Mapear posicionamento sem emitir veredito sobre ninguém | 4 | INST·10, INST·11 |
| 13–21 | fichas, caso, erros, ex, quiz, voz, final, lex, ref | §Fichas, §Caso, §Erros, §Ex, §Quiz, §Voz, §Final, §Lex, §Ref | ver `roteiro[]` | — | — |

## Comparação com o código (P8) e com o catálogo (P24)

- **Contagem de aulas.** Seis sinais concordam em **10**:
  - as seções `Aula NN`;
  - a pill "10 aulas";
  - `MODULO_16_AULAS` (10 aulas);
  - `totalInModule` (10);
  - `'bloco-16': 10` em `alexandria-trilhas.ts`;
  - a tabela do catálogo canônico.
- **Títulos.** Nas 10 aulas, o `title` do código é igual ao h2 da fonte, e o `subtitle` do código é igual à lente do
  sec-id. O título do catálogo também é igual ao h2. **Não há divergência.**
- **Subseções.** A numeração dos blocos `titulo` do código é igual à dos h3 da fonte nas 10 aulas.
- **Lead.** Em 9 aulas, o lead do código é igual ao `p.lede` da fonte. A **Aula 08** não tem lede na fonte, e o código
  guarda `""` (div-m16-lead-a08).
- **Título do módulo.** O `<title>` é "Alexandria · Módulo 16 — Tendências e Disrupções", e o h1 é "Tendências e
  Disrupções". São iguais ao catálogo (`## Módulo 16 — Tendências e Disrupções`) e a `alexandria-blocks.ts`. O título
  que governa é o do catálogo (P24), e aqui ele coincide com a fonte. O subtítulo da fonte (`p.sub`) é um candidato
  a descritor editorial.
- **O que o código não tem.** Faltam:
  - a tese inteira (§00);
  - o §MAP;
  - o critério de domínio e a resolução da colisão;
  - o §Voz e o §Erros;
  - os 11 instrumentos (`MODULO_16_INSTRUMENTOS = []`);
  - todo o aparato, exceto os exercícios (ver `aparato.md`).
- **Exercícios no código.** Os 16 exercícios estão em `MODULO_16_EXERCICIOS_SOLTOS`, mas `RecursosDoModulo.tsx` só
  registra `modulo-01` a `modulo-09`. Por isso eles não chegam à tela.
- **Horas.** `alexandria-blocks.ts` traz `estimatedHoursMin: 2` e `estimatedHoursMax: 3`, mas a fonte não declara horas.

## Critérios (P14 e P18)

| Id | Onde | Texto literal (resumo do lugar) | P14 |
|---|---|---|---|
| `m16-crit-curriculo` | §00.6, caixa "Critério de domínio · texto do currículo" | "Consegue identificar 3 tendências relevantes para 2026 e mapear quais empresas brasileiras estão posicionadas para capturar cada uma." Traz 2 observações da fonte (a âncora "2026" e a colisão com a régua de nomeação), a caixa "Resolução declarada da colisão" e as 3 tendências que a Aula 10.3 dá "na data desta verificação" | produção oral ou livre; não automatizável |
| `m16-crit-quiz` | §Quiz | h2 "Dez questões, critério de oito acertos"; pill "quiz 8/10"; script `acertos>=8` com 2 mensagens | automatizável |
| `m16-crit-checklist` | §Final | "Trinta itens — o primeiro em menos de um minuto, o último é uma recusa" | item 01 cronometrado; autodeclarado |
| `m16-crit-exercicios` | §Ex, lede | "…é produzir a pergunta correta em menos de um minuto." | cronometrado; sem registro |
| `m16-crit-voz` | §Voz | "Dez minutos, para gravar e ouvir de volta" | oral e cronometrado |

A marcação P14 é inferida e precisa de revisão humana. Pelo P18, nenhum destes critérios vira "Aprovado".

## Divergências (registradas, nenhuma resolvida)

1. **Hero × catálogo (`div-m16-hero-contagens-catalogo`).**
   - O catálogo diz que o hero "ficou incompleto", com travessão em 5 campos.
   - Na fonte, as 5 pills têm "—" no markup, mas `setTxt()` (L5809–5817) as preenche no carregamento com 184, 16,
     20, 30 e 38.
   - É uma divergência entre fonte e catálogo.
2. **Cinco critérios.** São o do currículo, o do quiz 8/10, o do checklist de 30, o do §Ex e o do §Voz. Nenhum declara
   precedência.
3. **§Erros promete uma pergunta que não existe.** O h2 diz "…a correção e a pergunta que o evita", mas a tabela só
   tem as colunas "Erro" e "Correção imediata".
4. **O caso é a "parte 16".** A fonte numera o caso, o que é diferente do M01 e de P17.
5. **Aula 08 sem lede.** A fonte não tem lede nessa aula, e o código guarda `""`.
6. **Horas sem origem.** O código traz 2–3 h, e a fonte não traz horas.
7. **Instrumentos não portados.** Os 11 existem na fonte e nenhum está no código.
8. **Exercícios que não aparecem.** Os 16 estão extraídos, mas nenhuma tela os lê.
9. **Marca GridAlpha.** Aparece no kicker, no rodapé, no §00.8, nas caixas "Onde isso entra no produto" e no §Ref
   item 38. O texto foi mantido literal; P24 e P7 valem na camada de produto.
10. **"Trava 2 do War Room".** É vocabulário interno visível ao learner, e a fonte não define as travas. A caixa fica sob
    o §00.9, e a Aula 07 a cita de forma consistente.
11. **§MAP diferente do M01.** O §MAP do M16 é um mapa de tendências (INST·01), sem a tabela aula × pergunta do M01.
12. **Lentes (verificação).** O comentário do código e a fonte concordam. Não há divergência.
13. **Comentário de `alexandria-trilhas.ts` (verificação).** Diz 21 seções e 10 aulas, e concorda com a fonte. Não há
    divergência.

## Ausências declaradas

| Campo | Valor | Motivo |
|---|---|---|
| `identidade.horas` | `null` | A fonte não traz carga horária; há só "roteiro oral 10 min" |
| `identidade.eixos` | `null` | Não há "eixos" rotulados; a organização é declarada como três lentes |
| `resultado_esperado` | `null` | Não há bloco de resultado esperado nem capacidades. O critério do §00.6 e o §Final cumprem esse papel |
| `mapa.perguntas_por_aula` | `null` | O §MAP não tem tabela de perguntas |
| `laboratorios` | `null` | Não há § Lab nem LAB·NN |
| `tradutor` | `null` | Não há Tradutor. Os toggles de 3 níveis (`div.lv`) são corpo de aula |
| `erros_comuns.itens[].pergunta_que_evita` | `null` | Prometida no h2 e ausente no markup |

## Verificação

Rodar `node extratores/verify.mjs`. O resultado desta extração está em `README.md`.

### Verificação adversarial independente (2026-09-17)

- **Verbatim.** Todas as strings de conteúdo do `modulo.json` (identidade, tese, §MAP, roteiro, critérios, §Voz e
  §Erros) foram conferidas contra a fonte decodificada. Não houve falha em campo de conteúdo. As únicas não-literais são
  anotações: `divergencias[].tema/decisao`, `voz.principios[].chave/ref`, `criterio…classe` e `itens_ref`.
- **§Erros.** 20/20 linhas conferem, com erro e correção.
- **Origens.** Nenhuma está fora de ±3 linhas.
- **Contagens.** As 21 seções, as 10 aulas, os h3 por aula (2/2/5/6/5/3/6/5/4/4), as 11 pills, os 10 blocos do §Voz e a
  ausência de lede só na a08 foram recontados e **conferem**.
- **Divergências.** As 13 entradas têm evidência real na fonte ou no código. Duas delas (`div-m16-lente-contagem-codigo`
  e `div-m16-trilhas-comentario`) são **conferências sem divergência**, como os itens 12 e 13 acima já dizem. O total
  efetivo do grupo é **11 divergências**.
- **Correções.** Nenhuma foi necessária neste arquivo nem em `modulo.json`.
