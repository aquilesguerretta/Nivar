export const meta = {
  name: 'alexandria-v2-pieceB-r02',
  description: 'Piece B round 2: all three territories explained, module page without fake progress, label pile fixed, capture',
  phases: [{ title: 'Integrate', detail: 'builder + capture B r02' }],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/B-r01`
const ARGS = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/orquestracao/pieceB-r01-args.json'

phase('Integrate')
const INT_OUT = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, assetsPublished: { type: 'array', items: { type: 'string' } }, gateFixes: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, captureDir: { type: 'string' }, legendChecks: { type: 'string' }, heuristicsBroken: { type: 'array', items: { type: 'string' } }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'assetsPublished', 'gateFixes', 'tsc', 'detect', 'captureDir', 'legendChecks', 'knownGaps'] }
const integrated = await agent(`Você é o BUILDER da Peça B (Territórios) da Alexandria v2 (agente LYCEUM), rodada 2.
Diretório: ${WT} (git worktree). Não faça commit/git add. Não toque index.html, src/main.tsx nem app/.
LEIA: ${DOCS}/briefs/piece-B-r02.md (as correções desta rodada), ${DOCS}/briefs/piece-B.md (escopo e posse), ${DOCS}/bar.md (§3, S1–S7, §6, §7), ${DOCS}/decisoes/ (P3, P11, P18, P22, P24, P25) e ${DOCS}/critics/piece-B-critic-briefs.md.
O que existe: a r01 está no produto (src/components/alexandria/trilhas/*, rotas HubRoute e TrilhaRoute em src/pages/alexandria/AlexandriaRouter.tsx) e capturada em ${DOCS}/captures/B/r01 (olhe trilhas-E2-1440.png, trilhas-E0-1440.png, mapa-E2-1440.png, mapa-E2-1440-no-modulo-f0*.png e mapa-E2-1440-voltar-f0*.png). Mídia em ${LAB}/ (pranchas, emblemas r2, mapas e publicar.py).
TAREFA — só as três correções do brief r02:
1) B1: os TRÊS territórios comunicam visão de mundo, 2–3 perguntas e 3–5 capacidades com verbo observável e o campo, antes de qualquer contagem, em E0/E1/E2/E2b. Atual dominante (B2). Não atuais podem abrir por disclosure com data-capture="abrir-trilha-II" e "abrir-trilha-III" (teclado inclusive), com visão de mundo e ao menos uma pergunta já no estado fechado. Perguntas e capacidades: camada Alexandria derivada da fonte (extraction/ e catálogo), marcadas no dado; nada inventado como fato.
2) §6 dado falso no destino: troque a fonte de dado da rota de módulo (ModuloAulaList) para o registro real (useEstudo/getMyProgress) e corrija o título de conteúdo em caixa alta total. NÃO redesenhe a página (isso é da Peça C1). Depois disso, Home, mapa e módulo mostram o mesmo número no mesmo estado.
3) Craft: desempilhe as plaquetas em volta do nó atual — o selo "você está aqui" ganha forma cartográfica distinta das plaquetas de marco, os marcos do módulo atual viram pilha compacta ou saem para a borda com fio-guia, e nada cobre o trecho percorrido nem os glifos que nomeia. Meça sobreposição em E0/E1/E2/E2b × 390/768/1280/1440/1920/3440.
Além disso: as faixas de T2/T3 não podem ler como tabela com botão repetido.
Gates: \`npx tsc -b\` (0 erros) e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` (0 P0).
Dev server http://127.0.0.1:5311 (se estiver fora: npm --prefix ${WT} run dev -- --host 127.0.0.1 --port 5311 --strictPort, em segundo plano). Captura: \`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/B/plans/piece-B.json --out docs/alexandria-v2/captures/B/r02 --closing\` (o plano já tem os filmstrips de expansão e o shot modulo-E2-1440). OLHE os PNGs, corrija e recapture. legend.json: horizontalOverflow false, minFontPx ≥ 11 nas rotas da peça, minFontPxShell ≥ 11, truncatedText inShell vazio, smallTargets vazio, overflowingElements vazio, mídia com classe, nenhum "GridAlpha".
Declare heurísticas quebradas com a razão.`, { label: 'builder:B:r01', phase: 'Integrate', schema: INT_OUT, effort: 'high' })
return { integrated }
