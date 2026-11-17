# Extração M16 — Tendências e Disrupções

Esta pasta guarda a **camada fonte** do Módulo 16. A fonte é `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html`
(5.821 linhas, 438 KB), lida só para consulta.

- **Texto.** Todo texto é verbatim, com as entidades decodificadas e os espaços colapsados, e traz
  `origem {seletor, trecho_inicial, linha_aprox}`.
- **Ausências.** Cada ausência é `null` com nota.
- **Divergências.** Nenhuma foi resolvida aqui: as duas leituras ficam registradas. As decisões P17–P24 valem só na camada
  Alexandria.

## Arquivos

| Grupo | Arquivos | Conteúdo |
|---|---|---|
| modulo | `modulo.json`, `modulo.md` | Identidade (título, subtítulo, 11 pills, rodapé), tese §00, §MAP, roteiro de 21 seções, 5 critérios com marcação P14, §Voz e princípios, §Erros, comparação com código e catálogo, 13 divergências |
| aparato | `aparato.json`, `aparato.md` | Caso (Operação A), 6 fichas, quiz, checklist final, 16 exercícios, 38 referências, glossário de 184 termos, 8 divergências |
| instrumentos | `instrumentos.json`, `instrumentos.md` | Os 11 instrumentos: invocação, entradas (rótulo, unidade, faixa, padrão), saídas, fórmulas verbatim do script, cenário-padrão executado, ramos do veredito, dados, fonte dos números e status no código |

**Extratores** (em `extratores/`; só leem a fonte e o código):

| Script | Papel |
|---|---|
| `lib.mjs` | Leitura da fonte, decodificação de entidades (falha se houver entidade sem tradução), seções, `div` balanceada, literais do script e **DOM simulado** que executa o `<script>` original |
| `m16_modulo.mjs` | Gera `modulo.json` |
| `m16_aparato.mjs` | Gera `aparato.json` |
| `m16_instrumentos.mjs` | Gera `instrumentos.json`. Executa o script original para o cenário-padrão, as renderizações e a varredura de ramos |
| `m16_instrumentos_md.mjs` | Gera `instrumentos.md` a partir do JSON |
| `verify.mjs` → `verify.result.json` | Verificador adversarial. Confere as strings de conteúdo contra a fonte, cada `origem` a no máximo 3 linhas e as linhas de script verbatim. Também reconta os itens no markup e compara render × dados |
| `verify-extra.mjs` → `verify-extra.result.json` | Confere as chaves de texto que o `verify.mjs` pula: rótulos, unidades, opções, rótulos fixos, frases em `<b>` dos vereditos e `min/max/step/value` de cada campo contra o atributo literal |
| `coverage.mjs` → `coverage.result.json` | Cobertura por token com baixa (protocolo §5). Desconta os instrumentos do denominador das seções |

A ordem de execução é: `m16_modulo` → `m16_aparato` → `m16_instrumentos` → `m16_instrumentos_md` → `verify` →
`verify-extra` → `coverage`. A saída é determinística: rodar de novo em 2026-09-17 produziu JSON com bytes idênticos.

`modulo.md` e `aparato.md` foram escritos a partir dos JSON. As contagens deles foram reconferidas contra os JSON nesta
data.

## Contagens

