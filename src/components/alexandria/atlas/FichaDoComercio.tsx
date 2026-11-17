// Atlas da Alexandria v3 — ficha do capítulo "O comércio": uma viagem (navio ou avião), uma
// interligação elétrica por terra ou a chegada por duto. Diz o que o Comex Stat e o ONS dizem,
// e o que eles não dizem (a URF não é o cais, o país pode ser entreposto, a rota é esquemática,
// a via aérea não diz se é carga). Nenhum número que não esteja no arquivo.

import { useEffect, useRef, type ReactNode } from 'react';
import type { ModoV3 } from '@/components/alexandria/v3/usoV3';
import { dataBr } from '@/lib/alexandria/atlas/dados';
import {
  MESES_CURTOS,
  chaveDaViagem,
  doProdutoNoSentido,
  dolares,
  kmAproximado,
  lerChave,
  lugarDaUrf,
  medidoEmValor,
  fonteDasRotas,
  nomeDoPortao,
  nomeDoPais,
  nomeDoProduto,
  quanto,
  semArquivo,
  toneladas,
  viagensDe,
  type ClasseDoVeiculo,
  type Comercio,
  type Sentido,
} from '@/lib/alexandria/atlas/comercio';
import { Num } from './paineis/PainelComercio';
import './atlas-comercio.css';

export interface PropsFichaDoComercio {
  dados: Comercio;
  chave: string;
  aoFechar: () => void;
  aoSelecionar: (chave: string) => void;
  modo: ModoV3;
}

const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

const VEICULO: Record<ClasseDoVeiculo, string> = {
  petroleiro: 'navio petroleiro',
  graneleiro: 'navio graneleiro',
  gaseiro: 'navio gaseiro',
  carga: 'navio de carga',
  aviao: 'avião',
};
const SENTIDO: Record<Sentido, string> = { exportacao: 'Exportação', importacao: 'Importação' };

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="atl-ficha-linha">
      <dt>{rotulo}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Heroi({ rotulo, valor, linha }: { rotulo: string; valor: string; linha?: ReactNode }) {
  const m = valor.match(/^(US\$ )?([\d.,]+)\s*(.*)$/);
  return (
    <div className="atl-ficha-heroi">
      <p className="atl-ficha-heroi-rotulo">{rotulo}</p>
      <p className="atl-ficha-heroi-valor">
        {m ? (
          <>
            {m[1] && <span className="atl-ficha-heroi-unidade atl-comercio-moeda">US$</span>}
            {m[2]}
            {m[3] && <span className="atl-ficha-heroi-unidade">{m[3]}</span>}
          </>
        ) : (
          valor
        )}
      </p>
      {linha && <p className="atl-ficha-heroi-linha">{linha}</p>}
    </div>
  );
}

