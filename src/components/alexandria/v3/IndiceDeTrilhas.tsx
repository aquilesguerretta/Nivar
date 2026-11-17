// Alexandria v3 — "O Índice": trilhas, módulos e aulas numa tela só.
//
// Coluna esquerda fixa: as três trilhas, os módulos da trilha em foco e a régua
// das 141 aulas (um traço por aula). Coluna direita: cada trilha abre com a sua
// gravura (imagem estética, classe declarada) e lista os módulos; cada módulo
// mostra a frase-tese da fonte e abre no lugar, como gaveta, com as aulas.
//
// Dado: só `src/lib/alexandria/indice.ts` (gerado da extração verificada).
// Estado: só o registro do backend (useEstudo). Visitante não vê estado
// persistido (contrato S3) — vê o currículo.

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEstudo } from '@/components/alexandria/home/estudo';
import { indice, idDaAula, TOTAL_AULAS, type ModuloDoIndice, type TrilhaDoIndice } from '@/lib/alexandria/indice';
import { CasaV3 } from './CasaV3';
import { rolarPara, useRevelar } from './usoV3';
import './indice-v3.css';

type EstadoAula = 'percorrida' | 'em leitura' | 'não iniciada';

const CAPA: Record<string, string> = { I: 'trilha-I', II: 'trilha-II', III: 'trilha-III' };
const RAIZ_CAPAS = '/alexandria/v3/trilhas';

function rotaDaAula(m: ModuloDoIndice, n: number) {
  return `/alexandria/trilha/${m.trilhaId}/modulo/${m.id}/aula/${n}`;
}

function plural(n: number, um: string, varios: string) {
  return `${n} ${n === 1 ? um : varios}`;
}

