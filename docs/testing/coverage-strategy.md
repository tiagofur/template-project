# 📊 Coverage Strategy

Estrategia completa de cobertura de código y objetivos de testing para el proyecto.

## 🎯 Objetivos de Cobertura

### Metas Generales

| Métrica | Target | Mínimo Aceptable | Descripción |
|---------|--------|------------------|-------------|
| **Line Coverage** | 85% | 80% | Porcentaje de líneas ejecutadas |
| **Branch Coverage** | 80% | 75% | Porcentaje de branches (if/else) cubiertos |
| **Function Coverage** | 85% | 80% | Porcentaje de funciones ejecutadas |
| **Statement Coverage** | 85% | 80% | Porcentaje de statements ejecutados |

### Metas por Tipo de Código

| Tipo de Código | Target | Justificación |
|----------------|--------|---------------|
| **Utils/Helpers** | 95% | Código reutilizable, crítico para múltiples features |
| **Business Logic** | 90% | Lógica core del negocio, alto impacto |
| **Components** | 85% | UI components, balance entre cobertura y mantenimiento |
| **API Routes** | 90% | Endpoints públicos, críticos para funcionamiento |
| **Services** | 85% | Servicios de negocio, integración con externos |
| **Config/Setup** | 60% | Configuración, menor criticidad |

## 📐 Test Pyramid Strategy

### Distribución Óptima

```
         /\
        /E2E\       10% (100-150 tests)
       /------\     
      /  INT   \    20% (200-300 tests)
     /----------\   
    /    UNIT    \  70% (700-1000 tests)
   /--------------\ 
```

### Justificación

**70% Unit Tests**
- Rápidos de ejecutar (< 30 segundos total)
- Fáciles de mantener
- Feedback inmediato
- Bajo costo de CI/CD

**20% Integration Tests**
- Validan integración entre componentes
- Detectan problemas de interfaces
- Moderadamente rápidos (< 5 minutos)
- Balance costo/beneficio óptimo

**10% E2E Tests**
- Validan flujos críticos completos
- Alta confianza en funcionamiento
- Lentos de ejecutar (< 15 minutos)
- Alto costo de mantenimiento

## 🎯 Coverage por Módulo

### Frontend Components

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!src/components/**/*.stories.{ts,tsx}',
    '!src/components/**/index.{ts,tsx}'
  ],
  coverageThreshold: {
    './src/components/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
};
```

**Prioridades:**
1. **Critical Components** (95%+): Auth, Payment, Checkout
2. **Common Components** (85%+): Forms, Buttons, Modals
3. **Layout Components** (75%+): Headers, Footers, Navigation
4. **Presentational** (70%+): Cards, Lists, Display components

### Backend Services

```javascript
// Coverage targets
coverageThreshold: {
  './src/services/auth/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  },
  './src/services/payment/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  },
  './src/services/': {
    branches: 85,
    functions: 85,
    lines: 85,
    statements: 85
  }
}
```

**Prioridades:**
1. **Security Services** (95%+): Auth, Encryption, Validation
2. **Business Logic** (90%+): Orders, Payments, Inventory
3. **Integration Services** (85%+): Email, Notifications, External APIs
4. **Utility Services** (80%+): Logging, Caching, Formatting

### API Endpoints

```javascript
coverageThreshold: {
  './src/api/routes/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  }
}
```

**Cobertura requerida:**
- ✅ Happy paths (200, 201 responses)
- ✅ Validation errors (400 responses)
- ✅ Authentication errors (401, 403)
- ✅ Not found errors (404)
- ✅ Server errors (500)
- ✅ Rate limiting
- ✅ Input sanitization

## 📊 Métricas y Tracking

### Dashboard de Cobertura

```markdown
## Coverage Dashboard - [Date]

### Overall Coverage
┌─────────────┬─────────┬────────┬─────────┐
│ Metric      │ Current │ Target │ Status  │
├─────────────┼─────────┼────────┼─────────┤
│ Lines       │ 87.2%   │ 85%    │ ✅ Pass │
│ Branches    │ 82.5%   │ 80%    │ ✅ Pass │
│ Functions   │ 89.1%   │ 85%    │ ✅ Pass │
│ Statements  │ 87.8%   │ 85%    │ ✅ Pass │
└─────────────┴─────────┴────────┴─────────┘

### Coverage by Module
┌──────────────┬─────────┬────────┬─────────┐
│ Module       │ Current │ Target │ Status  │
├──────────────┼─────────┼────────┼─────────┤
│ Components   │ 88.5%   │ 85%    │ ✅ Pass │
│ Services     │ 91.2%   │ 85%    │ ✅ Pass │
│ Utils        │ 96.3%   │ 95%    │ ✅ Pass │
│ API Routes   │ 92.1%   │ 90%    │ ✅ Pass │
│ Hooks        │ 84.7%   │ 85%    │ ⚠️ Warn │
└──────────────┴─────────┴────────┴─────────┘
```

### Trend Analysis

```markdown
## Coverage Trend (Last 4 Weeks)

Week 1: 82.3% ████████░░
Week 2: 84.1% █████████░
Week 3: 85.8% █████████░
Week 4: 87.2% █████████░  📈 +4.9%

Trend: ⬆️ Increasing
Goal Achievement: On Track ✅
```

## 🔍 Gap Analysis

### Identificar Gaps de Cobertura

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html

# Find uncovered lines
npm run test:coverage -- --coverage-uncovered
```

