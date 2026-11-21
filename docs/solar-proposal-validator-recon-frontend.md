# Solar Proposal Validator — recon de reuso (frontend)

**Wave:** ARCHITECT — Solar Proposal Validator Wave 1, Fase 1.
**Trilha:** nova. Confirmada contra o `CLAUDE.md` do disco — ver §0.
**Posse desta wave:** só este arquivo. Zero código modificado; zero
arquivo de produto tocado.
**Trabalho paralelo:** existe recon CURSOR sobre o mesmo produto, do
lado do backend. Zero arquivo em comum.

---

## Veredito curto

| Hipótese do brief | Veredito | Onde |
| --- | --- | --- |
| `ehAdvisory` ativa bloco de família ou de produto? | **De FAMÍLIA no gate, de PRODUTO no conteúdo.** Não aguenta dois produtos abertos. Precisa mudar antes de qualquer UI de Solar entrar. | §2 |
| A lista de produtos da família aguenta? | **Sim, sem tocar em nada.** Já renderiza os dois Advisory hoje, e um terceiro entra por dado. | §2.2 |
| Existe `PlantaBaixa` para Solar? | **Não** — e existe fallback genérico, então não quebra. Mas a hipótese de posse do brief está errada: `DestinoCard.tsx` é ARCHITECT, não FOUNDRY. | §3 |
| Quanto da tela de intake é reusável? | **Estrutura e mecânica: reusável quase inteira.** Copy: **17 âncoras** a reescrever. Cliente e tipos: presos ao produto por `BASE` e por tipo literal. | §4 |
| *(fora das três, mas bloqueia a build)* | O `activate` do backend responde **404** para id fora do catálogo. Solar não existe lá. A ordem frontend↔backend não é livre. | §5 |

**A frase que importa:** `ehAdvisory` não é falha da Wave 2 de Conta de
Luz Express. Ela foi escrita quando a Advisory tinha **um** produto
aberto, e o próprio comentário no código declara que generalizar seria
decisão para o terceiro. O terceiro não chegou — chegou o **segundo
aberto**, que é o caso que o comentário não cobria. É escopo que a wave
anterior não tinha motivo de cobrir, não descuido.

---

## 0. Confirmação de N — trilha nova, Wave 1

`grep "^## " CLAUDE.md` — a última seção ARCHITECT é
**"CONTA DE LUZ EXPRESS WAVE 3"**. Nenhuma seção nomeia Solar Proposal
Validator, em trilha nenhuma.

`grep -rni "solar.proposal\|proposal.validator" CLAUDE.md docs/ src/ app/`
devolve **8 ocorrências, todas em um arquivo só**:
`src/lib/data/alexandria-modulo-11-content.ts` — as notas
"Onde isso entra no produto" que a LYCEUM extraiu do Módulo 11. É prosa
de currículo descrevendo o produto, **não superfície, não catálogo, não
rota**. O produto não existe em código nenhum hoje.

Trilha nova confirmada. Esta é a **Wave 1**.

**Nota de nomenclatura, medida e não decidida:** o currículo o chama
`Solar Proposal Validator`, em inglês. O catálogo público
(`br-destinos.ts`) mistura os dois idiomas — "Conta de Luz Express",
"Diagnóstico Energético", "Energy Brief". Qual nome vai na face pública
é decisão de copy, não achado de recon; fica registrada como pendência.

---

## 1. O que existe do produto hoje, em cada camada

| Camada | Arquivo | Solar existe? |
| --- | --- | --- |
| Catálogo público (frontend) | `src/lib/data/br-destinos.ts` | **não** — 5 destinos, nenhum solar |
| Mapa família→produto | `src/lib/data/br-familias.ts` | **não** — Advisory tem 2 ids |
| Catálogo canônico (backend) | `app/db/models/product_access.py` | **não** — 5 ids |
| Rota | `src/main.tsx` | **não** |
| Planta baixa | `src/components/br/DestinoCard.tsx` | **não** — 4 chaves em `PLANTAS` |
| Router de API | `app/routers/` | **não** — só `conta_luz.py` |
| Prosa de currículo | `alexandria-modulo-11-content.ts` | **sim**, 8 menções |

