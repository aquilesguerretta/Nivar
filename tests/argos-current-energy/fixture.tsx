import { createRoot } from "react-dom/client";

if (import.meta.env.DEV && import.meta.env.MODE === "argos-local" && window.location.hostname === "127.0.0.1") {
  const { default: CurrentEnergy } = await import("../../src/features/argos-current-energy/CurrentEnergy.tsx");
  const root = document.getElementById("root");
  if (root) createRoot(root).render(<CurrentEnergy />);
}