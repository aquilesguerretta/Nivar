# Conta de Luz Express — reconhecimento de capacidade backend

**Status:** reconhecimento concluído. Nenhum endpoint, model, migration,
dependência ou integração foi criado nesta wave. Este documento é a entrega.

**Autor:** CURSOR. **Data:** 23 de agosto de 2026.

## Wave e método

### Esta é a Wave 1 desta trilha

O `CLAUDE.md` foi varrido pelo nome literal e pelo id canônico do produto.
Há duas referências ao produto:

- no catálogo canônico da identidade, como
  `conta-de-luz-express`;
- no mapa comercial do Portal BR, dentro da família Advisory.

Não existe seção, heading ou registro anterior chamado
`CURSOR — CONTA DE LUZ EXPRESS WAVE N`. A busca no histórico Git por
`Conta de Luz Express` / `conta-de-luz-express` também não encontrou commit
de uma trilha própria. As ocorrências anteriores são catálogo e conteúdo
editorial; não são uma wave de backend deste produto. Portanto, esta trilha
começa em **Wave 1**.

### Escopo lido

A verificação cobriu:

- todos os routers, services, models, migrations e scripts em `app/`;
- `requirements.txt`;
- o catálogo real em `app/db/models/product_access.py`;
- o router real em `app/routers/products.py`;
- o registro de routers em `app/main.py`;
- a lista completa de models exportados por `app/db/models/__init__.py`.

Ausência abaixo significa ausência no backend versionado e no seu contrato de
deploy. Não foi inferida a partir de um único arquivo.

## Resultado executivo

| Capacidade | Existe no backend? | Reutilizável como está? | Veredito |
| --- | --- | --- | --- |
| Upload de fatura | **Não** | Não | Não há endpoint multipart, parser, storage nem model de arquivo |
| Geração de PDF | **Não** | Não | Não há biblioteca, template ou resposta PDF no backend |
| Pagamento | **Não** | Não | Não há SDK, checkout, webhook, model ou variável de processador |
| Acesso por produto | **Sim** | Parcialmente | Serve como catálogo/entitlement; não serve como compra, pedido ou entrega |

O backend está pronto para reconhecer **quem é o usuário** e **qual produto
ele ativou**. Não está pronto para receber uma conta de luz, cobrar por uma
análise, acompanhar o trabalho manual ou entregar o relatório final.

## 1. Upload de arquivo

### Veredito

**Não existe manuseio de upload no backend.**

### Evidência

- Nenhum router importa ou usa `UploadFile`, `File` ou `Form` do FastAPI.
- Nenhum endpoint declara `multipart/form-data`.
- `requirements.txt` não contém `python-multipart`, requisito do caminho
  multipart nativo do FastAPI.
- Não há SDK de object storage (`boto3`, cliente S3, Blob, Cloudinary ou
  equivalente).
- Não há variável de ambiente de bucket/storage no backend.
- Não há model de arquivo, anexo, submissão, pedido ou relatório.
- Não há escrita em disco no processo web (`write_text`, `write_bytes`,
  `tempfile` ou `open` em modo de escrita).

Os scripts de ingestão que baixam datasets não contradizem esse resultado.
Eles são operações offline de dados públicos; por exemplo,
`ingest_eia_860.py` abre um ZIP já baixado em memória com
`io.BytesIO`. Isso não fornece endpoint autenticado, persistência de arquivo
do usuário nem política de acesso.

### Reutilização

**Nada é reutilizável como upload.** A autenticação existente
(`get_current_user`) pode proteger um futuro intake, e o PostgreSQL existente
pode guardar metadados, mas hoje não há mecanismo de arquivo para adaptar.

Um brief de build não deve presumir:

- limite de tamanho ou tipos permitidos;
- extração de PDF/imagem;
- antivírus ou quarentena;
- bucket, volume persistente ou URL assinada;
- retenção, exclusão ou autorização de download.

Todos esses contratos seguem inexistentes.

## 2. Geração de PDF

### Veredito

**Não existe geração ou entrega de PDF no backend.**

### Evidência

- `requirements.txt` não contém ReportLab, WeasyPrint, wkhtmltopdf/pdfkit,
  PyPDF, fpdf, borb, Playwright ou biblioteca equivalente.
- `app/` não contém import, template ou chamada dessas bibliotecas.
- Nenhum router devolve `application/pdf`, `FileResponse`,
  `Content-Disposition` ou stream de documento.
- Não há model ou campo que represente um relatório gerado e entregue.

O repositório possui uma pipeline **frontend** separada em
`src/services/pdfExport.ts`, baseada em `@react-pdf/renderer`, com templates
para outros produtos. Ela gera Blob/download no cliente e não faz parte do
backend Python nem de seu deploy. Logo, comprova experiência de produto com
PDF, mas **não é capacidade backend reutilizável como está** para um
relatório produzido manualmente e entregue depois.

### Reutilização

**Não reutilizável no backend sem adaptação arquitetural.** Um build futuro
terá que decidir entre:

- gerar o relatório no backend com uma biblioteca Python;
- manter uma renderização Node/React-PDF em serviço próprio;
- ou receber do operador um PDF final já produzido e tratá-lo como artefato
  de entrega.

