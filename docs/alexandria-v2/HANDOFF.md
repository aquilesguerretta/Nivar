# Alexandria v2 — passagem de bastão (2026-09-17, ~05:45 ET)

Sessão encerrada a pedido do Founder, por limite de uso semanal. Este documento diz o que existe, o que falta e como
continuar.

## Onde está

- **Worktree:** `C:\dev\gridalpha-v2-alexandria-v2-restructure`.
- **Branch:** `wave/alexandria-v2-restructure`. Base `f89ac4f` (`origin/wave/nivar-g2-dream-build`). Sem upstream,
  **sem push**.
- **Commits locais:**
  - `f3f0f5e`: preflight, bar v1.1 e registro de proveniência;
  - `c351711`: North Star;
  - `0ac3446`: Peça A até a r04 (shell, Home, harness);
  - `19cf6b5`: extração dos 17 módulos, estudo de arquétipos, preparação das Peças B e D;
  - `cf88a78`: Peça A r05;
  - checkpoint final: este documento, a lista de features, a orquestração e os estudos de movimento e conquistas.
- **Nunca commitar** `.claude/launch.json`. Sempre `git add` com caminho explícito.
- **Dev server:** `npm --prefix C:/dev/gridalpha-v2-alexandria-v2-restructure run dev -- --host 127.0.0.1 --port 5311 --strictPort`.
  - Entrada "Alexandria v2 5311" em `C:\dev\.claude\launch.json`.
  - O app às vezes para o servidor: teste com curl antes de capturar.
- **Captura:** `node tools/alexandria-capture/capture.mjs --plan <plano> --out <dir> [--closing] [--only <regex>]`.
  - Planos em `docs/alexandria-v2/captures/{A,B,D}/plans/`.
  - A captura espera o decode das imagens; `--only` mescla a `legend.json`; o shell é medido por `data-shell`.
- **GPU (Blender):** sempre `python docs/alexandria-v2/media-lab/_ferramentas/gpu_lock.py -- <blender ...>`.
  - Se um lock ficar órfão em `%TEMP%/alexandria-v2-gpu.lock`, ele expira em 90 min.
- **Higgsfield:** o Founder comprou +2000 créditos e pediu para não economizar em qualidade. Registrar proveniência
  sempre.

## Documentos de referência (ler nesta ordem)

1. `docs/alexandria-v2/bar.md`: contrato v1.1 + adendo P17–P25. Gates × heurísticas.
2. `docs/alexandria-v2/decisoes/`: ambiguidades de conteúdo (P17–P24) e diretrizes da noite (movimento, medalhas,
   perfil, layouts por aula, features).
3. `docs/alexandria-v2/loop/piece-A.md`: histórico completo das rodadas r00–r05 e início da r06.
4. `docs/alexandria-v2/briefs/`: A (base, r02–r06), B (base) e D·Perfil (base).
5. `docs/alexandria-v2/critics/`: critic briefs de A, B e D·Perfil.
6. `docs/alexandria-v2/harness/sessao-de-teste.md`: fixture de rede só no harness; nunca login nem mock no produto.
7. `docs/alexandria-v2/content-qa.md`: erros de conteúdo que bloqueiam desenho (ex.: M14·A06 INST·07 1.000×).
8. `docs/alexandria-v2/FEATURES-PROPOSTAS.md`: lista para decisão do Founder.
9. `docs/alexandria-v2/orquestracao/`: scripts de workflow e críticos usados nesta sessão, reaproveitáveis.

## O que foi feito

| Frente | Estado | Onde |
|---|---|---|
| Fase 1: preflight, teardown, bar v1.1 | ✅ aprovado | `preflight.md`, `bar.md` |
| Harness de captura e critics | ✅ | `tools/alexandria-capture/`, `orquestracao/` |
| **Peça A · Home + shell** | 🟡 r05 no produto; r06 começou (só brief) | `src/components/alexandria/{home,shell,busca}`, `captures/A/r05` |
| Imagens reais com licença verificada | ✅ 107 aprovadas (revisão factual pendente) | `media-lab/fontes-reais/CATALOGO.md` |
| Extração da camada fonte, 17 módulos | ✅ verificada | `extraction/` (índice em `extraction/README.md`) |
| Estudo de arquétipos de aula | ✅ 10 arquétipos, mapa das 141 aulas, 6 protótipos | `estudos/aulas/SISTEMA.md`, `mapa-aulas.json`, `prototipos/` |
| Curadoria de imagens por aula | 🟡 M01–M15 com `plano.json`; **faltam M16 e M17**; algumas verificações | `media-lab/aulas/` (`ESTILO.md`, `mNN/plano.json`) |
| Sistema de movimento e de conquistas | 🟡 specs e protótipos prontos; medalhas e sequências do globo parciais; crítica final pendente | `estudos/movimento-e-conquistas/`, `media-lab/movimento-e-conquistas/` |
| **Peça B · Trilhas + mapa da Trilha I** | 🟡 mídia e composições prontas (comp-1 venceu); **integração no produto não começou** (o builder foi parado antes de editar) | `media-lab/B-r01/`, `briefs/piece-B.md`, `captures/B/` |
| **Peça D·Perfil** | ⚪ brief, plano e baseline prontos | `briefs/piece-D-perfil.md`, `captures/D/` |
| Peças C1 (módulo M01) e C2 (aula M01·A08) | ⚪ não começaram (extração, imagens e protótipo prontos) | — |
| Glossário e Biblioteca (Loop 2) | ⚪ | — |

