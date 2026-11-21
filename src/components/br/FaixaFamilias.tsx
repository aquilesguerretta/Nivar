// FaixaFamilias — ARCHITECT, Portal BR Wave 8.
//
// Substitui a grade de cinco cards de PRODUTO pela faixa de cinco
// FAMÍLIAS COMERCIAIS. A casa marca a família, não o produto — o
// design system declara isso na tabela de arquitetura de marca, e a
// superfície pública passa a refletir a mesma estrutura.
//
// ─── SEGUNDA EXCEÇÃO DECLARADA AO "NUNCA ESCALA EM HOVER" ────────────
// O sistema proíbe animar escala em elemento de interface; a única
// exceção até aqui era o loader da marca (transform SÓ na marca). Esta
// é a SEGUNDA, autorizada pelo Aquiles: o item da faixa cresce no
// hover. Não é bug nem descuido — é decisão de produto, registrada no
// fechamento da wave. Continua compositor-safe (só `transform`, nunca
// `width`/`top`), continua sem sombra e sem raio, e colapsa junto com
// os tokens sob `prefers-reduced-motion`.
//
// ─── A COR DA FAMÍLIA É FIO, NUNCA TEXTO ─────────────────────────────
// A tabela de contraste do sistema é literal: advisory lê 1,9:1 e
// intelligence 1,4:1 sobre papel — "advisory e intelligence nunca são
// cor de texto sobre papel", e "um número grande em amarelo sobre fundo
// claro é o erro mais fácil de cometer neste sistema". Por isso a cor
// de família aparece SÓ como fio de acento e marcador; o texto fica em
// --text-strong nos cinco. Uniforme por disciplina, não por preguiça:
// colorir só os três que passam faria a faixa parecer três famílias
// destacadas e duas apagadas.
//
// ─── HOVER NÃO É O ÚNICO CAMINHO ─────────────────────────────────────
// Cada item é um <Link> real para a rota da família. Teclado revela a
// prévia por foco; toque, que não tem hover, navega direto. A prévia é
// enriquecimento, nunca o único jeito de chegar na página.

import { useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

import {
  FAMILIAS_BR,
  produtosDaFamilia,
  rotaDaFamilia,
  type FamiliaBR,
} from '../../lib/data/br-familias';

// Papéis tipográficos NIVAR — valores nos tokens CSS (ver PortalBR).
const NT = {
  etiqueta: {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: 'var(--ts-etiqueta)',
    lineHeight: 'var(--lh-etiqueta)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-etiqueta)',
    textTransform: 'uppercase',
  } satisfies CSSProperties,
  proc: {
    fontFamily: 'var(--font-data)',
    fontWeight: 400,
    fontSize: '10.5px',
    lineHeight: 1.5,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontVariantNumeric: 'tabular-nums lining-nums',
  } satisfies CSSProperties,
  titulo2: {
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-display)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-titulo-2)',
    lineHeight: 'var(--lh-titulo-2)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-titulo-2)',
  } satisfies CSSProperties,
  corpo: {
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-corpo)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-corpo)',
    lineHeight: 'var(--lh-corpo)' as CSSProperties['lineHeight'],
  } satisfies CSSProperties,
} as const;

/** Mesma técnica de transição de clique do resto do Portal — duplicada
 *  de propósito (componente não importa de página). Reduced-motion pula
 *  a transição por inteiro. */
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

