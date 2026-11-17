# M01 — movimento, mecânicas, interações e conquistas

Inventário de 2026-09-21 para a decisão do Founder de fechar o **Módulo 01 inteiro em qualidade final**. Este
documento **não constrói nada**: ele mede o que a especificação tem, o que o produto tem hoje (arquivo e linha), o
que falta, qual gate do bar cada coisa cumpre e quanto custa.

**Fonte de comportamento.** `estudos/movimento-e-conquistas/sistema-de-movimento.md` (10 momentos, coreografia em
ms, contrato de movimento reduzido, aceite em filmstrip) e `sistema-de-movimento.md` §5 (sequência do globo) ·
`estudos/movimento-e-conquistas/sistema-de-conquistas.md` (catálogo de 30 conquistas, gramática da medalha,
tamanhos) · protótipos HTML em `media-lab/movimento-e-conquistas/prototipos/` (p03 a p10, 29 trabalhos com folha,
44 vídeos) · medalhas r04 em `media-lab/movimento-e-conquistas/medalhas/`.

**Estado real do produto, medido em 2026-09-21** (leitura de `src/`, sem edição):

- `AE` tem **uma** curva e **quatro** durações (`src/design/alexandria-tokens.ts:149-155`). A especificação pede 5
  curvas e 12 durações.
- **Um único momento existe no produto**, e é o momento 3 na variante nó → módulo:
  `src/components/alexandria/trilhas/continuidade.ts` (366 linhas), chamado de um só lugar
  (`src/components/alexandria/trilhas/MapaDaTrilha.tsx:55`). Ele já é FLIP escrito à mão em `requestAnimationFrame`,
  com as duas curvas do §2.2 avaliadas em JS, guarda de título duplo por quadro e restauração em qualquer saída.
- **Nenhum outro momento existe.** O globo não gira, o trecho não é traçado, a conclusão não anima, não há medalha
  no produto (`public/` não tem um único arquivo de medalha), não há caderno de marcos e não há região `aria-live`
  em nenhuma tela da Alexandria (as três que existem estão em `Modulo08Game.tsx:210,357,425`).
- **A aula-arquétipo do M01 não emite evento nenhum.** `src/components/alexandria/aula/arquetipos.ts:30` mapeia
  `modulo-01:8` para `AulaM01A08`, e não há uma chamada de `recordEvent` em todo `src/components/alexandria/aula/`.
  Quem emite é só `AulaViewer.tsx:81,99`, que é a aula genérica — usada nas outras 8 aulas do M01.
- A contagem do M01 **está reconciliada**: `AULAS_POR_BLOCO['bloco-01'] = 9` em
  `src/lib/data/alexandria-trilhas.ts:43`. O momento 7 e a conquista de módulo podem disparar no M01 sem violar P8.

---

## 1. As 35 unidades de trabalho

Cada linha é verificável no render. O que não é verificável está no §7 (pesquisa), não aqui.
Tamanho: **P** ≤ meio dia · **M** ≈ 1–2 dias · **G** ≥ 3 dias.

### 1.1 Fundação — o que habilita todos os momentos

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| **MV-01** | §2.1 e §2.2: 12 durações (`corte`, `instante`, `estado`, `hover`, `saida`, `chegada`, `entrada`, `continuidade`, `desenhoCurto`, `projecao`, `desenhoLongo`, `escalonamento`) e 5 curvas (`easing`, `entra`, `sai`, `traco`, `linear`) | `AE` com 1 curva e 4 durações — `src/design/alexandria-tokens.ts:149-155` | Acrescentar 8 durações e 4 curvas **sem mudar os 5 valores existentes**; as duas regras de duração derivada (traçado `clamp(300, px×2,2, 1200)`, rotação `clamp(900, Δ×45, 1500)`) como funções | S6, S2 | P |
| **MV-02** | §2.3: contrato único de movimento reduzido | Seis leituras independentes de `matchMedia` espalhadas, nenhuma na Alexandria como módulo — `src/components/alexandria/shell/navegacao.ts:198-201` é local do shell; `AlexandriaShell.tsx:200` e `comum/Marcas.tsx:339` são CSS soltos | Um `useMovimentoReduzido` da Alexandria, reativo à troca de preferência em tempo de execução, consumido por todos os momentos | S6 (reduzido) | P |
| **MV-03** | Arquitetura do protótipo: **estado primeiro em corte, animação `fill: backwards` depois** (`prototipos/README.md`, seção "Arquitetura do movimento") | Nada. `continuidade.ts` implementa o padrão só para o seu caso | Porte de `prototipos/_base/movimento.js` para `src/components/alexandria/movimento/`: relógio, passos, colapso no modo reduzido, glifos, anúncio | S6 (M4, M5) | G |
| **MV-04** | §2.4: `pointerdown`/`keydown`/`wheel`/`touchstart` chamam `finish()` em todas as animações do momento; navegar cancela; aba oculta vai direto ao final | Nada | Registro de animações por momento e um `finalizar()` global; guarda de `document.visibilityState` | S6 (M7) | M |
| **MV-05** | §2.4: toda consequência e toda chegada têm frase em `aria-live="polite"`, emitida em `corte` | Nenhum `aria-live` na Alexandria — os três do repositório estão em `games/Modulo08Game.tsx:210,357,425` | Região de anúncio na aula e na Home, alimentada pelo motor (MV-03) | S7, S6 | P |
| **MV-06** | §2.2, portão F-M1: reprovar `cubic-bezier` com y fora de [0,1], `spring` com `bounce > 0` e `animation-iteration-count: infinite` em `src/components/alexandria/**` e `src/design/alexandria-tokens.ts` | Nada | Regra de lint/teste no CI | S6 (proibidos) | P |
| **MV-07** | §3: harness Playwright com Chrome do sistema, `recordVideo` 1440×900 e 390×844, `emulateMedia({ reducedMotion })` nos dois modos, quadros por `ffmpeg -ss`, `performance.mark` em log, faixa de URL composta | O harness existe, mas aponta para os protótipos — `media-lab/movimento-e-conquistas/prototipos/_ferramentas/capturar.cjs` | Apontar o mesmo harness para as rotas reais do produto na porta de dev, com as folhas caindo em `docs/alexandria-v2/captures/` | S6 (aprovação), §8 | M |
| **MV-08** | §3, fixture **E4** (aprovada pelo orquestrador em 2026-09-20): M01–M03 percorridos por **eventos reais semeados**, penúltima aula do módulo seguinte concluída, última aberta | Nada. O produto tem E0–E2 de fato, e no E2 nenhum módulo está percorrido — não há trecho a desenhar | Semeadura por `POST /events` reais (nunca mock) e declaração da fixture na legenda da folha | §8, S3 | M |

