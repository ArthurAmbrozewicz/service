from dataclasses import dataclass


@dataclass
class Usuario:
    """Base de Cliente e Funcionario. A linha vive nas tabelas clientes ou funcionarios."""

    id: int
    nome: str
    email: str
    senha_hash: str
    status: str  # ativo | inativo

    def senha_confere(self, senha_hash: str) -> bool:
        """Chamada por AutenticacaoService.entrar. True só com status ativo e hash igual."""
        return self.status == "ativo" and self.senha_hash == senha_hash


@dataclass
class Cliente(Usuario):
    """Comprador. O id desta classe é o usuario_id de notificacoes."""

    telefone: str
    cpf: str

    def alterar_telefone(self, telefone: str) -> None:
        """Muda o telefone no objeto. Quem grava no banco é o PUT /api/clientes."""
        self.telefone = telefone


@dataclass
class Funcionario(Usuario):
    """Prestador. AlocacaoService escolhe uma linha desta tabela."""

    estabelecimento_id: int
    especialidade: str
    telefone: str

    def alterar_especialidade(self, especialidade: str) -> None:
        """Muda a especialidade no objeto. Quem grava no banco é o PUT /api/funcionarios."""
        self.especialidade = especialidade


@dataclass
class Administrador(Funcionario):
    """Funcionário que configura o estabelecimento. O papel é a própria classe."""

    def pode_configurar(self) -> bool:
        """True quando o administrador está ativo. Quem decide a tela é o frontend."""
        return self.status == "ativo"


@dataclass
class HorarioAtendimento:
    """Grade de um funcionário. A tabela no banco se chama horarios."""

    id: int
    funcionario_id: int
    dia_semana: str  # domingo | segunda | terca | quarta | quinta | sexta | sabado
    hora_inicio: str  # HH:MM
    hora_fim: str  # HH:MM

    def cobre(self, dia: str, hora: str) -> bool:
        """True se o dia e a hora caem neste intervalo. Uso de quem monta a agenda."""
        return self.dia_semana == dia and self.hora_inicio <= hora <= self.hora_fim
