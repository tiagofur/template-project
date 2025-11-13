# 🎯 Testing Best Practices

Guía completa de mejores prácticas para testing en el proyecto.

## 📋 Table of Contents

- [General Principles](#general-principles)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Test Structure](#test-structure)
- [Naming Conventions](#naming-conventions)
- [Common Patterns](#common-patterns)

## 🎯 General Principles

### 1. Write Tests First (TDD)

```typescript
// ❌ Bad: Writing tests after implementation
// Implementation first, then tests

// ✅ Good: Test-Driven Development
describe('calculateTotal', () => {
  it('should sum all item prices', () => {
    const items = [
      { price: 10 },
      { price: 20 },
      { price: 30 }
    ];
    expect(calculateTotal(items)).toBe(60);
  });
});

// Then implement the function
```

### 2. Keep Tests Independent

```typescript
// ❌ Bad: Tests depend on each other
let userId;

test('create user', async () => {
  userId = await createUser();
  expect(userId).toBeDefined();
});

test('get user', async () => {
  // Depends on previous test
  const user = await getUser(userId);
  expect(user).toBeDefined();
});

// ✅ Good: Each test is independent
describe('User API', () => {
  let testUser;
  
  beforeEach(async () => {
    testUser = await createTestUser();
  });
  
  afterEach(async () => {
    await deleteTestUser(testUser.id);
  });
  
  it('should create user', async () => {
    const user = await createUser({ email: 'new@test.com' });
    expect(user).toBeDefined();
  });
  
  it('should get user', async () => {
    const user = await getUser(testUser.id);
    expect(user.id).toBe(testUser.id);
  });
});
```

### 3. One Assertion Per Test (When Reasonable)

```typescript
// ❌ Bad: Multiple unrelated assertions
it('should handle user operations', () => {
  const user = createUser();
  expect(user.id).toBeDefined();
  expect(user.email).toContain('@');
  expect(validatePassword('weak')).toBe(false);
  expect(hashPassword('test')).toHaveLength(60);
});

// ✅ Good: Focused tests
describe('User Creation', () => {
  it('should generate user id', () => {
    const user = createUser();
    expect(user.id).toBeDefined();
  });
  
  it('should validate email format', () => {
    const user = createUser({ email: 'test@example.com' });
    expect(user.email).toContain('@');
  });
});

describe('Password Utils', () => {
  it('should reject weak passwords', () => {
    expect(validatePassword('weak')).toBe(false);
  });
  
  it('should hash password with bcrypt', () => {
    const hashed = hashPassword('test');
    expect(hashed).toHaveLength(60);
  });
});
```

### 4. Test Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
it('should call getUserById with correct id', () => {
  const spy = jest.spyOn(service, 'getUserById');
  component.loadUser(123);
  expect(spy).toHaveBeenCalledWith(123);
});

// ✅ Good: Testing behavior
it('should display user name after loading', async () => {
  const user = { id: 123, name: 'John Doe' };
  mockApiCall('/users/123', user);
  
  await component.loadUser(123);
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

## 🧪 Unit Testing

### AAA Pattern (Arrange-Act-Assert)

```typescript
describe('ShoppingCart', () => {
  it('should calculate total with discount', () => {
    // Arrange
    const cart = new ShoppingCart();
    cart.addItem({ name: 'Item 1', price: 100 });
    cart.addItem({ name: 'Item 2', price: 50 });
    const discountCode = 'SAVE10';
    
    // Act
    const total = cart.calculateTotal(discountCode);
    
    // Assert
    expect(total).toBe(135); // 150 - 10% = 135
  });
});
```

### Test Edge Cases

```typescript
describe('divide', () => {
  it('should divide two positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });
  
  it('should handle division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });
  
  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });
  
  it('should handle decimal results', () => {
    expect(divide(10, 3)).toBeCloseTo(3.33, 2);
  });
  
  it('should handle null values', () => {
    expect(() => divide(null, 2)).toThrow('Invalid input');
  });
  
  it('should handle undefined values', () => {
    expect(() => divide(10, undefined)).toThrow('Invalid input');
  });
});
```

### Mock External Dependencies

```typescript
// ❌ Bad: Not mocking external dependencies
it('should fetch user data', async () => {
  const user = await fetchUserFromAPI(123); // Real API call
  expect(user.name).toBe('John');
});

// ✅ Good: Mock external dependencies
jest.mock('@/services/api');

it('should fetch user data', async () => {
  const mockUser = { id: 123, name: 'John' };
  api.fetchUser.mockResolvedValue(mockUser);
  
  const user = await fetchUserFromAPI(123);
  
  expect(user).toEqual(mockUser);
  expect(api.fetchUser).toHaveBeenCalledWith(123);
});
```

## 🔗 Integration Testing

### Test API Endpoints

```typescript
describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data.password).toBeUndefined(); // Don't return password
  });
  
  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid' })
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain('Password is required');
  });
  
  it('should prevent duplicate emails', async () => {
    const userData = { email: 'duplicate@test.com', password: 'Pass123!' };
    
    await request(app).post('/api/users').send(userData).expect(201);
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(409);
    
    expect(response.body.message).toContain('Email already exists');
  });
});
```

### Test Database Operations

```typescript
describe('UserRepository', () => {
  beforeEach(async () => {
    await clearTestDatabase();
  });
  
  it('should save user to database', async () => {
    const user = {
      email: 'test@example.com',
      password: 'hashed_password'
    };
    
    const saved = await userRepository.save(user);
    
    expect(saved.id).toBeDefined();
    expect(saved.email).toBe(user.email);
    
    // Verify in database
    const found = await userRepository.findById(saved.id);
    expect(found).toEqual(saved);
  });
  
  it('should update existing user', async () => {
    const user = await userRepository.save({
      email: 'test@example.com',
      name: 'Old Name'
    });
    
    const updated = await userRepository.update(user.id, {
      name: 'New Name'
    });
    
    expect(updated.name).toBe('New Name');
    expect(updated.email).toBe(user.email);
  });
});
```

## 🎭 E2E Testing

### Use Page Object Pattern

```typescript
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async navigate() {
    await this.page.goto('/login');
  }
  
  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }
  
  async getErrorMessage() {
    return await this.page.textContent('[data-testid="error-message"]');
  }
}

// tests/login.spec.ts
import { LoginPage } from '../pages/login.page';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password123');
  
  await expect(page).toHaveURL('/dashboard');
});

test('should show error for invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login('wrong@example.com', 'wrongpass');
  
  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Invalid credentials');
});
```

### Test Critical User Flows

```typescript
test('complete checkout flow', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'customer@test.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');
  
  // 2. Add items to cart
  await page.goto('/products');
  await page.click('[data-testid="product-1"] [data-testid="add-to-cart"]');
  await page.click('[data-testid="product-2"] [data-testid="add-to-cart"]');
  
  // 3. Go to cart
  await page.click('[data-testid="cart-icon"]');
  await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2);
  
  // 4. Proceed to checkout
  await page.click('[data-testid="checkout-button"]');
  
  // 5. Fill shipping information
  await page.fill('[data-testid="address"]', '123 Main St');
  await page.fill('[data-testid="city"]', 'New York');
  await page.fill('[data-testid="zip"]', '10001');
  
  // 6. Complete payment
  await page.click('[data-testid="continue-to-payment"]');
  await page.fill('[data-testid="card-number"]', '4242424242424242');
  await page.fill('[data-testid="expiry"]', '12/25');
  await page.fill('[data-testid="cvv"]', '123');
  
  // 7. Place order
  await page.click('[data-testid="place-order"]');
  
  // 8. Verify success
  await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
  await expect(page.locator('[data-testid="order-number"]')).toContainText('ORD-');
});
```

## 📝 Test Structure

### Organize Tests by Feature

```
tests/
├── unit/
│   ├── auth/
│   │   ├── login.test.ts
│   │   ├── register.test.ts
│   │   └── password-reset.test.ts
│   ├── cart/
│   │   ├── add-item.test.ts
│   │   ├── remove-item.test.ts
│   │   └── calculate-total.test.ts
│   └── utils/
│       ├── validation.test.ts
│       └── formatting.test.ts
├── integration/
│   ├── api/
│   │   ├── auth.test.ts
│   │   ├── users.test.ts
│   │   └── orders.test.ts
│   └── database/
│       ├── migrations.test.ts
│       └── queries.test.ts
└── e2e/
    ├── auth-flow.spec.ts
    ├── checkout-flow.spec.ts
    └── user-management.spec.ts
```

## 🏷️ Naming Conventions

### Test File Names

```
// Component tests
UserCard.test.tsx
ProductList.test.tsx

// Service tests
authService.test.ts
orderService.test.ts

// Utility tests
validation.test.ts
formatting.test.ts

// E2E tests
checkout-flow.spec.ts
user-registration.spec.ts
```

### Test Descriptions

```typescript
// ❌ Bad: Vague descriptions
describe('User', () => {
  it('works', () => { ... });
  it('test1', () => { ... });
  it('validation', () => { ... });
});

// ✅ Good: Clear, descriptive names
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => { ... });
    it('should throw error when email is invalid', () => { ... });
    it('should hash password before saving', () => { ... });
  });
  
  describe('updateUser', () => {
    it('should update user profile information', () => { ... });
    it('should prevent updating email to existing email', () => { ... });
  });
});
```

## 🔧 Common Patterns

### Test Data Factories

```typescript
// factories/user.factory.ts
import { faker } from '@faker-js/faker';

export class UserFactory {
  static create(overrides = {}) {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      createdAt: faker.date.past(),
      ...overrides
    };
  }
  
  static createMany(count: number, overrides = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

// Usage
const user = UserFactory.create({ email: 'specific@test.com' });
const users = UserFactory.createMany(10);
```

### Test Helpers

```typescript
// helpers/test-utils.ts
export const createAuthToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

export const authenticatedRequest = (token: string) => {
  return request(app).set('Authorization', `Bearer ${token}`);
};

export const createTestUser = async (overrides = {}) => {
  const user = UserFactory.create(overrides);
  return await userRepository.save(user);
};

// Usage
const user = await createTestUser({ email: 'test@example.com' });
const token = createAuthToken(user.id);
const response = await authenticatedRequest(token).get('/api/profile');
```

### Snapshot Testing (Use Sparingly)

```typescript
// ✅ Good use: Testing complex data structures
it('should match API response structure', () => {
  const response = {
    success: true,
    data: {
      users: [...],
      pagination: { ... }
    }
  };
  
  expect(response).toMatchSnapshot();
});

// ❌ Bad use: Testing UI components (too brittle)
it('should render correctly', () => {
  const { container } = render(<UserCard user={mockUser} />);
  expect(container).toMatchSnapshot(); // Too fragile
});
```

## ✅ Checklist

Before committing your tests, verify:

- [ ] Tests follow AAA pattern
- [ ] All external dependencies are mocked
- [ ] Tests are independent and can run in any order
- [ ] Edge cases and error scenarios are covered
- [ ] Test names clearly describe what is being tested
- [ ] No hardcoded values (use constants or factories)
- [ ] Tests run quickly (unit tests < 100ms each)
- [ ] Clean up resources in afterEach/afterAll
- [ ] No console.log or debug statements
- [ ] Tests pass consistently (no flaky tests)

## 📚 Resources

- [Jest Best Practices](https://jestjs.io/docs/expect)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

_Testing Best Practices - Escribiendo tests de calidad_ ✅
