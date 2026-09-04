import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Badge } from '@/components/Badge/Badge';
import { Table, type Column } from '@/components/Table/Table';
import { Card } from '@/components/Card/Card';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { useMockData } from '@/hooks/useMockData';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import type { Professional, UserRole } from '@/types';

const ROLE_LABEL: Record<UserRole, string> = {
  administrador: 'Administrador',
  funcionario: 'Funcionário',
  profissional: 'Profissional',
  cliente: 'Cliente',
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'neutral'> = {
  ativo: 'success',
  ferias: 'warning',
  inativo: 'neutral',
};

export function ProfissionaisPage() {
  const { professionals } = useMockData();
  const { config } = useBusinessConfig();

  const columns: Column<Professional>[] = [
    { key: 'name', header: 'Nome', render: (r) => <strong>{r.name}</strong> },
    { key: 'role', header: 'Cargo', render: (r) => ROLE_LABEL[r.role] },
    { key: 'specialty', header: 'Especialidade', render: (r) => r.specialty },
    { key: 'availability', header: 'Disponibilidade', render: (r) => r.availability, hideOnMobile: true },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>,
    },
  ];

  return (
    <FeatureGate feature="professionals">
      <div className="page">
        <PageHeader
          title={config.labels.professionalPlural}
          subtitle="Equipe, acessos e níveis de permissão"
        />

        <div className="role-cards">
          {(['administrador', 'funcionario', 'profissional', 'cliente'] as UserRole[]).map((role) => (
            <Card key={role} className="role-card">
              <strong>{ROLE_LABEL[role]}</strong>
              <p className="muted-text">
                {role === 'administrador' && 'Acesso total, inclusive módulos e personalização.'}
                {role === 'funcionario' && 'Agenda, clientes e atendimento operacional.'}
                {role === 'profissional' && `Executa ${config.labels.servicePlural.toLowerCase()} e vê agenda própria.`}
                {role === 'cliente' && 'Portal externo (simulado) — agendar e avaliar.'}
              </p>
            </Card>
          ))}
        </div>

        <div className="card card-padding">
          <Table columns={columns} data={professionals} keyExtractor={(r) => r.id} />
        </div>
      </div>
    </FeatureGate>
  );
}
