# Extração M06 — História do Setor Elétrico Brasileiro

**Camada:** fonte (literal e com origem).
**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo06.html`, 2.361 linhas e 279.562 bytes.

Nenhuma contradição foi resolvida aqui: as leituras ficam registradas lado a lado. A camada Alexandria (P17–P24) é
aplicada depois, no produto.

## Arquivos

| Grupo | Arquivos | Verificação |
|---|---|---|
| modulo | `modulo.json`, [`modulo.md`](modulo.md) | 504 strings e 237 origens, 0 falhas; cobertura por token 100% (§00, §MAP, §Erros, §Voz) |
| aparato | `aparato.json`, [`aparato.md`](aparato.md) | 796 strings e 225 origens, 0 falhas; cobertura 100% (Caso, Quiz, Final, Ex, Ref, Lex) |
| instrumentos | `instrumentos.json`, [`instrumentos.md`](instrumentos.md) | 565 strings e 77 origens, 0 falhas; prova de porte contra o script original sem nenhuma falha (ver abaixo) |

Os extratores estão em `extratores/`:
- `lib.mjs`: parser de pilha, origem, cobertura por token e bundle esbuild do código, só leitura e escrito no
  scratchpad.
- `m06_modulo.mjs`, `m06_aparato.mjs` e `m06_instrumentos.mjs`.
- `verify-m06.mjs`.

**Como rodar.** `node extratores/m06_modulo.mjs && node extratores/m06_aparato.mjs && node extratores/m06_instrumentos.mjs && node extratores/verify-m06.mjs`.
- `m06_instrumentos` leva cerca de 2 minutos, porque roda o script original 43 mil vezes.
- A variável `M06_SCRATCH` muda o destino do bundle.

**Diferença de vocabulário.** Os extratores do M01 não servem aqui. O M06 usa `sec-id`, `lede`, `inst`, `box`, `lv` e
`det-bd`, e não `aula-marker`. A lógica (origem, verificação, cobertura) foi reaproveitada; os seletores foram refeitos
e testados contra o arquivo.

## Contagens

| Item | Fonte | Código |
|---|---|---|
| Seções do roteiro | 16 (6 aulas + 10 aparatos) | — |
| Aulas | **6** (os três sinais concordam, e o pill também) | 6 (títulos e subtítulos iguais; 28/28 subseções iguais) |
| Instrumentos | **8** (7 de aula + 1 de módulo, Inst · 01 no §MAP) | 8 objetos: 5 portados, 3 divergentes (01, 05, 07) |
| Termos do glossário | **99** em 6 famílias | 99 idênticos; **nenhum falta** |
| Exercícios | **10**, todos soltos (0 com aula) | 10, estrutura divergente |
| Checklist final | **24** itens | ausente |
| Quiz | **10** questões × 4 alternativas; 2 faixas | ausente |
| Caso | 1 (Parte 6), 4 subseções, 10 perguntas na prosa, 0 dados, 0 decisão | ausente |
| Referências | 21 (5 com URL) | ausente |
| Critérios literais | 8 (4 cronometrados, 5 orais + 1 "oral ou livre", 2 automatizáveis) | — |
| Erros comuns | 16 + 1 caixa | ausente |
| §Voz | 36 perguntas-relâmpago, 6 ataques, roteiro de 10 minutos | ausente |

## Prova de porte (instrumentos)

O `<script>` original rodou num DOM simulado com as mesmas entradas das calculadoras do código. O veredito foi
comparado por igualdade de string, e os números com os formatadores literais da fonte. Resultado: **0 falhas** em
3.003 casos para cada um dos Inst 02, 03, 04 e 06, 34.000 para o 07 e o espaço inteiro para o 01 (14), o 05 (21) e o 08
(11).

As divergências dos Inst 01, 05 e 07 são de **alcance**, não de cálculo:
- **Inst 05.** O seletor de regime não foi portado, e só o regime 0 existe.
- **Inst 07.** Os toggles de grupo e de fonte não foram portados, e os ramos de baixa tensão (L2106–2108) ficam
  inalcançáveis.
- **Inst 01.** O título está encurtado, o rótulo "Cicatriz que ainda opera hoje" foi trocado e o `note` é paráfrase.

Em todos os 8, `inst-intro` e `p.disc` não estão em `src/`, o que pesa para P19: o aviso "Didático/ilustrativo" não
chega ao learner.

**Método que corrigiu o harness, não a porta.** A primeira rodada acusou 19 falhas no Inst 04 e 2.307 no Inst 06. Eram
do medidor: tolerância na escala "bi" e parse. Com os formatadores literais da fonte, as falhas caíram a zero.

## Principais achados para a camada de produto

1. **Critério (P18).** Há três formas: o oral de 10 minutos, declarado "oficial", o quiz 8/10 e as 24 verificações. A
   própria mensagem de aprovação do quiz diz que "o critério oficial deste bloco é oral".
2. **Caso (P17).** A fonte escreve "Parte 6" e "cinco partes anteriores" e enumera quatro lentes. Não há dados nem
   decisão; há 10 perguntas de diagnóstico e um entregável (a folha com quatro faixas).
3. **P24.** GridAlpha aparece 13 vezes, inclusive no critério de domínio e no item 24 do §Final. Título: fonte =
   catálogo = código. O subtítulo do hero é candidato a descritor.
4. **P19.** Nenhum instrumento declara fonte externa dos valores. Parâmetros não declarados no disc: Inst 04 (8 e 0,25)
   e Inst 05 (F0/S0 e expoentes).
5. **Content QA.**
   - 9 das 10 respostas do quiz são a alternativa B.
   - O Inst 07 mostra "Elegível" para qualquer unidade de baixa tensão em 2027, contra a prosa, que restringe a
     indústria e comércio.
   - O "Nível final" do Inst 04 passa de 100%.
6. **Código × fonte, pequenos.**
   - Espaço antes da pontuação no lead das A04/A05 e no gabarito do Ex 03.
   - Exercícios com `prompt: ""` e `points: 1`.
   - `instrument-taxonomy.md` desatualizado sobre os Inst 01 e 07.
   - O catálogo marca "completo".
7. **Lacunas** (`null` declarado): resultado esperado, eixos, perguntas por aula no §MAP, § Lab, Tradutor (o análogo
   são 6 blocos "três níveis"), horas numéricas, vídeo e imagens, vínculo verificação → aula, vínculo exercício → aula,
   tolerâncias.

## Verificação (verificador adversarial, 2026-09-17)

Recontagem independente, feita direto no HTML com scripts próprios, sem usar os extratores:
- **Quiz:** 100% conferido. As 10 questões foram avaliadas a partir do próprio `var Q` do script. Enunciado, 4
  alternativas, gabarito (9 B e 1 C, a Q4) e feedback são idênticos, e as origens estão a ±3 linhas.
- **Checklist:** 100% dos 24 itens idênticos, com origem exata.
- **Instrumentos:** 100% das 273 linhas de fórmula, condição e expressão conferem na linha declarada.
- **Glossário:** 99 de 99 termos e definições idênticos, com origem exata.
- **Origens:** 560 conferidas; todas iniciam a ±3 linhas.
- **Texto:** 637 textos locais comparados na janela da origem, sem falha, e 70 amostras aleatórias lidas lado a lado
  com a fonte.
- **Cobertura:** nenhum elemento de §00, §MAP, §Caso, §Erros, §Ex, §Quiz, §Voz, §Final, §Lex, §Ref, hero ou markup
  de instrumento ficou fora. A prosa das aulas (1.1–6.4), os painéis "três níveis" e o corpo das caixas por aula não
  estão nesta extração, que é só de módulo. Eles ficam como ponteiro, como no M01, e cabem a um grupo `aula-NN`.
- **Contagens:** conferem as seções (16), as aulas (6), as subseções por aula (4/4/7/4/5/4), os instrumentos
  (8 = 7 + 1), as pills (8), os map-cards (6), os blocos "três níveis" (6), os erros (16), a §Voz (36/6/10), o
  checklist (24), os exercícios (10), as referências (21, 5 com URL, 7 links, 3 com "Números vivos"), os termos
  (21/22/14/16/13/13), os marcos (14), as pressões (11), os regimes (3) e as 13 ocorrências de "GridAlpha".

**Correção 1.** A contagem dos critérios literais foi corrigida. Antes: "4 orais ou cronometrados". Pela própria
`marcacao_p14` do `modulo.json`, são 4 cronometrados (crit-01, 04, 05 e 07) e 5 orais (crit-01 e 04 a 07), além do
crit-08, marcado "oral ou livre". O JSON já estava certo; o erro era só do rótulo do README.

**Observação sem correção.** No código, a definição de "Amforp" guarda `&amp;` literal. O componente renderiza com
`dangerouslySetInnerHTML`, e o texto exibido é igual ao da fonte, por isso o "99 idênticos" continua valendo.

## Verificação (2ª passada, verificador adversarial, 2026-09-17)

- **Correções:**
  - `aparato.json`: foi acrescentado o `trecho_inicial` que faltava em 2 origens (L1098 e L2321).
  - `modulo.json`, `m06-div-05`: a lista de linhas "Bloco N" foi completada com L867, L1454 e L1505.
  - Os extratores `m06_aparato.mjs` e `m06_modulo.mjs` receberam as mesmas correções.
  - `verify-m06.mjs` foi rodado de novo: 0 falhas.
- **Contagens:**
  - Os resíduos do original são **7** (Inst 04 ×3, Inst 05, Inst 07 ×2, Inst 02), e não 6.
  - Há 552 origens no total (249 + 226 + 77), e não 560 como diz a passada anterior. Todas conferem a ±3 linhas.
  - As demais contagens declaradas conferem com a recontagem independente.
- **Estrutura:** está correta. O escopo é de módulo, aparato e instrumentos. A prosa das aulas fica como ponteiro.
