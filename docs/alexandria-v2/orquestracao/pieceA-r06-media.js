export const meta = {
  name: 'alexandria-v2-pieceA-r06-media',
  description: 'Piece A round 6 media: unify globe and Titan into one engraved plate (restyle vs compositing vs hybrid) under geometry-fidelity gates, blind pick vs r05',
  phases: [
    { title: 'Media', detail: 'three unification paths in context' },
    { title: 'Judge', detail: 'blind pick including r05' },
    { title: 'Finalize', detail: 'winner for all views/sizes/crops with remeasured geometry' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/A-r06`
const R05 = `${DOCS}/media-lab/A-r05`
const HF = 'mcp__1bd778ac-f4ca-47cf-b235-8be5dc610f70__'
const PW = 'C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json'
const GPU = `python ${DOCS}/media-lab/_ferramentas/gpu_lock.py -- "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P <script.py> -- <args>`

const COMMON = `
CONTEXTO: Alexandria v2 (rota /alexandria), "atlas vivo do conhecimento em energia". A Home (Peça A) já vence o North Star às cegas (3×0) há três rodadas, mas o critic Craft reprova porque o GLOBO do currículo (render Blender com letreiro) lê como COLAGEM sobre a gravura sépia do Titã: outro material, outra luz, navy de render com brilho de borda e hachura mecânica, sem sombra de contato nas mãos. LEIA o brief: ${DOCS}/briefs/piece-A-r06.md.
ESTADO ATUAL: ${DOCS}/captures/A/r05/home-E2-1440.png, home-E2b-1440.png, home-E0-1440.png, home-E2-390.png, closing-home-E2-1920.png, closing-home-E2-3440.png. North Star (painel Home, piso; NÃO envie ao Higgsfield): ${DOCS}/captures/reference/north-star-home-panel.png.
ATIVOS r05: ${R05}/globo/ (renders V1–V3 × D400–D2000, âncoras, compor_r05.py, globo_r05.py, provenance) e ${R05}/integracao/ (integrar_r05.py, camadas de prancha/mãos por formato em public/alexandria/v2/home/: home-prancha-*, home-maos-*, home-globo-*). Código: ${WT}/src/components/alexandria/home/.
PORTÕES DE FIDELIDADE: IoU das costas ≥ 0,95 contra a máscara r05; desvio das 17 estações < 1% do diâmetro (detecte os discos na imagem final); estações em terra; nenhum texto gerado; nenhuma massa parecida com continente real. Se a geometria mover, REMEÇA na imagem final e regenere o JSON (nunca force a imagem ao dado).
FERRAMENTAS: Higgsfield via ToolSearch "select:${HF}models_explore,${HF}generate_image,${HF}generate_image_batch,${HF}jobs_wait,${HF}balance,${HF}media_upload,${HF}media_confirm,${HF}upscale_image" (catálogo justificado; get_cost; use_unlim:false; imagens SUAS desta wave podem ser referência). Blender com trava de GPU: ${GPU}. Python PIL/numpy/OpenCV. Playwright: createRequire('${PW}'). Registre proveniência (<pasta>/provenance.json) e créditos (não economize em qualidade). OLHE na escala exibida (globo ~380 CSS px a 1440 DPR1/DPR2; ~300 a 390; ~630 a 3440). Trabalhe só em ${LAB}/. Não toque src/, public/, git.`

const OUT = { type: 'object', properties: { summary: { type: 'string' }, variants: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, e2_1440: { type: 'string' }, e2_1440_dpr2: { type: 'string' }, e2_390: { type: 'string' }, gates: { type: 'string' }, recipe: { type: 'string' } }, required: ['id', 'e2_1440', 'e2_390', 'gates', 'recipe'] } }, creditsSpent: { type: 'string' }, risks: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'variants', 'creditsSpent'] }

