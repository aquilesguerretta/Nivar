# Portal do Operador — Wave 2, Fase 1 · contratos e propostas

**Wave:** ARCHITECT — Portal do Operador Wave 2. **N confirmado:** a
trilha tem exatamente dois commits de Wave 1 — `1baba6e` (CURSOR, recon
de backend) e `31179d8`/`412a130` (ARCHITECT, recon de frontend), ambos
recon. Nenhuma Wave 2. Os outros commits com "operador" na mensagem
(`875d765`, `a9212de`, `a85d405`) são da trilha **Diagnóstico**, não
desta.

**Worktree:** `C:\dev\gridalpha-v2-operador-console`, branch
`wave/operador-console`, de `feature/full-shell-buildout` em `412a130`.
`.env.local` e `.claude/settings.local.json` copiados; `npm ci` rodado —
esta wave constrói, então precisa dos dois (ao contrário da Wave 1, que
era só leitura).

**Fonte primária:** `docs/operador-recon-frontend.md`, incluindo o adendo
de cruzamento com `docs/operador-recon-backend.md`.

**Esta fase não escreve código de produto.** Só mede e propõe.

---

## Veredito curto

| Hipótese | Achado |
| --- | --- |
| H1 · Estrutura de `data.css` e convenção de porte | **Convenção confirmada e idêntica à de `campos.tsx`:** folha injetada por componente, CSS verbatim, montada por `<Estilos… />`. E o achado que destrava tudo: **os 24 tokens que os blocos de console usam já existem em `src/design/nivar/` — zero token novo.** |
| H2 · Quanto dos 104 blocos o console usa | **36 de 104** (`.nv-tab` 20 · `.nv-ord` 10 · `.nv-frescor` 6), mais **16 de `states.css`**. Os outros 68 ficam no skill, cada um com razão declarada. |
| H3 · Onde `/operador` entra em `main.tsx` | **Sem colisão.** Entra como splat entre `/us` (`:161`) e o catch-all (`:173`). O `NotFound` da Portal Debt Wave 1 é o último `<Route>` e não é tocado. |
| H4 · Forma dos três detalhes | **Proposta abaixo (§4), três formas genuinamente diferentes, cada uma derivada de fato medido — não de gosto.** Aguarda o Aquiles antes da Fase 5. |

**Achado que muda a Fase 4:** o sistema **já tem** o vocabulário de "este
dado não é real" — `.nv-frescor--ilustrativa` renderiza **AMOSTRA
ILUSTRATIVA** sublinhado no acento Advisory. Não preciso inventar
marcação de mock; é a linguagem que o `AGENTS.md` manda usar quando não
há fonte ("ausência se declara, nunca se preenche por plausibilidade").

---

## 1. H1 — estrutura de `data.css` e a convenção de porte

### 1.1 A convenção, medida em dois precedentes

`src/components/nivar/campos.tsx` e `src/components/br/portalChrome.tsx`
fazem a mesma coisa, e é o que vou seguir:

| Traço | Como é |
| --- | --- |
| Onde mora o CSS | string dentro de `.tsx`, **não** arquivo `.css` |
| Como monta | `<EstilosCampos />` (`campos.tsx:48`) / `<style>{FOLHA_PORTAL}</style>` (`portalChrome.tsx:108`) |
| Fidelidade | **verbatim**, sem um valor alterado |
| Escopo | classe (`.nv-*`), nunca elemento global — `base.css` fica de fora de propósito |
| Montar duas vezes | inofensivo, são as mesmas regras |

A razão está escrita em `campos.tsx:38-42`: não depende de ordem de
import de folha, e página sem tabela não carrega o CSS de tabela. A regra
de sistema é do `src/design/nivar/LEIA.md`: *"o CSS de componente entra
POR DEMANDA, conforme cada tela usar — nada aterrissa em `src/` sem uso"*.

A página monta assim (medido em `DiagnosticoEnergeticoPage.tsx:59-65`,
`:332`, `:346-347`): importa os cinco arquivos de token do NIVAR, marca
`data-nv-page` e `data-mode`, e injeta `FOLHA_PORTAL` + a folha do
componente.

### 1.2 O achado que destrava o porte: zero token novo

