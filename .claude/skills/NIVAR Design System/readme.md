# NIVAR — Sistema de Design

**NIVAR** é uma plataforma independente de inteligência do mercado de energia elétrica no Brasil. Lê o dado público do setor — ONS, CCEE, ANEEL, EPE — e o torna legível para consumidores industriais no mercado livre: mineração, agronegócio, manufatura, data centers.

**A tese, e o que ela impõe ao design:** é a única inteligência do mercado de energia cuja receita não depende da conclusão que entrega. Não vende energia, não intermedia contrato, não recebe comissão. Um sistema visual que pareça um funil de vendas contradiz o produto. Por isso o registro é **think tank, não startup** — denso, editorial, rigoroso. Nunca SaaS genérico.

## Arquitetura de marca

A casa marca as **cinco famílias comerciais**, não os 44 produtos. Cada produto herda a marca da família e se identifica pelo nome.

| Família | Cor | Domínio |
|---|---|---|
| Intelligence | `#F5C63C` | Leitura do mercado — série, publicação, nota técnica |
| Advisory | `#E8A317` | Parecer e contraditório |
| Software | `#C17D1F` | Produto instrumentado — API, painel, alerta |
| Academy | `#A8432A` | Formação e certificação |
| Hardware | `#B8481F` | Medição em campo, telemetria, ativo físico |

**Exceção declarada:** *Alexandria* mantém identidade própria — atlas científico, navy e pergaminho, Cinzel + Lora, rosa dos ventos. Fora do sistema descrito aqui; não herda a paleta de incandescência. (Ainda não construída neste repositório.)

## Fontes recebidas

- `uploads/nivar-wordmark.svg` — wordmark de produção, 425×140, gradiente de incandescência aplicado ao traço. Copiado para `assets/nivar-wordmark.svg`.
- `uploads/nivar-marcas.svg` — folha da casa + cinco glifos de família, 700×130. Copiada para `assets/nivar-marcas.svg`; cada glifo extraído sem alteração para `assets/marks/*.svg` (só o `translate` de posicionamento da folha foi removido e a cor trocada por `currentColor` nas famílias).
- Briefing de marca em texto (paleta, tipografia, forma, densidade, movimento, arquitetura, rejeições) — transcrito nas seções abaixo.

Nenhum codebase, arquivo Figma ou deck foi anexado. **Não existe fonte de verdade de UI ainda:** os componentes e UI kits deste sistema, quando forem construídos, serão desenhados a partir do briefing — não são recreações de tela existente. Se houver produto rodando, anexar o repositório ou o Figma antes da rodada de UI kit.

---

## VISUAL FOUNDATIONS

### Cor — escala de incandescência

Cor é **temperatura**, não decoração. Os oito hexadecimais são literais e a ordem é declarada; cada família ocupa uma posição física na escala. Deslocar temperatura quebra a relação entre cor e significado.

```
#7A1F0D  brasa          casa · raiz · nível crítico
#B8481F  hardware       família · direção de alta
#A8432A  academy        família
#C17D1F  software       família · direção de baixa · pivô da escala
#E8A317  advisory       família · anel de foco
#F5C63C  intelligence   família · o dado sobre tinta
#14120F  tinta          substrato escuro — preto quente, nunca #000
#F6F2E9  papel          substrato claro — branco de relatório, nunca #FFF
```

**Contraste medido (WCAG), e a regra que ele produz** — a ponta fria da escala lê sobre papel, a ponta quente lê sobre tinta, e `software` é o pivô:

| | / papel | / tinta |
|---|---|---|
| brasa | 9.3:1 — texto | 1.8:1 — não usar |
| hardware | 4.7:1 — texto | 3.5:1 — ≥19px |
| academy | 5.4:1 — texto | 3.1:1 — ≥24px |
| software | 3.0:1 — ≥24px | 5.5:1 — texto |
| advisory | 1.9:1 — **só fio, marca e preenchimento** | 8.6:1 — texto |
| intelligence | 1.4:1 — **só fio, marca e preenchimento** | 11.6:1 — texto |
| tinta / papel | 16.7:1 | 16.7:1 |

Consequência prática: **advisory e intelligence nunca são cor de texto sobre papel.** Um número grande em amarelo sobre fundo claro é o erro mais fácil de cometer neste sistema.

**Cor no dado é direção de mercado, não semântica de UI.** `hardware` = alta, `software` = baixa, `advisory` = fora de faixa, cinza quente = sem variação. Não existe verde de sucesso nem vermelho de erro — não existe verde.

**Neutros** são derivados exclusivamente de tinta e papel, e são todos quentes: `#1D1A16` `#26221C` `#332E26` no lado escuro, `#EEE9DC` `#E4DDCB` no claro, `#6E6659` `#9A9081` para texto secundário. Nenhum neutro frio entra no sistema.

