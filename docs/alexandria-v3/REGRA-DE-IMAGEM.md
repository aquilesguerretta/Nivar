# Regra de imagem da Alexandria v3

Decisão do Founder, 14/11/2026. Vale para toda imagem, figura, ilustração,
vídeo e diagrama da Alexandria. A pergunta que decide é **para que serve a
imagem**, não onde ela aparece.

## 1. Se existe no mundo e pode ser obtida, é real

Usina, barragem, subestação, turbina, painel solar, plataforma, sala de
controle, medidor, conta de luz, cidade, rio, pessoa trabalhando, documento
histórico: **foto ou documento real**, com licença verificada (PD, CC0,
CC BY, CC BY-SA, ou licença comprada pelo Founder) e linha em
`docs/alexandria-v2/media-provenance.md` (autor, fonte, licença, data,
o que a imagem mostra de fato).

Nunca gerar algo que existe para "parecer" a coisa real.

## 2. Se precisa ser gerada para ensinar, é fiel à realidade

Quando a coisa não pode ser fotografada (um corte de um transformador, um
fluxo de elétrons, uma usina solar de dia e de noite lado a lado) e a imagem
existe **para demonstrar**, ela é gerada com aparência **coerente com a
realidade**: proporções, materiais, luz e escala corretos. Não leva o estilo
de gravura da plataforma, não leva enfeite.

Declara a classe na legenda ("ilustração gerada · esquemático" ou
"ilustração gerada · reconstituição"), como já exige o contrato (§7).

## 3. Se é diagrama, gráfico ou esquema, tem cara de diagrama

Triângulo de potência, curva de carga, barras de fator de capacidade,
circuito, fluxograma, linha do tempo, mapa de dados: **visual comum de
demonstração** — eixos, rótulos, unidade, escala, fonte. Legível como num
bom livro-texto ou no Our World in Data. Sem hachura de gravura, sem papel
envelhecido dentro do gráfico, sem ornamento.

O dado do diagrama vem da fonte (`extraction/`), e a fonte fica escrita
embaixo dele.

## 4. Só a imagem estética segue o estilo da plataforma

Abertura, capa de trilha, vinheta de seção, medalha de conquista, fundo,
marca: aí sim, gravura em tinta navy sobre pergaminho, ouro contido —
o estilo das visões da rodada 01. Também declara a classe ("gravura gerada").

## Como decidir em um minuto

| A imagem serve para… | Então é… |
|---|---|
| mostrar algo que existe | foto real licenciada |
| explicar algo que não dá para fotografar | gerada, realista, classe declarada |
| mostrar número, relação, estrutura | diagrama comum, com fonte |
| dar atmosfera, identidade, ritmo | gravura no estilo da plataforma |

## O que isso muda na rodada 01

- Visão 06: a figura de barras "FCs típicos por fonte" em hachura de gravura
  **não segue a regra** — vira gráfico comum (e os números esperam a decisão
  QA-FCap-01).
- Visão 10: a "curva de geração" gravada no verbete vira gráfico comum.
- Visão 09: as miniaturas do diário mostram figuras das aulas, logo seguem a
  classe da figura original (foto real ou diagrama comum), não gravura.
- Visões 14 e 07: o triângulo de potência e as réguas do instrumento já estão
  perto do certo; o triângulo deve ser desenhado como diagrama comum.
- `m01-a08-02` (solar e térmica, dia e noite), hoje gerada: cabe na regra 2
  só se tiver aparência realista; revisar.
- `m01-a08-04` (Sobradinho na seca, Agência Brasil/Wikimedia): já segue a
  regra 1.
- Gravuras das trilhas (15, 16, 17), medalhas (11, 12) e a abertura (01):
  estéticas, seguem o estilo da plataforma — mantidas.
