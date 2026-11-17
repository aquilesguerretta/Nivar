// Diagramas do M08 (Matriz Elétrica Brasileira) — regra 3 da regra de imagem: visual comum de
// demonstração, com eixo, unidade e a fonte escrita na figura. Posse: a sessão de porte do M08.
// Só classes `dg-*` de ../diagramas.css (tokens da v3).
//
// Todo dado é lido do corpo das aulas (MODULO_08_CORPO, gerado do HTML original); nenhum número
// é digitado aqui.
//   · EstoqueContraFluxo — a tabela por subsistema da Aula 04 (afluência × energia armazenada,
//     junho de 2026) posta no plano das duas grandezas. As duas réguas são as do instrumento 08
//     da própria aula (média de longo termo = 100%; metade do volume útil = 50%), que divide o
//     plano nos quatro quadrantes.
//   · CincoDatasDeRoraima — a tabela da Aula 05 ("cinco datas, todas corretas, para perguntas
//     diferentes") numa linha do tempo, que mostra o espaçamento entre elas.

import { Diagrama, escalaLinear } from '../base';
import { MODULO_08_CORPO } from '@/lib/data/alexandria-modulo-08-content';

const plano = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function tabela(aula: string, cabecalho: string): string[][] {
  const t = MODULO_08_CORPO[aula].find((b) => b.kind === 'tabela' && plano(b.linhas[0]?.[0] ?? '') === cabecalho);
  if (!t || t.kind !== 'tabela') return [];
  return t.linhas.map((l) => l.map(plano));
}

// ── Aula 04 · estoque contra fluxo ──────────────────────────────────────────

function subsistemas() {
  return tabela('aula-08-04', 'Subsistema')
    .slice(1)
    .map(([nome, ena, ear]) => ({ nome, ena: Number(/(\d+)%/.exec(ena)?.[1]), ear: Number(/(\d+)%/.exec(ear)?.[1]), enaT: ena, earT: ear }))
    .filter((s) => Number.isFinite(s.ena) && Number.isFinite(s.ear));
}

export function EstoqueContraFluxo() {
  const s = subsistemas();
  const x = escalaLinear(40, 120, 96, 690);
  const y = escalaLinear(40, 105, 330, 80);
  return (
    <Diagrama
      titulo="Estoque contra fluxo, por subsistema"
      subtitulo="Junho de 2026: o que está chegando (afluência) e o que está guardado (armazenamento)"
      descricao={`Plano com afluência em porcentagem da média de longo termo no eixo horizontal e energia armazenada em porcentagem do volume útil no eixo vertical. ${s
        .map((p) => `${p.nome}: afluência ${p.enaT}, armazenamento ${p.earT}`)
        .join('; ')}. Todos os quatro ficam à esquerda da média de longo termo e acima da metade do volume útil; o Nordeste e o Norte são os que menos recebem e os que mais guardam.`}
      altura={392}
      fonte="Módulo 08, Aula 04, tabela por subsistema (junho de 2026); réguas dos quadrantes do instrumento 08 da mesma aula."
      nota="Fotografia de um mês. A própria aula avisa que esses números mudam diariamente e devem ser conferidos na fonte antes de uso externo."
    >
      {[40, 60, 80, 100, 120].map((v) => (
        <g key={`x${v}`}>
          <line x1={x(v)} y1={330} x2={x(v)} y2={336} className="dg-eixo" />
          <text x={x(v)} y={350} className="dg-n dg-meio dg-fraco">{`${v}%`}</text>
        </g>
      ))}
      {[40, 50, 60, 70, 80, 90, 100].map((v) => (
        <g key={`y${v}`}>
          <line x1={90} y1={y(v)} x2={96} y2={y(v)} className="dg-eixo" />
          <text x={86} y={y(v) + 4} className="dg-n dg-fim dg-fraco">{`${v}%`}</text>
        </g>
      ))}
      <line x1={96} y1={330} x2={690} y2={330} className="dg-eixo" />
      <line x1={96} y1={80} x2={96} y2={330} className="dg-eixo" />
      <line x1={x(100)} y1={80} x2={x(100)} y2={330} className="dg-fino dg-tracejado" />
      <line x1={96} y1={y(50)} x2={690} y2={y(50)} className="dg-fino dg-tracejado" />
      <text x={x(100) + 6} y={322} className="dg-s">média de longo termo</text>
      <text x={686} y={y(50) - 6} className="dg-s dg-fim">metade do volume útil</text>
      <text x={x(70)} y={y(103)} className="dg-s dg-meio dg-forte">estoque alto · fluxo fraco</text>
      <text x={x(110)} y={y(103)} className="dg-s dg-meio">estoque alto · fluxo forte</text>
      {s.map((p) => {
        // Ponto colado a outro mais acima (Norte e Nordeste): o rótulo desce para baixo do ponto.
        const cola = s.some((q) => q !== p && q.ear > p.ear && Math.abs(x(q.ena) - x(p.ena)) < 60 && y(p.ear) - y(q.ear) < 40);
        const dy = cola ? 22 : 4;
        return (
          <g key={p.nome}>
            <circle cx={x(p.ena)} cy={y(p.ear)} r={6} className="dg-ponto-dest" />
            <text x={x(p.ena) + 10} y={y(p.ear) + dy} className="dg-s dg-forte dg-negrito">{p.nome}</text>
            <text x={x(p.ena) + 10} y={y(p.ear) + dy + 14} className="dg-n">{`${p.enaT} · ${p.earT}`}</text>
          </g>
        );
      })}
      <text x={393} y={378} className="dg-eixo-titulo dg-meio">Afluência (% da média de longo termo)</text>
      <text x={16} y={64} className="dg-eixo-titulo">Energia armazenada (% do volume útil)</text>
    </Diagrama>
  );
}

