// Atlas da Alexandria v3 — capítulo "A água": energia armazenada por subsistema
// e por reservatório, mês a mês, de 2000 até a última data publicada pelo ONS.

import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { dataBr, decimal, inteiro } from '@/lib/alexandria/atlas/dados';
import { PALETA, urlDoSelo } from '@/lib/alexandria/atlas/estilo';
import { ROTULO_SUBSISTEMA, type CamadaId, type IndiceDoAtlas, type SerieEar, type Subsistema } from '@/lib/alexandria/atlas/tipos';
import type { VistaDoAtlas } from '@/lib/alexandria/atlas/vistas';
import { FaixasDoAno } from '../graficos';
import { misturar } from '../mapa/controleDoMapa';
import { AvisoDasMaquetes, Chave, ComoLer, MetodoDasMaquetes, NOTA_RORAIMA } from './PainelRede';
import { CabecaDoTempo, MomentosDasAulas, notaDeRoraima, parcialDoIndice, textoDoMesParcial } from './Tempo';

interface PainelAguaProps {
  ear: SerieEar | null;
  indice: IndiceDoAtlas | null;
  mes: number;
  aoMudarMes: (i: number) => void;
  tocando: boolean;
  aoTocar: () => void;
  reduzido: boolean;
  modo: ModoV3;
  marcas: VistaDoAtlas[];
  aoAbrirVista: (id: string) => void;
  camadas: ReadonlySet<CamadaId>;
  aoAlternar: (c: CamadaId) => void;
  /** último dia publicado do mês em curso (AAAA-MM-DD); se não vier, é lido do índice */
  parcialAte?: string | null;
}

/** Campos do índice que o construtor passou a gravar; podem ainda não existir. */
type ReservatoriosNovos = { comSerie?: number; comSerieNoMapa?: number };
type HidroNovo = { noMapaEmOperacao?: number };

const SUBS: Subsistema[] = ['SE', 'S', 'NE', 'N'];

