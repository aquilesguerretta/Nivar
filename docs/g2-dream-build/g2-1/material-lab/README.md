# G2.1 material lab — native inspection

Route: `/br/sistema`. This is a local React component lab, not Storybook. The page uses the production Brand components and selected local Literata, Manrope and Geist Mono fonts.

## Working comparison

- One six-sample selector drives the same reading on mineral paper, frosted glass over the transmission image, and a dark instrument with three distinct planes.
- The sequence `68, 64, null, 81, null, 108` MW is explicitly synthetic. No feed, installation, region or period is implied.
- Sample 03 renders an em dash on all three surfaces. The chart has one continuous segment (01–02) and two explicit gaps. It never bridges a missing sample.
- Native buttons support keyboard activation and visible focus. A second action switches between sample 03 and the 81 MW sample. The native details element expands provenance and limits.
- The identity section shows Interval at 16, 24 and 64 px; all six families at 16, 48 and 96 px; and all six intaglio hero artworks.

## Inspection

`capture.mjs` opens and disposes its own Chrome browser context via CDP port 9235. API requests in that tab receive an anonymous 401 fixture; the implementation itself does not mock or alter an API.

`results.json` records 4/4 successful combinations: 1440 × 1000 and 390 × 844 in light and dark themes. Checks covered native Space activation, visible 2 px focus, selected state, synchronized missing values, disconnected chart, return to the observed fixture, six loaded hero assets, chosen font families, actual backdrop filtering, no horizontal overflow, and no JavaScript exceptions.

The first render exposed overly fine material annotations. The final CSS raises primary material, source and instrument annotations to 11 px, with supporting paper text at 12 px. Small sample-button captions remain optical labels supported by the full accessible name and live state description.

`npx tsc -b`, scoped ESLint for MaterialLab.tsx and EditorialPages.tsx, and `git diff --check` passed. Only SystemPage and its imports were changed in EditorialPages.tsx; Energy Brief and MethodPage are unchanged.

Representative evidence:

- `system-1440-light-observed.png`: all three materials and selected 81 MW.
- `system-1440-dark-observed.png`: distinct paper, glass and instrument in the dark shell.
- `system-390-light-missing-focus.png`: native keyboard focus and missing sample on mobile.
- `system-390-dark-instrument.png`: three dark planes and preserved gap.
- `system-1440-dark-portraits.png`: optical vectors and intaglio artworks.
- `system-390-light-type.png`: selected type roles in Portuguese at phone width.

The G2.1 loop document is a provisional integration record. This local check does not claim final approval of the whole product.
