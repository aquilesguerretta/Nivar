# Locução do filme

**Gravada em 15/11/2026** no ElevenLabs, workspace **Creator** do Founder
(conferido antes de gerar: `account_get_usage` → `tier: creator`, limite
351.736 caracteres/mês). A conta gratuita que o conector usava antes **não
foi tocada**. Nenhuma chave de API foi pedida nem usada em texto.

| Campo | Valor |
|---|---|
| Voz | **Henrique — Clear and Knowledgeable** (`3ULAAai0IVN00DTWA6vF`), pt-BR, meia-idade, ritmo medido, feita para e-learning |
| Modelo | `eleven_multilingual_v2` (sem tags de direção; pronúncia estável em pt-BR) |
| Fluxo | `wTvMfrfNCf1b6XDWHBlp` |
| Tomadas | 1 por fala, 10 falas |
| Caracteres gastos | **909** (99 + 48 + 74 + 111 + 109 + 145 + 89 + 86 + 56 + 92) |
| Arquivos | `composicao/assets/voz/01-abertura.mp3` … `10-fecho.mp3` (MP3 44,1 kHz mono, fora do repo; ver Procedência) |
| Mixagem | normalizada para −16 LUFS integrado, pico −1,5 dBTP; AAC 80 kbps no MP4, Opus 64 kbps no WebM |

**Por que essa voz.** Escolhi a candidata mais neutra da conta para conteúdo
educativo em pt-BR. A ideia inicial era casar com a voz das video-aulas do M01,
mas o coordenador corrigiu depois (15/11/2026): **as video-aulas não terão voz
sintética** — o Founder grava todas pessoalmente. A voz sintética fica, então,
só neste filme. Se o Founder preferir a própria voz também aqui, o texto
abaixo serve de roteiro de leitura; se quiser outra voz da conta, regenerar as
10 falas custa ~900 caracteres.

## Texto, tempo e fonte

Números por extenso, para a síntese não ler "141" como "um quatro um".

| # | Cena | Entra | Dura | Texto | Gen. id | Fonte |
|---|---|---|---|---|---|---|
| 01 | Abertura | 00:00,5 | 7,7 s | Alexandria. Um currículo de energia: dezessete módulos, três trilhas, cento e quarenta e uma aulas. | `RryKeg7skRFHAR1iDpUX` | descrição; contagens em `extraction/README.md` l. 72 |
| 02 | Tese (Higgsfield, cidade) | 00:08,9 | 2,4 s | Uma conta de luz não é uma cobrança por energia. | `uJtVXhfaLXVtFntutBc2` | `identidade-modulos.json`, M01 (`tese.citacao.texto`, exata) |
| 03 | Índice | 00:14,2 | 4,6 s | Cada módulo parte de uma frase. Ela abre o índice, antes de qualquer aula. | `6CNOV7bKtwOFayqeO0My` | descrição (`IndiceDeTrilhas.tsx` l. 5–6) |
| 04 | Pergunta (Higgsfield, campo) | 00:24,2 | 7,9 s | Duas usinas têm cem megawatts cada — uma solar, uma térmica. Por que elas não entregam a mesma energia num ano? | `bFkoDOQyKMGWGkPjuIJm` | `AulaM01A08.tsx` l. 367 (pergunta da aula, camada Alexandria) |
| 05 | Aula | 00:32,6 | 6,4 s | Antes de calcular, você prevê. O texto e os números vêm do material de origem, e a origem fica escrita junto. | `kYUQrM6M0HLlWlwp3f7t` | descrição + `HomeV3.tsx` l. 261 |
| 06 | Instrumento | 00:41,2 | 9,0 s | Você mexe no número. A aula responde. O instrumento faz a conta da fórmula da própria aula — e a sua previsão continua ali, ao lado do calculado. | `WDME9tVJ9BcmbKpwQx88` | `HomeV3.tsx` l. 256 e 265; `AulaM01A08.tsx` l. 504 |
| 07 | Vocabulário e fontes | 00:53,6 | 5,6 s | O glossário e a biblioteca mostram o vocabulário e as fontes — e dizem o que ainda falta. | `GkqGFb5YiK5JzPym2lpr` | descrição (`GlossarioV3.tsx` l. 207, `BibliotecaV3.tsx` l. 97–98) |
| 08 | Registro | 01:02,0 | 5,1 s | Com conta, o que você já percorreu fica guardado — em palavras, sem pontuação de jogo. | `a2raOE6thWfiWvSEAlIF` | `HomeV3.tsx` l. 269 |
| 09 | Dia seguinte | 01:11,4 | 3,0 s | No dia seguinte, a Alexandria retoma de onde você parou. | `1H8t1KMJMWhIUM9xYGuR` | descrição (`Retomada.tsx` l. 1–2) |
| 10 | Fecho | 01:20,2 | 5,2 s | Três trilhas: Fundamentos Universais, Setor Elétrico Brasileiro, Especialização Estratégica. | `nD1Uk8HHglDKEaIFs5A6` | `identidade-modulos.md` §1 |

Nenhuma fala se sobrepõe a outra. A 04 entra 3 s na cena da aula de
propósito: o plano aberto da aula mostra na tela essa mesma pergunta.

## Para trocar a voz

Regenerar as 10 falas com o novo `voice_id` (mesmo texto, mesmo modelo),
substituir os MP3 em `composicao/assets/voz/`, conferir as durações contra a
coluna "Dura" (as janelas toleram ±1 s) e re-renderizar.
