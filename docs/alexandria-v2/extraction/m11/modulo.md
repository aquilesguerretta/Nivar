# M11 · grupo "modulo"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo11.html` (3.964 linhas com LF final,
346.651 bytes). O campo `fonte.linhas_total` do JSON diz 3.965 porque conta o segmento vazio depois do último LF.
Saída: [`modulo.json`](modulo.json).

**Como foi extraído.** `extratores/m11_modulo.mjs` monta uma árvore de elementos com offsets
(`extratores/m11_lib.mjs`) e lê cada campo pelo seletor; `m11_blocos.mjs` fatia os blocos de cada seção. Nenhum texto
de conteúdo foi digitado. O código (`src/lib/data/*`, `RecursosDoModulo.tsx`) e o catálogo canônico foram lidos só
para comparar.

**Verificação.** `extratores/m11_verify.mjs` conferiu 386 strings de conteúdo como substring da fonte e 156 `origem`
(trecho perto da linha declarada, janela −3/+12), sem falha. Cobertura por token: 100% em §00 e § MAP (sem o markup do
Inst · 01). Saída completa em `extratores/verify-saida.txt`.

## Vocabulário medido

Mesmo vocabulário abreviado do M09/M10: `section#id`, `.sec-id` com `<b>`, `h2`, `h3` numerado, `p.lede`, `div.box`
(`rd`/`gd`) com `span.tag`, `div.lv`, `div.fi`, `div.inst`, `details`, `span.term`, `ul.ck`. Os seletores do M01
(`aula-marker`, `glossary-item`, `exercise-tag`) dão zero; os extratores do M01 foram adaptados, não reaproveitados.

## Estrutura do JSON

| Chave | O que contém |
|---|---|
| `identidade` | `<title>`, kicker, h1, subtítulo (`p.sub`), **11 pills**, `horas` (`null` + nota), os **4 eixos** (§ 00.1), rodapé e as 10 ocorrências de "GridAlpha" |
| `tese` | §00 inteiro em 18 blocos (lede, 12 parágrafos, 3 h3, 2 caixas) |
| `resultado_esperado` | `capacidades: null` + nota e 3 ponteiros (§ 00.3, lede da Aula 08, lede do § Final) |
| `mapa` | § MAP ("Anatomia") em blocos; as **4 lentes** do Inst · 01 como perguntas; os **10 itens** da proposta (script `ITENS`) |
| `roteiro` | As **18** seções em ordem: **8 aulas + 10 aparatos** (§00 e § MAP contados como aparato), com h2, subseções, instrumentos e fichas de campo fixo |
| `criterios` | **7** formas de critério, com `marcacao_p14`; o § Final traz os 28 itens anotados |
| `laboratorios` | `null` + nota (não há § Lab) |
| `voz` | 7 princípios literais (caixa "Números vivos" do §00, ledes de § Ex, § Lex e § Ref, rodapé) e os **13** callouts rotulados |
| `erros_comuns` | § Erros: **20** pares título/explicação |
| `tradutor` | `null` + nota (não há "Tradutor" nem segundo "§ Map") |
| `comparacao_codigo` | Contagem de aulas, pills × medido, títulos, **leads** (novo), linha do catálogo, `bloco-11` e o que falta no código |
| `divergencias` | **10** itens com `leitura_a` / `leitura_b`, nenhum resolvido |

## Identidade e catálogo (P24)

- **Título.** O h1 L426 diz "Geração Distribuída e a Anatomia de uma Proposta Solar", igual ao `<title>` (L6, que
  acrescenta "Alexandria · Módulo 11 — "), ao rodapé e ao catálogo canônico.
  - O repositório (`alexandria-blocks.ts` `bloco-11`, `priority: 'confirmar'`) chama o módulo de "Energia Solar e
    Análise de Propostas". O catálogo registra esse nome entre parênteses.
  - A própria fonte cita uma terceira forma na ref. 25 (L2982): "Bloco 11: Geração Distribuída e o Boom Solar".
  - Registrado em `div-m11-01`, sem decisão.
