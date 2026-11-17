# M01 · Aula 01 — vídeo-aula de abertura

**Energia é volume. Potência é velocidade.** · Energia × Potência
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[0].title / subtitle, L342.

| | |
|---|---|
| Duração | 97.8 s (abertura muda 4.5 s + narração 87.7 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-01.{mp4,webm}`, `aula-01-poster.webp`, `aula-01.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 19 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 88 % das palavras da fala casadas |
| Procedência | [`procedencia.md`](procedencia.md) |

## Regra seguida

Toda frase narrada vem da aula — literal, ou recorte: trechos literais juntados, com corte marcado
por "[…]" na legenda e as palavras de ligação ("de… a…", "e") listadas no bloco.
Na **fala**, números e siglas vão por extenso para a voz pronunciar ("60 Hz" → "sessenta hertz");
a **legenda** mantém a notação da aula. A coluna *Origem* dá arquivo, campo e linha; o
verificador `composicao/verificar.mjs` acha cada trecho, literal, no arquivo citado.

Ficam de fora em todas as aulas: QA-M01-A06 (limite de 2,3 kV do Grupo A), QA-M01-A07
("os outros 15% são reativos"), QA-FCap-01 (faixas de fator de capacidade por fonte) e a
palavra "exponencial" (QA-M01-A04).

## 00:00 · Abertura — ponto de entrada do Founder

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 01* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> Por que kW e kWh não são a mesma coisa?

Fala: *Por que quilowatt e quilowatt-hora não são a mesma coisa?*

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-01.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1339 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:08.9 · m1 · Fonte (literal)

> Potência é a velocidade com que energia é usada, gerada ou transformada. Energia responde "quanto foi usado no total?". Potência responde "com que ritmo está sendo usado agora?".

Fala: *Potência é a velocidade com que energia é usada, gerada ou transformada. Energia responde: quanto foi usado no total? Potência responde: com que ritmo está sendo usado agora?*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-01'] · 1.2, parágrafo 1 | L182 |

Imagem: Duas colunas: POTÊNCIA · kW e ENERGIA · kWh, com as perguntas da aula.

### 00:21.1 · m2 · Fonte (literal)

> Uma torneira muito forte por dois minutos enche pouco volume — alta potência, baixa energia. Uma torneira fraca aberta por oito horas enche bastante volume — baixa potência, alta energia. Volume e velocidade não são a mesma grandeza.

Fala: *Uma torneira muito forte por dois minutos enche pouco volume: alta potência, baixa energia. Uma torneira fraca aberta por oito horas enche bastante volume: baixa potência, alta energia. Volume e velocidade não são a mesma grandeza.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-01'] · 1.2, parágrafo 3 | L185 |

Imagem: Tabela 1.2 (duas primeiras linhas: vazão ↔ potência, volume ↔ energia). A linha "diâmetro ↔ corrente" fica de fora (DIV-01 da A01). Linha de fonte na tela: "FONTE · M01 · Aula 01 · tabela 1.2 (duas primeiras linhas)".

### 00:38.1 · m3 · Fonte (literal)

> Energia = Potência × Tempo. Um motor de 10 kW ligado por 5 horas consome 50 kWh.

Fala: *Energia é igual a potência vezes tempo. Um motor de dez quilowatts ligado por cinco horas consome cinquenta quilowatts-hora.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-01'] · 1.4, fórmula | L189 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-01'] · 1.4, parágrafo | L190 |

Imagem: Fórmula da aula em destaque, com o texto de apoio. Linha de fonte na tela: "FONTE · M01 · Aula 01 · 1.4 · INST·01, cenário inicial (saída do script: 50)".

### 00:44.7 · e1 · Fonte (literal)

> Experimente comparar dois cenários: 50 kW × 1 h e 1 kW × 50 h. Mesmo kWh, perfis completamente diferentes. A primeira instalação exige rede para 50 kW de pico. A segunda, para 1 kW.

Fala: *Experimente comparar dois cenários: cinquenta quilowatts vezes uma hora, e um quilowatt vezes cinquenta horas. Mesmo quilowatt-hora, perfis completamente diferentes. A primeira instalação exige rede para cinquenta quilowatts de pico. A segunda, para um quilowatt.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | INSTRUMENTOS_MODULO_01 · inst-01 · note | L53 |

Imagem: Diagrama D-A01-2: 50 kW × 1 h e 1 kW × 50 h na MESMA escala (0–50 h × 0–50 kW); área = 50 kWh nos dois.

### 01:02.4 · e2 · Fonte (literal)

> O kWh igual mascara que são problemas de engenharia opostos.

Fala: *O quilowatt-hora igual mascara que são problemas de engenharia opostos.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | INSTRUMENTOS_MODULO_01 · inst-01 · note | L53 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 01:08.5 · x1 · Fonte (literal)

> "Essa usina gerou 100 MW no mês." Errado. MW mede potência, não energia. O correto é: "a usina tem capacidade de 100 MW" ou "a usina gerou 30.000 MWh no mês".

Fala: *Essa usina gerou cem megawatts no mês. Errado. Megawatt mede potência, não energia. O correto é: a usina tem capacidade de cem megawatts, ou: a usina gerou trinta mil megawatts-hora no mês.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-01'] · 1.5, nota | L192 |

Imagem: Frase errada riscada em óxido; as duas formas corretas abaixo. Linha de fonte na tela: "FONTE · M01 · Aula 01 · 1.5, erro de fluência".

### 01:23.1 · f · Fonte (literal)

> kW mede a potência instantânea que a operação exige da rede neste momento. kWh mede o consumo acumulado que aparece na fatura.

Fala: *Quilowatt mede a potência instantânea que a operação exige da rede neste momento. Quilowatt-hora mede o consumo acumulado que aparece na fatura.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-01'] · 1.6, nível 02 | L195 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a01-medidor-kwh-2000.webp` — Medidor eletromecânico de energia, mostrador em kWh (Siemens · Alemanha, rede de 50 Hz) (Bicycle Tourer, CC BY-SA 4.0).

## 01:32.8 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: Bicycle Tourer (CC BY-SA 4.0), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a01-medidor-kwh-2000.webp` | Medidor eletromecânico de energia, mostrador em kWh (Siemens · Alemanha, rede de 50 Hz) | Bicycle Tourer | CC BY-SA 4.0 |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
