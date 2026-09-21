// detalheCLE — ARCHITECT, Portal do Operador, revisão visual pós-Wave 2.
//
// Conta de Luz Express. **Bancada: o documento fixo à esquerda, a
// leitura à direita.** A fatura é documento PADRONIZADO — os mesmos
// campos toda vez, olhando para a peça.
//
// Os dez campos saem da copy pública do produto
// (ContaDeLuzExpressPage.tsx:843): "modalidade tarifária, demanda
// contratada e medida, tributos e encargos". Ordem de leitura da fatura.
//
// A coluna do documento é o trilho desta tela: sob a folha ficam os
// tokens do caso (enviado, espera, estado, arquivo). O parecer — a
// seção focal — é bloco pautado, e a razão do inerte é um token na nota.

import { CabecalhoDoPedido, CampoRotulado, LugarDoDocumento, Pautado, Secao, TrilhoDoCaso } from './pecasDoPedido';
import { ANATOMIA_FATURA, type PedidoNaFila } from '../../lib/operador/mock';

export function DetalheCLE({ pedido }: { pedido: PedidoNaFila }) {
  return (
    <div>
      <CabecalhoDoPedido pedido={pedido} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 300px) minmax(0, 1fr)', gap: '0 56px', alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 0, display: 'grid', gap: '22px' }}>
          <Secao numero={1} titulo="O que chegou">{pedido.arquivo ? <LugarDoDocumento arquivo={pedido.arquivo} /> : null}</Secao>
          <TrilhoDoCaso pedido={pedido} />
        </div>

        <div style={{ display: 'grid', gap: '34px' }}>
          <Secao numero={2} titulo="Anatomia da fatura" nota={`${ANATOMIA_FATURA.length} campos · inerte até a ligação`}>
            <div>
              {ANATOMIA_FATURA.map((campo) => (
                <CampoRotulado key={campo.chave} rotulo={campo.rotulo} unidade={campo.unidade} />
              ))}
            </div>
          </Secao>

          <Secao numero={3} titulo="Parecer" grande data-focal="" nota="sem parecer · inerte até a ligação">
            <Pautado linhas={8} />
          </Secao>
        </div>
      </div>
    </div>
  );
}
