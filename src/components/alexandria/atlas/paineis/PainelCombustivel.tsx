// Atlas da Alexandria v3 — capítulo "O combustível": de onde vêm o gás e o óleo
// que viram energia. Camadas da ANP (GeoServer) e, por cima, as térmicas do
// cadastro da ANEEL que queimam gás, óleo e carvão. Toda contagem vem de
// indice.json (bloco `combustivel`); nada digitado.

import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { dataBr, decimal, inteiro } from '@/lib/alexandria/atlas/dados';
import { urlDaArea, urlDaInstalacao, urlDoDuto, urlDoSelo } from '@/lib/alexandria/atlas/estilo';
import {
  CAMADAS_DO_COMBUSTIVEL,
  CATEGORIAS_DO_COMBUSTIVEL,
  ROTULO_CATEGORIA,
  type CamadaId,
  type IndiceDoAtlas,
  type IndiceDoAtlasComCombustivel,
} from '@/lib/alexandria/atlas/tipos';
import { AvisoDasMaquetes, Chave, ComoLer, FraseDoPiso, LinhaDoAnel, MetodoDasMaquetes, usinas } from './PainelRede';
import type { EscondidasNoZoom } from '../mapa/controleDoMapa';
import '../atlas-combustivel.css';

interface PainelCombustivelProps {
  indice: IndiceDoAtlas | null;
  camadas: ReadonlySet<CamadaId>;
  aoAlternar: (c: CamadaId) => void;
  aoDefinir: (lista: CamadaId[], ligar: boolean) => void;
  modo: ModoV3;
  /** o que o filtro das usinas esconde no zoom da câmera (o mesmo filtro de A rede) */
  escondidas: EscondidasNoZoom;
  /** zoom da câmera (a linha do anel) */
  zoom: number;
}

type CategoriaNova = { noMapaEmOperacao?: number; gwOperacaoNoMapa?: number };

const nf2 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

