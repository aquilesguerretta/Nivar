Painel abaixo da linha, empurrando as seguintes.

```jsx
<table className="nv-tab nv-tab--zebra nv-tab--hover">
  <thead>…</thead>
  <tbody>
    <ExpandableRow
      id="seco"
      celulas={[{ valor: 'Sudeste/CO' }, { valor: '214,80', num: true }, { valor: '+4,2 %', num: true }]}
      padrao
    >
      <Comparison a={…} b={…} linhas={…} />
    </ExpandableRow>
  </tbody>
</table>
```

- **Empurra, nunca sobrepõe.** Sem popover, sem gaveta lateral, sem modal: a linha fica onde está e a tabela cresce.
- O painel usa o fio da tabela. Não envolver o conteúdo em `DataCard` — seria card dentro de grade.
- `indentado` quando o detalhe pertence à primeira coluna (um submercado dentro de uma região); largura total quando é comparação ou série.
- Zebra: a linha aberta e o painel ficam do mesmo lado da alternância, para o par ler como um bloco só.
- Uma linha aberta por vez é a recomendação. Três painéis abertos numa tabela de 40 linhas destroem a varredura vertical que a tabela existe para permitir.
