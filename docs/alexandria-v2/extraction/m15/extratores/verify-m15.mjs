// Verificador: toda string de CONTEÚDO dos três JSONs precisa existir na fonte
// (HTML com espaços colapsados), e o `texto` precisa existir no texto da fonte.
// Anotações (nota*, tipo, id, papel, marcacao_p14, comparação com código…) ficam fora.
import fs from 'node:fs';
import { html, OUTDIR, inl, txt, txtSp } from './lib.mjs';

const SRC_HTML = inl(html);
const SRC_TXT = txt(html) + ' ' + txtSp(html);
const HTML_KEYS = new Set(['html', 'definicao_html', 'explicacao_html', 'mensagem', 'mensagem_html', 'termo_html', 'rotulo', 'rotulo_fonte', 'marcador_rotulo', 'sec_rotulo', 'enunciado', 'template_script', 'codigo', 'palavra', 'cabecalho', 'chave', 'elo', 'segmento', 'titulo', 'tempo', 'afirmacao', 'valor_inicial_marcacao', 'unidade', 'unidade_exibida', 'padrao_literal', 'estado', 'familia', 'tag']);
const TEXT_KEYS = new Set(['texto', 'definicao_texto', 'explicacao_texto', 'termo']);
const SKIP_KEYS = new Set(['comparacao_codigo', 'codigo_atual', 'codigo', 'divergencias', 'nota', 'origem', 'vinculos', 'fidelidade', 'cenario_padrao', 'dados_script', 'resumo', 'observacoes_gerais', 'contagens', 'convencoes', 'kind_nota', 'marca_gridalpha_ocorrencias', 'posicao_no_texto', 'titulo_catalogo', 'escala_catalogo', 'trilha', 'contagem', 'cobertura_por_token', 'papel', 'rotulos_de_interface_fonte', 'faixas_de_placar_script', 'limiar_script', 'distribuicao_gabarito', 'itens_por_marcacao_P14', 'contagem_declarada', 'por_tipo_declarado', 'normas_citadas_no_corpo_sem_item_proprio', 'verificado_em', 'instrumento', 'entradas_dinamicas', 'dinamicas', 'decisao_literal_x']);
const CODE_KEYS = new Set(['codigo', 'template_script']); // conferidos contra o HTML cru (script)

let checked = 0; const fails = [];
function walk(o, p, file) {
  if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${p}[${i}]`, file));
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('nota') || k.endsWith('_nota')) continue;
    if (SKIP_KEYS.has(k) && !(k === 'codigo' && typeof v === 'string')) continue;
    if (typeof v === 'string' && v) {
      if (CODE_KEYS.has(k)) { checked++; if (!inl(html).includes(inl(v))) fails.push({ file, p: `${p}.${k}`, v: v.slice(0, 80) }); }
      else if (HTML_KEYS.has(k)) { checked++; if (!SRC_HTML.includes(inl(v)) && !html.includes(v)) fails.push({ file, p: `${p}.${k}`, v: v.slice(0, 80) }); }
      else if (TEXT_KEYS.has(k)) { checked++; if (!SRC_TXT.includes(v) && !html.includes(v)) fails.push({ file, p: `${p}.${k}`, v: v.slice(0, 80) }); }
    } else walk(v, `${p}.${k}`, file);
  }
}
const out = {};
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  const before = checked; const fb = fails.length;
  walk(JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8')), '$', f);
  out[f] = { strings_conferidas: checked - before, falhas: fails.length - fb };
}
console.log(JSON.stringify(out));
for (const x of fails.slice(0, 40)) console.log('FALHA', x.file, x.p, '|', x.v);
fs.writeFileSync(`${OUTDIR}/extratores/verify-m15.result.json`, JSON.stringify({ resultado: out, falhas: fails }, null, 2) + '\n');
