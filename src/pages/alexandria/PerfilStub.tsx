// PerfilStub — a superfície de Perfil da Alexandria.
//
// O nome do arquivo fica: é o contrato de rota que a Wave 6 registrou, e
// `AlexandriaRouter.tsx` não é posse desta wave. O corpo deixou de ser
// stub na Wave 23.
//
// ROTA PROTEGIDA. O mecanismo NÃO é inventado aqui — é o mesmo que o
// ARCHITECT já usa em `PerfilPlataforma.tsx`: `<Navigate to="/entrar">`
// carregando `state={{ de: location.pathname }}`, que o `EntrarView` lê
// (`location.state.de`) e para onde volta depois do login. Reaproveitar
// significa que entrar pelo Perfil da Alexandria devolve ao Perfil da
// Alexandria, não ao `/conta` genérico.
//
// `loading === true` mostra estado de carregamento, nunca redireciona:
// enquanto `/api/auth/me` não respondeu, ninguém pode concluir "não
// logado" — só "ainda não sabemos". Redirecionar aí expulsaria quem TEM
// sessão válida a cada carga de página.

import { useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import type { PlatformUser } from '@/lib/auth/authApi';
import { AlexandriaShell } from '@/components/alexandria/shell/AlexandriaShell';
import { getMyProgress, type MyProgress } from '@/lib/progress/progressApi';
import {
  getAula,
  getAulaDoModulo,
  TOTAL_AULAS_EXTRAIDAS,
} from '@/lib/data/alexandria-curriculo';
import { ALEXANDRIA_BADGES } from '@/lib/data/alexandria-badges';
import { BADGES_SEM_REGRA, contarBloqueios } from '@/lib/progress/badgeRules';
import { getTrilhaByLevel, getModuleById } from '@/lib/data/alexandria-trilhas';
import type { CurriculumAula, Badge } from '@/lib/types/alexandria';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';

/** O id de `alexandria` no catálogo canônico que o backend serve em
 *  `/api/products/me`. Não é lista local: o catálogo vem do servidor
 *  justamente para o front não manter uma segunda cópia que deriva. */
const PRODUTO = 'alexandria';

/** O progresso da conta, buscado uma vez no topo e compartilhado pelas
 *  seções que o consomem. Os três estados são explícitos — carregando não
 *  é "vazio", e falha não é "zero". */
interface DadoProgresso {
  dado: MyProgress | null;
  carregando: boolean;
  falhou: boolean;
}

/** Mesma forma de data que o `/conta` da plataforma usa, para os dois
 *  lados da mesma conta não escreverem a mesma data de jeitos diferentes. */
function formatarData(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function PerfilStub() {
  const { user, loading, myProducts, activateProduct, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [ativadoEm, setAtivadoEm] = useState<string | null>(null);
  const [saindo, setSaindo] = useState(false);

  // O progresso é buscado UMA vez aqui e desce para as duas seções que o
  // consomem — LYCEUM Wave 39. Antes vivia dentro de `ProgressoSecao`;
  // com o Certificado passando a cruzar progresso real, deixar cada uma
  // com seu próprio `useEffect` renderia duas chamadas idênticas ao mesmo
  // endpoint na mesma carga de página.
  const [progresso, setProgresso] = useState<MyProgress | null>(null);
  const [carregandoProgresso, setCarregandoProgresso] = useState(true);
  const [progressoFalhou, setProgressoFalhou] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    getMyProgress(ctrl.signal)
      .then((d) => setProgresso(d))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setProgressoFalhou(true);
      })
      .finally(() => setCarregandoProgresso(false));
    return () => ctrl.abort();
  }, []);

  // Sair devolve à entrada da Alexandria, não ao portal: quem estava aqui
  // estava lendo a Alexandria, e é para lá que faz sentido voltar sem
  // sessão. O guard acima continua protegendo /perfil.
  async function sair() {
    setSaindo(true);
    await logout();
    navigate('/alexandria', { replace: true });
  }

  // Ativação automática: estar nesta página já é intenção de uso, então
  // não existe botão "ativar Alexandria" — seria fricção sem decisão.
  //
  // A ativação só DISPARA quando necessário. `myProducts()` é consultado
  // primeiro; se `alexandria` já está lá, `activateProduct` não é chamado.
  // A rota é idempotente no backend (constraint no banco), mas idempotente
  // não é motivo para gastar uma escrita a cada visita.
  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    let vivo = true;

    myProducts(ctrl.signal)
      .then(async ({ products }) => {
        const ja = products.find((p) => p.productId === PRODUTO);
        if (ja) {
          if (vivo) setAtivadoEm(ja.activatedAt);
          return;
        }
        const r = await activateProduct(PRODUTO);
        if (vivo) setAtivadoEm(r.activatedAt);
      })
      .catch((err: unknown) => {
        // Falha aqui não pode derrubar a página: o Perfil continua útil
        // sem a data de ativação. Fica em null e a linha some.
        if (err instanceof Error && err.name === 'AbortError') return;
      });

    return () => {
      vivo = false;
      ctrl.abort();
    };
  }, [user, myProducts, activateProduct]);

  if (loading) return <Carregando />;
  if (!user) return <Navigate to="/entrar" replace state={{ de: location.pathname }} />;

  return (
    <AlexandriaShell navAtivo="perfil">
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xxl }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: AS.sm }}>
          <span style={{ ...AT.rotulo, color: A.terracota }}>Perfil</span>
          <h1 style={{ ...AT.h1, color: A.tintaSobreCreme, margin: 0 }}>
            Seu percurso, reunido
          </h1>
          <p style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSuave, margin: 0 }}>
            Identidade vem da sua conta GridAlpha. O que você vê abaixo é só
            a Alexandria — os outros produtos e a assinatura ficam no perfil
            de plataforma.
          </p>
        </div>

        <IdentidadeSecao user={user} ativadoEm={ativadoEm} onSair={sair} saindo={saindo} />
        <ProgressoSecao dado={progresso} carregando={carregandoProgresso} falhou={progressoFalhou} />
        <CertificadoSecao dado={progresso} carregando={carregandoProgresso} falhou={progressoFalhou} />
      </div>
    </AlexandriaShell>
  );
}

