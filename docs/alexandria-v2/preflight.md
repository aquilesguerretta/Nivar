# Alexandria v2 — Preflight

Wave de reestruturação da Alexandria, Fases 2–3 do `design-loop`: Preflight + Teardown.
Data: 2026-09-16.

**Entregáveis:**
- este arquivo;
- [`bar.md`](bar.md) (v1.1, aguardando aprovação final do Founder);
- [`media-provenance.md`](media-provenance.md).

**Nenhuma mudança de produção foi feita.** Nenhuma mídia foi gerada.

## 1. Git / branch

| Item | Valor |
|---|---|
| Branch base | `wave/nivar-g2-dream-build` |
| SHA de origem da wave | `f89ac4ff6a03fe9a0c3618d9f667e318604364ef` (merge do PR #11) |
| SHA observado no início do preflight | `1dcd8c99d30b0cfea1d277fb01f2a61550b4fcc5` (merge do PR #10) |
| Diferença `1dcd8c9..f89ac4f` | Só `app/scripts/ingest_argos_ons_capacidade_geracao.py` e um teste. Nada da Alexandria |
| Branch de trabalho | `wave/alexandria-v2-restructure`, criada com `--no-track` (sem upstream) |
| Worktree | **Sim**: `C:\dev\gridalpha-v2-alexandria-v2-restructure` |
| Branch base local | `c1e2923` (atrás da origem). Não foi tocada |
| Árvore principal `C:\dev\GridAlpha v2` | Em `wave/production-stabilization` @ `2ded03d`, com 8 entradas sujas de outras sessões e do owner. Não foram movidas nem stashadas |
| Outros worktrees | `gridalpha-v2-nivar-g2` (1.289 entradas sujas), `gridalpha-v2-niv-37`, `gridalpha-v2-niv-38` (surgiu durante esta sessão), `gridalpha-v2-operador-api`. Nenhum foi tocado |

As 8 entradas sujas da árvore principal:
- `M .claude/launch.json`;
- `?? Alexandria modulos/`;
- `?? CODEX-OPERATING-PROTOCOL.md`;
- `?? data/Atlas references/`;
- `?? docs/atlas-country-coverage-inventory.md`;
- `?? docs/atlas-qualitative-enrichment-proposal.md`;
- `?? public/alexandria/gravuras/Alexandria_Bloco_4_Economia_de_Mercados_de_Energia_Completo.pdf`;
- `?? scratch/`.

**Paridade da Alexandria.** Entre `2ded03d` (árvore principal) e a base da wave, só mudaram `docs/g2-dream-build/*` e
`app/`. O `src/` da Alexandria é idêntico, então o render de produção (nivar.com.br, deploy de 13/09) vale como baseline.

**Divergência registrada.** O `AGENTS.md` manda derivar worktrees de `feature/full-shell-buildout`. Nesta wave
prevalece a instrução do Founder de derivar da Dream Build.

**Observações sobre o worktree.**
- Ainda não tem `node_modules` nem `.env.local`. Isso fica para a Fase 4 (renders).
- O HTML-fonte `Alexandria modulos/` não é versionado e **não existe neste worktree**. Ele é lido da árvore principal,
  só para leitura.

## 2. Preflight summary

### WORKING
- **Git e ramos:** medidos. `AGENTS.md`, `docs/worktrees.md` e `.agents/skills/design-loop/SKILL.md` foram lidos na
  ponta da Dream Build.
- **Código da Alexandria:** inspecionado por 5 leitores, com fatos citados por `arquivo:linha`. Cobriu shell, Home,
  trilhas, mapa, módulo, aula, instrumentos, jogo M08, glossário, biblioteca, Atlas, perfil, tokens, progresso e badges.
- **Fonte curricular:** os 17 HTMLs de `Alexandria modulos/` e o `catalogomodulosalexandria.md`. Totais reconciliados:

  | Item | Total |
  |---|---|
  | Aulas | 141 |
  | Instrumentos | 165 |
  | Termos | 2.124 |
  | Seções | 313 |
  | Exercícios | 214 |
  | Itens de checklist final | 423 |

- **Render de produção** (`nivar.com.br`, sem login):
  - a 1440×900: Home, mapa da T1, M02, aula M02·A04, glossário, biblioteca e Atlas;
  - a 390×844: Home, aula e mapa;
  - medições por DOM (scrollWidth, alturas, overflow).
- **Referências acessíveis:**
  - OWID: artigos, grapher renderizado, metadata;
  - NASA: brand e Appendix F;
  - Component Gallery;
  - Refero ×5, como teardown textual;
  - documentação do Motion.
- **Higgsfield:** catálogo atual de imagem e vídeo lido; plano ultra com 724,56 créditos. **Nenhuma geração.**

### LIMITED
- **Brilliant, Khan, Duolingo, DataCamp:** só texto público, blogs ou API Zendesk. A UI dentro do produto não foi vista.
- **Linear, Dovetail, Navbar Gallery, CTA Gallery:** só texto.
- **Economist:** guia de 2017, lido via espelho.
- **60fps:** só texto; os vídeos não foram assistidos.
- **Media.Work e Loadmo.re:** páginas com pouco conteúdo.
- **Screenshots do painel de navegador:** expiram quando o painel fica oculto. A Fase 4 precisa de captura confiável
  (ex.: Playwright no worktree).

### MISSING / BLIND SPOTS

| Lacuna | O que foi feito | Efeito nos critics |
|---|---|---|
| Screenshots do Founder não localizadas em disco | Usei a §1.3 do Reference Pack mais os meus renders | Brief critic parcialmente cego |
| Perfil e study rail exigem login | Não autentiquei, e o drawer não abriu visivelmente | Craft critic da Piece D cego até existir sessão de teste |
| HBS Simulations bloqueado (403) | — | Craft critic de jogos parcialmente cego |
| Imagem do North Star só existe no chat | Precisa ser salva em `docs/alexandria-v2/north-star/` antes da Fase 4 | Sem ela, não há comparação cega |
| Movimento de referência sem playback | Só filmstrip ou vídeo do nosso render | — |
| Viewports não medidos | 1280, 1920 e 3440 ficaram de fora | — |

Conteúdo ainda não extraído:
- quiz, caso, checklist final, erros, voz e referências por módulo;
- 55 instrumentos (M09, M13, M14, M16, M17);
- glossário de M09–M17.

Isso é dependência de extração, não limite do produto (bar §9).

### CURRENT PRODUCT FACTS (medidos)
- **Home.** Não tem próxima ação real: o CTA só rola a página. O centro visual é um H1 de 46px sobre o catálogo
  (17/3/141).
- **Progresso na Home e no trilho.** É um mock idêntico para todos, inclusive para quem não está logado: "12 de 42",
  "480 pontos", "2 de 13", "4 dias". O backend real (`/api/progress/*`, sem XP) só é lido pelo Perfil.
- **Registro de aprendizagem.**
  - As 13 regras de badge estão com `avaliar:null`.
  - `instrumento_usado` e `exercicio_respondido` nunca são emitidos.
  - "Concluir aula" não tem pré-condição.
- **Texto interno ou desatualizado visível ao learner:**
  - "outros catorze estão em produção";
  - "aulas confirmadas";
  - "extraídos do HTML do módulo";
  - "o backend não tem tabela de anotação";
  - "0 em produção".
- **Mapa.**
  - Coluna única de nós de 46px em zigue-zague fixo.
  - O trecho percorrido é igual ao não percorrido.
  - Não há "você está aqui".
  - Todo nó não iniciado diz "comece aqui".
- **Módulo.**
  - Sem "por quê", sem objetivos, sem avaliação.
  - Recursos anexados no fim, e só em M01–M09.
  - 119 exercícios de M10–M17 não aparecem.
  - O jogo existe só no M08, hardcoded.
- **Aula.**
  - "Vídeo em produção" (~170px) no topo de 141/141 aulas.
  - O instrumento vem sempre depois de toda a prosa.
  - 109 de 111 objetos de instrumento não têm previsão.
  - Todos os exercícios só têm "revelar gabarito" (214 na fonte, 215 atividades no código).
  - O fim da aula tem 3 avisos "ainda não existe".
- **Glossário.** 637 verbetes numa página de 75.758px; 81% sem âncora; sem filtro, sem detalhe, sem ligação
  aula → termo.
- **Biblioteca.** Hardcoded: 4 instituições e 8 referências, só do M01, sem "onde é usado".
- **Atlas.**
  - Objeto central com ~58% da altura do palco.
  - Zoom contínuo em 900ms.
  - Detalhe em 3 camadas, com fonte por campo.
  - Desconectado do currículo, com rótulos de 8–9px.
- **Responsividade.** Zero breakpoints de largura. A 390px:
  - a nav fica cortada;
  - a Home transborda (477px);
  - o instrumento transborda 176px.
- **Tokens.** Um só modo; uma exceção de raio não declarada (12px); `.alx-draw` definida e nunca usada.

## 3. Referências efetivamente abertas

| Grupo | Referências |
|---|---|
| Interno | Produção `/alexandria` (Home, trilha, módulo, aula, glossário, biblioteca, Atlas, perfil → `/entrar`); código `src/**/alexandria*`; `docs/alexandria/*`; 17 HTMLs-fonte; catálogo; `alexandria-tokens.ts` |
| Aprendizagem | **Brilliant:** home, courses, puzzle-science, science, faq, llms.txt, ustwo, Rive. **Khan:** 3 artigos via API + blog. **Duolingo:** 8 posts. **DataCamp:** home, tracks, skill tracks, 1 track, projects, 1 project, certification. **Maven:** home, projects, help, accelerator |
| Decisão | HBS case method (5 páginas); HBSP simulations **bloqueado** (substituto: harvardbusiness.org) |
| Evidência | **OWID:** 2 artigos, grapher, metadata, página Energy. **Economist:** guia de 2017 (espelho). **NASA:** brand e Appendix F |
| Navegação | Linear; Dovetail 3.0; Component Gallery (13); Navbar Gallery (4); CTA Gallery (3) |
| Editorial e movimento | Refero (Steep, Monad, Cursor, Ventriloc, Seline); 60fps (texto); Motion (3); Media.Work (2); Loadmo.re (2) |
| Mídia | Catálogo Higgsfield (imagem e vídeo) e saldo |

**Não abertos** (apoio para a Fase 4): Carbon, Coursera, Pageflows/Mobbin, skills de Emil Kowalski, Vercel
web-design-guidelines, plugin frontend-design.

## 4. Proposta de peças do Design Loop

**Loop 1** (dados reais de M01 e da Trilha 1; estados E0–E3 do bar §8)

| Peça | Escopo | Julgada por |
|---|---|---|
| **A · Entrada** | Marca, header e nav sem sidebar, gaveta contextual, nav mobile e Home | S*, A1–A6 |
| **B · Territórios** | As 3 trilhas como territórios e o mapa da Trilha 1 | S*, B1–B6 |
| **C · Módulo** | M01 como mission control | S*, C1–C2 |
| **C · Aula** | M01·A08, "Capacidade instalada e fator de capacidade" (INST·06) | S*, C3–C10 e Regra-mãe |

**Loop 2:** D · Progresso, Glossário e Biblioteca (S*, D1–D6).

**Tarefas separadas:**
- reconciliação da verdade curricular (P8);
- jogos dos 17 módulos (P4, P16): feitos à parte, um por um, fora desta wave (P25);
- extração do aparato do M01;
- dependências de implementação v2 (bar §9).
