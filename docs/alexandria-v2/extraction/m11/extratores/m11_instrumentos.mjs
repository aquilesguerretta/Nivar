// Extração programática dos 11 instrumentos do M11 → instrumentos.json.
// Marcação lida da árvore; lógica e prosa lidas do <script> ORIGINAL (linhas
// verbatim, literais avaliados com new Function); cenário-padrão e confronto
// com o código obtidos EXECUTANDO o script original em DOM simulado.
import fs from 'node:fs';
import * as L from './m11_lib.mjs';

const fail = (m) => { throw new Error(m); };
const cod = await L.loadCodigo();
const CALC = cod.INSTRUMENT_CALCULATORS;
const CONTENT = L.readRepo('src/lib/data/alexandria-modulo-11-content.ts');
const CALC_TS = L.readRepo('src/lib/data/alexandria-instrument-calculators.ts');
const CODE_INSTS = new Map();
for (const a of cod.MODULO_11_AULAS) for (const i of a.instruments) CODE_INSTS.set(i.id, { inst: i, aula: a.id });
for (const i of cod.MODULO_11_INSTRUMENTOS) CODE_INSTS.set(i.id, { inst: i, aula: null, modulo: true });
const S = (h) => L.stripTags(String(h ?? ''));
const words = (h) => S(String(h ?? '').replace(/<br\s*\/?>|<\/p>|<\/div>|<p>|<div[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

// ── util de JS: divide expressão por '+' de topo ─────────────
function splitConcat(expr) {
  const parts = []; let cur = '', q = null, d = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (q) { cur += c; if (c === '\\') { cur += expr[++i]; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    if ('([{'.includes(c)) d++;
    if (')]}'.includes(c)) d--;
    if (c === '+' && d === 0) { parts.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}
const isLit = (p) => /^'(?:[^'\\]|\\.)*'$/.test(p);
function template(expr) {
  const ps = splitConcat(expr);
  return ps.map((p) => (isLit(p) ? new Function(`return ${p}`)() : `{${p}}`)).join('');
}
const depthDelta = (s) => { let d = 0, q = null; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; } if (c === "'" || c === '"') q = c; else if (c === '(') d++; else if (c === ')') d--; } return d; };

// ── parser de ramos do calc() ─────────────────────────────────
function ramos(a, b) {
  // junta linhas em instruções quando há parêntese aberto
  const st = []; let buf = '', start = a, dep = 0;
  for (let n = a; n <= b; n++) {
    const line = L.LINES[n - 1];
    if (!buf) start = n;
    buf += (buf ? '\n' : '') + line;
    dep += depthDelta(line);
    if (dep <= 0) { st.push({ n: start, t: buf }); buf = ''; dep = 0; }
  }
  const out = [];
  const stack = []; // {clausula}
  const lastChain = []; // por nível
  for (const { n, t } of st) {
    let s = t.trim();
    // fechamentos + else
    let m;
    const pushClause = (cl) => { stack.push(cl); };
    while (s.startsWith('}')) {
      s = s.slice(1).trim();
      const closed = stack.pop();
      if (s.startsWith('else')) {
        const lvl = stack.length;
        lastChain[lvl] = [...(lastChain[lvl] || []), closed?.literal];
        if ((m = s.match(/^else if\s*\(([\s\S]*)\)\s*\{\s*$/))) { pushClause({ literal: `else if(${m[1]})`, anteriores: lastChain[lvl] }); s = ''; }
        else if (/^else\s*\{\s*$/.test(s)) { pushClause({ literal: 'else', anteriores: lastChain[lvl] }); s = ''; }
      } else { lastChain[stack.length] = []; }
    }
    if (!s) continue;
    if ((m = s.match(/^if\s*\(([\s\S]*)\)\s*\{\s*$/)) && depthDelta(`(${m[1]})`) === 0) { lastChain[stack.length] = []; pushClause({ literal: `if(${m[1]})`, anteriores: [] }); continue; }
    // if/else if de uma linha: if(C)t.push(...)
    let inline = null;
    if ((m = s.match(/^(else\s+)?if\s*\(/))) {
      // acha o fim da condição
      let i = s.indexOf('(') , d = 0;
      for (; i < s.length; i++) { if (s[i] === '(') d++; else if (s[i] === ')') { d--; if (d === 0) break; } }
      const cond = s.slice(s.indexOf('(') + 1, i);
      inline = { literal: `${m[1] ? 'else ' : ''}if(${cond})` };
      s = s.slice(i + 1).trim();
    }
    const path = [...stack.map((x) => (x.anteriores?.length ? `${x.literal} [após: ${x.anteriores.join(' ; ')}]` : x.literal)), ...(inline ? [inline.literal] : [])];
    if ((m = s.match(/^t\.push\(([\s\S]*)\);?\s*$/))) {
      out.push({ tipo: 'paragrafo_do_veredito', caminho: path, codigo: m[1], texto_template: template(m[1]), linha_aprox: n });
    } else if ((m = s.match(/^(cls)\s*=\s*([\s\S]*?);?\s*$/))) {
      out.push({ tipo: 'classe_do_veredito', caminho: path, codigo: `${m[1]}=${m[2]}`, linha_aprox: n });
    } else if ((m = s.match(/^(classe|perc|estado|cab|red|passo)\s*=\s*([\s\S]*?);\s*$/))) {
      out.push({ tipo: `atribuicao:${m[1]}`, caminho: path, codigo: m[2], texto_template: /\?/.test(m[2]) ? null : template(m[2]), ...(/\?/.test(m[2]) ? { nota_template: 'expressão condicional: ler codigo' } : {}), linha_aprox: n });
    } else if (/^(if|else)/.test(t.trim()) === false && /\{despachavel=|\{porte=/.test(s)) {
      out.push({ tipo: 'atribuicoes_em_linha', caminho: path, codigo: s, linha_aprox: n });
    }
    if (inline) { /* instrução inline não abre bloco */ }
  }
  return out;
}

// ── localização dos blocos de script ─────────────────────────
const headerLines = L.LINES.map((l, i) => (/^\/\* =+ .* =+ \*\/$/.test(l) ? i + 1 : null)).filter(Boolean);
const scriptBlock = (re) => {
  const a = L.findLine(re, L.SCRIPT_LINE0);
  const b = (headerLines.find((x) => x > a) ?? L.findLine(/<\/script>/)) - 1;
  return { a, b, cabecalho: L.LINES[a - 1].trim() };
};

// ── marcação ─────────────────────────────────────────────────
const instNodes = L.byClass(L.DOC, 'inst');
if (instNodes.length !== 11) fail('esperava 11 div.inst');
function marcacao(n) {
  const hd = L.find(n, (x) => L.hasClass(x, 'inst-hd'));
  const idn = L.find(hd, (x) => L.hasClass(x, 'id'));
  const nm = L.find(hd, (x) => L.hasClass(x, 'nm'));
  const bd = L.find(n, (x) => L.hasClass(x, 'inst-bd'));
  const intro = L.find(bd, (x) => L.hasClass(x, 'inst-intro'));
  const note = L.find(bd, (x) => L.hasClass(x, 'srcnote'));
  const segs = L.findAll(bd, (x) => L.hasClass(x, 'seg')).map((sg) => {
    const sib = sg.parent.children; const k = sib.indexOf(sg);
    const lb = [...sib.slice(0, k)].reverse().find((x) => L.hasClass(x, 'seg-lb'));
    const btns = L.kids(sg, (x) => x.tag === 'button');
    const attr = Object.keys(btns[0].attrs).find((x) => x.startsWith('data-'));
    return {
      id: sg.attrs.id, tipo_input: 'seg (botões exclusivos)', rotulo: lb ? L.stripTags(L.inner(lb)) : null, atributo: attr,
      opcoes: btns.map((b) => ({ valor: b.attrs[attr], rotulo: L.stripTags(L.inner(b)), padrao_marcacao: L.hasClass(b, 'on') })),
      padrao: btns.find((b) => L.hasClass(b, 'on'))?.attrs[attr] ?? null,
      origem: L.origem(sg, `#${sg.attrs.id}`, lb ? L.inner(lb) : L.inner(btns[0])),
    };
  });
  const campos = L.byClass(bd, 'field').map((f) => {
    const lab = L.find(f, (x) => L.hasClass(x, 'field-label'));
    const spans = L.kids(lab, (x) => x.tag === 'span');
    const ins = L.byTag(f, 'input');
    const num = ins.find((x) => x.attrs.type === 'number');
    const rng = ins.find((x) => x.attrs.type === 'range');
    const nv = (v) => (v === undefined ? null : Number(v));
    return {
      id: num.attrs.id, tipo_input: rng ? 'number + range gêmeo' : 'number',
      rotulo: L.stripTags(L.inner(spans[0])), unidade: spans[1] ? L.stripTags(L.inner(spans[1])) : null,
      padrao: nv(num.attrs.value), min: nv(num.attrs.min), max: nv(num.attrs.max), step: nv(num.attrs.step),
      range: rng ? { id: rng.attrs.id, padrao: nv(rng.attrs.value), min: nv(rng.attrs.min), max: nv(rng.attrs.max), step: nv(rng.attrs.step) } : null,
      faixas_iguais: rng ? ['value', 'min', 'max', 'step'].every((k) => num.attrs[k] === rng.attrs[k]) : null,
      origem: L.origem(lab, `#${num.attrs.id}`),
    };
  });
  const dinamicos = L.findAll(bd, (x) => x.attrs?.id && (L.hasClass(x, 'tr-grid') || L.hasClass(x, 'tl-nav'))).map((x) => ({ id: x.attrs.id, classe: x.attrs.class, rotulo_marcacao: (() => { const sib = x.parent.children; const k = sib.indexOf(x); const lb = [...sib.slice(0, k)].reverse().find((y) => L.hasClass(y, 'seg-lb')); return lb ? L.stripTags(L.inner(lb)) : null; })(), linha_aprox: x.line }));
  const readouts = L.byClass(bd, 'ro').map((r) => {
    const k = L.find(r, (x) => L.hasClass(x, 'k'));
    const v = L.find(r, (x) => L.hasClass(x, 'n'));
    return { id: v.attrs.id, rotulo: L.stripTags(L.inner(k)), classe: v.attrs.class, valor_marcacao: L.stripTags(L.inner(v)), origem: L.origem(r, `#${v.attrs.id}`) };
  });
  const verd = L.find(bd, (x) => L.hasClass(x, 'verdict'));
  const panels = L.findAll(bd, (x) => x.attrs?.id && (L.hasClass(x, 'tl-panel') || L.hasClass(x, 'bars'))).map((x) => ({ id: x.attrs.id, classe: x.attrs.class, linha_aprox: x.line }));
  return {
    id_fonte: L.stripTags(L.inner(idn)), titulo: L.stripTags(L.inner(nm)),
    intro: { ...L.lit(intro), origem: L.origem(intro, 'p.inst-intro') },
    nota_de_fonte: note ? { ...L.lit(note), origem: L.origem(note, 'p.srcnote') } : null,
    segs, campos, dinamicos, readouts, veredito_id: verd?.attrs.id ?? null, paineis: panels,
    linhas: [n.line, L.lineOf(n.end)],
    origem: L.origem(n, 'div.inst', L.inner(idn) + ' ' + L.inner(nm)),
  };
}

// ── invocação no texto ───────────────────────────────────────
function localizacao(n) {
  const sec = L.sectionOfLine(n.line);
  const wrap = L.find(sec.node, (x) => L.hasClass(x, 'wrap'));
  const sib = wrap.children; const k = sib.indexOf(n);
  const prev = sib.slice(0, k).reverse().find((x) => !L.hasClass(x, 'inst'));
  const next = sib.slice(k + 1).find((x) => true);
  const h3 = sib.slice(0, k).reverse().find((x) => x.tag === 'h3');
  const txt = (x) => (x ? { elemento: x.tag + (x.attrs.class ? '.' + x.attrs.class.replace(/\s+/g, '.') : ''), trecho: L.trecho(L.inner(x)), linha_aprox: x.line } : null);
  // frases da seção que apontam para instrumento
  const secText = sib.filter((x) => x.tag === 'p' || x.tag === 'h3');
  const pointers = [];
  for (const p of secText) {
    const t = L.stripTags(L.inner(p));
    for (const f of t.split(/(?<=[.:;!?])\s+/)) if (/\b(instrumento|lentes?) abaixo\b|\bna lente\b/i.test(f)) {
      // "abaixo" aponta para o próximo div.inst da seção; "na lente" (depois do Inst · 01) para o anterior
      const insts = sib.filter((x) => L.hasClass(x, 'inst'));
      const alvo = /abaixo/i.test(f) ? insts.find((x) => x.line > p.line) : [...insts].reverse().find((x) => x.line < p.line);
      if (alvo === n) pointers.push({ texto: f, linha_aprox: p.line, posicao: p.line < n.line ? 'antes do instrumento' : 'depois do instrumento' });
    }
  }
  return {
    secao: sec.id, aula: /^a\d\d$/.test(sec.id) ? sec.id.slice(1) : null,
    subsecao: h3 ? L.stripTags(L.inner(h3)) : null,
    antes: txt(prev), depois: txt(next),
    frases_que_apontam_para_instrumento: pointers,
    frases_nota: pointers.length ? 'Varredura /(instrumento|lentes?) abaixo|na lente/ na seção; linha = início do parágrafo.' : 'Nenhuma frase do texto invoca o instrumento (varredura /(instrumento|lentes?) abaixo|na lente/ na seção); o vínculo é só a posição do div.inst (ver antes/depois).',
  };
}

// ── configuração por instrumento (ids de script e código) ───
const CFG = {
  'Inst · 01': { code: 'm11-inst-01', hdr: /INST·01 — MAPA DA PROPOSTA/, mec: 'consulta: 2 seletores (lente × item) → 2 painéis de texto', kindProposto: 'explorador', dados: ['LENTES', 'ITENS'], saidasPainel: ['mp-lens', 'mp-item'], dominio: () => { const r = []; for (const l of ['eixo', 'fonte', 'sozinho', 'falta']) for (const k of ['pot', 'ger', 'deg', 'equip', 'mod', 'data', 'reg', 'tar', 'om', 'gar']) r.push({ src: { 'mp-seg': l, 'mp-grid': k }, code: { 'mp-lente': l, 'mp-item': k } }); return r; }, codeMap: { 'mp-lente': 'mp-seg', 'mp-item': 'mp-grid' } },
  'Inst · 02': { code: 'm11-inst-02', hdr: /INST·02 — SEPARADOR DE EIXOS/, mec: 'consulta: 1 seletor (12 afirmações) → painel de texto (eixo, método, o que não autoriza)', kindProposto: 'explorador', dados: ['A'], saidasPainel: ['se-out'], dominio: () => Array.from({ length: 12 }, (_, i) => ({ src: { 'se-grid': `a${i + 1}` }, code: { 'se-a': `a${i + 1}` } })), codeMap: { 'se-a': 'se-grid' } },
  'Inst · 03': { code: 'm11-inst-03', hdr: /INST·03 — RÉGUA DO MARCO/, mec: 'consulta: 1 seletor (7 marcos) → painel de texto (4 campos)', kindProposto: 'explorador', dados: ['M'], saidasPainel: ['rg-panel'], dominio: () => Array.from({ length: 7 }, (_, i) => ({ src: { 'rg-nav': `m${i + 1}` }, code: { 'rg-m': `m${i + 1}` } })), codeMap: { 'rg-m': 'rg-nav' } },
  'Inst · 04': { code: 'm11-inst-04', hdr: /INST·04 — CLASSIFICADOR/, mec: '1 número + 2 seletores → 3 saídas de texto + veredito por parágrafos', kindProposto: 'simulador', dados: ['MOD'], saidasPainel: [], dominio: () => { const r = []; for (const p of [1, 50, 75, 76, 100, 180, 500, 501, 750, 1000, 1001, 2000, 3000, 3001, 4000, 5000, 5001, 6000]) for (const f of ['solar', 'solarbat', 'desp']) for (const a of ['local', 'remoto', 'compart', 'emuc']) r.push({ src: { 'cl-pot': p, 'cl-fonte': f, 'cl-arr': a }, code: { 'cl-pot': p, 'cl-fonte': f, 'cl-arr': a } }); return r; }, codeMap: {} },
  'Inst · 05': { code: 'm11-inst-05', hdr: /INST·05 — ROTEADOR DE REGIME/, mec: '3 seletores + 1 número (ano) → 3 saídas de texto + veredito por parágrafos', kindProposto: 'simulador', dados: ['ESC'], saidasPainel: [], dominio: () => { const r = []; for (const d of ['ate2022', 'doze', 'semestre', 'depois']) for (const p of ['micro', 'mini500', 'mini500mais']) for (const m of ['localemuc', 'pulv', 'conc']) for (let ano = 2023; ano <= 2032; ano++) r.push({ src: { 'rr-data': d, 'rr-porte': p, 'rr-mod': m, 'rr-ano': ano }, code: { 'rr-data': d, 'rr-porte': p, 'rr-mod': m, 'rr-ano': ano } }); return r; }, codeMap: {} },
  'Inst · 06': { code: 'm11-inst-06', hdr: /INST 06 · VERIFICADOR DE GERAÇÃO/, mec: '4 números → 3 saídas numéricas + veredito por faixa', kindProposto: 'calculadora', dados: [], saidasPainel: [], dominio: () => { const r = []; for (const pot of [1, 50, 100, 500, 3000]) for (const ger of [1, 50, 100, 130, 145, 160, 175, 190, 250, 400, 1000, 6000]) for (const irr of [2, 4.5, 5.2, 6, 7.5]) for (const pr of [50, 70, 78, 85, 92]) r.push({ src: { 'gv-pot': pot, 'gv-ger': ger, 'gv-irr': irr, 'gv-pr': pr }, code: { 'gv-pot': pot, 'gv-ger': ger, 'gv-irr': irr, 'gv-pr': pr } }); return r; }, codeMap: {} },
  'Inst · 07': { code: 'm11-inst-07', hdr: /INST 07 · VERIFICADOR DE DEGRADAÇÃO/, mec: '4 números → 3 saídas numéricas + veredito por faixa', kindProposto: 'calculadora', dados: [], saidasPainel: [], dominio: () => { const r = []; for (const prop of [0, 0.05, 0.3, 0.4, 0.55, 0.6, 0.65, 0.85, 0.9, 1, 2]) for (const ds of [0, 0.3, 0.55, 0.8, 2]) for (const y1 of [0, 0.1, 2, 5]) for (const hz of [5, 25, 30]) r.push({ src: { 'dg-prop': prop, 'dg-ds': ds, 'dg-y1': y1, 'dg-hz': hz }, code: { 'dg-prop': prop, 'dg-ds': ds, 'dg-y1': y1, 'dg-hz': hz } }); return r; }, codeMap: {} },
  'Inst · 08': { code: 'm11-inst-08', hdr: /INST 08 · VERIFICADOR DE TRAJETÓRIA/, mec: '3 números + 1 seletor → 3 saídas numéricas + veredito por faixa', kindProposto: 'calculadora', dados: [], saidasPainel: [], dominio: () => { const r = []; for (const p of [0, 3, 6, 6.25, 6.5, 6.75, 7, 7.5, 7.75, 9, 20]) for (const h of [0, 5.5, 6, 6.5, 20]) for (const hz of [5, 20, 30]) for (const anc of ['fonte', 'soi', 'nada']) r.push({ src: { 'tt-prop': p, 'tt-hist': h, 'tt-hz': hz, 'tt-anc': anc }, code: { 'tt-prop': p, 'tt-hist': h, 'tt-hz': hz, 'tt-anc': anc } }); return r; }, codeMap: {} },
  'Inst · 09': { code: 'm11-inst-09', hdr: /INST 09 · ANATOMIA DOS OITO SINAIS/, mec: 'consulta: 1 seletor (8 sinais) → painel de texto (4 campos)', kindProposto: 'explorador', dados: ['S', 'ordem'], saidasPainel: ['sa-out'], dominio: () => ['ger', 'fin', 'deg', 'tar', 'cert', 'gar', 'oem', 'reg'].map((k) => ({ src: { 'sa-grid': k }, code: { 'sa-s': k } })), codeMap: { 'sa-s': 'sa-grid' } },
  'Inst · 10': { code: 'm11-inst-10', hdr: /INST 10 · ROTEADOR DE VEREDITO/, mec: '4 seletores de estado (3 opções cada, 81 combinações) → classe de veredito por precedência + redação + próximo passo', kindProposto: 'quebra-cabeca (código) — a taxonomia só cobre M01-M07; a mecânica (chaves categóricas → classe) é a mais próxima de quebra-cabeca', dados: ['E1', 'E2', 'E3', 'E4'], saidasPainel: [], dominio: () => { const r = []; for (const a of ['ok', 'desvio', 'falta']) for (const b of ['ok', 'erro', 'falta']) for (const c of ['ok', 'solta', 'omissa']) for (const d of ['ok', 'lacuna', 'ausente']) r.push({ src: { 'rv-e1': a, 'rv-e2': b, 'rv-e3': c, 'rv-e4': d }, code: { 'rv-e1': a, 'rv-e2': b, 'rv-e3': c, 'rv-e4': d } }); return r; }, codeMap: {} },
  'Inst · 11': { code: 'm11-inst-11', hdr: /INST 11 · ORDEM DE AVALIAÇÃO/, mec: 'consulta: 1 navegação (8 passos) → painel de texto + barras de tempo (desenho)', kindProposto: 'explorador', dados: ['P'], saidasPainel: ['or-panel', 'or-bars'], dominio: () => Array.from({ length: 8 }, (_, i) => ({ src: { 'or-nav': String(i) }, code: { 'or-p': String(i) } })), codeMap: { 'or-p': 'or-nav' } },
};

// ── execução do original ─────────────────────────────────────
const dom0 = L.buildDom();
function lerSaidas(reg, mk) {
  const o = {};
  for (const r of mk.readouts) o[r.id] = { textContent: reg[r.id].textContent, innerHTML: reg[r.id].innerHTML || null, classe: reg[r.id].className };
  for (const p of mk.paineis) o[p.id] = { innerHTML: reg[p.id].innerHTML };
  if (mk.veredito_id) o[mk.veredito_id] = { innerHTML: reg[mk.veredito_id].innerHTML, classe: reg[mk.veredito_id].className };
  for (const d of mk.dinamicos) o[d.id] = { botoes: reg[d.id].children.map((b) => ({ ...Object.fromEntries(Object.entries(b.attrs).filter(([k]) => k.startsWith('data-'))), rotulo: b.textContent, on: b.classList.contains('on') })) };
  return o;
}
const readoutText = (s, r) => (r.id === 'rr-estado' ? s[r.id].innerHTML : s[r.id].textContent);
const codeDisplay = (v, unit) => (v === undefined ? '—' : `${unit === 'R$' ? 'R$ ' : ''}${v.toLocaleString('pt-BR', { maximumFractionDigits: unit === 'R$' ? 0 : 2 })}${unit && unit !== 'R$' ? ' ' + unit : ''}`);
const ptNum = (s) => parseFloat(String(s).replace(/[^\d,+-]/g, '').replace(',', '.'));

const instrumentos = [];
const divergencias = [];
for (const n of instNodes) {
  const mk = marcacao(n);
  const cfg = CFG[mk.id_fonte];
  if (!cfg) fail(`sem cfg ${mk.id_fonte}`);
  const blk = scriptBlock(cfg.hdr);
  const codigo = L.linesText(blk.a, blk.b);
  // dados (literais avaliados)
  const dados = {};
  for (const nome of cfg.dados) {
    const a = L.findLine(new RegExp(`var ${nome}=`), blk.a, blk.b);
    let b = a;
    const open = L.LINES[a - 1].includes('[') && !L.LINES[a - 1].trim().endsWith('];') && !L.LINES[a - 1].trim().endsWith('};') ;
    if (open || !/;\s*$/.test(L.LINES[a - 1])) {
      let dep = 0;
      for (b = a; b <= blk.b; b++) { const t = L.LINES[b - 1]; dep += (t.match(/[[{]/g) || []).length - (t.match(/[\]}]/g) || []).length; if (dep <= 0 && /[\]}];\s*$/.test(t)) break; }
    }
    const txt = L.linesText(a, b);
    const body = txt.slice(txt.indexOf('=') + 1).replace(/;\s*$/, '');
    dados[nome] = { valor: new Function(`return (${body});`)(), linhas: [a, b] };
  }
  // entradas lidas do script (numOf / segVal)
  const leitura = [];
  for (let k = blk.a; k <= blk.b; k++) {
    const t = L.LINES[k - 1];
    for (const m of t.matchAll(/numOf\(\$id\('([\w-]+)'\),([\d.]+),([\d.]+),([\d.]+)\)/g)) leitura.push({ id: m[1], funcao: 'numOf', padrao_script: Number(m[2]), clamp_min: Number(m[3]), clamp_max: Number(m[4]), arredonda: /Math\.round\(numOf/.test(t), codigo: t.trim(), linha_aprox: k });
    for (const m of t.matchAll(/segVal\('([\w-]+)','(data-\w)'\)\|\|'(\w+)'/g)) leitura.push({ id: m[1], funcao: 'segVal', atributo: m[2], padrao_script: m[3], codigo: t.trim(), linha_aprox: k });
  }
  // fórmulas e atribuições de saída
  const calcA = L.findLine(/function calc\(\)\{/, blk.a, blk.b);
  const formulas = [];
  const saidasScript = [];
  for (let k = blk.a; k <= blk.b; k++) {
    const t = L.LINES[k - 1];
    if (calcA && k > calcA && /^\s*var [\w, ]*=|^\s*var \w+=/.test(t) && !/numOf|segVal|\$id\('[\w-]+-vd'\)|var cls|var classe|var cab|var teto|var porte|var m=MOD|var t=\[\]/.test(t)) formulas.push({ codigo: t.trim(), linha_aprox: k });
    if (/function serie|var p=\(1-y1\/100\)|acc\+=p/.test(t)) formulas.push({ codigo: t.trim(), linha_aprox: k });
    const m = t.match(/\$id\('([\w-]+)'\)\.(textContent|innerHTML)=(.*);\s*$/);
    if (m && !/-vd'\)/.test(t)) saidasScript.push({ id: m[1], propriedade: m[2], codigo: m[3], linha_aprox: k });
  }
  const rs = calcA ? ramos(calcA, blk.b) : [];
  // autoverificação: todo t.push do bloco virou ramo; todo ramo-literal é substring do script avaliado
  const nPush = (L.linesText(blk.a, blk.b).match(/t\.push\(/g) || []).length;
  if (rs.filter((r) => r.tipo === 'paragrafo_do_veredito').length !== nPush) fail(`${mk.id_fonte}: ${nPush} t.push, ramos ${rs.filter((r) => r.tipo === 'paragrafo_do_veredito').length}`);
  // render (consulta)
  const renderA = L.findLine(/function render\(/, blk.a, blk.b);
  const renderCodigo = renderA ? L.LINES.slice(renderA - 1, blk.b).join('\n').match(/function render\([\s\S]*?\n  \}/)?.[0] ?? null : null;

  // cenário-padrão (carga)
  const padrao = lerSaidas(dom0.reg, mk);

  // confronto com o código em todo o domínio
  const calcFn = CALC[cfg.code];
  const casos = cfg.dominio();
  let iguaisVer = 0, iguaisTexto = 0, iguaisNum = 0, iguaisDisplay = 0, checaNum = 0;
  const exemplos = [];
  for (const c of casos) {
    const { reg } = L.buildDom();
    L.setState(reg, c.src);
    const s = lerSaidas(reg, mk);
    const r = calcFn(c.code);
    const srcTxt = words([...mk.readouts.map((x) => readoutText(s, x)), ...mk.paineis.filter((p) => p.id !== 'or-bars').map((p) => s[p.id].innerHTML), mk.veredito_id ? s[mk.veredito_id].innerHTML : ''].join(' '));
    const codeTxt = words(r.veredito ?? '');
    const srcVerHtml = mk.veredito_id ? s[mk.veredito_id].innerHTML : null;
    // texto: palavras da fonte ⊆ palavras do código em ordem (código acrescenta rótulos)
    const okTexto = codeTxt.includes(words(srcVerHtml ?? '')) && mk.readouts.filter((x) => !(CODE_INSTS.get(cfg.code)?.inst.outputs ?? []).some((o) => o.id === x.id)).every((x) => codeTxt.includes(words(readoutText(s, x)))) && mk.paineis.filter((p) => p.id !== 'or-bars').every((p) => { const w = words(s[p.id].innerHTML); return codeTxt.replace(/[.:]/g, '').includes(w.replace(/[.:]/g, '')) || codeTxt === w; });
    const okVer = srcVerHtml !== null && (r.veredito === srcVerHtml || (r.veredito ?? '').endsWith(srcVerHtml));
    if (okTexto) iguaisTexto++;
    if (okVer) iguaisVer++;
    let okNum = true, okDisp = true;
    const outs = CODE_INSTS.get(cfg.code)?.inst.outputs ?? [];
    for (const o of outs) {
      checaNum++;
      const st = s[o.id].textContent;
      const casas = (st.split(',')[1] || '').replace(/\D/g, '').length;
      const v = r.valores[o.id];
      const numFonte = (st.match(/-?[\d.]+(?:,\d+)?/) || [''])[0];
      const eq = v !== undefined && v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }) === numFonte;
      if (eq) iguaisNum++; else okNum = false;
      if (codeDisplay(v, o.unit).replace(/\s/g, '') === st.replace(/\s/g, '')) iguaisDisplay++; else okDisp = false;
    }
    if ((!okTexto || !okNum) && exemplos.length < 3) exemplos.push({ entrada: c.src, fonte: srcTxt.slice(0, 300), codigo: codeTxt.slice(0, 300) });
  }
  const outsCode = CODE_INSTS.get(cfg.code)?.inst.outputs ?? [];
  // exemplos de formatação (código × fonte) no cenário-padrão
  const rPad = calcFn({});
  const formatacao = outsCode.map((o) => ({ id: o.id, fonte: padrao[o.id].textContent, codigo_exibido: codeDisplay(rPad.valores[o.id], o.unit), valor_codigo: rPad.valores[o.id] }));

  // campos do código × fonte
  const ci = CODE_INSTS.get(cfg.code);
  const campoFonte = (id) => {
    const sid = cfg.codeMap[id] ?? id;
    const sg = mk.segs.find((x) => x.id === sid); if (sg) return { rotulo: sg.rotulo, unidade: null, opcoes: sg.opcoes.map((o) => [o.valor, o.rotulo]), padrao: sg.padrao, min: null, max: null, step: null };
    const cp = mk.campos.find((x) => x.id === sid); if (cp) return { rotulo: cp.rotulo, unidade: cp.unidade, opcoes: null, padrao: cp.padrao, min: cp.min, max: cp.max, step: cp.step };
    const dn = mk.dinamicos.find((x) => x.id === sid); if (dn) return { rotulo: dn.rotulo_marcacao, unidade: null, opcoes: padrao[sid].botoes.map((b) => [b['data-i'] ?? b['data-a'] ?? b['data-m'] ?? b['data-s'], b.rotulo]), padrao: null, min: null, max: null, step: null };
    return null;
  };
  const camposCmp = (ci?.inst.fields ?? []).map((f) => {
    const fo = campoFonte(f.id);
    const opCod = f.options?.map((o) => [String(o.value), o.label]) ?? null;
    return {
      id_codigo: f.id, id_fonte: cfg.codeMap[f.id] ?? f.id,
      rotulo_codigo: f.label, rotulo_fonte: fo?.rotulo ?? null, rotulo_igual: fo ? f.label === fo.rotulo : false,
      unidade_codigo: f.unit, unidade_fonte: fo?.unidade ?? null,
      kind_codigo: f.kind,
      padrao_codigo: f.defaultValue, padrao_fonte: fo?.padrao ?? null,
      faixa_codigo: [f.min ?? null, f.max ?? null, f.step ?? null], faixa_fonte: fo ? [fo.min, fo.max, fo.step] : null,
      opcoes_iguais: opCod && fo?.opcoes ? JSON.stringify(opCod) === JSON.stringify(fo.opcoes.map(([v, r]) => [String(v), r])) : null,
      opcoes_divergentes: opCod && fo?.opcoes ? opCod.filter(([v, r]) => { const x = fo.opcoes.find(([vv]) => String(vv) === v); return !x || x[1] !== r; }).map(([v, r]) => ({ valor: v, codigo: r, fonte: fo.opcoes.find(([vv]) => String(vv) === v)?.[1] ?? null })) : null,
    };
  });
  const saidasCmp = outsCode.map((o) => {
    const ro = mk.readouts.find((x) => x.id === o.id);
    return { id: o.id, rotulo_codigo: o.label, rotulo_fonte: ro?.rotulo ?? null, rotulo_igual: ro ? ro.rotulo === o.label : false, unidade_codigo: o.unit };
  });
  const faltaIntro = !(ci?.inst.note && S(ci.inst.note) === mk.intro.texto);
  const noteNoConteudo = mk.nota_de_fonte ? CONTENT.replace(/\\"/g, '"').includes(mk.nota_de_fonte.texto.slice(0, 60)) : null;
  const introNoConteudo = CONTENT.replace(/\\"/g, '"').includes(mk.intro.texto.slice(0, 60));
  const loc = localizacao(n);
  const aulaCodigo = ci?.modulo ? 'módulo (MODULO_11_INSTRUMENTOS)' : ci?.aula ?? null;
  const aulaFonte = loc.aula ? `aula-11-${loc.aula}` : 'módulo (§MAP)';
  const aulaIgual = ci ? (ci.modulo ? loc.aula === null : ci.aula === aulaFonte) : false;

  const probs = [];
  if (!ci) probs.push('instrumento ausente do código');
  if (!aulaIgual) probs.push(`aula divergente (${aulaCodigo} × ${aulaFonte})`);
  if (iguaisTexto !== casos.length) probs.push(`texto divergente em ${casos.length - iguaisTexto}/${casos.length} casos`);
  if (outsCode.length && iguaisNum !== checaNum) probs.push(`valor numérico divergente em ${checaNum - iguaisNum}/${checaNum} saídas`);
  if (outsCode.length && iguaisDisplay !== checaNum) probs.push(`formatação exibida diverge da fonte em ${checaNum - iguaisDisplay}/${checaNum} saídas (painel usa até 2 casas, sem sinal)`);
  const labDiv = camposCmp.filter((c) => !c.rotulo_igual || c.opcoes_iguais === false);
  if (labDiv.length) probs.push(`rótulos/opções de campo não literais: ${labDiv.map((c) => c.id_codigo).join(', ')}`);
  const saiDiv = saidasCmp.filter((c) => !c.rotulo_igual);
  if (saiDiv.length) probs.push(`rótulos de saída não literais: ${saiDiv.map((c) => c.id).join(', ')}`);
  if (mk.readouts.length && !outsCode.length) probs.push(`saídas de texto da fonte (${mk.readouts.map((r) => r.id).join(', ')}) sem slot em outputs; vão no veredito com rótulo composto`);
  if (mk.veredito_id) probs.push('classe do veredito (ok/att/per) descartada no código (`void cls`)');
  if (faltaIntro) probs.push(`p.inst-intro não portado no instrumento (note ${ci?.inst.note ? 'difere' : 'null'}${introNoConteudo ? '; texto presente em outro ponto do conteúdo' : ''})`);
  if (mk.nota_de_fonte && !noteNoConteudo) probs.push('p.srcnote não portado');
  if (ci && ci.inst.formula === null && formulas.length && outsCode.length) probs.push('formula: null no código; a fonte tem fórmula só no script (sem div.formula na marcação)');
  const status = !ci ? 'não portado' : probs.length ? 'divergente' : 'portado';

  const item = {
    id: cfg.code, id_fonte: mk.id_fonte, titulo: mk.titulo,
    mecanica: cfg.mec, kind_codigo: ci?.inst.kind ?? null, kind_nota: cfg.kindProposto,
    pergunta: null,
    pergunta_nota: 'A prancha não tem pergunta própria (zero "?" em inst-intro e srcnote). A intenção declarada está em intro (literal). Pergunta de previsão seria camada Alexandria (P3/P11/P19).',
    intro: mk.intro, nota_de_fonte: mk.nota_de_fonte,
    localizacao: { ...loc, linhas_marcacao: mk.linhas, aula_id_codigo_esperado: aulaFonte },
    entradas: {
      campos_numericos: mk.campos.map((c) => ({ ...c, leitura_script: leitura.find((x) => x.id === c.id) ?? null })),
      seletores: mk.segs.map((c) => ({ ...c, leitura_script: leitura.find((x) => x.id === c.id) ?? null })),
      seletores_dinamicos: mk.dinamicos.map((d) => ({ ...d, opcoes_geradas_no_carregamento: padrao[d.id].botoes })),
    },
    saidas: {
      readouts: mk.readouts.map((r) => ({ ...r, atribuicao_script: saidasScript.filter((x) => x.id === r.id) })),
      paineis: mk.paineis,
      veredito_id: mk.veredito_id,
      formulas_exatas_script: formulas,
    },
    dados_do_script: Object.fromEntries(Object.entries(dados).map(([k, v]) => [k, { linhas: v.linhas, valor: v.valor }])),
    render_script: renderCodigo,
    ramos_do_veredito: rs,
    script: { cabecalho: blk.cabecalho, linhas: [blk.a, blk.b], codigo_verbatim: codigo },
    cenario_padrao: {
      entradas: Object.fromEntries([...mk.campos.map((c) => [c.id, c.padrao]), ...mk.segs.map((s) => [s.id, s.padrao]), ...mk.dinamicos.map((d) => [d.id, (padrao[d.id].botoes.find((b) => b.on) || {})])]),
      saidas_no_carregamento: padrao,
      metodo: 'Script original executado em DOM simulado (m11_lib.buildDom); os valores da marcação ("—") são sobrescritos no carregamento.',
      fonte_dos_numeros: null,
      fonte_dos_numeros_nota: 'A fonte não declara procedência dos valores-padrão (value=) nem dos limiares dos ramos. O que declara está em nota_de_fonte (literal): base normativa/consulta, e — em Inst 06, 07 e 08 — "Instrumento didático e ilustrativo" / "Instrumento didático". P19: tratar como cenário didático sem fonte externa declarada.',
    },
    tolerancias: null,
    tolerancias_nota: 'Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.',
    comparacao_codigo: {
      status, problemas: probs,
      aula_codigo: aulaCodigo, aula_fonte: aulaFonte, aula_igual: aulaIgual,
      campos: camposCmp, saidas: saidasCmp,
      formatacao_padrao: formatacao,
      confronto_execucao: { casos: casos.length, texto_igual: iguaisTexto, veredito_html_igual: mk.veredito_id ? iguaisVer : null, saidas_numericas_checadas: checaNum, valor_numerico_igual: iguaisNum, exibicao_igual: iguaisDisplay, exemplos_divergentes: exemplos, metodo: 'Para cada caso, o script ORIGINAL roda em DOM simulado (setState clica os botões e dispara input nos campos) e a calculadora do código roda com as mesmas entradas. texto_igual: as palavras de cada readout, painel e veredito da fonte aparecem, na ordem, no veredito do código. valor_numerico_igual: valor do código formatado com as casas da fonte (toLocaleString pt-BR) = número exibido pela fonte. Saídas numéricas ficam fora de texto_igual porque o código as entrega em valores, não no veredito.' },
      intro_no_instrumento_codigo: !faltaIntro, intro_em_outro_ponto_do_conteudo: introNoConteudo, srcnote_no_conteudo: noteNoConteudo,
      calculadora_linha: L.lineInFile(CALC_TS, `'${cfg.code}': (i)`),
    },
  };
  instrumentos.push(item);
}

// ── divergências fonte × fonte dos instrumentos ─────────────
const byId = (id) => instrumentos.find((x) => x.id === id);
const i4 = byId('m11-inst-04'), i5 = byId('m11-inst-05'), i2 = byId('m11-inst-02'), i7 = byId('m11-inst-07'), i11 = byId('m11-inst-11');
const D = (id, sev, tema, a, b, nota) => divergencias.push({ id, severidade: sev, tema, leitura_a: a, leitura_b: b, nota, decisao: 'não escolhida nesta camada (fonte) — registrar' });
{
  const ln = L.findLine(/Autoproducao por equiparacao e outro regime juridico/);
  D('div-m11-inst-01-acentos', 'baixa', 'Inst · 02, afirmação a12: texto sem acentos', { onde: `script L${ln}`, texto: 'Autoproducao por equiparacao e outro regime juridico, de outro universo de consumidor.' }, { onde: 'resto do arquivo', texto: 'autoprodução por equiparação … regime jurídico (com acentos, ex. Aula 01 L794)' }, `Defeito de digitação da fonte; literal preservado aqui. O código (M11_SEPARADOR_EIXOS em alexandria-modulo-11-content.ts) ${CONTENT.includes('Autoproducao por equiparacao e outro regime juridico') ? 'herdou o mesmo texto sem acentos' : 'não tem o texto sem acentos'}.`);
  const l1 = L.findLine(/if\(pot>1000\)t\.push\('<b>Garantia de fiel cumprimento\.<\/b> Para centrais de 1\.000 kW ou mais/);
  D('div-m11-inst-02-limiar-1000', 'média', 'Inst · 04: condição × texto no limiar de 1.000 kW', { onde: `script L${l1}`, texto: 'if(pot>1000) → "Para centrais de 1.000 kW ou mais… cinco por cento"' }, { onde: `script L${l1 + 1}`, texto: 'else if(pot>500) → "acima de 500 kW e abaixo de 1.000 kW… dois e meio por cento"' }, 'Com pot = 1000 exatos, o ramo executado é o de "abaixo de 1.000 kW" (2,5%), contra o texto do outro ramo e o § Lex ("cinco por cento a partir de 1.000 kW"). Confirmado executando o original com cl-pot=1000.');
  const l2 = L.findLine(/if\(ano>2045\)\{/);
  D('div-m11-inst-03-ramo-inalcancavel', 'baixa', 'Inst · 05: ramo "ano>2045" inalcançável', { onde: `script L${l2}`, texto: 'if(ano>2045){ cls=\'att\'; … "Além do horizonte do direito adquirido." }' }, { onde: 'rr-ano (marcação e numOf)', texto: 'min 2023, max 2032; numOf clampa em [2023, 2032]' }, 'Texto que nenhuma entrada exibe. Resíduo do original (§10), não corrigido.');
  const l3 = L.findLine(/Informe a data de protocolo do pedido de acesso, o porte, a fonte, a/);
  D('div-m11-inst-04-intro-fonte', 'baixa', 'Inst · 05: intro promete entrada "fonte" separada', { onde: `inst-intro L${l3}`, texto: 'Informe a data de protocolo do pedido de acesso, o porte, a fonte, a modalidade e a concentração de participação no excedente.' }, { onde: 'marcação', texto: 'só 3 seletores: data, "Porte e fonte" (fonte embutida só na opção "Minigeração acima de 500 kW, não despachável") e "Modalidade e concentração do excedente"' }, 'Fonte não despachável só é modelada no porte >500 kW.');
  const l4 = L.findLine(/\$id\('dg-gap'\)\.textContent=\(gap>=0\?'':''\)/);
  D('div-m11-inst-05-residuo-gap', 'baixa', 'Inst · 07: expressão sem efeito', { onde: `script L${l4}`, texto: "(gap>=0?'':'')+fmt(gap,1)+'%'" }, { onde: 'Inst · 06/08', texto: "(x>=0?'+':'') — sinal explícito" }, 'Resíduo (§10): o prefixo é vazio nos dois ramos; valor negativo sai com "-" do toLocaleString.');
  D('div-m11-inst-06-sinc', 'alta', 'Inst · 11 marca 2 pontos de sincronização; a prosa da Aula 08 diz três', { onde: 'Inst · 11 P[] sinc:true', texto: 'passos 04 e 08' }, { onde: 'Aula 08 lede e 08.3', texto: 'três pontos de sincronização' }, 'Mesmo registro de modulo.json div-m11-02.');
  const l5 = L.findLine(/'<b>Estado de regulamentação:<\/b> '/);
  D('div-m11-inst-07-regua-seis-sete', 'baixa', 'Inst · 03 "sete marcos" × Aula 02 "seis instrumentos"', { onde: 'Inst · 03 título', texto: i4 && byId('m11-inst-03').titulo }, { onde: 'Aula 02 h2', texto: 'De 2012 a 2025: seis instrumentos, duas pendências e duas fronteiras' }, 'Ver modulo.json div-m11-04.');
  D('div-m11-inst-08-unidade-pot', 'baixa', 'Unidade da potência: Inst · 06 × Inst · 04', { onde: 'Inst · 06 gv-pot', texto: 'Potência instalada declarada (kWp)' }, { onde: 'Inst · 04 cl-pot, erro comum 3, glossário', texto: 'Potência instalada em corrente alternada (kW); potência de pico (kWp) é outra grandeza' }, 'O Inst · 06 usa a potência de pico dos módulos (coerente com a conta de geração), mas o rótulo "Potência instalada" é o nome que o módulo reserva para a grandeza em CA. Registrado, não resolvido.');
}
// verificação do limiar 1000 executando o original
{
  const { reg } = L.buildDom();
  L.setState(reg, { 'cl-pot': 1000, 'cl-fonte': 'solar', 'cl-arr': 'local' });
  const v = reg['cl-vd'].innerHTML;
  divergencias.find((d) => d.id === 'div-m11-inst-02-limiar-1000').execucao_pot_1000 = /abaixo de 1\.000 kW/.test(v) ? 'ramo "abaixo de 1.000 kW" (2,5%) exibido' : 'ramo 5% exibido';
}

// ── catálogo canônico × fonte (nome do instrumento) ─────────
{
  const CAT = fs.readFileSync(L.CATALOGO, 'utf8');
  const sec = CAT.slice(CAT.indexOf('## Módulo 11'), CAT.indexOf('## Módulo 12'));
  const rows = sec.split('\n').filter((l) => /^\| Inst · \d\d \|/.test(l)).map((l) => l.split('|').map((c) => c.trim()));
  for (const x of instrumentos) {
    const r = rows.find((c) => c[1] === x.id_fonte);
    const nome = r ? r[2] : null;
    x.comparacao_catalogo = {
      nome_catalogo: nome,
      descricao_catalogo: r ? r[3] : null,
      nome_igual_titulo: nome === x.titulo,
      catalogo_e_prefixo_do_titulo: nome != null && x.titulo.startsWith(nome),
      status: nome == null ? 'ausente no catálogo' : nome === x.titulo ? 'idêntico' : x.titulo.startsWith(nome) ? 'catálogo abrevia o título da fonte' : 'divergente',
    };
  }
  for (const x of instrumentos.filter((y) => y.comparacao_catalogo.status === 'divergente')) {
    D(`div-m11-inst-09-catalogo-${x.id.slice(-2)}`, 'baixa', `${x.id_fonte}: nome no catálogo canônico × título da fonte`,
      { onde: `div.inst .inst-hd .nm (L${x.localizacao.linhas_marcacao[0]})`, texto: x.titulo },
      { onde: 'catalogo-modulos-alexandria.md, Módulo 11 › Instrumentos', texto: x.comparacao_catalogo.nome_catalogo },
      `O complemento do catálogo não é o da prancha. ${/instrumento assinatura/.test(x.intro?.texto ?? '') ? `"instrumento assinatura" vem do p.inst-intro (L${x.intro.origem.linha_aprox}: "Este é o instrumento assinatura do módulo"), não do título.` : ''}`.trim());
  }
}

const contagens = {
  instrumentos: instrumentos.length,
  no_map_fora_de_aula: instrumentos.filter((x) => x.localizacao.aula === null).length,
  em_aula: instrumentos.filter((x) => x.localizacao.aula !== null).length,
  por_aula: instrumentos.reduce((a, x) => ((a[x.localizacao.aula ?? 'MAP'] = (a[x.localizacao.aula ?? 'MAP'] || 0) + 1), a), {}),
  campos_numericos: instrumentos.reduce((a, x) => a + x.entradas.campos_numericos.length, 0),
  seletores: instrumentos.reduce((a, x) => a + x.entradas.seletores.length, 0),
  seletores_dinamicos: instrumentos.reduce((a, x) => a + x.entradas.seletores_dinamicos.length, 0),
  readouts: instrumentos.reduce((a, x) => a + x.saidas.readouts.length, 0),
  vereditos: instrumentos.filter((x) => x.saidas.veredito_id).length,
  paragrafos_de_veredito_no_script: instrumentos.reduce((a, x) => a + x.ramos_do_veredito.filter((r) => r.tipo === 'paragrafo_do_veredito').length, 0),
  status: instrumentos.reduce((a, x) => ((a[x.comparacao_codigo.status] = (a[x.comparacao_codigo.status] || 0) + 1), a), {}),
  casos_confrontados: instrumentos.reduce((a, x) => a + x.comparacao_codigo.confronto_execucao.casos, 0),
  divergencias: divergencias.length,
};
L.writeJson('instrumentos.json', {
  schema: 'alexandria-v2/extraction/instrumentos@1', modulo: 'm11', grupo: 'instrumentos', camada: 'fonte',
  fonte: { arquivo: L.SRC, linhas_total: L.LINES.length, script_linhas: [L.SCRIPT_LINE0, L.findLine(/<\/script>/)] },
  metodo: 'extratores/m11_instrumentos.mjs — marcação por árvore; dados avaliados dos literais do <script>; cenário-padrão e confronto por EXECUÇÃO do script original em DOM simulado; código atual empacotado com esbuild (só leitura).',
  convencoes: { texto_template: 'concatenação JS com partes literais avaliadas e partes variáveis entre chaves {expr}', caminho: 'cadeia de condições literais do script até o ramo; [após: …] lista os ramos irmãos anteriores', linha_aprox: 'linha 1-based do HTML-fonte' },
  contagens, instrumentos, divergencias,
});
console.log(JSON.stringify(contagens));
for (const x of instrumentos) console.log(x.id, x.comparacao_codigo.status, JSON.stringify(x.comparacao_codigo.confronto_execucao).slice(0, 200), '\n   ', x.comparacao_codigo.problemas.join(' | '));