| Item | Fonte | Código atual (`src/lib/data`) |
|---|---|---|
| Seções | 21: 10 aulas e 11 aparatos | — |
| Aulas | **10**. Seis sinais concordam: os sec-id `Aula NN`, a pill "10 aulas", `MODULO_16_AULAS`, `totalInModule`, `'bloco-16': 10` e o catálogo | 10. Título = h2 e subtítulo = lente em 10/10; lead = lede em 9/10 (a Aula 08 não tem lede) |
| Subseções por aula | 2 · 2 · 5 · 6 · 5 · 3 · 6 · 5 · 4 · 4 | Numeração igual em 10/10 |
| Instrumentos | **11**: 1 de módulo (INST·01, §MAP) e 10 de aula. Há 5 numéricos e 6 de seleção e texto. As aulas 06 e 09 não têm instrumento; as aulas 07 e 10 têm dois cada | **0 portados**: `MODULO_16_INSTRUMENTOS = []` e nenhuma calculadora do M16 |
| Termos (§Lex) | **184** em 8 famílias (20/20/22/22/28/24/26/22). Prosa, soma das famílias, markup e catálogo concordam | **0**; faltam os 184 (lista em `aparato.md`) |
| Exercícios (§Ex) | **16** em 4 famílias (4/4/6/2). **Todos são soltos** (P9): nenhum tem tag, aula ou critério próprio | 16 em `MODULO_16_EXERCICIOS_SOLTOS`, com prompt e gabarito idênticos em 16/16. `tag` e `points` não têm origem na fonte, e `RecursosDoModulo.tsx` não registra o módulo 16 |
| Checklist (§Final) | **30** itens; o item 01 é cronometrado e o item 30 é uma recusa | ausente |
| Quiz (§Quiz) | **10** questões × 4 alternativas. Gabarito: A 3, B 2, C 3, D 2. Há 2 faixas de placar (`acertos>=8`) | ausente |
| Erros comuns (§Erros) | **20** (erro e correção) | ausente |
| Referências (§Ref) | **38**: 0 com URL, 0 com domínio, 31 com data citada. A data de consulta é uma só (4/8/2026). Há 8 gatilhos de reverificação | ausente |
| Fichas (§Fichas) | 6 × 7 campos; o campo "O que este número não diz" fica incompleto por desenho | ausente |
| Caso (§Caso) | 3 subseções e 6 linhas de diagnóstico. Não tem perguntas nem decisão (`null`) | ausente |
| Critérios | 5 formulações literais (currículo, quiz 8/10, checklist 30, §Ex, §Voz) | ausente |
| Roteiro oral (§Voz) | 10 blocos (10 min) | ausente |
| Laboratórios / Tradutor | 0 / 0 (`null`) | — |
| Horas | `null`: a fonte não declara | `alexandria-blocks.ts` traz 2–3 h, sem origem |
| Divergências registradas | 22 entradas: 13 (modulo) + 8 (aparato) + 1 local (INST·04). **3 dessas entradas são conferências sem divergência** (`div-m16-lente-contagem-codigo`, `div-m16-trilhas-comentario`, `div-m16-lex-colisao`, com `decisao: "sem divergência"`). Divergências efetivas: **19** | — |

## Verificação (2026-09-17)

| Verificação | Resultado |
|---|---|
| `verify.mjs`: strings de conteúdo contra a fonte | modulo 578, aparato 1.058 e instrumentos 124, todas com **0 falhas** |
| `verify.mjs`: `origem` a no máximo 3 linhas | 270 + 340 + 92, com **0 falhas** |
| `verify.mjs`: dados do script e linhas de código verbatim | 783, com **0 falhas** |
| `verify.mjs`: recontagem no markup | 10 aulas, 21 seções, 11 instrumentos, 184 termos, 16 exercícios, 30 itens de checklist, 20 erros, 38 referências, 10 questões e 6 fichas. **Tudo igual** ao extraído |
| `verify.mjs`: render × dados (INST·01/07/10/11) | 300 conferências, **0 falhas** |
| `verify-extra.mjs`: rótulos, unidades, opções e critérios | modulo 54, aparato 37 e instrumentos 244, com **0 falhas**. "Questão N de 10" é conferido contra o template do script (L5767) |
| `verify-extra.mjs`: frases em `<b>` dos vereditos alcançados | 151, com **0 falhas** |
| `verify-extra.mjs`: `min/max/step/value` × atributo literal | 64 campos, com **0 falhas** |
| `coverage.mjs`: cobertura por token | **100%** nas 11 seções (tese 3.425/3.426: o token restante é o "5" da régua, guardado como número). No markup dos 11 instrumentos, de 97,3% a 98,7%, e o resíduo é o id "INST·NN" |
| Recálculo manual do cenário-padrão | INST·04 dá 2.266,7 kWh/veículo, 378.592 MWh/ano, 0,040% e 370,8 MW. INST·05 dá 120, 108, 39.528 e 45.963 MWh, R$ 93,02/MWh e R$ 404 mil/MW-ano. **Iguais** à execução do script |

