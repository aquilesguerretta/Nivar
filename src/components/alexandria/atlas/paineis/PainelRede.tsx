// Atlas da Alexandria v3 — capítulo "A rede": as camadas e a legenda.
// Toda contagem vem de indice.json (gerado dos arquivos da fonte); nada digitado.
//
// Cada grupo mostra uma linha do que o leitor vê. O método (cobertura, como o
// símbolo é desenhado, o que a fonte não traz) continua na tela, sob "Como ler":
// nada some, só sai do caminho.

import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { decimal, inteiro, potencia } from '@/lib/alexandria/atlas/dados';
import { classeDaLinha, urlDaSubestacao, urlDoReservatorio, urlDoSelo, urlDoTraco, type ClasseDeTensao } from '@/lib/alexandria/atlas/estilo';
import { CATEGORIAS, ROTULO_CATEGORIA, type AtivoSelecionado, type CamadaId, type Categoria, type IndiceDoAtlas } from '@/lib/alexandria/atlas/tipos';
import { CabecaDaConta, LinhasDaConta, MaioresDaConta, useContaDaTela, type AreaLivre, type EstadoDaConta, type Limites } from '../NestaTela';
import '../atlas-rede.css';
import { lojaDoResumo, textoDoResumo } from '../mapa/maquetes';
import * as C from '../mapa/controleDoMapa';
import type { EscondidasNoZoom } from '../mapa/controleDoMapa';
import * as G from '../mapa/generalizacao';
import { MetodoDaDistribuicao, SecaoDistribuicao } from './SecaoDistribuicao';

/** A regra das maquetes numa linha, com os números da escolha corrente (maquetes.ts).
 *  Ausente abaixo do zoom das maquetes e com a camada desligada. */
export function AvisoDasMaquetes({ ligadas }: { ligadas: boolean }) {
  const r = useSyncExternalStore(lojaDoResumo.assinar, lojaDoResumo.ler);
  if (!ligadas || !r.ativo) return null;
  // uma linha só; a régua de silhuetas saiu (bloco cinza que pesava mais que o texto) e o
  // método inteiro mora em "Como ler"
  const texto = textoDoResumo(r);
  if (!texto) return null;
  return (
    <p className="atl-legenda-linha atl-resumo-maquetes" data-atlas="resumo-maquetes" aria-live="polite">
      {texto}
    </p>
  );
}

/** O método das maquetes, sob "Como ler" (o mesmo nos três capítulos com maquete). */
export function MetodoDasMaquetes() {
  return (
    <>
      {/* três frases (achado: parede de texto); o detalhe da regra está no código e na ficha */}
      <p>A maquete é um esquema do tipo de instalação, não o retrato da obra, e fica sempre no ponto do cadastro. Vizinhas da mesma fonte e do mesmo tipo de instalação formam um conjunto com a maquete na maior, a soma da potência no rótulo e as outras como pontos leves.</p>
      <p>Onde não cabe com folga, fica o símbolo; subestação e instalação pequena demais para ler também. A busca e a ficha acham todas.</p>
      <p>O cadastro não traz o eixo das barragens. Onde o reservatório mapeado pela ANA mostra de que lado está a água, a barragem fica de frente para ela; nas outras, no sentido leste–oeste, por convenção. A ficha da usina diz qual das duas vale.</p>
    </>
  );
}

