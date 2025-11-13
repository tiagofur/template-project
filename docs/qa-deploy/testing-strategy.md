# 🧪 Testing Strategy

Comprehensive testing approach for quality code.

## Testing Levels

### Unit Tests
**Purpose**: Test individual functions/methods in isolation

**When to Write**:
- Every new function
- Bug fixes
- Refactoring

**Example**:
```typescript
test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});
```

### Integration Tests
**Purpose**: Test multiple components working together

**When to Write**:
- API endpoints
- Database operations
- Service interactions

**Example**:
```typescript
test('creates user in database', async () => {
  const user = await userService.create({
    email: 'test@example.com',
    password: 'password123'
  });
  
  expect(user.id).toBeDefined();
  const found = await db.users.findById(user.id);
  expect(found).toBeDefined();
});
```

### E2E Tests
**Purpose**: Test complete user workflows

**When to Write**:
- Critical user journeys
- Main features
- Payment flows
- Authentication

**Example**:
```typescript
test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.goto('/checkout');
  await page.fill('[name="card"]', '4242424242424242');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/success');
});
```

## Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All critical paths
- **E2E Tests**: Main user flows

## Best Practices

### Write Testable Code
```typescript
// ✅ Testable - pure function
function calculateDiscount(price: number, percent: number) {
  return price * (percent / 100);
}

// ❌ Hard to test - side effects
function applyDiscount(productId: string, percent: number) {
  const product = db.products.find(productId);
  product.price = product.price * (percent / 100);
  db.products.save(product);
}
```

### Test Behavior, Not Implementation
```typescript
// ✅ Test behavior
test('filters active users', () => {
  const users = [
    { id: 1, active: true },
    { id: 2, active: false }
  ];
  const result = filterActiveUsers(users);
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(1);
});

// ❌ Test implementation
test('filters using array filter method', () => {
  // Testing how it's done, not what it does
});
```

### AAA Pattern
```typescript
test('example', () => {
  // Arrange - Setup
  const user = { name: 'John', age: 30 };
  
  // Act - Execute
  const result = formatUser(user);
  
  // Assert - Verify
  expect(result).toBe('John (30)');
});
```

## Related Documentation

- Full [Testing Guide](../testing/README.md)
- [QA Tools](../../tools/qa/README.md)

---

**Last Updated**: 2025-11-13
