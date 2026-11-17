// Verificação de render do Atlas: abre a rota no Chrome do sistema (Playwright),
// espera o mapa ficar pronto, mede e fotografa.
//
//   node tools/alexandria-atlas/capturar.mjs [--base http://localhost:5173]
//        [--out docs/alexandria-v3/atlas/capturas] [--so <regex de nome>]
//        [--gpu]      tenta a GPU real (ANGLE/D3D11) em vez do rasterizador por software
//        [--janela]   abre janela visível (FPS real da máquina)
//
// Cada captura grava um PNG e uma linha em medidas.json com:
//   · largura/altura reais da janela (window.innerWidth) — medidas, não presumidas;
//   · tempo até o mapa ficar pronto (primeiro "idle" do Mapbox);
//   · FPS parado e FPS com a câmera em movimento, e qual renderizador WebGL mediu;
//   · quantas feições de cada camada estão desenhadas (queryRenderedFeatures);
//   · quantas cores distintas há no retângulo do mapa (prova de canvas desenhado);
//   · erros de console e requisições que falharam.
//
// O painel Browser da sessão não serve para isto: ele não dispara
// requestAnimationFrame e bloqueia a rede externa (medido em 15/11/2026).

import { createRequire } from 'node:module';
import { inflateSync } from 'node:zlib';
import fs from 'node:fs/promises';
import path from 'node:path';

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');

const args = process.argv.slice(2);
const opc = (n, padrao) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : padrao;
};
const BASE = opc('base', 'http://localhost:5173');
const OUT = path.resolve(opc('out', 'docs/alexandria-v3/atlas/capturas'));
const SO = opc('so', null) ? new RegExp(opc('so')) : null;
const GPU = args.includes('--gpu');
const JANELA = args.includes('--janela');

const DESKTOP = [1440, 900];
const CELULAR = [390, 844];

