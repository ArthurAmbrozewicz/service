import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Card } from '@/components/Card/Card';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { Textarea } from '@/components/Textarea/Textarea';
import { Button } from '@/components/Button/Button';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { useMockData } from '@/hooks/useMockData';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { getTodayISO } from '@/utils/format';

export function AgendamentoPage() {
  const { customers, services, professionals, pets } = useMockData();
  const { config, isFeatureEnabled } = useBusinessConfig();
  const rules = config.schedulingRules;
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerId: '',
    serviceId: '',
    professionalId: '',
    date: getTodayISO(),
    time: '10:00',
    notes: '',
    paymentMethod: 'pix',
    petId: '',
  });

  const timeOptions = (() => {
    const opts: string[] = [];
    for (let h = 8; h <= 19; h++) {
      for (let m = 0; m < 60; m += rules.interval) {
        opts.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return opts;
  })();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.customerId || !form.serviceId || !form.professionalId) return;
    if (rules.requirePetSelection && !form.petId) return;
    setSuccess(true);
    setTimeout(() => navigate('/agenda'), 1200);
  };

  return (
    <FeatureGate feature="appointments">
      <div className="page">
        <PageHeader
          title={`Novo ${config.labels.appointment}`}
          subtitle={`Duração padrão: ${rules.defaultDuration} min · intervalo: ${rules.interval} min`}
        />

        <Card>
          <form className="form-grid form-grid-2" onSubmit={handleSubmit}>
            <Select
              label={config.labels.customer}
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {customers.filter((c) => c.status === 'ativo').map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>

            <Select
              label={config.labels.service}
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.duration} min)</option>
              ))}
            </Select>

            <Select
              label={config.labels.professional}
              value={form.professionalId}
              onChange={(e) => setForm({ ...form, professionalId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {professionals.filter((p) => p.status === 'ativo' && p.role === 'profissional').map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.specialty}</option>
              ))}
            </Select>

            {rules.requirePetSelection && isFeatureEnabled('petProfile') && (
              <Select
                label="Pet"
                value={form.petId}
                onChange={(e) => setForm({ ...form, petId: e.target.value })}
                required
              >
                <option value="">Selecione o pet...</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.tutorName})</option>
                ))}
              </Select>
            )}

            <Input
              label="Data"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />

            <Select
              label="Horário"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>

            <Select
              label="Forma de pagamento"
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            >
              <option value="pix">PIX</option>
              <option value="cartao">Cartão</option>
              <option value="dinheiro">Dinheiro</option>
              {isFeatureEnabled('recurringPlans') && <option value="recorrente">Recorrente (plano)</option>}
            </Select>

            {rules.requirePlan && isFeatureEnabled('recurringPlans') && (
              <div className="field-hint-box">
                <strong>Regra Academia:</strong> este atendimento considera o plano recorrente do aluno.
                Lista de espera: {rules.allowWaitingList ? 'habilitada' : 'desabilitada'}.
              </div>
            )}

            {rules.showAnamnesisHint && isFeatureEnabled('anamnesis') && (
              <div className="field-hint-box">
                <strong>Regra Clínica:</strong> verifique a anamnese do paciente antes de confirmar o procedimento.
              </div>
            )}

            <Textarea
              label="Observações"
              className="span-2"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />

            <div className="form-actions span-2">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button type="submit">{success ? 'Agendado!' : 'Confirmar agendamento'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </FeatureGate>
  );
}
