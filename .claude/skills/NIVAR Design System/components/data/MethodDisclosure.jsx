import React from 'react';

const ORDEM = [
  ['metodo', 'Método de cálculo', false],
  ['fonte', 'Fonte exata do dado', true],
  ['metodoPublicadoEm', 'Método publicado em', true],
  ['dadoColetadoEm', 'Dado coletado em', true],
];

export function MethodDisclosure({
  gatilho = 'Como este número é calculado',
  metodo,
  fonte,
  metodoPublicadoEm,
  dadoColetadoEm,
  premissas = [],
  href = '#',
  hrefRotulo = 'Metodologia completa',
  nota = 'O método é publicado antes da coleta. A ordem das duas datas é verificável.',
  aberta,
  onToggle,
  id = 'metodo',
  fio = false,
  children,
  className = '',
}) {
  const [interno, setInterno] = React.useState(false);
  const controlado = aberta !== undefined;
  const aberto = controlado ? aberta : interno;
  const alternar = () => (controlado ? onToggle && onToggle(!aberta) : setInterno((v) => !v));
  const valores = { metodo, fonte, metodoPublicadoEm, dadoColetadoEm };
  const painelId = id + '-painel';

  return (
    <div className={['nv-metodo', fio ? 'nv-metodo--fio' : '', className].filter(Boolean).join(' ')}>
      <div className="nv-metodo__ancora">
        {children}
        <button
          type="button"
          className="nv-metodo__gatilho"
          aria-expanded={aberto}
          aria-controls={painelId}
          onClick={alternar}
        >{gatilho}</button>
      </div>
      {aberto ? (
        <div className="nv-metodo__painel" id={painelId}>
          <svg className="nv-metodo__fio-desenho" viewBox="0 0 1000 1" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="0.5" x2="1000" y2="0.5" />
          </svg>
          <div className="nv-metodo__corpo">
            {ORDEM.filter(([chave]) => valores[chave]).map(([chave, rot, mono]) => (
              <div className="nv-metodo__linha" key={chave}>
                <span className="nv-metodo__rot">{rot}</span>
                <p className={'nv-metodo__v' + (mono ? ' nv-metodo__v--dado' : '')}>{valores[chave]}</p>
              </div>
            ))}
            {premissas.length ? (
              <div className="nv-metodo__linha">
                <span className="nv-metodo__rot">Premissas assumidas</span>
                <ul className="nv-metodo__premissas">
                  {premissas.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
          {nota ? <p className="nv-metodo__nota">{nota}</p> : null}
          <a className="nv-metodo__link" href={href}>{hrefRotulo}<span aria-hidden="true"> →</span></a>
        </div>
      ) : null}
    </div>
  );
}
