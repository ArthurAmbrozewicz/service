from dataclasses import fields

from backend.conexao_banco import ConexaoBanco
from backend.pessoas import Cliente, Funcionario
from backend.venda import Agendamento, AgendamentoServico, RegrasAgenda


class AutenticacaoService:
    """Login de cliente ou funcionário."""

    def __init__(self):
        self.usuario_logado = None

    def entrar(self, email: str, senha_hash: str):
        """Busca o e-mail em funcionarios e depois em clientes. Segue para senha_confere. Devolve o objeto ou None."""
        banco = ConexaoBanco.get_instancia()
        for tabela, classe in (("funcionarios", Funcionario), ("clientes", Cliente)):
            linhas = banco.consultar(f"SELECT * FROM {tabela} WHERE email = ?", (email,))
            for linha in linhas:
                aceitos = {campo.name for campo in fields(classe)}
                usuario = classe(**{nome: linha[nome] for nome in aceitos})
                if usuario.senha_confere(senha_hash):
                    self.usuario_logado = usuario
                    return usuario
        return None

    def sair(self) -> None:
        """Limpa usuario_logado. Não mexe no banco."""
        self.usuario_logado = None


class AgendamentoService:
    """Compra de horário."""

    def __init__(self, regras: RegrasAgenda):
        self.regras = regras

    def comprar(self, agendamento: Agendamento, itens: list[AgendamentoServico]) -> Agendamento:
        """Confere a grade em hora_na_grade, grava o agendamento e copia o id para cada item antes de salvar."""
        if not itens:
            raise ValueError("Informe ao menos um serviço")
        if not self.regras.hora_na_grade(agendamento.hora):
            raise ValueError("Horário fora da grade")
        banco = ConexaoBanco.get_instancia()
        banco.salvar("agendamentos", agendamento)
        for item in itens:
            item.agendamento_id = agendamento.id
            banco.salvar("agendamento_servicos", item)
        return agendamento
