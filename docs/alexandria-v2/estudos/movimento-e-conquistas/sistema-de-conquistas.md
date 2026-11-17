# Sistema de conquistas da Alexandria v2

Especificação de 2026-09-17 para o pedido do Founder ("quero as badges lindas"). Este documento traz:

- um catálogo honesto;
- a regra exata de cada conquista;
- a revisão dos 13 badges legados;
- a gramática visual das medalhas;
- o texto de cada estado.

Ele define **o que** se registra e como se vê. O movimento (cunhagem, conclusão, marco) está em
`sistema-de-movimento.md`, momentos 6 a 9.

**Contrato.**

- `bar.md`: S2 (materialidade, sem fantasia grega, sem escudo, coroa, louro ou cartela), S3 (evidência × motivação),
  S4 (ausência honesta), S6, D1, D2 (conquistas honestas), §6 (gêneros proibidos), §7 (mídia) e §9 (eventos).
- `decisoes/2026-09-16-ambiguidades-de-conteudo.md`: P14, P18 e P22.
- Estudo de base: `referencias-conquistas.md` (o marco de levantamento, não a medalha de prêmio).

**Gasto.** 0 crédito Higgsfield e nenhum render. A produção das medalhas está especificada no §7 e fica para a rodada
de mídia.

---

## 0. Em uma tela

1. **Conquista é comportamento registrado, datado e rastreável.** Ela afirma só o que o evento prova. Fica na camada
   de motivação, abaixo da evidência (S3), e nunca vale como prova de aprendizagem.
2. **Cinco famílias, só uma obtível hoje.**

   | Família | Obtível hoje? |
   |---|---|
   | CONCLUSÃO | Sim: `aula_concluida` e `aula_iniciada` já existem |
   | PRÁTICA | Não: em desenho |
   | EXPLORAÇÃO | Só uma conquista; as demais dependem de eventos novos |
   | HÁBITO | Depende de dois ajustes na sequência |
   | SINAIS DE COMPETÊNCIA | Não: espaço reservado, nenhum sinal existe |

3. **A medalha é um disco cunhado de latão gravado**, com o território na placa central (tímpano) e sem texto na
   arte. O nome, a data e o critério ficam em HTML. O sinal de competência, quando existir, é **outro objeto**: uma
   plaqueta retangular de raio 0.
4. **Dos 13 legados, nenhum fica como está.**

   | Destino | Quantos |
   |---|---|
   | Convertidos em conquistas de comportamento, com outro nome | 3 |
   | Viram atividade recomendada (P14) e candidatos a sinal de competência | 8 |
   | Saem | 2 |

5. **XP fora deste catálogo.** Conquista não tem pontos, e nada se soma. Se a camada de XP nascer um dia, ela mede
   atividade, repetição não rende e ela não aparece na Home (S3).

---

## 1. Regras de redação e de dado

### 1.1 Nome

- **Nome de ato, no particípio, com o objeto.** Exemplos: "Primeira aula percorrida", "Módulo 01 concluído", "Três
  dias seguidos com estudo registrado".
- **Nunca nome de persona.** Nada de "Guardião", "Mestre", "Cartógrafo", "Leitor de…", "Tradutor…", "Aferidor…",
  "Anatomista…", "Especialista" ou "Analista".
- **Palavras proibidas em nome, critério e celebração** (D2, S3, P18): domínio, dominado, mestre, maestria, mastery,
  especialista, expert, aprovado, aprovação, excelente, perfeito, gênio, craque, fera, "sabe", "entende", "domina",
  "é capaz de", e qualquer percentual ou ponto de corte.
- **"Concluído"** para requisitos de consumo cumpridos (P18). **"Percorrida"** para aula. **"Registrado"** só quando
  o servidor confirmou.
- O critério tem **1 frase** e diz também o que a conquista não mede, quando a confusão for provável. Exemplo:
  "Registrou uma resposta em cada exercício do M01. Responder não é acertar."

### 1.2 Dado (substitui o tipo `Badge` atual; mudança de tipo compartilhado, posse do FOUNDRY)

```ts
type FamiliaConquista = 'conclusao' | 'pratica' | 'exploracao' | 'habito';

interface Conquista {
  id: string;                    // 'conclusao.modulo.modulo-01'
  familia: FamiliaConquista;
  nome: string;                  // HTML, pt-BR
  criterio: string;              // 1 frase
  eventos: ProgressEventType[];  // eventos que a regra lê
  disponibilidade: 'hoje' | 'depende-§9';
  dependencia: string | null;    // qual linha do §9, em 1 frase
  territorio: 'I' | 'II' | 'III' | null;
  motivo: string;                // id do motivo gravado (§6.4)
  hierarquia: 1 | 2 | 3 | 4;     // território > módulo > contagem > hábito (momento 8)
}
```

- **Saem do tipo:** `category: 'dominio'` e `expReward`. Os dois misturam as camadas no próprio dado.
- **A regra executável** continua em `badgeRules.ts`, com `avaliar` ou `null` e o `bloqueio`. O padrão da Wave 39
  está certo e fica.
- **Toda contagem vem da coleção** (`ALEXANDRIA_MODULES`, instrumentos e exercícios do módulo, termos do glossário),
  nunca de número digitado (P22). **Se a contagem for `null` ou não estiver reconciliada (P8), a regra devolve
  "indisponível"**, nunca `false` nem `true`.
