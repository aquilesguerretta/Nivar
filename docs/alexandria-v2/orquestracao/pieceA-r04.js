export const meta = {
  name: 'alexandria-v2-pieceA-r04',
  description: 'Piece A round 4: display-scale engraved globe + cartographic lettering, layered plate (classes), wide/mobile compositions, blind judging, integration with A5/A2/S7 fixes + capture',
  phases: [
    { title: 'Media', detail: 'engraved globe at display scale · plate layers + wide/portrait crops' },
    { title: 'Compose', detail: 'lettering variants at 1280/1440/390/3440, E0/E2/E2b' },
    { title: 'Judge', detail: '3 blind lenses vs North Star and r03' },
    { title: 'Integrate', detail: 'builder integrates + gates + capture r04' },
  ],
}

const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const LAB = `${WT}/docs/alexandria-v2/media-lab/A-r04`
const R03 = `${WT}/docs/alexandria-v2/media-lab/A-r03`
const REAIS = `${WT}/docs/alexandria-v2/media-lab/fontes-reais`
const BLENDER = '"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe"'
const PW = 'C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json'
const HF = 'mcp__1bd778ac-f4ca-47cf-b235-8be5dc610f70__'
const CAP = `${WT}/docs/alexandria-v2/captures/A`

const COMMON = `
CONTEXTO: Alexandria v2 é o currículo de energia da NIVAR (rota /alexandria), redesenhado como "atlas vivo do conhecimento em energia": caráter de atlas científico, gravura a buril, cartografia histórica, caderno de campo, com comportamento de produto contemporâneo. Paleta: pergaminho #F2E9D6 / creme superfície #FBF6EA / creme afundado #E7DAC0, navy #0D2340 / navy profundo #071628, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara), oliva #55663F. Tipografia da casa: Cinzel (identidade, caixa alta espaçada) e Lora (conteúdo; versalete/algarismos para aparato).
FOUNDER: "use Blender e Higgsfield ao máximo; não use SVG quando imagem e Blender resolvem; quero igual ou MAIS BONITO que o North Star". Aprovou a direção Titã + globo + gravura sépia + faixa navy. Comprou +2000 créditos Higgsfield: NÃO economize — itere até ficar excelente (registre o gasto). Pediu também imagens reais quando fizer sentido.
NORTH STAR: ${WT}/docs/alexandria-v2/north-star/ALEXANDRIA_V2_VISUAL_NORTH_STAR_01.png (painel Home: ${WT}/docs/alexandria-v2/captures/reference/north-star-home-panel.png). É piso. NÃO envie o North Star ao Higgsfield; descreva o estilo em texto.
ESTADO ATUAL (r03, no produto): ${CAP}/r03/home-E2-1440.png, home-E0-1440.png, home-E2b-1440.png, home-E2-390.png, home-E0-390.png, home-E2-390-scroll-f01.png, closing-home-E2-1280.png, closing-home-E2-1920.png, closing-home-E2-3440.png, account-load-E2-1440-f02.png e f03.png.
BRIEF DESTA RODADA (LEIA INTEIRO): ${WT}/docs/alexandria-v2/briefs/piece-A-r04.md. Em resumo: nos cegos a r03 venceu o North Star 3×0 com margem clara, mas o critic Craft reprovou porque, NA ESCALA EXIBIDA (~400 CSS px), o globo lê como esfera navy chapada com ~20 etiquetas brancas retangulares (infográfico sobre gravura), e os continentes não se leem como terra. Brief e System reprovaram 390 (selo e marcador nunca juntos, torso sem função, rótulo cortado), salto de layout no carregamento de fontes (A5), 3440 pior que 1920 (faixa vazia, rosto do Titã cortado), e prancha única com duas classes de mídia.
ATIVOS r03 (reuse): globo ${R03}/globo/ (globo_r03.py, compor_gravura.py, carta_textura.py, textura/carta-final-8k.png, mascara-terra-8k.png, geometria.json, renders V1/V2/V3 + JSONs), prancha ${R03}/prancha/ (desktop-16x9-tita-monumental-A/B.png, mobile-3x4-tita-monumental-A.png, mobile-3x4-tita-recorte-B.png, *.sphere.json com elipse, *.hands.png, medir_esfera.py, simular_hero.py), integração ${R03}/integracao/compor_home_r03.py, composições ${R03}/compose/ (hero.html, dados.js, capturar.mjs). Código atual: ${WT}/src/components/alexandria/home/GloboCurriculo.tsx, rotulosGlobo.ts, geometriaGlobo.ts, EntradaBlocos.tsx, FaixaTrilhas.tsx, ${WT}/src/pages/alexandria/AlexandriaHome.tsx.
IMAGENS REAIS APROVADAS (licença verificada): ${REAIS}/CATALOGO.md (e provenance.json/verificacao.json por frente). Em especial ${REAIS}/atlas-gravuras-identidade/ (atl-01 Utopiae Typus de Ortelius — PD; atl-02 frontispício do Atlas de Mercator 1595 — PD).
REGRAS DE MÍDIA (inegociáveis): nenhuma letra/número/texto dentro de imagem gerada; nenhuma instalação real identificável em imagem gerada; nada de raios de energia/hologramas/"energia brilhando"; atmosfera nunca cobre dado, rótulo ou posição; imagem gerada nunca apresentada como documento. O globo é MODELO do currículo (nenhuma massa lembra continente real). Sem gradiente/glow/vidro/sombra de UI em CSS (esmaecimento só dentro dos pixels). Raio 0 fora de círculo.
HIGGSFIELD: ToolSearch "select:${HF}models_explore,${HF}generate_image,${HF}generate_image_batch,${HF}jobs_wait,${HF}media_upload,${HF}media_confirm,${HF}balance,${HF}upscale_image,${HF}reframe,${HF}outpaint_image". Consulte o catálogo e justifique o modelo por artefato; get_cost para preflight; use_unlim:false. Referência image-to-image só com imagens SUAS desta wave (media_upload .png → curl PUT → media_confirm). Baixe com curl. Registre balance antes/depois.
PROVENIÊNCIA: <pasta>/provenance.json com uma linha por asset candidato (asset_id, file, tipo, classe, modelo, catalogo_consultado 2026-09-16, prompt completo, parâmetros, job_id, url_origem, data, credits, aceito sim/não, motivo).
Trabalhe só dentro de ${LAB} (crie). Não toque src/, public/, nem faça git add/commit.
OLHE as imagens de verdade (Read), sempre NA ESCALA EM QUE SERÃO EXIBIDAS (reduza para o tamanho CSS × DPR 1 e × DPR 2 e olhe as duas). Python PIL disponível; Playwright com Chrome do sistema: createRequire('${PW}') → require('playwright').chromium.launch({headless:true, channel:'chrome'}).
Blender 5.2.1 headless (Bash): ${BLENDER} -b --factory-startup -P <script.py> -- <args>; Cycles/OptiX na RTX 4070 (após read_factory_settings: prefs=bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type='OPTIX'; prefs.get_devices(); ligue os devices; scene.cycles.device='GPU').`

