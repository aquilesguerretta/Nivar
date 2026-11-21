# G2.3.1 — auditoria de fronteiras

Resultado: **PASS**. Comparação com o início real `aa54f8f32f11e1742cfd1cbe80c7219a217c2de7`; HEAD observado `aa54f8f32f11e1742cfd1cbe80c7219a217c2de7`, branch `wave/nivar-g2-dream-build`.

1105 arquivos rastreados de código, backend, ativos, testes e configuração comparados por blob Git: 1099 iguais, 6 alterações autorizadas, 0 mudanças inesperadas. 4 arquivos novos de código, todos enumerados abaixo.

**Alexandria: 209/209 hashes SHA-256 preservados.** A comparação de bytes usa a lista fornecida no baseline G2.3.1; nenhuma discrepância.

| Fronteira protegida | Arquivos | Iguais |
| --- | ---: | ---: |
| backend | 80 | 80 |
| operator | 14 | 14 |
| advisoryProductsAndWorkflow | 12 | 12 |
| authAndAccount | 13 | 13 |
| academyAndAlexandria | 211 | 211 |
| approvedPortalArchitectureAndFamilyPages | 11 | 11 |
| terminalImplementationExceptIdentityInsertion | 10 | 10 |
| routesAndLoading | 5 | 5 |
| methodAndDiogenesFinale | 5 | 5 |
| largePatronAssets | 13 | 13 |
| protectedGlobalAndHouseStyles | 5 | 5 |
| tests | 5 | 5 |
| rootConfiguration | 10 | 10 |

As contagens de grupos se sobrepõem. Além delas, os blocos Wordmark, dados dos patronos, saída dos retratos grandes e footer são iguais. Ao remover somente as inserções declaradas de identidade, NivarShell, HouseChapters, TerminalBrasil e Brand voltam integralmente ao texto do baseline. Os fluxos, handlers, conteúdo e estrutura restantes nesses arquivos estão preservados.

O arquivo `src/main.tsx` está igual ao baseline, incluindo 27 elementos Route, imports e carregamento. MethodWorkbench, evidência EV-001 e finale de Diógenes permanecem iguais.

## Alterações autorizadas e dependências diretas

| Arquivo | Estado | Escopo |
| --- | --- | --- |
| `src/components/g2/Brand.tsx` | modificado | Existing compact FamilyEmblem adapter; Wordmark, portrait data and large portrait output preserved. |
| `src/components/g2/HeroFilm.tsx` | modificado | Hero only: directed film, real media, editorial films, shared Terminal observation, quiet controls. |
| `src/components/g2/HouseChapters.tsx` | modificado | Direct identity dependency: compact insignia inside each existing family navigation button. |
| `src/components/g2/NivarShell.tsx` | modificado | Direct identity dependency: 16 px desktop and 24 px mobile family insignia insertions. |
| `src/components/g2/hero-film.css` | modificado | Hero only: temporal composition, reserved record/plot areas, mobile and static states. |
| `src/pages/terminal-brasil/TerminalBrasil.tsx` | modificado | Direct identity dependency: 16 px Intelligence insignia in existing brand label; no functional changes. |
| `src/components/g2/FamilyInsignia.tsx` | novo | Five compact family masters and accessible labels; independent from large patrons. |
| `src/components/g2/HeroInstrument.tsx` | novo | Direct Hero dependency: wrapper around unchanged real Terminal AnalysisInstrument and model. |
| `src/components/g2/family-insignia.css` | novo | Compact insignia presentation only. |
| `src/components/g2/insignia-context.css` | novo | Scoped spacing for existing navigation, family rail and Terminal brand label. |

A nova mídia pública e os masters das insígnias estão em `public/g2/g231/`; nenhum ativo público já rastreado foi alterado. A inserção de símbolos em componentes compartilhados muda a identidade compacta dos consumidores existentes, preservando os retratos grandes e o wordmark. O CSS novo de contexto se restringe à navegação, rail das famílias e rótulo de marca do Terminal.

## Proveniência e limites

- `boundary-file-blobs.json`: lista completa com blob do início, blob atual e igualdade por arquivo.
- `boundary-and-inventory.json`: grupos, motivos, quatro comparações de arquivo integral após remoção de inserções de identidade e quatro blocos protegidos com SHA-256.
- `alexandria-hash-comparison.json`: os 209 hashes originais e atuais.
- `terminal-tests.log`: execução dos oito testes existentes de análise, estado de URL, exportação e persistência do Terminal.
- `starting-worktree.txt` não determina posse, pois foi capturado depois do início de documentação. A modificação pré-existente `docs/g2-dream-build/g2-1/material/nivar-material-study.blend` é do owner e foi excluída.
- Nenhum runtime, staging, commit, merge ou deploy foi feito por esta auditoria. Igualdade de código não substitui a verificação visual e funcional no navegador.
- Reexecutar `node docs/g2-dream-build/g2-3-1/qa/audit-boundaries.mjs` após qualquer edição posterior de código ou antes do pacote final.
