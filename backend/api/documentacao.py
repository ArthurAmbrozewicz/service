"""Swagger da API. Api.do_GET serve PAGINA em /docs e especificacao() em /openapi.json."""

from backend.banco import repositorio
from backend.conexao_banco import ConexaoBanco

# Tipos do SQLite para o OpenAPI. O que não está aqui vira string.
TIPOS = {"INTEGER": "integer", "REAL": "number"}

# Tabelas que recebem senha em texto. Api._preparar_senha troca pelo hash antes de gravar.
COM_SENHA = ("clientes", "funcionarios")

ERRO = {"$ref": "#/components/schemas/Erro"}

# Tema sempre claro: color-scheme barra o modo escuro automático do Chrome e darkreader-lock o da extensão Dark Reader.
PAGINA = """<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="darkreader-lock">
  <title>Service API — Swagger</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css">
  <style>
    html, body { margin: 0; background: #fff; color-scheme: light only; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script>
    window.ui = SwaggerUIBundle({ url: "/openapi.json", dom_id: "#swagger-ui", deepLinking: true });
  </script>
</body>
</html>
"""


def especificacao() -> dict:
    """Uso de Api.do_GET em /openapi.json. Monta o OpenAPI a partir de repositorio.COLUNAS e das colunas do banco."""
    caminhos = {"/api/login": _login()}
    esquemas = {
        "Erro": {
            "type": "object",
            "properties": {"erro": {"type": "string", "example": "Registro não encontrado"}},
        },
        "Login": {
            "type": "object",
            "required": ["email", "senha"],
            "properties": {
                "email": {"type": "string", "example": "ana@email.com"},
                "senha": {"type": "string", "example": "123"},
            },
        },
        "Usuario": {
            "type": "object",
            "properties": {
                "id": {"type": "integer"},
                "nome": {"type": "string"},
                "email": {"type": "string"},
                "papel": {"type": "string", "enum": ["cliente", "funcionario"]},
            },
        },
    }
    for tabela in repositorio.COLUNAS:
        nome = _esquema(tabela)
        colunas = _colunas(tabela)
        esquemas[nome] = _registro(colunas)
        esquemas[f"{nome}Entrada"] = _entrada(tabela, colunas)
        caminhos[f"/api/{tabela}"] = _colecao(tabela, nome)
        caminhos[f"/api/{tabela}/{{id}}"] = _item(tabela, nome)
    return {
        "openapi": "3.0.3",
        "info": {
            "title": "Service API",
            "version": "1.0.0",
            "description": "CRUD do Service sobre o SQLite. Toda tabela segue o mesmo padrão: "
            "`/api/{tabela}` lista e cria, `/api/{tabela}/{id}` busca, atualiza e apaga. "
            "`senha_hash` nunca volta nas respostas.",
        },
        "servers": [{"url": "/"}],
        "tags": [{"name": "autenticacao"}] + [{"name": tabela} for tabela in repositorio.COLUNAS],
        "paths": caminhos,
        "components": {"schemas": esquemas},
    }


def _colunas(tabela: str) -> dict:
    """Uso de especificacao. Lê PRAGMA table_info e devolve {coluna: tipo OpenAPI}, já com as colunas migradas."""
    linhas = ConexaoBanco.get_instancia().consultar(f"PRAGMA table_info({tabela})")
    return {linha["name"]: TIPOS.get(linha["type"].upper(), "string") for linha in linhas}


def _esquema(tabela: str) -> str:
    """Nome do schema: agendamento_servicos vira AgendamentoServicos."""
    return "".join(parte.capitalize() for parte in tabela.split("_"))


def _registro(colunas: dict) -> dict:
    """Linha como a API devolve. Sem senha_hash, que Api._sem_senha tira da resposta."""
    return {
        "type": "object",
        "properties": {nome: {"type": tipo} for nome, tipo in colunas.items() if nome != "senha_hash"},
    }


