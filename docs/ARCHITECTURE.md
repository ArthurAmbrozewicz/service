# Arquitetura — Service

## Visão geral

O frontend é uma **aplicação React única** organizada em camadas que separam:

1. configuração da LPS;
2. apresentação (Design System + páginas);
3. dados mockados;
4. roteamento.

Não há backend. Toda a variabilidade é resolvida no cliente.

## Camadas

### 1. Types (`src/types`)

Contratos TypeScript: `BusinessConfig`, `FeatureKey`, entidades de domínio (Customer, Appointment, Pet…).

### 2. Config (`src/config`)

- `business/` — presets por segmento (PetCare, Barber Prime, FitLife, Belle Clínica)
- `features/` — catálogo de flags, labels e `isFeatureEnabled`
- `theme/` — tema default + `applyTheme` (CSS variables)
- `navigation.ts` — menu gerado a partir das flags

### 3. Context (`src/context`)

`BusinessConfigProvider` centraliza:

- segmento, nome, módulos, tema, labels, regras de agenda;
- persistência via `storage` (`localStorage`);
- APIs: `applySegmentPreset`, `toggleModule`, `updateTheme`, `updateLabels`…

### 4. Components (`src/components`)

Design System reutilizável. Páginas não reimplementam botões/tabelas/modais.

### 5. Layouts / Pages / Routes

- `AppLayout` = Sidebar dinâmica + Header (modo demo) + `Outlet`
- 13 páginas em `src/pages`
- `FeatureGate` protege seções quando a flag está off
- Auth simulada em `ProtectedRoute`

### 6. Data / Hooks

Mocks em `src/data`. `useMockData` e `useDashboardStats` adaptam conteúdo ao segmento.

## Fluxo

```text
Login (simulado)
  → BusinessConfigProvider (carrega localStorage / Petshop)
    → AppLayout
      → Sidebar (getVisibleNavItems)
      → Página
        → isFeatureEnabled / labels / theme / mocks
```

## Responsabilidades

| Parte | Responsabilidade |
| --- | --- |
| Config | Definir variantes e defaults |
| Context | Estado e persistência da configuração |
| FeatureGate | Barreira de acesso a features off |
| Pages | Orquestrar UI; pouca lógica de domínio |
| Components | UI atômica e composta reutilizável |

## Decisões

- **Um Dashboard, não quatro** — cards via `useDashboardStats`
- **Um Módulo de Segmento** — conteúdo switch por feature/segmento
- **CSS variables** — troca de tema sem CSS-in-JS
- **Sem Redux** — Context + hooks bastam para o protótipo
