// Verificação no render das aulas de um módulo no modelo v3 (M16, M17).
//
// Para cada aula × {1440×900, 390×844} × {claro, noturno} × {sem conta, com conta}:
//   - largura medida = a pedida (window.innerWidth), e a raiz .alx3 montada;
//   - nenhuma imagem quebrada (naturalWidth > 0 em toda <img>);
//   - nenhuma rolagem lateral (scrollWidth ≤ clientWidth na .alx3 e no documento);
//   - nenhum erro de console nem exceção de página;
//   - VÉU: no instrumento com previsão, antes do registro o DOM não tem controles,
//     saídas nem o calculado (texto e retângulos medidos); depois do registro, a
//     comparação aparece (ou a espera pelo exercício, quando há);
//   - exercícios: a referência não está no DOM antes da tentativa;
//   - na última aula, a prova do módulo está presente.
//
// "Com conta" é simulado SÓ no navegador de teste: /api/auth/me devolve um usuário de
// teste e toda escrita em /api é respondida localmente (201) — nada chega ao backend,
// e nenhuma conta é criada. "Sem conta": /api/auth/me responde 401.
//
// Requer playwright-core instalado fora do repo (PLAYWRIGHT_CORE=caminho do pacote) e o
// Chrome do sistema. Uso:
//   PLAYWRIGHT_CORE=… node tools/alexandria-dados/porte/render-m16-m17.mjs 16 http://localhost:5316 [saida/]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2]);
const NN = String(n).padStart(2, '0');
const BASE = process.argv[3] ?? 'http://localhost:5316';
const SAIDA = process.argv[4] ?? null;
const SO_AULA = process.argv.includes('--aula') ? Number(process.argv[process.argv.indexOf('--aula') + 1]) : null;
const pw = await import(pathToFileURL(path.join(process.env.PLAYWRIGHT_CORE, 'index.js')).href);
const chromium = pw.chromium ?? pw.default.chromium;
const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const conteudo = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
const modV3 = (await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/modulos-v3/m${NN}.ts`)).href)).MODULO_V3;
const calc = (await import(pathToFileURL(path.join(RAIZ, `src/lib/data/calculadoras/m${NN}.ts`)).href)).CALCULADORAS;
const avaliacao = await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`)).href);
const AULAS = conteudo[`MODULO_${NN}_AULAS`];
const TRILHA = 'trilha-especializacao-estrategica';

const USUARIO = { id: 'teste-render', email: 'render@teste.invalid', name: 'Teste de render', authMethods: ['password'], createdAt: '2026-11-15T00:00:00Z', updatedAt: '2026-11-15T00:00:00Z' };
const PROGRESSO = { data: { aulasConcluidas: [], aulasEmAndamento: [], badges: [], streak: { atual: null, maior: null, ultimoDiaAtivo: null, maiorAte: null, fuso: 'America/Sao_Paulo' } } };

async function rotas(ctx, conta) {
  await ctx.route('**/api/**', (r) => {
    const u = r.request().url();
    const m = r.request().method();
    if (u.includes('/api/auth/me')) return conta ? r.fulfill({ status: 200, json: { user: USUARIO } }) : r.fulfill({ status: 401, json: { detail: 'sem sessão' } });
    if (m !== 'GET') return r.fulfill({ status: 201, json: { ok: true } });
    if (u.includes('/api/progress/me')) return conta ? r.fulfill({ status: 200, json: PROGRESSO }) : r.fulfill({ status: 401, json: {} });
    if (u.includes('/api/products/me')) return r.fulfill({ status: conta ? 200 : 401, json: { products: [], catalog: [] } });
    return r.fulfill({ status: 404, json: {} });
  });
}

const fmt = (v, c) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: c, maximumFractionDigits: c });
const resultados = [];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const combos = [];
for (const a of AULAS) if (!SO_AULA || a.number === SO_AULA)
  for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) for (const modo of ['claro', 'noturno']) for (const conta of [false, true]) combos.push({ a, vp, modo, conta });

