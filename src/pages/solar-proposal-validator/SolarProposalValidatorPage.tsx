import {
  AdvisoryDocumentIntake,
  type AdvisoryProductDescription,
} from "../../components/g2/AdvisoryIntakeTheme";

const PRODUCT: AdvisoryProductDescription = {
  id: "solar-proposal-validator",
  title: "Solar Proposal Validator",
  headline: (
    <>
      Antes de aceitar o retorno,
      <br />
      <em>examine as premissas.</em>
    </>
  ),
  description:
    "Análise independente de proposta solar — enquadramento, regime de compensação e premissas a validar.",
  purpose:
    "A proposta é lida por uma pessoa. Geração estimada, trajetória tarifária e custos precisam de origem e contexto; a promessa comercial, sozinha, não demonstra o resultado.",
  input: "Uma proposta solar.",
  output:
    "Parecer humano com as premissas, os limites e as perguntas que importam.",
  scope: [
    ["Enquadramento", "Porte, modalidade e regime de compensação."],
    ["Produção", "Base da geração estimada e condições de desempenho."],
    ["Retorno", "Tarifa, custos e hipóteses por trás da promessa."],
  ],
  preparation:
    "O produto está em preparação para abertura pública. A disponibilidade de recebimento será confirmada no fluxo da conta.",
};

export function SolarProposalValidatorPage() {
  return (
    <AdvisoryDocumentIntake
      product={PRODUCT}
      fileLabel="Proposta comercial"
      fileHint="Envie a proposta completa, com dimensionamento, geração estimada e condições comerciais. Uma proposta por envio."
    />
  );
}
export default SolarProposalValidatorPage;
