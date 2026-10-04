import React from 'react';

const PADRAO = {
  'sem-dado': {
    eti: 'Sem apuração',
    titulo: 'A série existe. O ciclo ainda não fechou.',
    corpo: 'Carga verificada por submercado é apurada ao fim de cada ciclo mensal. O ciclo corrente fecha em 2026-08-08.',
    meta: 'Próxima apuração · 2026-08-08 · 23:00 BRT',
  },
  'sem-resultado': {
    eti: 'Sem resultado',
    titulo: 'Nenhum submercado atende ao filtro.',
    corpo: 'Quatro submercados foram avaliados. O recorte de preço exclui todos.',
  },
  'sem-permissao': {
    eti: 'Sem permissão',
    titulo: 'O dado existe. O acesso não foi concedido.',
    corpo: 'Contratos bilaterais registrados na CCEE estão apurados e disponíveis no plano da conta. A concessão é feita pelo administrador.',
  },
};

export function EmptyState({
  variant = 'sem-dado',
  titulo,
  corpo,
  eti,
  meta,
  filtros = ['PLD acima de R$ 900,00', 'Submercado Sul', 'Ciclo 2026-08'],
  conjunto = 'ccee.contratos_bilaterais',
  concessor = 'Administrador da conta',
  acoes,
  className = '',
}) {
  const d = PADRAO[variant] || PADRAO['sem-dado'];
  return (
    <div className={['nv-est', className].filter(Boolean).join(' ')} data-variant={variant}>
      <span className="nv-est__eti">{eti || d.eti}</span>

      {variant === 'sem-dado' ? (
        <div className="nv-est__eixo" aria-hidden="true"><span /><span /><span /><span /></div>
      ) : null}

      <h3 className="nv-est__titulo">{titulo || d.titulo}</h3>
      <p className="nv-est__corpo">{corpo || d.corpo}</p>

      {variant === 'sem-resultado' ? (
        <p className="nv-est__filtro"><b>Filtro ativo:</b>{filtros.map((f, i) => (
          <React.Fragment key={f}>{i > 0 ? <i aria-hidden="true">·</i> : null}<span>{f}</span></React.Fragment>
        ))}</p>
      ) : null}

      {variant === 'sem-permissao' ? (
        <div className="nv-est__conjunto"><span>{conjunto}</span><em>{concessor}</em></div>
      ) : null}

      {meta || d.meta ? <span className="nv-est__meta">{meta || d.meta}</span> : null}
      {acoes ? <div className="nv-est__acoes">{acoes}</div> : null}
    </div>
  );
}
