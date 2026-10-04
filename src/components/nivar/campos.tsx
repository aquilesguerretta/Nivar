// campos — ARCHITECT, Diagnóstico Energético Wave 2, Fase 2.
//
// Os campos de formulário do NIVAR, portados do skill para `src/`.
// Primeiro consumidor real: o intake de Diagnóstico Energético, que é
// o primeiro produto da casa com formulário de vários campos (os dois
// anteriores da família Advisory são upload de arquivo único).
//
// ─── O QUE FOI PORTADO, E O QUE FICOU PARA TRÁS ──────────────────────
// `components/forms/field.css` do skill tem 89 blocos de regra, em
// cinco famílias. Vieram DUAS:
//
//   · `.nv-campo*`   (26) — Input, NumberInput, Select, UnitField
//   · `.nv-escolha*` (18) — Checkbox, Radio
//
// Ficaram no skill, por decisão declarada na Fase 1 desta wave:
//
//   · `.nv-acesso*`  (15) — é o AuthForm, a tela de LOGIN. `/entrar` e
//     `/criar-conta` já foram migradas para NIVAR com `.conta-campo`
//     local; trazer isto criaria uma segunda fonte para o mesmo papel.
//   · `.nv-multi*`   (16) — MultiSelect, sem tela prevista.
//   · `.nv-desl*`    (14) — Slider, sem tela prevista.
//
// A regra é do próprio sistema (`src/design/nivar/LEIA.md`): "o CSS de
// componente entra POR DEMANDA, conforme cada tela usar — nada
// aterrissa em `src/` sem uso". Quando uma tela precisar de MultiSelect
// ou Slider, o grupo dela entra aqui do mesmo jeito.
//
// ─── VALORES VERBATIM ────────────────────────────────────────────────
// O CSS abaixo é cópia literal de `field.css`, sem um valor alterado —
// mesma técnica que `portalChrome.tsx` já usa para Button, ModeToggle e
// MethodDisclosure ("CSS do sistema, verbatim, no subconjunto usado").
// O markup dos componentes segue os `.jsx` de referência do skill
// (`Input.jsx`, `Select.jsx`, `Checkbox.jsx`, `Radio.jsx`), traduzidos
// para TSX com tipos — a estrutura de elemento e a ordem das classes
// são as mesmas.
//
// ─── POR QUE O CSS VIAJA JUNTO ───────────────────────────────────────
// A folha é injetada por `<EstilosCampos />`, não importada como
// arquivo global. É o idioma que o Portal já usa: não depende de ordem
// de import de folha, e uma página que não usa campo não carrega o CSS
// deles. Montar mais de uma vez é inofensivo — são as mesmas regras.

import { useId, type ReactNode } from 'react';

/** A folha dos campos — verbatim de `components/forms/field.css` do
 *  skill, nos dois grupos que esta árvore usa. Monte uma vez por
 *  página que tenha formulário. */
