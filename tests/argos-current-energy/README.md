# ARGOS Current Energy J3

The NIV-78 sandbox uses the Brazilian product language and the repository's existing `argos-local` Vite mode.

## Run locally

```powershell
npm ci
npm run dev -- --mode argos-local --host 127.0.0.1 --strictPort
```

Open `http://127.0.0.1:5173/tests/argos-current-energy/fixture.html`. Follow the relationship links from the historical April Event to the original Document, the Dy-containing NdFeB item, its permanent-magnet applications, and China. **Verificar evidências** opens the evidence for the current view. **Voltar** returns to that same view. The browser's Back and Forward controls also work.

## Verify

```powershell
node --experimental-strip-types --test tests/argos-current-energy/read-model.test.ts tests/argos-global-explore/read-model.test.ts tests/argos-signal-inspection/read-model.test.ts tests/production-stabilization/browser-api.test.ts
npx tsc -b
npx eslint src/features/argos-current-energy tests/argos-current-energy
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src/features/argos-current-energy
npm run build
node --test tests/argos-current-energy/browser.mjs
```

The Playwright Node runner uses installed Chrome. It resolves `playwright` from the local Node module path or an existing `RUNTIME_NODE_MODULES` directory. It starts a temporary loopback Vite server, asserts the API proxy is absent, and fails on any external or API request. Chrome executes the complete journey at desktop and mobile widths in dark and light modes. Run the standard build before the browser suite so the suite can inspect `dist` and verify the fixture URL against the compiled preview.

## Knowledge Layer handoff

| Local record | Integration mapping |
| --- | --- |
| Source and Document | Resolve the publisher channel and native identity, then attach the exact manifestation, language and reviewed version. Chinese original and English reference translation share an instrument identity. Registry aliases share one reference. Local versions pin fixture metadata. |
| Event and Claim | Resolve the event by issuer, instrument and occurrence date. Extract the embedded Claim as a versioned reference. Each citation resolves a Document ID, version and locator. Preserve source publication, operative dates, review cutoff, retrieval and ARGOS-known-at as distinct values. |
| TechnologyElement and applications | Resolve the material by composition and forms. Keep `1C905.a.4` as a locator on the original Document and Claim. The application screen is a view over two machine variant candidates with electrical machines as the parent candidate. |
| China | Resolve `j3:country:CHN` to the existing `country:CHN` identity. The link carries the jurisdiction of the April legal action through the application view. |
| Journey links | Map the local navigation labels to evidence-backed view links. Use the shared Knowledge Layer relations where applicable. |

The `j3:` IDs are candidates. The fixture preserves the NIV-70 cutoff of `2026-11-18T04:15:59Z`. The separate rights review follows NIV-74. References use bibliographic text and short NIVAR-authored working notes. Recorded registry status is a dated observation. Product or shipment classification requires a separate human review. The published suspension interval supplies no evidence of subsequent resumption.

[Engineering contract](https://linear.app/nivarenergy/issue/NIV-78) · [Accepted dossier](https://linear.app/nivarenergy/issue/NIV-70#comment-a81ba363-9dd8-4fbb-bbb7-0acc0634d45f) · [Rights review](https://linear.app/nivarenergy/issue/NIV-74) · [Knowledge Layer](https://app.notion.com/p/41a9ca62107081178d54e20df43e0e58)
