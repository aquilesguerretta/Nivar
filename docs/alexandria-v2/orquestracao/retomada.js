export const meta = {
  name: 'alexandria-v2-retomada',
  description: 'Replace the generic resume card with an atlas object: explore five directions, blind-judge against the current one, integrate in Home and Trilhas',
  phases: [
    { title: 'Explorar', detail: 'cinco direções em comps estáticas' },
    { title: 'Julgar', detail: 'três lentes cegas contra o bloco atual' },
    { title: 'Integrar', detail: 'componente único na Home e nas Trilhas + captura' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/retomada`
const REAIS = `${DOCS}/media-lab/fontes-reais/atlas-gravuras-identidade`
const HF = 'mcp__1bd778ac-f4ca-47cf-b235-8be5dc610f70__'
const PW = 'C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json'
const GPU = `python ${DOCS}/media-lab/_ferramentas/gpu_lock.py -- "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P <script.py> -- <args>`

const COMMON = `
CONTEXTO: Alexandria v2 (/alexandria), currículo de energia da NIVAR, "atlas vivo do conhecimento em energia": gravura a buril, cartografia histórica, papel pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara). Cinzel (identidade) + Lora (conteúdo).
DIRETRIZ DO FOUNDER (2026-09-20, sobre o bloco "Onde você parou"): "esse estilo de card é pura IA, tem que trocar isso, melhore". LEIA o brief: ${DOCS}/briefs/retomada.md.
ESTADO ATUAL: ${DOCS}/captures/A/r06/home-E2-1440.png e home-E2-390.png (o bloco está na coluna esquerda), ${DOCS}/captures/B/r02/trilhas-E2-1440.png e mapa-E2-1440.png (mesmo padrão). Código: ${WT}/src/components/alexandria/home/EntradaBlocos.tsx (Home) e ${WT}/src/components/alexandria/trilhas/ (Trilhas).
MATERIAL REAL DISPONÍVEL (licença verificada, catálogo em ${DOCS}/media-lab/fontes-reais/CATALOGO.md): ${REAIS}/web/atl-14-cartucho-vazio-mascarao-web.jpg (CC0, Rijksmuseum), atl-15-cartucho-vazio-nereidas-web.jpg, atl-11-rosa-dos-ventos-1598-web.jpg, atl-10-escala-armilar-blaeu-web.jpg, atl-13-portulano-atlantico-roiz-1633-web.jpg (13 mil px, dá recortes). Originais em ${REAIS}/originais/ quando precisar de resolução.
REGRAS: raio 0, sem sombra, sem gradiente, sem vidro; nenhuma barra cheia navy como botão; UMA ação principal nomeando objeto e motivo (bar S1), alvo ≥ 44px a 390, contraste ≥ 4,5:1; nada de texto dentro de imagem gerada; imagem real entra com classe, crédito e proveniência (§7 do ${DOCS}/bar.md); E0 não mostra nada pessoal.
FERRAMENTAS: Higgsfield via ToolSearch "select:${HF}models_explore,${HF}generate_image,${HF}generate_image_batch,${HF}jobs_wait,${HF}balance" (catálogo justificado; registre proveniência e créditos; não economize em qualidade). Blender com trava de GPU: ${GPU}. Playwright: createRequire('${PW}'). Python PIL. Trabalhe só em ${LAB}/ nesta fase. Não toque src/, public/, git.`

phase('Explorar')
const EXP = { type: 'object', properties: { summary: { type: 'string' }, variantes: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, e2_1440: { type: 'string' }, e2_390: { type: 'string' }, e0_1440: { type: 'string' }, receita: { type: 'string' } }, required: ['id', 'e2_1440', 'e2_390', 'receita'] } }, creditos: { type: 'string' }, riscos: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'variantes', 'creditos'] }
const exploracao = await agent(`${COMMON}
TAREFA — CINCO DIREÇÕES PARA O BLOCO DE RETOMADA. Pasta ${LAB}/variantes/.
Produza pelo menos cinco variantes (as quatro do brief mais uma sua), cada uma como comp HTML estática que reproduz FIELMENTE a coluna esquerda da Home a 1440 e a 390 (mesmo cabeçalho, eyebrow, H1, lede e a gravura à direita recortada das capturas r06, para o bloco ser julgado no contexto real), trocando só o bloco de retomada:
(1) cartucho gravado REAL (atl-14 / atl-15 recortados e reentintados no tom do papel, com a tipografia da casa dentro);
(2) ficha de caderno de campo;
(3) marcador de leitura preso à margem;
(4) entrada de diário de bordo com margem de nota;
(5) plaqueta de latão cunhada no Blender (mesma família das estações do globo).
Conteúdo fixo em E2: "Onde você parou", M01·A08, "Física de Energia e Eletricidade", "M01 · Aula 08 de 9 — Trilha I · Fundamentos Universais", "em leitura desde 14 de setembro · as 7 aulas anteriores do M01 já estão percorridas", ação "Continuar · M01·A08 — 100 MW solar ≠ 100 MW térmica". Em E0: "Por onde começar", M01·A01, "Energia é volume. Potência é velocidade.", "ponto de partida", ação "Começar · M01·A01 — …".
Capture com nomes neutros: var-<id>-1440.png, var-<id>-390.png, var-<id>-e0-1440.png. Inclua var-atual-* (recorte das capturas r06, sem alterar). Meça alvo e contraste de cada ação e registre. Olhe cada PNG na escala real antes de entregar.`, { label: 'explorar', phase: 'Explorar', schema: EXP, effort: 'high' })

