# Sequências de rotação do globo — produção, medição e recomendação de formato

Fecha o §5 de `sistema-de-movimento.md` (produção da sequência do globo) para os **momentos 1 (chegada) e 2 (troca
de trilha)**. Tudo aqui foi renderizado, empacotado e medido; nada é estimativa, e os números vêm dos arquivos
citados em cada tabela.

- **Mídia:** `media-lab/movimento-e-conquistas/globo/`
- **Proveniência:** `media-lab/movimento-e-conquistas/globo/provenance.json`
- **Classe (bar §7):** Explicação (M4). Modelo do currículo — três ilhas inventadas, 17 estações = 17 módulos.
  Não é mapa geográfico. Nenhum texto dentro dos quadros.
- **Higgsfield:** **0 crédito gasto nesta frente**, em todas as rodadas. A justificativa está no fim (§9).

---

## 1. O que a rotação é

Não é um vídeo "de globo girando". É a **mesma cena do produto** (`A-r04/globo/globo_r04.py`, executado sem a
chamada final a `main()`, nenhum parâmetro alterado) fotografada em 48 poses de câmera entre duas vistas: mesma
esfera, mesma textura por faixa, mesma máscara, mesmo relevo, mesmo latão das estações, lente 105 mm, distância 8,0,
`FILL` 0,925, Cycles/OptiX. A composição de gravura por quadro é `compor_r04.py --mar b`, intacto.

Três decisões dão a física:

**A orientação é interpolada por slerp de quaternion**, não por lon/lat separados. O eixo de rotação é único e
constante: o globo gira como um corpo rígido, sem a "ginga" que a interpolação em coordenadas esféricas produz perto
dos polos. Os quaterniões são calculados em float de 64 bits porque `mathutils` guarda 32 bits e `acos(w)` perde
ângulos abaixo de ~0,05°.

**A luz fica em coordenadas de câmera** (`--key -0.48,0.50,0.72`, como na r04). A iluminação é idêntica em todos os
quadros, então a mesma sequência tocada **de trás para frente** continua fisicamente coerente — é assim que os
retornos (V2→V1, V3→V2, V3→V1) são servidos, sem render novo.

**A curva de inércia está embutida nos quadros**, não no playback. O perfil é o de jerk mínimo,
`s(u) = u³(10 − 15u + 6u²)`: velocidade zero nas duas pontas, `s` monotônica em [0, 1] — **sem overshoot por
construção, não por ajuste** — e simétrica (`s(1−u) = 1 − s(u)`), o que é a razão de a sequência invertida servir de
volta. O player só faz `índice = round(t / duração × (N − 1))`. Isso satisfaz S6 (movimento de chegada e
continuidade; nada de bounce, overshoot ou parallax) na própria geometria, e não na confiança do implementador.

Quadros cujas poses diferem da anterior em menos de **0,05 px no disco** reaproveitam o render anterior (acontece
nas pontas, onde a velocidade é zero). Sem isso, dois quadros visualmente idênticos teriam ruído de amostragem
diferente e a imagem cintilaria parada.

---

## 2. As seis arestas produzidas

Tamanho de exibição 866 px de dispositivo (433 CSS), render interno 2598 px com superamostragem 3×.

| Aresta | Uso | Ângulo | Quadros | Duração | Renders únicos | Tempo de render |
|---|---|---|---|---|---|---|
| V0→V1 | Momento 1 | 18,00° | 48 | 900 ms | 46 | 23 min |
| V0→V2 | Momento 1 | 8,57° | 48 | 900 ms | 44 | 30 min |
| V0→V3 | Momento 1 | 17,02° | 48 | 900 ms | 46 | 21 min |
| V1→V2 | Momentos 2 e 9 | 22,79° | 48 | 1030 ms | 46 | 21 min |
| V2→V3 | Momentos 2 e 9 | 21,14° | 48 | 950 ms | 46 | 27 min |
| V1→V3 | Momento 2 (direta) | 32,86° | 72 | 1480 ms | 68 | 46 min |

