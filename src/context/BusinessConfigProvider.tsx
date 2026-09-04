import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  BusinessConfig,
  BusinessSegment,
  FeatureKey,
  LabelsConfig,
  ModulesConfig,
  ThemeConfig,
} from '@/types';
import { DEFAULT_CONFIG, segmentPresets } from '@/config/business';
import { isFeatureEnabled as checkFeature } from '@/config/features';
import { applyTheme } from '@/config/theme';
import { storage } from '@/utils/storage';
import { BusinessConfigContext } from './BusinessConfigContext';

interface ProviderProps {
  children: ReactNode;
}

export function BusinessConfigProvider({ children }: ProviderProps) {
  const [config, setConfig] = useState<BusinessConfig>(() => storage.getInitialConfig());

  // Persiste e aplica tema sempre que a configuração muda.
  useEffect(() => {
    storage.saveConfig(config);
    applyTheme(config.theme);
  }, [config]);

  const isFeatureEnabled = useCallback(
    (feature: FeatureKey) => checkFeature(config.modules, feature),
    [config.modules]
  );

  const applySegmentPreset = useCallback((segment: BusinessSegment) => {
    // Trocar o preset aplica módulos, tema, labels e regras de uma vez.
    setConfig(structuredClone(segmentPresets[segment]));
  }, []);

  const updateModules = useCallback((modules: Partial<ModulesConfig>) => {
    setConfig((prev) => ({
      ...prev,
      modules: { ...prev.modules, ...modules },
    }));
  }, []);

  const toggleModule = useCallback((feature: FeatureKey) => {
    setConfig((prev) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [feature]: !prev.modules[feature],
      },
    }));
  }, []);

  const updateTheme = useCallback((theme: Partial<ThemeConfig>) => {
    setConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...theme },
    }));
  }, []);

  const updateLabels = useCallback((labels: Partial<LabelsConfig>) => {
    setConfig((prev) => ({
      ...prev,
      labels: { ...prev.labels, ...labels },
    }));
  }, []);

  const updateBusinessName = useCallback((name: string) => {
    setConfig((prev) => ({ ...prev, businessName: name }));
  }, []);

  const updateLogoInitials = useCallback((initials: string) => {
    setConfig((prev) => ({
      ...prev,
      logoInitials: initials.slice(0, 3).toUpperCase(),
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(structuredClone(DEFAULT_CONFIG));
  }, []);

  const value = useMemo(
    () => ({
      config,
      isFeatureEnabled,
      applySegmentPreset,
      updateModules,
      toggleModule,
      updateTheme,
      updateLabels,
      updateBusinessName,
      updateLogoInitials,
      resetConfig,
    }),
    [
      config,
      isFeatureEnabled,
      applySegmentPreset,
      updateModules,
      toggleModule,
      updateTheme,
      updateLabels,
      updateBusinessName,
      updateLogoInitials,
      resetConfig,
    ]
  );

  return (
    <BusinessConfigContext.Provider value={value}>
      {children}
    </BusinessConfigContext.Provider>
  );
}
