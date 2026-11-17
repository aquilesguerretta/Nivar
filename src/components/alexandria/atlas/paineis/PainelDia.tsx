// Atlas da Alexandria v3 — capítulo "Um dia": o perfil horário médio de geração
// por fonte e de carga em cada subsistema, nos doze últimos meses completos.

import type { KeyboardEvent } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { dataBr, inteiro, mesBr } from '@/lib/alexandria/atlas/dados';
import { PALETA } from '@/lib/alexandria/atlas/estilo';
import { ROTULO_SUBSISTEMA, type IndiceDoAtlas, type SeriePerfilHorario, type Subsistema } from '@/lib/alexandria/atlas/tipos';
import { PerfilDoDia } from '../graficos';
import { ReguaDoTempo } from '../ReguaDoTempo';
import { ComoLer, NOTA_RORAIMA } from './PainelRede';
import { parcialDoIndice, textoDoMesParcial } from './Tempo';

interface PainelDiaProps {
  perfil: SeriePerfilHorario | null;
  indice: IndiceDoAtlas | null;
  mes: number;
  aoMudarMes: (i: number) => void;
  hora: number;
  aoMudarHora: (h: number) => void;
  modo: ModoV3;
  /** último dia publicado do mês em curso (AAAA-MM-DD); se não vier, é lido do índice */
  parcialAte?: string | null;
}

const SUBS: Subsistema[] = ['SE', 'S', 'NE', 'N'];

const MODOS_DO_DIA: { id: 'medio' | 'real'; nome: string }[] = [
  { id: 'medio', nome: 'Média do mês' },
  { id: 'real', nome: 'Um dia real' },
];

/** "Um dia" (leva 3, B3): o alternador entre o perfil médio do mês (o de sempre) e um dia real
 *  da operação, usina por usina. Dois rádios lado a lado; setas trocam, como em "Colorir por". */
export function AlternadorDoDia({ modo, aoMudar }: { modo: 'medio' | 'real'; aoMudar: (m: 'medio' | 'real') => void }) {
  const tecla = (e: KeyboardEvent<HTMLButtonElement>, k: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const alvo = e.key === 'Home' ? 0 : e.key === 'End' ? 1 : 1 - k;
    aoMudar(MODOS_DO_DIA[alvo].id);
    (e.currentTarget.parentElement?.children[alvo] as HTMLElement | undefined)?.focus();
  };
  return (
    <div className="atl-opcoes atl-opcoes-lado atl-alternador-dia" role="radiogroup" aria-label="O que o capítulo mostra">
      {MODOS_DO_DIA.map((m, k) => (
        <button key={m.id} type="button" role="radio" aria-checked={modo === m.id} tabIndex={modo === m.id ? 0 : -1} className="atl-opcao" onClick={() => aoMudar(m.id)} onKeyDown={(e) => tecla(e, k)}>
          {m.nome}
        </button>
      ))}
    </div>
  );
}

/** O rodapé de fontes do dia real: as fontes que o próprio arquivo declara (órgão, conjunto,
 *  data de acesso). Sem o arquivo, nada (a seção já diz que está carregando ou que falhou). */
