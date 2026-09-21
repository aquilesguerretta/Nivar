// tabela — ARCHITECT, Portal do Operador Wave 2, Fase 2.
//
// O vocabulário de LEITURA DENSA do NIVAR, portado do skill para `src/`.
// Primeiro consumidor real: o Portal do Operador, que é a primeira
// superfície da casa que é lista de trabalho e não página de leitura.
//
// ─── O QUE FOI PORTADO, E O QUE FICOU PARA TRÁS ──────────────────────
// `components/data/data.css` do skill tem 104 blocos de regra, em dez
// famílias. Vieram TRÊS, e por demanda:
//
//   · `.nv-tab*`     (13 das 20 linhas) — a tabela da fila
//   · `.nv-ord*`     (10) — cabeçalho ordenável
//   · `.nv-frescor*` (6)  — o carimbo de procedência do dado
//
// Mais `.nv-est*` (16) de `components/states/states.css`, para fila
// vazia. As RAZÕES de cada ausência, medidas na Fase 1 desta wave
// (`docs/operador-console-contratos.md` §2.2):
//
//   · `.nv-metodo*` (23) — JÁ CHEGA por `FOLHA_PORTAL` do
//     `portalChrome.tsx`; portar de novo criaria segunda fonte.
//   · `.nv-comp*`   (13) — comparação lado a lado; a fila não compara
//     pedidos entre si.
//   · `.nv-card*` + `.nv-cardgrid` (11) — cartão de valor/unidade/delta;
//     o console tem casos, não métrica agregada.
//   · `.nv-tend*`   (9)  — tendência inline; não há série temporal.
//   · `.nv-exp*`    (7)  — linha expansível. É boa, e a recon de Wave 1
//     a elogiou. Fica fora POR ESCOLHA: o painel inline é o mesmo
//     retângulo para os três produtos, e o brief pede três telas de
//     detalhe com formas diferentes. Se a triagem sem sair da fila se
//     provar necessária, os 7 entram depois sem nada a desfazer.
//   · `.nv-proc*`   (5)  — procedência de fonte externa; o dado do
//     console vem do cliente, não de fonte citável.
//   · `.nv-alta` / `.nv-baixa` / `.nv-atencao` / `.nv-neutro` (2 linhas,
//     4 regras) — cor por direção de valor. Uma fila de trabalho não
//     tem direção. (Conferido na Fase 1 que também não são semáforo:
//     `--data-alta` é `--hardware` e `--data-baixa` é `--software`,
//     cores da escala de incandescência, não vermelho/verde.)
//
// A regra é do próprio sistema (`src/design/nivar/LEIA.md`): "o CSS de
// componente entra POR DEMANDA, conforme cada tela usar — nada
// aterrissa em `src/` sem uso".
//
// ─── ZERO TOKEN NOVO ─────────────────────────────────────────────────
// Os 24 tokens que estes blocos consomem já existem em
// `src/design/nivar/` — conferido na Fase 1 por diferença de conjunto
// entre o que o CSS pede e o que os seis arquivos definem. Nada foi
// acrescentado a `src/design/nivar/`, que esta wave só CONSOME.
// `colors.css` define os mesmos nomes uma segunda vez sob
// `data-mode="noturno"`, então os dois modos saem sem uma linha daqui.
//
// ─── VALORES VERBATIM ────────────────────────────────────────────────
// O CSS abaixo é cópia literal de `data.css` e `states.css`, sem um
// valor alterado — mesma técnica de `campos.tsx` (Diagnóstico Wave 2) e
// de `portalChrome.tsx`. O markup segue os `.jsx` de referência do skill
// (`DataTable.jsx`, `SortHeader.jsx`, `DataFreshness.jsx`,
// `EmptyState.jsx`), traduzidos para TSX com tipos.
//
// UMA DIVERGÊNCIA DELIBERADA de markup, e é a única: o `EmptyState.jsx`
// do skill carrega um objeto `PADRAO` com texto de exemplo do domínio
// brasileiro de energia ("PLD acima de R$ 900,00", "ccee.contratos_
// bilaterais"). Isso é CONTEÚDO de demonstração, não sistema — copiar
// traria texto que não é verdade nesta tela. `EstadoVazio` abaixo exige
// os textos por prop; não tem padrão embutido.
//
// ─── POR QUE O CSS VIAJA JUNTO ───────────────────────────────────────
// A folha é injetada por `<EstilosTabela />`, não importada como arquivo
// global — o idioma que `campos.tsx` e `portalChrome.tsx` já usam.
// Montar mais de uma vez é inofensivo: são as mesmas regras.
//
// Os keyframes `nv-surge` e `nv-fio-desenha` NÃO vêm aqui: já são
// montados por `FOLHA_PORTAL` (`portalChrome.tsx:145-146`), que toda
// página desta superfície monta.

