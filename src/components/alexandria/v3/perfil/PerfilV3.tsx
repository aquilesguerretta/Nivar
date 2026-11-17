// Alexandria v3 — Perfil (V2).
//
// Founder, 15/11/2026: "uma aba de perfil separada da plataforma ... um
// perfil de jogo mesmo, como se fosse Duolingo"; "a foto é só da
// Alexandria, medalhas e banners, não quero ligas mas pode ter uma
// leaderboard para cada jogo, nível e XP também, e todo o resto".
//
// O que esta tela afirma vem de duas leituras da conta:
//   · GET /api/progress/me      — aulas concluídas, conquistas gravadas, sequência;
//   · GET /api/progress/perfil  — dias de estudo, primeira vez de cada ato, foto, faixa.
// XP, nível, medalhas de hábito e exploração, faixas destravadas e o
// histórico são regra da casa sobre esses fatos (`lib/alexandria/perfil/regras.ts`).
// XP mede atividade registrada, nunca conhecimento — e a tela diz isso.
//
// Rota protegida pelo mesmo mecanismo do perfil anterior: sem conta,
// `<Navigate to="/entrar" state={{ de }}>`; carregando, nunca redireciona.

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { indice, idDaAula, type ModuloDoIndice } from '@/lib/alexandria/indice';
import { fusoDoNavegador, getMyProgress, type MyProgress } from '@/lib/progress/progressApi';
import {
  apagarFoto,
  enderecoDaFoto,
  enviarFoto,
  escolherFaixa,
  getPerfil,
  prepararFoto,
  type PerfilDaConta,
} from '@/lib/alexandria/perfil/perfilApi';
import {
  calendario,
  FAIXAS,
  faixaDestravada,
  faixaEmUso,
  historico,
  melhorDia,
  semanaDeXp,
  turnoPreferido,
  xpPorDia,
  nivelDe,
  REGRAS_DE_XP,
  xpTotal,
  type EntradaDasFaixas,
} from '@/lib/alexandria/perfil/regras';
import { CasaV3 } from '../CasaV3';
import { Medalha } from './Medalha';
import { listaDeMedalhas, obtidasPorData, ROTULO_FAMILIA, type MedalhaNaTela } from './medalhas';
import { AnelDeProgresso, BarraDeXp, GraficoDaSemana, Icone, PlacaDeSequencia, EmblemaDeNivel, estadoDoModulo, LinhaDaTrilha, Placa } from './PecasDeJogo';
import './perfil-v3.css';

const PRODUTO = 'alexandria';

// ── currículo, montado uma vez ──────────────────────────────────────────

const ROMANO_DA_TRILHA = new Map(indice.trilhas.map((t) => [t.id, t.romano]));
const MODULO_POR_NUMERO = new Map(indice.modulos.map((m) => [m.numero, m]));

function moduloDaAula(aulaId: string): { modulo: ModuloDoIndice; numero: number } | null {
  const m = /^aula-(\d{2})-(\d{2})$/.exec(aulaId);
  if (!m) return null;
  const modulo = MODULO_POR_NUMERO.get(Number(m[1]));
  return modulo ? { modulo, numero: Number(m[2]) } : null;
}

const rotaDaAula = (m: ModuloDoIndice, n: number) => `/alexandria/trilha/${m.trilhaId}/modulo/${m.id}/aula/${n}`;

const TOTAL_AULAS = indice.modulos.reduce((s, m) => s + m.aulas.length, 0);

// ── formatação ──────────────────────────────────────────────────────────

