// ParaRevisarHoje.tsx — a revisão do dia na mesa de estudo da Home.
//
// Dois tamanhos, pela escala do que há para fazer (hierarquia por escala,
// não por cor):
//   · há item vencido → FAIXA larga logo abaixo da saudação, com a contagem,
//     as fichas do dia, os primeiros itens e a ação "Começar a revisão";
//   · nada vencido → uma NOTA na coluna lateral: quando volta o próximo, ou,
//     sem nada praticado ainda, como a revisão funciona.
// Sem conta, `useRevisao` devolve `visitante` e nada disto aparece.

import { Link } from 'react-router-dom';
import { atraso, quandoVolta } from '@/lib/alexandria/revisao/agenda';
import type { EstadoDaRevisao, RevisaoPronta } from '@/lib/alexandria/revisao/useRevisao';
import './revisao-v3.css';

const MOSTRAR_NA_FAIXA = 4;
/** No celular a faixa mostra menos, para "Continuar a aula" não descer demais. */
const MOSTRAR_NO_CELULAR = 2;

const itens = (n: number) => (n === 1 ? '1 item' : `${n} itens`);

/** `m01-ex-04` → `Ex · 04`; pergunta derivada da aula → `Recuperação` (o rótulo da aula). */
export function rotuloDoExercicio(id: string): string {
  const m = id.match(/-ex-(\d+)$/);
  return m ? `Ex · ${m[1]}` : 'Recuperação';
}

export function FaixaParaRevisarHoje({ revisao }: { revisao: EstadoDaRevisao }) {
  if (revisao.estado !== 'pronta' || revisao.dia.hoje.length === 0) return null;
  const { dia, catalogo, hoje } = revisao;
  const lista = dia.hoje.slice(0, MOSTRAR_NA_FAIXA);
  const resto = dia.hoje.length - lista.length;
  const restoNoCelular = dia.hoje.length - Math.min(lista.length, MOSTRAR_NO_CELULAR);
  const alemDoTeto = dia.vencidos - dia.hoje.length;

  return (
    <section className="rv-faixa" aria-labelledby="rv-faixa-titulo" data-capture="para-revisar-hoje">
      <div className="rv-faixa-conta">
        <p className="v-dado" id="rv-faixa-titulo">
          Para revisar hoje
        </p>
        <p className="rv-faixa-numero">
          <span className="rv-faixa-n">{dia.hoje.length}</span>
          <span className="rv-faixa-n-rotulo">{dia.hoje.length === 1 ? 'item voltou' : 'itens voltaram'}</span>
        </p>
        <Fichas total={dia.hoje.length} feitas={0} />
        <p className="rv-faixa-nota">
          Exercícios que você já respondeu, de volta dias depois. Responda de novo antes de ver a referência.
          {alemDoTeto > 0 && ` Mais ${itens(alemDoTeto)} ficam para amanhã.`}
        </p>
        <Link to="/alexandria/revisao" className="rv-botao" data-capture="comecar-revisao">
          Começar a revisão
        </Link>
      </div>
      <ol className="rv-faixa-lista">
        {lista.map((a, i) => {
          const it = catalogo.get(a.id);
          if (!it) return null;
          return (
            <li
              key={a.id}
              className="rv-faixa-item"
              data-so-largo={i >= MOSTRAR_NO_CELULAR || undefined}
              style={{ ['--i' as string]: i }}
            >
              <span className="rv-faixa-linha">
                <span className="v-dado">
                  {it.modulo.codigo} · Aula {String(it.aulaNumero).padStart(2, '0')} · {rotuloDoExercicio(it.id)}
                </span>
                <span className="rv-faixa-atraso">{atraso(a.vence, hoje)}</span>
              </span>
              <span className="rv-faixa-aula">{it.aulaTitulo ?? `Aula ${it.aulaNumero}`}</span>
            </li>
          );
        })}
        {resto > 0 && (
          <li className="rv-faixa-item rv-faixa-resto" data-so-largo>
            <span className="rv-faixa-atraso">e mais {itens(resto)} na revisão de hoje</span>
          </li>
        )}
        {restoNoCelular > 0 && (
          <li className="rv-faixa-item rv-faixa-resto" data-so-celular>
            <span className="rv-faixa-atraso">e mais {itens(restoNoCelular)} na revisão de hoje</span>
          </li>
        )}
      </ol>
    </section>
  );
}

/** A nota da coluna lateral quando não há nada vencido. */
export function NotaDaRevisao({ revisao }: { revisao: EstadoDaRevisao }) {
  if (revisao.estado === 'visitante' || revisao.estado === 'carregando') return null;
  if (revisao.estado === 'pronta' && revisao.dia.hoje.length > 0) return null;
  return (
    <section className="rv-nota" aria-labelledby="rv-nota-titulo" data-capture="nota-revisao">
      <h2 className="mesa-sub" id="rv-nota-titulo">
        Revisão
      </h2>
      <p className="mesa-nota">{fraseDaNota(revisao)}</p>
    </section>
  );
}

function fraseDaNota(r: Exclude<EstadoDaRevisao, { estado: 'visitante' | 'carregando' }>): string {
  if (r.estado === 'indisponivel') return 'A revisão não pôde ser lida agora. Os itens continuam guardados.';
  return fraseEmDia(r);
}

export function fraseEmDia(r: RevisaoPronta): string {
  const { dia, hoje } = r;
  if (dia.naAgenda === 0) {
    return 'Os exercícios que você responder nas aulas voltam aqui, dias depois, para responder de novo.';
  }
  if (!dia.proximoDia) return 'Nada para revisar hoje.';
  return `Nada para revisar hoje. ${dia.noProximoDia === 1 ? 'O próximo item volta' : `${itens(dia.noProximoDia)} voltam`} ${quandoVolta(dia.proximoDia, hoje)}.`;
}

/** As fichas do dia: um quadrado por item, cheio quando revisto. Forma, não
 *  cor — o estado se lê em cinza (sem semáforo). */
export function Fichas({ total, feitas, atual }: { total: number; feitas: number; atual?: number }) {
  return (
    <span className="rv-fichas" role="img" aria-label={`${feitas} de ${total} revistos`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="rv-ficha"
          data-feita={i < feitas || undefined}
          data-atual={i === atual || undefined}
          style={{ ['--i' as string]: i }}
        />
      ))}
    </span>
  );
}
