// Montagem da avaliação do M02/M03 (usada pelo gerador de cada módulo).
// Leitura e normalização: avaliacao-m02-m03.mjs.
//
// `editoriais`: [[de, para]] — trocas Q03 literais no texto visível que vem da fonte
//   (enunciado, referência, quiz, checklist); GridAlpha → NIVAR sempre. Contadas.
// `especificacoes`: itens derivados ({ aula, tipo, enunciado, alternativas?, correta?, evidencias, sep? }).
// `alertas`: { idDoItem: [texto] }.

import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, norm, baixa } from './avaliacao-m02-m03.mjs';

// `vinculos`: { idDoExercicio: [frases] } — exercício que a fonte não prende a aula vai para a
//   ÚLTIMA aula cujo texto contém todas as frases (vínculo mecânico, guia de porte de 15/11);
//   sem casamento, fica nos exercícios do módulo. O vínculo é registrado em `alertas`.
export function aulaPorVinculo(ctx, frases) {
  const casam = [];
  for (const a of ctx.html.map((x) => x.num)) {
    const t = baixa(ctx.blocosDaAula(a).map((b) => b.texto).join(' '));
    if (frases.every((f) => t.includes(baixa(f)))) casam.push(a);
  }
  return { aula: casam.length ? casam[casam.length - 1] : null, casam };
}

export function montarAvaliacao(ctx, { especificacoes, editoriais, alertas = {}, vinculos = {} }) {
  const { NN, EXT_REL, ARQ_HTML, aparato } = ctx;
  const MODULO_ID = `modulo-${NN}`;
  const ARQ_APARATO = `${EXT_REL}/aparato.json`;
  const problemas = [];
  const falha = (m) => problemas.push(m);
  const uso = {};
  const ed = (s) => {
    let r = String(s ?? '');
    for (const [de, para] of editoriais) if (r.includes(de)) { uso[de] = (uso[de] ?? 0) + 1; r = r.split(de).join(para); }
    r = r.replace(/GridAlpha/g, () => { uso.GridAlpha = (uso.GridAlpha ?? 0) + 1; return 'NIVAR'; });
    return r;
  };
  const colapsa = (s) => String(s).replace(/\s+/g, ' ').trim();

  // 1) Fonte: Ex·NN do § Ex (com aula → aula; sem aula → exercícios do módulo).
  const itens = [];
  const soltos = [];
  aparato.exercicios.itens.forEach((ex, i) => {
    let aula = ex.aula_vinculada ? Number(ex.aula_vinculada.replace(/\D/g, '')) : null;
    const notas = [...(alertas[ex.id] ?? [])];
    if (aula === null && vinculos[ex.id]) {
      const v = aulaPorVinculo(ctx, vinculos[ex.id]);
      if (v.aula === null) falha(`${ex.id}: nenhuma aula casa com ${JSON.stringify(vinculos[ex.id])}`);
      else {
        aula = v.aula;
        const onde = v.casam.length > 1 ? `nas Aulas ${v.casam.join(', ')}; vai para a última, a ${v.aula}` : `só na Aula ${v.aula}`;
        notas.unshift(`Vínculo mecânico: a fonte não prende este exercício a aula; ${vinculos[ex.id].map((f) => `"${f}"`).join(' e ')} aparece ${onde}.`);
      }
    }
    const linha = ex.origem?.linha_aprox ?? null;
    const campo = `exercicios.itens[${i}]`;
    const item = {
      id: ex.id,
      moduloId: MODULO_ID,
      aula,
      origem: 'fonte',
      tipo: 'aberto',
      enunciado: ed(colapsa(ex.enunciado.html)),
      gabarito: null,
      referencia: ed(ex.resposta_de_referencia.paragrafos.map((p) => colapsa(p.html)).join('<br><br>')),
      // A fonte não declara critério por exercício nem limiar no § Ex (criterio_nota da extração).
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: 'autoavaliacao',
      fonte: { arquivo: ARQ_APARATO, campo: `${campo}.enunciado.html`, linha },
      evidencias: [
        { arquivo: ARQ_APARATO, campo: `${campo}.enunciado.texto`, linha, trecho: ed(norm(ex.enunciado.html)) },
        { arquivo: ARQ_APARATO, campo: `${campo}.resposta_de_referencia.paragrafos`, linha, trecho: ed(norm(ex.resposta_de_referencia.paragrafos.map((p) => p.html).join(' '))) },
      ],
      ...(notas.length ? { alertas: notas } : {}),
    };
    (aula ? itens : soltos).push(item);
  });

  // 2) Derivados: cada trecho achado no texto da aula.
  const cont = {};
  const cache = {};
  for (const esp of especificacoes) {
    const a = esp.aula;
    cache[a] ??= ctx.blocosDaAula(a);
    const evidencias = esp.evidencias.map((t) => {
      const alvo = norm(t);
      const acha = cache[a].find((b) => b.texto === alvo) ?? cache[a].find((b) => b.texto.includes(alvo));
      if (!acha) { falha(`aula ${a}: trecho não está na aula: «${alvo.slice(0, 90)}»`); return { arquivo: ARQ_HTML, campo: '?', linha: null, trecho: alvo }; }
      return { arquivo: ARQ_HTML, campo: acha.campo, linha: acha.linha, trecho: alvo };
    });
    cont[a] = (cont[a] ?? 0) + 1;
    const id = `m${NN}-a${String(a).padStart(2, '0')}-d${String(cont[a]).padStart(2, '0')}`;
    if (esp.tipo === 'escolha') {
      if (!Array.isArray(esp.alternativas) || esp.alternativas.length < 3 || esp.alternativas.length > 4) falha(`${id}: escolha com ${esp.alternativas?.length} alternativas`);
      if (!Number.isInteger(esp.correta) || esp.correta < 0 || esp.correta >= esp.alternativas.length) falha(`${id}: índice da correta inválido`);
    }
    itens.push({
      id,
      moduloId: MODULO_ID,
      aula: a,
      origem: 'derivado-da-aula',
      tipo: esp.tipo,
      enunciado: esp.enunciado,
      ...(esp.tipo === 'escolha' ? { alternativas: esp.alternativas } : {}),
      gabarito: esp.tipo === 'escolha' ? esp.correta : null,
      referencia: evidencias.map((e) => e.trecho).join(esp.sep ?? ' '),
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: esp.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
      fonte: { arquivo: evidencias[0].arquivo, campo: evidencias[0].campo, linha: evidencias[0].linha },
      evidencias,
    });
  }
  itens.sort((x, y) => x.aula - y.aula || (x.origem === y.origem ? x.id.localeCompare(y.id) : x.origem === 'fonte' ? -1 : 1));

  // 3) A prova (§ Quiz) e as faixas do placar do script.
  const av = aparato.avaliacao;
  const criterio = ed(norm(av.introducao.texto));
  const m = criterio.match(/(\d+) de (\d+)/);
  if (!m) falha('critério da prova sem "N de M"');
  const acertosMinimos = m ? Number(m[1]) : null;
  const total = m ? Number(m[2]) : null;
  if (total !== av.questoes.length) falha(`critério diz ${total} questões; a extração tem ${av.questoes.length}`);
  const questoes = av.questoes.map((q, i) => {
    if (q.alternativas.length !== 4) falha(`${q.id}: ${q.alternativas.length} alternativas`);
    const correta = q.gabarito.indice;
    if (q.alternativas[correta]?.texto !== q.gabarito.texto) falha(`${q.id}: gabarito não bate com a alternativa`);
    return {
      id: q.id,
      enunciado: ed(norm(q.enunciado)),
      alternativas: q.alternativas.map((x) => ed(norm(x.texto))),
      correta,
      explicacao: ed(norm(q.explicacao)),
      ...(alertas[q.id] ? { alertas: alertas[q.id] } : {}),
      fonte: { arquivo: ARQ_APARATO, campo: `avaliacao.questoes[${i}]`, linha: q.origem?.linha_aprox ?? null },
    };
  });
  const minimo = (f) => (/^else/.test(f.condicao_literal) ? 0 : Number(f.condicao_literal.match(/>=\s*(\d+)/)[1]));
  const ordem = [...av.placar.faixas].sort((x, y) => minimo(y) - minimo(x));
  const faixas = ordem
    .map((f, i) => {
      const min = minimo(f);
      const max = i === 0 ? total : minimo(ordem[i - 1]) - 1;
      if (f.faixa !== `${min}–${max}`) falha(`faixa ${f.faixa}: derivada ${min}–${max}`);
      return { min, max, mensagem: ed(norm(f.mensagem)) };
    })
    .sort((x, y) => x.min - y.min);
  if (!(faixas[0]?.min === 0 && faixas.at(-1)?.max === total && faixas.every((f, i) => i === 0 || f.min === faixas[i - 1].max + 1))) falha('faixas não cobrem 0..total');
  const prova = {
    moduloId: MODULO_ID,
    criterio,
    acertosMinimos,
    total,
    questoes,
    faixas,
    faixasFonte: { arquivo: ARQ_APARATO, campo: 'avaliacao.placar.faixas', linha: av.placar.faixas[0]?.origem?.linha_aprox ?? null },
    criterioFonte: { arquivo: ARQ_APARATO, campo: 'avaliacao.introducao.texto', linha: av.introducao.origem?.linha_aprox ?? null },
  };

  // 4) Checklist do § Final.
  const ck = aparato.checklist_final;
  const checklist = {
    moduloId: MODULO_ID,
    introducao: ed(norm(ck.introducao?.texto ?? ck.introducao?.html ?? ck.introducao ?? '')),
    itens: ck.itens.map((it, i) => ({ id: it.id, texto: ed(norm(it.html ?? it.texto)), fonte: { arquivo: ARQ_APARATO, campo: `checklist_final.itens[${i}].texto`, linha: it.origem?.linha_aprox ?? null } })),
  };

  return { itens, soltos, prova, checklist, problemas, uso };
}

