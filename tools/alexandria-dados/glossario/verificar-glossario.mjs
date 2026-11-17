// Verifica o glossário do produto contra a extração.
//
//   1. 0 falta / 0 órfão — cada verbete da extração tem exatamente um verbete no
//      produto (pelo id da fonte), com termo, etiqueta/família e definição HTML
//      idênticos letra por letra depois das trocas editoriais da Q03
//      (editoriais.mjs, listadas na saída); nenhum verbete do produto fica sem
//      fonte; nenhuma marca ou vocabulário interno sobra no produto.
//   2. Ids — os 637 que o produto já tinha mantêm o id (`noProdutoHoje.id`); ids únicos.
//   3. Contagem por módulo igual à da extração.
//   4. Releitura — cada trecho de RELEITURAS está, literal, na definição de onde
//      diz vir; as chaves são entradas com mais de um módulo.
//   5. Agrupamento — quantas entradas o glossário geral mostra e quantas têm
//      mais de um módulo, comparado aos 184 homônimos da extração.
//   6. Vínculo termo → aula (decisão 5) — calculado sobre o corpo real das aulas
//      com a mesma regra do produto (glossario-ocorrencia.ts); imprime a
//      contagem por módulo. Não falha: o corpo das aulas muda com o porte.
//
// Uso: node tools/alexandria-dados/glossario/verificar-glossario.mjs [--json saida.json]
// Sai com código 1 se 1–4 falharem.

import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { aplicarEditoriais, vigiadosEm } from './editoriais.mjs';

// Os arquivos de conteúdo importam irmãos sem extensão ('./alexandria-modulo-08-fatos').
register(
  'data:text/javascript,' +
    encodeURIComponent(`export async function resolve(s, c, n) {
      if ((s.startsWith('./') || s.startsWith('../')) && !/\\.[mc]?[jt]sx?$/.test(s)) {
        try { return await n(s + '.ts', c); } catch {}
      }
      return n(s, c);
    }`),
);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const imp = (rel) => import(pathToFileURL(path.join(RAIZ, rel)).href);
const g = JSON.parse(fs.readFileSync(path.join(RAIZ, 'docs/alexandria-v2/extraction/glossario/glossario.json'), 'utf8'));

const erros = [];
const falha = (m) => erros.push(m);

// ── 1–3 ─────────────────────────────────────────────────────
const produto = [];
for (let i = 1; i <= 17; i++) {
  const nn = String(i).padStart(2, '0');
  const mod = await imp(`src/lib/data/alexandria-glossario-modulos/m${nn}.ts`);
  const lista = mod[`GLOSSARIO_M${nn}`];
  if (!lista) falha(`m${nn}.ts não exporta GLOSSARIO_M${nn}`);
  for (const v of lista ?? []) produto.push({ ...v, modulo: `m${nn}` });
}

const porFonte = new Map();
for (const p of produto) {
  if (porFonte.has(p.fonte)) falha(`fonte repetida no produto: ${p.fonte}`);
  porFonte.set(p.fonte, p);
}
const ids = new Set();
for (const p of produto) {
  if (ids.has(p.id)) falha(`id repetido: ${p.id}`);
  ids.add(p.id);
}

let faltas = 0;
let divergentes = 0;
const trocas = [];
let idsPreservados = 0;
for (const v of g.verbetes) {
  const p = porFonte.get(v.id);
  if (!p) {
    faltas++;
    falha(`falta no produto: ${v.id} ${v.termo}`);
    continue;
  }
  const unit = v.etiqueta ?? v.familia;
  const campos = [
    ['term', v.termo],
    ['unit', unit],
    ['definition', v.definicao.html],
  ].map(([k, literal]) => {
    // As trocas da Q03 aplicadas do lado da extração antes de comparar.
    const { texto, feitas } = aplicarEditoriais(literal);
    for (const f of feitas) trocas.push(`${v.id} ${k}: «${f.de}» → «${f.para}» [${f.regra}]`);
    return [k, texto];
  });
  for (const [k, esperado] of campos) {
    const vig = vigiadosEm(p[k]);
    if (vig.length || /GridAlpha/.test(p[k])) falha(`${v.id} ${k}: marca ou vocabulário interno no produto (${vig.join(', ') || 'GridAlpha'})`);
    if (p[k] !== esperado) {
      divergentes++;
      falha(`${v.id} ${k} difere: produto «${String(p[k]).slice(0, 60)}» × fonte «${String(esperado).slice(0, 60)}»`);
    }
  }
  if (p.modulo !== v.ancora.modulo) falha(`${v.id} no arquivo ${p.modulo}, fonte diz ${v.ancora.modulo}`);
  if (v.noProdutoHoje?.id) {
    if (p.id === v.noProdutoHoje.id) idsPreservados++;
    else falha(`${v.id}: id mudou (${v.noProdutoHoje.id} → ${p.id})`);
  }
}
const daFonte = new Set(g.verbetes.map((v) => v.id));
const orfaos = produto.filter((p) => !daFonte.has(p.fonte));
for (const o of orfaos) falha(`órfão no produto: ${o.id} (${o.fonte})`);

const contagemModulo = [];
for (const m of g.modulos) {
  const n = produto.filter((p) => p.modulo === m.modulo).length;
  contagemModulo.push({ modulo: m.modulo, extracao: m.termos, produto: n });
  if (n !== m.termos) falha(`${m.modulo}: produto ${n}, extração ${m.termos}`);
}

