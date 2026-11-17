# Revisão espaçada — Alexandria v3

Aprovada pelo Founder em 15/11/2026 ("pode fazer a revisão"). LYCEUM.

O aluno com conta recebe de volta, dias depois, os exercícios que já
respondeu, e responde de novo antes de ver a referência. Sem conta, nada
aparece: nem bloco, nem placeholder, e a rota `/alexandria/revisao` volta
para o Início.

## A regra, num lugar só

`src/lib/alexandria/revisao/agenda.ts`, pura, testada em
`tests/alexandria-progresso/revisao-agenda.test.ts` (`npm run test:progresso`).

| Constante | Valor | O que é |
| --- | --- | --- |
| `INTERVALOS_EM_DIAS` | 1, 3, 7, 14, 30, 60 | quantos dias até o item voltar, por etapa |
| `TETO_DA_REVISAO_DO_DIA` | 12 | itens no máximo numa revisão do dia; o resto fica para amanhã |

**São regra de produto da casa, não fato pedagógico.** Não têm fonte
citada, e a tela nunca os apresenta como "a ciência diz". Mudar os números
muda a agenda de todo mundo na próxima leitura, porque nada fica gravado.

Progressão da etapa a cada dia de prática do item:

- `atende` → sobe uma etapa: o intervalo cresce, até a última;
- `atende em parte` → desce uma etapa: o intervalo **encurta**;
- `não atende` → volta à etapa 0: o item volta amanhã;
- sem julgamento → fica onde estava (primeira vez: etapa 0).

Várias tentativas no mesmo dia contam como um dia; vale o último julgamento
daquele dia. O item vence em `último dia + INTERVALOS_EM_DIAS[etapa]`, em
dias de calendário no fuso do aluno.

## Derivada do log, sem migration

Nenhuma coluna e nenhum tipo de evento novo. `alembic heads` na base desta
wave: `0016_ariadne_close` (não foi preciso criar revisão).

- **Leitura:** `GET /api/progress/revisao?tz=` (`app/routers/progress.py`,
  `get_review_attempts` em `app/services/progress_service.py`) devolve as
  tentativas `exercicio_respondido` com `ato = 'exercicio'`, cada uma com o
  dia local (`occurred_at AT TIME ZONE :tz`, o mesmo corte da sequência) e o
  `diaDeReferencia` ("hoje" no mesmo fuso). Teto de 5000 tentativas, com
  `truncado` declarado; `resposta` sai cortada em 600 caracteres, com
  `respostaCortada` declarado (só serve para comparar escolha).
- **Escrita:** a revisão é uma tentativa — o aluno escreve antes de ver a
  referência — e sai como `exercicio_respondido`, igual à da aula, pelas
  mesmas garantias de `montarMetadataDePratica` (sem conta nada sai; sem
  `aulaId` nada sai). O que ela acrescenta vai no `metadata`:
  `origem: 'revisao'` e, nos itens abertos, `autoavaliacao`. **Um evento por
  item**, enviado quando o aluno passa ao próximo (ou sai da tela com o item
  já julgado). Julgar a própria resposta não vira segunda tentativa, e o
  Praticado não infla.

## O que pode voltar

Só os exercícios por aula de `avaliacao.ts` (somente leitura): têm
enunciado e referência. Previsão, prova do módulo e checklist não voltam.
Tentativa cujo id o catálogo não reconhece fica de fora — módulo em porte
passa a entrar sozinho quando o contrato dele chegar.

Como cada tentativa é julgada (`resultadoDaTentativa`):

1. autoavaliação registrada (tela de revisão);
2. escolha com gabarito: resposta igual ao texto da alternativa certa →
   `atende`; diferente → `não atende` (a mesma comparação que a aula mostra);
3. nada disso → sem julgamento.

## Superfícies

- **Home (`MesaDeEstudo`):** com item vencido, faixa "Para revisar hoje"
  logo abaixo da saudação — contagem, fichas do dia (um quadrado por item),
  os primeiros itens com há quanto tempo esperam, e "Começar a revisão".
  As colunas da faixa são as da grade de baixo, para o fio vertical
  continuar. Sem item vencido, uma nota na coluna lateral ("Nada para
  revisar hoje. O próximo item volta amanhã." ou, sem nada praticado, como
  a revisão funciona). Backend fora: "A revisão não pôde ser lida agora."
- **`/alexandria/revisao`:** um item por vez. Enunciado → resposta →
  "Registrar resposta" → a referência entra no DOM só agora, lado a lado →
  autoavaliação (aberto) ou comparação (escolha) → "Volta amanhã / em N
  dias" pela mesma regra → "Próximo item". A fila do dia é congelada na
  entrada. No fim, cada item com quando volta e quantos voltam no próximo
  dia.

Identidade v3: só tokens de `alexandria-v3.css`, raio zero (exceto a marca
circular da escolha), sem sombra, estado por forma e palavra (ficha cheia ×
vazada, glifo cheio × vazado), óxido só para "você está aqui". Animação:
o item sobe uma vez ao entrar e a ficha enche; com `prefers-reduced-motion`,
nada anima.

## Verificação no render

Fixtures novas em `tools/alexandria-capture/fixtures-revisao.mjs` (R0, R1,
R2, E0; "hoje" = 2026-11-15). Medido a 1440 e 390, claro e noturno:

- R1 (conta, 5 vencidos + 1 amanhã): faixa visível (opacidade 1), sem
  overflow, zero sombra, zero raio; percurso completo a 1440 claro e 390
  noturno — referência ausente do DOM antes do registro em todos os itens,
  aviso no registro vazio, 5 eventos ao todo (um por item, `origem:
  'revisao'`, `autoavaliacao` só nos abertos), fichas enchendo uma a uma;
- R2 (conta, nada vencido): sem faixa; nota "O próximo item volta amanhã";
- R0 (conta sem tentativa): sem faixa; nota de como funciona;
- E0 (sem conta): nenhuma leitura de `/api/progress/revisao`, nada na Home,
  e `/alexandria/revisao` volta para `/alexandria`;
- `prefers-reduced-motion`: item sem animação, opacidade 1.

Os testes de integração do endpoint (`tests/progress/test_revisao_reads.py`)
pulam sem `DATABASE_URL` de um Postgres descartável — não foram rodados
contra banco nesta wave.

## Fora desta wave

- **A autoavaliação da AULA não é registrada** (decisão da wave de eventos:
  `ExercicioV3` não emite por ela). Por isso a primeira volta de um item
  aberto é sempre amanhã, sem julgamento. Se a aula passar a mandar a
  autoavaliação no mesmo evento da resposta (ou num `metadata` posterior),
  a regra já a lê — `ExercicioV3` está em porte paralelo e não foi tocado.
- Medalha, banner ou sequência de revisões: gamificação é fase 2.
