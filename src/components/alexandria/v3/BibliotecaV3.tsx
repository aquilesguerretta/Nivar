// Alexandria v3 — Biblioteca: as fontes que cada módulo declara.
//
// Redesenho V2 (Founder, 15/11/2026: "a tela de bibliografia tem que ser
// melhorada, ela está muito confusa"). Antes: só o § Ref do M01, tabela de
// seis colunas, três linhas de filtro e "não declarada" repetido em toda
// linha. Agora:
//   · as referências dos 17 módulos, uma estante por módulo, na ordem da trilha;
//   · uma busca, um filtro de módulo e um de instituição;
//   · a ausência é dita uma vez, na legenda: campo que a fonte não traz
//     simplesmente não aparece na ficha.
//
// Dado: `src/lib/alexandria/fontes.dados.ts`, gerado de
// `docs/alexandria-v2/extraction/mNN/aparato.json` por
// `tools/alexandria-dados/gerar-fontes.mjs` e conferido por
// `verificar-fontes.mjs`. Nenhum texto desta tela sai de fora da extração.

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useEstudo } from '@/components/alexandria/home/estudo';
import { indice, moduloPorId } from '@/lib/alexandria/indice';
import {
  FONTES_DO_CURRICULO,
  REFS_DOS_MODULOS,
  type FonteDoCurriculo,
  type RefDoModulo,
} from '@/lib/alexandria/fontes.dados';
import { CasaV3 } from './CasaV3';
import { useReordenar } from './GlossarioV3';
import './biblioteca-v3.css';

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Instituições citadas 8 vezes ou mais, pela grafia literal da fonte. */
const INSTITUICOES: { nome: string; total: number }[] = (() => {
  const conta = new Map<string, number>();
  for (const f of FONTES_DO_CURRICULO) for (const i of f.instituicoes) conta.set(i, (conta.get(i) ?? 0) + 1);
  return [...conta.entries()]
    .map(([nome, total]) => ({ nome, total }))
    .filter((i) => i.total >= 8)
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, 'pt-BR'));
})();

const INDICE_DE_BUSCA = new Map(
  FONTES_DO_CURRICULO.map((f) => [
    f.id,
    normalizar([f.titulo, f.descricao ?? '', f.natureza ?? '', f.instituicoes.join(' '), f.dominio ?? ''].join(' ')),
  ]),
);

const REF_POR_MODULO = new Map(REFS_DOS_MODULOS.map((r) => [r.moduloId, r]));

function rotaDoModulo(moduloId: string): string | null {
  const m = moduloPorId(moduloId);
  return m?.trilhaId ? `/alexandria/trilha/${m.trilhaId}/modulo/${m.id}` : null;
}

