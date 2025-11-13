# 🟨 JavaScript/TypeScript Guidelines

Specific guidelines for JavaScript and TypeScript development.

## TypeScript Configuration

Use strict mode for maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true
  }
}
```

## Naming Conventions

```typescript
// Interfaces: PascalCase with I prefix (optional)
interface User {}
interface IUser {}  // Alternative

// Types: PascalCase
type UserId = string;

// Enums: PascalCase
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

// Functions: camelCase
function getUserById(id: string) {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
```

## Modern JavaScript Patterns

### Use const/let, not var
```typescript
const value = 'immutable';
let counter = 0;
```

### Arrow Functions
```typescript
// ✅ Concise arrow functions
const double = (x: number) => x * 2;

// ✅ With block body
const process = (data: Data) => {
  const result = transform(data);
  return result;
};
```

### Async/Await
```typescript
// ✅ Prefer async/await
async function fetchUser(id: string) {
  const user = await api.getUser(id);
  return user;
}

// ❌ Avoid callback hell
api.getUser(id, (user) => {
  api.getPosts(user.id, (posts) => {
    // ...
  });
});
```

### Destructuring
```typescript
// ✅ Object destructuring
const { name, email } = user;

// ✅ Array destructuring
const [first, second] = items;

// ✅ Function parameters
function greet({ name, age }: User) {
  return `Hello ${name}`;
}
```

### Spread Operator
```typescript
// ✅ Object spread
const updated = { ...user, email: 'new@email.com' };

// ✅ Array spread
const combined = [...array1, ...array2];
```

## React Best Practices

### Functional Components
```typescript
// ✅ Functional components with TypeScript
interface Props {
  title: string;
  onClick: () => void;
}

const Button: React.FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```

### Hooks
```typescript
// ✅ Custom hooks
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  
  return user;
}
```

## Node.js Best Practices

### Module System
```typescript
// ✅ ES modules
import { something } from './module';
export const value = 123;

// ✅ Default exports
export default class MyClass {}
```

### Error Handling
```typescript
// ✅ Custom errors
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ✅ Async error handling
async function handler(req, res, next) {
  try {
    const result = await processRequest(req);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
```

## Testing with Jest

```typescript
describe('Calculator', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle async operations', async () => {
    const result = await fetchData();
    expect(result).toBeDefined();
  });
});
```

---

**Last Updated**: 2025-11-13
