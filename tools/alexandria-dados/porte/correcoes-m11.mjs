// correcoes-m11.mjs — defeitos do script do M11 corrigidos no porte (Q07: "defeito de script
// não é conteúdo"; Q13: dano tipográfico de transporte). Cada correção é uma troca literal
// no corpo copiado da IIFE, que precisa casar EXATAMENTE uma vez. Lido pelo gerador
// (gerar-instrumentos-m11.mjs), que aplica a troca, e pelo conferidor
// (verificar-instrumentos-m11.mjs), que aplica o mesmo efeito à saída do original antes de
// comparar. As outras sete divergências da extração (m11/instrumentos.json) não mudam
// nenhuma saída e ficam registradas em docs/alexandria-v3/porte/m11.md.

export const CORRECOES = [
  {
    inst: '02',
    div: 'div-m11-inst-01-acentos',
    regra: 'Q13',
    de: 'Autoproducao por equiparacao e outro regime juridico',
    para: 'Autoprodução por equiparação é outro regime jurídico',
    motivo: 'a afirmação a12 perdeu os acentos no script; o resto do arquivo escreve a frase acentuada',
  },
  {
    inst: '04',
    div: 'div-m11-inst-02-limiar-1000',
    regra: 'Q07',
    de: 'if(pot>1000)t.push(',
    para: 'if(pot>=1000)t.push(',
    motivo: 'com 1.000 kW exatos o script mostrava o ramo "abaixo de 1.000 kW" (2,5%), contra o texto do próprio ramo ("1.000 kW ou mais", 5%) e a prosa da Aula 06',
  },
];

/** Aplica as correções de um instrumento ao corpo copiado; para se alguma não casar uma vez. */
export function corrigir(n, corpo) {
  let out = corpo;
  for (const c of CORRECOES.filter((x) => x.inst === n)) {
    const k = out.split(c.de).length - 1;
    if (k !== 1) throw new Error(`correção ${c.div}: casou ${k} vezes no corpo do INST·${n}`);
    out = out.replace(c.de, c.para);
  }
  return out;
}
