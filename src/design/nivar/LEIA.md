Destino de PRODUÇÃO dos tokens NIVAR — o Vite importa daqui, nunca de `.claude/`, que é configuração de agente e não raiz de build; a referência de agente vive em `.claude/skills/NIVAR Design System/tokens/` e as duas cópias precisam ser comparadas por hash quando qualquer uma mudar, para que a divergência seja detectável em vez de silenciosa.

Só os SEIS tokens estão aqui. O CSS de componente entra por demanda, conforme
cada tela usar — nada aterrissa em `src/` sem uso.

Sincronizado em 2026-08-07, os seis byte-idênticos à referência, já com o
`--ease-loop` de `motion.css` (FOUNDRY · NIVAR Wave 1).

O sistema NIVAR é da CASA. A Alexandria tem identidade própria — navy,
pergaminho, Cinzel + Lora — e continua tendo: `alexandria-tokens.ts` e
`tokens.ts` não importam daqui e não foram tocados.
