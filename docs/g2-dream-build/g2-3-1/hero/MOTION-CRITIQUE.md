# Independent Hero motion critique — G2.3.1

**Final status: motion composition passes this independent review at the recorded desktop 1280×720 and mobile 390×844 sizes.** The initial paper/footer collisions, obscured 18h peak and transient mobile credit-rail collision were all found in actual sampled playback, corrected and re-recorded. Final evidence is `encoded/hero-g231-after-desktop.mp4` and `encoded/hero-g231-after-mobile.mp4`, relative to this document's `evidence/` directory. Details and limits appear in the final recheck below. Earlier sections deliberately retain the refinement history and must not be read as unresolved findings.

## Evidence and method

Root supplied a new, current-run native 1280 × 720 browser capture: `evidence/draft-desktop/timing.json`, 280 PNG frames over 34.967 seconds. The Hero itself reaches 32.000 and stops. I inspected chronological captured-frame strips, then opened native PNGs around suspect intervals. This is actual sampled playback, approximately 8 frames/second; it is not a 30/60 fps screen recording and cannot exclude a defect shorter than a capture interval.

`evidence/encoded/hero-g231-draft-desktop.mp4` preserves those intervals as VFR. Its RGB lossless master was decoded and checked pixel-for-pixel against every source frame. All packet PTS match source elapsed time after zero normalization. No interpolation, frame invention, crop, or rescaling is used in the recording. Contact strips are deliberately reduced and supplemental.

## Chronological findings

1. **Reality, 0–4 seconds — healthy direction.** Tucuruí's aerial scale followed by the transmission field establishes Brazil before data appears. The title sits in an authored quiet field, without traveling data labels. The photographic stage is distinguishable from the later material study. The very small bottom provenance remains secondary; it needs the linked credit page to carry full legibility.

2. **Measurement, 4–9 seconds — substantially improved.** The copper/probe film and entering register occupy separate physical planes. The register masks in from the right; its temporarily clipped leading entrance is intentional, not text colliding with footage. The selected 68,1 GW remains readable after arrival. The material shot is editorial rather than evidence of the synthetic quantity, correctly stated in the rail. The macro shot's final frame then holds through organization; this is calmer but also visibly less alive.

3. **Organization, 9–13 seconds — blocking vertical collision.** The table has a useful causal relationship to the original selected observation, but the fifth row and table caption run into the reserved bottom rail. Native `frame-0085.png` (11.013 s capture): 23h / 52,4 straddles the horizontal boundary and `5 registros destacados de 24` is clipped by the stage bottom. Reserve usable content height excluding both top register metadata and bottom provenance, then fit the table to that region. Do not simply conceal the last row or caption.

4. **Observation, 13–18 seconds — earned transformation, same clipping defect.** Expansion of the paper moves the film out of the working area and reveals a recognizable Terminal instrument only after a selected observation and organized series exist. The graph is not pasted over the film. The interval around 13.0–14.2 seconds shows no traveling text-to-text collision. However, `Um ponto. Um contexto.` and its support text run into the bottom rail as soon as they appear. This needs a real layout allocation, not another opacity patch.

5. **Question, 18–23 seconds — blocking legibility failure.** `frame-0144.png` (18.481 s) and `frame-0180.png` (22.922 s) show `O que explica esta alta?` intersecting the metadata rule/text. Supporting copy is clipped. The graph and its persistent selected-point tooltip are legible; the question itself receives less usable space than the analytical data. Move the note into the actual reserved side-column flow and leave its full text above the rail. The question should be the authored change at this beat, not a compromised footer annotation.

6. **Transmission, 23–27 seconds — coherent material cut, collision repeats.** The light/glass shot makes a real visual change and the carried register preserves continuity. At `frame-0195.png` (24.680 s), the transmission support copy crosses the bottom rail. The wider empty paper above and crowded note below are evidence of an incorrect internal height budget, not a need for more screen height everywhere.

7. **Open inquiry, 27–32 seconds and stop — right final state, broken handoff in draft.** The return to the actual instrument and automatic stop are appropriate. At `frame-0237.png` (30.295 s) the question crosses the rail and its lower call to action is clipped. This compromises the promised Hero → Terminal handoff. Replay is quiet and there is no scrubber competing with the story. The final frame must give the reader a complete, comfortably readable question and action.

## Overall judgment

This is a real redesign, not G2.3 with a new crop. New Brazilian context, two materially different moving-image studies, a sheet/register that grows into the instrument, and non-seek controls meet the requested change in direction. The strongest improvement is spatial authorship: footage yields to an evidence surface rather than competing behind moving labels.

The present draft is not ready for owner review because almost every analytical beat collides with the same footer rail. Fix the composition's usable-height model, then recapture continuous desktop/mobile sequences and inspect the same transitions. A static reduced-motion state and browser control checks remain separate requirements; this draft-only critique does not claim them.

Potential refinement after the collision fix: make the frozen probe hold during organization feel deliberate (slower final camera settle or a composed end hold). Avoid extending unrelated architecture work. Keep the earned, delayed instrument reveal and quiet controls.

## Corrected desktop recheck

I reloaded the actual product and captured it continuously in one browser call through its real completion state. `evidence/encoded/desktop-continuous/timing.json` contains **301 native 1280 × 720 PNG frames over 33.527 seconds**, with periodic DOM scene/time readings from 0.050 to 32.000. No gap was introduced by splitting tool calls. The earlier split-call take `final-candidate-desktop` is rejected as continuous-motion evidence because it has a gap around question/transmission.

