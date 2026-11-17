# M09 · grupo "aparato"

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo09.html` (3.441 linhas).
**Arquivo gerado:** [`aparato.json`](aparato.json).
**Extrator:** [`extratores/m09_aparato.mjs`](extratores/m09_aparato.mjs).
**Data:** 2026-09-17.

## Método

As seções são localizadas por `section#id` e passam pelo mesmo parser de blocos do grupo módulo. O quiz vem do literal
`var QZ=[…]` do `<script>`, avaliado com `vm` só como dado, sem executar lógica. As mensagens de placar saem das linhas do
script por regex.

Convenções de campo:
- `html`: literal da fonte;
- `texto`: sem tags;
- `origem`: `{seletor, trecho_inicial, linha_aprox}`;
- todo `null` vem com nota.

**Verificação:**
- **Strings:** 1.318 strings de conteúdo conferidas como substring da fonte, sem falha.
- **Origens:** 267 conferidas, sem falha.
- **Cobertura por token:**

| Seção | Cobertura | Tokens na fonte |
|---|---|---|
| §Caso | 100% | 1.424 |
| §Quiz (seção) | 100% | 35 |
| §Quiz (strings do script) | 100% | 966 |
| §Ex | 100% | 1.904 |
| §Final | 100% | 563 |
| §Lex | 100% | 2.551 |
| §Ref | 100% | 814 |

## Estrutura e contagens

| Chave | Seção da fonte | Contagem | Estado no código |
|---|---|---|---|
| `caso` | §Caso (L1769–1845) | 6 seções numeradas, 1 pergunta da fonte com 6 cartões de resposta, 1 veredito pronto | **Não extraído** |
| `avaliacao` | §Quiz (L1971) + script (QZ L3363–3394, placar L3425–3430) | 10 questões × 4 alternativas, 2 faixas de placar | **Não extraído** |
| `checklist_final` | §Final (L2099) | 28 itens | **Não extraído** |
| `exercicios` | §Ex (L1885) | 14 (Bloco A 4, B 5, C 5); 0 com aula, 14 soltos (P9) | Os 14 estão em `MODULO_09_EXERCICIOS_SOLTOS`, **com defeitos** |
| `referencias` | §Ref (L2303) | 30 itens + advertência final | **Não extraído** |
| `glossario` | §Lex (L2139) | 136 termos em 6 grupos | **0 no código** (faltam os 136) |
| `divergencias` | — | 5 | — |

### caso

- **Título e parte.** O sec-id diz "Operação A — parte 9", e o lede diz "As oito partes anteriores construíram o
  perfil". O literal fica em `parte_literal`. P17 vale para o produto: título "Caso — Operação A", sem estruturar em
  partes.
- **Dados.** A fonte traz o setor e o local ("mineração em Minas Gerais") e um perfil qualitativo (carga razoavelmente
  plana, turnos, SE/CO, fator de carga elevado, pouca flexibilidade). **Não há números da operação.** "0,85 e 0,93"
  aparecem só como exemplo hipotético.
- **Seções.** Seis, numeradas pela fonte:
  1. Elegibilidade;
  2. O que mudaria;
  3. Estrutura contratual (com lista de 3 qualificações);
  4. Riscos (tabela de 7);
  5. Calendário;
  6. A pergunta que este bloco serve para responder.
- **`perguntas`.** Uma, e é da fonte (§6). A própria fonte responde com 6 cartões ("Provavelmente tem" ×2,
  "Provavelmente não tem" ×3, "Precisa decidir, não descobrir" ×1).
- **`decisao_pedida: null`.** A fonte entrega o veredito pronto ("Diagnóstico da parte 9": *não é possível concluir com o
  que foi informado*). P17 autoriza o Desafio de decisão na camada Alexandria.

### avaliacao

- **Gabarito.** A fonte numera as opções de 1 a 4 (`a:` é base 1). A letra A–D é derivação desta extração
  (`letra_derivada`). Distribuição: opção 1 ×2, opção 2 ×2, opção 3 ×3, opção 4 ×3.
- **Feedback.** O mesmo texto `f` aparece para acerto e erro, precedido de "Correto." ou "Resposta correta: opção N.".
- **Placar.** Só duas faixas, `acertos>=8` (pass) e `<8` (fail), diferente das 4 do M01. A mensagem de pass começa com
  "Critério atendido.", o que é registro legado (P18).
- **Vínculo com aula.** Nenhuma questão o declara.

### checklist_final

28 itens estáticos (`ul.ck`), sem script de marcação. A marcação P14 está em `modulo.json → criterios.checklist`: todos
são produção oral ou livre, e nenhum é cronometrado.

