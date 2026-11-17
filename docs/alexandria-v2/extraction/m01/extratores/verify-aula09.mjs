// Verificador da extração aula-07.json (e, copiado, aula-09.json): prova por SUBSTRING contra o HTML-fonte
// que cada string extraída existe na fonte, que cada `origem` aponta a linha certa (±3) e recalcula a
// cobertura por token de forma independente do gerador. Sai com código 1 se houver falha.
// Uso: node verify-aula09.mjs [caminho-do-json]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const JSON_PATH = process.argv[2] ?? path.resolve(HERE, '../aula-09.json');
const src = fs.readFileSync(SRC, 'utf8');
const lines = src.split(/\r?\n/);
const j = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (s) => dec(s.replace(/<[^>]+>/g, ''));
const stripSp = (s) => dec(s.replace(/<[^>]+>/g, ' '));
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const srcN = norm(src), srcT = norm(strip(src)), srcS = norm(stripSp(src));
const achaUm = (n) => srcN.includes(n) || srcT.includes(n) || srcS.includes(n) || srcN.includes(norm(dec(n))) || srcT.includes(norm(strip(n))) || srcS.includes(norm(stripSp(n)));
const acha = (s) => {
  const n = norm(s);
  if (achaUm(n)) return true;
  const partes = n.split(' | ');
  return partes.length > 1 && partes.every((p) => achaUm(norm(p)));
};

// Chaves que são comentário do extrator (nunca literal da fonte). Lista fechada e impressa no relatório.
const SKIP = new Set(['nota', 'o_que', 'argumento', 'decisao', 'seletor', 'metodo', 'onde', 'fonte', 'origem', 'contrato', 'protocolo', 'taxonomia',
  'tipo', 'id', 'ref', 'bloco', 'alvo', 'ids', 'ausencia', 'vinculos', 'condicao_literal', 'tom', 'classe_fonte', 'classe_td', 'id_fonte', 'id_valor', 'id_container',
  'tag_fonte', 'gravidade', 'arquivos', 'conforme', 'tokens_nao_casados', 'comparacao_codigo', 'meta', 'cobertura_texto_por_token', 'derivado', 'estado_pre_script',
  'status', 'qa', 'kind_taxonomia', 'classe_cor_marcacao', 'elemento', 'atributos', 'tipo_input', 'gemeos', 'como', 'campos_varridos', 'posicao_instrumento', 'posicao_figura',
  'li_attr', 'ul_attr', 'destaques', 'tabelas_ids', 'listas_ids', 'leituras_externas_ref', 'aula_id', 'mecanica_fonte', 'cenario_padrao', 'formatacao_descricao', 'viewBox', 'o_que_excluido', 'tem_nota']);
const skipKey = (k) => SKIP.has(k) || /_nota$/.test(k) || k === 'nota';

