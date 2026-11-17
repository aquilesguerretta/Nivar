// Atlas da Alexandria v3 — a ficha do ativo escolhido no mapa.
//
// Cada campo vem do arquivo da fonte; o que a fonte não traz aparece como
// "sem dado na fonte", nunca em branco e nunca estimado. O rodapé da ficha
// diz de qual conjunto de dados ela saiu e quando ele foi baixado.

import { useEffect, useRef, useSyncExternalStore, type ReactNode, type Ref } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { carregarUsinasMenores, carregarUsinasPrincipais, dataBr, decimal, inteiro, mesBr, potencia } from '@/lib/alexandria/atlas/dados';
import { PALETA, corDaInstalacao, type TipoDeInstalacao } from '@/lib/alexandria/atlas/estilo';
import {
  ROTULO_CATEGORIA,
  ROTULO_SUBSISTEMA,
  type AtivoSelecionado,
  type Categoria,
  type FonteDeDado,
  type IndiceCombustivel,
  type IndiceDoAtlas,
  type IndiceDoAtlasComCombustivel,
  type SerieEar,
  type SerieEarReservatorios,
  type Subsistema,
} from '@/lib/alexandria/atlas/tipos';
import { nomePaisPt, type MundoAtlas, type PaisFeatureProps } from '@/lib/atlas/worldApi';
import { CONTEXTO_SUBMERCADO } from './CamadaBrasil';
import { lojaDosConjuntos, type ConjuntoNaTela } from './mapa/maquetes';
import type { ResumoDoAgregado } from './mapa/controleDoMapa';
import { Faisca } from './graficos';
import { PaisPerfil } from './PaisPerfil';
import { km, nomeDeExibicao } from './nomes';
import { ProcedenciaDaDistribuicao, SobreposicaoDaArea } from './FichaDaDistribuidora';
import { TONS_DA_DISTRIBUICAO } from '@/lib/alexandria/atlas/estilo';
import { lerParticipacoes } from '@/lib/alexandria/atlas/donos';

interface FichaProps {
  ativo: AtivoSelecionado;
  indice: IndiceDoAtlas | null;
  earRes: SerieEarReservatorios | null;
  ear: SerieEar | null;
  /** índice do mês corrente no capítulo da água; null fora dele */
  mes: number | null;
  /** o ano escolhido na linha do tempo de "A rede" (null = hoje): com ele, a potência é a daquele ano */
  ano?: number | null;
  mundo: MundoAtlas | null;
  modo: ModoV3;
  satelite: boolean;
  aoFechar: () => void;
  aoAproximar: () => void;
  aoVerFoto: () => void;
  aoPedirSerie: () => void;
  /** abre a ficha de outro ativo (a lista "Neste conjunto") */
  aoAbrirOutro?: (a: AtivoSelecionado) => void;
  /** ref para o título da ficha (h2 com tabIndex -1): quem abre a ficha pode
   *  levar o foco até ele. Não se aplica ao perfil de país. */
  refDoTitulo?: Ref<HTMLHeadingElement>;
}

const TIPO_DE_USINA: Record<string, string> = {
  UHE: 'Usina hidrelétrica',
  PCH: 'Pequena central hidrelétrica',
  CGH: 'Central geradora hidrelétrica',
  UTE: 'Usina termelétrica',
  UTN: 'Usina termonuclear',
  EOL: 'Central eólica',
  UFV: 'Central fotovoltaica',
};

const FASE = ['Em operação', 'Em construção', 'Outorgada, construção não iniciada'];

/** Modalidade de operação do ONS, com a descrição que o próprio ONS dá no
 *  SINDAT. A correspondência tipo → descrição foi medida cruzando as duas
 *  bases (camada "Usina" do SINDAT × Capacidade Instalada): 212 de 213 usinas
 *  "cuja operação impacta" são Tipo I; 45 de 46 "de conjunto" são II-C; as 10
 *  UTEs "com CVU declarado" são II-A; as 7 "individualizadas" são II-B. */
const MODALIDADE: Record<string, string> = {
  'TIPO I': 'Tipo I · usina cuja operação impacta a Rede de Operação',
  'TIPO II-A': 'Tipo II-A · termelétrica com custo variável declarado, que não impacta a Rede de Operação e é despachada por ordem de mérito',
  'TIPO II-B': 'Tipo II-B · usina que não impacta a Rede de Operação, mas participa da programação de forma individualizada',
  'TIPO II-C': 'Tipo II-C · usina pertencente a um conjunto de usinas',
};

const ID_SUBMERCADO: Record<Subsistema, string> = { SE: 'sudesteCentroOeste', S: 'sul', NE: 'nordeste', N: 'norte' };

/** Instalação sem data de entrada em operação no cadastro do ONS. A fonte só
 *  garante isso; a previsão registrada pode já ter passado sem que o cadastro
 *  tenha sido atualizado, e o Atlas não afirma que a obra ainda não opera. */
function semEntrada(prev: number | null): string {
  if (prev == null) return 'Sem data de entrada em operação no cadastro';
  // 2099-12-31 e 9999-09-09 são marcadores do SINDAT no lugar da previsão
  // (a maior previsão de verdade medida no cadastro é 2030)
  if (prev >= 2099) return `Prevista, sem data na fonte: o cadastro traz ${prev} no lugar da previsão`;
  return prev < new Date().getFullYear() ? `Sem data de entrada em operação no cadastro; a previsão registrada era ${prev}` : `Prevista para ${prev}, sem data de entrada em operação no cadastro`;
}

/** Situação de linha ou subestação. `opAntesDe` marca instalação em operação
 *  cuja data no cadastro é a da carga da base, não a de entrada. */
function situacao(pr: Record<string, unknown>): string {
  const op = numero(pr.op);
  const antes = pr.opAntesDe;
  if (antes != null && antes !== false && antes !== 0 && antes !== '') {
    const ano = numero(antes) ?? op;
    return ano != null ? `Em operação desde ${ano} ou antes: ${ano} é a data de carga do cadastro, não a de entrada` : 'Em operação, sem data de entrada na fonte';
  }
  if (op != null) return `Em operação desde ${op}`;
  return semEntrada(numero(pr.prev));
}

/** Nome do conjunto de dados no rodapé: "Dados Abertos · Reservatórios",
 *  "SINDAT · camada "Subestação"", "SIGA". */
function nomeDoConjunto(conjunto: string): string {
  const partes = conjunto.split(' · ');
  if (partes[0] === 'Dados Abertos' && partes[1]) return `${partes[0]} · ${partes[1]}`;
  if (partes[0] === 'SINDAT' && partes.length > 1) return `${partes[0]} · ${partes[partes.length - 1]}`;
  return partes[0];
}

