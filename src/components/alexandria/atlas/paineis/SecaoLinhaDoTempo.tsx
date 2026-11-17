// Atlas da Alexandria v3 — "A rede" › a linha do tempo da frota.
//
// Um ano escolhido: o mapa mostra só o que já operava (o controle filtra; a regra única
// está em lib/alexandria/atlas/tempo.ts) e o gráfico mostra o que entrou em cada período
// de cinco anos, por fonte. É a idade da frota de HOJE, não a história da matriz: usina
// desativada não está no cadastro. Tudo o que está na tela sai do arquivo das usinas e do
// índice; nenhum número digitado.

import { useEffect, useMemo, useRef, useState, type PointerEvent as EvPonteiro } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { carregarIndice, dataBr, decimal, inteiro, potencia } from '@/lib/alexandria/atlas/dados';
import { PALETA } from '@/lib/alexandria/atlas/estilo';
import { faixasDoTempo, type FonteDeUsinas, type LinhaDoTempoDaFrota } from '@/lib/alexandria/atlas/tempo';
import { CATEGORIAS, ROTULO_CATEGORIA, type Categoria, type IndiceDoAtlas } from '@/lib/alexandria/atlas/tipos';
import { ReguaDoTempo } from '../ReguaDoTempo';
import { ComoLer } from './PainelRede';
import '../atlas-tempo.css';

/** Como cada arquivo das usinas está: a página sabe (codigo.md 20); sem a prop, supõe o caso feliz. */
export interface SituacaoDasUsinas {
  principais: 'carregando' | 'ok' | 'erro';
  menores: 'carregando' | 'ok' | 'erro';
}

export interface SecaoLinhaDoTempoProps {
  /** principais e menores (arquivo colunar ou feições expandidas); [] enquanto carrega */
  usinas: readonly FonteDeUsinas[];
  /** null = hoje */
  anoLimite: number | null;
  aoMudarAno: (ano: number | null) => void;
  modo: ModoV3;
  /** o "percorrer" começou (true) ou parou (false): a página liga o filtro barato do mapa */
  aoTocar?: (tocando: boolean) => void;
  situacao?: SituacaoDasUsinas;
  /** sem o próprio "Como ler" (o painel de "A rede" tem um só, com MetodoDoTempo) */
  semComoLer?: boolean;
}

/** um ano a cada tanto, ao tocar (≈ 14 s de 1901 a 2026) */
const PASSO_DO_TOQUE_MS = 110;
/** a frase da soma só é anunciada ao leitor de tela depois de o ano parar por este tanto */
const FOLGA_DO_ANUNCIO_MS = 500;

/**
 * O que a seção pode dizer sobre o cadastro: carregando, em erro, completo ou parcial.
 * Sem `situacao`, deduz do número de arquivos (o caso feliz: principais primeiro).
 */
function estadoDoCadastro(usinas: readonly FonteDeUsinas[], s: SituacaoDasUsinas | undefined): { pronto: boolean; erro: boolean; parcial: boolean; erroMenores: boolean } {
  if (!s)
    return {
      pronto: usinas.length > 0,
      erro: false,
      parcial: usinas.length === 1,
      erroMenores: false,
    };
  if (s.principais === 'erro') return { pronto: false, erro: true, parcial: false, erroMenores: false };
  if (s.principais === 'carregando' || !usinas.length) return { pronto: false, erro: false, parcial: false, erroMenores: false };
  return {
    pronto: true,
    erro: false,
    parcial: s.menores !== 'ok',
    erroMenores: s.menores === 'erro',
  };
}

/** Frase do cadastro parcial, a mesma nas três peças. */
export function fraseDoParcial(erroMenores: boolean): string {
  return erroMenores ? 'Só as usinas de 5 MW ou mais: o arquivo das menores não respondeu agora.' : 'Só as usinas de 5 MW ou mais por enquanto; as menores ainda carregam.';
}

/**
 * Tocar: do primeiro ano (ou do ano corrente) ao último, e então "hoje". Avisa `aoTocar`
 * ao começar e ao parar, para o mapa usar o filtro barato durante o percurso.
 */