export function IndiceDeTrilhas({
  trilhaFoco = null,
  moduloAberto = null,
}: {
  trilhaFoco?: string | null;
  moduloAberto?: string | null;
}) {
  const estudo = useEstudo();
  const conta = estudo.fase === 'conta' ? estudo : null;

  const concluidas = useMemo(() => new Set(conta?.progresso.aulasConcluidas ?? []), [conta]);
  const emLeitura = useMemo(() => new Set(conta?.progresso.aulasEmAndamento ?? []), [conta]);
  const ponto =
    conta && !conta.semEventos ? { moduloId: conta.ponto.modulo.id, numero: conta.ponto.aula.number } : null;

  const [abertos, setAbertos] = useState<Set<string>>(() => new Set(moduloAberto ? [moduloAberto] : []));
  const [trilhaAtiva, setTrilhaAtiva] = useState<string>(trilhaFoco ?? indice.trilhas[0].id);

  // O módulo do ponto de estudo abre sozinho na primeira carga com conta.
  useEffect(() => {
    if (ponto && !moduloAberto) setAbertos((s) => (s.size ? s : new Set([ponto.moduloId])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ponto?.moduloId]);

  // Chegar por URL de trilha ou de módulo leva até ela.
  useEffect(() => {
    const alvo = moduloAberto ?? trilhaFoco;
    if (!alvo) return;
    rolarPara(alvo, false);
  }, [moduloAberto, trilhaFoco]);

  // A trilha em leitura acende no índice da esquerda.
  useEffect(() => {
    const secoes = indice.trilhas
      .map((t) => document.getElementById(t.id))
      .filter((x): x is HTMLElement => !!x);
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visivel) setTrilhaAtiva(visivel.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    secoes.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const raizRef = useRevelar<HTMLDivElement>([]);

  const estadoDe = (m: ModuloDoIndice, n: number): EstadoAula | null => {
    if (!conta) return null;
    const id = idDaAula(m, n);
    if (concluidas.has(id)) return 'percorrida';
    if (emLeitura.has(id)) return 'em leitura';
    return 'não iniciada';
  };

  const alternar = (id: string) =>
    setAbertos((s) => {
      const novo = new Set(s);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });

  const irPara = (id: string) => {
    rolarPara(id);
  };

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
    <CasaV3 secao="trilhas" conta={contaNaCasa}>
      <div className="ind" ref={raizRef}>
        <aside className="ind-lado" aria-label="Índice do currículo">
          <p className="v-dado ind-rotulo">O currículo</p>
          <nav aria-label="Trilhas">
            <ol className="ind-trilhas">
              {indice.trilhas.map((t) => (
                <TrilhaNoIndice
                  key={t.id}
                  trilha={t}
                  ativa={t.id === trilhaAtiva}
                  irPara={irPara}
                />
              ))}
            </ol>
          </nav>

          {conta && <Percurso concluidas={concluidas} />}

          {conta ? (
            <dl className="ind-legenda">
              <div><dt><span className="marca marca-percorrida" aria-hidden="true" /></dt><dd>percorrida</dd></div>
              <div><dt><span className="marca marca-leitura" aria-hidden="true" /></dt><dd>em leitura</dd></div>
              <div><dt><span className="marca" aria-hidden="true" /></dt><dd>não iniciada</dd></div>
            </dl>
          ) : estudo.fase === 'carregando' ? null : (
            <p className="ind-visitante">
              <Link to="/entrar">Entre</Link> para guardar o que você percorre. Sem conta, o índice
              mostra o currículo inteiro e nenhum estado.
            </p>
          )}
        </aside>

        <main className="ind-corpo">
          <header className="ind-abertura revelar">
            <p className="v-dado">Trilhas e módulos</p>
            <h1 className="v-manchete ind-titulo">
              Três trilhas, dezessete módulos, <em>{TOTAL_AULAS} aulas.</em>
            </h1>
          </header>

          {indice.trilhas.map((t, i) => (
            <SecaoDaTrilha
              key={t.id}
              trilha={t}
              primeira={i === 0}
              abertos={abertos}
              alternar={alternar}
              estadoDe={estadoDe}
              ponto={ponto}
              comConta={!!conta}
            />
          ))}
        </main>
      </div>
    </CasaV3>
  );
}

function TrilhaNoIndice({
  trilha,
  ativa,
  irPara,
}: {
  trilha: TrilhaDoIndice;
  ativa: boolean;
  irPara: (id: string) => void;
}) {
  const mods = indice.modulos.filter((m) => m.trilhaId === trilha.id);
  return (
    <li className="ind-trilha" data-ativa={ativa}>
      <a
        href={`#${trilha.id}`}
        className="ind-trilha-link"
        aria-current={ativa ? 'location' : undefined}
        onClick={(e) => {
          e.preventDefault();
          irPara(trilha.id);
        }}
      >
        <span className="ind-romano">{trilha.romano}</span>
        <span className="ind-trilha-nome">{trilha.nome ?? 'Trilha sem nome na fonte'}</span>
      </a>
      <ol className="ind-modulos">
        {mods.map((m) => (
          <li key={m.id}>
            <a
              href={`#${m.id}`}
              className="ind-modulo-link"
              onClick={(e) => {
                e.preventDefault();
                irPara(m.id);
              }}
            >
              <span className="v-dado">{m.codigo}</span>
              <span>{m.titulo}</span>
            </a>
          </li>
        ))}
      </ol>
    </li>
  );
}

/** Seu percurso: por trilha, quantas aulas o registro tem como percorridas, em
 *  palavras e numa linha de traços (um por aula). Só aparece com conta: para
 *  visitante seriam traços iguais, sem significado. */
export function Percurso({ concluidas }: { concluidas: Set<string> }) {
  return (
    <section className="percurso" aria-labelledby="percurso-titulo">
      <p className="v-dado" id="percurso-titulo">Seu percurso</p>
      <ul className="percurso-lista">
        {indice.trilhas.map((t) => {
          const mods = indice.modulos.filter((m) => m.trilhaId === t.id);
          const aulas = mods.flatMap((m) => m.aulas.map((a) => idDaAula(m, a.numero)));
          const feitas = aulas.filter((id) => concluidas.has(id)).length;
          return (
            <li key={t.id} className="percurso-trilha">
              <span className="percurso-rotulo">
                <span className="percurso-romano">{t.romano}</span>
                {feitas === 0 ? 'nenhuma aula percorrida' : `${feitas} de ${aulas.length} aulas percorridas`}
              </span>
              <span className="percurso-tracos" aria-hidden="true">
                {aulas.map((id) => (
                  <span key={id} className="percurso-traco" data-feita={concluidas.has(id)} />
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SecaoDaTrilha({
  trilha,
  primeira,
  abertos,
  alternar,
  estadoDe,
  ponto,
  comConta,
}: {
  trilha: TrilhaDoIndice;
  primeira: boolean;
  abertos: Set<string>;
  alternar: (id: string) => void;
  estadoDe: (m: ModuloDoIndice, n: number) => EstadoAula | null;
  ponto: { moduloId: string; numero: number } | null;
  comConta: boolean;
}) {
  const mods = indice.modulos.filter((m) => m.trilhaId === trilha.id);
  const aulas = mods.reduce((s, m) => s + m.aulas.length, 0);
  const capa = CAPA[trilha.romano];
  return (
    <section className="trilha" id={trilha.id} aria-labelledby={`${trilha.id}-titulo`}>
      <figure className="trilha-capa revelar">
        {capa && (
          <img
            src={`${RAIZ_CAPAS}/${capa}-1600.webp`}
            srcSet={`${RAIZ_CAPAS}/${capa}-800.webp 800w, ${RAIZ_CAPAS}/${capa}-1600.webp 1600w`}
            sizes="(max-width: 860px) 100vw, 1100px"
            width={1600}
            height={905}
            alt=""
            loading={primeira ? 'eager' : 'lazy'}
            decoding="async"
          />
        )}
        <div className="trilha-bloco">
          <span className="v-dado trilha-num">Trilha {trilha.romano}</span>
          <h2 className="trilha-nome" id={`${trilha.id}-titulo`}>
            {trilha.nome}
          </h2>
          <span className="v-dado trilha-conta">
            {plural(mods.length, 'módulo', 'módulos')} · {plural(aulas, 'aula', 'aulas')}
          </span>
        </div>
        <figcaption className="v-dado trilha-legenda">Gravura gerada · capa da Trilha {trilha.romano}</figcaption>
      </figure>

      <ol className="modulos">
        {mods.map((m) => (
          <ModuloDoIndiceV3
            key={m.id}
            modulo={m}
            aberto={abertos.has(m.id)}
            alternar={() => alternar(m.id)}
            estadoDe={estadoDe}
            ponto={ponto}
            comConta={comConta}
          />
        ))}
      </ol>
    </section>
  );
}

function ModuloDoIndiceV3({
  modulo: m,
  aberto,
  alternar,
  estadoDe,
  ponto,
  comConta,
}: {
  modulo: ModuloDoIndice;
  aberto: boolean;
  alternar: () => void;
  estadoDe: (m: ModuloDoIndice, n: number) => EstadoAula | null;
  ponto: { moduloId: string; numero: number } | null;
  comConta: boolean;
}) {
  const estados = m.aulas.map((a) => estadoDe(m, a.numero));
  const feitas = estados.filter((e) => e === 'percorrida').length;
  const idGaveta = `${m.id}-aulas`;
  const meta = [
    plural(m.aulas.length, 'aula', 'aulas'),
    m.totalInstrumentos != null ? plural(m.totalInstrumentos, 'instrumento', 'instrumentos') : null,
    m.totalTermos != null ? plural(m.totalTermos, 'termo', 'termos') : null,
  ].filter(Boolean);

  return (
    <li className="modulo revelar" id={m.id} data-aberto={aberto}>
      <div className="modulo-cabeca">
        <span className="v-dado modulo-codigo">{m.codigo}</span>
        <div className="modulo-corpo">
          <h3 className="modulo-titulo">
            <button
              type="button"
              className="modulo-botao"
              aria-expanded={aberto}
              aria-controls={idGaveta}
              onClick={alternar}
              data-moldura="linha"
            >
              {m.titulo}
            </button>
          </h3>
          {m.tese && <p className="modulo-tese">{m.tese}</p>}
          <span
            className="modulo-marcas"
            role="img"
            aria-label={
              comConta
                ? `${feitas} de ${m.aulas.length} aulas percorridas`
                : plural(m.aulas.length, 'aula', 'aulas')
            }
          >
            {m.aulas.map((a, i) => {
              const aqui = ponto && ponto.moduloId === m.id && ponto.numero === a.numero;
              const e = estados[i];
              return (
                <span
                  key={a.numero}
                  className={`marca${e === 'percorrida' ? ' marca-percorrida' : ''}${e === 'em leitura' ? ' marca-leitura' : ''}${aqui ? ' marca-aqui' : ''}`}
                />
              );
            })}
          </span>
        </div>
        <span className="v-dado modulo-meta">{meta.join(' · ')}</span>
        <span className="modulo-sinal" aria-hidden="true" />
      </div>

      <div className="modulo-gaveta" id={idGaveta} inert={!aberto}>
        <div className="gaveta-dentro">
          <ol className="aulas">
            {m.aulas.map((a, i) => {
              const aqui = ponto && ponto.moduloId === m.id && ponto.numero === a.numero;
              const e = estados[i];
              return (
                <li key={a.numero} className="aula" data-aqui={aqui || undefined} style={{ ['--i' as string]: i }}>
                  <Link to={rotaDaAula(m, a.numero)} className="aula-link">
                    <span className="v-dado aula-num">{String(a.numero).padStart(2, '0')}</span>
                    <span className="aula-texto">
                      <span className="aula-titulo">{a.titulo ?? `Aula ${a.numero}`}</span>
                      {a.tema && <span className="v-dado aula-tema">{a.tema}</span>}
                      {a.sinopse && <span className="aula-sinopse">{a.sinopse}</span>}
                    </span>
                    <span className="v-dado aula-estado">{aqui ? 'Continuar' : e ?? ''}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="gaveta-consulta v-dado">
            <Link to={`/alexandria/glossario?m=${m.codigo}`}>Termos do módulo</Link>
            <Link to={`/alexandria/biblioteca?m=${m.codigo}`}>Fontes do módulo</Link>
          </p>
        </div>
      </div>
    </li>
  );
}
