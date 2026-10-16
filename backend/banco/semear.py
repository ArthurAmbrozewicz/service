"""Copia a demonstração das telas para o SQLite uma vez. Novos cadastros entram pelas telas."""

from datetime import date, timedelta

from backend.conexao_banco import ConexaoBanco

SENHA = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"

CLIENTES = [
    ("c1", "Mariana Oliveira", "(11) 98765-4321", "mariana.oliveira@email.com", "ativo", "2026-09-01", "Prefere horários pela manhã.", "Corte médio, sem gel", "Pele sensível. Sem alergias conhecidas.", "Limpeza de pele, peeling", "Cliente frequente desde 2024.", "Plano Mensal", "2026-01-10", "2026-10-10", 12, "ativa"),
    ("c2", "Carlos Henrique", "(11) 97654-3210", "carlos.henrique@email.com", "ativo", "2026-08-28", "", "Barba alinhada, fade baixo", "Histórico de acne. Evitar ácidos fortes.", "Microagulhamento", "", "Plano Trimestral", "2026-06-01", "2026-09-01", 8, "vencida"),
    ("c3", "Juliana Martins", "(11) 96543-2109", "juliana.martins@email.com", "ativo", "2026-09-02", "", "", "Gestante — procedimentos restritos.", "Hidratação facial", "", "Plano Anual", "2026-03-15", "2027-03-15", 16, "ativa"),
    ("c4", "Rafael Souza", "(11) 95432-1098", "rafael.souza@email.com", "ativo", "2026-08-20", "", "Corte social, barba completa", "Sem restrições.", "Depilação a laser", "", "Plano Mensal", "2026-08-01", "2026-09-01", 4, "ativa"),
    ("c5", "Fernanda Costa", "(11) 94321-0987", "fernanda.costa@email.com", "ativo", "2026-09-03", "", "", "Alergia a níquel.", "Design de sobrancelhas, limpeza", "", "Plano Semestral", "2026-04-01", "2026-10-01", 20, "ativa"),
    ("c6", "Pedro Almeida", "(11) 93210-9876", "pedro.almeida@email.com", "inativo", "2026-06-15", "Mudou de cidade.", "", "Não informado.", "—", "", "Plano Mensal", "2025-12-01", "2026-06-01", 2, "cancelada"),
    ("c7", "Beatriz Lima", "(11) 92109-8765", "beatriz.lima@email.com", "ativo", "2026-08-30", "", "Corte longo, franja", "Pele oleosa. Usa retinoides.", "Peeling químico", "", "Plano Trimestral", "2026-07-01", "2026-10-01", 10, "ativa"),
    ("c8", "Lucas Ferreira", "(11) 91098-7654", "lucas.ferreira@email.com", "ativo", "2026-09-01", "", "", "Sem restrições.", "Massagem facial", "", "Plano Anual", "2026-01-01", "2027-01-01", 24, "ativa"),
]

