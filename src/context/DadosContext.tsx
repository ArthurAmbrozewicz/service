import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { atualizar, criar, excluir, listar, type Registro } from '@/api/banco';
import type {
  AnamnesisRecord,
  Appointment,
  Customer,
  NotificationItem,
  Payment,
  PaymentMethod,
  Pet,
  Plan,
  Professional,
  Review,
  Service,
  UserRole,
  Vaccination,
} from '@/types';

const SENHA_INICIAL = '123';

type Tabelas = {
  clientes: Registro[];
  funcionarios: Registro[];
  servicos: Registro[];
  servico_funcionarios: Registro[];
  agendamentos: Registro[];
  agendamento_servicos: Registro[];
  pagamentos: Registro[];
  notificacoes: Registro[];
  pets: Registro[];
  vacinas: Registro[];
  planos: Registro[];
  anamneses: Registro[];
  avaliacoes: Registro[];
};

export type DadosProntos = {
  carregado: boolean;
  customers: Customer[];
  services: (Service & { segment: string })[];
  professionals: (Professional & { segment: string })[];
  appointments: (Appointment & { segment: string })[];
  payments: (Payment & { segment: string })[];
  notifications: NotificationItem[];
  pets: Pet[];
  vaccinations: Vaccination[];
  plans: Plan[];
  anamnesisRecords: AnamnesisRecord[];
  reviews: Review[];
  recarregar: () => Promise<void>;
  salvarCliente: (form: { name: string; phone: string; email: string }, id?: string) => Promise<void>;
  excluirCliente: (id: string) => Promise<void>;
  salvarServico: (
    form: { name: string; category: string; duration: number; price: number; status: 'ativo' | 'inativo' },
    segmento: string,
    id?: string
  ) => Promise<void>;
  excluirServico: (id: string) => Promise<void>;
  confirmarPagamento: (id: string) => Promise<void>;
  criarNotificacao: (item: { title: string; message: string; date: string; segment: string }) => Promise<void>;
  marcarNotificacao: (id: string) => Promise<void>;
  criarAgendamento: (form: {
    customerId: string;
    serviceId: string;
    professionalId: string;
    date: string;
    time: string;
    notes: string;
    paymentMethod: string;
    petName: string;
    segment: string;
    price: number;
  }) => Promise<void>;
  adicionarPet: (input: Omit<Pet, 'id'>) => Promise<Pet>;
};

const vazio: Tabelas = {
  clientes: [],
  funcionarios: [],
  servicos: [],
  servico_funcionarios: [],
  agendamentos: [],
  agendamento_servicos: [],
  pagamentos: [],
  notificacoes: [],
  pets: [],
  vacinas: [],
  planos: [],
  anamneses: [],
  avaliacoes: [],
};

const DadosContext = createContext<DadosProntos | null>(null);

function nome(lista: Registro[], id: number) {
  return String(lista.find((item) => item.id === id)?.nome ?? '');
}

