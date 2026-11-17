// Comércio exterior de energia do Brasil, 2025 fechado: monta o arquivo publicado.
//
//   node tools/alexandria-atlas/comercio/baixar.mjs      (uma vez; grava o bruto)
//   node --max-old-space-size=6000 tools/alexandria-atlas/comercio/construir.mjs [--marnet | --arco] [--svg <saida.svg>] [--rotas-json <saida.json>]
//
// Lê só tools/alexandria-atlas/bruto/comercio/ (e, do repositório, o que já está publicado:
// combustivel-instalacoes.geojson, rede-subestacoes.geojson, world-110m.json e a tabela numérico →
// alfa-3 de worldApi.ts). Escreve public/alexandria/atlas/dados/comercio-2025.json.
// Padrão: rotas marítimas do roteador próprio (roteador.mjs, Natural Earth 10m, ~1,5 min).
// --marnet volta à rede do Eurostat da leva 1 (e escreve comercio-rotas-licenca.json, EUPL 1.2);
// --arco usa o arco geodésico; --svg desenha as rotas sobre o 110m; --rotas-json grava, por rota,
// os pontos que o roteador mediu sobre terra (para desenhar.mjs --trechos). Prova visual: desenhar.mjs.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { feature as topoFeature } from 'topojson-client';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..', '..');
const BRUTO = join(AQUI, '..', 'bruto', 'comercio');
const SAIDA = join(RAIZ, 'public', 'alexandria', 'atlas', 'dados', 'comercio-2025.json');
const SAIDA_LICENCA = join(RAIZ, 'public', 'alexandria', 'atlas', 'dados', 'comercio-rotas-licenca.json');
const ARGS = process.argv.slice(2);
const ARCO = ARGS.includes('--arco');
// Padrão (leva 2): roteador próprio sobre o Natural Earth (roteador.mjs), sem dever de licença.
// --marnet volta à rede do Eurostat (EUPL 1.2, copyleft sobre as geometrias) da leva 1.
const MARNET = !ARCO && ARGS.includes('--marnet');
const METODO = ARCO ? 'arco' : MARNET ? 'marnet' : 'mar';
const SVG = ARGS.includes('--svg') ? ARGS[ARGS.indexOf('--svg') + 1] : null;
const ROTAS_JSON = ARGS.includes('--rotas-json') ? ARGS[ARGS.indexOf('--rotas-json') + 1] : null;

const lerBruto = (n, enc = 'utf8') => readFileSync(join(BRUTO, n), enc);
const json = (n) => JSON.parse(lerBruto(n));
const CONSULTAS = json('consultas.json');
const sha = (b) => createHash('sha256').update(b).digest('hex');
const avisos = [];

// Confere o bruto contra o registro do download (um arquivo trocado à mão não passa calado).
for (const [nome, r] of Object.entries(CONSULTAS)) {
  const h = sha(readFileSync(join(BRUTO, nome)));
  if (h !== r.sha256) throw new Error(`${nome}: SHA-256 não confere com consultas.json`);
}
const acesso = (n) => CONSULTAS[n].acesso.slice(0, 10);

// ───────────────────────────── produtos ─────────────────────────────
// Recorte por NCM (8 dígitos). "medida" é a grandeza que ordena e dá a % do produto.
const PRODUTOS = [
  { id: 'petroleo', nome: 'Petróleo bruto', re: /^270900/, ncms: ['270900*'], medida: 'kg' },
  { id: 'diesel', nome: 'Óleo diesel', re: /^27101921$/, ncms: ['27101921'], medida: 'kg' },
  { id: 'gasolina', nome: 'Gasolina', re: /^2710125/, ncms: ['2710125*'], medida: 'kg' },
  { id: 'nafta', nome: 'Nafta', re: /^2710124/, ncms: ['2710124*'], medida: 'kg' },
  { id: 'qav', nome: 'Querosene de aviação', re: /^27101911$/, ncms: ['27101911'], medida: 'kg' },
  { id: 'oleo-combustivel', nome: 'Óleo combustível', re: /^2710192[29]$/, ncms: ['27101922', '27101929'], medida: 'kg' },
  { id: 'glp', nome: 'GLP (propano e butano)', re: /^2711(12|13|19)/, ncms: ['271112*', '271113*', '271119*'], medida: 'kg' },
  { id: 'gnl', nome: 'Gás natural liquefeito (GNL)', re: /^27111100$/, ncms: ['27111100'], medida: 'kg' },
  { id: 'gas-natural', nome: 'Gás natural (estado gasoso)', re: /^27112100$/, ncms: ['27112100'], medida: 'kg' },
  { id: 'carvao', nome: 'Carvão mineral', re: /^270[12]/, ncms: ['2701*', '2702*'], medida: 'kg' },
  { id: 'coque-carvao', nome: 'Coque de carvão', re: /^2704/, ncms: ['2704*'], medida: 'kg' },
  { id: 'coque-petroleo', nome: 'Coque de petróleo', re: /^27131/, ncms: ['27131*'], medida: 'kg' },
  { id: 'etanol', nome: 'Etanol (álcool etílico)', re: /^2207/, ncms: ['2207*'], medida: 'kg' },
  { id: 'uranio', nome: 'Urânio e combustível nuclear', re: /^(284410|284420|284430|840130)/, ncms: ['284410*', '284420*', '284430*', '840130*'], medida: 'fob' },
  { id: 'eletricidade', nome: 'Energia elétrica', re: /^27160000$/, ncms: ['27160000'], medida: 'fob' },
];
const LIMIAR_FLUXO = 0.01; // fluxo (produto × sentido × país × via) mostrado: ≥ 1% do produto no sentido
const LIMIAR_URF_NO_FLUXO = 0.05; // URF listada no fluxo: ≥ 5% do fluxo ou ≥ 1% do produto
const LIMIAR_ROTA = 0.05; // rota pré-calculada: par URF–país marítimo com ≥ 5% do produto no sentido…
const ROTAS_MINIMAS_POR_PRODUTO = 3; // …ou entre os 3 maiores pares do produto no sentido
const PISO_ROTA_KT = 10; // produto × sentido abaixo disso (peso) fica sem traçado
const TOL_DP = 0.05; // simplificação das rotas (graus); 0,12 cortava a costa da Holanda

