# Diagnóstico Energético — recon de intake rico e status (frontend)

**Wave:** ARCHITECT — Diagnóstico Energético Wave 1. Trilha nova:
varredura do CLAUDE.md por `DIAGN` devolve zero seção. É a Wave 1.

**Escopo:** recon. Zero código escrito, zero arquivo de produto
modificado. Quatro hipóteses, cada uma medida no disco — e a primeira
também **no render**, porque é a que decide se a wave de build começa
generalizando ou construindo.

**Trabalho paralelo:** na entrada da sessão havia trabalho não
commitado da wave Solar Proposal Validator em `app/services/
advisory_email.py` e `solar_proposal_email.py`. **Não foi tocado nem
stashado** — o `git pull --rebase` foi trocado por `fetch` +
comparação (0 atrás, 0 à frente). Nada em `app/` foi lido nesta wave.

---

## Veredito curto

| Hipótese | Achado |
| --- | --- |
| H1 · O mecanismo aguenta três produtos? | **JÁ AGUENTA. Já foi generalizado, e Advisory já serve os três — provado no render.** A pendência que eu registrei na Wave 2 foi paga pela Solar Proposal Validator Wave 2. |
| H2 · `MethodDisclosure` é reusável? | **O CSS sim, o componente não existe.** É JSX inline no hero, com estado e ids próprios. |
| H3 · Padrão de formulário multi-campo? | **Existe estrutura, não existe estilo.** Cinco formulários ricos — todos no terminal americano, tokens errados. O NIVAR tem `field.css` completo, mas ele nunca chegou a `src/`. |
| H4 · Padrão de lista/timeline? | **Existe, e o melhor não é um chat.** `PublicationList` do próprio NIVAR é o precedente certo; o chat da IA é vocabulário de outro sistema. |

**A wave de build começa mais barata do que o brief supõe.** Nada
precisa ser generalizado antes: Diagnóstico entra declarando um bloco
num array. O trabalho real está em H3 (trazer os campos do NIVAR para
`src/`) e H4 (decidir o que é "conversa" num produto que não tem
conversa modelada em lugar nenhum).

---

## 1. H1 — o mecanismo com três produtos

### A pendência que eu registrei foi paga, e não por mim

O CLAUDE.md da Conta de Luz Express Wave 2 fecha com:

> **`ehAdvisory` é o segundo `if` hardcoded.** Generalizar o slot de
> família é decisão de arquitetura para o terceiro produto, não para o
> segundo.

**O terceiro produto chegou antes desta wave.** A Solar Proposal
Validator Wave 2, Fase 1, substituiu os dois condicionais por um slot
declarado. O comentário está no próprio `FamiliaPage.tsx:35-39`:

> substitui os dois condicionais hardcoded (`ehAcademy`, `ehAdvisory`)
> por um slot declarado em módulo próprio.

Varredura confirma: **zero ocorrência** de `ehAcademy`, `ehAdvisory` ou
`familia.id ===` no `FamiliaPage.tsx` — a única linha que os menciona é
o comentário histórico acima.

### O mecanismo real, hoje

`src/components/br/blocosFamilia.tsx` (383 linhas). O contrato
(`BlocoFamiliaProduto`, L99) é **por PRODUTO, não por família** — que é
exatamente a correção que faltava:

| Campo | Papel |
| --- | --- |
| `produtoId` | chave contra `DESTINOS_BR`; o bloco só aparece se o produto pertencer à família da página |
| `ariaLabel`, `titulo`, `nota` | cabeçalho da seção |
| `colunas: {k,v}[]` | faixa de bordas colapsadas (o padrão que a CLE usa) |
| `ctaRotulo`, `ctaNota` | CTA; **a rota vem do catálogo**, nunca digitada. `null` = sem CTA — "produto sem rota não ganha link morto" |
| `Antes?` | conteúdo ACIMA do cabeçalho (a gravura da Academy) |
| `Corpo?` | corpo próprio que substitui colunas + CTA (a grade de contadores da Academy) |

