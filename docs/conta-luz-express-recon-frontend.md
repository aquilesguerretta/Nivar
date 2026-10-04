# Conta de Luz Express — recon de ponto de integração (frontend)

**Wave:** ARCHITECT — Conta de Luz Express Wave 1. Trilha nova;
confirmado no CLAUDE.md que nenhuma seção `CONTA DE LUZ EXPRESS`
existia antes desta.

**Escopo:** recon. Zero código escrito, zero arquivo de produto
modificado. Tudo abaixo foi lido no código ou medido no render — nada
presumido a partir do brief.

**Método:** leitura de `PortalBRRouter.tsx`, `FamiliaPage.tsx`,
`br-familias.ts`, `br-destinos.ts`, `main.tsx`, `AlexandriaRouter.tsx`
e `DestinoCard.tsx`, mais varredura de `<Route` em todo
`src/pages/br` + `src/components/br` e de `activateProduct` em todo
`src/`. As duas páginas de família (Advisory e Academy) foram
**renderizadas** e o texto lido do DOM.

---

## Veredito curto

Separando as duas coisas que o brief junta numa pergunta só:

| O quê | Precisa de mecanismo novo? |
| --- | --- |
| A linha do produto virar **"Aberto →"** na página de família | **Não.** É troca de dois campos de dado. Zero mudança em componente. |
| O produto ter **superfície própria** (uma tela) | **Sim, uma rota que não existe** — mas nas duas opções com precedente é UMA LINHA num router que já existe. Mecanismo novo, não. |
| A Advisory ganhar **bloco próprio** na página de família (como a Academy tem) | **Sim, e este é o trabalho estrutural real.** O bloco da Academy é condicional hardcoded, não slot. Ver §2.3. |

**Rota de produto individual NÃO é extensão da rota de família.** O
precedente existente (Alexandria) põe o produto em rota de TOPO e faz
a página de família apenas apontar para lá.

---

## 1. Hipótese A — `FamiliaPage` provisiona rota de produto?

**Não. Zero provisionamento.** Medido, não deduzido.

`PortalBRRouter.tsx` tem exatamente **três** rotas, e
`familia/:familiaId` é **folha**:

```tsx
<Route index element={<PortalBR />} />
<Route path="familia/:familiaId" element={<FamiliaPage />} />
<Route path="*" element={<PortalBR />} />
```

Varredura de `<Route` em todo `src/pages/br` + `src/components/br`
devolve **só essas três**. Não existe `produto/:produtoId` em lugar
nenhum da árvore BR.

Dentro do `FamiliaPage`, produto é **linha de lista**, não destino. O
elemento terminal da linha é um de dois, decidido em uma linha
(`FamiliaPage.tsx:426`):

```tsx
const aberto = p.status === 'disponivel' && p.rota !== null;
```

- `aberto` → `<Link className="nv-btn nv-btn--primario" to={p.rota}>`
  com o rótulo `Aberto →`, e navegação por view transition.
- senão → `<span>` com a etiqueta `Em construção`. **Não é link** —
  o comentário no código é explícito: *"não há para onde ir"*.

Consequência para a wave de build: **a página de família não hospeda
produto, ela aponta para produto.** O que ela sabe fazer é renderizar
um link quando o catálogo diz que existe destino.

---

## 2. Hipótese B — como a Academy chegou a ter a Alexandria "aberta"

Este é o precedente mais próximo, e ele tem **cinco** partes. Nenhuma
delas é um mecanismo da página de família.

### 2.1 A rota é de TOPO, não aninhada na família

`main.tsx:112`:

```tsx
<Route path="/alexandria/*" element={<AlexandriaHome />} />
```

A Alexandria **precede a camada de família inteira**. `br-destinos.ts`
apenas declara `rota: '/alexandria?trilha=brasil'`, e o `FamiliaPage`
renderiza um link para essa string. A família nunca hospedou nada.

### 2.2 O estado "aberto" é 100% dirigido por dado

Em `br-destinos.ts`, Alexandria é o único com:

```ts
status: 'disponivel',
rota: '/alexandria?trilha=brasil',
```

Os outros quatro — incluindo `conta-de-luz-express` — são
`status: 'em-breve'`, `rota: null`.

**Virar a chave é editar esses dois campos.** O `FamiliaPage` não muda
uma linha: o `aberto` da §1 passa a ser `true` e o botão primário
aparece sozinho. `conta-de-luz-express` **já está** em
`FAMILIAS_BR.advisory.produtoIds` — a atribuição de família não
precisa de nada.

O que a troca exige é que `rota` aponte para um endereço que **exista**
— senão o botão leva ao catch-all e cai no Portal.

### 2.3 O bloco extra da Academy é CONDICIONAL HARDCODED, não slot

Este é o achado que mais importa para a wave de build.

`FamiliaPage.tsx:231`:

```tsx
const ehAcademy = familia.id === 'academy';
```

`FamiliaPage.tsx:499`:

```tsx
{ehAcademy && ( <section aria-label="A Alexandria em números"> … )}
```

O conteúdo dentro é **inteiramente específico da Alexandria**: a
gravura (`ALEXANDRIA_GRAVURA_SRC`), o papel do sistema Alexandria
hardcoded (`ALEXANDRIA_PAPEL = '#F2E9D6'`), contadores derivados de
`ALEXANDRIA_TRILHAS` / `ALEXANDRIA_BLOCKS`, e um CTA que procura
`produtos.find((d) => d.id === 'alexandria')`.

**Não existe** `familia.blocoExtra`, nem slot, nem registro, nem
qualquer campo em `FamiliaBR` que descreva conteúdo próprio. `FamiliaBR`
tem oito campos e nenhum deles é conteúdo de bloco: `id`, `nome`,
`dominio`, `hex`, `token`, `paragrafo`, `produtoIds`, `porQue`.

Se a Advisory quiser um bloco próprio, há dois caminhos e nenhum é de
graça:

- **segundo `if`** (`const ehAdvisory = familia.id === 'advisory'`) —
  barato, mas é o começo da divergência que o próprio cabeçalho do
  arquivo diz que a decisão de "um componente, cinco rotas" existe para
  evitar: *"quando uma família crescer o bastante para precisar de
  composição própria, ela ganha o arquivo dela"*;
- **generalizar o slot** — trabalho maior, e é decisão de arquitetura,
  não de implementação. Fica para o war room.

A numeração de seção depende disso: hoje Academy fecha em `01 · 02` e
as outras quatro em `01` sozinho (comentário em `FamiliaPage.tsx:227-230`).
Um bloco na Advisory a leva para `01 · 02` também.

### 2.4 A ativação acontece DENTRO do produto, não na família

Varredura de `activateProduct` em todo `src/` devolve **dois** call
sites, e só um está vivo:

| Arquivo | Estado |
| --- | --- |
| `src/pages/alexandria/PerfilStub.tsx:114` | **VIVO** — a tela de perfil da própria Alexandria (LYCEUM Wave 23) |
| `src/components/br/DestinoCard.tsx:345` | **CÓDIGO MORTO** — `DestinoCard` perdeu o consumidor na Wave 8; só `PlantaBaixa` ainda é importado desse arquivo |

Ou seja: o precedente real é **o produto ativa a si mesmo quando a
pessoa entra nele**, com `myProducts()` consultado antes para não
gastar escrita à toa. A página de família nunca ativou nada.

### 2.5 Produto com várias telas tem router próprio

`AlexandriaRouter.tsx` declara **dez** rotas sob o splat
`/alexandria/*` (`index`, `trilha/:trilhaId`, `.../modulo/:moduloId`,
`.../modulo/:moduloId/jogo`, `.../aula/:aulaNumero`, `biblioteca`,
`perfil`, `atlas`, `glossario`, catch-all).

É o modelo pronto para um produto que precise de mais de uma tela — e
Conta de Luz Express provavelmente precisa (entrada da fatura →
resultado, no mínimo).

---

