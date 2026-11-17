# Peça D — o que a fonte e o backend sustentam

**Data da medição:** 2026-09-20.
**Régua:** [`../../bar.md`](../../bar.md) v1.1 — §5 (D1–D6), S3, S4, §6, §0 (teste anti-LMS e sua exceção).
**Escopo:** Progresso, Glossário e Biblioteca. Este documento **não propõe nada** — ele mede. A proposta está em
[`composicao.md`](composicao.md).

## Método, e por que ele é confiável

Toda contagem abaixo foi **derivada de arquivo**, nunca estimada, e cada uma traz arquivo e linha. Nada de
`app/` foi editado (somente leitura, posse do CURSOR); nada de `src/`, `public/`, `index.html` ou git foi tocado.

Duas verificações independentes confirmam que o método lê o que existe e não o que se espera:

| Verificação | Contrato declara (`bar.md` §0, L69–77) | Medido nos 17 `aparato.json` | Confere |
|---|---|---|---|
| Termos de glossário na fonte | 2.124 | **2.124** (soma de `glossario.termos` / `glossario.familias[].termos` em `extraction/m01…m17/aparato.json`) | sim |
| Exercícios na fonte | 214 | **214** (soma de `exercicios.total_na_fonte`) | sim |

Quando a medição **diverge** de um número que já circulava no projeto, a medição vence e a divergência está
registrada como tal (ver §1.3 e §4.2).

---

# 1. PROGRESSO — o que o servidor registra de verdade

## 1.1 O inventário completo

**Contrato:** [`../../../v2-backend-contract.md`](../../../v2-backend-contract.md) §"Per-account learning progress
(Wave 11)", L971–L1109.
**Router real:** `app/routers/progress.py` (131 linhas).
**Derivação:** `app/services/progress_service.py` (260 linhas).
**Esquema:** `app/db/models/progress.py` (155 linhas) e `app/db/migrations/versions/0004_progress.py`.

**Tipos de evento que o servidor aceita — cinco** (`app/db/models/progress.py` L47–53, `EVENT_TYPES`; validados no
router em L60–64 e de novo no serviço em L168):

```
aula_iniciada · aula_concluida · instrumento_usado · exercicio_respondido · badge_conquistado
```

**Tabelas — quatro** (`0004_progress.py` L26, L47, L61, L72):

| Tabela | Papel | Escrita por |
|---|---|---|
| `progress_event` | log imutável, fonte da verdade | `record_event`, `app/services/progress_service.py` L173–180 |
| `aula_status` | cache derivado: `em_andamento` \| `concluido` por (user, aula) | L107–145 |
| `badge_award` | cache derivado: que medalha foi registrada e quando | L148–157 |
| `study_streak` | cache derivado: `atual`, `maior`, `ultimoDiaAtivo` | L55–77 (`_STREAK_UPSERT_SQL`) |

**Endpoints — três** (`app/routers/progress.py` L54, L96, L114): `POST /api/progress/events`,
`GET /api/progress/me`, `GET /api/progress/aulas/{aula_id}`.

**O que `GET /me` devolve — exatamente quatro campos**, e nada mais
(`app/services/progress_service.py` L238–243):

```json
{ "aulasConcluidas": [...], "aulasEmAndamento": [...], "badges": [...], "streak": {...} }
```

**Quem emite evento, no produto inteiro** — três chamadas, em dois arquivos:

| Evento | Arquivo e linha | Gatilho real |
|---|---|---|
| `aula_iniciada` | `src/components/alexandria/viewer/AulaViewer.tsx` L73 | `useEffect` de montagem do viewer — **abrir a rota**, não ler |
| `aula_concluida` | `src/components/alexandria/viewer/AulaViewer.tsx` L91 | botão, **sem nenhuma pré-condição** (`marcarConcluida`, L86–107) |
| `badge_conquistado` | `src/lib/progress/badgeRules.ts` L246 | só se `avaliarPorConclusao` devolver id — hoje nunca devolve (§1.5) |

**`instrumento_usado` e `exercicio_respondido` não são emitidos por arquivo nenhum do `src/`.** A varredura
(`grep -rn` em `src/`, `--include=*.ts --include=*.tsx`) devolve três ocorrências, todas **não executáveis**: a união
de tipo em `src/lib/progress/progressApi.ts` L27–28 e dois comentários em `src/lib/progress/badgeRules.ts` L16–17 e
L105.

## 1.2 Por eixo do S3

O S3 (`bar.md` L241–246) define três eixos. Medidos contra o que o servidor faz hoje:

### Percorrido — **registra de verdade**, mas só em binário