O resolvedor (L379) é três linhas: mapeia os produtos da família contra
`BLOCOS_FAMILIA` e descarta quem não declarou bloco.

A numeração deixou de ser digitada. `FamiliaPage.tsx:407-408`:

```tsx
{blocos.map((bloco, i) => {
  const numero = String(2 + i).padStart(2, '0');
```

O comentário na L137 nomeia o defeito antigo: *"Era este o defeito que
os dois condicionais hardcoded escondiam: `02` digitado em…"*.

### Provado no render, não só na leitura

`/br/familia/advisory`, medido:

```
01 · PRODUTOS · 3 NO CATÁLOGO
     Conta de Luz Express      → Aberto →
     Solar Proposal Validator  → EM CONSTRUÇÃO
     Diagnóstico Energético    → EM CONSTRUÇÃO
02 · CONTA DE LUZ EXPRESS     · O PRODUTO ABERTO HOJE
03 · SOLAR PROPOSAL VALIDATOR · EM CONSTRUÇÃO
```

`br-familias.ts:109` já lista os três:
`['conta-de-luz-express', 'solar-proposal-validator', 'diagnostico-energetico']`.

**Advisory já é uma família de três produtos em produção.** Diagnóstico
já aparece na lista `01`; o que falta é só o bloco de profundidade —
por isso a página fecha em `03` e não em `04`.

### O que a wave de build precisa fazer em H1

**Nada de arquitetura.** Acrescentar uma entrada em `BLOCOS_FAMILIA`
com `produtoId: 'diagnostico-energetico'`, e a seção `04` aparece
sozinha, numerada, na ordem do catálogo. Um bloco sem `Corpo` já rende
a faixa de colunas — que é o formato que CLE e Solar usam.

O que **fica** como limite conhecido (não bloqueia): o slot é uma lista
literal num arquivo do frontend. Um produto sem entrada some da camada
de profundidade em silêncio — comportamento documentado no próprio
resolvedor, e é o correto, mas não há trava de DEV avisando (a que
existe, em `br-familias.ts:152`, cobre produto sem FAMÍLIA, não produto
sem BLOCO).

## 2. H2 — `MethodDisclosure`

**Não é componente. É JSX inline no `PortalHero`.**

- Estado local: `const [metodoAberto, setMetodoAberto] = useState(false)`
  (`PortalHero.tsx:193`).
- Markup: `PortalHero.tsx:533-598`, `<div className="nv-metodo">` com
  gatilho `aria-expanded`/`aria-controls` e painel revelado por fio que
  desenha (`nv-metodo__fio-desenho`, SVG de 1 unidade de altura).
- **Ids hardcoded** (`metodo-pld-painel`) — duas instâncias na mesma
  página colidiriam. Conteúdo é do PLD, literal.
- Zero export em qualquer arquivo. Ninguém mais consome.

**O que É reusável, e sem custo:** o CSS. `.nv-metodo*` vive em
`FOLHA_PORTAL` (`portalChrome.tsx`, 17 ocorrências), que **toda página
do Portal já injeta** — inclusive `ContaDeLuzExpressPage`. Uma seção de
método em Diagnóstico só precisa do markup; o estilo já chega.

A ordem das linhas é do componente, não do chamador, e o readme do
sistema explica por quê: método → fonte → *método publicado em* →
*dado coletado em* → premissas, porque *"o método é público antes de
existir número para defender"*. Inverter as duas datas desmonta a tese
sem mudar nenhum dado. **Se a wave de build reescrever o markup, essa
ordem não é negociável.**

Duas opções para a wave, sem escolher: (a) copiar o markup e trocar o
conteúdo, com `useId()` no lugar do id fixo — barato, e é o que o
Portal já faz com Button/ModeToggle; (b) extrair um componente de
verdade em `components/br/`, o que paga só se um terceiro consumidor
aparecer.

