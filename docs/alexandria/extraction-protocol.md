# Alexandria — Protocolo de Extração de Módulo

> Referência permanente pra qualquer wave de extração de módulo do
> currículo. Consolida o que as Waves 4, 18, 19, 24, 25, 29, 30, 32, 34,
> 38, 41 e 42 já confirmaram por fechamento real — não é teoria, é o
> comportamento medido da fonte, várias vezes, em módulos diferentes.
> Todo brief de extração lê isto na Fase 1, em vez de reescrever a
> lista.
>
> Reconciliado de novo na Wave 48: extensões às Seções 5 (cobertura
> por token), 10 (transliteração mecânica) e 11 (a janela entre
> verificação e commit; blob sintetizado), mais a Seção 14 nova
> (contrato de renderização). Tudo derivado de fechamento real das
> Waves 43-46.
>
> Extensões na Wave 48: Seção 5 (cobertura por token, e descontar o
> markup de instrumento do denominador), Seção 10 (transliteração
> mecânica e o alvo do .innerHTML) e Seção 11 (a janela entre
> verificação e commit; blob sintetizado; índice velho mente).
>
> Reconciliado na Wave 43 a partir da versão da Wave 41: a numeração
> 1-11 abaixo é a canônica e briefs a citam por número (a Seção 11 é
> nova nesta reconciliação). As Seções 12-13 preservam material que a
> Wave 41 tinha e que o texto canônico não cobre.
>
> Wave 47 acrescenta: cobertura por PALAVRA na §5 (trecho contíguo dá
> falso negativo), transliteração mecânica na §10, quatro lições de
> concorrência na §11 (diff que mente, pathspec que não protege o
> intervalo, blob sintetizado, índice desatualizado) e a §14 nova —
> contrato de renderização, que vem dos Módulos 9/10/12 e 14.

---

## 1. Ilustração — nome de arquivo, nunca path

`illustrations` sempre recebe nome de arquivo puro
(`"his-01-usina-seculo-xix.png"`), nunca path completo. O componente de
renderização já prefixa `/alexandria/gravuras/` sozinho — gerar path
completo produz duplicação silenciosa
(`/alexandria/gravuras//alexandria/gravuras/…`, `naturalWidth: 0` sem
erro nenhum, o defeito real da Wave 29, que só apareceu na verificação
por clique). Confirma contra um módulo que já funciona antes de gerar o
campo, toda vez.

## 2. Frequência de termo nunca é veredito — sempre lê a frase real

Confirmado errado treze vezes, em módulos diferentes, sempre por
confiar em contagem de palavra:

**Gravura:** `Francis`→"Rio São **Francisco**" (não a turbina, Wave 19) ·
`Xingu,PA`→colide com "pá" de aerogerador (19) · "antes do **lítio**"→
figura de linguagem sobre reservatório (19) · `torre`/`isolador`→
enumeração de itens de custo, nenhum é o assunto (18) · `motor`→lista de
cinco equipamentos indutivos (5) · `turbina`→11+ ocorrências: hidráulica,
eólica, a gás e a vapor (19) · "**vazio**"→"esvaziar caixa d'água" (29) ·
"aprovação prévia do **Senado**"→cláusula de nomeação de diretor, não
tribunal (30) · "cres**cimento**"→casa com `cimento` (32) ·
"composição"/"decomposição"→operação analítica sobre base tributária, não
o objeto físico da pilha de moedas (41).

**Termo de glossário:** `Energia`→"leilão de **energia** nova" (34) ·
`Carga`→"**carga** líquida", sentido composto diferente (34) · `Carga`→
referência locacional, não o conceito do verbete (34).

Regra: sempre lê a sentença real onde o termo candidato aparece antes de
decidir correspondência. Contagem de ocorrência é sinal pra investigar,
nunca prova. Mapear só quando o objeto da gravura é o **assunto
declarado da seção**. Prefixo de catálogo casando só em parte com o
conteúdo é resultado normal (Módulo 08: 2 de 8; Módulo 09: 2 de 6), não
sinal de erro.

## 3. Instrumento — nome repetido não garante mesma mecânica

"Termômetro" já foi três coisas diferentes em três módulos (M05: 8
chaves booleanas com peso; M06: balanço numérico; M08: quadrante
estoque×fluxo). "Mapa" já foi duas (M05: 3 campos → posição num plano;
M06: seleção revelando texto de array).