for (const { a, vp, modo, conta } of combos) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
  await ctx.addInitScript((m) => { try { localStorage.setItem('alx3-modo', m); } catch {} }, modo);
  await rotas(ctx, conta);
  const page = await ctx.newPage();
  const erros = [];
  // "Failed to load resource" de /api é a resposta simulada acima (401 do visitante é o
  // comportamento real da plataforma sem sessão); as respostas ≥ 400 são listadas à parte.
  const respostas = [];
  page.on('response', (r) => { if (r.status() >= 400) respostas.push(`${r.status()} ${r.url().replace(BASE, '')}`); });
  page.on('console', (msg) => { if (msg.type() === 'error' && !/Failed to load resource: the server responded with a status of 40[14]/.test(msg.text())) erros.push(msg.text().slice(0, 200)); });
  page.on('pageerror', (e) => erros.push('pageerror: ' + String(e.message).slice(0, 200)));
  const url = `${BASE}/alexandria/trilha/${TRILHA}/modulo/modulo-${NN}/aula/${a.number}`;
  const falhas = [];
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-capture="aula-v3"]', { timeout: 15000 });
    // rola até o fim para disparar carregamentos tardios e medir a página inteira
    await page.evaluate(async () => {
      const raiz = document.querySelector('.alx3') ?? document.scrollingElement;
      for (let y = 0; y < raiz.scrollHeight; y += 700) { raiz.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
      raiz.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const m = await page.evaluate(() => {
      const raiz = document.querySelector('.alx3');
      const imgs = [...document.querySelectorAll('img')].map((i) => ({ src: i.currentSrc || i.src, w: i.naturalWidth, ok: i.complete && i.naturalWidth > 0 }));
      const largos = [...document.querySelectorAll('.alx3 *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.dg-rolagem, .av-tabela-rolo')).slice(0, 3).map((e) => `${e.tagName}.${e.className}`.slice(0, 80));
      return {
        w: window.innerWidth,
        modo: document.querySelector('.alx3')?.getAttribute('data-modo') ?? document.documentElement.getAttribute('data-modo'),
        temRaiz: Boolean(raiz),
        lateralRaiz: raiz ? raiz.scrollWidth - raiz.clientWidth : null,
        lateralDoc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        largos,
        imgs,
        instrumentos: [...document.querySelectorAll('[data-capture="instrumento"]')].map((s) => s.id),
        prever: Boolean(document.querySelector('[data-capture="prever"]')),
        explorar: Boolean(document.querySelector('[data-capture="explorar"]')),
        itens: document.querySelectorAll('[data-capture="item"]').length,
        referencias: document.querySelectorAll('[data-capture="referencia"]').length,
        prova: Boolean(document.querySelector('[data-capture="prova"], #avaliacao-do-modulo')),
        selectComoTexto: [...document.querySelectorAll('[data-capture="explorar"] .av-campo input')].length,
      };
    });
    if (m.w !== vp.w) falhas.push(`largura medida ${m.w} ≠ ${vp.w}`);
    if (!m.temRaiz) falhas.push('sem raiz .alx3');
    if (m.lateralRaiz > 0 || m.lateralDoc > 0) falhas.push(`rolagem lateral (raiz ${m.lateralRaiz}, doc ${m.lateralDoc}) ${m.largos.join(' ')}`);
    for (const i of m.imgs) if (!i.ok) falhas.push(`imagem quebrada ${i.src}`);
    if (m.referencias > 0) falhas.push(`${m.referencias} referência(s) no DOM antes da tentativa`);
    const esperadosItens = avaliacao.EXERCICIOS_DAS_AULAS.filter((e) => e.aula === a.number).length;
    if (m.itens !== esperadosItens) falhas.push(`exercícios: ${m.itens} no DOM × ${esperadosItens} no dado`);
    if (a.number === AULAS.length && !m.prova) falhas.push('última aula sem a prova do módulo');

    // instrumentos: todos os da aula, cada um com a sua previsão (ou aberto, sem previsão)
    const notas = [];
    // nenhum instrumento aberto pode trazer tag literal no texto visível
    const tagLiteral = async () => page.evaluate(() => [...document.querySelectorAll('[data-capture="instrumento"]')].filter((s) => /<\/?(b|br|em|div|span)\b/.test(s.innerText)).map((s) => s.id));
    for (const inst of a.instruments) {
      const pv = modV3.previsoes.find((p) => p.instrumentoId === inst.id) ?? null;
      if (!m.instrumentos.includes(`instrumento-${inst.id}`)) { falhas.push(`instrumento ${inst.id} não montado`); continue; }
      if (!pv) {
        const aberto = await page.evaluate((id) => Boolean(document.querySelector(`#instrumento-${id} [data-capture="explorar"]`)), inst.id);
        if (!aberto) falhas.push(`${inst.id} sem previsão e sem explorar`);
        notas.push(`${inst.id} sem previsão (consulta)`);
        continue;
      }
      const g = pv.grandeza;
      const r0 = calc[inst.id](pv.cenario);
      let alvo;
      if (g.tipo === 'escolha') {
        const bruto = String(r0.textos?.[g.saida] ?? '').toLowerCase();
        alvo = g.opcoes.find((o) => o.valor.toLowerCase() === bruto || o.rotulo.toLowerCase() === bruto)?.rotulo ?? null;
        if (!alvo) falhas.push(`${inst.id}: a saída ${g.saida} não casa com nenhuma opção`);
      } else alvo = fmt(r0.valores[g.saida], g.casas);
      // antes: nada do calculado
      const antes = await page.evaluate(({ id, alvo, escolha }) => {
        const s = document.getElementById(`instrumento-${id}`);
        const r = (q) => [...s.querySelectorAll(q)].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; }).length;
        return {
          texto: !escolha && alvo && s.innerText.includes(alvo),
          controles: r('[data-capture="explorar"], .av-controles, input:not([data-capture="campo-previsao"]), select, [role="slider"]'),
          saidas: r('.av-saida, .av-veredito, [data-capture="calculado"], [data-capture="comparacao"]'),
          prever: r('[data-capture="prever"]'),
        };
      }, { id: inst.id, alvo, escolha: g.tipo === 'escolha' });
      if (!antes.prever) falhas.push(`${inst.id} véu: quadro de previsão ausente`);
      if (antes.controles || antes.saidas) falhas.push(`${inst.id} véu: ${antes.controles} controle(s) e ${antes.saidas} saída(s) renderizados antes da previsão`);
      if (antes.texto) falhas.push(`${inst.id} véu: o calculado ${alvo} está no DOM antes da previsão`);
      // registra uma previsão e confere a abertura
      const sec = page.locator(`#instrumento-${inst.id}`);
      if (g.tipo === 'escolha') await sec.locator('.av-escolha').first().click();
      else await sec.locator('[data-capture="campo-previsao"]').fill('1');
      await sec.locator('[data-capture="registrar-previsao"]').click();
      await page.waitForTimeout(200);
      const depois = await page.evaluate((id) => {
        const s = document.getElementById(`instrumento-${id}`);
        return { comparacao: Boolean(s.querySelector('[data-capture="comparacao"]')), espera: Boolean(s.querySelector('[data-capture="espera"]')), calculado: s.querySelector('[data-capture="calculado"]')?.textContent ?? null, explorar: Boolean(s.querySelector('[data-capture="explorar"]')) };
      }, inst.id);
      if (pv.abreDepoisDoExercicio) {
        if (!depois.espera) falhas.push(`${inst.id}: previsão registrada, mas não espera o exercício`);
        if (depois.comparacao) falhas.push(`${inst.id}: o calculado abriu antes da tentativa do exercício`);
      } else {
        if (!depois.comparacao || !depois.explorar) falhas.push(`${inst.id}: previsão registrada, e a comparação ou os controles não apareceram`);
        if (alvo && depois.calculado && !depois.calculado.includes(alvo)) falhas.push(`${inst.id}: calculado «${depois.calculado}» ≠ ${alvo}`);
      }
      notas.push(`${inst.id} ${pv.abreDepoisDoExercicio ? 'espera ' + pv.abreDepoisDoExercicio : 'abre «' + alvo + '»'}`);
    }
    const literais = await tagLiteral();
    if (literais.length) falhas.push(`tag HTML literal no texto de ${literais.join(', ')}`);
    if (m.selectComoTexto) falhas.push(`${m.selectComoTexto} campo(s) select desenhado(s) como texto`);
    if (erros.length) falhas.push(`console: ${erros.slice(0, 2).join(' | ')}`);
    const naoApi = respostas.filter((x) => !/ \/api\//.test(x));
    if (naoApi.length) falhas.push(`recurso ≥ 400 fora de /api: ${naoApi.slice(0, 3).join(' | ')}`);
    const api404 = [...new Set(respostas.filter((x) => x.startsWith('404 /api/')).map((x) => x.split('?')[0]))];
    if (api404.length) notas.push(`/api sem simulação (404): ${api404.join(', ')}`);
    if (SAIDA) {
      fs.mkdirSync(SAIDA, { recursive: true });
      await page.screenshot({ path: path.join(SAIDA, `m${NN}-a${String(a.number).padStart(2, '0')}-${vp.w}-${modo}-${conta ? 'conta' : 'visitante'}.png`), fullPage: false });
    }
    resultados.push({ aula: a.number, vp: vp.w, modo, conta, falhas, notas });
  } catch (e) {
    resultados.push({ aula: a.number, vp: vp.w, modo, conta, falhas: [`exceção: ${String(e.message).slice(0, 200)}`], notas: [] });
  }
  await ctx.close();
}
await browser.close();

let total = 0;
for (const r of resultados) {
  total += r.falhas.length;
  const rot = `A${String(r.aula).padStart(2, '0')} ${r.vp} ${r.modo.padEnd(7)} ${r.conta ? 'conta    ' : 'visitante'}`;
  console.log(`${r.falhas.length ? '✗' : '✓'} ${rot}${r.notas.length ? '  · ' + r.notas.join(' · ') : ''}`);
  for (const f of r.falhas) console.log(`      ${f}`);
}
console.log(`\n${resultados.length} páginas · ${total} falha(s)`);
process.exit(total ? 1 : 0);
