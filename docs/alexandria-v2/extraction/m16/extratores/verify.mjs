// Verificador adversarial da extracao M16 (so leitura da fonte).
// 1) toda string de conteudo dos 3 JSON e substring da fonte (normalizada: entidades decodificadas,
//    espacos colapsados; `texto` confere contra a fonte sem tags; strings de script contra o script);
// 2) toda `origem.trecho_inicial` aparece a ate 3 linhas de `linha_aprox`;
// 3) contagens recontadas direto do markup.
import fs from 'node:fs';
import { html, LINES, decode, texto, OUTDIR, secao } from './lib.mjs';

const col = (s) => s.replace(/\s+/g, ' ').trim();
const SRC_HTML = col(decode(html));
const SRC_TXT = col(decode(html.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')));
// variante: tags removidas sem espaco (como texto()) — ja e o SRC_TXT; e variante com tags trocadas por espaco
const SRC_TXT2 = col(decode(html.replace(/<[^>]+>/g, ' ')));

// chaves que sao anotacao (nao conferidas)
const SKIP = new Set(['nota', 'tipo', 'id', 'mecanica', 'descricao', 'decisao', 'tema', 'assinatura', 'metodo', 'marcacao_p14',
  'codigo_atual', 'comparacao_codigo', 'divergencias', 'divergencias_locais', 'convencoes', 'gerado_por', 'fonte', 'contagens', 'renderizacoes',
  'cenario_padrao', 'ramos_alcancados', 'evidencia', 'seletor', 'secao', 'secao_id', 'aula', 'aula_id', 'grupo', 'modulo', 'camada',
  'escopo', 'ref', 'itens_ref', 'lede_inicio', 'atributo', 'valor', 'id_fonte', 'id_valor', 'id_memoria', 'classe', 'cor', 'estado_codigo',
  'marcador', 'status', 'chave', 'condicao', 'limiar', 'script', 'codigo_fonte', 'numero_fonte', 'tag', 'formulas_da_aula_relacionadas',
  'textos_de_memoria', 'seletor_metodo_efeito', 'datas_citadas', 'termos_ausentes_no_codigo', 'mencoes_a_aula_em_prosa', 'palavras_de_colisao_declaradas',
  'tendencias_declaradas', 'veredito', 'barras_html', 'saidas', 'alvos_dinamicos', 'opcoes', 'cabecalho', 'leitura_das_entradas', 'calculo',
  'formatacao_das_saidas', 'barras', 'veredito_codigo', 'ligacao_de_eventos', 'codigo', 'comentario_fonte', 'campos', 'linhas', 'destaques', 'resposta_da_fonte_a_primeira_metade',
  'rotulos_fixos', 'invocacao', 'faixas_iguais', 'passos_iguais', 'numero', 'deslizador', 'unidade', 'rotulo_fonte', 'exige_rotulo', 'mensagem_html', 'summary_completo',
  'dados', 'familia', 'catalogo_familias', 'prosa_declara', 'data_de_consulta_global', 'colofao_modulo', 'parte', 'criterio_literal', 'rotulo_secundario',
  'titulo_script']);
const fails = [];
let checked = 0;
function inSrc(s, key) {
  const n = col(s);
  if (!n) return true;
  return SRC_HTML.includes(n) || SRC_TXT.includes(n) || SRC_TXT2.includes(n);
}
function walk(o, path) {
  if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${path}[${i}]`));
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) {
      if (SKIP.has(k) || k.startsWith('nota')) continue;
      if (k === 'origem') { checkOrigem(v, path); continue; }
      walk(v, `${path}.${k}`);
    }
    return;
  }
  if (typeof o === 'string') {
    checked++;
    if (!inSrc(o)) fails.push({ path, valor: o.slice(0, 120) });
  }
}
const orFails = [];
let orChecked = 0;
function checkOrigem(or, path) {
  if (!or || typeof or.linha_aprox !== 'number') return;
  orChecked++;
  const a = Math.max(0, or.linha_aprox - 4), b = Math.min(LINES.length, or.linha_aprox + 3);
  const win = LINES.slice(a, b).join('\n');
  const variants = [col(decode(win)), col(decode(win.replace(/<[^>]+>/g, ''))), col(decode(win.replace(/<[^>]+>/g, ' ')))];
  const t = col(or.trecho_inicial || '').slice(0, 25);
  if (t && !variants.some((v) => v.includes(t))) orFails.push({ path, linha: or.linha_aprox, trecho: t });
}

// strings de dados de script: conferir contra o script decodificado
const SCRIPT_DEC = decode(html.slice(html.indexOf('<script>'), html.indexOf('</script>')));
const dataFails = [];
let dataChecked = 0;
function walkData(o, path) {
  if (Array.isArray(o)) return o.forEach((x, i) => walkData(x, `${path}[${i}]`));
  if (o && typeof o === 'object') return Object.entries(o).forEach(([k, v]) => walkData(v, `${path}.${k}`));
  if (typeof o === 'string') { dataChecked++; if (!SCRIPT_DEC.includes(o) && !SCRIPT_DEC.includes(o.replace(/"/g, '\\"'))) dataFails.push({ path, valor: o.slice(0, 80) }); }
}

const files = ['modulo.json', 'aparato.json', 'instrumentos.json'];
const report = {};
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8'));
  const before = [fails.length, orFails.length, checked, orChecked];
  walk(j, f);
  if (f === 'instrumentos.json') {
    for (const inst of j.instrumentos) if (inst.dados) for (const [k, v] of Object.entries(inst.dados)) walkData(v.valor, `${inst.id}.dados.${k}`);
    // codigo verbatim
    for (const inst of j.instrumentos) if (inst.logica) for (const part of Object.values(inst.logica)) for (const ln of part) { dataChecked++; if (decode(LINES[ln.linha - 1]).replace(/\s+$/, '') !== ln.codigo) dataFails.push({ path: `${inst.id}.logica L${ln.linha}`, valor: ln.codigo.slice(0, 60) }); }
  }
  if (f === 'aparato.json') {
    for (const q of j.avaliacao.perguntas) for (const s of [q.enunciado, q.explicacao, ...q.alternativas.map((a) => a.texto)]) { dataChecked++; if (!SCRIPT_DEC.includes(s)) dataFails.push({ path: q.id, valor: s.slice(0, 60) }); }
  }
  report[f] = { strings: checked - before[2], falhas: fails.length - before[0], origens: orChecked - before[3], origens_falhas: orFails.length - before[1] };
}

// recontagem independente
const cnt = {
  aulas: (html.match(/<div class="sec-id">Aula \d\d/g) || []).length,
  secoes: (html.match(/<section id="/g) || []).length,
  instrumentos: (html.match(/<div class="inst">/g) || []).length,
  termos: (secao('lex').body.match(/class="term"/g) || []).length,
  exercicios: (secao('ex').body.match(/<details>/g) || []).length,
  checklist: (secao('final').body.match(/<li>/g) || []).length,
  erros: (secao('erros').body.match(/<tr><td>/g) || []).length,
  referencias: (secao('ref').body.match(/<li><span class="src">/g) || []).length,
  quiz: (html.match(/\{q:'/g) || []).length,
  fichas: (secao('fichas').body.match(/<div class="emp">/g) || []).length,
};
const M = JSON.parse(fs.readFileSync(`${OUTDIR}/modulo.json`, 'utf8'));
const A = JSON.parse(fs.readFileSync(`${OUTDIR}/aparato.json`, 'utf8'));
const I = JSON.parse(fs.readFileSync(`${OUTDIR}/instrumentos.json`, 'utf8'));
const extraido = {
  aulas: M.contagens.aulas, secoes: M.contagens.secoes, instrumentos: I.instrumentos.length, termos: A.contagens.glossario.termos,
  exercicios: A.contagens.exercicios.na_fonte, checklist: A.contagens.checklist.itens, erros: M.contagens.erros_comuns,
  referencias: A.contagens.referencias.itens, quiz: A.contagens.quiz.questoes, fichas: A.contagens.fichas.fichas,
};
const contagens_ok = Object.keys(cnt).every((k) => cnt[k] === extraido[k]);

// render x dados (INST 01/07/10/11): cada texto de dado aparece no painel renderizado correspondente
let renderChecks = 0, renderFails = [];
for (const inst of I.instrumentos) {
  if (inst.codigo_fonte === 'INST·10') for (const r of inst.renderizacoes) { const o = inst.dados.GP.valor[r.tendencia][r.elo]; for (const s of [o.c, ...o.q]) { renderChecks++; if (!r.painel_texto.includes(s)) renderFails.push(`${inst.id} ${r.tendencia}/${r.elo}`); } }
  if (inst.codigo_fonte === 'INST·07') for (const r of inst.renderizacoes) { const o = inst.dados.L.valor.find((x) => x.k === r.dispositivo); for (const s of [o.n, o.e, o.d, o.y]) { renderChecks++; if (!r.painel_texto.includes(s)) renderFails.push(`${inst.id} ${r.dispositivo}`); } }
  if (inst.codigo_fonte === 'INST·01') for (const r of inst.renderizacoes) { const o = inst.dados.D.valor[r.dimensao][r.tendencia]; for (const s of [o.t, o.d, o.f]) { renderChecks++; if (!r.painel_texto.includes(s)) renderFails.push(`${inst.id} ${r.dimensao}/${r.tendencia}`); } }
  if (inst.codigo_fonte === 'INST·11') for (const r of inst.renderizacoes.filter((x) => x.enunciado)) { const o = inst.dados.E.valor.find((x) => x.k === r.enunciado); for (const s of [o.en, o.fa, o.pq, o.ok]) { renderChecks++; if (!r.cartao_texto.includes(s)) renderFails.push(`${inst.id} ${r.enunciado}`); } }
}

const out = { report, fails, orFails, dataChecked, dataFails, cnt, extraido, contagens_ok, renderChecks, renderFails };
console.log(JSON.stringify(out, null, 1));
