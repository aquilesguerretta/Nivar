// Diagramas do M06 (História do Setor Elétrico Brasileiro) — regra 3 da regra de imagem:
// visual comum de demonstração, com eixo, unidade e a fonte escrita na figura.
// Posse: a sessão de porte do M06. Só classes `dg-*` de ../diagramas.css (tokens da v3).
//
// Todo dado vem do texto das aulas do M06 (Alexandria modulos/alexandria_modulo06.html, lido para
// MODULO_06_CORPO). A escada da abertura lê os números da própria tabela 5.4 do corpo; as linhas do
// tempo listam datas que a prosa da aula escreve, com a seção ao lado de cada uma.

import { Diagrama, escalaLinear, fmt } from '../base';
import { MODULO_06_CORPO } from '@/lib/data/alexandria-modulo-06-content';

// ── Aula 05 · 5.4 — a escada da abertura ─────────────────────────────────────

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES: Record<string, number> = { janeiro: 1, fevereiro: 2, março: 3, abril: 4, maio: 5, junho: 6, julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12 };
const plano = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** Linhas da tabela 5.4 do corpo da Aula 05: [data, carga mínima, norma]. */
function degraus(): { ano: number; mes: number; kw: number | null; rotulo: string; norma: string }[] {
  const tab = MODULO_06_CORPO['aula-06-05'].find((b) => b.kind === 'tabela' && plano(b.linhas[0]?.[1] ?? '').startsWith('Carga mínima'));
  if (!tab || tab.kind !== 'tabela') return [];
  return tab.linhas.slice(1).map(([data, carga, norma]) => {
    const m = /(\d+)º? de (\w+) de (\d{4})/.exec(plano(data));
    const kw = /([\d.]+) kW/.exec(plano(carga));
    return {
      ano: m ? Number(m[3]) : NaN,
      mes: m ? MESES[m[2]] ?? 1 : 1,
      kw: kw ? Number(kw[1].replace(/\./g, '')) : null,
      rotulo: plano(carga),
      norma: plano(norma),
    };
  });
}

export function EscadaDaAbertura() {
  const d = degraus();
  const t = (a: number, m: number) => a + (m - 1) / 12;
  const x = escalaLinear(2019, 2025, 96, 690);
  const y = escalaLinear(0, 2500, 300, 92);
  const passos = d.map((p, i) => ({ ...p, x0: x(t(p.ano, p.mes)), x1: i + 1 < d.length ? x(t(d[i + 1].ano, d[i + 1].mes)) : x(2025) }));
  return (
    <Diagrama
      titulo="A escada da abertura do mercado livre"
      subtitulo="Carga mínima para migrar ao mercado livre, por data de vigência"
      descricao={`Gráfico em degraus. ${d.map((p) => `A partir de ${MES[p.mes - 1]}/${p.ano}: ${p.rotulo} (${p.norma})`).join('; ')}.`}
      altura={378}
      fonte="Módulo 06, Aula 05, seção 5.4 (tabela da escada)."
      nota="O último degrau não tem carga mínima: a partir de 1º de janeiro de 2024, todo o Grupo A pode migrar."
    >
      {[0, 500, 1000, 1500, 2000, 2500].map((v) => (
        <g key={v}>
          <line x1={96} y1={y(v)} x2={690} y2={y(v)} className="dg-grade" />
          <text x={86} y={y(v) + 4} className="dg-n dg-fim">{fmt(v)}</text>
        </g>
      ))}
      {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map((a) => (
        <text key={a} x={x(a)} y={322} className="dg-n dg-meio">{a}</text>
      ))}
      <line x1={96} y1={92} x2={96} y2={300} className="dg-eixo" />
      <line x1={96} y1={300} x2={690} y2={300} className="dg-eixo" />
      {passos.map((p, i) => (
        <g key={i}>
          {p.kw !== null ? (
            <>
              <line x1={p.x0} y1={y(p.kw)} x2={p.x1} y2={y(p.kw)} className="dg-linha-dest" />
              {i + 1 < passos.length && passos[i + 1].kw !== null && (
                <line x1={p.x1} y1={y(p.kw)} x2={p.x1} y2={y(passos[i + 1].kw as number)} className="dg-linha-dest" />
              )}
              <circle cx={p.x0} cy={y(p.kw)} r={4} className="dg-ponto-dest" />
              <text x={p.x0 + 6} y={y(p.kw) - 8} className="dg-n dg-forte">{`${fmt(p.kw)} kW`}</text>
            </>
          ) : (
            <>
              <line x1={passos[i - 1]?.x1 ?? p.x0} y1={y(passos[i - 1]?.kw ?? 0)} x2={p.x0} y2={y(0)} className="dg-linha-dest dg-tracejado" />
              <rect x={p.x0} y={y(0) - 22} width={p.x1 - p.x0} height={22} className="dg-area" />
              <text x={p.x0 + 6} y={y(0) - 7} className="dg-s dg-forte">sem limite</text>
            </>
          )}
        </g>
      ))}
      <text x={20} y={196} className="dg-eixo-titulo dg-meio" transform="rotate(-90 20 196)">Carga mínima (kW)</text>
      <text x={393} y={350} className="dg-eixo-titulo dg-meio">Ano de vigência</text>
    </Diagrama>
  );
}

