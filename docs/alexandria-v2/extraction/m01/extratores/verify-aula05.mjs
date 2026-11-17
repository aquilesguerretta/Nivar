// Verificador independente da extração da A05. NÃO importa nada do gerador.
// Prova, por substring contra o HTML-fonte, que cada string de conteúdo do JSON existe na fonte;
// confere as linhas de origem (±3), recomputa a contagem por tipo e a cobertura por token a partir
// do JSON e da fonte, reexecuta o script do instrumento e rechecha as afirmações sobre o código.
//   node docs/alexandria-v2/extraction/m01/extratores/verify-aula05.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// ---- configuração desta aula (o único trecho que muda entre verify-aula05 e verify-aula06) ----
const CFG = {
  aula: '05',
  json: '../aula-05.json',
  tsKey: "'aula-01-05'",
  secIni: 1731,   // linha do aula-marker
  secFim: 1824,   // último conteúdo antes de </div></section>
  inst: { ini: 1774, fim: 1806, scriptComentario: 'INSTRUMENT 04', idPrefix: 'i04-' }, // null se a aula não tem instrumento
  esperaContagem: { h3: 4, tabela: 2, formula: 2, ul: 0, li: 0, callout: 2, instrumento: 1, p_corpo: 5 },
};
// -----------------------------------------------------------------------------------------------

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const raw = fs.readFileSync(SRC, 'utf8');
const L = raw.split(/\r?\n/); if (L[L.length - 1] === '') L.pop();
const J = JSON.parse(fs.readFileSync(path.resolve(HERE, CFG.json), 'utf8'));