import type { ReactNode } from 'react';

/** A folha do vocabulário denso — verbatim de `components/data/data.css`
 *  e `components/states/states.css` do skill, no subconjunto que esta
 *  árvore usa. Monte uma vez por página que tenha tabela. */
export function EstilosTabela() {
  return (
    <style>{`
      /* ─── TABELA DENSA — components/data/data.css, verbatim ───────── */
      .nv-tab{width:100%;border-collapse:collapse;border:var(--fio) solid var(--rule)}
      .nv-tab caption{caption-side:top;text-align:left;padding:0 0 8px;font-family:var(--font-data);font-size:10px;letter-spacing:.09em;text-transform:uppercase;font-weight:500;color:var(--text-faint)}
      .nv-tab th{text-align:left;font-family:var(--font-data);font-weight:500;font-size:10px;line-height:1.2;letter-spacing:.09em;text-transform:uppercase;color:var(--text-faint);padding:7px 12px;border-bottom:var(--fio) solid var(--rule-strong);white-space:nowrap}
      .nv-tab td{padding:7px 12px;border-bottom:var(--fio) solid var(--rule);font-family:var(--font-body);font-weight:400;font-size:13.5px;line-height:1.35;color:var(--text-body)}
      .nv-tab th+th,.nv-tab td+td{border-left:var(--fio) solid var(--rule)}
      .nv-tab th.nv-num,.nv-tab td.nv-num{text-align:right}
      .nv-tab td.nv-num{font-family:var(--font-data);font-variant-numeric:tabular-nums lining-nums;font-size:13.5px;letter-spacing:-.005em;color:var(--text-strong);white-space:nowrap}
      .nv-tab tbody tr{border-left:2px solid transparent;transition:color var(--dur-hover) var(--ease),border-color var(--dur-hover) var(--ease)}
      .nv-tab--zebra tbody tr:nth-child(even){background:var(--zebra)}
      .nv-tab--hover tbody tr:hover,.nv-tab tbody tr.nv-tab__linha--hover{border-left-color:var(--accent-focus)}
      .nv-tab--hover tbody tr:hover td,.nv-tab tbody tr.nv-tab__linha--hover td{color:var(--fg-hover);border-bottom-color:var(--rule-strong)}
      .nv-tab tfoot td{border-bottom:0;border-top:var(--fio) solid var(--rule-heavy);font-weight:500;color:var(--text-strong)}
      .nv-tab-rolo{max-width:100%}

      /* ─── ORDENAÇÃO DE COLUNA — glifo unicode em mono, nunca ícone de
             biblioteca externa. Neutro fica presente em --rule-strong: a
             coluna se anuncia ordenável sem exigir hover. ───────────── */
      .nv-ord{padding:0}
      .nv-ord__b{display:flex;align-items:baseline;gap:7px;width:100%;background:none;border:0;border-radius:0;padding:7px 12px;text-align:left;font-family:var(--font-data);font-weight:500;font-size:10px;line-height:1.2;letter-spacing:.09em;text-transform:uppercase;color:var(--text-faint);cursor:pointer;transition:color var(--dur-hover) var(--ease)}
      .nv-ord.nv-num .nv-ord__b{flex-direction:row-reverse;text-align:right}
      .nv-ord__rot{flex:1 1 auto}
      .nv-ord__marca{flex:none;font-family:var(--font-data);font-weight:400;font-size:11px;line-height:1;color:var(--rule-strong);transition:color var(--dur-hover) var(--ease)}
      .nv-ord__b:hover,.nv-ord__b--is-hover{color:var(--fg-hover)}
      .nv-ord__b:hover .nv-ord__marca,.nv-ord__b--is-hover .nv-ord__marca{color:var(--fio-hover)}
      .nv-ord__b:focus-visible{outline:var(--fio-forte) solid var(--accent-focus);outline-offset:-2px}
      .nv-ord--ativa .nv-ord__b{color:var(--text-strong)}
      .nv-ord--ativa .nv-ord__marca{color:var(--text-strong);font-weight:500}

      /* ─── PROCEDÊNCIA DO DADO — components/data/data.css, verbatim.
             --ilustrativa é o carimbo do sistema para dado que não é
             apuração real. É o que esta wave usa para declarar mock. ── */
      .nv-frescor{display:flex;flex-wrap:wrap;align-items:center;gap:5px 7px;font-family:var(--font-data);font-weight:400;font-size:10.5px;line-height:1.5;letter-spacing:.05em;color:var(--text-muted);font-variant-numeric:tabular-nums lining-nums;margin:0}
      .nv-frescor__ponto{width:6px;height:6px;border-radius:50%;flex:none;background:var(--text-faint)}
      .nv-frescor__estado{font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--text-strong);white-space:nowrap}
      .nv-frescor__sep{opacity:.55}
      .nv-frescor__detalhe{color:var(--text-faint);white-space:nowrap}
      .nv-frescor--ilustrativa .nv-frescor__estado{color:var(--ilustrativa-fg);border-bottom:var(--fio) solid var(--ilustrativa-fio);padding-bottom:1px}

      /* ─── ESTADO VAZIO — components/states/states.css, verbatim ───── */
      .nv-est{display:grid;align-content:start;gap:10px;padding:20px 0;max-width:60ch}
      .nv-est__eti{font-family:var(--font-data);font-weight:500;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-faint)}
      .nv-est__titulo{font-family:var(--font-display);font-weight:600;font-size:22px;line-height:1.12;letter-spacing:-.014em;color:var(--text-strong);margin:0}
      .nv-est__corpo{font-family:var(--font-body);font-weight:300;font-size:14px;line-height:1.5;color:var(--text-muted);margin:0}
      .nv-est__acoes{display:flex;gap:16px;align-items:center;padding-top:2px}
      .nv-est__meta{font-family:var(--font-data);font-weight:400;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-faint);font-variant-numeric:tabular-nums}
      .nv-est__eixo{display:grid;gap:11px;padding:4px 0 8px;border-left:var(--fio) solid var(--rule-strong);padding-left:12px}
      .nv-est__eixo span{display:block;height:1px;background:var(--rule)}
      .nv-est__filtro{display:flex;flex-wrap:wrap;gap:4px 10px;font-family:var(--font-data);font-weight:400;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);font-variant-numeric:tabular-nums}
      .nv-est__filtro b{color:var(--text-faint);font-weight:500}
      .nv-est__filtro i{font-style:normal;color:var(--rule-strong)}
      .nv-est__conjunto{display:flex;justify-content:space-between;gap:16px;padding:9px 12px;border:var(--fio) solid var(--rule-strong)}
      .nv-est__conjunto span{font-family:var(--font-data);font-size:11.5px;letter-spacing:.05em;color:var(--text-strong);font-variant-numeric:tabular-nums}
      .nv-est__conjunto em{font-style:normal;font-family:var(--font-data);font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--text-faint)}
    `}</style>
  );
}