Extraí os `var(--…)` de todos os blocos `.nv-tab*`, `.nv-ord*`, `.nv-exp*`
e `.nv-frescor*` de `data.css` e cruzei contra o que
`src/design/nivar/*.css` define. **24 tokens necessários, 24 presentes,
zero faltando** (`comm -23` sobre as duas listas ordenadas).

```
accent-focus  data-alta   data-atencao  data-baixa   data-neutro
dur-desenho   dur-hover   ease          fg-hover     fio
fio-forte     fio-hover   font-body     font-data    ilustrativa-fg
ilustrativa-fio  rule      rule-heavy   rule-strong  text-body
text-faint    text-muted  text-strong   zebra
```

`colors.css` define os 121 tokens de cor **duas vezes** — a segunda sob
`data-mode="noturno"`, remapeando `--text-*`, `--rule*`, `--zebra` e
`--ilustrativa-fg`. **Os dois modos saem de graça**, sem uma linha minha.

### 1.3 Dois keyframes, e já estão em `src/`

`.nv-exp__fio-desenho` e `.nv-exp__interno` dependem de `nv-fio-desenha`
e `nv-surge`. Ambos já existem em `portalChrome.tsx:145-146`, dentro de
`FOLHA_PORTAL`, que o console vai montar de qualquer jeito (preciso de
`.nv-btn` e `.nv-modo`). **Nada a portar aqui.**

### 1.4 Confirmado: nenhum semáforo, mesmo nos tokens "de dado"

`--data-alta` e `--data-baixa` soam a alta/baixa de mercado, o que
levantaria a regra de "zero semáforo". Medido em `colors.css`:

```
--data-alta:   var(--hardware)   /* terracota */
--data-baixa:  var(--software)   /* âmbar-marrom */
--data-neutro: var(--cinza-quente)
--data-atencao: var(--advisory)
```

São **cores da escala de incandescência da casa**, não vermelho/verde. A
doutrina se sustenta. De todo modo, o console **não usa nenhuma das
quatro** — não há direção de valor numa fila de trabalho.

---

## 2. H2 — o que o console usa dos 104 blocos

**Porte por demanda, não por completude.** 36 blocos de `data.css` +
16 de `states.css`.

### 2.1 Entra

| Grupo | Blocos | Por que o console precisa |
| --- | --- | --- |
| `.nv-tab*` | **20** | A fila é tabela densa. Inclui `--zebra`, `--hover`, `.nv-tab-rolo` (rolagem horizontal contida), `th`/`td`, `tfoot`, e `td.nv-num` com `tabular-nums` |
| `.nv-ord*` | **10** | Fase 4 pede ordenável. `<th>` com `<button>` dentro, glifo unicode (`↕ ↑ ↓`), `aria-sort` — sem biblioteca de ícone |
| `.nv-frescor*` | **6** | O marcador de mock (§2.3) |
| `.nv-est*` (`states.css`) | **16** | Fila vazia e produto sem pedido. Três variantes, uma delas com o eixo desenhado |

`.nv-num` não é bloco à parte: vive dentro das regras de `.nv-tab`, e é o
que satisfaz a regra **P1 `require-tabular-nums`** sem esforço.

### 2.2 Fica no skill, com razão

| Grupo | Blocos | Por que não |
| --- | --- | --- |
| `.nv-metodo*` | 23 | **Já chega** via `FOLHA_PORTAL`. E o console não divulga metodologia — quem faz isso é a superfície pública |
| `.nv-comp*` | 13 | Comparação lado a lado. A fila não compara pedidos entre si |
| `.nv-card*` + `.nv-cardgrid` | 11 | Cartão de dado com valor/unidade/delta. O console não tem métrica agregada; tem casos |
| `.nv-tend*` | 9 | Tendência inline. Não há série temporal |
| `.nv-exp*` | **7** | **Decisão que merece nota** — ver §2.4 |
| `.nv-proc*` | 5 | Procedência de fonte externa. O dado do console vem do cliente, não de fonte citável |
| `.nv-alta/.baixa/.atencao/.neutro` | 4 | Direção de valor; a fila não tem |

Total fora: **68 de 104**.

### 2.3 `.nv-frescor--ilustrativa` é o marcador de mock, e é do sistema

A Fase 4 exige dado mock "claramente marcado como mock na tela". Não
preciso inventar:

```
.nv-frescor--ilustrativa .nv-frescor__estado{
  color:var(--ilustrativa-fg);
  border-bottom:var(--fio) solid var(--ilustrativa-fio);
  padding-bottom:1px
}
```