- **Subtítulo.** "Uma proposta solar não é um orçamento. É um conjunto de premissas…" (`p.sub`, L427).
- **Kicker e trilha.** O kicker é "Alexandria · GridAlpha · Módulo 11" (L425) e não traz trilha. O catálogo marca a
  trilha "Setor Elétrico Brasileiro" como **atribuída**.
- **Horas.** A fonte não declara (nenhum "hora"/"horas" como duração fora do `<style>`; as 3 ocorrências de "hora" são de unidade: "quilowatt-hora" L1525 e L2738, "megawatt-hora" L2487). O único tempo do hero é a pill "roteiro oral
  10 min", que é a duração do § Voz. `bloco-11` tem `estimatedHoursMin/Max: null`, e o catálogo também não traz horas.
  As três concordam na ausência (`div-m11-10`).
- **Pills (11).** 8 aulas · 11 instrumentos · 10 fichas de campo fixo · 150 termos · 14 exercícios · 20 erros comuns ·
  quiz 8/10 · roteiro oral 10 min · 28 itens de checklist · 32 referências · verificado em 01·08·2026. As 8 pills
  contáveis conferem com o markup, e a linha "Escala" do catálogo repete os mesmos números.
- **Marca.** "GridAlpha" aparece 10 vezes: L425, 550, 580, 1749, 2378, 2982, 2986, 2989, 2994 e 3037 (kicker, corpo,
  refs. 25–27 e rodapé). O texto fica literal nesta camada (`div-m11-06`).

## Eixos e tese

O M11, ao contrário do M01, **declara** os eixos: § 00.1 "Os quatro eixos" (h3 L476), com um parágrafo por eixo
aberto por `<b>Eixo N — …</b>`. O §00 tem três subseções:

- 00.1 Os quatro eixos;
- 00.2 Por que a ordem importa mais que a lista;
- 00.3 A afirmação que este módulo não faz.

## Resultado esperado

**Não há.** A fonte tem zero "Resultado esperado" como rótulo, "você será capaz" e "ao final deste" (a única ocorrência de "resultado esperado", em minúsculas, é uma alternativa da Q10 do quiz, L3913). Os pontos que falam do que o
módulo entrega ficam só como ponteiros, sem virar capacidade:
- o fim de § 00.3 (L562);
- o lede da Aula 08, que traz o critério de domínio (L2112);
- o lede do § Final (L2581).

## § MAP — "Anatomia"

O h2 é "A mesma proposta, vista por quatro lentes". O § MAP **não tem pergunta por aula**: são um lede, o Inst · 01 e
três parágrafos, e nenhuma aula é citada. As "perguntas" que ele declara são as quatro lentes do Inst · 01:

| Valor | Lente (rótulo literal) | Padrão |
|---|---|---|
| `eixo` | A que eixo pertence | sim |
| `fonte` | Qual fonte independente confirma | — |
| `sozinho` | O que o comprador confirma sozinho | — |
| `falta` | O que falta se estiver ausente | — |

As lentes se aplicam aos 10 itens da proposta: Potência instalada; Geração anual estimada; Taxa de degradação;
Modelo e conformidade do equipamento; Modalidade de participação declarada; Data de protocolo do pedido de acesso;
Regime de faturamento projetado; Trajetória de reajuste tarifário; Operação, manutenção e substituição de inversor;
Garantias e responsabilidades.

## Roteiro (P8)

