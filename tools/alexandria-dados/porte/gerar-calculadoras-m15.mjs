// Gera src/lib/data/calculadoras/m15.ts a partir das calculadoras do M15 que JÁ estão em
// src/lib/data/alexandria-instrument-calculators.ts (transliteração do script da fonte,
// conferida pela extração: readouts e vereditos idênticos — extraction/m15/instrumentos.json,
// `fidelidade`).
//
// O que muda, e só isso: cada função já monta `OUT` (o innerHTML exato de cada readout da
// fonte, com prefixo, sufixo e casas do script) e o descarta (`void OUT`). Aqui o retorno
// passa a entregar `textos: OUT` (contrato novo da aula v3: o texto verbatim da fonte tem
// precedência na tela) e `vereditoPtBr: true` (o `fmt11` já formata em pt-BR). Isso fecha
// três divergências da extração: prefixos "R$"/"US$" que não chegavam à tela, casas fixas
// perdidas, e o INST·09 `ac-gb`, em que a fonte mostra "—" e a porta mostrava um número
// negativo. A lógica não é tocada: o bloco é copiado byte a byte e só o `return` é trocado.
//
// Uso: node tools/alexandria-dados/porte/gerar-calculadoras-m15.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const GRANDE = path.join(RAIZ, 'src/lib/data/alexandria-instrument-calculators.ts');
const src = fs.readFileSync(GRANDE, 'utf8').replace(/\r\n/g, '\n');

// helpers do M11/M15 (nm, sv, fmt11, esc15, alx15), do comentário de `nm` até o fim de `alx15`
const hIni = src.indexOf('/** Helpers do Módulo 11');
const hFim = src.indexOf('import { CALCULADORAS_POR_MODULO }', hIni);
if (hIni < 0 || hFim < 0) throw new Error('helpers do M15 não encontrados');
let helpers = src.slice(hIni, hFim).trimEnd();
// Q13 no `alx15` desta cópia: a fonte separa por CSS o que o texto cru gruda. No INST·01,
// `.fzv` é negrito e `.fzn` é bloco (display:block) — "Recebe · UpstreamEleva…" vira
// "Recebe · <b>Upstream</b><br>Eleva…"; e um rótulo em negrito colado à palavra seguinte
// ("<b>O que este número não diz</b>Não diz…") ganha quebra, como o M14 faz no corpo.
{
  const ini = helpers.indexOf('const alx15 = (h: string): string =>\n  h\n');
  const fim = helpers.indexOf("    .trim();", ini);
  if (ini < 0 || fim < 0) throw new Error('alx15 não encontrado nos helpers');
  const cabeca = 'const alx15 = (h: string): string =>\n  h\n';
  helpers =
    helpers.slice(0, ini) + cabeca +
    "    .replace(/<span class=\"fzv\">([\\s\\S]*?)<\\/span>/g, '<b>$1</b>')\n" +
    "    .replace(/<span class=\"fzn\">/g, '<br>')\n" +
    helpers.slice(ini + cabeca.length, fim) +
    "    .replace(/<\\/b>(?=[A-Za-zÀ-ÿ\"“])/g, '</b><br>')\n" +
    helpers.slice(fim);
}

// funções do M15: do primeiro "// ── m15 INST" até o comentário que abre CALCULADORAS_POR_MODULO
const fIni = src.indexOf('  // ── m15 INST');
const fFim = src.indexOf('  // Calculadoras novas ou corrigidas pelas sessões de porte', fIni);
if (fIni < 0 || fFim < 0) throw new Error('bloco do M15 não encontrado');
let bloco = src.slice(fIni, fFim).trimEnd();

const ids = [...bloco.matchAll(/^  '(m15-inst-\d\d)': \(i\) => \{/gm)].map((m) => m[1]);
if (ids.length !== 10) throw new Error(`esperava 10 funções do M15, achei ${ids.length}`);
const nRet = (bloco.match(/return \{ valores, veredito: /g) || []).length;
const nVoid = (bloco.match(/void OUT;/g) || []).length;
// INST·09 guarda a posição contra o CMO em T (readout `ac-po`)
// Exposição para a previsão por escolha (contrato v3: a grandeza prevista é uma saída da
// calculadora). Não muda cálculo nem tela: só põe em OUT um valor que a função já tem.
//   INST·08: o estado da combinação que o painel escreve ("Aplica." / "Não se aplica.").
//   INST·10: a categoria do enunciado (`e.y`), que a fonte mostra na etiqueta do chip.
const EXPOR = {
  'm15-inst-08': "    OUT['cl-comb'] = c.ok ? 'Aplica' : 'Não se aplica'; // exposto para a previsão (estado do painel)\n",
  'm15-inst-10': "    OUT['vf-cat'] = e.y; // exposto para a previsão (etiqueta do chip na fonte)\n",
};
bloco = bloco
  .split(/(?=^  \/\/ ── m15 INST)/m)
  .map((fn) => {
    const id = (/'(m15-inst-\d\d)': \(i\)/.exec(fn) || [])[1];
    if (id && EXPOR[id]) {
      if ((fn.match(/\n    void OUT;/g) || []).length !== 1) throw new Error(`${id}: esperava um "void OUT;"`);
      fn = fn.replace('\n    void OUT;', `\n${EXPOR[id]}    void OUT;`);
    }
    const temT = /const T: Record<string, string> = \{\};/.test(fn);
    return fn.replace(/return \{ valores, veredito: ([^\n]*) \};/g, (m, v) => `return { valores, textos: textosDe(OUT${temT ? ', T' : ''}), veredito: ${v}, vereditoPtBr: true };`);
  })
  .join('');
const trocados = (bloco.match(/textos: textosDe\(/g) || []).length;
if (trocados !== nRet || nVoid !== 10) throw new Error(`retornos trocados ${trocados}/${nRet}, void OUT ${nVoid}`);

const ts = `// Calculadoras do M15 no contrato da aula v3. Posse: a sessão de porte do M15.
// GERADO por tools/alexandria-dados/porte/gerar-calculadoras-m15.mjs — não editar à mão.
//
// Cópia das funções m15-inst-01…10 de alexandria-instrument-calculators.ts (transliteração
// do <script> da fonte, conferida pela extração), com UMA troca: o retorno entrega
// \`textos: OUT\` — o innerHTML exato de cada readout da fonte, que a função já montava e
// descartava — e \`vereditoPtBr: true\`. Uma chave aqui SUBSTITUI a de mesmo id no arquivo
// grande. Conferência: tools/alexandria-dados/porte/verificar-calculadoras-m15.mjs.
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

${helpers}

/** OUT (readouts do script) + T (readouts guardados à parte), sem o que veio vazio. */
const textosDe = (OUT: Record<string, string>, T: Record<string, string> = {}): Record<string, string> =>
  Object.fromEntries(Object.entries({ ...OUT, ...T }).filter(([, v]) => typeof v === 'string' && v !== ''));

export const CALCULADORAS: Record<string, CalculateFn> = {
${bloco}
};
`;
fs.writeFileSync(path.join(RAIZ, 'src/lib/data/calculadoras/m15.ts'), ts);
console.log(`m15.ts: ${ids.join(', ')} · ${trocados} retornos com textos`);
