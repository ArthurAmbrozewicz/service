from abc import ABC, abstractmethod


class EstrategiaPreco(ABC):
    """Strategy. PrecoService chama calcular() e troca a estratégia com definir_estrategia()."""

    nome = ""

    @abstractmethod
    def calcular(self, valor: float) -> float:
        """Recebe o preço de tabela e devolve o valor cobrado."""


class PrecoCheio(EstrategiaPreco):
    """Estratégia sem desconto."""

    nome = "cheio"

    def calcular(self, valor: float) -> float:
        """Devolve o mesmo valor, arredondado."""
        return round(valor, 2)


class PrecoDesconto(EstrategiaPreco):
    """Estratégia com percentual de desconto. O padrão é 10."""

    nome = "desconto"

    def __init__(self, percentual: float = 10):
        self.percentual = percentual

    def calcular(self, valor: float) -> float:
        """Tira o percentual e devolve o valor. PrecoService.aplicar repassa este número."""
        return round(valor * (1 - self.percentual / 100), 2)


class PrecoService:
    """Contexto do Strategy de preço."""

    def __init__(self, estrategia: EstrategiaPreco):
        self.estrategia = estrategia

    def definir_estrategia(self, estrategia: EstrategiaPreco) -> None:
        """Troca a forma de calcular sem mudar quem chama aplicar."""
        self.estrategia = estrategia

    def aplicar(self, valor: float) -> float:
        """Encaminha o preço para estrategia.calcular."""
        return self.estrategia.calcular(valor)