**Proibido:** azul e verde — o setor elétrico brasileiro inteiro é azul e verde, e a restrição é a diferenciação. Verde-escuro + dourado é Petrobras. Também rejeitado: laranja + roxo + teal + rosa.

**Sem semáforo em nenhuma categoria.** Não existe verde de sucesso, vermelho de erro nem amarelo de aviso — nem no dado numérico, nem em frescor de dado (`DataFreshness`), nem em validação de campo, nem em selo de amostra (`SampleSeal`), nem em marcador de recente (`RecentMarker`, que é texto em acento e nunca bolinha). Onde outros sistemas usariam cor de status, este usa texto, fio ou glifo.

O único gradiente permitido é o **gradiente de incandescência** (`brasa → software → intelligence`), e apenas onde ele já existe: no traço do wordmark e da marca da casa, ou como fio de 4px demarcando o topo de um documento. Nunca como fundo de seção, nunca como preenchimento de card.

### Tipografia

- **Display — Zilla Slab 500/600.** Serifa de bloco. Tracking negativo cresce com o corpo: −0.022em em 64px, −0.010em em 24px. Só dois pesos.
- **Corpo — Work Sans 300/400/500.** 300 para olho e texto longo, 400 para corpo, 500 apenas em etiqueta versalete (11px, +0.100em, caixa alta).
- **Dado numérico — JetBrains Mono, obrigatório.** Todo número que aparece em coluna, série ou comparação. `font-variant-numeric: tabular-nums lining-nums` sempre ligado. Número dentro de frase corrida pode permanecer em Work Sans. O motivo é mecânico: o `1` proporcional é estreito, a coluna perde o alinhamento de casa decimal e a vírgula deixa de formar eixo vertical — em série de 200 linhas o erro é cumulativo. Ver `guidelines/tipo-tabular.card.html`.
- Separador decimal: **vírgula**. Separador de milhar: **espaço fino**. Datas ISO (`2026-08-04`) em mono.
- **Proibido:** Inter, Helvetica, Geist, Playfair Display, Roboto Slab.

**Substituição sinalizada:** nenhum binário de fonte foi entregue. As três famílias são servidas do Google Fonts (`tokens/fonts.css`), que são as versões upstream oficiais sob SIL OFL 1.1 — não são aproximações. Para auto-hospedagem, colocar os `.woff2` em `assets/fonts/` e trocar o `@import` por regras `@font-face`.

### Forma

`border-radius: 0` em tudo, **exceto círculo pleno** (nó de grafo, ponto de série, anel, ponto de família, `Radio`). Sem `box-shadow` em nenhum nível — inclusive na alça do deslizante; profundidade vem do **fio de 1px**: `#D5CDB9` normal e `#B8AE97` forte sobre papel; `#3A342B` normal e `#524A3D` forte sobre tinta. Fio de tinta cheia (1px) para a divisão mais forte; 2px em cor de família só como fio de acento.

**Container só quando o conteúdo precisa de fronteira real.** Elemento de navegação, busca e destaque **não** recebe container individual — é texto com fio, não caixa. Proibido: card dentro de card, chip pílula, glassmorphism, gradiente decorativo, bloco 3D com bisel.

Cards, quando existem, são regiões delimitadas por fio de 1px sem raio e sem sombra, geralmente compartilhando fio com o vizinho (bordas colapsadas em grade). Sem transparência decorativa e sem blur — o único uso legítimo de opacidade é estado (hover, desabilitado) e camada de 16% para amostra de cor rejeitada.

### Espaçamento e densidade

Nove passos: `2 4 6 8 12 16 20 24 32`. **32px é o teto** — não existe passo acima dele, inclusive entre seções. Alvo de **40 a 60 elementos de informação por tela**. Whitespace generoso de landing page é o modo de falha mais comum deste sistema: se a tela respira como uma home de SaaS, ela está errada.

Layout é grade de bordas colapsadas — colunas separadas por `border-left: 1px`, linhas por `border-bottom: 1px`, sem gap entre células. Cabeçalho de seção é `número · título · fio · nota à direita` numa única linha de baseline.

### Movimento

Easing único: `cubic-bezier(0.65, 0, 0.35, 1)`. Sem overshoot, sem bounce.

| Duração | Uso |
|---|---|
| 150ms | mudança de estado |
| 200ms | hover |
| 700ms | desenho curto (fio, barra) |
| 1200ms | desenho longo (série, grafo) |

**Anima:** opacidade, cor de texto, cor de fio, `stroke-dashoffset`, altura de barra.
**Nunca anima:** cor de fundo, posição de layout, escala de card em hover.

**Hover** = mudança de cor de texto (tinta → brasa; papel → intelligence) e de cor de fio, 200ms. Nunca elevação, nunca escala, nunca troca de fundo.
**Press** = cor um passo mais fria na escala, 150ms. Sem encolhimento.
**Foco** = anel `advisory` 2px com offset 2px — o único uso de advisory como fio sobre papel.
**Desabilitado** = opacidade 0.4, sem troca de cor.

