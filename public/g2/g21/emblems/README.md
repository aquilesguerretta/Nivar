# NIVAR G2.1 ceremonial character artwork

Six original AI-assisted intaglio interpretations of the owner's existing `public/patronos` concept art. These are identity illustrations, not documentary images or operational evidence.

Every character has a 600 px and 1200 px WebP. `FamilyEmblem` selects the density through srcSet when `variant="hero"` is requested. The default path remains vector for smaller marks: micro <=28 px; standard29–199 px; hero >=200 px. Explicit variants override that size rule.

All images are opaque mineral-paper artwork. They deliberately have no alpha channel. Light compositions can blend the paper with a matching substrate. A dark composition should preserve a light artifact or use a specifically reviewed dark treatment; blanket inversion was found to make faces look like photographic negatives.

Source concepts and final prompts: `docs/g2-dream-build/g2-1/brand/emblem-provenance.json`. Original generated PNGs: `docs/g2-dream-build/g2-1/brand/emblems/*-intaglio-study.png`. Exact derivative dimensions, sizes, hashes and transforms: `docs/g2-dream-build/g2-1/brand/emblem-runtime-manifest.json`.

The rejected metallic-medallion direction remains in the brand documentation and is not shipped here. The original owner-authored source artwork was not overwritten.
