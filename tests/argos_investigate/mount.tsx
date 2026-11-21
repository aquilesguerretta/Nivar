import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../../src/design/nivar/fonts.css";
import "../../src/design/nivar/colors.css";
import "../../src/design/nivar/typography.css";
import "../../src/design/nivar/motion.css";
import "../../src/design/nivar/base.css";
import { Investigate } from "../../src/features/argos_investigate/Investigate";
import { catalog } from "./catalog";
import "./fixture.css";

export function Fixture() {
  const [night, setNight] = useState(matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <div className="ai-fixture" data-mode={night ? "noturno" : undefined}>
      <header className="ai-fixture-shell">
        <div>
          <img src="/src/design/nivar/assets/nivar-wordmark-papel.svg" alt="NIVAR" width="71" height="24" />
          <span>Inteligência energética</span>
          <button onClick={() => setNight(!night)} type="button">{night ? "Modo claro" : "Modo noturno"}</button>
        </div>
      </header>
      <BrowserRouter>
        <Investigate catalog={catalog} />
      </BrowserRouter>
      <footer className="ai-fixture-caption">Protótipo local · Acervo privado de pesquisa</footer>
    </div>
  );
}

const root = document.getElementById("investigate-fixture");
if (root) createRoot(root).render(<Fixture />);
