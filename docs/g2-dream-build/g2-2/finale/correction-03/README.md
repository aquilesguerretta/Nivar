# Finale correction 03 — complete natural closing frame

CSS-only correction for the fresh craft-02 finding: the actual page end previously let the large heading pass under the sticky header. No scroll pinning or scripted positioning was added.

The desktop signature now joins the invitation row. The phone illustration and its interval are recomposed more tightly. Font sizes, all content and actions, the source aperture, the full notebook and the footer remain available. The only product file changed in this correction is `src/components/g2/house-finale.css`.

At the actual natural document bottom:

| Viewport | Header bottom | Full heading bounds | Kicker top | Final action bounds |
|---|---:|---:|---:|---:|
| 1440 × 1000 | 84 px | 131.66–274.03 px | 92.66 px | 791.59–839.59 px |
| 390 × 844 | 68 px | 105.05–190.20 px | 77.05 px | 581.30–629.30 px |

These bounds are identical in the captured light and dark modes. Diógenes, the lantern, open final question, account action and compact footer all coexist with the complete heading. No image-load failures, horizontal overflow, or runtime exceptions were observed.

## Native recordings and actual rendered states

- `1440-light-interaction.mp4` and `1440-dark-interaction.mp4`.
- `390-light-interaction.mp4` and `390-dark-interaction.mp4`.
- Matching `*-resolution.png`, `*-source.png`, `*-notebook.png`, `*-opening.png`.
- `verification.json` and the per-recording files include exact native frame timestamps, pointer interactions, five selected gestures, Escape focus return, and end-of-document bounds.
- `keyboard-reduced-verification.json` checks 1440, 390 and 360 px with reduced motion: all five gestures via Space; source without animation; Escape focus return; native Enter on the retained footer index; 44 px or greater main controls; no overflow.

Actual native browser screenshot timing is retained in each movie. Capture cadence is lower than normal browser refresh and is not a claim of instrumentally measured 30/60 fps smoothness. These files supersede correction-02 for independent craft judgment. There is no builder claim that the fresh craft bar has passed.
