// Corpo das aulas de M06, M07 e M08 no tipo `AulaBloco` do produto, a partir do HTML original
// (via `aulas-html-m06-m08.mjs`). Usado por dois scripts:
//   · gerar-corpo-m06-m08.mjs  — reescreve MODULO_NN_LEAD e MODULO_NN_CORPO no arquivo de conteúdo;
//   · verificar-porte-mNN.mjs  — confere o arquivo de conteúdo contra a fonte (0 falta, 0 órfão).
//
// O que muda entre a fonte e o produto, e só isto (cada uso é contado e impresso):
//   EDITORIAIS (decisões do Founder, docs/alexandria-v3/DECISOES-2026-11-15.md):
//     · P24/Q03 — "GridAlpha" → "NIVAR" (empresa).
//     · Q02/Q03 — remissão interna "Bloco N" → "Módulo NN" (o catálogo governa o nome).
//     · Q03/S4  — "do backend (da plataforma)" → "da plataforma" (vocabulário interno; P0 do auditor).
//     · P23     — "Linguagem — trava 4" → "Linguagem" (numeração interna do War Room, sem
//                 rótulo semântico na fonte; nunca uma numeração possivelmente falsa).
//   FORMA (o tipo AulaBloco tem seis formas; nenhuma palavra é acrescentada):
//     · caixa `box` → nota (rótulo = `span.tag`; parágrafos unidos por <br><br>, como no M01);
//     · três níveis `lv` → três notas, rótulo "<cabeçalho> · <aba>";
//     · ficha `fi`/`src-card` → tabela de duas colunas (nome · tipo; depois campo · valor);
//     · etapas `ol.stp` → lista "<b>etapa</b> · quem · texto" (a fonte separa por <span>, que o
//       leitor do produto achata e colaria as palavras);
//     · cadeia `div.chain` → lista "<b>rótulo</b> texto";
//     · fórmula `div.form` (M08) → fórmula com a nota da fonte como descrição;
//     · `span.hl`, `span.term` e links viram texto (o leitor do produto só guarda b/i/em/strong/sub/sup/br).

import { lerAulas, colapsa } from './aulas-html-m06-m08.mjs';

export const EDITORIAIS = [
  [/GridAlpha/g, () => 'NIVAR', 'P24 (GridAlpha → NIVAR)'],
  [/\bBloco (\d{1,2})\b/g, (_, n) => `Módulo ${String(n).padStart(2, '0')}`, 'Q02/Q03 (Bloco N → Módulo NN)'],
  [/Linguagem — trava 4/g, () => 'Linguagem', 'P23 (trava 4 sem rótulo semântico)'],
  // bar.md S4: "backend" é arquitetura interna; o gridalpha-detect barra (P0). Só nas duas frases do M07.
  [/do backend da plataforma/g, () => 'da plataforma', 'Q03/S4 (backend → plataforma)'],
  [/do backend/g, () => 'da plataforma', 'Q03/S4 (backend → plataforma)'],
];

export function editorial(s, uso = {}) {
  let r = String(s ?? '');
  for (const [re, por, nome] of EDITORIAIS) {
    const n = (r.match(re) || []).length;
    if (n) { uso[nome] = (uso[nome] || 0) + n; r = r.replace(re, por); }
  }
  return r;
}

const tom = (t) => (t === 'gold' ? 'gold' : t === 'red' ? 'red' : 'neutro');

/** Blocos do produto de uma aula + a posição de cada instrumento da fonte
 *  (índice do último bloco antes dele; -1 se vier antes do primeiro). */
export function corpoDaAula(aula, uso = {}) {
  const ed = (s) => editorial(s, uso);
  const out = [];
  const instrumentos = [];
  for (const b of aula.blocos) {
    switch (b.tipo) {
      case 'titulo': out.push({ kind: 'titulo', numero: b.numero, texto: ed(b.texto) }); break;
      case 'paragrafo': out.push({ kind: 'paragrafo', html: ed(b.html) }); break;
      case 'formula': {
        const m = /^([\s\S]*?)<span class="note">([\s\S]*?)<\/span>\s*$/.exec(b.eq);
        if (m) out.push({ kind: 'formula', eq: ed(colapsa(m[1])), desc: ed(colapsa(m[2])) });
        else out.push({ kind: 'formula', eq: ed(b.eq), desc: b.desc ? ed(b.desc) : null });
        break;
      }
      case 'tabela': {
        const linhas = [...(b.cabecalho.length ? [b.cabecalho] : []), ...b.linhas].map((l) => l.map(ed));
        out.push({ kind: 'tabela', linhas });
        break;
      }
      case 'nota': {
        const html = b.partes
          .map((p) => (p.tipo === 'p' ? p.html : p.tipo === 'lista' ? p.itens.join('<br>') : p.html))
          .join('<br><br>');
        out.push({ kind: 'nota', tom: tom(b.tom), label: b.rotulo ? ed(b.rotulo) : null, html: ed(html) });
        break;
      }
      case 'tres_niveis':
        b.abas.forEach((aba, i) => {
          out.push({ kind: 'nota', tom: 'neutro', label: ed(`${b.cabecalho} · ${aba}`), html: ed(b.paineis[i] ?? '') });
        });
        break;
      case 'lista':
        out.push({
          kind: 'lista',
          itens: b.itens.map((it) => ed(it.etapa ? `<b>${it.etapa}</b> · ${it.quem} · ${it.texto}` : it.html)),
        });
        break;
      case 'ficha':
        out.push({ kind: 'tabela', linhas: [[b.nome ?? '', b.tipoFicha ?? ''], ...b.linhas].map((l) => l.map(ed)) });
        break;
      case 'cadeia': {
        const itens = [...b.bruto.matchAll(/<div class="cbox[^"]*"><span class="ck2">([\s\S]*?)<\/span>([\s\S]*?)<\/div>/g)]
          .map((x) => ed(`<b>${colapsa(x[1])}</b> ${colapsa(x[2])}`));
        if (itens.length !== b.passos.length) throw new Error(`cadeia L${b.linha}: ${itens.length} itens × ${b.passos.length} passos`);
        out.push({ kind: 'lista', itens });
        break;
      }
      case 'instrumento':
        instrumentos.push({ id: b.id, nome: b.nome, depoisDoBloco: out.length - 1, linha: b.linha });
        break;
      default:
        throw new Error(`bloco ${b.tipo} sem forma no produto (L${b.linha})`);
    }
  }
  return { blocos: out, lead: aula.lead ? ed(aula.lead) : null, instrumentos };
}

export function corpoDoModulo(n, uso = {}) {
  return lerAulas(n).map((a) => ({ aula: a, ...corpoDaAula(a, uso) }));
}
