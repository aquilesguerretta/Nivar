// Atlas da Alexandria v3 — três vistas de aula do capítulo corrente, no topo do painel.
// Sem frase nova: cada linha é o título da vista (o mesmo de "Nas aulas") e o módulo e a
// aula de onde ela vem. As três saem de módulos diferentes, espalhadas pelo currículo.

import { useId, useState } from 'react';
import type { CapituloId } from '@/lib/alexandria/atlas/tipos';
import './atlas-rede.css';
import type { VistaDoAtlas } from '@/lib/alexandria/atlas/vistas';

/** Três vistas do capítulo: a primeira vista do primeiro, do módulo do meio e do último módulo que têm vista nele. */
export function tresVistas(vistas: VistaDoAtlas[], capitulo: CapituloId): { escolhidas: VistaDoAtlas[]; total: number } {
  const doCap = vistas.filter((v) => v.capitulo === capitulo).sort((a, b) => a.modulo.localeCompare(b.modulo) || a.aula - b.aula || a.id.localeCompare(b.id));
  const modulos = [...new Set(doCap.map((v) => v.modulo))];
  const idx = modulos.length <= 3 ? modulos.map((_, i) => i) : [0, Math.floor((modulos.length - 1) / 2), modulos.length - 1];
  const escolhidas = idx.map((i) => doCap.find((v) => v.modulo === modulos[i]) as VistaDoAtlas);
  // capítulo com menos de três módulos: completa com as seguintes, na ordem
  for (const v of doCap) {
    if (escolhidas.length >= 3) break;
    if (!escolhidas.includes(v)) escolhidas.push(v);
  }
  return { escolhidas, total: doCap.length };
}

const POR_EXTENSO = ['', 'uma', 'duas', 'três'];

export function VistasDoCapitulo({ vistas, capitulo, vistaAtiva, aoAbrir }: { vistas: VistaDoAtlas[] | null; capitulo: CapituloId; vistaAtiva: string | null; aoAbrir: (id: string) => void }) {
  // uma linha que abre a lista (leva 4): o topo do painel é do dado, não de três links do mesmo peso.
  // Fica aberta quando uma das três está ativa (o "você está aqui" não se esconde).
  const [aberta, setAberta] = useState(false);
  const id = useId();
  if (!vistas) return null;
  const { escolhidas } = tresVistas(vistas, capitulo);
  if (!escolhidas.length) return null;
  const ativaAqui = escolhidas.some((v) => v.id === vistaAtiva);
  const mostra = aberta || ativaAqui;
  const n = escolhidas.length;
  return (
    <nav className="atl-vistas-cap atl-rp-vistas" aria-label="Vistas das aulas neste capítulo" data-aberta={mostra || undefined}>
      <button type="button" className="atl-rp-vistas-abrir" aria-expanded={mostra} aria-controls={id} onClick={() => setAberta((v) => !v)}>
        <span>
          {POR_EXTENSO[n].replace(/^./, (c) => c.toUpperCase())} {n === 1 ? 'aula usa' : 'aulas usam'} este capítulo
        </span>
        <span className="atl-rp-vistas-seta" aria-hidden="true">
          {mostra ? '−' : '+'}
        </span>
      </button>
      <ul id={id} hidden={!mostra}>
        {escolhidas.map((v) => (
          <li key={v.id}>
            <button type="button" onClick={() => aoAbrir(v.id)} aria-current={v.id === vistaAtiva ? 'true' : undefined} title={v.titulo}>
              <span className="atl-vistas-cap-titulo">{v.titulo}</span>
              <span className="atl-num atl-fraco">
                M{v.modulo.slice(-2)} · aula {String(v.aula).padStart(2, '0')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
