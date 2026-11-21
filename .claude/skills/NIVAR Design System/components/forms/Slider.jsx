import React from 'react';
import { formatarNumero } from '../data/formatar.js';

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  unidade,
  casas = 0,
  disabled = false,
  marcas = true,
  leitura = true,
  id,
  className = '',
}) {
  const [interno, setInterno] = React.useState(defaultValue !== undefined ? defaultValue : min);
  const v = value === undefined ? interno : value;
  const pct = max === min ? 0 : ((Number(v) - min) / (max - min)) * 100;

  const mudar = (e) => {
    const n = Number(e.target.value);
    if (value === undefined) setInterno(n);
    if (onChange) onChange(n);
  };

  return (
    <div
      className={['nv-desl', disabled ? 'nv-desl--desabilitado' : '', className].filter(Boolean).join(' ')}
      style={{ '--desl-pct': pct + '%' }}
    >
      {label || leitura ? (
        <div className="nv-desl__cab">
          {label ? <label className="nv-desl__rotulo" htmlFor={id}>{label}</label> : <span></span>}
          {leitura ? (
            <span className="nv-desl__leitura">
              {formatarNumero(Number(v), casas)}
              {unidade ? <span className="nv-desl__unid">{unidade}</span> : null}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="nv-desl__trilho">
        <input
          id={id}
          type="range"
          className="nv-desl__ctrl"
          min={min}
          max={max}
          step={step}
          value={v}
          disabled={disabled}
          onChange={mudar}
        />
        <span className="nv-desl__pista" aria-hidden="true">
          <span className="nv-desl__preenchido"></span>
          <span className="nv-desl__alca"></span>
        </span>
      </div>
      {marcas ? (
        <div className="nv-desl__marcas">
          <span>{formatarNumero(min, casas)}</span>
          <span>{formatarNumero(max, casas)}</span>
        </div>
      ) : null}
    </div>
  );
}
