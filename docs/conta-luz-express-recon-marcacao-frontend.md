# Conta de Luz Express — recon de renderização com marcação (frontend)

**Wave:** ARCHITECT — Conta de Luz Express Wave 4. Confirmado no
CLAUDE.md: Waves 2 e 3 têm seção; esta é a 4.

**Escopo:** recon. Zero código escrito. A pergunta é **só "como
renderizar"** a fatura com marcação posicionada — a marcação é tratada
como dado que já chega pronto. **Como ela é criada é a CURSOR Wave 3**,
e este documento não decide nada sobre isso.

**Estado da Wave 3 (ARCHITECT):** fechada em `4848925` antes desta
leitura; working tree dos arquivos dela limpo. Nada do que foi lido
aqui estava no meio de mudança.

**Método:** varredura de `src/` por import, por MIME type, por
elemento (`<embed>/<object>/<iframe>`, `<canvas>`, `<img>`) e por
padrão de posicionamento; leitura dos candidatos a precedente; leitura
**somente** de `app/` para um fato que decide o caminho (abaixo).

---

## Veredito curto

| Hipótese | Achado |
| --- | --- |
| H1 · Renderizar PDF no frontend | **Não existe.** Zero leitor/rasterizador; a única lib de PDF GERA documentos. |
| H2 · Componente uniforme PDF + imagem | **Não existe.** O único precedente de arquivo do usuário (Trade Journal) é imagem-apenas. |
| H3 · Overlay posicionado sobre superfície visual | **EXISTE, e é precedente direto** — o mapa do `PortalHero`. Técnica transferível sem invenção. |

**Achado fora das hipóteses, e é o que mais pesa:** o endpoint que
serve a fatura (`GET …/source`) responde com `Content-Disposition:
attachment`. O browser **baixa** o arquivo em vez de exibi-lo. Nenhum
caminho de exibição — nem `<img>`, nem `<object>`, nem um leitor futuro
— funciona contra esse header sem uma mudança de uma linha no backend
(território CURSOR). Ver §4.

---

## 1. H1 — capacidade de renderizar PDF

**Nenhuma.** Medido em quatro direções:

- `package.json`: a única dependência de PDF é `@react-pdf/renderer`
  (`^4.5.1`). É **escritor** — a cadeia `@react-pdf/{pdfkit, layout,
  render, …}` em `node_modules` é toda de geração. Sem `pdfjs-dist`,
  `pdf-lib`, `react-pdf`, `@react-pdf-viewer/*`, nem por
  transitividade.
- `src/`: zero import de leitor. Zero `<embed>/<object>/<iframe>`
  apontando para PDF. Nada vendorizado em `public/`.
- O único `getContext('2d')` do codebase (`src/services/pdfExport.ts:79`,
  `svgStringToPngDataUrl`) rasteriza **SVG → PNG** para alimentar o
  gerador — é a mesma pipeline CONDUIT que a Wave 2 já tinha
  descartado como "direção oposta".
- **Backend também não rasteriza:** `requirements.txt` e
  `app/services/` sem `pdf2image`, `pymupdf`, `pdfium`, `ghostscript`
  nem `Pillow`. O storage (`conta_luz_storage.py:75-84`) detecta o tipo
  pelos **bytes mágicos** (`%PDF-`, `\xff\xd8\xff`, `\x89PNG`, `RIFF…WEBP`)
  e guarda os bytes como estão.

**Consequência:** exibir uma fatura em PDF exige trazer capacidade
nova. As opções, sem escolher (é decisão de brief):

| Caminho | Onde | Custo | Observação |
| --- | --- | --- | --- |
| `pdfjs-dist` no cliente | frontend | dependência nova + worker; renderiza página → `<canvas>` | O padrão da indústria; peso ~1 MB; `lazy` como o Atlas faz com o globo |
| rasterizar no servidor | backend (CURSOR) | dependência Python nova; serve PNG por página | A UI vira "só imagem" — H2 se resolve de graça |
| `<object>`/`<iframe>` nativo | frontend | zero dependência | Depende do header (§4); sem controle de zoom/página; visual do viewer do browser, fora do sistema |

