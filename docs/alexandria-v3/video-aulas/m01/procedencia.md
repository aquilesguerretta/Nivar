# Vídeo-aulas de abertura do M01 — procedência

> **STATUS (15/11/2026) — aprovadas pelo Founder em 15/11/2026 e publicadas nas aulas.** As nove
> vídeo-aulas descritas abaixo estão ligadas em `src/lib/alexandria/videos.ts` (commit 8ec77e0 da
> sessão coordenadora) e os 36 arquivos de `public/alexandria/v3/aulas/m01/video/` estão no git. Se
> o Founder gravar uma versão própria de alguma aula, ela entra no lugar com o mesmo nome de
> arquivo; os roteiros `aula-0N.md` servem de apoio para essa gravação.

Produzidas em 14–15/11/2026. Uma vídeo-aula por aula do Módulo 01 (nove), cada uma com a
pergunta da aula, o mecanismo central e um exemplo numérico da própria aula.

- Roteiros, com a origem de cada frase: [`aula-01.md`](aula-01.md) … [`aula-09.md`](aula-09.md)
- Saída: `public/alexandria/v3/aulas/m01/video/aula-0N.{mp4,webm}`, `aula-0N-poster.webp`, `aula-0N.pt-BR.vtt`
- Contrato no front: `src/lib/alexandria/videos.ts` → `videoDaAula('modulo-01', n)`
- Fonte única de texto e cena: [`composicao/roteiros.mjs`](composicao/roteiros.mjs)

## Como foi feito

| Etapa | Ferramenta | Arquivo |
|---|---|---|
| Roteiro (fala, legenda, fonte por frase) | à mão, só recortes da aula | `composicao/roteiros.mjs` |
| Conferência de fonte | `composicao/verificar.mjs` (acha cada trecho no arquivo citado; mede o que sobra da legenda fora dos trechos; confere cada letreiro de cena; barra os termos das pendências) | — |
| Narração | ElevenLabs `eleven_v4` (conta do Founder, plano Creator), um take por aula | — |
| Tempo por palavra | transcrição local da narração, Parakeet (`parakeet-tdt-0.6b-v3`, via `hyperframes transcribe -e parakeet -l pt`) | — |
| Alinhamento e legendas | `composicao/gerar.mjs` (alinhamento por programação dinâmica fala × transcrição; legenda na notação da aula) | `aula-0N.pt-BR.vtt` |
| Imagem e movimento | HyperFrames 0.9.52 (HTML + GSAP 3.14.2), composição gerada por `composicao/gerar.mjs` | — |
| Render | `hyperframes render -f 30 -q looks` (master 1920×1080, 30 fps) | fora do repositório |
| Entrega | `composicao/encode.sh` (ffmpeg 9.0.1) | `aula-0N.mp4`, `.webm`, `-poster.webp` |
| Roteiros `.md` | `composicao/documentar.mjs` (tempos medidos + origem resolvida por linha) | `aula-0N.md` |

Para refazer tudo: `verificar.mjs` → narração (texto = `fala` dos blocos, separados por linha
em branco) → transcrição → `gerar.mjs <pasta>` → `hyperframes render` em cada
`<pasta>/build/aula-0N` → `encode.sh <pasta> 1 … 9` → `documentar.mjs <pasta>`.

## Narração

**Voz:** ElevenLabs, biblioteca de vozes, **"Henrique – Clear and Knowledgeable"**
(`voice_id` `3ULAAai0IVN00DTWA6vF`) — voz masculina brasileira, dicção articulada, ritmo
medido, descrita para e-learning. **A mesma nas nove aulas.** Modelo `eleven_v4`, configuração
padrão (sem tags de direção).

Escolha: o pedido original era a voz do Higgsfield. Testei seis presets do Higgsfield
(`elevenlabs_v4` com Andre, Livia, Ines, Marcus, Julian, Elena; `seed_audio` com Andre) — todos são
vozes genéricas multilíngues, nenhuma nativa do português do Brasil. O Founder indicou a conta
dele no ElevenLabs (plano Creator, licença comercial), que tem vozes nativas pt-BR na biblioteca.
Testei quatro com a mesma frase da Aula 08 (Henrique, Edmilson, Luciana Cadar, Davi Menegon) e
fiquei com Henrique pela descrição (calma, articulada, para curso) e pelo ritmo medido
(15,6 caracteres/s). **Não ouvi as vozes** — a escolha não foi feita de ouvido. Trocar a voz é
trocar um `voice_id` e refazer a cadeia acima.