**Link em texto corrido** = cor `--link` com sublinhado por fio de 1px em `--link-fio` (um tom de fio, não a cor do texto). No hover o texto vai para `--link-hover` e o fio assume a cor do texto. **O sublinhado nunca desaparece** — em nenhum estado, nem no hover: retirar o fio para "limpar" o parágrafo tira do leitor a única marca de que aquilo é navigável. Claro: brasa → hardware. Noturno: intelligence → advisory.

### Imagem

O sistema é de dado, não de fotografia. Quando houver imagem, ela é **documental e quente** — sem duotone azul, sem sobreposição de gradiente colorido. Preferência por gráfico gerado do dado real (série, mapa de submercado, curva de carga) sobre foto de stock. Nenhuma ilustração desenhada à mão, nenhuma imagem gerada: se não houver material real, o lugar fica com placeholder declarado.

---

## CONTENT FUNDAMENTALS

**Idioma:** português do Brasil. Termos técnicos do setor ficam em português e sem tradução criativa — *mercado livre*, *submercado*, *PLD*, *carga*, *MWh*, *apuração*, *contraditório*, *migração*.

**Voz:** terceira pessoa e voz institucional. O sistema descreve o mundo, não conversa com o leitor. Evita "você" e evita "nós" — a autoridade vem do dado, não da relação. Onde o leitor precisa aparecer, é *o consumidor livre*, *o consumidor industrial*, *o time de energia*.

**Registro:** afirmativo, curto, verificável. A frase declara e para. Onde há incerteza, ela é declarada explicitamente, nunca amaciada.

- ✅ "O consumidor livre paga a conta de uma decisão que não tomou."
- ✅ "Não vende energia, não intermedia contrato, não recebe comissão."
- ✅ "Amostra ilustrativa — não é dado de apuração."
- ❌ "Descubra como economizar até 40% na sua conta de luz!"
- ❌ "Transforme sua gestão de energia com nossa plataforma inovadora."

**Casing:** sentence case em títulos e botões. Caixa alta **apenas** em etiqueta versalete de 11px (`SUBMERCADO`, `APURAÇÃO MENSAL`, `CALIBRAGEM 01`) e em siglas. Nunca título em caixa alta.

**Número sempre com procedência.** Todo dado carrega fonte e recorte temporal: `Fonte: ONS · CCEE · ANEEL · EPE`, `apuração mensal`, `2026-08-04 · 14:30 BRT`. Dado de demonstração é rotulado *amostra ilustrativa*. Isso não é rodapé legal — é a tese da empresa expressa em copy.

**Sem emoji.** Em nenhum contexto — nem em UI, nem em documento, nem em slide.

**Pontuação de sistema:** `·` (ponto médio) separa metadado numa mesma linha; `—` (travessão) abre aposto; `×` marca item rejeitado; `≤` `≥` `±` `%` `→` são usados literalmente. `/` separa numerador de contexto (`R$/MWh`, `/ papel`).

**Numeração de seção** em mono, dois dígitos (`01`, `02`), em `brasa`.

---

## ICONOGRAPHY

**Não existe conjunto de ícones fornecido, e nenhum foi inventado.** Os únicos glifos do sistema são as **seis marcas** — a casa e as cinco famílias — em `assets/marks/`, desenhadas em caixa de 100×100, traço de 5.5–11px, `stroke-linecap` variando por família, raio zero exceto os círculos plenos de `intelligence` e `advisory`.

As famílias usam `stroke="currentColor"`, então herdam cor do contexto: aplicar a cor da própria família, nunca recolorir para outra temperatura. A marca da casa carrega o gradiente de incandescência interno e **não** aceita troca de cor.

**Regra de implementação — `currentColor` exige SVG inline.** Um SVG carregado por `<img src>` é documento isolado: `color` do hospedeiro não atravessa e `currentColor` cai para preto. Em qualquer contexto de exibição, inserir o markup do SVG inline e aplicar `style="color:#F5C63C"` no elemento `<svg>` (ou em um ancestral). `<img>` só serve para a marca da casa, que traz o próprio gradiente.

```html
<!-- errado: currentColor não resolve, glifo sai preto -->
<img src="assets/marks/familia-intelligence.svg" style="color:#F5C63C">

<!-- certo -->
<svg viewBox="0 0 100 100" style="color:#F5C63C"><!-- …paths… --></svg>
```

Cores de exibição: intelligence `#F5C63C` · advisory `#E8A317` · software `#C17D1F` · academy `#A8432A` · hardware `#B8481F`.

**As marcas são finais.** Versão de produção, correção óptica já aplicada. Não redesenhar, não simplificar, não ajustar proporção ou espessura de traço. **Aplicar, nunca recriar.**

