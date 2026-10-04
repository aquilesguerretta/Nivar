# Conta de Luz Express — recon de dado para marcação manual

**Status:** reconhecimento concluído. Zero model, migration, endpoint,
dependência ou código de marcação criado.

**Autor:** CURSOR. **Data:** 23 de agosto de 2026.

## Numeração

Esta é **CURSOR — Conta de Luz Express Wave 3**.

O `CLAUDE.md` hoje registra duas seções do produto, ambas namespaced pelo
outro agente:

- `ARCHITECT — CONTA DE LUZ EXPRESS WAVE 2 · UI COM DADO MOCK`;
- `ARCHITECT — CONTA DE LUZ EXPRESS WAVE 3 · LIGAR UI REAL AO BACKEND REAL`.

Ele ainda não registra as seções CURSOR da recon e do backend. A sequência
CURSOR, porém, é comprovada por artefatos e histórico:

- Wave 1: `docs/conta-luz-express-recon-backend.md`, commits `ecf6e6f` e
  `e298a43`;
- Wave 2: `docs/conta-luz-express-wave-2-backend.md`, fechada no commit
  `8f1dab0`, com os quatro commits de fase anteriores.

A numeração é por trilha/agente, como no restante do `CLAUDE.md`; a existência
de uma ARCHITECT Wave 3 não transforma a próxima wave CURSOR em Wave 4.
Portanto o N pedido bate com o registro real disponível: **3**.

## Escopo lido

A varredura cobriu:

- todos os models e migrations em `app/db/`;
- services e routers em `app/`;
- model, storage e router da Conta de Luz Express;
- models, router e service de progresso, somente como precedente;
- nomes das variáveis atuais do serviço Railway, sem imprimir valores.

Ausência abaixo significa ausência no backend versionado e, quando
explicitado, na configuração de produção.

## Resultado executivo

| Hipótese | Achado |
| --- | --- |
| JSON estruturado anexado a registro | Existe um único precedente parcial: `progress_event.metadata` em JSONB solto. Não existe array tipado de objetos de domínio persistido |
| PDF × imagem no storage | O formato é distinguido e persistido por MIME detectado; geometria/página não é |
| Escrita privilegiada do Aquiles | Existe no router da Conta de Luz Express, por allowlist de email em ambiente; não existe role/admin genérico |

## 1. JSON estruturado anexado a registro

### O que existe

O único `JSONB` da árvore é:

```text
progress_event.metadata
```

Contrato real:

- model: `event_metadata: Mapped[dict | None]`;
- request: `metadata: dict | None`;
- coluna: `JSONB`, nullable;
- propósito declarado: contexto solto de evento pedagógico;
- nenhum schema interno;
- nenhuma validação por tipo de evento;
- nenhuma indexação GIN ou consulta por chave interna.

O tipo HTTP exige **objeto no topo**, não array. Um objeto pode conter arrays
aninhados porque o conteúdo é livre, mas não existe ocorrência real nem
contrato de array de objetos.

### O que não existe

Não há:

- `Mapped[list[...]]` persistido;
- coluna JSON/JSONB de submissão;
- array tipado de coordenadas;
- schema Pydantic de elemento de marcação;
- versão do formato JSON;
- leitura, patch ou query de objetos internos de JSONB.

O endpoint `GET /api/progress/me` não devolve `progress_event.metadata`.
Ele retorna apenas ids de aula, badges e streak. Portanto o precedente prova
que o projeto aceita **metadata opaca em JSONB**, mas não prova ciclo de
escrita/leitura de estrutura rica.

`FIELD_DEFINITIONS: list[dict[str, str]]` em `country_energy.py` não é
precedente de persistência: é constante Python em código; os dados reais são
normalizados em colunas/tabela.

### Como o restante do backend modela domínio

Os fatos com identidade própria são normalizados:

- `product_access` — uma linha por usuário/produto;
- progresso — evento, status de aula, badge e streak em tabelas próprias;
- infraestrutura — geração, transmissão e bateria em tabelas próprias;
- Conta de Luz Express — uma linha por submissão, com metadata e bytes em
  colunas explícitas.

### Implicação para marcação

**Não existe precedente forte para “um array de marcações em um campo
JSONB”.** Existe somente permissão arquitetural para metadata solta.

Se o próximo brief escolher um campo JSONB, será uma decisão nova de domínio,
não simples continuação de padrão já estabelecido. Precisará definir no
próprio contrato:

- shape de cada marca;
- versão;
- substituição atômica versus edição parcial;
- auditoria de quem marcou e quando;
- validação de coordenadas.

Se cada marca precisar de identidade, revisão, exclusão individual, histórico
ou consulta, o precedente predominante do repositório aponta para **tabela
nova relacionada à submissão**. Esta recon não escolhe entre as duas formas;
registra que “JSONB já existe” é verdade apenas no sentido mais fraco.

## 2. PDF e imagem no storage

### O formato é distinguido

`read_source_upload` aceita e detecta quatro formatos por assinatura real:

