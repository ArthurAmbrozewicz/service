import type { NotificationItem, Review, Pet, Vaccination, Plan, AnamnesisRecord } from '@/types';
import { addDaysISO, getTodayISO } from '@/utils/format';

const today = getTodayISO();

export const notifications: NotificationItem[] = [
  { id: 'n1', type: 'confirmacao', title: 'Agendamento confirmado', message: 'Seu horário de hoje às 09:00 foi confirmado.', date: today, read: false },
  { id: 'n2', type: 'lembrete', title: 'Lembrete de atendimento', message: 'Você tem um compromisso amanhã às 11:00.', date: today, read: false },
  { id: 'n3', type: 'pagamento', title: 'Pagamento pendente', message: 'Há um pagamento aguardando confirmação.', date: addDaysISO(-1), read: true },
  { id: 'n4', type: 'alteracao', title: 'Horário alterado', message: 'O atendimento foi remarcado para 14:00.', date: addDaysISO(-2), read: true },
  { id: 'n5', type: 'cancelamento', title: 'Agendamento cancelado', message: 'O cliente cancelou o horário de ontem.', date: addDaysISO(-3), read: true },
  { id: 'n6', type: 'lembrete', title: 'Vacina próxima', message: 'Luna — próxima dose de V10 em 7 dias.', date: today, read: false, segment: 'petshop' },
  { id: 'n7', type: 'pagamento', title: 'Mensalidade vencendo', message: 'Plano Trimestral de Carlos Henrique vence em breve.', date: today, read: false, segment: 'academia' },
  { id: 'n8', type: 'lembrete', title: 'Retorno sugerido', message: 'Mariana Oliveira — retorno de limpeza em 30 dias.', date: today, read: false, segment: 'estetica' },
];

export const reviews: Review[] = [
  { id: 'r1', customerName: 'Mariana Oliveira', professionalName: 'Marcos Vieira', serviceName: 'Corte + Barba', rating: 5, comment: 'Excelente atendimento, saí muito satisfeito com o resultado.', date: addDaysISO(-2) },
  { id: 'r2', customerName: 'Carlos Henrique', professionalName: 'André Silva', serviceName: 'Corte Masculino', rating: 4, comment: 'Bom corte, ambiente agradável. Voltarei em breve.', date: addDaysISO(-5) },
  { id: 'r3', customerName: 'Rafael Souza', professionalName: 'Marcos Vieira', serviceName: 'Barba', rating: 5, comment: 'Barba impecável. Profissional muito atencioso.', date: addDaysISO(-8) },
  { id: 'r4', customerName: 'Lucas Ferreira', professionalName: 'Bruno Costa', serviceName: 'Sobrancelha', rating: 4, comment: 'Rápido e preciso. Recomendo.', date: addDaysISO(-12) },
  { id: 'r5', customerName: 'Fernanda Costa', professionalName: 'Ana Beatriz Santos', serviceName: 'Tosa Completa', rating: 5, comment: 'Nina ficou linda! Cuidado excepcional com os pets.', date: addDaysISO(-3) },
  { id: 'r6', customerName: 'Beatriz Lima', professionalName: 'Dra. Helena Borges', serviceName: 'Peeling Químico', rating: 5, comment: 'Resultado incrível, pele renovada. Super indico.', date: addDaysISO(-6) },
];

export const pets: Pet[] = [
  { id: 'pet1', name: 'Luna', tutorId: 'c1', tutorName: 'Mariana Oliveira', species: 'Cão', breed: 'Golden Retriever', birthDate: '2021-03-15', sex: 'femea', weight: 28, notes: 'Amigável, sem restrições alimentares.', vaccinationStatus: 'em_dia' },
  { id: 'pet2', name: 'Thor', tutorId: 'c2', tutorName: 'Carlos Henrique', species: 'Cão', breed: 'Bulldog Francês', birthDate: '2022-07-20', sex: 'macho', weight: 12, notes: 'Pele sensível. Evitar shampoos fortes.', vaccinationStatus: 'atrasada' },
  { id: 'pet3', name: 'Mimi', tutorId: 'c3', tutorName: 'Juliana Martins', species: 'Gato', breed: 'Siamês', birthDate: '2020-11-08', sex: 'femea', weight: 4.2, notes: 'Não gosta de secador.', vaccinationStatus: 'em_dia' },
  { id: 'pet4', name: 'Bidu', tutorId: 'c4', tutorName: 'Rafael Souza', species: 'Cão', breed: 'SRD', birthDate: '2019-05-12', sex: 'macho', weight: 8, notes: 'Ansioso em ambientes novos.', vaccinationStatus: 'em_dia' },
  { id: 'pet5', name: 'Nina', tutorId: 'c5', tutorName: 'Fernanda Costa', species: 'Cão', breed: 'Poodle', birthDate: '2023-01-30', sex: 'femea', weight: 6.5, notes: 'Prefere tosa tesoura.', vaccinationStatus: 'em_dia' },
  { id: 'pet6', name: 'Pipoca', tutorId: 'c7', tutorName: 'Beatriz Lima', species: 'Gato', breed: 'Persa', birthDate: '2021-12-01', sex: 'femea', weight: 5, notes: 'Escovação frequente necessária.', vaccinationStatus: 'atrasada' },
  { id: 'pet7', name: 'Max', tutorId: 'c8', tutorName: 'Lucas Ferreira', species: 'Cão', breed: 'Border Collie', birthDate: '2022-04-18', sex: 'macho', weight: 18, notes: 'Muito energético.', vaccinationStatus: 'em_dia' },
];