// ── Linha do tempo genérica ─────────────────────────────────────────────────
// Cada marco declara o nível (negativo acima do eixo, positivo abaixo) e a âncora do texto,
// escolhidos para que nenhum rótulo cruze outro nem a haste de outro marco.

type Ancora = 'inicio' | 'meio' | 'fim';
interface Marco { ano: number; rotuloAno?: string; texto: string; secao: string; nivel: number; ancora?: Ancora }
interface Faixa { de: number; ate: number; texto: string; nivel: number; ancora?: Ancora; rotuloEm?: number }

const classeAncora = (a: Ancora = 'meio') => (a === 'inicio' ? '' : a === 'fim' ? 'dg-fim' : 'dg-meio');

function LinhaDoTempo({
  titulo, subtitulo, descricao, fonte, nota, de, ate, passo, marcos, faixas = [],
}: {
  titulo: string; subtitulo: string; descricao: string; fonte: string; nota?: string;
  de: number; ate: number; passo: number; marcos: Marco[]; faixas?: Faixa[];
}) {
  const x = escalaLinear(de, ate, 40, 690);
  const eixoY = 252;
  const passoY = 56;
  return (
    <Diagrama titulo={titulo} subtitulo={subtitulo} descricao={descricao} altura={436} fonte={fonte} nota={nota}>
      {faixas.map((f) => (
        <g key={f.texto}>
          <rect x={x(f.de)} y={eixoY - 7} width={Math.max(2, x(f.ate) - x(f.de))} height={14} className="dg-area" />
          <text x={f.rotuloEm !== undefined ? x(f.rotuloEm) : f.ancora === 'fim' ? x(f.ate) : f.ancora === 'inicio' ? x(f.de) : (x(f.de) + x(f.ate)) / 2} y={eixoY + f.nivel * passoY + 4} className={`dg-s dg-forte dg-negrito ${classeAncora(f.ancora)}`}>
            {f.texto}
          </text>
        </g>
      ))}
      <line x1={40} y1={eixoY} x2={690} y2={eixoY} className="dg-eixo" />
      {Array.from({ length: Math.floor((ate - de) / passo) + 1 }, (_, i) => de + i * passo).map((a) => (
        <g key={a}>
          <line x1={x(a)} y1={eixoY - 4} x2={x(a)} y2={eixoY + 4} className="dg-eixo" />
          <text x={x(a)} y={eixoY + 18} className="dg-n dg-meio dg-fraco">{a}</text>
        </g>
      ))}
      {marcos.map((m) => {
        const yTexto = eixoY + m.nivel * passoY;
        const acima = m.nivel < 0;
        const cls = classeAncora(m.ancora);
        return (
          <g key={`${m.ano}-${m.texto}`}>
            <line x1={x(m.ano)} y1={eixoY} x2={x(m.ano)} y2={acima ? yTexto + 6 : yTexto - 16} className="dg-fino" />
            <circle cx={x(m.ano)} cy={eixoY} r={4} className="dg-ponto-dest" />
            <text x={x(m.ano)} y={acima ? yTexto - 12 : yTexto} className={`dg-n dg-negrito dg-forte ${cls}`}>{m.rotuloAno ?? String(Math.floor(m.ano))}</text>
            <text x={x(m.ano)} y={acima ? yTexto + 2 : yTexto + 14} className={`dg-s ${cls}`}>{m.texto}</text>
          </g>
        );
      })}
    </Diagrama>
  );
}