### exercicios (índice)

Para cada exercício: tag ("Ex. N"), bloco (A/B/C), enunciado (o `summary`), resposta de referência (os `<p>` do
`details`), `criterio: null` com nota, `aula_vinculada: null` com nota (P9) e a comparação com o código.

A varredura por "Aula NN", "Módulo NN" e "Bloco NN" nos três campos deu **zero** em todos, o que confirma o protocolo §4
para o M09.

| Estado no código | Medido |
|---|---|
| ids | **os 14 são `m09-ex-null`** (colisão de chave) |
| `prompt` | vazio nos 14 |
| `tag` | "null · Ex. N — <enunciado>" nos 14 (o enunciado foi parar dentro da tag) |
| `points` | 1 (sem origem na fonte) |
| gabarito | 12 verbatim; **Ex. 08 e Ex. 10** têm espaço antes da vírgula onde havia `</b>` ("avaliar , e", "perfil , mensal") |

### referencias

- **Formato.** Cada item traz `tipo_fonte` (o `span.src`), o título literal (até o primeiro " — ") e a descrição.
  `marcas_de_data_no_texto` guarda os recortes literais de data.
- **Instituição, URL e domínio.** São **null** nos 30. A fonte não nomeia instituição por sigla ("ministério", "agência",
  "câmara", "operador"), e esta extração não inferiu siglas.
- **Datas.** A única data de verificação declarada é a do lede ("Verificação em 1º de agosto de 2026.").
- **Tipos.**
  - 7 de lei (1 "marco vigente" e 6 "texto compilado");
  - 1 decreto;
  - 1 portaria normativa e 1 portaria;
  - 1 consulta pública;
  - 4 resoluções normativas;
  - 1 despacho anual;
  - 3 páginas institucionais;
  - 1 agenda regulatória;
  - 1 procedimentos e 1 procedimentos de mercado;
  - 1 regras de mercado;
  - 1 boletim;
  - 3 comunicados;
  - 1 dados abertos;
  - 1 planejamento;
  - 1 fonte secundária.

### glossario

| Grupo | Rótulo | Declarado | Medido |
|---|---|---|---|
| 1 | Ambientes, agentes e topologia | 24 | 24 |
| 2 | Contratação regulada, leilões e portfólio | 24 | 24 |
| 3 | Migração, elegibilidade e representação | 22 | 22 |
| 4 | Contrato: volume, preço e cláusulas | 28 | 28 |
| 5 | Preço de curto prazo, exposição e liquidação | 20 | 20 |
| 6 | Risco, realocação e regra em transição | 18 | 18 |
| **Total** | prosa "Cento e trinta e seis termos", pill "136 termos" | **136** | **136** |

- **Prosa e markup concordam** (diferente do M01). A ordem é por função, não alfabética. Há `<i>` inline em 5
  definições (glosas em inglês: *power purchase agreement*, *load following*, *step-in*, *basis*, *mark-to-market*).
- **No código.** `alexandria-glossario.ts` tem blocos gl-m02 … gl-m08 e **nenhum gl-m09**, então faltam os **136**. A
  lista está em `glossario.codigo_atual.faltam_no_codigo`.
