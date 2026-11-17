// Verificação adversarial das três saídas do M11.
// 1) todo campo de CONTEÚDO é substring da fonte (html normalizado, texto sem tags, ou literal do script);
// 2) toda origem {trecho_inicial, linha_aprox} é encontrada perto da linha declarada;
// 3) contagens batem com recontagem independente por regex no arquivo cru.
import fs from 'node:fs';
import * as L from './m11_lib.mjs';

const RAWN = L.ws(L.RAW);
const STRIP = L.ws(L.decode(L.RAW.replace(/<script[\s\S]*?<\/script>/, ' ').replace(/<style[\s\S]*?<\/style>/, ' ').replace(/<[^>]+>/g, '')));
const SCRIPT = L.scriptText();
// literais JS do script, avaliados (para quiz, dados e templates)
const LITS = [];
for (const m of SCRIPT.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)) { try { LITS.push(new Function(`return '${m[1]}'`)()); } catch { /* ignora */ } }
const LITJOIN = LITS.join('');
const STRIP_LITS = L.ws(L.decode(LITS.join('').replace(/<[^>]+>/g, '')));

const CONTENT_KEYS = new Set(['html', 'texto', 'rotulo', 'enunciado', 'explicacao', 'definicao_html', 'definicao_texto', 'termo', 'familia', 'tag', 'mensagem', 'mensagem_se_verdadeiro', 'mensagem_se_falso', 'rotulo_em_negrito', 'primeira_frase', 'rotulo_fonte', 'titulo_fonte', 'valor_em_negrito', 'num', 'sigla', 'explicacao_erro', 'codigo', 'tipo_fonte', 'tema', 'rotulo_marcacao', 'valor_marcacao', 'paragrafos_html', 'literal']);
const SKIP_PATH = /divergencias|comparacao_codigo|codigo_atual|nota|leitura_a|leitura_b|contas_de_gabarito|cenario_padrao|rotulos_de_interface_fonte|criterio_literal_prosa|script\.codigo_verbatim|convencoes|metodo|limiar\.literais|marca_gridalpha|ramos_do_veredito|formulas_exatas_script|atribuicao_script|leitura_script|dados_do_script|render_script|faixas_de_placar_script|opcoes_geradas|mecanica/;
const found = (s) => {
  const t = L.ws(String(s));
  if (!t) return true;
  return RAWN.includes(t) || STRIP.includes(t) || LITJOIN.includes(String(s)) || STRIP_LITS.includes(t) || L.ws(SCRIPT).includes(t);
};
function walk(o, path, out) {
  if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${path}[${i}]`, out));
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) {
      const p = `${path}.${k}`;
      if (typeof v === 'string' && CONTENT_KEYS.has(k) && !SKIP_PATH.test(p)) { out.strings++; if (!found(v)) out.falhas.push({ path: p, valor: v.slice(0, 120) }); }
      else if (Array.isArray(v) && k === 'paragrafos_html' && !SKIP_PATH.test(p)) v.forEach((x, i) => { out.strings++; if (!found(x)) out.falhas.push({ path: `${p}[${i}]`, valor: x.slice(0, 120) }); });
      else if (k === 'origem' && v && typeof v === 'object' && typeof v.linha_aprox === 'number') {
        out.origens++;
        const win = L.ws(L.decode(L.LINES.slice(Math.max(0, v.linha_aprox - 4), v.linha_aprox + 12).join('\n').replace(/<[^>]+>/g, '')));
        const winRaw = L.ws(L.LINES.slice(Math.max(0, v.linha_aprox - 4), v.linha_aprox + 12).join('\n'));
        const tr = L.ws(v.trecho_inicial || '');
        if (tr && !win.includes(tr.slice(0, 40)) && !winRaw.includes(tr.slice(0, 40)) && !L.ws(L.decode(winRaw)).includes(tr.slice(0, 40))) out.origemFalhas.push({ path: p, linha: v.linha_aprox, trecho: tr.slice(0, 60) });
      } else walk(v, p, out);
    }
  }
}
const res = {};
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  const j = JSON.parse(fs.readFileSync(`${L.OUTDIR}/${f}`, 'utf8'));
  const out = { strings: 0, falhas: [], origens: 0, origemFalhas: [] };
  walk(j, f, out);
  res[f] = out;
}
// recontagens independentes (regex no cru)
const re = (r) => (L.RAW.match(r) || []).length;
const recont = {
  sec_id: re(/<div class="sec-id">/g),
  aulas: re(/<div class="sec-id">Aula \d\d ·/g),
  inst: re(/<div class="inst">/g),
  term: re(/<span class="term">/g),
  ex_box: (L.RAW.slice(L.RAW.indexOf('<section id="ex">'), L.RAW.indexOf('<section id="quiz">')).match(/<div class="box">/g) || []).length,
  checklist: (L.RAW.slice(L.RAW.indexOf('<ul class="ck">'), L.RAW.indexOf('</ul>', L.RAW.indexOf('<ul class="ck">'))).match(/<li>/g) || []).length,
  refs: (L.RAW.slice(L.RAW.indexOf('<ol class="ref-list">'), L.RAW.indexOf('</ol>', L.RAW.indexOf('<ol class="ref-list">'))).match(/<li>/g) || []).length,
  erros: (L.RAW.slice(L.RAW.indexOf('<ol class="num-list">'), L.RAW.indexOf('</ol>', L.RAW.indexOf('<ol class="num-list">'))).match(/<li>/g) || []).length,
  quiz: re(/\{q:'/g),
  fi: re(/<div class="fi">/g),
  details_lex: (L.RAW.slice(L.RAW.indexOf('<section id="lex">'), L.RAW.indexOf('<section id="ref">')).match(/<details/g) || []).length,
  video_iframe_img: re(/<video|<iframe|<img|youtube|vimeo|\.mp4/gi),
  url: re(/https?:\/\/|www\./g),
};
const m = JSON.parse(fs.readFileSync(`${L.OUTDIR}/modulo.json`, 'utf8'));
const a = JSON.parse(fs.readFileSync(`${L.OUTDIR}/aparato.json`, 'utf8'));
const i = JSON.parse(fs.readFileSync(`${L.OUTDIR}/instrumentos.json`, 'utf8'));
const confere = {
  sec_id: recont.sec_id === m.roteiro.length,
  aulas: recont.aulas === m.contagens.aulas,
  inst: recont.inst === i.instrumentos.length,
  term: recont.term === a.glossario.termos.length,
  ex: recont.ex_box === a.exercicios.total_na_fonte,
  checklist: recont.checklist === a.checklist_final.total_itens && recont.checklist === m.contagens.checklist,
  refs: recont.refs === a.referencias.total,
  erros: recont.erros === m.erros_comuns.itens.length,
  quiz: recont.quiz === a.avaliacao.total_questoes,
  lex_familias: recont.details_lex === a.glossario.contagem.familias.length,
};
// ramos e dados do script: código verbatim e literais avaliados
const SCRIPTN = L.ws(SCRIPT);
const inst = { ramos: 0, ramosFalha: [], dados: 0, dadosFalha: [], verbatim: 0, verbatimFalha: [] };
const litSet = new Set(LITS);
const allStrings = (v, acc = []) => { if (typeof v === 'string') acc.push(v); else if (v && typeof v === 'object') Object.values(v).forEach((x) => allStrings(x, acc)); return acc; };
for (const x of i.instrumentos) {
  for (const r of x.ramos_do_veredito) { inst.ramos++; if (!SCRIPTN.includes(L.ws(r.codigo))) inst.ramosFalha.push({ id: x.id, linha: r.linha_aprox }); }
  for (const [k, d] of Object.entries(x.dados_do_script)) for (const s of allStrings(d.valor)) { inst.dados++; if (!litSet.has(s)) inst.dadosFalha.push({ id: x.id, k, s: s.slice(0, 60) }); }
  inst.verbatim++; if (x.script.codigo_verbatim !== L.linesText(x.script.linhas[0], x.script.linhas[1])) inst.verbatimFalha.push(x.id);
}
for (const q of a.avaliacao.perguntas) for (const s of [q.enunciado, q.explicacao, ...q.alternativas.map((o) => o.texto)]) { inst.dados++; if (!litSet.has(s)) inst.dadosFalha.push({ id: q.id, s: s.slice(0, 60) }); }
console.log(JSON.stringify({ script: { ramos: inst.ramos, ramos_falha: inst.ramosFalha.length, literais: inst.dados, literais_falha: inst.dadosFalha.length, blocos_verbatim: inst.verbatim, blocos_falha: inst.verbatimFalha.length } }));
if (inst.ramosFalha.length || inst.dadosFalha.length) console.log(JSON.stringify([inst.ramosFalha.slice(0, 5), inst.dadosFalha.slice(0, 5)]));
// cobertura por token (protocolo §5): palavras da seção (sem o markup dos div.inst) consumidas pelas palavras extraídas
const tok = (s) => L.ws(L.decode(String(s).replace(/<[^>]+>/g, ' '))).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const secText = (id) => { const s = L.sections.find((x) => x.id === id); let h = L.outer(s.node); for (const n of L.byClass(s.node, 'inst')) h = h.replace(L.outer(n), ' '); return h; };
const strs = (o) => allStrings(o).filter((s) => !/^(m11-|section#|script|div\.|p\.|#)/.test(s));
const cover = (id, parts) => {
  const src = tok(secText(id));
  const bag = new Map();
  for (const w of tok(parts.flatMap((p) => strs(p)).join(' '))) bag.set(w, (bag.get(w) || 0) + 1);
  let hit = 0;
  for (const w of src) { const c = bag.get(w); if (c) { hit++; bag.set(w, c - 1); } }
  return { palavras_fonte: src.length, cobertas: hit, pct: +(100 * hit / src.length).toFixed(1) };
};
const pick = (o, keys) => keys.map((k) => o[k]);
const crit = (id) => m.criterios.itens.find((x) => x.id === id);
const cobertura = {
  tese: cover('tese', [m.tese.marcador, m.tese.titulo_secao, m.tese.blocos]),
  map: cover('map', [m.mapa.marcador, m.mapa.titulo_secao, m.mapa.blocos]),
  caso: cover('caso', [a.caso.marcador, a.caso.titulo, a.caso.blocos]),
  erros: cover('erros', [m.erros_comuns.marcador, m.erros_comuns.titulo_secao, m.erros_comuns.itens.map((x) => x.html)]),
  ex: cover('ex', [a.exercicios.marcador, a.exercicios.titulo, a.exercicios.introducao, a.exercicios.soltos_P9.map((e) => [e.tag, e.enunciado.html, e.rotulo_botao_gabarito, e.gabarito.paragrafos_html])]),
  quiz: cover('quiz', [a.avaliacao.marcador, a.avaliacao.titulo, a.avaliacao.introducao, a.avaliacao.rotulos_de_interface_fonte.botoes.map((b) => b.rotulo)]),
  voz: cover('voz', [crit('m11-crit-roteiro-oral').titulo_secao, m.roteiro.find((r) => r.section_id === 'voz').marcador_num, m.roteiro.find((r) => r.section_id === 'voz').marcador_rotulo, crit('m11-crit-roteiro-oral').blocos]),
  final: cover('final', [a.checklist_final.marcador, a.checklist_final.titulo, a.checklist_final.introducao, a.checklist_final.itens.map((x) => x.html)]),
  lex: cover('lex', [a.glossario.marcador, a.glossario.titulo, a.glossario.introducao, a.glossario.contagem.familias.map((f) => f.nome), a.glossario.termos.map((t) => [t.termo, t.definicao_html])]),
  ref: cover('ref', [a.referencias.marcador, a.referencias.titulo, a.referencias.introducao, a.referencias.itens.map((r) => [r.rotulo_fonte, r.html])]),
};
{
  // marcação estática dos 11 div.inst × campos extraídos da marcação
  const nodes = L.byClass(L.DOC, 'inst');
  const src = tok(nodes.map((n) => L.outer(n)).join(' '));
  const bag = new Map();
  const parts = i.instrumentos.map((x) => [x.id_fonte, x.titulo, x.intro.html, x.nota_de_fonte?.html ?? '', x.entradas.campos_numericos.map((c) => [c.rotulo, c.unidade]), x.entradas.seletores.map((s) => [s.rotulo, s.opcoes.map((o) => o.rotulo)]), x.entradas.seletores_dinamicos.map((d) => d.rotulo_marcacao ?? ''), x.saidas.readouts.map((r) => [r.rotulo, r.valor_marcacao])]);
  for (const w of tok(JSON.stringify(parts).replace(/[[\]",]/g, ' '))) bag.set(w, (bag.get(w) || 0) + 1);
  let hit = 0; const faltam = new Map();
  for (const w of src) { const c = bag.get(w); if (c) { hit++; bag.set(w, c - 1); } else faltam.set(w, (faltam.get(w) || 0) + 1); }
  cobertura.instrumentos_marcacao = { palavras_fonte: src.length, cobertas: hit, pct: +(100 * hit / src.length).toFixed(1), nao_cobertas_amostra: [...faltam.entries()].slice(0, 15), nota: 'O resto é atributo/markup (class, id, type, style), não texto.' };
}
console.log(JSON.stringify({ cobertura }));
const resumo = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, { strings_conferidas: v.strings, falhas: v.falhas.length, origens_conferidas: v.origens, origens_falhas: v.origemFalhas.length }]));
console.log(JSON.stringify({ resumo, recont, confere }, null, 1));
for (const [k, v] of Object.entries(res)) { if (v.falhas.length) console.log(k, JSON.stringify(v.falhas.slice(0, 12), null, 1)); if (v.origemFalhas.length) console.log(k, JSON.stringify(v.origemFalhas.slice(0, 12), null, 1)); }
fs.writeFileSync(`${L.SCRATCH}/m11-verify.json`, JSON.stringify({ resumo, recont, confere, res }, null, 1));
