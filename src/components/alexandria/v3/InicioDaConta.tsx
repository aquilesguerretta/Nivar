// Alexandria v3 — Início de quem tem conta (V2).
//
// Founder, 15/11/2026: "a nova tela de início depois de já ter a conta não
// ficou legal; eu gosto da ideia de ela ser tão bonita como o home mas
// mostrando os seus progressos, pode ser uma tela início modificada".
//
// Mesmo esqueleto da apresentação (herói em duas colunas com gravura,
// faixa das trilhas, números grandes, seções largas, gravura e fecho), com
// o conteúdo trocado pelo estudo da conta: onde parou, nível e sequência,
// o caminho na trilha, as próximas aulas, as medalhas recentes e o registro.
//
// Números: do backend (progresso e perfil) e do índice gerado da fonte.
// Se o perfil não responder, o que depende dele some — nada é estimado.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { useEstudo } from '@/components/alexandria/home/estudo';
import { indice, idDaAula, moduloPorId, TOTAL_AULAS, type ModuloDoIndice } from '@/lib/alexandria/indice';
import { useRevisao } from '@/lib/alexandria/revisao/useRevisao';
import { usePerfilDaConta } from '@/lib/alexandria/perfil/usePerfil';
import { faixaEmUso, nivelDe, xpTotal } from '@/lib/alexandria/perfil/regras';
import { Contagem, Palavras } from './animacoes';
import { Medalha } from './perfil/Medalha';
import { listaDeMedalhas, obtidasPorData, ROTULO_FAMILIA } from './perfil/medalhas';
import { BarraDeXp, EmblemaDeNivel, estadoDoModulo, Icone, LinhaDaTrilha } from './perfil/PecasDeJogo';
import { FaixaParaRevisarHoje, NotaDaRevisao } from './revisao/ParaRevisarHoje';
import { useRevelar } from './usoV3';
import './inicio-conta.css';

type Conta = Extract<ReturnType<typeof useEstudo>, { fase: 'conta' }>;

const CAPAS: Record<string, string> = { I: 'trilha-I', II: 'trilha-II', III: 'trilha-III' };
const ROMANO = new Map(indice.trilhas.map((t) => [t.id, t.romano]));
const rotaDaAula = (m: ModuloDoIndice, n: number) => `/alexandria/trilha/${m.trilhaId}/modulo/${m.id}/aula/${n}`;

function saudacao(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Bom dia';
  if (h >= 12 && h < 18) return 'Boa tarde';
  return 'Boa noite';
}
const hojeLongo = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const dataCurta = (iso: string) =>
  (iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso))
    .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
    .replace('.', '');

/** As próximas aulas não concluídas, a partir de onde o aluno está, na ordem do currículo. */
function proximasAulas(concluidas: ReadonlySet<string>, moduloId: string, numero: number, quantas: number) {
  const todas = indice.modulos.flatMap((m) => m.aulas.map((a) => ({ m, a })));
  const inicio = Math.max(0, todas.findIndex(({ m, a }) => m.id === moduloId && a.numero === numero));
  const out: { m: ModuloDoIndice; a: (typeof todas)[number]['a'] }[] = [];
  for (let i = inicio; i < todas.length && out.length < quantas; i++) {
    const { m, a } = todas[i];
    if (!concluidas.has(idDaAula(m, a.numero))) out.push({ m, a });
  }
  return out;
}