## 3. H3 — formulário com vários campos

### Estrutura existe; estilo não serve

Cinco formulários ricos, todos no **terminal americano**:

| Arquivo | Controles |
| --- | --- |
| `nest/storage/DABidOptimizer/AssetRegistrationForm.tsx` | 9 |
| `nest/trader/journal/JournalEntryEditor.tsx` | 7 |
| `nest/industrial/StrategySimulator/FacilityProfileForm.tsx` | 7 |
| `nest/student/SandboxTrading/PositionEntryForm.tsx` | 5 |
| `nest/developer/UnderwritingCalculator/ProjectInputForm.tsx` | 5 |

Os três maiores importam `{ C, F, R, S } from '@/design/tokens'` — o
sistema do terminal, com `R` (raio) que o NIVAR proíbe. **Não são
reusáveis como estilo.**

Como **estrutura**, o `ProjectInputForm` é o precedente mais próximo do
que Diagnóstico precisa: um `presetId` que repopula todos os campos
(`applyPreset`), um `useState` por campo, e um efeito que reseta o que
depende de tecnologia quando ela muda. É o padrão "preset + campos +
submit" que um diagnóstico 360° pede — vale ler, não copiar.

### O NIVAR tem os campos, mas eles nunca chegaram a `src/`

`components/forms/field.css` do skill tem **61 ocorrências** de
`.nv-campo*` / `.nv-escolha*` / `.nv-desl*` — Input, NumberInput
(mono tabular com sufixo de unidade atrás de fio), Select, Checkbox,
Radio, Slider, UnitField, MultiSelect, mais o marcador de campo
obrigatório e a validação assíncrona por fio que se desenha.

**Nada disso está em `src/`:** `FOLHA_PORTAL` tem **zero** ocorrência
de `nv-campo`, e `src/design/nivar/` só tem os cinco arquivos de
variável. Foi por isso que a CLE compôs `.cle-arquivo*` local imitando
`.nv-campo__caixa` — copiou os valores, não o arquivo (o cabeçalho dela
declara isso, L32-36).

**Consequência para o build:** um intake de vários campos é o primeiro
consumidor real do `field.css`. As opções, sem decidir:

| Caminho | Custo | Observação |
| --- | --- | --- |
| Copiar o subconjunto para `FOLHA_PORTAL` | zero dependência; segue o precedente literal do Portal (Button, ModeToggle, MethodDisclosure já entraram assim, "verbatim no subconjunto usado") | engorda uma folha já longa |
| Portar `field.css` para `src/design/nivar/` | é o destino que a FOUNDRY NIVAR Wave 1 declarou ("o CSS de componente entra por demanda, conforme cada tela usar") | cria arquivo em diretório que várias waves listam como somente-leitura — precisa de posse explícita no brief |
| Repetir o padrão local (`diag-campo*`) | consistente com o que a CLE fez | terceira cópia dos mesmos valores; é onde a divergência começa |

Convenção do sistema que a wave herda de graça: **uma convenção só de
campo obrigatório** — asterisco em `--accent-house` junto ao rótulo
mais a palavra `obrigatório` para leitor de tela; nunca marcar
"opcional" nos outros. A CLE já aplicou isso no campo de arquivo.

## 4. H4 — lista / timeline / conversa

### O que existe, e o que serve

| Candidato | O que é | Serve? |
| --- | --- | --- |
| `shared/AIAssistant.tsx` | thread de chat com a IA — balões `alignSelf: flex-end/flex-start`, `background` washes por papel (`C.electricBlueWash`), tokens do terminal | **Não.** É conversa homem-máquina, e balão colorido é vocabulário de SaaS que o NIVAR não usa |
| `nest/trader/journal/JournalView.tsx` | lista cronológica de entradas, ordenada `desc` por data | Parcial — é lista datada, mas do próprio usuário, sem interlocutor, e em tokens do terminal |
| `PublicationList` / `PublicationCard` (NIVAR) | lista editorial de itens datados: coluna de família, título, resumo, meta em mono tabular à direita, bordas colapsadas | **Sim — é o precedente certo** |
| `Collapsible` / `ExpandableRow` (NIVAR) | item que abre painel abaixo e empurra os seguintes, marcador `+`/`−` | Sim, para o detalhe de cada evento |