| # | Seção | Rótulo | Título (h2) | Subseções | Instrumentos |
|---|---|---|---|---|---|
| 1 | §00 | Tese | Quatro eixos, e só um deles depende da palavra de quem vendeu | 3 | — |
| 2 | §MAP | Anatomia | A mesma proposta, vista por quatro lentes | 0 | Inst · 01 |
| 3 | Aula 01 | Os quatro eixos | A aula que impede toda promessa de retorno prematura | 4 | Inst · 02 |
| 4 | Aula 02 | Marco regulatório | De 2012 a 2025: seis instrumentos, duas pendências e duas fronteiras | 4 | Inst · 03 |
| 5 | Aula 03 | Porte e modalidades | Dois limiares, quatro modalidades, e o que a proposta precisa provar | 2 | Inst · 04 |
| 6 | Aula 04 | Regimes e cronograma | GD I, GD II, GD III — e o ano em que a regra ainda não existe | 3 | Inst · 05 |
| 7 | Aula 05 | Premissa técnica | Irradiância, geração estimada, degradação e certificação | 4 | Inst · 06, 07 |
| 8 | Aula 06 | Premissa financeira | Trajetória tarifária, operação e manutenção, e o crédito que expira | 3 | Inst · 08 |
| 9 | Aula 07 | Contrato e enquadramento | O que fica sem resposta se o equipamento falhar — e como se perde o regime | 3 | Inst · 09 |
| 10 | Aula 08 | Síntese | Trinta minutos, duas trilhas, três vereditos | 4 | Inst · 10, 11 |
| 11–18 | §Caso · §Erros · §Ex · §Quiz · §Voz · §Final · §Lex · §Ref | — | — | — | — |

**Fichas de campo fixo (10).** 4 na Aula 03, uma por modalidade do SCEE, com 5 linhas cada. 6 na Aula 07, uma por
cláusula com base normativa, com 4 linhas cada.

**Contagem de aulas: 8.** Todos os sinais concordam:
- fonte: `sec-id` "Aula NN" e a pill "8 aulas";
- código: `MODULO_11_AULAS`, `totalInModule` e `AULAS_POR_BLOCO['bloco-11']`;
- catálogo canônico.

**Títulos e leads.**
- Nas 8 aulas, `title` = h2, `subtitle` = rótulo do `sec-id` e as colunas do catálogo = fonte.
- Os 8 `MODULO_11_LEAD` são **idênticos byte a byte** ao `p.lede` com espaços colapsados, com o `<b>` preservado. Não
  aparece o artefato de espaço antes da pontuação que o M10 tem.
- O instrumento de cada aula no código coincide com o da fonte.
- `activities: []` nas 8 aulas: os 14 exercícios estão no bucket solto.

## Critérios (P14 / P18)

| id | Onde | Texto (início literal) | Marcação P14 |
|---|---|---|---|
| `m11-crit-dominio-a08` | Aula 08 lede (L2112) | "…O critério de domínio deste bloco tem duas dimensões, não uma: identificar se as premissas são realistas e se o contrato tem cláusula tóxica… em trinta minutos… com sincronização em três pontos." | **cronometrado**, produção oral/livre |
| `m11-crit-regra-de-ordem` | § 00.2 | "Daí a regra de ordem que organiza a avaliação cronometrada da Aula 08: confirme o Eixo 1, confirme o Eixo 2, e só então avalie o Eixo 3…" | **cronometrado** |
| `m11-crit-quiz` | § Quiz | h2 "Dez questões · critério de aprovação 8 de 10"; lede "O critério é oito acertos" | automatizável; P18: o limiar não é evidência |
| `m11-crit-checklist` | § Final | 28 itens (ver `aparato.md`) | 2 cronometrados, 26 de verificação documental em proposta real, 1 de cálculo, 1 oral/livre |
| `m11-crit-roteiro-oral` | § Voz | "Para ser dito em voz alta, na ordem…" + 6 blocos com duração | **oral**, **cronometrado** (1 + 2 + 3 + 2 + 1,5 + 0,5 = 10 min, conta desta extração) |
| `m11-crit-exercicios` | § Ex lede | "…O gabarito está oculto: formule a resposta antes de abrir. Nenhum gabarito contém valor de economia ou prazo de retorno…" | autoavaliado, sem registro; `limiar: null` |
| `m11-crit-janela-inst11` | Inst · 11 `p.srcnote` | "…A janela de trinta minutos é a do critério de domínio do currículo definitivo e pressupõe documentação disponível…" | **cronometrado** |

No quiz, a prosa (8 de 10) e o script (`acertos>=8`) **concordam**, ao contrário do M01. Pela P18, nenhum limiar vira
"Aprovado"/"Dominado" no produto. A `marcacao_p14` é anotação inferida desta extração e precisa de revisão humana.

