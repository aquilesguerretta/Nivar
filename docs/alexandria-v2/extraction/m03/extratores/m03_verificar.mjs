// Verificação INDEPENDENTE das três extrações do M03 (não importa lib.mjs,
// para não herdar um defeito dos extratores).
//  (1) literalidade: todo campo de conteúdo precisa existir, normalizado, no HTML-fonte;
//  (2) origem: todo {seletor, trecho_inicial, linha_aprox} precisa casar a linha ±3;
//  (3) recontagem por regex nova (aulas, INST, exercícios, termos, checklist, quiz, refs);
//  (4) cobertura por token (protocolo §5) das seções de aparato.
// Escreve verificacao.json. A fonte é SOMENTE LEITURA.
import fs from 'node:fs';
import vm from 'node:vm';

const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo03.html';
const OUT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/extraction/m03';
const RAW = fs.readFileSync(SRC, 'utf8');
const LINES = RAW.split('\n');
const J = (n) => JSON.parse(fs.readFileSync(`${OUT}/${n}`, 'utf8'));
const MOD = J('modulo.json'), APA = J('aparato.json'), INS = J('instrumentos.json');

const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&amp;/g, '&');
const ws = (s) => s.replace(/[\s\u00a0]+/g, ' ').trim();
const plain = (h) => ws(dec(h.replace(/<[^>]+>/g, ' ')));
const plainTight = (h) => ws(dec(h.replace(/<[^>]+>/g, '')));
const jsUnesc = (s) => s.replace(/\\(["'\\/])/g, '$1');
const CORPUS_HTML = ws(RAW);
const CORPUS_TXT = plain(RAW);
const CORPUS_TXT2 = plainTight(RAW);
const CORPUS_JS = ws(jsUnesc(RAW));
const ok = (v) => {
  const w = ws(v);
  return CORPUS_HTML.includes(w) || CORPUS_TXT.includes(plain(v)) || CORPUS_TXT2.includes(plainTight(v))
    || CORPUS_JS.includes(w) || CORPUS_HTML.includes(ws(dec(v))) || plain(RAW.replace(/<[^>]+>/g, ' ')).includes(plain(v));
};

// (1) literalidade — campos que carregam texto de conteúdo
const CONTEUDO = new Set(['html', 'texto', 'meta_html', 'meta_texto', 'titulo', 'preambulo', 'tema', 'mensagem',
  'frase_teste_honesto', 'literal', 'enunciado', 'explicacao', 'definicao_html', 'definicao_texto', 'termo', 'etiqueta',
  'descricao_verbatim', 'instituicao_ou_autor', 'dominio_citado', 'rotulo_fonte', 'publico', 'afirma', 'fonte_h2_texto',
  'fonte_marcador', 'fonte_map_tema', 'rotulo_marcador', 'marca', 'valor_estatico_no_markup', 'instrucao_literal',
  'criterio_literal_prosa', 'prosa_declara', 'fonte_literal', 'fonte_prosa_map', 'tag_fonte', 'rotulo_botao',
  'comentario_script', 'comentario_html_da_fonte', 'expressao_js', 'codigo', 'trecho', 'atribuicao',
  'rotulo', 'valor', 'nome', 'condicao', 'mensagem', 'titulo_obra', 'descricao']);
// ramos que são anotação/código-alvo, execução ou comparação (não texto da fonte)
const PULAR = new Set(['comparacao_codigo', 'codigo_atual', 'catalogo_canonico', 'convencoes', 'fonte', 'varredura',
  'cenario_padrao', 'pilha_no_cenario_padrao', 'campos_codigo', 'divergencias', 'gerado_por', 'metodo', 'arquivos_codigo',
  'resumo', 'onde_entra_no_produto_nota', 'status_codigo', 'codigo_glossario', 'comparacao_glossario', 'faltam_no_codigo',
  'comparacao_badges', 'comparacao_exercicios', 'execucao']);
const alvos = [];
function varrer(o, cam) {
  if (Array.isArray(o)) return o.forEach((v, i) => varrer(v, `${cam}[${i}]`));
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (PULAR.has(k)) continue;
    if (typeof v === 'string') { if (CONTEUDO.has(k) && v.trim().length >= 2 && !(k === 'trecho' && cam.endsWith('origem'))) alvos.push({ cam: `${cam}.${k}`, k, v }); }
    else varrer(v, `${cam}.${k}`);
  }
}
varrer(MOD, 'modulo'); varrer(APA, 'aparato'); varrer(INS, 'instrumentos');
// rótulo do quiz é gerado pelo template do script (`Pergunta ${String(idx + 1).padStart(2, "0")} / 10`)
const TEMPLATE_QUIZ = RAW.includes('Pergunta ${String(idx + 1).padStart(2, "0")} / 10');
// "else (correct <= 4)": ramo terminal `else` do placar, anotado com o intervalo implícito
const derivado = (a) => (a.k === 'condicao' && /^else \(correct <= \d+\)$/.test(a.v) && /\} else \{/.test(RAW)) || a.k === 'rotulo_fonte' && /^Pergunta \d\d \/ 10$/.test(a.v) && TEMPLATE_QUIZ;
const falhas = alvos.filter((a) => !ok(a.v) && !derivado(a)).map((a) => ({ caminho: a.cam, valor: a.v.slice(0, 160) }));

// (1b) leituras de divergência que citam a FONTE (não código/catálogo): cada parte precisa ser literal
const divLeituras = [];
const coletaDiv = (arr, nome) => (arr || []).forEach((d) => (d.leituras || []).forEach((l, j) => {
  if (typeof l.literal !== 'string') return;
  if (/\.ts|catálogo|catalogo|código|codigo/i.test(l.onde)) return;
  const partes = l.literal.split(/ \| | \/ |\[[^\]]+\] /).map((x) => x.trim()).filter((x) => x.length > 2);
  const falt = partes.filter((x) => !ok(x) && !ok(x.replace(/…$/, '')));
  divLeituras.push({ caminho: `${nome}.${d.id}[${j}]`, onde: l.onde, ok: falt.length === 0, partes_nao_literais: falt });
}));
coletaDiv(MOD.divergencias, 'modulo'); coletaDiv(APA.divergencias, 'aparato');
coletaDiv(INS.divergencias, 'instrumentos');

// (2) origens
const origens = [];
function varrerOrig(o, cam) {
  if (Array.isArray(o)) return o.forEach((v, i) => varrerOrig(v, `${cam}[${i}]`));
  if (!o || typeof o !== 'object') return;
  if (typeof o.trecho_inicial === 'string' && typeof o.linha_aprox === 'number') origens.push({ cam, ...o });
  for (const [k, v] of Object.entries(o)) varrerOrig(v, `${cam}.${k}`);
}
varrerOrig(MOD, 'modulo'); varrerOrig(APA, 'aparato'); varrerOrig(INS, 'instrumentos');
const origFalhas = [];
for (const o of origens) {
  const t = ws(o.trecho_inicial).slice(0, 60);
  let achou = false;
  for (let d = -3; d <= 3 && !achou; d++) {
    const l = LINES[o.linha_aprox - 1 + d];
    if (l && (ws(l).includes(t) || plain(l).includes(plain(t)))) achou = true;
  }
  if (!achou) origFalhas.push({ caminho: o.cam, linha: o.linha_aprox, trecho: o.trecho_inicial.slice(0, 80) });
}

// (3) recontagem independente
const cnt = (re) => (RAW.match(re) || []).length;
const aulasFonte = [...RAW.matchAll(/<span class="num">Aula (\d\d)<\/span>/g)].map((m) => m[1]);
const instFonte = [...RAW.matchAll(/class="instrument-id">INST · (\d\d)</g)].map((m) => m[1]);
const exFonte = [...RAW.matchAll(/class="exercise-tag">([^<]+)</g)].map((m) => m[1]);
const termosFonte = [...RAW.matchAll(/<summary><span class="term">([^<]+)<\/span>/g)].map((m) => dec(m[1]));
const checkFonte = cnt(/class="checklist-item"><div/g);
const qa = RAW.indexOf('const questions'); const qEnd = RAW.indexOf('];', qa);
let questoes = null;
try { questoes = vm.runInNewContext(RAW.slice(qa, qEnd + 2).replace(/^const questions\s*=/, '(') .replace(/;$/, ')')); } catch (e) { questoes = String(e); }
const secRef = RAW.slice(RAW.indexOf('<span class="num">§ Ref</span>'), RAW.indexOf('</section>', RAW.indexOf('<span class="num">§ Ref</span>')));
const refItens = (secRef.match(/<li[\s>]/g) || []).length;
const refDivs = (secRef.match(/class="ref-item"|class="source-item"|class="src-item"/g) || []).length;

const q = APA.avaliacao?.perguntas ?? [];
const recontagem = {
  aulas: { fonte: aulasFonte.length, extraido_roteiro: MOD.roteiro.filter((r) => /^Aula \d\d$/.test(r.marcador_num)).length, extraido_map: MOD.mapa?.linhas?.length },
  instrumentos: { fonte: instFonte.length, ids_fonte: instFonte, extraido: INS.instrumentos.length },
  exercicios: { fonte: exFonte.length, tags_fonte: exFonte, extraido: APA.exercicios?.itens?.length },
  termos_glossario: { fonte: termosFonte.length, glossary_item: cnt(/class="glossary-item"/g), extraido: APA.glossario?.termos?.length ?? APA.glossario?.itens?.length },
  checklist: { fonte: checkFonte, extraido: APA.checklist_final?.itens?.length },
  quiz: { fonte: Array.isArray(questoes) ? questoes.length : questoes, extraido: q.length,
    alternativas_iguais: Array.isArray(questoes) ? questoes.every((x, i) => q[i] && JSON.stringify(x.options) === JSON.stringify(q[i].alternativas.map((a) => a.texto))) : null,
    enunciados_iguais: Array.isArray(questoes) ? questoes.every((x, i) => q[i] && x.q === q[i].enunciado) : null,
    explicacoes_iguais: Array.isArray(questoes) ? questoes.every((x, i) => q[i] && x.feedback === q[i].explicacao) : null,
    gabaritos_iguais: Array.isArray(questoes) ? questoes.every((x, i) => q[i] && x.correct === q[i].gabarito.indice && q[i].gabarito.texto === x.options[x.correct]) : null },
  referencias: { li_na_secao: refItens, divs_item: refDivs, extraido: APA.referencias?.itens?.length ?? (APA.referencias?.grupos || []).reduce((s, g) => s + (g.itens?.length || 0), 0) },
};
// conferência profunda do quiz: enunciado/alternativas/gabarito/explicação vs objeto avaliado da fonte
const quizDif = [];
if (Array.isArray(questoes)) {
  const keys = Object.keys(questoes[0]);
  recontagem.quiz.chaves_fonte = keys;
  questoes.forEach((src, i) => {
    const ex = q[i]; if (!ex) return quizDif.push({ i, erro: 'ausente' });
    const vals = Object.values(src);
    const strs = vals.filter((v) => typeof v === 'string');
    const arr = vals.find(Array.isArray) || [];
    const num = vals.find((v) => typeof v === 'number');
    const exStr = JSON.stringify(ex);
    for (const s of [...strs, ...arr]) if (!exStr.includes(JSON.stringify(s).slice(1, -1))) quizDif.push({ i, falta: s.slice(0, 80) });
    const gab = ex.gabarito_indice ?? ex.gabarito?.indice ?? ex.correta_indice ?? ex.resposta_indice;
    if (num !== undefined && gab !== undefined && gab !== num) quizDif.push({ i, gabarito_fonte: num, gabarito_extraido: gab });
    if (gab === undefined) quizDif.push({ i, aviso: 'campo de gabarito não localizado pelo verificador', chaves: Object.keys(ex) });
  });
}

// (4) cobertura por token das seções de aparato
const toks = (s) => plain(s).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const secBody = (num) => { const a = RAW.indexOf(`<span class="num">${num}</span>`); return RAW.slice(a, RAW.indexOf('</section>', a)); };
const todasStrings = (o) => { const out = []; const w = (x) => { if (Array.isArray(x)) x.forEach(w); else if (x && typeof x === 'object') Object.entries(x).forEach(([k, v]) => { if (!PULAR.has(k)) w(v); }); else if (typeof x === 'string') out.push(x); }; w(o); return out; };
function cobertura(fonte, extr) {
  const bolsa = new Map();
  // tokeniza string a string: juntar antes de remover tags deixa um "<" literal engolir texto
  for (const t of extr.flatMap((x) => toks(x))) bolsa.set(t, (bolsa.get(t) || 0) + 1);
  const f = toks(fonte); let hit = 0; const falt = [];
  for (const t of f) { const n = bolsa.get(t) || 0; if (n) { hit++; bolsa.set(t, n - 1); } else falt.push(t); }
  return { tokens_fonte: f.length, pct: +(100 * hit / Math.max(1, f.length)).toFixed(1), faltando_amostra: [...new Set(falt)].slice(0, 20) };
}
const semInst = (s) => s.replace(/<div class="instrument">[\s\S]*?<!-- \/instrument -->/g, '');
const cob = {
  '§ 00': cobertura(secBody('§ 00'), [...todasStrings(MOD.tese), ...todasStrings(MOD.resultado_esperado), ...todasStrings(MOD.criterio), ...todasStrings(MOD.voz), ...todasStrings(MOD.roteiro)]),
  '§ MAP': cobertura(secBody('§ MAP'), [...todasStrings(MOD.mapa), ...todasStrings(MOD.roteiro)]),
  '§ Caso': cobertura(secBody('§ Caso'), todasStrings(APA.caso)),
  '§ Erros': cobertura(secBody('§ Erros'), [...todasStrings(MOD.erros_comuns), ...todasStrings(MOD.roteiro)]),
  '§ Ex': cobertura(secBody('§ Ex'), todasStrings(APA.exercicios)),
  '§ Quiz': cobertura(secBody('§ Quiz'), todasStrings(APA.avaliacao)),
  '§ Voz': cobertura(secBody('§ Voz'), [...todasStrings(MOD.voz), ...todasStrings(MOD.roteiro)]),
  '§ Final': cobertura(secBody('§ Final'), todasStrings(APA.checklist_final)),
  '§ Lex': cobertura(secBody('§ Lex'), todasStrings(APA.glossario)),
  '§ Ref': cobertura(secBody('§ Ref'), todasStrings(APA.referencias)),
  'hero': cobertura(RAW.match(/<section class="hero">[\s\S]*?<\/section>/)[0], todasStrings(MOD.identidade)),
  'script do quiz': Array.isArray(questoes) ? cobertura(questoes.map((x) => Object.values(x).flat().filter((v) => typeof v === 'string').join(' ')).join(' '), todasStrings(APA.avaliacao)) : null,
};

const res = {
  gerado_em: '2026-09-17',
  gerado_por: 'extratores/m03_verificar.mjs (independente de lib.mjs)',
  literalidade: { strings_verificadas: alvos.length, falhas: falhas.length, detalhes_falhas: falhas },
  leituras_de_divergencia: { verificadas: divLeituras.length, nao_literais: divLeituras.filter((x) => !x.ok) },
  origens: { verificadas: origens.length, falhas: origFalhas.length, detalhes_falhas: origFalhas },
  recontagem, quiz_diferencas: quizDif,
  cobertura_por_token: cob,
};
fs.writeFileSync(`${OUT}/verificacao.json`, JSON.stringify(res, null, 2) + '\n', 'utf8');
console.log('literalidade', alvos.length, 'falhas', falhas.length);
for (const f of falhas.slice(0, 40)) console.log('  F', f.caminho, '|', f.valor);
console.log('div', divLeituras.length, JSON.stringify(divLeituras.filter((x) => !x.ok), null, 1));
console.log('origens', origens.length, 'falhas', origFalhas.length);
for (const f of origFalhas.slice(0, 20)) console.log('  O', f.caminho, f.linha, '|', f.trecho);
console.log(JSON.stringify(recontagem, null, 1));
console.log('quizDif', JSON.stringify(quizDif).slice(0, 1500));
for (const [k, v] of Object.entries(cob)) if (v) console.log('cob', k, v.pct + '%', v.tokens_fonte, v.faltando_amostra.join(' '));
