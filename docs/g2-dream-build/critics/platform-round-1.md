# NIVAR G2 platform critique — round 1

Date: 2026-09-11. Independent rendered-screen review. Hero film excluded.

Read `design-system.md`, `g0-g1-canon.md`, and the observable review bar. Visually inspected all 19 requested PNGs: desktop/mobile Intelligence, Advisory, Academy, Software, Hardware, Energy Brief and Método; desktop Account and Operator; Terminal desktop dark, mobile dark and the mobile series scroll position. No implementation code, interaction logs or builder rationale was inspected.

These are verdicts on the visible compositions. Screenshots cannot establish functional correctness, behavior below the captured viewport, or a complete accessibility pass.

| Area | Verdict |
| --- | --- |
| Public families and editorial | **PASS** |
| Terminal | **FAIL** |
| Operator and Account | **PASS** |

## Public families and editorial — PASS

The shared wordmark, mineral paper, rules, three typographic voices and restrained emblem treatment produce one recognizable house. Differentiation comes from useful subject matter: Intelligence leads into a publication; Advisory presents a claim and three examinations; Academy shows people studying a document; Software exposes the actual operational canvas; Hardware shows recognizable electrical metering equipment. The repeated headline treatment is strong enough to bind these pages without making their main visual demonstrations interchangeable.

The corrected energy direction is visible. The reservoir and electrical cabinet are recognizable infrastructure and hardware, with no invented laboratory object carrying the brand. Generated material is disclosed in the desktop captures, and Intelligence places that disclosure directly on its image in both sizes. Hardware also visibly declares that the capability is in development. The screenshots do not establish engineering authenticity of the illustrated cabinet, but its role is explicitly conceptual rather than documentary evidence of a sold product.

The Brief has a credible publication opening: generous reading column, contents rail, nature/state/authorship, and a restrained action row. Método turns the thesis into concrete source, period, unit, nature, method and limit fields. The mobile captures preserve reading order, margins and readable principal text; the product illustration changes into a mobile layout. No visible horizontal clipping or incoherent family identity warrants a failure here.

This pass covers the captured page openings. The Brief's long-form body, below-image captions on cropped mobile views, and expanded navigation were not visible; their quality and behavior are unjudged.

## Terminal — FAIL

**Largest gap: the mobile opening spends its first viewport on framing and selectors before showing the evidence.** In `terminal-mobile-dark.png`, the large editorial title, demonstration/period toolbar, and separate four-region block push the plotted series to the bottom of the 844-pixel frame. Only its top is visible. The interpretation is farther below. This does not meet the canon's requirement that operational mobile concentrate on selected market, chart and interpretation.

**Concrete fix:** compact the mobile opening into the product bar and one short current-market heading; consolidate the existing region choices into a compact selector next to the current market; keep demonstration status and fixed date legible in a compact context row. Retain the existing metric and period controls, then immediately show the complete series and its short reading. Use the space recovered from the oversized preamble and region block for evidence, without shrinking chart labels or adding features. The initial mobile composition should expose a complete chart and the start of its interpretation, with other regions still easy to select.

The desktop itself is convincing: geography, series and reading form a clear left-to-right sequence. Synthetic nature, units, fixed sample date, baseline, numerical summary and a contradictory question all have visible roles. `terminal-mobile-series.png` also shows that the series and subsequent reading are well composed once reached. The failure is their priority in the initial mobile view, not the chart's visual design.

A still cannot verify that region/period/metric selection updates all related views, sources disclose transformations, export works, or unavailable data remains absent. None of those behaviors receives a pass or fail here.

## Operator and Account — PASS

Operator visibly belongs to the same house while increasing functional density. Product navigation, queue counts, search, state filtering, comparable row fields and a selected-record panel establish an understandable work sequence. Status has written labels in addition to color; the selected record retains product, receipt date, age, state, expected source and a direct opening action. Sample records, fixed sample time and local/unsubmitted drafts are explicitly disclosed. It avoids becoming an arbitrary metric dashboard.

Account provides a clear entry point, with labeled fields, visible focus, a primary submit location and a restrained connection to the wider house. Its visual language supports the ecosystem without obscuring the form. The unavailable recovery capability is stated rather than represented by a misleading working link.

Only desktop views were supplied for these two surfaces. This pass does not certify their mobile layouts, authentication, validation, queue navigation, draft persistence or submissions.

## Release interpretation

The public and account/operator passes are scoped visual judgments, not human approval of G2. Terminal should return for one mobile composition revision and a fresh initial-viewport capture before receiving a visual pass.