Uma observação **de produto, não de técnica**, que a recon registra
sem decidir: a fatura vira imagem em algum ponto de qualquer caminho
(pdf.js rasteriza para canvas; servidor rasteriza para PNG). Se o
destino é sempre um bitmap com marcação por cima, rasterizar **uma vez**
no servidor simplifica o frontend para um único formato — é o que H2
pede.

## 2. H2 — componente uniforme para PDF e imagem

**Não existe.** O único lugar do produto que recebe arquivo do usuário e
o exibe é o **Trade Journal** (FORGE Wave 2, `src/lib/types/journal.ts`,
`nest/trader/journal/JournalEntry*.tsx`):

- `JournalAttachment` é **imagem-apenas** — `mimeType` documentado
  como "image MIME type", `accept="image/*"` no editor, `dataUrl` base64
  com teto de 5 MB.
- Render: `<img src={dataUrl}>` em miniatura, e um lightbox que é
  `position: fixed; inset: 0` com `<img objectFit: contain>` centrado —
  **sem nenhuma camada por cima**. Não é precedente de marcação.
- Usa tokens do terminal americano (`C`, `S`, `R` de `tokens.ts`),
  não NIVAR; e `borderRadius: R.md` — raio, que o NIVAR proíbe.

O intake desta trilha (`ContaDeLuzExpressPage.tsx:70`) aceita os quatro
tipos, mas só **envia**; não exibe nada.

**Consequência:** não há nada a reaproveitar como "visualizador". O que
existe de reaproveitável para a moldura é a `Prancha` da Alexandria
(`ApostilaPanel.tsx:154` — `<figure>` + `objectFit: contain` + fio em
cima e embaixo), que é o idioma certo para "imagem sobre papel" — mas é
do sistema Alexandria (Cinzel/Lora/navy), não NIVAR, e só serve como
referência de composição, não como componente.

Se a decisão de H1 for rasterizar no servidor, H2 se resolve sozinha:
a UI recebe sempre PNG por página e trata um formato só.

## 3. H3 — overlay posicionado sobre superfície visual

**Existe, e é precedente direto: o mapa do `PortalHero`**
(`src/components/br/PortalHero.tsx`, Portal BR Waves 2-6).

### 3.1 A técnica, exata

**Um único `<svg viewBox="…">` em que a superfície, as regiões
clicáveis e os rótulos vivem no MESMO sistema de coordenadas.** Não há
cálculo de pixel em lugar nenhum; tudo escala junto com o palco.

| Peça | Como é feita | Linha |
| --- | --- | --- |
| Superfície | `<svg viewBox={BRASIL_VIEWBOX} style={{width:'100%',height:'100%'}}>` | 259-263 |
| Região clicável | `<path d={s.d} role="button" tabIndex aria-label onClick onKeyDown>` — hover por `onMouseEnter`/`onFocus` | 271-303 |
| Âncora | `s.centroid` — coordenada **em unidades do viewBox**, pré-computada no dado | 386-387 |
| Leader line | `<line x1={centroid} … x2={centroid + offset}>` em `--accent-house` | 391-397 |
| Rótulo | `<text>` com **halo do papel** via `stroke: var(--surface-page)` + `paintOrder: 'stroke'` — legível sobre qualquer fundo | 399-413 |
| Offset do rótulo | `ROTULO_OFFSET[id]` por região, "para não cobrir o polígono vizinho" | 142-146 |
| Legenda de hover | `<span aria-hidden>` HTML absoluto, fora do SVG, com o nome da região sob o cursor | 659-680 |
| Clique → painel | `onRegiaoClick(s)` sobe ao `PortalBR`, que abre `role="dialog"` com o nome/sigla da região | `PortalBR.tsx:725-836` |

Tudo isso **já é NIVAR**: `--accent-house`, `--text-strong`,
`--surface-page`, `--font-data`, tabular-nums, `var()` via `style`
(porque atributo de apresentação de SVG não resolve `var()` — nota da
Wave 5, já paga).

### 3.2 O que transfere para a fatura, peça a peça

