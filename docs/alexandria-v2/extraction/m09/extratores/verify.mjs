// Verificação independente dos três JSONs do M09.
// 1) toda string de conteúdo é substring da fonte (html contra o HTML cru; texto contra o HTML sem tags);
// 2) toda origem {linha_aprox, trecho_inicial} aponta para a linha certa (±3);
// 3) cobertura por token (protocolo §5) por seção extraída, descontando o markup de instrumento.
import fs from 'node:fs';
import * as X from './lib.mjs';

const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const RAWN = norm(X.RAW);
const PLAIN = norm(X.strip(X.RAW));
const J = (f) => JSON.parse(fs.readFileSync(`${X.OUTDIR}/${f}`, 'utf8'));

// chaves de CONTEÚDO (texto da fonte). Tudo o que não está aqui é anotação ou metadado.
const HTMLK = new Set(['html', 'definicao_html', 'sec_id_html', 'intro_html']);
const TEXTK = new Set(['texto', 'definicao_texto', 'titulo_literal', 'descricao_literal', 'enunciado', 'explicacao', 'pergunta', 'termo', 'rotulo', 'rotulo_grupo', 'mensagem', 'valor_estatico_no_markup', 'texto_estatico_no_markup', 'trecho_inicial', 'interlocutor', 'tipo_fonte', 'parte_literal', 'setor_e_local', 'perfil_das_partes_anteriores', 'titulo_documento', 'marcador', 'rotulo_marcador', 'numero_txt', 'aria_label', 'data_de_verificacao_declarada', 'frase', 'valor_literal', 'tempo_literal', 'codigo']);
const SKIP_UNDER = new Set(['convencoes', 'divergencias', 'comparacao_codigo', 'codigo', 'codigo_atual', 'saidas_renderizadas', 'enumeracao', 'catalogo_canonico', 'kind_candidato', 'dados_literais', 'onde_isso_entra_no_produto', 'cenario_padrao', 'gabarito_diferencas']);
const EXCEPT_TEXT = new Set(['Pergunta 1 de 10', 'Pergunta 2 de 10', 'Pergunta 3 de 10', 'Pergunta 4 de 10', 'Pergunta 5 de 10', 'Pergunta 6 de 10', 'Pergunta 7 de 10', 'Pergunta 8 de 10', 'Pergunta 9 de 10', 'Pergunta 10 de 10']);

function walk(o, path, fn) {
  if (Array.isArray(o)) o.forEach((v, i) => walk(v, `${path}[${i}]`, fn));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) {
    if (SKIP_UNDER.has(k) && !(k === 'codigo' && typeof v === 'string')) continue;
    if (typeof v === 'string') fn(k, v, `${path}.${k}`);
    else walk(v, `${path}.${k}`, fn);
  }
}

function conferirStrings(nome, obj) {
  let ok = 0; const falhas = [];
  walk(obj, nome, (k, v, p) => {
    if (!v) return;
    let pass;
    if (HTMLK.has(k)) pass = RAWN.includes(norm(v));
    else if (k === 'codigo') pass = RAWN.includes(norm(v));
    else if (TEXTK.has(k)) pass = PLAIN.includes(norm(v)) || RAWN.includes(norm(v)) || EXCEPT_TEXT.has(v);
    else return;
    if (pass) ok++; else falhas.push({ p, v: v.slice(0, 90) });
  });
  return { ok, falhas };
}

// literais do script: cada string folha tem de estar no HTML cru
function conferirLiterais(inst) {
  let ok = 0; const falhas = [];
  for (const i of inst.instrumentos) for (const [nome, d] of Object.entries(i.script.dados_literais)) {
    const folhas = [];
    const rec = (x) => { if (typeof x === 'string') folhas.push(x); else if (x && typeof x === 'object') Object.values(x).forEach(rec); };
    rec(d.valor);
    for (const f of folhas) (RAWN.includes(norm(f)) ? ok++ : falhas.push(`${i.id}.${nome}: ${f.slice(0, 60)}`));
  }
  return { ok, falhas };
}

