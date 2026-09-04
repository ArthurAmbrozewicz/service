import type { Service } from '@/types';

export const servicesBySegment: Record<string, Service[]> = {
  petshop: [
    { id: 's1', name: 'Banho Completo', category: 'Higiene', duration: 60, price: 80, professionalIds: ['p1', 'p2'], status: 'ativo' },
    { id: 's2', name: 'Tosa Higiênica', category: 'Estética', duration: 45, price: 70, professionalIds: ['p1'], status: 'ativo' },
    { id: 's3', name: 'Tosa Completa', category: 'Estética', duration: 90, price: 120, professionalIds: ['p1'], status: 'ativo' },
    { id: 's4', name: 'Higienização Dental', category: 'Saúde', duration: 30, price: 60, professionalIds: ['p3'], status: 'ativo' },
    { id: 's5', name: 'Consulta Veterinária', category: 'Saúde', duration: 40, price: 150, professionalIds: ['p3'], status: 'ativo' },
  ],
  barbearia: [
    { id: 's1', name: 'Corte Masculino', category: 'Cabelo', duration: 30, price: 45, professionalIds: ['p1', 'p2'], status: 'ativo' },
    { id: 's2', name: 'Barba', category: 'Barba', duration: 20, price: 35, professionalIds: ['p1', 'p2'], status: 'ativo' },
    { id: 's3', name: 'Corte + Barba', category: 'Combo', duration: 50, price: 70, professionalIds: ['p1', 'p2'], status: 'ativo' },
    { id: 's4', name: 'Sobrancelha', category: 'Estética', duration: 15, price: 20, professionalIds: ['p3'], status: 'ativo' },
    { id: 's5', name: 'Pigmentação', category: 'Especial', duration: 60, price: 120, professionalIds: ['p1'], status: 'ativo' },
  ],
  academia: [
    { id: 's1', name: 'Avaliação Física', category: 'Avaliação', duration: 45, price: 100, professionalIds: ['p1'], status: 'ativo' },
    { id: 's2', name: 'Personal Training', category: 'Treino', duration: 60, price: 150, professionalIds: ['p1', 'p2'], status: 'ativo' },
    { id: 's3', name: 'Aula de Spinning', category: 'Coletiva', duration: 45, price: 40, professionalIds: ['p3'], status: 'ativo' },
    { id: 's4', name: 'Musculação Orientada', category: 'Treino', duration: 60, price: 0, professionalIds: ['p2'], status: 'ativo', description: 'Incluso no plano' },
    { id: 's5', name: 'Yoga', category: 'Coletiva', duration: 60, price: 50, professionalIds: ['p3'], status: 'ativo' },
  ],
  estetica: [
    { id: 's1', name: 'Limpeza de Pele', category: 'Facial', duration: 60, price: 180, professionalIds: ['p1', 'p2'], status: 'ativo' },
    { id: 's2', name: 'Peeling Químico', category: 'Facial', duration: 45, price: 250, professionalIds: ['p1'], status: 'ativo' },
    { id: 's3', name: 'Microagulhamento', category: 'Facial', duration: 90, price: 350, professionalIds: ['p1'], status: 'ativo' },
    { id: 's4', name: 'Depilação a Laser', category: 'Corporal', duration: 40, price: 200, professionalIds: ['p2'], status: 'ativo' },
    { id: 's5', name: 'Design de Sobrancelhas', category: 'Estética', duration: 30, price: 80, professionalIds: ['p3'], status: 'ativo' },
  ],
};

export function getServices(segment: string): Service[] {
  return servicesBySegment[segment] ?? servicesBySegment.petshop;
}
