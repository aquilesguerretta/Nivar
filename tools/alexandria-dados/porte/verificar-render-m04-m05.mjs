// Verificação no render das aulas do M04 e do M05 no modelo v3 — adaptada do verificador
// que fechou o M01 (mesmas fixtures de rede de tools/alexandria-capture/fixtures.mjs: E0 sem
// conta, E2 com conta; nenhuma conta é criada, a API é respondida pela fixture).
//
// Mede, por aula × combinação (largura-modo-estado):
//   · rolagem lateral (raiz `.alx3` e documento), imagem quebrada (naturalWidth), erro de console;
//   · o VÉU por RETÂNGULO (Range.getClientRects): antes da previsão, nenhum token que entrega o
//     calculado tem caixa renderizada, e o calculado/explorar não estão no DOM; depois, estão;
//   · exercício: a referência só aparece depois da tentativa;
//   · prova (última aula): critério antes das questões, resultado depois.
//
// Uso: node tools/alexandria-dados/porte/verificar-render-m04-m05.mjs <modulo 4|5> <pasta-saída> [combos] [aulas]
//   combos: "1440-claro-E0,1440-noturno-E2,390-claro-E2,390-noturno-E0" (padrão: as 8 combinações)
// Precisa do dev server desta árvore em BASE (variável RENDER_BASE, padrão http://127.0.0.1:5347)
// e do Playwright global (npm i -g @playwright/cli) dirigindo o Chrome do sistema.
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { RAIZ } from './fonte-html-m04-m05.mjs';

const { FIXTURES, FIXED_TIME, SEM_REGISTRO } = await import(pathToFileURL(path.join(RAIZ, 'tools/alexandria-capture/fixtures.mjs')).href);
const req = createRequire(path.join(process.env.APPDATA ?? '', 'npm/node_modules/@playwright/cli/package.json'));
const { chromium } = req('playwright');

const MOD = Number(process.argv[2]);
const NN = String(MOD).padStart(2, '0');
const BASE = process.env.RENDER_BASE ?? 'http://127.0.0.1:5347';
const OUT = path.resolve(process.argv[3] ?? `render-m${NN}`);
const TODAS = ['1440-claro-E0', '1440-claro-E2', '1440-noturno-E0', '1440-noturno-E2', '390-claro-E0', '390-claro-E2', '390-noturno-E0', '390-noturno-E2'];
const COMBOS = process.argv[4] ? process.argv[4].split(',') : TODAS;
await fs.mkdir(OUT, { recursive: true });

// Por aula: o palpite a registrar e os trechos que entregam o calculado (saem do veredito
// e das saídas do cenário padrão) — nenhum deles pode ter caixa renderizada antes da previsão.
const CONFIG = {
  4: {
    trilha: 'trilha-fundamentos-universais',
    aulas: {
      1: { palpite: '300', tokens: ['Sistema em atenção', 'Preço formado'] },
      2: { palpite: '200', tokens: ['Pico em Set', 'Pico do ano'] }, // 'PLD médio do ano' está na própria pergunta
      3: { palpite: '30', tokens: ['Falta R$ 44 mi', 'Dinheiro que falta'] },
      4: { palpite: '265', tokens: ['Contratado integralmente', 'Preço de corte R$'] },
      5: { palpite: '3,5', tokens: ['Amplitude anual de R$ 720 mil', 'Custo médio'] },
      6: { palpite: '300', tokens: ['O swap custou', 'Resultado do swap'] },
      7: { palpite: '15', tokens: ['Exposição residual de 10%', 'Exposição residual'] },
    },
  },
  5: {
    trilha: 'trilha-fundamentos-universais',
    aulas: {
      1: { palpite: '700', tokens: ['Rede única. O custo fixo', 'Com rede única'] },
      2: { palpite: '50', tokens: ['é o ponto de menor atrito para esta combinação', 'Grau de menor atrito'] },
      3: { palpite: '230', tokens: ['Exposição residual de 15%, custo esperado', 'Cenário ruim'] },
      4: { palpite: '10', tokens: ['Nenhum sinal marcado. O processo é verificável', 'Índice de opacidade'] },
      5: { palpite: '1000', tokens: ['Composição equilibrada: 27%', 'Parcela B ano 4'] },
      6: { palpite: '70', tokens: ['Configuração coerente com um parque', 'Distância do Brasil'] },
    },
  },
};
const cfgMod = CONFIG[MOD];
const SO = process.argv[5] ? process.argv[5].split(',').map(Number) : Object.keys(cfgMod.aulas).map(Number);
const ROTA = (n) => `/alexandria/trilha/${cfgMod.trilha}/modulo/modulo-${NN}/aula/${n}`;

