# G2.3 — final integrated filesystem gates

Date: 2026-09-12. Repository: `C:\dev\gridalpha-v2-nivar-g2`. Branch: `wave/nivar-g2-dream-build`. Compared against HEAD `67f3074bd5197e2f18b9ea084501acf989c024e3` and the start-of-session manifests. This audit changed only files in this QA report directory. No stage, commit, backend request or browser action was performed.

## Final outcomes

| Gate / exact command | Outcome |
| --- | --- |
| `npm run build` | **PASS, exit 0.** Runs `tsc -b && vite build`. Vite 7.3.1 transformed 3,413 modules; built in 51.33 s. |
| `npx eslint src/components/g2 src/pages/br/EditorialPages.tsx src/pages/br/FamilyPages.tsx src/pages/br/G2Portal.tsx src/pages/conta-de-luz-express src/pages/diagnostico-energetico src/pages/solar-proposal-validator src/main.tsx` | **PASS, exit 0.** No remaining occurrences. |
| `node tools/gridalpha-detect/bin/gridalpha-detect.mjs src` | **PASS, exit 0.** 724 files scanned; **0 P0, 0 P1, 25 P2**. All P2 entries are informational `equal-weight-grid` occurrences outside the changed G2.3 surfaces. |
| `node docs/g2-dream-build/g2-3/qa/audit-boundaries.mjs` | **PASS, exit 0.** 209/209 Alexandria hashes match, no protected source changes, all 26 entry-route paths preserved. |
| Terminal tests, recorded by the Terminal agent after its final favicon integration | **PASS.** `node --experimental-strip-types --test tests/terminal-brasil/analysis.test.ts`: 8 tests passed, 0 failed. Not redundantly rerun in this audit. See `../terminal/implementation-and-qa.md`, final filesystem gate. |

The first integrated ESLint pass found two `react-refresh/only-export-components` errors on local `RouteLoading` and `TerminalRoute` functions in the root bootstrap. The root agent added narrow per-definition suppressions with the reason that these bootstrap helpers are not refresh boundaries. The exact scoped command above was rerun and returned exit 0. The post-build edits were those explanatory lint comments; runtime behavior was unchanged.

The production build emitted the same warning categories recorded in `../baseline/build-before.txt`: outdated Browserslist data; an existing CSS `//` comment warning; existing mixed eager/dynamic imports for TerminalBrasil and GridAtlasMap; and bundles exceeding 500 kB. These are not new G2.3 build failures. The auditor also emitted its known Node DEP0190 subprocess warning; no product finding accompanies it.

Selected resulting bundles: entry JS 3,310.89 kB (gzip 1,014.73 kB); lazy GlobalShell 4,706.64 kB (gzip 1,389.93 kB); lazy OperadorRouter 34.43 kB (gzip 11.60 kB); main CSS 488.00 kB (gzip 82.24 kB). These are build artifacts, not measured network or interactivity timings.

## Protected boundaries

`../baseline/alexandria-sha256.txt` contains 209 file paths. Each file was independently read and hashed with SHA-256. **All 209 match byte for byte; none is missing.** There are no added, modified or deleted Alexandria paths under `src/` or `public/` in Git status. The per-path expected and actual hashes are in `alexandria-hash-comparison.json`. Documentary screenshots or reports containing “alexandria” in their filename are correctly excluded from the protected runtime-path test.

The audit also inspected Git status for `app/`, `alembic/`, `migrations/`, `src/pages/operador/`, `src/components/operador/`, and shared `src/lib/types/`, `auth/`, `submissoes/`, `conversas/`, `diagnostico/`. Those scopes contain 113 tracked files in this checkout and **zero modified, deleted or untracked paths**. Backend, operator implementations, shared types, auth and API clients were not changed.

`src/main.tsx` is intentionally changed for authorized lazy loading of GlobalShell, the US landing and OperadorRouter. TypeScript AST comparison confirms:

