import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../../../../public/g2/g23/brand');
const manifest = {
  created: '2026-09-12',
  status: 'Reviewed material candidate; optional runtime application, not owner approval',
  selectedWordmark: '01-interval-optical',
  sourceBlend: 'blender/nivar-g23-selected-incision.blend',
  sourceScript: 'blender/selected-inscription.py',
  generator: 'Blender 5.2.1 LTS; Cycles, 64 samples, AgX',
  optimization: 'sharp WebP quality 94; resize only, no synthetic detail or generative processing. Quality 82 inspected and rejected for gradient banding.',
  geometry: 'Exact Interval SVG paths, cubic segments sampled at 32 steps; Boolean 0.24 mm incision in continuous substrate, 12 micron edge radius; pigment below surface',
  provenance: 'All geometry, procedural shaders and lighting authored locally for NIVAR; no stock models, textures, generated imagery or font dependency',
  usage: 'Short material signature or art-direction documentation. Retain flat SVG for navigation, document signature and Terminal. Never imply this is a photographed historical object.',
  files: [],
};
for (const mode of ['mineral', 'graphite']) {
  const source = path.join(here, 'blender', `selected-interval-${mode}.png`);
  for (const width of [900, 1600]) {
    const file = `nivar-incision-${mode}-${width}.webp`;
    await sharp(source).resize({ width }).webp({ quality: 94, effort: 6 }).toFile(path.join(runtime, file));
    const bytes = await fs.readFile(path.join(runtime, file));
    manifest.files.push({ file, width, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
  }
}
for (const file of ['blender/nivar-g23-selected-incision.blend', 'blender/selected-inscription.py']) {
  const bytes = await fs.readFile(path.join(here, file));
  manifest.files.push({ file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
}
await fs.writeFile(path.join(here, 'material-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest.files, null, 2));
