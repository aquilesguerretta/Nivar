// verificar-formas.mjs — recalcula instrumentos amostrados no cenário-padrão e compara
// com o valor estático que o markup da fonte já traz.
//
//   node tools/alexandria-dados/verificar-formas.mjs [--semente 165] [--n 10]
//
// Três provas, de naturezas diferentes (a primeira sozinha seria circular):
//   A. markup × script — o valor estático escrito no HTML (lido do HTML cru por regex,
//      sem passar pelo DOM de mini-dom.mjs) contra o que o script do módulo escreve
//      depois de carregar (executado em mini-dom.mjs). Divergência aqui é achado
//      sobre a FONTE, não falha do verificador.
//   B. recálculo independente — fórmula fechada transcrita das linhas da fonte, com as
//      entradas lidas do HTML cru (atributo value=), contra a execução. Falha aqui é
//      defeito do stub de DOM.
//   C. consistência com formas.json — o que formas.json guardou para o instrumento
//      amostrado tem de bater com uma execução nova. Falha aqui é geração velha.
//
// A amostra sai só entre instrumentos que têm algum valor estático concreto no markup
// (a maior parte das saídas nasce como "—" e não há com o que comparar).
// Semente fixa e documentada; nada é escolhido a dedo.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { executarInstrumento } from './executar.mjs';
import { arquivoHtml, decodificar } from './mini-dom.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(AQUI, '..', '..', 'docs/alexandria-v2/extraction/instrumentos');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? +process.argv[i + 1] : d; };
const SEMENTE = arg('--semente', 165), N = arg('--n', 10);

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const doc = JSON.parse(fs.readFileSync(path.join(DIR, 'instrumentos.json'), 'utf8'));
const formas = fs.existsSync(path.join(DIR, 'formas.json')) ? JSON.parse(fs.readFileSync(path.join(DIR, 'formas.json'), 'utf8')) : null;
const htmlCru = new Map();
const cru = (n) => { if (!htmlCru.has(n)) htmlCru.set(n, fs.readFileSync(arquivoHtml(n), 'utf8').replace(/<script[\s\S]*?<\/script>/g, '')); return htmlCru.get(n); };

