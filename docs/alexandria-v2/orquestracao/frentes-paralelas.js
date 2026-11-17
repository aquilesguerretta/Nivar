export const meta = {
  name: 'alexandria-v2-frentes-paralelas',
  description: 'Four fronts that never touch src/: glossary extraction, instrument specification, curricular reconciliation, and the search backend',
  phases: [{ title: 'Paralelo', detail: 'quatro frentes disjuntas, nenhuma toca o front' }],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`

const CASA = `
CONTEXTO: Alexandria v2 (/alexandria), currículo de energia da NIVAR, "atlas vivo do conhecimento em energia". Contrato: ${DOCS}/bar.md. Decisões do Founder: ${DOCS}/decisoes/ — vale em especial P3 e P11 (texto conectivo derivado FIELMENTE da fonte é permitido; conteúdo factual novo exige revisão), P5, P6 (**não inventar tolerância**), P8 (divergência de título e contagem é reconciliação separada), P14, P18, P25.
FONTE ÚNICA: ${DOCS}/extraction/mNN/ (modulo.json, aparato.json, aula-NN.json), extraída do HTML original com toda string conferida como substring exata. **Nenhum fato, número ou afirmação pode vir de fora da fonte** — o Founder foi explícito: nada de pesquisa externa para material de ensino ou dado. Onde a fonte não diz, a saída é ausência declarada (S4: "não declarado", "ainda não disponível"), nunca preenchimento por plausibilidade.
POSSE — DURA NESTA RODADA: **há um builder reescrevendo \`src/\` agora.** Não toque \`src/\`, \`public/\`, \`index.html\`, \`tools/\`, git, nem a porta 5311. Escreva só onde a sua tarefa mandar.`

const S = (extra) => ({ type: 'object', properties: { summary: { type: 'string' }, arquivos: { type: 'array', items: { type: 'string' } }, numeros: { type: 'string' }, decisoesDoFounder: { type: 'array', items: { type: 'string' } }, pendencias: { type: 'array', items: { type: 'string' } }, ...extra }, required: ['summary', 'arquivos', 'numeros', 'decisoesDoFounder'] })

phase('Paralelo')
const [glossario, instrumentos, reconciliacao, busca] = await parallel([
  () => agent(`${CASA}
TAREFA — EXTRAIR O GLOSSÁRIO INTEIRO. Saída em ${DOCS}/extraction/glossario/.
O produto hoje tem **637 verbetes dos 2.124 termos da fonte (30%), de 8 dos 17 módulos, e o Território III inteiro com ZERO**. É a maior dívida de conteúdo da Alexandria e ela não depende de nenhuma decisão de design — depende de extrair.
1. Extraia, dos 17 \`aparato.json\` (campo \`glossario\`), **todos** os termos com o que a fonte der: termo, definição literal, família/categoria, e o módulo e a aula de origem. Nada de definição escrita por você.
2. **Âncora curricular por termo** (D4): em que módulo e em que aula o termo aparece. Onde a fonte não permitir determinar, marque \`"ancora": "não declarado"\` — é a resposta certa, e o número de "não declarado" é um dado sobre a cobertura, não uma falha.
3. **Deduplicação com cuidado:** termos repetidos entre módulos podem ser o mesmo conceito ou homônimos com definições diferentes (o caso conhecido é "PLD" em três entradas). Não funda cegamente — registre os conflitos de definição em \`conflitos.json\` com as duas leituras lado a lado, para decisão do Founder.
4. **Relações** (D4, "termos relacionados"): só as que a fonte sustenta — termo citado dentro da definição de outro, ou termos da mesma família. Não invente rede semântica.
5. Entregue \`glossario.json\` (o dado que o produto vai consumir), \`glossario.md\` (a tabela legível), \`conflitos.json\` e \`COBERTURA.md\` com os números por módulo e por território, mais a comparação com os 637 que o produto tem hoje: quantos são novos, quantos batem, quantos divergem.`, { label: 'glossario', phase: 'Paralelo', schema: S({ cobertura: { type: 'string' } }), effort: 'high' }),

  () => agent(`${CASA}
TAREFA — ESPECIFICAR OS 165 INSTRUMENTOS. Saída em ${DOCS}/extraction/instrumentos/.
Os instrumentos são a espinha da aula, e hoje: **55 dos 165 não estão portados** (M09, M13, M14, M16, M17), **só um desenha a forma que o nome promete**, e **só 2 de 111 têm tolerância**. O C5 exige que o instrumento desenhe a forma prometida e que "dentro/fora" só exista com tolerância real. Esta tarefa não porta nada — ela especifica, para o builder da aula poder portar sem inventar.
Para **cada** instrumento da fonte (\`aparato.json\` → instrumentos; e o script embutido no HTML quando a extração o preservou), escreva:
· **identidade:** id, título literal, módulo e aula, e o que ele pergunta;
· **entradas:** cada controle com rótulo, unidade, faixa e valor-padrão, **literais da fonte**;
· **saídas:** cada resultado com rótulo, unidade e a fórmula que a fonte declara — copiada, não deduzida;
· **forma prometida:** o nome ou o texto promete um desenho? (curva líquida, pilha de despacho, escada, trajetória, calendário, comparação lado a lado). Se sim, **o que exatamente precisa ser desenhado**, com os eixos e a relação que a figura tem de mostrar. Este campo é o que resolve o C5 — seja concreto.
· **tolerância:** só se a fonte declarar. Onde não declarar, \`"tolerancia": null\` e o instrumento **não** oferece veredito "dentro/fora" — oferece autoavaliação em três níveis (P6). Liste à parte os instrumentos onde a tolerância seria pedagogicamente útil: vira pedido de revisão técnica para o Founder, não invenção sua.
· **previsão:** o erro de previsão é útil aqui? (C3). Se sim, qual é a pergunta de previsão, com os valores do cenário-padrão.
Entregue \`instrumentos.json\`, \`instrumentos.md\` e \`PORTAR.md\` — a ordem recomendada de portabilidade, com os 55 que faltam primeiro e o custo estimado de cada forma prometida.`, { label: 'instrumentos', phase: 'Paralelo', schema: S({ formasPrometidas: { type: 'string' }, semTolerancia: { type: 'string' } }), effort: 'high' }),

  () => agent(`${CASA}
TAREFA — RECONCILIAÇÃO CURRICULAR E ERROS DE CONTEÚDO (P8). Saída em ${DOCS}/extraction/reconciliacao/.
Duas dívidas que travam o produto e que **só o Founder pode fechar** — o seu trabalho é deixar cada uma decidível em um minuto, não decidir por ele.
1. **As divergências.** O \`modulo.json\` do M01 registra **14 divergências não resolvidas**, e os outros módulos têm as suas. Levante todas, dos 17 módulos. Para cada uma: o que a leitura A diz, o que a leitura B diz, onde cada uma aparece (arquivo e linha, na fonte e no código), **qual delas o produto mostra hoje**, e o que muda na tela se a decisão for uma ou outra. Ordene por impacto: divergência que aparece no render pesa mais que divergência interna.
2. **Os erros de conteúdo.** ${DOCS}/content-qa.md tem 10 entradas, entre elas um instrumento com energia mil vezes menor do que deveria. Para cada: o que está escrito, por que está errado, **qual é a correção proposta e de onde ela sai** (se sai da própria fonte, é conserto; se exige conhecimento de fora, é revisão técnica do Founder e você NÃO propõe o número). Marque as duas classes com clareza.
3. **As contagens.** O bar declara 141 aulas, 165 instrumentos, 2.124 termos, 214 exercícios. Confira cada uma contra a fonte e contra o código, e aponte onde os três discordam — em especial os "119 exercícios invisíveis" contra os 214 da fonte.
Entregue \`DECIDIR.md\`: uma tabela onde cada linha é uma pergunta fechada para o Founder, com as opções e a consequência de cada uma. Mais \`divergencias.json\` e \`contagens.json\` com o dado bruto.`, { label: 'reconciliacao', phase: 'Paralelo', schema: S({ paraDecidir: { type: 'string' } }), effort: 'high' }),

  () => agent(`${CASA}
TAREFA — A BUSCA REAL, NO BACKEND. Você é engenheiro de backend (FastAPI · SQLAlchemy 2 · Alembic · Postgres 17). Diretório ${WT}.
**POSSE:** você pode criar \`app/routers/alexandria_busca.py\` e \`app/services/alexandria_busca.py\`, e tocar \`docs/v2-backend-contract.md\` (só a seção nova). **NÃO toque** Argos, Ariadne (\`argos_memory\`, migrations 0009/0010, \`tests/argos_memory/\`), identidade, auth, Advisory, PJM, Atlas, \`app/main.py\` a não ser pela linha de registro do router, \`src/\`, \`public/\` e git. **Há agentes do Codex em Argos e Ariadne agora.**
**MIGRATION: NENHUMA.** A cabeça é \`0010_argos_lineage_head\` e o slot 0011 já está ocupado fora desta worktree (17 branches, cadeia até 0015). Se você concluir que precisa de tabela, **PARE e reporte** em \`pendencias\`.
O CONTEXTO: o bar (§9) lista "busca real (termos, aulas, fontes)" como dependência, e o §6 tem hard gate de **controle inerte** — campo que não busca não pode existir. O front já construiu o índice remissivo (\`src/components/alexandria/busca/\`, SOMENTE LEITURA para você) e hoje ele busca num índice em memória montado no cliente. Isso funciona para 141 aulas e não funciona para 2.124 termos.
1. **Leia** o índice do front para saber a forma que ele espera, e o contrato para seguir o envelope canônico das outras rotas.
2. **Projete a busca sem tabela nova.** O dado curricular vive em arquivo (\`src/lib/data/\`, extração em \`docs/alexandria-v2/extraction/\`), não no banco. Avalie honestamente as opções e escolha uma, justificando: índice carregado em memória no servidor a partir do JSON de extração; busca full-text do Postgres sobre dado já existente; ou dizer que **o lugar certo é o cliente** e que o backend não deve entrar. **Se a resposta honesta for "não precisa de backend", diga isso** — é uma conclusão legítima e melhor que um endpoint inútil.
3. Se houver endpoint, implemente com testes no mesmo mecanismo de \`tests/progress/\`, e atualize o contrato.
Rode \`python -m pytest tests/ -q\` e reporte a saída real.`, { label: 'busca', phase: 'Paralelo', schema: S({ decisao: { type: 'string' }, testes: { type: 'string' } }), effort: 'high' }),
])

return { glossario, instrumentos, reconciliacao, busca }
