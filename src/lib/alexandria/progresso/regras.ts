// regras.ts — a lógica PURA do registro de progresso da Alexandria.
//
// Sem React, sem `fetch`, sem alias `@/`, sem global do Vite: este arquivo
// roda igual no navegador e no `node --test` (`tests/alexandria-progresso/`).
// Os hooks (`useLoopDaAula`, `useSequencia`) e o emissor (`emitirPratica`)
// só ligam estas decisões ao DOM e à rede.
//
// O CONTRATO QUE ISTO GUARDA (`docs/alexandria-v2/bar.md`):
//   S3  — percorrido ≠ praticado ≠ demonstrado. Nenhuma função daqui junta
//         dois eixos num número, e nenhuma frase daqui alega competência.
//   C9  — a aula termina em registro; "Percorrida" exige pré-condição.
//   Founder — progresso fica atrás do cadastro: sem conta, nada é enviado
//         e nada é guardado (nem em `localStorage`).

// ── Conta ────────────────────────────────────────────────────

/** Estado da sessão como o registro o enxerga. `carregando` não é
 *  visitante: enquanto a sessão não respondeu, nada é enviado, mas também
 *  nada é dito ao aluno como se ele estivesse deslogado. */
export type EstadoDaConta = 'carregando' | 'visitante' | 'conta';

// ── 1 · Início da aula: o gesto, não a rota ───────────────────

/** Onde o evento aconteceu em relação à raiz da aula. `ancestral` é o
 *  contêiner que ROLA a aula (o `<main>` do shell, a barra de rolagem
 *  dele, o `<body>` com o foco) — rolar a aula por ali é começar a lê-la. */
export type RelacaoComAula = 'dentro' | 'ancestral' | 'fora';

export interface GestoObservado {
  tipo: 'pointerdown' | 'keydown' | 'input' | 'wheel' | 'touchmove';
  relacao: RelacaoComAula;
  /** `KeyboardEvent.key`, quando `tipo === 'keydown'`. */
  tecla?: string;
  /** `Event.isTrusted`. Evento sintético de script nunca inicia aula. */
  confiavel: boolean;
}

/** Teclas que ROLAM a página. São as únicas que contam fora da aula (no
 *  `<body>`), porque Tab, Esc e atalhos movem foco ou chrome, não leitura. */
export const TECLAS_DE_ROLAGEM: readonly string[] = [
  'PageDown',
  'PageUp',
  'ArrowDown',
  'ArrowUp',
  ' ',
  'Spacebar',
  'End',
  'Home',
];

const TECLAS_SEM_GESTO: readonly string[] = ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape', 'CapsLock'];

/**
 * A aula começa quando o aluno FAZ alguma coisa nela — não quando a rota
 * monta. Até esta wave, `AulaViewer` disparava `aula_iniciada` no
 * `useEffect` de montagem: "percorrido" significava "a URL foi aberta",
 * inclusive por pré-carregamento, por voltar no histórico ou por um clique
 * errado no índice.
 *
 * Conta como começar:
 *   - clicar/tocar, rolar com roda ou dedo DENTRO da aula ou no contêiner
 *     que a rola (inclui arrastar a barra de rolagem);
 *   - digitar dentro da aula (campo de exercício, controle de instrumento);
 *   - tecla de rolagem com o foco no documento.
 *
 * Não conta: `scrollTo` programático (o router zera a rolagem a cada
 * navegação — por isso o evento `scroll` não é ouvido), foco por Tab, e
 * qualquer evento sintético (`isTrusted === false`).
 */
export function ehGestoDeInicio(g: GestoObservado): boolean {
  if (!g.confiavel) return false;
  if (g.relacao === 'fora') return false;
  switch (g.tipo) {
    case 'pointerdown':
    case 'wheel':
    case 'touchmove':
      return true;
    case 'input':
      return g.relacao === 'dentro';
    case 'keydown': {
      const tecla = g.tecla ?? '';
      if (TECLAS_DE_ROLAGEM.includes(tecla)) return true;
      return g.relacao === 'dentro' && tecla !== '' && !TECLAS_SEM_GESTO.includes(tecla);
    }
  }
}

// ── 2 · Conclusão (Percorrida): a regra mínima honesta ────────

export type StatusDaAula = 'em_andamento' | 'concluido' | null;

