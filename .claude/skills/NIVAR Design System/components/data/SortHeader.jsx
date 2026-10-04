import React from 'react';

const GLIFO = { neutro: '↕', asc: '↑', desc: '↓' };
const ARIA = { neutro: 'none', asc: 'ascending', desc: 'descending' };
const PROXIMO = { neutro: 'asc', asc: 'desc', desc: 'asc' };

export function SortHeader({
  children,
  ordem = 'neutro',
  onSort,
  numerico = false,
  campo,
  state,
  className = '',
}) {
  const ativo = ordem === 'asc' || ordem === 'desc';
  return (
    <th
      className={['nv-ord', numerico ? 'nv-num' : '', ativo ? 'nv-ord--ativa' : '', className].filter(Boolean).join(' ')}
      aria-sort={ARIA[ordem]}
      scope="col"
    >
      <button
        type="button"
        className={'nv-ord__b' + (state === 'hover' ? ' nv-ord__b--is-hover' : '')}
        onClick={() => onSort && onSort(campo, PROXIMO[ordem])}
      >
        <span className="nv-ord__rot">{children}</span>
        <span className="nv-ord__marca" aria-hidden="true">{GLIFO[ordem] || GLIFO.neutro}</span>
      </button>
    </th>
  );
}
