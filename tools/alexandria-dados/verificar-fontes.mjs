// Confere src/lib/alexandria/fontes.dados.ts contra a extração, SEM reusar a
// lógica do gerador: lê o .ts como texto, extrai os dois arrays e confere cada
// string contra o JSON cru do próprio item (e do grupo dele) na extração.
//
// Falha se alguém editar o .ts à mão e acrescentar uma palavra que não está
// na fonte, se a contagem não bater com o total que a extração declara, ou se
// ids/ordens estiverem quebrados.
//
// Uso: node tools/alexandria-dados/verificar-fontes.mjs   (sai 1 se houver falha)

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const EXT = path.join(RAIZ, 'docs/alexandria-v2/extraction');
const TS = path.join(RAIZ, 'src/lib/alexandria/fontes.dados.ts');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(EXT, p), 'utf8'));

// ── 1. Ler o .ts como texto: os arrays são JSON puro entre `= [` e `];`.
const fonteTs = fs.readFileSync(TS, 'utf8');
function arrayDe(nome) {
  const ini = fonteTs.indexOf(`export const ${nome}`);
  if (ini < 0) throw new Error(`${nome} não encontrado no .ts`);
  const abre = fonteTs.indexOf('= [', ini) + 2;
  const fecha = fonteTs.indexOf('\n];', abre);
  return JSON.parse(fonteTs.slice(abre, fecha + 2));
}
const FONTES = arrayDe('FONTES_DO_CURRICULO');
const REFS = arrayDe('REFS_DOS_MODULOS');
const OMITIDAS = arrayDe('FONTES_INTERNAS_OMITIDAS');

// Vocabulário que não pode chegar ao learner (mesmas listas do auditor
// alexandria-no-internal-vocabulary). Item interno = `interna: true` ou cita
// a marca antiga em qualquer texto cru (fora de origem e notas do extrator).
const MARCA_MORTA = /\bgrid\s?alpha\b/i;
const CODIGO_DE_SECAO = /§\s?(?:00|MAP|Final|Caso|Quiz|Lab|Drill|Lex|Ref)\b/i;
const OUTRO_VOCABULARIO = /\bextra[çc][ãa]o\b|\bextra[íi]d[oa]s?\s+do\s+HTML\b|\baulas\s+confirmadas\b|\ba\s+fonte\s+declara\b|\bbackend\b|\bwave\b|\bmock(?:s|ado|ada|ados|adas)?\b/i;
function textosDoItem(no, chave = '', out = []) {
  if (/^origem$|nota/i.test(chave)) return out;
  if (typeof no === 'string') out.push(no);
  else if (Array.isArray(no)) no.forEach((v) => textosDoItem(v, '', out));
  else if (no && typeof no === 'object') for (const [k, v] of Object.entries(no)) textosDoItem(v, k, out);
  return out;
}
const deveSerOmitido = (raw) => raw.interna === true || textosDoItem(raw).some((s) => MARCA_MORTA.test(s));

// ── 2. Normalização usada nos dois lados: tira tag, colapsa espaço.
const norm = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
function strings(no, out = []) {
  if (typeof no === 'string') out.push(norm(no));
  else if (Array.isArray(no)) no.forEach((v) => strings(v, out));
  else if (no && typeof no === 'object') Object.values(no).forEach((v) => strings(v, out));
  return out;
}
function rawStrings(no, out = []) {
  if (typeof no === 'string') out.push(no);
  else if (Array.isArray(no)) no.forEach((v) => rawStrings(v, out));
  else if (no && typeof no === 'object') Object.values(no).forEach((v) => rawStrings(v, out));
  return out;
}

// ── 3. Índice independente: id → { item cru, grupo cru (sem itens) }.
function indexar(refs) {
  const mapa = new Map();
  // Só um elemento de `grupos[]` que contém os próprios itens conta como grupo
  // (o título dele entra no palheiro); o cabeçalho da seção nunca entra.
  const visitar = (no, grupo) => {
    if (Array.isArray(no)) { no.forEach((v) => visitar(v, grupo)); return; }
    if (!no || typeof no !== 'object') return;
    if (typeof no.id === 'string' && /^m\d{2}-ref-\d{2}$/.test(no.id)) { mapa.set(no.id, { item: no, grupo }); return; }
    Object.values(no).forEach((v) => visitar(v, grupo));
  };
  if (Array.isArray(refs)) visitar(refs, null);
  else {
    for (const [k, v] of Object.entries(refs)) {
      if (k === 'grupos' && Array.isArray(v)) {
        for (const g of v) {
          if (g && typeof g === 'object' && Array.isArray(g.itens)) {
            const { itens, ...resto } = g;
            visitar(itens, resto);
          }
        }
      } else visitar(v, null);
    }
  }
  return mapa;
}

