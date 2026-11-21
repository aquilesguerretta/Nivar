// portalChrome — ARCHITECT, Portal BR Wave 8.
//
// A moldura compartilhada do Portal Brasil: o wordmark inline e a folha
// de CSS escopada da página. EXTRAÍDO de PortalBR.tsx nesta wave, sem
// uma linha de mudança de conteúdo — as páginas de família precisam da
// mesma moldura, e duplicar 88 linhas de SVG mais 197 de CSS garantiria
// divergência na primeira correção que alguém fizesse num só lado.
//
// NÃO extraí `NT` (os papéis tipográficos) de propósito: cada
// componente do Portal declara os seus, e a razão está escrita no
// próprio PortalBR — importar criaria ciclo página→componente→página,
// e a referência `var()` já garante que o VALOR nunca diverge. A
// duplicação de NT é decisão documentada; esta extração não a desfaz.

// ─── Wordmark NIVAR — SVG INLINE, nunca <img> ───────────────────────
// Regra do sistema: SVG por <img src> é documento isolado — não recebe
// cor do hospedeiro nem participa do escopo de modo. As DUAS variantes
// moram no DOM e o CSS de modo alterna qual aparece: claro leva o
// gradiente de incandescência (assets/nivar-wordmark.svg, produção);
// noturno leva o traço de papel sólido (nivar-wordmark-papel.svg,
// FOUNDRY NIVAR Wave 2). Geometria copiada VERBATIM dos assets —
// aplicar, nunca recriar; a única adaptação é o sufixo no id do
// gradiente, porque o wordmark aparece duas vezes no documento
// (cabeçalho e rodapé) e id duplicado quebra a referência url(#…).

// Sete traços — a mesma contagem que a peça "Energização" do especimen
// escreve em sequência (o traço escreve, letra a letra). O desenho de
// primeiro paint reusa exatamente essa peça: stroke-dashoffset por
// traço em --dur-desenho, escalonado, easing único. pathLength=1
// normaliza o comprimento — o dasharray não depende de medição.
const WM_TRACOS: ReadonlyArray<{ d: string; w: number }> = [
  { d: 'M22 112 C22 80 22 50 22 18 C54 40 60 92 108 112 C108 80 108 50 108 18', w: 16 },
  { d: 'M140 32 L140 112', w: 13 },
  { d: 'M170 32 L200 112 L230 32', w: 13 },
  { d: 'M254 112 L284 32 L314 112', w: 13 },
  { d: 'M342 112 L342 32', w: 13 },
  { d: 'M342 32 C378 32 394 44 386 56 C378 68 362 64 342 64', w: 13 },
  { d: 'M370 62 C382 80 390 96 398 112', w: 13 },
];

const WM_PATHS = (
  <>
    {WM_TRACOS.map((t, i) => (
      <path
        key={i}
        d={t.d}
        strokeWidth={t.w}
        pathLength={1}
        data-wm-traco
        style={{ animationDelay: `${i * 90}ms` }}
      />
    ))}
  </>
);

// REVISÃO PÓS-WAVE 6 (pedido direto do Aquiles): a variante de papel
// saiu — o wordmark é o COLORIDO nos dois modos, como o próprio
// especimen de movimento renderiza sobre tinta. O gradiente é da marca
// e não aceita troca de cor; sobre os dois substratos ele é a marca,
// não texto de interface.
export function WordmarkNivar({ altura, idSufixo }: { altura: number; idSufixo: string }) {
  const largura = Math.round(altura * (425 / 140));
  return (
    <span
      role="img"
      aria-label="NIVAR"
      style={{ display: 'inline-flex', flexShrink: 0, lineHeight: 0 }}
    >
      <svg
        className="nivar-wm"
        viewBox="0 0 425 140"
        width={largura}
        height={altura}
        aria-hidden="true"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient
            id={`incandescente-${idSufixo}`}
            gradientUnits="userSpaceOnUse"
            x1="22"
            y1="0"
            x2="400"
            y2="0"
          >
            <stop offset="0%" stopColor="#7A1F0D" />
            <stop offset="50%" stopColor="#C17D1F" />
            <stop offset="100%" stopColor="#F5C63C" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke={`url(#incandescente-${idSufixo})`}
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          {WM_PATHS}
        </g>
      </svg>
    </span>
  );
}

/** A folha escopada da página — o que o `base.css` do NIVAR daria em
 *  global (foco, seleção, link) entra aqui sob `[data-nv-page]`, para
 *  não vazar às outras superfícies do app. Consumida por
 *  `<style>{FOLHA_PORTAL}</style>` em cada página do Portal. */
