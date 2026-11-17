// Atlas da Alexandria v3 — gráficos pequenos, desenhados em SVG à mão.
// Sem biblioteca: são três formas simples e precisam obedecer à tinta da casa.
//
// Os textos do eixo usam .atl-grafico-eixo (11 unidades do viewBox, o piso da
// casa). As margens são calculadas pelo rótulo mais largo, e não fixas: um
// número que não cabe é cortado pela borda do SVG sem aviso.

import { useCallback, useRef, type MouseEvent as EvMouse, type PointerEvent as EvPonteiro } from 'react';

export interface SerieDoGrafico {
  chave: string;
  rotulo: string;
  cor: string;
  valores: (number | null)[];
}

interface LinhaDoTempoProps {
  meses: string[];
  series: SerieDoGrafico[];
  indice: number;
  aoMudar: (i: number) => void;
  /** domínio vertical; por omissão 0–100 (%) */
  dominio?: [number, number];
  altura?: number;
  /** marcas no eixo (vistas das aulas ancoradas num mês) */
  marcas?: { indice: number; rotulo: string; aoAbrir?: () => void }[];
  rotuloDoEixo?: string;
  /** como escrever os números do eixo vertical; por omissão, milhar abreviado ("5 mil") */
  formatoDoEixo?: (v: number) => string;
  descricao: string;
}

const L = 320;
const MARGEM = { e: 26, d: 6, t: 8, b: 18 };
/** corpo do texto do eixo, em unidades do viewBox (espelha .atl-grafico-eixo) */
const CORPO_EIXO = 11;
/** avanço médio de um glifo do IBM Plex Mono, em fração do corpo */
const AVANCO = 0.6;
/** espaço acima da área para o nome da unidade */
const FAIXA_DA_UNIDADE = 14;

const largura = (texto: string) => texto.length * AVANCO * CORPO_EIXO;

/** "5 mil", "−10 mil", "250", "2,5 mil": milhar abreviado, sinal tipográfico. */
function numeroCurto(v: number): string {
  const sinal = v < 0 ? '−' : '';
  const a = Math.abs(v);
  if (a >= 1000) {
    const mil = a / 1000;
    const txt = mil.toLocaleString('pt-BR', { maximumFractionDigits: mil < 10 && mil % 1 !== 0 ? 1 : 0 });
    return `${sinal}${txt} mil`;
  }
  return `${sinal}${Math.round(a).toLocaleString('pt-BR')}`;
}

/** Âncora de um texto centrado que não pode sair do viewBox. */
function ancora(x: number, texto: string): { x: number; anchor: 'start' | 'middle' | 'end' } {
  const meia = largura(texto) / 2;
  if (x - meia < 1) return { x: 1, anchor: 'start' };
  if (x + meia > L - 1) return { x: L - 1, anchor: 'end' };
  return { x, anchor: 'middle' };
}

/**
 * Arrasto que não rouba a rolagem. Mouse e caneta confirmam já no apertar.
 * No dedo, o apertar só guarda a origem: o gesto vira arrasto quando anda
 * mais na horizontal que na vertical (e passa de 6 px); um toque parado
 * confirma ao soltar; uma rolagem vertical (o navegador cancela o ponteiro,
 * pois o gráfico declara touch-action: pan-y) não muda nada.
 */
