# System critic — round 1

Criteria: `design-system.md` only. Evidence: native rendered hero desktop/mobile frames 1–6; terminal dark desktop and dark/light mobile captures; account and operator desktop captures. No implementation or builder rationale was inspected. All judgments below are screenshot-visible; behavior is unverified.

## Hero piece gates

| Piece | Verdict | One biggest gap |
| --- | --- | --- |
| Opening + measurement | **FAIL** | The measurement is prominent, but its proof is miniature. In both frame 1 captures, `68` is easy to read while EV-001, time, synthetic-data status, generated-image disclosure, and the source/time/unit strip are much smaller and weaker. At the native 390px mobile width, several labels have only a few pixels of glyph height. This fails the canon's readable actual source/time/unit and 10–12px metadata floor. |
| Structure + observation + contradiction | **FAIL** | The chart and contradiction depend on text that is too small at native mobile width. Frames 3–4 compress axis labels, units, the two-entry legend, and the missing-interval explanation into microtype. The question is readable; the evidence that qualifies the answer is not comparably readable. The qualification cannot be demoted below the system's metadata/product text scales. |
| Transmission + return | **FAIL** | The transmitted note's substantive qualification is undersized. In mobile frame 5, the headline is readable but the sentence explaining incomplete coverage is materially smaller than the prescribed 13–15px product prose, and the provenance remains microtype. A publication that preserves limits must make those limits readable without zooming. |

These failures concern the rendered type hierarchy, not merely the existence of labels. Enlarging only the outer chapter caption will not repair them; the evidence record itself needs to reserve space for readable proof and qualification.

Visible requirements that are already satisfied: EV-001 remains identifiable; the reservoir/hardware imagery carries a written generated-illustration label; the same source/time/unit strip persists; the structural record names source, period, unit, and missing coverage; frame 4 visibly changes the claim to a question and marks the missing intervals; frame 5 states that the available records do not establish a trend; frame 6 resolves to NIVAR / *Nullius in verba* and includes the source image. Mobile uses a vertical composition and exposes all six chapter labels. These facts do not override the failed readability gates.

## Shared-system observations

- **Terminal — priority 1:** Mobile spends roughly the first 740px on identity, introductory heading, dataset controls, region grid, and metric summary. At 390×844 only the top of the chart is visible, with no interpretation in view. This weakens the required operational mobile concentration on selected market + chart + interpretation. Reduce the introductory/control stack or otherwise bring the evidence-and-reading group into the initial working view.
- **Terminal — priority 1:** Dataset date, units, map labels, chart support text, and source/status metadata are markedly smaller than the main UI. This repeats the hero's proof-legibility problem. Dark/light screenshots show different modes, but no contrast-ratio measurement was performed.
- **Terminal — priority 2:** Amber marks the default selected region, metric tab, and price series as well as attention. The public/operator surfaces use lavender for selected relationships. The terminal therefore broadens the operational attention color into a general selection grammar; clarify which marks are selection and which signal attention under the canon.
- **Account — priority 2:** The large lavender italic line `A conta, as portas.` is ornamental emphasis; the capture does not show it representing selected relation or analytical context. This departs from the stated meaning of lavender. The square controls, serif interpretation, sans functional prose, and visible input focus treatment are otherwise visually aligned.
- **Operator — priority 1:** The pale record IDs, table headings, sample-time labels, and side-panel metadata are visibly weaker than the primary row information. Preserve their secondary hierarchy without reducing the information needed to verify identity/time to faint metadata. The fixture/local-not-submitted disclosure is visible at the top, and statuses have written labels alongside their marks.
- **Operator — priority 2:** The light operational workspace follows the public mineral canvas while the terminal uses graphite. This is not alone a failure because the canon requires light/dark survival, but the supplied evidence cannot establish whether operator dark mode matches the terminal's operational palette.

## Evidence limits

`terminal-desktop-light.png` is a narrow mobile-format image, not a desktop capture. It also shows a different period/metric/region state. Desktop light consistency therefore remains unreviewed.

Screenshots do not verify playback duration, silence, pause/replay, chapter activation, actual return-to-source behavior, reduced-motion defaults, offscreen pause, keyboard operation, expanded mobile menu, hidden horizontal overflow, source-drawer disclosure, selection propagation, unavailable-source behavior, authentication, exports, local persistence, downloads, backend contracts, font self-hosting, font licensing, or CSS scope. No functional PASS is implied.
