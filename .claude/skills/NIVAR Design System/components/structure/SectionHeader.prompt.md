Cabeçalho de seção — o padrão de divisão do sistema. Não usa container: o fio faz o trabalho.

```jsx
<SectionHeader numero={1} titulo="Escala de incandescência" nota="Cor é temperatura, não decoração" />
<SectionHeader numero="04" titulo="Prova do dado tabular" grande />
```

- `numero` recebe `padStart(2,'0')` e sai em mono em `--accent-house`: brasa no claro, intelligence no noturno (brasa não lê sobre tinta).
- `nota` sai em mono versalete à direita, na mesma linha de baseline.
- Espaçamento vertical é do container, teto de 32px.