/** Município como a fonte escreve. Quando o campo já traz a UF ("Cidade - UF",
 *  um por município), não se acrescenta a UF principal por cima. */
function municipio(mun: string | null, uf: string | null): string | null {
  if (!mun) return uf;
  if (/\s-\s[A-Z]{2}\b/.test(mun)) return mun;
  return uf ? `${mun} · ${uf}` : mun;
}

const texto = (v: unknown): string | null => (v == null || v === '' ? null : String(v));
const numero = (v: unknown): number | null => (v == null || v === '' || Number.isNaN(Number(v)) ? null : Number(v));

/** Meia unidade da última casa decimal da coordenada, no chão (a mesma conta da regra das
 *  maquetes, erroDaCoordenadaM em maquetes.ts): 2 casas ≈ 560 m, 1 casa ≈ 5,6 km. */
function erroDaPosicao(casas: number): string {
  const m = 0.5 * 10 ** -casas * 111_000;
  return m >= 1000 ? `${(m / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km` : `${Math.round(m / 10) * 10} m`;
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="atl-ficha-linha">
      <dt>{rotulo}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Mês sem valor numa série que existe. Diz onde a série começa quando o nulo
 *  é anterior ao primeiro valor; não afirma o motivo da ausência. */
function semDadoNoMes(pct: (number | null)[], i: number, meses: string[]): string {
  const inicio = pct.findIndex((v) => v != null);
  return inicio > i ? `sem dado neste mês; a série começa em ${mesBr(meses[inicio])}` : 'sem dado neste mês';
}

const Ausente = ({ o = 'sem dado na fonte' }: { o?: string }) => <span className="atl-ausente">{o}</span>;

type FonteDaAnp = FonteDeDado & { camada: string | null };

/** Rodapé das fichas de gás e petróleo: "ANP · <conjunto>, consulta em dd/mm/aaaa". */
function ProcedenciaAnp({ fonte }: { fonte: FonteDaAnp | undefined }) {
  if (!fonte) return null;
  return (
    <div className="atl-ficha-fonte">
      <p className="atl-ficha-fonte-kicker">Fonte</p>
      <ul>
        <li>
          {fonte.orgao}, {fonte.conjunto.replace(/^GeoServer da ANP/, 'GeoServer')} — consulta <span className="atl-num">{dataBr(fonte.acesso)}</span>
        </li>
      </ul>
    </div>
  );
}

/** Camada de origem de cada tipo de instalação (trecho do nome da camada no GeoServer). */
const CAMADA_DA_INSTALACAO: Record<TipoDeInstalacao, string> = {
  refinaria: 'REFINARIAS',
  gnl: 'Terminais_GNL',
  upgn: 'UPGN',
  terminal: 'TERMINAIS_LIQ',
};

const decimalOuInteiro = (v: number) => (Number.isInteger(v) ? inteiro(v) : decimal(v));

/** Número sem unidade declarada na fonte: o valor, com a ressalva ao lado. */
const SemUnidade = ({ v }: { v: number }) => (
  <>
    {decimalOuInteiro(v)} <span className="atl-ausente">unidade não declarada na fonte</span>
  </>
);

/** Data da fonte ('AAAA-MM-DD') em pt-BR, ou a ausência. */
const dataDaFonte = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? dataBr(v) : <Ausente />);

/** Município e UF como a fonte da ANP escreve. */
const lugarAnp = (mun: string | null, uf: string | null) => (mun && uf ? `${mun} · ${uf}` : (mun ?? uf));

const AMBIENTE: Record<string, string> = { T: 'terra (código T)', M: 'mar (código M)' };
const ambiente = (v: string | null) => (v == null ? <Ausente /> : (AMBIENTE[v] ?? `código ${v}, sem significado declarado na fonte`));

const FLUIDO_DO_CAMPO: Record<string, string> = { oleo: 'óleo', gas: 'gás', outros: 'outros' };

/** Procedência: uma fonte por linha, em texto; só a data em algarismo tabular. */
function Procedencia({ fontes, extra }: { fontes: (FonteDeDado | undefined)[]; extra?: ReactNode }) {
  const validas = fontes.filter((f): f is FonteDeDado => !!f);
  if (!validas.length) return null;
  return (
    <div className="atl-ficha-fonte">
      <p className="atl-ficha-fonte-kicker">Fonte</p>
      <ul>
        {validas.map((f, i) => (
          <li key={i}>
            {f.orgao}, {nomeDoConjunto(f.conjunto)} — acesso <span className="atl-num">{dataBr(f.acesso)}</span>
          </li>
        ))}
        {extra && <li>{extra}</li>}
      </ul>
    </div>
  );
}

/** "Neste conjunto (n)": as usinas que o mapa juntou numa maquete, cada uma no seu ponto,
 *  com o nome e a potência do cadastro; cada item abre a ficha daquela usina (botão: Tab e
 *  Enter). A usina desta ficha aparece marcada, sem botão. */