export const FOLHA_PORTAL = `
        /* Escopo de página — foco e seleção do sistema. */
        [data-nv-page] :focus-visible {
          outline: 2px solid var(--accent-focus);
          outline-offset: 2px;
        }
        [data-nv-page] ::selection {
          background: var(--advisory);
          color: var(--tinta);
        }

        /* ModeToggle — CSS do sistema, verbatim. Mono, sem caixa, sem
           ícone; ativo = texto forte + fio no acento da casa. */
        .nv-modo{display:flex;align-items:baseline;gap:8px}
        .nv-modo__op{font-family:var(--font-data);font-weight:400;font-size:11px;line-height:1.2;letter-spacing:.09em;text-transform:uppercase;color:var(--text-faint);background:none;border:0;border-bottom:1px solid transparent;padding:0 0 3px;cursor:pointer;transition:color var(--dur-estado) var(--ease),border-color var(--dur-estado) var(--ease)}
        .nv-modo__op:hover{color:var(--fg-hover)}
        .nv-modo__op--ativo{color:var(--text-strong);font-weight:500;border-bottom-color:var(--accent-house)}
        .nv-modo__sep{font-family:var(--font-data);font-size:11px;color:var(--rule-strong)}

        /* MethodDisclosure — CSS do sistema (components/data/data.css),
           verbatim, no subconjunto que o Portal usa. Divulgação de
           metodologia inline, ancorada na procedência — nunca modal. */
        .nv-metodo{display:grid;gap:0;max-width:480px}
        .nv-metodo__ancora{display:grid;justify-items:start;gap:7px}
        .nv-metodo__gatilho{justify-self:start;white-space:nowrap;font-family:var(--font-data);font-weight:500;font-size:10.5px;line-height:1.5;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);background:none;border:0;border-bottom:var(--fio) solid var(--rule-strong);border-radius:0;padding:0 0 1px;cursor:pointer;transition:color var(--dur-hover) var(--ease),border-color var(--dur-hover) var(--ease)}
        .nv-metodo__gatilho:hover{color:var(--fg-hover);border-bottom-color:var(--fio-hover)}
        .nv-metodo__painel{display:grid;gap:9px;padding-top:11px;background:var(--surface-page)}
        .nv-metodo__fio-desenho{display:block;width:100%;height:1px;overflow:visible}
        .nv-metodo__fio-desenho line{stroke:var(--rule-heavy);stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:1000;stroke-dashoffset:1000;animation:nv-fio-desenha var(--dur-desenho) var(--ease) forwards}
        .nv-metodo__corpo{display:grid;opacity:0;animation:nv-surge var(--dur-hover) var(--ease) 140ms forwards}
        .nv-metodo__linha{display:grid;grid-template-columns:158px minmax(0,1fr);gap:3px 14px;padding:7px 0;border-bottom:var(--fio) solid var(--rule)}
        .nv-metodo__rot{font-family:var(--font-data);font-weight:500;font-size:9.5px;line-height:1.7;letter-spacing:.09em;text-transform:uppercase;color:var(--text-faint)}
        .nv-metodo__v{font-family:var(--font-body);font-weight:300;font-size:13px;line-height:1.5;color:var(--text-body);margin:0;text-wrap:pretty}
        .nv-metodo__v--dado{font-family:var(--font-data);font-weight:400;font-size:11.5px;line-height:1.55;letter-spacing:.03em;color:var(--text-strong);font-variant-numeric:tabular-nums lining-nums}
        .nv-metodo__premissas{display:grid;gap:4px;margin:0;padding:0;list-style:none}
        .nv-metodo__premissas li{font-family:var(--font-body);font-weight:300;font-size:13px;line-height:1.5;color:var(--text-body);padding-left:18px;position:relative}
        .nv-metodo__premissas li::before{content:"—";position:absolute;left:0;color:var(--text-faint)}
        @keyframes nv-surge{to{opacity:1}}
        @keyframes nv-fio-desenha{to{stroke-dashoffset:0}}
        @media (prefers-reduced-motion: reduce) {
          .nv-metodo__fio-desenho line{animation:none;stroke-dashoffset:0}
          .nv-metodo__corpo{animation:none;opacity:1}
        }

        /* Button — CSS do sistema (components/actions/button.css),
           verbatim no subconjunto usado. O preenchimento do primário
           muda de estado mas NÃO entra na transition — troca seca,
           como a regra manda. */
        .nv-btn{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-body);font-size:13px;font-weight:500;letter-spacing:.02em;line-height:1;padding:9px 16px;border:var(--fio) solid transparent;border-radius:0;background:none;cursor:pointer;text-align:left;text-decoration:none;transition:color var(--dur-hover) var(--ease),border-color var(--dur-hover) var(--ease),opacity var(--dur-hover) var(--ease)}
        .nv-btn:focus-visible{outline:2px solid var(--accent-focus);outline-offset:2px}
        .nv-btn__glifo{font-family:var(--font-data);font-size:12px;line-height:1}
        .nv-btn--primario{background:var(--btn-primario-bg);border-color:var(--btn-primario-fio);color:var(--btn-primario-fg)}
        .nv-btn--primario:hover{background:var(--btn-primario-bg-hover);border-color:var(--btn-primario-fio-hover);color:var(--btn-primario-fg)}
        .nv-btn--primario:active{background:var(--btn-primario-bg-press);border-color:var(--btn-primario-fio-press);transition-duration:var(--dur-estado)}
        .nv-btn--secundario{border-color:var(--rule-heavy);color:var(--text-strong)}
        .nv-btn--secundario:hover{color:var(--fg-hover);border-color:var(--fio-hover)}
        .nv-btn--secundario:active{color:var(--fg-press);border-color:var(--fio-press);transition-duration:var(--dur-estado)}

        /* Corrente — o pulso atravessa o fio (peça 03 do especimen):
           janela de traço percorrendo o caminho em velocidade
           constante. Loop usa --ease-loop (linear), a única exceção
           declarada do easing. */
        @keyframes nivar-pulso { to { stroke-dashoffset: -1.12; } }
        .nivar-pulso {
          stroke-dasharray: 0.12 1.12;
          stroke-dashoffset: 0.12;
          animation: nivar-pulso 1400ms var(--ease-loop) infinite;
        }

        /* Link de lista (rodapé) — o tratamento de link do sistema:
           cor de link com sublinhado por fio que NUNCA some; no hover o
           texto muda de cor e o fio assume a cor do texto. */
        .nivar-flink {
          font-family: var(--font-body);
          font-weight: 400;
          font-size: var(--ts-corpo-2);
          line-height: var(--lh-corpo-2);
          color: var(--link);
          text-decoration: none;
          background: none;
          border: none;
          border-bottom: var(--fio) solid var(--link-fio);
          border-radius: 0;
          padding: 0;
          cursor: pointer;
          text-align: left;
          align-self: flex-start;
          transition: color var(--dur-hover) var(--ease), border-color var(--dur-hover) var(--ease);
        }
        .nivar-flink:hover, .nivar-flink:focus-visible {
          color: var(--link-hover);
          border-bottom-color: currentColor;
        }

        /* Textura de rede do rodapé — hairline a 5% nos DOIS
           substratos: traço de tinta sobre papel, traço de papel sobre
           tinta. Os hexes são a tinta (#14120F) e o papel (#F6F2E9) da
           escala, URL-encodados UMA vez (%23 — lição do bug da Wave 3,
           verificado por computed style no fechamento). */
        .nivar-textura-rede {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          pointer-events: none;
          background-size: 56px 56px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><path d='M0 0H56M0 0V56' stroke='%2314120F' stroke-width='0.6' fill='none'/><path d='M0 56L56 0' stroke='%2314120F' stroke-width='0.4' fill='none'/></svg>");
        }
        [data-mode="noturno"] .nivar-textura-rede {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><path d='M0 0H56M0 0V56' stroke='%23F6F2E9' stroke-width='0.6' fill='none'/><path d='M0 56L56 0' stroke='%23F6F2E9' stroke-width='0.4' fill='none'/></svg>");
        }

        /* Primeiro paint — a marca escreve (peça "Energização" do
           especimen): cada um dos sete traços desenha por
           stroke-dashoffset em --dur-desenho, escalonado 90ms, easing
           único. Só enquanto .nivar-boot está no root — o estado sai
           depois do boot e a troca de modo nunca redispara o desenho. */
        @keyframes nivar-wm-desenha { to { stroke-dashoffset: 0; } }
        .nivar-boot .nivar-wm [data-wm-traco] {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: nivar-wm-desenha var(--dur-desenho) var(--ease) forwards;
        }

        /* Surgimento do painel "em breve" — OPACIDADE PURA. O zoom com
           scale da Wave 2 sai: o sistema não anima escala em elemento
           de interface (transform é exclusivo do loader da marca). */
        @keyframes nivar-painel-surge {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        ::view-transition-new(nivar-painel) {
          animation: nivar-painel-surge var(--dur-hover) var(--ease) both;
        }

        /* Planta baixa dos destinos — o estado de carregamento do
           sistema é revelação por desenho: fio crescendo em
           --dur-desenho, easing único, nunca shimmer. */
        @keyframes nivar-desenha { to { stroke-dashoffset: 0; } }
        .nivar-planta [data-traco] {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }
        .nivar-planta.nivar-planta--visivel [data-traco] {
          animation: nivar-desenha var(--dur-desenho) var(--ease) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .nivar-planta [data-traco],
          .nivar-wm [data-wm-traco] {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }
          ::view-transition-old(root), ::view-transition-new(root),
          ::view-transition-group(nivar-painel),
          ::view-transition-old(nivar-painel),
          ::view-transition-new(nivar-painel) {
            animation: none !important;
          }
        }
      `;
