export const meta = {
  name: 'alexandria-v2-plataforma-preparo',
  description: 'Prepare what every remaining piece depends on: module identity, capture plans for module/lesson/glossary/library, the Piece D composition study, and the lesson media ready to publish',
  phases: [{ title: 'Preparar', detail: 'quatro frentes de dependência, todas fora de src/' }],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`

const CASA = `
CONTEXTO: Alexandria v2 (/alexandria), currículo de energia da NIVAR, "atlas vivo do conhecimento em energia": gravura a buril, cartografia histórica. Pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara). Cinzel (identidade) + Lora (conteúdo). Tokens: ${WT}/src/design/alexandria-tokens.ts.
CONTRATO: ${DOCS}/bar.md (leia as seções que a sua tarefa cita). Decisões do Founder em ${DOCS}/decisoes/. Vale em especial P25 (jogos fora desta wave: só a linha "experiência jogável em desenho", sem controle e sem destino), P18 ("Concluído", nunca "Aprovado"), P5 (o quiz é resultado de avaliação, não Demonstrado), P14 (critério oral ou cronometrado é "atividade recomendada"), P8 (divergência de título e contagem é reconciliação separada; "título a confirmar" não é experiência normal).
FONTE: a extração dos 17 módulos está em ${DOCS}/extraction/mNN/ (modulo.json, aparato.json, aula-NN.json e os .md que explicam). Toda string de conteúdo foi conferida como substring exata do HTML de origem. **Nada de conteúdo factual novo** — o que não estiver na fonte se declara ausente (S4), nunca se preenche por plausibilidade.
MARCAS E MÍDIA JÁ APROVADAS: jogo de marcas do chrome em ${DOCS}/media-lab/marcas-do-chrome/final/ (DECISAO.md explica) · medalhas de módulo e território, série r04, em ${DOCS}/media-lab/movimento-e-conquistas/medalhas/ (DECISOES.md e CORRECOES.md) · sistema de movimento e de conquistas em ${DOCS}/estudos/movimento-e-conquistas/ · sistema de arquétipos de aula em ${DOCS}/estudos/aulas/SISTEMA.md.
POSSE: **não toque src/, public/, index.html, app/ nem git.** Só escreva onde a sua tarefa mandar.`

phase('Preparar')
const S_ID = { type: 'object', properties: { summary: { type: 'string' }, arquivo: { type: 'string' }, modulos: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, frase: { type: 'string' }, origem: { type: 'string' }, marca: { type: 'string' } }, required: ['id', 'frase', 'origem', 'marca'] } }, pendencias: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'arquivo', 'modulos'] }
const S_PLANO = { type: 'object', properties: { summary: { type: 'string' }, planos: { type: 'array', items: { type: 'string' } }, shots: { type: 'string' }, pendencias: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'planos', 'shots'] }
const S_D = { type: 'object', properties: { summary: { type: 'string' }, arquivos: { type: 'array', items: { type: 'string' } }, sustentado: { type: 'string' }, naoSustentado: { type: 'string' }, pendencias: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'arquivos', 'sustentado', 'naoSustentado'] }
const S_MIDIA = { type: 'object', properties: { summary: { type: 'string' }, prontos: { type: 'array', items: { type: 'string' } }, catalogo: { type: 'string' }, creditos: { type: 'string' }, pendencias: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'prontos', 'catalogo'] }

const [identidade, planos, pecaD, midia] = await parallel([
  () => agent(`${CASA}