O produto está **inteiramente descrito e inteiramente não construído**.
O Módulo 11 da Alexandria já especifica, em prosa, a arquitetura de
saída do relatório (eixos), o classificador de porte, o roteador de
regime e a ordem cronometrada de análise. Isso é insumo de produto, não
código — mas é a especificação mais completa que existe no repositório,
e a wave de build faz bem em lê-la antes de inventar campo de formulário.

---

## 2. Hipótese A — `ehAdvisory` é de família ou de produto?

### 2.1 O gate

`src/pages/br/FamiliaPage.tsx:238`:

```tsx
const ehAdvisory = familia.id === 'advisory';
```

O gate é de **família**. Ele não sabe qual produto está aberto, nem
quantos são.

### 2.2 A seção 01 (lista de produtos) É genérica — e já prova que aguenta

`FamiliaPage.tsx:432-495`. A lista mapeia `produtosDaFamilia(familia)`
e deriva cada linha do dado:

```tsx
{produtos.map((p) => {
  const aberto = p.status === 'disponivel' && p.rota !== null;
```

Nome, descrição, rota e o botão `Aberto →` versus a tag
`Em construção` saem todos de `br-destinos.ts`. A contagem no cabeçalho
(`${produtos.length} no catálogo`) é derivada. O estado vazio
(`produtos.length === 0`) é declarado, não inventado.

**Advisory já tem DOIS produtos nessa lista hoje** —
`conta-de-luz-express` e `diagnostico-energetico`
(`br-familias.ts`, `produtoIds`). Um terceiro, ou um segundo *aberto*,
entra por dado: acrescentar o destino em `br-destinos.ts` e o id em
`produtoIds`. **Nenhum componente muda para isso** — é o mesmo
mecanismo que a Wave 2 de Conta de Luz Express exercitou trocando dois
campos de dado e vendo a linha virar "Aberto →" sozinha.

Esta metade da página está pronta para N produtos.

### 2.3 O bloco 02 é do PRODUTO, não da família — cinco evidências

`FamiliaPage.tsx:626-719`, **94 linhas**. O gate é de família; tudo o
que está dentro é de Conta de Luz Express:

1. `aria-label="Conta de Luz Express"` (L628).
2. Cabeçalho de seção: `02` · **"Conta de Luz Express"** · nota
   **"o produto aberto hoje"** — a nota está no **singular** e afirma
   exclusividade. Com dois abertos, ela vira afirmação falsa.
3. As três colunas são copy de fatura, não de família:
   *"Uma fatura de energia industrial — PDF ou imagem"* ·
   *"modalidade tarifária, demanda contratada"*. Uma proposta solar não
   entra em nenhuma das três frases.
4. O CTA é `"Enviar uma fatura"`.
5. A resolução de rota é por id literal:
   `produtos.find((d) => d.id === 'conta-de-luz-express')`.

Comparação de controle: o bloco `ehAcademy` (L507-618, 112 linhas) tem
a mesma forma — gate de família, conteúdo de Alexandria. A diferença é
que Academy tem **um** produto e sempre terá um bloco; Advisory é a
única família do catálogo com mais de um produto.

### 2.4 Veredito: NÃO aguenta dois produtos abertos

Com Solar aberto, o estado atual produz um de dois defeitos, e nenhum é
aceitável:

- **Se o bloco ficar como está:** Solar aparece na lista genérica (01)
  com "Aberto →" e **desaparece da camada de profundidade**. A página da
  família passa a dar tratamento aprofundado a um produto aberto e
  silêncio ao outro, sem que nada na tela explique por quê. Pior: a nota
  "o produto aberto hoje" fica mentindo ao lado de uma lista que mostra
  dois abertos.
- **Se for copiado e colado um segundo bloco hardcoded:** o número de
  seção `02` colide (os dois blocos seriam `02`), a numeração da página
  deixa de poder ser derivada, e a família passa a carregar ~190 linhas
  de copy de produto dentro de um arquivo que serve as cinco famílias. É
  a terceira cópia do mesmo `if`, e a decisão que o comentário do código
  adiou chega igual — só que com dívida a mais.