export function PainelCombustivel({ indice, camadas, aoAlternar, aoDefinir, modo, escondidas, zoom }: PainelCombustivelProps) {
  const c = (indice as IndiceDoAtlasComCombustivel | null)?.combustivel ?? null;
  if (!indice) return <p className="atl-carregando">Carregando as camadas de gás e petróleo…</p>;
  if (!c)
    return (
      <p className="atl-nota atl-ausencia" role="status">
        Os dados de gás e petróleo da ANP ainda não foram gerados neste ambiente.
      </p>
    );

  const g = c.gasodutos;
  const ins = c.instalacoes;
  const refino = ins.refino;
  const porCategoria = indice.camadas.usinas.porCategoria as unknown as Record<string, CategoriaNova>;
  const todasLigadas = CAMADAS_DO_COMBUSTIVEL.every((k) => camadas.has(k));
  const fluido = c.campos.porFluido;

  return (
    <div className="atl-rede atl-comb">
      {/* os dois números que dão a escala do capítulo: o tamanho da malha e o do refino */}
      <dl className="atl-comb-numeros">
        <div>
          <dt className="atl-comb-legenda">de gasodutos de transporte declarados pela ANP, em {inteiro(g.trechos)} trechos</dt>
          <dd className="atl-comb-numero">
            {inteiro(g.kmDeclarado)}
            <span className="atl-comb-unidade">km</span>
          </dd>
        </div>
        <div>
          <dt className="atl-comb-legenda">
            de capacidade de refino declarada, em {inteiro(refino.refinarias - refino.semCapacidadeNaFonte.length)} das {inteiro(refino.refinarias)} refinarias
          </dt>
          <dd className="atl-comb-numero">
            {nf2.format(refino.bpdTotal / 1_000_000)}
            <span className="atl-comb-unidade">milhões de barris por dia</span>
          </dd>
        </div>
      </dl>

      <section className="atl-grupo">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">O gás natural</h2>
          <button type="button" className="atl-grupo-acao" onClick={() => aoDefinir([...CAMADAS_DO_COMBUSTIVEL], !todasLigadas)}>
            {todasLigadas ? 'Desligar todas' : 'Ligar todas'}
          </button>
        </header>
        <Chave ligada={camadas.has('gasodutos')} aoMudar={() => aoAlternar('gasodutos')} imagem={urlDoDuto(modo, 24, 16)} rotulo="Gasodutos de transporte" detalhe={`${inteiro(g.dutos)} dutos`} />
        <ul className="atl-legenda-linhas" aria-label="Legenda dos gasodutos">
          {[
            { d: 32, rotulo: '32 polegadas' },
            { d: 18, rotulo: '18 polegadas' },
            { d: 6, rotulo: '6 polegadas' },
            { d: 0, rotulo: 'sem diâmetro na fonte' },
          ].map((k) => (
            <li key={k.d}>
              <img className="atl-traco-img" src={urlDoDuto(modo, k.d)} alt="" aria-hidden="true" />
              <span>{k.rotulo}</span>
              <span />
            </li>
          ))}
        </ul>
        <Chave ligada={camadas.has('gnl')} aoMudar={() => aoAlternar('gnl')} imagem={urlDaInstalacao('gnl', modo)} rotulo="Terminais de GNL" detalhe={inteiro(ins.porTipo.gnl)} />
        <Chave ligada={camadas.has('upgn')} aoMudar={() => aoAlternar('upgn')} imagem={urlDaInstalacao('upgn', modo)} rotulo="Unidades de processamento de gás" detalhe={inteiro(ins.porTipo.upgn)} />
        <p className="atl-legenda-linha">Só os gasodutos de transporte · espessura pelo diâmetro declarado</p>
        <ComoLer>
          <p>
            A camada da ANP traz só os gasodutos de transporte: não traz os de escoamento da produção, as redes de distribuição nem os oleodutos. A espessura do traço acompanha o diâmetro nominal declarado. O gás que chega por navio entra pelos terminais de GNL (gás natural liquefeito); os terminais são os da camada da ANP.
          </p>
        </ComoLer>
      </section>

      <section className="atl-grupo">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">O petróleo e os derivados</h2>
        </header>
        <Chave ligada={camadas.has('refinarias')} aoMudar={() => aoAlternar('refinarias')} imagem={urlDaInstalacao('refinaria', modo)} rotulo="Refinarias" detalhe={inteiro(ins.porTipo.refinaria)} />
        <Chave ligada={camadas.has('terminais')} aoMudar={() => aoAlternar('terminais')} imagem={urlDaInstalacao('terminal', modo)} rotulo="Terminais de combustíveis líquidos" detalhe={inteiro(ins.porTipo.terminal)} />
        <p className="atl-legenda-linha">Hexágono é processamento, losango é terminal · a cor diz o fluido</p>
      </section>

      <section className="atl-grupo">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">Onde estão o óleo e o gás</h2>
        </header>
        <Chave ligada={camadas.has('campos')} aoMudar={() => aoAlternar('campos')} imagem={urlDaArea('campo-oleo', modo)} rotulo="Campos de produção" detalhe={inteiro(c.campos.total)} />
        <ul className="atl-legenda-linhas atl-legenda-portes" aria-label="Legenda dos campos pelo fluido principal">
          {(
            [
              { k: 'campo-oleo', rotulo: 'óleo', n: fluido.oleo },
              { k: 'campo-gas', rotulo: 'gás', n: fluido.gas },
              { k: 'campo-outros', rotulo: 'outro, ou sem fluido declarado na fonte', n: (fluido.outros ?? 0) + (fluido['sem dado na fonte'] ?? 0) },
            ] as const
          ).map((k) => (
            <li key={k.k}>
              <img className="atl-porte-img" src={urlDaArea(k.k, modo)} alt="" aria-hidden="true" />
              <span>{k.rotulo}</span>
              <span className="atl-num">{inteiro(k.n ?? null)}</span>
            </li>
          ))}
        </ul>
        <Chave ligada={camadas.has('presal')} aoMudar={() => aoAlternar('presal')} imagem={urlDaArea('presal', modo)} rotulo="Polígono do pré-sal" />
        <Chave ligada={camadas.has('blocos')} aoMudar={() => aoAlternar('blocos')} imagem={urlDaArea('bloco', modo)} rotulo="Blocos exploratórios sob contrato" detalhe={inteiro(c.blocos.total)} />
        <Chave ligada={camadas.has('bacias-sedimentares')} aoMudar={() => aoAlternar('bacias-sedimentares')} imagem={urlDaArea('bacia', modo)} rotulo="Bacias sedimentares" detalhe={inteiro(c.baciasSedimentares.total)} />
      </section>

      <section className="atl-grupo">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">As usinas que queimam</h2>
        </header>
        <ul className="atl-lista">
          {CATEGORIAS_DO_COMBUSTIVEL.map((cat) => {
            const d = porCategoria[cat];
            return (
              <li key={cat}>
                <Chave
                  ligada={camadas.has(cat)}
                  aoMudar={() => aoAlternar(cat)}
                  rotulo={ROTULO_CATEGORIA[cat]}
                  detalhe={d?.gwOperacaoNoMapa != null && d.noMapaEmOperacao != null ? `${decimal(d.gwOperacaoNoMapa)} GW` : null}
                  sub={d?.gwOperacaoNoMapa != null && d.noMapaEmOperacao != null ? usinas(d.noMapaEmOperacao) : null}
                  imagem={urlDoSelo(cat, modo)}
                />
              </li>
            );
          })}
        </ul>
        <p className="atl-legenda-linha" data-atlas="piso-das-usinas">
          Térmicas em operação do cadastro da ANEEL, com o símbolo de A rede · <FraseDoPiso escondidas={escondidas} oleo={camadas.has('oleo')} futuras={false} />
        </p>
        <LinhaDoAnel escondidas={escondidas} zoom={zoom} />
        <AvisoDasMaquetes ligadas={camadas.has('maquetes')} />
        {camadas.has('maquetes') && (
          <ComoLer>
            <MetodoDasMaquetes />
            <p>
              Neste capítulo, refinarias, terminais de GNL, UPGNs e terminais de líquidos da ANP também ganham maquete, cada uma no seu ponto, de perto (por volta do zoom 10,5). Onde não cabem a instalação e a usina, fica a de mais peso: a usina conta pela potência; refinaria e terminal de GNL pesam como térmicas de 1.000 e 800 MW, UPGN como uma de 300 MW e terminal de líquidos como uma de 50 MW.
            </p>
          </ComoLer>
        )}
      </section>

      <p className="atl-fonte-linha">
        ANP, GeoServer — consulta <span className="atl-num">{dataBr(c.acesso)}</span>. A ANP não declara licença para estas camadas; uso com atribuição à ANP.
      </p>
    </div>
  );
}