function useTocar(t: LinhaDoTempoDaFrota | null, anoLimite: number | null, aoMudarAno: (a: number | null) => void, aoTocar: ((v: boolean) => void) | undefined, reduzido: boolean) {
  const [tocando, setTocando] = useState(false);
  const anoRef = useRef(anoLimite);
  anoRef.current = anoLimite;
  useEffect(() => {
    if (!tocando || !t) return;
    const id = window.setInterval(() => {
      const a = anoRef.current;
      if (a == null || a >= t.ultimoAno) {
        aoMudarAno(null);
        setTocando(false);
        return;
      }
      aoMudarAno(a + 1);
    }, PASSO_DO_TOQUE_MS);
    return () => window.clearInterval(id);
  }, [tocando, t, aoMudarAno]);
  useEffect(() => {
    if (reduzido) setTocando(false);
  }, [reduzido]);
  const aoTocarRef = useRef(aoTocar);
  aoTocarRef.current = aoTocar;
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    aoTocarRef.current?.(tocando);
  }, [tocando]);
  // desmontar tocando (troca de capítulo, de lente) não pode deixar o mapa no filtro barato
  useEffect(() => () => aoTocarRef.current?.(false), []);
  const tocar = () => {
    if (!t) return;
    if (tocando) return setTocando(false);
    if (anoLimite == null || anoLimite >= t.ultimoAno) aoMudarAno(t.primeiroAno);
    setTocando(true);
  };
  return { tocando, setTocando, tocar };
}

/** O texto anunciado segue o visível, mas só depois de o ano parar (codigo.md 23). */
function useAnuncio(texto: string, calado: boolean): string {
  const [anunciado, setAnunciado] = useState(texto);
  useEffect(() => {
    if (calado) return;
    const id = window.setTimeout(() => setAnunciado(texto), FOLGA_DO_ANUNCIO_MS);
    return () => window.clearTimeout(id);
  }, [texto, calado]);
  return anunciado;
}

/** A régua vai de primeiroAno a ultimoAno + 1, e o último degrau é "hoje" (codigo.md 25). */
const deRegua = (a: number, t: LinhaDoTempoDaFrota): number | null => (a > t.ultimoAno ? null : a);

const L = 320;
const ALTURA = 132;
const M = { e: 30, d: 4, t: 22, b: 18 };

function useReduzido(): boolean {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return r;
}

const fontesDe = (t: LinhaDoTempoDaFrota): Categoria[] => CATEGORIAS.filter((c) => t.faixas.some((f) => (f.porFonte[c] ?? 0) > 0));

/** kW de uma fonte que entrou no período e já operava em `limite` (null = o período inteiro) */
function kwNoPeriodo(t: LinhaDoTempoDaFrota, de: number, ateAno: number, c: Categoria, limite: number | null): number {
  const lim = limite == null ? ateAno : Math.min(ateAno, limite);
  if (lim < de) return 0;
  const acc = t.acumuladoPorFonte[c];
  const i1 = lim - t.primeiroAno;
  const i0 = de - 1 - t.primeiroAno;
  return (acc[i1] ?? 0) - (i0 >= 0 ? (acc[i0] ?? 0) : 0);
}

interface PeriodoDoCursor {
  de: number;
  kw: number;
  dominante: Categoria | null;
  pct: number;
}

/** O período do cursor, do começo dele até o ano escolhido: o que o leitor aponta no gráfico. */
function periodoDoAno(t: LinhaDoTempoDaFrota, anoLimite: number | null): PeriodoDoCursor | null {
  if (anoLimite == null) return null;
  const f = t.faixas.find((x) => anoLimite >= x.de && anoLimite <= x.ate);
  if (!f) return null;
  const por = fontesDe(t).map((c) => [c, kwNoPeriodo(t, f.de, f.ate, c, anoLimite)] as const);
  const kw = por.reduce((s, [, v]) => s + v, 0);
  const [dom, v] = por.reduce((a, b) => (b[1] > a[1] ? b : a), por[0] ?? ['outros' as Categoria, 0]);
  return {
    de: f.de,
    kw,
    dominante: kw > 0 ? dom : null,
    pct: kw > 0 ? Math.round((100 * v) / kw) : 0,
  };
}