const MEDIA_OUT = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    deliverables: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, role: { type: 'string' }, width: { type: 'number' }, height: { type: 'number' }, notes: { type: 'string' } }, required: ['file', 'role'] } },
    modelChoices: { type: 'array', items: { type: 'string' } },
    creditsSpent: { type: 'string' },
    rejected: { type: 'array', items: { type: 'string' } },
    risks: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'deliverables', 'creditsSpent', 'risks'],
}

phase('Media')
const [globo, prancha] = await parallel([
  () => agent(`${COMMON}

TAREFA — GLOBO EM GRAVURA NA ESCALA DE EXIBIÇÃO. Pasta: ${LAB}/globo/.
Mantenha a geometria r03 (três ilhas, 17 estações, rota, vistas V1/V2/V3 com os três territórios) e os JSONs de coordenadas (regere-os se mudar câmera/tamanho), mas refaça o MATERIAL para que o globo leia como gravura a buril do mesmo "cobre" que o Titã quando exibido pequeno:
- Renderize por TAMANHO DE EXIBIÇÃO (não reduza um arquivo grande): diâmetros-alvo em px de dispositivo ≈ 520, 800, 1040, 1400 e 2000 (cobre 260–700 CSS px × DPR 1–2). Em cada tamanho, o passo das linhas de hachura deve ficar ≈ 3–4 px de dispositivo (ajuste a frequência ao tamanho).
- MAR: teste pelo menos duas soluções e escolha olhando na escala: (a) navy como GRAVURA DE LINHAS sobre papel (linhas navy paralelas que engrossam na sombra e se fundem no terminador; papel visível entre as linhas nas áreas iluminadas; water-lining concêntrico junto às costas); (b) navy mais escuro com traço claro visível. A identidade navy precisa continuar evidente.
- Luz coerente com a prancha (raios gravados vêm do alto/atrás do Titã — confira na prancha r03), terminador em contra-hachura, limbo com traço de contorno.
- TERRA: relevo sombreado em hachura legível na escala (montanhas em perfil maiores e menos numerosas, rios e florestas que sobrevivam à redução), costas com linha de costa marcada e 3–5 linhas d'água; pergaminho da terra com o mesmo tom do papel da prancha.
- Estações: discos de latão legíveis (≥ 7 px de dispositivo no menor tamanho), sem brilho que pareça estado.
- NÃO desenhe texto na imagem. Exporte também, por vista, um JSON de "âncoras de letreiro": para cada território uma polilinha/arco (≥ 12 pontos) ao longo do eixo da ilha, visível, onde um nome em textPath caberia; para cada estação o lado preferido do código (N/NE/E/…) livre de terra densa e de outras estações.
- Pode usar Higgsfield (image-to-image) para enriquecer traço, desde que a geometria fique fiel (meça IoU das costas ≥ 0,95 e desvio das estações < 1% do diâmetro); pode também gerar uma textura de hachura/papel real para multiplicar.
- Compare lado a lado, NA ESCALA DE EXIBIÇÃO: globo r03 × globo r04 × globo do North Star (recorte do painel). Itere até o r04 ser claramente mais "gravura" que o r03 e igual ou melhor que o do North Star em material. Entregue a folha de comparação.`, { label: 'media:globo-escala', phase: 'Media', schema: MEDIA_OUT, effort: 'high' }),

  () => agent(`${COMMON}

TAREFA — PRANCHA EM CAMADAS + COMPOSIÇÕES LARGA E RETRATO. Pasta: ${LAB}/prancha/.
1) CAMADAS (para separar classes de mídia no produto): a partir das finalistas r03 (desktop B e mobile recorte-B, as que estão no produto; avalie também a A), produza para cada formato: (i) PRANCHA (atmosfera) com a esfera substituída por céu/fundo coerente ou mantida atrás (o globo cobre), (ii) MÃOS/DEDOS À FRENTE (atmosfera) como PNG com alfa exato sobre a borda do globo, (iii) sphere.json/elipse atualizados. Verifique o encaixe com o globo r03 V1 na escala.
2) LARGURAS GRANDES: produza uma prancha panorâmica para ≥ 1920 e para 3440×1440 (≈ 32:9 e 21:9) em que a gravura (céu, nuvens, paisagem de rios e ilhas, e opcionalmente rosas-dos-ventos gravadas bem leves) se estende para a esquerda, sob a coluna de texto, SEM cortar o rosto/cabeça do Titã e mantendo o globo com diâmetro proporcional (≈ 45–55% da altura útil). Use outpaint/reframe do Higgsfield a partir da SUA prancha (maior resolução disponível) e/ou upscale; itere até a extensão ser invisível. Área atrás do texto: lavagem de papel embutida nos pixels (legibilidade de texto 16–48px), sem gradiente CSS.
3) RETRATO 390: uma prancha retrato onde o globo inteiro + cabeça/ombros/mãos do Titã cabem em ~300–380 CSS px de altura (sem torso longo), com céu mínimo acima; e variante 768.
4) Folhas de contato na escala (1280, 1440, 1920, 3440, 390, 768) simulando o hero com a coluna de texto (pode reutilizar simular_hero.py).
Registre medidas (esfera, elipse, mãos) por arquivo.`, { label: 'media:prancha-camadas', phase: 'Media', schema: MEDIA_OUT, effort: 'high' }),
])
log('mídia r04: ' + [['globo', globo], ['prancha', prancha]].map(([k, v]) => `${k}=${v ? 'ok' : 'falhou'}`).join(' · '))

