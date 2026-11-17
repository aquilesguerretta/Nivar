// Diagramas do M07 (Estrutura Institucional) — regra 3 da regra de imagem: visual comum de
// demonstração, com a fonte escrita na figura. Os rótulos das setas vão numa legenda numerada
// (sobre as setas, como na fonte, eles se sobrepõem no fluxo de dado). Posse: a sessão de porte do M07. Só classes `dg-*`.
//
//   · MapaAutoridade / MapaDado — o grafo do Inst · 01 (seção Percurso e mapa institucional), que o modelo de aula não desenha
//     dentro do instrumento. Nós, posições, arestas e rótulos são os literais do <script> da fonte
//     (`N`, `AUT`, `DAD` em M07_DADOS_DOS_INSTRUMENTOS, gerados); a geometria (âncora na borda da
//     caixa, curva quadrática com o arco declarado) é a de `anch()`/`edge()` da fonte. Cores de
//     semáforo da fonte trocadas por traço (autoridade contínuo, dado tracejado); raio zero.
//   · RitoDoLeilao — a lista da seção 2.3 da Aula 02 (etapa · quem · o que acontece), lida do corpo.

import { Diagrama } from '../base';
import { M07_DADOS_DOS_INSTRUMENTOS, MODULO_07_CORPO } from '@/lib/data/alexandria-modulo-07-content';

const G = M07_DADOS_DOS_INSTRUMENTOS.i01;
type Chave = keyof typeof G.N;
const no = (k: string) => G.N[k as Chave] as { x: number; y: number; l: string; s: string; w?: number };

/** `anch(k,tx,ty)` da fonte: ponto da borda da caixa do nó na direção de (tx, ty). */
function ancora(k: string, tx: number, ty: number) {
  const n = no(k);
  const hw = (n.w ?? 128) / 2;
  const hh = 23;
  const dx = tx - n.x;
  const dy = ty - n.y;
  if (dx === 0 && dy === 0) return { x: n.x, y: n.y };
  const sx = dx === 0 ? 1e9 : hw / Math.abs(dx);
  const sy = dy === 0 ? 1e9 : hh / Math.abs(dy);
  const s = Math.min(sx, sy);
  return { x: n.x + dx * s, y: n.y + dy * s };
}

function Aresta({ a, b, arco, numero, tracejado }: { a: string; b: string; arco: number; numero: number; tracejado: boolean }) {
  const A = no(a);
  const B = no(b);
  const p1 = ancora(a, B.x, B.y);
  const p2 = ancora(b, A.x, A.y);
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const L = Math.sqrt(dx * dx + dy * dy) || 1;
  const cx = mx + (-dy / L) * arco;
  const cy = my + (dx / L) * arco;
  const vx = p2.x - cx;
  const vy = p2.y - cy;
  const VL = Math.sqrt(vx * vx + vy * vy) || 1;
  const ex = p2.x - (vx / VL) * 7;
  const ey = p2.y - (vy / VL) * 7;
  // número a 35% do caminho a partir da origem: setas de ida e volta entre o mesmo par não se cobrem
  const t = 0.35;
  const tx = (1 - t) ** 2 * p1.x + 2 * (1 - t) * t * cx + t ** 2 * p2.x;
  const ty = (1 - t) ** 2 * p1.y + 2 * (1 - t) * t * cy + t ** 2 * p2.y;
  const ang = Math.atan2(p2.y - cy, p2.x - cx);
  return (
    <g>
      <path d={`M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`} className={tracejado ? 'dg-fino dg-tracejado' : 'dg-linha-suave'} />
      <polygon
        points={`${p2.x},${p2.y} ${p2.x - 8 * Math.cos(ang) + 4 * Math.sin(ang)},${p2.y - 8 * Math.sin(ang) - 4 * Math.cos(ang)} ${p2.x - 8 * Math.cos(ang) - 4 * Math.sin(ang)},${p2.y - 8 * Math.sin(ang) + 4 * Math.cos(ang)}`}
        className="dg-seta-suave"
      />
      <circle cx={tx} cy={ty} r={8} className="dg-vazio" style={{ fill: 'var(--papel)' }} />
      <text x={tx} y={ty + 3.5} className="dg-n dg-meio dg-forte" style={{ fontSize: 10 }}>{numero}</text>
    </g>
  );
}