- **Organization:** `desktop-continuous/frame-0100.png`, capture 11.840 s / film 11.059 s. Four declared selected records now fit, with the caption `4 registros destacados de 24` fully visible. This is an explicit smaller editorial selection, not an invisible clipped fifth row.
- **Question:** `frame-0180.png`, capture 20.750 s / film 19.960 s. Title and both explanatory lines sit fully above the rail, without intersection.
- **Transmission:** `frame-0220.png`, capture 24.967 s / film 24.185 s. The carried reading, title, two lines of support and bottom rail have separate readable regions.
- **Open inquiry:** `frame-0280.png`, capture 31.560 s / film 30.773 s. Title and `Continuar no Terminal` are complete and separated from the footer. The final capture reaches `data-complete=true`, `data-playing=false`, film 32.000.

**Remaining concern, sent to root:** the shorter plot puts its large selected-value tooltip directly over the selected 18h peak and its time label. This is visible in both question and open inquiry frames. The stable reading in the left column already carries 68,1 GW; preserve the plot's peak visibility by composing a compact Hero-specific selected-state display or docking it outside the plot. Do not change the real Terminal's global behavior. This is a composition issue, even though the tooltip is legitimate Terminal UI.

## Native mobile final-candidate recheck

Root supplied `evidence/mobile-native-final/`: 286 screenshots on its normal 1633 × 1089 surface with the unchanged product in a 390 × 844 iframe. I inspected the original screenshots, their native-size iframe crop, all six transition strips and individual frames around the entrance. The encoded result preserves 285 painted frames. Only frame 0000 was omitted: its entire iframe rectangle was verified to be a single uniform RGB 181/184/189 before the browser painted the product. The first painted capture was 0.734 s; the last 34.208 s, yielding a 33.475 s MP4 including its final 1 ms packet. No later frame or inconvenient transition was removed.

The final insignias are present. The large plot tooltip has been removed in the Hero while the selected Terminal reading remains in the left/upper column. The 18h peak, vertical selected guide and time label are now visible. Organization, observation, question, transmission and open inquiry are readable, with a complete final `Continuar no Terminal` action. The corrected mobile composition rearranges the register above the chart; it is not a scaled desktop canvas.

**One remaining transient collision:** during the paper's upward entrance, captured frames 0041–0044 show the register's contents crossing behind the transparent credit rail. At frame 0041, `REGISTRO / 18h` shares the credit strip; at frame 0042, the SE/CO line crosses `MATÉRIA E LUZ`; at frame 0043 the source/date area crosses it; at frame 0044 the paper's own footer meets the same rail. By frame 0045 the paper is settled and the collision is gone. This is a real motion defect of roughly half a second, not a screenshot framing issue. Root was asked to make the credit rail structurally opaque or clip the traveling paper above that rail, then recapture this entrance.

The other recorded mobile transitions around 13, 18, 23 and 27 film seconds do not show text-to-text or text-to-rail collisions in the inspected sequence. The frozen probe end hold remains an editorial choice, not a playback failure. Final approval is pending only the rail-entrance correction and its new recording within this motion review's scope.

## Final recheck — accepted

Accepted desktop source: `evidence/desktop-native-framed-final/`. The figure remained at about y135 throughout the capture, with its entire film stage visible in the 1280×720 native screenshot. All 286 frames were retained, from captured 0.178 s to 33.181 s (MP4 duration 33.004 s). Periodic DOM observations cover film 0.042→32.000 and confirm completion with playback stopped. This replaces the rejected `desktop-native-final` take, whose framing included the large thesis above the film and cut off the stage's lower edge.

Accepted mobile source: `evidence/mobile-native-rail-final/`. Root's `geometry.json` confirms a 390×844 product document with scrollWidth 390 and the exact iframe crop. All 255 painted frames were retained, from captured 1.360 s to 35.155 s (MP4 duration 33.796 s). Only initial frame 0000 was omitted after visual inspection: it showed the dark unpainted iframe without product UI; its RGB channel maxima were all below 64. The raw frame and hash are retained in provenance. No narrative frame was removed. No crop inside the 390×844 product rectangle and no scaling were applied.

1. **Reality — passes.** The actual Brazilian photographs establish place and scale before the synthetic register arrives. The first painted frame and the transmission-field cut are legible in both formats.
2. **Measurement — passes after rail correction.** I inspected every native mobile entry frame0039–0045. The paper now emerges above an opaque, full-width credit rail. Register labels are clipped at the moving paper boundary as an intentional entrance; they never paint through the credit text. The footage and register have separate spatial roles.
3. **Organization — passes.** Four declared selected records and their caption fit. The original reading remains present, so the table reads as organization of evidence rather than an unrelated interface.
4. **Observation — passes.** The paper expands and the real Terminal graph is revealed progressively after the register/table. The selected 18h point, guide and label remain visible. The repeated large tooltip is absent from the Hero; the real selected reading stays in the side/upper column.
5. **Question — passes.** `O que explica esta alta?` and its two supporting lines remain above the metadata boundary; the peak that motivates the question is visible. The inspected transition does not crossfade competing blocks on top of one another.
6. **Transmission — passes.** The light/material film is a distinct visual beat. Reading and uncertainty remain together. The cut back to an image does not discard the register or turn the screen into a generic full-bleed backdrop.
7. **Open inquiry and stop — passes.** The final question and full `Continuar no Terminal` link fit on desktop and mobile. The selected point remains visible, and the film reaches 32.000 then stops. The quiet replay control is present; no seek bar competes with the sequence.

The new footage, deliberate separation of image and paper, and delayed instrument reveal make the change materially different from G2.3. The frozen probe contact hold during organization is an acceptable editorial pause. Within this visual motion review, no remaining blocking composition finding was observed in the inspected sequences. This is not a claim of 60 fps capture, sub-frame collision exclusion, full accessibility certification, or complete performance/interaction QA. Those broader checks belong to the root handoff; these recordings preserve the actual CUA sampling cadence.
