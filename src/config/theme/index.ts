import type { ThemeConfig } from '@/types';

export const defaultTheme: ThemeConfig = {
  primary: '#0F766E',
  secondary: '#134E4A',
  accent: '#14B8A6',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
};

export const segmentThemes: Record<string, Partial<ThemeConfig>> = {
  petshop: {
    primary: '#0F766E',
    secondary: '#134E4A',
    accent: '#14B8A6',
  },
  barbearia: {
    primary: '#1E3A5F',
    secondary: '#0F172A',
    accent: '#C9A227',
  },
  academia: {
    primary: '#B45309',
    secondary: '#7C2D12',
    accent: '#F59E0B',
  },
  estetica: {
    primary: '#9D174D',
    secondary: '#831843',
    accent: '#F472B6',
  },
};

/** Aplica o tema via CSS variables — ponto de variação visual da LPS. */
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-background', theme.background);
  root.style.setProperty('--color-surface', theme.surface);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-text-muted', theme.textMuted);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--color-success', theme.success);
  root.style.setProperty('--color-warning', theme.warning);
  root.style.setProperty('--color-danger', theme.danger);
}