function Mapa({ fluxo }: { fluxo: 'aut' | 'dad' }) {
  const lista = (fluxo === 'aut' ? G.AUT : G.DAD) as readonly (readonly [string, string, string, number])[];
  const titulo = fluxo === 'aut' ? 'Mapa institucional · fluxo de autoridade' : 'Mapa institucional · fluxo de dado';
  const sub = fluxo === 'aut' ? 'Quem obriga, homologa, aprova ou fiscaliza quem' : 'Quem publica ou informa o quê, e para quem';
  return (
    <Diagrama
      titulo={titulo}
      subtitulo={sub}
      descricao={`${titulo}. ${lista.map(([a, b, r]) => `${no(a).l} para ${no(b).l}: ${r}`).join('; ')}.`}
      largura={780}
      altura={430 + Math.ceil(lista.length / 2) * 18}
      fonte="Módulo 07, Percurso e mapa institucional (grafo do instrumento 01)."
      nota="O grafo é simplificado, como diz a própria fonte: mostra os acoplamentos que mais aparecem no cotidiano, não a totalidade das relações legais."
    >
      <g transform="translate(0 30)">
        {lista.map(([a, b, , arco], i) => (
          <Aresta key={`${a}-${b}`} a={a} b={b} arco={arco} numero={i + 1} tracejado={fluxo === 'dad'} />
        ))}
        {G.ORD.map((k) => {
          const n = no(k);
          const hw = (n.w ?? 128) / 2;
          return (
            <g key={k}>
              <rect x={n.x - hw} y={n.y - 23} width={hw * 2} height={46} className="dg-area" />
              <text x={n.x} y={n.y - 3} className="dg-n dg-meio dg-forte dg-negrito">{n.l}</text>
              <text x={n.x} y={n.y + 13} className="dg-s dg-meio" style={{ fontSize: 9 }}>{n.s}</text>
            </g>
          );
        })}
      </g>
      {lista.map(([a, b, r], i) => (
        <text key={`l${i}`} x={16 + (i % 2) * 382} y={418 + Math.floor(i / 2) * 18} className="dg-s">
          <tspan className="dg-forte dg-negrito">{i + 1}</tspan>
          {`  ${no(a).l} → ${no(b).l} · ${r}`}
        </text>
      ))}
    </Diagrama>
  );
}

export const MapaAutoridade = () => <Mapa fluxo="aut" />;
export const MapaDado = () => <Mapa fluxo="dad" />;

// ── Aula 02 · 2.3 — o rito do leilão ────────────────────────────────────────

const plano = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function etapas(): { etapa: string; quem: string; texto: string }[] {
  const lista = MODULO_07_CORPO['aula-07-02'].find((b) => b.kind === 'lista' && b.itens.some((i) => i.includes('Abertura do cadastramento')));
  if (!lista || lista.kind !== 'lista') return [];
  return lista.itens.map((i) => {
    const [etapa, quem, ...resto] = i.split(' · ');
    return { etapa: plano(etapa), quem: plano(quem), texto: plano(resto.join(' · ')) };
  });
}

export function RitoDoLeilao() {
  const e = etapas();
  const quem = [...new Set(e.map((x) => x.quem))];
  const x0 = 170;
  const passo = (720 - x0 - 20) / Math.max(1, e.length - 1);
  const y = (q: string) => 96 + quem.indexOf(q) * 58;
  return (
    <Diagrama
      titulo="Quem faz qual pedaço do leilão, em ordem"
      subtitulo="As sete etapas da seção 2.3, cada uma na linha da instituição que a conduz"
      descricao={`Raias por instituição (${quem.join(', ')}). Etapas em ordem: ${e.map((x, i) => `${i + 1}, ${x.etapa}, ${x.quem}`).join('; ')}.`}
      altura={96 + quem.length * 58 + 30 + Math.ceil(e.length / 2) * 20}
      fonte="Módulo 07, Aula 02, seção 2.3 (lista do rito)."
    >
      {quem.map((q) => (
        <g key={q}>
          <line x1={x0 - 20} y1={y(q)} x2={720} y2={y(q)} className="dg-grade" />
          <text x={16} y={y(q) + 4} className="dg-s dg-forte dg-negrito">{q}</text>
        </g>
      ))}
      {e.map((x, i) => {
        const cx = x0 + i * passo;
        const prox = e[i + 1];
        return (
          <g key={x.etapa}>
            {prox && <line x1={cx} y1={y(x.quem)} x2={cx + passo} y2={y(prox.quem)} className="dg-fino" />}
            <circle cx={cx} cy={y(x.quem)} r={11} className="dg-ponto-dest" />
            <text x={cx} y={y(x.quem) + 4} className="dg-n dg-meio dg-negrito" style={{ fill: 'var(--papel)' }}>{i + 1}</text>
          </g>
        );
      })}
      {e.map((x, i) => (
        <text key={`r${i}`} x={16 + (i % 2) * 352} y={96 + quem.length * 58 + 14 + Math.floor(i / 2) * 20} className="dg-s">
          <tspan className="dg-forte dg-negrito">{i + 1}</tspan>
          {`  ${x.etapa}`}
        </text>
      ))}
    </Diagrama>
  );
}

export const DIAGRAMAS_M07 = { MapaAutoridade, MapaDado, RitoDoLeilao };
