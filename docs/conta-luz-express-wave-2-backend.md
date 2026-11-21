# Conta de Luz Express — Wave 2 · backend real

**Status:** implementação fechada; ativação externa de email pendente de
credenciais Resend e domínio remetente verificado.

**Autor:** CURSOR. **Data:** 23 de agosto de 2026.

## Numeração da trilha

O `CLAUDE.md` ainda não contém seção numerada da Conta de Luz Express. Ele
só menciona o produto no catálogo canônico e no mapa da família Advisory.
Isso é uma lacuna documental, não ausência da recon: a Wave 1 está provada
por `docs/conta-luz-express-recon-backend.md` e pelos commits publicados
`ecf6e6f` e `e298a43`, ambos nomeados `wave 1`.

Portanto esta construção é **Wave 2**. O `CLAUDE.md` não será corrigido por
esta wave porque não está na posse declarada.

## Restrições confirmadas

- Pagamento fica integralmente fora da Wave 2.
- `product_access` continua sendo entitlement e não será modificado.
- O novo domínio será irmão de `product_access`, referenciando o mesmo
  `users.id`.
- Nenhuma tabela ou service de progresso da Alexandria será modificado ou
  usado como storage.
- A análise é manual, fora do sistema. O backend cuida de intake, estado,
  entrega e notificação.

## Indícios de provider existentes

A checagem cobriu código, dependências e os **nomes** das variáveis do
serviço `gridalpha-v2` no Railway, sem imprimir valores.

### Storage

Não existe:

- dependência ou configuração de S3, R2, Azure Blob, GCS, Supabase Storage,
  Firebase ou Cloudinary;
- variável `AWS_*`, `S3_*`, `R2_*`, `BUCKET`, `BLOB` ou `STORAGE`;
- volume persistente ligado ao serviço web;
- adapter ou model de arquivo.

Existe um único storage persistente já configurado para o backend:
PostgreSQL/PostGIS, via `DATABASE_URL`. O `railway status` confirma o banco
`PostGIS 17` online com volume próprio. O volume pertence ao banco, não ao
container web.

### Email

Não existe:

- dependência de Resend, SendGrid, Postmark, Mailgun, SES ou SMTP;
- variável ou segredo de provedor de email no Railway;
- domínio remetente configurado no código;
- service, endpoint ou webhook de email.

As únicas variáveis externas do serviço são as já conhecidas de banco,
identidade e dados de mercado. Nenhuma é reutilizável como credencial de
email.

## Decisão 1 — storage em PostgreSQL

### Escolha

Os arquivos da V1 serão persistidos como `BYTEA` no novo model de submissão:

- documento de entrada (PDF ou imagem);
- relatório final (PDF, nullable até a entrega);
- metadata de nome, MIME type, tamanho e SHA-256 para cada lado.

### Por quê

1. É o único mecanismo persistente já configurado.
2. Não depende de credencial ou conta externa inexistente.
3. Preserva atomicidade entre metadata, status e bytes.
4. O recorte é deliberadamente pequeno: as primeiras cem análises.
5. Limites rígidos de tamanho impedem que o banco vire depósito sem teto.
6. A autorização continua no mesmo query por `user_id`, sem URL pública.

### Limite e custo aceito

`BYTEA` não é a escolha de escala para milhares de documentos grandes. Esta
decisão vale para a V1 manual e limitada. O endpoint aplicará limite
configurável, com default conservador, antes de gravar.

Uma futura migração para object storage pode manter o contrato HTTP e trocar
os bytes por object keys. Isso não justifica introduzir agora um provider sem
credencial, volume ou operação instalada.

### Por que disco local foi rejeitado

O container web do Railway não tem volume persistente. Gravar em path local
funcionaria em teste e perderia arquivos em restart/deploy — aparência de
storage sem durabilidade. Foi rejeitado.

## Decisão 2 — Resend por REST

### Escolha

Email transacional será enviado pela API REST do Resend:

```text
POST https://api.resend.com/emails
Authorization: Bearer <RESEND_API_KEY>
```

