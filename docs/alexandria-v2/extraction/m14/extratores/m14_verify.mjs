// Verificador do M14: confere os tres JSONs contra a fonte, de forma
// independente dos extratores (so reaproveita a leitura do arquivo).
import fs from 'node:fs';
import { html, OUTDIR, texto, decode, inline } from './m14_lib.mjs';
import { executa, estado } from './m14_dom.mjs';

const J = (n) => JSON.parse(fs.readFileSync(`${OUTDIR}/${n}`, 'utf8'));
const linhas = html.split('\n');
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const H1 = norm(html);
const H2 = norm(decode(html.replace(/<[^>]+>/g, '')));
const H3 = norm(decode(html.replace(/<[^>]+>/g, ' ')));
const contem = (s) => { const n = norm(s); return !n || H1.includes(n) || H2.includes(n) || H3.includes(norm(decode(n))); };

const CONTEUDO = new Set(['html', 'texto', 'enunciado', 'explicacao', 'termo', 'definicao_html', 'definicao_texto', 'afirmacao', 'correcao_html', 'correcao_texto', 'pergunta', 'desdobramento_html', 'desdobramento_texto', 'tag', 'resposta_referencia_html', 'descricao_cartao', 'titulo_cartao', 'descricao_html', 'descricao_texto', 'natureza_ou_emissor', 'valor_markup', 'mensagem', 'mensagem_html', 'defeito_dominante', 'o_que_falta_html', 'pergunta_a_fazer', 'forma_corrigida', 'eq', 'desc', 'desc_html', 'rotulo', 'titulo', 'camada', 'pergunta_central', 'evidencia_minima', 'falha_caracteristica', 'resposta_html', 'resposta_texto', 'tempo', 'marcador', 'rotulo_marcador', 'rotulo_chip_y', 'rotulo_renderizado', 'condicao_literal', 'codigo', 'expressao_texto_verbatim', 'frase']);
const PULA = new Set(['divergencias', 'comparacao_codigo', 'codigo_e_catalogo', 'consistencia', 'mecanica_fonte', 'leituras', 'principios_em_outros_grupos', 'resumo', 'cenario_padrao', 'varredura', 'varredura_de_selecoes_no_padrao', 'exemplo_por_ramo', 'painel_por_rota', 'painel_por_enunciado', 'rotulos_de_interface_fonte', 'faixas_de_placar_script', 'trilha_declarada', 'o_que_o_codigo_nao_tem', 'contagens', 'cobertura_por_token', 'convencoes', 'fonte', 'script', 'dados_do_script', 'fragmentos_literais', 'rotulo_fonte', 'vinculos', 'posicao', 'callouts_numeros_vivos_em_aula', 'onde_entra_no_produto_P7', 'criterio_literal_prosa']);

const res = { strings_conferidas: 0, falhas_verbatim: [], origens_conferidas: 0, falhas_origem: [] };
function confereOrigem(o, caminho) {
  if (!o || typeof o.linha_aprox !== 'number' || !o.trecho_inicial) return;
  res.origens_conferidas++;
  const a = Math.max(0, o.linha_aprox - 4), b = Math.min(linhas.length, o.linha_aprox + 12);
  const janela = linhas.slice(a, b).join('\n');
  const t = norm(o.trecho_inicial);
  const ok = norm(decode(janela.replace(/<[^>]+>/g, ''))).includes(t) || norm(decode(janela.replace(/<[^>]+>/g, ' '))).includes(t) || norm(janela).includes(t);
  if (!ok) res.falhas_origem.push({ caminho, linha: o.linha_aprox, trecho: t });
}
function anda(o, caminho) {
  if (Array.isArray(o)) return o.forEach((x, i) => anda(x, `${caminho}[${i}]`));
  if (!o || typeof o !== 'object') return;
  if (o.origem) confereOrigem(o.origem, caminho);
  for (const [k, v] of Object.entries(o)) {
    if (PULA.has(k) || k.startsWith('nota')) continue;
    if (typeof v === 'string' && CONTEUDO.has(k)) {
      res.strings_conferidas++;
      if (!contem(v)) res.falhas_verbatim.push({ caminho: `${caminho}.${k}`, valor: v.slice(0, 120) });
    } else if (Array.isArray(v) && v.every((x) => typeof x === 'string') && ['html', 'cabecalho', 'partes_em_negrito'].includes(k)) {
      v.forEach((x) => { res.strings_conferidas++; if (!contem(x)) res.falhas_verbatim.push({ caminho: `${caminho}.${k}`, valor: x.slice(0, 120) }); });
    } else if (Array.isArray(v) && v.every((x) => Array.isArray(x))) {
      v.flat().forEach((x) => { if (typeof x === 'string') { res.strings_conferidas++; if (!contem(x)) res.falhas_verbatim.push({ caminho: `${caminho}.${k}`, valor: x.slice(0, 120) }); } });
    } else anda(v, `${caminho}.${k}`);
  }
}

const M = J('modulo.json'), A = J('aparato.json'), I = J('instrumentos.json');
anda(M, 'modulo'); anda(A, 'aparato'); anda(I, 'instrumentos');

