# Filme de apresentação da Alexandria — procedência (v3)

Roteiro e fonte de cada frase: [`roteiro.md`](roteiro.md). Composição: [`composicao/`](composicao/).
Saída: `public/alexandria/v3/home/filme/` (`alexandria-apresentacao.mp4`,
`alexandria-apresentacao.webm`, `poster.webp`, `pt-BR.vtt`).

A v2 (15/11/2026) seguiu o ajuste de direção do Founder: motion graphic com as
**telas reais** da plataforma. A **v3** segue a instrução seguinte dele:
misturar no mesmo filme os vídeos já gerados no Higgsfield e a captura real,
sem descartar material — os cinco planos Kling estão no corte — e pôr
locução (ElevenLabs, workspace Creator; ver [`locucao.md`](locucao.md)). O filme tem duas
classes de imagem, e cada plano declara a sua no quadro:

| Classe | Onde | Selo no quadro |
|---|---|---|
| **Tela real** da Alexandria, capturada no dev server da worktree | índice, aula, instrumento, glossário, biblioteca, registro, cartão da Retomada | `TELA REAL` (+ `CONTA DE DEMONSTRAÇÃO` quando há sessão) e a rota acima da folha |
| **Gravura gerada** (`REGRA-DE-IMAGEM.md` §4, atmosfera) | abertura, tese (cidade), pergunta (campo), dia seguinte, fecho | `GRAVURA GERADA` |

Nenhuma pessoa foi gravada ou gerada. O trecho do Founder está reservado (ver
`roteiro.md`, "Trecho aberto para o Founder").

## Créditos

Nem a v2 nem a v3 geraram nada no Higgsfield: o filme usa os cinco planos
Kling da v1, e o resto é captura de tela. Higgsfield continua em **337,00
créditos**, todos da v1. A locução gastou **909 caracteres** do ElevenLabs
(workspace Creator do Founder; 12.191 de 351.736 já usados antes de gerar):

| Item | Modelo | Qtde | Créditos | Na v3 |
|---|---|---|---|---|
| Placas (gravuras paradas) | GPT Image 2.6 · alta · 2K · 16:9 | 8 | 22,00 | 4 são quadro inicial/final de planos usados (sala noite e manhã, cidade, campo) |
| Movimento usado na v1 | Kling 4.0 · image-to-video · 1080p | 5 (10 + 13 + 11 + 13 + 13 s) | 195,00 | **os 5 usados**: sala (abertura), cidade (tese), campo (pergunta), sala noite → manhã (dia seguinte), salão da Trilha I (fecho) |
| Movimento de comparação | MiniMax H3 · 2K | 5 | 120,00 | nenhum |
| **Total Higgsfield** | | | **337,00** | |
| Locução | ElevenLabs `eleven_multilingual_v2`, voz Henrique | 10 falas | 909 caracteres | todas usadas |

Conferido no extrato (`transactions`): 8 cobranças de GPT Image 2.6 entre
02:18 e 02:20 UTC e 10 de vídeo entre 02:20 e 02:25 UTC de 15/11 somam 337,00.
O saldo caiu mais 5,14 depois disso (Eleven v4 e Seed Audio às 03:19) e há
imagens às 02:08–02:10: **não são desta sessão** — a conta é compartilhada com
a sessão irmã de imagens do M01.

## Telas reais — captura

- **Origem:** `http://127.0.0.1:5321` (dev server da worktree
  `wave/alexandria-v3`), Chrome do sistema via Playwright, headless.
- **Determinismo:** viewport 1440×810 CSS (1440×1125 nas interações) a DPR
  4/3 = 1920 px de largura, relógio fixo do harness, `reducedMotion: reduce`,
  fontes carregadas antes do quadro.
- **Sessão:** `/api/*` respondido pelas fixtures de
  `tools/alexandria-capture/fixtures.mjs` (somente leitura): estado `E0` (sem
  conta) para índice, glossário e biblioteca; `E2` (conta de demonstração com
  7 aulas do M01 percorridas) para aula, instrumento, registro e Retomada.
  O nome fictício da fixture aparece no cabeçalho e na saudação da tela; os
  dois ficam **fora do quadro** — as interações foram recortadas 88 px abaixo
  do topo (sem o cabeçalho) e o Início com conta é enquadrado abaixo da
  saudação.