Total: **2 h 48 min** de Cycles/OptiX sob a trava de GPU. **V0** é a vista de descanso: o centroide das 17 estações,
a mesma construção de `VIEWS` da r04 com `VIEW_W = 0`, lat −3°, roll −9°. Ela não existia na r04 e foi acrescentada
por este estudo — a rotação de chegada sempre vai "do todo para o meu lugar".

Filmstrips de verificação (8 quadros cada, duas linhas: quadro limpo sobre a prancha e quadro com o overlay do
JSON) em `filmstrips/`. Pré-visualizações MP4 com e sem overlay em `previa/`. **Nenhum desses dois aprova nada** —
são folhas de conferência; o aceite de movimento é o §3 e o §6 abaixo.

---

## 3. Aceite de produção (§5.4) — medido

| # | Critério | Resultado |
|---|---|---|
| 1 | lon, lat e `s` monotônicas, terminando na pose exata | **Passa** nas 6 arestas. `s` ∈ [0, 1], sem overshoot |
| 2 | Último quadro ≡ render estático da vista (≤ ΔE00 1 no disco) | **Passa com folga**: ΔE76 médio 0,0003–0,0039; entre 1 e 9 pixels com diferença > 8/255 |
| 3 | Sem cintilação de textura entre quadros vizinhos | **Passa**: mediana da diferença no disco ≤ 0,667/255 por quadro |
| 4 | `visível` por quadro bate com o ray cast | **Passa** (o `export_json` da r04 é o mesmo que gera os estáticos) |
| 5 | Orçamento de peso medido | **Medido — e o orçamento do §5.3 não fecha com quadros.** Ver §5 |
| 6 | Nenhum texto dentro das imagens | **Passa** |
| 7 | Playback julgado no navegador, em vídeo completo | **Passa**: Playwright + Chrome do sistema, `player/gravacoes/*.json` |

Deslocamento máximo de uma estação entre quadros vizinhos: **2,63 a 6,59 px** conforme a aresta (a de 8,57° é a mais
lenta, a de 32,86° a mais rápida). Abaixo do diâmetro de um disco de estação (~21 px), então não há estroboscopia.

**O alfa é praticamente o mesmo disco em todos os quadros:** o desvio máximo contra o quadro 0 é de 9–11 níveis em
401–512 pixels do limbo, de um perímetro de ~2500 px. Esse fato, medido, é o que autoriza a recomendação do §6.

---

## 4. Os JSON de overlay

Dois por aresta, em `json/`:

- **`<aresta>.json`** (44–67 KB): por quadro, `i`, `t_ms`, `s`, `lon`, `lat`, `roll`, `quat`, o arquivo do quadro, e
  as **17 estações** e **3 territórios** com `u`, `v` (normalizados pelo centro e raio do globo, a mesma convenção de
  `GLOBOS` em `geometriaCarta.ts`), `dr`, `visivel` (ray cast) e `rotulo_ok` (`visivel` e `facing > 0,30`).
- **`<aresta>-rota.json`** (0,92–1,38 MB): os pontos do trecho por quadro.

**Recomendação de carga:** servir só o primeiro. O momento 2 diz explicitamente que *o trecho não é redesenhado
durante o giro* — o traçado entra no quadro final, que é idêntico ao render estático, onde as coordenadas da rota já
são as do estático da r04. O `-rota.json` por quadro custa mais que o próprio vídeo recomendado e só seria necessário
se algum momento futuro decidisse traçar **durante** a rotação. Fica no media-lab como insumo, fora do bundle.

Durante o giro, o único elemento que acompanha é o anel "você está aqui" da estação da trilha atual. Rótulos, eixos
de letreiro e trecho entram no quadro final.

---

## 5. Peso: o orçamento do §5.3 não fecha com quadros