- **Data.** A conquista mostra `badge_award.awarded_at`: o dia em que foi *registrada*. Quando a regra é avaliada
  sobre conclusões antigas (retroativa), o texto diz isso (§8).
- **Emissão.** A regra roda no cliente depois de um evento confirmado, com `avaliarPorConclusao` ampliado.
  `badge_conquistado` é idempotente no servidor.
  - **Ressalva medida:** no backend, *todo* evento recalcula `study_streak`, inclusive `badge_conquistado`. Ver
    H-01.

---

## 2. Catálogo

**30 conquistas** em quatro famílias. Algumas são *modelos* com instâncias: o modelo `modulo` tem 17 instâncias, uma
por módulo. **O que conta como conquista distinta é o modelo:** a coleção mostra as instâncias.

Colunas: **id** · **nome** · **critério** · **evento e regra** · **disponibilidade** · **motivo da medalha** (§6.4).

### 2.1 CONCLUSÃO: computável hoje com `aula_concluida`

| id | Nome | Critério (1 frase) | Evento e regra exata | Disponível | Motivo |
|---|---|---|---|---|---|
| `conclusao.primeira-aula` | Primeira aula percorrida | Marcou a primeira aula como concluída. | `aula_concluida`; `aulasConcluidas.length ≥ 1` | **hoje** | Disco com um único ponto impresso e o primeiro traço de estrada saindo dele |
| `conclusao.primeira-do-territorio.{I,II,III}` (3) | Primeira aula do Território I percorrida | Concluiu a primeira aula de um módulo do Território I. | `aula_concluida`; ∃ aula concluída cujo módulo tem `trilhaId` do território | **hoje** | Placa do território com o litoral da ilha e um ponto na primeira estação alcançada |
| `conclusao.modulo.{modulo-01…17}` (17) | Módulo 01 concluído | Concluiu todas as aulas listadas do M01. Concluir não é ser avaliado. | `aula_concluida`; `aulasDoModulo(m) ⊆ aulasConcluidas`, com `m.totalAulas !== null`, reconciliado (P8) e `aulasDoModulo(m).length === m.totalAulas` | **hoje** para módulos reconciliados; os outros, depende de reconciliação (P8) | Placa do território com a estação do módulo cravada (ponto impresso + triângulo de estação) e a estrada gravada até ela; na orla, o limbo com N tiques, todos fechados |
| `conclusao.territorio.{I,II,III}` (3) | Território I concluído | Concluiu todos os módulos do Território I. | `aula_concluida`; todos os `conclusao.modulo` do território obtidos, com `trilha.totalAulasPartial === false` | **hoje** se todas as contagens do território estiverem reconciliadas | Placa inteira do território: a ilha, a estrada completa e todas as estações cravadas |
| `conclusao.curriculo` | Os três territórios concluídos | Concluiu todos os módulos dos três territórios. | Os três `conclusao.territorio` | **hoje**, com a mesma ressalva | O globo das três ilhas em baixo-relevo, com as 17 estações e a estrada inteira |
| `conclusao.contagem.{10,25,50,100}` (4) | 10 aulas percorridas | Concluiu 10 aulas diferentes, em qualquer módulo. | `aula_concluida`; `new Set(aulasConcluidas).size ≥ 10` (idem 25, 50 e 100). Repetir aula não conta | **hoje** | Limbo graduado com subdivisão crescente (rosa: 4, 8, 16, 32 marcas) e um ponto central |

**Por que não "primeiro módulo concluído".** Ele cairia no mesmo evento de `conclusao.modulo` e daria duas medalhas
para o mesmo fato.

### 2.2 PRÁTICA: em desenho, depende de eventos do §9 que não são emitidos hoje

Contrato pretendido. O `metadata` é livre no backend e precisa ser fixado com o CURSOR.

- `exercicio_respondido`: `{ aulaId, moduloId, tipo: 'previsao' | 'exercicio' | 'decisao' | 'autoavaliacao' | 'avaliacao', antesDaReferencia?: boolean }`
- `instrumento_usado`: `{ aulaId, moduloId, alterouParametro: boolean, valores?: Record<string, number> }`