const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const ws = (s) => s.replace(/\s+/g, ' ').trim();
const vRaw = ws(raw);                                    // html cru
const vRawDec = ws(dec(raw));                            // html com entidades decodificadas
const vGlue = ws(dec(raw.replace(/<[^>]+>/g, '')));      // texto, tags coladas
const vSp = ws(dec(raw.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')); // texto, tag → espaço
const views = [vRaw, vRawDec, vGlue, vSp];
const existe = (s) => { const n = ws(s); return views.some((v) => v.includes(n)) || views.some((v) => v.includes(ws(dec(n)))); };

// ---- 1. toda string literal do JSON existe na fonte ----
const SKIP = new Set(['nota', 'o_que', 'argumento', 'decisao', 'uso', 'conclusao', 'tipo', 'id', 'ref', 'bloco', 'alvo', 'ids', 'seletor', 'metodo', 'gerador', 'verificador',
  'protocolo', 'taxonomia', 'contrato', 'fonte', 'extraido_em', 'convencoes', 'comparacao_codigo', 'cobertura_texto_por_token', 'contagens', 'varredura_de_ausencia', 'meta',
  'tom', 'classe_cor', 'classe', 'kind_taxonomia', 'condicao_literal_nao', 'estilo_inline', 'ocorrencias_contexto', 'tokens_nao_casados', 'cenarios', 'exemplos_executando_o_script',
  'saida_do_instrumento_no_padrao', 'saidas_executando_o_script_original', 'saidas', 'cenario_padrao_saidas', 'formatacao_descricao', 'como', 'tag_fonte_nao', 'divergencias_fonte',
  'tabelas', 'formulas', 'destaques', 'listas', 'figuras', 'texto_leitura_pelo_script', 'ramo_ativo_pelo_script', 'ramo_ativo', 'faixa', 'perfil', 'mecanica_fonte', 'criterio_nota',
  'vinculo_declarado', 'vinculos', 'invocacoes_no_texto_nota', 'fonte_total_linhas', 'n_ocorrencias', 'unidade_rotulo_nao', 'exercicio', 'exercicio_relacionado', 'entre', 'regex', 'campo', 'status', 'codigo_qa', 'quem', 'trecho', 'derivado']);
const SHORT_OK = new Set(['unidade', 'numero', 'rotulo', 'html', 'texto']);
const bad = []; let nChecked = 0;
function walk(o, p, key) {
  if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${p}[${i}]`, key));
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) {
      if (SKIP.has(k) || k.endsWith('_nota')) continue;
      walk(v, `${p}.${k}`, k);
    }
    return;
  }
  if (typeof o !== 'string') return;
  if (o.length <= 3 && !SHORT_OK.has(key)) return;
  if (o.length === 0) return;
  nChecked++;
  if (!existe(o)) bad.push(`${p} :: ${ws(o).slice(0, 140)}`);
}
// contextos dos termos do léxico (texto com tag→espaço, case-insensitive)
const ctxBad = []; let nCtx = 0;
for (const t of (J.termos_lexico?.candidatos || [])) for (const c of t.ocorrencias_contexto) { nCtx++; if (!vSp.toLowerCase().includes(ws(c).toLowerCase())) ctxBad.push(t.termo + ' :: ' + c); }
// `saidas` e `cenarios` são verificadas por reexecução (seção 5), não por substring.
walk(J, '$', '');
// `saidas_iniciais_marcacao` e `valor_inicial_marcacao` são literais da marcação: confere explicitamente
const instJ = (J.instrumentos || [])[0];

// ---- 2. origens (linha ±3) ----
const strip = (s) => ws(dec(s.replace(/<[^>]+>/g, '')));
const nTok = (s) => ws(dec(s)).toLowerCase();
const origBad = []; let nOrig = 0;
function walkO(o, p) {
  if (Array.isArray(o)) return o.forEach((v, i) => walkO(v, `${p}[${i}]`));
  if (!o || typeof o !== 'object') return;
  if (o.linha_aprox !== undefined) {
    nOrig++;
    const n = o.linha_aprox;
    if (!Number.isInteger(n) || n < 1 || n > L.length) origBad.push(`${p} linha fora do arquivo: ${n}`);
    else if (o.trecho_inicial === undefined) origBad.push(`(sem trecho_inicial) ${p} L${n}`);
    else {
      const t = nTok(o.trecho_inicial).split(' ').slice(0, 3).join(' ');
      let ok = t === '';
      for (let d = -3; d <= 3 && !ok; d++) { const ln = L[n - 1 + d]; if (ln !== undefined && (nTok(strip(ln)).includes(t) || nTok(ws(ln)).includes(t) || nTok(ws(ln.replace(/<[^>]+>/g, ' '))).includes(t))) ok = true; }
      if (!ok) origBad.push(`${p} L${n} :: "${t}" | linha: ${ws(L[n - 1] || '').slice(0, 80)}`);
    }
    if (o.linha_fim_aprox !== undefined && !(Number.isInteger(o.linha_fim_aprox) && o.linha_fim_aprox <= L.length && o.linha_fim_aprox >= n)) origBad.push(`${p} linha_fim_aprox inválida`);
  }
  for (const [k, v] of Object.entries(o)) walkO(v, `${p}.${k}`);
}
walkO(J, '$');

// ---- 3. contagens recomputadas da fonte × blocos do JSON ----
const sec = L.slice(CFG.secIni - 1, CFG.secFim);
const secNoInst = CFG.inst ? L.slice(CFG.secIni - 1, CFG.inst.ini - 2).concat(L.slice(CFG.inst.fim, CFG.secFim)) : sec;
const cnt = (re, lines) => lines.join('\n').match(re)?.length ?? 0;
const fonteCont = {
  h3: cnt(/<h3>/g, sec),
  tabela: cnt(/<table>/g, sec),
  formula: cnt(/<div class="formula">/g, sec),
  ul: cnt(/<ul[ >]/g, sec),
  li: cnt(/<li[ >]/g, sec),
  callout: cnt(/<div class="callout[ "]/g, sec),
  instrumento: cnt(/<div class="instrument">/g, sec),
  // <p> do corpo: fora de callout, instrumento e tabela (os de callout vão em `destaque`)
  p_total: cnt(/<p[ >]/g, sec),
  p_callout: cnt(/<div class="callout-label">/g, sec),
  p_lead: cnt(/<p class="lead">/g, sec),
};
const porTipo = J.blocos.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {}); // recomputado dos blocos, não do campo `contagens`
const contagensDeclaradas = J.contagens.blocos_por_tipo;
const declMismatch = JSON.stringify(Object.entries(porTipo).sort()) !== JSON.stringify(Object.entries(contagensDeclaradas).sort());
const jsonCont = {
  h3: porTipo.titulo || 0, tabela: porTipo.tabela || 0, formula: porTipo.formula || 0, ul: porTipo.lista || 0,
  li: (J.blocos.filter((b) => b.tipo === 'lista').reduce((a, b) => a + b.itens.length, 0)), callout: porTipo.destaque || 0, instrumento: porTipo.instrumento || 0,
  p_corpo: porTipo.paragrafo || 0,
};
const p_corpo_fonte = fonteCont.p_total - fonteCont.p_callout - fonteCont.p_lead;
const contBad = [];
if (declMismatch) contBad.push('contagens.blocos_por_tipo declarado difere dos blocos reais');
for (const k of ['h3', 'tabela', 'formula', 'ul', 'li', 'callout', 'instrumento']) if (fonteCont[k] !== jsonCont[k]) contBad.push(`${k}: fonte ${fonteCont[k]} × json ${jsonCont[k]}`);
if (p_corpo_fonte !== jsonCont.p_corpo) contBad.push(`p_corpo: fonte ${p_corpo_fonte} × json ${jsonCont.p_corpo}`);
for (const [k, v] of Object.entries(CFG.esperaContagem)) { const got = k === 'p_corpo' ? p_corpo_fonte : fonteCont[k]; if (got !== v) contBad.push(`esperado fixo ${k}=${v}, medido ${got}`); }
if (J.blocos.filter((b) => b.tipo === 'lead').length !== fonteCont.p_lead) contBad.push('lead');
// células de tabela
const trs = sec.filter((l) => /<tr>/.test(l));
const celFonte = sec.join('\n').match(/<(td|th)[ >]/g)?.length ?? 0;
const celJson = J.blocos.filter((b) => b.tipo === 'tabela').reduce((a, b) => a + b.cabecalho.length + b.linhas.reduce((x, r) => x + r.celulas.length, 0), 0);
if (celFonte !== celJson) contBad.push(`células de tabela: fonte ${celFonte} × json ${celJson}`);
const linhasFonte = trs.length, linhasJson = J.blocos.filter((b) => b.tipo === 'tabela').reduce((a, b) => a + 1 + b.linhas.length, 0);
if (linhasFonte !== linhasJson) contBad.push(`linhas de tabela: fonte ${linhasFonte} × json ${linhasJson}`);

// ---- 4. cobertura por token, recomputada (independente do gerador) ----
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const tok = (s) => norm(s).match(/[\p{L}\p{N}]+/gu) || [];
const tagSp = (h) => dec(h.replace(/<[^>]+>/g, ' '));
const denom = tok(tagSp(secNoInst.join('\n')));
// extraído: todas as strings de `blocos` (campos de conteúdo) + marcador + título
const extr = [];
const SKB = new Set(['id', 'tipo', 'origem', 'nota', 'seletor', 'ref', 'vinculos', 'tom', 'classe', 'estilo_inline', 'linha_tabela', 'n_colunas', 'n_linhas_dados', 'html', 'eq_html', 'ul_estilo', 'ul_estilo_inline', 'ordenada']);
function coleta(o, k) {
  if (Array.isArray(o)) return o.forEach((v) => coleta(v, k));
  if (o && typeof o === 'object') { for (const [kk, v] of Object.entries(o)) if (!SKB.has(kk) && !kk.endsWith('_nota')) coleta(v, kk); return; }
  if (typeof o === 'string') extr.push(k === 'rotulo' ? strip(o) : o);
}
coleta(J.blocos, '');
extr.push(J.aula.marcador.num, J.aula.marcador.nome, J.aula.titulo_h2_texto);
// os campos `texto` de bloco `tabela` repetem as células (já contadas em linhas[].celulas[].texto): evita dupla contagem
const extrSemDup = [];
{
  const bagE = new Map();
  const coleta2 = (o, k, emTabelaTexto) => {
    if (Array.isArray(o)) return o.forEach((v) => coleta2(v, k));
    if (o && typeof o === 'object') {
      if (o.tipo === 'instrumento') return;
      const ehTabela = o.tipo === 'tabela';
      for (const [kk, v] of Object.entries(o)) { if (SKB.has(kk) || kk.endsWith('_nota')) continue; if ((ehTabela || o.tipo === 'lista') && kk === 'texto') continue; coleta2(v, kk); }
      return;
    }
    if (typeof o === 'string') extrSemDup.push(k === 'rotulo' ? strip(o) : o);
  };
  coleta2(J.blocos, '');
  extrSemDup.push(J.aula.marcador.num, J.aula.marcador.nome, J.aula.titulo_h2_texto);
}
function cobre(den, ex) {
  const bag = new Map(); for (const t of tok(ex.join(' '))) bag.set(t, (bag.get(t) || 0) + 1);
  let hit = 0; const falt = [];
  for (const t of den) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else falt.push(t); }
  const sobra = [...bag.values()].reduce((a, b) => a + b, 0);
  return { den: den.length, hit, pct: +(100 * hit / den.length).toFixed(1), falt, extraidos_sem_par_na_fonte: sobra };
}
const cob = cobre(denom, extrSemDup);
let cobInst = null;
if (CFG.inst && instJ) {
  const dI = tok(tagSp(L.slice(CFG.inst.ini - 1, CFG.inst.fim).join('\n')));
  const eI = [instJ.titulo, instJ.id_fonte, ...instJ.entradas.flatMap((c) => [c.rotulo, c.unidade]), ...instJ.saidas.flatMap((s) => [s.rotulo, s.unidade, s.valor_inicial_marcacao].filter((x) => typeof x === 'string')), instJ.texto_leitura.texto_inicial_marcacao];
  cobInst = cobre(dI, eI);
}

// ---- 5. reexecução do script do instrumento ----
const execBad = []; let nExec = 0;
if (CFG.inst && instJ) {
  const ini = L.findIndex((l, i) => i > 2000 && l.includes(CFG.inst.scriptComentario) && l.trim().startsWith('INSTRUMENT')) + 1;
  if (ini === 0) throw new Error('comentário do script não localizado');
  const iife = L.findIndex((l, i) => i >= ini && l.startsWith('(function() {')) + 1;
  const fim = L.findIndex((l, i) => i >= iife - 1 && l === '})();') + 1;
  const src = L.slice(iife - 1, fim).join('\n');
  if (iife !== instJ.script_origem.linha_aprox || fim !== instJ.script_origem.linha_fim_aprox) execBad.push(`script em L${iife}-${fim}, JSON diz L${instJ.script_origem.linha_aprox}-${instJ.script_origem.linha_fim_aprox}`);
  const ids = instJ.entradas.map((c) => c.id);
  const saidasIds = instJ.saidas.map((s) => s.id).concat(['i04-interp']);
  const roda = (ent) => {
    const els = {};
    for (const id of ids) els[id] = { value: String(ent[id]), addEventListener() {} };
    for (const id of saidasIds) els[id] = { textContent: '', addEventListener() {} };
    vm.runInNewContext(src, { document: { getElementById: (id) => els[id] }, parseFloat, Number });
    return els;
  };
  for (const c of instJ.execucao_script_amostra.cenarios) {
    nExec++;
    const els = roda(c.entradas);
    for (const [id, v] of Object.entries(c.saidas)) if (els[id].textContent !== v) execBad.push(`${c.cenario}: ${id} json="${v}" reexecução="${els[id].textContent}"`);
    if (els['i04-interp'].textContent !== c.texto_leitura) execBad.push(`${c.cenario}: texto de leitura difere`);
  }
  // padrão = value dos inputs na marcação
  const padrao = {}; for (const id of ids) { const m = raw.match(new RegExp(`id="${id}" value="([^"]*)"`)); padrao[id] = m ? m[1] : null; }
  for (const c of instJ.entradas) if (String(c.padrao) !== padrao[c.id]) execBad.push(`padrão de ${c.id}: json ${c.padrao} × marcação ${padrao[c.id]}`);
  const els = roda(padrao);
  for (const [id, v] of Object.entries(instJ.cenario_padrao.saidas_executando_o_script_original)) { nExec++; if (els[id].textContent !== v) execBad.push(`cenário-padrão ${id}: json "${v}" × reexecução "${els[id].textContent}"`); }
  // cada ramo declarado existe literalmente numa linha do script
  for (const r of instJ.texto_leitura.ramos) { nExec++; const ln = L[r.origem.linha_aprox - 1] || ''; if (!ln.includes(`'${r.texto}'`) || !ln.includes(r.condicao_literal)) execBad.push(`ramo L${r.origem.linha_aprox} não confere`); }
}