/** @type {{nome:string, rota:string, viewport:number[], modo:'claro'|'noturno', espera?:number, acoes?:any[], reduzido?:boolean, exige?:{modo?:string, camadas?:string[], seletor?:string, zoom?:number, tolZoom?:number}}[]} */
// exige.zoom: o zoom esperado da vista depois das ações (tolerância tolZoom, padrão 0,3); um
// plano sem o campo não muda de comportamento
const PLANO = [
  { nome: 'rede-claro-1440', rota: '/alexandria/atlas', viewport: DESKTOP, modo: 'claro' },
  { nome: 'rede-noturno-1440', rota: '/alexandria/atlas', viewport: DESKTOP, modo: 'noturno' },
  { nome: 'rede-claro-390', rota: '/alexandria/atlas', viewport: CELULAR, modo: 'claro' },
  { nome: 'rede-noturno-390', rota: '/alexandria/atlas', viewport: CELULAR, modo: 'noturno' },
  { nome: 'agua-claro-1440', rota: '/alexandria/atlas?c=agua', viewport: DESKTOP, modo: 'claro' },
  { nome: 'agua-noturno-390', rota: '/alexandria/atlas?c=agua', viewport: CELULAR, modo: 'noturno' },
  { nome: 'trocas-claro-1440', rota: '/alexandria/atlas?c=trocas', viewport: DESKTOP, modo: 'claro' },
  { nome: 'dia-noturno-1440', rota: '/alexandria/atlas?c=dia', viewport: DESKTOP, modo: 'noturno' },
  { nome: 'mundo-claro-1440', rota: '/alexandria/atlas?c=mundo', viewport: DESKTOP, modo: 'claro', espera: 4000 },
  { nome: 'mundo-noturno-390', rota: '/alexandria/atlas?c=mundo', viewport: CELULAR, modo: 'noturno', espera: 4000 },
  { nome: 'reduzido-claro-1440', rota: '/alexandria/atlas', viewport: DESKTOP, modo: 'claro', reduzido: true },
  // troca de modo AO VIVO (clicando no botão da casca): as camadas têm de continuar desenhadas.
  // Foto com o modo gravado antes da carga não pega este defeito (aconteceu: setStyle com diff
  // apagava as camadas do Atlas e o mapa não voltava).
  { nome: 'alternar-modo-rede-1440', rota: '/alexandria/atlas', viewport: DESKTOP, modo: 'claro', acoes: [{ click: '.casa-modo' }, { wait: 6000 }], exige: { modo: 'noturno', camadas: ['usinas', 'linhas'] } },
  { nome: 'alternar-modo-agua-1440', rota: '/alexandria/atlas?c=agua', viewport: DESKTOP, modo: 'noturno', acoes: [{ click: '.casa-modo' }, { wait: 6000 }], exige: { modo: 'claro', camadas: ['reservatorios'] } },
  { nome: 'alternar-modo-celular-390', rota: '/alexandria/atlas', viewport: CELULAR, modo: 'claro', acoes: [{ click: '.casa-modo' }, { wait: 6000 }], exige: { modo: 'noturno', camadas: ['usinas'] } },
  // capítulo "O combustível" (ANP): país no claro, noturno no celular, uma ficha aberta pela busca
  // e a troca de modo ao vivo, que tem de manter gasodutos e instalações desenhados
  { nome: 'combustivel-claro-1440', rota: '/alexandria/atlas?c=combustivel', viewport: DESKTOP, modo: 'claro', espera: 5000, exige: { camadas: ['gasodutos', 'combustivel-instalacoes', 'campos-area'] } },
  { nome: 'combustivel-noturno-390', rota: '/alexandria/atlas?c=combustivel', viewport: CELULAR, modo: 'noturno', espera: 5000, exige: { camadas: ['gasodutos', 'combustivel-instalacoes'] } },
  {
    nome: 'combustivel-ficha-1440',
    rota: '/alexandria/atlas?c=combustivel',
    viewport: DESKTOP,
    modo: 'claro',
    espera: 4000,
    acoes: [{ click: '.atl-busca .atl-campo' }, { fill: ['.atl-busca .atl-campo', 'REPLAN'] }, { wait: 2500 }, { press: 'Enter' }, { wait: 5000 }],
    exige: { camadas: ['combustivel-instalacoes'], seletor: '.atl-ficha' },
  },
  { nome: 'alternar-modo-combustivel-1440', rota: '/alexandria/atlas?c=combustivel', viewport: DESKTOP, modo: 'claro', espera: 5000, acoes: [{ click: '.casa-modo' }, { wait: 6000 }], exige: { modo: 'noturno', camadas: ['gasodutos', 'combustivel-instalacoes'] } },
  // capítulo "O comércio" (MDIC/Comex Stat · ONS): rotas e veículos desenhados nos dois modos e
  // nos dois tamanhos, e a troca de modo ao vivo, que tem de manter rotas e veículos
  { nome: 'comercio-claro-1440', rota: '/alexandria/atlas?c=comercio', viewport: DESKTOP, modo: 'claro', espera: 5000, exige: { camadas: ['comercio-rota-mar', 'comercio-veiculo'] } },
  { nome: 'comercio-noturno-1440', rota: '/alexandria/atlas?c=comercio', viewport: DESKTOP, modo: 'noturno', espera: 5000, exige: { camadas: ['comercio-rota-mar', 'comercio-veiculo'] } },
  { nome: 'comercio-claro-390', rota: '/alexandria/atlas?c=comercio', viewport: CELULAR, modo: 'claro', espera: 5000, exige: { camadas: ['comercio-rota-mar'] } },
  { nome: 'comercio-noturno-390', rota: '/alexandria/atlas?c=comercio', viewport: CELULAR, modo: 'noturno', espera: 5000, exige: { camadas: ['comercio-rota-mar'] } },
  { nome: 'alternar-modo-comercio-1440', rota: '/alexandria/atlas?c=comercio', viewport: DESKTOP, modo: 'claro', espera: 5000, acoes: [{ click: '.casa-modo' }, { wait: 6000 }], exige: { modo: 'noturno', camadas: ['comercio-rota-mar', 'comercio-veiculo'] } },
  // leva 3: o ano da linha do tempo (B1), o dono destacado (B2) e o dia real do ONS (B3), pelos
  // parâmetros do endereço que a página lê (?ano=, ?dono=, ?dia=&hora=)
  { nome: 'rede-ano-1990-claro-1440', rota: '/alexandria/atlas?ano=1990', viewport: DESKTOP, modo: 'claro', espera: 5500, exige: { camadas: ['usinas', 'linhas'] } },
  { nome: 'rede-ano-1985-noturno-390', rota: '/alexandria/atlas?ano=1985', viewport: CELULAR, modo: 'noturno', espera: 5500, exige: { camadas: ['usinas', 'linhas'] } },
  { nome: 'rede-dono-claro-1440', rota: '/alexandria/atlas?dono=AXIA%20ENERGIA%20NORDESTE%20SA', viewport: DESKTOP, modo: 'claro', espera: 5500, exige: { camadas: ['dono', 'usinas'] } },
  { nome: 'rede-dono-noturno-390', rota: '/alexandria/atlas?dono=AXIA%20ENERGIA%20NORDESTE%20SA', viewport: CELULAR, modo: 'noturno', espera: 5500, exige: { camadas: ['dono'] } },
  { nome: 'dia-real-claro-1440', rota: '/alexandria/atlas?c=dia&dia=2026-02-19&hora=19', viewport: DESKTOP, modo: 'claro', espera: 5000, exige: { camadas: ['pulso-disco'] } },
  { nome: 'dia-real-noturno-390', rota: '/alexandria/atlas?c=dia&dia=2026-02-19&hora=19', viewport: CELULAR, modo: 'noturno', espera: 5000, exige: { camadas: ['pulso-disco'] } },
  {
    nome: 'dia-real-ficha-1440',
    rota: '/alexandria/atlas?c=dia&dia=2026-02-19&hora=19',
    viewport: DESKTOP,
    modo: 'noturno',
    espera: 5000,
    // leva 5: clique REAL na primeira de "As maiores da hora" (a maior usina da hora, o maior
    // disco). Antes a cena achava o disco por globalThis.__controleDoAtlas, que só existe em
    // desenvolvimento: contra o build de produção ela quebrava e o medidas.json não era gravado.
    acoes: [{ click: '.atl-op-bloco[aria-label="As maiores da hora"] .atl-op-item' }, { wait: 3000 }],
    exige: { camadas: ['pulso-disco'], seletor: '.atl-ficha' },
  },
];

