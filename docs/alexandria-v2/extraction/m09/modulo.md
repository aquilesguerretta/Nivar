# M09 · grupo "modulo"

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo09.html` (3.441 linhas, LF, 372.141 bytes).
**Arquivo gerado:** [`modulo.json`](modulo.json).
**Extrator:** [`extratores/m09_modulo.mjs`](extratores/m09_modulo.mjs), com a biblioteca [`extratores/lib.mjs`](extratores/lib.mjs).
**Data:** 2026-09-17.

## Como foi extraído

O M09 usa o vocabulário novo (`section#id` > `.sec-id` + `h2` + `p.lede`), e cada elemento ocupa uma linha. O extrator
localiza as seções e passa cada uma por um parser de blocos por linha, que reconhece:

- elementos de texto: `p`, `h3`, `.box`, `table.tbl`, `ol`/`ul`, `details`, `div.out`;
- marcadores: `.inst`, `.lv` e `.fi`.

Uma linha que o parser não reconhece interrompe a extração. Nenhum texto de conteúdo foi digitado.

**Verificação** ([`extratores/verify.mjs`](extratores/verify.mjs)):
- **Strings:** 1.032 strings de conteúdo conferidas como substring exata da fonte, sem falha.
- **Origens:** 255 origens conferidas (`linha_aprox` ±3 contém `trecho_inicial`), sem falha.
- **Cobertura por token** (protocolo §5, com o markup de instrumento fora do denominador): 100% em hero, §00, §MAP, §Erros,
  §Voz e rodapé.

Os campos que ficam fora da conferência são anotação desta extração: `nota*`, `divergencias`, `marcacao_p14`,
`comparacao_codigo`.

## Estrutura do JSON

| Chave | O que contém |
|---|---|
| `identidade` | `<title>`, kicker, h1, subtítulo (`p.sub`), as **12 pills** do hero, `horas` ("6-8 h de estudo", min/max `null`), trilha, **4 eixos literais** (§00.3), rodapé (3 linhas). `cabecalho: null` |
| `tese` | §00: h2, lede e 17 blocos (9 parágrafos, 3 títulos, 3 destaques, 1 tabela de 7 riscos, 1 lista) |
| `resultado_esperado` | `itens: null`. A fonte não tem esse bloco; ficam 3 ponteiros para o que mais se aproxima |
| `mapa` | §MAP "Mapa do mercado": h2, lede, 3 parágrafos, destaque e marcador do INST·01. `perguntas_por_aula: null` |
| `roteiro` | As **18** seções em ordem: **8 aulas**, 2 de abertura (§00, §MAP) e 8 de aparato. Cada uma traz marcador, rótulo, h2, lede, subseções, instrumentos, destaques, três-níveis, fichas, contagens e a comparação com o código e o catálogo |
| `criterios` | Quiz (sec-id, lede, limiar do script e as 2 mensagens), checklist (**28 itens** com P14), §Ex (regra de procedimento), os 2 parágrafos da Aula 08 que citam "o critério de domínio deste bloco" e os 3 tempos do §Voz |
| `laboratorios` | `itens: null`. Não há § Lab; o único instrumento fora de aula é o INST·01 (§MAP) |
| `voz` | §Voz inteiro: **40 perguntas-relâmpago**, **8 ataques de decisor** e **roteiro oral de 7 trechos** (10 minutos). Princípios editoriais: **11 avisos** de "Números vivos / Regra em movimento / Advertência final", 3 ledes de política e o aviso legal do rodapé. Mais **9 ponteiros** "Onde isso entra no produto" (P7/P24) |
| `erros_comuns` | §Erros: **20** pares erro → correção, mais 2 ponteiros para correções dentro de aula (A02 L876, A03 L1067) |
| `tradutor` | `itens: null`. O M09 não tem "§ Map · Tradutor" |
| `divergencias` | 15 itens, cada um com as leituras lado a lado. Nenhum foi resolvido |
| `comparacao_codigo` | Contagens; títulos, subtítulos e leads das 8 aulas × `alexandria-modulo-09-content.ts`; linhas `bloco-09`/`bloco-10` do catálogo do código; nomes do catálogo canônico |

