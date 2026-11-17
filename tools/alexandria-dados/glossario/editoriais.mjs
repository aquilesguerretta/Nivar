// Trocas editoriais no glossário — a única exceção ao literal.
//
// Q03 (DECISOES-2026-11-15.md), estendida ao glossário pela coordenação em
// 15/11/2026: a marca e o vocabulário interno saem do texto visível. A troca de
// marca é a mesma do porte do M01 (P24: GridAlpha → NIVAR,
// tools/alexandria-dados/verificar-porte-m01.mjs). O gerador aplica; o
// verificador aplica do lado da extração antes de comparar, e lista cada uso.
//
// VIGIADOS são os nomes de vocabulário interno que a Q03 lista sem uma troca
// decidida. Se algum aparecer, o gerador para: a troca precisa de decisão,
// não de plausibilidade. Em 15/11/2026 nenhum aparece nos 2.124 verbetes.

export const EDITORIAIS = [{ de: /GridAlpha/g, para: 'NIVAR', regra: 'Q03 · P24 (empresa = NIVAR)' }];

export const VIGIADOS = [/War Room/i, /Cobaia Zero/i, /\bSummit\b/i];

/** Aplica as trocas a um texto; devolve o texto e a lista de trocas feitas. */
export function aplicarEditoriais(texto) {
  const feitas = [];
  let saida = texto;
  for (const e of EDITORIAIS) {
    saida = saida.replace(e.de, (achado) => {
      feitas.push({ de: achado, para: e.para, regra: e.regra });
      return e.para;
    });
  }
  return { texto: saida, feitas };
}

export function vigiadosEm(texto) {
  return VIGIADOS.filter((re) => re.test(texto)).map((re) => re.source);
}
