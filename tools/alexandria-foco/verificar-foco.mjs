// verificar-foco.mjs — o foco e a caixa das aulas, medidos no render
// (SISTEMA.md §2.6.1 L12 e §2.6 T13).
//
// Uso:
//   node tools/alexandria-foco/verificar-foco.mjs [--rotas tools/alexandria-foco/rotas.json]
//                                                 [--base http://127.0.0.1:5311] [--only <regex>]
//
// POR QUE ELE EXISTE.
//
// A L12 nasceu de um defeito que nenhuma leitura de código pega: a marca de
// foco da casa é um PSEUDO-ELEMENTO, e `input`, `select` e `textarea` são
// replaced elements — não desenham `::after`. O campo de previsão, que é o
// primeiro ato e a porta do loop, recebia foco de teclado sem marca nenhuma,
// a 1440 e a 390. O código estava certo em toda linha; o render, não.
//
// O DEFEITO IRMÃO é o da caixa: um rótulo com `white-space: nowrap` numa
// coluna estreita não quebra — SANGRA. Foi assim que "Registrar os três
// sinais" pediu 264 px numa coluna de ato de 244 a 390, e assim que a
// cabeceira do INST·06 imprimiu o modo por cima do nome do instrumento
// (D1 da r12). Os dois são "o elemento não cabe e ninguém avisa".
//
// O QUE ELE MEDE, para cada rota e cada largura da régua:
//
//   1. FOCO VISÍVEL EM TODO CONTROLE FOCÁVEL. Foca um a um e aceita a marca
//      em quatro lugares: `outline` no próprio elemento, `::after`/`::before`
//      no próprio, ou `::after`/`::before` no HOSPEDEIRO (o pai direto) — que
//      é onde a L12 mandou a marca dos campos morar.
//   2. FOCO NUNCA COBERTO. O rolador da Alexandria é o `<main>`, não a
//      janela: o cabeçalho é IRMÃO do rolador e não pode cobrir nada. Quem
//      cobre é o que está colado DENTRO dele (o quadro previsto × calculado é
//      `sticky` a 390). Depois de focar, compara o retângulo do controle com
//      o de cada elemento colado.
//   3. TEXTO QUE SANGRA DA PRÓPRIA CAIXA: `scrollWidth > clientWidth` com
//      `overflow: visible`. É a assinatura do rótulo `nowrap` numa coluna que
//      encolheu, e do título que despenca uma palavra por linha.
//
// Nada aqui é heurística de aparência: são três medidas de geometria.

import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const SPEC = path.resolve(args.rotas ?? 'tools/alexandria-foco/rotas.json');
const spec = JSON.parse(await fs.readFile(SPEC, 'utf8'));
const BASE = args.base ?? spec.base ?? 'http://127.0.0.1:5311';
const ONLY = args.only ? new RegExp(args.only) : null;

const browser = await chromium.launch({
  headless: true,
  channel: 'chrome',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
});

/** Tudo que a varredura faz dentro da página. Uma função só, porque cada
 *  `.focus()` muda o layout e as três medidas precisam ver o mesmo estado. */
