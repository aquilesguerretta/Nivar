# Ariadne proof continuity and original recovery

This correction is stacked on Draft PR #34 at `a3d441bf7d03c50dce1bc4c2e59b7530cc2f2489`. The [analyst readiness report](analyst-readiness.md) records the pre-correction evaluation. It remains a historical account of that run.

## Before and after

| Scenario | Before | After |
|---|---|---|
| Select February 2020 and open Planning using **Planejar a partir deste estado** | The baseline was correct, but the proof switched to June 2019 and PDF page 13. [Before](evidence/proof-recovery/planning-before.png) | The exact baseline, February proof and authenticated PDF page 14 carry forward. The browser clicked the original and reached the blob PDF at `#page=14`. [After](evidence/proof-recovery/planning-after.png) · [Dark mode](evidence/proof-recovery/planning-after-dark.png) |
| No valid correspondence in the baseline | The previous default could select the first physical month regardless of the requested proof. | A missing, malformed, stale or unsupported handoff leaves the proof unselected and prompts the analyst to choose a row. [Fallback](evidence/proof-recovery/planning-unmatched.png) |
| Original fetch returns 404 with an authenticated analyst | The copy directed the analyst to check the session. Download and enlarge links remained visible. [Before](evidence/proof-recovery/original-before.png) | The copy is neutral, document links disappear and the analyst can retry. Once available, the same PDF page opens without reloading or calculating again. [Unavailable](evidence/proof-recovery/original-unavailable.png) · [Recovered](evidence/proof-recovery/original-recovered.png) |

The handoff carries an exact source ID and locator. Planning resolves the pair against the authorized baseline returned by its existing API, then against the displayed result. A transferable month must have a reported period and physical coverage. Duplicate labels never decide an exact lookup. Conflicting or uncovered rows still appear in the month list for explicit inspection. A direct entry with no requested selection still defaults to the first physical month. Existing exact saved-scenario selections work after reload, including uncovered observations selected for inspection.

An original or retry request uses the current authorized workspace and review URLs and bypasses the browser cache. Requests from previous source selections are aborted and their blob URLs are revoked on cleanup. A 401 directs the analyst to sign in again in another tab. Both 403 and 404 show “Original indisponível neste contexto.” A network failure or 5xx suggests retry. The UI discards error response bodies. A retry does one original request and retains the review, proof and URL. The original download and page routes still perform their own access checks. An independent raster preview can fail even when the original is available, so the exact PDF remains accessible in that case.

Automatic private workspace placement from the readiness evaluation is a **product hypothesis for human observation**. Ask the first-time analyst where they expect the evidence to land and observe whether the existing controls are understood. Workspace creation and ownership behavior stay as exercised in #34.

## Fresh verification

The first two focused browser cases ran against the parent before the application edits and reproduced both defects. The final browser run exercises 12 cases using the existing disposable synthetic review. The real local 404 came from an absent original, presented to the selected source request without deleting data. The other failure codes and network interruption were injected only for that request. Authentication and ownership were also exercised by the real disposable API suite. [Red run](evidence/proof-recovery/before.json) · [Final run](evidence/proof-recovery/after.json)

| Gate | Pass | Fail | Skip |
|---|---:|---:|---:|
| Frontend Node tests, including four new selection tests | 98 | 0 | 0 |
| Focused Chrome cases | 12 | 0 | 0 |
| PR #33 browser regression suite | 62 | 0 | 0 |
| PR #34 analyst workflow | 25 | 0 | 0 |
| Core, Operator, Close and Planning on disposable PostgreSQL 17 | 365 | 0 | 0 |
| Read-only retained replay and manifest hash comparison | 11 | 0 | 0 |
| Existing production route and bundle checks | 7 | 0 | 0 |

Thirteen public-corpus backend cases were deselected for this run. The 11 historical comparisons cover five Planning, two Close and four scalar runs. The unchanged #33 harness exercised the retained 0.1.0 output and export byte equality, current 0.1.1, exact source bytes, mixed-version comparison and single scenario-state announcements. The focused retry recorded zero new scenario/review status mutations and no other review API request or navigation. The #34 harness still completed its full analyst task, including both downloads and replays.

One concurrent #34 run timed out waiting for the second source's context form. The cause was not established. The preceding run and the final isolated run completed the same unchanged #34 harness with 25 checks each. The table shows the final isolated run.

