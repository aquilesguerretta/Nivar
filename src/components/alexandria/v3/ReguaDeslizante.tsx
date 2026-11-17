// Régua deslizante da Alexandria v3 — o controle de valor da casa.
//
// Não é <input type="range">: o polegar nativo é desenhado pelo sistema e
// quebra a materialidade (regra alexandria-no-native-range). Aqui o controle
// é um role="slider" acessível: arrastar, clicar na régua, setas (±passo),
// PageUp/PageDown (±10 passos), Home/End. O traço da régua é marcado como
// régua de medida, com traços maiores a cada quinto.

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

const TRACOS = 41;

export function ReguaDeslizante({
  id,
  rotulo,
  unidade,
  valor,
  min,
  max,
  passo,
  formatar,
  aoMudar,
}: {
  id: string;
  rotulo: string;
  unidade: string;
  valor: number;
  min: number;
  max: number;
  passo: number;
  formatar: (v: number) => string;
  aoMudar: (v: number) => void;
}) {
  const trilho = useRef<HTMLDivElement | null>(null);
  const [arrastando, setArrastando] = useState(false);

  const limitar = useCallback(
    (v: number) => {
      const passos = Math.round((v - min) / passo);
      return Math.min(max, Math.max(min, min + passos * passo));
    },
    [min, max, passo],
  );

  const deX = (clientX: number) => {
    const r = trilho.current?.getBoundingClientRect();
    if (!r) return valor;
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    return limitar(min + t * (max - min));
  };

  const aoApertar = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastando(true);
    aoMudar(deX(e.clientX));
  };
  const aoMover = (e: PointerEvent<HTMLDivElement>) => {
    if (arrastando) aoMudar(deX(e.clientX));
  };
  const aoSoltar = () => setArrastando(false);

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const mapa: Record<string, number> = {
      ArrowRight: passo,
      ArrowUp: passo,
      ArrowLeft: -passo,
      ArrowDown: -passo,
      PageUp: passo * 10,
      PageDown: -passo * 10,
    };
    if (e.key in mapa) {
      e.preventDefault();
      aoMudar(limitar(valor + mapa[e.key]));
    } else if (e.key === 'Home') {
      e.preventDefault();
      aoMudar(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      aoMudar(max);
    }
  };

  const fracao = (valor - min) / (max - min || 1);
  const rotuloId = `${id}-rotulo`;

  return (
    <div className="regua-campo">
      <div className="regua-cabeca">
        <span id={rotuloId} className="regua-rotulo">
          {rotulo}
        </span>
        <span className="regua-valor">
          {formatar(valor)} <span className="v-dado regua-unidade">{unidade}</span>
        </span>
      </div>
      <div
        ref={trilho}
        className="regua-trilho"
        data-arrastando={arrastando || undefined}
        role="slider"
        tabIndex={0}
        aria-labelledby={rotuloId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={valor}
        aria-valuetext={`${formatar(valor)} ${unidade}`}
        onPointerDown={aoApertar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onKeyDown={aoTeclar}
      >
        <span className="regua-escala" aria-hidden="true">
          {Array.from({ length: TRACOS }, (_, i) => (
            <span key={i} className="regua-marca" data-maior={i % 5 === 0 || undefined} />
          ))}
        </span>
        <span className="regua-feito" style={{ width: `${fracao * 100}%` }} aria-hidden="true" />
        <span className="regua-polegar" style={{ left: `${fracao * 100}%` }} aria-hidden="true" />
      </div>
    </div>
  );
}
