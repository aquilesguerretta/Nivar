Mensagem de sistema, transitória.

```jsx
<Toast mensagem="Dado atualizado. Ciclo 2026-08 apurado pela CCEE." timestamp="14:32 BRT" />
<Toast mensagem="Exportação concluída — 28 934 linhas." timestamp="14:33 BRT" duracao={0} />
<Toast mensagem="ONS não respondeu. Exibindo a última apuração." advisory />
```

- **Sem ícone e sem emoji.** Barra plana ancorada na largura do conteúdo, nunca bolha flutuante centralizada.
- `duracao={0}` desliga a auto-dispensa; use para mensagem que o leitor precisa poder reler.
- A mensagem nomeia o que mudou e quanto. "Dado atualizado" sozinho não informa nada.
