import React from 'react';

export function SkipLink({ href = '#conteudo', children = 'Pular para o conteúdo', visivel = false, className = '' }) {
  return (
    <a
      className={['nv-pular', visivel ? 'nv-pular--visivel' : '', className].filter(Boolean).join(' ')}
      href={href}
    >{children}</a>
  );
}