// ── 4. Total declarado pela extração, por módulo (onde ele mora em cada esquema).
const TOTAL_DECLARADO = {
  '01': (r) => ({ n: r.total, onde: 'total' }),
  '02': () => null,
  '03': (r) => ({ n: r.total, onde: 'total' }),
  '04': () => null,
  '05': (r) => ({ n: r.total, onde: 'total' }),
  '06': () => null,
  '07': (r) => ({ n: r.contagem_markup, onde: 'contagem_markup', nota: `contagem_prosa diz "${r.contagem_prosa}" (25), a marcação tem ${r.contagem_markup} — divergência da própria fonte` }),
  '08': (r) => ({ n: r.grupos ? null : null, onde: null, nota: `sem total numérico; o título diz "${r.titulo?.texto}"` }),
  '09': (r) => ({ n: r.total, onde: 'total' }),
  '10': (r) => ({ n: Object.values(r.contagem_por_tipo).reduce((a, b) => a + b, 0), onde: 'soma de contagem_por_tipo' }),
  '11': (r) => ({ n: r.total, onde: 'total' }),
  '12': () => ({ n: ler('m12/aparato.json').contagens.referencias.total, onde: 'contagens.referencias.total' }),
  '13': (r) => ({ n: r.grupos.reduce((a, g) => a + g.itens.length, 0), onde: 'soma dos ids em grupos[].itens' }),
  '14': (r) => ({ n: r.total, onde: 'total' }),
  '15': (r) => ({ n: r.total, onde: 'total' }),
  '16': () => null,
  '17': (r) => ({ n: r.total_blocos, onde: 'total_blocos' }),
};

// ── 5. Cabeçalho do módulo: onde cada campo pode morar (strings cruas da seção).
function haystackCabecalho(nn, r) {
  if (nn === '12') {
    const mod = ler('m12/modulo.json');
    const achar = (no) => {
      if (!no || typeof no !== 'object') return null;
      if (!Array.isArray(no) && no.id === 'm12-roteiro-ref') return no;
      for (const v of Object.values(no)) { const a = achar(v); if (a) return a; }
      return null;
    };
    return strings([achar(mod), r]).join('\u0000');
  }
  const { itens, grupos, ...resto } = r;
  return strings(resto).join('\u0000');
}

let falhas = 0;
const linhas = [];
const notas = [];
const falhar = (msg) => { falhas++; linhas.push(`    FALHA ${msg}`); };

// ── 6. ids únicos no arquivo inteiro.
const vistos = new Set();
for (const f of FONTES) {
  if (vistos.has(f.id)) falhar(`id duplicado ${f.id}`);
  vistos.add(f.id);
}
if (REFS.length !== 17) falhar(`REFS_DOS_MODULOS tem ${REFS.length} entradas, esperado 17`);

