// Atlas da Alexandria v3 — a régua do tempo.
//
// Mesma família da ReguaDeslizante da casa (src/components/alexandria/v3):
// não é <input type="range"> (regra alexandria-no-native-range), é um
// role="slider" acessível, com arraste, clique na régua, setas (±1),
// PageUp/PageDown (±salto), Home e End. Aqui o valor é sempre um índice inteiro
// (um mês da série, uma hora do dia) e o rótulo falado vem de quem usa.

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

interface ReguaDoTempoProps {
  valor: number;
  min: number;
  max: number;
  /** quantos passos PageUp/PageDown andam (12 = um ano, numa série mensal) */
  salto: number;
  rotulo: string;
  /** texto lido para o valor corrente, ex.: "set 2001" */
  falado: string;
  aoMudar: (v: number) => void;
  /** quantas marcas a régua desenha (uma maior a cada quinta) */
  marcas?: number;
}

export function ReguaDoTempo({ valor, min, max, salto, rotulo, falado, aoMudar, marcas = 28 }: ReguaDoTempoProps) {
  const trilho = useRef<HTMLDivElement | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const limitar = (v: number) => Math.min(max, Math.max(min, Math.round(v)));

  const deX = (clientX: number) => {
    const r = trilho.current?.getBoundingClientRect();
    if (!r || r.width === 0) return valor;
    return limitar(min + Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * (max - min));
  };

  // No toque, o dedo pode estar só rolando a gaveta: a régua espera o gesto ficar
  // horizontal (ou o dedo sair parado) antes de mudar o valor. Mouse e caneta mudam na hora.
  const origem = useRef<{ x: number; y: number; decidido: boolean } | null>(null);

  const aoApertar = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') {
      origem.current = { x: e.clientX, y: e.clientY, decidido: false };
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastando(true);
    aoMudar(deX(e.clientX));
  };
  const aoMover = (e: PointerEvent<HTMLDivElement>) => {
    const o = origem.current;
    if (o && !o.decidido) {
      const dx = Math.abs(e.clientX - o.x);
      const dy = Math.abs(e.clientY - o.y);
      if (dx > 6 && dx > dy) {
        o.decidido = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setArrastando(true);
      } else return;
    }
    if (arrastando || o?.decidido) aoMudar(deX(e.clientX));
  };
  const aoSoltar = (e: PointerEvent<HTMLDivElement>) => {
    const o = origem.current;
    // toque parado (sem rolar nem arrastar): vale como clique na régua
    if (o && !o.decidido && e.type === 'pointerup' && Math.abs(e.clientX - o.x) < 6 && Math.abs(e.clientY - o.y) < 6) aoMudar(deX(e.clientX));
    origem.current = null;
    setArrastando(false);
  };

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const passos: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: salto, PageDown: -salto };
    if (e.key in passos) {
      e.preventDefault();
      aoMudar(limitar(valor + passos[e.key]));
    } else if (e.key === 'Home') {
      e.preventDefault();
      aoMudar(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      aoMudar(max);
    }
  };

  const fracao = (valor - min) / (max - min || 1);

  return (
    <div
      ref={trilho}
      className="atl-regua"
      data-arrastando={arrastando || undefined}
      role="slider"
      tabIndex={0}
      aria-label={rotulo}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={valor}
      aria-valuetext={falado}
      onPointerDown={aoApertar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onKeyDown={aoTeclar}
    >
      <span className="atl-regua-escala" aria-hidden="true">
        {Array.from({ length: marcas }, (_, i) => (
          <span key={i} className="atl-regua-marca" data-maior={i % 5 === 0 || undefined} />
        ))}
      </span>
      <span className="atl-regua-feito" style={{ width: `${fracao * 100}%` }} aria-hidden="true" />
      <span className="atl-regua-polegar" style={{ left: `${fracao * 100}%` }} aria-hidden="true" />
    </div>
  );
}