### Verificação adversarial independente (2026-09-17)

Os scripts do verificador foram escritos do zero, sem reaproveitar `lib.mjs` nem `verify*.mjs`. Ficaram no scratchpad da
sessão e não entraram nesta pasta.

| Checagem | Método próprio | Resultado |
|---|---|---|
| Verbatim geral | Varredura de **3.411 strings** (15 caracteres ou mais) dos 3 JSON contra a fonte decodificada, em 4 formas: sem tags, com tags, script cru e script com escape | Todas as falhas são anotações (`tema`, `decisao`, `chave`, `ref`, `mecanica`, `metodo`, `assinatura`) ou saídas **renderizadas** pela execução do script (`renderizacoes`, `cenario_padrao`, `ramos_alcancados`), que por natureza não são literais do arquivo. **Nenhum campo de conteúdo falhou** |
| Quiz (100%) | `eval` do literal `var Q=[…]` (L5693), comparado por igualdade exata | 10/10 enunciados, 40/40 alternativas, 10/10 gabaritos (índice, letra e texto) e 10/10 explicações. Origens exatas (L5694…L5757, uma a cada 7 linhas). Gabarito: A 3, B 2, C 3, D 2 |
| Checklist (100%) | `ul.ck > li` de `section#final`, por igualdade exata em `texto` e `html`, mais a linha | 30/30 |
| Erros, referências e exercícios (100%) | Por linha de tabela, por `li` e por `details` | Erros 20/20. Referências 38/38 (categoria e texto). Exercícios 16/16 (summary e `det-bd`) |
| Glossário (100%) | Por `span.term` até o próximo termo | 184/184 termos e definições, com o separador "— " retirado. O único caso é o termo 97, "*Spread* mínimo de equilíbrio": o `<em>` foi retirado em `termo`, o que é esperado |
| Fórmulas e código (100%) | Cada par `{linha, codigo}` dos instrumentos contra `lines[linha-1]` | **196/196 idênticos**. Nos 5 numéricos (04, 05, 06, 08, 09), todas as linhas aritméticas `var x = …` do bloco do script estão capturadas |
| Dados do script | `eval` independente de cada `var KEY=` em `dados` | 16/17 idênticos. `TND` (L4973) fica fora do bloco do INST·01 e foi conferido à parte. INST·07 `L` difere só por "veda&ccedil;ão" (L5504), que foi decodificada. Isso já está declarado em `entidades_decodificadas`, e a entidade é tolerada |
| Cenário-padrão INST·09 | Conta à mão | 117,0 MW · 130,0 MW · 1.025 GWh · 1,71× · 0,109% · 29,3 MW. **Igual** |
| Origens | Mapa caractere→linha sobre a fonte decodificada, com e sem tags | **863 origens, 0 fora de ±3**. As 6 linhas do diagnóstico 16.1 (L3706–3743) não casam por texto porque o trecho junta "Muda · 1" e o nome, que na fonte estão separados por `<br>` sem espaço. Pela conferência manual, as linhas estão corretas |
| Contagens | Recontagem por regex no markup e no script | Todas iguais às declaradas: 21 seções; 10 aulas; h3 2/2/5/6/5/3/6/5/4/4; 11 `div.inst` (5 com `type="number"`, 6 de seleção); 184 termos (20/20/22/22/28/24/26/22); 16 exercícios (4/4/6/2); 30 itens; 20 erros; 38 referências (0 URL; 31 com data ou ano); 8 gatilhos; 6 fichas × 7 campos (36 `emp-row` + 6 `vazio`); caso com 3 h3 e 6 `grg-r`; 10 `clk-r`; 11 pills; lede ausente só na a08; 16 homônimos no glossário do código (mesma lista); 0 `gl-m16`; exercícios do código com prompt e gabarito idênticos em 16/16; `RecursosDoModulo.tsx` sem `modulo-16` |
| Cobertura | Blocos de texto das seções que não são aula, contra o conjunto de strings do JSON | Hero, rodapé, map, fichas, caso, erros, ex, quiz, final e ref têm 0 ausências. Os resíduos de tese, voz e lex são artefato do método (rótulo e texto em campos separados, separador "—"). Por amostragem, os trechos estão presentes. O corpo das aulas fica fora do escopo, como nos M02–M15 (o código já tem `MODULO_16_CORPO`) |
| Divergências | Evidência de cada uma conferida na fonte | Nenhuma foi inventada. As linhas citadas batem: L819, L1125, L1211, L1273–1274, L2562, L3772, L3798/3802, L5010, L5084 e L5809–5817. A ortografia bate: prórroga 15, perimetro 4, ministérial 3, controvéria 1, milhóes 1 e acção 1. O passo do INST·04 é 1 no número e 1000 no deslizador |

