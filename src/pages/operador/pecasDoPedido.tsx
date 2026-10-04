// pecasDoPedido — ARCHITECT, Portal do Operador, revisão visual pós-Wave 2.
//
// As peças que as três telas de detalhe compartilham: o cabeçalho do
// caso, o cabeçalho de seção do sistema, a linha de razão, o trilho do
// caso, o campo inerte como linha de base, o bloco pautado, e o lugar
// do documento.
//
// ─── O QUE SAIU NA REVISÃO, E POR QUÊ ────────────────────────────────
// · O deck narrativo sob o h1 ("Uma fatura de concessionária, esperando
//   leitura há…"): descrevia a seção seguinte — sumário de documentação,
//   não interface. Ficam eyebrow › h1 › trilho de tokens.
// · A linha "campos de trabalho inertes até a ligação" e as rotas de
//   API impressas no pé das seções. A razão do campo inerte continua
//   AO LADO — decisão do Aquiles — mas como token na nota da seção
//   ("inerte até a ligação"), não como frase.
// · O placeholder-frase no lugar do parecer. Virou bloco PAUTADO:
//   hairlines a cada 24px e nada escrito — o lugar onde se escreve.
// · A prosa dentro da caixa do documento. Ficou a folha A4 com a trama
//   hairline do sistema e uma linha: "exibição em wave própria" — a
//   declaração que o Aquiles pediu, sem parágrafo.
// · O produto dito três vezes (masthead, eyebrow, lateral). O eyebrow
//   agora carrega só o patrono e o id.

import type { CSSProperties, ReactNode } from 'react';

import { CT } from './operatorViewUtils';
import { Figura, PATRONO_DA_FAMILIA } from '../../components/nivar/patrono';
import { Frescor } from '../../components/nivar/tabela';
import { familiaPorId } from '../../lib/data/br-familias';
import { produtoComFilaPorId } from '../../lib/operador/catalogo';
import { formatarData, formatarIdade, idadePorExtenso } from '../../lib/operador/idade';
import { AGORA_DA_AMOSTRA, type PedidoNaFila } from '../../lib/operador/mock';

/** Cabeçalho do caso: patrono + id em eyebrow, e o nome do cliente em
 *  display. Dois registros, sem deck — o resto é dado e mora no trilho. */
