// Confere src/lib/alexandria/avaliacao/mNN.dados.ts (M06, M07, M08) do zero — modelo:
// tools/alexandria-dados/verificar-avaliacao.mjs (M01). Chamado por verificar-avaliacao-mNN.mjs.
//
//   (A) todo trecho citado existe por substring no lugar indicado, com a linha certa
//       (derivado: texto da aula na fonte E no produto; fonte: o campo do aparato.json);
//   (B) itens da fonte, prova (enunciado, alternativas, correta, explicação, critério, faixas) e
//       checklist são iguais à extração, depois das trocas editoriais;
//   (C) a resposta de todo derivado está no texto da própria aula; todo distrator aparece nas aulas
//       do módulo;
//   (D) nenhum item entrega a resposta de outro da mesma aula; nenhum derivado usa número do cenário
//       padrão de instrumento da aula;
//   (F) ≥ 2 itens por aula (toda aula com exercício; regra de 15/11); prova N × 4 com critério "N de M"; faixas cobrindo 0..total sem buraco;
//       `tolerancia` null; nenhuma ocorrência de "Demonstrado"; todo Ex·NN com o alerta de vínculo.

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { registerHooks } from 'node:module';
import { RAIZ, textoDasAulas, lerAparato, norm } from './avaliacao-m06-m08.mjs';
import { editorial } from '../porte/corpo-m06-m08.mjs';

registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) {
      if (spec.startsWith('@/')) return next(pathToFileURL(path.join(RAIZ, 'src', spec.slice(2) + '.ts')).href, ctx);
      if (/^\.\.?\//.test(spec) && !/\.\w+$/.test(spec)) return next(spec + '.ts', ctx);
      throw e;
    }
  },
});

