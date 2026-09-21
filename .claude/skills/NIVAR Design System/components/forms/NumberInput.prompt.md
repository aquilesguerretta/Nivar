Campo numérico. Todo número editável usa este componente, nunca `Input` — mono tabular alinhado à direita mantém o eixo da vírgula em coluna de formulário.

```jsx
<NumberInput id="pld" label="PLD contratado" defaultValue="214,80" unidade="R$/MWh" />
<NumberInput id="carga" label="Carga contratada" defaultValue="68 412" unidade="MW" hint="Média do último ciclo de apuração" />
<NumberInput id="desc" label="Desconto pretendido" defaultValue="182" unidade="%" error="Acima do teto regulatório" />
```

- `unidade` fica atrás de um fio de 1px, em etiqueta mono de 10.5px.
- Vírgula decimal e espaço fino (U+2009) no milhar. `formatarNumero` de `./formatar.js` (em `components/data/`) produz a forma canônica.
