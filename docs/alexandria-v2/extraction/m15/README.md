# Extração M15 — Petróleo, Gás e Petrobras

Esta pasta guarda a **camada fonte** do Módulo 15. A fonte é o HTML do M15 (4.140 linhas, só leitura). Todo texto é
verbatim e vem com a linha de origem. Nenhuma divergência foi resolvida aqui: as duas leituras ficam registradas, e as
decisões P17–P24 valem só na camada Alexandria.

## Arquivos

| Grupo | Arquivos | Conteúdo | Verificação |
|---|---|---|---|
| modulo | `modulo.json`, `modulo.md` | Identidade, tese (§00), mapa da cadeia (§MAP), roteiro, critérios, voz, princípios, erros comuns, blocos P7 (10), comparação com código e catálogo | 691 strings, 0 falhas |
| aparato | `aparato.json`, `aparato.md` | Caso, quiz, checklist final, exercícios e fichas de elo, referências, glossário | 1.538 strings, 0 falhas; cobertura por token de 100% nas 6 seções |
| instrumentos | `instrumentos.json`, `instrumentos.md` | Os 10 instrumentos: entradas, saídas, fórmulas do script, ramos, templates literais de painéis e barras, dados, cenário-padrão, fonte dos números e status no código | 504 strings, 0 falhas; prova de fidelidade com 1.549 casos |

**Extratores** (em `extratores/`, só leem a fonte e o código):

| Script | Papel |
|---|---|
| `lib.mjs` | Utilitários comuns: seções, walker de tags balanceadas e literais do script |
| `m15_modulo.mjs` | Gera `modulo.json` |
| `m15_aparato.mjs` | Gera `aparato.json` |
| `m15_instrumentos.mjs` | Gera `instrumentos.json`. Roda o script original em DOM simulado e compara com a porta do código, usando uma cópia temporária, sem tocar `src/` |
| `verify-m15.mjs` | Confere cada string de conteúdo contra a fonte e grava `verify-m15.result.json` |
| `gen-md.mjs` | Gera os três `.md` a partir dos JSONs |

A ordem de execução é: modulo → aparato → instrumentos → verify → gen-md.

## Contagens

| Item | Fonte | Código atual |
|---|---|---|
| Seções | 19 (9 aulas + 10 aparatos) | — |
| Aulas | 9. Concordam o sec-id, a pill, `MODULO_15_AULAS`, `totalInModule`, `AULAS_POR_BLOCO` e o catálogo | 9 |
| Instrumentos | 10: 9 em aula, 1 de módulo (INST·01, §MAP) | 10: 7 "divergente" e 3 "portado" (INST·02, 03 e 06) |
| Termos (§Lex) | 174 em 8 famílias. Prosa, soma das famílias e markup concordam | **0**; faltam os 174 |
| Exercícios (§Ex) | 15 em 4 famílias, **todos soltos** (P9) | 15 idênticos, **não registrados** em `RecursosDoModulo.tsx` |
| Fichas de elo "Preencha." | 6, dentro das aulas 01 (×2), 05, 07 (×2) e 08 | Viram nota estática |
| Checklist (§Final) | 28 | ausente |
| Quiz | 10 questões × 4 alternativas; 2 faixas (≥8 e <8) | ausente |
| Erros comuns | 20 | ausente |
| Referências | 36: 0 com URL, 30 com data citada; consulta única em 4/8/2026 | ausente |
| Caso | 10 blocos, 2 tabelas, 2 perguntas-subtítulo e 3 perguntas de diagnóstico; decisão `null` | ausente |
| Roteiro oral (§Voz) | 9 trechos (9 min) | ausente |
| Divergências registradas | 12 no grupo modulo, 8 no aparato e 11 nos instrumentos | — |

**P14 (anotação inferida, a revisar).** No critério construído, o limite "em menos de um minuto" faz dele um critério
cronometrado, e a parte oral o faz um critério livre. O §Voz é um teste oral gravado de 9 min.