export function escreverDados(n, { itens, soltos, prova, checklist }, gerador) {
  const NN = String(n).padStart(2, '0');
  const saida = path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`);
  const fonte = itens.filter((x) => x.origem === 'fonte').length;
  const corpo = [
    `// GERADO por ${gerador} — não editar à mão.`,
    `// Avaliação do M${NN}: exercícios por aula, exercícios sem aula, prova e checklist.`,
    `// Fonte: docs/alexandria-v2/extraction/m${NN}/aparato.json (itens 'fonte') e o texto da própria`,
    `// aula (itens 'derivado-da-aula', com o trecho literal em \`evidencias\`).`,
    `// Relatório: docs/alexandria-v3/porte/m${NN}.md. Posse: a sessão de porte do M${NN}.`,
    `// ${itens.length} itens por aula (${fonte} da fonte, ${itens.length - fonte} derivados) · ${soltos.length} sem aula · ${prova.questoes.length} questões na prova · checklist de ${checklist.itens.length}.`,
    `import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';`,
    '',
    `export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(itens, null, 2)};`,
    '',
    `export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(soltos, null, 2)};`,
    '',
    `export const PROVAS: ProvaDoModulo[] = ${JSON.stringify([prova], null, 2)};`,
    '',
    `export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify([checklist], null, 2)};`,
    '',
  ].join('\n');
  fs.writeFileSync(saida, corpo);
  return path.relative(RAIZ, saida);
}
