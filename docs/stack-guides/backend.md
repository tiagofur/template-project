# 🔧 Backend Development Guide

Comprehensive guide for backend development best practices.

## Overview

This guide covers backend development for APIs, databases, authentication, and server-side logic.

> **📚 Architecture Patterns:** For comprehensive architecture patterns including Layered, Clean, Hexagonal, Microservices, and CQRS, see the [Backend Architecture Patterns Guide](../architecture/backend-patterns.md).

## API Development

### REST API Design

**Resource Naming**
```
✅ Use plural nouns
GET /api/users
GET /api/users/:id
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

✅ Use nested resources
GET /api/users/:id/posts
POST /api/users/:id/posts
```

**HTTP Methods**
- GET - Retrieve resources
- POST - Create resources
- PUT/PATCH - Update resources
- DELETE - Remove resources

**Status Codes**
- 200 OK - Success
- 201 Created - Resource created
- 400 Bad Request - Invalid input
- 401 Unauthorized - Authentication required
- 403 Forbidden - No permission
- 404 Not Found - Resource doesn't exist
- 500 Internal Server Error - Server error

### Express.js Example

```typescript
import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();

// Middleware
app.use(express.json());

// Validation middleware
const validateUser = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Routes
app.post('/api/users', validateUser, async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use((error, req, res, next) => {
  logger.error(error);
  res.status(500).json({ error: 'Internal server error' });
});
```

## Database Best Practices

### Schema Design
```sql
-- Use meaningful table names
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index frequently queried columns
CREATE INDEX idx_users_email ON users(email);

-- Use foreign keys for relationships
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Query Optimization
```typescript
// ✅ Use parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ✅ Select only needed columns
const users = await db.query(
  'SELECT id, name, email FROM users'
);

// ✅ Use JOIN instead of multiple queries
const posts = await db.query(`
  SELECT p.*, u.name as author_name
  FROM posts p
  JOIN users u ON p.user_id = u.id
  WHERE p.status = 'published'
`);
```

## Authentication

### JWT Authentication

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Registration
async function register(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.users.create({
    email,
    password_hash: hashedPassword
  });
  return user;
}

// Login
async function login(email: string, password: string) {
  const user = await db.users.findByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid credentials');
  
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return { user, token };
}

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Error Handling

```typescript
// Custom error classes
class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

// Global error handler
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }
  
  logger.error(error);
  res.status(500).json({ error: 'Internal server error' });
});
```

## Related Documentation

- **[Backend Architecture Patterns](../architecture/backend-patterns.md)** - Layered, Clean, Hexagonal, Microservices, CQRS
- Full [API Documentation](../api/README.md)
- [PostgreSQL Guide](../postgresql/README.md)
- [Database Patterns](../architecture/database-patterns.md) - Repository, Data Mapper
- [Integration Patterns](../architecture/integration-patterns.md) - API Gateway, Service Mesh, Event-Driven
- [Security Guide](./security.md)
- [Backend Tools](../../tools/backend/README.md)
- [Backend Prompts](../../prompts/backend/README.md)

---

**Last Updated**: 2025-11-13
