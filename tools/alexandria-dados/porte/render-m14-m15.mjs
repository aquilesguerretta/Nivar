// Verificação no render das aulas do M14 ou do M15 no modelo v3.
//
// Para cada aula × {1440×900, 390×844} × {claro, noturno} × {sem conta, com conta}:
//   - largura medida = a pedida (window.innerWidth) e a raiz .alx3 montada;
//   - nenhuma imagem quebrada (naturalWidth > 0), nenhuma rolagem lateral, nenhum erro de
//     console nem exceção de página;
//   - todos os instrumentos da aula montados; campo de seleção desenhado como opções;
//   - VÉU, por instrumento com previsão: antes do registro não há controle, saída nem o
//     calculado no DOM (retângulos medidos); depois do registro, aparece a comparação com o
//     calculado da calculadora (ou a espera pelo exercício, quando o cenário é o dele);
//     instrumento sem previsão mostra os controles e as saídas de saída;
//   - exercícios: tantos no DOM quanto no dado; nenhuma referência antes da tentativa;
//   - figuras do módulo presentes; na última aula, prova e checklist.
//
// O calculado esperado é computado DENTRO da página, importando pelo Vite os mesmos módulos
// que a aula usa (modulos-v3/mNN.ts e calculadoras/mNN.ts) — não é digitado aqui.
//
// "Com conta" é simulado só no navegador de teste: /api/auth/me devolve um usuário de teste
// e toda escrita em /api é respondida localmente (201); nada chega ao backend e nenhuma conta
// é criada. "Sem conta": /api/auth/me responde 401 (o comportamento real sem sessão).
//
// Uso: PLAYWRIGHT_CORE=<pasta do pacote> node tools/alexandria-dados/porte/render-m14-m15.mjs 14 http://localhost:5314 [pasta-de-capturas] [--aula N]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2]);
const NN = String(n).padStart(2, '0');
const BASE = process.argv[3] ?? 'http://localhost:5314';
const SAIDA = process.argv[4] && !process.argv[4].startsWith('--') ? process.argv[4] : null;
const SO_AULA = process.argv.includes('--aula') ? Number(process.argv[process.argv.indexOf('--aula') + 1]) : null;
const pw = await import(pathToFileURL(path.join(process.env.PLAYWRIGHT_CORE, 'index.js')).href);
const chromium = pw.chromium ?? pw.default.chromium;
const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const conteudo = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
const avaliacao = await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`)).href);
const AULAS = conteudo[`MODULO_${NN}_AULAS`];
const TRILHA = 'trilha-especializacao-estrategica';

const USUARIO = { id: 'teste-render', email: 'render@teste.invalid', name: 'Teste de render', authMethods: ['password'], createdAt: '2026-11-15T00:00:00Z', updatedAt: '2026-11-15T00:00:00Z' };
const PROGRESSO = { data: { aulasConcluidas: [], aulasEmAndamento: [], badges: [], streak: { atual: null, maior: null, ultimoDiaAtivo: null, maiorAte: null, fuso: 'America/Sao_Paulo', semRegistro: true } } };
async function rotas(ctx, conta) {
  await ctx.route('**/api/**', (r) => {
    const u = r.request().url();
    if (u.includes('/api/auth/me')) return conta ? r.fulfill({ status: 200, json: { user: USUARIO } }) : r.fulfill({ status: 401, json: { detail: 'sem sessão' } });
    if (r.request().method() !== 'GET') return r.fulfill({ status: 201, json: { ok: true } });
    if (u.includes('/api/progress/me')) return conta ? r.fulfill({ status: 200, json: PROGRESSO }) : r.fulfill({ status: 401, json: {} });
    if (u.includes('/api/products/me')) return r.fulfill({ status: conta ? 200 : 401, json: { products: [], catalog: [] } });
    return r.fulfill({ status: 404, json: {} });
  });
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const resultados = [];
const combos = [];
for (const a of AULAS) if (!SO_AULA || a.number === SO_AULA)
  for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) for (const modo of ['claro', 'noturno']) for (const conta of [false, true]) combos.push({ a, vp, modo, conta });

for (const { a, vp, modo, conta } of combos) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  await ctx.addInitScript((m) => { try { localStorage.setItem('alx3-modo', m); } catch { /* sem storage */ } }, modo);
  await rotas(ctx, conta);
  const page = await ctx.newPage();
  const erros = [];
  const respostas = [];
  page.on('response', (r) => { if (r.status() >= 400) respostas.push(`${r.status()} ${r.url().replace(BASE, '')}`); });
  // 401/404 de /api são as respostas simuladas acima (o 401 do visitante é o real sem sessão)
  page.on('console', (msg) => { if (msg.type() === 'error' && !/Failed to load resource: the server responded with a status of 40[14]/.test(msg.text())) erros.push(msg.text().slice(0, 200)); });
  page.on('pageerror', (e) => erros.push('pageerror: ' + String(e.message).slice(0, 200)));
  const falhas = [];
  const notas = [];
  try {
    await page.goto(`${BASE}/alexandria/trilha/${TRILHA}/modulo/modulo-${NN}/aula/${a.number}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-capture="aula-v3"]', { timeout: 20000 });
    await page.evaluate(async () => {
      const raiz = document.querySelector('.alx3') ?? document.scrollingElement;
      for (let y = 0; y < raiz.scrollHeight; y += 700) { raiz.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); }
      raiz.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);
    const m = await page.evaluate(() => {
      const raiz = document.querySelector('.alx3');
      const visivel = (e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
      return {
        w: window.innerWidth,
        temRaiz: Boolean(raiz),
        lateralRaiz: raiz ? raiz.scrollWidth - raiz.clientWidth : null,
        lateralDoc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        largos: [...document.querySelectorAll('.alx3 *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.dg-rolagem, .av-tabela-rolo')).slice(0, 3).map((e) => `${e.tagName}.${e.className}`.slice(0, 80)),
        imgs: [...document.querySelectorAll('img')].map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0 })),
        figuras: [...document.querySelectorAll('[data-capture="figura"]')].map((f) => ({ id: f.getAttribute('data-figura'), svg: Boolean(f.querySelector('svg')), visivel: visivel(f) })),
        instrumentos: [...document.querySelectorAll('[data-capture="instrumento"]')].map((s) => s.id.replace('instrumento-', '')),
        itens: document.querySelectorAll('[data-capture="item"]').length,
        referencias: document.querySelectorAll('[data-capture="referencia"]').length,
        prova: Boolean(document.querySelector('[data-capture="prova"]')),
        checklist: Boolean(document.querySelector('[data-capture="checklist"]')),
      };
    });
    if (m.w !== vp.w) falhas.push(`largura medida ${m.w} ≠ ${vp.w}`);
    if (!m.temRaiz) falhas.push('sem raiz .alx3');
    if (m.lateralRaiz > 0 || m.lateralDoc > 0) falhas.push(`rolagem lateral (raiz ${m.lateralRaiz}, doc ${m.lateralDoc}) ${m.largos.join(' ')}`);
    for (const i of m.imgs) if (!i.ok) falhas.push(`imagem quebrada ${i.src}`);
    for (const f of m.figuras) if (!f.visivel) falhas.push(`figura ${f.id} sem área`);
    if (m.referencias > 0) falhas.push(`${m.referencias} referência(s) no DOM antes da tentativa`);
    const esperados = avaliacao.EXERCICIOS_DAS_AULAS.filter((e) => e.aula === a.number).length + (a.number === AULAS.length ? avaliacao.EXERCICIOS_DO_MODULO.length : 0);
    if (m.itens !== esperados) falhas.push(`exercícios: ${m.itens} no DOM × ${esperados} no dado`);
    if (a.number === AULAS.length && !m.prova) falhas.push('última aula sem a prova do módulo');
    if (a.number === AULAS.length && avaliacao.CHECKLISTS.length && !m.checklist) falhas.push('última aula sem o checklist');
    if (m.figuras.length) notas.push(`${m.figuras.length} figura(s)`);

    // instrumentos
    for (const inst of a.instruments) {
      if (!m.instrumentos.includes(inst.id)) { falhas.push(`instrumento ${inst.id} não montado`); continue; }
      // previsão e calculado esperado, computados na página com os módulos da aula
      const esperado = await page.evaluate(async ({ id, NN }) => {
        const mod = (await import(`/src/lib/alexandria/modulos-v3/m${NN}.ts`)).MODULO_V3;
        const calc = (await import(`/src/lib/data/calculadoras/m${NN}.ts`)).CALCULADORAS[id];
        const p = mod.previsoes.find((x) => x.instrumentoId === id);
        if (!p) return null;
        const r = calc(p.cenario);
        const g = p.grandeza;
        if (g.tipo === 'escolha') {
          const bruto = String(r.textos?.[g.saida] ?? r.valores[g.saida] ?? '').replace(/<[^>]*>/g, '').trim().toLowerCase();
          const o = g.opcoes.find((x) => x.valor.toLowerCase() === bruto || x.rotulo.toLowerCase() === bruto);
          return { tipo: 'escolha', alvo: o ? o.rotulo : null, espera: p.abreDepoisDoExercicio ?? null, velar: p.velar, cenario: p.cenario };
        }
        const v = r.valores[g.saida];
        return { tipo: g.tipo, alvo: v.toLocaleString('pt-BR', { minimumFractionDigits: g.casas, maximumFractionDigits: g.casas }), espera: p.abreDepoisDoExercicio ?? null, velar: p.velar, cenario: p.cenario };
      }, { id: inst.id, NN });
      const sel = `#instrumento-${inst.id}`;
      const antes = await page.evaluate(({ sel, alvo }) => {
        const s = document.querySelector(sel);
        const r = (q) => [...s.querySelectorAll(q)].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; }).length;
        return {
          prever: r('[data-capture="prever"]'),
          controles: r('[data-capture="explorar"] input, [data-capture="explorar"] [role="radiogroup"], [role="slider"]'),
          saidas: r('.av-saida, [data-capture="calculado"], [data-capture="comparacao"], .av-veredito'),
          // número inteiro, nas fronteiras de dígito ("1,18" não conta como "18")
          alvoNoDom: alvo ? new RegExp(`(^|[^\\d,.])${alvo.replace(/\./g, '\\.')}(?!\\d|,\\d)`).test(s.textContent) : false,
          selectsComoOpcoes: r('.av-opcoes'),
          selectsComoTexto: [...s.querySelectorAll('.av-campo input')].filter((i) => /[a-z]/i.test(i.value)).length,
        };
      }, { sel, alvo: esperado?.tipo === 'numero' ? esperado.alvo : null });
      if (!esperado) {
        if (antes.prever) falhas.push(`${inst.id}: quadro de previsão sem previsão declarada`);
        if (!antes.controles) falhas.push(`${inst.id}: sem previsão e sem controles`);
        if (antes.selectsComoTexto) falhas.push(`${inst.id}: seleção desenhada como texto`);
        notas.push(`${inst.id.slice(-2)} sem previsão (consulta)`);
        continue;
      }
      if (!antes.prever) falhas.push(`${inst.id}: quadro de previsão ausente`);
      if (antes.controles || antes.saidas) falhas.push(`${inst.id}: véu — ${antes.controles} controle(s) e ${antes.saidas} saída(s) antes da previsão`);
      if (antes.alvoNoDom) falhas.push(`${inst.id}: véu — o calculado ${esperado.alvo} está no DOM antes da previsão`);
      // véu da prosa: o trecho velado não está na página antes da previsão
      // cenário no quadro da previsão: cada número mostrado lê de volta EXATAMENTE o do cenário
      const mostrados = await page.evaluate((sel) => [...document.querySelectorAll(`${sel} [data-capture="prever"] .av-cenario dd`)].map((d) => d.childNodes[0]?.textContent?.trim() ?? ''), sel);
      const numeros = Object.values(esperado.cenario ?? {}).filter((v) => typeof v === 'number');
      if (mostrados.length !== numeros.length) falhas.push(`${inst.id}: cenário com ${mostrados.length} valor(es) na tela × ${numeros.length} no dado`);
      mostrados.forEach((t, k) => {
        const lido = Number(t.replace(/\./g, '').replace(',', '.'));
        if (lido !== numeros[k]) falhas.push(`${inst.id}: cenário mostra «${t}» para ${numeros[k]}`);
      });
      const veladosAntes = await page.evaluate((vs) => vs.filter((v) => document.body.textContent.includes(v)), esperado.velar ?? []);
      for (const v of veladosAntes) falhas.push(`${inst.id}: véu — o trecho «${v}» está na página antes da previsão`);
      // registra uma previsão
      if (esperado.tipo === 'escolha') await page.locator(`${sel} [data-capture="prever"] .av-escolha`).first().click();
      else await page.locator(`${sel} [data-capture="campo-previsao"]`).fill('1');
      await page.locator(`${sel} [data-capture="registrar-previsao"]`).click();
      await page.waitForTimeout(150);
      const depois = await page.evaluate((sel) => {
        const s = document.querySelector(sel);
        return {
          comparacao: Boolean(s.querySelector('[data-capture="comparacao"]')),
          espera: Boolean(s.querySelector('[data-capture="espera"]')),
          calculado: s.querySelector('[data-capture="calculado"]')?.textContent ?? null,
          opcoes: s.querySelectorAll('.av-opcoes').length,
          selectsComoTexto: [...s.querySelectorAll('.av-campo input')].filter((i) => /[a-z]/i.test(i.value)).length,
        };
      }, sel);
      if (!esperado.espera) {
        const veladosDepois = await page.evaluate((vs) => vs.filter((v) => !document.body.textContent.includes(v)), esperado.velar ?? []);
        for (const v of veladosDepois) falhas.push(`${inst.id}: o trecho velado «${v}» não voltou depois da previsão`);
        if ((esperado.velar ?? []).length) notas.push(`${inst.id.slice(-2)} véu na prosa ok`);
      }
      if (esperado.espera) {
        if (!depois.espera) falhas.push(`${inst.id}: previsão registrada, mas não espera ${esperado.espera}`);
        if (depois.comparacao) falhas.push(`${inst.id}: calculado abriu antes da tentativa de ${esperado.espera}`);
        notas.push(`${inst.id.slice(-2)} espera ${esperado.espera}`);
      } else {
        if (!depois.comparacao) falhas.push(`${inst.id}: previsão registrada e a comparação não apareceu`);
        if (!depois.calculado || !esperado.alvo || !depois.calculado.includes(esperado.alvo)) falhas.push(`${inst.id}: calculado «${depois.calculado}» × esperado «${esperado.alvo}»`);
        if (depois.selectsComoTexto) falhas.push(`${inst.id}: seleção desenhada como texto`);
        notas.push(`${inst.id.slice(-2)} abre ${esperado.alvo}`);
      }
    }
    if (erros.length) falhas.push(`console: ${erros.slice(0, 2).join(' | ')}`);
    const foraApi = respostas.filter((x) => !/ \/api\//.test(x));
    if (foraApi.length) falhas.push(`recurso ≥ 400 fora de /api: ${foraApi.slice(0, 3).join(' | ')}`);
    if (SAIDA) {
      fs.mkdirSync(SAIDA, { recursive: true });
      await page.screenshot({ path: path.join(SAIDA, `m${NN}-a${String(a.number).padStart(2, '0')}-${vp.w}-${modo}-${conta ? 'conta' : 'visitante'}.png`), fullPage: false });
    }
  } catch (e) {
    falhas.push(`exceção: ${String(e.message).slice(0, 200)}`);
  }
  resultados.push({ aula: a.number, vp: vp.w, modo, conta, falhas, notas });
  await ctx.close();
}
await browser.close();

let total = 0;
for (const r of resultados) {
  total += r.falhas.length;
  console.log(`${r.falhas.length ? '✗' : '✓'} A${String(r.aula).padStart(2, '0')} ${r.vp} ${r.modo.padEnd(7)} ${r.conta ? 'conta    ' : 'visitante'}${r.notas.length ? '  · ' + r.notas.join(' · ') : ''}`);
  for (const f of r.falhas) console.log(`      ${f}`);
}
console.log(`\n${resultados.length} páginas · ${total} falha(s)`);
process.exit(total ? 1 : 0);
