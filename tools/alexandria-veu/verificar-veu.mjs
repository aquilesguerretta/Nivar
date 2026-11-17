// verificar-veu.mjs — o véu das aulas, medido no render (SISTEMA.md §2.6 L2).
//
// Uso:
//   node tools/alexandria-veu/verificar-veu.mjs [--spec tools/alexandria-veu/veu.json]
//                                               [--base http://127.0.0.1:5311] [--only <regex>]
//                                               [--out <arquivo.json>]
//
// O QUE ELE MEDE, E POR QUE ASSIM.
//
// A lição L2 do sistema diz: **tudo que permite ler OU calcular a referência
// fica velado até o registro — inclusive o enunciado, a linha de fonte, o
// rótulo, o `aria-label` e a célula de tabela vizinha.** A r12 reprovou a
// M01·A08 porque o enunciado do Ato 2 nomeava a resposta e a oferecia como
// alternativa. Um verificador que lesse só o código não pegaria isso: a
// string vinha de uma constante compartilhada com a bandeja de opções.
//
// Por isso a medida é no DOM renderizado, e por RETÂNGULO, nunca por
// `innerText`: o `innerText` do Chrome inclui `<text>` de SVG que está
// oculto (a figura da versão 390 existe no DOM a 1440, guardada por
// `.mob-only`), e o verificador acusaria fantasma. Aqui cada NÓ DE TEXTO
// vira um `Range`, e só entra na varredura quando `getClientRects()` soma
// área > 0 e nenhum ancestral está em `visibility:hidden` / `opacity:0`.
//
// Além dos nós de texto, varre os ATRIBUTOS VISÍVEIS que também entregam a
// referência (`aria-label`, `title`, `alt`, `placeholder`, `value`,
// `aria-valuetext`) — a L2 cita o `aria-label` por nome.
//
// A BANDEJA DE OPÇÕES FICA FORA DA VARREDURA, e só ela: uma escolha múltipla
// contém a resposta certa por construção. O tronco marca a bandeja com
// `data-veu="escolhas"`. Qualquer outro lugar da página é falta.
//
// CADA CASO TEM DUAS METADES. Primeiro `proibidos`: nenhum deles pode
// aparecer ANTES do registro. Depois `abrir` (as ações que registram o ato) e
// `exigidoApos`: a referência TEM de aparecer DEPOIS. A segunda metade existe
// para que apagar o conteúdo não passe no gate — o véu cai, não some.

import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { FIXTURES, FIXED_TIME } from '../alexandria-capture/fixtures.mjs';

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const BASE = args.base ?? 'http://127.0.0.1:5311';
const SPEC = path.resolve(args.spec ?? 'tools/alexandria-veu/veu.json');
const ONLY = args.only ? new RegExp(args.only) : null;
const spec = JSON.parse(await fs.readFile(SPEC, 'utf8'));

/** Selectores sempre fora da varredura. A bandeja de escolha contém a
 *  resposta por construção; o resto da página, não. */
const IGNORAR_PADRAO = ['[data-veu="escolhas"]'];

const browser = await chromium.launch({
  headless: true,
  channel: 'chrome',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
});

async function rotearApi(page, state) {
  const fx = FIXTURES[state];
  if (!fx) throw new Error(`estado desconhecido: ${state}`);
  await page.route('**/api/**', async (route) => {
    const p = new URL(route.request().url()).pathname;
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (p === '/api/auth/me') return fx.user ? json(200, { user: fx.user }) : json(401, { detail: 'Não autenticado.' });
    if (p === '/api/products/me')
      return fx.user
        ? json(200, { products: [{ productId: 'alexandria', activatedAt: '2026-08-01T12:00:00.000Z' }], catalog: ['alexandria'] })
        : json(401, { detail: 'Não autenticado.' });
    if (p === '/api/progress/me') return fx.progress ? json(200, { data: fx.progress }) : json(401, { detail: 'Não autenticado.' });
    if (p.startsWith('/api/progress/aulas/')) {
      const id = decodeURIComponent(p.split('/').pop());
      if (!fx.user) return json(401, { detail: 'Não autenticado.' });
      const st = fx.aulas[id];
      return st ? json(200, { data: st }) : json(404, { detail: 'Sem registro.' });
    }
    if (p === '/api/progress/events') {
      const body = route.request().postDataJSON?.() ?? null;
      if (!fx.user) return json(401, { detail: 'Não autenticado.' });
      return json(200, {
        eventId: 'veu-1', eventType: body?.eventType, entityId: body?.entityId, occurredAt: FIXED_TIME,
        streak: fx.progress?.streak ?? { atual: 0, maior: 0, ultimoDiaAtivo: '' },
      });
    }
    return route.continue();
  });
}

