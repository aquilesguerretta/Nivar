// Marcação P14 (oral / desenho / cronometrado / limite de extensão). Anotação da extração,
// inferida do verbo inicial e de marcadores de tempo/extensão — não é texto da fonte.
const verbos = {
  desenho: ['Desenhar'],
  producao_oral_ou_livre: ['Explicar', 'Descrever', 'Diferenciar', 'Listar', 'Narrar', 'Sustentar', 'Separar', 'Provar', 'Dizer', 'Citar', 'Contar'],
};
export function marcarP14(t) {
  const tags = [];
  const v = t.split(' ')[0];
  if (verbos.desenho.includes(v)) tags.push('desenho');
  if (verbos.producao_oral_ou_livre.includes(v)) tags.push('producao_oral_ou_livre');
  if (/cinco minutos|\d+\s*segundos|trinta segundos/i.test(t)) tags.push('cronometrado');
  if (/em (duas|três|quatro) frases|duas frases cada/i.test(t)) tags.push('limite_de_extensao');
  if (/\bI²R\b|provar/i.test(t)) tags.push('calculo_ou_derivacao');
  return tags;
}
