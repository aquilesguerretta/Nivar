// Synthetic violations for the `alexandria-*` rule family.
// Not shipped: this directory is never a scan root in CI. Run it with
//   node bin/gridalpha-detect.mjs fixtures --no-fail-on-p0
// after touching any alexandria-* rule. Every numbered block below must
// produce exactly the finding named in its comment; the CLEAN blocks at
// the bottom must produce nothing.

import { A, AR, AS } from '@/design/alexandria-tokens';

// 1 — alexandria-no-internal-vocabulary: JSX text
export function V1() { return <p>§ 00 · destaque da EXTRAÇÃO</p>; }

// 2 — alexandria-no-internal-vocabulary: label attribute
export function V2() { return <button aria-label="Abrir o § Lab do módulo" />; }

// 3 — alexandria-no-internal-vocabulary: content literal + dead brand
export const V3 = { marcador: '§ MAP', eyebrow: 'Alexandria · GridAlpha · Módulo 04' };

// 4 — alexandria-no-internal-vocabulary: pipeline words
export const V4 = { texto: 'o backend desta wave ainda usa mock; a fonte declara 12 aulas confirmadas' };

// 5 — alexandria-materialidade: sombra
export function V5() { return <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />; }

// 6 — alexandria-materialidade: raio fora de {0, 50%}
export function V6() { return <div style={{ borderRadius: 12 }} />; }

// 7 — alexandria-materialidade: pílula 9999 não é círculo pleno
export function V7() { return <span style={{ borderRadius: 9999, background: A.navy }}>rótulo</span>; }

// 8 — alexandria-materialidade: gradiente de cor
export function V8() { return <div style={{ background: 'linear-gradient(180deg, #F5EFE1 0%, #1B2A3A 100%)' }} />; }

// 9 — alexandria-materialidade: Tailwind rounded-*
export function V9() { return <div className="rounded-lg" />; }

// 10 — alexandria-no-native-range
export function V10() { return <input type="range" min={0} max={10} style={{ accentColor: A.terracota }} />; }

// 11 — alexandria-no-form-circle: avatar com inicial
export function V11({ nome }: { nome: string }) {
  return <span style={{ borderRadius: '50%', background: A.navy, width: 32, height: 32 }}>{nome[0]}</span>;
}

// 12 — alexandria-no-form-circle: bolha de passo
export function V12() { return <div style={{ borderRadius: AR.circulo, backgroundColor: A.terracota }}>3</div>; }

// 13 — alexandria-no-default-control-box
export function V13() { return <button style={{ border: `1px solid ${A.fioSobreCreme}`, padding: AS.sm }}>Registrar</button>; }

// ── CLEAN: nothing below may produce a finding ─────────────────────

// Comentário técnico: a GridAlpha extraiu isto do HTML na wave 3, § 00. (P24)
const SECAO_RX = /^(§\s?[0-9A-Za-z.]+)/;              // regex, não é texto
import type { Mock } from './mock-types';              // import, não é texto
export const C1 = { id: 'm01-sec-00', kind: 'mock', href: '/§ Lab' };
export function C2() { return <div style={{ borderRadius: AR.none, border: `1px solid ${A.fioSobreCreme}` }} />; }
export function C3() { return <div style={{ borderRadius: '50%', width: 9, height: 9, background: A.navy }} />; }
export function C4() { return <div style={{ backgroundImage: `linear-gradient(${A.navy} 0 0)` }} />; }
export function C5() { return <div style={{ backgroundImage: `repeating-linear-gradient(45deg, ${A.fioSobreCreme} 0 1px, transparent 1px 6px)` }} />; }
const MASCARA = 'radial-gradient(75% 82% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)';
export function C6() { return <div style={{ WebkitMaskImage: MASCARA, maskImage: MASCARA }} />; }
export function C7() { return <input type="range" data-tratamento="trilho-alexandria" />; }
export function C8() { return <button data-moldura="ficha" style={{ border: `1px solid ${A.fioSobreCreme}` }}>x</button>; }
export function C9() { return <button style={{ borderBottom: `1px solid ${A.fioSobreCreme}`, border: 'none' }}>Seguir</button>; }
export function C10() { return <button style={{ borderRadius: '50%', background: A.navy }} aria-label="Abrir o módulo 01" />; }
void SECAO_RX; void C1; void MASCARA;
export type M = Mock;
