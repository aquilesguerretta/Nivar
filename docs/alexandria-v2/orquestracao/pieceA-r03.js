export const meta = {
  name: 'alexandria-v2-pieceA-r03',
  description: 'Piece A round 3: engraved imaginary-cartography curriculum globe at monumental scale, closer Titan plate, blind judging, integration + gate fixes + capture',
  phases: [
    { title: 'Media', detail: 'engraved globe (Blender + Higgsfield) · closer plate (Higgsfield)' },
    { title: 'Compose', detail: 'static hero composites at 1440/390, E0/E2/E2b' },
    { title: 'Judge', detail: '3 blind lenses vs North Star and r02' },
    { title: 'Integrate', detail: 'builder integrates winner + gate fixes + capture r03' },
  ],
}

const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const LAB = `${WT}/docs/alexandria-v2/media-lab/A-r03`
const R02 = `${WT}/docs/alexandria-v2/media-lab/A-r02`
const BLENDER = '"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe"'
const PW = 'C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json'
const HF = 'mcp__1bd778ac-f4ca-47cf-b235-8be5dc610f70__'

const COMMON = `
CONTEXTO: Alexandria v2 é o currículo de energia da NIVAR (rota /alexandria), redesenhado como "atlas vivo do conhecimento em energia": caráter de atlas científico, gravura a buril, cartografia histórica, caderno de campo, com comportamento de produto contemporâneo. Paleta: pergaminho #F2E9D6 / creme superfície #FBF6EA / creme afundado #E7DAC0, navy #0D2340 / navy profundo #071628, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara), oliva #55663F.
FOUNDER: "use Blender e Higgsfield ao máximo; não use SVG quando imagem e Blender resolvem; quero igual ou MAIS BONITO que o North Star". O Founder viu a Home r02 (Titã ajoelhado sustentando o globo, gravura sépia, faixa navy) e aprovou a direção: "parece bom, continue". A figura e o estilo da prancha r02 ficam.
NORTH STAR: ${WT}/docs/alexandria-v2/north-star/ALEXANDRIA_V2_VISUAL_NORTH_STAR_01.png (painel Home: ${WT}/docs/alexandria-v2/captures/reference/north-star-home-panel.png). É piso. NÃO envie o North Star ao Higgsfield (é do Founder); descreva o estilo em texto.
RODADA 2 (estado atual do produto): ${WT}/docs/alexandria-v2/captures/A/r02/home-E2-1440.png, home-E2b-1440.png, home-E0-1440.png, home-E2-390.png, home-E2-768.png. Brief da rodada 3 (LEIA): ${WT}/docs/alexandria-v2/briefs/piece-A-r03.md.
VEREDITO DA r02 (juízes cegos + critic Craft): "o globo do currículo — a peça que carrega a posição do aluno — é justamente a peça mais fraca: esfera navy lisa com cara de vetor, mancha creme amorfa, só dois quadradinhos I/II, colada no topo de uma gravura rica; material não casa (vetor liso × buril); ~215px; E0 e E2 idênticos no objeto; o Titã domina a miniatura". A carta da r01 foi preferida por 2 de 3 juízes contra a r02 porque CARREGAVA o currículo (17 módulos numerados, rota, estados). A r03 precisa do melhor dos dois: presença da r02 + informação da r01, com acabamento de gravura.
ATIVOS r02 (reuse o que servir): globo Blender ${R02}/globo/ (globo_alexandria.py, JSONs, renders; estilização aceita globo-T1-desktop-gravura.png), globo-carta ${R02}/globo-carta/ (globo_carta.py), composição ${R02}/integracao/compor_home.py (máscara das mãos, recortes, geometria), pranchas ${R02}/prancha/ (desktop-21x9-tita-A.png 3840×1648 com esfera cx 2545 cy 280 r 234 — a esfera tem só ~14% da altura; mobile-3x4-tita-A.png; .sphere.json), matéria ${R02}/materia/ (papel, rosas, cordilheira, costa, nuvens, faixa navy).
REGRAS DE MÍDIA (inegociáveis): nenhuma letra/número/texto dentro de imagem gerada; nenhuma instalação real identificável; nada de raios de energia/hologramas/cidade futurista/"energia brilhando"; gravura/atmosfera nunca cobre dado, rótulo ou posição; imagem gerada nunca é apresentada como documento real. O globo do currículo é um MODELO, não mapa: nenhuma massa de terra pode lembrar continente real (o globo Natural Earth do Atlas é a única imagem geográfica da Home). Sem gradiente/glow/vidro de UI (esmaecimento só dentro da imagem).
HIGGSFIELD: carregue com ToolSearch "select:${HF}models_explore,${HF}generate_image,${HF}generate_image_batch,${HF}jobs_wait,${HF}media_upload,${HF}media_confirm,${HF}balance,${HF}upscale_image,${HF}reframe,${HF}outpaint_image". Antes de gerar: models_explore e escolha justificada por artefato (fidelidade a referência, ausência de texto, resolução, gravura); use get_cost para preflight; use_unlim:false. Para usar imagem SUA (render/prancha r02 gerada nesta wave) como referência: media_upload (.png) → curl PUT → media_confirm(type image). Baixe resultados com curl. Registre balance antes/depois. SALDO: ~347 créditos no início da rodada e ele precisa sobrar para as Peças B e C: teto desta tarefa indicado no prompt; se o saldo cair abaixo de 150, pare de gerar e reporte.
PROVENIÊNCIA: <pasta>/provenance.json com uma linha por asset candidato: asset_id, file, tipo (generated-image | programmatic-visualization | decorative), classe (explicacao | atmosfera), modelo, catalogo_consultado (2026-09-16), prompt completo, parâmetros, job_id, url_origem, data, credits, aceito (sim/não) e motivo.
Trabalhe só dentro de ${LAB} (crie). Não toque src/, public/, nem faça git add/commit.
Imagens: abra com Read e OLHE de verdade. Para compor/recortar/medir: Python PIL (disponível) ou Playwright com Chrome do sistema: createRequire('${PW}') → require('playwright').chromium.launch({headless:true, channel:'chrome'}).
Blender 5.2.1 headless (Bash): ${BLENDER} -b --factory-startup -P <script.py> -- <args>. Cycles com OptiX (RTX 4070): após read_factory_settings, prefs=bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type='OPTIX'; prefs.get_devices(); ligue os devices; scene.cycles.device='GPU'.`

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
  required: ['summary', 'deliverables', 'modelChoices', 'creditsSpent', 'risks'],
}

