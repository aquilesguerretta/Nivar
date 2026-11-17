export const meta = {
  name: 'alexandria-v2-backend-progresso',
  description: 'Make the Alexandria progress backend tell the truth: the practice axis becomes readable, the streak stops being wrong, and the whole thing gets tests',
  phases: [
    { title: 'Medir', detail: 'ler o backend e o contrato antes de escrever uma linha' },
    { title: 'Construir', detail: 'caminho de leitura, sequência derivada, testes, contrato' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v2`

const POSSE = `
POSSE E FRONTEIRAS — leia com atenção, a árvore tem outros agentes vivos AGORA.
· **Você pode editar:** \`app/routers/progress.py\`, \`app/services/progress_service.py\`, \`app/db/models/progress.py\`, testes novos em \`tests/\`, e \`docs/v2-backend-contract.md\` (só as seções de progresso).
· **NÃO TOQUE, em hipótese nenhuma:** Argos e Ariadne (\`app/services/argos_memory.py\`, \`app/db/models/argos_memory.py\`, migrations 0009/0010, \`tests/argos_memory/\`), identidade e auth, os produtos Advisory (conta_luz, solar_proposal, diagnostico), os serviços PJM, o Atlas mundial, \`app/main.py\`, \`src/\`, \`public/\`, \`requirements.txt\` e git. **Há agentes do Codex trabalhando em Argos e Ariadne neste momento.**
· **MIGRATION: evite.** A cabeça da cadeia é \`0010_argos_lineage_head\`, que é justamente Argos — se você criar uma \`0011\` enquanto o Codex cria outra, viram duas cabeças concorrentes e alguém desempata à mão. **A tarefa foi desenhada para não precisar de schema novo.** Se você concluir que é impossível sem migration, **PARE e reporte** em \`bloqueios\` em vez de criar a revisão.
· Não faça commit nem \`git add\`.`

phase('Medir')
const MED = { type: 'object', properties: { summary: { type: 'string' }, tabelas: { type: 'string' }, eventos: { type: 'string' }, comoRodamOsTestes: { type: 'string' }, riscos: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'tabelas', 'eventos', 'comoRodamOsTestes'] }
const medida = await agent(`Você é engenheiro de backend (FastAPI · SQLAlchemy 2 · Alembic · Postgres 17). Diretório ${WT}.
${POSSE}
TAREFA — MEDIR ANTES DE ESCREVER. Não edite nada nesta fase.
1. Leia \`app/routers/progress.py\`, \`app/services/progress_service.py\`, \`app/db/models/progress.py\`, a migration \`0004_progress.py\` e \`docs/v2-backend-contract.md\`. Descreva com precisão: as tabelas (\`progress_event\`, \`aula_status\`, \`badge_award\`, \`study_streak\`), quem escreve cada uma, quais tipos de evento o CHECK aceita, e o que cada endpoint devolve hoje.
2. Confirme ou refute, com arquivo e linha, o diagnóstico já levantado em ${DOCS}/estudos/peca-D/o-que-existe.md: (a) **não existe nenhum SELECT sobre \`progress_event\` em todo o \`app/\`** — os eventos de prática são gravados e ilegíveis; (b) a sequência usa \`CURRENT_DATE\` do banco (UTC), então quem estuda às 22h em Brasília cai no dia seguinte; (c) a chamada que atualiza a sequência é incondicional, então **qualquer** evento conta como estudo, inclusive \`badge_conquistado\`, que a própria máquina emite; (d) a tabela guarda \`maior\` mas não o dia em que a maior sequência terminou.
3. Descubra **como os testes deste repositório rodam de verdade** (\`tests/\`, pytest, conftest, se precisam de banco vivo, se há fixture de sessão). Você vai escrever testes e eles precisam rodar do mesmo jeito que os que já existem.
4. Liste os riscos de colisão com os agentes do Codex: que arquivos do seu escopo eles poderiam tocar, e como você saberia.`, { label: 'medir', phase: 'Medir', schema: MED, effort: 'high' })

phase('Construir')
const OUT = { type: 'object', properties: { summary: { type: 'string' }, filesChanged: { type: 'array', items: { type: 'string' } }, endpoints: { type: 'string' }, testes: { type: 'string' }, contrato: { type: 'string' }, semMigration: { type: 'string' }, bloqueios: { type: 'array', items: { type: 'string' } }, paraOFront: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'filesChanged', 'endpoints', 'testes', 'semMigration', 'bloqueios', 'paraOFront'] }
const build = await agent(`Você é engenheiro de backend (FastAPI · SQLAlchemy 2 · Alembic · Postgres 17). Diretório ${WT}.
${POSSE}
MEDIÇÃO DA FASE ANTERIOR: ${medida ? JSON.stringify(medida).slice(0, 8000) : '(falhou — meça você mesmo antes de escrever)'}

CONTEXTO DE PRODUTO. Este backend serve a Alexandria, o currículo de energia da NIVAR. O contrato do produto (${DOCS}/bar.md §S3) separa **evidência de aprendizagem** em três eixos — Percorrido, Praticado e Demonstrado — de **motivação** (XP, sequência, conquistas), e proíbe que a segunda se apresente como a primeira. Hoje o produto **não consegue dizer nada sobre Praticado**, e a sequência de dias está errada. É isso que você vai consertar. A regra que manda em tudo: **ausência se declara, nunca se preenche por plausibilidade** — número sem origem é pior que número ausente.

TAREFA.
1. **O eixo Praticado vira legível.** Os eventos \`instrumento_usado\` e \`exercicio_respondido\` são aceitos, gravados e nunca lidos. Crie o caminho de leitura: função de serviço + endpoint(s) que respondam, por learner, **quantas aulas têm prática registrada** e **o estado de prática de uma aula** (e, se o payload sustentar, de um instrumento ou exercício). Agregue no banco, não em Python sobre a tabela inteira. Índice: **não crie migration** — se a consulta precisar de índice para ser sã, escreva a consulta de forma que os índices existentes sirvam e registre em \`paraOFront\` qual índice seria desejável numa migration futura.
2. **A sequência de dias deixa de estar errada, por derivação e sem schema novo.** Três defeitos:
   · **fuso:** o dia tem de ser o dia do learner, não \`CURRENT_DATE\` do banco em UTC. Use fuso explícito (America/Sao_Paulo como padrão declarado no contrato) computando o dia na consulta, para quem estuda às 22h em Brasília não cair no dia seguinte;
   · **quais eventos contam:** só evento de estudo de verdade. \`badge_conquistado\` é emitido pela própria máquina e **não pode alongar a sequência do learner**. Decida e **documente** a lista de tipos que contam;
   · **a data de fim da maior sequência:** hoje não é guardada, então qualquer "até tal data" seria inventado. **Derive do log** (\`progress_event\` é o log imutável e é a fonte da verdade) em vez de acrescentar coluna. Com isso \`study_streak\` vira cache reconstruível, e não fonte.
   Deixe o comportamento antigo e o novo conciliáveis: se \`study_streak\` continuar existindo como cache, ele passa a ser **preenchido pela derivação**, nunca por incremento cego.
3. **Testes.** Não existe teste de progresso hoje. Escreva, no mesmo mecanismo dos testes que já rodam: eventos de prática que passam a ser lidos; um learner que estuda às 22h em Brasília e **não** ganha dois dias; \`badge_conquistado\` que **não** alonga a sequência; a maior sequência com a data de fim correta; e o caso vazio (learner sem evento nenhum) devolvendo ausência declarada, não zero.
4. **O contrato.** Atualize as seções de progresso de \`docs/v2-backend-contract.md\` com os endpoints novos, a forma exata da resposta, a lista de tipos que contam para a sequência e o fuso declarado. O front lê esse documento antes de chamar; contrato desatualizado é defeito.
5. **Não emita evento nenhum do front.** \`src/\` está sendo reescrito por outra frente agora. O que o front precisar fazer (emitir \`instrumento_usado\` e \`exercicio_respondido\`, parar de disparar \`aula_iniciada\` na montagem do viewer) vai em \`paraOFront\`, com o nome do arquivo e o que mudar.
VERIFICAÇÃO: rode os testes que você escreveu **e** a suíte que já existia, e reporte a saída real. Se algo não rodar por falta de banco, diga exatamente isso em vez de declarar sucesso. Em \`semMigration\`, confirme que nenhuma revisão do Alembic foi criada e que a cabeça continua \`0010_argos_lineage_head\`.`, { label: 'construir', phase: 'Construir', schema: OUT, effort: 'high' })

return { medida, build }
