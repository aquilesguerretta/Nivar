import React from 'react';

function Envelope({ label, hint, error, disabled, state, obrigatorio, verificando, children, htmlFor }) {
  const cls = ['nv-campo', error ? 'nv-campo--erro' : '', disabled ? 'nv-campo--desabilitado' : '', verificando ? 'nv-campo--verificando' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {label ? (
        <label className="nv-campo__rotulo" htmlFor={htmlFor}>
          {label}
          {obrigatorio ? <span className="nv-campo__obrig" aria-hidden="true">*</span> : null}
          {obrigatorio ? <span className="nv-sr"> obrigatório</span> : null}
        </label>
      ) : null}
      <div className={'nv-campo__caixa' + (state === 'foco' ? ' nv-campo__caixa--foco' : '')}>
        {children}
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

export function Input({ label, hint, error, disabled = false, state, obrigatorio = false, verificando = false, id, className = '', ...rest }) {
  return (
    <Envelope label={label} hint={hint} error={error} disabled={disabled} state={state} obrigatorio={obrigatorio} verificando={verificando} htmlFor={id}>
      <input id={id} className={('nv-campo__ctrl ' + className).trim()} disabled={disabled} required={obrigatorio || undefined} aria-invalid={error ? true : undefined} {...rest} />
    </Envelope>
  );
}