## Laboratórios, Tradutor e § Map

- **§ Lab: não há.** Zero marcador "§Lab", id `lab-` ou classe `instrument`. Os 11 instrumentos são `div.inst` (ver
  `instrumentos.md`).
- **Tradutor: não há.** Zero ocorrência de "Tradutor". O único § Map é o "§MAP · Anatomia".

## Voz e princípios

- **Roteiro oral (§ Voz, "Dez minutos, sem slide").** Lede e 6 blocos: Abertura (1 min), Eixo 1 (2), Eixo 2 (3),
  Eixo 3 (2), Eixo 4 (1,5) e Fechamento (30 s). O texto está em `criterios.itens[m11-crit-roteiro-oral].blocos`.
- **Princípios literais (7).**
  - Caixa "Números vivos" do §00 (L525).
  - A linguagem de oportunidade: "qualquer prazo de retorno é uma saída, não uma entrada".
  - Os ledes de § Ex (sem valor de economia), § Lex (não repete termo de módulo anterior) e § Ref (número, data,
    artigo).
  - As 2 linhas do rodapé ("…Sem venda de energia. Sem venda de equipamento. Sem comissão…").
- **Callouts rotulados (13).**
  - 4 "Números vivos · verificar na fonte antes de uso externo".
  - 9 "Onde isso entra no produto". São bloco de produto: pela P7, não se exibem nesta fase.
- **Referências de política.** Refs. 25–29 do § Ref: currículo, War Room ("Quatro Travas de Segurança"), plano de
  negócios e duas notas metodológicas.

## Erros comuns (§ Erros, 20)

1. Ler o número final antes das premissas.
2. Tratar payback como grandeza técnica objetiva.
3. Comparar potência de pico com o limiar de porte.
4. Achar que bateria eleva o teto da minigeração para 5 MW.
5. Dizer "sessenta por cento do Fio B" sem dizer de qual regime.
6. Tratar 2029 como cem por cento.
7. Aplicar o percentual do ano sobre a tarifa cheia.
8. Ignorar a data de protocolo.
9. Esquecer a janela de 2031.
10. Não perguntar a concentração de participação no excedente.
11. Aceitar geração estimada sem o desempenho global declarado.
12. Usar irradiância de outra cidade.
13. Comparar degradação com média de mercado.
14. Tratar ausência de operação e manutenção como neutra.
15. Projetar vinte e cinco anos sem trocar o inversor.
16. Superdimensionar achando que é conservador.
17. Projetar conta zerada.
18. Confundir garantia de produto com garantia de performance.
19. Supor que uma unidade migrada para o ambiente livre pode aderir ao sistema de compensação.
20. Confundir ausência de informação com achado.

A explicação de cada erro está no JSON. A fonte não vincula nenhum erro a aula.

## Divergências (modulo.json)