// ─── Tabela ──────────────────────────────────────────────────────────

/** Direção de ordenação de uma coluna. `neutro` é o estado em que a
 *  coluna se anuncia ordenável sem estar ordenando. */
export type Ordem = 'neutro' | 'asc' | 'desc';

export interface ColunaTabela<L> {
  /** Chave estável da coluna — é o `campo` que volta em `onOrdenar`. */
  chave: string;
  rotulo: string;
  /** Mono tabular alinhado à direita (`.nv-num`). Para número, data e
   *  qualquer coisa que se compare por varredura vertical. */
  numerico?: boolean;
  /** Ordenável? Sem isto, o cabeçalho é `<th>` simples. */
  ordenavel?: boolean;
  /** Largura da coluna (`<col style=width>`). Sem ela, a coluna divide o
   *  que sobra. Coluna de dado tem largura FIXA para a varredura vertical
   *  não depender da janela: a 1920px uma tabela sem larguras joga
   *  "enviado" a 250px de "cliente". */
  largura?: string;
  /** O que renderizar na célula. Recebe a linha inteira, não um valor
   *  solto — coluna que combina dois campos é caso normal aqui. */
  celula: (linha: L) => ReactNode;
}

export interface TabelaProps<L> {
  colunas: ColunaTabela<L>[];
  linhas: L[];
  /** Chave de React por linha. Obrigatória: índice de array numa lista
   *  que ordena é a receita de estado grudado na posição errada. */
  chaveDe: (linha: L) => string;
  /** Título acima da tabela, em mono caixa-alta (`<caption>`). */
  legenda?: string;
  zebra?: boolean;
  hover?: boolean;
  /** Coluna ordenada agora, e em que direção. */
  ordenadaPor?: string;
  ordem?: Ordem;
  onOrdenar?: (chave: string, proxima: Ordem) => void;
  /** `<tr>` marcada por controle externo (não por `:hover`). */
  linhaMarcada?: string;
  onClicarLinha?: (linha: L) => void;
  /** Célula de rodapé por chave de coluna. Fecha a grade em vez de
   *  deixá-la terminar no ar, e é onde a contagem chega ao olho depois
   *  da varredura. Coluna sem entrada aqui sai vazia. */
  rodape?: Partial<Record<string, ReactNode>>;
}

