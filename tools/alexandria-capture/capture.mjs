// Harness determinístico de render/captura da Alexandria v2 (bar §8).
//
// Uso:
//   node tools/alexandria-capture/capture.mjs --plan <plan.json> --out <dir> [--base http://127.0.0.1:5311]
//
// plan.json: { "shots": [ { "name", "route", "state", "viewport": [w,h],
//   "fullPage"?: bool, "reducedMotion"?: bool, "scroll"?: number,
//   "scrollTo"?: "<seletor>" (rola até o ELEMENTO, não até um número de pixels —
//     use sempre que o alvo mudar de posição entre rotas, como o fechamento da aula),
//   "filmstrip"?: { "frames": n, "stepPx"?: n, "intervalMs"?: n, "pressKey"?: "Tab" },
//   filmstrip extras: "steps": [dy por quadro], "frameActions": [{ "atFrame": n, "click"|"press"|"scroll"|"scrollTo"|"wait" }], "fromStart": bool (captura desde o início da navegação)
//   legend.frames registra a URL e o foco de cada quadro (a "barra de endereço" da captura).
//   "realClock"?: bool (animações que dependem de Date.now), "settleMs"?: n,
//   "grayscale"?: bool (teste em cinza), ações e frameActions aceitam também { "back": true } (voltar do navegador),
//   "video"?: { "cena"?: 0.012 | "fps"?: n } grava a sessão em WebM e extrai quadros com ffmpeg — por padrão só os quadros com mudança de cena (prova de movimento, bar S6),
//   "actions"?: [ { "click": sel } | { "fill": [sel, text] } | { "press": key } | { "wait": ms } | { "hover": sel } ] } ] }
//
// Medição de alvo (bar §S7): `smallTargets` lista quem fica abaixo do piso; `alvosPrincipais`
// lista TODA ação principal e TODO item de nav global com largura, altura e passa/reprova — o
// piso de 44×44 só vale abaixo de 768 (a 1440 o mínimo continua 24).
//
// Determinismo: Chrome do sistema (headless), deviceScaleFactor 1, relógio fixo,
// fontes carregadas antes do quadro, /api/* respondido pelas fixtures do harness
// (nunca pelo produto). Cada captura grava PNG(s) + entrada em legend.json.

import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { FIXTURES, FIXED_TIME, SEM_REGISTRO } from './fixtures.mjs';

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const BASE = args.base ?? 'http://127.0.0.1:5311';
const OUT = path.resolve(args.out ?? 'docs/alexandria-v2/captures/tmp');
const plan = JSON.parse(await fs.readFile(args.plan, 'utf8'));
const CLOSING = process.argv.includes('--closing'); // inclui os shots marcados "closing" (antes de fechar a peça)
const ONLY = args.only ? new RegExp(args.only) : null; // filtra shots por nome

await fs.mkdir(OUT, { recursive: true });
// WebGL (globo do Atlas) precisa de rasterização por software no headless.
const browser = await chromium.launch({
  headless: true,
  channel: 'chrome',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
});
const legend = [];

async function routeApi(page, state, events) {
  const fx = FIXTURES[state];
  if (!fx) throw new Error(`estado desconhecido: ${state}`);
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const p = url.pathname;
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (p === '/api/auth/me') return fx.user ? json(200, { user: fx.user }) : json(401, { detail: 'Não autenticado.' });
    if (p === '/api/products/me')
      return fx.user ? json(200, { products: [{ productId: 'alexandria', activatedAt: '2026-08-01T12:00:00.000Z' }], catalog: ['alexandria'] }) : json(401, { detail: 'Não autenticado.' });
    if (p === '/api/progress/me') return fx.progress ? json(200, { data: fx.progress }) : json(401, { detail: 'Não autenticado.' });
    if (p.startsWith('/api/progress/aulas/')) {
      const id = decodeURIComponent(p.split('/').pop());
      if (!fx.user) return json(401, { detail: 'Não autenticado.' });
      const st = fx.aulas[id];
      return st ? json(200, { data: st }) : json(404, { detail: 'Sem registro.' });
    }
    if (p === '/api/progress/events') {
      const body = route.request().postDataJSON?.() ?? null;
      events.push({ at: new Date().toISOString(), body });
      if (!fx.user) return json(401, { detail: 'Não autenticado.' });
      return json(200, {
        eventId: `fx-${events.length}`, eventType: body?.eventType, entityId: body?.entityId, occurredAt: FIXED_TIME,
        streak: fx.progress?.streak ?? SEM_REGISTRO,
      });
    }
    // Dados públicos (ex.: perfis do Atlas) seguem para o backend real via proxy do Vite.
    // Só sessão, produtos e progresso do learner são fixture.
    return route.continue();
  });
}

