// texto.tsx — o HTML inline da fonte vira React, e os termos do glossário
// viram ligação no fluxo (C4).
//
// O corpo das aulas vem como HTML curto (b, strong, i, em, br, sub, sup,
// span.calc). Ele é LIDO por DOMParser e reconstruído só com uma lista
// fechada de elementos — nada de dangerouslySetInnerHTML, e qualquer outra
// marca vira o texto dela.
//
// TERMOS. Só os verbetes que o glossário ancora NESTA aula (`aulaIds` do §
// Lex do módulo) são ligados, e cada um só na PRIMEIRA ocorrência na leitura:
// ligar toda ocorrência de "kW" transformaria a página em sublinhado. A
// definição abre no lugar, logo abaixo do bloco, em uma ação — sem hover,
// porque a 390 nada pode depender dele.

import { Fragment, type ReactNode } from 'react';
import { emprestadosNaAula, VERBETES_V3, type Definicao } from '@/lib/alexandria/verbetes';
import { padraoDoTermo, regexDoTermo } from '@/lib/alexandria/glossario-ocorrencia';

export type No =
  | { t: 'txt'; s: string }
  | { t: 'el'; tag: 'strong' | 'em' | 'br' | 'sub' | 'sup' | 'code' | 'calc'; kids: No[] }
  | { t: 'termo'; s: string; termo: TermoDaAula };

export interface TermoDaAula {
  slug: string;
  termo: string;
  def: Definicao;
  padrao: RegExp;
  /** Rótulo da definição aberta: "Glossário · M09", ou "Glossário · definido
   *  no M07" quando a definição vem de um módulo anterior. */
  rotulo: string;
}

const MAPA: Record<string, Exclude<No, { t: 'txt' } | { t: 'termo' }>['tag']> = {
  b: 'strong',
  strong: 'strong',
  i: 'em',
  em: 'em',
  br: 'br',
  sub: 'sub',
  sup: 'sup',
  code: 'code',
};

function converter(n: Node): No[] {
  if (n.nodeType === 3) return [{ t: 'txt', s: n.textContent ?? '' }];
  if (n.nodeType !== 1) return [];
  const el = n as Element;
  const kids = Array.from(el.childNodes).flatMap(converter);
  const nome = el.tagName.toLowerCase();
  if (nome === 'span' && el.classList.contains('calc')) return [{ t: 'el', tag: 'calc', kids }];
  const tag = MAPA[nome];
  return tag ? [{ t: 'el', tag, kids }] : kids;
}

const cache = new Map<string, No[]>();

export function lerHtml(html: string): No[] {
  const c = cache.get(html);
  if (c) return c;
  let nos: No[];
  if (typeof DOMParser === 'undefined') nos = [{ t: 'txt', s: html.replace(/<[^>]+>/g, '') }];
  else {
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    nos = Array.from(doc.body.childNodes).flatMap(converter);
  }
  cache.set(html, nos);
  return nos;
}

export function textoPlano(html: string): string {
  const junta = (ns: No[]): string =>
    ns.map((n) => (n.t === 'txt' || n.t === 'termo' ? n.s : n.tag === 'br' ? ' ' : junta(n.kids))).join('');
  return junta(lerHtml(html));
}

// ── termos ───────────────────────────────────────────────────

/** Verbetes que aparecem nesta aula, com o padrão de busca de cada um. A
 *  definição ligada é a do módulo da aula (decisão de 15/11/2026, Glossário,
 *  item 2); termo que o módulo não define liga a definição do módulo anterior
 *  mais próximo na trilha, rotulada "definido no MNN". "Aparece" é o vínculo mecânico
 *  (decisão 5), calculado pela mesma regra que monta o padrão abaixo
 *  (`glossario-ocorrencia.ts`): sigla com caixa exata, palavra sem caixa,
 *  parêntese final fora, fronteira de palavra. */
