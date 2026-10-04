Tabela de dado densa. Declare `tipo: 'numero'` ou `'delta'` na coluna e a célula vira mono tabular alinhada à direita — nunca formate o número na mão.

```jsx
<DataTable
  caption="PLD e carga por submercado"
  columns={[
    { key: 'sub', label: 'Submercado' },
    { key: 'pld', label: 'PLD R$/MWh', tipo: 'numero' },
    { key: 'carga', label: 'Carga MW', tipo: 'numero', casas: 0 },
    { key: 'var', label: 'Var. m/m', tipo: 'delta' },
  ]}
  rows={[
    { sub: 'Sudeste/Centro-Oeste', pld: 214.8, carga: 68412, var: 11.4 },
    { sub: 'Sul', pld: 198.11, carga: 14907, var: -4.8 },
  ]}
  footer={{ sub: 'Total SIN', carga: 101328 }}
/>
```

- `tipo: 'delta'` colore por direção de mercado: alta em hardware, baixa em software (advisory no noturno), zero em cinza quente. Não existe verde de sucesso.
- `zebra` alterna a linha em `--zebra`. `hover` muda cor de texto e acende 2px de fio esquerdo já reservado — sem deslocamento e sem animar fundo.
- Sempre acompanhe a tabela de `<Provenance>`.
