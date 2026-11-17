# Prompt — Alexandria v3, o trabalho mecânico

> Para colar num chat novo. Escrito em 2026-11-14 a partir do estado medido do repositório.
> **Este chat cuida de tudo que NÃO é visual.** O visual — layout, tipografia, cor, movimento, composição das
> telas — é de outro chat, conduzido pelo Founder em paralelo.

---

## Quem você é e o que é a Alexandria

Você é o agente LYCEUM, dono da Alexandria (`/alexandria`) no repositório NIVAR. A Alexandria é o currículo de
energia da NIVAR: **17 módulos, 3 trilhas, 141 aulas, 165 instrumentos, 2.124 termos de glossário, 214
exercícios**, extraídos de um HTML-fonte autoral e conferidos string a string.

A v2 (setembro de 2026) foi reprovada visualmente pelo Founder e está sendo redesenhada por outro chat. **O que
você herda dela e continua valendo é a camada de baixo:** a extração, o glossário extraído, a especificação dos
instrumentos, o backend de progresso, o harness de captura, o auditor e o sistema de arquétipos de aula como
estrutura (não como visual).

Leia antes de qualquer coisa:
- `AGENTS.md` e `CLAUDE.md` na raiz — as regras permanentes do repositório.
- `docs/alexandria-v3/pesquisa/CAMINHOS.md` — a pesquisa que redefiniu o produto (sete eixos, ~90 produtos).
- `docs/alexandria-v3/pesquisa/05-evidencia.md` — o que a literatura diz que funciona.
- `docs/alexandria-v2/bar.md` — o contrato antigo. **Os gates de verdade, acessibilidade e pedagogia continuam
  valendo** (S3, S4, S7, §6, §7, C3–C10); os gates de estilo visual, não.

---

## O que é seu e o que não é

**Seu:** dado, conteúdo, lógica, estado, eventos, backend, testes, e o mínimo de render honesto para provar que a
mecânica funciona.

**Não é seu:** qualquer decisão de aparência. Tipografia, cor, espaçamento, composição, ilustração, movimento,
transição, a Home, o desenho dos cartões da trilha, o desenho do instrumento. Se uma tarefa sua precisa de tela,
entregue a mecânica com **render mínimo e sem estilo próprio**, e deixe a aparência para o chat visual.

**A costura entre os dois chats** — é o que evita que vocês se atropelem:
- Exponha a mecânica como **hooks e módulos** em `src/lib/alexandria/` (ex.: `useLoopDaAula`, `usePrevisao`,
  `useRevisao`, `emitirPratica`), com tipos explícitos. O chat visual consome; você não toca na apresentação.
- **Trabalhe num worktree e numa branch próprios**, diferentes dos do chat visual. Duas sessões no mesmo
  worktree compartilham o index, e é assim que um commit carrega trabalho do outro (`AGENTS.md`, seção
  *Worktree por wave concorrente*).
- Antes de editar um componente de apresentação (`src/components/alexandria/**`), confirme com o Founder que o
  chat visual não está nele.
- **Não mexa na aba Atlas** (`/alexandria/atlas`). Decisão do Founder.

---

## Regras que não se negociam

- **Nenhum fato vem de fora da fonte.** O Founder proibiu pesquisa externa para material de ensino ou dado. A
  fonte única é `docs/alexandria-v2/extraction/mNN/` (e o HTML original em `C:/dev/GridAlpha v2/Alexandria
  modulos/`, só leitura). Onde a fonte não diz, a saída é ausência declarada — "não declarado", "ainda não
  disponível" —, nunca preenchimento por plausibilidade.
- **Nada de compra, assinatura ou criação de conta**, nem com cartão salvo.
- **Teto de 60% do limite semanal** (`get_usage`). Ao chegar perto, pare, commite e peça liberação ao Founder.
- **Git:** só commits locais, **nunca push**. `git add` sempre com caminho explícito, nunca `-A` nem `.`.
  **Nunca commite `.claude/launch.json`.** Nunca commite em `main`, `feature/full-shell-buildout` ou
  `wave/nivar-g2-dream-build`. Prefixo `lyceum:`.
- **Portões, a cada mudança de código:** `npx tsc -b` (nunca `--noEmit`) com 0 erros;
  `node tools/gridalpha-detect/bin/gridalpha-detect.mjs src` com 0 P0; `python -m pytest tests/ -q` quando
  tocar backend.
- **Migrations:** a cadeia do Alembic **fora** desta worktree vai até `0016_ariadne_close`; a worktree da v2
  parou em `0010`. Agentes do Codex trabalham em Argos e Ariadne e criam migrations. **Não crie revisão nova sem
  conferir `alembic heads` na base atual.** Prefira derivar do log a acrescentar coluna — foi assim que a
  sequência de dias foi consertada sem schema novo.
