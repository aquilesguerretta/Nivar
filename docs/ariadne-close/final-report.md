# Ariadne Assisted Close v0 — engineering report

Verdict: **ARIADNE ASSISTED CLOSE ENGINEERING PASS** for the bounded experimental development implementation. This does not validate a commercial launch, regulatory methodology, client result or real reference case.

## 1. Base, branch and release boundary

Freshly fetched integration base: `origin/wave/nivar-g2-dream-build`, `bfb47e80ba2854dbc973ffdd7bd30a3ee03926c3`. Isolated worktree `C:\dev\ariadne-fechamento-assistido-v0`, branch `codex/ariadne-fechamento-assistido-v0`. Production branch observed at `1ffe298885c161093eac699c4875736e1b6c34f3`; main at `ab8b1a3fd2da8c36c76bf289c506d576c93f5015`. Existing PR #8 and unrelated worktrees were inspected and preserved. The final response and Draft PR identify the exact final head; obtain it locally with `git rev-parse HEAD`.

One Draft PR targets the development wave. No merge, deployment, production configuration/database/migration, canonical decision or task-status change. The user explicitly overrides legacy direct-production, "Sem PR" and CURSOR-only instructions for this isolated slice; unrelated instructions remain intact.

## 2. What an operator can finish

Open an owned private workspace; start a review for one scope/month; import files with distinct source roles; review sheet/column mappings and invalid candidates; confirm eligible batches; calculate supported checks; select an item and inspect its exact source values/locators beside its calculation; record a treatment; save/export an exact review; refresh and replay the same historical calculation. Core primitives are generated internally per batch/review, not manually per imported row.

The development entry is `/operador/ariadne/fechamento`, behind explicit server and Vite development gates. Existing Alpha routes and data remain usable. The UI shows illustrative/synthetic context when selected and never supplies hardcoded KPIs.

## 3. Supported intake and unsupported layouts

CSV: UTF-8 comma/semicolon delimited, header row, rectangular table, explicit numeric mode. XLSX: ordinary visible tables, header row 1; preview all supported sheets, choose one and map once for the batch; exact OOXML numeric lexical values and original cell/row locators are retained. PDF: privately preserved original, page navigation/native text where supported, or explicitly page-linked manual confirmation. No automatic field extraction is claimed. Scanned and passive-Form layouts are explicitly manual-only.

Rejected: formulas/macros, external spreadsheet relationships, active/embedded content, hidden/merged spreadsheet layouts, malformed/ragged tables, ambiguous or unsupported numeric formats, PDF actions/attachments, oversize/decompression/deadline violations. No OCR/LLM, arbitrary URL fetching, generic upload-anything promise or new external provider. Source limits are documented in the contract: 8 MiB file/preview, 20 MiB expanded XLSX, 2000 rows/file, 40 columns, 20 sheets, 64 files/64 MiB per review, 8000 calculation records, 100 PDF pages and 10-second isolated parser deadline.

## 4. Calculations and coverage

Server Decimal precision 48; exact strings across API/storage/export; 18 significant digits / 6 fractional places at intake; HALF_UP BRL cents. kWh/MWh conversions are explicit; kW and MWmed are incompatible. Signs retain credit meaning. Currency, tax basis, scope and month must be compatible.

A: invoice line arithmetic and complete, unambiguous invoice subtotals, labelled internal consistency. B: eligible `energy` component versus independently sourced quantity × reviewed price, with three distinct original content hashes. C: missing inputs, incompatible units, ambiguous scope/month, duplicate/conflicting candidates, supersession and incomplete/unreviewed sources. Invoice-only arithmetic never becomes independent contract verification.

Mandatory fixture: `100000 kWh × 250 BRL/MWh = 25000.00 BRL`; billed `26000.00`; billed minus expected `1000.00`; divergence to investigate. Independent fixture answers also cover reconciliation, credit, blank/zero, duplicates, correction, rounding, unsupported components and extreme accepted precision.

Coverage remains partial and explicit. Excluded: complex contract flex, CCEE settlement, tax interpretation, complete TUSD/TE, penalties and regulatory compliance. No expected-total extrapolation or overlapping-flags savings KPI. Unsupported currencies retain original amount/currency and have no canonical BRL billed value.

## 5. Candidates and exceptions

Raw/proposed candidates, validation errors, confirmation/exclusion, reconciliation and treatment are separate. Invalid rows cannot be confirmed; excluded invoice rows remain visible as not verified. Grouped duplicate/conflicting records are never silently chosen. Corrections explicitly supersede one same-role source and append new versions.

Results: `Conciliado no escopo verificado`, `Divergência a investigar`, `Não verificável com os dados/regras disponíveis`. Treatments append `open`, `explained`, `accepted` or `follow_up`, reason and note/action against the exact result/item. Explaining or accepting the `1000.00` difference does not change it into a match. Confirmation establishes neither source truth nor legal authority. No payment approval, dispute/email, purchase or equipment command.

