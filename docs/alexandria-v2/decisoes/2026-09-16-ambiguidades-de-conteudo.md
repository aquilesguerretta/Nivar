# Decisões do Founder — ambiguidades de conteúdo (2026-09-16)

**Status:** aprovadas pelo Founder. Complementam o [`bar.md`](../bar.md) §11 como P17–P24 e surgiram da extração do M01
([`../extraction/m01/README.md`](../extraction/m01/README.md)).

> **Regra geral.** Preserve a verdade da fonte, mas não deixe a estrutura legada limitar a qualidade do novo produto.
> Conteúdo criado pela Alexandria precisa ser distinguível do conteúdo extraído. Erros, ambiguidades editoriais e
> estruturas pedagógicas fracas não precisam ser preservados só porque estavam no HTML antigo.

## Duas camadas legítimas

| Camada | O que é | Regra |
|---|---|---|
| **Fonte** (`camada: "fonte"`) | O que veio dos materiais originais | Literal, com origem (arquivo, trecho, linha). Contradições ficam registradas, e nenhuma leitura é escolhida em silêncio |
| **Produto pedagógico** (`camada: "alexandria"`) | O que a NIVAR cria para ensinar melhor: prompts, previsões, debriefs, casos, desafios de decisão, visualizações, explicações, recuperação, jogos, avaliações | Pode ser desenhado. Nunca é atribuído à fonte antiga. Registra autor e data e segue a revisão de P3/P11 |

- **Lacuna da fonte:** não inventar fato.
- **Lacuna pedagógica:** o design está autorizado.

**Implementação:**
- **No dado:** todo item de conteúdo carrega `camada` e proveniência.
- **Na interface:** conteúdo da camada Alexandria nunca recebe rótulo de fonte ("Fonte: …") e nunca aparece como texto
  extraído. A forma visível de distinguir as camadas (rótulo da tarefa, voz tipográfica) é decidida no Design Loop da
  Peça C.

## Decisões

