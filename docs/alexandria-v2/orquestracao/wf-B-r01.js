export const meta = {
  name: 'alexandria-v2-pieceB-r01-media',
  description: 'Piece B round 1 (media first): territory plates, emblems and trail maps from the globe geometry, static composites, blind judging (integration later)',
  phases: [
    { title: 'Media', detail: 'territory plates + emblems · trail maps from globe geometry' },
    { title: 'Compose', detail: 'static comps of Trilhas hub and Trail I map' },
    { title: 'Judge', detail: '3 blind lenses vs North Star Trilhas panel and current screens' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const LAB = `${WT}/docs/alexandria-v2/media-lab/B-r01`
const DOCS = `${WT}/docs/alexandria-v2`
const HF = 'mcp__1bd778ac-f4ca-47cf-b235-8be5dc610f70__'
const PW = 'C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json'
const GPU = `python ${DOCS}/media-lab/_ferramentas/gpu_lock.py -- "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P <script.py> -- <args>`

const COMMON = `
CONTEXTO: Alexandria v2 (rota /alexandria), currículo de energia da NIVAR: "atlas vivo do conhecimento em energia" (gravura a buril, cartografia histórica, caderno de campo; comportamento de produto contemporâneo). Paleta: pergaminho #F2E9D6, creme #FBF6EA, creme afundado #E7DAC0, navy #0D2340/#071628, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara), oliva #55663F. Cinzel (identidade) + Lora (conteúdo).
FOUNDER: "use Blender e Higgsfield ao máximo; não use SVG quando imagem e Blender resolvem; quero igual ou MAIS BONITO que o North Star; imagens verdadeiras são muito boas também; não precisa economizar créditos".
PEÇA B (LEIA): ${DOCS}/briefs/piece-B.md e ${DOCS}/bar.md §3 (B1–B6), S1–S7, §6, §7, e as decisões ${DOCS}/decisoes/ (P18, P22, P24, P25).
NORTH STAR painel Trilhas: ${DOCS}/captures/reference/north-star-trilhas-panel.png (piso; não copiar os três painéis iguais). Telas atuais (baseline): ${DOCS}/captures/B/r00-baseline/ (trilhas-E2-1440.png, mapa-E2-1440.png, *-390.png). Família visual já aprovada (Home): ${DOCS}/captures/A/r03/home-E2-1440.png e home-E2b-1440.png (e r04 se existir em ${DOCS}/captures/A/r04/).
GEOMETRIA DO GLOBO (as trilhas SÃO as três ilhas do globo do currículo): ${DOCS}/media-lab/A-r03/globo/ (textura/geometria.json com estações, rota, pontes, rótulos e regiões em lon/lat; textura/carta-final-8k.png, mascara-terra-8k.png; carta_textura.py, carta_geometria.py, globo_r03.py, compor_gravura.py). Se ${DOCS}/media-lab/A-r04/globo/ existir, use o material mais recente. I = escudo em ferradura em volta de uma grande baía (M01–M05); II = ilha longa com rio principal, península norte e estuário (M06–M12); III = ilha alta com fiordes e coroa de ilhotas (M13–M17).
CONTEÚDO: catálogo canônico C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md; ${WT}/src/lib/data/alexandria-trilhas.ts, alexandria-curriculo.ts (SÓ LEITURA); extração em ${DOCS}/extraction/ (laboratórios, casos, quizzes por módulo, quando existir).
IMAGENS REAIS APROVADAS: ${DOCS}/media-lab/fontes-reais/CATALOGO.md (trilhas-territorios/, brasil-sistema-eletrico/, atlas-gravuras-identidade/).
REGRAS DE MÍDIA: nenhum texto em imagem gerada; nenhuma instalação real identificável em imagem gerada; nada de raios/hologramas/"energia brilhando"; atmosfera nunca cobre dado; foto real = documental com crédito e legenda factual; sem gradiente/glow/sombra de UI em CSS; raio 0.
HIGGSFIELD: ToolSearch "select:${HF}models_explore,${HF}generate_image,${HF}generate_image_batch,${HF}jobs_wait,${HF}balance,${HF}media_upload,${HF}media_confirm,${HF}upscale_image,${HF}reframe,${HF}outpaint_image" (catálogo consultado e justificado; get_cost; use_unlim:false; imagens SUAS desta wave podem ser referência; NUNCA envie o North Star). Blender com trava de GPU: ${GPU}. Playwright: createRequire('${PW}') → chromium.launch({headless:true, channel:'chrome'}). Python PIL.
PROVENIÊNCIA: <pasta>/provenance.json (uma linha por asset candidato, todos os campos). Olhe tudo NA ESCALA DE EXIBIÇÃO. Trabalhe só em ${LAB}/ (crie). Não toque src/, public/, git.`

const MEDIA_OUT = { type: 'object', properties: { summary: { type: 'string' }, deliverables: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, role: { type: 'string' }, notes: { type: 'string' } }, required: ['file', 'role'] } }, creditsSpent: { type: 'string' }, risks: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'deliverables', 'creditsSpent', 'risks'] }

