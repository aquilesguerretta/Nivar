# ARGOS Identity Linker v0

Módulo Python interno do NIV-89. Resolve uma asserção tipada a partir de evidência curada e devolve a tripla e os pins exatos que a sustentam. O leitor opera em memória com entradas fornecidas pelo chamador.

## Contrato para NIV-85

- Carregue `Assertion(triple, pin, authority, known_at, valid_from, valid_to)` a partir de registros revisados. `Authority` descreve o escopo comprovado da evidência. O adaptador valida a fonte original e decide se ela sustenta aquele predicado. A classificação é uma entrada interna de confiança, nunca um campo fornecido por um cliente.
- Use `IdentityLinker(assertions, can_read=policy).read(subject, predicate, context, basis=..., effect=..., source_id=..., pin=...)`. Passe os mesmos `as_of`, `known_at` e `channel` em todas as vistas. `as_of` é uma data de vigência. `known_at` é um instante com fuso de quando ARGOS conhecia a versão. Um intervalo é `[valid_from, valid_to)`; forneça um fim quando a cobertura da fonte for delimitada. Uma asserção sem datas suficientes para a consulta deve ficar fora da carga.
- `EvidencePin` contém `source_id`, `document_id`, `document_version`, `fact_id` e `fact_version`. Este último é uma sequência inteira positiva no fluxo (`source_id`, `fact_id`). O adaptador mantém o vínculo com o pin exato de Claim/Observation no NIV-85. Por padrão, o leitor seleciona a maior versão conhecida **em cada fluxo** antes de aplicar vigência e effect. Use fluxos distintos para períodos independentes e novas versões para corrigir o mesmo fato. Um pin consulta somente a versão exata, dentro dos dois cortes.
- `can_read(pin, channel)` precisa devolver `True` explicitamente para a tripla e seus metadados mínimos no canal solicitado. Use a decisão vigente por recurso, versão, canal e capacidade, inclusive ao ler histórico. O NIV-83 pode fornecer essa decisão via adaptador. Permissão ausente ou revogada retorna `RESTRICTED`; o leitor não substitui a versão negada por outra. O resultado não concede acesso a documento, conteúdo ou link. Mantenha a inspeção de evidência sob a ação explícita e o gate separado do NIV-85.
- `ReadResult.to_dict()` devolve `{status, reason, data}`. Em `RESOLVED`, `data` contém `triple` e `provenance` com pins, autoridade e recortes. `UNKNOWN` indica ausência de asserção aplicável. `UNRESOLVED` cobre consulta só por nome e asserções divergentes. `RESTRICTED` indica permissão insuficiente. Esses três estados devolvem `data: null`. Se fontes autorizadas divergem, use `source_id` para ler seu valor atribuído ou mantenha a divergência explícita. A projeção continua responsável por comparabilidade.

## Escopo de identidade e papéis

- `j3:country:CHN → country:CHN` é uma ponte explícita e direcional entre jurisdições nacionais. Exija uma asserção `same_as` com autoridade `jurisdiction_crosswalk`. A ponte não harmoniza territórios estatísticos nem cria relações causais.
- `profile_anchor` liga um CompanyProfile à entidade jurídica. `identifies` liga separadamente um CNPJ de 14 dígitos ou um CIK com 10 dígitos ao CorporateEntity, com evidência explícita para cada registro. Preserve os zeros à esquerda e a classificação do namespace. A raiz do CNPJ, um ticker ou um nome não é uma chave jurídica. Os aliases são diretos, sem fechamento transitivo.
- Campo, jazida compartilhada, área contratada, FPSO e instalação operacional têm escopos próprios. Use `asset_owner`, `operator`, `contractual_participating_interest` e `governance_control` com `basis` e um `instrument_ref` compatíveis com o papel. Os percentuais são inteiros em pontos-base. A amostra contém **3.860** para a jazida inteira (**38,60%**), **4.000** para a área contratada (**40%**) e **8.000** para o bloco arrematado (**80%**).
- O leitor devolve `Effect.ESTABLISHED` por padrão. Solicite `Effect.CONDITIONAL` para a alocação anunciada e para a projeção de **41,40%** na jazida. `scheduled_for` é a data prevista. Para registrar confirmação, a fonte revisada precisa sustentar `effective_participation` e seu intervalo de vigência. Ajuste a vigência da participação anterior com evidência própria para evitar sobreposição. Na amostra, a consulta futura de vigência retorna `UNKNOWN` porque a cobertura da baseline fica no recorte de 2026.

## Execução local

```powershell
py -m pytest -q tests/argos_entity_linker
py -m tests.argos_entity_linker.sample
```

A amostra imprime JSON marcado com `synthetic: true`. Exercita os IDs de navegação J2 propostos no PR #40 com pins e datas sintéticos, mais o alias J3 da base. Execute na raiz do repositório. Usa apenas a biblioteca padrão em runtime. As integrações com registros autorizados de J2, o gate do NIV-83 e a projeção do NIV-85 dependem dos adaptadores de cada consumidor.

[Contrato NIV-85](https://linear.app/nivarenergy/issue/NIV-85/argos-knowledge-projection-v0-cross-object-read-model-and-provenance#comment-94a0c406-f2cc-4258-8f8e-cc600716ee8f) · [Decisão NIV-71](https://linear.app/nivarenergy/issue/NIV-71/argos-companies-assets-petrobrasmero-contractual-timeline-source-pack#comment-af2830f3-b612-44ac-85ae-09673315800c) · [NIV-63](https://app.notion.com/p/41a9ca62107081178d54e20df43e0e58)
