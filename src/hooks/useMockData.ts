import { useMemo } from 'react';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { usePets } from '@/context/PetsContext';
import { customers } from '@/data/customers';
import { getServices } from '@/data/services';
import { getProfessionals } from '@/data/professionals';
import { getAppointments } from '@/data/appointments';
import { getPayments } from '@/data/payments';
import { notifications, vaccinations, plans, anamnesisRecords, reviews } from '@/data/segmentData';

/** Hook de dados mockados — filtra/adapta conforme o segmento ativo. */
export function useMockData() {
  const { config } = useBusinessConfig();
  const { pets } = usePets();
  const segment = config.segment;

  return useMemo(() => {
    const services = getServices(segment);
    const professionals = getProfessionals(segment);
    const appointments = getAppointments(segment);
    const payments = getPayments(segment);
    const filteredNotifications = notifications.filter(
      (n) => !n.segment || n.segment === segment
    );

    return {
      customers,
      services,
      professionals,
      appointments,
      payments,
      notifications: filteredNotifications,
      pets: segment === 'petshop' ? pets : [],
      vaccinations: segment === 'petshop' ? vaccinations : [],
      plans: segment === 'academia' ? plans : [],
      anamnesisRecords: segment === 'estetica' ? anamnesisRecords : [],
      reviews,
    };
  }, [segment, pets]);
}