async function rotaApi(page, state, events) {
  const fx = FIXTURES[state];
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const p = url.pathname;
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (p === '/api/auth/me') return fx.user ? json(200, { user: fx.user }) : json(401, { detail: 'Não autenticado.' });
    if (p === '/api/products/me')
      return fx.user ? json(200, { products: [{ productId: 'alexandria', activatedAt: '2026-08-01T12:00:00.000Z' }], catalog: ['alexandria'] }) : json(401, { detail: 'x' });
    if (p === '/api/progress/me') return fx.progress ? json(200, { data: fx.progress }) : json(401, { detail: 'x' });
    if (p.startsWith('/api/progress/aulas/')) {
      const id = decodeURIComponent(p.split('/').pop());
      if (!fx.user) return json(401, { detail: 'x' });
      const st = fx.aulas[id];
      return st ? json(200, { data: st }) : json(404, { detail: 'Sem registro.' });
    }
    if (p === '/api/progress/events') {
      const body = route.request().postDataJSON?.() ?? null;
      events.push(body);
      if (!fx.user) return json(401, { detail: 'x' });
      return json(200, { eventId: `fx-${events.length}`, eventType: body?.eventType, entityId: body?.entityId, occurredAt: FIXED_TIME, streak: fx.progress?.streak ?? SEM_REGISTRO });
    }
    if (p.startsWith('/api/progress/')) return fx.user ? json(200, { data: null }) : json(401, { detail: 'x' });
    // nada sai para a rede de verdade
    return json(404, { detail: 'fixture' });
  });
}

async function rolarAte(page, sel, fracao = 0.12) {
  return page.evaluate(([s, f]) => {
    const alvo = document.querySelector(s);
    const raiz = document.querySelector('.alx3');
    if (!alvo || !raiz) return false;
    const topo = alvo.getBoundingClientRect().top - raiz.getBoundingClientRect().top + raiz.scrollTop;
    raiz.scrollTo(0, Math.max(0, topo - raiz.clientHeight * f));
    return true;
  }, [sel, fracao]);
}

