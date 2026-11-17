// Leitura do aparato (extraction/mNN/aparato.json) do M14 e do M15 numa forma só.
//
// As duas extrações gravam a mesma coisa com formas diferentes (M14: `exercicios.exercicios`,
// enunciado em texto, `resposta_referencia_html`; M15: `exercicios.itens`, enunciado e resposta
// como { html, texto }, fichas de elo com campo a preencher; critério do quiz como objeto ou
// como texto; faixas com `minimo/maximo` ou com `intervalo`). Este módulo só lê — nenhum texto
// é alterado. O gerador e o verificador da avaliação usam esta leitura; as comparações de cada
// um continuam independentes.

const html = (v) => (typeof v === 'string' ? v : v?.html ?? null);
const texto = (v) => (typeof v === 'string' ? v : v?.texto ?? null);

/** Ex NN do §Ex: { id, tag, enunciadoHtml, enunciadoTexto, respostaHtml, respostaTexto, linha, campo }. */
export function exercicios(AP) {
  const lista = AP.exercicios.exercicios ?? AP.exercicios.itens ?? [];
  const chave = AP.exercicios.exercicios ? 'exercicios.exercicios' : 'exercicios.itens';
  return lista.map((e, k) => ({
    id: e.id,
    // M14: "Ex 01 · Base temporal"; M15: tag "01" + família
    tag: /^Ex /.test(e.tag) ? e.tag : `Ex ${e.tag} · ${String(e.familia ?? '').replace(/^Família \d+ · /, '')}`,
    enunciadoHtml: html(e.enunciado),
    enunciadoTexto: texto(e.enunciado) ?? e.enunciado,
    respostaHtml: e.resposta_referencia_html ?? html(e.resposta_referencia),
    respostaTexto: e.resposta_referencia_texto ?? texto(e.resposta_referencia),
    linha: e.origem?.linha_aprox ?? null,
    campo: `${chave}[${k}]`,
  }));
}

/** Exercícios que a própria aula declara (M14: fichas de rota; M15: fichas de elo). */
export function embutidos(AP) {
  const m14 = AP.exercicios.exercicios_embutidos_em_aula;
  if (m14) {
    return m14.itens.map((e, k) => ({
      id: e.id,
      aula: Number(String(e.aula_fonte).match(/\d+/)[0]),
      titulo: `${e.ficha_rotulo} · ${e.ficha}`,
      campo: e.campo,
      enunciadoHtml: e.html,
      enunciadoTexto: e.texto,
      // a fonte manda conferir contra o verificador: a referência é essa instrução, literal
      referenciaTexto: m14.instrucao_da_fonte.texto,
      referenciaFonte: { campo: 'exercicios.exercicios_embutidos_em_aula.instrucao_da_fonte.texto', linha: m14.instrucao_da_fonte.origem?.linha_aprox ?? null },
      origem: { campo: `exercicios.exercicios_embutidos_em_aula.itens[${k}]`, linha: e.origem?.linha_aprox ?? null },
    }));
  }
  return (AP.exercicios.fichas_de_elo_em_aula ?? []).map((f, k) => ({
    id: f.id,
    aula: Number(String(f.aula).match(/\d+/)[0]),
    titulo: `${f.cabecalho.elo} · ${f.cabecalho.qualificador}`,
    campo: f.campo_a_preencher.chave,
    enunciadoHtml: html(f.campo_a_preencher.enunciado),
    enunciadoTexto: texto(f.campo_a_preencher.enunciado),
    // a fonte não traz gabarito para o campo "Preencha" (resposta_referencia: null)
    referenciaTexto: null,
    referenciaFonte: null,
    origem: { campo: `exercicios.fichas_de_elo_em_aula[${k}].campo_a_preencher`, linha: f.origem?.linha_aprox ?? null },
  }));
}

export const perguntas = (AP) => AP.avaliacao.perguntas.map((q) => ({
  id: q.id,
  enunciado: q.enunciado,
  alternativas: q.alternativas.map((a) => a.texto),
  correta: q.gabarito.indice,
  explicacao: q.explicacao_texto ?? q.explicacao?.texto ?? q.explicacao ?? null,
  explicacaoHtml: q.explicacao_html ?? q.explicacao?.html ?? null,
  linha: q.origem?.linha_aprox ?? null,
}));

export const criterio = (AP) => {
  const c = AP.avaliacao.criterio_literal_prosa;
  return { texto: typeof c === 'string' ? c : c.texto, linha: c?.origem?.linha_aprox ?? AP.avaliacao.origem?.linha_aprox ?? null };
};

export function faixas(AP) {
  const f = AP.avaliacao.faixas_de_placar_script;
  const lista = Array.isArray(f) ? f : f.faixas;
  return lista.map((x) => {
    const iv = /(\d+)\D+(\d+)/.exec(x.intervalo ?? '');
    return {
      min: x.minimo ?? (iv ? Number(iv[1]) : 0),
      max: x.maximo ?? (iv ? Number(iv[2]) : null),
      mensagem: x.mensagem_texto ?? x.mensagem ?? x.mensagem_html,
    };
  });
}
