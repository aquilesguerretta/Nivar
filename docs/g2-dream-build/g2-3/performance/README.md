# Route loading boundary · G2.3

`src/main.tsx` now defers the American terminal (`GlobalShell`), American landing (`LandingPage`) and operator console (`OperadorRouter`) until a matching route renders. The Portal's initial JavaScript falls from **8,110,580 B to 3,308,245 B (−59.21%)** in the measured production builds. Gzip falls from **2,427,348 B to 1,013,954 B (−58.23%)**.

## Scope and invariants

Only `src/main.tsx` is changed by this performance workstream. The complete route table, order, initialView props, auth provider and auth gates are preserved. `AlexandriaHome` remains an eager import, and its `/alexandria/*` element is unchanged. No Alexandria component, asset, stylesheet, router or loading behavior was edited.

The nine GlobalShell routes share a typed `TerminalRoute` boundary without a key, retaining the same component identity during navigation among terminal destinations. The landing and operator have separate boundaries. `Routes`, `AuthProvider`, `BrowserRouter` and the root are never wrapped in Suspense. The fallback is a plain status message with `aria-live`, busy state, neutral system colors and the existing `F.mono` token. It has no animation, network work or global side effects.

Two stylesheets previously entered through the now-deferred code: `mapbox-gl/dist/mapbox-gl.css` and `pages/operador/g2-operations.css`. They remain explicitly eager **in their previous cascade positions**. Shared G2 styles continue through the Portal and account graph. Retaining these styles is intentional: this change optimizes JavaScript without changing Alexandria's inherited global styles.

## Production measurements

| Metric | Before boundary | After boundary |
| --- | ---: | ---: |
| Eager JavaScript | 8,110,580 B | 3,308,245 B |
| Eager JavaScript, gzip | 2,427,348 B | 1,013,954 B |
| Static local source modules | 513 | 152 |
| Entry CSS | 482,271 B | 486,421 B |
| Entry CSS, gzip | 81,272 B | 81,936 B |

The static source traversal no longer reaches `@splinetool/react-spline`, `react-map-gl` or `@react-pdf/renderer` from the eager entry. The resulting route chunks are approximately 4,706.64 kB for GlobalShell, 66.04 kB for LandingPage and 34.43 kB for OperadorRouter. These chunks are referenced through dynamic imports and are absent from the entry's static JavaScript dependency closure. Mapbox CSS remains eager deliberately.

These are asset measurements, not measured page-load timings or network traces. They were captured while the parent workstream continued its Portal composition; the new `copper-study.css` and small Portal changes account for the concurrent CSS growth. The verification compares the order of **all pre-existing** eager styles, which is identical. No claim is made that the two compiled CSS files are byte-identical.

The eager bundle is still substantial. Alexandria remains eager by explicit scope, the Brazilian Terminal remains in the Portal router graph, and Recharts is still reached by `AnalysisInstrument`. Further splitting would require separate ownership and route/style review. The existing Vite large-chunk warning remains; this work does not disguise it through a raised warning threshold.

## Verification

- `npm run build` passed before and after: the project's real `tsc -b` gate plus Vite production build.
- `gridalpha-detect src/main.tsx` passed with no findings. Its initial font finding was resolved using `F.mono`.
- AST comparison passed for all **27 Route elements**, including route order, paths, resolved component names and props. The new loading boundaries are the only normalized wrapper difference.
- The eager Alexandria import, provider structure, absence of whole-tree Suspense and original CSS import sequence passed explicit checks.
- Both measurement JSON files retain entry asset names, sizes, gzip sizes and SHA-256. `inspect-route-boundary.mjs` and `verify-route-contract.mjs` reproduce the source/build checks.

Browser verification remains with the coordinated browser owner. Static checks are not a claim of successful real navigation. The final smoke should cover a direct `/us` load, a direct `/nest` load and terminal navigation, a nested `/vault/alexandria/lesson/:lessonId` route, `/operador` and its internal transition, plus the unchanged Alexandria surface and a return to `/br`. Confirm the loading status resolves, no route loses its parameters, auth remains above the route, and delayed US/operator CSS never changes Alexandria after navigation.

No commits, backend edits, browser mutations or changes to another workstream's files were performed.