/** A frase da soma em texto corrido (a que o leitor de tela ouve). */
function fraseDaSoma(t: LinhaDoTempoDaFrota, anoLimite: number | null, p: PeriodoDoCursor | null): string {
  if (anoLimite == null || !p) return `Cada barra é o que entrou em operação em ${t.passo} anos, por fonte, das usinas que operam hoje no Brasil.`;
  const inicio = p.de === anoLimite ? 'Em ' : `De ${p.de} a `;
  const dom = p.dominante ? ` (${p.pct}% ${ROTULO_CATEGORIA[p.dominante].toLowerCase()})` : '';
  return `${inicio}${anoLimite}, no Brasil todo, entraram ${potencia(p.kw)} das usinas de hoje${dom}.`;
}

/** Topo redondo da escala (12,3 → 15; 41 → 50), para os rótulos não dançarem. */
function topo(v: number): number {
  if (!(v > 0)) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const k of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (k * p >= v) return k * p;
  return 10 * p;
}

export function SecaoLinhaDoTempo({ usinas, anoLimite, aoMudarAno, modo, aoTocar, situacao, semComoLer }: SecaoLinhaDoTempoProps) {
  const reduzido = useReduzido();
  const [indice, setIndice] = useState<IndiceDoAtlas | null>(null);
  useEffect(() => {
    let vivo = true;
    carregarIndice().then(
      (i) => vivo && setIndice(i),
      () => undefined,
    );
    return () => {
      vivo = false;
    };
  }, []);

  const cadastro = estadoDoCadastro(usinas, situacao);
  const t = useMemo(() => (cadastro.pronto ? faixasDoTempo(usinas) : null), [usinas, cadastro.pronto]);
  const cores = PALETA[modo].categoria;

  const { tocando, setTocando, tocar } = useTocar(t, anoLimite, aoMudarAno, aoTocar, reduzido);

  // ── o gráfico ──
  const svg = useRef<SVGSVGElement | null>(null);
  const geo = useMemo(() => {
    if (!t) return null;
    const inicio = t.faixas[0].de;
    const fim = t.ultimoAno + 1;
    const lw = L - M.e - M.d;
    const x = (ano: number) => M.e + ((ano - inicio) / (fim - inicio)) * lw;
    const somaFaixa = t.faixas.map((f) => Object.values(f.porFonte).reduce((a, b) => a + b, 0));
    const teto = topo(Math.max(...somaFaixa) / 1e6) * 1e6;
    const lh = ALTURA - M.t - M.b;
    const y = (kw: number) => M.t + lh - (kw / teto) * lh;
    return { inicio, fim, lw, lh, x, y, teto };
  }, [t]);

  const anoDoX = (clienteX: number): number | null => {
    if (!t || !geo || !svg.current) return null;
    const r = svg.current.getBoundingClientRect();
    if (!r.width) return null;
    const px = ((clienteX - r.left) / r.width) * L;
    const ano = Math.floor(geo.inicio + ((px - M.e) / geo.lw) * (geo.fim - geo.inicio));
    return Math.max(t.primeiroAno, Math.min(t.ultimoAno, ano));
  };
  // arrasto que não rouba a rolagem (o mesmo trato de graficos.tsx): no dedo, só o gesto horizontal
  const gesto = useRef<{
    id: number;
    x: number;
    y: number;
    arrastando: boolean;
  } | null>(null);
  const aplicar = (cx: number) => {
    const a = anoDoX(cx);
    if (a != null) {
      setTocando(false);
      aoMudarAno(a);
    }
  };
  const ponteiro = {
    onPointerDown: (e: EvPonteiro<SVGSVGElement>) => {
      const toque = e.pointerType === 'touch';
      gesto.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        arrastando: !toque,
      };
      if (!toque) {
        e.currentTarget.setPointerCapture(e.pointerId);
        aplicar(e.clientX);
      }
    },
    onPointerMove: (e: EvPonteiro<SVGSVGElement>) => {
      const g = gesto.current;
      if (!g || g.id !== e.pointerId) return;
      if (!g.arrastando) {
        const dx = Math.abs(e.clientX - g.x);
        if (dx < 6 || dx <= Math.abs(e.clientY - g.y)) return;
        g.arrastando = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      aplicar(e.clientX);
    },
    onPointerUp: (e: EvPonteiro<SVGSVGElement>) => {
      const g = gesto.current;
      gesto.current = null;
      if (g && g.id === e.pointerId && !g.arrastando) aplicar(e.clientX);
    },
    onPointerCancel: () => {
      gesto.current = null;
    },
  };

  const periodoDoCursor = t ? periodoDoAno(t, anoLimite) : null;
  const textoFalado = t ? fraseDaSoma(t, anoLimite, periodoDoCursor) : '';
  const anunciado = useAnuncio(textoFalado, tocando);

  if (!t || !geo) {
    return (
      <section className="atl-grupo atl-tempo-frota" data-atlas="linha-do-tempo" data-estado={cadastro.erro ? 'erro' : 'carregando'}>
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">Idade da frota</h2>
        </header>
        <p className="atl-legenda-linha">{cadastro.erro ? 'O cadastro das usinas não respondeu agora. O mapa segue navegável; a linha do tempo volta na próxima tentativa.' : 'Carregando o cadastro das usinas…'}</p>
      </section>
    );
  }

  const fontesPresentes = fontesDe(t);
  const grade = [0, geo.teto / 2, geo.teto];
  const marcasDoEixo = [1900, 1925, 1950, 1975, 2000, 2025].filter((a) => a >= geo.inicio && a <= t.ultimoAno);

  const noPeriodo = (de: number, ateAno: number, c: Categoria, limite: number | null) => kwNoPeriodo(t, de, ateAno, c, limite);
  const comEtapas = t.comEtapas;

  const descricao = `Potência em operação hoje, pela data em que entrou em operação, de ${t.primeiroAno} a ${t.ultimoAno}, em períodos de ${t.passo} anos, por fonte${anoLimite != null ? `; cursor em ${anoLimite}` : ''}.`;

  return (
    <section className="atl-grupo atl-tempo-frota" data-atlas="linha-do-tempo" data-ano={anoLimite ?? 'hoje'}>
      <header className="atl-grupo-cabeca">
        {/* "hoje" é palavra, na serifa do título; só o ano é algarismo em mono */}
        <h2 className="atl-grupo-titulo">{anoLimite == null ? 'Idade da frota hoje' : <>Idade da frota <span className="atl-tf-ano atl-num">{anoLimite}</span></>}</h2>
        {anoLimite != null && (
          <button
            type="button"
            className="atl-grupo-acao"
            onClick={() => {
              setTocando(false);
              aoMudarAno(null);
            }}
          >
            Voltar a hoje
          </button>
        )}
      </header>

      <svg ref={svg} className="atl-grafico atl-tf-grafico" viewBox={`0 0 ${L} ${ALTURA}`} role="img" aria-label={descricao} {...ponteiro}>
        <text x={1} y={M.t - 10} className="atl-grafico-eixo atl-grafico-unidade">
          GW que entraram em cada {t.passo} anos
        </text>
        {grade.map((v) => (
          <g key={v}>
            <line x1={M.e} x2={L - M.d} y1={geo.y(v)} y2={geo.y(v)} className="atl-grafico-grade" />
            <text x={M.e - 5} y={geo.y(v) + 4} textAnchor="end" className="atl-grafico-eixo">
              {decimal(v / 1e6).replace(/,0$/, '')}
            </text>
          </g>
        ))}
        {t.faixas.map((f) => {
          const x0 = geo.x(f.de) + 0.6;
          const x1 = geo.x(f.ate + 1) - 0.6;
          const w = Math.max(0.8, x1 - x0);
          // fantasma (o período inteiro) por baixo; por cima, cheio, o que já entrara no ano escolhido
          let baseFantasma = 0;
          let baseCheia = 0;
          // para a conferência (bancada): kW do período que já entrara no ano escolhido
          const kwCheio = fontesPresentes.reduce((s, c) => s + noPeriodo(f.de, f.ate, c, anoLimite), 0);
          return (
            <g key={f.de} data-de={f.de} data-ate={f.ate} data-kw={Math.round(kwCheio)}>
              {anoLimite != null &&
                fontesPresentes.map((c) => {
                  const kw = f.porFonte[c] ?? 0;
                  if (!kw) return null;
                  const y0 = geo.y(baseFantasma);
                  baseFantasma += kw;
                  return <rect key={c} x={x0} width={w} y={geo.y(baseFantasma)} height={Math.max(0, y0 - geo.y(baseFantasma))} fill={cores[c]} className="atl-tf-fantasma" />;
                })}
              {fontesPresentes.map((c) => {
                const kw = noPeriodo(f.de, f.ate, c, anoLimite);
                if (!kw) return null;
                const y0 = geo.y(baseCheia);
                baseCheia += kw;
                return <rect key={c} x={x0} width={w} y={geo.y(baseCheia)} height={Math.max(0, y0 - geo.y(baseCheia))} fill={cores[c]} />;
              })}
            </g>
          );
        })}
        {marcasDoEixo.map((a) => (
          <text key={a} x={geo.x(a)} y={ALTURA - 4} textAnchor={a === marcasDoEixo[0] ? 'start' : geo.x(a) + 16 > L ? 'end' : 'middle'} className="atl-grafico-eixo">
            {a}
          </text>
        ))}
        {anoLimite != null && <line x1={geo.x(anoLimite + 1)} x2={geo.x(anoLimite + 1)} y1={M.t - 4} y2={M.t + geo.lh + 2} className="atl-grafico-cursor" />}
      </svg>

      {/* o que o leitor de tela ouve: o mesmo texto, só depois de o ano parar, calado no percorrer */}
      <p className="atl-tf-falado" aria-live={tocando ? 'off' : 'polite'} data-atlas="soma-falada">
        {anunciado}
      </p>
      <p className="atl-legenda-linha atl-tf-soma" aria-hidden="true" data-atlas="soma-do-ano">
        {anoLimite != null && periodoDoCursor ? (
          <>
            {periodoDoCursor.de === anoLimite ? (
              'Em '
            ) : (
              <>
                De <span className="atl-num">{periodoDoCursor.de}</span> a{' '}
              </>
            )}
            <span className="atl-num">{anoLimite}</span>, no Brasil todo, entraram <span className="atl-num">{potencia(periodoDoCursor.kw)}</span> das usinas de hoje
            {periodoDoCursor.dominante ? (
              <>
                {' '}
                (<span className="atl-num">{periodoDoCursor.pct}%</span> {ROTULO_CATEGORIA[periodoDoCursor.dominante].toLowerCase()})
              </>
            ) : null}
            .
          </>
        ) : (
          <>Cada barra é o que entrou em operação em {t.passo} anos, por fonte, das usinas que operam hoje no Brasil.</>
        )}
      </p>

      <p className="atl-legenda-linha atl-tf-regra" data-atlas="regra-do-ano" data-com-etapas={comEtapas.n}>
        <FraseDaRegra t={t} />
      </p>

      <ul className="atl-tf-legenda" aria-label="Fontes no gráfico">
        {fontesPresentes.map((c) => (
          <li key={c}>
            <span className="atl-tf-amostra" style={{ background: cores[c] }} aria-hidden="true" />
            {ROTULO_CATEGORIA[c]}
          </li>
        ))}
      </ul>

      {/* a régua vai até "hoje" (ultimoAno + 1): de hoje, → e End não fazem nada (codigo.md 25) */}
      <ReguaDoTempo
        valor={anoLimite ?? t.ultimoAno + 1}
        min={t.primeiroAno}
        max={t.ultimoAno + 1}
        salto={10}
        rotulo="Ano"
        falado={anoLimite == null ? 'hoje' : String(anoLimite)}
        aoMudar={(a) => {
          setTocando(false);
          aoMudarAno(deRegua(a, t));
        }}
      />
      <p className="atl-regua-anos" aria-hidden="true">
        <span>{t.primeiroAno}</span>
        <span>hoje</span>
      </p>
      <div className="atl-tempo-acoes">
        <span className="atl-passos">
          <button type="button" className="atl-passo" onClick={() => aoMudarAno(anoLimite == null ? t.ultimoAno : Math.max(t.primeiroAno, anoLimite - 1))} disabled={anoLimite != null && anoLimite <= t.primeiroAno} aria-label="Ano anterior">
            ‹
          </button>
          <button type="button" className="atl-passo" onClick={() => aoMudarAno(anoLimite == null || anoLimite >= t.ultimoAno ? null : anoLimite + 1)} disabled={anoLimite == null} aria-label="Ano seguinte">
            ›
          </button>
        </span>
        {!reduzido && (
          <button type="button" className="atl-tocar" onClick={tocar} aria-pressed={tocando}>
            {tocando ? (
              <>
                Pausar <span aria-hidden="true">❚❚</span>
              </>
            ) : anoLimite == null || anoLimite >= t.ultimoAno ? (
              <>
                Percorrer {t.primeiroAno}–{t.ultimoAno} <span aria-hidden="true">▸</span>
              </>
            ) : (
              <>
                Continuar <span aria-hidden="true">▸</span>
              </>
            )}
          </button>
        )}
      </div>

      {anoLimite != null && (
        <p className="atl-legenda-linha atl-tf-semano" data-atlas="sem-ano">
          Fora da conta: <span className="atl-num">{inteiro(t.semAno.n)}</span> usinas em operação sem ano no cadastro (<span className="atl-num">{potencia(t.semAno.kw)}</span>; a maior tem{' '}
          <span className="atl-num">{potencia(t.maiorSemAno)}</span>).
        </p>
      )}
      {cadastro.parcial && <p className="atl-legenda-linha atl-fraco">{fraseDoParcial(cadastro.erroMenores)}</p>}

      {!semComoLer && (
        <ComoLer>
          <CorpoDoMetodo t={t} indice={indice} />
        </ComoLer>
      )}
    </section>
  );
}

