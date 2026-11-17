// Leitura.tsx — o corpo da aula em coluna de medida confortável.
//
// Cada bloco da fonte (título de seção, parágrafo, fórmula, nota, lista,
// tabela) tem uma forma só. Entre os blocos entram, na âncora certa, as
// figuras de `figuras.ts` e o instrumento da aula. Nada de imagem que não
// esteja no contrato de figuras: as estéticas e as geradas que não ensinam
// saíram da aula (regra de imagem, 14/11/2026).
//
// O VÉU NA PROSA. Bloco cujo texto entrega o calculado do instrumento não é
// renderizado antes da previsão — no lugar fica uma linha de metadado que
// diz por quê. Figura ancorada num bloco velado fica velada com ele.

import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { AulaBloco } from '@/lib/data/alexandria-modulo-01-content';
import type { FiguraDaAula } from './contratos';
import { Html, Rico, lerHtml, ligarTermos, termosEm, textoPlano, type No, type TermoDaAula } from './texto';

export const idDaSecao = (numero: string) => `s-${numero.replace(/\./g, '-')}`;

interface BlocoPreparado {
  bloco: AulaBloco;
  /** HTML já com termos ligados (parágrafo, nota, itens de lista, células). */
  partes: No[][];
  plano: string;
}

function partesDoBloco(b: AulaBloco): string[] {
  switch (b.kind) {
    case 'paragrafo':
    case 'nota':
      return [b.html];
    case 'lista':
      return b.itens;
    case 'tabela':
      return b.linhas.flat();
    default:
      return [];
  }
}

function planoDoBloco(b: AulaBloco): string {
  if (b.kind === 'titulo') return `${b.numero ?? ''} ${b.texto}`;
  if (b.kind === 'formula') return `${b.eq} ${b.desc ?? ''}`;
  return partesDoBloco(b).map(textoPlano).join(' ');
}

/** Resolve a âncora de cada figura num índice de bloco (entra DEPOIS dele).
 *  `-1` = antes do primeiro bloco; `blocos.length - 1` = fim da leitura. */
export function posicaoDaFigura(f: FiguraDaAula, blocos: AulaBloco[], planos: string[]): number {
  const ultimo = blocos.length - 1;
  const a = f.ancora;
  if (a.tipo === 'bloco') return Math.max(-1, Math.min(ultimo, a.indice));
  if (a.tipo === 'secao') {
    const i = blocos.findIndex((b) => b.kind === 'titulo' && b.numero === a.numero);
    if (i < 0) return ultimo;
    const prox = blocos.findIndex((b, j) => j > i && b.kind === 'titulo' && b.numero !== null);
    return prox < 0 ? ultimo : prox - 1;
  }
  if (a.tipo === 'trecho') {
    const alvo = a.texto.toLowerCase();
    const i = planos.findIndex((p) => p.toLowerCase().includes(alvo));
    return i < 0 ? ultimo : i;
  }
  return ultimo;
}

/** O véu de UM instrumento: trechos e figuras que entregam o calculado dele,
 *  fora do DOM até o cálculo daquele instrumento abrir. */
export interface VeuDoInstrumento {
  velar: string[];
  velarFiguras: string[];
  revelado: boolean;
  aoPedir: () => void;
}

