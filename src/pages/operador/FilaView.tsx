import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Search,
  X,
} from "lucide-react";
import {
  nomeDoProduto,
  produtoComFilaPorId,
} from "../../lib/operador/catalogo";
import {
  AGORA_DA_AMOSTRA,
  filaDe,
  type PedidoNaFila,
} from "../../lib/operador/mock";
import {
  formatarData,
  formatarIdade,
  idadePorExtenso,
  medirIdade,
} from "../../lib/operador/idade";
import { estadoDoPedido } from "./operatorViewUtils";

function CaseLink({
  p,
  children,
}: {
  p: PedidoNaFila;
  children: React.ReactNode;
}) {
  return <Link to={`/operador/${p.produtoId}/${p.id}`}>{children}</Link>;
}

export function FilaView() {
  const { pathname } = useLocation();
  const product = produtoComFilaPorId(
    pathname.replace(/^\/operador\/?/, "").split("/")[0],
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "ready" | "unknown">(
    "all",
  );
  const [oldest, setOldest] = useState(true);
  const [peekId, setPeekId] = useState<string | null>(null);
  const base = filaDe(product?.produtoId);
  const pending = base.filter((p) => p.status !== "ready");
  const unknown = base.filter((p) => p.status === null);
  const query = search.trim().toLocaleLowerCase("pt-BR");
  const rows = base
    .filter(
      (p) =>
        (filter === "all" ||
          (filter === "pending" && p.status !== "ready") ||
          (filter === "ready" && p.status === "ready") ||
          (filter === "unknown" && p.status === null)) &&
        (!query ||
          `${p.cliente} ${p.id} ${nomeDoProduto(p.produtoId)}`
            .toLocaleLowerCase("pt-BR")
            .includes(query)),
    )
    .sort(
      (a, b) =>
        (medirIdade(b.criadoEm, AGORA_DA_AMOSTRA).ms -
          medirIdade(a.criadoEm, AGORA_DA_AMOSTRA).ms) *
        (oldest ? 1 : -1),
    );
  const peek = rows.find((p) => p.id === peekId) ?? rows[0];
  const first = [...pending].sort((a, b) =>
    a.criadoEm.localeCompare(b.criadoEm),
  )[0];

  return (
    <div className="g2-queue">
      <header className="g2-queue__heading">
        <div>
          <p className="g2-ops__eyebrow">ADVISORY / FILA DE ANÁLISE</p>
          <h1>
            {product
              ? nomeDoProduto(product.produtoId)
              : "Onde a leitura começa."}
          </h1>
          <p>O que chegou. O que falta. O que merece uma pergunta melhor.</p>
        </div>
        {first && (
          <CaseLink p={first}>
            <span className="g2-ops__button g2-ops__button--dark">
              Próxima leitura <ArrowUpRight size={16} />
            </span>
          </CaseLink>
        )}
      </header>
      <div className="g2-queue__ledger">
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          <b>{String(base.length).padStart(2, "0")}</b>
          <span>pedidos na amostra</span>
        </button>
        <button
          type="button"
          aria-pressed={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          <b>{String(pending.length).padStart(2, "0")}</b>
          <span>por ler</span>
        </button>
        <button
          type="button"
          aria-pressed={filter === "unknown"}
          onClick={() => setFilter("unknown")}
        >
          <b>{String(unknown.length).padStart(2, "0")}</b>
          <span>sem estado informado</span>
        </button>
        <div>
          <span>RELÓGIO DA AMOSTRA</span>
          <strong>03 SET 2026 · 14:00 BRT</strong>
        </div>
      </div>
      <div className="g2-queue__workspace">
        <section className="g2-queue__list" aria-label="Pedidos">
          <div className="g2-queue__toolbar">
            <label>
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente, produto ou protocolo"
                aria-label="Buscar pedidos"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Limpar busca"
                  onClick={() => setSearch("")}
                >
                  <X size={14} />
                </button>
              )}
            </label>
            <select
              aria-label="Filtrar estado"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="all">Todos os estados</option>
              <option value="pending">Por ler</option>
              <option value="ready">Entregues</option>
              <option value="unknown">Sem estado</option>
            </select>
          </div>
          <div className="g2-queue__table-wrap">
            <table className="g2-queue__table">
              <thead>
                <tr>
                  <th scope="col">Pedido / cliente</th>
                  <th scope="col">Produto</th>
                  <th scope="col">Estado</th>
                  <th
                    scope="col"
                    aria-sort={oldest ? "descending" : "ascending"}
                  >
                    <button
                      type="button"
                      onClick={() => setOldest(!oldest)}
                      aria-label={
                        oldest
                          ? "Ordenar do mais recente"
                          : "Ordenar do mais antigo"
                      }
                    >
                      Idade{" "}
                      {oldest ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
                    </button>
                  </th>
                  <th scope="col">
                    <span className="g2-ops__sr">Prévia</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} data-selected={peek?.id === p.id}>
                    <td>
                      <CaseLink p={p}>
                        <strong>{p.cliente}</strong>
                        <span>{p.id}</span>
                      </CaseLink>
                    </td>
                    <td>
                      <span>{nomeDoProduto(p.produtoId)}</span>
                    </td>
                    <td>
                      <span
                        className="g2-queue__status"
                        data-state={p.status ?? "unknown"}
                      >
                        {estadoDoPedido(p)}
                      </span>
                    </td>
                    <td>
                      <span
                        className="g2-queue__age"
                        title={idadePorExtenso(p.criadoEm, AGORA_DA_AMOSTRA)}
                      >
                        {formatarIdade(p.criadoEm, AGORA_DA_AMOSTRA)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="g2-queue__peek"
                        aria-label={`Examinar resumo de ${p.cliente}`}
                        aria-pressed={peek?.id === p.id}
                        onClick={() => setPeekId(p.id)}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!rows.length && (
            <div className="g2-ops__empty">
              <h2>Nenhum pedido corresponde à busca.</h2>
              <p>Ajuste o texto ou o estado para voltar à fila.</p>
              <button
                className="g2-ops__button"
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
          <footer className="g2-queue__foot">
            <span>
              {rows.length} de {base.length} pedidos
            </span>
            <span>Idade é tempo decorrido. Não é prazo ou SLA.</span>
          </footer>
        </section>
        {peek && (
          <aside
            className="g2-queue__inspect"
            aria-label="Resumo do pedido selecionado"
          >
            <div className="g2-queue__inspect-top">
              <span>PRIMEIRA LEITURA</span>
              <span>{peek.id}</span>
            </div>
            <h2>{peek.cliente}</h2>
            <p>{nomeDoProduto(peek.produtoId)}</p>
            <dl>
              <div>
                <dt>Recebido</dt>
                <dd>{formatarData(peek.criadoEm)}</dd>
              </div>
              <div>
                <dt>Idade</dt>
                <dd>{formatarIdade(peek.criadoEm, AGORA_DA_AMOSTRA)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{estadoDoPedido(peek)}</dd>
              </div>
              <div>
                <dt>Responsável</dt>
                <dd>Não informado</dd>
              </div>
              <div>
                <dt>Fonte esperada</dt>
                <dd>{peek.arquivo ?? "Ficha do cliente"}</dd>
              </div>
            </dl>
            <div className="g2-queue__question">
              <span>ANTES DE CONCLUIR</span>
              <p>
                {peek.produtoId === "solar-proposal-validator"
                  ? "Qual premissa sustenta a economia prometida?"
                  : peek.produtoId === "diagnostico-energetico"
                    ? "Qual evidência distinguiria as hipóteses?"
                    : "O que mudou: o consumo, a tarifa ou a leitura?"}
              </p>
            </div>
            <CaseLink p={peek}>
              <span className="g2-ops__button g2-ops__button--dark">
                Abrir caderno <ArrowUpRight size={16} />
              </span>
            </CaseLink>
            <small>
              Fonte e nomes desta fila são ilustrativos. A análise começa sem
              conclusão atribuída.
            </small>
          </aside>
        )}
      </div>
    </div>
  );
}