## 6. Persistence, historical replay and export

Private originals/previews are immutable PostgreSQL BYTEA/JSONB records. Confirmation appends Core StateVersion/EvidenceRef; calculation appends one exact review state plus Scenario, ModelRun and Result. Every execution freezes source IDs/hashes/versions, confirmation versions, mappings, normalization, model/rule identity, precision/units/rounding policy, exact execution inputs, outputs and coverage. Historical reload and replay use those frozen inputs, never latest state.

Saved packages snapshot the exact result and treatment history. ZIP contains `report.txt`, safe `items.csv` and exact `manifest.json`, with scope/month, coverage/exclusions, references, differences, treatments and model/result identity. Repeated historical export is byte-identical within this release, including after new input/correction/calculation. Formula-injection protection applies to exported CSV cells. The package does not imply audited statements, legal compliance, confirmed overbilling or verified savings.

Consequential writes use UUID idempotency keys, persisted body fingerprints and transactional workspace locking. Tests recover committed-but-response-lost workspace creation, review creation, import, confirmation, calculation, treatment and package save; concurrent retry commits once. Frontend retry identity survives a lost response followed by expired session. Conflicting request bodies or stale confirmation versions fail explicitly.

## 7. Core, API, migration and compatibility

Additive `0016_ariadne_close` introduces five close metadata tables, append-only triggers and a Core Result `(id, tenant_id)` unique constraint for scoped foreign keys. One Alembic head. Frozen DDL; historical 0012–0015 untouched. Clean upgrade, 0015 upgrade with synthetic existing Alpha runs, downgrade/reupgrade lifecycle and preservation/replay were exercised on PostgreSQL 17.11.

Core adds exact `assisted_close` model dispatch for version `0.1.0`; existing scalar identity, integer multiplier behavior and replay are preserved. [ADR](adr-001.md) documents this extension. Close originals/receipts/treatments/packages are metadata; confirmed inputs and authoritative results remain Core data.

Authenticated relative `/api/operator/ariadne/.../close/...` endpoints implement intake/preview/confirmation/calculation/source/result/replay/treatment/package/export. No auth replacement. Minimal Alpha integration excludes reserved workflow-only records in SQL, retains evidence actually used by Alpha and rejects generic state writes into reserved close objects. Minimal shared registration/dependency changes add the model/router and pypdf. No deployment configuration edits.

## 8. Security and isolation evidence

Endpoint tests exercise owner/foreign workspace UUIDs for upload, extracted source data, original, confirmation, calculations/results, replay, treatment and export. Foreign UUIDs are insufficient authority. Expired session and disabled/production gates deny access. Body bounds precede multipart processing; original content and MIME are validated; parsing failure/interruption leaves no partial source. DB composite relations and append-only triggers enforce scope/history.

Adverse tests exercise malicious/oversized XLSX/PDF, formulas/macros/external links, XML DTD including UTF-16, duplicate/negative cell references, aggregate decoded PDF content, passive-Form isolation, row/preview limits and process deadline. No private values are logged by the parser and no document network fetch occurs. CSV injection tests exercise actual exports. Out-of-order item/workspace/validation responses cannot replace newer context. Only synthetic fixture data was used in screenshots, commits and browser exports. No new cloud infrastructure or production storage claim.

## 9. Final verification

| Check | Passed | Failed | Skipped | Evidence |
| --- | ---: | ---: | ---: | --- |
| Full Python suite, including Core, Operator and close | 323 | 0 | 0 | PostgreSQL 17.11 disposable database; real endpoints/persistence/upgrade/replay |
| Python subset: Ariadne Core / Operator / close (included above) | 19 / 21 / 121 | 0 | 0 | Fresh JUnit testcase counts, not additive to 323 |
| Existing + new frontend behavior tests | 72 | 0 | 0 | Actual epoch/idempotency functions and existing suites |
| Main real-browser workflow | 24 checks | 0 | 0 | `browser-evidence/measurements.json` |
| Adverse real-browser workflow | 18 checks | 0 | 0 | `browser-evidence/adverse-measurements.json` |
| `python -m compileall` | Pass | 0 | 0 | Application and close tests |
| `npx tsc -b` / `npm run build` | Pass | 0 | 0 | Real project type/build gate |
| Existing design detector | 0 P0 / 0 P1 | 0 blocking | 0 | 25 pre-existing informational P2 findings elsewhere |
| `git diff --check` / staged diff review | Pass | 0 | 0 | Explicit path staging / ownership inspection |

Python emitted 117 dependency/deprecation warnings; build retains existing large-chunk/Browserslist warnings. Initial harness/dependency failures were corrected and the final runs above supersede them. Database-gated tests were run, not counted as skipped passes. The aggregate Python count includes the relevant suites; it is a fresh execution count, not a historical count.

## 10. Browser evidence and operator effort

