import type { FeatureKey, ModulesConfig } from '@/types';

/** Features obrigatórias (core) — presentes em todos os produtos da LPS. */
export const MANDATORY_FEATURES: FeatureKey[] = [
  'appointments',
  'customers',
  'services',
  'professionals',
  'payments',
  'notifications',
  'history',
  'customization',
];

/** Features opcionais — habilitadas conforme segmento/configuração. */
export const OPTIONAL_FEATURES: FeatureKey[] = [
  'reviews',
  'petProfile',
  'vaccination',
  'anamnesis',
  'recurringPlans',
  'packages',
  'frequency',
];

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  appointments: 'Agendamentos',
  customers: 'Clientes',
  services: 'Serviços',
  professionals: 'Profissionais',
  payments: 'Pagamentos',
  notifications: 'Notificações',
  history: 'Histórico',
  reviews: 'Avaliações',
  petProfile: 'Ficha do Pet',
  vaccination: 'Vacinação',
  anamnesis: 'Anamnese',
  recurringPlans: 'Planos Recorrentes',
  packages: 'Pacotes',
  frequency: 'Controle de Frequência',
  customization: 'Personalização',
};

export const FEATURE_DESCRIPTIONS: Record<FeatureKey, string> = {
  appointments: 'Agenda e marcação de horários',
  customers: 'Cadastro e gestão de clientes',
  services: 'Catálogo de serviços oferecidos',
  professionals: 'Equipe e níveis de acesso',
  payments: 'Controle financeiro e cobranças',
  notifications: 'Lembretes e avisos',
  history: 'Histórico de atendimentos',
  reviews: 'Avaliações de clientes',
  petProfile: 'Ficha completa do animal (Petshop)',
  vaccination: 'Controle de vacinas (Petshop)',
  anamnesis: 'Ficha de anamnese (Clínica)',
  recurringPlans: 'Planos e mensalidades (Academia)',
  packages: 'Pacotes de serviços',
  frequency: 'Controle de frequência de alunos',
  customization: 'Tema, labels e identidade visual',
};

export function isFeatureEnabled(
  modules: ModulesConfig,
  feature: FeatureKey
): boolean {
  return Boolean(modules[feature]);
}
