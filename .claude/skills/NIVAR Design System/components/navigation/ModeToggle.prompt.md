Seletor de modo em texto mono. Sem caixa, sem ícone de sol ou lua.

```jsx
<ModeToggle target="documento" />
<ModeToggle value={modo} onChange={setModo} />
```

`target="documento"` escreve `data-mode="noturno"` em `<html>`; para escopo local, controle com `value`/`onChange` e aplique o atributo você mesmo. Transição de 150ms com o easing único.
