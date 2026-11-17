// Peças de jogo da Alexandria (V2), usadas pelo Perfil e pelo Início.
//
// Founder, 15/11/2026: "essa barra de xp está feia, o em números está feio
// também, quero uma vibe mais de jogo e mais divertida, mesma coisa com as
// trilhas e como mostra que está concluído".
//
// Continuam valendo os invariantes da casa: raio zero (só o círculo pleno
// é exceção), zero sombra, nada de semáforo. A diversão vem do movimento
// (contagem, enchimento, estação que pulsa), da forma (emblema, estações)
// e do texto — não de cor nova.

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { idDaAula, type ModuloDoIndice } from '@/lib/alexandria/indice';
import type { Nivel } from '@/lib/alexandria/perfil/regras';
import { XP_POR_TIPO } from '@/lib/alexandria/perfil/regras';
import { Contagem, useEntrada } from '../animacoes';
import './pecas-de-jogo.css';

const nf = new Intl.NumberFormat('pt-BR');

// ── ícones de linha (24×24, traço 1,5) ─────────────────────────────────

export type NomeDoIcone = 'aula' | 'exercicio' | 'instrumento' | 'dias' | 'sequencia' | 'medalha' | 'nivel' | 'cadeado';

export function Icone({ nome }: { nome: NomeDoIcone }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg className="jg-icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {nome === 'aula' && (
        <g {...p}>
          <path d="M3 5.5c3-1.3 6-1.3 9 .5 3-1.8 6-1.8 9-.5V19c-3-1.3-6-1.3-9 .5-3-1.8-6-1.8-9-.5Z" />
          <path d="M12 6v13.5" />
        </g>
      )}
      {nome === 'exercicio' && (
        <g {...p}>
          <rect x="4" y="3.5" width="16" height="17" />
          <path d="M8 12.5l2.5 2.5L16 9.5" />
        </g>
      )}
      {nome === 'instrumento' && (
        <g {...p}>
          <path d="M3.5 16a8.5 8.5 0 0 1 17 0" />
          <path d="M12 16l4.5-6" />
          <circle cx="12" cy="16" r="1.2" fill="currentColor" />
        </g>
      )}
      {nome === 'dias' && (
        <g {...p}>
          <rect x="3.5" y="5" width="17" height="15.5" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" />
          <path d="M8 13.5h2M14 13.5h2M8 17h2" />
        </g>
      )}
      {nome === 'sequencia' && (
        <g {...p}>
          <path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6l1-8Z" />
        </g>
      )}
      {nome === 'medalha' && (
        <g {...p}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="5.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </g>
      )}
      {nome === 'nivel' && (
        <g {...p}>
          <path d="M4 20V14M10 20V10M16 20V6M22 20V3" />
        </g>
      )}
      {nome === 'cadeado' && (
        <g {...p}>
          <rect x="5" y="10.5" width="14" height="10" />
          <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
        </g>
      )}
    </svg>
  );
}

// ── gravuras de jogo (Higgsfield, 16/11/2026) ───────────────────────────

const RAIZ_JOGO = '/alexandria/v3/jogo';

export type NomeDaGravura = 'raio' | 'livro' | 'exercicio' | 'instrumento' | 'calendario' | 'torres' | 'medalhas' | 'termometro' | 'relogio' | 'lampada';

/** Vinheta gravada em latão e sépia, com fundo transparente. */
export function Gravura({ nome, tamanho = 64 }: { nome: NomeDaGravura; tamanho?: number }) {
  return (
    <img
      className="jg-gravura"
      src={`${RAIZ_JOGO}/i-${nome}.webp`}
      srcSet={`${RAIZ_JOGO}/i-${nome}.webp 1x, ${RAIZ_JOGO}/i-${nome}@2x.webp 2x`}
      width={tamanho}
      height={tamanho}
      alt=""
      decoding="async"
    />
  );
}

// ── emblema de nível ────────────────────────────────────────────────────

/** O número do nível no miolo de esmalte de uma engrenagem de latão gravada
 *  (o progresso do nível fica na barra ao lado). A engrenagem dá um quarto
 *  de volta ao entrar na tela e gira de leve no hover. */