interface PainelRedeProps {
  indice: IndiceDoAtlas | null;
  camadas: ReadonlySet<CamadaId>;
  aoAlternar: (c: CamadaId) => void;
  aoDefinir: (lista: CamadaId[], ligar: boolean) => void;
  modo: ModoV3;
  /** o que o filtro das usinas esconde no zoom da câmera (REGRA_DAS_USINAS.noZoom) */
  escondidas: EscondidasNoZoom;
  tensaoKv: number;
  /** zoom da câmera (a linha do anel diz o raio e a base da soma daquele zoom) */
  zoom: number;
  /** montagem antiga (leva 3): a seção "Quem é dono"; na nova, `donos` */
  depoisDaGeracao?: ReactNode;
  // ── montagem nova (leva 4): o painel inteiro de "A rede" é este componente ──
  /** a caixa da tela que o controle informa; PRESENTE (mesmo null) liga a montagem nova: o painel desenha o topo */
  limites?: Limites | null;
  /** a área livre como polígono (anel em [lon, lat]), quando o controle informa; vence a caixa */
  areaLivre?: AreaLivre | null;
  /** o ano da linha do tempo (null = hoje) */
  ano?: number | null;
  aoMudarAno?: (ano: number | null) => void;
  /** abrir uma das maiores (o mesmo caminho da busca) */
  aoEscolher?: (a: AtivoSelecionado) => void;
  /** a régua compacta do ano (tempo-e-donos), colada sob o número grande */
  regua?: ReactNode;
  /** o gráfico por período de entrada (tempo-e-donos), recolhido na lente Fontes */
  periodos?: ReactNode;
  /** a seção "Quem é dono" (tempo-e-donos), corpo da lente Donos */
  donos?: ReactNode;
  /** um dono destacado no mapa: a lente abre em Donos (o estado nunca fica escondido) */
  donoAtivo?: boolean;
  /** o método do tempo e o dos donos, para o "Como ler" único */
  metodoDoTempo?: ReactNode;
  metodoDosDonos?: ReactNode;
}

type Lente = 'fontes' | 'donos' | 'rede';
const LENTES: { id: Lente; rotulo: string }[] = [
  { id: 'fontes', rotulo: 'Fontes' },
  { id: 'donos', rotulo: 'Donos' },
  { id: 'rede', rotulo: 'Rede' },
];
const CHAVE_DA_LENTE = 'alx3-atlas-lente-rede';
function lerLente(): Lente | null {
  try {
    const v = localStorage.getItem(CHAVE_DA_LENTE);
    return v === 'fontes' || v === 'donos' || v === 'rede' ? v : null;
  } catch {
    return null;
  }
}
function gravarLente(l: Lente) {
  try {
    localStorage.setItem(CHAVE_DA_LENTE, l);
  } catch {
    /* sem armazenamento: a lente só não é lembrada */
  }
}

/** Roraima no Norte (decisão 3 da onda 2): o arquivo de submercados do Atlas já a pinta no Norte;
 *  a nota diz desde quando e que os números do Norte não a separam. Repetida nos capítulos que
 *  pintam os submercados; a fonte (ONS e MME) está em indice.json › camadas.submercados. */
export const NOTA_RORAIMA =
  'Roraima entrou no Norte em setembro de 2025, pela linha de 500 kV Manaus – Boa Vista (entrada em operação em 16/09/2025 no cadastro do ONS). Os números do Norte incluem Roraima desde então, sem separar o estado.';

/** O método de um grupo, recolhido: uma linha "Como ler" que abre o texto inteiro. */
export function ComoLer({ children, rotulo = 'Como ler' }: { children: ReactNode; rotulo?: string }) {
  return (
    <details className="atl-como-ler">
      <summary>{rotulo}</summary>
      <div className="atl-como-ler-corpo">{children}</div>
    </details>
  );
}

export function Chave({
  ligada,
  aoMudar,
  rotulo,
  detalhe,
  sub,
  cor,
  forma = 'quadro',
  contorno,
  imagem,
}: {
  ligada: boolean;
  aoMudar: () => void;
  rotulo: string;
  /** o número que importa, à direita (potência, extensão, contagem) */
  detalhe?: string | null;
  /** segunda linha sob o rótulo, mais fraca (a contagem quando o número principal é a potência) */
  sub?: string | null;
  cor?: string;
  forma?: 'quadro' | 'disco' | 'anel';
  /** segunda marca além da cor: o disco ganha contorno de tinta (no mapa, as nucleares) */
  contorno?: boolean;
  /** o símbolo do mapa, desenhado pelas mesmas funções do mapa (estilo.ts); vence forma e cor */
  imagem?: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={ligada} className="atl-chave" onClick={aoMudar}>
      {imagem ? (
        <img className="atl-chave-img" src={imagem} alt="" aria-hidden="true" />
      ) : (
        <span className={`atl-chave-marca atl-chave-${forma}`} data-contorno={contorno || undefined} style={cor ? ({ '--cor': cor } as React.CSSProperties) : undefined} aria-hidden="true" />
      )}
      <span className="atl-chave-rotulo">
        {rotulo}
        {sub && <span className="atl-chave-sub">{sub}</span>}
      </span>
      {detalhe && <span className="atl-chave-detalhe">{detalhe}</span>}
    </button>
  );
}