phase('Media')
const [pranchas, mapas] = await parallel([
  () => agent(`${COMMON}
TAREFA — PRANCHAS E EMBLEMAS DOS TERRITÓRIOS. Pasta ${LAB}/territorios/.
Cada trilha precisa de caráter visual próprio que funcione mesmo com os títulos cobertos (B1), coerente com a Home (gravura sépia + navy):
(a) PRANCHA de cada território (desktop larga ~16:9/21:9 e retrato/recorte para 390): uma "vista" gravada da própria ilha do globo — I: a baía em ferradura com as leis e instrumentos da física (sem aparelhos anacrônicos absurdos); II: o grande rio, o vale e o estuário do setor elétrico (represas, linhas e subestações GENÉRICAS, não identificáveis); III: as terras altas com fiordes e ilhotas, lugar de visão estratégica (observatório/farol/carta de navegação; mercados como porto) — sempre sem texto. Gere e itere até cada prancha ser no mínimo tão bela quanto as ilustrações do North Star, e distintas entre si.
(b) VARIANTE COM IMAGEM REAL: para cada território, avalie 1–2 imagens reais aprovadas do catálogo como alternativa (ou complemento documental) e monte a versão (com crédito).
(c) EMBLEMA de cada território: marca gravada pequena (legível a 24–48 CSS px), sem escudo/brasão/coroa/louro/cartela, coerente com as estações de latão do globo; fundo transparente; pode ser Blender (relevo) ou gravura.
Entregue pranchas (web 2x + original), recortes 390, emblemas (48/96/192 px), folha de contato, provenance.json e créditos.`, { label: 'media:territorios', phase: 'Media', schema: MEDIA_OUT, effort: 'high' }),
  () => agent(`${COMMON}
TAREFA — MAPAS DAS TRILHAS. Pasta ${LAB}/mapas/.
O mapa da trilha (B3) é território ocupado, não diagrama: gere, a partir da GEOMETRIA DO GLOBO, a carta plana gravada de cada ilha (I obrigatória; II e III também) numa projeção local adequada (ex.: azimutal centrada na ilha), no mesmo material de gravura do globo (mar em linhas navy sobre papel ou navy com traço claro, water-lining, relevo em perfil, rios, florestas, estrada), em alta resolução para 1440 (área ~1100×700 CSS px, DPR 2) e 390 (retrato). As estações dos módulos são povoados/praças; a estrada liga as estações em ordem; ENTRE estações, marque waypoints das AULAS de cada módulo (quantidade real do catálogo: use alexandria-curriculo.ts) ao longo da estrada, para o produto poder desenhar "7 de 42 aulas percorridas" no próprio mapa. Marque também lugares para os marcos de tipo por módulo (laboratório, caso, avaliação, experiência jogável em desenho) como pequenos pontos de interesse sem texto. Nenhum texto na imagem.
Exporte por mapa um JSON (px e %) com: estações dos módulos, waypoints de aula (aulaId na ordem), marcos por módulo, polilinha da estrada (densa), âncoras de rótulo (arco/linha para o nome de cada módulo, sem colisão) e bbox da ilha. Faça sobreposição de verificação (JSON × imagem) e folha de contato. Use Blender (render ortográfico da textura/relevo com luz rasante) e/ou pipeline 2D a partir da textura 8K; Higgsfield só para enriquecer traço com fidelidade medida (IoU das costas ≥ 0,95).`, { label: 'media:mapas', phase: 'Media', schema: MEDIA_OUT, effort: 'high' }),
])

