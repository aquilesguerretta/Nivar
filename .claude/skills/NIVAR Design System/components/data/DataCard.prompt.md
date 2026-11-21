Card de dado dentro de `DataCardGrid` — os cards compartilham fio, nunca há card dentro de card.

```jsx
<DataCardGrid columns={4}>
  <DataCard etiqueta="PLD SE/CO" valor={214.8} unidade="R$/MWh" delta={11.4} familia="intelligence" />
  <DataCard etiqueta="Carga SIN" valor={101328} casas={0} unidade="MW médios" delta={-4.8} />
  <DataCard etiqueta="Migração ao ACL" valor="0 %" nota="da receita vem de comissão" familia="advisory" />
  <DataCard etiqueta="Unidades cobertas" valor={1471} casas={0} />
</DataCardGrid>
```

- `familia` põe um fio de 2px no topo na cor da família — use só quando o card pertence a um produto de família.
- `solto` dá fio próprio ao card fora da grade.
- `valor` numérico é formatado (vírgula decimal, espaço fino no milhar); string passa intacta.
