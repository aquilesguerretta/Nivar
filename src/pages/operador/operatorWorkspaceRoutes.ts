export const operatorWorkspaceEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ARIADNE_CLOSE_DEV === "1";

export const operatorPlanningEnabled =
  operatorWorkspaceEnabled && import.meta.env.VITE_ARIADNE_PLAN_DEV === "1";

export const operatorFamiliesPath = "/operador/familias";
export const closeDeskPath = "/operador/ariadne/fechamento";
export const planningPath = "/operador/ariadne/planejamento";