## 3. Hipótese C — conteúdo real da Advisory hoje, exato

**Medido no render** (`/br/familia/advisory`), não deduzido.
`document.title` = `NIVAR — Advisory`.

Texto integral da página, verbatim:

```
ADVISORY
← Portal Brasil
CLARO · NOTURNO

FAMÍLIA
Advisory
Parecer e contraditório
Parecer sobre um caso concreto, com o contraditório produzido junto —
não depois. A conclusão vem acompanhada do argumento que a contesta.

01  PRODUTOS                                        2 NO CATÁLOGO
Conta de Luz Express
Análise independente de fatura industrial — modalidade, demanda e
oportunidades a validar.                              EM CONSTRUÇÃO

Diagnóstico Energético
Análise 360° do custo energético de uma operação industrial.
                                                      EM CONSTRUÇÃO

ADVISORY
FONTES · ONS · ANEEL · CCEE · EPE
```

**Correção à descrição do brief:** o brief descreve o estado como
`"PARECER E CONTRADITÓRIO · 2 PRODUTOS · EM CONSTRUÇÃO"`. A string
real da nota de seção é **`2 NO CATÁLOGO`**, não "2 PRODUTOS"; e
`EM CONSTRUÇÃO` é etiqueta **por produto**, não estado da família.
Registrado para a wave de build não escrever copy contra uma string
que não existe.

**Nada aqui precisa ser duplicado.** A descrição do produto
(`br-destinos.ts:56-57`) já é a linha de face pública, e respeita a
disciplina de linguagem do catálogo — *"oportunidades a validar"*,
nunca "economize X%".

---

## 4. O que a wave de build já herda pronto

Medido, não suposto:

- **Planta baixa do produto já desenhada.** `DestinoCard.tsx:105-114`
  tem a geometria de `conta-de-luz-express`, e `PlantaBaixa` **está
  vivo** (importado por `PortalBR.tsx:114` para o overlay "em breve").
  Reaproveitável sem tocar em arquivo órfão.
- **O backend já reconhece o id.** `app/db/models/product_access.py:33`
  lista `conta-de-luz-express` no `PRODUCT_CATALOG`, então
  `POST /api/products/conta-de-luz-express/activate` já resolve hoje —
  a fiação de conta não precisa de mudança de catálogo. (A wave CURSOR
  em paralelo cobre capacidade de backend; isto aqui é só a constatação
  de que o id já existe.)
- **A atribuição de família já está feita.**
  `br-familias.ts:109` — `produtoIds: ['conta-de-luz-express',
  'diagnostico-energetico']`.
- **`AuthProvider` já envolve a árvore inteira** (`main.tsx:31`), então
  qualquer superfície nova lê `useAuth()` sem fiação nova.
- **Trava de DEV já cobre órfão**: `br-familias.ts` avisa em console se
  um produto do catálogo ficar sem família ou aparecer em duas.

---

## 5. Onde a superfície pode morar — três opções, com o precedente de cada

A decisão é do war room; recon não a fecha. As três, com o que cada uma
custa e o que a sustenta:

| Opção | Endereço | Precedente | Custo |
| --- | --- | --- | --- |
| **A** | `/conta-de-luz-express/*` (topo) | **Exato** — é o que a Alexandria faz | 1 linha em `main.tsx` + router próprio do produto |
| **B** | `/br/conta-de-luz-express` | **Nenhum de uso, mas antecipado por escrito** | 1 linha em `PortalBRRouter.tsx` |
| **C** | `/br/familia/advisory/conta-de-luz-express` | **Nenhum** | rota aninhada nova; sem precedente na árvore |

**Sobre a B:** o cabeçalho de `PortalBRRouter.tsx` registra que o
prefixo `familia/` foi escolhido **justamente** para que outras
sub-páginas do Portal pudessem coexistir sem desambiguação — cita
`/br/precos` e `/br/sobre` como exemplos. Um produto sob `/br/` é
exatamente o caso que aquela decisão antecipou. Não tem precedente de
uso, mas tem precedente de intenção, escrito no arquivo.

