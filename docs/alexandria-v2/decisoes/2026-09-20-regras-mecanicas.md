# Regras mecânicas da Alexandria — o que saiu do olho e virou gate

**Data:** 2026-09-20
**Origem:** os doze veredictos da rodada r09 (quatro peças × três critics: um PASS, onze FAIL).
**Onde vive:** `tools/gridalpha-detect/src/rules/alexandria-*.ts`, catalogadas no
[`README` do auditor](../../../tools/gridalpha-detect/README.md#the-alexandria-rule-family-alexandria-).
**Escopo:** `src/**/alexandria*` e `src/design/alexandria-tokens.ts`. Nenhuma delas roda no resto da árvore.

---

## O problema de método

Três dos onze FAIL da r09 **já tinham sido declarados e corrigidos numa rodada anterior** e voltaram
numa superfície nova:

- a "caixa default" e o "círculo de formulário" foram corrigidos na r07 — e renasceram na prancha do
  Laboratório na r09;
- o vocabulário interno foi apagado de uma superfície — e reapareceu na página de módulo.

O diagnóstico do Craft foi literal: *"é o mesmo erro da r07: corrigir por superfície e não por sistema."*

A causa não é falta de cuidado. É que **memória de agente não segura regra.** Uma regra que depende de
alguém lembrar dela sobrevive a uma rodada, talvez duas. Uma regra que roda no `gridalpha-detect`
sobrevive indefinidamente, e sobrevive a troca de agente, de sessão e de contexto.

Esta decisão transforma em gate mecânico a parte auditável desses veredictos — e, tão importante
quanto, **escreve o que continua dependendo de olho**, para que uma rodada verde do auditor nunca seja
confundida com uma peça aprovada.

---

## Qual achado humano virou qual regra

| Achado r09 | Regra | Severidade | O que ela vê |
|---|---|---|---|
| **(3)** A página de módulo imprime "§ 00", "§ MAP", "§ Caso", "§ Lab", "§ Drill", "§ Quiz", "§ Final", "§ Lex", "§ Ref", a palavra "EXTRAÇÃO" e a marca morta "GRIDALPHA" | `alexandria-no-internal-vocabulary` | **P0** | Vocabulário interno de S4 + marca de P24 em **texto visível ao learner**: nó de texto JSX, atributo de rótulo (`aria-label`, `title`, `alt`, `placeholder`…), literal de string sob uma **chave de conteúdo** (`titulo`, `rotulo`, `texto`, `html`, `marcador`, `secao`, `eyebrow`, `nota`, `atribuicao`…) e literal usado direto como filho JSX |
| **(4)** "caixa default" + "círculo de formulário" renascendo; seis sliders de trilho chapado com botão circular | `alexandria-no-native-range` | **P0** | `<input type="range">` sem tratamento da casa declarado |
| **(4)**, mesma causa | `alexandria-no-form-circle` | **P1** | Círculo **preenchido** com conteúdo de 1–2 caracteres — avatar com inicial, bolha de passo |
| **(4)**, mesma causa | `alexandria-no-default-control-box` | **P1** | Controle (`<button>`, `<input>`, `<select>`, `<textarea>`, `role="button"`, `onClick`) fechado pelo atalho `border:` nos quatro lados, sem exceção declarada |
| **(4)** "as duas regras de sistema quebraram de novo, numa superfície nova" — o S2 aplicado por sistema e não por superfície | `alexandria-materialidade` | **P0** | `boxShadow` ≠ `none`; `borderRadius` fora de `{0, AR.none, 50%, AR.circulo}` (inclusive `rounded-*` do Tailwind); `linear-/radial-/conic-gradient` **com rampa de cor** |

### Por que P0 onde é P0

`alexandria-no-internal-vocabulary` e `alexandria-materialidade` correspondem a **hard gates do §6 do
bar** — "Ausência desonesta → linguagem interna (S4)" e "Materialidade quebrada: raio, sombra,
gradiente, vidro ou brilho". O bar já reprova a peça; o auditor só antecipa o veredicto. Os mesmos
invariantes estão no `AGENTS.md` como valendo para os três sistemas de design da casa.

`alexandria-no-native-range` é P0 por um motivo diferente: um range nativo entrega o botão ao agente de
usuário, que pinta um círculo com bisel diferente em cada sistema operacional — a materialidade de S2
deixa literalmente de ser nossa. A checagem não tem julgamento nenhum dentro (o elemento existe ou não
existe) e é exatamente a recorrência r07 → r09. Bloqueia.

### Por que P1 onde é P1

Os dois P1 não foram rebaixados por ruído medido — foram rebaixados porque **a forma sozinha não prova
o defeito**:

- `alexandria-no-form-circle`: o S2 permite círculo pleno. O que denuncia o produto genérico é o
  círculo **preenchido com uma inicial**, e mesmo isso pode ser a resposta certa em alguma composição.
  O gate estreita a busca; quem decide é o critic.
- `alexandria-no-default-control-box`: o S2 faz do fio de 1px a **única** linguagem de profundidade da
  casa (*"profundidade só por fio de 1px ou troca de superfície"*). `border: 1px solid` é vocabulário
  legítimo, usado corretamente ~35 vezes nesta árvore em figuras, seções e tooltips. Uma regex estática
  não separa "moldura que se justifica" de "default do framework". Bloquear nisso seria desonesto.
  Ela avisa, e a saída boa não é a diretiva: é **declarar a exceção no próprio elemento**
  (`data-moldura`, `data-tratamento`, `data-caixa`, `data-excecao`), porque a diretiva esconde o achado
  do auditor e o atributo mostra a escolha ao próximo leitor.

### Extensão, não duplicação

Dentro do escopo Alexandria, `alexandria-materialidade` **substitui** `no-box-shadow-on-cards` (P1, só
cards) e `no-gradient-text` (P0, só `background-clip`) — as duas passaram a sair cedo em caminhos
Alexandria. A cláusula de S2 é estritamente mais ampla que ambas, e assim uma linha é reportada uma vez
só, na severidade que o bar da Alexandria atribui. `no-pill-chip-default` **não** foi isentada: S2
permite o círculo de 50%, que aquela regra continua julgando no contexto dela.

---

## O escopo é a regra, não um detalhe

As cinco regras nunca reprovam a árvore inteira. Medida do ruído, rodando as mesmas cinco com o guarda
de escopo desligado sobre `src/` (758 arquivos):

| | Achados |
|---|---|
| Total sem escopo | **1 435** |
| Dentro da Alexandria | 301 |
| **Fora da Alexandria (ruído)** | **1 134 — 79%** |

| Regra | Ruído fora do escopo |
|---|---|
| `alexandria-materialidade` | 924 |
| `alexandria-no-default-control-box` | 142 |
| `alexandria-no-internal-vocabulary` | 53 |
| `alexandria-no-native-range` | 11 |
| `alexandria-no-form-circle` | 4 |

Esse ruído **não é bug**: é código legítimo do terminal americano julgado por um bar que não o governa
— os tokens de raio `R.sm`/`R.md` do terminal, a marca viva da empresa na landing, controles com
moldura que são vocabulário do terminal. É por isso que `isAlexandriaFile()` existe como definição
única, e por isso `src/components/vault/Alexandria.tsx` (com `A` maiúsculo — a superfície antiga do
Vault) fica deliberadamente **fora**.

**Dentro do escopo, o falso positivo medido é zero.** Os 301 achados foram revisados um a um por
amostragem de chave proprietária: nenhum caiu em comentário, em regex, em caminho de import ou em chave
de dado. As chaves que dispararam são todas renderizadas — `c.nota` sai em
`<LinhaDeAparato texto={c.nota} />`, `t.marcador` sai no parágrafo de aparato da tese, `html:` é o
corpo da aula.

---

## O que o auditor pegou hoje (r09, árvore como está)

`node tools/gridalpha-detect/bin/gridalpha-detect.mjs src`

**301 achados** — 281 P0, 20 P1. Nada foi consertado: os builders desta rodada consertam, e é
justamente isso que prova que a regra funciona.

| Regra | Achados | Onde |
|---|---|---|
| `alexandria-no-internal-vocabulary` | **280** (P0) | `dossieModulos.ts` 188 · `alexandria-modulo-*-content.ts` 88 (13, 12, 8, 8, 6, 6, 6, 5, 5, 4, 4, 3, 2, 2) · `GlossarioView.tsx:92` · `PaisPerfil.tsx:267` · `BibliotecaView.tsx:282` · `PerfilStub.tsx:141` |
| `alexandria-no-default-control-box` | **20** (P1) | `Modulo08Game.tsx` 10 · `InstrumentPanel.tsx` 3 · `AtlasGlobo.tsx` 2 · `AtlasStub.tsx` 2 · `PaisPerfil.tsx` 1 · `GloboCurriculo.tsx` 1 · `AulaViewer.tsx` 1 |
| `alexandria-no-native-range` | **1** (P0) | `InstrumentPanel.tsx:584` — o slider do instrumento, exatamente o da prancha do Laboratório |
| `alexandria-materialidade` | **0** | A Alexandria está disciplinada hoje em raio, sombra e gradiente. Regra de futuro: existe para a próxima superfície, não para esta |
| `alexandria-no-form-circle` | **0** | Idem |

Dos 280 do vocabulário: **125** são `marcador:` e **35** são `secao:` no dossiê (os códigos § que a
folha do módulo imprime), **95** são a marca morta `GridAlpha` — 75 deles em prosa curricular de
`src/lib/data/`, que é a troca editorial peça a peça já prevista no `HANDOFF.md`.

Duas regras com zero achados não são regras fracas. São o ponto inteiro do exercício: a r07 também
tinha zero na superfície que ela consertou, e a r09 nasceu com o defeito numa superfície nova. Agora a
superfície nova encontra o gate antes de encontrar o critic.

---

## O que continua dependendo de olho

O auditor lê texto, não render. Oito dos onze FAIL da r09 **não viraram regra e não podem virar**.
Fica escrito para que uma rodada verde nunca seja lida como peça aprovada:

| Veredicto r09 | Por que não vira gate |
|---|---|
| **(1)** A ação e o estado pessoal não sobrevivem à primeira dobra — "CONTINUAR · M01·A08" a ~1374px de uma página de 2624px; o 1º viewport do módulo a 390 terminando no meio do parágrafo da tese | **Composição e posição de dobra.** Precisa de render num viewport. |
| **(2)** Destinos falsos — o painel nomeia "Explorador · Camadas da rede" enquanto o mapa declara ausência para o mesmo módulo no mesmo estado | **Coerência de dado contra dado entre superfícies.** O auditor não tem modelo do que cada superfície promete. Candidato a um teste de consistência de dados, não a uma regra de padrão. |
| **(5)** O vocabulário de estado não é um sistema só entre superfícies — "a seguir" na Home × "NÃO INICIADO" na carta, mesma sessão, mesmo E2 | Idem. Acordo entre duas superfícies em tempo de execução. |
| **(6)** Emenda vertical dura em x=624; painel de texto virando campo creme chapado encostado na gravura | **Layout, medido em pixels.** |
| **(7)** O campo de previsão da aula recebe foco sem indicador visível, a 1440 e a 390 | **`:focus-visible` em tempo de execução** — é do laço Playwright, não do estático. |
| **(8)** O véu rompido: a resposta dentro do enunciado (M01·A08, Ato 2) | **Semântica de conteúdo.** Lição L2 do `SISTEMA.md`; continua sendo leitura humana. |
| **(9)** A dobra de entrada da aula não tem matéria; a coluna morre ~280px antes do trilho | **Presença e densidade.** |
| **(10)** Três faixas de localização a 390; alvo de 276×17px com tipografia de 10px | **Geometria computada.** Mensurável, mas por render — não por texto. |

**Composição, hierarquia e presença não são auditáveis estaticamente.** Esta família compra de volta
exatamente a parte que é: **vocabulário e materialidade** — as duas que voltaram duas vezes.

---

## Como manter

- `tools/gridalpha-detect/fixtures/alexandria/fixture.tsx` tem uma violação sintética por cláusula e
  dez blocos CLEAN que precisam continuar mudos. Depois de mexer em qualquer regra `alexandria-*`:
  `node bin/gridalpha-detect.mjs fixtures --no-fail-on-p0` → 16 P0 + 3 P1, nada abaixo do divisor.
- `npx tsc -p tools/gridalpha-detect/tsconfig.json --noEmit` limpo.
- A linha de base declarada no `AGENTS.md` ("0 P0 / 27 P2") está defasada em dois eixos: os P2 do
  `equal-weight-grid` hoje são 41, e a árvore passa a ter 281 P0 do escopo Alexandria. Atualizar essa
  linha é posse do ARCHITECT; esta wave não tocou o `AGENTS.md`.
- O `.husky/pre-commit` **não está instalado** nesta árvore. O CI calcula o conjunto de arquivos
  alterados, então os 281 P0 pré-existentes não bloqueiam commit alheio — bloqueiam quem tocar naqueles
  arquivos. É o comportamento desejado: a dívida sai peça a peça, e ninguém acrescenta dívida nova.