| Assinatura | MIME persistido |
| --- | --- |
| `%PDF-` | `application/pdf` |
| `FF D8 FF` | `image/jpeg` |
| assinatura PNG | `image/png` |
| `RIFF....WEBP` | `image/webp` |

O MIME declarado pelo cliente só é aceito se for genérico ou casar com a
assinatura. O valor detectado vira
`conta_luz_submission.source_content_type` e aparece como
`source.contentType` no payload da API.

Logo, o backend consegue decidir sem ambiguidade se uma submissão é PDF ou
imagem. Não depende da extensão do nome.

### O que não é persistido

O storage guarda:

- filename;
- content type;
- size;
- SHA-256;
- bytes.

Não guarda:

- quantidade de páginas do PDF;
- página renderizada ou thumbnails;
- largura e altura da imagem;
- DPI;
- orientação EXIF;
- rotação de página;
- MediaBox/CropBox do PDF;
- versão de um sistema de coordenadas.

Não há parser de PDF nem biblioteca de imagem no caminho de intake. Os bytes
são validados só pela assinatura inicial e persistidos integralmente.

### Implicação para coordenadas

O `contentType` atual já permite contrato discriminado:

- imagem — um único plano, sem `page`;
- PDF — coordenada precisa de `page` explícita.

Mas coordenada x/y sozinha ainda não é reproduzível. O próximo brief precisa
declarar a base, por exemplo coordenadas normalizadas `0..1` relativas à
página/imagem, porque o backend hoje não conhece pixels, pontos PDF,
dimensões nem zoom.

Para PDF, `page` não pode ser inferida do storage atual. Para imagem,
`page = null` ou ausência do campo precisa ser uma regra explícita, não um
efeito acidental.

## 3. Escrita privilegiada

### Existe um precedente específico e funcional

O router `app/routers/conta_luz.py` já tem:

```text
_require_operator(user)
```

Comportamento:

1. lê `CLE_OPERATOR_EMAIL`;
2. se não estiver configurado, responde `503`;
3. compara o email autenticado da plataforma;
4. conta diferente recebe `403`;
5. a conta permitida pode anexar o PDF final a qualquer submissão pelo id.

O endpoint que usa esse gate é:

```text
POST /api/conta-luz-express/submissions/{id}/deliverable
```

Ele é distinto da ação de usuário comum: o cliente pode criar e ler as
próprias submissões; só o operador pode escrever o entregável.

O mesmo email também amplia leitura: `_is_operator` permite ao operador ver
detalhe e arquivo de uma submissão que pertence a outro `user_id`. Para
clientes comuns, tentativa equivalente retorna `404`, sem enumerar ids.

### Limites do precedente

Não existe:

- coluna de role no `User`;
- tabela de admin/staff;
- claim de role no JWT;
- middleware genérico de autorização privilegiada;
- allowlist com múltiplos operadores;
- auditoria genérica de ação administrativa.

O mecanismo é local ao router da Conta de Luz Express e autoriza exatamente
uma identidade por email de ambiente. Reutilizá-lo para marcação dentro do
mesmo produto é continuidade direta do precedente; tratá-lo como sistema de
admin de plataforma seria exagero.

### Estado de produção

A varredura dos nomes de variável do Railway devolveu:

```text
NO_CLE_OR_RESEND_VARIABLES
```

Portanto o gate existe no código, mas **não está operacional em produção**:
`CLE_OPERATOR_EMAIL` continua ausente. Hoje uma escrita privilegiada chama o
gate e recebe `503`; nenhuma conta é reconhecida como operador.

### Implicação para marcação manual

O próximo endpoint de marcação não precisa inventar autorização paralela.
Pode usar o mesmo princípio:

- sessão normal;
- `_require_operator`;
- submissão identificada por UUID;
- cliente sem permissão recebe `403`;
- ausência de configuração recebe `503`.

Se o helper continuar privado no router, usá-lo em outro módulo exigirá
extração para service de acesso ou manter o endpoint no mesmo router. Essa é
uma decisão de organização de código, não lacuna de capacidade.

Também será necessário registrar **quem** marcou e **quando** se a marcação
precisar de auditoria. O gate atual prova autorização, mas o model da
submissão não guarda `marked_by` nem timestamp de marcação.

## Conclusão para o próximo brief

Fatos que podem ser assumidos:

1. o formato de origem é conhecido e exposto como MIME detectado;
2. PDF e imagem podem ter contratos discriminados;
3. já existe escrita exclusiva do operador no domínio;
4. FK/ownership por usuário e submissão já estão funcionando.

Fatos que **não** podem ser assumidos:

1. array tipado em JSONB como convenção estabelecida;
2. page count ou dimensões já extraídos;
3. sistema de coordenadas existente;
4. roles/admin genéricos;
5. operador configurado em produção;
6. auditoria de marcação pronta.

Esta wave não escolhe schema nem implementa marcação. Ela fecha o terreno:
há suporte de formato e autorização para construir em cima, mas a estrutura
das marcas e sua geometria ainda são contratos novos.
