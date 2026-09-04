import { createContext, useContext } from 'react';
import type {
  BusinessConfig,
  BusinessSegment,
  FeatureKey,
  LabelsConfig,
  ModulesConfig,
  ThemeConfig,
} from '@/types';

export interface BusinessConfigContextValue {
  config: BusinessConfig;
  isFeatureEnabled: (feature: FeatureKey) => boolean;
  applySegmentPreset: (segment: BusinessSegment) => void;
  updateModules: (modules: Partial<ModulesConfig>) => void;
  toggleModule: (feature: FeatureKey) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateLabels: (labels: Partial<LabelsConfig>) => void;
  updateBusinessName: (name: string) => void;
  updateLogoInitials: (initials: string) => void;
  resetConfig: () => void;
}

export const BusinessConfigContext = createContext<BusinessConfigContextValue | null>(null);

export function useBusinessConfig(): BusinessConfigContextValue {
  const ctx = useContext(BusinessConfigContext);
  if (!ctx) {
    throw new Error('useBusinessConfig deve ser usado dentro de BusinessConfigProvider');
  }
  return ctx;
}
