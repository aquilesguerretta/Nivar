# Hero playback evidence — final

These files assemble actual chronological CUA browser screenshots with their original elapsed timestamp differences. They are **sampled browser playback, not 30/60 fps screen recordings**. No intermediate frame is generated or interpolated. The first retained frame starts at zero; the final frame receives the encoder's minimum 1 ms packet duration.

| Accepted recording | Frames | Duration | Dimensions and treatment | Bytes |
|---|---:|---:|---|---:|
| `hero-g23-before-desktop.mp4` | 275 | 22.143 s | Original 1633×1089; MP4 pads right/bottom 1 px to 1634×1090 | 7,134,821 |
| `hero-g231-after-desktop.mp4` | 286 | 33.004 s | Native 1280×720; no crop or scale | 3,326,306 |
| `hero-g231-after-mobile.mp4` | 255 | 33.796 s | Native 390×844 product iframe; removes only the outside QA harness, no scale | 1,149,334 |

The before and after desktop viewports differ. Use them to inspect composition and motion changes, not to compare apparent type size or geometric proportions at an identical viewport. The final desktop and mobile recordings include the final insignias, exposed 18h plot peak, and opaque credit rail. See `../../MOTION-CRITIQUE.md` for the independent critique and correction history.

Each `*-provenance.json` records encoding commands, source-frame SHA256 hashes, packet timings, output probes and capture metadata. Every lossless RGB master's decoded frame was compared to the retained source PNG pixels, and every frame PTS compared to its source timestamp. The review MP4 uses H.264 yuv420p CRF15; chroma conversion and compression mean it is not pixel-identical. RGB masters remain local validation artifacts and are excluded from the compact owner package.

Desktop source: `../desktop-native-framed-final/timing.json`, capture 0.178–33.181 s. All 286 frames retained. Periodic observed Hero clock readings span 0.042–32.000; final state is complete and stopped. The full stage stays in view.

Mobile source: `../mobile-native-rail-final/timing.json`, capture 1.153–35.155 s. The product document is 390×844 with scrollWidth 390, confirmed in `hero-g231-after-mobile-geometry.json`. Crop bounds are exactly `[0,0,390,844]`. Frame 0000 was visually inspected and omitted only because it shows the initial unpainted dark iframe with no product UI; its channel maxima are all below 64. Its original timestamp/hash and omission reason remain in provenance. All 255 painted frames, starting at 1.360 s, remain. No narrative frame was removed.

`hero-g231-after-desktop-poster.png` and `hero-g231-after-mobile-poster.png` are the first painted frames, suitable for review video posters. `hero-g231-desktop-question.png` and `hero-g231-mobile-ending.png` are supplemental native-size evidence. The MP4s are the motion deliverable; stills do not substitute for them.

## Rejected captures and experiments

- `draft-desktop` exposed repeated paper/footer collisions. Those were corrected and re-recorded.
- `final-candidate-desktop` split capture across tool calls and contains a gap. Rejected as continuous-motion evidence.
- `desktop-continuous` verified the first footer correction but still showed a large tooltip over the selected peak. Replaced by the final framed take.
- `desktop-native-final` was misframed: the title above the film was included while the lower stage was outside the viewport. Rejected; no attempt was made to reconstruct missing pixels.
- `mobile-native-final` exposed a transient credit-rail collision during the paper entrance. Its 285 painted frames were preserved for diagnosis; the rail was made opaque and the whole sequence recorded again.
- Advanced full-page mobile screenshots incorrectly painted a 390 CSS-pixel iframe at 219 image pixels. Rejected for actual-pixel review. Native screenshots of the iframe on the existing 1633×1089 root surface give the correct 390×844 rectangle.
- The QA harness is not shipped in the product bundle.

Only files listed in `portable-files.txt` are needed from this directory for the compact review. Do not include prepared duplicate frames, raw captures, RGB masters, contact strips, or rejected MP4s.
`hero-g23-before-desktop-poster.png` and `hero-g23-before-mobile-poster.png` are exact-dimension frame extractions at 0.2 s of their respective encoded G2.3 review videos, without scaling, retouching or compositing. They are review posters only; the full before recordings remain available.
