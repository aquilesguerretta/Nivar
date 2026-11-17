// Verificador dos JSONs do M06: (1) toda string de conteúdo é substring da fonte;
// (2) toda origem.trecho_inicial está na linha declarada (janela -3..+8, para elementos multilinha).
import fs from 'node:fs';
import { html, LINES, texto, OUTDIR } from './lib.mjs';

const squash = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/[\s ]+/g, '');
const SRC_SQ = squash(html);
const RAW_SQ = html.replace(/[\s ]+/g, '');
const CONTEUDO = new Set(['html', 'texto', 'rotulo', 'titulo', 'titulo_card', 'descricao', 'enunciado', 'explicacao', 'mensagem', 'codigo', 'termo_marcado', 'corpo', 'cicatriz', 'problema', 'resposta', 'risco_novo', 'nome', 'o_que_se_diz', 'correcao', 'resumo_literal', 'expressao_literal', 'condicao_literal', 'rotulo_legado', 'unidade', 'tag', 'titulo_fonte', 'subtitulo_fonte', 'rotulo_fonte', 'exibido_texto', 'parte', 'subtitulo_do_caso', 'familia', 'marcador', 'rotulo_marcador', 'ano', 'periodo', 'horizonte_efetivo', 'aula', 'numero', 'h2', 'href', 'criterio_literal', 'cabecalho_exibido', 'aula_declarada_no_feedback']);
const PULAR_RAMOS = new Set(['comparacao_codigo', 'divergencias', 'lacunas', 'identidade.codigo', 'catalogo_canonico', 'residuos_do_original', 'cobertura_por_token', 'contagens', 'kind_taxonomia', 'cenario_padrao', 'prova', 'vinculos', 'varredura_vinculo', 'candidatos', 'link_numero_range', 'fonte', 'convencoes', 'tres_niveis', 'itens_onde']);

function walk(o, path, out) {
  if (Array.isArray(o)) { o.forEach((x, i) => walk(x, `${path}[${i}]`, out)); return; }
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    const p = path ? `${path}.${k}` : k;
    if (PULAR_RAMOS.has(k)) continue;
    if (k === 'origem' && v && typeof v === 'object' && 'linha_aprox' in v) { out.origens.push({ p, ...v }); continue; }
    if (typeof v === 'string' && CONTEUDO.has(k)) out.strings.push({ p, v });
    else if (typeof v === 'object') walk(v, p, out);
  }
}
let falhasTotal = 0;
const relatorio = {};
for (const nome of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  const j = JSON.parse(fs.readFileSync(`${OUTDIR}/${nome}`, 'utf8'));
  const out = { strings: [], origens: [] };
  walk(j, '', out);
  const falhaStr = out.strings.filter(({ v }) => { const s = squash(v); return s && !SRC_SQ.includes(s) && !RAW_SQ.includes(v.replace(/[\s ]+/g, '')); });
  const falhaOri = out.origens.filter((o) => {
    if (!o.trecho_inicial) return false;
    const win = LINES.slice(Math.max(0, o.linha_aprox - 4), o.linha_aprox + 8).join(' ');
    return !squash(win).includes(squash(o.trecho_inicial)) && !win.replace(/\s+/g, '').includes(o.trecho_inicial.replace(/\s+/g, ''));
  });
  relatorio[nome] = { strings_verificadas: out.strings.length, strings_falhas: falhaStr.map((f) => ({ caminho: f.p, valor: f.v.slice(0, 100) })), origens_verificadas: out.origens.length, origens_falhas: falhaOri.map((f) => ({ caminho: f.p, linha: f.linha_aprox, trecho: f.trecho_inicial })) };
  falhasTotal += falhaStr.length + falhaOri.length;
}
console.log(JSON.stringify(relatorio, null, 1));
console.log('falhas', falhasTotal);
process.exitCode = falhasTotal ? 1 : 0;
