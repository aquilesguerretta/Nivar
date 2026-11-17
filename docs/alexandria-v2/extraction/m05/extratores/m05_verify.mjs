// Verificação dos três JSON do M05 contra a fonte.
// (1) verbatim: todo campo `html`/`texto`/literal de conteúdo aparece na fonte;
// (2) origem: `linha_aprox` aponta para uma linha que contém o trecho_inicial;
// (3) cobertura por token (protocolo §5) por seção, descontando o markup de instrumento;
// (4) script: todo `codigo`/`expressao_js` existe literalmente no <script>.
// Uso: node m05_verify.mjs
import fs from 'node:fs';
import path from 'node:path';
import { L, ln, RAW_SRC, OUTDIR, collapse, stripTags, decode, secao, SCRIPT, walk } from './m05_lib.mjs';

const J = Object.fromEntries(['modulo', 'aparato', 'instrumentos'].map((k) => [k, JSON.parse(fs.readFileSync(path.join(OUTDIR, `${k}.json`), 'utf8'))]));
const SRC_COL = collapse(RAW_SRC);
const SRC_TXT = collapse(decode(RAW_SRC.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')));
const SRC_TXT2 = stripTags(RAW_SRC);
const falhas = [];
let checks = 0;

// campos que NÃO são conteúdo da fonte (notas desta extração, comparações)
const IGNORA = /^(nota|nota_.*|.*_nota|metodo|decisao|tema|comparacao_codigo|codigo_atual|convencoes|gerado_.*|schema|fonte|divergencias|mecanica_fonte|mecanica|formula_nota|invocacoes_nota|vinculos|vinculos_nota|kind_catalogo_taxonomia|marcacao_p14|itens_orais_ou_cronometrados_P14|comparacao_catalogo|ponteiros|padrao|controle|sinais_container|cenario_padrao|secao_html|href)$/;

function walkJson(o, p, fn) {
  if (Array.isArray(o)) o.forEach((v, i) => walkJson(v, `${p}[${i}]`, fn));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (IGNORA.test(k)) continue; fn(k, v, p, o); walkJson(v, `${p}.${k}`, fn); }
}

for (const [nome, j] of Object.entries(J)) {
  walkJson(j, nome, (k, v, p, o) => {
    if (typeof v !== 'string') return;
    if (k === 'html' || /_html$/.test(k)) {
      checks++;
      if (!SRC_COL.includes(collapse(v))) falhas.push({ tipo: 'html_nao_verbatim', caminho: `${p}.${k}`, valor: v.slice(0, 80) });
    } else if (k === 'texto' || /_texto$/.test(k) || ['termo', 'titulo', 'rotulo', 'enunciado', 'explicacao', 'descricao', 'rotulo_marcador', 'marcador', 'titulo_card', 'rotulo_aula', 'rotulo_src', 'resumo', 'tag'].includes(k)) {
      if (/^(Questão \d+ de 10|m05-)/.test(v)) return;
      checks++;
      const t = collapse(v);
      if (!SRC_TXT.includes(t) && !SRC_TXT2.includes(t) && !SRC_COL.includes(t)) falhas.push({ tipo: 'texto_nao_verbatim', caminho: `${p}.${k}`, valor: t.slice(0, 80) });
    } else if (k === 'codigo' || k === 'expressao_js') {
      checks++;
      if (!SCRIPT.codigo.includes(v.trim())) falhas.push({ tipo: 'codigo_nao_verbatim', caminho: `${p}.${k}`, valor: v.slice(0, 80) });
    } else if (k === 'trecho_inicial') {
      checks++;
      const n = o.linha_aprox;
      const ok = [n - 1, n, n + 1].some((m) => m >= 1 && collapse(ln(m) ?? '').startsWith(v.slice(0, 40)));
      if (!ok) falhas.push({ tipo: 'origem_desalinhada', caminho: p, linha: n, valor: v.slice(0, 60) });
    }
  });
}

// quiz: literais do script
for (const q of J.aparato.avaliacao.perguntas) {
  for (const s of [q.enunciado, q.explicacao, ...q.alternativas.map((a) => a.texto)]) {
    checks++;
    if (!SCRIPT.codigo.includes(s.replace(/"/g, '"'))) falhas.push({ tipo: 'quiz_nao_verbatim', id: q.id, valor: s.slice(0, 60) });
  }
}
for (const x of J.instrumentos.instrumentos) {
  if (!x.sinais) continue;
  for (const s of x.sinais.itens) { checks += 2; if (!SCRIPT.codigo.includes(s.titulo) || !SCRIPT.codigo.includes(s.descricao)) falhas.push({ tipo: 'sinal_nao_verbatim', i: s.indice }); }
}

// cobertura por token por seção
const tok = (s) => (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
const extraidoTokens = (() => {
  const bag = new Map();
  const add = (s) => tok(s).forEach((t) => bag.set(t, (bag.get(t) ?? 0) + 1));
  for (const j of Object.values(J)) walkJson(j, '', (k, v, p) => { if (Array.isArray(v) && /_html$/.test(k)) v.forEach((x) => typeof x === 'string' && add(stripTags(x))); if (typeof v === 'string' && (k === 'numero' || (k === 'texto' && /legenda/.test(p)) || k === 'unidade' || k === 'valor_inicial_markup' || k === 'id_fonte' || k === 'html' || /_html$/.test(k) || k === 'resumo' || k === 'rotulo' || k === 'titulo' || k === 'marcador' || k === 'rotulo_marcador' || k === 'titulo_card' || k === 'rotulo_aula' || k === 'resumo_literal' || k === 'termo_html_fonte' || k === 'rotulo_src' || k === 'descricao' || k === 'rotulo_esquerda')) add(stripTags(v)); });
  return bag;
})();
const cobertura = {};
const SECOES = ['tese', 'map', 'caso', 'erros', 'ex', 'quiz', 'voz', 'final', 'lex', 'ref'];
const INST_SECOES = ['a01', 'a02', 'a03', 'a04', 'a05', 'a06'];
for (const id of [...SECOES, ...INST_SECOES]) {
  const { ini, fim } = secao(id);
  let linhas = L.slice(ini - 1, fim);
  if (INST_SECOES.includes(id)) {
    // só o markup dos instrumentos (o resto da aula não é deste pacote)
    const w = walk(id);
    const inst = w.blocos.find((b) => b.tipo === 'instrumento');
    linhas = L.slice(inst.linhas[0] - 1, inst.linhas[1]);
  }
  const src = tok(decode(linhas.join(' ').replace(/<[^>]+>/g, ' ')));
  const bag = new Map(extraidoTokens);
  let hit = 0;
  for (const t of src) { const c = bag.get(t) ?? 0; if (c > 0) { hit++; bag.set(t, c - 1); } }
  const faltam = []; { const b2 = new Map(extraidoTokens); for (const t of src) { const c = b2.get(t) ?? 0; if (c > 0) b2.set(t, c - 1); else faltam.push(t); } }
  cobertura[id] = { faltam: faltam.slice(0, 30), tokens_fonte: src.length, cobertos: hit, pct: +(100 * hit / Math.max(1, src.length)).toFixed(1) };
}

const out = { checks, falhas: falhas.length, amostra_falhas: falhas.slice(0, 20), cobertura };
console.log(JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(OUTDIR, 'extratores', 'verify-result.json'), JSON.stringify(out, null, 2) + '\n');
