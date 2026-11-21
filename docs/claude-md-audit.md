# CLAUDE.md content audit — FOUNDRY Wave 3 Phase 1

This is the categorization basis for the Wave 3 CLAUDE.md trim. The
current file is **3,907 lines**, grown across six waves. The target is
**under 100 lines** for context economy.

Disposition codes:

- **KEEP** — project-specific fact that belongs in CLAUDE.md (brand,
  paths, agent roster, branch policy, environmental quirks)
- **MOVE TO SKILL** — design principle now encoded in
  `.claude/skills/gridalpha-terminal/references/*.md` (the FOUNDRY
  Wave 2 deliverable). Deleting from CLAUDE.md does not lose the
  rule; the skill loads it on every session.
- **CONDENSE** — Wave 6 infrastructure block (FOUNDRY Wave 2,
  ARCHITECT Wave 3, CONDUIT Wave 4, CHROMA Wave 5) that's
  documented in tooling READMEs and skill files. Replace each with a
  one-line reference pointing at the tool location.
- **DELETE** — historical wave notes whose substance lives in commit
  log and code. Reading them does not help a new agent start work.

## Categorization table

| Lines | Section | Disposition | Target home |
| --- | --- | --- | --- |
| 1 | `# GridAlpha V2 — Design System Rules` (title) | KEEP | New CLAUDE.md title (renamed: "GridAlpha V2 — Project Context") |
| 3–10 | `## ACTIVE SKILLS` | KEEP (rewrite) | New CLAUDE.md |
| 12–15 | `## IDENTITY` | KEEP (compress to 1 line) | New CLAUDE.md |
| 17–20 | `## MANDATORY TOKEN FILE` | KEEP (1 line ref) | New CLAUDE.md |
| 22–28 | `## TYPOGRAPHY — NON-NEGOTIABLE` | MOVE TO SKILL | `references/terminal-typography.md` ✓ |
| 30–31 | `## EXCEPTION: HeroNumber primitive` | MOVE TO SKILL | `references/terminal-typography.md` ✓ |
| 33–87 | `## ONE PRODUCT, TWO SURFACES` | MOVE TO SKILL + 1-line note | Skill (composition / color) + CLAUDE.md mentions the editorial-vs-terminal split |
| 89–98 | `## COLOR — NON-NEGOTIABLE` | MOVE TO SKILL | `references/terminal-color.md` ✓ |
| 100–104 | `## SHAPE — NON-NEGOTIABLE` | MOVE TO SKILL | `references/terminal-color.md` (border-radius rules) ✓ |
| 106–109 | `## SPACING — NON-NEGOTIABLE` | MOVE TO SKILL | `references/terminal-density.md` ✓ |
| 111–115 | `## BORDERS` | MOVE TO SKILL | `references/terminal-color.md` ✓ |
| 117–123 | `## MOTION — NON-NEGOTIABLE` | MOVE TO SKILL | `references/terminal-motion.md` ✓ |
| 125–129 | `## LAYOUT-CRITICAL ELEMENTS` | KEEP (project-specific quirk) | New CLAUDE.md — this is enforced by `gridalpha-detect` rule `no-tailwind-on-layout` and survives as a one-line note |
| 131–135 | `## WHAT THIS PLATFORM IS NOT` | MOVE TO SKILL | `references/terminal-antipatterns.md` ✓ |
| 137–144 | `## CURRENT DESIGN TOKENS` | DELETE (redundant with tokens.ts + skill) | — |
| 146–225 | `## FOUNDRY CONTRACTS — REFERENCE` (80 lines of tables) | CONDENSE | One-line ref → "FOUNDRY primitives in `src/components/terminal/*`, mock data in `src/lib/mock/*`, types in `src/lib/types/*`. Query via the tokens MCP server." |
| 226–303 | `## ROUTING ARCHITECTURE — REFERENCE` (78 lines) | CONDENSE | One-line ref → "ARCHITECT routing: `src/main.tsx` registers routes, `src/components/GlobalShell.tsx` owns the spine." |
| 304–368 | `## AI ASSISTANT — ORACLE INFRASTRUCTURE` (65 lines) | CONDENSE | One-line ref → "ORACLE AI Assistant: `src/services/anthropic.ts` + `src/hooks/useAIChat.ts`. Needs `VITE_ANTHROPIC_API_KEY` in `.env.local`." |
| 369–510 | `## CONDUIT INFRASTRUCTURE — SAVED VIEWS & ANNOTATIONS` (142 lines) | CONDENSE | One-line ref → "CONDUIT saved views + annotations: `src/services/viewSerialization.ts` + `src/stores/{savedViewsStore,annotationStore}.ts`. localStorage-backed." |
| 511–636 | `## ALEXANDRIA CURRICULUM — SCRIBE INFRASTRUCTURE` (126 lines) | CONDENSE | One-line ref → "SCRIBE Alexandria curriculum: `src/lib/curriculum/*` + `src/stores/progressStore.ts`. Lesson + Entry schemas in `src/lib/types/curriculum.ts`." |
| 637–742 | `## VISUAL COHESION — APPLIED PATTERNS` (106 lines) | DELETE | Substance now in `references/terminal-composition.md` and the four-tier elevation in `references/terminal-color.md` |
| 743–849 | `## TRADE JOURNAL — FORGE INFRASTRUCTURE` (107 lines) | CONDENSE | One-line ref → "FORGE Trade Journal: `src/stores/journalStore.ts` + `src/components/nest/trader/journal/*`. localStorage-backed." |
| 850–1048 | `## ALEXANDRIA SUB-TIER 1A — RENDERER INFRASTRUCTURE` (199 lines) | DELETE | SCRIBE's Alexandria reference already captures the structure; deeper detail lives in `src/lib/curriculum/` |
| 1049–1173 | `## CHROMA WAVE 2 — VISUAL COHESION MAP` (125 lines) | DELETE | Audit complete, findings in `docs/wave-3-chroma-audit.md` |
| 1174–1290 | `## FORGE WAVE 2 — INDUSTRIAL STRATEGY SIMULATOR` (117 lines) | CONDENSE | One-line ref → "FORGE Industrial Strategy Simulator: `src/lib/simulator/*` + `src/components/nest/industrial/StrategySimulator/*`." |
| 1291–1422 | `## CONDUIT WAVE 2 — ANNOTATIONS ROLLOUT` (132 lines) | DELETE | Rollup complete, contract documented in CONDUIT condensed line above |
| 1423–1613 | `## ORACLE WAVE 2 — CONTEXTUAL AI ASSISTANT` (191 lines) | CONDENSE | Already implicit in the ORACLE one-liner; deeper detail in `src/services/aiContext.ts` + `src/services/contextProviders/*` |
| 1614–1796 | `## CONDUIT-2 — PDF EXPORT PIPELINE` (183 lines) | CONDENSE | One-line ref → "CONDUIT-2 PDF export: `src/services/pdfTemplates/*` + `src/services/pdfExport.ts`. `@react-pdf/renderer`." |
| 1797–1966 | `## ORACLE WAVE 3 — CURRICULUM GRADING` (170 lines) | CONDENSE | One-line ref → "ORACLE curriculum grading: `src/services/grading/*` + `src/services/lessonSummary/*` + `src/stores/gradingStore.ts`." |
| 1967–2144 | `## FORGE WAVE 3 — STORAGE DA BID OPTIMIZER` (178 lines) | CONDENSE | One-line ref → "FORGE Storage DA Bid Optimizer: `src/lib/storage/*` + `src/components/nest/storage/DABidOptimizer/*` + `StorageBidPackTemplate`." |
| 2145–2294 | `## CONDUIT WAVE 3 — CMD+P CONTEXTUAL INTELLIGENCE` (150 lines) | CONDENSE | One-line ref → "CONDUIT Cmd+P drawer: `src/services/cmdp/*` + `src/components/shared/CmdP*.tsx` + `src/stores/cmdpStore.ts`." |
| 2295–2481 | `## ATLAS WAVE 2 — TIME-TRAVEL SCRUBBER` (187 lines) | CONDENSE | One-line ref → "ATLAS time-travel: `src/lib/atlas/*` + `src/stores/timeTravelStore.ts` + `src/components/atlas/TimeTravel*.tsx`." |
| 2482–2563 | `## CHROMA WAVE 3 — VISUAL COHESION MAP UPDATE` (82 lines) | DELETE | Audit complete, findings in `docs/wave-4-chroma-audit.md` |
| 2564–2750 | `## CURSOR WAVE 5 — V2 BACKEND LIVE DATA` (187 lines) | CONDENSE | One-line ref → "CURSOR V2 backend at `gridalpha-v2-production.up.railway.app`. Contract: `docs/v2-backend-contract.md`. PJM auth via public APIM key (bootstrapped at boot, see contract)." |
| 2751–2926 | `## ORACLE WAVE 4 — STALE-DATA AWARENESS` (176 lines) | CONDENSE | One-line ref → "ORACLE freshness extension to AI context — `src/services/contextProviders/*` populate `visibleData.freshness` summaries." |
| 2927–3092 | `## FORGE WAVE 4 — LIVE DATA WIRE-UP` (166 lines) | CONDENSE | One-line ref → "FORGE live-data hooks: `src/hooks/data/*` + `src/services/api/*`. `VITE_MOCK_API` flips mock mode." |
| 3093–3218 | `## CHROMA WAVE 4 — LOADING, STALE, ERROR STATES` (126 lines) | CONDENSE | One-line ref → "CHROMA loading primitives: `src/components/terminal/{Skeleton,StaleBadge,ConnectionStatusDot,ErrorBoundaryFallback}.tsx`." |
| 3219–3365 | `## ATLAS WAVE 3 — REAL HISTORICAL DATA` (147 lines) | CONDENSE | One-line ref → "ATLAS real historical fetch: `src/services/api/atlasHistory.ts` + `src/hooks/data/useAtlasHistorical.ts`. V1 covers LMP only." |
| 3366–3446 | `## FOUNDRY WAVE 2 — GRIDALPHA-TERMINAL SKILL` (81 lines) | CONDENSE | One-line ref → "FOUNDRY skill at `.claude/skills/gridalpha-terminal/`. Skill auto-loads; references in `references/terminal-*.md`." |
| 3447–3473 | `## VISUAL FEEDBACK LOOP` (27 lines) | CONDENSE | One-line ref → "Visual loop: `/screenshot-loop` slash command via Playwright MCP in `.mcp.json`. Embed `tools/screenshot-loop/brief-template.md` in any UI-generating brief." |
| 3474–3589 | `## CONDUIT WAVE 4 — PLAYWRIGHT VISUAL LOOP` (116 lines) | CONDENSE | (Merged into the Visual loop one-liner above.) |
| 3590–3733 | `## ARCHITECT WAVE 3 — TOKENS/PRIMITIVES MCP` (144 lines) | CONDENSE | One-line ref → "Tokens MCP server: `tools/gridalpha-tokens-mcp/server.py`. Exposes `tokens_search`, `primitive_lookup`, `figma_reference_lookup`." |
| 3734–3907 | `## CHROMA WAVE 5 — GRIDALPHA-DETECT CLI` (174 lines) | CONDENSE | One-line ref → "Auditor: `node tools/gridalpha-detect/bin/gridalpha-detect.mjs src`. Pre-commit hook in `.husky/pre-commit`. Baseline: 40 P0 / 22 P2." |