Onde a interface precisar de ícones utilitários (fechar, ordenar, exportar, expandir), a decisão está **aberta e não foi tomada** — nada foi substituído por conta própria. A recomendação é traço de 1.5–2px, terminações retas, sem preenchimento, para casar com o desenho das famílias; nenhuma biblioteca foi linkada ainda. Enquanto isso, glifos unicode em mono cobrem o essencial sem introduzir um dialeto visual estrangeiro — e o conjunto em uso já é fechado: `×` marcação e fechar, `–` marcação parcial, `↑ ↓` direção de mercado e ordenação, `↕` coluna ordenável em repouso, `→` sem variação e avanço, `±` fora de faixa, `≥ ≤` limite, `▾` seleção, `·` separador de metadado. **Pendente de decisão do usuário.**

Nenhum emoji. Nenhum ícone PNG. Nenhum SVG desenhado à mão além das marcas entregues.

---

## Index

| Arquivo | O que é |
|---|---|
| `styles.css` | Entrada única de CSS — apenas `@import`. É o que o consumidor linka. |
| `tokens/fonts.css` | `@import` do Google Fonts para Zilla Slab, Work Sans, JetBrains Mono |
| `tokens/colors.css` | Escala de incandescência, neutros quentes, aliases semânticos, escopos `noturno` e `substrato=papel` |
| `tokens/typography.css` | Famílias, pesos, escala de display / corpo / dado |
| `tokens/space.css` | Nove passos + teto de 32px, fio, raio |
| `tokens/motion.css` | Easing único e quatro durações |
| `tokens/base.css` | Reset e elementos base (`a`, `h1–h6`, `table`, `::selection`, barra de rolagem, `.nv-sr`) |
| `assets/nivar-wordmark.svg` | Wordmark de produção |
| `assets/nivar-wordmark-mono.svg` | Wordmark de impressão — mesma geometria, tinta sólida em vez de gradiente |
| `assets/nivar-marcas.svg` | Folha original: casa + cinco famílias |
| `assets/marks/*.svg` | Cada marca extraída em caixa de 100×100 |
| `thumbnail.html` | Tile do sistema |

### Guidelines e specimens

`guidelines/calibragem-01-cor-tipografia.html` — **a prova de calibragem**: escala completa com contraste medido, três pareamentos em uso, escala tipográfica display / corpo / dado, prova do dado tabular, as cinco famílias.

Cards de fundação (grupo → arquivo):

- **Colors** — `cor-escala`, `cor-substrato`, `cor-contraste`, `cor-dado`, `cor-proibido`
- **Type** — `tipo-display`, `tipo-corpo`, `tipo-dado`, `tipo-tabular`, `tipo-pareamento`
- **Brand** — `marca-wordmark`, `marca-familias`
- **Spacing** — `espaco-escala`, `forma-fio`, `movimento`- **Mobile** — `mobile-toque`, `mobile-tabela`, `mobile-navegacao`, `mobile-dado`, `mobile-grafico`, `mobile-estados`, `mobile-sobreposicao`, `mobile-carregamento` (cada um mostra desktop nos dois modos em largura cheia, e móvel claro e noturno lado a lado a 343px)

### Componentes

Todos existem em **modo claro e modo noturno**. O modo é um escopo de tema: `data-mode="noturno"` em qualquer ancestral remapeia apenas os aliases semânticos — nenhum valor da escala de incandescência é alterado.