**Sobre a C, e por que a desaconselho:** acopla o endereço do produto a
uma taxonomia de marketing. O design system é explícito — *"a casa
marca as cinco famílias comerciais, não os 44 produtos"* — e a própria
`br-familias.ts` declara que a atribuição produto→família é
**atribuição do implementador, sujeita a veto**. Se Conta de Luz
Express for reatribuída um dia, a URL quebra. Um endereço citável não
deve depender de uma decisão declarada como revisável.

Entre A e B, a diferença real é se o produto é irmão do Portal ou filho
dele — pergunta de arquitetura de informação, não de código.

---

## 6. Sequência mínima que a wave de build precisa cobrir

Derivada dos achados acima, na ordem em que as dependências mandam:

1. **Decidir o endereço** (§5). Tudo depois depende disso.
2. **Construir a superfície** — com router próprio se tiver mais de uma
   tela (§2.5).
3. **Ativar dentro do produto**, no padrão do `PerfilStub` da
   Alexandria: `myProducts()` primeiro, `activateProduct` só se faltar
   (§2.4).
4. **Virar a chave no catálogo** — `status: 'disponivel'` + `rota` em
   `br-destinos.ts`. A linha da Advisory passa a "Aberto →" sozinha
   (§2.2). **Esta é a única mudança que a página de família precisa, e
   ela não é na página.**
5. **Decidir se a Advisory ganha bloco próprio** (§2.3) — e, se sim,
   decidir entre segundo `if` e generalizar o slot. É a única parte com
   trabalho estrutural de verdade neste conjunto.

---

## Pendências registradas, não resolvidas

- **`DestinoCard.tsx` é código morto com uma chamada de
  `activateProduct` viva dentro.** Não quebra nada hoje (ninguém monta
  o componente), mas é uma segunda implementação de ativação divergindo
  em silêncio da do `PerfilStub`. Alguém deveria decidir se apaga ou
  reaproveita; não é desta wave.
- **O bloco condicional da Academy não escala** (§2.3). O segundo
  produto aberto expõe isso, seja ele Conta de Luz Express ou outro.
- **`FamiliaBR` não tem campo de conteúdo próprio.** Se a resposta ao
  item anterior for "generalizar", é aqui que o campo nasce.

---

# Adendo — Wave 2, Fase 1 · reconciliação antes de construir

Quatro hipóteses do brief da Wave 2, cada uma confirmada contra o disco
antes de criar qualquer arquivo.

## H1 · Rota: a recomendação do war room BATE com a recon

War room recomendou `/conta-de-luz-express`, rota de topo. É
**exatamente a Opção A** da §5 acima — a única das três com precedente
**exato** (`/alexandria/*`, `main.tsx:112`). A recon tinha deixado A × B
como decisão de arquitetura de informação (irmão × filho do Portal); o
war room decidiu por irmão. Nenhum descompasso. Segue.

## H2 · O "pipeline de PDF" do frontend é feature ALHEIA

Localizado: `src/services/pdfExport.ts` + `src/services/pdfTemplates/`
(CONDUIT, Wave 4 do terminal americano). Usa `@react-pdf/renderer` para
**GERAR** PDF a partir de dado estruturado — `exportStrategyMemo`,
`exportStorageBidPack`, `exportUnderwritingMemo`, `exportAnalystReport`
— e devolve Blob para download no cliente.

É a **direção oposta** do que este produto precisa: aqui o usuário
**sobe** um PDF/imagem, ninguém gera nada. Não existe ali parser,
leitor, `<input type="file">` nem tratamento de upload. Coincidência de
palavra-chave, como o brief suspeitou. **Não reutilizável; não tocado.**

## H3 · Número real de telas: UMA

O fluxo v1 é: upload (PDF ou imagem) → enviar → confirmação. Intake e
confirmação são **estados** de uma tela, não telas — a confirmação não
tem endereço próprio a citar nem conteúdo que justifique navegação. O
"relatório pronto" vive no Perfil (Fase 4), não aqui.

