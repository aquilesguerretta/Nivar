import React from 'react';

/**
 * Linha de campos + aplicar/limpar. Cada campo mantém o próprio fio de 1px;
 * a barra NÃO recebe container ao redor do conjunto.
 */
export function FilterBar({ children, acoes, resumo, className = '' }) {
  return (
    <div className={('nv-filtro ' + className).trim()} role="search">
      {React.Children.map(children, (filho, i) => (
        <div className="nv-filtro__campo" key={i}>{filho}</div>
      ))}
      {acoes ? <div className="nv-filtro__acoes">{acoes}</div> : null}
      {resumo && resumo.length ? (
        <p className="nv-filtro__resumo">
          <b>Filtro ativo:</b>
          {resumo.map((t, i) => (
            <React.Fragment key={t}>{i > 0 ? <i aria-hidden="true">·</i> : null}<span>{t}</span></React.Fragment>
          ))}
        </p>
      ) : null}
    </div>
  );
}
