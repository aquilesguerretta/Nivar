// Pares cegos X/Y genéricos. Uso: node build-blind-gen.mjs <capDir> <round> <pairs.json>
// pairs.json: [[{file, name}, {file, name}], ...]; caminhos relativos a docs/alexandria-v2/.
// O mapeamento fica no scratchpad (fora do worktree).
import fs from 'node:fs';
import path from 'node:path';

const [capDir, round, pairsFile] = process.argv.slice(2);
const DOCS = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2';
const OUT = `${DOCS}/captures/${capDir}/${round}/blind`;
const MAP = `C:/Users/aquil/AppData/Local/Temp/claude/C--dev/9c5a79fb-f118-4054-8d26-9cede07ac0c2/scratchpad/piece${capDir}-${round}-blind-mapping.json`;
const pairs = JSON.parse(fs.readFileSync(pairsFile, 'utf8')).map((pair) =>
  pair.map((p) => ({ ...p, file: path.isAbsolute(p.file) ? p.file : `${DOCS}/${p.file.replaceAll('{round}', round)}` })),
);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const mapping = {};
pairs.forEach(([a, b], i) => {
  for (const f of [a.file, b.file]) if (!fs.existsSync(f)) throw new Error(`falta ${f}`);
  const [x, y] = Math.random() < 0.5 ? [b, a] : [a, b];
  const k = `pair${i + 1}`;
  fs.copyFileSync(x.file, path.join(OUT, `${k}-X.png`));
  fs.copyFileSync(y.file, path.join(OUT, `${k}-Y.png`));
  mapping[k] = { X: x.name.replaceAll('{round}', round), Y: y.name.replaceAll('{round}', round) };
});
fs.writeFileSync(MAP, JSON.stringify(mapping, null, 1));
console.log(JSON.stringify({ out: OUT, pairs: pairs.length, mapping }));