**Prompt:** o texto do campo `fala` dos blocos de cada aula, em ordem, separados por linha em
branco — sem nenhuma instrução adicional. A `fala` é a frase da aula com números e siglas por
extenso ("60 Hz" → "sessenta hertz", "FP" → "fator de potência"), para a voz pronunciar.

| Aula | flow_id | session_id | generation_id | Duração | Créditos |
|---|---|---|---|---|---|
| 01 | `CUpNxpg8EqyRp1OMg9Rl` | `SBydNxOZF89dXljc02Em` | `AuTmiYTaKkoFDB4NApHO` | 87,60 s | 1.266,87 |
| 02 | `PzkYFxPaqKYwMwUewPC4` | `q8nfRNx7B6H3hDvdLn3w` | `RbiVxlMC9PD9wCBlcJbr` | 93,36 s | 1.428,86 |
| 03 | `7UhJ4g6Yi9aaEwGxqj9y` | `XwHrA05eGFz65P5oYaUg` | `paHMtPhuc97quT6IITuA` | 79,12 s | 1.233,88 |
| 04 | `gHwcd5yuhUKgGO8rFPaA` | `rIOOOnQPBmGrC7o9kELd` | `C7p2RjRpEYYlts1BGedl` | 84,80 s | 1.332,87 |
| 05 | `bsQ73BZC4dRNiBeloerl` | `wP0bOxOqz7BCtFMRtzrh` | `5c9RcZmxf8D5zkcsdPfY` | 84,00 s | 1.318,87 |
| 06 | `HSeDjw4PqdcBYbAa2Lvz` | `puh09kmdgKxPmqQOSoyN` | `yoTqWRL3jLiYolyHNba8` | 60,24 s | 914,91 |
| 07 | `IKIxP5eUJh95rjxCums6` | `VJ2vvIrcrj4DZDRGfMUs` | `jsIUbTWXQ5ydqoDeep0C` | 96,16 s | 1.507,85 |
| 08 | `UOkLsVVprqL54AhqrfMN` | `L4xEiKj39tEjrEnSnWMH` | `woRnTt69MYQA9r7JRzgz` | 72,32 s | 1.118,89 |
| 09 | `EKscIVjeTB8AlUm3PFqf` | `k6tBr7p1ka0U8Y6dPacv` | `WyTykIhCSzk5N0DBi8IQ` | 71,44 s | 1.090,89 |

Arquivo devolvido: MP3 44,1 kHz, 128 kb/s. Na entrega o áudio é normalizado a −16 LUFS
(`loudnorm`), mono.

**Inteligibilidade, medida:** a transcrição local devolveu o texto do roteiro em todas as
aulas; a taxa de casamento palavra a palavra (86–98 %) só fica abaixo de 100 % porque a
transcrição escreve unidades como símbolo ("kWh" onde a voz disse "quilowatts-hora"). As
palavras "MW." de 1,2–1,3 s na A08 são "megawatts-hora" (a palavra "MWh" do mesmo trecho dura
1,1 s). **A conferir de ouvido:** A02, por volta de 01:12, "que é o padrão da rede pública" — a
transcrição registrou "padrão rede público", sem tempo para o "da"; e A02, ~00:49, "quilowatts"
na cadeia (a transcrição pulou a palavra, mas há 0,7 s de fala no lugar).

## Créditos gastos

| Item | Onde | Créditos |
|---|---|---|
| Teste de vozes, 6 presets + 1 `seed_audio` | Higgsfield (saldo 567,19 → 562,05) | 5,14 |
| Teste de 4 vozes pt-BR, 244 caracteres cada | ElevenLabs | 975,90 |
| Narração das nove aulas | ElevenLabs | 11.213,88 |
| **Total ElevenLabs** | | **12.189,78** (≈ US$ 2,22 pelo preço de API informado) |
| Transcrição, render, encode | local | 0 |