// ── Identidade — o único bloco com dado REAL de conta ──────────────
function IdentidadeSecao({
  user,
  ativadoEm,
  onSair,
  saindo,
}: {
  user: PlatformUser;
  ativadoEm: string | null;
  onSair: () => void;
  saindo: boolean;
}) {
  // Nome, email e "membro desde" são três fatos do mesmo nível sobre a
  // mesma conta — peso igual de propósito, sem eleger um dominante.
  const linhas: [string, string][] = [
    ['Nome', user.name],
    ['Email', user.email],
    ['Membro desde', formatarData(user.createdAt)],
  ];
  if (ativadoEm) linhas.push(['Alexandria ativada em', formatarData(ativadoEm)]);

  return (
    <Secao rotulo="Identidade">
      <dl style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
        {linhas.map(([rotulo, valor], i) => (
          <div
            key={rotulo}
            style={{
              display: 'grid',
              gridTemplateColumns: '190px 1fr',
              gap: AS.lg,
              padding: `${AS.md} 0`,
              borderTop: i > 0 ? `1px solid ${A2.fioClaroSobreCreme}` : 'none',
            }}
          >
            <dt style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado }}>{rotulo}</dt>
            <dd style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSobreCreme, margin: 0 }}>
              {valor}
            </dd>
          </div>
        ))}
      </dl>

      <div style={{ display: 'flex', alignItems: 'center', gap: AS.xl, flexWrap: 'wrap' }}>
        {/* O Perfil da Alexandria não lista outro produto nem assinatura —
            isso é o /conta de plataforma. Um link de saída basta. */}
        <Link
          to="/conta"
          style={{
            ...AT.dado,
            fontSize: '12px',
            color: A.terracota,
            textDecoration: 'none',
            borderBottom: `1px solid ${A.terracota}`,
          }}
        >
          Gerenciar conta →
        </Link>
        <button
          type="button"
          onClick={onSair}
          disabled={saindo}
          style={{
            ...AT.rotulo,
            fontSize: '10px',
            color: A2.tintaMetadado,
            background: 'none',
            border: 'none',
            borderBottom: `1px solid ${A.fioSobreCreme}`,
            borderRadius: AR.none,
            padding: `0 0 ${AS.xs} 0`,
            cursor: saindo ? 'default' : 'pointer',
            transition: `color ${AE.estado} ${AE.easing}`,
          }}
        >
          {saindo ? 'Saindo…' : 'Sair da conta'}
        </button>
      </div>
    </Secao>
  );
}