export function BibliotecaV3() {
  const estudo = useEstudo();
  const [params, setParams] = useSearchParams();

  const codigo = params.get('m');
  const modulo = codigo ? indice.modulos.find((m) => m.codigo === codigo) ?? null : null;
  const instParam = params.get('inst');
  const inst = instParam && INSTITUICOES.some((i) => i.nome === instParam) ? instParam : null;

  const [texto, setTexto] = useState(params.get('q') ?? '');
  const termo = normalizar(texto.trim());

  const mudar = (k: string, v: string | null) => {
    const novo = new URLSearchParams(params);
    if (v === null || v === '') novo.delete(k);
    else novo.set(k, v);
    setParams(novo, { replace: true });
  };

  const escrever = (v: string) => {
    setTexto(v);
    mudar('q', v.trim() || null);
  };

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

  const visiveis = useMemo(
    () =>
      FONTES_DO_CURRICULO.filter(
        (f) =>
          (!modulo || f.moduloId === modulo.id) &&
          (!inst || f.instituicoes.includes(inst)) &&
          (!termo || (INDICE_DE_BUSCA.get(f.id) ?? '').includes(termo)),
      ),
    [modulo, inst, termo],
  );

  const estantes = useMemo(() => {
    const porModulo = new Map<string, FonteDoCurriculo[]>();
    for (const f of visiveis) {
      const lista = porModulo.get(f.moduloId) ?? [];
      lista.push(f);
      porModulo.set(f.moduloId, lista);
    }
    return indice.modulos
      .filter((m) => porModulo.has(m.id))
      .map((m) => ({ modulo: m, ref: REF_POR_MODULO.get(m.id) ?? null, fontes: porModulo.get(m.id)! }));
  }, [visiveis]);

  const filtrado = !!(modulo || inst || termo);
  const listaRef = useReordenar<HTMLDivElement>(`${modulo?.id}|${inst}|${termo}`);
  const modulosComFontes = new Set(FONTES_DO_CURRICULO.map((f) => f.moduloId));

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

  return (
    <CasaV3 secao="biblioteca" conta={contaNaCasa}>
      <div className="bib">
        <header className="bib-abertura">
          <p className="v-dado">Biblioteca · fontes do currículo</p>
          <h1 className="v-manchete bib-titulo">De onde vem o que o currículo afirma</h1>
          <div className="bib-abertura-texto">
            <p className="bib-cobertura">
              {FONTES_DO_CURRICULO.length.toLocaleString('pt-BR')} referências, tiradas da seção de fontes de cada um
              dos {modulosComFontes.size} módulos. Cada módulo tem a sua estante, na ordem da trilha.
            </p>
            <p className="bib-legenda">
              Cada ficha mostra só o que o módulo declara. Quando a fonte não traz endereço, data ou instituição, o campo
              não aparece — nada é completado por fora.
            </p>
          </div>
        </header>

        <div className="glo-ferramentas bib-ferramentas">
          <label className="glo-busca">
            <span className="so-leitor">Buscar nas fontes</span>
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
              placeholder="Buscar por título, instituição ou assunto"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="glo-atalho v-dado" aria-hidden="true">
              /
            </kbd>
          </label>

          <div className="glo-filtros">
            <div className="glo-segmento" role="group" aria-label="Filtrar por módulo">
              <span className="v-dado glo-segmento-rotulo">Módulo</span>
              <button type="button" className="glo-opcao" aria-pressed={!modulo} onClick={() => mudar('m', null)}>
                Todos
              </button>
              {indice.modulos.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="glo-opcao"
                  aria-pressed={modulo?.id === m.id}
                  disabled={!modulosComFontes.has(m.id)}
                  title={m.titulo ?? undefined}
                  onClick={() => mudar('m', modulo?.id === m.id ? null : m.codigo)}
                >
                  {m.codigo}
                </button>
              ))}
            </div>
            <div className="glo-segmento" role="group" aria-label="Filtrar por instituição">
              <span className="v-dado glo-segmento-rotulo">Instituição</span>
              <button type="button" className="glo-opcao" aria-pressed={!inst} onClick={() => mudar('inst', null)}>
                Todas
              </button>
              {INSTITUICOES.map((i) => (
                <button
                  key={i.nome}
                  type="button"
                  className="glo-opcao"
                  aria-pressed={inst === i.nome}
                  onClick={() => mudar('inst', inst === i.nome ? null : i.nome)}
                >
                  {i.nome} <span className="bib-opcao-n">{i.total}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="bib-contagem v-dado" aria-live="polite">
          {filtrado
            ? `${visiveis.length} de ${FONTES_DO_CURRICULO.length} referências · ${estantes.length} ${estantes.length === 1 ? 'módulo' : 'módulos'}`
            : `${FONTES_DO_CURRICULO.length} referências · ${estantes.length} módulos`}
          {filtrado && (
            <button
              type="button"
              className="bib-limpar"
              onClick={() => {
                setTexto('');
                setParams(new URLSearchParams(), { replace: true });
              }}
            >
              limpar
            </button>
          )}
        </p>

        <div className="bib-estantes" ref={listaRef}>
          {estantes.length === 0 ? (
            <p className="bib-vazio">Nenhuma referência combina com essa busca.</p>
          ) : (
            estantes.map(({ modulo: m, ref, fontes }) => (
              <Estante
                key={m.id}
                moduloId={m.id}
                codigo={m.codigo}
                titulo={m.titulo ?? m.codigo}
                ref_={ref}
                fontes={fontes}
                comNota={!termo && !inst}
              />
            ))
          )}
        </div>
      </div>
    </CasaV3>
  );
}

function Estante({
  moduloId,
  codigo,
  titulo,
  ref_,
  fontes,
  comNota,
}: {
  moduloId: string;
  codigo: string;
  titulo: string;
  ref_: RefDoModulo | null;
  fontes: FonteDoCurriculo[];
  comNota: boolean;
}) {
  const rota = rotaDoModulo(moduloId);
  return (
    <section className="bib-estante" data-chave={moduloId} aria-labelledby={`bib-${moduloId}`}>
      <header className="bib-estante-cabeca">
        <p className="v-dado bib-estante-codigo">{codigo}</p>
        <div>
          <h2 id={`bib-${moduloId}`} className="bib-estante-titulo">
            {rota ? <Link to={rota}>{titulo}</Link> : titulo}
          </h2>
          <p className="v-dado bib-estante-meta">
            {fontes.length} {fontes.length === 1 ? 'referência' : 'referências'}
            {ref_?.verificadaEm && (
              <> · {/^verifica/i.test(ref_.verificadaEm) ? ref_.verificadaEm.replace(/\.$/, '') : `verificadas em ${ref_.verificadaEm}`}</>
            )}
          </p>
          {comNota && ref_?.introducao && (
            <p className="bib-estante-nota">
              {ref_.titulo && <em>{ref_.titulo} </em>}
              {ref_.introducao}
            </p>
          )}
        </div>
      </header>
      <ol className="bib-fichas">
        {fontes.map((f) => (
          <Ficha key={f.id} f={f} />
        ))}
      </ol>
    </section>
  );
}

function Ficha({ f }: { f: FonteDoCurriculo }) {
  const meta: ReactNode[] = [];
  if (f.instituicoes.length) meta.push(<span key="i">{f.instituicoes.join(' · ')}</span>);
  // Fragmento solto ("1/20", "29/01") não é data legível fora do texto; fica de fora.
  const datas = f.datas.filter((d) => !/^\d{1,2}\/\d{1,2}$/.test(d));
  if (datas.length) meta.push(<span key="d">{datas.join(' · ')}</span>);
  if (f.url) {
    meta.push(
      <a key="u" href={f.url} target="_blank" rel="noopener noreferrer" className="bib-link">
        {f.dominio ?? f.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        <span aria-hidden="true"> ↗</span>
        <span className="so-leitor"> (abre em outra aba)</span>
      </a>,
    );
  } else if (f.dominio) {
    meta.push(
      <span key="d2" className="bib-dominio">
        {f.dominio}
      </span>,
    );
  }
  return (
    <li className="bib-ficha">
      {(f.natureza || f.secundaria) && (
        <p className="v-dado bib-natureza">
          {f.natureza}
          {f.secundaria && <span className="bib-secundaria">{f.natureza ? ' · ' : ''}fonte secundária</span>}
        </p>
      )}
      <p className="bib-ficha-titulo">{f.titulo}</p>
      {f.descricao && <p className="bib-ficha-desc">{f.descricao}</p>}
      {meta.length > 0 && <p className="bib-ficha-meta">{meta}</p>}
    </li>
  );
}

export default BibliotecaV3;