### 1.2 Os momentos no M01

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| **MV-09** | **Momento 1, fase A** — rotação V0→V1 por quadros pré-renderizados, 900 ms, mapeada por `easing`, com troca pelo estático em `corte` a t=900 (§4 M1; produção em §5: 48 quadros × 520/1040 px, WebP, ≤ 0,8/2,5 MB) | O globo escolhe a vista e desenha **parado** — `home/GloboCurriculo.tsx:108` (`vista: V1|V2|V3`) com os estáticos de `public/alexandria/v2/home/home-globo-V{1,2,3}-D{400…2000}.webp` | A sequência de quadros não existe (nem em `media-lab`): é render Blender novo (§5.1, `globo_seq.py`), mais o playback em `canvas`+rAF e o pré-carregamento em `requestIdleCallback` | S6 (chegada) | G |
| **MV-10** | **Momento 1, fases B–D** — rótulos entram a 900; trecho percorrido traçado a tinta a partir de 960 com `traco` e duração por comprimento; estação vira disco cheio quando o traço a alcança; anel "você está aqui" a 1532; chamada e tracejado até 1932 | Tudo isso **já é desenhado**, mas de uma vez e sem tempo — `home/GloboCurriculo.tsx:213-270` monta o SVG inteiro num efeito; os trechos percorridos saem de `:76-81` | `stroke-dashoffset` progressivo no trecho, corte de silhueta por estação sincronizado com o traço, entrada dos rótulos e do anel. **Roda sem MV-09**: a fonte autoriza as fases B–D sobre a vista estática | S6 (chegada), S3 | M |
| **MV-11** | **Momento 2** — pré-visualização de território pela faixa da Home, giro V1→V2 (1030 ms) / V1→V3 (1480 ms), botão "Voltar à sua posição", CTA de retomada inalterado; 2ª ativação em menos de 2 s vira `corte` | A faixa existe (`home/FaixaTrilhas.tsx`), a troca de vista não anima e não há estado "vendo" | Cruzamento de opacidade entre os estáticos (fallback autorizado pela fonte enquanto a sequência não existe), marca "vendo", botão de volta, `aria-live` | S6 (continuidade) | M |
| **MV-12** | **Momento 3, Home → aula** — três elementos compartilhados (código, título, anel), FLIP `translate`+`scale` em 400 ms, header da aula a 200, mini-percurso traçado a 400, encadeia o momento 4; voltar inverte e não repete o momento 1 | Navegação seca. `comum/Retomada.tsx` monta o CTA, e nada viaja | Reuso de `continuidade.ts` com origem no cartão de retomada e três viajantes em vez de um; guarda de rolagem no voltar (a de `continuidade.ts:334-360` já existe e serve) | S6 (continuidade) | M |
| **MV-13** | **Momento 3, nó → módulo** — mesma coreografia com origem no nó da carta | **Existe e está completo** — `trilhas/continuidade.ts:1-366`, chamado em `trilhas/MapaDaTrilha.tsx:55`; rAF, curvas do §2.2 avaliadas em JS (`:41-66`), cruzamento a 86% do trajeto, `saida` quebrada de propósito para 320 ms com a razão medida registrada (`:23-32`) | Só o **aceite**: filmstrip 1440 e 390 nos dois modos, teste de interrupção a t=200 e prova de que o voltar devolve a mesma rolagem. Nenhum código novo | S6 (aprovação) | P |
| **MV-14** | **Momento 4** — pergunta/objetivo (120) → o que fazer (240) → primeiro ato (360), 8 px de Y no máximo, foco fica no H1, texto corrido presente em t=0, os três blocos no 1º viewport a 390 | A aula-arquétipo tem os blocos (`aula/AulaM01A08.tsx`, `aula/tronco.tsx`), mas aparecem todos juntos e sem ordem declarada | Escalonamento de 120 ms (na r04 do protótipo o que escalona é **o fio sob cada bloco**, não a opacidade do bloco — ver `prototipos/README.md`, item 3), marca de "1ª vez na sessão" em `sessionStorage` com try/catch | S6 (chegada), S7 | M |
| **MV-15** | **Momento 5, consequência** — marca da previsão traçada a 100 (`desenhoCurto`), "Comparar com o cálculo" a 800, marca do calculado no gesto, colchete e contagem da diferença a gesto+350, debrief a gesto+750; a referência **não existe no DOM** antes do gesto | O gesto existe e a referência já é retida: `viewer/ExercicioBlock.tsx:121-171` (`registrado` local, "Registrar resposta", `Comparacao` só depois). O instrumento não devolve nada: `viewer/InstrumentPanel.tsx:60-75` tem prop única e **nenhum callback** | Escala com marca de previsão e de cálculo, colchete e contador; callback de resultado no `InstrumentPanel` (é o mesmo bloqueio que `badgeRules.ts` classifica como `instrumentacao-ausente`) | S6 (consequência) | G |
| **MV-16** | **Momento 5, gate Rastro** — no quadro `t = 0` a linha de Praticado já mudou, em palavra e em silhueta, antes de qualquer animação | A linha existe e muda por estado React — `aula/tronco.tsx:1788-1835` ("Praticado · N de M atos"), com o provedor em `:564-605`. Mas: o registro **vive só na memória** (`useState`, sem storage e sem evento), "Percorrido" está fixo em "em leitura" e **não há linha "Demonstrado"** | A frase honesta do §4 M5 enquanto o evento não existe ("nesta sessão · ainda não salvo na conta", nunca "registrado"), a terceira dimensão (Demonstrado: ainda não avaliado) e o anúncio | S6 (Rastro), S3 | P |
| **MV-17** | **Momento 6** — linha de registro completa em `corte`; estação do mini-percurso se preenche por varredura angular a 150 (`desenhoCurto`); contador tabular "7 → 8 de 9" em um passo; próximo passo a 150 | `viewer/AulaViewer.tsx:162-177` troca o botão por "✓ Aula concluída" — uma linha, sem as três dimensões, sem data, sem contador e sem estação. Na A08 não há nem isso | Linha de registro com data e contador derivado da coleção, varredura da estação, contador tabular, anúncio | S6 (chegada), S3 | M |
| **MV-18** | **Momento 6, próximo passo** — "A seguir · M01·A09" entra a 150 **já clicável**, e clicar durante a coreografia chama `finish()` e navega | `aula/AulaM01A08.tsx:915-927` já monta `ProximoPasso` com M01·A09 e os três ramos (sem prática / a revisar / normal). Na aula genérica não há próximo passo nenhum | Levar o próximo passo para a aula genérica e ligá-lo ao `finish()` do momento | S1, S6 (M7) | P |
| **MV-19** | **Momento 6, gatilho** — `recordEvent('aula_concluida')` resolvendo com `aulaStatus.status === 'concluido'` é o que dispara os momentos 6 a 9 | **A aula-arquétipo do M01 não emite evento nenhum.** `aula/arquetipos.ts:30` roteia `modulo-01:8` para `AulaM01A08`, e não há `recordEvent` em `components/alexandria/aula/`. Só `viewer/AulaViewer.tsx:81,99` emite | Emitir `aula_iniciada` e `aula_concluida` na aula-arquétipo, com o mesmo terceiro estado de espera ("Registrando…", sem spinner). **Sem isto nada a jusante existe no M01**: nem conclusão de módulo, nem conquista, nem trecho novo na Home | S6, S3 | M |
| **MV-20** | **Momento 7** — anel do módulo se fecha a 850; "M01 · CONCLUÍDO" com a linha de três dimensões; trecho M01→M02 traçado na mini-carta a 1000; próximo passo a 150; medalha a 1400; teto de 2600 ms; vocabulário proibido ausente | Nada. O trecho da carta existe estático em `modulo/TrechoDaCarta.tsx` e `trilhas/RegistroNaCarta.tsx`. A contagem do M01 **está reconciliada** (`lib/data/alexandria-trilhas.ts:43`), então o gate P8 não bloqueia | Fechamento do limbo, palavra de identidade, traçado do trecho e encadeamento com MV-21; a variante sem contagem (frase de reconciliação) para os módulos `totalAulas: null` | S6 (chegada), S3, P18 | M |
| **MV-21** | **Momento 8** — disco cego → campo (280) → figura (480) → orla (680) → data batida (880), só opacidade entre camadas pré-renderizadas, caixa constante, abaixo do fio "REGISTRO DE PERCURSO", nunca modal | Nada no produto | Componente de cunhagem de 3 passes sobre os assets de MV-25/MV-27, com o rótulo, o nome em HTML, a data tabular, o critério em 1 frase e o link ao caderno | S6 (chegada), S3 (motivação abaixo da evidência) | M |
| **MV-22** | **Momento 10, header recolhendo** — sai com `translateY(-100%)` em `saida` 200; **nunca animar `height`** (M11 nomeia o defeito) | `shell/AlexandriaHeader.tsx:262` anima **exatamente** `height` e `opacity`. É a única violação de M11 já em produção | Trocar por `transform`; o localizador compacto sobe junto e fica visível em todos os quadros | S6 (M11), S5 | P |
| **MV-23** | **Momento 10, o resto** — foco em `corte` com `scroll-padding-top`; hover só cor e fio; pressionar sem afundar; gaveta entrando da borda com `entrada` 280 e foco no 1º item em `corte`, sem `backdrop-filter`; tooltip com 300 ms no primeiro e `corte` nos seguintes; verbete entrando da margem; carregamento sem spinner nos primeiros 400 ms | Parcial e sem contrato: a gaveta aparece seca (`shell/NavMovel.tsx:197-198`, `position: fixed; inset: 0`, sem `transform`); o hover latente já é só opacidade com guarda de reduzido (`comum/Marcas.tsx:336-339`); o foco da busca é rAF (`busca/BuscaDialogo.tsx:73`) | Seis cenas com filmstrip próprio (o protótipo p10 já tem as seis, com recorte a DPR 2) | S6, S7 | M |
| **MV-24** | **Momento 10, instrumento** — traçado e número acompanham o controle **no mesmo quadro**, latência ≤ 1 quadro, medida em log | `viewer/ControlesDeInstrumento.tsx` + `InstrumentPanel.tsx` recalculam por estado React; nunca foi medido | Medição de latência entre `input` e repintura, em log, a 1440 e a 390 | S6 (consequência) | P |

