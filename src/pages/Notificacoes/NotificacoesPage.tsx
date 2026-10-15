import { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Card } from '@/components/Card/Card';
import { Badge } from '@/components/Badge/Badge';
import { Button } from '@/components/Button/Button';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { useMockData } from '@/hooks/useMockData';
import { useDados } from '@/context/DadosContext';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { formatDate } from '@/utils/format';

const TYPE_LABEL: Record<string, string> = {
  confirmacao: 'Confirmação',
  lembrete: 'Lembrete',
  cancelamento: 'Cancelamento',
  alteracao: 'Alteração',
  pagamento: 'Pagamento',
};

const TYPE_VARIANT: Record<string, 'info' | 'warning' | 'danger' | 'success' | 'neutral'> = {
  confirmacao: 'success',
  lembrete: 'info',
  cancelamento: 'danger',
  alteracao: 'warning',
  pagamento: 'neutral',
};

const TEMPLATES: Record<string, { title: string; message: string }> = {
  petshop: {
    title: 'Lembrete de banho',
    message: 'Olá! Lembramos que o banho do seu pet está agendado para amanhã.',
  },
  barbearia: {
    title: 'Lembrete de horário',
    message: 'Olá! Seu horário na barbearia está confirmado para amanhã.',
  },
  academia: {
    title: 'Lembrete de treino',
    message: 'Olá! Não esqueça sua aula/treino agendado para amanhã.',
  },
  estetica: {
    title: 'Lembrete de consulta',
    message: 'Olá! Sua consulta/procedimento está agendado para amanhã. Evite exposição solar se indicado.',
  },
};

export function NotificacoesPage() {
  const { notifications: items } = useMockData();
  const { criarNotificacao, marcarNotificacao } = useDados();
  const { config } = useBusinessConfig();
  const [toast, setToast] = useState('');

  const sendReminder = async () => {
    const template = TEMPLATES[config.segment];
    await criarNotificacao({
      title: template.title,
      message: template.message,
      date: new Date().toISOString().slice(0, 10),
      segment: config.segment,
    });
    setToast('Lembrete gravado no banco.');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <FeatureGate feature="notifications">
      <div className="page">
        <PageHeader
          title="Notificações"
          subtitle="Templates adaptados por segmento"
          actions={
            <Button size="sm" onClick={sendReminder}>
              <Send size={16} /> Enviar lembrete
            </Button>
          }
        />

        {toast && <div className="toast success">{toast}</div>}

        <div className="notification-list">
          {items.map((n) => (
            <Card key={n.id} className={!n.read ? 'notification-unread' : undefined}>
              <div className="notification-row">
                <div className="notification-icon"><Bell size={18} /></div>
                <div className="notification-body">
                  <div className="notification-top">
                    <strong>{n.title}</strong>
                    <Badge variant={TYPE_VARIANT[n.type]}>{TYPE_LABEL[n.type]}</Badge>
                  </div>
                  <p>{n.message}</p>
                  <span className="muted-text">{formatDate(n.date)}</span>
                </div>
                {!n.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { marcarNotificacao(n.id).catch((falha: Error) => window.alert(falha.message)); }}
                  >
                    Marcar lida
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </FeatureGate>
  );
}