export function EstilosCampos() {
  return (
    <style>{`
      /* .nv-sr — verbatim de tokens/base.css. Vem para cá porque o
         base.css inteiro NÃO entra em src/ (restila elemento global e
         vazaria para as outras superfícies); esta regra é de classe,
         não de elemento, então é segura e o Envelope depende dela. */
      .nv-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}

      .nv-campo{display:grid;gap:6px}
      .nv-campo__rotulo{font-family:var(--font-body);font-weight:500;font-size:11px;line-height:1.1;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)}
      .nv-campo__caixa{display:flex;align-items:stretch;border:var(--fio) solid var(--campo-fio);border-radius:0;background:none;transition:border-color var(--dur-estado) var(--ease)}
      .nv-campo__ctrl{flex:1;min-width:0;font-family:var(--font-body);font-weight:400;font-size:14px;line-height:1.2;color:var(--text-strong);background:none;border:0;padding:9px 11px;outline:0}
      .nv-campo__ctrl::placeholder{color:var(--text-faint);font-weight:300}
      .nv-campo__ctrl--num{font-family:var(--font-data);font-variant-numeric:tabular-nums lining-nums;text-align:right;letter-spacing:-.005em}
      .nv-campo__unid{display:flex;align-items:center;padding:0 11px;border-left:var(--fio) solid var(--campo-fio);font-family:var(--font-data);font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--text-faint);white-space:nowrap}
      .nv-campo__glifo{display:flex;align-items:center;padding:0 11px;font-family:var(--font-data);font-size:12px;color:var(--text-muted);pointer-events:none}
      .nv-campo__caixa:focus-within{border-color:var(--accent-focus);outline:2px solid var(--accent-focus);outline-offset:2px}
      .nv-campo--erro .nv-campo__caixa{border-color:var(--campo-erro-fio)}
      .nv-campo--erro .nv-campo__unid{border-left-color:var(--campo-erro-fio)}
      .nv-campo--desabilitado{opacity:.4}
      .nv-campo--desabilitado .nv-campo__ctrl,.nv-campo--desabilitado select{cursor:not-allowed}
      .nv-campo__nota{font-family:var(--font-body);font-weight:300;font-size:12px;line-height:1.4;color:var(--text-faint)}
      .nv-campo__erro{display:flex;gap:6px;font-family:var(--font-body);font-weight:400;font-size:12px;line-height:1.4;color:var(--campo-erro-texto)}
      .nv-campo__erro i{font-family:var(--font-data);font-style:normal;color:var(--campo-erro-fio)}
      .nv-campo__caixa--foco{border-color:var(--accent-focus);outline:2px solid var(--accent-focus);outline-offset:2px}

      /* MARCADOR DE CAMPO OBRIGATORIO — uma convencao so: asterisco em acento junto ao rotulo. */
      .nv-campo__obrig{margin-left:3px;font-family:var(--font-data);font-weight:500;font-size:12px;line-height:1;color:var(--accent-house)}

      /* VALIDACAO ASSINCRONA — fio de 1px se desenhando na base do campo, em loop. Nunca spinner:
         a revelacao no sistema e desenho de traco. So transform anima. */
      .nv-campo--verificando .nv-campo__caixa{position:relative;border-color:var(--rule-strong)}
      .nv-campo__tracado{position:absolute;left:0;right:0;bottom:-1px;height:var(--fio-forte);background:var(--acento-contexto,var(--accent-focus));transform:scaleX(0);transform-origin:left;animation:nv-verifica 1400ms var(--ease-loop) infinite}
      @keyframes nv-verifica{0%{transform:scaleX(0);transform-origin:left}49.9%{transform:scaleX(1);transform-origin:left}50%{transform:scaleX(1);transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}
      .nv-campo__verifica{font-family:var(--font-data);font-weight:400;font-size:10px;line-height:1.4;letter-spacing:.09em;text-transform:uppercase;color:var(--text-faint)}
      @media (prefers-reduced-motion:reduce){.nv-campo__tracado{animation:none;transform:scaleX(1);opacity:.5}}

      /* ESCOLHA — caixa e rádio. O preenchimento marcado usa a cor de acento em uso no contexto,
         nunca uma cor propria fixa. Raio zero na caixa; o circulo do radio e excecao declarada. */
      .nv-escolha{display:inline-grid;grid-template-columns:auto minmax(0,1fr);align-items:start;gap:9px;position:relative;cursor:pointer}
      .nv-escolha__ctrl{position:absolute;width:15px;height:15px;top:2px;left:0;margin:0;opacity:0;cursor:pointer}
      .nv-escolha__marca{width:15px;height:15px;margin-top:2px;flex:none;display:grid;place-items:center;border:var(--fio) solid var(--campo-fio);background:none;font-family:var(--font-data);font-size:11px;line-height:1;color:var(--btn-primario-fg);transition:border-color var(--dur-estado) var(--ease)}
      .nv-escolha__marca--circulo{border-radius:var(--radius-circulo)}
      .nv-escolha:hover .nv-escolha__marca,.nv-escolha--is-hover .nv-escolha__marca{border-color:var(--fio-hover)}
      .nv-escolha__ctrl:checked+.nv-escolha__marca{background:var(--acento-contexto,var(--accent-house));border-color:var(--acento-contexto,var(--accent-house))}
      .nv-escolha__ctrl:checked+.nv-escolha__marca--quadrado::after{content:"×"}
      .nv-escolha__ctrl:indeterminate+.nv-escolha__marca--quadrado{background:var(--acento-contexto,var(--accent-house));border-color:var(--acento-contexto,var(--accent-house))}
      .nv-escolha__ctrl:indeterminate+.nv-escolha__marca--quadrado::after{content:"–"}
      .nv-escolha__ctrl:checked+.nv-escolha__marca--circulo::after{content:"";width:6px;height:6px;border-radius:var(--radius-circulo);background:var(--btn-primario-fg)}
      .nv-escolha__ctrl:focus-visible+.nv-escolha__marca{outline:var(--fio-forte) solid var(--accent-focus);outline-offset:2px}
      .nv-escolha--is-foco .nv-escolha__marca{outline:var(--fio-forte) solid var(--accent-focus);outline-offset:2px}
      .nv-escolha__texto{display:grid;gap:2px;font-family:var(--font-body);font-weight:400;font-size:13.5px;line-height:1.42;color:var(--text-body)}
      .nv-escolha__nota{font-weight:300;font-size:12px;line-height:1.4;color:var(--text-faint)}
      .nv-escolha--desabilitado{opacity:.4;cursor:not-allowed}
      .nv-escolha--desabilitado .nv-escolha__ctrl{cursor:not-allowed}
      .nv-escolha-pilha{display:grid;gap:10px}
      .nv-escolha-fila{display:flex;flex-wrap:wrap;gap:10px 20px}
    `}</style>
  );
}

