import type { BusinessConfig, Pet } from '@/types';
import { DEFAULT_CONFIG } from '@/config/business';

const STORAGE_KEY = 'service_lps_config';
const AUTH_KEY = 'service_lps_auth';
const PETS_KEY = 'service_lps_pets';

/** Camada única de persistência — evita espalhar localStorage pela app. */
export const storage = {
  loadConfig(): BusinessConfig | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as BusinessConfig;
    } catch {
      return null;
    }
  },

  saveConfig(config: BusinessConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  clearConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getInitialConfig(): BusinessConfig {
    return this.loadConfig() ?? structuredClone(DEFAULT_CONFIG);
  },

  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  setAuthenticated(value: boolean): void {
    if (value) localStorage.setItem(AUTH_KEY, 'true');
    else localStorage.removeItem(AUTH_KEY);
  },

  loadPets(): Pet[] | null {
    try {
      const raw = localStorage.getItem(PETS_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Pet[];
    } catch {
      return null;
    }
  },

  savePets(pets: Pet[]): void {
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  },

  getPets(fallback: Pet[]): Pet[] {
    return this.loadPets() ?? structuredClone(fallback);
  },
};
