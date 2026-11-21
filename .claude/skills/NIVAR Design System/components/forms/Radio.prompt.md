Escolha única. Mesmo tratamento da caixa, redondo.

```jsx
<Radio id="r1" name="recorte" value="h" label="Apuração horária" defaultChecked />
<Radio id="r2" name="recorte" value="d" label="Apuração diária" />
<Radio id="r3" name="recorte" value="m" label="Apuração mensal" nota="fecha no dia 5" />
```

- `name` igual em todo o grupo, sempre. Sem `name` o rádio não é exclusivo e vira caixa redonda, que é pior que as duas coisas.
- Marcado é disco pleno concêntrico, não glifo. `×` dentro de círculo lê como cancelado.
- Para as quatro opções de submercado use `SubmarketSelector`, não um grupo de rádios: aquilo é eixo de recorte permanente, não formulário.
- Dois ou três itens curtos numa linha: `nv-escolha-fila`. Mais que três, ou rótulos longos: empilhado.