const GLIFO: Record<Ordem, string> = { neutro: '↕', asc: '↑', desc: '↓' };
const ARIA: Record<Ordem, 'none' | 'ascending' | 'descending'> = {
  neutro: 'none',
  asc: 'ascending',
  desc: 'descending',
};
const PROXIMO: Record<Ordem, Ordem> = { neutro: 'asc', asc: 'desc', desc: 'asc' };

export function Tabela<L>({
  colunas,
  linhas,
  chaveDe,
  legenda,
  zebra = true,
  hover = true,
  ordenadaPor,
  ordem = 'neutro',
  onOrdenar,
  linhaMarcada,
  onClicarLinha,
  rodape,
}: TabelaProps<L>) {
  const cls = ['nv-tab', zebra ? 'nv-tab--zebra' : '', hover ? 'nv-tab--hover' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="nv-tab-rolo">
      <table className={cls} style={colunas.some((c) => c.largura) ? { tableLayout: 'fixed' } : undefined}>
        {legenda ? <caption>{legenda}</caption> : null}
        {colunas.some((c) => c.largura) ? (
          <colgroup>
            {colunas.map((c) => (
              <col key={c.chave} style={c.largura ? { width: c.largura } : undefined} />
            ))}
          </colgroup>
        ) : null}
        <thead>
          <tr>
            {colunas.map((c) => {
              const desta = ordenadaPor === c.chave ? ordem : 'neutro';
              if (!c.ordenavel || !onOrdenar) {
                return (
                  <th key={c.chave} scope="col" className={c.numerico ? 'nv-num' : undefined}>
                    {c.rotulo}
                  </th>
                );
              }
              const ativa = desta !== 'neutro';
              return (
                <th
                  key={c.chave}
                  scope="col"
                  aria-sort={ARIA[desta]}
                  className={['nv-ord', c.numerico ? 'nv-num' : '', ativa ? 'nv-ord--ativa' : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <button
                    type="button"
                    className="nv-ord__b"
                    onClick={() => onOrdenar(c.chave, PROXIMO[desta])}
                  >
                    <span className="nv-ord__rot">{c.rotulo}</span>
                    <span className="nv-ord__marca" aria-hidden="true">
                      {GLIFO[desta]}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => {
            const k = chaveDe(linha);
            return (
              <tr
                key={k}
                className={linhaMarcada === k ? 'nv-tab__linha--hover' : undefined}
                onClick={onClicarLinha ? () => onClicarLinha(linha) : undefined}
                style={onClicarLinha ? { cursor: 'pointer' } : undefined}
              >
                {colunas.map((c) => (
                  <td key={c.chave} className={c.numerico ? 'nv-num' : undefined}>
                    {c.celula(linha)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
        {rodape ? (
          <tfoot>
            <tr>
              {colunas.map((c) => (
                <td key={c.chave} className={c.numerico ? 'nv-num' : undefined}>
                  {rodape[c.chave] ?? null}
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

// ─── Procedência do dado ─────────────────────────────────────────────

export type EstadoDoDado = 'vivo' | 'desatualizado' | 'ilustrativa';

const ROTULO_FRESCOR: Record<EstadoDoDado, string> = {
  vivo: 'ao vivo',
  desatualizado: 'desatualizado',
  ilustrativa: 'amostra ilustrativa',
};

export interface FrescorProps {
  estado?: EstadoDoDado;
  /** Texto atrás do separador — a explicação curta do estado. */
  detalhe?: string;
  /** Ponto à esquerda. Padrão: só em `vivo`. */
  ponto?: boolean;
}

/** O carimbo de procedência. `ilustrativa` é o que o sistema usa para
 *  declarar dado que não é apuração real — e é o que o console monta
 *  enquanto o backend de fila não existe. */
export function Frescor({ estado = 'vivo', detalhe, ponto }: FrescorProps) {
  const mostraPonto = ponto === undefined ? estado === 'vivo' : ponto;
  return (
    <p className={`nv-frescor nv-frescor--${estado}`}>
      {mostraPonto ? <span className="nv-frescor__ponto" aria-hidden="true" /> : null}
      <span className="nv-frescor__estado">{ROTULO_FRESCOR[estado]}</span>
      {detalhe ? (
        <span className="nv-frescor__sep" aria-hidden="true">
          ·
        </span>
      ) : null}
      {detalhe ? <span className="nv-frescor__detalhe">{detalhe}</span> : null}
    </p>
  );
}

// ─── Estado vazio ────────────────────────────────────────────────────

export type VarianteVazio = 'sem-dado' | 'sem-resultado' | 'sem-permissao';

export interface EstadoVazioProps {
  variante?: VarianteVazio;
  /** Todos obrigatórios de propósito: o `EmptyState.jsx` do skill traz
   *  texto de exemplo embutido, e texto de exemplo numa tela real vira
   *  afirmação falsa. Quem monta declara o que é verdade ali. */
  etiqueta: string;
  titulo: string;
  corpo: string;
  meta?: string;
  /** Só em `sem-resultado` — devolve o filtro que zerou a lista. */
  filtros?: string[];
  acoes?: ReactNode;
}

export function EstadoVazio({
  variante = 'sem-dado',
  etiqueta,
  titulo,
  corpo,
  meta,
  filtros,
  acoes,
}: EstadoVazioProps) {
  return (
    <div className="nv-est" data-variante={variante}>
      <span className="nv-est__eti">{etiqueta}</span>

      {variante === 'sem-dado' ? (
        <div className="nv-est__eixo" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : null}

      <h3 className="nv-est__titulo">{titulo}</h3>
      <p className="nv-est__corpo">{corpo}</p>

      {variante === 'sem-resultado' && filtros && filtros.length > 0 ? (
        <p className="nv-est__filtro">
          <b>Filtro ativo:</b>
          {filtros.map((f, i) => (
            <span key={f}>
              {i > 0 ? (
                <i aria-hidden="true" style={{ marginRight: '10px' }}>
                  ·
                </i>
              ) : null}
              {f}
            </span>
          ))}
        </p>
      ) : null}

      {meta ? <span className="nv-est__meta">{meta}</span> : null}
      {acoes ? <div className="nv-est__acoes">{acoes}</div> : null}
    </div>
  );
}
