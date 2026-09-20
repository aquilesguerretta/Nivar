import { useEffect, useRef } from "react";

/** A path may only morph when its command/segment topology is identical.
 * Separate M commands are retained: a null gap is never joined for animation. */
export function compatiblePaths(from: string, to: string) {
  const commands = (path: string) => path.match(/[MLHVCSQTAZ]/gi)?.join("") ?? "";
  return !!from && !!to && commands(from) === commands(to) && !/NaN|Infinity/.test(from + to);
}

/** Presentation-only motion over Recharts' final SVG geometry.
 * Recharts continues to own data, scales, hover, accessibility and exact values.
 * No interpolated number enters the series, tooltip, source record or export. */
export function useTerminalMotion(reduced: boolean) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const snapshots = new Map<string, { d: string; context: string; element: SVGPathElement }>();
    const markers = new Map<string, { x: number; y: number; context: string; element: SVGElement }>();
    const running = new Map<Element, Animation>();
    let visible = true;
    const context = () => `${host.dataset.period}/${host.dataset.metric}/${host.dataset.scale}/${host.dataset.window}`;
    const reconcileCurves = () => {
      for (const path of host.querySelectorAll<SVGPathElement>(".recharts-area-curve, .recharts-area-area, .recharts-line-curve")) {
        const region = path.closest("[class*='g23-curve-']")?.getAttribute("class")?.match(/g23-curve-([\w]+)/)?.[1] ?? "primary";
        const key = `${region}/${path.classList.contains("recharts-area-area") ? "fill" : "curve"}`;
        const d = path.getAttribute("d") ?? "";
        const previous = snapshots.get(key);
        if (previous?.element === path && previous.d === d) continue;
        snapshots.set(key, { d, context: context(), element: path });
        if (!previous || previous.d === d) continue;
        const current = running.get(previous.element);
        const rendered = current && previous.element.isConnected ? getComputedStyle(previous.element).getPropertyValue("d") : "";
        current?.cancel();
        running.delete(previous.element);
        if (reduced || !visible || document.hidden) continue;
        const isMorph = previous.context === context() && compatiblePaths(previous.d, d) && CSS.supports("d", `path("${d}")`);
        // A changed frequency, unit or topology is a new view, not the same
        // observations. Reveal final geometry instead of inventing matches.
        const animation = path.animate(isMorph
          ? [{ d: rendered || `path("${previous.d}")` }, { d: `path("${d}")` }]
          : [{ opacity: 0.25 }, { opacity: 1 }],
        { duration: isMorph ? 620 : 360, easing: "cubic-bezier(.22,.7,.22,1)" });
        running.set(path, animation);
        host.dataset.curveMotion = isMorph ? "morph" : "context-reveal";
        animation.onfinish = () => { if (running.get(path) === animation) running.delete(path); };
      }
    };
    const reconcileMarkers = () => {
      host.querySelectorAll<SVGElement>(".recharts-reference-line, .recharts-label").forEach((element) => {
        const line = element.querySelector("line");
        // Recharts may reorder reference layers after a region change.
        const key = line ? (line.getAttribute("x1") === line.getAttribute("x2") ? "probe" : "baseline") : "probe-label";
        const x = Number(line ? line.getAttribute("x1") : element.getAttribute("x"));
        const y = Number(line ? line.getAttribute("y1") : element.getAttribute("y"));
        const previous = markers.get(key);
        if (previous?.element === element && previous.x === x && previous.y === y) return;
        markers.set(key, { x, y, context: context(), element });
        if (!previous || (previous.x === x && previous.y === y)) return;
        const current = running.get(previous.element);
        const rendered = current && previous.element.isConnected ? new DOMMatrix(getComputedStyle(previous.element).transform) : null;
        current?.cancel();
        running.delete(previous.element);
        if (reduced || !visible || document.hidden) return;
        // SVG line endpoints are attributes, not interpolable CSS geometry.
        // Translate markers and the separate Recharts label layer from their
        // last rendered positions. Exact new coordinates remain in the DOM.
        const animation = element.animate(previous.context === context()
          ? [{ transform: `translate(${previous.x - x + (rendered?.e ?? 0)}px, ${previous.y - y + (rendered?.f ?? 0)}px)` }, { transform: "translate(0, 0)" }]
          : [{ opacity: 0.25 }, { opacity: 1 }],
        { duration: previous.context === context() ? 620 : 360, easing: "cubic-bezier(.22,.7,.22,1)" });
        running.set(element, animation);
        animation.onfinish = () => { if (running.get(element) === animation) running.delete(element); };
      });
    };
    reconcileCurves();
    reconcileMarkers();
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.target === host && mutation.attributeName === "data-selection-revision") && !reduced && visible && !document.hidden) {
        const selectors = host.dataset.selection === "observation"
          ? [".g2t-context-value", ".g2t-probe-heading", ".g2t-observation-trace"]
          : [".g2t-spatial-tag", ".g2t-series > .g2t-panel-heading", ".g2t-context-value", ".g2t-observation-trace"];
        selectors.forEach((selector, index) => {
          const element = host.querySelector(selector);
          if (!element) return;
          running.get(element)?.cancel();
          const animation = element.animate([{ opacity: 0.58, transform: "translateY(2px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 320, delay: index * 55, easing: "cubic-bezier(.22,.7,.22,1)" });
          running.set(element, animation);
          animation.onfinish = () => { if (running.get(element) === animation) running.delete(element); };
        });
      }
      // Recharts can replace path nodes when the data changes. Compare the
      // semantic curve/fill roles rather than relying on DOM node identity.
      reconcileCurves();
      reconcileMarkers();
    });
    observer.observe(host, { subtree: true, attributes: true, attributeFilter: ["d", "x1", "y1", "x", "y", "data-selection-revision"], childList: true });
    const suspend = () => { if (document.hidden) { running.forEach((animation) => animation.cancel()); running.clear(); } };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { running.forEach((animation) => animation.cancel()); running.clear(); }
    }, { threshold: 0.01 });
    intersection.observe(host);
    document.addEventListener("visibilitychange", suspend);
    return () => { observer.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", suspend); running.forEach((animation) => animation.cancel()); };
  }, [reduced]);
  return root;
}
