// src/design/jaguar-tokens.ts
// GridAlpha Brasil — Jaguar Design System
// Portal e demais superfícies claras do lado brasileiro.
// Alexandria mantém seu próprio sistema (ver alexandria-onboarding-claude-code.md)
// — não importar daqui.

export const J = {
  // ─── PAPEL (4-tier elevation, claro) ──────────────────────────────
  // Mesma lógica de elevação por tom de papel que a Alexandria usa —
  // parentesco estrutural deliberado, valores próprios.
  papelBase:     '#F1EEE4',
  papelRaised:   '#F7F5EF',   // levemente mais claro — cards, superfícies elevadas
  papelSunken:   '#E3DDCC',   // levemente mais fundo — inputs, áreas recuadas
  papelOverlay:  '#EDE9DC',   // modais, popover

  // ─── TINTA (texto) ─────────────────────────────────────────────────
  tintaPrimaria:   '#1C140D',
  tintaSecundaria: 'rgba(28,20,13,0.60)',
  tintaMuted:      'rgba(28,20,13,0.35)',
  tintaInversa:    '#F1EEE4',   // texto sobre acento sólido

  // ─── ACENTO — ocre de pelagem, não bandeira nem bioma ─────────────
  acenteOcre:      '#C17D1F',
  acenteOcreLight: '#D99A3F',   // hover
  acenteOcreWash:  'rgba(193,125,31,0.10)',   // fundo sutil, badge, chip
  // Tom escuro do MESMO ocre, para TEXTO — fecha a pendência registrada
  // nas Waves 2 e 3: #C17D1F fica em ~2,7-3,1:1 sobre os papéis e falha
  // AA em qualquer tamanho. Este passa 4,5:1 sobre papelBase (5,09),
  // papelRaised (5,42) e papelOverlay (4,86); sobre papelSunken fica em
  // 4,35 — ali, só texto grande (≥24px / 18.66px bold) ou tinta.
  acenteOcreEscuro: '#8A5A16',

  // ─── BORDAS — fio de 1px, mesma disciplina do sistema inteiro ────
  bordaDefault: 'rgba(28,20,13,0.12)',
  bordaStrong:  'rgba(28,20,13,0.20)',
  bordaAcento:  'rgba(193,125,31,0.35)',
} as const;

export const JF = {
  sans: "'Geist Sans', 'Inter', system-ui, sans-serif",
  mono: "'Geist Mono', 'Fira Code', monospace",
  // Sem terceira fonte de exibição — a distinção fica na cor e na
  // densidade da composição, não em tipografia emprestada.
} as const;

// ─── ESCALA TIPOGRÁFICA (Wave 3) ─────────────────────────────────────
// Mesmo espírito estrutural do AT da Alexandria (papéis nomeados, não
// números soltos), valores próprios do Jaguar — sistemas de família,
// nunca idênticos.
//
// Pisos do sistema, auditados contra o render da Wave 2:
//   · nenhum texto de interface abaixo de 13px (a Wave 2 tinha rótulo
//     de 10px e nav de 11px — ambos sobem);
//   · nenhum corpo de parágrafo abaixo de 17px (era 15px no hero e
//     13px nos cards);
//   · dado numérico ao vivo lê como protagonista — dadoDestaque é
//     tamanho de manchete, não de legenda (era 52px).
export const JT = {
  h1: {
    fontFamily: JF.sans,
    fontSize: '56px',
    lineHeight: 1.06,
    letterSpacing: '-0.025em',
    fontWeight: 500,
  },
  h2: {
    fontFamily: JF.sans,
    fontSize: '26px',
    lineHeight: 1.2,
    letterSpacing: '-0.015em',
    fontWeight: 500,
  },
  h3: {
    fontFamily: JF.sans,
    fontSize: '18px',
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
    fontWeight: 500,
  },
  corpo: {
    fontFamily: JF.sans,
    fontSize: '17px',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  nav: {
    fontFamily: JF.sans,
    fontSize: '13px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  // Rótulo mono: 13px pede tracking menor que os 0.18-0.20em que a
  // Wave 2 usava em 10px — em 13px aquele tracking vira arame farpado.
  rotulo: {
    fontFamily: JF.mono,
    fontSize: '13px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
  },
  dadoDestaque: {
    fontFamily: JF.mono,
    fontSize: '84px',
    lineHeight: 1,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  dadoRegional: {
    fontFamily: JF.mono,
    fontSize: '20px',
    lineHeight: 1,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums' as const,
  },
} as const;