| Componente | Diretório | O que é |
|---|---|---|
| `Button` | `components/actions/` | Primário, secundário, terciário × repouso, hover, press, foco, desabilitado |
| `Input` | `components/forms/` | Campo de texto com rótulo em etiqueta versalete |
| `NumberInput` | `components/forms/` | Campo numérico em mono tabular com sufixo de unidade atrás de fio |
| `Select` | `components/forms/` | Seleção nativa, glifo `▾` em mono |
| `DataTable` | `components/data/` | Tabela de bordas colapsadas, célula numérica tabular, linha alternada e hover |
| `DataCard` | `components/data/` | Região de fio de 1px, sem raio, sem sombra |
| `DataCardGrid` | `components/data/` | Grade de fio colapsado — é o que torna real o fio compartilhado |
| `SectionHeader` | `components/structure/` | Número em mono, título, fio e nota numa linha de baseline |
| `Provenance` | `components/data/` | Etiqueta de fonte e recorte temporal |
| `Skeleton` | `components/loading/` | Placeholder de tabela, card e texto — revelação por desenho de traço |
| `BrandLoader` | `components/loading/` | O N da casa colapsando num núcleo denso e reabrindo, 3.4s |
| `EmptyState` | `components/states/` | Sem dado, sem resultado, sem permissão — três tratamentos distintos |
| `ErrorState` | `components/errors/` | Falha, dado desatualizado, fonte indisponível — advisory como fio |
| `NavItem` / `Nav` | `components/navigation/` | Item de navegação: texto com fio, nunca caixa |
| `Breadcrumb` | `components/navigation/` | Trilha em mono versalete |
| `Pagination` | `components/navigation/` | Paginação de tabela com faixa de linhas em mono tabular |
| `ModeToggle` | `components/navigation/` | Claro / noturno em mono, sem caixa e sem ícone |
| `Tag` | `components/labels/` | Etiqueta inline: retângulo com fio, sem preenchimento |
| `ContextHint` | `components/labels/` | Definição de termo técnico no hover, toque ou foco |
| `Tabs` | `components/controls/` | Alternância de vista com fio de 2px da família |
| `FilterBar` | `components/controls/` | Campos numa linha, sem container ao redor do conjunto |
| `ConfirmDialog` | `components/overlay/` | Painel sólido de confirmação, fio de 1px, sem sombra |
| `Toast` | `components/overlay/` | Barra de texto plana com auto-dispensa, sem ícone |
| `TimeSeriesChart` | `components/charts/` | Série temporal de uma cor, eixo em mono, sem grade decorativa |
| `BarChart` | `components/charts/` | Barra comparativa de topo reto, cor de família ou de direção |
| `Glossary` | `components/glossary/` | Os oito termos não traduzíveis, em ordem alfabética |
| `MethodDisclosure` | `components/data/` | Divulgação de metodologia inline, ancorada na procedência — nunca modal |
| `DataFreshness` | `components/data/` | Frescor do dado em três estados, por texto — nunca semáforo |
| `TrendInline` | `components/data/` | Tendência compacta de uma linha, para tabela densa e lista |
| `Comparison` | `components/data/` | Duas colunas espelhadas com divisor central de fio |
| `PublicationCard` / `PublicationList` | `components/editorial/` | Item de lista de nota técnica, carta, relatório, parecer |
| `PullQuote` | `components/editorial/` | Bloco de citação editorial, fio de acento da família |
| `SubmarketSelector` | `components/controls/` | As quatro opções fixas de submercado |
| `SearchField` | `components/controls/` | Campo de busca sem container, resultado em lista |
| `AuthForm` | `components/forms/` | Entrar e cadastrar — o destino do item de nav `ACESSO` |
| `ExportPreview` / `Folha` | `components/export/` | Prévia do PDF e os dois tratamentos de marca |
| `Checkbox` | `components/forms/` | Caixa quadrada, preenchimento no acento em uso no contexto |
| `Radio` | `components/forms/` | O mesmo tratamento, redondo — segunda exceção de raio pleno |
| `Slider` | `components/forms/` | Trilho de 3px, alça quadrada, sem sombra |
| `UnitField` | `components/forms/` | Unidade dentro do campo — prefixo, sufixo, obrigatório, verificando |
| `SortHeader` | `components/data/` | Cabeçalho ordenável com marcador `↕ ↑ ↓` em mono |
| `DensityToggle` | `components/controls/` | Compacto / confortável — muda só o padding da célula |
| `SampleSeal` | `components/labels/` | Selo de amostra ou rascunho — aba no canto ou trama a 45° |
| `LabeledDivider` | `components/structure/` | Fio de 1px interrompido por versalete curto |
| `PeriodSegment` | `components/charts/` | `1D · 1S · 1M · 1A · MÁX` — seletor denso em mono |
| `ChartLegend` | `components/charts/` | Amostra em traço para série, bloco para barra |
| `Collapsible` | `components/structure/` | Seção recolhível com marcador `+` / `−` |
| `ExpandableRow` | `components/data/` | Linha de tabela que abre painel abaixo e empurra as seguintes |
| `MultiSelect` | `components/forms/` | Chips de fio dentro do campo, removíveis por `×` |
| `DownloadLink` | `components/actions/` | Nome e extensão em mono, tamanho em secundário, `↓` |
| `Shortcut` | `components/labels/` | Token de tecla em retângulo de fio fino |
| `RecentMarker` | `components/labels/` | `NOVO` / `ATUALIZADO` em versalete de acento |
| `SkipLink` | `components/navigation/` | Pular para o conteúdo — primeiro elemento navegável |

### Cards de componente

Cada diretório tem `<Nome>.d.ts` (contrato de props), `<Nome>.prompt.md` (uso) e um card de especimen. O CSS dos componentes vive em `components/<grupo>/*.css`, alcançado por `styles.css`. Todo card mostra desktop claro e noturno lado a lado e, embaixo, móvel claro e noturno a 343px.

**Uma nota de implementação dos cards:** o bloco de especimen usa `display:grid;grid-template-columns:minmax(0,1fr)`. Sem o `minmax(0,1fr)` a coluna é dimensionada por `max-content` e uma tabela larga vaza para fora do bloco de 343px em vez de rolar dentro dele — o `overflow-x` de `.nv-tab-rolo` nunca entra em ação.

