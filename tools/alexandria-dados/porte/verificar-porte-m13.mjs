// Verifica o porte do texto das aulas do Módulo 13 contra o HTML original
// (`Alexandria modulos/alexandria_modulo13.html`, só leitura). Método e razões
// em `texto-m12-m13.mjs`. Modelo: `tools/alexandria-dados/verificar-porte-m01.mjs`.
//
// Uso: node tools/alexandria-dados/porte/verificar-porte-m13.mjs [--aula 3] [--seg]
//   --seg  imprime os segmentos da fonte (diagnóstico)
// Sai com 1 se houver falta não explicada ou tag órfã.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lerFonte, secao, segmentosDaAula, fluxoDoProduto, conferirOrdem, orfaos, norm } from './texto-m12-m13.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const FONTE = 'C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo13.html';
const TS = path.join(RAIZ, 'src/lib/data/alexandria-modulo-13-content.ts');

const argv = process.argv.slice(2);
const SO_AULA = argv.includes('--aula') ? Number(argv[argv.indexOf('--aula') + 1]) : null;
const MOSTRAR_SEG = argv.includes('--seg');

// Trocas editoriais decididas (aplicadas ao lado da FONTE antes de comparar).
const TROCAS = [
  [/GridAlpha/g, 'NIVAR', 'Q03/P24 (empresa = NIVAR)'],
  // QA-M13-A06 (Q04, o dado vence): o INST·09 percorre OITO riscos; o título retórico
  // "Seis categorias… a sexta" sai. O título da aula é conferido à parte (title).
  [/A sexta categoria: o caso da reestruturação de dívida/, 'A categoria que o currículo não nomeia: o caso da reestruturação de dívida', 'Q04/QA-M13-A06 (06.2 sem o ordinal)'],
  // INST·05 (Q04): a prosa dizia que o instrumento percorre cinco categorias; ele percorre
  // SEIS trechos (as cinco listadas + a sexta, caixa restrito por SPE, que a própria prosa
  // anuncia em seguida). Sai só a atribuição ao instrumento; os números da prosa ficam certos.
  [/As cinco categorias que o instrumento percorre — /, 'As cinco categorias — ', 'Q04/INST·05 (seis trechos)'],
  // div-m13-taxa-real-8-6-vs-8-7 (decisão da coordenação com delegação do Founder, 15/11):
  // vale a conta da própria fórmula, (1,1425 ÷ 1,0516) − 1 = 8,64%, que é também o que o
  // script e o Ex·03 dão. Correção derivada da fonte.
  [/aproximadamente 8,7% ao ano/, 'aproximadamente 8,6% ao ano', 'div-m13-taxa-real (8,7 → 8,6, a conta da fórmula)'],
  // Mesma frase, mesma decisão (15/11): a diferença para a subtração simples é 9,09% − 8,64%
  // = 0,45 p.p. — não "passa de" meio ponto. Correção derivada da fonte.
  [/subtração passa de meio ponto percentual/, 'subtração chega a quase meio ponto percentual', 'div-m13-taxa-real (meio ponto: a conta dá 0,45 p.p.)'],
];

// Título da aula trocado por decisão (o title é conferido contra o h2 da fonte).
const TITULOS_DECIDIDOS = {
  6: ['Oito categorias de risco, e a que o currículo não nomeia', 'Q04/QA-M13-A06: o INST·09 tem oito riscos; o h2 dizia "Seis categorias de risco, e a sexta é a que o currículo não nomeia"'],
};

// Faltas explicadas: prefixo do segmento da fonte (texto normalizado) → razão.
const FALTAS_EXPLICADAS = {};

const { MODULO_13_LEAD, MODULO_13_CORPO, MODULO_13_AULAS } = await import(pathToFileURL(TS).href);
const html = lerFonte(FONTE);