export function PainelAgua({ ear, indice, mes, aoMudarMes, tocando, aoTocar, reduzido, modo, marcas, aoAbrirVista, camadas, aoAlternar, parcialAte }: PainelAguaProps) {
  const p = PALETA[modo];
  if (!ear) return <p className="atl-carregando">Carregando a série de energia armazenada…</p>;
  const fonte = indice?.series.ear.fontes[0];
  const ehUltimo = mes === ear.meses.length - 1;
  const parcial = parcialAte ?? parcialDoIndice(indice?.series.ear);
  const emCurso = textoDoMesParcial(ear.meses[mes], parcial);
  const comSerieNoMapa = (indice?.camadas.reservatorios as unknown as ReservatoriosNovos | undefined)?.comSerieNoMapa ?? null;
  const hidroEmOperacao = (indice?.camadas.usinas.porCategoria.hidro as unknown as HidroNovo | undefined)?.noMapaEmOperacao ?? null;
  // o número grande é o dado do mês (item 4 da leva 4): o armazenamento do SIN, a soma da energia
  // armazenada dos quatro subsistemas sobre a soma das armazenáveis máximas, as duas do arquivo do
  // ONS. Um subsistema sem valor no mês: o SIN não é somado (ausência, não parcial)
  const somas = SUBS.reduce<{ ok: boolean; mwmes: number; max: number }>(
    (a, s) => {
      const v = ear[`${s}_mwmes`][mes];
      const m = ear[`${s}_max`][mes];
      return v == null || m == null || !(m > 0) ? { ...a, ok: false } : { ok: a.ok, mwmes: a.mwmes + v, max: a.max + m };
    },
    { ok: true, mwmes: 0, max: 0 },
  );
  const sin = somas.ok && somas.max > 0 ? (100 * somas.mwmes) / somas.max : null;
  return (
    <div className="atl-agua">
      <CabecaDoTempo
        meses={ear.meses}
        mes={mes}
        aoMudarMes={aoMudarMes}
        tocando={tocando}
        aoTocar={aoTocar}
        reduzido={reduzido}
        parcialAte={parcial}
        nota={notaDeRoraima(ear.meses[mes], indice)}
        heroi={
          <div className="atl-tempo-heroi">
            <p className="atl-tempo-heroi-rotulo">Energia armazenada no SIN</p>
            <p className="atl-tempo-heroi-valor">
              {sin == null ? <span className="atl-ausente">sem dado em algum subsistema neste mês</span> : <>{decimal(sin)}<span className="atl-tempo-heroi-unidade">%</span></>}
            </p>
            {sin != null && (
              <p className="atl-tempo-heroi-linha">
                <span className="atl-num">{inteiro(somas.mwmes)}</span> de <span className="atl-num">{inteiro(somas.max)}</span> MWmês armazenáveis, no último dia do mês
              </p>
            )}
          </div>
        }
      />

      <ul className="atl-niveis">
        {SUBS.map((s) => {
          const pct = ear[s][mes];
          const mwmes = ear[`${s}_mwmes`][mes];
          return (
            <li key={s}>
              <span className="atl-nivel-nome">{ROTULO_SUBSISTEMA[s]}</span>
              <span className="atl-nivel-valor">{pct == null ? 'sem dado' : `${decimal(pct)}%`}</span>
              <span className="atl-nivel-barra" aria-hidden="true">
                <span style={{ width: `${Math.max(0, Math.min(100, pct ?? 0))}%`, background: p.submercado[s] }} />
              </span>
              <span className="atl-nivel-detalhe">{mwmes == null ? '' : `${inteiro(mwmes)} MWmês`}</span>
            </li>
          );
        })}
      </ul>

      <FaixasDoAno
        meses={ear.meses}
        indice={mes}
        aoMudar={aoMudarMes}
        series={SUBS.map((s) => ({ chave: s, rotulo: ROTULO_SUBSISTEMA[s], cor: p.submercado[s], valores: ear[s] }))}
        dominio={[0, 100]}
        valorNoTitulo={false}
        formato={(v) => `${v % 1 === 0 && (v === 0 || v === 100) ? v : decimal(v)}%`}
        descricao={`Energia armazenada por subsistema em ${ear.meses[mes].slice(0, 4)}, mês a mês, contra a faixa de ${ear.meses[0].slice(0, 4)} a ${ear.meses[ear.meses.length - 1].slice(0, 4)}. Clique num mês para escolhê-lo.`}
      />

      <div className="atl-escala" aria-hidden="true">
        <span>vazio</span>
        <span className="atl-escala-barra">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((d) => (
            <span key={d} style={{ background: misturar(p.aguaVazia, p.aguaCheia, d) }} />
          ))}
        </span>
        <span>cheio</span>
      </div>
      <p className="atl-legenda-linha">Cor do subsistema e do reservatório nesta escala · sem cor é sem série, não vazio</p>
      <AvisoDasMaquetes ligadas={camadas.has('maquetes')} />
      {fonte && (
        <p className="atl-fonte-linha">
          {fonte.orgao}, {fonte.conjunto.replace('Dados Abertos · ', '')} — acesso <span className="atl-num">{dataBr(fonte.acesso)}</span>
        </p>
      )}
      <ComoLer>
        <p>
          No mapa, a cor de cada subsistema e de cada reservatório com série de energia armazenada segue esta escala, e o disco do reservatório cresce com o volume útil.
          {comSerieNoMapa != null ? ` Dos reservatórios do mapa, ${inteiro(comSerieNoMapa)} têm série no ONS.` : ''} Reservatório sem série na fonte, ou sem valor no mês escolhido, fica sem a cor da escala: é ausência, não reservatório vazio. Os que o ONS classifica como fio d’água não têm série de energia armazenada.
        </p>
        <p>A camada Hidrelétricas mostra as usinas hidrelétricas em operação, inclusive as a fio d’água, que geram com a vazão do rio e não guardam água para depois.</p>
        <p>
          Valor do último dia de cada mês{emCurso ? ` (${emCurso})` : ehUltimo ? ` (o mês corrente vai até ${dataBr(ear.ultimoDia)})` : ''}, em porcentagem da energia armazenável máxima do subsistema.
        </p>
        {camadas.has('maquetes') && <MetodoDasMaquetes />}
        <p>{NOTA_RORAIMA}</p>
      </ComoLer>

      <section className="atl-grupo">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">No mapa</h2>
        </header>
        <Chave ligada={camadas.has('bacias')} aoMudar={() => aoAlternar('bacias')} rotulo="Bacias hidrográficas" detalhe={indice ? inteiro(indice.camadas.bacias.total) : null} />
        <Chave ligada={camadas.has('hidro')} aoMudar={() => aoAlternar('hidro')} rotulo="Hidrelétricas" detalhe={hidroEmOperacao != null ? inteiro(hidroEmOperacao) : null} imagem={urlDoSelo('hidro', modo)} />
      </section>

      <MomentosDasAulas marcas={marcas} aoAbrirVista={aoAbrirVista} />
    </div>
  );
}
