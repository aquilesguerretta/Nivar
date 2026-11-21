import React from 'react';

export function SampleSeal({
  rotulo = 'amostra ilustrativa',
  variant = 'canto',
  posicao = 'topo-direita',
  children,
  className = '',
}) {
  return (
    <div
      className={[
        'nv-selo-area',
        variant === 'diagonal' ? 'nv-selo-area--diagonal' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
      <span className={'nv-selo nv-selo--' + posicao}>{rotulo}</span>
    </div>
  );
}
