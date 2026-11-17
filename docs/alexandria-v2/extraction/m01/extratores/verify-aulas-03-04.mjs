// Verificador de aula-03.json e aula-04.json contra o HTML-fonte (independente do gerador).
//
//   node verify-aulas-03-04.mjs            → imprime o relatório; exit 1 se houver falha
//   node verify-aulas-03-04.mjs --stamp    → além disso, grava o resumo na seção "Verificação" dos .md
//
// Provas:
//  1. LITERAL: toda string de conteúdo do JSON existe, por substring, no HTML — e dentro da janela
//     de linhas (±3) da origem mais próxima. (html contra o HTML cru; texto contra o HTML sem tags.)
//  2. ORIGEM: todo `origem` com linha_aprox tem o início do trecho dentro de ±3 linhas.
//  3. LINHAS: toda linha da section que não é estrutura (div/section/comentário/branco) está dentro
//     do intervalo de algum bloco (ou do marcador/h2): nenhuma linha de conteúdo fica sem dono.
//  4. COBERTURA por token, recalculada aqui (campos canônicos html/rotulo/h5/label; texto não conta
//     para não duplicar), com baixa de cada palavra consumida.
//  5. CONSISTÊNCIA: texto == strip(html) em todo par html/texto; script do instrumento == linhas cruas.
//  6. .TS: o que o JSON diz estar verbatim no .ts, está; o que diz ausente, não aparece em lugar nenhum.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..') + '/';
const REPO = path.resolve(HERE, '../../../../..') + '/';
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html';
const src = fs.readFileSync(SRC, 'utf8');
const lines = src.split('\n');
const line = (n) => lines[n - 1] ?? '';
const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const strip = (s) => dec(s.replace(/<[^>]+>/g, ''));
const stripSp = (s) => dec(s.replace(/<[^>]+>/g, ' '));
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const srcN = norm(src), srcT = norm(strip(src));
const janela = (a, b, m = 3) => { const s = []; for (let n = Math.max(1, a - m); n <= Math.min(lines.length, b + m); n++) s.push(line(n)); const j = s.join('\n'); return { n: norm(j), t: norm(strip(j)) }; };
const nfd = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const tok = (s) => nfd(s).match(/[\p{L}\p{N}]+/gu) || [];

const EDITORIAL = new Set(['nota', 'argumento', 'decisao', 'o_que', 'tipo', 'id', 'ref', 'seletor', 'kind_taxonomia', 'classe_cor', 'vinculos', 'tom', 'metodo', 'contrato', 'protocolo', 'taxonomia', 'extratores', 'convencoes', 'comparacao_codigo', 'cobertura_texto_por_token', 'contagens', 'meta', 'leitura', 'leitura_do_contexto', 'padroes', 'ocorrencias_contexto', 'posicao_na_aula', 'posicao_instrumento', 'como', 'tipo_input', 'elemento', 'atributos', 'vale_lembrar', 'destaques', 'listas', 'tabelas', 'ocorrencias_leitura', 'itens_ocorrencias', 'instrumento', 'figura', 'termo', 'aula', 'exercicio_relacionado', 'proximo_bloco_na_fonte', 'bloco', 'alvo', 'ordenada', 'secao', 'padrao', 'escopo', 'funcoes', 'extraido_em', 'fonte', 'fonte_somente_leitura', 'grupo', 'modulo', 'feedback_q', 'gravidade', 'onde', 'conforme', 'arquivos', 'vinculo_declarado', 'texto_dentro_do_svg', 'tipo_figura', 'termina_em', 'formatacao_descricao', 'mecanica_fonte']);
const skipKey = (k) => EDITORIAL.has(k) || /_nota$/.test(k) || /^(medido|derivado)/.test(k);
const SCRIPT_KEYS = new Set(['formula_exata_script', 'formatacao_script', 'coercao_entradas', 'script']);

const falhas = [];
const stats = { literais: 0, literais_ok: 0, literais_na_janela: 0, literais_so_no_arquivo: 0, origens: 0, origens_ok: 0, editoriais_ignoradas: 0 };

