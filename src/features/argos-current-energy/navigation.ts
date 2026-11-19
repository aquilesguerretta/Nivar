import { timeline } from "./case.ts";
import type { TimelineKey } from "./case.ts";

export const steps = {
  evento: "China adota controles de exportação de terras raras",
  documento: "Anúncio 18/2025 · Original em chinês",
  material: "NdFeB com disprósio",
  aplicacao: "Motores e geradores de ímã permanente",
  china: "China",
} as const;

type Step = keyof typeof steps;
type LaterAction = Exclude<TimelineKey, "april">;
export type Context = Step | `cronologia/${LaterAction}`;

export type View =
  | { kind: "step"; context: Step }
  | { kind: "action"; context: `cronologia/${LaterAction}`; action: LaterAction }
  | { kind: "evidence"; origin: Context }
  | { kind: "unavailable" };

function viewForContext(path: string) {
  if (Object.hasOwn(steps, path)) return { kind: "step", context: path as Step } as const;
  const action = path.slice("cronologia/".length);
  if (path.startsWith("cronologia/") && action !== "april" && Object.hasOwn(timeline, action)) {
    return { kind: "action", context: path as `cronologia/${LaterAction}`, action: action as LaterAction } as const;
  }
}

export function readView(hash: string): View {
  const path = hash.slice(1);
  if (!path) return { kind: "step", context: "evento" };
  if (path.startsWith("evidencias/")) {
    const origin = viewForContext(path.slice("evidencias/".length));
    return origin ? { kind: "evidence", origin: origin.context } : { kind: "unavailable" };
  }
  return viewForContext(path) ?? { kind: "unavailable" };
}

export function actionContext(action: TimelineKey): Context {
  return action === "april" ? "documento" : `cronologia/${action}`;
}