export function termosDaAula(aulaId: string, moduloId: string): TermoDaAula[] {
  const codigo = `M${moduloId.slice(-2)}`;
  const saida: TermoDaAula[] = [];
  for (const v of VERBETES_V3) {
    const def = v.definicoes.find((d) => d.codigo === codigo && d.aulas.some((a) => a.id === aulaId));
    if (!def) continue;
    const p = padraoDoTermo(def.termo);
    if (!p) continue;
    saida.push({ slug: v.slug, termo: v.termo, def, padrao: regexDoTermo(p), rotulo: `Glossário · ${def.codigo}` });
  }
  // Termo que o módulo da aula não define: a definição do módulo anterior mais
  // próximo na trilha, com o rótulo dizendo de onde ela vem (coordenação,
  // 15/11/2026). Vem depois dos do módulo: num empate de posição e tamanho,
  // `ligarTermos` fica com o primeiro da lista.
  for (const { verbete, def } of emprestadosNaAula(aulaId, moduloId)) {
    const p = padraoDoTermo(def.termo);
    if (!p) continue;
    saida.push({
      slug: verbete.slug,
      termo: verbete.termo,
      def,
      padrao: regexDoTermo(p),
      rotulo: `Glossário · definido no ${def.codigo}`,
    });
  }
  return saida;
}

/** Liga, em ordem de leitura, a primeira ocorrência de cada termo ainda não
 *  usado. `usados` é compartilhado entre os blocos da mesma aula. */
export function ligarTermos(nos: No[], termos: TermoDaAula[], usados: Set<string>): No[] {
  const out: No[] = [];
  for (const n of nos) {
    if (n.t === 'el') {
      out.push(n.tag === 'calc' ? n : { ...n, kids: ligarTermos(n.kids, termos, usados) });
      continue;
    }
    if (n.t !== 'txt') {
      out.push(n);
      continue;
    }
    let resto = n.s;
    for (;;) {
      let melhor: { i: number; s: string; termo: TermoDaAula } | null = null;
      for (const t of termos) {
        if (usados.has(t.slug)) continue;
        const m = t.padrao.exec(resto);
        if (!m) continue;
        if (!melhor || m.index < melhor.i || (m.index === melhor.i && m[0].length > melhor.s.length)) {
          melhor = { i: m.index, s: m[0], termo: t };
        }
      }
      if (!melhor) break;
      if (melhor.i > 0) out.push({ t: 'txt', s: resto.slice(0, melhor.i) });
      out.push({ t: 'termo', s: melhor.s, termo: melhor.termo });
      usados.add(melhor.termo.slug);
      resto = resto.slice(melhor.i + melhor.s.length);
    }
    if (resto) out.push({ t: 'txt', s: resto });
  }
  return out;
}

export function termosEm(nos: No[]): TermoDaAula[] {
  const acc: TermoDaAula[] = [];
  const walk = (ns: No[]) => {
    for (const n of ns) {
      if (n.t === 'termo') acc.push(n.termo);
      else if (n.t === 'el') walk(n.kids);
    }
  };
  walk(nos);
  return acc;
}

// ── render ───────────────────────────────────────────────────

export function Rico({
  nos,
  aberto,
  aoAbrir,
}: {
  nos: No[];
  aberto?: string | null;
  aoAbrir?: (slug: string) => void;
}): ReactNode {
  return nos.map((n, i) => {
    if (n.t === 'txt') return <Fragment key={i}>{n.s}</Fragment>;
    if (n.t === 'termo') {
      return (
        <button
          key={i}
          type="button"
          className="av-termo"
          aria-expanded={aberto === n.termo.slug}
          aria-controls={`def-${n.termo.slug}`}
          onClick={() => aoAbrir?.(n.termo.slug)}
          data-capture="termo"
        >
          {n.s}
        </button>
      );
    }
    const filhos = <Rico nos={n.kids} aberto={aberto} aoAbrir={aoAbrir} />;
    switch (n.tag) {
      case 'br':
        return <br key={i} />;
      case 'calc':
        return (
          <span key={i} className="av-calc">
            {filhos}
          </span>
        );
      case 'strong':
        return <strong key={i}>{filhos}</strong>;
      case 'em':
        return <em key={i}>{filhos}</em>;
      case 'sub':
        return <sub key={i}>{filhos}</sub>;
      case 'sup':
        return <sup key={i}>{filhos}</sup>;
      case 'code':
        return <code key={i}>{filhos}</code>;
    }
  });
}

/** HTML da fonte, sem termos. */
export function Html({ html }: { html: string }) {
  return <Rico nos={lerHtml(html)} />;
}