/** Texto estático do elemento #id no HTML cru (regex; independente do DOM). */
function estaticoCru(n, id) {
  const re = new RegExp(`<(\\w+)\\b[^>]*\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>([\\s\\S]*?)</\\1>`);
  const m = re.exec(cru(n));
  return m ? decodificar(m[2].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim() : null;
}
/** Atributo value= de um input no HTML cru. */
function valorCru(n, id) {
  const m = new RegExp(`<input\\b[^>]*\\bid=["']${id}["'][^>]*>`).exec(cru(n));
  const v = m && /\bvalue=["']([^"']*)["']/.exec(m[0]);
  return v ? parseFloat(v[1]) : null;
}
const concreto = (e) => e && e !== '—' && e !== '-' && /\d/.test(e);
const digitos = (s) => String(s).replace(/[^\d]/g, '');

/* ---------------- universo comparável e amostra ---------------- */
const comparaveis = [];
for (const reg of doc.instrumentos) {
  const n = +reg.identidade.modulo.slice(1);
  const pares = reg.saidas.filter((s) => s.id).map((s) => ({ s, est: estaticoCru(n, s.id) })).filter((x) => concreto(x.est));
  if (pares.length) comparaveis.push({ reg, n, pares });
}
const rnd = mulberry32(SEMENTE);
const pool = comparaveis.slice();
const amostra = [];
while (amostra.length < Math.min(N, comparaveis.length)) amostra.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
amostra.sort((a, b) => a.reg.identidade.id.localeCompare(b.reg.identidade.id));

console.log(`Universo: ${doc.instrumentos.length} instrumentos; ${comparaveis.length} têm algum valor estático concreto no markup (os demais nascem como "—").`);
console.log(`Amostra: ${amostra.length} (semente ${SEMENTE}): ${amostra.map((a) => a.reg.identidade.id).join(', ')}\n`);

/* ---------------- A. markup × script ---------------- */
let nIgual = 0, nFormato = 0, nDiverg = 0, nTotal = 0;
const achados = [];
console.log('A. markup (HTML cru) × script (execução nova)');
console.log('instrumento'.padEnd(13) + 'saída'.padEnd(16) + 'markup'.padEnd(18) + 'script'.padEnd(18) + 'veredito');
const execs = new Map();
for (const { reg, n, pares } of amostra) {
  const ex = executarInstrumento(reg, { pontos: 2 });
  execs.set(reg.identidade.id, ex);
  for (const { s, est } of pares) {
    const x = ex.padrao.saidas[s.id]?.texto ?? null;
    nTotal++;
    let v;
    if (x === est) { v = 'igual'; nIgual++; }
    else if (x != null && digitos(x) === digitos(est)) { v = 'mesmos dígitos, separadores diferentes (formato)'; nFormato++; achados.push({ id: reg.identidade.id, saida: s.id, markup: est, script: x, tipo: 'formato' }); }
    else { v = 'DIVERGE'; nDiverg++; achados.push({ id: reg.identidade.id, saida: s.id, markup: est, script: x, tipo: 'valor' }); }
    console.log(reg.identidade.id.padEnd(13) + String(s.id).padEnd(16) + String(est).slice(0, 16).padEnd(18) + String(x).slice(0, 16).padEnd(18) + v);
  }
}
console.log(`\n  ${nTotal} comparações: ${nIgual} iguais, ${nFormato} de formato, ${nDiverg} divergentes.\n`);

/* ---------------- B. recálculo independente ---------------- */
// Fórmulas fechadas transcritas da fonte (M01), entradas do HTML cru.
console.log('B. recálculo independente (fórmula fechada transcrita da fonte; entradas lidas do HTML cru)');
const fmt = (v, min, max = min) => v.toLocaleString('pt-BR', { minimumFractionDigits: min, maximumFractionDigits: max });
const independentes = [
  { id: 'm01-inst-01', saida: 'i01-out', fonte: 'M01 l.2745: v = kW × h; toLocaleString(pt-BR, máx. 2 casas)', calc: () => fmt(valorCru(1, 'i01-kw') * valorCru(1, 'i01-h'), 0, 2) },
  { id: 'm01-inst-03', saida: 'i03-out', fonte: 'M01 l.2807: P = I × I × R; toLocaleString(pt-BR, máx. 0 casas)', calc: () => { const i = valorCru(1, 'i03-i'), r = valorCru(1, 'i03-r'); return fmt(i * i * r, 0, 0); } },
  { id: 'm01-inst-04', saida: 'i04-pmed', fonte: 'M01 l.2841: Pmed = E ÷ T; máx. 1 casa', calc: () => fmt(valorCru(1, 'i04-kwh') / valorCru(1, 'i04-h'), 0, 1) },
  { id: 'm01-inst-04', saida: 'i04-fc', fonte: 'M01 l.2842: FC = Pmed ÷ Pmax; 2 casas', calc: () => fmt(valorCru(1, 'i04-kwh') / valorCru(1, 'i04-h') / valorCru(1, 'i04-pmax'), 2, 2) },
  { id: 'm01-inst-05', saida: 'tri-kva-val', fonte: 'M01 l.2885: kva = √(kw² + kvar²)', calc: () => fmt(Math.sqrt(valorCru(1, 'i05-kw') ** 2 + valorCru(1, 'i05-kvar') ** 2), 0, 0), tolerarSeAusente: true },
];
let bOk = 0, bFalha = 0;
for (const c of independentes) {
  const reg = doc.instrumentos.find((i) => i.identidade.id === c.id);
  const ex = execs.get(c.id) ?? executarInstrumento(reg, { pontos: 2 });
  const exec = ex.padrao.saidas[c.saida]?.texto ?? null;
  let esp; try { esp = c.calc(); } catch (e) { esp = 'erro: ' + e.message; }
  if (exec == null && c.tolerarSeAusente) { console.log(`  ${c.id} ${c.saida}: saída não está na especificação (ignorada)`); continue; }
  const ok = exec === esp || digitos(exec) === digitos(esp);
  console.log(`  ${c.id.padEnd(13)}${c.saida.padEnd(13)}independente=${String(esp).padEnd(10)} execução=${String(exec).padEnd(10)} ${ok ? 'confere' : 'NÃO CONFERE'}   (${c.fonte})`);
  ok ? bOk++ : bFalha++;
}
console.log(`\n  ${bOk} conferem, ${bFalha} não conferem.\n`);

/* ---------------- C. consistência com formas.json ---------------- */
let cOk = 0, cFalha = 0, cAusente = 0;
console.log('C. formas.json × execução nova (cenário-padrão)');
if (!formas) console.log('  formas.json não existe — rode gerar-formas.mjs');
else for (const { reg } of amostra) {
  const rec = formas.registros.find((r) => r.id === reg.identidade.id);
  if (!rec) { cAusente++; console.log(`  ${reg.identidade.id}: fora dos 121 que prometem forma (não está em formas.json)`); continue; }
  const ex = execs.get(reg.identidade.id);
  let dif = 0, n = 0;
  for (const s of rec.cenario_padrao.saidas) {
    if (!s.id) continue;
    n++;
    if ((ex.padrao.saidas[s.id]?.texto ?? null) !== s.texto_executado) dif++;
  }
  console.log(`  ${reg.identidade.id}: ${n - dif}/${n} saídas iguais à execução nova`);
  dif ? cFalha++ : cOk++;
}
console.log(`\n  ${cOk} instrumentos consistentes, ${cFalha} desatualizados, ${cAusente} fora de formas.json.\n`);

console.log('Achados sobre a fonte (markup × script):');
if (!achados.length) console.log('  nenhum na amostra');
for (const a of achados) console.log(`  ${a.id} ${a.saida} [${a.tipo}]: markup "${a.markup}" × script "${a.script}"`);

const falhou = bFalha > 0 || cFalha > 0;
console.log(`\nResultado: ${falhou ? 'FALHOU' : 'OK'} — recálculo independente ${bOk}/${bOk + bFalha}, formas.json ${cOk}/${cOk + cFalha}.`);
process.exit(falhou ? 1 : 0);
