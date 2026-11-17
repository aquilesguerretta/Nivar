// AlexandriaRouter — roteador interno do produto.
//
//   /alexandria                                   → hub das três trilhas
//   /alexandria/biblioteca                        → fontes e bibliografia
//   /alexandria/trilha/:trilhaId                  → caminho de expedição
//   /alexandria/trilha/:trilhaId/modulo/:moduloId → lista de aula
//
// Progresso e insígnias vêm da FOUNDRY Wave 3, que fechou durante esta
// wave. O dado inline que existia aqui antes foi removido — ele
// divergia em dois pontos, e a FOUNDRY estava certa nos dois:
//
//   1. aulasCompleted era 13; o correto é 12 (Módulo 01 inteiro = 9,
//      mais 3 das 10 do Módulo 02).
//   2. bySubmercado tinha totais inventados (2/6 e 1/4). A FOUNDRY zera
//      todos os quatro totais, e o motivo é o mesmo princípio desta
//      wave: `CurriculumAula` não tem registro nenhum, então não existe
//      aula para contar por submercado e qualquer total seria invenção.

import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { AlexandriaShell } from '@/components/alexandria/shell/AlexandriaShell';
import { PerfilV3 } from '@/components/alexandria/v3/perfil/PerfilV3';
import { AtlasStub } from './AtlasStub';
import { GlossarioV3 } from '@/components/alexandria/v3/GlossarioV3';
import { BibliotecaV3 } from '@/components/alexandria/v3/BibliotecaV3';
import { RevisaoV3 } from '@/components/alexandria/v3/revisao/RevisaoV3';
import { AulaViewer } from '@/components/alexandria/viewer/AulaViewer';
import { aulaComArquetipo } from '@/components/alexandria/aula/arquetipos';
import { IndiceDeTrilhas } from '@/components/alexandria/v3/IndiceDeTrilhas';
import { CascaDaAula, rolarAulaAoTopo } from '@/components/alexandria/v3/CascaDaAula';
import { AulaV3 } from '@/components/alexandria/v3/aula/AulaV3';
import { MODULOS_NO_MODELO_V3 } from '@/lib/alexandria/modulos-v3';
import { useEstudo } from '@/components/alexandria/home/estudo';
import {
  getAulaDoModulo,
  MODULOS_COM_CONTEUDO,
  TOTAL_AULAS_EXTRAIDAS,
} from '@/lib/data/alexandria-curriculo';
import { A, A2, AT, AS, AR } from '@/design/alexandria-tokens';
import type {
  CurriculumModule,
  CurriculumTrack,
} from '@/lib/types/alexandria';
import {
  ALEXANDRIA_TRILHAS,
  getModuleById,
  getModulesByTrilha,
  getTrilhaById,
} from '@/lib/data/alexandria-trilhas';
import { MOCK_USER_PROGRESS } from '@/lib/data/alexandria-progress-mock';

const Modulo08GamePage = lazy(() => import('./Modulo08GamePage'));


export { MOCK_USER_PROGRESS };

/** Repartição por módulo das `aulasCompleted` da FOUNDRY.
 *
 *  `MOCK_USER_PROGRESS.aulasCompleted` é 12 e o próprio arquivo declara a
 *  decomposição: "Módulo 01 inteiro (9 aulas) + 3 das 10 do Módulo 02".
 *  O contrato `UserProgress` é agregado e não carrega essa repartição,
 *  mas o estado de nó precisa dela. Reproduzo a decomposição declarada e
 *  travo a soma contra o agregado logo abaixo, para os dois não
 *  divergirem em silêncio se a FOUNDRY mudar o número.
 *
 *  Só módulo com `totalAulas` conhecido pode aparecer aqui: não existe
 *  "3 de null". */
export const AULAS_CONCLUIDAS_POR_MODULO: Record<string, number> = {
  'modulo-01': 9,
  'modulo-02': 3,
  'modulo-03': 0,
};