// ── Aula 02 · 2.1–2.3 — o Estado constrói ──────────────────────────────────

const ESTADO: Marco[] = [
  { ano: 1939, texto: 'CNAEE', secao: '2.1', nivel: -1 },
  { ano: 1945, texto: 'Chesf autorizada', secao: '2.2', nivel: 1 },
  { ano: 1952, texto: 'BNDE e Cemig', secao: '2.2', nivel: -2 },
  { ano: 1957, texto: 'Furnas', secao: '2.2', nivel: 2 },
  { ano: 1961, texto: 'lei da Eletrobras', secao: '2.2', nivel: -3 },
  { ano: 1962, texto: 'Eletrobras instalada', secao: '2.2', nivel: 3 },
  { ano: 1964, texto: 'ativos da Amforp', secao: '2.3', nivel: -1, ancora: 'inicio' },
  { ano: 1973, texto: 'GCOI · Eletronorte · Itaipu', secao: '2.3', nivel: 1 },
  { ano: 1979, texto: 'ativos da Light', secao: '2.3', nivel: -2 },
  { ano: 1984, texto: '1ªs unidades de Itaipu e Tucuruí', secao: '2.3', nivel: 2 },
];

export function EstadoConstroi() {
  return (
    <LinhaDoTempo
      titulo="O Estado constrói: as datas da Aula 02"
      subtitulo="Criação de órgãos e empresas, nacionalização e as primeiras unidades das grandes usinas"
      descricao={`Linha do tempo de 1935 a 1990: ${ESTADO.map((m) => `${m.ano}, ${m.texto}`).join('; ')}.`}
      fonte="Módulo 06, Aula 02, seções 2.1 a 2.3."
      nota="Eletrobras: a lei que autoriza é de 1961 e a instalação, de 1962 — as duas datas aparecem porque medem coisas diferentes (seção 2.2)."
      de={1935}
      ate={1990}
      passo={5}
      marcos={ESTADO}
    />
  );
}

// ── Aula 03 · 3.1–3.7 — a reforma e o racionamento ─────────────────────────

const REFORMA: Marco[] = [
  { ano: 1993, texto: 'Lei 8.631: encontro de contas', secao: '3.1', nivel: -1 },
  { ano: 1995, texto: 'Leis 8.987 e 9.074', secao: '3.2', nivel: 1 },
  { ano: 1996, texto: 'Lei 9.427 (ANEEL) · leilão da Light', secao: '3.2–3.3', nivel: -2 },
  { ano: 1998, texto: 'Lei 9.648: ONS e MAE', secao: '3.2', nivel: 2 },
  { ano: 2000, texto: 'Programa de termeletricidade', secao: '3.4', nivel: -3 },
  { ano: 2001 + 4 / 12, rotuloAno: 'mai/2001', texto: 'GCE', secao: '3.5', nivel: -1 },
  { ano: 2002 + 3 / 12, rotuloAno: 'abr/2002', texto: 'Lei 10.438: Proinfa e CDE', secao: '3.7', nivel: 2, ancora: 'fim' },
];

export function ReformaERacionamento() {
  return (
    <LinhaDoTempo
      titulo="Da reforma ao racionamento: as datas da Aula 03"
      subtitulo="Leis da reforma, criação de órgãos e o programa de redução compulsória de consumo"
      descricao={`Linha do tempo de 1992 a 2003: ${REFORMA.map((m) => `${m.rotuloAno ?? m.ano}, ${m.texto}`).join('; ')}; faixa do racionamento de junho de 2001 a fevereiro de 2002.`}
      fonte="Módulo 06, Aula 03, seções 3.1 a 3.7."
      nota="A faixa marca o programa de redução compulsória de consumo, de junho de 2001 a fevereiro de 2002 (seção 3.5)."
      de={1992}
      ate={2003}
      passo={1}
      marcos={REFORMA}
      faixas={[{ de: 2001 + 5 / 12, ate: 2002 + 2 / 12, texto: 'racionamento: jun/2001 a fev/2002', nivel: 3, ancora: 'fim' }]}
    />
  );
}

