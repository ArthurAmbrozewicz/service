import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { StatCard, StatGrid } from '@/components/StatCard/StatCard';
import { Card } from '@/components/Card/Card';
import { Badge } from '@/components/Badge/Badge';
import { Button } from '@/components/Button/Button';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useMockData } from '@/hooks/useMockData';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { SEGMENT_LABELS } from '@/config/business';
import { formatCurrency, formatDate } from '@/utils/format';
import { getTodayISO } from '@/utils/format';

const STATUS_LABEL: Record<string, string> = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export function DashboardPage() {
  const stats = useDashboardStats();
  const { appointments, notifications, payments } = useMockData();
  const { config } = useBusinessConfig();
  const today = getTodayISO();
  const upcoming = appointments
    .filter((a) => a.date >= today && a.status !== 'cancelado')
    .slice(0, 5);
  const recentNotifications = notifications.slice(0, 4);
  const paid = payments.filter((p) => p.status === 'pago').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === 'pendente' || p.status === 'atrasado').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle={`${config.businessName} · ${SEGMENT_LABELS[config.segment]}`}
        actions={
          <Link to="/agendamentos/novo">
            <Button size="sm">Novo {config.labels.appointment}</Button>
          </Link>
        }
      />

      <StatGrid>
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </StatGrid>

      <div className="dashboard-grid">
        <Card>
          <div className="card-section-header">
            <h3>Próximos horários</h3>
            <Link to="/agenda" className="text-link">Ver agenda</Link>
          </div>
          <ul className="activity-list">
            {upcoming.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.customerName}</strong>
                  <span>{a.serviceName} · {a.professionalName}</span>
                </div>
                <div className="activity-meta">
                  <span>{formatDate(a.date)} {a.time}</span>
                  <Badge variant="info">{STATUS_LABEL[a.status]}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="card-section-header">
            <h3>Notificações</h3>
            <Link to="/notificacoes" className="text-link">Ver todas</Link>
          </div>
          <ul className="activity-list">
            {recentNotifications.map((n) => (
              <li key={n.id}>
                <div>
                  <strong>{n.title}</strong>
                  <span>{n.message}</span>
                </div>
                {!n.read && <Badge variant="warning">Nova</Badge>}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="dashboard-chart-card">
          <div className="card-section-header">
            <h3>Resumo financeiro</h3>
            <Link to="/pagamentos" className="text-link">Detalhes</Link>
          </div>
          <div className="simple-chart">
            <div className="chart-bar-row">
              <span>Recebido</span>
              <div className="chart-bar-track">
                <div className="chart-bar-fill" style={{ width: `${Math.min(100, (paid / (paid + pending || 1)) * 100)}%` }} />
              </div>
              <strong>{formatCurrency(paid)}</strong>
            </div>
            <div className="chart-bar-row">
              <span>Pendente</span>
              <div className="chart-bar-track">
                <div className="chart-bar-fill chart-bar-warning" style={{ width: `${Math.min(100, (pending / (paid + pending || 1)) * 100)}%` }} />
              </div>
              <strong>{formatCurrency(pending)}</strong>
            </div>
          </div>
          <p className="muted-text">
            Indicadores adaptados ao segmento <strong>{SEGMENT_LABELS[config.segment]}</strong>.
            Troque o preset no header para ver a variabilidade.
          </p>
        </Card>
      </div>
    </div>
  );
}
