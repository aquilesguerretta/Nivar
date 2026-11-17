// ExercicioV3.tsx — checagem com tentativa antes da referência (C7).
//
// Sequência de cada item: vazio → registrado → comparação → autoavaliação.
//   · a referência (gabarito ou resposta-modelo + critério) NÃO está no DOM
//     antes da tentativa registrada — véu real, medível por retângulo;
//   · "Registrar resposta" nunca fica desabilitado: vazio, o clique diz o que
//     falta e não revela nada;
//   · comparação lado a lado: sua resposta × referência × critério;
//   · sem gabarito objetivo, a autoavaliação em três níveis fecha o item
//     (atende · atende em parte · não atende). "Não atende" e "atende em
//     parte" marcam o item "a revisar" — palavra e silhueta, nunca cor;
//   · nova tentativa sempre disponível, e ela sai com `antesDaReferencia:
//     false`, porque o aluno já leu a referência.
//
// O item de escolha com gabarito se compara sozinho: a marca diz "igual à
// referência" ou "diferente da referência", em palavras.

import { useId, useState } from 'react';
import type { EstadoDaConta } from '@/lib/alexandria/useLoopDaAula';
import type { ItemDeAvaliacao } from './contratos';
import { Html } from './texto';

export type Autoavaliacao = 'atende' | 'atende em parte' | 'não atende';
const NIVEIS: Autoavaliacao[] = ['atende', 'atende em parte', 'não atende'];

export interface EstadoDoItem {
  registrado: boolean;
  avaliacao: Autoavaliacao | 'igual' | 'diferente' | null;
}

export function Exercicios({
  itens,
  conta,
  aoRegistrar,
  aoMudarEstado,
  escopo = 'aula',
}: {
  itens: ItemDeAvaliacao[];
  conta: EstadoDaConta;
  aoRegistrar: (item: ItemDeAvaliacao, resposta: string, antesDaReferencia: boolean) => void;
  aoMudarEstado: (id: string, e: EstadoDoItem) => void;
  /** 'modulo': os exercícios que a fonte não prende a uma aula, na última aula. */
  escopo?: 'aula' | 'modulo';
}) {
  if (!itens.length) return null;
  const id = escopo === 'aula' ? 'exercicios' : 'exercicios-do-modulo';
  const nome = escopo === 'aula' ? 'da aula' : 'do módulo';
  return (
    <section className="av-exercicios" id={id} aria-labelledby={`${id}-titulo`} data-capture={id}>
      <header className="av-bloco-cabeca">
        <span className="av-rotulo">{escopo === 'aula' ? 'Checagem' : 'Síntese do módulo'}</span>
        <h2 id={`${id}-titulo`}>{itens.length === 1 ? `Exercício ${nome}` : `Exercícios ${nome} · ${itens.length}`}</h2>
        <p className="av-aparato">
          Escreva a sua resposta primeiro; a referência aparece depois do registro.
          {conta === 'visitante' && ' Sem conta, a tentativa vale nesta leitura; guardar o registro exige conta.'}
        </p>
      </header>
      {itens.map((it, i) => (
        <ItemV3
          key={it.id}
          item={it}
          ordem={i + 1}
          aoRegistrar={aoRegistrar}
          aoMudarEstado={(e) => aoMudarEstado(it.id, e)}
        />
      ))}
    </section>
  );
}