phase('Media')
const [globo, prancha] = await parallel([
  () => agent(`${COMMON}

TAREFA — GLOBO DO CURRÍCULO EM GRAVURA DE CARTOGRAFIA IMAGINÁRIA. Pasta: ${LAB}/globo/. Teto Higgsfield: ~50 créditos.
Objetivo: o globo precisa ser a peça MAIS BELA e MAIS INFORMATIVA do hero, com material de gravura a buril coerente com a prancha do Titã (hachura fina sépia/tinta, water-lining, relevo em perfil), e legível em escala de hero (diâmetro exibido ~320–420 CSS px a 1440; ~260 a 390).
Linguagem: cartografia de TERRAS INVENTADAS (tradição das cartas de ilhas imaginárias, ex. "Utopiae Typus" de Ortelius): três ilhas/territórios inventados com caráter próprio — I Fundamentos Universais (5 estações, módulos 01–05), II Setor Elétrico Brasileiro (7 estações, 06–12), III Especialização Estratégica (5 estações, 13–17) — com montanhas em perfil gravado, rios, florestas em pontilhado, costas com water-lining, e as 17 ESTAÇÕES como pequenos povoados/marcos (disco de latão ou marco gravado) ligados em ordem por uma ESTRADA pontilhada gravada (a rota) que atravessa os canais por pontes/passagens. Oceano navy com hachura horizontal fina e graticulado finíssimo (o navy é identidade: mantenha oceano navy e terras cor de pergaminho, como o North Star). NENHUMA massa pode lembrar continente real (evite silhuetas tipo África/América do Sul/Europa — contornos claramente inventados, recortados, com baías e penínsulas próprias).
Caminho recomendado (texture-first; você pode melhorar):
1) Gere no Blender (a partir do globo_alexandria.py) o mapa equiretangular 2:1 da máscara de terra + posições UV das 17 estações + polilinha da rota (amostrada densamente) — ou redesenhe as formas das ilhas para ficarem claramente inventadas e mais belas, mantendo 3 territórios separados por canais e as estações em ordem.
2) Transforme a máscara numa TEXTURA de carta gravada (equiretangular) — por exemplo image-to-image no Higgsfield com o modelo de edição mais fiel (a r02 aceitou nano_banana_pro com desvio 0,34%), pedindo gravura antiga de ilhas imaginárias respeitando exatamente as costas, sem texto; ou gere a gravura e derive a máscara dela. Meça a fidelidade das costas (IoU da máscara ≥ 0,95) e das estações (todas em terra).
3) Envolva a textura numa esfera no Blender (Cycles/OptiX), com luz rasante de gravura, leve relevo (bump pela máscara/altura, sem "argila"), sombreamento em hachura (pode multiplicar uma hachura procedural na sombra), marcos das estações como pequenos discos de latão BEM visíveis (raio ≥ 1,2% do diâmetro), a estrada pontilhada, e anel meridiano de latão opcional (se ajudar e não cruzar o disco). Fundo transparente.
4) Renders (≥ 2000×2000 desktop e 1400×1400 mobile): uma vista por estado de trilha — "V1" (território I à frente, II e III VISÍVEIS), "V2" (II à frente, I e III visíveis), "V3" (III à frente, I e II visíveis). Todos os três territórios precisam aparecer em cada vista (o critic Brief reprovou a vista que só mostrava I e II).
5) Para cada render exporte JSON (px e 0–1): círculo do globo (cx, cy, r), cada estação (id modulo-01..17, centro, visível, label_ok com normal·visão > 0,3), centro de rótulo de cada território (visível), e a ROTA amostrada: para cada segmento entre estações consecutivas, ≥ 24 pontos com visibilidade — o produto vai desenhar por cima, em traço de tinta, só o trecho PERCORRIDO (dado do learner) e os marcos de estado; a estrada gravada da imagem fica neutra. Visibilidade por normal·visão e ray_cast.
6) Olhe cada render ao lado da prancha r02 (${R02}/prancha/desktop-21x9-tita-A.png) e ao lado do North Star: o globo tem que parecer da MESMA gravura que o Titã e ser mais bonito que o globo do North Star. Itere até isso ser verdade. Compare contra o globo r02 (${R02}/globo-carta/globo-T1-desktop.png) e diga por que o novo é melhor.
Entregue arquivos com papel (render, json, textura, máscara, script .py, .blend, medições de fidelidade).`, { label: 'media:globo-gravura', phase: 'Media', schema: MEDIA_OUT, effort: 'high' }),

  () => agent(`${COMMON}

TAREFA — PRANCHA COM ESFERA MONUMENTAL. Pasta: ${LAB}/prancha/. Teto Higgsfield: ~120 créditos.
Problema: na prancha r02 a esfera tem ~14% da altura da imagem; no hero, o globo que trabalha fica com ~105px de raio e a figura domina. Meta r03: no hero a 1440 (área de arte ≈ 760–820 × 720 CSS px), o globo com DIÂMETRO ≥ 45% da altura útil (≈ 330–420 px), sustentado pela MESMA figura/estilo aprovados (Titã barbado ajoelhado, drapeado, gravura sépia densa, céu com nuvens e raios de luz gravados, paisagem de rios e ilhas). A 390: prancha retrato onde a esfera tem ≥ 45% da largura e a figura aparece abaixo.
Caminhos (faça pelo menos os dois primeiros e compare lado a lado):
(a) RECORTE + AMPLIAÇÃO da prancha aprovada (${R02}/prancha/desktop-21x9-tita-A.png e mobile-3x4-tita-A.png): enquadre esfera + braços + cabeça + tronco (e o que mais couber) de forma que a esfera tenha o diâmetro-alvo, e amplie com upscale_image do Higgsfield (ou outro upscaler do catálogo) para ≥ 2× a resolução de exibição (DPR 2), preservando a hachura. Verifique nitidez (sem borrão/plástico) com zoom.
(b) NOVAS PRANCHAS por image-to-image a partir da prancha aprovada (upload da SUA prancha r02, que é gerada nesta wave), pedindo o mesmo Titã e o mesmo estilo em enquadramento mais próximo/baixo, com a esfera monumental lisa, escura e uniforme (será substituída pelo globo 3D), céu gravado atrás da esfera com margem acima dela, paisagem de rios/ilhas ao fundo, zona limpa à esquerda no formato desktop; e versão retrato para celular. Maior resolução disponível.
(c) opcional: reframe/outpaint para dar céu acima da esfera ou estender a paisagem sob a coluna de texto (continuidade página×imagem pedida pelos juízes: "coluna de texto não participa do mundo").
Para cada finalista meça a esfera (cx, cy, r em px; máscara navy L<70 e B>R+12, maior componente; considere as mãos cobrindo a base) em <arquivo>.sphere.json, e produza um "mapa das mãos" (máscara dos pixels não-navy dentro do disco) para a oclusão.
Ranqueie por: beleza (igual ou acima do North Star), fidelidade à figura aprovada, nitidez, esfera grande e limpa, legibilidade da zona de texto. Entregue 1–2 desktop e 1–2 mobile finalistas.`, { label: 'media:prancha-monumental', phase: 'Media', schema: MEDIA_OUT, effort: 'high' }),
])
log('mídia r03: ' + [['globo', globo], ['prancha', prancha]].map(([k, v]) => `${k}=${v ? 'ok' : 'falhou'}`).join(' · '))

