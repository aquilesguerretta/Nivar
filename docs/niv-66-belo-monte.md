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

Abra `/br/terminal`, selecione **Ativos** e inspecione uma unidade de cada casa de força. O link para `/br/mapa-corporativo` preserva a identidade selecionada e a data de corte. A lista de snapshots aprovados vem da configuração do servidor. A data da captura indica quando o ARGOS conheceu o registro. A data de publicação do CSV permanece desconhecida.

## Verificação

Para os testes de integração, use um segundo banco descartável chamado `niv66_test`, faça a migração e importe o mesmo original. Configure `NIV66_ORIGINAL_CSV` com o caminho absoluto e `NIV66_REAL_SNAPSHOT` com o ID devolvido pelo importador nesse banco.

```powershell
python -m pytest tests/argos_memory/test_belo_monte.py -q
node --experimental-strip-types --test tests/terminal-brasil/analysis.test.ts tests/argos-signal-inspection/read-model.test.ts
npm run build
```

Execute o restante de `tests/argos_memory` em outro banco descartável vazio. Suítes de regressão fazem downgrade do esquema.

O teste de replay guarda as versões sintéticas em um namespace de teste e demonstra 100,00 → 99,50 MW com a mesma identidade. Registra mudanças de bytes e de conteúdo separadamente. A demonstração real tem uma captura aprovada. Ainda não há uma correção do publicador comprovada para este recorte.

O registro `NIV7-EXT-ONS-OPEN-DATA-2026-09-16` sustenta o arquivo privado e a inspeção humana com atribuição no ambiente local. A rota exige sessão de navegador de operador. Documentos de terceiros são exibidos por metadados e links oficiais. A liberação para produção, os direitos de exibição externa e redistribuição, a revisão independente de segurança e o teste com analista seguem pendentes.