export function Leitura({
  blocos,
  termos,
  figuras,
  instrumentos,
  veus,
}: {
  blocos: AulaBloco[];
  termos: TermoDaAula[];
  figuras: FiguraDaAula[];
  /** Instrumentos ancorados na leitura (cada um depois do seu bloco). */
  instrumentos: { depoisDoBloco: number; no: ReactNode }[];
  veus: VeuDoInstrumento[];
}) {
  const preparados = useMemo<BlocoPreparado[]>(() => {
    const usados = new Set<string>();
    return blocos.map((b) => ({
      bloco: b,
      partes: b.kind === 'titulo' || b.kind === 'formula' ? [] : partesDoBloco(b).map((h) => ligarTermos(lerHtml(h), termos, usados)),
      plano: planoDoBloco(b),
    }));
  }, [blocos, termos]);

  const posicoes = useMemo(() => {
    const planos = preparados.map((p) => p.plano);
    const m = new Map<number, FiguraDaAula[]>();
    for (const f of figuras) {
      const i = posicaoDaFigura(f, blocos, planos);
      m.set(i, [...(m.get(i) ?? []), f]);
    }
    return m;
  }, [figuras, blocos, preparados]);

  /** O véu (ainda fechado) que cobre o bloco i, se houver. */
  const veuDoBloco = (i: number) => veus.find((v) => !v.revelado && v.velar.some((t) => preparados[i]?.plano.includes(t))) ?? null;
  const ehVelado = (i: number) => veuDoBloco(i) !== null;
  const veuDaFigura = (id: string) => veus.find((v) => !v.revelado && v.velarFiguras.includes(id)) ?? null;
  let numeroDaFigura = 0;

  const figurasEm = (i: number) =>
    (posicoes.get(i) ?? []).map((f) => {
      numeroDaFigura += 1;
      if (ehVelado(i)) return null;
      const veu = veuDaFigura(f.id);
      if (veu) {
        return (
          <p key={f.id} className="av-veu-trecho" data-capture="veu-figura">
            A figura {numeroDaFigura} desenha o resultado de um instrumento desta aula. Ela aparece aqui quando o
            cálculo abrir.{' '}
            <button type="button" className="av-link" onClick={veu.aoPedir}>
              Ir ao instrumento
            </button>
          </p>
        );
      }
      return <FiguraV3 key={f.id} figura={f} numero={numeroDaFigura} />;
    });

  return (
    <div className="av-leitura">
      {figurasEm(-1)}
      {preparados.map((p, i) => (
        <Fragment key={i}>
          {ehVelado(i) ? (
            <p className="av-veu-trecho" data-capture="veu-trecho">
              Um trecho desta seção traz o resultado do instrumento abaixo. Ele aparece aqui quando você registrar a
              sua previsão.{' '}
              <button type="button" className="av-link" onClick={veuDoBloco(i)?.aoPedir}>
                Ir ao instrumento
              </button>
            </p>
          ) : (
            <Bloco p={p} />
          )}
          {figurasEm(i)}
          {instrumentos
            .filter((x) => x.depoisDoBloco === i)
            .map((x, k) => (
              <Fragment key={k}>{x.no}</Fragment>
            ))}
        </Fragment>
      ))}
    </div>
  );
}

