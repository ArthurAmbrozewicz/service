import { useMemo } from 'react';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { useMockData } from '@/hooks/useMockData';
import { formatCurrency } from '@/utils/format';
import { getTodayISO } from '@/utils/format';
import type { StatCardConfig } from '@/types';

/** Cards do dashboard variam por segmento — ponto de variação visual. */
export function useDashboardStats(): StatCardConfig[] {
  const { config, isFeatureEnabled } = useBusinessConfig();
  const data = useMockData();
  const today = getTodayISO();

  return useMemo(() => {
    const todayAppointments = data.appointments.filter((a) => a.date === today).length;
    const activeCustomers = data.customers.filter((c) => c.status === 'ativo').length;
    const revenue = data.payments
      .filter((p) => p.status === 'pago')
      .reduce((sum, p) => sum + p.amount, 0);
    const avgRating =
      data.reviews.reduce((s, r) => s + r.rating, 0) / (data.reviews.length || 1);

    const base: StatCardConfig[] = [];

    switch (config.segment) {
      case 'petshop':
        base.push(
          { id: '1', label: 'Agendamentos hoje', value: todayAppointments, icon: 'CalendarDays', trend: '+2 vs ontem' },
          { id: '2', label: 'Pets atendidos', value: data.pets.length, icon: 'PawPrint', trend: 'este mês' },
          { id: '3', label: 'Vacinas próximas', value: data.vaccinations.filter((v) => v.status === 'agendada' || v.status === 'atrasada').length, icon: 'Syringe', feature: 'vaccination' },
          { id: '4', label: 'Faturamento', value: formatCurrency(revenue), icon: 'Wallet', trend: 'pagamentos confirmados' }
        );
        break;
      case 'barbearia':
        base.push(
          { id: '1', label: 'Agendamentos hoje', value: todayAppointments, icon: 'CalendarDays' },
          { id: '2', label: `${config.labels.customerPlural} ativos`, value: activeCustomers, icon: 'Users' },
          { id: '3', label: 'Avaliações', value: avgRating.toFixed(1), icon: 'Star', trend: `${data.reviews.length} avaliações`, feature: 'reviews' },
          { id: '4', label: 'Faturamento', value: formatCurrency(revenue), icon: 'Wallet' }
        );
        break;
      case 'academia':
        base.push(
          { id: '1', label: 'Alunos ativos', value: data.customers.filter((c) => c.enrollmentStatus === 'ativa').length, icon: 'Users' },
          { id: '2', label: 'Planos vencendo', value: data.customers.filter((c) => c.enrollmentStatus === 'vencida').length, icon: 'AlertTriangle', feature: 'recurringPlans' },
          { id: '3', label: 'Frequência média', value: `${Math.round(data.customers.reduce((s, c) => s + (c.frequency ?? 0), 0) / data.customers.length)}x`, icon: 'Activity', feature: 'frequency', trend: 'visitas/mês' },
          { id: '4', label: 'Receita mensal', value: formatCurrency(revenue), icon: 'Wallet' }
        );
        break;
      case 'estetica':
        base.push(
          { id: '1', label: 'Pacientes hoje', value: todayAppointments, icon: 'CalendarDays' },
          { id: '2', label: 'Procedimentos', value: data.services.length, icon: 'Sparkles' },
          { id: '3', label: 'Retornos', value: data.appointments.filter((a) => a.status === 'agendado').length, icon: 'RotateCcw' },
          { id: '4', label: 'Faturamento', value: formatCurrency(revenue), icon: 'Wallet' }
        );
        break;
    }

    return base.filter((card) => !card.feature || isFeatureEnabled(card.feature));
  }, [config, data, today, isFeatureEnabled]);
}
