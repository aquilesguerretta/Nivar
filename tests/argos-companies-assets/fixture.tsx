import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "../../src/components/g2/g2.css";

const root = document.getElementById("j2-root")!;
const isLocal = import.meta.env.DEV && import.meta.env.MODE === "argos-local"
  && window.location.hostname === "127.0.0.1";

if (isLocal) {
  const { CompaniesAssetsFixture } = await import("../../src/features/argos-companies-assets/CompaniesAssetsFixture");
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  createRoot(root).render(
    <div className="g2 j2-frame" data-g2-theme={dark ? "dark" : "light"}>
      <HashRouter><CompaniesAssetsFixture /></HashRouter>
    </div>,
  );
} else {
  root.textContent = "Fixture disponível somente em 127.0.0.1 no modo argos-local.";
}