phase('Compose')
const COMP_OUT = {
  type: 'object',
  properties: {
    composites: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, e2_1440: { type: 'string' }, e0_1440: { type: 'string' }, e2b_1440: { type: 'string' }, e2_390: { type: 'string' }, e0_390: { type: 'string' }, e2_1280: { type: 'string' }, e2_3440: { type: 'string' }, recipe: { type: 'string' } }, required: ['id', 'e2_1440', 'e2_390', 'e2_3440', 'recipe'] } },
    notes: { type: 'string' },
  },
  required: ['composites', 'notes'],
}
const composed = await agent(`${COMMON}

TAREFA — COMPOSIÇÕES ESTÁTICAS r04 COM LETREIRO CARTOGRÁFICO. Pasta: ${LAB}/compose/ (parta de ${R03}/compose/hero.html, dados.js e capturar.mjs).
Mídia r04: GLOBO ${JSON.stringify(globo, null, 1)}
PRANCHA ${JSON.stringify(prancha, null, 1)}
Monte 2–3 variantes de LETREIRO sobre as camadas (prancha → globo → mãos), com o conteúdo real da Home r03 (header, eyebrow, H1, lede, cartão+ação fundidos, faixa navy, legenda de classe legível ≥ 12px, contraste ≥ 4,5:1), e capture com nomes neutros (comp-N-e2-1440.png, comp-N-e0-1440.png, comp-N-e2b-1440.png, comp-N-e2-390.png, comp-N-e0-390.png, comp-N-e2-1280.png, comp-N-e2-3440.png):
- Sem caixas retangulares brancas. Nomes de território como letreiro de carta: Cinzel caixa alta espaçada (ou Lora versalete itálico), creme com halo navy sobre o mar / tinta com halo de papel sobre a terra (paint-order: stroke; nunca text-shadow), seguindo o arco da ilha via SVG textPath (âncoras do JSON) numa variante e horizontal na outra.
- Códigos das estações: numerais pequenos (≥ 11px), com halo, no lado preferido; hierarquia: estação atual e as do território atual mais fortes; demais mais leves (mas legíveis).
- Selo de posição no registro da carta (ex.: cartucho/filactério tipográfico com fio fino, ou letreiro com fio-guia), a coisa mais legível do objeto, sem cobrir estações.
- Estados: percorrido ● / atual ◎ / a seguir ○ / em curso ◐ / ponto de partida (bandeira) — em E0 a bandeira precisa ser visível e digna.
- 390: no 1º viewport (844 px, barra de abas de ~64 px no pé) o marcador atual + selo + nome do território atual inteiros e acima da barra; nenhum rótulo cortado; figura recortada (cabeça/ombros).
- 3440 e 1280: nada cortado, rosto do Titã inteiro, sem faixa vazia > 30%, letreiro proporcional (pode escalar com clamp).
- Posições determinísticas por vista/largura (tabela), verificadas por colisão (retângulos de texto × marcadores × bordas × barra de abas).
Olhe cada PNG, corrija, e descreva a receita.`, { label: 'compose:letreiro-r04', phase: 'Compose', schema: COMP_OUT, effort: 'high' })

