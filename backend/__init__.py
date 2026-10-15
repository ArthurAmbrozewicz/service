"""Fachada do pacote. Quem instala a wheel importa daqui as classes do domínio."""

__version__ = "1.0.0"

from backend.alocacao import AlocacaoService, EstrategiaAlocacao, PorEspecialidade, PrimeiroAtivo
from backend.atendimento import Atendimento, AtendimentoBarbearia, AtendimentoPetshop
from backend.catalogo import Servico, ServicoFuncionario
from backend.comunicacao import (
    EstrategiaNotificacao,
    Notificacao,
    NotificacaoConfirmacao,
    NotificacaoLembrete,
    NotificacaoRecuperacaoSenha,
)
from backend.configuracao import Configuracao, ConfiguracaoService, Estabelecimento, ModuloAcesso
from backend.conexao_banco import ConexaoBanco
from backend.pessoas import Administrador, Cliente, Funcionario, HorarioAtendimento, Usuario
from backend.preco import EstrategiaPreco, PrecoCheio, PrecoDesconto, PrecoService
from backend.relatorio import Relatorio, RelatorioAgenda, RelatorioFinanceiro
from backend.servicos import (
    AgendamentoService,
    AutenticacaoService,
    NotificacaoService,
    PagamentoService,
)
from backend.venda import (
    Agendamento,
    AgendamentoServico,
    PagamentoCartao,
    PagamentoDinheiro,
    PagamentoPix,
    RegrasAgenda,
)

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
    "PagamentoPix",
    "PagamentoCartao",
    "PagamentoDinheiro",
    "Notificacao",
    "EstrategiaNotificacao",
    "NotificacaoConfirmacao",
    "NotificacaoLembrete",
    "NotificacaoRecuperacaoSenha",
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
