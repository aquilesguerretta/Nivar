import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const directory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(directory, '../..');
const repositoryRoot = path.resolve(packageRoot, '../../..');
const packagePath = 'docs/g2-dream-build/g2-3';
const copper = JSON.parse(await fs.readFile(path.join(packageRoot, 'assets/copper-motion/manifest.json'), 'utf8'));
const vector = JSON.parse(await fs.readFile(path.join(packageRoot, 'art-direction/selected-brand-manifest.json'), 'utf8'));
const material = JSON.parse(await fs.readFile(path.join(packageRoot, 'art-direction/material-manifest.json'), 'utf8'));
const indexHtml = await fs.readFile(path.join(repositoryRoot, 'index.html'), 'utf8');
const faviconHookPath = 'src/components/g2/use-nivar-favicon.ts';
const faviconHook = await fs.readFile(path.join(repositoryRoot, faviconHookPath), 'utf8');
const faviconConsumers = [];
for (const relative of ['src/components/g2/NivarShell.tsx', 'src/pages/terminal-brasil/TerminalBrasil.tsx']) {
  const source = await fs.readFile(path.join(repositoryRoot, relative), 'utf8');
  if (source.includes('useNivarFavicon();')) faviconConsumers.push(relative);
}
async function describe(relative) {
  const buffer = await fs.readFile(path.join(repositoryRoot, relative));
  let dimensions = {};
  if (/\.(png|webp|svg)$/i.test(relative)) {
    const metadata = await sharp(buffer).metadata();
    dimensions = { width: metadata.width, height: metadata.height, format: metadata.format };
  }
  return { path: relative, bytes: buffer.length, sha256: crypto.createHash('sha256').update(buffer).digest('hex'), ...dimensions };
}
const files = [];
for (const folder of ['brand', 'finale', 'hardware']) {
  const names = (await fs.readdir(path.join(repositoryRoot, 'public/g2/g23', folder))).sort();
  for (const name of names) {
    const item = await describe(`public/g2/g23/${folder}/${name}`);
    if (folder === 'brand') {
      item.provenanceId = name.includes('incision') ? 'blender-incision' : 'interval-optical';
      item.runtimeStatus = name.includes('incision') ? 'research-only; not referenced by the page' : name.startsWith('favicon') ? (faviconHook.includes(`/g2/g23/brand/${name}`) && faviconConsumers.length ? `runtime favicon installed by ${faviconHookPath}; consumers: ${faviconConsumers.join(', ')}; hook removes only its own link on unmount` : indexHtml.includes(`/g2/g23/brand/${name}`) ? 'referenced by index.html' : 'prepared export; no runtime reference observed') : 'standalone vector deliverable; selected contours are inline in Brand.tsx';
    } else if (folder === 'finale') {
      item.provenanceId = 'diogenes-night';
      item.runtimeStatus = 'used by HouseFinale in dark theme; light source remains G2.2';
    } else {
      item.provenanceId = 'copper-motion';
      item.runtimeStatus = name.endsWith('.mp4') ? 'used by CopperStudy; source assigned after explicit play, once then replay' : 'used by CopperStudy as initial and reduced-motion poster';
      if (name.endsWith('.mp4')) Object.assign(item, copper.derivative_probe);
    }
    files.push(item);
  }
}
const sourceFiles = [];
for (const name of ['assets/diogenes-night-original.png', 'assets/copper-motion/copper-original.mp4', 'art-direction/blender/nivar-g23-selected-incision.blend', 'art-direction/blender/selected-inscription.py', 'art-direction/wordmarks/candidates.json']) {
  sourceFiles.push(await describe(`${packagePath}/${name}`));
}
const manifest = {
  schemaVersion: 1,
  created: '2026-09-12',
  pathBase: 'repository-root; paths are portable and do not contain workstation drive names',
  status: 'Review draft. Runtime membership observed in source; final integrated QA and owner approval are not asserted.',
  branch: 'wave/nivar-g2-dream-build',
  openingCommit: '67f3074bd5197e2f18b9ea084501acf989c024e3',
  finalCommit: null,
  finalCommitStatus: 'The documentation/package commit follows the implementation commits and is not self-referenced in this artifact',
  implementationCommit: '9c544965210fe6da1943ef339ec4e08f7c9263d7',
  implementationCommits: ['fe0c9e6fdcb486c267895ca07a63471615e8f995', '9c544965210fe6da1943ef339ec4e08f7c9263d7'],
  totals: { newPublicFiles: files.length, newPublicBytes: files.reduce((sum, item) => sum + item.bytes, 0) },
  files,
  sourceFiles,
  provenance: {
    'interval-optical': {
      source: `${packagePath}/art-direction/wordmarks/candidates.json`,
      tool: 'Authored SVG paths; sharp for PNG favicon export and comparison rasterization',
      selected: vector.selected,
      selectionAuthority: 'Coordinating design review of actual contact sheets; not owner acceptance',
      viewBox: vector.viewBox,
      microRule: vector.microRule,
      rights: vector.rights,
      runtime: 'Flat, single-color inline SVG. All three candidate comparisons are retained.',
      favicon: { hook: faviconHookPath, observedConsumers: faviconConsumers, behavior: 'Append a dedicated SVG icon link on mount, remove that link on unmount; keep existing document icon links intact. Source inspection is not a browser transition test.' },
      records: [`${packagePath}/art-direction/selected-brand-manifest.json`, `${packagePath}/art-direction/integration.md`, `${packagePath}/art-direction/brand-comparison.html`],
    },
    'blender-incision': {
      source: `${packagePath}/art-direction/blender/nivar-g23-selected-incision.blend`,
      tool: material.generator,
      geometry: material.geometry,
      processing: material.optimization,
      rights: material.provenance,
      runtime: 'Research-only. The flat SVG was selected for page legibility; no incision bitmap is mounted in the page.',
      rejectionHistory: 'First overlit/extruded comparative renders preserved. Corrected shallow incision preserved. WebP quality 82 rejected for gradient banding; derivatives use quality 94.',
      records: [`${packagePath}/art-direction/material-manifest.json`, `${packagePath}/art-direction/material-study.html`],
    },
    'diogenes-night': {
      source: `${packagePath}/assets/diogenes-night-original.png`,
      reference: 'public/g2/g22/finale/diogenes-gesture-1536.webp',
      tool: 'Native OpenAI ImageGen image edit, executed by coordinating agent',
      treatment: 'Preserve the approved wide patron pose and lantern relationship; derive a dark lighting and material field. Existing light image remains unchanged.',
      prompt: null,
      promptStatus: 'Exact full prompt was not retrieved. The following is a recorded reconstruction of prompt intent supplied by the coordinating agent, not a verbatim tool-call transcript.',
      promptIntentReconstruction: 'Preserve the exact approved face, arm, hand, lantern and crop. Derive a warm graphite #181719 nocturnal field with physically lit engraved crosshatching, never a color inversion. Preserve empty dark space across the left 40% of the composition. Keep a small amber flame. Add no objects or text.',
      promptIntentRecordSource: 'Coordinating-agent message, 2026-09-12, reporting the native ImageGen edit intent',
      generationId: null,
      rights: 'AI-derived illustration from the project’s approved existing patron artwork. Not a photograph or a claim about a real person’s observed appearance.',
      processing: 'Two responsive WebP derivatives of retained native image output; no claim of new historical photography.',
    },
    'copper-motion': {
      ...copper.generation,
      rights: copper.rights_and_provenance,
      processing: copper.processing,
      originalProbe: copper.original_probe,
      reviewedFrames: copper.review,
      runtime: 'Integrated as an explicit-play study. Initial source absent, play, end, replay and pause exercised. A later fixture blocked only the MP4 with 503: human error, poster retained, paused state and retry confirmed. No hard loop.',
      records: [`${packagePath}/assets/copper-motion/manifest.json`, `${packagePath}/assets/copper-motion/review.html`, `${packagePath}/evidence/client/independent-browser-qa.md`],
    },
  },
  retainedExistingAssets: [
    { path: 'public/g2/g22/finale/diogenes-gesture-1536.webp', role: 'Approved wide Diogenes, light theme and reference for night derivation', changedByAssetWork: false },
    { path: 'public/g2/g22/finale/diogenes-gesture-900.webp', role: 'Approved light-theme responsive derivative', changedByAssetWork: false },
    { path: 'public/g2/g21', role: 'Approved family patrons, landscape and original brand history remain their own provenance; no new anonymous stock icons replace them', changedByAssetWork: false },
    { path: 'docs/g2-dream-build/g2-2/reference-pack/NIVAR_G2_2_REFERENCE_PACK/03-docs/REAL_BRAZIL_MEDIA.md', role: 'Real Brazil photography provenance remains independent from synthetic MW and price samples', changedByAssetWork: false },
  ],
  fontLicenses: ['literata', 'manrope', 'geistmono'].map(name => ({ path: `public/g2/g21/fonts/${name}-OFL.txt`, license: 'SIL Open Font License; existing files reused, no new font introduced by G2.3 asset work' })),
  evidencePolicy: 'Native screenshots preferred. Contact sheets crop only declared empty IAB canvas and resize proportionally; no UI state, wording, color or geometry is retouched. Contact-sheet provenance is separate.',
  evidenceManifest: `${packagePath}/evidence/contact-sheets/provenance.json`,
  finalNativeContactManifest: `${packagePath}/evidence/contact-sheets/final-native-provenance.json`,
  reviewRecordingsManifest: `${packagePath}/evidence/motion/final-recordings-manifest.json`,
  finalBrowserQA: `${packagePath}/qa/browser-final.md`,
  limitations: ['Original image-to-video material is generated and does not document a verified installation.', 'Frame inspection does not exclude every transient generative artifact.', 'No physical device QA, live customer upload, deployment, merge or owner acceptance is asserted.', '209 Alexandria hashes and 113 protected files passed final integrity checks; production route smoke is recorded separately.', 'Diogenes prompt intent is a declared reconstruction; the exact full prompt and generation ID were not retrieved.'],
};
await fs.writeFile(path.join(packageRoot, 'asset-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest.totals));
