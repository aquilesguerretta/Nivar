/** URL context is a locator, never authority; the existing API checks ownership. */
export const reviewDeskPath = "/operador/ariadne/fechamento";
export const planningPath = "/operador/ariadne/planejamento";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function ariadneWorkspaceLinks(pathname: string, search: string) {
  const query = new URLSearchParams(search);
  const planning = pathname.replace(/\/$/, "") === planningPath;
  const review = pathname.replace(/\/$/, "") === reviewDeskPath;
  const workspace = query.get("workspace") || "";
  const reviewId = query.get("review") || "";
  const baseline = query.get(planning ? "baseline" : "result") || "";
  if (
    (!planning && !review) ||
    ![workspace, reviewId, baseline].every((id) => uuid.test(id))
  )
    return { review: reviewDeskPath, planning: planningPath };

  const context = { workspace, review: reviewId };
  return {
    // Same-screen links keep the exact URL: no remount/reset of unsaved exploration.
    review: review
      ? reviewDeskPath + search
      : reviewDeskPath +
        "?" +
        new URLSearchParams({ ...context, result: baseline }),
    planning: planning
      ? planningPath + search
      : planningPath + "?" + new URLSearchParams({ ...context, baseline }),
  };
}
