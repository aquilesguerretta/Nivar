// Trocas editoriais aplicadas ao texto das aulas do M02 e do M03 no porte v3.
// Só entram as decididas em docs/alexandria-v3/DECISOES-2026-11-15.md:
//   Q03 — "GridAlpha" e o vocabulário interno (War Room, Cobaia Zero, Summit) saem
//         do corpo das aulas (P24: a empresa é NIVAR);
//   Q13 — dano tipográfico de transporte.
// O verificador aplica as MESMAS trocas ao lado da fonte antes de comparar, e
// conta cada uso; troca listada e não usada é sinalizada.
// Cada entrada: { id, de (string literal ou RegExp global), para, por }.

export const EDITORIAIS = {
  2: [
    { id: 'Q03-GridAlpha', de: /GridAlpha/g, para: 'NIVAR', por: 'Q03/P24: a empresa é NIVAR.' },
  ],
  3: [
    { id: 'Q03-GridAlpha', de: /GridAlpha/g, para: 'NIVAR', por: 'Q03/P24: a empresa é NIVAR.' },
    // Q03: "Summit" é evento interno. Sai a referência, sem nada inventado no lugar.
    { id: 'Q03-Summit-A01', de: 'Antes de citar em conversa de Summit, material público', para: 'Antes de citar em conversa, material público', por: 'Q03: evento interno.' },
    { id: 'Q03-Summit-A04', de: 'Frase de Summit: ', para: 'Frase: ', por: 'Q03: evento interno.' },
    { id: 'Q03-Summit-A08a', de: 'pode ter mudado na semana do Summit</strong>', para: 'pode ter mudado</strong>', por: 'Q03: evento interno.' },
    { id: 'Q03-Summit-A08b', de: 'estabelece autoridade numa mesa de Summit.', para: 'estabelece autoridade numa mesa.', por: 'Q03: evento interno.' },
    { id: 'Q03-Summit-A09', de: '<strong>agora</strong> — na semana anterior ao Summit. Em', para: '<strong>agora</strong>. Em', por: 'Q03: evento interno.' },
    { id: 'Q03-Summit-A09b', de: ' no mês do Summit.', para: '.', por: 'Q03: evento interno.' },
    // "§ Caso" é marcador de seção da fonte, que o produto não tem; o porte anterior já dizia "caso do módulo".
    { id: 'marcador-§Caso', de: 'no § Caso.', para: 'no caso do módulo.', por: 'Marcador interno da fonte (§); mantida a leitura do porte anterior.' },
  ],
};
