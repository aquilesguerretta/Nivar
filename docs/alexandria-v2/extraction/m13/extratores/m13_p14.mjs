// Anotação P14 — INFERIDA do texto do item (não é texto da fonte).
export function marcacaoP14(t) {
  const m = [];
  if (/\buma hora\b|\bminutos\b|cronometr|em menos de|\d+\s?min\b|segundos/i.test(t)) m.push('cronometrado');
  if (/voz alta|gravar|ouvir de volta|Recuso a pergunta|devolvendo estrutura/i.test(t) || /(^|\. )(Digo|Explico)\b/.test(t)) m.push('oral');
  if (/\bProduz|\bproduz|\bEscrev|\bFormul|nove itens|três teses/.test(t)) m.push('producao_livre');
  if (/(^|\. )(Reconstruo|Converto|Calculo|Modelo)\b/.test(t)) m.push('calculo');
  return m;
}
export const NOTA_P14 = 'marcacao_p14 é anotação desta extração, inferida por palavra-chave do próprio item (cronometrado: "uma hora", "minutos", "cronometr…", "em menos de"; oral: "voz alta", "gravar", item iniciado por "Digo"/"Explico", "Recuso a pergunta"; producao_livre: "Produz…", "Escrev…", "nove itens", "três teses"; calculo: item iniciado por "Reconstruo"/"Converto"/"Calculo"/"Modelo"). Não é texto da fonte e precisa de revisão humana. "automatizavel" marca só o quiz.';
