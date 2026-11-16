# Ariadne — Quiet Professional visual review

Date: 2026-11-16. Scope: Ariadne's gated Review Desk and Connected Planning. The original scenario, review and source were used read-only. Base: `c27e87afcb1fcf39bd787c38dbd3cdd5636373f8`.

## Evidence

- Approved target: A — Quiet Professional (`A-quiet-professional.png`) with the coverage labels from B (`B-analytical-workbench.png`).
- Planning comparison, A at left and running implementation at right: `qa-opcao-a-versus-planejamento.jpg`. Both halves were 1440×900 pixels at the 1440×900 CSS viewport; no resize was needed.
- Focused comparison of impact and the PDF action: `qa-prova-foco.jpg`, native-pixel crops of the same state.
- Review comparison, prior running UI at left and implementation at right: `qa-revisao-antes-depois.jpg`. No separate approved Review mock was supplied; its shared chrome, chart/result hierarchy and proof action are checked against A.
- Final light captures: `planning-light-1440.jpg` and `review-light-1440.jpg`. Final dark captures: `planning-dark-1920.jpg` and `review-dark-1920.jpg`.
- All captures use the same preserved February 2020 source evidence, the 280 kW Planning scenario and the same local QA session. Light captures are 1440×900 pixels at a 1440×900 CSS viewport; dark captures are 1920×1080 pixels at a 1920×1080 CSS viewport, without density adjustment.
- Screenshots and comparison boards remain local in the design handoff; no captures or source documents are included in the branch.

## Findings and fixes

- **P2, month selection:** the first render hid the selected February row below the list's scroll fold. Compact three-column rows now show all 12 entries at 1440×900, including February, its 294.48 kW and explicit coverage. Real unparseable periods retain the source page label instead of being assigned a month from the mock. Verified in both widths and themes.
- **P2, source action:** the original understated links have one shared, 54 px high original-document action. The icon, title, page number and new-tab cue are visible at both viewports. Keyboard Tab reached it with a visible solid outline. Both rendered targets were authenticated object URLs ending in `#page=14` with `target="_blank"`. The original PDF tab itself wasn't reopened by the automation; the prior manual source verification remains the evidence for opening it.
- **Typography and copy:** reused the live Instrument Sans and Newsreader; compact context and a single larger work-object heading; kept exact decimal text and added localized currency formatting without converting it to a float. The real interface keeps the visible name field and before-tax basis that the static mock simplified. The right inspector's additional disclosures preserve real impact, reference dates, formula and raw evidence.
- **Spacing and density:** full-width quiet shell, source/month rail, dominant center and dedicated inspector. Zero radius and no added shadow. Both light and dark rendered with no horizontal page overflow at 1440×900 and 1920×1080. At 1440×900 the Planning PDF action ends at about y=484 and selected proof at y=668; the Review action ends at about y=228. The Review inspector scrolls internally for longer treatment and provenance sections.
- **Colors and assets:** neutral paper/graphite and muted copper; state text remains available independent of color. The official NIVAR wordmark and all five reusable G2.3.1 `FamilyInsignia` assets were checked in the DOM and screenshots. Software is visibly marked, while Moon/Sun and document commands use existing Lucide assets. No generated image or replacement logo ships in the product.

## Verification

Browser evidence: changed the month and the reviewed row, observed matching proof, toggled scenario comparison, confirmed both exact replays, and checked the original action keyboard focus. The two final pages logged no browser errors in the tested state. The existing Python/PG17 and frontend suites cover preservation, exports, source authorization and scenario behavior; no new private review or scenario was created in the retained evaluation database.

Automated gates: 486 Python and 81 frontend tests passed without failures or skips; `tsc -b`, production build, design detector (0 P0, 25 existing P2 notices) and diff check passed. The redesign is separate from PR #30 and has not been deployed.

final result: passed

## Operador family navigation

Browser feedback added a smaller “Operador” label beside NIVAR in the shared header, an overview at `/operador/familias` and one internal page per family. The status labels describe the workflows available in this development console. Intelligence links to the synthetic Argos inspection, Advisory to the illustrative queue and Software to the Ariadne review desk and Core Alpha. Academy and Hardware have no operator workflow to open.

Browser checks opened all five pages through the official insignia links and verified the current-page marker. Returning to the overview with Enter, opening the Advisory queue and Argos, returning to the exact review and finding the page 14 PDF action all worked. The shared header was also checked on Connected Planning. The overview rendered without horizontal overflow at 1440×900, 1920×1080 and 390×844.

The follow-up passed all 81 frontend tests, type checking, the production build, the design detector and the diff check. The new routes and page content were absent from the production JavaScript even with both Vite evaluation flags set.
