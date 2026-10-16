class ConexaoBanco:
    """Singleton da conexão SQLite. Serviços e o repositório passam por aqui."""

    _instancia = None

    def __init__(self):
        # Bloqueia ConexaoBanco(). O caminho certo é get_instancia().
        raise RuntimeError("Use ConexaoBanco.get_instancia()")

    @classmethod
    def get_instancia(cls):
        """Devolve a única conexão. Na primeira chamada abre backend/banco/service.db e roda schema.sql."""
        if cls._instancia is None:
            import sqlite3
            import threading
            from pathlib import Path

            obj = object.__new__(cls)
            obj._trava = threading.Lock()
            pasta = Path(__file__).resolve().parent / "banco"
            pasta.mkdir(parents=True, exist_ok=True)
            obj._db = sqlite3.connect(pasta / "service.db", check_same_thread=False)
            obj._db.row_factory = sqlite3.Row
            obj._db.execute("PRAGMA foreign_keys = ON")
            obj._db.executescript((pasta / "schema.sql").read_text(encoding="utf-8"))
            obj._db.commit()
            cls._instancia = obj
            from backend.banco.semear import semear

            semear()
        return cls._instancia

    def consultar(self, sql: str, params: tuple = ()) -> list:
        """Executa SELECT e devolve lista de dicionários. Chamado por listar, buscar e AutenticacaoService.entrar."""
        with self._trava:
            return [dict(linha) for linha in self._db.execute(sql, params).fetchall()]

    def executar(self, sql: str, params: tuple = ()) -> int:
        """Executa INSERT, UPDATE ou DELETE, grava o commit e devolve o id novo. Chamado por salvar e pelo repositório."""
        with self._trava:
            cursor = self._db.execute(sql, params)
            self._db.commit()
            return cursor.lastrowid

    def salvar(self, tabela: str, registro) -> int:
        """Converte o objeto em INSERT, com as colunas extras que o objeto tiver. Chamado por AgendamentoService, Pagamento.executar e NotificacaoService. Segue para executar e escreve registro.id."""
        from dataclasses import asdict

        from backend.banco.repositorio import COLUNAS, EXTRAS

        dados = asdict(registro)
        colunas = COLUNAS[tabela] + [coluna for coluna in EXTRAS.get(tabela, []) if coluna in dados]
        novo_id = self.executar(
            f"INSERT INTO {tabela} ({', '.join(colunas)}) VALUES ({', '.join('?' for _ in colunas)})",
            tuple(dados[coluna] for coluna in colunas),
        )
        registro.id = novo_id
        return novo_id

    def listar(self, tabela: str) -> list:
        """SELECT de toda a tabela. Chamado por Relatorio.corpo e AlocacaoService.alocar. Segue para consultar."""
        return self.consultar(f"SELECT * FROM {tabela} ORDER BY id")
