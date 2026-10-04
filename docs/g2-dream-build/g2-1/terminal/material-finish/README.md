# Terminal material finish

One focused material correction to the existing G2.1 Terminal. Product edits are confined to `src/pages/terminal-brasil/terminal-brasil.css`; this folder owns the fresh captures and verification harness. No TSX, data, architecture, Alexandria, commits, merge, or deployment changes.

## Reference and before state

Actually opened before editing:

- [Dovetail](../dovetail-1440-700.png): a quiet dark field supports raised functional surfaces and a distinct floating reading layer.
- [Fey](../reference-flow/07-fey-refero-archive.png): restrained edge light, close contact shadow, and slightly varied dark surfaces create depth without a grid of bright borders.
- [NIVAR material study](../../material/nivar-material-study.png): graphite, copper, and a translucent sheet establish the requested material relationship.
- [Before desktop](../optical-pass/1440-dark.png) and [before phone](../optical-pass/390-new-targets-standalone.png): the large blue-gray center, plot, and map flattened the hierarchy; the lens was the clearest raised element but obscured the trace more heavily.

## Material correction

The shell now uses the approved `#121315` graphite. The instrument has a warm neutral graphite face, a faint local light at the upper left, a fine upper edge, and separate contact/cast shadows. The plot becomes a darker recessed well, with espresso `#2A1F1F` used as a low-opacity local tint. The map stays quieter than the instrument; the right reading plane remains independently readable. Broad amber fills were toned into espresso. Operational type uses pale lavender-gray; amber continues to identify the selected region, trace, observation, and note.

The observation lens uses a translucent aubergine `#3C2A36` tint, directional edge light, and `blur(3px)` rather than the previous `blur(8px)`. The actual chart trace remains visible through it. The paper theme follows the same depth hierarchy in warm paper and restrained lavender neutrals, with dark text.

The source target is 44 × 44 px on both desktop and phone. Negative margins preserve the existing heading's net height. A phone-only optical cleanup hides the duplicate SVG note label when the lens is above it: the label was becoming blurry lettering behind the lens header. The note remains named in the visible inspector; the graph line, point, reading, and below-lens peak label remain intact.

The owner's explicit G2.1 material direction supersedes the inherited zero-shadow restriction for this pass. No simulated instrument or decorative data was added.

## Fresh rendered evidence

| Surface | Graphite | Paper |
| --- | --- | --- |
| 1440 px standalone | [Full first view](1440-standalone-dark.png) · [Peak observation](1440-standalone-peak.png) | [Paper view](1440-standalone-paper.png) |
| 390 px standalone | [Full first view](390-standalone-dark.png) · [Instrument](390-standalone-instrument.png) | [Paper instrument](390-standalone-paper.png) |
| Actual 886 px House preview, at 1440 px viewport | [House placement](1440-house-dark.png) · [Instrument](1440-house-instrument.png) | [Paper instrument](1440-house-paper.png) |
| Actual 348 px House preview, at 390 px viewport | [House placement](390-house-dark.png) · [Instrument](390-house-instrument.png) | [Paper instrument](390-house-paper.png) |

[Source dialog from a native click](1440-standalone-sources.png).

## Verification

`node docs/g2-dream-build/g2-1/terminal/material-finish/capture.mjs` ran in an isolated native Chrome CDP browser context on port 9235. The final run records **24 checks, zero failures, zero runtime exceptions** in [checks.json](checks.json).

- Both standalone and actual embedded House preview were exercised at 1440 and 390 px. Rendered House widths measured **886 px** and **348 px**.
- Default, peak, and paper states have no horizontal overflow and keep the selected dot outside the lens. The lens ends before the scrub control.
- Source is **44 × 44 px** in every measured state. Three physical hit samples per target are clear; native clicks open the source dialog in all four contexts.
- Timeline controls remain **40 px desktop / 44 px phone**. Scrub control remains **44 px**. Native ArrowRight advances observation 19 to 20.
- All audited visible operational labels remain **11–12 px**. The existing major values and reading hierarchy are preserved.
- Both themes were reached by a native click and confirmed through the rendered `data-tone`. The House harness explicitly clears the outer sticky header before clicking its embedded theme control; this was a harness correction, not a product change.

CSS was exercised through the live Vite render with no runtime exceptions. No additional unit tests or full build were run for this CSS-only correction; root owns the final repository gates.

## Fresh visual judgment

An independent screenshot reviewer inspected six fresh captures against the three material references and approved the direction as a substantial correction: graphite, the recessed espresso plot, and aubergine glass now separate clearly without visible layout losses. The reviewer identified the mobile ghost lettering, whose actual overlap was then corrected and recaptured. A second inspection of both final phone captures confirmed that the ghost header marks were gone, the glass/trace/point/text remained clear, and there was no visible regression.

This is a specific improvement in surface hierarchy and optical finish. Passing interaction checks does not establish a world-class visual verdict, and this report makes no such claim. The quiet working-product composition remains intentionally less staged than the promotional Fey crop.