function ListaDoConjunto({ c, atual, aoAbrir, comSemente = false }: { c: ConjuntoNaTela; atual: string | null; aoAbrir: (a: AtivoSelecionado) => void; comSemente?: boolean }) {
  return (
    <ul className="atl-ficha-conjunto-lista">
      {c.usinas.map((u, i) => (
        <li key={u.ceg}>
          {u.ceg === atual ? (
            <span className="atl-ficha-conjunto-item" aria-current="true">
              <span>{nomeDeExibicao(u.nome)}</span>
              <span className="atl-num">{potencia(u.mw * 1000)}</span>
            </span>
          ) : (
            // a semente aberta pela lista do conjunto mostra o PARQUE (não o conjunto de novo)
            <button type="button" className="atl-ficha-conjunto-item" onClick={() => aoAbrir({ tipo: 'usina', chave: u.ceg, props: comSemente && i === 0 ? { ...u.props, comoParque: true } : u.props, lngLat: u.lngLat })}>
              <span>{nomeDeExibicao(u.nome)}</span>
              <span className="atl-num">{potencia(u.mw * 1000)}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Uma linha discreta que abre a lista: "este símbolo soma 7 usinas · ver" (item 3 da leva 4: a
 *  ficha começa pelo objeto; a soma do mapa é leitura secundária). */
function LinhaQueAbre({ resumo, children }: { resumo: ReactNode; children: ReactNode }) {
  return (
    <details className="atl-ficha-junto">
      <summary>
        {resumo} <span className="atl-ficha-junto-ver">· ver</span>
      </summary>
      <div className="atl-ficha-junto-corpo">{children}</div>
    </details>
  );
}

/** Abre a ficha de um membro do agregado: a lista traz só ceg e nome; a feição inteira (props e
 *  ponto) vem dos arquivos das usinas, pelo mesmo cache do mapa. Procura primeiro nas principais
 *  (sem esperar as 2,7 MB das menores, codigo.md 24) e só abre se a ficha que pediu ainda existe. */
async function abrirMembro(ceg: string, aoAbrir: (a: AtivoSelecionado) => void, vivo: () => boolean) {
  const achar = (l: Awaited<ReturnType<typeof carregarUsinasPrincipais>>) => l.find((f) => f.properties.ceg === ceg);
  const u = achar(await carregarUsinasPrincipais()) ?? achar(await carregarUsinasMenores().catch(() => []));
  if (u && vivo()) aoAbrir({ tipo: 'usina', chave: ceg, props: u.properties as unknown as Record<string, unknown>, lngLat: [u.geometry.coordinates[0], u.geometry.coordinates[1]] });
}

/** O símbolo clicado soma usinas (de longe, decisão 2 da onda 2): a linha discreta abre as dez
 *  maiores e a contagem do resto. A soma é conta do mapa; cada membro é um registro da ANEEL. */
function SomaDoSimbolo({ ag, atual, aoAbrir }: { ag: ResumoDoAgregado; atual: string; aoAbrir?: (a: AtivoSelecionado) => void }) {
  // a ficha que pediu o membro pode ter fechado (ou trocado) antes do arquivo chegar
  const vivo = useRef(true);
  useEffect(() => {
    vivo.current = true;
    return () => {
      vivo.current = false;
    };
  }, []);
  return (
    <LinhaQueAbre
      resumo={
        <>
          este símbolo soma <span className="atl-num">{inteiro(ag.n)}</span> usinas · <span className="atl-num">{potencia(ag.somaKw)}</span>
        </>
      }
    >
      <ol className="atl-ficha-soma-lista">
        {ag.membros.map((m) => (
          <li key={m.ceg}>
            {m.ceg === atual || !aoAbrir ? (
              <span className="atl-ficha-conjunto-item" aria-current={m.ceg === atual ? 'true' : undefined}>
                <span>{nomeDeExibicao(m.nome)}</span>
                <span className="atl-num">{potencia(m.kw)}</span>
              </span>
            ) : (
              <button type="button" className="atl-ficha-conjunto-item" onClick={() => abrirMembro(m.ceg, aoAbrir, () => vivo.current).catch(() => undefined)}>
                <span>{nomeDeExibicao(m.nome)}</span>
                <span className="atl-num">{potencia(m.kw)}</span>
              </button>
            )}
          </li>
        ))}
      </ol>
      {ag.resto > 0 && (
        <p className="atl-ficha-soma-resto">
          e mais <span className="atl-num">{inteiro(ag.resto)}</span> {ag.resto === 1 ? 'usina menor' : 'usinas menores'}
        </p>
      )}
    </LinhaQueAbre>
  );
}

/** As ressalvas do dado num só lugar, recolhido (item 3 da leva 4). */
function SobreEsteDado({ children }: { children: ReactNode }) {
  return (
    <details className="atl-ficha-sobre-dado">
      <summary>Sobre este dado</summary>
      <div className="atl-ficha-sobre-dado-corpo">{children}</div>
    </details>
  );
}

/** O dono principal da usina, como o cadastro escreve, e quantos outros há. */
function donoPrincipal(texto: string | null): string | null {
  if (!texto) return null;
  const l = lerParticipacoes(texto);
  const partes = [...l.partes].sort((a, b) => b.fracao - a.fracao);
  if (!partes.length) return null;
  const pct = (f: number) => `${Math.round(f * 100)}%`;
  const p0 = partes[0];
  const nome = nomeDeExibicao(p0.nome);
  if (partes.length === 1) return p0.fracao >= 0.995 ? nome : `${nome} (${pct(p0.fracao)})`;
  return `${nome} (${pct(p0.fracao)}) e mais ${partes.length - 1}`;
}

/** O dado principal da ficha, em escala de manchete, com a unidade ao lado. */
interface Heroi {
  rotulo: string;
  valor: string | null;
  linha?: ReactNode;
}

function HeroiDaFicha({ h }: { h: Heroi }) {
  // "7,0 GW" → número grande, unidade menor ao lado
  const m = h.valor ? h.valor.match(/^([\d.,]+)\s*(.*)$/) : null;
  return (
    <div className="atl-ficha-heroi">
      <p className="atl-ficha-heroi-rotulo">{h.rotulo}</p>
      <p className="atl-ficha-heroi-valor">
        {h.valor == null ? (
          <Ausente />
        ) : m ? (
          <>
            {m[1]}
            {m[2] && <span className="atl-ficha-heroi-unidade">{m[2]}</span>}
          </>
        ) : (
          h.valor
        )}
      </p>
      {h.linha && <p className="atl-ficha-heroi-linha">{h.linha}</p>}
    </div>
  );
}

export function FichaDoAtivo({ ativo, indice, earRes, ear, mes, ano: anoDaRegua = null, mundo, modo, satelite, aoFechar, aoAproximar, aoVerFoto, aoPedirSerie, aoAbrirOutro, refDoTitulo }: FichaProps) {
  const p = PALETA[modo];
  const pr = ativo.props;
  // o conjunto do mapa em que esta usina está (semente ou membro), se ele tem maquete agora;
  // a última leitura vale enquanto a ficha é a mesma (o conjunto não some da ficha no pan)
  const conjuntos = useSyncExternalStore(lojaDosConjuntos.assinar, lojaDosConjuntos.ler);
  const ultimoConjunto = useRef<{ chave: string; c: ConjuntoNaTela } | null>(null);
  const agora = ativo.tipo === 'usina' ? (conjuntos.get(ativo.chave) ?? null) : null;
  if (agora) ultimoConjunto.current = { chave: ativo.chave, c: agora };
  const conjunto = agora ?? (ultimoConjunto.current?.chave === ativo.chave ? ultimoConjunto.current.c : null);

  useEffect(() => {
    if (ativo.tipo === 'reservatorio' || ativo.tipo === 'submercado') aoPedirSerie();
    // pede a série uma vez por ativo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo.tipo, ativo.chave]);

  // ficha nova começa do topo (a de um membro aberto pela lista herdava a rolagem da anterior
  // e cortava o cabeçalho)
  const corpoRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (corpoRef.current) corpoRef.current.scrollTop = 0;
  }, [ativo.tipo, ativo.chave]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      // Escape que a busca já usou para fechar a própria lista não fecha a ficha
      if (e.defaultPrevented) return;
      if (e.key === 'Escape') aoFechar();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [aoFechar]);

  if (ativo.tipo === 'pais') {
    const props = pr as unknown as PaisFeatureProps;
    const a3 = texto(pr.a3);
    const resumo = a3 && mundo ? (mundo.porIso.get(a3) ?? null) : null;
    return <PaisPerfil nome={texto(pr.nomePt) ?? nomePaisPt(props, resumo?.countryName)} isoA3={a3} resumo={resumo} aoVoltar={aoFechar} />;
  }

  let sobre = '';
  let titulo = '';
  let corpo: ReactNode = null;
  let rodape: ReactNode = null;
  let podeVerFoto = false;
  let cor: string | null = null;
  let heroi: Heroi | null = null;
  // o símbolo clicado soma outras usinas (controle: props.agregado, só de longe e fora da vista de aula)
  const agregado = ativo.tipo === 'usina' ? ((pr.agregado as ResumoDoAgregado | undefined) ?? null) : null;
  // aberta pela maquete de um conjunto (a semente, com membros, sem ter vindo da lista do
  // próprio conjunto): a ficha começa pelo conjunto
  const pelaMaqueteDoConjunto = ativo.tipo === 'usina' && !agregado && !pr.comoParque && !!conjunto && conjunto.usinas.length > 1 && conjunto.usinas[0].ceg === ativo.chave;

  if (ativo.tipo === 'usina') {
    const cat = pr.cat as Categoria;
    const fase = numero(pr.fase) ?? 0;
    const kw = numero(pr.kw);
    const mod = texto(pr.modalidade);
    const sub = texto(pr.sub) as Subsistema | null;
    cor = p.categoria[cat] ?? null;
    titulo = texto(pr.nome) ?? String(pr.ceg);
    // a semente e os membros do mesmo agrupamento têm as mesmas ações
    podeVerFoto = (kw != null && kw >= 30_000) || !!conjunto;
    const ano = numero(pr.ano);
    const lugar = municipio(texto(pr.mun), texto(pr.uf));
    // rumo da barragem (decisão 4 da onda 2): presente só onde o teste da água passou
    const rumoPelaAna = numero(pr.rumoB) != null;
    const precDaFonte = numero(pr.prec);
    const fonteDoRumo = (indice?.camadas.usinas as unknown as { rumoDasBarragens?: { fonte?: FonteDeDado } } | undefined)?.rumoDasBarragens?.fonte;
    const suspeita = pr.susp === true || pr.susp === 'true' || pr.susp === 1;
    // o próprio nome do cadastro diz "(Parte Brasileira)": a usina é binacional (Itaipu)
    const binacional = /parte brasileira/i.test(String(pr.nome ?? ''));
    const dono = donoPrincipal(texto(pr.dono));
    const situacaoDaUsina = fase === 0 ? (ano != null ? `em operação desde ${ano}` : 'em operação, sem data de entrada na fonte') : (FASE[fase] ?? 'situação sem dado na fonte').toLowerCase();
    if (pelaMaqueteDoConjunto && conjunto) {
      // aberta pela maquete de um conjunto: o objeto é o conjunto (a soma e os parques); o parque
      // clicado é o primeiro da lista, a um toque
      const n = conjunto.usinas.length - 1;
      const plural = cat === 'eolica' ? (n === 1 ? 'parque' : 'parques') : n === 1 ? 'usina' : 'usinas';
      sobre = `${ROTULO_CATEGORIA[cat] ?? 'Usina'} · conjunto no mapa`;
      titulo = `${nomeDeExibicao(texto(pr.nome) ?? String(pr.ceg))} e mais ${n} ${plural}`;
      heroi = {
        rotulo: 'Potência somada',
        valor: potencia(conjunto.mw * 1000),
        linha: (
          <>
            {conjunto.usinas.length} registros da ANEEL a menos de <span className="atl-num">{conjunto.R_km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</span>&nbsp;km do maior
          </>
        ),
      };
      corpo = null;
      rodape = (
        <>
          {aoAbrirOutro && <ListaDoConjunto c={conjunto} atual={null} aoAbrir={aoAbrirOutro} comSemente />}
          <SobreEsteDado>
            <p className="atl-nota">
              Agrupadas pelo mapa, não pelo cadastro: mesma fonte e mesmo tipo de instalação a menos de {conjunto.R_km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km da maior, que dá o nome e o ponto da maquete.
              Cada parque é um registro próprio da ANEEL, no seu ponto do cadastro; aproxime e cada um ganha o seu símbolo.
            </p>
            <Procedencia fontes={indice ? [indice.camadas.usinas.fontes[0]] : []} />
          </SobreEsteDado>
        </>
      );
    } else {
      sobre = `${ROTULO_CATEGORIA[cat] ?? 'Usina'} · ${texto(pr.tipo) ?? ''}`;
      // com um ano escolhido, o mapa manda a potência daquele ano (etapas por unidade do ONS) e a
      // de hoje em kwHoje, quando diferem (Tucuruí em 1990: 3,5 GW; hoje 8,5 GW)
      const kwHoje = numero(pr.kwHoje);
      const noAno = anoDaRegua != null && kwHoje != null && kw != null && kwHoje !== kw;
      heroi = {
        rotulo: noAno ? `Potência em ${anoDaRegua}` : fase === 0 ? 'Potência fiscalizada' : 'Potência outorgada',
        valor: kw ? potencia(kw) : null,
        linha: (
          <>
            {noAno && (
              <>
                <span className="atl-num">{potencia(kwHoje)}</span> hoje, pela data de entrada de cada unidade no ONS
                <br />
              </>
            )}
            {situacaoDaUsina}
            {' · '}
            {lugar ?? <Ausente o="município sem dado na fonte" />}
            {binacional && ' · binacional: o cadastro traz só a parte brasileira'}
            {dono && (
              <>
                <br />
                {dono}
              </>
            )}
          </>
        ),
      };
      corpo = (
        <>
          <Linha rotulo="Tipo">{TIPO_DE_USINA[String(pr.tipo)] ?? texto(pr.tipo) ?? <Ausente />}</Linha>
          {cat !== 'hidro' && <Linha rotulo="Combustível">{texto(pr.comb) ?? <Ausente />}</Linha>}
          <Linha rotulo="Proprietário e regime">{texto(pr.dono) ?? <Ausente />}</Linha>
          <Linha rotulo="Código da ANEEL">
            <span className="atl-codigo">{String(pr.ceg)}</span>
          </Linha>
          <Linha rotulo="Operação no ONS">{mod ? (MODALIDADE[mod] ?? mod) : <Ausente o="fora da base de capacidade do ONS" />}</Linha>
          {mod && (
            <>
              <Linha rotulo="Subsistema">{sub ? ROTULO_SUBSISTEMA[sub] : <Ausente />}</Linha>
              <Linha rotulo="Potência efetiva no ONS">
                {numero(pr.mwOns) != null ? `${inteiro(numero(pr.mwOns))} MW` : <Ausente />}
                {numero(pr.ug) != null ? ` em ${inteiro(numero(pr.ug))} ${numero(pr.ug) === 1 ? 'unidade' : 'unidades'}` : ''}
              </Linha>
            </>
          )}
        </>
      );
      rodape = (
        <>
          {/* as ressalvas do dado e a nota do desenho, num só recolhido */}
          <SobreEsteDado>
            {suspeita && (
              <p className="atl-nota atl-ausencia">
                Posição a confirmar: o cadastro declara {municipio(texto(pr.mun), texto(pr.uf)) ?? texto(pr.uf)}, mas a coordenada dele cai noutro submercado. O mapa desenha a usina no ponto do cadastro, sem corrigir e sem maquete.
              </p>
            )}
            {/* coordenada curta na fonte (campo prec): a regra das maquetes recusa o modelo de perto
                (o erro passa da metade do tamanho dele no chão); sem esta linha a maquete sumia ao
                aproximar sem explicação (Paraibuna) */}
            {precDaFonte != null && precDaFonte <= 2 && (
              <p className="atl-nota">
                A fonte dá a posição com {precDaFonte === 0 ? 'nenhuma casa decimal' : precDaFonte === 1 ? '1 casa decimal' : `${precDaFonte} casas decimais`} (erro de até ~{erroDaPosicao(precDaFonte)}); por isso, de perto, a maquete não é desenhada.
              </p>
            )}
            {cat === 'hidro' && <p className="atl-nota">Desenho da barragem: {rumoPelaAna ? 'o rumo segue o reservatório mapeado pela ANA' : 'rumo por convenção (leste–oeste); o reservatório não está mapeado'}. A maquete é esquema, não o eixo real.</p>}
            <Procedencia
              fontes={indice ? [...(mod ? indice.camadas.usinas.fontes : [indice.camadas.usinas.fontes[0]]), cat === 'hidro' && rumoPelaAna ? fonteDoRumo : undefined] : []}
              extra={
                indice ? (
                  <>
                    base do cadastro de <span className="atl-num">{dataBr(indice.camadas.usinas.dataBase)}</span>
                  </>
                ) : undefined
              }
            />
          </SobreEsteDado>
        </>
      );
    }
  } else if (ativo.tipo === 'linha') {
    const cc = numero(pr.cc) === 1;
    sobre = cc ? 'Linha de corrente contínua' : 'Linha de transmissão';
    titulo = texto(pr.n) ?? String(pr.id);
    cor = cc ? p.linha.cc : null;
    heroi = {
      rotulo: 'Tensão',
      valor: numero(pr.kv) != null ? `${inteiro(numero(pr.kv))} kV` : null,
      linha: (
        <>
          {cc ? 'corrente contínua (elo HVDC)' : 'corrente alternada'} · {km(pr.km) ?? <Ausente o="extensão sem dado na fonte" />}
        </>
      ),
    };
    corpo = (
      <>
        <Linha rotulo="Situação">{situacao(pr)}</Linha>
        <Linha rotulo={cc ? 'Capacidade operativa' : 'Capacidade de longa duração'}>{numero(pr.cap) != null ? `${inteiro(numero(pr.cap))} ${cc ? 'MW' : 'A'}` : <Ausente />}</Linha>
        <Linha rotulo="Rede">{texto(pr.rede) === 'BASICA' ? 'Rede Básica' : texto(pr.rede) === 'COMPLEMENTAR' ? 'Rede Complementar' : (texto(pr.rede) ?? <Ausente />)}</Linha>
        <Linha rotulo="Agente proprietário">{texto(pr.ag) ?? <Ausente />}</Linha>
        <Linha rotulo="Estados">{texto(pr.uf) ?? <Ausente />}</Linha>
        <Linha rotulo="Código no ONS">
          <span className="atl-codigo">{String(pr.id)}</span>
        </Linha>
      </>
    );
    rodape = (
      <>
        <p className="atl-nota">O traçado é o do ONS, generalizado: serve para a escala do estado, não mostra cada torre.</p>
        <Procedencia fontes={indice ? [indice.camadas.linhas.fontes[cc ? 1 : 0]] : []} />
      </>
    );
  } else if (ativo.tipo === 'subestacao') {
    const sub = texto(pr.sub) as Subsistema | null;
    sobre = 'Subestação';
    titulo = texto(pr.n) ?? String(pr.id);
    heroi = {
      rotulo: 'Maior tensão',
      valor: numero(pr.kv) != null ? `${inteiro(numero(pr.kv))} kV` : null,
      linha: (
        <>
          {sub ? ROTULO_SUBSISTEMA[sub] : 'subsistema sem dado na fonte'} · {texto(pr.uf) ?? 'estado sem dado na fonte'}
        </>
      ),
    };
    corpo = (
      <>
        {texto(pr.niveis) && String(pr.niveis).includes('/') && <Linha rotulo="Níveis de tensão">{String(pr.niveis).split('/').join(' · ')} kV</Linha>}
        <Linha rotulo="Agente principal">{texto(pr.ag) ?? <Ausente />}</Linha>
        <Linha rotulo="Situação">{situacao(pr)}</Linha>
        <Linha rotulo="Código no ONS">
          <span className="atl-codigo">{String(pr.id)}</span>
        </Linha>
      </>
    );
    // o cadastro de Dados Abertos só entra na procedência quando algum campo veio dele
    const doCadastro = pr.base !== 'SINDAT' || numero(pr.kv) != null || texto(pr.niveis) != null || sub != null;
    const suspeitaSe = pr.susp === true || pr.susp === 'true' || pr.susp === 1;
    rodape = (
      <>
        {suspeitaSe && (
          <p className="atl-nota atl-ausencia">
            Posição a confirmar: o cadastro declara {texto(pr.uf) ?? 'outro estado'}, mas a coordenada dele cai longe dali. O mapa desenha a subestação no ponto do cadastro, sem corrigir e sem maquete.
          </p>
        )}
        <Procedencia fontes={indice ? (pr.base === 'SINDAT' ? [indice.camadas.subestacoes.fontes[0], doCadastro ? indice.camadas.subestacoes.fontes[1] : undefined] : [indice.camadas.subestacoes.fontes[1]]) : []} />
      </>
    );
  } else if (ativo.tipo === 'reservatorio') {
    const sub = texto(pr.sub) as Subsistema | null;
    const cod = texto(pr.cod);
    const serie = cod && earRes ? earRes.reservatorios[cod] : null;
    const i = mes ?? (earRes ? earRes.meses.length - 1 : null);
    const pct = serie && i != null ? serie.pct[i] : null;
    const vutil = numero(pr.vutil);
    sobre = 'Reservatório';
    titulo = texto(pr.n) ?? '';
    cor = p.categoria.hidro;
    podeVerFoto = true;
    heroi = {
      rotulo: 'Volume útil',
      valor: vutil ? `${inteiro(vutil)} hm³` : null,
      linha: vutil ? (texto(pr.rio) ? `rio ${texto(pr.rio)}` : undefined) : 'sem volume útil: opera a fio d’água',
    };
    corpo = (
      <>
        <Linha rotulo={String(pr.usina ?? '').includes(' · ') ? 'Usinas' : 'Usina'}>{texto(pr.usina) ?? <Ausente />}</Linha>
        <Linha rotulo="Rio">{texto(pr.rio) ?? <Ausente />}</Linha>
        <Linha rotulo="Bacia">{texto(pr.bacia) ?? <Ausente />}</Linha>
        <Linha rotulo="Subsistema">{sub ? ROTULO_SUBSISTEMA[sub] : <Ausente />}</Linha>
        <Linha rotulo="Tipo">{texto(pr.tipo) ? String(pr.tipo).toLowerCase().replace('dagua', 'd’água') : <Ausente />}</Linha>
        <Linha rotulo="Em operação desde">{numero(pr.op) ?? <Ausente />}</Linha>
        {earRes && i != null && <Linha rotulo={`Energia armazenada em ${mesBr(earRes.meses[i])}`}>{pct != null ? `${decimal(pct)}%` : <Ausente o={serie ? semDadoNoMes(serie.pct, i, earRes.meses) : 'sem série de armazenamento na fonte'} />}</Linha>}
      </>
    );
    rodape = (
      <>
        {serie && earRes && (
          <figure className="atl-ficha-serie">
            <Faisca valores={serie.pct} cor={p.categoria.hidro} indice={i ?? undefined} descricao={`Energia armazenada em ${titulo}, de ${mesBr(earRes.meses[0])} a ${mesBr(earRes.meses[earRes.meses.length - 1])}.`} />
            <figcaption>
              % armazenado · {earRes.meses[0].slice(0, 4)} a {earRes.meses[earRes.meses.length - 1].slice(0, 4)}
            </figcaption>
          </figure>
        )}
        <Procedencia fontes={indice ? [indice.camadas.reservatorios.fontes[0], serie ? indice.series.earReservatorios.fontes[0] : undefined] : []} />
      </>
    );
  } else if (ativo.tipo === 'submercado') {
    const sub = ativo.chave as Subsistema;
    const contexto = CONTEXTO_SUBMERCADO[ID_SUBMERCADO[sub]];
    const i = mes ?? (ear ? ear.meses.length - 1 : null);
    const pct = ear && i != null ? ear[sub][i] : null;
    sobre = 'Submercado';
    titulo = ROTULO_SUBSISTEMA[sub] ?? String(pr.nome);
    cor = p.submercado[sub];
    corpo = (
      <>
        {contexto && (
          <>
            <Linha rotulo="Característica">{contexto.caracteristica}</Linha>
            <Linha rotulo="Papel no sistema">{contexto.papel}</Linha>
          </>
        )}
        {ear && i != null && <Linha rotulo={`Energia armazenada em ${mesBr(ear.meses[i])}`}>{pct != null ? `${decimal(pct)}%` : <Ausente />}</Linha>}
      </>
    );
    rodape = (
      <>
        {ear && (
          <figure className="atl-ficha-serie">
            <Faisca valores={ear[sub]} cor={p.submercado[sub]} indice={i ?? undefined} descricao={`Energia armazenada no subsistema ${titulo}.`} />
            <figcaption>
              % armazenado · {ear.meses[0].slice(0, 4)} a {ear.meses[ear.meses.length - 1].slice(0, 4)}
            </figcaption>
          </figure>
        )}
        {contexto && <p className="atl-nota">Característica e papel: texto do Módulo 08 da Alexandria, tabela dos submercados.</p>}
        <Procedencia fontes={indice && ear ? [indice.series.ear.fontes[0]] : []} />
      </>
    );
  } else if (ativo.tipo === 'gasoduto' || ativo.tipo === 'instalacao' || ativo.tipo === 'campo' || ativo.tipo === 'bloco' || ativo.tipo === 'bacia-sedimentar' || ativo.tipo === 'presal') {
    const comb: IndiceCombustivel | null = (indice as IndiceDoAtlasComCombustivel | null)?.combustivel ?? null;
    const r = fichaDoCombustivel(ativo.tipo, pr, comb, p);
    sobre = r.sobre;
    titulo = r.titulo;
    corpo = r.corpo;
    rodape = r.rodape;
    cor = r.cor;
    podeVerFoto = ativo.tipo === 'instalacao';
  } else if (ativo.tipo === 'distribuidora') {
    // área de atuação (ANEEL · BDGD · ARAT): só o que a feição traz; a sobreposição é calculada
    // da geometria publicada, no ponto do clique
    const perm = pr.tipo === 'permissionária';
    const codigo = numero(pr.codigo) ?? 0;
    const tons = TONS_DA_DISTRIBUICAO[modo];
    sobre = perm ? 'Distribuidora · permissionária' : 'Distribuidora · concessionária';
    titulo = texto(pr.nome) ?? String(ativo.chave);
    // a cor da marca: o ouro da permissionária ou a tinta do fio da concessionária
    cor = perm ? tons.permissao : p.tinta;
    corpo = (
      <>
        <Linha rotulo="Outorga">{perm ? 'Permissão de serviço público de distribuição' : 'Concessão de serviço público de distribuição'}</Linha>
        <Linha rotulo="Contrato">{texto(pr.contrato) ? <span className="atl-num">nº {texto(pr.contrato)}</span> : <Ausente />}</Linha>
        <Linha rotulo="Data-base do dado">{dataDaFonte(pr.dataBase)}</Linha>
        <Linha rotulo="Código ANEEL">
          <span className="atl-num">{codigo || <Ausente />}</span>
        </Linha>
        <SobreposicaoDaArea codigo={codigo} lngLat={ativo.lngLat} />
      </>
    );
    rodape = (
      <>
        <p className="atl-nota">Área de atuação declarada pela própria distribuidora na BDGD, não o ato de outorga. Contorno simplificado a cerca de 300 m.</p>
        <ProcedenciaDaDistribuicao indice={indice} dataBase={texto(pr.dataBase)} />
      </>
    );
  } else if (ativo.tipo === 'bacia') {
    sobre = 'Bacia hidrográfica';
    titulo = String(pr.Nome_Bacia);
    cor = p.categoria.hidro;
    corpo = <Linha rotulo="Contorno">Como o ONS publica as bacias do Sistema Interligado Nacional, simplificado para a escala do mapa.</Linha>;
    rodape = <Procedencia fontes={indice ? indice.camadas.bacias.fontes : []} />;
  }

  // nome do cadastro em CAIXA ALTA: caixa de título só na tela; o original fica na ficha
  const tituloNaTela = nomeDeExibicao(titulo);
  const nomeOriginal = tituloNaTela !== titulo ? titulo : null;

  return (
    <aside className="atl-ficha" aria-label={`${sobre}: ${tituloNaTela}`}>
      <header className="atl-ficha-cabeca">
        <p className="v-dado atl-ficha-sobre">
          {cor && <span className="atl-ficha-cor" style={{ background: cor }} aria-hidden="true" />}
          {sobre}
        </p>
        <h2 className="atl-ficha-titulo" tabIndex={-1} ref={refDoTitulo}>
          {tituloNaTela}
        </h2>
        <button type="button" className="atl-ficha-fechar" onClick={aoFechar} aria-label="Fechar a ficha">
          Fechar
        </button>
      </header>
      <div className="atl-ficha-corpo" ref={corpoRef}>
        {heroi && <HeroiDaFicha h={heroi} />}
        {/* a soma do símbolo e o conjunto do mapa: uma linha discreta que abre a lista */}
        {agregado && <SomaDoSimbolo ag={agregado} atual={ativo.chave} aoAbrir={aoAbrirOutro} />}
        {!agregado && !pelaMaqueteDoConjunto && conjunto && conjunto.usinas.length > 1 && aoAbrirOutro && (
          <LinhaQueAbre resumo={<>no mapa, junta-se a outras <span className="atl-num">{conjunto.usinas.length - 1}</span> · <span className="atl-num">{potencia(conjunto.mw * 1000)}</span> somados</>}>
            <ListaDoConjunto c={conjunto} atual={ativo.chave} aoAbrir={aoAbrirOutro} comSemente />
          </LinhaQueAbre>
        )}
        {(corpo || (nomeOriginal && !pelaMaqueteDoConjunto)) && (
          <dl className="atl-ficha-dados">
            {corpo}
            {nomeOriginal && !pelaMaqueteDoConjunto && (
              <Linha rotulo="Nome no cadastro">
                <span className="atl-codigo">{nomeOriginal}</span>
              </Linha>
            )}
          </dl>
        )}
        {rodape}
      </div>
      <footer className="atl-ficha-acoes">
        <button type="button" onClick={aoAproximar}>
          Aproximar
        </button>
        {podeVerFoto && !satelite && (
          <button type="button" onClick={aoVerFoto}>
            Ver na foto de satélite
          </button>
        )}
      </footer>
    </aside>
  );
}

/** Fichas de gás e petróleo (ANP): cada campo como a fonte publica, com a unidade
 *  declarada, a ressalva quando a unidade não é declarada e a ausência quando falta. */
function fichaDoCombustivel(
  tipo: AtivoSelecionado['tipo'],
  pr: Record<string, unknown>,
  comb: IndiceCombustivel | null,
  p: (typeof PALETA)['claro'],
): { sobre: string; titulo: string; corpo: ReactNode; rodape: ReactNode; cor: string | null } {
  const t = (k: string) => texto(pr[k]);
  const n = (k: string) => numero(pr[k]);
  const codigo = (v: string | null) => (v ? <span className="atl-codigo">{v}</span> : <Ausente />);
  const fora = pr.fora === true || pr.fora === 'true';
  const avisoFora = fora ? <p className="atl-nota atl-ausencia">Parte do contorno passa da caixa do Brasil e da zona econômica exclusiva. O mapa desenha como a fonte publica, sem corrigir.</p> : null;
  const semUnidade = (k: string) => {
    const v = n(k);
    return v != null ? <SemUnidade v={v} /> : <Ausente />;
  };

  if (tipo === 'gasoduto') {
    const duto = t('duto');
    const trecho = t('trecho');
    const repetida = comb?.repetidas.find((x) => x.camada === 'gasodutos' && x.item === `${duto} / ${trecho}`);
    const diam = n('diam');
    const ponta = (lugar: string | null, mun: string | null) => (lugar ? `${lugar}${mun ? ` · ${mun}` : ''}` : <Ausente />);
    return {
      sobre: 'Gasoduto de transporte',
      titulo: duto ?? String(pr.id),
      cor: p.categoria.gas,
      corpo: (
        <>
          <Linha rotulo="Trecho">{trecho ?? <Ausente />}</Linha>
          <Linha rotulo="Diâmetro nominal">{diam != null ? `${decimalOuInteiro(diam)} polegadas` : <Ausente />}</Linha>
          <Linha rotulo="Extensão declarada">{n('km') != null ? `${decimal(n('km'))} km` : <Ausente />}</Linha>
          <Linha rotulo="Extensão no traçado">{n('kmTraco') != null ? `${decimal(n('kmTraco'))} km, medida no traçado da fonte` : <Ausente />}</Linha>
          <Linha rotulo="Origem">{ponta(t('orig'), t('munOrig'))}</Linha>
          <Linha rotulo="Destino">{ponta(t('dest'), t('munDest'))}</Linha>
          <Linha rotulo="Fluido">{t('fluido') ?? <Ausente />}</Linha>
          <Linha rotulo="Proprietário">{t('prop') ?? <Ausente />}</Linha>
          <Linha rotulo="Operador">{t('oper') ?? <Ausente />}</Linha>
          <Linha rotulo="Vazão e pressão">
            <Ausente o="a camada não traz" />
          </Linha>
        </>
      ),
      rodape: (
        <>
          {repetida?.problema && <p className="atl-nota atl-ausencia">Registro repetido na fonte: {repetida.problema}</p>}
          <p className="atl-nota">O traçado é o da camada da ANP, simplificado para a escala do mapa.</p>
          <ProcedenciaAnp fonte={comb?.gasodutos.fontes[0]} />
        </>
      ),
    };
  }

  if (tipo === 'instalacao') {
    const sub = (t('tipo') ?? 'terminal') as TipoDeInstalacao;
    const fonte = comb?.instalacoes.fontes.find((f) => (f.camada ?? '').includes(CAMADA_DA_INSTALACAO[sub]));
    const lugar = <Linha rotulo="Município">{lugarAnp(t('mun'), t('uf')) ?? <Ausente />}</Linha>;
    const autorizacao = (
      <Linha rotulo="Autorização da ANP">{t('aut') ? `nº ${t('aut')}${t('autFonte') ? `, ${t('autFonte')}` : ''}` : <Ausente o="sem número publicado na fonte" />}</Linha>
    );
    const naoTraz = (
      <Linha rotulo="Capacidade">
        <Ausente o="a camada não traz" />
      </Linha>
    );
    let sobre = 'Terminal de combustíveis líquidos';
    let corpo: ReactNode = null;
    let nota: ReactNode = null;
    if (sub === 'refinaria') {
      sobre = 'Refinaria';
      const bpd = n('bpd');
      const m3d = n('m3d');
      corpo = (
        <>
          <Linha rotulo="Sigla">{t('sigla') ?? <Ausente />}</Linha>
          <Linha rotulo="Capacidade de refino">{bpd != null ? `${inteiro(bpd)} barris por dia${m3d != null ? ` · ${inteiro(m3d)} m³ por dia` : ''}` : <Ausente o="sem capacidade na fonte" />}</Linha>
          <Linha rotulo="Empresa">{t('emp') ?? <Ausente />}</Linha>
          {lugar}
          {autorizacao}
        </>
      );
    } else if (sub === 'gnl') {
      sobre = 'Terminal de gás natural liquefeito';
      corpo = (
        <>
          <Linha rotulo="Capacidade">{semUnidade('cap')}</Linha>
          <Linha rotulo="Situação">{t('sit') ?? <Ausente />}</Linha>
          <Linha rotulo="Empresa">{t('emp') ?? <Ausente />}</Linha>
          {lugar}
          {autorizacao}
        </>
      );
      nota = <p className="atl-nota">A ANP publica a capacidade dos terminais de GNL sem dizer a unidade. O número fica como a fonte escreve.</p>;
    } else if (sub === 'upgn') {
      sobre = 'Unidade de processamento de gás natural';
      corpo = (
        <>
          <Linha rotulo="Tipo, como a fonte escreve">{t('sub') ?? <Ausente />}</Linha>
          {naoTraz}
          {lugar}
          {autorizacao}
        </>
      );
    } else {
      corpo = (
        <>
          <Linha rotulo="Empresa">{t('emp') ?? <Ausente />}</Linha>
          <Linha rotulo="Situação">{t('sit') ?? <Ausente />}</Linha>
          {naoTraz}
          {lugar}
          {autorizacao}
          <Linha rotulo="Código no SIMP da ANP">{codigo(t('simp'))}</Linha>
        </>
      );
    }
    return {
      sobre,
      titulo: t('nome') ?? String(pr.id),
      cor: corDaInstalacao(sub, p),
      corpo,
      rodape: (
        <>
          {nota}
          {avisoFora}
          <ProcedenciaAnp fonte={fonte} />
        </>
      ),
    };
  }

  if (tipo === 'campo') {
    const fluido = t('fluido');
    return {
      sobre: 'Campo de produção de petróleo e gás',
      titulo: t('nome') ?? String(pr.id),
      cor: fluido === 'oleo' ? p.categoria.oleo : fluido === 'gas' ? p.categoria.gas : null,
      corpo: (
        <>
          <Linha rotulo="Bacia">{t('bacia') ?? <Ausente />}</Linha>
          <Linha rotulo="Operador">{t('oper') ?? <Ausente />}</Linha>
          <Linha rotulo="Etapa">{t('etapa') ?? <Ausente />}</Linha>
          <Linha rotulo="Fluido principal">{fluido ? (FLUIDO_DO_CAMPO[fluido] ?? fluido) : <Ausente />}</Linha>
          <Linha rotulo="Ambiente">{ambiente(t('amb'))}</Linha>
          <Linha rotulo="Descoberta">{dataDaFonte(pr.descoberta)}</Linha>
          <Linha rotulo="Início">{dataDaFonte(pr.inicio)}</Linha>
          <Linha rotulo="Assinatura do contrato">{dataDaFonte(pr.assinatura)}</Linha>
          <Linha rotulo="Término">{dataDaFonte(pr.termino)}</Linha>
          <Linha rotulo="Rodada">{t('rodada') ?? <Ausente />}</Linha>
          <Linha rotulo="Área">{semUnidade('area')}</Linha>
          <Linha rotulo="Lâmina d’água">{semUnidade('lamina')}</Linha>
          <Linha rotulo="Produção">
            <Ausente o="está em outra base da ANP, não nesta camada" />
          </Linha>
          <Linha rotulo="Código da ANP">{codigo(t('cod'))}</Linha>
        </>
      ),
      rodape: (
        <>
          {avisoFora}
          <ProcedenciaAnp fonte={comb?.campos.fontes[0]} />
        </>
      ),
    };
  }

  if (tipo === 'bloco') {
    return {
      sobre: 'Bloco exploratório sob contrato',
      titulo: t('nome') ?? String(pr.id),
      cor: null,
      corpo: (
        <>
          <Linha rotulo="Nome fantasia">{t('fantasia') ?? <Ausente />}</Linha>
          <Linha rotulo="Bacia">{t('bacia') ?? <Ausente />}</Linha>
          <Linha rotulo="Operador">{t('oper') ?? <Ausente />}</Linha>
          <Linha rotulo="Rodada">{t('rodada') ?? <Ausente />}</Linha>
          <Linha rotulo="Ambiente">{ambiente(t('amb'))}</Linha>
          <Linha rotulo="Assinatura do contrato">{dataDaFonte(pr.assinatura)}</Linha>
          <Linha rotulo="Término">{dataDaFonte(pr.termino)}</Linha>
          <Linha rotulo="Descobertas">{n('descobertas') != null ? inteiro(n('descobertas')) : <Ausente />}</Linha>
          <Linha rotulo="Área">{semUnidade('area')}</Linha>
          <Linha rotulo="Código da ANP">{codigo(t('cod'))}</Linha>
        </>
      ),
      rodape: (
        <>
          {avisoFora}
          <ProcedenciaAnp fonte={comb?.blocos.fontes[0]} />
        </>
      ),
    };
  }

  if (tipo === 'bacia-sedimentar') {
    const sit = t('sit');
    return {
      sobre: 'Bacia sedimentar',
      titulo: t('nome') ?? String(pr.id),
      cor: p.sedimento,
      corpo: (
        <>
          <Linha rotulo="Situação">{sit === 'maritima' ? 'marítima' : (sit ?? <Ausente />)}</Linha>
          <Linha rotulo="Área declarada">{n('km2') != null ? `${inteiro(n('km2'))} km²` : <Ausente />}</Linha>
        </>
      ),
      rodape: (
        <>
          {avisoFora}
          <p className="atl-nota">Contorno como a ANP publica, simplificado para a escala do mapa.</p>
          <ProcedenciaAnp fonte={comb?.baciasSedimentares.fontes[0]} />
        </>
      ),
    };
  }

  // pré-sal
  return {
    sobre: 'Área delimitada pela ANP',
    titulo: 'Polígono do pré-sal',
    cor: null,
    corpo: <Linha rotulo="Contorno">{comb ? `Como a ANP publica, com ${inteiro(comb.presal.vertices)} vértices, sem simplificação.` : 'Como a ANP publica.'}</Linha>,
    rodape: <ProcedenciaAnp fonte={comb?.presal.fontes[0]} />,
  };
}