## Identidade e catálogo (P24)

| Campo | Fonte | Código (`bloco-09`) | Catálogo canônico |
|---|---|---|---|
| Título | "Os Mercados ACR e ACL em Profundidade" (h1 e `<title>`); rodapé em caixa alta | "Mercado ACR e ACL" (`priority: 'confirmar'`) | Cabeçalho: título da fonte. Tabela de contagens: "Os Mercados ACR e ACL" |
| Subtítulo | `p.sub` "Migrar não é comprar energia mais barata. …" | — | — |
| Trilha | "Trilha 2 — Setor Elétrico Brasileiro" (kicker e rodapé) | `track: 'brasil'`, `level: 2` | declarada |
| Horas | pill "6-8 h de estudo" | `estimatedHoursMin/Max: null` | "6–8 h declaradas" |
| Aulas | 8 (sec-id "Aula NN" = pill "8 aulas") | 8 (`totalInModule: 8`, `AULAS_POR_BLOCO['bloco-09'] = 8`) | 8 |

As 8 aulas têm `title` = h2, `subtitle` = rótulo do `.sec-id` e `lead` = `p.lede`, **idênticos** no código (P8 ok). Só a
**Aula 07** diverge no catálogo canônico, que corta o prefixo "Realocação e fator de ajuste:".

## Roteiro

| # | Marcador | Rótulo | Subseções | Instrumento | Destaques | Outros |
|---|---|---|---|---|---|---|
| 1 | §00 | Tese | 3 (§00.1–.3) | — | 3 | tabela de 7 riscos, lista dos 4 eixos |
| 2 | §MAP | Mapa do mercado | 0 | INST·01 | 1 | — |
| 3 | Aula 01 | Os quatro eixos | 5 (Eixo 1, 1b, 2, 3, 4) | INST·02 | 4 | 1 três-níveis |
| 4 | Aula 02 | Ambiente regulado | 8 | INST·03 | 5 | 1 tabela, 1 lista |
| 5 | Aula 03 | Ambiente livre | 5 | INST·04 | 5 | 2 listas (5 requisitos; rito de 10 etapas) |
| 6 | Aula 04 | Anatomia do contrato | 5 | INST·05 | 1 | 6 fichas, 2 tabelas, 1 três-níveis |
| 7 | Aula 05 | Risco | 8 | INST·06 | 1 | — |
| 8 | Aula 06 | Preço de curto prazo | 2 | INST·07 | 2 | 1 lista, 1 três-níveis |
| 9 | Aula 07 | Realocação e fator de ajuste | 2 | INST·08 | 3 | 1 três-níveis |
| 10 | Aula 08 | Síntese | 3 | INST·09, ·10, ·11 | 3 | 2 tabelas, 1 lista |
| 11–18 | §Caso, §Erros, §Ex, §Quiz, §Voz, §Final, §Lex, §Ref | — | — | — | — | aparato (ver aparato.md) |

As pills do hero conferem com o markup: 8 aulas, 11 instrumentos, 6 fichas, 136 termos, 14 exercícios, 20 erros,
10 questões, 40 perguntas-relâmpago, 8 ataques, 28 itens e 30 referências.

## P14: critérios orais e cronometrados

`marcacao_p14` é **anotação inferida do texto** de cada item, não texto da fonte.

| Lista | Cronometrado | Oral ou livre | Recordação sem consulta |
|---|---|---|---|
| §Final (28) | 0 | 28 (todos em 1ª pessoa: "Explico", "Digo"…) | 1 (item 01, "de memória") |
| §Voz relâmpago (40) | 40 ("em até quinze segundos cada") | 40 ("em voz alta") | — |
| §Voz ataques (8) | 8 ("caber em trinta segundos") | 8 | — |
| §Voz roteiro (7 trechos) | 1 roteiro ("dez minutos") | sim | — |
| §Quiz (10) | — | — | automatizável; limiar 8/10 só como registro (P18) |