Logo: **rota rasa `/conta-de-luz-express`, um componente, sem router
próprio.** `AlexandriaRouter` tem dez rotas porque a Alexandria tem dez
superfícies; montar um splat para uma tela seria estrutura maior que o
necessário — o que o brief mandou evitar. Se a v2 trouxer histórico de
envios ou tela de relatório, a rota vira splat nessa hora, sem
migração (o padrão `/x/*` já existe para copiar).

## H4 · Os dois produtos de "2 NO CATÁLOGO"

`br-familias.ts:109` — `produtoIds: ['conta-de-luz-express',
'diagnostico-energetico']`. Confirmado em `br-destinos.ts:54` e `:62`.
**Só `conta-de-luz-express` é desta wave**; `diagnostico-energetico`
fica `em-breve`/`rota: null`, byte-idêntico.

## Conflito de posse, declarado ANTES de editar

A Fase 3 pede "troca de `status`+`rota`, sem tocar componente". Esses
dois campos vivem em **`src/lib/data/br-destinos.ts`**, e o brief lista
`src/lib/data/` como NUNCA MODIFICAR. As duas instruções colidem.

Medido: **cinco consumidores** leem `status`/`rota` de `DESTINOS_BR`
(`FamiliaPage.tsx:426`, `FaixaFamilias.tsx:115/237`, `PortalBR.tsx:540`,
`PerfilPlataforma.tsx:250`, mais o `DestinoCard` morto). Não existe
caminho para "Aberto →" sem alterar esse dado — qualquer alternativa
(mapa paralelo, override em componente) seria exatamente a "segunda
cópia que deriva" que o próprio `PerfilPlataforma` documenta como
proibida. E o precedente da Academy fez isso nesse arquivo: o
`status: 'disponivel'` da Alexandria mora em `br-destinos.ts`.

**Decisão:** editar `br-destinos.ts` em **duas linhas** (`status` e
`rota` de um único produto), em commit próprio e isolado, porque é a
única forma de entregar a Fase 3 como o brief a descreve. É a
"exceção mínima de posse" que Waves 15 e 38 do LYCEUM já registraram
pelo mesmo motivo. Vetar é `git revert` de um commit.

## O que fica pronto para as Fases 2-4

- `PlantaBaixa` (vivo, `DestinoCard.tsx:105-114`) é a geometria do
  produto — reusada, não redesenhada.
- `PerfilStub.tsx:102-127` é o padrão de ativação — **não replicado
  nesta wave** (seria chamada real de rede; a wave é mock). Fica
  documentado como a forma da fiação real.
- `ehAcademy` (`FamiliaPage.tsx:231`) é o molde do `ehAdvisory`.

---

# Adendo — Wave 3, Fase 1 · contrato real dos endpoints

Lido em `app/routers/conta_luz.py` (CURSOR Wave 2) e **medido ao vivo**
contra o backend que o browser alcança, com sessão real. Nada presumido.

## Endpoints (prefixo `/api/conta-luz-express`)

| Método | Caminho | Auth | Request | Resposta |
| --- | --- | --- | --- | --- |
| `POST` | `/submissions` | cookie (`get_current_user`) | **multipart**, campo `file` | `201` + payload de submissão |
| `GET` | `/submissions` | cookie | — | `{ data: payload[], summary: { count, submitted, ready } }`, mais recente primeiro |
| `GET` | `/submissions/{id}` | cookie | — | payload |
| `GET` | `/submissions/{id}/source` | cookie | — | bytes do arquivo enviado (`Content-Disposition: attachment`) |
| `GET` | `/submissions/{id}/deliverable` | cookie | — | bytes do PDF final |
| `POST` | `/submissions/{id}/deliverable` | cookie + operador | multipart | — (fora desta wave: é do operador) |

**Autenticação é a mesma da plataforma** — `Depends(get_current_user)`,
o cookie `httpOnly` que o `AuthProvider` já carrega. Chamada por caminho
relativo com `credentials: 'include'`, igual ao `authApi.ts`. Não passa
pelo `fetchEnvelope` de mercado: a resposta é JSON plano.

