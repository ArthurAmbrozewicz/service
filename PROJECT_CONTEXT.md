# PROJECT_CONTEXT — Service

Manual de contexto para continuidade do projeto (humanos ou IAs futuras).

## O que é o projeto

Frontend React (Vite + TypeScript) de uma **Linha de Produto de Software** para gestão e agendamento de negócios de serviços locais. Nome do projeto: **Service**.

## Por que ele existe

Trabalho acadêmico da disciplina **Desenvolvimento Orientado a Reúso de Software — Parte III**. O objetivo pedagógico é tornar **visível** o conceito de LPS: um núcleo reutilizável + pontos de variação configuráveis.

## Qual problema resolve

Evitar reinventar um sistema completo para cada tipo de negócio (barbearia, petshop, academia, clínica), permitindo derivar produtos por **configuração**.

## Qual conceito acadêmico está sendo demonstrado

- Software Product Lines (SPL/LPS)
- Core assets vs. variable features
- Feature Model (mandatory/optional)
- Variation points e variants
- Feature flags / runtime configuration
- Reúso de Design System e páginas

## Como funciona a LPS

1. Existe **um** código-base.  
2. `BusinessConfig` descreve o produto derivado (segmento, módulos, tema, labels, regras).  
3. A UI consulta `isFeatureEnabled` e `config.labels` / `config.theme`.  
4. Presets em `src/config/business` aceleram a demonstração.

## Quais são os Core Assets

- Design System (`src/components`)
- Layout (Sidebar/Header)
- Páginas comuns (Dashboard, Agenda, Clientes, Serviços, Agendamento, Pagamentos, Notificações, Profissionais)
- Context de configuração
- Camada de storage
- Sistema de rotas

## Quais são os Variation Points

Sidebar, Dashboard KPIs, ficha do cliente, módulo de segmento, regras de agenda, pagamentos recorrentes, templates de notificação, tema, labels.

## Quais são os Variants

`petshop`, `barbearia`, `academia`, `estetica` (+ futuros segmentos via preset).

## Como funciona o sistema de configuração

`BusinessConfigProvider` mantém o estado, aplica tema no DOM, persiste em `localStorage` (`service_lps_config`).  
`applySegmentPreset(segment)` clona o preset correspondente.

## Como funciona o Feature Flag

`config.modules[feature]`. Helper `isFeatureEnabled` em `src/config/features` e no Context.  
`FeatureGate` bloqueia UI/rotas quando off.

## Como funciona a arquitetura

Ver `docs/ARCHITECTURE.md`. Resumo: Config → Context → Layout/Pages → Components → Data.

## Como adicionar uma nova feature

Ver `docs/ADDING_FEATURE.md`.

## Como adicionar um novo segmento

Ver `docs/ADDING_SEGMENT.md`.

## Como alterar uma tela

Edite a página em `src/pages/<Nome>`. Prefira composição com Design System e condicionais por flag/segmento.

## Como alterar o Design System

Edite componentes em `src/components` e estilos globais em `src/index.css` (tokens em `:root` / CSS variables).

## Como alterar dados

Arquivos em `src/data/*`. `useMockData` escolhe o subset por segmento.

## Como alterar regras de negócio simuladas

Campo `schedulingRules` nos presets (`src/config/business`) e consumo na página de agendamento.

## Como apresentar o projeto

Siga `docs/DEMO.md`. Mensagem central: **mesmo produto, configuração diferente**.

## Estado inicial

Primeira visita → preset **Petshop (PetCare)**. Auth simulada em `service_lps_auth`.

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Limitações conscientes

Protótipo frontend sem backend; CRUD parcial em memória; ideal para apresentação acadêmica, não para produção real.
