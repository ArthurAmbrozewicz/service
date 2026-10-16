"""Fachada do pacote. Quem instala a wheel importa daqui as classes do domínio."""

__version__ = "1.0.0"

from backend.alocacao_strategy import AlocacaoService, EstrategiaAlocacao, PorEspecialidade, PrimeiroAtivo
from backend.atendimento_method import Atendimento, AtendimentoBarbearia, AtendimentoPetshop
from backend.catalogo import Servico, ServicoFuncionario
from backend.comunicacao_strategy import (
    EstrategiaNotificacao,
    Notificacao,
    NotificacaoEmail,
    NotificacaoService,
    NotificacaoWhatsApp,
)
from backend.configuracao import Configuracao, ConfiguracaoService, Estabelecimento, ModuloAcesso
from backend.conexao_banco import ConexaoBanco
from backend.pagamento_method import (
    Pagamento,
    PagamentoCartao,
    PagamentoDinheiro,
    PagamentoPix,
    PagamentoService,
)
from backend.pessoas import Administrador, Cliente, Funcionario, HorarioAtendimento, Usuario
from backend.preco_strategy import EstrategiaPreco, PrecoCheio, PrecoDesconto, PrecoService
from backend.relatorio_method import Relatorio, RelatorioAgenda, RelatorioFinanceiro
from backend.servicos import AgendamentoService, AutenticacaoService
from backend.venda import Agendamento, AgendamentoServico, RegrasAgenda

__all__ = [
    "ConexaoBanco",
    "ConfiguracaoService",
    "Usuario",
    "Cliente",
    "Funcionario",
    "Administrador",
    "HorarioAtendimento",
    "Estabelecimento",
    "Configuracao",
    "ModuloAcesso",
    "RegrasAgenda",
    "Servico",
    "ServicoFuncionario",
    "Agendamento",
    "AgendamentoServico",
    "Pagamento",
    "PagamentoPix",
    "PagamentoCartao",
    "PagamentoDinheiro",
    "Notificacao",
    "EstrategiaNotificacao",
    "NotificacaoEmail",
    "NotificacaoWhatsApp",
    "AutenticacaoService",
    "AgendamentoService",
    "PagamentoService",
    "NotificacaoService",
    "Relatorio",
    "RelatorioAgenda",
    "RelatorioFinanceiro",
    "Atendimento",
    "AtendimentoPetshop",
    "AtendimentoBarbearia",
    "EstrategiaPreco",
    "PrecoCheio",
    "PrecoDesconto",
    "PrecoService",
    "EstrategiaAlocacao",
    "PrimeiroAtivo",
    "PorEspecialidade",
    "AlocacaoService",
]