if (import.meta.env.DEV) {
  const soma = Object.values(AULAS_CONCLUIDAS_POR_MODULO).reduce((a, b) => a + b, 0);
  if (soma !== MOCK_USER_PROGRESS.aulasCompleted) {
    console.warn(
      `[alexandria] AULAS_CONCLUIDAS_POR_MODULO soma ${soma} mas ` +
        `MOCK_USER_PROGRESS.aulasCompleted é ${MOCK_USER_PROGRESS.aulasCompleted}. ` +
        'A repartição por módulo saiu de sincronia com o agregado da FOUNDRY.',
    );
  }
}

// ── Estado de módulo ─────────────────────────────────────────
//
// O estado é RÓTULO DE PROGRESSO, não portão. Todo módulo com conteúdo é
// navegável; só `em-producao` não abre, porque não existe o que abrir.
//
//   concluido / em-andamento / desbloqueado → tem conteúdo, abre sempre.
//   em-producao → `totalAulas` é null. Não há aula, nem número honesto.
//
// `'bloqueado'` continua no tipo por compatibilidade com quem faz
// exaustão sobre ele (`ModuloNode`, `SlotModulos`), mas `estadosDaTrilha`
// nunca mais o produz.
//
// POR QUE A TRAVA SAIU: a progressão sequencial ("conclua o módulo
// anterior") dependia de um progresso que não existe — `MOCK_USER_PROGRESS`
// é demonstração fixa, igual para toda conta, e a Alexandria ainda não
// registra aula concluída por usuário (ver LYCEUM Wave 23). O resultado
// prático era conteúdo real inalcançável: com o mock em 3/10 no Módulo 02,
// tudo a partir da Aula 5 dele ficava trancado, e os Módulos 03-05 inteiros
// também. Trancar por um progresso fictício esconde o produto sem proteger
// nada. Quando existir progresso real por conta, a regra pode voltar —
// aí ela estará medindo alguma coisa.
export type EstadoModulo =
  | 'concluido'
  | 'em-andamento'
  | 'desbloqueado'
  | 'bloqueado'
  | 'em-producao';

export interface ModuloComEstado {
  modulo: CurriculumModule;
  estado: EstadoModulo;
  /** Aulas feitas. null quando o módulo está em produção — não é 0. */
  aulasFeitas: number | null;
}

/** Deriva o estado de cada módulo da trilha, em ordem.
 *
 *  Progressão: um módulo com conteúdo abre quando todos os módulos com
 *  conteúdo anteriores a ele estão concluídos. Módulo em produção NÃO
 *  tranca a fila — ele não existe, então não pode ser pré-requisito de
 *  nada. Sem isso, um módulo sem HTML congelaria a trilha inteira. */
export function estadosDaTrilha(modulos: CurriculumModule[]): ModuloComEstado[] {
  return modulos.map((modulo) => {
    if (modulo.totalAulas === null) {
      return { modulo, estado: 'em-producao' as const, aulasFeitas: null };
    }

    const feitas = AULAS_CONCLUIDAS_POR_MODULO[modulo.id] ?? 0;
    const estado: EstadoModulo =
      feitas >= modulo.totalAulas ? 'concluido' : feitas > 0 ? 'em-andamento' : 'desbloqueado';

    return { modulo, estado, aulasFeitas: feitas };
  });
}

/** Uma posição na sequência linear de aulas de uma trilha. */
interface PassoDaTrilha {
  moduloId: string;
  moduloTitulo: string;
  numero: number;
  total: number;
}

/** Achata a trilha numa sequência de aulas, na ordem em que se estuda.
 *
 *  Módulo em produção (`totalAulas: null`) não tem aula, então some da
 *  sequência sozinho — o "próximo" pula para o módulo seguinte que tem
 *  conteúdo, sem cair num beco. */
export function sequenciaDaTrilha(modulos: CurriculumModule[]): PassoDaTrilha[] {
  const passos: PassoDaTrilha[] = [];
  for (const m of modulos) {
    if (m.totalAulas === null) continue;
    for (let n = 1; n <= m.totalAulas; n++) {
      passos.push({ moduloId: m.id, moduloTitulo: m.title, numero: n, total: m.totalAulas });
    }
  }
  return passos;
}

