Duas colunas espelhadas com divisor central de fio.

```jsx
<Comparison
  a={{ nome: 'Sudeste/Centro-Oeste', sub: 'apuração mensal' }}
  b={{ nome: 'Sul', sub: 'apuração mensal' }}
  linhas={[
    { rotulo: 'PLD médio', a: 214.8, b: 268.4, unidade: 'R$/MWh' },
    { rotulo: 'Carga verificada', a: 42318, b: 12064, unidade: 'MWmed', casas: 0 },
    { rotulo: 'Migração no mês', a: 1284, b: 402, unidade: 'unidades', casas: 0 },
  ]}
  nota="Diferença calculada de A para B."
/>
```

- Duas colunas, não três. Um terceiro submercado quebra o espelhamento e o lugar dele é `DataTable`.
- **A base é sempre a coluna A.** O delta na coluna B lê como "B em relação a A"; trocar a base sem trocar a ordem das colunas inverte o sinal sem avisar.
- Abaixo de 640px o divisor central continua vertical: o rótulo passa para linha própria dentro de cada célula e os dois valores seguem encostados no divisor. O rótulo aparece nos dois lados — é repetição, e é ela que mantém a comparação legível em 343px sem quebrar o espelhamento.
- Para comparar mais de três métricas em dois recortes, ainda é `Comparison`. Para comparar duas métricas em doze recortes, é `DataTable`.
