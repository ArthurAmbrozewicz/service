# Feature Model — Service

```text
Service (Sistema)
│
├── Autenticação [M]
├── Dashboard [M]
├── Clientes [M]
├── Serviços [M]
├── Agendamento [M]
│   └── Regras de agendamento [M] (duração, intervalo, lista de espera…)
├── Profissionais [M]
├── Pagamentos [M]
│   └── Pagamento recorrente [O]  ← requer Planos Recorrentes
├── Notificações [M]
├── Histórico [M]
├── Personalização [M/O]  (presente no core; pode ser desligada na demo)
│
├── Avaliações [O]
├── Ficha Pet [O]
│   └── Vacinação [O]  ← recomendada com Ficha Pet
├── Anamnese [O]
├── Planos Recorrentes [O]
│   └── Controle de Frequência [O]
└── Pacotes [O]
```

Legenda: **M** = Mandatory · **O** = Optional

## Dependências

| Feature | Depende de | Observação |
| --- | --- | --- |
| Vacinação | Ficha Pet (recomendado) | Menu específico no Petshop |
| Frequência | Planos Recorrentes | Segmento Academia |
| Pagamento recorrente | Planos Recorrentes | Opção no formulário financeiro |
| Seleção de pet no agendamento | Ficha Pet + `schedulingRules.requirePetSelection` | Petshop |
| Hint de anamnese no agendamento | Anamnese + regra da clínica | Estética |

## Binding

Neste protótipo, a seleção de features ocorre em **tempo de execução** (configuração + `localStorage`), ideal para demonstração acadêmica sem rebuild.

## Presets de segmento

| Segmento | Opcionais típicas |
| --- | --- |
| Petshop | Ficha Pet, Vacinação, Avaliações, Pacotes |
| Barbearia | Avaliações, Pacotes |
| Academia | Planos, Frequência, Pacotes |
| Clínica de Estética | Anamnese, Avaliações, Pacotes |
