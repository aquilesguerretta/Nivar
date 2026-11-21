# Insígnias — integração e verificação

## Entrega de runtime

- `src/components/g2/FamilyInsignia.tsx`: cinco masters nativos, uma cor, dimensões explícitas e acessibilidade. `family` recebe `FamilyInsigniaName`, `size` é opcional (24), `className` e `decorative` também.
- `src/components/g2/family-insignia.css`: apenas display, flex-shrink e overflow. Sem animação, variáveis de tema próprias, biblioteca, raster ou carregamento de mídia.
- `public/g2/g231/insignia/{family}.svg`: cinco masters portáveis equivalentes ao componente.
- `Brand.tsx` pertence à integração principal. O ramo de patronos `variant="hero"` e a assinatura NIVAR devem permanecer intactos. O fallback `house` não recebe uma sexta insígnia.

## Auditoria das chamadas existentes

Auditoria de `rg 'FamilyEmblem|from .*g2/Brand|from .*./Brand' src -n`, feita antes da integração principal. Apenas os usos compactos das cinco famílias recebem a marca nova.

| Uso | Ação recomendada |
| --- | --- |
| `FamilyPages.tsx` / header comum, 28 px | Substituição pelo ramo compacto de Brand, mantendo cabeçalho e patronos. |
| `G2Portal.tsx` / cartão Advisory, 45 px | Substituição pela marca Sócrates; não modificar jornada ou cartão. |
| `EditorialPages.tsx` / publicação Intelligence, 58 px | Substituição pela marca Argos. |
| `EditorialPages.tsx` / apresentação de sistema, 16 px | Substituição; atualizar o rótulo ordinal se ele disser que o desenho é só índice. |
| `HouseChapters.tsx` / índice das famílias | Inserção discreta junto ao nome/ordinal, se o índice pedir identificação visual. Preservar retratos grandes. |
| `HeroFilm.tsx` / patrono da etapa e contexto do instrumento | Uso compacto; não animar a geometria para compensar o desenho estático. |
| Wordmark, footer, operator, Terminal funcional, Alexandria | Nenhuma mudança pedida por esta entrega. Nenhum dos usos auditados exige editar esses sistemas. |

## Evidência

`small-size-actual-pixels.png` compõe SVGs rasterizados separadamente em 16, 20, 24 e 32 pixels sobre coordenadas inteiras, sem redimensionar. `small-size.html` mantém as dimensões CSS reais em claro e noturno. `browser-small-size-desktop.png/json` registram o navegador em 1280 × 720, sem overflow e tamanhos medidos de 15.99 / 19.99 / 23.99 / 31.99 px (arredondamento da escala interna do browser).

`in-context.html` é uma prova editorial de header, índice, navegação e cartões. As capturas `browser-context-light.png` e `browser-context-dark.png` vêm dessa prova. Ela não é apresentada como captura da aplicação de produção. No viewport CSS 390 × 844, o DOM mediu zero overflow; a captura nativa desse viewport falhou no browser do subagente e não é alegada como evidência visual móvel. A captura móvel integrada pertence à revisão principal do produto.

`npx eslint src/components/g2/FamilyInsignia.tsx` passou. Os gates de build/tipos e isolamento de Alexandria são da integração principal, que reúne Hero e insignias.

## Matéria

`material-study.py` cria uma cena Blender nova e faz subtração booleana dos próprios contornos. A incisão tem 0,4 mm; a microborda tem 20 μm. `material-mineral.png` e `material-graphite.png` mostram os cinco masters. `material-macro-ariadne.png` mostra o mesmo corte em macro. Não há fotografia documental, modelo externo nem textura importada. Esses estudos não entram no bundle e não substituem o master compacto.

Não foi adicionada animação às marcas: a identidade estática deve continuar reconhecível quando todo movimento estiver desligado.
