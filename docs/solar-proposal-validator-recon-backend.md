# Solar Proposal Validator — Wave 1 · reconhecimento de reuso backend

**Status:** reconhecimento concluído. Nenhum model, migration, endpoint,
service, dependência ou integração foi criado nesta wave. Este documento é a
entrega.

**Autor:** CURSOR. **Data:** 24 de agosto de 2026.

## Numeração e método

### Esta é a Wave 1 desta trilha

O `CLAUDE.md` foi varrido pelo nome literal `Solar Proposal Validator` e pelo
heading esperado da trilha. O produto aparece no conteúdo pedagógico do Módulo
11 da Alexandria, mas não existe seção anterior chamada
`CURSOR — SOLAR PROPOSAL VALIDATOR WAVE N`.

Portanto esta é uma trilha nova e começa em **Wave 1**.

### Estado da sessão

Antes da leitura:

- branch confirmada: `feature/full-shell-buildout`;
- `git pull --rebase --autostash origin feature/full-shell-buildout`:
  `Already up to date`;
- diff rastreado real: somente `.claude/launch.json`, com 39 inserções
  pertencentes a outras sessões;
- staged diff vazio;
- nenhum arquivo preexistente foi modificado por esta recon.

### Escopo lido

A verificação cobriu o domínio completo construído pela Conta de Luz Express:

- `app/db/models/conta_luz.py`;
- `app/db/migrations/versions/0005_conta_luz_express.py`;
- `app/routers/conta_luz.py`;
- `app/services/conta_luz_storage.py`;
- `app/services/conta_luz_email.py`;
- `app/db/models/product_access.py`;
- registro do router em `app/main.py`;
- documentação das Waves 1 e 2 da Conta de Luz Express;
- varredura de models, migrations, routers, services e scripts do backend por
  referências solares.

As classificações abaixo não foram ajustadas para produzir um veredito
favorável. Quando o acoplamento é específico do primeiro produto, o resultado
é **precisa de adaptação**.

## Resultado executivo

| Hipótese | Veredito | Resultado |
| --- | --- | --- |
| Modelo de submissão aceita mais de um produto | **Precisa de adaptação** | Não há `product_id`, `type` ou enum de produto. A identidade da Conta de Luz Express está no nome da tabela, model, router, payload, constraints e services. |
| Gate de operador é genérico | **Precisa de adaptação** | A regra por email é reaproveitável como padrão, mas lê `CLE_OPERATOR_EMAIL` e está implementada dentro do router da Conta de Luz Express. |
| Anexo manual de PDF é genérico | **Parcialmente reutilizável** | O ciclo, validação por assinatura, hash, idempotência e download são genéricos; tabela, env, fallback, URLs e email são específicos. |
| Existe dado solar de referência no backend | **Não** | Zero tabela, ingest, endpoint ou service de irradiância, PVGIS/INMET, benchmark de equipamento ou preço solar. Os matches existentes são de outros domínios. |

**Conclusão:** o backend da Conta de Luz Express é uma **vertical
single-product bem delimitada**, não um motor genérico de submissões Advisory.
O Solar Proposal Validator pode reutilizar o desenho e alguns algoritmos, mas
não pode importar o domínio existente como está sem carregar nomes, regras e
configuração do primeiro produto.

## 1. Modelo de submissão

### Veredito

**Precisa de adaptação.**

### Evidência

O model `ContaLuzSubmission` declara:

- tabela `conta_luz_submission`;
- status fechado em `submitted` / `ready`;
- arquivo de origem e entregável em `BYTEA`;
- metadata de nome, MIME, tamanho e SHA-256;
- ids e timestamps dos dois emails;
- FK `user_id → users.id ON DELETE CASCADE`.

Não existe coluna:

- `product_id`;
- `submission_type`;
- `kind`;
- ou qualquer discriminador equivalente.

A migration `0005_conta_luz_express` reproduz o mesmo contrato. O produto é
implícito na própria tabela.

O `productId` visto no payload HTTP não vem do banco: é a constante
`PRODUCT_ID = "conta-de-luz-express"` inserida pelo router. A listagem filtra
somente por `user_id`, porque todas as linhas da tabela já são presumidas como
Conta de Luz Express.

O acoplamento também aparece em:

- prefixo `/api/conta-luz-express`;
- descrição do upload como `Electricity bill`;
- URLs de source e deliverable no payload;
- nomes `ContaLuzSubmission` e `CONTA_LUZ_STATUSES`;
- constraints e índices com prefixo `conta_luz_submission`.

### Migração pequena ou redesenho?

