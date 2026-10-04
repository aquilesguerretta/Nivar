# Wave 6 close — infrastructure deployment summary

## What Wave 6 was

The platform-wide infrastructure wave. Where Waves 1–5 built product
(Trader Nest, Atlas time-travel, AI Assistant, curriculum, simulators,
optimizers, live-data pipelines), Wave 6 built the meta-platform that
every future wave inherits: a design-vocabulary skill that loads on
every Claude Code session, an MCP server that grounds generation in
real tokens and primitives, a static auditor that gates anti-patterns
on every commit, a Playwright visual loop that catches what static
analysis can't, and a 99% CLAUDE.md trim with a canonical brief
template. After Wave 6 every future wave starts from the same
infrastructure floor.

## Briefs deployed

| Brief | Agent | Wave # (per-agent) | Deliverable |
| --- | --- | --- | --- |
| `gridalpha-terminal` skill | FOUNDRY | Wave 2 | `.claude/skills/gridalpha-terminal/` (SKILL.md + 6 references + EXAMPLES.md) |
| Tokens / primitives MCP server | ARCHITECT | Wave 3 | `tools/gridalpha-tokens-mcp/` (FastMCP server + 3 tools + watcher) |
| Playwright visual loop | CONDUIT | Wave 4 | `.mcp.json` + `.claude/commands/screenshot-loop.md` + `tools/screenshot-loop/` |
| `gridalpha-detect` CLI | CHROMA | Wave 5 | `tools/gridalpha-detect/` (10 rules + walker + reporter + husky integration + CI doc) |
| CLAUDE.md trim + brief template | FOUNDRY | Wave 3 | CLAUDE.md slim, `docs/brief-template.md`, `docs/brief-template-migration.md`, this wave-close doc |

Five briefs, four delivering tooling, one closing the loop.

## Infrastructure delivered

| Piece | Location | What it does |
| --- | --- | --- |
| Skill | `.claude/skills/gridalpha-terminal/` | Auto-loads design vocabulary every session. Six progressive-disclosure references (typography, color, composition, motion, density, antipatterns). Authoritative when CLAUDE.md and the skill conflict. |
| MCP server | `tools/gridalpha-tokens-mcp/server.py` | Three tools: `tokens_search` (resolves any C / F / R / S / T value), `primitive_lookup` (introspects FOUNDRY primitives — props, variants, JSX examples), `figma_reference_lookup` (queries `src/design/figma-reference/`). Cache + watchdog for live edits. |
| Auditor | `tools/gridalpha-detect/bin/gridalpha-detect.mjs` | 10 rules covering Tailwind-on-layout, default Inter, pure black/white, gradient text, bounce easings, decorative SVG, missing tabular-nums, pill chips, box-shadow on cards, equal-weight grids. Pre-commit hook at `.husky/pre-commit`. CI workflow documented (not yet deployed). Exit code 1 on P0. |
| Playwright loop | `.mcp.json` + `/screenshot-loop` | Playwright MCP screenshots at 1440×900, 1920×1080, 3440×1440. DOM-inspection fallback (`preview_eval` + `getComputedStyle`) is first-class — used heavily when the screenshot tool times out on Vite + Mapbox + Spline at 1920+. |

## CLAUDE.md trim metrics

| Stage | Lines | Notes |
| --- | --- | --- |
| Pre-Wave-3 | **3,907** | Six waves of cumulative documentation. Design rules, agent infrastructure notes, per-wave implementation logs. |
| Post-Phase 2 draft | 85 | Title, paragraph overview, active skill, active tooling, brand tokens cheat sheet, branch conventions, agent roster, quirks, wave status. |
| Post-Phase 6 (final) | **95** | Adds the FOUNDRY Wave 3 infrastructure-complete section. Under the 100-line ceiling the brief required. |

Reduction: **97.6%** (3,812 lines removed, 95 retained). The removed
content is preserved in:

