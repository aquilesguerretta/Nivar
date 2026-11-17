# Extração M11 — Geração Distribuída e a Anatomia de uma Proposta Solar

Esta é a camada **fonte** do M11: texto literal, com origem, e contradições registradas com as duas leituras,
nunca resolvidas aqui. A camada Alexandria (P17–P24) é aplicada depois, no produto.

- **Fonte (só leitura).** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo11.html`, com 3.964 linhas e
  346.651 bytes.
- **Comparação.** O código (`src/lib/data/*`, `RecursosDoModulo.tsx`) e o catálogo canônico
  (`C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md`) foram lidos só para comparar.

## Arquivos

| Grupo | Arquivos | Conteúdo | Verificação |
|---|---|---|---|
| modulo | [`modulo.json`](modulo.json), [`modulo.md`](modulo.md) | Identidade, eixos, §00, § MAP, roteiro (18 seções), critérios (P14), voz, § Erros, P24, comparação com código e catálogo, divergências | 386 strings, 156 origens, 0 falhas |
| aparato | [`aparato.json`](aparato.json), [`aparato.md`](aparato.md) | Caso, quiz, checklist final, índice de exercícios, referências e glossário | 1.093 strings, 266 origens, 0 falhas |
| instrumentos | [`instrumentos.json`](instrumentos.json), [`instrumentos.md`](instrumentos.md) | Os 11 Inst: marcação, dados e lógica do script, cenário-padrão executado e confronto com código e catálogo | 118 strings, 60 origens, 148 ramos, 353 literais e 11 blocos verbatim, 0 falhas |

**Extratores** ([`extratores/`](extratores/)):
- `m11_lib.mjs`: árvore HTML por offsets, DOM simulado que executa o `<script>` original sem reescrita, e esbuild do
  código só para leitura;
- `m11_blocos.mjs`: fatiador de blocos de seção;
- `m11_modulo.mjs`, `m11_aparato.mjs` e `m11_instrumentos.mjs`: um por grupo;
- `m11_verify.mjs`: verificação; a saída está em `verify-saida.txt`.

Para refazer, dentro de `extratores/`:

```
node m11_modulo.mjs && node m11_aparato.mjs && node m11_instrumentos.mjs && node m11_verify.mjs
```

A saída é determinística: duas execuções seguidas dão os três JSON byte a byte iguais. Os scripts gravam um bundle
temporário do código no scratchpad (`M11_SCRATCH`).

**Relação com o M01.** Os extratores do M01 procuram `aula-marker`, `glossary-item` e `exercise-tag`, que dão zero
aqui. O M11 usa o vocabulário abreviado do M09/M10, por isso a lógica foi adaptada, não copiada. As aulas já estão no
código com lead idêntico e não foram reextraídas. O M01 extraiu uma aula de amostra (`aula-08.json`); este lote é
módulo/aparato/instrumentos, como no M09/M10.

**Cobertura por token (§5).** 100% em §00, § MAP (sem o markup do Inst · 01), § Caso, § Erros, § Ex, § Quiz, § Voz,
§ Final, § Lex e § Ref. A marcação dos 11 `div.inst` tem 99,8%.

**Sessão anterior.** Os três JSON e os extratores são de uma sessão anterior que não chegou aos `.md`. Nesta passada
os extratores foram reexecutados: a saída saiu idêntica e a verificação passou. Também foram acrescentados:
- comparação de lead aula a aula (`comparacao_codigo.titulos[*].lead`);
- comparação dos nomes de instrumento com o catálogo (`instrumentos[*].comparacao_catalogo`);
- três divergências novas: `div-m11-ap-09`, `div-m11-ap-10` e `div-m11-inst-09-catalogo-11`.

## Contagens

| Item | Fonte | Código | Catálogo |
|---|---|---|---|
| Aulas | **8**: `sec-id`, pill e subseções concordam | 8 (`MODULO_11_AULAS`, `totalInModule`, `AULAS_POR_BLOCO`); títulos, subtítulos e **leads idênticos** | 8, títulos idênticos |
| Seções | 18 (8 aulas + §00 + § MAP + 8 de aparato) | — | — |
| Instrumentos | **11**: 1 no § MAP e 10 em aula (Aulas 05 e 08 com dois cada) | 11 presentes, **11 divergentes** na forma; textos e valores iguais em 3.387 casos | 11; 1 nome idêntico, 9 abreviados, 1 divergente |
| Termos (§ Lex) | **150** em 7 famílias (pill = markup) | **0** `gl-m11-`: faltam os 150; 9 homônimos em outros módulos | 150 |
| Exercícios | **14**, 0 com aula (P9) | 14 em `MODULO_11_EXERCICIOS_SOLTOS`, prompt e gabarito idênticos, tag sem ponto final, `points: 1` sem origem, **não renderizados** | 14 |
| Itens de checklist (§ Final) | **28** (2 cronometrados, 1 oral) | 0 | 28 |
| Questões do quiz | **10** × 4 alternativas; gabarito `CADBDACBDA`; 2 faixas (≥ 8 / < 8) | 0 | — |
| Caso (§ Caso "Operação A — Parte 11") | 3 subseções, 8 fragmentos de perfil, 1 pergunta literal, 0 decisão pedida | 0 | — |
| Erros comuns | 20 | 0 | 20 |
| Referências | 32 (0 URL, 5 pendentes, 7 internas; consulta em 1º/8/2026) | 0 | 32 |
| Critérios literais | 7 formas (P14 marcado): domínio da Aula 08, regra de ordem, quiz 8/10, checklist, roteiro oral, § Ex, janela do Inst · 11 | — | "Verificação em 1º de agosto de 2026" |
| Fichas de campo fixo | 10 (4 na Aula 03, 6 na Aula 07) | no corpo | 10 |
| § Voz | Roteiro oral de 6 blocos (10 min) | 0 | 10 min |
| Resultado esperado / capacidades | **não há** (`null`) | — | — |
| § Lab | **não há** (`null`) | — | — |
| Tradutor / segundo § Map | **não há** (`null`) | — | — |
| Horas | **não declaradas** (`null`) | `bloco-11`: `null`/`null` | não traz |

## Divergências

O detalhe está nos JSON, com `leitura_a`/`leitura_b` e `decisao: "não escolhida nesta camada"`. São 10 no módulo, 10
no aparato e 9 nos instrumentos.

**Fonte × fonte**
- **Pontos de sincronização (alta).** A Aula 08 diz "três" (L2116, L2215); o Inst · 11 marca dois (passos 04 e 08,
  "primeiro"/"segundo").
- **Divisão dos trinta minutos (alta).** Três leituras não coincidem:
  - 08.3: 5 min de solicitações / 15 de Eixos 1–2 / 10 de Eixo 3 e fechamento;
  - Inst · 11: janelas 0–3 … 26–30, sem passo de Eixo 3;
  - checklist 2: solicitações "nos primeiros cinco minutos".
- **Inst · 04 com 1.000 kW exatos (média).** O script exibe o ramo de 2,5%; o texto do outro ramo e o § Lex dizem 5%
  "a partir de 1.000 kW".
- **Contagem da cadeia normativa.** "Seis instrumentos" (Aula 02) × "sete marcos" (Inst · 03).
- **Potência em kWp.** O Inst · 06 rotula "Potência instalada" em kWp; o módulo reserva o nome para a grandeza em CA.
- **Teto da FV com bateria.** Q2, erro 4 e "Fonte despachável" dizem 3 MW; "Minigeração distribuída", lido isolado,
  dá 5 MW às despacháveis.
- **Portaria Inmetro nº 140.** "de 21 de março de 2022" × "nº 140/2021", com objetos diferentes.
- **Resíduos do script (§10).**
  - Inst · 05: ramo `ano>2045` inalcançável.
  - Inst · 05: o intro promete a entrada "fonte".
  - Inst · 07: prefixo `(gap>=0?'':'')` sem efeito.
  - Inst · 02: a12 sem acentos.
- **Fator de capacidade (informativa).** O § Lex remete ao "Módulo 08". O catálogo o introduz no Módulo 01, Aula 08,
  mas também o trata no M08, então não há contradição (corrigido pelo verificador).
- **Caso.** "Operação A — Parte 11", uma série de partes da fonte (P17 decide a apresentação).

**Fonte × código**
- **Alcance (alta).** `RecursosDoModulo.tsx` não tem `'modulo-11'`. O Inst · 01 e os 14 exercícios soltos existem como
  dado, mas nenhuma tela os mostra.
- **Aparato ausente.** Tese e eixos, texto do § MAP, critérios, caso, erros, quiz, roteiro oral, checklist e
  referências não estão no código. O glossário também não: 0 de 150 termos. `alexandria-badges.ts` não menciona o
  M11.
- **Instrumentos.** Os textos são iguais, mas a forma diverge:
  - exibição numérica com 2 casas e sem sinal (06–08);
  - classe do veredito descartada (`void cls`);
  - saídas de texto embutidas no veredito (04, 05);
  - rótulos não literais;
  - `inst-intro` e `srcnote` não portados;
  - grades `.seg` viraram `select`.
- **Exercícios.** A tag perde o ponto final; `points: 1` e `kind: 'discursiva'` não têm origem na fonte.
- **Acentos.** O texto sem acentos da a12 foi herdado pelo código.

**Fonte × catálogo**
- **Título.** O h1 e o catálogo concordam: "Geração Distribuída e a Anatomia de uma Proposta Solar".
  - O repositório diz "Energia Solar e Análise de Propostas" (`bloco-11`, `priority: 'confirmar'`).
  - A ref. 25 da fonte diz "…Geração Distribuída e o Boom Solar".
- **Ref. 22.** "Mercados ACR e ACL em Profundidade" × catálogo "Os Mercados ACR e ACL em Profundidade".
- **Nomes de instrumento.** 9 abreviados. O Inst · 11 aparece como "— instrumento assinatura" (tirado do intro) em vez
  de "— duas trilhas sincronizadas".
- **Trilha.** A fonte não declara; o catálogo marca "Setor Elétrico Brasileiro" como atribuída.

**Marca (P24).** "GridAlpha" aparece 10 vezes (L425, 550, 580, 1749, 2378, 2982, 2986, 2989, 2994, 3037): kicker,
corpo, refs. 25–27 e rodapé. O texto fica literal aqui.

## Lacunas (a fonte não tem)

- **Estrutura do módulo.** Não há "Resultado esperado" nem lista de capacidades, § Lab, "Tradutor" ou carga horária.
- **Perguntas.** Não há pergunta por aula no § MAP; as "perguntas" são as 4 lentes do Inst · 01. Nenhum instrumento
  tem pergunta própria.
- **Caso.** Não tem grade de dados nem decisão pedida (o parecer 11.3 vem pronto). O Desafio de decisão é da camada
  Alexandria (P17).
- **Vínculos com aula.** Nenhum item de aparato os declara: quiz, checklist, termos, erros, referências e exercícios
  (P9: os 14 são soltos).
- **Exercícios.** Não têm critério de correção próprio (vale a regra do lede do § Ex) e o gabarito abre sem tentativa.
- **Instrumentos.** Não têm tolerância nem resposta de referência. Não declaram a procedência dos valores-padrão e dos
  limiares (P19); o `srcnote` só dá a base normativa, e os Inst · 06–08 se dizem "didáticos".
- **Referências.** Nenhuma tem URL ou domínio, e 5 são pendências declaradas. Faltam os campos D5 (o que responde, o
  que não responde, verificação individual).
- **Aulas no JSON.** O conteúdo das aulas não foi reextraído neste lote. Os leads foram comparados e são idênticos; o
  corpo está em `MODULO_11_CORPO`.

## Verificação

Um verificador adversarial conferiu a extração em 2026-09-17 (detalhe em `modulo.md` › Verificação):
- **Conferido por completo.** Quiz, checklist, código e fórmulas de instrumento: 100% literais, com origens a ±3 linhas.
- **Contagens.** Todas as contagens declaradas foram recalculadas direto no HTML e conferem.
- **Correções.** Duas divergências foram reclassificadas como `informativa` (`div-m11-07`, `div-m11-10`). O M08 também
  trata o fator de capacidade, e a entrada de horas registra concordância.

Uma segunda passada adversarial (mesma data) refez tudo com scripts próprios: varredura verbatim de todas as strings,
quiz, checklist e código de instrumento a 100%, 482 origens e todas as contagens. Tudo confere. Houve duas correções
de nota, sem mudança de conclusão: `identidade.horas_nota` (a fonte tem 3 "hora", todas como unidade) e
`resultado_esperado.nota` ("resultado esperado" aparece só numa alternativa da Q10). Detalhe em `modulo.md` ›
Verificação — segunda passada.