export async function verificarAvaliacao(n, { minimoPorAula = 2, extras = () => [] } = {}) {
  const NN = String(n).padStart(2, '0');
  const dados = await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`)).href);
  const conteudo = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`)).href);
  const CORPO = conteudo[`MODULO_${NN}_CORPO`];
  const AULAS = conteudo[`MODULO_${NN}_AULAS`];
  const aulas = textoDasAulas(n);
  const ap = lerAparato(n);
  const ed = (s) => editorial(norm(s), {});
  const falhas = [];
  const F = (k, msg) => falhas.push(`(${k}) ${msg}`);
  const low = (s) => norm(s).toLowerCase();

  const textoAula = (a) => { const x = aulas.find((y) => y.num === a); return x ? x.lead + ' ' + x.blocos.map((b) => b.texto).join(' ') : ''; };
  const textoProduto = (a) => (CORPO[`aula-${NN}-${String(a).padStart(2, '0')}`] ?? []).map((b) => norm(b.html ?? b.texto ?? b.eq ?? '') + ' ' + norm(b.label ?? '') + ' ' + (b.itens ?? []).map(norm).join(' ') + ' ' + (b.linhas ?? []).map((l) => l.map(norm).join(' — ')).join(' ')).join(' ');
  const textoModulo = low(aulas.map((a) => textoAula(a.num)).join(' '));

  const itens = dados.EXERCICIOS_DAS_AULAS;
  const soltos = dados.EXERCICIOS_DO_MODULO;
  const fonteEx = ap.exercicios?.itens ?? [];

  for (const it of [...itens, ...soltos]) {
    if (it.tolerancia !== null) F('F', `${it.id}: tolerância não nula`);
    if (it.moduloId !== `modulo-${NN}`) F('F', `${it.id}: moduloId ${it.moduloId}`);
    if (it.origem === 'fonte') {
      const e = fonteEx.find((x) => x.id === it.id);
      if (!e) { F('B', `${it.id}: não existe na extração`); continue; }
      // Todas as strings do item na extração, com a troca editorial: enunciado, referência e cada
      // evidência têm de ser IGUAIS a uma delas (não só parecidas).
      const strings = [];
      const coleta = (v) => { if (typeof v === 'string') strings.push(ed(v)); else if (v && typeof v === 'object') Object.values(v).forEach(coleta); };
      coleta(e);
      const tem = (s) => strings.includes(norm(s));
      if (!tem(it.enunciado)) F('B', `${it.id}: enunciado difere da extração`);
      // M07: a resposta de referência vem em parágrafos (`resposta_de_referencia[]`), unidos por <br><br>.
      const emParagrafos = Array.isArray(e.resposta_de_referencia) ? ed(e.resposta_de_referencia.map((x) => x.html).join(' ')) : null;
      if (!tem(it.referencia) && norm(it.referencia) !== emParagrafos) F('B', `${it.id}: referência difere da extração`);
      for (const ev of it.evidencias) if (!tem(ev.trecho)) F('A', `${it.id}: evidência não confere com ${ev.campo}`);
      if (!(it.alertas ?? []).some((a) => /Vínculo mecânico à Aula|Exercício do módulo/.test(a)) && !e.aula_vinculada) F('F', `${it.id}: sem alerta de vínculo (regra de 15/11)`);
      if ((it.aula === null) !== soltos.includes(it)) F('F', `${it.id}: aula ${it.aula} fora do lugar`);
    } else {
      for (const ev of it.evidencias) {
        const a = aulas.find((x) => x.num === it.aula);
        const b = a?.blocos.find((x) => x.texto.includes(norm(ev.trecho)));
        if (!b) F('A', `${it.id}: trecho não está no texto da aula ${it.aula} na fonte: «${ev.trecho.slice(0, 70)}»`);
        else if (b.linha !== ev.linha) F('A', `${it.id}: linha ${ev.linha} ≠ ${b.linha}`);
        if (!textoProduto(it.aula).includes(norm(ev.trecho))) F('A', `${it.id}: trecho não está no texto da aula ${it.aula} no PRODUTO`);
      }
      if (norm(it.referencia) !== it.evidencias.map((e) => norm(e.trecho)).join(' ')) F('C', `${it.id}: referência não é o trecho literal`);
      if (it.tipo === 'escolha') {
        if (typeof it.gabarito !== 'number' || !it.alternativas?.[it.gabarito]) F('C', `${it.id}: gabarito inválido`);
        else {
          const certa = low(it.alternativas[it.gabarito]);
          if (!low(textoAula(it.aula)).includes(certa)) F('C', `${it.id}: resposta "${certa}" não está no texto da aula`);
          if (!it.evidencias.some((e) => low(e.trecho).includes(certa))) F('C', `${it.id}: resposta não está no trecho citado`);
        }
        for (const alt of it.alternativas ?? []) if (!textoModulo.includes(low(alt))) F('C', `${it.id}: distrator fora do texto do módulo: «${alt}»`);
      } else if (it.gabarito !== null) F('C', `${it.id}: aberto com gabarito`);
    }
  }

  // (D) uma resposta não aparece em outro item da mesma aula; nenhum número do cenário padrão
  for (const a of new Set(itens.map((x) => x.aula))) {
    const ultima = Math.max(...aulas.map((y) => y.num));
    const daAula = [...itens.filter((x) => x.aula === a), ...(a === ultima ? soltos : [])];
    for (const x of daAula.filter((y) => y.origem === 'derivado-da-aula' && y.tipo === 'escolha')) {
      const certa = low(x.alternativas[x.gabarito]);
      // Só respostas de duas palavras ou mais: palavra solta ("quatro", "2004") casa por acaso
      // ("Desmonte em quatro pontos"). As de uma palavra foram conferidas à mão no relatório.
      if (certa.split(' ').length < 2) continue;
      for (const y of daAula) if (y !== x && low(y.enunciado).includes(certa)) F('D', `${x.id}: a resposta aparece no enunciado de ${y.id}`);
    }
    const aulaTs = AULAS.find((y) => y.id === `aula-${NN}-${String(a).padStart(2, '0')}`);
    const padroes = new Set((aulaTs?.instruments ?? []).flatMap((i) => i.fields.map((f) => f.defaultValue)).filter((v) => typeof v === 'number' && v > 1).map(String));
    for (const x of daAula.filter((y) => y.origem === 'derivado-da-aula')) {
      const nums = (`${x.enunciado} ${(x.alternativas ?? []).join(' ')}`.match(/\d+(?:[.,]\d+)?/g) ?? []).map((s) => s.replace(/\./g, '').replace(',', '.'));
      for (const v of nums) if (padroes.has(v)) F('D', `${x.id}: usa ${v}, valor do cenário padrão de instrumento da Aula ${a}`);
    }
    if (itens.filter((x) => x.aula === a).length < minimoPorAula) F('F', `Aula ${a}: ${daAula.length} itens (< ${minimoPorAula})`);
  }
  for (const a of aulas) if (!itens.some((x) => x.aula === a.num)) F('F', `Aula ${a.num} sem item`);
  const idsFonte = new Set(itens.filter((x) => x.origem === 'fonte').map((x) => x.id));
  for (const e of fonteEx) if (!idsFonte.has(e.id) && !soltos.some((x) => x.id === e.id)) F('B', `${e.id} da fonte não entrou`);

  // Prova
  const [prova] = dados.PROVAS;
  if (!prova) F('F', 'sem prova');
  else {
    const [mn, tot] = prova.criterio.match(/(\d+) de (\d+)|(\d+)\/(\d+)/)?.slice(1).filter(Boolean).map(Number) ?? [];
    if (mn !== prova.acertosMinimos || tot !== prova.total) F('F', `critério "${prova.criterio}" × ${prova.acertosMinimos}/${prova.total}`);
    if (prova.questoes.length !== prova.total) F('F', `${prova.questoes.length} questões × total ${prova.total}`);
    for (const q of prova.questoes) {
      if (q.alternativas.length !== 4) F('F', `${q.id}: ${q.alternativas.length} alternativas`);
      if (!(q.correta >= 0 && q.correta < q.alternativas.length)) F('F', `${q.id}: correta fora`);
    }
    const cobre = new Set();
    for (const f of prova.faixas) for (let k = f.min; k <= f.max; k++) { if (cobre.has(k)) F('F', `faixa sobreposta em ${k}`); cobre.add(k); }
    for (let k = 0; k <= prova.total; k++) if (!cobre.has(k)) F('F', `faixas não cobrem ${k}`);
    for (const f of extras({ prova, ap, ed, norm })) F('B', f);
  }
  const tudo = JSON.stringify(dados);
  if (/Demonstrad/.test(tudo)) F('F', '"Demonstrado" no dado');
  if (/GridAlpha/.test(tudo)) F('B', '"GridAlpha" no texto visível');

  console.log(`M${NN} · avaliação: ${soltos.length} do módulo · ${itens.length} itens por aula (${itens.filter((x) => x.origem === 'fonte').length} fonte · ${itens.filter((x) => x.origem !== 'fonte').length} derivados) · prova ${prova?.questoes.length ?? 0} · checklist ${dados.CHECKLISTS[0]?.itens.length ?? 0}`);
  for (const f of falhas) console.log('   ✗ ' + f);
  console.log(falhas.length ? `   RESULTADO: ${falhas.length} falha(s)` : '   RESULTADO: 0 falhas');
  return falhas.length ? 1 : 0;
}
