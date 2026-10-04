// ModuloNode — um módulo como nó no caminho de expedição.
//
// Consome os seis primitivos de `public/alexandria/svg/nos-trilha/`,
// criados na Wave 1. Carregamento é fetch + inline, nunca <img>: com
// <img> o CSS do pai não alcança o path e `currentColor` não resolve —
// e é `currentColor` que faz o mesmo primitivo servir sobre creme e
// sobre navy. Lição da Wave 1, não repetida aqui.
//
// Estado → primitivo:
//   bloqueado     lock-body + lock-shackle (fechado)
//   desbloqueado  ring-track + dot-active
//   em-andamento  ring-progress parcial (dashoffset = 1 − fração)
//   concluído     check-mark
//   em-produção   ring-track tracejado, sem ponto, sem número
//
// 'em-produção' e 'bloqueado' NUNCA se parecem: o cadeado é uma forma
// sólida e fechada ("existe, ainda não é sua vez"); o anel tracejado é
// um contorno não preenchido ("ainda não foi gravado").

import { useEffect, useState } from 'react';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';
import type { EstadoModulo, ModuloComEstado } from '@/pages/alexandria/AlexandriaRouter';

const BASE = '/alexandria/svg/nos-trilha';

// Cache de módulo: cada primitivo é buscado uma vez por sessão, não uma
// vez por nó. Uma trilha de 7 módulos renderiza 7 nós e faz 2-3 fetches.
const cache = new Map<string, Promise<string>>();

function carregar(nome: string): Promise<string> {
  const existente = cache.get(nome);
  if (existente) return existente;
  const p = fetch(`${BASE}/${nome}.svg`)
    .then((r) => (r.ok ? r.text() : ''))
    .catch(() => '');
  cache.set(nome, p);
  return p;
}

/** Injeta o markup do primitivo inline. `extra` entra como atributos no
 *  <svg> raiz — é assim que o consumidor controla tamanho e animação sem
 *  tocar o arquivo. */
function Primitivo({
  nome,
  cor,
  tamanho,
  estilo,
}: {
  nome: string;
  cor: string;
  tamanho: number;
  estilo?: React.CSSProperties;
}) {
  const [markup, setMarkup] = useState('');

  useEffect(() => {
    let vivo = true;
    carregar(nome).then((m) => {
      if (vivo) setMarkup(m);
    });
    return () => {
      vivo = false;
    };
  }, [nome]);

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        color: cor,
        width: tamanho,
        height: tamanho,
        display: 'block',
        ...estilo,
      }}
      // O conteúdo vem de arquivo estático próprio do repo, não de entrada
      // de usuário nem de rede terceira.
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

const CORES: Record<EstadoModulo, string> = {
  concluido: A.oliva,
  'em-andamento': A2.terracotaClara,
  desbloqueado: A.tintaSobreCreme,
  bloqueado: A2.tintaMetadado,
  'em-producao': A.terracota,
};

const TAMANHO = 46;

interface ModuloNodeProps {
  item: ModuloComEstado;
  onAbrir: () => void;
}

export function ModuloNode({ item, onAbrir }: ModuloNodeProps) {
  const { modulo, estado, aulasFeitas } = item;
  const cor = CORES[estado];
  const navegavel = estado !== 'bloqueado' && estado !== 'em-producao';

  const fracao =
    estado === 'em-andamento' && modulo.totalAulas && aulasFeitas !== null
      ? aulasFeitas / modulo.totalAulas
      : 0;

  return (
    <button
      type="button"
      onClick={navegavel ? onAbrir : undefined}
      disabled={!navegavel}
      aria-label={`Módulo ${modulo.number} — ${modulo.title}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: AS.lg,
        background: 'none',
        border: 'none',
        borderRadius: AR.none,
        padding: 0,
        font: 'inherit',
        textAlign: 'left',
        cursor: navegavel ? 'pointer' : 'default',
      }}
    >
      {/* Marca do nó. Campo creme opaco atrás para o percurso tracejado
          não atravessar o glifo. */}
      <span
        style={{
          position: 'relative',
          flex: 'none',
          width: TAMANHO,
          height: TAMANHO,
          background: A.cremePapel,
          borderRadius: AR.circulo,
          transition: `color ${AE.estado} ${AE.easing}`,
        }}
      >
        {estado === 'concluido' && (
          <Primitivo nome="check-mark" cor={cor} tamanho={TAMANHO} />
        )}

        {estado === 'desbloqueado' && (
          <>
            <Primitivo nome="ring-track" cor={A.fioSobreCreme} tamanho={TAMANHO} />
            <Primitivo nome="dot-active" cor={cor} tamanho={TAMANHO} />
          </>
        )}

        {estado === 'em-andamento' && (
          <>
            <Primitivo nome="ring-track" cor={A.fioSobreCreme} tamanho={TAMANHO} />
            {/* ring-progress parcial: pathLength=1, então dashoffset é
                literalmente 1 − fração. Rotação de −90° põe o início no
                topo em vez das 3 horas. */}
            <Primitivo
              nome="ring-progress"
              cor={cor}
              tamanho={TAMANHO}
              estilo={{
                strokeDasharray: 1,
                strokeDashoffset: 1 - fracao,
                transform: 'rotate(-90deg)',
                transition: `stroke-dashoffset ${AE.desenhoLongo} ${AE.easing}`,
              }}
            />
          </>
        )}

        {estado === 'bloqueado' && (
          <>
            <Primitivo nome="lock-body" cor={cor} tamanho={TAMANHO} />
            <Primitivo nome="lock-shackle" cor={cor} tamanho={TAMANHO} />
          </>
        )}

        {estado === 'em-producao' && (
          // Contorno tracejado — não gravado ainda. Distinto do cadeado
          // sólido de 'bloqueado' por forma, não só por cor.
          <Primitivo
            nome="ring-track"
            cor={cor}
            tamanho={TAMANHO}
            estilo={{ strokeDasharray: '0.04 0.04' }}
          />
        )}
      </span>

      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
        <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>
          Módulo {modulo.number} de {modulo.totalInTrilha}
        </span>

        <span
          style={{
            ...AT.h3,
            color: estado === 'bloqueado' ? A2.tintaMetadado : A.tintaSobreCreme,
            letterSpacing: '0.06em',
          }}
        >
          {modulo.title}
        </span>

        <span style={{ ...AT.dado, fontSize: '12px', color: rotuloCor(estado) }}>
          {rotuloEstado(item)}
        </span>
      </span>
    </button>
  );
}

function rotuloCor(estado: EstadoModulo): string {
  if (estado === 'em-producao') return A.terracota;
  if (estado === 'concluido') return A.oliva;
  if (estado === 'em-andamento') return A2.terracotaClara;
  return A.tintaSuave;
}

/** Nunca imprime número onde `totalAulas` é null. */
function rotuloEstado({ modulo, estado, aulasFeitas }: ModuloComEstado): string {
  switch (estado) {
    case 'em-producao':
      return 'Em produção · conteúdo ainda não escrito';
    case 'concluido':
      return `Concluído · ${modulo.totalAulas} aulas`;
    case 'em-andamento':
      return `Aula ${(aulasFeitas ?? 0) + 1} de ${modulo.totalAulas}`;
    case 'desbloqueado':
      return `${modulo.totalAulas} aulas · comece aqui`;
    case 'bloqueado':
      return `${modulo.totalAulas} aulas · conclua o módulo anterior`;
  }
}

export default ModuloNode;
