// patrono — ARCHITECT, Portal do Operador, revisão visual pós-Wave 2.
//
// Os seis patronos da casa, desenhados pelo Aquiles: uma figura da
// mitologia grega num medalhão de brasa, uma por família, e Diógenes
// com a lanterna pela casa inteira. Vieram como PNG de 1254px em
// public/; aqui entram por WebP em três lados (96/192/384), derivados
// com sharp e servidos por srcset — 5 × 1 MB numa lateral seria
// inaceitável, 5 × 6 KB é nada. Os originais ficam intocados.
//
// ─── QUEM É QUEM, E POR QUÊ ──────────────────────────────────────────
// O nome dos arquivos originais troca dois: "argos academy" e "perceu
// academy". Argos Panoptes — cem olhos varrendo o horizonte — é
// vigilância de mercado, INTELLIGENCE. Perseu com a tocha é o
// conhecimento levado adiante, ACADEMY. Hefesto na bigorna é Hardware;
// Ariadne com o fio dourado é o caminho pelo labirinto, Software;
// Sócrates apontando o pergaminho é o parecer com contraditório —
// o método socrático —, Advisory. O mapa é explícito para o dono trocar
// numa linha se discordar.
//
// ─── ONDE ELES VIVEM ─────────────────────────────────────────────────
// Na lateral (aberta e recolhida) como o botão de cada família; no
// masthead, Diógenes ao lado do wordmark; no herói de cada fila, o
// patrono da família preside; no cabeçalho de cada caso, pequeno, antes
// do nome do produto.

import type { CSSProperties } from 'react';

import type { FamiliaId } from '../../lib/data/br-familias';

export type PatronoId = 'diogenes' | 'hefesto' | 'perseu' | 'ariadne' | 'socrates' | 'argos';

export interface Patrono {
  id: PatronoId;
  nome: string;
  /** O que a figura carrega — vira o `alt` e o `title`. */
  emblema: string;
}

export const PATRONO_DA_CASA: Patrono = { id: 'diogenes', nome: 'Diógenes', emblema: 'Diógenes com a lanterna' };

export const PATRONO_DA_FAMILIA: Record<FamiliaId, Patrono> = {
  hardware: { id: 'hefesto', nome: 'Hefesto', emblema: 'Hefesto na bigorna, com o paquímetro' },
  academy: { id: 'perseu', nome: 'Perseu', emblema: 'Perseu com a tocha' },
  software: { id: 'ariadne', nome: 'Ariadne', emblema: 'Ariadne com o fio dourado' },
  advisory: { id: 'socrates', nome: 'Sócrates', emblema: 'Sócrates apontando o pergaminho' },
  intelligence: { id: 'argos', nome: 'Argos', emblema: 'Argos, o dos cem olhos, varrendo o horizonte' },
};

/** A figura, em `<img>` com srcset — bitmap com alfa, não SVG, então
 *  não há currentColor a preservar. `decorativo` esconde do leitor de
 *  tela quando o nome está escrito ao lado. */
export function Figura({
  patrono,
  tamanho,
  decorativo,
  style,
  className,
}: {
  patrono: Patrono;
  /** Lado em px CSS. O srcset entrega 1×/2×/4× conforme o DPR. */
  tamanho: number;
  decorativo?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  const base = `/patronos/${patrono.id}`;
  return (
    <img
      className={className}
      src={`${base}-192.webp`}
      srcSet={`${base}-96.webp 96w, ${base}-192.webp 192w, ${base}-384.webp 384w`}
      sizes={`${tamanho}px`}
      width={tamanho}
      height={tamanho}
      alt={decorativo ? '' : patrono.emblema}
      title={decorativo ? undefined : patrono.emblema}
      aria-hidden={decorativo ? true : undefined}
      decoding="async"
      style={{ display: 'block', flex: 'none', objectFit: 'contain', ...style }}
    />
  );
}