TypeScript, production build, diff checks and the design detector passed. The build excluded both experimental routes with the evaluation flags set. The original retry label and unmatched-proof text were also absent from the production bundle. [Production gate](evidence/proof-recovery/production-gates.json)

## Review map and manual checks

- `src/lib/ariadne/planningSelection.ts` resolves the current and historical proof selection. `src/lib/ariadne/useOriginalDocument.ts` manages one context-scoped original request and classifies retrieval failures.
- `src/pages/operador/AriadneReviewDesk.tsx` supplies the handoff identity and gates original actions. `src/pages/operador/AriadnePlanning.tsx` resolves the handoff and retains proof during recovery. `src/pages/operador/AriadneWorkspaceChrome.tsx` shares the retry control.
- `tests/operador/ariadne-planning.test.ts` adds exact-match and ambiguity checks. `tests/operador/ariadne-proof-recovery.mjs` drives the focused cases. This report and its synthetic evidence complete the contribution.

The product/data paths continue to use the existing engines, authentication, persisted snapshots and authorization routes. The only added actions are resolving the proof passed by the contextual link and retrying an existing read.

For human QA, start from the February proof and confirm the destination and source are recognizable without assistance. Use keyboard and a screen reader through a 404/retry and an expired session recovered in a separate tab. Confirm that proof context is understandable while the original is unavailable, that the reappearing PDF action can be reached by keyboard, and that the existing status is announced once. Browser assertions cover state and DOM behavior. Actual assistive-technology speech and human comprehension remain manual observations.

Use the existing [loopback synthetic setup](design-qa.md#local-reproduction), this checkout, and a matching synthetic manifest in the documented disposable database. Set `RUNTIME_NODE_MODULES` as in that setup and run `node tests/operador/ariadne-proof-recovery.mjs`. Set `ARIADNE_QA_OUTPUT` to a temporary directory for a fresh evidence run. Local backend, frontend and preview were stopped after the correction QA.

## Concurrent error visibility

Using the February synthetic proof, the focused suite injected an original PDF 404 alongside a simulation 503 in Planning or a calculation 503 in the Review Desk. At `7746c521`, both cases showed only “Original indisponível neste contexto.” Planning disabled “Preservar cenário” while the simulation failure remained hidden. [Planning before](evidence/concurrent-errors/planning-before.png) · [Review Desk before](evidence/concurrent-errors/review-before.png) · [Reproduction counts](evidence/concurrent-errors/before.json)

The analytical alert now identifies the failed operation, and the proof panel displays the original retrieval alert beside its retry control. Planning associates “Preservar cenário” with the visible analytical explanation when the error disables the button. The analytical messages are local UI copy. The injected private response text appears in neither screen. The original’s existing 401 recovery guidance, neutral 403/404 feedback and retry guidance for network and server errors still pass. [Planning after](evidence/concurrent-errors/planning-after.png) · [Review Desk after](evidence/concurrent-errors/review-after.png) · [Planning in dark mode](evidence/concurrent-errors/planning-after-dark.png)

When the document became available again, retry issued one original GET, cleared only the document alert and opened the authorized PDF at `#page=14`. The URL, proof and baseline were retained. The analytical alert stayed visible, the disabled save remained explained, and the observer recorded zero scenario-status mutations during retry. The preserved Planning export and Close result returned byte-identical bodies before and after both failures.

| Gate rerun for this follow-up | Pass | Fail | Skip |
|---|---:|---:|---:|
| Focused Chrome suite on the previous implementation | 12 | 2 | 0 |
| Focused Chrome suite after the correction | 14 | 0 | 0 |
| Frontend Node tests | 98 | 0 | 0 |
| PR #33 Chrome regression suite | 62 | 0 | 0 |
| Read-only retained Planning, Close and scalar replay | 11 | 0 | 0 |
| Production route and bundle gates | 7 | 0 | 0 |

TypeScript, the production build, the design detector and `git diff --check` passed. The production build excluded the experimental routes and the new Planning alert identifier with both development flags supplied. The earlier backend and #34 workflow counts above are from the proof continuity patch. This follow-up used retained disposable synthetic records. [Focused final run](evidence/concurrent-errors/after.json) · [Production gates](evidence/concurrent-errors/production-gates.json)

Human accessibility QA remains open. With a keyboard and screen reader, verify that each alert identifies its own operation, the visible save explanation is easy to find in reading order, and focus can return to the PDF action after retry. Listen for repeated scenario announcements during recovery. The automated checks cover the DOM and status mutations.
