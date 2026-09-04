import type { BusinessConfig, BusinessSegment, LabelsConfig, ModulesConfig } from '@/types';
import { defaultTheme, segmentThemes } from '@/config/theme';

const coreModules: ModulesConfig = {
  appointments: true,
  customers: true,
  services: true,
  professionals: true,
  payments: true,
  notifications: true,
  history: true,
  reviews: false,
  petProfile: false,
  vaccination: false,
  anamnesis: false,
  recurringPlans: false,
  packages: false,
  frequency: false,
  customization: true,
};

function mergeTheme(segment: BusinessSegment) {
  return { ...defaultTheme, ...segmentThemes[segment] };
}

export const petshopConfig: BusinessConfig = {
  segment: 'petshop',
  businessName: 'PetCare',
  logoInitials: 'PC',
  modules: {
    ...coreModules,
    reviews: true,
    petProfile: true,
    vaccination: true,
    packages: true,
  },
  theme: mergeTheme('petshop'),
  labels: {
    customer: 'Tutor',
    customerPlural: 'Tutores',
    professional: 'Profissional',
    professionalPlural: 'Profissionais',
    service: 'Serviço',
    servicePlural: 'Serviços',
    appointment: 'Agendamento',
    appointmentPlural: 'Agendamentos',
  },
  schedulingRules: {
    defaultDuration: 60,
    interval: 30,
    allowWaitingList: true,
    requirePetSelection: true,
    requirePlan: false,
    showAnamnesisHint: false,
    maxDailyAppointments: 20,
  },
};

export const barbeariaConfig: BusinessConfig = {
  segment: 'barbearia',
  businessName: 'Barber Prime',
  logoInitials: 'BP',
  modules: {
    ...coreModules,
    reviews: true,
    packages: true,
  },
  theme: mergeTheme('barbearia'),
  labels: {
    customer: 'Cliente',
    customerPlural: 'Clientes',
    professional: 'Barbeiro',
    professionalPlural: 'Barbeiros',
    service: 'Serviço',
    servicePlural: 'Serviços',
    appointment: 'Agendamento',
    appointmentPlural: 'Agendamentos',
  },
  schedulingRules: {
    defaultDuration: 30,
    interval: 15,
    allowWaitingList: true,
    requirePetSelection: false,
    requirePlan: false,
    showAnamnesisHint: false,
    maxDailyAppointments: 40,
  },
};

export const academiaConfig: BusinessConfig = {
  segment: 'academia',
  businessName: 'FitLife Studio',
  logoInitials: 'FL',
  modules: {
    ...coreModules,
    recurringPlans: true,
    frequency: true,
    packages: true,
  },
  theme: mergeTheme('academia'),
  labels: {
    customer: 'Aluno',
    customerPlural: 'Alunos',
    professional: 'Personal Trainer',
    professionalPlural: 'Personal Trainers',
    service: 'Atividade',
    servicePlural: 'Atividades',
    appointment: 'Aula',
    appointmentPlural: 'Aulas',
  },
  schedulingRules: {
    defaultDuration: 60,
    interval: 30,
    allowWaitingList: true,
    requirePetSelection: false,
    requirePlan: true,
    showAnamnesisHint: false,
    maxDailyAppointments: 50,
  },
};

export const esteticaConfig: BusinessConfig = {
  segment: 'estetica',
  businessName: 'Belle Clínica',
  logoInitials: 'BC',
  modules: {
    ...coreModules,
    reviews: true,
    anamnesis: true,
    packages: true,
    history: true,
  },
  theme: mergeTheme('estetica'),
  labels: {
    customer: 'Paciente',
    customerPlural: 'Pacientes',
    professional: 'Especialista',
    professionalPlural: 'Especialistas',
    service: 'Procedimento',
    servicePlural: 'Procedimentos',
    appointment: 'Consulta',
    appointmentPlural: 'Consultas',
  },
  schedulingRules: {
    defaultDuration: 45,
    interval: 15,
    allowWaitingList: false,
    requirePetSelection: false,
    requirePlan: false,
    showAnamnesisHint: true,
    maxDailyAppointments: 25,
  },
};

export const segmentPresets: Record<BusinessSegment, BusinessConfig> = {
  petshop: petshopConfig,
  barbearia: barbeariaConfig,
  academia: academiaConfig,
  estetica: esteticaConfig,
};

export const SEGMENT_LABELS: Record<BusinessSegment, string> = {
  petshop: 'Petshop',
  barbearia: 'Barbearia',
  academia: 'Academia',
  estetica: 'Clínica de Estética',
};

export const DEFAULT_CONFIG: BusinessConfig = petshopConfig;

export function createLabelsOverride(
  base: LabelsConfig,
  overrides: Partial<LabelsConfig>
): LabelsConfig {
  return { ...base, ...overrides };
}
