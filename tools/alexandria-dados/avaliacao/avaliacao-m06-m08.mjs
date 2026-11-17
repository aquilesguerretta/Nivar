// Apoio comum à avaliação de M06, M07 e M08 (gerar-avaliacao-mNN.mjs e verificar-avaliacao-mNN.mjs).
//
// Fonte única: docs/alexandria-v2/extraction/mNN/aparato.json (exercícios, quiz, checklist) e o
// texto das aulas, lido do HTML original por tools/alexandria-dados/porte/ (o mesmo texto que o
// verificador do porte confere contra o produto). Nada aqui é digitado: os geradores declaram só
// a ESPECIFICAÇÃO dos itens derivados (pergunta, alternativas, trecho literal que responde).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registerHooks } from 'node:module';
import { corpoDoModulo } from '../porte/corpo-m06-m08.mjs';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

// O código do produto importa sem extensão (`./alexandria-modulo-08-fatos`), por pasta (`./calculadoras`)
// e com o alias `@/` do Vite. Para o Node importar o .ts de verdade nos geradores e verificadores.
registerHooks({
  resolve(s, c, n) {
    try { return n(s, c); } catch (e) {
      let base = null;
      if (s.startsWith('@/')) base = path.join(RAIZ, 'src', s.slice(2));
      else if (/^\.\.?\//.test(s) && c.parentURL) base = path.join(path.dirname(fileURLToPath(c.parentURL)), s);
      if (!base) throw e;
      for (const cand of [base + '.ts', base + '.tsx', path.join(base, 'index.ts')]) if (fs.existsSync(cand)) return n(pathToFileURL(cand).href, c);
      throw e;
    }
  },
});

const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', times: '×', middot: '·', rarr: '→', ge: '≥', le: '≤' };
export const norm = (s) =>
  String(s ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(+e.slice(1)) : ENT[e.toLowerCase()] ?? m))
    .replace(/\s+/g, ' ')
    .trim();

export const P24 = { trocas: 0 };
/** Troca editorial P24 no texto visível (contada). */
export const p24 = (s) => String(s).replace(/GridAlpha/g, () => { P24.trocas += 1; return 'NIVAR'; });

export const lerAparato = (n) => JSON.parse(fs.readFileSync(path.join(RAIZ, `docs/alexandria-v2/extraction/m${String(n).padStart(2, '0')}/aparato.json`), 'utf8'));

/** Texto de cada aula, bloco a bloco: [{ num, blocos: [{ i, linha, texto }] }]. */
export function textoDasAulas(n) {
  return corpoDoModulo(n).map(({ aula, blocos, lead }) => {
    const fonteBlocos = aula.blocos.filter((b) => b.tipo !== 'instrumento');
    const linhas = [];
    // corpoDaAula expande tres_niveis em 3 notas; os demais tipos dão 1 bloco. Reconstrói a linha da fonte.
    for (const b of fonteBlocos) {
      const k = b.tipo === 'tres_niveis' ? b.abas.length : 1;
      for (let j = 0; j < k; j++) linhas.push(b.linha);
    }
    const plano = (b) =>
      b.kind === 'titulo' ? `${b.numero ?? ''} ${b.texto}` : b.kind === 'formula' ? `${b.eq} ${b.desc ?? ''}` : b.kind === 'lista' ? b.itens.join(' ') : b.kind === 'tabela' ? b.linhas.map((l) => l.join(' — ')).join(' ') : b.html;
    return {
      num: aula.num,
      lead: norm(lead),
      blocos: blocos.map((b, i) => ({ i, linha: linhas[i] ?? null, texto: norm(plano(b)) })),
    };
  });
}

/** Onde o trecho literal está na aula; lança se não está (nunca devolve vazio). */
export function acharEvidencia(aulas, nAula, trecho, NN) {
  const a = aulas.find((x) => x.num === nAula);
  const alvo = norm(trecho);
  const b = a.blocos.find((x) => x.texto.includes(alvo));
  if (!b) throw new Error(`Aula ${nAula}: trecho não está na aula: «${alvo.slice(0, 90)}»`);
  return {
    arquivo: `Alexandria modulos/alexandria_modulo${NN}.html`,
    campo: `aula-${NN}-${String(nAula).padStart(2, '0')} · corpo[${b.i}]`,
    linha: b.linha,
    trecho: alvo,
  };
}

const PARADA = new Set('porque quando sobre entre depois antes ainda mesmo outra outro outras outros qualquer também apenas sempre nenhum nenhuma muito muita muitos muitas coisa coisas parte partes forma setor elétrico elétrica energia brasil brasileiro brasileira quem isso essa esse este esta aquele aquela onde como cada todos todas dentro exatamente resposta pergunta explique diferença primeiro segundo terceiro'.split(' '));
const tokens = (s) => [...new Set((norm(s).toLowerCase().match(/[\p{L}\p{N}]+(?:[.,/][\p{N}]+)*/gu) ?? []).filter((w) => (/\d/.test(w) ? w.length >= 3 : w.length >= 6) && !PARADA.has(w)))];

/**
 * Vínculo MECÂNICO exercício → aula (decisão 5 aplicada a exercício): a aula onde os termos do
 * enunciado e da referência ocorrem literalmente, ponderados pelo inverso do número de aulas
 * em que cada termo ocorre. É ocorrência medida, não inferência de sentido; a tabela inteira é
 * impressa e vai para o relatório.
 */
export function vinculoMecanico(aulas, texto) {
  const toks = tokens(texto);
  const txt = aulas.map((a) => (a.lead + ' ' + a.blocos.map((b) => b.texto).join(' ')).toLowerCase());
  const df = Object.fromEntries(toks.map((t) => [t, txt.filter((x) => x.includes(t)).length]));
  const pont = aulas.map((a, k) => ({ num: a.num, pontos: toks.filter((t) => df[t] > 0 && txt[k].includes(t)).reduce((s, t) => s + 1 / df[t], 0) }));
  const ord = [...pont].sort((x, y) => y.pontos - x.pontos);
  return { aula: ord[0].num, pontos: pont, margem: ord[0].pontos - (ord[1]?.pontos ?? 0) };
}

/** Escreve src/lib/alexandria/avaliacao/mNN.dados.ts. */
export function escrever(n, cabecalho, dados) {
  const NN = String(n).padStart(2, '0');
  const arq = path.join(RAIZ, `src/lib/alexandria/avaliacao/m${NN}.dados.ts`);
  const js = (v) => JSON.stringify(v, null, 2);
  const ts = [
    ...cabecalho.map((l) => `// ${l}`),
    `import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';`,
    ``,
    `export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${js(dados.EXERCICIOS_DAS_AULAS)};`,
    ``,
    `export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${js(dados.EXERCICIOS_DO_MODULO)};`,
    ``,
    `export const PROVAS: ProvaDoModulo[] = ${js(dados.PROVAS)};`,
    ``,
    `export const CHECKLISTS: ChecklistDoModulo[] = ${js(dados.CHECKLISTS)};`,
    ``,
  ].join('\n');
  fs.writeFileSync(arq, ts);
  return path.relative(RAIZ, arq);
}
