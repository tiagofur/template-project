# 🔒 Security Guide

Security best practices for application development.

## Authentication & Authorization

### JWT Best Practices
- Use strong secrets (256-bit minimum)
- Set appropriate expiration times
- Store securely (httpOnly cookies)
- Implement refresh tokens
- Validate on every request

### Password Security
```typescript
import bcrypt from 'bcrypt';

// Hash password
const hash = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hash);
```

## Input Validation

```typescript
// Use validation library
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50)
});

// Validate input
const result = userSchema.safeParse(input);
if (!result.success) {
  throw new ValidationError(result.error);
}
```

## SQL Injection Prevention

```typescript
// ✅ Use parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ Never concatenate
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

## XSS Prevention

```typescript
// Sanitize HTML
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userInput);

// Escape output
// React does this automatically
<div>{userInput}</div>  // Safe in React
```

## Related Documentation

- [Security Guide](../security/README.md)
- [Security Tools](../../tools/security/README.md)
- [Security Prompts](../../prompts/security/README.md)

---

**Last Updated**: 2025-11-13