/** Campos do índice que o construtor passou a gravar. Lidos por um tipo local
 *  opcional: se o índice ainda não os tiver, o painel omite o número em vez
 *  de mostrar um de outro universo (cadastro inteiro × o que o mapa desenha). */
type CategoriaNova = { noMapaEmOperacao?: number; gwOperacaoNoMapa?: number };
type UsinasNovas = { naoOperam?: number; naoOperamNoMapa?: number; porCategoria: Record<string, CategoriaNova> };
type LinhasNovas = { porTensaoEmOperacao?: Record<string, number> };

/** A regra das subestações por zoom, quando o controle a exporta (recado do painel, onda 2):
 *  desenhadas a partir de `aPartirDoZoom`, só as de `kvDeLonge` ou mais até `todasNoZoom` (zoom de tile). */
const REGRA_SE = (C as { REGRA_DAS_SUBESTACOES?: { aPartirDoZoom: number; todasNoZoom: number; kvDeLonge: number } }).REGRA_DAS_SUBESTACOES ?? null;

/** "1.347 usinas" / "1 usina" */
export const usinas = (n: number) => `${inteiro(n)} ${n === 1 ? 'usina' : 'usinas'}`;

/** O que o filtro das usinas esconde neste zoom, em uma frase (sem o "Símbolo proporcional"
 *  da frente). Lê o mesmo objeto que o filtro do mapa (REGRA_DAS_USINAS.noZoom): piso de
 *  potência, geradores a óleo pequenos e a generalização das vizinhas, cada um só quando vale. */
export function FraseDoPiso({ escondidas: e, oleo, futuras }: { escondidas: EscondidasNoZoom; oleo: boolean; futuras: boolean }) {
  const oleoFora = oleo && e.oleoAbaixoDeKw > e.limiarKw ? `geradores a óleo abaixo de ${potencia(e.oleoAbaixoDeKw)}` : null;
  const base: ReactNode =
    e.somaDaFaixa && e.limiarKw > 0 ? (
      <>
        símbolo próprio a partir de <span className="atl-num">{potencia(e.limiarKw)}</span> somados
      </>
    ) : e.limiarKw > 0 ? (
      <>
        a partir de <span className="atl-num">{potencia(e.limiarKw)}</span>
      </>
    ) : e.somaDaFaixa ? (
      'toda soma tem símbolo'
    ) : futuras ? (
      'todas as usinas com coordenada'
    ) : (
      'todas as usinas em operação'
    );
  const selo = e.somaDaFaixa && e.seloKw != null && e.seloKw > 0 ? (
    <>
      ; selo da fonte a partir de <span className="atl-num">{potencia(e.seloKw)}</span>
    </>
  ) : null;
  return (
    <>
      neste zoom, {base}
      {oleoFora ? `, menos ${oleoFora}` : ''}
      {selo}
    </>
  );
}

/** Zoom (de tile) a partir do qual a soma do agregado inclui as usinas abaixo de 5 MW.
 *  Lido de generalizacao.ts quando exportado; até lá, o valor de lá (faixa 7). */
const ZOOM_DA_SOMA_COMPLETA = (G as { FAIXA_DA_SOMA_COMPLETA?: number }).FAIXA_DA_SOMA_COMPLETA ?? 7;

