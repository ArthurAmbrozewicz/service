from dataclasses import fields

from backend.comunicacao import EstrategiaNotificacao, Notificacao
from backend.conexao_banco import ConexaoBanco
from backend.pessoas import Cliente, Funcionario
from backend.venda import Agendamento, AgendamentoServico, Pagamento, RegrasAgenda


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


class PagamentoService:
    """Contexto do Template Method de pagamento."""

    def __init__(self):
        self.ultimo_codigo = ""

    def cobrar(self, pagamento: Pagamento) -> str:
        """Chama pagamento.executar, que valida, autoriza e grava. Guarda o texto em ultimo_codigo."""
        self.ultimo_codigo = pagamento.executar()
        return self.ultimo_codigo


class NotificacaoService:
    """Contexto do Strategy de notificação. Guarda a estratégia e chama enviar()."""

    def __init__(self, estrategia: EstrategiaNotificacao):
        self.estrategia = estrategia

    def definir_estrategia(self, estrategia: EstrategiaNotificacao) -> None:
        """Troca a estratégia em execução. O próximo enviar usa a nova."""
        self.estrategia = estrategia

    def enviar(self, notificacao: Notificacao) -> str:
        """Chama estrategia.enviar, copia o tipo para a notificação e grava em notificacoes."""
        texto = self.estrategia.enviar(notificacao.titulo, notificacao.mensagem)
        notificacao.tipo = self.estrategia.tipo
        ConexaoBanco.get_instancia().salvar("notificacoes", notificacao)
        return texto
