import React from 'react';

const FAMILIA_NOME = {
  intelligence: 'Intelligence',
  advisory: 'Advisory',
  software: 'Software',
  academy: 'Academy',
  hardware: 'Hardware',
};

export function PublicationList({ children, className = '' }) {
  return <ol className={['nv-publista', className].filter(Boolean).join(' ')}>{children}</ol>;
}

export function PublicationCard({
  familia = 'intelligence',
  tipo,
  titulo,
  resumo,
  data,
  leitura,
  href = '#',
  className = '',
}) {
  return (
    <li className={['nv-pub', className].filter(Boolean).join(' ')}>
      <span className="nv-pub__fam">
        <i className="nv-pub__ponto" style={{ background: 'var(--family-' + familia + ')' }} aria-hidden="true"></i>
        {FAMILIA_NOME[familia] || familia}
      </span>
      <div className="nv-pub__corpo">
        <h3 className="nv-pub__titulo"><a className="nv-pub__link" href={href}>{titulo}</a></h3>
        {resumo ? <p className="nv-pub__resumo">{resumo}</p> : null}
      </div>
      <div className="nv-pub__meta">
        {tipo ? <span className="nv-pub__tipo">{tipo}</span> : null}
        <span className="nv-pub__quando">
          {data}
          {leitura ? <span className="nv-pub__sep" aria-hidden="true"> · </span> : null}
          {leitura || null}
        </span>
      </div>
    </li>
  );
}
