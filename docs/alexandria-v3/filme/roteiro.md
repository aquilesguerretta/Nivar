# Filme de apresentação da Alexandria — roteiro (v3: motion graphic + Higgsfield + locução)

Peça que fecha a apresentação da Alexandria na Home v3, para quem ainda não
tem conta. **89,2 s, 10 cenas, com locução (ElevenLabs, ver [`locucao.md`](locucao.md)), sem música.** Arquivos em
`public/alexandria/v3/home/filme/`; procedência em [`procedencia.md`](procedencia.md);
composição em [`composicao/`](composicao/).

**O que mudou da v1.** Ajuste de direção do Founder: o filme agora **mostra a
plataforma** — telas reais da Alexandria em movimento (o índice, uma aula, o
instrumento respondendo à régua, o vocabulário e as fontes, o registro do
percurso), com letreiros, ritmo e transições de motion design. As gravuras
viraram atmosfera: abertura, a volta do dia seguinte e o fecho. A v1 (só
gravuras) fica registrada no histórico deste arquivo e em `procedencia.md`.

**O que mudou da v2 para a v3.** Instrução do Founder: misturar no mesmo filme
os vídeos já gerados no Higgsfield e a captura real, sem descartar material.
Os dois planos que tinham saído (cidade e campo) voltam como cenas próprias —
a frase-tese do M01 antes do índice, a pergunta da Aula 08 antes da aula — e
o filme ganha locução nas dez cenas.

## Regra que o roteiro segue

Toda frase **dos letreiros** é de um destes tipos, e a coluna Fonte diz qual:

- **Fonte** — literal de `docs/alexandria-v2/extraction/` ou de um texto que
  a plataforma já publica (arquivo e linha citados).
- **Descrição** — frase neutra sobre o que a plataforma faz, conferível na
  tela que aparece ao lado. Nenhuma promessa.

O que aparece **dentro das telas** é a própria plataforma rodando no dev
server da worktree (`http://127.0.0.1:5321`), capturada quadro a quadro —
não foi redesenhado nem retocado. Onde a tela mostra uma conta, é a conta de
demonstração do harness (`tools/alexandria-capture/fixtures.mjs`, estado
`E2`), e o letreiro diz "conta de demonstração". O nome fictício da fixture
nunca entra no quadro: as capturas são cortadas abaixo do cabeçalho e da
saudação.

## Trecho aberto para o Founder

O Founder vai aparecer no filme mais adiante. **Nenhuma pessoa foi gravada
ou gerada no lugar dele.** A estrutura já reserva dois lugares:

- **Abertura (00:00–00:07,6)** — a cena `abertura` é a que ele substitui:
  `compositions/fundador.html` está pronta e só espera `assets/fundador.mp4`.
- **Fecho (depois de 01:29)** — o mesmo `fundador.html` entra como última
  cena, se ele preferir fechar.

Cada cena é uma sub-composição; encaixar a fala dele é trocar um host no
`index.html` e somar a duração dela aos `data-start` seguintes (instrução no
comentário do topo do `index.html`).

## Cenas

### 1 · Abertura — 00:00–00:07,6 · *trecho do Founder*

Gravura da sala de leitura (Kling, da v1), câmera avançando.

| Na tela | Tipo | Fonte |
|---|---|---|
| `Alexandria` · *Um currículo de energia.* | Descrição | nome do produto; `AGENTS.md` § O produto |
| `17 MÓDULOS · 3 TRILHAS · 141 AULAS · 165 INSTRUMENTOS` | Descrição (contagem) | `extraction/README.md` l. 72; `instrumentos.json → contagens.instrumentos` |

### 1b · A tese — 00:07,0–00:13,4 · *Higgsfield*

Gravura da cidade ao anoitecer (Kling 4.0, da v1): as janelas acendem.

