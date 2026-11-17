// AulaV3.tsx — o modelo de toda aula da Alexandria v3, com o M01 como régua.
//
// ORDEM, PEDIDA PELO FOUNDER:
//   1 · vídeo da aula ............ só quando `videos.ts` tem vídeo dela. Sem
//                                  vídeo, nada: nem bloco, nem "em produção".
//   2 · abertura ................. pergunta da aula (a do mapa da fonte),
//                                  título, lede; tempo só se a fonte declarar;
//                                  e o caminho para o primeiro ato (S7).
//   3 · leitura .................. coluna de medida confortável; figuras de
//                                  `figuras.ts` na âncora; termos do
//                                  glossário ligados no texto.
//   4 · instrumento .............. com previsão antes do resultado e véu.
//                                  Entra no ponto da prosa que o invoca (C5);
//                                  sem invocação, no fim da seção que ensina
//                                  a relação que ele calcula.
//   5 · exercícios ............... de `avaliacao.ts`; tentativa antes da
//                                  referência (C7).
//   6 · fim ...................... registro em palavras (percorrido ·
//                                  praticado), próximo passo conforme o que
//                                  aconteceu (C10) e, na última aula do
//                                  módulo, a avaliação do módulo.
//
// MECÂNICA DE REGISTRO (sem mudança de regra): `useLoopDaAula` com
// `concluirAoChegarAoFim` — o fim da aula é um registro (C9), sem botão
// "concluir". `refRaiz` na raiz; `refFim` logo depois do TEXTO.

import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CurriculumAula } from '@/lib/types/alexandria';
import { getCorpoAula, getLeadAula } from '@/lib/data/alexandria-curriculo';
import { useLoopDaAula, type LoopDaAulaMecanico } from '@/lib/alexandria/useLoopDaAula';
import { moduloPorId, modulosDaTrilha } from '@/lib/alexandria/indice';
import { rolarPara } from '../usoV3';
import {
  checklistDoModulo,
  exerciciosDaAula,
  exerciciosDoModulo,
  figurasDaAula,
  provaDoModulo,
  videoDaAula,
  type VideoDaAula,
} from './contratos';
import { previsaoDoInstrumento } from './previsoes';
import { Leitura, idDaSecao } from './Leitura';
import { InstrumentoV3, type PrevisaoRegistrada } from './InstrumentoV3';
import { Exercicios, type EstadoDoItem } from './ExercicioV3';
import { ProvaDoModuloV3 } from './ProvaDoModulo';
import { Html, termosDaAula } from './texto';
import type { ChecklistDoModulo } from '@/lib/alexandria/avaliacao';
import './aula-modelo-v3.css';

const dois = (n: number) => String(n).padStart(2, '0');

const rotuloDoItem = (id: string, itens: { id: string; rotulo: string | null }[]) =>
  `exercício ${itens.find((i) => i.id === id)?.rotulo ?? ''}`.trim();

export interface PropsAulaV3 {
  trilhaId: string;
  moduloId: string;
  numero: number;
  totalAulas: number;
  aula: CurriculumAula;
}

export function AulaV3(props: PropsAulaV3) {
  // `key` por aula: sem ela, a previsão e as tentativas da aula anterior
  // vazariam para a seguinte quando a rota reaproveita o componente.
  return <CorpoAulaV3 key={props.aula.id} {...props} />;
}

