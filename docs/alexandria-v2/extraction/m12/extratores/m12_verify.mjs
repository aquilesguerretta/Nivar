// Verificador: toda string de conteúdo dos três JSONs precisa existir na fonte
// (substring após colapsar espaço; html contra o HTML cru, texto contra o texto
// sem tags). Toda origem precisa ter trecho_inicial na linha declarada.
import fs from 'node:fs';
import { html, LINES, texto, OUTDIR } from './m12_lib.mjs';

const N = (s) => s.replace(/\s+/g, ' ').trim();
const srcHtml = N(html);
const srcTxt = N(texto(html.replace(/<[^>]+>/g, ' ')));
const srcTxt2 = texto(html);
const IGN = new Set(['nota', 'tema', 'decisao', 'metodo', 'marcacao_p14', 'tipo', 'id', 'seletor',  'divergencias', 'ressalvas', 'comparacao',
  'codigo', 'comparacao_codigo', 'comparacao_execucao', 'convencoes', 'gerado_por', 'fonte', 'grupo', 'modulo', 'camada', 'contagens', 'aula_id_codigo', 'nota_p18', 'enunciado_nota',
  'mecanica_resumo_extracao', 'texto_literal_concatenado', 'origem_opcoes', 'mencao', 'ramos_observados', 'escopo', 'leitura_a', 'leitura_b',
  'data_consulta_origem', 'data_consulta', 'mensagem_ref', 'comportamento', 'rotulo_questao_script', 'vinculo_nota', 'ponteiro', 'rotulo_nota',
  'tipo_fonte', 'arquivo', 'marca_na_fonte', 'trecho', 'padrao', 'secao_html', 'id_html', 'classe', 'cor', 'atributo', 'contador_nota', 'rotulo_render',
  'estrutura', 'dados_script_x_codigo', 'note_codigo', 'fonte_id', 'rotulo_no_script', 'alvo', 'faltam_no_codigo', 'mesmo_termo_em_outro_modulo_no_codigo',
  'condicao', 'condicao_script', 'operador', 'espaco', 'status', 'classe_e_inicio', 'data_de_verificacao', 'mencoes_no_texto', 'vinculos_em_prosa_nota']);
const report = {};
for (const file of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  const j = JSON.parse(fs.readFileSync(`${OUTDIR}/${file}`, 'utf8'));
  let n = 0, falhas = [], origens = 0, origemFalhas = [];
  (function walk(o, path) {
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${path}[${i}]`));
    if (o && typeof o === 'object') {
      if (o.trecho_inicial !== undefined && o.linha_aprox !== undefined) {
        origens++;
        const ok = [-3, -2, -1, 0, 1, 2, 3].some((d) => (LINES[o.linha_aprox - 1 + d] || '').includes(o.trecho_inicial.slice(0, 60).trim()));
        if (!ok) origemFalhas.push(`${path}: L${o.linha_aprox} "${o.trecho_inicial.slice(0, 40)}"`);
        return;
      }
      for (const [k, v] of Object.entries(o)) {
        if (IGN.has(k) || k.endsWith('_nota')) continue;
        if (path === 'instrumentos.json' && k === 'resumo') continue;
        if (path.includes('.comparacao') || path.includes('.codigo') || path.includes('cenario_padrao_renderizado')) continue;
        walk(v, `${path}.${k}`);
      }
      return;
    }
    if (typeof o !== 'string' || o.length < 2) return;
    n++;
    const s = N(o);
    const ok = srcHtml.includes(s) || srcTxt.includes(s) || srcTxt2.includes(s) || srcHtml.includes(s.replace(/"/g, '&quot;'));
    if (!ok) falhas.push(`${path}: ${s.slice(0, 90)}`);
  })(j, file);
  report[file] = { strings_verificadas: n, falhas: falhas.length, origens, origens_falhas: origemFalhas.length, exemplos_falha: falhas.slice(0, 15), exemplos_origem: origemFalhas.slice(0, 10) };
}
console.log(JSON.stringify(report, null, 1));
