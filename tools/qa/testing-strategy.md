# 🧪 Testing Strategy Guide

Estrategia completa de testing para garantizar la calidad del software en todos los niveles.

## 📋 Tabla de Contenidos

- [Test Pyramid](#test-pyramid)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)

## 🔺 Test Pyramid

```
         ┌─────────────┐
        ╱   Manual     ╲     ← 5% - Exploratory testing
       ╱   Testing      ╲
      ├─────────────────┤
     ╱                   ╲
    ╱    E2E Testing      ╲   ← 10% - Critical user journeys
   ╱                       ╲
  ├─────────────────────────┤
 ╱                           ╲
╱   Integration Testing       ╲  ← 20% - API, DB, services
├───────────────────────────────┤
│                               │
│      Unit Testing             │  ← 70% - Functions, components
│                               │
└───────────────────────────────┘
```

### Distribución Recomendada

| Tipo | Porcentaje | Velocidad | Costo | Confiabilidad |
|------|-----------|-----------|-------|---------------|
| Unit | 70% | ⚡⚡⚡ | 💰 | ⭐⭐ |
| Integration | 20% | ⚡⚡ | 💰💰 | ⭐⭐⭐ |
| E2E | 10% | ⚡ | 💰💰💰 | ⭐⭐⭐⭐ |

## 🔬 Unit Testing

### Qué Testear

✅ **Sí testear:**
- Pure functions
- Business logic
- Utility functions
- Validators
- Formatters
- React components (comportamiento)
- Custom hooks

❌ **No testear:**
- Third-party libraries
- External APIs (usar mocks)
- Configuración simple
- Constants/enums
- Tipos TypeScript

### Ejemplos por Framework

#### Jest (JavaScript/TypeScript)

```typescript
// utils/calculator.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// utils/calculator.test.ts
import { add, divide } from './calculator';

describe('Calculator', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});
```

#### Pytest (Python)

```python
# utils/calculator.py
def add(a: int, b: int) -> int:
    return a + b

def divide(a: int, b: int) -> float:
    if b == 0:
        raise ValueError("Division by zero")
    return a / b

# tests/test_calculator.py
import pytest
from utils.calculator import add, divide

class TestCalculator:
    def test_add_positive_numbers(self):
        assert add(2, 3) == 5

    def test_add_negative_numbers(self):
        assert add(-2, -3) == -5

    def test_divide(self):
        assert divide(10, 2) == 5

    def test_divide_by_zero(self):
        with pytest.raises(ValueError, match="Division by zero"):
            divide(10, 0)

    @pytest.mark.parametrize("a,b,expected", [
        (2, 3, 5),
        (0, 5, 5),
        (-2, -3, -5),
        (100, -50, 50),
    ])
    def test_add_parametrized(self, a, b, expected):
        assert add(a, b) == expected
```

#### React Testing Library

```typescript
// components/Counter.tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// components/Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('renders initial count', () => {
    render(<Counter />);
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });

  it('increments count when clicking increment', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    await user.click(screen.getByRole('button', { name: /increment/i }));
    
    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });

  it('decrements count when clicking decrement', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    await user.click(screen.getByRole('button', { name: /decrement/i }));
    
    expect(screen.getByText(/count: -1/i)).toBeInTheDocument();
  });

  it('resets count to zero', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    await user.click(screen.getByRole('button', { name: /increment/i }));
    await user.click(screen.getByRole('button', { name: /reset/i }));
    
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });
});
```

### Mocking

```typescript
// services/api.ts
export async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// services/api.test.ts
import { fetchUser } from './api';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('fetches user successfully', async () => {
    const mockUser = { id: '1', name: 'John' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockUser,
    });

    const user = await fetchUser('1');

    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(user).toEqual(mockUser);
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchUser('1')).rejects.toThrow('Network error');
  });
});
```

## 🔗 Integration Testing

### Qué Testear

- Interacción entre módulos
- Llamadas a bases de datos
- APIs externas (con test doubles)
- File system operations
- Authentication flows

### Supertest (API Testing - Node.js)

```typescript
// app.ts
import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  res.status(201).json({ id: '1', name, email });
});

export default app;

// app.test.ts
import request from 'supertest';
import app from './app';

describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john@example.com' })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
    });
    expect(response.body.id).toBeDefined();
  });

  it('returns 400 when missing required fields', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'John Doe' })
      .expect(400);
  });
});
```

### Database Integration Tests

```typescript
// Using TestContainers
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Client } from 'pg';

describe('Database Integration', () => {
  let container: StartedTestContainer;
  let client: Client;

  beforeAll(async () => {
    // Start PostgreSQL container
    container = await new GenericContainer('postgres:15')
      .withEnvironment({ POSTGRES_PASSWORD: 'test' })
      .withExposedPorts(5432)
      .start();

    client = new Client({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      user: 'postgres',
      password: 'test',
      database: 'postgres',
    });

    await client.connect();
  });

  afterAll(async () => {
    await client.end();
    await container.stop();
  });

  it('creates and retrieves a user', async () => {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
      )
    `);

    await client.query('INSERT INTO users (name) VALUES ($1)', ['John']);
    
    const result = await client.query('SELECT * FROM users WHERE name = $1', ['John']);
    
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].name).toBe('John');
  });
});
```

## 🎭 E2E Testing

### Playwright (Recomendado)

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('successful login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toContainText(
      'Invalid credentials'
    );
  });

  test('validates required fields', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');

    await expect(page.locator('input[name="email"]:invalid')).toBeVisible();
    await expect(page.locator('input[name="password"]:invalid')).toBeVisible();
  });
});
```

