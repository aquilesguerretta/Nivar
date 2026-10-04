import type { CSSProperties } from "react";
import type { PedidoNaFila } from "../../lib/operador/mock";

const sans = {
  fontFamily: "var(--g2-sans)",
  fontSize: "14px",
  lineHeight: 1.5,
} satisfies CSSProperties;
const mono = {
  fontFamily: "var(--g2-mono)",
  fontSize: "11px",
  lineHeight: 1.5,
} satisfies CSSProperties;

export const CT = {
  display: {
    fontFamily: "var(--g2-serif)",
    fontSize: "38px",
    lineHeight: 1.1,
  } satisfies CSSProperties,
  nome: sans,
  lede: sans,
  corpo: sans,
  corpoLeve: sans,
  eyebrow: mono,
  dado: mono,
  heroi: { ...mono, fontSize: "40px" },
};
export const RESPIRO_LATERAL = "32px";
export function comTransicao(change: () => void) {
  change();
}

export function estadoDoPedido(p: PedidoNaFila) {
  return p.status === "submitted"
    ? "Aguardando leitura"
    : p.status === "ready"
      ? "Entregue"
      : "Estado não informado";
}