### 1.3 A medalha do M01

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| **MV-25** | Série r04 fechada: **74 artes × 2 estados × 3 faixas**, variante **B** (a decidida para papel), sem perda, alfa só no disco — `medalhas/webp/` com `_indice.json` (`"variante": "B"`, `"n": 444`, `"faltando": []`) | `public/` não tem **uma** medalha. O único arquivo parecido é `public/alexandria/gamificacao/badge-frame-lg-on-cream.png`, herdado e fora desta gramática | Publicar em `public/alexandria/v2/conquistas/<px>/<slug>-<estado>.webp` os 3 slugs do M01 (§4 deste documento) nas 3 faixas × 2 estados = 18 arquivos, com o `_indice.json` virando manifesto servido | §7 (mídia), S2 | P |
| **MV-26** | §6.5: 24 CSS = silhueta SVG · 48 CSS = asset 96 · 96 CSS = asset 192 · 192 CSS = asset 384. Estado "não obtida" = **disco cego**, relevo em papel sem tinta (nos assets: `alfa_max` 152 contra 255 da obtida) | Nada | Componente `<Medalha slug estado tamanho>` que escolhe a faixa pelo CSS e pelo DPR, com `alt=""` (o nome está no texto ao lado) e o cego como estado real, nunca cadeado ou placeholder | S2, S4, S7 | P |
| **MV-27** | §7.2: 4 PNGs cumulativos por medalha (`cego`, `campo`, `figura`, `orla`), faixas M e G | **Existem**: `medalhas/renders/camadas-B/` tem 592 arquivos = 74 slugs × 4 camadas × 192/384. A faixa de 96 (CSS 48) não tem camadas — e não precisa: a cunhagem só acontece a 96 CSS | Publicar as 4 camadas × 192 px dos 3 slugs do M01 (12 arquivos) e ligar ao componente de MV-21. Registrar que em `conclusao-primeira-aula` o degrau da figura é quase nulo (159,4 → 157,0 medido em `prototipos/captura/aceite-medalha-real.json`): essa medalha lê como **dois** passes, não três | S6 (aceite do momento 8) | P |
| **MV-28** | §6.3 e §6.5: a 24 CSS só a **silhueta de estado**, em `currentColor` | O desenho existe como folha de verificação — `medalhas/verificacao/silhuetas-24.svg` (obtida: disco cheio com anel e ponto vazado; não obtida: anel tracejado) | Virar componente ao lado de `MarcaEstacao` (`comum/Marcas.tsx`), para a linha da Home e as linhas de conquista secundária do momento 8 | S2, S7 | P |
| **MV-29** | §4 do catálogo: **caderno de marcos** no Progresso — obtidas por data agrupadas por família (48 na lista), detalhe e verso a 192, e as não obtidas **obtíveis hoje** como discos cegos com o critério | Não existe Progresso. `pages/alexandria/PerfilStub.tsx:295-302` imprime "Insígnias · N de 13" sobre o catálogo legado, que o próprio `sistema-de-conquistas.md` §3 aposenta inteiro | Superfície do caderno, com a virada do verso em corte ou cruzamento de 150 ms (sem rotação com mola) | D1, S3, S6 | G |
| **MV-30** | §7 M6 do bar: proveniência de todo asset no registro central | `medalhas/provenance.json` (329 KB) está completo e **local**; `docs/alexandria-v2/media-provenance.md` não recebeu a fusão (`CORRECOES.md`, "O que esta rodada NÃO fez", item 2) | Fundir a proveniência dos 18 arquivos publicados no registro central, por slug e faixa | §7 (M6) | P |
| **MV-31** | `CORRECOES.md`: a faixa V (768 px) **saiu da entrega** da r04 e os arquivos foram removidos de `renders/` e de `webp/`, porque a geometria mudou e manter os de r03 seria publicar dois desenhos da mesma medalha | `medalhas/webp-ouro/` **ainda tem 768** (148 arquivos, mtime 20 set. 13:15, anterior ao reempacotamento das 15:26) e o `_indice.json` dele declara `"variante": "B"` com 4 tamanhos — o que contradiz `webp/_indice.json` | Marcar `webp-ouro/` como r03 arquivada e impedir que ela entre na publicação de MV-25. É a única armadilha de asset errado desta frente | §7 (proveniência) | P |

