// Verificação independente das três extrações do M02:
//  (1) literalidade: todo campo `texto` / `html` / `enunciado` / `mensagem`… com conteúdo da fonte
//      precisa existir, normalizado, no HTML-fonte;
//  (2) cobertura por token (protocolo §5) por seção, descontando o que é declaradamente fora do grupo.
// Escreve verificacao.json.
import fs from 'node:fs';
import { html, texto, inner, secao, all, OUTDIR, escrever, HOJE, divBalanceado } from './lib.mjs';

const J = (n) => JSON.parse(fs.readFileSync(`${OUTDIR}/${n}`, 'utf8'));
const MOD = J('modulo.json'), APA = J('aparato.json'), INS = J('instrumentos.json');

const nrm = (s) => texto(s).replace(/ /g, ' ');
const corpusTexto = nrm(html);
const corpusHtml = inner(html);
// strings de script são JS: aspas escapadas etc. já estão literais no arquivo

// campos que carregam texto de conteúdo (não notas desta extração)
const CAMPOS_TEXTO = new Set(['texto', 'enunciado', 'explicacao', 'mensagem', 'rotulo', 'valor', 'termo', 'etiqueta', 'dimensao', 'titulo', 'tema', 'pergunta', 'marca', 'meta_texto', 'titulo_obra', 'descricao', 'dominio_ou_caminho_citado', 'cartao_titulo', 'cartao_subtitulo', 'nivel', 'rotulo_marcador', 'atribuicao', 'trecho_inicial']);
const CAMPOS_HTML = new Set(['html', 'meta_html', 'termo_html']);
const IGNORAR_RAMOS = new Set(['codigo', 'comparacao_codigo', 'catalogo_canonico', 'contagens', 'metadados', 'textos_de_leitura', 'saidas_textuais_curtas', 'calculo_numerico', 'status_por_parte', 'cenario_padrao', 'dados_por_opcao', 'espaco_de_entrada', 'script', 'mencoes_textuais', 'callouts_por_rotulo', 'convencoes', 'fonte', 'divergencias', 'lacunas']);

