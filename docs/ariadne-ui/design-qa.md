# Ariadne Quiet Professional — isolated UX QA

2026-11-17. Bounded engineering contribution for Ariadne Product Lead review and Founder approval. No product redesign, merge, deployment or canonical gate change.

## Source and ownership

Branch `wave/ariadne-ux-isolated` starts at corrected PR #30 head `9db8ce19fc3ff9eb669d6309e119e726ef322bde`. Source UI: PR #31 head `2b0146d8fd5454d486bd8df04575513817f52f96`, old base `c27e87afcb1fcf39bd787c38dbd3cdd5636373f8`. The new Draft targets `codex/ariadne-connected-planning-v0`. Neither parent PR is changed.

Implementation/test commits: `36187d72e7f1096085185322cae4e9d4d214f232` and PDF preparation guard `475a872e290a4454ef56e81ff26906074d536a4d`. Documentation/evidence follows separately. The extracted Review Desk has the exact source Git blob `9bfffc92debae4bdd068794d199335832eda3487`; its logic was not rewritten during separation.

Read live: [Ariadne hub](https://app.notion.com/p/3da9ca62107081de9fa3c32bfa450fcc), [permanent handoff](https://app.notion.com/p/41b9ca62107081aeb73ef401b152e358), both PRs, complete source diff and `design-qa.md`, actual router/layout/style dependencies and tests. No Notion/Linear writes.

CREATE/MODIFY: Ariadne task screens/chrome/styles, URL/preserved-view helpers, minimal routing, focused tests and this QA pack. READ ONLY: auth, backend 0.1.1/0.1.0, originals, Core/Close, existing assets and frozen corpus/oracles. NEVER MODIFY: original #31/worktree, other families, catalog, global search, shared console, deployment or migrations.

| PR #31 source | Treatment |
|---|---|
|`AriadnePlanning.tsx`, `AriadneReviewDesk.tsx`|Extract approved layout, source action, density, disclosures, icons and coverage semantics|
|`AriadneWorkspaceChrome.tsx`, `ariadne-workspace.css`|Extract context/source components and tokens; mount a dedicated two-route Ariadne layout|
|`AriadneWorkbench.tsx`|Leave Alpha unchanged; not needed for these two tasks|
|`OperadorRouter.tsx`|Minimal wiring from corrected #30; no family routes copied|
|`consoleChrome.tsx`, `OperatorWorkspace.tsx`, `operator-workspace.css`|Exclude shared console/sidebar architecture|
|`OperatorFamilies.tsx`, `operatorWorkspaceRoutes.ts`|Exclude catalog/global destinations|
|`ArgosSignalInspection.tsx`|Exclude another family's presentation/behavior|
|`CaseWorkbench.tsx`, `FilaView.tsx`|Exclude Advisory presentation/behavior|
|Original `design-qa.md`|Source history only; old test counts are not fresh evidence|

**Every shared file changed:** only `src/pages/operador/OperadorRouter.tsx`. The two existing gated task routes mount `AriadneWorkspaceLayout` instead of `ConsoleLayout`. Alpha, advanced intake, other products and the catch-all retain their layout/gates. No material shared-console dependency requires another family owner. Original Draft #31 remains pending its owners' separate decisions.

## Approved target and implementation

Reference lock: **A — Quiet Professional**, with **Coberto / Só demanda / Sem leitura** semantics from B. Local approved target: `C:/Users/aquil/.codex/visualizations/2026/10/03/01a0ffb8-c66e-75a3-87c1-4e3f0a3b89c5/ariadne-modernizacao/A-quiet-professional.png`. Initial bounded source implementation: `9b64f771`. No new direction replaces the approved target.

| Decision | Source/role preserved |
|---|---|
|Paper/graphite/copper, fine rules, zero added radius/shadow|A tokens and Ariadne stylesheet|
|Source/month rail → central work object → proof inspector|A task hierarchy|
|Visible original PDF action, page, new-tab cue|A and Founder discoverability feedback|
|Coverage labels from persisted physical/money flags|B semantics, no calculation changes|
|Instrument Sans, Newsreader, IBM Plex Mono|Existing Ariadne font choices/packages, explicitly loaded locally|
|Wordmark, official Software insignia, smaller Operador label|Existing NIVAR assets; no new five-family UI|
|Ariadne-only Review/Planning/Core links|Ownership isolation from shared console navigation|

No financial policy, API schema, extraction, storage, source provenance or executor changes. BRL formatting uses strings; existing chart coordinates use `Number`, not authoritative financial calculations. Source/context/exception details remain behind disclosures.

## Corrections

**P2 navigation:** source navigation used a bare Planning pathname. Ariadne links now keep the exact current Planning URL, including workspace/review/baseline/scenario/month/item. Same-screen navigation preserves unsaved inputs. Review → Planning binds that review's saved result; Planning → Review returns to that result. Direct/partial entry offers review without borrowing another private workspace. Normal server session/operator/ownership checks remain authoritative. An invalid scenario is not silently replaced by a baseline. Refresh restores the URL's saved scenario or reviewed baseline; no draft persistence or auto-save is introduced.

**P2 announcement:** one stable polite/atomic `role=status` region announces preserved → exploring → preserved. Loading text is separate. A browser MutationObserver observed exactly `Explorando`, `Cenário preservado` for edit/restoration, without repeated preview announcements. This tests the DOM mechanism, not manual screen-reader certification.

**Historical compatibility found during QA:** a real browser regression failed because the source UI replaced a selected 0.1.0 output with its automatic 0.1.1 preview. `planPreviewForDisplay` now retains the unchanged saved output. A current curve accompanies it only when versions match; another executor's curve is not attributed to the historical run. Explicit editing starts a 0.1.1 exploration. Tests also contrast legacy `4256.00` against a current uncovered result. No historical output is rewritten.

The PDF action preserves the authenticated fetch/blob flow. While the PDF loads, its visible action is disabled with a preparation label and no download fallback URL. A delayed-original browser test proves it cannot navigate before the blob is ready. This prevents a click from becoming an attachment download under a page-14 opening label; backend delivery headers remain unchanged.

## Fresh screenshots and interactions

All committed captures use **synthetic engineering files**, imported through actual private intake/candidate/confirmation/Close/Planning APIs, not UI stubs. Normal signup and UI login establish the QA session; no auth override/admin bypass. A guarded Core test insertion supplies the synthetic legacy run only in the named disposable QA database. Neither client material nor a Golden Dataset is used.

The synthetic 14-page PDF provides February/page 14, June/page 13, a missing distributor identity and an invalid period. Its persisted coverage is **3/4 physical, 2/4 monetary**. The separate frozen authentic Sobral regression still passes at **9/12 physical, 7/12 monetary** in backend tests.

| Screen | 1440×900 light | 1440×900 dark | 1920×1080 light | 1920×1080 dark |
|---|---|---|---|---|
|Saved Planning/February proof|[capture](evidence/planning-1440-light.png)|[capture](evidence/planning-1440-dark.png)|[capture](evidence/planning-1920-light.png)|[capture](evidence/planning-1920-dark.png)|
|Review/selected February source|[capture](evidence/review-1440-light.png)|[capture](evidence/review-1440-dark.png)|[capture](evidence/review-1920-light.png)|[capture](evidence/review-1920-dark.png)|

Additional evidence: [comparison](evidence/planning-comparison.png), [keyboard PDF focus](evidence/planning-source-focus.png), [direct Planning](evidence/planning-direct-mobile.png), [empty Review](evidence/review-empty-mobile.png), [saved mobile Planning](evidence/planning-saved-mobile.png), [selected mobile Review](evidence/review-selected-mobile.png). Captures were inspected. Actual viewport/document/main widths show no horizontal overflow in all 14 captures; mobile is 390×844 with the existing vertical workflow.

Browser steps passed: normal login; saved 0.1.1 Planning; saved/unsaved self-navigation; edit/explore/restore announcements; refresh; comparison; exact replay; actual export download; keyboard PDF focus; both themes/sizes; Review row/page 14 → June/page 13; history; direct/empty/mobile navigation; unsaved baseline refresh without auto-save; retained 0.1.0 view and explicit 0.1.1 exploration. Clicking the original action opened a separate blob-PDF tab at `#page=14`; original bytes matched the uploaded PDF SHA256. This is not a human comprehension/usability claim.

## Initial isolation gates — prior run at dfa1bfd1

| Gate | Pass | Fail | Skip |
|---|---:|---:|---:|
|Focused frontend|18|0|0|
|All frontend Node tests|94|0|0|
|Relevant PostgreSQL backend suites|378|0|0|
|Planning subset|119|0|0|
|Core subset|19|0|0|
|Close subset|219|0|0|
|Operator subset|21|0|0|
|Authentic corpus subset|11|0|0|
|Retained replay/hash comparison|11|0|0|
|Chrome interactions/layout assertions|44|0|0|
|Production markers/routes|5|0|0|

Subsets overlap. Backend target: disposable PostgreSQL 17.11 `ariadne_close_test`, including retained synthetic Alpha upgrade/lifecycle. Fresh read-only replay of prior evaluation databases matched all 11 frozen manifests: 5 Planning, 2 Close, 4 scalar. Previous PR counts are not reused as fresh proof.

Real `npx tsc -b`, build, compileall and diff checks passed. Design detector: 759 files, zero P0, 25 existing informational P2. Build used both Vite evaluation flags set to 1; `import.meta.env.DEV` still excludes both task routes and three executable UI markers. Chrome confirmed NotFound, with API/external requests intercepted. [Measurements](evidence/qa.json) · [Production gate](evidence/production-gates.json).

Chrome 157.0.8103.51 used the existing Playwright package's Chrome channel because its bundled browser executable is absent. Dependencies used the unchanged lockfile. An early type invocation preceded completion of `npm ci` and was discarded; real `tsc -b` subsequently passed. A disposable DB-creation harness transaction error was corrected before clean migration. No shared database was reset. Existing dependency peer/deprecation and build warnings remain; no package/lock/config changes are committed.

`qa.json` records automated duration/time, not human task time, time savings or Product Lead/Founder acceptance.

## Legacy result disclosure — 2026-11-17 follow-up

Requested starting head and live remote head matched `dfa1bfd158a77d8fe47c34651e971f336406b80d`; corrected #30 base remains `9db8ce19fc3ff9eb669d6309e119e726ef322bde`. Implementation/test commit: `b830f9e2b58b72d1330a6142ada43cb8fface634`. #30 and #31 are unchanged. No shared file or backend changes in this follow-up.

**Reproduced:** before the correction, the real-browser regression failed at “preserved 0.1.0 discloses historical eligibility limits beside financial result” after the current preview finished. The retained values were preserved, but the financial inspector did not disclose the known eligibility limitations. The comparison also omitted model versions.

**Correction:** a visible `role=note`, labelled by its heading, sits before the historical financial result. It states that 0.1.0 predates monetary eligibility corrections, preserves the original for reconstruction, distinguishes replay from financial validation and requires a new 0.1.1 execution for current evaluation of the same assumptions. It does not claim that every 0.1.0 output is incorrect. The note is absent for 0.1.1 and when explicitly exploring under that executor.

Every comparison row, including the displayed baseline, identifies its own output version. When displayed versions include both 0.1.0 and 0.1.1, a contextual note explains that monetary coverage may differ. The table references that note with `aria-describedby`. Both notices are static, without `aria-live`/alert/status roles; the existing scenario-state announcer is unchanged. No new execution, normalization, warning field in exports, or backfill is introduced.

Reference lock remains Quiet Professional. The only visual addition reuses the existing selection/accent tokens and fine-rule treatment for notices. The financial values, sources, coverage flags, comparison data and 0.1.0/0.1.1 dispatch remain unchanged.

### Fresh follow-up verification

| Gate | Pass | Fail | Skip |
|---|---:|---:|---:|
|Focused frontend (subset)|18|0|0|
|All frontend Node tests|94|0|0|
|Synthetic Planning regressions, disposable PostgreSQL 17|111|0|0|
|Retained replay/hash comparisons, read-only|11|0|0|
|Chrome interaction/layout assertions|62|0|0|
|Production markers/routes|7|0|0|

The task-scoped backend command was `python -B -m pytest tests/ariadne_planning -q -k 'not authentic and not actual_scanned_searchable'`: 111 passed, 8 public-corpus cases explicitly deselected, zero skips. It includes persisted defective 0.1.0 replay/export beside 0.1.1, strict period eligibility, source/ownership and retry regressions. An initial broader invocation also ran those existing frozen public-corpus cases (119 passed, zero failures/skips); no downloads occurred. The narrowed rerun uses synthetic evaluation data. Browser inputs and committed screenshots are exclusively synthetic.

The browser checks the actual authenticated UI and API. It verifies 0.1.0 disclosure, 0.1.1 absence, every comparison version/cost/coverage, unchanged retained display after current preview, exact legacy replay, byte-identical scenario/export API responses and actual downloaded export. Opening/closing comparison produced zero state announcements; the existing Exploring → Preserved assertion still observes exactly one of each. The static note adds no live region. The visible legacy source still corresponds to February/page 14.

Fresh read-only comparison of the 11 retained frozen manifests matched 5 Planning, 2 Close and 4 scalar histories. No old evaluation database was modified. The broader 378-backend result in the initial section above was **not rerun** for this disclosure-only patch and is not counted as fresh follow-up evidence.

Real `npx tsc -b`, `npm run build`, compileall and diff checks passed. Detector: 759 files, 0 P0, 25 existing informational P2. The built production app still excludes both task routes; all five executable UI markers (including the two new disclosure markers) are absent. Actual Chrome route checks pass with zero outbound API requests. Existing build/dependency warnings remain; no dependency or configuration change.

[Fresh browser assertions, viewport measurements and automated timing](evidence/legacy-disclosure/qa.json) · [Fresh production gate](evidence/legacy-disclosure/production-gates.json). Browser JSON uses UTC; this follow-up date uses America/New_York. Automated timing is not human usability evidence.

### Screenshot evidence and remaining manual QA

| Historical financial disclosure | Light | Dark |
|---|---|---|
|1440×900|[capture](evidence/legacy-disclosure/legacy-1440-light.png)|[capture](evidence/legacy-disclosure/legacy-1440-dark.png)|
|1920×1080|[capture](evidence/legacy-disclosure/legacy-1920-light.png)|[capture](evidence/legacy-disclosure/legacy-1920-dark.png)|
|Mixed-version comparison, 1440×900|[capture](evidence/legacy-disclosure/mixed-comparison-light.png)|[capture](evidence/legacy-disclosure/mixed-comparison-dark.png)|

[390×844 legacy disclosure](evidence/legacy-disclosure/legacy-mobile.png). All seven new captures were visually inspected. No horizontal overflow was measured in these or the 14 existing states freshly exercised by the harness. The original PDF action remains visible in the desktop historical proof.

Remaining manual QA: Product Lead/Founder should assess whether the copy clearly distinguishes reconstruction from current evaluation; manually read the warning and table context with the supported screen reader/browser combination. DOM accessibility and MutationObserver checks do not certify assistive-technology speech or human comprehension. No known functional failure remains from the requested checks.

Files changed in this follow-up: `AriadnePlanning.tsx`, `ariadne-workspace.css`, `tests/operador/ariadne-ux-browser.mjs`, `tests/operador/ariadne-ux-production.mjs`, this report, seven synthetic PNGs and two JSON evidence files under `evidence/legacy-disclosure/`. No methodology, saved data, sources, auth, router, production gate, other family or canonical document changed. The QA backend/frontend/preview processes were stopped afterward; the pre-existing PostgreSQL cluster and prior evaluation services remain untouched. Keep #33 Draft; no merge or deployment.

## Local reproduction

Use `C:/dev/nivar-ariadne-ux-isolated`, existing Python runtime and the existing loopback PostgreSQL 17 cluster. QA database: `ariadne_close_ux_isolated_browser_20261117`; it was created empty and upgraded through existing 0016. No migration is added. Do not copy a production `.env` or reset prior evaluation databases. Common cluster setup is in [Planning README](../ariadne-planning/README.md).

Backend terminal:

```powershell
Set-Location C:/dev/nivar-ariadne-ux-isolated
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_ux_isolated_browser_20261117'
$env:ARIADNE_CLOSE_DEV = '1'
$env:ARIADNE_CLOSE_ENV = 'development'
$env:ARIADNE_PLAN_DEV = '1'
$env:ADVISORY_OPERATOR_EMAIL = 'ariadne-browser@example.com'
$env:JWT_SECRET = 'synthetic-local-only-ariadne-qa-session-signing'
$env:SESSION_COOKIE_SECURE = 'false'
$env:SESSION_COOKIE_NAME = 'ariadne_ux_local_session'
C:/dev/ariadne-close-runtime/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8078 --lifespan off
```

Frontend terminal:

```powershell
Set-Location C:/dev/nivar-ariadne-ux-isolated
$env:VITE_BACKEND_URL = 'http://127.0.0.1:8078'
$env:VITE_ARIADNE_CLOSE_DEV = '1'
$env:VITE_ARIADNE_PLAN_DEV = '1'
npm run dev -- --host 127.0.0.1 --port 5186 --strictPort
```

Open `http://127.0.0.1:5186/operador/ariadne/fechamento`. Normal synthetic QA login: `ariadne-browser@example.com` / `synthetic-local-qa-password`. The explicit local proxy is mandatory; browser APIs remain relative `/api/...`.

Regression terminal:

```powershell
Set-Location C:/dev/nivar-ariadne-ux-isolated
C:/dev/ariadne-close-runtime/Scripts/python.exe -m tests.operador.prepare_ariadne_ux
$env:RUNTIME_NODE_MODULES = 'C:/Users/aquil/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
$env:ARIADNE_QA_OUTPUT = "$env:TEMP/ariadne-ux-local-evidence"
node tests/operador/ariadne-ux-browser.mjs
# Fresh DB: first run explicitly reports the missing legacy fixture as a skip.
# Add that guarded synthetic Core history, then repeat for the full gate:
$env:DATABASE_URL = 'postgresql+psycopg2://postgres@127.0.0.1:55472/ariadne_close_ux_isolated_browser_20261117'
C:/dev/ariadne-close-runtime/Scripts/python.exe -m tests.operador.prepare_ariadne_ux --legacy
node tests/operador/ariadne-ux-browser.mjs
```

Generated inputs: `%TEMP%/ariadne-ux-isolated-synthetic`. The harness creates disposable synthetic reviews/scenarios through normal authenticated file APIs and records IDs in `%TEMP%/ariadne-ux-isolated-manifest.json`. Missing-legacy skips must not be counted as a full pass. It does not seed production or client material.

Manual task: import the generated PDF and tariff CSV, confirm eligible rows, preserve the review and open Planning. Select February/page 14; change 280 → 260; click Planning and verify 260/Exploring remains. Restore saved assumptions, compare, export, replay and reload. The direct route remains usable without preloaded results.

Stop frontend/backend with Ctrl+C in their own terminals. A temporary production preview used `127.0.0.1:5193`. Task-owned servers were stopped after QA; prior #30/#31 services and PostgreSQL remain untouched. No background task remains for this contribution.

## Limits and stop boundary

Engineering verification does not establish manual screen-reader certification, human usability gains, client value, regulatory methodology or commercial readiness. Unsaved edits are not persisted across refresh. Old 0.1.0 outputs retain their historical executable truth; the UI does not backfill them. Existing source/renderer limitations remain.

Sobral remains an engineering/reference fixture, not NIV-18's adopted Golden Dataset. Olivina is outside this test. NIV-18/19/20/50 and rights/commercial/regulatory gates remain intact. Original Draft #31 remains the shared/cross-family proposal pending owner decisions. Stop at this new bounded Draft; no merge, deployment or next module.