**O teste mais difícil até agora:** o Módulo 10 teve um instrumento
chamado "Reconstrutor" com o mesmo verbo e a mesma pedagogia do
Reconstrutor do Módulo 8 — e **não era a mesma mecânica** (zero
referência, zero tolerância, botão de correção pertencia ao quiz, não ao
instrumento). Nunca presume mecânica pelo nome, nem quando nome, verbo e
intenção pedagógica parecem todos bater — inspeciona a marcação real
toda vez.

O risco inverso também existe: no Módulo 07, "Comparador de instrumentos
jurídicos" tem a **mesma forma de campo** que os seis `explorador` do
módulo — um `select`, zero saída numérica. Forma idêntica também não é
atalho seguro; o que separa os dois é a intenção declarada da fonte.

Instrumento pode viver fora de qualquer aula (padrão `§MAP`, primeiro
visto como `LAB·01` no Módulo 1) — vai pra Recursos do Módulo, não pra
aula nenhuma. Aula pode ter mais de um instrumento — recorde atual é
três (Módulo 7, Aula 7).

Saída textual (não numérica) é o padrão comum desde o Módulo 4, não
exceção — sempre confere se alguma saída não cabe em
`Record<string, number>` antes de considerar o mapeamento completo.

Condicional aninhada no script original não se lineariza sem testar ramo
por ramo depois, **por comparação, não por inspeção visual** — já quebrou
uma vez (Módulo 6, INST 07, ramo de baixa tensão executando quando não
devia; e o extrator de ramos da Wave 30 pegou só os `else if` e perdeu o
`else` terminal, que o `tsc` denunciou).

