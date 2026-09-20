// detalheDiagnostico — ARCHITECT, Portal do Operador, revisão visual pós-Wave 2.
//
// Diagnóstico Energético. **Carta: coluna única de leitura, a ficha e o
// fio.** Não há arquivo (o caso É o texto que o cliente digitou); não há
// entregável (a resposta É a mensagem); há conversa ligada ao caso. Daí
// coluna estreita, largura de leitura, e o fio como seção focal.

import type { CSSProperties } from 'react';

import { CT } from './operatorViewUtils';
import { CabecalhoDoPedido, Linha, LinhaDoTrilho, Pautado, Secao, TrilhoDoCaso } from './pecasDoPedido';
import { formatarIdade, idadePorExtenso } from '../../lib/operador/idade';
import { AGORA_DA_AMOSTRA, FICHAS_MOCK, FIO_MOCK, type PedidoNaFila } from '../../lib/operador/mock';

export function DetalheDiagnostico({ pedido }: { pedido: PedidoNaFila }) {
  const ficha = FICHAS_MOCK[pedido.id];
  const fio = FIO_MOCK[pedido.id] ?? [];

  return (
    <div className="op-pagina">
      <div style={{ minWidth: 0, maxWidth: '68ch' }}>
        <CabecalhoDoPedido pedido={pedido} />

        <div style={{ display: 'grid', gap: '34px' }}>
          <Secao numero={1} titulo="A ficha" nota="só leitura">
            {ficha ? (
              <>
                <Linha rotulo="Setor" valor={ficha.sector} />
                <Linha rotulo="Consumo mensal" valor={ficha.monthlyConsumptionBand} />
                {/* null é "não sei dizer" — o backend converte string
                    vazia em null de propósito, e a tela repete a distinção. */}
                <Linha rotulo="Modalidade tarifária" valor={ficha.tariffModality ?? <span style={{ color: 'var(--text-faint)', fontWeight: 300 }}>o cliente não soube dizer</span>} />
                <blockquote style={{ margin: '20px 0 0', padding: '2px 0 2px 16px', borderLeft: '2px solid var(--acento-contexto)' }}>
                  <p style={{ ...CT.lede, color: 'var(--text-body)', margin: 0, textWrap: 'pretty' } as CSSProperties}>{ficha.concern}</p>
                  <footer style={{ ...CT.dado, color: 'var(--text-faint)', marginTop: '8px' }}>a preocupação, nas palavras dele</footer>
                </blockquote>
              </>
            ) : (
              <p style={{ ...CT.corpoLeve, color: 'var(--text-faint)' }}>Ficha ausente nesta amostra.</p>
            )}
          </Secao>

          <Secao numero={2} titulo="O fio" grande data-focal="" nota={`${fio.length} ${fio.length === 1 ? 'mensagem' : 'mensagens'} · resposta inerte até a ligação`}>
            {fio.length > 0 ? (
              <ol style={{ listStyle: 'none', margin: '0 0 22px', padding: 0, display: 'grid', gap: '18px' }}>
                {fio.map((m) => {
                  const daCasa = m.role !== 'customer';
                  return (
                    <li key={m.id} style={{ display: 'grid', gridTemplateColumns: '96px minmax(0,1fr)', gap: '16px', alignItems: 'baseline' }}>
                      <span style={{ ...CT.dado, color: daCasa ? 'var(--text-strong)' : 'var(--text-muted)', fontWeight: daCasa ? 500 : 400 }}>
                        {daCasa ? 'NIVAR' : 'cliente'}
                        <span style={{ display: 'block', ...CT.dado, color: 'var(--text-faint)', fontWeight: 400 }} title={idadePorExtenso(m.createdAt, AGORA_DA_AMOSTRA)}>
                          há {formatarIdade(m.createdAt, AGORA_DA_AMOSTRA)}
                        </span>
                      </span>
                      <p style={{ ...CT.corpo, color: 'var(--text-body)', margin: 0, textWrap: 'pretty' } as CSSProperties}>{m.body}</p>
                    </li>
                  );
                })}
              </ol>
            ) : null}
            <Pautado linhas={4} />
          </Secao>
        </div>
      </div>

      {/* Sem entregável: o trilho declara, em vez de mostrar um botão que
          não leva a lugar nenhum. */}
      <TrilhoDoCaso pedido={pedido} extras={<LinhaDoTrilho rotulo="Entregável" valor="nenhum" title="Este produto não tem endpoint nem coluna de entrega; a resposta é a mensagem." />} />
    </div>
  );
}