FUNCIONARIOS = {
    "petshop": [
        ("p1", "Ana Beatriz Santos", "profissional", "Tosadora", "Seg–Sex 09h–18h", "ativo", "ana@petcare.com", "(11) 90001-0001"),
        ("p2", "Diego Ramos", "profissional", "Banho e Higiene", "Seg–Sáb 08h–17h", "ativo", "diego@petcare.com", "(11) 90001-0002"),
        ("p3", "Dra. Camila Rocha", "profissional", "Veterinária", "Ter–Qui 10h–16h", "ativo", "camila@petcare.com", "(11) 90001-0003"),
        ("p4", "Sofia Mendes", "administrador", "Gestão", "Seg–Sex 08h–18h", "ativo", "sofia@petcare.com", "(11) 90001-0004"),
        ("p5", "Tiago Nunes", "funcionario", "Recepção", "Seg–Sáb 08h–18h", "ativo", "tiago@petcare.com", "(11) 90001-0005"),
    ],
    "barbearia": [
        ("p1", "Marcos Vieira", "profissional", "Corte e Barba", "Ter–Sáb 10h–20h", "ativo", "marcos@barberprime.com", "(11) 90002-0001"),
        ("p2", "André Silva", "profissional", "Fade e Design", "Seg–Sex 09h–19h", "ativo", "andre@barberprime.com", "(11) 90002-0002"),
        ("p3", "Bruno Costa", "profissional", "Sobrancelha", "Qua–Sáb 11h–19h", "ativo", "bruno@barberprime.com", "(11) 90002-0003"),
        ("p4", "Patricia Alves", "administrador", "Gestão", "Seg–Sex 09h–18h", "ativo", "patricia@barberprime.com", "(11) 90002-0004"),
        ("p5", "João Pedro", "funcionario", "Recepção", "Ter–Sáb 10h–20h", "ferias", "joao@barberprime.com", "(11) 90002-0005"),
    ],
    "academia": [
        ("p1", "Renata Campos", "profissional", "Personal Trainer", "Seg–Sex 06h–14h", "ativo", "renata@fitlife.com", "(11) 90003-0001"),
        ("p2", "Gustavo Pires", "profissional", "Musculação", "Seg–Sáb 14h–22h", "ativo", "gustavo@fitlife.com", "(11) 90003-0002"),
        ("p3", "Larissa Duarte", "profissional", "Aulas Coletivas", "Seg–Sex 07h–12h", "ativo", "larissa@fitlife.com", "(11) 90003-0003"),
        ("p4", "Eduardo Lima", "administrador", "Gestão", "Seg–Sex 08h–18h", "ativo", "eduardo@fitlife.com", "(11) 90003-0004"),
        ("p5", "Amanda Reis", "funcionario", "Recepção", "Seg–Sáb 06h–14h", "ativo", "amanda@fitlife.com", "(11) 90003-0005"),
    ],
    "estetica": [
        ("p1", "Dra. Helena Borges", "profissional", "Dermatologia Estética", "Seg–Qui 09h–17h", "ativo", "helena@belle.com", "(11) 90004-0001"),
        ("p2", "Isabela Freitas", "profissional", "Esteticista", "Ter–Sáb 10h–19h", "ativo", "isabela@belle.com", "(11) 90004-0002"),
        ("p3", "Vanessa Melo", "profissional", "Design e Depilação", "Seg–Sex 09h–18h", "ativo", "vanessa@belle.com", "(11) 90004-0003"),
        ("p4", "Claudia Nogueira", "administrador", "Gestão", "Seg–Sex 08h–17h", "ativo", "claudia@belle.com", "(11) 90004-0004"),
        ("p5", "Priscila Souza", "funcionario", "Recepção", "Seg–Sáb 09h–18h", "ativo", "priscila@belle.com", "(11) 90004-0005"),
    ],
}

SERVICOS = {
    "petshop": [("s1", "Banho Completo", "Higiene", 60, 80, ["p1", "p2"]), ("s2", "Tosa Higiênica", "Estética", 45, 70, ["p1"]), ("s3", "Tosa Completa", "Estética", 90, 120, ["p1"]), ("s4", "Higienização Dental", "Saúde", 30, 60, ["p3"]), ("s5", "Consulta Veterinária", "Saúde", 40, 150, ["p3"])],
    "barbearia": [("s1", "Corte Masculino", "Cabelo", 30, 45, ["p1", "p2"]), ("s2", "Barba", "Barba", 20, 35, ["p1", "p2"]), ("s3", "Corte + Barba", "Combo", 50, 70, ["p1", "p2"]), ("s4", "Sobrancelha", "Estética", 15, 20, ["p3"]), ("s5", "Pigmentação", "Especial", 60, 120, ["p1"])],
    "academia": [("s1", "Avaliação Física", "Avaliação", 45, 100, ["p1"]), ("s2", "Personal Training", "Treino", 60, 150, ["p1", "p2"]), ("s3", "Aula de Spinning", "Coletiva", 45, 40, ["p3"]), ("s4", "Musculação Orientada", "Treino", 60, 0, ["p2"]), ("s5", "Yoga", "Coletiva", 60, 50, ["p3"])],
    "estetica": [("s1", "Limpeza de Pele", "Facial", 60, 180, ["p1", "p2"]), ("s2", "Peeling Químico", "Facial", 45, 250, ["p1"]), ("s3", "Microagulhamento", "Facial", 90, 350, ["p1"]), ("s4", "Depilação a Laser", "Corporal", 40, 200, ["p2"]), ("s5", "Design de Sobrancelhas", "Estética", 30, 80, ["p3"])],
}

