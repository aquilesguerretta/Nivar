export const meta = {
  name: 'alexandria-v2-piece-critics',
  description: 'Fresh Brief, System and Craft critics for any Alexandria v2 piece round (Craft: 3 blind judges, then verdict)',
  phases: [
    { title: 'Blind', detail: '3 blind Craft judges with distinct lenses' },
    { title: 'Critique', detail: 'Brief + System + Craft verdict' },
  ],
}
// args: { piece: 'B', pieceName, round: 'r01', capDir, mapping, pairCount, renders, briefSections, systemSections, craftSections, craftRule, nsPanel }
const A = args
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const R = `${WT}/docs/alexandria-v2/captures/${A.capDir}/${A.round}`
const CB = `${WT}/docs/alexandria-v2/critics/piece-${A.piece}-critic-briefs.md`
const NO_CODE = `REGRAS DE CRITIC: contexto limpo. NÃO abra nada em ${WT}/src, ${WT}/tools, ${WT}/public, ${WT}/docs/alexandria-v2/media-lab, ${WT}/docs/alexandria-v2/loop, ${WT}/docs/alexandria-v2/briefs nem ${WT}/docs/alexandria-v2/estudos. Julgue SÓ renders (PNGs, com Read) e medições (legend.json). Não edite arquivos. Seja duro. Veredito BINÁRIO. UMA maior lacuna, concreta e observável, com o PNG onde se vê.
Estados: E0 = visitante sem sessão; E1 = conta sem eventos; E2 = Trilha I em curso (M01·A01–A07 percorridas, A08 em leitura); E2b = Trilha I inteira percorrida e M06·A01 em leitura. Estados ≠ E0 vêm de FIXTURE DE REDE do harness (declarada na legend.json): não é defeito. Defeito é mostrar número pessoal em E0, número sem fonte, ou números que divergem entre telas no mesmo estado.
Decisões do Founder que valem para o julgamento: P18 ("Concluído" só com consumo completo; nunca "Aprovado/Dominado"), P24 (nenhum "GridAlpha"; títulos do catálogo canônico), P25 (jogos não fazem parte desta wave: só a linha "experiência jogável em desenho", sem controle nem destino). Mídia: gravuras/imagens geradas são declaradas pelo orquestrador como geradas e registradas; fotos reais têm licença verificada; revisão factual pendente do orquestrador.`
const OUT = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['PASS', 'FAIL'] },
    biggest_gap: { type: 'string' },
    gap_evidence: { type: 'string' },
    gates_failed: { type: 'array', items: { type: 'string' } },
    heuristics_broken_not_stronger: { type: 'array', items: { type: 'string' } },
    other_observations: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'biggest_gap', 'gap_evidence', 'gates_failed', 'other_observations'],
}
const BLIND = {
  type: 'object',
  properties: {
    pairs: { type: 'array', items: { type: 'object', properties: {
      pair: { type: 'string' }, stronger: { type: 'string', enum: ['X', 'Y', 'empate'] },
      margin: { type: 'string', enum: ['clara', 'leve', 'nenhuma'] },
      why: { type: 'string' }, weaker_biggest_gap: { type: 'string' }, stronger_biggest_gap: { type: 'string' } },
      required: ['pair', 'stronger', 'margin', 'why', 'weaker_biggest_gap', 'stronger_biggest_gap'] } },
  },
  required: ['pairs'],
}
const renders = `Renders da rodada em ${R}/ (lista e medições em ${R}/legend.json): ${A.renders}`
const pairList = Array.from({ length: A.pairCount }, (_, i) => `- par ${i + 1}: ${R}/blind/pair${i + 1}-X.png × ${R}/blind/pair${i + 1}-Y.png`).join('\n')
const LENSES = [
  ['presenca', 'PRESENÇA E IDENTIDADE (entrar num mundo, identidade própria memorável, sensação de lugar)'],
  ['composicao', 'COMPOSIÇÃO E HIERARQUIA (centro de gravidade, relação texto×imagem, ritmo, clareza do que fazer)'],
  ['acabamento', 'ACABAMENTO E AUTORIA (qualidade do traço/imagem/material na escala exibida, coerência, nada de placeholder/template/UI colada)'],
]