function montar(tabelas: Tabelas): Omit<DadosProntos, 'carregado' | 'recarregar' | 'salvarCliente' | 'excluirCliente' | 'salvarServico' | 'excluirServico' | 'confirmarPagamento' | 'criarNotificacao' | 'marcarNotificacao' | 'criarAgendamento' | 'adicionarPet'> {
  const customers: Customer[] = tabelas.clientes.map((linha) => ({
    id: String(linha.id),
    name: String(linha.nome),
    phone: String(linha.telefone),
    email: String(linha.email),
    status: linha.status === 'inativo' ? 'inativo' : 'ativo',
    lastVisit: String(linha.ultima_visita ?? ''),
    notes: String(linha.observacoes ?? ''),
    preferences: String(linha.preferencias ?? ''),
    anamnesis: String(linha.anamnese ?? ''),
    procedures: String(linha.procedimentos ?? ''),
    segmentNotes: String(linha.notas_segmento ?? ''),
    planName: String(linha.plano ?? ''),
    planStart: String(linha.plano_inicio ?? ''),
    planEnd: String(linha.plano_fim ?? ''),
    frequency: Number(linha.frequencia ?? 0),
    enrollmentStatus: (['ativa', 'vencida', 'cancelada'].includes(String(linha.matricula))
      ? linha.matricula
      : 'ativa') as Customer['enrollmentStatus'],
  }));

  const services = tabelas.servicos.map((linha) => ({
    id: String(linha.id),
    name: String(linha.nome),
    category: String(linha.categoria),
    duration: Number(linha.duracao_min),
    price: Number(linha.preco),
    status: (linha.status === 'inativo' ? 'inativo' : 'ativo') as Service['status'],
    segment: String(linha.segmento ?? ''),
    professionalIds: tabelas.servico_funcionarios
      .filter((vinculo) => vinculo.servico_id === linha.id)
      .map((vinculo) => String(vinculo.funcionario_id)),
  }));

  const professionals = tabelas.funcionarios.map((linha) => ({
    id: String(linha.id),
    name: String(linha.nome),
    role: (String(linha.cargo || 'profissional') as UserRole),
    specialty: String(linha.especialidade),
    availability: String(linha.disponibilidade ?? ''),
    status: (['ativo', 'inativo', 'ferias'].includes(String(linha.status)) ? linha.status : 'ativo') as Professional['status'],
    email: String(linha.email),
    phone: String(linha.telefone),
    segment: String(linha.segmento ?? ''),
  }));

  const appointments = tabelas.agendamentos.map((linha) => {
    const item = tabelas.agendamento_servicos.find((servico) => servico.agendamento_id === linha.id);
    const servico = tabelas.servicos.find((cadastro) => cadastro.id === item?.servico_id);
    return {
      id: String(linha.id),
      customerId: String(linha.cliente_id),
      customerName: nome(tabelas.clientes, Number(linha.cliente_id)),
      serviceId: String(item?.servico_id ?? ''),
      serviceName: String(servico?.nome ?? ''),
      professionalId: String(linha.funcionario_id),
      professionalName: nome(tabelas.funcionarios, Number(linha.funcionario_id)),
      date: String(linha.data),
      time: String(linha.hora),
      duration: Number(servico?.duracao_min ?? 0),
      status: linha.status as Appointment['status'],
      notes: String(linha.observacoes ?? ''),
      petName: String(linha.pet_nome ?? ''),
      segment: String(linha.segmento ?? ''),
    };
  });

  const payments = tabelas.pagamentos.map((linha) => ({
    id: String(linha.id),
    customerId: String(linha.cliente_id),
    customerName: nome(tabelas.clientes, Number(linha.cliente_id)),
    description: String(linha.descricao ?? ''),
    amount: Number(linha.valor),
    method: String(linha.metodo) as PaymentMethod,
    status: linha.status as Payment['status'],
    date: String(linha.data).slice(0, 10),
    dueDate: linha.vencimento ? String(linha.vencimento) : undefined,
    recurring: Number(linha.recorrente) === 1,
    planName: linha.plano ? String(linha.plano) : undefined,
    segment: String(linha.segmento ?? ''),
  }));

  const notifications: NotificationItem[] = tabelas.notificacoes.map((linha) => ({
    id: String(linha.id),
    type: linha.tipo as NotificationItem['type'],
    title: String(linha.titulo),
    message: String(linha.mensagem),
    date: String(linha.data).slice(0, 10),
    read: Number(linha.lida) === 1,
    segment: linha.segmento ? (String(linha.segmento) as NotificationItem['segment']) : undefined,
  }));

  const pets: Pet[] = tabelas.pets.map((linha) => ({
    id: String(linha.id),
    name: String(linha.nome),
    tutorId: String(linha.cliente_id),
    tutorName: nome(tabelas.clientes, Number(linha.cliente_id)),
    species: String(linha.especie),
    breed: String(linha.raca),
    birthDate: String(linha.nascimento),
    sex: linha.sexo === 'femea' ? 'femea' : 'macho',
    weight: Number(linha.peso),
    notes: String(linha.observacoes ?? ''),
    vaccinationStatus: linha.vacinacao as Pet['vaccinationStatus'],
  }));

  const vaccinations: Vaccination[] = tabelas.vacinas.map((linha) => ({
    id: String(linha.id),
    petId: String(linha.pet_id),
    petName: String(linha.nome_pet),
    vaccine: String(linha.vacina),
    date: String(linha.data),
    nextDose: String(linha.proxima),
    status: linha.status as Vaccination['status'],
  }));

  const plans: Plan[] = tabelas.planos.map((linha) => ({
    id: String(linha.id),
    name: String(linha.nome),
    price: Number(linha.preco),
    durationMonths: Number(linha.meses),
    recurring: Number(linha.recorrente) === 1,
    activeStudents: Number(linha.alunos),
    description: String(linha.descricao),
    features: String(linha.recursos ?? '').split('|').filter(Boolean),
  }));

  const anamnesisRecords: AnamnesisRecord[] = tabelas.anamneses.map((linha) => ({
    id: String(linha.id),
    patientId: String(linha.cliente_id),
    patientName: String(linha.nome_paciente),
    date: String(linha.data),
    history: String(linha.historico),
    allergies: String(linha.alergias),
    medications: String(linha.medicamentos),
    procedures: String(linha.procedimentos),
    observations: String(linha.observacoes),
  }));

  const reviews: Review[] = tabelas.avaliacoes.map((linha) => ({
    id: String(linha.id),
    customerName: String(linha.nome_cliente),
    professionalName: String(linha.nome_profissional),
    serviceName: String(linha.nome_servico),
    rating: Number(linha.nota),
    comment: String(linha.comentario),
    date: String(linha.data),
  }));

  return { customers, services, professionals, appointments, payments, notifications, pets, vaccinations, plans, anamnesisRecords, reviews };
}

