# Componentes reutilizáveis

| Componente | Uso |
| --- | --- |
| `Button` | Ações primárias/secundárias/ghost/danger |
| `Card` | Container de conteúdo |
| `Badge` | Status e tags |
| `Input` / `Select` / `Textarea` | Formulários |
| `Toggle` | Feature flags e switches |
| `Modal` | Criação/edição/confirmação |
| `Table` | Listagens responsivas |
| `StatCard` / `StatGrid` | KPIs do dashboard |
| `CalendarView` | Agenda dia/semana |
| `PageHeader` | Título + ações da página |
| `EmptyState` | Estados vazios / feature off |
| `Sidebar` | Navegação dinâmica |
| `Header` | Modo de demonstração + logout |
| `FeatureGate` | Proteção por feature flag |

## Princípio

Novas telas devem **compor** esses componentes. Evite criar `PetshopButton` / `BarbeariaTable`.  
A variação deve vir da configuração, não da duplicação de UI.
