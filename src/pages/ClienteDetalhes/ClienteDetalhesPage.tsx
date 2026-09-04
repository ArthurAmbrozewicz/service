import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Plus, PawPrint, UserX } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Card } from '@/components/Card/Card';
import { Badge } from '@/components/Badge/Badge';
import { Button } from '@/components/Button/Button';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { PetFormModal } from '@/components/PetFormModal/PetFormModal';
import { useMockData } from '@/hooks/useMockData';
import { usePets } from '@/context/PetsContext';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { formatDate } from '@/utils/format';

export function ClienteDetalhesPage() {
  const { id } = useParams();
  const { customers } = useMockData();
  const { getPetsByTutor } = usePets();
  const { config, isFeatureEnabled } = useBusinessConfig();
  const [petModalOpen, setPetModalOpen] = useState(false);
  const customer = customers.find((c) => c.id === id);
  const tutorPets = customer ? getPetsByTutor(customer.id) : [];

  if (!customer) {
    return (
      <EmptyState
        icon={UserX}
        title={`${config.labels.customer} não encontrado`}
        description="Verifique o identificador ou volte à listagem."
      >
        <Link to="/clientes"><Button variant="outline">Voltar</Button></Link>
      </EmptyState>
    );
  }

  const showPetModule = config.segment === 'petshop' && isFeatureEnabled('petProfile');

  return (
    <FeatureGate feature="customers">
      <div className="page">
        <PageHeader
          title={customer.name}
          subtitle={`Ficha do ${config.labels.customer.toLowerCase()} · campos variáveis por segmento`}
          actions={
            <div className="page-actions">
              {showPetModule && (
                <Button size="sm" onClick={() => setPetModalOpen(true)}>
                  <Plus size={16} /> Cadastrar pet
                </Button>
              )}
              <Link to="/clientes">
                <Button variant="outline" size="sm"><ArrowLeft size={16} /> Voltar</Button>
              </Link>
            </div>
          }
        />

        <div className="detail-grid">
          <Card>
            <h3>Dados básicos</h3>
            <dl className="detail-list">
              <div><dt>Nome</dt><dd>{customer.name}</dd></div>
              <div><dt>Telefone</dt><dd>{customer.phone}</dd></div>
              <div><dt>E-mail</dt><dd>{customer.email}</dd></div>
              <div><dt>Status</dt><dd><Badge variant={customer.status === 'ativo' ? 'success' : 'neutral'}>{customer.status}</Badge></dd></div>
              <div><dt>Último atendimento</dt><dd>{formatDate(customer.lastVisit)}</dd></div>
            </dl>
          </Card>

          {config.segment === 'barbearia' && (
            <Card>
              <h3>Preferências (Barbearia)</h3>
              <dl className="detail-list">
                <div><dt>Preferências</dt><dd>{customer.preferences ?? '—'}</dd></div>
                <div><dt>Observações</dt><dd>{customer.notes ?? '—'}</dd></div>
              </dl>
            </Card>
          )}

          {showPetModule && (
            <Card>
              <div className="card-section-header">
                <h3>Pets do tutor</h3>
                <Button size="sm" variant="outline" onClick={() => setPetModalOpen(true)}>
                  <Plus size={14} /> Novo pet
                </Button>
              </div>

              {tutorPets.length === 0 ? (
                <div className="empty-inline">
                  <PawPrint size={20} />
                  <p className="muted-text">Nenhum pet cadastrado para este tutor.</p>
                </div>
              ) : (
                <div className="tutor-pets-list">
                  {tutorPets.map((pet) => (
                    <div key={pet.id} className="tutor-pet-item">
                      <div>
                        <strong>{pet.name}</strong>
                        <span>{pet.species} · {pet.breed} · {pet.weight} kg</span>
                      </div>
                      <Badge variant={pet.vaccinationStatus === 'em_dia' ? 'success' : pet.vaccinationStatus === 'atrasada' ? 'danger' : 'neutral'}>
                        {pet.vaccinationStatus === 'em_dia' ? 'Vacinação em dia' : pet.vaccinationStatus === 'atrasada' ? 'Vacinação atrasada' : 'Vacinação N/I'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {customer.petName && tutorPets.every((p) => p.name !== customer.petName) && (
                <p className="muted-text mt-8">
                  Dado legado do mock: {customer.petName} ({customer.petSpecies}).
                  Prefira cadastrar pets pela lista acima.
                </p>
              )}
            </Card>
          )}

          {config.segment === 'academia' && isFeatureEnabled('recurringPlans') && (
            <Card>
              <h3>Plano e frequência</h3>
              <dl className="detail-list">
                <div><dt>Aluno</dt><dd>{customer.name}</dd></div>
                <div><dt>Plano</dt><dd>{customer.planName}</dd></div>
                <div><dt>Início</dt><dd>{customer.planStart ? formatDate(customer.planStart) : '—'}</dd></div>
                <div><dt>Vencimento</dt><dd>{customer.planEnd ? formatDate(customer.planEnd) : '—'}</dd></div>
                <div><dt>Frequência</dt><dd>{customer.frequency}x / mês</dd></div>
                <div>
                  <dt>Status da matrícula</dt>
                  <dd>
                    <Badge variant={customer.enrollmentStatus === 'ativa' ? 'success' : customer.enrollmentStatus === 'vencida' ? 'warning' : 'danger'}>
                      {customer.enrollmentStatus}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </Card>
          )}

          {config.segment === 'estetica' && isFeatureEnabled('anamnesis') && (
            <Card>
              <h3>Anamnese e procedimentos</h3>
              <dl className="detail-list">
                <div><dt>Paciente</dt><dd>{customer.name}</dd></div>
                <div><dt>Anamnese</dt><dd>{customer.anamnesis ?? '—'}</dd></div>
                <div><dt>Procedimentos</dt><dd>{customer.procedures ?? '—'}</dd></div>
                <div><dt>Observações</dt><dd>{customer.notes ?? customer.segmentNotes ?? '—'}</dd></div>
                <div><dt>Histórico</dt><dd>Último atendimento em {formatDate(customer.lastVisit)}</dd></div>
              </dl>
            </Card>
          )}

          <Card>
            <h3>Ponto de variação</h3>
            <p className="muted-text">
              Esta ficha usa a mesma tela reutilizável. Os blocos acima aparecem conforme o segmento
              <strong> {config.segment}</strong> e as feature flags ativas — demonstrando variabilidade estrutural, não apenas dados diferentes.
            </p>
          </Card>
        </div>

        {showPetModule && (
          <PetFormModal
            open={petModalOpen}
            onClose={() => setPetModalOpen(false)}
            tutors={customers}
            lockedTutor={{ id: customer.id, name: customer.name }}
          />
        )}
      </div>
    </FeatureGate>
  );
}