O §5.3 fixou **≤ 2,5 MB por aresta a 1040 px** e **≤ 0,8 MB a 520 px**, com WebP como padrão e vídeo como exceção.
A medição diz o contrário. (MB aqui é decimal, 10⁶ bytes; nenhuma conclusão deste documento muda se forem MiB — as
margens são grandes nos dois sentidos, e o único caso apertado está no §7-bis, medido em bytes.)

Aresta de referência **V1→V2**, 48 quadros (`medicoes/V1-V2-D800-escada.json`, `-linhas.json`, `-520.json`):

| Formato | 866 px | 520 px | Alfa | Cabe a 520? |
|---|---|---|---|---|
| Quadros WebP q90 | 8,41 MB | 3,30 MB | exato | **não** (4,1×) |
| Quadros WebP q80 | 5,37 MB | 2,25 MB | exato | **não** (2,8×) |
| Quadros WebP q70 | 4,34 MB | 1,82 MB | exato | **não** (2,3×) |
| Folha de sprites WebP 8×6 | 8,32 MB | — | exato | não |
| Quadros AVIF q50 | 2,93 MB | — | erro 0,11/255 | não |
| **AVIF animado crf24** | **1,09 MB** | **0,45 MB** | no codec, erro 0,013/255 | sim |
| AVIF animado crf30 | 0,65 MB | 0,28 MB | erro 0,017/255 | sim |
| VP9 com alfa crf24 (WebM) | 1,78 MB | 0,70 MB | no codec | sim, **sem alfa no Safari** |
| **H.264 opaco crf16 `tune=animation`** | **1,72 MB** | **0,69 MB** | disco fixo em CSS | sim |
| H.264 opaco crf20 | 0,98 MB | 0,41 MB | disco fixo em CSS | sim |
| H.264 opaco crf26 | 0,40 MB | — | disco fixo em CSS | sim |
| AV1 opaco crf24 | 1,46 MB | — | disco fixo em CSS | sim |
| H.264 com alfa empilhado crf20 | 0,71 MB | — | metade inferior = alfa | sim |

**Achado.** Nenhuma variante de *quadros* cabe no orçamento, em nenhum dos dois tamanhos. A textura de buril é
ruído de alta frequência: é exatamente o que o intra-frame não comprime e o inter-frame sim, porque entre dois
quadros vizinhos a gravura é quase a mesma imagem deslocada. A folha de sprites não ajuda (8,32 MB, praticamente o
mesmo dos arquivos soltos) e ainda custa 144 MB de memória decodificada a 866 px. **O §5.3 precisa ser corrigido:
codec temporal, não quadros.**

(Os números de 520 px vêm dos mestres de 866 px reduzidos por LANCZOS — `medir_520.py`. É um **limite superior** do
peso, porque a redução preserva mais alta frequência que um render nativo a 520. Um render nativo a 520 ainda não
foi feito.)

---

## 6. A métrica que decide: retenção das linhas do mar

PSNR e ΔE76 globais **mentem** aqui. Os dois ficam acima de 34 dB em codecs que já apagaram o buril, porque a
métrica média é dominada pela área grande e lisa. O que define o material do Alexandria é a **pauta clara do mar**
— linhas horizontais finas sobre o navy — e é ela que o 4:2:0 em taxa baixa borra primeiro, na sombra, onde as
linhas afinam.

`escada_linhas.py` mede a **retenção**: correlação normalizada entre a diferença vertical do quadro decodificado e a
do mestre, dentro da máscara do mar (fechada para conter as próprias linhas, erodida 9 px para não pegar a costa nem
o limbo). 1,000 = pauta intacta; borrar e ruído derrubam. Mede também o **salto na troca** para o estático ao fim da
rotação, em ΔE76 no disco, com e sem borrão de 1 px (o olho não resolve dithering de 1 px; a coluna σ1px é a que
importa).

