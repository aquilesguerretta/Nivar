import React from 'react';
import { formatarNumero } from '../data/formatar.js';

const FAMILIA = {
  intelligence: 'var(--family-intelligence)',
  advisory: 'var(--family-advisory)',
  software: 'var(--family-software)',
  academy: 'var(--family-academy)',
  hardware: 'var(--family-hardware)',
  alta: 'var(--data-alta)',
  baixa: 'var(--data-baixa)',
  atencao: 'var(--data-atencao)',
  neutro: 'var(--data-neutro)',
};

export function BarChart({
  data = [],
  width = 640,
  height = 200,
  casas = 0,
  unidade,
  titulo,
  legenda = false,
  className = '',
}) {
  const estreito = width < 380;
  const PL = estreito ? 40 : 52, PR = 10, PT = 18, PB = 32;
  const refs = estreito ? [0, 1] : [0, 0.5, 1];
  const max = Math.max(...data.map((d) => d.value), 1);
  const larguraUtil = width - PL - PR;
  const passo = larguraUtil / Math.max(1, data.length);
  const largura = Math.max(6, passo - (estreito ? 9 : 14));
  const base = height - PB;
  const alturaUtil = base - PT;
  const cor = (d) => FAMILIA[d.cor] || d.cor || 'var(--serie-linha)';

  return (
    <div className={className}>
      {titulo ? (
        <div className="nv-graf-cab">
          <span className="nv-graf-cab__t">{titulo}{unidade ? <span className="nv-glos__sigla">{unidade}</span> : null}</span>
        </div>
      ) : null}

      <svg className="nv-graf" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={titulo || 'Comparação'}>
        {refs.map((f) => (
          <g key={f}>
            <line className="nv-graf__ref" x1={PL} y1={base - f * alturaUtil} x2={width - PR} y2={base - f * alturaUtil} />
            <text className="nv-graf__tick" x={PL - 8} y={base - f * alturaUtil + 3.5} textAnchor="end">{formatarNumero(max * f, casas)}</text>
          </g>
        ))}
        <line className="nv-graf__eixo" x1={PL} y1={base} x2={width - PR} y2={base} />
        {data.map((d, i) => {
          const h = (d.value / max) * alturaUtil;
          const x = PL + i * passo + (passo - largura) / 2;
          return (
            <g key={d.label}>
              <rect className="nv-barra__ret" x={x} y={base - h} width={largura} height={h} fill={cor(d)} />
              <text className="nv-graf__tick nv-graf__tick--forte" x={x + largura / 2} y={base - h - 6} textAnchor="middle">{formatarNumero(d.value, casas)}</text>
              <text className="nv-graf__tick" x={x + largura / 2} y={base + 14} textAnchor="middle">{d.label}</text>
            </g>
          );
        })}
      </svg>

      {legenda ? (
        <p className="nv-graf__legenda">
          {data.map((d) => <span key={d.label}><i style={{ background: cor(d) }} />{d.legenda || d.label}</span>)}
        </p>
      ) : null}
    </div>
  );
}