function varrer(obj, caminho, out) {
  if (Array.isArray(obj)) { obj.forEach((v, i) => varrer(v, `${caminho}[${i}]`, out)); return; }
  if (!obj || typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    if (IGNORAR_RAMOS.has(k)) continue;
    if (k.endsWith('_nota') || k === 'nota' && typeof v === 'string') continue;
    if (typeof v === 'string' && v.length >= 2) {
      if (CAMPOS_HTML.has(k)) out.push({ caminho: `${caminho}.${k}`, tipo: 'html', v });
      else if (CAMPOS_TEXTO.has(k)) out.push({ caminho: `${caminho}.${k}`, tipo: 'texto', v });
    } else varrer(v, `${caminho}.${k}`, out);
  }
}
const alvos = [];
varrer(MOD, 'modulo', alvos);
varrer(APA, 'aparato', alvos);
varrer(INS, 'instrumentos', alvos);
// o quiz vive em strings JS; as demais em markup
const falhas = [];
for (const a of alvos) {
  const ok = a.tipo === 'html'
    ? corpusHtml.includes(inner(a.v)) || corpusHtml.includes(inner(a.v).replace(/"/g, "'"))
    : corpusTexto.includes(nrm(a.v)) || html.includes(a.v);
  if (!ok) falhas.push({ caminho: a.caminho, tipo: a.tipo, valor: a.v.slice(0, 120) });
}

// (2) cobertura por token
const toks = (s) => nrm(s).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
function cobertura(fonteTxt, extraidos) {
  const bolsa = new Map();
  for (const t of toks(extraidos.join(' '))) bolsa.set(t, (bolsa.get(t) || 0) + 1);
  const fonte = toks(String(fonteTxt).replace(/<[^>]+>/g, ' '));
  let hit = 0; const faltando = [];
  for (const t of fonte) { const n = bolsa.get(t) || 0; if (n > 0) { hit++; bolsa.set(t, n - 1); } else faltando.push(t); }
  return { tokens_fonte: fonte.length, cobertos: hit, pct: fonte.length ? +(100 * hit / fonte.length).toFixed(1) : 100, faltando_amostra: [...new Set(faltando)].slice(0, 25) };
}
const coletar = (obj) => { const out = []; varrer(obj, '', out); return out.map((x) => x.v); };
const semInstrumentos = (body) => {
  let s = body;
  for (;;) { const i = s.indexOf('<div class="instrument">'); if (i < 0) break; const abs = html.indexOf(s.slice(i, i + 400)); const { end } = divBalanceado(abs); s = s.slice(0, i) + s.slice(i + (end - abs)); }
  return s;
};
const sec = (n) => secao(n).body;
const qa = html.indexOf('const questions = ['), qb = html.indexOf('];', qa);
const quizFonte = [...html.slice(qa, qb).matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).join(' ');
const cob = {
  hero_e_rodape: cobertura(html.match(/<section class="hero">[\s\S]*?<\/section>/)[0] + html.match(/<footer[\s\S]*?<\/footer>/)[0] + html.match(/<header class="alex-header">[\s\S]*?<\/header>/)[0], coletar(MOD.identidade)),
  '§ 00': cobertura(sec('§ 00'), [...coletar(MOD.tese), ...coletar(MOD.resultado_esperado), ...coletar(MOD.voz.principios_editoriais[0]), MOD.roteiro[0].marcador_num, MOD.roteiro[0].marcador_rotulo, ...coletar(MOD.tese.consequencias), ...MOD.tese.consequencias.cabecalho, ...MOD.tese.consequencias.linhas.map((l) => String(l.numero))]),
  '§ MAP': cobertura(sec('§ MAP'), [...coletar(MOD.mapa), ...MOD.mapa.cabecalho_tabela, MOD.mapa.marcador.num, MOD.mapa.marcador.rotulo, ...MOD.mapa.linhas.map((l) => l.aula)]),
  '§ Caso': cobertura(sec('§ Caso'), [...coletar(APA.caso), APA.caso.marcador, APA.caso.leitura.titulo, APA.caso.o_que_pedir.titulo]),
  '§ Erros': cobertura(sec('§ Erros'), [...coletar(MOD.erros_comuns), ...MOD.erros_comuns.cabecalho_tabela, MOD.erros_comuns.marcador.num, MOD.erros_comuns.marcador.rotulo, ...MOD.erros_comuns.itens.map((x) => String(x.numero))]),
  '§ Ex': cobertura(sec('§ Ex'), [...coletar(APA.exercicios), APA.exercicios.marcador, ...APA.exercicios.itens.flatMap((e) => [e.tag, e.botao.rotulo])]),
  '§ Quiz (markup)': cobertura(sec('§ Quiz'), [...coletar(APA.avaliacao), APA.avaliacao.marcador, APA.avaliacao.placar.rotulo, APA.avaliacao.placar.total_literal, '0']),
  '§ Quiz (script: questões)': cobertura(quizFonte, APA.avaliacao.questoes.flatMap((q) => [q.enunciado, q.explicacao, ...q.alternativas.map((a) => a.texto)])),
  '§ Voz': cobertura(sec('§ Voz'), [...coletar(MOD.voz.secao_voz), MOD.voz.secao_voz.marcador.num, MOD.voz.secao_voz.marcador.rotulo, 'V.1', 'V.2', MOD.voz.secao_voz.perguntas_relampago.titulo, MOD.voz.secao_voz.roteiro_oral.titulo]),
  '§ Final': cobertura(sec('§ Final'), [...coletar(APA.checklist_final), APA.checklist_final.marcador]),
  '§ Lex': cobertura(sec('§ Lex'), [...coletar(APA.glossario), APA.glossario.marcador]),
  '§ Ref': cobertura(sec('§ Ref'), [...coletar(APA.referencias), APA.referencias.marcador, ...APA.referencias.grupos.map((g) => g.titulo)]),
  instrumentos_markup: cobertura(
    [...html.matchAll(/<div class="instrument">/g)].map((m) => divBalanceado(m.index).inner).join(' '),
    INS.instrumentos.flatMap((i) => [i.titulo, i.id_fonte, i.nota_do_instrumento?.html ?? '', ...i.entradas.flatMap((c) => [c.rotulo ?? '', c.unidade ?? '', ...(c.opcoes || []).map((o) => o.rotulo)]), ...i.saidas.flatMap((s) => [s.rotulo ?? '', s.valor_estatico_no_markup ?? ''])]),
  ),
};
cob['§ 00'].nota = 'Inclui o h2 e a pull-quote; o callout gold está em modulo.voz.';
cob.instrumentos_markup.nota = '"—" e ids não são tokens de palavra; o resto do markup do instrumento é rótulo/nota.';

const aulasSemInstrumento = (n) => cobertura(semInstrumentos(sec(n)), []);
// (3) origem: trecho_inicial encontrado a ±3 linhas da linha declarada
const LIN = html.split('\n');
const origens = [];
(function col(o, p) { if (Array.isArray(o)) return o.forEach((v, i) => col(v, `${p}[${i}]`)); if (!o || typeof o !== 'object') return; for (const [k, v] of Object.entries(o)) { if (['codigo', 'comparacao_codigo', 'divergencias', 'catalogo_canonico'].includes(k)) continue; if (k === 'origem' && v && typeof v.trecho_inicial === 'string' && typeof v.linha_aprox === 'number' && !v.arquivo) origens.push({ caminho: `${p}.origem`, ...v }); else col(v, `${p}.${k}`); } })({ modulo: MOD, aparato: APA, instrumentos: INS }, '');
const origemFalhas = origens.filter((o) => { const janela = LIN.slice(Math.max(0, o.linha_aprox - 4), o.linha_aprox + 3).join(' '); return !nrm(janela).includes(nrm(o.trecho_inicial)) && !janela.includes(o.trecho_inicial); }).map((o) => ({ caminho: o.caminho, trecho: o.trecho_inicial.slice(0, 80), linha_aprox: o.linha_aprox }));

const res = {
  gerado_em: HOJE,
  literalidade: { strings_verificadas: alvos.length, falhas: falhas.length, detalhes_falhas: falhas },
  origens: { verificadas: origens.length, fora_da_janela: origemFalhas.length, detalhes: origemFalhas },
  cobertura_por_token: cob,
  nota: 'Cobertura das aulas (corpo) está fora do escopo deste grupo (modulo/aparato/instrumentos); só o que é invocado ou apontado por elas foi extraído.',
};
escrever('verificacao.json', res);
console.log('strings', alvos.length, 'falhas', falhas.length, '| origens', origens.length, 'fora', origemFalhas.length);
for (const f of origemFalhas.slice(0, 20)) console.log('  O', f.caminho, f.linha_aprox, '|', f.trecho);
for (const f of falhas.slice(0, 15)) console.log('  F', f.caminho, '|', f.valor);
for (const [k, v] of Object.entries(cob)) console.log(k, v.pct + '%', v.tokens_fonte, v.faltando_amostra.join(' '));
