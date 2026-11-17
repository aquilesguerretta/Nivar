# Peça B · Rodada 3 — identidade de módulo e prova de movimento

Briefs anteriores: [`piece-B.md`](piece-B.md), [`piece-B-r02.md`](piece-B-r02.md).

## Resultado da r02

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | FAIL | **B4:** com os títulos cobertos, M02–M05 (e M07–M12) são o mesmo anel, e o Sumário dá a todos a mesma linha de metadado. O learner sabe onde está, mas não sabe o que é o módulo que ainda não abriu |
| System | FAIL | **S6:** a continuidade nó → módulo não aparece em quadro nenhum. O filmstrip tinha 8 arquivos e 3 imagens distintas, e a versão com movimento reduzido saiu idêntica ao estado final |
| Craft | **PASS** | Gap nomeado: na tela de Trilhas, a prancha de atmosfera é 2,2× a área do "trecho da carta" com o "você está aqui". A hierarquia de presença está invertida |

**Cegos:** 6 de 7 pares a favor (o par 3 é a baseline contra o nosso render — leia o mapeamento). Contra a Home r03,
a Home ainda ganha: ela é a régua de presença desta família.

## Correções desta rodada

1. **B4 — identidade de módulo.** Cada módulo precisa se distinguir com os títulos cobertos, na carta e no Sumário:
   - **marca gravada própria por módulo** (17), derivada do assunto do módulo, sem texto na arte. Reaproveite os
     motivos das medalhas de módulo, se já existirem em
     `../media-lab/movimento-e-conquistas/medalhas/` (F-MD3: a estação do globo e a medalha são o mesmo objeto);
     senão, produza a série (Blender em relevo ou gravura), coerente com os emblemas de território;
   - **frase de identidade** de até 12 palavras por módulo, derivada da fonte (`../extraction/mNN/modulo.md`,
     campo de tese/lede), marcada como camada Alexandria;
   - no Sumário, a linha de metadado de cada módulo passa a trazer a frase e os objetos reais do módulo
     (instrumentos, laboratório, caso, avaliação), não o mesmo texto para todos.
2. **S6 — prova de movimento.** O harness agora grava vídeo e extrai os quadros em que a tela muda
   (`"video": { }` no plano; já ativado em `mapa-E2-1440-no-modulo`, `-voltar` e `-reduced`).
   - A continuidade nó → módulo precisa aparecer **em quadro**: elemento compartilhado visível em trânsito, com o
     título legível, e a carta ainda em tela em pelo menos um quadro.
   - A versão com movimento reduzido precisa ser **observavelmente diferente** durante o trajeto e **igual** no
     estado final.
   - Se a animação atual for curta demais para registrar, ajuste a coreografia (dentro de S6: sem bounce, sem
     overshoot) para que o trânsito exista de fato — não para enganar a câmera.
3. **Craft — hierarquia de presença na tela de Trilhas.** O que localiza tem de mandar:
   - o "trecho da carta · você está aqui" ganha peso (área, posição ou escala) sobre a prancha de atmosfera;
   - a prancha continua, mas como fundo do território, não como o maior objeto da dobra.

## Verificação

- `npx tsc -b` limpo e `gridalpha-detect` 0 P0.
- Captura em `captures/B/r03` com `--closing`.
- `legend.json` como na r02, mais `video` nos shots de movimento.
- Teste em cinza: com títulos cobertos, os módulos se distinguem.