function CorpoAulaV3({ trilhaId, moduloId, numero, totalAulas, aula }: PropsAulaV3) {
  const loop = useLoopDaAula({ aulaId: aula.id, moduloId, concluirAoChegarAoFim: true });
  const mod = moduloPorId(moduloId);
  const codigo = mod?.codigo ?? `M${moduloId.slice(-2)}`;
  const doIndice = mod?.aulas.find((a) => a.numero === numero) ?? null;

  const blocos = getCorpoAula(aula.id);
  const lead = getLeadAula(aula.id);
  const termos = useMemo(() => termosDaAula(aula.id, moduloId), [aula.id, moduloId]);
  const figuras = useMemo(() => figurasDaAula(moduloId, numero), [moduloId, numero]);
  const video = useMemo(() => videoDaAula(moduloId, numero), [moduloId, numero]);
  const itens = useMemo(() => exerciciosDaAula(moduloId, numero, aula), [moduloId, numero, aula]);
  const ultima = numero === totalAulas;
  const prova = useMemo(() => (ultima ? provaDoModulo(moduloId) : null), [ultima, moduloId]);

  // Uma aula pode ter vários instrumentos (a M09·A08 tem três). Cada um tem a
  // sua previsão, o seu véu e o seu estado; o véu de um não abre com o de outro.
  const instrumentos = aula.instruments;
  const [previstos, setPrevistos] = useState<Record<string, PrevisaoRegistrada>>({});
  const [estados, setEstados] = useState<Record<string, EstadoDoItem>>({});
  const [provaFeita, setProvaFeita] = useState(false);
  const soltos = useMemo(() => (ultima ? exerciciosDoModulo(moduloId) : []), [ultima, moduloId]);
  const checklist = useMemo(() => (ultima ? checklistDoModulo(moduloId) : null), [ultima, moduloId]);

  const secoes = blocos.flatMap((b) => (b.kind === 'titulo' && b.numero ? [{ numero: b.numero, texto: b.texto }] : []));
  const rotuloDaAula = `Módulo ${dois(Number(moduloId.slice(-2)))}, Aula ${dois(numero)}`;
  const itensComSoltos = useMemo(() => [...itens, ...soltos], [itens, soltos]);

  const montados = instrumentos.map((inst) => {
    const previsao = previsaoDoInstrumento(inst.id);
    const previsto = previstos[inst.id] ?? null;
    // O calculado deste cenário é a resposta de um exercício ainda não tentado?
    const exercicioQueLibera = previsao?.abreDepoisDoExercicio ?? null;
    const espera =
      exercicioQueLibera && !estados[exercicioQueLibera]?.registrado
        ? { rotulo: rotuloDoItem(exercicioQueLibera, itensComSoltos), aoIr: () => rolarPara(`item-${exercicioQueLibera}`) }
        : null;
    const ir = () => rolarPara(`instrumento-${inst.id}`);
    // Com um instrumento só, o id do ato é o de sempre (`aula-01-08#previsao`);
    // com vários, cada previsão leva o id do instrumento.
    const entidadeId = instrumentos.length === 1 ? `${aula.id}#previsao` : `${aula.id}#previsao:${inst.id}`;
    const no = (
      <InstrumentoV3
        key={inst.id}
        instrumento={inst}
        previsao={previsao}
        numeroNoModulo={inst.id.slice(-2)}
        codigoModulo={codigo}
        rotuloDaAula={rotuloDaAula}
        conta={loop.conta}
        previsto={previsto}
        espera={espera}
        aoPrever={(p, resposta) => {
          setPrevistos((s) => ({ ...s, [inst.id]: p }));
          void loop.emitirExercicio({ entidadeId, ato: 'previsao', resposta, antesDaReferencia: true });
        }}
        aoUsar={(valores) => loop.usarInstrumento(inst.id, { modo: 'ajuste', valores })}
      />
    );
    const ancorado = previsao && previsao.depoisDoBloco < blocos.length ? previsao.depoisDoBloco : null;
    // Véu da leitura: cai quando o cálculo DESTE instrumento abre (previsão
    // registrada e nenhum exercício esperando).
    const veu = {
      velar: previsao?.velar ?? [],
      velarFiguras: previsao?.velarFiguras ?? [],
      revelado: previsto !== null && !espera,
      aoPedir: ir,
    };
    return { inst, previsao, previsto, no, ancorado, veu, ir };
  });

  const comPrevisao = montados.filter((m) => m.previsao);
  const previsoesFeitas = comPrevisao.filter((m) => m.previsto).length;
  const pendente = comPrevisao.find((m) => !m.previsto) ?? montados[0] ?? null;
  const irAoInstrumento = useCallback(() => pendente?.ir(), [pendente]);
  const temPrevisao = comPrevisao.length > 0;

  const atosPossiveis = comPrevisao.length + itensComSoltos.length;
  const feitos = previsoesFeitas + Object.values(estados).filter((e) => e.registrado).length;
  const aRevisar = Object.values(estados).some(
    (e) => e.avaliacao === 'não atende' || e.avaliacao === 'atende em parte' || e.avaliacao === 'diferente',
  );

  return (
    <div ref={loop.refRaiz} className="av-aula" data-capture="aula-v3">
      <aside className="av-lateral" aria-label="Nesta aula">
        <IndiceDaAula
          codigo={codigo}
          tituloModulo={mod?.titulo ?? null}
          numero={numero}
          total={totalAulas}
          secoes={secoes}
          temInstrumento={instrumentos.length > 0}
          temExercicios={itens.length > 0}
          temProva={Boolean(prova)}
          rotaDaAula={(n) => `/alexandria/trilha/${trilhaId}/modulo/${moduloId}/aula/${n}`}
          titulos={mod?.aulas.map((a) => a.titulo ?? `Aula ${dois(a.numero)}`) ?? []}
          irInstrumento={irAoInstrumento}
        />
      </aside>

      <div className="av-principal">
        {/* Topo da aula: o vídeo (pedido do Founder) e a abertura. A partir de
            1100 px o vídeo fica AO LADO da abertura, para a pergunta e o
            caminho ao primeiro ato seguirem no 1º viewport (S7); abaixo disso
            ele vem primeiro, e o caminho sobe para logo depois da pergunta. */}
        <div className="av-topo" data-com-video={video ? '' : undefined}>
        {video && <VideoV3 video={video} />}

        <header className="av-abertura" data-capture="abertura">
          <span className="av-rotulo">
            Aula {dois(numero)} de {dois(totalAulas)}
            {doIndice?.tema ? ` · ${doIndice.tema}` : aula.subtitle ? ` · ${aula.subtitle}` : ''}
          </span>
          <h1 className="av-titulo">{aula.title}</h1>
          {doIndice?.sinopse && (
            <div className="av-pergunta">
              <span className="av-rotulo">Pergunta da aula</span>
              <p>{doIndice.sinopse}</p>
            </div>
          )}
          <p className="av-caminho">
            {aula.durationMinutes != null && <span>{aula.durationMinutes} min · </span>}
            <span>
              Nesta aula: {video ? 'vídeo · ' : ''}leitura
              {instrumentos.length ? ` · ${rotuloDosInstrumentos(instrumentos.length, temPrevisao)}` : ''}
              {itens.length ? ` · ${itens.length === 1 ? 'um exercício' : `${itens.length} exercícios`}` : ''}
              {prova ? ' · avaliação do módulo' : ''}
            </span>
            {temPrevisao && (
              <>
                {' · '}
                <button type="button" className="av-link" onClick={irAoInstrumento} data-capture="ir-ao-ato">
                  Ir à previsão
                </button>
              </>
            )}
            {!temPrevisao && itens.length > 0 && (
              <>
                {' · '}
                <button type="button" className="av-link" onClick={() => rolarPara('exercicios')} data-capture="ir-ao-ato">
                  Ir ao exercício
                </button>
              </>
            )}
          </p>
          {lead && (
            <p className="av-lede">
              <Html html={lead} />
            </p>
          )}
        </header>
        </div>

        <details className="av-indice-estreito">
          <summary>Nesta aula · {secoes.length} seções</summary>
          <ol>
            {secoes.map((s) => (
              <li key={s.numero}>
                <button type="button" className="av-link" onClick={() => rolarPara(idDaSecao(s.numero))}>
                  {s.numero} {s.texto}
                </button>
              </li>
            ))}
          </ol>
        </details>

        <Leitura
          blocos={blocos}
          termos={termos}
          figuras={figuras}
          instrumentos={montados.flatMap((m) => (m.ancorado !== null ? [{ depoisDoBloco: m.ancorado, no: m.no }] : []))}
          veus={montados.map((m) => m.veu)}
        />
        <span ref={loop.refFim} aria-hidden="true" data-capture="fim-do-texto" className="av-fim-do-texto" />

        {montados.filter((m) => m.ancorado === null).map((m) => m.no)}

        <Exercicios
          itens={itens}
          conta={loop.conta}
          aoRegistrar={(item, resposta, antes) =>
            void loop.emitirExercicio({ entidadeId: item.id, ato: 'exercicio', resposta, antesDaReferencia: antes })
          }
          aoMudarEstado={(id, e) => setEstados((s) => ({ ...s, [id]: e }))}
        />

        <FimDaAula
          loop={loop}
          atosPossiveis={atosPossiveis}
          feitos={feitos}
          previsoes={{ total: comPrevisao.length, feitas: previsoesFeitas }}
          exercicios={{ total: itensComSoltos.length, feitos: Object.values(estados).filter((e) => e.registrado).length }}
          aRevisar={aRevisar}
          trilhaId={trilhaId}
          moduloId={moduloId}
          numero={numero}
          total={totalAulas}
          temProva={Boolean(prova)}
          provaFeita={provaFeita}
          primeiraSecao={secoes[0]?.numero ?? null}
          irAoAto={() =>
            previsoesFeitas < comPrevisao.length ? irAoInstrumento() : rolarPara(itens.length ? 'exercicios' : 'exercicios-do-modulo')
          }
        />

        <Exercicios
          escopo="modulo"
          itens={soltos}
          conta={loop.conta}
          aoRegistrar={(item, resposta, antes) =>
            void loop.emitirExercicio({ entidadeId: item.id, ato: 'exercicio', resposta, antesDaReferencia: antes })
          }
          aoMudarEstado={(id, e) => setEstados((s) => ({ ...s, [id]: e }))}
        />

        {checklist && <ChecklistDoModuloV3 checklist={checklist} codigoModulo={codigo} />}

        {prova && (
          <ProvaDoModuloV3
            prova={prova}
            codigoModulo={codigo}
            conta={loop.conta}
            aoRegistrar={(acertos, total, antes) => {
              setProvaFeita(true);
              void loop.emitirExercicio({
                entidadeId: `${moduloId}#avaliacao`,
                ato: 'avaliacao',
                resposta: `${acertos}/${total}`,
                antesDaReferencia: antes,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

// ── vídeo ────────────────────────────────────────────────────

function VideoV3({ video }: { video: VideoDaAula }) {
  const min = Math.floor(video.duracaoSeg / 60);
  const seg = Math.round(video.duracaoSeg % 60);
  return (
    <figure className="av-video" data-capture="video">
      <video controls preload="metadata" poster={video.poster} playsInline>
        {video.webm && <source src={video.webm} type="video/webm" />}
        <source src={video.mp4} type="video/mp4" />
        {video.legendas.map((l, i) => (
          <track key={l.src} kind="captions" src={l.src} srcLang={l.idioma} label={l.rotulo} default={i === 0} />
        ))}
      </video>
      <figcaption>
        <span className="av-rotulo">Vídeo da aula · {min}:{String(seg).padStart(2, '0')}</span>
        <span>{video.titulo}</span>
      </figcaption>
    </figure>
  );
}

// ── índice lateral ───────────────────────────────────────────

function IndiceDaAula({
  codigo,
  tituloModulo,
  numero,
  total,
  secoes,
  temInstrumento,
  temExercicios,
  temProva,
  rotaDaAula,
  titulos,
  irInstrumento,
}: {
  codigo: string;
  tituloModulo: string | null;
  numero: number;
  total: number;
  secoes: { numero: string; texto: string }[];
  temInstrumento: boolean;
  temExercicios: boolean;
  temProva: boolean;
  rotaDaAula: (n: number) => string;
  titulos: string[];
  irInstrumento: () => void;
}) {
  return (
    <div className="av-indice">
      <div className="av-indice-modulo">
        <span className="av-rotulo">Módulo {codigo.slice(1)}</span>
        {tituloModulo && <span className="av-indice-titulo">{tituloModulo}</span>}
      </div>
      <nav aria-label="Seções desta aula">
        <span className="av-rotulo">Nesta aula</span>
        <ol className="av-indice-secoes">
          {secoes.map((s) => (
            <li key={s.numero}>
              <button type="button" onClick={() => rolarPara(idDaSecao(s.numero))}>
                <span className="av-indice-num">{s.numero}</span>
                {s.texto}
              </button>
            </li>
          ))}
          {temInstrumento && (
            <li>
              <button type="button" onClick={irInstrumento}>
                <span className="av-indice-num">·</span>Instrumento
              </button>
            </li>
          )}
          {temExercicios && (
            <li>
              <button type="button" onClick={() => rolarPara('exercicios')}>
                <span className="av-indice-num">·</span>Exercício
              </button>
            </li>
          )}
          {temProva && (
            <li>
              <button type="button" onClick={() => rolarPara('avaliacao-do-modulo')}>
                <span className="av-indice-num">·</span>Avaliação do módulo
              </button>
            </li>
          )}
        </ol>
      </nav>
      <nav aria-label={`Aulas do módulo ${codigo}`}>
        <span className="av-rotulo">Aulas do módulo</span>
        <ol className="av-indice-aulas">
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <li key={n}>
              {n === numero ? (
                <span aria-current="page" className="av-indice-aqui">
                  <span className="av-indice-num">{dois(n)}</span>
                  {titulos[n - 1] ?? `Aula ${dois(n)}`}
                </span>
              ) : (
                <Link to={rotaDaAula(n)} onClick={() => document.querySelector('.alx3')?.scrollTo({ top: 0 })}>
                  <span className="av-indice-num">{dois(n)}</span>
                  {titulos[n - 1] ?? `Aula ${dois(n)}`}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

// ── fim da aula ──────────────────────────────────────────────

function FimDaAula({
  loop,
  atosPossiveis,
  feitos,
  previsoes,
  exercicios,
  aRevisar,
  trilhaId,
  moduloId,
  numero,
  total,
  temProva,
  provaFeita,
  primeiraSecao,
  irAoAto,
}: {
  loop: LoopDaAulaMecanico;
  atosPossiveis: number;
  feitos: number;
  previsoes: { total: number; feitas: number };
  exercicios: { total: number; feitos: number };
  aRevisar: boolean;
  trilhaId: string;
  moduloId: string;
  numero: number;
  total: number;
  temProva: boolean;
  provaFeita: boolean;
  primeiraSecao: string | null;
  irAoAto: () => void;
}) {
  // Percorrido — só o que o servidor confirma; visitante e carregando em palavras.
  let percorrido: string;
  if (loop.conta === 'visitante') percorrido = 'Registrar o percurso exige conta. A leitura vale do mesmo jeito.';
  else if (loop.conta === 'carregando') percorrido = 'Verificando a sua conta.';
  else if (loop.status === 'concluido') percorrido = 'Aula percorrida · registrada na sua conta.';
  else if (loop.envioDaConclusao === 'enviando') percorrido = 'Registrando o percurso…';
  else if (loop.envioDaConclusao === 'falhou') percorrido = 'Não foi possível registrar o percurso agora.';
  else percorrido = loop.conclusao.pode ? 'Registrando o percurso…' : loop.conclusao.frase;

  const partes: string[] = [];
  if (atosPossiveis === 0) partes.push('esta aula não tem ato de prática');
  else {
    if (previsoes.total === 1 && previsoes.feitas === 1) partes.push('previsão registrada');
    else if (previsoes.total > 1 && previsoes.feitas > 0) partes.push(`${previsoes.feitas} de ${previsoes.total} previsões registradas`);
    if (exercicios.total) partes.push(`${exercicios.feitos} de ${exercicios.total} ${exercicios.total === 1 ? 'exercício respondido' : 'exercícios respondidos'}`);
    if (!feitos) partes.splice(0, partes.length, 'nenhum ato feito nesta leitura');
  }
  let praticado = partes.join(' · ');
  praticado = praticado.charAt(0).toUpperCase() + praticado.slice(1) + '.';
  if (loop.conta === 'conta' && loop.praticasRegistradas > 0) {
    praticado += ` ${loop.praticasRegistradas} ${loop.praticasRegistradas === 1 ? 'registro' : 'registros'} de prática na sua conta.`;
  }

  // Próximo passo conforme o que aconteceu (C10).
  const mod = moduloPorId(moduloId);
  const codigo = mod?.codigo ?? '';
  const rota = (m: string, n: number) => `/alexandria/trilha/${trilhaId}/modulo/${m}/aula/${n}`;
  const proxima =
    numero < total
      ? { rota: rota(moduloId, numero + 1), rotulo: `${codigo}·A${dois(numero + 1)} — ${mod?.aulas[numero]?.titulo ?? `Aula ${dois(numero + 1)}`}` }
      : (() => {
          const mods = modulosDaTrilha(trilhaId);
          const i = mods.findIndex((m) => m.id === moduloId);
          const prox = mods.slice(i + 1).find((m) => m.aulas.length > 0);
          return prox ? { rota: rota(prox.id, 1), rotulo: `${prox.codigo}·A01 — ${prox.aulas[0]?.titulo ?? prox.titulo ?? ''}` } : null;
        })();
  const topo = () => document.querySelector('.alx3')?.scrollTo({ top: 0 });

  let principal: { rotulo: string; acao: (() => void) | string };
  let secundaria: { rotulo: string; rota: string } | null = null;
  if (aRevisar) {
    principal = {
      rotulo: primeiraSecao ? `Rever a leitura · desde ${primeiraSecao}` : 'Rever a leitura desta aula',
      acao: () => (primeiraSecao ? rolarPara(idDaSecao(primeiraSecao)) : topo()),
    };
    secundaria = proxima ? { rotulo: `Próxima · ${proxima.rotulo}`, rota: proxima.rota } : null;
  } else if (atosPossiveis > 0 && feitos === 0) {
    principal = { rotulo: 'Fazer o ato desta aula', acao: irAoAto };
    secundaria = proxima ? { rotulo: `Próxima · ${proxima.rotulo}`, rota: proxima.rota } : null;
  } else if (temProva && !provaFeita) {
    principal = { rotulo: 'Ir à avaliação do módulo', acao: () => rolarPara('avaliacao-do-modulo') };
    secundaria = proxima ? { rotulo: `Próximo módulo · ${proxima.rotulo}`, rota: proxima.rota } : null;
  } else if (proxima) {
    principal = { rotulo: `${numero < total ? 'Próxima' : 'Próximo módulo'} · ${proxima.rotulo}`, acao: proxima.rota };
  } else {
    principal = { rotulo: 'Voltar às trilhas', acao: '/alexandria/trilhas' };
  }

  return (
    <section className="av-fim" aria-labelledby="fim-titulo" data-capture="registro-da-aula">
      <h2 id="fim-titulo" className="av-rotulo">
        Registro desta aula
      </h2>
      <dl className="av-registro">
        <div>
          <dt>Percorrido</dt>
          <dd data-capture="percorrido">{percorrido}</dd>
        </div>
        <div>
          <dt>Praticado</dt>
          <dd data-capture="praticado">{praticado}</dd>
        </div>
      </dl>
      <div className="av-proximo">
        <span className="av-rotulo">Próximo passo</span>
        {typeof principal.acao === 'string' ? (
          <Link to={principal.acao} className="av-acao" onClick={topo} data-capture="proximo-passo">
            {principal.rotulo}
          </Link>
        ) : (
          <button type="button" className="av-acao" onClick={principal.acao} data-capture="proximo-passo">
            {principal.rotulo}
          </button>
        )}
        {secundaria && (
          <Link to={secundaria.rota} className="av-link" onClick={topo}>
            {secundaria.rotulo}
          </Link>
        )}
      </div>
    </section>
  );
}

// ── vários instrumentos ──────────────────────────────────────

function rotuloDosInstrumentos(n: number, comPrevisao: boolean): string {
  const base = n === 1 ? 'instrumento' : `${n} instrumentos`;
  return comPrevisao ? `${base} com previsão` : base;
}

// ── checklist do módulo ──────────────────────────────────────

/** Checklist literal da fonte. Autodeclaração do aluno nesta leitura: não é
 *  avaliação, não vira "Demonstrado" (S3), e nada é enviado ao servidor. */
function ChecklistDoModuloV3({ checklist, codigoModulo }: { checklist: ChecklistDoModulo; codigoModulo: string }) {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const feitos = checklist.itens.filter((i) => marcados[i.id]).length;
  return (
    <section className="av-checklist" id="checklist-do-modulo" aria-labelledby="checklist-titulo" data-capture="checklist">
      <header className="av-bloco-cabeca">
        <span className="av-rotulo">Checklist · {codigoModulo}</span>
        <h2 id="checklist-titulo">O que você deve conseguir fazer</h2>
        <p className="av-aparato">
          <Html html={checklist.introducao} />
        </p>
        <p className="av-aparato" aria-live="polite">
          {feitos} de {checklist.itens.length} marcados · autodeclaração, só nesta leitura
        </p>
      </header>
      <ul className="av-checklist-itens">
        {checklist.itens.map((i) => (
          <li key={i.id}>
            <label>
              <input
                type="checkbox"
                checked={Boolean(marcados[i.id])}
                onChange={(e) => setMarcados((m) => ({ ...m, [i.id]: e.target.checked }))}
              />
              <span>
                <Html html={i.texto} />
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
