// Alexandria v3 — Glossário.
//
// A entrada é a busca e o filtro, não uma lista alfabética (contrato D3 e §6).
// Sem busca e sem filtro, a coluna da esquerda mostra os módulos que têm
// glossário; escolher um módulo ou digitar reorganiza a lista na hora. O
// verbete abre em rota própria (/alexandria/glossario/<termo>), com a busca e o
// filtro preservados na URL para a volta não perder a posição (D6).
//
// Dado: `src/lib/alexandria/verbetes.ts`, derivado do glossário do produto (os
// glossários dos 17 módulos, 2.124 definições). Termo definido em mais de um
// módulo tem UMA entrada, com as definições empilhadas e rotuladas pelo módulo,
// na ordem da trilha (decisão de 15/11/2026). "Onde aparece" é o vínculo
// mecânico (decisão 5): o termo aparece literalmente no texto de uma aula do
// mesmo módulo. A tela diz "aparece na Aula N", nunca "ensinado".

import { useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEstudo } from '@/components/alexandria/home/estudo';
import {
  buscar,
  MODULOS_DO_GLOSSARIO,
  normalizar,
  TOTAL_DEFINICOES,
  TOTAL_MODULOS_CURRICULO,
  trechosDaDefinicao,
  VERBETES_EM_VARIOS_MODULOS,
  VERBETES_V3,
  verbetePorSlug,
  vizinhosDe,
  type Achado,
  type Definicao,
  type Verbete,
} from '@/lib/alexandria/verbetes';
import type { Releitura } from '@/lib/data/alexandria-glossario-releitura';
import { CasaV3 } from './CasaV3';
import { rolarPara } from './usoV3';
import './glossario-v3.css';

type Ancora = 'todas' | 'com' | 'sem';
const LIMITE_LISTA = 160;

/** Reordena com transição curta: quem já estava desliza até o novo lugar, quem
 *  chega entra com fade de 240 ms. Itens marcados com `data-chave`. Sem efeito
 *  com prefers-reduced-motion. Usado também pela Biblioteca. */
export function useReordenar<T extends HTMLElement>(assinatura: unknown) {
  const ref = useRef<T | null>(null);
  const posicoes = useRef(new Map<string, number>());
  useLayoutEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const topo = raiz.getBoundingClientRect().top;
    const novas = new Map<string, number>();
    const itens = Array.from(raiz.querySelectorAll<HTMLElement>('[data-chave]'));
    const primeira = posicoes.current.size === 0;
    itens.forEach((el, i) => {
      const chave = el.dataset.chave ?? '';
      const y = el.getBoundingClientRect().top - topo;
      novas.set(chave, y);
      if (reduzir || primeira || i > 48 || typeof el.animate !== 'function') return;
      const antes = posicoes.current.get(chave);
      if (antes === undefined) {
        el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], {
          duration: 240,
          delay: Math.min(i, 12) * 14,
          easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
          fill: 'backwards',
        });
      } else if (Math.abs(antes - y) > 1) {
        el.animate([{ transform: `translateY(${antes - y}px)` }, { transform: 'none' }], {
          duration: 280,
          easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
        });
      }
    });
    posicoes.current = novas;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assinatura]);
  return ref;
}

/** Quantas definições de cada módulo aparecem no texto das aulas. O cálculo
 *  varre o texto de todas as aulas (centenas de ms num aparelho lento), então
 *  corre FORA do primeiro render, um módulo por tarefa, e a tela mostra o
 *  número quando ele existe. MessageChannel em vez de setTimeout: aba em
 *  segundo plano estrangula setTimeout a ~1 Hz. */
function useNasAulas(): ReadonlyMap<string, number> | null {
  const [mapa, setMapa] = useState<ReadonlyMap<string, number> | null>(null);
  useEffect(() => {
    let vivo = true;
    const acc = new Map<string, number>();
    const canal = new MessageChannel();
    let i = 0;
    canal.port1.onmessage = () => {
      if (!vivo) return;
      const m = MODULOS_DO_GLOSSARIO[i++];
      if (!m) {
        setMapa(acc);
        return;
      }
      acc.set(m.id, m.comAula);
      canal.port2.postMessage(null);
    };
    canal.port2.postMessage(null);
    return () => {
      vivo = false;
      canal.port1.close();
    };
  }, []);
  return mapa;
}