| id | Nome | Critério | Evento e regra | Disponível | Motivo |
|---|---|---|---|---|---|
| `pratica.primeira-previsao` | Primeira previsão registrada | Registrou uma previsão antes de ver o cálculo. | `exercicio_respondido` com `tipo='previsao'` e `antesDaReferencia=true`; ≥ 1 | depende-§9 (emitir + persistir) | Duas escalas de vernier, ainda desalinhadas, com a marca da previsão |
| `pratica.previsao-comparada` | Previsão comparada com o cálculo | Registrou uma previsão e depois usou o instrumento da mesma aula. | `exercicio_respondido(previsao)` seguido de `instrumento_usado` com a mesma `aulaId` e `occurred_at` posterior | depende-§9 + leitura do log (F-MC5) | Vernier com as duas escalas alinhadas num traço |
| `pratica.primeiro-instrumento` | Primeiro instrumento manipulado | Mudou um parâmetro de um instrumento pela primeira vez. | `instrumento_usado` com `alterouParametro=true`; ≥ 1 | depende-§9 | Mostrador com escala e ponteiro |
| `pratica.instrumentos-do-modulo.{m}` (17) | Instrumentos do M01 manipulados | Mudou um parâmetro em cada instrumento do M01. | Para todo instrumento portado do módulo (contagem da coleção), ∃ `instrumento_usado` com `alterouParametro=true` | depende-§9; M09, M13, M14, M16 e M17 dependem também de portar os instrumentos | Placa do território com a estação do módulo e um anel de pequenos mostradores |
| `pratica.exercicios-do-modulo.{m}` (17) | Exercícios do M01 respondidos | Registrou uma resposta em cada exercício do M01. Responder não é acertar. | Para todo exercício do módulo (coleção; P9 incluído na revisão), ∃ `exercicio_respondido` com `tipo='exercicio'` | depende-§9; M10–M17 dependem também de renderizar os exercícios | Página de caderno de campo pautada, com uma coluna de marcas de registro |
| `pratica.atos.{10,50}` (2) | 10 atos registrados | Registrou 10 respostas ou previsões diferentes. | Nº de `entity_id` distintos em `exercicio_respondido` ≥ 10 (idem 50) | depende-§9 | Caderno com 10 (ou 50) marcas de contagem em feixes de cinco |
| `pratica.decisao-m08` | Exercício de decisão do M08 registrado | Registrou uma decisão no exercício de decisão do M08. | `exercicio_respondido` com `tipo='decisao'` e `entityId` do exercício do M08 (P4) | depende-§9 | Bifurcação de estrada com um ramo gravado e o outro só riscado |
| `pratica.desafio-operacao-a` | Desafio do Caso — Operação A registrado | Registrou uma decisão, com evidências e premissas, no Desafio de decisão do caso. | `exercicio_respondido` com `tipo='decisao'` e `entityId` do desafio (P17); campos obrigatórios presentes | depende-§9 + extração do caso + desenho do desafio | Mesa de carta com régua paralela sobre uma rota |
| `pratica.autoavaliacao-modulo.{m}` (17) | Checklist do M01 revisado | Marcou a própria posição em cada item do checklist do M01. É autoavaliação, não verificação. | `exercicio_respondido` com `tipo='autoavaliacao'` para todos os itens do checklist do módulo (coleção) | depende-§9 + extração do checklist | Coluna de caixas de verificação gravadas, todas marcadas a buril |
| `pratica.avaliacao-realizada.{m}` (17) | Avaliação do M01 realizada | Respondeu à avaliação do M01 até o fim. O resultado fica na linha de avaliação, não aqui. | `exercicio_respondido` com `tipo='avaliacao'` e `completa=true` | depende-§9 + extração do quiz (P5) | Folha de questões com a margem riscada até o fim |
| `pratica.dois-lados-092` | Os dois lados de 0,92 explorados | No comparador de perfil elétrico do M01, simulou um fator de potência abaixo e outro acima de 0,92. | `instrumento_usado` em `lab-01` com `valores.fp < 0.92` e outro com `valores.fp ≥ 0.92` (0,92 é o limiar que o próprio instrumento usa, não um corte de desempenho) | depende-§9 + callback do `InstrumentPanel` | Escala com um traço de referência e duas marcas, uma de cada lado |
| `pratica.matriz-duas-lentes` | Matriz reconstruída nas duas lentes | Fez as duas rodadas do reconstrutor de matriz do M08: capacidade e energia. | `instrumento_usado` em `m08-inst-04-cap` **e** em `m08-inst-04-ger`, com envio da rodada (sem ler o acerto) | depende-§9 + callback do `InstrumentPanel` | Dois discos lado a lado com setores diferentes, gravados em traço |

### 2.3 EXPLORAÇÃO: uma hoje, as demais dependem de eventos novos

Os eventos novos exigem ampliar o `CHECK` de `progress_event.event_type`, que é posse do CURSOR. Nomes propostos:

- `atlas_explorado`: `{ camada, regiaoId }`
- `termo_aberto`: `{ termoId, origem: 'aula' | 'glossario' | 'busca', aulaId? }`
- `fonte_aberta`: `{ fonteId, origem, aulaId? }`
- `portal_visitado`: `{ portal }`
- `termo_guardado`: `{ termoId }`