export function InicioDaConta({ conta }: { conta: Conta }) {
  const p = conta.progresso;
  const revisao = useRevisao();
  const perfilLido = usePerfilDaConta(true);
  const perfil = perfilLido && perfilLido !== 'falhou' ? perfilLido : null;

  const concluidas = useMemo(() => new Set(p.aulasConcluidas), [p.aulasConcluidas]);
  const primeiroNome = conta.nome.split(' ')[0];
  const ponto = conta.ponto;
  const mod = moduloPorId(ponto.modulo.id);
  const aula = mod?.aulas.find((a) => a.numero === ponto.aula.number) ?? null;
  const rota = mod ? rotaDaAula(mod, ponto.aula.number) : '/alexandria/trilhas';
  const trilhaAtual = indice.trilhas.find((t) => t.id === mod?.trilhaId) ?? indice.trilhas[0];
  const modulosDaTrilha = indice.modulos.filter((m) => m.trilhaId === trilhaAtual.id);

  const percorridas = indice.modulos.reduce(
    (s, m) => s + m.aulas.filter((a) => concluidas.has(idDaAula(m, a.numero))).length,
    0,
  );
  const atual = !p.streak.semRegistro && typeof p.streak.atual === 'number' ? p.streak.atual : 0;

  const nivel = perfil ? nivelDe(xpTotal(perfil.primeiras, perfil.dias)) : null;
  const medalhas = useMemo(() => listaDeMedalhas(p, perfil), [p, perfil]);
  const obtidas = obtidasPorData(medalhas);

  const territoriosComModulo = useMemo(() => {
    const s = new Set<string>();
    for (const m of indice.modulos) {
      if (estadoDoModulo(m, concluidas).estado === 'concluido' && m.trilhaId) s.add(ROMANO.get(m.trilhaId) ?? '');
    }
    return s;
  }, [concluidas]);
  const faixa = perfil && nivel ? faixaEmUso(perfil.faixa, { aulasConcluidas: concluidas.size, territoriosComModulo, nivel: nivel.nivel }) : null;
  const imagem = faixa?.imagem ?? `/alexandria/v3/trilhas/${CAPAS[trilhaAtual.romano] ?? 'trilha-I'}`;
  // A gravura do fim nunca repete a do topo.
  const gravuraDoFim = imagem.endsWith('home-aula') ? '/alexandria/v3/home/home-farol' : '/alexandria/v3/home/home-aula';
  const legenda = faixa?.imagem ? `Sua faixa · ${faixa.nome}` : `Gravura gerada · Trilha ${trilhaAtual.romano}`;

  // O que chega depois do perfil (medalhas derivadas, nível) também entra revelando.
  const raiz = useRevelar<HTMLElement>([perfilLido, medalhas.length]);

  const proximas = mod ? proximasAulas(concluidas, mod.id, ponto.aula.number, 4) : [];

  return (
    <main className="home ic" ref={raiz}>
      {/* ── herói ─────────────────────────────────────── */}
      <section className="heroi ic-heroi">
        <div className="heroi-texto">
          <div className="heroi-topo">
            <p className="v-dado sobe" style={{ ['--i' as string]: 0 }}>
              {hojeLongo.format(new Date())}
            </p>
            <h1 className="v-manchete heroi-titulo ic-titulo">
              <Palavras texto={`${saudacao()},`} desde={1} />
              <em>
                <Palavras texto={`${primeiroNome}.`} desde={3} />
              </em>
            </h1>
            <div className="ic-continuar sobe" style={{ ['--i' as string]: 5 }}>
              <p className="v-dado">
                {ponto.estado === 'em leitura' ? 'Em leitura' : ponto.estado === 'a seguir' ? 'A seguir' : 'Para começar'} ·{' '}
                {mod?.codigo} · Aula {String(ponto.aula.number).padStart(2, '0')} de{' '}
                {mod ? String(mod.aulas.length).padStart(2, '0') : '—'}
              </p>
              <p className="ic-continuar-titulo">{aula?.titulo ?? ponto.aula.title}</p>
              <p className="ic-continuar-motivo">{ponto.motivo}</p>
            </div>
            <div className="heroi-acoes sobe" style={{ ['--i' as string]: 6 }}>
              <Link to={rota} className="botao">
                Continuar a aula
              </Link>
              <Link to="/alexandria/perfil" className="link-seta">
                Ver meu perfil
              </Link>
            </div>
          </div>
        </div>

        <figure className="heroi-figura ic-figura">
          <img
            src={`${imagem}-1600.webp`}
            srcSet={`${imagem}-800.webp 800w, ${imagem}-1600.webp 1600w`}
            sizes="(max-width: 860px) 100vw, 56vw"
            alt=""
            decoding="async"
          />
          <span className="relampago" aria-hidden="true" />
          {nivel && (
            <div className="ic-jogador sobe" style={{ ['--i' as string]: 7 }}>
              <EmblemaDeNivel nivel={nivel} tamanho={108} />
              <div className="ic-jogador-texto">
                <BarraDeXp nivel={nivel} compacta />
                <p className="ic-jogador-linha">
                  <span className="ic-raio">
                    <Icone nome="sequencia" />
                  </span>
                  {atual >= 1 ? (
                    <>
                      <strong>{atual}</strong> {atual === 1 ? 'dia seguido' : 'dias seguidos'}
                    </>
                  ) : (
                    'a sequência recomeça hoje'
                  )}
                  <span className="ic-ponto">·</span>
                  <strong>{obtidas.length}</strong> {obtidas.length === 1 ? 'medalha' : 'medalhas'}
                </p>
              </div>
            </div>
          )}
          <figcaption className="v-dado legenda-gravura">{legenda}</figcaption>
        </figure>

        <nav className="heroi-trilhas ic-trilhas" aria-label="Seu progresso nas três trilhas">
          {indice.trilhas.map((t) => {
            const mods = indice.modulos.filter((m) => m.trilhaId === t.id);
            const total = mods.reduce((n, m) => n + m.aulas.length, 0);
            const feitas = mods.reduce((n, m) => n + m.aulas.filter((a) => concluidas.has(idDaAula(m, a.numero))).length, 0);
            return (
              <Link key={t.id} to={`/alexandria/trilha/${t.id}`} className="heroi-trilha" data-aqui={t.id === trilhaAtual.id || undefined}>
                <span className="heroi-trilha-romano">{t.romano}</span>
                <span className="heroi-trilha-nome">{t.nome}</span>
                <span className="v-dado">
                  {feitas === total && total > 0 ? 'concluída' : `${feitas} de ${total} aulas`}
                </span>
                <span className="ic-trilha-barra" aria-hidden="true">
                  <span style={{ transform: `scaleX(${total ? feitas / total : 0})` }} />
                </span>
              </Link>
            );
          })}
        </nav>
      </section>

      <FaixaParaRevisarHoje revisao={revisao} />

      {/* ── números ───────────────────────────────────── */}
      <section className="numeros revelar" aria-label="Seu estudo em números">
        {[
          { n: percorridas, r: 'aulas concluídas', d: `de ${TOTAL_AULAS} no currículo` },
          { n: atual, r: atual === 1 ? 'dia seguido' : 'dias seguidos', d: 'com estudo registrado' },
          { n: obtidas.length, r: obtidas.length === 1 ? 'medalha' : 'medalhas', d: `de ${medalhas.length} possíveis` },
          ...(nivel ? [{ n: nivel.nivel, r: 'nível', d: `${nivel.xp.toLocaleString('pt-BR')} XP somados` }] : []),
        ].map((x) => (
          <div key={x.r} className="numero">
            <span className="numero-valor">
              <Contagem valor={x.n} />
            </span>
            <span className="v-dado">{x.r}</span>
            <span className="numero-desc">{x.d}</span>
          </div>
        ))}
      </section>

      {/* ── o caminho na trilha ───────────────────────── */}
      <section className="ic-caminho" aria-labelledby="ic-caminho-titulo">
        <header className="secao-cabeca revelar">
          <p className="v-dado">Seu caminho</p>
          <h2 className="v-manchete secao-titulo" id="ic-caminho-titulo">
            Você está na Trilha {trilhaAtual.romano}. <em>{trilhaAtual.nome}.</em>
          </h2>
        </header>
        <div className="ic-linha revelar">
          <LinhaDaTrilha modulos={modulosDaTrilha} concluidas={concluidas} atual={mod?.id ?? null} />
        </div>

        {proximas.length > 0 && (
          <>
            <p className="v-dado ic-proximas-rotulo revelar">As próximas aulas</p>
            <ol className="ic-proximas">
              {proximas.map(({ m, a }, i) => (
                <li key={`${m.id}-${a.numero}`} className="ic-proxima revelar" style={{ ['--i' as string]: i }} data-primeira={i === 0 || undefined}>
                  <Link to={rotaDaAula(m, a.numero)} className="ic-proxima-link">
                    <span className="v-dado ic-proxima-onde">
                      {m.codigo} · Aula {String(a.numero).padStart(2, '0')}
                    </span>
                    <span className="ic-proxima-titulo">{a.titulo ?? `Aula ${a.numero}`}</span>
                    {a.tema && <span className="v-dado ic-proxima-tema">{a.tema}</span>}
                    <span className="ic-proxima-acao">{i === 0 ? 'Continuar' : 'Abrir'}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      {/* ── medalhas recentes ─────────────────────────── */}
      <section className="ic-medalhas" aria-labelledby="ic-medalhas-titulo">
        <header className="secao-cabeca revelar">
          <p className="v-dado">Medalhas</p>
          <h2 className="v-manchete secao-titulo" id="ic-medalhas-titulo">
            {obtidas.length === 0 ? (
              <>
                A primeira está a <em>uma aula de distância.</em>
              </>
            ) : (
              <>
                {obtidas.length} {obtidas.length === 1 ? 'conquistada' : 'conquistadas'}, <em>{medalhas.length - obtidas.length} por fazer.</em>
              </>
            )}
          </h2>
        </header>
        <ul className="ic-medalhas-lista">
          {(obtidas.length ? obtidas.slice(0, 4) : medalhas.filter((m) => !m.obtida).slice(0, 4)).map((m, i) => (
            <li key={m.id} className="ic-medalha revelar" style={{ ['--i' as string]: i }}>
              <Medalha familia={m.familia} motivo={m.motivo} obtida={m.obtida} recente={i === 0 && m.obtida} tamanho={112} />
              <span className="v-dado ic-medalha-familia">{ROTULO_FAMILIA[m.familia]}</span>
              <span className="ic-medalha-nome">{m.nome}</span>
              <span className="v-dado ic-medalha-data">
                {m.obtida ? (m.data ? dataCurta(m.data) : 'obtida') : m.criterio}
              </span>
            </li>
          ))}
        </ul>
        <p className="ic-medalhas-mais revelar">
          <Link to="/alexandria/perfil" className="link-seta">
            Ver todas no perfil
          </Link>
        </p>
      </section>

      {/* ── registro ──────────────────────────────────── */}
      <section className="ic-registro revelar" aria-label="Seu registro">
        <dl className="ic-registro-linhas">
          <div>
            <dt>Percorrido</dt>
            <dd>{percorridas === 0 ? 'nenhuma aula ainda' : `${percorridas} de ${TOTAL_AULAS} aulas`}</dd>
          </div>
          <div>
            <dt>Praticado</dt>
            <dd>
              {!p.pratica || p.pratica.semRegistro
                ? 'nenhuma tentativa ainda'
                : `${p.pratica.totalTentativas} ${p.pratica.totalTentativas === 1 ? 'tentativa' : 'tentativas'} em ${p.pratica.totalAulasComPratica} ${p.pratica.totalAulasComPratica === 1 ? 'aula' : 'aulas'}`}
            </dd>
          </div>
          <div>
            <dt>Demonstrado</dt>
            <dd>ainda não avaliado</dd>
          </div>
        </dl>
        <NotaDaRevisao revisao={revisao} />
      </section>

      {/* ── gravura e fecho ───────────────────────────── */}
      <figure className="faixa-gravura revelar">
        <img
          src={`${gravuraDoFim}-1600.webp`}
          srcSet={`${gravuraDoFim}-800.webp 800w, ${gravuraDoFim}-1600.webp 1600w, ${gravuraDoFim}-2400.webp 2400w`}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <figcaption className="v-dado legenda-gravura">
          Gravura gerada · {gravuraDoFim.endsWith('farol') ? 'o farol' : 'a conferência'}
        </figcaption>
      </figure>

      <section className="fecho revelar">
        {mod?.tese ? (
          <>
            <p className="v-dado">
              {mod.codigo} · {mod.titulo}
            </p>
            <h2 className="v-manchete fecho-titulo ic-tese">“{mod.tese}”</h2>
          </>
        ) : (
          <h2 className="v-manchete fecho-titulo">
            Uma aula por vez. <em>O caminho fica guardado.</em>
          </h2>
        )}
        <div className="heroi-acoes">
          <Link to={rota} className="botao">
            Continuar a aula
          </Link>
          <Link to="/alexandria/trilhas" className="link-seta">
            Ver todas as trilhas
          </Link>
        </div>
      </section>
    </main>
  );
}