### 1.4 As conquistas

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| **MV-32** | §1.2: o tipo `Conquista` (id, família, nome, critério, eventos, `disponibilidade`, `dependencia`, território, motivo, hierarquia). Saem `category: 'dominio'` e `expReward` | `src/lib/data/alexandria-badges.ts` tem os 13 legados com o tipo antigo; `sistema-de-conquistas.md` §3 manda 3 converterem, 8 virarem atividade recomendada e 2 saírem | Catálogo novo com as 30 conquistas (modelos + instâncias), e a migração dos 13 | S3, D2 | M |
| **MV-33** | §2.1: as instâncias de CONCLUSÃO concedíveis no M01 — ver §4 deste documento | `src/lib/progress/badgeRules.ts:84-200`: as 13 regras têm `avaliar: null`, classificadas por bloqueio; `avaliarPorConclusao` (`:230`) devolve `[]` **sem tocar a rede**, e `concederBadges` (`:240`) já é idempotente contra `badgeAlreadyAwarded` | Três regras de `avaliar` (primeira aula, primeira do Território I, M01 concluído) lendo a coleção, com "indisponível" — nunca `false` — quando a contagem não estiver reconciliada | S3, P8, P22 | M |
| **MV-34** | §5: com as outras famílias em desenho, o caderno mostra **uma linha só** — "Registros de prática, exploração e hábito: em desenho." Sem discos e sem lista de nomes indisponíveis | `PerfilStub.tsx:295-302` mostra a contagem sobre o catálogo aposentado, o que anuncia 13 insígnias que nunca serão concedidas | Trocar a contagem pela linha honesta, e depois pelo caderno (MV-29) | S4, S3 | P |
| **MV-35** | §4: na Home, **no máximo uma linha** sob a retomada — glifo de 24 + "Último registro: Módulo 01 concluído · 12 set.", só nos 7 dias seguintes ao registro. Nunca grade, nunca contagem, nunca XP | Nada na Home (`comum/Retomada.tsx`) | A linha, com a silhueta de MV-28 e a janela de 7 dias derivada de `awarded_at` | S3, D1 | P |

---

## 2. Os dez momentos: o que o protótipo prova, o que falta, e quais são do M01

**Legenda de escopo.** **M01** = acontece dentro do Módulo 01 e o Founder vai ver na avaliação. **Depois** =
só existe além do M01, e fechá-lo agora seria construir para uma tela que o M01 não alcança.

