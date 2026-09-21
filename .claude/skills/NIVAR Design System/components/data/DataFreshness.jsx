import React from 'react';

const ROTULO = {
  vivo: 'ao vivo',
  desatualizado: 'desatualizado',
  ilustrativa: 'amostra ilustrativa',
};

export function DataFreshness({ estado = 'vivo', detalhe, ponto, className = '' }) {
  const rot = ROTULO[estado] || ROTULO.vivo;
  const mostraPonto = ponto === undefined ? estado === 'vivo' : ponto;

  return (
    <p className={['nv-frescor', 'nv-frescor--' + estado, className].filter(Boolean).join(' ')}>
      {mostraPonto ? <span className="nv-frescor__ponto" aria-hidden="true"></span> : null}
      <span className="nv-frescor__estado">{rot}</span>
      {detalhe ? <span className="nv-frescor__sep" aria-hidden="true">·</span> : null}
      {detalhe ? <span className="nv-frescor__detalhe">{detalhe}</span> : null}
    </p>
  );
}