- All 26 route paths remain in the same order.
- `/alexandria/*` still renders `<AlexandriaHome />` directly, with the exact same eager Alexandria import.
- The US/Vault paths retain their original paths and initial views; their elements are wrapped in the lazy terminal boundary. `/us` and `/operador/*` receive their corresponding Suspense fallback.
- The eager stylesheet order is explicitly `./index.css`, `mapbox-gl/dist/mapbox-gl.css`, then `./pages/operador/g2-operations.css`. The two package/operator side effects were made explicit when their owning JavaScript became lazy. `src/index.css` and the operator stylesheet themselves have no diff from HEAD. Alexandria's own CSS/tokens are covered by the matching hashes.

This is a source, route and byte-integrity contract check. It does not replace the root agent's browser verification of computed cascade or rendering.

## Changed-file inventory and preexisting owner work

The inventory uses the captured `../baseline/starting-worktree.txt`, which contains 867 preexisting status entries. Preexisting directory entries are expanded as path prefixes when classifying the current untracked files. This avoids attributing old review packages, captures or backups to G2.3. The initial owner's tracked change `docs/g2-dream-build/g2-1/material/nivar-material-study.blend` is explicitly excluded from this wave's inventory; its original content hash was not captured, so this report does not assert byte identity for that already-dirty file.

The machine-readable snapshot `boundary-and-inventory.json` includes the full paths and statuses, including active evidence files. At the snapshot: **39 runtime files**, **1 test file**, **16 public assets**, and no unclassified new paths outside `src/`, `tests/`, `public/`, `docs/`. Documentary evidence continues to grow while the root agent completes browser review; consult the JSON timestamp rather than treating that count as a frozen final deliverable count.

Runtime files attributable to this wave:

```text
src/components/g2/AdvisoryIntakeTheme.tsx
src/components/g2/Brand.tsx
src/components/g2/HeroFilm.tsx
src/components/g2/HouseChapters.tsx
src/components/g2/HouseFinale.tsx
src/components/g2/NivarShell.tsx
src/components/g2/advisory-intake.css
src/components/g2/hero-film.css
src/components/g2/house-finale.css
src/main.tsx
src/pages/br/EditorialPages.tsx
src/pages/br/FamilyPages.tsx
src/pages/br/G2Portal.tsx
src/pages/conta-de-luz-express/ContaDeLuzExpressPage.tsx
src/pages/diagnostico-energetico/DiagnosticoEnergeticoPage.tsx
src/pages/diagnostico-energetico/HistoricoDiagnostico.tsx
src/pages/solar-proposal-validator/SolarProposalValidatorPage.tsx
src/pages/terminal-brasil/TerminalBrasil.tsx
src/pages/terminal-brasil/sample.ts
src/pages/terminal-brasil/terminal-motion.ts
src/components/g2/AdvisoryExamination.tsx
src/components/g2/CopperStudy.tsx
src/components/g2/MethodWorkbench.tsx
src/components/g2/advisory-examination.css
src/components/g2/advisory-intake-format.ts
src/components/g2/copper-study.css
src/components/g2/g23-house.css
src/components/g2/method-evidence.ts
src/components/g2/method-workbench.css
src/components/g2/nivar-theme.ts
src/components/g2/use-nivar-favicon.ts
src/pages/br/g23-families.css
src/pages/terminal-brasil/AnalysisInstrument.tsx
src/pages/terminal-brasil/TerminalReading.tsx
src/pages/terminal-brasil/analysis-format.ts
src/pages/terminal-brasil/analysis.ts
src/pages/terminal-brasil/terminal-reading.css
src/pages/terminal-brasil/terminal-workspace.css
src/pages/terminal-brasil/workspace-state.ts
```

The new test is `tests/terminal-brasil/analysis.test.ts`. Public assets are limited to `public/g2/g23/brand/` (12 files), `public/g2/g23/finale/` (2 files), and `public/g2/g23/hardware/` (2 files). No asset from the preserved Alexandria tree appears in that inventory.

## Scope of confidence

These gates cover the current integrated source tree and generated production bundle. They do not claim real backend upload/email delivery, a new production deployment, or a browser retest of changes not yet reviewed by the root agent. Prior isolated client interactions and their limitations are documented in `../evidence/client/independent-browser-qa.md` and `../research/client/implementation-record.md`.
