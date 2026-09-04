import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { CalendarView } from '@/components/Calendar/Calendar';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { useMockData } from '@/hooks/useMockData';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { getTodayISO } from '@/utils/format';

export function AgendaPage() {
  const { appointments } = useMockData();
  const { config } = useBusinessConfig();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState(getTodayISO());

  return (
    <FeatureGate feature="appointments">
      <div className="page">
        <PageHeader
          title="Agenda"
          subtitle={`Visualização de ${config.labels.appointmentPlural.toLowerCase()}`}
          actions={
            <>
              <div className="view-toggle">
                <Button
                  size="sm"
                  variant={view === 'day' ? 'primary' : 'outline'}
                  onClick={() => setView('day')}
                >
                  Dia
                </Button>
                <Button
                  size="sm"
                  variant={view === 'week' ? 'primary' : 'outline'}
                  onClick={() => setView('week')}
                >
                  Semana
                </Button>
              </div>
              <Link to="/agendamentos/novo">
                <Button size="sm">Novo {config.labels.appointment}</Button>
              </Link>
            </>
          }
        />

        <Card padding={false}>
          <CalendarView
            appointments={appointments}
            view={view}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </Card>
      </div>
    </FeatureGate>
  );
}