// ── 4–5 ─────────────────────────────────────────────────────
const oc = await imp('src/lib/alexandria/glossario-ocorrencia.ts');
const { RELEITURAS } = await imp('src/lib/data/alexandria-glossario-releitura.ts');

// A mesma chave de agrupamento de src/lib/alexandria/verbetes.ts.
const normalizar = (s) =>
  oc
    .decodificar(s.replace(/<[^>]+>/g, ' '))
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
const chaveDoTermo = (t) => normalizar(t.replace(/\s*\([^)]*\)\s*/g, ' ')).replace(/\.$/, '');

const grupos = new Map();
for (const p of produto) {
  const k = chaveDoTermo(oc.decodificar(p.term));
  if (!grupos.has(k)) grupos.set(k, []);
  grupos.get(k).push(p);
}
const multi = [...grupos.entries()].filter(([, l]) => new Set(l.map((p) => p.modulo)).size > 1);
const homonimosExtracao = new Set(g.homonimos.map((h) => h.chave));
const soNoAgrupamento = multi.filter(([, l]) => new Set(l.map((p) => p.term.toLowerCase())).size > 1);

const porId = new Map(produto.map((p) => [p.id, p]));
const textoDe = (html) => oc.decodificar(html.replace(/<[^>]+>/g, ''));
for (const r of RELEITURAS) {
  const grupo = grupos.get(r.chave);
  if (!grupo || new Set(grupo.map((p) => p.modulo)).size < 2) falha(`releitura «${r.chave}» não é entrada de vários módulos`);
  for (const d of r.divergencias) {
    for (const l of d.leituras) {
      const p = porId.get(l.verbete);
      if (!p) {
        falha(`releitura: verbete ${l.verbete} não existe`);
        continue;
      }
      if (`M${p.modulo.slice(1)}` !== l.codigo) falha(`releitura: ${l.verbete} é ${p.modulo}, não ${l.codigo}`);
      if (!textoDe(p.definition).includes(l.trecho)) falha(`releitura: «${l.trecho}» não está, literal, em ${l.verbete}`);
      if (!grupo?.includes(p)) falha(`releitura: ${l.verbete} não pertence à entrada «${r.chave}»`);
    }
  }
}

// ── 6 ───────────────────────────────────────────────────────
const vinculo = [];
let totalComAula = 0;
let totalPares = 0;
for (let i = 1; i <= 17; i++) {
  const nn = String(i).padStart(2, '0');
  const c = await imp(`src/lib/data/alexandria-modulo-${nn}-content.ts`);
  const corpo = c[`MODULO_${nn}_CORPO`] ?? {};
  const aulas = Object.keys(corpo)
    .sort()
    .map((id) => ({ id, blocos: corpo[id] }));
  const termos = produto.filter((p) => p.modulo === `m${nn}`).map((p) => ({ id: p.id, termo: p.term }));
  const mapa = oc.aulasOndeAparece(aulas, termos);
  const com = [...mapa.values()].filter((a) => a.length).length;
  const pares = [...mapa.values()].reduce((s, a) => s + a.length, 0);
  const semPadrao = termos.filter((t) => !oc.padraoDoTermo(t.termo)).map((t) => t.termo);
  totalComAula += com;
  totalPares += pares;
  vinculo.push({ modulo: `M${nn}`, aulas: aulas.length, termos: termos.length, aparecem: com, pares, semPadrao });
}

// ── relatório ───────────────────────────────────────────────
console.log(`Extração: ${g.verbetes.length} verbetes · produto: ${produto.length}`);
console.log(`Falta: ${faltas} · órfão: ${orfaos.length} · campo divergente: ${divergentes}`);
console.log(`Trocas editoriais (Q03): ${trocas.length}`);
for (const t of trocas) console.log(`  ${t}`);
console.log(`Ids preservados dos ${g.verbetes.filter((v) => v.noProdutoHoje?.id).length} que o produto já tinha: ${idsPreservados}`);
console.log(`Entradas no glossário geral: ${grupos.size} · com mais de um módulo: ${multi.length} (homônimos da extração: ${homonimosExtracao.size})`);
for (const [k, l] of soNoAgrupamento) {
  console.log(`  junta grafias: ${k} ← ${l.map((p) => `${p.modulo}:${p.term}`).join(' | ')}`);
}
console.log(`Releituras: ${RELEITURAS.length} (${RELEITURAS.filter((r) => r.veredito === 'divergem').length} com divergência registrada)`);
console.log('Vínculo termo → aula (mecânico, sobre o corpo atual das aulas):');
for (const v of vinculo) {
  console.log(
    `  ${v.modulo}  ${String(v.aparecem).padStart(3)}/${String(v.termos).padEnd(3)} termos aparecem · ${String(v.pares).padStart(3)} pares termo×aula · ${v.aulas} aulas${v.semPadrao.length ? ` · sem padrão: ${v.semPadrao.join(', ')}` : ''}`,
  );
}
console.log(`  total ${totalComAula}/${produto.length} · ${totalPares} pares`);

const i = process.argv.indexOf('--json');
if (i > 0) {
  fs.writeFileSync(
    process.argv[i + 1],
    JSON.stringify({ contagemModulo, vinculo, entradas: grupos.size, multi: multi.length, soNoAgrupamento: soNoAgrupamento.map(([k, l]) => ({ chave: k, termos: l.map((p) => `${p.modulo}:${p.term}`) })) }, null, 1),
  );
}

if (erros.length) {
  console.error(`\n${erros.length} erro(s):`);
  for (const e of erros.slice(0, 40)) console.error('  ' + e);
  process.exit(1);
}
console.log('\nOK');
