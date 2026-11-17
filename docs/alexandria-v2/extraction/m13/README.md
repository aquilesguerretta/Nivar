# Extração M13 — Análise Financeira de Empresas e Projetos

Esta é a camada **fonte** do Módulo 13: texto literal, sempre com origem, e sem nenhuma contradição resolvida. A
fonte é `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo13.html` (4.267 linhas, 18 `section`, script
L3312–4264), lida só para leitura. As resoluções P17–P24
([`../../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../../decisoes/2026-09-16-ambiguidades-de-conteudo.md))
valem para a camada de produto e não foram aplicadas aqui.

## Arquivos

| Grupo | Arquivos | Conteúdo |
|---|---|---|
| modulo | `modulo.json`, `modulo.md` | identidade, catálogo (P24), tese (§00, com as três lentes), §MAP (Painel setorial), roteiro de 18 seções, critérios literais (P14), §Voz e princípios, caixas P7 e "Números vivos", §Erros, e as ausências (resultado esperado, § Lab, Tradutor) |
| aparato | `aparato.json`, `aparato.md` | §Caso, §Quiz (markup e script), §Final, §Ex, §Ref e §Lex |
| instrumentos | `instrumentos.json`, `instrumentos.md` | os 11 `INST·NN`: markup, entradas, saídas com a expressão do script, cálculo, ramos, dados, script (verbatim nos 3 numéricos; nos outros 8, com os literais de dados trocados por marcador), cenário-padrão executado, espaço de entrada e estado no código |

**Verificação** (`extratores/m13_verify.mjs`, relatório em `extratores/verify-report.json`):
- 3.489 strings de conteúdo são substring da fonte normalizada, sem falhas.
- 614 origens estão na linha declarada (±3), sem falhas.
- A cobertura por token é de 100% em todas as 33 medidas: §00, §MAP, §Voz, §Erros, §Caso, §Ex, §Quiz (markup e
  script), §Final, §Lex, §Ref e os 11 instrumentos (markup e strings do script).

**Extratores** (em `extratores/`, Node 24, sem dependências):
- `m13_lib.mjs`: parser HTML com offsets, origem, leitor de literais JS por vm e DOM simulado que roda o `<script>`
  original sem alteração.
- `m13_blocos.mjs`: percorre os blocos de cada `section` (vocabulário `sec-id`/`lede`/`inst`).
- `m13_p14.mjs`: marcação P14 inferida.
- `m13_modulo.mjs`, `m13_aparato.mjs` e `m13_instrumentos.mjs`: um extrator por grupo.
- `m13_verify.mjs`: o verificador.
- `m13_md.mjs`: gera os três `.md` a partir dos JSONs, sem digitar conteúdo.

Para regenerar, rode dentro de `extratores/`:
`node m13_modulo.mjs && node m13_aparato.mjs && node m13_instrumentos.mjs && node m13_verify.mjs && node m13_md.mjs`.

O M13 usa o vocabulário dos M04+, não o do M01. Por isso os extratores do M01 serviram de **modelo de saída**, e o
código foi escrito para este arquivo e conferido nele.

**Correções desta passada** (a primeira geração dos JSONs tinha três defeitos, achados na revisão):
- As faixas do placar do quiz guardavam `"pass"`/`"fail"` no lugar da mensagem. O script tem dois ternários
  `acertos>=8`, e o extrator pegava o primeiro. A execução agora confere que a mensagem renderizada é a da faixa.
- Quatro perguntas do caso, as do `div.t333`, estavam sem origem.
- A nota das referências dizia "três itens" com "Consulta em". São dois, e a contagem agora é derivada.

Também foram corrigidos a trilha do catálogo, que estava truncada, e `linhas_total`, que contava a linha vazia
final.

**Segunda verificação adversarial** (2026-09-17, scripts independentes; detalhe em `modulo.md` › Verificação):
- Verbatim, origens, quiz (100%), checklist (100%), fórmulas dos 3 instrumentos numéricos e contagens: sem erro.
- Duas correções:
  - a nota de `voz.blocos_produto_P7` chamava Energy Brief de "marca morta" (P24 só trata de GridAlpha);
  - este README falava em "9 caixas de produto" com "GridAlpha". São 8.

## Contagens

| Item | Contagem | Observação |
|---|---|---|
| Seções | **18** | 8 aulas e 10 aparatos: §00, §MAP, §Caso, §Erros, §Ex, §Quiz, §Voz, §Final, §Lex e §Ref |
| Aulas | **8** | h2, pill, catálogo, `alexandria-trilhas.ts` (`'bloco-13': 8`) e código (`aula-13-01…08`) concordam |
| Instrumentos | **11** | 10 de aula e 1 fora de aula (INST·01, no §MAP); as Aulas 03 e 04 têm dois cada; **0 portados** |
| Termos (§Lex) | **180** | em 8 famílias (26/22/26/24/20/26/20/16); prosa, pill, famílias e markup concordam; **0 no código, faltam os 180** |
| Exercícios | **14** | **todos soltos** (nenhuma tag aponta aula); 5 grupos (Ex.1 4, Ex.2 3, Ex.3 3, Ex.4 2, Ex.5 2); nenhum com critério próprio |
| Checklist (§Final) | **28** | todos autodeclarados ("Produzo…", "Sei que…"); P14 inferido: 1 cronometrado, 3 orais, 4 de cálculo, 1 de produção livre |
| Quiz | **10 × 4** | gabarito D B A B C B A D C B; 2 faixas (≥8 pass / <8 fail), com as mensagens literais |
| Caso | 13 blocos, 8 perguntas literais | "Operação A — **Parte 13**"; `decisao_pedida: null` |
| Referências | **36** | R.1 15, R.2 12, R.3 4, R.4 5; **0 com URL ou domínio**; 13 com data no texto; 2 com "Consulta em" |
| Erros comuns | **20** | afirmação, correção e "por que importa"; nenhum declara aula |
| Critérios literais | 15 trechos | 2 menções a "critério de prontidão separado" do currículo e 4 trechos de orçamento de tempo |
| §MAP | 2 perguntas literais | não há pergunta por aula (`perguntas_por_aula: null`) |
| Resultado esperado / Lab / Tradutor | 0 / 0 / 0 | ausências declaradas (`null` + nota) |
| Voz | 13 parágrafos do roteiro oral e 6 princípios | 9 caixas "Onde isso entra no produto" (P7) e 5 "Números vivos" (de 8 caixas `box rd`; as outras 3 estão em `voz.outras_caixas_box_rd`) |
| "GridAlpha" visível | 21 linhas | 20 no markup e 1 no script (quiz Q10); detalhe em `modulo.md` › Verificação |

## Estado no código

Arquivos comparados, todos só para leitura: `alexandria-modulo-13-content.ts`, `alexandria-curriculo.ts`,
`alexandria-trilhas.ts`, `alexandria-blocks.ts`, `alexandria-glossario.ts`, `alexandria-instrument-calculators.ts`,
`alexandria-badges.ts` e `RecursosDoModulo.tsx`.

- **Aulas.** As 8 têm `title` = h2 e `subtitle` = rótulo do `sec-id`. O `lead` difere do lede nas Aulas 05, 06 e 08,
  só por espaço antes da pontuação.
- **Instrumentos.** Os **11 não estão portados**: `instruments: []` nas 8 aulas, nenhuma entrada m13 nas
  calculadoras e o M13 ausente de `RecursosDoModulo.tsx`. O catálogo registra o mesmo ("13 | 11 | 0").
  `instrumentos.json` traz o `script.codigo` de cada um, para transliteração mecânica (protocolo §10). Ele é verbatim
  inteiro só nos 3 numéricos (`codigo_verbatim: true`). Nos outros 8, os literais de dados foram trocados por marcador
  (`codigo_nota`), e o texto integral está em `script.linha_inicio`–`linha_fim`.
- **Exercícios.** Os 14 estão em `MODULO_13_EXERCICIOS_SOLTOS`, mas esse objeto **não está registrado** em
  `RecursosDoModulo.tsx` e, portanto, não aparece na interface.
  - `prompt` está vazio, e a pergunta fica fundida ao `gabarito`.
  - `points: 1` não tem origem.
  - O gabarito é igual à fonte após normalizar espaços nos 14, e igual exato em 11.
- **Apostila.**
  - As 8 fórmulas guardam HTML em `formula.desc`, que é campo de texto puro (protocolo §14).
  - Os pares chave-valor (`dual`, `clk` e as 6 fichas `emp`) viraram `tabela` (protocolo §15).
- **Ausente do código.** §Caso, §Quiz, §Final, §Ref, §Lex (0/180), §Erros, §Voz, §MAP e tese. O M13 também não tem
  badge.
- **Números sem origem na fonte.** `estimatedHoursMin 4` e `estimatedHoursMax 5` (`bloco-13`).

## Divergências (26; detalhe nos `.md` e nos JSONs)

**Fonte × fonte**
- **Tempo do critério** (`div-m13-tempo-30-60-vs-uma-hora`, alta). O título da Aula 03 e o §Voz dão release em 30
  min + Formulário em 60 min, mas o critério diz "em uma hora", e a 08.3 reparte a hora de outro modo.
- **Taxa real** (`div-m13-taxa-real-8-6-vs-8-7`, alta). A fórmula da Aula 02 dá "≈ 8,7%" e "passa de meio ponto";
  o INST·03, o Ex 03 e o script dão 8,64% e 0,45 p.p.
- **Categorias de risco** (`div-m13-riscos-seis-vs-oito`). "Seis categorias" no h2 da Aula 06, "oito" no corpo e no
  INST·09, e sete termos de risco no §Lex, com conjuntos diferentes.
- **Arquétipos e controle.**
  - "Joint venture coordenada" × "Associação com dois controladores coordenados" (`div-m13-arquetipo-jv-nome`,
    `div-m13-ex14-arquetipo`).
  - A Vibra falta na tabela do §MAP.1 e no §Voz (`div-m13-vibra-arquetipo`).
  - A AXIA é "Estatal com voto limitado" × "não é estatal" (`div-m13-axia-estatal`).
  - O caso h2 do INST·06 usa o mecanismo de outro caso (`div-m13-inst06-h2-mecanismo`).
- **Contagens internas.**
  - "cinco categorias" × 6 trechos do INST·05 (`div-m13-inst05-cinco-seis`).
  - As datas do INST·07 são declaradas "em cada caso", mas só um caso tem data (`div-m13-inst07-datas`).
  - "a mais alta entre as abertas" (`div-m13-auren-alavancagem`).
- **Redação.**
  - O Q01 do quiz traz três rótulos de EBITDA, e a tabela do §00.1 traz quatro (`div-m13-quiz-q01-rotulos`).
  - Os trechos dos Ex 08–10 diferem dos do INST·05 (`div-m13-ex-vs-inst05-trechos`).
- **Comportamento do script** (`div-m13-numof-vazio`). O mesmo campo vazio vale o padrão no evento `input` e o
  mínimo no evento `change`.

**Fonte × decisões e marca**
- **Caso** (`div-m13-caso-parte-13`, P17). A própria fonte numera "Parte 13" e cita as "doze partes anteriores".
- **Marca** (`div-m13-marca`, `div-m13-marca-quiz`, P24). "GridAlpha" aparece em 21 linhas: kicker (1), 8 caixas de
  produto (15; a nona caixa, da Aula 01, cita só Energy Brief), "O que nunca devolver" do INST·11 (1), §Ref (2),
  rodapé (1) e quiz Q10 (1).

**Fonte × código**
- Horas 4–5 sem origem (`div-m13-horas`).
- Fórmulas com tags em campo de texto puro (`div-m13-codigo-formula-tags`, deduzido da leitura do componente, não
  medido na tela).
- Pares chave-valor como tabela (`div-m13-codigo-par-chave-valor`).
- Lead com espaço antes da pontuação (`div-m13-codigo-lead-espacos`).
- Exercícios (`div-m13-exercicios-codigo`).
- Instrumentos não portados (`div-m13-instrumentos-codigo`, alta).

**Fonte × catálogo**
- O título do módulo é **igual** no h1, no `<title>`, no rodapé e no catálogo (a tabela-resumo abrevia para "Análise
  Financeira").
- Os 8 títulos de aula e 10 dos 11 nomes de instrumento são iguais à fonte (conferido por programa).
- Diferenças:
  - o INST·11 vira "(instrumento assinatura)" no catálogo e "· instrumento assinatura" na fonte
    (`div-m13-catalogo-inst11-nome`);
  - o catálogo usa siglas ausentes da fonte (DRE, DFC, FCFF, FCFE, ROIC, ROE, VPA, VPL, TIR e ICSD) e parafraseia
    verbetes (`div-m13-catalogo-siglas`);
  - a trilha é "atribuída" pelo catálogo, sem declaração na fonte, e o código traz `track: 'brasil'` com `level: 3`
    (`div-m13-trilha`).

## Lacunas (a fonte não tem)

- **Módulo.**
  - Faltam horas, eixos (a fonte declara "três lentes" e recusa chamá-las de categorias), "Resultado
    esperado"/capacidades, perguntas do §MAP por aula, § Lab e Tradutor.
  - Não há `<img>`, `<video>` nem `<iframe>`, e duração e dificuldade não são declaradas.
- **Aparato.**
  - Nenhum item (quiz, checklist, exercício, erro, referência ou termo) declara aula. A "relação temática" dos
    exercícios é anotação desta extração.
  - Nenhum exercício tem critério próprio.
  - O caso não tem decisão pedida: a fonte declara que as perguntas "são diagnósticas".
  - As referências não têm URL, domínio, tipo por item nem os campos D5.
- **Instrumentos.**
  - Nenhum tem pergunta própria, tolerância, gabarito ou previsão.
  - Só o INST·03 declara fonte para parte dos números (Selic e IPCA com data). Os cenários dos outros não têm fonte
    por item (P19/P20).
  - O espaço de entrada foi coberto **inteiro** nos 8 categóricos (90, 15, 18, 12, 5, 16, 5 e 18 casos) e **por
    grade** nos 3 numéricos (15.625, 6.561 e 6.561).
- **Anotações a revisar.** `marcacao_p14` (checklist, critérios, roteiro oral), `kind_sugerido` e a descrição da
  mecânica do quiz são inferências desta extração, não texto da fonte.
- **Números vivos.** Selic, estados societários e datas foram verificados pela fonte em 02·08·2026. A extração não os
  reverificou.

## Uso pela camada Alexandria (P17–P24)

| Achado | Resolução aplicável |
|---|---|
| Caso "Parte 13", sem decisão pedida | P17: "Caso — Operação A" e Desafio de decisão da camada Alexandria só com fatos do caso; a numeração de parte fica na proveniência |
| Critério em várias formas (uma hora, 30 + 60 min, quiz 8/10, §Final 28, roteiro oral 10 min) | P18: separar conclusão, desempenho e evidência; o quiz não aprova, e as mensagens do placar ficam como registro legado |
| Cenários dos instrumentos sem fonte; 8,6 × 8,7%; seis × oito riscos | P19 (cenário didático, fonte não declarada) e P20 (content QA) |
| Glossário de 180 termos ausente do código | P22: derivar a contagem da coleção quando for portado |
| GridAlpha em kicker, caixas, rodapé e quiz | P24: Alexandria/NIVAR; as caixas P7 ficam fora da interface |
| Título | P24: o catálogo governa, e aqui é igual ao h1; o `p.sub` pode virar descritor editorial |

## Verificação

Verificação adversarial de 2026-09-17, feita com scripts próprios, independentes dos extratores. O detalhe está na
seção "Verificação" de cada `.md`.

**O que foi conferido**
- **Verbatim.**
  - 4.741 strings dos três JSONs foram conferidas contra a fonte normalizada; só divergem campos de anotação.
  - O quiz foi conferido a 100%: 10 questões, 40 alternativas, 10 explicações e o gabarito D B A B C B A D C B.
  - O checklist também, a 100% (28 itens).
  - As fórmulas dos instrumentos foram conferidas a 100%: 69 expressões dos INST·02, 03 e 08.
- **Origens.** As 614 origens estão a ±3 linhas, e 1.066 textos foram localizados a partir da linha de origem.
- **Contagens.** Foram recalculadas no HTML. Todas batem, exceto a das caixas "Números vivos" (abaixo).
- **Divergências.** Foram conferidas por amostragem na fonte, e nenhuma é inventada.

**Correções**
1. **Caixas "Números vivos".** `caixas_numeros_vivos` passou de 8 para 5. Só 5 das 8 caixas `box rd` têm essa tag.
   As outras 3 ("O erro clássico, e ele é frequente", "Anonimização e escopo" e "Nota de atualização · 2 de agosto
   de 2026") agora estão em `voz.outras_caixas_box_rd`, e `caixas_box_rd` = 8. O extrator `m13_modulo.mjs` foi
   corrigido.
2. **Código do script.** `script.codigo` era dito verbatim, mas em 8 instrumentos os literais de dados estavam
   trocados por marcador sem aviso. Agora há `codigo_verbatim` e `codigo_nota`, e `m13_instrumentos.mjs` foi
   corrigido.

Os três JSONs foram regenerados. Fora essas duas mudanças, `modulo.json` e `instrumentos.json` não mudaram, e
`aparato.json` ficou idêntico.