// ───────────────────────────── âncoras (URF) ─────────────────────────────
// URF = unidade da Receita Federal onde a mercadoria foi despachada. NÃO é o cais.
// Regra da coordenada, nesta ordem:
//   aeroporto → aeródromo da ANAC pelo código OACI (o município da linha da ANAC tem de bater);
//   porto     → o terminal da Transpetro do município, quando é o ÚNICO dela no município, no
//               combustivel-instalacoes.geojson já publicado (ANP); senão a sede municipal (IBGE);
//   interior  → sede municipal (IBGE, Localidades 2022, categoria "Cidade");
//   localidade→ localidade do IBGE nomeada (só Suape, cujo nome está na URF e não é município).
const URFS = {
  '0117600': { tipo: 'aeroporto', oaci: 'SBBR', mun: 'Brasília', uf: 'DF' },
  '0147600': { tipo: 'interior', mun: 'Corumbá', uf: 'MS' },
  '0217800': { tipo: 'porto', mun: 'Belém', uf: 'PA' },
  '0227600': { tipo: 'porto', mun: 'Manaus', uf: 'AM' },
  '0317900': { tipo: 'porto', mun: 'Fortaleza', uf: 'CE' },
  '0317901': { tipo: 'aeroporto', oaci: 'SBFZ', mun: 'Fortaleza', uf: 'CE' },
  '0317903': { tipo: 'porto', mun: 'São Luís', uf: 'MA' },
  '0417900': { tipo: 'porto', mun: 'Recife', uf: 'PE' },
  '0417901': { tipo: 'aeroporto', oaci: 'SBRF', mun: 'Recife', uf: 'PE' },
  '0417902': { tipo: 'localidade', localidade: 'Estaleiro Atlântico Sul / Complexo Industrial de Suape', mun: 'Ipojuca', uf: 'PE' },
  '0420154': { tipo: 'porto', mun: 'Natal', uf: 'RN' },
  '0430151': { tipo: 'porto', mun: 'Cabedelo', uf: 'PB' },
  '0440151': { tipo: 'porto', mun: 'Maceió', uf: 'AL' },
  '0517800': { tipo: 'porto', mun: 'Salvador', uf: 'BA' },
  '0517801': { tipo: 'aeroporto', oaci: 'SBSV', mun: 'Salvador', uf: 'BA' },
  '0520100': { tipo: 'porto', mun: 'Aracaju', uf: 'SE' },
  '0617700': { tipo: 'interior', mun: 'Belo Horizonte', uf: 'MG' },
  '0710200': { tipo: 'porto', mun: 'Niterói', uf: 'RJ' },
  '0710251': { tipo: 'porto', mun: 'Campos dos Goytacazes', uf: 'RJ' },
  '0717600': { tipo: 'porto', mun: 'Rio de Janeiro', uf: 'RJ' },
  '0717700': { tipo: 'aeroporto', oaci: 'SBGL', mun: 'Rio de Janeiro', uf: 'RJ' },
  '0717800': { tipo: 'porto', mun: 'Itaguaí', uf: 'RJ' },
  '0727600': { tipo: 'porto', mun: 'Vitória', uf: 'ES' },
  '0812051': { tipo: 'porto', mun: 'São Sebastião', uf: 'SP' },
  '0817600': { tipo: 'aeroporto', oaci: 'SBGR', mun: 'Guarulhos', uf: 'SP' },
  '0817700': { tipo: 'aeroporto', oaci: 'SBKP', mun: 'Campinas', uf: 'SP' },
  '0817800': { tipo: 'porto', mun: 'Santos', uf: 'SP' },
  '0917500': { tipo: 'interior', mun: 'Foz do Iguaçu', uf: 'PR' },
  '0917800': { tipo: 'porto', mun: 'Paranaguá', uf: 'PR' },
  '0927501': { tipo: 'aeroporto', oaci: 'SBFL', mun: 'Florianópolis', uf: 'SC' },
  '0927502': { tipo: 'porto', mun: 'Imbituba', uf: 'SC' },
  '0927700': { tipo: 'porto', mun: 'São Francisco do Sul', uf: 'SC' },
  '1010253': { tipo: 'interior', mun: 'Bagé', uf: 'RS' },
  '1010351': { tipo: 'interior', mun: "Sant'Ana do Livramento", uf: 'RS' },
  '1017500': { tipo: 'interior', mun: 'Uruguaiana', uf: 'RS' },
  '1017700': { tipo: 'porto', mun: 'Rio Grande', uf: 'RS' },
  '1017800': { tipo: 'porto', mun: 'Porto Alegre', uf: 'RS' },
  '1017801': { tipo: 'aeroporto', oaci: 'SBPA', mun: 'Porto Alegre', uf: 'RS' },
};
const URF_SEM_LOCAL = '9999999'; // "NAO INFORMADO": sem âncora, declarado

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'").toUpperCase().trim();
const r4 = (x) => Math.round(x * 1e4) / 1e4;
const r2 = (x) => Math.round(x * 100) / 100;

function montarAncoras(urfsUsadas) {
  const ibge = new DatabaseSync(join(BRUTO, 'ibge', 'BR_localidades_2022.gpkg'), { readOnly: true });
  const sede = ibge.prepare("select CD_MUN, NM_MUN, LAT_LOCALIDADE lat, LONG_LOCALIDADE lon from BR_localidades_2022 where NM_MUN = ? and SIGLA_UF = ? and CT_LOCALIDADE = 'Cidade' and SCT_LOCALIDADE = 'Sede Municipal'");
  const local = ibge.prepare('select CD_MUN, NM_MUN, CT_LOCALIDADE ct, LAT_LOCALIDADE lat, LONG_LOCALIDADE lon from BR_localidades_2022 where NM_LOCALIDADE = ? and SIGLA_UF = ?');
  const anac = lerBruto('anac-aerodromos-publicos.csv', 'latin1').split(/\r?\n/).map((l) => l.split(';'));
  const instal = JSON.parse(readFileSync(join(RAIZ, 'public/alexandria/atlas/dados/combustivel-instalacoes.geojson'), 'utf8')).features;
  const ancoras = {};
  for (const [co, nomeUrf] of [...urfsUsadas].sort()) {
    if (co === URF_SEM_LOCAL) continue;
    const u = URFS[co];
    if (!u) throw new Error(`URF sem âncora na tabela: ${co} ${nomeUrf}`);
    let lonlat, fonte;
    if (u.tipo === 'aeroporto') {
      const l = anac.find((c) => c[0] === u.oaci);
      if (!l) throw new Error(`ANAC sem ${u.oaci}`);
      if (norm(l[3]) !== norm(u.mun)) throw new Error(`${u.oaci}: município ANAC ${l[3]} ≠ ${u.mun}`);
      lonlat = [r4(+l[8]), r4(+l[7])];
      fonte = { orgao: 'ANAC', conjunto: 'Lista de aeródromos públicos', item: `${u.oaci} · ${l[2]}`, acesso: acesso('anac-aerodromos-publicos.csv') };
    } else if (u.tipo === 'localidade') {
      const l = local.all(u.localidade, u.uf);
      if (l.length !== 1 || norm(l[0].NM_MUN) !== norm(u.mun)) throw new Error(`IBGE: localidade ${u.localidade} ambígua ou ausente`);
      lonlat = [r4(l[0].lon), r4(l[0].lat)];
      fonte = { orgao: 'IBGE', conjunto: 'Localidades 2022', item: `${l[0].ct} "${u.localidade}" (${u.mun}/${u.uf})`, acesso: acesso('ibge-localidades-2022-gpkg.zip') };
    } else {
      const tp = u.tipo === 'porto'
        ? instal.filter((f) => f.properties.tipo === 'terminal' && /^TRANSPETRO /.test(f.properties.nome) && norm(f.properties.mun) === norm(u.mun) && f.properties.uf === u.uf)
        : [];
      if (tp.length === 1) {
        lonlat = tp[0].geometry.coordinates.map(r4);
        // o conjunto vai para a tela: sem nome de arquivo (leva 4); o arquivo fica em `arquivo`
        fonte = { orgao: 'ANP', conjunto: 'terminais das instalações de combustível já publicadas no Atlas', arquivo: 'combustivel-instalacoes.geojson', item: `${tp[0].properties.id} · ${tp[0].properties.nome}` };
      } else {
        const s = sede.all(u.mun, u.uf);
        if (s.length !== 1) throw new Error(`IBGE: sede de ${u.mun}/${u.uf} → ${s.length} linhas`);
        lonlat = [r4(s[0].lon), r4(s[0].lat)];
        fonte = { orgao: 'IBGE', conjunto: 'Localidades 2022', item: `sede municipal (Cidade) de ${u.mun}/${u.uf}, código ${s[0].CD_MUN}`, acesso: acesso('ibge-localidades-2022-gpkg.zip'), ...(u.tipo === 'porto' ? { porQue: tp.length > 1 ? `${tp.length} terminais da Transpetro no município: nenhum escolhido` : 'nenhum terminal da Transpetro no município' } : {}) };
      }
    }
    ancoras[co] = { nome: nomeUrf.replace(/^\d+ - /, ''), tipo: u.tipo, municipio: `${u.mun}/${u.uf}`, lonlat, fonteDaCoordenada: fonte };
  }
  return ancoras;
}