| # | Momento | Protótipo | O que ele prova | Escopo | Unidades |
|---|---|---|---|---|---|
| 1 | Chegada na Home: globo gira e o trecho é traçado | **não há protótipo** (os protótipos começam no 3) | — | **M01** | MV-09, MV-10 |
| 2 | Troca de trilha: V1→V2→V3 | **não há protótipo** | — | **M01** só na pré-visualização; a mudança real de trilha é **depois** (exige o Território I concluído) | MV-11 |
| 3 | Entrada de aula | `p03-entrada-aula.html` · folhas `p03-entrada-1440`, `-390`, `p03-voltar-1440` · interrupção medida a t=200: 15 animações vivas → 0, texto igual ao final | Que os três elementos compartilhados viajam sem duplicar título legível em nenhum quadro, que o voltar inverte, e que a interrupção leva ao estado final | **M01**, nas duas origens | MV-12, MV-13 |
| 4 | Abertura da aula | `p04-abertura-aula.html` · `p04-abertura-1440`, `-390` · interrupção 3 → 0 | Que a ordem pergunta → o que fazer → ato é medível por opacidade em log, e que a r04 escalona **o fio**, não o bloco (escalonar bloco simula latência) | **M01** | MV-14 |
| 5 | Registro de ato | `p05-registro-ato.html` · 6 folhas, incluindo `-dif0-` e `-dif30-` (a tira de amostras prova que nenhuma cor muda com o tamanho da diferença) e `-falha-` (rede bloqueada) | Que o Praticado muda no quadro 0, que o calculado não existe no DOM antes do gesto, e que a falha de rede devolve a linha sem apagar a previsão | **M01** (A08, INST·06), mas **em desenho (§9)**: nada emite `exercicio_respondido` nem `instrumento_usado` | MV-15, MV-16 |
| 6 | Conclusão de aula | `p06-conclusao-aula.html` · `-1440`, `-390` · interrupção a t=800: 4 → 0 | Que a linha de registro com as três dimensões cabe em `corte`, que a estação se preenche por varredura e que o próximo passo é clicável a t=150 | **M01** | MV-17, MV-18, MV-19 |
| 7 | Conclusão de módulo | `p07-conclusao-modulo.html` · `-1440`, `-390` e **`-sem-contagem-1440`** (`?reconciliada=0`) | Que o anel fecha, que "Concluído" entra sem vocabulário proibido, e que **sem contagem reconciliada o momento não dispara** — a variante já está capturada | **M01**: `bloco-01 = 9` aulas está reconciliado (`alexandria-trilhas.ts:43`) | MV-20 |
| 8 | Conquista obtida | `p08-conquista.html` · `-1440`, `-390`, `-duas-1440`, `-retroativa-1440`, `-alturas-1440` · 6 folhas de medalha isolada | Que os 3 passes são quadros distintos com luminância em degraus (medido: 217,8 → 184,8 → 159,2 → 145,2 no `conclusao-modulo-01-192`), que a caixa do DOM não varia, que duas conquistas dão **uma** medalha e uma linha, e que a retroativa não cunha | **M01**: três instâncias (§4) | MV-21, MV-25 a MV-28 |
| 9 | Marco de trilha | `p09-marco-trilha.html` · `-1440`, `-390` · interrupção 4 → 0 | Que a carta amplia de 160 para 320, que o replay segue a ordem da rota e que os números saem da soma da coleção | **Depois.** Exige os 5 módulos do Território I concluídos | — |
| 10 | Microinterações | `p10-microinteracoes.html` · 6 cenas (`foco`, `hover`, `gaveta`, `verbete`, `header`, `instrumento`), todas com recorte a DPR 2 | Que quase tudo é `corte`, que o hover não desloca caixa, que a gaveta não usa `backdrop-filter` e que o header sai **sem animar `height`** | **M01** (é o sistema) | MV-22, MV-23, MV-24 |

**Nota de honestidade sobre "nada está no produto".** Não é exato: o momento 3 na variante nó → módulo **está**
(`trilhas/continuidade.ts`), foi escrito com os tokens deste sistema e com uma quebra de heurística nomeada e
medida. É a única peça de movimento da Alexandria que já nasceu sob o S6 — e é ela que sustenta a recomendação
de biblioteca do §6.

---

## 3. A medalha do M01: o que falta para ela aparecer

**A série está pronta.** `medalhas/webp/_indice.json` declara 444 itens, variante **B** (a decidida para papel,
`CORRECOES.md` item 5: sobre papel a B tem ΔE 24,9 contra 11,4 da A), faixas 96/192/384, `"faltando": []` e
`"sem_alfa": []`. O aceite medido está em `DECISOES.md` e em `CORRECOES.md` §"Aceite": nenhum texto na arte,
meios-tons a ΔE00 ≤ 5 da rampa, orlas de família distinguíveis a 48 px em cinza (37–180× de separação), alfa só no
disco.

**Os três slugs que o M01 precisa** — e só três:

| Conquista | Slug | Quando aparece no M01 |
|---|---|---|
| `conclusao.primeira-aula` | `conclusao-primeira-aula` | na 1ª aula do M01 que o learner concluir |
| `conclusao.primeira-do-territorio.I` | `conclusao-primeira-do-territorio-I` | no mesmo evento da primeira aula (hierarquia: território > módulo, então **ela** cunha e a outra vira linha) |
| `conclusao.modulo.modulo-01` | `conclusao-modulo-01` | na 9ª aula, junto do momento 7 |

`conclusao.contagem.10` **não é do M01**: o M01 tem 9 aulas, e a décima cai no M02.

**O que falta, em ordem:**

1. **Publicar** (MV-25). 3 slugs × 2 estados × 3 faixas = **18 arquivos** em `public/`, mais as 4 camadas × 192 px
   dos mesmos 3 slugs = **12 arquivos** (MV-27). Trinta arquivos, todos já renderizados.
2. **Escolher a faixa pelo uso** (MV-26), com o mapa do §6.5 — fim de aula 96 CSS (asset 192), caderno 48 CSS
   (asset 96), detalhe 192 CSS (asset 384), linha 24 CSS (SVG). **Cada faixa é renderizada no seu tamanho**: não
   reduzir uma imagem grande. Os assets respeitam isso.
3. **O estado "não obtida" é o disco cego**, não um cadeado e não um placeholder: no índice, a cega tem
   `alfa_max` 152 (relevo translúcido, o papel da página atravessa a gofragem) contra 255 da obtida. É verificável
   no próprio arquivo.
