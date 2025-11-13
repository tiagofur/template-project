# 💾 Database Guide

Database design, optimization, and best practices.

> **📚 Architecture Patterns:** For comprehensive database patterns including Repository and Data Mapper, see the [Database Patterns Guide](../architecture/database-patterns.md).

## Schema Design

### Normalization
- 1NF: Atomic values, no repeating groups
- 2NF: No partial dependencies
- 3NF: No transitive dependencies

### Naming Conventions
```sql
-- Tables: plural nouns
CREATE TABLE users (...);
CREATE TABLE posts (...);

-- Columns: snake_case
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  created_at TIMESTAMP
);

-- Foreign keys: table_id
user_id INTEGER REFERENCES users(id)
```

## Indexing

```sql
-- Index frequently queried columns
CREATE INDEX idx_users_email ON users(email);

-- Composite index for multi-column queries
CREATE INDEX idx_posts_user_status 
ON posts(user_id, status);

-- Unique index
CREATE UNIQUE INDEX idx_users_email_unique 
ON users(email);
```

## Query Optimization

```sql
-- Use EXPLAIN to analyze queries
EXPLAIN ANALYZE 
SELECT * FROM users WHERE email = 'test@example.com';

-- Avoid SELECT *
SELECT id, name, email FROM users;

-- Use JOINs instead of subqueries when possible
SELECT u.name, p.title
FROM users u
JOIN posts p ON p.user_id = u.id;
```

## Related Documentation

- **[Database Architecture Patterns](../architecture/database-patterns.md)** - Repository, Data Mapper
- Full [PostgreSQL Guide](../postgresql/README.md)
- [Database Tools](../../tools/backend/README.md)
- [Backend Prompts](../../prompts/backend/README.md)

---

**Last Updated**: 2025-11-13