const nf = new Intl.NumberFormat('pt-BR');
function dataLonga(iso: string): string {
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function dataCurta(iso: string): string {
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');
}
const plural = (n: number, um: string, varios: string) => `${nf.format(n)} ${n === 1 ? um : varios}`;

// ── página ──────────────────────────────────────────────────────────────

interface Dados {
  progresso: MyProgress;
  perfil: PerfilDaConta;
}

export function PerfilV3() {
  const { user, loading, myProducts, activateProduct, logout } = useAuth();
  const location = useLocation();
  const [dados, setDados] = useState<Dados | null>(null);
  const [falhou, setFalhou] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const fuso = useMemo(() => fusoDoNavegador(), []);

  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    setFalhou(false);
    Promise.all([getMyProgress(ctrl.signal, fuso), getPerfil(fuso, ctrl.signal)])
      .then(([progresso, perfil]) => setDados({ progresso, perfil }))
      .catch((e: unknown) => {
        if (e instanceof Error && e.name === 'AbortError') return;
        setFalhou(true);
      });
    return () => ctrl.abort();
  }, [user, fuso, tentativa]);

  // Estar no perfil já é intenção de uso: ativa o produto se faltar (mesma
  // regra do perfil anterior; consulta antes de escrever).
  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    myProducts(ctrl.signal)
      .then(async ({ products }) => {
        if (!products.some((p) => p.productId === PRODUTO)) await activateProduct(PRODUTO);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [user, myProducts, activateProduct]);

  const contaNaCasa = user ? (
    <Link to="/alexandria/perfil" className="casa-conta" aria-current="page">
      {user.name}
    </Link>
  ) : (
    <Link to="/entrar" className="casa-conta">
      Entrar
    </Link>
  );

  if (!loading && !user) return <Navigate to="/entrar" state={{ de: location.pathname }} replace />;

  return (
    <CasaV3 secao="perfil" conta={contaNaCasa}>
      <main className="pf">
        {loading || (!dados && !falhou) ? (
          <p className="pf-aviso v-dado" role="status">
            Abrindo o seu perfil…
          </p>
        ) : falhou || !dados || !user ? (
          <div className="pf-aviso">
            <p>O seu progresso não respondeu agora. Nada foi perdido: o registro fica no servidor.</p>
            <button type="button" className="pf-botao" onClick={() => setTentativa((n) => n + 1)}>
              Tentar de novo
            </button>
          </div>
        ) : (
          <Perfil
            nome={user.name}
            dados={dados}
            atualizar={(perfil) => setDados((d) => (d ? { ...d, perfil: { ...d.perfil, ...perfil } } : d))}
            sair={logout}
          />
        )}
      </main>
    </CasaV3>
  );
}

function Perfil({
  nome,
  dados,
  atualizar,
  sair,
}: {
  nome: string;
  dados: Dados;
  atualizar: (p: Partial<PerfilDaConta>) => void;
  sair: () => Promise<void> | void;
}) {
  const { progresso, perfil } = dados;
  const concluidas = useMemo(() => new Set(progresso.aulasConcluidas), [progresso.aulasConcluidas]);
  const xp = xpTotal(perfil.primeiras, perfil.dias);
  const nivel = nivelDe(xp);

  const medalhas = useMemo(() => listaDeMedalhas(progresso, perfil), [progresso, perfil]);

  const territoriosComModulo = useMemo(() => {
    const s = new Set<string>();
    for (const m of indice.modulos) {
      if (m.aulas.length && m.aulas.every((a) => concluidas.has(idDaAula(m, a.numero)))) {
        const r = m.trilhaId ? ROMANO_DA_TRILHA.get(m.trilhaId) : null;
        if (r) s.add(r);
      }
    }
    return s;
  }, [concluidas]);

  const entradaFaixas: EntradaDasFaixas = {
    aulasConcluidas: concluidas.size,
    territoriosComModulo,
    nivel: nivel.nivel,
  };
  const faixa = faixaEmUso(perfil.faixa, entradaFaixas);

  return (
    <>
      <Cabeca
        nome={nome}
        perfil={perfil}
        faixa={faixa}
        entradaFaixas={entradaFaixas}
        nivel={nivel}
        atualizar={atualizar}
      />
      <Numeros progresso={progresso} perfil={perfil} concluidas={concluidas} medalhas={medalhas} />
      <Calendario perfil={perfil} />
      <ProgressoPorTrilha concluidas={concluidas} />
      <Medalhas lista={medalhas} />
      <Historico perfil={perfil} />
      <section className="pf-secao pf-rodape">
        <p className="v-dado">Placares por jogo chegam junto com os jogos. Não há ligas.</p>
        <div className="pf-rodape-acoes">
          <Link to="/conta" className="pf-link">
            Configurações da conta
          </Link>
          <button type="button" className="pf-link" onClick={() => void sair()}>
            Sair
          </button>
        </div>
      </section>
    </>
  );
}