4. **Os três lugares** do §4 do catálogo: fim de aula (96, abaixo do fio, nunca modal), Progresso/caderno (48 na
   lista, 192 no detalhe e verso — MV-29), Home (24, uma linha só, 7 dias — MV-35). **Mapa e Módulo não levam
   medalha**: lá a conclusão é estado de estação.
5. **Proveniência** (MV-30) e **a armadilha** (MV-31): `webp-ouro/` é r03, tem a faixa de 768 que a r04 removeu e
   declara a mesma variante. Publicar de lá seria publicar duas geometrias da mesma medalha.

**Limite honesto já registrado pela frente de medalhas.** O §2.1 descreve, na medalha de módulo, "o limbo com N
tiques". **A arte não grava N** — M10–M17 têm `totalAulas: null` e gravar o número seria inventá-lo. O anel de
tiques é camada SVG viva alimentada pela coleção, e some quando a contagem não está reconciliada. No M01 ela
aparece, com N = 9.

---

## 4. As conquistas computáveis hoje no M01

**A família CONCLUSÃO é a única que o backend sustenta**, porque ela lê `aula_concluida`, que é um dos dois únicos
eventos que o produto emite (`viewer/AulaViewer.tsx:81,99`). A persistência já existe (`badge_award`), a emissão já
é idempotente (`badgeRules.ts:240-254`, contra `badgeAlreadyAwarded`), e o caminho `avaliarPorConclusao →
concederBadges` já está ligado em `AulaViewer.tsx:109`. **Falta a regra, não o encanamento.**

| Conquista | Evento e regra | Concedível no M01? |
|---|---|---|
| `conclusao.primeira-aula` | `aula_concluida`; `aulasConcluidas.length ≥ 1` | **Sim**, na 1ª aula |
| `conclusao.primeira-do-territorio.I` | `aula_concluida`; ∃ aula concluída de módulo com `trilhaId` do Território I | **Sim**, no mesmo evento |
| `conclusao.modulo.modulo-01` | `aula_concluida`; `aulasDoModulo('modulo-01') ⊆ aulasConcluidas`, com `totalAulas !== null`, reconciliado e `length === totalAulas` | **Sim**: `bloco-01 = 9` em `lib/data/alexandria-trilhas.ts:43` |
| `conclusao.contagem.10` | `new Set(aulasConcluidas).size ≥ 10` | **Não no M01** (9 aulas) |
| `conclusao.territorio.I` / `conclusao.curriculo` | todos os módulos do território / dos três | **Não no M01** |
| `exploracao.tres-territorios-abertos` | `aula_iniciada` nos três territórios | Marcada "hoje" no catálogo, mas **não é do M01** |

**Duas conquistas no mesmo evento.** Na primeira aula do M01, `primeira-aula` e `primeira-do-territorio.I` caem
juntas. O §4 M8 manda **uma** medalha — a de maior hierarquia (território > módulo > contagem > hábito) — e a outra
como linha de texto com glifo de 24. A folha `p08-conquista-duas-1440` já prova o caso.

**O bloqueio que precede tudo (MV-19).** A aula-arquétipo do M01 — a A08, a peça que o Founder vai avaliar como
régua — **não chama `recordEvent`**. Concluí-la não gera evento, logo não gera conquista, não fecha o módulo e não
desenha trecho novo na Home. Enquanto isso não mudar, as três regras acima são concedíveis **no papel** e
inalcançáveis na aula que importa.

**Por que as outras famílias continuam "em desenho":**

- **PRÁTICA** — exige `exercicio_respondido` e `instrumento_usado`. O backend aceita os dois com `metadata` JSONB
  livre; **nada os emite**. A superfície existe e está muda: `viewer/ExercicioBlock.tsx:121-171` registra a resposta
  em `useState` e nunca sai da página; `viewer/InstrumentPanel.tsx:60-75` tem prop única (`instrumento`, `contexto`,
  `fonte`) e **nenhum callback de resultado** — é o bloqueio que `badgeRules.ts` classifica como
  `instrumentacao-ausente` e chama de "o mais barato de abrir". Falta também **fixar o `metadata`** com o CURSOR
  (o contrato pretendido está no §2.2 do catálogo).
- **EXPLORAÇÃO** — 8 das 9 exigem tipos de evento novos (`atlas_explorado`, `termo_aberto`, `fonte_aberta`,
  `portal_visitado`, `termo_guardado`), o que significa ampliar o `CHECK` de `progress_event.event_type`, que é
  posse do CURSOR. A nona (`tres-territorios-abertos`) é computável hoje e não é do M01.
- **HÁBITO** — `study_streak` existe e volta em todo evento, mas tem dois defeitos medidos: o dia é o
  `CURRENT_DATE` do banco (provavelmente UTC, então estudo às 22h em Brasília conta para o dia seguinte) e **todo**
  evento alonga a sequência, **inclusive `badge_conquistado`** — um registro automático de conquista esticaria a
  sequência do learner. Com os dois consertos (posse do CURSOR), as regras viram "hoje".
- **SINAIS DE COMPETÊNCIA** — não são conquistas e não entram no caderno. Exigem uma **tarefa explicitamente
  portadora de evidência**, uma regra de avaliação e o registro da resposta — as três decididas na fase de
  Assessment (P18). Hoje a interface mostra só "Demonstrado: ainda não avaliado", e **nenhuma plaqueta vazia,
  bloqueada ou com cadeado**.

---

## 5. Movimento reduzido e interrupção: o que precisa ser verificado em filmstrip

O S6 tem quatro gates, e dois deles são exatamente estes: **"movimento reduzido chega ao mesmo estado final"** e
**"screenshot estático nunca aprova movimento"**. A verificação, então, não é uma inspeção: é uma medição.

**O contrato (§2.3).**

- **Some:** translate, scale, rotação do globo, sequência de quadros, traçado progressivo, contador e cunhagem em
  passes.