Esta recon não escolhe uma opção. Confirma apenas que nenhuma delas existe
hoje.

## 3. Pagamento

### Veredito

**Não existe integração de pagamento.**

### Evidência

- Nenhuma dependência Stripe, Pagar.me, Iugu, Mercado Pago, PagSeguro,
  Asaas, PayPal, Adyen ou equivalente aparece no backend.
- Não existe router de checkout, cobrança, PIX ou webhook.
- Não há model de pedido, compra, pagamento, transação, preço, reembolso ou
  evento de processador.
- Não há variável de ambiente de processador ou segredo de webhook.
- `app/main.py` não registra qualquer router de pagamento.

As ocorrências de `payment` no serviço de ancillary market são nomes de
grandezas do mercado elétrico PJM (`mileage payment`), não processamento
financeiro.

### Reutilização

**Nada é reutilizável como pagamento.** Identidade e autenticação podem
identificar o comprador, mas não existe transação à qual vinculá-lo.

O mecanismo atual de produto declara explicitamente o oposto de um paywall:
`POST /api/products/{product_id}/activate` ativa gratuitamente no clique.
Portanto, um brief de build não deve tratar `product_access` como prova de
pagamento.

## 4. Padrão real de acesso por produto

### O que existe

O catálogo canônico vive em
`app/db/models/product_access.py::PRODUCT_CATALOG` e já inclui:

```text
conta-de-luz-express
```

O model `ProductAccess` guarda:

- `id`;
- `user_id` com FK para `users.id` e `ON DELETE CASCADE`;
- `product_id`;
- `activated_at`;
- unicidade em `(user_id, product_id)`.

O router `app/routers/products.py` oferece:

- `POST /api/products/{product_id}/activate` — autenticado, gratuito e
  idempotente por `ON CONFLICT DO NOTHING`;
- `GET /api/products/me` — devolve as ativações do usuário e o catálogo
  canônico.

Produto fora de `PRODUCT_IDS` recebe `404`. O catálogo é validado na camada
de API, não por `CHECK` no banco.

### O que esse model significa

`ProductAccess` é um **entitlement binário por usuário e produto**:
"este usuário entrou/ativou este produto". Ele não é:

- compra;
- pedido;
- submissão de fatura;
- caso de análise;
- fila operacional;
- status de revisão;
- pagamento;
- entrega;
- histórico de múltiplas análises.

A constraint única impede mais de uma linha por usuário/produto. Isso é
correto para acesso ao produto e incompatível, sozinho, com um serviço que
pode receber mais de uma conta de luz do mesmo usuário.

Também não existem preço, moeda, processor id, payment status, metadata,
revogação, expiração ou motivo de concessão.

### Reutilização

**Reutilizável parcialmente, sem mecanismo paralelo de identidade:**

- reutilizar `get_current_user` para identificar o cliente;
- reutilizar `PRODUCT_CATALOG` / `PRODUCT_IDS` para reconhecer o produto;
- reutilizar `GET /api/products/me` para a superfície de conta;
- reutilizar `ProductAccess` como entitlement final, se o futuro contrato
  decidir que comprar ou entrar no serviço concede esse acesso.

**Precisa de adaptação para compra e operação:**

- a ativação gratuita atual não pode ser tomada como confirmação de compra;
- compra/pedido precisa de identidade própria e relação muitos-para-um com
  usuário/produto;
- submissão, arquivos, estado operacional e entrega não cabem na linha de
  `product_access`;
- o momento de concessão do entitlement precisa ser definido
  explicitamente (por exemplo, após pagamento confirmado), em vez de
  continuar implícito no clique.

Preservar `ProductAccess` como projeção de acesso e criar, numa wave de
build, um domínio separado de pedido/submissão evita duplicar autenticação
sem fingir que entitlement é pagamento.

## Capacidade adjacente que também não existe

Embora não fosse uma das quatro perguntas centrais, o fluxo prometido
"recebe relatório em até 48h" depende de estado operacional. A árvore atual
também não contém:

- fila ou model de caso;
- status de atendimento;
- área/admin de operador;
- background task ou worker;
- notificação de entrega;
- autorização de download do artefato final.

Isso reforça o limite desta recon: para as primeiras cem análises manuais,
o sistema precisa de **intake e entrega**, mas hoje possui apenas
**identidade e ativação de catálogo**.

## Fase 2 — Capacidade de entrega

Adendo ao escopo original. A varredura foi repetida sobre routers, services,
models, migrations e dependências; ausência não foi inferida a partir da
interface nem preenchida por hipótese.

### 5. Email transacional

#### Veredito

**Não existe envio de email transacional no backend.**

#### Evidência

- Não há dependência de SendGrid, Resend, Postmark, Mailgun, FastAPI-Mail,
  Amazon SES, SMTP ou equivalente em `requirements.txt`.
- Não há import de `smtplib`, cliente de provedor, helper `send_email` /
  `send_mail` ou service de email em `app/`.
- Não há variável de ambiente `SMTP_*`, `MAIL_*`, `EMAIL_*` ou credencial
  de provedor.