| id | Nome | Critério | Evento e regra | Disponível | Motivo |
|---|---|---|---|---|---|
| `exploracao.tres-territorios-abertos` | Os três territórios abertos | Abriu ao menos uma aula em cada território. | `aula_iniciada`; para I, II e III, ∃ aula iniciada ou concluída de módulo daquele território (`aulasEmAndamento ∪ aulasConcluidas`) | **hoje** | As três ilhas, cada uma com um só ponto |
| `exploracao.portais` | Os quatro portais abertos | Abriu Trilhas, Atlas, Glossário e Biblioteca. | `portal_visitado` para os quatro | depende-§9 (evento novo) | Rosa de quatro pontas lisas, sem flor-de-lis |
| `exploracao.atlas-submercados` | Os quatro submercados abertos no Atlas | Abriu o perfil de cada um dos quatro submercados no Atlas. | `atlas_explorado` com `camada='brasil'` e os 4 `regiaoId` | depende-§9 + camada Brasil do Atlas | Rosa de quatro pontas com os quatro quadrantes gravados |
| `exploracao.atlas-comparacao` | Primeira comparação no Atlas | Comparou dois países no Atlas. | `atlas_explorado` com `camada='comparador'`; ≥ 1 | depende-§9 | Dois meridianos ligados por um arco |
| `exploracao.primeiro-termo-da-aula` | Primeiro termo aberto durante uma aula | Abriu um verbete do glossário a partir de uma aula. | `termo_aberto` com `origem='aula'`; ≥ 1 | depende-§9 + D6 | Linha de texto gravada com um fio de chamada até uma ficha |
| `exploracao.termos-do-modulo.{m}` (17) | Termos do M01 abertos | Abriu todos os verbetes ligados ao M01. | `termo_aberto` para todos os termos do módulo (contagem da coleção, P22) | depende-§9 + glossário com âncora por módulo | Coluna de índice gravada, com cada entrada marcada |
| `exploracao.primeira-fonte` | Primeira ficha de fonte aberta | Abriu a ficha de uma fonte ao lado de um número. | `fonte_aberta`; ≥ 1 | depende-§9 + modelo de dados de fonte | Régua de referência com uma nota de rodapé gravada |
| `exploracao.fontes-da-aula` | Todas as fontes de uma aula abertas | Abriu a ficha de cada fonte de uma mesma aula. | ∃ aula tal que todas as `references` dela têm `fonte_aberta` com essa `aulaId` | depende-§9 | Três fios de chamada convergindo num ponto |
| `exploracao.termo-guardado` | Primeiro termo guardado para revisar | Guardou um termo para revisar depois. | `termo_guardado`; ≥ 1 | depende-§9 (persistência do glossário) | Ficha com a ponta dobrada, sem fita nem selo |

### 2.4 HÁBITO: camada de motivação

**Estado medido.** O backend mantém `study_streak` (`atual`, `maior`, `ultimoDiaAtivo`) e o devolve em todo evento e
em `GET /me`. Dois defeitos impedem usá-lo como está.

1. **Fuso.** O dia é o `CURRENT_DATE` do relógio do banco, provavelmente UTC. Um estudo às 22h em Brasília conta para
   o dia seguinte. É preciso calcular o dia em `America/Sao_Paulo`, ou no fuso do learner.
2. **Tipo de evento.** *Todo* evento conta, inclusive `badge_conquistado`. Um registro automático de conquista não é
   estudo e não pode alongar a sequência. Só `aula_iniciada`, `aula_concluida`, `instrumento_usado` e
   `exercicio_respondido` devem contar.

Com os dois ajustes feitos (posse do CURSOR), as regras abaixo ficam "hoje". **Até lá, "depende-§9".**

| id | Nome | Critério | Evento e regra | Disponível | Motivo |
|---|---|---|---|---|---|
| `habito.sequencia.{3,7,30,100}` (4) | Três dias seguidos com estudo registrado | Registrou estudo em 3 dias seguidos. | `streak.maior ≥ 3` (idem 7, 30 e 100) | depende-§9 (os dois ajustes) | Orla perolada com N contas e uma linha contínua passando por elas (sem chama) |
| `habito.dias.{10,50}` (2) | 10 dias com estudo registrado | Registrou estudo em 10 dias diferentes, seguidos ou não. | Nº de dias distintos (fuso definido) com evento de estudo ≥ 10 | depende-§9 + leitura do log (F-MC5) | Calendário de faixas gravadas, com dias marcados em pontos |
| `habito.primeira-revisita` | Primeira volta a uma aula concluída | Abriu de novo uma aula que já tinha concluído. | `aula_iniciada` com `occurred_at` posterior ao `completed_at` da mesma aula | depende-§9 + leitura do log (F-MC5); verificar que `aula_iniciada` não rebaixa o status | Estrada que volta sobre si com um laço |

**Registros pessoais: linha de texto, sem medalha** (`referencias-conquistas.md` §5.1).

- **"Maior sequência: 5 dias."** Vem de `streak.maior`. **Sem data**: o backend guarda só o `ultimoDiaAtivo`, não o
  dia em que a maior sequência terminou. Inventar "até 12 set." seria dado falso.
- **"Sequência atual: 2 dias."** Só quando `atual ≥ 2`. Com 0 ou 1, a linha não aparece. Não se mostra "0 dias",
  para não punir.
- **Nenhum aviso de perda de sequência** e nenhuma pressão para voltar.

**Fora do catálogo, de propósito:**

- "3 aulas num dia", "mais XP num dia" e combo (volume, não estudo);
- "voltou depois de uma pausa" (reengajamento como objetivo);
- conquista oculta;
- raridade;
- ranking.

### 2.5 SINAIS DE COMPETÊNCIA: espaço reservado, nenhum sinal hoje

- **Onde ficam.** Na **camada de evidência**, dentro de Demonstrado (S3). Não são conquistas e não entram no caderno
  de marcos.
- **Condição para existir um.** Três coisas, todas decididas na fase Assessment & Competency Evidence (P18):
  1. uma tarefa **explicitamente portadora de evidência**;
  2. uma regra de avaliação compatível com a capacidade afirmada;
  3. o registro da resposta.