- **Verificação é por render e por teste, não por leitura de código.** Reporte falha como falha.

---

## O trabalho, em ordem

### 0 · Fundação de git — antes de tudo

A branch da v2 (`wave/alexandria-v2-restructure`, worktree `C:/dev/gridalpha-v2-alexandria-v2-restructure`)
está **49 commits atrás** de `origin/wave/nivar-g2-dream-build` e nunca foi integrada. Há **24 worktrees
abertas** no repositório.

**Combine com o Founder** antes de executar: a recomendação é abrir uma branch nova a partir da base atual e
trazer só o que sobrevive (extração, glossário, instrumentos, backend de progresso, testes, harness, auditor),
deixando a cartografia da v2 para trás. A cadeia de migrations precisa ser reconciliada nesse momento.

### 1 · Conteúdo do M01 — pré-requisito do resto

O Founder pediu o **Módulo 01 inteiro em qualidade final** como régua para os outros dezesseis. O inventário
completo está em `docs/alexandria-v2/m01/` (214 unidades verificáveis em quatro arquivos).

1. **Re-extrair as aulas A01–A07 e A09.** Só a A08 tem extração verificada (`extraction/m01/aula-08.json`). O
   corpo das outras oito vive apenas em `src/lib/data/alexandria-modulo-01-content.ts`, e o porte antigo
   **perdeu conteúdo que está no ar agora**: parágrafos terminando em "Veja:", "Por isso:", "Logo:" com nada
   depois (três listas `<ul>` não portadas), seis descrições de fórmula nulas, duas fórmulas da seção 5.3, a da
   8.2, dois de três parágrafos de um callout, três painéis, duas figuras, `</span>` órfãos. Siga o padrão do
   `aula-08.json`, com verificação de substring contra o HTML.
2. **Extrair a camada fonte dos INST·01 a 05** do M01, hoje com `fonte_extraida: false`, título nulo e entradas
   vazias.

### 2 · Eventos e progresso — o produto não sabe o que o learner fez

O backend já foi consertado (setembro): o eixo **Praticado** passou a ser legível e a sequência de dias deixou
de estar errada. **Falta o front.** Detalhes em `docs/v2-backend-contract.md` (seções de progresso) e em
`app/services/progress_service.py`.

1. **Emitir `instrumento_usado` e `exercicio_respondido`**, com `metadata.aulaId`. Hoje **nenhum arquivo do
   front emite esses eventos** — `InstrumentPanel.tsx` não tem callback de resultado e `ExercicioBlock.tsx`
   guarda a resposta em estado local e nunca a envia. Sem `aulaId` no metadata, o backend reporta a tentativa
   como "sem aula vinculada", corretamente.
2. **Parar de disparar `aula_iniciada` na montagem do viewer** (`AulaViewer.tsx`). Hoje "percorrido" significa
   literalmente "a rota foi aberta".
3. **`aula_concluida` com pré-condição** — hoje é um botão sem condição nenhuma.
4. **A aula-padrão (`AulaM01A08`) não emite evento nenhum.** Sem isso não há conclusão, conquista, fim de módulo
   nem retomada.
5. **Consumir os endpoints novos** em `src/lib/progress/progressApi.ts`: `GET /api/progress/streak`,
   `/pratica`, `/aulas/{id}/pratica`, `/pratica/entidades/{id}`. O tipo `StreakInfo` mudou: campos podem ser
   `null`, e **`semRegistro: true` é diferente de `atual: 0`** — o primeiro é "nunca estudou", o segundo é
   "estudou e a corrida quebrou". São frases diferentes na tela.
6. **Progresso fica atrás do cadastro** (decisão do Founder). Não guarde estado deslogado.

### 3 · Instrumentos — o ativo mais distintivo da Alexandria

Especificação completa dos 165 em `docs/alexandria-v2/extraction/instrumentos/` (`instrumentos.json`,
`PORTAR.md` com a ordem e o custo). Números que importam: **121 prometem desenhar uma forma, 53 a fonte já
desenha, 61 prometem e não desenham**; **78% têm 4 entradas ou menos**; **108 têm previsão escrita** e nenhuma
está ligada; **1 de 165 tem tolerância declarada**.

1. **Ligar a previsão.** O learner registra o palpite **antes** do resultado; depois vê previsto × calculado no
   mesmo cenário. A mecânica é sua; a aparência do quadro é do chat visual.
2. **O véu.** Tudo que permite ler **ou calcular** a resposta fica oculto até a tentativa — inclusive o
   enunciado. Dois casos já pegos: o Ato "META" da M01·A08 nomeia a resposta em negrito e a oferece como
   alternativa; uma aula do M13 pede a referência antes da tentativa. **Escreva um verificador** que procure a
   resposta nos nós de texto visíveis antes do registro — medindo por retângulo, porque o `innerText` do Chrome
   inclui `<text>` de SVG oculto.