async function medirVeu(page, tokens) {
  return page.evaluate((toks) => {
    const raiz = document.querySelector('[data-capture="aula-v3"]');
    const achados = [];
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      for (const t of toks) {
        let i = n.textContent.indexOf(t);
        while (i >= 0) {
          const r = document.createRange();
          r.setStart(n, i);
          r.setEnd(n, i + t.length);
          const caixas = [...r.getClientRects()].filter((c) => c.width > 0 && c.height > 0);
          const cs = getComputedStyle(n.parentElement);
          achados.push({ token: t, visivel: caixas.length > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0' });
          i = n.textContent.indexOf(t, i + 1);
        }
      }
    }
    const conta = (s) => document.querySelectorAll(s).length;
    return {
      visiveis: achados.filter((a) => a.visivel).map((a) => a.token),
      noDom: achados.length,
      calculado: conta('[data-capture="calculado"]'),
      explorar: conta('[data-capture="explorar"]'),
      comparacao: conta('[data-capture="comparacao"]'),
      veredito: conta('.av-veredito'),
    };
  }, tokens);
}

async function medirPagina(page) {
  return page.evaluate(() => {
    const raiz = document.querySelector('.alx3');
    const vw = window.innerWidth;
    const fora = [...document.querySelectorAll('.alx3 *')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.right > vw + 1 && !e.closest('.av-tabela-rolo, .dg-rolagem') && getComputedStyle(e).position !== 'fixed';
      })
      .slice(0, 6)
      .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 30)}→${Math.round(e.getBoundingClientRect().right)}`);
    const imgs = [...document.querySelectorAll('.av-aula img')].map((i) => ({ src: i.getAttribute('src'), ok: i.naturalWidth > 0 }));
    const texto = document.querySelector('.av-aula')?.innerText ?? '';
    const proibidas = ['GridAlpha', 'backend', 'extraído do HTML', 'extração', 'wave', 'mock', 'Demonstrado', 'Bloco 4', 'Bloco 5', 'Bloco 6', 'Bloco 9'].filter((p) => texto.includes(p));
    return {
      innerWidth: vw,
      overflowH: (raiz?.scrollWidth ?? 0) > vw + 1 || document.documentElement.scrollWidth > vw + 1,
      fora,
      imgs,
      termos: document.querySelectorAll('[data-capture="termo"]').length,
      figuras: document.querySelectorAll('[data-capture="figura"]').length,
      notas: document.querySelectorAll('.av-nota').length,
      tabelas: document.querySelectorAll('.av-tabela').length,
      listas: document.querySelectorAll('.av-lista').length,
      formulas: document.querySelectorAll('.av-formula').length,
      instrumentos: document.querySelectorAll('[data-capture="instrumento"]').length,
      itens: document.querySelectorAll('[data-capture="item"]').length,
      proibidas,
      video: document.querySelectorAll('[data-capture="video"]').length,
    };
  });
}

async function foto(page, nome, arquivos) {
  const f = path.join(OUT, `${nome}.png`);
  await page.waitForTimeout(250);
  await page.screenshot({ path: f });
  arquivos.push(f);
}

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const relatorio = [];
let falhas = 0;

for (const combo of COMBOS) {
  const [w, modo, state] = combo.split('-');
  const largura = Number(w);
  const altura = largura < 768 ? 844 : 900;
  for (const n of SO) {
    const nome = `m${NN}-a${String(n).padStart(2, '0')}-${combo}`;
    const ctx = await browser.newContext({ viewport: { width: largura, height: altura }, deviceScaleFactor: 1, isMobile: largura < 768, hasTouch: largura < 768, locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' });
    await ctx.addInitScript((m) => { try { localStorage.setItem('alx3-modo', m); } catch {} }, modo);
    const page = await ctx.newPage();
    const erros = [];
    const events = [];
    // 401 de visitante e 404 de "aula sem registro" são respostas DA FIXTURE (o contrato da
    // API), e o navegador as anota como "Failed to load resource". Elas não contam; qualquer
    // outro status ≥ 400, ou erro de console de outra natureza, conta.
    const daFixture = (st, p) => (st === 401 && p.startsWith('/api/')) || (st === 404 && p.startsWith('/api/progress/aulas/'));
    page.on('console', (m) => m.type() === 'error' && !/^Failed to load resource: the server responded with a status of (401|404)/.test(m.text()) && erros.push(m.text().slice(0, 200)));
    page.on('pageerror', (e) => erros.push(String(e.message).slice(0, 200)));
    page.on('response', (res) => { const p = new URL(res.url()).pathname; if (res.status() >= 400 && !daFixture(res.status(), p)) erros.push(`HTTP ${res.status()} ${p}`); });
    await rotaApi(page, state, events);
    await page.goto(BASE + ROTA(n), { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector('[data-capture="aula-v3"]', { timeout: 15000 });
    await page.waitForTimeout(600);
    const arquivos = [];
    const r = { aula: n, combo, arquivos, erros, problemas: [] };
    const prob = (s) => r.problemas.push(s);

    r.pagina = await medirPagina(page);
    r.modoAplicado = await page.evaluate(() => document.querySelector('.alx3')?.getAttribute('data-modo') ?? document.documentElement.getAttribute('data-modo') ?? null);
    await foto(page, `${nome}-1-abertura`, arquivos);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(200);

    const cfg = cfgMod.aulas[n];
    if (cfg) {
      r.veuAntes = await medirVeu(page, cfg.tokens);
      if (r.veuAntes.visiveis.length) prob(`véu: visível antes da previsão: ${r.veuAntes.visiveis.join(' | ')}`);
      if (r.veuAntes.calculado || r.veuAntes.explorar || r.veuAntes.veredito) prob(`véu: calculado/explorar/veredito no DOM antes da previsão (${r.veuAntes.calculado}/${r.veuAntes.explorar}/${r.veuAntes.veredito})`);
      await rolarAte(page, '[data-capture="instrumento"]');
      await foto(page, `${nome}-2-previsao`, arquivos);
      await page.fill('[data-capture="campo-previsao"]', cfg.palpite);
      await page.click('[data-capture="registrar-previsao"]');
      await page.waitForTimeout(400);
      r.veuDepois = await medirVeu(page, cfg.tokens);
      if (!r.veuDepois.explorar || !r.veuDepois.veredito) prob('depois da previsão o instrumento não abriu');
      await rolarAte(page, '[data-capture="instrumento"]');
      await foto(page, `${nome}-3-previsto-x-calculado`, arquivos);
      const regua = await page.$('[data-capture="explorar"] [role="slider"]');
      if (regua) { await regua.focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300); }
      r.depoisDeMexer = await page.evaluate(() => document.querySelector('.av-veredito')?.textContent?.slice(0, 90) ?? null);
    }

    const item = await page.$('[data-capture="item"]');
    if (item) {
      r.refAntes = await page.evaluate(() => document.querySelectorAll('[data-capture="referencia"]').length);
      if (r.refAntes) prob('referência visível antes da tentativa');
      await rolarAte(page, '[data-capture="item"]', 0.1);
      const area = await item.$('textarea');
      if (area) await area.fill('Minha tentativa antes de ver a referência.');
      else await (await item.$('[role="radio"]')).click();
      await (await item.$('[data-capture="registrar-resposta"]')).click();
      await page.waitForTimeout(300);
      r.refDepois = await page.evaluate(() => document.querySelectorAll('[data-capture="referencia"]').length);
      if (!r.refDepois) prob('referência não apareceu depois da tentativa');
      await rolarAte(page, '[data-capture="item"]', 0.1);
      await foto(page, `${nome}-4-exercicio`, arquivos);
    }

    if (await page.$('[data-capture="prova"]')) {
      await rolarAte(page, '[data-capture="criterio"]', 0.1);
      await foto(page, `${nome}-5-prova`, arquivos);
      const qs = await page.$$('.av-prova-lista > li');
      r.questoes = qs.length;
      for (let i = 0; i < qs.length; i++) await page.click(`.av-prova-lista > li >> nth=${i} >> [role="radio"] >> nth=${i % 2 ? 2 : 1}`);
      await page.click('[data-capture="registrar-prova"]');
      await page.waitForTimeout(300);
      r.resultadoProva = await page.evaluate(() => document.querySelector('[data-capture="resultado-prova"]')?.textContent ?? null);
      await rolarAte(page, '[data-capture="resultado-prova"]', 0.1);
      await foto(page, `${nome}-5b-prova-resultado`, arquivos);
    }

    await rolarAte(page, '[data-capture="registro-da-aula"]', 0.2);
    await page.waitForTimeout(900);
    await foto(page, `${nome}-6-fim`, arquivos);
    r.pagina2 = await medirPagina(page);

    if (r.pagina.overflowH || r.pagina2.overflowH) prob(`rolagem lateral: ${[...r.pagina.fora, ...r.pagina2.fora].join(', ')}`);
    const quebradas = r.pagina2.imgs.filter((i) => !i.ok);
    if (quebradas.length) prob(`imagem quebrada: ${quebradas.map((i) => i.src).join(', ')}`);
    if (r.pagina2.proibidas.length) prob(`texto proibido: ${r.pagina2.proibidas.join(', ')}`);
    if (r.pagina2.video) prob('vídeo na aula');
    if (erros.length) prob(`console: ${erros.join(' || ')}`);
    r.eventos = events.map((e) => `${e?.eventType}:${e?.metadata?.ato ?? ''}`);
    if (r.problemas.length) falhas++;
    relatorio.push(r);
    const p = r.pagina2;
    console.log(
      `${r.problemas.length ? '✗' : '✓'} ${nome} vw=${p.innerWidth} modo=${r.modoAplicado} notas=${p.notas} tab=${p.tabelas} lis=${p.listas} form=${p.formulas} inst=${p.instrumentos} itens=${p.itens} termos=${p.termos}` +
        (r.veuAntes ? ` véu:${r.veuAntes.noDom}noDOM/${r.veuAntes.visiveis.length}vis→expl=${r.veuDepois.explorar} vd=${r.veuDepois.veredito}` : '') +
        (item ? ` ref ${r.refAntes}→${r.refDepois}` : '') +
        (r.questoes ? ` prova=${r.questoes} «${(r.resultadoProva ?? '').slice(0, 60)}»` : '') +
        ` ev=${events.length}` +
        (r.problemas.length ? `\n    ${r.problemas.join('\n    ')}` : ''),
    );
    await ctx.close();
  }
}
await fs.writeFile(path.join(OUT, 'relatorio.json'), JSON.stringify(relatorio, null, 2));
await browser.close();
console.log(falhas ? `RESULTADO: ${falhas} combinação(ões) com problema` : `RESULTADO: ${relatorio.length} combinações sem problema`);
process.exit(falhas ? 1 : 0);
