from dataclasses import dataclass


@dataclass
class Servico:
    """Item vendido. AgendamentoServico guarda o preço no momento da compra."""

    id: int
    estabelecimento_id: int
    nome: str
    categoria: str
    duracao_min: int
    preco: float
    status: str  # ativo | inativo

    def inativar(self) -> None:
        """Marca o serviço como inativo no objeto. A tela grava pelo PUT /api/servicos."""
        self.status = "inativo"


@dataclass
class ServicoFuncionario:
    """Liga um serviço a quem pode executá-lo. Tabela servico_funcionarios."""

    id: int
    servico_id: int
    funcionario_id: int

    def atende(self, funcionario_id: int) -> bool:
        """True se este vínculo é do funcionário informado."""
        return self.funcionario_id == funcionario_id
