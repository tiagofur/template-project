# 📌 API Versioning Guide

Guía completa para versionado de APIs y gestión de cambios backwards compatible.

## 🎯 Estrategias de Versionado

### 1. URI Versioning (Recomendado)

La más popular y clara.

```typescript
// v1
app.use('/api/v1', v1Routes);

// v2
app.use('/api/v2', v2Routes);
```

**Ventajas:**
- ✅ Fácil de implementar
- ✅ Claro y explícito
- ✅ Fácil de cachear
- ✅ Fácil de documentar

**Desventajas:**
- ❌ URL cambia con versión
- ❌ No sigue REST estrictamente

### 2. Header Versioning

```typescript
app.use('/api', (req, res, next) => {
  const version = req.headers['api-version'] || '1';
  
  switch (version) {
    case '1':
      return v1Handler(req, res, next);
    case '2':
      return v2Handler(req, res, next);
    default:
      return res.status(400).json({
        error: 'Invalid API version'
      });
  }
});
```

**Ventajas:**
- ✅ URL permanece igual
- ✅ Sigue principios REST

**Desventajas:**
- ❌ Menos visible
- ❌ Dificulta caching
- ❌ Más complejo para clientes

### 3. Content Negotiation

```typescript
app.get('/api/users', (req, res) => {
  const accept = req.headers['accept'];
  
  if (accept.includes('application/vnd.api.v1+json')) {
    return v1UsersController(req, res);
  }
  
  if (accept.includes('application/vnd.api.v2+json')) {
    return v2UsersController(req, res);
  }
  
  res.status(406).json({ error: 'Not acceptable' });
});
```

### 4. Query Parameter (No recomendado)

```typescript
app.get('/api/users', (req, res) => {
  const version = req.query.version || '1';
  // Handle version
});
```

## 🏗️ Implementación URI Versioning

### Estructura de Proyecto

```
src/
├── api/
│   ├── v1/
│   │   ├── controllers/
│   │   │   ├── users.controller.ts
│   │   │   └── posts.controller.ts
│   │   ├── routes/
│   │   │   ├── users.routes.ts
│   │   │   └── posts.routes.ts
│   │   ├── dto/
│   │   │   └── user.dto.ts
│   │   └── index.ts
│   ├── v2/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── dto/
│   │   └── index.ts
│   └── shared/
│       ├── middleware/
│       └── utils/
```

### v1 Routes

```typescript
// api/v1/routes/users.routes.ts
import express from 'express';
import { UsersController } from '../controllers/users.controller';

const router = express.Router();
const controller = new UsersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;

// api/v1/index.ts
import express from 'express';
import usersRoutes from './routes/users.routes';
import postsRoutes from './routes/posts.routes';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);

export default router;
```

### v2 Routes (Breaking Changes)

```typescript
// api/v2/dto/user.dto.ts
export interface UserV2Dto {
  id: string;
  email: string;
  profile: {  // BREAKING: nested profile
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

// api/v2/controllers/users.controller.ts
export class UsersV2Controller {
  async getAll(req: Request, res: Response) {
    const users = await User.findAll();
    
    // Transform to v2 format
    const usersV2 = users.map(user => ({
      id: user.id,
      email: user.email,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      data: usersV2,
    });
  }
}
```

### App Setup

```typescript
// app.ts
import express from 'express';
import v1Routes from './api/v1';
import v2Routes from './api/v2';

const app = express();

// Mount versions
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Default to latest version
app.use('/api', v2Routes);
```

## 🔄 Cambios Backwards Compatible

### ✅ Cambios Seguros (No requieren nueva versión)

```typescript
// ✅ Agregar campos opcionales
interface User {
  id: string;
  name: string;
  email?: string;  // NUEVO OPCIONAL
}

// ✅ Agregar nuevos endpoints
router.get('/users/stats', getStats);

// ✅ Agregar query parameters opcionales
router.get('/users', (req, res) => {
  const { page, limit, sort } = req.query;  // sort es NUEVO
});

// ✅ Hacer campos requeridos opcionales
// v1: name required
// v2: name optional

// ✅ Valores de respuesta más detallados
// v1: { status: 'active' }
// v2: { status: 'active', statusDetails: { ... } }
```

### ❌ Breaking Changes (Requieren nueva versión)

```typescript
// ❌ Remover campos
interface User {
  id: string;
  // name: string;  // REMOVIDO
}

// ❌ Renombrar campos
interface User {
  id: string;
  fullName: string;  // antes era 'name'
}

// ❌ Cambiar tipo de dato
interface User {
  id: number;  // antes era string
}

// ❌ Cambiar estructura de respuesta
// v1: { data: [...] }
// v2: { results: [...] }  // cambió 'data' a 'results'

// ❌ Hacer campos opcionales requeridos
interface User {
  email: string;  // antes era opcional
}

// ❌ Cambiar comportamiento de endpoint
// v1: DELETE /users/:id (soft delete)
// v2: DELETE /users/:id (hard delete)
```