Real Chromium used actual cookie login and file chooser imports, not preinserted review data. It exercised import/mapping/confirmation/calculation/source/treatment/save/export/refresh, revised invoice/historical replay, duplicate import, native PDF page 2, scanned PDF, ambiguous/invalid rows, unsupported currency/components, parse error, loading/empty/long states, expired session, keyboard selection/focus, late responses and lost committed response. Existing Alpha guided/manual authoring, scenario studio, history comparison and scalar replay passed; Advisory operational route rendered unchanged.

Actual viewports: 1440×900 and 1920×1080, light and dark. Document width equalled viewport width in all eight normal/long combinations; main client/scroll widths were respectively 1214/1214 and 1694/1694. No horizontal overflow or browser page error. Read-only independent review inspected screenshots and found no remaining actionable close-surface visual/ownership issue.

Measured automated interaction: **5.081 seconds** for the instrumented first import→saved review sequence, **0 financial values manually entered**, **5 text fields**, **3 batch mappings confirmed**, **0 mappings reused from a previous batch**, **0 duplicate financial entry**, **1 action to supporting source values**, **2 to original download**. Unsupported component handling: **0.133 seconds / 2 actions**, visible not verified, no extrapolation. These measure automation only, exclude human reading/decision time, and establish no savings against an unmeasured spreadsheet baseline. Full measurements and synthetic PNGs are committed under `browser-evidence`.

## 11. Known limitations

No unresolved defect was found in the scoped final verification. Limits remain intentional: one energy component/month/scope, exact supported tables, explicit PDF manual transcription, no native extraction for passive Form/scanned layouts, no OCR, no cross-batch mapping reuse, bounded synchronous local parse/job handling, existing single-owner operator authorization, and immutable development DB storage without a production retention/erasure/scaling rollout. Charts use approximate browser numbers for visualization only; financial text and calculations use persisted decimal strings.

The Windows verification environment needed an explicit SQLAlchemy 2.0 runtime as described in the setup guide; this existing unpinned dependency remains a shared runtime limitation. Existing repository dependency audit/build warnings were not addressed through unrelated upgrades. Preserved PDFs can require an external local reader for graphical inspection; the application supplies native page text/locators and authenticated original download.

## 12. Real-case and qualified review still required

NIV-18/19/20/50 remain open and their HOLD/commercial gates remain intact. A rights-cleared real reference case must establish actual layouts, independent evidence quality, domain dictionary and real Golden Dataset before client/market claims. Qualified review is still required for contract interpretation, tax inclusion/exclusion, tariff/TUSD/TE, CCEE, regulatory methodology and legal/financial conclusions. Synthetic arithmetic results are engineering evidence only; neither Forza nor EV charging nor any client was selected.

## 13. Changed files / reviewer map

| Checkpoint | Owned files |
| --- | --- |
| A: contract / fixtures | `docs/ariadne-close/engineering-contract.md`, `adr-001.md`; `tests/ariadne_close/fixtures/{invoice,quantity,price}.csv`, `expected.json` |
| B: private intake / review | `app/services/ariadne_close_intake.py`, `app/services/ariadne_close.py`, `app/routers/ariadne_close.py`, `app/db/models/ariadne_close.py` |
| C: calculation / history | `app/services/ariadne_close_engine.py`; minimal `app/services/ariadne_core.py`, `app/db/models/ariadne_core.py`; `app/db/migrations/versions/0016_ariadne_close.py` |
| D: operational UI / export | `src/pages/operador/AriadneClose.tsx`, `ariadne-close.css`, `src/lib/ariadne/closeApi.ts`; minimal `OperadorRouter.tsx`, `AriadneWorkbench.tsx`; export in the owned close service/router |
| E: safety / regression / evidence | `tests/ariadne_close/{test_engine,test_intake,test_api,test_upgrade}.py`, `prepare_browser.py`, `browser.mjs`, `browser-adverse.mjs`; `tests/operador/ariadne-close.test.ts`; minimal expected-head update in `tests/ariadne_operator/test_migration_repair.py`; `browser-evidence/*` |
| Minimal shared integration | `app/db/models/__init__.py`, `app/main.py`, `app/routers/ariadne_operator.py`, `requirements.txt` |
| Evaluation handoff | `docs/ariadne-close/{README,source-readout,final-report}.md`, `verification.json` |

For the exact complete list, including screenshot filenames: `git diff --name-only bfb47e80ba2854dbc973ffdd7bd30a3ee03926c3 HEAD`. Unrelated product logic, public pages, production/deployment files and historical migrations were not modified.

## 14. Verdict

**ARIADNE ASSISTED CLOSE ENGINEERING PASS.** The experimental workflow meets its bounded engineering scope on synthetic fixtures and supported operator files through one real implementation. It is prepared as a Draft PR for Founder evaluation, with no merge/deployment and no commercial, regulatory or real-case approval.