def _entrada(tabela: str, colunas: dict) -> dict:
    """Corpo de POST e PUT. COLUNAS são obrigatórias, EXTRAS são opcionais. senha_hash vira senha."""
    obrigatorias = [coluna for coluna in repositorio.COLUNAS[tabela] if coluna != "senha_hash"]
    opcionais = repositorio.EXTRAS.get(tabela, [])
    propriedades = {coluna: {"type": colunas.get(coluna, "string")} for coluna in obrigatorias + opcionais}
    if tabela in COM_SENHA:
        propriedades["senha"] = {
            "type": "string",
            "description": "Obrigatória no POST. No PUT, vazia mantém a senha atual.",
        }
    return {"type": "object", "required": obrigatorias, "properties": propriedades}


def _resposta(descricao: str, esquema: dict) -> dict:
    """Resposta JSON com um schema."""
    return {"description": descricao, "content": {"application/json": {"schema": esquema}}}


def _corpo(nome: str) -> dict:
    """Corpo JSON obrigatório apontando para um schema."""
    return {"required": True, "content": {"application/json": {"schema": {"$ref": f"#/components/schemas/{nome}"}}}}


def _colecao(tabela: str, nome: str) -> dict:
    """GET e POST em /api/<tabela>."""
    registro = {"$ref": f"#/components/schemas/{nome}"}
    return {
        "get": {
            "tags": [tabela],
            "summary": f"Lista {tabela}",
            "operationId": f"listar_{tabela}",
            "responses": {"200": _resposta("Todos os registros, ordenados por id", {"type": "array", "items": registro})},
        },
        "post": {
            "tags": [tabela],
            "summary": f"Cria em {tabela}",
            "operationId": f"criar_{tabela}",
            "requestBody": _corpo(f"{nome}Entrada"),
            "responses": {
                "201": _resposta("Registro criado", registro),
                "400": _resposta("Campo obrigatório faltando ou vínculo inválido", ERRO),
            },
        },
    }


def _item(tabela: str, nome: str) -> dict:
    """GET, PUT e DELETE em /api/<tabela>/<id>."""
    registro = {"$ref": f"#/components/schemas/{nome}"}
    nao_achou = _resposta("Registro não encontrado", ERRO)
    return {
        "parameters": [{"name": "id", "in": "path", "required": True, "schema": {"type": "integer"}}],
        "get": {
            "tags": [tabela],
            "summary": f"Busca em {tabela}",
            "operationId": f"buscar_{tabela}",
            "responses": {"200": _resposta("Registro encontrado", registro), "404": nao_achou},
        },
        "put": {
            "tags": [tabela],
            "summary": f"Atualiza em {tabela}",
            "operationId": f"atualizar_{tabela}",
            "requestBody": _corpo(f"{nome}Entrada"),
            "responses": {
                "200": _resposta("Registro atualizado", registro),
                "400": _resposta("Campo obrigatório faltando ou vínculo inválido", ERRO),
                "404": nao_achou,
            },
        },
        "delete": {
            "tags": [tabela],
            "summary": f"Apaga em {tabela}",
            "operationId": f"excluir_{tabela}",
            "responses": {
                "200": _resposta("Registro apagado", {"type": "object", "properties": {"ok": {"type": "boolean"}}}),
                "400": _resposta("Registro ligado a outro cadastro", ERRO),
                "404": nao_achou,
            },
        },
    }


def _login() -> dict:
    """POST /api/login. Mesmo corpo que src/api/banco.ts envia em entrar."""
    return {
        "post": {
            "tags": ["autenticacao"],
            "summary": "Entra com e-mail e senha",
            "operationId": "entrar",
            "requestBody": _corpo("Login"),
            "responses": {
                "200": _resposta("Usuário autenticado", {"$ref": "#/components/schemas/Usuario"}),
                "400": _resposta("E-mail ou senha em branco", ERRO),
                "401": _resposta("E-mail ou senha inválidos", ERRO),
            },
        }
    }