**Adicionar só uma coluna `product_id` seria uma migration pequena no DDL,
mas não resolveria o domínio.** O código continuaria semanticamente amarrado a
Conta de Luz Express em tabela, model, router, emails, env e validação. Além
disso, todas as queries passariam a precisar de filtro por produto, e as linhas
existentes precisariam de backfill.

Há dois caminhos tecnicamente honestos:

1. **Domínio irmão para Solar Proposal Validator — recomendado para a segunda
   instância.** Nova tabela, router e configuração, repetindo o contrato
   comprovado e extraindo apenas helpers realmente idênticos. É uma migration
   aditiva, de baixo risco para o fluxo existente, mas mantém duplicação
   deliberada.
2. **Generalização para `advisory_submission`.** Renomear/migrar a tabela,
   adicionar discriminador de produto, parametrizar router, storage, emails e
   regras. Isso é **redesenho transversal**, não uma migration de uma coluna.

A regra dos três favorece o primeiro caminho agora: a segunda instância testa
quais primitivas são de fato comuns; a terceira justificaria consolidar a
identidade do domínio.

## 2. Gate de operador

### Veredito

**A regra é reaproveitável; a implementação precisa de adaptação.**

### Evidência

`_require_operator`:

- usa a conta autenticada normal;
- compara `user.email` com uma identidade configurada em ambiente;
- devolve `503` quando o operador não está configurado;
- devolve `403` quando a conta autenticada não é a permitida.

Esse mecanismo é suficiente para uma operação manual pequena e evita criar
roles, painel de admin ou conta paralela.

O código, porém, é específico:

- vive em `app/routers/conta_luz.py`;
- lê `CLE_OPERATOR_EMAIL`;
- emite a mensagem literal `CLE_OPERATOR_EMAIL is not configured`;
- a mesma variável define autorização, destinatário e `reply_to`;
- só protege o endpoint de deliverable da Conta de Luz Express.

### Implicação

O Solar Proposal Validator precisa decidir explicitamente entre:

- operador próprio, com namespace de ambiente do produto; ou
- operador Advisory compartilhado, com nome neutro e decisão de plataforma.

Reutilizar `CLE_OPERATOR_EMAIL` silenciosamente faria o segundo produto
depender de configuração cujo nome e contrato pertencem ao primeiro. Isso não
é reuso como está; é acoplamento acidental.

## 3. Anexo e entrega de PDF

### Veredito

**O mecanismo é parcialmente reutilizável; os módulos atuais precisam de
adaptação.**

### Partes genéricas já comprovadas

- leitura com limite antes de persistir;
- detecção de MIME por assinatura, não só pelo header declarado;
- sanitização de filename;
- SHA-256 de origem e entregável;
- storage `BYTEA` para a V1 manual e limitada;
- status `submitted → ready`;
- PDF final obrigatório quando o status é `ready`;
- reenvio do mesmo PDF idempotente pelo hash;
- PDF diferente depois da entrega retorna `409`;
- download somente para dono ou operador;
- headers `private, no-store` e `nosniff`;
- rollback se o email do cliente falhar.

### Partes específicas da Conta de Luz Express

- service `conta_luz_storage.py`;
- limites `CLE_MAX_SOURCE_BYTES` e `CLE_MAX_DELIVERABLE_BYTES`;
- fallback de origem `conta-de-luz`;
- fallback de saída `relatorio-conta-de-luz.pdf`;
- entrada aceita PDF, JPEG, PNG e WebP, decisão feita para fatura;
- constraint PDF vive na tabela `conta_luz_submission`;
- URLs, `productId` e mensagens pertencem ao router da Conta de Luz;
- `User-Agent` de email é `NIVAR-Conta-Luz-Express/1.0`;
- idempotency keys usam `cle-submission-*` e `cle-ready-*`;
- assuntos, corpo e links dos dois emails dizem Conta de Luz Express;
- configuração usa `CLE_APP_BASE_URL`, `CLE_OPERATOR_EMAIL` e
  `CLE_EMAIL_FROM`.

### Limite recomendado para uma próxima wave

Reaproveitar sem mudança:

- `get_current_user`;
- `ProductAccess` e o endpoint de ativação;
- o padrão de ownership por `user_id`;
- o ciclo transacional upload → email operador → entrega → email cliente.

Extrair ou adaptar:

- helpers neutros de leitura limitada, assinatura MIME, filename e hash;
- transporte HTTP genérico do Resend com configuração injetada;
- helpers de headers de download;
- regra de visibilidade dono/operador.

Manter específico por produto:

- `PRODUCT_ID`;
- rota;
- tabela/model;
- política de MIME e tamanho;
- operador;
- email copy e links;
- nomes de arquivo;
- idempotency key namespace.

## 4. Dado solar de referência

### Veredito

**Zero dado de referência solar no backend.**

### Ausências confirmadas

Não existe em `app/`:

- tabela ou migration de irradiância/irradiação;
- ingestão PVGIS;
- ingestão INMET;
- Atlas Brasileiro de Energia Solar, INPE ou CRESESB como dataset;
- lookup por município ou latitude/longitude;
- endpoint de recurso solar;
- benchmark de módulo, inversor, estrutura ou instalação;
- tabela de preço de equipamento;
- histórico de preço de equipamento;
- parser ou regra de validação de proposta solar;
- product id `solar-proposal-validator` no catálogo backend.

A varredura pelos termos `PVGIS`, `INMET`, `irradiância`, `irradiation`,
`irradiance`, `GHI`, `DNI`, módulo fotovoltaico, inversor e preço de
equipamento devolveu zero match no backend.

### Near-matches que não contradizem o zero

| Match | O que é | Por que não serve |
| --- | --- | --- |
| `country_energy.solar_share_elec` + migration 0003 | Participação solar na geração elétrica nacional da OWID | Percentual agregado por país, não recurso solar por localidade |
| `atlas_world.py::solarPct` | Exposição HTTP do campo OWID | Mesmo dado nacional, sem irradiância |
| `infra/generation.py` e `ingest_eia_860.py` | Classificação de usinas dos EUA por combustível solar | Inventário de ativo, não referência brasileira de proposta |
| `pjm_zones.py`, `pjm_fuel_mix_v2.py`, `news_service.py` | Categoria solar no mercado americano | Feed/categorização PJM, não benchmark técnico ou comercial |
| Módulo 11 da Alexandria | Conteúdo pedagógico e especificação do produto | Está em `src/`, não em tabela, ingest ou endpoint backend |
| Calculadores da Alexandria | Cálculo educacional com entrada/default | Não consulta fonte oficial e não constitui base de referência |

O Módulo 11 é útil como requisito: ele declara que o produto precisa de base
de irradiância nacional, citável e por município. Ele não implementa essa
infraestrutura.

### Implicação

Uma wave de build não pode tratar nenhum campo solar já existente como
substituto de recurso solar. Antes de validar geração estimada será preciso
escolher e contratar:

- fonte primária;
- granularidade geográfica;
- vintage e metodologia;
- estratégia de ingest/cache;
- citação reproduzível no relatório.

Preço de equipamento é uma decisão separada: hoje também é zero e pode ser
deliberadamente deixado fora da V1, mas não pode ser presumido disponível.

## Matriz final de reuso

| Peça atual | Reuso |
| --- | --- |
| Sessão por cookie/Bearer e `get_current_user` | **Reusável como está** |
| `ProductAccess` / ativação por produto | **Reusável como está**, após adicionar o novo id ao catálogo |
| Ownership por `user_id` + cascata | **Reusável como padrão** |
| Lifecycle `submitted` / `ready` | **Reusável como contrato**, se o novo produto confirmar os mesmos estados |
| BYTEA para primeiros casos manuais | **Reusável como decisão V1**, sujeito a limites próprios |
| Leitura limitada, assinatura, hash e headers | **Reutilizável após extração neutra** |
| Resend REST + idempotência | **Reutilizável após parametrização** |
| `_require_operator` atual | **Precisa de adaptação** |
| `ContaLuzSubmission` / tabela existente | **Não reutilizável como está** |
| Router `conta_luz.py` | **Não reutilizável como está** |
| Storage e email `conta_luz_*` | **Não reutilizáveis como módulos públicos sem adaptação** |
| Referência de irradiância | **Inexistente** |
| Referência de preço de equipamento | **Inexistente** |

## Recomendação para a próxima wave

Construir o Solar Proposal Validator como **segundo domínio irmão**, sem
alterar a tabela viva da Conta de Luz Express:

1. escolher id canônico e adicioná-lo ao catálogo;
2. criar tabela e router próprios;
3. definir MIME e limites da proposta de vendor;
4. escolher operador próprio ou Advisory compartilhado;
5. parametrizar/extrair somente os helpers de upload e transporte que se
   provarem idênticos;
6. manter emails, URLs e política de arquivo específicos;
7. tratar irradiância e preço como frentes de dado novas, não como reuso.

Não generalizar a tabela agora. Se um terceiro produto repetir o mesmo
contrato, então haverá evidência suficiente para consolidar
`advisory_submission` e uma configuração por produto sem adivinhar abstração
antes da hora.

## Fechamento

As três hipóteses foram respondidas pelo estado real:

1. submissão **não** tem tipo de produto e está amarrada à Conta de Luz;
2. gate e PDF têm núcleo reaproveitável, mas implementação específica;
3. dado solar de referência no backend é **zero**.

Esta wave termina em documentação. Nenhum código de produto foi criado ou
modificado.