`editorial.css` do skill, `.nv-publista` / `.nv-pub`: grade
`146px | 1fr | auto`, `border-top` forte na lista e `border-bottom` por
item — exatamente "lista de eventos datados" sem inventar componente.

### O ponto que a recon precisa deixar claro

**Não existe conversa modelada em lugar nenhum do produto** — nem no
frontend, nem (pelas recons anteriores desta família) no backend, que
só conhece submissão com `status`, `createdAt`, `updatedAt` e
`deliveredAt`. Uma tela de "status + mensagem contínua" tem duas
leituras muito diferentes de custo:

1. **Timeline de eventos** (submetido → em leitura → parecer entregue),
   derivada dos carimbos que a submissão já tem. `PublicationList` +
   `Collapsible` cobrem isso hoje, sem backend novo.
2. **Thread bidirecional** (cliente escreve, operador responde). Não
   existe entidade, endpoint, nem componente. É domínio novo inteiro —
   e o `AIAssistant` não é precedente porque a mensagem dele não
   persiste nem tem dois humanos.

Qual das duas o produto quer é decisão do war room. A recon registra
que a (1) é composição do que existe e a (2) é uma trilha de backend
própria.

## 5. O que a wave de build herda pronto

- **O slot de família** (§1) — Diagnóstico é uma entrada num array.
- **`FOLHA_PORTAL`** já injetada em qualquer página do Portal: Button,
  ModeToggle, MethodDisclosure, planta baixa, textura, wordmark.
- **A moldura de página de produto**: `ContaDeLuzExpressPage` é o
  esqueleto completo (faixa de gradiente, header com wordmark + volta
  para a família + ModeToggle, `<main>` rolável, rodapé com a tese) já
  em NIVAR e já com guard de rota por sessão.
- **`PlantaBaixa`** — `DestinoCard.tsx` tem geometria desenhada para
  `diagnostico-energetico`, do mesmo jeito que tinha para a CLE.
- **O registro de submissões** (`src/lib/submissoes/api.ts`,
  `FLUXOS_SUBMISSAO` + `criarClienteSubmissoes`) — a Wave 5 da CLE
  criou o cliente canônico; um produto novo entra declarando prefixo,
  não reescrevendo fetch.

## 6. O que precisa ser construído

- **Campos de formulário em NIVAR** (§3) — o `field.css` existe no
  sistema e não está em `src/`. É o item mais estrutural desta lista.
- **Um bloco de família para Diagnóstico** (§1) — trivial, mas é o que
  faz o produto aparecer com profundidade.
- **A superfície de método** (§2) — markup novo, CSS existente, ordem
  de linhas travada pelo sistema.
- **A tela de status** (§4) — composição de `PublicationList` +
  `Collapsible` se for timeline; domínio novo se for thread.

## Registrado, não resolvido

- **O slot não avisa quando um produto não tem bloco.** A trava de DEV
  de `br-familias.ts` cobre produto sem família; produto sem bloco some
  em silêncio da camada de profundidade. Hoje é o caso do Diagnóstico —
  e é o comportamento correto, mas se um dia for acidente, ninguém
  descobre por console.
- **`[DATA]` continua literal no MethodDisclosure do hero**
  (`PortalHero.tsx:570`) — pendência da Portal BR Wave 6, não desta
  trilha. Se Diagnóstico copiar o markup, copia o placeholder junto.
- **Três cópias do mesmo valor de campo** vão existir se Diagnóstico
  repetir a estratégia local da CLE (§3). A terceira é onde a
  divergência costuma nascer.

---

# Adendo — Wave 2, Fase 1 · contratos confirmados antes de portar

