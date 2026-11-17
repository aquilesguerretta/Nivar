export const meta = {
  name: 'alexandria-v2-piece-A-r07',
  description: 'Piece A round 7: synthesize the winning mark set, rebuild the whole chrome (search, account, locator, active nav, mobile bar, focus, links, widths), show the route inside the module on the globe, fix the resume hierarchy, capture and self-check',
  phases: [
    { title: 'Sintetizar', detail: 'jogo final de marcas: registro + a flâmula da carta, com as cinco correções' },
    { title: 'Construir o chrome', detail: 'cabeçalho, busca, localizador, nav ativa, celular, foco, ligação, larguras' },
    { title: 'Construir a Home', detail: 'percurso dentro do módulo no globo + hierarquia da retomada + captura' },
    { title: 'Conferir', detail: 'olhar cada PNG na escala real e corrigir o que se vê' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/marcas-do-chrome`

const CASA = `
CONTEXTO: Alexandria v2 (/alexandria), currículo de energia da NIVAR, "atlas vivo do conhecimento em energia": gravura a buril, cartografia histórica. Pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara). Cinzel (identidade) + Lora (conteúdo). Tokens: ${WT}/src/design/alexandria-tokens.ts.
LEIA: ${DOCS}/briefs/piece-A-r07.md (o brief desta rodada, inteiro), ${DOCS}/briefs/varredura-anti-ia.md (os 38 tiques com coordenada e gate) e ${DOCS}/bar.md (S1, S2, S3, S5, S7, A1–A6, §6, §7).
ESPECIFICAÇÃO DE TRAÇO, medida na própria chapa (obrigatória, não é sugestão): ${LAB}/medida/vocabulario.md. Resumo dos pisos: fio principal por escala — 12 px: 1,0 · 16 px: 1,1 · 20 px: 1,2 · 24 px: 1,4 · 32 px: 1,6; fio secundário 0,8/0,9/1,0/1,1; travessias máximas por diâmetro 4/5/6/7/9; vão mínimo 2,0 px borda a borda. Piso de tinta para cumprir o S7: tinta 0,51 px (3:1) e 0,66 px (4,5:1); navy 0,49/0,64; ouro sobre navy 0,54/0,74. Terracota satura em 4,87:1 e NÃO é cor de fio. Ângulos 0/90/45 para estrutura; diagonal livre só como rumo; nada entre 1° e 15°. A marca mede 1,3–1,6× a altura de maiúscula da palavra ao lado.
O ACHADO QUE MANDA NESTA RODADA: hoje SETE objetos do chrome usam o mesmo fio #CFC1A4 a 1,45–1,64:1 e 0,17–0,64 px de tinta — cabeçalho, divisória, caixa de busca, keycap, cartão, faixa do localizador. A 1,46:1 isso reprova o ≥3:1 de borda de controle do S7, e a chapa da casa desenha uma ordem de grandeza acima (aresta da banderole: 2,13 px a 9,69:1). O chrome usa 20% da tinta que o papel da casa pede. E o T7×T28 medido: sublinhado de link = tinta 0,92 px / 13,94:1; sublinhado da nav ativa = navy 1,48 px / 12,65:1 — "clicável" e "você está aqui" separados por 0,56 px.`

phase('Sintetizar')
const SINT = { type: 'object', properties: { summary: { type: 'string' }, svg: { type: 'string' }, json: { type: 'string' }, prancha: { type: 'string' }, chrome1440: { type: 'string' }, chrome390: { type: 'string' }, medicoes: { type: 'string' }, decisoes: { type: 'array', items: { type: 'string' } }, pendencias: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'svg', 'json', 'prancha', 'medicoes'] }
const marcas = await agent(`${CASA}
TAREFA — O JOGO FINAL DE MARCAS. Pasta ${LAB}/final/. Você NÃO toca src/ nem public/ nesta fase.

O julgamento cego já aconteceu e foi unânime: das três direções em ${LAB}/direcoes/, venceu **registro** (1º nas três lentes: pertencimento, escala, recorte-e-cola). Sua tarefa é produzir o jogo final — a vencedora com um enxerto e cinco correções, todas nomeadas pelos juízes.

O QUE FICA DA VENCEDORA (${LAB}/direcoes/registro/): a lógica de caixa tipográfica, que é o que fez ela ganhar. O asterisco de remissão ✳ para o Glossário e a adaga dupla ‡ para a Biblioteca são marcas de nota de rodapé — o vocabulário de um atlas gravado — e ficam como estão. A cúpula hachurada do Atlas fica. Os colchetes de registro do FOCO ficam (funcionam sobre papel e sobre navy). A ENTRADA DE ÍNDICE fica (palavra de chamada em versalete sobre fio de tinta, sem caixa, sem fundo, sem placeholder; em foco o fio engrossa e os colchetes entram). Os dois tratamentos de LIGAÇÃO ficam (remissão = asterisco sem fio; travessia = fio com batente nas duas pontas).

O ENXERTO (as três lentes nomearam a MESMA maior lacuna): a marca de POSIÇÃO da vencedora, "‖◆", está reprovada. Citando: "lê como sujeira tipográfica colada ao wordmark"; "a 28 px é ‖◆ e a 12 px vira ‖• — o losango colapsa em ponto, não é o mesmo desenho"; "dois fios verticais com um ponto ao lado é exatamente o drag-handle que existe em todo SaaS com lista reordenável". Ela sai inteira. Entra no lugar a **flâmula da direção carta** (${LAB}/direcoes/carta/): flâmula de ponta entalhada em V sobre mastro, que é a cauda da banderole "VOCÊ ESTÁ AQUI" em escala de chrome — derivação legítima do objeto que já existe no produto (letreiroCarta.ts::desenharSelo), direcional, e a única das três que os juízes chamaram de "a semântica mais direta de você está aqui". Mesma forma a 12/16/28 px. Traga o caminho de ${LAB}/direcoes/carta/ e ajuste o peso do fio à tabela de escala.

AS QUATRO CORREÇÕES RESTANTES:
1. MAIS — a folha de canto dobrado é o ícone "file" de qualquer biblioteca, a única das cinco que não vem da caixa tipográfica. Troque por um terceiro sinal de nota (§, ¶ ou reticências cravadas), fechando a família com as outras quatro.
2. TRILHAS — o buril com apara é bonito a 24 px e ilegível a 20 px ("a apara desmanchando em sujeira" na prova em cinza da própria folha). Redesenhe com menos traços e mais separação, dentro do teto de 6 travessias e vão de 2,0 px a 20 px. Ele precisa comunicar "território/rota", não "ferramenta".
3. REGISTRO (o selo de conta) — a aba dobrada projeta um cinza difuso por baixo que lê como box-shadow, e sobre navy ganha um segundo halo azulado em anel duplo. O S2 é zero sombra: profundidade vem de fio. Resolva por fio duplo — a cartela de carta com as duas pontas entalhadas da direção carta foi chamada de "a marca de registro mais bem cortada do lote" e é o caminho mais curto. Precisa funcionar com "A" e com "AG", a 32 px no cabeçalho e com alvo ≥44×44 a 390.
4. SEPARADOR — com a flâmula como posição, o losango vazado ◇ do separador deixa de colidir e fica. Confirme na prova a 12 px que os dois não se confundem.

ENTREGA em ${LAB}/final/:
- \`marcas.svg\` e \`marcas.json\`: os caminhos de verdade (\`d\`, viewBox, fio por escala, caixa de tinta), fonte única, prontos para virar componente React. Um caminho por marca, sem segunda versão.
- \`prancha-final.png\`: as sete peças em escala real 1:1 sobre papel, com o nome de cada uma em aparato, mais a prova em cinza dos cinco destinos a 20 px.
- \`chrome-final-1440.png\` e \`chrome-final-390.png\`: o cabeçalho real da Home em E2 com as marcas no lugar (recorte do corpo da página vindo de ${DOCS}/captures/A/r07/home-E2-1440.png e home-E2-390.png), a 390 com a barra inferior.
- \`medicoes.json\`: contraste medido no pixel renderizado (não no token) e alvo de cada marca em cada escala.
OLHE cada PNG na escala real antes de entregar. Marca que satura ou some a 12 px está reprovada — engrosse ou corte traços.`, { label: 'sintetizar', phase: 'Sintetizar', schema: SINT, effort: 'high' })

const M = marcas ? JSON.stringify(marcas).slice(0, 7000) : '(a síntese falhou — leia o julgamento em media-lab/marcas-do-chrome/ e decida você)'

phase('Construir o chrome')
const BUILD = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, tiquesResolvidos: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, medidas: { type: 'string' }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'tsc', 'detect', 'knownGaps'] }
const chrome = await agent(`Você é o BUILDER (agente LYCEUM) da Alexandria v2. Diretório ${WT}. NÃO faça commit nem git add. NÃO toque index.html, src/main.tsx, app/, nem src/components/alexandria/home/ (é do próximo agente).
${CASA}
JOGO DE MARCAS APROVADO: ${LAB}/final/marcas.svg + marcas.json + prancha-final.png. Resumo da síntese: ${M}

TAREFA — O CHROME INTEIRO. Seus arquivos: \`src/components/alexandria/shell/\` (AlexandriaHeader, NavMovel, Localizador, MarcaAlexandria, AlexandriaShell, AlexandriaFooter, navegacao.ts), \`src/components/alexandria/busca/BuscaDialogo.tsx\`, e um novo \`src/components/alexandria/comum/Marcas.tsx\` com o jogo aprovado (um componente por marca, tamanho como prop, fio seguindo a tabela de escala — nada de escalar por transform, o fio tem de ficar no peso certo em cada calibre).

1. AS DUAS REGRAS DE SISTEMA (brief §0). Nenhuma caixa default: retângulo com fio em volta não é campo, botão nem rótulo — vira fio de tinta, superfície ou nada. Nenhum círculo de formulário: o disco Ø30 navy com a inicial some sem herdeiro; o círculo pleno continua sendo a exceção de raio do S2 e não se gasta em avatar.
2. BUSCA (T1, T8, T10–T13). A pílula "Ctrl K" sai, e não pode reaparecer como chip "FECHAR ESC" no diálogo — se o atalho for anunciado, é uma vez, em linha de aparato no pé da folha, sem caixa e sem fio. O campo vira entrada de índice impressa. O diálogo deixa de ser command palette: fólio na margem (a calha de rótulos AULA/TERMO sai — M01·A08 já diz que é aula), resultados agrupados por território e módulo com cabeçalho de seção, hierarquia por tipografia e fio, a posição do learner como marginália com a marca de posição, e a dica de teclado uma vez no pé. Nada de faixa de acento à esquerda no selecionado nem fundo tingido: o item corrente leva a marca de posição.
3. CONTA (T3, T14). Selo de registro no lugar do disco. O rótulo diz o que abre ("seu registro"), não "PROGRESSO" — progresso não é status de cabeçalho (S3). BUSCAR, ENTRAR e FECHAR não podem mais ter o mesmo desenho: três atos, três formas.
4. NAV ATIVA (T28, T29) e LOCALIZADOR (T6). O item ativo leva a marca de posição, com o fio como reforço secundário — nunca o mesmo sublinhado do link comum. O chevron "›" sai; entra o separador da casa, nomes em versalete de aparato, item atual não é link e leva \`aria-current\`. A localização sobrevive à rolagem, ≈32 px com o cabeçalho recolhido.
5. LIGAÇÃO (T7). Dois tratamentos distintos: remissão de aparato e travessia entre superfícies. Aplique nas duas classes em todo o shell e no rodapé.
6. FOCO (T27). Colchetes de registro no lugar do retângulo de 2 px, ≥3:1 sobre papel E sobre navy, com folga, nunca sob o cabeçalho.
7. CELULAR (T5, T25). Barra inferior com os cinco glifos aprovados e a marca de posição sobre o item corrente; "MAIS" nomeia o que abre. A folha MAIS vira sumário do atlas: os três territórios com seus fólios (M01–M05, M06–M12, M13–M17) e o registro do learner como marginália — fora tudo o que a barra inferior já leva, e fora a seção "SEÇÕES". Gaveta temporária do S5.
8. LARGURA (T30, T31). O cabeçalho é a margem da folha: acompanha a folha inteira com fio de margem até a borda, ou a folha é capada junto. A 768 a nav global não vira barra de telefone — os quatro territórios cabem no cabeçalho ou numa linha de rota própria.
9. RODAPÉ (T15, só a coluna "NAVEGAÇÃO"): ela repete inteiro o header fixo da mesma tela. Tire a repetição; o colofão completo fica para a r08.

PORTÕES: \`npx tsc -b\` (nunca --noEmit) com 0 erros e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` com 0 P0. Meça no render (Playwright, estilo computado), não no token: contraste de cada fio novo, alvo de cada controle a 390, e confirme que nenhum dos sete objetos do chrome ficou abaixo de 3:1. Não capture a peça — quem captura é o próximo agente.
Declare o que ficou pendente.`, { label: 'chrome', phase: 'Construir o chrome', schema: BUILD, effort: 'high' })

phase('Construir a Home')
const CAP = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, captures: { type: 'string' }, checks: { type: 'string' }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'tsc', 'detect', 'captures', 'checks', 'knownGaps'] }
const home = await agent(`Você é o BUILDER (agente LYCEUM) da Alexandria v2. Diretório ${WT}. NÃO faça commit nem git add. NÃO toque index.html, src/main.tsx, app/, nem src/components/alexandria/shell/ e /busca/ (acabaram de ser reescritos pelo agente do chrome — leia-os, não os edite).
${CASA}
O chrome foi reescrito agora; o relatório dele: ${chrome ? JSON.stringify(chrome).slice(0, 6000) : '(falhou)'}
Marcas aprovadas: ${LAB}/final/marcas.json e \`src/components/alexandria/comum/Marcas.tsx\`.

TAREFA — A HOME E A CAPTURA.
1. **Percurso dentro do módulo no globo** (lacuna do Brief na r06: em E2 o globo é quase igual ao de E0). Em E2 o objeto precisa dizer três coisas num golpe de vista: território atual, módulo atual e **posição na rota de nove estações do M01**. O número é "7 de 9" e já é verdadeiro nas outras superfícies — não pode divergir (S3). NÃO refaça o globo: a chapa da r06 fica como está (papel e tinta medidos na prancha, sombra de contato em três camadas, letreiro fora do disco sem colisão). O percurso entra no vocabulário existente — estações, marca de posição, fio de rota percorrida × por vir —, sem cor nova e sem cobrir rótulo.
2. **Abaixo de 1440** (lacuna do System na r06): nomes de território, legenda de estados e a declaração de classe da figura precisam existir no 1º viewport a 390 e 768 também. Se não couber com eles, o objeto encolhe ou a composição muda — a legenda não é opcional (§7).
3. **Hierarquia da retomada** (regressão de Craft da r06, ainda aberta): hoje a manchete do bloco é "Física de Energia e Eletricidade", um nome de catálogo, e a tese "100 MW solar ≠ 100 MW térmica" chega como cauda da linha de ação. Na r05 a tese mandava. Inverta: **a tese ocupa o lugar de destaque** e **a ação é um rótulo curto** com objeto e motivo, não um parágrafo. O componente é \`src/components/alexandria/comum/Retomada.tsx\` e é compartilhado com as Trilhas — a mudança vale nas três superfícies, e a carta e o hub não podem quebrar.
4. **Marcas na Home**: troque os círculos de radio button da legenda e do trilho pela marca de posição e pelos glifos de estado do jogo aprovado (T18, T19 fica para a r08).

CAPTURA. Dev server na 5311 (se estiver fora, suba em segundo plano). Rode:
\`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/A/plans/piece-A.json --out docs/alexandria-v2/captures/A/r07\`
e depois a peça B, que compartilha o chrome e a retomada:
\`node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/B/plans/piece-B.json --out docs/alexandria-v2/captures/B/r03\`
PORTÕES: \`npx tsc -b\` 0 erros, \`gridalpha-detect\` 0 P0, e na legend.json das duas: horizontalOverflow false, minFontPxShell ≥ 11, smallTargets vazio, truncatedText do shell vazio, mídia com classe.`, { label: 'home', phase: 'Construir a Home', schema: CAP, effort: 'high' })

