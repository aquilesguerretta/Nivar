export const meta = {
  name: 'alexandria-v2-plataforma-construir',
  description: 'Build the remaining platform piece by piece, each one judged before the next starts: Trails r03, Home r08, Module recomposition, Lesson loop',
  phases: [
    { title: 'B · Trilhas r03', detail: 'a carta ocupa a folha; identidade de módulo; prova de movimento' },
    { title: 'A · Home r08', detail: 'ação com massa, contraste, vocabulário de estado, celular' },
    { title: 'C · Módulo', detail: 'recomposição: mission control, não grade curricular' },
    { title: 'C · Aula', detail: 'o loop de aprendizagem em quatro arquétipos' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const ORQ = `${DOCS}/orquestracao`

const CASA = `Você é o BUILDER (agente LYCEUM) da Alexandria v2. Diretório ${WT}.
**NÃO faça commit nem git add. NÃO toque index.html, src/main.tsx, app/ (é do CURSOR), nem .claude/launch.json.**
CONTEXTO: "atlas vivo do conhecimento em energia" — gravura a buril, cartografia histórica. Pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara, ≈1 por viewport). Cinzel (identidade) + Lora (conteúdo). Tokens em src/design/alexandria-tokens.ts. Estilo inline com token — **sem Tailwind em layout** (regra P0 do auditor).
CONTRATO: ${DOCS}/bar.md. Decisões do Founder em ${DOCS}/decisoes/ — em especial P25 (jogos fora desta wave: a experiência jogável é uma linha de metadado "em desenho", sem controle e sem destino), P18 ("Concluído", nunca "Aprovado" nem "Dominado"), P5, P13 (sem trava sequencial), P14, P8.
VARREDURA ANTI-IA: ${DOCS}/briefs/varredura-anti-ia.md — 38 tiques com coordenada, causa e gate. **As duas regras de sistema valem em tudo que você escrever: nenhuma caixa default (retângulo com fio não é campo, botão, rótulo nem chip) e nenhum círculo de formulário (disco com inicial, anel com pictograma, série vazio/meio/cheio).** O erro da r07 foi corrigir por superfície e não por sistema — não repita.
SISTEMA JÁ APROVADO, use, não reinvente: marcas do chrome em \`src/components/alexandria/comum/Marcas.tsx\` (decisão em ${DOCS}/media-lab/marcas-do-chrome/DECISAO.md) · retomada em \`comum/Retomada.tsx\` (${DOCS}/media-lab/retomada/DECISAO.md) · movimento e conquistas em ${DOCS}/estudos/movimento-e-conquistas/ · medalhas r04 em ${DOCS}/media-lab/movimento-e-conquistas/medalhas/ · arquétipos de aula em ${DOCS}/estudos/aulas/SISTEMA.md · identidade dos 17 módulos em ${DOCS}/extraction/identidade-modulos.json (se já existir; se não, use a fonte).
FONTE: ${DOCS}/extraction/mNN/. **Nada de conteúdo factual novo.** O que a fonte não diz se declara ausente (S4: "em desenho", "ainda não disponível", "não declarado"), nunca se preenche por plausibilidade. Erros conhecidos em ${DOCS}/content-qa.md.
PORTÕES, toda vez: \`npx tsc -b\` (NUNCA --noEmit) com 0 erros e \`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src\` com 0 P0.
CAPTURA: \`node tools/alexandria-capture/capture.mjs --plan <plano> --out <pasta>\`. Dev server na 5311; se estiver fora, suba em segundo plano. **OLHE os PNGs com Read, na escala real, e corrija o que vir** — verificação é por render, não por leitura de código. Confira na legend.json: horizontalOverflow false, minFontPxShell ≥ 11, smallTargets vazio, truncatedText do shell vazio, toda mídia com classe declarada.`

const BUILD = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, tsc: { type: 'string' }, detect: { type: 'string' }, captures: { type: 'string' }, checks: { type: 'string' }, knownGaps: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'tsc', 'detect', 'captures', 'checks', 'knownGaps'] }
const PAIRS = { type: 'object', properties: { pairCount: { type: 'number' }, mapping: { type: 'object' }, renders: { type: 'string' } }, required: ['pairCount', 'mapping', 'renders'] }

async function julgar(piece, pieceName, capDir, round, nsPanel, pairsHint, secoes) {
  const prep = await agent(`Você prepara o julgamento cego da Peça ${piece} (${pieceName}), rodada ${round}. Diretório ${WT}. Não edite src/ nem faça git.
1. Escreva ${ORQ}/pairs-${capDir}-${round}.json no formato de ${ORQ}/pairs-B.json: uma lista de pares [{file,name},{file,name}], caminhos relativos a docs/alexandria-v2/. Monte entre 5 e 8 pares: ${pairsHint}
2. Rode \`node docs/alexandria-v2/orquestracao/build-blind-gen.mjs ${capDir} ${round} docs/alexandria-v2/orquestracao/pairs-${capDir}-${round}.json\` e devolva o \`mapping\` e o \`pairCount\` que ele imprime, exatamente como saíram.
3. Devolva em \`renders\` uma lista curta dos PNGs mais importantes da rodada em ${DOCS}/captures/${capDir}/${round}/ (nome e o que cada um prova), para os critics saberem onde olhar.
Todo arquivo citado precisa existir — se faltar, escolha outro e diga qual.`, { label: `pares:${piece}${round}`, phase: `${piece} · ${pieceName}`, schema: PAIRS, effort: 'medium' })
  if (!prep) return null
  return await workflow({ scriptPath: `${ORQ}/critics-piece.js` }, { piece, pieceName, round, capDir, mapping: prep.mapping, pairCount: prep.pairCount, renders: prep.renders, nsPanel, ...secoes })
}

// ─────────────────────────────────────────────────────────── B · Trilhas r03
phase('B · Trilhas r03')
const bBrief = agent(`Você escreve os BRIEFINGS DE CRITIC da Peça C da Alexandria v2 (módulo e aula), em ${DOCS}/critics/piece-C-critic-briefs.md. Diretório ${WT}. Só escreve esse arquivo; não toque src/ nem git.
Siga a forma de ${DOCS}/critics/piece-A-critic-briefs.md e ${DOCS}/critics/piece-B-critic-briefs.md (leia os dois). O conteúdo vem de ${DOCS}/bar.md §4 (C1–C10 e a Regra-mãe), do brief ${DOCS}/briefs/piece-C-modulo.md, de ${DOCS}/estudos/aulas/SISTEMA.md e dos tiques da peça C na varredura (${DOCS}/briefs/varredura-anti-ia.md: T32, T4, T11, T23, T22, T26).
Três seções — Brief, System, Craft — dizendo o que cada critic julga na página de MÓDULO e na página de AULA, com os gates nomeados e o que reprova sozinho. Inclua a checagem do teste do §0 (mínimo 3 marcadores, e o módulo hoje tem ZERO) e a Regra-mãe da aula (os seis itens que reprovam).`, { label: 'critic-briefs:C', phase: 'B · Trilhas r03', schema: { type: 'object', properties: { summary: { type: 'string' }, arquivo: { type: 'string' } }, required: ['summary', 'arquivo'] }, effort: 'medium' })

const b03 = await agent(`${CASA}
TAREFA — PEÇA B, RODADA 3. Brief: ${DOCS}/briefs/piece-B-r03.md (leia inteiro). Rodada anterior e vereditos: ${DOCS}/loop/piece-B.md.
Seus arquivos: \`src/components/alexandria/trilhas/\` e o que a Peça B precisar em \`src/pages/alexandria/AlexandriaRouter.tsx\`. **Não toque** \`shell/\`, \`busca/\`, \`home/\` nem \`comum/Retomada.tsx\` (acabaram de ser fechados na r07) — leia-os e use.
1. **A carta ocupa a folha (T35, e é o que resolve a regressão de 3440).** Hoje o mapa é um painel lateral fixo de ~378 px colado a um canvas — layout do Mapbox Studio. A carta passa a ser a página: território na folha inteira, aparato como marginália gravada (título em cartela no canto, legenda no pé). A 3440 nada pode piorar em relação a 1440 (S7) — hoje piora: texto abaixo do mínimo legível e faixa vazia.
2. **Hierarquia de presença na tela de Trilhas (lacuna do Craft na r02).** O "trecho da carta · você está aqui" ganha peso sobre a prancha de atmosfera; a prancha vira fundo do território, não o maior objeto da dobra.
3. **Identidade de módulo (lacuna do Brief, B4).** Use ${DOCS}/extraction/identidade-modulos.json: frase de até 12 palavras por módulo e a marca gravada (a medalha do módulo, F-MD3). No Sumário, a linha de metadado passa a trazer os objetos reais do módulo, não o mesmo texto para todos. Teste em cinza com títulos cobertos: os módulos se distinguem.
4. **Prova de movimento (lacuna do System, S6).** O harness grava vídeo (\`"video": {}\` no plano, já ativo em mapa-E2-1440-no-modulo, -voltar e -reduced). A continuidade nó → módulo precisa aparecer EM QUADRO: elemento compartilhado visível em trânsito, título legível, carta ainda em tela em pelo menos um quadro. A versão com movimento reduzido: observavelmente diferente no trajeto, igual no estado final. Coreografia segundo ${DOCS}/estudos/movimento-e-conquistas/sistema-de-movimento.md, sem bounce e sem overshoot.
5. **Os tiques da peça B que a r07 declarou e não corrigiu** (varredura): T33 segmented control MAPA/SUMÁRIO, T34 rótulos em tooltip branco flutuante (vira cartela gravada, variando por hierarquia), T37 medalhão circular navy com anel dourado (vira vinheta ou carimbo do território, em fio), T36 acordeão +/−, T38 linha de marcos repetida idêntica, T5/T31 barra móvel e 768, T6/T26 localizador e volta duplicada, T16 territórios de molde idêntico.
Capture em \`${DOCS}/captures/B/r03\` com o plano da peça e \`--closing\`.`, { label: 'build:B-r03', phase: 'B · Trilhas r03', schema: BUILD, effort: 'high' })

const critB = b03 ? await julgar('B', 'Trilhas e carta', 'B', 'r03', 'north-star-trilhas-panel.png',
  'a r03 contra o North Star (painel Trilhas), contra a baseline r00, contra a r02 (guarda de regressão, desktop E mobile), e o mapa contra o Atlas atual.',
  { briefSections: 'B1, B2, B4 e os gates de estado de B3; S1 e S3; o teste anti-LMS do §0', systemSections: 'S2, S4, S5, S6, S7; B6; §6; §7', craftSections: 'composição e identidade de B1, B3 e B5; mídia (M5, M7); heurísticas quebradas', craftRule: 'o render precisa ser igual ou mais forte que o North Star em presença e identidade, claramente mais forte que a baseline r00, e não pode parecer template ou UI colada. A comparação com a r02 é GUARDA DE REGRESSÃO: reprova só se a maioria dos juízes preferir a rodada anterior, e isso vale separadamente para desktop e para 390.' }) : null

// ─────────────────────────────────────────────────────────── A · Home r08
phase('A · Home r08')
const a08 = await agent(`${CASA}
TAREFA — PEÇA A, RODADA 8. Loop e vereditos da r07: ${DOCS}/loop/piece-A.md. Brief da r07: ${DOCS}/briefs/piece-A-r07.md.
Seus arquivos: \`src/components/alexandria/home/\`, \`comum/Retomada.tsx\`, \`comum/Marcas.tsx\`, \`shell/NavMovel.tsx\` e \`src/pages/alexandria/AlexandriaHome.tsx\`. **Não toque** \`trilhas/\` (acabou de ser fechado na rodada B r03) — leia e use.
Quatro correções, todas com lacuna já medida:
1. **A AÇÃO PRECISA TER MASSA** (Craft FAIL, e veto explícito do Founder). Citando o critic: *"ao remover a mobília da r06 (card creme + barra navy), a r07 removeu junto o único objeto terminal da coluna e não pôs nada no lugar — CONTINUAR virou o traço mais leve da tela, mais leve que a nota em itálico acima dele."* E o Founder, olhando a mesma linha: *"a mãozinha ainda está aqui, não usa ela, usa outra coisa vai, muito melhor."* **A manícula está VETADA em qualquer forma** — mão, dedo, punho, luva, silhueta. As opções, com densidade de tinta medida, estão em ${DOCS}/media-lab/manicula/sem-mao/ (contato.png, medidas.json, acao.svg, recomendacao). Implemente a vencedora. Gate: a densidade de tinta da linha da ação fica **acima** da nota em itálico e da linha de metadado do mesmo bloco. Proibido: barra cheia (navy ou creme), caixa com fio, sombra, raio. A peça é compartilhada — a carta e o hub não podem quebrar.
2. **Contraste do rótulo de procedência** (System FAIL): "registro de estudo" rende 3,74:1 a 1440, 3,89:1 a 1920, ~4,1:1 a 3440, porque assenta no trecho mais escuro da prancha de atmosfera que sangra por baixo da coluna. O mesmo string em creme chapado dá 4,70:1. Resolva na composição (a coluna de trabalho ganha seu próprio campo, ou a prancha recua ali), não pintando o texto de preto.
3. **Vocabulário de estado reconciliado** (lacuna do Brief): o selo do globo chama M02 de "✕ a seguir" e a faixa de rota, ~900 px abaixo na mesma Home, chama o mesmo módulo de "a percorrer" — a mesma palavra que usa para todos os outros. Os dois dispositivos precisam dizer a mesma coisa, nos dois estados com sessão (E2: M02; E2b: M07).
4. **A regressão do celular** (guarda de regressão: 2 de 3 juízes preferiram a r06 a 390). Duas causas nomeadas pelos juízes: (a) o terço inferior virou três linhas de legenda mais "Sobre esta figura", repetindo o que a legenda do desktop já dizia, numa largura em que isso é ruído — e, para caber, a base da gravura passou a ser cortada; (b) os glifos tipográficos da barra inferior (‡ Biblioteca, ¶ Mais) *"são afirmação de identidade que não funciona como orientação"* na navegação mais usada da tela. Resolva as duas sem perder a declaração de classe do §7 (ela não é opcional — mas pode ser dita em menos espaço) e sem voltar a ícone de biblioteca.
Capture em \`${DOCS}/captures/A/r08\` com o plano da peça e \`--closing\`.`, { label: 'build:A-r08', phase: 'A · Home r08', schema: BUILD, effort: 'high' })

const critA = a08 ? await julgar('A', 'Home e navegação global', 'A', 'r08', 'north-star-home-panel.png',
  'a r08 contra o North Star (painel Home), contra a baseline r00 em E2 e E0, contra a r07 a 1440 e a 390 (guarda de regressão), e a busca contra a r07.',
  { briefSections: 'A1–A4; S1 e S3; o teste anti-LMS do §0', systemSections: 'S2, S4, S5, S6, S7; A5, A6; §6; §7', craftSections: 'composição e identidade de A1 e A2; mídia (M5, M7); heurísticas quebradas', craftRule: 'o render precisa ser igual ou mais forte que o North Star em presença e identidade, claramente mais forte que a baseline r00, e a ação principal precisa fechar a coluna — foi a lacuna da r07. A comparação com a r07 é GUARDA DE REGRESSÃO, medida separadamente a 1440 e a 390.' }) : null

// ─────────────────────────────────────────────────────────── C · Módulo
phase('C · Módulo')
const cMod = await agent(`${CASA}
TAREFA — PEÇA C, MÓDULO: RECOMPOSIÇÃO. Brief: ${DOCS}/briefs/piece-C-modulo.md (leia inteiro — ele tem o inventário do que a fonte já tem e a página não mostra).
**Esta peça não é polimento.** A página de módulo de hoje tem ZERO dos seis marcadores do §0 no 1º viewport, quando o mínimo é três: é FAIL automático do hard gate "LMS/SaaS genérico". Ela é o "course content" de Udemy — nove linhas numeradas com estado à direita — e mostra ~15% do material extraído.
Seus arquivos: a página de módulo e o que ela usa (\`src/components/alexandria/navigation/\`, um novo diretório \`src/components/alexandria/modulo/\` se ajudar, e a rota em \`AlexandriaRouter.tsx\`). **Não toque** \`shell/\`, \`busca/\`, \`home/\`, \`comum/\` nem \`trilhas/\` — leia e use. Em particular: o trecho da carta do módulo é o mesmo objeto da Peça B; reaproveite o componente, não faça um segundo.
Cumpra o brief inteiro: o 1º viewport com pelo menos três marcadores do §0 (o trecho da carta com as nove estações e a posição; a tese literal do §00; as 7 capacidades; a ação nomeada; a procedência de um item de consulta), a organização por tipo de objeto com os 10 aparatos do roteiro na ordem da jornada, o estado por palavra e marca da casa (fora a coluna terracota e a faixa de acento), a identidade do módulo vinda de \`identidade-modulos.json\`, e a volta única.
Verifique nos módulos **M01, M02, M08, M12, M14 e M16** — se a composição só servir ao M01, ela está errada.
Capture em \`${DOCS}/captures/C/r01\` com \`${DOCS}/captures/C/plans/piece-C-modulo.json\`, com \`--closing\`.`, { label: 'build:C-modulo', phase: 'C · Módulo', schema: BUILD, effort: 'high' })

const critC1 = cMod ? await julgar('C', 'Módulo como mission control', 'C', 'r01', 'north-star-trilhas-panel.png',
  `o módulo r01 contra o módulo atual (${DOCS}/captures/B/r02/modulo-E2-1440.png), contra o North Star, e módulos diferentes entre si em cinza com os títulos cobertos (M01 × M08, M02 × M14), para provar que a composição não é um molde.`,
  { briefSections: 'C1, C2; S1 e S3; o teste anti-LMS do §0 (o módulo precisa de pelo menos 3 marcadores no 1º viewport)', systemSections: 'S2, S4, S5, S6, S7; §6; §7', craftSections: 'composição e identidade; mídia (M7); heurísticas quebradas', craftRule: 'o módulo precisa ler como mission control de uma expedição, não como sumário de curso; precisa ser claramente mais forte que a página atual; e nenhum elemento pode passar no teste do recorte-e-cola (colável em qualquer SaaS sem ninguém notar).' }) : null

// ─────────────────────────────────────────────────────────── C · Aula
phase('C · Aula')
const cAula = await agent(`${CASA}
TAREFA — PEÇA C, AULA: O LOOP DE APRENDIZAGEM. Leia ${DOCS}/estudos/aulas/SISTEMA.md inteiro (1.216 linhas: o tronco comum, os 10 arquétipos e a distribuição nas 141 aulas) e ${DOCS}/estudos/aulas/prototipos/CORRECOES.md (as lições de correção já pagas). Os protótipos HTML em \`${DOCS}/estudos/aulas/prototipos/\` são a especificação visual — **porte-os para React**, não os reinvente.
**A Regra-mãe do bar §4 reprova a aula sozinha:** instrumento como apêndice depois de toda a prosa; referência antes da tentativa onde a tarefa exige tentativa; aula sem ato do learner; conclusão como única ação ou apresentada como competência; vídeo, aba ou card no lugar do primeiro ato; exercícios escondidos em aba.
Construa o tronco comum mais **quatro arquétipos**, provados nestas aulas: **M01·A08** (PRANCHA, com o INST·06 e a previsão "100 MW solar ≠ 100 MW térmica" → previsto × calculado), **M02·A04** (a curva líquida, que o nome promete e hoje ninguém desenha — C5 exige que o instrumento desenhe a forma prometida), **uma aula de M13** (MESA, sem instrumento nem exercício portado: o ato tem de ser autêntico mesmo assim) e **M12·A01** (LUPA) ou **M04·A07** (DOSSIÊ), que já têm protótipo capturado.
Cumpra: C3 (orientar antes de ler — fora o cartão de vídeo que hoje abre 141 de 141 aulas), C4 (explicação no fluxo, termo ligado à definição sem sair da aula), C5 (instrumento no ponto da prosa que o invoca, com previsão registrada antes do resultado e previsto × calculado no mesmo cenário), C6, C7 (tentativa antes da referência — fora o "revelar gabarito" direto), C9 (todo ato deixa rastro, e o fim é registro: Percorrido · Praticado · Serve a), C10 (o próximo passo depende do que aconteceu).
**Mídia:** publique o que ${DOCS}/media-lab/aulas/_publicar/manifesto.json indicar, em \`public/alexandria/v2/aulas/\`, e cole as linhas de \`_publicar/proveniencia.md\` em ${DOCS}/media-provenance.md. Imagem entra junto do parágrafo que ela explica, nunca no topo.
Capture em \`${DOCS}/captures/C/r02\` com \`${DOCS}/captures/C/plans/piece-C-aula.json\`, com \`--closing\` e os filmstrips do loop.`, { label: 'build:C-aula', phase: 'C · Aula', schema: BUILD, effort: 'high' })

const critC2 = cAula ? await julgar('C', 'Aula e loop de aprendizagem', 'C', 'r02', 'north-star-aula-panel.png',
  'a aula r02 contra a aula atual em produção (se houver captura; senão contra a baseline), contra o North Star (painel Aula), e arquétipos diferentes entre si (PRANCHA × MESA × LUPA) para provar que o layout acompanha o conteúdo.',
  { briefSections: 'C3, C7, C8, C9, C10 e a REGRA-MÃE do §4; S1 e S3; o teste anti-LMS do §0 com a exceção da aula', systemSections: 'S2, S4, S5, S6, S7; §6; §7', craftSections: 'composição e identidade de C4, C5 e C6; mídia (M7); heurísticas quebradas', craftRule: 'a aula precisa ler como página de atlas que ensina fazendo, não como artigo com calculadora no fim; precisa ser claramente mais forte que a aula atual; e os arquétipos precisam ser visivelmente diferentes entre si sem deixar de ser a mesma casa.' }) : null

return { bBrief: await bBrief, b03, critB, a08, critA, cMod, critC1, cAula, critC2 }
