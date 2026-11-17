// Procura um ativo nos dados do Atlas e devolve o identificador que as vistas
// usam, com a posição. Serve para montar vistas sem digitar coordenada.
//
//   node tools/alexandria-atlas/buscar.mjs usina sobradinho
//   node tools/alexandria-atlas/buscar.mjs usina "belo monte" --uf PA
//   node tools/alexandria-atlas/buscar.mjs linha "xingu" [--kv 800]
//   node tools/alexandria-atlas/buscar.mjs subestacao "tijuco preto"
//   node tools/alexandria-atlas/buscar.mjs reservatorio furnas
//   node tools/alexandria-atlas/buscar.mjs bacia "sao francisco"
//   node tools/alexandria-atlas/buscar.mjs submercado NE
//   node tools/alexandria-atlas/buscar.mjs pais alemanha
//   node tools/alexandria-atlas/buscar.mjs gasoduto gasbol
//   node tools/alexandria-atlas/buscar.mjs refinaria replan        (também: gnl, upgn, terminal)
//   node tools/alexandria-atlas/buscar.mjs campo tupi [--uf ...]   (campo de produção; também: bloco)
//   node tools/alexandria-atlas/buscar.mjs bacia-sedimentar santos
//   node tools/alexandria-atlas/buscar.mjs presal ""
//   node tools/alexandria-atlas/buscar.mjs distribuidora "enel sp"   (ou pelo código ANEEL: distribuidora 390)
//   node tools/alexandria-atlas/buscar.mjs limites usina:UHE.PH.BA.002755-3.1 linha:PAXG--8ETR-1 submercado:NE
//       → caixa [oeste, sul, leste, norte] que contém todos, com folga de 12%
//
// A busca ignora acento e caixa. Sai em JSON, uma linha por resultado.

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DADOS = join(RAIZ, 'public', 'alexandria', 'atlas', 'dados');
const J = async (p) => JSON.parse(await readFile(p, 'utf8'));
const plano = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const args = process.argv.slice(2);
const opc = {};
const livres = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) opc[args[i].slice(2)] = args[++i];
  else livres.push(args[i]);
}
const [tipo, ...resto] = livres;
const termo = plano(resto.join(' '));

async function usinas() {
  const saida = [];
  for (const arq of ['usinas-principais.json', 'usinas-menores.json']) {
    const c = await J(join(DADOS, arq));
    for (let i = 0; i < c.n; i++)
      saida.push({ ceg: c.ceg[i], nome: c.nome[i], uf: c.uf[i], mun: c.mun[i], tipo: c.tipos[c.tipo[i]], cat: c.categorias[c.cat[i]], comb: c.combustiveis[c.comb[i]], kw: c.kw[i], fase: c.fases[c.fase[i]], ano: c.ano[i], lon: c.lon[i], lat: c.lat[i] });
  }
  return saida;
}

function caixaDe(geom, acc) {
  const visita = (c) => {
    if (typeof c[0] === 'number') {
      acc[0] = Math.min(acc[0], c[0]);
      acc[1] = Math.min(acc[1], c[1]);
      acc[2] = Math.max(acc[2], c[0]);
      acc[3] = Math.max(acc[3], c[1]);
    } else c.forEach(visita);
  };
  visita(geom.coordinates);
  return acc;
}

const r2 = (n) => Math.round(n * 100) / 100;

async function paises() {
  // tabela numérico → [alpha-3, alpha-2] do worldApi + geometria Natural Earth
  const fonte = await readFile(join(RAIZ, 'src', 'lib', 'atlas', 'worldApi.ts'), 'utf8');
  const tabela = {};
  for (const m of fonte.matchAll(/'(\d{3})':\s*\['([A-Z]{3})',\s*'([A-Z]{2})'\]/g)) tabela[m[1]] = [m[2], m[3]];
  const topo = await J(join(RAIZ, 'public', 'alexandria', 'geo', 'world-110m.json'));
  const nomes = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
  // decodifica só o necessário: caixa de cada país a partir dos arcos
  const { scale, translate } = topo.transform;
  const arcos = topo.arcs.map((a) => {
    let x = 0;
    let y = 0;
    return a.map(([dx, dy]) => [(x += dx) * scale[0] + translate[0], (y += dy) * scale[1] + translate[1]]);
  });
  const saida = [];
  for (const g of topo.objects.countries.geometries) {
    const par = tabela[g.id];
    if (!par) continue;
    const acc = [180, 90, -180, -90];
    const visita = (a) => {
      if (typeof a === 'number') {
        for (const [x, y] of arcos[a < 0 ? ~a : a]) {
          acc[0] = Math.min(acc[0], x);
          acc[1] = Math.min(acc[1], y);
          acc[2] = Math.max(acc[2], x);
          acc[3] = Math.max(acc[3], y);
        }
      } else a.forEach(visita);
    };
    visita(g.arcs);
    saida.push({ a3: par[0], nome: nomes.of(par[1]), nomeEn: g.properties?.name ?? null, caixa: acc.map(r2) });
  }
  return saida;
}

