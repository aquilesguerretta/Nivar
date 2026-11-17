// Cobertura por TOKEN (protocolo §5): cada palavra da seção na fonte precisa de uma palavra correspondente
// nas strings extraídas daquela seção, consumida uma vez. Desconta o markup de instrumento (div.inst) do denominador.
import fs from 'node:fs';
import { secao, divBlock, texto, OUTDIR } from './lib.mjs';

const tok = (s) => (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
function srcTokens(id) {
  let body = secao(id).body;
  // remove instrumentos (vão para instrumentos.json)
  let i;
  while ((i = body.indexOf('<div class="inst">')) >= 0) body = body.slice(0, i) + body.slice(i + divBlock(body, i).length);
  // espaço antes de cada tag: evita colar células vizinhas (artefato do medidor, não perda)
  return tok(texto(body.replace(/</g, ' <')));
}
function strings(o, out = []) {
  if (typeof o === 'string') out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => strings(x, out));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) {
    if (k === 'html' || k === 'origem' || k.startsWith('nota') || k === 'codigo_atual' || k === 'comparacao_codigo') continue; // conta só `texto` e strings soltas
    strings(v, out);
  }
  return out;
}
function cover(src, ext) {
  const bag = new Map();
  for (const t of ext) bag.set(t, (bag.get(t) || 0) + 1);
  let hit = 0;
  for (const t of src) { const n = bag.get(t); if (n) { hit++; bag.set(t, n - 1); } }
  return { tokens_fonte: src.length, cobertos: hit, cobertura: +(100 * hit / src.length).toFixed(1) };
}
const M = JSON.parse(fs.readFileSync(`${OUTDIR}/modulo.json`, 'utf8'));
const A = JSON.parse(fs.readFileSync(`${OUTDIR}/aparato.json`, 'utf8'));
const I = JSON.parse(fs.readFileSync(`${OUTDIR}/instrumentos.json`, 'utf8'));
const alvo = {
  tese: M.tese, map: M.mapa, voz: M.voz, erros: M.erros_comuns,
  caso: A.caso, fichas: A.fichas, quiz: A.avaliacao, ex: A.exercicios, final: A.checklist_final, lex: A.glossario, ref: A.referencias,
};
const out = {};
for (const [id, obj] of Object.entries(alvo)) out[id] = cover(srcTokens(id), tok(strings(obj).join(' ')));
// instrumentos: markup de cada div.inst contra o JSON do instrumento
const html = fs.readFileSync('C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo16.html', 'utf8');
let k = 0, idx = 0;
const inst = {};
while ((idx = html.indexOf('<div class="inst">', idx)) >= 0) {
  const blk = divBlock(html, idx); const j = I.instrumentos[k++];
  inst[j.codigo_fonte] = cover(tok(texto(blk.replace(/</g, ' <'))), tok(strings({ t: j.titulo, i: j.intro, r: j.nota_de_rodape, e: j.entradas, s: j.saidas, c: j.cenario_padrao }).join(' ')));
  idx += blk.length;
}
const res = { data: '2026-09-17', metodo: 'token com baixa; instrumento descontado das seções', secoes: out, instrumentos_markup: inst };
fs.writeFileSync(`${OUTDIR}/extratores/coverage.result.json`, JSON.stringify(res, null, 1) + '\n', 'utf8');
console.log(JSON.stringify(res, null, 1));
