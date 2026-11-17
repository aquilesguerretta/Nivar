# Content QA — registro de pendências de conteúdo

Registro vivo das contradições e erros de conteúdo encontrados na extração e nos estudos. **Regra (Founder,
2026-09-16):**
- a resolução factual é do content QA, não da implementação;
- nenhuma leitura é escolhida em silêncio;
- nenhuma contradição conhecida é propagada ao learner.

Enquanto um item estiver aberto:
- a interface usa rótulo semântico, cenário didático rotulado ou ausência declarada;
- figura viva ao lado de texto errado é pior que tabela: o QA vem antes do render.

## Bloqueiam desenho (resolver antes do render da aula)

| ID | Onde | Problema | Fonte do achado |
|---|---|---|---|
| QA-M14-01 | M14·A06 · INST·07 | Energia entregue sai **1.000× menor** ("1 TJ/ano"; o correto é 540 TJ/ano = 15 mi Nm³ × 36 MJ). A prosa e o Ex 08 estão certos | `estudos/aulas/m14.md` |
| QA-M14-02 | M14 · INST·08 | Campo "diferencial" em gCO₂e/MJ usado como % do fóssil. Densidade 21,3 × 21,1 MJ/L. ≈102 mil t × 116 mil t no Ex 13 | `estudos/aulas/m14.md` |
| QA-M01-A06 | M01·A06 | Contradição entre 6.1 e 6.2 | `estudos/aulas/m01.md` |
| QA-M01-A07 | M01·A07 | "15% reativos" (7.3) | `estudos/aulas/m01.md` |
| QA-M01-A04 | M01·A04 | Uso de "exponencial" | `estudos/aulas/m01.md` |
| QA-M12-A04 | M12·A04 | "Seis categorias" com sete itens | `estudos/aulas/m12.md` |
| QA-M13-A06 | M13·A06 | "Seis categorias… a sexta" × oito linhas no INST·09 (o protótipo usa rótulo semântico, P23) | `estudos/aulas/m13.md`, `estudos/aulas/prototipos/CORRECOES.md` |
| QA-M09-A01 | M09·A01 | Contagem 1/3/4/2 × 1/4/3/2 | `estudos/aulas/m09.md` |

## Verificação autoritativa pendente (P20)

| ID | Onde | Problema |
|---|---|---|
| QA-FCap-01 | M01·A08 (INST·06 × figura cf-chart); léxico; Ex06 | Faixas de fator de capacidade conflitantes (solar ~20–28% × corte em 0,25; carvão 55–75% × ≥0,85; CCGT) e pontos × faixas. Nenhuma vira verdade transversal. O simulador fica rotulado como cenário didático (P19). Ver `extraction/m01/aula-08.md` |
| QA-M10-09 | M10·A07/A08 | Números vivos (bandeiras, ADI 7.195, calendário da reforma) consultados em 01/08/2026: fonte e data à vista e revisão periódica |

## Contradições internas e de pedagogia (sem bloqueio imediato)

- **M10:**
  - QA-M10-01 a QA-M10-08: faixas de triagem × gabaritos, soma de tempos, "quatro × cinco decisões", Inst·09
    revelando a referência antes da tentativa (C7), extração com campos colados, Inst·02 sem modalidade atual,
    "Fator de carga aparente" → FCarga (P21);
  - detalhes em `estudos/aulas/m10.md`.
- **M14:** QA-M14-03 a QA-M14-07:
  - INST·10 revela no clique (C7);
  - vereditos com cor de semáforo (S2);
  - "Ver §00.1" e "Bloco NN";
  - notas "Onde isso entra no produto" (P7, P24);
  - "Critério de domínio" (S3, P14, P18).
- **M01:**
  - critério em várias formas (P18);
  - "Trava 3" × "Trava 4" (P23);
  - léxico "28" × 38 (P22);
  - sigla FC (P21);
  - ver `extraction/m01/README.md`.
- **M04:**
  - caso rotulado "Parte 4", sem decisão (P17);
  - trava "não avance para o §Voz antes de 8" (P18);
  - ramo inalcançável do INST 01;
  - ver `extraction/m04/`.

## Marca antiga (P24) no corpo das aulas

"GridAlpha" aparece em prosa de aula em:
- M01 (A05, A06, A07, A09);
- M02 (várias notas);
- M03 (notas "Onde isso entra no produto");
- M04 (kicker, rodapé e 7 notas);
- M05·A04, M07·A07, M09·A08;
- glossário (verbete do Grupo A);
- `PerfilStub.tsx`.

A troca é editorial, peça a peça, e fica registrada. As notas de produto saem da interface (P7).

## Re-extração necessária (corpo)

- **Listas, fórmulas e três níveis perdidos:** M01, M03, M05 e M07.
- **Campos colados:** M10·A07, A09, A03 e A02.

Ver `estudos/aulas/SISTEMA.md` §dependências.
