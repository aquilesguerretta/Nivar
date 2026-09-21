Campos de filtro numa linha, mais aplicar e limpar.

```jsx
<FilterBar
  resumo={['PLD acima de R$ 900,00','Submercado Sul']}
  acoes={<><Button variant="primario" size="compacto">Aplicar</Button><Button variant="terciario" size="compacto">Limpar</Button></>}>
  <Select label="Submercado" options={['SE/CO','Sul','Nordeste','Norte']} />
  <NumberInput label="PLD mínimo" unidade="R$/MWh" defaultValue="900,00" />
  <Input label="Unidade consumidora" placeholder="UC-0000" />
</FilterBar>
```

**A barra não recebe container.** Cada campo já tem o próprio fio de 1px; envolver o conjunto criaria card dentro de card. `resumo` devolve o filtro em vigor em mono versalete — é o mesmo eco que `EmptyState variant="sem-resultado"` usa.
