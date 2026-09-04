import type { ReactNode } from 'react';
import type { FeatureKey } from '@/types';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { Button } from '@/components/Button/Button';
import { ShieldOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
}

/** Protege rotas/seções — demonstra variabilidade em tempo de execução. */
export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { isFeatureEnabled } = useBusinessConfig();
  const navigate = useNavigate();

  if (isFeatureEnabled(feature)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <EmptyState
      icon={ShieldOff}
      title="Funcionalidade indisponível"
      description="Este módulo não está habilitado para este negócio."
    >
      <Button variant="outline" onClick={() => navigate('/dashboard')}>
        Voltar
      </Button>
    </EmptyState>
  );
}