- **Script:** [`composicao/captura/cena.mjs`](composicao/captura/cena.mjs) —
  cenas `longas` (páginas inteiras), `previsao` (43 quadros: campo vazio →
  digita 4, 0 → *Registrar previsão* → "40,0 % registrado"), `regua` (178
  quadros: previsão registrada, régua *Geração no período* arrastada com o
  mouse em curva suave de 25,1 % → 50 % → 16 % → 25,1 %), `registro` (a aula
  inteira depois do registro).
- **Achado de método:** `page.fill` não dispara o `onChange` desse campo e a
  previsão não chega ao instrumento — é preciso digitar (`keyboard.type`).
- **Nada foi retocado** nas telas: o que aparece é o que o produto renderizou.

| Arquivo de cena | Rota | Estado | Uso |
|---|---|---|---|
| `indice.png` (1920×6435) | `/alexandria/trilhas` | E0 | cena 2 |
| `previsao.mp4` (de 43 PNG; tempos em `captura/previsao-tempos.txt`) | Aula 08 do M01 | E2 | cena 3 |
| `regua.mp4` (de 178 PNG, a 16 q/s) | Aula 08, INST·06 | E2 | cena 4 |
| `glossario.png` (1920×1455), `biblioteca.png` (1920×3145) | `/alexandria/glossario`, `/alexandria/biblioteca` | E0 | cena 5 |
| `aula-registrada.png` (1920×6237), `home-conta.png` (1920×1649) | Aula 08 após o registro; `/alexandria` | E2 | cenas 6 e 7 |

### Achado de produto (para o LYCEUM, fora da minha posse)

No INST·06, quando a caixa enche perto da linha tracejada da previsão (ex.:
50 % com previsão de 40 %), o rótulo "438.000 MWh entregues · 50,0 %" fica
atravessado pela linha "sua previsão · 40,0 %". Por isso o pôster usa o quadro
de 33,1 %, onde os dois não colidem.

## Gravuras geradas (da v1, todas no corte)

Na v3 entram os cinco planos: **P1 sala** (abertura, 00:00–00:07,6), **P2
cidade** (tese, 00:07,0–00:13,4), **P3 campo** (pergunta, 00:23,2–00:29,2),
**P6 sala noite → manhã** (dia seguinte, 01:09,8–01:19,4) e **P7 salão da
Trilha I** (fecho, 01:18,8–01:26). O detalhe da geração segue abaixo, como foi feito na v1.

### Escolha de modelo, e por quê

Consultei o catálogo (`models_explore`, vídeo com imagem de entrada) e medi
o preço de quatro candidatos para 10 s: Kling 4.0 1080p **32,5**, MiniMax H3
2K **20**, Kling 3.0 pro **17,5**, Seedance 2.5 1080p **160**.

- **Imagem: GPT Image 2.6** (qualidade alta, 2K). É o modelo das visões da
  rodada 01 e das gravuras já aprovadas; usar o mesmo mantém a mesma mão de
  gravador. As gravuras aprovadas entraram como `image_references`.
- **Movimento: Kling 4.0**, depois de rodar o mesmo prompt nos dois
  finalistas e olhar quadro a quadro:
  - **MiniMax H3** ignorou a instrução "avanço de cerca de dez por cento" e
    fechou num close de ~2,5× na lâmpada: o plano perde a sombra onde mora o
    título, e a hachura vira pintura lisa no close. No plano da cidade, ele
    escureceu o céu quase até a noite — mais dramático, mas o letreiro mora
    no céu.
  - **Kling 4.0** fez exatamente o movimento pedido (avanço ~1,3×, câmera
    travada no amanhecer, recuo lento no salão), preservou linha e papel, e
    aceita quadro inicial **e final** — o que permitiu o plano 6 ir da placa
    noturna à placa da manhã sem inventar a sala de novo.
  - Seedance 2.5 descartado pelo preço (5× o Kling para a mesma duração) sem
    vantagem declarada para imagem-para-vídeo de ilustração.
  - Saída do Kling: 1912×1080 (1916×1080 no P7), 24 fps, com faixa de áudio
    gerada. Na montagem: áudio descartado, `scale` lanczos + `crop` para
    1920×1080 (0,4 % de ampliação).

