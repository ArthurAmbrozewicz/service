from backend.conexao_banco import ConexaoBanco

# Colunas que a API aceita gravar. O id nasce no banco. Api._rota só libera tabelas desta lista.
COLUNAS = {
    "estabelecimentos": ["nome", "segmento"],
    "clientes": ["nome", "email", "senha_hash", "telefone", "cpf", "status"],
    "funcionarios": ["estabelecimento_id", "nome", "email", "senha_hash", "telefone", "especialidade", "status"],
    "servicos": ["estabelecimento_id", "nome", "categoria", "duracao_min", "preco", "status"],
    "servico_funcionarios": ["servico_id", "funcionario_id"],
    "horarios": ["funcionario_id", "dia_semana", "hora_inicio", "hora_fim"],
    "agendamentos": ["cliente_id", "funcionario_id", "data", "hora", "status", "observacoes"],
    "agendamento_servicos": ["agendamento_id", "servico_id", "valor"],
    "pagamentos": ["cliente_id", "agendamento_id", "valor", "metodo", "status", "data"],
    "notificacoes": ["usuario_id", "tipo", "titulo", "mensagem", "data", "lida"],
    "modulos": ["estabelecimento_id", "modulo", "usa"],
    "configuracoes": ["estabelecimento_id", "intervalo", "cores", "rotulos"],
    "pets": ["cliente_id", "nome", "especie", "raca", "nascimento", "sexo", "peso", "observacoes", "vacinacao"],
    "vacinas": ["pet_id", "nome_pet", "vacina", "data", "proxima", "status"],
    "planos": ["nome", "preco", "meses", "recorrente", "alunos", "descricao", "recursos"],
    "anamneses": ["cliente_id", "nome_paciente", "data", "historico", "alergias", "medicamentos", "procedimentos", "observacoes"],
    "avaliacoes": ["nome_cliente", "nome_profissional", "nome_servico", "nota", "comentario", "data"],
}

# Colunas com valor padrão. A tela manda quando precisa; o cadastro antigo segue sem elas.
EXTRAS = {
    "clientes": ["ultima_visita", "observacoes", "preferencias", "anamnese", "procedimentos", "notas_segmento", "plano", "plano_inicio", "plano_fim", "frequencia", "matricula"],
    "funcionarios": ["segmento", "cargo", "disponibilidade"],
    "servicos": ["segmento"],
    "agendamentos": ["segmento", "pet_nome"],
    "pagamentos": ["segmento", "descricao", "recorrente", "vencimento", "plano"],
    "notificacoes": ["segmento"],
    "configuracoes": ["conteudo"],
}


def listar(tabela: str) -> list:
    """GET /api/<tabela>. Passa por _exigir e segue para ConexaoBanco.consultar."""
    _exigir(tabela)
    return ConexaoBanco.get_instancia().consultar(f"SELECT * FROM {tabela} ORDER BY id")


def buscar(tabela: str, registro_id: int) -> dict | None:
    """GET /api/<tabela>/<id>. Também é o retorno de inserir e atualizar. None se a linha não existe."""
    _exigir(tabela)
    linhas = ConexaoBanco.get_instancia().consultar(
        f"SELECT * FROM {tabela} WHERE id = ?",
        (registro_id,),
    )
    return linhas[0] if linhas else None


def inserir(tabela: str, dados: dict) -> dict:
    """POST /api/<tabela>. Chamado por Api._gravar. Segue para executar e devolve a linha em buscar."""
    colunas = _presentes(tabela, dados)
    valores = [dados[coluna] for coluna in colunas]
    marcas = ", ".join("?" for _ in colunas)
    nomes = ", ".join(colunas)
    novo_id = ConexaoBanco.get_instancia().executar(
        f"INSERT INTO {tabela} ({nomes}) VALUES ({marcas})",
        valores,
    )
    return buscar(tabela, novo_id)


def atualizar(tabela: str, registro_id: int, dados: dict) -> dict | None:
    """PUT /api/<tabela>/<id>. Chamado por Api._gravar. None se buscar não achar a linha."""
    colunas = _presentes(tabela, dados)
    if buscar(tabela, registro_id) is None:
        return None
    valores = [dados[coluna] for coluna in colunas]
    atribuicoes = ", ".join(f"{coluna} = ?" for coluna in colunas)
    ConexaoBanco.get_instancia().executar(
        f"UPDATE {tabela} SET {atribuicoes} WHERE id = ?",
        [*valores, registro_id],
    )
    return buscar(tabela, registro_id)


def excluir(tabela: str, registro_id: int) -> bool:
    """DELETE /api/<tabela>/<id>. False se a linha não existe. IntegrityError sobe para a Api."""
    _exigir(tabela)
    if buscar(tabela, registro_id) is None:
        return False
    ConexaoBanco.get_instancia().executar(f"DELETE FROM {tabela} WHERE id = ?", (registro_id,))
    return True


def _exigir(tabela: str) -> list:
    """Uso interno de listar, buscar, inserir, atualizar e excluir. KeyError se a tabela não está em COLUNAS."""
    colunas = COLUNAS.get(tabela)
    if colunas is None:
        raise KeyError(tabela)
    return colunas


def _presentes(tabela: str, dados: dict) -> list:
    """Colunas obrigatórias que vieram no JSON, mais as extras enviadas."""
    obrigatorias = _exigir(tabela)
    faltando = [coluna for coluna in obrigatorias if coluna not in dados]
    if faltando:
        raise KeyError(faltando[0])
    extras = [coluna for coluna in EXTRAS.get(tabela, []) if coluna in dados]
    return obrigatorias + extras
