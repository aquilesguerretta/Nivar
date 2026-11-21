// FaixaIndependencia — ARCHITECT, Portal BR Wave 4.
// Wave 5: sistema visual NIVAR nos dois modos — as três colunas e a
// copy não mudam; só apresentação.
//
// A versão de negação da Wave 1 foi REJEITADA na revisão de design
// (spec §4): a seção não podia ser uma lista do que a plataforma não
// faz. Esta é a versão AFIRMATIVA — escrita pelo implementador sob a
// autorização aberta da Wave 4.
//
// COPY SUJEITA A VETO DO AQUILES. Três compromissos, todos afirmação:
// a análise é o produto, o dado tem origem citada, a remuneração vem
// de quem lê. Nenhuma promessa de economia — regra do projeto.

import type { CSSProperties } from 'react';

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
    fontWeight: 500,
    fontSize: '10.5px',
    lineHeight: 1.5,
    letterSpacing: '0.06em',
    fontVariantNumeric: 'tabular-nums lining-nums',
  } satisfies CSSProperties,
  display3: {
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-display)' as CSSProperties['fontWeight'],
    fontSize: 'var(--ts-display-3)',
    lineHeight: 'var(--lh-display-3)' as CSSProperties['lineHeight'],
    letterSpacing: 'var(--tr-display-3)',
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

interface Compromisso {
  id: string;
  titulo: string;
  detalhe: string;
}

const COMPROMISSOS: Compromisso[] = [
  {
    id: 'analise-e-o-produto',
    titulo: 'A análise é o produto',
    detalhe:
      'A única receita da NIVAR é o trabalho analítico entregue a quem o contrata — relatório, diagnóstico e formação.',
  },
  {
    id: 'dado-com-origem',
    titulo: 'Todo dado tem origem citada',
    detalhe:
      'ONS, ANEEL, CCEE, EPE e IBGE aparecem nomeados onde o dado aparece; o que é estimativa vem marcado como estimativa.',
  },
  {
    id: 'remuneracao-de-quem-le',
    titulo: 'A remuneração vem de quem lê',
    detalhe:
      'Quem paga pela análise é quem a recebe. É isso que mantém a leitura do mercado limpa de interesse de venda.',
  },
];

export function FaixaIndependencia() {
  return (
    <section
      aria-labelledby="br-independencia"
      style={{
        // Teto de espaçamento do sistema: 32px, inclusive entre seções.
        padding: '32px 0',
        borderTop: 'var(--fio) solid var(--rule)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Cabeçalho de seção do sistema: número mono em acento ·
            etiqueta · fio até a margem. */}
        {/* 02→…→06 (revisões pós-Wave 6): prévia do terminal, método,
            destinos, Alexandria e conflito entram antes desta; a
            numeração desloca. As três colunas seguem intocadas. */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
          <span style={{ ...NT.proc, color: 'var(--accent-house)' }}>06</span>
          <span style={{ ...NT.etiqueta, color: 'var(--text-strong)' }} id="br-independencia">
            Independência
          </span>
          <span
            aria-hidden="true"
            style={{ flex: 1, borderTop: 'var(--fio) solid var(--rule)', alignSelf: 'center' }}
          />
        </div>
        <h2 style={{ ...NT.display3, margin: 0, color: 'var(--text-strong)' }}>
          A análise é o produto inteiro.
        </h2>
      </div>

      {/* Só fios horizontais: a borda vertical por índice da primeira
          versão flutuava ao envelopar em viewport estreito (achado da
          revisão). Colunas separam-se por respiro; quebra limpa em
          qualquer largura, primeira coluna sempre alinhada ao título. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          columnGap: '32px',
          rowGap: '24px',
          borderTop: 'var(--fio) solid var(--rule)',
          borderBottom: 'var(--fio) solid var(--rule)',
          padding: '20px 0 24px',
        }}
      >
        {COMPROMISSOS.map((c) => (
          <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ ...NT.titulo2, margin: 0, color: 'var(--text-strong)' }}>{c.titulo}</h3>
            <p style={{ ...NT.corpo, margin: 0, color: 'var(--text-muted)' }}>{c.detalhe}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaixaIndependencia;
