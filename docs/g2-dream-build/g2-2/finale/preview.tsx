import React from "react";
import "/src/index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NivarShell } from "/src/components/g2/NivarShell";
import { HouseFinale } from "/src/components/g2/HouseFinale";
import { AuthProvider } from "/src/lib/auth/AuthContext";
createRoot(document.getElementById("root")!).render(<React.StrictMode><BrowserRouter><AuthProvider><NivarShell><div style={{ height: 220, padding: "55px max(20px, 5vw)", boxSizing: "border-box" }}><span className="g2-eyebrow">Estudo de composição / G2.2</span><p style={{ fontFamily: "var(--g2-serif)", fontSize: 34, marginTop: 12 }}>Da realidade, de volta à pergunta.</p></div><HouseFinale /></NivarShell></AuthProvider></BrowserRouter></React.StrictMode>);
