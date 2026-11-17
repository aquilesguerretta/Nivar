export const meta = {
  name: 'alexandria-v2-marcas-do-chrome',
  description: 'Draw the house mark set that replaces the generic chrome (position, registry seal, destination glyphs, focus, link, locator separator, index entry): three directions, blind judge',
  phases: [
    { title: 'Medir', detail: 'vocabulário real de buril na própria chapa e nas gravuras CC0' },
    { title: 'Desenhar', detail: 'três direções, jogo completo de marcas em escala real' },
    { title: 'Julgar', detail: 'três lentes cegas' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/marcas-do-chrome`
const REAIS = `${DOCS}/media-lab/fontes-reais/atlas-gravuras-identidade`

const COMUM = `
CONTEXTO: Alexandria v2 (/alexandria), currículo de energia da NIVAR, "atlas vivo do conhecimento em energia": gravura a buril, cartografia histórica. Papel pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara, ~1 por viewport). Cinzel (identidade) + Lora (conteúdo). Tokens em ${WT}/src/design/alexandria-tokens.ts.
LEIA ANTES: ${DOCS}/briefs/piece-A-r07.md (o brief desta rodada) e ${DOCS}/briefs/varredura-anti-ia.md (tabela de 38 tiques com coordenada e gate; interessam T1, T3, T5, T6, T7, T14, T18, T27, T28, T29).
O PROBLEMA: o chrome da Alexandria hoje é de prateleira. A conta é um disco preenchido com a inicial (botão de perfil de Gmail). A nav ativa é sublinhado de tab de 2014, que colide com o sublinhado de link comum. A barra móvel usa ícones de linha de biblioteca. O foco é o retângulo de 2px do reset. O localizador usa chevron. Estado e posição usam a série de círculos vazio/meio/cheio, que é radio button.
DUAS REGRAS DE SISTEMA: (1) nenhuma caixa default — retângulo com fio em volta não é campo, botão nem rótulo; onde há caixa, há fio de tinta, superfície ou nada; (2) nenhum círculo de formulário — disco com inicial, anel com pictograma e a série vazio/meio/cheio saem. O círculo pleno é a única exceção de raio do sistema e não se gasta em avatar.
O QUE JÁ SOBREVIVE AO TESTE e é a régua: a banderole "VOCÊ ESTÁ AQUI" com pontas entalhadas, os fólios (M01·A08), o globo com estações de latão numeradas, a linha "Sobre esta figura". Olhe em ${DOCS}/captures/A/r06/home-E2-1440.png e ${DOCS}/captures/B/r02/mapa-E2-1440.png.
MATERIAL REAL (licença verificada, catálogo em ${DOCS}/media-lab/fontes-reais/CATALOGO.md): ${REAIS}/web/ e ${REAIS}/originais/ — atl-13-portulano-atlantico-roiz-1633 (13.085 px, rosas-dos-ventos e marcas de rota), atl-11-rosa-dos-ventos-1598, atl-21-blaeu-1635-mundo, atl-07-blaeu-globo-terrestre (CC0), atl-14/atl-15 (cartuchos CC0), atl-10-escala-armilar-blaeu.
GLIFOS QUE JÁ EXISTEM no código (não reinvente o que serve): ${WT}/src/components/alexandria/trilhas/glifos.tsx.
FERRAMENTAS: Python + PIL para medir e compor; Playwright via createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json') para capturar HTML; Higgsfield e Blender só se resolverem melhor que o traço (estas marcas vivem a 12–32 px: vetor nítido ganha de raster quase sempre — se usar raster, prove na escala real).
POSSE: escreva só dentro de ${LAB}/. Não toque src/, public/, git, nem o dev server da porta 5311.`

const JOGO = `JOGO DE MARCAS (sete peças, todas na mesma mão):
1. POSIÇÃO — a marca de "você está aqui", em três escalas: 12 px (linha de lista de aulas), 16 px (item ativo da nav e da barra móvel) e 28 px (localizador e chrome do globo). É a MESMA forma, muda de escala, nunca de desenho.
2. REGISTRO — a entrada de conta que substitui o disco com inicial: ex-líbris ou carimbo de registro, iniciais em versalete dentro de moldura de fio. 32 px de altura no cabeçalho, alvo ≥44×44 a 390. Precisa funcionar com "A" e com "AG".
3. DESTINOS — cinco glifos gravados de carta, um por destino, a 20 e 24 px: Trilhas, Atlas, Glossário, Biblioteca e o sumário (a folha "MAIS" do celular). Nada de line-icon de biblioteca (gráfico, documento, estante). Cada um precisa ser distinguível dos outros quatro em cinza, a 20 px.
4. FOCO — marca de foco que substitui o retângulo de 2px: sobre um alvo retangular (item de nav), sobre o selo de registro e sobre uma linha de texto. Contraste ≥3:1 contra papel E contra navy, com folga, nunca cortada pelo cabeçalho.
5. LIGAÇÃO — dois tratamentos distintos, mostrados numa linha de texto real: (a) remissão de aparato ("PLD", "sobre esta figura", fonte) e (b) travessia entre superfícies ("ver as três trilhas"). Hoje os dois usam o mesmo sublinhado de 1px, e é isso que precisa acabar.
6. SEPARADOR — o separador do localizador, no lugar do chevron "›": marca da própria carta (marco de rota, traço de rumo), a 11–13 px, junto de nomes em versalete.
7. ENTRADA DE ÍNDICE — o campo de busca como palavra de chamada em versalete assentada sobre fio de tinta (o fio É o campo): três estados em escala real (repouso, com foco, com texto digitado), sem caixa, sem fundo, sem placeholder.`

const ENTREGA = `ENTREGA (mesma para as três direções):
- \`folha-<id>.png\`: prancha de amostra com as sete peças em escala real 1:1 (não amplie; quem julga precisa ver o que o olho verá), sobre papel #F2E9D6, cada peça com o nome em aparato.
- \`chrome-<id>-1440.png\` e \`chrome-<id>-390.png\`: o cabeçalho REAL da Home em E2 com as marcas no lugar — recorte das capturas r06 para o corpo da página, trocando só o chrome (cabeçalho a 1440; cabeçalho + barra inferior a 390). Fiel: mesma tipografia, mesmas medidas, mesmos rótulos.
- \`marcas-<id>.svg\` + \`marcas-<id>.json\`: os caminhos de verdade (atributo \`d\`, viewBox, espessura de traço por escala) prontos para o builder importar. Sem isso a direção não é implementável e não entra no julgamento.
- \`receita-<id>.md\`: de onde veio cada forma (qual gravura, qual medida da chapa), espessura de fio em cada escala e as medições de contraste e de alvo.
VERIFIQUE ANTES DE ENTREGAR: abra cada PNG na escala real e olhe. Marca que some a 12 px, ou que vira mancha, está reprovada — volte e engrosse o traço. Meça contraste (≥4,5:1 texto, ≥3:1 glifo e foco) e alvo (≥24×24; ≥44×44 na nav e na ação principal a 390).`

phase('Medir')
const MEDIDA = { type: 'object', properties: { summary: { type: 'string' }, chapa: { type: 'string' }, vocabulario: { type: 'array', items: { type: 'object', properties: { marca: { type: 'string' }, origem: { type: 'string' }, medida: { type: 'string' } }, required: ['marca', 'origem', 'medida'] } }, arquivos: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'chapa', 'vocabulario'] }
const medida = await agent(`${COMUM}
TAREFA — MEDIR O VOCABULÁRIO, ANTES DE DESENHAR. Pasta ${LAB}/medida/.
Ninguém inventa a mão da casa: ela já existe na chapa que a r06 produziu e nas gravuras reais. Meça e registre, com número:
1. Na prancha da Home (${DOCS}/captures/A/r06/home-E2-1440.png e os WebP em ${WT}/public/alexandria/v2/home/): o passo da hachura (a r06 usou 7,6 px), a espessura do fio de tinta, os tons de papel e tinta medidos em pixel (não os do token — os que a imagem realmente tem), a geometria das pontas entalhadas da banderole "VOCÊ ESTÁ AQUI", a forma das estações de latão e dos fólios.
2. Nas gravuras CC0 (atl-13 em resolução original, atl-11, atl-21, atl-07): como o buril resolve marca pequena — rosa dos ventos, marca de rumo, marco de rota, remissão, cartela mínima. Recorte exemplos a 1:1 do tamanho em que a marca aparece impressa e salve em ${LAB}/medida/recortes/.
3. Conclua com uma ESPECIFICAÇÃO curta: espessuras de fio permitidas a 12/16/20/24/32 px, ângulos e entalhes da família, o que a mão da casa NÃO faz.
Entregue \`${LAB}/medida/vocabulario.md\` com as medições e as miniaturas dos recortes. Não desenhe marca nova nesta fase.`, { label: 'medir', phase: 'Medir', schema: MEDIDA, effort: 'high' })

phase('Desenhar')
const spec = medida ? JSON.stringify(medida).slice(0, 6000) : '(a medição falhou — meça você mesmo antes de desenhar)'
const DIRECOES = [
  ['carta', 'DIREÇÃO CARTA. A família é a da própria carta náutica: pontas entalhadas da banderole, marca de rumo, marco de rota, rosa dos ventos reduzida ao essencial. A posição é a banderole em escala de chrome; o registro é uma cartela de carta com as iniciais; os destinos são objetos de carta (rosa dos ventos, marco de rota, marca de remissão, ficha, folha dobrada); o foco são as marcas de apontamento que a carta usa para indicar coordenada.'],
  ['registro', 'DIREÇÃO CADERNO DE REGISTRO. A família é a do caderno de campo e do arquivo: carimbo, ex-líbris, marginália, manícula, marca de conferência a bico de pena. A posição é a marca que a mão do pesquisador faz na margem; o registro é o carimbo de posse; os destinos são marcas de anotação; o foco são colchetes de tinta nos cantos.'],
  ['chapa', 'DIREÇÃO CHAPA E LATÃO. A família é a do instrumento: as estações de latão do globo, a escala armilar, o numeral gravado em relevo, o entalhe na chapa. A posição é a estação de latão em escala de chrome (mesma família das medalhas de módulo, F-MD3: a estação do globo e a medalha são o mesmo objeto); o registro é a plaqueta cunhada; os destinos são entalhes na chapa; o foco é o rebaixo do buril em volta do alvo.'],
]
const DESENHO = { type: 'object', properties: { summary: { type: 'string' }, id: { type: 'string' }, folha: { type: 'string' }, chrome1440: { type: 'string' }, chrome390: { type: 'string' }, svg: { type: 'string' }, json: { type: 'string' }, receita: { type: 'string' }, medicoes: { type: 'string' }, riscos: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'id', 'folha', 'chrome1440', 'chrome390', 'svg', 'receita', 'medicoes'] }
const desenhos = (await parallel(DIRECOES.map(([id, direcao]) => () => agent(`${COMUM}
MEDIÇÃO DA CHAPA (use estes números, não invente outros): ${spec}
Veja também ${LAB}/medida/vocabulario.md e os recortes em ${LAB}/medida/recortes/.
TAREFA — UMA DIREÇÃO COMPLETA DE MARCAS. Pasta ${LAB}/direcoes/${id}/. Seu id é "${id}".
${direcao}
${JOGO}
${ENTREGA}
Fique dentro da sua direção: as três precisam ser distinguíveis quando julgadas lado a lado. Não mostre o nome da direção nos PNGs.`, { label: `desenhar:${id}`, phase: 'Desenhar', schema: DESENHO, effort: 'high' })))).filter(Boolean)

if (desenhos.length < 2) return { medida, desenhos, julgado: null }

phase('Julgar')
const mapa = Object.fromEntries(desenhos.map((d, i) => [`C${i + 1}`, d.id]))
const cand = desenhos.map((d, i) => `C${i + 1}: ${d.folha} | ${d.chrome1440} | ${d.chrome390}`).join(' ;; ')
const JUIZ = { type: 'object', properties: { ranking: { type: 'array', items: { type: 'object', properties: { image: { type: 'string' }, rank: { type: 'number' }, why: { type: 'string' } }, required: ['image', 'rank', 'why'] } }, bestGap: { type: 'string' }, pecasFracas: { type: 'array', items: { type: 'string' } } }, required: ['ranking', 'bestGap'] }
const julgado = (await parallel([
  ['pertence', `PERTENCIMENTO: as marcas parecem cortadas pela mesma mão que gravou a prancha do globo, ou parecem um icon set colado por cima? Compare com ${DOCS}/captures/A/r06/home-E2-1440.png e com ${DOCS}/captures/reference/north-star-home-panel.png.`],
  ['escala', 'FUNÇÃO EM ESCALA REAL: a 12, 16 e 20 px, cada marca ainda diz o que é? Os cinco destinos se distinguem entre si em cinza? O foco aparece sobre papel e sobre navy? A entrada de índice lê como campo sem ser caixa?'],
  ['recorte', 'TESTE DO RECORTE-E-COLA: alguma dessas marcas poderia ser colada em qualquer SaaS sem ninguém notar? Aponte exatamente quais peças ainda cheiram a biblioteca de ícones, a radio button ou a command palette.'],
].map(([k, lente]) => () => agent(`Você é um diretor de arte exigente julgando às cegas três jogos de marcas de interface para um atlas de energia gravado a buril. Não abra nenhum arquivo além dos listados; não edite nada.
Candidatas (folha de amostra | cabeçalho 1440 | cabeçalho 390): ${cand}
Lente: ${lente}
Ranqueie as três, nomeie a maior lacuna da melhor e liste as peças fracas por nome (posição, registro, destinos, foco, ligação, separador, entrada de índice) — inclusive as da vencedora.`, { label: `julgar:${k}`, phase: 'Julgar', schema: JUIZ, effort: 'high' })))).filter(Boolean)

return { medida, desenhos, mapa, julgado }
