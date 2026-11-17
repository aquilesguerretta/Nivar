// RevisaoV3.tsx — a revisão do dia: um item por vez, resposta antes da
// referência, autoavaliação no fim.
//
// Sequência de cada item (a mesma da checagem da aula, C7):
//   enunciado → o aluno responde → "Registrar resposta" → a referência entra
//   no DOM só agora, lado a lado com a resposta → autoavaliação em três
//   níveis (aberto) ou comparação com a alternativa (escolha) → a regra diz
//   quando o item volta → "Próximo item".
//
// UM evento por item, enviado quando o aluno passa ao próximo (ou sai da tela
// com o item já julgado): `exercicio_respondido` com `origem: 'revisao'`.
// Antes do julgamento, sair não registra nada e o item continua vencido.
//
// A lista do dia é congelada na entrada: revisar um item não reordena a fila
// debaixo do aluno. Sem conta, a rota volta para o Início (nada aparece).
//
// Componentes da aula (ExercicioV3) são a referência visual, não importados:
// estão em porte paralelo. Do lado da aula só se LÊ `Html` (texto da fonte).

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useEstudo } from '@/components/alexandria/home/estudo';
import {
  atraso,
  depoisDaRevisao,
  NIVEIS,
  quandoVolta,
  resultadoDaTentativa,
  type AgendaDoItem,
  type Autoavaliacao,
  type Resultado,
} from '@/lib/alexandria/revisao/agenda';
import { registrarRevisao, type ResultadoDoEnvio } from '@/lib/alexandria/revisao/api';
import type { ItemDeRevisao } from '@/lib/alexandria/revisao/catalogo';
import { useRevisao, type RevisaoPronta } from '@/lib/alexandria/revisao/useRevisao';
import { useEstadoDaConta } from '@/lib/alexandria/useLoopDaAula';
import { CasaV3 } from '../CasaV3';
import { Html } from '../aula/texto';
import { Fichas, fraseEmDia, rotuloDoExercicio } from './ParaRevisarHoje';
import './revisao-v3.css';

const hojeLongo = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

export function RevisaoV3() {
  const estudo = useEstudo();
  const revisao = useRevisao();

  if (revisao.estado === 'visitante') return <Navigate to="/alexandria" replace />;

  const contaNaCasa =
    estudo.fase === 'conta' ? (
      <Link to="/alexandria/perfil" className="casa-conta">
        {estudo.nome}
      </Link>
    ) : null;

  return (
    <CasaV3 secao="inicio" conta={contaNaCasa}>
      {revisao.estado === 'carregando' ? (
        <div className="rv-espera" aria-busy="true" />
      ) : revisao.estado === 'indisponivel' ? (
        <main className="rv">
          <Cabeca />
          <p className="rv-vazio-frase">A revisão não pôde ser lida agora.</p>
          <p className="rv-aparato">Os itens continuam guardados; tente de novo em instantes.</p>
          <Link to="/alexandria" className="rv-link-seta">
            Voltar ao início
          </Link>
        </main>
      ) : (
        <Sessao revisao={revisao} />
      )}
    </CasaV3>
  );
}

function Cabeca({ fichas }: { fichas?: { total: number; feitas: number; atual?: number } }) {
  return (
    <header className="rv-cabeca">
      <p className="v-dado">Revisão · {hojeLongo.format(new Date())}</p>
      <h1 className="v-manchete rv-titulo">
        Para revisar <em>hoje.</em>
      </h1>
      {fichas && fichas.total > 0 && (
        <p className="rv-andamento">
          <Fichas {...fichas} />
          <span className="v-dado" aria-live="polite">
            {fichas.feitas === fichas.total ? `${fichas.total} de ${fichas.total} revistos` : `Item ${fichas.feitas + 1} de ${fichas.total}`}
          </span>
        </p>
      )}
    </header>
  );
}

interface Fechado {
  item: ItemDeRevisao;
  depois: AgendaDoItem;
  resultado: Resultado;
  envio: ResultadoDoEnvio | 'enviando';
}