## Summary

| Disposition | Section count | Approx. line saving |
| --- | --- | --- |
| KEEP | 5 | 0 |
| MOVE TO SKILL | 10 | ~140 |
| CONDENSE | 23 | ~3,400 (each multi-section block becomes one line) |
| DELETE | 7 | ~700 |

Target new CLAUDE.md size: **80–100 lines** including:

- Title + 1-paragraph project overview
- Active skills (1 line)
- Tokens MCP server (1 line + run command)
- Detect CLI (1 line + run command)
- Visual loop (1 line)
- Brief template pointer (1 line)
- Brand-tokens cheat sheet (4–6 lines)
- Branch convention (1 line)
- Agent roster (9 lines)
- Wave status table (6–10 lines)
- Project-specific quirks list (~6 lines)
- FOUNDRY WAVE 3 — INFRASTRUCTURE COMPLETE section (Phase 6 deliverable, ~10 lines)

## Migration verification checklist

Before deleting any section from CLAUDE.md:

- [ ] The substance of the section exists either in the skill,
  in a tooling README, or in the canonical file (e.g. `tokens.ts`)
- [ ] The new CLAUDE.md has a one-line reference pointing at that
  home
- [ ] No agent prompt or downstream tooling depends on the
  section being in CLAUDE.md (grep for `CLAUDE.md` references
  before deletion)

