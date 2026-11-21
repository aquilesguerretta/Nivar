# Atlas Mundial → identidade Alexandria — auditoria de migração

**Wave:** ATLAS Wave 37 (revisada) · somente leitura  
**Data:** 2026-08-06  
**Produto:** Atlas Mundial de Energia em `/alexandria/atlas`  
**Não é:** o Grid Atlas americano em `src/components/atlas/` (Mapbox / PJM)

Este documento é o brief de correção. Zero código foi alterado nesta wave.

---

## Resumo executivo (Fase 4 — consolidado)

1. **Caminhos:** o Atlas Mundial está em `src/components/alexandria/atlas/` + `src/lib/atlas/{atlasDerivacoes,worldApi}.ts` + `src/pages/alexandria/AtlasStub.tsx`. Tokens em `src/design/alexandria-tokens.ts`. `src/components/atlas/` é outro produto (terminal US).
2. **Visual:** o painel **já está no sistema Alexandria** (tokens, Cinzel/Lora, raio zero, sem sombra). Não há migração de terminal→Alexandria a fazer. Há lista de não-conformidades finas (abaixo).
3. **Callout** "Dados medidos / Interpretação analítica": **não existe**; o parente vivo é `◆ Número derivado` em `AtlasControles.tsx`.
4. **Shell:** os quatro arquivos pedidos são posse **lyceum:**. A rota Atlas passa por `AlexandriaRouter`; o clique de nav passa por `AlexandriaHeader` / `AlexandriaFooter`, não por TrilhasHub / CaminhoExpedicao / AlexandriaHome.

### Lista item a item — não-conformidades para a wave de correção

| # | Item | Arquivo(s) | Severidade |
| --- | --- | --- | --- |
| 1 | Três cores de matriz sem token nomeado (`#736A5C`, `#357B73`, `#5C7A99`) | `src/lib/atlas/atlasDerivacoes.ts` | decisão de folha |
| 2 | Azul-aço do submercado Sul sem token (`#5C7A99`) | `src/components/alexandria/atlas/CamadaBrasil.tsx` | mesma decisão |
| 3 | Hex que *já batem* com tokens escritos como literais em vez de `A.`/`A2.` | `atlasDerivacoes.ts`, `CamadaBrasil.tsx` | higiene |
| 4 | Rampas RGB de intensidade/renovável fora dos exports | `atlasDerivacoes.ts` | higiene / decisão |
| 5 | Tipografia chrome em 8–13px overrideando `AT` | quase todas as peças do painel + `AtlasStub` | decisão de escala |
| 6 | h1 da coluna lateral a 26px (`AT.h1` = 32px) | `AtlasStub.tsx` | menor |
| 7 | Callout nominal "Dados medidos / Interpretação analítica" ausente | — (hoje: só `◆ Número derivado`) | produto |
| 8 | `grav-atlas-segurando-o-globo.png` ainda 2,8 MB (pngquant pendente) | `public/alexandria/gravuras/` | asset |
| 9 | Prefixo `grav-` fora da convenção de bloco — documentar ou alinhar | mesmo | doc |

### Fora de escopo da correção visual (já conforme)

- Import de `alexandria-tokens` em UI
- Raio zero / ausência de sombra
- Famílias Cinzel + Lora
- Shell Alexandria envolvendo a página
- Rota e item de nav Atlas (já wired; shell lyceum intocado)

### Posse sugerida da wave de correção

