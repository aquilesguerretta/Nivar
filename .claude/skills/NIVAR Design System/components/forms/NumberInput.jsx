import React from 'react';

export function NumberInput({ label, hint, error, disabled = false, state, unidade, obrigatorio = false, verificando = false, id, className = '', ...rest }) {
  const cls = ['nv-campo', error ? 'nv-campo--erro' : '', disabled ? 'nv-campo--desabilitado' : '', verificando ? 'nv-campo--verificando' : ''].filter(Boolean).join(' ');
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
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={('nv-campo__ctrl nv-campo__ctrl--num ' + className).trim()}
          disabled={disabled}
          required={obrigatorio || undefined}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        {unidade ? <span className="nv-campo__unid">{unidade}</span> : null}
        {verificando ? <span className="nv-campo__tracado" aria-hidden="true"></span> : null}
      </div>
      {error
        ? <p className="nv-campo__erro"><i aria-hidden="true">×</i>{error}</p>
        : verificando
          ? <p className="nv-campo__verifica" role="status">verificando</p>
          : hint ? <p className="nv-campo__nota">{hint}</p> : null}
    </div>
  );
}