async function measure(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const main = document.querySelector('main');
    const vw = window.innerWidth;
    const overflow = [...document.querySelectorAll('body *')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 0 && r.right > vw + 1 && cs.position !== 'fixed' && cs.visibility !== 'hidden';
      })
      .slice(0, 8)
      .map((e) => ({ tag: e.tagName.toLowerCase(), cls: String(e.className).slice(0, 40), right: Math.round(e.getBoundingClientRect().right) }));
    const media = [...document.querySelectorAll('img, video, svg[data-media-class], [data-media-class]')]
      .filter((e) => e.getBoundingClientRect().width > 0)
      .slice(0, 40)
      .map((e) => ({
        tag: e.tagName.toLowerCase(),
        src: e.getAttribute('src')?.slice(0, 120) ?? null,
        mediaClass: e.getAttribute('data-media-class') ?? e.closest('[data-media-class]')?.getAttribute('data-media-class') ?? null,
        alt: e.getAttribute('alt') ?? e.getAttribute('aria-label') ?? null,
      }));
    const visible = (e) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
    };
    const textEls = [...document.querySelectorAll('body *')]
      .filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
      .filter(visible);
    const smallText = textEls.map((e) => parseFloat(getComputedStyle(e).fontSize)).filter((s) => s > 0);
    // Shell = regiões marcadas pelo próprio shell da Alexandria (data-shell). <header>/<nav> internos de
    // páginas (ex.: cabeçalho de instrumento, navegação entre aulas) são corpo, não shell.
    const inShell = (e) => Boolean(e.closest('[data-shell]'));
    const minOf = (els) => {
      const s = els.map((e) => parseFloat(getComputedStyle(e).fontSize)).filter((v) => v > 0);
      return s.length ? Math.min(...s) : null;
    };
    // Texto cortado: reticências literais ou caixa com text-overflow/overflow escondendo conteúdo.
    const truncated = textEls
      .filter((e) => {
        const cs = getComputedStyle(e);
        const clipped = (cs.textOverflow === 'ellipsis' || cs.overflow === 'hidden' || cs.overflowX === 'hidden') && e.scrollWidth > e.clientWidth + 1;
        const literal = /(\.\.\.|…)\s*$/.test(e.textContent.trim()) || e.textContent.trim() === '…';
        return clipped || literal;
      })
      .slice(0, 16)
      .map((e) => ({ tag: e.tagName.toLowerCase(), text: e.textContent.trim().slice(0, 60), scrollW: e.scrollWidth, clientW: e.clientWidth, inShell: inShell(e) }));
    // Alvos interativos: todos ≥ 24×24; nav global e ação principal ≥ 44×44 abaixo de 768.
    const interactive = [...document.querySelectorAll('a[href], button, [role="button"], input, select, textarea, summary')].filter(visible);

    // --- Piso de 44×44 (bar §S7), SÓ abaixo de 768 e SÓ onde o bar manda ---------------------
    // "nav global e ação principal ≥ 44×44 a 390". A 1440 o mínimo continua 24: inflar todo alvo
    // do produto seria pior que o defeito. Por isso o papel é decidido por marcação do produto
    // (data-capture da ação, data-shell da casca), nunca por heurística de aparência.
    //
    // Ação principal: marcadores que o produto usa hoje. `acao-proxima` está aqui porque o bar
    // pressupõe esse nome; se não casar com nada, entra em `marcadoresAusentes` (é peça a marcar).
    const MARCAS_ACAO = ['acao-proxima', 'cta-primario', 'proximo-passo'];
    const ehAcaoPrincipal = (e) => {
      const c = e.getAttribute('data-capture');
      if (c && MARCAS_ACAO.includes(c)) return c;
      const anc = e.closest('[data-capture]');
      const ac = anc?.getAttribute('data-capture');
      return ac && MARCAS_ACAO.includes(ac) ? ac : null;
    };
    // Nav global = casca de navegação: barra móvel (e o sumário que ela abre) + controles do
    // cabeçalho. Localizador (migalha), rodapé e links de conteúdo ficam no piso geral de 24.
    const ehNavGlobal = (e) =>
      Boolean(e.closest('[data-shell="nav-movel"], [data-shell="sumario"]')) ||
      (Boolean(e.closest('[data-shell="cabecalho"]')) && !e.closest('[data-shell="localizador"]'));
    const papelDoAlvo = (e) => (ehAcaoPrincipal(e) ? 'acao-principal' : ehNavGlobal(e) ? 'nav-global' : null);
    const pisoDe = (e) => (vw < 768 && papelDoAlvo(e) ? 44 : 24);

    // Seletor estável, para o critic repetir a medição sem medir no olho.
    const seletorDe = (e) => {
      const partes = [];
      const shell = e.closest('[data-shell]')?.getAttribute('data-shell');
      if (shell) partes.push(`[data-shell="${shell}"]`);
      let self = e.tagName.toLowerCase();
      const cap = e.getAttribute('data-capture');
      if (cap) self += `[data-capture="${cap}"]`;
      else {
        const al = e.getAttribute('aria-label');
        if (al) self += `[aria-label="${al.slice(0, 60)}"]`;
        else if (e.id) self += `#${e.id}`;
        else {
          const irmaos = [...(e.parentElement?.children ?? [])].filter((x) => x.tagName === e.tagName);
          if (irmaos.length > 1) self += `:nth-of-type(${irmaos.indexOf(e) + 1})`;
        }
      }
      partes.push(self);
      return partes.join(' ');
    };
    // Caixa do alvo. `h`/`w` é a caixa do elemento; `menorCaixaH` é a menor linha de um alvo
    // inline que quebrou em duas — uma caixa "alta" feita de duas linhas de 22px não é um alvo
    // de 44px, e era por aí que a medida antiga passava batido.
    const caixaDe = (e) => {
      const r = e.getBoundingClientRect();
      const linhas = [...e.getClientRects()].filter((x) => x.width > 0.5 && x.height > 0.5);
      return {
        w: Math.round(r.width * 10) / 10,
        h: Math.round(r.height * 10) / 10,
        caixas: linhas.length,
        menorCaixaH: linhas.length ? Math.round(Math.min(...linhas.map((x) => x.height)) * 10) / 10 : null,
      };
    };

    const principais = interactive.filter((e) => papelDoAlvo(e));
    const alvosPrincipais = {
      piso: vw < 768 ? 44 : 24,
      aplicavel: vw < 768, // o piso de 44 é regra de 390; acima de 768 estes alvos caem no piso geral de 24
      regra: 'bar §S7 — nav global e ação principal ≥ 44×44px a 390; demais alvos ≥ 24×24px',
      total: principais.length,
      reprovados: 0,
      alvos: principais.slice(0, 40).map((e) => {
        const c = caixaDe(e);
        const piso = pisoDe(e);
        const passa = c.w >= piso - 0.5 && c.h >= piso - 0.5;
        return {
          papel: papelDoAlvo(e),
          marca: ehAcaoPrincipal(e) ?? e.closest('[data-shell]')?.getAttribute('data-shell') ?? null,
          seletor: seletorDe(e),
          rotulo: (e.getAttribute('aria-label') ?? e.textContent ?? '').trim().slice(0, 60),
          largura: c.w,
          altura: c.h,
          caixas: c.caixas,
          menorCaixaH: c.menorCaixaH,
          piso,
          passa,
          ...(passa ? {} : { falta: { largura: Math.max(0, Math.round((piso - c.w) * 10) / 10), altura: Math.max(0, Math.round((piso - c.h) * 10) / 10) } }),
        };
      }),
      // Marcador que o bar pressupõe e que a árvore não tem: trabalho do builder da peça, não do harness.
      marcadoresAusentes: MARCAS_ACAO.filter((m) => !document.querySelector(`[data-capture="${m}"]`)),
      acaoPrincipalMarcada: MARCAS_ACAO.some((m) => document.querySelector(`[data-capture="${m}"]`)),
      navGlobalPresente: interactive.some((e) => ehNavGlobal(e)),
      // NÃO é reprovação: é a borda da própria medida. Alvo abaixo de 44 que o piso não alcança
      // porque a peça não o marcou como ação principal nem o pôs na casca. Se o critic vê aqui a
      // ação principal da tela, o defeito é falta de marcação — e a peça é que precisa marcar.
      foraDoAlcance: vw >= 768 ? [] : interactive
        .filter((e) => !papelDoAlvo(e))
        .map((e) => ({ e, c: caixaDe(e) }))
        .filter(({ c }) => c.h < 43.5 || c.w < 43.5)
        .slice(0, 24)
        .map(({ e, c }) => ({
          seletor: seletorDe(e),
          rotulo: (e.getAttribute('aria-label') ?? e.textContent ?? '').trim().slice(0, 60),
          largura: c.w,
          altura: c.h,
          piso: 24,
          passaPiso24: c.w >= 23.5 && c.h >= 23.5,
        })),
    };
    alvosPrincipais.reprovados = alvosPrincipais.alvos.filter((a) => !a.passa).length;

    const smallTargets = interactive
      .map((e) => {
        const r = e.getBoundingClientRect();
        const papel = papelDoAlvo(e);
        return { e, r, min: pisoDe(e), globalNav: Boolean(papel), papel };
      })
      .filter(({ r, min }) => r.width < min - 0.5 || r.height < min - 0.5)
      .slice(0, 24)
      .map(({ e, r, min, globalNav, papel }) => ({
        tag: e.tagName.toLowerCase(),
        label: (e.getAttribute('aria-label') ?? e.textContent ?? '').trim().slice(0, 50),
        seletor: seletorDe(e),
        w: Math.round(r.width), h: Math.round(r.height), min, globalNav, papel,
      }));
    return {
      innerWidth: vw,
      innerHeight: window.innerHeight,
      docScrollWidth: doc.scrollWidth,
      docScrollHeight: doc.scrollHeight,
      mainScrollWidth: main?.scrollWidth ?? null,
      mainScrollHeight: main?.scrollHeight ?? null,
      horizontalOverflow: Math.max(doc.scrollWidth, main?.scrollWidth ?? 0) > vw + 1,
      overflowingElements: overflow,
      minFontPx: smallText.length ? Math.min(...smallText) : null,
      minFontPxShell: minOf(textEls.filter(inShell)),
      minFontPxMain: minOf(textEls.filter((e) => !inShell(e))),
      truncatedText: truncated,
      smallTargets,
      alvosPrincipais,
      media,
      title: document.title,
    };
  });
}

