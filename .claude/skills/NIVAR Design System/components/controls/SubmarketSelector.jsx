import React from 'react';
import { SUBMERCADOS } from './submercados.js';

export function SubmarketSelector({
  valor,
  onChange,
  multiplo = false,
  rotulo = 'Submercado',
  familia = 'intelligence',
  sigla = false,
  desabilitados = [],
  className = '',
}) {
  const lista = multiplo ? (Array.isArray(valor) ? valor : []) : [valor];
  const ativo = (id) => lista.indexOf(id) !== -1;
  const escolher = (id) => {
    if (!onChange) return;
    if (!multiplo) return onChange(id);
    onChange(ativo(id) ? lista.filter((v) => v !== id) : lista.concat(id));
  };

  return (
    <div
      className={['nv-sub', className].filter(Boolean).join(' ')}
      style={{ '--sub-cor': 'var(--family-' + familia + ')' }}
      role="group"
      aria-label={rotulo}
    >
      {rotulo ? <span className="nv-sub__rotulo">{rotulo}</span> : null}
      <div className="nv-sub__ops">
        {SUBMERCADOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={'nv-sub__op' + (ativo(s.id) ? ' nv-sub__op--ativa' : '')}
            aria-pressed={multiplo ? ativo(s.id) : undefined}
            aria-current={!multiplo && ativo(s.id) ? 'true' : undefined}
            disabled={desabilitados.indexOf(s.id) !== -1}
            onClick={() => escolher(s.id)}
          >{sigla ? s.sigla : s.nome}</button>
        ))}
      </div>
    </div>
  );
}
