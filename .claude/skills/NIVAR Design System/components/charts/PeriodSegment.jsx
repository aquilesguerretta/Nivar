import React from 'react';

export const PERIODOS = [
  { id: '1d', rotulo: '1D', titulo: 'um dia' },
  { id: '1s', rotulo: '1S', titulo: 'uma semana' },
  { id: '1m', rotulo: '1M', titulo: 'um mês' },
  { id: '1a', rotulo: '1A', titulo: 'um ano' },
  { id: 'max', rotulo: 'MÁX', titulo: 'série completa' },
];

export function PeriodSegment({
  value,
  onChange,
  opcoes = PERIODOS,
  desabilitados = [],
  rotulo = 'Período',
  className = '',
}) {
  const [interno, setInterno] = React.useState(value || opcoes[2].id);
  const atual = value === undefined ? interno : value;
  const set = (id) => {
    if (onChange) onChange(id);
    if (value === undefined) setInterno(id);
  };

  return (
    <div className={('nv-per ' + className).trim()} role="group" aria-label={rotulo}>
      {opcoes.map((o, i) => (
        <React.Fragment key={o.id}>
          {i > 0 ? <span className="nv-per__sep" aria-hidden="true">·</span> : null}
          <button
            type="button"
            className={'nv-per__op' + (atual === o.id ? ' nv-per__op--ativo' : '')}
            aria-pressed={atual === o.id}
            title={o.titulo}
            disabled={desabilitados.indexOf(o.id) !== -1}
            onClick={() => set(o.id)}
          >{o.rotulo}</button>
        </React.Fragment>
      ))}
    </div>
  );
}