**Peça A:**
- **Resultado atual (r05):** Brief FAIL (A1: lede × ganchos em E2b), System FAIL (A5: legenda entra depois e empurra
  a faixa 21px), Craft FAIL (o globo ainda lê como colagem sobre a gravura).
- **Às cegas:** vence o North Star 3×0 com margem clara desde a r03.
- **Maior lacuna da r06:** unidade de material globo × Titã (ver `briefs/piece-A-r06.md`).

## O que falta (ordem recomendada)

1. **Peça A r06**:
   - rodar `orquestracao/pieceA-r06-media.js` (três caminhos de unificação, julgamento cego contra a r05, portões de
     fidelidade);
   - builder: aplicar o vencedor + A1 + A5 + rótulo da ação com motivo + 390;
   - capturar `captures/A/r06` com `--closing`;
   - críticos (`orquestracao/critics-pieceA.js` + `build-blind.mjs r06`). Repetir até os três darem PASS.
2. **Peça B r01**:
   - rodar `orquestracao/pieceB-r01-integrate.js` (o builder lê `pieceB-r01-args.json`; ajuste o caminho do ARGS
     para `docs/alexandria-v2/orquestracao/pieceB-r01-args.json`);
   - capturar `captures/B/r01`;
   - pares cegos com `build-blind-gen.mjs B r01 pairs-B.json`;
   - críticos com `critics-piece.js` (piece B, `nsPanel` = `north-star-trilhas-panel.png`).
   - **Não rodar em paralelo com um builder da Peça A**: HMR e capturas no mesmo servidor.
3. **Peça D·Perfil**: mídia (medalhas + jornada) → composições → julgamento → builder → críticos, seguindo o
   brief.
4. **Fechar movimento e conquistas**:
   - completar as medalhas (série inteira, obtida × não obtida) e as sequências do globo (V1→V2→V3, chegada);
   - rodar o crítico de movimento;
   - integrar a chegada do globo na Home (rodada A) e a cunhagem na Peça D.
5. **Curadoria de imagens**: M16 e M17, mais as verificações que faltaram. Rever `media-lab/aulas/README.md`.
6. **Peças C1 e C2** (M01 e M01·A08):
   - arquétipo PRANCHA (`estudos/aulas/SISTEMA.md`);
   - extração `extraction/m01/`;
   - imagens `media-lab/aulas/m01/` e `fontes-reais/aula-m01-a08/`;
   - decisões P17–P21 (Desafio de decisão, previsão da camada Alexandria, FCap/FCarga, cenário didático);
   - antes: resolver o content QA do M01.
7. **Loop 2**: Glossário e Biblioteca.
8. **Revisão factual** (orquestrador ou Founder) de todos os assets com `factual_review` "pendente". Nada vai a
   build de produção antes disso (§7 M6).
9. **Backup dos originais de mídia** (~6 GB em `media-lab/`, fora do git): originais do Higgsfield não são
   reprodutíveis.

## Dependências e riscos registrados

- **Fundo branco antes do JS:** vem do `index.html` (ARCHITECT).
- **Backend (CURSOR):** registrar e persistir tentativas, "a revisar", avaliação, XP.
- **Página de trilha e módulo atual:** mostra progresso falso, que diverge da Home. A Peça B resolve a trilha; a
  Peça C, o módulo.
- **Aula atual:** 10px, tabela larga a 390, `aula_iniciada` duplicado e com 401 para visitante (Peça C).
- **"GridAlpha"** no corpo das aulas e no perfil (P24): troca editorial peça a peça.
- **Limite de uso:** 16 agentes em paralelo estouraram o limite de sessão. Rodar em lotes de 3.