let exit = 0;
const uso = {};
const resumo = [];
for (let n = 1; n <= 8; n++) {
  if (SO_AULA && n !== SO_AULA) continue;
  const id = `aula-13-0${n}`;
  const aula = MODULO_13_AULAS.find((a) => a.id === id);
  const s = secao(html, `a0${n}`);
  const { segmentos } = segmentosDaAula(s.html, { linhaIni: s.linhaIni });
  const h2 = norm((s.html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] ?? '');
  const rotulo = norm((s.html.match(/<div class="sec-id">[\s\S]*?<b>([\s\S]*?)<\/b>/i) || [])[1] ?? '');
  const fluxo = fluxoDoProduto({ aula, lead: MODULO_13_LEAD[id], corpo: MODULO_13_CORPO[id] });
  const faltas = conferirOrdem(segmentos, fluxo.slice(2), TROCAS, uso);
  if (TITULOS_DECIDIDOS[n]) {
    const [t, razao] = TITULOS_DECIDIDOS[n];
    if (norm(aula?.title) !== t) faltas.unshift({ t: `[title] decidido «${t}» × produto «${aula?.title}»` });
    else uso[razao] = 1;
  } else if (norm(aula?.title) !== h2) faltas.unshift({ t: `[title] fonte «${h2}» × produto «${aula?.title}»` });
  if (norm(aula?.subtitle) !== rotulo) faltas.unshift({ t: `[subtitle] fonte «${rotulo}» × produto «${aula?.subtitle}»` });
  const explicadas = []; const reais = [];
  for (const f of faltas) {
    const k = Object.keys(FALTAS_EXPLICADAS).find((p) => f.t.startsWith(p));
    if (k) explicadas.push({ ...f, razao: FALTAS_EXPLICADAS[k] }); else reais.push(f);
  }
  const strs = fluxo.map((e, i) => ({ onde: `#${i}(${e.k})`, s: e.t }));
  const orf = orfaos(strs);
  const desconhecidos = fluxo.filter((e) => e.k.startsWith('?'));
  console.log(`\n══ Aula 0${n} — ${h2}`);
  console.log(`   segmentos da fonte: ${segmentos.length} · entradas do produto: ${fluxo.length}`);
  console.log(`   FALTA: ${reais.length}   explicadas: ${explicadas.length}   ÓRFÃO: ${orf.length}${desconhecidos.length ? `   blocos desconhecidos: ${desconhecidos.length}` : ''}`);
  for (const f of reais) console.log(`   - ${f.foraDeOrdem ? '(fora de ordem) ' : ''}«${f.t.slice(0, 160)}»`);
  for (const f of explicadas) console.log(`   · explicada: «${f.t.slice(0, 80)}» — ${f.razao}`);
  for (const o of orf) console.log(`   ! órfão ${o.onde} <${o.tag}>: ${o.ab} abre, ${o.fe} fecha — «${o.trecho}»`);
  if (MOSTRAR_SEG) segmentos.forEach((x, i) => console.log(`     [${i}] ${x.slice(0, 140)}`));
  resumo.push({ n, seg: segmentos.length, falta: reais.length, explicadas: explicadas.length, orf: orf.length });
  if (reais.length || orf.length || desconhecidos.length) exit = 1;
}

console.log('\n══ Resumo');
console.log('   aula  segmentos  FALTA  explicadas  ÓRFÃO');
for (const r of resumo) console.log(`   ${String(r.n).padStart(4)}  ${String(r.seg).padStart(9)}  ${String(r.falta).padStart(5)}  ${String(r.explicadas).padStart(10)}  ${String(r.orf).padStart(5)}`);
const tot = (k) => resumo.reduce((a, r) => a + r[k], 0);
console.log(`   total ${String(tot('seg')).padStart(9)}  ${String(tot('falta')).padStart(5)}  ${String(tot('explicadas')).padStart(10)}  ${String(tot('orf')).padStart(5)}`);
if (Object.keys(uso).length) console.log(`   trocas editoriais aplicadas à fonte: ${JSON.stringify(uso)}`);
console.log(exit ? '   RESULTADO: FALHA' : '   RESULTADO: 0 falta, 0 órfão');
process.exit(exit);