| Formato | Peso | Retenção mar | Retenção **na sombra** | Salto na troca (σ1px) |
|---|---|---|---|---|
| Quadros WebP q90 (referência) | 8,41 MB | 0,998 | 0,954 | 1,59 |
| H.264 crf13 `tune=animation` | 2,52 MB | 0,998 | 0,963 | 1,70 |
| **H.264 crf16 `tune=animation`** | **1,72 MB** | **0,997** | **0,942** | **1,91** |
| AV1 crf24 | 1,46 MB | 0,998 | 0,956 | 1,84 |
| VP9 alfa crf24 | 1,78 MB | 0,998 | 0,955 | 1,82 |
| **AVIF animado crf24** | **1,09 MB** | **0,998** | **0,949** | **1,96** |
| AVIF animado crf30 | 0,65 MB | 0,996 | 0,925 | 2,15 |
| AV1 crf34 | 0,65 MB | 0,996 | 0,912 | 2,14 |
| H.264 crf20 | 0,98 MB | 0,995 | 0,900 | 2,26 |
| H.264 crf26 | 0,40 MB | 0,988 | **0,782** | 2,79 |

`tune=grain` retém mais (0,974 a crf13) mas custa 58% a mais de peso pelo mesmo ganho que subir um degrau de crf com
`tune=animation`. Não compensa.

**Corte:** retenção na sombra **≥ 0,94**. Abaixo disso o mar começa a chapar num recorte a 4× (comparação em
`medicoes/comparacao-mar-4x-V1-V2-D800-q47.png`). Isso elimina H.264 crf20 e crf26, AV1 crf34 e AVIF crf30 — e
elimina de vez a ideia de "usar o crf mais barato porque o PSNR está bom".

---

## 7. Recomendação de formato

### Primário — **MP4 H.264 opaco, crf 16, `tune=animation`, `yuv420p`, com o alfa por `clip-path` circular em CSS**

- **1,72 MB a 866 px e 0,69 MB a 520 px.** Cabe nos dois orçamentos.
- **O alfa sai de graça e exato.** O globo ocupa o mesmo disco em todos os quadros (§3: desvio ≤ 11/255 em ≤ 512 px
  do limbo). `clip-path: circle(r at cx cy)` com o `globo.r` do JSON reproduz esse disco, antialiasado pelo
  compositor, sem codec de alfa e sem a metade extra do empilhamento. O fundo do vídeo é preenchido pela cor do
  pixel válido mais próximo (transformada de distância), então não há sangria de cor no limbo.
- **Safari toca, inclusive iOS.** É o único formato desta lista sem ressalva de plataforma.
- **É o único que dá controle de quadro**, e o controle é o que os momentos 1 e 2 exigem: `preload`, tocar no
  gatilho, `pause()`, `currentTime = duração` para ir direto ao fim, e `requestVideoFrameCallback` (Safari 15.4+,
  Chrome 83+, Firefox 132+; fallback em rAF) para mover o anel "você está aqui" **no quadro certo**, não por
  relógio aberto. Foi medido: `player/player.html` pista B, 93–94 callbacks para 48 quadros, índice monotônico na
  ida e na volta, terminando no quadro final nas 6 arestas.
- **Retornos** com um arquivo reverso pré-codificado (`-reverso.mp4`, +0 a 25% de peso). Safari não toca
  `playbackRate` negativo — por isso o arquivo, e não o truque.

### Alternativa mais leve — **AVIF animado com alfa, crf 24** (1,09 MB / 0,45 MB)

Mais leve, alfa verdadeiro no codec, retenção na sombra ligeiramente melhor que a do H.264 crf16 (0,949 × 0,942), e
o Safari 16.4 declara animação AVIF plenamente suportada. Foi tocado e medido no Chrome: monotônico em pose, toca
**uma vez** e para no quadro final (`player/gravacoes/*-avif-crf30.json`).

**Mas é um `<img>`.** Não dá para começar no gatilho, pausar, segurar o quadro 0, pular para o fim, nem saber em que
quadro está. Isso derruba quatro regras já escritas: o "se o estudo demorar mais de 1200 ms, mostre parado" do
momento 1; o portão de IntersectionObserver a 390; a segunda ativação em menos de 2 s virando `corte` (M6); e o
movimento reduzido, que tem de chegar ao **mesmo estado** sem passar pelas poses. Serve onde nada disso vale — por
exemplo uma vitrine sem overlay — e não como o formato dos momentos 1 e 2.

