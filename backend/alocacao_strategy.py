from abc import ABC, abstractmethod

from backend.conexao_banco import ConexaoBanco


class EstrategiaAlocacao(ABC):
    """Strategy. AlocacaoService chama escolher() com a lista de funcionários."""

    @abstractmethod
    def escolher(self, funcionarios: list) -> dict | None:
        """Devolve um funcionário ativo ou None."""


class PrimeiroAtivo(EstrategiaAlocacao):
    """Estratégia que pega o primeiro funcionário ativo da lista."""

    def escolher(self, funcionarios: list) -> dict | None:
        """Percorre a lista vinda de AlocacaoService.alocar."""
        for funcionario in funcionarios:
            if funcionario["status"] == "ativo":
                return funcionario
        return None


class PorEspecialidade(EstrategiaAlocacao):
    """Estratégia que filtra pela especialidade informada no construtor."""

    def __init__(self, especialidade: str):
        self.especialidade = especialidade

    def escolher(self, funcionarios: list) -> dict | None:
        """Devolve o primeiro ativo cuja especialidade coincide."""
        for funcionario in funcionarios:
            if (
                funcionario["status"] == "ativo"
                and funcionario["especialidade"] == self.especialidade
            ):
                return funcionario
        return None


class AlocacaoService:
    """Contexto do Strategy de alocação."""

    def __init__(self, estrategia: EstrategiaAlocacao):
        self.estrategia = estrategia

    def definir_estrategia(self, estrategia: EstrategiaAlocacao) -> None:
        """Troca a regra de escolha. O próximo alocar usa a nova."""
        self.estrategia = estrategia

    def alocar(self) -> dict | None:
        """Lê a tabela funcionarios e entrega a lista para estrategia.escolher."""
        funcionarios = ConexaoBanco.get_instancia().listar("funcionarios")
        return self.estrategia.escolher(funcionarios)