function conferirOrigens(nome, obj) {
  let ok = 0; const falhas = [];
  walk(obj, nome, () => {});
  const rec = (o, p) => {
    if (Array.isArray(o)) return o.forEach((v, i) => rec(v, `${p}[${i}]`));
    if (!o || typeof o !== 'object') return;
    if (typeof o.linha_aprox === 'number' && typeof o.trecho_inicial === 'string' && o.seletor) {
      const alvo = norm(o.trecho_inicial);
      let achou = false;
      for (let d = -3; d <= 3 && !achou; d++) { const l = X.ln(o.linha_aprox + d); if (l && (norm(X.strip(l)).includes(alvo) || norm(l).includes(alvo))) achou = true; }
      achou ? ok++ : falhas.push({ p, linha: o.linha_aprox, t: alvo.slice(0, 50) });
    }
    for (const [k, v] of Object.entries(o)) if (k !== 'divergencias') rec(v, `${p}.${k}`);
  };
  rec(obj, nome);
  return { ok, falhas };
}

// literais de string JS com prosa (2+ espaços), lidos por scanner de aspas
function literaisJS(src) {
  const out = []; let q = null, buf = '';
  for (let k = 0; k < src.length; k++) {
    const c = src[k];
    if (q) { if (c === '\\') { buf += src[++k]; continue; } if (c === q) { if ((buf.match(/ /g) || []).length >= 2) out.push(buf); q = null; buf = ''; continue; } buf += c; continue; }
    if (c === '/' && src[k + 1] === '*') { k = src.indexOf('*/', k) + 1; continue; }
    if (c === "'" || c === '"') { q = c; buf = ''; }
  }
  return out;
}
// cobertura por token
const toks = (s) => norm(X.strip(String(s).replace(/<\/?[a-zA-Z][^>]*>/g, ' '))).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
function cobertura(linhas, extraido) {
  const pool = new Map();
  for (const t of toks(extraido.join(' '))) pool.set(t, (pool.get(t) || 0) + 1);
  const fonte = toks(linhas.join('\n'));
  let hit = 0; const faltam = new Map();
  for (const t of fonte) { const c = pool.get(t) || 0; if (c > 0) { hit++; pool.set(t, c - 1); } else faltam.set(t, (faltam.get(t) || 0) + 1); }
  return { tokens_fonte: fonte.length, cobertos: hit, pct: +(100 * hit / Math.max(1, fonte.length)).toFixed(1), faltam: [...faltam.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12) };
}
const coleta = (obj) => { const out = []; const rec = (x, k) => { if (typeof x === 'string') { if (!/^(nota|tema|metodo|gerado|schema|justificativa)/.test(k || '')) out.push(x); } else if (Array.isArray(x)) x.forEach((v) => rec(v, k)); else if (x && typeof x === 'object') for (const [kk, v] of Object.entries(x)) if (!['divergencias', 'comparacao_codigo', 'codigo', 'codigo_atual'].includes(kk)) rec(v, kk); }; rec(obj); return out; };

