import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ResearchFrontier } from "../../src/features/argos-research-frontier/ResearchFrontier.tsx";
import "./fixture.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ResearchFrontier />
      </HashRouter>
    </StrictMode>,
  );
}
