# Extração M10 — Tarifas e a Conta de Luz Industrial

Esta é a camada **fonte** do M10: texto literal, com origem, e contradições registradas com as duas leituras lado a
lado, nunca resolvidas aqui. A camada Alexandria (P17–P24) é aplicada depois, no produto.

A fonte é `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo10.html`: 4.813 linhas, 359.726 caracteres, só
leitura. O código (`src/lib/data/*`) e o catálogo canônico (`C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md`)
foram lidos só para comparar.

## Arquivos

| Grupo | Arquivos | Conteúdo | Verificação |
|---|---|---|---|
| modulo | [`modulo.json`](modulo.json), [`modulo.md`](modulo.md) | Identidade, §00, § MAP, roteiro (19 seções), critérios (P14), § Voz, § Erros, Tradutor (`.lv`), fichas `.fi`, P7/P24, divergências e comparação com código e catálogo | 578 strings, 131 origens, 0 falhas |
| aparato | [`aparato.json`](aparato.json), [`aparato.md`](aparato.md) | Caso, quiz, checklist final, índice de exercícios, referências e glossário | 1.245 strings, 284 origens, 0 falhas |
| instrumentos | [`instrumentos.json`](instrumentos.json), [`instrumentos.md`](instrumentos.md) | Os 11 Inst: markup, dados e lógica do script, cenário-padrão e varredura no script original × código, catálogo e achados fonte × fonte | 927 strings, 124 origens, 0 falhas |

**Extratores** ([`extratores/`](extratores/)):
- `lib.mjs`: árvore de elementos com offsets e leitor de literais;
- `shim.mjs`: DOM simulado que executa o `<script>` original sem reescrita;
- `code.mjs` e `ts-loader.mjs`: importam o código do repositório só para leitura;
- `m10_modulo.mjs`, `m10_aparato.mjs` e `m10_instrumentos.mjs`: um por grupo;
- `verify.mjs`: verificação, com o resultado em `verify-report.json`.

Para refazer, dentro de `extratores/`:

```
node m10_modulo.mjs && node m10_aparato.mjs && node m10_instrumentos.mjs && node verify.mjs
```

A saída é determinística: rodar de novo reproduz os três JSON byte a byte.

**Cobertura por token (§5).**

| Seção | Cobertura |
|---|---|
| §00, § MAP (sem o markup do Inst · 01), § Caso, § Erros, § Ex, § Voz, § Final, § Lex, § Ref, hero e rodapé | 100% |
| § Quiz (markup e literal `Q`) | 99,9% |

As aulas em si já estão no código (`alexandria-modulo-10-content.ts`) e não foram reextraídas aqui. O M01 extraiu
uma aula de amostra (a 08); este lote cobre módulo, aparato e instrumentos.

**Vocabulário.** O M10 usa o vocabulário abreviado: `section#id`, `.sec-id`, `p.lede`, `.box`, `.lv`, `.fi`,
`div.inst` e `details`. Os seletores do M01 (`aula-marker`, `glossary-item`, `exercise-tag`) dão zero, então os
extratores do M01 foram adaptados, não reaproveitados.

## Contagens

| Item | Fonte | Código | Catálogo |
|---|---|---|---|
| Aulas | **9** (oito sinais concordam) | 9 (títulos e subtítulos idênticos; 3 leads com espaço antes da pontuação) | 9 |
| Seções | 19 (9 aulas + §00 + § MAP + 8 de aparato) | — | — |
| Instrumentos | **11** (10 em aula, 1 no § MAP; Aulas 03, 08 e 09 com dois cada) | 11 presentes: 1 portado, 10 divergentes | 11, nomes idênticos |
| Termos (§ Lex) | **161** em 8 famílias (pill = markup) | **0** `gl-m10-*` (faltam os 161; 16 homônimos existem em outros módulos) | 161 |
| Exercícios | **14**, 0 com aula (P9) | 14 em `MODULO_10_EXERCICIOS_SOLTOS`, com texto idêntico; `points`/`kind` só no código | 14 |
| Itens de checklist (§ Final) | **28** (1 cronometrado, 1 oral, 2 de cálculo, 5 de produção escrita; todos autodeclarados) | 0 | 28 |
| Questões do quiz | **10** × 4 alternativas; gabarito `CADBCDABDC`; 2 faixas de placar (≥8 / <8) | 0 | — |
| Caso (§ Caso "Parte 10") | 6 subseções, 2 tabelas, 1 parecer; 0 perguntas ao learner; 0 decisão | 0 | — |
| Erros comuns | 20 pares | 0 | 20 |
| Referências | 35 (31 com URL, 3 pendentes, 1 fonte de campo) | 0 | 35 |
| Critérios literais | 10 formas (P14 marcado) e os 4 achados da tabela 09.3 | — | Critério cronometrado citado |
| § Voz | Roteiro oral de 6 blocos (10 min) | 0 | — |
| Tradutor | Não existe com esse nome. Equivalente: 5 blocos `.lv` × 3 níveis | no corpo das aulas | — |
| Fichas de modalidade | 6 `.fi` (Aula 02) | no corpo | 6 |
| Laboratórios (§ Lab) | **não há** (`null`) | — | — |
| Resultado esperado | **não há** (`null`) | — | — |
| Horas | **não declaradas** (`null`) | `bloco-10`: 8–10 h, sem origem na fonte | não traz |

