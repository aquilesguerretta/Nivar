export const meta = {
  name: 'alexandria-v2-pieceA-r05',
  description: 'Piece A round 5: true-engraving sea and cartographic land for the globe (blind-picked), legible external lettering, legend band, 3440/1280 fixes, integration + capture',
  phases: [
    { title: 'Media', detail: 'three sea/land variants rendered in context' },
    { title: 'Judge', detail: 'blind pick at display scale' },
    { title: 'Finalize', detail: 'winner rendered for all views and sizes' },
    { title: 'Integrate', detail: 'builder: external lettering, legend band, fixes, capture r05' },
  ],
}

const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/A-r05`
const R04 = `${DOCS}/media-lab/A-r04`
const HF = 'mcp__1bd778ac-f4ca-47cf-b235-8be5dc610f70__'
const PW = 'C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json'
const GPU = `python ${DOCS}/media-lab/_ferramentas/gpu_lock.py -- "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P <script.py> -- <args>`

const COMMON = `
CONTEXTO: Alexandria v2 (rota /alexandria), currículo de energia da NIVAR, "atlas vivo do conhecimento em energia" (gravura a buril, cartografia histórica). Paleta: pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340/#071628, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara). Cinzel + Lora.
FOUNDER: "use Blender e Higgsfield ao máximo; quero igual ou MAIS BONITO que o North Star; não precisa economizar créditos". Na comparação cega a Home r04 já venceu o North Star 3×0 com margem clara; o critic Craft reprovou o ACABAMENTO do globo.
BRIEF DESTA RODADA (LEIA INTEIRO): ${DOCS}/briefs/piece-A-r05.md. Estado atual: ${DOCS}/captures/A/r04/home-E2-1440.png, home-E2b-1440.png, home-E0-1440.png, home-E2-390.png, closing-home-E2-1280.png, closing-home-E2-1920.png, closing-home-E2-3440.png. North Star (painel Home): ${DOCS}/captures/reference/north-star-home-panel.png (NÃO envie ao Higgsfield).
ATIVOS r04 (reuse os scripts): ${R04}/globo/ (globo_r04.py, compor_r04.py, carta_r04.py, carta_hf_r04.py, ancoras_r04.py, comparar_r04.py, textura/, passes/*.json, ancoras/, renders/), ${R04}/prancha/ (camadas), ${R04}/integracao/ (pipeline do produto). Código: ${WT}/src/components/alexandria/home/ (GloboCurriculo.tsx, letreiroCarta.ts, geometria*.ts, EntradaBlocos.tsx, FaixaTrilhas.tsx), ${WT}/src/pages/alexandria/AlexandriaHome.tsx.
REGRAS: nenhum texto em imagem gerada; nada de continente real; sem gradiente/glow/sombra de UI em CSS; raio 0; atmosfera nunca cobre dado. Higgsfield via ToolSearch "select:${HF}models_explore,${HF}generate_image,${HF}generate_image_batch,${HF}jobs_wait,${HF}balance,${HF}media_upload,${HF}media_confirm,${HF}upscale_image" (catálogo justificado; fidelidade medida: IoU das costas ≥ 0,95, desvio das estações < 1% do diâmetro). Blender SEMPRE com trava de GPU: ${GPU}. Playwright: createRequire('${PW}'). Python PIL/numpy. Registre proveniência (<pasta>/provenance.json) e créditos. OLHE tudo na escala exibida (globo ~355–420 CSS px a 1440 DPR1 e DPR2; ~300 a 390; ~630 a 3440).`

const MEDIA_OUT = { type: 'object', properties: { summary: { type: 'string' }, variants: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, contexto1440: { type: 'string' }, contexto1440dpr2: { type: 'string' }, contexto390: { type: 'string' }, recipe: { type: 'string' } }, required: ['id', 'contexto1440', 'contexto390', 'recipe'] } }, creditsSpent: { type: 'string' }, risks: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'variants', 'creditsSpent'] }

phase('Media')
const media = await agent(`${COMMON}
TAREFA — VARIANTES DE MAR E TERRA. Pasta ${LAB}/variantes/.
Produza TRÊS variantes do globo (vista V1 e V2 bastam nesta etapa), cada uma com o mar em uma técnica de gravura verdadeira — (a) meia-tinta/mezzotint: grão fino navy com áreas brunidas mais claras do lado da luz; (b) talho curvo: linhas claras sobre navy que SEGUEM a curvatura da esfera (paralelos projetados), com espessura modulada pela luz, sem aliasing (renderize o traço na resolução final, antialiasing correto); (c) contra-hachura curva no terminador + pontilhado — e TODAS com a terra melhorada: costa em tinta firme com sombra de costa e 3–5 linhas d'água, relevo em perfil graúdo, rios e matas legíveis na escala, sépia da prancha. Mantenha a geometria (máscara, estações, rota) e o tamanho por exibição (D400/D520/D800 no mínimo para a V1).
Para cada variante, monte a composição NO CONTEXTO (camadas prancha + globo + mãos da r04, sem letreiro ou com o letreiro atual) e capture: contexto a 1440 DPR1, a 1440 DPR2 (recorte do globo) e a 390. Nomes neutros: ${LAB}/variantes/var-<id>-1440.png, -1440-dpr2.png, -390.png. Inclua também o globo r04 no mesmo formato como var-r04-*. Olhe e itere: nenhuma variante pode ter padrão periódico que leia como tela/varredura, nem parecer vetor liso.`, { label: 'media:mar-terra', phase: 'Media', schema: MEDIA_OUT, effort: 'high' })

