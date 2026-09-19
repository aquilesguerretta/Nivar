// OperadorRouter — ARCHITECT, Portal do Operador Wave 2, Fase 3.
//
// Router próprio do console, no padrão que `PortalBRRouter.tsx:31-38` e
// `AlexandriaRouter` já usam: `main.tsx` monta o splat (`/operador/*`) e
// o componente declara as próprias `<Routes>`, com `<Route index>`, as
// rotas de produto e um catch-all que devolve o `NotFound` REAL da
// Portal Debt Wave 1.
//
// Splat e não rota rasa porque o console É hierarquia — fila → produto →
// pedido —, ao contrário dos três produtos Advisory, cujo fluxo v1 cabe
// numa tela só e por isso ficou raso (`main.tsx:124`, `:131`, `:139`).
//
// ─── ROTA DE LAYOUT, E POR QUE ───────────────────────────────────────
// `ConsoleLayout` envolve as telas em vez de cada uma montar o próprio
// chassi. A primeira passada da Fase 3 fez o contrário, e o clique real
// derrubou: o estado de modo mora no chassi, então trocar de produto
// remontava tudo e a tela voltava para claro. Com layout, o chassi monta
// UMA vez e as views trocam no `<Outlet />`.
//
// ─── A TABELA DE ROTAS É DERIVADA, NÃO DIGITADA ──────────────────────
// As rotas de produto saem de `PRODUTOS_COM_FILA`, o mesmo catálogo que
// alimenta a lateral. Duas consequências, e as duas são o ponto:
//
//  1. Produto sem fila não tem rota. Não existe endereço válido para
//     uma família que não opera nada.
//  2. `/operador/qualquer-coisa` NÃO casa com nenhuma rota de produto e
//     cai no catch-all — 404 REAL, com o caminho na tela.
//
// Um `path=":produtoId"` genérico faria o oposto: casaria com qualquer
// texto, e a view teria que redirecionar — o que numa rota paramétrica
// vira laço, porque o destino do redirect casa com o mesmo parâmetro.
//
// O catch-all fica FORA do layout de propósito, e não é preferência:
// `NotFound` é página inteira (`minHeight: 100vh`, `data-nv-page`
// próprio, `FOLHA_PORTAL` próprio). Aninhá-la no `<main>` do console
// poria uma página dentro de outra e um segundo `data-nv-page` que
// zeraria o modo do chassi.

import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ConsoleLayout } from './consoleChrome';
import { FilaView } from './FilaView';
import { PedidoView } from './PedidoView';
import { AriadneWorkbench } from './AriadneWorkbench';
import { NotFound } from '../NotFound';
import { PRODUTOS_COM_FILA } from '../../lib/operador/catalogo';

export function OperadorRouter() {
  return (
    <Routes>
      <Route element={<ConsoleLayout />}>
        <Route index element={<FilaView />} />
        <Route path="ariadne" element={<AriadneWorkbench />} />
        {PRODUTOS_COM_FILA.map((p) => (
          <Fragment key={p.produtoId}>
            <Route path={p.produtoId} element={<FilaView />} />
            <Route path={`${p.produtoId}/:pedidoId`} element={<PedidoView />} />
          </Fragment>
        ))}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default OperadorRouter;
