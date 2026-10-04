import React from 'react';

export function Shortcut({ teclas, children, className = '' }) {
  const lista = teclas || (typeof children === 'string' ? children.split('+') : []);
  return (
    <span className={('nv-atalho ' + className).trim()}>
      {lista.length
        ? lista.map((t, i) => (
            <React.Fragment key={t + i}>
              {i > 0 ? <span className="nv-atalho__mais" aria-hidden="true">+</span> : null}
              <kbd className="nv-atalho__t">{t}</kbd>
            </React.Fragment>
          ))
        : <kbd className="nv-atalho__t">{children}</kbd>}
    </span>
  );
}

export function RecentMarker({ variant = 'novo', rotulo, className = '' }) {
  const texto = rotulo || (variant === 'atualizado' ? 'atualizado' : 'novo');
  return <span className={['nv-recente', 'nv-recente--' + variant, className].filter(Boolean).join(' ')}>{texto}</span>;
}
