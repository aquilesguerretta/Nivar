// Reescreve MODULO_NN_LEAD e MODULO_NN_CORPO no arquivo de conteúdo do módulo, a partir
// do HTML original (fonte-html-m04-m05.mjs). Chamado por gerar-corpo-m04.mjs e -m05.mjs.
//
// Delimitação: o trecho reescrito vai do comentário que precede `export const MODULO_NN_LEAD`
// até o `};` que fecha `MODULO_NN_CORPO`. Os dois objetos são vizinhos no arquivo; se não
// forem, o gerador para em vez de adivinhar.
import fs from 'node:fs';
import path from 'node:path';
import { apostilaDoModulo, RAIZ } from './fonte-html-m04-m05.mjs';

const js = (s) => JSON.stringify(s);
function bloco(b) {
  switch (b.kind) {
    case 'titulo': return `{ kind: 'titulo', numero: ${js(b.numero)}, texto: ${js(b.texto)} }`;
    case 'paragrafo': return `{ kind: 'paragrafo', html: ${js(b.html)} }`;
    case 'nota': return `{ kind: 'nota', tom: ${js(b.tom)}, label: ${js(b.label)}, html: ${js(b.html)} }`;
    case 'tabela': return `{ kind: 'tabela', linhas: ${js(b.linhas)} }`;
    case 'lista': return `{ kind: 'lista', itens: ${js(b.itens)} }`;
    case 'formula': return `{ kind: 'formula', eq: ${js(b.eq)}, desc: ${js(b.desc)} }`;
    default: throw new Error(b.kind);
  }
}

export const MARCA_INICIO = (NN) => `// ── INÍCIO DO TRECHO GERADO (gerar-corpo-m${NN}.mjs) ──`;
export const MARCA_FIM = (NN) => `// ── FIM DO TRECHO GERADO (gerar-corpo-m${NN}.mjs) ──`;

export function gerarCorpo(n, seco = false) {
  const NN = String(n).padStart(2, '0');
  const arq = path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`);
  const { aulas, uso } = apostilaDoModulo(n);
  const id = (a) => `aula-${NN}-${String(a.numero).padStart(2, '0')}`;
  const total = aulas.reduce((s, a) => s + a.blocos.length, 0);
  const novo = `${MARCA_INICIO(NN)}
// GERADO a partir do HTML original: o corpo das aulas não está na extração verificada
// (ver tools/alexandria-dados/porte/fonte-html-m04-m05.mjs). Não editar à mão: corrija o
// gerador e rode de novo. Trocas editoriais aplicadas: ${JSON.stringify(uso)}.

/** Lead de cada aula — o \`p.lede\` logo abaixo do título, com o HTML inline da fonte. */
export const MODULO_${NN}_LEAD: Record<string, string> = {
${aulas.map((a) => `  '${id(a)}': ${js(a.lead)},`).join('\n')}
};

/** Corpo de apostila — ${total} blocos nas ${aulas.length} aulas, na ordem da fonte.
 *  O explicador em três níveis (\`div.lv\`) vira três notas, uma por aba, como no M01. */
export const MODULO_${NN}_CORPO: Record<string, AulaBloco[]> = {
${aulas.map((a) => `  '${id(a)}': [\n${a.blocos.map((b) => `    ${bloco(b)},`).join('\n')}\n  ],`).join('\n')}
};
${MARCA_FIM(NN)}`;

  let src = fs.readFileSync(arq, 'utf8');
  let ini = src.indexOf(MARCA_INICIO(NN));
  let fim = src.indexOf(MARCA_FIM(NN));
  if (ini >= 0 && fim > ini) {
    fim += MARCA_FIM(NN).length;
  } else {
    // Primeira geração: do comentário /** que precede o LEAD ao `};` que fecha o CORPO.
    const lead = src.indexOf(`export const MODULO_${NN}_LEAD`);
    const corpo = src.indexOf(`export const MODULO_${NN}_CORPO`);
    if (lead < 0 || corpo < 0 || corpo < lead) throw new Error('LEAD/CORPO não encontrados na ordem esperada');
    ini = src.lastIndexOf('/**', lead);
    const fechaCorpo = src.indexOf('\n};', corpo);
    if (ini < 0 || fechaCorpo < 0) throw new Error('delimitação não encontrada');
    // entre o fim do LEAD e o início do comentário do CORPO só pode haver o próprio comentário
    const fimLead = src.indexOf('\n};', lead);
    const entre = src.slice(fimLead + 3, src.lastIndexOf('/**', corpo)).trim();
    if (entre) throw new Error(`há conteúdo entre LEAD e CORPO: ${entre.slice(0, 80)}`);
    fim = fechaCorpo + 3;
  }
  src = src.slice(0, ini) + novo + src.slice(fim);
  console.log(`M${NN}: ${aulas.length} aulas, ${total} blocos. Trocas editoriais: ${JSON.stringify(uso)}`);
  for (const a of aulas) console.log(`  ${id(a)}: ${a.blocos.length} blocos; instrumento depois do bloco ${a.instrumentoDepoisDoBloco}`);
  if (!seco) fs.writeFileSync(arq, src);
  return aulas;
}