export const vaccinations: Vaccination[] = [
  { id: 'v1', petId: 'pet1', petName: 'Luna', vaccine: 'V10', date: '2026-03-10', nextDose: '2027-03-10', status: 'aplicada' },
  { id: 'v2', petId: 'pet1', petName: 'Luna', vaccine: 'Antirrábica', date: '2026-03-10', nextDose: '2027-03-10', status: 'aplicada' },
  { id: 'v3', petId: 'pet2', petName: 'Thor', vaccine: 'V10', date: '2025-06-01', nextDose: '2026-06-01', status: 'atrasada' },
  { id: 'v4', petId: 'pet2', petName: 'Thor', vaccine: 'Antirrábica', date: '2025-06-01', nextDose: '2026-06-01', status: 'atrasada' },
  { id: 'v5', petId: 'pet3', petName: 'Mimi', vaccine: 'V4 Felina', date: '2026-01-20', nextDose: '2027-01-20', status: 'aplicada' },
  { id: 'v6', petId: 'pet5', petName: 'Nina', vaccine: 'V10', date: '2026-05-15', nextDose: addDaysISO(7), status: 'agendada' },
  { id: 'v7', petId: 'pet6', petName: 'Pipoca', vaccine: 'V4 Felina', date: '2025-08-01', nextDose: '2026-08-01', status: 'atrasada' },
  { id: 'v8', petId: 'pet7', petName: 'Max', vaccine: 'V10', date: '2026-04-18', nextDose: '2027-04-18', status: 'aplicada' },
];

export const plans: Plan[] = [
  { id: 'pl1', name: 'Plano Mensal', price: 149.9, durationMonths: 1, recurring: true, activeStudents: 42, description: 'Acesso livre à musculação e aulas coletivas.', features: ['Musculação', 'Aulas coletivas', 'Avaliação inicial'] },
  { id: 'pl2', name: 'Plano Trimestral', price: 129.9, durationMonths: 3, recurring: true, activeStudents: 28, description: 'Economia de 13% em relação ao mensal.', features: ['Musculação', 'Aulas coletivas', '1 personal/mês'] },
  { id: 'pl3', name: 'Plano Semestral', price: 119.9, durationMonths: 6, recurring: true, activeStudents: 35, description: 'Ideal para quem busca consistência.', features: ['Musculação', 'Aulas coletivas', '2 personals/mês', 'Nutrição básica'] },
  { id: 'pl4', name: 'Plano Anual', price: 99.9, durationMonths: 12, recurring: true, activeStudents: 61, description: 'Melhor custo-benefício.', features: ['Tudo incluso', '4 personals/mês', 'Avaliações trimestrais', 'App de treinos'] },
];

export const anamnesisRecords: AnamnesisRecord[] = [
  { id: 'an1', patientId: 'c1', patientName: 'Mariana Oliveira', date: '2026-08-15', history: 'Pele mista com tendência a oleosidade na zona T.', allergies: 'Nenhuma conhecida', medications: 'Protetor solar diário', procedures: 'Limpeza de pele, peeling suave', observations: 'Boa resposta a ácidos leves.' },
  { id: 'an2', patientId: 'c2', patientName: 'Carlos Henrique', date: '2026-07-20', history: 'Acne grau II na adolescência. Cicatrizes residuais.', allergies: 'Ácido salicílico em alta concentração', medications: 'Nenhuma', procedures: 'Microagulhamento', observations: 'Evitar exposição solar pós-procedimento.' },
  { id: 'an3', patientId: 'c3', patientName: 'Juliana Martins', date: '2026-09-01', history: 'Gestante (segundo trimestre).', allergies: 'Nenhuma', medications: 'Vitamina prenatal', procedures: 'Hidratação facial apenas', observations: 'Procedimentos invasivos contraindicados até o parto.' },
  { id: 'an4', patientId: 'c5', patientName: 'Fernanda Costa', date: '2026-08-28', history: 'Pele sensível, rosácea leve.', allergies: 'Níquel, fragrâncias fortes', medications: 'Creme calmante noturno', procedures: 'Design de sobrancelhas, limpeza suave', observations: 'Usar produtos hipoalergênicos.' },
  { id: 'an5', patientId: 'c7', patientName: 'Beatriz Lima', date: '2026-08-10', history: 'Pele oleosa. Uso contínuo de retinoides.', allergies: 'Nenhuma', medications: 'Tretinoína 0,025%', procedures: 'Peeling químico', observations: 'Pausar retinoide 5 dias antes do peeling.' },
];
