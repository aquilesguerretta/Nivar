// Cobertura por token ESTRITA (protocolo §5): para cada seção, o "saco" de
// tokens extraídos só inclui strings de nós JSON cuja âncora de linha
// (origem.linha_aprox ou linha_aprox) cai dentro da própria seção.
// Complementa m05_verify.mjs, cujo saco é global (todos os JSON juntos).
// Uso: node m05_cobertura_estrita.mjs
import fs from 'node:fs';
import path from 'node:path';
import { L, OUTDIR, decode, stripTags, secao, walk } from './m05_lib.mjs';

const J = ['modulo', 'aparato', 'instrumentos'].map((k) => JSON.parse(fs.readFileSync(path.join(OUTDIR, `${k}.json`), 'utf8')));
const tok = (s) => (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
const CONTEUDO = /^(html|texto|.*_html|rotulo|titulo|resumo|termo|definicao|enunciado|descricao|titulo_card|rotulo_aula|marcador|rotulo_marcador|numero|unidade|valor_inicial_markup|id_fonte|rotulo_aba|rotulo_src|cabeca_html|corpo_html|abas|celulas_html|legenda|tag|resumo_literal)$/;
const IGN = /^(nota.*|.*_nota|comparacao_.*|codigo_atual|divergencias|metodo|convencoes|cenario_padrao|script|formulas_script|atribuicao_script)$/;
const porLinha = new Map(); // linha -> tokens[]
const vistos = new Set();
function add(n, s) { if (typeof n !== 'number') return; const arr = porLinha.get(n) ?? []; arr.push(...tok(stripTags(s))); porLinha.set(n, arr); }
function visit(o, anc) {
  if (Array.isArray(o)) { o.forEach((v) => visit(v, anc)); return; }
  if (!o || typeof o !== 'object') return;
  const a = o.origem?.linha_aprox ?? o.linha_aprox ?? o.posicao_no_texto?.linhas?.[0] ?? o.svg?.linha_aprox ?? anc;
  for (const [k, v] of Object.entries(o)) {
    if (IGN.test(k)) continue;
    if (CONTEUDO.test(k)) {
      const key = `${a}|${k}|${JSON.stringify(v)}`;
      if (vistos.has(key)) continue; // mesmo nó referenciado duas vezes não conta em dobro
      vistos.add(key);
      if (typeof v === 'string') add(a, v);
      else if (Array.isArray(v)) v.forEach((x) => typeof x === 'string' && add(a, x));
    }
    if (v && typeof v === 'object') visit(v, a);
  }
}
J.forEach((j) => visit(j, null));

const out = {};
for (const id of ['tese', 'map', 'a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'caso', 'erros', 'ex', 'quiz', 'voz', 'final', 'lex', 'ref']) {
  const { ini, fim } = secao(id);
  let faixas = [[ini, fim]];
  if (/^a0\d$/.test(id)) { const inst = walk(id).blocos.find((b) => b.tipo === 'instrumento'); faixas = [inst.linhas]; }
  const bag = new Map();
  for (const [n, ts] of porLinha) if (faixas.some(([x, y]) => n >= x && n <= y)) ts.forEach((t) => bag.set(t, (bag.get(t) ?? 0) + 1));
  const src = faixas.flatMap(([x, y]) => tok(decode(L.slice(x - 1, y).join(' ').replace(/<[^>]+>/g, ' '))));
  let hit = 0; const faltam = [];
  for (const t of src) { const c = bag.get(t) ?? 0; if (c > 0) { hit++; bag.set(t, c - 1); } else faltam.push(t); }
  out[id] = { escopo: /^a0\d$/.test(id) ? 'markup do instrumento' : 'seção inteira', tokens_fonte: src.length, cobertos: hit, pct: +(100 * hit / Math.max(1, src.length)).toFixed(1), faltam: faltam.slice(0, 25) };
}
console.log(JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(OUTDIR, 'extratores', 'cobertura-estrita.json'), JSON.stringify(out, null, 2) + '\n');