// ───────────────────────────── países ─────────────────────────────
function tabelaNumericoAlfa3() {
  // A mesma tabela que o capítulo "O mundo" usa (derivada do Natural Earth; ver o cabeçalho de worldApi.ts).
  const src = readFileSync(join(RAIZ, 'src/lib/atlas/worldApi.ts'), 'utf8');
  const t = {};
  for (const m of src.matchAll(/'(\d{3})':\s*\['([A-Z]{3})',\s*'([A-Z]{2})'\]/g)) t[m[1]] = m[2];
  return t;
}
function areaAnel(a) { let s = 0; for (let i = 0; i < a.length - 1; i++) s += a[i][0] * a[i + 1][1] - a[i + 1][0] * a[i][1]; return Math.abs(s / 2); }
function centroideAnel(anel0) {
  // anel que cruza o antimeridiano (Rússia, Fiji): desloca as longitudes negativas em +360 antes da
  // conta e devolve a longitude ao intervalo [-180, 180] (leva 4: a Rússia saía em 202,79°)
  const cruza = anel0.some((q, i) => i && Math.abs(q[0] - anel0[i - 1][0]) > 180);
  const anel = cruza ? anel0.map(([u, v]) => [u < 0 ? u + 360 : u, v]) : anel0;
  const c = centroideBruto(anel);
  return [((c[0] + 540) % 360) - 180, c[1]];
}
function centroideBruto(anel) {
  let x = 0, y = 0, a = 0;
  for (let i = 0; i < anel.length - 1; i++) { const c = anel[i][0] * anel[i + 1][1] - anel[i + 1][0] * anel[i][1]; x += (anel[i][0] + anel[i + 1][0]) * c; y += (anel[i][1] + anel[i + 1][1]) * c; a += c; }
  return a === 0 ? anel[0] : [x / (3 * a), y / (3 * a)];
}
function maiorAnel(g) {
  const polis = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  let maior = null, area = 0;
  for (const p of polis) { const a = areaAnel(p[0]); if (a > area) { area = a; maior = p[0]; } }
  return maior;
}
function montarPaises(nomesUsados) {
  const iso = json('comex-paises-iso.json').paises;
  const num2a3 = tabelaNumericoAlfa3();
  const w110 = JSON.parse(readFileSync(join(RAIZ, 'public/alexandria/geo/world-110m.json'), 'utf8'));
  const w50 = json('natural-earth-countries-50m.json');
  const f110 = new Map(topoFeature(w110, w110.objects.countries).features.filter((f) => f.id).map((f) => [f.id, f]));
  const f50 = new Map(topoFeature(w50, w50.objects.countries).features.filter((f) => f.id).map((f) => [f.id, f]));
  const paises = {}; const porNome = {}; const aneis = {};
  for (const nome of [...nomesUsados].sort()) {
    const d = iso[nome];
    if (!d?.coPaisIsoa3) { avisos.push(`país sem código ISO no Comex: ${nome}`); continue; }
    const a3 = d.coPaisIsoa3; const n3 = d.coPaisIson3;
    porNome[nome] = a3;
    if (paises[a3]) continue;
    const confere = num2a3[n3];
    let anel = null, como;
    if (f110.has(n3)) {
      if (confere !== a3) throw new Error(`${nome}: Comex diz ${a3}/${n3}, a tabela do Atlas diz ${confere}`);
      anel = maiorAnel(f110.get(n3).geometry);
      como = 'ne110m';
    } else if (f50.has(n3)) {
      anel = maiorAnel(f50.get(n3).geometry);
      como = 'ne50m';
    } else {
      como = 'sem-poligono';
    }
    paises[a3] = { nome, iso3n: n3, noMapa110m: f110.has(n3), lonlat: anel ? centroideAnel(anel).map(r2) : null, como };
    if (anel) aneis[a3] = anel;
  }
  return { paises, porNome, aneis };
}

// ───────────────────────────── rede marítima ─────────────────────────────
const RT = 6371.0088;
const rad = Math.PI / 180;
function hav(a, b) {
  const dl = (b[0] - a[0]) * rad, dp = (b[1] - a[1]) * rad;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dl / 2) ** 2;
  return 2 * RT * Math.asin(Math.min(1, Math.sqrt(h)));
}
function wkbLinha(blob) {
  // GeoPackage: cabeçalho "GP" + envelope, depois WKB LineString.
  const b = Buffer.from(blob); const flags = b[3];
  const env = [0, 32, 48, 48, 64][(flags >> 1) & 7];
  let o = 8 + env; const le = b[o] === 1; o += 1;
  const u32 = () => { const v = le ? b.readUInt32LE(o) : b.readUInt32BE(o); o += 4; return v; };
  const f64 = () => { const v = le ? b.readDoubleLE(o) : b.readDoubleBE(o); o += 8; return v; };
  const tipo = u32() % 1000; if (tipo !== 2) throw new Error(`geometria ${tipo} na MARNET`);
  const n = u32(); const pts = [];
  for (let i = 0; i < n; i++) pts.push([f64(), f64()]);
  return pts;
}
function carregarRede() {
  const db = new DatabaseSync(join(BRUTO, 'eurostat-marnet_plus_20km.gpkg'), { readOnly: true });
  const nos = []; const idx = new Map(); const adj = [];
  const no = (p) => { const k = `${p[0].toFixed(6)},${p[1].toFixed(6)}`; let i = idx.get(k); if (i === undefined) { i = nos.length; idx.set(k, i); nos.push(p); adj.push([]); } return i; };
  // Todo vértice vira nó: a âncora se liga ao vértice mais perto, não só às junções.
  let arestas = 0;
  // As passagens do Ártico (noroeste e nordeste) ficam fora: sazonais, não representam o comércio.
  for (const { geometry, pass } of db.prepare('select geometry, pass from type').iterate()) {
    if (pass === 'northwest' || pass === 'northeast') continue;
    const pts = wkbLinha(geometry);
    for (let i = 1; i < pts.length; i++) {
      const a = no(pts[i - 1]), b = no(pts[i]); if (a === b) continue;
      const km = hav(pts[i - 1], pts[i]); adj[a].push([b, km, pass]); adj[b].push([a, km, pass]); arestas++;
    }
  }
  return { nos, adj, arestas };
}
class Heap { constructor() { this.a = []; } push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } } pop() { const a = this.a; const t = a[0]; const u = a.pop(); if (a.length) { a[0] = u; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return t; } get n() { return this.a.length; } }
function dijkstra(rede, origem) {
  const dist = new Float64Array(rede.nos.length).fill(Infinity); const prev = new Int32Array(rede.nos.length).fill(-1); const passo = new Array(rede.nos.length);
  dist[origem] = 0; const h = new Heap(); h.push([0, origem]);
  while (h.n) { const [d, i] = h.pop(); if (d > dist[i]) continue; for (const [j, km, ps] of rede.adj[i]) { const nd = d + km; if (nd < dist[j]) { dist[j] = nd; prev[j] = i; passo[j] = ps; h.push([nd, j]); } } }
  return { dist, prev, passo };
}
function passagens(arv, destino) { const s = new Set(); for (let i = destino; arv.prev[i] !== -1; i = arv.prev[i]) if (arv.passo[i]) s.add(arv.passo[i]); return [...s].reverse(); }
function caminho(rede, arv, destino) {
  const linha = []; for (let i = destino; i !== -1; i = arv.prev[i]) linha.push(rede.nos[i]);
  return linha.reverse();
}
function maisProximo(rede, p) { let m = -1, d = Infinity; for (let i = 0; i < rede.nos.length; i++) { if (!rede.adj[i].length) continue; const x = hav(p, rede.nos[i]); if (x < d) { d = x; m = i; } } return [m, d]; }
function distAoAnel(p, anel) {
  // distância aproximada (km) do ponto ao contorno: projeção local equiretangular por segmento.
  let m = Infinity; const kx = Math.cos(p[1] * rad) * 111.32, ky = 110.57;
  for (let i = 0; i < anel.length - 1; i++) {
    let dx0 = anel[i][0] - p[0]; if (dx0 > 180) dx0 -= 360; if (dx0 < -180) dx0 += 360;
    let dx1 = anel[i + 1][0] - p[0]; if (dx1 > 180) dx1 -= 360; if (dx1 < -180) dx1 += 360;
    const ax = dx0 * kx, ay = (anel[i][1] - p[1]) * ky, bx = dx1 * kx, by = (anel[i + 1][1] - p[1]) * ky;
    const vx = bx - ax, vy = by - ay; const L = vx * vx + vy * vy;
    const t = L ? Math.max(0, Math.min(1, -(ax * vx + ay * vy) / L)) : 0;
    m = Math.min(m, Math.hypot(ax + t * vx, ay + t * vy));
  }
  return m;
}
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1; const pilha = [[0, pts.length - 1]];
  while (pilha.length) { const [a, b] = pilha.pop(); let m = -1, d = 0; const [x1, y1] = pts[a], [x2, y2] = pts[b]; const L = Math.hypot(x2 - x1, y2 - y1);
    for (let i = a + 1; i < b; i++) { const [x, y] = pts[i]; const di = L ? Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / L : Math.hypot(x - x1, y - y1); if (di > d) { d = di; m = i; } }
    if (d > tol) { keep[m] = 1; pilha.push([a, m], [m, b]); } }
  return pts.filter((_, i) => keep[i]);
}
function desenrolar(pts) { const o = [pts[0]]; for (let i = 1; i < pts.length; i++) { let x = pts[i][0]; const px = o[i - 1][0]; while (x - px > 180) x -= 360; while (x - px < -180) x += 360; o.push([x, pts[i][1]]); } return o; }
function arcoGeodesico(a, b, n = 64) {
  const v = (p) => [Math.cos(p[1] * rad) * Math.cos(p[0] * rad), Math.cos(p[1] * rad) * Math.sin(p[0] * rad), Math.sin(p[1] * rad)];
  const A = v(a), B = v(b); const om = Math.acos(Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]))); const o = [];
  for (let i = 0; i <= n; i++) { const t = i / n; const s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om); const x = s1 * A[0] + s2 * B[0], y = s1 * A[1] + s2 * B[1], z = s1 * A[2] + s2 * B[2]; o.push([Math.atan2(y, x) / rad, Math.atan2(z, Math.hypot(x, y)) / rad]); }
  return o;
}

