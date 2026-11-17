export const meta = {
  name: 'alexandria-v2-acao-sem-mao',
  description: 'The hand is vetoed and the Craft critic says the action has no mass: five non-hand terminal objects that give the single main action weight, in the real block',
  phases: [{ title: 'Cortar', detail: 'cinco objetos terminais sem mão, no bloco real, com densidade medida' }],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/manicula/sem-mao`

phase('Cortar')
const OUT = { type: 'object', properties: { summary: { type: 'string' }, contato: { type: 'string' }, opcoes: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, ideia: { type: 'string' }, bloco1440: { type: 'string' }, bloco390: { type: 'string' }, densidade: { type: 'string' } }, required: ['id', 'ideia', 'bloco1440', 'bloco390', 'densidade'] } }, recomendacao: { type: 'string' }, svg: { type: 'string' }, json: { type: 'string' } }, required: ['summary', 'opcoes', 'recomendacao'] }
const r = await agent(`CONTEXTO: Alexandria v2 (/alexandria), "atlas vivo do conhecimento em energia": gravura a buril, cartografia histórica. Pergaminho #F2E9D6, creme #FBF6EA, tinta #2A2620, navy #0D2340, ouro #CBAA6E, terracota #A8462A (rara, ≈1 por viewport). Cinzel (identidade/versalete) + Lora (conteúdo).
POSSE: escreva só dentro de ${LAB}/. NÃO toque src/, public/, git, nem a porta 5311 — renderize HTML local em file:// com Playwright próprio.

DUAS COISAS ACONTECERAM, E ELAS APONTAM PARA O MESMO LUGAR.

**(1) O Founder vetou a mão.** Olhando a linha da ação no bloco de retomada:
> "a mãozinha ainda está aqui, não usa ela, usa outra coisa vai, muito melhor"
A mão está **vetada**. Não proponha mão, manícula, dedo, punho nem luva, em nenhuma variação — a rodada anterior já provou que a silhueta cheia é a única manícula que lê a 18 px, e ele olhou e vetou mesmo assim. Decisão tomada.

**(2) O Craft critic reprovou a r07 pelo mesmo ponto, por outro caminho.** Citando o veredito:
> "A ação principal não tem massa: ao remover a mobília da r06 (card creme opaco + barra navy chapada), a r07 removeu junto o único objeto terminal da coluna de leitura e não pôs nada no lugar. 'CONTINUAR · M01·A08' virou o traço MAIS LEVE da tela inteira, versalete pequeno atrás de uma manícula e de um fio-flecha que termina no ar. O North Star fecha a coluna de texto com um botão navy preenchido, a peça pequena mais densa do seu frame; a r07 fecha a mesma coluna desmanchando-se em papel."
A escada medida hoje é: título da aula (serifa ~26 px, o mais pesado) → meta → nota em itálico → fio-flecha de 1 px que morre no vazio → "CONTINUAR · M01·A08" em versalete pequeno, **mais leve que a nota em itálico acima dele**, e a coluna termina sem acento nenhum, com ~100 px de papel sobrando.

**O ALVO, ENTÃO, NÃO É "TIRAR A MÃO". É DAR MASSA À AÇÃO SEM MOBÍLIA DE PRODUTO.** A ação precisa ser o **objeto pequeno mais denso da coluna** — mais denso que a nota em itálico e que a linha de metadado —, sendo ao mesmo tempo um objeto do atlas. Proibido: barra cheia navy ou creme como botão (foi o que a r06 fez e o Founder reprovou), caixa com fio em volta, sombra, raio, gradiente, seta de aplicativo.

ESTADO ATUAL para recortar: ${DOCS}/captures/A/r07/home-E2-1440.png (coluna esquerda, ação em y≈600–650), home-E2-390.png, home-E0-1440.png (o mesmo bloco em "POR ONDE COMEÇAR · COMEÇAR · M01·A01").

VOCABULÁRIO DA CASA (${DOCS}/media-lab/marcas-do-chrome/final/marcas.json e DECISAO.md). **Reservadas, não reutilize com outro sentido:** flâmula = POSIÇÃO; ✳ = remissão de aparato; ‡ = Biblioteca; ¶ = sumário; ◇ = separador; colchetes = FOCO. **Disponível e semanticamente exata para este ato:** a TRAVESSIA ENTRE SUPERFÍCIES (fio com batente nas duas pontas) — sair da Home e entrar na aula É uma travessia. Especificação de traço obrigatória: ${DOCS}/media-lab/marcas-do-chrome/medida/vocabulario.md.

TAREFA — CINCO OBJETOS TERMINAIS, no bloco real. Recorte o bloco das capturas r07 e troque SÓ o tratamento da ação, mantendo o resto idêntico:
1. \`cartela\` — a ação vive dentro de uma **cartela gravada** da mesma família do selo de registro do cabeçalho: duas pontas entalhadas, fio duplo da dobra, têmpera interna, papel por dentro (sem preenchimento). O rótulo em versalete ganha corpo. Massa vem do fio duplo e do entalhe, não de área chapada.
2. \`carimbo\` — a ação é um **carimbo batido**: o rótulo em versalete dentro de uma moldura de régua dupla, ligeiramente fora de esquadro (≤1,5°), na tinta da casa. É o gesto de quem marca "vá por aqui" num caderno de campo.
3. \`travessia-pesada\` — sem símbolo novo: a marca de travessia da casa, mas **gravada em peso de aparato**, e o fio-flecha de cima **sai** (era ele o duplicado). O fio da ação engrossa para o calibre de 24 px da tabela, com batente nas duas pontas, e o rótulo sobe de corpo. A densidade vem do fio e do corpo do versalete.
4. \`estacao\` — a **estação de latão gravada** da família do globo e das medalhas, a 24 px, marcando o **destino** (não a posição — essa é a flâmula, e está no globo), com o rótulo ao lado em versalete de corpo maior. Objeto com relevo, é a opção mais "peça" do conjunto.
5. \`versalete-grave\` — **nenhum símbolo**: o próprio rótulo vira o objeto denso. Versalete em corpo maior, espacejado, assentado sobre fio duplo de tinta, ocupando a largura da coluna. Prova a hipótese de que tipografia sozinha fecha a coluna.

Inclua também \`atual\` (recorte r07 sem alteração) e \`r06\` (recorte de ${DOCS}/captures/A/r06/home-E2-1440.png, o card com barra navy que o Founder reprovou) — os dois extremos entre os quais a resposta tem de ficar.

MEDIÇÃO QUE DECIDE (é o gate desta rodada): **densidade de tinta por área** da linha da ação, comparada, no mesmo recorte, com (a) a nota em itálico acima, (b) a linha de metadado e (c) o título da aula. A ação precisa ficar **acima de (a) e (b)**. Meça e escreva o número de cada opção. Se nenhuma passar, diga isso — não maquie.

ENTREGA em ${LAB}/:
- \`bloco-<id>-1440.png\`, \`bloco-<id>-390.png\` e \`bloco-<id>-e0-1440.png\` para os cinco mais \`atual\` e \`r06\`, nomes neutros.
- \`contato.png\`: os sete blocos empilhados em escala real 1:1 sobre pergaminho, nome em aparato ao lado, mais detalhe a 3× da linha da ação e a densidade impressa embaixo de cada um.
- \`medidas.json\`: densidade, alvo da ação (≥44×44 a 390), contraste (≥4,5:1), altura do bloco.
- \`acao.svg\` + \`acao.json\`: os caminhos, prontos para virar componente React substituindo \`Manicula\` em \`src/components/alexandria/comum/Retomada.tsx\`.
- \`recomendacao\`: qual fecha a coluna sem mobília de produto, com o número que sustenta.
REGRAS: uma só ação principal (S1), com objeto e motivo. Raio 0, zero sombra, zero gradiente, nenhuma barra cheia. Terracota só se for a única ocorrência do viewport. OLHE cada PNG a 100 % antes de entregar: o teste é "a coluna fecha, e o que a fecha foi cortado pela mesma mão que gravou a página?".`, { label: 'cortar', phase: 'Cortar', schema: OUT, effort: 'high' })

return { r }
