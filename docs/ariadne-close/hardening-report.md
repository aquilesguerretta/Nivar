# PR #28 — targeted Assisted Close hardening

Verdict: **ARIADNE ASSISTED CLOSE HARDENING PASS**, within the original experimental engineering scope. All three findings were reproduced and corrected. No financial model/policy changes, production changes, merge, manual deployment, canonical edits or gate closures.

## A. Reviewed revision and delivery

Reviewed branch/head: `codex/ariadne-fechamento-assistido-v0` / `5499c12b235a5af390da7a9ef690a4c796b44d38`. Worktree: `C:\dev\ariadne-fechamento-assistido-v0`. It was clean, the remote matched, and no intervening commit was present. Fetch was repeated before committing; unrelated worktrees were preserved.

Current integration base: `wave/nivar-g2-dream-build` / `bfb47e80ba2854dbc973ffdd7bd30a3ee03926c3`. Production/main observations remained `1ffe298885c161093eac699c4875736e1b6c34f3` / `ab8b1a3fd2da8c36c76bf289c506d576c93f5015`. Hardening implementation commit: `c09a985d6a395b2c7b636fde30b94d6c69a8737c`. A following documentation/evaluation-evidence commit forms the delivery HEAD; the final response and PR body identify its exact SHA, also available with `git rev-parse HEAD`. This avoids embedding a commit's own hash in its contents.

