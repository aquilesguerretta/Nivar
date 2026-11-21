import React from 'react';

const FAMILIA = {
  intelligence: 'var(--family-intelligence)',
  advisory: 'var(--family-advisory)',
  software: 'var(--family-software)',
  academy: 'var(--family-academy)',
  hardware: 'var(--family-hardware)',
};

export function Tabs({ items = [], value, onChange, familia, stateHover, className = '' }) {
  const itens = items.map((i) => (typeof i === 'string' ? { value: i, label: i } : i));
  const [interno, setInterno] = React.useState(value || (itens[0] && itens[0].value));
  const atual = value === undefined ? interno : value;
  const cor = familia ? FAMILIA[familia] || familia : undefined;

  const ir = (v) => { if (onChange) onChange(v); if (value === undefined) setInterno(v); };

  return (
    <div className={('nv-abas ' + className).trim()} role="tablist" style={cor ? { '--aba-cor': cor } : undefined}>
      {itens.map((i) => (
        <button
          key={i.value}
          type="button"
          role="tab"
          aria-selected={atual === i.value}
          disabled={i.disabled}
          className={[
            'nv-abas__item',
            atual === i.value ? 'nv-abas__item--ativa' : '',
            stateHover === i.value ? 'nv-abas__item--is-hover' : '',
          ].filter(Boolean).join(' ')}
          onClick={() => ir(i.value)}
        >{i.label}</button>
      ))}
    </div>
  );
}