// terra (Natural Earth 110m) para medir quanto de cada rota passa sobre continente
function montarTerra() {
  const w = JSON.parse(readFileSync(join(RAIZ, 'public/alexandria/geo/world-110m.json'), 'utf8'));
  // Os países, não o objeto "land": lá a Afro-Eurásia é um anel só, que cruza o antimeridiano
  // (Chukotka) e não dá para desenrolar sem levar a África junto.
  const land = topoFeature(w, w.objects.countries);
  const polis = []; const geoms = land.type === 'FeatureCollection' ? land.features.map((f) => f.geometry) : [land.geometry];
  for (const g of geoms) for (const p0 of g.type === 'Polygon' ? [g.coordinates] : g.coordinates) {
    // anel que cruza o antimeridiano (Rússia, Fiji): desloca as longitudes negativas em +360
    const cruza = p0.some((a) => a.some((q, i) => i && Math.abs(q[0] - a[i - 1][0]) > 180));
    const p = cruza ? p0.map((a) => a.map(([x, y]) => [x < 0 ? x + 360 : x, y])) : p0;
    let bb = [180, 90, -180, -90]; for (const [x, y] of p[0]) { bb = [Math.min(bb[0], x), Math.min(bb[1], y), Math.max(bb[2], x), Math.max(bb[3], y)]; }
    if (bb[3] < -55) continue; // Antártida: nenhuma rota passa lá, e o anel dela não fecha em lon/lat
    polis.push({ p, bb });
  }
  const dentroAnel = (pt, a) => { let c = false; for (let i = 0, j = a.length - 1; i < a.length; j = i++) { if ((a[i][1] > pt[1]) !== (a[j][1] > pt[1]) && pt[0] < ((a[j][0] - a[i][0]) * (pt[1] - a[i][1])) / (a[j][1] - a[i][1]) + a[i][0]) c = !c; } return c; };
  const naTerra = (pt0) => {
    const x0 = ((pt0[0] + 540) % 360) - 180;
    for (const pt of [[x0, pt0[1]], [x0 + 360, pt0[1]]]) for (const { p, bb } of polis) { if (pt[0] < bb[0] || pt[0] > bb[2] || pt[1] < bb[1] || pt[1] > bb[3]) continue; if (dentroAnel(pt, p[0]) && !p.slice(1).some((h) => dentroAnel(pt, h))) return true; }
    return false;
  };
  return { polis, naTerra };
}
function kmSobreTerra(terra, linha, folgaKm) {
  // amostra a cada ~5 km; ignora os primeiros e os últimos `folgaKm` (a costa do 110m é grossa)
  const amostras = []; let acum = 0;
  for (let i = 1; i < linha.length; i++) { const d = hav(linha[i - 1], linha[i]); const n = Math.max(1, Math.ceil(d / 5)); for (let k = 0; k < n; k++) { const t = (k + 0.5) / n; amostras.push([[linha[i - 1][0] + (linha[i][0] - linha[i - 1][0]) * t, linha[i - 1][1] + (linha[i][1] - linha[i - 1][1]) * t], acum + d * t, d / n]); } acum += d; }
  let km = 0; for (const [p, s, passo] of amostras) if (s > folgaKm && s < acum - folgaKm && terra.naTerra(p)) km += passo;
  return { km: Math.round(km), total: Math.round(acum) };
}

// ───────────────────────────── montagem ─────────────────────────────
const SENTIDOS = { exportacao: 'comex-2025-exportacao-ncm-pais-urf-via.json', importacao: 'comex-2025-importacao-ncm-pais-urf-via.json' };
const linhas = Object.fromEntries(Object.entries(SENTIDOS).map(([s, f]) => [s, json(f).data.list]));
const VIA = { MARITIMA: 'marítima', AEREA: 'aérea', RODOVIARIA: 'rodoviária', 'CONDUTO/REDE DE TRANSMISSAO': 'conduto ou rede de transmissão', 'MEIOS PROPRIOS': 'meios próprios', 'ENTRADA/SAIDA FICTA': 'entrada ou saída ficta', FLUVIAL: 'fluvial', FERROVIARIA: 'ferroviária', DUTOS: 'dutos' };

const fluxos = []; const totais = {}; const urfsUsadas = new Map(); const nomesPaises = new Set(); const pares = [];
for (const [sentido, L] of Object.entries(linhas)) {
  for (const p of PRODUTOS) {
    const R = L.filter((r) => p.re.test(r.coNcm));
    const val = (r) => +(p.medida === 'kg' ? r.metricKG : r.metricFOB);
    const tot = R.reduce((s, r) => s + val(r), 0);
    totais[`${p.id}:${sentido}`] = { kt: r2(R.reduce((s, r) => s + +r.metricKG, 0) / 1e6), fobUS: R.reduce((s, r) => s + +r.metricFOB, 0), linhas: R.length };
    if (!tot) continue;
    const grupos = new Map(); const porPar = new Map();
    for (const r of R) {
      const k = `${r.country}|${r.via}`;
      const g = grupos.get(k) ?? { pais: r.country, via: r.via, v: 0, kg: 0, fob: 0, est: 0, urfs: new Map() };
      g.v += val(r); g.kg += +r.metricKG; g.fob += +r.metricFOB; g.est += +r.metricStatistic;
      const u = g.urfs.get(r.urf) ?? { v: 0, kg: 0, fob: 0 }; u.v += val(r); u.kg += +r.metricKG; u.fob += +r.metricFOB; g.urfs.set(r.urf, u);
      grupos.set(k, g);
      if (r.via === 'MARITIMA') { const kp = `${r.urf}|${r.country}`; porPar.set(kp, (porPar.get(kp) ?? 0) + val(r)); }
    }
    const paresOrd = [...porPar].sort((a, b) => b[1] - a[1]);
    // produto quase sem movimento no sentido (gás gasoso exportado: 0 kt) não ganha traçado
    const pesoBaixo = p.medida === 'kg' && tot < PISO_ROTA_KT * 1e6;
    const comRota = pesoBaixo ? new Set() : new Set(paresOrd.filter(([, v], i) => v / tot >= LIMIAR_ROTA || i < ROTAS_MINIMAS_POR_PRODUTO).map(([k]) => k));
    for (const g of [...grupos.values()].sort((a, b) => b.v - a.v)) {
      if (g.v / tot < LIMIAR_FLUXO) continue;
      nomesPaises.add(g.pais);
      const urfs = [...g.urfs].sort((a, b) => b[1].v - a[1].v).filter(([, u]) => u.v / g.v >= LIMIAR_URF_NO_FLUXO || u.v / tot >= 0.01).map(([nome, u]) => {
        const co = nome.slice(0, 7); urfsUsadas.set(co, nome);
        // Via aérea: par aeroporto (âncora da ANAC) × país com 1% ou mais do produto ganha um arco; o
        // destino "Brasil" não tem rota (tratado adiante). URF de interior com via aérea fica sem traçado.
        const rota = g.via === 'MARITIMA' && comRota.has(`${nome}|${g.pais}`) ? { urf: co, pais: g.pais, via: 'mar' }
          : g.via === 'AEREA' && URFS[co]?.tipo === 'aeroporto' && u.v / tot >= LIMIAR_FLUXO ? { urf: co, pais: g.pais, via: 'ar' } : null;
        if (rota) pares.push(rota);
        return { urf: co, kt: Math.round(u.kg / 1e3) / 1e3, fobUS: u.fob, pctDoFluxo: Math.round((1000 * u.v) / g.v) / 10, rota };
      });
      const listado = urfs.reduce((s, u) => s + (p.medida === 'kg' ? u.kt * 1e6 : u.fobUS), 0);
      fluxos.push({
        produto: p.id, sentido, paisNome: g.pais, via: VIA[g.via] ?? g.via.toLowerCase(), viaComex: g.via,
        kt: Math.round(g.kg / 1e3) / 1e3, fobUS: g.fob, ...(p.id === 'eletricidade' ? { mwh: g.est } : {}),
        pctDoProduto: Math.round((1000 * g.v) / tot) / 10,
        urfs, pctDoFluxoEmUrfsListadas: Math.round((1000 * listado) / g.v) / 10,
      });
    }
  }
}

const ancoras = montarAncoras(urfsUsadas);
const { paises, porNome, aneis } = montarPaises(nomesPaises);

