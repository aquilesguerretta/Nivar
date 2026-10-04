As quatro opções fixas, sempre as mesmas.

```jsx
const [sub, setSub] = React.useState('SE');
<SubmarketSelector valor={sub} onChange={setSub} familia="intelligence" />

// filtro de tabela: mais de um recorte
<SubmarketSelector multiplo valor={['SE','S']} onChange={setSubs} familia="software" />
```

- **Nunca `Select` para isso.** Quatro opções permanentes não são um menu: são o eixo do recorte, e ficam visíveis.
- Nunca preenchimento sólido nem pílula na opção ativa. Fio de 2px na cor da família, texto em `--text-strong`.
- Dentro de `FilterBar` entra como primeiro item da linha e ocupa a largura que precisar — não é um campo de 150px.
- Abaixo de 640px as quatro opções quebram em duas linhas com 44px de altura de toque. Não usar `sigla` no mobile só para caber: o nome do submercado é o dado.
