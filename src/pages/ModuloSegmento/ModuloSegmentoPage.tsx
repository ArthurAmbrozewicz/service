import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Puzzle } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Card } from '@/components/Card/Card';
import { Badge } from '@/components/Badge/Badge';
import { Table, type Column } from '@/components/Table/Table';
import { StatCard, StatGrid } from '@/components/StatCard/StatCard';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { Button } from '@/components/Button/Button';
import { PetFormModal } from '@/components/PetFormModal/PetFormModal';
import { useMockData } from '@/hooks/useMockData';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { formatCurrency, formatDate } from '@/utils/format';
import type { Pet, Vaccination, Plan, AnamnesisRecord, Review } from '@/types';

/**
 * Tela 11 — módulo específico do segmento.
 * Um único componente decide o conteúdo via feature flags + segmento.
 */
export function ModuloSegmentoPage() {
  const { config, isFeatureEnabled } = useBusinessConfig();
  const data = useMockData();
  const [params] = useSearchParams();
  const tab = params.get('tab');
  const navigate = useNavigate();
  const [petModalOpen, setPetModalOpen] = useState(false);

  const title = useMemo(() => {
    if (isFeatureEnabled('petProfile') && config.segment === 'petshop') {
      return tab === 'vacinacao' ? 'Vacinação' : 'Ficha do Pet';
    }
    if (isFeatureEnabled('recurringPlans') && config.segment === 'academia') {
      return tab === 'frequencia' ? 'Frequência' : 'Planos';
    }
    if (isFeatureEnabled('anamnesis') && config.segment === 'estetica') return 'Anamnese';
    if (isFeatureEnabled('reviews')) return 'Avaliações';
    return 'Módulo do Segmento';
  }, [config.segment, isFeatureEnabled, tab]);

  if (
    !isFeatureEnabled('petProfile') &&
    !isFeatureEnabled('recurringPlans') &&
    !isFeatureEnabled('anamnesis') &&
    !isFeatureEnabled('reviews') &&
    !isFeatureEnabled('vaccination') &&
    !isFeatureEnabled('frequency')
  ) {
    return (
      <EmptyState
        icon={Puzzle}
        title="Nenhum módulo específico ativo"
        description="Ative Ficha do Pet, Planos, Anamnese ou Avaliações em Módulos."
      >
        <Button variant="outline" onClick={() => navigate('/modulos')}>Ir para Módulos</Button>
      </EmptyState>
    );
  }

  const showPetList = config.segment === 'petshop' && isFeatureEnabled('petProfile') && tab !== 'vacinacao';

  return (
    <div className="page">
      <PageHeader
        title={title}
        subtitle="Principal demonstração de variabilidade da LPS"
        actions={
          showPetList ? (
            <Button size="sm" onClick={() => setPetModalOpen(true)}>
              <Plus size={16} /> Cadastrar pet
            </Button>
          ) : undefined
        }
      />

      {showPetList && <PetModule pets={data.pets} onAdd={() => setPetModalOpen(true)} />}

      {config.segment === 'petshop' && isFeatureEnabled('vaccination') && (tab === 'vacinacao' || isFeatureEnabled('petProfile')) && (
        tab === 'vacinacao' ? (
          <VaccinationModule vaccinations={data.vaccinations} />
        ) : (
          <Card className="mt-16">
            <div className="card-section-header">
              <h3>Vacinação</h3>
              <Button size="sm" variant="outline" onClick={() => navigate('/modulo?tab=vacinacao')}>
                Ver todas
              </Button>
            </div>
            <VaccinationModule vaccinations={data.vaccinations.slice(0, 4)} compact />
          </Card>
        )
      )}

      {config.segment === 'academia' && isFeatureEnabled('recurringPlans') && tab !== 'frequencia' && (
        <PlansModule plans={data.plans} />
      )}

      {config.segment === 'academia' && isFeatureEnabled('frequency') && tab === 'frequencia' && (
        <FrequencyModule customers={data.customers} />
      )}

      {config.segment === 'estetica' && isFeatureEnabled('anamnesis') && (
        <AnamnesisModule records={data.anamnesisRecords} />
      )}

      {(config.segment === 'barbearia' ||
        (!isFeatureEnabled('petProfile') &&
          !isFeatureEnabled('recurringPlans') &&
          !isFeatureEnabled('anamnesis'))) &&
        isFeatureEnabled('reviews') && (
          <ReviewsModule reviews={data.reviews} />
        )}

      {showPetList && (
        <PetFormModal
          open={petModalOpen}
          onClose={() => setPetModalOpen(false)}
          tutors={data.customers}
        />
      )}
    </div>
  );
}

