// BuscaPais — busca de país do modo imersivo do Atlas (revisão 3
// pós-Wave 28; sem sugestões desde a revisão 4).
//
// Campo sem caixa — fio embaixo, o padrão ⌘K do handoff — ancorado no
// CANTO, nunca sobre o globo. Enter voa para o melhor casamento; não
// existe lista de sugestões (pedido explícito), só o campo e, quando
// nada casa, uma linha curta de estado. Busca acento-insensível sobre
// o nome pt-BR, o nome do backend e o código ISO.
//
// Só países com geometria no globo: os 22 micro-Estados sem polígono a
// 1:110m ficam de fora, a mesma limitação registrada desde a Wave 27.

import { useMemo, useState } from 'react';
import { A, A2, AF, AT, AS } from '../../../design/alexandria-tokens';
import { nomePaisPt, type MundoAtlas, type PaisFeature } from '../../../lib/atlas/worldApi';

interface BuscaPaisProps {
  mundo: MundoAtlas;
  aoEscolher: (f: PaisFeature) => void;
}

function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function BuscaPais({ mundo, aoEscolher }: BuscaPaisProps) {
  const [termo, setTermo] = useState('');
  const [semResultado, setSemResultado] = useState(false);

  const indice = useMemo(
    () =>
      mundo.features.map((f) => {
        const resumo = f.properties.a3 ? mundo.porIso.get(f.properties.a3) : undefined;
        const nome = nomePaisPt(f.properties, resumo?.countryName);
        return {
          f,
          nome: normalizar(nome),
          chave: normalizar(
            `${nome} ${resumo?.countryName ?? ''} ${f.properties.a3 ?? ''} ${f.properties.name}`,
          ),
        };
      }),
    [mundo],
  );

  const submeter = () => {
    const q = normalizar(termo.trim());
    if (q === '') return;
    // prefixo do nome vence "contém em qualquer campo" — buscar "chi"
    // deve achar Chile, não China por acaso de ordem de array
    const alvo =
      indice.find((e) => e.nome.startsWith(q)) ?? indice.find((e) => e.chave.includes(q));
    if (alvo) {
      setTermo('');
      setSemResultado(false);
      aoEscolher(alvo.f);
    } else {
      setSemResultado(true);
    }
  };

  return (
    <div style={{ width: '220px', pointerEvents: 'auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: AS.sm,
          borderBottom: `1px solid ${A.fioSobreCreme}`,
          paddingBottom: AS.xs,
        }}
      >
        <span style={{ ...AT.rotulo, fontSize: '8px', letterSpacing: '0.13em', color: A2.tintaMetadado }}>
          Buscar
        </span>
        <input
          type="text"
          value={termo}
          onChange={(e) => { setTermo(e.target.value); setSemResultado(false); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submeter();
            } else if (e.key === 'Escape' && termo !== '') {
              // limpa a busca sem sair do modo imersivo
              e.stopPropagation();
              setTermo('');
              setSemResultado(false);
            }
          }}
          placeholder="país ou ISO"
          aria-label="Buscar país no atlas"
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: AF.corpo,
            fontSize: '13px',
            color: A.tintaSobreCreme,
          }}
        />
      </div>
      {semResultado && (
        <span
          role="status"
          style={{ ...AT.dado, display: 'block', marginTop: AS.xs, fontSize: '10px', color: A.terracota }}
        >
          Nenhum país com esse nome no globo.
        </span>
      )}
    </div>
  );
}

export default BuscaPais;