Same Draft PR [#28](https://github.com/aquilesguerretta/Nivar/pull/28), same base/branch. Two focused commits: implementation/regressions/contract; evaluation handoff/fresh evidence. No next portfolio module.

## B. Finding 1 — reproduced and corrected

Mechanism: all five 0016 triggers rejected `DELETE` before PostgreSQL could enforce dependencies. A parent-delete regression returned trigger SQLSTATE `P0001`, rather than the intended restrictive-FK `23503`; dependency-ordered removal was categorically impossible. This repeated the retention-policy boundary already corrected in Core.

Correction: `BEFORE UPDATE` only, keeping the existing trigger/function identities and every restrictive foreign key. Existing non-deferrable `NO ACTION` references remain restrictive; no cascading deletion, table/schema redesign or destructive endpoint. All five UPDATE attempts still raise `P0001`. Parent review, superseded source, Core result and workspace deletion with live dependents raises `23503`.

The disposable lifecycle test removes packages/treatments, the successor source before its predecessor, remaining sources, receipts and review in dependency order. It neither disables triggers nor uses TRUNCATE/cascade. A different retained close calculation still replays identically and its saved export is byte-identical. Retained scalar runs replay `20` and `24`. Runtime OpenAPI registration contains close routes and no DELETE/PUT/PATCH; an actual DELETE-original request returns 405, while the retained original remains readable.

Boundary: removing a database-level DELETE veto grants no ordinary-user deletion authority. No deletion UI/API exists. Future explicitly authorized lifecycle orchestration must address originals, extracted previews/raw values, Core confirmation/execution snapshots/results, receipt responses, saved packages, downloaded exports and backups. The test explicitly proves Core snapshots remain after close metadata removal: it is not a complete-erasure claim.

## C. Finding 2 — reproduced and corrected

Mechanism: the custom route consumed/buffered `request.stream()` before FastAPI's normal dependencies ran. An oversized disabled/production/unauthorized upload therefore returned a size error after consumption. Moving checks into normal handler dependencies alone would still leave FastAPI multipart/JSON parsing ahead of them.

Correction: route-local development/production gate before `receive`; then a bodyless preflight resolves the existing `get_current_user`/`get_db` dependency graph and existing operator/workspace/review checks. It preserves dependency overrides, closes preflight DB resources before awaiting the upload, and restores FastAPI scope stacks on every path. Authorized reading retains the existing 8 MiB plus 256 KiB multipart-envelope bound. The normal handler rechecks authorization/context after transfer, preserving its session-cookie renewal and workspace protections. No parallel auth system, global middleware, proxy or infrastructure change.

Instrumented ASGI receive proves **0 calls / 0 bytes** for disabled, production, unauthenticated, expired, non-operator, foreign workspace and missing-review requests, with both malformed and oversized bodies. The foreign user is configured as an authorized operator before the ownership rejection. A real expired signed session also rejects without reading. A valid real cookie session imports successfully, renews its cookie and closes both DB sessions; the preflight session is already closed when the first body read occurs. Valid multipart intake persists one source. Authorized oversize returns 413 without reaching the file parser. Existing foreign-source/original/result/package/export and expired-session regressions pass unchanged.

Limits: this proves application-level ordering, not that an upstream transport/proxy never buffers bytes. The preflight intentionally checks access twice and performs bounded identity/context reads. It uses FastAPI's dependency utilities/scope-stack conventions, exercised on installed FastAPI 0.142.2; future dependency upgrades should rerun the cleanup/ordering tests. The existing unpinned framework requirement is unchanged.

## D. Finding 3 — reproduced and corrected

Mechanism: `row.hidden == "1"` missed `"true"`, invalid booleans were effectively treated as visible, and column declarations were never checked. Supported-layout boundaries could therefore silently admit hidden content.

Correction: one case-sensitive boolean validator for every worksheet row (including headers) and every column declaration. It accepts `1/true/0/false`, with XML-only whitespace collapse; rejects true/1 and invalid lexical values; omission/false/0 remain visible. No rows/columns are removed or interpreted. This follows [W3C XML Schema boolean](https://www.w3.org/TR/xmlschema-2/#boolean) and the BooleanValue type of [Row.Hidden](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.row.hidden?view=openxml-3.0.1) / [Column.Hidden](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.column.hidden?view=openxml-3.0.1).

Controlled OOXML fixtures explicitly vary attributes independently of writer defaults, with `cols` placed before `sheetData` in valid worksheet sequence. Parser tests cover true/1, false/0/omission, XML whitespace, wrong case, empty/2/yes and non-XML whitespace. Actual HTTP intake/isolated parsing returns 422 for hidden/invalid row and column layouts, with no persisted source; visible equivalents preserve exact `250.125`, null blank and `Inputs!A2`/`Inputs!B2` locators. This enforces the existing boundary and adds no hidden-layout support or financial normalization changes.

## E. Migration treatment and environments

0016 remains unmerged and absent from fetched wave/production/main histories. The original task applied it only to the exclusively local disposable `ariadne_close_test` and `ariadne_close_browser` databases. No shared/production DB credentials or connection were used. This is positive evidence about this task's environments, not a global assertion about unseen shared deployments.

Amended unmerged 0016; no 0017, no edits to 0012–0015, no stamp. One Alembic head: `0016_ariadne_close`. PostgreSQL 17.11 cluster: `C:\dev\ariadne-close-pg17-20261002`, loopback port 55472. Existing `ariadne_close_browser` was inspected read-only and preserved, including its old triggers/history. New explicitly disposable `ariadne_close_hardening_browser` was created and clean-upgraded; database inspection confirms all five installed guards are UPDATE-only. Only the named disposable test schema was repeatedly upgraded/downgraded by test fixtures.

`upgrade head` alone does not reinstall an amended revision already recorded at head. The README recommends a fresh disposable evaluation DB. It also documents downgrade-to-0015/reupgrade only when an existing evaluation DB is explicitly disposable and close data may be discarded; retained synthetic Alpha history is tested. Discovery of a shared/non-disposable application of old 0016 requires an additive correction, preserving that environment's history. No existing shared/production data was deleted.

## F. Historical and scalar compatibility

Fresh Core **19**, Operator **21**, Assisted Close **187** tests passed (included in full Python total). The existing upgrade test constructs retained synthetic Alpha history at 0015, upgrades to amended 0016 and replays the exact saved scalar payload. The new lifecycle test separately preserves scalar and close histories while exercising another disposable close lifecycle. Existing idempotency, response-lost/concurrent retry, conflicting versions, decimal/unit/rounding, invoice-only versus independent verification, partial coverage and historical exports remain passing. No Core executor/model version, financial engine, UI policy or existing auth implementation changed.

## G. Fresh verification results

| Gate | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Focused hardening regressions | 66 | 0 | 0 |
| Full Python on disposable PostgreSQL 17.11 | 389 | 0 | 0 |
| Core / Operator / Assisted Close, included above | 19 / 21 / 187 | 0 | 0 |
| Existing frontend behavior suites | 72 | 0 | 0 |
| Main / adverse real-browser checks | 24 / 18 | 0 | 0 |
| Actual production-build exclusion check | 1 | 0 | 0 |
| compileall / `npx tsc -b` / production build | Pass | 0 | 0 |
| Existing design detector | 0 P0 / 0 P1 | 0 blocking | 0 |
| diff whitespace / staged review | Pass | 0 | 0 |

Counts were obtained from new executions and JUnit/browser results, not copied from the original report. Python emitted 119 existing dependency/deprecation warnings. Design detector reported 25 existing informational P2 findings elsewhere. Build retains existing large-chunk/Browserslist/CSS-minification warnings. No DB-gated skip was counted as a pass. Parser fixture sequence was corrected during read-only review, then parser regressions and full Python were rerun on the final tree.

The initial pre-fix focused run intentionally recorded **26 failed / 2 passed / 71 deselected**, reproducing the three findings; this is red-phase evidence, not the delivery verdict. An initial ASGI harness used mixed-case raw headers, causing one authorized request to fail; fixing the harness to the ASGI lowercase-header contract yielded the final focused passes. Local logs/JUnit are under `C:\dev\ariadne-close-hardening-*`; committed `verification.json` contains final counts, timestamps and evidence references.

## H. Browser verification and measured effort

Real local Chromium used existing login/cookie authentication and actual file imports into the freshly migrated evaluation DB. Workflow: import → mapping review/confirmation → calculation → source-side investigation → treatment → saved ZIP/export → reload/replay. Adverse cases cover revised invoice/unchanged old export, duplicate import, lost committed response, late async responses, unsupported/missing/ambiguous input, native/scanned/manual PDF and long content. Alpha authoring/scenario/history/scalar replay and Advisory route regression passed.

All eight normal/long combinations at actual 1440×900 and 1920×1080, light/dark, have document width equal to viewport width and main client/scroll widths 1214/1214 and 1694/1694. Keyboard, loading, empty, error and expired/absent session states passed. No browser page errors. Fresh synthetic screenshots/measurements are under `browser-evidence`; visual inspection confirmed readable operational/source layouts. The separate actual local production build has no experimental controls and sent **0 API requests**.

Automated interaction timing: **4.120 s** for the instrumented first workflow after login; unsupported component **0.111 s / 2 actions**. Zero financial values manually entered; five text fields, three batch mapping confirmations, zero cross-batch reuse, zero duplicate financial entry, one action to source values/two to original download. **Human reading/decision time was not measured.** These automation measurements establish no human usability duration or spreadsheet time savings.

## I. Founder evaluation handoff

[README](README.md) gives exact local PG/backend/frontend start commands, existing synthetic login, explicit development gates, loopback-only bindings and stop commands. Route: `http://127.0.0.1:5178/operador/ariadne/fechamento`. It always sets `VITE_BACKEND_URL=http://127.0.0.1:8072` to avoid the repository's remote default proxy.

Generate/reuse `%TEMP%\ariadne-close-synthetic-browser\synthetic-input-package.zip` with `tests/ariadne_close/prepare_browser.py`; this machine's path is `C:\Users\aquil\AppData\Local\Temp\ariadne-close-synthetic-browser\synthetic-input-package.zip`. Extract and import invoice CSV, independent quantity CSV and reviewed price XLSX for `SYNTHETIC-UNIT` / `2026-09`. Confirm, calculate, investigate the `1000.00 BRL` difference, explain it, save/export and reload. The unsupported component remains not verified. No source edits, preinserted review data or auth bypass are needed. The earlier saved-export ZIP under browser evidence is a result package, distinct from this input package.

Backend, Vite, preview, Chromium jobs and the exclusively local PostgreSQL cluster are stopped after verification. Evaluation DB/data and generated synthetic files remain durable for Founder restart. No public development server or unreported background work is left running.

## J. Changed files and residual limitations

Implementation/regressions: `app/db/migrations/versions/0016_ariadne_close.py`, `app/routers/ariadne_close.py`, `app/services/ariadne_close_intake.py`, `tests/ariadne_close/test_intake.py`, new `test_hardening_api.py`. Contract/lifecycle: `docs/ariadne-close/engineering-contract.md`, `adr-001.md`. Handoff/evidence: `README.md`, `hardening-report.md`, original `final-report.md` supersession note, `verification.json`, `tests/ariadne_close/prepare_browser.py`, `browser.mjs`, refreshed synthetic `browser-evidence/*`. Exact list: `git diff --name-only 5499c12b235a5af390da7a9ef690a4c796b44d38 HEAD`.

No known remaining defect in these three findings. Intentional original limits remain: supported visible tables/energy checks only, explicit manual PDF fields, partial coverage, single-owner authorization, no production retention/erasure/scaling readiness. Shared migration application cannot be ruled out outside observed environments; preflight relies on framework dependency conventions; automation timing is not human evaluation. Two read-only agents reviewed separate correctness/auth concerns without writes or shared disposable DB use; recommendations about valid fixture order/nonvacuous endpoint inspection were implemented.

## K. Draft PR and external-system boundary

[Draft PR #28](https://github.com/aquilesguerretta/Nivar/pull/28) is updated on the existing branch and remains unmerged. The repository's existing GitHub/Vercel integration automatically builds previews on PR updates; no deployment command, provider setting or production variable was changed. The workflow remains excluded from production builds. No Notion/Linear decisions/statuses or NIV-18/19/20/50 gates changed.

## L. Verdict

**ARIADNE ASSISTED CLOSE HARDENING PASS.** Engineering evidence covers the three targeted corrections and regression preservation. Commercial launch, a rights-cleared real reference case/Golden Dataset, source truth and qualified legal/tax/tariff/CCEE/regulatory review remain outside this approval.