3. **A armadilha da A05:** o cenário-padrão do INST·04 é idêntico ao enunciado do Ex·04, então abrir o
   instrumento entrega a resposta. Inverta a ordem — exercício primeiro, instrumento velado.
4. **Sem tolerância declarada, não há veredito "certo/errado"** — vale a autoavaliação em três níveis. Não
   invente tolerância.
5. **Gerar os dados das formas prometidas** (as séries e os pontos que cada figura precisa mostrar). O estilo do
   desenho é do chat visual.
6. **Corrigir o schema de unidade de saída** — só 68 das 580 saídas têm unidade declarada.
7. **Portar os 55 instrumentos que faltam** (M09, M13, M14, M16, M17), na ordem de `PORTAR.md`.

### 4 · Glossário

`docs/alexandria-v2/extraction/glossario/glossario.json` tem **2.124 verbetes**, conferidos com zero falha de
literal. O produto tem **637** (só M01–M08; Território III com zero).

1. **Portar os 1.487 que faltam** para `src/lib/data/`. A busca já fica no cliente — não precisa de backend.
2. **Depende de decisão do Founder** sobre os 184 termos repetidos entre módulos, todos com definições
   divergentes (`conflitos.json`). A fonte sustenta manter por módulo: o §Lex do M10 diz que termos só se
   repetem "quando este módulo lhes dá um sentido operacional distinto".
3. **Ligar os termos nas aulas.** O componente `<Termo>` existe em `tronco.tsx` e tem **zero usos** nos
   componentes de aula.

### 5 · Conteúdo que se conserta pela própria fonte

`docs/alexandria-v2/content-qa.md` e `docs/alexandria-v2/extraction/reconciliacao/DECIDIR.md`. Corrija **só a
classe [C]** — a correção sai da própria fonte (ex.: QA-M14-01, energia mil vezes menor, onde a fórmula exibida
na mesma aula dá o valor certo). **A classe [R] é do Founder** e você não propõe número.

### 6 · Conquistas

Só a família **CONCLUSÃO** é computável hoje (`aula_concluida` + data real em `badge_award.awarded_at`). As 13
regras de `src/lib/progress/badgeRules.ts` estão com `avaliar: null`. Ligue as de conclusão; as outras ficam
"em desenho". **Nenhuma conquista pode alegar competência** (contrato, S3).

### 7 · Revisão espaçada — só se o Founder aprovar

A pesquisa achou que a maior lacuna da Alexandria não é visual: **nada volta**. Espaçamento e recuperação, os
dois efeitos mais robustos da literatura, valem hoje zero. A proposta é uma "revisão do dia" alimentada pelos
próprios instrumentos, sem conteúdo novo. **Pergunte ao Founder antes de construir.**

### 8 · Testes e banco

Os 18 testes de integração de progresso (`tests/progress/`) **nunca rodaram** por falta de banco. Não procure
credencial e não aponte `DATABASE_URL` para o Railway compartilhado. Peça ao Founder um banco de teste.

---

## O que está esperando decisão do Founder

Não decida por ele. Pergunte, com as opções:

1. **QA-M01-A06** — a seção 6.1 diz "Grupo A ≥ 2,3 kV" e a 6.2 põe o subgrupo AS (< 2,3 kV) dentro do Grupo A.
   **Trava a aula A06 inteira.**
2. **QA-M01-A07** — "FP 0,85 → 15% reativos" está errado pelo triângulo da própria aula (≈ 53%). A frase
   substituta precisa da assinatura dele.
3. **QA-FCap-01** — três faixas de fator de capacidade em conflito (script, figura, glossário), e o produto usa
   hoje um limiar de 45% **que não existe na fonte**.
4. **Os 184 conflitos do glossário** — manter por módulo ou fundir.
5. **Âncora termo → aula** — nenhum aparato liga verbete a aula. Aceitar a ausência ou autorizar inferência
   rotulada como inferência.
6. **As 15 perguntas de `DECIDIR.md`.**
7. **Os 123 vereditos em prosa** que faltam — quem redige.
8. **A pergunta de decisão do caso Operação A** — a fonte não pede decisão; a frase é texto novo dele.
9. **A revisão factual das 107 linhas de mídia** em `media-provenance.md`. **Trava qualquer deploy.**

---

## Como reportar

Ao fim de cada etapa: o que mudou (arquivos), a saída real dos portões, o que você **não** fez e por quê, e o
que ficou esperando decisão. Uma afirmação de "funciona" vem com evidência — teste rodado ou render capturado.