## Divergências

O detalhe está nos JSON, com `leitura_a` e `leitura_b`, nenhuma resolvida.

**Fonte × fonte**
- **Critério.** Operacional cronometrado ("oficial", §00.3) × 8/10 "de aprovação" (§ Quiz) × 28 verificações
  (§ Final). O placar tem dois ramos, e questão em branco conta como erro. Vale P18: nada disso vira "Aprovado".
- **Caso.** Rotulado "Parte 10", cita "Parte 9" e "nove partes anteriores", uma série que não existe no arquivo
  (P17).
- **Exercícios.** A distribuição declarada é 4/4/4/2; os prefixos medidos dão 3/3/3 + 5 sem prefixo, e nenhum é
  "armadilha de comparação".
- **Tempo dos três primeiros passos.**
  - Aula 09 (L2502): "menos de um minuto";
  - veredito do Inst · 10 (L4553): "menos de um minuto e meio";
  - dados: 75 s.
- **Inst · 09, diagnóstico de viés** (novo, medido no script original):
  - demanda **super**estimada exibe "Viés de subestimação da demanda";
  - energia subestimada exibe "Viés na leitura do uso da rede";
  - desvio de 12 p.p. em encargos ou reativo exibe "Estimativa calibrada".
- **Inst · 05 e 06.** O script reescreve o campo com o valor preso, e o resultado depende da ordem das edições.

**Fonte × código**
- **Inst · 11.** A árvore de ramos foi reescrita. Os dois títulos "Não é possível concluir…" da fonte não existem no
  código, que inventa "Vale investigar, com ressalva de material" e "Material insuficiente para diagnóstico". Os
  rótulos dos cartões também mudam, e o código acrescenta `valores['rt-score']`, sem readout na fonte.
- **Inst · 08 e 10.**
  - A grade de chips com segundo clique virou selects Não/Sim.
  - "Situação do dossiê" e "Estado da leitura" deixaram de ser readout: o código os escreve como prosa dentro do veredito.
  - O título final do 10 foi reescrito ("Leitura completa — nove de nove, em …").
  - Rótulos do painel reescritos.
- **Inst · 09.** O readout "Maior desvio" não existe no código.
- **Inst · 01 e 07.** A grade sem seleção virou select com padrão, e os rótulos do painel foram reescritos. No
  Inst · 07, "Item" virou "Item de encargo".
- **Inst · 05.** As barras e os valores em MWh não existem no código.
- **Inst · 03, 05 e 11.** A nota perde o `<b>` e ganha espaço antes da pontuação. É o mesmo artefato dos leads das
  Aulas 03, 07 e 08.
- **Inst · 03 a 06 e 08 a 10.** `unit: null` em todas as saídas; o sufixo da fonte vem da expressão.
- **Glossário, caso, quiz, checklist, § Ref, § Erros, § Voz e critérios.** Não existem no código.
- **Badge.** A razão da regra `badge-anatomista-de-faturas` diz que o bloco "não tem HTML extraído", mas tem.
- **Alcance.** `RecursosDoModulo.tsx` não registra `modulo-10`, então o Inst · 01 e os 14 exercícios soltos não têm
  rota aparente. Deduzido da leitura, não medido na tela.
- **Comentário do código.** O cabeçalho diz "359.726 bytes", mas o número é de caracteres; o arquivo tem 369.468
  bytes.