AGENDA = {
    "petshop": [("a1", "c1", "s1", "p2", 0, "09:00", "confirmado", "Luna"), ("a2", "c2", "s3", "p1", 0, "10:30", "agendado", "Thor"), ("a3", "c5", "s2", "p1", 0, "14:00", "em_andamento", "Nina"), ("a4", "c3", "s5", "p3", 1, "11:00", "agendado", "Mimi"), ("a5", "c8", "s1", "p2", -1, "15:00", "concluido", "Max"), ("a6", "c7", "s4", "p3", 2, "10:00", "agendado", "Pipoca")],
    "barbearia": [("a1", "c2", "s3", "p1", 0, "10:00", "confirmado", ""), ("a2", "c4", "s1", "p2", 0, "11:00", "agendado", ""), ("a3", "c8", "s2", "p1", 0, "15:30", "agendado", ""), ("a4", "c1", "s4", "p3", 1, "14:00", "agendado", ""), ("a5", "c2", "s1", "p2", -1, "16:00", "concluido", ""), ("a6", "c4", "s5", "p1", 3, "11:00", "agendado", "")],
    "academia": [("a1", "c1", "s2", "p1", 0, "07:00", "confirmado", ""), ("a2", "c5", "s3", "p3", 0, "08:00", "em_andamento", ""), ("a3", "c8", "s1", "p1", 0, "10:00", "agendado", ""), ("a4", "c3", "s5", "p3", 1, "07:30", "agendado", ""), ("a5", "c7", "s2", "p2", -1, "18:00", "concluido", ""), ("a6", "c4", "s4", "p2", 2, "19:00", "agendado", "")],
    "estetica": [("a1", "c1", "s1", "p2", 0, "09:30", "confirmado", ""), ("a2", "c5", "s5", "p3", 0, "11:00", "agendado", ""), ("a3", "c7", "s2", "p1", 0, "14:00", "agendado", ""), ("a4", "c3", "s1", "p2", 1, "10:00", "agendado", ""), ("a5", "c4", "s4", "p2", -1, "15:00", "concluido", ""), ("a6", "c1", "s3", "p1", 3, "09:00", "agendado", "")],
}

PAGAMENTOS = {
    "petshop": [("pay1", "c1", "Banho Completo — Luna", 80, "pix", "pago", 0, "", 0, ""), ("pay2", "c2", "Tosa Completa — Thor", 120, "cartao", "pendente", 0, "", 2, ""), ("pay3", "c5", "Pacote 5 banhos", 350, "pix", "pago", -3, "", 0, ""), ("pay4", "c8", "Banho Completo — Max", 80, "dinheiro", "pago", -1, "", 0, ""), ("pay5", "c7", "Higienização Dental — Pipoca", 60, "pix", "atrasado", -5, "", -2, "")],
    "barbearia": [("pay1", "c2", "Corte + Barba", 70, "pix", "pago", 0, "", 0, ""), ("pay2", "c4", "Corte Masculino", 45, "dinheiro", "pago", 0, "", 0, ""), ("pay3", "c8", "Barba", 35, "cartao", "pendente", 0, "", 0, ""), ("pay4", "c1", "Pacote mensal (4 cortes)", 160, "pix", "pago", -7, "", 0, ""), ("pay5", "c4", "Pigmentação", 120, "cartao", "pendente", 3, "", 3, "")],
    "academia": [("pay1", "c1", "Mensalidade — Plano Mensal", 149.9, "recorrente", "pago", 0, "Plano Mensal", 30, 1), ("pay2", "c3", "Mensalidade — Plano Anual", 99.9, "recorrente", "pago", 0, "Plano Anual", 30, 1), ("pay3", "c2", "Mensalidade — Plano Trimestral", 129.9, "recorrente", "atrasado", -5, "Plano Trimestral", -1, 1), ("pay4", "c8", "Avaliação Física", 100, "pix", "pago", -2, "", 0, 0), ("pay5", "c5", "Mensalidade — Plano Semestral", 119.9, "recorrente", "pendente", 0, "Plano Semestral", 5, 1)],
    "estetica": [("pay1", "c1", "Limpeza de Pele", 180, "pix", "pago", 0, "", 0, ""), ("pay2", "c7", "Peeling Químico", 250, "cartao", "pendente", 0, "", 0, ""), ("pay3", "c5", "Pacote facial (3 sessões)", 480, "pix", "pago", -10, "", 0, ""), ("pay4", "c4", "Depilação a Laser", 200, "cartao", "pago", -1, "", 0, ""), ("pay5", "c3", "Limpeza de Pele", 180, "boleto", "atrasado", -4, "", -1, "")],
}


