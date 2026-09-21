PENDÊNCIAS DE INFRA — DATABASE / VPS / DNS
Resolver em lote quando tiver ajuda. Não bloqueia build de feature.

── EMAIL TRANSACIONAL (Conta de Luz Express + Solar Proposal
   Validator — bloqueia só PRODUÇÃO, dev funciona sem isso)
  [ ] RESEND_API_KEY — conta no Resend + verificação do domínio
      nivar.com.br via registro DNS
  [ ] ADVISORY_OPERATOR_EMAIL — compartilhado entre os dois produtos
      Advisory com fluxo de envio (renomeado de CLE_OPERATOR_EMAIL)
  [ ] CLE_EMAIL_FROM — proposta: contato@nivar.com.br
  [ ] CLE_APP_BASE_URL — URL real de produção
  [ ] SPV_EMAIL_FROM
  [ ] SPV_APP_BASE_URL

── PERFORMANCE (FOUNDRY NIVAR Wave 1, não urgente)
  [ ] tokens/fonts.css importa Zilla Slab e Work Sans via @import —
      requisição externa bloqueante de render. Auto-hospedar .woff2
      quando der.

── QUANDO PAGAMENTO ENTRAR EM ESCOPO (ainda não decidido)
  [ ] Conta em processador (Stripe, ou Pix nativo tipo Pagar.me/Iugu)
      + chaves de API + webhook

