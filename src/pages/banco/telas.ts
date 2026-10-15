export type Campo = {
  nome: string;
  rotulo: string;
  tipo: 'texto' | 'numero' | 'opcoes' | 'relacao' | 'senha';
  opcoes?: { valor: string; rotulo: string }[];
  recurso?: string;
  exibir?: string[];
};

export type TelaBanco = {
  recurso: string;
  titulo: string;
  subtitulo: string;
  campos: Campo[];
};

const status = [
  { valor: 'ativo', rotulo: 'Ativo' },
  { valor: 'inativo', rotulo: 'Inativo' },
];

const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'].map((dia) => ({
  valor: dia,
  rotulo: dia,
}));

export const telas: Record<string, TelaBanco> = {
  clientes: {
    recurso: 'clientes',
    titulo: 'Cadastro de clientes',
    subtitulo: 'Gravado no banco',
    campos: [
      { nome: 'nome', rotulo: 'Nome', tipo: 'texto' },
      { nome: 'email', rotulo: 'E-mail', tipo: 'texto' },
      { nome: 'senha', rotulo: 'Senha', tipo: 'senha' },
      { nome: 'telefone', rotulo: 'Telefone', tipo: 'texto' },
      { nome: 'cpf', rotulo: 'CPF', tipo: 'texto' },
      { nome: 'status', rotulo: 'Status', tipo: 'opcoes', opcoes: status },
    ],
  },
  funcionarios: {
    recurso: 'funcionarios',
    titulo: 'Cadastro de funcionários',
    subtitulo: 'Gravado no banco',
    campos: [
      { nome: 'estabelecimento_id', rotulo: 'Estabelecimento', tipo: 'relacao', recurso: 'estabelecimentos' },
      { nome: 'nome', rotulo: 'Nome', tipo: 'texto' },
      { nome: 'email', rotulo: 'E-mail', tipo: 'texto' },
      { nome: 'senha', rotulo: 'Senha', tipo: 'senha' },
      { nome: 'telefone', rotulo: 'Telefone', tipo: 'texto' },
      { nome: 'especialidade', rotulo: 'Especialidade', tipo: 'texto' },
      { nome: 'status', rotulo: 'Status', tipo: 'opcoes', opcoes: status },
    ],
  },
  servicos: {
    recurso: 'servicos',
    titulo: 'Cadastro de serviços',
    subtitulo: 'Gravado no banco',
    campos: [
      { nome: 'estabelecimento_id', rotulo: 'Estabelecimento', tipo: 'relacao', recurso: 'estabelecimentos' },
      { nome: 'nome', rotulo: 'Nome', tipo: 'texto' },
      { nome: 'categoria', rotulo: 'Categoria', tipo: 'texto' },
      { nome: 'duracao_min', rotulo: 'Duração (min)', tipo: 'numero' },
      { nome: 'preco', rotulo: 'Preço', tipo: 'numero' },
      { nome: 'status', rotulo: 'Status', tipo: 'opcoes', opcoes: status },
    ],
  },
  servico_funcionarios: {
    recurso: 'servico_funcionarios',
    titulo: 'Serviços por funcionário',
    subtitulo: 'Quem atende cada serviço',
    campos: [
      { nome: 'servico_id', rotulo: 'Serviço', tipo: 'relacao', recurso: 'servicos' },
      { nome: 'funcionario_id', rotulo: 'Funcionário', tipo: 'relacao', recurso: 'funcionarios' },
    ],
  },
  horarios: {
    recurso: 'horarios',
    titulo: 'Cadastro de horários',
    subtitulo: 'Grade de atendimento do funcionário',
    campos: [
      { nome: 'funcionario_id', rotulo: 'Funcionário', tipo: 'relacao', recurso: 'funcionarios' },
      { nome: 'dia_semana', rotulo: 'Dia', tipo: 'opcoes', opcoes: dias },
      { nome: 'hora_inicio', rotulo: 'Início', tipo: 'texto' },
      { nome: 'hora_fim', rotulo: 'Fim', tipo: 'texto' },
    ],
  },
  agendamentos: {
    recurso: 'agendamentos',
    titulo: 'Cadastro de agendamentos',
    subtitulo: 'Horário comprado pelo cliente',
    campos: [
      { nome: 'cliente_id', rotulo: 'Cliente', tipo: 'relacao', recurso: 'clientes' },
      { nome: 'funcionario_id', rotulo: 'Funcionário', tipo: 'relacao', recurso: 'funcionarios' },
      { nome: 'data', rotulo: 'Data', tipo: 'texto' },
      { nome: 'hora', rotulo: 'Hora', tipo: 'texto' },
      {
        nome: 'status',
        rotulo: 'Status',
        tipo: 'opcoes',
        opcoes: [
          { valor: 'agendado', rotulo: 'Agendado' },
          { valor: 'confirmado', rotulo: 'Confirmado' },
          { valor: 'cancelado', rotulo: 'Cancelado' },
        ],
      },
      { nome: 'observacoes', rotulo: 'Observações', tipo: 'texto' },
    ],
  },
  agendamento_servicos: {
    recurso: 'agendamento_servicos',
    titulo: 'Itens do agendamento',
    subtitulo: 'Serviços vendidos em um horário',
    campos: [
      { nome: 'agendamento_id', rotulo: 'Agendamento', tipo: 'relacao', recurso: 'agendamentos', exibir: ['data', 'hora'] },
      { nome: 'servico_id', rotulo: 'Serviço', tipo: 'relacao', recurso: 'servicos' },
      { nome: 'valor', rotulo: 'Valor', tipo: 'numero' },
    ],
  },
  pagamentos: {
    recurso: 'pagamentos',
    titulo: 'Cadastro de pagamentos',
    subtitulo: 'Cobrança do agendamento',
    campos: [
      { nome: 'cliente_id', rotulo: 'Cliente', tipo: 'relacao', recurso: 'clientes' },
      { nome: 'agendamento_id', rotulo: 'Agendamento', tipo: 'relacao', recurso: 'agendamentos', exibir: ['data', 'hora'] },
      { nome: 'valor', rotulo: 'Valor', tipo: 'numero' },
      {
        nome: 'metodo',
        rotulo: 'Método',
        tipo: 'opcoes',
        opcoes: [
          { valor: 'pix', rotulo: 'PIX' },
          { valor: 'cartao', rotulo: 'Cartão' },
          { valor: 'dinheiro', rotulo: 'Dinheiro' },
        ],
      },
      {
        nome: 'status',
        rotulo: 'Status',
        tipo: 'opcoes',
        opcoes: [
          { valor: 'pendente', rotulo: 'Pendente' },
          { valor: 'pago', rotulo: 'Pago' },
          { valor: 'cancelado', rotulo: 'Cancelado' },
        ],
      },
      { nome: 'data', rotulo: 'Data', tipo: 'texto' },
    ],
  },
  notificacoes: {
    recurso: 'notificacoes',
    titulo: 'Cadastro de notificações',
    subtitulo: 'Avisos enviados ao cliente',
    campos: [
      { nome: 'usuario_id', rotulo: 'Cliente', tipo: 'relacao', recurso: 'clientes' },
      {
        nome: 'tipo',
        rotulo: 'Tipo',
        tipo: 'opcoes',
        opcoes: [
          { valor: 'confirmacao', rotulo: 'Confirmação' },
          { valor: 'lembrete', rotulo: 'Lembrete' },
          { valor: 'recuperacao_senha', rotulo: 'Recuperação de senha' },
        ],
      },
      { nome: 'titulo', rotulo: 'Título', tipo: 'texto' },
      { nome: 'mensagem', rotulo: 'Mensagem', tipo: 'texto' },
      { nome: 'data', rotulo: 'Data', tipo: 'texto' },
      {
        nome: 'lida',
        rotulo: 'Lida',
        tipo: 'opcoes',
        opcoes: [
          { valor: '0', rotulo: 'Não' },
          { valor: '1', rotulo: 'Sim' },
        ],
      },
    ],
  },
  estabelecimentos: {
    recurso: 'estabelecimentos',
    titulo: 'Cadastro de estabelecimento',
    subtitulo: 'Negócio que usa a plataforma',
    campos: [
      { nome: 'nome', rotulo: 'Nome', tipo: 'texto' },
      {
        nome: 'segmento',
        rotulo: 'Segmento',
        tipo: 'opcoes',
        opcoes: [
          { valor: 'petshop', rotulo: 'Petshop' },
          { valor: 'barbearia', rotulo: 'Barbearia' },
          { valor: 'academia', rotulo: 'Academia' },
          { valor: 'estetica', rotulo: 'Estética' },
        ],
      },
    ],
  },
  modulos: {
    recurso: 'modulos',
    titulo: 'Cadastro de módulos',
    subtitulo: 'O que o estabelecimento usa',
    campos: [
      { nome: 'estabelecimento_id', rotulo: 'Estabelecimento', tipo: 'relacao', recurso: 'estabelecimentos' },
      { nome: 'modulo', rotulo: 'Módulo', tipo: 'texto' },
      {
        nome: 'usa',
        rotulo: 'Usa',
        tipo: 'opcoes',
        opcoes: [
          { valor: '1', rotulo: 'Sim' },
          { valor: '0', rotulo: 'Não' },
        ],
      },
    ],
  },
  configuracoes: {
    recurso: 'configuracoes',
    titulo: 'Configuração do estabelecimento',
    subtitulo: 'Grade, cores e rótulos',
    campos: [
      { nome: 'estabelecimento_id', rotulo: 'Estabelecimento', tipo: 'relacao', recurso: 'estabelecimentos' },
      { nome: 'intervalo', rotulo: 'Intervalo (min)', tipo: 'numero' },
      { nome: 'cores', rotulo: 'Cores', tipo: 'texto' },
      { nome: 'rotulos', rotulo: 'Rótulos', tipo: 'texto' },
    ],
  },
};
