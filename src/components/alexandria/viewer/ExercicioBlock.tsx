// ExercicioBlock — CHECAGEM: tentativa antes da referência (bar C7).
//
// O QUE ESTE BLOCO ERA, E POR QUE MUDOU. Até a r01 o exercício terminava num
// "Revelar gabarito" nu: enunciado, um fio de travessia, e a resposta certa
// a um clique. Nenhum campo para escrever, nenhum estado de tentativa,
// nenhum registro. O bar C7 nomeia exatamente esse artefato — *"não existe
// 'Revelar gabarito' direto"* —, e a evidência do próprio bar registra o
// problema na fonte: "nenhum exercício tem campo de resposta".
//
// A SEQUÊNCIA AGORA É A DO C7: vazio → registrado → comparação → próximo
// passo.
//
//   1 · o enunciado, literal da fonte;
//   2 · as LINHAS DE ESCRITA — pauta gravada, sem caixa (regra 1 da
//       varredura): fio de abertura, pauta de 1px no intervalo da
//       entrelinha, zero moldura e zero fundo próprio;
//   3 · a AÇÃO QUE REGISTRA, na cartela da casa. Ela nunca fica
//       desabilitada: sem texto, o clique DIZ o que falta e não revela
//       nada (o mesmo contrato de `AcaoDeRegistro` no tronco da aula);
//   4 · só depois, a COMPARAÇÃO lado a lado — sua resposta × referência;
//   5 · a AUTOAVALIAÇÃO em três níveis (atende · atende em parte · não
//       atende), que é o critério do C7, com nova tentativa sempre
//       disponível;
//   6 · "atende em parte" e "não atende" levam a "a revisar" — palavra e
//       silhueta, nunca cor (S2).
//
// O VÉU É REAL, NÃO VISUAL. A referência não está no DOM antes do registro:
// ela não é escondida por `display:none`, ela não é renderizada. É o que o
// verificador do véu mede por retângulo, e é a única forma de o gate valer.
//
// O REGISTRO, DITO COMO ELE É (S4). Desde a v3 (eventos), "Registrar
// resposta" chama `aoRegistrar` — e quem monta o bloco numa aula o liga a
// `exercicio_respondido`, com `aulaId` (`useLoopDaAula`). Com conta, a
// TENTATIVA fica no registro de prática; o TEXTO não volta para a página
// entre sessões (o backend não tem leitura dele). Sem conta, nada é
// enviado. A linha de aparato no fim do bloco diz qual dos três casos vale
// — `registro` — e não finge persistência nem esconde que não há.
//
// `antesDaReferencia` vai junto: a primeira tentativa é registrada com a
// referência velada; "Refazer a tentativa" depois da comparação registra
// com `false`, porque o aluno já leu a referência.
//
// A numeração `Ex · NN` é preservada verbatim do material original,
// incluindo os dois tags fora da forma canônica ('Ex · 07 · 3 níveis ·
// Aula 05' e 'Ex · 08 · Síntese · Diagnóstico inicial'). O gabarito vive em
// `LessonActivity.config.gabarito`.

import { useId, useState } from 'react';
import type { LessonActivity } from '@/lib/types/alexandria';
import { A, A2, AF, AT, AT2, AS, AR } from '@/design/alexandria-tokens';
import { useLargura } from '../shell/navegacao';
import { AcaoDeRegistro, AcaoSecundaria, Comparacao, Escolhas, MarcaEscolha } from '../aula/tronco';

const lerConfig = (a: LessonActivity, chave: string): string | null => {
  const v = a.config?.[chave];
  return typeof v === 'string' ? v : null;
};

const aparato = { ...AT2.eyebrow, color: A2.tintaMetadado } as const;

type Veredito = 'atende' | 'atende em parte' | 'não atende';
const NIVEIS: Veredito[] = ['atende', 'atende em parte', 'não atende'];

