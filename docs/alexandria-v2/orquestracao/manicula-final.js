export const meta = {
  name: 'alexandria-v2-manicula-final',
  description: 'Cut the winning solid manicule down to the optical weight of the label it serves, and deliver the final path',
  phases: [{ title: 'Afinar', detail: 'peso ótico medido contra o rótulo, proporção do exemplar real' }],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`
const LAB = `${DOCS}/media-lab/manicula`

phase('Afinar')
const OUT = { type: 'object', properties: { summary: { type: 'string' }, svg: { type: 'string' }, json: { type: 'string' }, bloco1440: { type: 'string' }, bloco390: { type: 'string' }, prova: { type: 'string' }, medicoes: { type: 'string' }, pendencias: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'svg', 'json', 'bloco1440', 'bloco390', 'medicoes'] }
const r = await agent(`CONTEXTO: Alexandria v2 (/alexandria), "atlas vivo do conhecimento em energia": gravura a buril. Pergaminho #F2E9D6, creme #FBF6EA, tinta #2A2620, navy #0D2340. Cinzel + Lora.
A marca ancora a ÚNICA ação principal do bloco de retomada, à esquerda do rótulo "CONTINUAR · M01·A08" em versalete, numa linha de fio gravado com seta. Vive a 20 px (1440) e 18 px (390).
POSSE: escreva só dentro de ${LAB}/final/. NÃO toque src/, public/, git, nem o dev server da 5311 — a Peça A r07 está construindo em paralelo e vai colidir.

O QUE JÁ ACONTECEU. A manícula antiga foi reprovada pelo Founder de bate-pronto. A colheita (${LAB}/fontes/CATALOGO.md) mediu 22 manículas reais de domínio público e achou a regra: existem DUAS receitas, e só uma funciona pequena — a gravada com hachura vira mancha (4,7 % de tinta cheia contra 35,2 % de meio-tom no menor corpo da GPO 1891), a de SILHUETA CHEIA lê limpa a 16 px (Deberny 1886, Watson 1888, ATF 1923 chegam à mesma solução em três países e quatro décadas). Seis candidatas foram julgadas às cegas (${LAB}/candidatas/) por duas lentes:

| candidata | forma | trabalho | soma |
|---|---|---|---|
| **silhueta** (traçada de b10, Deberny 1886 «main noire») | 2 | **1** | **3** |
| flâmula | **1** | 6 | 7 |
| nenhuma marca | 4 | 3 | 7 |
| punho-e-vazio | 3 | 4 | 7 |
| linha mínima | 6 | 2 | 8 |
| agulha de chamada | 5 | 5 | 10 |

**Venceu a \`silhueta\`.** Descartadas de vez, pelas duas lentes: \`linha-minima\` (contorno de 1 px colapsa em glifo quebrado abaixo de 24 px), \`agulha\` (repete o terminal do fio que já está 20 px acima no mesmo bloco), \`punho-e-vazio\` (o vazio entope a 18 px e vira a silhueta com o mesmo custo), \`flâmula\` (bandeira é POSIÇÃO — "você está aqui" —, o oposto de "clique aqui"; e a marca de posição precisa continuar única, é regra de sistema).

SUA TAREFA — A ÚNICA LACUNA QUE SOBROU, nomeada pelas DUAS lentes sem combinar:
> "com 52,2 % de massa ela é o elemento mais escuro do bloco inteiro — mais escura que as versaletes de CONTINUAR, muito mais que o filete de 1 px. A âncora está gritando em vez de apontar: a primeira fixação vai para o borrão de tinta e só depois para o rótulo que ela deveria apresentar."

Afine o peso ótico. O método é medição, não gosto:
1. **Meça o rótulo.** Em ${LAB}/candidatas/bloco-silhueta-1440.png e -390.png, meça a **densidade de tinta por área** das versaletes "CONTINUAR · M01·A08" (tinta ÷ caixa da palavra) e a do fio. Esse é o teto: a marca não pode ter densidade maior que o rótulo que ela serve.
2. **Use a proporção do exemplar real.** A caixa de tinta atual mede 2,13:1 a 1440; o b10 e a escada da GPO 1891 dão proporções mais largas (a n.º 1 da GPO dá 2,80:1). Uma mão mais larga e mais baixa tira massa da linha de texto sem perder o indicador — e é o que a fundição fazia. Teste pelo menos três pontos entre 2,1:1 e 2,9:1.
3. **Não vaze a forma.** Silhueta cheia é o que faz ela sobreviver a 16 px (medido: as três que leem pequeno têm 49–52 % da tinta em massa; as outras dezenove ficam abaixo de 10,6 %). Perder a massa perde a legibilidade. O caminho é **área menor**, não interior aberto: reduzir a altura, afinar o punho, encurtar a manga.
4. **Mantenha o vão mínimo.** Todo vão branco ≥ 2,6 un, que é o passo que a própria fundição dava — a GPO não reduziu o n.º 9 para obter o n.º 1, redesenhou.
5. **O indicador continua caindo na meia altura da linha de texto** e apontando para o rótulo.

ENTREGA em ${LAB}/final/:
- \`manicula.svg\` e \`manicula.json\`: o caminho final (\`d\`, viewBox, caixa de tinta, densidade medida em cada calibre), pronto para substituir o componente \`Manicula\` de \`src/components/alexandria/comum/Retomada.tsx:153\` — que vive num viewBox 0 0 34 20 hoje.
- \`bloco-final-1440.png\` e \`bloco-final-390.png\`: o bloco real com a marca nova, no mesmo recorte das candidatas.
- \`prova-peso.png\`: a marca nova ao lado da antiga e ao lado do rótulo, com a densidade de cada um impressa embaixo, a 16/18/20/24 px e a 100 %.
- \`medicoes.json\`: densidade, caixa de tinta, proporção, vãos e contraste (≥4,5:1 contra pergaminho e contra creme) em cada calibre.
- Registre a procedência em \`PROVENIENCIA.md\`: b10 Deberny & Cie., «main noire», Le livret typographique, 1886, domínio público, com a URL e o método de traçado.
OLHE os PNGs a 100 % antes de entregar. Se a marca ainda for o elemento mais escuro do bloco, ela não está afinada — volte e tire área.`, { label: 'afinar', phase: 'Afinar', schema: OUT, effort: 'high' })

return { final: r }
