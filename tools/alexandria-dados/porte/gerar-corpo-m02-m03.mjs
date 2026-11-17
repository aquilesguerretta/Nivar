// Gera MODULO_0N_LEAD e MODULO_0N_CORPO do M02 ou do M03 a partir do HTML
// original (leitura em aulas-html-m02-m03.mjs) e reescreve só esse trecho de
// src/lib/data/alexandria-modulo-0N-content.ts. Instrumentos, aulas e
// exercícios do arquivo ficam como estão.
//
// Por que regenerar em vez de remendar: o porte antigo perdeu os painéis de três
// níveis (D19: 18 no M02), as cadeias de tensão e a comparação lado a lado; a
// leitura determinística do HTML devolve tudo, na ordem da fonte.
//
// Forma de cada bloco (a mesma do M01, `AulaBloco`):
//   titulo · paragrafo · formula (eq com <sub>/<sup>) · tabela (1ª linha = cabeçalho)
//   nota (callout; parágrafos juntados por <br><br>, como no M01)
//   três níveis → uma nota por nível, rótulo da aba como label (como no M01)
//   cadeia (div.chain) e comparação (div.vs-grid) → lista com <strong>título</strong><br>texto
//     (é o que o M01 fez com as células da figura da A03)
//
// Trocas editoriais: só as decididas (DECISOES-2026-11-15.md, Q03/Q13), cada uma
// literal e contada na saída. Nenhuma outra mudança de texto.
//
// Uso: node tools/alexandria-dados/porte/gerar-corpo-m02-m03.mjs 2 [--escrever]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerAulas } from './aulas-html-m02-m03.mjs';
import { EDITORIAIS } from './editoriais-m02-m03.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const n = Number(process.argv[2]);
if (n !== 2 && n !== 3) throw new Error('uso: gerar-corpo-m02-m03.mjs 2|3 [--escrever]');
const NN = String(n).padStart(2, '0');
const ESCREVER = process.argv.includes('--escrever');
const TS = path.join(RAIZ, `src/lib/data/alexandria-modulo-${NN}-content.ts`);

// Spans de estilo da fonte saem (o leitor da v3 os ignora); span.calc fica.
const limpar = (h) => {
  let s = h;
  for (let i = 0; i < 3; i++) s = s.replace(/<span class="(?:hl|mono|op|unit|mark|num|total|sw)">([\s\S]*?)<\/span>/g, '$1');
  return s.replace(/<(b|strong|i|em|sub|sup)\s+class="[^"]*">/g, '<$1>');
};

const uso = new Map();
export function editorial(s, onde) {
  let r = s;
  for (const e of EDITORIAIS[n]) {
    if (e.de instanceof RegExp) {
      const k = (r.match(e.de) || []).length;
      if (k) { uso.set(e.id, (uso.get(e.id) ?? 0) + k); r = r.replace(e.de, e.para); }
    } else if (r.includes(e.de)) {
      uso.set(e.id, (uso.get(e.id) ?? 0) + 1);
      r = r.split(e.de).join(e.para);
    }
  }
  return r;
}
const t = (h, onde) => editorial(limpar(h), onde);