// ─── Envelope ────────────────────────────────────────────────────────
// Rótulo + caixa + (erro | verificando | nota). É o `Envelope` do
// `Input.jsx` do skill, com a mesma ordem de elementos: o erro
// SUBSTITUI a nota, nunca empilha — o campo não cresce ao errar.

interface EnvelopeBase {
  /** Etiqueta versalete acima do campo. */
  rotulo?: string;
  /** Dica permanente sob o campo. Sai quando há erro. */
  nota?: string;
  /** Mensagem de erro — sem semáforo: fio + glifo `×` carregam o
   *  sinal, o texto carrega a leitura (desvio declarado do sistema). */
  erro?: string;
  desabilitado?: boolean;
  /** Asterisco em acento + `obrigatório` para leitor de tela. É a
   *  convenção ÚNICA do sistema; nunca marcar "opcional" nos outros. */
  obrigatorio?: boolean;
  /** Fio de 2px se desenhando na base, em loop. Nunca spinner. */
  verificando?: boolean;
}

function Envelope({
  rotulo,
  nota,
  erro,
  desabilitado,
  obrigatorio,
  verificando,
  htmlFor,
  children,
}: EnvelopeBase & { htmlFor: string; children: ReactNode }) {
  const cls = [
    'nv-campo',
    erro ? 'nv-campo--erro' : '',
    desabilitado ? 'nv-campo--desabilitado' : '',
    verificando ? 'nv-campo--verificando' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {rotulo ? (
        <label className="nv-campo__rotulo" htmlFor={htmlFor}>
          {rotulo}
          {obrigatorio ? (
            <>
              <span className="nv-campo__obrig" aria-hidden="true">
                *
              </span>
              <span className="nv-sr"> obrigatório</span>
            </>
          ) : null}
        </label>
      ) : null}
      <div className="nv-campo__caixa">
        {children}
        {verificando ? <span className="nv-campo__tracado" aria-hidden="true" /> : null}
      </div>
      {erro ? (
        <p className="nv-campo__erro">
          <i aria-hidden="true">×</i>
          {erro}
        </p>
      ) : verificando ? (
        <p className="nv-campo__verifica" role="status">
          verificando
        </p>
      ) : nota ? (
        <p className="nv-campo__nota">{nota}</p>
      ) : null}
    </div>
  );
}

// ─── Campo de texto ──────────────────────────────────────────────────

export interface CampoTextoProps extends EnvelopeBase {
  id?: string;
  valor: string;
  onChange: (v: string) => void;
  tipo?: 'text' | 'email' | 'tel';
  placeholder?: string;
  autoComplete?: string;
  /** Renderiza `<textarea>` com N linhas em vez de `<input>`. */
  linhas?: number;
  /** Mono tabular alinhado à direita — para número em coluna. */
  numerico?: boolean;
  /** Unidade atrás de fio, dentro da caixa (idioma do NumberInput). */
  unidade?: string;
}

