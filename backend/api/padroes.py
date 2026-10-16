"""Rotas POST /api/padroes/<nome>. Cada tela de src/pages/Demonstracoes escolhe a classe filha e estas funções executam a classe de verdade.

O checkout usa dois padrões: a regra de preço (Strategy) e a forma de pagamento (Template Method)."""

from datetime import datetime

from backend.alocacao_strategy import AlocacaoService, PorEspecialidade, PrimeiroAtivo
from backend.atendimento_method import AtendimentoBarbearia, AtendimentoPetshop
from backend.comunicacao_strategy import Notificacao, NotificacaoEmail, NotificacaoService, NotificacaoWhatsApp
from backend.pagamento_method import PagamentoCartao, PagamentoDinheiro, PagamentoPix, PagamentoService
from backend.preco_strategy import PrecoCheio, PrecoDesconto, PrecoService
from backend.relatorio_method import RelatorioAgenda, RelatorioFinanceiro

# Opção da tela -> classe filha.
CANAIS = {"email": NotificacaoEmail, "whatsapp": NotificacaoWhatsApp}
PRECOS = {"cheio": PrecoCheio, "desconto": PrecoDesconto}
ALOCACOES = {"primeiro_ativo": PrimeiroAtivo, "por_especialidade": PorEspecialidade}
PAGAMENTOS = {"pix": PagamentoPix, "cartao": PagamentoCartao, "dinheiro": PagamentoDinheiro}
RELATORIOS = {"agenda": RelatorioAgenda, "financeiro": RelatorioFinanceiro}
ATENDIMENTOS = {"petshop": AtendimentoPetshop, "barbearia": AtendimentoBarbearia}


def executar(nome: str, dados: dict) -> dict:
    """POST /api/padroes/<nome>. KeyError se faltar campo ou a opção não existe. ValueError vem das próprias classes."""
    return ROTAS[nome](dados)


def _escolher(mapa: dict, dados: dict, campo: str):
    """Devolve a classe filha escolhida na tela. KeyError se a opção não existe."""
    return mapa[str(dados[campo])]


def _origem(objeto, metodo: str) -> str:
    """Nome da classe que escreveu o método: a mãe ou a filha. Lido do próprio Python, pela ordem de herança."""
    for classe in type(objeto).__mro__:
        if metodo in classe.__dict__:
            return classe.__name__
    return type(objeto).__name__


def _agora() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M")


def _notificacao(dados: dict) -> dict:
    """Monta NotificacaoService com o canal escolhido. enviar confere o destino, formata e grava em notificacoes."""
    classe = _escolher(CANAIS, dados, "canal")
    notificacao = Notificacao(
        id=0,
        usuario_id=int(dados["usuario_id"]),
        titulo=str(dados["titulo"]),
        mensagem=str(dados["mensagem"]),
        data=_agora(),
        tipo=str(dados["tipo"]),
        destino=str(dados["destino"]),
    )
    texto = NotificacaoService(classe()).enviar(notificacao)
    return {"classe": classe.__name__, "canal": notificacao.canal, "texto": texto, "registro": notificacao.id}


def _preco_service(dados: dict) -> PrecoService:
    """Monta PrecoService com a regra de preço escolhida no checkout."""
    classe = _escolher(PRECOS, dados, "estrategia")
    estrategia = classe(float(dados.get("percentual", 10))) if classe is PrecoDesconto else classe()
    return PrecoService(estrategia)


def _preco(dados: dict) -> dict:
    """Prévia do checkout: só calcula o valor a pagar, sem cobrar."""
    servico = _preco_service(dados)
    valor = float(dados["valor"])
    return {"classe": type(servico.estrategia).__name__, "valor": valor, "resultado": servico.aplicar(valor)}


