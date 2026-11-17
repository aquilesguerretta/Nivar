export const meta = {
  name: 'alexandria-v3-pesquisa',
  description: 'Research the best online learning products and the visual reference libraries — orientation, the lesson, interactive explanation, classical-meets-modern identity, the evidence, the galleries and motion — and turn it into concrete paths for Alexandria',
  phases: [
    { title: 'Pesquisar', detail: 'sete ângulos em paralelo, cada um abrindo produto de verdade' },
    { title: 'Sintetizar', detail: 'três caminhos distintos, com o que cada um custa e descarta' },
  ],
}
const WT = 'C:/dev/gridalpha-v2-alexandria-v2-restructure'
const DOCS = `${WT}/docs/alexandria-v3/pesquisa`
const V2 = `${WT}/docs/alexandria-v2`

const CASA = `
O PRODUTO. Alexandria é o currículo de energia da NIVAR, em /alexandria: **17 módulos, 3 trilhas, 141 aulas**, extraídos de um HTML-fonte autoral e conferidos string a string. O learner-alvo é profissional ou estudante de energia no Brasil que precisa "defender um número em reunião com a fonte ao lado" — não é curso de hobby, não é bootcamp.
O QUE A ALEXANDRIA JÁ TEM, e é raro: **165 instrumentos** — calculadoras reais do domínio, com entradas rotuladas, unidade, faixa, fórmula literal da fonte e cenário-padrão (especificação em ${V2}/extraction/instrumentos/instrumentos.json). **2.124 termos de glossário** com definição literal e módulo de origem. **214 exercícios** com resposta de referência. Um caso de decisão em 17 partes. Quiz e checklist por módulo. Isso é aparato pedagógico já escrito, e nenhum concorrente que você abrir vai ter equivalente.

O QUE O FOUNDER REJEITOU, E O QUE ELE MANDOU FICAR — leia os dois, porque a metade que fica muda tudo.
A v2 vestiu esse aparato numa metáfora cartográfica: atlas gravado a buril, ilhas, trilhas como território, rotas, bandeirolas, cartuchos, marcas de carta como vocabulário de interface inteiro. O Founder olhou e disse: "não estou gostando dos mapas e dos visuais at all; as trilhas, os caminhos não fazem muito sentido; os banners, as bandeiras e as coisas não estão legais".
**MAS ele foi específico sobre o que fica:** "eu ainda quero essa vibe, mas eu também quero algo moderno; ainda vou manter o globo e o atlas segurando, mas o resto podemos mudar."
Traduzindo em requisito:
· **FICA, e é a âncora de identidade:** a composição do herói — o Titã segurando o globo. Já existe, renderizada em Blender, com o globo impresso na mesma chapa gravada, e venceu a referência visual aprovada por 3x0 em julgamento cego. Está em ${V2}/captures/A/r09/home-E2-1440.png — **abra essa imagem antes de escrever qualquer coisa.** Não proponha tirá-la.
· **FICA: o caráter erudito.** A vibe de atlas, de publicação séria, de conhecimento com peso. Não virar startup de curso.
· **ENTRA COMO REQUISITO NOVO: moderno.** Não é opcional e não é tempero — ele pediu as duas coisas na mesma frase.
· **SAI:** a navegação cartográfica (trilha como território, carta, rota, ilha com estações), as bandeirolas e cartuchos como vocabulário de UI, e a premissa de que toda superfície precisa ser um objeto de atlas.
**A PERGUNTA CENTRAL DE DESENHO não é "tirar ou manter o atlas". É: como um herói clássico e ilustrado convive com um produto moderno, limpo e funcional — sem o clássico virar enfeite e sem o moderno virar template?**
**NÃO DEFENDA A v2.** Ela é contexto do que já foi tentado. Se a pesquisa concluir que a resposta é o oposto dela em tudo menos no herói, diga.

MÉTODO — vale para todos:
· **Abra os produtos de verdade.** Você tem navegador (mcp__Claude_Browser__*: preview_start com url, navigate, get_page_text, read_page, computer para screenshot e zoom) e busca web (carregue com ToolSearch "select:WebSearch,WebFetch"). **Não escreva sobre um produto que você só leu descrito.** Onde exigir login e você não tiver, diga e marque como segunda mão — nunca invente a experiência.
· **O Founder pediu explicitamente amplitude: "tem que entrar tudo possível".** Não pare no mínimo da sua lista — ela é piso, não teto. Quanto mais produto real aberto, melhor. Mas qualidade de observação acima de contagem: dez abertos com mecanismo descrito valem mais que quarenta listados.
· **Descreva mecanismo, não aparência.** "Tem um mapa bonito" não serve. "A navegação é lista linear única, sem hierarquia visível, e o 'onde estou' vem de um contador no topo mais o item destacado" serve.
· **Separe o que é bom do que é famoso.** Duolingo tem mais usuários que todo mundo e isso não torna a gamificação dele certa para currículo técnico de adultos.
· **Capture evidência.** Screenshots em ${DOCS}/capturas/<seu-eixo>/, com um .md dizendo o que cada uma prova. Imagem sem legenda do que prova não serve para nada.
· **Nada entra na Alexandria por esta pesquisa.** Escreva só dentro de ${DOCS}/. Não toque src/, public/, app/, tools/, git, nem a porta 5311.`

