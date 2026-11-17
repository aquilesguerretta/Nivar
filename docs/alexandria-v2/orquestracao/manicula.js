export const meta = {
  name: 'alexandria-v2-manicula',
  description: 'Replace the malformed pointing hand in the resume action: cut candidates from real printed manicules, judge them blind at real scale inside the actual block',
  phases: [
    { title: 'Colher', detail: 'manículas reais de domínio público, medidas no tamanho em que foram impressas' },
    { title: 'Cortar', detail: 'seis candidatas a 16/18/20/24 px dentro do bloco real' },
    { title: 'Julgar', detail: 'duas lentes cegas, na escala real' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/manicula`
const MARCAS = `${DOCS}/media-lab/marcas-do-chrome`

const COMUM = `
CONTEXTO: Alexandria v2 (/alexandria), "atlas vivo do conhecimento em energia": gravura a buril, cartografia histórica. Pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340, tinta #2A2620. Cinzel + Lora.
O PROBLEMA, na voz do Founder (2026-09-20), olhando a marca da ação do bloco de retomada: "que porra é essa aqui kkkk, põe uma mãozinha direitinha ou alguma outra coisa". Ele está certo: a manícula atual (\`src/components/alexandria/comum/Retomada.tsx:153\`, componente \`Manicula\`) tenta desenhar punho, dedos e dobras COM LINHA a 18–20 px, e vira mancha. Veja no render: ${DOCS}/captures/A/r07/home-E2-1440.png (a linha "CONTINUAR · M01·A08", x≈218–250, y≈612–632) e home-E2-390.png.
A CAUSA MEDIDA: a especificação de traço da casa (${MARCAS}/medida/vocabulario.md) diz que a 20 px cabem no máximo **6 travessias por diâmetro**, com fio de 1,2 px e vão mínimo de 2,0 px borda a borda; a 16 px são 5 travessias e fio 1,1. A manícula atual passa muito disso. E a fundição de tipo nunca desenhou a mãozinha com linha interna: o "fist"/"index" de catálogo de tipo é **silhueta cheia**, justamente porque é pequeno.
ONDE A MARCA VIVE: ela ancora a ÚNICA ação principal do bloco (S1), à esquerda do rótulo "CONTINUAR · M01·A08 — 100 MW solar ≠ 100 MW térmica", numa linha de fio gravado com seta. Altura 18 px a 390 e 20 px a 1440. Tem de funcionar em tinta #2A2620 sobre pergaminho e sobre creme.
POSSE: escreva só dentro de ${LAB}/. Não toque src/, public/, git, nem o dev server da porta 5311 — a Peça A r07 está sendo construída em paralelo e vai colidir.`

phase('Colher')
const COLHEITA = { type: 'object', properties: { summary: { type: 'string' }, fontes: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, obra: { type: 'string' }, licenca: { type: 'string' }, url: { type: 'string' }, tamanhoImpresso: { type: 'string' } }, required: ['id', 'obra', 'licenca', 'tamanhoImpresso'] } }, licoes: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'fontes', 'licoes'] }
const colheita = await agent(`${COMUM}
TAREFA — COLHER MANÍCULAS REAIS. Pasta ${LAB}/fontes/.
A manícula (☞, "fist", "index", "digit") é uma marca real de margem de manuscrito e de livro impresso, e existe em quantidade em domínio público. Vá buscar as de verdade — não desenhe nada nesta fase.
1. Reúna de 8 a 12 exemplares em domínio público / CC0, de fontes verificáveis (Wikimedia Commons, Rijksmuseum, Internet Archive, Library of Congress, catálogos de fundição de tipo digitalizados). Prefira DUAS famílias: (a) manícula de margem, desenhada à mão em manuscrito; (b) **mãozinha de fundição de tipo**, o ornamento de catálogo — é a que foi projetada para tamanho pequeno e é a que mais interessa.
2. Para cada uma, registre obra, autor/oficina, data, licença, URL e — o dado que decide tudo — o **tamanho em que ela foi impressa ou desenhada** na folha original, transposto para uma folha de 1440 px pela razão (largura da marca ÷ largura da folha). Sem isso não dá para saber se estamos pedindo a ela algo que ela nunca fez.
3. Recorte cada uma a 1:1 da resolução nativa em ${LAB}/fontes/recortes/ e faça uma prova de escala a 16/18/20/24 px em ${LAB}/fontes/provas/.
4. Conte as travessias por diâmetro de cada exemplar e meça quanto da área é tinta cheia × linha.
Entregue \`${LAB}/fontes/CATALOGO.md\` com miniaturas, a tabela de licenças e as lições — em especial: **como a mãozinha de tipo resolve o punho, os dedos e a manga quando é pequena**, e a partir de que calibre ela passa a mostrar linha interna. Se alguma fonte não tiver licença clara, descarte e diga por quê.`, { label: 'colher', phase: 'Colher', schema: COLHEITA, effort: 'high' })

phase('Cortar')
const CAND = { type: 'object', properties: { summary: { type: 'string' }, contatos: { type: 'array', items: { type: 'string' } }, candidatas: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, ideia: { type: 'string' }, travessias: { type: 'string' }, contraste: { type: 'string' }, bloco1440: { type: 'string' }, bloco390: { type: 'string' } }, required: ['id', 'ideia', 'travessias', 'bloco1440', 'bloco390'] } }, svg: { type: 'string' } }, required: ['summary', 'candidatas', 'svg'] }
const cortadas = await agent(`${COMUM}
COLHEITA: ${colheita ? JSON.stringify(colheita).slice(0, 6000) : '(falhou — colha você mesmo antes de cortar)'} · catálogo em ${LAB}/fontes/CATALOGO.md, recortes em ${LAB}/fontes/recortes/.
TAREFA — SEIS CANDIDATAS, CORTADAS PARA O CALIBRE. Pasta ${LAB}/candidatas/.
Produza as seis abaixo como caminhos vetoriais (uma fonte de geometria só, \`${LAB}/_ferramentas/manicula.py\` ou .mjs), respeitando o teto de travessias da especificação:
1. \`silhueta\` — **mãozinha de tipo em silhueta cheia**, traçada de um exemplar real de fundição: punho, polegar e indicador como UMA forma de tinta cheia, manga como um entalhe negativo, zero linha interna. É a hipótese forte: é assim que a marca realmente imprime pequena.
2. \`punho-e-vazio\` — silhueta cheia com UM único vazio (a separação entre o indicador e o punho), nada mais.
3. \`linha-minima\` — a manícula em linha, mas cortada ao osso: só o contorno externo e a linha do indicador, dentro do teto de 6 travessias a 20 px.
4. \`agulha\` — sem mão: agulha de chamada com triângulo cheio na ponta, na mesma linguagem dos letreiros do globo (o plano B já registrado).
5. \`flamula\` — sem mão: a flâmula de posição do jogo de marcas aprovado (${MARCAS}/final/ ou ${MARCAS}/direcoes/carta/) apontando para a ação.
6. \`nenhuma\` — controle: nenhuma marca, só o fio gravado com o terminal entalhado fazendo o trabalho inteiro. Se esta ganhar, a resposta é tirar a mão.
PARA CADA UMA: renderize DENTRO DO BLOCO REAL. Recorte o bloco de retomada de ${DOCS}/captures/A/r07/home-E2-1440.png e home-E2-390.png e troque só a marca, mantendo tipografia, fio, seta e rótulo idênticos. Salve \`bloco-<id>-1440.png\` e \`bloco-<id>-390.png\` (nomes neutros, sem dizer a ideia no PNG). Inclua \`bloco-atual-*\` — o recorte sem alteração nenhuma.
Mais uma folha de contato \`contato-16-18-20-24.png\`: as seis em fileira, nos quatro calibres, em tinta sobre pergaminho, ao lado do exemplar real que inspirou cada uma.
MEDIÇÕES: travessias por diâmetro em cada calibre, contraste no pixel renderizado (≥4,5:1 contra pergaminho E contra creme), e a caixa de tinta. Entregue \`manicula.svg\` + \`manicula.json\` com os caminhos prontos para virar componente React.
OLHE cada PNG a 100% antes de entregar. Se a 18 px a forma ainda vira mancha, ela não está cortada o bastante — volte e tire traço.`, { label: 'cortar', phase: 'Cortar', schema: CAND, effort: 'high' })

