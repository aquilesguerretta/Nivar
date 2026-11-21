import React from 'react';

export function Toast({ mensagem, timestamp, duracao = 5000, advisory = false, onDispensar, className = '' }) {
  const [visivel, setVisivel] = React.useState(true);

  React.useEffect(() => {
    if (!duracao) return undefined;
    const t = setTimeout(() => { setVisivel(false); if (onDispensar) onDispensar(); }, duracao);
    return () => clearTimeout(t);
  }, [duracao, onDispensar]);

  if (!visivel) return null;

  return (
    <div className={['nv-aviso', advisory ? 'nv-aviso--advisory' : '', className].filter(Boolean).join(' ')} role="status" aria-live="polite">
      <span className="nv-aviso__texto">{mensagem}</span>
      <span className="nv-aviso__meta">
        {timestamp ? <span>{timestamp}</span> : null}
        <button type="button" className="nv-aviso__fechar" aria-label="Dispensar" onClick={() => { setVisivel(false); if (onDispensar) onDispensar(); }}>×</button>
      </span>
    </div>
  );
}
