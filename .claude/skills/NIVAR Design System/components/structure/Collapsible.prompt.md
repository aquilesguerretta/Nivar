Cabeçalho com `+` / `−`, fio separando do conteúdo.

```jsx
<Collapsible titulo="Premissas do cenário" nota="4 itens" padrao>
  <p>…</p>
</Collapsible>
<Collapsible titulo="Como a migração afeta o contrato vigente" nota="6 min">
  <p>…</p>
</Collapsible>
```

- **`+` e `−`, não chevron girando.** O sistema não gira glifo nem anima transform em interface.
- A abertura desenha um fio de 700ms e revela o corpo em opacidade. Altura nunca anima.
- Em lista de seções recolhíveis, deixe `fio` ligado no primeiro e nos seguintes: o fio é compartilhado, como na grade.
- Para procedência e método de cálculo use `MethodDisclosure` — a ordem das linhas lá é argumento, não formatação.
- Não usar para esconder conteúdo essencial. Recolhido é para o que o leitor pode não precisar, não para reduzir densidade: a densidade é alvo do sistema, não problema.