TAREFA — IDENTIDADE DOS 17 MÓDULOS. Escreva em ${DOCS}/extraction/identidade-modulos.json e .md.
Hoje, com os títulos cobertos, os módulos são o mesmo anel: é a lacuna B4 da Peça B e o que o Sumário e a carta precisam para se distinguirem. Produza, **para cada um dos 17 módulos**:
1. **Frase de identidade, até 12 palavras**, derivada FIELMENTE da fonte — do campo de tese (§00), do lede ou do "Resultado esperado" de \`extraction/mNN/modulo.json\`. Cite a origem por campo e trecho. Ela é camada Alexandria e precisa ser marcada como tal. Não invente fato; se um módulo não tiver tese extraída, diga "não declarado" e registre qual campo falta.
2. **Marca gravada do módulo.** Não desenhe nada: a série já existe. As medalhas de conclusão de módulo (\`${DOCS}/media-lab/movimento-e-conquistas/medalhas/\`, catálogo e \`_indice.json\`) têm uma arte por módulo, e a decisão F-MD3 diz que a estação do globo e a medalha são o mesmo objeto. **Mapeie** cada módulo ao slug da sua medalha e ao arquivo em cada faixa (96/192/384), e diga em que tamanho ela serve de marca de identidade (24 px numa linha de sumário é o caso apertado — confira na folha de silhuetas a 24 px se o módulo ainda se distingue; onde não se distinguir, diga qual par colide).
3. **Objetos reais do módulo**, da fonte: quantos instrumentos, se tem laboratório, caso, quiz, checklist e quantos exercícios — os números do \`aparato.json\`, para o Sumário parar de imprimir a mesma linha de metadado para todos.
Entregue o JSON com \`id\`, \`frase\`, \`origem\`, \`marcaSlug\`, \`marcaArquivos\`, \`objetos\` e \`divergencias\`, e o .md legível com a tabela dos 17.`, { label: 'identidade', phase: 'Preparar', schema: S_ID, effort: 'high' }),

  () => agent(`${CASA}
TAREFA — PLANOS DE CAPTURA DAS PEÇAS QUE FALTAM. Escreva em ${DOCS}/captures/C/plans/ e ${DOCS}/captures/D/plans/ (crie as pastas).
O harness é \`${WT}/tools/alexandria-capture/capture.mjs\`. **Leia o código dele e os planos existentes** (\`${DOCS}/captures/A/plans/piece-A.json\`, \`${DOCS}/captures/B/plans/piece-B.json\`, \`${DOCS}/captures/D/plans/piece-D-perfil.json\`) para usar exatamente os campos que ele entende: route, state, viewport, grayscale, fullPage, frameActions (click/press/scroll/wait/back), video, closing. Não invente campo.
Produza três planos:
1. \`C/plans/piece-C-modulo.json\` — a página de módulo. Cobrir M01, M02, M08, M12, M14 e M16 (o brief ${DOCS}/briefs/piece-C-modulo.md exige provar que a composição não é um molde que só serve ao M01), em E1 e E2, a 1440 e 390, mais cinza com títulos cobertos, mais o fechamento (1280/1920/3440) e um filmstrip de entrada nó → módulo.
2. \`C/plans/piece-C-aula.json\` — a aula. Cobrir M01·A08 (arquétipo PRANCHA, com INST·06), M02·A04 (curva líquida, que precisa ser desenhada), uma aula de M13 (sem instrumento nem exercício portado) e uma quarta de arquétipo diferente, escolhida em ${DOCS}/estudos/aulas/SISTEMA.md §4. Precisa capturar o LOOP: estado inicial → previsão registrada → previsto × calculado → exploração → checagem → próximo passo, com filmstrip, mais a página inteira, mais 390, mais teclado.
3. \`D/plans/piece-D-consulta.json\` — Glossário e Biblioteca: entrada, recorte por contexto, verbete, ficha de fonte, e a ida-e-volta aula → termo → aula e aula → fonte → aula em filmstrip.
**Verifique de verdade:** rode cada plano contra o produto atual (dev server na 5311 se estiver de pé; se não estiver, suba um em porta livre e use \`--base\`) para garantir que toda rota existe e nenhum shot quebra — a saída vai para uma pasta descartável (\`${DOCS}/captures/_smoke/\`), não para as pastas de rodada. Se uma rota ainda não existe no produto, deixe o shot no plano e registre em \`pendencias\`, porque ele é a prova de que a peça precisa criá-la.`, { label: 'planos', phase: 'Preparar', schema: S_PLANO, effort: 'high' }),

  () => agent(`${CASA}
TAREFA — PEÇA D: O QUE A FONTE E O BACKEND SUSTENTAM. Escreva em ${DOCS}/estudos/peca-D/ (crie).
A Peça D é Progresso, Glossário e Biblioteca (bar §5, D1–D6), e é a peça onde é mais fácil mentir: percentual sem escopo, conquista que alega competência, verbete sem âncora, biblioteca como parede de cards. Antes de desenhar qualquer coisa, estabeleça **o que existe**:
1. **Progresso.** Leia o contrato de backend (\`${WT}/docs/v2-backend-contract.md\`) e o router real em \`${WT}/app/\` (SOMENTE LEITURA — \`app/\` é do CURSOR, você não edita nada lá). Diga, por eixo do S3 (Percorrido, Praticado, Demonstrado), o que o servidor hoje registra de verdade, o que aceita mas nunca recebe, e o que não existe. Some os achados já registrados em ${DOCS}/estudos/movimento-e-conquistas/ (a sequência de dias está errada por relógio UTC e porque qualquer evento conta como estudo).
2. **Glossário.** Meça a cobertura real: quantos verbetes existem no código contra os 2.124 termos da fonte, quantos têm âncora curricular, quantos têm fonte, quantos repetem. O §6 do bar diz que entrada alfabética é FAIL automático ("Consulta morta") — proponha a entrada por contexto (território → módulo → aula, e por categoria do próprio léxico) com o dado que sustenta cada recorte.
3. **Biblioteca.** Hoje são 8 referências hardcoded do M01. Levante, da fonte dos 17 módulos (\`extraction/mNN/aparato.json\`, seção de referências), quantas fontes existem de verdade, com instituição, tipo e onde são usadas — e diga o que falta para cada ficha cumprir o D5 (o que responde, o que NÃO responde, recorte, última verificação, onde é usada, citação).
4. **A composição.** Para cada uma das três superfícies, uma proposta de composição na linguagem do atlas, com o teste do §0 aplicado (Glossário e Biblioteca têm exceção: fonte e âncora visíveis em cada item) e a lista de tiques da varredura que são da peça D (T20, T21, T24, T8).
Entregue \`${DOCS}/estudos/peca-D/o-que-existe.md\` (a medição) e \`composicao.md\` (a proposta). Números medidos, não estimados; cada um com o arquivo e a linha.`, { label: 'peca-D', phase: 'Preparar', schema: S_D, effort: 'high' }),

  () => agent(`${CASA}
TAREFA — A MÍDIA DAS AULAS, PRONTA PARA PUBLICAR. Trabalhe em ${DOCS}/media-lab/aulas/.
Existe curadoria por módulo em ${DOCS}/media-lab/aulas/mNN/ e o guia ${DOCS}/media-lab/aulas/ESTILO.md, mas **nada disso está publicado**: \`public/alexandria/v2/\` só tem home, trilhas e comum. As aulas que a Peça C vai construir primeiro são **M01·A08, M02·A04 e uma de M13**.
1. Para essas aulas (e o resto do M01 e do M02, se o material já estiver curado), feche a seleção: qual imagem entra, **em que parágrafo** ela entra (C4: junto do que ela explica, nunca vitrine no topo), qual é o **trabalho nomeado** dela em uma frase, e a **classe** (documental / explicação / atmosfera, §7 M4).
2. Aplique o **teste de remoção** (M7) a cada uma e descarte o que não passar — registre o que caiu e por quê. Qualidade acima de quantidade: 0 a 2 por aula.
3. Prepare os arquivos derivados para publicação (WebP, srcset 1×/2×, nomes estáveis no padrão das rodadas anteriores) em ${DOCS}/media-lab/aulas/_publicar/, com um \`manifesto.json\` dizendo exatamente qual arquivo vai para qual caminho em \`public/alexandria/v2/aulas/\`. **Não copie nada para public/** — quem publica é o builder da peça.
4. Escreva as linhas de proveniência prontas (todas as colunas do §7 M6: asset_id, tipo, classe, aviso_visivel, origem/autor/URL/licença/data, geração, uso, purpose, revisão factual "pendente (orquestrador)") em \`_publicar/proveniencia.md\`, para o builder colar em ${DOCS}/media-provenance.md.
5. Onde faltar imagem boa e a aula ganhar com ela, **produza**: Higgsfield para atmosfera e explicação (saldo ~963 créditos, não economize em qualidade, mas justifique o modelo pelo catálogo antes de gerar), Blender para anatomia e corte técnico, fonte real com licença verificada sempre que a realidade física importar. Nada de texto dentro de imagem gerada; nada de imagem gerada nomeando instalação real.`, { label: 'midia-aulas', phase: 'Preparar', schema: S_MIDIA, effort: 'high' }),
])

return { identidade, planos, pecaD, midia }