/**
 * A regra do ano em uma linha, visível junto do número que ela muda: quantas usinas têm a
 * data de cada unidade (ONS) e o que acontece com as outras. Sai das contas, nunca digitada.
 */
export function FraseDaRegra({ t }: { t: LinhaDoTempoDaFrota }) {
  const c = t.comEtapas;
  if (c.n > 0)
    return (
      <>
        Só usinas que operam hoje. <span className="atl-num">{inteiro(c.n)}</span> têm a data de cada unidade no cadastro do ONS (<span className="atl-num">{potencia(c.kw)}</span>) e crescem ano a ano; as outras entram inteiras no ano que a
        ANEEL registra.
      </>
    );
  return <>Só usinas que operam hoje, inteiras e com a potência de hoje, no ano que a ANEEL registra para o empreendimento.</>;
}

export interface ReguaCompactaDoAnoProps {
  /** o mesmo usinasDaFrota da página ([] enquanto carrega) */
  usinas: readonly FonteDeUsinas[];
  /** null = hoje */
  anoLimite: number | null;
  aoMudarAno: (ano: number | null) => void;
  /** aceito para a assinatura igual à das seções; as cores vêm dos tokens do modo */
  modo?: ModoV3;
  /** o "percorrer" começou (true) ou parou (false) */
  aoTocar?: (tocando: boolean) => void;
  situacao?: SituacaoDasUsinas;
  /** sem a linha da regra sob o trilho (quem monta já a mostra perto) */
  semRegra?: boolean;
}