phase('Compose')
const COMP_OUT = { type: 'object', properties: { composites: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, trilhas_e2_1440: { type: 'string' }, trilhas_e2b_1440: { type: 'string' }, trilhas_e0_1440: { type: 'string' }, trilhas_e2_390: { type: 'string' }, mapa_e2_1440: { type: 'string' }, mapa_e1_1440: { type: 'string' }, mapa_e2_390: { type: 'string' }, recipe: { type: 'string' } }, required: ['id', 'trilhas_e2_1440', 'mapa_e2_1440', 'mapa_e2_390', 'recipe'] } }, notes: { type: 'string' } }, required: ['composites', 'notes'] }
const composed = await agent(`${COMMON}
Mídia: TERRITÓRIOS ${JSON.stringify(pranchas, null, 1)}
MAPAS ${JSON.stringify(mapas, null, 1)}
TAREFA — COMPOSIÇÕES ESTÁTICAS DA PEÇA B. Pasta ${LAB}/compose/. Monte 2–3 variantes (HTML file://, com o shell/header real da Home r03/r04: marca, nav com TRILHAS ativo, busca, progresso; localizador "Início › Trilhas") das duas telas, com conteúdo real e estados das fixtures (E2: M01·A01–A07 concluídas, A08 em leitura → Trilha I atual, 7 de 42 aulas percorridas; E2b: Trilha I inteira percorrida, M06·A01 em leitura → Trilha II atual; E0: visitante, ponto de partida; E1: conta sem eventos):
- /alexandria/trilhas: três territórios desiguais (o atual domina — B2 — inclusive em cinza), cada um com visão de mundo, 2–3 perguntas e 3–5 capacidades com verbo observável derivadas da fonte (camada Alexandria, marque no comp com um data-atributo), o campo (módulos reais), a prancha e o emblema; contagens numa linha de aparato; uma ação principal nomeando objeto ("Continuar · M01·A08 — …") ; nenhum mock ("480 pontos" etc. não existe).
- /alexandria/trilha/trilha-fundamentos-universais: a carta da ilha I como palco (B3), estações dos 5 módulos com nome (letreiro de carta, sem caixas), waypoints de aula com estado (percorrida ● / em leitura ◐ / a seguir ○), exatamente um "você está aqui", trecho percorrido a tinta, marcos de tipo com silhueta e rótulo honesto ("experiência jogável em desenho" como linha de metadado, sem controle; M08 é "Exercício de decisão"), ação principal abrindo o nó atual, legenda de estados e de classe da imagem, e um sumário textual equivalente (lista acessível) — a 390 alternância "Mapa | Sumário" ou eixo vertical.
Capture com nomes neutros (comp-N-trilhas-e2-1440.png, comp-N-trilhas-e2b-1440.png, comp-N-trilhas-e0-1440.png, comp-N-trilhas-e2-390.png, comp-N-mapa-e2-1440.png, comp-N-mapa-e1-1440.png, comp-N-mapa-e2-390.png). Olhe e corrija antes de entregar (≥ 11px, contraste, nada cortado, nada sob a barra de abas a 390).`, { label: 'compose:B', phase: 'Compose', schema: COMP_OUT, effort: 'high' })

phase('Judge')
const JUDGE_OUT = { type: 'object', properties: { ranking: { type: 'array', items: { type: 'object', properties: { image: { type: 'string' }, rank: { type: 'number' }, why: { type: 'string' } }, required: ['image', 'rank', 'why'] } }, vsReference: { type: 'string' }, biggestGapOfBest: { type: 'string' } }, required: ['ranking', 'vsReference', 'biggestGapOfBest'] }
const comps = composed?.composites ?? []
const cand = comps.map((c, i) => `P${i + 1}: trilhas ${c.trilhas_e2_1440} | mapa ${c.mapa_e2_1440} | celular ${c.mapa_e2_390}`)
cand.push(`P${comps.length + 1}: trilhas ${DOCS}/captures/B/r00-baseline/trilhas-E2-1440.png | mapa ${DOCS}/captures/B/r00-baseline/mapa-E2-1440.png | celular ${DOCS}/captures/B/r00-baseline/mapa-E2-390.png`)
const labelMap = Object.fromEntries([...comps.map((c, i) => [`P${i + 1}`, `comp:${c.id}`]), [`P${comps.length + 1}`, 'r00']])
const LENSES = [
  ['presenca', 'PRESENÇA E IDENTIDADE (cada trilha é um território com caráter próprio; sensação de lugar)'],
  ['informacao', 'O TERRITÓRIO TRABALHA (dá para ler onde o aluno está, o que já percorreu, o que vem, e os marcos; a trilha atual domina; nada parece banco de dados)'],
  ['acabamento', 'ACABAMENTO E COERÊNCIA (gravura/imagem na escala exibida, letreiro de carta, coerência com a família visual, nada de template/placeholder)'],
]
const judged = await parallel(LENSES.map(([key, lens]) => () => agent(`Você é um diretor de arte exigente julgando às cegas telas de TRILHAS e MAPA de trilha de um produto educacional autoral de energia.
Não abra nenhum arquivo além destes. Não edite nada.
Referência R: ${DOCS}/captures/reference/north-star-trilhas-panel.png
Candidatas: ${cand.join(' ;; ')}
Lente principal: ${lens}. Ranqueie as candidatas (P*), diga para cada uma se é CLARAMENTE mais bonita, igual ou abaixo de R e por quê (termos observáveis), e a maior lacuna da melhor.`, { label: `judge:${key}`, phase: 'Judge', schema: JUDGE_OUT, effort: 'high' })))
return { pranchas, mapas, composed, judged, labelMap }