const stats = { checadas: 0, ok: 0, curtas: 0, curtas_ok: 0, puladas: {} };
const bad = [];
function walk(o, p, litSibling) {
  if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${p}[${i}]`, litSibling));
  if (o && typeof o === 'object') {
    const lit = typeof o.linha_literal === 'string' ? o.linha_literal : litSibling;
    // atributos numéricos de input: conferidos contra a linha literal do próprio objeto
    if (typeof o.linha_literal === 'string') {
      for (const [k, a] of [['min', 'min'], ['max', 'max'], ['step', 'step'], ['padrao', 'value']]) if (typeof o[k] === 'number') {
        stats.checadas++;
        if (o.linha_literal.includes(`${a}="${o[k]}"`)) stats.ok++; else bad.push(`${p}.${k} :: ${a}="${o[k]}" não está em linha_literal`);
      }
    }
    for (const [k, v] of Object.entries(o)) {
      if (skipKey(k)) { if (typeof v === 'string' || (v && typeof v === 'object')) stats.puladas[k] = (stats.puladas[k] || 0) + 1; continue; }
      walk(v, `${p}.${k}`, lit);
    }
    return;
  }
  if (typeof o === 'string') {
    const n = norm(o);
    if (n.length === 0) return;
    if (n.length <= 3) {
      stats.curtas++;
      if (!litSibling || litSibling.includes(n)) stats.curtas_ok++; else bad.push(`${p} :: (curta) "${n}" ausente da linha_literal do irmão`);
      return;
    }
    stats.checadas++;
    if (acha(n)) stats.ok++; else bad.push(`${p} :: ${n.slice(0, 140)}`);
  }
}
walk(j, '', null);

// ---- origens (±3) ----
const ob = []; let oTot = 0, oOk = 0;
function walkO(o, p) {
  if (Array.isArray(o)) return o.forEach((v, i) => walkO(v, `${p}[${i}]`));
  if (!o || typeof o !== 'object') return;
  if (typeof o.linha_aprox === 'number' && o.trecho_inicial !== undefined) {
    oTot++;
    const t = norm(o.trecho_inicial).split(' ').slice(0, 3).join(' ');
    const Ln = o.linha_aprox; let ok = false;
    for (let d = -3; d <= 3; d++) { const ln = lines[Ln - 1 + d]; if (ln !== undefined && (t === '' || norm(strip(ln)).includes(t) || norm(ln).includes(t) || norm(stripSp(ln)).includes(t))) ok = true; }
    if (ok) oOk++; else ob.push(`${p} L${Ln} :: ${t} | linha: ${norm(lines[Ln - 1] || '').slice(0, 80)}`);
  } else if (typeof o.linha_aprox === 'number') { oTot++; ob.push(`(sem trecho_inicial) ${p} L${o.linha_aprox}`); }
  for (const [k, v] of Object.entries(o)) walkO(v, `${p}.${k}`);
}
walkO(j, '');

// ---- cobertura por token, recomputada só a partir do JSON ----
const tok = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[\p{L}\p{N}]+/gu) || [];
const HTMLK = new Set(['html', 'rotulo_html', 'eq_html', 'desc_html']);
const OUTRAS = new Set(['numero', 'num', 'nome', 'valor_inicial_marcacao', 'sufixo_unidade']);
const ext = [];
function coleta(o) {
  if (Array.isArray(o)) return o.forEach(coleta);
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (k === 'origem' || k.endsWith('_origem') || skipKey(k)) continue;
    if (typeof v === 'string') {
      if (HTMLK.has(k)) ext.push(stripSp(v));
      else if (OUTRAS.has(k)) ext.push(v);
      else if (k === 'texto' && o.elemento) ext.push(v);
      else if (k === 'rotulo' && o.id_valor) ext.push(v);
    } else coleta(v);
  }
}
coleta(j.blocos); coleta(j.figuras); ext.push(j.aula.marcador.num, j.aula.marcador.nome, stripSp(j.aula.titulo_h2_html));
const fx = j.cobertura_texto_por_token.faixa_denominador;
const okFaixa = lines[fx.de - 1].includes('<section class="aula">') && lines[fx.ate - 1].includes('</section>');
let denom = lines.slice(fx.de - 1, fx.ate);
if (fx.excluido) {
  const e0 = fx.excluido.de, e1 = fx.excluido.ate;
  if (!/INSTRUMENT/.test(lines[e0 - 1])) bad.push('faixa excluída não começa no comentário INSTRUMENT: ' + lines[e0 - 1]);
  denom = lines.slice(fx.de - 1, e0 - 1).concat(lines.slice(e1, fx.ate));
}
const bag = new Map();
for (const t of tok(ext.join(' '))) bag.set(t, (bag.get(t) || 0) + 1);
const srcTok = tok(stripSp(denom.join('\n')));
let hit = 0; const falt = [];
for (const t of srcTok) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else falt.push(t); }
const pct = +(100 * hit / srcTok.length).toFixed(2);

// ---- relatório ----
console.log(`Arquivo: ${path.basename(JSON_PATH)}  (${j.meta.aula})`);
console.log(`Fonte: ${SRC}  (${lines[lines.length - 1] === '' ? lines.length - 1 : lines.length} linhas)`);
console.log(`\n[1] LITERAL POR SUBSTRING: ${stats.ok}/${stats.checadas} strings da camada fonte existem no HTML; ${bad.length} falha(s)`);
console.log(`    curtas (≤3 caracteres) conferidas na linha_literal do irmão: ${stats.curtas_ok}/${stats.curtas}`);
console.log(`    chaves de comentário do extrator, fora da prova (ocorrências): ${Object.entries(stats.puladas).map(([k, v]) => `${k}×${v}`).join(' ')}`);
if (bad.length) console.log('    NÃO ENCONTRADAS:\n      ' + bad.join('\n      '));
console.log(`\n[2] ORIGEM (linha ±3): ${oOk}/${oTot} apontam a linha certa; ${ob.length} falha(s)`);
if (ob.length) console.log('    ' + ob.join('\n    '));
console.log(`\n[3] COBERTURA POR TOKEN (recomputada do JSON): ${hit}/${srcTok.length} = ${pct}%  (faixa ${fx.de}-${fx.ate}${fx.excluido ? `, sem ${fx.excluido.de}-${fx.excluido.ate}` : ', sem instrumento a excluir'}; faixa ancorada em <section>/</section>: ${okFaixa})`);
console.log(`    tokens não casados: ${falt.length ? falt.join(' ') : '(nenhum)'}`);
console.log(`    cobertura declarada pelo gerador: ${j.cobertura_texto_por_token.tokens_casados}/${j.cobertura_texto_por_token.tokens_fonte_sem_instrumento} = ${j.cobertura_texto_por_token.pct}%`);
const falhas = bad.length + ob.length + (okFaixa ? 0 : 1);
console.log(`\nRESULTADO: ${falhas === 0 ? 'OK — 0 falha de literal, 0 falha de origem' : `FALHOU — ${falhas} falha(s)`}`);
process.exit(falhas === 0 ? 0 : 1);
