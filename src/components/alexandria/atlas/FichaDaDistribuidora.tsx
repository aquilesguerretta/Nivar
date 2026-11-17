// Atlas da Alexandria v3 — partes da ficha de uma área de atuação de distribuidora
// (ANEEL · BDGD · camada ARAT). A ficha em si é FichaDoAtivo; aqui ficam a linha
// de sobreposição (calculada da geometria publicada, no ponto do clique) e o
// rodapé de procedência. Nenhum número que não esteja no dado.

import { useEffect, useState } from 'react';
import { carregarAreasDistribuicao, dataBr } from '@/lib/alexandria/atlas/dados';
import type { IndiceDoAtlas, IndiceDoAtlasComDistribuicao, PropsAreaDistribuidora } from '@/lib/alexandria/atlas/tipos';
import { areasNoPonto } from './mapa/distribuicao';

/** "Cemig-D (concessionária) e Cemirim (permissionária)" */
function nomes(as: PropsAreaDistribuidora[]): string {
  const t = as.map((a) => `${a.nome} (${a.tipo})`);
  return t.length > 1 ? `${t.slice(0, -1).join(', ')} e ${t[t.length - 1]}` : t[0];
}

/** Linha "Sobreposição": as outras áreas que cobrem o ponto da ficha. Ausente quando não há. */
export function SobreposicaoDaArea({ codigo, lngLat }: { codigo: number; lngLat: [number, number] }) {
  const [no, setNo] = useState<{ chave: string; outras: PropsAreaDistribuidora[]; deCima: boolean } | null>(null);
  const chave = `${codigo}@${lngLat[0]},${lngLat[1]}`;
  useEffect(() => {
    let vivo = true;
    carregarAreasDistribuicao().then(
      (fc) => {
        if (!vivo) return;
        const aqui = areasNoPonto(fc, lngLat[0], lngLat[1]);
        setNo({ chave, outras: aqui.filter((a) => a.codigo !== codigo), deCima: aqui[0]?.codigo === codigo });
      },
      () => undefined,
    );
    return () => {
      vivo = false;
    };
    // a chave resume código e ponto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);
  if (!no || no.chave !== chave || no.outras.length === 0) return null;
  return (
    <div className="atl-ficha-linha" data-atlas="distribuicao-sobreposicao">
      <dt>Sobreposição</dt>
      <dd>
        Neste ponto, também a área de {nomes(no.outras)}.{no.deCima ? ' O clique abre a de cima.' : ''}
      </dd>
    </div>
  );
}

/** Rodapé: "ANEEL, BDGD · camada ARAT — data-base dd/mm/aaaa · acesso dd/mm/aaaa". */
export function ProcedenciaDaDistribuicao({ indice, dataBase }: { indice: IndiceDoAtlas | null; dataBase: string | null }) {
  const d = (indice as IndiceDoAtlasComDistribuicao | null)?.distribuicao;
  const f = d && !d.ausente ? d.fonte : null;
  return (
    <div className="atl-ficha-fonte">
      <p className="atl-ficha-fonte-kicker">Fonte</p>
      <ul>
        <li>
          {f?.orgao ?? 'ANEEL'}, BDGD (Base de Dados Geográfica da Distribuidora), camada ARAT
          {dataBase ? (
            <>
              {' '}
              — data-base <span className="atl-num">{dataBr(dataBase)}</span>
            </>
          ) : null}
          {f ? (
            <>
              {' '}
              · acesso <span className="atl-num">{dataBr(f.acesso)}</span>
            </>
          ) : null}
        </li>
      </ul>
    </div>
  );
}