No checklist, a classificação ficou assim:
- cronometrado: item 1;
- produção oral ou livre: 18 itens;
- conhecimento declarativo: 7 itens;
- cálculo: itens 25 e 27.

## Achados principais

**Fonte × fonte**
- **Os nove elos não são os mesmos.** O `div.cad` do §MAP começa em Reservatório e termina em Consumo. Os nove elos do
  INST·01 trocam esses dois por Ponto de medição fiscal e Termelétrica a gás. Além disso, a prosa diz que "natureza do
  preço" forma 4 grupos, mas os dados têm **9 valores** distintos.
- **Critério de domínio em cinco formas:** o construído (§00.4), o do §Ex, o quiz 8/10, o oral de 9 min e o checklist.
  O §Final chama o item 1 de "forma operacional" do critério do §00.4, mas o conteúdo não é o mesmo. O limiar do quiz,
  por sua vez, é coerente entre prosa, h2, pill e script.
- **Cenários dos instrumentos contra a prosa.**
  - INST·03 no padrão: IRR de 146,6%, 2P de 24,256 e 3P de 28,873. A Aula 02 diz 147,03%, 24,265 e 28,877
    (arredondamento das razões).
  - INST·06: a capacidade padrão é 1.800 mil bpd. A Aula 05 fala em 2,2 milhões de bpd de derivados a 86,4% de uso,
    o que implica cerca de 2,5 milhões de bpd de capacidade. Vai para CONTENT QA (P20).
- **Resíduo no INST·01:** o cartão "Recebe" mostra o segmento.
- **"Oito tópicos" × 9 aulas.** O §00.4 diz que o currículo externo fornece oito tópicos; o markup tem 9 aulas. O
  markup vence a contagem (P8), e a fonte não declara como os tópicos se distribuem pelas aulas.
- **Referências.** Falta item próprio no §Ref para a MP nº 1.363/2026, citada na Aula 04. O h2 do §Ref promete data
  de consulta por fonte, mas a data só existe no nível da seção.
- **Quiz.** O feedback aparece para todas as questões, inclusive as não respondidas. As questões Q02, Q03, Q05, Q07,
  Q08 e Q09 repetem exercícios do §Ex.

**Fonte × código**
- **Cálculo do INST·09 (`ac-gb`).** Quando gb ≤ 0, a fonte mostra "—", mas a porta publica o número negativo em
  `valores`. A prova de fidelidade encontrou 9 casos em 83.
- **Rótulo com entidade crua.** O rótulo `O&amp;M variável e encargos` fica com a entidade num campo que o painel
  renderiza como texto.
- **Formatação na tela.** Os prefixos R$/US$ se perdem nos INST·04, 05, 07 e 09, e o painel usa até 2 casas em vez das
  casas fixas do script.
- **Procedência e tom não portados:** a procedência (`p.disc`) e o tom do veredito (ok/att/per) não estão no código.
  P19 depende da procedência.
- **Seleção reestruturada.** O INST·08 fundiu dois grupos de seleção num só. Os INST·01 e INST·10 viraram `select`, com
  rótulos que não existem na fonte ("Elo da cadeia" e "Enunciado").
- **Recursos que não chegam à tela.** `MODULO_15_EXERCICIOS_SOLTOS` e `MODULO_15_INSTRUMENTOS` (INST·01) não estão
  registrados em `RecursosDoModulo.tsx`, que só vai até o `modulo-09`.
- **Aulas.** O código corta o h2 em title + subtitle (a Aula 09 fica com subtitle vazio), e o rótulo de lente do sec-id
  não aparece no código.
- **Horas.** A fonte não declara horas. O 2–2 h do código só encontra respaldo na frase do §00.4 sobre o currículo
  externo.
- **Exercícios.** O `points: 10` dos exercícios não tem origem na fonte.