// ── Aula 06 · 6.4 — a Light, de 1904 a 2023 ────────────────────────────────

export function TrajetoriaDaLight() {
  const x = escalaLinear(1900, 2030, 40, 690);
  const y0 = 108;
  const h = 34;
  // Segmentos só entre as datas que a aula dá; a aula fala em "quatro regimes de propriedade"
  // sem dizer quais são os quatro, então o desenho não numera regimes.
  const trechos = [
    { de: 1904, ate: 1979, n: '1', texto: 'capital canadense (seção 1.2)' },
    { de: 1979, ate: 1996, n: '2', texto: 'Estado brasileiro (seção 2.3)' },
    { de: 1996, ate: 2023, n: '3', texto: 'privatizada: consórcio internacional, trocas de controlador, pulverização acionária (seções 3.3 e 6.4)' },
  ];
  const marcos = [
    { a: 1904, t: '1904', anc: 'inicio' as Ancora, nivel: 0 },
    { a: 1979, t: '1979', anc: 'meio' as Ancora, nivel: 0 },
    { a: 1996, t: '1996', anc: 'meio' as Ancora, nivel: 0 },
    { a: 2023, t: 'mai/2023 · recuperação judicial', anc: 'fim' as Ancora, nivel: 1 },
  ];
  return (
    <Diagrama
      titulo="A Light do Rio de Janeiro, de 1904 a 2023"
      subtitulo="As datas que a seção 6.4 percorre de uma vez só"
      descricao="Barra do tempo de 1900 a 2030 dividida em três trechos: capital canadense de 1904 a 1979; Estado brasileiro de 1979 a 1996; privatizada de 1996 em diante, com consórcio internacional, trocas de controlador e pulverização acionária; recuperação judicial deferida em maio de 2023."
      altura={318}
      fonte="Módulo 06, Aula 06, seção 6.4 (e Aulas 01, 02 e 03 para cada data)."
      nota={'A aula resume a trajetória como "uma empresa, quatro regimes de propriedade, cento e vinte anos", sem nomear os quatro; o desenho marca só as datas que ela dá.'}
    >
      {trechos.map((r, i) => (
        <g key={r.de}>
          <rect x={x(r.de)} y={y0} width={x(r.ate) - x(r.de)} height={h} className={i % 2 ? 'dg-vazio' : 'dg-area'} />
          <text x={(x(r.de) + x(r.ate)) / 2} y={y0 + h / 2 + 5} className="dg-n dg-meio dg-forte dg-negrito">{r.n}</text>
        </g>
      ))}
      {marcos.map((m) => (
        <g key={m.a}>
          <line x1={x(m.a)} y1={y0 - 4} x2={x(m.a)} y2={y0 - 18 - m.nivel * 24} className="dg-fino" />
          <text x={x(m.a)} y={y0 - 24 - m.nivel * 24} className={`dg-n dg-forte dg-negrito ${classeAncora(m.anc)}`}>{m.t}</text>
        </g>
      ))}
      <line x1={40} y1={y0 + h} x2={690} y2={y0 + h} className="dg-eixo" />
      {[1900, 1925, 1950, 1975, 2000, 2025].map((a) => (
        <g key={a}>
          <line x1={x(a)} y1={y0 + h} x2={x(a)} y2={y0 + h + 6} className="dg-eixo" />
          <text x={x(a)} y={y0 + h + 20} className="dg-n dg-meio dg-fraco">{a}</text>
        </g>
      ))}
      {trechos.map((r, i) => (
        <text key={r.n} x={40} y={y0 + h + 52 + i * 20} className="dg-s">
          <tspan className="dg-forte dg-negrito">{r.n}</tspan>
          {`  ${r.de}–${r.ate} · ${r.texto}`}
        </text>
      ))}
    </Diagrama>
  );
}

export const DIAGRAMAS_M06 = { EscadaDaAbertura, EstadoConstroi, ReformaERacionamento, TrajetoriaDaLight };