phase('Judge')
const JUDGE_OUT = { type: 'object', properties: { ranking: { type: 'array', items: { type: 'object', properties: { image: { type: 'string' }, rank: { type: 'number' }, why: { type: 'string' } }, required: ['image', 'rank', 'why'] } }, bestGap: { type: 'string' } }, required: ['ranking', 'bestGap'] }
const vars = media?.variants ?? []
const cand = vars.map((v, i) => `V${i + 1}: ${v.contexto1440} | ${v.contexto1440dpr2 ?? ''} | ${v.contexto390}`).join(' ;; ')
const varMap = Object.fromEntries(vars.map((v, i) => [`V${i + 1}`, v.id]))
const LENSES = [
  ['material', 'COERÊNCIA DE MATERIAL: o globo parece gravado na MESMA chapa que o Titã e o céu (sem varredura digital, sem vetor liso, sem CGI colado)'],
  ['beleza', 'BELEZA E LEGIBILIDADE DO OBJETO: o globo é belo e as ilhas leem como terras cartografadas (costa, relevo, rios), na escala exibida'],
]
const judged = await parallel(LENSES.map(([k, lens]) => () => agent(`Você é um diretor de arte e gravador exigente julgando às cegas variantes da peça central de uma página (um globo sustentado por um titã gravado).
Não abra nenhum arquivo além destes; não edite nada. Referência de qualidade: ${DOCS}/captures/reference/north-star-home-panel.png.
Variantes (desktop | detalhe em alta densidade | celular): ${cand}
Lente: ${lens}. Ranqueie todas e nomeie a maior lacuna da melhor.`, { label: `judge:${k}`, phase: 'Judge', schema: JUDGE_OUT, effort: 'high' })))

phase('Finalize')
const final = await agent(`${COMMON}
Variantes: ${JSON.stringify(media, null, 1)}
Julgamento cego (rótulos → id: ${JSON.stringify(varMap)}): ${JSON.stringify(judged, null, 1)}
TAREFA — FINALIZAR O GLOBO r05. Pasta ${LAB}/globo/. Pegue a variante vencedora (some as rankings; em empate, a lente de material decide), corrija a maior lacuna apontada, e renderize as três vistas (V1, V2, V3) em todos os tamanhos de exibição (D400, D520, D800, D1040, D1400, D2000), com os JSONs de coordenadas por tamanho (regere as âncoras se precisar) e a folha de comparação r04 × r05 na escala exibida. Proveniência completa.`, { label: 'finalize:globo', phase: 'Finalize', schema: MEDIA_OUT, effort: 'high' })

phase('Integrate')
const INT_OUT = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, assetsPublished: { type: 'array', items: { type: 'string' } }, gateFixes: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, captureDir: { type: 'string' }, legendChecks: { type: 'string' }, heuristicsBroken: { type: 'array', items: { type: 'string' } }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'assetsPublished', 'gateFixes', 'tsc', 'detect', 'captureDir', 'legendChecks', 'knownGaps'] }
const integrated = await agent(`Você é o BUILDER da Peça A (agente LYCEUM), rodada 5.
Diretório: ${WT} (git worktree, branch wave/alexandria-v2-restructure). Não faça commit/git add. Não toque arquivos fora da posse da Alexandria (index.html, src/main.tsx, app/).
Leia: ${DOCS}/briefs/piece-A-r05.md (LACUNA + itens) e os briefs anteriores da Peça A, ${DOCS}/bar.md (S1–S7, A1–A6, §6, §7) e ${DOCS}/decisoes/.
Globo r05 finalizado: ${JSON.stringify(final, null, 1)}
TAREFA:
1) Troque o globo r04 pelo r05 (srcset por tamanho, geometria regenerada pelo pipeline em ${LAB}/integracao/ — parta de ${R04}/integracao/).
2) LETREIRO: nomes dos três territórios FORA do disco, sobre o céu da prancha, em letreiro de carta (arco externo largo ou horizontal, halo de papel por paint-order), com fio-guia fino até a ilha; no disco, só códigos e marcadores; estações rasantes com código fora da borda (fio-guia) ou sem código se não houver label_ok. Zero colisão e zero descarte em E0, E1, E2 e E2b, em 390, 768, 1280, 1440, 1920 e 3440 (a colocação continua determinística e verificada no DOM). O selo "você está aqui"/"ponto de partida" continua a coisa mais legível do objeto.
3) Legenda de estados + "Sobre esta figura" + declaração de classe: numa faixa própria junto à imagem (como na r03), ≥ 12px, contraste ≥ 4,5:1; a legenda só lista os glifos presentes no objeto naquele estado.
4) 3440: header e conteúdo na mesma grade; sem faixa de papel quase vazia (estenda a gravura ou reancore). 1280: lede ≤ 3 linhas. Faixa navy a 1440: a figura precisa assentar (avalie a base da prancha ou o respiro).
5) \`npx tsc -b\` (0 erros); \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` (0 P0).
6) Dev server http://127.0.0.1:5311 (se estiver fora, suba em segundo plano: npm --prefix ${WT} run dev -- --host 127.0.0.1 --port 5311 --strictPort). Captura: \`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/A/plans/piece-A.json --out docs/alexandria-v2/captures/A/r05 --closing\`. OLHE os PNGs (todos os estados e larguras) e compare com a r04 e com o North Star; corrija e recapture. legend.json: horizontalOverflow false; minFontPx ≥ 11 na Home; minFontPxShell ≥ 11 em todas as rotas (o shell agora é medido por data-shell); truncatedText inShell vazio; smallTargets vazio na Home; overflowingElements vazio na Home; cta-*-click → aula; media com classe.
7) Assets → public/alexandria/v2/home/ (remova os r04 não usados) + media-provenance.md (retiradas marcadas).`, { label: 'builder:A:r05', phase: 'Integrate', schema: INT_OUT, effort: 'high' })

return { media, judged, varMap, final, integrated }