export function CabecalhoDoPedido({ pedido }: { pedido: PedidoNaFila }) {
  const fam = familiaPorId(produtoComFilaPorId(pedido.produtoId)?.familiaId ?? '');
  const patrono = fam ? PATRONO_DA_FAMILIA[fam.id] : undefined;
  return (
    <header style={{ marginBottom: '28px', paddingBottom: '16px', borderBottom: 'var(--fio) solid var(--rule-heavy)' }}>
      <p style={{ ...CT.eyebrow, color: 'var(--text-faint)', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {patrono ? <Figura patrono={patrono} tamanho={30} decorativo /> : null}
        <span>{pedido.id}</span>
      </p>
      <h1 style={{ ...CT.display, color: 'var(--text-strong)', margin: 0 }}>{pedido.cliente}</h1>
    </header>
  );
}

/** Uma linha de razão: rótulo à esquerda, valor mono à direita, fio
 *  embaixo. Lista, não célula. Compartilhada pela fila e pelo caso. */
export function LinhaDoTrilho({ rotulo, valor, forte, title }: { rotulo: string; valor: ReactNode; forte?: boolean; title?: string }) {
  return (
    <div
      title={title}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '12px',
        height: '32px',
        lineHeight: '32px',
        borderBottom: 'var(--fio) solid var(--rule)',
      }}
    >
      <span style={{ ...CT.corpoLeve, lineHeight: '32px', color: forte ? 'var(--text-strong)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rotulo}</span>
      <span style={{ ...CT.dado, lineHeight: '32px', color: forte ? 'var(--text-strong)' : 'var(--text-body)', fontWeight: forte ? 500 : 400, whiteSpace: 'nowrap' }}>
        {valor}
      </span>
    </div>
  );
}

/** O trilho do caso — os tokens que a linha de meta sob o h1 carregava,
 *  agora como razão de 232px, igual ao trilho da fila. */
export function TrilhoDoCaso({ pedido, extras }: { pedido: PedidoNaFila; extras?: ReactNode }) {
  return (
    <aside className="op-trilho" aria-label="Dados do caso">
      <p style={{ ...CT.eyebrow, color: 'var(--text-faint)', margin: '0 0 4px' }}>Caso</p>
      <LinhaDoTrilho rotulo="Enviado" valor={formatarData(pedido.criadoEm)} />
      <LinhaDoTrilho rotulo="Espera" valor={formatarIdade(pedido.criadoEm, AGORA_DA_AMOSTRA)} forte title={idadePorExtenso(pedido.criadoEm, AGORA_DA_AMOSTRA)} />
      <LinhaDoTrilho
        rotulo="Estado"
        valor={pedido.status === null ? 'sem estado' : pedido.status === 'submitted' ? 'aguardando' : 'entregue'}
        title={pedido.status === null ? 'Este produto não tem campo de estado no backend.' : undefined}
      />
      <LinhaDoTrilho rotulo="Arquivo" valor={pedido.arquivo ?? 'nenhum'} />
      {extras}
      <div style={{ marginTop: '16px' }}>
        <Frescor estado="ilustrativa" detalhe="nada aqui é gravado" />
      </div>
    </aside>
  );
}

/** Os tokens do caso numa linha só, em mono — para a tela em que a
 *  tabela é a página e o trilho não cabe ao lado (Solar). Cada token em
 *  nowrap, com o separador PRECEDENDO o item, para nunca ficar órfão no
 *  fim da linha. */
export function LinhaDeTokens({ pedido }: { pedido: PedidoNaFila }) {
  const estado = pedido.status === null ? 'sem estado' : pedido.status === 'submitted' ? 'aguardando' : 'entregue';
  const tokens = [
    `enviado ${formatarData(pedido.criadoEm)}`,
    `espera ${formatarIdade(pedido.criadoEm, AGORA_DA_AMOSTRA)}`,
    estado,
    pedido.arquivo ?? 'sem arquivo',
    'amostra · nada aqui é gravado',
  ];
  return (
    <p style={{ ...CT.dado, color: 'var(--text-muted)', margin: '-14px 0 30px', display: 'flex', flexWrap: 'wrap', gap: '4px 0' }}>
      {tokens.map((t, i) => (
        <span key={t} style={{ whiteSpace: 'nowrap' }}>
          {i > 0 ? (
            <span aria-hidden="true" style={{ margin: '0 10px', color: 'var(--rule-strong)' }}>
              ·
            </span>
          ) : null}
          {t}
        </span>
      ))}
    </p>
  );
}

/** Cabeçalho de seção do sistema: número · título · fio · nota. O
 *  número vem da POSIÇÃO. A nota é DADO DERIVADO em mono caixa baixa
 *  ("10 campos", "2 mensagens", "sem parecer") — nunca slogan. */
export function Secao({
  numero,
  titulo,
  nota,
  grande,
  children,
  style,
  'data-focal': dataFocal,
}: {
  numero: number;
  titulo: string;
  nota?: string;
  grande?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  'data-focal'?: string;
}) {
  return (
    <section data-focal={dataFocal} style={style}>
      <div className={`op-sech${grande ? ' op-sech--grande' : ''}`}>
        <span className="op-sech__n">{String(numero).padStart(2, '0')}</span>
        <h2 className="op-sech__t">{titulo}</h2>
        <span className="op-sech__fio" aria-hidden="true" />
        {nota ? <p className="op-sech__nota">{nota}</p> : <span />}
      </div>
      {children}
    </section>
  );
}

/** Linha de leitura: rótulo e valor apoiados no mesmo fio, 32px. */
export function Linha({ rotulo, valor, unidade }: { rotulo: string; valor: ReactNode; unidade?: string }) {
  const vazio = valor === null || valor === undefined || valor === '';
  return (
    <div className="op-linha">
      <span className="op-linha__rot">{rotulo}</span>
      <span className={`op-linha__v${vazio ? ' op-linha__v--vazio' : ''}`}>
        <span style={{ minWidth: 0 }}>{vazio ? 'sem dado' : valor}</span>
        {unidade ? <span className="op-linha__un">{unidade}</span> : null}
      </span>
    </div>
  );
}

/** Campo inerte rotulado — a anatomia da fatura é uma pilha destes.
 *  Rótulo e linha de base no MESMO fio, 32px, unidade à direita. */
export function CampoRotulado({ rotulo, unidade }: { rotulo: string; unidade?: string }) {
  return (
    <div className="op-linha" aria-disabled="true">
      <span className="op-linha__rot">{rotulo}</span>
      <span className="op-linha__v op-linha__v--vazio">
        <span />
        {unidade ? <span className="op-linha__un">{unidade}</span> : null}
      </span>
    </div>
  );
}

/** Campo inerte solto — uma linha de base, vazia. */
export function CampoInerte() {
  return <div className="op-campo" aria-disabled="true" />;
}

/** Bloco pautado — hairlines a cada 24px, o lugar de um texto longo. */
export function Pautado({ linhas = 6 }: { linhas?: number }) {
  return <div className="op-pautado" aria-disabled="true" style={{ '--linhas': linhas } as CSSProperties} />;
}

/** O lugar do documento — placeholder DECLARADO, decisão do Aquiles: a
 *  exibição de PDF é wave própria. A única caixa das telas de detalhe,
 *  porque o documento é a única fronteira real: folha A4, fio de 1px,
 *  a trama hairline do sistema dentro, e uma linha. */
export function LugarDoDocumento({ arquivo }: { arquivo: string }) {
  return (
    <figure
      style={{
        position: 'relative',
        margin: 0,
        width: '100%',
        maxWidth: '300px',
        aspectRatio: '210 / 297',
        border: 'var(--fio) solid var(--rule)',
        background: 'var(--surface-page)',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
      }}
    >
      <span className="nivar-textura-rede" aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }} />
      <figcaption style={{ ...CT.dado, color: 'var(--text-faint)', position: 'relative', textAlign: 'center', padding: '0 20px' }}>
        {arquivo}
        <br />
        exibição em wave própria
      </figcaption>
    </figure>
  );
}
