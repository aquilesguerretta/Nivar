// Verificador adversarial dos tres JSONs do M07.
// 1) toda string de conteudo existe na fonte (substring normalizada: espacos e entidades);
// 2) toda origem.trecho_inicial e encontrada a ate 3 linhas de linha_aprox;
// 3) contagens cruzadas contra varreduras independentes do HTML.
import fs from 'node:fs';
import { html, decode, OUTDIR, TAG_RE } from './m07_lib.mjs';

const N = (s) => decode(String(s)).replace(/[\s ]+/g, ' ').trim();
const HAY = [
  N(html),
  N(html.replace(/<br\s*\/?>/g, ' ').replace(TAG_RE, '')),
  N(html.replace(TAG_RE, ' ')),
];
const lines = html.split('\n');
const SKIP_KEY = /(^|_)nota$|nota_|^id$|^id_|_id$|tipo|seletor|^onde$|metodo|mecanica|formula|status|camada|^fonte$|gerado_por|arquivo|classe|elemento|marcacao|condicao|operador|variavel|^ramo$|intervalo|renderizad|padrao|descricao_fonte|calculadora|^bloco$|destino|aula_codigo|casamento|unidade|texto_template|^trilha$|^escala$|titulo_secao|titulo_catalogo_repo_citado|chave$|placar|^cor$|^de$|^para$|fluxo|contexto|aviso_do_ref|linguagem_do_caso|^codigo_atual$|^modulo$|^rotulo_chip_nota$|^rotulo_nota$|^frase$|instituicao|texto_concatenado|^escopo$|kind_no_codigo|secao_de_modulo|sem_url|legenda_texto|^item$|^secao$|subsecao_|^marcador$|numero|trecho_inicial|linha|^valor$|^chave$|letra/;
const SKIP_PATH = /(^|\.)(codigo|comparacao_codigo|catalogo_canonico|catalogo_repo|verificacao_codigo|divergencias|contagens|cenario_padrao|legendas_renderizadas|placar_simulado|codigo_blocos|cobertura_codigo_por_token|inventario_de_blocos|contagem_de_aulas|origem|origem_explicacao|grupo_origem|script|posicao_no_texto|campos_ausentes_D5|blocos_da_fonte_ausentes_no_codigo|o_que_o_codigo_nao_tem|o_que_o_codigo_tem|marca_P24|invocacoes_no_texto|vinculos|vinculos_declarados_na_explicacao|gabarito_distribuicao|por_grupo|etapas_barras|chip_template|rotulo_leitura_no_painel|entradas|saidas|grafo|mecanica_fonte|tarefa_declarada_na_fonte|indice_de_callouts|callouts_de_erro_nas_aulas|blocos_de_produto_P7|tres_niveis|fichas_institucionais|subsecoes_por_aula|aulas|perguntas_da_fonte)(\.|$|\[)/;

let checked = 0; const fails = [];
function walk(v, path) {
  if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${path}[${i}]`)); return; }
  if (v && typeof v === 'object') { for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k); return; }
  if (typeof v !== 'string' || !v.trim()) return;
  const key = path.replace(/\[\d+\]/g, '').split('.').pop();
  if (SKIP_KEY.test(key) || SKIP_PATH.test(path.replace(/\[\d+\]/g, ''))) return;
  checked++;
  const n = N(v);
  if (!HAY.some((h) => h.includes(n))) fails.push({ path, valor: v.slice(0, 120) });
}
let origens = 0; const oFails = [];
function walkO(v, path) {
  if (Array.isArray(v)) { v.forEach((x, i) => walkO(x, `${path}[${i}]`)); return; }
  if (!v || typeof v !== 'object') return;
  if (typeof v.trecho_inicial === 'string' && typeof v.linha_aprox === 'number' && v.seletor) {
    origens++;
    const t = v.trecho_inicial.trim();
    const win = lines.slice(Math.max(0, v.linha_aprox - 4), v.linha_aprox + 3).join('\n');
    const ok = win.includes(t) || N(win.replace(/<br\s*\/?>/g, ' ').replace(TAG_RE, '')).includes(N(t)) || N(win.replace(TAG_RE, ' ')).includes(N(t));
    if (!ok) oFails.push({ path, linha: v.linha_aprox, trecho: t.slice(0, 80) });
  }
  for (const [k, x] of Object.entries(v)) walkO(x, `${path}.${k}`);
}

const out = {};
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  const j = JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8'));
  const c0 = checked, f0 = fails.length, o0 = origens, of0 = oFails.length;
  walk(j, ''); walkO(j, '');
  out[f] = { strings_conferidas: checked - c0, falhas: fails.length - f0, origens_conferidas: origens - o0, origens_falhas: oFails.length - of0 };
}

// contagens cruzadas independentes
const count = (re) => (html.match(re) || []).length;
const A = JSON.parse(fs.readFileSync(`${OUTDIR}/aparato.json`, 'utf8'));
const M = JSON.parse(fs.readFileSync(`${OUTDIR}/modulo.json`, 'utf8'));
const I = JSON.parse(fs.readFileSync(`${OUTDIR}/instrumentos.json`, 'utf8'));
const lexStart = html.indexOf('<section id="lex">'); const lexEnd = html.indexOf('</section>', lexStart);
const finStart = html.indexOf('<section id="final">'); const finEnd = html.indexOf('</section>', finStart);
const cruz = {
  aulas: [count(/<div class="sec-id"><b>Aula \d\d<\/b>/g), M.contagens.aulas],
  instrumentos: [count(/<div class="inst">/g), I.contagens.instrumentos],
  termos: [(html.slice(lexStart, lexEnd).match(/class="term"/g) || []).length, A.contagens.glossario.termos],
  exercicios: [(html.slice(html.indexOf('<section id="ex">'), html.indexOf('<section id="quiz">')).match(/<details>/g) || []).length, A.contagens.exercicios.total],
  checklist: [(html.slice(finStart, finEnd).match(/<li>/g) || []).length, A.contagens.checklist_final],
  quiz: [count(/\{q:'/g), A.contagens.quiz.questoes],
  referencias: [count(/<span class="src">/g), A.contagens.referencias.total],
  erros: [(html.slice(html.indexOf('<section id="erros">'), html.indexOf('<section id="ex">')).match(/<tr><td>/g) || []).length, M.contagens.erros_comuns],
  fichas: [count(/<div class="fi">/g), M.contagens.fichas_institucionais],
  perguntas_relampago: [(html.slice(html.indexOf('V.1</span>'), html.indexOf('V.2</span>')).match(/<li>/g) || []).length, M.contagens.perguntas_relampago],
};
const cruzFalhas = Object.entries(cruz).filter(([, [a, b]]) => a !== b);
console.log(JSON.stringify({ por_arquivo: out, falhas: fails.slice(0, 40), origens_falhas: oFails.slice(0, 40), contagens_cruzadas: cruz, contagens_divergentes: cruzFalhas }, null, 1));
fs.writeFileSync(`${OUTDIR}/extratores/verificacao.log.json`, JSON.stringify({ data: new Date().toISOString(), por_arquivo: out, falhas: fails, origens_falhas: oFails, contagens_cruzadas: cruz }, null, 2));
