# 💻 Coding Guidelines

Standards and best practices for writing high-quality, maintainable code.

## Overview

These guidelines ensure code consistency, quality, and maintainability across the project.

## Quick Links

- **[General Principles](./general-principles.md)** - Universal coding standards
- **[JavaScript/TypeScript](./javascript-typescript.md)** - JS/TS specific guidelines
- **[Python](./python.md)** - Python coding standards
- **[Code Review Checklist](./code-review-checklist.md)** - Review criteria

## Core Principles

### 1. **Clarity Over Cleverness**
Write code that is easy to understand, not just code that works.

```javascript
// ❌ Clever but unclear
const r = a.map(x => x * 2).filter(x => x > 10);

// ✅ Clear and maintainable
const doubled = numbers.map(num => num * 2);
const largeNumbers = doubled.filter(num => num > 10);
```

### 2. **Consistency**
Follow established patterns and conventions in the codebase.

### 3. **DRY (Don't Repeat Yourself)**
Extract repeated logic into reusable functions or components.

### 4. **YAGNI (You Aren't Gonna Need It)**
Don't add functionality until it's needed.

### 5. **KISS (Keep It Simple, Stupid)**
Simple solutions are easier to understand and maintain.

## Language-Specific Guidelines

### JavaScript/TypeScript
- Use TypeScript for type safety
- Follow ES6+ standards
- Use async/await over callbacks
- Prefer functional programming patterns
- [Full guide →](./javascript-typescript.md)

### Python
- Follow PEP 8 style guide
- Use type hints
- Write descriptive docstrings
- Use virtual environments
- [Full guide →](./python.md)

## General Best Practices

### Naming Conventions

```typescript
// Classes: PascalCase
class UserService {}

// Functions/Variables: camelCase
function getUserById(id) {}
const userName = "John";

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Private members: _prefix
class Example {
  private _privateField;
}

// Boolean: is/has/can prefix
const isActive = true;
const hasPermission = false;
const canEdit = true;
```

### Function Design

```typescript
// ✅ Single responsibility
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Pure functions (no side effects)
function add(a, b) {
  return a + b;  // No mutations or external dependencies
}

// ✅ Small functions (< 20 lines ideally)
// ✅ Descriptive names
// ✅ Clear parameters (max 3-4)
```

### Error Handling

```typescript
// ✅ Use try-catch appropriately
async function fetchUser(id) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user', { id, error });
    throw new UserNotFoundError(id);
  }
}

// ✅ Throw specific errors
class UserNotFoundError extends Error {
  constructor(id) {
    super(`User not found: ${id}`);
    this.name = 'UserNotFoundError';
  }
}
```

### Comments and Documentation

```typescript
/**
 * Calculates the total price including tax
 * @param items - Array of items with price
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @returns Total price with tax
 */
function calculateTotalWithTax(items, taxRate) {
  const subtotal = calculateTotal(items);
  return subtotal * (1 + taxRate);
}

// ✅ Document why, not what
// The code itself should explain "what"
// Comments explain "why" and context

// ❌ Redundant comment
// Loop through users
users.forEach(user => {});

// ✅ Helpful comment
// Skip inactive users to avoid sending notifications
users.filter(u => u.isActive).forEach(user => {});
```

## Code Organization

### File Structure
```
src/
├── components/       # Reusable components
├── services/         # Business logic
├── utils/            # Utility functions
├── types/            # Type definitions
├── constants/        # Constants and configs
└── tests/            # Test files
```

### Module Organization
```typescript
// ✅ Group related functionality
// user.service.ts
export class UserService {
  create() {}
  update() {}
  delete() {}
  findById() {}
}

// ✅ Single export per file (when appropriate)
// Or related exports
export { UserService, UserDto, UserValidator };
```

## Testing Standards

### Test Coverage
- Aim for 80%+ code coverage
- Focus on critical paths
- Test edge cases and error scenarios

### Test Structure
```typescript
describe('UserService', () => {
  describe('create', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };
      
      // Act
      const result = await userService.create(userData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeTruthy();
    });

    it('should throw error with invalid email', async () => {
      const userData = { name: 'John', email: 'invalid' };
      
      await expect(userService.create(userData))
        .rejects.toThrow(ValidationError);
    });
  });
});
```

## Security Guidelines

### Input Validation
```typescript
// ✅ Always validate and sanitize input
function createUser(input) {
  const validated = userSchema.parse(input);  // Using Zod or similar
  return db.users.create(validated);
}

// ✅ Use parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ❌ Never concatenate SQL
// This is vulnerable to SQL injection
const user = await db.query(
  `SELECT * FROM users WHERE id = ${userId}`
);
```

### Secret Management
```typescript
// ✅ Use environment variables
const apiKey = process.env.API_KEY;

// ❌ Never hardcode secrets
const apiKey = 'sk-1234567890';  // ❌
```

## Performance Guidelines

### Optimization Basics
```typescript
// ✅ Avoid unnecessary work
const result = items
  .filter(item => item.isActive)
  .slice(0, 10)  // Take only what you need
  .map(item => transform(item));

// ✅ Use appropriate data structures
const userMap = new Map(users.map(u => [u.id, u]));  // O(1) lookup
const user = userMap.get(userId);

// ✅ Debounce expensive operations
const debouncedSearch = debounce(searchFunction, 300);
```

### Async Best Practices
```typescript
// ✅ Parallel when possible
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);

// ✅ Sequential only when needed
const user = await fetchUser(id);
const posts = await fetchUserPosts(user.id);  // Depends on user
```

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows style guidelines
- [ ] Tests written and passing
- [ ] No console.log or debugging code
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considered
- [ ] Type safety ensured
- [ ] Linter passing

[Full Checklist →](./code-review-checklist.md)

## Tools and Automation

### Linting
```bash
# ESLint for JavaScript/TypeScript
npm run lint

# Pylint/Flake8 for Python
pylint src/
flake8 src/
```

### Formatting
```bash
# Prettier for JavaScript/TypeScript
npm run format

# Black for Python
black src/
```

### Pre-commit Hooks
```bash
# Husky + lint-staged
# Automatically runs linting and formatting before commit
```

## Language-Specific Guides

Choose your guide:

### [JavaScript/TypeScript Guidelines](./javascript-typescript.md)
- TypeScript configuration
- Modern JavaScript patterns
- React best practices
- Node.js conventions
- Testing with Jest

### [Python Guidelines](./python.md)
- PEP 8 compliance
- Type hints and mypy
- Virtual environments
- Django/Flask patterns
- Testing with pytest

## Resources

### Style Guides
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [Clean Code principles](https://github.com/ryanmcdermott/clean-code-javascript)

### Books
- Clean Code by Robert C. Martin
- The Pragmatic Programmer
- Refactoring by Martin Fowler

---

**Last Updated**: 2025-11-13  
**Maintainers**: Development Team

_Coding Guidelines - Write code that lasts_ 💻