// rotas: uma por par URF–país (o par é o mesmo para todos os produtos que o usam)
const terra = montarTerra();
const rotas = {}; const rede = MARNET ? carregarRede() : null;
const arvores = new Map();
const chaveRota = (urf, a3) => `${urf}-${a3}`;
const costaCache = new Map();
function costaDoPais(a3) {
  if (costaCache.has(a3)) return costaCache.get(a3);
  const anel0 = aneis[a3]; if (!anel0) return null;
  const cruza = anel0.some((q, i) => i && Math.abs(q[0] - anel0[i - 1][0]) > 180);
  const sh = (x) => (cruza && x < 0 ? x + 360 : x);
  const anel = anel0.map(([x, y]) => [sh(x), y]);
  let bb = [999, 90, -999, -90]; for (const [x, y] of anel) bb = [Math.min(bb[0], x), Math.min(bb[1], y), Math.max(bb[2], x), Math.max(bb[3], y)];
  const cand = [];
  for (let i = 0; i < rede.nos.length; i++) { const q = [sh(rede.nos[i][0]), rede.nos[i][1]]; if (!rede.adj[i].length) continue; if (q[0] < bb[0] - 2 || q[0] > bb[2] + 2 || q[1] < bb[1] - 2 || q[1] > bb[3] + 2) continue; if (distAoAnel(q, anel) <= 60) cand.push(i); }
  costaCache.set(a3, cand); return cand;
}
// Roteador próprio: agrupa os pares marítimos por URF (uma busca por origem).
const ROTEADAS = new Map();
if (METODO === 'mar') {
  const { criarRoteador } = await import('./roteador.mjs');
  const rot = criarRoteador({ bruto: BRUTO, log: (m) => console.log(m) });
  const porUrf = new Map();
  for (const par of pares) {
    if (par.via !== 'mar') continue;
    const a3 = porNome[par.pais]; if (!a3 || a3 === 'BRA' || !ancoras[par.urf] || !paises[a3]?.lonlat) continue;
    const l = porUrf.get(par.urf) ?? new Map(); l.set(a3, paises[a3].iso3n); porUrf.set(par.urf, l);
  }
  for (const [urf, dest] of porUrf) {
    const r = rot.rotear(ancoras[urf].lonlat, [...dest].map(([a3, n3]) => ({ id: a3, n3 })));
    for (const [a3, v] of Object.entries(r)) ROTEADAS.set(chaveRota(urf, a3), v);
  }
  globalThis.__roteador = rot;
}
for (const par of pares) {
  const a3 = porNome[par.pais]; const id = chaveRota(par.urf, a3); par.id = id;
  if (rotas[id] || !a3) continue;
  const anc = ancoras[par.urf]; const pais = paises[a3];
  if (!anc || !pais?.lonlat) { rotas[id] = null; continue; }
  if (a3 === 'BRA') { rotas[id] = null; continue; }
  if (par.via === 'ar') {
    // Arco de círculo máximo do aeroporto (âncora da ANAC) ao ponto do país; um vértice a cada ~400 km
    // (o mapa desenha reto entre vértices).
    const km = hav(anc.lonlat, pais.lonlat); const n = Math.max(6, Math.ceil(km / 400));
    const linha = desenrolar(arcoGeodesico(anc.lonlat, pais.lonlat, n)).map(([x, y]) => [r2(x), r2(y)]);
    rotas[id] = { de: par.urf, para: a3, tipo: 'esquemática', metodo: 'arco', via: 'aérea', km: Math.round(km), linha };
    continue;
  }
  if (METODO === 'mar') {
    const r = ROTEADAS.get(id);
    if (!r) { avisos.push(`${id}: o roteador não achou caminho`); rotas[id] = null; continue; }
    rotas[id] = { de: par.urf, para: a3, tipo: 'esquemática', metodo: 'mar', via: 'marítima', km: r.km, ligacaoKm: r.ligacaoKm, chegadaKm: r.chegadaKm, sobreTerraKm: r.sobreTerraKm, folgaMinKm: r.folgaMinKm, ...(r.portoes.length ? { portoes: r.portoes } : {}), ...(r.contorno ? { contorno: r.contorno } : {}), linha: r.linha };
    continue;
  }
  let linha, nota, ligacaoKm = 0, pass = [];
  if (ARCO) { linha = arcoGeodesico(anc.lonlat, pais.lonlat); nota = 'arco geodésico entre a âncora e o centro do país'; }
  else {
    const [ini, dIni] = maisProximo(rede, anc.lonlat);
    if (!arvores.has(ini)) arvores.set(ini, dijkstra(rede, ini));
    const arv = arvores.get(ini); const cand = costaDoPais(a3);
    let fim = -1; for (const c of cand ?? []) if (arv.dist[c] < (fim < 0 ? Infinity : arv.dist[fim])) fim = c;
    if (fim < 0) { avisos.push(`${id}: nenhum nó da rede a 60 km da costa de ${a3}`); rotas[id] = null; continue; }
    // A linha começa na rede: a reta da âncora até ela cruzaria terra (Manaus fica a mais de mil km
    // do vértice mais perto, porque a rede não sobe o Amazonas). A distância vai em ligacaoKm.
    linha = caminho(rede, arv, fim); pass = passagens(arv, fim);
    ligacaoKm = Math.round(dIni);
    nota = 'caminho mais curto na rede marítima MARNET (Eurostat, 20 km) do nó mais perto da âncora até o nó da rede mais perto da costa do país (o primeiro trecho é uma reta da âncora à rede)';
  }
  const simpl = desenrolar(dp(linha, TOL_DP)).map(([x, y]) => [r2(x), r2(y)]);
  const t = kmSobreTerra(terra, simpl, ARCO ? 0 : 30);
  rotas[id] = { de: par.urf, para: a3, tipo: 'esquemática', metodo: ARCO ? 'arco' : 'marnet', via: 'marítima', km: t.total, ligacaoKm, sobreTerraKm: t.km, ...(pass.length ? { passagens: pass } : {}), linha: simpl };
  void nota;
}
for (const f of fluxos) {
  f.pais = porNome[f.paisNome] ?? null;
  f.fonte = 'Comex Stat (MDIC), 2025';
  let semCosta = false;
  for (const u of f.urfs) { if (u.rota && rotas[chaveRota(u.urf, f.pais)]) u.rota = chaveRota(u.urf, f.pais); else { if (u.rota && f.viaComex === 'MARITIMA' && f.pais !== 'BRA') semCosta = true; delete u.rota; } }
  const temRota = f.urfs.some((u) => u.rota);
  // "esquemática" em todo fluxo: o que houver de traçado nunca é o caminho dos navios
  f.rota = f.viaComex === 'MARITIMA'
    ? (temRota ? 'esquemática' : semCosta ? 'esquemática, sem traçado (o país não tem costa no mar aberto: a carga segue por rio ou por terra, que o dado não diz)' : 'esquemática, sem traçado (abaixo do limiar de rota)')
    : f.viaComex === 'AEREA' && temRota ? 'esquemática (arco de círculo máximo do aeroporto ao centro do país)'
      : `esquemática, sem traçado (via ${f.via})`;
  if (f.pais === 'BRA') f.nota = 'País declarado no Comex: o próprio Brasil.';
}

// ───────────────────────────── viagens (lista pronta para desenhar) ─────────────────────────────
// Uma entrada por produto × sentido × URF × país com rota. A interface não recalcula nada.
const CLASSE = { petroleo: 'petroleiro', diesel: 'petroleiro', gasolina: 'petroleiro', nafta: 'petroleiro', qav: 'petroleiro', 'oleo-combustivel': 'petroleiro', etanol: 'petroleiro', carvao: 'graneleiro', 'coque-carvao': 'graneleiro', 'coque-petroleo': 'graneleiro', gnl: 'gaseiro', glp: 'gaseiro', uranio: 'carga' };
const MEDIDA = Object.fromEntries(PRODUTOS.map((p) => [p.id, p.medida]));
const viagens = [];
for (const f of fluxos) for (const u of f.urfs) {
  if (!u.rota) continue;
  const tot = totais[`${f.produto}:${f.sentido}`];
  const pct = MEDIDA[f.produto] === 'kg' ? (1000 * u.kt) / tot.kt : (1000 * u.fobUS) / tot.fobUS;
  const aerea = f.viaComex === 'AEREA';
  const classe = aerea ? 'aviao' : CLASSE[f.produto];
  if (!classe) throw new Error(`viagem sem classe de veículo: ${f.produto}`);
  viagens.push({ id: `${f.produto}:${f.sentido}:${u.rota}`, produto: f.produto, sentido: f.sentido, urf: u.urf, pais: f.pais, rota: u.rota, via: f.via, kt: u.kt, fobUS: u.fobUS, pctDoProduto: Math.round(pct) / 10, classe });
}
viagens.sort((a, b) => (a.sentido === b.sentido ? b.kt - a.kt || b.fobUS - a.fobUS : a.sentido === 'exportacao' ? -1 : 1));
if (new Set(viagens.map((v) => v.id)).size !== viagens.length) throw new Error('viagens: id repetido');

