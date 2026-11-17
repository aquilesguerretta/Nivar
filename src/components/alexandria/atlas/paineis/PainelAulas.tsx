// Atlas da Alexandria v3 — "Nas aulas": o índice das vistas, por módulo e aula.
// Cada vista é um enquadramento do mapa que ilustra uma frase de uma aula.

import { useMemo, useState } from 'react';
import { indice } from '@/lib/alexandria/indice';
import type { VistaDoAtlas } from '@/lib/alexandria/atlas/vistas';

interface PainelAulasProps {
  vistas: VistaDoAtlas[] | null;
  vistaAtiva: string | null;
  aoAbrir: (id: string) => void;
}

const NOME_DO_CAPITULO: Record<VistaDoAtlas['capitulo'], string> = { rede: 'rede', agua: 'água', combustivel: 'combustível', trocas: 'trocas', dia: 'um dia', mundo: 'mundo', comercio: 'comércio' };

export function PainelAulas({ vistas, vistaAtiva, aoAbrir }: PainelAulasProps) {
  const moduloDaVistaAtiva = vistas?.find((v) => v.id === vistaAtiva)?.modulo ?? null;
  const [aberto, setAberto] = useState<string | null>(moduloDaVistaAtiva);

  const porModulo = useMemo(() => {
    const m = new Map<string, VistaDoAtlas[]>();
    for (const v of vistas ?? []) {
      const lista = m.get(v.modulo);
      if (lista) lista.push(v);
      else m.set(v.modulo, [v]);
    }
    return m;
  }, [vistas]);

  if (vistas === null) return <p className="atl-carregando">Carregando as vistas das aulas…</p>;
  if (vistas.length === 0)
    return (
      <p className="atl-nota atl-ausencia" role="status">
        As vistas das aulas ainda não foram publicadas neste ambiente.
      </p>
    );

  const aulasComVista = new Set(vistas.map((v) => `${v.modulo}#${v.aula}`)).size;
  const totalAulas = indice.modulos.reduce((s, m) => s + m.aulas.length, 0);

  // módulos agrupados pelas três trilhas, na ordem do índice; módulo sem trilha vai ao fim
  const grupos: { chave: string; romano: string | null; nome: string | null; modulos: typeof indice.modulos }[] = indice.trilhas.map((t) => ({
    chave: t.id,
    romano: t.romano,
    nome: t.nome,
    modulos: indice.modulos.filter((m) => m.trilhaId === t.id),
  }));
  const semTrilha = indice.modulos.filter((m) => !indice.trilhas.some((t) => t.id === m.trilhaId));
  if (semTrilha.length) grupos.push({ chave: 'sem-trilha', romano: null, nome: null, modulos: semTrilha });

  return (
    <div className="atl-aulas">
      <p className="atl-aulas-numero">
        <span className="atl-numero-heroi">{vistas.length}</span>
        <span className="atl-aulas-numero-legenda">
          vistas em {aulasComVista} das {totalAulas} aulas
        </span>
      </p>
      <p className="atl-legenda-linha">Aula sem vista é aula sem geografia, ou que cita algo que o Atlas ainda não tem em camada.</p>
      {grupos.map((g) => (
        <section key={g.chave} className="atl-trilha">
          {g.romano && (
            <h2 className="atl-trilha-titulo">
              <span className="atl-trilha-romano">{g.romano}</span> {g.nome ?? ''}
            </h2>
          )}
      <ol className="atl-modulos">
        {g.modulos.map((m) => {
          const lista = porModulo.get(m.id) ?? [];
          const esta = aberto === m.id;
          return (
            <li key={m.id} className={`atl-modulo${esta ? ' aberto' : ''}`}>
              <button type="button" className="atl-modulo-cabeca" aria-expanded={esta} disabled={lista.length === 0} onClick={() => setAberto(esta ? null : m.id)}>
                <span className="atl-num">{m.codigo}</span>
                <span className="atl-modulo-titulo">{m.titulo ?? m.codigo}</span>
                <span className="atl-num atl-fraco">{lista.length === 0 ? 'sem vista' : lista.length}</span>
              </button>
              {esta && (
                <ol className="atl-vistas">
                  {m.aulas
                    .filter((a) => lista.some((v) => v.aula === a.numero))
                    .map((a) => (
                      <li key={a.numero}>
                        <p className="atl-aula-nome">
                          <span className="atl-num">Aula {String(a.numero).padStart(2, '0')}</span>
                          {a.titulo && <span>{a.titulo}</span>}
                        </p>
                        <ul>
                          {lista
                            .filter((v) => v.aula === a.numero)
                            .map((v) => (
                              <li key={v.id}>
                                <button type="button" className={`atl-vista-link${v.id === vistaAtiva ? ' ativa' : ''}`} aria-current={v.id === vistaAtiva ? 'true' : undefined} onClick={() => aoAbrir(v.id)}>
                                  <span>{v.titulo}</span>
                                  <span className="atl-fraco">{NOME_DO_CAPITULO[v.capitulo]}</span>
                                </button>
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
        </section>
      ))}
    </div>
  );
}
