export const meta = {
  name: 'alexandria-v2-pieceB-r01-integrate',
  description: 'Piece B round 1: integrate the winning Trilhas/map composition into the product (real progress, three visible territories, cartouche lettering), capture',
  phases: [{ title: 'Integrate', detail: 'builder + capture B r01' }],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/B-r01`
const ARGS = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/docs/alexandria-v2/orquestracao/pieceB-r01-args.json'

phase('Integrate')
const INT_OUT = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, assetsPublished: { type: 'array', items: { type: 'string' } }, gateFixes: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, captureDir: { type: 'string' }, legendChecks: { type: 'string' }, heuristicsBroken: { type: 'array', items: { type: 'string' } }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'assetsPublished', 'gateFixes', 'tsc', 'detect', 'captureDir', 'legendChecks', 'knownGaps'] }
const integrated = await agent(`Você é o BUILDER da Peça B (Territórios: Trilhas + mapa da Trilha I) da Alexandria v2 (agente LYCEUM), rodada 1.
Diretório: ${WT} (git worktree, branch wave/alexandria-v2-restructure). Não faça commit/git add. Não toque arquivos fora da posse (index.html, src/main.tsx, app/, rotas de aula e módulo da Peça C, ModuloAulaList).
LEIA: ${DOCS}/briefs/piece-B.md (escopo, posse, dados, verificação), ${DOCS}/bar.md (§3 B1–B6, S1–S7, §6, §7), ${DOCS}/decisoes/ (P18, P22, P24, P25), ${DOCS}/critics/piece-B-critic-briefs.md. A Home (Peça A) já estabeleceu shell, tokens, papel, globo e letreiro: reuse por import (src/components/alexandria/home/estudo.ts → useEstudo; letreiroCarta.ts; geometria), sem alterar a Home.
MÍDIA PRONTA (B-r01): leia o JSON ${ARGS} (campos media.pranchas e media.mapas: resumo, entregáveis e riscos das frentes de mídia; judged: julgamento cego das composições; labelMap: rótulo → origem).
ATENÇÃO: ${LAB}/compose/img/ tem cópias VELHAS dos emblemas e da prancha III (antes do retoque); use SEMPRE ${LAB}/territorios/emblemas/ (r2, relevo e plano) e ${LAB}/territorios/pranchas/ e ${LAB}/mapas/.
COMPOSIÇÕES E JULGAMENTO CEGO: no mesmo JSON (r00 = telas atuais).
Composições em ${LAB}/compose/ (HTML + PNG); a vencedora é comp-1 (1ª para 2 de 3 juízes).
TAREFA:
1) Implemente /alexandria/trilhas e /alexandria/trilha/:trilhaId com a direção da comp-1, corrigindo as maiores lacunas dos juízes:
 - Trilhas: a trilha ATUAL domina (B2, inclusive em cinza) MAS as outras duas ficam VISÍVEIS no 1º viewport como territórios menores, cada uma com nome, emblema, visão de mundo e fragmento da prancha (nada de faixas cortadas sem nome). Leitura I → II → III. Contagens numa linha de aparato; uma ação principal nomeando objeto (Continuar · M01·A08 — …). Perguntas e capacidades derivadas (camada Alexandria marcada no dado).
 - Emblemas: use os r2 em relevo (Blender) — nítidos e dignos no tamanho exibido.
 - Mapa: a carta da ilha como palco; letreiro das estações em CARTELA/filactério gravado com fio (como na comp-2), sem texto solto sobre o relevo, sem rota riscando rótulos; waypoints de aula com estado (percorrida ● / em leitura ◐ / a seguir ○) a partir do registro REAL (useEstudo); exatamente um "você está aqui"; trecho percorrido a tinta; marcos de tipo com silhueta e rótulo honesto ("experiência jogável em desenho" como linha de metadado, sem controle — P25; M08 "Exercício de decisão" — P4); ação principal abre o nó atual e o nó atual tem data-capture="no-atual"; sumário textual equivalente; a 390 "Mapa | Sumário" (sem hover).
 - Remova o mock das rotas desta peça (estadosDaTrilha / alexandria-progress-mock): "Concluído" só com todas as aulas concluídas no registro (P18). Os números batem com a Home no mesmo estado.
 - Continuidade nó → módulo (B5): elemento compartilhado com título legível; "Voltar" retorna ao mesmo nó e rolagem; sem bounce; movimento reduzido chega ao mesmo estado. Se existir ${DOCS}/estudos/movimento-e-conquistas/sistema-de-movimento.md, siga os tokens de duração/curva.
 - Títulos de conteúdo em caixa alta e baixa; nada de textura quadriculada; legenda de classe e créditos das pranchas e imagens ("Sobre esta figura").
2) Assets aceitos → ${WT}/public/alexandria/v2/trilhas/ (WebP, srcset, nomes estáveis) + registro em ${DOCS}/media-provenance.md (todas as colunas; factual_review "pendente (orquestrador)").
3) \`npx tsc -b\` (0 erros) e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` (0 P0).
4) Dev server http://127.0.0.1:5311 (se estiver fora, suba em segundo plano: npm --prefix ${WT} run dev -- --host 127.0.0.1 --port 5311 --strictPort). Captura: \`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/B/plans/piece-B.json --out docs/alexandria-v2/captures/B/r01 --closing\`. OLHE os PNGs (trilhas e mapa em E0/E1/E2/E2b, cinza, 390, 768, 1280, 1920, 3440, filmstrips nó→módulo e voltar, Tab) e compare com o painel Trilhas do North Star (${DOCS}/captures/reference/north-star-trilhas-panel.png) e com a Home (${DOCS}/captures/A/r04/home-E2-1440.png); corrija e recapture. legend.json: horizontalOverflow false; minFontPx ≥ 11 nas rotas da peça; minFontPxShell ≥ 11; truncatedText inShell vazio; smallTargets vazio; overflowingElements vazio; media com classe; nenhum "GridAlpha".
Declare heurísticas quebradas com a razão.`, { label: 'builder:B:r01', phase: 'Integrate', schema: INT_OUT, effort: 'high' })
return { integrated }
