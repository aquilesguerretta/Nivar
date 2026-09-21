// NIVAR G2 Brazil routes stay inside the existing /br/* boundary.
// Alexandria, account authentication and advisory submission routes remain owned by the main router.
import { Route, Routes } from "react-router-dom";

import { PortalBR } from "./PortalBR";
import { FamiliaPage } from "./FamiliaPage";
import { NotFound } from "../NotFound";
import TerminalBrasil from "../terminal-brasil/TerminalBrasil";
import { G2FamilyPage } from "./FamilyPages";
import { EnergyBrief, MethodPage, SystemPage } from "./EditorialPages";

export function PortalBRRouter() {
  return (
    <Routes>
      <Route index element={<PortalBR />} />
      <Route path="familia/:familiaId" element={<FamiliaPage />} />
      <Route path="terminal" element={<TerminalBrasil />} />
      <Route path="brief" element={<EnergyBrief />} />
      <Route path="metodo" element={<MethodPage />} />
      <Route path="sistema" element={<SystemPage />} />
      {["intelligence", "advisory", "academy", "software", "hardware"].map(
        (f) => (
          <Route key={f} path={f} element={<G2FamilyPage family={f} />} />
        ),
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PortalBRRouter;