**A generalização que o comentário de `FamiliaPage.tsx:231-238` adiou é
exatamente esta wave.** O comentário diz "generalizar o slot é decisão
de arquitetura para quando o terceiro produto abrir". Chegou o segundo
aberto; o gatilho real nunca foi a contagem de produtos da família, foi
a contagem de produtos **com bloco próprio**.

### 2.5 Três saídas, medidas — nenhuma implementada nesta wave

Ordenadas por custo, com o que cada uma custa de verdade:

| Saída | O que é | Custo | Risco |
| --- | --- | --- | --- |
| **A · Slot de dado** | O produto (ou a família) ganha um campo opcional com `{ titulo, colunas[], ctaRotulo, nota }`; `FamiliaPage` renderiza **um bloco por produto que declara o slot**, numerando `02`, `03`… a partir de `produtos`. | Toca dado + o corpo de `FamiliaPage`. Os dois `if` hardcoded morrem. | Meter copy de produto no arquivo de catálogo. Mitigável pondo o slot em módulo próprio que LÊ o catálogo, como `br-familias.ts` já faz. |
| **B · Componente por produto** | Um `BlocoProduto` que recebe o `DestinoBR` e o conteúdo; `FamiliaPage` mapeia. Academy migra junto ou fica onde está. | Arquivo novo em `src/components/br/`. | Migrar Academy no mesmo passo dobra a superfície de verificação. Migrar depois deixa dois idiomas convivendo no mesmo arquivo. |
| **C · Sem bloco de profundidade na família** | Solar (e CLE) ficam só na lista 01; a profundidade mora na página do produto, que já existe como rota de topo. | Remove 94 linhas. | Perde a camada "o que entra · o que sai · o que não é" da família, que é onde a tese da casa aparece antes do clique. |

**Recomendação do implementador, sujeita a veto:** **A**, com o slot em
módulo separado. É a única que faz a numeração voltar a ser derivada — o
defeito de fundo aqui não é o `if`, é que `02` está digitado em dois
lugares diferentes do mesmo arquivo. **Isto é recomendação, não
decisão** — a wave de build (ou o war room) escolhe.

### 2.6 O MESMO defeito, um nível acima: `PerfilPlataforma` seção 04

Não estava nas hipóteses do brief, mas é a mesma classe de achado e
bloqueia o mesmo produto.

`src/pages/conta/PerfilPlataforma.tsx:353` monta
`<Secao numero="04" titulo="Conta de Luz Express">` — o painel de status
de submissão, com os três estados (nada enviado · em leitura · parecer
pronto). Ele é alimentado por `listarSubmissoes()`, que aponta para
`/api/conta-luz-express/submissions`.

Um segundo produto Advisory com fluxo de envio precisa de status no
perfil também, e hoje isso significaria uma seção `05` copiada, com um
segundo cliente hardcoded. A numeração de `Secao` no arquivo é digitada
(`01` `02` `03` `04`), não derivada — mesmo defeito de fundo.

O que **não** precisa mudar: `rotularProduto()` (L61) já resolve o nome
contra `DESTINOS_BR`, então a linha de Solar na seção 03 (Produtos)
aparece com o título certo sozinha, assim que o backend servir o id no
`catalog`.

---

## 3. Hipótese B — `PlantaBaixa` para Solar

### 3.1 Não existe entrada, e existe fallback

`src/components/br/DestinoCard.tsx:82-133`. `PLANTAS` tem **4 chaves**:
`terminal-brasil`, `energy-brief`, `conta-de-luz-express`,
`diagnostico-energetico`. (Alexandria não está lá porque o card dela usa
`PreviaAlexandria`, não planta.)

`DestinoCard.tsx:143`:

```tsx
const tracos = PLANTAS[destinoId] ?? PLANTA_GENERICA;
```

