export const meta = {
  name: 'alexandria-v2-lesson-archetypes',
  description: 'Study all 141 lessons, derive a high-level lesson archetype system (not one layout for all), prototype the key archetypes with real content, critique and fix',
  phases: [
    { title: 'Read', detail: 'one reader per module: best representation per lesson' },
    { title: 'Synthesize', detail: 'archetype system + lesson map + dependencies' },
    { title: 'Prototype', detail: 'static comps of key archetypes at 1440/390' },
    { title: 'Critique', detail: 'brief + craft critique, one fix pass' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const EST = `${WT}/docs/alexandria-v2/estudos/aulas`
const SRC = 'C:/dev/GridAlpha v2/Alexandria modulos'
const PW = 'C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json'
const MODS = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17']

const COMMON = `
CONTEXTO: Alexandria v2 (rota /alexandria), o currículo de energia da NIVAR: 17 módulos, 3 trilhas, 141 aulas. Redesenho como "atlas vivo do conhecimento em energia", expedição de domínio intelectual, com aula editorial E interativa. PEDIDO DO FOUNDER: "nem toda aula precisa ter o mesmo layout; estude a melhor forma de representar cada uma, mas todas têm que ser do alto nível".
CONTRATO (LEIA): ${WT}/docs/alexandria-v2/bar.md — §0 (compromissos e teste anti-LMS), §4 inteiro (Regra-mãe da aula, C3 abertura, C4 leitura com explicação no fluxo, C5 instrumento como etapa, C6 visualização útil, C7 tentativa antes da referência, C8 aplicação/decisão, C9 ato autêntico em toda aula, C10 recuperação e próximo passo), S1–S7, §7 (mídia), §9; e ${WT}/docs/alexandria-v2/decisoes/2026-09-16-ambiguidades-de-conteudo.md (duas camadas: FONTE literal × PRODUTO Alexandria desenhável; P17–P25: sem jogos nesta wave — só o lugar "experiência jogável em desenho"; P18: "Concluído", nada de "Aprovado"; P19: previsões são camada Alexandria; P21: FCap/FCarga).
CONTEÚDO: corpo das aulas em ${WT}/src/lib/data/alexandria-modulo-NN-content.ts (MODULO_NN_CORPO[aulaId], MODULO_NN_AULAS, MODULO_NN_LEAD, instrumentos); fonte original ${SRC}/alexandria_moduloNN.html (SÓ LEITURA); extração verificada em ${WT}/docs/alexandria-v2/extraction/ (m01 pronto; outros módulos podem estar sendo gerados agora — use se existir); curadoria de imagens por aula em ${WT}/docs/alexandria-v2/media-lab/aulas/mNN/plano.json (pode estar em andamento — use se existir).
REGRAS: não invente fato (lacuna de fonte = declarar); lacuna pedagógica = pode desenhar (camada Alexandria, sempre marcada como tal). Não toque src/, public/, git. Registre ideias de features novas em ${WT}/docs/alexandria-v2/estudos/features-propostas-aulas.md (acrescente; nome, o que faz, por que vale, dependências, risco).`

const READ = (m) => `${COMMON}
TAREFA — LEITURA DO MÓDULO ${m}. Leia CADA aula inteira do módulo ${m}, com calma. Para cada aula produza, em ${EST}/m${m}.json (+ ${EST}/m${m}.md legível):
- aulaId, título, o que a aula realmente ensina (mecanismo central, 1–2 frases), natureza (conceito físico, cálculo, leitura de documento/fatura, sistema/rede, mercado/regulação, história/narrativa, comparação de tecnologias, caso/decisão, síntese…);
- MELHOR REPRESENTAÇÃO: o layout/arquétipo proposto (ex.: coluna editorial com figuras no fluxo; prancha dividida com instrumento vivo; anatomia de documento com anotações; mapa/rede como palco; linha do tempo; mesa de comparação; dossiê de caso com decisão; laboratório guiado…) e POR QUÊ para esta aula;
- ABERTURA (C3): pergunta ou objetivo derivado da fonte (camada Alexandria, marcado), e se há previsão útil (qual, com os números da fonte);
- MENOR ATO AUTÊNTICO (C9) que exercita o mecanismo central (do catálogo: prever, manipular até meta, estimar, comparar, classificar/ordenar, identificar o erro, decidir com justificativa, localizar no mapa, responder exercício da fonte);
- VISUALIZAÇÃO (C6): o que precisa ser desenhado (relação, eixos, unidade), se já existe no código, e se o instrumento promete uma forma que hoje não desenha;
- INSTRUMENTO (C5): qual, em que ponto da prosa (bloco_indice), com previsão ou não;
- CHECAGEM (C7), RECUPERAÇÃO/PRÓXIMO PASSO (C10);
- MÍDIA: onde uma imagem ajuda (aponte o plano da curadoria se existir);
- MOBILE (390): como a representação se recompõe;
- LACUNAS de fonte e dependências (§9);
- nota de ambição (o que tornaria esta aula memorável, sem inventar fato).`

phase('Read')
const reads = await parallel(MODS.map((m) => () => agent(READ(m), { label: `read:m${m}`, phase: 'Read', effort: 'high' })))

phase('Synthesize')
const synth = await agent(`${COMMON}
Leituras por módulo: ${EST}/m01.json … m17.json (+ .md). Leia todas.
TAREFA — SISTEMA DE ARQUÉTIPOS DE AULA. Escreva ${EST}/SISTEMA.md e ${EST}/mapa-aulas.json:
- 6 a 10 arquétipos de aula (não um layout único), cada um com: quando usar (critério objetivo), gramática de layout a 1440 e 390 (regiões, ordem, onde entra o instrumento, onde entram figuras e imagens, onde fica a fonte), abertura e primeiro ato típicos, visualizações típicas, momento de conclusão (registro), recuperação, requisitos de componente (novos componentes/instrumentos/visualizações a construir), riscos contra o bar e critérios de aceite (C3–C10, Regra-mãe, S1–S7) verificáveis em render.
- Um tronco comum que TODOS os arquétipos compartilham (shell, localizador, abertura, registro final, fonte, camada Alexandria marcada, acessibilidade), para a variedade não virar inconsistência.
- mapa-aulas.json: cada uma das 141 aulas → arquétipo, ato, previsão (sim/não), visualização requerida, instrumento, dependências.
- Lista priorizada do que construir (componentes e visualizações) com contagem de aulas atendidas.
- Aulas-exemplo por arquétipo (a melhor candidata a protótipo), incluindo obrigatoriamente M01·A08.`, { label: 'synthesize', phase: 'Synthesize', effort: 'high' })

phase('Prototype')
const COMP_OUT = { type: 'object', properties: { comps: { type: 'array', items: { type: 'object', properties: { arquetipo: { type: 'string' }, aula: { type: 'string' }, png1440: { type: 'string' }, png390: { type: 'string' }, pngFull: { type: 'string' } }, required: ['arquetipo', 'aula', 'png1440', 'png390'] } }, notes: { type: 'string' } }, required: ['comps', 'notes'] }
const proto = await agent(`${COMMON}
Sistema: ${EST}/SISTEMA.md e ${EST}/mapa-aulas.json (leia).
TAREFA — PROTÓTIPOS ESTÁTICOS DOS ARQUÉTIPOS. Pasta ${EST}/prototipos/ (crie). Para os arquétipos principais (no mínimo 5, sempre incluindo o da M01·A08), construa um comp HTML autocontido (file://, Google Fonts Cinzel + Lora) de uma aula-exemplo com CONTEÚDO REAL (texto literal da fonte; perguntas/previsões/atos da camada Alexandria claramente marcados como tais), no visual da Alexandria (shell/header e tokens como nas capturas ${WT}/docs/alexandria-v2/captures/A/r03/; pergaminho/navy/tinta; raio 0; sem sombra/gradiente), com imagens reais/geradas da curadoria quando existirem (${WT}/docs/alexandria-v2/media-lab/aulas/ e ${WT}/docs/alexandria-v2/media-lab/fontes-reais/aula-m01-a08/), instrumento em estado inicial e em estado "registrado → comparação" (dois quadros), fonte à vista e registro final. Capture com Playwright (Chrome do sistema: createRequire('${PW}')) em 1440×900 (1º viewport), página inteira a 1440, e 390×844. Olhe cada PNG e corrija antes de entregar. Nomes: ${EST}/prototipos/<arquetipo>-<aula>-{1440,full,390}.png (+ -registrado.png).`, { label: 'prototype', phase: 'Prototype', schema: COMP_OUT, effort: 'high' })

phase('Critique')
const CRIT_OUT = { type: 'object', properties: { verdict: { type: 'string', enum: ['PASS', 'FAIL'] }, biggest_gap: { type: 'string' }, per_comp: { type: 'array', items: { type: 'object', properties: { comp: { type: 'string' }, verdict: { type: 'string' }, gap: { type: 'string' } }, required: ['comp', 'verdict', 'gap'] } } }, required: ['verdict', 'biggest_gap', 'per_comp'] }
const crit = await agent(`Você é um CRITIC de contexto limpo (Brief + Craft) de protótipos de aula da Alexandria v2. NÃO leia HTML nem código: julgue só os PNGs em ${EST}/prototipos/ contra ${WT}/docs/alexandria-v2/bar.md (§0, §4 inteiro com a Regra-mãe, S1–S7, §7) e contra o painel de aula do North Star ${WT}/docs/alexandria-v2/north-star/ALEXANDRIA_V2_VISUAL_NORTH_STAR_01.png (piso de qualidade, não copiar vídeo-herói nem exercícios em aba). Protótipos: ${JSON.stringify(proto?.comps ?? [])}. Para cada comp: PASS/FAIL e a maior lacuna. A variedade entre arquétipos está a serviço do conteúdo e continua coerente como sistema? Todas estão em alto nível? Seja duro.`, { label: 'critic', phase: 'Critique', schema: CRIT_OUT, effort: 'high' })
const fails = (crit?.per_comp ?? []).filter((x) => x.verdict !== 'PASS')
const fix = fails.length ? await agent(`${COMMON}
Um critic reprovou estes protótipos: ${JSON.stringify(fails, null, 1)}. Corrija-os em ${EST}/prototipos/ (e, se a falha for de sistema, ajuste ${EST}/SISTEMA.md), recapture e registre as mudanças em ${EST}/prototipos/CORRECOES.md.`, { label: 'fix', phase: 'Critique', effort: 'high' }) : null
return { reads: reads.map((r) => (r ? 'ok' : 'falhou')), synth, proto, crit, fix }