/** Trilha sugerida pelo `?trilha=` do portal BR.
 *
 *  O parâmetro indica TRACK — mercado de entrada — não uma trilha exata.
 *  Retorna a primeira trilha daquele track, ou null. Nunca filtra: o hub
 *  mostra as três sempre.
 *
 *  Nota: nenhuma trilha tem track 'usa' hoje (a Trilha 3 é 'brasil'),
 *  então `?trilha=usa` cai em null e o hub simplesmente não destaca
 *  nada — sem tela vazia, sem erro. */
export function trilhaSugerida(track: CurriculumTrack | null): string | null {
  if (!track) return null;
  return ALEXANDRIA_TRILHAS.find((t) => t.track === track)?.id ?? null;
}

interface AlexandriaRouterProps {
  trackDeEntrada: CurriculumTrack | null;
}

export function AlexandriaRouter({ trackDeEntrada }: AlexandriaRouterProps) {
  const sugerida = trilhaSugerida(trackDeEntrada);

  return (
    <Routes>
      {/* v3: trilhas, módulos e aulas numa tela só (O Índice). As telas
          antigas destas três rotas usavam progresso de mock (S3). */}
      <Route index element={<IndiceRoute trilhaSugeridaId={sugerida} />} />
      <Route path="trilhas" element={<IndiceRoute trilhaSugeridaId={sugerida} />} />
      <Route path="trilha/:trilhaId" element={<IndiceRoute trilhaSugeridaId={null} />} />
      <Route path="trilha/:trilhaId/modulo/:moduloId" element={<IndiceRoute trilhaSugeridaId={null} />} />
      <Route path="trilha/:trilhaId/modulo/:moduloId/jogo" element={<JogoRoute />} />
      <Route path="trilha/:trilhaId/modulo/:moduloId/aula/:aulaNumero" element={<AulaRoute />} />
      <Route path="biblioteca" element={<BibliotecaV3 />} />
      <Route path="revisao" element={<RevisaoV3 />} />
      <Route path="perfil" element={<PerfilV3 />} />
      <Route path="atlas" element={<AtlasStub />} />
      <Route path="glossario/*" element={<GlossarioV3 />} />
      <Route path="*" element={<IndiceRoute trilhaSugeridaId={sugerida} />} />
    </Routes>
  );
}

function IndiceRoute({ trilhaSugeridaId }: { trilhaSugeridaId: string | null }) {
  const { trilhaId, moduloId } = useParams();
  return <IndiceDeTrilhas trilhaFoco={trilhaId ?? trilhaSugeridaId} moduloAberto={moduloId ?? null} />;
}

// ── Rotas ────────────────────────────────────────────────────
// Cada rota monta o próprio shell porque a configuração de rail varia.

function JogoRoute() {
  const { trilhaId, moduloId } = useParams();
  const trilha = trilhaId ? getTrilhaById(trilhaId) : null;
  const modulo = moduloId ? getModuleById(moduloId) : null;

  if (!trilha || !modulo || modulo.trilhaId !== trilha.id || modulo.id !== 'modulo-08') {
    return <NaoEncontrado titulo="Expedição não encontrada" />;
  }

  return (
    <AlexandriaShell>
      <Suspense fallback={<GameLoading />}>
        <Modulo08GamePage trilhaId={trilha.id} />
      </Suspense>
    </AlexandriaShell>
  );
}

function GameLoading() {
  return (
    <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: AS.sm }}>
      <span style={{ ...AT.rotulo, color: A.terracota }}>Abrindo caixa documental</span>
      <span style={{ ...AT.corpo, color: A.tintaSuave }}>Preparando a expedição decisória do Módulo 08…</span>
    </div>
  );
}

/** Placeholder do viewer de aula — a wave seguinte constrói de verdade.
 *  Existe para que o clique numa aula tenha destino real em vez de
 *  cair no catch-all e voltar pro hub sem explicação. */
