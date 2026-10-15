from dataclasses import dataclass


@dataclass
class Estabelecimento:
    """Negócio que usa a plataforma. O segmento (petshop, barbearia, academia, estetica) fica aqui."""

    id: int
    nome: str
    segmento: str

    def renomear(self, nome: str) -> None:
        """Muda o nome no objeto. A tela grava pelo PUT /api/estabelecimentos."""
        self.nome = nome


@dataclass
class Configuracao:
    """Grade, cores e rótulos de um estabelecimento. Tabela configuracoes."""

    id: int
    estabelecimento_id: int
    intervalo: int  # minutos da grade
    cores: str
    rotulos: str

    def personalizar(self, intervalo: int, cores: str, rotulos: str) -> None:
        """Atualiza os três campos no objeto. O intervalo alimenta RegrasAgenda."""
        self.intervalo = intervalo
        self.cores = cores
        self.rotulos = rotulos


@dataclass
class ModuloAcesso:
    """Uma funcionalidade ligada ou desligada para um estabelecimento. Tabela modulos."""

    id: int
    estabelecimento_id: int
    modulo: str
    usa: bool

    def definir_uso(self, usa: bool) -> None:
        """Liga ou desliga o módulo no objeto. ConfiguracaoService.modulo_ativo lê este campo."""
        self.usa = usa


class ConfiguracaoService:
    """Singleton da configuração em memória. Um estabelecimento por processo."""

    _instancia = None

    def __init__(self):
        # Bloqueia ConfiguracaoService(). O caminho certo é get_instancia().
        raise RuntimeError("Use ConfiguracaoService.get_instancia()")

    @classmethod
    def get_instancia(cls):
        """Devolve o único serviço. Na primeira chamada começa sem estabelecimento."""
        if cls._instancia is None:
            obj = object.__new__(cls)
            obj.estabelecimento = None
            obj.configuracao = None
            obj.modulos = []
            cls._instancia = obj
        return cls._instancia

    def definir(self, estabelecimento: Estabelecimento, configuracao: Configuracao, modulos: list) -> None:
        """Guarda estabelecimento, configuração e a lista de ModuloAcesso. Quem consulta depois é modulo_ativo."""
        self.estabelecimento = estabelecimento
        self.configuracao = configuracao
        self.modulos = list(modulos)

    def modulo_ativo(self, nome: str) -> bool:
        """True se algum módulo com esse nome está com usa=True. É o ponto de variabilidade no backend."""
        return any(item.modulo == nome and item.usa for item in self.modulos)