/** A linha da legenda sobre o anel: o símbolo de longe é soma do mapa, com o raio daquele zoom. */
export function LinhaDoAnel({ escondidas: e, zoom }: { escondidas: EscondidasNoZoom; zoom: number }) {
  if (!e.generaliza || e.raioKm == null) return null;
  return (
    <p className="atl-legenda-linha" data-atlas="anel-da-soma">
      <span className="atl-anel-amostra" aria-hidden="true" />
      Anel fino: soma do mapa, das usinas da mesma fonte a menos de <span className="atl-num">{inteiro(e.raioKm)}</span>&nbsp;km, desenhada no ponto da maior
      {Math.floor(zoom) < ZOOM_DA_SOMA_COMPLETA ? <> (de longe, só as de <span className="atl-num">{potencia(G.KW_MINIMO_NA_SOMA_DE_LONGE)}</span> ou mais entram na soma)</> : null}.
    </p>
  );
}

/** Uma chave de camada compacta, para a linha de Camadas (fio de 1 px, alvo de 44 px no celular). */
function Ficha({ ligada, aoMudar, rotulo, detalhe, imagem, titulo }: { ligada: boolean; aoMudar: () => void; rotulo: string; detalhe?: string | null; imagem?: string; titulo?: string }) {
  return (
    <button type="button" role="switch" aria-checked={ligada} className="atl-rp-ficha" onClick={aoMudar} title={titulo}>
      {imagem ? <img className="atl-rp-ficha-img" src={imagem} alt="" aria-hidden="true" /> : <span className="atl-rp-ficha-marca" aria-hidden="true" />}
      <span className="atl-rp-ficha-rotulo">{rotulo}</span>
      {detalhe && <span className="atl-num atl-rp-ficha-n">{detalhe}</span>}
    </button>
  );
}

/** As fontes da conta (da tela ou do Brasil, no ano escolhido): cada uma liga e desliga a fonte no mapa. */
function FontesDaConta({ estado, indice, camadas, aoAlternar, aoDefinir, modo, futuras }: { estado: EstadoDaConta; indice: IndiceDoAtlas | null; camadas: ReadonlySet<CamadaId>; aoAlternar: (c: CamadaId) => void; aoDefinir: (lista: CamadaId[], ligar: boolean) => void; modo: ModoV3; futuras: number | null }) {
  const usN = indice?.camadas.usinas as unknown as UsinasNovas | undefined;
  // a conta corrente quando existe; senão (arquivos chegando), o Brasil de hoje pelo índice
  const porCat = estado.conta?.porCat ?? estado.doIndice?.porCat ?? CATEGORIAS.map((c) => (usN?.porCategoria[c]?.gwOperacaoNoMapa ?? NaN) * 1e6);
  const nPorCat = estado.conta?.nPorCat ?? estado.doIndice?.nPorCat ?? CATEGORIAS.map((c) => usN?.porCategoria[c]?.noMapaEmOperacao ?? NaN);
  const todasLigadas = CATEGORIAS.every((c) => camadas.has(c));
  const onde = estado.escopo === 'tela' ? 'nesta tela' : 'no Brasil';
  return (
    <div className="atl-rp-bloco" data-atlas="fontes-da-conta">
      <div className="atl-rp-cabeca">
        <h3 className="atl-rp-h">
          As fontes {onde}
          {estado.ano != null ? <em> em {estado.ano}</em> : null}
        </h3>
        <button type="button" className="atl-rp-acao" onClick={() => aoDefinir([...CATEGORIAS], !todasLigadas)}>
          {todasLigadas ? 'Desligar todas' : 'Ligar todas'}
        </button>
      </div>
      <ul className="atl-rp-fontes-lista">
        {CATEGORIAS.map((c, i) => {
          const kw = porCat[i];
          const n = nPorCat[i];
          return (
            <li key={c}>
              <Celula ligada={camadas.has(c)} aoMudar={() => aoAlternar(c)} rotulo={ROTULO_CATEGORIA[c]} imagem={urlDoSelo(c, modo)}>
                {Number.isFinite(kw) ? (
                  <>
                    <span className="atl-num">{decimal(kw / 1e6)}</span> GW{Number.isFinite(n) ? <> em <span className="atl-num">{inteiro(n)}</span></> : null}
                  </>
                ) : null}
              </Celula>
            </li>
          );
        })}
        {/* a décima casa: o que ainda não opera (anel, como no mapa) */}
        <li>
          <Celula ligada={camadas.has('usinas-futuras')} aoMudar={() => aoAlternar('usinas-futuras')} rotulo="Em construção" titulo="Em construção ou só outorgadas" anel>
            ou outorgadas{futuras != null ? <> · <span className="atl-num">{inteiro(futuras)}</span></> : null}
          </Celula>
        </li>
      </ul>
    </div>
  );
}