**Correção feita.** A contagem "22 divergências registradas" incluía 3 entradas cuja `decisao` é "sem divergência". A
linha da tabela de Contagens agora separa as **22 entradas** das **19 divergências efetivas**. Os JSON não foram
alterados, porque `contagens.divergencias` conta corretamente o tamanho do array.

## Divergências (todas registradas, nenhuma resolvida)

### Fonte × fonte

1. **Estágio da medição avançada** (`div-m16-estagio-medicao`).
   - A ficha 03 e o INST·01 dizem "regulado, em implantação inicial".
   - O INST·02 (posição 3) diz "regulado e não construído".
   - A régua define a posição 3 como "não há ativo operando", mas a obrigação corre desde 1º/03/2026.
2. **Cinco formulações de critério** (`div-m16-criterios`). São o texto do currículo (§00.6), o quiz 8/10, o checklist de
   30, o "menos de um minuto" do §Ex e os "Dez minutos" do §Voz. Nenhuma declara precedência. Pelo P18, nenhuma vira
   "Aprovado".
3. **§Erros** (`div-m16-erros-pergunta`). O h2 promete "a pergunta que o evita", mas a tabela só tem Erro e Correção.
4. **§Ref** (`div-m16-ref-data-consulta`). O h2 promete "data de consulta", mas ela é só global.
5. **§Ex** (`div-m16-ex-gabarito-fechado`). O h2 diz "gabarito fechado até você tentar", mas o `<details>` abre
   livremente.
6. **Q02** (`div-m16-quiz-q02-microhibridos`). A frase sobre micro-híbridos é ambígua.
7. **INST·04, campo "Veículos com tomada".** O passo do número é 1 e o do deslizador é 1.000.
8. **Ortografia** (`div-m16-ortografia`). Mantidas literais: "prórroga" ×15, "perimetro" ×4, "ministérial" ×3,
   "controvéria", "milhóes" e "acção".
9. **Caso numerado como "parte 16"** (`div-m16-caso-parte`). A fonte numera o próprio caso e cita as partes 9–15, o que
   colide com P17 ("não existe Parte"). A numeração é da fonte e fica registrada. O título de produto é da camada
   Alexandria.
10. **Linguagem interna visível** (`div-m16-trava-war-room`, `div-m16-marca-gridalpha`). "Trava 2 do War Room" e
    "Travas" aparecem sem definição. "GridAlpha" aparece no kicker, no rodapé, no §00.8, nos blocos "onde isso entra no
    produto" e no §Ref 38. Valem P23, P24 e P7 na camada de produto.

