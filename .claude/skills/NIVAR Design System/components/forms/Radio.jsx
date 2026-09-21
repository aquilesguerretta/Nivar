import React from 'react';

export function Radio({
  label,
  nota,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  state,
  id,
  name,
  value,
  className = '',
}) {
  const cls = [
    'nv-escolha',
    disabled ? 'nv-escolha--desabilitado' : '',
    state === 'hover' ? 'nv-escolha--is-hover' : '',
    state === 'foco' ? 'nv-escolha--is-foco' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={cls} htmlFor={id}>
      <input
        id={id}
        type="radio"
        className="nv-escolha__ctrl"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className="nv-escolha__marca nv-escolha__marca--circulo" aria-hidden="true"></span>
      <span className="nv-escolha__texto">
        {label}
        {nota ? <span className="nv-escolha__nota">{nota}</span> : null}
      </span>
    </label>
  );
}