export function gerar() {
  const lead = {}; const corpo = {};
  for (const a of lerAulas(n)) {
    const id = `aula-${NN}-${String(a.num).padStart(2, '0')}`;
    lead[id] = a.lead ? t(a.lead, `${id}/lead`) : null;
    const bl = [];
    for (const b of a.blocos) {
      const onde = `${id}@L${b.linha}`;
      switch (b.tipo) {
        case 'titulo': bl.push({ kind: 'titulo', numero: b.numero, texto: t(b.texto, onde) }); break;
        case 'paragrafo': bl.push({ kind: 'paragrafo', html: t(b.html, onde) }); break;
        case 'formula': bl.push({ kind: 'formula', eq: t(b.eq, onde), desc: b.desc ? t(b.desc, onde) : null }); break;
        case 'tabela': bl.push({ kind: 'tabela', linhas: [...(b.cabecalho.length ? [b.cabecalho] : []), ...b.linhas].map((l) => l.map((c) => t(c, onde))) }); break;
        case 'nota': bl.push({ kind: 'nota', tom: b.tom, label: b.rotulo ? t(b.rotulo, onde) : null, html: b.paragrafos.map((p) => t(p, onde)).join('<br><br>') }); break;
        case 'tres_niveis':
          b.abas.forEach((aba, i) => bl.push({ kind: 'nota', tom: 'neutro', label: t(aba, onde), html: t(b.paineis[i], onde) }));
          break;
        case 'lista': bl.push({ kind: 'lista', itens: b.itens.map((x) => t(x, onde)) }); break;
        case 'cadeia': bl.push({ kind: 'lista', itens: b.passos.map((p) => `<strong>${t(p.volt, onde)}</strong><br>${t(p.nome, onde)}`) }); break;
        case 'comparacao': bl.push({ kind: 'lista', itens: b.celulas.map((c) => `<strong>${t(c.h5, onde)}</strong><br>${t(c.p, onde)}`) }); break;
        case 'instrumento': break;
        default: throw new Error(`bloco não tratado ${b.tipo} em ${onde}`);
      }
    }
    corpo[id] = bl;
  }
  return { lead, corpo, uso };
}

const J = (s) => JSON.stringify(s);
function serializar(b) {
  switch (b.kind) {
    case 'titulo': return `{ kind: 'titulo', numero: ${J(b.numero)}, texto: ${J(b.texto)} }`;
    case 'paragrafo': return `{ kind: 'paragrafo', html: ${J(b.html)} }`;
    case 'formula': return `{ kind: 'formula', eq: ${J(b.eq)}, desc: ${J(b.desc)} }`;
    case 'nota': return `{ kind: 'nota', tom: ${J(b.tom)}, label: ${J(b.label)}, html: ${J(b.html)} }`;
    case 'lista': return `{ kind: 'lista', itens: ${J(b.itens)} }`;
    case 'tabela': return `{ kind: 'tabela', linhas: ${J(b.linhas)} }`;
  }
}

if (process.argv[1] && process.argv[1].endsWith('gerar-corpo-m02-m03.mjs')) {
  const { lead, corpo } = gerar();
  const total = Object.values(corpo).reduce((s, x) => s + x.length, 0);
  let out = `/** Lead de cada aula — o \`<p class="lead">\` da fonte.
 *  GERADO por tools/alexandria-dados/porte/gerar-corpo-m02-m03.mjs ${n} — não editar à mão. */
export const MODULO_${NN}_LEAD: Record<string, string> = {
${Object.entries(lead).filter(([, v]) => v).map(([k, v]) => `  '${k}': ${J(v)},`).join('\n')}
};

/** Corpo de texto — a apostila. ${total} blocos nas dez aulas, na ordem da fonte,
 *  com os painéis de três níveis como notas (rótulo = nível).
 *  GERADO por tools/alexandria-dados/porte/gerar-corpo-m02-m03.mjs ${n} — não editar à mão;
 *  conferido por tools/alexandria-dados/porte/verificar-porte-m${NN}.mjs. */
export const MODULO_${NN}_CORPO: Record<string, AulaBloco[]> = {
${Object.entries(corpo).map(([k, bl]) => `  '${k}': [\n${bl.map((b) => `    ${serializar(b)},`).join('\n')}\n  ],`).join('\n')}
};

`;
  const src = fs.readFileSync(TS, 'utf8');
  const ini = src.indexOf('/** Lead de cada aula');
  const fimDecl = src.indexOf(`export const MODULO_${NN}_EXERCICIOS_SOLTOS`);
  const fim = src.lastIndexOf('/**', fimDecl);
  if (ini < 0 || fimDecl < 0 || fim < ini) throw new Error('marcadores do trecho não achados');
  console.log(`M${NN}: ${total} blocos; trocas editoriais: ${JSON.stringify(Object.fromEntries(uso))}`);
  for (const e of EDITORIAIS[n]) if (!uso.get(e.id)) console.log(`   ! troca ${e.id} não usada`);
  if (ESCREVER) {
    fs.writeFileSync(TS, src.slice(0, ini) + out + src.slice(fim));
    console.log(`   escrito em ${path.relative(RAIZ, TS)}`);
  }
}