`DataFreshness.jsx` mapeia `estado="ilustrativa"` para o rótulo **"amostra
ilustrativa"**, que a folha põe em caixa alta com fio no acento Advisory.
É exatamente a linguagem que o `AGENTS.md` fixa para ausência de fonte
confiável. Vai no topo da fila e no topo de cada detalhe.

### 2.4 Por que `.nv-exp*` fica de fora — e o que muda se o Aquiles discordar

`ExpandableRow` abre um painel **abaixo da linha**, empurrando as
seguintes. É bom, e minha própria recon o elogiou (§3.2 lá).

Não entra porque o brief manda o oposto: **Fase 5 são três telas de
detalhe com formas diferentes**. Linha expansível daria um quarto lugar
para ver o mesmo caso, e o painel inline é a forma que *homogeneíza* — é
o mesmo retângulo para os três produtos, exatamente contra "tudo
diferente, sempre diferente".

Se depois se provar que o operador quer triagem rápida sem sair da fila,
os 7 blocos entram numa wave posterior sem nada a desfazer. **Registrado
como escolha, não como esquecimento.**

---

## 3. H3 — onde `/operador` entra em `main.tsx`

**Sem colisão.** O arquivo é um `<Routes>` plano; a ordem que importa é
só a do catch-all, que é o último elemento (`:173`).

```
:160   <Route path="/br/*"  element={<PortalBRRouter />} />
:161   <Route path="/us"    element={<LandingPage />} />
       ← /operador/* entra AQUI
:173   <Route path="*"      element={<NotFound />} />
```

**Splat, não rota rasa.** O console é hierarquia real — fila → produto →
pedido —, e `PortalBRRouter.tsx:31-38` é o gabarito literal (38 linhas):
`<Route index>`, rota paramétrica, e `<Route path="*" element={<NotFound />} />`
próprio. Endereço errado *dentro* de `/operador` cai no 404 real da
Portal Debt Wave 1 sem eu tocar nele.

**Sem gate real nesta wave**, como o brief instrui: `PlatformUser` não tem
papel, e a CURSOR mediu que o gate de backend é por env
(`ADVISORY_OPERATOR_EMAIL`), que o front não conhece nem pode replicar. A
rota é alcançável por endereço digitado. Vou **declarar isso na tela** —
uma tarja dizendo que a superfície não tem verificação de operador e que
ela vem na wave de ligação. Console sem gate que não avisa é pior que
console sem gate.

**Estrutura de rota proposta:**

| Rota | Tela |
| --- | --- |
| `/operador` | fila completa, todos os produtos com fila |
| `/operador/:produtoId` | fila filtrada por produto |
| `/operador/:produtoId/:pedidoId` | o detalhe, forma própria por produto |
| `/operador/*` | `NotFound` |

---

## 4. Os três detalhes — proposta para o Aquiles

**Isto é proposta. Não construo a Fase 5 antes de resposta.**

O princípio que usei: a diferença entre as três telas tem que sair de
**fato medido**, não de vontade de variar. Três fatos, todos das recons
de Wave 1:

1. **CLE e Solar recebem arquivo; Diagnóstico não recebe nenhum.**
   `src/lib/diagnostico/api.ts` é cliente próprio, sem `source`.
2. **CLE e Solar têm caminho de entrega (`POST …/deliverable`);
   Diagnóstico não tem endpoint nem coluna.** (recon CURSOR, H4.)
3. **Só Diagnóstico tem conversa ligada ao caso** por
   `originKind`/`originId`. CLE e Solar não ligam. (recon CURSOR, H2.)

Daí saem três telas com **layouts diferentes**, não três variações de um
mesmo quadro.

### 4.1 CLE — "o documento e o parecer"

**Forma: duas colunas, o artefato à esquerda fixo, o trabalho à direita.**

A fatura de concessionária é documento **padronizado**: o operador lê os
mesmos campos toda vez. A tela é uma bancada com a peça de um lado e a
leitura do outro.

