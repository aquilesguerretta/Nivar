# NIV-66 · Inspeção local de Belo Monte

O Terminal Brasil e o Brazil Corporate Energy Map usam a mesma composição do Argos Memory. A identidade do empreendimento vem do CEG da ANEEL. Cada unidade exige o código de equipamento verificado e uma linha coerente com CEG, casa de força e número operacional.

## Evidência de 17 de novembro de 2026

- Captura informada em `2026-11-17T17:40:18.1382312Z`, confirmada pelo SHA-256 `6fb41c0c76632addaa0338ab7eee319cfc1730df22508f3eee2afba6fbddfda2` e pelo tamanho de 1.318.263 bytes.
- CSV UTF-8 de 18 campos, sem `id_ons`. O parser existente leu 5.837 linhas. O código de equipamento e o número operacional têm espaços de preenchimento removidos pelo parser. Os bytes originais permanecem no Argos Memory.
- Os 5.837 códigos de equipamento são distintos nesta versão. Há 19 grupos de colisão por CEG e número operacional, seis deles no complexo de Belo Monte.
- `PABM--0UG01` a `PABM--0UG18` representam Belo Monte. `PAPI--0UG01` a `PAPI--0UG06` representam Pimental. A soma das potências nominais por unidade é 11.233,08 MW. A estabilidade de cada código em novas versões depende de evidência.

O recorte tem 24 códigos distintos sem colisões com outras linhas do CSV. Nenhum dos 5.837 registros tem CEG, código de equipamento ou número operacional em branco. O único campo em branco no recorte é a data de desativação, nas 24 linhas. O comprimento dos códigos limpos varia entre 8 e 11 caracteres no arquivo completo.

Cabeçalho verificado

```text
id_subsistema;nom_subsistema;id_estado;nom_estado;nom_modalidadeoperacao;nom_agenteproprietario;nom_agenteoperador;nom_tipousina;nom_usina;ceg;nom_unidadegeradora;cod_equipamento;num_unidadegeradora;nom_combustivel;dat_entradateste;dat_entradaoperacao;dat_desativacao;val_potenciaefetiva
```

## Rodar a demonstração

Use PostgreSQL com PostGIS, restrito a `127.0.0.1`, e um banco descartável chamado `niv66_demo`. Configure `DATABASE_URL` para esse banco. Instale as dependências Python e npm conforme os arquivos do repositório. Em PowerShell, a partir da raiz:

```powershell
python -m alembic upgrade head
$snapshot = python -m app.scripts.import_argos_belo_monte (Join-Path $env:USERPROFILE 'Downloads/CAPACIDADE_GERACAO.csv')
$env:ARGOS_BELO_MONTE_SNAPSHOTS = ConvertTo-Json -InputObject @($snapshot) -Compress
$env:ARGOS_BELO_MONTE_DEV = '1'
$env:SESSION_COOKIE_SECURE = 'false'  # Demonstração HTTP em loopback
python -m uvicorn app.main:app --host 127.0.0.1 --port 8616 --lifespan off
```

Configure `JWT_SECRET` com um segredo local novo e `ADVISORY_OPERATOR_EMAIL` com a conta de revisão local antes de iniciar o backend. Acesse a conta em `/conta` pelo frontend e crie a sessão no banco descartável. Em outro terminal:

```powershell
$env:VITE_BACKEND_URL = 'http://127.0.0.1:8616'
$env:VITE_ARGOS_BELO_MONTE_DEV = '1'
npm run dev -- --host 127.0.0.1 --port 5166 --strictPort
```

Abra `/br/terminal`, selecione **Ativos** e inspecione uma unidade de cada casa de força. O link para `/br/mapa-corporativo` preserva a identidade, a versão e a data de corte quando comprovada. A versão atual é a sucessora mais recente entre os snapshots aprovados, seguindo a linhagem do Argos Memory. A data de captura registra a aquisição e a data de publicação do CSV permanece desconhecida.

