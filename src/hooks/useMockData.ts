import { useMemo } from 'react';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { useDados } from '@/context/DadosContext';

/** Listas das telas. A origem é o banco; o segmento só filtra o que aparece. */
export function useMockData() {
  const { config } = useBusinessConfig();
  const dados = useDados();
  const segment = config.segment;

  return useMemo(() => {
    const doSegmento = <T extends { segment: string }>(lista: T[]) =>
      lista.filter((item) => !item.segment || item.segment === segment);

    return {
      customers: dados.customers,
      services: doSegmento(dados.services),
      professionals: doSegmento(dados.professionals),
      appointments: doSegmento(dados.appointments),
      payments: doSegmento(dados.payments),
      notifications: dados.notifications.filter((item) => !item.segment || item.segment === segment),
      pets: segment === 'petshop' ? dados.pets : [],
      vaccinations: segment === 'petshop' ? dados.vaccinations : [],
      plans: segment === 'academia' ? dados.plans : [],
      anamnesisRecords: segment === 'estetica' ? dados.anamnesisRecords : [],
      reviews: dados.reviews,
    };
  }, [dados, segment]);
}
