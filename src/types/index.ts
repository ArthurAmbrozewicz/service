// Tipos centrais da LPS — um único produto com pontos de variação tipados.

export type BusinessSegment =
  | 'petshop'
  | 'barbearia'
  | 'academia'
  | 'estetica';

export type FeatureKey =
  | 'appointments'
  | 'customers'
  | 'services'
  | 'professionals'
  | 'payments'
  | 'notifications'
  | 'history'
  | 'reviews'
  | 'petProfile'
  | 'vaccination'
  | 'anamnesis'
  | 'recurringPlans'
  | 'packages'
  | 'frequency'
  | 'customization';

export type UserRole =
  | 'administrador'
  | 'funcionario'
  | 'profissional'
  | 'cliente';

export type AppointmentStatus =
  | 'agendado'
  | 'confirmado'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado'
  | 'faltou';

export type PaymentStatus = 'pago' | 'pendente' | 'atrasado' | 'cancelado';
export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro' | 'boleto' | 'recorrente';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
}

export interface LabelsConfig {
  customer: string;
  customerPlural: string;
  professional: string;
  professionalPlural: string;
  service: string;
  servicePlural: string;
  appointment: string;
  appointmentPlural: string;
}

export interface SchedulingRules {
  defaultDuration: number;
  interval: number;
  allowWaitingList: boolean;
  requirePetSelection: boolean;
  requirePlan: boolean;
  showAnamnesisHint: boolean;
  maxDailyAppointments: number;
}

export interface ModulesConfig {
  appointments: boolean;
  customers: boolean;
  services: boolean;
  professionals: boolean;
  payments: boolean;
  notifications: boolean;
  history: boolean;
  reviews: boolean;
  petProfile: boolean;
  vaccination: boolean;
  anamnesis: boolean;
  recurringPlans: boolean;
  packages: boolean;
  frequency: boolean;
  customization: boolean;
}

export interface BusinessConfig {
  segment: BusinessSegment;
  businessName: string;
  logoInitials: string;
  modules: ModulesConfig;
  theme: ThemeConfig;
  labels: LabelsConfig;
  schedulingRules: SchedulingRules;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'ativo' | 'inativo';
  lastVisit: string;
  notes?: string;
  preferences?: string;
  // Campos variáveis por segmento
  petName?: string;
  petSpecies?: string;
  petBreed?: string;
  petWeight?: number;
  petBirthDate?: string;
  petSex?: 'macho' | 'femea';
  vaccinationStatus?: 'em_dia' | 'atrasada' | 'nao_informado';
  planName?: string;
  planStart?: string;
  planEnd?: string;
  frequency?: number;
  enrollmentStatus?: 'ativa' | 'vencida' | 'cancelada';
  anamnesis?: string;
  procedures?: string;
  segmentNotes?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  professionalIds: string[];
  status: 'ativo' | 'inativo';
  description?: string;
}

export interface Professional {
  id: string;
  name: string;
  role: UserRole;
  specialty: string;
  availability: string;
  status: 'ativo' | 'inativo' | 'ferias';
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  petName?: string;
  paymentMethod?: PaymentMethod;
}

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  dueDate?: string;
  recurring?: boolean;
  planName?: string;
}

export interface NotificationItem {
  id: string;
  type: 'confirmacao' | 'lembrete' | 'cancelamento' | 'alteracao' | 'pagamento';
  title: string;
  message: string;
  date: string;
  read: boolean;
  segment?: BusinessSegment;
}

export interface Review {
  id: string;
  customerName: string;
  professionalName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Pet {
  id: string;
  name: string;
  tutorId: string;
  tutorName: string;
  species: string;
  breed: string;
  birthDate: string;
  sex: 'macho' | 'femea';
  weight: number;
  notes: string;
  vaccinationStatus: 'em_dia' | 'atrasada' | 'nao_informado';
}

export interface Vaccination {
  id: string;
  petId: string;
  petName: string;
  vaccine: string;
  date: string;
  nextDose: string;
  status: 'aplicada' | 'agendada' | 'atrasada';
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  recurring: boolean;
  activeStudents: number;
  description: string;
  features: string[];
}

export interface AnamnesisRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  history: string;
  allergies: string;
  medications: string;
  procedures: string;
  observations: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  feature?: FeatureKey;
  roles?: UserRole[];
}

export interface StatCardConfig {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  feature?: FeatureKey;
}
