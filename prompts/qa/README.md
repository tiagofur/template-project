# 🧪 QA Prompts

Prompts especializados para testing, quality assurance y automatización de pruebas.

## 📋 Categorías

### Unit Testing
- [Unit Test](./unit-test.md) - Tests unitarios efectivos
- [Mock Strategy](./mock-strategy.md) - Estrategia de mocking
- [Test Coverage](./test-coverage.md) - Mejorar cobertura
- [TDD Workflow](./tdd-workflow.md) - Test-Driven Development

### Integration Testing
- [API Integration Test](./api-integration-test.md) - Tests de APIs
- [Database Testing](./database-testing.md) - Tests de base de datos
- [Service Integration](./service-integration.md) - Tests entre servicios

### E2E Testing
- [Playwright Test](./playwright-test.md) - Tests E2E con Playwright
- [Cypress Test](./cypress-test.md) - Tests E2E con Cypress
- [User Flow Test](./user-flow-test.md) - Flujos de usuario completos
- [Visual Regression](./visual-regression.md) - Tests visuales

### Test Automation
- [Test Suite](./test-suite.md) - Suite de tests completa
- [Test Data Factory](./test-data-factory.md) - Factories para datos
- [Test Helpers](./test-helpers.md) - Helpers reutilizables
- [CI Integration](./ci-integration.md) - Integración con CI

### Performance Testing
- [Load Testing](./load-testing.md) - Tests de carga
- [Stress Testing](./stress-testing.md) - Tests de estrés
- [Performance Benchmarks](./performance-benchmarks.md) - Benchmarks

### Quality Assurance
- [QA Checklist](./qa-checklist.md) - Checklist de QA
- [Bug Report Template](./bug-report.md) - Template para bugs
- [Test Plan](./test-plan.md) - Plan de pruebas
- [Acceptance Criteria](./acceptance-criteria.md) - Criterios de aceptación

## 🎯 Guía de Uso

### Stack Soportado

- **Unit:** Jest, Vitest, Mocha, pytest, Go test
- **E2E:** Playwright, Cypress, Selenium, Puppeteer
- **API:** Supertest, Postman, REST Assured
- **Performance:** k6, JMeter, Artillery, Gatling
- **Mobile:** Detox, Appium

### Variables Comunes

- `{{test_type}}`: unit, integration, e2e
- `{{framework}}`: Jest, Playwright, Cypress
- `{{feature}}`: Feature being tested
- `{{test_data}}`: Test data needed

## 💡 Tips Generales

### Testing Best Practices

- AAA pattern (Arrange-Act-Assert)
- Tests independientes
- Nombres descriptivos
- Mock external dependencies
- Test edge cases
- Mantén tests mantenibles

### Test Coverage

- Apunta a >80% coverage
- Cubre casos críticos primero
- No solo busques 100%
- Coverage de branches importante
- Tests de integración críticos

### Test Automation

- Automatiza tests repetitivos
- CI/CD integration
- Fast feedback loops
- Parallel execution
- Resultados claros y accionables

### Quality Gates

- Define métricas claras
- Automated quality checks
- Code review requirements
- Performance benchmarks
- Security scanning

## 📚 Recursos Adicionales

- [Testing Best Practices](../../docs/testing/best-practices.md)
- [QA Best Practices](../../docs/testing/qa-best-practices.md)
- [CI/CD Integration](../../docs/testing/ci-cd-integration.md)
- [Performance Testing](../../docs/testing/performance-testing.md)
- [Security Testing](../../docs/testing/security-testing.md)

---

_QA Prompts - Asegurando calidad en cada release_ 🧪
