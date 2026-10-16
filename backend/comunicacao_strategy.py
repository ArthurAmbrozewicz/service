from abc import ABC, abstractmethod
from dataclasses import dataclass

from backend.conexao_banco import ConexaoBanco


@dataclass
class Notificacao:
    """Aviso gravado em notificacoes. usuario_id aponta para clientes.id."""

    id: int
    usuario_id: int  # id do cliente
    titulo: str
    mensagem: str
    data: str  # AAAA-MM-DD HH:MM
    lida: bool = False
    tipo: str = ""  # confirmacao | lembrete | pagamento | alteracao | cancelamento
    canal: str = ""  # email | whatsapp. Quem preenche é NotificacaoService.enviar
    destino: str = ""  # e-mail ou número de WhatsApp do cliente

    def marcar_lida(self) -> None:
        """Marca o aviso como lido no objeto. A tela grava pelo PUT /api/notificacoes."""
        self.lida = True


class EstrategiaNotificacao(ABC):
    """Strategy. Cada canal confere o destino do seu jeito e monta a mensagem no seu formato."""

    canal = ""

    @abstractmethod
    def enviar(self, destino: str, titulo: str, mensagem: str) -> str:
        """Confere o destino e devolve a mensagem pronta. ValueError se o destino não serve para o canal."""


class NotificacaoEmail(EstrategiaNotificacao):
    """Estratégia de e-mail. O destino precisa ter @ e domínio."""

    canal = "email"

    def enviar(self, destino: str, titulo: str, mensagem: str) -> str:
        """Monta o e-mail com remetente, assunto e corpo."""
        usuario, _, dominio = destino.strip().partition("@")
        if not usuario or "." not in dominio:
            raise ValueError("E-mail inválido. Use o formato nome@dominio.com.")
        return f"Para: {destino.strip()}\nAssunto: {titulo}\n\n{mensagem}"


class NotificacaoWhatsApp(EstrategiaNotificacao):
    """Estratégia de WhatsApp. O destino é um telefone com DDD."""

    canal = "whatsapp"

    def enviar(self, destino: str, titulo: str, mensagem: str) -> str:
        """Deixa só os dígitos, põe o código do Brasil e monta a mensagem curta com o título em negrito."""
        numero = "".join(caractere for caractere in destino if caractere.isdigit())
        if len(numero) in (10, 11):
            numero = "55" + numero
        if len(numero) not in (12, 13) or not numero.startswith("55"):
            raise ValueError("Número de WhatsApp inválido. Use DDD e número, como (11) 98765-4321.")
        return f"WhatsApp para +{numero}\n*{titulo}*\n{mensagem}"


class NotificacaoService:
    """Contexto do Strategy de notificação. Guarda a estratégia e chama enviar()."""

    def __init__(self, estrategia: EstrategiaNotificacao):
        self.estrategia = estrategia

    def definir_estrategia(self, estrategia: EstrategiaNotificacao) -> None:
        """Troca o canal em execução. O próximo enviar usa o novo."""
        self.estrategia = estrategia

    def enviar(self, notificacao: Notificacao) -> str:
        """Chama estrategia.enviar, copia o canal para a notificação e grava em notificacoes."""
        texto = self.estrategia.enviar(notificacao.destino, notificacao.titulo, notificacao.mensagem)
        notificacao.canal = self.estrategia.canal
        ConexaoBanco.get_instancia().salvar("notificacoes", notificacao)
        return texto