phase('Compose')
const COMP_OUT = {
  type: 'object',
  properties: {
    composites: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, e2_1440: { type: 'string' }, e0_1440: { type: 'string' }, e2b_1440: { type: 'string' }, e2_390: { type: 'string' }, recipe: { type: 'string' } }, required: ['id', 'e2_1440', 'e2_390', 'recipe'] } },
    notes: { type: 'string' },
  },
  required: ['composites', 'notes'],
}
const composed = await agent(`${COMMON}

TAREFA — COMPOSIÇÕES ESTÁTICAS DO HERO r03. Pasta: ${LAB}/compose/.
Mídia produzida nesta rodada:
GLOBO: ${JSON.stringify(globo, null, 1)}
PRANCHA: ${JSON.stringify(prancha, null, 1)}
Monte 2 ou 3 composições HTML estáticas (file://, fontes Google Cinzel + Lora) do 1º viewport da Home com o conteúdo real, capturadas com Playwright em 1440×900 e 390×844, salvando PNGs com nomes NEUTROS (comp-N-e2-1440.png, comp-N-e0-1440.png, comp-N-e2b-1440.png, comp-N-e2-390.png).
Conteúdo (igual ao produto r02, com as correções do brief r03): header em pergaminho (marca-bússola + ALEXANDRIA, nav TRILHAS · ATLAS · GLOSSÁRIO · BIBLIOTECA, "BUSCAR aula, módulo ou termo Ctrl K", "PROGRESSO" + avatar M; em E0 "ENTRAR"); eyebrow "Alexandria · Atlas do conhecimento em energia"; H1 "Um atlas para entender energia, do watt à decisão."; lede "Três territórios de estudo, da física da rede ao setor elétrico brasileiro e à decisão estratégica, para quem precisa defender um número em reunião com a fonte ao lado."; bloco de retomada FUNDIDO com a ação principal (título da aula UMA vez): E2 "Onde você parou · M01·A08 · 100 MW solar ≠ 100 MW térmica. · M01 · Física de Energia e Eletricidade — Trilha I · Fundamentos Universais · em leitura desde 14 de setembro · as 7 aulas anteriores do M01 já estão percorridas" com a ação "Continuar · M01·A08"; E0 "Por onde começar · M01·A01 · Energia é volume. Potência é velocidade. · ponto de partida · nenhuma aula tem pré-requisito obrigatório" com "Começar · M01·A01"; E2b "Onde você parou · M06·A01 · Antes do Estado · M06 · História do Setor Elétrico Brasileiro — Trilha II · em leitura desde 15 de setembro" com "Continuar · M06·A01" (Trilha I inteira percorrida). Faixa navy de base "O currículo em três territórios" com I/II/III e M01–M05 / M06–M12 / M13–M17 (estado atual marcado).
Objeto-mundo: prancha monumental + globo gravado da vista do estado (E0/E2 → V1, E2b → V2), composto exatamente na esfera (escala/posição pelos JSONs; mãos na frente). Overlay HTML/SVG SÓ para dado exato, posicionado pelos JSONs: códigos das estações visíveis com label_ok (01…17, ≥ 11px), nomes dos três territórios no objeto (I Fundamentos Universais etc. — curtos e legíveis), marcos de estado sem depender de cor (percorrido = disco cheio de tinta; atual = anel duplo + "você está aqui"; a seguir = anel vazio), trecho PERCORRIDO da rota em traço de tinta sobre a estrada gravada (E0: nada percorrido, marca "ponto de partida"; E2: M01 atual; E2b: I inteira percorrida + M06 atual). Legenda honesta junto à imagem, sem caixa flutuando sobre o céu: "Modelo do currículo, não mapa geográfico · Posição: seu registro de estudo · Gravura gerada, não documental" (E0: "Posição: ponto de partida do currículo").
Receitas a comparar (escolha as mais promissoras): (1) esfera monumental + Titã recortado, coluna de texto à esquerda com a paisagem gravada continuando por baixo (imperceptível atrás do texto); (2) variação com a figura inteira mas globo grande; (3) a melhor alternativa que você enxergar. A 390: texto + ação primeiro, depois o globo grande (≥ 25% da altura do 1º viewport visível sem rolar) e a figura.
Meça e cumpra: nenhum texto < 11px, contraste ≥ 4,5:1 nos rótulos sobre a imagem (use pastilha creme/fio quando necessário, sem sombra), rótulos não cobrem estações nem uns aos outros, nada transborda a 390. Olhe cada PNG e corrija antes de entregar. Descreva a receita (arquivos, escalas, posições).`, { label: 'compose:hero-r03', phase: 'Compose', schema: COMP_OUT, effort: 'high' })