async function colecao(tipoAtivo) {
  switch (tipoAtivo) {
    case 'usina':
      return (await usinas()).map((u) => ({ chave: u.ceg, nome: u.nome, ...u, caixa: [u.lon, u.lat, u.lon, u.lat] }));
    case 'linha':
      return (await J(join(DADOS, 'rede-linhas.geojson'))).features.map((f) => ({ chave: f.properties.id, nome: f.properties.n, ...f.properties, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    case 'subestacao':
      return (await J(join(DADOS, 'rede-subestacoes.geojson'))).features.map((f) => ({ chave: f.properties.id, nome: f.properties.n, ...f.properties, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    case 'reservatorio':
      return (await J(join(DADOS, 'agua-reservatorios.geojson'))).features.map((f) => ({ chave: f.properties.cod, nome: f.properties.n, ...f.properties, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    case 'bacia':
      return (await J(join(DADOS, 'agua-bacias.geojson'))).features.map((f) => ({ chave: f.properties.Nome_Bacia, nome: f.properties.Nome_Bacia, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    case 'submercado': {
      const SIGLA = { sudesteCentroOeste: 'SE', sul: 'S', nordeste: 'NE', norte: 'N' };
      return (await J(join(DADOS, 'submercados.geojson'))).features.map((f) => ({ chave: SIGLA[f.properties.id], nome: f.properties.nome, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    }
    case 'pais':
      return (await paises()).map((p) => ({ chave: p.a3, ...p }));
    // ── gás e petróleo (ANP) ──
    case 'gasoduto':
      return (await J(join(DADOS, 'combustivel-gasodutos.geojson'))).features.map((f) => ({ chave: f.properties.id, nome: `${f.properties.duto} · ${f.properties.trecho ?? ''}`, ...f.properties, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    case 'refinaria':
    case 'gnl':
    case 'upgn':
    case 'terminal':
      return (await J(join(DADOS, 'combustivel-instalacoes.geojson'))).features
        .filter((f) => f.properties.tipo === tipoAtivo)
        .map((f) => ({ chave: f.properties.id, ...f.properties, nome: `${f.properties.nome}${f.properties.sigla ? ` (${f.properties.sigla})` : ''}`, lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], caixa: [...f.geometry.coordinates, ...f.geometry.coordinates] }));
    case 'campo':
      return (await J(join(DADOS, 'combustivel-campos.geojson'))).features.map((f) => ({ chave: f.properties.id, ...f.properties, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    case 'bloco':
      return (await J(join(DADOS, 'combustivel-blocos.geojson'))).features.map((f) => ({ chave: f.properties.id, ...f.properties, nome: `${f.properties.nome} ${f.properties.fantasia ?? ''}`, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    case 'bacia-sedimentar':
      return (await J(join(DADOS, 'combustivel-bacias.geojson'))).features.map((f) => ({ chave: f.properties.id, ...f.properties, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    case 'presal':
      return (await J(join(DADOS, 'combustivel-presal.geojson'))).features.map((f) => ({ chave: 'presal', nome: 'Polígono do pré-sal', caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    // ── distribuição (ANEEL · BDGD · ARAT): chave = código ANEEL da distribuidora ──
    case 'distribuidora':
      return (await J(join(DADOS, 'distribuicao-areas.geojson'))).features.map((f) => ({ chave: String(f.properties.codigo), ...f.properties, caixa: caixaDe(f.geometry, [180, 90, -180, -90]).map(r2) }));
    default:
      throw new Error(`tipo desconhecido: ${tipoAtivo}`);
  }
}

if (tipo === 'limites') {
  const acc = [180, 90, -180, -90];
  const porTipo = {};
  for (const ref of resto) {
    const i = ref.indexOf(':');
    (porTipo[ref.slice(0, i)] ||= []).push(ref.slice(i + 1));
  }
  const faltam = [];
  for (const [t, chaves] of Object.entries(porTipo)) {
    const col = await colecao(t);
    for (const k of chaves) {
      const a = col.find((x) => x.chave === k);
      if (!a) {
        faltam.push(`${t}:${k}`);
        continue;
      }
      acc[0] = Math.min(acc[0], a.caixa[0]);
      acc[1] = Math.min(acc[1], a.caixa[1]);
      acc[2] = Math.max(acc[2], a.caixa[2]);
      acc[3] = Math.max(acc[3], a.caixa[3]);
    }
  }
  // folga de 12% e tamanho mínimo de 0,6° (um ponto sozinho não vira zoom infinito)
  const lx = Math.max(acc[2] - acc[0], 0.6);
  const ly = Math.max(acc[3] - acc[1], 0.6);
  const cx = (acc[0] + acc[2]) / 2;
  const cy = (acc[1] + acc[3]) / 2;
  console.log(JSON.stringify({ limites: [r2(cx - lx * 0.62), r2(cy - ly * 0.62), r2(cx + lx * 0.62), r2(cy + ly * 0.62)], naoEncontrados: faltam }));
} else {
  let col = await colecao(tipo);
  col = col.filter((a) => plano(a.nome).includes(termo) || plano(a.chave) === termo || plano(a.nomeEn).includes(termo && termo.length > 3 ? termo : '\u0000'));
  if (opc.uf) col = col.filter((a) => plano(a.uf).includes(plano(opc.uf)));
  if (opc.kv) col = col.filter((a) => String(a.kv) === String(opc.kv));
  if (tipo === 'usina') col.sort((a, b) => b.kw - a.kw);
  for (const a of col.slice(0, Number(opc.max ?? 25))) console.log(JSON.stringify(a));
  if (col.length > Number(opc.max ?? 25)) console.log(`… mais ${col.length - Number(opc.max ?? 25)} (use --max N, --uf XX ou um termo mais específico)`);
  if (!col.length) console.log('nenhum resultado');
}
