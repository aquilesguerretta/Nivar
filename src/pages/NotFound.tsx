// NotFound — ARCHITECT, Portal Debt Wave 1 · Fase 3.
//
// A primeira página de erro REAL do app. Até esta wave os três
// catch-all devolviam 200 com o Portal ou com o Hub, em silêncio:
// endereço errado e endereço certo ficavam indistinguíveis.
//
// PRECEDENTE MEDIDO, E ONDE ELE PARA (Fase 1,
// `docs/architect-portal-debt-audit.md` §2). O design system tem
// `components/errors/ErrorState` — 5 arquivos, no pacote da skill
// `NIVAR Design System`. Duas coisas medidas ali mudam o que dá para
// reusar:
//
//  1. É pacote de SKILL, não de produção. O espelho em
//     `src/design/nivar/` tem só arquivos de variável; não existe
//     `ErrorState` importável em `src/`. Herda-se a LINGUAGEM, não o
//     import.
//  2. A semântica dele é FALHA DE FONTE DE DADO, não rota inexistente.
//     `ErrorState.d.ts` declara `fonte` ("fonte que falhou") e
//     `ultimaApuracao` ("última apuração bem-sucedida") obrigatórias, e
//     o `prompt.md` diz que as duas linhas são o que "separa uma falha
//     honesta de um dado silenciosamente errado". Um 404 de rota não
//     tem nem uma nem outra. Preencher os dois campos aqui seria
//     FABRICAR PROCEDÊNCIA — exatamente o que a doutrina proíbe.
//
// O que se herda de `.nv-erro`, verbatim na estrutura: fio de 2px em
// `--advisory` no topo (NUNCA vermelho de UI — neste sistema cor é
// temperatura, não severidade), etiqueta mono versalete com o glifo △
// (conjunto fechado de glifos), título display, corpo, e a linha
// chave-valor com fio de guia. Zero raio, zero sombra, zero bitmap
// decorativo. Dois modos desde o primeiro commit — `--advisory`,
// `--rule` e a família `--text-*` remapeiam sozinhas sob
// `[data-mode="noturno"]`.
//
// O DADO HONESTO que um 404 tem para pôr na linha chave-valor é o
// PRÓPRIO ENDEREÇO PEDIDO. É real, é medido, e é o que o leitor precisa
// para saber se errou de link ou se o link é que está velho. Não há
// segundo dado, e nenhum foi inventado para preencher a segunda linha.
//
// SUPERFÍCIE DELIBERADAMENTE ESPARSA. O sistema pede 40–60 elementos
// por tela; esta tela tem uma dúzia. Não é descuido: um 404 que enche a
// página de conteúdo para bater densidade estaria inventando conteúdo.
// A densidade é regra para superfície de trabalho, não para saída de
// erro.
//
// `role="alert"` do ErrorState NÃO foi copiado, de propósito: lá o
// estado aparece DENTRO de uma página já carregada, e o leitor de tela
// precisa ser interrompido. Aqui a rota inteira é a mensagem, e quem a
// anuncia é o `<title>` mais o `<h1>` — pôr um alert por cima disso
// duplicaria o anúncio.
//
// `noindex` POR EFEITO. O rewrite `/(.*) → /index.html` do
// `vercel.json` faz o servidor responder 200 para qualquer endereço; um
// SPA estático não tem como devolver status 404. A meta `robots` é o
// que resta para o buscador não indexar endereço inexistente — entra na
// montagem e sai na desmontagem, como o `document.title`.
//
// A CAIXA DA ALEXANDRIA NÃO É DAQUI. `AlexandriaRouter.tsx:194` tem o
// terceiro catch-all e ficou intocado: é posse do LYCEUM, e a
// Alexandria fala navy sobre pergaminho. A restrição de linguagem para
// quem o construir está em `docs/pendencias-alexandria.md` §4.

import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

// Tokens NIVAR — só arquivos de VARIÁVEL, como toda superfície do
// Portal. `base.css` fica de fora: restila elemento global e vazaria
// para o lado americano e para a Alexandria.
import '../design/nivar/fonts.css';
import '../design/nivar/colors.css';
import '../design/nivar/typography.css';
import '../design/nivar/space.css';
import '../design/nivar/motion.css';

import { FOLHA_PORTAL, WordmarkNivar } from '../components/br/portalChrome';

const MEDIDA = '1200px';
const RESPIRO_LATERAL = '32px';

// Papéis tipográficos — mesma convenção das outras páginas do Portal:
// cada superfície declara os que usa, referenciando var(), nunca
// literal de escala. Importar de outra página criaria ciclo.
const NT = {
  etiqueta: {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: 'var(--ts-etiqueta)',
    lineHeight: 'var(--lh-etiqueta)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-etiqueta)',
    textTransform: 'uppercase',
  } satisfies CSSProperties,
  display3: {
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-display)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-display-3)',
    lineHeight: 'var(--lh-display-3)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-display-3)',
  } satisfies CSSProperties,
  corpo: {
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-corpo)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-corpo)',
    lineHeight: 'var(--lh-corpo)' as CSSProperties['lineHeight'],
  } satisfies CSSProperties,
} as const;

/** startViewTransition com checagem de suporte — mesmo helper das
 *  outras páginas do Portal. Reduced-motion pula a transição. */
function comTransicao(mudanca: () => void) {
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduzido && 'startViewTransition' in document) {
    document.startViewTransition(() => {
      flushSync(mudanca);
    });
  } else {
    mudanca();
  }
}

