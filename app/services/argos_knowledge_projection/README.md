# ARGOS Knowledge Projection v0

Contrato interno para NIV-82 e NIV-86. A projeção recebe um catálogo em memória e uma decisão de direitos do consumidor. As vistas referenciam os mesmos fatos pelo par `{id, version}`, inclusive entre uma relação, a busca e a inspeção da evidência.

## Consumir

Importe de `app.services.argos_knowledge_projection`. Construa `KnowledgeProjection(objects=..., sources=..., documents=..., facts=..., rights=...)` com os tipos exportados pelo pacote. Para testar com os catálogos existentes, use `journeys.from_merged_journeys(snapshot, rights=...)`. O [exportador de teste](../../../tests/argos_knowledge_projection/export-merged-journeys.mjs) demonstra a forma do snapshot a partir dos exports TypeScript já presentes no repositório. Esse exportador roda somente no teste. O pacote Python recebe o snapshot do consumidor em memória.

| Chamada | Retorno em `data` quando resolvido |
| --- | --- |
| `search(query, context, kind=None)` | `groups` ordenados por tipo, com `items` de identidade. Busca por termos, sem acentos, com `reference_period` e métrica indexados apenas de observações autorizadas. |
| `read_object(ref, context)` | `id`, `type`, `label`, `scope`, `synthetic`, `facts` (pins) e `relations`. Arestas contêm `predicate`, `from`, `to`, `fact` e escopo contratual quando aplicável. A direção é preservada na ida e na volta. |
| `read_fact(ref, context)` | Claim ou Observation, com pin, sujeito, valor qualificado, datas, relações e `views` afetadas dentro da cobertura visível. Aceita o ID estável para seleção por corte ou um `VersionRef(id, version)` exato. Uma observação com várias medidas mantém todas sob o mesmo pin. |
| `read_evidence(pin, context, document=None, locator=None)` | Bibliografia das fontes e edições efetivamente citadas pelo fato. Um filtro opcional por Document exige pin exato e pode incluir o locator. Link oficial depende de um segundo direito. |
| `compare(left, right, context)` | Diagnóstico da base de comparação para duas observações fixadas. Exige compatibilidade explícita de métrica, unidade, denominador, base geográfica/amostral, método, período e tipo. Versões comparáveis da mesma série recebem qualificação sobre a ausência de amostra independente. |

O envelope JSON tem `status`, `reason` e `data`. Traduza os estados na UI. `UNKNOWN` indica falta de cobertura temporal ou data de conhecimento não registrada. `UNRESOLVED` indica referência inválida, cadeia inconsistente, prova insuficiente ou semântica ambígua. `RESTRICTED` indica uso negado e retorna `data: null`. `NOT_COMPARABLE` informa incompatibilidade identificada. Buscas sem correspondência retornam `RESOLVED` com `groups: []`. Identidades de navegação podem ter cobertura factual vazia. Rótulos com afirmações materiais exigem `identity_fact`.

### Datas e retorno à origem

- `ReadContext(as_of, known_at=None, channel="local")` separa o dia de vigência do instante de conhecimento. Use um `date` e, se informado, um `datetime` com fuso. O período de vigência é fechado no início e aberto no fim. A ausência de período representa uma afirmação atemporal na projeção.
- `known_at=None` consulta as revisões presentes no catálogo, sem alegar replay do conhecimento de uma data. Ao informar o corte, fatos e documentos precisam de data de conhecimento e precisam estar conhecidos até o instante. Publicação e recuperação permanecem campos distintos.
- Sem pin, selecione a revisão adequada à vigência e ao corte de conhecimento por cadeia explícita de `supersedes`. Uma revisão selecionada que falha no direito, na evidência ou nas referências encerra a resolução. Um pin explícito avalia a revisão pedida, mesmo havendo versão posterior, sob os direitos atuais.
- Guarde os dois cortes e o mesmo pin ao navegar ou usar Voltar. Use `views` para localizar as vistas autorizadas que consultam o fato. Abra a gaveta de evidência a partir do pin mediante ação do usuário. `read_object` e `read_fact` retornam a leitura sem abrir a bibliografia.

