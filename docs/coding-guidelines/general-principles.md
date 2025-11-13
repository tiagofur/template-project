# 🎯 General Coding Principles

Universal coding standards that apply across all languages and frameworks.

## SOLID Principles

### Single Responsibility Principle
Each class/function should have one reason to change.

```typescript
// ❌ Multiple responsibilities
class User {
  saveToDatabase() {}
  sendEmail() {}
  generateReport() {}
}

// ✅ Single responsibility
class User {
  getData() {}
}
class UserRepository {
  save(user) {}
}
class EmailService {
  sendToUser(user) {}
}
```

### Open/Closed Principle
Open for extension, closed for modification.

### Liskov Substitution Principle
Subtypes must be substitutable for their base types.

### Interface Segregation Principle
Many specific interfaces are better than one general interface.

### Dependency Inversion Principle
Depend on abstractions, not concretions.

## Clean Code Practices

### Meaningful Names
- Use intention-revealing names
- Avoid abbreviations
- Use pronounceable names
- Use searchable names

### Functions
- Small (< 20 lines)
- Do one thing
- One level of abstraction
- Descriptive names
- Few arguments (max 3-4)

### Comments
- Explain why, not what
- Keep comments up to date
- Avoid redundant comments
- Use comments to clarify intent

### Error Handling
- Use exceptions over error codes
- Provide context with exceptions
- Don't return null
- Don't pass null

### Code Formatting
- Consistent indentation
- Meaningful whitespace
- Group related code
- Keep lines short (< 100 chars)

## DRY (Don't Repeat Yourself)

```typescript
// ❌ Repetition
function getUserEmail() {
  return user.email.toLowerCase().trim();
}
function validateEmail() {
  const email = user.email.toLowerCase().trim();
}

// ✅ Extract common logic
function normalizeEmail(email) {
  return email.toLowerCase().trim();
}
```

## YAGNI (You Aren't Gonna Need It)

Don't add functionality until it's needed.

## KISS (Keep It Simple, Stupid)

Choose simple solutions over complex ones.

---

**Last Updated**: 2025-11-13