phase('Judge')
const JUDGE_OUT = {
  type: 'object',
  properties: {
    ranking: { type: 'array', items: { type: 'object', properties: { image: { type: 'string' }, rank: { type: 'number' }, why: { type: 'string' } }, required: ['image', 'rank', 'why'] } },
    vsReference: { type: 'string', description: 'para cada candidata: claramente mais bonita / igual / abaixo de R, e por quê' },
    biggestGapOfBest: { type: 'string' },
  },
  required: ['ranking', 'vsReference', 'biggestGapOfBest'],
}
const comps = composed?.composites ?? []
// Ordem fixa e rótulos neutros: a referência e a rodada anterior ficam misturadas às candidatas.
const pool = [
  ...comps.map((c, i) => ({ key: `comp:${c.id}`, d: c.e2_1440, m: c.e2_390 })),
  { key: 'r02', d: `${WT}/docs/alexandria-v2/captures/A/r02/home-E2-1440.png`, m: `${WT}/docs/alexandria-v2/captures/A/r02/home-E2-390.png` },
]
const order = pool.map((p, i) => ({ ...p, label: `P${i + 1}` }))
const rotated = order.slice(1).concat(order.slice(0, 1)) // r02 não fica por último
const LENSES = [
  ['presenca', 'PRESENÇA E IDENTIDADE (entrar num mundo, objeto monumental, identidade memorável)'],
  ['informacao', 'O OBJETO TRABALHA (dá para ler no próprio objeto onde o aluno está, os três territórios e o caminho; a informação está integrada à beleza e não colada)'],
  ['acabamento', 'ACABAMENTO E COERÊNCIA DE MATERIAL (a peça central é da mesma gravura que a figura; nitidez; nada parece placeholder, vetor liso ou CGI colado)'],
]
const judged = await parallel(LENSES.map(([key, lens]) => () => agent(`Você é um diretor de arte exigente julgando às cegas páginas de ENTRADA de um produto educacional autoral de energia.
Não abra nenhum arquivo além destes. Não edite nada.
Referência R: ${WT}/docs/alexandria-v2/captures/reference/north-star-home-panel.png
Candidatas (desktop | celular): ${rotated.map((p) => `${p.label}: ${p.d} | ${p.m}`).join(' ;; ')}
Lente principal: ${lens}. Ranqueie as candidatas (P*) e diga, para cada uma, se é CLARAMENTE mais bonita, igual ou abaixo de R, e por quê em termos observáveis. Nomeie a maior lacuna da melhor. Não premie ornamento que atrapalha a leitura.`, { label: `judge:${key}`, phase: 'Judge', schema: JUDGE_OUT, effort: 'high' })))
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
const integrated = await agent(`Você é o BUILDER da Peça A (agente LYCEUM), rodada 3.
Diretório: ${WT} (git worktree, branch wave/alexandria-v2-restructure). Não faça commit/git add. Não toque outros worktrees nem arquivos fora da posse da Alexandria (index.html, src/main.tsx, app/ são de outros agentes).
Leia: ${WT}/docs/alexandria-v2/briefs/piece-A-r03.md (LACUNA + GATES desta rodada), piece-A-r02.md e piece-A.md (posse, dados, verificação), ${WT}/docs/alexandria-v2/bar.md (S1–S7, A1–A6, §6, §7). Código atual da Home r02: src/pages/alexandria/AlexandriaHome.tsx, src/components/alexandria/home/* (GloboCurriculo.tsx, geometriaGlobo.ts, FaixaTrilhas.tsx, EntradaBlocos.tsx, Portais.tsx, estudo.ts), shell/* (Localizador.tsx etc.), e o pipeline ${R02}/integracao/compor_home.py.
Mídia r03: GLOBO ${JSON.stringify(globo, null, 1)}
PRANCHA ${JSON.stringify(prancha, null, 1)}
Composições: ${JSON.stringify(composed, null, 1)}
Julgamento cego (rótulos → origem: ${JSON.stringify(labelMap)}; "r02" é o produto atual): ${JSON.stringify(judged, null, 1)}
TAREFA:
1) Integre a composição vencedora (corrigindo a maior lacuna apontada pelos juízes), substituindo o globo r02. Pipeline reprodutível em ${LAB}/integracao/ (compor e exportar WebP em srcset 390/768/1440/1920 + geometria normalizada gerada para src). O globo muda de vista por trilha atual (E0/E1 → V1 "ponto de partida"; T1 → V1; T2 → V2; T3 → V3). Overlay HTML/SVG só para dado exato: códigos de estação visíveis (≥ 11px), nomes dos territórios, marcos de estado por silhueta (percorrido/atual/a seguir), trecho percorrido da rota (pontos amostrados do JSON) a partir do registro REAL (useEstudo / getMyProgress) — nunca de mock; em E0 nada percorrido. Posições em % da moldura, recalculadas em resize; acessível (texto real, lista equivalente para leitores de tela).
2) Aplique TODOS os gates e detalhes do brief r03: localizador a 390 sem nenhuma reticência (nomes completos, quebra permitida, alvos ≥ 24px) — confira em shell-aula-E2-390 e shell-modulo-E2-390; alvos: links de conteúdo ≥ 24px de altura, nav global e conta ≥ 44×44 a 390; cartão + ação fundidos (título da aula uma vez; rótulo da ação nomeia objeto e motivo); sem caixa-legenda flutuante (legenda honesta junto à imagem); territórios não triplicados no 1º viewport; E0 "ponto de partida"; "1 dia seguido(s)" com concordância; document.title "<local> — Alexandria" (Home "Alexandria — Atlas do conhecimento em energia"); foco do nó M01 sem invadir M02; esmaecimentos só dentro das imagens (nenhum gradiente/mask CSS).
3) Assets aceitos → ${WT}/public/alexandria/v2/home/ (nomes estáveis; remova os WebP r02 que deixarem de ser usados) e registre cada um em ${WT}/docs/alexandria-v2/media-provenance.md (todas as colunas; factual_review "pendente (orquestrador)"; marque as linhas r02 substituídas como retiradas).
4) Gates: \`npx tsc -b\` (0 erros) e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` (0 P0).
5) Captura (dev server em http://127.0.0.1:5311, HMR): \`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/A/plans/piece-A.json --out docs/alexandria-v2/captures/A/r03\`. ABRA e OLHE os PNGs principais (E0/E1/E2/E2b 1440, 390, 768, rolagens, Tab), compare com o North Star e com a r02, corrija e recapture. Na legend.json confira: horizontalOverflow false em tudo; minFontPx ≥ 11 nas rotas da Home; truncatedText vazio no shell (inShell:true) em todas as rotas; smallTargets vazio nas rotas da Home; frames[].url do cta-*-click → aula; media com classe.
Declare heurísticas quebradas com a razão.`, { label: 'builder:A:r03', phase: 'Integrate', schema: INT_OUT, effort: 'high' })

return { globo, prancha, composed, judged, labelMap, integrated }
