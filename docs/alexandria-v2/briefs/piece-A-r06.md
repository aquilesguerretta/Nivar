# Peça A · Rodada 6 — uma só chapa: globo e Titã no mesmo material

Continuam valendo os briefs anteriores da Peça A.

## Resultado da r05

**Pares cegos:**
- r05 × North Star: **3 × 0, margem clara**.
- r05 × Atlas: 3 × 0.
- r05 × r00: 3 × 0.
- r05 × r04: 2 × 1 para a r05 (sem regressão).

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | FAIL | A1: em E2b, o lede de "Explorar a partir daqui" promete "termos e fontes que a aula 01 do M06 usa", e as linhas logo abaixo dizem que não há termo ancorado nem referência. Em E2, promete fontes "da aula" e entrega fontes do módulo |
| System | FAIL | A5: quando a conta carrega, a legenda de estados entra depois do cartão e empurra a faixa navy 21px (`account-load` f03 → f04) |
| Craft | FAIL | O globo ainda lê como colagem: esfera navy de render com brilho de borda e hachura mecânica, pousada numa gravura sépia de outro material e com outra luz; nenhuma sombra de contato nas mãos. No North Star, globo e Titã são uma só gravura |

## A maior lacuna — unidade de material (quatro rodadas seguidas)

Ajustar só o traço do mar não resolveu. A r06 muda de abordagem: o globo tem de ser **impresso na mesma chapa** que
o Titã.

- **Mesma luz:** uma direção única, vinda do céu gravado.
- **Mesmo tom:** tinta sépia com o navy como segunda cor de impressão, como numa gravura em duas cores, e não um
  navy de render.
- **Mesmo grão:** papel e tinta únicos.
- **Contato:** sombra das mãos no globo e oclusão real.
- **Sem brilho de borda** e sem gradiente liso.

Caminhos a comparar às cegas, na escala exibida e dentro da prancha:
1. **Reestilização da composição inteira** (prancha + globo + mãos, sem letreiro) por image-to-image (GPT Image 2.5 e
   Nano Banana Pro), pedindo uma só gravura em cobre com o navy como tinta.
2. **Unificação por composição:**
   - gradação sépia e duotom navy;
   - meio-tom por traço no mesmo passo da prancha;
   - sombra de contato das mãos;
   - grão comum;
   - sem IA.
3. **Híbrido:** reestilização só do disco, com a prancha como referência de estilo, e depois composição com
   sombra de contato.

**Portões de fidelidade** (o dado do currículo não pode mover):
- IoU das costas ≥ 0,95;
- desvio das estações < 1% do diâmetro;
- estações continuam em terra;
- sem texto gerado;
- sem continente real.

Se a reestilização mover a geometria além do portão, as coordenadas são remedidas na imagem final (detecção dos
discos) e o JSON é regenerado. Nunca ajuste a imagem ao dado errado.

## Entram junto

- **A1.** O lede e os ganchos de "Explorar a partir daqui" dizem a mesma coisa em todos os estados. O lede só
  promete o que as linhas entregam ("termos e fontes do M06, quando houver"; "fontes do módulo").
- **A5.** A faixa de legenda reserva a altura final desde o primeiro quadro (mesma altura com e sem conta, e antes
  dos dados). Verificar `account-load` f03–f05 sem nenhum deslocamento.
- **S1, heurística.** O rótulo da ação principal volta a nomear objeto **e** motivo ("Continuar · M01·A08 — 100 MW
  solar ≠ 100 MW térmica"), sem repetir o título do cartão. O cartão pode trocar o título por uma linha de contexto.
- **390.** O globo não pode ser cortado pela barra de abas no 1º viewport sem motivo. Avalie mostrar a cabeça do
  Titã: o monumento não pode virar só duas mãos.

## Guarda de regressão

A r06 não pode ficar abaixo da r05 na comparação cega. Se nenhum caminho vencer a r05 às cegas, mantenha o globo r05
e aplique só os itens de gate.