// ── Progresso — real, LYCEUM Wave 31 ───────────────────────────────
//
// Fecha a frase que ficou pendurada desde a Wave 23 ("sua identidade é
// real, seu percurso ainda não"): o backend passou a ter tabela própria
// (CURSOR Wave 11), então esta seção lê `GET /api/progress/me` em vez do
// mock que alimentava o rail direito desde a FOUNDRY Wave 3.
//
// O backend devolve fato cru — `aulaIds`, nunca "X de Y" — de propósito
// (contrato, §"Per-account learning progress"): não tem tabela de aula
// nem de módulo. A junção contra o catálogo é feita aqui, e só sobre
// aulaIds que `getAula` reconhece — o que já restringe estritamente a
// módulos extraídos (nenhum módulo com `totalAulas: null` chega a ter
// entrada em `alexandria-curriculo.ts`), então o "nunca contra
// denominador desconhecido" da wave sai de graça dessa restrição
// estrutural, não de um filtro adicional inventado aqui.
function ProgressoSecao({ dado, carregando, falhou }: DadoProgresso) {
  if (carregando) {
    return (
      <Secao rotulo="Progresso na Alexandria">
        <span style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSuave }}>
          Carregando seu progresso…
        </span>
      </Secao>
    );
  }

  if (falhou || !dado) {
    return (
      <Secao rotulo="Progresso na Alexandria">
        <div
          style={{
            border: `1px dashed ${A.terracota}`,
            borderRadius: AR.none,
            padding: AS.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: AS.xs,
          }}
        >
          <span style={{ ...AT.rotulo, color: A.terracota }}>Não foi possível carregar</span>
          <p style={{ ...AT.corpo, fontSize: '13px', color: A.tintaSuave, maxWidth: '58ch', margin: 0 }}>
            O progresso não respondeu agora. Recarregue a página para tentar
            de novo — a identidade e a Apostila continuam funcionando
            normalmente enquanto isso.
          </p>
        </div>
      </Secao>
    );
  }

  const concluidas = dado.aulasConcluidas
    .map((id) => getAula(id))
    .filter((a): a is CurriculumAula => a !== null);
  const emAndamento = dado.aulasEmAndamento
    .map((id) => getAula(id))
    .filter((a): a is CurriculumAula => a !== null);

  const porId = new Map(ALEXANDRIA_BADGES.map((b) => [b.id, b]));
  const badgesConquistados = dado.badges
    .map((b) => ({ awardedAt: b.awardedAt, badge: porId.get(b.badgeId) }))
    .filter((b): b is { awardedAt: string; badge: Badge } => b.badge !== undefined);

  const numeros: [string, string][] = [
    ['Aulas concluídas', `${concluidas.length} de ${TOTAL_AULAS_EXTRAIDAS} confirmadas`],
    ['Aulas em andamento', `${emAndamento.length}`],
    ['Insígnias', `${badgesConquistados.length} de ${ALEXANDRIA_BADGES.length}`],
    [
      'Sequência',
      dado.streak.maior > dado.streak.atual
        ? `${dado.streak.atual} dia(s) · recorde ${dado.streak.maior}`
        : `${dado.streak.atual} dia(s)`,
    ],
  ];

  const semNenhumEvento =
    concluidas.length === 0 && emAndamento.length === 0 && badgesConquistados.length === 0;

  return (
    <Secao rotulo="Progresso na Alexandria">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: AS.md,
        }}
      >
        {numeros.map(([rotulo, valor]) => (
          <div
            key={rotulo}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: AS.xs,
              padding: AS.md,
              background: A2.cremeSuperficie,
              border: `1px solid ${A.fioSobreCreme}`,
              borderRadius: AR.none,
            }}
          >
            <span style={{ ...AT.rotulo, fontSize: '9px', color: A2.tintaMetadado }}>{rotulo}</span>
            <span style={{ ...AT.corpo, fontSize: '15px', color: A.tintaSobreCreme }}>{valor}</span>
          </div>
        ))}
      </div>

      {emAndamento.length > 0 && <ListaDeAulas titulo="Em andamento" aulas={emAndamento} />}

      {badgesConquistados.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado, paddingBottom: AS.sm }}>
            Insígnias conquistadas
          </span>
          {badgesConquistados.map((c, i) => (
            <div
              key={c.badge.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                padding: `${AS.sm} 0`,
                borderTop: i > 0 ? `1px solid ${A2.fioClaroSobreCreme}` : 'none',
              }}
            >
              <span style={{ ...AT.corpo, fontSize: '14px', color: A.oliva }}>
                {c.badge.name} · +{c.badge.expReward} XP
              </span>
              <span style={{ ...AT.dado, fontSize: '11px', lineHeight: 1.45, color: A.tintaSuave }}>
                {c.badge.criterion}
              </span>
            </div>
          ))}
        </div>
      )}

      {badgesConquistados.length === 0 && <InsigniasBloqueadas />}

      {semNenhumEvento && (
        <div
          style={{
            border: `1px dashed ${A.terracota}`,
            borderRadius: AR.none,
            padding: AS.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: AS.xs,
          }}
        >
          <span style={{ ...AT.rotulo, color: A.terracota }}>Comece por aqui</span>
          <p style={{ ...AT.corpo, fontSize: '13px', color: A.tintaSuave, maxWidth: '58ch', margin: 0 }}>
            Nenhum progresso registrado ainda nesta conta. O rastreamento é
            real — abra qualquer aula de uma trilha e o registro acontece
            sozinho a partir da leitura.
          </p>
        </div>
      )}
    </Secao>
  );
}