`PLANTA_GENERICA` (L126) é moldura + fio + três retângulos. Um
`<PlantaBaixa destinoId="solar-proposal-validator" …>` **renderiza sem
quebrar** — desenha o esboço genérico, com a mesma revelação por traço.

Consequência prática: a tela de intake de Solar pode nascer com planta
genérica e ganhar geometria própria depois, sem buraco e sem
placeholder. Não é bloqueio.

### 3.2 Correção à hipótese do brief — a posse é ARCHITECT, não FOUNDRY

O brief supõe "se não existir, não é sua pra criar — é FOUNDRY".
**Medido, não é.**

`DestinoCard.tsx:1` — cabeçalho literal do arquivo:

```
// DestinoCard — ARCHITECT, Portal BR Wave 2 · Jaguar.
```

`src/components/br/` inteiro foi criado pelo ARCHITECT na Portal BR
Wave 1 (o registro no `CLAUDE.md` lista "src/components/br/ (4)"). O
roster de agentes dá à FOUNDRY `src/components/terminal/` e
`src/components/shared/` — não `br/`. As quatro entradas de `PLANTAS`
são todas ARCHITECT.

Uma entrada nova em `PLANTAS` é, portanto, **acréscimo de dado num
arquivo desta posse** — ~7 linhas de `Traco[]` no `viewBox 0 0 280 150`.
Continua sendo decisão da wave de build se vale a pena, mas não precisa
esperar por outro agente.

**Nota de fronteira que a wave de build precisa saber:** `DestinoCard`
em si é código morto desde a Portal BR Wave 8 (a grade de cards virou
faixa de famílias). Só as exportações `PlantaBaixa` e `PreviaAlexandria`
seguem vivas, importadas por `PortalBR.tsx` e pela tela de intake de
CLE. Editar `PLANTAS` mexe num arquivo cujo componente principal
ninguém renderiza mais.

---

## 4. Hipótese C — quanto da tela de intake é reusável

`src/pages/conta-de-luz-express/ContaDeLuzExpressPage.tsx`, **975
linhas**. Classificação por região, medida:

| Linhas | Região | Veredito |
| --- | --- | --- |
| 39-59 | Imports (tokens NIVAR, `portalChrome`, `PlantaBaixa`, `AuthContext`) | **reusável como está** |
| 61-73 | Constantes de layout + `TIPOS_ACEITOS` / `EXTENSOES_LEGIVEIS` | **reusável** — proposta comercial também é PDF ou imagem. Só `PRODUTO_ID` troca. |
| 75-131 | `NT` (papéis tipográficos) | **reusável como está** — é o idioma declarado localmente que todo componente do Portal repete |
| 132-163 | `comTransicao`, `formatarDataHora`, `formatarTamanho` | **reusável como está**, zero acoplamento |
| 165-260 | Tipos do contrato + cliente (`enviarSubmissao`, `listarSubmissoes`) | **adaptar** — ver §4.2 |
| 262-284 | `mensagemDeErro` (mapa de status HTTP → frase) | **reusável**, com **1 frase** a trocar (a do 503 diz "recebimento de faturas") |
| 286-393 | Estado + lógica (validação de tipo, ativação-antes-do-envio, `novoEnvio`, guarda de rota) | **reusável como está** — nada aqui menciona fatura, exceto `document.title` |
| 396-520 | Bloco `<style>` local (`.cle-arquivo*`, `.nv-btn:disabled`) | **reusável como está** — 8 classes, prefixo `cle-` é só nome |
| 521-975 | JSX de render | **estrutura reusável, copy a reescrever** — ver §4.1 |

### 4.1 A copy: 17 âncoras, enumeradas

Nome de variável e prefixo de classe não contam (o brief é explícito).
O que conta é texto que chega ao usuário. Lista completa, com linha:

| # | Linha | O que é |
| --- | --- | --- |
| 1 | 280 | `mensagemDeErro`, 503 — "O recebimento de **faturas** ainda não está ligado…" |
| 2 | 306 | `document.title` |
| 3 | 523 | Etiqueta do cabeçalho |
| 4 | 571 | `aria-label` do `<main>` rolável |
| 5 | 581 | `aria-label` da seção de identidade |
| 6 | 606 | `<h1>` |
| 7 | 609 | Lede — "Análise independente de **fatura industrial**…" (verbatim do catálogo) |
| 8 | 613 | Parágrafo de tese — "A **fatura** é lida por uma pessoa, não por um motor…" |
| 9 | 637 | `aria-label` da seção de envio |
| 10 | 650 | Título da seção — "Envio da fatura" / "Fatura recebida" |
| 11 | 669 | `<label>` do campo — "Fatura de energia" |
| 12 | 725 | Texto de ajuda — "A fatura completa, com as páginas de demanda e de tributos." |
| 13 | 794 | Estado de envio — "A fatura está subindo para o servidor." |
| 14 | 865 | Botão — "Enviar outra fatura" |
| 15 | 904 | Passo 1 — "A fatura entra" + descrição |
| 16 | 910 | Passo 2 — "Modalidade tarifária, demanda contratada, tributos e encargos" |
| 17 | 963 | Etiqueta do rodapé |

**O que NÃO precisa trocar, e é o achado que barateia a wave de build:**

- `var(--family-advisory)` no marcador de identidade (L594) — Solar é
  Advisory também. O fio da família serve os dois sem mudança.
- O rodapé "Não vende energia · não intermedia contrato · não recebe
  comissão" (L966) — é a tese da casa, verdadeira para os dois.
- A frase "lida por uma pessoa, não por um motor" continua verdadeira
  para Solar; só a palavra "fatura" muda.
- Os três passos de "Como funciona" mantêm a estrutura 1/2/3; só as
  descrições 1 e 2 mudam.

### 4.2 O cliente e os tipos: presos ao produto por duas coisas

```tsx
const BASE = '/api/conta-luz-express';          // L196
productId: 'conta-de-luz-express';              // L180 — TIPO LITERAL
```

O `BASE` é uma string. O **tipo literal em `Submissao.productId`** é o
que importa: reusar `Submissao` para Solar exige **alargar** o tipo
(união, ou genérico parametrizado pelo id). Não é difícil — é decisão de
contrato que precisa ser tomada de propósito, e o compilador vai cobrar
em `PerfilPlataforma.tsx`, que importa o tipo.

**A pendência já estava registrada.** `ContaDeLuzExpressPage.tsx:213-219`
declara, por escrito, que o cliente e os tipos moram num arquivo de
componente porque a Wave 3 não tinha posse para criar `src/lib/`, e que
mover é pendência. Um segundo produto com a mesma forma de contrato
(`POST /submissions` multipart · `GET /submissions` · deliverable) é
exatamente o gatilho para pagar essa dívida: um `src/lib/submissoes/`
parametrizado pelo prefixo serve os dois e apaga o
`eslint-disable react-refresh/only-export-components` de quebra.

**Aviso de forma:** o parágrafo acima **presume** que o backend de Solar
terá a mesma forma de contrato do de CLE. Isso **não foi medido** — o
router de Solar não existe. É a recon CURSOR paralela que responde. Se a
forma divergir (por exemplo, se Solar receber campos estruturados além
do arquivo — porte, data de protocolo, concentração de participação, que
é o que o Módulo 11 descreve), a extração para `src/lib/` fica mais cara
e talvez não valha.

---

## 5. A dependência de ordem que não é do frontend

Achado fora das três hipóteses, mas que **bloqueia a fase de build** se
for descoberto tarde.

`app/db/models/product_access.py:29` — `PRODUCT_CATALOG` tem cinco ids,
nenhum solar. O `CLAUDE.md` (CURSOR Wave 9) registra: *"produto fora do
catálogo responde 404, não 422"*.

A tela de intake de CLE faz, **antes de todo envio**
(`ContaDeLuzExpressPage.tsx:339-343`):

```tsx
const { products } = await myProducts();
if (!products.some((p) => p.productId === PRODUTO_ID)) {
  await activateProduct(PRODUTO_ID);
}
```

