# E2E Test with Playwright

**Categoría:** QA  
**Nivel:** Intermedio  
**Tecnologías:** Playwright, TypeScript

## Objetivo

Crear tests end-to-end completos usando Playwright para validar flujos críticos de usuario en aplicaciones web.

## Contexto

Este prompt genera tests E2E robustos con Playwright. Incluye page objects, manejo de estados, esperas apropiadas y reportes detallados.

## Prompt

```
Crea tests E2E usando Playwright para el flujo de {{feature}}.

Requisitos:

1. Estructura del test:
   - Page Object Model para reutilización
   - Fixtures para setup/teardown
   - Test data factories
   - Helper functions

2. Flujo a probar:
   {{describe_user_flow}}

3. Validaciones:
   - Estado inicial correcto
   - Navegación funcional
   - Validaciones de formularios
   - Mensajes de error/éxito
   - Estado final esperado

4. Best practices:
   - Esperas apropiadas (no hardcoded sleeps)
   - Selectors estables (data-testid preferido)
   - Tests independientes
   - Cleanup apropiado
   - Screenshots en failures

5. Configuración:
   - Múltiples browsers (Chromium, Firefox, WebKit)
   - Diferentes viewports (desktop, tablet, mobile)
   - Parallel execution
   - Retry en flaky tests

6. Reportes:
   - HTML reporter con screenshots
   - Video recording en failures
   - Trace recording para debugging
   - JUnit reporter para CI

7. Incluir:
   - playwright.config.ts configurado
   - Page objects
   - Test fixtures
   - Helper utilities
   - Tests specs

Base URL: {{base_url}}
```

## Ejemplo de Uso

### Variables:
- `{{feature}}`: "user authentication"
- `{{describe_user_flow}}`: "Usuario visita login, ingresa credenciales, se autentica, ve dashboard, y hace logout"
- `{{base_url}}`: "http://localhost:3000"

## Resultados Esperados

### Playwright Config

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Page Objects

```typescript
// pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}

// pages/dashboard.page.ts
import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;
  readonly userMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('[data-testid="welcome-message"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.userMenu = page.locator('[data-testid="user-menu"]');
  }

  async isLoaded(): Promise<boolean> {
    return await this.welcomeMessage.isVisible();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  async getWelcomeText(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }
}
```

### Test Fixtures

```typescript
// fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
```

### Test Spec

```typescript
// tests/auth/login.spec.ts
import { test, expect } from '../fixtures/test-fixtures';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and local storage
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('should login successfully with valid credentials', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('user@example.com', 'password123');

    // Assert
    await expect(dashboardPage.page).toHaveURL('/dashboard');
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    const welcomeText = await dashboardPage.getWelcomeText();
    expect(welcomeText).toContain('Welcome');
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Invalid credentials');
    await expect(loginPage.page).toHaveURL('/login');
  });

  test('should validate required fields', async ({ loginPage }) => {
    // Arrange
    await loginPage.goto();

    // Act - try to login without filling fields
    await loginPage.loginButton.click();

    // Assert - HTML5 validation should prevent submission
    await expect(loginPage.emailInput).toHaveAttribute('required');
    await expect(loginPage.passwordInput).toHaveAttribute('required');
  });

  test('should logout successfully', async ({ loginPage, dashboardPage }) => {
    // Login first
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    await expect(dashboardPage.page).toHaveURL('/dashboard');

    // Logout
    await dashboardPage.logout();

    // Assert
    await expect(loginPage.page).toHaveURL('/login');
  });

  test('should redirect to login when accessing protected route', async ({
    page,
  }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('should persist session after page reload', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Login
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    await expect(dashboardPage.page).toHaveURL('/dashboard');

    // Reload page
    await dashboardPage.page.reload();

    // Should still be on dashboard
    await expect(dashboardPage.page).toHaveURL('/dashboard');
    await expect(dashboardPage.welcomeMessage).toBeVisible();
  });
});
```

## Tips Adicionales

### Para API mocking:
```
Usa page.route() para interceptar y mockear API calls.
Simula diferentes estados (loading, error, success).
```

### Para tests visuales:
```
Agrega screenshot comparison tests.
Usa toHaveScreenshot() de Playwright.
```

### Para performance:
```
Usa page.waitForLoadState('networkidle').
Mide performance con page.evaluate(() => performance.timing).
```

---

_E2E Testing - Validando flujos completos de usuario_ 🧪