export function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [modo, setModo] = useState<'claro' | 'noturno'>('claro');

  // O endereço pedido, com query se houver — é o único dado real que
  // esta tela tem, e é o que a linha de baixo mostra.
  const endereco = `${location.pathname}${location.search}`;

  useEffect(() => {
    const anterior = document.title;
    document.title = 'NIVAR — Endereço não encontrado';
    return () => {
      document.title = anterior;
    };
  }, []);

  // Ver nota de cabeçalho: o SPA estático responde 200 a qualquer
  // endereço; a meta é o que impede o buscador de indexar o que não
  // existe. Removida na desmontagem para não contaminar a próxima rota.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, []);

  function ir(destino: string) {
    return (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      comTransicao(() => navigate(destino));
    };
  }

  return (
    <div
      lang="pt-BR"
      data-nv-page=""
      data-mode={modo === 'noturno' ? 'noturno' : undefined}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-page)',
        color: 'var(--text-body)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--ts-corpo)',
        lineHeight: 'var(--lh-corpo)',
        borderRadius: 0,
      }}
    >
      <style>{FOLHA_PORTAL}</style>
      <style>{`
        /* Linguagem do .nv-erro do sistema (components/errors/errors.css),
           no subconjunto que um 404 de rota pode usar com honestidade.
           A classe é 'nf-' e não 'nv-erro' porque o componente do
           sistema exige fonte e apuração, que aqui não existem — herdar
           o nome faria a folha do sistema, quando ela chegar à produção,
           reivindicar um elemento que não cumpre o contrato dela. */
        .nf-erro{display:grid;align-content:start;gap:10px;padding:16px 0 20px;border-top:var(--fio-forte) solid var(--advisory);max-width:60ch}
        .nf-erro__eti{display:flex;align-items:baseline;gap:7px;font-family:var(--font-data);font-weight:500;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--advisory)}
        .nf-erro__linha{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:baseline;padding-top:8px;border-top:var(--fio) solid var(--rule)}
        .nf-erro__k{font-family:var(--font-data);font-weight:500;font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--text-faint);white-space:nowrap}
        .nf-erro__fio{height:1px;background:var(--rule);transform:translateY(-3px)}
        /* O endereço pode ser longo e arbitrário — quebra em qualquer
           ponto em vez de estourar a medida. */
        .nf-erro__v{font-family:var(--font-data);font-weight:500;font-size:11.5px;letter-spacing:.04em;color:var(--text-strong);font-variant-numeric:tabular-nums;text-align:right;overflow-wrap:anywhere;min-width:0}
        .nf-erro__acoes{display:flex;flex-wrap:wrap;gap:16px;align-items:center;padding-top:10px}
      `}</style>

      <header
        style={{
          flexShrink: 0,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          padding: `0 ${RESPIRO_LATERAL}`,
          borderBottom: 'var(--fio) solid var(--rule)',
          background: 'var(--surface-page)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/br"
            aria-label="NIVAR — voltar ao Portal Brasil"
            onClick={ir('/br')}
            style={{ display: 'inline-flex', textDecoration: 'none', border: 'none' }}
          >
            <WordmarkNivar altura={30} idSufixo="nf-cabecalho" />
          </Link>
          <span
            aria-hidden="true"
            style={{ width: '1px', height: '14px', background: 'var(--rule)' }}
          />
          <span style={{ ...NT.etiqueta, color: 'var(--text-muted)' }}>
            Endereço não encontrado
          </span>
        </div>
        <div className="nv-modo" role="group" aria-label="Modo de exibição">
          <button
            type="button"
            className={`nv-modo__op${modo === 'claro' ? ' nv-modo__op--ativo' : ''}`}
            aria-pressed={modo === 'claro'}
            onClick={() => setModo('claro')}
          >
            claro
          </button>
          <span className="nv-modo__sep" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className={`nv-modo__op${modo === 'noturno' ? ' nv-modo__op--ativo' : ''}`}
            aria-pressed={modo === 'noturno'}
            onClick={() => setModo('noturno')}
          >
            noturno
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: MEDIDA,
          margin: '0 auto',
          padding: `56px ${RESPIRO_LATERAL} 64px`,
        }}
      >
        <div className="nf-erro">
          <span className="nf-erro__eti">
            <i aria-hidden="true" style={{ fontStyle: 'normal' }}>
              △
            </i>
            Endereço não encontrado
          </span>

          <h1 style={{ ...NT.display3, margin: 0, color: 'var(--text-strong)' }}>
            Este endereço não existe na plataforma.
          </h1>

          <p style={{ ...NT.corpo, margin: 0, color: 'var(--text-muted)' }}>
            Nada foi carregado no lugar dele. Pode ser link antigo, endereço
            digitado com um caractere a mais, ou página que ainda não existe —
            a plataforma abre em sequência, e boa parte dos destinos ainda está
            por vir.
          </p>

          <p className="nf-erro__linha">
            <span className="nf-erro__k">Endereço pedido</span>
            <span className="nf-erro__fio" aria-hidden="true" />
            <span className="nf-erro__v">{endereco}</span>
          </p>

          <div className="nf-erro__acoes">
            <Link className="nv-btn nv-btn--primario" to="/br" onClick={ir('/br')}>
              <span className="nv-btn__glifo" aria-hidden="true">
                ←
              </span>
              Portal Brasil
            </Link>
            <Link
              className="nv-btn nv-btn--secundario"
              to="/alexandria"
              onClick={ir('/alexandria')}
            >
              Alexandria
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
