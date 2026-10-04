import React from 'react';

export function Provenance({
  fontes = [],
  recorte,
  timestamp,
  ilustrativa = false,
  rotulo = 'Fonte:',
  fio = true,
  className = '',
}) {
  const partes = [];
  if (recorte) partes.push(recorte);
  if (timestamp) partes.push(timestamp);
  if (ilustrativa) partes.push('__ilustrativa__');

  return (
    <p className={['nv-proc', fio ? 'nv-proc--fio' : '', className].filter(Boolean).join(' ')}>
      {fontes.length ? <span className="nv-proc__rotulo">{rotulo}</span> : null}
      {fontes.map((f, i) => (
        <React.Fragment key={f}>
          {i > 0 ? <span className="nv-proc__sep" aria-hidden="true">·</span> : null}
          <span>{f}</span>
        </React.Fragment>
      ))}
      {partes.map((p) => (
        <React.Fragment key={p}>
          <span className="nv-proc__sep" aria-hidden="true">·</span>
          {p === '__ilustrativa__'
            ? <span className="nv-proc__ilustrativa">amostra ilustrativa</span>
            : <span>{p}</span>}
        </React.Fragment>
      ))}
    </p>
  );
}