// ───────────────────────────── condutos (gás da Bolívia) ─────────────────────────────
const condutos = [];
for (const f of fluxos) {
  if (f.produto !== 'gas-natural' || f.viaComex !== 'CONDUTO/REDE DE TRANSMISSAO') continue;
  const tot = totais[`${f.produto}:${f.sentido}`];
  for (const u of f.urfs) {
    const a = ancoras[u.urf]; if (!a) continue;
    condutos.push({
      id: `${f.produto}:${f.sentido}:${u.urf}-${f.pais}`, produto: f.produto, sentido: f.sentido, urf: u.urf, pais: f.pais, via: f.via,
      kt: u.kt, fobUS: u.fobUS, pctDoProduto: Math.round((1000 * u.kt) / tot.kt) / 10,
      lonlat: a.lonlat, ondeFica: `${a.nome} (${a.municipio})`, fonteDaCoordenada: a.fonteDaCoordenada,
      fonte: 'Comex Stat (MDIC), 2025',
      nota: `Chega por gasoduto, declarado no Comex com a via "${f.via}" e despacho na URF de ${a.municipio}. O ponto é a sede municipal, não o ponto em que o duto cruza a fronteira. Sem navio e sem rota.`,
    });
  }
}

// ───────────────────────────── eletricidade (ONS) ─────────────────────────────
const ons = lerBruto('ons-intercambio-internacional-2025.csv').trim().split(/\r?\n/).slice(1).map((l) => l.split(';'));
const eletricidade = { fonte: 'ONS, Intercâmbio do SIN com outros países (base horária, MWmed), 2025', paises: {} };
const PAIS_ONS = { ARGENTINA: 'ARG', URUGUAI: 'URY' };
for (const [inst, pais, v] of ons) {
  const a3 = PAIS_ONS[pais.trim().toUpperCase()]; if (!a3) { avisos.push(`ONS: país inesperado ${pais}`); continue; }
  const m = +inst.slice(5, 7) - 1; const x = +v; // MWmed numa hora = MWh
  const e = (eletricidade.paises[a3] ??= { nome: pais.trim(), exportacaoMWh: Array(12).fill(0), importacaoMWh: Array(12).fill(0), horas: 0, horasPorMes: Array(12).fill(0) });
  if (x > 0) e.exportacaoMWh[m] += x; else e.importacaoMWh[m] += -x; e.horas++; e.horasPorMes[m]++;
}
// horas do ano e de cada mês (leva 4): o ONS não publicou todas; a soma do ano é a das horas publicadas
const horasDoMes = (m) => new Date(Date.UTC(2025, m + 1, 0)).getUTCDate() * 24;
eletricidade.horasDoAno = Array.from({ length: 12 }, (_, m) => horasDoMes(m)).reduce((s, x) => s + x, 0);
eletricidade.horasDosMeses = Array.from({ length: 12 }, (_, m) => horasDoMes(m));
eletricidade.horasNota = 'A soma do ano é a das horas que o ONS publicou: os meses com horas faltando (horasPorMes menor que horasDosMeses) estão incompletos na série.';
for (const e of Object.values(eletricidade.paises)) { e.exportacaoMWh = e.exportacaoMWh.map(Math.round); e.importacaoMWh = e.importacaoMWh.map(Math.round); }
const sub = JSON.parse(readFileSync(join(RAIZ, 'public/alexandria/atlas/dados/rede-subestacoes.geojson'), 'utf8')).features;
const conv = (id) => { const f = sub.find((x) => x.properties.id === id); return f ? { id, nome: f.properties.n, lonlat: f.geometry.coordinates } : null; };
eletricidade.conversoras = {
  ARG: [conv('RSGBI1'), conv('RSGBI2')].filter(Boolean),
  URY: [conv('UYRIV')].filter(Boolean),
  PRY: [conv('PYACY')].filter(Boolean),
};
eletricidade.conversorasNota = 'O ONS diz que o intercâmbio com a Argentina passa pelas conversoras de Garabi I, Garabi II e Uruguaiana; com o Uruguai, por Melo e Rivera; com o Paraguai, por Acaray. Os pontos são os do cadastro SINDAT já publicado no Atlas (rede-subestacoes.geojson); Uruguaiana e Melo não têm ponto de conversora nesse cadastro.';
eletricidade.sentido = 'O dicionário do ONS diz que valor positivo é exportação do Brasil. Conferido contra a exportação declarada no Comex Stat: a soma das horas positivas bate com a exportação, e a das negativas com a importação (ver a conferência no "Como ler" do capítulo).';
// Uma entrada por ponto desenhável, com o que a ficha precisa. A série do ONS é por PAÍS (soma de
// todas as conversoras com aquele país), não por conversora: `serie` aponta para eletricidade.paises.
const NOME_CONVERSORA = { RSGBI1: 'Conversora Garabi I', RSGBI2: 'Conversora Garabi II', UYRIV: 'Conversora de Rivera', PYACY: 'Conversora de Acaray' };
const PAIS_NOME = { ARG: 'Argentina', URY: 'Uruguai', PRY: 'Paraguai' };
eletricidade.interligacoes = Object.entries(eletricidade.conversoras).flatMap(([a3, l]) => l.map((c) => ({
  id: c.id, nome: NOME_CONVERSORA[c.id] ?? c.nome, nomeNoCadastro: c.nome, pais: a3, paisNome: PAIS_NOME[a3], lonlat: c.lonlat,
  fonteDoPonto: 'ONS/SINDAT, cadastro de subestações já publicado no Atlas', arquivoDoPonto: 'rede-subestacoes.geojson',
  serie: eletricidade.paises[a3] ? a3 : null,
  nota: a3 === 'ARG' ? 'A série mensal é a do país: o ONS soma Garabi I, Garabi II e Uruguaiana (esta sem ponto no cadastro). Não há série por conversora.'
    : a3 === 'URY' ? 'A série mensal é a do país: o ONS soma Rivera e Melo (esta sem ponto no cadastro). Não há série por conversora.'
      // leva 4: o ponto não carrega o valor do Comex (o Comex não diz por onde a energia entra)
      : 'Acaray é a conversora que o ONS cita para o Paraguai. O ONS não traz o Paraguai em 2025: não há série mensal. O valor que o Comex registra não está ligado a este ponto.',
})));
{
  // leva 4: a quantidade de Itaipu não está em nenhuma fonte usada; o valor, sim (o Comex do Paraguai)
  const pry = fluxos.filter((f) => f.produto === 'eletricidade' && f.paisNome === 'Paraguai');
  const fob = pry.reduce((s, f) => s + f.fobUS, 0);
  const mi = Math.round(fob / 1e6);
  eletricidade.itaipu = `A quantidade da energia de Itaipu que o Paraguai cede ao Brasil não está em nenhuma fonte usada: o ONS não traz o Paraguai em 2025. O valor, sim: o Comex registra a importação de eletricidade do Paraguai, US$ ${mi.toLocaleString('pt-BR')} mi FOB em 2025, com quantidade zero e URF não informada, e não diz por onde ela entra.`;
  eletricidade.paraguaiComex = { fobUS: fob, kt: pry.reduce((s, f) => s + f.kt, 0), urf: 'não informada', nota: 'O Comex não diz por onde entra (URF não informada).' };
}