O backend usará `httpx`, já instalado, em vez de adicionar o SDK do Resend.
A documentação oficial confirma `from`, `to`, `subject` e `html`/`text`
como payload, além de `Idempotency-Key`.

### Por quê

1. Uma chamada HTTPS pequena cabe no stack atual.
2. Zero dependência nova de SDK.
3. Idempotency key permite retry sem email duplicado.
4. Suporta os dois eventos da V1 sem fila ou template engine externa.
5. Evita operar SMTP diretamente.

### Configuração necessária

- `RESEND_API_KEY`;
- `CLE_EMAIL_FROM` — remetente em domínio verificado;
- `CLE_OPERATOR_EMAIL` — destinatário das novas submissões e identidade
  autorizada a anexar o relatório;
- `CLE_APP_BASE_URL` — base dos links de revisão e resultado.

Nenhuma das quatro existe hoje no Railway. A implementação pode ser testada
contra transporte HTTP controlado, mas **envio externo real não pode ser
declarado verificado enquanto a chave e o domínio não forem configurados**.

O backend não cairá no import por configuração ausente. Os endpoints que
dependem de email responderão falha de configuração de forma explícita, em
vez de registrar submissão sem avisar o operador.

## Decisão 3 — anexo mínimo do PDF pelo operador

### Escolha

Endpoint multipart:

```text
POST /api/conta-luz-express/submissions/{submission_id}/deliverable
```

Contrato:

- autenticação normal por `get_current_user`;
- autorização adicional: `user.email == CLE_OPERATOR_EMAIL`;
- path param com a submissão;
- um arquivo PDF;
- validação de MIME, assinatura `%PDF-`, limite de tamanho e SHA-256;
- transição de status para `ready`;
- timestamp de entrega;
- envio do email ao dono da submissão;
- idempotência por hash: o mesmo PDF não cria nova entrega nem novo email;
- PDF diferente sobre submissão já entregue retorna conflito, em vez de
  substituir silenciosamente.

### Por quê

É o mecanismo menor que permite ao Aquiles concluir o ciclo sem criar:

- painel de admin;
- tabela de role;
- conta de operador paralela;
- worker;
- motor automático;
- storage externo.

O operador usa a própria conta da plataforma. O allowlist por email vem de
ambiente, não de string hardcoded. Um usuário comum nunca ganha capacidade
de anexar relatório apenas por conhecer o id da submissão.

### Link de revisão

O email de nova submissão apontará para o endpoint autenticado de detalhe da
submissão. O operador poderá baixar o arquivo original por endpoint
autorizado e anexar o PDF final por chamada multipart. A UI de admin fica
fora da V1.

## Modelo previsto para as fases seguintes

Um model irmão, `ContaLuzSubmission`, com:

- `id`;
- `user_id → users.id ON DELETE CASCADE`;
- status com conjunto fechado (`submitted`, `ready`);
- arquivo de entrada + metadata;
- PDF de saída nullable + metadata;
- timestamps de criação, atualização e entrega;
- timestamps/ids de notificação dos dois emails.

Não haverá FK, escrita ou metadata em `product_access`, `progress_event` ou
qualquer cache de progresso.

## Gate antes da implementação

As decisões acima foram tomadas só depois de confirmar que:

- não há provider escondido em dependência;
- não há credencial de storage/email no Railway;
- o container web não tem volume;
- o banco persistente existe;
- a API atual já tem autenticação e ownership por `user_id`;
- nenhum mecanismo de pagamento precisa ou pode entrar.

Fases 2–4 implementarão exatamente este recorte.

## Fase 2 — Modelo e upload

### Implementado

- `ContaLuzSubmission`, model irmão de `ProductAccess`, com FK
  `user_id → users.id ON DELETE CASCADE`;
- migration aditiva `0005_conta_luz_express`;
- storage `BYTEA` do documento de entrada e do PDF final nullable;
- status fechado em `submitted` / `ready`, com constraint que impede estado
  `ready` sem PDF completo;
