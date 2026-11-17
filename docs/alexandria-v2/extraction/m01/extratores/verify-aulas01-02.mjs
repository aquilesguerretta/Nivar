// Verificador de aula-01.json e aula-02.json contra o HTML-fonte.
// Uso: node verify-aulas01-02.mjs [01|02]   (sem argumento: as duas)
//
// Não reusa nenhuma função do gerador: lê o HTML e o JSON e refaz as medidas.
// Provas (cada uma imprime contagem e falhas):
//   1. LITERAIS   — toda string extraída existe como substring do HTML (html: cru; texto: sem tags).
//   2. ORIGEM ±3  — toda `origem.linha_aprox` aponta para uma linha (±3) que contém o início do trecho.
//   3. SEQUÊNCIA  — os tokens do JSON, na ordem dos blocos, são IGUAIS aos tokens da section da fonte
//                   (aula sem instrumento; instrumento; exercício), na mesma ordem.
//   4. COBERTURA  — por token, com baixa (§5 do protocolo), recalculada aqui.
//   5. ESTRUTURA  — contagem de elementos da fonte (h3, p, table, callout, formula, painéis, tr) × blocos.
//   6. ATRIBUTOS  — id/value/min/max/step/placeholder de cada campo de entrada contra o `<input>` da fonte.
//   7. SCRIPT     — linhas verbatim e REEXECUÇÃO dos cenários em DOM simulado, comparando estado a estado.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(SRC, 'utf8');
const L = src.split(/\r?\n/); if (L[L.length - 1] === '') L.pop();
const line = (n) => L[n - 1];
const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (s) => dec(s.replace(/<[^>]+>/g, ''));
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const srcN = norm(src); const srcT = norm(strip(src));
const tokens = (s) => s.match(/[\p{L}\p{N}]+/gu) || [];
const tagsToSpace = (h) => dec(h.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const attrsOf = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

const SKIP_KEYS = new Set(['nota', 'o_que', 'argumento', 'decisao', 'onde', 'fonte', 'conforme', 'arquivos', 'comparacao_codigo', 'meta', 'seletor', 'tipo', 'id', 'ref', 'bloco', 'alvo', 'tom', 'kind_taxonomia', 'como', 'papel', 'posicao_instrumento', 'mecanica_fonte', 'vinculos', 'criterio', 'execucao_do_script_fonte', 'residuos_do_script', 'descricao', 'cobertura_texto_por_token', 'cobertura_instrumento', 'ocorrencias_contexto', 'comparacao_com_inventario', 'contagens', 'tabelas', 'destaques', 'tres_niveis', 'ids', 'gravidade', 'formatacao_descricao', 'indice', 'ativa_na_carga', 'ativo_na_carga', 'data_id', 'n_ocorrencias', 'n_colunas', 'n_linhas_dados', 'total', 'inventario', 'tipo_input']);

const falhas = { literais: [], origem: [], sequencia: [], cobertura: [], estrutura: [], atributos: [], script: [] };
const contagem = { literais: 0, literais_html: 0, origem: 0, atributos: 0 };

function walkLeaves(o, p, cb, ctx = {}) {
  if (Array.isArray(o)) return o.forEach((v, i) => walkLeaves(v, `${p}[${i}]`, cb, ctx));
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) {
      if (SKIP_KEYS.has(k) || k.endsWith('_nota') || k === 'nota') continue;
      if (k === 'rotulo' && p.includes('divergencias')) continue; // rótulo da leitura é nosso
      if (k === 'aula' && p.includes('vinculo')) continue; // id de aula nosso
      if (k === 'trecho_inicial') continue; // conferido em verificaOrigem (tags viram espaço)
      walkLeaves(v, `${p}.${k}`, cb, ctx);
    }
    return;
  }
  if (typeof o === 'string') cb(p, o);
}

function verificaLiterais(j) {
  walkLeaves(j, '', (p, s) => {
    if (!s.length) return;
    const key = p.split('.').pop().replace(/\[\d+\]$/, '');
    const parts = p.includes('divergencias') && s.includes(' | ') ? s.split(' | ') : [s];
    for (const part of parts) {
      const n = norm(part); if (!n) continue;
      contagem.literais++;
      if (key === 'html' || key.endsWith('_html')) {
        contagem.literais_html++;
        if (!srcN.includes(n)) falhas.literais.push(`${p} (html cru) :: ${n.slice(0, 110)}`);
      } else if (!(srcN.includes(n) || srcT.includes(n) || srcN.includes(norm(dec(n))) || srcT.includes(norm(strip(n))))) {
        falhas.literais.push(`${p} :: ${n.slice(0, 110)}`);
      }
    }
  });
}