**Conferido sem divergência:**
- as quatro palavras de colisão têm verbete;
- as "três lentes" do código e da fonte concordam;
- o comentário de `alexandria-trilhas.ts` concorda (21 seções, 10 aulas);
- "30 MW e duas horas" (q04) × "quatro horas" (INST·05, 04.x): o q04 é uma hipótese, e a explicação cita as 4 h do
  certame.

### Fonte × código

- **Instrumentos.** Os 11 não estão portados (`div-m16-instrumentos-codigo`), embora o comentário do código anuncie o
  instrumento do §MAP.
- **Exercícios.** Os 16 estão extraídos e não são renderizados, porque `RecursosDoModulo.tsx` não tem `modulo-16`
  (`div-m16-exercicios-inalcancaveis`). Além disso, `tag: "Ex N"` e `points: 10` não têm origem na fonte
  (`div-m16-exercicios-codigo`).
- **Glossário.** Os 184 termos estão ausentes (`div-m16-glossario-codigo`). Desses, 16 têm homônimo em outro módulo, que o
  código trata como verbete distinto (lista em `aparato.md`).
- **Aula 08.** A fonte não tem lede, e o código guarda `""` (`div-m16-lead-a08`).
- **Horas.** O código traz 2–3 h, e a fonte não traz horas (`div-m16-horas-codigo`).
- **Ausentes no código.** Faltam a tese §00, o §MAP, os critérios, o §Voz, o §Erros, o caso, as fichas, o quiz, o
  checklist e as referências.

### Fonte × catálogo canônico

- **Título.** O `<title>`, o h1 e o catálogo dizem **"Tendências e Disrupções"**, então não há divergência (P24). O
  `p.sub` da fonte fica como candidato a descritor editorial.
- **Hero** (`div-m16-hero-contagens-catalogo`).
  - O catálogo diz que o hero "ficou incompleto", com travessão em 5 campos.
  - No markup há de fato "—", mas `setTxt()` (L5809–5817) preenche 184, 16, 20, 30 e 38 no carregamento.
  - O catálogo descreve o markup, não a página renderizada.
- **Trilha.** O catálogo diz "Especialização Estratégica — atribuída", e a fonte traz só `Alexandria · GridAlpha · Módulo 16`.
- **Concordâncias.**
  - Os títulos das 10 aulas e dos 11 instrumentos são iguais (comparação por programa).
  - Aulas, instrumentos, fichas, termos por família, exercícios, erros, itens de checklist, referências e roteiro oral
    batem com a escala.

## Lacunas da fonte (declaradas, não preenchidas)

- **Módulo.**
  - Não há `resultado_esperado` nem capacidades, nem horas ou eixos.
  - O §MAP não tem perguntas por aula.
  - Não há § Lab nem Tradutor.
  - Não há a "pergunta que o evita" nos 20 erros.
- **Caso.** Não tem tabela de dados, perguntas ao learner nem decisão pedida. Só há uma pergunta embutida no diagnóstico
  e respondida pela própria fonte. O Desafio de decisão (P17) é da camada Alexandria.
- **Exercícios.** Nenhum tem tag, aula ou critério.
- **Referências.** Nenhuma tem URL, domínio, título ou instituição nomeada, nem data de consulta por item ou campos D5.
- **Instrumentos.**
  - Nenhum tem pergunta ao learner nem tolerância.
  - A fonte dos padrões numéricos só é declarada no INST·04 (167.026 e 939 TWh) e no INST·05 (30 MW, 4 h e 366 ciclos),
    e em parte no INST·06, onde o custo por ponto é declarado "não oficial". Os demais são "cenário didático presente no
    módulo" (P19).
- **Fichas.** O campo "O que este número não diz" é incompleto por desenho.
