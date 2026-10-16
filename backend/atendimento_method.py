from abc import ABC, abstractmethod


class Atendimento(ABC):
    """Template Method. realizar() fixa preparar, executar e concluir. O segmento muda os dois passos das pontas."""

    def realizar(self, agendamento: dict) -> str:
        """Ordem fixa. Recebe um dicionário com data e hora e devolve as três frases juntas."""
        preparo = self.preparar(agendamento)
        execucao = self.executar_servico(agendamento)
        encerramento = self.concluir(agendamento)
        return f"{preparo} | {execucao} | {encerramento}"

    @abstractmethod
    def preparar(self, agendamento: dict) -> str:
        """Passo inicial. Petshop e barbearia escrevem frases diferentes."""

    def executar_servico(self, agendamento: dict) -> str:
        """Passo comum. Igual para todo segmento."""
        return f"atende em {agendamento['data']} às {agendamento['hora']}"

    @abstractmethod
    def concluir(self, agendamento: dict) -> str:
        """Passo final. Petshop registra retorno. Barbearia oferece o próximo horário."""


class AtendimentoPetshop(Atendimento):
    """Subclasse do template para o segmento petshop."""

    def preparar(self, agendamento: dict) -> str:
        """Confere a ficha do pet antes do passo comum."""
        return "confere a ficha do pet"

    def concluir(self, agendamento: dict) -> str:
        """Fecha o atendimento com o registro de retorno."""
        return "registra o retorno"


class AtendimentoBarbearia(Atendimento):
    """Subclasse do template para o segmento barbearia."""

    def preparar(self, agendamento: dict) -> str:
        """Confirma o corte antes do passo comum."""
        return "confirma o corte"

    def concluir(self, agendamento: dict) -> str:
        """Fecha o atendimento oferecendo outro horário."""
        return "oferece o próximo horário"
