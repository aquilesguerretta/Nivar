# Alexandria v2 — lista de features propostas (para decisão do Founder)

Pedido do Founder (2026-09-17): "se quiser adicionar mais features, fique à vontade, só faça uma lista no final".

- **Origem:** 207 propostas saíram dos estudos da noite. As listas completas, com o que cada uma faz, por que vale,
  dependências e risco, estão em:
  - [`estudos/movimento-e-conquistas/features-propostas.md`](estudos/movimento-e-conquistas/features-propostas.md):
    movimento, globo, marcos e medalhas (F-C, F-M, F-MC, F-MP, F-MD, F-G);
  - [`estudos/features-propostas-aulas.md`](estudos/features-propostas-aulas.md): 8 a 12 por módulo (F-M01…F-M17),
    mais sistema de aula (F-SIS) e protótipos (F-PROT).
- **Estado:** nenhuma delas foi implementada. Abaixo, a seleção recomendada pelo orquestrador, em ordem de valor.

## Recomendadas (maior valor e menor risco contra o bar)

| # | Feature | O que faz | Depende de |
|---|---|---|---|
| 1 | **Registro de tentativas** (F-MC7, F-SIS) | Emite e persiste previsão, resposta, classificação e decisão (`instrumento_usado`, `exercicio_respondido`). Destrava "Praticado", a recuperação e as conquistas de prática | Backend (CURSOR), §9 |
| 2 | **Caixa de previsão com quadro previsto × calculado** (tronco das aulas) | O componente mais reutilizado: 128 aulas | Peça C |
| 3 | **Mesa de classificação com revelação pós-tentativa** (F-M12-5 e equivalentes) | Converte instrumentos-consulta em ato autêntico: 71 aulas | Peça C |
| 4 | **Viagem entre estações no globo** (F-M2) + sequências V1→V2→V3 já renderizadas (`media-lab/movimento-e-conquistas/globo/`) | O globo da Home gira até o território atual e traça o trecho percorrido | Peça A (movimento) |
| 5 | **Cunhagem do marco na conclusão** (F-C3, F-MD3) | A estação do globo vira a medalha do módulo concluído: o mesmo objeto, sem confete | Sistema de conquistas; peça D |
| 6 | **Caderno de marcos** (F-C1, F-C2) | Coleção honesta de conquistas de comportamento, com verso: critério, evento e data | Peça D |
| 7 | **Selo de estado datado, com validade** (F-M12-1) | Números e estados perecíveis mostram a data de verificação e se marcam sozinhos como "verificar" | Modelo de dados de fonte (§9) |
| 8 | **Banco de recuperação por erros comuns** (F-M12-7) | Usa a seção de erros de cada módulo (já extraída) como itens de "identificar o erro" | Extração pronta; mapeamento erro → aula |
| 9 | **Régua persistente do módulo** (F-M05-1) | A "régua" que a fonte declara central vira um objeto preenchível ao longo do módulo | Registro de tentativas |
| 10 | **Mapa conceitual de dois eixos** (F-M05-3) | Instrumentos que prometem "mapa" passam a desenhar um | Peça C |
| 11 | **Replay do percurso** (F-M5) | O learner revê o próprio caminho no globo ou na carta | Registro de eventos |
| 12 | **Leitura do log de eventos para o learner** (F-MC5) | "O que o sistema sabe sobre mim", com transparência | Peça D |
| 13 | **Verificador de nomeação e marca** (F-M12-8, P24) | Passe editorial que sinaliza "GridAlpha", nomes de fabricantes e linguagem interna | Content QA |

## Em espera (dependem de decisão)

- **Plaqueta de competência** (F-C6): só existe com tarefa portadora de evidência (P18). Aguarda a fase de Assessment &
  Competency Evidence.
- **Pátina por idade do registro** (F-MD5): bonita, mas precisa de regra clara para não sugerir mérito.
- **Jogos:** fora desta wave (P25). As features de jogo ficam para o trabalho à parte.
