"""Portão de acesso: produção aberta só para contas liberadas.

Founder, 17/11/2026: "bloquear a alexandria e outros produtos de entrar e
ser possível apenas com login e só liberar os emails aquilesguerretta@gmail.com
e andersonodev@gmail.com, isso para a internet aberta; em produção própria e
em servidores locais pode deixar aberto".

Quando o portão está ATIVO:
  · login e criação de conta só funcionam para os e-mails liberados;
  · toda rota /api/* exige sessão válida de um e-mail liberado
    (fora as de autenticação, que precisam responder para alguém entrar);
  · uma sessão antiga de e-mail não liberado deixa de valer (403).

Quando está ativo — variável ACCESS_GATE:
  · "on"  → sempre ativo;
  · "off" → sempre aberto;
  · ausente → ativo só no ambiente de produção do Railway
    (RAILWAY_ENVIRONMENT_NAME == "production"). Local, CI e qualquer outro
    ambiente ficam abertos sem configurar nada.

A lista vem de ACCESS_ALLOWLIST (e-mails separados por vírgula); sem ela,
vale a lista do Founder abaixo.
"""

from __future__ import annotations

import os

LISTA_PADRAO: tuple[str, ...] = (
    "aquilesguerretta@gmail.com",
    "andersonodev@gmail.com",
)

# Rotas que precisam responder sem sessão para alguém conseguir entrar.
ROTAS_LIVRES: tuple[str, ...] = (
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/me",
    "/api/auth/signup",
)

MENSAGEM = "Acesso restrito: esta conta não está liberada para a NIVAR."


def _normaliza(email: str) -> str:
    return email.strip().lower()


def portao_ativo() -> bool:
    modo = os.environ.get("ACCESS_GATE", "").strip().lower()
    if modo in ("on", "1", "true", "sim"):
        return True
    if modo in ("off", "0", "false", "nao", "não"):
        return False
    return os.environ.get("RAILWAY_ENVIRONMENT_NAME", "").strip().lower() == "production"


def emails_liberados() -> frozenset[str]:
    bruto = os.environ.get("ACCESS_ALLOWLIST", "").strip()
    fonte = bruto.split(",") if bruto else LISTA_PADRAO
    return frozenset(_normaliza(e) for e in fonte if e.strip())


def email_liberado(email: str | None) -> bool:
    """True quando o portão está aberto ou o e-mail está na lista."""
    if not portao_ativo():
        return True
    return bool(email) and _normaliza(email) in emails_liberados()


def rota_livre(caminho: str) -> bool:
    return any(caminho == r or caminho.startswith(r + "/") for r in ROTAS_LIVRES)