| Item | Estado |
|---|---|
| Sinal | `aula_iniciada` e `aula_concluida` → `aula_status` |
| Granularidade | **binária por aula**: `em_andamento` ou `concluido`. Não há posição no texto, tempo, bloco lido, nem retomada. `aula_status` tem `started_at`, `completed_at`, `updated_at` e nada mais (`app/db/models/progress.py` L87–118) |
| `aula_iniciada` | dispara na **montagem** do viewer (`AulaViewer.tsx` L65–84). Abrir a rota já é "percorrido". Não há sinal de leitura |
| `aula_concluida` | botão sem pré-condição. Nada no servidor nem no cliente exige ter percorrido o corpo antes |
| Proteção real que existe | `aula_iniciada` **nunca rebaixa** uma aula já `concluido` (CASE em `progress_service.py` L116–119) — corrigido depois de um defeito que apagava conclusão ao reabrir a aula (docstring L20–30) |
| Denominador disponível | **141 aulas**, todas com corpo (§1.3) |

### Praticado — **o servidor aceita e nunca recebe**

Este é o caso exato de "aceita mas nunca recebe":

| Item | Estado |
|---|---|
| Tipos de evento | `instrumento_usado` e `exercicio_respondido` **existem** no `CHECK` da tabela (`0004_progress.py`, `progress_event_type_check`) e passam a validação do router |
| Tabela derivada | **nenhuma**. Comentário explícito em `app/services/progress_service.py` L191: *"instrumento_usado / exercicio_respondido: log-only, no derived table."* |
| Leitura | **nenhuma**. `GET /me` não devolve nada sobre eles (L238–243). `ProgressEvent` aparece em `app/` só em `db/models/progress.py` (definição), `db/models/__init__.py` (reexport) e `services/progress_service.py` **L173, num `INSERT`**. Não há um único `SELECT` sobre `progress_event` em todo o `app/` |
| Emissão | **nenhuma** (§1.1) |
| Consequência | um evento de prática enviado hoje é gravado e fica **ilegível por qualquer rota**. O eixo Praticado não tem como ser exibido — nem com número, nem com lista |
| Teto potencial | 165 instrumentos e **214 exercícios** (medidos: soma de `exercicios.total_na_fonte` nos 17 `aparato.json`) |

O caminho está **preparado**, não construído: os índices para ler o log existem
(`0004_progress.py` L40 `progress_event_user_idx (user_id, occurred_at DESC)`, L42 `progress_event_type_idx
(user_id, event_type, entity_id)`) e `progress_event.metadata` é JSONB livre (`app/db/models/progress.py` L78–82,
docstring L24–27). Falta o endpoint de leitura e falta quem emita.

### Demonstrado — **não existe**

| Item | Estado |
|---|---|
| Tipo de evento de avaliação | **não existe**. Nenhum dos cinco `EVENT_TYPES` é avaliação |
| Campo de resultado | **não existe**. Não há `nota`, `score`, `acertos` nem `tentativa` em nenhuma das quatro tabelas. Só `metadata` JSONB, sem forma fixada |
| Entidade de competência | **explicitamente fora de escopo**, dito no próprio código: `app/db/models/progress.py` L24–27 e contrato L1000 |
| Tarefa portadora de evidência | **não existe** no produto. Nenhum componente do `src/components/alexandria/` corrige resposta; `ExercicioBlock` só revela/oculta gabarito (auditado em `src/lib/progress/badgeRules.ts` L105) |
| Quiz | a fonte tem quiz nos 17 módulos (`avaliacao`/`quiz` presente em todos os `aparato.json`), e **nenhum está no produto**. Mesmo quando estiver: **P5 — o quiz é resultado de avaliação, não Demonstrado** |

**Veredito do eixo:** o único texto honesto hoje é o que o S3 já escreve — **"Demonstrado: ainda não avaliado"**
(`bar.md` L248). Qualquer outra coisa é competência falsa (§6, `bar.md` L1258).

## 1.3 Os denominadores — e a divergência que a medição desfez

| Número | Valor medido | Onde |
|---|---|---|
| Aulas no catálogo | **141** | `src/lib/data/alexandria-trilhas.ts` L42–112, soma de `AULAS_POR_BLOCO` (9·10·10·7·6 + 6·7·7·8·9·8·8 + 8·8·9·10·11) |
| Aulas com corpo real no código | **141** | soma dos ids de `MODULO_NN_CORPO` nos 17 `src/lib/data/alexandria-modulo-NN-content.ts`: 9, 10, 10, 7, 6, 6, 7, 7, 8, 9, 8, 8, 8, 8, 9, 10, 11 |
| Módulos com conteúdo | **17 de 17** | `src/lib/data/alexandria-curriculo.ts` L19–105 (imports) e L112–130 (spreads): os dezessete `MODULO_NN_AULAS` entram em `AULAS` |
| Trilhas | 3 · 5, 7 e 5 módulos | `alexandria-trilhas.ts` L115–121, `TRILHA_ID_BY_LEVEL` |

**Divergência registrada.** `TOTAL_AULAS_EXTRAIDAS` (`alexandria-curriculo.ts` L214) vale **141**, não um número
parcial. Isso invalida duas cópias que ainda estão na tela:

- `src/pages/alexandria/AlexandriaRouter.tsx` L345–352 — a caixa *"Aula ainda não extraída … Hoje {N} aulas, em {M}
  dos dezessete módulos"* renderiza hoje **"141 aulas, em 17 dos dezessete módulos"** num ramo que nunca é
  alcançado, porque `aulaReal` nunca é `null` (o `getAula` resolve as 141). É um ramo morto que afirma escassez.
  *Peça C, registrado aqui porque contamina o denominador do Progresso.*
- `src/pages/alexandria/PerfilStub.tsx` L300 — `"{n} de {TOTAL_AULAS_EXTRAIDAS} confirmadas"`. Fora o número, a
  palavra: **"aulas confirmadas" é linguagem interna proibida ao learner** pelo S4 (`bar.md` L318).

**Consequência para o D1:** o denominador honesto é **141**, e o escopo é dizível sem ressalva —
"141 aulas do currículo". Não há mais a assimetria "catalogadas × abertas" que existia antes desta medição.

## 1.4 A sequência de dias — os dois defeitos, medidos no SQL

Achado já registrado em [`../movimento-e-conquistas/sistema-de-conquistas.md`](../movimento-e-conquistas/sistema-de-conquistas.md)
§2.4 (L173–184). Confirmado aqui na fonte:

**1. Fuso.** O dia é `CURRENT_DATE` do relógio do banco — `app/services/progress_service.py` L61, L62, L68, L69, L73,
dentro de `_STREAK_UPSERT_SQL` (L55–77). Não há conversão de fuso em lugar nenhum. Estudo às 22h em Brasília
(01h UTC do dia seguinte) **conta para o dia seguinte**; estudar 22h de segunda e 22h de terça registra dois dias
não consecutivos em Brasília como consecutivos em UTC, e o inverso também ocorre. A documentação do modelo
(`app/db/models/progress.py` L128–133) descreve o comportamento sem tratá-lo como defeito.

**2. Qualquer evento conta como estudo.** `record_event` chama `_upsert_streak` **incondicionalmente**, depois do
`if/elif` de tipo — `app/services/progress_service.py` L193, fora de qualquer ramo. O contrato confirma em
L1054: *"(every event type) Recomputes study_streak"*. Isso inclui `badge_conquistado`, que é um registro
automático emitido pelo próprio cliente (`badgeRules.ts` L246): **a máquina alonga a sequência do learner**.

**3. Terceiro defeito, não registrado antes: a sequência não tem data de fim.** `study_streak` guarda
`last_active_date` e `longest_streak_days`, mas **não** o dia em que a maior sequência terminou
(`app/db/models/progress.py` L136–147). Qualquer frase do tipo "maior sequência: 5 dias, até 12 de setembro"
seria dado inventado.

**Veredito:** `streak.atual` e `streak.maior` são números **errados por construção**, não aproximados. Exibi-los é
"dado falso como real" (§6, `bar.md` L1250). A correção é do CURSOR (`app/`), fora da posse desta peça.

## 1.5 Conquistas — 13 no código, 0 concedíveis

| Item | Medido |
|---|---|
| Insígnias no catálogo | **13** — `src/lib/data/alexandria-badges.ts`, ids em L31, 42, 55, 68, 80, 90, 101, 113, 124, 135, 148, 159, 170 |
| Regras com avaliação | **0**. `src/lib/progress/badgeRules.ts` tem 14 ocorrências de `avaliar:`, das quais **13 são `avaliar: null`** — uma por insígnia. `BADGES_SEM_REGRA` (L202) é, na prática, a lista inteira |
| Concessão real | `avaliarPorConclusao` devolve `[]` sempre (docstring L217–224); `concederBadges` nunca abre requisição (`AulaViewer.tsx` L99–103) |
| Consequência no servidor | a tabela `badge_award` está correta e idempotente (`progress_service.py` L148–157) e **nunca recebe linha**. O único caminho que a alimenta parte de uma regra que não existe |
| XP | **não existe campo no servidor**. `expReward` é dado do cliente (`alexandria-badges.ts` L35, 46, 59, 72, 84, 95, …), declarado pelo próprio arquivo como **não extraído** (L17: *"`category` e o `expReward` das entradas (B) são…"*). A tela imprime `+{expReward} XP` colado ao nome da medalha em `PerfilStub.tsx` L361 |

O catálogo proposto em [`../movimento-e-conquistas/sistema-de-conquistas.md`](../movimento-e-conquistas/sistema-de-conquistas.md)
§2 tem **30 modelos** (74 artes produzidas, série r04). Dele, a família CONCLUSÃO (§2.1) é **computável hoje** com
`aula_concluida` — 7 modelos, 29 instâncias — desde que a contagem venha da coleção e devolva "indisponível"
quando a reconciliação de P8 não estiver fechada. Nenhuma família de PRÁTICA, EXPLORAÇÃO ou HÁBITO é computável
hoje: todas dependem de eventos que ninguém emite (§1.2) ou de tipos de evento que ainda não existem no `CHECK`.