/**
 * A régua do ano em uma linha, para colar sob o número grande do painel de "A rede":
 * primeiro ano · trilho (o histograma do que entrou em cada ano é o fundo dele) · hoje · tocar.
 * O último degrau do trilho é "hoje" (tudo, inclusive as sem ano). Não repete o número.
 */
export function ReguaCompactaDoAno({ usinas, anoLimite, aoMudarAno, aoTocar, situacao, semRegra }: ReguaCompactaDoAnoProps) {
  const reduzido = useReduzido();
  const cadastro = estadoDoCadastro(usinas, situacao);
  // os extremos da régua (o primeiro ano, o histograma) só valem com o cadastro inteiro: com só
  // as principais, o primeiro ano seria o delas (1905 em vez de 1901). Espera as menores; se
  // elas falharem, mostra a régua das principais e diz que é parcial.
  const esperando = cadastro.pronto && cadastro.parcial && !cadastro.erroMenores;
  const prontoDeVez = cadastro.pronto && !esperando;
  const t = useMemo(() => (prontoDeVez ? faixasDoTempo(usinas) : null), [usinas, prontoDeVez]);
  const { tocando, setTocando, tocar } = useTocar(t, anoLimite, aoMudarAno, aoTocar, reduzido);
  const histo = useMemo(() => {
    if (!t) return null;
    const teto = Math.max(...t.entradaPorAno, 1);
    return t.entradaPorAno.map((kw, i) => ({
      ano: t.primeiroAno + i,
      h: kw / teto,
    }));
  }, [t]);

  if (!t || !histo) {
    return (
      <div className="atl-rac" data-atlas="regua-compacta" data-estado={cadastro.erro ? 'erro' : 'carregando'}>
        <p className="atl-legenda-linha atl-fraco">{cadastro.erro ? 'O cadastro das usinas não respondeu agora; o ano volta na próxima tentativa.' : 'Carregando o ano de entrada das usinas…'}</p>
      </div>
    );
  }

  const nAnos = t.ultimoAno + 1 - t.primeiroAno;
  return (
    <div className="atl-rac-bloco" data-atlas="regua-compacta" data-ano={anoLimite ?? 'hoje'} data-com-etapas={t.comEtapas.n}>
      <div className="atl-rac">
        <span className="atl-rac-ponta atl-num" aria-hidden="true">
          {t.primeiroAno}
        </span>
        <div className="atl-rac-trilho">
          <svg className="atl-rac-histo" viewBox={`0 0 ${nAnos} 1`} preserveAspectRatio="none" aria-hidden="true">
            {histo.map(({ ano, h }) =>
              h > 0 ? <rect key={ano} x={ano - t.primeiroAno} width={1} y={1 - Math.max(h, 0.04)} height={Math.max(h, 0.04)} className={anoLimite == null || ano <= anoLimite ? 'atl-rac-feito' : 'atl-rac-falta'} /> : null,
            )}
          </svg>
          <ReguaDoTempo
            valor={anoLimite ?? t.ultimoAno + 1}
            min={t.primeiroAno}
            max={t.ultimoAno + 1}
            salto={10}
            rotulo="Ano do mapa"
            falado={anoLimite == null ? 'hoje' : String(anoLimite)}
            marcas={2}
            aoMudar={(a) => {
              setTocando(false);
              aoMudarAno(deRegua(a, t));
            }}
          />
        </div>
        <span className="atl-rac-ponta" aria-hidden="true">
          hoje
        </span>
        {!reduzido && (
          <button
            type="button"
            className="atl-rac-tocar"
            onClick={tocar}
            aria-pressed={tocando}
            aria-label={tocando ? 'Pausar' : anoLimite == null || anoLimite >= t.ultimoAno ? `Percorrer ${t.primeiroAno}–${t.ultimoAno}` : 'Continuar'}
            title={tocando ? 'Pausar' : `Percorrer os anos até hoje`}
          >
            <span aria-hidden="true">{tocando ? '❚❚' : '▶'}</span>
          </button>
        )}
      </div>
      {/* a regra do ano, visível junto do número que ela muda (6.1), só quando há ano escolhido */}
      {anoLimite != null && !semRegra && (
        <p className="atl-rac-regra" data-atlas="regra-do-ano">
          Só usinas que operam hoje;{' '}
          {t.comEtapas.n > 0 ? (
            <>
              <span className="atl-num">{inteiro(t.comEtapas.n)}</span> com a data de cada unidade (ONS), as outras inteiras no ano da ANEEL.
            </>
          ) : (
            <>inteiras, no ano que a ANEEL registra.</>
          )}
        </p>
      )}
      {cadastro.parcial && <p className="atl-rac-regra">{fraseDoParcial(cadastro.erroMenores)}</p>}
    </div>
  );
}

