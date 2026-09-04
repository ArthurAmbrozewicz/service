import { useMemo } from 'react';
import type { Appointment } from '@/types';
import { Badge } from '@/components/Badge/Badge';
import { cn } from '@/utils/format';

interface CalendarViewProps {
  appointments: Appointment[];
  view: 'day' | 'week';
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const STATUS_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  agendado: 'info',
  confirmado: 'success',
  em_andamento: 'warning',
  concluido: 'neutral',
  cancelado: 'danger',
  faltou: 'danger',
};

const STATUS_LABEL: Record<string, string> = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  faltou: 'Faltou',
};

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatWeekday(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
}

export function CalendarView({ appointments, view, selectedDate, onSelectDate }: CalendarViewProps) {
  const days = useMemo(() => {
    if (view === 'day') return [selectedDate];
    const start = new Date(selectedDate + 'T12:00:00');
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = addDays(selectedDate, mondayOffset);
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  }, [view, selectedDate]);

  const hours = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

  return (
    <div className="calendar">
      <div className="calendar-toolbar">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSelectDate(addDays(selectedDate, -1))}>
          Anterior
        </button>
        <strong>
          {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
          })}
        </strong>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSelectDate(addDays(selectedDate, 1))}>
          Próximo
        </button>
      </div>

      <div className={cn('calendar-grid', view === 'week' && 'calendar-week')}>
        {days.map((day) => {
          const dayAppointments = appointments.filter((a) => a.date === day);
          return (
            <div
              key={day}
              className={cn('calendar-day', day === selectedDate && 'calendar-day-active')}
              onClick={() => onSelectDate(day)}
            >
              <div className="calendar-day-header">{formatWeekday(day)}</div>
              <div className="calendar-slots">
                {view === 'day'
                  ? hours.map((hour) => {
                      const slotApps = dayAppointments.filter((a) => a.time.startsWith(hour.slice(0, 2)));
                      return (
                        <div key={hour} className="calendar-slot">
                          <span className="calendar-hour">{hour}</span>
                          <div className="calendar-slot-items">
                            {slotApps.map((a) => (
                              <div key={a.id} className="calendar-event">
                                <strong>{a.time} — {a.customerName}</strong>
                                <span>{a.serviceName} · {a.professionalName}</span>
                                <Badge variant={STATUS_VARIANT[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  : dayAppointments.length === 0
                    ? <p className="calendar-empty">Sem horários</p>
                    : dayAppointments.map((a) => (
                        <div key={a.id} className="calendar-event calendar-event-compact">
                          <strong>{a.time}</strong>
                          <span>{a.customerName}</span>
                          <Badge variant={STATUS_VARIANT[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                        </div>
                      ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
