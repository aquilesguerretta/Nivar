export const meta = {
  name: 'alexandria-v2-pieceA-r06-integrate',
  description: 'Piece A round 6: publish the unified (ink-composited) globe, fix A1 lede, A5 reserved legend height, CTA label and 390 framing, capture r06',
  phases: [{ title: 'Integrate', detail: 'builder + capture A r06' }],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/A-r06`

phase('Integrate')
const INT_OUT = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, assetsPublished: { type: 'array', items: { type: 'string' } }, gateFixes: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, captureDir: { type: 'string' }, legendChecks: { type: 'string' }, heuristicsBroken: { type: 'array', items: { type: 'string' } }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'assetsPublished', 'gateFixes', 'tsc', 'detect', 'captureDir', 'legendChecks', 'knownGaps'] }
const integrated = await agent(`Você é o BUILDER da Peça A (Home + shell) da Alexandria v2 (agente LYCEUM), rodada 6.
Diretório: ${WT} (git worktree). Não faça commit/git add. Não toque index.html, src/main.tsx, app/, nem as rotas/arquivos da Peça B (src/components/alexandria/trilhas/*), que outra frente acabou de entregar.
LEIA: ${DOCS}/briefs/piece-A-r06.md (o que esta rodada corrige), os briefs anteriores da Peça A, ${DOCS}/bar.md (S1–S7, A1–A6, §6, §7) e ${DOCS}/decisoes/.
MÍDIA PRONTA: ${LAB}/DECISAO.md (decisão e medições), ${LAB}/globo/ (renders r06 das vistas V1–V3 em D400–D2000, JSON de coordenadas e âncoras), ${LAB}/integracao/ (pipeline pronto, partindo do de r05) e ${LAB}/provenance.json. O caminho vencedor foi o P2 (composição pura, sem IA): papel e tinta medidos da prancha, mar em três famílias de traço no passo da chapa, luz única e SOMBRA DE CONTATO das mãos em três camadas (disco, mãos por cima, prancha por baixo).
TAREFA:
1) Publique o globo r06 (mesmos nomes de arquivo do r05, srcset por diâmetro) e as camadas de contato que o pipeline gera (mãos e prancha por formato), com a geometria/âncoras regeneradas; remova de public/ o que deixar de ser usado; registre tudo em ${DOCS}/media-provenance.md (retiradas marcadas, factual_review "pendente (orquestrador)").
2) A1: o lede de "Explorar a partir daqui" e os ganchos precisam dizer a mesma coisa em TODOS os estados (E0, E1, E2, E2b). O lede só promete o que as linhas entregam (escopo de módulo quando é módulo; "quando houver" quando a fonte não existe).
3) A5: a faixa de legenda reserva a altura final desde o primeiro quadro, com e sem conta. Verifique em account-load-E2-1440 (f03→f05 sem deslocamento) e com a evidência de fontes bloqueadas.
4) S1: o rótulo da ação principal nomeia objeto E motivo ("Continuar · M01·A08 — 100 MW solar ≠ 100 MW térmica"), sem repetir o título dentro do cartão.
5) 390: o globo não pode ser cortado pela barra de abas sem motivo; avalie mostrar a cabeça do Titã (o monumento não pode virar só duas mãos). Marcador, selo e território atual continuam inteiros acima da barra.
6) Gates: \`npx tsc -b\` (0 erros) e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` (0 P0).
7) Dev server http://127.0.0.1:5311 (se estiver fora: npm --prefix ${WT} run dev -- --host 127.0.0.1 --port 5311 --strictPort, em segundo plano). Captura: \`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/A/plans/piece-A.json --out docs/alexandria-v2/captures/A/r06 --closing\`. OLHE os PNGs (todos os estados e larguras), compare com ${DOCS}/captures/A/r05 e com o North Star, corrija e recapture. legend.json: horizontalOverflow false; minFontPx ≥ 11 na Home; minFontPxShell ≥ 11; truncatedText inShell vazio; smallTargets vazio; overflowingElements vazio na Home; cta-*-click → aula; mídia com classe.
Declare heurísticas quebradas com a razão.`, { label: 'builder:A:r06', phase: 'Integrate', schema: INT_OUT, effort: 'high' })
return { integrated }
