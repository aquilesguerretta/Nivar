// detalheSolar — ARCHITECT, Portal do Operador, revisão visual pós-Wave 2.
//
// Solar Proposal Validator. **Razão: a tabela é a página.** Uma linha
// por afirmação da proposta, classificada pela natureza — a copy pública
// virando ferramenta (SolarProposalValidatorPage.tsx:829 e :834): duas
// trilhas, quatro naturezas, pergunta de negociação, base normativa.
//
// Coluna ÚNICA, sem trilho ao lado: com o trilho de 232px a coluna da
// afirmação caía a 168px e quebrava em quatro linhas. A tabela precisa
// da largura inteira; os tokens do caso vão numa linha sob o h1.
//
// Na revisão: as três células inertes por linha tinham três baselines e
// repetiam no td o que o th já dizia. Agora a célula inerte é uma linha
// de base vazia; a escala de naturezas aparece uma vez, como rodapé.

import type { CSSProperties } from 'react';

import { CT } from './operatorViewUtils';
import { Tabela, type ColunaTabela } from '../../components/nivar/tabela';
import { CabecalhoDoPedido, CampoInerte, LinhaDeTokens, Pautado, Secao } from './pecasDoPedido';
import { LIVRO_RAZAO_MOCK, NATUREZAS_SOLAR, type LinhaProposta, type PedidoNaFila } from '../../lib/operador/mock';

export function DetalheSolar({ pedido }: { pedido: PedidoNaFila }) {
  const linhas = LIVRO_RAZAO_MOCK[pedido.id] ?? [];

  const colunas: ColunaTabela<LinhaProposta>[] = [
    { chave: 'trilha', rotulo: 'Trilha', largura: '110px', celula: (l) => <span style={{ ...CT.dado, color: 'var(--text-muted)' }}>{l.trilha}</span> },
    { chave: 'afirmacao', rotulo: 'O que a proposta afirma', celula: (l) => <span style={{ ...CT.corpo, color: 'var(--text-strong)' }}>{l.afirmacao}</span> },
    { chave: 'natureza', rotulo: 'Natureza', largura: '150px', celula: () => <CampoInerte /> },
    { chave: 'pergunta', rotulo: 'Pergunta de negociação', largura: '210px', celula: () => <CampoInerte /> },
    { chave: 'base', rotulo: 'Base normativa', largura: '150px', celula: () => <CampoInerte /> },
  ];

  return (
    <div style={{ maxWidth: '1120px' }}>
      <CabecalhoDoPedido pedido={pedido} />
      <LinhaDeTokens pedido={pedido} />

      <div style={{ display: 'grid', gap: '34px' }}>
        <Secao numero={1} titulo="Livro-razão da proposta" grande data-focal="" nota={`${linhas.length} linhas · inerte até a ligação`}>
          {linhas.length > 0 ? (
            <Tabela colunas={colunas} linhas={linhas} chaveDe={(l) => l.id} zebra={false} hover={false} />
          ) : (
            <p style={{ ...CT.corpoLeve, color: 'var(--text-faint)' }}>Nenhuma linha extraída ainda nesta amostra.</p>
          )}
          <p style={{ ...CT.corpoLeve, color: 'var(--text-muted)', margin: '12px 0 0', textWrap: 'pretty' } as CSSProperties}>
            Natureza, por linha: {NATUREZAS_SOLAR.join(' · ')}.
          </p>
        </Secao>

        <Secao numero={2} titulo="Conclusão" nota="sem parecer · inerte até a ligação">
          <Pautado linhas={6} />
        </Secao>
      </div>
    </div>
  );
}