const S = { type: 'object', properties: { summary: { type: 'string' }, arquivo: { type: 'string' }, produtosAbertos: { type: 'array', items: { type: 'string' } }, naoAbertos: { type: 'array', items: { type: 'string' } }, mecanismos: { type: 'array', items: { type: 'string' } }, paraAlexandria: { type: 'string' }, contraindicacoes: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'arquivo', 'produtosAbertos', 'mecanismos', 'paraAlexandria'] }

phase('Pesquisar')
const eixos = await parallel([
  () => agent(`${CASA}
EIXO 1 — ORIENTAÇÃO E ESTRUTURA, SEM MAPA. Escreva ${DOCS}/01-orientacao.md.
A v2 usou cartografia para responder "onde estou, o que faço agora, o que mais existe". **Como os melhores produtos respondem isso sem desenhar território?**
Abra, no mínimo: Brilliant, Khan Academy, DataCamp, Coursera, edX, Codecademy, Exercism, Execute Program, Mathigon, Maven, Udemy, Pluralsight, O'Reilly, Frontend Masters, Josh Comeau, Educative, Boot.dev, Scrimba, Duolingo. Acrescente o que a busca mostrar.
Para cada um: como o currículo é apresentado (lista, árvore, grade, busca, nenhum)? como o learner sabe onde parou e o próximo passo? o que acontece quando volta depois de duas semanas? a hierarquia curso → módulo → aula é visível ou escondida? progresso como número, barra, estado por item, ou ausente? dá para pular? dá para procurar?
Compare: **lista linear × árvore × grade × busca como entrada principal.** Qual aguenta **17 módulos e 141 aulas** sem virar labirinto nem scroll infinito — o problema concreto da Alexandria.
Termine com as três melhores soluções de orientação, o custo de cada uma, e qual você usaria para 141 aulas de domínio técnico.`, { label: 'orientacao', phase: 'Pesquisar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
EIXO 2 — A AULA COMO UNIDADE. Escreva ${DOCS}/02-aula.md.
A Alexandria tem 141 aulas com prosa autoral densa, instrumento, exercícios com resposta de referência e termos de glossário. A v2 desenhou dez arquétipos de layout (${V2}/estudos/aulas/SISTEMA.md — leia, é estrutura que sobrevive à troca de visual).
Abra: Brilliant (a aula interativa), Khan (artigo + exercício), DataCamp (teoria + exercício no mesmo quadro), Codecademy, Execute Program, Exercism, Coursera, Mathigon, Josh Comeau, Educative, Scrimba, e qualquer curso técnico pago que conseguir ver.
Mecanismo: a aula é página longa, sequência de telas, ou ambiente? onde entra a interação — no meio do texto, ao fim, ou é a própria aula? o exercício é parte da aula ou vem depois? o feedback é imediato, após tentativa, ou nunca? dá para errar sem punição? quanto texto cabe antes de o produto exigir ação?
**Ponto decisivo:** compare **"ler e depois praticar" × "a prática É a aula"**. A v2 adotou o segundo. Isso se sustenta em 141 aulas? Quem faz bem, e quem tentou e voltou atrás?
Termine com a estrutura de aula que recomendaria, e o que ela implica para os dez arquétipos.`, { label: 'aula', phase: 'Pesquisar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
EIXO 3 — EXPLICAÇÃO INTERATIVA. Escreva ${DOCS}/03-interativo.md. **É o eixo mais importante.**
A Alexandria tem **165 instrumentos** especificados. É o ativo mais distintivo do produto, e a v2 o escondeu sob decoração cartográfica.
Estude com atenção: **Bartosz Ciechanowski** (ciechanowski.me — engrenagens, GPS, luz, som, relógios; a melhor referência existente), **PhET**, **Mathigon**, **3Blue1Brown** e explorables, **Nicky Case** (ncase.me), **Explorable Explanations** (explorabl.es), **Our World in Data** (grapher de energia — domínio idêntico), **Observable**, **Distill.pub**, **The Pudding**, **Desmos**, **GeoGebra**, **Falstad** (simuladores de circuito), **Setosa.io**, **Red Blob Games**. Acrescente o que achar.
Mecanismo: o controle fica no meio do texto ou em painel separado? o que o estado inicial ensina sozinho, antes de mexer? há previsão antes do resultado? número e figura mudam juntos? quantos controles por figura antes de virar painel? como rotulam unidade e fonte? o que acontece no celular?
**A pergunta que decide a Alexandria:** uma página com UM instrumento bem feito ensina mais que uma página com prosa e instrumento anexado? Como o Ciechanowski resolve texto-figura-controle, parágrafo a parágrafo?
Termine com: como os 165 instrumentos deveriam aparecer, e o que muda na aula se o instrumento virar o centro.`, { label: 'interativo', phase: 'Pesquisar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
EIXO 4 — CLÁSSICO E MODERNO NA MESMA PÁGINA. Escreva ${DOCS}/04-classico-moderno.md.
**Este eixo responde ao pedido literal do Founder:** manter o Titã e o globo, manter a vibe erudita, e ser moderno. O problema tem precedentes fortes **fora de educação**, e é lá que você vai buscar.
Abra e examine composição, tipografia e uso de imagem: **Stripe Press** (press.stripe.com — livros de capa clássica e sítio moderníssimo; a referência mais próxima do nosso caso), **Works in Progress**, **Asimov Press**, **Nautilus**, **Aeon**, **Noema**, **Lapham's Quarterly**, **Quanta**, **The Pudding**, **MIT Press**, **Phaidon**, **Taschen**, **Wellcome Collection**, **Rijksmuseum**, **The Met**, **Getty**, **Smithsonian**, **David Rumsey Map Collection**, **Public Domain Review**, **Internet Archive Scholar**, **Kew**, **NASA**. E do lado puramente moderno, para calibrar: **Stripe Docs**, **Linear**, **Vercel**, **Railway**, **Resend**, **Clerk**.
Mecanismo: como uma imagem clássica ou ilustrada convive com tipografia e layout modernos **sem virar colagem**? quem usa imagem grande e quem usa imagem rara? o clássico aparece como herói, como textura, como pontuação, ou como cor? o que acontece com a imagem no celular? que tipografia sustenta "sério" sem virar "antigo"?
**Teste concreto:** pegue três desses produtos, cubra o logotipo, e diga se ainda dá para reconhecer qual é. O que faz reconhecer.
Termine com **três direções visuais** para a Alexandria, cada uma descrita por mecanismo (tipografia, cor, densidade, papel da imagem, o que dá identidade) e **cada uma mantendo o Titã e o globo** — a diferença entre elas é o que acontece em volta dele.`, { label: 'classico-moderno', phase: 'Pesquisar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
EIXO 5 — O QUE A EVIDÊNCIA DIZ. Escreva ${DOCS}/05-evidencia.md.
Os outros eixos olham o que os produtos fazem. Este olha **o que funciona** — produto popular não é produto que ensina.
Pesquise a literatura aplicada a este caso (adulto, domínio técnico, autoestudo, 141 aulas): **prática de recuperação** (testing effect), **repetição espaçada**, **prática intercalada**, **carga cognitiva**, **exemplo trabalhado**, **feedback imediato × atrasado**, **previsão antes do resultado** (a Alexandria aposta nisso), **aprender fazendo × ler**, **efeito da segmentação**, e **abandono em curso online** — as taxas reais e o que as reduz.
Para cada achado: o que diz, qual a força da evidência, e **o que implica concretamente na tela**.
Depois confronte com o desenho atual (${V2}/bar.md §0, §4 e S3): a aposta de que **toda aula tem um ato**, a separação Percorrido/Praticado/Demonstrado, a recusa a gamificação que alega competência, a previsão registrada antes do instrumento. **Quais apostas a evidência sustenta e quais não?** Diga o desconfortável.
Termine com as cinco decisões de produto mais apoiadas pela evidência, em ordem de impacto, com o custo de construir cada uma.`, { label: 'evidencia', phase: 'Pesquisar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
EIXO 6 — VARREDURA DAS BIBLIOTECAS DE REFERÊNCIA VISUAL. Escreva ${DOCS}/06-galerias.md.
**O Founder pediu o Refero por nome** e pediu amplitude. Este eixo é a varredura sistemática das galerias — o lugar onde se vê muita interface real de uma vez.
Varra, no mínimo: **Refero** (refero.design — teardowns de produto real, foi usado na v2), **Mobbin**, **Land-book**, **Godly** (godly.website), **Awwwards**, **siteInspire**, **One Page Love**, **Lapa Ninja**, **Minimal Gallery**, **Curated.design**, **SaaS Landing Page**, **Httpster**, **Brutalist Websites**, **Dark Mode Design**, **Page Flows**, **Screenlane**, **UI Sources**, **Nicelydone**, **Navbar Gallery**, **Footer.design**, **The Component Gallery**, **Typewolf**, **Fonts In Use**, **Design Systems Repo**, **Codrops**. Acrescente o que achar.
**O que procurar — não navegue à toa:**
1. **Educação e conhecimento:** tudo que for curso, enciclopédia, documentação, arquivo, museu ou publicação. Como organizam muito conteúdo.
2. **Clássico + moderno:** qualquer caso de imagem ilustrada, gravura, pintura ou fotografia de arquivo dentro de produto moderno. **Este é o filtro mais importante** — é o problema do Founder.
3. **Padrões de orientação:** como produtos com muito conteúdo fazem índice, sumário, busca e "onde estou".
4. **O que NÃO fazer:** colecione também os tiques genéricos que se repetem em dezenas de sites. A v2 catalogou 38 deles em ${V2}/briefs/varredura-anti-ia.md — confirme quais continuam valendo e acrescente os que achar.
Onde a galeria exigir conta e você não tiver, diga e siga — há muitas abertas.
Entregue uma **folha de contato**: as 15 a 25 referências mais fortes, cada uma com captura, o que ela resolve, e se serve de precedente para a Alexandria. Qualidade de seleção vale mais que volume de links.`, { label: 'galerias', phase: 'Pesquisar', schema: S, effort: 'high' }),

  () => agent(`${CASA}
EIXO 7 — MOVIMENTO E DETALHE. Escreva ${DOCS}/07-movimento.md.
"Moderno" raramente é só estática: muitas vezes é **o que acontece quando se toca**. A v2 especificou um sistema de movimento (${V2}/estudos/movimento-e-conquistas/sistema-de-movimento.md) e nunca o integrou — então esta é terra livre.
Estude o movimento e o detalhe de interface em: **Linear**, **Stripe**, **Vercel**, **Arc**, **Family.co**, **Rauno Freiberg** (rauno.me), **Emil Kowalski** (emilkowal.ski — o melhor material de animação de interface que existe), **Paco Coursey**, **Josh Comeau**, **Motion/Framer Motion** (as docs de exemplos), **60fps.design**, **Apple** (a página de produto), **Readymag**, **Cosmos**, e qualquer produto educacional que use movimento bem.
Mecanismo: o movimento é transição de estado, de página, de foco, ou decoração? quanto dura? o que acontece com prefers-reduced-motion? o movimento ensina alguma coisa ou só agrada? onde o detalhe aparece — foco, hover, carregamento, transição, scroll?
**Para a Alexandria especificamente:** que movimento faz um instrumento ensinar melhor (o número e a figura mudando juntos, a previsão virando comparação)? e que movimento ajuda a navegar 141 aulas sem desorientar?
Termine com: o vocabulário mínimo de movimento que a v3 precisa, e o que é armadilha — o que parece moderno e é só barulho.`, { label: 'movimento', phase: 'Pesquisar', schema: S, effort: 'high' }),
])

phase('Sintetizar')
const SINT = { type: 'object', properties: { summary: { type: 'string' }, arquivo: { type: 'string' }, concordancias: { type: 'string' }, conflito: { type: 'string' }, caminhos: { type: 'array', items: { type: 'object', properties: { nome: { type: 'string' }, tese: { type: 'string' }, oQueMuda: { type: 'string' }, oQueAproveita: { type: 'string' }, custo: { type: 'string' }, risco: { type: 'string' } }, required: ['nome', 'tese', 'oQueMuda', 'oQueAproveita', 'custo', 'risco'] } }, recomendacao: { type: 'string' }, perguntasParaOFounder: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'arquivo', 'concordancias', 'conflito', 'caminhos', 'recomendacao', 'perguntasParaOFounder'] }
const sintese = await agent(`${CASA}
TAREFA — A SÍNTESE. Escreva ${DOCS}/CAMINHOS.md. Leia os sete eixos em ${DOCS}/ e **abra as capturas** que eles deixaram antes de escrever uma linha.
Eixos: ${JSON.stringify((eixos || []).filter(Boolean).map((x) => ({ a: x.arquivo, m: x.mecanismos, p: x.paraAlexandria, c: x.contraindicacoes }))).slice(0, 18000)}
1. **Onde os sete concordam.** Convergência entre orientação, aula, interatividade, identidade, evidência, galerias e movimento é sinal forte. Nomeie e diga por quê.
2. **Onde brigam.** Pelo menos um conflito real vai aparecer — provavelmente entre o que engaja e o que ensina, ou entre o clássico e o moderno. **Não concilie com diplomacia:** exponha o trade-off e diga qual lado você escolheria.
3. **TRÊS CAMINHOS para a Alexandria v3**, distintos de verdade — não o mesmo caminho em três intensidades. **Todos mantêm o Titã e o globo**, porque é requisito do Founder; a diferença é o que acontece em volta. Para cada um: tese em uma frase, o que muda na tela, **o que aproveita do que já existe** (específico: os 165 instrumentos, os 2.124 termos, os 10 arquétipos, as 107 imagens, o backend de progresso, o harness de captura, o auditor), custo em rodadas de construção, e risco. Pelo menos um tem de ser radical o bastante para assustar.
4. **Sua recomendação**, com o argumento. Você é o único que leu os sete juntos.
5. **O que precisa do Founder** — perguntas fechadas, com opções.
Regra: toda afirmação sobre um produto vem de quem o abriu. Se os eixos não abriram, diga que não abriram.`, { label: 'sintese', phase: 'Sintetizar', schema: SINT, effort: 'high' })

return { eixos, sintese }