function useArrasto(aplicar: (clienteX: number, el: SVGSVGElement) => void) {
  const pendente = useRef<{ id: number; x: number; y: number; arrastando: boolean } | null>(null);
  return {
    onPointerDown: (e: EvPonteiro<SVGSVGElement>) => {
      if (e.pointerType === 'touch') {
        pendente.current = { id: e.pointerId, x: e.clientX, y: e.clientY, arrastando: false };
        return;
      }
      pendente.current = { id: e.pointerId, x: e.clientX, y: e.clientY, arrastando: true };
      e.currentTarget.setPointerCapture(e.pointerId);
      aplicar(e.clientX, e.currentTarget);
    },
    onPointerMove: (e: EvPonteiro<SVGSVGElement>) => {
      const p = pendente.current;
      if (!p || p.id !== e.pointerId) return;
      if (!p.arrastando) {
        const dx = Math.abs(e.clientX - p.x);
        const dy = Math.abs(e.clientY - p.y);
        if (dx < 6 || dx <= dy) return;
        p.arrastando = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      aplicar(e.clientX, e.currentTarget);
    },
    onPointerUp: (e: EvPonteiro<SVGSVGElement>) => {
      const p = pendente.current;
      pendente.current = null;
      if (p && p.id === e.pointerId && !p.arrastando) aplicar(e.clientX, e.currentTarget);
    },
    onPointerCancel: () => {
      pendente.current = null;
    },
  };
}

/** Séries mensais com cursor arrastável. */
export function LinhaDoTempo({ meses, series, indice, aoMudar, dominio = [0, 100], altura = 132, marcas = [], rotuloDoEixo, formatoDoEixo = numeroCurto, descricao }: LinhaDoTempoProps) {
  const svg = useRef<SVGSVGElement | null>(null);
  const n = meses.length;
  const linhasH = [dominio[0], (dominio[0] + dominio[1]) / 2, dominio[1]];
  const rotulosH = linhasH.map((v) => formatoDoEixo(v));
  const me = Math.max(MARGEM.e, Math.ceil(Math.max(...rotulosH.map(largura)) + 7));
  const mt = rotuloDoEixo ? MARGEM.t + FAIXA_DA_UNIDADE : MARGEM.t;
  const total = altura + (mt - MARGEM.t);
  const lw = L - me - MARGEM.d;
  const lh = altura - MARGEM.t - MARGEM.b;
  const x = (i: number) => me + (n <= 1 ? 0 : (i / (n - 1)) * lw);
  const y = (v: number) => mt + lh - ((v - dominio[0]) / (dominio[1] - dominio[0])) * lh;

  const aplicar = useCallback(
    (clienteX: number, el: SVGSVGElement) => {
      if (n <= 1) return;
      const r = el.getBoundingClientRect();
      const px = ((clienteX - r.left) / r.width) * L;
      const i = Math.round(((px - me) / lw) * (n - 1));
      aoMudar(Math.max(0, Math.min(n - 1, i)));
    },
    [aoMudar, lw, me, n],
  );
  const arrasto = useArrasto(aplicar);

  const anos: { i: number; ano: string }[] = [];
  for (let i = 0; i < n; i++) if (meses[i].endsWith('-01') && Number(meses[i].slice(0, 4)) % 5 === 0) anos.push({ i, ano: meses[i].slice(0, 4) });

  return (
    <svg ref={svg} className="atl-grafico" viewBox={`0 0 ${L} ${total}`} role="img" aria-label={descricao} {...arrasto}>
      {rotuloDoEixo && (
        <text x={1} y={mt - 8} className="atl-grafico-eixo atl-grafico-unidade">
          {rotuloDoEixo}
        </text>
      )}
      {linhasH.map((v, k) => (
        <g key={v}>
          <line x1={me} x2={L - MARGEM.d} y1={y(v)} y2={y(v)} className="atl-grafico-grade" />
          <text x={me - 5} y={y(v) + 4} textAnchor="end" className="atl-grafico-eixo">
            {rotulosH[k]}
          </text>
        </g>
      ))}
      {anos.map((a) => {
        const p = ancora(x(a.i), a.ano);
        return (
          <text key={a.ano} x={p.x} y={total - 4} textAnchor={p.anchor} className="atl-grafico-eixo">
            {a.ano}
          </text>
        );
      })}
      {series.map((s) => {
        let d = '';
        let aberto = false;
        s.valores.forEach((v, i) => {
          if (v == null) {
            aberto = false;
            return;
          }
          d += `${aberto ? 'L' : 'M'}${x(i).toFixed(1)} ${y(Math.max(dominio[0], Math.min(dominio[1], v))).toFixed(1)}`;
          aberto = true;
        });
        return <path key={s.chave} d={d} fill="none" stroke={s.cor} strokeWidth={1.3} strokeLinejoin="round" />;
      })}
      {marcas.map((m, k) => (
        <g key={k} className="atl-grafico-marca">
          <line x1={x(m.indice)} x2={x(m.indice)} y1={mt} y2={mt + lh} />
          <circle cx={x(m.indice)} cy={mt} r={2.6}>
            <title>{m.rotulo}</title>
          </circle>
        </g>
      ))}
      <line x1={x(indice)} x2={x(indice)} y1={mt - 2} y2={mt + lh + 2} className="atl-grafico-cursor" />
      {series.map((s) => {
        const v = s.valores[indice];
        return v == null ? null : <circle key={s.chave} cx={x(indice)} cy={y(Math.max(dominio[0], Math.min(dominio[1], v)))} r={2.8} fill={s.cor} className="atl-grafico-ponto" />;
      })}
    </svg>
  );
}

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

interface FaixasDoAnoProps {
  /** meses da série, 'AAAA-MM' */
  meses: string[];
  series: SerieDoGrafico[];
  /** mês escolhido (índice em `meses`): o ano dele é o desenhado */
  indice: number;
  aoMudar: (i: number) => void;
  dominio: [number, number];
  /** como escrever um valor no título de cada quadro e nos rótulos do eixo */
  formato: (v: number) => string;
  /** linha de referência (o zero das trocas) */
  referencia?: number;
  /** o valor do mês escolhido ao lado do nome de cada quadro (a água já o mostra nas barras acima) */
  valorNoTitulo?: boolean;
  descricao: string;
}

/** Faixa de cada mês do calendário em todos os anos da série: mínimo, mediana e máximo. */
function faixaPorMes(meses: string[], valores: (number | null)[]) {
  const por: number[][] = Array.from({ length: 12 }, () => []);
  meses.forEach((m, i) => {
    const v = valores[i];
    if (v != null) por[Number(m.slice(5, 7)) - 1].push(v);
  });
  return por.map((l) => {
    if (!l.length) return null;
    const o = l.slice().sort((a, b) => a - b);
    const meio = o.length >> 1;
    return { min: o[0], max: o[o.length - 1], mediana: o.length % 2 ? o[meio] : (o[meio - 1] + o[meio]) / 2 };
  });
}

/**
 * O ano escolhido contra a faixa histórica, em pequenas multiplicações (um quadro por
 * série, todos na mesma escala). No lugar de 26 anos sobrepostos: o leitor vê se o ano
 * está alto ou baixo para a época, e o mês escolhido marcado. Clicar num mês do quadro
 * escolhe aquele mês do mesmo ano.
 */
export function FaixasDoAno({ meses, series, indice, aoMudar, dominio, formato, referencia, valorNoTitulo = true, descricao }: FaixasDoAnoProps) {
  const LQ = 160;
  const AQ = 84;
  const m = { e: 4, d: 4, t: 4, b: 14 };
  const lw = LQ - m.e - m.d;
  const lh = AQ - m.t - m.b;
  const x = (k: number) => m.e + (k / 11) * lw;
  const y = (v: number) => m.t + lh - ((Math.max(dominio[0], Math.min(dominio[1], v)) - dominio[0]) / (dominio[1] - dominio[0])) * lh;
  const ano = meses[indice]?.slice(0, 4) ?? '';
  const mesK = Number(meses[indice]?.slice(5, 7) ?? '1') - 1;
  const idxDoAno = Array.from({ length: 12 }, (_, k) => meses.indexOf(`${ano}-${String(k + 1).padStart(2, '0')}`));
  const anos = [meses[0].slice(0, 4), meses[meses.length - 1].slice(0, 4)];
  const escolher = (e: EvMouse<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * LQ;
    const k = Math.max(0, Math.min(11, Math.round(((px - m.e) / lw) * 11)));
    if (idxDoAno[k] >= 0) aoMudar(idxDoAno[k]);
  };
  return (
    <figure className="atl-faixas" aria-label={descricao}>
      <div className="atl-faixas-grade">
        {series.map((s) => {
          const f = faixaPorMes(meses, s.valores);
          const banda = f.every((q) => q)
            ? `M${f.map((q, k) => `${x(k).toFixed(1)} ${y((q as { max: number }).max).toFixed(1)}`).join('L')}L${f
                .map((q, k) => `${x(k).toFixed(1)} ${y((q as { min: number }).min).toFixed(1)}`)
                .reverse()
                .join('L')}Z`
            : '';
          const mediana = f.map((q, k) => (q ? `${k && f[k - 1] ? 'L' : 'M'}${x(k).toFixed(1)} ${y(q.mediana).toFixed(1)}` : '')).join('');
          let linha = '';
          let aberto = false;
          idxDoAno.forEach((i, k) => {
            const v = i >= 0 ? s.valores[i] : null;
            if (v == null) {
              aberto = false;
              return;
            }
            linha += `${aberto ? 'L' : 'M'}${x(k).toFixed(1)} ${y(v).toFixed(1)}`;
            aberto = true;
          });
          const vAgora = s.valores[indice];
          const q = f[mesK];
          return (
            <div key={s.chave} className="atl-faixa">
              <p className="atl-faixa-titulo">
                <span>{s.rotulo}</span>
                {valorNoTitulo && <span className="atl-num">{vAgora == null ? 'sem dado' : formato(vAgora)}</span>}
              </p>
              <svg className="atl-grafico atl-faixa-svg" viewBox={`0 0 ${LQ} ${AQ}`} role="img" aria-label={`${s.rotulo}: ${vAgora == null ? 'sem dado' : formato(vAgora)} em ${MESES_CURTOS[mesK]} de ${ano}${q ? `; de ${anos[0]} a ${anos[1]}, ${MESES_CURTOS[mesK]} foi de ${formato(q.min)} a ${formato(q.max)}` : ''}`} onClick={escolher}>
                {banda && <path d={banda} className="atl-faixa-banda" />}
                {referencia != null && <line x1={m.e} x2={LQ - m.d} y1={y(referencia)} y2={y(referencia)} className="atl-grafico-grade" />}
                <path d={mediana} className="atl-faixa-mediana" />
                <line x1={x(mesK)} x2={x(mesK)} y1={m.t - 2} y2={m.t + lh + 2} className="atl-grafico-cursor" />
                <path d={linha} fill="none" stroke={s.cor} strokeWidth={1.8} strokeLinejoin="round" />
                {vAgora != null && <circle cx={x(mesK)} cy={y(vAgora)} r={3} fill={s.cor} className="atl-grafico-ponto" />}
                <text x={m.e} y={AQ - 2} className="atl-grafico-eixo">
                  jan
                </text>
                <text x={LQ - m.d} y={AQ - 2} textAnchor="end" className="atl-grafico-eixo">
                  dez
                </text>
              </svg>
            </div>
          );
        })}
      </div>
      <figcaption className="atl-faixas-legenda">
        <span className="atl-faixas-item">
          <span className="atl-faixas-chave atl-faixas-chave-linha" aria-hidden="true" /> {ano}
        </span>
        <span className="atl-faixas-item">
          <span className="atl-faixas-chave atl-faixas-chave-banda" aria-hidden="true" /> do menor ao maior, {anos[0]}–{anos[1]}
        </span>
        <span className="atl-faixas-item">
          <span className="atl-faixas-chave atl-faixas-chave-mediana" aria-hidden="true" /> mediana
        </span>
        <span className="atl-faixas-item">
          escala comum, de <span className="atl-num">{formato(dominio[0])}</span> a <span className="atl-num">{formato(dominio[1])}</span>
        </span>
      </figcaption>
    </figure>
  );
}

interface PerfilDoDiaProps {
  /** 24 valores por camada, da base para o topo */
  camadas: { chave: string; cor: string; valores: (number | null)[] }[];
  carga: (number | null)[];
  hora: number;
  aoMudar: (h: number) => void;
  teto: number;
  descricao: string;
}

/** Topo "redondo" da escala, para os rótulos não mudarem a cada mês (54.248 → 60.000). */
function topoRedondo(v: number): number {
  if (!(v > 0)) return 1;
  const passo = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / passo) * passo;
}