function PetModule({ pets, onAdd }: { pets: Pet[]; onAdd: () => void }) {
  const columns: Column<Pet>[] = [
    { key: 'name', header: 'Pet', render: (r) => <strong>{r.name}</strong> },
    { key: 'tutor', header: 'Tutor', render: (r) => r.tutorName },
    { key: 'species', header: 'Espécie', render: (r) => r.species },
    { key: 'breed', header: 'Raça', render: (r) => r.breed, hideOnMobile: true },
    { key: 'weight', header: 'Peso', render: (r) => `${r.weight} kg` },
    {
      key: 'vax',
      header: 'Vacinação',
      render: (r) => (
        <Badge variant={r.vaccinationStatus === 'em_dia' ? 'success' : r.vaccinationStatus === 'atrasada' ? 'danger' : 'neutral'}>
          {r.vaccinationStatus === 'em_dia' ? 'Em dia' : r.vaccinationStatus === 'atrasada' ? 'Atrasada' : 'N/I'}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <StatGrid>
        <StatCard label="Pets cadastrados" value={pets.length} icon="PawPrint" />
        <StatCard label="Vacinação em dia" value={pets.filter((p) => p.vaccinationStatus === 'em_dia').length} icon="ShieldCheck" />
        <StatCard label="Atenção" value={pets.filter((p) => p.vaccinationStatus === 'atrasada').length} icon="AlertTriangle" />
      </StatGrid>
      <div className="card card-padding">
        <div className="card-section-header">
          <h3>Lista de pets</h3>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus size={14} /> Novo pet
          </Button>
        </div>
        <Table columns={columns} data={pets} keyExtractor={(r) => r.id} />
      </div>
      <div className="detail-grid mt-16">
        {pets.slice(0, 2).map((pet) => (
          <Card key={pet.id}>
            <h3>{pet.name}</h3>
            <dl className="detail-list">
              <div><dt>Tutor</dt><dd>{pet.tutorName}</dd></div>
              <div><dt>Espécie / Raça</dt><dd>{pet.species} · {pet.breed}</dd></div>
              <div><dt>Nascimento</dt><dd>{formatDate(pet.birthDate)}</dd></div>
              <div><dt>Sexo</dt><dd>{pet.sex === 'macho' ? 'Macho' : 'Fêmea'}</dd></div>
              <div><dt>Peso</dt><dd>{pet.weight} kg</dd></div>
              <div><dt>Observações</dt><dd>{pet.notes || '—'}</dd></div>
            </dl>
          </Card>
        ))}
      </div>
    </>
  );
}

function VaccinationModule({ vaccinations, compact }: { vaccinations: Vaccination[]; compact?: boolean }) {
  const columns: Column<Vaccination>[] = [
    { key: 'pet', header: 'Pet', render: (r) => r.petName },
    { key: 'vaccine', header: 'Vacina', render: (r) => r.vaccine },
    { key: 'date', header: 'Data', render: (r) => formatDate(r.date) },
    { key: 'next', header: 'Próxima dose', render: (r) => formatDate(r.nextDose) },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge variant={r.status === 'aplicada' ? 'success' : r.status === 'atrasada' ? 'danger' : 'info'}>
          {r.status}
        </Badge>
      ),
    },
  ];

  if (compact) {
    return <Table columns={columns} data={vaccinations} keyExtractor={(r) => r.id} />;
  }

  return (
    <div className="card card-padding">
      <Table columns={columns} data={vaccinations} keyExtractor={(r) => r.id} />
    </div>
  );
}

function PlansModule({ plans }: { plans: Plan[] }) {
  return (
    <>
      <StatGrid>
        <StatCard label="Planos ativos" value={plans.length} icon="Repeat" />
        <StatCard label="Alunos nos planos" value={plans.reduce((s, p) => s + p.activeStudents, 0)} icon="Users" />
      </StatGrid>
      <div className="plans-grid">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <Badge variant="info">{plan.recurring ? 'Recorrente' : 'Avulso'}</Badge>
            </div>
            <p className="plan-price">{formatCurrency(plan.price)}<span>/mês</span></p>
            <p className="muted-text">{plan.description}</p>
            <ul className="plan-features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p><strong>{plan.activeStudents}</strong> alunos ativos · {plan.durationMonths} meses</p>
          </Card>
        ))}
      </div>
    </>
  );
}

function FrequencyModule({ customers }: { customers: { id: string; name: string; frequency?: number; enrollmentStatus?: string; planName?: string }[] }) {
  const rows = customers.filter((c) => c.frequency != null);
  return (
    <div className="card card-padding">
      <Table
        columns={[
          { key: 'name', header: 'Aluno', render: (r) => r.name },
          { key: 'plan', header: 'Plano', render: (r) => r.planName ?? '—' },
          { key: 'freq', header: 'Frequência / mês', render: (r) => `${r.frequency}x` },
          {
            key: 'status',
            header: 'Matrícula',
            render: (r) => (
              <Badge variant={r.enrollmentStatus === 'ativa' ? 'success' : r.enrollmentStatus === 'vencida' ? 'warning' : 'danger'}>
                {r.enrollmentStatus}
              </Badge>
            ),
          },
        ]}
        data={rows}
        keyExtractor={(r) => r.id}
      />
    </div>
  );
}

function AnamnesisModule({ records }: { records: AnamnesisRecord[] }) {
  return (
    <div className="detail-grid">
      {records.map((r) => (
        <Card key={r.id}>
          <div className="card-section-header">
            <h3>{r.patientName}</h3>
            <span className="muted-text">{formatDate(r.date)}</span>
          </div>
          <dl className="detail-list">
            <div><dt>Histórico</dt><dd>{r.history}</dd></div>
            <div><dt>Alergias</dt><dd>{r.allergies}</dd></div>
            <div><dt>Medicamentos</dt><dd>{r.medications}</dd></div>
            <div><dt>Procedimentos</dt><dd>{r.procedures}</dd></div>
            <div><dt>Observações</dt><dd>{r.observations}</dd></div>
          </dl>
        </Card>
      ))}
    </div>
  );
}

function ReviewsModule({ reviews }: { reviews: Review[] }) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);
  return (
    <>
      <StatGrid>
        <StatCard label="Média" value={avg.toFixed(1)} icon="Star" />
        <StatCard label="Total" value={reviews.length} icon="MessageSquare" />
      </StatGrid>
      <div className="detail-grid">
        {reviews.map((r) => (
          <Card key={r.id}>
            <div className="card-section-header">
              <strong>{r.customerName}</strong>
              <Badge variant="info">{'★'.repeat(r.rating)}</Badge>
            </div>
            <p>{r.comment}</p>
            <p className="muted-text">{r.serviceName} · {r.professionalName} · {formatDate(r.date)}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
