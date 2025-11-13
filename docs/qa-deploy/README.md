# 🧪 QA & Deployment

Testing strategies, quality assurance, and deployment procedures.

## Quick Links

- **[Testing Strategy](./testing-strategy.md)** - Comprehensive testing approach
- **[CI/CD Pipeline](./cicd-pipeline.md)** - Automated testing and deployment
- **[Deployment Guide](./deployment-guide.md)** - Deploy to various environments
- **[Quality Assurance](./quality-assurance.md)** - QA processes and checklists

## Testing Pyramid

```
      /\
     /E2E\      <- Few, slow, expensive
    /------\
   / Integration\  <- Some, moderate
  /--------------\
 /    Unit Tests  \  <- Many, fast, cheap
/------------------\
```

### Unit Tests (70%)
- Test individual functions/methods
- Fast execution
- High coverage
- Mock dependencies

### Integration Tests (20%)
- Test component interactions
- Database, API calls
- More realistic scenarios
- Moderate speed

### E2E Tests (10%)
- Test complete user flows
- Browser automation
- Critical paths only
- Slow but comprehensive

## Quick Start

### Unit Testing (Jest/Pytest)

**JavaScript/TypeScript**
```typescript
describe('calculateTotal', () => {
  it('should sum item prices', () => {
    const items = [
      { price: 10 },
      { price: 20 },
      { price: 30 }
    ];
    expect(calculateTotal(items)).toBe(60);
  });

  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

**Python**
```python
def test_calculate_total():
    items = [{'price': 10}, {'price': 20}]
    assert calculate_total(items) == 30

def test_calculate_total_empty():
    assert calculate_total([]) == 0
```

### E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## CI/CD Best Practices

### Pipeline Stages
1. **Build** - Compile and bundle
2. **Lint** - Check code style
3. **Test** - Run automated tests
4. **Security Scan** - Check vulnerabilities
5. **Deploy** - Push to environment
6. **Smoke Test** - Verify deployment

### Example GitHub Actions
```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

## Quality Checklist

### Before Committing
- [ ] Code follows style guide
- [ ] Tests written and passing
- [ ] No linting errors
- [ ] No security vulnerabilities
- [ ] Documentation updated

### Before Deployment
- [ ] All tests passing in CI
- [ ] Code reviewed and approved
- [ ] Security scan passed
- [ ] Performance tested
- [ ] Rollback plan ready

## Deployment Strategies

### Blue-Green Deployment
- Run two identical environments
- Switch traffic between them
- Zero downtime
- Easy rollback

### Canary Deployment
- Gradual rollout to subset of users
- Monitor metrics
- Roll back if issues
- Full rollout if successful

### Rolling Deployment
- Update instances gradually
- Always some instances available
- Automatic rollback on failure

## Related Documentation

- Full [Testing Guide](../testing/README.md)
- [CI/CD Guide](../cicd/README.md)
- [QA Tools](../../tools/qa/README.md)
- [QA Prompts](../../prompts/qa/README.md)

---

**Last Updated**: 2025-11-13  
**Maintainers**: Development Team

_QA & Deployment - Ship with confidence_ 🧪