### Direitos e saúde

`rights(source_id, document_ref, channel, capability) -> bool` é avaliada a cada consulta ou replay. Autorize com `True` explícito para a combinação atual de Source, edição e capacidade. `fact`, `evidence_metadata` e `evidence_link` têm decisões independentes. Canal ausente no escopo, política indisponível, fonte/edição não resolvida ou restrição do registro não expõem dados. A única superfície desta versão é a leitura interna `local`. O Document é bibliográfico e só recebe URL oficial, sem artefatos ou URLs assinadas.

Ao integrar NIV-83, mapeie IDs de fonte somente quando houver correspondência explícita no registro. Use a decisão atual para revogação, restrição e drift, e exija a autorização específica de exibição do recorte e do canal, em cada edição. `local_archive` autoriza arquivo e por si só não concede `fact`, `evidence_metadata` ou `evidence_link`. `rights_ref` identifica a referência bibliográfica da revisão. Source Health é uma decisão separada da política de exibição e do diagnóstico de comparabilidade. [Contrato NIV-83](https://linear.app/nivarenergy/issue/NIV-83/argos-source-registry-runtime-v0-executable-rightshealth-contract#comment-5a076fc3-089f-48b7-ad7e-b3997c15b529)

## Cobertura

- **J1** resolve Solar PV → c-Si → TOPCon → wafer e a estimativa da IEA com um único pin em wafer e China. A medida é capacidade, com referência de 2024, distinta de produção efetiva.
- **J3** resolve o evento histórico de abril de 2025, o original em chinês, o item controlado, as aplicações em máquinas elétricas e a jurisdição. A ocorrência e a posição atribuída ao emissor permanecem fatos separados. O alias exato `j3:country:CHN` resolve `country:CHN`. A navegação não deduz impacto em TOPCon nem situação jurídica presente.
- **J4** compartilha Solar PV e TOPCon com J1. Cada marco, a vista tandem e a conexão documentada de célula inferior TOPCon usam a mesma Observation. O corte do marco usa o primeiro dia em que o resultado já estava documentado, conservadoramente o último dia para publicação de precisão mensal. O modelo conserva a data de publicação nativa e não transforma ausência de `known_at` em data estimada de ingestão. As versões do protótipo e da campanha em campo são publicações sucessivas do mesmo resultado. Correção retroativa é verificada com fixture sintética.
- **J2** real depende do merge e integração do PR #40. Os testes usam identidades, instrumentos e números inventados, marcados como sintéticos, acessíveis somente com `include_synthetic=True` no contexto local. Campo e FPSO têm IDs e escopos distintos. Participação contratual e operador têm predicados próprios. Projeção futura condicional pode ser lida como forecast. Ela não forma aresta efetiva de participação. O linking entre fontes continua no contrato de NIV-89.

O adapter lê os percursos delimitados acima. Cronologia J3 completa, avaliações de maturidade J4 e linking corporativo permanecem nos módulos que detêm esses contratos. CompanyProfile pode ser composto pelo consumidor sobre referências a CorporateEntity. A projeção não persiste um segundo registro jurídico.

## Verificar

```powershell
py -m pytest -q tests/argos_knowledge_projection
```

Node 24 é usado pelo teste que importa os catálogos merged de J1, J3 e J4. Os testes controlam a política de direitos em memória. Não há dependência de DB, rede, servidor ou rota.

[NIV-85](https://linear.app/nivarenergy/issue/NIV-85) · [NIV-63](https://app.notion.com/p/41a9ca62107081178d54e20df43e0e58) · [NIV-60](https://app.notion.com/p/41a9ca62107081c7aae5e183e366550b) · [NIV-61](https://app.notion.com/p/41a9ca62107081d88110dd710d8bc517)
