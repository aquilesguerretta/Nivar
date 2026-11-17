// Captura quadro a quadro de telas reais da Alexandria (dev server da worktree).
// Reaproveita as fixtures de rede do harness tools/alexandria-capture (somente leitura).
// Uso: node cena.mjs <cena> <outDir>
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { FIXTURES, FIXED_TIME, SEM_REGISTRO } from 'file:///C:/dev/gridalpha-v2-alexandria-v3/tools/alexandria-capture/fixtures.mjs';

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');
const BASE = 'http://127.0.0.1:5321';
const AULA8 = '/alexandria/trilha/trilha-fundamentos-universais/modulo/modulo-01/aula/8';
const [cena, outDir] = process.argv.slice(2);
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
async function abrir(rota, estado, { vw = 1440, vh = Number(process.env.VH || 810), dpr = 4 / 3 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr, reducedMotion: 'reduce', locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date(FIXED_TIME));
  const fx = FIXTURES[estado];
  await page.route('**/api/**', async (route) => {
    const p = new URL(route.request().url()).pathname;
    const json = (s, b) => route.fulfill({ status: s, contentType: 'application/json', body: JSON.stringify(b) });
    if (p === '/api/auth/me') return fx.user ? json(200, { user: fx.user }) : json(401, { detail: 'Não autenticado.' });
    if (p === '/api/products/me') return fx.user ? json(200, { products: [{ productId: 'alexandria', activatedAt: '2026-08-01T12:00:00.000Z' }], catalog: ['alexandria'] }) : json(401, {});
    if (p === '/api/progress/me') return fx.progress ? json(200, { data: fx.progress }) : json(401, {});
    if (p.startsWith('/api/progress/aulas/')) {
      const st = fx.aulas[decodeURIComponent(p.split('/').pop())];
      if (!fx.user) return json(401, {});
      return st ? json(200, { data: st }) : json(404, {});
    }
    if (p === '/api/progress/events') return fx.user ? json(200, { eventId: 'fx', occurredAt: FIXED_TIME, streak: fx.progress?.streak ?? SEM_REGISTRO }) : json(401, {});
    return route.continue();
  });
  await page.goto(BASE + rota, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  return { ctx, page };
}
let n = 0;
const foto = async (page, nome) => {
  const f = nome ?? `q${String(n++).padStart(4, '0')}.png`;
  await page.screenshot({ path: path.join(outDir, f), fullPage: false });
  return f;
};
// rola o contêiner que de fato rola (o shell pode rolar dentro de <main>)
const rolarAte = (page, y) => page.evaluate((y) => {
  const rolavel = () => { const c=[...document.querySelectorAll("body *")].filter(e=>{const cs=getComputedStyle(e);return /(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+4}); c.sort((a,b)=>b.scrollHeight-a.scrollHeight); return c[0]||document.scrollingElement; };
  const alvo = rolavel();
  alvo.scrollTo(0, y);
}, y);
const topoDe = (page, sel) => page.evaluate((sel) => {
  const el = document.querySelector(sel); if (!el) return null;
  const rolavel = () => { const c=[...document.querySelectorAll("body *")].filter(e=>{const cs=getComputedStyle(e);return /(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+4}); c.sort((a,b)=>b.scrollHeight-a.scrollHeight); return c[0]||document.scrollingElement; };
  const alvo = rolavel();
  return el.getBoundingClientRect().top + alvo.scrollTop;
}, sel);
const longa = async (page, nome) => {
  // página inteira: solta a altura dos contêineres de rolagem e fotografa tudo
  await page.evaluate(async () => {
    const rolavel = () => { const c=[...document.querySelectorAll("body *")].filter(e=>{const cs=getComputedStyle(e);return /(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+4}); c.sort((a,b)=>b.scrollHeight-a.scrollHeight); return c[0]||document.scrollingElement; };
    const main = rolavel();
    if (main && main !== document.scrollingElement) {
      for (let el = main; el && el !== document.documentElement; el = el.parentElement) {
        el.style.setProperty('height', 'auto', 'important'); el.style.setProperty('max-height', 'none', 'important'); el.style.setProperty('overflow', 'visible', 'important');
      }
      document.documentElement.style.setProperty('height', 'auto', 'important');
      document.body.style.setProperty('height', 'auto', 'important');
      document.body.style.setProperty('overflow', 'visible', 'important');
    }
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outDir, nome), fullPage: true });
};

if (cena === 'longas') {
  for (const [nome, rota, est] of [['trilhas-e0', '/alexandria/trilhas', 'E0'], ['aula8-e2', AULA8, 'E2'], ['home-e2', '/alexandria', 'E2'], ['glossario-e0', '/alexandria/glossario', 'E0'], ['biblioteca-e0', '/alexandria/biblioteca', 'E0']]) {
    const { ctx, page } = await abrir(rota, est);
    await longa(page, `${nome}-longa.png`);
    await ctx.close();
  }
}

if (cena === 'previsao') {
  // a previsão: campo vazio → digita 4, 0 → registra → o quadro previsto × calculado aparece
  const { ctx, page } = await abrir(AULA8, 'E2');
  const yAto = await topoDe(page, '[data-capture="ato-campo"]');
  console.log('y do campo', yAto);
  for (let i = 0; i < 6; i++) await foto(page);
  await page.click('[data-capture="ato-campo"]');
  for (let i = 0; i < 6; i++) await foto(page);
  await page.keyboard.type('4'); for (let i = 0; i < 5; i++) await foto(page);
  await page.keyboard.type('0'); for (let i = 0; i < 10; i++) await foto(page);
  await page.hover('[data-capture="ato-registrar"]'); for (let i = 0; i < 4; i++) await foto(page);
  await page.click('[data-capture="ato-registrar"]');
  await page.waitForTimeout(500);
  for (let i = 0; i < 12; i++) await foto(page);
  await longa(page, 'apos-registro-longa.png');
  await ctx.close();
}

if (cena === 'regua') {
  // o instrumento: registra a previsão, rola até a régua e a move pelo teclado (mesmo caminho de quem usa Tab)
  const { ctx, page } = await abrir(AULA8, 'E2');
  await page.click('[data-capture="ato-campo"]');
  await page.keyboard.type('40');
  await page.click('[data-capture="ato-registrar"]');
  await page.waitForTimeout(1500);
  const y = await topoDe(page, '[data-capture="instrumento-controle"]');
  console.log('y da régua', y);
  await rolarAte(page, Math.max(0, y - 330));
  await page.mouse.move(1300, 300); // cursor fora da prancha
  await page.waitForTimeout(600);
  const bb = await page.locator('[data-capture="instrumento-controle"]').boundingBox();
  const xDe = (f) => bb.x + 10 + f * (bb.width - 20);
  const yR = bb.y + bb.height / 2;
  const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const arrasta = async (f0, f1, quadros) => {
    for (let i = 1; i <= quadros; i++) { await page.mouse.move(xDe(f0 + (f1 - f0) * suave(i / quadros)), yR); await page.waitForTimeout(25); await foto(page); }
  };
  for (let i = 0; i < 18; i++) await foto(page);
  const f0 = 220000 / 876000;
  await page.mouse.move(xDe(f0), yR); await page.mouse.down();
  await arrasta(f0, 0.5, 40);           // 25,1 % → 50 %
  for (let i = 0; i < 16; i++) await foto(page);
  await arrasta(0.5, 0.16, 46);         // → 16 %
  for (let i = 0; i < 12; i++) await foto(page);
  await arrasta(0.16, f0, 30);          // de volta ao cenário
  await page.mouse.up(); await page.mouse.move(1300, 300);
  for (let i = 0; i < 16; i++) await foto(page);
  const v = await page.getAttribute('[data-capture="instrumento-controle"]', 'aria-valuetext');
  console.log('valor final', v);
  await ctx.close();
}

if (cena === 'registro') {
  // o registro: a aula com a previsão registrada, rolada até "Registro da aula"
  const { ctx, page } = await abrir(AULA8, 'E2');
  await page.click('[data-capture="ato-campo"]');
  await page.keyboard.type('40');
  await page.click('[data-capture="ato-registrar"]');
  await page.waitForTimeout(1500);
  await longa(page, 'aula8-registrada-longa.png');
  await ctx.close();
}

await browser.close();
console.log(cena, 'quadros', n);