- metadata de nome, MIME, tamanho e SHA-256 dos dois arquivos;
- campos de notificação preparados para a Fase 3;
- `POST /api/conta-luz-express/submissions`;
- `GET /api/conta-luz-express/submissions`;
- `GET /api/conta-luz-express/submissions/{id}`;
- `GET /api/conta-luz-express/submissions/{id}/source`.

O upload aceita PDF, JPEG, PNG e WebP por assinatura de arquivo, não só pelo
header declarado. Tipo incompatível retorna `415`, arquivo vazio `422` e
arquivo acima do limite `413`. O nome é reduzido ao basename e limpo de
caracteres de controle.

O endpoint exige o entitlement existente de `conta-de-luz-express`, mas só o
lê. Usuário sem ativação recebe `403`. Leituras de outra conta retornam
`404`, sem revelar que o id existe.

### Migration e smoke real

Migration aplicada no PostgreSQL de produção:

```text
0004_progress → 0005_conta_luz_express (head)
```

Smoke com conta descartável e PNG real de 1.456.260 bytes:

1. upload sem entitlement → `403`;
2. ativação pelo endpoint existente → `200`;
3. upload → `201`, status `submitted`, tamanho e hash persistidos;
4. listagem da conta → uma submissão;
5. detalhe da conta dona → `200`;
6. download → bytes idênticos ao arquivo de origem;
7. segunda conta tentando ler o id → `404`;
8. contas descartáveis removidas; cascata limpou acesso e submissão.

Nenhum arquivo de frontend, `product_access.py` ou tabela de progresso foi
modificado.

## Fase 3 — Email transacional nos dois sentidos

### Implementado

Service Resend por REST, usando `httpx` já instalado:

- email ao operador quando uma submissão nova chega;
- email ao usuário quando o relatório fica pronto;
- versões texto e HTML;
- escaping do conteúdo vindo do usuário;
- `reply_to` para o operador;
- `User-Agent` explícito;
- idempotency keys `cle-submission-{id}` e `cle-ready-{id}`;
- timeout e erros separados de configuração e entrega;
- ids do provider e timestamps reservados no model.

O email do operador inclui cliente, arquivo, id, link autenticado de detalhe
e link de download do original. O email do usuário aponta para a rota real
`/conta-de-luz-express` e para o download autenticado do PDF.

### Garantia no intake

O endpoint valida a configuração de email antes de ler o arquivo. A
submissão é enviada ao Resend dentro da transação, antes do commit:

- notificação aceita → id/timestamp persistidos e commit;
- provider falha → rollback e `502`;
- configuração ausente → `503`, sem submissão criada.

Isso evita aceitar silenciosamente uma conta de luz que o operador nunca
fica sabendo que chegou.

### Verificação

Transporte HTTP controlado exerceu os dois sentidos:

- dois destinatários corretos;
- duas idempotency keys corretas;
- HTML escapado;
- ids do provider capturados.

Smoke contra o banco de produção confirmou:

1. notificação do operador persistida junto da submissão;
2. falha forçada do provider retorna `502`;
3. a transação da segunda submissão é revertida;
4. a conta descartável foi removida ao fim.

**Limite honesto:** nenhuma credencial Resend existe no Railway. A integração
e o contrato HTTP estão testados; entrega em caixa postal externa continua
dependente de `RESEND_API_KEY`, remetente verificado e as quatro variáveis
documentadas na Fase 1.

## Fase 4 — Mecanismo de anexo do PDF pronto

### Implementado

```text
POST /api/conta-luz-express/submissions/{id}/deliverable
GET  /api/conta-luz-express/submissions/{id}/deliverable
```

O POST:

- exige sessão normal da plataforma;
- exige que o email da conta seja o `CLE_OPERATOR_EMAIL`;
- aceita somente PDF por MIME e assinatura `%PDF-`;
- aplica limite próprio de tamanho;
- grava bytes e metadata na submissão específica;
- muda `submitted → ready`;
- registra `delivered_at`;
- envia o email ao dono da submissão antes do commit;
- persiste provider id e timestamp da notificação.