def _dia(deslocamento: int) -> str:
    return (date.today() + timedelta(days=deslocamento)).isoformat()


COLUNAS_NOVAS = {
    "clientes": [
        ("codigo", "TEXT NOT NULL DEFAULT ''"),
        ("ultima_visita", "TEXT NOT NULL DEFAULT ''"),
        ("observacoes", "TEXT NOT NULL DEFAULT ''"),
        ("preferencias", "TEXT NOT NULL DEFAULT ''"),
        ("anamnese", "TEXT NOT NULL DEFAULT ''"),
        ("procedimentos", "TEXT NOT NULL DEFAULT ''"),
        ("notas_segmento", "TEXT NOT NULL DEFAULT ''"),
        ("plano", "TEXT NOT NULL DEFAULT ''"),
        ("plano_inicio", "TEXT NOT NULL DEFAULT ''"),
        ("plano_fim", "TEXT NOT NULL DEFAULT ''"),
        ("frequencia", "INTEGER NOT NULL DEFAULT 0"),
        ("matricula", "TEXT NOT NULL DEFAULT ''"),
    ],
    "funcionarios": [
        ("codigo", "TEXT NOT NULL DEFAULT ''"),
        ("segmento", "TEXT NOT NULL DEFAULT ''"),
        ("cargo", "TEXT NOT NULL DEFAULT 'profissional'"),
        ("disponibilidade", "TEXT NOT NULL DEFAULT ''"),
    ],
    "servicos": [
        ("codigo", "TEXT NOT NULL DEFAULT ''"),
        ("segmento", "TEXT NOT NULL DEFAULT ''"),
    ],
    "agendamentos": [
        ("codigo", "TEXT NOT NULL DEFAULT ''"),
        ("segmento", "TEXT NOT NULL DEFAULT ''"),
        ("pet_nome", "TEXT NOT NULL DEFAULT ''"),
    ],
    "pagamentos": [
        ("codigo", "TEXT NOT NULL DEFAULT ''"),
        ("segmento", "TEXT NOT NULL DEFAULT ''"),
        ("descricao", "TEXT NOT NULL DEFAULT ''"),
        ("recorrente", "INTEGER NOT NULL DEFAULT 0"),
        ("vencimento", "TEXT NOT NULL DEFAULT ''"),
        ("plano", "TEXT NOT NULL DEFAULT ''"),
    ],
    "notificacoes": [
        ("codigo", "TEXT NOT NULL DEFAULT ''"),
        ("segmento", "TEXT NOT NULL DEFAULT ''"),
        ("canal", "TEXT NOT NULL DEFAULT ''"),
        ("destino", "TEXT NOT NULL DEFAULT ''"),
    ],
    "configuracoes": [
        ("conteudo", "TEXT NOT NULL DEFAULT ''"),
    ],
}


def migrar() -> None:
    """Acrescenta colunas em bancos que já existiam antes desta versão."""
    banco = ConexaoBanco.get_instancia()
    for tabela, colunas in COLUNAS_NOVAS.items():
        atuais = {linha["name"] for linha in banco.consultar(f"PRAGMA table_info({tabela})")}
        for nome, tipo in colunas:
            if nome not in atuais:
                banco.executar(f"ALTER TABLE {tabela} ADD COLUMN {nome} {tipo}")


