import type { Payment } from '@/types';
import { addDaysISO, getTodayISO } from '@/utils/format';

const today = getTodayISO();

export const paymentsBySegment: Record<string, Payment[]> = {
  petshop: [
    { id: 'pay1', customerId: 'c1', customerName: 'Mariana Oliveira', description: 'Banho Completo — Luna', amount: 80, method: 'pix', status: 'pago', date: today },
    { id: 'pay2', customerId: 'c2', customerName: 'Carlos Henrique', description: 'Tosa Completa — Thor', amount: 120, method: 'cartao', status: 'pendente', date: today, dueDate: addDaysISO(2) },
    { id: 'pay3', customerId: 'c5', customerName: 'Fernanda Costa', description: 'Pacote 5 banhos', amount: 350, method: 'pix', status: 'pago', date: addDaysISO(-3) },
    { id: 'pay4', customerId: 'c8', customerName: 'Lucas Ferreira', description: 'Banho Completo — Max', amount: 80, method: 'dinheiro', status: 'pago', date: addDaysISO(-1) },
    { id: 'pay5', customerId: 'c7', customerName: 'Beatriz Lima', description: 'Higienização Dental — Pipoca', amount: 60, method: 'pix', status: 'atrasado', date: addDaysISO(-5), dueDate: addDaysISO(-2) },
  ],
  barbearia: [
    { id: 'pay1', customerId: 'c2', customerName: 'Carlos Henrique', description: 'Corte + Barba', amount: 70, method: 'pix', status: 'pago', date: today },
    { id: 'pay2', customerId: 'c4', customerName: 'Rafael Souza', description: 'Corte Masculino', amount: 45, method: 'dinheiro', status: 'pago', date: today },
    { id: 'pay3', customerId: 'c8', customerName: 'Lucas Ferreira', description: 'Barba', amount: 35, method: 'cartao', status: 'pendente', date: today, dueDate: today },
    { id: 'pay4', customerId: 'c1', customerName: 'Mariana Oliveira', description: 'Pacote mensal (4 cortes)', amount: 160, method: 'pix', status: 'pago', date: addDaysISO(-7) },
    { id: 'pay5', customerId: 'c4', customerName: 'Rafael Souza', description: 'Pigmentação', amount: 120, method: 'cartao', status: 'pendente', date: addDaysISO(3), dueDate: addDaysISO(3) },
  ],
  academia: [
    { id: 'pay1', customerId: 'c1', customerName: 'Mariana Oliveira', description: 'Mensalidade — Plano Mensal', amount: 149.9, method: 'recorrente', status: 'pago', date: today, recurring: true, planName: 'Plano Mensal', dueDate: addDaysISO(30) },
    { id: 'pay2', customerId: 'c3', customerName: 'Juliana Martins', description: 'Mensalidade — Plano Anual', amount: 99.9, method: 'recorrente', status: 'pago', date: today, recurring: true, planName: 'Plano Anual', dueDate: addDaysISO(30) },
    { id: 'pay3', customerId: 'c2', customerName: 'Carlos Henrique', description: 'Mensalidade — Plano Trimestral', amount: 129.9, method: 'recorrente', status: 'atrasado', date: addDaysISO(-5), dueDate: addDaysISO(-1), recurring: true, planName: 'Plano Trimestral' },
    { id: 'pay4', customerId: 'c8', customerName: 'Lucas Ferreira', description: 'Avaliação Física', amount: 100, method: 'pix', status: 'pago', date: addDaysISO(-2) },
    { id: 'pay5', customerId: 'c5', customerName: 'Fernanda Costa', description: 'Mensalidade — Plano Semestral', amount: 119.9, method: 'recorrente', status: 'pendente', date: today, dueDate: addDaysISO(5), recurring: true, planName: 'Plano Semestral' },
  ],
  estetica: [
    { id: 'pay1', customerId: 'c1', customerName: 'Mariana Oliveira', description: 'Limpeza de Pele', amount: 180, method: 'pix', status: 'pago', date: today },
    { id: 'pay2', customerId: 'c7', customerName: 'Beatriz Lima', description: 'Peeling Químico', amount: 250, method: 'cartao', status: 'pendente', date: today, dueDate: today },
    { id: 'pay3', customerId: 'c5', customerName: 'Fernanda Costa', description: 'Pacote facial (3 sessões)', amount: 480, method: 'pix', status: 'pago', date: addDaysISO(-10) },
    { id: 'pay4', customerId: 'c4', customerName: 'Rafael Souza', description: 'Depilação a Laser', amount: 200, method: 'cartao', status: 'pago', date: addDaysISO(-1) },
    { id: 'pay5', customerId: 'c3', customerName: 'Juliana Martins', description: 'Limpeza de Pele', amount: 180, method: 'boleto', status: 'atrasado', date: addDaysISO(-4), dueDate: addDaysISO(-1) },
  ],
};

export function getPayments(segment: string): Payment[] {
  return paymentsBySegment[segment] ?? paymentsBySegment.petshop;
}
