# G2.1 brand decisions and open craft work

## Selected by the coordinating design pass

**Interval + Literata / Manrope / Geist Mono.** This is an internal design selection for the owner's review, not owner approval.

The comparison uses the existing Portal thesis, one complete Energy Brief paragraph, the Advisory promise, a Terminal metric, a five-row table, three operator rows, provenance, dates, accents, units and ambiguous glyph pairs. Numeric market examples are clearly labelled synthetic. They are never connected to the production Terminal.

### Wordmark

`wordmarks/01-interval.svg` uses solid outlines. Its A crossbar and R bowl/leg junction share an open construction. N, I and V carry ordinary reading rhythm so the name is not five competing ideas. The fill survives the dark reversal and the 16 px specimen more firmly than the stroke-built old G2 logo. Brand.tsx uses a slightly wider A aperture at <=18 px.

Rejected `02-current.svg`: its continuous path brings more motion to the name, but the N is visibly mannered and the overall construction is too close in feeling to the NASA worm reference. Rejected `03-civic.svg`: the name is convincing as a publication masthead, but its serifs make the identity too editorial when placed on the equipment plate or dark Terminal.

Remaining wordmark concern: Interval is substantially more controlled than the structural-pass mark, but geometric capitals are a crowded field. Its distinctiveness depends on the shared open construction and disciplined use. A legal trademark search was not part of these drawing studies.

### Type

- **A / selected:** Literata gives the argument a human voice; Manrope keeps instructions and longer reading open; Geist Mono cleanly separates measured values. The range serves the product better than relying on one display face.
- **B / retained comparison:** Plex Serif/Sans/Mono is highly coherent. It feels more like a familiar corporate documentation system and contributes less identity to the Portal.
- **C / retained comparison:** Fraunces/DM Sans/DM Mono has the strongest immediate personality. Its italic “recomendação” becomes too mannered when repeated throughout the site.

Native Chrome captures verify 1440 × 1000 and 390 × 844. No horizontal overflow occurred at 390. All candidate font families loaded locally before capture; see `render-checks.json`. The screenshots expose a limitation in the study itself: 9–10 px provenance is too small. Runtime labels should start at 11–12 px. Do not transfer the specimen's smallest labels into production.

Literata has real italics. Manrope does not; the initial comparison exposed a browser-oblique body emphasis. The revised board disables font synthesis and assigns emphasis to each system's true serif italic. The final product should reserve true italic for Literata and use weight, structure or upright emphasis in Manrope.

### Runtime boundaries

Changed by this agent: `src/components/g2/Brand.tsx`; added `src/components/g2/g21-fonts.css`; added selected licensed files under `public/g2/g21/fonts/`. The coordinator owns the CSS import, variable assignment and page compositions. This agent has not edited shared g2.css, routing, backend, or Alexandria.

## Family emblem plan

The 12 symbol SVGs are purposeful reductions. The existing owner-authored portraits remain the conceptual reference. Six final intaglio illustrations now provide the character and gesture at large scale. Original PNGs and selected responsive WebPs are both preserved.

| Character | Micro / 16–28 | Standard / 40–96 | Hero / 160–420 | Motion and composition |
| --- | --- | --- | --- | --- |
| Diógenes / house | Lantern aperture | Lantern with a restrained emitted field | Calm seeker and carried lantern, graphite relief and a copper light surface | Reveal the light aperture once, then hold. Nameplate remains primary. |
| Argos / Intelligence | One eye | Three observation fields | Scanning figure, raised hand, eyes in the hair and a small horizon | A signal or issue sequence reveals beside the gaze; no generic radar sweep. |
| Sócrates / Advisory | Opposed brackets | Two propositions joined at one datum | Pointing hand, face and scroll with a visible gap between question and evidence | The claim and evidence resolve from opposing directions; figure anchors that tension. |
| Perseu / Academy | Carried flame | Torch and transmission rays | Bearer and torch, warm metal and paper | Knowledge passes into a reading path; avoid celebratory flame looping. |
| Ariadne / Software | Continuous thread | Open looping thread with persistent endpoints | Figure and thread, thread continuing out of the emblem into actual UI | Shared thread connects selection to source. It should organize, not decorate. |
| Hefesto / Hardware | Anvil datum | Anvil plus constructed tool | Worker, caliper and anvil in shallow metal relief | Small movement of measurement jaw; real equipment photography surrounds the emblem. |

Material iteration 1 tested shallow relief with graphite recesses and quiet metallic faces. The coordinator rejected its Greco-Roman coin reading after inspecting Argos. Sócrates and Ariadne had already been dispatched in this direction and are retained as rejected studies. Craft alone did not make the tone correct.

Material iteration 2: cropped face and meaningful hand/object gesture, nearly monochrome lavender-black intaglio on mineral paper, one restrained copper trace. Argos is much closer to a contemporary independent research publication. The circular disk and costume-heavy body are removed. Side-by-side: `emblem-directions.html`; images: `emblems/argos-relief-solid-study.png` and `emblems/argos-intaglio-study.png`.

The rest of a family page remains a present-day product environment. No columns, temples, costumes, laurels or invented ancient scenes are needed outside the emblem itself. The paper is intentionally opaque; it is not described as a transparent cutout.

The initial symbolic ceremonial roundels were placement studies and were replaced in the final board by the selected intaglio illustrations. They did not satisfy the owner's request for large characters by themselves.

## Final component verification

`brand-runtime.html` imports the actual React `Brand.tsx` and final font declarations. Native Chrome screenshots in `screens/brand-runtime-*` cover 1440 and 390 widths, mineral paper and an explicitly experimental dark inversion. All six images loaded, all three variant types were observed, and no horizontal overflow occurred. `runtime-checks.json` records natural image dimensions and the measured variant tags.

The first runtime render exposed excessive blank bounds around the small symbols. Each character now has its own optical micro/standard viewBox; a 16 px lantern no longer occupies only a few pixels inside a generic 64 × 88 field. The standards remain original vector drawings, and the hero uses responsive 600/1200 WebP artwork. FamilyEmblem accepts explicit `variant`, `className`, and `decorative` props; automatic selection is micro <=28, standard 29–199, hero >=200.

The dark inversion is a comparison experiment, not a universal recommendation. It preserves marks but can read as a photographic negative. A lit paper fragment inside a dark evidence surface can be a more credible final treatment. The coordinator owns the actual page compositions and their dark material decision.
