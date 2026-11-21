// src/lib/submissoes — ARCHITECT, Solar Proposal Validator Wave 2 · Fase 2.
//
// O contrato de SUBMISSÃO COM PARECER, extraído para fora do arquivo de
// componente. A Conta de Luz Express Wave 3 registrou por escrito que o
// cliente e os tipos moravam em `ContaDeLuzExpressPage.tsx` porque
// aquela wave não tinha posse para criar `src/lib/` — e que mover era
// pendência. O gatilho previsto chegou: o Solar Proposal Validator é o
// segundo produto com EXATAMENTE a mesma forma de contrato, confirmada
// por leitura do router real (`app/routers/solar_proposal.py`, CURSOR
// Wave 2): `POST /submissions` multipart campo `file` → 201 ·
// `GET /submissions` → `{ data, summary }` mais recente primeiro ·
// lifecycle `submitted`/`ready` · `deliverable` com `downloadUrl`
// relativo. Campo a campo o mesmo `_submission_payload` do de CLE.
//
// O QUE MUDOU NO TIPO: `Submissao.productId` ALARGOU de literal
// (`'conta-de-luz-express'`) para `string` — era o tipo literal que
// prendia o contrato a um produto (recon §4.2). O resto é byte-idêntico
// ao que a página de CLE declara.
//
// A PÁGINA DE CLE NÃO FOI TOCADA: ela segue com a cópia própria do
// cliente (é SOMENTE LEITURA nesta wave, e a lógica de envio dela é
// NUNCA MODIFICAR). A partir desta fase, o CANÔNICO é este arquivo —
// quem abrir a página de CLE numa wave com posse dela troca os tipos
// locais por estes imports e apaga a duplicação.

import { AuthError } from '../auth/authApi';

// ─── Tipos do contrato ───────────────────────────────────────────────

export interface ArquivoSubmissao {
  filename: string;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  /** Relativo — `{prefixo}/submissions/{id}/{source|deliverable}`. */
  downloadUrl: string;
}

export interface Submissao {
  id: string;
  /** Alargado de literal para `string` — o contrato serve N produtos. */
  productId: string;
  /** Os DOIS estados do backend. "Nada enviado" não é status: é lista vazia. */
  status: 'submitted' | 'ready';
  source: ArquivoSubmissao;
  /** Só com `status === 'ready'`; já traz o `downloadUrl` do PDF final. */
  deliverable: ArquivoSubmissao | null;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
}

export interface ListaSubmissoes {
  data: Submissao[];
  summary: { count: number; submitted: number; ready: number };
}

// ─── Cliente parametrizado pelo prefixo ──────────────────────────────

/** Lê `{"detail": "..."}` do backend e devolve `AuthError` com o
 *  status preservado — o mesmo idioma do `pedir()` de authApi.ts, que
 *  não serve aqui porque só fala JSON e o envio é multipart. */
async function falhar(res: Response): Promise<never> {
  let detalhe = `HTTP ${res.status}`;
  try {
    const corpo = (await res.json()) as { detail?: unknown };
    if (typeof corpo?.detail === 'string') detalhe = corpo.detail;
  } catch {
    /* corpo não-JSON: fica o status */
  }
  throw new AuthError(detalhe, res.status);
}

export interface ClienteSubmissoes {
  /** `POST {prefixo}/submissions` — multipart, campo `file`. */
  enviar(arquivo: File, signal?: AbortSignal): Promise<Submissao>;
  /** `GET {prefixo}/submissions` — as submissões da conta, mais recente primeiro. */
  listar(signal?: AbortSignal): Promise<ListaSubmissoes>;
}

/** Um cliente por produto, fechado sobre o prefixo da API. Caminho
 *  RELATIVO + `credentials: 'include'` — o cookie de sessão viaja em
 *  mesma origem, como todo o resto da identidade de plataforma. */
