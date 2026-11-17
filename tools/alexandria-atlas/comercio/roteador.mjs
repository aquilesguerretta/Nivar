// Roteador marítimo próprio do capítulo "O comércio" (leva 2): caminho mínimo numa grade de mar
// tirada do Natural Earth 10m (domínio público), sem rede nem traçado de terceiros.
//
//   1. Terra: os países do Natural Earth 10m (world-atlas 2.0.2, countries-10m.json) rasterizados numa
//      grade fina de 1/30° pelo centro da subcélula. Fechado ao sul de 50° S (mar do Sul e gelo; fecha
//      também o Cabo Horn e Magalhães: o Pacífico se alcança pelo Panamá) e ao norte de 71,5° N (as
//      passagens do Ártico, sazonais).
//   2. Grade de busca de 0,1°: a célula é mar se o centro e 7 das 9 subcélulas são mar; o oceano é o que
//      se alcança do Atlântico Sul andando de célula em célula sem cruzar terra fina (lagos, lagoas e
//      mares fechados, como o Cáspio, o Negro pelo Bósforo e a Lagoa dos Patos, ficam de fora).
//   3. Custo de um passo: a distância real (haversine) vezes 1 + 0,6·(3 − folga)/3 perto da costa
//      (folga = distância à terra em células) e vezes até 1,5 entre 38° S e 48° S (navio de carga
//      contorna o Cabo mais ao norte que a geodésica). Escolhas de modelo, declaradas em fonte().
//   4. Caminho mínimo (Dijkstra) com 16 vizinhos (os 8 e os saltos de cavalo); passo nenhum cruza terra
//      da grade fina. Da célula de mar mais perto da âncora até a primeira célula de mar vizinha do
//      maior polígono do país.
//   5. Portões de canal: aresta explícita entre o mar dos dois lados, pelos dois extremos com fonte
//      (PORTOES). O traçado do portão é a reta entre os extremos e é declarado. Suez não tem portão.
//   6. Alisamento: puxa o fio (de cada ponto, o mais distante que se alcança em linha reta) testando o
//      segmento como o mapa o desenha (reto em Mercator), amostra a cada ~2 km, sem tocar terra e sem
//      chegar mais perto da costa do que o caminho original chegava. Segmentos de até 1.000 km.
//   7. Conserto e medida contra os POLÍGONOS do 10m: segmento que toca terra ganha vértice de desvio;
//      polígono que uma rota atravessa (ilha fina, como Eleuthera) é engrossado na grade fina e a busca
//      daquela origem é refeita. sobreTerraKm mede o que restar, fora dos portões.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { feature as topoFeature } from 'topojson-client';

const R = 0.1; const W = 3600; const H = 1800; const N = W * H;
const RT = 6371.0088; const rad = Math.PI / 180;
const SUL_TERRA = -50; // ao sul disso, fechado: mar do Sul e gelo (fecha também o Cabo Horn e Magalhães)
const NORTE_TERRA = 71.5; // acima disso, fechado: as passagens do Ártico (sazonais)
const SUB = 3; const FR = R / SUB; const FW = W * SUB; const FH = H * SUB; // grade fina (1/3 da célula) para o teste de terra
const SUL_PREF = -38; const PEN_SUL = 0.5;
const MAX_FOLGA = 8; const SEG_MAX_KM = 1000; const PASSO_AMOSTRA_KM = 2;
// Folga da costa (leva 3): distância à terra em km, medida na grade fina. O custo de um passo cresce
// quando a célula está a menos de D_ALVO km da terra (até 1 + PEN_COSTA rente à costa, em curva
// quadrática): em mar aberto a rota corre a dezenas de km da costa; num estreito, o custo mínimo fica
// no meio do canal. O alisamento não deixa a reta chegar mais perto da terra do que min(D_ALISA, a
// folga que o caminho da grade tinha ali) × FOLGA_TOL.
const ILHOTA = 0.12; // graus: polígono menor que isso é engrossado na grade fina (ver criarRoteador)
const D_ALVO = 45; const PEN_COSTA = 2.5; const D_ALISA = 30; const FOLGA_TOL = 0.85; const D_MAX = 250;

export function hav(a, b) {
  const dl = (b[0] - a[0]) * rad, dp = (b[1] - a[1]) * rad;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dl / 2) ** 2;
  return 2 * RT * Math.asin(Math.min(1, Math.sqrt(h)));
}
const lonDe = (i) => -180 + (i + 0.5) * R;
const latDe = (j) => 90 - (j + 0.5) * R;
const celula = (lon, lat) => {
  let i = Math.floor((lon + 180) / R); i = ((i % W) + W) % W;
  const j = Math.min(H - 1, Math.max(0, Math.floor((90 - lat) / R)));
  return j * W + i;
};
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * rad) / 2));
const latDeMercY = (y) => (2 * Math.atan(Math.exp(y)) - Math.PI / 2) / rad;

/** Preenche as células cujo centro cai dentro do polígono (par-ímpar sobre todos os anéis). */
function rasterizar(aneis, marcar, R = 0.1, W = 3600, H = 1800) {
  const latDe = (j) => 90 - (j + 0.5) * R;
  const cruza = aneis.some((a) => a.some((q, k) => k && Math.abs(q[0] - a[k - 1][0]) > 180));
  const A = cruza ? aneis.map((a) => a.map(([x, y]) => [x < 0 ? x + 360 : x, y])) : aneis;
  const porLinha = new Map();
  for (const a of A) {
    for (let k = 1; k < a.length; k++) {
      const [x0, y0] = a[k - 1], [x1, y1] = a[k]; if (y0 === y1) continue;
      const ymin = Math.min(y0, y1), ymax = Math.max(y0, y1);
      const j0 = Math.max(0, Math.ceil((90 - ymax) / R - 0.5)), j1 = Math.min(H - 1, Math.floor((90 - ymin) / R - 0.5));
      for (let j = j0; j <= j1; j++) {
        const yc = latDe(j); if ((y0 > yc) === (y1 > yc)) continue;
        const x = x0 + ((yc - y0) * (x1 - x0)) / (y1 - y0);
        let l = porLinha.get(j); if (!l) porLinha.set(j, (l = [])); l.push(x);
      }
    }
  }
  for (const [j, xs] of porLinha) {
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const i0 = Math.ceil((xs[k] + 180) / R - 0.5), i1 = Math.floor((xs[k + 1] + 180) / R - 0.5);
      for (let i = i0; i <= i1; i++) marcar(j * W + (((i % W) + W) % W));
    }
  }
}
function poligonos(g) { return g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []; }
function areaAnel(a) { let s = 0; for (let k = 0; k < a.length - 1; k++) s += a[k][0] * a[k + 1][1] - a[k + 1][0] * a[k][1]; return Math.abs(s / 2); }

