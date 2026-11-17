// Verificação medida no render (correções 2026-09-17): versões dsk/mob, véus e textos que não podem aparecer antes do registro.
// Uso: node verificar.mjs
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = require('playwright');
const AQUI = dirname(fileURLToPath(import.meta.url));
const SAIDA = join(AQUI, '..');
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });

// texto visível que NÃO pode estar na página antes do registro
const PROIBIDO = {
  'lupa-m12-a01': ['50,0', '~50', '49,7', '41,0'],
  'prancha-m01-a08': ['25,1'],
  'mesa-m13-a06': ['Crédito e estrutura de capital — categoria diferente', 'Alongamento sucessivo', 'Divergência acumulada entre o índice da receita e o da dívida acima de alguns pontos percentuais em doze meses; '],
  'dossie-m04-a07': ['R$ 480 mil', 'R$ 3,34 mi'],
};

for (const slug of ['prancha-m01-a08', 'lupa-m12-a01', 'mesa-m13-a06', 'dossie-m04-a07', 'serie-m02-a04', 'sistema-m01-a03']) {
  const url = pathToFileURL(join(SAIDA, slug + '.html')).href;
  for (const [w, h, q] of [[1440, 900, ''], [390, 844, ''], [1440, 900, '?estado=registrado'], [390, 844, '?estado=registrado']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto(url + q, { waitUntil: 'networkidle' });
    const r = await p.evaluate((proib) => {
      const vis = (e) => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length) && getComputedStyle(e).visibility !== 'hidden';
      const dsk = [...document.querySelectorAll('.dsk-only')].filter(vis).length;
      const mob = [...document.querySelectorAll('.mob-only')].filter(vis).length;
      // innerText do Chrome inclui <text> de SVG oculto: medir o nó de texto pelo retângulo, não pelo innerText
      const vivos = [];
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n; while ((n = tw.nextNode())) { const e = n.parentElement; const rr = e.getBoundingClientRect(); if (rr.width > 0 && rr.height > 0 && getComputedStyle(e).visibility !== 'hidden') vivos.push(n.textContent); }
      const txt = vivos.join(' ');
      const vaz = proib.filter((t) => txt.includes(t));
      // texto cortado em SVG: rótulos que passam da viewBox
      const cortes = [];
      document.querySelectorAll('svg').forEach((s) => {
        if (!vis(s) || !s.viewBox || !s.viewBox.baseVal || !s.viewBox.baseVal.width) return;
        const vb = s.viewBox.baseVal;
        s.querySelectorAll('text:not([transform])').forEach((t) => {
          if (!(t.getBoundingClientRect().width > 0)) return;
          try { const b = t.getBBox(); if (b.x < vb.x - 2 || b.x + b.width > vb.x + vb.width + 2) cortes.push(t.textContent.slice(0, 40)); } catch (e) {}
        });
      });
      const ato = document.querySelector('.ab [data-registrar]');
      return { dsk, mob, sw: document.documentElement.scrollWidth, vaz, cortes, atoBottom: ato ? Math.round(ato.getBoundingClientRect().bottom) : null };
    }, q ? [] : PROIBIDO[slug] || []);
    console.log(slug, w, q || 'inicial', JSON.stringify(r));
    await ctx.close();
  }
}
await browser.close();
