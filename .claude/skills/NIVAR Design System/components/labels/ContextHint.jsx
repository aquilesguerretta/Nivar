import React from 'react';
import { TERMOS } from '../glossary/termos.js';

export function ContextHint({ termo, definicao, fonte, aberta = false, children, className = '' }) {
  const chave = (termo || '').toLowerCase();
  const verbete = TERMOS.find((t) => t.termo.toLowerCase() === chave);
  const def = definicao || (verbete ? verbete.definicao : null);
  const proc = fonte !== undefined ? fonte : verbete && verbete.fonte;

  return (
    <span className={['nv-dica', aberta ? 'nv-dica--aberta' : '', className].filter(Boolean).join(' ')}>
      <button type="button" className="nv-dica__termo" aria-describedby={'dica-' + chave}>{children || termo}</button>
      <span className="nv-dica__painel" id={'dica-' + chave} role="tooltip">
        <b className="nv-dica__termo-def">{termo}</b>
        <span className="nv-dica__def">{def}</span>
        {proc ? <span className="nv-dica__fonte">{proc}</span> : null}
      </span>
    </span>
  );
}