export interface SinaisDeConclusao {
  conta: EstadoDaConta;
  /** Um gesto de início foi observado nesta montagem da aula. */
  iniciou: boolean;
  /** O fim do TEXTO da aula passou pela viewport nesta montagem. */
  chegouAoFim: boolean;
  /** Status confirmado pelo servidor, quando conhecido. */
  status: StatusDaAula;
}

export type FaltaParaConcluir = 'verificando-conta' | 'conta' | 'ja-registrada' | 'fim-do-texto' | 'inicio';

export type VereditoDeConclusao =
  | { pode: true }
  | { pode: false; falta: FaltaParaConcluir; frase: string };

/** Frases do que falta, na voz da casa. Nunca "concluída": a aula é
 *  PERCORRIDA (bar C9, P18). */
export const FRASES_DE_CONCLUSAO: Record<FaltaParaConcluir, string> = {
  'verificando-conta': 'Verificando a sua conta antes de registrar.',
  conta: 'Registrar a aula exige entrar na sua conta. Sem conta, nada é enviado nem guardado.',
  'ja-registrada': 'Esta aula já está registrada como percorrida.',
  'fim-do-texto': 'O registro abre quando o fim do texto da aula tiver passado pela tela.',
  inicio: 'O registro abre depois que você começar a aula: role, toque ou responda algo nela.',
};

/**
 * A REGRA DE CONCLUSÃO ESCOLHIDA — e por que ela, e não outra.
 *
 *   `aula_concluida` só sai com CONTA, depois de um GESTO DE INÍCIO nesta
 *   montagem, e depois de o FIM DO TEXTO da aula ter passado pela tela.
 *
 * O eixo é Percorrido (bar S3: "consumo ou navegação registrada"). A regra
 * mede exatamente isso: o aluno abriu a aula, agiu nela e o texto inteiro
 * passou pela viewport. Ela NÃO afirma leitura atenta, compreensão nem
 * tempo de leitura — e por isso não inventa limiar de segundos, que não
 * tem fonte.
 *
 * Por que ato registrado NÃO substitui o fim do texto: ato é evidência do
 * eixo Praticado e já é registrado como tal (`exercicio_respondido`,
 * `instrumento_usado`). Concluir a aula por causa de um ato na abertura
 * (o Ato 1 da M01·A08 fica no topo) seria dizer "percorrida" de uma aula
 * cujo texto não passou pela tela — misturar os eixos que S3 separa. Em
 * toda aula medida, os atos ficam antes do fim do texto ou logo depois
 * dele, então exigir o fim não custa nada a quem pratica.
 *
 * Por que o gesto é exigido além do fim: em aula curta, ou numa tela alta,
 * o fim do texto pode estar visível na montagem. Sem gesto, abrir a rota
 * voltaria a ser registro — o defeito que esta regra corrige.
 */
export function vereditoDeConclusao(s: SinaisDeConclusao): VereditoDeConclusao {
  const nao = (falta: FaltaParaConcluir): VereditoDeConclusao => ({
    pode: false,
    falta,
    frase: FRASES_DE_CONCLUSAO[falta],
  });
  if (s.conta === 'carregando') return nao('verificando-conta');
  if (s.conta === 'visitante') return nao('conta');
  if (s.status === 'concluido') return nao('ja-registrada');
  if (!s.chegouAoFim) return nao('fim-do-texto');
  if (!s.iniciou) return nao('inicio');
  return { pode: true };
}

/**
 * "O fim do texto passou pela tela": o topo do marcador de fim está na
 * viewport OU acima dela. Medido por POSIÇÃO e não por interseção, porque
 * um salto de rolagem (tecla End, clique que rola até um botão lá embaixo)
 * atravessa o marcador sem ele ficar visível em frame nenhum — e o
 * `IntersectionObserver` não dispara para quem pulou por cima. Quem está
 * abaixo do fim do texto já passou por ele.
 *
 * `alturaDaJanela` 0 (painel oculto, aba sem layout) nunca conta.
 */
export function fimPassouPelaTela(topoDoFim: number, alturaDaJanela: number): boolean {
  if (!(alturaDaJanela > 0) || !Number.isFinite(topoDoFim)) return false;
  return topoDoFim <= alturaDaJanela;
}

// ── 3 · A sequência de dias: duas ausências diferentes ────────

/** O subconjunto de `StreakInfo` que a frase lê. Declarado aqui (e não
 *  importado de `progressApi.ts`) para este arquivo seguir puro. */
