export const meta = {
  name: 'alexandria-v2-midia-aulas-14',
  description: 'Close the lesson-image curation for the remaining 14 modules and package everything for publication, in batches so the running builder keeps its machine',
  phases: [
    { title: 'Curar', detail: 'catorze módulos, em lotes de três' },
    { title: 'Consolidar', detail: 'um manifesto só para os 17' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/aulas`
const HF = 'mcp__1bd778ac-f4ca-47cf-b235-8be5dc610f70__'
const GPU = `python ${DOCS}/media-lab/_ferramentas/gpu_lock.py -- "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P <script.py> -- <args>`

const COMUM = `
CONTEXTO: Alexandria v2 (/alexandria), currículo de energia da NIVAR, "atlas vivo do conhecimento em energia": gravura a buril, cartografia histórica. Pergaminho #F2E9D6, creme #FBF6EA, navy #0D2340, tinta #2A2620, ouro-sobre-navy #CBAA6E, terracota #A8462A (rara). Cinzel (identidade) + Lora (conteúdo).
LEIA ANTES DE DECIDIR QUALQUER COISA:
· ${LAB}/ESTILO.md — o guia comum (quando pôr imagem, onde, quantas, ordem de preferência das fontes).
· ${DOCS}/bar.md §7 (M1–M7: as três classes epistêmicas, o teste de remoção, o registro de proveniência) e §4 (C4: a imagem entra junto do parágrafo que ela explica; C6: figura com trabalho cognitivo nomeável; C3: nunca vitrine no topo, nunca no lugar do primeiro ato).
· **O PADRÃO JÁ FECHADO:** ${LAB}/_publicar/ (README.md, SELECAO.md, manifesto.json, proveniencia.md, PENDENCIAS.md e os scripts _selecao.py / _construir.py / _proveniencia.py). Os módulos M01, M02 e M13 já passaram por isto. **Siga exatamente a mesma forma de saída e reaproveite os scripts** — o builder da Peça C vai consumir um manifesto só, e formato divergente vira retrabalho.
· A curadoria bruta do seu módulo em ${LAB}/mNN/ e o estudo da aula em ${DOCS}/estudos/aulas/mNN.md + mNN.json.
· A fonte: ${DOCS}/extraction/mNN/ (aula-NN.json, aparato.json). **Nada de conteúdo factual novo.** Se a fonte não sustenta, a imagem não entra.
DECISÕES QUE VALEM: P10 (mídia fotorrealista gerada pode ser Explicação, com aviso contextual visível e proveniência permanente), P25 (jogos fora desta wave), S4 (ausência se declara, nunca se preenche por plausibilidade).
REGRAS DURAS: nenhum texto dentro de imagem gerada · imagem gerada NUNCA nomeia nem representa instalação, evento ou pessoa real específicos · atmosfera nunca cobre dado · classe declarada em toda imagem · licença aceita só: domínio público, CC0, CC BY, CC BY-SA.
POSSE: escreva só dentro de ${LAB}/. **NÃO toque src/, public/, index.html, app/, git, nem a porta 5311** — há um builder construindo a Peça B agora e ele precisa da máquina. Se precisar de navegador, suba Playwright próprio em porta livre.
FERRAMENTAS: Higgsfield via ToolSearch "select:${HF}models_explore,${HF}generate_image,${HF}generate_image_batch,${HF}jobs_wait,${HF}balance" — consulte o catálogo e **justifique o modelo pelo tipo de artefato antes de gerar**. Blender com trava de GPU (obrigatória, há outras frentes na máquina): ${GPU}. Python + PIL. Fontes reais: prefira acervo com licença verificada (Wikimedia Commons, agências públicas, Rijksmuseum, NASA, INPE, Agência Brasil, Embrapa) sempre que a realidade física importar.
CRÉDITOS: o saldo Higgsfield é ~963 e há catorze módulos nesta frente. Qualidade acima de quantidade — **o teste de remoção corta mais imagem do que gera**. Fique perto de 40 créditos por módulo; se uma aula justificar mais, gaste e explique. Registre o gasto.`

const SAIDA = { type: 'object', properties: { summary: { type: 'string' }, modulo: { type: 'string' }, colocacoes: { type: 'number' }, cortadas: { type: 'array', items: { type: 'string' } }, aulasSemImagem: { type: 'array', items: { type: 'string' } }, geradas: { type: 'string' }, creditos: { type: 'string' }, arquivos: { type: 'array', items: { type: 'string' } }, pendencias: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'modulo', 'colocacoes', 'cortadas', 'geradas', 'creditos'] }

const tarefa = (m) => `${COMUM}
TAREFA — FECHAR A MÍDIA DO MÓDULO ${m.toUpperCase()}. Trabalhe em ${LAB}/${m}/ e escreva o pacote em ${LAB}/_publicar/${m}/.
1. **Percorra as aulas do módulo, uma por uma, lendo a aula inteira** (${DOCS}/extraction/${m}/). Para cada aula decida: entra imagem? Onde exatamente (qual bloco de prosa, pelo id da fonte)? Qual o **trabalho nomeado** dela numa frase? Qual a **classe** (documental / explicação / atmosfera)?
2. **Aplique o teste de remoção (M7) com rigor.** Se tirar a imagem não custa entendimento, orientação, memória, atmosfera relevante ou identidade, ela sai. Registre o que caiu e por quê — a lista do que você cortou vale tanto quanto a do que ficou. Tipicamente 0 a 2 por aula; aula sem imagem é resultado legítimo e vai para \`aulas_sem_imagem\` no manifesto, com o motivo, **nunca com placeholder**.
3. **Onde faltar imagem boa e a aula ganhar de verdade com ela, produza.** Ordem de preferência: (a) real e documental com licença verificada, quando a realidade física importa; (b) Blender, para anatomia, corte técnico, escala e mecanismo; (c) Higgsfield, para atmosfera e para explicação fotorrealista (com aviso visível, P10). Justifique a escolha.
4. **Prepare os derivados** (WebP, srcset 1×/2×, nomes estáveis no padrão de \`_publicar/\`) e escreva \`manifesto.json\` no MESMO esquema dos três módulos já fechados, dizendo qual arquivo vai para qual caminho em \`public/alexandria/v2/aulas/\`. **Não copie nada para public/** — quem publica é o builder da peça.
5. **Escreva as linhas de proveniência prontas** (todas as colunas do §7 M6, revisão factual "pendente (orquestrador)") em \`_publicar/${m}/proveniencia.md\`.
6. **Olhe cada imagem na escala em que ela vai aparecer** antes de aceitar. Rejeição imediata: texto gerado dentro da imagem, geometria impossível, EPI ou escala errados, raios decorativos, cidade azul futurista, holograma, energia brilhando no ar, grid digital falso, subestação absurda.`

phase('Curar')
const LOTES = [['m03', 'm04', 'm05'], ['m06', 'm07', 'm08'], ['m09', 'm10', 'm11'], ['m12', 'm14', 'm15'], ['m16', 'm17']]
const feitos = []
for (const lote of LOTES) {
  log(`curando ${lote.join(' · ')}`)
  const r = await parallel(lote.map((m) => () => agent(tarefa(m), { label: `midia:${m}`, phase: 'Curar', schema: SAIDA, effort: 'high' })))
  feitos.push(...r.filter(Boolean))
}

phase('Consolidar')
const CONS = { type: 'object', properties: { summary: { type: 'string' }, manifesto: { type: 'string' }, totais: { type: 'string' }, creditos: { type: 'string' }, divergencias: { type: 'array', items: { type: 'string' } }, pendencias: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'manifesto', 'totais', 'creditos'] }
const consolidado = await agent(`${COMUM}
TAREFA — UM MANIFESTO SÓ PARA OS 17 MÓDULOS. Trabalhe em ${LAB}/_publicar/.
Os catorze módulos desta frente acabaram de fechar; M01, M02 e M13 já estavam fechados. Relatórios: ${JSON.stringify(feitos).slice(0, 14000)}
1. **Funda tudo num \`manifesto.json\` único** no esquema já usado, cobrindo os 17 módulos e as 141 aulas: cada colocação com aula, bloco de destino, arquivo de origem, caminho de publicação, classe, trabalho nomeado e crédito; mais \`aulas_sem_imagem\` com o motivo de cada uma. O builder da Peça C tem de conseguir publicar tudo lendo só este arquivo.
2. **Funda a proveniência** num \`proveniencia.md\` único, com todas as colunas do §7 M6, pronto para colar em ${DOCS}/media-provenance.md. Confira que não há \`asset_id\` duplicado e que toda entrada tem licença e classe.
3. **Confira os arquivos de verdade:** todo caminho citado no manifesto existe em disco, com o tamanho certo, e nenhum arquivo em \`_publicar/\` ficou órfão do manifesto. Rode a conferência, não confie no relatório.
4. **Escreva \`_publicar/RESUMO.md\`:** quantas imagens por classe, quantas por módulo, quantas aulas ficaram sem imagem e por quê, o que foi gerado × real × Blender, os créditos gastos no total, e a lista de pendências herdadas (imagens que faltam e o caminho recomendado para cada uma).
5. **Declare as divergências:** onde dois módulos usaram esquema diferente, onde falta licença, onde a classe está discutível. Não conserte por conta própria decisão de conteúdo — registre.`, { label: 'consolidar', phase: 'Consolidar', schema: CONS, effort: 'high' })

return { feitos, consolidado }