## 1.6 O que a superfície afirma hoje e a medição não sustenta

`src/pages/alexandria/PerfilStub.tsx` (704 linhas), lido inteiro:

| Linha | Afirmação na tela | Por que não se sustenta |
|---|---|---|
| L300 | `"{n} de 141 confirmadas"` | "confirmadas" é linguagem interna proibida (S4, `bar.md` L318) |
| L302 | `"Insígnias · {n} de 13"` | 13 é teto morto: 0 regras. O denominador promete uma progressão que não existe |
| L304–308 | `"Sequência · {atual} dia(s) · recorde {maior}"` | número errado por UTC e por contar qualquer evento (§1.4) |
| L298–338 | os quatro números em **quatro cards iguais** | parede de cards / dashboard (§6, `bar.md` L1248); e mistura evidência (aulas) com motivação (insígnias, sequência) numa fileira só, contra o S3 |
| L361 | `"{nome da medalha} · +{expReward} XP"` | XP é camada de motivação colada ao nome da conquista, e o campo não é persistido nem extraído |
| L539, L551, L574 | seção rotulada **"Certificado"**; `"Nível 1 · requisito cumprido"` | **P18: "Concluído", nunca "Aprovado"** — e "certificado" é afirmação de certificação sem regra. O brief da peça (`../../briefs/piece-D-perfil.md`) já registrou isto |
| L592–597 | `"{pct}% do caminho"` | percentual com escopo dito na mesma frase ("as {N} aulas da Trilha 1") — **passa** no S3, é o único percentual da tela que passa |
| — | "o que revisar" | **não existe em lugar nenhum**: nenhuma ocorrência de "revisar" em `components/alexandria/` ou `pages/alexandria/` |
| — | "Demonstrado" | **não existe em lugar nenhum** na superfície |

Ainda em pé no repositório: `src/lib/data/alexandria-progress-mock.ts`. O `PerfilStub` não o importa (lê
`getMyProgress`, L24), mas o arquivo existe e o brief da peça já o proibiu explicitamente.

---

# 2. GLOSSÁRIO — a cobertura real

Dado: `src/lib/data/alexandria-glossario.ts` (5.185 linhas). Tipo: `src/lib/types/alexandria.ts` L347–361.
Superfície: `src/components/alexandria/glossario/GlossarioView.tsx` (185 linhas) e `GlossaryTermCard.tsx`
(109 linhas), montadas por `src/pages/alexandria/GlossarioStub.tsx`.

## 2.1 Cobertura — 637 de 2.124

| | Medido |
|---|---|
| Termos na fonte (17 módulos) | **2.124** |
| Verbetes no código | **637** |
| Cobertura | **30,0 %** |
| Módulos com § Lex portado | **8 de 17** (M01–M08) |
| Módulos com aula portada | **17 de 17** (§1.3) |

**O glossário atrasa nove módulos em relação ao currículo.** As aulas dos M09–M17 estão na tela; o vocabulário
delas não está. Por módulo:

| Módulo | Termos na fonte | No código | Módulo | Termos na fonte | No código |
|---|---|---|---|---|---|
| M01 | 38 | **38** | M10 | 161 | 0 |
| M02 | 65 | **65** | M11 | 150 | 0 |
| M03 | 63 | **63** | M12 | 152 | 0 |
| M04 | 58 | **58** | M13 | 180 | 0 |
| M05 | 72 | **72** | M14 | 158 | 0 |
| M06 | 99 | **99** | M15 | 174 | 0 |
| M07 | 118 | **118** | M16 | 184 | 0 |
| M08 | 124 | **124** | M17 | 192 | 0 |
| M09 | 136 | 0 | | | |

Por território: **Território I 296 · Território II 341 · Território III 0**. O terceiro território não tem um
único verbete.

## 2.2 Âncora curricular — 119 de 637, e nenhuma vem da fonte

| | Medido |
|---|---|
| Verbetes com `aulaIds` não vazio | **119** (18,7 % dos 637; **5,6 %** dos 2.124) |
| Verbetes sem âncora | **518** |
| Pares termo→aula | **158** |
| Aulas distintas alcançadas | **47** de 141 |

Por módulo, a queda é brusca: M01 35/38 · M02 24/65 · M03 11/63 · M04 10/58 · M05 10/72 · M06 7/99 · M07 18/118 ·
M08 4/124. O M01 foi ancorado por varredura de corpo (Wave 8, método descrito em `alexandria-glossario.ts` L16–28);
os M02–M08, por âncora **estrutural** — o termo só ancora quando aparece em título, subtítulo ou cabeçalho de
seção (L44–52). A regra mais conservadora explica a queda, e o arquivo a declara.

