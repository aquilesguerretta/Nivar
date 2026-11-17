// Primitivos dos diagramas do M01: o invólucro (figure + svg + linha de fonte),
// escalas, formatação pt-BR e as pontas de seta. Cada diagrama é SVG gerado por
// código a partir do dado da extração; nenhum número é digitado à mão dentro do
// desenho sem que o componente diga de onde veio.

import { useId } from 'react';
import type { ReactNode } from 'react';
import './diagramas.css';

const nf = new Map<string, Intl.NumberFormat>();

/** Número em pt-BR. `min` fixa casas mínimas (0,25 e não 0,3). */
export function fmt(v: number, max = 0, min = 0): string {
  const k = `${max}/${min}`;
  let f = nf.get(k);
  if (!f) {
    f = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: min, maximumFractionDigits: max });
    nf.set(k, f);
  }
  return f.format(v);
}

export type Escala = (v: number) => number;

export function escalaLinear(d0: number, d1: number, r0: number, r1: number): Escala {
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

export function escalaLog(d0: number, d1: number, r0: number, r1: number): Escala {
  const l0 = Math.log10(d0);
  const l1 = Math.log10(d1);
  return (v) => r0 + ((Math.log10(v) - l0) / (l1 - l0)) * (r1 - r0);
}

/** Ponta de seta sólida em (x, y) apontando para `dir`. */
export function Ponta({
  x,
  y,
  dir,
  tam = 7,
  suave = false,
}: {
  x: number;
  y: number;
  dir: 'direita' | 'esquerda' | 'cima' | 'baixo';
  tam?: number;
  suave?: boolean;
}) {
  const t = tam;
  const d =
    dir === 'direita'
      ? `M${x} ${y} L${x - t} ${y - t / 2} L${x - t} ${y + t / 2} Z`
      : dir === 'esquerda'
        ? `M${x} ${y} L${x + t} ${y - t / 2} L${x + t} ${y + t / 2} Z`
        : dir === 'cima'
          ? `M${x} ${y} L${x - t / 2} ${y + t} L${x + t / 2} ${y + t} Z`
          : `M${x} ${y} L${x - t / 2} ${y - t} L${x + t / 2} ${y - t} Z`;
  return <path d={d} className={suave ? 'dg-seta-suave' : 'dg-seta'} />;
}

export interface DiagramaProps {
  /** Título do desenho, escrito no próprio SVG (e lido pelo leitor de tela). */
  titulo: string;
  subtitulo?: string;
  /** O que o desenho mostra, para quem não enxerga. */
  descricao: string;
  largura?: number;
  altura: number;
  /** Completa "Fonte: …", ex.: "Módulo 01, Aula 04, seção 4.1". */
  fonte: string;
  /** Aviso sob a fonte (cenário didático, derivação, lacuna da fonte). */
  nota?: string;
  children: ReactNode;
}

export function Diagrama({ titulo, subtitulo, descricao, largura = 720, altura, fonte, nota, children }: DiagramaProps) {
  const uid = useId();
  const idT = `${uid}-t`;
  const idD = `${uid}-d`;
  return (
    <figure className="dg">
      <div className="dg-rolagem">
        <svg viewBox={`0 0 ${largura} ${altura}`} role="img" aria-labelledby={`${idT} ${idD}`}>
          <title id={idT}>{titulo}</title>
          <desc id={idD}>{descricao}</desc>
          <text x={16} y={26} className="dg-t dg-negrito">
            {titulo}
          </text>
          {subtitulo ? (
            <text x={16} y={45} className="dg-s">
              {subtitulo}
            </text>
          ) : null}
          {children}
        </svg>
      </div>
      <figcaption className="dg-legenda">
        <span className="dg-rotulo">Fonte:</span> {fonte}
        {nota ? <p className="dg-nota">{nota}</p> : null}
      </figcaption>
    </figure>
  );
}