Uma tela de Solar copiada disso **falha no `activate` com 404** enquanto
o id não estiver no catálogo do backend. E o `POST /submissions` do
router de Solar (quando existir) devolverá `403` sem entitlement, pela
mesma guarda que a Wave 3 mediu no de CLE.

**Consequência de sequenciamento:** o frontend pode construir a tela e
ligá-la a qualquer momento, mas **não pode virar `status: 'disponivel'`
em `br-destinos.ts`** antes de o backend aceitar a ativação. Virar o
status cedo põe "Aberto →" na página da família apontando para uma tela
que erra no envio.

A ordem segura é: catálogo do backend → router → `br-destinos.ts` →
bloco de família. Isso é coordenação entre as duas trilhas, não decisão
de nenhuma delas sozinha.

---

## 6. O que a wave de build já herda pronto

Sem escrever uma linha:

- **Rota de topo** — `main.tsx` tem o precedente exato
  (`/conta-de-luz-express`, L121), e a recon de CLE (§5, Opção A) já
  registrou por que a página de família nunca hospeda produto.
- **Moldura de página** — `FOLHA_PORTAL` + `WordmarkNivar` de
  `portalChrome.tsx`, faixa incandescente, rodapé, alternador de modo.
- **Zona de upload inteira** — as 8 classes `.cle-arquivo*`, o input
  nativo invisível por cima do desenho (o truque do `Slider` do sistema,
  que existe porque "Choose File / No file chosen" não aceita tradução),
  e o `.nv-btn:disabled { opacity: .4 }` que a `FOLHA_PORTAL` não
  carrega.
- **Guarda de rota por sessão** — `!loading && !user` → `/entrar` com
  `state.de` para voltar.
- **Estados de erro sem semáforo** — fio `--campo-erro-fio` + glifo `×`
  + `role="alert"`, e o mapa de status HTTP → frase.
- **Confirmação como ESTADO, não tela** — ficha rótulo/valor com nome,
  tamanho, protocolo e data lidos da RESPOSTA do backend, não do
  browser.
- **A lista de produtos da família** (§2.2), que já aguenta N.
- **`rotularProduto`** no perfil, que resolve o nome contra o catálogo.
- **Fallback de planta baixa** (§3.1).
- **A especificação de produto mais completa do repositório** — o Módulo
  11 da Alexandria descreve os eixos do relatório, o classificador de
  porte, o roteador de regime e a ordem cronometrada. É prosa, não
  contrato, mas é o insumo certo para desenhar o formulário de entrada.

---

## 7. Pendências registradas, não resolvidas

1. **`ehAdvisory` não aguenta dois produtos abertos** (§2.4). Precisa
   ser resolvido **antes** de a UI de Solar entrar, ou a família passa a
   mentir na tela.
2. **`PerfilPlataforma` seção 04 tem o mesmo defeito** (§2.6), com
   numeração digitada em vez de derivada.
3. **Nome público do produto** não decidido (§0) — o currículo usa
   inglês, o catálogo mistura.
4. **Geometria de planta baixa para Solar** não existe; o fallback
   cobre.
5. **Cliente e tipos em arquivo de componente** — pendência aberta pela
   Wave 3 de CLE, que um segundo produto do mesmo formato torna cara de
   não pagar (§4.2).
6. **A forma do contrato de Solar não foi medida** — depende da recon
   CURSOR paralela. Toda recomendação de extração em §4.2 é condicional
   a ela.
7. **Ordem frontend↔backend** (§5) — não é livre, e o sintoma de errá-la
   é um 404 no envio, não um erro de build.
8. **`DestinoCard.tsx` segue como código morto** com duas exportações
   vivas. Não é problema desta wave; é contexto para quem for editar
   `PLANTAS`.


---

# Adendo — Wave 3, Fase 1 · contrato real confirmado

Confirmação contra o DISCO e contra PRODUÇÃO, não contra a memória da
Wave 2. Posse: este adendo é aditivo num doc desta própria trilha — o
brief da Wave 3 não o lista, mas a fase exige commit de relatório e
este é o documento vivo (mesmo precedente do adendo da CLE Wave 3).

