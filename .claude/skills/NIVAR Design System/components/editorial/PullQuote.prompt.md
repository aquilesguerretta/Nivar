Destaque tipográfico dentro de texto longo.

```jsx
<PullQuote
  numero="18,4 %"
  familia="intelligence"
  texto="A projeção de junho errou por 18,4% no Sudeste — e o erro está na afluência, não na carga."
  fonte="Nota técnica 2026-08 · ONS · CCEE"
/>
```

- **O fio de acento é a única cor.** Sem fundo, sem aspas grandes, sem sombra. A cor é da família do conteúdo, não do gosto do momento.
- O número em corpo grande fica em `--text-strong`, nos dois modos. Cor de família em número grande sobre papel não lê.
- Um por seção. Dois blocos de citação seguidos param de destacar.
- `formatarNumero` antes de passar: o componente não formata, para não decidir casas decimais no lugar do editor.
