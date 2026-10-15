-- Tabelas do Service. ConexaoBanco.get_instancia executa este arquivo ao abrir service.db.
-- A API só grava tabelas listadas em repositorio.COLUNAS.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS estabelecimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    segmento TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    senha_hash TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estabelecimento_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    senha_hash TEXT NOT NULL,
    telefone TEXT NOT NULL,
    especialidade TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos(id)
);

CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estabelecimento_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    duracao_min INTEGER NOT NULL,
    preco REAL NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos(id)
);

CREATE TABLE IF NOT EXISTS servico_funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    servico_id INTEGER NOT NULL,
    funcionario_id INTEGER NOT NULL,
    FOREIGN KEY (servico_id) REFERENCES servicos(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

CREATE TABLE IF NOT EXISTS horarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    funcionario_id INTEGER NOT NULL,
    dia_semana TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fim TEXT NOT NULL,
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    funcionario_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    hora TEXT NOT NULL,
    status TEXT NOT NULL,
    observacoes TEXT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

CREATE TABLE IF NOT EXISTS agendamento_servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agendamento_id INTEGER NOT NULL,
    servico_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id),
    FOREIGN KEY (servico_id) REFERENCES servicos(id)
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    agendamento_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    metodo TEXT NOT NULL,
    status TEXT NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
);

CREATE TABLE IF NOT EXISTS notificacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    data TEXT NOT NULL,
    lida INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS modulos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estabelecimento_id INTEGER NOT NULL,
    modulo TEXT NOT NULL,
    usa INTEGER NOT NULL,
    FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos(id)
);

CREATE TABLE IF NOT EXISTS configuracoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estabelecimento_id INTEGER NOT NULL UNIQUE,
    intervalo INTEGER NOT NULL,
    cores TEXT NOT NULL,
    rotulos TEXT NOT NULL,
    FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos(id)
);

INSERT INTO estabelecimentos (id, nome, segmento)
SELECT 1, 'PetCare', 'petshop'
WHERE NOT EXISTS (SELECT 1 FROM estabelecimentos WHERE id = 1);

INSERT INTO clientes (id, nome, email, senha_hash, telefone, cpf, status)
SELECT 1, 'Ana Souza', 'ana@email.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '11999990000', '12345678900', 'ativo'
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE id = 1);

INSERT INTO funcionarios (id, estabelecimento_id, nome, email, senha_hash, telefone, especialidade, status)
SELECT 1, 1, 'Leo Martins', 'leo@email.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '11888880000', 'Banho', 'ativo'
WHERE NOT EXISTS (SELECT 1 FROM funcionarios WHERE id = 1);

INSERT INTO servicos (id, estabelecimento_id, nome, categoria, duracao_min, preco, status)
SELECT 1, 1, 'Banho', 'Higiene', 60, 50, 'ativo'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE id = 1);

INSERT INTO horarios (id, funcionario_id, dia_semana, hora_inicio, hora_fim)
SELECT 1, 1, 'segunda', '09:00', '18:00'
WHERE NOT EXISTS (SELECT 1 FROM horarios WHERE id = 1);

INSERT INTO agendamentos (id, cliente_id, funcionario_id, data, hora, status, observacoes)
SELECT 1, 1, 1, '2026-10-20', '10:00', 'agendado', ''
WHERE NOT EXISTS (SELECT 1 FROM agendamentos WHERE id = 1);

INSERT INTO agendamento_servicos (id, agendamento_id, servico_id, valor)
SELECT 1, 1, 1, 50
WHERE NOT EXISTS (SELECT 1 FROM agendamento_servicos WHERE id = 1);

INSERT INTO pagamentos (id, cliente_id, agendamento_id, valor, metodo, status, data)
SELECT 1, 1, 1, 50, 'pix', 'pendente', '2026-10-20 10:00'
WHERE NOT EXISTS (SELECT 1 FROM pagamentos WHERE id = 1);

INSERT INTO notificacoes (id, usuario_id, tipo, titulo, mensagem, data, lida)
SELECT 1, 1, 'confirmacao', 'Compra', 'Horário confirmado', '2026-10-20 10:01', 0
WHERE NOT EXISTS (SELECT 1 FROM notificacoes WHERE id = 1);

INSERT INTO modulos (id, estabelecimento_id, modulo, usa)
SELECT 1, 1, 'agendamentos', 1
WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE id = 1);

INSERT INTO servico_funcionarios (id, servico_id, funcionario_id)
SELECT 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM servico_funcionarios WHERE id = 1);

INSERT INTO configuracoes (id, estabelecimento_id, intervalo, cores, rotulos)
SELECT 1, 1, 30, '#2563eb', 'pet'
WHERE NOT EXISTS (SELECT 1 FROM configuracoes WHERE id = 1);

CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    especie TEXT NOT NULL,
    raca TEXT NOT NULL,
    nascimento TEXT NOT NULL,
    sexo TEXT NOT NULL,
    peso REAL NOT NULL,
    observacoes TEXT NOT NULL,
    vacinacao TEXT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS vacinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER NOT NULL,
    nome_pet TEXT NOT NULL,
    vacina TEXT NOT NULL,
    data TEXT NOT NULL,
    proxima TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES pets(id)
);

CREATE TABLE IF NOT EXISTS planos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    meses INTEGER NOT NULL,
    recorrente INTEGER NOT NULL,
    alunos INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    recursos TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS anamneses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    nome_paciente TEXT NOT NULL,
    data TEXT NOT NULL,
    historico TEXT NOT NULL,
    alergias TEXT NOT NULL,
    medicamentos TEXT NOT NULL,
    procedimentos TEXT NOT NULL,
    observacoes TEXT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_cliente TEXT NOT NULL,
    nome_profissional TEXT NOT NULL,
    nome_servico TEXT NOT NULL,
    nota INTEGER NOT NULL,
    comentario TEXT NOT NULL,
    data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS controle (
    chave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
);
