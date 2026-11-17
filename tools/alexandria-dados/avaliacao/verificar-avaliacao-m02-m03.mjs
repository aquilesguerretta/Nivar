// Verificador da avaliação do M02/M03 (src/lib/alexandria/avaliacao/m0N.dados.ts).
// Reconfere do zero, a partir da extração (aparato.json) e do texto da aula no produto:
//   (A) itens 'fonte': os Ex·NN são os da extração (com as trocas Q03 declaradas), na aula
//       que a tag declara; os sem aula ficam nos exercícios do módulo; nenhum falta.
//   (B) derivados: todo trecho de `evidencias` está, literal, no texto da aula; a referência é
//       a junção dos trechos; em `escolha`, a alternativa correta está no trecho e TODA
//       alternativa aparece nas aulas do módulo.
//   (C) prova 10 × 4 igual à extração (enunciado, alternativas, correta), critério N de M,
//       faixas cobrindo 0..total; checklist igual à extração.
//   (D) nenhum derivado usa, no enunciado ou nas alternativas, número do cenário-padrão do
//       instrumento da mesma aula; nenhum entrega a resposta de outro item da aula.
//   (E) nada de vocabulário interno (Q03), nenhuma tolerância, nenhum "Demonstrado";
//       ≥ 2 itens por aula.

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { RAIZ, contexto, norm, baixa, VOCABULARIO_INTERNO } from './avaliacao-m02-m03.mjs';
import { aulaPorVinculo } from './montar-avaliacao-m02-m03.mjs';