- **Hoje.** Nenhum sinal existe. A interface mostra só a linha **"Demonstrado: ainda não avaliado"**.
  - **Nenhuma plaqueta vazia, bloqueada ou com cadeado.** Seria placeholder de função inexistente (S4).
  - **Nenhum limiar** (P18): nem 90% nem 0,92 como corte de desempenho.
- **Forma reservada:** a plaqueta (§6.2).

**Estrutura reservada**, para o FOUNDRY, sem instância:

```ts
interface SinalCompetencia {
  capacidade: string;
  tarefaId: string;
  regra: { id: string; versao: string; descricao: string };
  evidenciaEventId: string;
  data: string;
}
```

**Candidatos para a fase de avaliação.** Não estão ativos, não aparecem e não têm regra. Vêm dos legados:

| Capacidade | Origem |
|---|---|
| Distinguir potência de energia (kW × kWh) com exemplo numérico | `badge-tradutor-kw-kwh` |
| Calcular e interpretar o fator de carga | `badge-fator-de-carga` |
| Explicar por que as perdas crescem com I² | `badge-lei-de-ohm` |
| Separar o que o ONS faz do que outros agentes fazem | `badge-fronteira-do-ons` |
| Ordenar a matriz em capacidade e em energia | `badge-matriz-em-duas-lentes`; o reconstrutor do M08 já corrige contra referência, mas a tolerância precisa de revisão (P6, P18) |
| Definir FCap e situar faixas por fonte | `badge-fator-de-capacidade`; depende de P20 (faixas em verificação) |

---

## 3. Revisão dos 13 legados (`src/lib/data/alexandria-badges.ts`)

| Legado | Problema | Destino | Para onde |
|---|---|---|---|
| `badge-anatomista-de-faturas` · Anatomista de Faturas | Nome de persona. O critério é a conclusão de *uma* aula, recorte arbitrário | **Sai** | Coberto por `conclusao.modulo.modulo-10` (Tarifas e a conta de luz industrial). A aula específica ganha só o estado "percorrida" |
| `badge-cartografo-do-sin` · Cartógrafo do SIN | Nome de persona; o critério é comportamento | **Convertido** | `exploracao.atlas-submercados` · "Os quatro submercados abertos no Atlas" |
| `badge-leitor-de-mercado` · Leitor de Mercado | "Acertou 90%": ponto de corte sem fonte (P18) e desempenho apresentado como conquista | **Sai** | O resultado da avaliação vai para a linha "Avaliação do módulo · X/N · critério da fonte" (S3, P5). O comportamento vira `pratica.avaliacao-realizada.modulo-09` |
| `badge-guardiao-fp` · Guardião do Fator de Potência | Persona; "atinja 0,92" como desempenho | **Convertido** | `pratica.dois-lados-092` · "Os dois lados de 0,92 explorados". Afirma exploração do limiar, não desempenho |
| `badge-tradutor-kw-kwh` | Explicação oral cronometrada (30 s) | **Atividade recomendada (P14)** | Revisão do M01: "Atividade recomendada · Explique kW × kWh em 30 segundos, com um exemplo numérico". Candidato a sinal (§2.5) |
| `badge-fator-de-carga` | Critério composto; a interpretação é compreensão | **Atividade recomendada** | Revisão do M01. O cálculo no `inst-04` conta como ato de Praticado (momento 5), não como conquista. Candidato a sinal |
| `badge-lei-de-ohm` · Aluno de Ohm | Explicação do porquê | **Atividade recomendada** | Revisão do M01. Candidato a sinal |
| `badge-cadeia-da-rede` · Desenhista da Cadeia | Desenho fora da tela ("guardanapo") | **Atividade recomendada** | Revisão do M02: "Desenhe no papel a cadeia geração → transmissão → distribuição → consumo" |
| `badge-fronteira-do-ons` | Lista produzida sem correção | **Atividade recomendada** | Revisão do M02. Candidato a sinal com tarefa e rubrica futuras |
| `badge-dez-segundos` · Os Dez Segundos | Narração em sequência | **Atividade recomendada** | Revisão do M02 |
| `badge-matriz-em-duas-lentes` | Desenho no guardanapo; o instrumento do M08 faz parte disso | **Convertido** + atividade recomendada | `pratica.matriz-duas-lentes` (comportamento: fez as duas rodadas). O desenho no papel fica como atividade recomendada do M03. Candidato a sinal |
| `badge-fator-de-capacidade` · Aferidor… | Definir e citar faixas; as faixas estão em CONTENT QA (P20) | **Atividade recomendada** | Revisão do M03, sem citar faixa até a verificação (P20). Candidato a sinal |
| `badge-vacina-do-lcoe` | Cálculo no guardanapo + recitação | **Atividade recomendada** | Revisão do M03 |

**Totais.**

| Destino | Quantos |
|---|---|
| Mantidos como estão | 0 |
| Convertidos | 3 |
| Atividade recomendada | 9 menções, 8 legados puros + a parte "desenho" do legado da matriz |
| Saem | 2 |

**Consequência no código** (posse do LYCEUM e do FOUNDRY, não executada aqui):