// igualdade exata por contagem de marcacao
const exatas = [];
const conta = (re) => (html.match(re) || []).length;
const eq = (nome, a, b) => exatas.push({ nome, extraido: a, fonte: b, ok: a === b });
eq('secoes', M.roteiro.length, conta(/<section id=/g));
eq('aulas', M.contagens.aulas, conta(/class="sec-id">Aula \d\d/g));
eq('instrumentos', I.instrumentos.length, conta(/<div class="inst">/g));
eq('termos', A.glossario.termos.length, conta(/class="term"/g));
eq('exercicios', A.exercicios.exercicios.length, (html.slice(html.indexOf('<section id="ex">'), html.indexOf('<section id="quiz">')).match(/<details>/g) || []).length);
eq('checklist', A.checklist_final.itens.length, (html.slice(html.indexOf('<ul class="ck">'), html.indexOf('</ul>', html.indexOf('<ul class="ck">'))).match(/<li>/g) || []).length);
eq('referencias', A.referencias.itens.length, conta(/<span class="src">/g));
eq('erros', M.erros_comuns.itens.length, (html.slice(html.indexOf('<section id="erros">'), html.indexOf('<section id="ex">')).match(/<li>/g) || []).length);
eq('quiz', A.avaliacao.perguntas.length, (html.slice(html.indexOf('var Q=['), html.indexOf('function build()')).match(/\{q:'/g) || []).length);
eq('voz_blocos', M.voz.roteiro_oral.blocos_de_tempo.length, (html.slice(html.indexOf('<section id="voz">'), html.indexOf('<section id="final">')).match(/class="clk-r"/g) || []).length);
eq('cartoes_map', M.mapa.aulas.length, conta(/class="map-card"/g));
eq('pills', M.identidade.meta_pills.length, conta(/class="pill"/g));
eq('checklist_item_a_item', A.checklist_final.itens.every((x, i) => x.html === inline(html.slice(html.indexOf('<ul class="ck">')).split('<li>')[i + 1].split('</li>')[0])), true);
eq('termos_item_a_item', A.glossario.termos.every((t) => html.includes(`<span class="term">${t.termo}</span> — `)), true);
// quiz campo a campo contra reavaliacao independente
{
  const a = html.indexOf('var Q=[') + 6;
  const b = html.indexOf('\n  ];', a) + 4;
  // eslint-disable-next-line no-new-func
  const Q = new Function(`return ${html.slice(a, b)}`)();
  eq('quiz_campo_a_campo', A.avaliacao.perguntas.every((p, i) => p.enunciado === Q[i].q && p.explicacao === Q[i].f && p.gabarito.indice === Q[i].a && p.alternativas.every((x, j) => x.texto === Q[i].o[j])), true);
}
// script verbatim
eq('script_verbatim_dos_10', I.instrumentos.every((i) => html.includes(i.script.codigo_verbatim.join('\n'))), true);
eq('templates_de_texto_nas_linhas', I.instrumentos.every((i) => i.templates_de_texto_script.every((g) => g.codigo.every((l, k) => linhas[g.linha_ini - 1 + k] === l))), true);
eq('ramos_nas_linhas', I.instrumentos.every((i) => i.ramos_do_veredito.every((r) => linhas.slice(r.linha_aprox - 1, r.linha_aprox + 1).join(' ').includes(r.condicao_literal.replace(/^else if/, 'if').replace(/^else$/, 'else')))), true);
eq('script_linhas', I.instrumentos.every((i) => linhas[i.script.linha_ini - 1].includes(i.id_fonte)), true);
// reexecucao: cenario-padrao deterministico
{
  const env = executa();
  const falhas = [];
  for (const i of I.instrumentos) {
    for (const [id, v] of Object.entries(i.cenario_padrao.saidas)) {
      const e = estado(env, [id])[id];
      if (e.valor !== v) falhas.push(`${i.id_fonte}:${id}`);
    }
  }
  eq('cenario_padrao_reexecutado', falhas.length, 0);
}
// numeros-chave independentes (aritmetica feita aqui, nao no script)
{
  const pad = (k) => I.instrumentos.find((x) => x.id_fonte === k).cenario_padrao.saidas;
  const ger = 80 * 210 * 24 * 0.88 / 1000;
  eq('inst06_gerada', pad('INST·06')['cg-p2'], `${Math.round(ger)} GWh`);
  eq('inst06_fc_anual', pad('INST·06')['cg-fc'], `${(ger * 0.45 * 1000 / (80 * 8760) * 100).toFixed(1).replace('.', ',')}%`);
  eq('inst05_q1', pad('INST·05')['dm-q1'], '9,00 bi L');
  eq('inst07_energia_bug', pad('INST·07')['bm-en'], '1 TJ/ano');
  eq('inst08_evitadas', pad('INST·08')['cb-ev'], `${Math.round(100e6 * 21.3 * 87.4 * 0.55 / 1e6).toLocaleString('pt-BR')} t CO₂e`);
}
const out = { ...res, exatas, falhas_exatas: exatas.filter((x) => !x.ok) };
fs.writeFileSync(`${OUTDIR}/extratores/verificacao.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ strings: res.strings_conferidas, falhas_verbatim: res.falhas_verbatim.length, origens: res.origens_conferidas, falhas_origem: res.falhas_origem.length, exatas: exatas.length, falhas_exatas: out.falhas_exatas }, null, 1));
console.log(JSON.stringify(res.falhas_verbatim.slice(0, 15), null, 1));
console.log(JSON.stringify(res.falhas_origem.slice(0, 15), null, 1));
