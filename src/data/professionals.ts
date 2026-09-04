import type { Professional } from '@/types';

export const professionalsBySegment: Record<string, Professional[]> = {
  petshop: [
    { id: 'p1', name: 'Ana Beatriz Santos', role: 'profissional', specialty: 'Tosadora', availability: 'Seg–Sex 09h–18h', status: 'ativo', email: 'ana@petcare.com', phone: '(11) 90001-0001' },
    { id: 'p2', name: 'Diego Ramos', role: 'profissional', specialty: 'Banho e Higiene', availability: 'Seg–Sáb 08h–17h', status: 'ativo', email: 'diego@petcare.com', phone: '(11) 90001-0002' },
    { id: 'p3', name: 'Dra. Camila Rocha', role: 'profissional', specialty: 'Veterinária', availability: 'Ter–Qui 10h–16h', status: 'ativo', email: 'camila@petcare.com', phone: '(11) 90001-0003' },
    { id: 'p4', name: 'Sofia Mendes', role: 'administrador', specialty: 'Gestão', availability: 'Seg–Sex 08h–18h', status: 'ativo', email: 'sofia@petcare.com', phone: '(11) 90001-0004' },
    { id: 'p5', name: 'Tiago Nunes', role: 'funcionario', specialty: 'Recepção', availability: 'Seg–Sáb 08h–18h', status: 'ativo', email: 'tiago@petcare.com', phone: '(11) 90001-0005' },
  ],
  barbearia: [
    { id: 'p1', name: 'Marcos Vieira', role: 'profissional', specialty: 'Corte e Barba', availability: 'Ter–Sáb 10h–20h', status: 'ativo', email: 'marcos@barberprime.com', phone: '(11) 90002-0001' },
    { id: 'p2', name: 'André Silva', role: 'profissional', specialty: 'Fade e Design', availability: 'Seg–Sex 09h–19h', status: 'ativo', email: 'andre@barberprime.com', phone: '(11) 90002-0002' },
    { id: 'p3', name: 'Bruno Costa', role: 'profissional', specialty: 'Sobrancelha', availability: 'Qua–Sáb 11h–19h', status: 'ativo', email: 'bruno@barberprime.com', phone: '(11) 90002-0003' },
    { id: 'p4', name: 'Patricia Alves', role: 'administrador', specialty: 'Gestão', availability: 'Seg–Sex 09h–18h', status: 'ativo', email: 'patricia@barberprime.com', phone: '(11) 90002-0004' },
    { id: 'p5', name: 'João Pedro', role: 'funcionario', specialty: 'Recepção', availability: 'Ter–Sáb 10h–20h', status: 'ferias', email: 'joao@barberprime.com', phone: '(11) 90002-0005' },
  ],
  academia: [
    { id: 'p1', name: 'Renata Campos', role: 'profissional', specialty: 'Personal Trainer', availability: 'Seg–Sex 06h–14h', status: 'ativo', email: 'renata@fitlife.com', phone: '(11) 90003-0001' },
    { id: 'p2', name: 'Gustavo Pires', role: 'profissional', specialty: 'Musculação', availability: 'Seg–Sáb 14h–22h', status: 'ativo', email: 'gustavo@fitlife.com', phone: '(11) 90003-0002' },
    { id: 'p3', name: 'Larissa Duarte', role: 'profissional', specialty: 'Aulas Coletivas', availability: 'Seg–Sex 07h–12h', status: 'ativo', email: 'larissa@fitlife.com', phone: '(11) 90003-0003' },
    { id: 'p4', name: 'Eduardo Lima', role: 'administrador', specialty: 'Gestão', availability: 'Seg–Sex 08h–18h', status: 'ativo', email: 'eduardo@fitlife.com', phone: '(11) 90003-0004' },
    { id: 'p5', name: 'Amanda Reis', role: 'funcionario', specialty: 'Recepção', availability: 'Seg–Sáb 06h–14h', status: 'ativo', email: 'amanda@fitlife.com', phone: '(11) 90003-0005' },
  ],
  estetica: [
    { id: 'p1', name: 'Dra. Helena Borges', role: 'profissional', specialty: 'Dermatologia Estética', availability: 'Seg–Qui 09h–17h', status: 'ativo', email: 'helena@belle.com', phone: '(11) 90004-0001' },
    { id: 'p2', name: 'Isabela Freitas', role: 'profissional', specialty: 'Esteticista', availability: 'Ter–Sáb 10h–19h', status: 'ativo', email: 'isabela@belle.com', phone: '(11) 90004-0002' },
    { id: 'p3', name: 'Vanessa Melo', role: 'profissional', specialty: 'Design e Depilação', availability: 'Seg–Sex 09h–18h', status: 'ativo', email: 'vanessa@belle.com', phone: '(11) 90004-0003' },
    { id: 'p4', name: 'Claudia Nogueira', role: 'administrador', specialty: 'Gestão', availability: 'Seg–Sex 08h–17h', status: 'ativo', email: 'claudia@belle.com', phone: '(11) 90004-0004' },
    { id: 'p5', name: 'Priscila Souza', role: 'funcionario', specialty: 'Recepção', availability: 'Seg–Sáb 09h–18h', status: 'ativo', email: 'priscila@belle.com', phone: '(11) 90004-0005' },
  ],
};

export function getProfessionals(segment: string): Professional[] {
  return professionalsBySegment[segment] ?? professionalsBySegment.petshop;
}
