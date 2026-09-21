Token de tecla e marcador de recente.

```jsx
<span className="nv-linha-acao">Busca <Shortcut teclas={['⌘', 'K']} /></span>
<Shortcut>Ctrl+K</Shortcut>

<h3>O PLD de julho <RecentMarker /></h3>
<h3>Série horária reprocessada <RecentMarker variant="atualizado" /></h3>
```

- Uma tecla por retângulo, com `+` mono entre elas.
- `RecentMarker` é **texto em versalete na cor de acento** — nunca bolinha, nunca badge com fundo. Ponto colorido não diz o que mudou.
- `novo` para o que não existia; `atualizado` para o que foi republicado. Se a distinção não importa na tela, não marque nada.
- O marcador sai quando deixa de ser verdade. Um "NOVO" de três meses treina o leitor a ignorá-lo.
