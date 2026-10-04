import React from 'react';
import { formatarNumero, classeDirecao } from '../data/formatar.js';

function escala(min, max, tamanho, margemA, margemB) {
  const span = max - min || 1;
  return (v) => margemA + (1 - (v - min) / span) * (tamanho - margemA - margemB);
}

export function TimeSeriesChart({
  serie = [],
  width = 640,
  height = 200,
  unidade,
  titulo,
  ticksX = 4,
  ticksY = 3,
  className = '',
}) {
  const estreito = width < 380, medio = width < 480;
  const PL = estreito ? 40 : 52, PR = 10, PT = 10, PB = 24;
  const tY = Math.max(2, estreito ? Math.min(ticksY, 2) : medio ? Math.min(ticksY, 3) : ticksY);
  const tX = Math.max(2, estreito ? 2 : medio ? Math.min(ticksX, 3) : ticksX);
  const ys = serie.map((p) => p.y);
  const min = Math.min(...ys, 0);
  const max = Math.max(...ys, 1);
  const passo = (max - min) / (tY - 1 || 1);
  const linhas = Array.from({ length: tY }, (_, i) => min + i * passo);

  const px = (i) => PL + (i / Math.max(1, serie.length - 1)) * (width - PL - PR);
  const py = escala(min, max, height, PT, PB);

  const d = serie.map((p, i) => (i === 0 ? 'M' : 'L') + px(i).toFixed(1) + ' ' + py(p.y).toFixed(1)).join(' ');
  const ultimo = serie[serie.length - 1];
  const penultimo = serie[serie.length - 2];
  const delta = ultimo && penultimo && penultimo.y ? ((ultimo.y - penultimo.y) / penultimo.y) * 100 : 0;
  const passoX = tX;
  const indicesX = serie.length <= 1
    ? [0]
    : [...new Set(Array.from({ length: passoX }, (_, k) => Math.round((k * (serie.length - 1)) / (passoX - 1))))];

  return (
    <div className={className}>
      {titulo ? (
        <div className="nv-graf-cab">
          <span className="nv-graf-cab__t">{titulo}{unidade ? <span className="nv-glos__sigla">{unidade}</span> : null}</span>
          {ultimo ? (
            <span className="nv-graf-cab__v">
              <span className="nv-graf-cab__num">{formatarNumero(ultimo.y, 2)}</span>
              <span className={'nv-graf-cab__delta ' + classeDirecao(delta)}>{(delta > 0 ? '+' : delta < 0 ? '\u2212' : '') + formatarNumero(Math.abs(delta), 1)} %</span>
            </span>
          ) : null}
        </div>
      ) : null}

      <svg className="nv-graf" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={titulo || 'Série temporal'}>
        {linhas.map((v, i) => (
          <g key={i}>
            <line className="nv-graf__ref" x1={PL} y1={py(v)} x2={width - PR} y2={py(v)} />
            <text className="nv-graf__tick" x={PL - 8} y={py(v) + 3.5} textAnchor="end">{formatarNumero(v, 0)}</text>
          </g>
        ))}
        <line className="nv-graf__eixo" x1={PL} y1={height - PB} x2={width - PR} y2={height - PB} />
        <path className="nv-serie__linha" d={d} />
        {ultimo ? <circle className="nv-serie__ponto" cx={px(serie.length - 1)} cy={py(ultimo.y)} r="3.5" style={{ fill: delta > 0 ? 'var(--data-alta)' : delta < 0 ? 'var(--data-baixa)' : 'var(--data-neutro)' }} /> : null}
        {indicesX.map((i) => (
          <text key={'x' + i} className="nv-graf__tick" x={px(i)} y={height - PB + 14} textAnchor={i === 0 ? 'start' : i === serie.length - 1 ? 'end' : 'middle'}>{serie[i].x}</text>
        ))}
      </svg>
    </div>
  );
}