**O achado que pesa mais:** **0 dos 2.124 termos da fonte declaram vínculo com aula.** Medido varrendo
`aula_ids`, `aulas`, `aula_vinculada` e `vinculos.*` em `glossario.termos` dos 17 `aparato.json` — zero em todos.
A própria extração diz isso por escrito:

- `extraction/m01/aparato.json`, `glossario.termos[0].vinculos.nota`: *"A fonte não liga termo a aula. aulaIds do
  código foram inferidos pela Wave 8 (varredura + leitura), não declarados pela fonte."*
- `extraction/m07/aparato.json`, `glossario.vinculo_aula_nota`: *"A fonte não declara vínculo termo→aula. `aulaIds`
  do código são derivados (Wave 34, âncora estrutural)…"*

**Consequência para o §0.** A exceção do teste anti-LMS (`bar.md` L99–100) exige **âncora curricular visível em cada
item**. Hoje a âncora existe em 119 itens e é **derivada pelo repositório**, não declarada pela fonte. Exibi-la sem
dizer isso cumpre a letra do gate e quebra o S4 (fonte à vista). A âncora tem de vir com a sua própria procedência.

## 2.3 Fonte — 0 de 637, porque o campo não existe

`GlossaryTerm` (`src/lib/types/alexandria.ts` L347–361) tem exatamente cinco campos: `id`, `term`, `unit`,
`definition`, `aulaIds`. **Não há campo de fonte.** Nenhum verbete pode exibir fonte hoje.

A fonte **existe e é conhecida para os 637**: cada verbete vem do § Lex de um módulo identificado, com seletor e
linha aproximada gravados em `origem` no `aparato.json` (ex.: `extraction/m01/aparato.json`,
`glossario.introducao.origem` → `section.aula(§ Lex) > p`, `linha_aprox: 2523`). O dado está a um campo de
distância; o que falta é o campo e a sua exibição.

## 2.4 Repetição — 87 excedentes, e **nenhuma duplicata**

| | Medido |
|---|---|
| Termos distintos (normalizando acento e caixa) | **550** |
| Grupos com o mesmo termo em mais de um módulo | **68** |
| Verbetes envolvidos | **155** |
| Excedentes (repetições além da primeira) | **87** |
| **Duplicatas puras** (mesmo termo *e* mesma definição) | **0** |
| Definições idênticas entre verbetes quaisquer | **0** |

Os campeões: `CCEE`, `ONS`, `PLD`, `submercado` e `garantia física` aparecem **4 vezes cada**. `PLD` está em
`gl-pld` (L283), `gl-m02-pld` (L661), `gl-m04-pld` (L1513) e `gl-m07-pld` (L3879) — **quatro** entradas, não três
como o D4 registrou (`bar.md` L1186).