```
┌─ o que chegou ──────────┬─ a leitura ──────────────────┐
│                         │  fio · fio · fio             │
│  [ placeholder do       │  ANATOMIA DA FATURA          │
│    documento ]          │  ├ distribuidora    ____     │
│                         │  ├ classe/subgrupo  ____     │
│  exibição vem na        │  ├ demanda contratada ___    │
│  Wave 3 (Build 2)       │  ├ demanda medida   ____     │
│                         │  └ …                         │
│  nome.pdf               │                              │
│  application/pdf        │  ─────────────────────────   │
│  1,8 MB                 │  PARECER                     │
│  ↓ baixar               │  [ campo longo ]             │
│                         │  [ anexar entregável ]       │
└─────────────────────────┴──────────────────────────────┘
```

- A coluna esquerda é **alta e fixa**; a direita rola. O documento é o
  eixo da tela.
- O placeholder **declara** que a exibição vem em wave própria e oferece
  o download, que é o que já existe hoje.
- A lista de campos é **fixa e sempre a mesma** — é o que distingue uma
  fatura de uma proposta.

**Ressalva que preciso registrar:** os campos de anatomia da fatura **não
existem no backend**. Nesta wave eles são superfície de trabalho do
operador, sem persistência. Se o Aquiles quiser que eles virem dado, isso
é coluna nova — território CURSOR, wave de ligação. Estou propondo a
*forma*; não estou fingindo que o dado existe.

### 4.2 Solar — "o contraditório"

**Forma: largura inteira, um livro-razão de afirmação contra leitura.**

A definição da própria família (`br-familias.ts:108`) é o argumento:
*"Parecer sobre um caso concreto, com o contraditório produzido junto —
não depois. A conclusão vem acompanhada do argumento que a contesta."*

Uma proposta comercial de solar **não é padronizada**: cada vendedor
afirma o que quer, num número variável de alegações. A tela tem que ser
uma **lista que cresce**, não um formulário fixo.

```
 proposta.pdf · 2,4 MB · ↓ baixar        [ exibição: Wave 3 ]
 ───────────────────────────────────────────────────────────
 #   O QUE A PROPOSTA AFIRMA        O QUE A LEITURA CONTESTA
 1   "geração de 1.480 kWh/mês"     ____________________
 2   "payback em 3,2 anos"          ____________________
 3   …                              ____________________
                                              + acrescentar
 ───────────────────────────────────────────────────────────
 CONCLUSÃO   [ campo longo ]     [ anexar entregável ]
```

- Reusa `.nv-tab*` — é literalmente uma tabela de duas colunas, e é
  **por isso** que porto o grupo.
- **N linhas, não N campos.** O operador acrescenta enquanto lê.
- O arquivo vira **uma faixa fina no topo**, não a metade da tela — na
  Solar o artefato é o ponto de partida, não o objeto de estudo campo a
  campo.

Mesma ressalva da CLE: os pares afirmação/contraditório não têm coluna
no backend. Forma proposta; persistência é wave de ligação.

### 4.3 Diagnóstico — "a ficha e o fio"

**Forma: coluna única de leitura. Sem duas colunas, sem tabela.**

Aqui não há arquivo nenhum. O caso **é** o texto que o cliente digitou, e
é o único dos três em que já existe um canal de resposta — a conversa. E
é o único **sem caminho de saída**: não há entregável.

```
 ┌─ coluna única, largura de leitura ─────────┐
 │  A FICHA                                    │
 │  setor            ______ (só leitura)       │
 │  faixa de consumo ______                    │
 │  modalidade tarifária ______                │
 │  preocupação      ______                    │
 │                                             │
 │  ─────────────────────────────────────      │
 │  O FIO                                      │
 │  ▸ cliente · há 2 d                         │
 │  ▸ operador · há 1 d                        │
 │  [ responder ]                              │
 │                                             │
 │  ⓘ este produto não tem entregável.         │
 │     A resposta é a mensagem.                │
 └─────────────────────────────────────────────┘
```

- **Nenhum slot de entregável**, e a tela **diz por quê**. Isso é o
  oposto de esconder: a ausência se declara.
- A conversa é o instrumento principal, não um acessório — porque na
  medição da CURSOR ela é o *único* canal deste produto.
- Coluna estreita, tipografia de leitura. É texto de gente, não dado.

### 4.4 O que os três compartilham (e por que isso não contradiz "tudo diferente")

Cabeçalho, marca, alternância claro/noturno, migalha de volta para a
fila, e o carimbo de amostra ilustrativa. **Vocabulário igual,
instrumento diferente** — que é exatamente a distinção que registrei na
recon (§5.2 lá): a deriva começaria se uma das três quisesse um raio ou
uma sombra, não por terem layouts distintos.

