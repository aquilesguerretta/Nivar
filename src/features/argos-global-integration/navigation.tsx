import { Link, useLocation, type LinkProps } from "react-router-dom";
import { globalExplorePath } from "../../lib/argos/globalExploreLocal";

type ExploreState = { origin?: string; evidenceOpened?: string };

export function ExploreLink({ to, state, ...props }: Omit<LinkProps, "to" | "state"> & {
  to: string;
  state?: ExploreState;
}) {
  const location = useLocation();
  const previous = location.state as ExploreState | null;
  const sameObject = to.split("?")[0] === location.pathname;
  const origin = sameObject ? previous?.origin : location.pathname + location.search;
  return <Link {...props} to={to} state={{ origin, ...state }} />;
}

export function ReturnToOrigin() {
  const { state } = useLocation();
  const origin: unknown = (state as ExploreState | null)?.origin;
  if (typeof origin !== "string") return null;
  const path = origin.split("?")[0];
  if (path !== globalExplorePath && !path.startsWith(globalExplorePath + "/")) return null;
  return <Link className="ax-text-link" to={origin} replace>Voltar à origem</Link>;
}