O desenho do war room — fatura de um lado, painel de explicação do
outro, números ligando os dois — mapeia quase um a um:

| No mapa | Na fatura |
| --- | --- |
| `<path d>` do submercado | `<rect>` (ou `<path>`) da região marcada, **nas coordenadas da página** |
| `s.centroid` | âncora do marcador — dado que a marcação traz |
| `<line>` + `<text>` sigla/PLD | `<line>` + `<text>` com o **número** do marcador |
| halo `paintOrder: stroke` | o mesmo — número legível sobre a fatura, seja ela clara ou escura |
| `ROTULO_OFFSET` | offset do número para fora da caixa |
| hover → `regiaoSobre` → legenda | hover → `marcadorSobre` → o item correspondente acende no painel |
| `onRegiaoClick` → `role="dialog"` | clique → o painel de explicação rola/foca o item N |

**A única diferença estrutural:** no mapa, a superfície é o próprio SVG
(os `<path>` do IBGE). Na fatura, a superfície é um **bitmap** (PNG da
página, venha de onde vier — §1). A forma de manter um único sistema de
coordenadas é colocar a imagem DENTRO do SVG:

```
<svg viewBox="0 0 {larguraPx} {alturaPx}">
  <image href={urlDaPagina} width={larguraPx} height={alturaPx} />
  <rect …/>  <line …/>  <text …/>   ← nas MESMAS unidades
</svg>
```

Com o `viewBox` igual às dimensões da página em pixels, uma marcação
expressa em pixels da página é usada **sem conversão**; e se a marcação
vier em fração (0-1), é multiplicar uma vez. A imagem e a marcação
escalam juntas com o container — exatamente a propriedade que o
`PortalHero` já provou em três viewports.

### 3.3 O que NÃO é precedente, e por quê

- **Atlas (`CamadaBrasil.submercadoEm`, `AtlasGlobo.toGlobeCoords`).**
  É hit-testing geodésico point-in-polygon sobre WebGL, com listener em
  fase de captura. Resolve "onde cliquei numa esfera" — problema que a
  fatura não tem. Trazê-lo seria importar complexidade de coordenada
  esférica para uma folha plana.
- **Lightbox do Journal.** `<img>` sem camada; só mostra a técnica de
  `objectFit: contain` num `fixed inset 0`, que é trivial.
- **Overlay HTML posicionado por `%` sobre `<img>`.** Varredura: **zero
  ocorrência** em `src/`. Não há precedente; e o SVG único (3.2) é
  melhor que isso por não depender de `getBoundingClientRect` nem de
  `ResizeObserver` para manter alinhamento.

### 3.4 Requisitos de dado que a técnica impõe (para a CURSOR Wave 3 saber)

Sem decidir o mecanismo de criação — só o que a renderização precisa
receber para funcionar:

- **Página** a que a marcação pertence (fatura pode ter mais de uma).
- **Dimensões da página** em que as coordenadas foram medidas (largura
  × altura em px, ou a convenção de fração 0-1). Sem isso, nada alinha.
- **Geometria da região**: retângulo (`x, y, w, h`) cobre a fatura de
  concessionária; polígono só se o operador desenhar à mão livre.
- **Número** do marcador, e o **texto** de explicação — o número é o
  que liga os dois lados, então é chave, não decoração.
- Opcional: **âncora** do número se não for o canto da região.

---

## 4. Achado fora das hipóteses — o header que bloqueia qualquer exibição

`app/routers/conta_luz.py:141-142` (`_download_headers`):

```
Content-Disposition: attachment; filename="…"; filename*=UTF-8''…
```

Vale para `GET …/source` **e** `…/deliverable`. `attachment` manda o
browser **baixar**, não exibir. Consequências, medidas contra o
comportamento padrão dos browsers:

- `<img src="…/source">` para uma fatura em PNG: **não renderiza**
  (Chrome e Firefox tratam `attachment` como download mesmo em `<img>`
  em alguns contextos; não é comportamento em que se possa apoiar).