function checarLiteral(s, win, path_) {
  const parts = s.includes(' | ') ? s.split(' | ') : [s];
  for (const part of parts) {
    const p = norm(part);
    if (!p) continue;
    stats.literais++;
    const cands = [p, norm(dec(p)), norm(strip(p))];
    const naJanela = win && cands.some((c) => win.n.includes(c) || win.t.includes(c));
    if (naJanela) { stats.literais_ok++; stats.literais_na_janela++; continue; }
    const noArquivo = cands.some((c) => srcN.includes(c) || srcT.includes(c));
    if (noArquivo && !win) { stats.literais_ok++; stats.literais_so_no_arquivo++; continue; }
    falhas.push(`LITERAL ${noArquivo ? '(existe no arquivo mas FORA da janela de origem) ' : '(NÃO existe no arquivo) '}${path_} :: ${p.slice(0, 140)}`);
  }
}

function walkLiteral(o, win, path_, jsonRoot) {
  if (Array.isArray(o)) return o.forEach((v, i) => walkLiteral(v, win, `${path_}[${i}]`, jsonRoot));
  if (o && typeof o === 'object') {
    let w = win;
    if (o.origem && typeof o.origem === 'object' && o.origem.linha_aprox) w = janela(o.origem.linha_aprox, o.origem.linha_fim_aprox ?? o.origem.linha_aprox);
    else if (typeof o.linha === 'number' && typeof o.texto === 'string') w = janela(o.linha, o.linha, 1); // comentário_fonte
    for (const [k, v] of Object.entries(o)) {
      if (k === 'origem' || k.endsWith('_origem')) continue;
      if (skipKey(k)) { if (typeof v === 'string' || (v && typeof v === 'object')) stats.editoriais_ignoradas++; continue; }
      let wk = w;
      if (SCRIPT_KEYS.has(k) && jsonRoot.instrumentos?.[0]) { const so = jsonRoot.instrumentos[0].script_origem; wk = janela(so.linha_aprox, so.linha_fim_aprox); }
      if (k === 'formula_exibida_na_aula_html' && o.formula_exibida_na_aula_origem) wk = janela(o.formula_exibida_na_aula_origem.linha_aprox, o.formula_exibida_na_aula_origem.linha_aprox);
      if (typeof v === 'string') checarLiteral(v, wk, `${path_}.${k}`);
      else walkLiteral(v, wk, `${path_}.${k}`, jsonRoot);
    }
  }
}

function walkOrigem(o, path_) {
  if (Array.isArray(o)) return o.forEach((v, i) => walkOrigem(v, `${path_}[${i}]`));
  if (!o || typeof o !== 'object') return;
  if (o.linha_aprox && o.trecho !== undefined && o.trecho_inicial === undefined) {
    // ocorrências fora da seção: o trecho tem de estar na própria linha
    stats.origens++;
    if (norm(strip(line(o.linha_aprox))).includes(norm(o.trecho)) || norm(strip(line(o.linha_aprox))).startsWith(norm(o.trecho).slice(0, 60))) stats.origens_ok++;
    else falhas.push(`OCORRÊNCIA ${path_} L${o.linha_aprox} :: ${o.trecho.slice(0, 80)} | linha: ${norm(strip(line(o.linha_aprox))).slice(0, 80)}`);
  } else if (o.linha_aprox !== undefined && o.trecho_inicial !== undefined && typeof o.linha_aprox === 'number') {
    stats.origens++;
    const t = norm(o.trecho_inicial).split(' ').slice(0, 3).join(' ');
    const a = o.linha_aprox, b = o.linha_fim_aprox ?? a;
    let ok = t === '';
    for (let n = a - 3; n <= b + 3 && !ok; n++) { const ln = line(n); if (ln && (norm(strip(ln)).includes(t) || norm(ln).includes(t) || norm(stripSp(ln)).includes(t))) ok = true; }
    if (ok) stats.origens_ok++; else falhas.push(`ORIGEM ${path_} L${a}${b !== a ? '–' + b : ''} :: "${t}" | linha: ${norm(line(a)).slice(0, 80)}`);
  } else if (o.linha_aprox !== undefined && o.trecho_inicial === undefined && o.trecho === undefined && o.seletor !== undefined) {
    falhas.push(`ORIGEM (sem trecho) ${path_} L${o.linha_aprox} :: ${norm(line(o.linha_aprox)).slice(0, 80)}`);
  }
  for (const [k, v] of Object.entries(o)) if (!/^(comparacao_codigo|meta)$/.test(k)) walkOrigem(v, `${path_}.${k}`);
}

