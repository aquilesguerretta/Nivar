import React from 'react';

export function LabeledDivider({
  children,
  rotulo,
  alinhamento = 'centro',
  forte = false,
  className = '',
}) {
  return (
    <div
      className={[
        'nv-divisor',
        'nv-divisor--' + alinhamento,
        forte ? 'nv-divisor--forte' : '',
        className,
      ].filter(Boolean).join(' ')}
      role="separator"
    >
      <span className="nv-divisor__fio" aria-hidden="true"></span>
      <span className="nv-divisor__rotulo">{rotulo || children}</span>
      <span className="nv-divisor__fio" aria-hidden="true"></span>
    </div>
  );
}