// Imagens grandes (ex.: prancha de 4800px a 3440) podem estar "complete" sem estar decodificadas: o quadro
// sairia vazio. Espera carga + decode das imagens visíveis (as lazy fora da tela ficam de fora).
async function imagensDecodificadas(page) {
  await page.evaluate(async () => {
    const vis = [...document.images].filter((i) => {
      const r = i.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.top < window.innerHeight * 2;
    });
    await Promise.all(vis.map((i) => new Promise((ok) => {
      const fim = () => i.decode().then(ok, ok);
      if (i.complete && i.naturalWidth) fim();
      else { i.addEventListener('load', fim, { once: true }); i.addEventListener('error', ok, { once: true }); }
      setTimeout(ok, 20000);
    })));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

async function scrollBy(page, px) {
  await page.evaluate((dy) => {
    // Quem rola: o <main> da casca v2, ou a raiz .alx3 da v3 (o app trava
    // html/body com overflow hidden), ou o documento.
    const rola = (el) => el && el.scrollHeight > el.clientHeight + 4 && getComputedStyle(el).overflowY !== 'visible';
    const main = document.querySelector('main');
    const raiz = document.querySelector('.alx3');
    const scroller = rola(main) ? main : rola(raiz) ? raiz : document.scrollingElement;
    scroller.scrollBy(0, dy);
  }, px);
}

/** Rola até um SELETOR, não até um número de pixels.
 *
 *  Por que existe: o fechamento da aula (T10 + T11) mora em y≈4293 a 1440 e
 *  y≈7314 a 390, e cada aula tem altura própria (4828, 4931, 6486, 8868...).
 *  Orçamento em pixel não alcança bloco cuja posição muda por rota: ou fica
 *  curto — foi por isso que o fechamento "não renderizava em render nenhum",
 *  quando na verdade nunca era fotografado — ou passa direto e fotografa o
 *  rodapé. Aqui o alvo é o elemento, e a régua é ele. */
async function scrollToSel(page, sel) {
  const achou = await page.evaluate((s) => {
    const alvo = document.querySelector(s);
    if (!alvo) return false;
    // Quem rola: o <main> da casca v2, ou a raiz .alx3 da v3 (o app trava
    // html/body com overflow hidden), ou o documento.
    const rola = (el) => el && el.scrollHeight > el.clientHeight + 4 && getComputedStyle(el).overflowY !== 'visible';
    const main = document.querySelector('main');
    const raiz = document.querySelector('.alx3');
    const scroller = rola(main) ? main : rola(raiz) ? raiz : document.scrollingElement;
    const r = alvo.getBoundingClientRect();
    const rs = scroller === document.scrollingElement ? { top: 0 } : scroller.getBoundingClientRect();
    // o alvo encosta a ~1/8 do topo da janela: sobra folga acima para o
    // contexto (a linha anterior do registro) e abaixo para o que vem depois
    const alvoTopo = r.top - rs.top + scroller.scrollTop;
    scroller.scrollTo(0, Math.max(0, alvoTopo - scroller.clientHeight / 8));
    return true;
  }, sel);
  if (!achou) console.warn(`  ! scrollTo: seletor ausente na árvore — ${sel}`);
  await page.waitForTimeout(350);
}

for (const shot of plan.shots) {
  if (shot.closing && !CLOSING) continue;
  if (ONLY && !ONLY.test(shot.name)) continue;
  const [w, h] = shot.viewport;
  const tmpVideo = shot.video ? path.join(OUT, '_video', shot.name) : null;
  const context = await browser.newContext({
    ...(tmpVideo ? { recordVideo: { dir: tmpVideo, size: { width: w, height: h } } } : {}),
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: w < 768,
    hasTouch: w < 768,
    reducedMotion: shot.reducedMotion ? 'reduce' : 'no-preference',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  });
  const page = await context.newPage();
  // Relógio fixo por padrão; animações que dependem de Date.now (ex.: globo) pedem realClock.
  if (!shot.realClock) await page.clock.setFixedTime(new Date(FIXED_TIME));
  const events = [];
  const consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text().slice(0, 200)));
  page.on('pageerror', (e) => consoleErrors.push(String(e.message).slice(0, 200)));
  await routeApi(page, shot.state, events);

  const url = BASE + shot.route;
  const fromStart = Boolean(shot.filmstrip?.fromStart);
  await page.goto(url, { waitUntil: fromStart ? 'commit' : 'networkidle', timeout: 60000 });
  if (!fromStart) {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(shot.settleMs ?? 900);
    await imagensDecodificadas(page);
  }

  for (const a of shot.actions ?? []) {
    if (a.click) await page.click(a.click);
    if (a.back) await page.goBack({ waitUntil: 'networkidle' });
    if (a.fill) await page.fill(a.fill[0], a.fill[1]);
    if (a.press) await page.keyboard.press(a.press);
    if (a.hover) await page.hover(a.hover);
    if (a.wait) await page.waitForTimeout(a.wait);
    if (a.scroll) await scrollBy(page, a.scroll);
    if (a.scrollTo) await scrollToSel(page, a.scrollTo);
  }
  if (shot.scroll) {
    await scrollBy(page, shot.scroll);
    await page.waitForTimeout(400);
  }
  if (shot.scrollTo) await scrollToSel(page, shot.scrollTo);

  // Teste de miniatura em cinza (bar S3/B2): a hierarquia precisa sobreviver sem cor.
  if (shot.grayscale) await page.addStyleTag({ content: 'html { filter: grayscale(1) !important; }' });
  // Página inteira rolada até o fim antes do screenshot, para imagens lazy carregarem.
  if (shot.fullPage) {
    // O shell pode rolar dentro de <main>. Para a página inteira, solta a altura dos contêineres de rolagem
    // (só nesta captura) e rola até o fim para imagens lazy carregarem.
    await page.evaluate(async () => {
      const main = document.querySelector('main');
      if (main && main.scrollHeight > main.clientHeight + 4) {
        for (let el = main; el && el !== document.documentElement; el = el.parentElement) {
          el.style.setProperty('height', 'auto', 'important');
          el.style.setProperty('max-height', 'none', 'important');
          el.style.setProperty('overflow', 'visible', 'important');
        }
        document.documentElement.style.setProperty('height', 'auto', 'important');
        document.body.style.setProperty('height', 'auto', 'important');
        document.body.style.setProperty('overflow', 'visible', 'important');
      }
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
  }

  const files = [];
  const base = shot.name;
  const frameLog = [];
  if (shot.filmstrip) {
    const { frames, stepPx = 0, intervalMs = 120, pressKey = null, steps = null, frameActions = [] } = shot.filmstrip;
    for (let i = 0; i < frames; i++) {
      for (const fa of frameActions.filter((x) => x.atFrame === i)) {
        if (fa.click) await page.click(fa.click);
        if (fa.back) await page.goBack({ waitUntil: 'networkidle' });
        if (fa.press) await page.keyboard.press(fa.press);
        if (fa.scroll) await scrollBy(page, fa.scroll);
        if (fa.scrollTo) await scrollToSel(page, fa.scrollTo);
        if (fa.wait) await page.waitForTimeout(fa.wait);
      }
      const f = `${base}-f${String(i).padStart(2, '0')}.png`;
      if (!fromStart) await imagensDecodificadas(page);
      await page.screenshot({ path: path.join(OUT, f) });
      files.push(f);
      frameLog.push({ file: f, url: page.url(), focused: await page.evaluate(() => { const a = document.activeElement; return a && a !== document.body ? (a.getAttribute('aria-label') || a.textContent || a.tagName).trim().slice(0, 60) : null; }) });
      const dy = steps ? steps[i] ?? 0 : stepPx;
      if (dy) await scrollBy(page, dy);
      if (pressKey) await page.keyboard.press(pressKey);
      await page.waitForTimeout(intervalMs);
    }
  } else {
    const f = `${base}.png`;
    await imagensDecodificadas(page);
    await page.screenshot({ path: path.join(OUT, f), fullPage: Boolean(shot.fullPage) });
    files.push(f);
  }
  const m = await measure(page);
  legend.push({
    name: base,
    files,
    route: shot.route,
    url: page.url(),
    state: shot.state,
    fixture: shot.state === 'E0' ? 'nenhuma (sem sessão; /api/auth/me → 401)' : `tools/alexandria-capture/fixtures.mjs#${shot.state} (fixture de rede do harness, não é dado real)`,
    viewport: `${w}x${h}`,
    dpr: 1,
    reducedMotion: Boolean(shot.reducedMotion),
    fixedTime: shot.realClock ? null : FIXED_TIME,
    frames: frameLog.length ? frameLog : undefined,
    progressEventsEmitted: events,
    consoleErrors,
    ...m,
  });
  const ap = m.alvosPrincipais;
  const alvo44 = ap.aplicavel
    ? `${ap.reprovados === 0 ? 'ok' : `REPROVA ${ap.reprovados}`}/${ap.total}${ap.acaoPrincipalMarcada ? '' : ' SEM-AÇÃO-MARCADA'}${ap.navGlobalPresente ? '' : ' SEM-CASCA'}`
    : `n/a(${w}px)`;
  console.log(`✓ ${base} (${shot.state} ${w}x${h}) overflow=${m.horizontalOverflow} minFont=${m.minFontPx} alvos44=${alvo44}`);
  if (ap.aplicavel && ap.reprovados)
    for (const a of ap.alvos.filter((x) => !x.passa))
      console.log(`   ↳ ${a.papel} ${a.largura}×${a.altura} (piso ${a.piso}) ${a.seletor} — "${a.rotulo}"`);
  await context.close(); // fecha antes de ler o vídeo: o arquivo só é escrito aqui
  if (tmpVideo) {
    // Movimento curto (S6) não cabe em screenshot: grava vídeo e extrai quadros com ffmpeg.
    const dir = await fs.readdir(tmpVideo);
    const webm = dir.find((f) => f.endsWith('.webm'));
    if (webm) {
      const origem = path.join(tmpVideo, webm);
      const destino = path.join(OUT, `${base}.webm`);
      await fs.rename(origem, destino);
      // Só os quadros em que a tela muda (mpdecimate descarta quase-duplicados): prova de movimento sem 140 PNGs.
      const fps = shot.video.fps ?? 'mpdecimate';
      const filtro = shot.video.fps ? `fps=${shot.video.fps}` : 'mpdecimate=hi=2000:lo=800:frac=0.02';
      const r = spawnSync('ffmpeg', ['-y', '-i', destino, '-vf', filtro, '-fps_mode', 'vfr', path.join(OUT, `${base}-v%03d.png`)], { encoding: 'utf8' });
      if (r.status !== 0) console.log(`  (ffmpeg falhou em ${base}: ${String(r.stderr).slice(-200)})`);
      const quadros = (await fs.readdir(OUT)).filter((f) => f.startsWith(`${base}-v`) && f.endsWith('.png')).sort();
      files.push(`${base}.webm`, ...quadros);
      legend[legend.length - 1].video = { arquivo: `${base}.webm`, amostragem: String(fps), quadros: quadros.length };
      legend[legend.length - 1].files = files;
    }
    await fs.rm(tmpVideo, { recursive: true, force: true });
  }
}

// Com --only, mescla com a legenda existente (substitui só os shots refeitos) em vez de apagá-la.
let shotsFinais = legend;
if (ONLY) {
  try {
    const anterior = JSON.parse(await fs.readFile(path.join(OUT, 'legend.json'), 'utf8'));
    const refeitos = new Set(legend.map((l) => l.name));
    const ordem = plan.shots.map((x) => x.name);
    shotsFinais = [...anterior.shots.filter((l) => !refeitos.has(l.name)), ...legend]
      .sort((a, b) => ordem.indexOf(a.name) - ordem.indexOf(b.name));
  } catch { /* sem legenda anterior */ }
}
await fs.writeFile(path.join(OUT, 'legend.json'), JSON.stringify({ base: BASE, capturedAt: 'relógio fixo ' + FIXED_TIME, shots: shotsFinais }, null, 2));
await browser.close();