export function DadosProvider({ children }: { children: ReactNode }) {
  const [tabelas, setTabelas] = useState<Tabelas>(vazio);
  const [carregado, setCarregado] = useState(false);

  const recarregar = useCallback(async () => {
    const nomes = Object.keys(vazio) as (keyof Tabelas)[];
    const pares = await Promise.all(nomes.map(async (nomeTabela) => [nomeTabela, await listar(nomeTabela)] as const));
    const proximo = { ...vazio };
    pares.forEach(([nomeTabela, linhas]) => {
      proximo[nomeTabela] = linhas;
    });
    setTabelas(proximo);
    setCarregado(true);
  }, []);

  useEffect(() => {
    recarregar().catch(() => setCarregado(true));
  }, [recarregar]);

  const salvarCliente = useCallback(async (form: { name: string; phone: string; email: string }, id?: string) => {
    const atual = id ? tabelas.clientes.find((linha) => String(linha.id) === id) : undefined;
    const corpo = {
      nome: form.name.trim(),
      email: form.email.trim(),
      telefone: form.phone.trim(),
      status: String(atual?.status ?? 'ativo'),
      cpf: String(atual?.cpf ?? `gen${Date.now()}`),
      ultima_visita: String(atual?.ultima_visita ?? new Date().toISOString().slice(0, 10)),
    };
    if (id) await atualizar('clientes', Number(id), corpo);
    else await criar('clientes', { ...corpo, senha: SENHA_INICIAL });
    await recarregar();
  }, [recarregar, tabelas.clientes]);

  const excluirCliente = useCallback(async (id: string) => {
    await excluir('clientes', Number(id));
    await recarregar();
  }, [recarregar]);

  const salvarServico = useCallback(async (
    form: { name: string; category: string; duration: number; price: number; status: 'ativo' | 'inativo' },
    segmento: string,
    id?: string
  ) => {
    const corpo = {
      estabelecimento_id: 1,
      nome: form.name.trim(),
      categoria: form.category.trim(),
      duracao_min: form.duration,
      preco: form.price,
      status: form.status,
      segmento,
    };
    if (id) {
      await atualizar('servicos', Number(id), corpo);
    } else {
      const servico = await criar('servicos', corpo);
      const profissional = tabelas.funcionarios.find((linha) => linha.segmento === segmento && linha.status === 'ativo');
      if (profissional) {
        await criar('servico_funcionarios', { servico_id: servico.id, funcionario_id: profissional.id });
      }
    }
    await recarregar();
  }, [recarregar, tabelas.funcionarios]);

  const excluirServico = useCallback(async (id: string) => {
    const vinculos = tabelas.servico_funcionarios.filter((linha) => String(linha.servico_id) === id);
    for (const vinculo of vinculos) {
      await excluir('servico_funcionarios', vinculo.id);
    }
    await excluir('servicos', Number(id));
    await recarregar();
  }, [recarregar, tabelas.servico_funcionarios]);

  const confirmarPagamento = useCallback(async (id: string) => {
    const linha = tabelas.pagamentos.find((item) => String(item.id) === id);
    if (!linha) return;
    await atualizar('pagamentos', Number(id), {
      cliente_id: linha.cliente_id,
      agendamento_id: linha.agendamento_id,
      valor: linha.valor,
      metodo: linha.metodo,
      status: 'pago',
      data: linha.data,
    });
    await recarregar();
  }, [recarregar, tabelas.pagamentos]);

  const criarNotificacao = useCallback(async (item: { title: string; message: string; date: string; segment: string }) => {
    const cliente = tabelas.clientes[0];
    await criar('notificacoes', {
      usuario_id: cliente?.id ?? 1,
      tipo: 'lembrete',
      titulo: item.title,
      mensagem: item.message,
      data: item.date,
      lida: 0,
      segmento: item.segment,
    });
    await recarregar();
  }, [recarregar, tabelas.clientes]);

  const marcarNotificacao = useCallback(async (id: string) => {
    const linha = tabelas.notificacoes.find((item) => String(item.id) === id);
    if (!linha) return;
    await atualizar('notificacoes', Number(id), {
      usuario_id: linha.usuario_id,
      tipo: linha.tipo,
      titulo: linha.titulo,
      mensagem: linha.mensagem,
      data: linha.data,
      lida: 1,
    });
    await recarregar();
  }, [recarregar, tabelas.notificacoes]);

  const criarAgendamento = useCallback(async (form: {
    customerId: string;
    serviceId: string;
    professionalId: string;
    date: string;
    time: string;
    notes: string;
    paymentMethod: string;
    petName: string;
    segment: string;
    price: number;
  }) => {
    const agendamento = await criar('agendamentos', {
      cliente_id: Number(form.customerId),
      funcionario_id: Number(form.professionalId),
      data: form.date,
      hora: form.time,
      status: 'agendado',
      observacoes: form.notes,
      segmento: form.segment,
      pet_nome: form.petName,
    });
    await criar('agendamento_servicos', {
      agendamento_id: agendamento.id,
      servico_id: Number(form.serviceId),
      valor: form.price,
    });
    await criar('pagamentos', {
      cliente_id: Number(form.customerId),
      agendamento_id: agendamento.id,
      valor: form.price,
      metodo: form.paymentMethod,
      status: 'pendente',
      data: form.date,
      segmento: form.segment,
      descricao: 'Agendamento',
      recorrente: form.paymentMethod === 'recorrente' ? 1 : 0,
    });
    await recarregar();
  }, [recarregar]);

  const adicionarPet = useCallback(async (input: Omit<Pet, 'id'>) => {
    const linha = await criar('pets', {
      cliente_id: Number(input.tutorId),
      nome: input.name,
      especie: input.species,
      raca: input.breed,
      nascimento: input.birthDate,
      sexo: input.sex,
      peso: input.weight,
      observacoes: input.notes,
      vacinacao: input.vaccinationStatus,
    });
    await recarregar();
    return { ...input, id: String(linha.id) };
  }, [recarregar]);

  const valor = useMemo<DadosProntos>(() => ({
    carregado,
    ...montar(tabelas),
    recarregar,
    salvarCliente,
    excluirCliente,
    salvarServico,
    excluirServico,
    confirmarPagamento,
    criarNotificacao,
    marcarNotificacao,
    criarAgendamento,
    adicionarPet,
  }), [carregado, tabelas, recarregar, salvarCliente, excluirCliente, salvarServico, excluirServico, confirmarPagamento, criarNotificacao, marcarNotificacao, criarAgendamento, adicionarPet]);

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>;
}

export function useDados() {
  const contexto = useContext(DadosContext);
  if (!contexto) throw new Error('useDados deve ser usado dentro de DadosProvider');
  return contexto;
}