## Payload de submissão

```ts
{
  id: string;                // uuid
  productId: 'conta-de-luz-express';
  status: 'submitted' | 'ready';   // os DOIS estados do backend
  source: { filename, contentType, sizeBytes, sha256, downloadUrl };
  deliverable: null | { filename, contentType, sizeBytes, sha256, downloadUrl };
  createdAt: string;         // ISO
  updatedAt: string;
  deliveredAt: string | null;
}
```

**`deliverable` só existe com `status === 'ready'`** e já traz o
`downloadUrl` (relativo) — o link do PDF final vem no próprio status,
sem segunda chamada.

## Mapa de estados: três na UI, dois no backend

A UI da Wave 2 tinha `nada · em-leitura · pronto`. O backend tem
`submitted · ready` **por submissão**. "Nada enviado" não é status —
é `data.length === 0`. Mapeamento:

| UI | Fonte |
| --- | --- |
| nada enviado | `GET /submissions` → `data: []` |
| em leitura | última submissão com `status: 'submitted'` |
| parecer pronto | última submissão com `status: 'ready'` → `deliverable.downloadUrl` |

Como a lista vem ordenada por `created_at desc`, **`data[0]` é a
submissão corrente**.

## Guardas do POST, NA ORDEM em que disparam

1. `_require_entitlement` → **`403`** `product 'conta-de-luz-express' is
   not active for this account`. **Medido.** A Wave 2 não ativava o
   produto (era mock); a fiação real precisa do padrão `PerfilStub`
   (`myProducts()` → `activateProduct` se faltar) ANTES do envio.
2. `email_config()` → **`503`** com o nome da variável ausente.
   **Medido com entitlement: `CLE_APP_BASE_URL is not configured`.**
3. `read_source_upload` → `413` (> 15 MB, `CLE_MAX_SOURCE_BYTES`) ou
   `415` (tipo não aceito — detectado pelos BYTES, não só pelo header).
4. Falha do Resend → `502`, com rollback — a submissão NÃO é criada.

Também `401` sem sessão (medido) e, na listagem, `404` para id de
outra conta (sem revelar existência).

## Correção à premissa do brief — onde o `503` mora

O brief diz que "em desenvolvimento o endpoint funciona" e que a CURSOR
"testou o ciclo completo com PDFs reais". As duas coisas são verdade
**dentro do harness Python dela** (TestClient em processo + transporte
HTTP simulado do Resend — doc dela, §"Configuração necessária").

**Não existe backend de dev alcançável pelo browser.** `vite.config.ts`
faz proxy de `/api` para `DEFAULT_RAILWAY` (produção);
`VITE_BACKEND_URL` está vazio no `.env.local`; nenhum processo local
na 8000. Medido: `POST` com sessão e entitlement → **`503`** em
produção.

Consequência: a fiação se constrói igual e o `503` vira um dos estados
tratados; mas a prova "upload real → status `ready`" ponta a ponta pelo
browser **depende das quatro variáveis no Railway** (ação do Aquiles).
Registrado como dependência de verificação, não como falha desta wave.

## Efeito colateral da medição

A sonda ativou `conta-de-luz-express` na conta de teste
`lyceum.w39.1785853407227@gridalpha.com` (a mesma que as Waves 39/31
deixaram no banco). É a ação que o produto fará de verdade; nenhuma
submissão foi criada (o `503` rolou antes).

---

# Adendo — Wave 5 · Fase 1 (migrar pro cliente canônico)

## Numeração: é a Wave 5, não a 4

O brief presumia 4. Contra o disco:

- **`CLAUDE.md`** — a última seção registrada da trilha é
  `ARCHITECT — CONTA DE LUZ EXPRESS WAVE 3` (L9547). Não há seção de
  Wave 4.
- **`git log`** — mas existem TRÊS commits `wave 4` desta trilha:
  `7d7a8db` (fase 1 · recon de renderização com marcação),
  `d6fa95d` (fase 2 · `docs/pendencias-infra.md`) e
  `5de9ba7` (adendo cruzando com a recon da CURSOR). Os três tocaram
  **só documentação** — foi uma wave de reconhecimento, cuja posse não
  incluía o `CLAUDE.md`.