- The `gridalpha-terminal` skill references for design rules
- Tool READMEs for infrastructure docs
- The source itself for per-agent implementation notes
- Commit history for everything else

Audit trail: `docs/claude-md-audit.md` documents every section's
disposition (KEEP / MOVE TO SKILL / CONDENSE / DELETE).

## Baseline at close

`gridalpha-detect` ran across `src/` at Wave 5 close:

| Severity | Count | Top rule(s) |
| --- | --- | --- |
| P0 | **40** | `no-pure-black-white` × 37 (legacy `#FFFFFF` literals in `LMPCard.tsx`, profile-form helpers, PDF helpers, Mapbox view props), `no-tailwind-on-layout` × 3 (inline `StatusDot` in `EveryoneNest.tsx`) |
| P1 | 0 | — |
| P2 | **22** | `equal-weight-grid` across most Nests, Analytics tabs (4 of 5), Vault, Trader Journal sub-views, Atlas EventReplayMenu |

The 40 P0 findings are real historical debt that hand-passes have
been catching ad-hoc. They become Wave 5.1 remediation candidates
(see "Forward look" below). The 22 P2 grid findings are
conversation-starters: each surface either marks its dominant focal
element (one-line attribute fix) or, if legitimately equal-weight,
suppresses with the `// gridalpha-detect-disable-next-line` directive.

Until Wave 5.1 lands, **commits to these surfaces must clear the
P0s on the modified files** — the pre-commit hook will block
otherwise. The P2 findings are warnings, not blocks.

## ETA — actual vs. planned

The original 3–4 week estimate isn't in my session context; I
deferred that line of the close summary to future-Aquiles to fill
in. From the commit log:

- FOUNDRY Wave 2 (skill) — 11 phases, single sitting
- ARCHITECT Wave 3 (MCP) — multi-session
- CONDUIT Wave 4 (Playwright) — multi-session
- CHROMA Wave 5 (detect CLI) — multi-session
- FOUNDRY Wave 3 (this) — 7 phases, single sitting

If the original estimate was 3–4 weeks for the full Wave 6 band,
the calendar elapsed should be visible in `git log --format="%ai"
on the FOUNDRY Wave 2 first commit through this Wave 3 final
commit — Aquiles can compute the actual delta when reading this.

## Forward look

### Wave 5.1 — remediation mini-wave (candidate)

The 40 P0 + 22 P2 audit findings invite a focused remediation
sweep. The work splits naturally:

- **`no-pure-black-white` × 37** — mechanical sweep replacing
  `'#FFFFFF'` / `'#000'` literals with `C.textPrimary` /
  `C.bgBase` / `C.textInverse` as appropriate. Two paths could
  ship this: a manual sweep (~1 sitting), or the auditor's
  proposed `--auto-fix` mode (CHROMA's future-work hook).
- **`no-tailwind-on-layout` × 3** — three call sites in
  `EveryoneNest.tsx`'s inline StatusDot. Trivial replacement.
- **`equal-weight-grid` × 22** — per-surface decision: mark
  dominant focal (`data-focal` attribute) or suppress via
  comment directive. Worth a per-Nest review by TERMINAL with
  CHROMA pairing.

Estimate: one wave-sized sitting if executed as a single sweep.
Should ship before Wave 7 surfaces start adding new code on top
of the legacy debt.

### Wave 7 — Developer Underwriting Calculator

The next product wave. A new tool inside the Developer Nest that
runs underwriting math (CapEx, LCOE, IRR, payback, sensitivity)
on a candidate IPP project given location, technology, MW size,
expected COD, and capacity-revenue assumptions. Mirrors the
Industrial Strategy Simulator pattern but for the developer
profile. Wave 7's brief will be the first to consume the new
template at `docs/brief-template.md` — that's also its
real-world validation pass.

## Wave 6 in one line

The platform now generates better UI without prompting, gates
worse UI before it ships, and starts every session with the same
design vocabulary loaded into context. Wave 7+ inherits all of
it automatically.