function Sessao({ revisao }: { revisao: RevisaoPronta }) {
  const conta = useEstadoDaConta();
  // A fila do dia, congelada na entrada.
  const [fila] = useState(() =>
    revisao.dia.hoje.flatMap((a) => {
      const item = revisao.catalogo.get(a.id);
      return item ? [{ agenda: a, item }] : [];
    }),
  );
  const [pos, setPos] = useState(0);
  const [fechados, setFechados] = useState<Fechado[]>([]);
  const refItem = useRef<HTMLElement | null>(null);

  // Julgamento do item atual ainda não enviado: sai no "Próximo item", ou na
  // desmontagem (o aluno julgou e saiu da tela).
  const pendente = useRef<{ item: ItemDeRevisao; resposta: string; autoavaliacao: Resultado } | null>(null);
  const contaRef = useRef(conta);
  contaRef.current = conta;
  useEffect(
    () => () => {
      const p = pendente.current;
      if (!p) return;
      pendente.current = null;
      void registrarRevisao(
        { entidadeId: p.item.id, aulaId: p.item.aulaId, moduloId: p.item.modulo.id, resposta: p.resposta, autoavaliacao: p.autoavaliacao },
        contaRef.current,
      );
    },
    [],
  );

  const avancar = useCallback(
    (fechado: Omit<Fechado, 'envio'>) => {
      const p = pendente.current;
      pendente.current = null;
      setFechados((f) => [...f, { ...fechado, envio: 'enviando' }]);
      setPos((n) => n + 1);
      if (p) {
        void registrarRevisao(
          { entidadeId: p.item.id, aulaId: p.item.aulaId, moduloId: p.item.modulo.id, resposta: p.resposta, autoavaliacao: p.autoavaliacao },
          contaRef.current,
        ).then((envio) => setFechados((f) => f.map((x) => (x.item.id === fechado.item.id ? { ...x, envio } : x))));
      }
    },
    [],
  );

  useEffect(() => {
    if (pos > 0) refItem.current?.focus({ preventScroll: false });
  }, [pos]);

  if (fila.length === 0) {
    return (
      <main className="rv">
        <Cabeca />
        <p className="rv-vazio-frase" data-capture="revisao-vazia">
          {fraseEmDia(revisao)}
        </p>
        <Link to="/alexandria" className="rv-link-seta">
          Voltar ao início
        </Link>
      </main>
    );
  }

  const atual = fila[pos];
  return (
    <main className="rv">
      <Cabeca fichas={{ total: fila.length, feitas: pos, atual: atual ? pos : undefined }} />
      {atual ? (
        <ItemDaRevisao
          key={atual.item.id}
          refItem={refItem}
          item={atual.item}
          agenda={atual.agenda}
          revisao={revisao}
          ultimo={pos === fila.length - 1}
          aoJulgar={(resposta, autoavaliacao) => {
            pendente.current = { item: atual.item, resposta, autoavaliacao };
          }}
          aoAvancar={avancar}
        />
      ) : (
        <Fim fechados={fechados} revisao={revisao} refFim={refItem} />
      )}
    </main>
  );
}

