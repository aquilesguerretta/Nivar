Estado de frescor do dado. Três estados, sem semáforo.

```jsx
<DataFreshness estado="vivo" detalhe="atualizado há 4min" />
<DataFreshness estado="desatualizado" detalhe="última apuração há 6 dias" />
<DataFreshness estado="ilustrativa" />
```

- **Nunca verde / amarelo / vermelho.** Não existe verde no sistema, e status por cor é exatamente o que a regra do dado numérico rejeita. O estado está no texto.
- O ponto é neutro quente de 6px e só aparece em `vivo`. Não colorir, não piscar, não animar — o único movimento em loop do sistema é o fio do `BrandLoader`.
- `detalhe` fica em minúsculas: só o rótulo do estado vai a caixa alta, como em `AO VIVO · atualizado há 4min`.
- Não substitui `Provenance`. Frescor diz quando o dado foi apurado; procedência diz de onde ele vem. Numa mesma tela os dois aparecem juntos, frescor acima da tabela e procedência abaixo.
