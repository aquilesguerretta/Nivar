Campo de texto com rótulo em etiqueta versalete. Passe `error` para acender o fio de erro e o glifo `×`; `hint` é suprimido quando há erro.

```jsx
<Input id="cnpj" label="CNPJ da unidade consumidora" placeholder="00.000.000/0000-00" />
<Input id="razao" label="Razão social" defaultValue="Mineradora Serra Alta S.A." />
<Input id="cnpj2" label="CNPJ" defaultValue="00.000.000/0000" error="Dígito verificador inválido" />
<Input id="uc" label="Unidade consumidora" defaultValue="UC-4471" disabled />
```

- Estados: vazio (placeholder em `--text-faint` peso 300), preenchido, foco (fio advisory + anel 2px offset 2px), erro, desabilitado (opacidade 0.4).
- No modo noturno a mensagem de erro fica em papel e o sinal de erro vive no fio hardware e no glifo — brasa não alcança contraste de texto sobre tinta.
