from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Notificacao:
    """Aviso gravado em notificacoes. usuario_id aponta para clientes.id."""

    id: int
    usuario_id: int  # id do cliente
    titulo: str
    mensagem: str
    data: str  # AAAA-MM-DD HH:MM
    lida: bool = False
    tipo: str = ""  # confirmacao | lembrete | recuperacao_senha

    def marcar_lida(self) -> None:
        """Marca o aviso como lido no objeto. A tela grava pelo PUT /api/notificacoes."""
        self.lida = True


class EstrategiaNotificacao(ABC):
    """Strategy. NotificacaoService chama enviar() e troca a estratégia com definir_estrategia()."""

    tipo = ""

    @abstractmethod
    def enviar(self, titulo: str, mensagem: str) -> str:
        """Monta o texto. O resultado volta para NotificacaoService.enviar, que grava a notificação."""


class NotificacaoConfirmacao(EstrategiaNotificacao):
    """Estratégia de confirmação de horário."""

    def __init__(self):
        self.tipo = "confirmacao"

    def enviar(self, titulo: str, mensagem: str) -> str:
        """Devolve o texto com o prefixo Confirmação."""
        return f"Confirmação: {titulo}. {mensagem}"


class NotificacaoLembrete(EstrategiaNotificacao):
    """Estratégia de lembrete."""

    def __init__(self):
        self.tipo = "lembrete"

    def enviar(self, titulo: str, mensagem: str) -> str:
        """Devolve o texto com o prefixo Lembrete."""
        return f"Lembrete: {titulo}. {mensagem}"


class NotificacaoRecuperacaoSenha(EstrategiaNotificacao):
    """Estratégia de recuperação de senha."""

    def __init__(self):
        self.tipo = "recuperacao_senha"

    def enviar(self, titulo: str, mensagem: str) -> str:
        """Devolve o texto com o prefixo Senha."""
        return f"Senha: {titulo}. {mensagem}"
