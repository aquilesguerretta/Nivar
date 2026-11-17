// Menor distância rota–terra por rota marítima (km), contra a terra do Natural Earth 10m na grade fina
// do roteador, fora dos primeiros e últimos 50 km e fora dos segmentos de portão de canal.
//
//   node --max-old-space-size=6000 tools/alexandria-atlas/comercio/medir-folga.mjs [--antes <comercio-antigo.json>] [--json <saida.json>]
//
// Com --antes, mede também o arquivo antigo pela MESMA régua e imprime lado a lado. É medida contra o
// Natural Earth: a base do Mapbox tem costa mais fina (ilhotas, pontas), então a prova final é a captura
// de perto no mapa.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { criarRoteador, hav } from './roteador.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..', '..');
const A = process.argv.slice(2);
const opt = (n) => (A.includes(n) ? A[A.indexOf(n) + 1] : null);
const rot = criarRoteador({ bruto: join(AQUI, '..', 'bruto', 'comercio') });
const extremos = rot.PORTOES.flatMap((g) => g.extremos.map((e) => e.lonlat));
const segPortao = (linha) => { const s = new Set(); for (let k = 1; k < linha.length; k++) { const perto = (p) => extremos.some((e) => hav(p, e) < 2 || hav([p[0] - 360, p[1]], e) < 2 || hav([p[0] + 360, p[1]], e) < 2); if (perto(linha[k - 1]) || perto(linha[k])) s.add(k); } return s; };
const medir = (arq) => { const d = JSON.parse(readFileSync(arq, 'utf8')); const o = {}; for (const [k, r] of Object.entries(d.rotas)) { if (!r || r.via !== 'marítima') continue; o[k] = rot.folgaMinima(r.linha, segPortao(r.linha)); } return o; };
const depois = medir(join(RAIZ, 'public/alexandria/atlas/dados/comercio-2025.json'));
const antes = opt('--antes') ? medir(opt('--antes')) : null;
const linhas = Object.keys(depois).sort((a, b) => (depois[a].km ?? 1e9) - (depois[b].km ?? 1e9));
const f = (x) => (x == null ? '—' : String(x).replace('.', ',').padStart(6));
console.log(`rota${' '.repeat(12)}${antes ? 'antes km  ' : ''}depois km  onde (depois)`);
for (const k of linhas) console.log(`${k.padEnd(16)}${antes ? `${f(antes[k]?.km)}    ` : ''}${f(depois[k].km)}    ${JSON.stringify(depois[k].em)}${antes ? `   antes em ${JSON.stringify(antes[k]?.em)}` : ''}`);
const resumo = (o) => { const v = Object.values(o).map((x) => x.km).filter((x) => x != null).sort((a, b) => a - b); return { n: v.length, min: v[0], mediana: v[Math.floor(v.length / 2)], abaixoDe10: v.filter((x) => x < 10).length, abaixoDe20: v.filter((x) => x < 20).length }; };
console.log('depois:', JSON.stringify(resumo(depois)));
if (antes) console.log('antes: ', JSON.stringify(resumo(antes)));
if (opt('--json')) writeFileSync(opt('--json'), JSON.stringify({ antes, depois }, null, 1));
