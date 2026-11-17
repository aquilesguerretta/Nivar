// Atlas da Alexandria v3 — ficha de uma entidade da operação hora a hora ("Um dia", dia real).
//
// A curva das 24 horas da entidade (geração verificada; o corte estimado por cima, vazado), os
// membros do conjunto (clicáveis para a usina do Atlas), o motivo do corte com o texto da fonte,
// a fonte e a data. Diz o que a fonte diz e o que ela não diz: o corte é estimativa do ONS; a
// geração do conjunto não se reparte entre os membros; o setor paraguaio de Itaipu não é do Brasil.

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { carregarUsinasMenores, carregarUsinasPrincipais, dataBr, potencia, type FeicaoUsina } from '@/lib/alexandria/atlas/dados';
import { PALETA } from '@/lib/alexandria/atlas/estilo';
import {
  chaveDoMembro,
  corteNaHora,
  diaBr,
  diaDe,
  geracaoNaHora,
  horaBr,
  lerChave,
  lerOperacao,
  membrosDoDia,
  mwInteiro,
  nomeLegivel,
  rotuloDaFonte,
  textoDoMotivo,
  type MomentoDaOperacao,
  type Operacao,
} from '@/lib/alexandria/atlas/operacao';
import { ROTULO_SUBSISTEMA } from '@/lib/alexandria/atlas/tipos';
import './atlas-operacao.css';

export interface PropsFichaDaOperacao {
  dados: Operacao;
  chave: string;
  momento: MomentoDaOperacao;
  aoFechar: () => void;
  aoSelecionar: (chave: string) => void;
  modo: ModoV3;
}

