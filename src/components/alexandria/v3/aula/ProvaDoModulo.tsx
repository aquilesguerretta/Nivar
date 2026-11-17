// ProvaDoModulo.tsx — a avaliação do módulo, na última aula dele.
//
//   · o CRITÉRIO vem antes das questões (C10), e é o da fonte;
//   · nenhuma correção aparece antes do registro da avaliação inteira;
//   · o resultado é "Avaliação do módulo: X/10 · critério da fonte" — é
//     RESULTADO DE AVALIAÇÃO, nunca "Demonstrado" (S3, P5). Nenhuma palavra
//     de domínio, nenhuma cor de certo/errado: cada questão volta com a sua
//     escolha e a referência, em palavras e silhueta;
//   · nova tentativa disponível; ela sai registrada como posterior à
//     referência (`antesDaReferencia: false`).

import { useState } from 'react';
import type { EstadoDaConta } from '@/lib/alexandria/useLoopDaAula';
import type { ProvaDoModulo as Prova } from './contratos';
import { Html } from './texto';

export function ProvaDoModuloV3({
  prova,
  codigoModulo,
  conta,
  aoRegistrar,
}: {
  prova: Prova;
  codigoModulo: string;
  conta: EstadoDaConta;
  aoRegistrar: (acertos: number, total: number, antesDaReferencia: boolean) => void;
}) {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [corrigida, setCorrigida] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const [aviso, setAviso] = useState<string | null>(null);
  const total = prova.questoes.length;
  const acertos = prova.questoes.filter((q) => respostas[q.id] === q.gabarito).length;

  const registrar = () => {
    const faltam = prova.questoes.map((q, i) => (respostas[q.id] ? null : i + 1)).filter((x): x is number => x !== null);
    if (faltam.length) {
      setAviso(`Faltam ${faltam.length === 1 ? 'a questão' : 'as questões'} ${faltam.join(', ')}.`);
      return;
    }
    setAviso(null);
    aoRegistrar(acertos, total, tentativas === 0);
    setTentativas((t) => t + 1);
    setCorrigida(true);
  };

  return (
    <section className="av-prova" id="avaliacao-do-modulo" aria-labelledby="prova-titulo" data-capture="prova">
      <header className="av-bloco-cabeca">
        <span className="av-rotulo">Fim do módulo {codigoModulo}</span>
        <h2 id="prova-titulo">Avaliação do módulo</h2>
      </header>

      <div className="av-prova-criterio" data-capture="criterio">
        <span className="av-rotulo">Critério · antes de começar</span>
        <p>{prova.criterio}</p>
        <p className="av-aparato">
          {total} questões de alternativa. A correção aparece depois que você registrar a avaliação inteira. O
          resultado é da avaliação, não uma certificação.
          {conta === 'visitante' && ' Sem conta, o resultado vale nesta leitura; guardar o registro exige conta.'}
        </p>
      </div>

      {corrigida && (
        <p className="av-prova-resultado" data-capture="resultado-prova" role="status">
          {prova.rotulo(acertos)}
        </p>
      )}

      <ol className="av-prova-lista">
        {prova.questoes.map((q, i) => {
          const minha = respostas[q.id] ?? null;
          return (
            <li key={q.id} className="av-item">
              <span className="av-rotulo">
                Questão {i + 1} de {total}
                {q.rotulo ? ` · ${q.rotulo}` : ''}
              </span>
              <p className="av-item-enunciado">
                <Html html={q.enunciadoHtml} />
              </p>
              <div className="av-escolhas av-escolhas-coluna" role="radiogroup" aria-label={`Questão ${i + 1}`}>
                {q.opcoes.map((o) => {
                  const marcada = minha === o.id;
                  const ehReferencia = corrigida && o.id === q.gabarito;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={marcada}
                      disabled={corrigida}
                      className="av-escolha"
                      data-referencia={ehReferencia || undefined}
                      onClick={() => setRespostas((r) => ({ ...r, [q.id]: o.id }))}
                    >
                      <span className="av-marca" aria-hidden="true" data-marcada={marcada || undefined} />
                      <span>
                        <Html html={o.texto} />
                        {ehReferencia && <span className="av-anotacao"> · referência</span>}
                        {corrigida && marcada && !ehReferencia && <span className="av-anotacao"> · sua escolha</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
              {corrigida && q.explicacao && (
                <p className="av-explicacao">
                  <Html html={q.explicacao} />
                </p>
              )}
              {corrigida && (
                <p className="av-estado" data-estado={minha === q.gabarito ? 'igual' : 'a-revisar'}>
                  <span className="av-glifo" data-forma={minha === q.gabarito ? 'cheio' : 'vazado'} aria-hidden="true" />
                  {minha === q.gabarito ? 'Igual à referência.' : 'Diferente da referência · a revisar.'}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="av-acao-linha">
        {corrigida ? (
          <button
            type="button"
            className="av-acao"
            onClick={() => {
              setRespostas({});
              setCorrigida(false);
            }}
          >
            Fazer a avaliação de novo
          </button>
        ) : (
          <button type="button" className="av-acao" onClick={registrar} data-capture="registrar-prova">
            Registrar a avaliação
          </button>
        )}
        {aviso && (
          <span role="status" className="av-aviso">
            {aviso}
          </span>
        )}
      </div>
    </section>
  );
}
