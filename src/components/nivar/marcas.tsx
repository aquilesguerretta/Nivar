// marcas — ARCHITECT, Portal do Operador, revisão visual pós-Wave 2.
//
// As seis marcas do NIVAR — as cinco famílias e a casa — como componente
// inline. Os caminhos são CÓPIA LITERAL de
// `.claude/skills/NIVAR Design System/assets/marks/*.svg`, sem um ponto
// movido: "aplicar, nunca recriar" (readme.md:167).
//
// ─── POR QUE INLINE, E NÃO <img> ─────────────────────────────────────
// As marcas de família usam `stroke="currentColor"` (readme.md:153). Por
// `<img src>` o documento é isolado e currentColor cai para preto —
// o glifo sai sempre da mesma cor, independente da família
// (readme.md:155-163). Inline, a cor vem do ancestral, que é exatamente
// como a família deve entrar: pela cor do CONTEXTO, nunca recolorindo
// o traço.
//
// A casa é a exceção: traz gradiente próprio, e não aceita currentColor
// (BrandLoader.prompt.md:10). O gradiente tem id por instância para
// duas marcas na mesma página não colidirem.
//
// ─── TAMANHO MÍNIMO SOBRE TINTA ──────────────────────────────────────
// Sobre tinta, academy lê 3,1:1 só a partir de 24px e hardware 3,5:1 a
// partir de 19px (readme.md:50-60). Sobre papel, advisory e intelligence
// não leem como cor de texto (1,9:1 e 1,4:1) — como TRAÇO de marca ao
// lado de um nome em tinta, leem, porque o nome carrega a legibilidade
// e o traço carrega a identidade. É esse o par que a lateral usa.

import type { CSSProperties } from 'react';

import type { FamiliaId } from '../../lib/data/br-familias';

const TRACO = { fill: 'none', stroke: 'currentColor', strokeWidth: 6.5, strokeLinecap: 'round' as const };

/** Caminhos verbatim de `assets/marks/familia-<id>.svg`, caixa 100×100. */
const FAMILIAS: Record<FamiliaId, React.ReactNode> = {
  hardware: (
    <g {...TRACO}>
      <path d="M50 14 L50 30" />
      <path d="M18 30 L82 30" />
      <path d="M34 44 L66 44" />
      <path d="M18 58 L82 58" />
      <path d="M34 72 L66 72" />
      <path d="M50 72 L50 86" />
    </g>
  ),
  academy: (
    <g {...TRACO}>
      <path d="M14 86 L38 46" />
      <path d="M86 86 L62 46" />
      <path d="M24 70 L76 70" />
      <path d="M38 46 L38 32" />
      <path d="M62 46 L62 32" />
      <path d="M38 32 L62 32" />
      <path d="M38 32 L14 22" />
      <path d="M62 32 L86 22" />
      <path d="M50 32 L50 14" />
    </g>
  ),
  software: (
    <g {...TRACO}>
      <path d="M32 20 L14 50 L32 80" />
      <path d="M68 20 L86 50 L68 80" />
      <path d="M40 62 L40 38 L60 62 L60 38" strokeWidth={6} strokeLinejoin="miter" strokeLinecap="butt" />
    </g>
  ),
  advisory: (
    <g {...TRACO}>
      <path d="M14 22 L52 50" />
      <path d="M14 50 L52 50" />
      <path d="M14 78 L52 50" />
      <circle cx="66" cy="50" r="14" />
    </g>
  ),
  intelligence: (
    <g {...TRACO} strokeWidth={5.5}>
      <path d="M50 50 L58 18 M50 50 L82 58 M50 50 L42 82 M50 50 L18 42" />
      <path d="M58 18 L82 58 M42 82 L18 42" />
      <circle cx="58" cy="18" r="6.5" fill="currentColor" stroke="none" />
      <circle cx="82" cy="58" r="6.5" fill="currentColor" stroke="none" />
      <circle cx="42" cy="82" r="6.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="42" r="6.5" fill="currentColor" stroke="none" />
      <circle cx="50" cy="50" r="10" fill="currentColor" stroke="none" />
    </g>
  ),
};

const NOMES: Record<FamiliaId, string> = {
  hardware: 'Hardware',
  academy: 'Academy',
  software: 'Software',
  advisory: 'Advisory',
  intelligence: 'Intelligence',
};

export interface MarcaFamiliaProps {
  familia: FamiliaId;
  /** Lado da caixa em px. A cor vem de `color` no ancestral. */
  tamanho?: number;
  style?: CSSProperties;
  /** Rotulada para leitor de tela quando é o único sinal da família;
   *  decorativa (aria-hidden) quando o nome está escrito ao lado. */
  rotulada?: boolean;
}

export function MarcaFamilia({ familia, tamanho = 24, style, rotulada }: MarcaFamiliaProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={tamanho}
      height={tamanho}
      role={rotulada ? 'img' : undefined}
      aria-label={rotulada ? NOMES[familia] : undefined}
      aria-hidden={rotulada ? undefined : true}
      style={{ display: 'block', flex: 'none', overflow: 'visible', ...style }}
    >
      {rotulada ? <title>{NOMES[familia]}</title> : null}
      {FAMILIAS[familia]}
    </svg>
  );
}

/** A casa — o N em gradiente incandescente. Verbatim de
 *  `assets/marks/nivar-casa.svg`. Não aceita cor: o gradiente É a marca. */
export function MarcaCasa({ tamanho = 24, idSufixo, style }: { tamanho?: number; idSufixo: string; style?: CSSProperties }) {
  const id = `incandescente-casa-${idSufixo}`;
  return (
    <svg
      viewBox="0 0 100 100"
      width={tamanho}
      height={tamanho}
      role="img"
      aria-label="NIVAR"
      style={{ display: 'block', flex: 'none', overflow: 'visible', ...style }}
    >
      <title>NIVAR</title>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="24" y1="0" x2="76" y2="0">
          <stop offset="0%" stopColor="#7A1F0D" />
          <stop offset="50%" stopColor="#C17D1F" />
          <stop offset="100%" stopColor="#F5C63C" />
        </linearGradient>
      </defs>
      {/* A marca da casa, verbatim de assets/marks/nivar-casa.svg: o N em
          curvas Bézier é identidade, não onda decorativa. */}
      {/* // gridalpha-detect-disable-next-line no-decorative-svg — marca da casa, verbatim do sistema */}
      <path
        d="M24 84 C24 62 24 38 24 16 C50 32 50 68 76 84 C76 62 76 38 76 16"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={11}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