const relatorio = [];
const resumos = {};
for (const NN of process.argv.includes('--aula=3') ? ['03'] : process.argv.includes('--aula=4') ? ['04'] : ['03', '04']) {
  falhas.length = 0; for (const k of Object.keys(stats)) stats[k] = 0;
  const j = JSON.parse(fs.readFileSync(OUT + `aula-${NN}.json`, 'utf8'));
  const [sIni, sFim] = j.meta.aula_linhas.section;
  const rel = [];
  rel.push(`===== M01·A${NN} (${j.blocos.length} blocos, section L${sIni}–${sFim}) =====`);

  // 1) literais
  walkLiteral(j, null, '', j);
  // 2) origens
  walkOrigem(j, '');
  // pares html/texto
  let pares = 0;
  (function par(o, p) {
    if (Array.isArray(o)) return o.forEach((v, i) => par(v, `${p}[${i}]`));
    if (!o || typeof o !== 'object') return;
    if (typeof o.html === 'string' && typeof o.texto === 'string') { pares++; const esperado = o.numero !== undefined ? o.numero + o.texto : o.texto; if (norm(strip(o.html)) !== norm(esperado)) falhas.push(`CONSISTÊNCIA texto≠strip(html) ${p} :: ${o.texto.slice(0, 80)}`); }
    if (typeof o.eq_html === 'string' && typeof o.eq_texto === 'string') { pares++; if (norm(strip(o.eq_html)) !== norm(o.eq_texto)) falhas.push(`CONSISTÊNCIA eq_texto≠strip(eq_html) ${p}`); }
    if (typeof o.pergunta_html === 'string') { pares++; if (norm(strip(o.pergunta_html)) !== norm(o.pergunta_texto)) falhas.push(`CONSISTÊNCIA pergunta ${p}`); }
    for (const [k, v] of Object.entries(o)) if (!/^(comparacao_codigo|meta)$/.test(k)) par(v, `${p}.${k}`);
  })(j, '');

  // 3) linhas da section
  const dono = [];
  const reg = (a, b, quem) => { for (let n = a; n <= b; n++) dono[n] = (dono[n] || []).concat(quem); };
  for (const b of j.blocos) reg(b.origem.linha_aprox, b.origem.linha_fim_aprox ?? b.origem.linha_aprox, b.id);
  reg(j.aula.marcador.origem.linha_aprox, j.aula.marcador.origem.linha_aprox, 'marcador');
  reg(j.aula.titulo_h2_origem.linha_aprox, j.aula.titulo_h2_origem.linha_aprox, 'h2');
  const semDono = []; let contadas = 0, estrutura = 0, sobrepostas = [];
  for (let n = sIni; n <= sFim; n++) {
    const t = line(n).trim();
    if (!t || /^<\/?div[^>]*>$/.test(t) && !dono[n] || t.startsWith('<section') || t === '</section>' || t.startsWith('<!--') || t === '</div>') { estrutura++; continue; }
    contadas++;
    if (!dono[n]) semDono.push(`L${n}: ${t.slice(0, 80)}`);
    else if (dono[n].length > 1) sobrepostas.push(`L${n}: ${dono[n].join('+')}`);
  }
  for (const s of semDono) falhas.push('LINHA sem bloco dono ' + s);
  for (const s of sobrepostas) falhas.push('LINHA com mais de um dono ' + s);
  for (const p of j.paragrafos_que_terminam_em_dois_pontos) { stats.literais++; if (norm(strip(line(p.linha))).includes(norm(p.termina_em))) stats.literais_ok++, stats.literais_na_janela++; else falhas.push(`LITERAL termina_em L${p.linha} :: ${p.termina_em}`); }
  // ordem dos blocos
  let ult = 0; for (const b of j.blocos) { if (b.origem.linha_aprox <= ult) falhas.push('ORDEM bloco fora de ordem ' + b.id); ult = b.origem.linha_fim_aprox ?? b.origem.linha_aprox; }

  // 4) cobertura por token (independente)
  const canon = [j.aula.marcador.num, j.aula.marcador.nome, j.aula.titulo_h2_html];
  const colher = (o) => {
    if (Array.isArray(o)) return o.forEach(colher);
    if (!o || typeof o !== 'object') return;
    for (const [k, v] of Object.entries(o)) {
      if (k === 'origem' || k === 'comentario_fonte' || skipKey(k)) continue;
      if (typeof v === 'string' && (k === 'html' || k === 'eq_html' || k === 'desc_html' || k === 'rotulo' || k === 'h5' || k === 'label')) canon.push(v);
      else if (typeof v === 'object') colher(v);
    }
  };
  colher(j.blocos); colher(j.figuras);
  const instr = j.blocos.find((b) => b.tipo === 'instrumento');
  const bag = new Map();
  for (const t of tok(stripSp(canon.join(' ')))) bag.set(t, (bag.get(t) || 0) + 1);
  const srcLines = []; for (let n = sIni + 1; n < sFim; n++) if (!instr || n < instr.origem.linha_aprox || n > instr.origem.linha_fim_aprox) srcLines.push(line(n));
  const srcTok = tok(stripSp(srcLines.join('\n').replace(/<!--[\s\S]*?-->/g, ' ')));
  let hit = 0; const faltando = [];
  for (const t of srcTok) { const c = bag.get(t) || 0; if (c > 0) { hit++; bag.set(t, c - 1); } else faltando.push(t); }
  const pct = +(100 * hit / srcTok.length).toFixed(1);
  if (faltando.length) falhas.push('COBERTURA tokens da fonte sem correspondente: ' + faltando.join(', '));
  const sobra = [...bag.values()].reduce((a, b) => a + b, 0);

  // 5) script do instrumento
  let scriptOk = null;
  if (j.instrumentos.length) {
    const I = j.instrumentos[0]; scriptOk = 0;
    for (const l of I.script.linhas) { scriptOk++; if (line(l.n).trim() !== l.texto) falhas.push(`SCRIPT linha ${l.n} difere`); }
    const ini = I.script.origem.linha_aprox, fim = I.script.origem.linha_fim_aprox;
    if (I.script.linhas.length !== fim - ini + 1) falhas.push('SCRIPT nº de linhas ≠ intervalo');
    for (const k of I.saidas[0].formula_exata_script) if (!I.script.linhas.some((l) => l.texto === k)) falhas.push('SCRIPT formula_exata_script não é linha do script: ' + k);
    // numéricos dos campos
    for (const e of I.entradas) {
      const chk = (o, attr, v, id) => { if (v === null || v === undefined) return; const re = new RegExp(`id="${id}"[^>]*\\b${attr}="${String(v).replace('.', '\\.')}"`); stats.literais++; const w = janela(o.origem.linha_aprox, o.origem.linha_aprox, 0); if (re.test(w.n)) stats.literais_ok++, stats.literais_na_janela++; else falhas.push(`NUMÉRICO ${id}.${attr}=${v} não está na linha ${o.origem.linha_aprox}`); };
      for (const [campo, attr] of [['padrao', 'value'], ['min', 'min'], ['max', 'max'], ['step', 'step']]) { chk(e.number, attr, e.number[campo], e.id); chk(e.range_gemeo, attr, e.range_gemeo[campo], e.range_gemeo.id); }
    }
  }

  // 6) .ts
  const ts = fs.readFileSync(REPO + 'src/lib/data/alexandria-modulo-01-content.ts', 'utf8');
  const escTs = (s) => JSON.stringify(s).slice(1, -1);
  let tsVerb = 0, tsAus = 0;
  if (j.comparacao_codigo.verificacoes_programaticas.por_bloco.length !== j.blocos.length) falhas.push(`TS comparação cobre ${j.comparacao_codigo.verificacoes_programaticas.por_bloco.length} blocos, mas há ${j.blocos.length}`);
  for (const c of j.comparacao_codigo.verificacoes_programaticas.por_bloco) {
    const b = j.blocos.find((x) => x.id === c.bloco);
    if (!b) { falhas.push(`TS bloco ${c.bloco} da comparação não existe em blocos[]`); continue; }
    if (c.estado === 'verbatim' && (b.tipo === 'paragrafo' || b.tipo === 'lead')) { tsVerb++; if (!(ts.includes(escTs(b.html)) || ts.includes(b.html))) falhas.push(`TS ${b.id} dito verbatim mas não está no .ts`); }
    if (c.estado === 'ausente') {
      tsAus++;
      const marcas = b.tipo === 'figura' ? ['Direct Current', 'Alternating Current', 'ac-dc'] : b.tipo === 'lista' ? [b.itens[0].texto.slice(0, 45), b.itens[1].texto.slice(0, 45), b.itens[2].texto.slice(0, 45)] : [b.origem.trecho_inicial];
      for (const m of marcas) if (ts.includes(m)) falhas.push(`TS ${b.id} dito ausente mas "${m}" aparece no .ts`);
    }
  }

  const ok = falhas.length === 0;
  rel.push(`1) LITERAL   strings de conteúdo verificadas: ${stats.literais}; presentes: ${stats.literais_ok} (${stats.literais_na_janela} dentro da janela de origem ±3 linhas, ${stats.literais_so_no_arquivo} só por existência no arquivo); falhas de literal: ${falhas.filter((f) => f.startsWith('LITERAL') || f.startsWith('NUMÉRICO')).length}. Chaves editoriais ignoradas (nota/argumento/decisão/medido…): ${stats.editoriais_ignoradas}.`);
  rel.push(`2) ORIGEM    origens com linha: ${stats.origens}; trecho inicial achado dentro de ±3 linhas: ${stats.origens_ok}; falhas: ${falhas.filter((f) => f.startsWith('ORIGEM') || f.startsWith('OCORRÊNCIA')).length}.`);
  rel.push(`3) LINHAS    linhas de conteúdo na section: ${contadas} (+${estrutura} estruturais: div/section/comentário/branco); sem bloco dono: ${semDono.length}; com mais de um dono: ${sobrepostas.length}; blocos em ordem crescente.`);
  rel.push(`4) COBERTURA ${hit} de ${srcTok.length} tokens da fonte casados (${pct}%)${instr ? ' (markup do instrumento fora do denominador, §5)' : ''}; não casados: ${faltando.length ? faltando.join(', ') : 'nenhum'}; tokens extraídos sem par na fonte (duplicações de html/texto não contam; só campos canônicos): ${sobra}.`);
  rel.push(`5) CONSISTÊNCIA pares html/texto conferidos: ${pares}; ${scriptOk !== null ? `linhas de script conferidas contra o HTML cru: ${scriptOk}; ` : ''}falhas: ${falhas.filter((f) => f.startsWith('CONSISTÊNCIA') || f.startsWith('SCRIPT')).length}.`);
  rel.push(`6) .TS       blocos ditos verbatim e achados no .ts: ${tsVerb}; blocos ditos ausentes e confirmados ausentes: ${tsAus}; falhas: ${falhas.filter((f) => f.startsWith('TS')).length}.`);
  rel.push(ok ? `RESULTADO: 0 falhas.` : `RESULTADO: ${falhas.length} falha(s):\n  - ` + falhas.join('\n  - '));
  relatorio.push(rel.join('\n'));
  resumos[NN] = { ok, falhas: falhas.slice(), linhas: rel.slice(1, -1), resultado: rel[rel.length - 1] };
}
console.log(relatorio.join('\n\n'));

if (process.argv.includes('--stamp')) {
  for (const [NN, r] of Object.entries(resumos)) {
    const f = OUT + `aula-${NN}.md`;
    let md = fs.readFileSync(f, 'utf8');
    const bloco = ['<!-- verif:start -->', `Rodei \`node extratores/verify-aulas-03-04.mjs\` (independente do gerador) em ${new Date().toISOString().slice(0, 10)}. Resultado:`, '', ...r.linhas.map((l) => '- ' + l), '', `**${r.resultado}**`, '<!-- verif:end -->'].join('\n');
    md = md.replace(/<!-- verif:start -->[\s\S]*<!-- verif:end -->/, bloco);
    fs.writeFileSync(f, md, 'utf8');
  }
  console.log('\n(--stamp) seção "Verificação" gravada nos .md');
}
process.exit(Object.values(resumos).every((r) => r.ok) ? 0 : 1);