// ───────────────────────────── conferências ─────────────────────────────
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const anp = lerBruto('anp-importacoes-exportacoes-petroleo-2000-2025.csv').replace(/^﻿/, '').trim().split(/\r?\n/).slice(1).map((l) => l.split(';'));
const anp25 = (op) => anp.filter((c) => c[0] === '2025' && c[3] === op);
const somaANP = (op) => anp25(op).reduce((s, c) => s + +c[4].replace(/\./g, '').replace(',', '.'), 0);
const unidPet = json('comex-unidade-27090010.json').data.list[0].unit;
const unidEl = json('comex-unidade-27160000.json').data.list[0].unit;
const comexEstat = (sentido, re) => linhas[sentido].filter((r) => re.test(r.coNcm)).reduce((s, r) => s + +r.metricStatistic, 0);
const ncmsPet = [...new Set(linhas.exportacao.concat(linhas.importacao).filter((r) => /^270900/.test(r.coNcm)).map((r) => r.coNcm))];
if (ncmsPet.length !== 1 || ncmsPet[0] !== '27090010') avisos.push(`petróleo: NCMs ${ncmsPet.join(',')} (a conferência usa a quantidade estatística de 27090010)`);
const dif = (a, b) => Math.round((1000 * (a - b)) / b) / 10;
const conf = (nome, comex, ref, unidade, refFonte) => ({ item: nome, comex: Math.round(comex), referencia: Math.round(ref), unidade, fonteReferencia: refFonte, diferencaPct: dif(comex, ref) });
const elMensal = (sentido) => {
  const L = json(`comex-2025-${sentido}-eletricidade-mensal.json`).data.list; const o = {};
  for (const r of L) { (o[r.country] ??= Array(12).fill(0))[+r.monthNumber - 1] += +r.metricStatistic; }
  return o;
};
const elExp = elMensal('exportacao');
const correl = (a, b) => { const n = a.length; const ma = a.reduce((s, x) => s + x, 0) / n, mb = b.reduce((s, x) => s + x, 0) / n; let c = 0, va = 0, vb = 0; for (let i = 0; i < n; i++) { c += (a[i] - ma) * (b[i] - mb); va += (a[i] - ma) ** 2; vb += (b[i] - mb) ** 2; } return Math.round((1000 * c) / Math.sqrt(va * vb)) / 1000; };
const AR = eletricidade.paises.ARG, UY = eletricidade.paises.URY;
const somaV = (v) => v.reduce((s, x) => s + x, 0);
const mesMaior = AR.exportacaoMWh.indexOf(Math.max(...AR.exportacaoMWh));
const conferencia = {
  nota: 'Cada linha compara o total do Comex Stat com uma fonte independente do mesmo fato, em 2025. A diferença é (Comex − referência) / referência.',
  linhas: [
    conf('Petróleo bruto exportado', comexEstat('exportacao', /^27090010$/), somaANP('EXPORTAÇÃO'), `m³ (Comex: quantidade estatística em "${unidPet}")`, 'ANP, importações e exportações de petróleo, 2025 (12 meses)'),
    conf('Petróleo bruto importado', comexEstat('importacao', /^27090010$/), somaANP('IMPORTAÇÃO'), `m³ (Comex: quantidade estatística em "${unidPet}")`, 'ANP, importações e exportações de petróleo, 2025 (12 meses)'),
    conf('Eletricidade exportada (Argentina e Uruguai)', comexEstat('exportacao', /^27160000$/), somaV(AR.exportacaoMWh) + somaV(UY.exportacaoMWh), `MWh (Comex: quantidade estatística em "${unidEl}")`, 'ONS, intercâmbio internacional, soma das horas com valor positivo'),
    conf('Eletricidade exportada para a Argentina', somaV(elExp.Argentina ?? []), somaV(AR.exportacaoMWh), 'MWh', 'ONS (horas positivas, Argentina)'),
    conf('Eletricidade exportada para o Uruguai', somaV(elExp.Uruguai ?? []), somaV(UY.exportacaoMWh), 'MWh', 'ONS (horas positivas, Uruguai)'),
  ],
  sentidoDoONS: (() => {
    const elImp = elMensal('importacao');
    const cxExp = somaV(elExp.Argentina ?? []) + somaV(elExp.Uruguai ?? []);
    const cxImp = somaV(elImp.Argentina ?? []) + somaV(elImp.Uruguai ?? []);
    const pos = somaV(AR.exportacaoMWh) + somaV(UY.exportacaoMWh), neg = somaV(AR.importacaoMWh) + somaV(UY.importacaoMWh);
    // O Comex registra o mês do despacho; a série mensal dele anda atrás da medição do ONS.
    const ar = elExp.Argentina ?? Array(12).fill(0);
    const defas = [0, 1, 2, 3].map((d) => ({ mesesDeAtraso: d, correlacaoPositivas: correl(AR.exportacaoMWh.slice(0, 12 - d), ar.slice(d)), correlacaoNegativas: correl(AR.importacaoMWh.slice(0, 12 - d), ar.slice(d)) }));
    const melhor = defas.reduce((a, b) => (b.correlacaoPositivas > a.correlacaoPositivas ? b : a));
    const mc = AR.exportacaoMWh.indexOf(Math.max(...AR.exportacaoMWh)); const mcx = mc + melhor.mesesDeAtraso;
    return {
      teste: 'Se positivo é exportação, a soma das horas positivas do ONS bate com a exportação do Comex e a das negativas com a importação; ao contrário, não bateria.',
      onsHorasPositivasMWh: Math.round(pos), comexExportacaoMWh: cxExp,
      onsHorasNegativasMWh: Math.round(neg), comexImportacaoMWh: cxImp,
      conclusao: Math.abs(pos - cxExp) < Math.abs(pos - cxImp) && Math.abs(neg - cxImp) < Math.abs(neg - cxExp) ? 'positivo = exportação do Brasil (confirmado pelos totais)' : 'NÃO confirmado: conferir',
      serieMensalArgentina: { nota: 'A série mensal do Comex anda atrás da do ONS: correlação por meses de atraso.', defasagens: defas },
      mesConhecido: { onsMes: `2025-${String(mc + 1).padStart(2, '0')}`, onsPositivoMWh: AR.exportacaoMWh[mc], onsNegativoMWh: AR.importacaoMWh[mc], comexMes: mcx < 12 ? `2025-${String(mcx + 1).padStart(2, '0')}` : null, comexExportacaoMWh: mcx < 12 ? ar[mcx] : null },
    };
  })(),
};