## H1 · Os três endpoints, lidos do router real

`app/routers/solar_proposal.py` (CURSOR Wave 2), prefixo
`/api/solar-proposal-validator`:

| Endpoint | Forma |
| --- | --- |
| `POST /submissions` | multipart, campo `file` → **201** com `_submission_payload` |
| `GET /submissions` | `{ data[], summary: {count, submitted, ready} }`, mais recente primeiro, **sem exigir entitlement** (lista por `user_id`) |
| `GET /submissions/{id}/source` · `/deliverable` | bytes com `Content-Disposition: attachment`, `nosniff`, `no-store` |

Payload **campo a campo igual ao de CLE** (`id, productId, status,
source{filename,contentType,sizeBytes,sha256,downloadUrl},
deliverable|null, createdAt, updatedAt, deliveredAt`).

**Guardas do POST, na ordem em que disparam:**

1. `_require_entitlement` → **403** `product 'solar-proposal-validator' is not active for this account`
2. `email_config()` → **503** nomeando a variável ausente — o conjunto
   é `SPV_APP_BASE_URL` / `ADVISORY_OPERATOR_EMAIL` / `SPV_EMAIL_FROM`
   / `RESEND_API_KEY` (operador COMPARTILHADO com CLE; `SPV_*` próprios)
3. `read_source_upload` → **415** por ASSINATURA DE BYTES (PDF `%PDF-`,
   JPEG, PNG, WEBP — declarado divergente da assinatura também é 415) ·
   **413** acima de 15 MB (`SPV_MAX_SOURCE_BYTES`, default 15 MiB)
4. Resend falhou → **502** com rollback (a submissão NÃO fica gravada)

**Produção MEDIDA por HTTPS**: `GET /api/solar-proposal-validator/
submissions` sem sessão → **401 `not authenticated`** — o router está
NO AR, mesmo comportamento do de CLE. O que falta em produção são as
variáveis de email (o 503 da guarda 2), não o deploy.

## H2 · Onde o modo DEMO- vive na página

Cirurgia limpa, sem lógica real enredada:

- `submissaoDemonstracao()` — a fábrica do protocolo sintético; único
  consumidor é `aoEnviar` (uma linha).
- `aoEnviar` — síncrono, zero rede; vira async com o cliente canônico.
- O banner tracejado "Demonstração — o envio ainda não abriu" na
  seção 01.
- Rótulos do estado confirmado: nota do cabeçalho `demonstração`,
  "Demonstração registrada na tela", "Protocolo de demonstração",
  "Gerado em", "O que aconteceu", botão "Testar com outro arquivo",
  nota "Nada sai desta tela", botão "Testar o fluxo".

Nada mais na página depende do mock.

## H3 · A página NÃO tem cópia de cliente

Ela importa **só `type Submissao`** de `src/lib/submissoes/api.ts` —
zero `fetch`, zero cliente próprio (grep: nenhuma ocorrência de
`criarClienteSubmissoes`, `enviarSubmissao` ou `fetch(` no arquivo).
Não existe segunda cópia a matar: a fiação entra direto pelo canônico.
(A cópia local que segue viva é a da PÁGINA DE CLE — fora desta wave,
como a Wave 2 já registrou.)

## Consequência para a Fase 2

- Envio via `criarClienteSubmissoes` do canônico, com o prefixo do
  REGISTRO (`FLUXOS_SUBMISSAO`) — uma fonte só.
- Ativação antes do envio (`myProducts` → `activateProduct` só se
  faltar) + guarda de rota por sessão — o par que a CLE Wave 3 trouxe
  junto, e que a Wave 2 desta trilha declarou que entraria com a fiação.
- Mapa de erro por status na página: 0 rede · 401 sessão · 403
  entitlement · 413 tamanho (15 MB é declarável agora — o contrato
  existe) · 415 tipo · 502 notificação · 503 variável de produção.
- Em dev, o ciclo real esperado termina no **503** (variáveis de email
  ausentes em produção, para onde o proxy aponta) — estado declarado na
  tela, não falha da fiação.
