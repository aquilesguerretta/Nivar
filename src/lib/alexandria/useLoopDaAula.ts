// useLoopDaAula.ts — a mecânica de registro de UMA aula.
//
// Sem JSX e sem decisão de aparência: o hook devolve estado e funções, e
// quem desenha (o viewer legado, o tronco das aulas de arquétipo, a tela
// nova da v3) só liga duas refs e chama as funções. Regras puras em
// `./progresso/regras.ts`, testadas em `tests/alexandria-progresso/`.
//
// O CICLO, EM QUATRO EVENTOS DO BACKEND:
//
//   aula_iniciada ........ no primeiro GESTO do aluno na aula (`refRaiz`),
//                          nunca na montagem da rota. Ver `ehGestoDeInicio`.
//   instrumento_usado .... por ajuste ASSENTADO de controle (agrupado), ou
//                          por pedido de correção. Sempre com `aulaId`.
//   exercicio_respondido . por resposta registrada. Sempre com `aulaId`.
//   aula_concluida ....... só com a pré-condição de `vereditoDeConclusao`:
//                          conta + gesto + fim do texto visto (`refFim`).
//                          Depois dela, a família CONCLUSÃO é avaliada.
//
// SEM CONTA, NADA SAI E NADA FICA. O hook lê a sessão de `AuthContext`; em
// `visitante` nenhuma requisição de escrita é aberta e nenhum estado vai
// para storage. O ato continua funcionando na página — é o registro que
// exige conta (bar C9).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuthOpcional } from '@/lib/auth/AuthContext';
import { getAulaStatus, recordEvent } from '@/lib/progress/progressApi';
import { registrarConquistasDeConclusao, type ConquistaRegistrada } from '@/lib/progress/badgeRules';
import { emitirPratica, type ResultadoDeEmissao } from './emitirPratica';
import {
  criarAgrupador,
  ehGestoDeInicio,
  fimPassouPelaTela,
  vereditoDeConclusao,
  type EstadoDaConta,
  type GeneroDoAto,
  type GestoObservado,
  type RelacaoComAula,
  type StatusDaAula,
  type ValorDeControle,
  type VereditoDeConclusao,
} from './progresso/regras';

export type { EstadoDaConta, StatusDaAula, VereditoDeConclusao } from './progresso/regras';
export type { ConquistaRegistrada } from '@/lib/progress/badgeRules';

/** Espera para um controle de instrumento "assentar" antes de virar um
 *  `instrumento_usado`. Parâmetro de engenharia (não pedagógico): longo o
 *  bastante para um arrasto de régua virar UM evento. */
export const ESPERA_DE_AJUSTE_MS = 1200;

/** Sessão como o registro a enxerga. Sem `AuthProvider` acima (harness,
 *  teste), é visitante — nunca envia. */
export function useEstadoDaConta(): EstadoDaConta {
  const auth = useAuthOpcional();
  if (!auth) return 'visitante';
  if (auth.loading) return 'carregando';
  return auth.user ? 'conta' : 'visitante';
}

export type EstadoDoEnvio = 'parado' | 'enviando' | 'registrado' | 'falhou';

export interface OpcoesDoLoop {
  aulaId: string;
  moduloId?: string | null;
  /** Emite `aula_concluida` sozinho quando a pré-condição fecha. Para aulas
   *  cujo fim é o próprio registro (tronco, bar C9); o viewer legado mantém
   *  o gesto explícito do botão e deixa isto `false`. */
  concluirAoChegarAoFim?: boolean;
}

export interface UsoDeInstrumento {
  modo: 'ajuste' | 'correcao';
  valores?: Record<string, ValorDeControle | undefined>;
}

export interface RespostaDeExercicio {
  /** Id do exercício na fonte (`ex-06`) ou do ato (`idDoAto(aulaId, 'meta')`). */
  entidadeId: string;
  ato: GeneroDoAto;
  resposta?: string | null;
  antesDaReferencia: boolean;
}

export type ResultadoDeConclusao =
  | { registrada: true; conquistas: ConquistaRegistrada[] }
  | { registrada: false; veredito: VereditoDeConclusao }
  | { registrada: false; falhou: true };

export interface LoopDaAulaMecanico {
  aulaId: string;
  conta: EstadoDaConta;
  /** Um gesto de início foi observado nesta montagem. */
  iniciou: boolean;
  /** Envio de `aula_iniciada`. Visitante fica em `parado` para sempre. */
  inicio: EstadoDoEnvio;
  chegouAoFim: boolean;
  /** Status CONFIRMADO pelo servidor (`GET /aulas/{id}` ou resposta de
   *  evento). `null` = desconhecido; nunca se afirma "percorrida" sem ele. */
  status: StatusDaAula;
  conclusao: VereditoDeConclusao;
  envioDaConclusao: EstadoDoEnvio;
  /** Conquistas registradas AGORA pela conclusão desta aula. */
  conquistasNovas: ConquistaRegistrada[];
  /** Eventos de prática confirmados pelo servidor nesta montagem. */
  praticasRegistradas: number;