for (let i = 1; i <= 17; i++) {
  const nn = String(i).padStart(2, '0');
  const r = ler(`m${nn}/aparato.json`).referencias;
  const idx = indexar(r);
  const doModulo = FONTES.filter((f) => f.moduloId === `modulo-${nn}`);
  const antes = falhas;
  const ref = REFS.find((x) => x.moduloId === `modulo-${nn}`);

  // contagem
  const decl = TOTAL_DECLARADO[nn](r);
  const nIdx = idx.size;
  let contagem = `${doModulo.length} itens (extração: ${nIdx} itens com id`;
  if (decl?.n != null) {
    contagem += `; declarado ${decl.n} em ${decl.onde})`;
    if (decl.n !== nIdx) notas.push(`M${nn}: total declarado (${decl.n}) ≠ itens na extração (${nIdx}) — nota, não falha`);
  } else contagem += '; sem total declarado)';
  if (decl?.nota) notas.push(`M${nn}: ${decl.nota}`);
  const omit = OMITIDAS.find((o) => o.moduloId === `modulo-${nn}`);
  if (!omit) falhar(`M${nn}: sem entrada em FONTES_INTERNAS_OMITIDAS`);
  const nOmit = omit?.total ?? 0;
  if (nOmit) contagem += ` · ${nOmit} interno(s) omitido(s)`;
  if (doModulo.length + nOmit !== nIdx) falhar(`M${nn}: emitidos ${doModulo.length} + omitidos ${nOmit} ≠ extração ${nIdx}`);
  if (decl?.n != null && decl.n === nIdx && doModulo.length + nOmit !== decl.n) falhar(`M${nn}: emitidos + omitidos ≠ declarado ${decl.n}`);
  // a omissão tem de ser exatamente os internos (ou título com código de seção)
  const emitidosIds = new Set(doModulo.map((f) => f.id));
  const faltando = [...idx.entries()].filter(([id]) => !emitidosIds.has(id));
  for (const [id, { item }] of faltando) {
    const justificado = deveSerOmitido(item) || strings(item).some((s) => CODIGO_DE_SECAO.test(s));
    if (!justificado) falhar(`${id}: ausente do dado sem ser interno`);
  }
  for (const f of doModulo) {
    const a = idx.get(f.id);
    if (a && deveSerOmitido(a.item)) falhar(`${f.id}: é documento interno e foi emitido`);
  }
  if (ref && ref.total !== doModulo.length) falhar(`M${nn}: RefDoModulo.total ${ref.total} ≠ ${doModulo.length}`);

  // ordem 1..n
  doModulo.forEach((f, k) => { if (f.ordem !== k + 1) falhar(`${f.id}: ordem ${f.ordem}, esperado ${k + 1}`); });

  // literalidade por item
  for (const f of doModulo) {
    if (f.codigo !== `M${nn}`) falhar(`${f.id}: codigo ${f.codigo}`);
    const achado = idx.get(f.id);
    if (!achado) { falhar(`${f.id}: id não existe na extração`); continue; }
    const palheiro = strings([achado.item, achado.grupo]).join('\u0000');
    const conferir = (campo, v) => {
      if (v == null) return;
      if (typeof v !== 'string' || !v.length) { falhar(`${f.id}.${campo}: valor vazio ou não-string`); return; }
      if (!palheiro.includes(norm(v))) falhar(`${f.id}.${campo} não está na extração: ${JSON.stringify(v).slice(0, 90)}`);
      if (MARCA_MORTA.test(v)) falhar(`${f.id}.${campo} contém a marca antiga`);
      if (CODIGO_DE_SECAO.test(v)) falhar(`${f.id}.${campo} contém código de seção`);
      if (OUTRO_VOCABULARIO.test(v)) falhar(`${f.id}.${campo} contém vocabulário interno`);
    };
    if (!f.titulo) falhar(`${f.id}: sem título`);
    conferir('titulo', f.titulo);
    conferir('descricao', f.descricao);
    conferir('natureza', f.natureza);
    conferir('dominio', f.dominio);
    f.instituicoes.forEach((x, k) => conferir(`instituicoes[${k}]`, x));
    f.datas.forEach((x, k) => conferir(`datas[${k}]`, x));
    if (f.url != null) {
      if (!/^https?:\/\//.test(f.url)) falhar(`${f.id}.url não é http(s)`);
      if (!rawStrings(achado.item).includes(f.url)) falhar(`${f.id}.url não está literal no item`);
    }
    if (f.secundaria && achado.item.secundaria !== true) falhar(`${f.id}: secundaria=true sem marca na extração`);
  }

  // cabeçalho do módulo
  if (ref) {
    const cab = haystackCabecalho(nn, r);
    for (const campo of ['rotulo', 'titulo', 'introducao', 'verificadaEm']) {
      const v = ref[campo];
      if (v != null && !cab.includes(norm(v))) falhar(`M${nn} cabeçalho.${campo} não está na extração: ${JSON.stringify(v).slice(0, 90)}`);
      if (v != null && (MARCA_MORTA.test(v) || CODIGO_DE_SECAO.test(v) || OUTRO_VOCABULARIO.test(v))) falhar(`M${nn} cabeçalho.${campo} contém vocabulário interno`);
    }
  } else falhar(`M${nn}: sem entrada em REFS_DOS_MODULOS`);

  const ok = falhas === antes;
  linhas.splice(linhas.length - (falhas - antes), 0, `M${nn} ${ok ? 'ok   ' : 'FALHA'} ${contagem}`);
}

console.log(linhas.join('\n'));
if (notas.length) {
  console.log('\nNotas (não são falhas):');
  for (const n of notas) console.log(`  · ${n}`);
}
console.log(`\nRESULTADO: ${falhas} falhas`);
process.exit(falhas ? 1 : 0);