| ID | Tema | Decisão |
|---|---|---|
| P17 | Caso "Operação A" | **Não existe "Parte 1".** O título é **Caso — Operação A** (ou outro derivado do próprio caso), e o caso original fica intacto como contexto. **Autorizado** acrescentar ao final um **Desafio de decisão** da camada Alexandria. O learner: escolhe um caminho; explicita a decisão; cita evidências do caso; declara premissas; reconhece pelo menos um trade-off; e, opcionalmente, diz o que o faria mudar de decisão. A proposta usa só os fatos do caso, sem fato novo. Etapas de interface são estrutura da Alexandria, nunca "Partes" da fonte |
| P18 | Critério de aprovação do módulo | **Não existe, por enquanto, um critério único**, e nenhum limiar legado é escolhido (6/8, 8/10, "7 acertos", checklist de 16). Três coisas separadas: **Conclusão de conteúdo** (percorreu/concluiu o exigido), **Desempenho em avaliação** (resultado de uma atividade específica) e **Evidência de competência** (o que se pode afirmar que foi demonstrado). Nenhum limiar legado declara domínio, emite competência, trava a próxima trilha ou afirma aprovação geral. A mensagem "siga ao próximo módulo com 7 acertos" fica só como registro legado. **Na interface:** "Concluído" para requisitos de consumo/participação cumpridos; nunca "Aprovado", "Dominado" ou equivalente sem evidência. A arquitetura reserva espaço para uma futura avaliação final. **Nenhum ponto de corte (70%, 75%, 80%…) é inventado agora**: ele será definido na fase de Assessment & Competency Evidence. Refina P5 e S3 |
| P19 | INST·06 — cenário 100 MW / 220.000 MWh | Na interface, sem fonte externa inventada: **"Cenário didático presente no módulo; fonte externa dos valores não declarada."** Nunca apresentar os números como média nacional, valor típico oficial, dado ANEEL/ONS/EPE ou benchmark real sem verificação. **Autorizada** a pergunta de previsão "100 MW solar ≠ 100 MW térmica", ou uma formulação melhor que ensine a mesma distinção, na camada Alexandria e com os números do cenário. Prefira uma tarefa conceitual ou de raciocínio. Resposta numérica derivada pode aceitar arredondamento técnico normal como **regra de entrada/pontuação da Alexandria**, nunca como "tolerância da fonte". Nenhuma margem factual inventada (P6) |
| P20 | Faixas de fator de capacidade conflitantes (script × figura) | Registrar como **CONTENT QA — AUTHORITATIVE VERIFICATION REQUIRED**. Nenhuma faixa vira verdade transversal. Valores de simulador podem ficar como cenário didático rotulado. Faixas apresentadas como reais exigem validação posterior em fonte primária/autoritativa. A resolução é do content QA, não da implementação |
| P21 | Sigla FC | Padrão editorial: **FCap** para fator de capacidade e **FCarga** para fator de carga. Nunca usar `FC` sozinho quando houver ambiguidade. Nome completo na primeira ocorrência relevante; a abreviação vale depois. Em citação de documento externo que usa `FC`, não alterar o texto e explicar o sentido no contexto. Aplicação progressiva ao produto inteiro |
| P22 | Glossário "28" × 38 | **A estrutura real ganha da prosa.** O produto declara a contagem real (38), **derivada programaticamente da coleção**, nunca digitada. Duplicatas só ficam com justificativa semântica |
| P23 | "Trava 3" × "Trava 4" | Primeiro, tentar reconciliar pelo contexto do caso. Com evidência clara, corrigir na camada editorial e manter a divergência no registro de proveniência/QA. Sem reconciliação possível, **não expor uma numeração possivelmente falsa**: usar rótulo semântico ("A restrição operacional", "A próxima trava"). A fonte não é alterada, e o produto não propaga a contradição |
| P24 | Marca e títulos | **"GridAlpha" está morta como marca voltada ao learner.** Usar **Alexandria** quando o sujeito é o produto educacional e **NIVAR** quando é a empresa. Hierarquia: NIVAR → Academy / Perseu → Alexandria, sem precisar aparecer sempre; a Alexandria mantém identidade própria. "GridAlpha" só aparece em proveniência histórica, nome antigo de arquivo, comentário técnico necessário ou registro de origem. **Títulos:** o catálogo canônico dos 17 módulos governa o nome principal na navegação e na arquitetura. O HTML governa o conteúdo, não o nome global. Um título alternativo da fonte com nuance valiosa pode virar subtítulo, linha de capítulo ou descritor editorial, nunca um segundo título oficial |

## Aplicação e pendências registradas

- **P24, GridAlpha em conteúdo voltado ao learner (medido em 2026-09-17):**
  - `src/lib/data/alexandria-modulo-01-content.ts`, `-02-`, `-03-` (e provavelmente outros módulos), em prosa de
    aula e notas;
  - `src/lib/data/alexandria-glossario.ts` (verbete do Grupo A);
  - `src/pages/alexandria/PerfilStub.tsx` ("conta GridAlpha");
  - `src/lib/data/alexandria-blocks.ts` (comentário de proveniência, que pode ficar).

  A troca é feita peça a peça (C para aula e módulo, D para perfil) ou num passe de content QA dedicado. Cada troca
  é da camada editorial e fica registrada. Blocos "onde isso entra no produto" continuam fora da interface (P7).
- **P21, FC:**
  - o glossário tem "Fator de capacidade (FC)" e "Fator de carga (FC)", e as fórmulas do M01 usam "FC =";
  - o gancho de Glossário da Home cita "Fator de capacidade (FC)";
  - aplicar FCap e FCarga na camada de exibição, começando pela Home e pela aula M01·A08.
- **P22:** o gancho da Home já deriva a contagem da coleção ("38 termos do Módulo 01").
- **P17, P19, P20, P23:** entram no brief das Peças C1 e C2.
- **P18:**
  - vale já para qualquer texto de progresso;
  - a Home usa "percorrida", "em leitura", "ainda não medido" e "ainda não avaliado", sem "Aprovado";
  - a página de módulo atual (Peça B/C) mostra "Concluído · 9 aulas" com dado divergente (gate de dado falso,
    registrado para a Peça B).
