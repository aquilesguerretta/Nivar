// Atlas da Alexandria v3 — capítulo "A rede": a seção das áreas de atuação das
// distribuidoras (ANEEL · BDGD · camada ARAT). Desligada ao abrir. Toda contagem
// vem do bloco `distribuicao` de indice.json; quem não tem área no arquivo é
// nomeado, não preenchido.

import { useSyncExternalStore, type CSSProperties } from 'react';
import { cargaDaDistribuicao } from '../mapa/distribuicao';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { dataBr, inteiro } from '@/lib/alexandria/atlas/dados';
import { TONS_DA_DISTRIBUICAO } from '@/lib/alexandria/atlas/estilo';
import type { IndiceDoAtlas, IndiceDoAtlasComDistribuicao } from '@/lib/alexandria/atlas/tipos';
import { Chave, ComoLer } from './PainelRede';
import '../atlas-distribuicao.css';

/** "CFLO, CNEE, EDEVP e EEB" */
const lista = (nomes: string[]) => (nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : (nomes[0] ?? ''));

/** O método das áreas, para o "Como ler" único do painel de "A rede". */
export function MetodoDaDistribuicao({ indice }: { indice: IndiceDoAtlas | null }) {
  const bloco = (indice as IndiceDoAtlasComDistribuicao | null)?.distribuicao;
  if (!bloco || bloco.ausente) return null;
  const datas = Object.entries(bloco.porDataBase).sort(([a], [b]) => b.localeCompare(a));
  return (
    <>
      <p>Cada cor de área é a que a própria distribuidora declarou à ANEEL, com o contorno simplificado para o mapa. A permissionária, área pequena dentro de outra, vai por cima. Com as áreas ligadas, a rede fica em segundo plano.</p>
      <p>
        Dado da base mais recente de cada distribuidora:{' '}
        {datas.map(([data, n], i) => (
          <span key={data}>
            {i > 0 ? '; ' : ''}
            <span className="atl-num">{inteiro(n)}</span> em <span className="atl-num">{dataBr(data)}</span>
          </span>
        ))}
        . A procedência completa está em Fontes e licenças.
      </p>
    </>
  );
}

export function SecaoDistribuicao({ indice, ligada, aoAlternar, modo, embutida = false }: { indice: IndiceDoAtlas | null; ligada: boolean; aoAlternar: () => void; modo: ModoV3; /** dentro da lente Rede: título pequeno e o método no "Como ler" único */ embutida?: boolean }) {
  const falhou = useSyncExternalStore(cargaDaDistribuicao.assinar, cargaDaDistribuicao.ler);
  const bloco = (indice as IndiceDoAtlasComDistribuicao | null)?.distribuicao;
  // índice sem o bloco (ou arquivo não publicado): a seção não aparece
  if (!bloco || bloco.ausente) return null;
  const d = bloco;
  const t = TONS_DA_DISTRIBUICAO[modo];
  const sem = d.fora.semCamadaArat;
  const datas = Object.entries(d.porDataBase).sort(([a], [b]) => b.localeCompare(a));

  return (
    <section className={embutida ? 'atl-rp-bloco' : 'atl-grupo'} data-atlas="secao-distribuicao">
      {embutida ? (
        <h3 className="atl-rp-h">Distribuição</h3>
      ) : (
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">Distribuição</h2>
        </header>
      )}
      <Chave
        ligada={ligada}
        aoMudar={aoAlternar}
        rotulo="Áreas de atuação das distribuidoras"
        detalhe={inteiro(d.total)}
      />
      {ligada && falhou && (
        <p className="atl-legenda-linha" role="status" data-atlas="distribuicao-indisponivel">
          Áreas indisponíveis agora: o arquivo não carregou. Desligue e ligue a chave para tentar de novo.
        </p>
      )}
      {ligada && !falhou && !embutida && (
        <p className="atl-legenda-linha" data-atlas="distribuicao-segundo-plano">
          Com as áreas ligadas, a rede fica em segundo plano.
        </p>
      )}
      {/* a contagem por tipo de outorga mora na própria legenda, como as tensões das linhas */}
      <ul className="atl-legenda-linhas atl-dist-legenda" aria-label="Áreas por tipo de outorga">
        <li>
          <span className="atl-dist-amostra" style={{ '--a': `${Math.round(t.valores[1] * 100)}%`, '--b': `${Math.round(t.valores[3] * 100)}%`, '--c': `${Math.round(t.valores[4] * 100)}%` } as CSSProperties} aria-hidden="true" />
          <span>Concessionárias</span>
          <span className="atl-num">{inteiro(d.concessionarias)}</span>
        </li>
        <li>
          <span className="atl-dist-amostra atl-dist-perm" style={{ '--cor': t.permissao } as CSSProperties} aria-hidden="true" />
          <span>Permissionárias, por cima</span>
          <span className="atl-num">{inteiro(d.permissionarias)}</span>
        </li>
      </ul>
      {sem.length > 0 && (
        <p className="atl-legenda-linha" data-atlas="distribuicao-sem-area">
          {sem.length} {sem.length === 1 ? 'distribuidora sem área' : 'distribuidoras sem área'} no arquivo da ANEEL: {lista(sem.map((s) => s.nome))}.
        </p>
      )}
      {/* três frases; a procedência técnica (camada, tolerância, fusões, códigos) mora em "Fontes e licenças" */}
      {!embutida && <ComoLer>
        <p>Cada cor é a área que a própria distribuidora declarou à ANEEL, com o contorno simplificado para o mapa. A permissionária, área pequena dentro de outra, vai por cima.</p>
        <p>
          Dado da base mais recente de cada uma:{' '}
          {datas.map(([data, n], i) => (
            <span key={data}>
              {i > 0 ? '; ' : ''}
              <span className="atl-num">{inteiro(n)}</span> em <span className="atl-num">{dataBr(data)}</span>
            </span>
          ))}
          . A procedência completa está em Fontes e licenças.
        </p>
      </ComoLer>}
    </section>
  );
}
