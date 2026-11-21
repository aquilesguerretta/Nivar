import React from 'react';

const MODOS = ['claro', 'noturno'];

export function ModeToggle({ value, onChange, target, className = '' }) {
  const [interno, setInterno] = React.useState(value || 'claro');
  const atual = value === undefined ? interno : value;

  const set = (m) => {
    if (onChange) onChange(m);
    if (value === undefined) setInterno(m);
    if (target === 'documento' && typeof document !== 'undefined') {
      const el = document.documentElement;
      if (m === 'noturno') el.setAttribute('data-mode', 'noturno');
      else el.removeAttribute('data-mode');
    }
  };

  return (
    <div className={('nv-modo ' + className).trim()} role="group" aria-label="Modo de exibição">
      {MODOS.map((m, i) => (
        <React.Fragment key={m}>
          {i > 0 ? <span className="nv-modo__sep" aria-hidden="true">·</span> : null}
          <button
            type="button"
            className={'nv-modo__op' + (atual === m ? ' nv-modo__op--ativo' : '')}
            aria-pressed={atual === m}
            onClick={() => set(m)}
          >{m}</button>
        </React.Fragment>
      ))}
    </div>
  );
}
