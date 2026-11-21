Vazio com razão declarada. Escolha o caso pelo motivo real — os três não são intercambiáveis.

```jsx
<EmptyState variant="sem-dado" />
<EmptyState variant="sem-resultado" filtros={['PLD acima de R$ 900,00','Submercado Sul']}
  acoes={<Button variant="terciario">Remover filtro</Button>} />
<EmptyState variant="sem-permissao" conjunto="ccee.contratos_bilaterais" concessor="Administrador da conta" />
```

- **sem-dado** — a série existe, o ciclo não fechou. Diga quando fecha. Recebe o eixo em fio, porque a estrutura do dado já existe.
- **sem-resultado** — devolva o filtro ativo ao leitor e ofereça removê-lo. Sem o eco do filtro o vazio parece defeito.
- **sem-permissao** — nomeie o conjunto e quem concede. O conjunto recebe fio porque tem fronteira real; os outros dois casos não recebem container.
- Nunca ilustração, nunca emoji, nunca desculpa. Errado: "Ops! Não encontramos nada 😕". Certo: "Nenhum submercado atende ao filtro."