**Fonte × catálogo**
- **Títulos.** O título do módulo, os 9 títulos de aula e os 11 nomes de instrumento são idênticos.
- **Trilha.** "O setor elétrico brasileiro" (kicker) × "Setor Elétrico Brasileiro" (catálogo); só a caixa muda.
- **Horas.** Nem a fonte nem o catálogo declaram; só o `bloco-10` do código tem 8–10 h.
- **Títulos curtos do § MAP.** Três cartões usam títulos curtos diferentes do h2 (Aulas 03, 04 e 06); o catálogo
  segue o h2.

**Marca (P24).** "GridAlpha" aparece 4 vezes:
- L551, destaque de produto do §00;
- L1872, destaque de produto da Aula 05;
- L3521, ref. 32 do § Ref, voltada ao learner;
- L3547, rodapé.

## Lacunas (a fonte não tem)

- **Estrutura do módulo.** Não há "Resultado esperado", lista de capacidades, § Lab, "Tradutor" com esse nome nem
  carga horária.
- **Perguntas.** Os cartões do § MAP não têm pergunta por aula. Nenhum instrumento tem pergunta própria.
- **Caso.** Não tem grade de dados, perguntas ao learner nem decisão pedida (o parecer vem pronto). O Desafio de
  decisão, se houver, é da camada Alexandria (P17).
- **Vínculos com aula.** Nenhum item de aparato os declara: quiz, checklist, termos, referências e exercícios.
- **Exercícios.** Não têm critério de correção próprio, e o gabarito abre sem tentativa.
- **Instrumentos.** Não têm tolerância nem resposta de referência. Os valores iniciais e os limiares de faixa não
  têm fonte, salvo onde a nota cita norma (P19).
- **Referências.** Faltam os campos D5 (o que responde e o que não responde, tema, verificação individual). 4 não
  têm URL.

## Verificação (verificador adversarial, 2026-09-17)

Conferência independente da fonte, com scripts próprios (não os extratores). As origens foram checadas em ±3 linhas;
o `verify.mjs` usa uma janela de −3/+12.

**Contagens recalculadas direto no HTML.** Todas bateram:
- 19 `<section>`; 9 aulas.
- 11 `div.inst`: L580 no § MAP e 10 em aula (a02 1, a03 2, a04 1, a05 1, a06 1, a08 2, a09 2).
- Instrumentos: 44 entradas (numéricas, `seg` e grades) e 26 saídas (`.ro`).
- § Lex: 161 `span.term` em 8 `details`.
- § Ex: 14 `details`; prefixos 3/3/3 + 5 sem prefixo.
- § Final: 28 `li`.
- § Quiz: 10 `Q` × 4 alternativas; gabarito `CADBCDABDC` avaliado do literal; 2 ramos de placar.
- § Ref: 35 `li`, 31 com `href`.
- § Erros: 20 `tr` além do cabeçalho.
- § Voz: 6 `p > b`.
- 5 `.lv` × 3 painéis; 6 `.fi` com 36 linhas.
- 4 ocorrências de "GridAlpha" (L551, 1872, 3521, 3547).
- 10 formas de critério: nenhuma menção a "critério"/"domínio" fora das 10 ficou de fora.
- Cartões do § MAP: 9; lentes: 3.
- Caixas: 8 `box rd`, 10 `box gd`, 8 `box cy`.

**Verbatim e origem.**
- 100% do quiz, do checklist, do glossário, dos exercícios, das referências (texto e URL), dos erros, do Tradutor,
  das fichas, da § Voz e do caso.
- Os demais: 131 + 284 + 120 objetos com origem, cada um conferido em ±3 linhas.
- 100% das 26 expressões de saída e das 11 `logica_literal`, fatiadas das linhas declaradas.
- 0 falhas.

**Divergências conferidas; nenhuma inventada.**
- Viés do Inst · 09 (ramos `maiorI`/`maiorV`) e 75 s / 280 s do Inst · 10.
- Reescrita de campo do Inst · 05: 42,0% × 50.
- Nos arquivos do código:
  - Inst · 11: títulos "Vale investigar, com ressalva de material" / "Material insuficiente para diagnóstico" e
    `rt-score`;
  - "Item de encargo";
  - 0 `gl-m10`, 16 homônimos;
  - razão do badge em `badgeRules.ts`;
  - "359.726 bytes" (o arquivo tem 369.468 bytes);
  - `RecursosDoModulo.tsx` sem `modulo-10`;
  - `bloco-10` 8–10 h em `alexandria-blocks.ts`;
  - leads das Aulas 03, 07 e 08.