- **Fica:** no máximo **um** corte de opacidade de `estado` (150 ms) no bloco que mudou.
- **Idêntico:** o estado final — palavras, números, silhuetas, trecho desenhado, medalha no estado final e foco.
- **Medição:** com reduce, `document.getAnimations().length === 0` em repouso e **≤ 1** durante o momento.

**O que a folha tem de provar, momento a momento:**

1. **Último quadro normal = último quadro reduzido**, na região de estado. Diferença de pixel ≤ 0,5%, tolerada só
   na suavização de fonte, e `textContent` **idêntico** em palavras e números. Não é "parecido": é comparação.
2. **Nenhum quadro além da posição final.** Medido por `getBoundingClientRect` a cada rAF, **em log, não a olho**.
   É o que reprova overshoot mesmo quando a curva é legal.
3. **Quadro 0 do reduzido já é o estado final.** Nos momentos 1, 6, 7 e 9 isso significa: trecho desenhado,
   estações cheias, anel, chamada, contador no valor final e medalha cunhada — tudo no primeiro quadro.
4. **Interrupção a t = 200 leva ao estado final no quadro seguinte.** O protótipo já mede isso em 7 trabalhos
   (`prototipos/captura/interrupcao.json`): p03 15 animações vivas → 0, p04 3 → 0, p06 4 → 0, p07 4 → 0, p08 9 → 0,
   p09 4 → 0, **e p10-gaveta-390 com `textoIgualAoFinal: false`** — a gaveta é a exceção conhecida e é a única que
   ainda precisa de resposta. Seis de sete passam.
5. **Nenhuma coreografia não interrompível.** Isso inclui a sequência de quadros do globo (MV-09): o playback em
   rAF tem de aceitar `finish()` e saltar para a pose final, e não terminar a sequência.
6. **Repouso limpo.** Nenhum `fill: forwards` acumulado: em repouso, `document.getAnimations()` vazio nos dois
   modos. É o que impede que a página fique com animações vivas depois de cinco conclusões.
7. **Aba oculta.** Com `document.visibilityState === 'hidden'` na confirmação do evento, o momento vai direto ao
   final — porque a aba oculta estrangula o rAF a ~1 Hz e uma coreografia em câmera lenta é defeito.
8. **A preferência muda em tempo de execução.** Ativar "reduzir movimento" no meio de uma sessão tem de valer no
   momento seguinte, sem recarregar. É o que MV-02 resolve e o que seis `matchMedia` soltos não garantem.
9. **≥ 6 quadros no normal e 2 no reduzido**, com a legenda trazendo viewport, DPR, estado, rota, eventos emitidos
   e a tira de amostras — e, em navegação, a faixa de URL composta na folha (o headless não tem barra de endereço).

**Uma medição que já sabemos que vai falhar por definição, e a redação certa.** O aceite do momento 8 diz "caixa da
medalha constante". A caixa do **DOM** é constante (o `<img>` tem largura e altura fixas). O que varia é a **arte**:
a borda percebida do disco encolhe **1,00 px CSS** a 192 e **1,50 px CSS** a 384 entre o cego e a orla, porque a
orla é levemente reentrante (medido em `prototipos/captura/aceite-medalha-real.json`). O critério tem de dizer
"caixa do DOM constante", não "disco constante", ou reprova a arte por um efeito da própria cunhagem.

---

## 6. A biblioteca de movimento: as três, medidas contra o que o M01 precisa