export function EmblemaDeNivel({ nivel, tamanho = 132 }: { nivel: Nivel; tamanho?: number }) {
  const [ref, k] = useEntrada<HTMLSpanElement>(1600);
  return (
    <span
      ref={ref}
      className="jg-emblema"
      style={{ width: tamanho, height: tamanho, ['--giro' as string]: `${(k - 1) * 90}deg` }}
      role="img"
      aria-label={`Nível ${nivel.nivel}`}
    >
      <img className="jg-emblema-engrenagem" src={`${RAIZ_JOGO}/i-nivel.webp`} alt="" decoding="async" />
      <span className="jg-emblema-disco" />
      <span className="jg-emblema-texto" aria-hidden="true">
        <span className="jg-emblema-rotulo">Nível</span>
        <span className="jg-emblema-numero" style={{ fontSize: Math.round(tamanho * 0.32) }}>
          {nivel.nivel}
        </span>
      </span>
    </span>
  );
}

// ── barra de XP ─────────────────────────────────────────────────────────

/** Dez segmentos que enchem em sequência, com o total e o que falta. */
export function BarraDeXp({ nivel, compacta = false }: { nivel: Nivel; compacta?: boolean }) {
  const [ref, k] = useEntrada<HTMLDivElement>(1400);
  const cheio = nivel.fracao * k * 10;
  const falta = nivel.proximo - nivel.xp;
  const aulas = Math.ceil(falta / XP_POR_TIPO.aula_concluida);
  return (
    <div className={`jg-xp${compacta ? ' jg-xp-compacta' : ''}`}>
      <div className="jg-xp-topo">
        <span className="jg-xp-total">
          <strong>
            <Contagem valor={nivel.xp} />
          </strong>{' '}
          XP
        </span>
        <span className="v-dado jg-xp-meta">
          nível {nivel.nivel + 1} em {nf.format(nivel.proximo)}
        </span>
      </div>
      <div
        ref={ref}
        className="jg-xp-barra"
        role="progressbar"
        aria-label={`XP do nível ${nivel.nivel}`}
        aria-valuemin={nivel.inicio}
        aria-valuemax={nivel.proximo}
        aria-valuenow={nivel.xp}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="jg-xp-gomo">
            <span style={{ transform: `scaleX(${Math.max(0, Math.min(1, cheio - i))})` }} />
          </span>
        ))}
      </div>
      {!compacta && (
        <p className="jg-xp-falta">
          <span className="jg-pilula">
            faltam {nf.format(falta)} XP
          </span>
          <span className="jg-xp-dica">
            {aulas <= 1 ? 'uma aula concluída e você sobe' : `cerca de ${aulas} aulas concluídas e você sobe`}
          </span>
        </p>
      )}
    </div>
  );
}

// ── anel de progresso ───────────────────────────────────────────────────

export function AnelDeProgresso({ fracao, tamanho = 44, children }: { fracao: number; tamanho?: number; children?: ReactNode }) {
  const [ref, k] = useEntrada<HTMLSpanElement>(1200);
  const r = 20;
  const volta = 2 * Math.PI * r;
  return (
    <span ref={ref} className="jg-anel" style={{ width: tamanho, height: tamanho }}>
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="24" cy="24" r={r} className="jg-anel-trilho" />
        <circle
          cx="24"
          cy="24"
          r={r}
          className="jg-anel-arco"
          strokeDasharray={volta}
          strokeDashoffset={volta * (1 - Math.max(0, Math.min(1, fracao)) * k)}
          transform="rotate(-90 24 24)"
        />
      </svg>
      {children && <span className="jg-anel-meio">{children}</span>}
    </span>
  );
}

// ── placas de número ────────────────────────────────────────────────────

