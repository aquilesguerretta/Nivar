// Monta pares cegos X/Y para o Craft critic. Uso: node build-blind.mjs <rodada> (ex.: r02)
// O mapeamento fica FORA do worktree (scratchpad), para o critic cego não encontrá-lo.
import fs from 'node:fs';
import path from 'node:path';

const ROUND = process.argv[2];
if (!ROUND) throw new Error('rodada obrigatória');
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2';
const CAP = `${WT}/captures/A`;
const OUT = `${CAP}/${ROUND}/blind`;
const MAP = `C:/Users/aquil/AppData/Local/Temp/claude/C--dev/9c5a79fb-f118-4054-8d26-9cede07ac0c2/scratchpad/pieceA-${ROUND}-blind-mapping.json`;

const cur = (f) => ({ file: `${CAP}/${ROUND}/${f}`, name: `render ${ROUND} ${f.replace('.png', '')}` });
const pairs = [
  [cur('home-E2-1440.png'), { file: `${WT}/captures/reference/north-star-home-panel.png`, name: 'North Star (painel Home)' }],
  [cur('home-E0-1440.png'), { file: `${WT}/captures/reference/north-star-home-panel.png`, name: 'North Star (painel Home)' }],
  [cur('home-E2-1440.png'), { file: `${WT}/captures/reference/atlas-current-E0-1440.png`, name: 'Atlas atual' }],
  [cur('home-E2-1440.png'), { file: `${CAP}/r00-baseline/home-E2-1440.png`, name: 'baseline r00 home-E2-1440' }],
  [cur('home-E2-390.png'), { file: `${CAP}/r00-baseline/home-E2-390.png`, name: 'baseline r00 home-E2-390' }],
];
const prev = ROUND === 'r02' ? 'r01' : `r${String(Number(ROUND.slice(1)) - 1).padStart(2, '0')}`;
if (fs.existsSync(`${CAP}/${prev}/home-E2-1440.png`)) {
  pairs.push([cur('home-E2-1440.png'), { file: `${CAP}/${prev}/home-E2-1440.png`, name: `render ${prev} home-E2-1440 (rodada anterior)` }]);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const mapping = {};
pairs.forEach(([a, b], i) => {
  for (const f of [a.file, b.file]) if (!fs.existsSync(f)) throw new Error(`falta ${f}`);
  const swap = Math.random() < 0.5;
  const [x, y] = swap ? [b, a] : [a, b];
  const k = `pair${i + 1}`;
  fs.copyFileSync(x.file, path.join(OUT, `${k}-X.png`));
  fs.copyFileSync(y.file, path.join(OUT, `${k}-Y.png`));
  mapping[k] = { X: x.name, Y: y.name };
});
fs.writeFileSync(MAP, JSON.stringify(mapping, null, 1));
console.log(JSON.stringify({ out: OUT, pairs: Object.keys(mapping).length, map: MAP }));