- **Homônimos em outros módulos.** 28 termos do M09 têm o mesmo nome num verbete de outro módulo (ex.: "Consumidor
  livre", "Submercado", "Sazonalização", "PPA", "Take-or-pay"). Um verbete homônimo não substitui o do M09, porque os ids
  são namespaçados e cada definição é própria. A lista está em `homonimos_em_outros_modulos`.
- **Catálogo canônico.** Resume os termos com siglas que **não existem** no §Lex do M09 (PLD, MCP, TEO, TSA, ESS, MRE,
  CUSD, SMF, "Change in law"). A fonte escreve os nomes por extenso ("Preço de liquidação das diferenças", "Mecanismo de
  realocação de energia", "Cláusula de mudança em lei"…).

## Divergências

| Id | Sev. | Resumo |
|---|---|---|
| div-m09-ex-ids-codigo | alta | Os 14 exercícios no código têm o mesmo id, `prompt` vazio, tag "null · …" e `points: 1` sem origem |
| div-m09-glossario-ausente | alta | São 136 termos na fonte e 0 no código |
| div-m09-caso-quiz-final-ausentes | média | Caso, quiz, checklist e referências só existem no HTML |
| div-m09-ex-gabarito-espaco | baixa | 2 gabaritos do código não são verbatim |
| div-m09-caso-sete-coisas | baixa | O caso diz "Prontidão se resolve consultando sete coisas", e a Aula 03.2 enumera 6 (ou 7) |

Divergências do módulo inteiro (critério, marca, "quatro dos sete sinais", "parte 9"…) estão em `modulo.json`.

## Lacunas

- **Caso.** Não tem números, não pede decisão e não liga seções a aulas (a correspondência de tema é só observada).
- **Quiz.** Nenhuma questão tem vínculo com aula.
- **Checklist.** Nenhum item tem vínculo com aula, embora a lede afirme que tem.
- **Exercícios.** Não têm critério por item.
- **Referências.** Faltam URL, domínio e instituição em todas, e muitas não trazem número nem data. Faltam os campos D5.
- **Glossário.** Não tem vínculo com aula (o `aulaIds` terá de ser derivado).

## Verificação

Verificação adversarial independente em 2026-09-17. Resultado: **ok, nenhuma correção**.

- **Quiz (100%).** O `var QZ` foi reavaliado da fonte. As 10 questões conferem com o JSON em enunciado, 4 alternativas
  (texto e número), gabarito (`a`, base 1) e retorno `f`. Distribuição: 1×2, 2×2, 3×3, 4×3. As origens estão certas: a
  Q3 casa por engano com o Ex. 7 (L1925), mas a origem declarada, L3370, é a correta. As 2 mensagens de placar e o
  limiar `acertos>=8` (L3425) estão literais.
- **Checklist (100%).** Os 28 `li` de `ul.ck` batem com `html`, `texto` e a linha, item a item.
- **Glossário.**
  - Os 136 pares termo–definição conferem com o JSON, na ordem e no grupo certos: 24, 24, 22, 28, 20 e 18.
  - Os 28 homônimos foram recontados em `alexandria-glossario.ts` (550 `term:`) e o conjunto é idêntico.
  - Não há gl-m09 no código.
  - As siglas do catálogo canônico (PLD, MCP, TEO, TSA, ESS, MRE, CUSD, SMF, "Change in law") não aparecem no §Lex.
    O único "MCP" do arquivo é um rótulo do SVG do INST·01 (L593).
- **Referências.** Os 30 `li` conferem em `html`, `tipo_fonte` e `titulo_literal`. Os tipos batem com a lista, e não há
  URL nem domínio.
- **Exercícios.** São 14 (A 4 · B 5 · C 5). Enunciado e parágrafos do gabarito conferem um a um, e nenhum cita
  "Aula/Módulo/Bloco NN".
  - **Código.** 14 × `m09-ex-null`, `prompt: ""` e `points: 1`.
  - **Espaço antes da vírgula.** Só em Ex. 08 ("avaliar , e") e Ex. 10 ("perfil , mensal", "contraparte , salvo",
    "renovação , concentrada").
- **Caso.** 6 h3, tabela de 7 riscos, lista de 3 qualificações, 6 cartões (2/3/1) e o destaque "Diagnóstico da parte 9".
  Tudo confere.
- **Fora do escopo deste grupo, só registro.** As 6 fichas da Aula 04 no código (`kind: 'tabela'`, L207–217 de
  `alexandria-modulo-09-content.ts`) têm o mesmo defeito do espaço antes da vírgula ("Vendedor , sobre…",
  "Comprador , integralmente…"), onde a fonte tem `</b>,` (ex.: L1154). Isso cabe à comparação do corpo das aulas.

### Segunda verificação adversarial (2026-09-17): ok, nenhuma correção neste grupo

- **Método.** Parsers próprios, sem usar `verify.mjs`.
- **Conferido por inteiro (100%):**
  - **Quiz.** O `var QZ` foi reavaliado da fonte. Enunciado, 4 alternativas, `gabarito.numero`, `gabarito.texto`,
    letra derivada e `explicacao` batem nas 10 questões, e as origens estão certas (L3364–3391).
  - **Checklist.** Os 28 itens batem em `html`, `texto`, ordem e linha.
  - **Glossário.** Os 136 termos batem em termo, definição, grupo e linha. Os 28 homônimos foram recontados, e o
    conjunto é o mesmo.
  - **Referências.** Os 30 itens batem em `html`, `texto`, `tipo_fonte` e linha. Só o item 30 é secundário.
- **Gabaritos no código.** Foram recomparados, e só `m09-ex-08` e `m09-ex-10` diferem, nas posições declaradas.
- **Caso.** Estrutura e linhas conferem: 6 h3, 1 pergunta (L1828), 6 cartões (L1831–1836) e o veredito (L1840).
- **Cruzamento com o outro grupo.** A leitura sobre os outros módulos em `div-m09-caso-parte` estava errada e foi
  corrigida em `modulo.json` (ver `modulo.md`). `caso.nota_parte` ("uma parte por módulo") continua correta.