### Referências enviadas ao Higgsfield

| media_id | Arquivo | Uso |
|---|---|---|
| `0c05dfc6-6010-41f2-a383-62be5a28b5ba` | `public/alexandria/v3/trilhas/trilha-I-2400.webp` (aprovada) | referência de estilo nas placas; quadro inicial do P7 |
| `e0b273f6-72f9-4752-9611-d6c496dfcb5a` | `public/alexandria/v3/home/home-aula-2400.webp` (aprovada) | referência de estilo (sala) |
| `189d89a7-a440-43a2-8b23-8c3538d9cc27` | `public/alexandria/v3/home/home-farol-2400.webp` (aprovada) | referência de estilo (cidade, campo) |

Sufixo de estilo comum a todas as placas:

> Fine steel-engraving / etching illustration in the style of a 19th-century
> book plate: dense cross-hatching and parallel-line shading, printed in navy
> blue ink on warm parchment paper; the only accent is a restrained warm gold
> […]. Match the linework, ink colour and paper tone of the reference
> engravings exactly. No text, no letters, no numbers, no signature, no
> watermark, no border.

Sufixo comum a todos os movimentos:

> Preserve the image exactly as a printed engraving: identical navy-ink
> cross-hatching on parchment paper, same lines, no morphing, no new objects,
> no people, no text, no cuts.

### Placas (imagem parada)

Todas: `gpt_image_2_6`, `quality: high`, `resolution: 2k`, `aspect_ratio: 16:9`,
saída 2688×1520 PNG. Duas variantes por placa; a escolhida está em negrito.

| Placa | job id | Referências | Escolha |
|---|---|---|---|
| sala (noite) — A | `a6beb3d4-e5c2-497a-9d88-288c84ebcfcc` | trilha-I, home-aula | descartada: as cadeiras avançam para a metade esquerda, onde entra o título |
| **sala (noite) — B** | **`efa762f8-5b72-4367-912b-b295ff0392f1`** | trilha-I, home-aula | **usada (P1, quadro inicial do P6)** |
| **cidade — A** | **`2fd0aacd-1870-49ec-b45d-386941373735`** | trilha-I, home-farol | **usada (P2)**: poucas janelas acesas, céu calmo para o letreiro |
| cidade — B | `743df9f2-8e09-485e-ae65-9d0d13ee5d5c` | trilha-I, home-farol | descartada: céu com nuvens fortes onde entra o texto |
| **campo — A** | **`a26e9410-59dd-43cf-abfd-b8dd06d460e6`** | trilha-I, home-farol | **usada (P3)** |
| campo — B | `a170e2c5-2c74-4340-b697-3168970df2e2` | trilha-I, home-farol | descartada: nuvens mais densas na faixa do título; a A deixa o céu mais aberto |
| sala (manhã) — A | `a6fc1128-1257-4d9d-9225-111c8bf8c1e8` | sala B | descartada (quase idêntica; céu mais frio) |
| **sala (manhã) — B** | **`606fe26f-b756-4d38-b47c-3450a1526ec3`** | sala B | **usada (quadro final do P6)** |

Prompts (a parte que muda; o sufixo de estilo acima completa cada um):

- **sala (noite):** "Empty reading room of an old public library at night. A
  long wooden reading desk in the right half of the frame with one large open
  book and a lit brass reading lamp casting a soft pool of light; tall wooden
  bookshelves full of books receding into darkness; a tall arched window on
  the far right showing a night sky. No people anywhere. Calm, quiet, still.
  Keep the left third of the image as dark, simple, low-detail shadow (space
  for a title)."
- **cidade:** "A town of low houses and small apartment buildings at dusk,
  seen from a gentle hill. In the foreground, wooden utility poles with
  electric wires leading down into the streets. A handful of windows are lit
  with warm gold light, most windows still dark; a high-voltage transmission
  tower stands on the far ridge. Large calm evening sky occupying the upper
  half (space for text). No people. Quiet, intentional, documentary calm."