The KEEP items stay verbatim. MOVE-TO-SKILL items get a final
cross-check against the skill reference (already verified during
Wave 2 — the skill covers typography, color, composition, motion,
density, antipatterns). CONDENSE items get one-line stubs.
DELETE items vanish but their substance lives in commit history
and the agent-owned audit docs in `docs/wave-*-audit.md`.

## Phase 3 — side-by-side verification

After Phase 2 landed (commit `8b4afe5`), the new CLAUDE.md was
verified against the brief's five criteria:

| Criterion | Status | Notes |
| --- | --- | --- |
| Every KEEP item present | ✓ | Title, project overview, mandatory tokens (via brand-tokens table), layout-critical Tailwind rule (in quirks), branch convention, agent roster, wave status — all in. |
| No design-principle content remains | ✓ | Typography / color / shape / spacing / border / motion / anti-pattern rules all moved to the skill. Brand-tokens table is project-specific facts (which token = which hex), not design rules. |
| Under 100 lines | ✓ | 85 lines after Phase 2, leaving ~10–15 for Phase 6's Wave 3 docs section. |
| Every Wave 6 section condensed to one-line ref | ✓ | FOUNDRY skill (Active skill), Tokens MCP (Active tooling), Playwright loop (Active tooling), `gridalpha-detect` (Active tooling). |
| Reads as starting-point context | ✓ | A new agent reads: what the product is, where design vocabulary lives, what tooling to invoke, brand tokens cheat sheet, branch conventions, agent roster, project quirks, wave history. Under 60-second read. |

### Cross-reference scan

`grep -l 'CLAUDE\.md'` returns 13 files outside CLAUDE.md itself.
The references are documentation comments ("see CLAUDE.md") in source
and skill files, plus the audit doc itself. None depend on a specific
section being present — they rely on the chain CLAUDE.md → skill /
tokens / tool README, which is preserved.

### Decisions made during Phase 2

- Renamed title from "Design System Rules" to "Project Context"
  because the file no longer contains the design rules — the skill
  does. The new title accurately reflects what's in the file.
- Kept the brand-tokens table inline rather than pushing to the skill
  because new agents need the hex values at-a-glance before they
  open the skill's color reference, and the table doubles as the
  visual identity summary.
- `F.display` lock kept in CLAUDE.md (in quirks) rather than only in
  the skill because it's a hard project-specific rule about which
  two components are permitted; "borderline design rule" but the
  enforcement is project-scoped.
- "Where the old design content went" wrap paragraph kept short (3
  lines) — points to the audit + the wave-6-close doc as the
  archaeological record.