- `<object>`/`<iframe>` para PDF: **baixa**, não exibe.
- `fetch` + `blob:` URL: **funciona** — o `fetch` ignora
  `Content-Disposition`, e o `blob:` resultante vai em `<image href>`
  ou em pdf.js. É o único caminho que não precisa do backend mudar,
  ao custo de segurar os bytes em memória no cliente.

**Para a CURSOR (registro, não pedido):** se a exibição for por URL
direta, a rota de leitura precisa de `inline` em vez de `attachment`
(ou uma rota irmã de visualização). É mudança de uma linha, e é
território dela. Se a escolha for rasterizar no servidor (§1), a rota
nova de PNG por página já nasce `inline` e o problema não existe.

---

## 5. O que a wave de build herda pronto

- **A técnica inteira de overlay** (§3.1), em NIVAR, com acessibilidade
  (`role="button"`, `tabIndex`, `aria-label`, `onKeyDown`) e hover
  sincronizado — copiar do `PortalHero`, não inventar.
- **Halo de texto** (`paintOrder: stroke`) — resolve legibilidade do
  número sobre a fatura sem caixa de fundo.
- **`comTransicao`** + `role="dialog"` com foco gerido — o padrão de
  "clique abre painel" do `PortalBR`.
- **`Prancha`** como referência de composição "imagem sobre papel com
  fio".
- **`lazy` + chunk próprio** (`AtlasGlobo`) — o precedente para trazer
  pdf.js sem inflar o bundle de entrada, se esse for o caminho.
- No backend (lido, não tocado): o tipo real do arquivo já está em
  `source_content_type`, detectado por bytes — a UI sabe se é PDF ou
  imagem sem adivinhar pela extensão.

## 6. O que precisa ser construído

- **Renderização de PDF** — inexistente (§1). Uma das três opções.
- **Um componente de "página com marcação"** — não existe nada
  uniforme (§2); mas é composição de peças que existem (§3.2), não
  mecanismo novo.
- **Rota de exibição `inline`** ou caminho `fetch → blob:` (§4).
- **Contrato de marcação** (§3.4) — quem define é a CURSOR Wave 3; a
  renderização só precisa que página, dimensões, geometria e número
  existam.

## Registrado, não resolvido

- **Fatura com mais de uma página**: o mapa tem uma superfície; a
  fatura pode ter N. A técnica é por página; a navegação entre páginas
  é decisão de composição da wave de build.
- **Zoom/pan**: o `PortalHero` escala o SVG inteiro com o palco e não
  tem zoom interno. Uma fatura A4 com texto pequeno pode pedir zoom; se
  pedir, `viewBox` dinâmico é o caminho natural do mesmo SVG, sem
  biblioteca.
- **O Journal tem `borderRadius` e tokens do terminal** — se alguém for
  reusar o lightbox dele como referência, precisa saber que ele não
  passa no NIVAR.

---

## Adendo — cruzamento com a recon de criação (CURSOR Wave 3)

`docs/conta-luz-express-recon-marcacao-backend.md` (`47d694b`) entrou
na branch durante esta wave, escrita em paralelo e sem ver este
documento. As duas **convergem** nos requisitos de dado, o que vale
registrar para o brief de build não ter que reconciliar:

| Requisito | Este doc (§3.4) | CURSOR (§"Implicação para coordenadas") |
| --- | --- | --- |
| Página | obrigatória para PDF | "PDF — coordenada precisa de `page` explícita"; imagem sem `page` como regra declarada |
| Base de coordenadas | dimensões em px OU fração 0-1 | propõe **normalizada `0..1`** relativa à página/imagem |
| Dimensões da página | a renderização precisa delas | o backend **não guarda** largura/altura/MediaBox/rotação |

Implicação da convergência: com base `0..1`, a renderização do §3.2
multiplica pelas dimensões **que o frontend mede ao carregar a
imagem** (`naturalWidth/naturalHeight`, ou a página do pdf.js) — o
backend não precisa conhecer pixels, exatamente como a CURSOR observa.
O único fato que os dois lados pedem e ninguém tem hoje é **contagem de
páginas e rotação do PDF**, que só um parser fornece (§1, opções).