function verificaOrigem(j) {
  const walk = (o, p) => {
    if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${p}[${i}]`));
    if (o && typeof o === 'object') {
      if (o.linha_aprox !== undefined && o.seletor !== undefined) {
        contagem.origem++;
        if (o.trecho_inicial === undefined) falhas.origem.push(`(sem trecho) ${p} L${o.linha_aprox}`);
        else {
          const t = norm(o.trecho_inicial).split(' ').slice(0, 3).join(' ');
          let ok = false;
          for (let d = -3; d <= 3; d++) { const ln = line(o.linha_aprox + d); if (ln !== undefined && (t === '' || norm(strip(ln)).includes(t) || norm(ln).includes(t) || norm(tagsToSpace(ln)).includes(t))) ok = true; }
          if (!ok) falhas.origem.push(`${p} L${o.linha_aprox} :: "${t}" | linha: ${norm(line(o.linha_aprox) || '').slice(0, 80)}`);
        }
        if (o.linha_fim_aprox !== undefined && o.linha_fim_aprox < o.linha_aprox) falhas.origem.push(`${p} fim < início`);
      }
      for (const [k, v] of Object.entries(o)) walk(v, `${p}.${k}`);
    }
  };
  walk(j, '');
}

// tokens do JSON, na ordem dos blocos (instrumento fora)
function tokensDoJson(j) {
  const t = [j.aula.marcador.num, j.aula.marcador.nome, j.aula.titulo_h2_texto];
  for (const b of j.blocos) {
    if (b.tipo === 'instrumento') continue;
    if (b.tipo === 'lead' || b.tipo === 'paragrafo') t.push(b.texto);
    else if (b.tipo === 'titulo') t.push(b.numero, b.texto);
    else if (b.tipo === 'formula') { t.push(b.eq_texto); if (b.desc_texto) t.push(b.desc_texto); }
    else if (b.tipo === 'tabela') { t.push(...b.cabecalho.map((c) => c.texto)); for (const r of b.linhas) t.push(...r.celulas.map((c) => c.texto)); }
    else if (b.tipo === 'destaque') t.push(b.rotulo, ...b.paragrafos.map((p) => p.texto));
    else if (b.tipo === 'tres_niveis') t.push(...b.abas.map((a) => a.rotulo), ...b.paineis.map((p) => p.texto));
    else falhas.sequencia.push('tipo de bloco desconhecido: ' + b.tipo);
  }
  return tokens(t.join(' '));
}
function comparaSeq(nome, a, b) {
  if (a.length === b.length && a.every((x, i) => x === b[i])) return { nome, ok: true, fonte: a.length, extraido: b.length };
  let i = 0; while (i < Math.min(a.length, b.length) && a[i] === b[i]) i++;
  falhas.sequencia.push(`${nome}: diverge no token ${i} (fonte "${a[i]}" × extraído "${b[i]}"); fonte ${a.length}, extraído ${b.length}`);
  return { nome, ok: false, fonte: a.length, extraido: b.length };
}

function verificaSequencias(j) {
  const mk = j.aula.marcador.origem.linha_aprox; const open = mk - 2; const close = j.meta.aula_linhas.fim;
  if (!line(open).includes('<section class="aula">') || !line(close).includes('</section>')) falhas.estrutura.push(`limites da section não conferem (${open}/${close})`);
  const inst = j.instrumentos[0]; const iIni = inst.origem.linha_aprox; const iFim = inst.linha_fim_aprox;
  const aulaHtml = L.slice(open + 1, iIni - 2).concat(L.slice(iFim, close - 2)).join('\n'); // exclui container(open+1), comentário(iIni-1), instrumento, e o `</div>` + `</section>`
  const srcSeq = tokens(tagsToSpace(aulaHtml));
  const extSeq = tokensDoJson(j);
  const r1 = comparaSeq('aula (sem instrumento)', srcSeq, extSeq);
  // cobertura por token com baixa
  const bag = new Map(); for (const t of extSeq) bag.set(t, (bag.get(t) || 0) + 1);
  let hit = 0; const miss = [];
  for (const t of srcSeq) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else miss.push(t); }
  const extra = [...bag.entries()].filter(([, c]) => c > 0).map(([t, c]) => `${t}×${c}`);
  if (miss.length || extra.length) falhas.cobertura.push(`faltando: ${miss.join(',')} | sobrando: ${extra.join(',')}`);
  const cobertura = { casados: hit, fonte: srcSeq.length, pct: +(100 * hit / srcSeq.length).toFixed(1), faltando: miss.length, sobrando: extra.length };
  // instrumento
  const iSrc = tokens(tagsToSpace(L.slice(iIni - 1, iFim).join('\n')));
  const e = inst.entradas;
  const iExt = tokens([inst.titulo, inst.id_fonte, ...(inst.instrucao ? [inst.instrucao.texto] : []), ...e.flatMap((x) => [x.rotulo, x.unidade]), inst.saidas[0].rotulo, inst.saidas[0].valor_inicial_marcacao, ...(inst.saidas[0].unidade ? [inst.saidas[0].unidade] : []), inst.texto_nota_estatica.texto].join(' '));
  const r2 = comparaSeq('instrumento', iSrc, iExt);
  // exercício
  const ex = j.exercicios[0]; const xo = ex.origem.linha_aprox; const xf = ex.origem.linha_fim_aprox;
  const xSrc = tokens(tagsToSpace(L.slice(xo - 1, xf).join('\n')));
  const xExt = tokens([ex.tag_fonte, ex.enunciado_texto, ex.rotulo_botao_gabarito, ex.resposta_referencia_texto].join(' '));
  const r3 = comparaSeq('exercício', xSrc, xExt);
  return { seq: [r1, r2, r3], cobertura, instCobertura: { tokens: iSrc.length } };
}

function verificaEstrutura(j) {
  const mk = j.aula.marcador.origem.linha_aprox; const open = mk - 2; const close = j.meta.aula_linhas.fim;
  const inst = j.instrumentos[0];
  const sec = L.slice(open - 1, close).filter((_, k) => { const n = open + k; return n < inst.origem.linha_aprox - 1 || n > inst.linha_fim_aprox; }).join('\n');
  const c = (re) => (sec.match(re) || []).length;
  const bl = (t) => j.blocos.filter((b) => b.tipo === t);
  const pCallout = bl('destaque').reduce((a, b) => a + b.paragrafos.length, 0);
  const checks = [
    ['h3', c(/<h3>/g), bl('titulo').length],
    ['p (fora do instrumento)', c(/<p[ >]/g), bl('lead').length + bl('paragrafo').length + pCallout],
    ['table', c(/<table>/g), bl('tabela').length],
    ['tr (cabeçalho + dados)', c(/<tr>/g), bl('tabela').reduce((a, b) => a + 1 + b.linhas.length, 0)],
    ['td', c(/<td[ >]/g), bl('tabela').reduce((a, b) => a + b.linhas.reduce((x, r) => x + r.celulas.length, 0), 0)],
    ['th', c(/<th>/g), bl('tabela').reduce((a, b) => a + b.cabecalho.length, 0)],
    ['div.callout', c(/<div class="callout( [a-z]+)?">/g), bl('destaque').length],
    ['div.formula', c(/<div class="formula">/g), bl('formula').length],
    ['div.desc', c(/<div class="desc">/g), bl('formula').filter((b) => b.desc_texto).length],
    ['three-levels', c(/<div class="three-levels"/g), bl('tres_niveis').length],
    ['three-levels-tab', c(/class="three-levels-tab[ "]/g), bl('tres_niveis').reduce((a, b) => a + b.abas.length, 0)],
    ['three-levels-panel', c(/class="three-levels-panel/g), bl('tres_niveis').reduce((a, b) => a + b.paineis.length, 0)],
    ['ul/ol', c(/<(ul|ol)\b/g), 0], ['img/svg/video/canvas', c(/<(img|svg|video|iframe|canvas)\b/g), 0],
    ['p.lead', c(/<p class="lead">/g), bl('lead').length],
  ];
  for (const [nome, fonte, ext] of checks) if (fonte !== ext) falhas.estrutura.push(`${nome}: fonte ${fonte} × JSON ${ext}`);
  // ordem crescente das linhas e ids únicos
  let prev = 0; const ids = new Set();
  for (const b of j.blocos) {
    if (b.origem.linha_aprox < prev) falhas.estrutura.push(`ordem: ${b.id} L${b.origem.linha_aprox} < anterior L${prev}`);
    prev = b.origem.linha_aprox;
    if (ids.has(b.id)) falhas.estrutura.push('id duplicado ' + b.id); ids.add(b.id);
  }
  return checks.map(([n, f, e]) => `${n}=${f}${f === e ? '' : '≠' + e}`).join('  ');
}

function verificaAtributos(j) {
  const inst = j.instrumentos[0];
  for (const e of inst.entradas) {
    const ln = line(e.origem.linha_aprox); const m = ln.match(/<input ([^>]*)>/);
    contagem.atributos++;
    if (!m) { falhas.atributos.push(`${e.id}: sem <input> na L${e.origem.linha_aprox}`); continue; }
    const a = attrsOf(m[1]);
    const cmp = (nome, got, esperado) => { if (got !== esperado) falhas.atributos.push(`${e.id}.${nome}: JSON ${JSON.stringify(esperado)} × fonte ${JSON.stringify(got)}`); };
    cmp('id', a.id, e.id);
    cmp('value', a.value === undefined ? null : Number(a.value), e.padrao);
    cmp('min', a.min === undefined ? null : Number(a.min), e.min);
    cmp('max', a.max === undefined ? null : Number(a.max), e.max);
    cmp('step', a.step === undefined ? null : (a.step === 'any' ? 'any' : Number(a.step)), e.step);
    cmp('placeholder', a.placeholder ?? null, e.placeholder);
    cmp('type', a.type, e.tipo_input);
    const lab = line(e.origem.linha_aprox - 1).match(/<label class="field-label">(.*?) <span class="unit">(.*?)<\/span><\/label>/);
    if (!lab) falhas.atributos.push(`${e.id}: label não achada na linha anterior`);
    else { cmp('rotulo', dec(lab[1]), e.rotulo); cmp('unidade', dec(lab[2]), e.unidade); }
  }
  // saída
  const s = inst.saidas[0]; const lnR = s.origem.linha_fim_aprox ?? s.origem.linha_aprox; const ln = line(lnR);
  if (!line(s.origem.linha_aprox).includes('class="output-label"')) falhas.atributos.push(`rótulo da saída não está na L${s.origem.linha_aprox}`);
  if (!ln.includes(`id="${s.id}"`)) falhas.atributos.push(`saída ${s.id} não está na L${lnR}`);
  if (!ln.includes(`>${s.valor_inicial_marcacao}<`)) falhas.atributos.push(`valor inicial "${s.valor_inicial_marcacao}" não está na L${lnR}`);
}

function makeEl(id, value = '') { return { id, value, textContent: '', _l: {}, addEventListener(ev, fn) { (this._l[ev] ||= []).push(fn); }, fire(ev) { (this._l[ev] || []).forEach((f) => f()); } }; }
function verificaScript(j) {
  const inst = j.instrumentos[0]; const sc = inst.script;
  // linhas verbatim e contíguas
  sc.linhas.forEach((x, i) => {
    if (x.texto !== line(x.n)) falhas.script.push(`L${x.n} difere da fonte`);
    if (i && x.n !== sc.linhas[i - 1].n + 1) falhas.script.push(`linhas não contíguas em ${x.n}`);
  });
  if (!sc.linhas[0].texto.includes('/* ====') || !/^\}\)\(\);\s*$/.test(sc.linhas[sc.linhas.length - 1].texto)) falhas.script.push('bloco não abre em /* ==== ou não fecha em })();');
  const code = L.slice(sc.linhas[0].n - 1, sc.linhas[sc.linhas.length - 1].n).join('\n');
  const marcacaoIni = Object.fromEntries(inst.entradas.filter((e) => e.padrao !== null).map((e) => [e.id, String(e.padrao)]));
  const ids = [...inst.entradas.map((e) => e.id), inst.saidas[0].id];
  let estados = 0;
  for (const r of inst.execucao_do_script_fonte.resultados) {
    const els = Object.fromEntries(ids.map((id) => [id, makeEl(id, marcacaoIni[id] ?? '')]));
    els[inst.saidas[0].id].textContent = inst.saidas[0].id.endsWith('status') ? inst.saidas[0].valor_inicial_marcacao : '';
    new Function('document', code)({ getElementById: (id) => els[id] });
    if (r.passos) { // INST·02
      const snap = () => ({ V: els['i02-v'].value, I: els['i02-i'].value, R: els['i02-r'].value, status: els['i02-status'].textContent });
      const cmp = (rotulo, got, exp) => { estados++; for (const k of Object.keys(got)) if (got[k] !== exp[k]) falhas.script.push(`${r.nome} @ ${rotulo}: ${k} reexecução "${got[k]}" × JSON "${exp[k]}"`); };
      cmp('carga', snap(), r.estados[0]);
      r.passos.forEach((p, i) => { els[p.campo].value = p.valor; els[p.campo].fire('input'); cmp(`passo ${i + 1}`, snap(), r.estados[i + 1]); });
    } else { // INST·01
      for (const [id, v] of Object.entries(r.entradas)) { if (els[id].value !== v) { els[id].value = v; els[id].fire('input'); } }
      estados++;
      if (els['i01-out'].textContent !== r.saida_texto) falhas.script.push(`${r.nome}: reexecução "${els['i01-out'].textContent}" × JSON "${r.saida_texto}"`);
    }
  }
  return { linhas: sc.linhas.length, cenarios: inst.execucao_do_script_fonte.resultados.length, estados_conferidos: estados };
}

function verificaMapa(j) {
  const ln = line(j.aula.pergunta_mapa.origem.linha_aprox);
  if (!ln.includes(j.aula.pergunta_mapa.pergunta_html)) falhas.literais.push('§ MAP: pergunta_html não está na linha ' + j.aula.pergunta_mapa.origem.linha_aprox);
}

// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const alvos = args.length ? args : ['01', '02'];
let totalFalhas = 0;
for (const n of alvos) {
  for (const k of Object.keys(falhas)) falhas[k] = [];
  for (const k of Object.keys(contagem)) contagem[k] = 0;
  const j = JSON.parse(fs.readFileSync(path.join(DIR, `aula-${n}.json`), 'utf8'));
  verificaLiterais(j); verificaMapa(j); verificaOrigem(j);
  const sq = verificaSequencias(j);
  const est = verificaEstrutura(j);
  verificaAtributos(j);
  const sc = verificaScript(j);
  console.log(`\n===== aula-${n}.json (${j.blocos.length} blocos; fonte ${j.meta.fonte_total_linhas} linhas) =====`);
  console.log(`1. LITERAIS   : ${contagem.literais} strings checadas (${contagem.literais_html} em html cru) | falhas: ${falhas.literais.length}`);
  console.log(`2. ORIGEM ±3  : ${contagem.origem} origens checadas | falhas: ${falhas.origem.length}`);
  for (const s of sq.seq) console.log(`3. SEQUÊNCIA  : ${s.nome}: fonte ${s.fonte} tokens × extraído ${s.extraido} → ${s.ok ? 'IDÊNTICA em ordem' : 'DIVERGE'}`);
  console.log(`4. COBERTURA  : ${sq.cobertura.casados}/${sq.cobertura.fonte} tokens casados (${String(sq.cobertura.pct).replace('.', ',')}%) | faltando ${sq.cobertura.faltando} | sobrando ${sq.cobertura.sobrando}`);
  console.log(`5. ESTRUTURA  : ${est} | falhas: ${falhas.estrutura.length}`);
  console.log(`6. ATRIBUTOS  : ${contagem.atributos} campos + saída | falhas: ${falhas.atributos.length}`);
  console.log(`7. SCRIPT     : ${sc.linhas} linhas verbatim; ${sc.cenarios} cenários reexecutados, ${sc.estados_conferidos} estados conferidos | falhas: ${falhas.script.length}`);
  const todas = Object.entries(falhas).flatMap(([k, v]) => v.map((x) => `[${k}] ${x}`));
  if (todas.length) { console.log('FALHAS:'); todas.forEach((x) => console.log('  ' + x)); }
  console.log(`RESULTADO aula-${n}: ${todas.length === 0 ? 'OK, 0 falha' : todas.length + ' falha(s)'}`);
  totalFalhas += todas.length;
}
process.exit(totalFalhas ? 1 : 0);