phase('Media')
const media = await agent(`${COMMON}
TAREFA — TRÊS CAMINHOS DE UNIDADE (vista V1, estado E2). Pasta ${LAB}/variantes/.
Monte a composição sem letreiro (prancha + globo + mãos, como no produto a 1440×900 e a 390×844) e produza:
(1) REESTILIZAÇÃO da composição inteira por image-to-image — teste GPT Image 2.5 e Nano Banana Pro — pedindo UMA só gravura em cobre: navy como segunda tinta de impressão (traço e pontilhado navy sobre o papel, não navy chapado), terras em sépia com relevo em hachura, luz única do céu gravado, sombra de contato das mãos no globo, sem brilho de borda, sem texto. Recorte o disco e aplique os portões; se passar, recoloque só o disco (e a sombra de contato) sobre a prancha original para não mudar o Titã.
(2) UNIFICAÇÃO POR COMPOSIÇÃO (sem IA): gradação sépia + duotom navy calibrado à tinta da prancha, meio-tom em traço com o mesmo passo e ângulo da hachura da prancha, sombra de contato das mãos, grão e textura de papel comuns, remoção do brilho de borda.
(3) HÍBRIDO: reestilização só do disco com a prancha como referência de estilo + composição do (2).
Para cada caminho que passar nos portões, capture no contexto com o letreiro atual (pode reutilizar o HTML/pipeline do produto ou uma composição estática fiel): var-<id>-1440.png, var-<id>-1440-dpr2.png (recorte do globo), var-<id>-390.png. Inclua var-r05-* (estado atual) no mesmo formato. Registre os portões medidos por variante.`, { label: 'media:unidade', phase: 'Media', schema: OUT, effort: 'high' })

if (!media || !(media.variants ?? []).length) {
  log('frente de mídia sem variantes: parando antes do julgamento')
  return { media, judged: null, final: null }
}

phase('Judge')
const vars = media.variants
const cand = vars.map((v, i) => `V${i + 1}: ${v.e2_1440} | ${v.e2_1440_dpr2 ?? ''} | ${v.e2_390}`).join(' ;; ')
const varMap = Object.fromEntries(vars.map((v, i) => [`V${i + 1}`, v.id]))
const JUDGE = { type: 'object', properties: { ranking: { type: 'array', items: { type: 'object', properties: { image: { type: 'string' }, rank: { type: 'number' }, why: { type: 'string' } }, required: ['image', 'rank', 'why'] } }, bestGap: { type: 'string' } }, required: ['ranking', 'bestGap'] }
const judged = await parallel([
  ['unidade', 'UNIDADE DE MATERIAL: globo e Titã parecem impressos na MESMA chapa (mesma luz, tinta, traço e grão; contato real das mãos); nada lê como colagem, render ou vetor'],
  ['beleza', 'BELEZA E LEGIBILIDADE: a peça central é bela e o globo continua legível como carta (ilhas, estações, letreiro), na escala exibida'],
  ['northstar', 'COMPARAÇÃO COM A REFERÊNCIA: qual candidata fica CLARAMENTE mais bonita que R, e por quê'],
].map(([k, lens]) => () => agent(`Você é um diretor de arte e gravador exigente julgando às cegas variantes da peça central de uma página (globo sustentado por um titã gravado).
Não abra nenhum arquivo além destes; não edite nada. Referência R: ${DOCS}/captures/reference/north-star-home-panel.png.
Variantes (desktop | detalhe em alta densidade | celular): ${cand}
Lente: ${lens}. Ranqueie todas e nomeie a maior lacuna da melhor.`, { label: `judge:${k}`, phase: 'Judge', schema: JUDGE, effort: 'high' })))

phase('Finalize')
const final = await agent(`${COMMON}
Variantes: ${JSON.stringify(media, null, 1)}
Julgamento cego (rótulos → id: ${JSON.stringify(varMap)}): ${JSON.stringify(judged, null, 1)}
TAREFA — FINALIZAR. Some os rankings (empate: a lente "unidade" decide). Se a vencedora for var-r05, NÃO produza globo novo: registre a decisão em ${LAB}/DECISAO.md e devolva. Senão, produza a vencedora (corrigindo a maior lacuna) para todas as vistas (V1, V2, V3) e tamanhos (D400–D2000) E para os formatos de prancha/mãos usados no produto (16:9/21:9/32:9 e retrato 390/768), com sombra de contato por formato, JSON de coordenadas REMEDIDO na imagem final por tamanho, âncoras regeneradas (reaproveite ancoras_r05.py), folha de comparação r05 × r06 na escala exibida, e o pipeline de integração pronto em ${LAB}/integracao/ (parta de ${R05}/integracao/integrar_r05.py) sem tocar public/ ou src/ — o builder aplica. Proveniência completa em ${LAB}/.`, { label: 'finalize', phase: 'Finalize', schema: OUT, effort: 'high' })
return { media, judged, varMap, final }