Quatro hipóteses do brief da Wave 2, medidas no disco antes de escrever
markup ou portar CSS.

## H1 · O slot, e como a Solar registrou a dela

`BLOCOS_FAMILIA` recebe objetos `BlocoFamiliaProduto`. A entrada da
Solar é a forma exata a seguir — sem `Antes`, sem `Corpo`, três
colunas e CTA nulo:

```
produtoId · ariaLabel · titulo · nota
colunas: [{k: 'O que entra'}, {k: 'O que sai'}, {k: 'O que não é'}]
ctaRotulo: null      ← produto sem rota não ganha link morto
ctaNota: 'Em construção · o envio abre com a ativação do produto'
```

A terceira coluna é sempre a tese da casa aplicada ao produto ("não
vende, não intermedia, não recebe comissão"). Diagnóstico copia a
forma, troca o conteúdo. Numeração deriva: com a entrada declarada, a
seção nasce `04`.

## H2 · As classes `.nv-metodo*`, lista completa

Onze, todas já em `FOLHA_PORTAL` (`portalChrome.tsx`):

```
.nv-metodo · __ancora · __gatilho · __painel · __fio-desenho
  · __corpo · __linha · __rot · __v · __v--dado · __premissas
```

O markup do hero (`PortalHero.tsx:533-598`) usa dez das onze —
`__premissas` fica sem uso lá. **Nada a portar**; só escrever markup
novo com `useId()` no lugar do id fixo (`metodo-pld-painel`), porque
duas instâncias na mesma página colidiriam.

## H3 · `PublicationList` e `Collapsible` — API real

Ambos existem **só no skill**. Varredura por `nv-publista`, `nv-pub__`
e `nv-recol` em `src/`: **zero ocorrência** — nem CSS, nem componente.
São CSS puro + `.jsx` de referência a portar junto com a Fase 4.

```
PublicationList({ children })                    → <ol class=nv-publista>
PublicationCard({ familia, tipo, titulo, resumo,
                  data, leitura, href })         → <li class=nv-pub>
Collapsible({ titulo, nota, aberta, onToggle,
              padrao, id, fio, children })       → controlado OU interno
```

O `Collapsible` já resolve o dobro: aceita estado controlado (`aberta`
+ `onToggle`) ou gerencia o próprio (`padrao`). Marcador `+`/`−` em
mono — **o sistema não gira glifo**, e a revelação é o fio de 700ms.

## H4 · `field.css` — a medição, e uma divergência a reportar

**115 linhas, 89 blocos de regra.** O brief fala em "61 seletores"; a
contagem real por família de componente:

| Família | Blocos | Componente | Diagnóstico usa? |
| --- | --- | --- | --- |
| `.nv-campo*` | 26 | Input, NumberInput, Select, UnitField | **Sim** — é o núcleo |
| `.nv-escolha*` | 18 | Checkbox, Radio | **Provável** (setor, modalidade) |
| `.nv-multi*` | 16 | MultiSelect | Não |
| `.nv-desl*` | 14 | Slider | Não |
| `.nv-acesso*` | 15 | **AuthForm** — tela de login | **Não** — outro produto |

### A divergência, declarada antes de agir

O brief manda "os 61 seletores entram em `src/`". A disciplina que a
própria FOUNDRY declarou em `src/design/nivar/LEIA.md:3-4` diz o
oposto:

> Só os SEIS tokens estão aqui. O CSS de componente entra **por
> demanda, conforme cada tela usar** — nada aterrissa em `src/` sem
> uso.

Portar `.nv-acesso*` (o formulário de acesso do sistema) seria trazer
para `src/` o estilo de uma tela que **já existe e já resolveu isso de
outro jeito** — `/entrar` e `/criar-conta` foram migradas para NIVAR na
sua própria wave, com `.conta-campo` local. Duas fontes para o mesmo
papel é exatamente a divergência que o registro existe para impedir.
`.nv-multi*` e `.nv-desl*` não têm consumidor nenhum previsto.

**Decisão, e é a recomendação:** portar `.nv-campo*` + `.nv-escolha*`
(44 dos 89 blocos), verbatim nos valores, e deixar os outros três
grupos no skill até existir tela que os use. Não é o port menor por
prazo — é o port certo pela regra do sistema. Se o war room quiser os
89 mesmo assim, é uma linha de brief e eu porto o resto.

**O escopo NÃO precisa de wave própria.** Os componentes do skill são
finos (o `Input.jsx` inteiro tem 30 linhas: um `Envelope` que monta
rótulo + caixa + erro/nota, e o `<input>` dentro). O que custa é o CSS,
que é cópia verbatim de valores já escritos.

### Onde vai morar

`src/design/nivar/` é a fonte dos tokens e está declarado NUNCA
MODIFICAR nesta wave ("consome, não edita a fonte"); `FOLHA_PORTAL`
está como somente-leitura. Então os componentes portados vão para
**arquivo novo em `src/components/nivar/`** — diretório novo, nomeado
pelo sistema que serve, no mesmo nível de `br/`, `alexandria/` e
`terminal/`, que é como o repo já separa por sistema visual. O CSS
viaja com eles, no idioma que o Portal já usa (`<style>` com o texto
verbatim), para não depender de ordem de import de folha global.

---

# Adendo — Wave 3, Fase 1 · contrato real, e três divergências

Lido em `app/routers/diagnostico.py` e `app/routers/conversations.py`
(CURSOR Wave 2). Nada presumido pela semelhança de nome — foi
exatamente onde a checagem pagou.

## H1 · Os quatro campos: nome bate, FORMA não

Contrato real (`CreateDiagnosticoRequest`, alias camelCase,
`populate_by_name`):

| JSON | Tipo | Obrigatório | Teto |
| --- | --- | --- | --- |
| `sector` | `str` | **sim** | 200 |
| `monthlyConsumptionBand` | `str` | **sim** | 80 |
| `tariffModality` | `str \| null` | não | 80 |
| `concern` | `str` | **sim** | 4000 |

Resposta (`_payload`): `id`, `productId`, os quatro campos,
`createdAt`, `updatedAt`. **Sem `status`, sem `deliverable`.**
`GET /submissions` devolve `{data[], summary:{count}}`, mais recente
primeiro. `403` sem entitlement, como CLE e Solar.

### Divergência 1 — `concern` é obrigatório; meu campo era opcional

O mock rotula o campo de texto como *"Opcional. Uma frase já ajuda a
direcionar a apuração."* O backend recusa vazio (`_strip_required`).
Enviar o formulário sem contexto daria `422`.

### Divergência 2 — duas entradas minhas, um campo lá

O mock tem **duas** coisas onde o backend tem **uma**: as caixas "o que
está em jogo" (múltipla escolha) e o textarea "Contexto". Não existe
coluna para a múltipla escolha.

**Reconciliação, e é decisão desta wave** (o brief da Wave 2 previu:
"pode divergir levemente; a fiação da Wave 3 reconcilia"): as duas
entradas compõem UM `concern`. As marcadas viram uma primeira linha
legível, o texto livre vem embaixo. Nada se perde, e o backend não
precisa mudar. As caixas continuam sendo a forma de responder — só a
serialização é que junta.

Consequência para o rótulo: o campo de contexto deixa de ser opcional
**quando nada foi marcado**. Com caixa marcada, o `concern` já tem
conteúdo e o texto segue opcional de verdade. A validação de cliente
passa a exigir "pelo menos uma das duas".

### Divergência 3 — `'nao-sei'` viraria a string `"nao-sei"`

O mock usa `value: 'nao-sei'` como opção de primeira classe. O backend
trata `tariffModality` como `str | null` e converte **string vazia em
`null`** — mas `"nao-sei"` é string não-vazia: seria gravada literal,
como se fosse uma modalidade tarifária chamada "nao-sei".

Correção: `'nao-sei'` mapeia para `null` no envio. O valor continua
sendo opção de primeira classe na tela; só não viaja como texto.

## H2 · O cliente canônico NÃO serve — e o motivo não é o transporte

`src/lib/submissoes/api.ts` foi construído em volta de arquivo, e a
incompatibilidade é de **contrato**, não só de `FormData`:

- `ClienteSubmissoes.enviar(arquivo: File)` — a assinatura exige `File`;
- o corpo é `FormData` com campo `file`, fixo;
- o tipo `Submissao` tem `status: 'submitted'|'ready'`, `source`
  (obrigatório), `deliverable`, `deliveredAt` — **nenhum desses campos
  existe** no payload de Diagnóstico;
- `ListaSubmissoes.summary` é `{count, submitted, ready}`; o de
  Diagnóstico é `{count}`.

Alargar o tipo para caber os dois deixaria `source` e `status`
opcionais para todo mundo — e são justamente os campos de que CLE e
Solar dependem. Seria enfraquecer dois contratos que funcionam para
acomodar um terceiro que não é do mesmo domínio: os três compartilham
a palavra "submissions" na URL, não a forma.

**Reporto e proponho, como o brief pede:** dois módulos novos, nenhum
tocando o canônico.

| Módulo | Por quê |
| --- | --- |
| `src/lib/diagnostico/api.ts` | intake estruturado; tipo próprio, sem `status`/`source` |
| `src/lib/conversas/api.ts` | conversa e mensagem são **domínio de plataforma**, não de Diagnóstico — a CURSOR modelou assim de propósito, e CLE/Solar herdam sem reescrever |

Cliente em arquivo de componente já foi pago uma vez nesta trilha (a
CLE Wave 3 suprimiu `react-refresh/only-export-components` e a Wave 5
extraiu). Nasce em `src/lib/` direto.

## H3 · Conversa: o par de origem é o contrato

`POST /api/conversations` — `productId` (obrigatório, validado contra
`PRODUCT_IDS`), `originKind`/`originId` (opcionais, mas **`model_validator`
exige os dois juntos ou nenhum**), `subject`, `body` opcionais.

`originKind` para este produto é a constante literal
`"diagnostico_energetico_submission"`
(`app/db/models/conversation.py:41`), e `_verify_diagnostico_origin`
confirma que o `originId` é uma submissão **da própria conta**.

O POST é **idempotente por origem**: com `originId` presente, procura
conversa existente do mesmo par antes de criar.

- `GET /api/conversations` → `{data[], summary:{count}}`, sem mensagens,
  ordenado por `updatedAt desc`.
- `GET /api/conversations/{id}` → conversa **com** `messages[]`,
  ordenadas `createdAt asc`.
- `POST /api/conversations/{id}/messages` → `{body}`; `403` se não for
  o dono.

**Autoria vem do servidor:** `role` (`"customer"` / operador) no payload
da mensagem. O mock usa `autor: 'casa' | 'cliente'` — mapeia para
`role`, e o fio à esquerda (`--accent-house` vs `--rule`) continua igual.

## H4 · Onde o compositor vive

`HistoricoDiagnostico.tsx:320` — `<textarea disabled>` dentro de
`.nv-campo--desabilitado`, com a nota `--ilustrativa-*` ao lado. A
composição `PublicationList` + `Collapsible` (linhas 270-295) **não é
tocada**: habilitar é trocar o bloco do compositor e a fonte de
`MENSAGENS`, nada mais.

## Perfil — já generalizado

`PerfilPlataforma.tsx` itera `FLUXOS_SUBMISSAO` (L368) e renderiza
`StatusSubmissao` por fluxo. Mas o registro é do cliente de ARQUIVO, e
Diagnóstico não cabe nele (H2) — a Fase 4 acrescenta a seção deste
produto lendo do cliente próprio, sem alterar o laço dos outros dois.