**Decisões de estado, e por quê.**

*Botão primário* tem preenchimento `brasa` nos dois modos — `intelligence` a 1.4:1 sobre papel não pode ser superfície de texto, então nunca é preenchimento de botão. Hover troca o preenchimento para `academy`; press desce para `tinta`, um passo mais frio que brasa na escala. O texto permanece `papel` em todos os estados (9.3:1 sobre brasa, 5.4:1 sobre academy, 16.7:1 sobre tinta). No noturno o preenchimento é o mesmo e um fio `hardware` de 1px separa o botão da tinta da página.

*Secundário e terciário* não têm preenchimento: hover sobe um passo na escala, press desce um passo a partir do hover. Claro: repouso tinta → hover academy → press brasa. Noturno: repouso papel → hover advisory → press software. A leitura literal de "press é um passo mais frio" a partir de um hover em brasa não tem destino — brasa é o piso cromático — então o hover ocupa uma posição intermediária para que o press tenha para onde ir.

*Foco* é anel `advisory` 2px com offset 2px, sobre qualquer preenchimento e nos dois modos.

**Uma nota sobre "nunca anima cor de fundo".** O preenchimento do botão primário muda em hover e press, mas **não entra na lista de `transition`** — o preenchimento troca instantâneo, e só cor de texto e cor de fio correm os 200ms. A regra proíbe animar fundo, não proíbe que o fundo mude de estado.

**Cor no dado numérico** é direção de mercado em todo o sistema, nos dois modos, sem exceção: `hardware` para variação positiva, `software` para negativa, `advisory` para fora de faixa, cinza quente para sem variação. Não existe verde de sucesso nem vermelho de erro — o estado de erro usa `advisory` como fio, nunca como vermelho de UI.

**Direção não colore linha de série.** Numa série longa, linha que troca de cor a cada subida e descida vira ruído. A linha de `TimeSeriesChart` mantém uma cor só do começo ao fim (`--serie-linha`); a direção aparece apenas em indicador discreto — marcador do ponto final e rótulo de variação.

**Uma fonte só para os termos.** `components/glossary/termos.js` é o original de que `Glossary` e `ContextHint` leem. Editar num lugar e não no outro é como as duas definições divergem. `components/controls/submercados.js` cumpre o mesmo papel para os quatro submercados: a lista não é prop de `SubmarketSelector` porque não é configuração — é o recorte do setor.

**A ordem das duas datas na metodologia é do componente, não do chamador.** `MethodDisclosure` renderiza método → fonte → *método publicado em* → *dado coletado em* → premissas, sempre nessa ordem. A data do método vem antes da data do dado porque é essa ordem que prova a tese: o método é público antes de existir número para defender. Inverter as duas linhas desmonta o argumento sem alterar nenhum dado.

**Frescor de dado não é semáforo.** Verde/amarelo/vermelho é exatamente a semântica de status que o sistema já rejeitou para o dado numérico, e frescor é a mesma categoria de informação. `DataFreshness` diferencia os três estados por texto em mono; o único marcador visual é um círculo pleno de 6px em neutro quente, presente apenas em *ao vivo*, e ele nunca é colorido.

**A folha impressa não tem modo noturno.** `ExportPreview` põe o painel no tema da tela e a folha em `[data-substrato="papel"]` — um terceiro escopo de token, simétrico ao de modo, que reancora os aliases claros dentro de um ancestral escuro. Papel impresso é papel.

**Cor de acento vem do contexto, não da peça.** `Checkbox`, `Radio`, `Slider` e o traço de validação leem `--acento-contexto`, que o ancestral define e cai para `--accent-house`. Uma tela de Software marca as caixas em `software`, uma de Hardware em `hardware` — a mesma peça, sem variante nova e sem cor própria fixa.

**Raio pleno tem exatamente cinco usos, e `Radio` é o quinto.** Ponto de série, nó de grafo, ponto de família, anel, e o rádio. A caixa de seleção é quadrada com glifo `×`; o rádio é redondo com disco pleno concêntrico, porque `×` dentro de círculo lê como cancelado. Redondo aqui não é enfeite: é a convenção que separa escolha única de múltipla sem texto explicando.

**Uma convenção só de campo obrigatório:** asterisco em `--accent-house` junto ao rótulo, mais o texto `obrigatório` para leitor de tela. Não existe a palavra em versalete, não existe marcar "opcional" nos outros campos.

**Validação assíncrona não usa spinner.** O sinal é um fio de 2px se desenhando na base do campo em loop de 1400ms — só `transform`, mesma família de revelação do `Skeleton` e do `BrandLoader`. Spinner circular é vocabulário de outro sistema.

**O deslizante desenha o próprio trilho.** `.nv-desl__pista`, `__preenchido` e `__alca` são elementos, e o `<input type="range">` fica invisível por cima mantendo teclado, arraste e leitor de tela. As pseudo-classes `::-webkit-slider-*` não resolvem em todo motor, e o desenho do sistema não pode depender delas — verificado em DOM: com elas, a alça saiu como círculo azul nativo.