// plano extra por arquivo: [{nome, rota, viewport, modo, acoes}]
const extra = opc('plano', null);
if (extra) PLANO.push(...JSON.parse(await fs.readFile(extra, 'utf8')));

/** Decodifica um PNG RGB/RGBA de 8 bits (o que o Playwright grava). */
function decodificarPng(buf) {
  let p = 8;
  let largura = 0;
  let altura = 0;
  let tipo = 0;
  const idat = [];
  while (p < buf.length) {
    const tam = buf.readUInt32BE(p);
    const nome = buf.toString('ascii', p + 4, p + 8);
    if (nome === 'IHDR') {
      largura = buf.readUInt32BE(p + 8);
      altura = buf.readUInt32BE(p + 12);
      tipo = buf[p + 17];
    } else if (nome === 'IDAT') idat.push(buf.subarray(p + 8, p + 8 + tam));
    p += 12 + tam;
  }
  const canais = tipo === 6 ? 4 : 3;
  const bruto = inflateSync(Buffer.concat(idat));
  const passo = largura * canais;
  const px = Buffer.alloc(altura * passo);
  for (let y = 0; y < altura; y++) {
    const filtro = bruto[y * (passo + 1)];
    const lin = bruto.subarray(y * (passo + 1) + 1, (y + 1) * (passo + 1));
    for (let x = 0; x < passo; x++) {
      const a = x >= canais ? px[y * passo + x - canais] : 0;
      const b = y > 0 ? px[(y - 1) * passo + x] : 0;
      const c = x >= canais && y > 0 ? px[(y - 1) * passo + x - canais] : 0;
      let v = lin[x];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * passo + x] = v & 255;
    }
  }
  return { largura, altura, canais, px };
}

/** Cores distintas (quantizadas a 4 bits por canal) dentro de um retângulo. */
function coresDistintas(png, r) {
  const cores = new Set();
  const x0 = Math.max(0, Math.round(r.x));
  const y0 = Math.max(0, Math.round(r.y));
  const x1 = Math.min(png.largura, Math.round(r.x + r.width));
  const y1 = Math.min(png.altura, Math.round(r.y + r.height));
  for (let y = y0; y < y1; y += 3) for (let x = x0; x < x1; x += 3) {
    const i = (y * png.largura + x) * png.canais;
    cores.add(((png.px[i] >> 4) << 8) | ((png.px[i + 1] >> 4) << 4) | (png.px[i + 2] >> 4));
  }
  return cores.size;
}

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: !JANELA,
  channel: 'chrome',
  args: GPU || JANELA ? ['--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11'] : ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
});