// ── cabeça: faixa, foto, nome, nível ────────────────────────────────────

function Cabeca({
  nome,
  perfil,
  faixa,
  entradaFaixas,
  nivel,
  atualizar,
}: {
  nome: string;
  perfil: PerfilDaConta;
  faixa: (typeof FAIXAS)[number];
  entradaFaixas: EntradaDasFaixas;
  nivel: ReturnType<typeof nivelDe>;
  atualizar: (p: Partial<PerfilDaConta>) => void;
}) {
  const [escolhendo, setEscolhendo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const arquivoRef = useRef<HTMLInputElement | null>(null);

  const trocarFoto = async (arquivo: File | undefined) => {
    if (!arquivo) return;
    setAviso(null);
    setEnviando(true);
    try {
      const blob = await prepararFoto(arquivo);
      const r = await enviarFoto(blob);
      atualizar({ temFoto: true, fotoAtualizadaEm: r.fotoAtualizadaEm });
    } catch (e) {
      setAviso(e instanceof Error ? `A foto não foi salva: ${e.message}` : 'A foto não foi salva.');
    } finally {
      setEnviando(false);
      if (arquivoRef.current) arquivoRef.current.value = '';
    }
  };

  const tirarFoto = async () => {
    setAviso(null);
    try {
      await apagarFoto();
      atualizar({ temFoto: false, fotoAtualizadaEm: null });
    } catch {
      setAviso('A foto não foi removida. Tente de novo.');
    }
  };

  const usarFaixa = async (id: string) => {
    setAviso(null);
    const anterior = perfil.faixa;
    atualizar({ faixa: id });
    try {
      await escolherFaixa(id);
      setEscolhendo(false);
    } catch {
      atualizar({ faixa: anterior });
      setAviso('A faixa não foi trocada. Tente de novo.');
    }
  };

  const iniciais = nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <header className="pf-cabeca">
      <div className={`pf-faixa${faixa.imagem ? '' : ' pf-faixa-papel'}`}>
        {faixa.imagem && (
          <img
            src={`${faixa.imagem}-1600.webp`}
            srcSet={`${faixa.imagem}-800.webp 800w, ${faixa.imagem}-1600.webp 1600w`}
            sizes="100vw"
            alt=""
          />
        )}
        <span className="pf-faixa-nome-tag">Faixa · {faixa.nome}</span>
        <button type="button" className="pf-faixa-trocar" onClick={() => setEscolhendo((v) => !v)} aria-expanded={escolhendo}>
          {escolhendo ? 'Fechar faixas' : 'Trocar faixa'}
        </button>
      </div>

      {escolhendo && (
        <div className="pf-faixas" role="group" aria-label="Faixas do perfil">
          {FAIXAS.map((f) => {
            const livre = faixaDestravada(f.id, entradaFaixas);
            const atual = f.id === faixa.id;
            return (
              <button
                key={f.id}
                type="button"
                className="pf-faixa-opcao"
                disabled={!livre}
                aria-pressed={atual}
                onClick={() => livre && !atual && void usarFaixa(f.id)}
              >
                <span className={`pf-faixa-mini${f.imagem ? '' : ' pf-faixa-papel'}`}>
                  {f.imagem && <img src={`${f.imagem}-800.webp`} alt="" loading="lazy" />}
                </span>
                <span className="pf-faixa-nome">{f.nome}</span>
                <span className="v-dado pf-faixa-crit">
                  {livre ? (
                    atual ? 'em uso' : 'disponível'
                  ) : (
                    <span className="pf-faixa-cadeado">
                      <Icone nome="cadeado" />
                      {f.criterio}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="pf-identidade">
        <div className="pf-foto">
          {perfil.temFoto ? (
            <img src={enderecoDaFoto(perfil.fotoAtualizadaEm)} alt={`Foto de ${nome}`} />
          ) : (
            <span className="pf-foto-iniciais" aria-hidden="true">
              {iniciais || '·'}
            </span>
          )}
        </div>
        <div className="pf-quem">
          <p className="v-dado">Perfil na Alexandria</p>
          <h1 className="pf-nome">{nome}</h1>
          <p className="pf-desde">
            {perfil.desde ? `Estuda aqui desde ${dataLonga(perfil.desde)}.` : 'Nenhum estudo registrado ainda.'}
          </p>
          <div className="pf-foto-acoes">
            <label className="pf-link">
              <input
                ref={arquivoRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="so-leitor"
                onChange={(e) => void trocarFoto(e.target.files?.[0])}
                disabled={enviando}
              />
              {enviando ? 'Enviando…' : perfil.temFoto ? 'Trocar foto' : 'Pôr uma foto'}
            </label>
            {perfil.temFoto && (
              <button type="button" className="pf-link" onClick={() => void tirarFoto()}>
                Tirar foto
              </button>
            )}
          </div>
          {aviso && (
            <p className="pf-erro" role="alert">
              {aviso}
            </p>
          )}
        </div>
        <NivelEXp nivel={nivel} />
      </div>
    </header>
  );
}

function NivelEXp({ nivel }: { nivel: ReturnType<typeof nivelDe> }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="pf-nivel">
      <div className="pf-nivel-linha">
        <EmblemaDeNivel nivel={nivel} tamanho={144} />
        <BarraDeXp nivel={nivel} />
      </div>
      <button type="button" className="pf-link pf-nivel-como" aria-expanded={aberto} onClick={() => setAberto((v) => !v)}>
        Como o XP funciona
      </button>
      {aberto && (
        <div className="pf-nivel-regras">
          <ul>
            {REGRAS_DE_XP.map((r) => (
              <li key={r.rotulo}>
                <span>{r.rotulo}</span>
                <span className="v-dado">+{r.xp} XP</span>
              </li>
            ))}
          </ul>
          <p>
            Repetir não rende: cada aula, exercício e instrumento vale uma vez. O XP mede atividade registrada, não o quanto
            você sabe.
          </p>
        </div>
      )}
    </div>
  );
}

// ── números ─────────────────────────────────────────────────────────────
//
// Inspirado no painel de estatísticas do Duolingo e afins: sequência com a
// semana, XP da semana em barras com a semana anterior, e uma grade de
// números da conta (aulas, módulos, exercícios, instrumentos, dias,
// medalhas, melhor dia, turno). Tudo sai do registro; nada é estimado.

function Numeros({
  progresso,
  perfil,
  concluidas,
  medalhas,
}: {
  progresso: MyProgress;
  perfil: PerfilDaConta;
  concluidas: Set<string>;
  medalhas: MedalhaNaTela[];
}) {
  const conta = (t: string) => perfil.primeiras.filter((p) => p.tipo === t).length;
  const s = progresso.streak;
  const atual = !s.semRegistro && s.atual != null ? s.atual : 0;
  const maior = !s.semRegistro && s.maior != null ? s.maior : 0;
  const hoje = hojeNoFuso(perfil.fuso);
  const diasFeitos = useMemo(() => new Set(perfil.dias.filter((d) => d.eventos > 0).map((d) => d.dia)), [perfil.dias]);
  const porDia = useMemo(() => xpPorDia(perfil.primeiras, perfil.dias, perfil.fuso), [perfil.primeiras, perfil.dias, perfil.fuso]);
  const semana = semanaDeXp(porDia, hoje);
  const melhor = melhorDia(porDia);
  const turno = turnoPreferido(perfil.primeiras, perfil.fuso);
  const pct = Math.round((concluidas.size / TOTAL_AULAS) * 100);
  const modsFeitos = indice.modulos.filter((m) => estadoDoModulo(m, concluidas).estado === 'concluido').length;
  const obtidas = medalhas.filter((m) => m.obtida).length;

  return (
    <section className="pf-secao" aria-labelledby="pf-numeros">
      <h2 id="pf-numeros" className="pf-titulo">
        Em números
      </h2>
      <div className="pf-numeros-topo">
        <PlacaDeSequencia atual={atual} maior={maior} dias={diasFeitos} hoje={hoje} />
        <div className="jg-placa jg-placa-grafico" style={{ ['--i' as string]: 1 }}>
          <GraficoDaSemana dias={semana.dias} total={semana.total} anterior={semana.anterior} />
        </div>
      </div>
      <div className="jg-placas jg-placas-4">
        <Placa
          i={2}
          gravura="livro"
          valor={concluidas.size}
          nota={`/ ${TOTAL_AULAS}`}
          rotulo="aulas concluídas"
          extra={
            <AnelDeProgresso fracao={concluidas.size / TOTAL_AULAS} tamanho={44}>
              {pct}%
            </AnelDeProgresso>
          }
        />
        <Placa i={3} gravura="torres" valor={modsFeitos} nota={`/ ${indice.modulos.length}`} rotulo="módulos concluídos" />
        <Placa i={4} gravura="exercicio" valor={conta('exercicio_respondido')} rotulo="exercícios respondidos" />
        <Placa i={5} gravura="instrumento" valor={conta('instrumento_usado')} rotulo="instrumentos usados" />
        <Placa i={6} gravura="calendario" valor={perfil.dias.length} rotulo="dias com estudo" nota={`em ${perfil.janelaDias}`} />
        <Placa i={7} gravura="medalhas" valor={obtidas} nota={`/ ${medalhas.length}`} rotulo="medalhas conquistadas" />
        {melhor && (
          <Placa i={8} gravura="termometro" valor={melhor.xp} nota="XP" rotulo={`seu melhor dia · ${dataCurta(melhor.dia)}`} />
        )}
        {turno && (
          <Placa
            i={9}
            gravura="relogio"
            valorTexto={turno.turno}
            rotulo={`é quando você mais estuda · ${Math.round(turno.parte * 100)}% das atividades`}
          />
        )}
      </div>
    </section>
  );
}

// ── calendário ──────────────────────────────────────────────────────────

function hojeNoFuso(fuso: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: fuso, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function Calendario({ perfil }: { perfil: PerfilDaConta }) {
  const hoje = hojeNoFuso(perfil.fuso);
  const colunas = calendario(perfil.dias, hoje, 26);
  const meses: { indice: number; rotulo: string }[] = [];
  // Rótulo na semana que contém o dia 1 de cada mês; nunca dois rótulos a
  // menos de três semanas um do outro.
  colunas.forEach((col, i) => {
    const primeiroDoMes = col.find((c) => c.dia.endsWith('-01'));
    if (!primeiroDoMes) return;
    if (meses.length && i - meses[meses.length - 1].indice < 3) return;
    const r = new Date(`${primeiroDoMes.dia}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    meses.push({ indice: i, rotulo: r });
  });
  return (
    <section className="pf-secao" aria-labelledby="pf-cal">
      <h2 id="pf-cal" className="pf-titulo">
        Dias de estudo
      </h2>
      <p className="pf-sub">As últimas 26 semanas. Cada quadrado é um dia; quanto mais forte o tom, mais atividade registrada.</p>
      <div
        className="pf-cal-rolagem"
        ref={(el) => {
          // Em tela estreita a grade rola: abre na semana de hoje, não na mais antiga.
          if (el) el.scrollLeft = el.scrollWidth;
        }}
      >
        <div className="pf-cal" style={{ ['--semanas' as string]: colunas.length }}>
          <div className="pf-cal-meses v-dado" aria-hidden="true">
            {meses.map((m) => (
              <span key={m.rotulo} style={{ gridColumn: m.indice + 1 }}>
                {m.rotulo}
              </span>
            ))}
          </div>
          <div className="pf-cal-grade" role="img" aria-label={`${perfil.dias.length} dias com estudo registrados na janela`}>
            {colunas.map((col, i) => (
              <div key={i} className="pf-cal-semana">
                {col.map((c) => (
                  <span
                    key={c.dia}
                    className="pf-cal-dia"
                    data-tom={c.tom}
                    data-futuro={c.futuro || undefined}
                    title={c.futuro ? undefined : `${dataCurta(c.dia)}: ${c.eventos ? plural(c.eventos, 'registro', 'registros') : 'sem estudo'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="pf-cal-legenda v-dado" aria-hidden="true">
        menos
        {[0, 1, 2, 3, 4].map((t) => (
          <span key={t} className="pf-cal-dia" data-tom={t} />
        ))}
        mais
      </p>
    </section>
  );
}

// ── progresso por trilha e módulo ───────────────────────────────────────

const CAPA_DA_TRILHA: Record<string, string> = { I: 'trilha-I', II: 'trilha-II', III: 'trilha-III' };

function ProgressoPorTrilha({ concluidas }: { concluidas: Set<string> }) {
  return (
    <section className="pf-secao" aria-labelledby="pf-trilhas">
      <h2 id="pf-trilhas" className="pf-titulo">
        Trilhas e módulos
      </h2>
      <p className="pf-sub">Cada estação é um módulo. Cheia com visto: concluído. Com arco de ouro: o quanto já foi feito.</p>
      <div className="pf-trilhas">
        {indice.trilhas.map((t) => {
          const mods = indice.modulos.filter((m) => m.trilhaId === t.id);
          const total = mods.reduce((s, m) => s + m.aulas.length, 0);
          const feitas = mods.reduce((s, m) => s + m.aulas.filter((a) => concluidas.has(idDaAula(m, a.numero))).length, 0);
          const modsFeitos = mods.filter((m) => estadoDoModulo(m, concluidas).estado === 'concluido').length;
          const atual = mods.find((m) => estadoDoModulo(m, concluidas).estado === 'andamento')?.id ?? null;
          const capa = CAPA_DA_TRILHA[t.romano];
          const completa = total > 0 && feitas === total;
          return (
            <article key={t.id} className="pf-trilha" data-completa={completa || undefined}>
              <header className="pf-trilha-cabeca">
                {capa && (
                  <span className="pf-trilha-capa">
                    <img src={`/alexandria/v3/trilhas/${capa}-800.webp`} alt="" loading="lazy" />
                    <span className="pf-trilha-romano">{t.romano}</span>
                  </span>
                )}
                <div className="pf-trilha-texto">
                  <p className="v-dado">Trilha {t.romano}</p>
                  <h3 className="pf-trilha-nome">{t.nome}</h3>
                  <p className="pf-trilha-conta">
                    <strong>{feitas}</strong> de {total} aulas · <strong>{modsFeitos}</strong> de {mods.length} módulos
                    {completa && <span className="jg-pilula pf-trilha-selo">trilha concluída</span>}
                  </p>
                </div>
                <AnelDeProgresso fracao={total ? feitas / total : 0} tamanho={68}>
                  {total ? Math.round((feitas / total) * 100) : 0}%
                </AnelDeProgresso>
              </header>
              <LinhaDaTrilha modulos={mods} concluidas={concluidas} atual={atual} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ── medalhas ────────────────────────────────────────────────────────────

function Medalhas({ lista }: { lista: MedalhaNaTela[] }) {
  const [todas, setTodas] = useState(false);
  const obtidas = obtidasPorData(lista);
  const recente = obtidas.find((m) => m.data)?.id ?? null;
  const faltam = lista.filter((m) => !m.obtida);
  const faltamVisiveis = todas ? faltam : faltam.slice(0, 8);

  return (
    <section className="pf-secao" aria-labelledby="pf-medalhas">
      <h2 id="pf-medalhas" className="pf-titulo">
        Medalhas
        <span className="v-dado pf-titulo-conta">
          {obtidas.length} de {lista.length}
        </span>
      </h2>
      <p className="pf-sub">Cada medalha registra algo que você fez, com data. Nenhuma mede o quanto você sabe.</p>
      {obtidas.length > 0 && (
        <ul className="pf-medalhas">
          {obtidas.map((m) => (
            <CartaoDeMedalha key={m.id} m={m} recente={m.id === recente} />
          ))}
        </ul>
      )}
      {faltam.length > 0 && (
        <>
          <p className="v-dado pf-medalhas-rotulo">Ainda por fazer</p>
          <ul className="pf-medalhas">
            {faltamVisiveis.map((m) => (
              <CartaoDeMedalha key={m.id} m={m} recente={false} />
            ))}
          </ul>
          {faltam.length > 8 && (
            <button type="button" className="pf-link" onClick={() => setTodas((v) => !v)} aria-expanded={todas}>
              {todas ? 'Mostrar menos' : `Ver as ${faltam.length} por fazer`}
            </button>
          )}
        </>
      )}
    </section>
  );
}

function CartaoDeMedalha({ m, recente }: { m: MedalhaNaTela; recente: boolean }) {
  return (
    <li className="pf-medalha" data-obtida={m.obtida || undefined}>
      <Medalha familia={m.familia} motivo={m.motivo} obtida={m.obtida} recente={recente} />
      <div>
        <p className="v-dado pf-medalha-familia">{ROTULO_FAMILIA[m.familia]}</p>
        <p className="pf-medalha-nome">{m.nome}</p>
        <p className="pf-medalha-crit">{m.criterio}</p>
        <p className="v-dado pf-medalha-data">
          {m.obtida ? (m.data ? dataLonga(m.data) : 'obtida') : m.falta ?? 'ainda não'}
        </p>
      </div>
    </li>
  );
}


// ── histórico ───────────────────────────────────────────────────────────

function Historico({ perfil }: { perfil: PerfilDaConta }) {
  const dias = historico(perfil.primeiras, perfil.fuso, 30);
  if (dias.length === 0) {
    return (
      <section className="pf-secao" aria-labelledby="pf-hist">
        <h2 id="pf-hist" className="pf-titulo">
          Histórico
        </h2>
        <p className="pf-sub">
          Nada registrado ainda. O histórico começa na primeira aula que você abrir —{' '}
          <Link to="/alexandria/trilhas" className="pf-link">
            ver as trilhas
          </Link>
          .
        </p>
      </section>
    );
  }
  return (
    <section className="pf-secao" aria-labelledby="pf-hist">
      <h2 id="pf-hist" className="pf-titulo">
        Histórico
      </h2>
      <p className="pf-sub">Os últimos {dias.length === 1 ? 'dia' : `${dias.length} dias`} com estudo. Só a primeira vez de cada coisa aparece.</p>
      <ol className="pf-hist">
        {dias.map((d) => {
          const linhas: ReactNode[] = [];
          for (const id of d.aulasConcluidas) {
            const a = moduloDaAula(id);
            const titulo = a ? a.modulo.aulas.find((x) => x.numero === a.numero)?.titulo : null;
            linhas.push(
              <li key={`c-${id}`}>
                Concluiu{' '}
                {a ? (
                  <Link to={rotaDaAula(a.modulo, a.numero)} className="pf-link">
                    {a.modulo.codigo} · Aula {String(a.numero).padStart(2, '0')}
                    {titulo ? ` — ${titulo}` : ''}
                  </Link>
                ) : (
                  id
                )}
              </li>,
            );
          }
          const abertas = d.aulasIniciadas.filter((id) => !d.aulasConcluidas.includes(id));
          if (abertas.length) linhas.push(<li key="i">Abriu {plural(abertas.length, 'aula nova', 'aulas novas')}</li>);
          if (d.exercicios) linhas.push(<li key="e">Respondeu {plural(d.exercicios, 'exercício novo', 'exercícios novos')}</li>);
          if (d.instrumentos) linhas.push(<li key="n">Usou {plural(d.instrumentos, 'instrumento novo', 'instrumentos novos')}</li>);
          return (
            <li key={d.dia} className="pf-hist-dia">
              <p className="pf-hist-data">
                <span>{dataLonga(d.dia)}</span>
                <span className="v-dado">+{d.xp} XP</span>
              </p>
              <ul className="pf-hist-itens">{linhas}</ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default PerfilV3;
