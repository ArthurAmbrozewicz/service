import type { FeatureKey, NavItem } from '@/types';

/**
 * Menu base da LPS. Itens com `feature` só aparecem se a flag estiver ativa.
 * Labels dinâmicos são aplicados no layout via config.labels.
 */
export const baseNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { id: 'agenda', label: 'Agenda', path: '/agenda', icon: 'CalendarDays', feature: 'appointments' },
  { id: 'clientes', label: 'Clientes', path: '/clientes', icon: 'Users', feature: 'customers' },
  { id: 'servicos', label: 'Serviços', path: '/servicos', icon: 'Scissors', feature: 'services' },
  { id: 'agendamento', label: 'Novo Agendamento', path: '/agendamentos/novo', icon: 'CalendarPlus', feature: 'appointments' },
  { id: 'pagamentos', label: 'Pagamentos', path: '/pagamentos', icon: 'Wallet', feature: 'payments' },
  { id: 'notificacoes', label: 'Notificações', path: '/notificacoes', icon: 'Bell', feature: 'notifications' },
  { id: 'profissionais', label: 'Profissionais', path: '/profissionais', icon: 'UserCog', feature: 'professionals' },
  { id: 'modulo', label: 'Módulo do Segmento', path: '/modulo', icon: 'Puzzle' },
  { id: 'pets', label: 'Ficha do Pet', path: '/modulo', icon: 'PawPrint', feature: 'petProfile' },
  { id: 'vacinacao', label: 'Vacinação', path: '/modulo?tab=vacinacao', icon: 'Syringe', feature: 'vaccination' },
  { id: 'planos', label: 'Planos', path: '/modulo', icon: 'Repeat', feature: 'recurringPlans' },
  { id: 'frequencia', label: 'Frequência', path: '/modulo?tab=frequencia', icon: 'Activity', feature: 'frequency' },
  { id: 'anamnese', label: 'Anamnese', path: '/modulo', icon: 'ClipboardList', feature: 'anamnesis' },
  { id: 'avaliacoes', label: 'Avaliações', path: '/modulo', icon: 'Star', feature: 'reviews' },
  { id: 'personalizacao', label: 'Personalização', path: '/personalizacao', icon: 'Palette', feature: 'customization' },
  { id: 'modulos', label: 'Módulos', path: '/modulos', icon: 'SlidersHorizontal' },
  { id: 'banco-funcionarios', label: 'Cadastro de funcionários', path: '/banco/funcionarios', icon: 'UserCog' },
  { id: 'banco-servicos', label: 'Cadastro de serviços', path: '/banco/servicos', icon: 'Scissors' },
  { id: 'banco-horarios', label: 'Cadastro de horários', path: '/banco/horarios', icon: 'Clock' },
  { id: 'banco-agendamentos', label: 'Cadastro de agendamentos', path: '/banco/agendamentos', icon: 'CalendarDays' },
  { id: 'banco-itens', label: 'Itens do agendamento', path: '/banco/itens', icon: 'List' },
  { id: 'banco-pagamentos', label: 'Cadastro de pagamentos', path: '/banco/pagamentos', icon: 'Wallet' },
  { id: 'banco-notificacoes', label: 'Cadastro de notificações', path: '/banco/notificacoes', icon: 'Bell' },
  { id: 'banco-estabelecimento', label: 'Cadastro de estabelecimento', path: '/banco/estabelecimento', icon: 'Store' },
  { id: 'banco-modulos', label: 'Cadastro de módulos', path: '/banco/modulos', icon: 'SlidersHorizontal' },
  { id: 'banco-servico-funcionarios', label: 'Serviços por funcionário', path: '/banco/servico-funcionarios', icon: 'UserCog' },
  { id: 'banco-configuracoes', label: 'Configuração do estabelecimento', path: '/banco/configuracoes', icon: 'SlidersHorizontal' },
];

/** Filtra itens do menu conforme feature flags ativas. */
export function getVisibleNavItems(
  isFeatureEnabled: (f: FeatureKey) => boolean,
  segment: string
): NavItem[] {
  const items = baseNavItems.filter((item) => {
    if (!item.feature) {
      // "Módulo do Segmento" genérico só aparece se não houver item específico
      if (item.id === 'modulo') {
        const hasSpecific =
          isFeatureEnabled('petProfile') ||
          isFeatureEnabled('recurringPlans') ||
          isFeatureEnabled('anamnesis') ||
          (isFeatureEnabled('reviews') && segment === 'barbearia');
        return !hasSpecific;
      }
      return true;
    }

    // Evitar duplicar entrada genérica e específica
    if (item.id === 'pets' && !isFeatureEnabled('petProfile')) return false;
    if (item.id === 'vacinacao' && !isFeatureEnabled('vaccination')) return false;
    if (item.id === 'planos' && !isFeatureEnabled('recurringPlans')) return false;
    if (item.id === 'frequencia' && !isFeatureEnabled('frequency')) return false;
    if (item.id === 'anamnese' && !isFeatureEnabled('anamnesis')) return false;
    if (item.id === 'avaliacoes') {
      // Avaliações no menu específico só para barbearia (ou quando reviews e não outros módulos de segmento)
      if (!isFeatureEnabled('reviews')) return false;
      if (segment === 'barbearia') return true;
      // Petshop/estética têm reviews mas o módulo principal é outro
      return !isFeatureEnabled('petProfile') && !isFeatureEnabled('anamnesis') && !isFeatureEnabled('recurringPlans');
    }

    return isFeatureEnabled(item.feature);
  });

  // Remover duplicatas de path+id
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function resolveNavLabel(
  item: NavItem,
  labels: { customerPlural: string; servicePlural: string; professionalPlural: string; appointment: string }
): string {
  if (item.id === 'clientes') return labels.customerPlural;
  if (item.id === 'servicos') return labels.servicePlural;
  if (item.id === 'profissionais') return labels.professionalPlural;
  if (item.id === 'agendamento') return `Novo ${labels.appointment}`;
  return item.label;
}