---

## 5. A fila — contrato proposto (Fase 4)

**Colunas:**

| Coluna | Tipo | Ordenável | Nota |
| --- | --- | --- | --- |
| Produto | texto | sim | nome de `DESTINOS_BR`, não string solta |
| Cliente | texto | sim | mock; hoje o backend devolve `userId` opaco, sem join |
| Enviado em | data, mono tabular | sim | `createdAt` |
| Status | texto | sim | `submitted` / `ready` — e `sem status` para Diagnóstico |
| Idade | mono tabular | **sim, padrão** | tempo cru |

**Idade, exatamente como o Aquiles travou:** tempo decorrido cru
(`3 d 4 h`, `12 h 20 min`, `8 min`), mono tabular, **cor única**. Zero
barra, zero rótulo de atrasado, zero prazo. A ordenação padrão é por
idade decrescente — o mais antigo no topo — porque é a única ordem que um
operador quer ao abrir a tela, e ainda assim **não** é uma promessa.

**`sem status` para Diagnóstico não é buraco, é achado.** CLE e Solar têm
`'submitted' | 'ready'`; Diagnóstico não tem o campo
(`src/lib/diagnostico/api.ts:27` declara a ausência). A célula mostra
`sem status` em `--text-faint`, com nota de rodapé na tabela. Preencher
por plausibilidade seria mentir sobre o backend.

**Origem do dado mock:** módulo próprio em `src/lib/operador/`, tipos
próprios, zero `fetch`. O `--ilustrativa` no topo.

---

## 6. A lateral — critério derivado, não lista escrita à mão (Fase 3)

O critério é **"o produto tem fila?"**, o achado da recon (§6.5 lá) que
corrigiu a premissa do brief de Wave 1. Hardware é a única família sem
produto; Academy, Software e Intelligence **têm** produto, mas nenhum
deles recebe submissão de cliente.

Derivação, em três passos sobre dado que já existe:

1. `FAMILIAS_BR` (`src/lib/data/br-familias.ts`) dá família → `produtoIds`.
2. Um mapa de fila no meu território diz quais `produtoIds` têm fila.
3. A lateral renderiza **só família cujo cruzamento não é vazio**.

Hoje isso produz **Advisory, com três produtos, e mais nada** — sem aba
vazia, sem "em construção", sem `if (familia === 'hardware')`. No dia em
que Terminal Brasil ganhar fila, ele aparece por dado.

**Por que um mapa novo e não `FLUXOS_SUBMISSAO`:** aquela lista
(`src/lib/submissoes/api.ts:151`) tem CLE e Solar, mas **não** Diagnóstico
— que usa cliente próprio. Usá-la sozinha esconderia um terço da fila. O
mapa novo é a lista dos três, no meu território, e a divergência fica
registrada como pendência da wave de ligação (era a última linha do
"registrado, não resolvido" da Wave 1).

---

## 7. Fronteiras desta wave

**CRIAR** — `src/components/nivar/tabela.tsx` (o vocabulário portado),
`src/pages/operador/**`, `src/lib/operador/**`, este documento.
**MODIFICAR** — `src/main.tsx`, uma rota.
**NUNCA** — `app/`, `src/components/alexandria/`, `public/alexandria/`,
`src/design/nivar/` (consome, não edita).

Sem visualizador de documento, sem anotação, sem requisição de rede.

## 8. Pendências que esta wave declara e não resolve

- **Gate de operador** — a rota fica alcançável por endereço digitado,
  com aviso na tela. Depende de a CURSOR expor papel na sessão.
- **Endpoint de fila** — `GET /api/operator/conversations` existe mas não
  lista submissão; não há fila de pedidos. Dado é mock.
- **Campos de trabalho** (anatomia da fatura, pares de contraditório) —
  forma proposta, sem persistência. Coluna nova é território CURSOR.
- **Nome do cliente** — o backend devolve `userId` opaco, sem join com
  `users`. No mock aparece nome; na ligação, ou vem do join ou a coluna
  declara ausência.
- **`FLUXOS_SUBMISSAO` não cobre Diagnóstico** — mantida como estava; o
  mapa de fila do console é lista irmã, não substituição.