export function Placa({
  gravura,
  medalha,
  valor,
  valorTexto,
  rotulo,
  nota,
  destaque = false,
  grande = false,
  extra,
  i = 0,
}: {
  gravura?: NomeDaGravura;
  /** Medalha pequena no lugar da gravura (ex.: placa de medalhas). */
  medalha?: ReactNode;
  valor?: number;
  /** Para valor que não é número ("noite"). */
  valorTexto?: string;
  rotulo: string;
  nota?: string;
  destaque?: boolean;
  grande?: boolean;
  extra?: ReactNode;
  i?: number;
}) {
  return (
    <div
      className={`jg-placa${destaque ? ' jg-placa-destaque' : ''}${grande ? ' jg-placa-grande' : ''}`}
      style={{ ['--i' as string]: i }}
    >
      <span className="jg-placa-arte">{gravura ? <Gravura nome={gravura} tamanho={grande ? 96 : 64} /> : medalha}</span>
      <span className="jg-placa-valor">
        {valorTexto ?? <Contagem valor={valor ?? 0} />}
        {nota && <span className="jg-placa-nota">{nota}</span>}
      </span>
      <span className="jg-placa-rotulo">{rotulo}</span>
      {extra && <span className="jg-placa-extra">{extra}</span>}
    </div>
  );
}