A decisão está pendente desde o §1 do sistema de movimento ("a escolha entre a View Transitions API, a biblioteca
`motion` e FLIP escrito à mão fica com o LYCEUM e o Founder"), e o §6 registra que **adotar biblioteca é decisão de
dependência**. O `package.json` não tem nenhuma biblioteca de movimento; tem `d3-geo`, `three`, `@react-three/*` e
React 19.2.

**O que o M01 precisa, concretamente:** (a) elemento compartilhado entre rotas, três viajantes, com `translate` +
`scale` e sem animar `font-size` (MV-12/MV-13); (b) traçado por `stroke-dashoffset` com duração derivada do
comprimento (MV-10, MV-17, MV-20); (c) playback de sequência de quadros em `canvas` (MV-09); (d) três passes de
opacidade entre imagens pré-renderizadas (MV-21); (e) `finish()` global que leva ao estado final (MV-04); (f) modo
reduzido com **zero** animações e o mesmo estado final (MV-02).

| Critério | View Transitions API | `motion` (motion.dev) | FLIP escrito à mão em rAF |
|---|---|---|---|
| Custo de dependência | zero (plataforma) | **nova dependência** e runtime em componentes | zero |
| Elemento compartilhado entre rotas | é literalmente o caso de uso | `layoutId`, maduro | já escrito: `continuidade.ts:1-366` |
| Traçado, canvas e passes de opacidade | **não cobre** — continuam à mão | cobre o traçado; canvas continua à mão | cobre tudo com o mesmo motor |
| Interrupção ao estado final | `skipTransition()` existe, mas a coreografia é de pseudo-elementos que não estão no DOM | `.stop()` / `.complete()` por animação | `finish()` explícito, **já medido**: 6 de 7 trabalhos idênticos ao estado final |
| Medição por `getBoundingClientRect` a cada rAF (aceite §3.2) | **impossível**: pseudo-elementos não são nós mensuráveis | possível nos nós reais | é como `continuidade.ts` já mede |
| Aparecer no `recordVideo` do Playwright (o gate que aprova) | anima no compositor | anima no compositor por padrão | **medido que aparece** |
| Proibidos do S6 (M2) | sem mola por padrão | **spring com bounce é o padrão** — tem de ser desligado em cada chamada | não existe mola no motor |
| Portão automático F-M1 (MV-06) | teria de inspecionar CSS de pseudo-elemento | teria de inspecionar **props de componente**, não CSS | inspeciona CSS e tokens, como especificado |
| Suporte | Safari e Firefox ainda desiguais em cross-document | amplo | universal |

**Recomendação: FLIP escrito à mão em `requestAnimationFrame`**, promovendo `trilhas/continuidade.ts` a módulo de
movimento da Alexandria (`src/components/alexandria/movimento/`), com quatro primitivas — viajante (FLIP),
traçado (`stroke-dashoffset`), passes (opacidade entre imagens) e sequência (`canvas`) — mais o registro de
animações que MV-04 exige.

**O argumento, e ele não é de ergonomia.** O critério que decide aqui é o **gate de aprovação**, não a
produtividade: pelo S6, movimento só é aprovado por filmstrip, e o filmstrip é gravado pelo `recordVideo` do
Playwright. Este repositório já mediu que uma animação de `transform`/`opacity` pela Web Animations API roda no
compositor **sem repintura da thread principal**, e que o gravador não registrou um só quadro do trajeto — o webm
saltava de 38% de campo navy para 0% de um quadro para o outro, embora a animação estivesse correta (a nota e a
medição estão em `trilhas/continuidade.ts:305-320`). As duas alternativas de biblioteca põem a animação exatamente
nesse caminho. Adotar uma delas seria adotar uma dependência cujo resultado **o gate do bar não consegue aprovar**.
Some-se: `motion` traz mola com bounce como padrão, que é o primeiro item da lista de proibidos do S6, e move a
superfície do portão automático (F-M1) de CSS para props de componente, onde o lint especificado não alcança.

**O que custa, dito na cara.** FLIP à mão é mais código por momento. A mitigação é que os dez momentos cabem em
quatro primitivas, e as quatro já existem escritas em `prototipos/_base/movimento.js` — o porte de MV-03 é
transcrição com teste, não invenção. E a exceção já está autorizada pela própria especificação: o §1 manda o globo
e o traçado ficarem "em rAF ou WAAPI", e `continuidade.ts` registra por que o elemento compartilhado entrou na
mesma linha.

**Não implementar nesta rodada.** Isto é uma recomendação com argumento, e a adoção continua sendo decisão do
Founder (§6: "esta especificação não autoriza adotar uma biblioteca de movimento").

---

## 7. Pesquisa — o que não é unidade de trabalho porque não se verifica no render

1. **A contradição medida sobre a WAAPI.** Os protótipos usam WAAPI com `fill: backwards` e os **44 vídeos
   capturaram o movimento**; `continuidade.ts:305-320` mediu o oposto num viajante de `document.body` atravessando
   troca de rota. A hipótese é que o protótipo repinta a cada quadro porque muda o DOM antes de animar, e o
   viajante não. **Isto precisa ser reproduzido e explicado antes de a decisão do §6 virar regra permanente.** Não
   muda a recomendação — o caminho rAF é o único medido funcionando nos dois casos —, mas muda a razão escrita.
2. **Formato e orçamento da sequência do globo.** O §5.3 fixa ≤ 2,5 MB por aresta a 1040 e ≤ 0,8 MB a 520, "medido",
   e diz que se a textura estourar o orçamento a alternativa é VP9 com alfa — que Safari não tem. Enquanto nenhum
   quadro foi renderizado, o número não existe e a escolha de formato é especulação.
3. **A qualidade WebP dos quadros** ("a calibrar no render") e o limiar de *flicker* entre quadros vizinhos
   ("a calibrar"): dois parâmetros que só saem da primeira leva de render.
4. **O vernier do momento 5** ("opcional, a validar no render"): se as duas marcas podem ser lidas como escalas que
   se alinham, sem mola e sem passar do ponto.
5. **A exceção da gaveta na interrupção.** `interrupcao.json` registra `p10-gaveta-390` com
   `textoIgualAoFinal: false` "pelo mesmo motivo de sempre", e o motivo não está escrito em lugar nenhum que eu
   tenha encontrado. Precisa ser nomeado antes de virar critério.
6. **O defeito de redação do §6.3 do catálogo** (já encontrado pela frente de medalhas): a regra literal exige
   rampa tonal contínua **e** picos a ΔE00 ≤ 5 de **um token** — incompatíveis, porque um meio-tom legítimo da
   rampa cai entre dois tokens (pico típico em L\*=65, a 12,8 do ouro e 16,1 do creme afundado, e a **0,1** da
   rampa). `verificar.py` já mede distância até a rampa; **a redação do documento ainda não foi corrigida**, e é
   decisão de quem mantém o documento.
7. **O critério "caixa constante" do momento 8** precisa virar "caixa do DOM constante" (ver §5, último parágrafo),
   senão reprova a arte por um efeito da cunhagem.
8. **O fuso do `study_streak`** e o filtro de tipo de evento são consertos de backend (posse do CURSOR) cuja forma
   exata — fuso do learner ou `America/Sao_Paulo` fixo — não está decidida.
9. **`conclusao-primeira-aula` lê como dois passes, não três** (degrau da figura 159,4 → 157,0). É informação para
   a frente de medalhas decidir se redesenha a figura dessa medalha ou se aceita a leitura de dois passes.

---

## 8. A ordem que eu proporia, se me perguntassem

Não é decisão minha, e não está aprovada. É só a ordem em que as dependências caem.

1. **MV-19** (a aula-arquétipo emite evento). Sem ele, seis unidades a jusante são teóricas.
2. **MV-01, MV-02, MV-05** (tokens, reduzido, anúncio): três unidades P que todas as outras consomem.
3. **MV-03 + MV-04** (motor e interrupção), depois **MV-07 + MV-08** (harness e fixture E4) — porque a partir daqui
   nada pode ser aprovado sem filmstrip.
4. **MV-13** (aceite do que já existe): a primeira folha do produto, e a mais barata.
5. **MV-16, MV-17, MV-18** (o fim de aula honesto), **MV-25 a MV-28** (a medalha publicada), **MV-21** (cunhagem),
   **MV-33** (as três regras), **MV-20** (o fim do módulo).
6. **MV-10** (o trecho traçado na Home, que fecha o laço do M01 concluído), depois **MV-12**, **MV-14**, **MV-22**.
7. **MV-09** e **MV-11** (o globo girando) por último entre os do M01: são os únicos que dependem de render novo.
8. **MV-15** e o resto da família PRÁTICA quando o `metadata` estiver fixado com o CURSOR.
