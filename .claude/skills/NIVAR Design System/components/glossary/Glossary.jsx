import React from 'react';
import { TERMOS } from './termos.js';

export function Glossary({ termos, compacto = false, className = '' }) {
  const lista = (termos && termos.length ? termos : TERMOS)
    .slice()
    .sort((a, b) => a.termo.localeCompare(b.termo, 'pt-BR', { sensitivity: 'base' }));

  return (
    <dl className={['nv-glos', compacto ? 'nv-glos--compacto' : '', className].filter(Boolean).join(' ')}>
      {lista.map((t) => (
        <div className="nv-glos__item" key={t.termo}>
          <dt className="nv-glos__termo">{t.termo}{t.sigla ? <span className="nv-glos__sigla">{t.sigla}</span> : null}</dt>
          <dd className="nv-glos__def">{t.definicao}</dd>
        </div>
      ))}
    </dl>
  );
}
