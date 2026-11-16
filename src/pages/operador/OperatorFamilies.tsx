import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  FamilyInsignia,
  type FamilyInsigniaName,
} from "../../components/g2/FamilyInsignia";
import { nomeDoProduto, PRODUTOS_COM_FILA } from "../../lib/operador/catalogo";

type Family = {
  id: FamilyInsigniaName;
  name: string;
  status: string;
  summary: string;
  links: readonly { to: string; label: string }[];
};

export const operatorFamiliesPath = "/operador/familias";

export function familyPath(id: FamilyInsigniaName) {
  return `${operatorFamiliesPath}/${id}`;
}

export const families: readonly Family[] = [
  {
    id: "intelligence",
    name: "Intelligence",
    status: "Inspeção sintética",
    summary: "Argos permite consultar sinais e suas evidências em cenários sintéticos.",
    links: [{ to: "/operador/argos", label: "Inspecionar sinais no Argos" }],
  },
  {
    id: "advisory",
    name: "Advisory",
    status: "Fila ilustrativa",
    summary: "Consulte exemplos de pedidos para ver como funciona a bancada de análise.",
    links: [
      { to: "/operador", label: "Ver todos os pedidos de demonstração" },
      ...PRODUTOS_COM_FILA.filter(({ familiaId }) => familiaId === "advisory").map(
        ({ produtoId }) => ({
          to: `/operador/${produtoId}`,
          label: nomeDoProduto(produtoId),
        }),
      ),
    ],
  },
  {
    id: "academy",
    name: "Academy",
    status: "Sem fluxo no Operador",
    summary: "Os conteúdos da Academia não têm uma bancada de trabalho no Operador.",
    links: [],
  },
  {
    id: "software",
    name: "Software",
    status: "Em avaliação",
    summary: "Ariadne organiza evidências, revisões e cálculos que podem ser reconstruídos.",
    links: [
      { to: "/operador/ariadne/fechamento", label: "Mesa de revisão" },
      { to: "/operador/ariadne", label: "Ariadne Core · Alpha" },
    ],
  },
  {
    id: "hardware",
    name: "Hardware",
    status: "Sem fluxo no Operador",
    summary: "O Operador ainda não oferece fluxos de acompanhamento de equipamentos.",
    links: [],
  },
];

export function OperatorFamiliesOverview() {
  return (
    <div className="aw-family-directory">
      <header>
        <h1>Famílias NIVAR</h1>
        <p>Disponibilidade de cada família no Operador.</p>
      </header>
      <ul className="aw-family-directory__list">
        {families.map(({ id, name, status, summary }) => (
          <li key={id}>
            <Link className="aw-family-directory__row" to={familyPath(id)}>
              <FamilyInsignia family={id} size={24} decorative />
              <span className="aw-family-directory__identity">
                <strong>{name}</strong>
                <span>{summary}</span>
              </span>
              <span className="aw-family-directory__status">{status}</span>
              <ArrowRight size={16} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OperatorFamilyPage({ family }: { family: Family }) {
  return (
    <div className="aw-family-directory">
      <Link className="aw-back" to={operatorFamiliesPath}>
        <ArrowLeft size={15} aria-hidden /> Todas as famílias
      </Link>
      <header>
        <h1>
          <FamilyInsignia family={family.id} size={32} decorative />
          {family.name}
        </h1>
        <p className="aw-family-directory__status">{family.status}</p>
        <p>{family.summary}</p>
      </header>
      {family.links.length > 0 && (
        <ul className="aw-family-directory__list">
          {family.links.map(({ to, label }) => (
            <li key={to}>
              <Link className="aw-family-directory__row aw-family-directory__destination" to={to}>
                {label} <ArrowRight size={16} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
