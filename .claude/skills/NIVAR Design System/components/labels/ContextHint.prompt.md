Definição de termo técnico no hover, no toque ou no foco.

```jsx
O <ContextHint termo="PLD" /> horário fecha por <ContextHint termo="submercado" />.
<ContextHint termo="apuração" definicao="Texto próprio deste contexto." fonte="" />
```

- Sem `definicao`, o texto vem de `components/glossary/termos.js` pelo próprio termo — a mesma fonte do `Glossary`, então os dois nunca divergem.
- Painel plano com fio: **sem seta de balão, sem raio, sem sombra.** A separação do fundo é fio `--rule-heavy`, nunca elevação.
- O gatilho é `<button>`, então o painel abre por teclado. Não troque por `<span>`.