Se a mecânica real não couber em nenhum `kind` existente: confere
`docs/alexandria/instrument-taxonomy.md` primeiro. Se for genuinamente
nova (já aconteceu uma vez — `reconstrutor`, Módulo 8, "produz resposta
antes de ver correção"), generaliza por superconjunto documentado, com
autorização explícita se a extensão sair da posse original da wave.
Sinaliza pra FOUNDRY atualizar o catálogo depois — não deixa o documento
desatualizado.

## 4. Exercício sem vínculo de aula é o padrão desde o Módulo 4, não falha

Módulos 4, 6, 7, 8, 9 e 11 tiveram **zero** exercício com tag apontando
aula específica na fonte — todos foram pro bucket `SOLTOS`. Testa o
vínculo explicitamente (não presume que existe nem que não existe), mas
não estranha se o resultado for zero de novo.

Referência em prosa não é tag de posse: o Módulo 05 tem "é precisamente
o caminho híbrido descrito na Aula 06" no fecho de um gabarito, e mesmo
assim aquele exercício é solto — a tag dele não aponta aula nenhuma.
Varre os três campos (resumo, enunciado, gabarito).

Exercício solto vai pra Recursos do Módulo, junto com instrumento fora
de aula.

## 5. Contagem de bloco por aula — cobertura de texto, não contagem de elemento

O Módulo 8 quase perdeu 16 blocos reais porque uma aula destoou muito da
média das outras — contagem de elemento pegou isso. O Módulo 9 provou
que contagem de elemento sozinha **NÃO É SUFICIENTE**: todas as oito
aulas ficaram dentro de ±50% da média, zero sinal de alarme, e mesmo
assim uma aula tinha perdido **6.004 caracteres reais**. A causa:
contagem de elemento duplica os `<p>` que já vivem dentro de blocos tipo
`box`/`lv`, inflando artificialmente o número de aulas intactas e
escondendo a que não estava.

Os Módulos 10 e 11 confirmaram de novo — em ambos, mais da metade das
aulas caiu abaixo de 85% de cobertura real, recuperadas depois de
identificar a estrutura descartada (`div.fi`, `div.chain`/`cbox`,
`div.lv`, `div.form`, `p.srcnote`, `<ol>`).

| módulo | pior aula, cobertura inicial | final |
| --- | --- | --- |
| 09 | 57,5% | 95,6% |
| 11 | 61,9% | 99,8% |

**A medida correta é cobertura de texto real** — quantos caracteres da
fonte sobreviveram na extração, não quantos elementos foram contados.
Mede cobertura de texto por aula na Fase 1, antes de aceitar qualquer
contagem como final. Aula abaixo de ~85% de cobertura precisa de
investigação — geralmente é estrutura nova que o extrator ainda não sabe
capturar. Cobertura saudável fecha em 90-99%; o resíduo é pontuação de
aparato e normalização de entidade.

**Cobertura por trecho contíguo produz falso negativo quando a extração
fragmenta a fonte em blocos separados** — `<h3>` seguido de `<p>` na
fonte vira `titulo` + `paragrafo` na extração, então a string
concatenada que o medidor procura nunca existe no resultado, mesmo com o
conteúdo inteiro presente. **Cobertura por palavra é a medida imune a
isso** — confirmado no Módulo 13, onde cinco aulas pareciam em 78-81% de
perda real e na verdade estavam em 98-99% depois de medir por palavra em
vez de trecho.

Regex simples não dá conta de estrutura aninhada — usa walker de árvore
de DOM real quando a perda for identificada. Regex não-guloso fecha no
lugar errado em `div` aninhada (lição do Módulo 04).

**Cruzamento por três sinais independentes.** Contagem bruta de seção
superestima: `.aula` era classe compartilhada entre aula real e aparato
(§ Lex, § Ex, § Quiz…), e `sec-id` também é. Cruza sempre: **seções que
casam `Aula NN`** × **a prosa do hero / § MAP** × **numeração de
subseção `x.y` da própria fonte**.

Quando prosa e markup divergem, **o markup vence** e a divergência é
registrada, não corrigida. Precedentes: Módulo 01 ("seis dos oito", há
8), Módulo 02 ("Oito exercícios", há 10), glossário do Módulo 01 ("Vinte
e oito termos", há 38).

**A medida é por TOKEN, não por trecho contíguo.** Medir cobertura
procurando trechos contíguos da fonte no extraído produz **falso
negativo sistemático**: a extração quebra o texto em blocos, então um
`<h3>` seguido de `<p>` vira `titulo` + `paragrafo` e qualquer trecho
que atravesse a fronteira dos dois não casa em lugar nenhum. Cinco aulas
do Módulo 13 mediram 78-81% por trecho contíguo e 98,4-99,5% por
palavra, com a extração idêntica — o defeito era do medidor. Conta token
com baixa: cada palavra da fonte precisa de uma palavra correspondente
no extraído, consumida uma vez.

**Desconta o markup dos instrumentos do denominador.** Instrumento não
vira bloco de apostila; deixá-lo no denominador rebaixa a cobertura de
toda aula que tenha um, e esconde perda real atrás de um número baixo
que se explica sozinho.

## 6. Vocabulário de classe — nunca presume, mede toda vez

Confirmado: Módulos 1-3 usam um vocabulário (`aula-marker`,
`exercise-tag`, `glossary-item`); Módulos 4 em diante usam outro
inteiramente (`sec-id`, `lede`, `inst`, `det-bd`, `lv`), com variação de
detalhe entre módulos dentro desse grupo (posição do id, forma do
exercício).

E o vocabulário abreviado tem variação interna: o callout do Módulo 04 é
`class="box"`; no Módulo 05 é `class="box gd"` — varredura exata por
`class="box"` daria zero e perderia os oito. O Módulo 11 inverte duas
coisas de uma vez: `sec-id` põe o negrito no nome (`§Ex ·
<b>Exercícios</b>`) em vez de no marcador, e `inst-hd` põe o `span.id`
antes do `span.nm`.

Testa os seletores conhecidos contra o arquivo real antes de escolher
extrator — se nenhum bater, remapeia do zero.

## 7. Catálogo real, nunca suposição

`level`, `track`, `illustrationPrefix` e até o **título** sempre
confirmados no catálogo real da FOUNDRY antes de qualquer extração —
nunca herdados do padrão do módulo anterior.

Título com `priority: 'confirmar'` pode genuinamente divergir da fonte
real (Módulo 11: catálogo trazia "Energia Solar e Análise de Propostas",
fonte declara "Geração Distribuída e a Anatomia de uma Proposta Solar" —
escopo mais amplo, não sinônimo). `illustrationPrefix` pode casar só
parcialmente com o conteúdo real, ou ser `null` com zero `<img>` no
markup, os dois sinais concordando (Módulo 11).

Não força correspondência fraca — reporta cobertura real, mesmo se
baixa. Divergência de catálogo se registra, nunca se corrige (arquivo
fora de posse) — vira pendência FOUNDRY.

## 8. Git — pathspec sempre, verificação nunca encadeada na ação

`git commit <paths exatos> -m "..."` sempre — nunca `git commit`
sozinho, nunca `git commit -a`, nunca `git add -A`. O index é
compartilhado entre sessões; commit sem pathspec leva tudo que está
staged no momento, não só o que a sessão atual adicionou. O commit
`f955e62` carregou dois arquivos de outra sessão por causa disso.

Verificação antes de commit é passo separado, nunca encadeado (`&&`) na
mesma linha que a ação que ela deveria proteger.

## 9. Gate de build — sempre escopado

`tsc -b`, nunca `tsc --noEmit` — o tsconfig raiz não typecheca os
arquivos da app (nota da Wave 3). Reporta sempre como "zero erros nos
arquivos da wave, X pré-existentes fora dela" — nunca "0 erros" sem essa
qualificação. Os pré-existentes de Recharts em `nest/student/*` não são
de wave nenhuma de extração.

`gridalpha-detect` sobre os arquivos da wave, 0 P0.

## 10. Fidelidade — porta, nunca rederiva

Lógica de cálculo sempre portada do script original, nunca reescrita "de
forma equivalente". Confirma contra reimplementação independente ou
**execução do script original em DOM simulado** (método mais forte,
Waves 34, 38 e 42). Bug ou resíduo do original se sinaliza, nunca se
corrige silenciosamente — o `|| 1` que faz campo vazio virar 1, o preset
que reescreve campo alheio, a numeração `INST · NN` que não bate com o
prefixo dos ids internos.

Onde o espaço de entrada é finito e pequeno, **cobre o espaço inteiro**
em vez de amostrar (Wave 38: 96 e 36 combinações exaustivas).

Texto de veredito com interpolação numérica se transcreve por extração
programática, não digitação — 62,6 mil caracteres de prosa num módulo só
(11) é volume onde erro de digitação é certeza estatística.

**Para instrumento computacional com saída em texto, transliteração
mecânica supera porte por leitura.** Reescreve só as chamadas de DOM do
script original, deixa lógica e prosa completamente intocadas — o texto
verbatim nunca passa pelo teclado de quem porta. Confirmado expondo erro
que porte por leitura não pegaria (cabeçalho digitado errado, pontuação
acrescentada a rótulo que a fonte trata como título) — achado só porque a
prova rodou contra o espaço de entrada inteiro, não amostra.

**Nota de método (Waves 38 e 42):** toda falha de fidelidade investigada
até a causa se provou **defeito do harness de teste**, nunca da porta —
tipicamente chamar a calculadora com entrada vazia quando o painel
sempre semeia os `defaultValue`, ou contar elementos que não são os do
alvo (as gravuras `orn-` do rodapé entrando na contagem de gravura de
aula).

**Transliteração mecânica quando o veredito tem interpolação.** Reescreve
só as chamadas de ambiente do original (`$id(x).textContent = E` → `OUT[x] = E`,
`$id(x).innerHTML = E` → `VER = E`, `numOf`/`segVal` → leitores do mapa de
entrada) e deixa **lógica de ramo e prosa intocadas**. Um verificador
confirma resíduo de DOM zero antes de emitir. É o que torna possível
portar 30 mil caracteres de veredito sem que nenhuma palavra passe pelo
teclado (Wave 43).

**Cuidado com o alvo do `.innerHTML`.** A regra "todo `.innerHTML` vira
veredito" quebra quando a fonte usa `.innerHTML` num readout comum — o
valor era sobrescrito e a saída sumia da tela (Wave 43, INST 05 do
Módulo 11). Discrimina pelo id (`*-vd` → veredito), não pelo método.

## 11. Backup local fica obsoleto no instante em que outra sessão escreve — verifica antes de restaurar

Um backup tirado no início de uma operação **não é garantia contra
sessão paralela** — ele reflete o arquivo no momento em que foi tirado, e
uma sessão concorrente pode escrever no mesmo arquivo logo depois, sem
aviso nenhum.

Restaurar por cima desse backup sem checar o estado real do arquivo **no
momento da restauração** já apagou 494 linhas não commitadas de outra
wave (Wave 42 sobre a Wave 41) — recuperado só porque a sessão atingida
tinha os próprios artefatos salvos em scratchpad e o diff exato ainda
batia.

Antes de qualquer restauração de arquivo compartilhado: `git diff
--stat` **real, agora**, no arquivo — nunca confia no que o diff mostrava
quando o backup foi tirado. Se o arquivo mudou desde então, a restauração
exige reconciliação de três vias (`git merge-file` ou equivalente), nunca
sobrescrita direta.

Corolário: `cp arquivo backup && operação` numa árvore com sessão
paralela ativa é a própria armadilha — o `&&` cria a janela. Faz a
leitura de estado como passo separado, imediatamente antes da escrita.

**O tamanho do diff também pode mentir.** Um diff de milhares de linhas
pode ser quase inteiro ruído de fim de linha, não mudança real — já
aconteceu (6.477 linhas brutas, 83 reais, medido com
`-w --ignore-cr-at-eol` antes de decidir qualquer ação). Se o merge de
três vias falhar porque o arquivo inteiro aparenta estar em conflito,
isso é sintoma de ruído de fim de linha — troca pra patch por âncora de
texto, não por número de linha. Depois de qualquer restauração, confirma
por `git show --numstat` no próprio commit antes de concluir que algo foi
perdido — inserção pura é evidência real, mais forte que suposição.

**Pathspec protege contra pegar staged alheio, mas não contra o próprio
path mudar entre verificação e commit.** `git commit <path>` lê o estado
do arquivo no disco no instante em que o commit executa, não o que foi
verificado momentos antes — sessão paralela pode escrever no mesmo path
nesse intervalo e o commit captura o dela, não o seu (já aconteceu:
commit rotulado "instrumento 04" continha trabalho de outra wave e não
continha o INST 04). A defesa é rodar escrita, gates de verificação e
commit como sequência única e guardada, sem passo separado com espaço pra
escrita alheia entre eles — aborta em qualquer falha em vez de seguir pro
próximo passo.

**Se a sessão paralela está reescrevendo o arquivo compartilhado mais
rápido do que dá pra ler-modificar-escrever com segurança** (diagnóstico:
duas leituras seguidas do mesmo trecho voltam diferentes), não toca mais
o arquivo de trabalho — constrói o blob alvo direto via
`git hash-object` a partir do HEAD atual mais só a própria inserção, e
estagia com `git update-index --cacheinfo`, sem escrever na árvore em
momento nenhum. Verifica antes de commitar que o blob contém o trabalho
alheio já commitado e zero linha removida.

**`git status`/`git diff --stat` também pode acusar arquivo modificado
sem mudança real nenhuma** — índice desatualizado com normalização de fim
de linha pendente produz o mesmo sinal que trabalho real de sessão
paralela. `git update-index --refresh` resolve; confirma antes de stashar
ou reagir como se fosse colisão real.

**A janela não é só entre backup e restauração — é entre verificação e
commit.** `git commit <path>` captura o estado do arquivo **no instante
do commit**, não o que foi verificado antes dele. Rodar diff, build,
teste e detect e só então commitar deixa a janela aberta o tempo todo:
o commit `6e41144` saiu com trabalho de outra wave sob a mensagem
errada exatamente assim. A sequência tem que ser **guardada e sem
round-trip** — um script que escreve, roda os gates, confere que o diff
não carrega linha de outra wave, e commita, abortando em qualquer falha.

**Quando a escrita paralela for rápida demais para ler-modificar-escrever
com segurança, não reconcilia: sintetiza.** Aplica a inserção na árvore
de trabalho de forma ADITIVA (ao lado da alheia, sem sobrescrever) e
estagia um blob construído a partir do `HEAD` corrente mais **somente a
própria inserção**, via `git hash-object -w` + `git update-index
--cacheinfo`. A árvore de trabalho nunca é tocada, então nada em voo se
perde, e o commit não carrega trabalho alheio. Verifica sempre, como
passo separado, que o staged tem **zero deleção** e nenhuma linha
adicionada pertencente à outra wave (Wave 46, com o HEAD mudando duas
vezes durante a wave).

**Índice velho mente.** `git status` pode acusar dezenas de linhas
modificadas que são só normalização de fim de linha pendente, não
trabalho alheio. `git update-index --refresh` antes de concluir qualquer
coisa — senão a reação é stash ou reconciliação sobre nada (Wave 46).

---

## 12. Limitações de contrato conhecidas

Registrar, não contornar:

- **Saída textual não cabe em `valores`.**
  `ResultadoInstrumento.valores` é `Record<string, number>`, então mês,
  quadrante, nome de usina marginal, veredito categórico e nome de norma
  ficam de fora. Seis waves de evidência (19, 24, 25, 29, 38, 42). O
  veredito literal costuma carregá-los em prosa.
- **Desenho não porta** — SVG, pizza, mapa, calendário, gráfico de
  barras. O conteúdo numérico e textual deles entra como saída ou
  veredito; descartá-lo seria a perda silenciosa da Seção 5.
- **`durationMinutes`, `difficulty`, `video` são `null` MEDIDOS.** Zero
  `<video>`, `<iframe>`, youtube, vimeo, `.mp4` — medir, não herdar dos
  módulos anteriores.
- **Campo `number` pareado com `range` gêmeo** (`<algo>` + `<algo>-r`) é
  UM campo lógico. Fica o `number`, que carrega value/min/max/step; o
  `kind` vira `range` quando o deslizador existe.

## 13. Verificação e ambiente

**Verificação por clique real**, com `naturalWidth` lido no DOM — não
presença de tag. Instrumento sem `NaN` no primeiro paint. Regressão nos
módulos já fechados a cada wave.

**Medir `window.innerWidth` antes de acreditar em qualquer medida de
layout**: o painel Browser pode nascer 0×0 com `visibilityState:
hidden`, o que faz toda largura medir 0 e o `IntersectionObserver` do
lazy nunca disparar (Wave 39). Isso produz falso positivo de "gravura
quebrada" que parece regressão e não é.

Fallback que funciona quando o painel não compõe frames:
`playwright-core` no scratchpad dirigindo o Chrome do sistema com
`--enable-unsafe-swiftshader`, servidor próprio em porta dedicada
declarada no `.claude/launch.json`.

## 14. Contrato de renderização — qual campo aceita HTML e qual não aceita

Nem todo campo de `AulaBloco` passa por `dangerouslySetInnerHTML`.
Preservar HTML inline da fonte num campo que o painel renderiza como
texto puro faz a tag **aparecer literal na tela** — e é defeito que
leitura de código não pega, só verificação por clique (Wave 46: as sete
fórmulas do Módulo 14 mostrando `<b>não equivale</b>` como texto).

Medido em `ApostilaPanel.tsx`:

| campo | renderização |
| --- | --- |
| `paragrafo.html` | **HTML** |
| `nota.html` | **HTML** |
| `lista.itens[]` | **HTML** |
| `tabela.linhas[][]` (células) | **HTML** |
| `formula.eq` | texto puro |
| `formula.desc` | texto puro |
| `titulo.texto` / `titulo.numero` | texto puro |

Regra: campo de texto puro recebe `texto()` (tags removidas); campo de
HTML recebe `inline()` (só as tags de estrutura removidas, o inline
preservado). Confere na tela depois de extrair — a varredura é
`/<b>|<\/b>|&lt;/` no `innerText` da aula, e tem que dar zero.

Fora da apostila vale o inverso: o veredito de instrumento **passa** por
HTML desde a Wave 34 — ali o inline da fonte se preserva, não se remove.

## 15. Par chave-valor vai para `nota`, nunca para `tabela`

O componente `Tabela` trata a primeira linha como `<thead>`, **sempre**.
Numa estrutura de par chave-valor a "primeira linha" é dado real, então
mapear para `tabela` consome um par como cabeçalho — ou obriga a
inventar um cabeçalho que a fonte não tem. Confirmado afetando os
Módulos 08, 09, 10 e 12, cujas fichas (`src-card`, `fi`) já estão no ar
com o primeiro par promovido a cabeçalho: não há perda de texto, só de
hierarquia visual, e corrigir é wave própria.

Estrutura nova identificada como par chave-valor mapeia para `nota`
(label + html), que é exatamente o que modela rótulo mais prosa —
decisão da Wave 47 para os `gcmp`, `tax` e `dual` do Módulo 12 e para
os `par-col` do Módulo 15. `tabela` fica para o que a fonte escreve
como tabela de verdade, com cabeçalho próprio.
