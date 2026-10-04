# G2.1 family craft

Implemented in `src/pages/br/FamilyPages.tsx` and new `src/pages/br/g21-families.css`. The stylesheet is imported by the family page and every selector is scoped under `.g2`. Shared shell styles, the standalone Terminal, Alexandria, catalogues, backend and auth/intake behavior were not edited by this family pass.

## Final compositions

| Family | Editorial composition | Source assets |
|---|---|---|
| Intelligence | Argos folio above a wide hydro landscape; a physical Energy Brief cover crosses the landscape edge. Native title, edition status and reading link remain on the paper. | `hydro-flow.webp`, `publication-photogram.webp`, `mineral-paper.webp` |
| Advisory | Large question, Sócrates paper fragment, continuous document examination film and a native three-stage examination sheet. The paper remains legible in both shell themes. | `document-evidence-{desktop,mobile}.mp4` and matching posters |
| Academy | Human reading scene with Perseu overlapping its upper edge; a separate transparency study introduces the selected learning path. | `academy-reading{,-mobile}.webp`, `academy-transparency.webp` |
| Software | Graphite chapter surrounding the actual `TerminalPreview`, with illuminated Ariadne paper, a native light action and a transition into the operational instrument. | `graphite-surface.webp`, existing live `TerminalPreview` |
| Hardware | Copper at physical scale, Hefesto intaglio, then wet substation infrastructure alongside the unchanged measurement anatomy. Mobile integrates the patron into the image corner so the connection appears earlier. | `copper-connection{,-mobile}.webp`, `substation-rain.webp` |

The root-owned `FamilyEmblem` resolves the approved intaglio assets in `/g2/g21/emblems/`. Family headers use the optical micro drawings, the Advisory examination uses the standard drawing, and every family has an explicit hero variant. Software preserves normal compositing so its paper fragment remains illuminated on the dark stage.

All generated media is illustrative. Image descriptions and visible provenance identify it as generated; equipment is not presented as an actual NIVAR product or an identified plant. Original source prompts, jobs, model choices, commercial-use terms and source hashes are preserved in `../media/README.md`, `../media/runtime-assets.json` and the source archive.

## Reference and critic loop

The comparison source was the observed Media.Work, DGC and Rivian compositions, documented with actual captures in `../media/reference-observations.md` and `../media/references/`. Media.Work informed material occupying a large visual field; DGC informed the relationship between large editorial type and receding image layers. This was not a comparison against the prior local implementation.

A separate implementation-aware critic on iteration02 assessed all five families as having meaningfully distinct editorial logic. This agent inherited conversation context; it was not a fresh-context blind review. It identified three mobile changes: Hardware's reserved patron row delayed the copper joint, Software's 180px patron row delayed the instrument, and 7px provenance was too small. All three were addressed: Hardware now overlaps the patron on the material field, Software uses a compact cue/art row and a naturally reflowing heading, and generated-media/status captions use 9px with wrapping on mobile. The corrected scenes were visually re-inspected by the implementer in iteration03 and iteration04. The separate critic found no desktop composition issue requiring another change. Its scope and exact findings are preserved in `critic-implementation-aware.md`; it did not provide a second verdict after the corrections.

Two additional issues found during local inspection were corrected before the final capture: the Advisory film's provenance had been obscured by the overlapping sheet, and Software's action label inherited a shared important light color. Provenance now stays visible over the film; the pale action has a dark label.

## Review artifacts

Final full family set: `screens/iteration03-{family}-{1440,390}-{scroll}.png`. Each family has two desktop positions and three mobile positions, capturing the opening and its continuation. Final Software heading reflow: `screens/iteration04-software-*` supersedes its iteration03 images.

Additional checks: `screens/tablet-{family}-1024-0.png` and `screens/dark-{family}-1440-0.png`. Earlier iterations remain as the review trail.

- `iteration03-render-checks.json`, `iteration04-render-checks.json`: image intrinsic sizes, loaded state, heading font, media source/state, viewport and overflow metrics.
- `tablet-render-checks.json`, `dark-render-checks.json`: additional width/theme observations.
- `interaction-checks.json`: 21 successful native browser interaction checks.
- `capture.mjs`, `interactions.mjs`: repeatable native Chrome CDP review in an isolated browser context; each script disposes its own context.

The final family captures resolve the heading to `Nivar Literata`. The pages consume the root's Literata / Manrope / Geist Mono variables rather than declaring another type system. Captured 1440px, 1024px and 390px views have no horizontal overflow. Images visible in the inspected viewports have nonzero intrinsic sizes. No runtime exceptions or failed media requests were captured. The only error-level network messages were the existing anonymous `/api/auth/me` 401 responses.

## Behavior verification

Twenty-one checks passed using actual pointer and keyboard input:

- Intelligence initially exposes four readings; selecting Método exposes its two actual note links; primary source links remain external.
- Advisory's film advances; pause stops it; resume restarts it. The 390px source and poster switch to the portrait versions. Reduced motion starts at the poster without autoplay and still permits explicit play/pause.
- Advisory keyboard arrows transfer focus and selection to Contraditório. Parecer retains the insufficient-evidence statement; the intake action retains `/conta-de-luz-express`.
- Academy's third path updates its selected content and actual Alexandria destination; the three derived catalogue counts remain.
- Hardware's instrument accordion exposes and closes its existing explanatory content; the product-unavailability statement remains.
- Software retains the actual `TerminalPreview` and `/br/terminal` action. The action label is dark on the light surface and its hero paper uses normal compositing.

The document video additionally pauses outside the viewport or while the document is hidden. It has a visible accessible control, responsive source and matching poster. The six-second generated scene is independent of the native examination state; no generated lettering supplies the sample's claim or verdict.

`npx eslint src/pages/br/FamilyPages.tsx`, `npx tsc -b --pretty false` and the scoped detector over both owned implementation files passed. No commit, merge, push or deployment was performed.
