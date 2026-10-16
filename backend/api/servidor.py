import hashlib
import json
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from backend.api import documentacao, padroes
from backend.banco import repositorio
from backend.conexao_banco import ConexaoBanco
from backend.pessoas import Funcionario
from backend.servicos import AutenticacaoService


class Api(BaseHTTPRequestHandler):
    """Recebe o CRUD do frontend (src/api/banco.ts) e encaminha ao repositório."""

    def do_OPTIONS(self):
        """Responde o preflight do navegador. Segue para _responder, sem ir ao banco."""
        self._responder(204, b"")

    def do_GET(self):
        """Lista ou busca um registro. Segue para _rota e depois repositorio.listar ou repositorio.buscar. /docs e /openapi.json seguem para documentacao."""
        caminho = self.path.split("?")[0].rstrip("/")
        if caminho == "/docs":
            self._responder(200, documentacao.PAGINA.encode("utf-8"), "text/html; charset=utf-8")
            return
        if caminho == "/openapi.json":
            corpo = json.dumps(documentacao.especificacao(), ensure_ascii=False).encode("utf-8")
            self._responder(200, corpo, "application/json; charset=utf-8")
            return
        tabela, registro_id = self._rota()
        if tabela is None:
            self._json(404, {"erro": "Rota não encontrada"})
            return
        if registro_id is None:
            self._json(200, repositorio.listar(tabela))
            return
        registro = repositorio.buscar(tabela, registro_id)
        if registro is None:
            self._json(404, {"erro": "Registro não encontrado"})
            return
        self._json(200, registro)

    def do_POST(self):
        """Cria um registro ou autentica. /api/login segue para _entrar, /api/padroes/<nome> para _padrao. O resto segue para _gravar."""
        caminho = self._caminho()
        if caminho == "/api/login":
            self._entrar()
            return
        if caminho.startswith("/api/padroes/"):
            self._padrao(caminho.removeprefix("/api/padroes/"))
            return
        tabela, registro_id = self._rota()
        if tabela is None or registro_id is not None:
            self._json(404, {"erro": "Rota não encontrada"})
            return
        self._gravar(tabela, None)

    def _entrar(self):
        """Uso de do_POST em /api/login. Gera o hash da senha e chama AutenticacaoService.entrar."""
        dados = self._corpo()
        email = str(dados.get("email", "")).strip()
        senha = str(dados.get("senha", ""))
        if not email or not senha:
            self._json(400, {"erro": "Preencha e-mail e senha."})
            return
        senha_hash = hashlib.sha256(senha.encode()).hexdigest()
        usuario = AutenticacaoService().entrar(email, senha_hash)
        if usuario is None:
            self._json(401, {"erro": "E-mail ou senha inválidos."})
            return
        papel = "funcionario" if isinstance(usuario, Funcionario) else "cliente"
        self._json(200, {"id": usuario.id, "nome": usuario.nome, "email": usuario.email, "papel": papel})

    def _padrao(self, nome: str):
        """Uso de do_POST em /api/padroes/<nome>. Executa a classe filha escolhida nas telas de demonstração, em backend/api/padroes.py."""
        if nome not in padroes.ROTAS:
            self._json(404, {"erro": "Padrão não encontrado"})
            return
        try:
            self._json(200, padroes.executar(nome, self._corpo()))
        except (KeyError, TypeError):
            self._json(400, {"erro": "Preencha todos os campos."})
        except ValueError as falha:
            self._json(400, {"erro": str(falha)})
        except sqlite3.IntegrityError:
            self._json(400, {"erro": "O cliente ou o agendamento não existe no banco."})

    def do_PUT(self):
        """Atualiza um registro. Segue para _gravar, que chama repositorio.atualizar."""
        tabela, registro_id = self._rota()
        if tabela is None or registro_id is None:
            self._json(404, {"erro": "Rota não encontrada"})
            return
        self._gravar(tabela, registro_id)

    def do_DELETE(self):
        """Apaga um registro. Segue para repositorio.excluir."""
        tabela, registro_id = self._rota()
        if tabela is None or registro_id is None:
            self._json(404, {"erro": "Rota não encontrada"})
            return
        try:
            if not repositorio.excluir(tabela, registro_id):
                self._json(404, {"erro": "Registro não encontrado"})
                return
        except sqlite3.IntegrityError:
            self._json(400, {"erro": "Este registro está ligado a outro cadastro."})
            return
        self._json(200, {"ok": True})

    def _gravar(self, tabela: str, registro_id: int | None):
        """Uso de do_POST e do_PUT. Lê _corpo e chama inserir ou atualizar."""
        try:
            dados = self._preparar_senha(tabela, self._corpo(), registro_id)
            if registro_id is None:
                registro = repositorio.inserir(tabela, dados)
                self._json(201, registro)
                return
            registro = repositorio.atualizar(tabela, registro_id, dados)
        except KeyError:
            self._json(400, {"erro": "Preencha todos os campos."})
            return
        except sqlite3.IntegrityError:
            self._json(400, {"erro": "Não foi possível gravar. Verifique os dados e os vínculos."})
            return
        if registro is None:
            self._json(404, {"erro": "Registro não encontrado"})
            return
        self._json(200, registro)

    def _caminho(self) -> str:
        """Caminho do pedido sem a query e sem a barra final."""
        return self.path.split("?")[0].rstrip("/")

    def _rota(self) -> tuple[str | None, int | None]:
        """Uso dos verbos HTTP. /api/<tabela> ou /api/<tabela>/<id>. None se a tabela não está em COLUNAS."""
        partes = [parte for parte in self.path.split("?")[0].split("/") if parte]
        if len(partes) < 2 or partes[0] != "api" or partes[1] not in repositorio.COLUNAS:
            return None, None
        if len(partes) == 2:
            return partes[1], None
        if len(partes) == 3 and partes[2].isdigit():
            return partes[1], int(partes[2])
        return None, None

    def _corpo(self) -> dict:
        """Uso de _gravar. Converte o JSON do pedido em dicionário."""
        tamanho = int(self.headers.get("Content-Length", "0"))
        if tamanho == 0:
            return {}
        return json.loads(self.rfile.read(tamanho).decode("utf-8"))

    def _preparar_senha(self, tabela: str, dados: dict, registro_id: int | None) -> dict:
        """Troca a senha digitada pelo hash. Sem senha na edição, mantém o hash que já está no banco."""
        if tabela not in ("clientes", "funcionarios"):
            return dados
        senha = str(dados.pop("senha", "")).strip()
        dados.pop("senha_hash", None)
        if senha:
            dados["senha_hash"] = hashlib.sha256(senha.encode()).hexdigest()
        elif registro_id is not None:
            atual = repositorio.buscar(tabela, registro_id)
            if atual is not None:
                dados["senha_hash"] = atual["senha_hash"]
        return dados

    def _sem_senha(self, dados):
        """Tira senha_hash da resposta. O hash fica só na tabela do banco."""
        if isinstance(dados, list):
            return [self._sem_senha(item) for item in dados]
        if isinstance(dados, dict) and "senha_hash" in dados:
            copia = dict(dados)
            del copia["senha_hash"]
            return copia
        return dados

    def _json(self, status: int, dados) -> None:
        """Uso dos verbos HTTP. Serializa o dicionário e segue para _responder."""
        corpo = json.dumps(self._sem_senha(dados), ensure_ascii=False).encode("utf-8")
        self._responder(status, corpo, "application/json; charset=utf-8")

    def _responder(self, status: int, corpo: bytes, tipo: str = "text/plain") -> None:
        """Fecha a resposta HTTP, inclusive o CORS que o frontend precisa."""
        self.send_response(status)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(corpo)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        if corpo:
            self.wfile.write(corpo)

    def log_message(self, formato, *args):
        """O servidor HTTP chama isto a cada pedido. Fica vazio para não poluir o terminal."""
        return


def main() -> None:
    """Sobe a API em 127.0.0.1:8000. Primeiro abre o Singleton, que cria as tabelas."""
    ConexaoBanco.get_instancia()
    servidor = ThreadingHTTPServer(("127.0.0.1", 8000), Api)
    print("API em http://127.0.0.1:8000 (Swagger em http://127.0.0.1:8000/docs)", flush=True)
    servidor.serve_forever()


if __name__ == "__main__":
    main()
