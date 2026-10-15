import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { StatCard, StatGrid } from '@/components/StatCard/StatCard';
import { Card } from '@/components/Card/Card';
import { Badge } from '@/components/Badge/Badge';
import { Table, type Column } from '@/components/Table/Table';
import { Button } from '@/components/Button/Button';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { useMockData } from '@/hooks/useMockData';
import { useDados } from '@/context/DadosContext';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Payment } from '@/types';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  pago: 'success',
  pendente: 'warning',
  atrasado: 'danger',
  cancelado: 'neutral',
};

export function PagamentosPage() {
  const { payments } = useMockData();
  const { confirmarPagamento } = useDados();
  const { config, isFeatureEnabled } = useBusinessConfig();
  const [filter, setFilter] = useState<'todos' | 'unico' | 'recorrente'>('todos');

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === 'pago').reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter((p) => p.status === 'pendente').reduce((s, p) => s + p.amount, 0);
    const done = payments.filter((p) => p.status === 'pago').length;
    return { paid, pending, done };
  }, [payments]);

  const filtered = payments.filter((p) => {
    if (filter === 'recorrente') return Boolean(p.recurring);
    if (filter === 'unico') return !p.recurring;
    return true;
  });

  const columns: Column<Payment>[] = [
    { key: 'customer', header: config.labels.customer, render: (r) => r.customerName },
    { key: 'desc', header: 'Descrição', render: (r) => r.description },
    { key: 'amount', header: 'Valor', render: (r) => formatCurrency(r.amount) },
    { key: 'method', header: 'Método', render: (r) => r.method, hideOnMobile: true },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>,
    },
    { key: 'date', header: 'Data', render: (r) => formatDate(r.date), hideOnMobile: true },
    {
      key: 'actions',
      header: 'Ações',
      render: (r) =>
        r.status !== 'pago' ? (
          <Button size="sm" variant="outline" onClick={() => { confirmarPagamento(r.id).catch((falha: Error) => window.alert(falha.message)); }}>
            Confirmar
          </Button>
        ) : (
          <span className="muted-text">—</span>
        ),
    },
  ];

  return (
    <FeatureGate feature="payments">
      <div className="page">
        <PageHeader
          title="Pagamentos"
          subtitle={
            isFeatureEnabled('recurringPlans')
              ? 'Pagamentos únicos e recorrentes (mensalidades)'
              : 'Pagamentos únicos e avulsos'
          }
        />

        <StatGrid>
          <StatCard label="Receita" value={formatCurrency(stats.paid)} icon="Wallet" />
          <StatCard label="Pendentes" value={formatCurrency(stats.pending)} icon="Clock" />
          <StatCard label="Realizados" value={stats.done} icon="CheckCircle2" />
          <StatCard
            label={isFeatureEnabled('recurringPlans') ? 'Recorrentes' : 'Métodos'}
            value={isFeatureEnabled('recurringPlans') ? payments.filter((p) => p.recurring).length : 'PIX / Cartão'}
            icon="Repeat"
          />
        </StatGrid>

        {isFeatureEnabled('recurringPlans') && (
          <div className="toolbar">
            <div className="view-toggle">
              <Button size="sm" variant={filter === 'todos' ? 'primary' : 'outline'} onClick={() => setFilter('todos')}>Todos</Button>
              <Button size="sm" variant={filter === 'unico' ? 'primary' : 'outline'} onClick={() => setFilter('unico')}>Únicos</Button>
              <Button size="sm" variant={filter === 'recorrente' ? 'primary' : 'outline'} onClick={() => setFilter('recorrente')}>Recorrentes</Button>
            </div>
          </div>
        )}

        {config.segment === 'academia' && isFeatureEnabled('recurringPlans') && (
          <Card className="mb-16">
            <h3>Mensalidades e planos</h3>
            <p className="muted-text">
              Na academia, o módulo financeiro destaca cobrança recorrente, próximo vencimento e status do plano —
              variação de regra em relação à barbearia (pagamento único).
            </p>
          </Card>
        )}

        <div className="card card-padding">
          <Table columns={columns} data={filtered} keyExtractor={(r) => r.id} />
        </div>
      </div>
    </FeatureGate>
  );
}