function AulaRoute() {
  const { trilhaId, moduloId, aulaNumero } = useParams();
  const navigate = useNavigate();
  const estudo = useEstudo();
  const trilha = trilhaId ? getTrilhaById(trilhaId) : null;
  const modulo = moduloId ? getModuleById(moduloId) : null;

  if (!trilha || !modulo || modulo.trilhaId !== trilha.id) {
    return <NaoEncontrado titulo="Aula não encontrada" />;
  }

  const numero = Number(aulaNumero);
  const total = modulo.totalAulas;
  if (!Number.isInteger(numero) || numero < 1 || total === null || numero > total) {
    return <NaoEncontrado titulo="Aula não encontrada" />;
  }

  // Modelo de aula v3 (src/components/alexandria/v3/aula/), com o M01 como
  // régua: vídeo (se houver) → abertura → leitura com figuras e glossário →
  // instrumento com previsão e véu → exercícios → fim e, na última aula, a
  // avaliação do módulo. Substitui, no M01, o viewer legado e o arquétipo
  // PRANCHA da A08. Os demais módulos seguem como estavam até ganharem a
  // configuração de previsão e véu dos instrumentos deles.
  if (MODULOS_NO_MODELO_V3.has(modulo.id)) {
    const aulaV3 = getAulaDoModulo(modulo.id, numero);
    if (aulaV3) {
      return (
        <CascaDaAula trilhaId={trilha.id} moduloId={modulo.id} numero={numero} ampla>
          <AulaV3 trilhaId={trilha.id} moduloId={modulo.id} numero={numero} totalAulas={total} aula={aulaV3} />
        </CascaDaAula>
      );
    }
  }

  // Aulas com arquétipo (registro em components/alexandria/aula/arquetipos.ts)
  // montam sobre o tronco comum. As demais caem no viewer legado ou no
  // estado honesto "ainda não extraída". Shell sem trilhos de propósito: o
  // registro percorrido vem do backend (useEstudo), nunca do mock.
  const composta = aulaComArquetipo(modulo.id, numero);
  if (composta) {
    const { Componente } = composta;
    const concluidas = estudo.fase === 'conta' ? estudo.progresso.aulasConcluidas : [];
    const prefixo = `aula-${modulo.id.slice(-2)}-`;
    const percorridas = concluidas
      .filter((id) => id.startsWith(prefixo))
      .map((id) => Number(id.slice(prefixo.length)))
      .filter((n) => Number.isInteger(n));
    const rotaDaAula = (n: number) => `/alexandria/trilha/${trilha.id}/modulo/${modulo.id}/aula/${n}`;
    return (
      <CascaDaAula trilhaId={trilha.id} moduloId={modulo.id} numero={numero} ampla>
        <Componente
          trilhaId={trilha.id}
          moduloId={modulo.id}
          numero={numero}
          totalAulas={total}
          percorridas={percorridas}
          visitante={estudo.fase !== 'conta'}
          navegar={(destino) => {
            if (destino.startsWith('#')) {
              document.getElementById(destino.slice(1))?.scrollIntoView({ block: 'start' });
              return;
            }
            navigate(destino);
            rolarAulaAoTopo();
          }}
          rotaDaAula={rotaDaAula}
          rotaDoModulo={`/alexandria/trilha/${trilha.id}/modulo/${modulo.id}`}
        />
      </CascaDaAula>
    );
  }

  // O catálogo é resolvido pelo módulo da aula — nada de módulo fixo aqui.
  // Módulo 01 (Wave 4) e Módulo 02 (Wave 18) têm conteúdo; os demais caem
  // no estado "ainda não extraída", que continua sendo a verdade deles.
  const aulaReal = getAulaDoModulo(modulo.id, numero);
  const modulosDaTrilha = getModulesByTrilha(trilha.id);

  // Sequência linear da trilha inteira, para as setas de anterior/próxima.
  // Atravessa a fronteira de módulo: a última aula do Módulo 02 leva à
  // primeira do 03, que é como o currículo é lido de verdade.
  const seq = sequenciaDaTrilha(modulosDaTrilha);
  const iAtual = seq.findIndex((p) => p.moduloId === modulo.id && p.numero === numero);
  const anterior = iAtual > 0 ? seq[iAtual - 1] : null;
  const proxima = iAtual >= 0 && iAtual < seq.length - 1 ? seq[iAtual + 1] : null;

  return (
    <CascaDaAula trilhaId={trilha.id} moduloId={modulo.id} numero={numero}>
      <header className="aula-cabeca">
        <span className="v-dado">{modulo.title}</span>
        <h1>{aulaReal ? aulaReal.title : `Aula ${String(numero).padStart(2, '0')}`}</h1>
        {aulaReal?.subtitle && <span className="aula-sub">{aulaReal.subtitle}</span>}
      </header>

      {aulaReal ? (
        <AulaViewer aula={aulaReal} />
      ) : (
        <div className="aula-ausente">
          <strong>Aula ainda não disponível</strong>
          <span>
            A numeração é real; o texto desta aula ainda não está no produto. Hoje {TOTAL_AULAS_EXTRAIDAS}{' '}
            aulas, em {MODULOS_COM_CONTEUDO.length} dos dezessete módulos, têm texto, instrumento e exercício.
          </span>
        </div>
      )}

      <NavegacaoAula trilhaId={trilha.id} anterior={anterior} proxima={proxima} />
    </CascaDaAula>
  );
}

