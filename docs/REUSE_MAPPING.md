# Mapeamento de reúso — Service

| Ativo | Tipo | Reutilização |
| --- | --- | --- |
| Design System | Core | Todos os segmentos |
| AppLayout / Sidebar / Header | Core | Todos os segmentos |
| Dashboard (página) | Core + VP | Todos (cards variáveis) |
| Agenda / CalendarView | Core | Todos os segmentos |
| Cadastro de clientes | Core + VP | Todos (ficha variável) |
| Serviços | Core | Todos (catálogo por segmento nos dados) |
| Agendamento | Core + VP | Regras por `schedulingRules` |
| Pagamentos | Core + VP | Recorrência quando flag ativa |
| Notificações | Core + VP | Templates por segmento |
| Profissionais e acessos | Core | Todos |
| Feature Flags / Context | Core | Todos |
| Personalização | Core | Todos |
| Ficha Pet | Variant | Petshop |
| Vacinação | Variant | Petshop |
| Planos recorrentes | Variant | Academia |
| Frequência | Variant | Academia |
| Anamnese | Variant | Clínica de estética |
| Avaliações | Variant | Barbearia (e outros com flag) |
| Presets de segmento | Config | Produto derivado por configuração |
| Mocks por segmento | Data | Apoio à demonstração |

## Como cada ativo é reutilizado

- **Core assets** são importados pelas páginas independentemente do segmento.  
- **Variation points** leem `BusinessConfig` / `isFeatureEnabled`.  
- **Variants** são presets + módulos opcionais + dados associados, não forks do código.

Isso materializa o princípio acadêmico: **reúso sistemático com gerenciamento explícito de variabilidade**.
