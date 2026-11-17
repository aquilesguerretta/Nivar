// Verificador adversarial da extração do M08.
// (1) todo campo de CONTEÚDO dos três JSON é substring da fonte (normalizada);
// (2) todo `origem.trecho_inicial` aparece em linha_aprox ± 3;
// (3) contagens reconciliadas por sinais independentes.
import fs from 'node:fs';
import { html, LINES, texto, decode, OUTDIR, secao, filhosDoWrap } from './m08_lib.mjs';

const N = (s) => decode(String(s)).replace(/<[^>]+>/g, ' ').replace(/\\'/g, "'").replace(/\s+/g, ' ').replace(/\s+([.,;:!?)])/g, '$1').trim().normalize('NFC');
const FONTE_TXT = N(html);
const FONTE_RAW = html.replace(/\\'/g, "'").replace(/\s+/g, ' ').normalize('NFC');

const CONTEUDO = new Set(['html', 'texto', 'enunciado', 'explicacao', 'definicao', 'pergunta', 'descricao', 'mensagem', 'termo_bruto', 'rotulo', 'marcador', 'resumo_literal', 'interlocutor', 'eixo']);
const PULAR = new Set(['divergencias', 'divergencias_fonte', 'comparacao_codigo', 'codigo', 'nota', 'cenario_padrao', 'dados_do_script', 'script', 'saidas', 'ramos_de_leitura', 'origem', 'eixos_origem', 'marca_na_fonte', 'feedback_formato', 'placar', 'textos', 'limiar_script', 'botoes', 'contagens_declaradas', 'trilha_declarada', 'horas', 'titulo_subsecao', 'containers_preenchidos_por_script', 'controles_sem_campo', 'invocacao', 'bloco_catalogo_repo']);

let checados = 0; const falhas = [];
function walk(o, path) {
  if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (PULAR.has(k) || /nota/.test(k)) continue;
    if (typeof v === 'string' && CONTEUDO.has(k) && v.trim()) {
      checados++;
      const n = N(v);
      if (!FONTE_TXT.includes(n) && !FONTE_RAW.includes(v.replace(/\s+/g, ' ').trim()) && !N(html.replace(/'\+[^+]*\+'/g, ' ')).includes(n)) falhas.push({ path: `${path}.${k}`, valor: v.slice(0, 120) });
    } else walk(v, `${path}.${k}`);
  }
}
let origens = 0; const origemFalhas = [];
function walkOrigem(o, path) {
  if (Array.isArray(o)) return o.forEach((v, i) => walkOrigem(v, `${path}[${i}]`));
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (k === 'origem' && v && typeof v === 'object' && v.trecho_inicial != null && v.linha_aprox) {
      origens++;
      const janela = LINES.slice(Math.max(0, v.linha_aprox - 4), v.linha_aprox + 3).join(' ');
      const t = N(v.trecho_inicial).slice(0, 40);
      if (!N(janela).includes(t) && !janela.replace(/\\'/g, "'").includes(String(v.trecho_inicial).slice(0, 40))) origemFalhas.push({ path, linha: v.linha_aprox, trecho: v.trecho_inicial });
    } else walkOrigem(v, `${path}.${k}`);
  }
}

const out = {};
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  const j = JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8'));
  const c0 = checados, f0 = falhas.length, o0 = origens, of0 = origemFalhas.length;
  walk(j, f); walkOrigem(j, f);
  out[f] = { strings_conferidas: checados - c0, falhas: falhas.length - f0, origens_conferidas: origens - o0, origens_falhas: origemFalhas.length - of0 };
}

// contagens por sinais independentes
const M = JSON.parse(fs.readFileSync(`${OUTDIR}/modulo.json`, 'utf8'));
const A = JSON.parse(fs.readFileSync(`${OUTDIR}/aparato.json`, 'utf8'));
const I = JSON.parse(fs.readFileSync(`${OUTDIR}/instrumentos.json`, 'utf8'));
const pill = (r) => Number(M.identidade.contagens_declaradas.find((p) => p.rotulo === r)?.valor);
const sinais = {
  aulas: { hero: pill('aulas'), sec_id_Aula: (html.match(/<b>Aula \d\d<\/b>/g) || []).length, map_cards: M.mapa.cartoes.filter((c) => /^a0/.test(c.alvo)).length, extraido: M.contagens.aulas },
  instrumentos: { hero: pill('instrumentos'), comentarios_INST: (html.match(/<!-- INST \d\d -->/g) || []).length, div_inst: (html.match(/<div class="inst">/g) || []).length, cabecalhos_script: (html.match(/ INST \d\d — /g) || []).length, extraido: I.instrumentos.length },
  termos: { hero: pill('termos'), h2: A.glossario.contagem.declarada_h2, soma_grupos: A.glossario.contagem.soma_declarada_grupos, span_term: (html.match(/class="term"/g) || []).length, extraido: A.glossario.termos.length },
  exercicios: { hero: pill('exercícios'), h2_prosa: 'Doze', details_em_ex: (html.slice(html.indexOf('<section id="ex">'), html.indexOf('<section id="quiz">')).match(/<details>/g) || []).length, extraido: A.exercicios.itens.length },
  erros: { hero: pill('erros comuns'), h2_prosa: 'Dezoito', extraido: M.erros_comuns.itens.length },
  quiz: { hero: pill('perguntas de quiz'), h2_prosa: 'Dez', QZ_q: (html.match(/\{q:'/g) || []).length, extraido: A.quiz.questoes.length },
  checklist: { hero: pill('itens de checklist'), lead_prosa: 'Vinte e seis', extraido: A.checklist_final.itens.length },
  referencias: { hero: pill('referências'), h2_prosa: 'Vinte e oito', extraido: A.referencias.itens.length },
  relampago: { hero: pill('perguntas-relâmpago'), h3_prosa: 'Quarenta', extraido: A.voz_oral.perguntas_relampago.itens.length },
  ataques: { hero: pill('ataques de decisor'), h3_prosa: 'Sete', extraido: A.voz_oral.ataques_de_decisor.itens.length },
  fichas: { hero: pill('fichas de fonte'), src_card_aula02: (html.slice(html.indexOf('<section id="a02">'), html.indexOf('<section id="a03">')).match(/<div class="src-card">/g) || []).length, src_card_total_markup: (html.slice(0, html.indexOf('<script>')).match(/<div class="src-card">/g) || []).length },
};
const res = { arquivos: out, falhas: falhas.slice(0, 40), origem_falhas: origemFalhas.slice(0, 40), sinais };

// cobertura por token (protocolo §5): recall do texto de cada seção de aparato
const tk = (x) => N(x).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
function cob(srcHtml, obj) {
  const bag = new Map(); for (const t of tk(JSON.stringify(obj))) bag.set(t, (bag.get(t) || 0) + 1);
  const st = tk(srcHtml); let hit = 0; const f = [];
  for (const t of st) { const n = bag.get(t) || 0; if (n) { hit++; bag.set(t, n - 1); } else f.push(t); }
  return { tokens: st.length, cobertura: +(100 * hit / st.length).toFixed(1), ausentes: f.slice(0, 15) };
}
const semInst = (id) => filhosDoWrap(id).filter((e) => e.classe !== 'inst').map((e) => e.outer).join(' ');
const cobertura = {
  tese: cob(semInst('tese'), M.tese),
  map: cob(semInst('map'), { m: M.mapa }),
  erros: cob(semInst('erros'), M.erros_comuns),
  final: cob(semInst('final'), A.checklist_final),
  caso: cob(semInst('caso'), A.caso),
  ex: cob(semInst('ex'), A.exercicios),
  quiz_markup: cob(semInst('quiz'), A.quiz),
  quiz_script: cob(A.quiz.questoes.map((q) => q.enunciado + ' ' + q.alternativas.map((a) => a.texto).join(' ') + ' ' + q.explicacao).join(' '), A.quiz),
  voz: cob(semInst('voz'), A.voz_oral),
  lex: cob(semInst('lex'), A.glossario),
  ref: cob(semInst('ref'), A.referencias),
  instrumentos_markup: cob(filhosDoWrap('map').concat(...['a01','a02','a03','a04','a05','a06','a07'].map(filhosDoWrap)).filter((e) => e.classe === 'inst').map((e) => e.outer).join(' '), I.instrumentos),
};
res.cobertura_por_token = cobertura;

fs.writeFileSync(`${OUTDIR}/extratores/verificacao.json`, JSON.stringify(res, null, 2) + '\n');
console.log(JSON.stringify(res, null, 1));