if (!cortadas || !(cortadas.candidatas ?? []).length) return { colheita, cortadas, julgado: null }

phase('Julgar')
const cs = cortadas.candidatas
const lista = cs.map((c, i) => `C${i + 1}: ${c.bloco1440} | ${c.bloco390}`).join(' ;; ')
const mapa = Object.fromEntries(cs.map((c, i) => [`C${i + 1}`, c.id]))
const JUIZ = { type: 'object', properties: { ranking: { type: 'array', items: { type: 'object', properties: { image: { type: 'string' }, rank: { type: 'number' }, why: { type: 'string' } }, required: ['image', 'rank', 'why'] } }, bestGap: { type: 'string' }, reprovadas: { type: 'array', items: { type: 'string' } } }, required: ['ranking', 'bestGap'] }
const julgado = (await parallel([
  ['forma', 'A FORMA SE LÊ? No tamanho em que está na tela (e só nele — não amplie), a marca lê como o que ela quer ser, ou vira mancha, borrão, sujeira ou glifo quebrado? Uma delas é o estado atual, que o dono do produto olhou e riu. Diga qual você acha que é.'],
  ['trabalho', 'A MARCA FAZ TRABALHO? Ela ancora a única ação principal do bloco e diz "clique aqui" sem gritar, na mesma mão do resto da página gravada? Ou é enfeite que poderia sair sem custo — e, se for, a candidata sem marca nenhuma não seria melhor?'],
].map(([k, lente]) => () => agent(`Você é um diretor de arte exigente julgando às cegas a marca que ancora a ação "CONTINUAR" dentro do bloco de "onde você parou" de um atlas de energia gravado a buril. Não abra nenhum arquivo além dos listados; não edite nada. Julgue na escala real do PNG.
Candidatas (bloco a 1440 | bloco a 390): ${lista}
Folha de contato nos quatro calibres: ${LAB}/candidatas/contato-16-18-20-24.png
Lente: ${lente}
Ranqueie todas, nomeie a maior lacuna da melhor e liste as que devem ser descartadas de vez, com o motivo.`, { label: `julgar:${k}`, phase: 'Julgar', schema: JUIZ, effort: 'high' })))).filter(Boolean)

return { colheita, cortadas, mapa, julgado }
