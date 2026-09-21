/**
 * Formulário de autenticação — o destino do item de nav `ACESSO`. Login e cadastro no mesmo
 * componente, alternados por `modo`.
 *
 * **Sem ilustração ao lado e sem gradiente de fundo.** O registro é o mesmo do resto do
 * sistema: austero e funcional. Uma coluna de 392px, campos já especificados (`Input`), botão
 * primário já especificado (`Button`), nada além.
 *
 * A frase de rodapé não é aviso legal — é a tese em copy. O cadastro declara que não gera
 * contato comercial porque a receita da empresa não depende da conclusão que ela entrega. Não
 * remover, não amaciar, não trocar por "aceito receber novidades".
 *
 * O que **não** existe aqui: tour de primeiro uso, popup de boas-vindas, spotlight guiado.
 * "O consumidor recebe a leitura, não o pitch" e onboarding guiado são a mesma contradição.
 */
export interface AuthFormProps {
  modo?: 'entrar' | 'cadastrar';
  onModo?: (modo: 'entrar' | 'cadastrar') => void;
  onSubmit?: (modo: 'entrar' | 'cadastrar') => void;
  /** mensagem de erro no campo de e-mail */
  erro?: string;
  /** a declaração de registro no rodapé; `null` remove, mas remover contradiz o sistema */
  registro?: string | null;
  className?: string;
}
export declare function AuthForm(props: AuthFormProps): JSX.Element;