def semear() -> None:
    """Roda depois do schema. Não repete se a chave demonstracao já existe."""
    migrar()
    banco = ConexaoBanco.get_instancia()
    if banco.consultar("SELECT 1 FROM controle WHERE chave = 'demonstracao'"):
        return
    banco.executar("UPDATE funcionarios SET segmento = 'petshop', cargo = 'profissional' WHERE id = 1 AND codigo = ''")
    banco.executar("UPDATE servicos SET segmento = 'petshop' WHERE id = 1 AND codigo = ''")
    banco.executar("UPDATE agendamentos SET segmento = 'petshop' WHERE id = 1 AND segmento = ''")
    banco.executar("UPDATE pagamentos SET segmento = 'petshop', descricao = 'Banho' WHERE id = 1 AND segmento = ''")

    clientes = {}
    for indice, item in enumerate(CLIENTES, start=1):
        codigo, nome, telefone, email, status, visita, notas, prefs, anamnese, procedimentos, notas_seg, plano, inicio, fim, frequencia, matricula = item
        novo = banco.executar(
            """INSERT INTO clientes
            (nome, email, senha_hash, telefone, cpf, status, codigo, ultima_visita, observacoes, preferencias, anamnese, procedimentos, notas_segmento, plano, plano_inicio, plano_fim, frequencia, matricula)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (nome, email, SENHA, telefone, f"9000000000{indice}", status, codigo, visita, notas, prefs, anamnese, procedimentos, notas_seg, plano, inicio, fim, frequencia, matricula),
        )
        clientes[codigo] = novo

    funcionarios = {}
    for segmento, lista in FUNCIONARIOS.items():
        for codigo, nome, cargo, especialidade, disponibilidade, status, email, telefone in lista:
            novo = banco.executar(
                """INSERT INTO funcionarios
                (estabelecimento_id, nome, email, senha_hash, telefone, especialidade, status, codigo, segmento, cargo, disponibilidade)
                VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (nome, email, SENHA, telefone, especialidade, status, f"{segmento}:{codigo}", segmento, cargo, disponibilidade),
            )
            funcionarios[(segmento, codigo)] = novo

    servicos = {}
    for segmento, lista in SERVICOS.items():
        for codigo, nome, categoria, duracao, preco, profissionais in lista:
            novo = banco.executar(
                """INSERT INTO servicos
                (estabelecimento_id, nome, categoria, duracao_min, preco, status, codigo, segmento)
                VALUES (1, ?, ?, ?, ?, 'ativo', ?, ?)""",
                (nome, categoria, duracao, preco, f"{segmento}:{codigo}", segmento),
            )
            servicos[(segmento, codigo)] = novo
            for profissional in profissionais:
                banco.executar(
                    "INSERT INTO servico_funcionarios (servico_id, funcionario_id) VALUES (?, ?)",
                    (novo, funcionarios[(segmento, profissional)]),
                )

    agenda = {}
    for segmento, lista in AGENDA.items():
        for codigo, cliente, servico, profissional, dia, hora, status, pet in lista:
            novo = banco.executar(
                """INSERT INTO agendamentos
                (cliente_id, funcionario_id, data, hora, status, observacoes, codigo, segmento, pet_nome)
                VALUES (?, ?, ?, ?, ?, '', ?, ?, ?)""",
                (clientes[cliente], funcionarios[(segmento, profissional)], _dia(dia), hora, status, f"{segmento}:{codigo}", segmento, pet),
            )
            agenda[(segmento, cliente)] = novo
            banco.executar(
                "INSERT INTO agendamento_servicos (agendamento_id, servico_id, valor) VALUES (?, ?, ?)",
                (novo, servicos[(segmento, servico)], 0),
            )

    for segmento, lista in PAGAMENTOS.items():
        for codigo, cliente, descricao, valor, metodo, status, dia, plano, vencimento, recorrente in lista:
            agendamento_id = agenda.get((segmento, cliente), 1)
            banco.executar(
                """INSERT INTO pagamentos
                (cliente_id, agendamento_id, valor, metodo, status, data, codigo, segmento, descricao, recorrente, vencimento, plano)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (clientes[cliente], agendamento_id, valor, metodo, status, _dia(dia), f"{segmento}:{codigo}", segmento, descricao, recorrente, _dia(vencimento) if vencimento else "", plano),
            )

    avisos = [
        ("n1", "confirmacao", "Agendamento confirmado", "Seu horário de hoje às 09:00 foi confirmado.", 0, 0, ""),
        ("n2", "lembrete", "Lembrete de atendimento", "Você tem um compromisso amanhã às 11:00.", 0, 0, ""),
        ("n3", "pagamento", "Pagamento pendente", "Há um pagamento aguardando confirmação.", -1, 1, ""),
        ("n4", "alteracao", "Horário alterado", "O atendimento foi remarcado para 14:00.", -2, 1, ""),
        ("n5", "cancelamento", "Agendamento cancelado", "O cliente cancelou o horário de ontem.", -3, 1, ""),
        ("n6", "lembrete", "Vacina próxima", "Luna — próxima dose de V10 em 7 dias.", 0, 0, "petshop"),
        ("n7", "pagamento", "Mensalidade vencendo", "Plano Trimestral de Carlos Henrique vence em breve.", 0, 0, "academia"),
        ("n8", "lembrete", "Retorno sugerido", "Mariana Oliveira — retorno de limpeza em 30 dias.", 0, 0, "estetica"),
    ]
    for codigo, tipo, titulo, mensagem, dia, lida, segmento in avisos:
        banco.executar(
            """INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, data, lida, codigo, segmento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (clientes["c1"], tipo, titulo, mensagem, _dia(dia), lida, codigo, segmento),
        )

    pets_demo = [
        ("c1", "Luna", "Cão", "Golden Retriever", "2021-03-15", "femea", 28, "Amigável, sem restrições alimentares.", "em_dia"),
        ("c2", "Thor", "Cão", "Bulldog Francês", "2022-07-20", "macho", 12, "Pele sensível. Evitar shampoos fortes.", "atrasada"),
        ("c3", "Mimi", "Gato", "Siamês", "2020-11-08", "femea", 4.2, "Não gosta de secador.", "em_dia"),
        ("c4", "Bidu", "Cão", "SRD", "2019-05-12", "macho", 8, "Ansioso em ambientes novos.", "em_dia"),
        ("c5", "Nina", "Cão", "Poodle", "2023-01-30", "femea", 6.5, "Prefere tosa tesoura.", "em_dia"),
        ("c7", "Pipoca", "Gato", "Persa", "2021-12-01", "femea", 5, "Escovação frequente necessária.", "atrasada"),
        ("c8", "Max", "Cão", "Border Collie", "2022-04-18", "macho", 18, "Muito energético.", "em_dia"),
    ]
    pets = {}
    for cliente, nome, especie, raca, nascimento, sexo, peso, notas, vacinacao in pets_demo:
        pets[nome] = banco.executar(
            """INSERT INTO pets (cliente_id, nome, especie, raca, nascimento, sexo, peso, observacoes, vacinacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (clientes[cliente], nome, especie, raca, nascimento, sexo, peso, notas, vacinacao),
        )

    vacinas = [
        ("Luna", "V10", "2026-03-10", "2027-03-10", "aplicada"),
        ("Luna", "Antirrábica", "2026-03-10", "2027-03-10", "aplicada"),
        ("Thor", "V10", "2025-06-01", "2026-06-01", "atrasada"),
        ("Thor", "Antirrábica", "2025-06-01", "2026-06-01", "atrasada"),
        ("Mimi", "V4 Felina", "2026-01-20", "2027-01-20", "aplicada"),
        ("Nina", "V10", "2026-05-15", _dia(7), "agendada"),
        ("Pipoca", "V4 Felina", "2025-08-01", "2026-08-01", "atrasada"),
        ("Max", "V10", "2026-04-18", "2027-04-18", "aplicada"),
    ]
    for nome, vacina, data, proxima, status in vacinas:
        banco.executar(
            "INSERT INTO vacinas (pet_id, nome_pet, vacina, data, proxima, status) VALUES (?, ?, ?, ?, ?, ?)",
            (pets[nome], nome, vacina, data, proxima, status),
        )

    planos = [
        ("Plano Mensal", 149.9, 1, 1, 42, "Acesso livre à musculação e aulas coletivas.", "Musculação|Aulas coletivas|Avaliação inicial"),
        ("Plano Trimestral", 129.9, 3, 1, 28, "Economia de 13% em relação ao mensal.", "Musculação|Aulas coletivas|1 personal/mês"),
        ("Plano Semestral", 119.9, 6, 1, 35, "Ideal para quem busca consistência.", "Musculação|Aulas coletivas|2 personals/mês|Nutrição básica"),
        ("Plano Anual", 99.9, 12, 1, 61, "Melhor custo-benefício.", "Tudo incluso|4 personals/mês|Avaliações trimestrais|App de treinos"),
    ]
    for nome, preco, meses, recorrente, alunos, descricao, recursos in planos:
        banco.executar(
            "INSERT INTO planos (nome, preco, meses, recorrente, alunos, descricao, recursos) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (nome, preco, meses, recorrente, alunos, descricao, recursos),
        )

    anamneses = [
        ("c1", "Mariana Oliveira", "2026-08-15", "Pele mista com tendência a oleosidade na zona T.", "Nenhuma conhecida", "Protetor solar diário", "Limpeza de pele, peeling suave", "Boa resposta a ácidos leves."),
        ("c2", "Carlos Henrique", "2026-07-20", "Acne grau II na adolescência. Cicatrizes residuais.", "Ácido salicílico em alta concentração", "Nenhuma", "Microagulhamento", "Evitar exposição solar pós-procedimento."),
        ("c3", "Juliana Martins", "2026-09-01", "Gestante (segundo trimestre).", "Nenhuma", "Vitamina prenatal", "Hidratação facial apenas", "Procedimentos invasivos contraindicados até o parto."),
        ("c5", "Fernanda Costa", "2026-08-28", "Pele sensível, rosácea leve.", "Níquel, fragrâncias fortes", "Creme calmante noturno", "Design de sobrancelhas, limpeza suave", "Usar produtos hipoalergênicos."),
        ("c7", "Beatriz Lima", "2026-08-10", "Pele oleosa. Uso contínuo de retinoides.", "Nenhuma", "Tretinoína 0,025%", "Peeling químico", "Pausar retinoide 5 dias antes do peeling."),
    ]
    for cliente, nome, data, historico, alergias, medicamentos, procedimentos, observacoes in anamneses:
        banco.executar(
            """INSERT INTO anamneses
            (cliente_id, nome_paciente, data, historico, alergias, medicamentos, procedimentos, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (clientes[cliente], nome, data, historico, alergias, medicamentos, procedimentos, observacoes),
        )

    avaliacoes = [
        ("Mariana Oliveira", "Marcos Vieira", "Corte + Barba", 5, "Excelente atendimento, saí muito satisfeito com o resultado.", -2),
        ("Carlos Henrique", "André Silva", "Corte Masculino", 4, "Bom corte, ambiente agradável. Voltarei em breve.", -5),
        ("Rafael Souza", "Marcos Vieira", "Barba", 5, "Barba impecável. Profissional muito atencioso.", -8),
        ("Lucas Ferreira", "Bruno Costa", "Sobrancelha", 4, "Rápido e preciso. Recomendo.", -12),
        ("Fernanda Costa", "Ana Beatriz Santos", "Tosa Completa", 5, "Nina ficou linda! Cuidado excepcional com os pets.", -3),
        ("Beatriz Lima", "Dra. Helena Borges", "Peeling Químico", 5, "Resultado incrível, pele renovada. Super indico.", -6),
    ]
    for cliente, profissional, servico, nota, comentario, dia in avaliacoes:
        banco.executar(
            """INSERT INTO avaliacoes
            (nome_cliente, nome_profissional, nome_servico, nota, comentario, data)
            VALUES (?, ?, ?, ?, ?, ?)""",
            (cliente, profissional, servico, nota, comentario, _dia(dia)),
        )

    banco.executar("INSERT INTO controle (chave, valor) VALUES ('demonstracao', '1')")