## 📋 Deprecation Strategy

### Anunciar Deprecación

```typescript
// v1 routes (deprecated)
app.use('/api/v1', (req, res, next) => {
  // Add deprecation headers
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 31 Dec 2024 23:59:59 GMT');
  res.set('Link', '</api/v2>; rel="successor-version"');
  
  next();
}, v1Routes);
```

### Logging Deprecated Usage

```typescript
app.use('/api/v1', (req, res, next) => {
  logger.warn('Deprecated API version used', {
    version: 'v1',
    endpoint: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  
  next();
}, v1Routes);
```

### Email Notifications

```typescript
import { scheduleJob } from 'node-schedule';

// Notificar usuarios 3 meses antes de sunset
scheduleJob('0 0 1 10 *', async () => {
  const v1Users = await getV1ApiUsers();
  
  for (const user of v1Users) {
    await sendEmail(user.email, {
      subject: 'API v1 Deprecation Notice',
      body: `
        API v1 will be sunset on December 31, 2024.
        Please migrate to v2: https://docs.example.com/api/v2
      `,
    });
  }
});
```

## 🔀 Gradual Migration

### Adapter Pattern

```typescript
// Transform v1 data to v2 format
class UserAdapter {
  static toV2(v1User: UserV1): UserV2 {
    return {
      id: v1User.id,
      email: v1User.email,
      profile: {
        firstName: v1User.firstName,
        lastName: v1User.lastName,
      },
      createdAt: v1User.createdAt,
    };
  }

  static toV1(v2User: UserV2): UserV1 {
    return {
      id: v2User.id,
      email: v2User.email,
      firstName: v2User.profile.firstName,
      lastName: v2User.profile.lastName,
      createdAt: v2User.createdAt,
    };
  }
}

// Use in v1 controller
export class UsersV1Controller {
  async getById(req: Request, res: Response) {
    // Get from v2 service (single source of truth)
    const userV2 = await usersService.findById(req.params.id);
    
    // Transform to v1 format
    const userV1 = UserAdapter.toV1(userV2);
    
    res.json({ success: true, data: userV1 });
  }
}
```

### Feature Flags

```typescript
const features = {
  v2Users: process.env.FEATURE_V2_USERS === 'true',
};

app.get('/api/users', async (req, res) => {
  if (features.v2Users) {
    return v2UsersController(req, res);
  }
  
  return v1UsersController(req, res);
});
```

## 📄 Documentation

### Changelog

```markdown
# API Changelog

## v2.0.0 (2024-01-15)

### Breaking Changes
- User `name` field split into `profile.firstName` and `profile.lastName`
- Response format changed from `{ data }` to `{ success, data }`

### New Features
- Added `/users/stats` endpoint
- Added filtering by email domain

### Deprecations
- v1 API deprecated, sunset date: 2024-12-31

## v1.1.0 (2023-06-01)

### New Features
- Added pagination to `/users`
- Added sorting to `/posts`

### Bug Fixes
- Fixed email validation
```

### Migration Guide

```markdown
# Migration Guide: v1 → v2

## Breaking Changes

### 1. User Object Structure

**v1:**
```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**v2:**
```json
{
  "id": "123",
  "email": "john@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Migration:**
```typescript
// Before
const name = user.name;

// After
const firstName = user.profile.firstName;
const lastName = user.profile.lastName;
const fullName = `${firstName} ${lastName}`;
```

### 2. Response Format

**v1:**
```json
{ "data": [...] }
```

**v2:**
```json
{
  "success": true,
  "data": [...]
}
```

## Timeline

- 2024-01-15: v2 released
- 2024-03-15: v1 deprecated
- 2024-12-31: v1 sunset
```

## 🧪 Testing Multiple Versions

```typescript
describe('API Versioning', () => {
  describe('v1', () => {
    it('should return v1 format', async () => {
      const res = await request(app)
        .get('/api/v1/users/123')
        .expect(200);

      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).not.toHaveProperty('profile');
    });
  });

  describe('v2', () => {
    it('should return v2 format', async () => {
      const res = await request(app)
        .get('/api/v2/users/123')
        .expect(200);

      expect(res.body.data).toHaveProperty('profile');
      expect(res.body.data.profile).toHaveProperty('firstName');
      expect(res.body.data.profile).toHaveProperty('lastName');
    });
  });

  it('should include deprecation headers in v1', async () => {
    const res = await request(app).get('/api/v1/users');

    expect(res.headers).toHaveProperty('deprecation', 'true');
    expect(res.headers).toHaveProperty('sunset');
  });
});
```

## 📚 Resources

- [API Versioning Best Practices](https://www.freecodecamp.org/news/how-to-version-a-rest-api/)
- [Semantic Versioning](https://semver.org/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)

---

_API Versioning Guide_ 📌