- `REGRAS_BADGE` troca os 13 ids pelo catálogo novo, com `avaliar` real para as regras "hoje".
- A trava de DEV 1:1 continua.
- `BADGES_SEM_REGRA` passa a listar só as regras "depende-§9", que **não** aparecem ao learner como discos (§8).
- `BLOCOS_COM_CONTEUDO` sai: ele usa o mock como critério.
- `badge_award` já tem linhas com ids legados, pelo menos na fixture do contrato (`badge-guardiao-fp`). É preciso
  decidir a migração: ignorar ids fora do catálogo na leitura, sem apagar o log.

---

## 4. Onde as conquistas aparecem

| Lugar | O que mostra | Tamanho | Regra |
|---|---|---|---|
| **Fim de aula** (bloco de conclusão) | A conquista registrada naquele evento, abaixo do fio "REGISTRO DE PERCURSO". Se houver mais de uma, uma medalha e o resto em linhas | 96 (medalha), 24 (linhas) | Nunca modal. Nunca acima da linha de registro. A próxima ação fica acima e é clicável |
| **Progresso: caderno de marcos** (D1, item 8) | Todas as obtidas, **por data** (mais recente primeiro), agrupadas por família; depois as não obtidas **obtíveis hoje**, como discos cegos com o critério | 48 na lista, 192 no detalhe e verso | Abaixo de "onde estou / agora / revisar / demonstrado / avaliações / percorrido e praticado" |
| **Progresso: detalhe** | Anverso a 192 e, virando, o verso: critério, "Registrada a partir de: aula concluída · M01·A09", data e link "Ir ao lugar →" | 192 | A virada é um corte ou cruzamento de 150 ms, sem rotação com mola (S6) |
| **Home** | No máximo **uma linha** sob a retomada: glifo de 24 + "Último registro: Módulo 01 concluído · 12 set.", só nos 7 dias seguintes ao registro | 24 | Nunca grade, nunca contagem de conquistas, nunca XP na Home (S3, §6: "fileira de 4 insígnias de consumo") |
| **Mapa e Módulo** | Nenhuma medalha. A conclusão aparece como estado da estação (silhueta + palavra) | — | A medalha é motivação; o mapa é evidência |
| **Header** | Nada | — | — |

**E0** (visitante): nenhuma conquista e nenhum disco. O Progresso exige conta.

**E1** (conta sem eventos): o caderno mostra só os discos cegos das obtíveis hoje, com o critério, e a linha
"Registros de prática, exploração e hábito: em desenho".

---

## 5. Texto de cada estado

| Estado | Onde | Texto exato (modelo) |
|---|---|---|
| **Obtida** | Lista e detalhe | Nome · "Registrada em 17 set. 2026" · critério |
| **Obtida, retroativa** | Detalhe | "Registrada em 17 set. 2026. As aulas foram concluídas antes desta data." |
| **Obtida, verso** | Detalhe | "Critério: …" · "Registrada a partir de: aula concluída · M01·A09" · "Em 17 set. 2026" · "Ir ao lugar →" |
| **Recém-obtida** | Fim de aula | Rótulo "REGISTRO DE PERCURSO" · nome · data · critério · "Ver no caderno de marcos →" |
| **Nova desde a última visita** | Progresso | A palavra "nova" ao lado do nome, sem cor de alerta |
| **Não obtida, obtível hoje, sem contagem** | Caderno | Nome · "Ainda não obtida" · critério |
| **Não obtida, com contagem** | Caderno | Nome · "Ainda não obtida · 7 de 9 aulas do M01 percorridas" · critério (o número é o mesmo das outras telas; nunca "%") |
| **Depende de reconciliação** | Caderno (módulo sem contagem) | Nome · "Ainda não disponível: a contagem de aulas deste módulo está em revisão" |
| **Família em desenho** | Caderno, **uma linha só** | "Registros de prática, exploração e hábito: em desenho." Sem discos, sem lista de nomes indisponíveis (S4) |
| **Falha ao registrar** | Fim de aula | Nada na camada de motivação. A falha da conclusão já é dita na linha de registro. A regra roda de novo no próximo evento confirmado |
| **Demonstrado** | Camada de evidência (não é conquista) | "Demonstrado: ainda não avaliado." |

**Leitor de tela.**

- A imagem da medalha tem `alt=""`: o nome está no texto ao lado.
- O item da lista é lido como "Módulo 01 concluído. Registrada em 17 de setembro de 2026. Critério: …".
- O estado não obtido é lido como "Ainda não obtida".

---

## 6. Gramática visual das medalhas

### 6.1 Forma do marco (disco)

A anatomia vem da numismática e do marco geodésico (`referencias-conquistas.md` §2 e §3).

- **Disco cunhado** em círculo pleno, a única exceção de raio permitida (S2).
- **Orla.** Borda elevada, lisa, com uma grafila fina interna. **A orla muda por família**, e é isso que separa as
  famílias em cinza, a 48 px:

  | Família | Orla |
  |---|---|
  | CONCLUSÃO | Lisa, dupla |
  | PRÁTICA | Limbo graduado (tiques radiais) |
  | EXPLORAÇÃO | 16 marcas de rosa na borda, sem flor-de-lis |
  | HÁBITO | Perolada (contas) |

- **Campo gravado.** Traço de buril e trama cruzada, como a gravura do globo e da prancha. Campo aberto, com
  contenção.
- **Tímpano (placa central).** Carrega o **motivo** (§6.4). Nas medalhas de CONCLUSÃO, é a placa do território: a
  ilha inventada do globo, tirada da mesma `geometria.json` e da mesma textura, em baixo-relevo.