- `app/main.py` não registra router de notificação, email ou webhook de
  entrega.
- O router de identidade oferece somente `signup`, `login`, `logout` e
  `me`.
- O cadastro cria a linha de usuário e estabelece a sessão imediatamente;
  não gera token nem envia confirmação de endereço.
- Não existe endpoint de esquecimento/reset de senha, token de reset ou
  confirmação de email.
- O model `User` não tem `email_verified_at`, token de verificação, token
  de reset, prazo de expiração ou preferência de notificação.

O campo `users.email` é chave de identidade normalizada e única. Ter um
endereço persistido **não é** ter capacidade de enviar email.

#### Reutilização

**Nenhum mecanismo/provedor é reutilizável porque nenhum existe.** O que
pode ser reaproveitado num build futuro é somente:

- o endereço autenticado em `User.email`;
- a resolução do usuário por `get_current_user`;
- a configuração por variável de ambiente já usada em outros domínios como
  padrão operacional, não como implementação de email.

Confirmação de recebimento, aviso de mudança de status e notificação de
relatório pronto exigem escolher e integrar um provedor. O prazo de 48h não
tem hoje nenhum canal transacional que o comunique.

### 6. Arquivo ou entregável associado a uma conta

#### Veredito

**Não existe conceito de arquivo ou entregável associado a usuário.**

Não há model, tabela ou endpoint de `UserFile`, `Attachment`, `Artifact`,
`Deliverable`, `Report`, certificado baixável ou equivalente. Também não há
coluna `BYTEA`/`LargeBinary`, object key, filename, MIME type, URL de
download, `delivered_at` ou vínculo entre usuário e storage.

#### Precedentes parciais reais

Existem dois domínios que persistem fatos por conta:

1. **Acesso a produto** — `ProductAccess.user_id` referencia `users.id`
   com `ON DELETE CASCADE`. Guarda entitlement binário e data de ativação.
2. **Progresso da Alexandria** — `ProgressEvent`, `AulaStatus`,
   `BadgeAward` e `StudyStreak` também referenciam `users.id` com
   `ON DELETE CASCADE`. Os endpoints usam `get_current_user` e filtram por
   `user.id`, impedindo que uma conta leia o progresso de outra.

Esses precedentes confirmam um padrão reutilizável de **posse por conta**:

- FK `user_id → users.id`;
- exclusão em cascata;
- escrita e leitura autenticadas;
- queries sempre escopadas ao usuário atual;
- idempotência/constraints no domínio que precisa delas.

#### Por que o progresso não é um entregável

O progresso é estrutura **totalmente diferente no conteúdo e parcialmente
reutilizável apenas no padrão de ownership**:

- `progress_event` é log imutável de ações pedagógicas;
- `entity_id` é string opaca de aula/instrumento/exercício/badge;
- `metadata` é JSONB solto para contexto do evento, não arquivo;
- `GET /api/progress/me` devolve apenas ids de aulas, badges e streak;
  nem sequer expõe o `metadata` do log;
- não há bytes, path, object key, nome, MIME type, tamanho, checksum,
  autorização de download ou estado de entrega.

Guardar path de relatório ou payload de arquivo em
`progress_event.metadata` seria abuso do precedente: o log é fonte de verdade
de aprendizagem, não registro operacional genérico, e sua API não oferece
leitura do conteúdo.

`ProductAccess` tem o mesmo limite por outro motivo: responde se o usuário
tem acesso ao produto, não qual arquivo ele enviou ou recebeu.

#### Reutilização

**Reutilizável somente como padrão, não como tabela existente.** Um build
futuro pode copiar a disciplina de FK, cascata e escopo autenticado dos
models de progresso, mas precisa criar identidade própria para:

- pedido/submissão;
- arquivo de entrada;
- relatório/entregável;
- estado de revisão e entrega;
- autorização de download.

Isso não é mecanismo paralelo de conta: as novas entidades devem referenciar
o mesmo `users.id`. É um novo domínio operacional ligado à identidade
existente.

## Implicações obrigatórias para o próximo brief

O próximo brief não pode presumir nenhuma das seguintes capacidades:

1. multipart e storage já configurados;
2. PDF gerado no servidor;
3. checkout ou webhook existente;
4. `product_access` equivalendo a compra;
5. uma linha de acesso representando múltiplas submissões;
6. fila manual, status de 48h ou entrega já modelados.
7. email transacional, confirmação de conta ou reset de senha;
8. arquivo/artefato associado a usuário;
9. `progress_event.metadata` funcionando como storage ou entrega.

As únicas bases confirmadas e prontas para reaproveitamento são:

1. conta autenticada por JWT/cookie ou Bearer;
2. PostgreSQL/SQLAlchemy/Alembic;
3. catálogo canônico com `conta-de-luz-express`;
4. entitlement idempotente por usuário/produto.
5. padrão de ownership por `user_id`, FK com cascata e query autenticada.

Qualquer outra capacidade precisa ser construída ou explicitamente
descartada pelo war room. Ausência não foi preenchida por hipótese nesta
wave.
