# G2.1 brand / typography reference dossier fragment

Date: 11 September 2026. Sources were opened as actual pages, captured in native Chrome, and inspected beside the local comparison. The Chrome MCP screenshot route timed out on two pages; the equivalent native CDP capture recovered every reference without changing the reference page. Capture data: `reference-captures.json`.

## Logobook / N archive

- URL: https://logobook.com/letter/n/
- Screen: first twelve N marks, then the next archive row.
- Captures: `references/logobook-n-1440-0.png`, `references/logobook-n-1440-650.png`.
- Observed mechanism: NIDA uses one forceful diagonal with a cut at the bottom; Nicola Tilling uses a continuous thin path within a dark square; NEPTCO repeats curved strips to form one recognizable letter. Their silhouette carries recognition before detail does.
- Why it works: repeated direction and controlled negative space make one form legible at a glance. The formal intervention has a clear limit.
- Translate: one aperture language across NIVAR's A and R, ordinary rhythm elsewhere. Build the five letters as an optical whole, then test the nameplate at 16 and 24 px.
- Do not copy: these marks, the NIDA cut or the NEPTCO ribbon construction. NIVAR's vectors were drawn from scratch.
- Surface: navigation, publication masthead, equipment identifier, video title.
- Test: compare the three original paths in `index.html?mode=marks`; inspect the actual small specimens and dark reversals, not only the oversized word.

## Typewolf / Fraunces

- URL: https://www.typewolf.com/fraunces
- Screen: description, specimen, suggested pairing and Flask & Field example.
- Captures: `references/typewolf-fraunces-1440-270.png`, `references/typewolf-fraunces-1440-880.png`.
- Observed mechanism: the serif's lively shapes supply considerable personality even in a simple paragraph; the observed site example uses it as a continuous expressive reading voice.
- Why it works: the voice is in the letterforms rather than an added illustration or color field.
- Translate: test Fraunces in a full product system, including italic Portuguese and small data neighbors.
- Do not copy: the site's wine-market tone, swashes, palette or complete pairing.
- Surface: Portal and Energy Brief.
- Test: System C uses the same content as A/B. It was retained as a rejected study because the italic headline becomes more mannered than the chosen Literata system.

## Fontshare / General Sans

- URL: https://www.fontshare.com/fonts/general-sans
- Screen: family opening, giant General Sans specimen and designer attribution.
- Captures: `references/fontshare-general-sans-1440-0.png`, `references/fontshare-general-sans-1440-1150.png`.
- Observed mechanism: generous open counters, low contrast, broad letter shapes and a strong x-height stay confident on the dark specimen surface.
- Why it works: the reading face does not need extra ornament to occupy a large field.
- Translate: this informed the product-reading brief, particularly the decision to compare Manrope and DM Sans in live paragraph content.
- Do not copy: a giant type specimen is not evidence of table or mobile performance. General Sans is not shipped in this experiment; the page's closed-source license is distinct from the selected OFL families.
- Surface: reading, navigation, operator rows.
- Test: compare line breaks and density in the three product specimens.

## Google Fonts / Literata; TypeTogether upstream

- URLs: https://fonts.google.com/specimen/Literata and https://github.com/googlefonts/literata
- Screen: live Literata family specimen and its source distribution.
- Captures: `references/literata-1440-0.png`, `references/literata-1440-550.png`.
- Observed mechanism: the upright has clear differences between thick stems, fine joins and sturdy serifs; its large forms retain reading character instead of becoming a theatrical display face. Optical sizing allows the same family to serve different sizes.
- Why it works: interpretation can acquire weight without borrowing a decorative classical identity.
- Translate: upright Literata for arguments and reading titles; real italic for selected interpretation. Manrope supplies the product voice, Geist Mono the evidence voice.
- Do not copy: the specimen's scale or default language. Do not italicize every last headline line as a template.
- Surface: public interpretation and editorial pages.
- Test: identical real Portuguese at 1440 and 390 widths, including accents, dates, symbols, longer paragraphs and operator labels. Read the body's `fontStatus` and loaded-family array in `render-checks.json`.

## NASA / brand architecture and production variants

- URL: https://www.nasa.gov/nasa-brand-center/brand-guidelines/
- Screen: insignia variants, typography hierarchy, and crew/mission versus primary identifier rules.
- Captures: `references/nasa-brand-1440-550.png`, `references/nasa-brand-1440-2100.png`, `references/nasa-brand-1440-architecture.png`; the last capture shows crew/mission and project identifier architecture.
- Observed mechanism: primary identity, supplemental logotype and mission identifiers have separate jobs. Full-color and one-color variants are deliberately prepared; centering accounts for the emblem's underlying circle instead of blindly centering every protrusion.
- Why it works: a visually rich emblem can coexist with a durable parent identity because roles and optical behavior are explicit.
- Translate: NIVAR owns the header; each family character becomes a substantial chapter object. Prepare distinct micro, standard and ceremonial assets instead of shrinking a portrait indiscriminately. Center by the intended disk, not every extending hand or thread.
- Do not copy: NASA's lettering, marks, mission art or rules as if they governed NIVAR. NASA's crew-emblem restrictions differ from NIVAR's commercial family structure. This is an architectural analogy, not an endorsement or borrowed identity.
- Surface: header, family hero, publication and family navigation.
- Test: primary name remains recognizable while the family character changes; the emblem is visible at chapter scale and still recognizable as a reduced symbol.

## Primary type licensing sources

Selected sources: https://fonts.google.com/specimen/Literata , https://fonts.google.com/specimen/Manrope , https://vercel.com/font .

Additional compared systems: https://www.ibm.com/plex/ , https://github.com/undercasetype/Fraunces , https://fonts.google.com/specimen/DM+Sans , https://fonts.google.com/specimen/DM+Mono .

All nine downloaded families have an original `fonts/*-OFL.txt` copied from Google's official font repository. Exact original binary URL, Google Fonts CSS source URL, local filename and bytes are recorded in `font-provenance.json`; the downloader is reproducible in `download-fonts.mjs`. No paid font was downloaded or approximated. Production delivery includes only Literata, Manrope and Geist Mono, at `public/g2/g21/fonts/`, retaining all three licenses.

## Penpot: actual attempt and limitation

The Penpot High-Level Overview was read before any call. A read-only `execute_code` request for `penpotUtils.getPages()` returned: “No Penpot instance connected for user token. Please ensure that Penpot is connected and that the MCP client connection is using the correct token.” No board was created and no existing Penpot file was modified. `index.html`, `brand-table.svg`, and the original SVG files are the editable local design table. They are not described as a connected Penpot contribution.
