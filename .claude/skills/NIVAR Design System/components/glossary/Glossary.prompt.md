Glossário dos termos que o sistema não traduz.

```jsx
<Glossary />
<Glossary compacto termos={[{ termo:'PLD', definicao:'…' }]} />
```

- O conjunto padrão vem de `termos.js` e cobre apuração, carga, contraditório, mercado livre, migração, MWh, PLD e submercado. **É a mesma fonte que `ContextHint` lê**, então a definição inline e a do glossário nunca divergem — edite `termos.js`, não os dois.
- Ordenação alfabética pt-BR é aplicada no componente; não pré-ordene.
- `compacto` põe a definição abaixo do termo, para coluna estreita.