## Divergências (P5/P8/P24)

| Id | Sev. | Resumo |
|---|---|---|
| div-m09-criterio-bloco | alta | O critério aparece em várias formas: quiz 8/10, checklist de 28 "marque mentalmente" e o "critério de domínio deste bloco" citado 2× na Aula 08, sem texto em lugar nenhum do arquivo. P18: nenhuma forma vira aprovação |
| div-m09-titulo | média | h1 × `bloco-09` ("Mercado ACR e ACL") × forma curta do catálogo canônico |
| div-m09-final-aula-indicada | média | A lede do §Final diz que a aula de cada item "está indicada na estrutura do módulo"; nenhum item indica aula |
| div-m09-marca | média | 4 dos 9 destaques de produto citam GridAlpha, e a **prosa comum** da Aula 08 (L1695) também ("tese comercial da GridAlpha") |
| div-m09-sinais-caso | média | O §Caso diz "quatro dos sete sinais favoráveis", mas só 2 dos 4 citados estão na tabela da Aula 08 |
| div-m09-caso-parte | média | A fonte declara "parte 9" / "oito partes anteriores"; P17 manda não estruturar o produto em partes. A série vai do M02 ao M17 (só o M01 não tem número), com caixa e separador variáveis |
| div-m09-horas | baixa | A fonte declara 6-8 h; o código tem `null` |
| div-m09-aula07-catalogo | baixa | O título da Aula 07 está truncado no catálogo canônico |
| div-m09-quatro-eixos-1b | baixa | O §00.3 lista 4 eixos; a Aula 01 tem 5 cabeçalhos (inclui "Eixo 1b") |
| div-m09-onze-clausulas | baixa | "uma cláusula entre onze" × 12 itens na prosa × tabela de 11 com outros nomes |
| div-m09-preco-fixo-restam | baixa | "restam seis" (§Voz) × 7 itens no §Erros ("renovação" a mais) |
| div-m09-ref-todas-primarias | baixa | h2 "todas primárias ou institucionais" × item 30 "Fonte secundária" |
| div-m09-bloco-x-modulo | baixa | O arquivo chama a si mesmo de "módulo" e de "bloco" |
| div-m09-codigo-cabecalho | baixa | Coerente: 11 instrumentos na fonte, 0 no código; `RecursosDoModulo` também não tem o INST·01 |
| div-m09-badge-pld | baixa | `alexandria-badges.ts` diz que o Bloco 09 não tem HTML; o HTML existe e não usa as siglas PLD/MRE/GSF como texto (só `data-v="pld"`, a chave `pld:` do script e `id="lv-gsf"`) |

## Lacunas (a fonte não tem)

- **"Resultado esperado" e capacidades:** não existem (`null`).
- **Perguntas por aula (§MAP de aulas):** não existem (`null`).
- **Laboratório (§ Lab):** não existe.
- **Tradutor:** não existe.
- **Header de marca:** não existe.
- **Critério de domínio do bloco:** a Aula 08 o cita duas vezes, mas o texto não está no arquivo (provável documento
  externo de currículo).
- **Vínculo item → aula:** nenhum item do checklist, do §Erros ou do §Voz o declara.
- **Horas numéricas:** não convertidas (min/max `null`).

## Verificação

Verificação adversarial independente em 2026-09-17, com parsers próprios e sem usar `verify.mjs`. Resultado: **ok,
nenhuma correção**.

- **Strings.** Todas as strings de conteúdo do JSON são literais da fonte. As únicas que não aparecem na fonte são
  anotações (`onde`, `aula_id_codigo` e as condições e classes do placar).
- **Origens.** Todas batem com a linha declarada (±3), inclusive as que só têm `linha_aprox` junto do texto.
- **Pares conferidos um a um:**
  - §Erros: 20 pares erro → correção;
  - §Voz: 40 perguntas-relâmpago (pergunta + resposta), 8 ataques (interlocutor + pergunta, 16 parágrafos de
    resposta) e 7 trechos do roteiro;
  - §00: 17 blocos (9 parágrafos, 3 títulos, 3 destaques, 1 tabela, 1 lista).