/** O método da linha do tempo em parágrafos, sem moldura (o "Como ler" único do painel o põe onde quiser). */
function CorpoDoMetodo({ t, indice }: { t: LinhaDoTempoDaFrota; indice: IndiceDoAtlas | null }) {
  const dataBase = indice?.camadas.usinas.dataBase ?? t.dataBase;
  const li = indice?.camadas.linhas;
  const se = indice?.camadas.subestacoes;
  const linhasComCarga = li?.emOperacaoComDataDeCarga ?? null;
  const datasDeCarga = li?.datasDeCargaDoCadastro ?? [];
  const comEtapas = t.comEtapas;
  const semEtapas = {
    n: t.total.n - t.semAno.n - comEtapas.n,
    kw: t.total.kw - t.semAno.kw - comEtapas.kw,
  };
  return (
    <>
      <p>Só entram as usinas que operam hoje. Usina desativada não está no cadastro da ANEEL, então isto é a idade da frota atual, não a história completa da matriz: o que fechou ou foi substituído não aparece em ano nenhum.</p>
      <p>
        {comEtapas.n > 0 ? (
          <>
            Datas por unidade: o cadastro do ONS (unidades geradoras) dá a entrada de cada unidade das usinas que ele opera. Casada pelo código CEG, a usina conta em cada ano só as unidades que já operavam, e a soma delas é ajustada à
            potência da ANEEL. As outras <span className="atl-num">{inteiro(semEtapas.n)}</span> (<span className="atl-num">{potencia(semEtapas.kw)}</span>) entram inteiras, com a potência de hoje, no ano em que a ANEEL registra a entrada
            em operação do empreendimento.
          </>
        ) : (
          <>
            O ano é o da data de entrada em operação que a ANEEL registra para o empreendimento; a usina entra inteira nesse ano, com a potência de hoje, mesmo quando unidades entraram depois. O cadastro do ONS data cada unidade, mas o
            arquivo publicado ainda não traz essas datas.
          </>
        )}
        {dataBase ? (
          <>
            {' '}
            O último período vai até a data-base do cadastro, <span className="atl-num">{dataBr(dataBase)}</span>.
          </>
        ) : null}
      </p>
      <p>
        Sem ano no cadastro: <span className="atl-num">{inteiro(t.semAno.n)}</span> usinas em operação (<span className="atl-num">{potencia(t.semAno.kw)}</span>), contadas à parte e nunca num ano qualquer. Com um ano escolhido, ficam no mapa em contorno, sem a cor da fonte; são
        pequenas (a maior tem <span className="atl-num">{potencia(t.maiorSemAno)}</span>) e só aparecem de perto.
      </p>
      {li && (
        <p>
          Linhas: <span className="atl-num">{inteiro(li.total - li.previstas - (linhasComCarga ?? 0))}</span> têm ano de entrada;{' '}
          {linhasComCarga != null && (
            <>
              <span className="atl-num">{inteiro(linhasComCarga)}</span> trazem só a data em que a base foi carregada ({datasDeCarga.map(dataBr).join(' ou ')}): já operavam nela, sem se saber desde quando, e aparecem a partir dela;{' '}
            </>
          )}
          <span className="atl-num">{inteiro(li.previstas)}</span> não têm entrada em operação e ficam fora com um ano escolhido.{linhasComCarga ? ' Antes da data de carga, as linhas e subestações que só trazem essa data ficam em fio fino.' : ''}
          {se?.emOperacaoComDataDeCarga != null && (
            <>
              {' '}
              Subestações com a data de carga: <span className="atl-num">{inteiro(se.emOperacaoComDataDeCarga)}</span>, pela mesma regra.
            </>
          )}
        </p>
      )}
    </>
  );
}

/** O método da linha do tempo para o "Como ler" único do painel de "A rede": só os parágrafos. */
export function MetodoDoTempo({ usinas, situacao }: { usinas: readonly FonteDeUsinas[]; situacao?: SituacaoDasUsinas }) {
  const [indice, setIndice] = useState<IndiceDoAtlas | null>(null);
  useEffect(() => {
    let vivo = true;
    carregarIndice().then(
      (i) => vivo && setIndice(i),
      () => undefined,
    );
    return () => {
      vivo = false;
    };
  }, []);
  const cadastro = estadoDoCadastro(usinas, situacao);
  const t = useMemo(() => (cadastro.pronto ? faixasDoTempo(usinas) : null), [usinas, cadastro.pronto]);
  if (!t) return <p>{cadastro.erro ? 'O cadastro das usinas não respondeu agora; o método da linha do tempo volta com ele.' : 'Carregando o cadastro das usinas…'}</p>;
  return <CorpoDoMetodo t={t} indice={indice} />;
}
