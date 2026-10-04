Login e cadastro. Uma coluna, sem ilustração.

```jsx
const [modo, setModo] = React.useState('entrar');
<AuthForm modo={modo} onModo={setModo} onSubmit={enviar} />
<AuthForm modo="entrar" erro="Domínio não reconhecido." />
```

- **Sem arte ao lado, sem gradiente de fundo, sem "bem-vindo de volta".** Terceira pessoa, como o resto do sistema.
- Cadastro pede quatro campos: nome, empresa, e-mail corporativo, senha. Cada campo a mais é um motivo a mais para não terminar.
- A declaração de rodapé fica. É a tese: a receita não depende da conclusão entregue, e o cadastro não abre porta para venda.
- Não acrescentar tour de primeiro uso depois do login. Está explicitamente rejeitado no sistema.
- Abaixo de 640px a coluna ocupa a largura toda e o botão primário chega a 44px de altura pelo tratamento móvel de `Button` — nada a fazer aqui.