── ROTEAMENTO /api/* EM PRODUÇÃO (ARCHITECT, Fase 1 — diagnóstico)
   Medido em 02/09/2026 contra nivar.com.br e contra o Railway.

  CAUSA: configuração, NÃO código.

  As três hipóteses do brief, testadas:

  1. "Existe vercel.json em main e não na branch atual?"
     FALSA. Não existe vercel.json em NENHUMA das duas branches.
     Comparado literalmente:
       git ls-files            | grep vercel  -> só scripts/_check_vercel.py
       git ls-tree -r origin/main | grep vercel -> só scripts/_check_vercel.py
     O arquivo nunca existiu. A troca de Production Branch não tirou
     nada — não havia o que tirar.

  2. "O Vercel está lendo o arquivo?"
     N/A — não há arquivo para ler.

  3. "Alguma mudança recente trocou para caminho relativo?"
     FALSA. O caminho relativo está lá desde o commit 22d3771
     (29/07/2026, ARCHITECT Identidade Wave 1) e é DELIBERADO, com a
     medição registrada no cabeçalho de src/lib/auth/authApi.ts: o
     cookie de sessão é SameSite=lax e NÃO viaja em fetch cross-site
     (provado na época — login 200, /me seguinte 401). Chamar o
     Railway por URL absoluta mataria a sessão.

  O QUE MUDOU foi a HOSPEDAGEM, não o código. O cabeçalho do authApi
  documenta a premissa: "prod — frontend e backend já dividem a origem
  no Railway". O frontend saiu para o Vercel em nivar.com.br; o Vercel
  não sabe o que é /api e responde com o 404 dele.

  Medições:
    curl https://gridalpha-v2-production.up.railway.app/api/auth/me
      -> 401 {"detail":"not authenticated"}   (backend de pé, URL certa)
    curl https://nivar.com.br/api/auth/me
      -> 404, Server: Vercel, X-Vercel-Error: NOT_FOUND
    bundle publicado (/assets/index-ClKWmVcq.js): usa /api/auth/login,
      /api/auth/logout, /api/auth/me, /api/auth/signup — relativos,
      idênticos ao código em disco. Nada foi trocado recentemente.

  POR QUE A CORREÇÃO NÃO PODE SER CÓDIGO: trocar os clientes para URL
  absoluta manda cookie SameSite=lax cross-site e derruba a sessão —
  exatamente a falha medida na Identidade Wave 1. Consertar pelo
  browser exigiria SESSION_COOKIE_SAMESITE=none no backend (app/), que
  está fora de posse. O rewrite do Vercel preserva a mesma origem do
  ponto de vista do browser, então o cookie continua funcionando.

  ACHADO SEGUNDO, NÃO PREVISTO NO BRIEF: o fallback de SPA TAMBÉM não
  existe. Toda rota de página responde 404 em carga direta — só "/"
  responde 200:
    /            200
    /br          404
    /entrar      404
    /criar-conta 404
    /conta       404
    /alexandria  404
    /diagnostico-energetico 404
  Mesmo arquivo resolve os dois. Sem isso a Fase 3 do brief é
  impossível: nivar.com.br/criar-conta nem carrega.

  ACHADO TERCEIRO: a variável VITE_BACKEND_URL no Vercel está setada
  SEM ESQUEMA — o bundle traz "//gridalpha-v2-production.up.railway.app"
  em vez de "https://...". Resolve por protocolo-relativo sobre https,
  então funciona hoje, mas é frágil. Afeta só os clientes de dado de
  mercado (services/api/client.ts, lib/backendBase.ts), não a
  identidade. Corrigir no painel do Vercel, não em código.
  [ ] VITE_BACKEND_URL — acrescentar "https:" no painel do Vercel

  FASE 3 BLOQUEADA — O VERCEL NÃO ESTÁ DEPLOYANDO A BRANCH
  A correção está commitada e pushada (vercel.json em afd4470, presente
  em origin/feature/full-shell-buildout, confirmado por git ls-tree),
  mas NÃO ESTÁ NO AR. Medido:

    · dois pushes feitos; nenhum deploy novo saiu
    · bundle servido continua /assets/index-ClKWmVcq.js
      Last-Modified: 02/09/2026 10:15:21 GMT, Age ~6h — anterior aos
      pushes
    · build local do mesmo commit gera index-37zdRyIP.js, hash
      diferente: a fonte mudou, o deploy é que não acompanhou
    · NÃO é o domínio: gridalpha.vercel.app serve exatamente o mesmo
      deploy velho (mesmo hash, mesmo Last-Modified) que
      nivar.com.br. O projeto inteiro parou de produzir deploy.
    · NÃO é build quebrado: `npm run build` (tsc -b && vite build)
      passa exit 0 em 26s na branch atual

  Só o painel do Vercel resolve. Verificar, nesta ordem:
    [ ] Settings > Git — o projeto está conectado a ESTE repositório?
    [ ] Settings > Git > Production Branch — está mesmo em
        feature/full-shell-buildout e foi salvo?
    [ ] Deployments — existe deploy com status Error/Canceled depois
        das 10:15 GMT de 02/09? (se sim, o log diz o motivo)
    [ ] Settings > Git > Ignored Build Step — está vazio?
    [ ] A integração Git não foi desconectada / não está pausada?

  Quando um deploy novo sair, a verificação de ponta a ponta é:
    curl -s -o /dev/null -w "%{http_code}" https://nivar.com.br/entrar
      -> tem que virar 200 (hoje 404)
    curl -s https://nivar.com.br/api/auth/me
      -> tem que virar 401 {"detail":"not authenticated"} (hoje 404 do
         Vercel), que é a resposta REAL do backend atravessando o
         rewrite
  Só depois disso faz sentido criar conta em nivar.com.br/criar-conta.

── CONTA DE LUZ EXPRESS — ENVIO DE FATURA AINDA RECUSADO (aberto)
   Registrado pela ARCHITECT, Método Wave 1, Fase 5. NÃO investigado
   nesta wave — só registrado.

  Sintoma: enviar uma fatura em produção devolve "O recebimento de
  faturas ainda não está ligado neste ambiente". Essa é a mensagem que
  o frontend mostra para um 503 do backend.

  DIAGNÓSTICO NÃO FEITO. O teste de Network nunca rodou depois de as
  seis variáveis serem coladas no Railway, então nada abaixo é
  medição — é hipótese.

  Hipótese mais provável: o serviço no Railway não reiniciou de
  verdade depois de as variáveis serem coladas, e o container em pé
  ainda é o que subiu sem elas. O guard que produz esse 503 lê a
  variável no momento da requisição a partir do ambiente do processo,
  então variável colada no painel sem redeploy não alcança o processo
  antigo.

  Como confirmar, quando for a hora (nesta ordem):
    1. Abrir a aba Network e enviar uma fatura. Ler o STATUS e o corpo
       do POST /api/conta-luz-express/submissions — o `detail` do 503
       nomeia qual variável está faltando.
    2. Se o detail nomear uma variável que você sabe que está colada:
       é o container velho. Force um redeploy no Railway.
    3. Se o detail nomear outra variável: falta essa mesma.
    4. Se não for 503: a hipótese está errada e o diagnóstico começa
       do zero, pelo status real.

  As seis variáveis do fluxo: RESEND_API_KEY, ADVISORY_OPERATOR_EMAIL,
  CLE_EMAIL_FROM, CLE_APP_BASE_URL, SPV_EMAIL_FROM, SPV_APP_BASE_URL.