async function medir(page) {
  return page.evaluate(async () => {
    const visivel = (e) => {
      const b = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
    };
    const nome = (e) =>
      (e.textContent || e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.getAttribute('title') || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 46);

    // (3) texto que sangra da própria caixa
    const sangra = [];
    for (const e of document.querySelectorAll('h1,h2,h3,h4,h5,p,span,b,button,a,li,dt,dd,figcaption,label,th,td')) {
      if (!visivel(e) || e.clientWidth === 0) continue;
      if (getComputedStyle(e).overflow !== 'visible') continue;
      if (e.scrollWidth > e.clientWidth + 2) {
        sangra.push({ tag: e.tagName, texto: nome(e), caixa: e.clientWidth, pede: e.scrollWidth });
      }
    }

    const raiz = document.querySelector('main') ?? document.body;
    const colados = [...raiz.querySelectorAll('*')].filter((c) => {
      const cs = getComputedStyle(c);
      return (cs.position === 'sticky' || cs.position === 'fixed') && visivel(c);
    });

    const semMarca = [];
    const cobertos = [];
    const focaveis = [
      ...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])'),
    ].filter((e) => visivel(e) && !e.disabled);

    const temMarca = (n, pseudo) => {
      if (!n) return false;
      const cs = getComputedStyle(n, pseudo);
      if (pseudo) return cs.content !== 'none' && cs.content !== '' && parseFloat(cs.width || '0') > 0;
      return parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== 'none';
    };

    for (const e of focaveis) {
      e.focus();
      if (document.activeElement !== e) continue;
      await new Promise((r) => requestAnimationFrame(r));
      // A marca mora no elemento OU no hospedeiro: replaced elements não
      // desenham pseudo-elemento (L12).
      const marcado =
        temMarca(e) ||
        temMarca(e, '::after') ||
        temMarca(e, '::before') ||
        temMarca(e.parentElement, '::after') ||
        temMarca(e.parentElement, '::before');
      if (!marcado) semMarca.push({ tag: e.tagName, texto: nome(e) });

      const b = e.getBoundingClientRect();
      for (const c of colados) {
        if (c.contains(e)) continue;
        const cb = c.getBoundingClientRect();
        const sobrepoe =
          b.top < cb.bottom - 1 && b.bottom > cb.top + 1 && b.left < cb.right - 1 && b.right > cb.left + 1;
        if (sobrepoe) {
          cobertos.push({ texto: nome(e), por: c.tagName, foco: Math.round(b.top), colado: Math.round(cb.bottom) });
          break;
        }
      }
    }
    return { sangra, semMarca, cobertos, focaveis: focaveis.length };
  });
}

let falhas = 0;
let totalFocaveis = 0;
for (const [w, h] of spec.larguras) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  for (const { nome, rota } of spec.rotas) {
    if (ONLY && !ONLY.test(nome)) continue;
    const page = await ctx.newPage();
    await page.goto(BASE + rota, { waitUntil: 'networkidle' });
    // A MEDIDA ESPERA A FONTE. Cinzel e Lora entram por `font-display: swap`:
    // entre o primeiro paint e a troca, o rótulo é desenhado com a métrica da
    // fallback e volta ~4px mais largo quando a real chega. A `CartelaAcao`
    // remede a própria caixa por `ResizeObserver`, um quadro DEPOIS — e quem
    // medir nessa janela lê um sangramento que dura um quadro e não existe
    // para ninguém. Foi exatamente o que aconteceu: com o contexto frio a
    // m01-a08 passava e a m02-a04, já com a fonte em cache, "sangrava" 5 vezes
    // em "Registrar previsão", "Registrar meta" e "Fazer o ato desta aula".
    // Verificador que depende da ordem das rotas não mede nada. `capture.mjs`
    // e `verificar-veu.mjs` já esperavam; este era o único que não.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const r = await medir(page);
    const n = r.sangra.length + r.semMarca.length + r.cobertos.length;
    falhas += n;
    totalFocaveis += r.focaveis;
    console.log(
      `${n ? 'FALHA' : 'PASS '}  ${nome} @${w}  ·  ${r.focaveis} focáveis · sem marca ${r.semMarca.length} · cobertos ${r.cobertos.length} · sangram ${r.sangra.length}`,
    );
    for (const x of r.semMarca) console.log(`         sem marca de foco: <${x.tag}> "${x.texto}"`);
    for (const x of r.cobertos)
      console.log(`         foco coberto por <${x.por}>: "${x.texto}" (topo ${x.foco}, colado até ${x.colado})`);
    for (const x of r.sangra)
      console.log(`         sangra da caixa: <${x.tag}> "${x.texto}" — caixa ${x.caixa}px, pede ${x.pede}px`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();

console.log(
  falhas
    ? `\n${falhas} problema(s) em ${totalFocaveis} controles varridos.`
    : `\nLimpo: ${totalFocaveis} controles focáveis varridos, todos com marca de foco, nenhum coberto, nenhuma caixa sangrando.`,
);
process.exit(falhas ? 1 : 0);
