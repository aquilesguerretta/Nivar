// Verificacao estrita (2a passada, 2026-09-17). O m07_verify.mjs pula caminhos inteiros
// (aulas, fichas_institucionais, tres_niveis, perguntas_da_fonte, entradas, saidas, vinculos,
// frase, valor...). Aqui so se pula o que e metadado estrutural ou comparacao com codigo/catalogo.
// Toda string restante tem de existir na fonte (substring normalizada) ou e listada, agrupada por
// chave, para inspecao manual. Grava extratores/verificacao_estrita.log.json.
import fs from 'node:fs';
import { html, decode, OUTDIR, TAG_RE } from './m07_lib.mjs';

const N = (s) => decode(String(s)).replace(/[\s ]+/g, ' ').trim();
const HAY = [
  N(html),
  N(html.replace(/<br\s*\/?>/g, ' ').replace(TAG_RE, '')),
  N(html.replace(TAG_RE, ' ')),
  N(html.replace(TAG_RE, '')),
];
// so metadado: ids, seletores, tipos, notas desta extracao, proveniencia, comparacao com codigo/catalogo
const META_KEY = /^(id|ids?_.*|.*_id|seletor|tipo|tipo_.*|camada|fonte|gerado_por|metodo|modulo|status|nota|.*_nota|nota_.*|classe|elemento|linha|linha_aprox|linha_.*|trecho_inicial|marcacao_p14|kind.*|arquivo|leitura_a|leitura_b|severidade|decisao_ref|onde)$/;
const META_PATH = /(^|\.)(codigo|comparacao_codigo|catalogo_canonico|catalogo_repo|verificacao_codigo|divergencias|contagens|cobertura_codigo_por_token|codigo_blocos|blocos_da_fonte_ausentes_no_codigo|o_que_o_codigo_nao_tem|o_que_o_codigo_tem|contagem_de_aulas|campos_ausentes_D5|origem|marca_P24)(\.|$)/;

const report = {};
const allFails = [];
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  const j = JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8'));
  let checked = 0; const fails = [];
  (function walk(v, path) {
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${path}[${i}]`)); return; }
    if (v && typeof v === 'object') { for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k); return; }
    if (typeof v !== 'string' || !v.trim()) return;
    const gen = path.replace(/\[\d+\]/g, '');
    const key = gen.split('.').pop();
    if (META_KEY.test(key) || META_PATH.test(gen)) return;
    checked++;
    const n = N(v);
    if (!HAY.some((h) => h.includes(n))) fails.push({ path, gen, valor: v.slice(0, 140) });
  })(j, '');
  const porChave = {};
  for (const x of fails) (porChave[x.gen] ||= []).push(x.valor);
  report[f] = { strings_conferidas: checked, nao_encontradas: fails.length, por_caminho: Object.fromEntries(Object.entries(porChave).map(([k, v]) => [k, { n: v.length, exemplo: v[0] }])) };
  allFails.push(...fails.map((x) => ({ arquivo: f, ...x })));
}
console.log(JSON.stringify(report, null, 1));
fs.writeFileSync(`${OUTDIR}/extratores/verificacao_estrita.log.json`, JSON.stringify({ data: new Date().toISOString(), report, falhas: allFails }, null, 2));