export function criarClienteSubmissoes(prefixo: string): ClienteSubmissoes {
  return {
    async enviar(arquivo, signal) {
      const fd = new FormData();
      fd.append('file', arquivo, arquivo.name);
      let res: Response;
      try {
        res = await fetch(`${prefixo}/submissions`, {
          method: 'POST',
          body: fd,
          credentials: 'include',
          headers: { Accept: 'application/json' },
          signal,
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') throw err;
        throw new AuthError(err instanceof Error ? err.message : 'Falha de rede.', 0);
      }
      if (!res.ok) return falhar(res);
      return (await res.json()) as Submissao;
    },
    async listar(signal) {
      let res: Response;
      try {
        res = await fetch(`${prefixo}/submissions`, {
          credentials: 'include',
          headers: { Accept: 'application/json' },
          signal,
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') throw err;
        throw new AuthError(err instanceof Error ? err.message : 'Falha de rede.', 0);
      }
      if (!res.ok) return falhar(res);
      return (await res.json()) as ListaSubmissoes;
    },
  };
}

// ─── Registro dos fluxos ─────────────────────────────────────────────
// O que o Perfil de plataforma mapeia: uma seção de status por fluxo,
// com o número de seção DERIVADO da posição — nunca digitado. Era o
// mesmo defeito de numeração que a FamiliaPage tinha (recon §2.6).
//
// `aoVivo: false` = a seção declara o estado futuro e NÃO faz fetch —
// endpoint que não está no ar não é consultado, e ausência declarada é
// melhor que 404 silencioso. Virar um fluxo é trocar um campo aqui.

export interface FluxoSubmissao {
  /** Id do catálogo — o título da seção resolve via `DESTINOS_BR`. */
  productId: string;
  /** Prefixo da API deste produto — lido do router real, nunca chutado. */
  prefixo: string;
  /** O backend deste fluxo está no ar? Governa se o perfil CONSULTA o
   *  endpoint — abertura pública é outra coisa (status do catálogo). */
  aoVivo: boolean;
  /** Porta de entrada do intake, para o CTA do estado vazio. */
  rotaEnvio: string;
  /** Copy do perfil — explícita por produto, sem template de gênero. */
  copy: {
    vazioEtiqueta: string;
    vazioCorpo: string;
    vazioCta: string;
    emLeitura: string;
  };
}

export const FLUXOS_SUBMISSAO: FluxoSubmissao[] = [
  {
    productId: 'conta-de-luz-express',
    prefixo: '/api/conta-luz-express',
    aoVivo: true,
    rotaEnvio: '/conta-de-luz-express',
    copy: {
      vazioEtiqueta: 'Nenhuma fatura enviada',
      vazioCorpo:
        'O parecer de uma fatura chega nesta seção, com aviso por email, depois que a leitura terminar. Nada foi enviado por esta conta ainda.',
      vazioCta: 'Enviar uma fatura',
      emLeitura:
        'Uma pessoa está lendo a fatura. O aviso por email sai quando o parecer ficar pronto.',
    },
  },
  {
    productId: 'solar-proposal-validator',
    // LIDO do router real (app/routers/solar_proposal.py, CURSOR
    // Wave 2) — mesmo contrato da CLE, campo a campo.
    prefixo: '/api/solar-proposal-validator',
    // Wave 3 da trilha: o backend está NO AR (medido — GET sem sessão
    // devolve 401, mesmo comportamento do de CLE) e a página de intake
    // envia de verdade, então o perfil passa a LER o endpoint real.
    // `aoVivo` governa a consulta, não a abertura pública: o produto
    // segue 'em-breve' no catálogo até o Railway ter as variáveis de
    // email — decisão separada, registrada em docs/pendencias-infra.md.
    aoVivo: true,
    rotaEnvio: '/solar-proposal-validator',
    copy: {
      vazioEtiqueta: 'Nenhuma proposta enviada',
      vazioCorpo:
        'O parecer de uma proposta chega nesta seção, com aviso por email, depois que a leitura terminar. Nada foi enviado por esta conta ainda.',
      vazioCta: 'Enviar uma proposta',
      emLeitura:
        'Uma pessoa está lendo a proposta. O aviso por email sai quando o parecer ficar pronto.',
    },
  },
];
