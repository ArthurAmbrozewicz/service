import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Card } from '@/components/Card/Card';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { SEGMENT_LABELS } from '@/config/business';

export function PersonalizacaoPage() {
  const {
    config,
    updateBusinessName,
    updateLogoInitials,
    updateTheme,
    updateLabels,
    resetConfig,
  } = useBusinessConfig();

  return (
    <FeatureGate feature="customization">
      <div className="page">
        <PageHeader
          title="Personalização do Negócio"
          subtitle="Identidade visual e labels dinâmicos — refletidos em toda a aplicação"
          actions={
            <Button variant="outline" size="sm" onClick={resetConfig}>
              Restaurar preset
            </Button>
          }
        />

        <div className="detail-grid">
          <Card>
            <h3>Identidade</h3>
            <div className="form-grid">
              <Input
                label="Nome do negócio"
                value={config.businessName}
                onChange={(e) => updateBusinessName(e.target.value)}
              />
              <Input
                label="Iniciais do logo"
                value={config.logoInitials}
                maxLength={3}
                onChange={(e) => updateLogoInitials(e.target.value)}
              />
              <div className="field">
                <span className="field-label">Pré-visualização</span>
                <div className="brand-preview">
                  <div className="brand-logo">{config.logoInitials}</div>
                  <div>
                    <strong>{config.businessName}</strong>
                    <span>{SEGMENT_LABELS[config.segment]}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3>Tema</h3>
            <div className="form-grid">
              <div className="field">
                <label className="field-label" htmlFor="primary">Cor principal</label>
                <input
                  id="primary"
                  type="color"
                  className="color-input"
                  value={config.theme.primary}
                  onChange={(e) => updateTheme({ primary: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="secondary">Cor secundária</label>
                <input
                  id="secondary"
                  type="color"
                  className="color-input"
                  value={config.theme.secondary}
                  onChange={(e) => updateTheme({ secondary: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="accent">Cor de destaque</label>
                <input
                  id="accent"
                  type="color"
                  className="color-input"
                  value={config.theme.accent}
                  onChange={(e) => updateTheme({ accent: e.target.value })}
                />
              </div>
            </div>
            <p className="muted-text mt-8">
              As cores são aplicadas via CSS variables e atualizam sidebar, botões e indicadores imediatamente.
            </p>
          </Card>

          <Card>
            <h3>Labels dinâmicos</h3>
            <div className="form-grid">
              <Input
                label="Cliente (singular)"
                value={config.labels.customer}
                onChange={(e) => updateLabels({ customer: e.target.value })}
              />
              <Input
                label="Cliente (plural)"
                value={config.labels.customerPlural}
                onChange={(e) => updateLabels({ customerPlural: e.target.value })}
              />
              <Input
                label="Profissional (singular)"
                value={config.labels.professional}
                onChange={(e) => updateLabels({ professional: e.target.value })}
              />
              <Input
                label="Profissional (plural)"
                value={config.labels.professionalPlural}
                onChange={(e) => updateLabels({ professionalPlural: e.target.value })}
              />
              <Input
                label="Serviço (singular)"
                value={config.labels.service}
                onChange={(e) => updateLabels({ service: e.target.value })}
              />
              <Input
                label="Agendamento (singular)"
                value={config.labels.appointment}
                onChange={(e) => updateLabels({ appointment: e.target.value })}
              />
            </div>
            <p className="muted-text mt-8">
              Exemplos: Cliente → Paciente / Tutor · Profissional → Personal Trainer / Barbeiro.
            </p>
          </Card>
        </div>
      </div>
    </FeatureGate>
  );
}