phase('Conferir')
const CONF = { type: 'object', properties: { summary: { type: 'string' }, achados: { type: 'array', items: { type: 'object', properties: { png: { type: 'string' }, problema: { type: 'string' }, acao: { type: 'string' } }, required: ['png', 'problema', 'acao'] } }, corrigidos: { type: 'array', items: { type: 'string' } }, naoCorrigidos: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' } }, required: ['summary', 'achados', 'tsc', 'detect'] }
const conferido = await agent(`Você é o BUILDER de conferência da Alexandria v2. Diretório ${WT}. NÃO faça commit nem git add.
${CASA}
A r07 acabou de ser construída e capturada. Relatórios: chrome → ${chrome ? JSON.stringify(chrome).slice(0, 3000) : '(falhou)'} ;; home → ${home ? JSON.stringify(home).slice(0, 3000) : '(falhou)'}

TAREFA — OLHAR E CORRIGIR O QUE SE VÊ, não o que se deduz.
Abra com Read **todos** os PNGs de ${DOCS}/captures/A/r07/ e ${DOCS}/captures/B/r03/, na escala real. Para cada um, faça as três perguntas:
(a) **Recorte-e-cola:** algum elemento poderia ser colado em qualquer SaaS sem ninguém notar? Vale para o que a r07 criou, não só para o que ela substituiu — o tique não pode ter sido movido de lugar.
(b) **Escala:** alguma marca saturou, sumiu ou virou mancha no calibre em que está? Alguma palavra cortada, algum alvo pequeno, alguma coisa transbordando?
(c) **Verdade:** algum número diverge entre telas no mesmo estado? Algum número pessoal aparece em E0 ou E1? Alguma imagem sem classe declarada?
Compare com ${DOCS}/captures/A/r06/ e ${DOCS}/captures/B/r02/: alguma coisa PIOROU? Regressão conta como achado.
Corrija no código o que der para corrigir sem redesenhar a rodada, recapture só os shots afetados (\`--only "^(...)$"\` — o harness funde a legend.json anterior) e confira de novo no PNG. O que não der, declare em \`naoCorrigidos\` com o motivo.
PORTÕES no fim: \`npx tsc -b\` 0 erros e \`gridalpha-detect\` 0 P0.`, { label: 'conferir', phase: 'Conferir', schema: CONF, effort: 'high' })

return { marcas, chrome, home, conferido }
