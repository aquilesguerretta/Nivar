# Brief template migration notes — FOUNDRY Wave 3 Phase 5

The Wave 7+ brief template (`docs/brief-template.md`) consolidates
patterns the Wave 6 deployment surfaced. The four Wave 6 briefs
themselves (FOUNDRY Wave 2, ARCHITECT Wave 3, CONDUIT Wave 4, CHROMA
Wave 5) were authored before the template existed and therefore
diverge from it in places.

This doc catalogs the divergences. Shipped briefs are **permanent**
and **must not be rewritten** — this is a reference for
future-Aquiles when starting from an old brief as a template for a
new one. Carry the new template's pattern forward; treat old briefs
as artifacts.

## Audit method

I executed FOUNDRY Wave 2 myself, so I have full text of that brief.
For ARCHITECT Wave 3, CONDUIT Wave 4, and CHROMA Wave 5 I do not have
the original brief text in this session; the audit below is inferred
from each wave's CLAUDE.md section, commit log, and the shipped tool
README. Where I'm uncertain, I mark "inferred" so future-Aquiles
knows to treat the row with calibrated skepticism.

## Discrepancy table

| Template section | FOUNDRY Wave 2 | ARCHITECT Wave 3 (inferred) | CONDUIT Wave 4 (inferred) | CHROMA Wave 5 (inferred) |
| --- | --- | --- | --- | --- |
| Session start (fresh session, `/mcp` check) | absent | absent | absent | absent |
| About the pattern (2-paragraph philosophy) | present (re: Skills mechanism) | present (re: ui-ux-pro-max MCP analog) | present (re: visual feedback loop) | present (re: impeccable detect analog) |
| Your exact ownership (CREATE / MODIFY / READ-ONLY) | present | present | present | present |
| Staging discipline (no `git add -A`) | absent | absent | absent | absent |
| Predecessor dependencies | absent (Wave 1 mentioned in prose) | absent | absent | absent |
| Pre-implementation tokens MCP query | N/A (Wave 2 built the skill; tokens MCP didn't exist) | self-referential (built the MCP) | N/A (built the loop) | present in spirit (rules encode the skill) |
| Phase-by-phase deliverables with commit messages | present (11 phases, all with prefix) | present (inferred from commit log) | present | present |
| Screenshot-loop phase block | absent (Wave 2 was pure docs) | absent | present (Wave 4 *defines* the block) | absent (Wave 5 is CLI, no UI) |
| Audit gate (`gridalpha-detect`) | absent (didn't exist) | absent (didn't exist) | absent (didn't exist) | self-referential (built the gate) |
| Absolute rules (no PR, no main, no `-A`, gates pass) | partial (no PR, no main; no `-A`, no audit) | partial | partial | partial |
| Success criteria | present | present | present | present |
| Wave-close report shape | informal | informal | informal | informal |

## Per-brief notes

### FOUNDRY Wave 2 (gridalpha-terminal skill)

- 11 phases, every phase paired with an explicit `foundry: <subject>`
  commit message. Template-compliant on that front.
- Phase 9 "skill activation verification" specified "open a fresh
  Claude Code session" — but the executing agent could not actually
  do that from within its current session, so the verification was
  partial (structural validation + in-session generation test). The
  new template makes the fresh-session requirement explicit at the
  top (Session start) so it doesn't get buried mid-wave.
- "DO NOT install impeccable, ui-ux-pro-max..." absolute rule was a
  guardrail against the wrong-aesthetic class of skills. The new
  template doesn't generalize this; future briefs should add it
  inline when relevant.
- No `git add -A` discipline was not explicitly forbidden. Wave 2
  Phase 7 (the antipatterns commit `2f58eff`) accidentally swept in
  ARCHITECT Wave 3's `tools/gridalpha-tokens-mcp/` files because they
  were pre-staged in the shared workspace. The new template's
  staging-discipline rule is a direct response.

### ARCHITECT Wave 3 (tokens/primitives MCP) — inferred

- Built `tools/gridalpha-tokens-mcp/` end-to-end including server
  source, three tool modules, watcher, README, configuration doc,
  and test suite. Commit log shows phase-aligned work consistent
  with a structured brief.
- Predecessor dependencies (FOUNDRY's primitives, tokens.ts) are
  consumed but not formally enumerated in the wave doc.
- No fresh-session / staging discipline rules visible in the shipped
  artifacts. (Inferred.)

### CONDUIT Wave 4 (Playwright visual loop) — inferred

- Built `.mcp.json`, `.claude/commands/screenshot-loop.md`, and
  `tools/screenshot-loop/brief-template.md`. The brief-template
  inside that wave's deliverable is the canonical phase block the
  new template embeds.
- The wave's documentation note (CLAUDE.md lines 3539–3551) explicitly
  documents a deviation from the original brief: the brief said
  `~/.claude.json`; CONDUIT used `.mcp.json` instead with rationale.
  This is the kind of decision a wave-close report should capture —
  the new template's "Wave-close report" section calls it out.

### CHROMA Wave 5 (gridalpha-detect CLI) — inferred

- Built `tools/gridalpha-detect/` end-to-end with 10 rules, walker,
  reporter, husky integration, CI doc, README, and `package.json`.
  Phase 11 (per the CLAUDE.md section "Final audit baseline")
  produced the 40 P0 / 22 P2 measurement that's now the Wave 6
  baseline.
- The audit baseline is documented in CLAUDE.md but the brief itself
  may not have specified the format. The new template's "Wave-close
  report shape" subsection makes this a first-class deliverable.

## What carries forward

If a future brief borrows from any of the four Wave 6 briefs, the
author should:

1. Add the **Session start** section (fresh session, `/mcp` check).
2. Add the **Staging discipline** rule under "Your exact ownership".
3. Add the **Pre-implementation tokens MCP query** if the work
   touches design-system code.
4. Embed the **Screenshot-loop phase block** after any UI-generating
   phase.
5. List **Absolute rules** as four explicit lines including the
   audit gate.
6. Make the **Wave-close report** a first-class final-phase
   deliverable (not a casual chat message).

What stays the same: the per-phase structure, the commit-message
prefix discipline, the explicit ownership boundaries.

## What was right about the Wave 6 briefs

These patterns survived from Wave 6 and are in the new template:

- Numbered phases with one commit per phase, prefix-tagged commit
  messages.
- Explicit CREATE / MODIFY / READ-ONLY ownership tables.
- "Predecessor dependencies" was informal in Wave 6 but the *intent*
  was always there — agents knew what they consumed. The template
  just formalizes it.
- Two-paragraph philosophical opening so the agent understands the
  why before the what.
- Absolute rules ending each brief.

## Open questions

- **Brief versioning.** As the template evolves, briefs from
  different template versions will coexist. Should the brief carry
  a `Template version: X` line? Probably yes, but not in scope for
  Wave 3.
- **Wave numbering reconciliation.** The platform mixes per-agent
  wave counts (FOUNDRY Wave 2, CHROMA Wave 5) with platform-wide
  wave bands (Wave 6 closed). The new template uses the per-agent
  numbering in the title (`Wave N — [AGENT] Wave M`). If platform-wide
  numbering becomes primary, revise.
- **Skill / MCP / detector versioning.** When the skill or auditor
  changes, briefs that depend on specific rule-IDs or token names
  go stale. No mechanism yet for cross-referencing. Probably worth
  a future wave.

These are notes for future-Aquiles, not blockers for the current
template.