**O divisor com rótulo são dois fios, não um fio coberto por fundo.** O truque de "fundo igual ao substrato" quebra em zebra de tabela, em card com superfície própria e na folha de exportação. Dois fios sobrevivem a qualquer substrato — testado sobre `--zebra`.

**Densidade de linha muda só o padding.** `[data-densidade]` reescreve o padding de célula de `.nv-tab` e nada mais: fonte, cor, fio e alinhamento ficam idênticos nas duas densidades. No móvel as duas densidades respeitam o piso de 44px — o escopo móvel sobrescreve `[data-densidade]` justamente para isso.

**Trama diagonal é fio inclinado, não gradiente decorativo.** `SampleSeal variant="diagonal"` usa `repeating-linear-gradient` para produzir linhas de 1px em `--rule` com passo de 12px. É o único padrão diagonal do sistema, e existe para marcar amostra sem carimbo vermelho e sem reduzir opacidade do conteúdo.

**A amostra da legenda imita a marca que representa.** Traço de 14×2px para série — a mesma espessura da linha do gráfico; bloco de 9×9px com raio zero para barra — a mesma forma da barra. Um bloco genérico para os dois obriga o leitor a traduzir entre legenda e gráfico.

**Recolher não gira glifo.** `Collapsible` e `ExpandableRow` usam `+` e `−` em mono. Chevron girando é animação de `transform` em elemento de interface, que o sistema não usa, e `›` rodando 90° lê como enfeite. A revelação é o fio de 700ms; **altura nunca anima**.

**Detalhe de linha empurra, nunca sobrepõe.** `ExpandableRow` abre o painel abaixo da própria linha e desloca as seguintes para baixo. Sem popover, sem gaveta lateral, sem modal: a linha fica onde está e o contexto ao redor continua legível.

**Segmentado de período não é aba.** `PeriodSegment` é mono de 10.5px com separador `·` e vive no cabeçalho do gráfico; `Tabs` é corpo de 13.5px e troca de vista. A tipografia declara a diferença: mono versalete é recorte de dado, corpo é navegação. Recorte sem dado fica desabilitado, não desaparece — a ausência de `1D` num histórico mensal é informação.

**Download é link, não botão.** `Button` primário gera; `DownloadLink` aponta para um arquivo que já existe. Em `ExportPreview` os dois convivem: o botão gera o PDF, o link baixa o CSV já publicado.

**A barra de rolagem entra na disciplina.** `tokens/base.css` define trilho transparente, cursor sólido em `--rule-strong`, raio zero e nenhuma seta nas pontas (`::-webkit-scrollbar-button{display:none}`), mais `scrollbar-color` para os motores que a suportam. A regra de "sem decoração" se estende ao cromo do navegador.

**Uma nota sobre flex e este motor de preview.** Item de texto dentro de um flex que tem vizinho `flex:none` foi observado encolhendo até `min-content` mesmo com espaço sobrando — apareceu em `Provenance`, no título do cabeçalho de gráfico e no botão de linha expansível. Onde a quebra de linha estragava a leitura, a correção foi `white-space:nowrap` no item ou grade com `minmax(0,1fr)` em vez de flex. Preferir **grade a flex** quando as faixas são conhecidas.

**Movimento nos estados de carregamento.** Sem shimmer e sem pulso de opacidade em loop. A revelação é desenho: fio de 1px crescendo em 700ms, barra crescendo em altura em 1200ms, easing único. O único elemento que repete é o fio indeterminado do `BrandLoader`, e ele repete desenhando.

**Loader da marca.** Geometria estática — é o próprio N de `assets/marks/nivar-casa.svg`. A animação é exclusivamente `transform`: scale de 0.12 a 1 com dois giros completos em 3.4s, em loop. Nunca anima `d`. `vector-effect="non-scaling-stroke"` mantém os 11px de traço constantes em qualquer escala — é isso que funde as pernas num núcleo denso no colapso, em vez de afinar. O traço carrega o gradiente de incandescência e não aceita troca de cor.

**Adições intencionais** (não estavam na lista pedida):
- `DataCardGrid` — o pedido diz que o card compartilha fio com o vizinho em grade; sem o container isso não é expressável.
- `components/data/formatar.js` — `formatarNumero`, `formatarDelta`, `classeDirecao`. Vírgula decimal e espaço fino no milhar num só lugar, em vez de repetidos por chamada.

### Tratamento móvel — abaixo de 640px

Não há componente móvel separado: `components/mobile.css` resolve como o que já existe se comporta em tela estreita. As regras são geradas uma vez e emitidas em dois escopos — `@media (max-width:640px)` para o dispositivo real e `[data-largura="mobile"]` para os especimens, que precisam mostrar móvel ao lado de desktop na mesma janela. As duas listas vêm da mesma fonte e não podem divergir.