export function FaixaFamilias() {
  const [ativa, setAtiva] = useState<string | null>(null);
  const navigate = useNavigate();

  const familiaAtiva: FamiliaBR | null =
    FAMILIAS_BR.find((f) => f.id === ativa) ?? null;
  const produtosAtivos = familiaAtiva ? produtosDaFamilia(familiaAtiva) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* A faixa — grade de fio colapsado, na ordem da escala de
          incandescência (hardware → intelligence, do mais frio ao mais
          quente). A faixa inteira lê como o gradiente da casa. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          border: 'var(--fio) solid var(--rule)',
        }}
        onMouseLeave={() => setAtiva(null)}
      >
        {FAMILIAS_BR.map((f, i) => {
          const viva = ativa === f.id;
          const produtos = produtosDaFamilia(f);
          const abertos = produtos.filter((p) => p.status === 'disponivel').length;
          return (
            <Link
              key={f.id}
              to={rotaDaFamilia(f.id)}
              onMouseEnter={() => setAtiva(f.id)}
              onFocus={() => setAtiva(f.id)}
              onBlur={() => setAtiva(null)}
              onClick={(e) => {
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                comTransicao(() => navigate(rotaDaFamilia(f.id)));
              }}
              style={{
                position: 'relative',
                zIndex: viva ? 2 : 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '18px 16px 20px',
                textDecoration: 'none',
                borderRadius: 0,
                // Fio de acento de 2px no topo, na cor REAL da família.
                borderTop: `2px solid ${viva ? f.hex : 'transparent'}`,
                borderLeft: i > 0 ? 'var(--fio) solid var(--rule)' : 'none',
                background: 'var(--surface-page)',
                // A EXCEÇÃO: escala em hover. Compositor-safe, sem
                // sombra, sem mudança de posição de layout.
                transform: viva ? 'scale(1.045)' : 'scale(1)',
                transition:
                  'transform var(--dur-hover) var(--ease), border-color var(--dur-hover) var(--ease)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Marcador na cor da família — quadrado de 9px, raio
                    zero, o mesmo tratamento da amostra de legenda do
                    sistema para marca de barra. */}
                <span
                  aria-hidden="true"
                  style={{
                    width: '9px',
                    height: '9px',
                    flexShrink: 0,
                    background: f.hex,
                  }}
                />
                <span style={{ ...NT.titulo2, color: 'var(--text-strong)' }}>{f.nome}</span>
              </span>
              <span style={{ ...NT.proc, color: 'var(--text-muted)' }}>{f.dominio}</span>
              <span
                style={{
                  ...NT.proc,
                  color: 'var(--text-faint)',
                  marginTop: 'auto',
                  paddingTop: '8px',
                }}
              >
                {produtos.length === 0
                  ? 'nenhum produto catalogado'
                  : `${produtos.length} produto${produtos.length > 1 ? 's' : ''} · ${
                      abertos > 0 ? `${abertos} aberto` : 'em construção'
                    }`}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Prévia — painel abaixo da faixa. A ALTURA É RESERVADA nos dois
          estados para o conteúdo seguinte nunca pular quando o cursor
          entra e sai; o que muda é opacidade e texto, nunca layout. */}
      <div
        aria-live="polite"
        style={{
          minHeight: '108px',
          borderLeft: 'var(--fio) solid var(--rule)',
          borderRight: 'var(--fio) solid var(--rule)',
          borderBottom: 'var(--fio) solid var(--rule)',
          // Fio superior na cor da família ativa — o acento continua
          // da faixa para a prévia, ligando os dois.
          borderTop: `2px solid ${familiaAtiva ? familiaAtiva.hex : 'transparent'}`,
          padding: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
          transition: 'border-color var(--dur-hover) var(--ease)',
        }}
      >
        {familiaAtiva ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxWidth: '62ch',
              }}
            >
              <span style={{ ...NT.etiqueta, color: 'var(--text-strong)' }}>
                {familiaAtiva.nome}
              </span>
              <p style={{ ...NT.corpo, margin: 0, color: 'var(--text-muted)' }}>
                {familiaAtiva.paragrafo}
              </p>
              {/* Um produto por span, separados por gap real — `join`
                  com espaços não serve: o HTML colapsa whitespace e os
                  dois produtos de Advisory colavam ("em construção
                  Diagnóstico"). Achado no render, não na leitura. */}
              {produtosAtivos.length > 0 && (
                <span
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px 20px',
                    ...NT.proc,
                    color: 'var(--text-faint)',
                  }}
                >
                  {produtosAtivos.map((p) => (
                    <span key={p.id} style={{ whiteSpace: 'nowrap' }}>
                      {p.titulo} · {p.status === 'disponivel' ? 'aberto' : 'em construção'}
                    </span>
                  ))}
                </span>
              )}
            </div>
            <Link
              className="nv-btn nv-btn--secundario"
              to={rotaDaFamilia(familiaAtiva.id)}
              onClick={(e) => {
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                comTransicao(() => navigate(rotaDaFamilia(familiaAtiva.id)));
              }}
            >
              Ver página completa
              <span className="nv-btn__glifo" aria-hidden="true">
                →
              </span>
            </Link>
          </>
        ) : (
          <span style={{ ...NT.proc, color: 'var(--text-faint)' }}>
            Aponte uma família para a prévia · cada uma tem página própria
          </span>
        )}
      </div>
    </div>
  );
}

export default FaixaFamilias;