- **ATLAS** — `src/components/alexandria/atlas/*`, `src/lib/atlas/atlasDerivacoes.ts`, `AtlasStub.tsx` (página do produto)
- **Não tocar** — `AlexandriaRouter`, `TrilhasHub`, `CaminhoExpedicao`, `AlexandriaHome` (lyceum; rota já suficiente)
- **Tokens novos** (se a decisão #1 criar nomes) — coordenar com quem detém `alexandria-tokens.ts` (criação lyceum; alteração precisa de acordo)

---

## Fase 1 — Caminhos reais confirmados

### Correção ao handoff

O brief citava `src/components/atlas/`. No disco isso é o **Atlas do terminal americano** (GridAtlasMap, time-travel, infra EIA). O Atlas Mundial da Alexandria vive em outro lugar:

| Papel | Caminho real no disco |
| --- | --- |
| Peças de UI do globo | `src/components/alexandria/atlas/` |
| Derivação / coloração | `src/lib/atlas/atlasDerivacoes.ts` |
| Cliente HTTP OWID | `src/lib/atlas/worldApi.ts` |
| Página / composição | `src/pages/alexandria/AtlasStub.tsx` |
| Tokens visuais Alexandria | `src/design/alexandria-tokens.ts` |

### `src/components/alexandria/atlas/` — inventário completo

| Arquivo | Papel |
| --- | --- |
| `AtlasGlobo.tsx` | **Render do globo** (react-globe.gl + Three) — nome que o handoff não dava |
| `PaisPerfil.tsx` | **Perfil de país** — nome que o handoff não dava |
| `PaisTooltip.tsx` | Tooltip no hover |
| `AtlasControles.tsx` | Coloração, filtro, rankings |
| `ComparadorPaises.tsx` | Comparador 2–3 países |
| `BuscaPais.tsx` | Busca no modo imersivo |
| `CamadaBrasil.tsx` | Contorno dos quatro submercados + hit-test |

### Arquivos nomeados no brief — batem com o disco?

| Citado no brief | Existe? | Caminho real |
| --- | --- | --- |
| `atlasDerivacoes.ts` | sim | `src/lib/atlas/atlasDerivacoes.ts` (lib, não components) |
| `AtlasControles.tsx` | sim | `src/components/alexandria/atlas/AtlasControles.tsx` |
| `ComparadorPaises.tsx` | sim | `src/components/alexandria/atlas/ComparadorPaises.tsx` |
| `BuscaPais.tsx` | sim | `src/components/alexandria/atlas/BuscaPais.tsx` |

### Tokens da Alexandria — caminho localizado

**Arquivo canônico:** `src/design/alexandria-tokens.ts`

- Exporta `A`, `A2`, `AF`, `AT`, `AS`, `AR`, `AE`, `ALAYOUT`, `ATEXTURA`, `AFONT_HREF`.
- Sem custom properties CSS / `:root` / `var()` — o handoff também não tinha; valores são hex literais no TS.
- Separado de propósito de `src/design/tokens.ts` (terminal US). O cabeçalho do arquivo proíbe import cruzado.
- Criação: `0c92fcad` · `lyceum: alexandria wave 2 design tokens`.

### Hipótese do rodapé — confirmada por import, não por olho

`src/components/alexandria/shell/AlexandriaFooter.tsx` importa:

```ts
import { A, A2, AT, AS, AR, AE, ALAYOUT } from '../../../design/alexandria-tokens';
```

`borderRadius: AR.none` aparece no chassi. **Não é coincidência visual:** usa o arquivo de tokens. A hipótese do brief (“conforme — a confirmar”) fica **confirmada** para o Footer.

### Asset do frontispício

`public/alexandria/gravuras/grav-atlas-segurando-o-globo.png` — existe (2.848.577 bytes). Mesmo diretório que `fis-*`, `orn-*`, `his-*`, etc. Prefixo `grav-` é convenção própria (não é bloco curricular). Detalhe de conformidade na Fase 2.

---

## Fase 2 — Auditoria de conformidade visual

### Veredito geral (inverte a premissa do brief)

A premissa ("o restante do painel provavelmente está em outro sistema") **não se sustenta**. Todas as peças do Atlas Mundial já importam `src/design/alexandria-tokens.ts`. Nenhuma importa `src/design/tokens.ts` (terminal). Não há `box-shadow` / `boxShadow` em nenhum arquivo do painel. `borderRadius` é `0` ou `AR.none` em todo lugar medido.

O trabalho de migração **não** é "trocar de sistema". É fechar os desvios listados abaixo — cores fora do token, tipografia abaixo da escala `AT`, e o callout nominal que ainda não existe.

### Hipótese do callout "Dados medidos / Interpretação analítica"

**Não implementado com esse texto.** Grep em `src/components/alexandria/atlas/` e `AtlasStub.tsx`: zero ocorrência de "Dados medidos" ou "Interpretação analítica".

O que existe, no mesmo *espírito* (distinguir medido de derivado), é o bloco tracejado em terracota em `AtlasControles.tsx`:

- rótulo: `◆ Número derivado`
- corpo: `Não vem da fonte: é calculado aqui como {metrica.formula}.…`

Aparece só quando o ranking ativo é a métrica marcada `derivada: true` (emissão total aproximada). Não é o callout de duas colunas "Dados medidos / Interpretação analítica" — é instrução de produto ainda não executada nessa forma, ou executada sob outro rótulo.

### Peça a peça

#### 1. Globo — `AtlasGlobo.tsx`

| Aspecto | Estado hoje |
| --- | --- |
| Tokens | Importa `A, A2, AT, AS, AE` |
| Paleta de cena | Navy da esfera (`A.navy` via material), lavagem creme, stroke ouro (`A2.ouroSobreNavy`), hover terracota em `rgba(168,70,42,…)` (= `A.terracota`) |
| Fonte | Controles overlay usam `AT.rotulo` / `AT.corpo` (Cinzel/Lora via token) |
| border-radius | `0` nos botões overlay |
| box-shadow | ausente |
| Não-conformidade | Cores de polígono/filtro passam por `atlasDerivacoes.COR_FONTE` (ver § cores fora do token). Overlay imersivo usa `fontSize: '8px'/'9px'` abaixo de `AT.rotulo` (11px) |

#### 2. Perfil de país — `PaisPerfil.tsx`

| Aspecto | Estado hoje |
| --- | --- |
| Tokens | Importa `A, A2, AF, AT, AE, AS, AR` |
| Paleta | `A2.cremeSuperficie` + fio `A.fioSobreCreme` — papel sobre o globo |
| Fonte | Título em `AF.display` (Cinzel); corpo/dados em `AT.*` (Lora) |
| border-radius | `AR.none` |
| box-shadow | ausente |
| Não-conformidade | Escala tipográfica densamente overrideada (`8px`–`13px`); título a `18px` em vez de papel `AT.h2`/`AT.h3` |

#### 3. Comparador — `ComparadorPaises.tsx`

| Aspecto | Estado hoje |
| --- | --- |
| Tokens | Importa `A, A2, AF, AT, AS, AE` |
| Paleta | `A2.cremeSuperficie`, fios do sistema |
| Fonte | Cinzel nos nomes; Lora nos dados |
| border-radius | `0` |
| box-shadow | ausente |
| Não-conformidade | Mesma compressão tipográfica (`8px`–`12px`) |

#### 4. Controles — `AtlasControles.tsx`

| Aspecto | Estado hoje |
| --- | --- |
| Tokens | Importa `A, A2, AT, AS, AE` |
| Paleta | Creme + metadado + terracota no callout de derivado |
| Fonte | `AT.rotulo` / `AT.dado` com overrides |
| border-radius | nenhum declarado (elementos sem radius) |
| box-shadow | ausente |
| Não-conformidade | Rótulos de seção a `8px` / `0.13em` — mesmo idioma do rodapé pós-Wave 10, mas abaixo do piso `AT.rotulo` (11px / 0.18em) |

#### 5. Busca — `BuscaPais.tsx`

| Aspecto | Estado hoje |
| --- | --- |
| Tokens | Importa `A, A2, AF, AT, AS` |
| Paleta | Fio embaixo (padrão ⌘K do handoff), sem caixa de quatro lados |
| Fonte | `AF.corpo` no input; rótulo Cinzel |
| border-radius | sem radius |
| box-shadow | ausente |
| Não-conformidade | `fontSize: '8px'` no rótulo; input a `13px` (entre `AT.nav` e `AT.dado`) |

#### 6. Página / coluna lateral — `AtlasStub.tsx`

| Aspecto | Estado hoje |
| --- | --- |
| Tokens | Importa `A, A2, AT, AS, AE` |
| Shell | Monta `AlexandriaShell` — herda header/footer/canvas creme |
| h1 | `AT.h1` com override `fontSize: '26px'` (token é 32px) |
| border-radius | `0` |
| box-shadow | ausente |

#### 7. Camada Brasil — `CamadaBrasil.tsx`

Cores de contorno hardcoded (comentadas como tokens, mas **não importam** o arquivo de tokens — o arquivo é dado puro):

| Submercado | Hex | Token alegado |
| --- | --- | --- |
| norte | `#8E9E6B` | `A2.olivaSobreNavy` ✓ valor bate |
| nordeste | `#CBAA6E` | `A2.ouroSobreNavy` ✓ |
| sudesteCentroOeste | `#C2683C` | `A2.terracotaClara` ✓ |
| sul | `#5C7A99` | azul-aço (mesmo da eólica) — **não é token nomeado** |

### Cores fora do token (`atlasDerivacoes.ts` · `COR_FONTE`)

| Chave | Hex | Status |
| --- | --- | --- |
| `nuclearPct` | `#A8462A` | = `A.terracota` |
| `solarPct` | `#CBAA6E` | = `A2.ouroSobreNavy` |
| `biofuelPct` | `#55663F` | = `A.oliva` |
| `otherRenewablesExcBiofuelPct` | `#8E9E6B` | = `A2.olivaSobreNavy` |
| `fossilPct` | `#736A5C` | **fora da folha** — carvão quente, deliberado (navy era ilegível) |
| `hydroPct` | `#357B73` | **fora da folha** — água, deliberado |
| `windPct` | `#5C7A99` | **fora da folha** — azul-aço |

Rampas RGB de intensidade/renovável também são literais (creme→terracota / creme→oliva), alinhadas à intenção do sistema mas sem passar pelos exports `A`/`A2`.

**Para a wave de correção:** decidir se esses três hex viram tokens nomeados na folha, ou se permanecem como paleta de globo documentada à parte. Hoje não violam a identidade por acidente de outro sistema — violam a regra "toda cor vem do arquivo de tokens".

### Tipografia — padrão sistemático, não acidente

Em todo o painel, `AT.rotulo` / `AT.dado` / `AT.corpo` são espalhados e depois **comprimidos** com `fontSize: '8px'|'9px'|'10px'|'11px'|'12px'|'13px'`. O rodapé Alexandria já usa `8px` em rótulos de cartela (Wave 10). É coerência interna densa, mas diverge da escala canônica `AT` (rótulo 11 / dado 14 / corpo 16). Wave de correção precisa de decisão de design: formalizar uma escala "chrome denso" ou subir aos papéis `AT`.

### `grav-atlas-segurando-o-globo.png`

| Critério | Achado |
| --- | --- |
| Diretório | `public/alexandria/gravuras/` — **mesmo** dos demais |
| Convenção de nome | Prefixo `grav-`, não `fis-`/`orn-`/`his-`/… — peça de UI, não gravura de aula |
| Peso | **2,8 MB** vs pares convertidos (~350–850 KB). Wave 28 já marcou como candidato a `pngquant`; **ainda não convertido** |
| Referência no código | `AtlasGlobo.tsx` L103: `src: '/alexandria/gravuras/grav-atlas-segurando-o-globo.png'` |

### O que NÃO precisa migrar de sistema

- Importar `alexandria-tokens` (já feito em todas as peças de UI)
- Remover Geist/Inter/tokens do terminal (não presentes)
- Remover `box-shadow` (já zero)
- Forçar `border-radius: 0` (já zero / `AR.none`)

---

## Fase 3 — Posse do shell confirmada

Comando: `git log --all --diff-filter=A --oneline -- <path>`

| Arquivo | Commit de criação | Prefixo de agente |
| --- | --- | --- |
| `src/pages/alexandria/AlexandriaRouter.tsx` | `821d0ff` · `lyceum: alexandria wave 3 internal routing` | **lyceum** |
| `src/components/alexandria/navigation/TrilhasHub.tsx` | `3e2e207` · `lyceum: alexandria wave 3 trilhas hub` | **lyceum** |
| `src/components/alexandria/navigation/CaminhoExpedicao.tsx` | `8f1e4d6` · `lyceum: alexandria wave 3 caminho de expedicao` | **lyceum** |
| `src/pages/alexandria/AlexandriaHome.tsx` | `1df0c84` · `lyceum: alexandria wave 2 route and visual verification` | **lyceum** |

Os quatro são posse **LYCEUM**, não ATLAS. Esta wave não os editou.

### A entrada de navegação do Atlas Mundial passa por esses quatro?

| Arquivo | Liga ao Atlas? |
| --- | --- |
| `AlexandriaRouter.tsx` | **Sim — monta a rota.** `import { AtlasStub }` + `<Route path="atlas" element={<AtlasStub />} />` |
| `TrilhasHub.tsx` | Não — zero menção a atlas |
| `CaminhoExpedicao.tsx` | Não — zero menção a atlas |
| `AlexandriaHome.tsx` | Só em comentário de cabeçalho (lista de rotas). Não navega |

**O link de nav que o usuário clica não está nos quatro.** Está em:

- `src/components/alexandria/shell/AlexandriaHeader.tsx` — item `{ id: 'atlas', rotulo: 'Atlas', destino: '/alexandria/atlas' }` e `ativoPorRota` que acende Atlas em `/alexandria/atlas*`
- `src/components/alexandria/shell/AlexandriaFooter.tsx` — `NAV_RODAPE` com o mesmo destino (também lyceum)

Cadeia real: Header/Footer (clique) → rota `/alexandria/atlas` → `AlexandriaRouter` → `AtlasStub` → lazy `AtlasGlobo`.

### Nota de atribuição histórica (fora dos quatro, mas relevante)

Os arquivos do painel do globo foram **criados sob prefixo `lyceum:`**, não `atlas:`:

| Arquivo | Criação |
| --- | --- |
| `AtlasGlobo.tsx` | `8f50362` · `lyceum: alexandria wave 27 globe surface` |
| `alexandria-tokens.ts` | `0c92fcad` · `lyceum: alexandria wave 2 design tokens` |
| `AtlasStub.tsx` (última ponta) | revisões `lyceum:` |

A posse operacional declarada nesta wave (ATLAS dono dos internals do globo) é decisão de produto atual; o histórico git ainda carrega LYCEUM como autor de criação. Wave de correção visual pode usar prefixo `atlas:` sem precisar tocar os quatro arquivos de shell — a rota e o nav já existem.


---

## Fechamento

Wave 37 revisada fechada como reconhecimento. Único artefato: este arquivo. Quatro commits de fase + pushes em `feature/full-shell-buildout`. Zero edição em `src/`.

