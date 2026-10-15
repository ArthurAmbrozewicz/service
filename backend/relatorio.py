from abc import ABC, abstractmethod

from backend.conexao_banco import ConexaoBanco


class Relatorio(ABC):
    """Template Method. montar() fixa cabeçalho, corpo e rodapé. A subclasse muda titulo() e corpo()."""

    def montar(self) -> str:
        """Ordem fixa. corpo() lê o banco. O texto volta para quem pediu o relatório."""
        linhas = self.corpo()
        return f"{self.cabecalho()}\n{linhas}\n{self.rodape(linhas)}"

    def cabecalho(self) -> str:
        """Uso de montar. Chama titulo() da subclasse."""
        return f"== {self.titulo()} =="

    @abstractmethod
    def titulo(self) -> str:
        """Nome do relatório. Implementado em RelatorioAgenda e RelatorioFinanceiro."""

    @abstractmethod
    def corpo(self) -> str:
        """Linhas do relatório. Cada subclasse chama ConexaoBanco.listar numa tabela."""

    def rodape(self, linhas: str) -> str:
        """Uso de montar. Conta as linhas que corpo devolveu."""
        quantidade = 0 if not linhas else linhas.count("\n") + 1
        return f"-- {quantidade} registro(s) --"


class RelatorioAgenda(Relatorio):
    """Relatório dos agendamentos."""

    def titulo(self) -> str:
        """Devolve Agenda para o cabeçalho."""
        return "Agenda"

    def corpo(self) -> str:
        """Lê a tabela agendamentos e devolve data, hora e status."""
        registros = ConexaoBanco.get_instancia().listar("agendamentos")
        return "\n".join(
            f"{item['data']} {item['hora']} ({item['status']})" for item in registros
        )


class RelatorioFinanceiro(Relatorio):
    """Relatório dos pagamentos."""

    def titulo(self) -> str:
        """Devolve Financeiro para o cabeçalho."""
        return "Financeiro"

    def corpo(self) -> str:
        """Lê a tabela pagamentos e devolve método, valor e status."""
        registros = ConexaoBanco.get_instancia().listar("pagamentos")
        return "\n".join(
            f"{item['metodo']} {item['valor']:.2f} ({item['status']})" for item in registros
        )
