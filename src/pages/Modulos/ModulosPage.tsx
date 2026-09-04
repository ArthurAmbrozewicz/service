import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Card } from '@/components/Card/Card';
import { Toggle } from '@/components/Toggle/Toggle';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import { Select } from '@/components/Select/Select';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import {
  FEATURE_DESCRIPTIONS,
  FEATURE_LABELS,
  MANDATORY_FEATURES,
  OPTIONAL_FEATURES,
} from '@/config/features';
import { SEGMENT_LABELS, segmentPresets } from '@/config/business';
import type { BusinessSegment, FeatureKey } from '@/types';

/**
 * Tela 13 — configuração de módulos e segmento.
 * Ativar/desativar features altera sidebar, rotas e UI imediatamente.
 */
export function ModulosPage() {
  const { config, toggleModule, applySegmentPreset, isFeatureEnabled } = useBusinessConfig();

  const renderFeature = (feature: FeatureKey, mandatory: boolean) => (
    <div key={feature} className="module-row">
      <div>
        <div className="module-row-title">
          <strong>{FEATURE_LABELS[feature]}</strong>
          <Badge variant={mandatory ? 'info' : 'neutral'}>{mandatory ? 'Obrigatória (modelo)' : 'Opcional'}</Badge>
          {isFeatureEnabled(feature) ? (
            <Badge variant="success">Ativa</Badge>
          ) : (
            <Badge variant="warning">Inativa</Badge>
          )}
        </div>
        <p className="muted-text">{FEATURE_DESCRIPTIONS[feature]}</p>
      </div>
      <Toggle
        id={`mod-${feature}`}
        checked={isFeatureEnabled(feature)}
        onChange={() => toggleModule(feature)}
      />
    </div>
  );

  return (
    <div className="page">
      <PageHeader
        title="Módulos e Funcionalidades"
        subtitle="Feature flags da Linha de Produto de Software"
      />

      <div className="detail-grid">
        <Card>
          <h3>Segmento / Modo de Demonstração</h3>
          <p className="muted-text">
            Aplicar um preset configura módulos, tema, labels e regras de agendamento de uma vez.
          </p>
          <Select
            label="Segmento atual"
            value={config.segment}
            onChange={(e) => applySegmentPreset(e.target.value as BusinessSegment)}
          >
            {(Object.keys(segmentPresets) as BusinessSegment[]).map((s) => (
              <option key={s} value={s}>{SEGMENT_LABELS[s]}</option>
            ))}
          </Select>
          <div className="segment-chips mt-16">
            {(Object.keys(segmentPresets) as BusinessSegment[]).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={config.segment === s ? 'primary' : 'outline'}
                onClick={() => applySegmentPreset(s)}
              >
                {SEGMENT_LABELS[s]}
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <h3>Como funciona</h3>
          <ol className="howto-list">
            <li>Ative ou desative um módulo opcional.</li>
            <li>O item some/aparece na Sidebar.</li>
            <li>Rotas protegidas exibem “Funcionalidade indisponível”.</li>
            <li>Cards do Dashboard e campos da ficha se adaptam.</li>
          </ol>
          <p className="muted-text">
            Negócio: <strong>{config.businessName}</strong> · Segmento:{' '}
            <strong>{SEGMENT_LABELS[config.segment]}</strong>
          </p>
        </Card>
      </div>

      <Card className="mt-16">
        <h3>Features obrigatórias (Core)</h3>
        <div className="module-list">
          {MANDATORY_FEATURES.map((f) => renderFeature(f, true))}
        </div>
      </Card>

      <Card className="mt-16">
        <h3>Features opcionais (Variabilidade)</h3>
        <div className="module-list">
          {OPTIONAL_FEATURES.map((f) => renderFeature(f, false))}
        </div>
      </Card>
    </div>
  );
}