class Heap {
  constructor() { this.k = new Float64Array(1 << 20); this.v = new Int32Array(1 << 20); this.n = 0; }
  push(key, val) {
    if (this.n === this.k.length) { const k = new Float64Array(this.n * 2); k.set(this.k); this.k = k; const v = new Int32Array(this.n * 2); v.set(this.v); this.v = v; }
    let i = this.n++; const K = this.k, V = this.v;
    while (i > 0) { const p = (i - 1) >> 1; if (K[p] <= key) break; K[i] = K[p]; V[i] = V[p]; i = p; }
    K[i] = key; V[i] = val;
  }
  pop() { // devolve o valor; a chave fica em this.ult
    const K = this.k, V = this.v; const top = V[0]; this.ult = K[0];
    const n = --this.n; if (n > 0) {
      const key = K[n], val = V[n]; let i = 0;
      for (;;) { const l = 2 * i + 1; if (l >= n) break; const r = l + 1; const m = r < n && K[r] < K[l] ? r : l; if (K[m] >= key) break; K[i] = K[m]; V[i] = V[m]; i = m; }
      K[i] = key; V[i] = val;
    }
    return top;
  }
}

export function criarRoteador({ bruto, log = () => {} }) {
  const t0 = Date.now();
  const topo = JSON.parse(readFileSync(join(bruto, 'natural-earth-countries-10m.json'), 'utf8'));
  const paises = topoFeature(topo, topo.objects.countries).features;
  // ── terra ──
  const fina = new Uint8Array(FW * FH); // 1 = terra na grade fina
  const ilha = new Uint8Array(FW * FH); // 1 = contorno de ilhota (ILHOTA), juntado à fina depois da classificação grossa
  const polis = []; // para a medida vetorial
  for (const f of paises) {
    if (!f.geometry) continue;
    for (const p of poligonos(f.geometry)) {
      let bb = [999, 90, -999, -90]; for (const [x, y] of p[0]) bb = [Math.min(bb[0], x), Math.min(bb[1], y), Math.max(bb[2], x), Math.max(bb[3], y)];
      if (bb[3] < SUL_TERRA) continue; // Antártida: a faixa sul inteira já é terra
      rasterizar(p, (c) => { fina[c] = 1; }, FR, FW, FH);
      // Ilhota (caixa menor que ILHOTA graus, como Perim em Bab el-Mandeb): o centro da subcélula pode
      // cair fora dela e a ilha sumiria da grade fina; toda subcélula que o contorno toca vira terra.
      if (Math.max(bb[2] - bb[0], bb[3] - bb[1]) < ILHOTA) for (const anel of p) for (let q = 1; q < anel.length; q++) {
        const [x0, y0] = anel[q - 1], [x1, y1] = anel[q]; if (Math.abs(x1 - x0) > 180) continue;
        const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / (FR / 2)));
        for (let t = 0; t <= n; t++) { const x = x0 + ((x1 - x0) * t) / n, y = y0 + ((y1 - y0) * t) / n; let i = Math.floor((x + 180) / FR); i = ((i % FW) + FW) % FW; const j = Math.min(FH - 1, Math.max(0, Math.floor((90 - y) / FR))); ilha[j * FW + i] = 1; }
      }
      const cruza = p.some((a) => a.some((q, k) => k && Math.abs(q[0] - a[k - 1][0]) > 180));
      if (cruza) { const ps = p.map((a) => a.map(([u, v]) => [u < 0 ? u + 360 : u, v])); let b2 = [999, 90, -999, -90]; for (const [x, y] of ps[0]) b2 = [Math.min(b2[0], x), Math.min(b2[1], y), Math.max(b2[2], x), Math.max(b2[3], y)]; polis.push({ p: ps, bb: b2, cruza }); }
      else polis.push({ p, bb, cruza });
    }
  }
  // Ilhas pequenas do Natural Earth 10m (ne_10m_minor_islands, leva 3): fora dos países do 10m (Sangiang,
  // no meio do estreito de Sunda, ficava sob a rota na base do Mapbox). Entram como ilhota: na grade
  // fina e na distância à terra, sem fechar célula grossa; e na medida vetorial.
  const arqIlhas = join(bruto, 'natural-earth-minor-islands-10m.geojson');
  let nIlhas = 0;
  if (existsSync(arqIlhas)) for (const f of JSON.parse(readFileSync(arqIlhas, 'utf8')).features) {
    if (!f.geometry) continue;
    for (const p of poligonos(f.geometry)) {
      let bb = [999, 90, -999, -90]; for (const [x, y] of p[0]) bb = [Math.min(bb[0], x), Math.min(bb[1], y), Math.max(bb[2], x), Math.max(bb[3], y)];
      if (bb[3] < SUL_TERRA || bb[1] > NORTE_TERRA || bb[2] - bb[0] > 180) continue;
      rasterizar(p, (c) => { ilha[c] = 1; }, FR, FW, FH);
      for (const anel of p) for (let q = 1; q < anel.length; q++) {
        const [x0, y0] = anel[q - 1], [x1, y1] = anel[q];
        const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / (FR / 2)));
        for (let t = 0; t <= n; t++) { const x = x0 + ((x1 - x0) * t) / n, y = y0 + ((y1 - y0) * t) / n; let i = Math.floor((x + 180) / FR); i = ((i % FW) + FW) % FW; const j = Math.min(FH - 1, Math.max(0, Math.floor((90 - y) / FR))); ilha[j * FW + i] = 1; }
      }
      polis.push({ p, bb, cruza: false }); nIlhas++;
    }
  }
  // Engrossar um polígono: toda subcélula que o contorno atravessa vira terra. Usado só nos polígonos
  // que uma rota atravessou (ilha fina, como Eleuthera, que some entre dois centros da grade fina); a
  // rota daquela origem é recalculada. Engrossar todas as costas fecharia Gibraltar e o Grande Belt.
  const engrossados = new Set();
  function engrossar(k) {
    if (engrossados.has(k)) return false; engrossados.add(k);
    for (const anel of polis[k].p) for (let q = 1; q < anel.length; q++) {
      const [x0, y0] = anel[q - 1], [x1, y1] = anel[q]; if (Math.abs(x1 - x0) > 180) continue;
      const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / (FR / 2)));
      for (let t = 0; t <= n; t++) { const x = x0 + ((x1 - x0) * t) / n, y = y0 + ((y1 - y0) * t) / n; let i = Math.floor((x + 180) / FR); i = ((i % FW) + FW) % FW; const j = Math.min(FH - 1, Math.max(0, Math.floor((90 - y) / FR))); fina[j * FW + i] = 1; misto[((j / SUB) | 0) * W + ((i / SUB) | 0)] = 1; }
    }
    return true;
  }
  // ── distância à terra (km) na grade fina: transformada de chanfro em duas passadas (3×3, com o passo
  // leste-oeste encolhido pelo cosseno da latitude). Só terra de verdade: as faixas fechadas do sul e do
  // norte entram depois. Erro do chanfro: até ~8% a mais, sem importância para um custo.
  const dkm = new Float32Array(FW * FH);
  {
    const dy = FR * 110.574; const dxL = new Float32Array(FH); const ddL = new Float32Array(FH);
    for (let j = 0; j < FH; j++) { dxL[j] = FR * 111.32 * Math.cos((90 - (j + 0.5) * FR) * rad); ddL[j] = Math.hypot(dxL[j], dy); }
    for (let c = 0; c < FW * FH; c++) dkm[c] = fina[c] || ilha[c] ? 0 : D_MAX;
    for (let j = 0; j < FH; j++) { const o = j * FW, dx = dxL[j], dd = j ? (ddL[j] + ddL[j - 1]) / 2 : ddL[j];
      for (let i = 0; i < FW; i++) { const c = o + i; let v = dkm[c]; if (!v) continue;
        const e = i ? c - 1 : o + FW - 1; if (dkm[e] + dx < v) v = dkm[e] + dx;
        if (j) { const u = c - FW; if (dkm[u] + dy < v) v = dkm[u] + dy; const ul = i ? u - 1 : u + FW - 1; if (dkm[ul] + dd < v) v = dkm[ul] + dd; const ur = i < FW - 1 ? u + 1 : u - FW + 1; if (dkm[ur] + dd < v) v = dkm[ur] + dd; }
        dkm[c] = v; } }
    for (let j = FH - 1; j >= 0; j--) { const o = j * FW, dx = dxL[j], dd = j < FH - 1 ? (ddL[j] + ddL[j + 1]) / 2 : ddL[j];
      for (let i = FW - 1; i >= 0; i--) { const c = o + i; let v = dkm[c]; if (!v) continue;
        const e = i < FW - 1 ? c + 1 : o; if (dkm[e] + dx < v) v = dkm[e] + dx;
        if (j < FH - 1) { const u = c + FW; if (dkm[u] + dy < v) v = dkm[u] + dy; const ul = i ? u - 1 : u + FW - 1; if (dkm[ul] + dd < v) v = dkm[ul] + dd; const ur = i < FW - 1 ? u + 1 : u - FW + 1; if (dkm[ur] + dd < v) v = dkm[ur] + dd; }
        dkm[c] = v; } }
  }
  const folgaKmEm = (lon, lat) => { let i = Math.floor((lon + 180) / FR); i = ((i % FW) + FW) % FW; const j = Math.min(FH - 1, Math.max(0, Math.floor((90 - lat) / FR))); return dkm[j * FW + i]; };
  for (let j = 0; j < FH; j++) { const lat = 90 - (j + 0.5) * FR; if (lat < SUL_TERRA || lat > NORTE_TERRA) fina.fill(1, j * FW, (j + 1) * FW); }
  // Célula grossa é mar só se o centro é mar e 7 das 9 subcélulas são mar: estreito mais fino que a
  // célula (Øresund, Bósforo) fecha; Gibraltar, Dover, o Grande Belt, Singapura e Ormuz ficam abertos.
  const terra = new Uint8Array(N); const misto = new Uint8Array(N); // misto: alguma subcélula é terra
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    let t = 0; for (let b = 0; b < SUB; b++) { const o = (j * SUB + b) * FW + i * SUB; for (let a = 0; a < SUB; a++) t += fina[o + a]; }
    if (t > 2 || fina[(j * SUB + 1) * FW + i * SUB + 1]) terra[j * W + i] = 1;
    if (t) misto[j * W + i] = 1;
  }
  // as ilhotas entram na grade fina (teste de passo e de segmento) sem fechar a célula grossa: Gibraltar
  // e Ceuta são polígonos pequenos rente ao estreito e fechariam o estreito pela regra dos 7/9
  for (let c = 0; c < FW * FH; c++) if (ilha[c] && !fina[c]) { fina[c] = 1; const j = (c / FW) | 0, i = c - j * FW; misto[((j / SUB) | 0) * W + ((i / SUB) | 0)] = 1; }
  const finaEm = (lon, lat) => { let i = Math.floor((lon + 180) / FR); i = ((i % FW) + FW) % FW; const j = Math.min(FH - 1, Math.max(0, Math.floor((90 - lat) / FR))); return fina[j * FW + i]; };
  // ── oceano (componente ligada ao Atlântico Sul) ──
  const oceano = new Uint8Array(N); const fila = new Int32Array(N);
  const semente = celula(-30, -30); if (terra[semente]) throw new Error('semente em terra');
  let qa = 0, qb = 0; fila[qb++] = semente; oceano[semente] = 1;
  while (qa < qb) {
    const c = fila[qa++]; const j = (c / W) | 0, i = c - j * W;
    // 4 vizinhos, e o meio do passo tem de ser mar na grade fina: o oceano é o que se alcança de fato
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const jj = j + dj; if (jj < 0 || jj >= H) continue; const ii = (i + di + W) % W; const d = jj * W + ii;
      if (terra[d] || oceano[d]) continue;
      if (finaEm(lonDe(i) + (di * R) / 2, latDe(j) - (dj * R) / 2)) continue;
      oceano[d] = 1; fila[qb++] = d;
    }
  }
  // ── folga (distância à não-oceano, em células, 8-vizinhos) ──
  const folga = new Uint8Array(N); qa = 0; qb = 0;
  for (let c = 0; c < N; c++) if (oceano[c]) folga[c] = 255; else { folga[c] = 0; fila[qb++] = c; }
  while (qa < qb) {
    const c = fila[qa++]; const f = folga[c]; if (f >= MAX_FOLGA) continue; const j = (c / W) | 0, i = c - j * W;
    for (let dj = -1; dj <= 1; dj++) { const jj = j + dj; if (jj < 0 || jj >= H) continue; for (let di = -1; di <= 1; di++) { const d = jj * W + ((i + di + W) % W); if (folga[d] === 255) { folga[d] = f + 1; fila[qb++] = d; } } }
  }
  for (let c = 0; c < N; c++) if (folga[c] === 255) folga[c] = MAX_FOLGA;
  // Mar do Sul: custo cresce de 1 (a 38° S) a 1,5 (a 48° S). O caminho geodésico do Brasil à Ásia e à
  // Austrália desceria até o limite de 50° S e correria ao longo dele; navio de carga contorna o Cabo
  // mais ao norte (tempo e gelo). É escolha de modelo, declarada em fonte().
  const sulLinha = new Float32Array(H); for (let j = 0; j < H; j++) { const lat = latDe(j); sulLinha[j] = lat >= SUL_PREF ? 1 : 1 + PEN_SUL * Math.min(1, (SUL_PREF - lat) / 10); }
  // folga de cada célula da busca = distância à terra no centro dela (subcélula do meio)
  const dCel = new Float32Array(N); for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) dCel[j * W + i] = dkm[(j * SUB + 1) * FW + i * SUB + 1];
  const fatorCosta = new Float32Array(N); for (let c = 0; c < N; c++) { const q = Math.max(0, (D_ALVO - dCel[c]) / D_ALVO); fatorCosta[c] = 1 + PEN_COSTA * q * q; }
  const fator = (c) => sulLinha[(c / W) | 0] * fatorCosta[c];
  // ── vizinhança: 16 deslocamentos; distância por linha (só depende da latitude) ──
  const OFF = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1], [2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
  const distLinha = new Float32Array(H * OFF.length);
  for (let j = 0; j < H; j++) for (let k = 0; k < OFF.length; k++) { const jj = j + OFF[k][1]; distLinha[j * OFF.length + k] = jj < 0 || jj >= H ? Infinity : hav([0, latDe(j)], [OFF[k][0] * R, latDe(jj)]); }
  const ehMar = (c) => oceano[c] === 1;
  const vizinho = (i, j, di, dj) => { const jj = j + dj; if (jj < 0 || jj >= H) return -1; return jj * W + ((i + di + W) % W); };

  // ── portões ──
  const portos = JSON.parse(readFileSync(join(bruto, 'natural-earth-ports-10m.geojson'), 'utf8')).features;
  const porto = (nome) => { const l = portos.filter((f) => f.properties.name === nome); if (l.length !== 1) throw new Error(`porto ${nome}: ${l.length}`); return { nome, lonlat: l[0].geometry.coordinates, neId: l[0].properties.ne_id }; };
  const marMaisPerto = (p, raio = 200, exigeFolga = 1) => {
    const c0 = celula(p[0], p[1]); const j0 = (c0 / W) | 0, i0 = c0 - j0 * W; let m = -1, dm = Infinity;
    for (let r = 0; r <= raio; r++) {
      for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue; const c = vizinho(i0, j0, di, dj); if (c < 0 || !ehMar(c) || folga[c] < exigeFolga) continue;
        const d = hav(p, [lonDe(c % W), latDe((c / W) | 0)]); if (d < dm) { dm = d; m = c; }
      }
      if (m >= 0 && r * R * 111 * Math.cos(p[1] * rad) > dm + 20) break;
    }
    return [m, dm];
  };
  const PORTOES = [];
  {
    const cr = porto('Cristobal'), ba = porto('Balboa');
    const [a] = marMaisPerto(cr.lonlat), [b] = marMaisPerto(ba.lonlat);
    PORTOES.push({ id: 'panama', nome: 'Canal do Panamá', extremos: [cr, ba], a, b, fonte: `Natural Earth 10m, camada de portos (ne_10m_ports): "${cr.nome}" (ne_id ${cr.neId}) no Caribe e "${ba.nome}" (ne_id ${ba.neId}) no Pacífico` });
  }
  for (const g of PORTOES) {
    const c = (x) => [lonDe(x % W), latDe((x / W) | 0)];
    g.custo = hav(c(g.a), g.extremos[0].lonlat) + hav(g.extremos[0].lonlat, g.extremos[1].lonlat) + hav(g.extremos[1].lonlat, c(g.b));
  }
  // Suez HIPOTÉTICO (leva 4), nunca desenhado: Port Said (camada de portos do Natural Earth) ligado à
  // célula de mar mais ao norte do golfo de Suez na grade. Só serve para saber se uma rota dá a volta
  // pela África por falta de portão: se com ele a costa do país ficaria 3% ou mais perto, a rota ganha
  // `contorno`. Sem a ponta sul com fonte, o traçado publicado continua sem Suez.
  const SUEZ = (() => {
    const ps = portos.filter((f) => f.properties.name === 'Port Said'); if (ps.length !== 1) return null;
    const [a] = marMaisPerto(ps[0].geometry.coordinates); if (a < 0) return null;
    let b = -1, latB = -90;
    for (let j = 0; j < H; j++) { const lat = latDe(j); if (lat < 29.3 || lat > 30.2) continue; for (let i = 0; i < W; i++) { const lon = lonDe(i); if (lon < 32.2 || lon > 32.8) continue; const c = j * W + i; if (ehMar(c) && lat > latB) { latB = lat; b = c; } } }
    if (b < 0) return null;
    const km = hav([lonDe(a % W), latDe((a / W) | 0)], [lonDe(b % W), latDe((b / W) | 0)]);
    return { a, b, km };
  })();
  const portaoEm = new Map(); PORTOES.forEach((g, k) => { portaoEm.set(g.a, [...(portaoEm.get(g.a) ?? []), [g.b, k]]); portaoEm.set(g.b, [...(portaoEm.get(g.b) ?? []), [g.a, k]]); });
  log(`roteador: grade ${W}×${H}, ${polis.length} polígonos (${nIlhas} de ilhas pequenas), oceano ${oceano.reduce((s, x) => s + x, 0)} células, ${Date.now() - t0} ms`);

  // ── Dijkstra com parada quando todos os destinos assentam ──
  const dist = new Float64Array(N); const prev = new Int32Array(N); const viaPortao = new Int8Array(N); const fechado = new Uint8Array(N);
  // opcoes.soKm (leva 4): custo = só a distância (sem a folga da costa nem o mar do Sul), para achar a
  // costa do país mais próxima PELO MAR em km; opcoes.extra: arestas a mais [a, b, km] (o Suez
  // hipotético, usado só para saber se a rota contorna a África por falta de portão)
  function dijkstra(origem, alvos, opcoes = {}) { // alvos: Map célula → [ids]
    const soKm = !!opcoes.soKm; const extraEm = new Map(); for (const [a, b, km] of opcoes.extra ?? []) { extraEm.set(a, [...(extraEm.get(a) ?? []), [b, km]]); extraEm.set(b, [...(extraEm.get(b) ?? []), [a, km]]); }
    dist.fill(Infinity); prev.fill(-1); viaPortao.fill(-1); fechado.fill(0);
    const h = new Heap(); dist[origem] = 0; h.push(0, origem);
    const pend = new Set([...alvos.values()].flat()); const fim = {};
    while (h.n && pend.size) {
      const u = h.pop(); if (fechado[u]) continue; fechado[u] = 1;
      const ids = alvos.get(u); if (ids) for (const id of ids) if (pend.has(id)) { pend.delete(id); fim[id] = u; }
      const j = (u / W) | 0, i = u - j * W; const du = dist[u]; const fu = fator(u);
      for (let k = 0; k < 16; k++) {
        const v = vizinho(i, j, OFF[k][0], OFF[k][1]); if (v < 0 || !ehMar(v) || fechado[v]) continue;
        if (k >= 8) { // salto de cavalo: as duas células do meio têm de ser mar
          const [dx, dy] = OFF[k]; const m1 = Math.abs(dx) === 2 ? vizinho(i, j, dx / 2, 0) : vizinho(i, j, 0, dy / 2); const m2 = Math.abs(dx) === 2 ? vizinho(i, j, dx / 2, dy) : vizinho(i, j, dx, dy / 2);
          if (m1 < 0 || m2 < 0 || !ehMar(m1) || !ehMar(m2)) continue;
        }
        // o passo não pode cruzar terra da grade fina (ilha menor que a célula): amostra a cada meia
        // subcélula quando alguma célula tocada tem terra fina
        const sx = Math.sign(OFF[k][0]), sy = Math.sign(OFF[k][1]);
        if (misto[u] || misto[v] || misto[vizinho(i, j, OFF[k][0], 0)] || misto[vizinho(i, j, 0, OFF[k][1])] || misto[vizinho(i, j, sx, 0)] || misto[vizinho(i, j, 0, sy)] || misto[vizinho(i, j, sx, sy)]) {
          const lu = lonDe(i), au = latDe(j), lv = lu + OFF[k][0] * R, av = latDe(j + OFF[k][1]); let bate = false;
          const n = 2 * SUB * Math.max(Math.abs(OFF[k][0]), Math.abs(OFF[k][1]));
          for (let q = 1; q < n; q++) { const t = q / n; if (finaEm(lu + (lv - lu) * t, au + (av - au) * t)) { bate = true; break; } }
          if (bate) continue;
        }
        const nd = du + distLinha[j * 16 + k] * (soKm ? 1 : (fu + fator(v)) / 2);
        if (nd < dist[v]) { dist[v] = nd; prev[v] = u; viaPortao[v] = -1; h.push(nd, v); }
      }
      const gs = portaoEm.get(u); if (gs) for (const [v, k] of gs) { const nd = du + PORTOES[k].custo; if (!fechado[v] && nd < dist[v]) { dist[v] = nd; prev[v] = u; viaPortao[v] = k; h.push(nd, v); } }
      const xs = extraEm.get(u); if (xs) for (const [v, km] of xs) { const nd = du + km; if (!fechado[v] && nd < dist[v]) { dist[v] = nd; prev[v] = u; viaPortao[v] = -1; h.push(nd, v); } }
    }
    return fim;
  }

  // ── células-alvo do país: mar vizinho do maior polígono no 10m ──
  // Mais de uma feição pode ter o mesmo código (Austrália e Ashmore e Cartier, ambos 036): junta todas.
  const porN3 = new Map(); for (const f of paises) if (f.id && f.geometry) porN3.set(f.id, [...(porN3.get(f.id) ?? []), ...poligonos(f.geometry)]);
  const marca = new Uint8Array(N);
  function costa(n3) {
    const ps = porN3.get(n3); if (!ps) throw new Error(`país ${n3} fora do Natural Earth 10m`);
    let maior = null, area = 0; for (const p of ps) { const a = areaAnel(p[0]); if (a > area) { area = a; maior = p; } }
    const cel = []; rasterizar(maior, (c) => { if (!marca[c]) { marca[c] = 1; cel.push(c); } });
    if (!cel.length) for (const [x, y] of maior[0]) { const c = celula(x, y); if (!marca[c]) { marca[c] = 1; cel.push(c); } } // país menor que a célula
    const alvo = new Set();
    for (const c of cel) { const j = (c / W) | 0, i = c - j * W; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const d = vizinho(i, j, di, dj); if (d >= 0 && ehMar(d)) alvo.add(d); } }
    for (const c of cel) marca[c] = 0;
    return { alvo, anel: maior[0] };
  }

  // ── teste de segmento como o mapa desenha (reto em Mercator) ──
  function amostrasSeg(a, b) {
    const km = hav(a, b); const n = Math.max(1, Math.ceil(km / PASSO_AMOSTRA_KM)); const ya = mercY(a[1]), yb = mercY(b[1]); const o = [];
    for (let k = 0; k <= n; k++) { const t = k / n; o.push([a[0] + (b[0] - a[0]) * t, latDeMercY(ya + (yb - ya) * t)]); }
    return o;
  }
  // req(t): folga mínima (km) exigida na fração t do segmento
  const segOk = (a, b, req) => { const am = amostrasSeg(a, b); const n = am.length - 1; for (let k = 0; k <= n; k++) { const p = am[k]; const c = celula(p[0], p[1]); if (!ehMar(c)) return false; if (finaEm(p[0], p[1]) || (folga[c] <= 3 && naTerraVetor(p))) return false; if (folgaKmEm(p[0], p[1]) < req(n ? k / n : 0)) return false; } return true; };

  function alisar(P, D) {
    // P: pontos (lon desenrolada), D: folga (km) de cada ponto do caminho da grade. A reta de P[i] a
    // P[j] passa, na fração t, perto do ponto i + t·(j − i) do caminho: exige ali a folga que o caminho
    // tinha na vizinhança (±3 pontos), limitada a D_ALISA, vezes FOLGA_TOL.
    const loc = (k) => { let m = Infinity; for (let q = Math.max(0, k - 3); q <= Math.min(P.length - 1, k + 3); q++) m = Math.min(m, D[q]); return Math.min(D_ALISA, m) * FOLGA_TOL; };
    const o = [P[0]]; let i = 0;
    while (i < P.length - 1) {
      let melhor = i + 1; let falhas = 0;
      for (let j = i + 2; j < P.length; j++) {
        if (hav(P[i], P[j]) > SEG_MAX_KM) break;
        if (segOk(P[i], P[j], (t) => loc(Math.round(i + t * (j - i))))) { melhor = j; falhas = 0; } else if (++falhas > 60) break;
      }
      o.push(P[melhor]); i = melhor;
    }
    return o;
  }

  // ── medida vetorial: km sobre terra contra os polígonos do 10m ──
  const dentroAnel = (pt, a) => { let c = false; for (let k = 0, l = a.length - 1; k < a.length; l = k++) { if ((a[k][1] > pt[1]) !== (a[l][1] > pt[1]) && pt[0] < ((a[l][0] - a[k][0]) * (pt[1] - a[k][1])) / (a[l][1] - a[k][1]) + a[k][0]) c = !c; } return c; };
  // índice de baldes de 5° com os polígonos cuja caixa toca o balde (longitude em 0..360 para os que cruzam)
  const BAL = 5; const baldes = new Map();
  polis.forEach((q, k) => { for (let bx = Math.floor(q.bb[0] / BAL); bx <= Math.floor(q.bb[2] / BAL); bx++) for (let by = Math.floor(q.bb[1] / BAL); by <= Math.floor(q.bb[3] / BAL); by++) { const key = (((bx % 72) + 72) % 72) * 1000 + by + 100; let l = baldes.get(key); if (!l) baldes.set(key, (l = [])); l.push(k); } });
  const naTerraVetor = (p0) => p0[1] < SUL_TERRA || p0[1] > NORTE_TERRA || poligonoEm(p0) >= 0;
  function poligonoEm(p0) {
    const x0 = ((p0[0] + 540) % 360) - 180; const y = p0[1];
    const cand = baldes.get((((Math.floor(x0 / BAL) % 72) + 72) % 72) * 1000 + Math.floor(y / BAL) + 100) ?? [];
    for (const k of cand) { const { p, bb, cruza } = polis[k];
      const x = cruza && x0 < 0 ? x0 + 360 : x0;
      if (y < bb[1] || y > bb[3] || x < bb[0] || x > bb[2]) continue;
      const aneis = p;
      if (dentroAnel([x, y], aneis[0]) && !aneis.slice(1).some((hh) => dentroAnel([x, y], hh))) return k;
    }
    return -1;
  }
  function sobreTerra(linha, trechosPortao) {
    let km = 0; const trechos = []; const atravessados = new Set();
    for (let s = 1; s < linha.length; s++) {
      if (trechosPortao.has(s)) continue;
      const am = amostrasSeg(linha[s - 1], linha[s]); const passo = hav(linha[s - 1], linha[s]) / Math.max(1, am.length - 1);
      for (let k = 1; k < am.length; k++) {
        const c = celula(am[k][0], am[k][1]);
        if ((terra[c] || folga[c] <= 3 || finaEm(am[k][0], am[k][1])) && naTerraVetor(am[k])) { km += passo; trechos.push(am[k].map((x) => Math.round(x * 100) / 100)); const q = poligonoEm(am[k]); if (q >= 0) atravessados.add(q); }
      }
    }
    return { km, trechos, atravessados };
  }

  const r2 = (x) => Math.round(x * 100) / 100;
  function desenrolar(pts) { const o = [pts[0]]; for (let k = 1; k < pts.length; k++) { let x = pts[k][0]; const px = o[k - 1][0]; while (x - px > 180) x -= 360; while (x - px < -180) x += 360; o.push([x, pts[k][1]]); } return o; }

  // Conserto final contra os POLÍGONOS: ilhota e ponta de cabo menores que a grade fina. Segmento que
  // toca terra ganha um vértice de desvio (o mais curto, a até ~35 km do ponto que bateu, em passos de
  // 0,01°) com os dois lados limpos; vértice em terra é deslocado para o mar mais perto do mesmo jeito.
  const primeiroEmTerra = (a, b) => {
    const km = hav(a, b); const n = Math.max(1, Math.ceil(km / 1)); const ya = mercY(a[1]), yb = mercY(b[1]);
    for (let k = 0; k <= n; k++) { const t = k / n; const p = [a[0] + (b[0] - a[0]) * t, latDeMercY(ya + (yb - ya) * t)]; const c = celula(p[0], p[1]); if ((terra[c] || folga[c] <= 3 || finaEm(p[0], p[1])) && naTerraVetor(p)) return p; }
    return null;
  };
  function reparar(linha, ehExtremo) {
    const cands = (p) => { const o = []; for (let r = 1; r <= 32; r++) for (let a = 0; a < 24; a++) { const ang = (a * Math.PI) / 12; o.push([r2(p[0] + (r * 0.01 * Math.cos(ang)) / Math.cos(p[1] * rad)), r2(p[1] + r * 0.01 * Math.sin(ang))]); } return o; };
    for (let s = 1, guarda = 0; s < linha.length && guarda < 400; s++) {
      if (ehExtremo[s - 1] || ehExtremo[s]) continue;
      const a = linha[s - 1], b = linha[s]; const bate = primeiroEmTerra(a, b); if (!bate) continue;
      guarda++;
      // vértice em terra (o b, que ainda não foi conferido como início): desloca
      const alvoEmB = (hav(bate, b) < 1.5 || naTerraVetor(b)) && s < linha.length - 1;
      let melhor = null, custo = Infinity;
      for (const m of cands(bate)) {
        const c = alvoEmB ? hav(a, m) + hav(m, linha[s + 1]) : hav(a, m) + hav(m, b); if (c >= custo) continue;
        if (primeiroEmTerra(a, m)) continue;
        if (alvoEmB ? primeiroEmTerra(m, linha[s + 1]) : primeiroEmTerra(m, b)) continue;
        melhor = m; custo = c;
      }
      if (!melhor) continue; // declarado na medida (sobreTerraKm)
      if (alvoEmB) linha[s] = melhor; else { linha.splice(s, 0, melhor); ehExtremo.splice(s, 0, false); }
      s--; // reconfere a partir daqui
    }
  }

  // Menor distância rota–terra (km, grade fina do 10m), fora dos segmentos de portão e dos primeiros e
  // últimos PONTA_KM km (a rota nasce rente ao porto e termina junto à costa do país).
  const PONTA_KM = 50;
  function folgaMinima(linha, segP = new Set()) {
    let total = 0; for (let k = 1; k < linha.length; k++) total += hav(linha[k - 1], linha[k]);
    let acc = 0, m = Infinity, em = null;
    for (let s = 1; s < linha.length; s++) {
      const am = amostrasSeg(linha[s - 1], linha[s]); const passo = hav(linha[s - 1], linha[s]) / Math.max(1, am.length - 1);
      for (let k = 0; k < am.length; k++) { const pos = acc + k * passo; if (segP.has(s) || pos < PONTA_KM || pos > total - PONTA_KM) continue; const d = folgaKmEm(am[k][0], am[k][1]); if (d < m) { m = d; em = am[k].map((x) => Math.round(x * 100) / 100); } }
      acc += hav(linha[s - 1], linha[s]);
    }
    return { km: m === Infinity ? null : Math.round(m * 10) / 10, em };
  }

  // Afastar da terra (leva 3): a grade de 0,1° não acha o meio de um estreito de 14 km (Gibraltar). Onde
  // um segmento passa a menos de D_ALISA km da terra, ganha um vértice no ponto mais perto dela; cada
  // vértice interno (fora das pontas e dos portões) é então deslocado, num disco de até ~20 km, para a
  // posição que maximiza a menor folga dos dois segmentos vizinhos (teto D_ALVO), sem cruzar terra e com
  // um pequeno custo por km a mais. Quatro voltas. Ignora a folga nos primeiros PONTA_KM km das pontas
  // fixas (a rota nasce no porto) e junto aos extremos de portão (que são portos).
  const livre = (a, b) => { for (const p of amostrasSeg(a, b)) { if (finaEm(p[0], p[1])) return false; if (folgaKmEm(p[0], p[1]) < 8 && naTerraVetor(p)) return false; } return true; };
  function minSeg(a, b, ignoraA, ignoraB) {
    const am = amostrasSeg(a, b); const L = hav(a, b); let m = Infinity, em = -1;
    for (let k = 0; k < am.length; k++) { const pos = (k / Math.max(1, am.length - 1)) * L; if ((ignoraA && pos < PONTA_KM) || (ignoraB && L - pos < PONTA_KM)) continue; const d = folgaKmEm(am[k][0], am[k][1]); if (d < m) { m = d; em = k; } }
    return { m, p: em >= 0 ? am[em] : null, t: em >= 0 ? em / Math.max(1, am.length - 1) : 0 };
  }
  const DIRS = Array.from({ length: 16 }, (_, a) => [Math.cos((a * Math.PI) / 8), Math.sin((a * Math.PI) / 8)]);
  const RAIOS = [0.7, 1.5, 2.5, 4, 6, 9, 13, 18];
  function afastar(linha, fixo) {
    for (let volta = 0; volta < 4; volta++) {
      // 1) vértice novo no ponto mais perto da terra de cada segmento estreito
      for (let s = 1; s < linha.length; s++) {
        if (fixo[s - 1] === 'portao' && fixo[s] === 'portao') continue; // o próprio portão
        const r = minSeg(linha[s - 1], linha[s], s === 1 || fixo[s - 1] === 'portao', s === linha.length - 1 || fixo[s] === 'portao');
        if (!r.p || r.m >= D_ALISA) continue;
        const L = hav(linha[s - 1], linha[s]); if (r.t * L < 3 || (1 - r.t) * L < 3) continue;
        linha.splice(s, 0, [r2(r.p[0]), r2(r.p[1])]); fixo.splice(s, 0, false); s++;
      }
      // 2) cada vértice livre vai para onde a menor folga dos dois segmentos é maior
      let moveu = 0;
      for (let v = 1; v < linha.length - 1; v++) {
        if (fixo[v]) continue;
        const a = linha[v - 1], b = linha[v + 1]; const iA = v - 1 === 0 || fixo[v - 1] === 'portao', iB = v + 1 === linha.length - 1 || fixo[v + 1] === 'portao';
        const nota = (p) => { const m = Math.min(minSeg(a, p, iA, false).m, minSeg(p, b, false, iB).m, folgaKmEm(p[0], p[1])); return Math.min(m, D_ALVO) - 0.05 * (hav(a, p) + hav(p, b)); };
        const atual = nota(linha[v]); const m0 = Math.min(minSeg(a, linha[v], iA, false).m, minSeg(linha[v], b, false, iB).m);
        if (m0 >= D_ALISA) continue;
        let melhor = null, nm = atual + 0.3;
        for (const rr of RAIOS) for (const [dx, dy] of DIRS) {
          const p = [r2(linha[v][0] + (rr * 0.009 * dx) / Math.cos(linha[v][1] * rad)), r2(linha[v][1] + rr * 0.009 * dy)];
          if (finaEm(p[0], p[1])) continue;
          const n = nota(p); if (n <= nm) continue;
          if (!livre(a, p) || !livre(p, b)) continue;
          melhor = p; nm = n;
        }
        if (melhor) { linha[v] = melhor; moveu++; }
      }
      if (!moveu) break;
    }
    // Endireitar: o deslocamento pode deixar zigue-zague (vértices vizinhos empurrados para lados
    // opostos de uma ilhota). Tira o vértice livre quando a reta entre os vizinhos não cruza terra e
    // não perde folga: a menor folga da reta fica a até 0,5 km da menor dos dois segmentos (teto D_ALVO).
    for (let mudou = true, guarda = 0; mudou && guarda < 20; guarda++) {
      mudou = false;
      for (let v = 1; v < linha.length - 1; v++) {
        if (fixo[v] || (fixo[v - 1] === 'portao' && fixo[v + 1] === 'portao')) continue;
        const a = linha[v - 1], b = linha[v + 1]; const iA = v - 1 === 0 || fixo[v - 1] === 'portao', iB = v + 1 === linha.length - 1 || fixo[v + 1] === 'portao';
        if (hav(a, b) > SEG_MAX_KM || !livre(a, b)) continue;
        const antes = Math.min(minSeg(a, linha[v], iA, false).m, minSeg(linha[v], b, false, iB).m, D_ALVO);
        const depois = Math.min(minSeg(a, b, iA, iB).m, D_ALVO);
        if (antes >= D_ALISA || depois < antes - 0.5) continue; // só onde há terra perto: no mar aberto, o alisamento já decidiu
        linha.splice(v, 1); fixo.splice(v, 1); v--; mudou = true;
      }
    }
  }

  function rotear(ancora, destinos) {
    const [ini, dIni] = marMaisPerto(ancora, 400, 1);
    if (ini < 0) throw new Error(`sem mar perto de ${ancora}`);
    const alvos = new Map(); const aneis = {};
    for (const d of destinos) { const { alvo, anel } = costa(d.n3); aneis[d.id] = anel; for (const c of alvo) alvos.set(c, [...(alvos.get(c) ?? []), d.id]); }
    for (let volta = 0; ; volta++) {
    const t = Date.now();
    // Onde a rota termina (leva 4): no trecho de costa do país mais próximo PELO MAR em km. O custo da
    // folga escolhe o caminho, não o destino (com ele, a Rússia terminava no mar de Barents porque os
    // estreitos dinamarqueses ficavam "caros").
    const fimKm = dijkstra(ini, alvos, { soKm: true });
    const kmAte = {}; const viaCabo = new Set();
    for (const d of destinos) {
      const u = fimKm[d.id]; if (u === undefined) continue; kmAte[d.id] = dist[u];
      // passa ao sul da África (o Cabo)? candidata ao teste do Suez
      for (let x = u; x !== -1; x = prev[x]) { const lat = latDe((x / W) | 0), lon = lonDe(x % W); if (lat < -30 && lon > 12 && lon < 35) { viaCabo.add(d.id); break; } }
    }
    const contorno = {};
    if (SUEZ && viaCabo.size) {
      const fimS = dijkstra(ini, alvos, { soKm: true, extra: [[SUEZ.a, SUEZ.b, SUEZ.km]] });
      for (const id of viaCabo) { const u = fimS[id]; if (u !== undefined && dist[u] < kmAte[id] * 0.97) contorno[id] = 'Dá a volta pela África: pelo Canal de Suez a costa deste país ficaria mais perto, mas o canal não tem portão com fonte nos dados usados (a camada de portos do Natural Earth não traz a ponta sul).'; }
    }
    const alvos1 = new Map(); for (const d of destinos) { const u = fimKm[d.id]; if (u !== undefined) alvos1.set(u, [...(alvos1.get(u) ?? []), d.id]); }
    const fim = dijkstra(ini, alvos1); const ms = Date.now() - t;
    const saida = {}; const atravessados = new Set();
    for (const d of destinos) {
      const u = fim[d.id]; if (u === undefined) { saida[d.id] = null; continue; }
      // reconstrói: células e saltos de portão
      const cel = []; const portaoAntes = []; // portaoAntes[k] = índice do portão usado para CHEGAR em cel[k]
      for (let x = u; x !== -1; x = prev[x]) { cel.push(x); portaoAntes.push(viaPortao[x]); }
      cel.reverse(); portaoAntes.reverse();
      // divide em trechos de mar separados pelos portões
      const trechos = [[]]; const usados = [];
      for (let k = 0; k < cel.length; k++) {
        if (portaoAntes[k] >= 0) { const g = PORTOES[portaoAntes[k]]; const ida = g.a === cel[k - 1]; usados.push({ g, pts: ida ? [g.extremos[0].lonlat, g.extremos[1].lonlat] : [g.extremos[1].lonlat, g.extremos[0].lonlat] }); trechos.push([]); }
        trechos[trechos.length - 1].push(cel[k]);
      }
      let linha = []; const segPortao = new Set();
      trechos.forEach((tr, k) => {
        const P = desenrolar(tr.map((c) => [lonDe(c % W), latDe((c / W) | 0)])); const D = tr.map((c) => dCel[c]);
        const A = alisar(P, D);
        if (k > 0) { const g = usados[k - 1]; const base = linha.length; linha.push(...g.pts); segPortao.add(base); segPortao.add(base + 1); }
        linha.push(...A);
      });
      const ehExtremo = linha.map((_, k) => segPortao.has(k));
      linha = desenrolar(linha).map(([x, y]) => [r2(x), r2(y)]);
      reparar(linha, ehExtremo);
      const fixo = linha.map((_, k) => (ehExtremo[k] ? 'portao' : k === 0 || k === linha.length - 1));
      afastar(linha, fixo);
      // vértices repetidos (o deslocamento arredonda a 0,01° e pode cair no vizinho): fora
      for (let k = linha.length - 1; k > 0; k--) if (linha[k][0] === linha[k - 1][0] && linha[k][1] === linha[k - 1][1]) { const fk = fixo[k] || fixo[k - 1]; linha.splice(k, 1); fixo.splice(k, 1); fixo[k - 1] = fixo[k - 1] === "portao" || fk === "portao" ? "portao" : fk; }
      const ehExtremo2 = fixo.map((x) => x === "portao"); ehExtremo.length = 0; ehExtremo.push(...ehExtremo2);
      reparar(linha, ehExtremo);
      // segmento de portão: do mar ao 1º extremo, entre os extremos e do 2º ao mar
      const segP = new Set(); for (let s = 1; s < linha.length; s++) if (ehExtremo[s - 1] || ehExtremo[s]) segP.add(s);
      let km = 0; for (let k = 1; k < linha.length; k++) km += hav(linha[k - 1], linha[k]);
      const st = sobreTerra(linha, segP);
      const ultimo = linha[linha.length - 1]; let cheg = Infinity; for (const q of aneis[d.id]) cheg = Math.min(cheg, hav(ultimo, q));
      const fm = folgaMinima(linha, segP);
      saida[d.id] = { linha, folgaMinKm: fm.km, folgaMinEm: fm.em, km: Math.round(km), ligacaoKm: Math.round(dIni), chegadaKm: Math.round(cheg), sobreTerraKm: Math.round(st.km * 10) / 10, trechosSobreTerra: st.trechos, portoes: usados.map((x) => x.g.id), ...(contorno[d.id] ? { contorno: contorno[d.id] } : {}), msBusca: ms, celulas: cel.length, voltas: volta + 1 };
      for (const q of st.atravessados) atravessados.add(q);
    }
    // rota que atravessou polígono: engrossa esse polígono na grade fina e refaz a busca desta origem
    let mudou = false; for (const q of atravessados) if (engrossar(q)) mudou = true;
    if (!mudou || volta >= 4) return saida;
    log(`roteador: ${[...atravessados].length} polígono(s) atravessado(s) a partir de ${ancora}; engrossados, refazendo`);
    }
  }

  return {
    rotear, reparar, primeiroEmTerra, naTerraVetor, folgaKmEm, folgaMinima,
    PORTOES,
    terra, oceano, folga, W, H, R,
    fonte: (acessoNE, sha256NE) => ({
      orgao: 'NIVAR (roteador próprio) sobre o Natural Earth',
      conjunto: 'Rotas marítimas esquemáticas: caminho mínimo numa grade de mar de 0,1° tirada dos países e das ilhas pequenas do Natural Earth 10m, com folga da costa',
      endereco: 'tools/alexandria-atlas/comercio/roteador.mjs (terra: https://unpkg.com/world-atlas@2.0.2/countries-10m.json)',
      acesso: acessoNE,
      sha256: sha256NE,
      ilhas: 'Natural Earth 10m, ilhas pequenas (ne_10m_minor_islands, versão 5.1.2; manifesto: comercio-natural-earth-ilhas-10m): terra extra, sem fechar estreito',
      licenca: 'Natural Earth: domínio público. Rotas calculadas pela NIVAR, sem dever de licença.',
      grade: `busca em ${R}° (${W} × ${H}); terra testada em ${FR.toFixed(4)}°; fechado ao sul de ${-SUL_TERRA}° S e ao norte de ${NORTE_TERRA}° N`,
      escolhasDeModelo: `folga da costa: custo × até ${1 + PEN_COSTA} rente à terra, caindo em curva quadrática até 1 a ${D_ALVO} km dela (em mar aberto a rota corre a dezenas de km da costa; num estreito, pelo meio do canal); o alisamento exige em cada ponto da reta a folga de min(${D_ALISA} km, a folga que o caminho da grade tinha ali) × ${String(FOLGA_TOL).replace(".", ",")}; custo × até ${1 + PEN_SUL} entre ${-SUL_PREF}° S e ${-SUL_PREF + 10}° S; segmentos retos em Mercator de até ${SEG_MAX_KM} km`,
      destino: 'A rota termina na célula de mar, vizinha do maior polígono do país, mais próxima da origem pelo mar em km (busca só de distância, com o portão do Panamá). O custo da folga e do mar do Sul decide o caminho até ela, não o destino.',
      contorno: SUEZ ? `Teste do Suez, nunca desenhado: Port Said (camada de portos do Natural Earth) ligado à célula de mar mais ao norte do golfo de Suez na grade (${lonDe(SUEZ.b % W).toFixed(2)}° E, ${latDe((SUEZ.b / W) | 0).toFixed(2)}° N), ${Math.round(SUEZ.km)} km em reta. Rota que passa ao sul da África e cuja costa de destino ficaria 3% ou mais perto com essa ligação ganha o campo "contorno".` : 'sem teste do Suez (Port Said ou o golfo de Suez fora da grade)',
      portoes: PORTOES.map((g) => ({ id: g.id, nome: g.nome, extremos: g.extremos.map((e) => ({ nome: e.nome, lonlat: e.lonlat })), fonte: g.fonte })),
      semPortao: 'Suez: a camada de portos do Natural Earth 10m traz Port Said, mas não a ponta sul do canal; sem as duas pontas com fonte não há portão, e rota que usaria Suez contorna a África (é o caso da rota para a Arábia Saudita, que entra no Mar Vermelho pelo sul). Bósforo e Kiel: sem portão (nenhuma rota precisa do Mar Negro; o Báltico se alcança pelos estreitos dinamarqueses).',
    }),
    leia: () => [
      `Toda rota é esquemática: traçado ilustrativo, não o caminho dos navios. Começa no mar mais perto da unidade de despacho (a grade não sobe o Amazonas nem entra na Lagoa dos Patos) e termina no trecho de costa do país mais próximo pelo mar, contado em quilômetros, porque o dado não diz o porto. Entre as duas pontas, é o caminho mais curto por mar numa grade de 0,1° tirada do Natural Earth 10m (países e ilhas pequenas), evitando passar a menos de ${D_ALVO} km da terra (em mar aberto a rota corre ao largo; num estreito, pelo meio do canal) e o mar do Sul (abaixo de 38° S); fechada ao sul de 50° S e no Ártico.`,
      `Canais: ${PORTOES.map((g) => g.nome).join(', ')}, desenhado como reta entre os dois portos dos extremos (camada de portos do Natural Earth). Suez não tem portão, porque a camada não traz a ponta sul do canal: a rota que o usaria dá a volta pela África, e a ficha dela diz isso. O comprimento das rotas sai arredondado a centenas de km, e a distância à terra é medida contra o Natural Earth (a base do mapa tem costa mais fina).`,
    ],
  };
}