const medidas = [];
for (const shot of PLANO) {
  if (SO && !SO.test(shot.nome)) continue;
  const ctx = await browser.newContext({
    viewport: { width: shot.viewport[0], height: shot.viewport[1] },
    deviceScaleFactor: 1,
    reducedMotion: shot.reduzido ? 'reduce' : 'no-preference',
    hasTouch: shot.viewport[0] < 768,
    isMobile: shot.viewport[0] < 768,
  });
  await ctx.addInitScript((modo) => {
    try {
      window.localStorage.setItem('alx3-modo', modo);
    } catch {
      /* sem armazenamento */
    }
  }, shot.modo);
  const page = await ctx.newPage();
  const erros = [];
  const falhas = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    // sem sessão, /api/auth/me responde 401: é o estado de visitante, não erro do Atlas
    if (/401 \(Unauthorized\)/.test(t)) return;
    erros.push(t.slice(0, 300));
  });
  page.on('pageerror', (e) => erros.push(`pageerror: ${String(e.message).slice(0, 300)}`));
  page.on('requestfailed', (r) => {
    const u = r.url();
    if (/events\.mapbox\.com/.test(u)) return; // telemetria do Mapbox, cancelada ao fechar
    falhas.push(`${r.failure()?.errorText ?? '?'} ${u.split('?')[0].slice(0, 120)}`);
  });

  // leva 5: a cena inteira num try; se ela quebrar (página fechada, medida que lança), entra no
  // medidas.json como cena com erro e a ferramenta segue para a próxima
  try {
  const t0 = Date.now();
  let pronto = true;
  try {
    await page.goto(BASE + shot.rota, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.atl[data-pronto="sim"]', { timeout: 90_000 });
  } catch (e) {
    pronto = false;
    erros.push(`não ficou pronto: ${String(e.message).split('\n')[0]}`);
  }
  const msAteProntoRelogio = Date.now() - t0;
  // a abertura segura o Titã 1,4 s e voa ao Brasil em 2,6 s; depois disso o mapa precisa
  // terminar de carregar os tiles (com ?cam, vista ou movimento reduzido não há voo, e esperar
  // a mais só custa tempo)
  await page.waitForTimeout(shot.espera ?? 5200);
  // leva 5: ação que falha vira erro da cena (e a cena segue até a foto e as medidas); antes,
  // uma exceção aqui derrubava a ferramenta inteira e o medidas.json não era gravado
  for (const a of shot.acoes ?? []) {
    try {
      if (a.click) await page.click(a.click, { timeout: 15_000 });
      else if (a.fill) await page.fill(a.fill[0], a.fill[1], { timeout: 15_000 });
      else if (a.press) await page.keyboard.press(a.press);
      else if (a.wait) await page.waitForTimeout(a.wait);
      else if (a.mapClick) await page.mouse.click(a.mapClick[0], a.mapClick[1]);
      else if (a.eval) await page.evaluate(a.eval);
    } catch (e) {
      erros.push(`ação ${JSON.stringify(a).slice(0, 100)}: ${String(e.message).split('\n')[0].slice(0, 200)}`);
    }
  }
  await page.evaluate(() => document.fonts.ready);
  // a foto vem antes das medidas: medir FPS em movimento gira a câmera
  const arquivo = path.join(OUT, `${shot.nome}.png`);
  const png = await page.screenshot({ path: arquivo });

  const m = await page.evaluate(async () => {
    const canvas = document.querySelector('.atl-mapa canvas');
    const mapa = document.querySelector('.atl-mapa');
    let renderizador = null;
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      renderizador = gl ? String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) : null;
    } catch {
      /* sem WebGL */
    }
    const a = window.__atlas;
    const raiz = document.querySelector('.alx3');
    return {
      largura: window.innerWidth,
      altura: window.innerHeight,
      modoNaTela: raiz ? raiz.getAttribute('data-modo') : null,
      canvas: canvas ? { w: canvas.width, h: canvas.height } : null,
      retMapa: mapa ? mapa.getBoundingClientRect().toJSON() : null,
      rolagemHorizontal: document.documentElement.scrollWidth > window.innerWidth + 1,
      raizRola: raiz ? raiz.scrollHeight > raiz.clientHeight + 1 : null,
      msAtePronto: a ? a.msAtePronto : null,
      zoom: a ? Math.round(a.zoom * 100) / 100 : null,
      // o zoom do mapa agora (antes do giro do FPS), não o do último render do React
      zoomVivo: (() => {
        try {
          const z = a?.maquetes ? a.maquetes().resumo.zoom : a?.zoom;
          return z == null ? null : Math.round(z * 100) / 100;
        } catch {
          return a ? Math.round(a.zoom * 100) / 100 : null;
        }
      })(),
      capitulo: a ? a.capitulo : null,
      vista: a ? a.vista : null,
      desenhadas: a ? a.desenhadas() : null,
      fps: a ? await a.fps() : null,
      fpsEmMovimento: a ? await a.fpsEmMovimento() : null,
      aviso: document.querySelector('.atl-aviso')?.textContent ?? null,
      fichaAberta: !!document.querySelector('.atl-ficha'),
      renderizador,
    };
  });
  const dec = decodificarPng(png);
  if (shot.exige) {
    if (shot.exige.modo && m.modoNaTela !== shot.exige.modo) erros.push(`exigia modo ${shot.exige.modo} na tela, está ${m.modoNaTela}`);
    for (const c of shot.exige.camadas ?? []) if (!(m.desenhadas?.[c] > 0)) erros.push(`exigia a camada "${c}" desenhada depois das ações, e ela tem ${m.desenhadas?.[c] ?? 0} feições`);
    if (shot.exige.seletor === '.atl-ficha' && !m.fichaAberta) erros.push('exigia a ficha aberta depois das ações');
    if (typeof shot.exige.zoom === 'number') {
      const tol = shot.exige.tolZoom ?? 0.3;
      if (m.zoomVivo == null || Math.abs(m.zoomVivo - shot.exige.zoom) > tol) erros.push(`exigia zoom ${shot.exige.zoom} ± ${tol} depois das ações, está ${m.zoomVivo ?? '—'}`);
    }
  }
  const cores = m.retMapa ? coresDistintas(dec, m.retMapa) : 0;
  const linha = { nome: shot.nome, rota: shot.rota, modo: shot.modo, viewportPedido: shot.viewport, pronto, msAteProntoRelogio, ...m, coresNoMapa: cores, erros, falhasDeRede: falhas.slice(0, 8) };
  delete linha.retMapa;
  medidas.push(linha);
  const des = m.desenhadas ? Object.entries(m.desenhadas).filter(([, v]) => v > 0).map(([k, v]) => `${k} ${v}`).join(' · ') : '—';
  console.log(`${shot.nome.padEnd(22)} ${m.largura}×${m.altura} ${String(m.modoNaTela).padEnd(7)} pronto ${m.msAtePronto ?? '—'} ms · fps ${m.fps}/${m.fpsEmMovimento} · cores ${cores} · ${des}${erros.length ? ` · ERROS ${erros.length}` : ''}${m.aviso ? ` · AVISO: ${m.aviso.slice(0, 80)}` : ''}`);
  for (const e of erros) console.log(`    erro: ${e}`);
  } catch (e) {
    erros.push(`cena quebrou: ${String(e?.message ?? e).split('\n')[0].slice(0, 300)}`);
    medidas.push({ nome: shot.nome, rota: shot.rota, modo: shot.modo, viewportPedido: shot.viewport, pronto: false, erros, falhasDeRede: falhas.slice(0, 8) });
    console.log(`${shot.nome.padEnd(22)} CENA QUEBROU: ${erros[erros.length - 1]}`);
  }
  await ctx.close().catch(() => {});
}
await browser.close();
const anteriores = SO ? JSON.parse(await fs.readFile(path.join(OUT, 'medidas.json'), 'utf8').catch(() => '[]')).filter((x) => !medidas.some((y) => y.nome === x.nome)) : [];
await fs.writeFile(path.join(OUT, 'medidas.json'), JSON.stringify([...anteriores, ...medidas], null, 2) + '\n');
console.log(`\n${medidas.length} captura(s) em ${path.relative(process.cwd(), OUT)} · renderizador: ${medidas[0]?.renderizador ?? '—'}`);
if (medidas.some((x) => !x.pronto || x.erros.length)) process.exitCode = 1;
