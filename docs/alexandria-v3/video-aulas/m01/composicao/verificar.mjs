// verificar.mjs — confere que cada trecho citado em roteiros.mjs existe, literal,
// no arquivo-fonte, e devolve a linha. Sai com código 1 se algum não bater.
// Uso (da raiz do repositório): node docs/alexandria-v3/video-aulas/m01/composicao/verificar.mjs
import fs from 'node:fs';
import { AULAS } from './roteiros.mjs';

import { resolver, PROIBIDO, residuo } from './verificar-lib.mjs';

let falhas = 0;
for (const a of AULAS) {
  const t = resolver(a.tituloSrc);
  if (!t.ok) { falhas++; console.log(`A0${a.n} título: NÃO ACHADO`); }
  for (const b of a.blocos) {
    for (const s of b.src) {
      const r = resolver(s);
      if (!r.ok) { falhas++; console.log(`A0${a.n} ${b.id}: NÃO ACHADO → ${s[2].slice(0, 90)}`); }
    }
    const sobra = residuo(b);
    if (sobra) console.log(`A0${a.n} ${b.id} (${b.tipo}): fora dos trechos citados → "${sobra}"`);
    if (sobra && b.tipo === 'fonte') { falhas++; console.log('  ↑ bloco marcado como fonte literal não pode ter sobra'); }
    for (const re of PROIBIDO) if (re.test(b.fala) || re.test(b.leg)) { falhas++; console.log(`A0${a.n} ${b.id}: termo proibido ${re}`); }
  }
}
const chars = AULAS.map((a) => a.blocos.reduce((s, b) => s + b.fala.length + 1, 0));
console.log('caracteres de fala por aula:', chars.join(' · '), '· total', chars.reduce((x, y) => x + y));
console.log(falhas ? `${falhas} falha(s)` : 'todas as citações conferem');

// Letreiros configurados nas cenas: cada fragmento (separado por " · ", "—" ou "[…]")
// tem de existir, literal (sem diferença de caixa), no conteúdo do M01 ou na extração.
const nl = (s) => s.toLowerCase().replace(/\\"/g, '"').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const BASE = nl(fs.readFileSync('src/lib/data/alexandria-modulo-01-content.ts', 'utf8'));
const XB = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => [n, nl(fs.readFileSync(`docs/alexandria-v2/extraction/m01/aula-0${n}.json`, 'utf8'))]));
const DESCRITIVOS = new Set(['solar', 'eólica', 'hidrelétrica', 'térmica', 'alta tensão', 'baixa tensão', 'kw', 'kwh', 'kvar', 'dec', 'fec', '']);
let avisos = 0;
for (const a of AULAS) for (const b of a.blocos) {
  const c = b.cena; const textos = [];
  for (const k of ['apoio', 'frase', 'eq', 'sub', 'errado']) if (c[k]) textos.push(c[k]);
  for (const k of ['itens', 'linhas', 'texto']) if (c[k]) c[k].flat().forEach((x) => textos.push(x));
  for (const k of ['certos', 'eqs']) if (c[k]) c[k].forEach((x) => textos.push(x));
  for (const t of textos) for (let f of String(t).split(/ · |—|\[…\]/)) {
    f = nl(f).trim().replace(/^[\s,.:;]+|[\s,.:;]+$/g, '');
    if (DESCRITIVOS.has(f) || /^[\d\s·.,]+kv$/.test(f)) continue;
    const alt = f.replace('i²', 'i 2');
    if (!BASE.includes(f) && !BASE.includes(alt) && !XB[a.n].includes(f)) { avisos++; console.log(`A0${a.n} ${b.id} letreiro fora da fonte: "${f}"`); }
  }
}
console.log(avisos ? `${avisos} letreiro(s) a revisar` : 'letreiros de cena: todos literais');
process.exit(falhas ? 1 : 0);
