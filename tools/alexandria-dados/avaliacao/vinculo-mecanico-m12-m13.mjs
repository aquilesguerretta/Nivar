// Vínculo mecânico exercício → aula (regra de colocação do PORTE-POR-MODULO.md, 15/11):
// "Exercício solto da fonte: última aula que casar, 'vínculo mecânico'. O que não casar
// fica em EXERCICIOS_DO_MODULO."
//
// O casamento é medido, não interpretado: um exercício casa com uma aula quando um TRECHO
// LITERAL com pelo menos `N_PALAVRAS` (= 4) palavras cheias seguidas do exercício (rótulo do summary + enunciado)
// aparece no texto da aula (lead + corpo do produto, conferido contra a fonte). Comparação
// em minúsculas, sem pontuação, espaço colapsado. A resposta-modelo NÃO entra: ela retoma a
// aula inteira e casaria com quase todas. Devolve, por exercício, as aulas que casam, o
// trecho de cada uma, e a escolhida (a última).
//
// Uso (diagnóstico): node tools/alexandria-dados/avaliacao/vinculo-mecanico-m12-m13.mjs 12|13

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { norm } from '../porte/texto-m12-m13.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const N_PALAVRAS = Number(process.env.N_PALAVRAS ?? 4);

const palavras = (s) =>
  norm(s)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%,]+/gu, ' ')
    .replace(/,(?!\d)/g, ' ')
    .split(' ')
    .filter(Boolean);

// Palavras vazias não contam para o tamanho do trecho (um trecho de cinco "de/a/o" não é termo).
const VAZIAS = new Set('a o e é de da do das dos em no na nos nas um uma uns umas que se por para com como ao à às os as ou mais menos não sem sobre entre seu sua seus suas este esta isso isto esse essa ele ela eles elas já'.split(' '));

export async function textosDasAulas(mod) {
  const n2 = String(mod).padStart(2, '0');
  const C = await import(pathToFileURL(path.join(RAIZ, `src/lib/data/alexandria-modulo-${n2}-content.ts`)).href);
  const LEAD = C[`MODULO_${n2}_LEAD`];
  const CORPO = C[`MODULO_${n2}_CORPO`];
  const out = {};
  for (let n = 1; n <= 8; n++) {
    const id = `aula-${n2}-0${n}`;
    const p = [LEAD[id] ?? ''];
    for (const b of CORPO[id] ?? []) {
      if (b.kind === 'titulo') p.push(b.texto);
      else if (b.kind === 'lista') p.push(...b.itens);
      else if (b.kind === 'tabela') p.push(...b.linhas.flat());
      else if (b.kind === 'nota') p.push(b.label ?? '', b.html);
      else if (b.kind === 'formula') p.push(b.eq, b.desc ?? '');
      else p.push(b.html ?? '');
    }
    out[n] = ' ' + p.map((x) => palavras(x).join(' ')).join(' | ') + ' ';
  }
  return out;
}

/** Maior trecho literal (em palavras) do `texto` que aparece em `alvo`, com ≥ N palavras não vazias. */
export function maiorTrecho(texto, alvo) {
  const w = palavras(texto);
  let melhor = null;
  for (let i = 0; i < w.length; i++) {
    for (let j = w.length; j > i; j--) {
      const seg = w.slice(i, j);
      const cheias = seg.filter((x) => !VAZIAS.has(x)).length;
      if (cheias < N_PALAVRAS) break;
      if (alvo.includes(' ' + seg.join(' ') + ' ')) {
        if (!melhor || seg.length > melhor.split(' ').length) melhor = seg.join(' ');
        break;
      }
    }
  }
  return melhor;
}

/** { aulas: [{ n, trecho }], escolhida: n | null } */
export function vincular(textoDoExercicio, textos) {
  const aulas = [];
  for (const [n, alvo] of Object.entries(textos)) {
    const t = maiorTrecho(textoDoExercicio, alvo);
    if (t) aulas.push({ n: Number(n), trecho: t });
  }
  return { aulas, escolhida: aulas.length ? Math.max(...aulas.map((a) => a.n)) : null };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const mod = Number(process.argv[2] ?? 12);
  const fs = await import('node:fs');
  const ap = JSON.parse(fs.readFileSync(path.join(RAIZ, `docs/alexandria-v2/extraction/m${mod}/aparato.json`), 'utf8'));
  const textos = await textosDasAulas(mod);
  const exs = Array.isArray(ap.exercicios) ? ap.exercicios : ap.exercicios.itens;
  for (const x of exs) {
    const t = mod === 12
      ? `${x.tag} ${x.resumo?.texto ?? ''} ${x.enunciado?.texto ?? ''}`
      : `${String(x.tag).replace(/^\d+\s*·\s*/, '')} ${x.enunciado?.texto ?? ''}`;
    const v = vincular(t, textos);
    console.log(`${x.id} → ${v.escolhida ?? 'módulo'}   ${v.aulas.map((a) => `A0${a.n}: «${a.trecho}»`).join('  ')}`);
  }
}