Se o provider falha, a transação inteira é revertida: não existe estado
`ready` sem email. Reenvio do mesmo PDF, identificado por SHA-256, é
idempotente e não dispara novo email. Um PDF diferente sobre entrega já
fechada retorna `409`, sem substituição silenciosa.

O GET permite download apenas para o dono ou operador e devolve
`Cache-Control: private, no-store` e `X-Content-Type-Options: nosniff`.

### Verificação

Smoke contra PostgreSQL de produção com:

- PNG real de entrada: 1.456.260 bytes;
- PDF real de saída: 2.178.084 bytes.

Resultado:

1. cliente anexando relatório → `403`;
2. operador configurado anexando → `200`, status `ready`;
3. email do cliente chamado uma vez, no endereço correto;
4. listagem do perfil → `1 ready`, `0 submitted`;
5. download pelo cliente → bytes idênticos ao PDF original;
6. mesmo PDF novamente → idempotente, zero novo email;
7. PDF diferente → `409`;
8. contas e submissão descartáveis removidas por cascata.

Nenhum painel de admin, role nova, engine de análise ou mecanismo de
pagamento foi criado.

## Fase 5 — Verificação e fechamento

### Ciclo completo

Uma única execução atravessou o fluxo inteiro, sem substituir as funções de
email:

```text
upload → email Aquiles → leitura do original → anexo manual do PDF
→ email cliente → status ready no perfil → download do relatório
```

Ambiente do teste:

- PostgreSQL de produção;
- TestClient sobre a aplicação real;
- fronteira HTTP real do service Resend apontada para servidor controlado;
- PDF real de entrada: 2.178.084 bytes;
- PDF real de saída: 1.583.247 bytes;
- duas contas descartáveis.

Resultado:

```text
emails:                         2
submissões ready no perfil:     1
downloads byte-idênticos:       2
ids de provider persistidos:    2
idempotency keys conferidas:    2
```

Os payloads chegaram ao destinatário correto, com Bearer, User-Agent,
links e chaves de idempotência. A listagem da conta mostrou o relatório e o
download devolveu os mesmos bytes. As contas foram apagadas ao fim e a FK
em cascata removeu a submissão.

### Produção

- migration em `0005_conta_luz_express (head)`;
- serviço Railway online;
- `/health` → `ok`;
- OpenAPI publicado com os seis métodos da Conta de Luz Express;
- deploy importa com `python-multipart`;
- endpoint de upload em produção falha fechado com `503` enquanto a
  configuração de email está ausente, sem persistir submissão órfã.

O `alembic check` global ainda acusa drift histórico de PostGIS e índices de
waves anteriores. O metadata desta wave foi reconciliado com os dois índices
compostos da migration; uma segunda varredura devolveu **zero operação
pendente para `conta_luz_submission`**.

### Fronteiras auditadas

Diff dos commits de implementação e fechamento:

- zero mudança em `app/db/models/product_access.py`;
- zero mudança em `app/db/models/progress.py`;
- zero mudança em `app/services/progress_service.py`;
- zero mudança em `app/routers/progress.py`;
- zero arquivo de frontend;
- zero ocorrência de Stripe, Pagar.me, Iugu, checkout, PIX ou código de
  pagamento nos arquivos do backend desta wave.

O novo domínio referencia `users.id`, mas não escreve em entitlement nem
progresso.

### Único bloqueio operacional

A integração externa não pode ser declarada ativa porque o Railway segue
sem:

- `RESEND_API_KEY`;
- `CLE_EMAIL_FROM`;
- `CLE_OPERATOR_EMAIL`;
- `CLE_APP_BASE_URL`.

Para colocar intake em operação:

1. verificar o domínio remetente no Resend;
2. criar a chave;
3. definir as quatro variáveis no serviço `gridalpha-v2`;
4. redeploy;
5. executar um smoke com caixas postais reais nos dois sentidos.

Até isso acontecer, o backend recusa o upload com `503` em vez de prometer
uma notificação que não consegue enviar. A implementação está fechada; a
configuração de provider é o único passo externo restante.
