# Como adicionar um novo segmento

Exemplo: **Fisioterapia**.

## Objetivo

Criar uma nova variante **sem duplicar** Dashboard, Clientes, Agenda etc.

## Passos

### 1. Estender o tipo

Em `src/types`:

```ts
export type BusinessSegment = 'petshop' | 'barbearia' | 'academia' | 'estetica' | 'fisioterapia';
```

### 2. Criar o preset

Em `src/config/business/index.ts`:

```ts
export const fisioterapiaConfig: BusinessConfig = {
  segment: 'fisioterapia',
  businessName: 'Move Clínica',
  logoInitials: 'MC',
  modules: { ...coreModules, anamnesis: true, packages: true },
  theme: { ...defaultTheme, primary: '#0369A1', secondary: '#0C4A6E', accent: '#38BDF8' },
  labels: {
    customer: 'Paciente',
    customerPlural: 'Pacientes',
    professional: 'Fisioterapeuta',
    professionalPlural: 'Fisioterapeutas',
    service: 'Sessão',
    servicePlural: 'Sessões',
    appointment: 'Consulta',
    appointmentPlural: 'Consultas',
  },
  schedulingRules: {
    defaultDuration: 50,
    interval: 10,
    allowWaitingList: true,
    requirePetSelection: false,
    requirePlan: false,
    showAnamnesisHint: true,
    maxDailyAppointments: 20,
  },
};
```

Registrar em `segmentPresets` e `SEGMENT_LABELS`.

### 3. Tema (opcional)

Acrescentar entrada em `segmentThemes` (`src/config/theme`).

### 4. Dados mockados

Em `src/data/services.ts`, `professionals.ts`, `appointments.ts`, `payments.ts`, adicionar chave `fisioterapia`.

### 5. Variabilidade de UI

Ajustar apenas os pontos de variação necessários:

- `useDashboardStats` — cards da fisioterapia  
- `ClienteDetalhesPage` — campos específicos  
- `ModuloSegmentoPage` — se houver módulo exclusivo  

### 6. Validar

Trocar no **Modo de Demonstração** e confirmar menu/tema/labels/dados.

## O que NÃO fazer

Não criar `FisioterapiaDashboard.tsx` separado se o dashboard genérico resolver com configuração.