O histórico reconstrói quais dos snapshots hoje aprovados já estavam persistidos na data de corte. A prova é o horário de commit da linha imutável no PostgreSQL. No cluster descartável, habilite `track_commit_timestamp = on` antes de capturar as versões usadas no replay. A configuração não retroage. Se o horário não foi registrado, expirou ou conflita com os demais tempos, o histórico retorna um estado desconhecido quando a lacuna impede a seleção. A navegação na versão atual ainda preserva a referência exata e bloqueia substituição silenciosa se a versão mudar durante a troca de tela.

O extrato republicado do Contrato de Concessão nº 01/2010-MME no DOU de 31 de agosto de 2010, seção 3, p. 96, documenta a outorga original e sua vigência a partir de 26 de agosto. A Portaria MME 876/2010 documenta o enquadramento no REIDI como contexto complementar. A identidade do empreendimento continua ancorada no CEG da ANEEL. [Extrato oficial](https://www.gov.br/mme/pt-br/arquivos/do-31-08-2010-s3.pdf#page=96) · [Portaria MME](https://www.gov.br/mme/pt-br/arquivos/portaria-876-de-04-11-2010-publicado-no-dou-de-08-11-2010.pdf)

## Verificação

Para os testes de integração, use um segundo banco descartável chamado `niv66_test`, faça a migração e importe o mesmo original. Configure `NIV66_ORIGINAL_CSV` com o caminho absoluto e `NIV66_REAL_SNAPSHOT` com o ID devolvido pelo importador nesse banco.

```powershell
python -m pytest tests/argos_memory/test_belo_monte.py -q
node --experimental-strip-types --test tests/terminal-brasil/analysis.test.ts tests/argos-signal-inspection/read-model.test.ts
npm run build
```

Execute o restante de `tests/argos_memory` em outro banco descartável vazio. Suítes de regressão fazem downgrade do esquema.

```powershell
python -m pytest tests/argos_memory --ignore=tests/argos_memory/test_belo_monte.py -q
```

O replay confirma as duas versões com horário de aquisição fora da ordem de persistência. Os testes separam a alteração de bytes, a alteração no conjunto ONS e a alteração nos registros deste CEG. Os valores sintéticos de 100,00 → 99,50 MW ficam em um namespace de teste. A demonstração usa uma captura real aprovada. Ainda não há uma correção do publicador comprovada para este recorte.

### Regressão em Chromium

Use o banco descartável `niv66_test` migrado, com o registro de commits habilitado. Escolha um endereço de e-mail descartável novo e configure `NIV66_BROWSER_OPERATOR` com o mesmo valor no servidor e no executor do teste. O servidor abaixo cria snapshots em um namespace sintético e usa a autenticação normal do aplicativo.

```powershell
python -m tests.argos_memory.belo_monte_browser_fixture
```

Em outro terminal:

```powershell
$env:VITE_BACKEND_URL = 'http://127.0.0.1:8617'
$env:VITE_ARGOS_BELO_MONTE_DEV = '1'
npm run dev -- --host 127.0.0.1 --port 5167 --strictPort
```

No executor, configure `RUNTIME_NODE_MODULES` com o caminho absoluto da instalação de Playwright usada nos testes de navegador do repositório. Defina `NIV66_BROWSER_CHROME` se usar um Chrome local em vez do Chromium do Playwright.

```powershell
node --test tests/argos_memory/browser_belo_monte.mjs
```

Para repetir a navegação e o logout com o snapshot ONS original, reinicie o servidor de teste com `NIV66_BROWSER_REAL_SNAPSHOT` igual ao ID da importação no banco descartável. Use outro e-mail descartável e execute o mesmo comando com `NIV66_BROWSER_REAL=1` no executor. O replay com várias datas e o bloqueio de unidade ambígua são exercitados no modo sintético.

O registro `NIV7-EXT-ONS-OPEN-DATA-2026-09-16` sustenta o arquivo privado e a inspeção humana com atribuição no ambiente local. A rota exige sessão de navegador de operador. Documentos de terceiros são exibidos por metadados e links oficiais. A liberação para produção, os direitos de exibição externa e redistribuição, a revisão independente de segurança e o teste com analista seguem pendentes.