### Priorización de Gaps

**Nivel 1 - Crítico** (Implementar inmediatamente)
- [ ] Código de autenticación sin cobertura
- [ ] Lógica de pagos sin tests
- [ ] Validaciones de seguridad no testeadas
- [ ] Manejo de errores críticos

**Nivel 2 - Alto** (Implementar este sprint)
- [ ] Business logic principal < 85%
- [ ] API endpoints críticos < 90%
- [ ] Servicios de integración < 85%

**Nivel 3 - Medio** (Implementar próximo sprint)
- [ ] Components comunes < 85%
- [ ] Utility functions < 95%
- [ ] Hooks personalizados < 85%

**Nivel 4 - Bajo** (Backlog)
- [ ] Components presentacionales < 70%
- [ ] Configuración y setup < 60%
- [ ] Scripts de desarrollo

## 📈 Plan de Mejora Incremental

### Fase 1: Foundation (Semanas 1-2)

**Objetivo:** Alcanzar 75% de cobertura general

```markdown
- [ ] Setup de herramientas de coverage
- [ ] Configurar thresholds en CI/CD
- [ ] Testear utils y helpers críticos
- [ ] Cobertura básica de servicios principales
- [ ] Tests de API endpoints críticos
```

### Fase 2: Consolidation (Semanas 3-4)

**Objetivo:** Alcanzar 85% de cobertura general

```markdown
- [ ] Aumentar cobertura de components al 85%
- [ ] Completar tests de todos los services
- [ ] 100% cobertura de utils/helpers
- [ ] Integration tests de flujos principales
- [ ] E2E tests de user journeys críticos
```

### Fase 3: Excellence (Semanas 5-6)

**Objetivo:** Superar 85%, optimizar calidad

```markdown
- [ ] Refactorizar tests duplicados
- [ ] Mejorar assertions y edge cases
- [ ] Performance optimization de tests
- [ ] Documentación de patrones de testing
- [ ] Training al equipo
```

## 🚀 Automation

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npm run test:changed -- --coverage --bail
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Run tests with coverage
  run: npm run test:coverage
  
- name: Check coverage thresholds
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 85" | bc -l) )); then
      echo "Coverage $COVERAGE% is below 85%"
      exit 1
    fi

- name: Upload to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    fail_ci_if_error: true
```

### Coverage Reports

```yaml
- name: Comment PR with coverage
  uses: romeovs/lcov-reporter-action@v0.3.1
  with:
    lcov-file: ./coverage/lcov.info
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 📋 Exclusiones Justificadas

### Archivos Excluidos

```javascript
// jest.config.js
coveragePathIgnorePatterns: [
  '/node_modules/',
  '/dist/',
  '/coverage/',
  '/__tests__/',
  '/__mocks__/',
  '\\.stories\\.(ts|tsx|js|jsx)$',
  '\\.config\\.(ts|js)$',
  '/migrations/',
  '/seeds/'
]
```

### Código No Testeable

```typescript
// Excluir con comentarios justificados
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  // Debug code, no production impact
  console.log('Debug info:', data);
}

/* istanbul ignore next */
export default hot(module)(App); // Hot reload, dev only
```

## 🎯 Quality Gates

### Definición de Gates

```yaml
quality_gates:
  # Cobertura mínima para merge
  minimum_coverage: 85%
  
  # No se permiten decrementos
  coverage_decrease: 0%
  
  # Nuevos archivos deben tener cobertura
  new_files_coverage: 90%
  
  # Branch coverage crítico
  branch_coverage: 80%
```

### Enforcement en CI/CD

```yaml
- name: Quality Gate
  run: |
    # Check overall coverage
    TOTAL=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$TOTAL < 85" | bc -l) )); then
      echo "❌ Total coverage $TOTAL% < 85%"
      exit 1
    fi
    
    # Check new files coverage
    NEW_FILES=$(git diff --name-only origin/main...HEAD | grep -E '\.(ts|tsx|js|jsx)$')
    for FILE in $NEW_FILES; do
      COVERAGE=$(cat coverage/coverage-summary.json | jq ".\"$FILE\".lines.pct")
      if (( $(echo "$COVERAGE < 90" | bc -l) )); then
        echo "❌ New file $FILE has $COVERAGE% < 90%"
        exit 1
      fi
    done
    
    echo "✅ All quality gates passed"
```

## 📊 Reportes

### Weekly Coverage Report

```markdown
# Coverage Report - Week [Number]

## Summary
- Total Coverage: 87.2% (+2.1% from last week)
- New Tests Added: 45
- Files with 100% Coverage: 23
- Files Below Target: 5

## Top Improvements
1. auth-service.ts: 78% → 92% (+14%)
2. payment-handler.ts: 82% → 90% (+8%)
3. user-validator.ts: 88% → 95% (+7%)

## Needs Attention
1. legacy-utils.ts: 45% (Target: 95%)
2. old-api-handler.ts: 52% (Target: 90%)
3. deprecated-service.ts: 38% (Target: 85%)

## Action Items
- [ ] Refactor legacy-utils.ts and add tests
- [ ] Schedule old-api-handler.ts deprecation
- [ ] Plan migration from deprecated-service.ts
```

## 📚 Resources

- [Istanbul Coverage Documentation](https://istanbul.js.org/)
- [Codecov Best Practices](https://docs.codecov.com/docs)
- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#collectcoverage-boolean)

---

_Coverage Strategy - Maximizando calidad con métricas claras_ 📊