def _alocacao(dados: dict) -> dict:
    """Monta AlocacaoService com a estratégia escolhida e chama alocar, que lê funcionarios."""
    classe = _escolher(ALOCACOES, dados, "estrategia")
    estrategia = classe(str(dados.get("especialidade", ""))) if classe is PorEspecialidade else classe()
    escolhido = AlocacaoService(estrategia).alocar()
    funcionario = None
    if escolhido is not None:
        # Só os campos da tela. O hash da senha não sai da API.
        funcionario = {campo: escolhido[campo] for campo in ("id", "nome", "especialidade", "status")}
    return {"classe": classe.__name__, "funcionario": funcionario}


def _pagamento(dados: dict) -> dict:
    """Checkout. A regra de preço (Strategy) calcula o valor; a subclasse de Pagamento (Template Method) cobra."""
    classe = _escolher(PAGAMENTOS, dados, "metodo")
    preco = _preco_service(dados)
    valor_tabela = float(dados["valor"])
    pagamento = classe(
        id=0,
        cliente_id=int(dados["cliente_id"]),
        agendamento_id=int(dados["agendamento_id"]),
        valor=preco.aplicar(valor_tabela),
        status="pendente",
        data=_agora(),
    )
    texto = PagamentoService().cobrar(pagamento)
    codigo = texto.split(": ", 1)[1]
    passos = [
        {"metodo": "_validar", "classe": _origem(pagamento, "_validar"), "texto": f"valor {pagamento.valor:.2f} maior que zero"},
        {"metodo": "autorizar", "classe": _origem(pagamento, "autorizar"), "texto": f"código {codigo}"},
        {"metodo": "executar", "classe": _origem(pagamento, "executar"), "texto": f"status muda para {pagamento.status}"},
        {"metodo": "executar", "classe": _origem(pagamento, "executar"), "texto": f"grava em pagamentos, id {pagamento.id}"},
    ]
    return {
        "classe": classe.__name__,
        "classe_preco": type(preco.estrategia).__name__,
        "valor_tabela": valor_tabela,
        "valor": pagamento.valor,
        "texto": texto,
        "codigo": codigo,
        "passos": passos,
        "registro": pagamento.id,
    }


def _relatorio(dados: dict) -> dict:
    """Cria a subclasse escolhida e chama montar. A primeira linha é o cabeçalho e a última, o rodapé."""
    classe = _escolher(RELATORIOS, dados, "tipo")
    relatorio = classe()
    linhas = relatorio.montar().split("\n")
    corpo = [linha for linha in linhas[1:-1] if linha]  # corpo vazio deixa uma linha em branco
    passos = [
        {"metodo": "cabecalho", "classe": _origem(relatorio, "cabecalho"), "texto": f"usa titulo() de {_origem(relatorio, 'titulo')}: {linhas[0]}"},
        {"metodo": "corpo", "classe": _origem(relatorio, "corpo"), "texto": f"{len(corpo)} linha(s) lidas do banco"},
        {"metodo": "rodape", "classe": _origem(relatorio, "rodape"), "texto": linhas[-1]},
    ]
    return {"classe": classe.__name__, "cabecalho": linhas[0], "corpo": corpo, "rodape": linhas[-1], "passos": passos}


def _atendimento(dados: dict) -> dict:
    """Cria a subclasse do segmento e chama realizar com a data e a hora informadas."""
    classe = _escolher(ATENDIMENTOS, dados, "segmento")
    atendimento = classe()
    texto = atendimento.realizar({"data": str(dados["data"]), "hora": str(dados["hora"])})
    frases = texto.split(" | ")
    metodos = ["preparar", "executar_servico", "concluir"]
    passos = [
        {"metodo": metodo, "classe": _origem(atendimento, metodo), "texto": frase}
        for metodo, frase in zip(metodos, frases)
    ]
    return {"classe": classe.__name__, "texto": texto, "passos": passos}


ROTAS = {
    "notificacao": _notificacao,
    "preco": _preco,
    "alocacao": _alocacao,
    "pagamento": _pagamento,
    "relatorio": _relatorio,
    "atendimento": _atendimento,
}
