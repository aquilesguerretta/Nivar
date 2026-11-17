# Extração M09 — Os Mercados ACR e ACL em Profundidade

Esta é a camada **fonte** do M09: texto literal, com origem, e contradições registradas com as leituras lado a lado,
nunca resolvidas aqui. A camada Alexandria (P17–P24) é aplicada depois, no produto.

A fonte é `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo09.html` (3.441 linhas, só leitura).

## Arquivos

| Grupo | Arquivos | Conteúdo | Verificação |
|---|---|---|---|
| modulo | [`modulo.json`](modulo.json), [`modulo.md`](modulo.md) | identidade, §00, §MAP, roteiro (18 seções), critérios (P14), §Voz, §Erros, divergências, comparação com código e catálogo | 1.032 strings, 255 origens, 0 falhas |
| aparato | [`aparato.json`](aparato.json), [`aparato.md`](aparato.md) | caso, quiz, checklist final, índice de exercícios, referências, glossário | 1.318 strings, 267 origens, 0 falhas |
| instrumentos | [`instrumentos.json`](instrumentos.json), [`instrumentos.md`](instrumentos.md) | os 11 INST: markup, dados e código do script, cenário-padrão e enumerações rodadas no script original | 683 strings, 488 literais, 57 origens, 0 falhas |

**Extratores** ([`extratores/`](extratores/)):
- `lib.mjs`: parser por linha, leitor de literais JS e DOM simulado;
- `m09_modulo.mjs`, `m09_aparato.mjs` e `m09_instrumentos.mjs`: um por grupo;
- `verify.mjs`: verificação, com o resultado em `verify-resultado.json`.

Para refazer: `node m09_modulo.mjs && node m09_aparato.mjs && node m09_instrumentos.mjs && node verify.mjs`.

**Cobertura por token** (§5): 100% em todas as seções extraídas. No markup e nas strings de script dos instrumentos,
100% em 10 de 11, com resíduo explicado no INST·01 (comentários do SVG) e no INST·04 (fragmento de markup).

**Diferença de vocabulário em relação ao M01.** O M09 usa `sec-id`, `lede`, `inst`, `box`, `lv`, `fi` e `details`. Os
extratores do M01 (`aula-marker`) não servem aqui; foram adaptados, não reaproveitados.

## Contagens

| Item | Fonte | Código |
|---|---|---|
| Seções | 18 (8 aulas + §00 + §MAP + 8 de aparato) | — |
| Aulas | 8 | 8 (títulos, subtítulos e leads idênticos) |
| Instrumentos | 11 (10 em aula, 1 no §MAP; Aula 08 com 3) | **0 portados** |
| Termos (§Lex) | 136 em 6 grupos (prosa = pill = markup) | **0** gl-m09 |
| Exercícios | 14 (0 com aula; A 4 · B 5 · C 5) | 14, com id duplicado, prompt vazio e tag "null · …" |
| Itens de checklist | 28 (orais ou livres; 0 cronometrados) | 0 |
| Questões do quiz | 10 × 4 alternativas; 2 faixas de placar | 0 |
| Caso | 6 seções, 1 pergunta da fonte, 6 cartões, 1 veredito | 0 |
| Erros comuns | 20 | 0 |
| §Voz | 40 relâmpago · 8 ataques · roteiro de 7 trechos | 0 |
| Referências | 30 (0 URL, 0 domínio, 0 sigla de instituição) | 0 |
| Fichas de contrato | 6 (Aula 04; no corpo da aula, fora deste grupo) | no corpo |
| Divergências | 15 (modulo) + 5 (aparato) + 11 (instrumentos) = 31 | — |

## Achados principais

1. **Readout errado na tela (INST·02).** O markup diz que 3 componentes mudam de mecanismo e 4 permanecem devidos; os
   dados dizem 4 e 3, e o script nunca corrige os contadores.
2. **"6 de cinco" (INST·05).** Os pesos somam até 6, mas o texto e o readout dizem "de cinco".
3. **Texto morto (INST·09).** Dois textos de impedimento nunca aparecem. "Não sei" vence um impedimento determinado.
4. **Critério de domínio sem texto.** A Aula 08 o cita duas vezes e ele não está no arquivo. O quiz diz 8/10, e a
   mensagem de pass começa com "Critério atendido". P18: tudo isso é só registro.
5. **"quatro dos sete sinais".** No §Caso, só 2 dos 4 citados estão na tabela de sinais da Aula 08.
6. **"parte 9".** O caso se declara parte de uma série por módulo. P17 governa o produto.
7. **GridAlpha em prosa comum** (Aula 08, L1695), além de 4 destaques de produto (P24/P7).
8. **Código.** Os 14 exercícios têm o mesmo id (`m09-ex-null`). O glossário, o caso, o quiz, o checklist, as referências
   e os instrumentos do M09 não existem em `src/`.
9. **Catálogo canônico.** Corta o título da Aula 07, resume o glossário com siglas que a fonte não usa e repete "três
   perguntas" para o INST·06.

## Lacunas (a fonte não tem)

- **Estrutura do módulo.** Não há "Resultado esperado", perguntas por aula, § Lab nem Tradutor.
- **Vínculos com aula.** Nenhum item de aparato os declara (quiz, checklist, erros, exercícios, termos, referências),
  embora a lede do §Final diga o contrário.
- **Instrumentos.** Nenhum tem pergunta própria, fonte dos números ou tolerância.
- **Caso.** Não tem números nem decisão pedida (o veredito vem pronto).
- **Referências.** Não têm URL, domínio nem campos D5.
- **Critério de domínio do bloco.** Citado na Aula 08, mas sem texto no arquivo.

## Verificação

Primeira verificação adversarial independente em 2026-09-17, com parsers próprios. Resultado: **ok, nenhuma correção**.

- **Strings e origens.** Todas as strings de conteúdo dos 3 JSON conferem com a fonte, e todas as origens também
  (`trecho_inicial` e `linha_aprox`, ±3).
- **Conferência completa.** Quiz, checklist e código dos instrumentos foram conferidos por inteiro (100%). Glossário,
  referências, exercícios, §Erros e §Voz foram conferidos par a par.
- **Contagens.** Todas as contagens declaradas foram recalculadas no HTML e batem.
- **Registro sem correção.** As fichas da Aula 04 no código também têm " , " no lugar de `</b>,`. Detalhes em
  [`aparato.md`](aparato.md#verificação).

### Segunda verificação adversarial (2026-09-17): corrigido, 2 correções em `modulo`

- **Correções.** As duas são em leituras de divergência. `m09_modulo.mjs` foi corrigido e `modulo.json` regenerado.
  `aparato.json` e `instrumentos.json` saíram idênticos, e o `verify.mjs` continua sem falha.
  1. **`div-m09-caso-parte`.** M02, M03, M06, M10 e M16 **têm** número de parte (o do M16 está em entidades HTML).
     Só o M01 não tem, e a série M02–M17 não tem lacuna.
  2. **`div-m09-badge-pld`.** Além de `data-v="pld"`, a fonte tem a chave `pld:` (L2752) e o `id="lv-gsf"` (L1593).
- **Conferido sem erro.** Quiz, checklist, glossário, referências, §Erros, §Voz, dados literais e linhas de código dos
  instrumentos (100%).
  - As 41 saídas do cenário-padrão foram comparadas com o DOM ao vivo, com os scripts originais rodando no navegador.
  - As 604 origens estão a ±3 linhas.
  - Todas as contagens declaradas foram recalculadas e batem.
- **Detalhes.** Ver a seção "Verificação" de cada `.md`.