// ---- 6. afirmações sobre o código (estado do .ts AGORA) ----
const ts = fs.readFileSync(path.join(REPO, 'src/lib/data/alexandria-modulo-01-content.ts'), 'utf8');
const corpo = (ts.match(new RegExp(`${CFG.tsKey}: \\[[\\s\\S]*?\\r?\\n  \\],`)) || [''])[0];
const tsBad = []; const tsOk = [];
const claim = (nome, cond) => (cond ? tsOk : tsBad).push(nome);
claim('corpo do .ts localizado', corpo.length > 100);
const fCod = (corpo.match(/kind: 'formula'/g) || []).length;
const fonteFormulas = fonteCont.formula;
for (const c of J.comparacao_codigo.divergencias) {
  if (/fórmulas?/i.test(c.o_que) && c.id && /não foram portadas/.test(c.o_que)) claim(`${c.id}: fórmulas ausentes (código ${fCod} × fonte ${fonteFormulas})`, fCod === 0 && fonteFormulas > 0);
}
claim('</span> órfãos no corpo = valor do JSON', (corpo.match(/<\/span>/g) || []).length === J.comparacao_codigo.verificacoes_programaticas.span_orfao_no_corpo);
const vp = J.comparacao_codigo.verificacoes_programaticas;
for (const [k, v] of Object.entries(vp)) {
  if (v === true) claim(`verificação "${k}" ainda vale`, true);
}
const js = (s) => JSON.stringify(s).slice(1, -1);
const presente = (hay, s) => hay.includes(js(s)) || hay.includes(s);
// rechecagem independente: todo bloco de texto da fonte (p, célula, lead) presente ou ausente no código, tal como o JSON afirma
const faltamNoCodigo = [];
for (const b of J.blocos.filter((x) => x.tipo === 'lista')) claim(`lista ${b.id}: ausente do código (0 blocos kind lista; itens não presentes)`, (corpo.match(/kind: 'lista'/g) || []).length === 0 && b.itens.every((it) => !corpo.includes(it.texto.replace(/[;.]$/, ''))));
for (const b of J.blocos) {
  if (b.tipo === 'paragrafo') if (!presente(corpo, dec(b.html))) faltamNoCodigo.push(`${b.id} (L${b.origem.linha_aprox})`);
  if (b.tipo === 'lista') for (const it of b.itens) if (!presente(corpo, dec(it.html))) faltamNoCodigo.push(`${b.id} item "${it.texto.slice(0, 40)}" (L${it.origem.linha_aprox})`);
  if (b.tipo === 'tabela') for (const r of b.linhas) for (const c of r.celulas) if (!presente(corpo, dec(c.html))) faltamNoCodigo.push(`${b.id} célula "${c.texto.slice(0, 40)}"`);
  if (b.tipo === 'destaque') { if (!presente(corpo, dec(b.html))) faltamNoCodigo.push(`${b.id} corpo do callout "${b.rotulo}"`); }
}