/** XP de cada um dos últimos 7 dias em barras, com o total e a semana anterior. */
export function GraficoDaSemana({
  dias,
  total,
  anterior,
}: {
  dias: { dia: string; xp: number }[];
  total: number;
  anterior: number;
}) {
  const [ref, k] = useEntrada<HTMLDivElement>(1100);
  const maximo = Math.max(1, ...dias.map((d) => d.xp));
  const letras = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const variacao = anterior > 0 ? Math.round(((total - anterior) / anterior) * 100) : null;
  return (
    <div className="jg-grafico" ref={ref}>
      <div className="jg-grafico-topo">
        <span className="jg-grafico-total">
          <strong>
            <Contagem valor={total} />
          </strong>{' '}
          XP nesta semana
        </span>
        <span className="v-dado jg-grafico-comparacao">
          {anterior === 0 && total === 0
            ? 'nenhum estudo nas duas últimas semanas'
            : anterior === 0
              ? 'a semana passada ficou em branco'
              : variacao! >= 0
                ? `${variacao}% acima da semana passada`
                : `${-variacao!}% abaixo da semana passada`}
        </span>
      </div>
      <div className="jg-grafico-barras" role="img" aria-label={dias.map((d) => `${d.dia}: ${d.xp} XP`).join('; ')}>
        {dias.map((d, i) => {
          const hoje = i === dias.length - 1;
          return (
            <div key={d.dia} className="jg-grafico-coluna" data-hoje={hoje || undefined}>
              <span className="jg-grafico-valor">{d.xp > 0 ? d.xp : ''}</span>
              <span className="jg-grafico-trilho">
                <span className="jg-grafico-barra" style={{ transform: `scaleY(${(d.xp / maximo) * k})` }} />
              </span>
              <span className="jg-grafico-dia">{letras[new Date(`${d.dia}T12:00:00`).getDay()]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Os últimos sete dias, de hoje para trás, como sete casas. */
export function SemanaDeEstudo({ dias, hoje, grande = false }: { dias: ReadonlySet<string>; hoje: string; grande?: boolean }) {
  const base = Date.UTC(+hoje.slice(0, 4), +hoje.slice(5, 7) - 1, +hoje.slice(8, 10));
  const letras = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const casas = Array.from({ length: 7 }, (_, i) => {
    const t = base - (6 - i) * 86_400_000;
    const d = new Date(t);
    return { dia: d.toISOString().slice(0, 10), letra: letras[d.getUTCDay()], numero: d.getUTCDate(), hoje: i === 6 };
  });
  return (
    <span
      className={`jg-semana${grande ? ' jg-semana-grande' : ''}`}
      aria-label={`${casas.filter((c) => dias.has(c.dia)).length} dos últimos 7 dias com estudo`}
    >
      {casas.map((c) => (
        <span key={c.dia} className="jg-semana-dia" data-feito={dias.has(c.dia) || undefined} data-hoje={c.hoje || undefined}>
          <span className="jg-semana-letra" aria-hidden="true">
            {c.letra}
          </span>
          <span className="jg-semana-casa">
            {grande && dias.has(c.dia) && (
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M5 10.5l3.2 3.2L15 7" />
              </svg>
            )}
            {grande && !dias.has(c.dia) && <span className="jg-semana-numero">{c.numero}</span>}
          </span>
        </span>
      ))}
    </span>
  );
}

/** O cartão da sequência: lâmpada acesa, os dias seguidos, a semana em casas
 *  com visto, o recorde e quanto falta para a próxima medalha de sequência. */
export function PlacaDeSequencia({
  atual,
  maior,
  dias,
  hoje,
}: {
  atual: number;
  maior: number;
  dias: ReadonlySet<string>;
  hoje: string;
}) {
  const marcos = [3, 7, 30, 100];
  const proximo = marcos.find((m) => m > Math.max(atual, maior)) ?? null;
  return (
    <div className="jg-placa jg-seq" data-apagada={atual === 0 || undefined}>
      <div className="jg-seq-topo">
        <div className="jg-seq-texto">
          <span className="v-dado jg-seq-kicker">Sequência</span>
          <span className="jg-seq-numero">
            <Contagem valor={atual} />
          </span>
          <span className="jg-seq-rotulo">
            {atual === 0 ? 'nenhum dia seguido agora; hoje recomeça' : atual === 1 ? 'dia seguido de estudo' : 'dias seguidos de estudo'}
          </span>
        </div>
        <span className="jg-seq-arte">
          <Gravura nome="lampada" tamanho={150} />
        </span>
      </div>
      <SemanaDeEstudo dias={dias} hoje={hoje} grande />
      <p className="jg-seq-pe">
        <span>
          Recorde <strong>{maior}</strong> {maior === 1 ? 'dia' : 'dias'}
          {maior > 0 && maior === atual && <span className="jg-pilula jg-seq-selo">é agora</span>}
        </span>
        {proximo && (
          <span>
            Próxima medalha: <strong>{proximo} dias</strong> · faltam {proximo - atual}
          </span>
        )}
      </p>
    </div>
  );
}

// ── linha de estações de uma trilha ─────────────────────────────────────

export type EstadoDaEstacao = 'concluido' | 'andamento' | 'livre';

export function estadoDoModulo(m: ModuloDoIndice, concluidas: ReadonlySet<string>): { estado: EstadoDaEstacao; feitas: number } {
  const feitas = m.aulas.filter((a) => concluidas.has(idDaAula(m, a.numero))).length;
  return { feitas, estado: feitas === 0 ? 'livre' : feitas === m.aulas.length ? 'concluido' : 'andamento' };
}

/** Os módulos de uma trilha como estações numa linha: concluída cheia com
 *  visto, em andamento com o arco do quanto foi feito, livre vazada. */
export function LinhaDaTrilha({
  modulos,
  concluidas,
  atual,
}: {
  modulos: ModuloDoIndice[];
  concluidas: ReadonlySet<string>;
  /** Módulo onde o aluno está agora (pulsa). */
  atual?: string | null;
}) {
  return (
    <ol className="jg-linha" style={{ ['--n' as string]: modulos.length }}>
      {modulos.map((m) => {
        const { estado, feitas } = estadoDoModulo(m, concluidas);
        const r = 15;
        const volta = 2 * Math.PI * r;
        return (
          <li key={m.id} className="jg-estacao" data-estado={estado} data-atual={m.id === atual || undefined}>
            <Link
              to={`/alexandria/trilha/${m.trilhaId}/modulo/${m.id}`}
              className="jg-estacao-link"
              title={`${m.codigo} · ${m.titulo ?? ''}`}
            >
              <span className="jg-estacao-disco">
                <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
                  <circle cx="20" cy="20" r="17" className="jg-estacao-fundo" />
                  {estado === 'andamento' && (
                    <circle
                      cx="20"
                      cy="20"
                      r={r}
                      className="jg-estacao-arco"
                      strokeDasharray={volta}
                      strokeDashoffset={volta * (1 - feitas / m.aulas.length)}
                      transform="rotate(-90 20 20)"
                    />
                  )}
                  {estado === 'concluido' && <path d="M12.5 20.5l5 5 10-11" className="jg-estacao-visto" />}
                </svg>
              </span>
              <span className="v-dado jg-estacao-codigo">{m.codigo}</span>
              <span className="jg-estacao-conta">
                {estado === 'concluido' ? 'concluído' : `${feitas}/${m.aulas.length}`}
              </span>
              <span className="so-leitor">
                {m.titulo}: {estado === 'concluido' ? 'concluído' : `${feitas} de ${m.aulas.length} aulas`}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