/** Uma casa da legenda das fontes: interruptor com o selo do mapa, o nome e, embaixo, o número
 *  (mono só no algarismo). */
function Celula({ ligada, aoMudar, rotulo, imagem, anel, titulo, children }: { ligada: boolean; aoMudar: () => void; rotulo: string; imagem?: string; anel?: boolean; titulo?: string; children?: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={ligada} className="atl-chave atl-rp-celula" onClick={aoMudar} title={titulo}>
      {imagem ? <img className="atl-chave-img" src={imagem} alt="" aria-hidden="true" /> : <span className={`atl-chave-marca ${anel ? 'atl-chave-anel' : ''}`} aria-hidden="true" />}
      <span className="atl-chave-rotulo">{rotulo}</span>
      {children && <span className="atl-rp-celula-n">{children}</span>}
    </button>
  );
}

/** O alternador de lente: três abas, uma só aberta; setas movem entre elas. */
function Lentes({ lente, aoMudar, idPainel }: { lente: Lente; aoMudar: (l: Lente) => void; idPainel: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const teclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = LENTES.findIndex((l) => l.id === lente);
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const alvo = e.key === 'Home' ? 0 : e.key === 'End' ? LENTES.length - 1 : d ? (i + d + LENTES.length) % LENTES.length : -1;
    if (alvo < 0) return;
    e.preventDefault();
    aoMudar(LENTES[alvo].id);
    refs.current[alvo]?.focus();
  };
  return (
    <div className="atl-rp-lentes" role="tablist" aria-label="O que o painel mostra" onKeyDown={teclar}>
      {LENTES.map((l, i) => (
        <button
          key={l.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`${idPainel}-aba-${l.id}`}
          aria-selected={l.id === lente}
          aria-controls={`${idPainel}-corpo`}
          tabIndex={l.id === lente ? 0 : -1}
          className="atl-rp-lente"
          onClick={() => aoMudar(l.id)}
        >
          {l.rotulo}
        </button>
      ))}
    </div>
  );
}

