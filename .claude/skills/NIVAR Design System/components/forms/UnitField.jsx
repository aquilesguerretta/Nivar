import React from 'react';

export function UnitField({
  label,
  hint,
  error,
  prefixo,
  sufixo,
  obrigatorio = false,
  verificando = false,
  disabled = false,
  state,
  numerico = true,
  id,
  className = '',
  ...rest
}) {
  const cls = [
    'nv-campo',
    error ? 'nv-campo--erro' : '',
    disabled ? 'nv-campo--desabilitado' : '',
    verificando ? 'nv-campo--verificando' : '',
  ].filter(Boolean).join(' ');

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
        {prefixo ? <span className="nv-campo__afixo nv-campo__afixo--pre" aria-hidden="true">{prefixo}</span> : null}
        <input
          id={id}
          type="text"
          inputMode={numerico ? 'decimal' : undefined}
          className={('nv-campo__ctrl' + (numerico ? ' nv-campo__ctrl--num' : '') + ' ' + className).trim()}
          disabled={disabled}
          required={obrigatorio || undefined}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        {sufixo ? <span className="nv-campo__afixo nv-campo__afixo--suf" aria-hidden="true">{sufixo}</span> : null}
        {verificando ? <span className="nv-campo__tracado" aria-hidden="true"></span> : null}
      </div>
      {error ? (
        <p className="nv-campo__erro"><i aria-hidden="true">×</i>{error}</p>
      ) : verificando ? (
        <p className="nv-campo__verifica" role="status">verificando</p>
      ) : hint ? <p className="nv-campo__nota">{hint}</p> : null}
    </div>
  );
}
