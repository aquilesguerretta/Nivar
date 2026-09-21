import React from 'react';

const DENSIDADES = [
  { id: 'compacto', rotulo: 'compacto' },
  { id: 'confortavel', rotulo: 'confortável' },
];

export function DensityToggle({ value, onChange, target, className = '' }) {
  const [interno, setInterno] = React.useState(value || 'compacto');
  const atual = value === undefined ? interno : value;

  const set = (d) => {
    if (onChange) onChange(d);
    if (value === undefined) setInterno(d);
    if (target && typeof document !== 'undefined') {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) el.setAttribute('data-densidade', d);
    }
  };

  return (
    <div className={('nv-dens ' + className).trim()} role="group" aria-label="Densidade da tabela">
      <span className="nv-dens__rotulo">Linha</span>
      {DENSIDADES.map((d, i) => (
        <React.Fragment key={d.id}>
          {i > 0 ? <span className="nv-dens__sep" aria-hidden="true">·</span> : null}
          <button
            type="button"
            className={'nv-dens__op' + (atual === d.id ? ' nv-dens__op--ativo' : '')}
            aria-pressed={atual === d.id}
            onClick={() => set(d.id)}
          >{d.rotulo}</button>
        </React.Fragment>
      ))}
    </div>
  );
}
