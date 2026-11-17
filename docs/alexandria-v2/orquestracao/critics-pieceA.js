export const meta = {
  name: 'alexandria-v2-pieceA-critics',
  description: 'Fresh Brief, System and Craft critics judge a Piece A round (Craft: 3 blind judges, then verdict)',
  phases: [
    { title: 'Blind', detail: '3 blind Craft judges with distinct lenses' },
    { title: 'Critique', detail: 'Brief + System + Craft verdict' },
  ],
}
// args: { round: 'r02', mapping: {pair1:{X,Y},...}, pairCount: 6, extraRenders: '...' }
const ROUND = args.round
const MAPPING = args.mapping
const N = args.pairCount
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const R = `${WT}/docs/alexandria-v2/captures/A/${ROUND}`
const NO_CODE = `REGRAS DE CRITIC: você tem contexto limpo. NÃO abra nada em ${WT}/src, ${WT}/tools, ${WT}/public, ${WT}/docs/alexandria-v2/media-lab, ${WT}/docs/alexandria-v2/loop nem ${WT}/docs/alexandria-v2/briefs. Você julga SÓ renders (PNGs, abertos com Read) e medições (legend.json). Não edite nenhum arquivo. Seja duro: elogio não ajuda. Veredito BINÁRIO. Nomeie UMA maior lacuna, concreta e observável, com o PNG onde se vê.
Estados: E0 = visitante sem sessão; E1 = conta sem eventos; E2 = Trilha 1 em curso (M01·A01–A07 percorridas, A08 em leitura); E2b = Trilha 2 em curso (M06·A01 em leitura). Estados ≠ E0 vêm de FIXTURE DE REDE do harness (declarada na legend.json): isso não é defeito. Defeito é mostrar número pessoal em E0 ou algo que nenhuma fonte sustenta.
Mídia: o orquestrador declara que as imagens da Home são (a) render 3D do Blender de um globo NÃO geográfico que modela o currículo (classe explicação) e (b) gravura/papel gerados no Higgsfield (classe atmosfera), registrados no registro de proveniência com revisão factual pendente do orquestrador. Referências marcadas parc/bloq no bar não são UI observada.`
const OUT = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['PASS', 'FAIL'] },
    biggest_gap: { type: 'string' },
    gap_evidence: { type: 'string', description: 'PNG(s) e o que se vê' },
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
const renders = `Renders da rodada em ${R}/ (abra os relevantes; lista completa e medições em ${R}/legend.json): home-E0-1440, home-E1-1440, home-E2-1440, home-E2b-1440, home-E2-1440-scroll-f00..f03, home-E2b-1440-scroll-f00..f03, home-E0-390, home-E2-390, home-E2-390-scroll-f00..f04, home-E2-390-mais, home-E2-768, search-E2-1440, home-E2-1440-tab-f00..f15, home-E2-1440-reduced, cta-E2-1440-click-f00..f03, cta-E0-390-click-f00..f03 (URL de cada quadro em legend.json → frameLog), account-load-E2-1440-f00..f05, shell-glossario-E2-1440 (+scroll, +updown), shell-trilha-E2-1440, shell-aula-E2-390. As rotas shell-* mostram o shell NOVO em volta de páginas ainda NÃO redesenhadas (Peças B, C, D): nelas julgue só o shell (header, localizador, nav, rodapé, ausência de sidebar).${args.extraRenders ? ' ' + args.extraRenders : ''}`
const pairList = Array.from({ length: N }, (_, i) => `- par ${i + 1}: ${R}/blind/pair${i + 1}-X.png × ${R}/blind/pair${i + 1}-Y.png`).join('\n')
const LENSES = [
  ['presenca', 'PRESENÇA E IDENTIDADE: sensação de entrar num mundo, objeto monumental, identidade própria reconhecível no primeiro frame, memorabilidade'],
  ['composicao', 'COMPOSIÇÃO E HIERARQUIA: centro de gravidade, relação texto×imagem, ritmo, espaço, legibilidade do que fazer agora, integração (não colagem)'],
  ['acabamento', 'ACABAMENTO E AUTORIA: qualidade do traço/render/material, detalhe, coerência de luz e escala, ausência de artefatos, parece autoral ou gerado/template'],
]