function Bloco({ p }: { p: BlocoPreparado }) {
  const [aberto, setAberto] = useState<string | null>(null);
  const alternar = (slug: string) => setAberto((a) => (a === slug ? null : slug));
  const b = p.bloco;
  const termos = useMemo(() => p.partes.flatMap(termosEm), [p.partes]);
  const def = aberto ? termos.find((t) => t.slug === aberto) ?? null : null;

  let corpo: ReactNode;
  switch (b.kind) {
    case 'titulo':
      corpo = (
        <h2 className="av-secao" id={b.numero ? idDaSecao(b.numero) : undefined}>
          {b.numero && <span className="av-secao-num">{b.numero}</span>}
          {b.texto}
        </h2>
      );
      break;
    case 'paragrafo':
      corpo = (
        <p className="av-p">
          <Rico nos={p.partes[0]} aberto={aberto} aoAbrir={alternar} />
        </p>
      );
      break;
    case 'formula':
      corpo = (
        <div className="av-formula" role="math" aria-label={textoPlano(b.eq)}>
          {/* eq pode trazer <sub>/<sup> da fonte (eq_html da extração) */}
          <span className="av-formula-eq">
            <Html html={b.eq} />
          </span>
          {b.desc && <span className="av-formula-desc">{b.desc}</span>}
        </div>
      );
      break;
    case 'nota':
      corpo = (
        <aside className="av-nota" data-tom={b.tom === 'gold' ? 'ouro' : 'tinta'}>
          {b.label && <span className="av-nota-rotulo">{b.label}</span>}
          <p>
            <Rico nos={p.partes[0]} aberto={aberto} aoAbrir={alternar} />
          </p>
        </aside>
      );
      break;
    case 'lista':
      corpo = (
        <ul className="av-lista">
          {p.partes.map((nos, i) => (
            <li key={i}>
              <Rico nos={nos} aberto={aberto} aoAbrir={alternar} />
            </li>
          ))}
        </ul>
      );
      break;
    case 'tabela': {
      const cols = b.linhas[0]?.length ?? 0;
      const celula = (r: number, c: number) => p.partes[r * cols + c] ?? [];
      corpo = (
        <div className="av-tabela-rolo" tabIndex={0} role="region" aria-label={textoPlano(b.linhas[0]?.join(' · ') ?? 'tabela')}>
          <table className="av-tabela">
            <thead>
              <tr>
                {b.linhas[0]?.map((_, c) => (
                  <th key={c} scope="col">
                    <Rico nos={celula(0, c)} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.linhas.slice(1).map((linha, r) => (
                <tr key={r}>
                  {linha.map((_, c) => (
                    <td key={c}>
                      <Rico nos={celula(r + 1, c)} aberto={aberto} aoAbrir={alternar} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      break;
    }
  }

  return (
    <>
      {corpo}
      {def && <DefinicaoNoLugar termo={def} aoFechar={() => setAberto(null)} />}
    </>
  );
}

function DefinicaoNoLugar({ termo, aoFechar }: { termo: TermoDaAula; aoFechar: () => void }) {
  return (
    <div className="av-definicao" id={`def-${termo.slug}`} role="region" aria-label={`Definição: ${termo.termo}`} data-capture="definicao">
      <span className="av-rotulo">{termo.rotulo}</span>
      <p>
        <strong>{termo.def.termo}.</strong> <Html html={termo.def.definicaoHtml} />
      </p>
      <span className="av-definicao-acoes">
        <Link to={`/alexandria/glossario/${termo.slug}`} className="av-link">
          Abrir o verbete
        </Link>
        <button type="button" className="av-link" onClick={aoFechar}>
          Fechar
        </button>
      </span>
    </div>
  );
}

/** Figura da aula. A classe vem no próprio crédito ("foto · autor · licença",
 *  "diagrama · fonte"), como manda `figuras.ts`; o diagrama já escreve a
 *  linha "Fonte: …" dentro do SVG, então por baixo dele vai só a legenda. */
export function FiguraV3({ figura, numero }: { figura: FiguraDaAula; numero: number }) {
  const { imagem, Diagrama } = figura;
  const ficha = figura.fonte && figura.fonte.startsWith('http') ? figura.fonte : null;
  return (
    <figure className="av-figura" data-classe={figura.classe} data-figura={figura.id} data-capture="figura">
      {Diagrama ? (
        <div className="av-figura-diagrama">
          <Diagrama />
        </div>
      ) : imagem ? (
        <img
          src={imagem.src}
          srcSet={imagem.srcSet}
          sizes="(max-width: 860px) 100vw, 980px"
          width={imagem.largura}
          height={imagem.altura}
          alt={figura.alt}
          decoding="async"
        />
      ) : null}
      <figcaption>
        <span className="av-rotulo">Figura {numero}</span>
        {figura.legenda && <span className="av-figura-legenda">{figura.legenda}</span>}
        {!Diagrama && figura.credito && (
          <span className="av-figura-fonte">
            {figura.credito}
            {ficha && (
              <>
                {' · '}
                <a href={ficha} target="_blank" rel="noopener noreferrer">
                  ficha do arquivo
                </a>
              </>
            )}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
