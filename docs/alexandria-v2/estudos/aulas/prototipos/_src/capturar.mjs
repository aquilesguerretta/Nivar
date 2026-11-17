// Captura dos comps: 1440×900 (1º viewport), página inteira a 1440, 390×844 (1º viewport)
// e o filmstrip de dois quadros do palco (vazio | registrado → comparação).
// Uso: node capturar.mjs [slug ...]
import { createRequire } from 'node:module';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = require('playwright');

const AQUI = dirname(fileURLToPath(import.meta.url));
const SAIDA = join(AQUI, '..');
const TMP = process.env.PROTO_TMP || join(AQUI, '_tmp');
mkdirSync(TMP, { recursive: true });

const alvos = process.argv.slice(2);
const slugs = readdirSync(SAIDA).filter((f) => f.endsWith('.html')).map((f) => f.replace('.html', ''))
  .filter((s) => !alvos.length || alvos.includes(s));

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const relatorio = {};

async function abrir(ctx, url) {
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(250);
  return p;
}

for (const slug of slugs) {
  const url = pathToFileURL(join(SAIDA, slug + '.html')).href;
  const r = (relatorio[slug] = {});

  const d = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  let p = await abrir(d, url);
  r.d = await p.evaluate(() => ({
    iw: innerWidth, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight,
    fontes: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight).length,
    imgs: [...document.images].map((i) => i.naturalWidth > 0).filter((x) => !x).length,
    palcoTop: (() => { const e = document.querySelector('[data-palco]'); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; })(),
  }));
  await p.screenshot({ path: join(SAIDA, `${slug}-1440.png`) });
  await p.screenshot({ path: join(SAIDA, `${slug}-full.png`), fullPage: true });
  const palco = p.locator('[data-palco]').first();
  await palco.scrollIntoViewIfNeeded();
  await p.evaluate(() => { const l = document.querySelector('.loc'); if (l) l.style.position = 'static'; });
  const q1 = join(TMP, `${slug}-q1.png`);
  await palco.screenshot({ path: q1 });
  await p.close();

  p = await abrir(d, url + '?estado=registrado');
  await p.evaluate(() => { const l = document.querySelector('.loc'); if (l) l.style.position = 'static'; });
  const q2 = join(TMP, `${slug}-q2.png`);
  await p.locator('[data-palco]').first().screenshot({ path: q2 });
  await p.screenshot({ path: join(TMP, `${slug}-full-registrado.png`), fullPage: true });
  await p.close();
  await d.close();

  // filmstrip de dois quadros
  const f = await browser.newContext({ viewport: { width: 2200, height: 400 }, deviceScaleFactor: 1 });
  const fp = await f.newPage();
  const cap = (t, s) => `<figure><figcaption><b>${t}</b> · ${s}</figcaption><img src="${pathToFileURL(t === 'Quadro 1' ? q1 : q2).href}"></figure>`;
  const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#E7DAC0;font:15px Georgia,serif;color:#2A2620}
    .f{display:flex;gap:28px;padding:24px;align-items:flex-start;width:max-content}figure{margin:0}figcaption{margin:0 0 10px}img{display:block;border:1px solid #CFC1A4}
    h1{font:600 14px Georgia;letter-spacing:.06em;margin:24px 24px 0}</style>
    <h1>${slug} · palco em dois quadros</h1><div class="f">${cap('Quadro 1', 'estado inicial (vazio, referência velada)')}${cap('Quadro 2', 'registrado → comparação (mesmo cenário)')}</div>`;
  const fh = join(TMP, `${slug}-film.html`);
  writeFileSync(fh, html);
  await fp.goto(pathToFileURL(fh).href, { waitUntil: 'load' });
  await fp.screenshot({ path: join(SAIDA, `${slug}-registrado.png`), fullPage: true });
  await f.close();

  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  p = await abrir(m, url);
  r.m = await p.evaluate(() => ({ iw: innerWidth, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight,
    atoBottom: (() => { const e = document.querySelector('.ab .btn-pri, .ab [data-registrar]'); return e ? Math.round(e.getBoundingClientRect().bottom) : null; })() }));
  await p.screenshot({ path: join(SAIDA, `${slug}-390.png`) });
  await p.screenshot({ path: join(TMP, `${slug}-390-full.png`), fullPage: true });
  await p.close();
  await m.close();
  console.log(slug, JSON.stringify(r));
}
await browser.close();