Nenhuma imagem ou vídeo foi gerado: o pedido permitia planos de apoio gerados, mas a regra de
imagem resolve tudo o que os vídeos mostram com foto real (regra 1) ou diagrama (regra 3). A
diferença de saldo do Higgsfield pode incluir gasto da sessão do filme da Home, que usa a mesma
conta em paralelo; os 7 testes daqui custam 0,46 cada no `elevenlabs_v4` (2,76) mais o `seed_audio`.

## Imagem

Três classes, como manda `docs/alexandria-v3/REGRA-DE-IMAGEM.md`:

- **Foto real** (regra 1): 15 fotos do acervo `public/alexandria/v3/aulas/m01/` (Wikimedia
  Commons, procedência em `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas
  do M01"). Cada foto entra com legenda e crédito na tela (autor · Wikimedia Commons · licença),
  e a cartela final repete os créditos. As legendas respeitam a coluna "o que a legenda não pode
  afirmar": o medidor é alemão (50 Hz), o transformador é australiano, o apagão é de Madri, a
  linha de Foz do Iguaçu não tem tensão afirmada, o forno é "forno elétrico" (não "a arco"),
  Edison é c. 1922. O forno usa o arquivo recortado `-918` (sem a borda do filme), que a sessão de
  imagens publicou durante este trabalho.
- **Diagrama** (regra 3): eixos com rótulo e unidade, escala declarada, linha "FONTE ·" embaixo,
  sem hachura, sem semáforo (tinta, ouro e óxido só como identidade). Seguem as especificações
  D-A01-2, D-A02-1, D-A02-2, D-A03-1, D-A03-2, D-A04-1, D-A05-1, D-A05-3, D-A07-1, D-A07-2,
  D-A08-1, D-A09-1 de `docs/alexandria-v3/figuras-m01.md`. Não foi desenhado nada que lá está
  "espera dado" ou "espera decisão do Founder" (D-A05-2, D-A06-2, D-A08-2, D-A08-3, D-A09-2; de
  D-A07-3 só a régua 0,92, sem a barra empilhada).
- **Tipografia de letreiro**: Newsreader (títulos e frases), Instrument Sans (apoio), IBM Plex
  Mono (dado, rótulo e fonte), em pergaminho `#F2ECDF` e tinta `#15213B`, ouro `#A8843A` contido,
  óxido `#9A3B22` só nos termos da pergunta e no número-resposta. Raio zero, sem sombra.

**Não usei**, por estarem no diretório mas ainda sem linha de procedência quando o trabalho
fechou: `m01v3-a02-pilha-volta`, `m01v3-a03-anel-faraday`, `m01v3-a03-frequencimetro`,
`m01v3-a07-banco-capacitores`.

## Ponto de entrada do Founder

Cada vídeo abre com uma cartela muda de 4,5 s (módulo, número e título da aula). Ela é a cena
`s0` da composição; para pôr a fala gravada do Founder, troca-se `s0` pela gravação e aumenta-se
`T0` em `gerar.mjs` para a duração da fala — narração, cenas e legendas são recalculadas juntas.
Nenhuma pessoa foi gerada.

## O que ficou de fora, de propósito

- **QA-M01-A06** (Grupo A "≥ 2,3 kV" × subgrupo AS "< 2,3 kV"): a A06 fala de Grupo A e B pela
  estrutura tarifária e do exemplo A1 (230 kV) × A4 (13,8 kV); nenhum limite de tensão de grupo.
- **QA-M01-A07** ("os outros 15% são reativos"): a A07 usa o triângulo do INST·05 (800 / 480 /
  933 / 0,86) e o Ex · 05 (900 kW ÷ 1.000 kVA = 0,90 < 0,92); a frase de 7.3 não entra.
- **QA-FCap-01** (faixas de fator de capacidade por fonte): a A08 usa só o exemplo de 8.2
  (100 MW, 876.000 MWh, 220.000 MWh, 25,1 %); as faixas e a leitura do INST·06 não entram.
- **QA-M01-A04**: a palavra "exponencial" não aparece em nenhuma aula.
- **Música**: nenhuma. Não há trilha licenciada na casa; a narração basta.

## Entrega, medida nos arquivos

Todos: 1920×1080, 30 fps. MP4 = H.264 High + AAC mono 48 kHz (−16 LUFS), faststart. WebM = VP9 + Opus.
Pôster = quadro da cartela de abertura em 3,9 s, WebP 1920×1080.

| Aula | Duração | MP4 | WebM | Pôster | Legendas |
|---|---|---|---|---|---|
| 01 | 97,9 s | 5,54 MB | 4,42 MB | 29 KB | 19 deixas |
| 02 | 103,6 s | 7,71 MB | 6,30 MB | 28 KB | 20 deixas |
| 03 | 89,4 s | 8,29 MB | 5,72 MB | 35 KB | 16 deixas |
| 04 | 95,0 s | 8,23 MB | 5,57 MB | 45 KB | 20 deixas |
| 05 | 94,3 s | 6,87 MB | 4,80 MB | 35 KB | 18 deixas |
| 06 | 70,5 s | 5,01 MB | 3,66 MB | 37 KB | 15 deixas |
| 07 | 106,4 s | 7,94 MB | 5,11 MB | 36 KB | 20 deixas |
| 08 | 82,6 s | 9,19 MB | 9,05 MB | 29 KB | 15 deixas |
| 09 | 81,8 s | 8,01 MB | 7,06 MB | 33 KB | 15 deixas |

Total 118,8 MB. Nenhum MP4 passa de 9,2 MB (teto pedido: 15 MB).

## Verificação feita

- `verificar.mjs`: todas as citações acham o trecho, literal, no arquivo citado; sobra de
  legenda fora dos trechos só em dois recortes ("de… a", A02; "e", A09); todos os letreiros de
  cena são recortes literais da aula; nenhum termo das pendências.
- Cada vídeo foi assistido no arquivo entregue (não no master), um quadro a cada 1,5 s
  (≈ 550 quadros por passada nas nove; as aulas corrigidas foram assistidas de novo). Defeitos achados assim e corrigidos antes da entrega: barras que
  cresciam do lado errado (A01, A05, A08), notas sobrepostas (A01), escada de tensões sem as
  descrições da tabela (A02), triângulo pequeno e encostado na fonte (A02, A07), marcador 0,25
  cruzando o rótulo (A05), tela vazia de 10 s durante "efeito Joule" (A04), painel vazio antes do
  texto nas fotos cheias (A08), triângulo só 5 s na tela (A07), e paráfrases minhas em letreiros
  (A01, A03, A04, A05, A06, A07, A08, A09) trocadas por recortes literais.
- Legendas: nenhuma sobreposição, nenhuma deixa abaixo de 1 s, leitura máxima 21 car/s.
- `npx tsc -b`: 0 erros com `videos.ts` preenchido.
- **Não verificado:** a voz não foi ouvida por ninguém; nada foi testado dentro da página da
  aula (o modelo de aula é de outra sessão).

## O que eu mudaria

1. **Ouvir antes de publicar.** A escolha da voz foi pela descrição e pela transcrição, não de
   ouvido. Dois trechos da A02 estão marcados acima para conferência.
2. **Frequencímetro na A03.** O acervo ganhou `m01v3-a03-frequencimetro` durante o trabalho; é a
   foto certa para "60 Hz" e entra assim que tiver linha de procedência.
3. **Curva de carga na A05** (D-A05-2) e **FCs por fonte na A08** (D-A08-2): são os diagramas
   mais fortes de cada aula e esperam dado / decisão (QA-FCap-01).
4. **A06 é a mais curta (70 s)** porque o limite de 2,3 kV ficou de fora; resolvido o QA-M01-A06,
   a escada de subgrupos (D-A06-1) entra e a aula fica no ritmo das outras.
5. **Fala do Founder:** gravada, entra no lugar da cartela muda (`T0`); a narração sintética pode
   continuar para o corpo ou ser regravada na voz dele com o mesmo texto de `fala`.
