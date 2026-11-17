// Configuração do porte dos instrumentos do M16 e do M17 (gerar-instrumentos-m16-m17.mjs).
//
// Por instrumento: onde começa a IIFE na fonte (marcador do comentário de
// seção), o `kind` do contrato, e quais alvos do script viram o painel de
// texto (na ordem em que a página os mostra). Rótulo de chip: a fonte não
// rotula os chips gerados pelo script; o rótulo é a palavra que a instrução do
// próprio instrumento usa para eles ("Escolha … a tendência", "Escolha o
// dispositivo", "Doze enunciados").

const EDITORIAIS = [
  ['GridAlpha', 'NIVAR'], // P24
  ['declarada no &sect;00.6', 'declarada na abertura do módulo'], // §00 não é tela da aula v3
  ['declarada no §00.6', 'declarada na abertura do módulo'],
];

// M17: chips sem rótulo na fonte recebem a palavra que a instrução do próprio
// instrumento usa ("Escolha uma das quatro dimensões", "um par de jurisdições",
// "uma jurisdição", "um instrumento", "um mecanismo estrangeiro", "Filtre por tipo
// de defeito"). `chave` é o nome da função do instrumento dentro de criarFonte.
const M17 = (n, extra) => ({ id: `m17-inst-${n}`, chave: `i${n}`, marcador: new RegExp(`^   i${n} — `), ...extra });