const mod = J('modulo.json'), apa = J('aparato.json'), ins = J('instrumentos.json');
const S = X.secoes();
const linhasSecao = (id, semInst = true) => {
  const s = S.find((x) => x.id_html === id);
  const out = [];
  let k = s.ini;
  while (k <= s.fim) {
    if (semInst && /^\s*<div class="inst">$/.test(X.ln(k))) { k = X.fimDiv(k) + 1; continue; }
    out.push(X.ln(k)); k++;
  }
  return out;
};
const rel = {};
rel.strings = { modulo: conferirStrings('modulo', mod), aparato: conferirStrings('aparato', apa), instrumentos: conferirStrings('instrumentos', ins) };
rel.literais_script = conferirLiterais(ins);
rel.origens = { modulo: conferirOrigens('modulo', mod), aparato: conferirOrigens('aparato', apa), instrumentos: conferirOrigens('instrumentos', ins) };
rel.cobertura = {
  hero: cobertura(X.L.slice(423, 444), coleta(mod.identidade)),
  tese: cobertura(linhasSecao('tese'), coleta([mod.tese, mod.identidade.eixos])),
  map_sem_instrumento: cobertura(linhasSecao('map'), coleta(mod.mapa)),
  erros: cobertura(linhasSecao('erros'), coleta(mod.erros_comuns)),
  voz: cobertura(linhasSecao('voz'), coleta(mod.voz.secao_voz)),
  caso: cobertura(linhasSecao('caso'), coleta(apa.caso)),
  quiz_secao: cobertura(linhasSecao('quiz'), coleta(apa.avaliacao)),
  quiz_script_strings: cobertura(literaisJS(X.L.slice(X.blocoScript('§QUIZ').ini - 1, X.blocoScript('§QUIZ').fim).join('\n')), coleta(apa.avaliacao)),
  ex: cobertura(linhasSecao('ex'), coleta(apa.exercicios)),
  final: cobertura(linhasSecao('final'), coleta(apa.checklist_final)),
  lex: cobertura(linhasSecao('lex'), coleta(apa.glossario)),
  ref: cobertura(linhasSecao('ref'), coleta(apa.referencias)),
  rodape: cobertura(X.L.slice(2348, 2357), coleta(mod.identidade.rodape)),
};
// instrumentos: markup de cada .inst e o bloco de script de cada um
rel.cobertura_instrumentos = Object.fromEntries(ins.instrumentos.map((i) => {
  const mk = X.L.slice(i.local.linhas_markup[0] - 1, i.local.linhas_markup[1]).filter((l) => !/<path |<rect |<marker|<defs|<\/defs|<\/?g\b|<\/?svg/.test(l));
  const sc = X.L.slice(i.script.bloco_linhas[0] - 1, i.script.bloco_linhas[1]);
  const extr = coleta([i.intro, i.disclaimer, i.entradas, i.saidas, i.legenda, i.desenho, i.titulo, i.inst_id_fonte]);
  // dados literais: todas as folhas (a chave "nota" do COMP é conteúdo, não anotação)
  const folhas = []; const rec = (x) => { if (typeof x === 'string') folhas.push(x); else if (x && typeof x === 'object') Object.values(x).forEach(rec); };
  rec(Object.values(i.script.dados_literais).map((d) => d.valor));
  const extrS = [...folhas, ...i.script.codigo_de_calculo_e_ramos.map((c) => c.codigo)];
  // o script tem muita lógica de DOM; mede só as strings literais do bloco
  const strs = literaisJS(sc.join('\n'));
  return [i.id, { markup: cobertura(mk, extr), strings_do_script: cobertura(strs, extrS) }];
}));
fs.writeFileSync(`${X.OUTDIR}/extratores/verify-resultado.json`, JSON.stringify(rel, null, 2) + '\n');
const r = (x) => `${x.ok} ok / ${x.falhas.length} falhas`;
console.log('strings', r(rel.strings.modulo), '|', r(rel.strings.aparato), '|', r(rel.strings.instrumentos));
console.log('literais do script', r(rel.literais_script));
console.log('origens', r(rel.origens.modulo), '|', r(rel.origens.aparato), '|', r(rel.origens.instrumentos));
for (const g of ['modulo', 'aparato', 'instrumentos']) { rel.strings[g].falhas.slice(0, 8).forEach((f) => console.log('  STR', f.p, '→', f.v)); rel.origens[g].falhas.slice(0, 8).forEach((f) => console.log('  ORI', f.p, f.linha, f.t)); }
rel.literais_script.falhas.slice(0, 5).forEach((f) => console.log('  LIT', f));
for (const [k, v] of Object.entries(rel.cobertura)) console.log('cob', k, v.pct, v.tokens_fonte, JSON.stringify(v.faltam.slice(0, 8)));
for (const [k, v] of Object.entries(rel.cobertura_instrumentos)) console.log('cob', k, 'markup', v.markup.pct, JSON.stringify(v.markup.faltam.slice(0, 6)), '| script-str', v.strings_do_script.pct, JSON.stringify(v.strings_do_script.faltam.slice(0, 6)));
