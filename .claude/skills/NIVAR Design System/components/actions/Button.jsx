import React from 'react';

const VARIANTES = { primario: 'nv-btn--primario', secundario: 'nv-btn--secundario', terciario: 'nv-btn--terciario' };

export function Button({
  variant = 'secundario',
  size = 'padrao',
  glifo,
  state,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'nv-btn',
    VARIANTES[variant] || VARIANTES.secundario,
    size === 'compacto' ? 'nv-btn--compacto' : '',
    state === 'hover' ? 'nv-btn--is-hover' : '',
    state === 'press' ? 'nv-btn--is-press' : '',
    state === 'foco' ? 'nv-btn--is-foco' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={cls} disabled={disabled} {...rest}>
      {glifo ? <span className="nv-btn__glifo" aria-hidden="true">{glifo}</span> : null}
      {children}
    </button>
  );
}