**Correções aplicadas.**
1. `aparato.json` → `avaliacao.faixas_do_placar[*]`: as duas mensagens de placar (conteúdo) não tinham origem.
   - Acrescentada `origem` (L4794 e L4795) no extrator `m10_aparato.mjs`, com o JSON regenerado.
   - Origens do aparato: 282 → 284.
   - Os demais JSON continuam byte a byte iguais.
2. README, divergências do Inst · 08 e 10: "os readouts sumiram" era impreciso.
   - O código não tem o readout, mas escreve "Situação do dossiê"/"Estado da leitura" como prosa no veredito
     (`alexandria-instrument-calculators.ts` L1097 e L1191).
   - Texto alinhado ao `instrumentos.md`.

**Observações sem correção.**
- `modulo.json → contagens.aparatos = 10` conta §00 e § MAP como "aparato" (tipo do roteiro). O README fala em
  "8 de aparato" mais §00 e § MAP. As duas contas somam 19 seções.
- Não há `aula-NN.json`. O M01 extraiu a Aula 08 para a Peça C2. Aqui o lote declarado é
  módulo/aparato/instrumentos, e as aulas já estão no código.

## Verificação (segunda passagem adversarial, 2026-09-17)

Conferência independente, com scripts próprios fora dos extratores e sem reusar `verify.mjs`.

**Verbatim.**
- 1.150 strings de conteúdo (`texto`, `enunciado`, `explicacao`, `termo`, `rotulo`, `titulo`, `url`) conferidas contra o
  fluxo de texto da fonte, sem tags e com entidades decodificadas. As duas únicas falhas são metadados de
  `convencoes`, não conteúdo.
- 497 campos `html` conferidos como fragmento literal da fonte, com espaços colapsados. 0 falhas.
- 100% do quiz: o literal `Q` foi avaliado direto do `<script>`. Enunciado, 4 alternativas, `a` e `f` batem nas
  10 questões, e o gabarito dá `CADBCDABDC`. As 2 mensagens de placar também batem.
- 100% do checklist: 28 `li`, com `html` e `texto` idênticos.
- 100% das 26 `expressao_exata` estão na linha declarada. As 11 `logica_literal` batem com a fonte, fatia por fatia.
  Os literais elididos foram reavaliados e são iguais a `dados_do_script` (valor e linha inicial).

**Origens.** 533 `origem` com `trecho_inicial`, cada uma localizada em ±3 linhas. 0 falhas.

**Cobertura.** Todas as frases e células de §00, § MAP (com o Inst · 01), § Caso, § Erros, § Ex, § Quiz, § Voz,
§ Final, § Lex, § Ref, hero e rodapé aparecem nos JSON, e também o markup dos 11 `div.inst`. 0 ausentes.

**Contagens recalculadas.** Todas iguais às declaradas:
- 19 seções, 11 `div.inst`, 44 entradas e 26 `.ro`;
- 161 termos, por família 25/20/22/14/14/26/18/22;
- 14 exercícios (prefixos 3/3/3 + 5), 28 itens de checklist e 10 × 4 no quiz;
- 35 referências: 31 com `href`, 3 "Pendente de resolução" e 1 "Fonte de campo";
- 20 erros, 6 blocos de § Voz, 5 `.lv`, 6 `.fi`, 6 h3 e 2 tabelas no caso, 4 "GridAlpha";
- subseções NN.x presentes nas 9 aulas;
- 16 homônimos no glossário do código (recontados por `term`) e 0 `gl-m10`;
- 14 exercícios no código com enunciado e resposta presentes.

**Divergências reconferidas na fonte e no código.** Nenhuma inventada:
- "Parte 9" e "nove partes anteriores" (L2702–2704);
- 4/4/4/2 declarado × prefixos medidos;
- "menos de um minuto" (L2502) × "menos de um minuto e meio" (L4553) × 20+15+40 = 75 s;
- ramos de viés do Inst · 09 (L4431–4437);
- títulos do Inst · 11 e `rt-score` no código (L1235–1243);
- "Item de encargo";
- "359.726" no cabeçalho do código (a fonte tem 359.726 caracteres e 369.468 bytes);
- `RecursosDoModulo.tsx` sem `modulo-10`.

**Correções.** Nenhuma nesta passagem.

**Observação sem correção.** `logica_literal.linha_fim` aponta para a linha em branco depois do `})();` (por exemplo,
L3711 no Inst · 01). O código não traz essa linha, e a diferença é de 1 linha, dentro da tolerância.
