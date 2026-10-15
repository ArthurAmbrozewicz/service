from abc import ABC, abstractmethod
from dataclasses import dataclass

from backend.conexao_banco import ConexaoBanco


@dataclass
class RegrasAgenda:
    """Intervalo da grade. AgendamentoService.comprar chama hora_na_grade antes de gravar."""

    intervalo: int  # minutos entre horários

    def hora_na_grade(self, hora: str) -> bool:
        """True se a hora cai no intervalo. False faz comprar lançar ValueError."""
        minutos = int(hora[0:2]) * 60 + int(hora[3:5])
        return self.intervalo > 0 and minutos % self.intervalo == 0


@dataclass
class Agendamento:
    """Horário comprado. Tabela agendamentos. Gravado por AgendamentoService.comprar."""

    id: int
    cliente_id: int
    funcionario_id: int
    data: str  # AAAA-MM-DD
    hora: str  # HH:MM
    status: str
    observacoes: str

    def cancelar(self) -> None:
        """Muda o status no objeto para cancelado. A tela grava pelo PUT /api/agendamentos."""
        self.status = "cancelado"


@dataclass
class AgendamentoServico:
    """Serviço vendido dentro de um horário. Tabela agendamento_servicos."""

    id: int
    agendamento_id: int
    servico_id: int
    valor: float  # preço na compra

    def atualizar_valor(self, valor: float) -> None:
        """Muda o valor no objeto. comprar grava o item depois de receber o id do agendamento."""
        self.valor = valor


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