export function CampoTexto({
  id,
  valor,
  onChange,
  tipo = 'text',
  placeholder,
  autoComplete,
  linhas,
  numerico,
  unidade,
  ...env
}: CampoTextoProps) {
  const auto = useId();
  const idReal = id ?? auto;
  const cls = `nv-campo__ctrl${numerico ? ' nv-campo__ctrl--num' : ''}`;

  return (
    <Envelope {...env} htmlFor={idReal}>
      {linhas ? (
        <textarea
          id={idReal}
          className={cls}
          rows={linhas}
          value={valor}
          placeholder={placeholder}
          disabled={env.desabilitado}
          required={env.obrigatorio || undefined}
          aria-invalid={env.erro ? true : undefined}
          onChange={(e) => onChange(e.target.value)}
          style={{ resize: 'vertical' }}
        />
      ) : (
        <input
          id={idReal}
          className={cls}
          type={tipo}
          value={valor}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={env.desabilitado}
          required={env.obrigatorio || undefined}
          aria-invalid={env.erro ? true : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {unidade ? <span className="nv-campo__unid">{unidade}</span> : null}
    </Envelope>
  );
}

// ─── Seleção ─────────────────────────────────────────────────────────

export interface OpcaoSelect {
  value: string;
  label: string;
}

export interface CampoSelectProps extends EnvelopeBase {
  id?: string;
  valor: string;
  onChange: (v: string) => void;
  opcoes: ReadonlyArray<OpcaoSelect | string>;
  /** Primeira opção, de valor vazio — o estado "ainda não escolhi". */
  placeholder?: string;
}

export function CampoSelect({
  id,
  valor,
  onChange,
  opcoes,
  placeholder,
  ...env
}: CampoSelectProps) {
  const auto = useId();
  const idReal = id ?? auto;
  const itens = opcoes.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return (
    <Envelope {...env} htmlFor={idReal}>
      <select
        id={idReal}
        className="nv-campo__ctrl"
        value={valor}
        disabled={env.desabilitado}
        required={env.obrigatorio || undefined}
        aria-invalid={env.erro ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        // `appearance: none` + o glifo `▾` do sistema: a seta nativa do
        // browser é vocabulário de outro sistema visual.
        style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 0 }}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {itens.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="nv-campo__glifo" aria-hidden="true">
        ▾
      </span>
    </Envelope>
  );
}

// ─── Escolha (caixa e rádio) ─────────────────────────────────────────
// A caixa é quadrada com glifo `×`; o rádio é redondo com disco pleno.
// "Redondo aqui não é enfeite: é a convenção que separa escolha única
// de múltipla sem texto explicando" — e `×` dentro de círculo leria
// como cancelado.

export interface EscolhaProps {
  id?: string;
  /** `quadrado` = caixa (múltipla) · `circulo` = rádio (única). */
  forma: 'quadrado' | 'circulo';
  marcado: boolean;
  onChange: (marcado: boolean) => void;
  rotulo: string;
  nota?: string;
  desabilitado?: boolean;
  /** Só para rádio: o grupo a que pertence. */
  name?: string;
  value?: string;
}

export function Escolha({
  id,
  forma,
  marcado,
  onChange,
  rotulo,
  nota,
  desabilitado,
  name,
  value,
}: EscolhaProps) {
  const auto = useId();
  const idReal = id ?? auto;
  const circulo = forma === 'circulo';

  return (
    <label
      className={`nv-escolha${desabilitado ? ' nv-escolha--desabilitado' : ''}`}
      htmlFor={idReal}
    >
      <input
        id={idReal}
        className="nv-escolha__ctrl"
        type={circulo ? 'radio' : 'checkbox'}
        name={name}
        value={value}
        checked={marcado}
        disabled={desabilitado}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`nv-escolha__marca nv-escolha__marca--${forma}`} aria-hidden="true" />
      <span className="nv-escolha__texto">
        {rotulo}
        {nota ? <span className="nv-escolha__nota">{nota}</span> : null}
      </span>
    </label>
  );
}

/** Empilhadas (uma por linha) ou em fila (embrulha). São as duas
 *  disposições que o sistema declara. */
export function EscolhaPilha({ children }: { children: ReactNode }) {
  return <div className="nv-escolha-pilha">{children}</div>;
}

export function EscolhaFila({ children }: { children: ReactNode }) {
  return <div className="nv-escolha-fila">{children}</div>;
}

/** Texto só para leitor de tela — `.nv-sr` do sistema, servido pela
 *  folha acima. */
export function ApenasLeitor({ children }: { children: ReactNode }) {
  return <span className="nv-sr">{children}</span>;
}