- **Ponto impresso.** Um ponto no centro da estação marca "esteve aqui", como no marco geodésico. Nas medalhas de
  módulo, vem junto de um triângulo de estação.
- **Exergo.** Segmento inferior separado por um fio em relevo, **liso na arte**. A data fica no HTML sob o disco.
  - A 192, a data pode ser sobreposta em HTML ao exergo, **só** se o contraste medido for ≥ 4,5:1.
- **Sem texto na arte, em nenhum tamanho.** O nome fica em HTML. A 192, a legenda circular pode ser texto vivo em SVG
  `textPath` (Cinzel, 11 px, espaçado), nunca raster.
- **Proibidos no desenho** (S2, §6): louro, carvalho, coroa, escudo, brasão, armas, cartela, fita, selo de cera,
  pergaminho enrolado, flor-de-lis, estrela de prêmio, figura alegórica, templo, coluna, meandro, chama, raio
  decorativo, brilho e reflexo especular.

### 6.2 Forma do sinal de competência (plaqueta, reservada)

- Retângulo de **raio 0**, proporção 4:3, em baixo-relevo. O critério e a evidência ficam no HTML ao lado.
- A silhueta é diferente do disco e continua distinguível a 24 px.
- **Não é desenhada nem produzida nesta rodada.** Só a forma está reservada.

### 6.3 Material e cor

**Latão/bronze gravado.** É o mesmo material dos discos de estação do globo (`brass_material()` em
`globo_r04.py`), para a medalha e a estação serem o mesmo objeto do mundo. O metal vem do render, e a cor passa por
**mapeamento para os tokens**, como `compor_r04.py` já faz com o globo.

| Superfície | Rampa tonal da medalha | Observação |
|---|---|---|
| Sobre papel (pergaminho `#F2E9D6` / creme `#FBF6EA`) | tinta `#2A2620` → creme afundado `#E7DAC0` → creme `#FBF6EA` | **Variante A, conforme.** O "bronze patinado" vem do relevo e da rampa quente da tinta, sem matiz novo |
| Sobre navy (`#0D2340` / `#071628`) | navy profundo `#071628` → ouro `#CBAA6E` → creme `#FBF6EA` | Ouro só sobre navy (S2). Usada na faixa navy e, se existir, na vitrine do território |
| Sobre papel, **variante B** | tinta → ouro `#CBAA6E` nos meios-tons → creme | **Quebra a heurística "ouro só sobre navy".** Só entra se, lado a lado com a A, o render ficar claramente mais forte. O critic julga e a quebra é nomeada |