function ItemV3({
  item,
  ordem,
  aoRegistrar,
  aoMudarEstado,
}: {
  item: ItemDeAvaliacao;
  ordem: number;
  aoRegistrar: (item: ItemDeAvaliacao, resposta: string, antesDaReferencia: boolean) => void;
  aoMudarEstado: (e: EstadoDoItem) => void;
}) {
  const [texto, setTexto] = useState('');
  const [escolha, setEscolha] = useState<string | null>(null);
  const [registrada, setRegistrada] = useState<string | null>(null);
  const [viuReferencia, setViuReferencia] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [nivel, setNivel] = useState<Autoavaliacao | null>(null);
  const idCampo = useId();
  const ehEscolha = item.opcoes.length > 0;

  const registrar = () => {
    const resposta = ehEscolha ? escolha : texto.trim();
    if (!resposta) {
      setAviso(ehEscolha ? 'Escolha uma alternativa antes de ver a referência.' : 'Escreva a sua resposta antes de ver a referência.');
      return;
    }
    const legivel = ehEscolha ? item.opcoes.find((o) => o.id === resposta)?.texto ?? resposta : resposta;
    aoRegistrar(item, legivel, !viuReferencia);
    setRegistrada(resposta);
    setViuReferencia(true);
    setNivel(null);
    const objetivo = ehEscolha && item.gabarito !== null;
    aoMudarEstado({
      registrado: true,
      avaliacao: objetivo ? (resposta === item.gabarito ? 'igual' : 'diferente') : null,
    });
  };

  const refazer = () => {
    setRegistrada(null);
    setTexto('');
    setEscolha(null);
    setNivel(null);
  };

  const rotulo = item.rotulo ?? `Exercício ${String(ordem).padStart(2, '0')}`;
  const origem = item.origem === 'fonte' ? 'exercício do módulo' : 'pergunta sobre o texto desta aula';

  return (
    <article className="av-item" id={`item-${item.id}`} data-capture="item" data-estado={registrada ? 'registrado' : 'vazio'}>
      <span className="av-rotulo">
        {rotulo} · {origem}
      </span>
      <p className="av-item-enunciado">
        <Html html={item.enunciadoHtml} />
      </p>

      {registrada === null ? (
        <>
          {ehEscolha ? (
            <div className="av-escolhas av-escolhas-coluna" role="radiogroup" aria-label={`Alternativas · ${rotulo}`}>
              {item.opcoes.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={escolha === o.id}
                  className="av-escolha"
                  onClick={() => {
                    setEscolha(o.id);
                    setAviso(null);
                  }}
                >
                  <span className="av-marca" aria-hidden="true" data-marcada={escolha === o.id || undefined} />
                  <span>
                    <Html html={o.texto} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <label htmlFor={idCampo} className="so-leitor">
                Sua resposta · {rotulo}
              </label>
              <textarea
                id={idCampo}
                className="av-pauta"
                rows={4}
                defaultValue=""
                onChange={(e) => {
                  setTexto(e.target.value);
                  setAviso(null);
                }}
                placeholder="Sua resposta"
                data-capture="campo-resposta"
              />
            </>
          )}
          <div className="av-acao-linha">
            <button type="button" className="av-acao" onClick={registrar} data-capture="registrar-resposta">
              Registrar resposta
            </button>
            {aviso && (
              <span role="status" className="av-aviso">
                {aviso}
              </span>
            )}
          </div>
        </>
      ) : (
        <Comparacao
          item={item}
          registrada={registrada}
          nivel={nivel}
          aoAvaliar={(n) => {
            setNivel(n);
            aoMudarEstado({ registrado: true, avaliacao: n });
          }}
          aoRefazer={refazer}
        />
      )}
    </article>
  );
}

function Comparacao({
  item,
  registrada,
  nivel,
  aoAvaliar,
  aoRefazer,
}: {
  item: ItemDeAvaliacao;
  registrada: string;
  nivel: Autoavaliacao | null;
  aoAvaliar: (n: Autoavaliacao) => void;
  aoRefazer: () => void;
}) {
  const ehEscolha = item.opcoes.length > 0;
  const objetivo = ehEscolha && item.gabarito !== null;
  const textoDe = (id: string) => item.opcoes.find((o) => o.id === id)?.texto ?? id;
  const igual = objetivo && registrada === item.gabarito;
  const referencia = ehEscolha && item.gabarito ? textoDe(item.gabarito) : item.gabarito ?? item.referencia ?? '';

  return (
    <div className="av-comparacao-item" data-capture="comparacao-item">
      <div className="av-lado-a-lado">
        <div>
          <span className="av-rotulo">Sua resposta</span>
          <p className="av-resposta">{ehEscolha ? <Html html={textoDe(registrada)} /> : registrada}</p>
        </div>
        <div>
          <span className="av-rotulo">{item.gabarito !== null ? 'Referência' : 'Resposta-modelo'}</span>
          <p className="av-referencia" data-capture="referencia">
            <Html html={referencia} />
          </p>
        </div>
      </div>
      {item.criterio && (
        <p className="av-criterio">
          <span className="av-rotulo">Critério</span> <Html html={item.criterio} />
        </p>
      )}

      {objetivo ? (
        <p className="av-estado" data-estado={igual ? 'igual' : 'a-revisar'}>
          <span className="av-glifo" data-forma={igual ? 'cheio' : 'vazado'} aria-hidden="true" />
          {igual ? 'Igual à referência.' : 'Diferente da referência · a revisar.'}
        </p>
      ) : (
        <div className="av-autoavaliacao">
          <span className="av-rotulo">Compare com a referência: a sua resposta…</span>
          <div className="av-escolhas" role="radiogroup" aria-label="Autoavaliação">
            {NIVEIS.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={nivel === n}
                className="av-escolha"
                onClick={() => aoAvaliar(n)}
              >
                <span className="av-marca" aria-hidden="true" data-marcada={nivel === n || undefined} />
                {n}
              </button>
            ))}
          </div>
          {nivel && nivel !== 'atende' && (
            <p className="av-estado" data-estado="a-revisar">
              <span className="av-glifo" data-forma="vazado" aria-hidden="true" />A revisar — o fim da aula indica onde
              voltar.
            </p>
          )}
        </div>
      )}

      <button type="button" className="av-link" onClick={aoRefazer}>
        Fazer nova tentativa
      </button>
    </div>
  );
}
