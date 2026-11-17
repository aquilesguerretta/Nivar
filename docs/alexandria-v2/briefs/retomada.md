# Bloco de retomada — tirar o card genérico (direção do Founder, 2026-09-20)

> "Esse estilo de card é pura IA, tem que trocar isso, melhore."

## O que está errado hoje

O bloco "Onde você parou" (Home r06; e o mesmo padrão nas Trilhas) usa a gramática que qualquer produto gerado por
IA usa:
- caixa creme com fio fino em volta;
- barra de acento colorida na borda esquerda;
- barra cheia navy embaixo como botão;
- rótulos em versalete no topo.

Nada nele pertence a um atlas. Ele funciona (S1, A3 passam) e é a peça que mais destoa da gravura ao lado.

## O que ele precisa ser

Um **objeto do atlas** que carrega o registro do learner. O conteúdo não muda: onde parou (código, módulo, trilha),
estado e motivo, e **uma** ação nomeando objeto e motivo (S1). O que muda é a natureza da coisa.

Direções a explorar (produza pelo menos quatro, e proponha outras):
1. **Cartucho gravado real.** Use as gravuras em domínio público já aprovadas — `atl-14-cartucho-vazio-mascarao`
   (CC0, Rijksmuseum) e `atl-15-cartucho-vazio-nereidas` — como moldura de verdade, com a tipografia da casa dentro.
   Mídia real, não desenho de IA. Crédito na linha de "Sobre esta figura".
2. **Ficha de caderno de campo.** Papel com fio de tinta, furo ou clipe, carimbo de data e a anotação do estado à
   mão, como quem marca onde parou.
3. **Marcador de leitura.** Uma fita presa à margem da coluna, com o código na fita e o título na aba; a ação é o
   próprio marcador.
4. **Entrada de diário de bordo.** Margem de nota à esquerda (data e código), texto corrido, e a ação como linha
   gravada com seta.
5. **Plaqueta de latão cunhada (Blender),** da mesma família das estações do globo e das medalhas.

## Regras

- **Sem barra cheia navy como botão.** A ação pode ser: linha gravada com seta, carimbo, selo de latão ou fita —
  desde que continue sendo **a única** ação principal, com alvo ≥ 44 px a 390 e contraste ≥ 4,5:1.
- Raio 0, sem sombra, sem gradiente, sem vidro.
- A tipografia é a da casa (Cinzel identidade, Lora conteúdo, versalete para aparato).
- O bloco é o **mesmo componente** na Home e nas Trilhas: uma só peça, usada nos dois lugares.
- Estados: E0 e E1 ("por onde começar", ponto de partida), E2 e E2b (em leitura). Nada pessoal em E0.
- Se usar imagem real, ela entra com classe, crédito e proveniência (§7); se for gerada, idem.

## Verificação

- Comparação cega contra o bloco atual (r06), em 1440 e 390.
- Depois de integrado: capturas das duas peças, `tsc -b` limpo, `gridalpha-detect` 0 P0, alvos e contraste medidos.