| id | Sev. | Leitura A | Leitura B |
|---|---|---|---|
| `div-m11-01-titulo` | média | h1 / catálogo: "Geração Distribuída e a Anatomia de uma Proposta Solar" | repo: "Energia Solar e Análise de Propostas"; ref. 25: "…e o Boom Solar" |
| `div-m11-02-pontos-de-sincronizacao` | **alta** | Aula 08 (lede L2116, 08.3 L2215): **três** pontos de sincronização | Inst · 11: só os passos 04 e 08 têm `sinc:true` ("primeiro"/"segundo ponto") |
| `div-m11-03-divisao-do-tempo` | **alta** | 08.3: 5 min de solicitações / 15 de Eixos 1–2 / 10 de Eixo 3 e fechamento | Inst · 11: 0–3, 3–8, 8–12, 12–17, 17–22, 22–26, 26–30, sem passo de Eixo 3; checklist 2: solicitações "nos primeiros cinco minutos" |
| `div-m11-04-seis-instrumentos-sete-marcos` | baixa | Aula 02: "seis instrumentos" | Inst · 03: "sete marcos" (2024 agrupa dois atos; 2027 é pendência) |
| `div-m11-05-parte-11` | média | § Caso: "Operação A — Parte 11", "As dez partes anteriores" | P17: sem "Partes" da fonte na interface |
| `div-m11-06-marca` | baixa | "GridAlpha" × 10 | P24: Alexandria / NIVAR |
| `div-m11-07-fc-no-m08` | informativa | § Lex "Fator de capacidade": "tratado no Módulo 08" | catálogo: Módulo 01, Aula 08 (`gl-fator-de-capacidade-fc`), mas também M03 e M08 (L771-772, L788; `gl-m08-fator-de-capacidade`). Não é contradição |
| `div-m11-08-codigo-recursos` | **alta** | código exporta `MODULO_11_INSTRUMENTOS` e os 14 `EXERCICIOS_SOLTOS` | `RecursosDoModulo.tsx` não tem `'modulo-11'` (vai até `modulo-09`): nada disso é renderizado |
| `div-m11-09-codigo-aparato-ausente` | média | fonte: §00, § MAP, § Caso, § Erros, § Quiz, § Voz, § Final, § Lex, § Ref | código: nenhum; 0 `gl-m11-`; badges sem regra do M11 |
| `div-m11-10-catalogo-horas` | informativa | fonte: não declara | `bloco-11`: `null`/`null` (concordam) |

Na P21 (FCap/FCarga), a sigla "FC" tem zero ocorrências no M11, então a regra não é acionada.

## Verificação (verificador adversarial, 2026-09-17)

Conferência independente contra a fonte, com scripts próprios (fora de `extratores/`):
- **Quiz, 100%.** O array `Q` foi avaliado direto do `<script>`. Enunciados, 40 alternativas, gabarito e feedback são
  idênticos, e as origens ficam a ±3 linhas. O gabarito é `CADBDACBDA`.
- **Checklist, 100%.** Os 28 `li` de `ul.ck` batem com `html` e `texto`, e as origens ficam a ±3 linhas.
- **Fórmulas e código de instrumento, 100%.** Os 11 `script.codigo_verbatim` e todos os campos `codigo` com `linha_aprox`
  são substrings da fonte, na linha declarada (±3). Os 147 trechos literais dos `texto_template` também estão na fonte:
  146 diretos e 1 concatenado entre linhas (L3354-3356).
- **Verbatim.** Foram varridas todas as 2.562 strings dos três JSON. Toda string de conteúdo está na fonte; só falharam
  rótulos da extração (`marcacao_p14`, `tipo_input`, `mecanica`, ids).
- **Origens.** 685 origens e códigos foram conferidos, com 0 fora de ±3 linhas.
- **Contagens recalculadas.** Tudo confere: 18 `sec-id`, 8 aulas, 11 `div.inst` (1 no MAP, 2 na a05 e 2 na a08),
  150 `.term`, 7 `details` no § Lex, 14 exercícios (5/4/2/3), 28 itens de checklist, 10 questões, 20 erros, 32 `.src`
  (5 pendentes, 7 internas), 10 `.fi` (4 na a03 e 6 na a07), 11 pills, 10 "GridAlpha" e 9 homônimos no glossário do
  código. Também conferem 0 `gl-m11` e a ausência de `'modulo-11'` em `RecursosDoModulo.tsx`.
- **Correção 1: `div-m11-07-fc-no-m08`.** A leitura B dizia que o catálogo põe o fator de capacidade só no Módulo 01.
  O catálogo também o trata no M08 (L771-772, L788), e o código tem `gl-m08-fator-de-capacidade`, então "tratado no
  Módulo 08" não contradiz o catálogo. A leitura B e a nota foram corrigidas, e a severidade passou a `informativa`.
- **Correção 2: `div-m11-10-catalogo-horas`.** A entrada registra concordância, não divergência. A severidade passou
  a `informativa`, e o id foi mantido.
- **Onde foram feitas.** As duas correções estão em `extratores/m11_modulo.mjs`, e o `modulo.json` foi regerado. A
  diferença contra o JSON anterior se limita a esses campos, e `m11_verify.mjs` segue com saída idêntica (0 falhas).
