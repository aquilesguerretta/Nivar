import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import crypto from 'node:crypto';

const directory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(directory, '../..');
const width = 1600;
const esc = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const cropOverride = { left: 0, top: 0, width: 807, height: 562 };
const sheets = [
  { file: 'finale-before-after.png', title: 'Diógenes · a mesma presença, outra luz', subtitle: 'Antes/depois de composição — não é um diff de pixels.', items: [
    { source: 'baseline/03-finale-footer-dark.png', crop: cropOverride, label: 'ANTES · tema escuro, superfície clara', caption: 'Baseline G2.2. Canvas excedente removido; conteúdo original reduzido pelo IAB.' },
    { source: 'evidence/house/finale-1440-dark-native.png', label: 'G2.3 · noite, observações e lacunas', caption: 'Captura nativa 1440 × 1000. Mesma pose; iluminação noturna derivada.' },
  ] },
  { file: 'terminal-before-after.png', title: 'Terminal Brasil · de leitura a análise preservável', subtitle: 'Estados diferentes declarados: uma região no baseline; comparação e foco no G2.3.', items: [
    { source: 'baseline/05-terminal-desktop-dark.png', crop: cropOverride, label: 'ANTES · região principal / leitura', caption: 'Baseline. Apenas canvas excedente recortado. Estado original preservado.' },
    { source: 'terminal/05-native1280-dark-focus.png', label: 'G2.3 · comparação / índice / foco', caption: 'Nativo 1280 × 720. Anterior ao reteste final da correção de recorte.' },
  ] },
  { file: 'patron-integration.png', title: 'Patronos · presença na composição', subtitle: 'Quatro famílias com captura G2.3. Software ainda sem captura final nesta montagem.', items: [
    { source: 'evidence/client/intelligence1440-dark.png', crop: cropOverride, label: '01 / ARGOS · Intelligence', caption: 'Override recortado. Composição examinada; leitura móvel apontada pela crítica.' },
    { source: 'evidence/client/advisory1440-dark.png', crop: cropOverride, label: '02 / SÓCRATES · Advisory', caption: 'Override recortado. A afirmação e suas premissas substituem o vídeo de arquivo.' },
    { source: 'evidence/client/academy1440-dark.png', crop: cropOverride, label: '03 / PERSEU · Academy', caption: 'Override recortado. A família introduz a propriedade; não reproduz suas trilhas.' },
    { source: 'evidence/client/hardware-native-replay-paused.png', label: '05 / HEFESTO · Hardware', caption: 'Nativo 1280 × 720. Filme de cobre pausado após replay explícito.' },
  ] },
];
const record = { created: '2026-09-12', operations: 'Crop only the known empty IAB canvas where specified; uniform downscale and labelled assembly. No content, wording, color, geometry, or UI state altered.', sheets: [] };
for (const sheet of sheets) {
  const rows = Math.ceil(sheet.items.length / 2);
  const height = 130 + rows * 620 + 42;
  const texts = [`<text x="30" y="48" font-size="30" font-family="Georgia">${esc(sheet.title)}</text>`, `<text x="30" y="83" font-size="16">${esc(sheet.subtitle)}</text>`];
  const overlays = [];
  const records = [];
  for (let index = 0; index < sheet.items.length; index++) {
    const item = sheet.items[index];
    const left = 30 + (index % 2) * 785;
    const top = 130 + Math.floor(index / 2) * 620;
    let input = sharp(path.join(packageRoot, item.source));
    if (item.crop) input = input.extract(item.crop);
    const result = await input.resize({ width: 755 }).png().toBuffer({ resolveWithObject: true });
    overlays.push({ input: result.data, left, top: top + 32 });
    texts.push(`<text x="${left}" y="${top + 8}" font-size="17" font-weight="600">${esc(item.label)}</text>`);
    const words = item.caption.split(' '); let lines = [''];
    for (const word of words) { if ((lines.at(-1) + word).length > 86) lines.push(''); lines[lines.length - 1] += word + ' '; }
    lines.forEach((line, n) => texts.push(`<text x="${left}" y="${top + 588 + n * 19}" font-size="13">${esc(line.trim())}</text>`));
    records.push({ ...item, outputImageWidth: 755, outputImageHeight: result.info.height });
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#ede8eb"/><g fill="#28252d" font-family="Arial,sans-serif">${texts.join('')}</g></svg>`;
  await sharp(Buffer.from(svg)).composite(overlays).png().toFile(path.join(directory, sheet.file));
  const bytes = await fs.readFile(path.join(directory, sheet.file));
  record.sheets.push({ file: sheet.file, width, height, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), sources: records });
}
await fs.writeFile(path.join(directory, 'provenance.json'), JSON.stringify(record, null, 2));
console.log(JSON.stringify(record.sheets.map(({ file, bytes }) => ({ file, bytes })), null, 2));
