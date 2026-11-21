import React from 'react';

export function ConfirmDialog({
  eti = 'Confirmação',
  titulo,
  texto,
  detalhes = [],
  critico = false,
  acoes,
  className = '',
}) {
  return (
    <div className={['nv-dialogo', critico ? 'nv-dialogo--critico' : '', className].filter(Boolean).join(' ')} role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="nv-dialogo__cab">
        <h2 className="nv-dialogo__titulo">{titulo}</h2>
        <span className="nv-dialogo__eti">{eti}</span>
      </div>
      <div className="nv-dialogo__corpo">
        {texto ? <p className="nv-dialogo__texto">{texto}</p> : null}
        {detalhes.map((d) => (
          <p className="nv-dialogo__linha" key={d.k}>
            <span className="nv-dialogo__k">{d.k}</span>
            <span className="nv-dialogo__fio" />
            <span className="nv-dialogo__v">{d.v}</span>
          </p>
        ))}
      </div>
      {acoes ? <div className="nv-dialogo__rodape">{acoes}</div> : null}
    </div>
  );
}
