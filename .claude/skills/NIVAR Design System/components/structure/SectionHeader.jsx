import React from 'react';

export function SectionHeader({ numero, titulo, nota, grande = false, as = 'h2', className = '' }) {
  const T = as;
  const n = numero === undefined || numero === null ? null : String(numero).padStart(2, '0');
  return (
    <div className={['nv-sech', grande ? 'nv-sech--grande' : '', className].filter(Boolean).join(' ')}>
      {n ? <span className="nv-sech__n">{n}</span> : <span />}
      <T className="nv-sech__t">{titulo}</T>
      <span className="nv-sech__fio" />
      {nota ? <p className="nv-sech__nota">{nota}</p> : <span />}
    </div>
  );
}