| Na tela | Tipo | Fonte |
|---|---|---|
| `M01 · FÍSICA DE ENERGIA E ELETRICIDADE` | Fonte | `identidade-modulos.md` §1, linha 01 |
| **Uma conta de luz não é uma cobrança por energia.** | Fonte | `identidade-modulos.json`, M01 — `m01/modulo.json → tese.citacao.texto`, exata |

### 2 · O índice — 00:12,8–00:23,8

Tela real `/alexandria/trilhas` (sem conta). A câmera percorre a Trilha I
lendo as frases dos módulos M01–M05 e corre até a Trilha III.

| Na tela | Tipo | Fonte |
|---|---|---|
| `01 · O ÍNDICE` | — | rótulo de capítulo |
| **Cada módulo parte de *uma frase.*** | Descrição | o índice mostra a frase-tese de cada módulo (`src/components/alexandria/v3/IndiceDeTrilhas.tsx` l. 5–6; frases em `identidade-modulos.json`) |
| Três trilhas, dezessete módulos. A frase de cada um abre o índice, antes de qualquer aula. | Descrição | a tela ao lado |

### 2b · A pergunta — 00:23,2–00:29,2 · *Higgsfield*

Gravura do campo solar com a termelétrica ao longe (Kling 4.0, da v1): sombras de nuvem atravessam os painéis. Imagem de atmosfera, sem escala de dado.

| Na tela | Tipo | Fonte |
|---|---|---|
| `M01 · AULA 08 · CAPACIDADE INSTALADA E FATOR DE CAPACIDADE` | Fonte | `m01/aula-08.json → aula.marcador` |
| **Por que 100 MW solar ≠ 100 MW térmica?** | Fonte | `m01/aula-08.json → aula.pergunta_mapa.pergunta_texto` |

### 3 · A aula — 00:28,6–00:40,6

Tela real da Aula 08 do M01 (conta de demonstração). Plano aberto da aula →
aproxima no Ato 1 · Previsão → o campo recebe "40" → *Registrar previsão* →
"40,0 % registrado".

| Na tela | Tipo | Fonte |
|---|---|---|
| `02 · A AULA` | — | rótulo |
| **Antes de calcular, *você prevê.*** | Descrição | ato de previsão é o 1º da aula; o calculado só aparece depois do registro (`AulaM01A08.tsx` l. 334–365, 489–496) |
| Leia a aula: o texto e os números vêm do material de origem, e a origem fica escrita junto. | Fonte | `src/components/alexandria/v3/HomeV3.tsx` l. 261 (passo 01 da Home) |
| o valor 40 digitado | exemplo | é o exemplo que o próprio campo sugere ("em %, por exemplo 40", `AulaM01A08.tsx` l. 351); o letreiro diz "previsão de exemplo" |

### 4 · O instrumento — 00:40,0–00:53,2

