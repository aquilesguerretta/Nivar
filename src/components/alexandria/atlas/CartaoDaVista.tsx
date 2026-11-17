// Atlas da Alexandria v3 — o cartão da vista: a legenda da prancha.
//
// Mostra de qual aula a vista vem, a frase da própria aula (citação literal da
// extração, com a marcação da fonte preservada em itálico e negrito) e o
// caminho de volta para a aula. O título da vista é texto de interface.

import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { moduloPorId } from '@/lib/alexandria/indice';
import type { VistaDoAtlas } from '@/lib/alexandria/atlas/vistas';

interface CartaoDaVistaProps {
  vista: VistaDoAtlas;
  todas: VistaDoAtlas[];
  aoAbrir: (id: string) => void;
  aoFechar: () => void;
  aoReenquadrar: () => void;
}

const ENTIDADES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'" };

/** Converte a marcação da fonte (<b>, <strong>, <em>, <i>, <sub>, <sup>) em
 *  elementos; qualquer outra tag é descartada. Nunca usa innerHTML. */
function comMarcacao(texto: string): ReactNode[] {
  const partes = texto.split(/(<\/?(?:b|strong|em|i|sub|sup)>)/g);
  const saida: ReactNode[] = [];
  const pilha: string[] = [];
  const limpar = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&(?:amp|lt|gt|nbsp|quot|#39);/g, (m) => ENTIDADES[m] ?? m);
  partes.forEach((parte, i) => {
    const m = parte.match(/^<(\/?)(b|strong|em|i|sub|sup)>$/);
    if (m) {
      if (m[1]) pilha.pop();
      else pilha.push(m[2]);
      return;
    }
    if (!parte) return;
    let no: ReactNode = limpar(parte);
    for (const tag of pilha.slice().reverse()) {
      if (tag === 'b' || tag === 'strong') no = <strong>{no}</strong>;
      else if (tag === 'em' || tag === 'i') no = <em>{no}</em>;
      else if (tag === 'sub') no = <sub>{no}</sub>;
      else if (tag === 'sup') no = <sup>{no}</sup>;
    }
    saida.push(<Fragment key={i}>{no}</Fragment>);
  });
  return saida;
}

export function CartaoDaVista({ vista, todas, aoAbrir, aoFechar, aoReenquadrar }: CartaoDaVistaProps) {
  const modulo = moduloPorId(vista.modulo);
  const aula = modulo?.aulas.find((a) => a.numero === vista.aula) ?? null;
  const rotaDaAula = modulo?.trilhaId ? `/alexandria/trilha/${modulo.trilhaId}/modulo/${modulo.id}/aula/${vista.aula}` : null;
  const irmas = todas.filter((v) => v.modulo === vista.modulo && v.aula === vista.aula);
  const pos = irmas.findIndex((v) => v.id === vista.id);
  const anterior = pos > 0 ? irmas[pos - 1] : null;
  const proxima = pos >= 0 && pos < irmas.length - 1 ? irmas[pos + 1] : null;

  return (
    <article className="atl-vista" aria-label={`Vista da aula: ${vista.titulo}`}>
      <header className="atl-vista-cabeca">
        <p className="v-dado">
          {modulo?.codigo ?? vista.modulo} · Aula {String(vista.aula).padStart(2, '0')}
        </p>
        {irmas.length > 1 && (
          // os dois ficam montados nas pontas, desabilitados: o foco não fica órfão ao chegar ao fim
          <nav className="atl-vista-paginas" aria-label="Vistas desta aula">
            <button type="button" disabled={!anterior} onClick={() => anterior && aoAbrir(anterior.id)} aria-label="Vista anterior">
              ‹
            </button>
            <span className="atl-num">
              {pos + 1} de {irmas.length}
            </span>
            <button type="button" disabled={!proxima} onClick={() => proxima && aoAbrir(proxima.id)} aria-label="Próxima vista">
              ›
            </button>
          </nav>
        )}
        <button type="button" className="atl-ficha-fechar" onClick={aoFechar} aria-label="Fechar a vista">
          Fechar
        </button>
      </header>
      <h2 className="atl-vista-titulo" tabIndex={-1}>
        {vista.titulo}
      </h2>
      <blockquote className="atl-vista-trecho">{comMarcacao(vista.trecho.texto)}</blockquote>
      <p className="atl-vista-origem">
        {modulo?.titulo ?? ''}
        {aula?.titulo ? ` — ${aula.titulo}` : ''}
      </p>
      {vista.nota && <p className="atl-nota atl-vista-nota">{vista.nota}</p>}
      <footer className="atl-vista-acoes">
        {rotaDaAula && (
          <Link to={rotaDaAula} className="atl-vista-aula">
            Abrir a aula <span aria-hidden="true">→</span>
          </Link>
        )}
        <button type="button" onClick={aoReenquadrar}>
          Reenquadrar
        </button>
      </footer>
    </article>
  );
}
