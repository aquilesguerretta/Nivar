import React from 'react';
import { formatarNumero, classeDirecao } from './formatar.js';

const FAMILIA = {
  intelligence: 'var(--family-intelligence)',
  advisory: 'var(--family-advisory)',
  software: 'var(--family-software)',
  academy: 'var(--family-academy)',
  hardware: 'var(--family-hardware)',
};

export function DataCardGrid({ columns = 4, children, className = '' }) {
  return (
    <div className={('nv-cardgrid ' + className).trim()} style={{ '--cols-desktop': columns }}>
      {children}
    </div>
  );
}

export function DataCard({ etiqueta, valor, casas = 2, unidade, delta, deltaSufixo = ' %', nota, familia, solto = false, className = '' }) {
  const cls = ['nv-card', solto ? 'nv-card--solto' : '', className].filter(Boolean).join(' ');
  const temDelta = delta !== undefined && delta !== null && delta !== '';
  const n = Number(delta);
  const sinal = n > 0 ? '+' : n < 0 ? '\u2212' : '';
  return (
    <div className={cls}>
      {familia ? <div className="nv-card__familia" style={{ background: FAMILIA[familia] || familia }} /> : null}
      {etiqueta ? <span className="nv-card__etiqueta">{etiqueta}</span> : null}
      <span className="nv-card__valor">{typeof valor === 'number' ? formatarNumero(valor, casas) : valor}</span>
      {unidade || temDelta ? (
        <div className="nv-card__meta">
          {unidade ? <span className="nv-card__unid">{unidade}</span> : null}
          {temDelta ? <span className={'nv-card__delta ' + classeDirecao(delta)}>{sinal + formatarNumero(Math.abs(n), 1) + deltaSufixo}</span> : null}
        </div>
      ) : null}
      {nota ? <p className="nv-card__nota">{nota}</p> : null}
    </div>
  );
}