// ───────────────────────────── saída ─────────────────────────────
const usadasRotas = new Set(fluxos.flatMap((f) => f.urfs.map((u) => u.rota)).filter(Boolean));
const rotasFinal = Object.fromEntries(Object.entries(rotas).filter(([k, v]) => v && usadasRotas.has(k)));
const att = json('comex-atualizacao.json').data;
const marnetSha = CONSULTAS['eurostat-marnet_plus_20km.gpkg'].sha256;
const saida = {
  ano: 2025,
  geradoEm: new Date().toISOString().slice(0, 10),
  fontes: {
    comex: { orgao: 'MDIC/SECEX', conjunto: 'Comex Stat, API (exportação e importação por NCM × país × URF × via)', endereco: 'https://api-comexstat.mdic.gov.br/general', acesso: acesso('comex-2025-exportacao-ncm-pais-urf-via.json'), atualizadoNaFonte: att.updated, ultimoMesNaFonte: `${att.year}-${att.monthNumber}`, licenca: 'A API não declara licença; o rodapé do sítio diz CC BY-ND 3.0 para o conteúdo do sítio.' },
    rotasAereas: { orgao: 'NIVAR', conjunto: 'Arcos de círculo máximo do aeroporto (ponto da ANAC, lista de aeródromos públicos) ao centro do país (Natural Earth 110m), para o querosene de aviação com via aérea', endereco: 'tools/alexandria-atlas/comercio/construir.mjs', acesso: acesso('anac-aerodromos-publicos.csv'), licenca: 'Calculados pela NIVAR; não são rota de voo' },
    ons: { orgao: 'ONS', conjunto: 'Intercâmbio do SIN com outros países', endereco: CONSULTAS['ons-intercambio-internacional-2025.csv'].url, acesso: acesso('ons-intercambio-internacional-2025.csv'), licenca: 'CC-BY (declarada no portal de dados abertos do ONS)' },
    anp: { orgao: 'ANP', conjunto: 'Importações e exportações de petróleo (conferência)', endereco: CONSULTAS['anp-importacoes-exportacoes-petroleo-2000-2025.csv'].url, acesso: acesso('anp-importacoes-exportacoes-petroleo-2000-2025.csv') },
    rotas: ARCO ? { metodo: 'arco geodésico' } : METODO === 'mar' ? globalThis.__roteador.fonte(acesso('natural-earth-countries-10m.json'), CONSULTAS['natural-earth-countries-10m.json'].sha256) : { orgao: 'Eurostat', conjunto: 'SeaRoute, rede marítima MARNET (marnet_plus_20km.gpkg)', endereco: CONSULTAS['eurostat-marnet_plus_20km.gpkg'].url, repositorio: 'https://github.com/eurostat/searoute', acesso: acesso('eurostat-marnet_plus_20km.gpkg'), sha256: marnetSha, licenca: 'EUPL 1.2 (LICENSE do repositório; o arquivo .gpkg não traz licença própria)', origemDaRede: 'O README do repositório diz que a rede vem da Global Shipping Lane Network (Oak Ridge National Labs, 2000), acrescida de linhas na costa europeia.', avisoDeModificacao: `Obra derivada: caminhos mais curtos calculados sobre a rede e simplificados (Douglas-Peucker ${String(TOL_DP).replace(".", ",")}°, coordenadas com 2 casas) em ${new Date().toISOString().slice(0, 10)}. As geometrias do bloco "rotas" são distribuídas sob a EUPL 1.2; texto da licença em comercio-rotas-licenca.json.` },
  },
  leia: [
    'Fluxo = produto × sentido × país × via, com 1% ou mais do produto no sentido (peso líquido; urânio e eletricidade por valor FOB).',
    'A URF é a unidade da Receita Federal onde a mercadoria foi despachada, não o cais nem o terminal de onde o navio saiu.',
    'O país é o país declarado de destino ou de origem. Entreposto e bandeira de conveniência (Singapura, Panamá, Libéria, Países Baixos) podem aparecer como destino.',
    ...(METODO === 'mar' ? globalThis.__roteador.leia() : [
      'Toda rota é esquemática: traçado ilustrativo, não o caminho dos navios. Começa no vértice da rede marítima mais perto da âncora (a distância até ele está em ligacaoKm: a rede não entra em baías nem sobe o Amazonas) e termina no ponto da rede mais perto da costa do país, porque o dado não diz o porto.',
      'Rota sobre terra: sobreTerraKm mede, contra os países do Natural Earth 110m, quanto do traçado (fora dos primeiros e últimos 30 km) cai em terra. Os casos acima de 50 km atravessam canal (Suez, Kiel, Panamá, listados em passagens) ou estreito e ilha que a escala 110m funde à costa. As passagens do Ártico ficam fora da rede.',
    ]),
    'Uma rota é desenhada por par URF–país marítimo com 5% ou mais do produto no sentido, ou entre os 3 maiores pares do produto, quando o produto soma 10 kt ou mais no sentido (urânio, medido em valor, entra); o mesmo traçado serve a todos os produtos daquele par.',
    'Gás natural da Bolívia chega por duto (Corumbá): não tem navio nem rota marítima.',
    'Eletricidade: os fluxos do Comex trazem o valor e a via declarada no despacho (inclusive "rodoviária"), que não descreve a linha de transmissão. A quantidade física por mês é a do ONS, no bloco eletricidade.',
    'Via aérea: o Comex registra querosene de aviação exportado com via "aérea", despachado em aeroportos, por país de destino. O dado não diz se é carga levada por avião ou combustível posto no tanque de aeronave que parte para aquele país. O arco vai do aeroporto (ponto da ANAC) ao centro do país; não é rota de voo. Destino "Brasil" não tem arco.',
    'Remessa: cada item da lista do mapa é um produto, de uma URF de despacho para um país (ou de um país para uma URF), somado no ano; há uma por produto × sentido × URF × país com rota desenhada, e várias remessas dividem o mesmo traçado. A classe do veículo segue o produto (petroleiro para líquidos, graneleiro para carvão e coques, gaseiro para GNL e GLP, carga para o urânio, avião para a via aérea); o dado não diz o navio nem quantas viagens houve.',
  ],
  produtos: PRODUTOS.map((p) => ({ id: p.id, nome: p.nome, ncms: p.ncms, unidade: p.medida === 'kg' ? 'kt (mil toneladas, peso líquido)' : 'US$ FOB (o peso é desprezível ou não informado)', ...(p.id === 'eletricidade' ? { unidadeExtra: 'MWh (quantidade estatística do Comex, "MIL QUILOWATT HORA")' } : {}), exportacao: { kt: totais[`${p.id}:exportacao`].kt, fobUS: totais[`${p.id}:exportacao`].fobUS }, importacao: { kt: totais[`${p.id}:importacao`].kt, fobUS: totais[`${p.id}:importacao`].fobUS } })),
  ancoras: Object.fromEntries(Object.entries(ancoras).map(([k, v]) => [k, { ...v, nota: 'Unidade de despacho da Receita, não o cais.' }])),
  semAncora: { [URF_SEM_LOCAL]: 'NAO INFORMADO: a URF não foi declarada (importação de eletricidade do Paraguai).' },
  paisesComo: { ne110m: 'centroide do maior polígono do país no Natural Earth 110m (world-110m.json, o mesmo do capítulo "O mundo"); é o centro do país, não um porto', ne50m: 'centroide do maior polígono no Natural Earth 50m (world-atlas 2.0.2): o país não tem polígono no 110m', 'sem-poligono': 'sem polígono no Natural Earth 110m nem 50m: sem ponto' },
  paisesCodigo: 'Código de três letras dado pelo próprio Comex Stat (/tables/countries/{id}); para os países desenhados no 110m, conferido contra a tabela numérico → alfa-3 do capítulo "O mundo" (worldApi.ts).',
  paises,
  fluxos: fluxos.map(({ viaComex, paisNome, ...f }) => { void viaComex; void paisNome; return f; }),
  rotas: rotasFinal,
  viagens,
  condutos,
  eletricidade,
  conferencia,
};
const texto = JSON.stringify(saida);
writeFileSync(SAIDA, texto);
// Sem a rede do Eurostat no arquivo publicado, o texto da EUPL não acompanha mais nada.
if (!MARNET && existsSync(SAIDA_LICENCA)) { rmSync(SAIDA_LICENCA); console.log('removido:', SAIDA_LICENCA); }
if (ROTAS_JSON) writeFileSync(ROTAS_JSON, JSON.stringify(Object.fromEntries([...ROTEADAS].filter(([k]) => rotasFinal[k]).map(([k, v]) => [k, v.trechosSobreTerra]))));
const licenca = { aplicaSeA: 'comercio-2025.json → bloco "rotas"', obra: 'Eurostat SeaRoute, rede marítima MARNET', repositorio: 'https://github.com/eurostat/searoute', codigoFonte: 'https://github.com/eurostat/searoute (rede) e tools/alexandria-atlas/comercio/construir.mjs (cálculo das rotas)', avisoDeModificacao: saida.fontes.rotas.avisoDeModificacao ?? null, licenca: 'EUPL 1.2', texto: ARCO ? null : lerBruto('eurostat-searoute-LICENSE.txt') };
if (MARNET) writeFileSync(SAIDA_LICENCA, JSON.stringify(licenca));

// relatório no terminal
const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
console.log(`comercio-2025.json: ${kb(texto)} KB · ${fluxos.length} fluxos · ${Object.keys(rotasFinal).length} rotas · ${Object.keys(ancoras).length} âncoras · ${Object.keys(paises).length} países`);
const pesada = Object.entries(rotasFinal).filter(([, r]) => r.sobreTerraKm > 0).sort((a, b) => b[1].sobreTerraKm - a[1].sobreTerraKm);
{ const fol = Object.entries(rotasFinal).filter(([, r]) => r.folgaMinKm != null).sort((a, b) => a[1].folgaMinKm - b[1].folgaMinKm); console.log(`folga mínima rota–terra (fora das pontas e dos portões): ${fol.slice(0, 12).map(([k, r]) => `${k} ${r.folgaMinKm} km`).join(" · ")}`); }
console.log(`rotas com trecho sobre terra (fora das pontas): ${pesada.length}`); for (const [k, r] of pesada.slice(0, 15)) console.log(`  ${k}: ${r.sobreTerraKm} km de ${r.km} (ligação ${r.ligacaoKm} km)`);
for (const l of conferencia.linhas) console.log(`conferência · ${l.item}: Comex ${l.comex} × ref ${l.referencia} → ${l.diferencaPct}%`);
console.log('sentido ONS:', JSON.stringify(conferencia.sentidoDoONS));
for (const a of avisos) console.log('AVISO', a);
for (const [k, a] of Object.entries(ancoras)) console.log(`âncora ${k} ${a.nome} → ${a.fonteDaCoordenada.orgao} ${a.fonteDaCoordenada.item}`);

if (SVG) {
  const W = 1800, H = 900; const X = (x) => ((x + 180) / 360) * W, Y = (y) => ((90 - y) / 180) * H;
  const path = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join('');
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#f4efe3"/>`;
  for (const { p } of terra.polis) for (const shx of [0, -360]) s += `<path d="${path(p[0].map(([x, y]) => [x + shx, y]))}Z" fill="#d9cfb8" stroke="#8a7d62" stroke-width="0.5"/>`;
  for (const [k, r] of Object.entries(rotasFinal)) { const c = r.sobreTerraKm > 0 ? '#9a3b22' : '#1f3a5f'; for (const sh of [0, -360, 360]) s += `<path d="${path(r.linha.map(([x, y]) => [x + sh, y]))}" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.8"><title>${k}</title></path>`; }
  for (const a of Object.values(ancoras)) s += `<circle cx="${X(a.lonlat[0])}" cy="${Y(a.lonlat[1])}" r="2.5" fill="#b8860b"/>`;
  for (const [a3, p] of Object.entries(paises)) if (p.lonlat) s += `<circle cx="${X(p.lonlat[0])}" cy="${Y(p.lonlat[1])}" r="2" fill="#1f3a5f"/><text x="${X(p.lonlat[0]) + 3}" y="${Y(p.lonlat[1]) - 3}" font-size="9" font-family="sans-serif">${a3}</text>`;
  s += '</svg>';
  writeFileSync(SVG, s); console.log('svg:', SVG);
}