### User Journeys Críticos

```typescript
test.describe('E-commerce Critical Path', () => {
  test('complete purchase flow', async ({ page }) => {
    // 1. Browse products
    await page.goto('/products');
    await expect(page.locator('.product-card')).toHaveCount.greaterThan(0);

    // 2. Add to cart
    await page.click('.product-card:first-child .add-to-cart');
    await expect(page.locator('.cart-badge')).toContainText('1');

    // 3. Go to cart
    await page.click('[data-testid="cart-button"]');
    await expect(page).toHaveURL('/cart');

    // 4. Proceed to checkout
    await page.click('button:has-text("Checkout")');
    await expect(page).toHaveURL('/checkout');

    // 5. Fill shipping info
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'New York');
    await page.fill('[name="zip"]', '10001');

    // 6. Complete purchase
    await page.click('button:has-text("Place Order")');
    
    // 7. Verify success
    await expect(page).toHaveURL(/\/order\/\d+/);
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

## ⚡ Performance Testing

### k6 Load Testing

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Spike to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
    errors: ['rate<0.1'],
  },
};

export default function () {
  const response = http.get('https://api.example.com/users');
  
  const result = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!result);
  sleep(1);
}
```

### Lighthouse Performance Testing

```javascript
// lighthouse-test.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  const score = runnerResult.lhr.categories.performance.score * 100;

  await chrome.kill();

  if (score < 90) {
    throw new Error(`Performance score ${score} is below threshold 90`);
  }

  return score;
}

runLighthouse('https://example.com');
```

## 🔒 Security Testing

### Dependency Scanning

```bash
# npm audit
npm audit --audit-level=moderate

# Snyk
snyk test
snyk monitor

# OWASP Dependency Check
dependency-check --project myapp --scan .
```

### SAST (Static Analysis)

```bash
# Semgrep
semgrep --config=auto .

# SonarQube
sonar-scanner \
  -Dsonar.projectKey=myapp \
  -Dsonar.sources=./src \
  -Dsonar.host.url=http://localhost:9000
```

### DAST (Dynamic Analysis)

```bash
# OWASP ZAP Baseline Scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://example.com \
  -r report.html
```

## 📊 Test Coverage

### Coverage Goals

| Tipo de Código | Target | Mínimo |
|----------------|--------|--------|
| Business Logic | 90%+ | 80% |
| API Routes | 80%+ | 70% |
| UI Components | 70%+ | 60% |
| Utilities | 90%+ | 80% |
| Overall | 80%+ | 70% |

### Configuración de Coverage

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/index.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './src/services/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## ✅ Best Practices

### 1. Arrange-Act-Assert (AAA)

```typescript
test('user can update profile', () => {
  // Arrange
  const user = createUser({ name: 'John' });
  const newName = 'Jane';

  // Act
  const updatedUser = updateUser(user, { name: newName });

  // Assert
  expect(updatedUser.name).toBe(newName);
});
```

### 2. Test Naming

```typescript
// ❌ Bad
test('test1', () => { ... });

// ✅ Good
test('should calculate total price including tax', () => { ... });

// ✅ Better
describe('calculateTotal', () => {
  describe('when tax is applied', () => {
    it('should include tax in the total', () => { ... });
  });
});
```

### 3. Avoid Test Interdependence

```typescript
// ❌ Bad - Tests depend on each other
let user;

test('creates user', () => {
  user = createUser();
});

test('updates user', () => {
  updateUser(user);
});

// ✅ Good - Independent tests
test('creates user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});

test('updates user', () => {
  const user = createUser();
  const updated = updateUser(user);
  expect(updated).toBeDefined();
});
```

### 4. Test Data Builders

```typescript
// test/builders/user.builder.ts
export class UserBuilder {
  private user = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
  };

  withName(name: string) {
    this.user.name = name;
    return this;
  }

  withEmail(email: string) {
    this.user.email = email;
    return this;
  }

  asAdmin() {
    this.user.role = 'admin';
    return this;
  }

  build() {
    return { ...this.user };
  }
}

// Usage
test('admin can delete users', () => {
  const admin = new UserBuilder().asAdmin().build();
  expect(canDeleteUsers(admin)).toBe(true);
});
```

### 5. Continuous Testing

```yaml
# CI/CD Pipeline
- Run unit tests on every commit
- Run integration tests on PR
- Run E2E tests before deploy
- Monitor test performance
- Track flaky tests
```

## 📚 Recursos

- [QA Tools](./README.md)
- [Best Practices](../BEST_PRACTICES.md)
- [Testing Library Docs](https://testing-library.com/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [k6 Documentation](https://k6.io/docs/)

---

_Testing Strategy - Garantizando calidad en cada línea de código_ 🧪