**Isto muda a leitura do problema.** Não são 87 verbetes redundantes a fundir: são 87 **definições distintas do
mesmo termo, escritas por módulos diferentes** — o arquivo já defende essa decisão (L38–41: *"o mesmo termo pode ser
definido em § Lex de módulos diferentes com definição própria… são verbetes distintos, não duplicata a fundir"*).
O defeito não é o dado; é a **lista alfabética**, que põe quatro "PLD" em sequência sem dizer que são quatro olhares
sobre a mesma palavra.

**E as "518 repetições" do `bar.md` (L1166) não são verbetes repetidos.** São as **518 repetições da mesma frase de
ausência** — `GlossaryTermCard.tsx` L100–101, *"Definido no § Lex; nenhuma aula extraída trata o termo como assunto
central."* — renderizada uma vez para cada um dos 518 verbetes sem âncora (§2.2). É exatamente o que o S4 proíbe na
heurística L325: *"Ausência numa linha de metadado, sem repetir a mesma frase no viewport."*

## 2.5 Categoria — são **duas taxonomias**, não uma

| | Medido |
|---|---|
| Valores distintos de `unit` | **111** |
| Categorias usadas por mais de um módulo | **10** |
| Categorias com um único verbete | **44** |

Os 111 rótulos **não formam um léxico**. Há dois vocabulários incompatíveis no mesmo campo:

| Módulos | Categorias | Termos | Forma | Maior categoria | Categorias de 1 termo |
|---|---|---|---|---|---|
| M01 | 33 | 38 | micro-etiqueta por termo ("Corrente", "Instituição", "Contrato") | 2 | 28 |
| M02 | 34 | 65 | micro-etiqueta | 11 | 18 |
| M03 | 26 | 63 | micro-etiqueta | 9 | 13 |
| M04 | **4** | 58 | **família** ("Formação de preço e despacho") | 16 | 0 |
| M05 | **5** | 72 | família | 20 | 0 |
| M06 | **6** | 99 | família | 22 | 0 |
| M07 | **7** | 118 | família | 22 | 0 |
| M08 | **7** | 124 | família | 20 | 0 |

As dez categorias compartilhadas são todas do vocabulário antigo, e só entre M01–M03: *Instituição, Contrato,
Geração, Tarifa, Norma, Sistema, Preço, Operação, Encargo, Estabilidade*.

**Na fonte, a família existe para 14 dos 17 módulos** (M04–M17 declaram `familias`/`grupos`, ou `familia` por
termo, de 4 a 8 por módulo; M01–M03 declaram só `etiqueta` por termo). Ou seja: **o recorte por família é
sustentável para 1.958 dos 2.124 termos** e não é sustentável para os 166 do M01–M03 sem uma decisão de
agrupamento — que seria conteúdo novo e portanto exige revisão (P3/P11). Hoje, com 637 portados, o recorte por
família cobre **471** (M04–M08) e não cobre **166** (M01–M03).

## 2.6 A entrada é alfabética — FAIL automático

`GlossarioView.tsx` L62–74 monta `grupos` particionando o catálogo **pela letra inicial**, e L164–179 renderiza uma
`<section>` por letra. O catálogo já sai ordenado alfabeticamente da fronteira do dado
(`alexandria-glossario.ts` L5169–5171). São **23 letras iniciais distintas** (A–W, sem X, Y, Z) e **637 linhas**
abaixo delas, sem nenhum outro recorte.

Isso é o **T21** da varredura (`../../briefs/varredura-anti-ia.md` L40) e, antes disso, o hard gate **Consulta
morta** do `bar.md` L1259: *"Glossário com entrada alfabética"* — **FAIL automático**, não tique.

## 2.7 A segunda busca, e a primeira

`GlossarioView.tsx` L115–144 monta um **campo de busca próprio dentro da superfície**, enquanto o cabeçalho já
promete buscar (T20, `varredura-anti-ia.md` L39). O campo já foi corrigido na r07 para a forma de índice remissivo
— chamada impressa + fio de tinta, sem caixa e sem placeholder (comentário L107–114) — o que resolve o **T8** na
sua metade visual. O que **não** foi resolvido é a duplicação: continuam sendo **duas buscas concorrentes na mesma
tela**.

A busca em si é real (filtra termo, `unit` e definição, L44–53) — não é controle inerte. Mas o estado vazio
mente: L160 diz *"os 38 verbetes"* quando são **637**. Cópia fóssil da Wave 8.

---

# 3. BIBLIOTECA — 8 no produto, 427 na fonte

Superfície: `src/pages/alexandria/BibliotecaView.tsx` (292 linhas) e
`src/components/alexandria/biblioteca/FonteInstitucionalCard.tsx`.

## 3.1 O que está na tela hoje

| Bloco | Linhas | Conteúdo |
|---|---|---|
| Quatro instituições | L58–88, renderizadas em L185–195 | ONS, ANEEL, CCEE, EPE — **grade de cards de mesmo peso** (`repeat(auto-fit, minmax(250px, 1fr))`, L188) |
| Bibliografia do M01 | L99–152, renderizada em L211–255 | **8 referências**, verbatim do § Ref do M01 |
| Linha de cobertura | L167–170 | *"4 instituições · 8 referências catalogadas · 1 de 17 módulos com bibliografia extraída"* |
| Ausência | L261–286 | caixa tracejada "Documentos por aula — Ainda não existe" |

A linha de cobertura é **honesta e está certa** no que afirma. O problema é o que ela mede: 1 de 17.

Dois defeitos de gate visíveis sem medir nada: a grade de quatro cards iguais é a **parede de cards** do
§6 (`bar.md` L1259, *"Biblioteca como landing ou parede de cards"*), e a palavra **"extraída"** na linha de
cobertura é linguagem interna proibida pelo S4 (`bar.md` L318).

## 3.2 O que a fonte tem — 427 itens nos 17 módulos

Medido em `extraction/mNN/aparato.json` → `referencias` (`itens`, ou `grupos[].itens` em M02 e M03; M12 é array):

| Mód | Itens | Mód | Itens | Mód | Itens | Mód | Itens |
|---|---|---|---|---|---|---|---|
| M01 | 8 | M06 | 21 | M11 | 32 | M16 | 38 |
| M02 | 16 | M07 | 27 | M12 | 34 | M17 | 8¹ |
| M03 | 17 | M08 | 28 | M13 | 36 | | |
| M04 | 11 | M09 | 30 | M14 | 34 | | |
| M05 | 16 | M10 | 35 | M15 | 36 | **TOTAL** | **427** |

¹ **M17 não é comparável.** Os seus 8 itens são **blocos-parágrafo**, cada um agregando várias publicações descritas
por estrutura — `extraction/m17/aparato.json`, `referencias.nota_itens`: *"A fonte não lista referências individuais
com título/URL: são 8 parágrafos-bloco, cada um agregando várias publicações descritas por estrutura."* Fichas
individuais do M17 exigiriam desagregar o parágrafo, o que é conteúdo novo (S4/P3): **não fazer**.

Fichas individuais possíveis hoje: **419** (427 − 8 blocos do M17).

**Quantas fontes distintas há nas 419 — não medido.** A deduplicação entre módulos exigiria comparar por URL e por
norma citada, e três módulos (M06, M10, M12) não gravam o verbatim sob o nome `texto`, o que torna a comparação
global não confiável. Fica como trabalho da modelagem da ficha, e **não se estima aqui**: é plausível que ANEEL REN
1.000/2021 apareça em vários § Ref, e plausível não é medido.

## 3.3 Os campos do D5, medidos item a item

O D5 (`bar.md` L1192–1202) exige nove campos por fonte. Medidos nos 427:

| Campo do D5 | Itens que têm | % | Observação |
|---|---|---|---|
| **citação** (verbatim) | **337** | 79 % | `html`/`texto`/`li_html`. M06 (21), M10 (35) e M12 (34) usam outros nomes de campo — o verbatim existe, só não sob esse nome |
| **tipo** | **352** | 82 % | `tipo_fonte`, `tipo_declarado`, `categoria_fonte`, `tipo`, `rotulo`, `grupo` ou `bloco`, conforme o módulo. **Não é uma taxonomia**: são 30+ rótulos livres ("Lei · texto compilado", "Norma", "Painel", "Pendência declarada"…) |
| **instituição** | **221** | 52 % | 36 valores distintos. M03, M06, M09, M16 e M17 não nomeiam instituição por item |
| **última verificação** | **38 por item** (+ 7 módulos com data única no lede) | 9 % por item | Por item: M12 (34) e, parcialmente, M13 (2) e M17 (2). Por módulo: M07 "29 de julho de 2026", M08/M09/M10 "1º de agosto de 2026", M15/M16/M17 "4 de agosto de 2026" |
| **tema** | **61** | 14 % | Só M11 (32) e M15 (29) |
| **recorte** | **11** | 3 % | Só M04 (`titulo_ou_recorte`) |
| **o que responde** | **0** | 0 % | |
| **o que NÃO responde** | **0** | 0 % | |
| **onde é usada** (link para a aula) | **0** | 0 % | |

**As três ausências de 0 % estão declaradas pela própria extração**, em texto, e não são omissão do extrator:

- `extraction/m07/aparato.json`, `referencias.campos_ausentes_D5`:
  `["o que responde", "o que não responde", "tema", "recorte", "última verificação por item", "tipo de fonte"]`
- `extraction/m10/aparato.json`, `referencias.campos_ausentes`: *"Nenhuma referência declara «o que responde / o que
  não responde», tema ou última verificação individual; vale a data global do lede."*
- `extraction/m03`: *"Campos D5 (o que responde/não responde, recorte, última verificação) não existem na fonte."*
- `extraction/m09`, `m13`, `m17`: idem, com a mesma redação.

**"Onde é usada" é o campo mais grave, e é zero duas vezes:**

1. **Na fonte:** `vinculos.aulas_declaradas` está vazio em **todos os 427** itens. `extraction/m01/aparato.json`,
   `referencias.itens[0].vinculos.nota`: *"A fonte declara as referências no nível do módulo; nenhuma aponta aula."*
2. **No código:** `references: []` em **todas as 141 aulas** dos 17 arquivos `alexandria-modulo-NN-content.ts`
   (141 ocorrências de `references: []`, 0 não vazias).

**Consequência:** a única âncora sustentável para uma fonte é o **módulo**, e ela é 100 % conhecida (o item vem do
§ Ref daquele módulo). "Onde é usada · aula" é **"não declarado"** para as 427 — e o link "onde é usada → leva à
aula" do gate D5 **não pode ser cumprido nesta wave** sem inventar vínculo.

## 3.4 URL e domínio

| | Medido |
|---|---|
| Itens com `url` | **103** de 427 (24 %) |
| Itens com domínio citado em texto, sem `<a href>` | **11** com o campo `dominio_citado` preenchido sob esse nome |

O M01 é o caso-padrão do resto: `extraction/m01/aparato.json`, `referencias.itens[0].nota_campos` — *"a fonte só
escreve domínio em `<em>` (texto, sem `<a href>`, sem protocolo) — url fica null; dominio_citado é literal."*
A `BibliotecaView` **constrói** `https://${ref.dominio}` (L237) a partir de um domínio que a fonte escreveu como
texto. É a reconstrução de um link que a fonte não fez — funciona para os oito do M01, e não é generalizável.

## 3.5 O que falta para cada ficha cumprir o D5

Por campo, para as **419** fichas individuais:

| Campo | Situação | O que falta |
|---|---|---|
| instituição | 221 têm | 206 precisam de **"não declarado"**; nunca de inferência a partir do título |
| tipo | 352 têm, em 30+ rótulos livres | normalizar em **poucas classes** é decisão de vocabulário (revisável, P3). Até lá: exibir o rótulo literal da fonte |
| tema | 61 têm | 366 → **"não declarado"** |
| recorte | 11 têm | 408 → **"não declarado"** |
| última verificação | 38 por item; 7 módulos com data única | onde a data é do módulo, exibir **"verificada com o módulo em ‹data›"** — não como data da fonte |
| o que responde | 0 | **ausente na fonte.** Escrever isto é conteúdo factual novo → P3/P11. Fora desta wave |
| o que NÃO responde | 0 | idem |
| onde é usada | 0 | o módulo é sustentável e completo; a **aula** é "não declarado" para as 427 |
| citação | 337 sob o nome esperado | os 90 restantes (M06, M10, M12) têm verbatim sob outro nome — é trabalho de leitura do extrator, não de conteúdo |

---

# 4. RESUMO

## 4.1 Sustentado × não sustentado

| Afirmação | Veredito |
|---|---|
| "Percorrido: N de 141 aulas" | **sustentado** — com a ressalva de que "percorrido" hoje significa "a rota foi aberta" |
| "Praticado" com qualquer número | **não sustentado** — os eventos existem, ninguém emite, nada lê |
| "Demonstrado: ainda não avaliado" | **sustentado** — é a única frase possível |
| "Avaliação do módulo: X/10" | **não sustentado** — nenhum quiz no produto |
| "Sequência: N dias" | **não sustentado** — número errado por UTC e por contar eventos de máquina |
| "Maior sequência … até ‹data›" | **não sustentado** — a data não é guardada |
| "N de 13 insígnias" | **não sustentado como progressão** — 0 regras existem |
| "+N XP" | **não sustentado como persistido** — campo do cliente, não extraído |
| "Certificado Nível 1" | **não sustentado** — P18: "Concluído", nunca "Aprovado" nem "certificado" |
| "Glossário: 637 verbetes de 2.124 termos, 8 de 17 módulos" | **sustentado** |
| "Âncora curricular do verbete" | **sustentado só com a procedência à vista** — 119/637, todas derivadas pelo repositório, 0 declaradas pela fonte |
| "Fonte do verbete" | **sustentado** (§ Lex do módulo, 637/637) — falta o campo no tipo |
| "Biblioteca: 427 itens, 419 fichas possíveis, 17 de 17 módulos" | **sustentado** |
| "O que esta fonte responde / não responde" | **não sustentado** — 0/427, e escrevê-lo é conteúdo novo |
| "Onde esta fonte é usada · aula" | **não sustentado** — 0/427 na fonte, `references: []` em 141/141 aulas |
| "Onde esta fonte é usada · módulo" | **sustentado** — 427/427 |

## 4.2 Números que corrigem registros anteriores

| Registro anterior | Medido agora |
|---|---|
| `bar.md` L1186: *"«PLD» em 3 entradas"* | **4 entradas** (L283, L661, L1513, L3879 de `alexandria-glossario.ts`) |
| `bar.md` L1166: *"518 repetições"* | **0 verbetes duplicados.** 518 é o número de vezes que a **frase de ausência** é repetida (`GlossaryTermCard.tsx` L100–101) |
| Brief da peça: *"7 de 141 confirmadas"* na baseline | o denominador **141** está certo; o rótulo "confirmadas" é proibido pelo S4 |
| Premissa de que faltavam módulos no currículo | **17 de 17 módulos e 141 de 141 aulas** têm corpo no código. Quem atrasa é o **glossário** (8 de 17) |

## 4.3 Pendências que esta peça não pode resolver sozinha

| # | Pendência | Posse |
|---|---|---|
| 1 | Fuso da sequência (`CURRENT_DATE` → fuso do learner) | CURSOR — `app/services/progress_service.py` L55–77 |
| 2 | Só eventos de estudo alongam a sequência | CURSOR — `progress_service.py` L193 |
| 3 | Endpoint de leitura do log (`progress_event`) para "atividade recente" e "dias distintos" | CURSOR — os índices já existem (`0004_progress.py` L40, L42) |
| 4 | Emissão de `instrumento_usado` e `exercicio_respondido`, com `metadata` fixado | LYCEUM + CURSOR — contrato proposto em `../movimento-e-conquistas/sistema-de-conquistas.md` §2.2 |
| 5 | Tarefa portadora de evidência (Demonstrado) e regra de avaliação | fase Assessment & Competency Evidence (P18) |
| 6 | Campo de fonte em `GlossaryTerm` | dono do dado do glossário |
| 7 | § Lex dos M09–M17 → 1.487 verbetes que faltam | dono do dado do glossário |
| 8 | Modelo de dados de fonte (Biblioteca) com os campos do D5 e os "não declarado" | dono do dado da biblioteca |
| 9 | Reconciliação de título e contagem por módulo (**P8**) — bloco-11 tem divergência registrada em `alexandria-trilhas.ts` L66–71 | reconciliação separada; **"título a confirmar" não aparece na tela** |
| 10 | Remover `src/lib/data/alexandria-progress-mock.ts` | a peça, quando tocar o Perfil |
