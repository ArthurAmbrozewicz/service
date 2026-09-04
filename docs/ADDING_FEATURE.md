# Como adicionar uma nova feature

Exemplo: feature `loyalty` (programa de fidelidade).

## 1. Criar a Feature Flag

Em `src/types/index.ts`, acrescente em `FeatureKey` e em `ModulesConfig`:

```ts
| 'loyalty'
```

```ts
loyalty: boolean;
```

## 2. Registrar no catálogo

Em `src/config/features/index.ts`:

- adicionar em `OPTIONAL_FEATURES`
- adicionar `FEATURE_LABELS` e `FEATURE_DESCRIPTIONS`

## 3. Atualizar presets

Em `src/config/business/index.ts`, definir `loyalty: true/false` em cada preset relevante e no `coreModules`.

## 4. Criar a UI

- Página em `src/pages/...` **ou** seção no `ModuloSegmentoPage`
- Componentes reutilizáveis do Design System

## 5. Registrar rota

Em `src/routes/index.tsx`:

```tsx
<Route path="/fidelidade" element={<FeatureGate feature="loyalty"><LoyaltyPage /></FeatureGate>} />
```

(ou envolver o conteúdo da página com `FeatureGate`).

## 6. Adicionar ao menu

Em `src/config/navigation.ts`, novo item com `feature: 'loyalty'`.

## 7. Dados (opcional)

Criar mock em `src/data` e expor via `useMockData` se necessário.

## 8. Testar

1. Ativar/desativar em `/modulos`  
2. Confirmar Sidebar  
3. Acessar rota com flag off → “Funcionalidade indisponível”  
4. `npm run build`
