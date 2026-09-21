import React from 'react';

export function Select({ label, hint, error, disabled = false, state, options = [], placeholder, obrigatorio = false, id, className = '', ...rest }) {
  const cls = ['nv-campo', error ? 'nv-campo--erro' : '', disabled ? 'nv-campo--desabilitado' : ''].filter(Boolean).join(' ');
  const itens = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div className={cls}>
      {label ? (
        <label className="nv-campo__rotulo" htmlFor={id}>
          {label}
          {obrigatorio ? <span className="nv-campo__obrig" aria-hidden="true">*</span> : null}
          {obrigatorio ? <span className="nv-sr"> obrigatório</span> : null}
        </label>
      ) : null}
      <div className={'nv-campo__caixa' + (state === 'foco' ? ' nv-campo__caixa--foco' : '')}>
        <select id={id} className={('nv-campo__ctrl ' + className).trim()} disabled={disabled} required={obrigatorio || undefined} aria-invalid={error ? true : undefined} {...rest}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {itens.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="nv-campo__glifo" aria-hidden="true">▾</span>
      </div>
      {error ? <p className="nv-campo__erro"><i aria-hidden="true">×</i>{error}</p> : hint ? <p className="nv-campo__nota">{hint}</p> : null}
    </div>
  );
}
