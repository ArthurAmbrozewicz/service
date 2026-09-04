# Service

**Sistema de Agendamento e Gestão para Negócios de Serviços Locais**  
Linha de Produto de Software (LPS) — protótipo frontend acadêmico.

## 1. Nome do projeto

**Service** — plataforma configurável de gestão para negócios de serviços locais (barbearias, petshops, academias, clínicas de estética e similares).

## 2. Contexto acadêmico

Projeto da disciplina **Desenvolvimento Orientado a Reúso de Software — Parte III**.  
O foco não é apenas “criar telas”, e sim demonstrar **reúso + variabilidade** em uma LPS: um único produto adaptável a diferentes segmentos.

## 3. Problema

Negócios de serviços locais compartilham necessidades (clientes, agenda, serviços, pagamentos), mas cada segmento exige módulos específicos (ficha do pet, anamnese, planos recorrentes). Desenvolver um sistema do zero para cada cliente é custoso e pouco reutilizável.

## 4. Objetivo

Entregar um **protótipo frontend completo** que:

- reutilize um núcleo comum (core assets);
- permita configurar variantes por segmento;
- habilite/desabilite módulos via feature flags;
- personalize tema e labels;
- funcione 100% localmente, sem backend.

## 5. Conceito de LPS

```text
                 UM ÚNICO PRODUTO
                        │
                        ▼
               ┌─────────────────┐
               │  CORE REUTILIZÁVEL │
               └────────┬────────┘
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
         PETSHOP    BARBEARIA   ACADEMIA / CLÍNICA
             │          │          │
          variantes  variantes  variantes
```

## 6. Reutilização

- **Design System** único (`Button`, `Card`, `Table`, `Modal`, etc.)
- **Layout** único (`AppLayout`, `Sidebar`, `Header`)
- **Páginas** únicas (ex.: `DashboardPage`, `ClientesPage`) que mudam por configuração
- **Dados mockados** por segmento, consumidos pelos mesmos componentes

## 7. Variabilidade

A interface muda de verdade (menu, cards, campos, regras), não apenas os nomes dos serviços.

Exemplos:

| Configuração | Visível |
| --- | --- |
| Petshop | Ficha do Pet, Vacinação |
| Barbearia | Avaliações (sem Pet/Vacinação) |
| Academia | Planos, Frequência, pagamentos recorrentes |
| Clínica | Anamnese, labels “Paciente/Especialista” |

## 8. Features comuns (Mandatory)

Agendamentos, Clientes, Serviços, Profissionais, Pagamentos, Notificações, Histórico, Personalização, Dashboard.

## 9. Features variáveis (Optional)

Avaliações, Ficha do Pet, Vacinação, Anamnese, Planos Recorrentes, Pacotes, Controle de Frequência.

## 10. Tecnologias

- React 19 + TypeScript
- Vite 8
- React Router 7
- Lucide React
- CSS moderno com variáveis (tema dinâmico)
- Persistência em `localStorage`

## 11. Arquitetura

Camadas principais:

1. **Config** (`src/config`) — segmentos, features, tema, navegação  
2. **Context** (`BusinessConfigProvider`) — estado global da LPS  
3. **Components** — Design System reutilizável  
4. **Pages** — 13 telas  
5. **Data** — mocks locais  
6. **Routes** — rotas + proteção de autenticação simulada + FeatureGate

Detalhes em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 12. Estrutura de pastas

```text
src/
├── components/     # Design System
├── config/         # business, features, theme, navigation
├── context/        # BusinessConfig
├── data/           # mocks
├── hooks/
├── layouts/
├── pages/          # 13 telas
├── routes/
├── types/
└── utils/
docs/               # documentação acadêmica e de evolução
```

## 13. Como instalar

```bash
npm install
```

## 14. Como executar

```bash
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## 15. Como trocar o segmento

1. No **header**, abra **Modo de Demonstração** e escolha o preset; ou  
2. Em **Módulos**, altere o select/botões de segmento.

A troca atualiza nome, tema, menu, dashboard, labels e módulos **sem recarregar a página**.

## 16. Como ativar/desativar módulos

Tela **Módulos e Funcionalidades** (`/modulos`): toggles das features opcionais.  
Efeitos: item some da Sidebar, rota protegida por `FeatureGate`, cards/campos relacionados ocultos.

## 17. Como alterar tema

Tela **Personalização** (`/personalizacao`) ou ao aplicar um preset de segmento.  
Cores vão para CSS variables (`--color-primary`, etc.).

## 18. Como adicionar uma nova feature

Guia passo a passo: [`docs/ADDING_FEATURE.md`](docs/ADDING_FEATURE.md).

## 19. Como adicionar um novo segmento

Guia passo a passo: [`docs/ADDING_SEGMENT.md`](docs/ADDING_SEGMENT.md).

## 20. Como alterar componentes

Edite apenas em `src/components/`. Páginas devem consumir o Design System — evite duplicar botões/tabelas/modais.

## 21. Como alterar dados mockados

Arquivos em `src/data/`. O hook `useMockData` seleciona o conjunto conforme o segmento.

## 22. Como funciona o Feature Flag

```ts
const { isFeatureEnabled } = useBusinessConfig();
isFeatureEnabled('petProfile');
```

Implementação em `src/config/features` + `modules` dentro de `BusinessConfig`.  
Uso típico: Sidebar, `FeatureGate`, Dashboard, ficha do cliente.

## 23. Limitações do protótipo

- Sem backend, API ou banco real  
- Autenticação simulada  
- CRUD em memória (alguns efeitos só na sessão)  
- Notificações/pagamentos são simulações de UI  
- Sem PWA/offline avançado além de localStorage da configuração

## 24. Relação com a Parte III da disciplina

Este projeto evidencia:

- **Core assets** reutilizáveis  
- **Variation points** explícitos  
- **Variants** por segmento  
- **Feature Model** documentado  
- Configuração em tempo de demonstração (bound binding / runtime configuration)

Documentação complementar:

- [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md)
- [`docs/FEATURE_MODEL.md`](docs/FEATURE_MODEL.md)
- [`docs/VARIABILITY.md`](docs/VARIABILITY.md)
- [`docs/REUSE_MAPPING.md`](docs/REUSE_MAPPING.md)
- [`docs/DEMO.md`](docs/DEMO.md)