phase('Blind')
const blind = await parallel(LENSES.map(([key, lens]) => () => agent(`Você é um diretor de arte exigente julgando às cegas páginas de ENTRADA de um produto educacional autoral sobre energia.
Não abra nenhum arquivo além destes. Não edite nada. Você NÃO sabe qual imagem de cada par é o trabalho em julgamento e qual é referência.
${pairList}
Sua lente principal: ${lens}. Julgue também o conjunto, mas decida pela sua lente.
Para cada par: qual é mais forte (X, Y ou empate), com que margem, por quê em termos observáveis, a maior lacuna do mais fraco e a do mais forte. Tamanhos/proporções diferentes não são critério. Não premie ornamento vazio; premie imagem que trabalha. Não premie densidade de texto nem de ornamento por si.`, { label: `craft-blind:${key}:${ROUND}`, phase: 'Blind', agentType: 'Plan', schema: BLIND, effort: 'high' })))

phase('Critique')
const [brief, system, craft] = await parallel([
  () => agent(`Você é o BRIEF CRITIC da Peça A (Home + identidade + navegação global) da Alexandria v2, rodada ${ROUND}.
${NO_CODE}
Leia: ${WT}/docs/alexandria-v2/critics/piece-A-critic-briefs.md (seção Brief critic e regras comuns) e, em ${WT}/docs/alexandria-v2/bar.md, as seções "Como ler este bar", §0 (teste anti-LMS), S1, S3 e Piece A (A1–A4, linha "Além do conceito").
${renders}
Julgue se a tela cumpre o trabalho. Confira nos filmstrips de clique (e nas URLs do frameLog) o destino real da ação principal, e em E2b se os ganchos mudam. PASS só se todos os gates dos seus mecanismos passam.`, { label: `critic:brief:${ROUND}`, phase: 'Critique', agentType: 'Plan', schema: OUT, effort: 'high' }),
  () => agent(`Você é o SYSTEM CRITIC da Peça A (Home + identidade + navegação global) da Alexandria v2, rodada ${ROUND}.
${NO_CODE}
Leia: ${WT}/docs/alexandria-v2/critics/piece-A-critic-briefs.md (seção System critic e regras comuns) e, em ${WT}/docs/alexandria-v2/bar.md, "Como ler este bar", S2, S4, S5, S6, S7, A5, A6, §6 (hard gates globais) e §7 (contrato de mídia). Amostras de tokens: ${WT}/docs/alexandria-v2/captures/token-swatches.png (+ .json).
${renders}
Julgue a aderência ao sistema, incluindo: legend.json (horizontalOverflow, minFontPx, overflowingElements, media com data-media-class, consoleErrors, title), foco no filmstrip de Tab, contraste do texto sobre as imagens, alvos a 390, título da aba, linguagem interna, e se imagem/atmosfera cobre dado, rótulo ou posição. PASS só se todos os gates passam (heurística quebrada só reprova se o resultado não ficou claramente mais forte).`, { label: `critic:system:${ROUND}`, phase: 'Critique', agentType: 'Plan', schema: OUT, effort: 'high' }),
  () => agent(`Você é o CRAFT CRITIC (veredito) da Peça A da Alexandria v2, rodada ${ROUND}.
${NO_CODE}
Na etapa cega, três juízes independentes (lentes: presença, composição, acabamento), sem saber a identidade das imagens, deram:
${JSON.stringify(blind, null, 1)}
Mapeamento revelado agora: ${JSON.stringify(MAPPING, null, 1)}
Leia: ${WT}/docs/alexandria-v2/critics/piece-A-critic-briefs.md (seção Craft critic) e, em ${WT}/docs/alexandria-v2/bar.md, "Como ler este bar", §0.1, A1, A2, A5, §6 (linha "Cópia literal do North Star") e §7 M7. Abra o North Star completo ${WT}/docs/alexandria-v2/north-star/ALEXANDRIA_V2_VISUAL_NORTH_STAR_01.png e o recorte ${WT}/docs/alexandria-v2/captures/reference/north-star-home-panel.png.
${renders}
Regra de PASS do Craft (bar §8 + critic brief): o render precisa ser IGUAL OU MAIS FORTE que o North Star em presença e identidade (sem copiar a composição — veja §6), claramente mais forte que a baseline r00, não pode parecer gerado/template/LMS, a 390 precisa ser composição própria, e nenhum defeito de acabamento pode denunciar a peça central como colagem/placeholder. A comparação com a rodada anterior é GUARDA DE REGRESSÃO: reprova só se a maioria dos juízes preferir a rodada anterior (margem leve a favor da atual não é motivo de FAIL). O Founder pediu explicitamente "igual ou mais bonito que o North Star". Dê o veredito e a MAIOR lacuna única do render (a que mais o separa de ser claramente mais bonito que o North Star).`, { label: `critic:craft-verdict:${ROUND}`, phase: 'Critique', agentType: 'Plan', schema: OUT, effort: 'high' }),
])
return { round: ROUND, blind, brief, system, craft }