/** Os doze meses nos dois sentidos: saída para cima (tinta), entrada para baixo (ouro). */
const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** Os doze meses nos dois sentidos. Leva 4: mês com horas faltando no ONS sai em barra vazada. */
function DozeMeses({ ex, im, ano, horasPorMes, horasDosMeses }: { ex: number[]; im: number[]; ano: number; horasPorMes?: number[]; horasDosMeses?: number[] | null }) {
  const incompleto = (i: number) => !!horasPorMes && !!horasDosMeses && horasPorMes[i] < horasDosMeses[i];
  const algumIncompleto = ex.some((_, i) => incompleto(i));
  const W = 288;
  const H = 112;
  // uma escala só para os dois sentidos: a altura de barra disponível se divide entre o maior
  // mês de saída e o maior mês de entrada (o eixo fica onde a proporção põe)
  const topo = 14;
  const barras = H - topo - 14;
  const maxEx = Math.max(0, ...ex);
  const maxIm = Math.max(0, ...im);
  const esc = barras / Math.max(1, maxEx + maxIm);
  const alto = maxEx * esc;
  const baixo = maxIm * esc;
  const meio = topo + alto;
  const passo = W / 12;
  const larg = passo * 0.62;
  return (
    <figure className="atl-ficha-serie atl-comercio-meses">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Intercâmbio mensal de ${ano}, MWh: saída e entrada`}>
        <line x1={0} x2={W} y1={meio} y2={meio} className="atl-comercio-meses-eixo" />
        {ex.map((v, i) => {
          const h = Math.min(alto, v * esc);
          return v > 0 ? (
            <rect key={`e${i}`} x={i * passo + (passo - larg) / 2} y={meio - h} width={larg} height={Math.max(h, 0.8)} className={`atl-comercio-meses-ex${incompleto(i) ? ' atl-comercio-meses-incompleto' : ''}`} />
          ) : null;
        })}
        {im.map((v, i) => {
          const h = Math.min(baixo, v * esc);
          return v > 0 ? (
            <rect key={`i${i}`} x={i * passo + (passo - larg) / 2} y={meio} width={larg} height={Math.max(h, 0.8)} className={`atl-comercio-meses-im${incompleto(i) ? ' atl-comercio-meses-incompleto' : ''}`} />
          ) : null;
        })}
        {MESES_CURTOS.map((m, i) => (
          <text key={m} x={i * passo + passo / 2} y={H - 2} textAnchor="middle" className="atl-comercio-meses-mes">
            {m[0]}
          </text>
        ))}
        <text x={2} y={10} className="atl-comercio-meses-rotulo">
          maior mês de saída: {nf0.format(maxEx)} MWh
        </text>
      </svg>
      <figcaption>
        Por mês, {ano}: <span className="atl-comercio-chip atl-comercio-chip-ex" aria-hidden="true" /> saída do Brasil,{' '}
        <span className="atl-comercio-chip atl-comercio-chip-im" aria-hidden="true" /> entrada. MWh.
        {algumIncompleto && horasPorMes && horasDosMeses && (
          <>
            {' '}
            <span className="atl-comercio-chip atl-comercio-chip-vazado" aria-hidden="true" /> barra vazada: mês com horas faltando no ONS (
            {ex
              .map((_, i) => i)
              .filter(incompleto)
              .map((i) => `${MESES_CURTOS[i]} ${nf0.format(horasPorMes[i])} de ${nf0.format(horasDosMeses[i])} h`)
              .join('; ')}
            ).
          </>
        )}
      </figcaption>
    </figure>
  );
}

export function FichaDoComercio({ dados: d, chave, aoFechar, aoSelecionar }: PropsFichaDoComercio) {
  const titulo = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [aoFechar]);

  const alvo = lerChave(chave);
  const fc = d.fontes?.comex;
  const ons = d.fontes?.ons;
  const leiaAerea = d.leia.find((t) => t.startsWith('Via aérea'));

  let sobre = '';
  let nome = '';
  let marca = '';
  let corpo: ReactNode = null;
  let heroi: ReactNode = null;
  let depois: ReactNode = null;
  let fontes: ReactNode = null;
  /** leva 4: as ressalvas vão, com a fonte, para um único "Sobre este dado" recolhido */
  let ressalvas: ReactNode = null;

  if (alvo?.tipo === 'viagem') {
    const v = viagensDe(d).find((x) => x.id === alvo.id);
    if (!v) return <FichaAusente aoFechar={aoFechar} />;
    const p = d.produtos.find((x) => x.id === v.produto);
    const r = d.rotas?.[v.rota];
    const a = d.ancoras?.[v.urf];
    const pais = nomeDoPais(d, v.pais);
    const aerea = v.via === 'aérea' || v.classe === 'aviao';
    const valor = medidoEmValor(p);
    sobre = `${SENTIDO[v.sentido]} · ${VEICULO[v.classe] ?? 'navio'}`;
    nome = `${nomeDoProduto(d, v.produto)} ${v.sentido === 'exportacao' ? '→' : '←'} ${pais}`;
    marca = v.sentido;
    // leva 4, ficha em três degraus: título; UMA linha com de onde → para onde · peso · valor; e um
    // único "Sobre este dado" recolhido com as ressalvas e a fonte
    const lugar = a ? (a.municipio ?? a.nome) : lugarDaUrf(d, v.urf);
    const [de, para] = v.sentido === 'exportacao' ? [lugar, pais] : [pais, lugar];
    heroi = (
      <div className="atl-comercio-resposta">
        <p className="atl-comercio-resposta-linha">
          {de} → {para}{' '}
          <span className="atl-comercio-resposta-numeros">
            · <Num texto={valor ? `${dolares(v.fobUS)} FOB` : toneladas(v.kt)} />
            {!valor && v.fobUS > 0 ? (
              <>
                {' '}
                · <Num texto={dolares(v.fobUS)} />
              </>
            ) : null}
          </span>
        </p>
        <p className="atl-comercio-resposta-sub">
          <span className="atl-num">{nf1.format(v.pctDoProduto)}%</span> {valor ? 'do valor ' : ''}
          {doProdutoNoSentido(d, v.produto, v.sentido)} pelo Brasil em {d.ano} · via {v.via}
          {r?.km ? (
            <>
              {' '}
              · rota ≈&nbsp;<Num texto={kmAproximado(r.km).replace(/^≈ /, '')} />
            </>
          ) : null}
        </p>
        {/* leva 4: onde a rota termina e por quê, numa linha visível, em TODA rota */}
        <p className="atl-comercio-resposta-fim">
          {aerea
            ? 'O arco termina no centro do país: o dado não diz o aeroporto de destino, e não é rota de voo.'
            : `A rota termina na costa ${v.sentido === 'exportacao' ? 'do país' : 'do país de origem'} mais próxima pelo mar: o dado não diz o porto.`}
          {r?.portoes?.length ? ` Passa pelo ${r.portoes.map((x) => nomeDoPortao(d, x)).join(' e pelo ')}.` : ''}
          {r?.contorno ? ` ${r.contorno}` : ''}
        </p>
      </div>
    );
    // os outros produtos do mesmo par URF–país (a mesma rota), nos dois sentidos
    const doPar = viagensDe(d)
      .filter((x) => x.rota === v.rota && x.id !== v.id)
      .sort((x, y) => y.kt - x.kt);
    corpo = null;
    ressalvas = (
      <>
        <p>
          {lugar}: URF {a?.nome ?? v.urf}, a unidade da Receita onde a carga foi despachada, não o cais nem o terminal.
        </p>
        <p>
          {pais}: país {v.sentido === 'exportacao' ? 'de destino' : 'de origem'} declarado; pode ser entreposto ou bandeira.
        </p>
        <p>
          {aerea
            ? 'Arco esquemático, do aeroporto ao centro do país; não é rota de voo.'
            : 'Rota esquemática: traçado ilustrativo, não o caminho dos navios; o comprimento sai arredondado a centenas de km.'}
        </p>
        {valor && v.kt > 0 && <p>Peso declarado: {toneladas(v.kt)} (o produto se mede em valor).</p>}
        {aerea && leiaAerea && <p>{semArquivo(leiaAerea)}</p>}
      </>
    );
    depois = (
      <>
        {doPar.length > 0 && (
          <section className="atl-ficha-conjunto" aria-label="Outros produtos do mesmo par">
            <p className="atl-ficha-conjunto-titulo">
              Também entre {lugarDaUrf(d, v.urf)} e {pais}
            </p>
            <ul>
              {doPar.map((x) => (
                <li key={x.id}>
                  <button type="button" className="atl-ficha-conjunto-item" onClick={() => aoSelecionar(chaveDaViagem(x.id))}>
                    {nomeDoProduto(d, x.produto)} {x.sentido === 'exportacao' ? '→' : '←'} <Num texto={quanto(d, x.produto, x.kt, x.fobUS)} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </>
    );
    fontes = (
      <>
        <li>
          {fc?.orgao ?? 'MDIC/SECEX'}, {fc?.conjunto ?? 'Comex Stat'}, {d.ano}
          {fc?.acesso ? (
            <>
              {' '}
              · acesso <span className="atl-num">{dataBr(fc.acesso)}</span>
            </>
          ) : null}
        </li>
        {a?.fonteDaCoordenada && (
          <li>
            Ponto da URF: {a.fonteDaCoordenada.orgao}, {semArquivo(a.fonteDaCoordenada.conjunto)}
            {a.fonteDaCoordenada.item ? ` (${a.fonteDaCoordenada.item})` : ''}
          </li>
        )}
        {!aerea && fonteDasRotas(d) && <li>Traçado: {semArquivo(fonteDasRotas(d) ?? '')}</li>}
      </>
    );
  } else if (alvo?.tipo === 'eletrica') {
    const pontos = (d.eletricidade?.interligacoes ?? []).filter((i) => i.pais === alvo.pais);
    const serieId = pontos.find((i) => i.serie)?.serie ?? null;
    const serie = serieId ? d.eletricidade?.paises?.[serieId] : null;
    const pais = pontos[0]?.paisNome ?? nomeDoPais(d, alvo.pais);
    const fluxosEl = d.fluxos.filter((f) => f.produto === 'eletricidade' && f.pais === alvo.pais);
    sobre = 'Interligação elétrica por terra';
    nome = `Brasil e ${pais}`;
    marca = 'conversora';
    const horasDoAno = d.eletricidade?.horasDoAno ?? null;
    const horasDosMeses = d.eletricidade?.horasDosMeses ?? null;
    if (serie) {
      const ex = serie.exportacaoMWh.reduce((s, x) => s + x, 0);
      const im = serie.importacaoMWh.reduce((s, x) => s + x, 0);
      // leva 4: a soma é a das horas que o ONS publicou (8.424 de 8.760 na Argentina), não do ano inteiro
      const faltam = serie.horas != null && horasDoAno ? horasDoAno - serie.horas : 0;
      const mesesIncompletos =
        serie.horasPorMes && horasDosMeses ? serie.horasPorMes.map((h, i) => ({ i, falta: horasDosMeses[i] - h })).filter((m) => m.falta > 0).sort((a, b) => b.falta - a.falta) : [];
      heroi = (
        <Heroi
          rotulo={`Saiu do Brasil em ${d.ano} (ONS)`}
          valor={`${nf1.format(ex / 1000)} GWh`}
          linha={
            <>
              e entraram <Num texto={`${nf1.format(im / 1000)} GWh`} />
              {faltam > 0 && serie.horas ? (
                <>
                  ; soma das <Num texto={`${nf0.format(serie.horas)} horas`} /> que o ONS publicou (faltam <span className="atl-num">{nf0.format(faltam)}</span>
                  {/* o mês que mais falta, com o número (em março faltam 144 de 336: não é "a maioria") */}
                  {mesesIncompletos[0] ? `, ${nf0.format(mesesIncompletos[0].falta)} delas em ${MESES_LONGOS[mesesIncompletos[0].i]}` : ''})
                </>
              ) : (
                ', soma dos doze meses'
              )}
            </>
          }
        />
      );
      depois = <DozeMeses ex={serie.exportacaoMWh} im={serie.importacaoMWh} ano={d.ano} horasPorMes={serie.horasPorMes} horasDosMeses={horasDosMeses} />;
    }
    // leva 4: "via declarada no despacho: rodoviária", com a frase do arquivo uma vez sob as linhas
    const fraseDaVia = d.leia.find((t) => t.startsWith('Eletricidade:'))?.match(/^Eletricidade:\s*(.*?transmissão)\./)?.[1] ?? null;
    const comPonto = fluxosEl.filter((f) => !f.urfs.every((u) => u.urf === '9999999'));
    const semPonto = fluxosEl.filter((f) => f.urfs.every((u) => u.urf === '9999999'));
    corpo = (
      <>
        <Linha rotulo={pontos.length > 1 ? 'Conversoras' : 'Conversora'}>
          {pontos.map((i) => i.nome).join(', ') || 'sem ponto no cadastro'}
          {!serie && <span className="atl-comercio-sub">a que o ONS cita para o {pais}; o ONS não traz o {pais} em {d.ano}</span>}
        </Linha>
        {comPonto.map((f) => (
          <Linha key={`${f.sentido}-${f.via}`} rotulo={`${SENTIDO[f.sentido]} no Comex`}>
            {dolares(f.fobUS)} FOB
            {f.mwh ? (
              <>
                {' '}
                · <Num texto={`${nf0.format(f.mwh)} MWh`} />
              </>
            ) : null}
            <span className="atl-comercio-sub">via declarada no despacho: {f.via}</span>
          </Linha>
        ))}
        {/* leva 4 (Paraguai): o valor do Comex não tem URF; não fica no ponto de Acaray */}
        {semPonto.map((f) => (
          <Linha key={`${f.sentido}-${f.via}-sem`} rotulo={`${SENTIDO[f.sentido]} no Comex`}>
            {dolares(f.fobUS)} FOB
            <span className="atl-comercio-sub">URF não informada: o Comex não diz por onde entra. Quantidade declarada: zero.</span>
          </Linha>
        ))}
      </>
    );
    depois = (
      <>
        {comPonto.length > 0 && fraseDaVia && <p className="atl-nota">{fraseDaVia.charAt(0).toUpperCase() + fraseDaVia.slice(1)}.</p>}
        {depois}
      </>
    );
    ressalvas = (
      <>
        {pontos[0]?.nota && <p>{semArquivo(pontos[0].nota)}</p>}
        {!serie && d.eletricidade?.itaipu && <p>{semArquivo(d.eletricidade.itaipu)}</p>}
        {serie && d.eletricidade?.sentido && <p>{semArquivo(d.eletricidade.sentido)}</p>}
      </>
    );
    fontes = (
      <>
        {ons && (
          <li>
            {ons.orgao}, {ons.conjunto}
            {ons.acesso ? (
              <>
                {' '}
                · acesso <span className="atl-num">{dataBr(ons.acesso)}</span>
              </>
            ) : null}
          </li>
        )}
        {pontos[0]?.fonteDoPonto && <li>Ponto: {semArquivo(pontos[0].fonteDoPonto)}</li>}
        {fluxosEl.length > 0 && fc && (
          <li>
            {fc.orgao}, {fc.conjunto}, {d.ano}
          </li>
        )}
      </>
    );
  } else if (alvo?.tipo === 'gas') {
    const c = (d.condutos ?? []).find((x) => x.pais === alvo.pais);
    if (!c) return <FichaAusente aoFechar={aoFechar} />;
    const pais = nomeDoPais(d, c.pais);
    sobre = `${SENTIDO[c.sentido]} · por duto`;
    nome = `${nomeDoProduto(d, c.produto)} ${c.sentido === 'exportacao' ? '→' : '←'} ${pais}`;
    marca = 'duto';
    // leva 4: o mesmo degrau da viagem (de onde → para onde · peso · valor)
    const lugarC = d.ancoras?.[c.urf]?.municipio ?? lugarDaUrf(d, c.urf);
    const [deC, paraC] = c.sentido === 'exportacao' ? [lugarC, pais] : [pais, lugarC];
    heroi = (
      <div className="atl-comercio-resposta">
        <p className="atl-comercio-resposta-linha">
          {deC} → {paraC}{' '}
          <span className="atl-comercio-resposta-numeros">
            · <Num texto={quanto(d, c.produto, c.kt, c.fobUS)} />
            {c.fobUS > 0 ? (
              <>
                {' '}
                · <Num texto={dolares(c.fobUS)} />
              </>
            ) : null}
          </span>
        </p>
        <p className="atl-comercio-resposta-sub">
          <span className="atl-num">{nf1.format(c.pctDoProduto)}%</span> {doProdutoNoSentido(d, c.produto, c.sentido)} pelo Brasil em {d.ano} · por duto, sem navio e
          sem rota
        </p>
      </div>
    );
    corpo = null;
    ressalvas = c.nota ? <p>{semArquivo(c.nota)}</p> : null;
    fontes = (
      <>
        <li>
          {c.fonte ?? `${fc?.orgao}, ${fc?.conjunto}`}
          {fc?.acesso ? (
            <>
              {' '}
              · acesso <span className="atl-num">{dataBr(fc.acesso)}</span>
            </>
          ) : null}
        </li>
        {c.fonteDaCoordenada && (
          <li>
            Ponto: {c.fonteDaCoordenada.orgao}
            {c.fonteDaCoordenada.conjunto ? `, ${c.fonteDaCoordenada.conjunto}` : ''}
            {c.fonteDaCoordenada.item ? ` (${c.fonteDaCoordenada.item})` : ''}
          </li>
        )}
      </>
    );
  } else {
    return <FichaAusente aoFechar={aoFechar} />;
  }

  return (
    <aside className="atl-ficha atl-comercio-ficha" aria-label={`${sobre}: ${nome}`}>
      <header className="atl-ficha-cabeca">
        <p className="v-dado atl-ficha-sobre">
          <span className={`atl-comercio-marca atl-comercio-marca-${marca}`} aria-hidden="true" />
          {sobre}
        </p>
        <h2 className="atl-ficha-titulo" tabIndex={-1} ref={titulo}>
          {nome}
        </h2>
        <button type="button" className="atl-ficha-fechar" onClick={aoFechar} aria-label="Fechar a ficha">
          Fechar
        </button>
      </header>
      <div className="atl-ficha-corpo">
        {heroi}
        {corpo && <dl className="atl-ficha-dados">{corpo}</dl>}
        {depois}
        <details className="atl-comercio-sobre">
          <summary>Sobre este dado</summary>
          <div className="atl-comercio-sobre-corpo">
            {ressalvas}
            <p className="atl-ficha-fonte-kicker">Fonte</p>
            <ul className="atl-comercio-sobre-fontes">{fontes}</ul>
          </div>
        </details>
      </div>
    </aside>
  );
}

function FichaAusente({ aoFechar }: { aoFechar: () => void }) {
  return (
    <aside className="atl-ficha atl-comercio-ficha" aria-label="Item não encontrado">
      <header className="atl-ficha-cabeca">
        <h2 className="atl-ficha-titulo">Sem dado</h2>
        <button type="button" className="atl-ficha-fechar" onClick={aoFechar} aria-label="Fechar a ficha">
          Fechar
        </button>
      </header>
      <div className="atl-ficha-corpo">
        <p className="atl-nota atl-ausencia">Este item não está no arquivo do comércio desta versão.</p>
      </div>
    </aside>
  );
}

export default FichaDoComercio;