### Rejeitados, com motivo

- **Quadros WebP/AVIF + canvas:** o caminho mais controlável e o de melhor fidelidade, mas 4,3 a 8,4 MB por aresta e
  144 MB de memória decodificada. Fora do orçamento por 2,3× a 4,1×. Continua sendo a **referência de qualidade** das
  tabelas e a fonte dos filmstrips.
- **VP9 com alfa (WebM):** boa fidelidade e peso aceitável, **mas Safari não suporta o canal alfa** — o globo sairia
  num retângulo preto ou branco no navegador de metade dos usuários. Alfa em vídeo nas plataformas Apple é HEVC com
  alfa (`hvc1`), que este build de ffmpeg não produz: exigiria um mac com `hevc_videotoolbox -alpha_quality`. Não
  vale manter dois pipelines de alfa quando o `clip-path` resolve.
- **AV1:** empata em qualidade e ganha em peso, mas o suporte no Safari depende de hardware. Cabe como `<source>`
  extra depois, não como base.
- **H.264 com alfa empilhado:** 0,71 MB, mas exige canvas para recompor as duas metades — ou seja, paga o custo do
  vídeo e o do canvas, para resolver um alfa que é um círculo fixo.

### Degraus de entrega

1. `<video>` H.264 crf16 + `clip-path`, com rVFC movendo o anel. Reverso pré-codificado.
2. Sem suporte, gatilho tarde demais, ou `prefers-reduced-motion: reduce`: a **imagem estática da vista final**,
   direto, com corte de opacidade de 150 ms. Mesmo estado final, como manda o S6.

---

## 7-bis. O conjunto de entrega existe

`entregar.py` produziu as 6 arestas nos 2 tamanhos, ida e volta — **24 arquivos** em
`media-lab/movimento-e-conquistas/globo/entrega/`, com `manifesto.json` e uma cópia do `overlay.json` por aresta. O
reverso é codificado **a partir dos mestres na ordem inversa**, não do MP4 já codificado, para não empilhar perda de
geração (conferido: o último quadro do reverso bate com o q00 do mestre a 5,0/255 de diferença média no disco — o
erro do codec — contra 41,8 no quadro oposto, então a ordem está certa).

| Aresta | 866 px | 866 reverso | 520 px | 520 reverso |
|---|---|---|---|---|
| V0→V1 | 1,57 MB | 1,58 MB | 0,63 MB | 0,63 MB |
| V0→V2 | 1,37 MB | 1,35 MB | 0,54 MB | 0,54 MB |
| V0→V3 | 1,55 MB | 1,55 MB | 0,62 MB | 0,62 MB |
| V1→V2 | 1,72 MB | 1,71 MB | 0,69 MB | 0,69 MB |
| V2→V3 | 1,58 MB | 1,59 MB | 0,64 MB | 0,64 MB |
| V1→V3 | 2,23 MB | 2,21 MB | 0,79 MB | 0,78 MB |

**As 24 cabem nos dois orçamentos do §5.3** — o de quadros não cabia em nenhum. Cada arquivo tem a contagem de
quadros e a duração exatas (conferido por `ffprobe`: 48 quadros/1,030 s, 72/1,480 s, etc.).

### A aresta longa: baixar a taxa, não a qualidade

V1→V3 a 520 px foi a única que estourou — 883 KB contra 839 KB, 5% acima — com os 72 quadros a crf 16. O reflexo
seria subir o crf, e ele **custa material**: crf 17 cabe (778 KB) mas derruba a retenção na sombra de 0,942 para
0,932, abaixo do corte do §6.