export function FonteDoDiaReal({ dados }: { dados: unknown }) {
  const fontes = (dados as { fontes?: { orgao?: string; conjunto?: string; acesso?: string }[] } | null)?.fontes;
  if (!Array.isArray(fontes) || !fontes.length) return null;
  // uma linha curta (os órgãos e o acesso mais recente) e, sob "Fontes do dia", cada conjunto
  const orgaos = [...new Set(fontes.map((f) => f.orgao).filter((o): o is string => !!o))];
  const acesso = fontes
    .map((f) => f.acesso)
    .filter((a): a is string => !!a)
    .sort()
    .pop();
  return (
    <div className="atl-fonte-dia-real" data-atlas="fonte-dia-real">
      <p className="atl-fonte-linha">
        {orgaos.join(' e ')}
        {acesso ? (
          <>
            {' '}— acesso <span className="atl-num">{dataBr(acesso)}</span>
          </>
        ) : null}
      </p>
      <ComoLer rotulo="Fontes do dia">
        <ul className="atl-fonte-lista">
          {fontes.map((f, i) => (
            <li key={i}>
              {f.orgao ?? 'fonte'}
              {f.conjunto ? `, ${f.conjunto.replace('Dados Abertos · ', '')}` : ''}
              {f.acesso ? (
                <>
                  {' '}— acesso <span className="atl-num">{dataBr(f.acesso)}</span>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </ComoLer>
    </div>
  );
}

export function PainelDia({ perfil, indice, mes, aoMudarMes, hora, aoMudarHora, modo, parcialAte }: PainelDiaProps) {
  const p = PALETA[modo];
  if (!perfil) return <p className="atl-carregando">Carregando o perfil horário…</p>;
  const fonte = indice?.series.balanco.fontes[0];
  const emCurso = textoDoMesParcial(perfil.meses[mes], parcialAte ?? parcialDoIndice(indice?.series.balanco));
  const fontes: { chave: 'hidro' | 'termica' | 'eolica' | 'solar'; rotulo: string; cor: string }[] = [
    { chave: 'hidro', rotulo: 'Hidráulica', cor: p.categoria.hidro },
    { chave: 'termica', rotulo: 'Térmica', cor: p.categoria.gas },
    { chave: 'eolica', rotulo: 'Eólica', cor: p.categoria.eolica },
    { chave: 'solar', rotulo: 'Solar', cor: p.categoria.solar },
  ];
  // o mesmo teto para os quatro gráficos: as alturas podem ser comparadas
  let teto = 1;
  for (const s of SUBS) {
    for (let h = 0; h < 24; h++) {
      const ger = fontes.reduce((a, f) => a + Math.max(0, perfil.sub[s][f.chave][mes][h] ?? 0), 0);
      teto = Math.max(teto, ger, perfil.sub[s].carga[mes][h] ?? 0);
    }
  }
  return (
    <div className="atl-dia">
      <div className="atl-tempo">
        <p className="atl-tempo-mes">
          {String(hora).padStart(2, '0')}h <span className="atl-tempo-sub">dia médio de {mesBr(perfil.meses[mes])}{emCurso ? `, ${emCurso}` : ''}</span>
        </p>
        <ReguaDoTempo valor={hora} min={0} max={23} salto={6} rotulo="Hora do dia" falado={`${hora} horas`} aoMudar={aoMudarHora} marcas={24} />
        <div className="atl-seletor" role="group" aria-label="Mês do dia médio">
          <button type="button" className="atl-passo" onClick={() => aoMudarMes(Math.max(0, mes - 1))} disabled={mes <= 0} aria-label="Mês anterior">
            ‹
          </button>
          <span className="atl-seletor-mes" aria-live="polite">
            {mesBr(perfil.meses[mes])}
          </span>
          <button type="button" className="atl-passo" onClick={() => aoMudarMes(Math.min(perfil.meses.length - 1, mes + 1))} disabled={mes >= perfil.meses.length - 1} aria-label="Mês seguinte">
            ›
          </button>
          <span className="atl-seletor-nota">
            {mes + 1} de {perfil.meses.length} meses
          </span>
        </div>
      </div>

      <ul className="atl-legenda-series">
        {fontes.map((f) => (
          <li key={f.chave}>
            <span className="atl-amostra" style={{ background: f.cor }} aria-hidden="true" />
            {f.rotulo}
          </li>
        ))}
        <li>
          <span className="atl-traco atl-traco-carga" aria-hidden="true" />
          Carga
        </li>
      </ul>

      {SUBS.map((s) => {
        const d = perfil.sub[s];
        const ger = fontes.reduce((a, f) => a + Math.max(0, d[f.chave][mes][hora] ?? 0), 0);
        const carga = d.carga[mes][hora] ?? 0;
        return (
          <section key={s} className="atl-dia-sub">
            <header>
              <h2 className="atl-grupo-titulo">{ROTULO_SUBSISTEMA[s]}</h2>
              <p className="atl-dia-valores">
                gera <span className="atl-num">{inteiro(ger)}</span> · consome <span className="atl-num">{inteiro(carga)}</span> MW
              </p>
            </header>
            <PerfilDoDia
              camadas={fontes.map((f) => ({ chave: f.chave, cor: f.cor, valores: d[f.chave][mes] }))}
              carga={d.carga[mes]}
              hora={hora}
              aoMudar={aoMudarHora}
              teto={teto}
              descricao={`Perfil horário médio do subsistema ${ROTULO_SUBSISTEMA[s]} em ${mesBr(perfil.meses[mes])}: geração por fonte e carga.`}
            />
          </section>
        );
      })}

      {fonte && (
        <p className="atl-fonte-linha">
          {fonte.orgao}, {fonte.conjunto.replace('Dados Abertos · ', '')} — acesso <span className="atl-num">{dataBr(fonte.acesso)}</span>
        </p>
      )}
      <ComoLer>
        <p>No mapa, cada disco é a geração do subsistema naquela hora, repartida por fonte; o anel tracejado é a carga, na mesma escala de área. Disco maior que o anel: o subsistema exporta. Menor: importa.</p>
        <p>Média, em cada hora, de todos os dias do mês. A fonte reúne numa só série todas as térmicas (gás, carvão, óleo, biomassa e nuclear).</p>
        <p>{NOTA_RORAIMA}</p>
      </ComoLer>
    </div>
  );
}