- **campo:** "A wide open landscape at midday. Rows of ground-mounted solar
  photovoltaic panels run across the lower third of the frame toward rolling
  hills. Far away on the right horizon, a small thermal power station with a
  single chimney releasing a thin plume. Large cumulus clouds in a wide sky
  fill the upper half (space for text); their shadows lie on the fields. No
  people. Calm and spacious."
- **sala (manhã):** "Edit this exact engraving: keep the identical room,
  camera position, composition, shelves, columns, desk, chairs, lamp and open
  book in exactly the same places and the same linework. Change only the time
  of day to early morning: the brass lamp is now switched off, and pale early
  sunlight enters through the tall arched window on the right, casting long
  soft diagonal rays across the floor and onto the desk and the open book; the
  window shows a pale dawn sky instead of the moon and stars. The left side of
  the room becomes a little lighter but stays calm and low-detail. Same navy
  ink on warm parchment paper, cross-hatching engraving style; the only accent
  is a restrained warm gold in the morning light. No people. No text, no
  letters, no numbers, no signature, no border."

### Planos (movimento)

A coluna "Tempo no filme" é da v1. Na v3: P1 em 00:00–00:07,6 (abertura), P2
em 00:07,0–00:13,4 (tese), P3 em 00:23,2–00:29,2 (pergunta), P6 em
01:09,8–01:19,4 (dia seguinte, 9,6 s dos 13 gerados), P7 em 01:18,8–01:26
(fecho, 7,4 s).

| Plano | Tempo no filme | Modelo | job id (usado) | Duração gerada | Quadro inicial → final | Créditos | Alternativa MiniMax H3 (não usada) |
|---|---|---|---|---|---|---|---|
| P1 sala | 00:00–00:10 | `kling4_0` 1080p | `0665b0ca-6762-4df5-b047-c6442d3e4deb` | 10 s | sala B | 32,50 | `baed8979-2d07-4589-a315-d62f4384d05a` (20,00) |
| P2 cidade | 00:09–00:22 | `kling4_0` 1080p | `6b596c8f-5a7e-41da-af69-232b6b96f3ce` | 13 s | cidade A | 42,25 | `9920efcd-45ac-4df6-a490-8c6b60917093` (26,00) |
| P3 campo | 00:21–00:32 | `kling4_0` 1080p | `d52fc942-ab51-4451-91f5-992932362f72` | 11 s | campo A | 35,75 | `eff60629-c4d0-4b3b-819a-36dcebb86462` (22,00) |
| P4–P5 prancha | 00:31–00:56 | — (tipografia na montagem) | — | — | — | 0 | — |
| P6 sala, noite → manhã | 00:55,5–01:08,5 | `kling4_0` 1080p | `4c30eca0-26d3-4ab8-a361-bd327367bd8c` | 13 s | sala B → sala manhã B | 42,25 | `0b44d455-50b5-48cb-bfa4-2f24e962bd7b` (26,00) |
| P7 salão da Trilha I | 01:07,5–01:20 | `kling4_0` 1080p | `a59234fc-70e0-482a-9c76-57b78a953120` | 13 s (12,5 usados) | trilha-I aprovada | 42,25 | `b1bd1f20-4777-44d3-86fa-561c3404cb6e` (26,00) |

Prompts de movimento (o sufixo comum acima completa cada um; idênticos nos
dois modelos):

- **P1:** "A single continuous shot. The camera dollies forward very slowly
  and steadily toward the lit desk and the open book, a gentle push-in of
  about ten percent. The lamp light breathes almost imperceptibly and a few
  faint dust motes drift through its glow. Nothing else moves. […] Calm and
  contemplative."
- **P2:** "A single continuous shot. Dusk deepens slowly: the evening sky light
  lowers, and one by one more windows across the town light up with warm gold
  light, a slow gentle wave spreading through the streets. The camera rises
  very slightly and very slowly. Poles and wires stay perfectly still; a faint
  breeze moves the grass on the hill. […] Calm, quiet."
- **P3:** "A single continuous shot. Cloud shadows drift slowly across the
  fields and over the rows of solar panels; the warm glint on the panels dims
  under a passing shadow and then returns. The clouds move slowly across the
  sky and the thin plume from the distant chimney drifts. The camera makes a
  very slow lateral drift to the right. […] Calm, spacious."
