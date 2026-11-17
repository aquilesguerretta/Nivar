// Tira de amostras dos tokens da Alexandria (bar §8, "Pacote de captura").
// Lê os hex de src/design/alexandria-tokens.ts e renderiza um PNG rotulado,
// para o critic comparar as cores não neutras do render (S2, ΔE00 ≤ 5).
//
// Uso: node tools/alexandria-capture/swatches.mjs --out <dir>

import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');

const outArg = process.argv.indexOf('--out');
const OUT = path.resolve(outArg > 0 ? process.argv[outArg + 1] : 'docs/alexandria-v2/captures');
const src = await fs.readFile('src/design/alexandria-tokens.ts', 'utf8');
const pairs = [...src.matchAll(/^\s*(\w+)\s*:\s*['"](#[0-9A-Fa-f]{6})['"]/gm)].map((m) => [m[1], m[2].toUpperCase()]);
const seen = new Set();
const uniq = pairs.filter(([k, v]) => !seen.has(k + v) && seen.add(k + v));

const html = `<body style="margin:0;background:#fff;font:12px/1.2 system-ui">
<div style="display:grid;grid-template-columns:repeat(6,160px)">${uniq
  .map(([k, v]) => `<div style="padding:6px"><div style="height:64px;background:${v};border:1px solid #999"></div><div>${k}</div><div>${v}</div></div>`)
  .join('')}</div></body>`;

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 960, height: 200 }, deviceScaleFactor: 1 });
await page.setContent(html);
await fs.mkdir(OUT, { recursive: true });
await page.screenshot({ path: path.join(OUT, 'token-swatches.png'), fullPage: true });
await fs.writeFile(path.join(OUT, 'token-swatches.json'), JSON.stringify(Object.fromEntries(uniq), null, 2));
await browser.close();
console.log(`${uniq.length} tokens → ${path.join(OUT, 'token-swatches.png')}`);