Tela real do INST·06 depois do registro. A régua *Geração no período* é
arrastada: a caixa enche de 25,1 % a 50,0 % (a aula marca, sozinha, "meta
atingida · FCap 50,0 %" no Ato 2), desce a 16 % e volta ao cenário. A linha
tracejada "sua previsão · 40,0 %" fica no lugar o tempo todo.

| Na tela | Tipo | Fonte |
|---|---|---|
| `03 · O INSTRUMENTO` | — | rótulo |
| **Você mexe no número. *A aula responde.*** | Fonte | `HomeV3.tsx` l. 256 (título da seção "Como se estuda") |
| O instrumento da própria aula faz a conta da fórmula da aula. | Fonte | `HomeV3.tsx` l. 265, primeira frase do passo 02 |

### 5 · O vocabulário e as fontes — 00:52,6–01:01,4

Telas reais `/alexandria/glossario` e `/alexandria/biblioteca` (sem conta),
uma empurrando a outra.

| Na tela | Tipo | Fonte |
|---|---|---|
| `04 · O VOCABULÁRIO E AS FONTES` | — | rótulo |
| **Glossário e biblioteca, *com a fonte à vista.*** | Descrição | "com a fonte à vista" é da manchete da Home (`HomeV3.tsx` l. 152, hero) |
| O que ainda falta também aparece: o glossário cobre os módulos 01 a 08; a biblioteca, por enquanto, o Módulo 01. | Descrição | o que as duas telas declaram: "Os módulos 09 a 17 ainda não têm glossário aqui" (`GlossarioV3.tsx` l. 207) e "o único dos 17 módulos com bibliografia aqui até agora" (`BibliotecaV3.tsx` l. 97–98) |

### 6 · O registro — 01:00,8–01:10,4

Tela real do fim da Aula 08 já com a previsão registrada ("Registro da aula ·
percorrida · registrada · com prática · 1 de 3 atos"), depois o Início com
conta ("Seu registro · Seu percurso · 3 dias seguidos de estudo"), cortado
abaixo da saudação.

| Na tela | Tipo | Fonte |
|---|---|---|
| `05 · O REGISTRO` | — | rótulo |
| **Com conta, o que você já percorreu *fica guardado*** — em palavras, sem pontuação de jogo. | Fonte | `HomeV3.tsx` l. 269, passo 03 (frase inteira, partida em dois corpos) |
| `TELA REAL · CONTA DE DEMONSTRAÇÃO · DADOS DE EXEMPLO` | Descrição | estado `E2` das fixtures do harness |

### 7 · O dia seguinte — 01:09,8–01:19,4

Gravura da sala, da noite à manhã (Kling, da v1). Sobre ela, um cartão com a
tela real do bloco *Em leitura · M01 · Aula 08 de 09 · Continuar a aula* do
Início com conta.

| Na tela | Tipo | Fonte |
|---|---|---|
| `NO DIA SEGUINTE` | Descrição | — |
| **A Alexandria retoma de onde você parou.** | Descrição | bloco Retomada, "onde você parou" (`src/components/alexandria/comum/Retomada.tsx` l. 1–2) |

### 8 · Fecho — 01:18,8–01:29,2 · *segundo lugar possível para o Founder*

Gravura aprovada da Trilha I (salão de máquinas), as três trilhas; cartela.

| Na tela | Tipo | Fonte |
|---|---|---|
| `I Fundamentos Universais · II Setor Elétrico Brasileiro · III Especialização Estratégica` | Fonte | `identidade-modulos.md` §1; `src/lib/alexandria/indice.dados.ts` l. 13/25/39 |
| `Alexandria · 17 MÓDULOS · 3 TRILHAS · 141 AULAS · 165 INSTRUMENTOS` | Descrição | como na abertura |
| `TELAS REAIS DA PLATAFORMA · GRAVURAS GERADAS · TEXTOS DO PRÓPRIO CURRÍCULO` | Descrição | classe de cada imagem (`REGRA-DE-IMAGEM.md` §4) |

## Selos

Toda cena de gravura leva `GRAVURA GERADA` no canto. Toda cena de tela leva,
abaixo da folha, `TELA REAL` e, quando há conta, `CONTA DE DEMONSTRAÇÃO`;
acima da folha, a rota que está sendo mostrada.

## Locução

Dez falas, uma por cena, voz ElevenLabs Henrique (workspace Creator do
Founder). Texto, tempo, fonte de cada frase e ids de geração em
[`locucao.md`](locucao.md). Mesma regra dos letreiros: fonte ou descrição
neutra, nenhuma promessa.

## O que ficou de fora, de propósito

- **Trilha sonora.** Só a locução; sem música. O filme continua legível sem
  som (cada fala tem letreiro ou legenda equivalente) — a Home pode tocar mudo.
- **Atlas.** A aba está congelada por decisão do Founder.
- **Perfil.** A rota existe mas é um stub; não há o que mostrar.
- **Números que a tela do instrumento lê por faixa** ("Faixa típica de…")
  aparecem porque são a tela real — o filme não os destaca em letreiro: as
  faixas de FCap estão sob a reconciliação QA-FCap-01.
