Erro com procedência. As duas linhas de baixo — fonte que falhou e última apuração bem-sucedida — são obrigatórias: é o que separa uma falha honesta de um dado silenciosamente errado.

```jsx
<ErrorState variant="falha-carregamento" fonte="ONS · carga verificada"
  ultimaApuracao="2026-08-04 · 11:00 BRT"
  acoes={<Button variant="secundario">Tentar novamente</Button>} />
<ErrorState variant="dado-desatualizado" />
<ErrorState variant="fonte-indisponivel" />
```

- **Advisory como fio de 2px no topo.** Nunca vermelho de UI: neste sistema cor é direção e temperatura, não severidade.
- Nomeie a fonte com o recorte (`'CCEE · contabilização mensal'`), não só a sigla.
- Nunca estime, interpole ou substitua valor para preencher o buraco — diga que não há.