/** Um dia médio: áreas empilhadas por fonte e a linha da carga. */
export function PerfilDoDia({ camadas, carga, hora, aoMudar, teto, descricao }: PerfilDoDiaProps) {
  const svg = useRef<SVGSVGElement | null>(null);
  const topo = topoRedondo(teto);
  const emGW = topo >= 1000;
  const escrever = (v: number) => (emGW ? (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : Math.round(v).toLocaleString('pt-BR'));
  const grade = [0, topo / 2, topo];
  const rotulos = grade.map(escrever);
  const m = { e: Math.max(6, Math.ceil(Math.max(...rotulos.map(largura)) + 7)), d: 6, t: 6 + FAIXA_DA_UNIDADE, b: 16 };
  const lh = 74;
  const altura = m.t + lh + m.b;
  const lw = L - m.e - m.d;
  const x = (h: number) => m.e + (h / 23) * lw;
  const y = (v: number) => m.t + lh - (Math.min(v, topo) / topo) * lh;
  const base = new Array(24).fill(0) as number[];
  const areas = camadas.map((c) => {
    const baixo = base.slice();
    const cima = baixo.map((b, h) => b + Math.max(0, c.valores[h] ?? 0));
    for (let h = 0; h < 24; h++) base[h] = cima[h];
    const d = `M${cima.map((v, h) => `${x(h).toFixed(1)} ${y(v).toFixed(1)}`).join('L')}L${baixo
      .map((v, h) => `${x(h).toFixed(1)} ${y(v).toFixed(1)}`)
      .reverse()
      .join('L')}Z`;
    return { chave: c.chave, cor: c.cor, d };
  });
  const linhaCarga = carga.map((v, h) => `${h ? 'L' : 'M'}${x(h).toFixed(1)} ${y(v ?? 0).toFixed(1)}`).join('');
  const aplicar = (clienteX: number, el: SVGSVGElement) => {
    const r = el.getBoundingClientRect();
    const px = ((clienteX - r.left) / r.width) * L;
    aoMudar(Math.max(0, Math.min(23, Math.round(((px - m.e) / lw) * 23))));
  };
  const arrasto = useArrasto(aplicar);
  return (
    <svg ref={svg} className="atl-grafico" viewBox={`0 0 ${L} ${altura}`} role="img" aria-label={descricao} {...arrasto}>
      <text x={1} y={m.t - 8} className="atl-grafico-eixo atl-grafico-unidade">
        {emGW ? 'GW' : 'MW'}
      </text>
      {areas.map((a) => (
        <path key={a.chave} d={a.d} fill={a.cor} opacity={0.88} />
      ))}
      {grade.map((v, k) => (
        <g key={v}>
          <line x1={m.e} x2={L - m.d} y1={y(v)} y2={y(v)} className="atl-grafico-grade" />
          <text x={m.e - 5} y={y(v) + 4} textAnchor="end" className="atl-grafico-eixo">
            {rotulos[k]}
          </text>
        </g>
      ))}
      <path d={linhaCarga} fill="none" className="atl-grafico-carga" />
      {[0, 6, 12, 18, 23].map((h) => {
        const p = ancora(x(h), `${h}h`);
        return (
          <text key={h} x={p.x} y={altura - 3} textAnchor={p.anchor} className="atl-grafico-eixo">
            {h}h
          </text>
        );
      })}
      <line x1={x(hora)} x2={x(hora)} y1={m.t - 2} y2={m.t + lh + 2} className="atl-grafico-cursor" />
    </svg>
  );
}

/** Série curta de um único ativo (ficha do reservatório). */
export function Faisca({ valores, cor, indice, descricao }: { valores: (number | null)[]; cor: string; indice?: number; descricao: string }) {
  const altura = 56;
  const n = valores.length;
  const x = (i: number) => 2 + (i / Math.max(1, n - 1)) * (L - 4);
  const y = (v: number) => 4 + (altura - 8) * (1 - Math.max(0, Math.min(100, v)) / 100);
  let d = '';
  let aberto = false;
  valores.forEach((v, i) => {
    if (v == null) {
      aberto = false;
      return;
    }
    d += `${aberto ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
    aberto = true;
  });
  return (
    <svg className="atl-grafico atl-faisca" viewBox={`0 0 ${L} ${altura}`} role="img" aria-label={descricao}>
      <line x1={2} x2={L - 2} y1={y(0)} y2={y(0)} className="atl-grafico-grade" />
      <line x1={2} x2={L - 2} y1={y(100)} y2={y(100)} className="atl-grafico-grade" />
      <path d={d} fill="none" stroke={cor} strokeWidth={1.2} />
      {indice != null && valores[indice] != null && <circle cx={x(indice)} cy={y(valores[indice] as number)} r={3} fill={cor} className="atl-grafico-ponto" />}
    </svg>
  );
}
