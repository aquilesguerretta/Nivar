import { useEffect, useRef, type ReactNode } from "react";
import { FileText, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExploreLink } from "./navigation";

export type EvidenceLink = { title: string; to: string };

export function Evidence({ links, children, closeTo }: {
  links: readonly EvidenceLink[];
  children?: ReactNode;
  closeTo: string;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const rail = useRef<HTMLElement>(null);
  const opened = useRef<string>(null);
  const active = Boolean(children);
  const { pathname, search, state } = useLocation();
  const navigate = useNavigate();
  const href = pathname + search;
  const close = () => {
    if (state?.evidenceOpened === href) navigate(-1);
    else navigate(closeTo, { replace: true, state });
  };

  useEffect(() => {
    if (active) {
      opened.current = href;
      const frame = requestAnimationFrame(() => {
        heading.current?.focus({ preventScroll: true });
        heading.current?.scrollIntoView({ block: "nearest" });
      });
      return () => cancelAnimationFrame(frame);
    } else if (opened.current) {
      const trigger = [...(rail.current?.querySelectorAll("a") ?? [])]
        .find((link) => link.getAttribute("href") === opened.current);
      opened.current = null;
      (trigger ?? rail.current?.querySelector("a"))?.focus();
    }
  }, [active, href]);

  if (!active) {
    return (
      <aside className="ax-rail" aria-labelledby="ax-evidence-list" ref={rail}>
        <h2 id="ax-evidence-list"><FileText size={19} aria-hidden="true" /> Evidência</h2>
        <ul className="ax-rail-list">
          {links.map(({ title, to }) => (
            <li key={to}><ExploreLink to={to} state={{ evidenceOpened: to }}>{title}</ExploreLink></li>
          ))}
        </ul>
      </aside>
    );
  }

  return (
    <aside className="ax-inspector ax-integrated-evidence" aria-labelledby="ax-evidence"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          close();
        }
      }}>
      <div className="ax-inspector-head">
        <h2 ref={heading} id="ax-evidence" tabIndex={-1}>Evidência</h2>
        <button type="button" className="ax-close" aria-label="Fechar evidência" onClick={close}>
          <X size={19} aria-hidden="true" />
        </button>
      </div>
      {children}
    </aside>
  );
}