**Densidade cai, o teto cai junto.** 15 a 25 elementos por tela, não 40–60. `--gap-bloco` passa de 32px para 24px, e `--gap-item` de 12px para 8px: mais apertado dentro do bloco, proporcionalmente mais generoso entre blocos. A razão entre os dois abre de 2.7× para 3×.

**Tabela mantém a coluna fixa; nunca vira cartão.** Abaixo de 640px a primeira coluna fica `sticky` à esquerda com fio de 2px na borda direita — o único indicador de que há mais coluna — e o resto rola na horizontal. Empilhar a linha em cartão destruiria a comparação lado a lado, que é o motivo de a tabela existir.

**Navegação quebra linha; não vira hambúrguer.** Os itens passam para a segunda linha do próprio cabeçalho, continuam texto com fio. O `ModeToggle` desce junto quando não cabe. Introduzir um ícone de menu seria escolher biblioteca de ícone pela porta dos fundos, e essa decisão ainda não foi tomada.

**44px de área de toque em tudo que se toca** — botão, campo, item de nav, aba, número de paginação, seletor de modo, gatilho de dica. O que muda é o preenchimento: raio continua zero e fio continua 1px. Onde aumentar padding quebraria o fluxo de texto (gatilho de dica dentro de frase, link de breadcrumb), a área vem de um `::before` posicionado, que amplia o alvo sem mexer na linha.

**Citação de fonte nunca trunca.** `Provenance` quebra em duas ou três linhas; não há `text-overflow` em lugar nenhum do componente. Esconder a fonte contradiz o motivo de ela existir.

**Gráfico reduz marcas, nunca o eixo.** Abaixo de 380px de largura o `TimeSeriesChart` cai para duas marcas em X e duas em Y e a margem do eixo Y encolhe de 52px para 40px; o `BarChart` cai para duas linhas de referência. O eixo permanece, a procedência permanece.

### Desvios declarados da regra escrita

Três pontos onde a regra literal quebra contraste ou não tem onde se aplicar, e o que foi feito:

1. **Número do cabeçalho de seção em brasa.** Brasa sobre tinta é 1.8:1 — invisível. No noturno, `--accent-house` passa a `intelligence`, a ponta legível do mesmo gradiente da casa. No claro segue brasa, como pedido.
2. **Mensagem de erro em campo.** Brasa não lê sobre tinta e advisory já é a cor de foco. No noturno a mensagem fica em papel e o sinal de erro vive no fio `hardware` e no glifo `×` — o fio carrega a cor, o texto carrega a leitura. No claro a mensagem é brasa (9.3:1), como pedido.
3. **Foco no campo de busca.** O sistema define foco como anel advisory de 2px com offset 2px, e `SearchField` não tem caixa para anelar. O fio inferior engrossa de 1px para 2px e assume `--accent-focus`: advisory continua sendo a cor do foco e continua entrando sobre papel só como fio, que é o que a regra permite. O padding compensa 1px para o texto não se mover.

E um erro corrigido na rodada 6: **`amostra ilustrativa` era texto advisory sobre papel** (1.9:1) em `Provenance`, contra a própria regra da escala. Agora o rótulo lê em `--text-strong` com fio advisory de 1px embaixo no claro, e passa a texto advisory no noturno (8.6:1). Tokens `--ilustrativa-fg` e `--ilustrativa-fio`; vale também para `DataFreshness`.

### Ainda não construído

UI kits de produto, slides e a identidade separada de *Alexandria*.

## Já rejeitado — não reintroduzir

Sidebar navy vertical à esquerda (prior de SaaS; apareceu duas vezes). Playfair Display. Blocos 3D com bisel. Paleta laranja + roxo + teal + rosa. Camadas sobrepostas, fluxos entrelaçados, prisma refratando. Azul. Verde.

**Tour de onboarding e introdução guiada de primeiro uso.** Popup de boas-vindas, spotlight sobre a interface, sequência de "próximo → próximo → começar". Contradiz o registro de permissão do sistema: o consumidor recebe a leitura, não o pitch. Se uma tela precisa de tour, a tela está errada — o conserto é `ContextHint` no termo, `MethodDisclosure` no número e `EmptyState` na tela sem dado, cada um no lugar onde a dúvida aparece.

**Rolagem infinita em tabela ou lista.** Contradiz a disciplina de citação exata do sistema: "página 3 da exportação de Q2" é referenciável, "role até achar" não é. Um número que não pode ser reencontrado no mesmo endereço não serve para defender uma conclusão. **Paginação explícita sempre** — `Pagination`, com a faixa de linhas em mono.

**Semáforo verde/amarelo/vermelho para frescor de dado.** Mesma razão pela qual não existe verde de sucesso no dado numérico. Ver `DataFreshness`.
