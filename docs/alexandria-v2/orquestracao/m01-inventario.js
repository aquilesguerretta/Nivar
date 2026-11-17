export const meta = {
  name: 'alexandria-v2-m01-inventario',
  description: 'Exact gap list for finishing Module 01 end to end: nine lessons, seven instruments, the apparatus, the animations and the module page',
  phases: [{ title: 'Inventariar', detail: 'quatro leitores, um por eixo; nada é construído' }],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`

const CASA = `
DECISÃO DO FOUNDER, 2026-09-21: **fechar o MÓDULO 01 inteiro em qualidade final** — todas as aulas, instrumentos, interações e animações — para ele avaliar e então dar a régua do resto da Alexandria. O M01 já é o padrão-ouro declarado no bar ("o que for aprovado nele vira a régua dos outros módulos"), então esta não é uma fatia arbitrária: é a régua.
CONTEXTO: Alexandria v2 (/alexandria), "atlas vivo do conhecimento em energia". Contrato: ${DOCS}/bar.md. Decisões: ${DOCS}/decisoes/. Loop e vereditos: ${DOCS}/loop/. Tiques: ${DOCS}/briefs/varredura-anti-ia.md.
FONTE ÚNICA do M01: ${DOCS}/extraction/m01/ — modulo.json (identidade, tese, resultado_esperado, mapa, roteiro, criterio, lab_01, voz, erros_comuns, tradutor), aparato.json (caso, avaliacao, checklist_final, exercicios, referencias, glossario, contexto_criterios) e aula-08.json. **Nenhum fato pode vir de fora da fonte.**
ESPECIFICAÇÕES JÁ PRONTAS, use em vez de refazer: arquétipos de aula em ${DOCS}/estudos/aulas/SISTEMA.md e mapa-aulas.json · instrumentos em ${DOCS}/extraction/instrumentos/ (instrumentos.json, PORTAR.md) · glossário em ${DOCS}/extraction/glossario/ · movimento e conquistas em ${DOCS}/estudos/movimento-e-conquistas/ (sistema-de-movimento.md tem os 10 momentos com coreografia em ms e critério de aceite em filmstrip; sistema-de-conquistas.md tem o catálogo e a medalha) · medalhas r04 em ${DOCS}/media-lab/movimento-e-conquistas/medalhas/ · mídia das aulas em ${DOCS}/media-lab/aulas/_publicar/manifesto.json · divergências em ${DOCS}/extraction/reconciliacao/DECIDIR.md.
**NADA É CONSTRUÍDO NESTA RODADA.** Você inventaria. Há um builder trabalhando em src/ agora: leia src/ à vontade, **não edite nada** — nem src/, nem public/, nem tools/, nem app/, nem git, nem a porta 5311. Escreva só onde a sua tarefa mandar.
O FORMATO DA SAÍDA, igual para os quatro: uma tabela onde **cada linha é uma unidade de trabalho verificável**, com: o que a fonte tem · o que o produto tem hoje (arquivo e linha) · o que falta · o gate do bar que isso cumpre · e o tamanho (P/M/G). Linha que não puder ser verificada no render não é unidade de trabalho — é pesquisa, e vai para uma seção à parte.`

const S = { type: 'object', properties: { summary: { type: 'string' }, arquivo: { type: 'string' }, unidades: { type: 'number' }, jaPronto: { type: 'string' }, falta: { type: 'string' }, bloqueios: { type: 'array', items: { type: 'string' } }, decisoesDoFounder: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'arquivo', 'unidades', 'jaPronto', 'falta', 'bloqueios'] }

phase('Inventariar')
const [aulas, instrumentos, aparato, movimento] = await parallel([
  () => agent(`${CASA}
TAREFA — AS NOVE AULAS DO M01. Escreva ${DOCS}/m01/aulas.md.
Para **cada uma das nove aulas** (A01–A09), lendo a aula inteira na fonte:
1. **Arquétipo**: qual é, segundo mapa-aulas.json e SISTEMA.md §1, e por quê. Hoje só a A08 está construída (\`src/components/alexandria/aula/AulaM01A08.tsx\`); diga quais arquétipos as outras oito pedem e quais deles **já têm tronco construído** (PRANCHA, SERIE, MESA, LUPA existem; os outros seis não).
2. **O ato autêntico** (C9): qual é o menor ato que exercita o mecanismo central desta aula, derivado da fonte. Se a aula tem previsão útil (C3), qual é a pergunta de previsão com os valores do cenário-padrão. Se não tem, qual ato do catálogo do bar cabe. **"Explique com suas palavras" só como último recurso, e o bar proíbe que a maioria das aulas de um módulo feche assim** — conte quantas ficariam.
3. **Instrumento e exercícios**: quais instrumentos a aula invoca e em que ponto da prosa; quantos exercícios tem e se estão renderizados hoje.
4. **Mídia**: o que o manifesto já publicou para esta aula, em que bloco, e se falta alguma.
5. **Termos do léxico** que a aula usa e que precisam ligar à definição sem sair da aula (C4).
Feche com a contagem: quantas aulas estão a zero, quantas têm tronco pronto, e a ordem recomendada de construção (a que mais ensina o sistema primeiro).`, { label: 'aulas', phase: 'Inventariar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
TAREFA — OS SETE INSTRUMENTOS DO M01 E O LABORATÓRIO. Escreva ${DOCS}/m01/instrumentos.md.
A especificação dos 165 já existe (${DOCS}/extraction/instrumentos/instrumentos.json). Sua tarefa é o **delta do M01**: o que separa a especificação do instrumento funcionando na tela.
1. Para cada um dos **7 instrumentos do M01**: está portado? desenha a forma que o nome promete (C5)? tem previsão registrada antes do resultado, com previsto × calculado no mesmo cenário? tem tolerância declarada pela fonte (a resposta provavelmente é não — o bar tem só 1 de 165 — e então o veredito "dentro/fora" é proibido e vale a autoavaliação em três níveis de C7)?
2. **O INST·06** (fator de capacidade) é o instrumento da aula-padrão e já tem render. Meça o que falta nele contra o C5 inteiro.
3. **O LAB·01 "Comparador de perfil elétrico"** é o **único laboratório do currículo** — os outros dezesseis módulos não têm. A fonte dá enunciado, dois campos comuns, duas colunas com três campos e quatro saídas, nota e as doze linhas de coeficiente. Diga exatamente o que falta para ele existir como lugar no módulo, e **o que a fonte NÃO dá** (passos e entregável estão null na extração — isso é ausência declarada, não item a inventar).
4. **Os controles**: a rodada passada foi reprovada porque a prancha do Laboratório era seis sliders de trilho com botão circular. Diga qual é o desenho de controle da casa para cada tipo de entrada (valor contínuo, escolha, número digitado), dentro das duas regras de sistema.
Feche com a ordem de porte e o custo de cada forma prometida.`, { label: 'instrumentos', phase: 'Inventariar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
TAREFA — O APARATO DO M01 E A PÁGINA DO MÓDULO. Escreva ${DOCS}/m01/aparato.md.
O bar (C2) exige que os tipos de objeto se distingam e que nada vire "recursos" anexado no fim. A fonte do M01 tem o roteiro com **19 seções: 9 aulas + 10 aparatos**. Inventarie cada um:
1. **O caso "Operação A"** (parte 1 no M01): o que a fonte dá, o que o produto mostra, e o que o C8 exige (decisão com informação incompleta; nada aparece abaixo da decisão antes do registro; consequências em ≥2 dimensões, sem escore único). O M08 é "Exercício de decisão" (P4) — o caso do M01 é outra coisa, diga o quê.
2. **A avaliação**: 10 questões na fonte. O critério é contraditório (P5 manda preservar o critério literal até a reconciliação). Diga o que a tela precisa mostrar **antes** da avaliação, e por que ela nunca vira Demonstrado.
3. **O checklist final**: 16 itens, 15 deles em produção oral ou livre. Pelo P14 nenhum vira evidência automatizada — todos entram como "atividade recomendada". Diga como isso aparece sem virar lista morta.
4. **A revisão**: os exercícios sem vínculo com aula ficam aqui (P9). Quantos são, e estão visíveis sem trocar de aba?
5. **As referências** (fontes do M01) e o **léxico** (38 termos): o que a Biblioteca e o Glossário precisam mostrar para o módulo fechar, e a ida-e-volta aula → termo → aula e aula → fonte → aula (D6).
6. **A página do módulo**: os critics acabaram de achar que o cartucho da carta só existe no M01 e que o progresso aparece em um eixo só. Liste o que falta na página **do M01 especificamente** para ela ser mission control, agora que o backend responde Praticado.`, { label: 'aparato', phase: 'Inventariar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
TAREFA — AS ANIMAÇÕES E AS CONQUISTAS DO M01. Escreva ${DOCS}/m01/movimento.md.
O Founder pediu explicitamente "todas as animações, mecânicas e interações". O sistema já está especificado em ${DOCS}/estudos/movimento-e-conquistas/sistema-de-movimento.md (10 momentos, com gatilho, função, coreografia em ms, versão com movimento reduzido e critério de aceite em filmstrip) e os protótipos HTML existem em ${DOCS}/media-lab/movimento-e-conquistas/prototipos/. **Nada disso está no produto.**
1. Para cada um dos **10 momentos**, diga: o que o protótipo prova, o que o produto tem hoje, o que falta, e qual gate do S6 ele cumpre. Marque quais são do M01 (entrada de aula, registro de ato, conclusão de aula, conclusão de módulo, conquista, giro do globo, continuidade nó → módulo) e quais só aparecem depois.
2. **A medalha do M01**: a série r04 está cortada (${DOCS}/media-lab/movimento-e-conquistas/medalhas/, 74 artes × 2 estados × 4 tamanhos, variante B sobre papel). Diga o que falta para ela aparecer no fim do módulo, no Progresso e na Home, nos tamanhos certos, com o estado "não obtida" como disco cego.
3. **As conquistas computáveis hoje**: a família CONCLUSÃO é a única que o backend sustenta. Diga quais instâncias do M01 são concedíveis e com que evento, e por que as outras famílias continuam "em desenho".
4. **O contrato de movimento reduzido** e a interrupção: o S6 exige mesmo estado final e nenhuma coreografia que não possa ser interrompida. Diga o que precisa ser verificado em filmstrip.
5. **A biblioteca de movimento**: a decisão entre View Transitions API, \`motion\` e FLIP escrito à mão está pendente em ${DOCS}/estudos/movimento-e-conquistas/. Meça as três contra o que o M01 precisa e **recomende uma**, com o argumento — mas não implemente.`, { label: 'movimento', phase: 'Inventariar', schema: S, effort: 'high' }),
])

return { aulas, instrumentos, aparato, movimento }
