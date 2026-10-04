import React from 'react';

const PADRAO = {
  'falha-carregamento': {
    eti: 'Falha de carregamento',
    titulo: 'A série não foi carregada.',
    corpo: 'A requisição à fonte expirou antes de retornar. O dado exibido abaixo permanece o da última apuração bem-sucedida.',
    fonte: 'ONS · carga verificada',
    ultimaApuracao: '2026-08-04 · 11:00 BRT',
  },
  'dado-desatualizado': {
    eti: 'Fora do ciclo corrente',
    titulo: 'O ciclo de agosto não foi publicado.',
    corpo: 'A fonte respondeu, mas o ciclo corrente ainda não consta na publicação. Exibindo a apuração anterior, marcada como tal em todo lugar onde aparece.',
    fonte: 'CCEE · contabilização mensal',
    ultimaApuracao: '2026-07-31 · 23:00 BRT',
  },
  'fonte-indisponivel': {
    eti: 'Fonte indisponível',
    titulo: 'A fonte está em manutenção programada.',
    corpo: 'A indisponibilidade é da origem, não da leitura. Nenhum valor foi estimado, interpolado ou substituído.',
    fonte: 'ANEEL · tarifas homologadas',
    ultimaApuracao: '2026-08-03 · 06:00 BRT',
  },
};

export function ErrorState({ variant = 'falha-carregamento', titulo, corpo, eti, fonte, ultimaApuracao, acoes, className = '' }) {
  const d = PADRAO[variant] || PADRAO['falha-carregamento'];
  return (
    <div className={['nv-erro', className].filter(Boolean).join(' ')} role="alert" data-variant={variant}>
      <span className="nv-erro__eti"><i aria-hidden="true" style={{ fontStyle: 'normal' }}>△</i>{eti || d.eti}</span>
      <h3 className="nv-erro__titulo">{titulo || d.titulo}</h3>
      <p className="nv-erro__corpo">{corpo || d.corpo}</p>
      <p className="nv-erro__linha"><span className="nv-erro__k">Fonte que falhou</span><span className="nv-erro__fio" /><span className="nv-erro__v">{fonte || d.fonte}</span></p>
      <p className="nv-erro__linha"><span className="nv-erro__k">Última apuração bem-sucedida</span><span className="nv-erro__fio" /><span className="nv-erro__v">{ultimaApuracao || d.ultimaApuracao}</span></p>
      {acoes ? <div className="nv-erro__acoes">{acoes}</div> : null}
    </div>
  );
}
