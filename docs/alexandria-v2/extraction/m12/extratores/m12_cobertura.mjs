// Cobertura por token: o texto visível de cada seção de aparato (e do hero, rodapé,
// markup dos instrumentos e questões do quiz) precisa estar coberto pelas strings
// dos três JSONs. Multiconjunto de palavras (≥2 letras, minúsculas). Grava
// verificacao.json junto com o relatório de literalidade de m12_verify.mjs.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { html, texto, section, OUTDIR, scriptBlock, scriptVar, lineOf } from './m12_lib.mjs';

const toks = (s) => (s.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}ºª.,%-]*[\p{L}\p{N}%]|[\p{L}]{2,}/gu) || [])
  .map((t) => t.replace(/[.,]+$/, '')).filter((t) => t.length >= 2);
const bag = (arr) => { const m = new Map(); for (const t of arr) m.set(t, (m.get(t) || 0) + 1); return m; };

const pool = [];
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  (function walk(o) {
    if (Array.isArray(o)) return o.forEach(walk);
    if (o && typeof o === 'object') return Object.values(o).forEach(walk);
    if (typeof o === 'string') pool.push(texto(o));
  })(JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8')));
}
const poolBag = bag(toks(pool.join(' \n ')));

const cover = (src) => {
  const b = bag(toks(src)); let total = 0, ok = 0; const falt = [];
  for (const [t, n] of b) { total += n; const have = Math.min(n, poolBag.get(t) || 0); ok += have; if (have < n) falt.push(`${t}×${n - have}`); }
  return { tokens_fonte: total, cobertos: ok, pct: +(100 * ok / total).toFixed(2), faltando_amostra: falt.slice(0, 20) };
};
const strip = (h) => texto(h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' '));

const res = {};
const heroA = html.indexOf('<div class="hero">'); const heroB = html.indexOf('<section id="tese">');
const footA = html.indexOf('<footer>'); const footB = html.indexOf('</footer>');
res.hero_e_rodape = cover(strip(html.slice(heroA, heroB)) + ' ' + strip(html.slice(footA, footB)));
for (const [id, nome] of [['tese', '§ 00'], ['map', '§ MAP'], ['caso', '§ Caso'], ['erros', '§ Erros'], ['ex', '§ Ex'], ['quiz', '§ Quiz (markup)'], ['voz', '§ Voz'], ['final', '§ Final'], ['lex', '§ Lex'], ['ref', '§ Ref']]) {
  const s = section(id); res[nome] = { ...cover(strip(html.slice(s.start, s.end))), linhas: `L${lineOf(s.start)}–${lineOf(s.end)}` };
}
const Q = scriptVar(scriptBlock('QUIZ'), 'Q').valor;
res['§ Quiz (script: questões)'] = cover(Q.map((q) => [q.q, ...q.o, q.f].join(' ')).join(' '));
// markup dos 11 instrumentos (div.inst), com balanceamento de div
let instTxt = ''; let p = 0;
while ((p = html.indexOf('<div class="inst"', p)) >= 0) {
  let d = 0, i = p; const re = /<\/?div\b/g; re.lastIndex = p; let m;
  while ((m = re.exec(html))) { d += m[0] === '<div' ? 1 : -1; if (d === 0) { i = m.index; break; } }
  instTxt += ' ' + strip(html.slice(p, i)); p = i;
}
res.instrumentos_markup = { ...cover(instTxt), nota: 'Texto estático do markup; as saídas renderizadas vêm do script e estão em instrumentos.json (ramos e cenário-padrão).' };
// corpo das aulas: fora do escopo (só o que é invocado/apontado foi extraído) — medido só como informação
const corpo = ['a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08'].map((id) => { const s = section(id); return strip(html.slice(s.start, s.end)); }).join(' ');
res.corpo_das_aulas_informativo = { ...cover(corpo), nota: 'Fora do escopo destes três grupos (sem aula-NN.json nesta rodada); número apenas informativo.' };

const lit = JSON.parse(execFileSync(process.execPath, ['m12_verify.mjs'], { cwd: new URL('.', import.meta.url), encoding: 'utf8' }));
const out = {
  gerado_em: '2026-09-17',
  gerado_por: 'extratores/m12_cobertura.mjs (+ m12_verify.mjs)',
  literalidade: Object.fromEntries(Object.entries(lit).map(([k, v]) => [k, { strings_verificadas: v.strings_verificadas, falhas: v.falhas, origens: v.origens, origens_fora_da_janela: v.origens_falhas }])),
  cobertura_por_token: res,
  nota: 'Cobertura = palavras do texto visível da fonte presentes (com multiplicidade) no conjunto de strings dos três JSONs. Uma palavra faltante pode estar em outra seção; a amostra lista as ausentes.',
};
fs.writeFileSync(`${OUTDIR}/verificacao.json`, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(Object.fromEntries(Object.entries(res).map(([k, v]) => [k, `${v.pct}% ${v.faltando_amostra.slice(0, 8).join(' ')}`])), null, 1));