export const CONFIG = {
  17: {
    editoriaisDaSaida: EDITORIAIS,
    instrumentos: [
      M17('01', { genero: 'Mapa', kind: 'explorador', textos: ['i01-out', 'i01-v'], rotulos: { 'i01-dim': 'Dimensão' },
        // grupo em que o mapa põe o Brasil na dimensão escolhida (rótulo do grupo, como o mapa o escreve)
        extratores: {
          'i01-grupo-brasil': (b) => {
            const r = [...(b['i01-out'] || '').matchAll(/<div class="gk">([^<]*)<\/div><div class="gv">([\s\S]*?)<\/div>/g)].find((x) => x[2].includes('<b>Brasil</b>'));
            return r ? r[1] : null;
          },
        } }),
      M17('02', { kind: 'quebra-cabeca', textos: ['i02-rows', 'i02-v'], alvoDasLinhas: 'i02-rows' }),
      M17('03', { kind: 'comparador', textos: ['i03-out', 'i03-v'], rotulos: { 'i03-par': 'Par de jurisdições', 'i03-dim': 'Dimensão' },
        // "Parcela vinculante: <dotação|desenho|política>."
        extratores: {
          'i03-vinculante': (b) => {
            const m = (b['i03-v'] || '').match(/Parcela vinculante: ([^.<]+)\./);
            return m ? m[1] : null;
          },
        } }),
      M17('04', { kind: 'explorador', textos: ['i04-out', 'i04-v'], rotulos: { 'i04-jur': 'Jurisdição', 'i04-dim': 'Dimensão de desenho' } }),
      M17('05', { kind: 'explorador', textos: ['i05-out', 'i05-v'], rotulos: { 'i05-jur': 'Jurisdição' } }),
      M17('06', { kind: 'calculadora', textos: ['i06-v'], paineisRo: ['i06-r'] }),
      M17('07', { kind: 'explorador', textos: ['i07-out', 'i07-v'], rotulos: { 'i07-obj': 'Instrumento' },
        // posição na régua, como o painel a escreve
        extratores: {
          'i07-posicao': (b) => {
            const m = (b['i07-out'] || '').match(/Posição na régua<\/div><div class="gv"><b>([^<]+)<\/b>/);
            return m ? m[1] : null;
          },
        } }),
      M17('08', { kind: 'explorador', textos: ['i08-out', 'i08-v'], rotulos: { 'i08-mec': 'Mecanismo estrangeiro' } }),
      M17('09', { kind: 'calculadora', textos: ['i09-v'], paineisRo: ['i09-r'], rotulos: { 'i09-set': 'Setor' } }),
      M17('10', { kind: 'calculadora', textos: ['i10-v'], paineisRo: ['i10-r'] }),
      M17('11', { kind: 'comparador', textos: ['i11-v'], paineisRo: ['i11-r'] }),
      M17('12', { genero: 'Instrumento', kind: 'explorador', textos: ['i12-out'], rotulos: { 'i12-fil': 'Tipo de defeito' }, navegacao: { rotulo: 'Enunciado', n: 12 },
        // defeito dominante do enunciado mostrado, como o painel o escreve
        extratores: {
          'i12-defeito': (b) => {
            const m = (b['i12-out'] || '').match(/Defeito dominante<\/div><div class="gv"><b>([^<]+)<\/b>/);
            return m ? m[1] : null;
          },
        } }),
    ],
  },
  16: {
    helpers: ['esc', 'clamp', 'numOf', 'fmt'],
    dadosComuns: [{ de: /^var TND=\{/, ate: /^\};/ }],
    editoriaisDaSaida: EDITORIAIS,
    instrumentos: [
      // §MAP: entra na Aula 01 (guia de porte, 15/11). O rótulo "§MAP" é barrado pelo gridalpha-detect (P0, S4);
      // vai o nome da seção na fonte (sec-id "§MAP · Mapa das seis tendências") como gênero: "Mapa", como no M04 e no M13.
      { id: 'm16-inst-01', genero: 'Mapa', marcador: /^\/\* =+ INST·01 /, kind: 'explorador', textos: ['mp-flux', 'mp-panel'], rotuloDosChips: 'Tendência',
        // a extração descreve os chips em prosa; a lista é a de TND, na ordem de ORD.est (a dimensão padrão)
        opcoesDosChips: (e) => e.dados.ORD.valor.est.map((k) => ({ valor: k, rotulo: e.dados.TND.valor[k].n })),
        // última tendência da fila (6º) na dimensão escolhida, como a fila a escreve ("Demanda")
        extratores: {
          'mp-ultima': (b) => {
            const m = [...(b['mp-flux'] || '').matchAll(/<span class="fzv">([^<]+)</g)];
            return m.length ? m[m.length - 1][1] : null;
          },
        } },
      { id: 'm16-inst-02', marcador: /^\/\* =+ INST·02 /, kind: 'explorador', textos: ['rg-out', 'rg-vd'],
        // posição real da tendência: o veredito diz "a posição correta hoje é a N", ou "É esta a posição"
        extratores: {
          'rg-posicao-correta': (b, e) => {
            const vd = b['rg-vd'] || '';
            const m = vd.match(/posição correta hoje é a (\d)/);
            if (m) return m[1];
            return vd.includes('É esta a posição') ? String(e['rg-pos'] ?? 1) : null;
          },
        } },
      { id: 'm16-inst-03', marcador: /^\/\* =+ INST·03 /, kind: 'comparador', textos: ['gg-out', 'gg-vd'],
        // candidato que vincula: "Gargalo vinculante em 4 de agosto de 2026: <nome>."
        extratores: {
          'gg-vinculante': (b) => {
            const m = (b['gg-vd'] || '').match(/Gargalo vinculante em 4 de agosto de 2026: ([^.<]+)\./);
            return m ? m[1] : null;
          },
        } },
      { id: 'm16-inst-04', marcador: /^\/\* =+ INST·04 /, kind: 'simulador', textos: ['fc-vd'] },
      { id: 'm16-inst-05', marcador: /^\/\* =+ INST·05 /, kind: 'simulador', textos: ['ar-vd'] },
      { id: 'm16-inst-06', marcador: /^\/\* =+ INST·06 /, kind: 'simulador', textos: ['am-vd'] },
      { id: 'm16-inst-07', marcador: /^\/\* =+ INST·07 /, kind: 'explorador', textos: ['cb-panel'], rotuloDosChips: 'Dispositivo' },
      { id: 'm16-inst-08', marcador: /^\/\* =+ INST·08 /, kind: 'comparador', textos: ['e2-locm', 'e2-mktm', 'e2-vd'] },
      { id: 'm16-inst-09', marcador: /^\/\* =+ INST·09 /, kind: 'simulador', textos: ['dc-vd'] },
      { id: 'm16-inst-10', marcador: /^\/\* =+ INST·10 /, kind: 'explorador', textos: ['gp-out'] },
      { id: 'm16-inst-11', marcador: /^\/\* =+ INST·11 /, kind: 'explorador', textos: ['vf-panel'], rotuloDosChips: 'Enunciado',
        // defeito dominante do enunciado escolhido, como o painel o escreve ("A · estágio confundido")
        extratores: {
          'vf-defeito': (b) => {
            const m = (b['vf-panel'] || '').match(/Defeito dominante<\/div><div class="n sm gold">([^<]+)</);
            return m ? m[1] : null;
          },
        } },
    ],
  },
};
