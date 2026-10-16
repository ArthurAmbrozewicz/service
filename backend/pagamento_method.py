from abc import ABC, abstractmethod
from dataclasses import dataclass

from backend.conexao_banco import ConexaoBanco


@dataclass
class Pagamento(ABC):
    """Template Method. executar() fixa a ordem. A subclasse implementa autorizar()."""

    id: int
    cliente_id: int
    agendamento_id: int
    valor: float
    status: str  # pago | pendente | cancelado
    data: str  # AAAA-MM-DD HH:MM
    metodo: str = ""  # pix | cartao | dinheiro

    def executar(self) -> str:
        """Chamado por PagamentoService.cobrar. Ordem: _validar, autorizar, status pago, ConexaoBanco.salvar em pagamentos."""
        self._validar()
        codigo = self.autorizar()
        self.status = "pago"
        ConexaoBanco.get_instancia().salvar("pagamentos", self)
        return f"{self.metodo} autorizado: {codigo}"

    def _validar(self) -> None:
        """Uso de executar. ValueError se o valor não é positivo."""
        if self.valor <= 0:
            raise ValueError("Valor deve ser maior que zero")

    @abstractmethod
    def autorizar(self) -> str:
        """Passo variável. PIX, cartão e dinheiro devolvem o código da cobrança."""


@dataclass
class PagamentoPix(Pagamento):
    """Subclasse do template. metodo pix."""

    metodo: str = "pix"

    def autorizar(self) -> str:
        """Devolve o código PIX. executar grava o pagamento em seguida."""
        return f"PIX-{self.valor:.2f}"


@dataclass
class PagamentoCartao(Pagamento):
    """Subclasse do template. metodo cartao."""

    metodo: str = "cartao"

    def autorizar(self) -> str:
        """Devolve o código do cartão. executar grava o pagamento em seguida."""
        return f"CARD-{self.valor:.2f}"


@dataclass
class PagamentoDinheiro(Pagamento):
    """Subclasse do template. metodo dinheiro."""

    metodo: str = "dinheiro"

    def autorizar(self) -> str:
        """Devolve o código de dinheiro. executar grava o pagamento em seguida."""
        return "DINHEIRO"


class PagamentoService:
    """Contexto do Template Method de pagamento."""

    def __init__(self):
        self.ultimo_codigo = ""

    def cobrar(self, pagamento: Pagamento) -> str:
        """Chama pagamento.executar, que valida, autoriza e grava. Guarda o texto em ultimo_codigo."""
        self.ultimo_codigo = pagamento.executar()
        return self.ultimo_codigo