  /** Ref da raiz da aula: onde o gesto de início é observado. */
  refRaiz: (el: HTMLElement | null) => void;
  /** Ref de um marcador logo depois do fim do TEXTO da aula. */
  refFim: (el: HTMLElement | null) => void;

  /** Início explícito (ex.: o aluno registrou um ato). Idempotente. */
  iniciar: () => void;
  concluir: () => Promise<ResultadoDeConclusao>;
  /** `exercicio_respondido`, com `aulaId` e `moduloId` desta aula. */
  emitirExercicio: (r: RespostaDeExercicio) => Promise<ResultadoDeEmissao>;
  /** `instrumento_usado`. `ajuste` é agrupado até assentar; `correcao`
   *  sai na hora. */
  usarInstrumento: (instrumentoId: string, uso: UsoDeInstrumento) => void;
}

function relacao(raiz: HTMLElement, alvo: EventTarget | null): RelacaoComAula {
  if (!(alvo instanceof Node)) return 'fora';
  if (raiz.contains(alvo)) return 'dentro';
  if (alvo.contains(raiz)) return 'ancestral';
  return 'fora';
}

export function useLoopDaAula({ aulaId, moduloId = null, concluirAoChegarAoFim = false }: OpcoesDoLoop): LoopDaAulaMecanico {
  const conta = useEstadoDaConta();

  const [raiz, setRaiz] = useState<HTMLElement | null>(null);
  const [fim, setFim] = useState<HTMLElement | null>(null);
  const [iniciou, setIniciou] = useState(false);
  const [inicio, setInicio] = useState<EstadoDoEnvio>('parado');
  const [chegouAoFim, setChegouAoFim] = useState(false);
  const [status, setStatus] = useState<StatusDaAula>(null);
  const [envioDaConclusao, setEnvioDaConclusao] = useState<EstadoDoEnvio>('parado');
  const [conquistasNovas, setConquistasNovas] = useState<ConquistaRegistrada[]>([]);
  const [praticasRegistradas, setPraticas] = useState(0);

  // Troca de aula sem desmontar (o viewer legado é reaproveitado entre
  // aulas): tudo volta ao zero. Quem pode, monta com `key={aulaId}`.
  const iniciouRef = useRef(false);
  const inicioPromessa = useRef<Promise<unknown> | null>(null);
  const tentouAuto = useRef(false);
  const vivo = useRef(true);
  useEffect(() => {
    vivo.current = true;
    iniciouRef.current = false;
    inicioPromessa.current = null;
    tentouAuto.current = false;
    setIniciou(false);
    setInicio('parado');
    setChegouAoFim(false);
    setStatus(null);
    setEnvioDaConclusao('parado');
    setConquistasNovas([]);
    setPraticas(0);
    return () => {
      vivo.current = false;
    };
  }, [aulaId]);

  // Status já registrado (leitura, não escrita): uma aula percorrida em
  // outra sessão continua percorrida. 404 = nunca registrada → `null`.
  useEffect(() => {
    if (conta !== 'conta') return;
    const ctrl = new AbortController();
    getAulaStatus(aulaId, ctrl.signal)
      .then((s) => {
        if (!ctrl.signal.aborted) setStatus((atual) => atual ?? s?.status ?? null);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[alexandria] falha ao ler o status da aula', aulaId, err);
      });
    return () => ctrl.abort();
  }, [aulaId, conta]);

  const iniciar = useCallback(() => {
    if (iniciouRef.current) return;
    iniciouRef.current = true;
    setIniciou(true);
  }, []);

  // `aula_iniciada` sai quando há gesto E conta. Se o gesto veio antes de a
  // sessão responder, sai quando ela responder.
  useEffect(() => {
    if (!iniciou || conta !== 'conta' || inicio !== 'parado') return;
    setInicio('enviando');
    const p = recordEvent('aula_iniciada', aulaId, moduloId ? { moduloId } : undefined)
      .then((r) => {
        if (!vivo.current) return;
        setInicio('registrado');
        if (r.aulaStatus) setStatus(r.aulaStatus.status);
      })
      .catch((err: unknown) => {
        if (vivo.current) setInicio('falhou');
        console.error('[alexandria] falha ao registrar aula_iniciada', err);
      });
    inicioPromessa.current = p;
  }, [iniciou, conta, inicio, aulaId, moduloId]);

  // O gesto de início, ouvido no documento (fase de captura) e filtrado
  // pela relação com a raiz. Sai do ar no primeiro gesto válido.
  useEffect(() => {
    if (!raiz || iniciou) return;
    const tipos: GestoObservado['tipo'][] = ['pointerdown', 'keydown', 'input', 'wheel', 'touchmove'];
    const ouvir = (e: Event) => {
      const gesto: GestoObservado = {
        tipo: e.type as GestoObservado['tipo'],
        relacao: relacao(raiz, e.target),
        tecla: e instanceof KeyboardEvent ? e.key : undefined,
        confiavel: e.isTrusted,
      };
      if (ehGestoDeInicio(gesto)) iniciar();
    };
    for (const t of tipos) document.addEventListener(t, ouvir, { capture: true, passive: true });
    return () => {
      for (const t of tipos) document.removeEventListener(t, ouvir, { capture: true });
    };
  }, [raiz, iniciou, iniciar]);

  // O fim do texto. Trava em `true`: passou pela tela, conta. Por POSIÇÃO,
  // a cada rolagem de qualquer contêiner (fase de captura) e na montagem —
  // ver `fimPassouPelaTela` para o porquê de não ser IntersectionObserver.
  useEffect(() => {
    if (!fim || chegouAoFim) return;
    let quadro = 0;
    const medir = () => {
      quadro = 0;
      if (fimPassouPelaTela(fim.getBoundingClientRect().top, window.innerHeight)) setChegouAoFim(true);
    };
    const agendar = () => {
      if (!quadro) quadro = window.requestAnimationFrame(medir);
    };
    medir();
    document.addEventListener('scroll', agendar, { capture: true, passive: true });
    window.addEventListener('resize', agendar, { passive: true });
    return () => {
      if (quadro) window.cancelAnimationFrame(quadro);
      document.removeEventListener('scroll', agendar, { capture: true });
      window.removeEventListener('resize', agendar);
    };
  }, [fim, chegouAoFim]);

  const conclusao = useMemo(
    () => vereditoDeConclusao({ conta, iniciou, chegouAoFim, status }),
    [conta, iniciou, chegouAoFim, status],
  );

  const concluindo = useRef(false);
  const concluir = useCallback(async (): Promise<ResultadoDeConclusao> => {
    if (!conclusao.pode) return { registrada: false, veredito: conclusao };
    if (concluindo.current) return { registrada: false, veredito: conclusao };
    concluindo.current = true;
    setEnvioDaConclusao('enviando');
    try {
      // A ordem do log acompanha a ordem do aluno: o início, se estiver em
      // voo, chega antes da conclusão.
      await inicioPromessa.current?.catch(() => undefined);
      const r = await recordEvent('aula_concluida', aulaId, {
        ...(moduloId ? { moduloId } : {}),
        regra: 'gesto+fim-do-texto',
      });
      if (!vivo.current) return { registrada: true, conquistas: [] };
      setStatus(r.aulaStatus?.status ?? 'concluido');
      setEnvioDaConclusao('registrado');
      const conquistas = await registrarConquistasDeConclusao(aulaId);
      if (vivo.current && conquistas.length) setConquistasNovas(conquistas);
      return { registrada: true, conquistas };
    } catch (err) {
      console.error('[alexandria] falha ao registrar aula_concluida', err);
      if (vivo.current) setEnvioDaConclusao('falhou');
      return { registrada: false, falhou: true };
    } finally {
      concluindo.current = false;
    }
  }, [conclusao, aulaId, moduloId]);

  useEffect(() => {
    if (!concluirAoChegarAoFim || !conclusao.pode || tentouAuto.current) return;
    tentouAuto.current = true;
    void concluir();
  }, [concluirAoChegarAoFim, conclusao, concluir]);

  // A conta corrente, lida por callbacks estáveis sem recriá-los.
  const contaRef = useRef(conta);
  contaRef.current = conta;

  const contar = useCallback((r: ResultadoDeEmissao) => {
    if (r.enviado && vivo.current) setPraticas((n) => n + 1);
    return r;
  }, []);

  const emitirExercicio = useCallback(
    async (r: RespostaDeExercicio) => {
      iniciar();
      return contar(
        await emitirPratica(
          { tipo: 'exercicio_respondido', aulaId, moduloId, ...r },
          { conta: contaRef.current },
        ),
      );
    },
    [aulaId, moduloId, iniciar, contar],
  );

  const enviarUso = useCallback(
    (instrumentoId: string, uso: UsoDeInstrumento) => {
      void emitirPratica(
        { tipo: 'instrumento_usado', entidadeId: instrumentoId, aulaId, moduloId, ...uso },
        { conta: contaRef.current },
      ).then(contar);
    },
    [aulaId, moduloId, contar],
  );

  // Um agrupador por montagem de aula; descarrega o pendente ao sair.
  const agrupador = useMemo(
    () =>
      criarAgrupador<UsoDeInstrumento>(ESPERA_DE_AJUSTE_MS, enviarUso, {
        setTimeout: (fn, ms) => window.setTimeout(fn, ms),
        clearTimeout: (id) => window.clearTimeout(id as number),
      }),
    [enviarUso],
  );
  useEffect(() => () => agrupador.descarregar(), [agrupador]);

  const usarInstrumento = useCallback(
    (instrumentoId: string, uso: UsoDeInstrumento) => {
      iniciar();
      if (uso.modo === 'correcao') enviarUso(instrumentoId, uso);
      else agrupador.empurrar(instrumentoId, uso);
    },
    [iniciar, enviarUso, agrupador],
  );

  return {
    aulaId,
    conta,
    iniciou,
    inicio,
    chegouAoFim,
    status,
    conclusao,
    envioDaConclusao,
    conquistasNovas,
    praticasRegistradas,
    refRaiz: setRaiz,
    refFim: setFim,
    iniciar,
    concluir,
    emitirExercicio,
    usarInstrumento,
  };
}