A saída foi outra: **48 quadros em vez de 72**, escolhidos por tempo (`round(j × 71/47)`). Como a curva está
embutida nos quadros e os quadros são uniformes no tempo, a subamostragem uniforme no tempo devolve uma sequência
igualmente uniforme, com a mesma curva, as mesmas pontas e `s` de 0 a 1 monotônico. Resultado medido
(`medicoes/V1-V3-D800-520-48quadros.json`):

| V1→V3 a 520 px | Peso | Retenção na sombra | Deslocamento máx./quadro |
|---|---|---|---|
| 72 quadros, crf 16 | 883 KB (estoura) | 0,942 | 5,2 px |
| 72 quadros, crf 17 | 778 KB | **0,932** (abaixo do corte) | 5,2 px |
| **48 quadros, crf 16** | **787 KB** | **0,951** | 7,9 px |

A opção de 48 quadros é **mais leve e de melhor material** que a de crf 17, e a 32,4 quadros por segundo o
deslocamento máximo de uma estação (7,9 px) continua abaixo do diâmetro do disco da estação (12,8 px) — sem
estroboscopia. O princípio que fica: **quando o peso aperta, a primeira coisa a ceder é a taxa de quadros, não o
buril.** Ver F-G9 em `features-propostas.md`.

---

## 8. O que não foi verificado aqui

Dito para não ser lido como verificado:

- **Nenhum Safari foi tocado.** Esta máquina é Windows; a verificação de playback é do Chrome do sistema via
  Playwright. O suporte do Safari acima é documentação (WebKit 16.4 para AVIF animado, caniuse para rVFC), não
  medição. **Antes de ir para produção, as duas pistas do `player.html` precisam rodar num Safari real — macOS e
  iOS — e a gravação entrar em `player/gravacoes/`.**
- **Render nativo a 520 px não foi feito.** Os pesos de 520 são de mestres reduzidos (limite superior).
- Uma linha da escada de V0→V1 (AVIF crf38) ficou com decodificação parcial e sem pontuação. crf38 está muito abaixo
  do corte de retenção e não entra em nenhuma recomendação; a linha fica registrada como falha, não removida.
- Os momentos 1 e 2 **inteiros** (texto, rótulos, traçado do trecho, anel, chamada) não foram montados. Isto aqui é
  a camada do globo. O aceite de coreografia dos momentos continua pendente.

## 9. Higgsfield

**0 crédito gasto nesta frente.** Saldo consultado em 2026-09-20: 963,06 (plano ultra). A queda desde 1262,06 em
17/09 é de outras frentes (medalhas e variantes), não desta.

O catálogo foi consultado (`models_explore`, recomendação para vídeo com imagem de entrada: `wan3_0`,
`wan3_0_prime`, `grok_video_v15`, `seedance_2_5`, `minimax_h3_max`) e recusado com motivo: modelos de vídeo com
quadro inicial e final **interpolam pixels, não geometria**. Não garantem a pose exata por quadro (aceite §5.4-1),
não devolvem as coordenadas das estações por quadro (sem overlay), não entregam alfa, têm duração mínima de 2 a 5 s
contra os 900–1480 ms dos tokens, e o último quadro não sai igual ao render estático (§5.4-2). A tarefa pede a
**mesma** câmera, luz e material do produto — só a cena r04 no Blender cumpre. Nenhuma imagem gerada entra nestas
sequências.

---

## 10. Reproduzir

```
# render de uma aresta (sempre com a trava de GPU)
python .../media-lab/_ferramentas/gpu_lock.py -- "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" \
  -b --factory-startup -P globo_seq.py -- --de V1 --para V2 --quadros 48 --size 800

python empacotar.py V1-V2-D800        # quadros WebP, JSON, filmstrip, MP4 de prévia, formatos, medições
python formatos_extra.py V1-V2-D800   # escada WebP/AVIF e AVIF animado
python escada_linhas.py V1-V2-D800    # retenção das linhas do mar e salto na troca
python medir_520.py V1-V2-D800        # orçamento na aresta de 520 px
node player/gravar.cjs V1-V2-D800     # playback no Chrome do sistema (ida e volta)
python resumo.py                      # tabela de tudo
```
