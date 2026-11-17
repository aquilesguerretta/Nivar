// Casca da Alexandria v3: barra superior com a marca, a navegação e o modo.
// Sem barra lateral permanente (contrato §6). A navegação é curta de propósito.

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/instrument-sans/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './alexandria-v3.css';
import './casa-v3.css';
import { useModoV3 } from './usoV3';
import { MarcaAlexandria } from './MarcaAlexandria';

export type SecaoV3 = 'inicio' | 'trilhas' | 'glossario' | 'biblioteca' | 'atlas' | 'perfil';

const NAV: { secao: SecaoV3; para: string; rotulo: string }[] = [
  { secao: 'inicio', para: '/alexandria', rotulo: 'Início' },
  { secao: 'trilhas', para: '/alexandria/trilhas', rotulo: 'Trilhas' },
  { secao: 'glossario', para: '/alexandria/glossario', rotulo: 'Glossário' },
  { secao: 'biblioteca', para: '/alexandria/biblioteca', rotulo: 'Biblioteca' },
  { secao: 'atlas', para: '/alexandria/atlas', rotulo: 'Atlas' },
];

export function CasaV3({ secao, conta, children }: { secao: SecaoV3; conta: ReactNode; children: ReactNode }) {
  const [modo, alternarModo] = useModoV3();
  return (
    <div className="alx3" data-modo={modo}>
      <header className="casa">
        <div className="casa-linha">
          <Link to="/alexandria" className="casa-marca" aria-label="Alexandria — início">
            <span className="casa-simbolo">
              <MarcaAlexandria tamanho={26} />
            </span>
            <span className="casa-nome">Alexandria</span>
            <span className="casa-assina v-dado">NIVAR · currículo de energia</span>
          </Link>
          <nav className="casa-nav" aria-label="Seções da Alexandria">
            {NAV.map((n) => (
              <Link
                key={n.para}
                to={n.para}
                className={`casa-link${n.secao === secao ? ' active' : ''}`}
                aria-current={n.secao === secao ? 'page' : undefined}
              >
                {n.rotulo}
              </Link>
            ))}
          </nav>
          <div className="casa-acoes">
            <button
              type="button"
              className="casa-modo"
              onClick={alternarModo}
              aria-pressed={modo === 'noturno'}
              data-moldura="texto"
            >
              {modo === 'noturno' ? 'Modo claro' : 'Modo noturno'}
            </button>
            {conta}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
