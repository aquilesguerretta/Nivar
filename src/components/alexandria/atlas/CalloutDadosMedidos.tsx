// CalloutDadosMedidos — distinção permanente entre o que a fonte mede
// e o que o Atlas calcula. Wave 38.
//
// Checagem de reuso (Wave 38 Fase 1): não existe primitiva compartilhada
// "Dados medidos / Interpretação analítica" nem "Números vivos" como
// componente. O que existe é (a) citação "Fonte: …" em PaisPerfil e
// (b) contorno tracejado terracota (VideoArea, estado em produção).
// Este callout é local ao território do Atlas — reusa o idioma de
// tracejado + tokens A/AT/AS, sem criar primitiva fora de atlas/.

import { A, A2, AT, AS, AR } from '../../../design/alexandria-tokens';

interface CalloutDadosMedidosProps {
  /** Quando a métrica ativa é derivada, a fórmula aparece no painel
   *  de interpretação. Ausente = só a distinção estrutural. */
  formula?: string;
}

export function CalloutDadosMedidos({ formula }: CalloutDadosMedidosProps) {
  return (
    <div
      role="note"
      aria-label="Dados medidos e interpretação analítica"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: AS.sm,
        border: `1px dashed ${A.terracota}`,
        borderRadius: AR.none,
        padding: AS.sm,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xs }}>
        <span style={{ ...AT.rotulo, color: A.oliva }}>Dados medidos</span>
        <span style={{ ...AT.dado, color: A.tintaSuave, lineHeight: 1.5 }}>
          Coloração, filtro e rankings leem os 12 campos do Our World in
          Data — intensidade, geração, matriz, população. Cada número
          carrega a fonte citada no perfil do país.
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: AS.xs,
          borderLeft: `1px solid ${A2.fioColunaSobreCreme}`,
          paddingLeft: AS.sm,
        }}
      >
        <span style={{ ...AT.rotulo, color: A.terracota }}>Interpretação analítica</span>
        <span style={{ ...AT.dado, color: A.tintaSuave, lineHeight: 1.5 }}>
          {formula
            ? `Não vem da fonte: calculado aqui como ${formula}. Intensidade mede carbono por kWh; esta estimativa multiplica pela geração para aproximar o total anual.`
            : 'Métricas marcadas no ranking são compostas a partir dos campos medidos. A fórmula aparece aqui quando uma delas está ativa.'}
        </span>
      </div>
    </div>
  );
}

export default CalloutDadosMedidos;