Precedente exato no repositório: a wave de reconhecimento que produziu
`docs/portal-br-familia-audit.md` commitou como "wave 7" sem registrar
seção, e a numerada seguinte foi a **8**, não a 7 (Portal BR Wave 8).
Mesma regra aqui — o número 4 já está gasto no histórico. Esta é a **5**.

## H1 — a Wave 3 rodou? SIM

Não presumido pelo comentário de código. Confirmado nas duas fontes:

| Sinal | Evidência |
| --- | --- |
| `CLAUDE.md` L9547 | seção completa, **status fechada** |
| `git log` | `a00dc31` fase 1 · `16500eb` fase 2 (envio) · `9877cc4` fase 3 (status) · `4848925` fase 4 (verificação e fechamento) |

A premissa do brief está correta: a UI já fala com o backend real. Esta
wave não liga nada — troca a fonte do cliente.

## H2 — a página ainda usa cliente e tipos locais? SIM, intocada

`ContaDeLuzExpressPage.tsx` L169-260, exatamente como a Wave 3 deixou:
`ArquivoSubmissao` · `Submissao` · `ListaSubmissoes` · `BASE` ·
`falhar()` · `enviarSubmissao()` · `listarSubmissoes()`, mais os dois
`eslint-disable react-refresh/only-export-components`.

**Achado que amplia a migração — as duas exportações estão ÓRFÃS.**
O comentário do arquivo declara o motivo de exportá-las: *"Exportada
para o PerfilPlataforma ler o status com o mesmo tipo"*. Esse motivo
morreu — `PerfilPlataforma.tsx` **já migrou** para o canônico (L43-47:
`criarClienteSubmissoes`, `FLUXOS_SUBMISSAO`, `FluxoSubmissao`,
`Submissao` de `../../lib/submissoes/api`) e **não importa nada** da
página de CLE.

Varredura de consumidores em todo o `src/`:

| Símbolo | Consumidores |
| --- | --- |
| `listarSubmissoes` | **zero** — nem dentro do próprio arquivo |
| `enviarSubmissao` | **um**, interno (L350, `aoEnviar`) |

Logo a migração não é só troca de import: apaga duas exportações sem
consumidor e as duas supressões de lint que só existiam por causa
delas. Fecha por inteiro a pendência que a Wave 3 registrou.

## H3 — o `status` de CLE já deveria ter mudado e não mudou? NÃO

`br-destinos.ts` já traz `conta-de-luz-express` com
`status: 'disponivel'` e `rota: '/conta-de-luz-express'`, desde a Wave
2 (`265ca02`, a exceção mínima de posse daquela wave). **Não há
esquecimento a corrigir — o arquivo não será tocado.**

Os dois produtos estão mesmo em estados diferentes, como o brief
suspeitava: `solar-proposal-validator` segue `em-breve` / `rota: null`
**deliberadamente** (regra absoluta da Solar Wave 2 — "registrado, não
ativado"), não por esquecimento. Abrir Solar é decisão da trilha dela,
não desta.

## Diferença de contrato a absorver na Fase 2

`Submissao.productId` é literal `'conta-de-luz-express'` na cópia local
e `string` no canônico. É alargamento — nenhum uso da página depende da
estreiteza, e o `FLUXO_CLE` do registro canônico carrega o `prefixo`
`/api/conta-luz-express`, idêntico ao `BASE` local.

## Risco de sessão paralela

A Solar Proposal Validator Wave 3 está em voo (`ae7be75` é HEAD) e a
fase dela é justamente ligar a página dela ao canônico — ou seja, pode
escrever em `src/lib/submissoes/api.ts`, que é SOMENTE LEITURA aqui.
Meu consumo depende só de `criarClienteSubmissoes` e dos tipos.
`git diff --stat` real e pathspec explícito antes de cada commit.
