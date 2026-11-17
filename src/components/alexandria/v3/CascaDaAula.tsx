// Casca da aula na v3: a casca da casa, a linha de localização (trilha ·
// módulo · aula, que é também a volta) e a medida de leitura. O corpo da aula
// segue nos componentes de aula, que dentro de .alx3 herdam a tipografia e a
// paleta v3 pelos tokens --alx-* (ver alexandria-tokens.ts).
//
// Sem trilhos laterais: os da casca antiga mostravam progresso de mock (S3).

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useEstudo } from '@/components/alexandria/home/estudo';
import { moduloPorId, indice } from '@/lib/alexandria/indice';
import { CasaV3 } from './CasaV3';
import './aula-v3.css';

export function CascaDaAula({
  trilhaId,
  moduloId,
  numero,
  ampla = false,
  children,
}: {
  trilhaId: string;
  moduloId: string;
  numero: number;
  ampla?: boolean;
  children: ReactNode;
}) {
  const estudo = useEstudo();
  const mod = moduloPorId(moduloId);
  const trilha = indice.trilhas.find((t) => t.id === trilhaId);
  const total = mod?.aulas.length ?? null;
  const conta =
    estudo.fase === 'conta' ? (
      <Link to="/alexandria/perfil" className="casa-conta">
        {estudo.nome}
      </Link>
    ) : (
      <Link to="/entrar" className="casa-conta">
        Entrar
      </Link>
    );

  return (
    <CasaV3 secao="trilhas" conta={conta}>
      <nav className="aula-local" aria-label="Onde você está">
        <div className="aula-local-linha">
          <Link to={`/alexandria/trilha/${trilhaId}`} className="aula-local-trilha">
            Trilha {trilha?.romano}
          </Link>
          <span aria-hidden="true">·</span>
          <Link to={`/alexandria/trilha/${trilhaId}/modulo/${moduloId}`} className="aula-local-modulo">
            {mod?.codigo} · {mod?.titulo}
          </Link>
          <span aria-hidden="true">·</span>
          <span aria-current="page">
            Aula {String(numero).padStart(2, '0')}
            {total != null && ` de ${String(total).padStart(2, '0')}`}
          </span>
        </div>
        {total != null && (
          <span className="aula-local-tracos" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} data-atual={i + 1 === numero || undefined} data-antes={i + 1 < numero || undefined} />
            ))}
          </span>
        )}
      </nav>
      <div className={`aula-v3${ampla ? ' aula-v3-ampla' : ''}`}>{children}</div>
    </CasaV3>
  );
}

/** Rola a raiz .alx3 ao topo (o app trava html/body; quem rola é a raiz). */
export function rolarAulaAoTopo() {
  document.querySelector('.alx3')?.scrollTo({ top: 0, behavior: 'auto' });
}