/** Anterior / próxima ao fim da aula — a forma de percorrer o currículo
 *  sem voltar à lista a cada passo.
 *
 *  Atravessa a fronteira de módulo, e por isso mostra o título do módulo
 *  quando ele muda: passar do 02 para o 03 é mudança de assunto, e a
 *  navegação diz isso em vez de fingir continuidade. Nas pontas da trilha
 *  o lado correspondente some — sem botão morto. */
function NavegacaoAula({
  trilhaId,
  anterior,
  proxima,
}: {
  trilhaId: string;
  anterior: PassoDaTrilha | null;
  proxima: PassoDaTrilha | null;
}) {
  const navigate = useNavigate();
  if (!anterior && !proxima) return null;

  const ir = (p: PassoDaTrilha) => {
    navigate(`/alexandria/trilha/${trilhaId}/modulo/${p.moduloId}/aula/${p.numero}`);
    // A aula nova começa do topo. O scroller é o `<main>` do shell, não o
    // documento — mesma restrição que a Wave 7 mediu no CTA do hero.
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'auto' });
  };

  const lado = (p: PassoDaTrilha, sentido: 'anterior' | 'proxima') => (
    <button
      type="button"
      onClick={() => ir(p)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        alignItems: sentido === 'proxima' ? 'flex-end' : 'flex-start',
        textAlign: sentido === 'proxima' ? 'right' : 'left',
        flex: 1,
        maxWidth: '46%',
        background: 'none',
        border: 'none',
        borderRadius: AR.none,
        padding: 0,
        cursor: 'pointer',
        font: 'inherit',
      }}
    >
      <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado }}>
        {sentido === 'anterior' ? '← Aula anterior' : 'Próxima aula →'}
      </span>
      <span style={{ ...AT.corpo, fontSize: '14px', color: A.terracota, maxWidth: 'none' }}>
        {p.moduloTitulo} · Aula {p.numero}
      </span>
    </button>
  );

  return (
    <nav
      aria-label="Navegação entre aulas"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: AS.xl,
        paddingTop: AS.lg,
        borderTop: `1px solid ${A.fioSobreCreme}`,
      }}
    >
      {anterior ? lado(anterior, 'anterior') : <span style={{ flex: 1 }} />}
      {proxima ? lado(proxima, 'proxima') : <span style={{ flex: 1 }} />}
    </nav>
  );
}

// ── Peças compartilhadas ─────────────────────────────────────

function Voltar({ rotulo, para }: { rotulo: string; para: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(para)}
      style={{
        ...AT.rotulo,
        alignSelf: 'flex-start',
        color: A2.tintaMetadado,
        background: 'none',
        border: 'none',
        borderRadius: AR.none,
        padding: 0,
        cursor: 'pointer',
      }}
    >
      {rotulo}
    </button>
  );
}

function NaoEncontrado({ titulo }: { titulo: string }) {
  return (
    <AlexandriaShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.md }}>
        <span style={{ ...AT.rotulo, color: A.terracota }}>Sem registro</span>
        <h1 style={{ ...AT.h1, color: A.tintaSobreCreme, margin: 0 }}>{titulo}</h1>
        <p style={{ ...AT.corpo, color: A.tintaSuave, margin: 0, fontSize: '15px' }}>
          Nenhum registro do currículo corresponde a esse endereço.
        </p>
        <Voltar rotulo="← Todas as trilhas" para="/alexandria" />
      </div>
    </AlexandriaShell>
  );
}

export default AlexandriaRouter;