/** A entidade está na lista da conferência das que a fonte deu vazias nas 24 horas do dia. */
function semValorNoDia(conf: unknown, id: string): boolean {
  const l = (conf as { entidadesSemValorNoDia?: unknown } | null)?.entidadesSemValorNoDia;
  return Array.isArray(l) && l.some((x) => x === id || (typeof x === 'object' && x !== null && (x as { id?: unknown }).id === id));
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="atl-ficha-linha">
      <dt>{rotulo}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** A curva das 24 horas: geração em área cheia; o corte estimado empilhado por cima, vazado. */
function VinteQuatroHoras({ ger, corte, hora, cor, rotulo }: { ger: number[]; corte: number[] | null; hora: number; cor: string; rotulo: string }) {
  const W = 288;
  const H = 104;
  const topo = 14;
  const base = H - 16;
  const teto = Math.max(1, ...ger.map((g, h) => g + (corte?.[h] ?? 0)));
  const x = (h: number) => (h / 23) * W;
  const y = (v: number) => base - (v / teto) * (base - topo);
  const caminho = (vals: number[]) => vals.map((v, h) => `${h ? 'L' : 'M'}${x(h).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const area = `${caminho(ger)}L${W},${base}L0,${base}Z`;
  const somado = corte ? ger.map((g, h) => g + corte[h]) : null;
  const faixa = somado ? `${caminho(somado)}${ger.map((_, h) => `L${x(23 - h).toFixed(1)},${y(ger[23 - h]).toFixed(1)}`).join('')}Z` : null;
  const maior = Math.max(...ger);
  return (
    <figure className="atl-ficha-serie atl-op-curva">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={rotulo}>
        <line x1={0} x2={W} y1={base} y2={base} className="atl-op-curva-eixo" />
        <path d={area} style={{ fill: cor }} className="atl-op-curva-ger" />
        {faixa && <path d={faixa} style={{ stroke: cor }} className="atl-op-curva-corte" />}
        <line x1={x(hora)} x2={x(hora)} y1={topo - 4} y2={base} className="atl-op-curva-cursor" />
        {[0, 6, 12, 18, 23].map((h) => (
          <text key={h} x={x(h)} y={H - 3} textAnchor={h === 0 ? 'start' : h === 23 ? 'end' : 'middle'} className="atl-op-curva-hora">
            {h}h
          </text>
        ))}
        <text x={2} y={10} className="atl-op-curva-rotulo">
          maior hora: {mwInteiro(maior)} MW
        </text>
      </svg>
      <figcaption>
        <span className="atl-op-chip" style={{ background: cor }} aria-hidden="true" /> geração verificada
        {faixa && (
          <>
            , <span className="atl-op-chip atl-op-chip-corte" style={{ borderColor: cor }} aria-hidden="true" /> corte estimado pelo ONS
          </>
        )}
        . MW médios em cada hora.
      </figcaption>
    </figure>
  );
}

export function FichaDaOperacao({ dados, chave, momento, aoFechar, aoSelecionar, modo }: PropsFichaDaOperacao) {
  const titulo = useRef<HTMLHeadingElement>(null);
  const m = useMemo(() => lerOperacao(dados), [dados]);
  const alvo = lerChave(chave);
  const e = alvo?.tipo === 'entidade' ? (m.porId.get(alvo.id) ?? null) : null;
  const [usinas, setUsinas] = useState<Map<string, FeicaoUsina> | null>(null);

  useEffect(() => {
    const k = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') aoFechar();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [aoFechar]);

  // os membros do conjunto NO DIA MOSTRADO (a relação do ONS tem data de início e de fim): nome e
  // potência do cadastro do Atlas (o mesmo cache do mapa)
  const diaMostrado = diaDe(m, momento.dia);
  const doDia = e ? membrosDoDia(diaMostrado, e) : null;
  const membros = useMemo(() => doDia?.membros ?? [], [doDia?.membros]);
  useEffect(() => {
    if (!membros.length) return;
    let vivo = true;
    const mapa = new Map<string, FeicaoUsina>();
    carregarUsinasPrincipais()
      .then((us) => {
        for (const u of us) mapa.set(u.properties.ceg, u);
        if (membros.every((c) => mapa.has(c))) return null;
        return carregarUsinasMenores();
      })
      .then((us) => {
        for (const u of us ?? []) mapa.set(u.properties.ceg, u);
        if (vivo) setUsinas(mapa);
      })
      .catch(() => vivo && setUsinas(mapa));
    return () => {
      vivo = false;
    };
  }, [membros]);

  const dia = diaMostrado;
  if (!e || !dia || !doDia)
    return (
      <aside className="atl-ficha atl-op-ficha" aria-label="Item não encontrado">
        <header className="atl-ficha-cabeca">
          <h2 className="atl-ficha-titulo">Sem dado</h2>
          <button type="button" className="atl-ficha-fechar" onClick={aoFechar} aria-label="Fechar a ficha">
            Fechar
          </button>
        </header>
        <div className="atl-ficha-corpo">
          <p className="atl-nota atl-ausencia">
            {alvo?.tipo === 'membro'
              ? 'Esta usina não está no cadastro do Atlas. Ela é membro de um conjunto do ONS, que não publica a geração dela sozinha.'
              : !e
                ? 'Esta entidade não está no arquivo da operação desta versão.'
                : `O dia ${momento.dia} não está no arquivo desta versão.`}
          </p>
        </div>
      </aside>
    );

  const p = PALETA[modo];
  const h = Math.max(0, Math.min(23, Math.round(momento.hora)));
  const serie = dia.mw[e.i];
  const ger = serie ? serie.slice(0, 24).map((v) => Math.max(0, v ?? 0)) : null;
  const corte = dia.corte.get(e.i) ?? null;
  const g = geracaoNaHora(dia, e.i, h);
  const c = corteNaHora(dia, e.i, h);
  const corteDia = corte ? corte.mw.reduce((s, v) => s + v, 0) : 0;
  const motivoHora = corte?.motivoPorHora[h] ?? null;
  const conjunto = e.tipo === 'conjunto';
  const subDoMes = dia.subNoArquivoDoMes.get(e.i) ?? null;
  // o dia mais novo do arquivo: o da composição e do ponto de `entidades`
  const ultimoDia = m.dias.length ? m.dias.map((x) => x.dia).sort()[m.dias.length - 1] : null;
  const sobre = `${conjunto ? 'Conjunto de usinas do ONS' : 'Usina despachada pelo ONS'} · ${rotuloDaFonte(e.cat)}`;
  const defCorte = m.definicoes.naoRealizadaEstimada;
  const fonteDe = (re: RegExp) => m.fontes.find((f) => re.test(`${f.conjunto ?? ''}`));
  const fontes = [
    fonteDe(/gera[cç][aã]o por usina/i),
    corte ? fonteDe(e.cat === 'solar' ? /fotovolt/i : /e[oó]lic/i) : null,
    conjunto ? fonteDe(/relacionamento|membros/i) : null,
    fonteDe(/SIGA/i),
  ].filter((f, i, a): f is NonNullable<typeof f> => !!f && a.indexOf(f) === i);

  return (
    <aside className="atl-ficha atl-op-ficha" aria-label={`${sobre}: ${nomeLegivel(e.nome)}`}>
      <header className="atl-ficha-cabeca">
        <p className="v-dado atl-ficha-sobre">
          <span className="atl-op-chip" style={{ background: p.categoria[e.cat] }} aria-hidden="true" />
          {sobre}
        </p>
        <h2 className="atl-ficha-titulo" tabIndex={-1} ref={titulo}>
          {nomeLegivel(e.nome)}
        </h2>
        <button type="button" className="atl-ficha-fechar" onClick={aoFechar} aria-label="Fechar a ficha">
          Fechar
        </button>
      </header>
      <div className="atl-ficha-corpo">
        <div className="atl-ficha-heroi">
          <p className="atl-ficha-heroi-rotulo">
            Geração às {horaBr(h)} de {diaBr(dia.dia)}
          </p>
          {ger ? (
            <p className="atl-ficha-heroi-valor">
              {mwInteiro(g)}
              <span className="atl-ficha-heroi-unidade">MW</span>
            </p>
          ) : (
            <p className="atl-nota atl-ausencia">
              {semValorNoDia(dia.conferencia, e.id)
                ? 'A fonte publicou a geração desta entidade sem valor neste dia: vazio, que não é zero. Por isso ela não aparece no mapa.'
                : 'O ONS não publica a geração desta entidade neste dia; ela não aparece no mapa.'}
            </p>
          )}
          {c >= 0.5 && (
            <p className="atl-ficha-heroi-linha">
              e <span className="atl-num">{mwInteiro(c)}</span> MW deixaram de ser gerados por corte do ONS nesta hora (estimativa do ONS, não medição)
            </p>
          )}
          {e.foraDoBrasil && <p className="atl-ficha-heroi-linha atl-op-aviso">{e.obs ?? 'Setor paraguaio de Itaipu: não entra na geração do Brasil.'}</p>}
        </div>

        {ger && (
          <VinteQuatroHoras
            ger={ger}
            corte={corte ? corte.mw : null}
            hora={h}
            cor={p.categoria[e.cat]}
            rotulo={`Geração de ${nomeLegivel(e.nome)} em cada hora de ${diaBr(dia.dia)}${corte ? ', com o corte estimado por cima' : ''}`}
          />
        )}

        <dl className="atl-ficha-dados">
          {corte && corteDia >= 0.5 && (
            <Linha rotulo="Corte no dia">
              <span className="atl-num">{mwInteiro(corteDia)}</span> MWh estimados
              {Object.keys(corte.porMotivo).length > 1 && (
                <span className="atl-op-sub">
                  {Object.entries(corte.porMotivo)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => `${k} ${mwInteiro(v)} MWh`)
                    .join(' · ')}
                </span>
              )}
            </Linha>
          )}
          {corte && (corte.dominante || motivoHora) && (
            <Linha rotulo="Motivo">
              {textoDoMotivo(m, motivoHora ?? corte.dominante)}
              {motivoHora && corte.dominante && motivoHora !== corte.dominante ? <span className="atl-op-sub">No dia, o motivo de mais MWh foi {textoDoMotivo(m, corte.dominante)}.</span> : null}
              {corte.origem && <span className="atl-op-sub">Origem {m.origens[corte.origem] ?? corte.origem} ({corte.origem}).</span>}
              {corte.texto && <q className="atl-op-citacao">{corte.texto}</q>}
            </Linha>
          )}
          <Linha rotulo="Fonte de energia">{rotuloDaFonte(e.cat)}</Linha>
          <Linha rotulo="Onde">
            {[e.uf, e.sub ? ROTULO_SUBSISTEMA[e.sub] : null].filter(Boolean).join(' · ') || 'sem dado na fonte'}
            {subDoMes && e.sub && (
              <span className="atl-op-sub">
                No arquivo de geração deste mês, o ONS dá {ROTULO_SUBSISTEMA[subDoMes]}. O balanço por subsistema do ONS deste mesmo dia e a relação de conjuntos
                dão {ROTULO_SUBSISTEMA[e.sub]}, que é o que o Atlas usa.
              </span>
            )}
            {!e.lonlat && <span className="atl-op-sub">Sem ponto no mapa: nenhuma usina do cadastro do Atlas corresponde a esta entidade.</span>}
            {conjunto && e.lonlat && (
              <span className="atl-op-sub">
                O ponto do conjunto é a média das posições das usinas dele{doDia.doDia && ultimoDia ? `, como estavam em ${diaBr(ultimoDia)}` : ''}.
              </span>
            )}
          </Linha>
          {doDia.kw != null &&
            (e.cegEmLinhas.length ? (
              <Linha rotulo="Potência">
                {potencia(doDia.kw)} na ANEEL para a usina inteira
                <span className="atl-op-sub">
                  O ONS publica esta usina da ANEEL em {e.cegEmLinhas.length + 1} linhas (esta e {e.cegEmLinhas.map((id) => nomeLegivel(m.porId.get(id)?.nome ?? id)).join(', ')}); a
                  potência desta linha sozinha não está no cadastro.
                </span>
              </Linha>
            ) : (
              <Linha rotulo={conjunto ? 'Potência dos membros' : 'Potência'}>
                {potencia(doDia.kw)} (ANEEL, em operação)
                {conjunto && doDia.doDia && <span className="atl-op-sub">Somada só dos membros deste dia.</span>}
              </Linha>
            ))}
          {e.mod && <Linha rotulo="Modalidade no ONS">{e.mod}</Linha>}
          <Linha rotulo="Como o ONS escreve">
            {e.nome}
            <span className="atl-op-sub">id {e.id}</span>
          </Linha>
        </dl>

        {conjunto && (
          <section className="atl-ficha-conjunto" aria-label="Usinas do conjunto">
            <p className="atl-ficha-conjunto-titulo">
              {membros.length} {membros.length === 1 ? 'usina' : 'usinas'} no conjunto em {diaBr(dia.dia)}
            </p>
            <p className="atl-op-sub atl-op-sub-bloco">
              O ONS publica a geração somada; ela não é repartida entre as usinas. A lista é a da relação do ONS vigente neste dia
              {doDia.doDia && ultimoDia ? ` (em ${diaBr(ultimoDia)} eram ${e.membros.length})` : ''}.
            </p>
            <ul className="atl-op-membros">
              {membros.map((ceg) => {
                const u = usinas?.get(ceg);
                return (
                  <li key={ceg}>
                    <button type="button" className="atl-ficha-conjunto-item" onClick={() => aoSelecionar(chaveDoMembro(ceg))}>
                      <span>{u?.properties.nome ?? ceg}</span>
                      {u && <span className="atl-op-membro-kw">{potencia(u.properties.kw)}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            {doDia.membrosSemPonto != null && doDia.membrosSemPonto > 0 && (
              <p className="atl-op-sub atl-op-sub-bloco">
                Mais {doDia.membrosSemPonto} {doDia.membrosSemPonto === 1 ? 'usina' : 'usinas'} da relação do ONS sem usina correspondente no Atlas.
              </p>
            )}
          </section>
        )}

        {corte && defCorte && <p className="atl-nota atl-op-def">{defCorte}</p>}

        <div className="atl-ficha-fonte">
          <p className="atl-ficha-fonte-kicker">Fonte</p>
          <ul>
            {fontes.map((f) => (
              <li key={f.conjunto}>
                {f.orgao}, {f.conjunto}
                {f.acesso ? (
                  <>
                    {' '}
                    · acesso <span className="atl-num">{dataBr(f.acesso)}</span>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default FichaDaOperacao;