phase('Judge')
const JUDGE_OUT = {
  type: 'object',
  properties: {
    ranking: { type: 'array', items: { type: 'object', properties: { image: { type: 'string' }, rank: { type: 'number' }, why: { type: 'string' } }, required: ['image', 'rank', 'why'] } },
    vsReference: { type: 'string' },
    biggestGapOfBest: { type: 'string' },
  },
  required: ['ranking', 'vsReference', 'biggestGapOfBest'],
}
const comps = composed?.composites ?? []
const pool = [
  ...comps.map((c) => ({ key: `comp:${c.id}`, d: c.e2_1440, m: c.e2_390, w: c.e2_3440 })),
  { key: 'r03', d: `${CAP}/r03/home-E2-1440.png`, m: `${CAP}/r03/home-E2-390.png`, w: `${CAP}/r03/closing-home-E2-3440.png` },
]
const order = pool.map((p, i) => ({ ...p, label: `P${i + 1}` }))
const rotated = order.slice(1).concat(order.slice(0, 1))
const LENSES = [
  ['presenca', 'PRESENÇA E IDENTIDADE (entrar num mundo, objeto monumental, identidade memorável)'],
  ['informacao', 'O OBJETO TRABALHA (ler no próprio objeto onde o aluno está, os três territórios e o caminho; informação integrada à beleza, não colada)'],
  ['acabamento', 'ACABAMENTO E COERÊNCIA DE MATERIAL NA ESCALA EXIBIDA (a peça central é da mesma gravura que a figura; letreiro de carta, não etiqueta de UI; nada parece placeholder/vetor liso/CGI colado)'],
]
const judged = await parallel(LENSES.map(([key, lens]) => () => agent(`Você é um diretor de arte exigente julgando às cegas páginas de ENTRADA de um produto educacional autoral de energia.
Não abra nenhum arquivo além destes. Não edite nada.
Referência R: ${WT}/docs/alexandria-v2/captures/reference/north-star-home-panel.png
Candidatas (desktop 1440 | celular 390 | tela ultralarga 3440): ${rotated.map((p) => `${p.label}: ${p.d} | ${p.m} | ${p.w}`).join(' ;; ')}
Lente principal: ${lens}. Ranqueie as candidatas (P*) e diga, para cada uma, se é CLARAMENTE mais bonita, igual ou abaixo de R, e por quê, em termos observáveis. Nomeie a maior lacuna da melhor. Não premie ornamento que atrapalha a leitura.`, { label: `judge:${key}`, phase: 'Judge', schema: JUDGE_OUT, effort: 'high' })))
const labelMap = Object.fromEntries(rotated.map((p) => [p.label, p.key]))

