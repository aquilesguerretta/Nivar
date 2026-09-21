# BRIEF TEMPLATE — Wave N — [AGENT NAME] Wave M

The canonical brief shape for every Wave 7+ deployment. Copy this
file, replace bracketed placeholders, and remove sections that don't
apply. Keep the section order — agents scan briefs in this order and
break flow if it changes.

The template inherits four pieces of infrastructure that every fresh
session loads automatically:

- `.claude/skills/gridalpha-terminal/` — design vocabulary skill
- `.mcp.json` — Playwright MCP for visual loop, Tokens MCP for tokens / primitives lookup
- `.husky/pre-commit` — `gridalpha-detect` audit gate
- `docs/brief-template.md` — this template

Briefs that follow the template inherit all four automatically.

---

## Session start

Start a fresh Claude Code session in the project root before
beginning Phase 1. This ensures:

- `gridalpha-terminal` skill description loads into context
- `gridalpha-tokens` MCP server is available (`tokens_search`,
  `primitive_lookup`, `figma_reference_lookup`)
- Playwright MCP server is available for the visual loop
- The pre-commit hook will run `gridalpha-detect` on each commit

Confirm by running `/mcp` and inspecting the loaded-skills list
before Phase 1. If anything's missing, restart the session — don't
proceed.

---

## About the pattern

[Two-paragraph philosophical foundation — why this wave matters and
what changes for users or for future work. Keep it short; the agent
already understands GridAlpha. Focus on what's new and why it's
load-bearing.]

[Second paragraph: the specific concrete value the wave delivers.
What surface or capability ships? What does the operator gain?]

---

## Your exact ownership

CREATE OR MODIFY ONLY these paths:

- `[path/to/file-1.ts]` (NEW)
- `[path/to/file-2.tsx]` (extend)
- `[path/to/file-3.md]` (NEW)

NEVER MODIFY:

- `[path/to/locked-area-1/]` — owned by [AGENT]
- `[path/to/locked-area-2/]` — owned by [AGENT]

Staging discipline (mandatory):

- Stage paths explicitly: `git add <specific-path>`
- **Never `git add -A` or `git add .`** — Wave 6 saw cross-attribution
  when multiple agents shared the workspace and pre-staged files
  got pulled into an unrelated commit. The commit message becomes
  misleading and the affected agent loses authorship credit.
- One commit per phase. Push immediately after each commit so other
  agents on the same branch see your work.

---

## Predecessor dependencies

[List which prior waves' deliverables this wave depends on. For each,
state the specific contract or artifact you'll consume. "None" if
the wave is standalone.]

- **[Agent Wave N]** — [what you consume, e.g. "the new `Foo` type
  added in `src/lib/types/foo.ts`"]
- **[Agent Wave N]** — [...]

---

## Pre-implementation query

Before writing code that touches design-system surface area, query
the tokens MCP server:

> Use `tokens_search` to resolve any color, spacing, or typography
> value you'll use. Use `primitive_lookup` for any component from
> `src/components/terminal/`. If your phase references a Figma
> reference file, query `figma_reference_lookup` first.
>
> Token-grounding requirement: every hardcoded color, px value, or
> font value in your diff must trace back to a token returned by
> `tokens_search`. Same for any FOUNDRY-primitive usage — the prop
> names and types must match the `primitive_lookup` response.

If you discover a value you need that isn't in `tokens.ts`, that's
a token gap — flag it to FOUNDRY in the commit message, then either
wait for the token to land or pick the closest existing token and
document the deviation.

---

## Your deliverables — in strict order

Numbered phases. Each phase ends with the exact commit message prefix
and subject.

### Phase 1 — [Name]

[Description of what to build / change.]

[Acceptance criteria: explicit, testable.]

```
<agent>: <subject for phase 1>
```

### Phase 2 — [Name]

[...]

```
<agent>: <subject for phase 2>
```

(Continue for as many phases as the wave requires.)

---

## Phase N — Generate, screenshot/inspect, audit, iterate

**Embed this phase block after any phase that produces or modifies
visible UI.** Skip it for type-only changes, pure-data files, or
backend wiring that doesn't change what the user sees.

After implementing the component above:

1. **Run `/screenshot-loop` at 1440×900, 1920×1080, 3440×1440.**
   OR fall back to DOM inspection via `preview_eval` reading
   `getComputedStyle()` at the same viewports when the screenshot
   tool times out (Vite + Mapbox + Spline at 1920+ frequently
   does — DOM inspection is a first-class backup, not a workaround).

2. **List any visual issues found in each viewport** against:
   - the task design intent (the brief above)
   - `.claude/skills/gridalpha-terminal/references/terminal-antipatterns.md`
   - `.claude/skills/gridalpha-terminal/references/terminal-composition.md`
   - `.claude/skills/gridalpha-terminal/references/terminal-density.md`

3. **Revise the code to fix every issue identified.**

4. **Run `gridalpha-detect` on the modified files:**

   ```sh
   node tools/gridalpha-detect/bin/gridalpha-detect.mjs <changed-files>
   ```

   Fix any P0 violations (blocks). Document P1+ findings in the
   commit message body if you choose to defer them.

5. **Repeat steps 1–4 until all three viewports pass every check
   AND `gridalpha-detect` reports zero P0.**

6. **Paste the final three screenshots (or the DOM-inspection
   findings) into the turn before you commit.**

7. **Reference them in the commit message.**

DO NOT declare the phase complete until step 5's condition is met.

(Embedded from `tools/screenshot-loop/brief-template.md`. If the
canonical block changes there, update this template too.)

---

## Absolute rules

- **DO NOT create a PR.** Continue on `feature/full-shell-buildout`.
- **DO NOT push to `main`.**
- **DO NOT `git add -A` or `git add .`** — stage paths only.
- **ALL changes pass these gates before commit:**
  - `npx tsc --noEmit` (if the diff touches `.ts` / `.tsx`)
  - `node tools/gridalpha-detect/bin/gridalpha-detect.mjs <files>` (zero P0)
  - Screenshot loop or DOM-inspection check at three viewports (for
    UI-generating phases)
- **DO NOT skip hooks** (no `--no-verify`) unless the user explicitly
  requests it. Legitimate bypasses: merge conflict resolution, mass
  refactor with follow-up commit, CI hot-fix. Everything else either
  fixes the violation or uses a per-line `// gridalpha-detect-disable-next-line <rule-id>` directive.

---

## Success criteria

- [Specific testable conditions at wave close. Each line is
  verifiable independently.]
- Final `gridalpha-detect` report attached to the wave close report
  (paste the run output into the chat that closes the wave).
- Screenshots or DOM-inspection findings for every UI-generating
  phase posted in chat alongside the final commits.
- All commits use the `<agent>: <subject>` prefix convention.
- No commits to `main`; everything on `feature/full-shell-buildout`.

---

## Wave-close report

After the final phase commits, post a wave-close summary to chat:

- Final commit list (commit SHAs + messages, in order)
- Final `gridalpha-detect` audit run
- Screenshot links (or DOM-inspection findings table)
- Any deferred P1+ findings, with a one-line rationale per finding
- Any token / primitive gaps discovered that FOUNDRY should fill
- Forward look: which downstream wave consumes this work

That's the artifact Aquiles uses to confirm the wave is done.

---

## Acknowledgment

Before beginning Phase 1, acknowledge in chat that you've read:

- this brief in full
- the four predecessor sections you depend on (named in
  "Predecessor dependencies" above)
- `CLAUDE.md` (the current ~100-line project context file)

Then proceed.
