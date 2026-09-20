# NIVAR G2 asset provenance

Status: **G2 EXPERIMENTAL — owner review pending.** Generated on 2026-09-11.

These assets are visual communication. They are **not evidence, actual measurement, real infrastructure documentation, photographs of NIVAR employees, or images of a shipping NIVAR device.** Runtime captions should say `Ilustração gerada` or, for the Hardware specimen, `Estudo conceitual · imagem gerada`.

## Runtime assets

| Asset | Purpose | Production source | Runtime size |
| --- | --- | --- | --- |
| `public/g2/evidence-specimen.webp` | Hero poster: one graphite calibration object and pale evidence layers | Higgsfield GPT Image 2, job `dd1d1691-7631-4dd3-b240-e683f1be687d` | 1600 × 1063, 126,248 bytes |
| `public/g2/hardware-measurement.webp` | Hardware material/measurement illustration | Higgsfield GPT Image 2, job `f6adf101-5291-4bce-94a7-378ff2dc8103` | 1600 × 1063, 174,162 bytes |
| `public/g2/academy-study.webp` | Human study behavior, editorial Academy illustration | Higgsfield GPT Image 2, job `ae1d0a6e-9eaf-4541-a620-c7867b52026a` | 1600 × 1063, 125,392 bytes |
| `public/g2/evidence-source-motion.mp4` | Text-free moving source for the native coded causal hero | Higgsfield Seedance 2.5, job `c535d033-ca80-4767-9a92-fef9e94a7764` | 6.042 seconds, H.264 1280 × 720, 476,035 bytes, no audio |

Image-generation settings: GPT Image 2, high quality, 2K, 3:2. Originals are 2048 × 1360. Runtime WebP derivatives were resized to 1600 pixels and encoded at quality 86 in Higgsfield's media sandbox.

Video generation settings: Seedance 2.5, 1080p, 16:9, six seconds, start-image reference = evidence-specimen generation. Original video is HEVC 1920 × 1080 at 24 fps and 3,708,636 bytes. Runtime was encoded as H.264 with CRF 25, `yuv420p`, and fast-start; no audio was generated or added. This source clip does **not** by itself satisfy the complete causal film requirement; that requires the native six-stage sequence.

## Inspection

All three full-resolution originals were visually inspected with `view_image`. The selected images have consistent graphite/mineral material, restrained oxide detail, clear human action, and no meaningful data or factual textual claim.

The video was inspected through six evenly spaced frames in `motion/source-motion-contact.jpg`. The instrument geometry and evidence-plate count remain stable during the restrained camera move. It contains no captions, source labels, UI, statistics, or market claims. `motion/source-probe.json` records the source stream metadata.

Full generation prompts, IDs, and settings are in `asset-generation-prompts.json`. Original image files are in `renders/`.

## Editable 3D study

Private Higgsfield 3D Jutsu project: [NIVAR evidence instrument](https://higgsfield.ai/3d-jutsu/99716f40-5ff0-43e5-b402-92b8ef509871).

The scene is custom, constructed from editable geometry in metres, with named material and evidence-layer roles. The script is `motion/evidence-instrument.py`. It does not import third-party models or textures. The connected local Blender MCP could not connect to its addon, so this study uses Higgsfield-hosted Blender 5.2.

Exports completed and inspected at revision 1; see the 3D verification section below.

## Reference and rights boundary

The user authorized generation spend for the G2 branch. The output uses no downloaded third-party photography or stock model. No third-party image was used as a generation reference. The video references our generated poster.

[Vitsœ's good-design principles](https://www.vitsoe.com/us/about/good-design) informed the restraint and legibility of physical parts: purposeful material, clear structure, and an honest distinction between a concept and an actual capability. No Vitsœ imagery, text, logo, or product geometry was copied into the assets. An attempted Braun design-page fetch did not resolve; it was not used as evidence.

## SHA-256

- Evidence poster: `cba52afe40163f47ea0daee7c0365af7aa775a2157b7154d45c01c745b1a23f1`
- Hardware image: `50f085fd1d46bd5792beae10128b2bf0ab3854ad907ae393e321a4acb2f17dec`
- Academy image: `a8cd353fdc947e8c1832878d787ad9cbb114b5e0e648e4a3c27786e8eaba8f5b`

## 3D verification completed

Scene revision **1**, operation `5c767e16-d2cb-47cd-8f5b-d84db6270de1`, completed successfully. Delivery-camera Eevee render was retrieved and visually inspected: solid concentric instrument, three evidence discs, continuous physical contacts, restrained light, no missing textures. `renders/evidence-instrument-poster.png` is the 1200 × 800 inspection render. The portable GLB is `public/g2/evidence-instrument.glb` (373,408 bytes), and the editable Blender file is `motion/evidence-instrument.blend` (929,264 bytes). GLB header and JSON were independently checked in Node: valid glTF 2 container, eleven meshes, six named PBR material roles, fifteen semantic nodes, embedded geometry, punctual lights. The GLB is a static editable scene; it does not contain a six-stage causal animation. Its portable lighting can differ from Blender. An interactive preview of exact revision 1 was shown through 3D Jutsu. The scripted file remains sufficient to reproduce the designed geometry.

## Reservoir context image

Owner G1 reference boards `02_Portal_Dados_para_decisoes_mais_reais.png` and `03_Portal_Compreender_para_decidir_melhor.png` were inspected after they became available. Their long water plane, layered terrain, restrained sky, and infrastructure occupying a smaller portion of the composition informed this image. They were not uploaded as generation inputs; no text or imagery was extracted from them.

New original: `renders/reservoir-landscape.png`, GPT Image 2 through Higgsfield, job `5fdde0fb-037a-44d2-a571-806fa662e55d`, high quality / 4K / 16:9, 3840 × 2160. Subject is an **unnamed invented hydroelectric landscape**, not any real named dam. Never caption it as Furnas, Belo Monte, an ONS record, or other measured infrastructure evidence. Suggested caption: `Paisagem ilustrativa · imagem gerada`.

The 4K original and final crop were visually inspected. Final 2:1 composition keeps the full dam and three terrain layers; neutral gray-lavender sky and graphite water remain consistent with G1.

- `public/g2/reservoir-landscape.webp`: 2400 × 1200, 374,516 bytes. SHA-256: `7be11adb606d11338a636100f86ec31ee3a522d544f95c200d4a718fa1224530`.
- `public/g2/reservoir-landscape-small.webp`: 1000 × 500, 73,120 bytes. SHA-256: `254e58510bdd68088416d6d7c5e92986e3157fc15c2d3eec8fb127d1047f5239`.

Both derivatives were cropped symmetrically to 2:1 and encoded at WebP quality 86 in the Higgsfield media sandbox. Use responsive `srcSet` with the small derivative for narrow/mobile placements.