if (!exploracao || !(exploracao.variantes ?? []).length) return { exploracao, julgado: null, integrado: null }

phase('Julgar')
const vars = exploracao.variantes
const cand = vars.map((v, i) => `C${i + 1}: ${v.e2_1440} | ${v.e2_390}`).join(' ;; ')
const mapa = Object.fromEntries(vars.map((v, i) => [`C${i + 1}`, v.id]))
const JUDGE = { type: 'object', properties: { ranking: { type: 'array', items: { type: 'object', properties: { image: { type: 'string' }, rank: { type: 'number' }, why: { type: 'string' } }, required: ['image', 'rank', 'why'] } }, bestGap: { type: 'string' } }, required: ['ranking', 'bestGap'] }
const julgado = await parallel([
  ['pertence', 'PERTENCIMENTO: o bloco parece um objeto do mesmo atlas (mesma tinta, mesmo papel, mesma mão) ou um componente de produto colado por cima?'],
  ['leitura', 'LEITURA E AÇÃO: dá para ler onde parou, o estado e o motivo em um golpe de vista, e a ação é inequívoca e clicável?'],
  ['acabamento', 'ACABAMENTO: nada parece template, IA genérica ou placeholder; o objeto aguenta 390 e 1440'],
].map(([k, lens]) => () => agent(`Você é um diretor de arte exigente julgando às cegas variantes de um bloco de "onde você parou" dentro da entrada de um produto educacional autoral de energia (gravura a buril sobre papel).
Não abra nenhum arquivo além destes; não edite nada. Referência de qualidade do produto: ${DOCS}/captures/reference/north-star-home-panel.png.
Candidatas (desktop | celular): ${cand}
Lente: ${lens}. Ranqueie todas e nomeie a maior lacuna da melhor.`, { label: `julgar:${k}`, phase: 'Julgar', schema: JUDGE, effort: 'high' })))

phase('Integrar')
const INT = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, assetsPublished: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, captures: { type: 'string' }, checks: { type: 'string' }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'tsc', 'detect', 'captures', 'checks', 'knownGaps'] }
const integrado = await agent(`Você é o BUILDER (agente LYCEUM) da Alexandria v2. Diretório ${WT}. Não faça commit/git add. Não toque index.html, src/main.tsx, app/.
LEIA: ${DOCS}/briefs/retomada.md, ${DOCS}/bar.md (S1, S2, S4, S7, A3, §7) e ${DOCS}/decisoes/.
Exploração: ${JSON.stringify(exploracao, null, 1).slice(0, 12000)}
Julgamento cego (rótulo → id: ${JSON.stringify(mapa)}; "atual" é o bloco em produção): ${JSON.stringify(julgado, null, 1).slice(0, 12000)}
TAREFA:
1) Implemente a variante vencedora (some os rankings; empate resolve pela lente "pertence") como UM componente compartilhado (ex.: src/components/alexandria/comum/Retomada.tsx) usado na Home (EntradaBlocos.tsx) e nas Trilhas (hub e carta), corrigindo a maior lacuna apontada. Mantenha o conteúdo e os estados (E0, E1, E2, E2b), a ação única com objeto e motivo, alvo ≥ 44px a 390 e contraste ≥ 4,5:1.
2) Se a vencedora usa imagem (cartucho real, plaqueta, fita), publique os arquivos em public/alexandria/v2/comum/ (WebP, srcset, nomes estáveis) e registre em ${DOCS}/media-provenance.md com todas as colunas (classe, crédito, licença, factual_review "pendente (orquestrador)").
3) Gates: \`npx tsc -b\` (0 erros) e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` (0 P0).
4) Capture as duas peças (dev server 5311; se estiver fora, suba em segundo plano): \`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/A/plans/piece-A.json --out docs/alexandria-v2/captures/A/r07 --only "^(home-E0-1440|home-E1-1440|home-E2-1440|home-E2b-1440|home-E0-390|home-E2-390|home-E2-768|account-load-E2-1440|cta-E2-1440-click|cta-E0-390-click)$"\` e \`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/B/plans/piece-B.json --out docs/alexandria-v2/captures/B/r03 --only "^(trilhas-E2-1440|trilhas-E0-1440|trilhas-E2-390|mapa-E2-1440|mapa-E2-390)$"\`. OLHE os PNGs e corrija. Confira na legend.json: sem transbordo, minFontPx ≥ 11, smallTargets vazio, truncatedText do shell vazio, mídia com classe.
Declare o que ficou pendente.`, { label: 'integrar', phase: 'Integrar', schema: INT, effort: 'high' })
return { exploracao, julgado, mapa, integrado }