/** Por que a lista de insígnias está vazia — LYCEUM Wave 39.
 *
 *  Até aqui isto era um comentário no código ("pendência sem dono") e a
 *  lista simplesmente não aparecia. A Wave 39 auditou os 13 critérios e o
 *  veredito é que nenhum tem evento real disponível hoje; o aluno merece
 *  ler isso em vez de concluir que não conquistou nada. Os números são
 *  DERIVADOS de `REGRAS_BADGE` (`contarBloqueios`), então não divergem da
 *  tabela quando um bloqueio abrir. */
function InsigniasBloqueadas() {
  const c = contarBloqueios();
  const linhas: [string, number, string][] = [
    [
      'Demonstração fora da tela',
      c['competencia-humana'],
      'o critério é explicar, desenhar num guardanapo, narrar ou recitar — nenhum evento prova isso, e conceder por aproximação seria insígnia falsa',
    ],
    [
      'Valor calculado, não observado',
      c['instrumentacao-ausente'],
      'o número que o critério exige já é computado pelos instrumentos, mas nada lê o resultado deles ainda',
    ],
    ['Conteúdo ainda não extraído', c['conteudo-ausente'], 'a aula por trás do critério não existe'],
    ['Superfície ainda não construída', c['feature-ausente'], 'a tela que o critério nomeia não existe'],
  ].filter((l): l is [string, number, string] => (l[1] as number) > 0);

  return (
    <div
      style={{
        border: `1px dashed ${A.terracota}`,
        borderRadius: AR.none,
        padding: AS.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: AS.sm,
      }}
    >
      <span style={{ ...AT.rotulo, color: A.terracota }}>
        Nenhuma insígnia é conquistável ainda
      </span>
      <p style={{ ...AT.corpo, fontSize: '13px', color: A.tintaSuave, maxWidth: '58ch', margin: 0 }}>
        As {BADGES_SEM_REGRA.length} insígnias do catálogo têm critério
        escrito, e nenhuma tem regra automática hoje. Isto não é a sua
        conta: é o produto que ainda não sabe observar o que cada critério
        pede.
      </p>
      <dl style={{ display: 'flex', flexDirection: 'column', gap: AS.xs, margin: 0 }}>
        {linhas.map(([rotulo, n, razao]) => (
          <div key={rotulo} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <dt style={{ ...AT.rotulo, fontSize: '9px', color: A2.tintaMetadado }}>
              {rotulo} · {n}
            </dt>
            <dd style={{ ...AT.dado, fontSize: '11px', lineHeight: 1.45, color: A.tintaSuave, margin: 0 }}>
              {razao}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Lista de aulas com link direto — usada para "em andamento". Resolve a
 *  rota pelo catálogo (`getModuleById`), nunca digitada. */
function ListaDeAulas({ titulo, aulas }: { titulo: string; aulas: CurriculumAula[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ ...AT.rotulo, fontSize: '10px', color: A2.tintaMetadado, paddingBottom: AS.sm }}>
        {titulo}
      </span>
      {aulas.map((a, i) => {
        const modulo = getModuleById(a.moduleId);
        const rotulo = `${modulo?.title ?? a.moduleId} · Aula ${a.number} — ${a.title}`;
        const linkStyle = {
          ...AT.corpo,
          fontSize: '14px',
          color: A.terracota,
          textDecoration: 'none',
        } as const;
        return (
          <div
            key={a.id}
            style={{
              padding: `${AS.sm} 0`,
              borderTop: i > 0 ? `1px solid ${A2.fioClaroSobreCreme}` : 'none',
            }}
          >
            {modulo ? (
              <Link
                to={`/alexandria/trilha/${modulo.trilhaId}/modulo/${modulo.id}/aula/${a.number}`}
                style={linkStyle}
              >
                {rotulo}
              </Link>
            ) : (
              <span style={linkStyle}>{rotulo}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Certificado — cruzando progresso real, LYCEUM Wave 39 ──────────
//
// Fecha a pendência que a Wave 31 registrou por escrito ("o que falta
// agora é cruzar isso contra o progresso real desta conta"). Até aqui a
// seção era estática: o mesmo texto para toda conta, sem olhar uma única
// aula concluída.
//
// O requisito é EXPLÍCITO e derivado, nunca suposto: as aulas da Trilha 1
// são enumeradas do catálogo (`t1.moduleIds` × `totalAulas` de cada
// módulo, resolvidas por `getAulaDoModulo`), e o progresso vem de
// `GET /api/progress/me`. A intersecção é a conta. Nada de "provavelmente
// concluiu" — o certificado exige as aulas reais, uma a uma, e a seção
// mostra QUAIS faltam, por módulo, em vez de um bloqueado/desbloqueado
// binário sem contexto.

/** As aulas reais da Trilha 1, enumeradas do catálogo. Módulo sem
 *  `totalAulas` (nenhum na Trilha 1 desde a Wave 25) contribui zero em
 *  vez de estimativa — o denominador nunca é inventado. */
function aulasDaTrilha1(): { moduloId: string; titulo: string; aulaIds: string[] }[] {
  const t1 = getTrilhaByLevel(1);
  if (!t1) return [];
  return t1.moduleIds.map((moduloId) => {
    const m = getModuleById(moduloId);
    const total = m?.totalAulas ?? 0;
    const aulaIds: string[] = [];
    for (let n = 1; n <= total; n += 1) {
      const a = getAulaDoModulo(moduloId, n);
      if (a) aulaIds.push(a.id);
    }
    return { moduloId, titulo: m?.title ?? moduloId, aulaIds };
  });
}

function CertificadoSecao({ dado, carregando, falhou }: DadoProgresso) {
  const t1 = getTrilhaByLevel(1);
  const porModulo = aulasDaTrilha1();
  const totalAulas = porModulo.reduce((s, m) => s + m.aulaIds.length, 0);

  if (carregando) {
    return (
      <Secao rotulo="Certificado">
        <span style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSuave }}>
          Verificando o requisito contra o seu progresso…
        </span>
      </Secao>
    );
  }

  // Sem progresso legível não dá para afirmar nem "cumpriu" nem "faltam
  // N": o requisito é declarado, o estado da conta fica em aberto.
  if (falhou || !dado) {
    return (
      <Secao rotulo="Certificado">
        <Cartela rotulo="Nível 1 · requisito não verificado">
          <p style={{ ...AT.corpo, fontSize: '13px', color: A.tintaSuave, maxWidth: '58ch', margin: 0 }}>
            O certificado de Nível 1 exige as {totalAulas} aulas da Trilha 1
            concluídas. O seu progresso não respondeu agora, então esta
            seção não afirma quantas faltam — recarregue para verificar.
          </p>
        </Cartela>
      </Secao>
    );
  }

  const concluidas = new Set(dado.aulasConcluidas);
  const feitasPorModulo = porModulo.map((m) => ({
    ...m,
    feitas: m.aulaIds.filter((id) => concluidas.has(id)).length,
  }));
  const feitas = feitasPorModulo.reduce((s, m) => s + m.feitas, 0);
  const faltam = totalAulas - feitas;
  const completo = totalAulas > 0 && faltam === 0;
  const pct = totalAulas > 0 ? Math.round((feitas / totalAulas) * 100) : 0;

  return (
    <Secao rotulo="Certificado">
      <Cartela
        rotulo={
          completo ? 'Nível 1 · requisito cumprido' : `Nível 1 · ${feitas} de ${totalAulas} aulas`
        }
      >
        <p style={{ ...AT.corpo, fontSize: '13px', color: A.tintaSuave, maxWidth: '58ch', margin: 0 }}>
          {completo ? (
            <>
              Você concluiu as {totalAulas} aulas da Trilha 1 —{' '}
              {t1?.title ?? 'Nível 1'} — nos {porModulo.length} módulos. O
              requisito está cumprido e verificado contra o seu progresso
              real. A emissão do documento em si ainda não existe: não há
              endpoint de certificado no backend, e um botão que não emite
              nada seria pior que esta frase.
            </>
          ) : (
            <>
              O certificado de Nível 1 exige as {totalAulas} aulas da Trilha 1
              concluídas nos {porModulo.length} módulos. Você concluiu{' '}
              {feitas} — {pct}% do caminho, {faltam} aula
              {faltam > 1 ? 's' : ''} restante{faltam > 1 ? 's' : ''}.
            </>
          )}
        </p>

        {/* Barra de requisito: fio, nunca sombra nem raio. */}
        <div
          style={{ height: '3px', background: A2.fioClaroSobreCreme, width: '100%' }}
          role="img"
          aria-label={`${feitas} de ${totalAulas} aulas concluídas`}
        >
          <div
            style={{
              height: '3px',
              width: `${pct}%`,
              background: completo ? A.oliva : A.terracota,
              transition: `width ${AE.estado} ${AE.easing}`,
            }}
          />
        </div>

        {/* Onde exatamente falta — bloqueado/desbloqueado sem contexto não
            diz ao aluno o que fazer a seguir. */}
        <dl style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
          {feitasPorModulo.map((m, i) => (
            <div
              key={m.moduloId}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: AS.md,
                padding: `${AS.xs} 0`,
                borderTop: i > 0 ? `1px solid ${A2.fioClaroSobreCreme}` : 'none',
              }}
            >
              <dt style={{ ...AT.dado, fontSize: '11px', color: A.tintaSuave }}>{m.titulo}</dt>
              <dd
                style={{
                  ...AT.dado,
                  fontSize: '11px',
                  margin: 0,
                  color: m.feitas === m.aulaIds.length ? A.oliva : A2.tintaMetadado,
                }}
              >
                {m.feitas} / {m.aulaIds.length}
              </dd>
            </div>
          ))}
        </dl>
      </Cartela>
    </Secao>
  );
}

/** Cartela tracejada em terracota — o registro que o sistema inteiro usa
 *  para "existe, mas ainda não está disponível". */
function Cartela({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div
      style={{
        border: `1px dashed ${A.terracota}`,
        borderRadius: AR.none,
        padding: AS.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: AS.sm,
      }}
    >
      <span style={{ ...AT.rotulo, color: A.terracota }}>{rotulo}</span>
      {children}
    </div>
  );
}

/** Cabeçalho de seção — rótulo Cinzel sobre fio, o mesmo registro que a
 *  Biblioteca e o Glossário já usam. */
function Secao({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: AS.md }}>
      <span
        style={{
          ...AT.rotulo,
          color: A.terracota,
          paddingBottom: AS.xs,
          borderBottom: `1px solid ${A.fioSobreCreme}`,
        }}
      >
        {rotulo}
      </span>
      {children}
    </section>
  );
}

/** Estado de espera enquanto `/api/auth/me` não respondeu. Monta o shell
 *  inteiro para não haver salto de layout quando a resposta chegar. */
function Carregando() {
  return (
    <AlexandriaShell navAtivo="perfil">
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.sm }}>
        <span style={{ ...AT.rotulo, color: A.terracota }}>Perfil</span>
        <span style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSuave }}>
          Verificando sua sessão…
        </span>
      </div>
    </AlexandriaShell>
  );
}

export default PerfilStub;