function ItemDaRevisao({
  item,
  agenda,
  revisao,
  ultimo,
  refItem,
  aoJulgar,
  aoAvancar,
}: {
  item: ItemDeRevisao;
  agenda: AgendaDoItem;
  revisao: RevisaoPronta;
  ultimo: boolean;
  refItem: { current: HTMLElement | null };
  aoJulgar: (resposta: string, autoavaliacao: Resultado) => void;
  aoAvancar: (f: Omit<Fechado, 'envio'>) => void;
}) {
  const e = item.exercicio;
  const alternativas = e.tipo === 'escolha' ? e.alternativas ?? [] : [];
  const ehEscolha = alternativas.length > 0;
  const [texto, setTexto] = useState('');
  const [escolha, setEscolha] = useState<number | null>(null);
  const [registrada, setRegistrada] = useState<string | null>(null);
  const [nivel, setNivel] = useState<Autoavaliacao | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const idCampo = useId();
  const idEnunciado = useId();

  // Escolha com gabarito se julga sozinha, pela mesma comparação da regra.
  const objetivo = ehEscolha && item.textoDoGabarito !== null;
  const resultado: Resultado | undefined = useMemo(() => {
    if (registrada === null) return undefined;
    if (objetivo) {
      return resultadoDaTentativa(
        { entityId: item.id, aulaId: null, moduloId: null, origem: 'revisao', autoavaliacao: null, resposta: registrada, respostaCortada: false, occurredAt: null, dia: revisao.hoje },
        item,
      );
    }
    return nivel ?? undefined;
  }, [registrada, objetivo, nivel, item, revisao.hoje]);

  const depois = useMemo(
    () => (resultado === undefined ? null : depoisDaRevisao(revisao.tentativas, item, revisao.hoje, resultado)),
    [resultado, revisao.tentativas, revisao.hoje, item],
  );

  useEffect(() => {
    if (registrada !== null && resultado !== undefined) aoJulgar(registrada, objetivo ? null : resultado);
  }, [registrada, resultado, objetivo, aoJulgar]);

  const registrar = () => {
    const resposta = ehEscolha ? (escolha === null ? '' : alternativas[escolha]) : texto.trim();
    if (!resposta) {
      setAviso(ehEscolha ? 'Escolha uma alternativa antes de ver a referência.' : 'Escreva a sua resposta antes de ver a referência.');
      return;
    }
    setAviso(null);
    setRegistrada(resposta);
  };

  const referencia = objetivo ? item.textoDoGabarito ?? '' : e.referencia ?? '';
  const origem = e.origem === 'fonte' ? 'exercício do módulo' : 'pergunta sobre o texto da aula';

  return (
    <article
      className="rv-item"
      ref={refItem}
      tabIndex={-1}
      aria-labelledby={idEnunciado}
      data-capture="item-revisao"
      data-estado={registrada === null ? 'vazio' : resultado === undefined ? 'comparacao' : 'julgado'}
    >
      <div className="rv-item-origem">
        <span className="v-dado">
          {item.modulo.codigo} · Aula {String(item.aulaNumero).padStart(2, '0')}
          {item.aulaTitulo ? ` · ${item.aulaTitulo}` : ''}
        </span>
        <span className="v-dado rv-item-meta">
          {rotuloDoExercicio(item.id)} · {origem} · {atraso(agenda.vence, revisao.hoje)}
        </span>
      </div>
      <p className="rv-enunciado" id={idEnunciado}>
        <Html html={e.enunciado} />
      </p>

      {registrada === null ? (
        <>
          {ehEscolha ? (
            <div className="rv-escolhas" role="radiogroup" aria-label="Alternativas">
              {alternativas.map((alt, i) => (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={escolha === i}
                  className="rv-escolha"
                  onClick={() => {
                    setEscolha(i);
                    setAviso(null);
                  }}
                >
                  <span className="rv-marca" aria-hidden="true" data-marcada={escolha === i || undefined} />
                  <span>
                    <Html html={alt} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <label htmlFor={idCampo} className="so-leitor">
                Sua resposta
              </label>
              <textarea
                id={idCampo}
                className="rv-pauta"
                rows={4}
                defaultValue=""
                onChange={(ev) => {
                  setTexto(ev.target.value);
                  setAviso(null);
                }}
                placeholder="Responda de memória"
                data-capture="campo-resposta"
              />
            </>
          )}
          <div className="rv-acao-linha">
            <button type="button" className="rv-botao" onClick={registrar} data-capture="registrar-resposta">
              Registrar resposta
            </button>
            {aviso ? (
              <span role="status" className="rv-aviso">
                {aviso}
              </span>
            ) : (
              <span className="rv-aparato">A referência aparece depois do registro.</span>
            )}
          </div>
        </>
      ) : (
        <div className="rv-comparacao" data-capture="comparacao">
          <div className="rv-lado-a-lado">
            <div>
              <span className="rv-rotulo">Sua resposta</span>
              <p className="rv-resposta">{ehEscolha ? <Html html={registrada} /> : registrada}</p>
            </div>
            <div>
              <span className="rv-rotulo">{objetivo ? 'Referência' : 'Resposta-modelo'}</span>
              <p className="rv-referencia" data-capture="referencia">
                <Html html={referencia} />
              </p>
            </div>
          </div>

          {objetivo ? (
            <p className="rv-estado">
              <span className="rv-glifo" data-forma={resultado === 'atende' ? 'cheio' : 'vazado'} aria-hidden="true" />
              {resultado === 'atende' ? 'Igual à referência.' : 'Diferente da referência.'}
            </p>
          ) : (
            <div className="rv-autoavaliacao">
              <span className="rv-rotulo">Compare com a referência: a sua resposta…</span>
              <div className="rv-escolhas rv-escolhas-linha" role="radiogroup" aria-label="Autoavaliação">
                {NIVEIS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={nivel === n}
                    className="rv-escolha"
                    onClick={() => setNivel(n)}
                    data-capture={`nivel-${n}`}
                  >
                    <span className="rv-marca" aria-hidden="true" data-marcada={nivel === n || undefined} />
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {depois && resultado !== undefined && (
            <div className="rv-volta" data-capture="volta">
              <p className="rv-volta-frase">
                <span className="rv-volta-rotulo v-dado">Volta</span>
                <span className="rv-volta-quando">{quandoVolta(depois.vence, revisao.hoje)}</span>
              </p>
              <div className="rv-acao-linha">
                <button
                  type="button"
                  className="rv-botao"
                  data-capture="proximo-item"
                  onClick={() => aoAvancar({ item, depois, resultado })}
                >
                  {ultimo ? 'Fechar a revisão de hoje' : 'Próximo item'}
                </button>
                {item.rotaDaAula && (
                  <Link to={item.rotaDaAula} className="rv-link">
                    Reler a aula
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Fim({ fechados, revisao, refFim }: { fechados: Fechado[]; revisao: RevisaoPronta; refFim: { current: HTMLElement | null } }) {
  const falhas = fechados.filter((f) => f.envio === 'falhou' || f.envio === 'invalido').length;
  // O próximo dia em que algo volta, contando o que acabou de ser revisto.
  const revistos = new Set(fechados.map((f) => f.item.id));
  const futuros = [
    ...fechados.map((f) => f.depois.vence),
    ...revisao.agendas.filter((a) => !revistos.has(a.id) && a.vence > revisao.hoje).map((a) => a.vence),
  ].sort();
  const proximo = futuros[0] ?? null;
  const noProximo = proximo ? futuros.filter((d) => d === proximo).length : 0;
  const aindaVencidos = revisao.dia.vencidos - fechados.length;

  return (
    <section className="rv-fim" ref={refFim} aria-labelledby="rv-fim-titulo" data-capture="fim-da-revisao" tabIndex={-1}>
      <h2 className="v-manchete rv-fim-titulo" id="rv-fim-titulo">
        Revisão de hoje <em>feita.</em>
      </h2>
      <ol className="rv-fim-lista">
        {fechados.map((f) => (
          <li key={f.item.id}>
            <span className="v-dado">
              {f.item.modulo.codigo} · Aula {String(f.item.aulaNumero).padStart(2, '0')} · {rotuloDoExercicio(f.item.id)}
            </span>
            <span className="rv-fim-aula">{f.item.aulaTitulo ?? `Aula ${f.item.aulaNumero}`}</span>
            <span className="rv-fim-volta">
              volta {quandoVolta(f.depois.vence, revisao.hoje)}
              {f.envio === 'falhou' && ' · não foi guardado'}
            </span>
          </li>
        ))}
      </ol>
      {proximo && (
        <p className="rv-fim-proximo">
          {noProximo === 1 ? 'O próximo item volta' : `${noProximo} itens voltam`} {quandoVolta(proximo, revisao.hoje)}.
        </p>
      )}
      {aindaVencidos > 0 && (
        <p className="rv-aparato">
          {aindaVencidos === 1 ? 'Mais 1 item vencido entra' : `Mais ${aindaVencidos} itens vencidos entram`} na revisão de amanhã.
        </p>
      )}
      {falhas > 0 && (
        <p className="rv-aviso" role="status">
          {falhas === 1 ? '1 revisão não foi guardada' : `${falhas} revisões não foram guardadas`}: esses itens continuam
          para revisar.
        </p>
      )}
      <Link to="/alexandria" className="rv-link-seta">
        Voltar ao início
      </Link>
    </section>
  );
}
