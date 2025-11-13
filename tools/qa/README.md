# 🧪 QA Tools

Herramientas especializadas para testing, quality assurance y automatización de pruebas.

## 📋 Tabla de Contenidos

- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Performance Testing](#performance-testing)
- [API Testing](#api-testing)
- [Visual Testing](#visual-testing)
- [Test Management](#test-management)
- [Code Quality](#code-quality)

## 🔬 Unit Testing

### Jest ⭐⭐⭐
**Nivel:** Esencial (JavaScript/TypeScript)  
**Descripción:** Framework de testing completo para JavaScript

**Instalación:**
```bash
npm install --save-dev jest @types/jest
```

**Casos de Uso:**
- Unit testing
- Snapshot testing
- Mocking
- Code coverage

**Ejemplo:**
```javascript
// sum.test.js
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

**Pros:**
- ✅ Zero config
- ✅ Snapshot testing
- ✅ Built-in mocking
- ✅ Watch mode
- ✅ Code coverage

**Configuración package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Recursos:**
- [Jest Docs](https://jestjs.io/)
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)

---

### Vitest ⭐⭐
**Nivel:** Recomendado (Vite projects)  
**Descripción:** Unit test framework ultra-rápido

**Instalación:**
```bash
npm install -D vitest
```

**Casos de Uso:**
- Unit testing para Vite
- Fast testing
- Jest-compatible API

**Pros:**
- ✅ Extremadamente rápido
- ✅ Compatible con Jest
- ✅ ESM first
- ✅ Watch mode incremental

---

### Pytest ⭐⭐⭐
**Nivel:** Esencial (Python)  
**Descripción:** Framework de testing para Python

**Instalación:**
```bash
pip install pytest pytest-cov
```

**Ejemplo:**
```python
# test_sample.py
def test_addition():
    assert 1 + 1 == 2
```

**Comandos:**
```bash
pytest
pytest --cov=myapp
pytest -v
pytest -k "test_addition"
```

**Pros:**
- ✅ Sintaxis simple
- ✅ Fixtures potentes
- ✅ Parametrización
- ✅ Plugins extensos

---

### JUnit ⭐⭐⭐
**Nivel:** Esencial (Java)  
**Descripción:** Framework de testing para Java

**Instalación:**
```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.9.0</version>
    <scope>test</scope>
</dependency>
```

**Ejemplo:**
```java
@Test
void testAddition() {
    assertEquals(2, 1 + 1);
}
```

---

### Go Testing ⭐⭐⭐
**Nivel:** Esencial (Go)  
**Descripción:** Testing built-in de Go

**Ejemplo:**
```go
// math_test.go
func TestAdd(t *testing.T) {
    result := Add(1, 2)
    if result != 3 {
        t.Errorf("Expected 3, got %d", result)
    }
}
```

**Comandos:**
```bash
go test
go test -v
go test -cover
go test -bench=.
```

## 🔗 Integration Testing

### Supertest ⭐⭐⭐
**Nivel:** Esencial (Node.js)  
**Descripción:** HTTP assertions para testing APIs

**Instalación:**
```bash
npm install --save-dev supertest
```

**Ejemplo:**
```javascript
const request = require('supertest');
const app = require('./app');

describe('GET /users', () => {
  it('responds with json', async () => {
    const response = await request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveLength(10);
  });
});
```

**Casos de Uso:**
- API testing
- Integration tests
- Express/Fastify testing

---

### TestContainers ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Testing con containers Docker

**Instalación:**
```javascript
npm install --save-dev testcontainers
```

**Ejemplo:**
```javascript
const { GenericContainer } = require('testcontainers');

let container;

beforeAll(async () => {
  container = await new GenericContainer('postgres')
    .withExposedPorts(5432)
    .start();
});

afterAll(async () => {
  await container.stop();
});
```

**Casos de Uso:**
- Database testing
- External services
- Integration tests

**Pros:**
- ✅ Real dependencies
- ✅ Isolated tests
- ✅ Reproducible

---

### Spring Boot Test ⭐⭐
**Nivel:** Recomendado (Java/Spring)  
**Descripción:** Testing framework para Spring Boot

**Ejemplo:**
```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldReturnUsers() throws Exception {
        mockMvc.perform(get("/users"))
            .andExpect(status().isOk());
    }
}
```

## 🎭 E2E Testing

### Playwright ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Framework E2E testing moderno

**Instalación:**
```bash
npm init playwright@latest
```

**Ejemplo:**
```javascript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.click('text=Login');
  await expect(page).toHaveURL(/.*login/);
});
```

**Casos de Uso:**
- E2E testing web
- Cross-browser testing
- API testing
- Visual regression

**Pros:**
- ✅ Multi-browser (Chromium, Firefox, WebKit)
- ✅ Auto-waiting
- ✅ Parallelization
- ✅ Screenshots/videos
- ✅ Network interception
- ✅ Trace viewer

**Comandos:**
```bash
npx playwright test
npx playwright test --headed
npx playwright test --debug
npx playwright show-report
```

**Recursos:**
- [Playwright Docs](https://playwright.dev/)
- [Playwright Inspector](https://playwright.dev/docs/inspector)

---

### Cypress ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** E2E testing framework

**Instalación:**
```bash
npm install --save-dev cypress
npx cypress open
```

**Ejemplo:**
```javascript
describe('My First Test', () => {
  it('Visits the app', () => {
    cy.visit('https://example.com')
    cy.contains('Login').click()
    cy.url().should('include', '/login')
  })
})
```

**Casos de Uso:**
- E2E testing
- Component testing
- API testing
- Visual testing

**Pros:**
- ✅ Great DX
- ✅ Time-travel debugging
- ✅ Automatic waiting
- ✅ Real browser testing
- ✅ Screenshots/videos

**Comandos:**
```bash
npx cypress open
npx cypress run
npx cypress run --spec "cypress/e2e/login.cy.js"
```

---

### Selenium ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Browser automation estándar

**Instalación:**
```bash
# Python
pip install selenium

# Node.js
npm install selenium-webdriver
```

**Ejemplo (Python):**
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://example.com")
element = driver.find_element(By.ID, "login")
element.click()
driver.quit()
```

**Casos de Uso:**
- Cross-browser testing
- Legacy support
- Grid testing

**Contras:**
- ❌ Slow
- ❌ Flaky tests
- ❌ Maintenance intensivo

---

### Puppeteer ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Node.js library para Chrome/Chromium

**Instalación:**
```bash
npm install puppeteer
```

**Ejemplo:**
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
```

**Casos de Uso:**
- Chrome automation
- PDF generation
- Scraping
- Screenshots

## ⚡ Performance Testing

### k6 ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Modern load testing tool

**Instalación:**
```bash
brew install k6
```

**Ejemplo:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('https://api.example.com');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

**Comandos:**
```bash
k6 run script.js
k6 run --vus 100 --duration 1m script.js
```

**Casos de Uso:**
- Load testing
- Stress testing
- Spike testing
- Soak testing

**Pros:**
- ✅ JavaScript DSL
- ✅ CLI friendly
- ✅ Cloud integration
- ✅ Thresholds y checks

---

### JMeter ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Apache JMeter performance testing

**Instalación:**
```bash
brew install jmeter
```

**Casos de Uso:**
- Load testing
- Performance testing
- Stress testing
- GUI recorder

**Pros:**
- ✅ GUI interface
- ✅ Mature
- ✅ Plugin ecosystem

**Contras:**
- ❌ Java-based
- ❌ Resource intensive
- ❌ XML configs

---

### Artillery ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Modern load testing toolkit

**Instalación:**
```bash
npm install -g artillery
```

**Ejemplo:**
```yaml
config:
  target: 'https://api.example.com'
  phases:
    - duration: 60
      arrivalRate: 20
scenarios:
  - flow:
      - get:
          url: "/users"
```

**Comandos:**
```bash
artillery run test.yml
artillery quick --count 100 --num 10 https://api.example.com
```

---

### Lighthouse CI ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Performance testing en CI

**Instalación:**
```bash
npm install -g @lhci/cli
```

**Casos de Uso:**
- Performance regression
- CI/CD integration
- Web vitals monitoring

## 🔌 API Testing

### Postman ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** API testing platform

**Casos de Uso:**
- Manual API testing
- Collection testing
- Automated testing
- Mock servers

**Features:**
- ✅ Collection runner
- ✅ Pre/post scripts
- ✅ Environment variables
- ✅ Team collaboration

---

### Insomnia ⭐⭐
**Nivel:** Recomendado  
**Descripción:** API client y testing

**Casos de Uso:**
- API development
- GraphQL testing
- gRPC support

**Pros:**
- ✅ Clean UI
- ✅ GraphQL support
- ✅ Code generation

---

### Pact ⭐⭐
**Nivel:** Especializado  
**Descripción:** Contract testing

**Instalación:**
```bash
npm install --save-dev @pact-foundation/pact
```

**Casos de Uso:**
- Contract testing
- Microservices testing
- Consumer-driven contracts

**Pros:**
- ✅ Contract verification
- ✅ Microservices
- ✅ Prevents breaking changes

## 👁️ Visual Testing

### Percy ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Visual regression testing

**Instalación:**
```bash
npm install --save-dev @percy/cli @percy/playwright
```

**Casos de Uso:**
- Visual regression
- UI change detection
- Cross-browser screenshots

**Pros:**
- ✅ Automatic visual diffing
- ✅ Cross-browser
- ✅ PR integration

---

### Chromatic ⭐⭐
**Nivel:** Recomendado (Storybook)  
**Descripción:** Visual testing para Storybook

**Casos de Uso:**
- Component visual testing
- Storybook integration
- UI review

---

### BackstopJS ⭐
**Nivel:** Especializado  
**Descripción:** Visual regression testing

**Instalación:**
```bash
npm install -g backstopjs
```

**Casos de Uso:**
- Visual regression
- Self-hosted
- Screenshot comparison

## 📊 Test Management

### TestRail ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Test case management

**Casos de Uso:**
- Test case management
- Test planning
- Reporting

---

### Xray ⭐⭐
**Nivel:** Recomendado (Jira)  
**Descripción:** Test management para Jira

**Casos de Uso:**
- Test management en Jira
- Traceability
- Reporting

---

### Allure ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Test reporting framework

**Instalación:**
```bash
npm install --save-dev allure-commandline
```

**Casos de Uso:**
- Beautiful test reports
- Multi-framework support
- Historical trends

## 📏 Code Quality

### SonarQube ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Code quality y security platform

**Instalación:**
```bash
docker run -d -p 9000:9000 sonarqube:community
```

**Casos de Uso:**
- Code quality analysis
- Security vulnerabilities
- Code smells
- Technical debt
- Code coverage

**Pros:**
- ✅ Multi-language
- ✅ Quality gates
- ✅ Security hotspots
- ✅ Trend analysis

**Recursos:**
- [SonarQube Docs](https://docs.sonarqube.org/)

---

### ESLint ⭐⭐⭐
**Nivel:** Esencial (JavaScript)  
**Descripción:** JavaScript linter

**Instalación:**
```bash
npm install --save-dev eslint
npx eslint --init
```

**Casos de Uso:**
- Code quality
- Style enforcement
- Bug prevention

---

### Prettier ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Code formatter

**Instalación:**
```bash
npm install --save-dev prettier
```

**Configuración:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

---

### CodeClimate ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Automated code review

**Casos de Uso:**
- Code quality metrics
- Maintainability index
- Test coverage
- Security analysis

---

### Codecov ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Code coverage reporting

**Instalación:**
```bash
npm install --save-dev codecov
```

**Casos de Uso:**
- Coverage reports
- PR comments
- Trend tracking

## 🎯 Test Automation Best Practices

### Test Pyramid
```
       /\
      /E2E\        ← Few (slow, expensive)
     /______\
    /        \
   /Integration\  ← Some (medium speed/cost)
  /__________\
 /            \
/  Unit Tests  \  ← Many (fast, cheap)
/________________\
```

### Testing Principles

1. **Write Tests First** (TDD)
   - Define expected behavior
   - Write failing test
   - Implement feature
   - Refactor

2. **Keep Tests Independent**
   - No shared state
   - Can run in any order
   - Isolated setup/teardown

3. **Test One Thing**
   - Single assertion per test
   - Clear test names
   - AAA pattern (Arrange, Act, Assert)

4. **Make Tests Fast**
   - Mock external dependencies
   - Parallel execution
   - Optimize test data

5. **Maintainable Tests**
   - Page Object Model (E2E)
   - Test helpers/utilities
   - DRY principle

### Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths
- **E2E Tests**: User journeys

## 📚 Recursos Adicionales

- [Test Automation University](https://testautomationu.applitools.com/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [E2E Testing Best Practices](https://playwright.dev/docs/best-practices)
- [API Testing Best Practices](https://www.postman.com/api-platform/api-testing/)

## 🔗 Links Útiles

- [Tools Collection Home](../README.md)
- [Backend Tools](../backend/README.md)
- [Frontend Tools](../frontend/README.md)
- [DevOps Tools](../devops/README.md)
- [Security Tools](../security/README.md)

---

_QA Tools - Garantizando la calidad de tu software_ 🧪
