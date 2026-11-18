# Ariadne internal analyst workbench readiness v0.1

Evaluation of development wave `5056781d6c1b95c4a250aa0a02990b8415d159f5` on 17 November 2026 (New York). The job is an authorized NIVAR analyst turning private evidence into a reconstructible analytical deliverable. Client communication and professional judgment remain with the responsible human service.

**CONDITIONAL.** The synthetic workflow completed from an empty Review Desk through source review, discrepancy treatment, preserved alternatives and exact replay/export. Three bounded usability issues remain around workspace choice, continuity of the selected proof, and unavailable-source recovery. Analyst comprehension and assistive-technology use still need direct observation.

## Scope and sources

GitHub and Git confirmed #28, #29, #30 and #33 merged into the development wave. [PR #31](https://github.com/aquilesguerretta/Nivar/pull/31) remains Draft and outside this evaluation. The live internal Alpha described in the hub is distinct from the development Review Desk and Planning evaluated here. Production exclusion is tested locally.

- The [Ariadne hub](https://app.notion.com/p/3da9ca62107081de9fa3c32bfa450fcc), [Master Architecture](https://app.notion.com/p/3da9ca62107081f09cc0cebef59db65b) and [permanent handoff](https://app.notion.com/p/41b9ca62107081aeb73ef401b152e358) assign private state and deterministic scenarios to Ariadne and applied judgment to Advisory. This QA contribution fits the pause on generic capability expansion.
- The [Evidence Protocol](https://app.notion.com/p/3da9ca62107081cd8200ef1732da4970) calls for reconstructible inputs, assumptions, execution versions and outputs. [Data Rights](https://app.notion.com/p/3da9ca62107081c4bfabc22839d8ecdb) makes use purpose-bound. Browser input and committed evidence were generated synthetically. Olivina documents were excluded from the evaluation.
- [NIV-18](https://linear.app/nivarenergy/issue/NIV-18) is In Progress. [NIV-19](https://linear.app/nivarenergy/issue/NIV-19) depends on it, and [NIV-50](https://linear.app/nivarenergy/issue/NIV-50) depends on both. [NIV-20](https://linear.app/nivarenergy/issue/NIV-20) is Backlog in Linear with an explicit HOLD pending reference-case selection. This evaluation supplies engineering evidence for the analyst workflow.
- [Review Desk contract](../ariadne-close/review-desk-contract.md), [Planning contract](../ariadne-planning/engineering-contract.md), [#30 report](../ariadne-planning/final-report.md) and [#33 QA](design-qa.md) establish the expected evidence and calculation boundaries. The implementation read included the actual Operator routes, Close and Planning screens/APIs, Core lineage service and their existing tests.

## A. Analyst workflow map

1. Sign in as the authorized analyst. Open Core Alpha at `/operador/ariadne` and follow the experimental Close link. Core Alpha is the generic evidence, state, assumption and execution workbench. The Review Desk is the document review path, with its own private review context.
2. Select a document in Review Desk. Inspect proposed role, unit, period, literal values and locators. Correct context where necessary and preserve the original. Validate and confirm the eligible interpretation. A confirmed observation remains dependent on its source.
3. Preserve the Close result. Select a row and open its exact original page or inspect its table locator. Separate internal arithmetic from independent verification and record a treatment where follow-up is needed. The treatment leaves the computation intact.
4. For a supported demand profile, follow **Planejar a partir deste estado**. The reviewed result ID binds the baseline, physical observations and available reference data. Acknowledge the modeled regime and tariff applicability. Enter a candidate demand and preserve named alternatives.
5. Compare preserved alternatives and their model versions. Reopen a result, reconstruct it and download the exact Planning JSON. Return to the reviewed state to reconstruct Close and download its ZIP with a text report, item CSV and JSON manifest.
6. Before communicating findings, the analyst explains coverage denominators, excluded periods, provenance and assumptions, confirms applicability, and chooses which source material the recipient may receive. The internal exports support the handoff. Communication and professional judgment remain separate human work.

The handoff still requires two artifacts when both review and planning matter. The Close ZIP provides a report, a table and a manifest. The Planning JSON provides the saved branch with its baseline and source references. The analyst must match the baseline to the Close package, retrieve any permitted originals and translate the reasons for exclusions and the historical eligibility caveat. The analyst also needs to state which findings were internal arithmetic, which had independent support and which require professional review.

## B. Operator readiness matrix

| Stage | Expected | Actual outcome | Evidence |
|---|---|---|---|
| A · Entry and context | Locate the document task and consciously place evidence in a private context | **Partial.** The experimental Close link leads from Core to Review Desk. First import automatically allocates a new private workspace. Review offers role, period and unit confirmation, with no explicit workspace choice on the empty screen. | [Empty desk](evidence/analyst-readiness/empty-review.png), [context](evidence/analyst-readiness/intake-context.png) |
| A · Review candidates | Distinguish proposals, interpreted observations and missing inputs | **Pass.** Before confirmation the PDF shows proposed context and one missing/ambiguous monthly reference. PDF and tariff CSV preserve their roles, locators and interpretations. Second import stays in the same workspace and review. | [Measured operations](evidence/analyst-readiness/readiness.json) |
| B · Proof and discrepancy | Inspect original source and record follow-up without modifying arithmetic | **Pass.** February opens the authenticated PDF at physical page 14. The separate invoice case traces to CSV row 2 and shows billed 26,000.00 versus 25,000.00 BRL from the invoice itself. Difference 1,000.00 BRL stays an internal check. Independent verification remains unavailable and treatment leaves output identical. | [PDF proof](evidence/analyst-readiness/review-proof.png), [CSV proposal](evidence/analyst-readiness/reconciliation-context.png), [difference](evidence/analyst-readiness/discrepancy.png) |
| C · Connected Planning | Carry reviewed facts and distinguish baseline from hypothetical result | **Partial.** Correct baseline and facts carry forward without typing them again. The selected proof moves from February to June on entry. Four observations give 3/4 physical and 2/4 monetary coverage. | [Comparison](evidence/analyst-readiness/comparison.png), recorded before/after proof headings |
| C · Preserve and reopen | Compare and reopen scenarios with explicit assumptions and versions | **Pass.** The UI saved 280 and 260 kW under 0.1.1, compared the two and reopened 280. The partial modeled costs are 9,172.29 and 9,486.02 BRL respectively. The explored minimum is qualified and marked as outside contractual recommendation. | [Comparison](evidence/analyst-readiness/comparison.png), [reopened 0.1.1](evidence/analyst-readiness/planning-source-focus.png) |
| D · Failure and history | Explain unsupported states and preserve identifiers on recovery | **Partial.** Missing-original 404 keeps the same result and page selection. The warning directs a valid session to check authentication. A subsequent reload after restoring availability recovers the original. Invalid billing period, missing identity, stale baseline, conflicts, expired session and ownership results are below. | [Unavailable original](evidence/analyst-readiness/missing-original.png), [0.1.0 disclosure](evidence/analyst-readiness/legacy-1920-dark.png) |
| E · Handoff | Open supporting evidence, replay and export the same executions | **Pass for internal artifacts.** Planning JSON output matches the saved snapshot and includes assumptions, version and locators. Close reconstructs exactly and the actual ZIP matches the same package reread byte for byte. Client-facing explanation and rights review remain analyst responsibilities. | Download and replay assertions in [automation record](evidence/analyst-readiness/readiness.json) |

## C. Findings

| Priority and type | Reproduction and impact |
|---|---|
| P2 · Ariadne context discontinuity | Select February in the preserved Review Desk proof and activate **Planejar a partir deste estado**. The baseline ID still binds the same result, but Planning opens June instead. The analyst must reselect February to continue inspecting the intended evidence. The browser trace records both headings. |
| P2 · Ariadne recovery feedback defect | For the selected original, present the real loopback 404 from an absent source ID. The visible alert says “Original indisponível; verifique sua sessão” while `/api/auth/me` returns 200. A download action still appears. The actor can misdiagnose missing evidence as a login problem. This test substitutes the response and does not delete any original. Recovery after the response is restored requires one reload in the measured path. |
| P2 · Ariadne first-use gap | Enter the empty Desk through Core and select a file. A fresh workspace is created before context confirmation. The empty view gives no workspace selector or creation cue, and naming is automatic. This makes placement harder to reason about when an analyst has several private contexts. The run demonstrated correct isolation and same-review reuse for the second source. Human comprehension of the Core/Desk transition remains unmeasured. |

## D. Interaction and re-keying analysis

One operation is a scripted analyst action such as a button/link activation, file selection, field edit, choice, reload, address navigation or return from an original. Setup sign-in, assertions, API observations, waits, screen-capture scrolling and rendering are excluded. A file chooser is counted once. Path transitions exclude query-only changes and the original-document tab. These counts describe one scripted route, including the deliberate unsaved reload.

| Path | Operations | Free-text entries | Notes |
|---|---:|---:|---|
| A · Core through two confirmed sources | 8 | 0 | Two file selections, two context confirmations, two interpretation confirmations. First-use address and Core-to-Desk link are included. |
| B · Preserve, inspect and return from original | 4 | 0 | One activation from selected proof to original. Returning closes the PDF tab and retains the selected proof. |
| C · Plan, compare and reopen | 12 | 4 | Two acknowledgements, two distinct scenario names and two entries of 260 kW. The second entry recovers the deliberately discarded draft following reload. |
| E · Reconstruct and export | 6 | 0 | Planning replay/export, return to reviewed state, Close replay/package save/download. |
| Separate invoice discrepancy case | 10 | 2 | The two entries are analyst reason and follow-up note. No billed values are typed. |
| Missing-original exercise | 3 | 0 | Select the preserved proof, reload with a missing original, reload after availability returns. |
| **Total** | **43** | **6** | Three main in-app path changes, one initial address navigation and one original-document round trip. |

Observed measurements, prices, period and unit were proposed from these fixtures and did not need re-keying. Confirming two distinct source interpretations and acknowledging planning assumptions remain necessary human decisions. The 260 kW recovery re-entry is the only repeated free-text value in this trace. Source workspace choice was absent. Readiness still depends on testing unsupported source preparation and analyst comprehension with a human.

## E. Fair Excel comparison

Use the same files, same four demand rows, same independent eligibility and rounding instructions, and the same acceptance checks. Give the Excel analyst a prepared reusable workbook with structured tables, Power Query where supported, data validation, named assumptions and a versioned formula table. Give the Ariadne analyst the documented path and the supported synthetic inputs. Give both analysts access to the original documents and allow efficient shortcuts.

| Work | Ariadne in this evaluation | Equivalent Excel workflow |
|---|---|---|
| Source preparation and transcription | Supported PDF and CSV create attributed candidates. Reviewed facts carry into Planning. | Import literal CSV with explicit types. Use available PDF table extraction when it actually yields reliable rows. Transcribe any unresolved cells once and preserve page IDs alongside them. |
| Normalization, validation and reconciliation | Bounded parsing and review preserve unresolved evidence. Exact internal arithmetic and independent eligibility are distinct. | Reuse queries and validation tables. Validate dimensions, blanks and identity explicitly. Reconcile rows with formula checks, duplicate flags and control sums. |
| Scenarios and formula management | Named runs bind assumptions, baseline, model and coverage. Server uses exact Decimal; the UI displays amounts. | Put hypotheses in a scenario table. Use versioned formulas with explicit eligible months and cent rounding. Use integer cents or checked decimal equivalents for precision-sensitive cases. |
| Provenance and reconstruction | Source locators, inputs, model version and output can be inspected and replayed. | Use linkable originals in a controlled folder, source/version columns and an archived workbook plus exports. Record formula/query versions and freeze values for the historical snapshot before updating queries. |
| Repeatability and cost | Automation measured application operations in this task. | A well-maintained template can make repeat runs efficient. This evaluation did not run equivalent human Excel tasks and measured no time, cost or productivity difference. |

### Manual observation protocol

Give a first-time authorized NIVAR analyst the synthetic PDF, tariff CSV and invoice CSV listed below. State the task in business terms. Ask for the preserved Close result, a page-level proof, a recorded discrepancy treatment, two demand scenarios, a coverage explanation and a reconstruction/export pair. Keep navigation unprompted until they ask for help. Start timing after sign-in and prior to navigation. Record assistance, actual clicks/keys, distinct field edits, repeated entry, transitions to originals, recovery actions, and whether the analyst correctly explains independent verification, partial coverage, old versus current execution and the contract advisory boundary. Record finish, failure or intervention per stage. No client distribution is part of the exercise.

For a controlled Excel comparison, use the same case and expected results, allow the prepared template, and counterbalance order or use equivalent cases to reduce learning effects. Record one-time preparation separately from repeat runs and use the same definition of completion. Keep synthetic evaluation, observational results and judgment about external commercial value separate.

## F. Accessibility

The fresh PR #33 browser suite reached the PDF action by keyboard with a visible focus ring and verified the new-tab intent and exact page. A single atomic polite status region signaled Exploring and Preserved once each. The historical-note and mixed-version table semantics passed their DOM checks. The new missing-original test confirmed a visible alert while retaining the proof. The original suite measured layout at 1440×900, 1920×1080 and 390×844 with no page overflow in the checked states. Both themes were exercised. [Keyboard focus](evidence/analyst-readiness/planning-source-focus.png) · [Dark historical result](evidence/analyst-readiness/legacy-1920-dark.png) · [PR #33 rerun](evidence/analyst-readiness/pr33-regression.json).

### Manual checklist

- Start at Core and find the review link using keyboard only. Verify visible focus and reading order across the source list, candidates/results grid, and proof. Import via the labeled file input and confirm eligible rows without a pointer.
- In Review Desk verify that a screen reader reads row state, missing/unsupported reasons, original page number and new-tab intent. Open the PDF, return, and confirm focus/context remain usable.
- In Planning hear Exploring and Preserved once per change. Read the 0.1.0 limitation in financial-result context and the mixed-version table description and model headers. Contrast that reading with a current 0.1.1 scenario.
- Verify error discovery and recovery after session expiry. Check zoom, text reflow, light/dark contrast, and keyboard access to the scrollable table. Record platform, browser, assistive technology and the observed speech or focus path.

## G. Reliability and fresh verification

| Condition | Result and verification surface |
|---|---|
| Missing distributor identity | Browser-driven import and 0.1.1 result show November physical-only with identity exclusion. Backend independently tests invalid, absent and conflicting identities. |
| Invalid billing period | Openly invalid candidate on PDF page 11. That row remains in the denominator with neither physical nor monetary eligibility. |
| Incomplete money and conflicting observations | Coverage is explicitly 2/4 for cost, 3/4 physical. Engine tests keep duplicate valid periods and conflicting inputs uncovered. The separate invoice rows also expose repeated keys, missing factors and unsupported components. |
| Stale reviewed baseline | Disposable Planning API tests cover explicit acknowledgement after correction and unchanged old replay/export. The analyst-facing stale-baseline wording was not exercised in the new browser route. |
| Unavailable original | Real local 404 response exercise plus same-selection recovery in Chrome. Copy issue above. |
| Expired session and foreign workspace | Disposable backend tests exercise expired cookie/auth and deny foreign reads, writes and export without disclosing workspace existence. Expired-login UI recovery remains in the manual protocol. |
| Unsaved exploration | Refresh restored the preserved 280 kW run with no new scenario. It took one extra entry of the 260 kW hypothetical to resume. |
| 0.1.0 vs 0.1.1 | Fresh #33 browser checks prove retained display/disclosure, exact legacy replay and unchanged bytes including actual legacy download. An explicit edit explores 0.1.1. Mixed-version rows retain their model, money and coverage. |
| Reconstruction | Fresh read-only replay and frozen-manifest comparison of five Planning, two Close and four scalar results. New UI path also replayed Close and Planning and checked the exact exports. |

| Gate | Pass | Fail | Skip |
|---|---:|---:|---:|
| Frontend Node (all) | 94 | 0 | 0 |
| Core/Operator/Close/Planning on disposable PostgreSQL 17 | 365 | 0 | 0 |
| Analyst browser workflow assertions | 25 | 0 | 0 |
| Existing #33 browser regressions | 62 | 0 | 0 |
| Retained exact replay and hash comparisons | 11 | 0 | 0 |
| Built production route and bundle checks | 7 | 0 | 0 |

Backend counts are 19 Core, 20 Operator, 215 Close and 111 Planning. Thirteen public-corpus cases were explicitly deselected using `-k 'not authentic and not actual_scanned_searchable and not public'`. TypeScript `tsc -b`, production build and diff checks passed. The design detector reported 0 P0 and 25 informational P2 findings. The build had both development feature variables set and excluded both task routes and all five executable UI markers. [Production gate](evidence/analyst-readiness/production-gates.json).

The first Chrome and type-check attempts started before the clean install completed and were discarded. Subsequent builds used the unchanged lockfile. The first workflow selector for the scenario combobox and the initial test-only workspace list route were corrected to match the existing interface. Installation reported 29 dependency audit findings on the baseline lockfile. Dependency remediation is outside this evaluation.

## H. Prioritized improvements

1. **Defect · recover the selected proof when entering Planning.** Carry the month and exact source locator only when they belong to the preserved baseline. Retain a clear fallback for ineligible or absent selection.
2. **Defect · make the unavailable-original alert actionable.** Separate authentication recovery from generic unavailable-source feedback without revealing inaccessible source identities. Keep the historical proof selected and make the action state reflect availability.
3. **Feature proposal · confirm workspace placement before import.** Validate with the manual observation protocol first. If placement confusion is confirmed, make the existing private context explicit and allow deliberate reuse using existing authorization. Keep scope to the analyst Review Desk.

## I. Final assessment

**CONDITIONAL — bounded usability defects or missing evidence.** The scripted analyst can complete and reconstruct the existing workflow. Correct first-use placement, evidence continuity and error recovery merit review before an unassisted internal evaluation. The manual session should verify comprehension of proposals, coverage, historical limitations and handoff responsibilities. There was no human usability test or measured Excel comparison.

## Reproduce

Use the documented local-only gates and normal synthetic QA sign-in in [#33 local reproduction](design-qa.md#local-reproduction), with this worktree as the working directory. Use only the named disposable browser database or a dedicated empty disposable database on loopback. For legacy regression, use the documented synthetic retained fixture with its matching disposable DB and manifest.

Run `python -m tests.operador.prepare_ariadne_ux` with the existing project runtime to produce the PDF and tariff CSV under `%TEMP%/ariadne-ux-isolated-synthetic`. The separate arithmetic case uses `tests/ariadne_close/fixtures/invoice.csv`.

```powershell
$env:RUNTIME_NODE_MODULES = '<directory containing the installed playwright package>'
$env:ARIADNE_QA_OUTPUT = "$env:TEMP/ariadne-analyst-readiness"
node tests/operador/ariadne-analyst-readiness.mjs
```

The first-use harness creates a new private review via the UI on each run. Sign-up is test setup and excluded from measurement. API assertions are read-only and never seed the measured review. The address entry is a preselected starting point, so discoverability of the wider Operator console remains a manual observation.

Run `node tests/operador/ariadne-ux-browser.mjs` against the existing synthetic legacy fixture in a separate output directory. Run `node tests/operador/ariadne-ux-production.mjs` against the built loopback preview. Ports 8078, 5186 and 5193 used for this evaluation were stopped after verification. The existing local PostgreSQL cluster remains available.