- **Contagens recalculadas no HTML:**
  - 18 `sec-id` e 12 pills;
  - por seção: destaques, três-níveis, tabelas, h3 e fichas, todos iguais aos da tabela do roteiro;
  - 9 destaques "Onde isso entra no produto", 4 deles com GridAlpha;
  - 11 avisos (10 "Números vivos / Regra em movimento" e 1 "Advertência final");
  - 2 destaques `box att` de correção.
- **Divergências conferidas na fonte e no código.** Todas se sustentam, inclusive:
  - "quatro dos sete sinais" (L1841 × tabela L1638–1645);
  - 12 blocos em prosa × 11 linhas (Aula 04);
  - "restam seis" (L2022) × 7 itens (L1865);
  - "matéria do Bloco 10" (L724);
  - `alexandria-badges.ts` L50–51;
  - o catálogo canônico corta o título da Aula 07.
- **Observação, sem correção.** Nas leituras de algumas divergências, o campo `literal` descreve a passagem em vez de
  citá-la (ex.: "4 de 9 citam GridAlpha", "nenhum item traz aula…"). Como é anotação e fica fora da conferência, foi
  mantido assim.

### Segunda verificação adversarial (2026-09-17): 2 correções

Feita com parsers próprios e com o HTML aberto num navegador, para rodar os scripts originais. Resultado: **corrigido**.

**Correções.** As duas estão no extrator (`m09_modulo.mjs`), e o `modulo.json` foi regenerado a partir dele.
`aparato.json` e `instrumentos.json` saíram idênticos byte a byte, e o `verify.mjs` continua sem falha.

1. **`div-m09-caso-parte`: a leitura dos outros HTMLs estava errada.** Ela dizia "M01, M03, M06, M10, M16 sem número de
   parte", e a nota falava em "lacunas na série". Na fonte:
   - M02 L2475: "Operação A · Caso de referência · Parte 2";
   - M03: "Parte 3" no comentário (L2170) e no checklist (L2484), e o lead (L2177) cita "Parte 1" e "Parte 2";
   - M06 sec-id L1083: "· Parte 6";
   - M10 sec-id L2699: "Parte 10";
   - M16 sec-id L3686: "parte 16", escrito com entidades HTML (por isso o grep literal não achou).

   Só o M01 fica sem número. A leitura e a nota foram reescritas: a série vai do M02 ao M17, sem lacuna.
2. **`div-m09-badge-pld`: "só aparecem como data-v=\"pld\"" era incompleto.** Há também a chave `pld:` do script (L2752)
   e o `id="lv-gsf"` do bloco de três níveis da Aula 07 (L1593). "MRE" não aparece. A leitura passou a listar as três
   ocorrências. A divergência em si (o HTML existe e não usa as siglas como texto) continua de pé.

**Conferido sem erro:**
- **Strings e origens.** Todas as strings de conteúdo conferem. As 604 origens também: o início do `trecho_inicial`
  está a ±3 linhas.
  - 14 origens têm `trecho_inicial` vazio (`footer p` e 13 `.seg` de instrumento), mas a linha está exata. É elemento
    sem texto próprio, então não foi corrigido.
- **Pares conferidos por inteiro.** 20 erros, 40 relâmpagos, 8 ataques (interlocutor, pergunta e parágrafos) e os 7
  trechos do roteiro.
- **Contagens recalculadas.** Todas batem:
  - 18 `sec-id`, 12 pills e 6 fichas `.fi`;
  - 9 destaques de produto, 4 deles com GridAlpha;
  - 11 avisos e 4 blocos `.lv`;
  - títulos, subtítulos e leads das 8 aulas iguais aos de `alexandria-modulo-09-content.ts`.
- **Demais divergências.** Conferidas na fonte, no código e no catálogo (L56, L860, L1840, L1871), e todas se
  sustentam.
