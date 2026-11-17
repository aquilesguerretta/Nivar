export const meta = {
  name: 'alexandria-v2-corrigir-2',
  description: 'Fix what the twelve critic verdicts found, and make the recurring rules mechanical so they stop coming back',
  phases: [
    { title: 'Tornar mecânico', detail: 'as regras que voltam viram gate do auditor' },
    { title: 'B · Trilhas r05', detail: 'a ação volta para a primeira dobra; nenhum destino falso' },
    { title: 'A · Home r10', detail: 'contraste sem emenda; vocabulário de estado entre superfícies' },
    { title: 'C · Módulo r03', detail: 'mission control a 390; fora o vocabulário de pipeline; o laboratório é instrumento' },
    { title: 'C · Aula r04', detail: 'o véu; o foco no primeiro ato; matéria na dobra de entrada' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const ORQ = `${DOCS}/orquestracao`

const ACHADOS = `
AS NOVE LACUNAS (critics da rodada anterior; três peças já ganharam um PASS — não estrague o que passou).

**B · TRILHAS — três.**
(B1) A linha de aparato de cada trilha **afirma por extenso o que o quadro desmente**: "Os 7 módulos têm caso e avaliação de 10 questões" enquanto dois módulos não mostram caso nenhum. Afirmação e evidência no mesmo quadro, discordando. Use a contagem real de ${DOCS}/extraction/identidade-modulos.json.
(B2) A prosa da faixa "O CAMPO" está **no registro interno do builder**: "em todos, a experiência jogável está em desenho, sem destino; nenhum módulo desta trilha…". Nota de implementação virada texto de produto.
(B3) Na carta, **o nó corrente é o único sem estado declarado**: a cartela do M01 traz só o título, enquanto M02–M05 carregam o kicker colado ao número ("✕ M02 · A SEGUIR"). O que está em leitura é o que não diz o que é.

**A · HOME — duas.**
(A1) Em **E2b** a cartela do globo devolve ausência como número: **"0 de 6 aulas percorridas"**. Sem dado não é zero (S4).
(A2) **A 390, em E0**, a ação principal entrega o visitante num viewport dominado por **"VÍDEO EM PRODUÇÃO"** em caixa tracejada terracota. O destino é da Peça C — coordene, não duplique.
(A3, nota do Craft que passou) a moldura de navegação é a única superfície sem grão: faixas chapadas coladas por cima e por baixo do mundo gravado.

**C · MÓDULO — duas.**
(C1) O bloco REVISÃO termina num **"REVELAR GABARITO"** nu, sem campo de resposta, sem estado de tentativa, sem registro — o artefato que o C7 nomeia como o problema.
(C2) O instrumento "Comparador de perfil elétrico" e a tabela "Física traduzida em fatura" carregam número factual **sem bloco de fonte na mesma tela** (S4).
(C3, nota do Craft que passou) em acromático a hachura do mar colapsa em duas lajes quase pretas — estado não pode depender de tinta.

**C · AULA — três.**
(D1) **A 390 o cabeçalho do INST·06 quebra**: a fita "prever → calcular → comparar" é impressa POR CIMA de "Calculadora", e o nome despenca uma palavra por linha. É a linha de 1440 espremida, não composição própria.
(D2) A caixa "esquemático" **desenha a NEGAÇÃO do que a aula afirma**: hachura de borda a borda, ~40 traços idênticos de 0 h a 8 h, quando a lição inteira é que a geração NÃO é constante. Figura que ensina o contrário é pior que figura nenhuma.
(D3) O card **"VÍDEO EM PRODUÇÃO"** no topo da aula (o mesmo de A2): ausência ocupando o 1º viewport, empurrando a pergunta e o primeiro ato para fora da tela.
`

const CASA = `Você é o BUILDER (agente LYCEUM) da Alexandria v2. Diretório ${WT}.
**NÃO faça commit nem git add. NÃO toque index.html, src/main.tsx, app/ (backend, fora desta rodada), nem .claude/launch.json.**
CONTEXTO: "atlas vivo do conhecimento em energia" — gravura a buril, cartografia histórica. Pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara). Cinzel + Lora. Tokens em src/design/alexandria-tokens.ts. Estilo inline com token, sem Tailwind em layout.
CONTRATO: ${DOCS}/bar.md · decisões em ${DOCS}/decisoes/ · tiques em ${DOCS}/briefs/varredura-anti-ia.md · loop e vereditos em ${DOCS}/loop/.
AS DUAS REGRAS DE SISTEMA, que já quebraram duas vezes em superfícies novas: **nenhuma caixa default** (retângulo com fio não é campo, botão, rótulo, chip, slider nem input) e **nenhum círculo de formulário** (disco com inicial, anel com pictograma, botão redondo de slider, série vazio/meio/cheio). Elas valem em TUDO que você escrever, inclusive em controle de instrumento.
PORTÕES: \`npx tsc -b\` (nunca --noEmit) 0 erros e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` 0 P0 — **o auditor ganhou regras novas nesta rodada; se ele acusar, é defeito seu, não ruído.**
CAPTURA: \`node tools/alexandria-capture/capture.mjs --plan <plano> --out <pasta>\`, dev server na 5311. **OLHE os PNGs com Read, na escala real.** legend.json: horizontalOverflow false, minFontPxShell ≥ 11, smallTargets vazio, truncatedText do shell vazio, mídia com classe.
${ACHADOS}`

const BUILD = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, captures: { type: 'string' }, checks: { type: 'string' }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'tsc', 'detect', 'captures', 'checks', 'knownGaps'] }
const PAIRS = { type: 'object', properties: { pairCount: { type: 'number' }, mapping: { type: 'object' }, renders: { type: 'string' } }, required: ['pairCount', 'mapping', 'renders'] }

async function julgar(piece, pieceName, capDir, round, nsPanel, pairsHint, secoes) {
  const prep = await agent(`Você prepara o julgamento cego da Peça ${piece} (${pieceName}), rodada ${round}. Diretório ${WT}. Não edite src/ nem faça git.
1. Escreva ${ORQ}/pairs-${capDir}-${round}.json no formato de ${ORQ}/pairs-B.json: lista de pares [{file,name},{file,name}], caminhos relativos a docs/alexandria-v2/. Entre 5 e 8 pares: ${pairsHint}
2. Rode \`node docs/alexandria-v2/orquestracao/build-blind-gen.mjs ${capDir} ${round} docs/alexandria-v2/orquestracao/pairs-${capDir}-${round}.json\` e devolva o \`mapping\` e o \`pairCount\` exatamente como saíram.
3. Em \`renders\`, uma lista curta dos PNGs mais importantes da rodada em ${DOCS}/captures/${capDir}/${round}/ e o que cada um prova.
Todo arquivo citado precisa existir.`, { label: `pares:${piece}${round}`, phase: `${piece} · ${pieceName}`, schema: PAIRS, effort: 'medium' })
  if (!prep) return null
  return await workflow({ scriptPath: `${ORQ}/critics-piece.js` }, { piece, pieceName, round, capDir, mapping: prep.mapping, pairCount: prep.pairCount, renders: prep.renders, nsPanel, ...secoes })
}

phase('B · Trilhas r05')
const b04 = await agent(`${CASA}
TAREFA — PEÇA B, RODADA 4. Corrija o que os três critics reprovaram na r03. Seus arquivos: \`src/components/alexandria/trilhas/\`. Não toque shell/, busca/, home/, comum/ nem modulo/ — leia e use.
1. **Achado (1): a ação volta para a primeira dobra.** A carta continua ocupando a folha — isso a r03 acertou e o cego confirmou. O que não pode é o bloco de retomada chegar cortado ao meio e a ação principal morar a 1374 px de uma página de 2624. Resolva na composição: a carta é o campo, e o registro do learner com a ação é marginália **dentro** da primeira dobra, não rodapé. Gate: a 1440 e a 390, em E2 e E2b, existe **exatamente uma** ação principal inteira e legível no 1º viewport, com objeto e motivo (S1), e o bloco de retomada não é fatiado pela dobra nem pela barra de abas.
2. **Achado (2): nenhum destino falso.** Tire os nomes de experiência inventados do painel Trilhas. Onde a fonte não declara, a linha é "experiência jogável · em desenho", sem controle e sem destino (P16, P25, S4). E a mesma superfície precisa dizer a mesma coisa que o mapa no mesmo estado.
   Aproveite o achado do preparo: **o laboratório existe em UM módulo só, o M01** (${DOCS}/extraction/identidade-modulos.json). Um marco "laboratório" em dezesseis nós é destino falso — corrija onde estiver.
3. **Achado (5): vocabulário de estado entre superfícies.** "a seguir" na Home e "NÃO INICIADO" na carta, para o mesmo módulo no mesmo estado, não podem coexistir. Escolha o vocabulário do S3 e faça a carta e o hub falarem ele. Se a correção exigir tocar um arquivo fora da sua posse, **não toque**: registre em \`knownGaps\` para o builder da Home fazer.
4. Mantenha o que a r03 ganhou: a carta como folha, a hierarquia de presença invertida, a vinheta de módulo, a continuidade nó → módulo em quadro (o trajeto em rAF, que foi o que fez o vídeo registrar).
Capture em \`${DOCS}/captures/B/r05\`, com \`--closing\`.`, { label: 'build:B-r05', phase: 'B · Trilhas r05', schema: BUILD, effort: 'high' })

const critB = b04 ? await julgar('B', 'Trilhas e carta', 'B', 'r05', 'north-star-trilhas-panel.png',
  'a r05 contra o North Star (painel Trilhas), contra a baseline r00, contra a r03 a 1440 e a 390 (guarda de regressão — a r03 ganhou presença e perdeu a ação, então os dois eixos importam), e o mapa contra o Atlas atual.',
  { briefSections: 'B1, B2, B4 e os gates de estado de B3; S1 e S3; o teste anti-LMS do §0', systemSections: 'S2, S4, S5, S6, S7; B6; §6; §7', craftSections: 'composição e identidade de B1, B3 e B5; mídia (M5, M7)', craftRule: 'o render precisa ser igual ou mais forte que o North Star em presença, claramente mais forte que a baseline r00, E manter a ação principal inteira na primeira dobra — foi a lacuna dos três critics na r03. Comparação com a r03 é guarda de regressão, medida separadamente a 1440 e a 390.' }) : null

phase('A · Home r10')
const a09 = await agent(`${CASA}
TAREFA — PEÇA A, RODADA 9. Seus arquivos: \`src/components/alexandria/home/\`, \`comum/\`, \`shell/\` e \`src/pages/alexandria/AlexandriaHome.tsx\`. Não toque trilhas/ nem modulo/ nem aula — leia e use.
1. **Achado (6): a emenda vertical.** A r08 criou uma costura dura em x=624: o painel de texto virou campo creme chapado encostado na gravura, e a folha deixou de ser uma folha só. **Isso é regressão contra a r07**, que os juízes tinham dado como superada. A causa foi a instrução de dar "campo próprio" à coluna para resolver o contraste — a saída é resolver o contraste **sem cortar a folha em duas**: a prancha volta a sangrar por baixo de tudo, e o rótulo de procedência ganha legibilidade por posição, por corpo, por uma base local pequena ou pela própria composição da prancha naquele ponto. Gate duplo: **nenhuma emenda vertical de campo chapado** E o rótulo "registro de estudo" ≥ 4,5:1 medido no pixel a 1440, 1920 e 3440, em E0 e E2.
2. **Achado (5): vocabulário de estado entre superfícies.** Home e carta precisam dar a MESMA palavra ao mesmo módulo no mesmo estado. Leia o que a Peça B fez nesta rodada (\`src/components/alexandria/trilhas/\`) e alinhe a Home a ele; se a divergência for da carta, registre em \`knownGaps\`.
3. **Achado (10): a 390, fora da Home, o shell empilha três faixas de localização**, e a terceira é um alvo de 276×17 px com tipo de 10 px. Uma rota só, dentro dos gates do S7 (≥24×24, ≥11 px, ≥4,5:1).
4. Mantenha o que a r08 ganhou: a cartela da ação (o Craft não reclamou dela), o percurso dentro do módulo no selo, e o Brief em PASS.
Capture em \`${DOCS}/captures/A/r10\`, com \`--closing\`.`, { label: 'build:A-r10', phase: 'A · Home r10', schema: BUILD, effort: 'high' })

const critA = a09 ? await julgar('A', 'Home e navegação global', 'A', 'r10', 'north-star-home-panel.png',
  'a r10 contra o North Star (painel Home), contra a baseline r00 em E2 e E0, contra a r08 e contra a r07 a 1440 (a r07 é a régua: ela não tinha emenda), e a 390 contra a r08.',
  { briefSections: 'A1–A4; S1 e S3; o teste anti-LMS do §0', systemSections: 'S2, S4, S5, S6, S7; A5, A6; §6; §7', craftSections: 'composição e identidade de A1 e A2; mídia (M5, M7)', craftRule: 'a estampa precisa ler como UMA folha — nenhuma emenda vertical de campo chapado —, ser igual ou mais forte que o North Star em presença, e manter a ação fechando a coluna. A comparação com a r07 e a r08 é guarda de regressão.' }) : null

phase('C · Módulo r03')
const cMod = await agent(`${CASA}
TAREFA — PEÇA C, MÓDULO, RODADA 2. Brief da peça: ${DOCS}/briefs/piece-C-modulo.md. Seus arquivos: a página de módulo e o que ela usa. Não toque shell/, busca/, home/, comum/ nem trilhas/ — leia e use (o trecho da carta é o componente da Peça B; não faça um segundo).
1. **Achado (3): o vocabulário interno vaza para o learner.** Fora "§ 00", "§ MAP", "§ Caso", "§ Lab", "§ Drill", "§ Quiz", "§ Final", "§ Lex", "§ Ref", a palavra "EXTRAÇÃO" e a marca morta "GRIDALPHA". Cada seção da rota do módulo ganha o nome que o learner entende, na voz da casa. O auditor desta rodada tem regra para isso — rode e zere.
2. **Achado (1): a 390 o mission control não existe.** O 1º viewport termina no meio da tese, sem capacidades e sem próximo passo, porque a carta come ~245 px dos ~690 úteis. Gate C1: as quatro respostas no 1º viewport **a 1440 E a 390**, em E1 e E2. A 390 a carta encolhe, recua ou vira faixa — ela não pode custar o próximo passo.
3. **Achado (4): o Laboratório é um formulário.** Seis sliders de trilho terracota com botão circular e cinco campos retangulares, dentro de um documento gravado. As duas regras de sistema valem aqui: **o controle de instrumento é objeto do atlas** — régua graduada com cursor, escala com índice, vernier, dial gravado —, com rótulo, unidade e valor legíveis, teclado operável e alvo ≥24×24 (≥44×44 a 390). Terracota é pontuação rara, não cor de trilho repetido seis vezes.
4. Mantenha o que a r01 ganhou e continue cumprindo o teste do §0 (mínimo 3 marcadores no 1º viewport, e hoje a página de produção tem zero).
Capture em \`${DOCS}/captures/C/r05\` com \`${DOCS}/captures/C/plans/piece-C-modulo.json\`, com \`--closing\`.`, { label: 'build:C-modulo-r03', phase: 'C · Módulo r03', schema: BUILD, effort: 'high' })

const critC1 = cMod ? await julgar('C', 'Módulo como mission control', 'C', 'r05', 'north-star-trilhas-panel.png',
  'o módulo r03 contra a rodada r01, contra o módulo em produção (captures/B/r02/modulo-E2-1440.png), contra o North Star, e módulos diferentes entre si em cinza com títulos cobertos.',
  { briefSections: 'C1, C2; S1 e S3; o teste anti-LMS do §0', systemSections: 'S2, S4, S5, S6, S7; §6; §7', craftSections: 'composição e identidade; mídia (M7)', craftRule: 'o módulo precisa ler como mission control, cumprir o C1 a 1440 E a 390, e nenhum controle pode ser formulário genérico — foi a lacuna do Craft na r01.' }) : null

phase('C · Aula r04')
const cAula = await agent(`${CASA}
TAREFA — PEÇA C, AULA, RODADA 3. Sistema: ${DOCS}/estudos/aulas/SISTEMA.md (leia §2.6, as lições de correção — a L2 é exatamente o que foi quebrado). Seus arquivos: a aula e o que ela usa.
1. **Achado (8): o véu foi rompido.** Na M01·A08 o Ato "META" entrega a resposta no próprio enunciado — nomeia "Hidrelétrica (BR · média)" em negrito e oferece essa string como alternativa. A L2 do sistema já dizia: **tudo que permite ler ou calcular a referência fica velado, inclusive o enunciado, a linha de fonte e os controles**. Varra os quatro arquétipos construídos atrás do mesmo defeito, não só esta aula, e escreva o verificador que procura a resposta nos nós de texto com retângulo > 0 antes do registro (o \`innerText\` do Chrome inclui \`<text>\` de SVG oculto — meça por retângulo).
2. **Achado (7): o foco falta no controle mais importante.** O campo de previsão — o primeiro ato e a porta do loop — recebe foco sem indicador visível, a 1440 e a 390, enquanto todo o resto tem a marca de canto da casa. Corrija ali e varra a peça inteira: **todo** controle focável tem foco visível ≥3:1, nunca sob o cabeçalho.
3. **Achado (9): a dobra de entrada não tem matéria.** É só tipo e fio de 1 px, e a coluna de leitura morre ~280 px antes do trilho, deixando o quadrante inferior esquerdo morto. A aula perdeu 3–0 no cego para a página de Módulo de onde ela é aberta. **A mídia das 141 aulas está pronta**: \`${DOCS}/media-lab/aulas/_publicar/manifesto.json\` (107 imagens, 108 colocações, 422 arquivos) e \`proveniencia.md\`. Publique em \`public/alexandria/v2/aulas/\` e cole a proveniência em ${DOCS}/media-provenance.md. **A imagem entra junto do parágrafo que ela explica (C4), nunca como vitrine no topo (C3)** — e a dobra de entrada resolve a falta de matéria por composição, não empurrando uma foto para o topo.
4. Continue cumprindo a Regra-mãe do §4 e os gates C3, C5, C7, C9, C10.
Capture em \`${DOCS}/captures/C/r06\` com \`${DOCS}/captures/C/plans/piece-C-aula.json\`, com \`--closing\` e os filmstrips do loop.`, { label: 'build:C-aula-r04', phase: 'C · Aula r04', schema: BUILD, effort: 'high' })

const critC2 = cAula ? await julgar('C', 'Aula e loop de aprendizagem', 'C', 'r06', 'north-star-aula-panel.png',
  'a aula r05 contra a rodada r02, contra o North Star (painel Aula), contra a página de Módulo da mesma rodada (foi ali que a aula perdeu 3–0), e arquétipos diferentes entre si.',
  { briefSections: 'C3, C7, C8, C9, C10 e a REGRA-MÃE do §4; S1 e S3; o teste anti-LMS do §0 com a exceção da aula', systemSections: 'S2, S4, S5, S6, S7; §6; §7', craftSections: 'composição e identidade de C4, C5 e C6; mídia (M7)', craftRule: 'a aula precisa ter matéria na dobra de entrada e não pode chegar mais fraca que a página de Módulo de onde é aberta — foi a lacuna do Craft na r02. E o véu não pode entregar a resposta em lugar nenhum antes do registro.' }) : null

return { b04, critB, a09, critA, cMod, critC1, cAula, critC2 }