export function PainelRede({
  indice,
  camadas,
  aoAlternar,
  aoDefinir,
  modo,
  escondidas,
  tensaoKv,
  zoom,
  depoisDaGeracao,
  limites,
  areaLivre = null,
  ano = null,
  aoMudarAno,
  aoEscolher,
  regua,
  periodos,
  donos,
  donoAtivo = false,
  metodoDoTempo,
  metodoDosDonos,
}: PainelRedeProps) {
  // montagem nova: a página passa `limites` (mesmo null) e o painel desenha o topo;
  // na antiga, "Nesta tela" e a linha do tempo vêm de fora e o painel começa no alternador
  const montagemNova = limites !== undefined;
  const estado = useContaDaTela({ zoom, limites: limites ?? null, indice, ano, areaLivre });
  const idPainel = useId().replace(/:/g, '');

  const [lente, setLenteCrua] = useState<Lente>(() => (donoAtivo ? 'donos' : (lerLente() ?? 'fontes')));
  const setLente = (l: Lente) => {
    setLenteCrua(l);
    gravarLente(l);
  };
  // um dono destacado (pela lista, pelo endereço) abre a lente dele: o estado do mapa nunca fica escondido
  useEffect(() => {
    if (donoAtivo) setLenteCrua('donos');
  }, [donoAtivo]);

  const us = indice?.camadas.usinas;
  const li = indice?.camadas.linhas;
  const se = indice?.camadas.subestacoes;
  const usN = us as unknown as UsinasNovas | undefined;
  const naoOperamNoMapa = usN?.naoOperamNoMapa ?? null;
  const tensaoEmOperacao = (li as unknown as LinhasNovas | undefined)?.porTensaoEmOperacao ?? null;
  const futurasLigadas = camadas.has('usinas-futuras');

  // a amostra de cada classe sai da mesma tabela de largura e cor do mapa (estilo.ts)
  const classesDeTensao: { rotulo: string; classe: ClasseDeTensao; chaves: string[] }[] = [
    { rotulo: 'Corrente contínua · 600 e 800 kV', classe: classeDaLinha(600, true), chaves: ['CC 600', 'CC 800'] },
    { rotulo: '765 kV', classe: classeDaLinha(765, false), chaves: ['765'] },
    { rotulo: '500 e 525 kV', classe: classeDaLinha(500, false), chaves: ['500', '525'] },
    { rotulo: '440 kV', classe: classeDaLinha(440, false), chaves: ['440'] },
    { rotulo: '345 kV', classe: classeDaLinha(345, false), chaves: ['345'] },
    { rotulo: '230 kV', classe: classeDaLinha(230, false), chaves: ['230', '242'] },
    { rotulo: 'abaixo de 230 kV', classe: classeDaLinha(138, false), chaves: ['138', '88', '69', '34.5'] },
  ];
  const portes: { rotulo: string; porte: 'alta' | 'media' | 'baixa' }[] = [
    { rotulo: '500 kV ou mais', porte: 'alta' },
    { rotulo: '345 e 440 kV', porte: 'media' },
    { rotulo: 'abaixo de 345 kV, ou sem tensão no cadastro', porte: 'baixa' },
  ];
  const previstasSe = se ? (se as { previstas?: number }).previstas : undefined;
  const corpoDonos = donos ?? depoisDaGeracao ?? null;

  return (
    <div className="atl-rp" data-atlas="painel-rede" data-lente={lente}>
      {montagemNova && <CabecaDaConta estado={estado} modo={modo} camadas={camadas} aoAlternar={(c: Categoria) => aoAlternar(c)} aoMudarAno={aoMudarAno} regua={regua} />}

      <Lentes lente={lente} aoMudar={setLente} idPainel={idPainel} />

      <div className="atl-rp-corpo" role="tabpanel" id={`${idPainel}-corpo`} aria-labelledby={`${idPainel}-aba-${lente}`}>
        {lente === 'fontes' && (
          <>
            {montagemNova && aoEscolher && <MaioresDaConta estado={estado} modo={modo} aoEscolher={aoEscolher} />}
            <FontesDaConta estado={estado} indice={indice} camadas={camadas} aoAlternar={aoAlternar} aoDefinir={aoDefinir} modo={modo} futuras={naoOperamNoMapa} />
            {periodos && (
              <details className="atl-rp-recolhido" data-atlas="frota-por-periodo">
                <summary>A frota por período de entrada</summary>
                <div className="atl-rp-recolhido-corpo">{periodos}</div>
              </details>
            )}
          </>
        )}

        {lente === 'donos' && (corpoDonos ?? <p className="atl-carregando">Carregando os donos…</p>)}

        {lente === 'rede' && (
          <>
            {montagemNova && <LinhasDaConta estado={estado} indice={indice} soNaConta />}
            <div className="atl-rp-bloco">
              <h3 className="atl-rp-h">Transmissão</h3>
              <Chave
                ligada={camadas.has('linhas')}
                aoMudar={() => aoAlternar('linhas')}
                imagem={urlDoTraco('ca500', modo, false, 16)}
                rotulo="Linhas em operação"
                detalhe={li ? `${inteiro(li.kmEmOperacao)} km` : null}
                sub={li ? `${inteiro(li.total - li.previstas)} linhas` : null}
              />
              <ul className="atl-legenda-linhas" aria-label="Legenda das tensões">
                {classesDeTensao.map((k) => {
                  // só as linhas em operação: a lista fica sob a chave "Linhas em operação"
                  const n = tensaoEmOperacao ? k.chaves.reduce((s, ch) => s + (tensaoEmOperacao[ch] ?? 0), 0) : null;
                  return (
                    <li key={k.rotulo}>
                      <img className="atl-traco-img" src={urlDoTraco(k.classe, modo)} alt="" aria-hidden="true" />
                      <span>{k.rotulo}</span>
                      <span className="atl-num">{n == null ? '' : inteiro(n)}</span>
                    </li>
                  );
                })}
              </ul>
              <Chave
                ligada={camadas.has('linhas-previstas')}
                aoMudar={() => aoAlternar('linhas-previstas')}
                imagem={urlDoTraco('ca500', modo, true, 16)}
                rotulo="Sem entrada em operação"
                sub="linhas e subestações"
                detalhe={li ? `${inteiro(li.previstas)}${previstasSe != null ? ` + ${inteiro(previstasSe)}` : ''}` : null}
              />
              <Chave ligada={camadas.has('subestacoes')} aoMudar={() => aoAlternar('subestacoes')} imagem={urlDaSubestacao('alta', modo)} rotulo="Subestações" detalhe={se ? inteiro(se.total) : null} />
              <ul className="atl-legenda-linhas atl-legenda-portes" aria-label="Legenda das subestações">
                {portes.map((k) => (
                  <li key={k.porte}>
                    <img className="atl-porte-img" src={urlDaSubestacao(k.porte, modo)} alt="" aria-hidden="true" />
                    <span>{k.rotulo}</span>
                    <span />
                  </li>
                ))}
                <li>
                  <img className="atl-porte-img" src={urlDaSubestacao('prevista', modo)} alt="" aria-hidden="true" />
                  <span>sem entrada em operação (com as linhas previstas)</span>
                  <span />
                </li>
              </ul>
            </div>
            <SecaoDistribuicao indice={indice} ligada={camadas.has('distribuicao')} aoAlternar={() => aoAlternar('distribuicao')} modo={modo} embutida />
          </>
        )}
      </div>

      <section className="atl-rp-camadas" aria-labelledby={`${idPainel}-camadas`}>
        <p className="atl-rp-sobre" id={`${idPainel}-camadas`}>
          <span className="atl-rp-sobre-escopo">Camadas</span>
        </p>
        <div className="atl-rp-fichas">
          <Ficha ligada={camadas.has('submercados')} aoMudar={() => aoAlternar('submercados')} rotulo="Submercados" detalhe="4" />
          <Ficha ligada={camadas.has('reservatorios')} aoMudar={() => aoAlternar('reservatorios')} imagem={urlDoReservatorio(modo)} rotulo="Reservatórios" detalhe={indice ? inteiro(indice.camadas.reservatorios.noMapa) : null} />
          <Ficha ligada={camadas.has('bacias')} aoMudar={() => aoAlternar('bacias')} rotulo="Bacias" detalhe={indice ? inteiro(indice.camadas.bacias.total) : null} titulo="Bacias hidrográficas" />
          <Ficha ligada={camadas.has('relevo')} aoMudar={() => aoAlternar('relevo')} rotulo="Relevo" />
          <Ficha ligada={camadas.has('maquetes')} aoMudar={() => aoAlternar('maquetes')} rotulo="Maquetes 3D" titulo="Maquetes em três dimensões: aparecem ao aproximar" />
        </div>
        <AvisoDasMaquetes ligadas={camadas.has('maquetes')} />
      </section>

      <details className="atl-como-ler atl-rp-como-ler" data-atlas="como-ler-rede">
        <summary>Como ler este mapa</summary>
        <div className="atl-como-ler-corpo">
          <h4 className="atl-rp-h4">A conta</h4>
          <p>
            O número grande soma a potência fiscalizada das usinas em operação do cadastro da ANEEL que têm coordenada: na tela, quando o mapa está perto de um estado; no Brasil inteiro, de longe. Conta também o que o mapa, naquele zoom, não desenha (as menores, as somadas na vizinha maior). A geração distribuída, os painéis dos telhados, não está no cadastro de usinas e não entra.
          </p>
          {us && (
            <p>
              {inteiro(us.noMapa)} das {inteiro(us.total)} usinas do cadastro têm coordenada
              {naoOperamNoMapa != null ? `: ${inteiro(us.noMapa - naoOperamNoMapa)} em operação e ${inteiro(naoOperamNoMapa)} em construção ou só outorgadas` : ''}. As outras {inteiro(us.semCoordenadaNaFonte)} não têm coordenada na fonte e ficam fora do mapa.
            </p>
          )}
          <p>As linhas de transmissão contam o comprimento inteiro que o cadastro declara para cada linha cujo traçado cruza a tela, também o trecho fora dela.</p>

          <h4 className="atl-rp-h4">Os símbolos</h4>
          <p>
            De longe, cada usina é um símbolo de área proporcional à potência: círculo para água, vento e sol, quadrado para as térmicas (queima ou fissão). De perto, onde há espaço, entra o selo da fonte. A lista das fontes (e a barra sob o número) liga e desliga cada fonte no mapa; a fonte desligada fica hachurada na barra e continua na conta.
          </p>
          <p data-atlas="piso-das-usinas">
            Agora: <FraseDoPiso escondidas={escondidas} oleo={camadas.has('oleo')} futuras={futurasLigadas} />.{escondidas.limiarKw > 0 ? ' Aproxime para ver as menores.' : ''}
          </p>
          <LinhaDoAnel escondidas={escondidas} zoom={zoom} />

          <h4 className="atl-rp-h4">As maquetes</h4>
          <MetodoDasMaquetes />

          <h4 className="atl-rp-h4">Linhas e subestações</h4>
          <p data-atlas="piso-das-linhas">
            {tensaoKv > 0 ? (
              <>
                Agora, as linhas a partir de <span className="atl-num">{tensaoKv} kV</span> e os elos de corrente contínua.
              </>
            ) : (
              'Agora, todas as tensões.'
            )}{' '}
            {REGRA_SE ? (
              <span data-atlas="piso-das-subestacoes">
                {zoom < REGRA_SE.aPartirDoZoom ? (
                  'As subestações ainda não aparecem neste zoom; aproxime.'
                ) : Math.floor(zoom) < REGRA_SE.todasNoZoom ? (
                  <>
                    Subestações a partir de <span className="atl-num">{REGRA_SE.kvDeLonge} kV</span>.
                  </>
                ) : (
                  'Subestações de todas as tensões.'
                )}
              </span>
            ) : null}
          </p>
          <p>Cada linha segue o traçado do cadastro, simplificado para o mapa. A cor e a espessura dizem a tensão; as de corrente contínua têm a alma clara. As torres acompanham o traçado generalizado da linha, poucas por linha, só de perto.</p>
          {li && (
            <p>
              Linhas sem ano de entrada no cadastro aparecem como previstas, em tracejado. <span className="atl-num">{inteiro(li.previstasComPrevisaoVencida)}</span> delas têm previsão para um ano que já passou.
            </p>
          )}
          <MetodoDaDistribuicao indice={indice} />

          {metodoDoTempo && (
            <>
              <h4 className="atl-rp-h4">O ano</h4>
              {metodoDoTempo}
            </>
          )}
          {metodoDosDonos && (
            <>
              <h4 className="atl-rp-h4">Os donos</h4>
              {metodoDosDonos}
            </>
          )}

          <h4 className="atl-rp-h4">O território</h4>
          <p>{NOTA_RORAIMA}</p>
        </div>
      </details>
    </div>
  );
}