- **P6:** "A single continuous shot with a locked, completely still camera.
  Time passes from night to early morning: the warm lamp light slowly fades
  out, the moonlit window slowly brightens to a pale dawn, and long rays of
  morning sunlight sweep slowly across the floor and onto the desk and the
  open book. Nothing else moves. […] Quiet."
- **P7:** "A single continuous shot. The camera pulls back very slowly along
  the great hall. Shafts of sunlight through the tall windows shift slowly
  across the floor; a little steam drifts from the pipe at the top right; the
  large flywheels turn slowly. The few small figures stay still. […] no new
  people […] Calm, monumental."


## Montagem (v3)

- **HyperFrames 0.9.50**, uma sub-composição por cena em
  [`composicao/compositions/`](composicao/compositions/) — `abertura`, `tese`,
  `indice`, `pergunta`, `aula`, `instrumento`, `fontes`, `registro`,
  `retomada`, `fecho` — e `fundador.html` pronta e desligada. O `index.html`
  posiciona as cenas e as dez falas no tempo; o comentário do topo diz como
  encaixar o Founder.
- **Gramática de movimento:** nas cenas de tela, folha de 1160×900 com fio de
  1 px (raio zero, sem sombra) à direita e, à esquerda, rótulo de capítulo em
  Plex Mono, fio ouro que se desenha, manchete em Newsreader e frase de apoio;
  a câmera percorre a captura (panorâmica no índice, aproximação no ato de
  previsão e na caixa que enche, troca lateral glossário → biblioteca). Nas
  cenas de gravura, o movimento é o do plano Kling, com véu de pergaminho
  sob o letreiro. Entre cenas, dissolve de 0,6 s.
- **Fontes:** Newsreader, IBM Plex Mono, Instrument Sans (OFL, de
  `node_modules/@fontsource*`).
- **Som:** só a locução (dez `<audio>` no `index.html`, uma fala por cena,
  sem sobreposição); normalizada no encode com `loudnorm` (alvo −16 LUFS,
  pico −1,5 dBTP). Sem música. Arquivos das falas em
  [`composicao/assets/voz/`](composicao/assets/voz/).

## Exportação (v3)

| Arquivo | Vídeo | Áudio | Peso | Duração | Quadros |
|---|---|---|---|---|---|
| `alexandria-apresentacao.mp4` | H.264 High@4.1, 940 kbps, dois passos, `+faststart` | AAC mono 48 kHz, ~56 kbps | **10.959.598 B (11,0 MB)** | 89,208 s | 2141 |
| `alexandria-apresentacao.webm` | VP9, 940 kbps, dois passos | Opus mono 64 kbps | **11.142.282 B (11,1 MB)** | 89,216 s | 2141 |
| `poster.webp` | quadro do instrumento, caixa em 33,1 % (cena 4) | — | 100.004 B | — | — |
| `pt-BR.vtt` | 12 deixas, transcrição da locução nos tempos em que é falada | — | 1.597 B | — | — |

A taxa de vídeo caiu de 1150 para 940 kbps para caber a voz e os 9 s a mais
dentro dos 12 MB.

## Verificação (feita no arquivo exportado)

- **Quadro a quadro:** 1 quadro por segundo do MP4 e do WebM finais em folhas
  de contato (5 × 20) e quadros cheios nos pontos críticos. As duas cenas do
  Higgsfield que voltaram (tese e pergunta) entram no lugar certo; nenhum
  quadro preto, nenhum salto, o nome da fixture nunca aparece.
- **Som:** as dez falas caem nas janelas planejadas — os silêncios medidos
  (`silencedetect`, −45 dB, ≥ 1,5 s) começam e terminam onde o roteiro de
  locução prevê. Loudness integrada **−19,3 LUFS** (MP4) / −19,2 (WebM), pico
  −1,0 dBFS: abaixo do alvo de −16 porque a faixa tem longos silêncios entre
  as falas e o `loudnorm` de passo único não sobe o ganho além do teto de
  pico; é volume confortável de voz para web.
- **SSIM contra o master:** MP4 0,980, WebM 0,973 (a taxa menor pesa no texto
  em movimento rápido do índice, 0,2 s).
- **Não verificado:** reprodução dentro da Home (componente em `src/`, fora
  desta posse); escuta humana da voz pelo Founder.