export async function verificar(n, { editoriais, vinculos = {} }) {
  const ctx = await contexto(n);
  const { NN, aparato, INST, AULAS } = ctx;
  const dados = await import(pathToFileURL(path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`)).href);
  const falhas = [];
  const F = (m) => falhas.push(m);
  const ed = (s) => {
    let r = String(s ?? '');
    for (const [de, para] of editoriais) r = r.split(de).join(para);
    return r.replace(/GridAlpha/g, 'NIVAR');
  };
  const itens = dados.EXERCICIOS_DAS_AULAS;
  const soltos = dados.EXERCICIOS_DO_MODULO;
  const [prova] = dados.PROVAS;
  const [checklist] = dados.CHECKLISTS;

  // (A) fonte
  for (const ex of aparato.exercicios.itens) {
    let aula = ex.aula_vinculada ? Number(ex.aula_vinculada.replace(/\D/g, '')) : null;
    if (aula === null && vinculos[ex.id]) aula = aulaPorVinculo(ctx, vinculos[ex.id]).aula;
    const it = [...itens, ...soltos].find((x) => x.id === ex.id);
    if (!it) { F(`(A) ${ex.id} não está nos dados`); continue; }
    if (it.aula !== aula) F(`(A) ${ex.id}: aula ${it.aula}, a tag diz ${aula}`);
    if (aula === null && !soltos.includes(it)) F(`(A) ${ex.id} sem aula fora dos exercícios do módulo`);
    if (it.origem !== 'fonte') F(`(A) ${ex.id}: origem ${it.origem}`);
    if (norm(it.enunciado) !== norm(ed(ex.enunciado.html))) F(`(A) ${ex.id}: enunciado difere da extração`);
    if (norm(it.referencia) !== norm(ed(ex.resposta_de_referencia.paragrafos.map((p) => p.html).join(' ')))) F(`(A) ${ex.id}: referência difere da extração`);
    const [evE, evR] = it.evidencias ?? [];
    if (norm(evE?.trecho) !== norm(ed(ex.enunciado.html)) || norm(evR?.trecho) !== norm(ed(ex.resposta_de_referencia.paragrafos.map((p) => p.html).join(' ')))) F(`(A) ${ex.id}: evidências diferem da extração`);
  }
  const daFonte = [...itens, ...soltos].filter((x) => x.origem === 'fonte').length;
  if (daFonte !== aparato.exercicios.itens.length) F(`(A) ${daFonte} itens da fonte nos dados; a extração tem ${aparato.exercicios.itens.length}`);

  // (B) derivados
  const textoAula = {};
  for (const it of itens.filter((x) => x.origem === 'derivado-da-aula')) {
    textoAula[it.aula] ??= ctx.blocosDaAula(it.aula).map((b) => b.texto).join(' ¶ ');
    for (const e of it.evidencias) if (!textoAula[it.aula].includes(norm(e.trecho))) F(`(B) ${it.id}: trecho fora da aula: «${norm(e.trecho).slice(0, 70)}»`);
    if (norm(it.referencia) !== norm(it.evidencias.map((e) => e.trecho).join(' '))) F(`(B) ${it.id}: referência não é a junção dos trechos`);
    if (it.tipo === 'escolha') {
      const alts = it.alternativas ?? [];
      if (alts.length < 3 || alts.length > 4) F(`(B) ${it.id}: ${alts.length} alternativas`);
      if (new Set(alts.map(baixa)).size !== alts.length) F(`(B) ${it.id}: alternativas repetidas`);
      const certa = alts[it.gabarito];
      if (certa === undefined) F(`(B) ${it.id}: gabarito fora das alternativas`);
      else if (!baixa(it.evidencias.map((e) => e.trecho).join(' ')).includes(baixa(certa))) F(`(B) ${it.id}: a correta («${certa}») não está no trecho`);
      for (const a of alts) if (!ctx.textoDoModulo.includes(baixa(a))) F(`(B) ${it.id}: alternativa fora das aulas do módulo: «${a}»`);
      if (it.verificacao !== 'alternativa-correta') F(`(B) ${it.id}: verificação ${it.verificacao}`);
    } else if (it.verificacao !== 'autoavaliacao' || it.gabarito !== null) F(`(B) ${it.id}: aberto sem autoavaliação`);
  }

  // (C) prova e checklist
  const av = aparato.avaliacao;
  if (!prova) F('(C) sem prova');
  else {
    if (prova.questoes.length !== 10 || av.questoes.length !== 10) F(`(C) prova com ${prova.questoes.length} questões`);
    prova.questoes.forEach((q, i) => {
      const s = av.questoes[i];
      if (q.id !== s.id) F(`(C) questão ${i}: id ${q.id} ≠ ${s.id}`);
      if (q.alternativas.length !== 4) F(`(C) ${q.id}: ${q.alternativas.length} alternativas`);
      if (q.correta !== s.gabarito.indice || s.alternativas[q.correta]?.texto !== s.gabarito.texto || s.alternativas[q.correta]?.correta === false) F(`(C) ${q.id}: correta ${q.correta} ≠ fonte`);
      if (norm(q.enunciado) !== norm(ed(s.enunciado))) F(`(C) ${q.id}: enunciado difere`);
      q.alternativas.forEach((a, k) => { if (norm(a) !== norm(ed(s.alternativas[k].texto))) F(`(C) ${q.id}: alternativa ${k} difere`); });
      if (norm(q.explicacao) !== norm(ed(s.explicacao))) F(`(C) ${q.id}: explicação difere`);
    });
    const m = prova.criterio.match(/(\d+) de (\d+)/);
    if (!m || Number(m[1]) !== prova.acertosMinimos || Number(m[2]) !== prova.total) F('(C) critério N de M não bate');
    if (norm(prova.criterio) !== norm(ed(av.introducao.texto))) F('(C) critério difere da extração');
    const fx = prova.faixas;
    if (!(fx[0]?.min === 0 && fx.at(-1)?.max === prova.total && fx.every((f, i) => i === 0 || f.min === fx[i - 1].max + 1))) F('(C) faixas não cobrem 0..total');
    for (const f of fx) if (!av.placar.faixas.some((s) => norm(ed(s.mensagem)) === norm(f.mensagem) && s.faixa === `${f.min}–${f.max}`)) F(`(C) faixa ${f.min}–${f.max} não é da fonte`);
  }
  const ck = aparato.checklist_final;
  if (!checklist || checklist.itens.length !== ck.itens.length) F(`(C) checklist com ${checklist?.itens.length} itens; a fonte tem ${ck.itens.length}`);
  else checklist.itens.forEach((it, i) => { if (norm(it.texto) !== norm(ed(ck.itens[i].html ?? ck.itens[i].texto))) F(`(C) checklist ${it.id} difere`); });

  // (D) cenário de instrumento e entrega cruzada
  for (const it of itens.filter((x) => x.origem === 'derivado-da-aula')) {
    const aula = AULAS.find((a) => a.id === `aula-${NN}-${String(it.aula).padStart(2, '0')}`);
    const nums = (aula?.instruments ?? []).flatMap((i) => (INST.find((x) => x.id === i.id)?.fields ?? []).map((f) => f.defaultValue))
      .map((v) => String(v)).filter((v) => /\d{2,}/.test(v));
    const visivel = `${it.enunciado} ${(it.alternativas ?? []).join(' ')}`;
    for (const v of nums) if (new RegExp(`(^|[^\\d.,])${v.replace('.', '[.,]')}([^\\d]|$)`).test(visivel)) F(`(D) ${it.id}: usa ${v}, valor do cenário-padrão do instrumento da aula`);
    for (const o of itens.filter((x) => x.aula === it.aula && x.id !== it.id && x.tipo === 'escolha')) {
      const certa = o.alternativas[o.gabarito];
      if (certa.length > 4 && baixa(it.enunciado).includes(baixa(certa))) F(`(D) ${it.id}: o enunciado entrega a resposta de ${o.id} («${certa}»)`);
    }
  }

  // (E) vocabulário, tolerância, contagem
  const visiveis = [
    ...[...itens, ...soltos].flatMap((x) => [x.enunciado, x.referencia, ...(x.alternativas ?? [])]),
    ...(prova ? [prova.criterio, ...prova.questoes.flatMap((q) => [q.enunciado, q.explicacao, ...q.alternativas]), ...prova.faixas.map((f) => f.mensagem)] : []),
    ...(checklist ? [checklist.introducao, ...checklist.itens.map((i) => i.texto)] : []),
  ];
  for (const s of visiveis) {
    if (VOCABULARIO_INTERNO.test(s)) F(`(E) vocabulário interno: «${norm(s).match(new RegExp(`.{0,40}(${VOCABULARIO_INTERNO.source}).{0,20}`))?.[0]}»`);
    if (/Demonstrado/.test(s)) F('(E) "Demonstrado" no texto');
  }
  for (const x of [...itens, ...soltos]) if (x.tolerancia !== null) F(`(E) ${x.id}: tolerância declarada`);
  const nAulas = ctx.html.length;
  for (let a = 1; a <= nAulas; a++) { const k = itens.filter((x) => x.aula === a).length; if (k < 2) F(`(E) aula ${a}: ${k} item(ns)`); }

  console.log(`M${NN}: ${itens.length} itens por aula (${itens.filter((x) => x.origem === 'fonte').length} da fonte, ${itens.filter((x) => x.origem !== 'fonte').length} derivados) · ${soltos.length} sem aula · prova ${prova?.questoes.length ?? 0} · checklist ${checklist?.itens.length ?? 0}`);
  for (const f of falhas) console.log('  ✗ ' + f);
  console.log(falhas.length ? `RESULTADO: ${falhas.length} falha(s)` : 'RESULTADO: 0 falhas');
  return falhas.length ? 1 : 0;
}
