from dataclasses import dataclass


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