- **Tolerância — corrigida em 2026-09-20.** A redação anterior ("os picos de meios-tons ficam a ΔE00 ≤ 5 de **um
  token**") era **incompatível com a própria rampa que este parágrafo manda usar**: um meio-tom legítimo cai
  *entre* dois tokens, e o pico da série mediu 12,1 ΔE00 do token mais próximo e 0,55 da rampa. A regra literal
  reprovaria qualquer rampa contínua, inclusive a conforme.
  **A régua é a distância até a rampa de tokens, não até um token isolado:** todo pixel da medalha fica a
  ΔE00 ≤ 5 de **algum ponto da interpolação** entre os tokens declarados da superfície. O gate de cor do S2
  continua valendo integralmente — nenhuma cor nova entra, e os extremos da rampa continuam sendo tokens.
  Esta correção foi levantada pelo builder, que estava sendo medido por ela, e confirmada pelo critic: o
  argumento é legítimo, mas mudar a régua é decisão de quem mantém o documento, e é o que fica registrado aqui.
- **Terracota** `#A8462A`: no máximo 1 ocorrência por viewport, e só no **ponto impresso da conquista mais
  recente**. Nunca em "não obtida".
- **Oliva** `#55663F`: só no fio do território, no HTML ao lado. Nunca na arte.
- **O relevo é da imagem.** Zero `box-shadow`, `filter: drop-shadow`, gradiente CSS ou brilho (S2).

**Estados de material.**

| Estado | Aparência | Silhueta a 24 px (SVG, sem raster) |
|---|---|---|
| **Não obtida (obtível hoje)** | **Disco cego:** a mesma geometria em relevo **sobre papel, sem tinta**. É o render do mesmo modelo com material de papel e a rampa creme afundado → creme. O critério fica legível ao lado | Anel de 1 px **tracejado**, sem ponto |
| **Obtida** | **Cunhada:** latão gravado, com tímpano, orla e ponto impresso | Disco cheio com anel e ponto central vazado |
| **Recém-cunhada** (só na animação) | 4 camadas pré-renderizadas: cego → campo → figura → orla | — |
| **Sinal de competência** (reservado) | Plaqueta | Retângulo cheio |

- **Teste de silhueta (S3).** Captura em cinza a 24 e a 48 px, com palavras cobertas: obtida, não obtida e plaqueta
  são distinguíveis. As quatro orlas de família são distinguíveis a 48 px.

### 6.4 Famílias de motivo

**Por território (tímpano de CONCLUSÃO).** As três ilhas são **cartografia inventada** do globo (classe explicação no
globo; aqui, sistema de identidade, §7 do bar). Cada placa é recortada da carta gravada r04 na posição do território.

| Território | Placa | Detalhe |
|---|---|---|
| I · Fundamentos Universais (M01–M05) | Ilha I | 5 estações |
| II · Setor Elétrico Brasileiro (M06–M12) | Ilha II | 7 estações |
| III · Especialização Estratégica (M13–M17) | Ilha III | 5 estações |

**Nenhuma massa continental real** e nenhum contorno do Brasil: a placa é a ilha inventada.

**Por família (motivos dos §2.1–2.4, desenhados como gravura técnica, sem texto):**

- **Conclusão:** ponto impresso, triângulo de estação, estrada gravada, limbo fechado.
- **Prática:** vernier, mostrador, caderno pautado, bifurcação, régua paralela, caixas marcadas, escala com traço de
  referência.
- **Exploração:** rosa de 4 pontas, meridianos, fio de chamada, índice, ficha dobrada.
- **Hábito:** contas perfuradas, calendário de faixas, estrada em laço.

**Uma placa-base por família + variações por motivo.** É o princípio do tímpano intercambiável do astrolábio: poucas
matrizes, muitas medalhas coerentes.

### 6.5 Tamanhos (CSS px)

| CSS | Asset (@2x) | Nível de detalhe | Uso |
|---|---|---|---|
| **24** | SVG vetorial, sem raster | Só a silhueta de estado (§6.3) | Linhas de texto, Home, lista densa |
| **48** | 96 px, render próprio (faixa P) | Orla da família + motivo simplificado; **sem trama fina** (a trama vira ruído abaixo de 48) | Caderno de marcos (lista) |
| **96** | 192 px (faixa M) | Orla, tímpano e ponto; trama leve | Fim de aula |
| **192** | 384 px (faixa G) | Detalhe completo; legenda `textPath` opcional | Detalhe e verso no Progresso |

- **Cada faixa é renderizada no seu tamanho**, como os diâmetros do globo (P, M e G em `globo_r04.py`). Não é
  redução de uma imagem grande.
- **Verificação:** legibilidade do motivo a 48 e ausência de moiré a 96, medidas no navegador a DPR 1 e 2.

---

## 7. Produção das medalhas (pedido para a rodada de mídia)

**Pasta:** `media-lab/movimento-e-conquistas/medalhas/`.

1. **Geometria e relevo no Blender, com a trava de GPU.**
   - Disco com orla por família (modificadores de array para tiques, contas e marcas de rosa).
   - Tímpano deslocado por um mapa de altura tirado de `A-r04/globo/textura/altura-4k.png`, recortado pelo
     território.
   - Motivos modelados como traço de buril vetorial em relevo.
   - Luz rasante **fixa**, a mesma em todas as medalhas.
   - Material `brass_material()` para a obtida e material de papel para a cega.
   - Passes em EXR, compostos por um `compor_medalha.py` derivado de `compor_r04.py`, com a rampa de token do §6.3.
2. **Camadas de cunhagem.** Para cada medalha, 4 PNGs alinhados ao pixel, nas faixas M e G: `cego`, `campo`,
   `figura` e `orla` (cumulativos). A camada `orla` é a medalha final.
3. **Higgsfield: só se o traço de buril procedural não bastar para os motivos de prática e exploração.**
   - Escolha do modelo no momento da geração, com o catálogo consultado e a justificativa registrada (M1).
   - `use_unlim:false`.
   - Prompt sem texto; rejeição de louro, coroa, escudo, cartela, selo, fita e qualquer letra (M2).
   - A saída vira **mapa de altura** no Blender, não imagem final.
   - Gasto e proveniência em `media-provenance.md` (M6).
4. **Classe (§7 do bar).** Sistema de identidade. O registro de proveniência vale mesmo assim.
5. **Aceite.**
   - Nenhum texto na arte.
   - Silhuetas distintas em cinza a 24 e 48 px.
   - Meios-tons a ΔE00 ≤ 5 da **rampa** de tokens da superfície (ver §6.3, Tolerância).
   - As 4 camadas cumulativas são monotônicas em luminância na região do relevo.
   - Teste de remoção (M7): sem a medalha, o fim de aula perde a chegada da camada de motivação. Se não perder nada,
     a medalha sai.
   - Crítica em render na composição real (bloco de conclusão a 1440 e 390), nunca da medalha isolada.

---

## 8. Casos-limite

- **Conquista retroativa.** Uma regra nova avaliada sobre conclusões antigas é registrada sem cunhagem, com a frase
  do §5. `awarded_at` é o dia do registro, e o produto não finge que é o dia do fato.
- **Aula desmarcada ou evento apagado.** O log é imutável, e não existe "desconcluir" hoje. Se existir um dia, **a
  conquista não é retirada**: ela é um fato histórico datado. A linha de Percorrido mostra o estado atual.
- **Catálogo que muda de contagem** (reconciliação P8 acrescenta uma aula a um módulo já concluído). A conquista
  continua. O módulo volta a "com aula nova" na evidência. A conquista não é aposentada.
- **Sinal de competência nunca é inferido** de conquistas, contagem, sequência ou avaliação realizada.
- **Duas contas no mesmo navegador.** Nada de conquista vai para `localStorage`. Só "vista em" (para a palavra
  "nova") fica local, com fallback: sem storage, nada é marcado como "nova".