/** O que sai do bloco quando o aluno registra uma resposta. */
export interface RespostaRegistrada {
  atividadeId: string;
  resposta: string;
  /** `false` quando a referência já foi vista nesta leitura. */
  antesDaReferencia: boolean;
}

export function ExercicioBlock({
  atividades,
  aoRegistrar,
  registro = 'indefinido',
}: {
  atividades: LessonActivity[];
  /** Chamado a cada "Registrar resposta" com texto. Sem ele (a folha do
   *  módulo, que não pertence a uma aula), nada é enviado. */
  aoRegistrar?: (r: RespostaRegistrada) => void;
  /** Para a linha de aparato: `conta` = a tentativa vai para o registro de
   *  prática; `visitante` = registrar exige conta; `indefinido` = o bloco
   *  não sabe (texto original). */
  registro?: 'conta' | 'visitante' | 'indefinido';
}) {
  const largura = useLargura();
  const movel = largura === 'movel';
  const [vereditos, setVereditos] = useState<Record<string, Veredito | null>>({});
  if (!atividades.length) return null;

  const aRevisar = Object.values(vereditos).filter((v) => v === 'não atende' || v === 'atende em parte').length;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: AS.lg }}>
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: `${AS.xs} ${AS.md}` }}>
        {/* Rótulo de seção em tinta. Terracota é pontuação rara da casa —
            a posição atual e o número que o instrumento devolve —, e a
            folha do módulo abre este bloco dentro da Revisão, a duas
            dobras dos totais do Laboratório. Quatro terracotas na mesma
            rolagem deixam de significar qualquer coisa. */}
        <span style={{ ...AT.rotulo, color: A.tintaSobreCreme }}>Exercícios</span>
        <span style={{ ...AT.dado, fontSize: '12px', color: A2.tintaMetadado }}>
          Escreva a sua resposta. A referência abre depois do registro.
        </span>
        {aRevisar > 0 && (
          <span style={{ ...AT2.metadado, fontSize: '13px', color: A.tintaSobreCreme }}>
            {aRevisar === 1 ? '1 exercício a revisar' : `${aRevisar} exercícios a revisar`}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {atividades.map((a, i) => (
          <Exercicio
            key={a.id}
            atividade={a}
            primeiro={i === 0}
            movel={movel}
            veredito={vereditos[a.id] ?? null}
            aoAvaliar={(v) => setVereditos((s) => ({ ...s, [a.id]: v }))}
            aoRegistrar={aoRegistrar}
          />
        ))}
      </div>

      {/* A ausência dita na voz da casa, uma vez por bloco (S4): o ato
          funciona; a linha diz o que de fato fica guardado. */}
      <p style={{ ...AT2.metadado, fontSize: '12.5px', fontStyle: 'italic', color: A2.tintaMetadado, margin: 0 }}>
        {registro === 'conta'
          ? 'Cada resposta registrada entra no seu registro de prática. O texto dela não volta a esta página em outra sessão.'
          : registro === 'visitante'
            ? 'O registro vale nesta leitura. Guardar a tentativa exige entrar na sua conta; sem conta, nada é enviado.'
            : 'O registro vale nesta leitura. Guardar a tentativa entre sessões ainda não está disponível.'}
      </p>
    </section>
  );
}

