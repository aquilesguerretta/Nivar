Unidade dentro do campo. O padrão único de prefixo e sufixo.

```jsx
<UnitField id="u1" label="Preço de contrato" prefixo="R$" sufixo="/MWh" placeholder="0,00" obrigatorio />
<UnitField id="u2" label="Consumo mensal" sufixo="MWh" defaultValue="1 284,00" />
<UnitField id="u3" label="Desconto na tarifa" sufixo="%" defaultValue="18,4" />
<UnitField id="u4" label="CNPJ da unidade" numerico={false} verificando />
```

- **A unidade não tem fio separador.** Ela é legenda do número, não célula. O fio de `NumberInput` fica reservado a entrada tabular, onde a unidade encabeça a coluna.
- Unidade em `--text-faint`, mono, `aria-hidden` — o leitor de tela recebe a unidade pelo rótulo, não repetida no meio do valor.
- `obrigatorio` é asterisco em acento. Uma convenção só: não marcar "opcional" nos outros campos, não escrever a palavra.
- `verificando` desenha um fio na base do campo em loop de 1400ms. Nunca spinner: o sistema revela desenhando.
- Prefixo e sufixo podem coexistir (`R$` … `/MWh`), e é o caso mais comum do domínio.
