# Variabilidade — Service

## Pontos de variação (Variation Points)

| Ponto | O que muda |
| --- | --- |
| Sidebar | Itens do menu conforme flags |
| Dashboard | Conjunto de KPIs por segmento |
| Ficha do cliente | Blocos Pet / Plano / Anamnese / Preferências |
| Módulo do segmento | Pets, Planos, Anamnese ou Avaliações |
| Agendamento | Regras (`schedulingRules`) e campos extras |
| Pagamentos | Filtro recorrente / mensalidade |
| Notificações | Templates por segmento |
| Tema | Cores primária/secundária/accent |
| Labels | Cliente→Tutor/Paciente/Aluno etc. |

## Variantes

- `petshop`
- `barbearia`
- `academia`
- `estetica`

Definidas em `src/config/business`.

## Feature Flags

```ts
isFeatureEnabled('petProfile')
```

Fonte da verdade: `config.modules` no Context.  
UI: toggles em `/modulos`.

## Personalização

Além de módulos, a LPS permite:

- nome e iniciais do logo;
- cores;
- nomenclatura de entidades.

Isso mostra que a variabilidade não é só “lista de features”, mas também **apresentação e linguagem do domínio**.

## Como demonstrar

1. Preset Petshop → Ficha Pet + Vacinação no menu  
2. Preset Barbearia → itens somem; Avaliações permanecem  
3. Desativar Avaliações em Módulos → some do menu  
4. Alterar label “Cliente” → refletido na listagem e formulários  

Roteiro completo: [`DEMO.md`](DEMO.md).