// ── Aula 05 · as cinco datas da interligação ────────────────────────────────

const MESES: Record<string, number> = { janeiro: 1, fevereiro: 2, março: 3, abril: 4, maio: 5, junho: 6, julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12 };

function datas() {
  return tabela('aula-08-05', 'Data')
    .slice(1)
    .map(([data, fato, quem]) => {
      const m = /(?:(\d+)º? de )?(\p{L}+) de (\d{4})/iu.exec(data);
      const mes = m ? MESES[m[2].toLowerCase()] : undefined;
      // Dia que a fonte não dá ("Outubro de 2025") fica no início do mês, sem número no rótulo.
      const dia = m?.[1] ? Number(m[1]) : 1;
      const t = m && mes ? Date.UTC(Number(m[3]), mes - 1, dia) : NaN;
      return { data, fato, quem, t, temDia: Boolean(m?.[1]) };
    })
    .filter((d) => Number.isFinite(d.t));
}

export function CincoDatasDeRoraima() {
  const d = datas();
  if (!d.length) return null;
  const t0 = Date.UTC(2025, 7, 25);
  const t1 = Date.UTC(2026, 0, 10);
  const x = escalaLinear(t0, t1, 40, 690);
  const y0 = 120;
  const marcos = [Date.UTC(2025, 8, 1), Date.UTC(2025, 9, 1), Date.UTC(2025, 10, 1), Date.UTC(2025, 11, 1), Date.UTC(2026, 0, 1)];
  const nomeMes = ['set/2025', 'out/2025', 'nov/2025', 'dez/2025', 'jan/2026'];
  return (
    <Diagrama
      titulo="Uma interligação, cinco datas"
      subtitulo="Roraima no sistema interligado: cada data responde a uma pergunta diferente"
      descricao={`Linha do tempo de setembro de 2025 a janeiro de 2026. ${d.map((p, i) => `${i + 1}, ${p.data}: ${p.fato} (${p.quem})`).join('; ')}.`}
      altura={y0 + 60 + d.length * 36}
      fonte="Módulo 08, Aula 05, tabela das datas da interligação de Roraima."
      nota="Outubro de 2025 aparece sem dia porque a aula dá só o mês; o ponto fica no início do mês."
    >
      <line x1={40} y1={y0} x2={690} y2={y0} className="dg-eixo" />
      {marcos.map((m, i) => (
        <g key={m}>
          <line x1={x(m)} y1={y0} x2={x(m)} y2={y0 + 6} className="dg-eixo" />
          <text x={x(m)} y={y0 + 20} className="dg-n dg-meio dg-fraco">{nomeMes[i]}</text>
        </g>
      ))}
      {d.map((p, i) => {
        // as três datas de setembro ficam a dias umas das outras: rótulos em níveis
        const nivel = i < 3 ? i : 0;
        return (
          <g key={p.data}>
            <line x1={x(p.t)} y1={y0 - 8} x2={x(p.t)} y2={y0 - 22 - nivel * 18} className="dg-fino" />
            <circle cx={x(p.t)} cy={y0} r={5} className={p.temDia ? 'dg-ponto-dest' : 'dg-vazio'} />
            <text x={x(p.t) + (i < 3 ? 4 : 0)} y={y0 - 26 - nivel * 18} className={`dg-n dg-forte dg-negrito ${i < 3 ? '' : 'dg-meio'}`}>
              {i + 1}
            </text>
          </g>
        );
      })}
      {d.map((p, i) => (
        <g key={`l${i}`}>
          <text x={40} y={y0 + 50 + i * 36} className="dg-s">
            <tspan className="dg-forte dg-negrito">{i + 1}</tspan>
            {`  ${p.data} · ${p.fato.length > 84 ? `${p.fato.slice(0, p.fato.lastIndexOf(' ', 84))} …` : p.fato}`}
          </text>
          <text x={58} y={y0 + 66 + i * 36} className="dg-s">{`pergunta de: ${p.quem.length > 90 ? `${p.quem.slice(0, p.quem.lastIndexOf(' ', 90))} …` : p.quem}`}</text>
        </g>
      ))}
    </Diagrama>
  );
}

export const DIAGRAMAS_M08 = { EstoqueContraFluxo, CincoDatasDeRoraima };