function plural(n: number, um: string, varios: string) {
  return `${n.toLocaleString('pt-BR')} ${n === 1 ? um : varios}`;
}

/** Realça a primeira ocorrência do que foi buscado, sem depender de acento ou caixa. */
function Realce({ texto, busca }: { texto: string; busca: string }) {
  const n = normalizar(busca);
  if (!n) return <>{texto}</>;
  const alvo = texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const i = alvo.indexOf(n);
  if (i < 0 || alvo.length !== texto.length) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <span className="glo-realce">{texto.slice(i, i + n.length)}</span>
      {texto.slice(i + n.length)}
    </>
  );
}

function TextoDaDefinicao({ html }: { html: string }) {
  return (
    <>
      {trechosDaDefinicao(html).map((t, i) => {
        let no: ReactNode = t.texto;
        if (t.enfase) no = <em>{no}</em>;
        if (t.forte) no = <strong>{no}</strong>;
        return <span key={i}>{no}</span>;
      })}
    </>
  );
}

export function GlossarioV3() {
  const estudo = useEstudo();
  const navigate = useNavigate();
  const params = useParams();
  const slug = (params['*'] ?? '').split('/')[0] || null;
  const [busca, setBusca] = useSearchParams();

  const qUrl = busca.get('q') ?? '';
  const codigoModulo = busca.get('m');
  const modulo = MODULOS_DO_GLOSSARIO.find((m) => m.codigo === codigoModulo) ?? null;
  const ancoraUrl = busca.get('ancora');
  const ancora: Ancora = ancoraUrl === 'com' || ancoraUrl === 'sem' ? ancoraUrl : 'todas';

  // O campo responde a cada tecla; a URL acompanha sem empilhar histórico.
  const [texto, setTexto] = useState(qUrl);
  useEffect(() => setTexto(qUrl), [qUrl]);
  const q = useDeferredValue(texto);

  const mudar = (mudancas: Record<string, string | null>) => {
    const novo = new URLSearchParams(busca);
    for (const [k, v] of Object.entries(mudancas)) {
      if (v === null || v === '') novo.delete(k);
      else novo.set(k, v);
    }
    setBusca(novo, { replace: true });
  };

  const escrever = (v: string) => {
    setTexto(v);
    mudar({ q: v.trim() ? v : null });
  };

  const sufixo = busca.toString() ? `?${busca.toString()}` : '';
  const rotaVerbete = (s: string) => `/alexandria/glossario/${s}${sufixo}`;
  const rotaLista = `/alexandria/glossario${sufixo}`;

  const verbete = slug ? verbetePorSlug(slug) : null;
  const modoEntrada = !q.trim() && !modulo && ancora === 'todas';

  const achados = useMemo(
    () => (modoEntrada ? [] : buscar(q, { modulo: modulo?.id ?? null, ancora })),
    [q, modulo, ancora, modoEntrada],
  );
  const [mostrarTodos, setMostrarTodos] = useState(false);
  useEffect(() => setMostrarTodos(false), [q, modulo, ancora]);
  const visiveis = mostrarTodos ? achados : achados.slice(0, LIMITE_LISTA);

  const assinatura = `${modoEntrada}|${q}|${modulo?.id}|${ancora}|${mostrarTodos}`;
  const listaRef = useReordenar<HTMLDivElement>(assinatura);

  // "/" leva à busca, como nas ferramentas de consulta; Esc no campo limpa.
  const campoRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (e.key === '/' && alvo && !['INPUT', 'TEXTAREA'].includes(alvo.tagName)) {
        e.preventDefault();
        campoRef.current?.focus();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, []);

  // Abrir um verbete no celular leva até ele.
  useEffect(() => {
    if (slug && window.innerWidth < 860) rolarPara('glo-verbete', false);
  }, [slug]);

  const conta = estudo.fase === 'conta' ? estudo : null;
  const contaNaCasa = conta ? (
    <Link to="/alexandria/perfil" className="casa-conta">
      {conta.nome}
    </Link>
  ) : (
    <Link to="/entrar" className="casa-conta">
      Entrar
    </Link>
  );

  const primeiroModulo = MODULOS_DO_GLOSSARIO[0]?.codigo ?? '';
  const ultimoModulo = MODULOS_DO_GLOSSARIO[MODULOS_DO_GLOSSARIO.length - 1]?.codigo ?? '';
  const faltam = TOTAL_MODULOS_CURRICULO - MODULOS_DO_GLOSSARIO.length;
  const todos = faltam <= 0;
  const nasAulas = useNasAulas();

  return (
    <CasaV3 secao="glossario" conta={contaNaCasa}>
      <div className="glo" data-verbete={verbete ? 'aberto' : 'fechado'}>
        <header className="glo-abertura">
          <p className="v-dado">
            Glossário · módulos {primeiroModulo.slice(1)} a {ultimoModulo.slice(1)}
          </p>
          <h1 className="v-manchete glo-titulo">O vocabulário do currículo</h1>
          <p className="glo-escopo">
            {plural(VERBETES_V3.length, 'termo', 'termos')} e {plural(TOTAL_DEFINICOES, 'definição', 'definições')},
            tirados do glossário de {todos ? `cada um dos ${MODULOS_DO_GLOSSARIO.length} módulos` : `cada um dos módulos ${primeiroModulo.slice(1)} a ${ultimoModulo.slice(1)}`}.
            {todos
              ? ' Termo definido em mais de um módulo tem uma entrada só, com a definição de cada módulo, na ordem da trilha.'
              : ` ${plural(faltam, 'módulo ainda não tem', 'módulos ainda não têm')} glossário aqui.`}
          </p>
        </header>

        <div className="glo-ferramentas">
          <label className="glo-busca">
            <span className="so-leitor">Buscar no glossário</span>
            <svg className="glo-lupa" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M13 13l5 5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <input
              ref={campoRef}
              type="search"
              value={texto}
              onChange={(e) => escrever(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && texto) {
                  e.preventDefault();
                  escrever('');
                }
              }}
              placeholder={`Buscar entre ${VERBETES_V3.length.toLocaleString('pt-BR')} termos`}
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="glo-atalho v-dado" aria-hidden="true">
              /
            </kbd>
          </label>

          <div className="glo-filtros">
            <div className="glo-segmento" role="group" aria-label="Filtrar por módulo">
              <button
                type="button"
                className="glo-opcao"
                aria-pressed={!modulo}
                onClick={() => mudar({ m: null })}
              >
                Todos
              </button>
              {MODULOS_DO_GLOSSARIO.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="glo-opcao"
                  aria-pressed={modulo?.id === m.id}
                  title={m.titulo ?? undefined}
                  onClick={() => mudar({ m: modulo?.id === m.id ? null : m.codigo })}
                >
                  {m.codigo}
                </button>
              ))}
            </div>
            <div className="glo-segmento" role="group" aria-label="Filtrar pelo texto das aulas">
              <span className="v-dado glo-segmento-rotulo">Nas aulas</span>
              {(
                [
                  ['todas', 'todos'],
                  ['com', 'aparece'],
                  ['sem', 'não aparece'],
                ] as const
              ).map(([valor, rotulo]) => (
                <button
                  key={valor}
                  type="button"
                  className="glo-opcao"
                  aria-pressed={ancora === valor}
                  onClick={() => mudar({ ancora: valor === 'todas' ? null : valor })}
                >
                  {rotulo}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glo-corpo">
          <section className="glo-lista" aria-label="Termos" aria-live="polite">
            {verbete && (
              <Link to={rotaLista} className="glo-voltar v-dado">
                ← Voltar à lista
              </Link>
            )}
            <div className="glo-lista-rolagem" ref={listaRef}>
              {modoEntrada ? (
                <PorModulo escolher={(codigo) => mudar({ m: codigo })} nasAulas={nasAulas} />
              ) : (
                <>
                  <p className="glo-contagem v-dado">
                    {achados.length === 0
                      ? 'Nenhum termo'
                      : plural(achados.length, 'termo', 'termos')}
                    {modulo ? ` · ${modulo.codigo}` : ''}
                    {ancora === 'com' ? ' · aparece em aula' : ancora === 'sem' ? ' · não aparece em aula' : ''}
                    {q.trim() ? ` · “${q.trim()}”` : ''}
                    <button
                      type="button"
                      className="glo-limpar"
                      onClick={() => {
                        setTexto('');
                        setBusca(new URLSearchParams(), { replace: true });
                      }}
                    >
                      limpar
                    </button>
                  </p>
                  {achados.length === 0 ? (
                    <div className="glo-vazio">
                      <p>
                        Nenhum termo{modulo ? ` do ${modulo.codigo}` : ''} corresponde a “{q.trim()}”.
                      </p>
                      <p>
                        A busca cobre o termo, a família e o texto de cada definição dos módulos{' '}
                        {primeiroModulo.slice(1)} a {ultimoModulo.slice(1)}.
                        {todos ? '' : ' Termos dos módulos seguintes ainda não estão no glossário.'}
                      </p>
                    </div>
                  ) : (
                    <ListaDeAchados
                      achados={visiveis}
                      q={q}
                      agrupar={!q.trim() && !!modulo && modulo.familias.length <= 10}
                      moduloId={modulo?.id ?? null}
                      ativo={verbete?.slug ?? null}
                      rota={rotaVerbete}
                    />
                  )}
                  {achados.length > visiveis.length && (
                    <button type="button" className="glo-mais" onClick={() => setMostrarTodos(true)}>
                      Mostrar os {achados.length - visiveis.length} restantes
                    </button>
                  )}
                </>
              )}
            </div>
          </section>

          <div className="glo-painel">
            {verbete ? (
              <PaginaDoVerbete
                key={verbete.slug}
                verbete={verbete}
                rota={rotaVerbete}
              />
            ) : slug ? (
              <div className="glo-entrada">
                <p className="v-dado">Sem registro</p>
                <h2 className="v-manchete glo-entrada-titulo">Nenhum termo com esse endereço.</h2>
                <button type="button" className="glo-mais" onClick={() => navigate(rotaLista)}>
                  Voltar ao glossário
                </button>
              </div>
            ) : (
              <Entrada rota={rotaVerbete} nasAulas={nasAulas} />
            )}
          </div>
        </div>
      </div>
    </CasaV3>
  );
}

function PorModulo({
  escolher,
  nasAulas,
}: {
  escolher: (codigo: string) => void;
  nasAulas: ReadonlyMap<string, number> | null;
}) {
  return (
    <>
      <p className="glo-contagem v-dado">Por módulo</p>
      <ol className="glo-modulos">
        {MODULOS_DO_GLOSSARIO.map((m) => (
          <li key={m.id} data-chave={m.id}>
            <button type="button" className="glo-modulo" onClick={() => escolher(m.codigo)}>
              <span className="v-dado glo-modulo-cod">{m.codigo}</span>
              <span className="glo-modulo-titulo">{m.titulo ?? 'Título não declarado'}</span>
              <span className="v-dado glo-modulo-conta">
                {m.totalDefinicoes} termos
                {nasAulas?.has(m.id) ? ` · ${nasAulas.get(m.id)} nas aulas` : ''}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}

function ListaDeAchados({
  achados,
  q,
  agrupar,
  moduloId,
  ativo,
  rota,
}: {
  achados: Achado[];
  q: string;
  agrupar: boolean;
  moduloId: string | null;
  ativo: string | null;
  rota: (slug: string) => string;
}) {
  const familiaDe = (v: Verbete) =>
    (moduloId ? v.definicoes.find((d) => d.moduloId === moduloId) : v.definicoes[0])?.familia ?? '';

  const item = (a: Achado, mostrarFamilia: boolean) => {
    const v = a.verbete;
    return (
      <li key={v.slug} data-chave={v.slug}>
        <Link
          to={rota(v.slug)}
          className="glo-item"
          aria-current={ativo === v.slug ? 'page' : undefined}
        >
          <span className="glo-item-termo">
            <Realce texto={v.termo} busca={q} />
          </span>
          <span className="v-dado glo-item-cods">{v.codigos.join(' ')}</span>
          {mostrarFamilia && <span className="glo-item-familia">{familiaDe(v)}</span>}
          {a.trecho && (
            <span className="glo-item-trecho">
              <Realce texto={a.trecho} busca={q} />
            </span>
          )}
        </Link>
      </li>
    );
  };

  if (!agrupar) return <ul className="glo-itens">{achados.map((a) => item(a, !a.trecho))}</ul>;

  // Módulo com famílias declaradas (M04 a M08): a lista se organiza pela família da fonte.
  const grupos = new Map<string, Achado[]>();
  for (const a of achados) {
    const f = familiaDe(a.verbete);
    const l = grupos.get(f);
    if (l) l.push(a);
    else grupos.set(f, [a]);
  }
  return (
    <div className="glo-grupos">
      {[...grupos.entries()].map(([familia, lista]) => (
        <section key={familia} className="glo-grupo" data-chave={`familia-${familia}`}>
          <h3 className="v-dado glo-grupo-titulo">
            {familia} <span className="glo-grupo-n">{lista.length}</span>
          </h3>
          <ul className="glo-itens">{lista.map((a) => item(a, false))}</ul>
        </section>
      ))}
    </div>
  );
}

function Entrada({ rota, nasAulas }: { rota: (slug: string) => string; nasAulas: ReadonlyMap<string, number> | null }) {
  const mais = [...VERBETES_EM_VARIOS_MODULOS]
    .sort((a, b) => b.codigos.length - a.codigos.length || a.termo.localeCompare(b.termo, 'pt-BR'))
    .slice(0, 12);
  const comAula = nasAulas ? [...nasAulas.values()].reduce((s, n) => s + n, 0) : null;
  return (
    <div className="glo-entrada">
      <p className="v-dado">Como consultar</p>
      <h2 className="v-manchete glo-entrada-titulo">Busque um termo, ou escolha um módulo para ver o vocabulário dele.</h2>
      <p className="glo-entrada-texto">
        {plural(VERBETES_EM_VARIOS_MODULOS.length, 'termo é definido', 'termos são definidos')} em mais de um módulo.
        Nesses, a entrada é uma só e as definições ficam empilhadas, cada uma com o módulo de onde veio, na ordem da
        trilha.
        {comAula !== null &&
          ` ${plural(comAula, 'definição tem', 'definições têm')} o termo escrito no texto de alguma aula do próprio módulo; a entrada diz em qual aula ele aparece.`}
      </p>
      <h3 className="v-dado glo-entrada-sub">Definidos em mais módulos</h3>
      <ul className="glo-varios">
        {mais.map((v) => (
          <li key={v.slug}>
            <Link to={rota(v.slug)} className="glo-varios-link">
              <span className="glo-varios-termo">{v.termo}</span>
              <span className="v-dado">{v.codigos.join(' · ')}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaginaDoVerbete({ verbete, rota }: { verbete: Verbete; rota: (slug: string) => string }) {
  const comAula = verbete.definicoes.filter((d) => d.aulas.length > 0);
  // Vizinhos de até três módulos, um bloco por módulo.
  const vizinhancas = verbete.definicoes.slice(0, 3).map((d) => ({ def: d, viz: vizinhosDe(d, 5) }));
  const varios = verbete.definicoes.length > 1;

  return (
    <article className="glo-verbete" id="glo-verbete" aria-labelledby="glo-verbete-termo">
      <div className="glo-verbete-principal">
        <p className="v-dado">
          Verbete · {varios ? `definido em ${verbete.codigos.join(', ')}` : `módulo ${verbete.codigos[0].slice(1)}`}
        </p>
        <h2 id="glo-verbete-termo" className="v-manchete glo-termo">
          {verbete.termo}
        </h2>

        {varios && (
          <p className="glo-aviso">
            Este termo tem {verbete.definicoes.length} definições, uma por módulo, na ordem da trilha. Elas não foram
            unificadas: cada módulo define o termo pelo seu foco, e a aula mostra a definição do próprio módulo.
          </p>
        )}

        {verbete.releitura?.veredito === 'divergem' && <Divergencia releitura={verbete.releitura} />}

        {verbete.definicoes.map((d) => (
          <DefinicaoNoVerbete key={d.id} def={d} termoDoVerbete={verbete.termo} varios={varios} />
        ))}

        {comAula.length > 0 && (
          <section className="glo-onde">
            <h3 className="glo-secao">Onde aparece</h3>
            <p className="glo-onde-nota">
              Aulas do mesmo módulo em que o termo está escrito no texto. Aparecer não quer dizer que a aula o ensina.
            </p>
            <ul className="glo-onde-lista">
              {comAula.flatMap((d) =>
                d.aulas.map((a) => (
                  <li key={`${d.id}-${a.id}`}>
                    {a.rota ? (
                      <Link to={a.rota} className="glo-onde-link">
                        <span className="v-dado">
                          {d.codigo} · aparece na Aula {String(a.numero).padStart(2, '0')}
                        </span>
                        <span className="glo-onde-titulo">{a.titulo ?? 'Título da aula não declarado'}</span>
                      </Link>
                    ) : (
                      <span className="glo-onde-link">
                        <span className="v-dado">{a.id}</span>
                        <span className="glo-onde-titulo">Aula fora do índice</span>
                      </span>
                    )}
                  </li>
                )),
              )}
            </ul>
          </section>
        )}
      </div>

      <aside className="glo-vizinhos" aria-label="Termos vizinhos">
        <h3 className="v-dado glo-vizinhos-titulo">Termos vizinhos</h3>
        {vizinhancas.map(({ def, viz }) =>
          viz.verbetes.length ? (
            <div key={def.id} className="glo-vizinhos-bloco">
              <p className="glo-vizinhos-origem">
                {viz.familia ? `${viz.codigo} · ${viz.familia}` : `Ao lado, no glossário do ${viz.codigo}`}
              </p>
              <ul>
                {viz.verbetes.map((v) => (
                  <li key={v.slug}>
                    <Link to={rota(v.slug)} className="glo-vizinho">
                      {v.termo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </aside>
    </article>
  );
}

function DefinicaoNoVerbete({
  def,
  termoDoVerbete,
  varios,
}: {
  def: Definicao;
  termoDoVerbete: string;
  varios: boolean;
}) {
  return (
    <section className="glo-def" data-varios={varios}>
      <header className="glo-def-cab">
        <span className="v-dado glo-def-cod">{def.codigo}</span>
        {def.moduloRota ? (
          <Link to={def.moduloRota} className="glo-def-modulo">
            {def.moduloTitulo ?? 'Título do módulo não declarado'}
          </Link>
        ) : (
          <span className="glo-def-modulo">{def.moduloTitulo ?? 'Título do módulo não declarado'}</span>
        )}
      </header>
      <p className="glo-def-texto">
        <TextoDaDefinicao html={def.definicaoHtml} />
      </p>
      <dl className="glo-def-meta">
        {def.termo !== termoDoVerbete && (
          <div>
            <dt>Na fonte</dt>
            <dd>{def.termo}</dd>
          </div>
        )}
        <div>
          <dt>Família</dt>
          <dd>{def.familia || 'não declarada'}</dd>
        </div>
        <div>
          <dt>Fonte</dt>
          <dd>glossário do módulo {def.codigo.slice(1)}</dd>
        </div>
        <div>
          <dt>Nas aulas</dt>
          <dd>
            {def.aulas.length
              ? `aparece ${def.aulas.length === 1 ? 'na Aula' : 'nas Aulas'} ${def.aulas
                  .map((a) => String(a.numero).padStart(2, '0'))
                  .join(', ')
                  .replace(/, ([^,]*)$/, ' e $1')}`
              : `não aparece no texto das aulas do ${def.codigo}`}
          </dd>
        </div>
      </dl>
    </section>
  );
}

/** Números diferentes entre módulos, lidos na releitura de 15/11/2026: os
 *  trechos literais lado a lado, com o rótulo do módulo, sem escolher um. */
function Divergencia({ releitura }: { releitura: Releitura }) {
  return (
    <section className="glo-diverge" aria-labelledby="glo-diverge-titulo">
      <h3 id="glo-diverge-titulo" className="v-dado glo-diverge-titulo">
        Números diferentes entre módulos
      </h3>
      <p className="glo-diverge-texto">
        Os módulos dão faixas diferentes para o mesmo caso. Elas ficam lado a lado, como cada módulo escreve; a
        Alexandria não escolhe uma.
      </p>
      <dl className="glo-diverge-lista">
        {releitura.divergencias.map((d) => (
          <div key={d.assunto} className="glo-diverge-linha">
            <dt>{d.assunto}</dt>
            {d.leituras.map((l) => (
              <dd key={l.verbete}>
                <span className="v-dado glo-diverge-cod">{l.codigo}</span>
                <span className="glo-diverge-trecho">“{l.trecho}”</span>
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </section>
  );
}

export default GlossarioV3;