- **Não recalculado.** `instrumentos_casos_confrontados` (3.387) e as contagens de ramos e literais de script (148 e
  353) dependem da execução do harness dos extratores.

## Verificação — segunda passada (verificador adversarial, 2026-09-17)

Conferência independente, com scripts próprios fora de `extratores/` (no scratchpad da sessão):
- **Verbatim, varredura total.** Todas as strings dos três JSON foram procuradas na fonte (com e sem tags, entidades
  decodificadas, espaços colapsados). Toda string de conteúdo está na fonte. Só não estão: rótulos e notas da extração,
  saídas calculadas pelo script no carregamento (ex.: "148,0 MWh/ano", "01 · Técnica ⟂", montadas em L3820) e valores
  do lado do código em `comparacao_codigo` (conferidos em `alexandria-modulo-11-content.ts` e
  `alexandria-instrument-calculators.ts`).
- **Quiz, 100%.** O array `Q` foi avaliado do `<script>`: 10 enunciados, 40 alternativas, 10 feedbacks e o gabarito
  `CADBDACBDA` são idênticos; as origens e as 2 faixas (L3952-3953) conferem.
- **Checklist, 100%.** Os 28 `li` de `ul.ck` batem em `html` e `texto`; origens a ±3 linhas; 2 cronometrados
  (01, 02) e 1 oral (28) conferem.
- **Instrumentos, 100% do código.** Todos os campos de código/fórmula do script são substrings da fonte na linha
  declarada (±3).
- **Origens.** 482 origens conferidas; nenhuma fora de ±3 linhas.
- **Contagens recalculadas.** 18 seções; 8 aulas; 11 `div.inst` (map 1, a01–a04 1 cada, a05 2, a06–a07 1 cada, a08 2);
  150 `.term` em 7 `details` (20/20/25/22/25/20/18); 14 exercícios (5/4/2/3, 14 gabaritos); 28 itens de checklist;
  10 questões; 20 erros; 32 referências (0 URL; 5 pendentes = 2 "Pendente:" + 3 "Pendência declarada"); 10 `.fi`
  (a03 4, a07 6); 3 subseções e 1 "?" no § Caso; 11 pills; 10 "GridAlpha" nas linhas declaradas; 9 homônimos e 0
  `gl-m11` no glossário do código; catálogo com 1 nome idêntico (Inst · 05), 9 abreviados e 1 divergente (Inst · 11).
  Tudo confere com o declarado.
- **Cobertura.** Todo `p`/`li`/`h2`/`h3` de §00, § MAP (sem o Inst · 01), § Caso, § Erros, § Ex, § Quiz, § Voz,
  § Final, § Lex e § Ref, hero e rodapé está nos JSON (os de § Ex, § Lex e § Ref estão partidos em campos).
- **Divergências.** As 29 foram conferidas na fonte (L2116, L2215, L3795, L3815, L2219-2228, L2586, L3376-3377,
  L1428/L3397 × L3411, L3558, L3231, L2656 × L2659, L2892 × L2901, L832 × L993, L1397). Nenhuma é inventada.
- **Correção 3: `identidade.horas_nota`.** A nota dizia "zero ocorrência de 'hora'/'horas'". A fonte tem 3
  ocorrências de "hora", todas como unidade (L1525, L2487, L2738). A nota agora diz isso; a conclusão (horas não
  declaradas, `null`) não muda.
- **Correção 4: `resultado_esperado.nota`.** Acrescentado que a única ocorrência de "resultado esperado" (minúsculas)
  é alternativa da Q10 do quiz (L3913), não um bloco. A conclusão (`capacidades: null`) não muda.
- **Onde foram feitas.** Em `extratores/m11_modulo.mjs`; o `modulo.json` foi regerado, e a diferença se limita
  aos dois campos. `m11_verify.mjs` segue com saída idêntica a `verify-saida.txt` (0 falhas). Este `.md` foi
  ajustado nos dois trechos correspondentes (§ Identidade › Horas e § Resultado esperado).