function Exercicio({
  atividade,
  primeiro,
  movel,
  veredito,
  aoAvaliar,
  aoRegistrar,
}: {
  atividade: LessonActivity;
  primeiro: boolean;
  movel: boolean;
  veredito: Veredito | null;
  aoAvaliar: (v: Veredito) => void;
  aoRegistrar?: (r: RespostaRegistrada) => void;
}) {
  const tag = lerConfig(atividade, 'tag');
  const gabarito = lerConfig(atividade, 'gabarito');
  const [texto, setTexto] = useState('');
  const [registrado, setRegistrado] = useState(false);
  // A referência só existe no DOM depois do primeiro registro; a partir
  // dele, toda nova tentativa é feita por quem já a leu.
  const [viuReferencia, setViuReferencia] = useState(false);
  const idCampo = useId();

  const temTexto = texto.trim().length > 0;
  const emRevisao = veredito === 'não atende' || veredito === 'atende em parte';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: AS.md,
        padding: `${AS.lg} 0`,
        borderTop: primeiro ? `1px solid ${A.fioSobreCreme}` : `1px solid ${A2.fioClaroSobreCreme}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: `2px ${AS.md}` }}>
        {tag && <span style={{ ...AT.rotulo, fontSize: '11px', color: A2.tintaMetadado }}>{tag}</span>}
        <EstadoDaTentativa registrado={registrado} rascunho={temTexto} veredito={veredito} />
      </div>

      <p
        style={{ ...AT.corpo, fontSize: '15px', color: A.tintaSobreCreme, margin: 0 }}
        dangerouslySetInnerHTML={{ __html: atividade.prompt }}
      />

      {/* A TENTATIVA. Enquanto ela não está registrada, o campo é o único
          lugar do exercício — e a referência não existe no documento. */}
      {!registrado && (
        <LinhasDeEscrita
          id={idCampo}
          valor={texto}
          aoMudar={setTexto}
          captura="ex-campo"
          movel={movel}
          rotulo={emRevisao ? 'Nova tentativa' : 'Sua resposta'}
        />
      )}

      {!registrado && (
        <AcaoDeRegistro
          rotulo="Registrar resposta"
          captura="ex-registrar"
          movel={movel}
          pronto={temTexto}
          oQueFalta="Escreva a sua resposta antes de registrar. A referência só aparece depois dela."
          aoClicar={() => {
            setRegistrado(true);
            // Sem gabarito na fonte não há referência para ver.
            if (gabarito) setViuReferencia(true);
            aoRegistrar?.({ atividadeId: atividade.id, resposta: texto, antesDaReferencia: !viuReferencia });
          }}
        />
      )}

      {registrado && gabarito && (
        <>
          <Comparacao
            movel={movel}
            sua={texto}
            tituloReferencia="Referência"
            referencia={<span dangerouslySetInnerHTML={{ __html: gabarito }} />}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: `${AS.xs} ${AS.lg}` }}>
            <span style={{ ...AT2.metadado, fontSize: '13.5px', color: A.tintaSuave }}>
              A sua resposta atende ao que a referência pede?
            </span>
            <Escolhas
              rotuloGrupo="A sua resposta atende ao que a referência pede?"
              opcoes={NIVEIS.map((n) => ({ id: n, rotulo: n, captura: `ex-nivel-${n.replace(/ /g, '-')}` }))}
              valor={veredito}
              aoEscolher={(v) => aoAvaliar(v as Veredito)}
              colunas={movel ? 1 : 3}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: `${AS.xs} ${AS.lg}` }}>
            <AcaoSecundaria aoClicar={() => setRegistrado(false)}>
              {emRevisao ? 'Escrever de novo' : 'Refazer a tentativa'}
            </AcaoSecundaria>
            {emRevisao && (
              <span style={{ ...AT2.metadado, fontSize: '13px', color: A.tintaSobreCreme }}>
                Este exercício fica a revisar até a próxima tentativa.
              </span>
            )}
          </div>
        </>
      )}

      {registrado && !gabarito && (
        <>
          <Comparacao
            movel={movel}
            sua={texto}
            tituloReferencia="Referência"
            referencia={
              <span style={{ ...AT2.metadado, fontStyle: 'italic', color: A2.tintaMetadado }}>
                O material deste exercício não traz resposta de referência.
              </span>
            }
          />
          <AcaoSecundaria aoClicar={() => setRegistrado(false)}>Refazer a tentativa</AcaoSecundaria>
        </>
      )}
    </div>
  );
}

/** Estado da tentativa em silhueta + palavra (S2/S3), nunca por cor. Três
 *  estados de leitura — vazio, em rascunho, registrada —, mais a palavra de
 *  revisão quando a autoavaliação a produz. Losango cravado × cruz de
 *  referência: a mesma geometria do levantamento, nenhum disco. */
function EstadoDaTentativa({
  registrado,
  rascunho,
  veredito,
}: {
  registrado: boolean;
  rascunho: boolean;
  veredito: Veredito | null;
}) {
  const palavra = registrado
    ? veredito === 'não atende' || veredito === 'atende em parte'
      ? 'registrada · a revisar'
      : 'registrada'
    : rascunho
      ? 'em rascunho'
      : 'sem tentativa';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: AF.corpo,
        fontSize: '12.5px',
        color: A.tintaSuave,
        whiteSpace: 'nowrap',
      }}
    >
      <MarcaEscolha marcada={registrado} tamanho={12} />
      {palavra}
    </span>
  );
}

/** LINHAS DE ESCRITA — a pauta do caderno, não um campo de formulário.
 *
 *  Regra 1 da varredura: retângulo com fio não é campo. O que faz o lugar
 *  de escrever ser um lugar de escrever é a PAUTA — fio de abertura em
 *  tinta e pauta clara no intervalo exato da entrelinha, sobre o papel do
 *  próprio documento. Sem moldura, sem fundo próprio, sem raio.
 *
 *  A pauta é FIO DE 1 PX, um por linha, e não gradiente: S2 proíbe rampa
 *  de cor na Alexandria, e profundidade aqui vem de fio, como no resto da
 *  casa. Os fios ficam atrás, marcados `aria-hidden`; quem recebe o foco é
 *  o campo, com o anel da casa (`comum/Marcas.tsx`, que já cobre
 *  `textarea`). A altura é fixa em cinco linhas para a pauta e o texto
 *  nunca saírem de registro — o que passar disso rola dentro do campo. */
function LinhasDeEscrita({
  id,
  valor,
  aoMudar,
  movel,
  rotulo,
  captura,
}: {
  id: string;
  valor: string;
  aoMudar: (v: string) => void;
  movel: boolean;
  rotulo: string;
  captura?: string;
}) {
  const entrelinha = 28;
  const linhas = 5;
  const topo = movel ? 8 : 9;
  return (
    // A MEDIDA DO CAMPO É A MEDIDA DA PROSA. A folha do módulo chega a
    // 1.200 px de coluna, e uma pauta dessa largura não é caderno: é
    // formulário de sistema. 68ch é a mesma medida do enunciado logo
    // acima — a linha de escrita continua a linha de leitura.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '68ch' }}>
      <label htmlFor={id} style={{ ...aparato, color: A.tintaSobreCreme }}>
        {rotulo}
      </label>
      <div style={{ position: 'relative', borderTop: `1.4px solid ${A.tintaSobreCreme}`, paddingTop: `${topo}px` }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: `${topo}px 0 0`, pointerEvents: 'none' }}>
          {Array.from({ length: linhas }, (_, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${(i + 1) * entrelinha - 1}px`,
                height: '1px',
                background: A2.fioClaroSobreCreme,
              }}
            />
          ))}
        </span>
        <textarea
          id={id}
          data-capture={captura}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          rows={linhas}
          spellCheck
          style={{
            ...AT.corpo,
            position: 'relative',
            display: 'block',
            maxWidth: 'none',
            width: '100%',
            boxSizing: 'border-box',
            height: `${entrelinha * linhas}px`,
            fontSize: movel ? '15px' : '15.5px',
            lineHeight: `${entrelinha}px`,
            color: A.tintaSobreCreme,
            caretColor: A.tintaSobreCreme,
            background: 'transparent',
            border: 'none',
            borderRadius: AR.none,
            outline: 'none',
            padding: 0,
            margin: 0,
            resize: 'none',
            overflowY: 'auto',
          }}
        />
      </div>
    </div>
  );
}

export default ExercicioBlock;