/** Os nós de texto e os atributos que o olho alcança, com o retângulo de
 *  cada um. Medido no cliente porque só lá existe `getClientRects`. */
async function superficieVisivel(page, ignorar) {
  return page.evaluate((sels) => {
    const fora = (el) => sels.some((s) => el.closest(s));
    const oculto = (el) => {
      for (let e = el; e; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return true;
      }
      return false;
    };
    const caminho = (el) => {
      const partes = [];
      for (let e = el; e && partes.length < 4; e = e.parentElement) {
        const id = e.getAttribute?.('data-capture') ?? e.getAttribute?.('data-veu');
        partes.unshift(e.tagName.toLowerCase() + (id ? `[${id}]` : ''));
      }
      return partes.join('>');
    };
    const itens = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      const texto = n.textContent;
      if (!texto || !texto.trim()) continue;
      const el = n.parentElement;
      if (!el || fora(el) || oculto(el)) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      // A MEDIDA QUE IMPORTA: retângulo, não `innerText`. `<text>` de SVG
      // guardado por `.mob-only` a 1440 devolve zero retângulo e fica fora.
      const rects = [...r.getClientRects()];
      const area = rects.reduce((a, x) => a + x.width * x.height, 0);
      if (area <= 0) continue;
      const b = r.getBoundingClientRect();
      itens.push({
        no: n,
        onde: 'texto',
        texto: texto.replace(/\s+/g, ' ').trim(),
        caminho: caminho(el),
        rect: { x: Math.round(b.x), y: Math.round(b.y + window.scrollY), w: Math.round(b.width), h: Math.round(b.height) },
      });
    }
    // A LINHA VISÍVEL, não só o nó. O React parte uma frase em vários nós de
    // texto (`Registrado: `, `{resumo}`, `.`), e uma regra que casa a frase
    // inteira passaria despercebida se a varredura fosse só nó a nó. Aqui
    // cada elemento com retângulo > 0 recompõe o texto **só dos nós já
    // aprovados acima** — a regra do retângulo continua valendo, e o SVG
    // oculto continua fora.
    const visiveis = new Set(itens.map((i) => i.no).filter(Boolean));
    for (const el of document.querySelectorAll('body *')) {
      if (fora(el) || oculto(el)) continue;
      const b = el.getBoundingClientRect();
      if (b.width * b.height <= 0) continue;
      const w2 = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const partes = [];
      while (w2.nextNode()) if (visiveis.has(w2.currentNode)) partes.push(w2.currentNode.textContent);
      if (partes.length < 2) continue;
      const composto = partes.join('').replace(/\s+/g, ' ').trim();
      if (!composto || composto.length > 400) continue;
      itens.push({
        onde: 'linha',
        texto: composto,
        caminho: caminho(el),
        rect: { x: Math.round(b.x), y: Math.round(b.y + window.scrollY), w: Math.round(b.width), h: Math.round(b.height) },
      });
    }

    const ATRIBS = ['aria-label', 'aria-valuetext', 'aria-description', 'title', 'alt', 'placeholder', 'value'];
    for (const el of document.querySelectorAll('body *')) {
      if (fora(el) || oculto(el)) continue;
      const b = el.getBoundingClientRect();
      if (b.width * b.height <= 0) continue;
      for (const a of ATRIBS) {
        const v = el.getAttribute(a);
        if (!v || !v.trim()) continue;
        itens.push({
          onde: `atributo ${a}`,
          texto: v.replace(/\s+/g, ' ').trim(),
          caminho: caminho(el),
          rect: { x: Math.round(b.x), y: Math.round(b.y + window.scrollY), w: Math.round(b.width), h: Math.round(b.height) },
        });
      }
    }
    return itens.map(({ no, ...resto }) => resto);
  }, ignorar);
}

