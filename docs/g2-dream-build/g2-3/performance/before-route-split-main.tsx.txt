import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import GlobalShell from './components/GlobalShell';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupGate } from './pages/auth/SignupGate';
import { SignupProfilePage } from './pages/auth/SignupProfilePage';
import { SignupDetailsPage } from './pages/auth/SignupDetailsPage';
import { SignupSuccessPage } from './pages/auth/SignupSuccessPage';
import { AuthLayout } from './components/editorial/AuthLayout';
import { AlexandriaHome } from './pages/alexandria/AlexandriaHome';
import { PortalBR } from './pages/br/PortalBR';
import { PortalBRRouter } from './pages/br/PortalBRRouter';
import { NotFound } from './pages/NotFound';
import { AuthProvider } from './lib/auth/AuthContext';
import { EntrarView } from './pages/conta/EntrarView';
import { CriarContaView } from './pages/conta/CriarContaView';
import { PerfilPlataforma } from './pages/conta/PerfilPlataforma';
import { ContaDeLuzExpressPage } from './pages/conta-de-luz-express/ContaDeLuzExpressPage';
import { SolarProposalValidatorPage } from './pages/solar-proposal-validator/SolarProposalValidatorPage';
import { DiagnosticoEnergeticoPage } from './pages/diagnostico-energetico/DiagnosticoEnergeticoPage';
import { OperadorRouter } from './pages/operador/OperadorRouter';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Identidade de plataforma envolve a árvore INTEIRA — uma conta
          por pessoa, lida do mesmo lugar por Portal Brasil, Alexandria
          e o futuro terminal americano. Nenhum produto guarda estado de
          login próprio. `/alexandria/*` está dentro de propósito, mesmo
          que ainda não consuma: o contexto existe antes do consumidor,
          e a wave do LYCEUM só precisa chamar useAuth(). */}
      <AuthProvider>
        <Routes>
          {/* A raiz serve o PORTAL BRASIL. O lado americano continua
              inteiro no disco e não foi tocado — só deixou de ser
              alcançável por navegação: a única porta é digitar `/us`.
              A inversão é de rota, não de código (Topologia de Shell
              Wave 2; a auditoria que a mapeou está em
              `docs/architect-shell-topology-audit.md`). */}
          <Route path="/" element={<PortalBR />} />

          {/* Fluxo de arquétipo do terminal americano — escolhe QUAL
              TERMINAL você vê (trader / analyst / storage / …), não QUEM
              você é. Fica atrás de `/us` junto com o resto do lado
              americano: só se chega aqui a partir da landing, que já não
              é alcançável por navegação. A identidade vem antes dele:

              `/signup` deixou de ser formulário e virou SignupGate —
              sem sessão manda para /criar-conta e volta; com sessão
              segue para a escolha de arquétipo. As três telas de
              arquétipo abaixo estão INTOCADAS.

              `/login` continua sendo o legado que valida formato e
              navega para /nest sem chamar API. Não é mais alcançável
              pelo header da landing (Sign in aponta para /entrar), mas
              a rota fica de pé para não quebrar link antigo.

              VARREDURA DE PORTA (Topologia de Shell Wave 2, fase 3).
              Confirmado por busca em todo o `src/`, não por leitura
              deste arquivo:

              · os únicos links para `/signup` fora de `pages/auth/`
                são `landing/Nav.tsx:101` e `landing/FinalCta.tsx:55`
                — ambos DENTRO da landing, hoje só em `/us`;
              · nada em `pages/br/`, `components/br/`, `pages/conta/`
                nem `components/alexandria/` aponta para `/login`,
                `/signup*`, `/nest`, `/atlas`, `/peregrine`,
                `/analytics` ou `/vault*`;
              · nenhuma navegação imperativa (`window.location =`,
                `location.assign`) fora do subtree americano;
              · nenhum redirect de plataforma — não há `vercel.json`,
                `netlify.toml`, `public/_redirects` nem rewrite no
                `vite.config.ts`;
              · `SignupCredentialsPage` tem `to="/login"` mas não é
                roteado em lugar nenhum — órfão desde a Identidade
                Wave 1, sobrevive só porque exporta `ProgressDots`.

              As referências a rota americana em `services/aiContext.ts`,
              `services/viewSerialization.ts` e
              `services/contextProviders/vaultContext.ts` LEEM o
              pathname para classificar contexto; não navegam. */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupGate />} />
            <Route path="/signup/profile" element={<SignupProfilePage />} />
            <Route path="/signup/details" element={<SignupDetailsPage />} />
            <Route path="/signup/success" element={<SignupSuccessPage />} />
          </Route>

          {/* Identidade de plataforma (Endpoints 16-21 do backend).
              Nomes em português: são superfícies da plataforma, cuja
              face pública hoje é brasileira. Sem colisão com o fluxo
              legado acima — auditado na Fase 1. */}
          <Route path="/entrar" element={<EntrarView />} />
          <Route path="/criar-conta" element={<CriarContaView />} />
          {/* Protegida — o próprio componente redireciona para /entrar
              quando não há sessão, depois de `loading` resolver. */}
          <Route path="/conta" element={<PerfilPlataforma />} />

          <Route path="/nest" element={<GlobalShell initialView="nest" />} />
          <Route path="/atlas" element={<GlobalShell initialView="atlas" />} />
          <Route path="/peregrine" element={<GlobalShell initialView="peregrine" />} />
          <Route path="/analytics" element={<GlobalShell initialView="analytics" />} />
          <Route path="/vault" element={<GlobalShell initialView="vault" />} />
          {/* Vault sub-routes — same shell; the Vault component reads
              useParams() to switch between VaultIndex / Alexandria /
              CaseStudyView. ATLAS owns that internal routing. */}
          <Route path="/vault/alexandria" element={<GlobalShell initialView="vault" />} />
          <Route path="/vault/alexandria/lesson/:lessonId" element={<GlobalShell initialView="vault" />} />
          <Route path="/vault/alexandria/entry/:entrySlug" element={<GlobalShell initialView="vault" />} />
          <Route path="/vault/:id" element={<GlobalShell initialView="vault" />} />

          <Route path="/alexandria/*" element={<AlexandriaHome />} />

          {/* Conta de Luz Express (Wave 2) — rota de TOPO, no precedente
              exato da Alexandria logo acima: a página de família aponta
              para o produto, nunca o hospeda (recon, §5 Opção A). Rota
              RASA de propósito — o fluxo v1 é uma tela só (intake +
              confirmação como estados); vira splat quando houver
              segunda superfície. */}
          <Route path="/conta-de-luz-express" element={<ContaDeLuzExpressPage />} />

          {/* Solar Proposal Validator (Wave 2) — mesma decisão de rota
              da CLE acima. A página roda em DEMONSTRAÇÃO e o produto
              segue 'em-breve' no catálogo (registrado, não ativado):
              a rota existe para a superfície ser real e verificável;
              nenhum link público aponta para cá até o produto abrir. */}
          <Route path="/solar-proposal-validator" element={<SolarProposalValidatorPage />} />

          {/* Diagnóstico Energético (Wave 2) — rota de TOPO, no mesmo
              precedente dos dois produtos Advisory acima. A página roda
              em DEMONSTRAÇÃO: o catálogo mantém `status: 'em-breve'` e
              `rota: null`, então a família mostra "Em construção" sem
              link. A rota existe para a página ser alcançável e
              testável, como a Solar já fez. */}
          <Route path="/diagnostico-energetico" element={<DiagnosticoEnergeticoPage />} />

          {/* Portais de mercado. Mercado é segmento de URL, não estado em
              store: link compartilhável, bookmark funciona, sem hidratação.
              `/alexandria` fica fora do prefixo de propósito — tem trilhas
              universal / brasil / usa, então pertence aos dois portais.

              `/br` continua existindo como endereço canônico do portal —
              a raiz serve o mesmo componente, e os links internos que já
              apontam para `/br` seguem válidos.

              `/us` MONTA a landing americana, e não redireciona. Era
              `<Navigate to="/" replace />` quando a raiz era a landing;
              agora que a raiz é o Portal, redirecionar deixaria o lado
              americano INALCANÇÁVEL em vez de oculto — o oposto do
              pedido. Esta rota é a única porta que resta para ele. */}
          {/* Wave 8: `/br` deixa de ser rota RASA e vira splat, no
              padrão que `/alexandria/*` já usava — o `index` do
              PortalBRRouter continua servindo o Portal, e
              `familia/:familiaId` abre a página da família. Link
              antigo para `/br` segue válido, sem redirecionamento. */}
          <Route path="/br/*" element={<PortalBRRouter />} />
          <Route path="/us" element={<LandingPage />} />

          {/* Console do operador (Portal do Operador Wave 2) — a
              superfície interna onde os pedidos que chegam dos produtos
              Advisory são trabalhados. SPLAT, não rota rasa: o console é
              hierarquia real (fila → produto → pedido), ao contrário dos
              três produtos acima, cujo fluxo v1 cabe numa tela só. Mesmo
              padrão de `/br/*` e `/alexandria/*` — o `OperadorRouter`
              declara as próprias rotas e tem catch-all próprio,
              devolvendo o mesmo `NotFound` desta árvore.

              SEM GATE, e é deliberado nesta wave: `PlatformUser` não
              carrega papel, e o gate real do backend é por env
              (`ADVISORY_OPERATOR_EMAIL`), que o front não conhece nem
              pode replicar — um gate por e-mail no cliente daria a
              aparência da proteção sem a substância, porque a recusa
              real é do endpoint, não da tela. A rota é alcançável por
              endereço digitado, e o console DECLARA isso numa tarja no
              topo. O gate entra na wave de ligação, junto com o
              endpoint de fila. Medido em
              `docs/operador-recon-frontend.md` §1.3 e no adendo. */}
          <Route path="/operador/*" element={<OperadorRouter />} />

          {/* Endereço desconhecido devolve um 404 REAL (Portal Debt
              Wave 1). Até aqui caía na home brasileira em silêncio —
              200 com o Portal —, e endereço errado ficava
              indistinguível de endereço certo. O caminho pedido aparece
              na tela, que é o único dado que um 404 de rota tem.

              O catch-all da Alexandria (`AlexandriaRouter.tsx`) NÃO foi
              tocado: é posse do LYCEUM e a superfície fala navy sobre
              pergaminho. Pendência registrada em
              `docs/pendencias-alexandria.md` §4. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