// ---- relatório ----
const linhaSep = '─'.repeat(78);
console.log(`${linhaSep}\nVERIFICAÇÃO A${CFG.aula} — ${path.basename(CFG.json)} × alexandria_modulo01.html (${L.length} linhas)\n${linhaSep}`);
console.log(`1. LITERAIS     strings de conteúdo checadas: ${nChecked}   não encontradas na fonte: ${bad.length}`);
for (const b of bad) console.log('   FALHA ' + b);
console.log(`   CONTEXTOS do léxico: ${nCtx} trechos checados contra o texto da fonte   falhas: ${ctxBad.length}`);
for (const b of ctxBad) console.log('   FALHA ' + b);
console.log(`2. ORIGENS      objetos com linha_aprox: ${nOrig}   fora de ±3 linhas / sem trecho: ${origBad.length}`);
for (const b of origBad) console.log('   FALHA ' + b);
console.log(`3. CONTAGENS    fonte: ${JSON.stringify({ h3: fonteCont.h3, p_corpo: p_corpo_fonte, tabela: fonteCont.tabela, formula: fonteCont.formula, ul: fonteCont.ul, li: fonteCont.li, callout: fonteCont.callout, instrumento: fonteCont.instrumento, celulas: celFonte, linhas_tr: linhasFonte })}`);
console.log(`                json:  ${JSON.stringify({ h3: jsonCont.h3, p_corpo: jsonCont.p_corpo, tabela: jsonCont.tabela, formula: jsonCont.formula, ul: jsonCont.ul, li: jsonCont.li, callout: jsonCont.callout, instrumento: jsonCont.instrumento, celulas: celJson, linhas_tr: linhasJson })}   divergências: ${contBad.length}`);
for (const b of contBad) console.log('   FALHA ' + b);
console.log(`4. COBERTURA    por token, instrumento fora do denominador: ${cob.hit}/${cob.den} = ${cob.pct}%   tokens da fonte sem par: ${cob.falt.length} ${cob.falt.length ? JSON.stringify(cob.falt) : ''}   tokens extraídos sem par na fonte: ${cob.extraidos_sem_par_na_fonte}`);
if (cobInst) console.log(`                instrumento (à parte): ${cobInst.hit}/${cobInst.den} = ${cobInst.pct}%   sem par: ${cobInst.falt.length} ${cobInst.falt.length ? JSON.stringify(cobInst.falt) : ''}`);
console.log(`5. SCRIPT       checagens por reexecução/leitura: ${nExec}   falhas: ${execBad.length}${CFG.inst ? '' : ' (aula sem instrumento)'}`);
for (const b of execBad) console.log('   FALHA ' + b);
console.log(`6. CÓDIGO       afirmações re-checadas contra o .ts agora: ${tsOk.length + tsBad.length}   falhas: ${tsBad.length}`);
for (const b of tsBad) console.log('   FALHA ' + b);
console.log(`   itens da fonte que NÃO aparecem verbatim no corpo do .ts (${faltamNoCodigo.length}): ${faltamNoCodigo.length ? '\n     - ' + faltamNoCodigo.join('\n     - ') : '—'}`);
const total = ctxBad.length + bad.length + origBad.length + contBad.length + execBad.length + tsBad.length + cob.falt.length;
console.log(`${linhaSep}\nRESULTADO: ${total === 0 ? 'OK — 0 falhas' : total + ' falha(s)'}\n${linhaSep}`);
process.exit(total === 0 ? 0 : 1);