phase('Blind')
const blind = await parallel(LENSES.map(([key, lens]) => () => agent(`Você é um diretor de arte exigente julgando às cegas telas de um produto educacional autoral sobre energia (${A.pieceName}).
Não abra nenhum arquivo além destes. Não edite nada. Você NÃO sabe qual imagem de cada par é o trabalho em julgamento e qual é referência.
${pairList}
Lente principal: ${lens}. Para cada par: qual é mais forte (X, Y ou empate), margem, por quê em termos observáveis, a maior lacuna do mais fraco e a do mais forte. Tamanhos/proporções diferentes não são critério. Não premie ornamento vazio nem densidade por si.`, { label: `blind:${key}:${A.piece}${A.round}`, phase: 'Blind', agentType: 'Plan', schema: BLIND, effort: 'high' })))

phase('Critique')
const [brief, system, craft] = await parallel([
  () => agent(`Você é o BRIEF CRITIC da Peça ${A.piece} (${A.pieceName}) da Alexandria v2, rodada ${A.round}.
${NO_CODE}
Leia: ${CB} (seção Brief e regras comuns; e ${WT}/docs/alexandria-v2/critics/piece-A-critic-briefs.md para as regras comuns) e, em ${WT}/docs/alexandria-v2/bar.md: ${A.briefSections}.
${renders}
Julgue se as telas cumprem o trabalho. PASS só se todos os gates dos seus mecanismos passam.`, { label: `critic:brief:${A.piece}${A.round}`, phase: 'Critique', agentType: 'Plan', schema: OUT, effort: 'high' }),
  () => agent(`Você é o SYSTEM CRITIC da Peça ${A.piece} (${A.pieceName}) da Alexandria v2, rodada ${A.round}.
${NO_CODE}
Leia: ${CB} (seção System) e ${WT}/docs/alexandria-v2/critics/piece-A-critic-briefs.md (tabela de checagem do System), e em ${WT}/docs/alexandria-v2/bar.md: ${A.systemSections}. Amostras de tokens: ${WT}/docs/alexandria-v2/captures/token-swatches.png (+ .json).
${renders}
Julgue a aderência ao sistema (incluindo legend.json: horizontalOverflow, minFontPx, minFontPxShell/Main, truncatedText, smallTargets, overflowingElements, media, consoleErrors, title). PASS só se todos os gates passam.`, { label: `critic:system:${A.piece}${A.round}`, phase: 'Critique', agentType: 'Plan', schema: OUT, effort: 'high' }),
  () => agent(`Você é o CRAFT CRITIC (veredito) da Peça ${A.piece} (${A.pieceName}) da Alexandria v2, rodada ${A.round}.
${NO_CODE}
Etapa cega (três juízes independentes, lentes presença/composição/acabamento, sem saber a identidade das imagens):
${JSON.stringify(blind, null, 1)}
Mapeamento revelado agora: ${JSON.stringify(A.mapping, null, 1)}
Leia: ${CB} (seção Craft) e em ${WT}/docs/alexandria-v2/bar.md: ${A.craftSections}. Abra o North Star ${WT}/docs/alexandria-v2/north-star/ALEXANDRIA_V2_VISUAL_NORTH_STAR_01.png e o painel ${WT}/docs/alexandria-v2/captures/reference/${A.nsPanel}.
${renders}
Regra de PASS do Craft: ${A.craftRule}. Dê o veredito e a MAIOR lacuna única.`, { label: `critic:craft:${A.piece}${A.round}`, phase: 'Critique', agentType: 'Plan', schema: OUT, effort: 'high' }),
])
return { piece: A.piece, round: A.round, blind, brief, system, craft }
