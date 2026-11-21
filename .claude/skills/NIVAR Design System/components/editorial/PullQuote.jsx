import React from 'react';

export function PullQuote({
  numero,
  unidade,
  texto,
  fonte,
  familia = 'intelligence',
  children,
  className = '',
}) {
  return (
    <blockquote
      className={['nv-citacao', className].filter(Boolean).join(' ')}
      style={{ '--citacao-cor': 'var(--family-' + familia + ')' }}
    >
      {numero !== undefined && numero !== null ? (
        <span className="nv-citacao__numero">
          <span className="nv-citacao__n">{numero}</span>
          {unidade ? <span className="nv-citacao__un">{unidade}</span> : null}
        </span>
      ) : null}
      <p className="nv-citacao__texto">{texto || children}</p>
      {fonte ? <footer className="nv-citacao__fonte">{fonte}</footer> : null}
    </blockquote>
  );
}