async function agir(page, acoes) {
  for (const a of acoes ?? []) {
    if (a.click) await page.click(a.click, { timeout: 8000 });
    else if (a.fill) await page.fill(a.fill[0], a.fill[1], { timeout: 8000 });
    else if (a.press) await page.press(a.press[0], a.press[1], { timeout: 8000 });
    else if (a.scroll) await page.evaluate((dy) => {
      const main = document.querySelector('main');
      const sc = main && main.scrollHeight > main.clientHeight + 4 ? main : document.scrollingElement;
      sc.scrollBy(0, dy);
    }, a.scroll);
    else if (a.wait) await page.waitForTimeout(a.wait);
  }
}

function procurar(itens, padroes) {
  const achados = [];
  for (const p of padroes) {
    const re = new RegExp(p.re, p.flags ?? 'i');
    for (const it of itens) {
      if (re.test(it.texto)) achados.push({ regra: p.re, porque: p.porque, ...it });
    }
  }
  return achados;
}

const relatorio = [];
let falhas = 0;

for (const caso of spec.casos) {
  if (ONLY && !ONLY.test(caso.nome)) continue;
  const [w, h] = caso.viewport ?? [1440, 900];
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, locale: 'pt-BR' });
  const page = await context.newPage();
  await rotearApi(page, caso.state ?? 'E2');
  await page.addInitScript((t) => {
    const fixo = new Date(t).getTime();
    const D = Date;
    // eslint-disable-next-line no-global-assign
    Date = class extends D { constructor(...a) { super(...(a.length ? a : [fixo])); } static now() { return fixo; } };
  }, FIXED_TIME);
  await page.goto(BASE + caso.route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(caso.settleMs ?? 400);

  const ignorar = [...IGNORAR_PADRAO, ...(caso.ignorar ?? [])];
  await agir(page, caso.antes);
  const antes = await superficieVisivel(page, ignorar);
  const vazou = procurar(antes, caso.proibidos ?? []);

  let faltou = [];
  if (caso.abrir) {
    await agir(page, caso.abrir);
    await page.waitForTimeout(caso.aposMs ?? 700);
    const depois = await superficieVisivel(page, ignorar);
    faltou = (caso.exigidoApos ?? [])
      .filter((p) => !procurar(depois, [p]).length)
      .map((p) => ({ regra: p.re, porque: p.porque }));
  }

  const ok = !vazou.length && !faltou.length;
  if (!ok) falhas++;
  relatorio.push({ caso: caso.nome, rota: caso.route, estado: caso.state ?? 'E2', viewport: [w, h], nosVarridos: antes.length, vazou, faltou, ok });

  console.log(`${ok ? 'PASS' : 'FALHA'}  ${caso.nome}  (${antes.length} nós varridos)`);
  for (const v of vazou) {
    console.log(`   ✗ VAZOU  /${v.regra}/  em ${v.onde} · ${v.caminho}  y=${v.rect.y} ${v.rect.w}×${v.rect.h}`);
    console.log(`            "${v.texto.slice(0, 150)}"`);
    console.log(`            por quê: ${v.porque}`);
  }
  for (const f of faltou) {
    console.log(`   ✗ NÃO CAIU  /${f.regra}/ depois do registro — o véu tem de cair, não sumir. ${f.porque}`);
  }
  await context.close();
}

await browser.close();

if (args.out) {
  await fs.mkdir(path.dirname(path.resolve(args.out)), { recursive: true });
  await fs.writeFile(path.resolve(args.out), JSON.stringify({ gerado: new Date().toISOString(), base: BASE, spec: SPEC, casos: relatorio }, null, 1));
}

console.log(`\n${relatorio.length - falhas}/${relatorio.length} casos passaram.`);
process.exit(falhas ? 1 : 0);
