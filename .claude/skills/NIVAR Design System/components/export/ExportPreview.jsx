import React from 'react';
import { Button } from '../actions/Button.jsx';

const PATHS = [
  ['M22 112 C22 80 22 50 22 18 C54 40 60 92 108 112 C108 80 108 50 108 18', 16],
  ['M140 32 L140 112', 13],
  ['M170 32 L200 112 L230 32', 13],
  ['M254 112 L284 32 L314 112', 13],
  ['M342 112 L342 32', 13],
  ['M342 32 C378 32 394 44 386 56 C378 68 362 64 342 64', 13],
  ['M370 62 C382 80 390 96 398 112', 13],
];

function Wordmark({ tratamento, largura = 112 }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const gid = 'inc-' + uid;
  const traco = tratamento === 'mono' ? '#14120F' : 'url(#' + gid + ')';
  return (
    <svg className="nv-export__marca" viewBox="0 0 425 140" width={largura} height={largura * (140 / 425)} role="img" aria-label="NIVAR">
      {tratamento === 'mono' ? null : (
        <defs>
          <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="22" y1="0" x2="400" y2="0">
            <stop offset="0%" stopColor="#7A1F0D" />
            <stop offset="50%" stopColor="#C17D1F" />
            <stop offset="100%" stopColor="#F5C63C" />
          </linearGradient>
        </defs>
      )}
      <g fill="none" stroke={traco} strokeLinecap="butt" strokeLinejoin="miter">
        {PATHS.map(([d, w], i) => <path key={i} d={d} strokeWidth={w} />)}
      </g>
    </svg>
  );
}

export function Folha({
  tratamento = 'cor',
  titulo,
  subtitulo,
  fontes = [],
  recorte,
  timestamp,
  linhas = [],
  colunas = [],
  pagina = 1,
  paginas = 1,
  rodape = 'nivar.com.br',
}) {
  return (
    <div className={'nv-export__folha nv-export__folha--' + tratamento} data-substrato="papel">
      <span className={'nv-export__topo nv-export__topo--' + tratamento} aria-hidden="true"></span>
      <div className="nv-export__cab">
        <Wordmark tratamento={tratamento} />
        <span className="nv-export__selo">Apuração<br />{recorte}</span>
      </div>
      <h4 className="nv-export__titulo">{titulo}</h4>
      {subtitulo ? <p className="nv-export__sub">{subtitulo}</p> : null}
      {colunas.length ? (
        <table className="nv-export__tab">
          <thead><tr>{colunas.map((c, i) => <th key={c} className={i ? 'nv-num' : ''}>{c}</th>)}</tr></thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l[0]}>{l.map((v, i) => i ? <td key={i} className="nv-num">{v}</td> : <th key={i} scope="row">{v}</th>)}</tr>
            ))}
          </tbody>
        </table>
      ) : null}
      <p className="nv-export__proc">
        {fontes.length ? 'Fonte: ' + fontes.join(' · ') : null}
        {timestamp ? ' · ' + timestamp : null}
      </p>
      <p className="nv-export__rodape">
        <span>{rodape}</span>
        <span>{pagina}/{paginas}</span>
      </p>
    </div>
  );
}

export function ExportPreview({
  tratamento = 'cor',
  onTratamento,
  par = false,
  titulo = 'PLD médio por submercado',
  subtitulo,
  fontes = ['ONS', 'CCEE'],
  recorte = 'mensal',
  timestamp,
  colunas = [],
  linhas = [],
  paginas = 1,
  nota,
  onGerar,
  className = '',
}) {
  const notaPadrao = 'O gradiente de incandescência não sobrevive a impressora preto-e-branco de escritório: a ponta brasa fecha para quase preto e a ponta intelligence abre para cinza claro, e o traço perde uniformidade ao longo da palavra. A versão de impressão usa tinta sólida na mesma geometria.';
  const folha = (t, rot, sub) => (
    <figure className="nv-export__item">
      <Folha
        tratamento={t}
        titulo={titulo}
        subtitulo={subtitulo}
        fontes={fontes}
        recorte={recorte}
        timestamp={timestamp}
        colunas={colunas}
        linhas={linhas}
        paginas={paginas}
      />
      <figcaption className="nv-export__legenda">
        <b>{rot}</b><span>{sub}</span>
      </figcaption>
    </figure>
  );

  return (
    <div className={['nv-export', className].filter(Boolean).join(' ')}>
      <div className="nv-export__barra">
        <span className="nv-export__eti">Prévia de exportação</span>
        <span className="nv-export__ops" role="group" aria-label="Tratamento da marca">
          {[['cor', 'Cor'], ['mono', 'Monocromático']].map(([v, r], i) => (
            <React.Fragment key={v}>
              {i ? <span className="nv-export__sep" aria-hidden="true">/</span> : null}
              <button
                type="button"
                className={'nv-export__op' + (tratamento === v ? ' nv-export__op--ativa' : '')}
                aria-pressed={tratamento === v}
                onClick={() => onTratamento && onTratamento(v)}
              >{r}</button>
            </React.Fragment>
          ))}
        </span>
      </div>
      <div className={'nv-export__par' + (par ? '' : ' nv-export__par--uma')}>
        {par || tratamento === 'cor' ? folha('cor', 'Tela e impressão em cor', 'gradiente de incandescência no traço') : null}
        {par || tratamento === 'mono' ? folha('mono', 'Impressão monocromática', 'tinta sólida #14120F, mesma geometria') : null}
      </div>
      <p className="nv-export__nota">{nota || notaPadrao}</p>
      <div className="nv-export__acoes">
        <Button variant="primario" glifo="↓" onClick={() => onGerar && onGerar(tratamento)}>Gerar PDF</Button>
        <span className="nv-export__meta">{paginas} {paginas === 1 ? 'página' : 'páginas'} · A4 · prévia a 34%</span>
      </div>
    </div>
  );
}
