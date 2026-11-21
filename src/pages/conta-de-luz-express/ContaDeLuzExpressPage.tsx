import {
  AdvisoryDocumentIntake,
  type AdvisoryProductDescription,
} from "../../components/g2/AdvisoryIntakeTheme";

const PRODUCT: AdvisoryProductDescription = {
  id: "conta-de-luz-express",
  title: "Conta de Luz Express",
  headline: (
    <>
      O valor da fatura
      <br />
      não explica <em>a conta inteira.</em>
    </>
  ),
  description:
    "Análise independente de fatura industrial — modalidade, demanda e oportunidades a validar.",
  purpose:
    "Uma pessoa examina o documento e produz um parecer com contraditório. A conclusão precisa resistir às perguntas, inclusive quando ainda falta evidência.",
  input: "Uma fatura industrial.",
  output: "Parecer humano, acessível pela sua conta.",
  scope: [
    ["Modalidade", "O enquadramento e as condições da cobrança."],
    ["Demanda", "O que foi contratado e o que foi registrado."],
    ["Composição", "Tributos, encargos e oportunidades a validar."],
  ],
  preparation: "",
};

export function ContaDeLuzExpressPage() {
  return (
    <AdvisoryDocumentIntake
      product={PRODUCT}
      fileLabel="Fatura de energia"
      fileHint="Envie a fatura completa, com as páginas de demanda e de tributos. Uma fatura por envio."
    />
  );
}
export default ContaDeLuzExpressPage;
