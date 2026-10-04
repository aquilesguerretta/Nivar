import React from 'react';

const FAMILIA = {
  intelligence: 'var(--family-intelligence)',
  advisory: 'var(--family-advisory)',
  software: 'var(--family-software)',
  academy: 'var(--family-academy)',
  hardware: 'var(--family-hardware)',
};

export function Tag({ variant = 'neutro', familia, ponto = false, children, className = '' }) {
  const v = familia ? 'familia' : variant;
  const cor = familia ? FAMILIA[familia] || familia : null;
  return (
    <span
      className={['nv-tag', 'nv-tag--' + v, className].filter(Boolean).join(' ')}
      style={cor ? { borderColor: cor } : undefined}
    >
      {ponto && cor ? <i className="nv-tag__ponto" style={{ background: cor }} /> : null}
      {children || familia}
    </span>
  );
}
