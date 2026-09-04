import type { Appointment } from '@/types';
import { addDaysISO, getTodayISO } from '@/utils/format';

const today = getTodayISO();
const tomorrow = addDaysISO(1);
const yesterday = addDaysISO(-1);
const inTwo = addDaysISO(2);
const inThree = addDaysISO(3);

export const appointmentsBySegment: Record<string, Appointment[]> = {
  petshop: [
    { id: 'a1', customerId: 'c1', customerName: 'Mariana Oliveira', serviceId: 's1', serviceName: 'Banho Completo', professionalId: 'p2', professionalName: 'Diego Ramos', date: today, time: '09:00', duration: 60, status: 'confirmado', petName: 'Luna' },
    { id: 'a2', customerId: 'c2', customerName: 'Carlos Henrique', serviceId: 's3', serviceName: 'Tosa Completa', professionalId: 'p1', professionalName: 'Ana Beatriz Santos', date: today, time: '10:30', duration: 90, status: 'agendado', petName: 'Thor' },
    { id: 'a3', customerId: 'c5', customerName: 'Fernanda Costa', serviceId: 's2', serviceName: 'Tosa Higiênica', professionalId: 'p1', professionalName: 'Ana Beatriz Santos', date: today, time: '14:00', duration: 45, status: 'em_andamento', petName: 'Nina' },
    { id: 'a4', customerId: 'c3', customerName: 'Juliana Martins', serviceId: 's5', serviceName: 'Consulta Veterinária', professionalId: 'p3', professionalName: 'Dra. Camila Rocha', date: tomorrow, time: '11:00', duration: 40, status: 'agendado', petName: 'Mimi' },
    { id: 'a5', customerId: 'c8', customerName: 'Lucas Ferreira', serviceId: 's1', serviceName: 'Banho Completo', professionalId: 'p2', professionalName: 'Diego Ramos', date: yesterday, time: '15:00', duration: 60, status: 'concluido', petName: 'Max' },
    { id: 'a6', customerId: 'c7', customerName: 'Beatriz Lima', serviceId: 's4', serviceName: 'Higienização Dental', professionalId: 'p3', professionalName: 'Dra. Camila Rocha', date: inTwo, time: '10:00', duration: 30, status: 'agendado', petName: 'Pipoca' },
  ],
  barbearia: [
    { id: 'a1', customerId: 'c2', customerName: 'Carlos Henrique', serviceId: 's3', serviceName: 'Corte + Barba', professionalId: 'p1', professionalName: 'Marcos Vieira', date: today, time: '10:00', duration: 50, status: 'confirmado' },
    { id: 'a2', customerId: 'c4', customerName: 'Rafael Souza', serviceId: 's1', serviceName: 'Corte Masculino', professionalId: 'p2', professionalName: 'André Silva', date: today, time: '11:00', duration: 30, status: 'agendado' },
    { id: 'a3', customerId: 'c8', customerName: 'Lucas Ferreira', serviceId: 's2', serviceName: 'Barba', professionalId: 'p1', professionalName: 'Marcos Vieira', date: today, time: '15:30', duration: 20, status: 'agendado' },
    { id: 'a4', customerId: 'c1', customerName: 'Mariana Oliveira', serviceId: 's4', serviceName: 'Sobrancelha', professionalId: 'p3', professionalName: 'Bruno Costa', date: tomorrow, time: '14:00', duration: 15, status: 'agendado' },
    { id: 'a5', customerId: 'c2', customerName: 'Carlos Henrique', serviceId: 's1', serviceName: 'Corte Masculino', professionalId: 'p2', professionalName: 'André Silva', date: yesterday, time: '16:00', duration: 30, status: 'concluido' },
    { id: 'a6', customerId: 'c4', customerName: 'Rafael Souza', serviceId: 's5', serviceName: 'Pigmentação', professionalId: 'p1', professionalName: 'Marcos Vieira', date: inThree, time: '11:00', duration: 60, status: 'agendado' },
  ],
  academia: [
    { id: 'a1', customerId: 'c1', customerName: 'Mariana Oliveira', serviceId: 's2', serviceName: 'Personal Training', professionalId: 'p1', professionalName: 'Renata Campos', date: today, time: '07:00', duration: 60, status: 'confirmado' },
    { id: 'a2', customerId: 'c5', customerName: 'Fernanda Costa', serviceId: 's3', serviceName: 'Aula de Spinning', professionalId: 'p3', professionalName: 'Larissa Duarte', date: today, time: '08:00', duration: 45, status: 'em_andamento' },
    { id: 'a3', customerId: 'c8', customerName: 'Lucas Ferreira', serviceId: 's1', serviceName: 'Avaliação Física', professionalId: 'p1', professionalName: 'Renata Campos', date: today, time: '10:00', duration: 45, status: 'agendado' },
    { id: 'a4', customerId: 'c3', customerName: 'Juliana Martins', serviceId: 's5', serviceName: 'Yoga', professionalId: 'p3', professionalName: 'Larissa Duarte', date: tomorrow, time: '07:30', duration: 60, status: 'agendado' },
    { id: 'a5', customerId: 'c7', customerName: 'Beatriz Lima', serviceId: 's2', serviceName: 'Personal Training', professionalId: 'p2', professionalName: 'Gustavo Pires', date: yesterday, time: '18:00', duration: 60, status: 'concluido' },
    { id: 'a6', customerId: 'c4', customerName: 'Rafael Souza', serviceId: 's4', serviceName: 'Musculação Orientada', professionalId: 'p2', professionalName: 'Gustavo Pires', date: inTwo, time: '19:00', duration: 60, status: 'agendado' },
  ],
  estetica: [
    { id: 'a1', customerId: 'c1', customerName: 'Mariana Oliveira', serviceId: 's1', serviceName: 'Limpeza de Pele', professionalId: 'p2', professionalName: 'Isabela Freitas', date: today, time: '09:30', duration: 60, status: 'confirmado' },
    { id: 'a2', customerId: 'c5', customerName: 'Fernanda Costa', serviceId: 's5', serviceName: 'Design de Sobrancelhas', professionalId: 'p3', professionalName: 'Vanessa Melo', date: today, time: '11:00', duration: 30, status: 'agendado' },
    { id: 'a3', customerId: 'c7', customerName: 'Beatriz Lima', serviceId: 's2', serviceName: 'Peeling Químico', professionalId: 'p1', professionalName: 'Dra. Helena Borges', date: today, time: '14:00', duration: 45, status: 'agendado' },
    { id: 'a4', customerId: 'c3', customerName: 'Juliana Martins', serviceId: 's1', serviceName: 'Limpeza de Pele', professionalId: 'p2', professionalName: 'Isabela Freitas', date: tomorrow, time: '10:00', duration: 60, status: 'agendado' },
    { id: 'a5', customerId: 'c4', customerName: 'Rafael Souza', serviceId: 's4', serviceName: 'Depilação a Laser', professionalId: 'p2', professionalName: 'Isabela Freitas', date: yesterday, time: '15:00', duration: 40, status: 'concluido' },
    { id: 'a6', customerId: 'c1', customerName: 'Mariana Oliveira', serviceId: 's3', serviceName: 'Microagulhamento', professionalId: 'p1', professionalName: 'Dra. Helena Borges', date: inThree, time: '09:00', duration: 90, status: 'agendado' },
  ],
};

export function getAppointments(segment: string): Appointment[] {
  return appointmentsBySegment[segment] ?? appointmentsBySegment.petshop;
}
