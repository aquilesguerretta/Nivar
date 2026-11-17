// Confere src/lib/alexandria/avaliacao/mNN.dados.ts (M14 ou M15) do zero contra a extração
// e o texto das aulas — sem reaproveitar nada do gerador.
//
//   · cada Ex NN do §Ex aparece UMA vez, numa aula, com enunciado e gabarito iguais aos da
//     extração (só com as trocas editoriais Q03/Q02) e com o vínculo declarado em `alertas`;
//   · cada exercício que a própria aula declara (fichas) aparece, com o texto da extração;
//   · cada derivado tem toda `evidencias[].trecho` dentro do texto da SUA aula, a referência é
//     a junção literal dos trechos, e em `escolha` a alternativa correta tem as palavras de
//     conteúdo dentro da evidência; nenhuma alternativa repetida;
//   · `tolerancia` é sempre null; `escolha` ↔ 'alternativa-correta'; resto ↔ 'autoavaliacao';
//   · prova: 10 questões iguais às da extração (enunciado, alternativas, gabarito,
//     explicação), critério literal e mínimo lido dele; faixas iguais às do script;
//   · checklist: todos os itens, na ordem, iguais aos da extração.
//
// Uso: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m14-m15.mjs <14|15>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as LER from './aparato-m14-m15.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const N = Number(process.argv[2]);
const NN = String(N);
const AP = JSON.parse(fs.readFileSync(path.join(RAIZ, `docs/alexandria-v2/extraction/m${NN}/aparato.json`), 'utf8'));
const D = await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`)).href);
const C = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
const CORPO = C[`MODULO_${NN}_CORPO`];

const ed = (s) => String(s ?? '').replace(/GridAlpha/g, 'NIVAR').replace(/\bBloco (\d+)/g, 'Módulo $1');
const t = (h) => ed(h).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/[\s ]+/g, ' ').replace(/ ([,.;:)])/g, '$1').trim();
const falhas = [];
const f = (m) => falhas.push(m);

const textoDaAula = (n) => (CORPO[`aula-${NN}-${String(n).padStart(2, '0')}`] ?? [])
  .map((b) => (b.kind === 'titulo' ? b.texto : b.kind === 'formula' ? `${b.eq} ${b.desc ?? ''}` : b.kind === 'lista' ? b.itens.join(' ') : b.kind === 'tabela' ? b.linhas.flat().join(' ') : `${b.label ?? ''} ${b.html}`))
  .map(t).join(' ');

const itens = D.EXERCICIOS_DAS_AULAS;
const ids = new Set();
for (const e of itens) {
  if (ids.has(e.id)) f(`${e.id}: id repetido`);
  ids.add(e.id);
  if (e.moduloId !== `modulo-${NN}`) f(`${e.id}: moduloId ${e.moduloId}`);
  if (e.tolerancia !== null) f(`${e.id}: tolerância não nula`);
  if ((e.tipo === 'escolha') !== (e.verificacao === 'alternativa-correta')) f(`${e.id}: tipo ${e.tipo} × verificação ${e.verificacao}`);
  if (e.tipo !== 'escolha' && e.gabarito !== null) f(`${e.id}: aberto com gabarito`);
}

// Ex NN
const EXS = LER.exercicios(AP);
for (const x of EXS) {
  const achados = [...itens, ...D.EXERCICIOS_DO_MODULO].filter((e) => e.id === x.id);
  if (achados.length !== 1) { f(`${x.id}: aparece ${achados.length} vez(es)`); continue; }
  const e = achados[0];
  if (e.origem !== 'fonte') f(`${x.id}: origem ${e.origem}`);
  if (t(e.enunciado) !== t(x.enunciadoHtml)) f(`${x.id}: enunciado difere da extração`);
  if (t(e.referencia) !== t(x.respostaHtml)) f(`${x.id}: referência difere do gabarito da extração`);
  if (!e.alertas?.some((a) => a.includes('não liga este exercício a aula') && a.includes(x.tag))) f(`${x.id}: vínculo por afinidade não declarado em alertas`);
}
// exercícios declarados pela aula
const EMB = LER.embutidos(AP);
for (const x of EMB) {
  const e = itens.find((i) => i.id === x.id);
  if (!e) { f(`${x.id}: ausente`); continue; }
  if (e.aula !== x.aula) f(`${x.id}: aula ${e.aula}, fonte diz ${x.aula}`);
  if (!t(e.enunciado).includes(t(x.enunciadoTexto))) f(`${x.id}: enunciado não contém o texto do campo da ficha`);
  if (x.referenciaTexto && t(e.referencia) !== t(x.referenciaTexto)) f(`${x.id}: referência difere da instrução da fonte`);
}
// derivados
for (const e of itens.filter((i) => i.origem === 'derivado-da-aula')) {
  const texto = textoDaAula(e.aula);
  for (const ev of e.evidencias) if (!texto.includes(t(ev.trecho))) f(`${e.id}: evidência fora do texto da Aula ${e.aula}: «${t(ev.trecho).slice(0, 80)}»`);
  if (t(e.referencia) !== e.evidencias.map((v) => t(v.trecho)).join(' ')) f(`${e.id}: referência não é a junção literal das evidências`);
  if (e.tipo === 'escolha') {
    const alts = e.alternativas ?? [];
    if (new Set(alts).size !== alts.length) f(`${e.id}: alternativas repetidas`);
    if (!(e.gabarito >= 0 && e.gabarito < alts.length)) { f(`${e.id}: gabarito fora das alternativas`); continue; }
    const ev = t(e.evidencias.map((v) => v.trecho).join(' ')).toLowerCase();
    const palavras = t(alts[e.gabarito]).toLowerCase().split(/[^\p{L}\d,]+/u).filter((w) => w.length > 3);
    const fora = palavras.filter((w) => !ev.includes(w));
    if (fora.length > Math.floor(palavras.length / 4)) f(`${e.id}: alternativa correta com palavras fora da evidência: ${fora.join(', ')}`);
  }
}
const naoListado = itens.filter((e) => e.origem === 'fonte' && !EXS.some((x) => x.id === e.id) && !EMB.some((x) => x.id === e.id));
for (const e of naoListado) f(`${e.id}: origem 'fonte' sem correspondente na extração`);

// prova
const P = D.PROVAS[0];
const QS = LER.perguntas(AP);
if (!P) f('prova ausente');
else {
  if (t(P.criterio) !== t(LER.criterio(AP).texto)) f('critério da prova difere do literal');
  if (P.total !== QS.length) f(`total ${P.total} × ${QS.length} questões`);
  QS.forEach((q, k) => {
    const p = P.questoes[k];
    if (!p || p.id !== q.id) { f(`questão ${k + 1}: id`); return; }
    if (t(p.enunciado) !== t(q.enunciado)) f(`${q.id}: enunciado`);
    if (p.alternativas.length !== q.alternativas.length || p.alternativas.some((a, i) => t(a) !== t(q.alternativas[i]))) f(`${q.id}: alternativas`);
    if (p.correta !== q.correta) f(`${q.id}: gabarito`);
    if (t(p.explicacao) !== t(q.explicacaoHtml ?? q.explicacao)) f(`${q.id}: explicação`);
  });
  const fx = LER.faixas(AP);
  if (P.faixas.length !== fx.length || P.faixas.some((x, i) => t(x.mensagem) !== t(fx[i].mensagem))) f('faixas do placar diferem do script');
}
// checklist
const CK = D.CHECKLISTS[0];
const ck = AP.checklist_final.itens;
if (!CK || CK.itens.length !== ck.length) f(`checklist: ${CK?.itens.length} × ${ck.length} itens`);
else ck.forEach((x, k) => { if (t(CK.itens[k].texto) !== t(x.html)) f(`checklist ${x.id}: texto`); });

const porOrigem = (o) => itens.filter((e) => e.origem === o).length;
console.log(`M${NN}: ${itens.length} itens por aula (${porOrigem('fonte')} fonte · ${porOrigem('derivado-da-aula')} derivados) · prova ${P?.questoes.length ?? 0} · checklist ${CK?.itens.length ?? 0}`);
for (const m of falhas) console.log(`   ✗ ${m}`);
console.log(falhas.length ? `RESULTADO: ${falhas.length} falha(s)` : 'RESULTADO: 0 falhas');
process.exit(falhas.length ? 1 : 0);