export interface SequenciaParaFrase {
  atual: number | null;
  maior: number | null;
  ultimoDiaAtivo: string | null;
  maiorAte: string | null;
  diaDeReferencia: string;
  semRegistro: boolean;
}

export interface FraseDaSequencia {
  /** `nunca` = nenhum dia de estudo no log; `parada` = estudou e a corrida
   *  quebrou; `viva` = corrida em curso. Três estados, três frases. */
  caso: 'nunca' | 'parada' | 'viva';
  principal: string;
  /** Linha de contexto (último dia, "sem registro hoje ainda"), ou null. */
  detalhe: string | null;
  /** A mais longa, quando ela é maior que a atual. */
  recorde: string | null;
}

const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

/** `2026-09-12` → `12 set. 2026`. Determinística (sem `toLocaleDateString`,
 *  cujo resultado varia com o ICU de quem roda). Entrada fora do formato
 *  volta como veio — dado ruim se mostra, não se maquia. */
export function formatarDia(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const mes = MESES[Number(m[2]) - 1];
  if (!mes) return iso;
  return `${Number(m[3])} ${mes} ${m[1]}`;
}

const dias = (n: number) => (n === 1 ? '1 dia' : `${n} dias`);

/**
 * A frase da sequência. Motivação, nunca evidência (bar S3): fala de "dia
 * com estudo registrado", nunca de aprender, saber ou dominar.
 *
 * `semRegistro: true` e `atual: 0` são FRASES DIFERENTES. O primeiro é
 * quem nunca estudou — e a tela não pode dizer "0 dias", porque zero é
 * medida e ali não há medida. O segundo é quem estudou e parou: o zero é
 * real, e a frase diz quando foi o último dia.
 */
export function fraseDaSequencia(s: SequenciaParaFrase): FraseDaSequencia {
  if (s.semRegistro || s.atual === null) {
    return {
      caso: 'nunca',
      principal: 'Nenhum dia de estudo registrado ainda.',
      detalhe: null,
      recorde: null,
    };
  }

  const recorde =
    s.maior !== null && s.maior > s.atual && s.maior > 1
      ? `A mais longa: ${dias(s.maior)} seguidos${s.maiorAte ? `, até ${formatarDia(s.maiorAte)}` : ''}.`
      : null;

  if (s.atual === 0) {
    return {
      caso: 'parada',
      principal: 'A sequência parou: nenhum estudo registrado ontem nem hoje.',
      detalhe: s.ultimoDiaAtivo ? `Último dia com estudo registrado: ${formatarDia(s.ultimoDiaAtivo)}.` : null,
      recorde,
    };
  }

  return {
    caso: 'viva',
    principal:
      s.atual === 1
        ? '1 dia com estudo registrado na sequência atual.'
        : `${dias(s.atual)} seguidos com estudo registrado.`,
    detalhe:
      s.ultimoDiaAtivo && s.ultimoDiaAtivo !== s.diaDeReferencia
        ? 'Sem estudo registrado hoje ainda; a sequência segue até o fim do dia.'
        : null,
    recorde,
  };
}

// ── 4 · Metadata da prática: `aulaId` sempre ──────────────────

/** O gênero do ato que gerou `exercicio_respondido`. Fixa o contrato que
 *  `sistema-de-conquistas.md` §2.2 deixou "pretendido". `autoavaliacao`
 *  não está aqui de propósito: julgar a própria resposta não é uma nova
 *  tentativa, e emitir por ela inflaria `totalTentativas` no Praticado. */
export type GeneroDoAto = 'previsao' | 'meta' | 'exercicio' | 'decisao' | 'avaliacao';

/** Valor de controle de instrumento como o `InstrumentPanel` guarda. */
export type ValorDeControle = number | string;

export type EventoDePratica =
  | {
      tipo: 'exercicio_respondido';
      /** O exercício ou o ato (`ex-06`, `aula-01-08#previsao`). */
      entidadeId: string;
      aulaId: string;
      moduloId?: string | null;
      ato: GeneroDoAto;
      /** O que o aluno registrou. Vai no log; não volta para a página. */
      resposta?: string | null;
      /** `false` quando o aluno já viu a referência e registra de novo. */
      antesDaReferencia: boolean;
    }
  | {
      tipo: 'instrumento_usado';
      entidadeId: string;
      aulaId: string;
      moduloId?: string | null;
      /** `ajuste` = mexeu num controle de instrumento ao vivo; `correcao` =
       *  pediu a correção num instrumento de correção sob demanda. */
      modo: 'ajuste' | 'correcao';
      valores?: Record<string, ValorDeControle | undefined>;
    };

