# ARGOS Explore · NIV-67 / NIV-77

Start from this worktree with Node 24 and its own dependencies.

```powershell
npm ci
npm run dev -- --mode argos-local --host 127.0.0.1 --strictPort
```

Open `http://127.0.0.1:5173/br/argos/explore`, or follow **Abrir ARGOS Explore** from the Intelligence page. The Vite `argos-local` mode disables the existing backend proxy and blocks third-party subresources. There is no local database or account setup. The shell's session check stays on the local server. The route and fixture are excluded from the production bundle.

The wafer and China views dereference one versioned observation by ID. The `q` and `evidence` query parameters keep the search and source inspection context in the browser history. The fixture contains NIVAR-authored text, attributed source metadata, and the approximate IEA observation. The original assets and data stay with their publishers. NIV-74 records the source-rights research. NIV-76 governs client and public display.

Search for **Solar PV** and follow the typed links through c-Si, TOPCon, wafer and China. **Copiar link fixado** in the evidence inspector copies `document_ref` and `document_version`. For the IEA metric it also pins `observation_ref` and `observation_version`. A link without pins follows the current observation and the document version it cites. Invalid, missing, incompatible or restricted revisions suppress the selected content and show an explicit state. Closing the inspector keeps valid pins. Links between wafer and China carry the shared metric pins.

Run the frontend gates from the worktree root. The browser runner uses installed Chrome and a Playwright installation resolved from `RUNTIME_NODE_MODULES` or the local Node module path.

```powershell
npx tsc -b
npm run build
node --experimental-strip-types --test tests/argos-global-explore/read-model.test.ts
node --test tests/argos-global-explore/browser.mjs
```

The browser runner opens its own loopback-only servers, blocks outbound browser requests and exercises the dev route and the compiled build. It applies the synthetic correction only inside the historical QA case. Screenshots are written to `ARGOS_QA_OUTPUT` or the `niv77-local-evidence` folder in the system temporary directory.