phase('Integrate')
const INT_OUT = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    chosen: { type: 'string' },
    filesChanged: { type: 'array', items: { type: 'string' } },
    assetsPublished: { type: 'array', items: { type: 'string' } },
    gateFixes: { type: 'array', items: { type: 'string' } },
    tsc: { type: 'string' }, detect: { type: 'string' },
    captureDir: { type: 'string' }, legendChecks: { type: 'string' },
    heuristicsBroken: { type: 'array', items: { type: 'string' } },
    knownGaps: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'chosen', 'filesChanged', 'assetsPublished', 'gateFixes', 'tsc', 'detect', 'captureDir', 'legendChecks', 'knownGaps'],
}
const integrated = await agent(`Você é o BUILDER da Peça A (agente LYCEUM), rodada 4.
Diretório: ${WT} (git worktree, branch wave/alexandria-v2-restructure). Não faça commit/git add. Não toque outros worktrees nem arquivos fora da posse da Alexandria (index.html, src/main.tsx, app/ são de outros agentes).
RETOMADA: uma tentativa anterior desta mesma tarefa foi interrompida por limite de uso da conta no meio do trabalho. Podem existir arquivos parciais dela (ex.: ${WT}/src/components/alexandria/home/geometriaCarta.ts, ${LAB}/integracao/). Inspecione o que existe (git status/diff, datas), reaproveite o que estiver correto e complete ou refaça o resto; não deixe nada meio feito.
SERVIDOR: o dev server em http://127.0.0.1:5311 pode ter sido parado pelo app. Antes de capturar, teste com curl; se estiver fora, suba-o você mesmo em segundo plano (Bash run_in_background): npm --prefix ${WT} run dev -- --host 127.0.0.1 --port 5311 --strictPort, e espere responder 200.
Leia: ${WT}/docs/alexandria-v2/briefs/piece-A-r04.md (LACUNA + GATES), piece-A-r03.md, piece-A-r02.md, piece-A.md, ${WT}/docs/alexandria-v2/bar.md (S1–S7, A1–A6, §6, §7).
Mídia r04: GLOBO ${JSON.stringify(globo, null, 1)}
PRANCHA ${JSON.stringify(prancha, null, 1)}
Composições: ${JSON.stringify(composed, null, 1)}
Julgamento cego (rótulos → origem: ${JSON.stringify(labelMap)}; "r03" é o produto atual): ${JSON.stringify(judged, null, 1)}
TAREFA:
1) Integre a composição vencedora (corrigindo a maior lacuna dos juízes), com pipeline reprodutível em ${LAB}/integracao/: camadas separadas no DOM — prancha (data-media-class="atmosfera"), globo (data-media-class="explicacao", srcset pelos tamanhos de exibição renderizados), mãos à frente (atmosfera) — alinhadas pela geometria; letreiro cartográfico (SVG/HTML, texto real, halo por paint-order/stroke, textPath onde vencer), posições determinísticas por vista × faixa de largura com teste de colisão; estados do registro real (useEstudo) — nunca mock.
2) GATES: (a) A5 — sem salto de layout no carregamento: @font-face de fallback com métrica ajustada (size-adjust/ascent-override/descent-override/line-gap-override para Lora e Cinzel sobre a serifada do sistema) injetado pelo shell da Alexandria e/ou <link rel=preload> das fontes; caixa do objeto reservada (aspect-ratio); rótulos que não dependem da métrica ou só aparecem com document.fonts.ready sem mover o resto. Verifique em account-load-E2-1440 (f02→f05 sem deslocamento da ação principal nem do selo; meça comparando os PNGs). (b) A2 a 390 — no 1º viewport marcador + selo + território atual inteiros acima da barra de abas; nenhum rótulo cortado (E0, E1, E2); figura recortada; "Seu registro" até o 2º viewport. (c) §7 M4 — classes separadas; "Sobre esta figura" com créditos (gravura gerada: modelo/data; globo: render do currículo; e, se couber sem poluir o 1º viewport, as fontes reais da ideia — Utopiae Typus de Ortelius e o frontispício do Atlas de Mercator, de ${REAIS}/atlas-gravuras-identidade/, recortadas sem régua/carimbo, com o crédito exato do provenance/verificacao; publique a derivada web em public/alexandria/v2/home/ e registre em media-provenance.md como sourced-*, classe documental, com factual_review pendente); legenda de classe ≥ 12px e contraste ≥ 4,5:1. (d) S7 — 1920 e 3440 sem faixa vazia > 30%, sem rosto cortado, letreiro proporcional. (e) Foco do PROGRESSO com respiro; bandeira de ponto de partida visível em E0.
3) Assets → ${WT}/public/alexandria/v2/home/ (nomes estáveis; remova os r03 que deixarem de ser usados) + ${WT}/docs/alexandria-v2/media-provenance.md (todas as colunas; factual_review "pendente (orquestrador)"; marque retiradas).
4) \`npx tsc -b\` (0 erros) e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` (0 P0).
5) Captura (dev server http://127.0.0.1:5311): \`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/A/plans/piece-A.json --out docs/alexandria-v2/captures/A/r04 --closing\`. OLHE os PNGs (E0/E1/E2/E2b 1440, 1280, 1920, 3440, 390, 768, rolagens, Tab, account-load), compare com o North Star e com a r03, corrija e recapture. legend.json: horizontalOverflow false; minFontPx ≥ 11 na Home; truncatedText inShell vazio; smallTargets vazio na Home; overflowingElements vazio na Home; cta-*-click → aula; media com classe por camada.
Declare heurísticas quebradas com a razão.`, { label: 'builder:A:r04', phase: 'Integrate', schema: INT_OUT, effort: 'high' })

return { globo, prancha, composed, judged, labelMap, integrated }