/** Teto do texto de resposta no log. O `metadata` é JSONB livre; o teto é
 *  engenharia (corpo de requisição), não pedagogia — e o corte é DECLARADO
 *  no próprio evento (`respostaTruncada`), nunca silencioso. */
export const TETO_DA_RESPOSTA = 4000;
const TETO_DE_CONTROLES = 32;
const TETO_DE_TEXTO_DE_CONTROLE = 64;

export type MetadataDePratica = Record<string, unknown> & { aulaId: string };

/**
 * Monta o `metadata` de um evento de prática. Devolve `null` — e o evento
 * NÃO é enviado — quando falta `aulaId` ou `entidadeId`: sem `aulaId` o
 * backend conta a tentativa em `eventosSemAulaVinculada`, e o Praticado da
 * aula nunca a vê. Melhor não registrar do que registrar órfão.
 */
export function montarMetadataDePratica(e: EventoDePratica): MetadataDePratica | null {
  const aulaId = e.aulaId?.trim();
  if (!aulaId || !e.entidadeId?.trim()) return null;

  const base: MetadataDePratica = { aulaId };
  if (e.moduloId) base.moduloId = e.moduloId;

  if (e.tipo === 'exercicio_respondido') {
    base.ato = e.ato;
    base.antesDaReferencia = e.antesDaReferencia;
    const resposta = e.resposta?.trim();
    if (resposta) {
      if (resposta.length > TETO_DA_RESPOSTA) {
        base.resposta = resposta.slice(0, TETO_DA_RESPOSTA);
        base.respostaTruncada = true;
      } else {
        base.resposta = resposta;
      }
    }
    return base;
  }

  base.modo = e.modo;
  base.alterouParametro = e.modo === 'ajuste';
  if (e.valores) {
    const limpos: Record<string, ValorDeControle> = {};
    let n = 0;
    for (const [k, v] of Object.entries(e.valores)) {
      if (n >= TETO_DE_CONTROLES) break;
      if (typeof v === 'number' && Number.isFinite(v)) limpos[k] = v;
      else if (typeof v === 'string' && v.length <= TETO_DE_TEXTO_DE_CONTROLE) limpos[k] = v;
      else continue;
      n += 1;
    }
    if (n > 0) base.valores = limpos;
  }
  return base;
}

/** Id de entidade de um ato de aula de tronco, que não tem id na fonte:
 *  `aula-01-08#previsao`. Opaco para o backend; estável para o front. */
export const idDoAto = (aulaId: string, atoId: string): string => `${aulaId}#${atoId}`;

// ── 5 · Uso de instrumento: um evento por ajuste assentado ────

export interface Relogio {
  setTimeout: (fn: () => void, ms: number) => unknown;
  clearTimeout: (id: unknown) => void;
}

/**
 * Agrupa uso de instrumento ao vivo. Arrastar uma régua dispara dezenas de
 * mudanças por segundo; registrar cada uma como `instrumento_usado`
 * transformaria um gesto em cinquenta "tentativas" no Praticado. O
 * agrupador espera o controle ASSENTAR (`esperaMs` sem mudança) e emite um
 * evento só, com os valores finais. `descarregar` emite o que ficou
 * pendente — chamado na desmontagem, porque o aluno usou o instrumento.
 */
export function criarAgrupador<T>(
  esperaMs: number,
  emitir: (chave: string, valor: T) => void,
  relogio: Relogio,
) {
  const pendentes = new Map<string, { valor: T; timer: unknown }>();
  return {
    empurrar(chave: string, valor: T) {
      const antes = pendentes.get(chave);
      if (antes) relogio.clearTimeout(antes.timer);
      const timer = relogio.setTimeout(() => {
        const p = pendentes.get(chave);
        pendentes.delete(chave);
        if (p) emitir(chave, p.valor);
      }, esperaMs);
      pendentes.set(chave, { valor, timer });
    },
    descarregar() {
      for (const [chave, p] of [...pendentes]) {
        relogio.clearTimeout(p.timer);
        pendentes.delete(chave);
        emitir(chave, p.valor);
      }
    },
    get pendentes() {
      return pendentes.size;
    },
  };
}
