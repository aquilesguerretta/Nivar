Placeholder de carregamento com a mesma geometria do conteúdo que substitui.

```jsx
<Skeleton variant="tabela" rows={5} columns={4} />
<Skeleton variant="card" />
<Skeleton variant="texto" rows={4} />
```

- **Sem shimmer e sem pulso de opacidade.** A revelação é desenho: o fio de 1px cresce em 700ms, a barra cresce em altura em 1200ms, com o easing único do sistema. Roda uma vez e para.
- Escalonamento por linha e por coluna é o que dá leitura de progresso — não use `animation-delay: 0` em todos.
- `prefers-reduced-motion` entrega o estado final sem animação.