**Fonte × catálogo**
- O título coincide nos três lugares (h1, catálogo e `bloco-15`).
- O catálogo trunca a citação do §00.4.
- O catálogo usa siglas (UPGN, FSRU, CVU, CMO, GNL) que não são nomes de verbete.
- Os kinds do M15 não estão em `instrument-taxonomy.md`, que só cobre os Módulos 01–07. As três "Régua" (INST·03, 06 e
  07) têm kinds diferentes, e isso fica como pendência FOUNDRY.

**Fonte × decisões:** a fonte chama o caso de "Operação A — parte 15" (P17). "GridAlpha" aparece em 11 linhas voltadas
ao learner (P24): kicker, rodapé, régua de nomeação, blocos P7 e a explicação da Q10.

## Lacunas (a fonte não tem)

- Resultado esperado ou capacidades; eixos; horas; § Lab; Tradutor; pergunta por aula no §MAP.
- Pergunta própria, tolerância e gabarito numérico em qualquer instrumento.
- Decisão pedida no caso (a fonte a recusa explicitamente) e números da Operação A.
- Critério por exercício; gabarito do campo "Preencha." das fichas de elo.
- URL, domínio, título separado e data de consulta por referência.
- Vínculo declarado com aula em qualquer item do aparato: quiz, checklist, exercícios, termos, referências e erros.
- Persistência ou marcação do checklist: o `ul.ck` é estático.

**Não medido na tela.** Os itens marcados "leitura de código" vêm da leitura de `InstrumentPanel.tsx` e
`RecursosDoModulo.tsx`: entidade no rótulo, prefixos, casas decimais e recursos não registrados.

## Verificação

Verificação adversarial em 2026-09-17, com scripts próprios que não reaproveitam `lib.mjs` nem `verify-m15.mjs`.
- Quiz: 10/10 questões (enunciado, alternativas, gabarito, feedback) e as 2 faixas de placar idênticas ao `var Q`.
- Checklist 28/28, exercícios 15/15, termos 174/174, referências 36/36, erros comuns 20/20 e voz 9/9: idênticos.
- As 558 origens com `linha_aprox` estão dentro de ±3 linhas.
- Cálculo, fórmulas de exibição, ramos e `dados_script` dos 10 instrumentos conferem com o script.
- Todas as contagens foram recontadas no HTML, e as divergências foram reconferidas: nenhuma é inventada.

Correções aplicadas (detalhe na seção "Verificação" de cada `.md`; os extratores foram ajustados e reexecutados):

1. **Blocos P7: 9 → 10.** O regex exigia o rótulo exato e perdia o bloco da Aula 08 (L2489), cujo rótulo continua.
2. **Origem do seletor `cl-gr2` (INST·08).** O `trecho_inicial` apontava para o rótulo herdado, 6 linhas acima. Agora
   aponta para o primeiro botão do grupo.
3. **Templates de painel, barra e legenda dos instrumentos não estavam extraídos.** Com isso ficavam de fora, por
   exemplo, o ramo "Não se aplica." do INST·08 e os rótulos de barra. Agora estão em
   `conteineres_dinamicos[].templates_script` e `lista_segs_script` (strings verificadas: 491 → 504).
4. **Linhas da fonte: 4141 → 4140.** O arquivo termina em LF.

**Segunda verificação adversarial (2026-09-17): sem correções no conteúdo.** Foi feita com scripts novos. Tudo
bateu com a fonte: as 548 origens (±3 linhas), o quiz, as faixas, o checklist, os exercícios, os termos, as
referências, os erros e a voz, com igualdade estrita. Bateram também as 34 fórmulas, as 88 linhas de cálculo e os 25
ramos (= 25 classes `verdict`), e todas as contagens do quadro acima foram recontadas no HTML. A única mudança foi
acrescentar esse registro nos três `.md`, via `gen-md.mjs`.

Fora do escopo deste grupo e ainda pendente: o corpo das 9 aulas (parágrafos, `div.fx`, tabelas e caixas) só
aparece aqui como roteiro, subseções, fichas de elo e blocos P7. A extração aula a aula, no molde da `aula-08` do
M01, continua por fazer.
