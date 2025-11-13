# 🏗️ API Design Guide

Guía completa para diseñar APIs RESTful y GraphQL robustas, escalables y bien documentadas.

## 📋 Tabla de Contenidos

1. [Principios de Diseño](#principios-de-diseño)
2. [REST API Design](#rest-api-design)
3. [GraphQL Design](#graphql-design)
4. [Request/Response Format](#requestresponse-format)
5. [HTTP Status Codes](#http-status-codes)
6. [Pagination](#pagination)
7. [Filtering & Sorting](#filtering--sorting)
8. [Authentication](#authentication)
9. [Documentación](#documentación)

## 🎯 Principios de Diseño

### 1. Consistencia

Mantén consistencia en:
- Nomenclatura de endpoints
- Estructura de respuestas
- Códigos de error
- Formato de fechas (ISO 8601)
- Convenciones de naming (camelCase, snake_case)

### 2. Simplicidad

- URLs descriptivas y fáciles de entender
- Respuestas claras y concisas
- Documentación accesible
- Ejemplos de uso

### 3. Escalabilidad

- Paginación por defecto
- Caching estratégico
- Rate limiting
- Versioning desde el inicio

### 4. Seguridad

- HTTPS obligatorio
- Authentication/Authorization
- Input validation
- Rate limiting
- CORS configurado

## 🔄 REST API Design

### Nomenclatura de Recursos

✅ **Buenas Prácticas:**

```
GET    /api/v1/users           # Plural, no singular
GET    /api/v1/users/123       # ID numérico o UUID
POST   /api/v1/users           # Crear recurso
PUT    /api/v1/users/123       # Actualizar completo
PATCH  /api/v1/users/123       # Actualizar parcial
DELETE /api/v1/users/123       # Eliminar recurso
```

❌ **Evitar:**

```
GET    /api/v1/getUsers        # No usar verbos
GET    /api/v1/user            # No usar singular
POST   /api/v1/users/create    # Redundante
GET    /api/v1/users/get/123   # Redundante
```

### Recursos Anidados

Para relaciones parent-child:

```
GET    /api/v1/users/123/posts           # Posts de un usuario
GET    /api/v1/users/123/posts/456       # Post específico del usuario
POST   /api/v1/users/123/posts           # Crear post para usuario
DELETE /api/v1/users/123/posts/456       # Eliminar post del usuario
```

**Límite de anidación:** Máximo 2 niveles

❌ **Evitar:**
```
GET /api/v1/users/123/posts/456/comments/789/likes
```

✅ **Mejor:**
```
GET /api/v1/comments/789/likes
```

### Métodos HTTP

| Método | Descripción | Idempotente | Safe |
|--------|-------------|-------------|------|
| **GET** | Obtener recurso(s) | ✅ | ✅ |
| **POST** | Crear recurso | ❌ | ❌ |
| **PUT** | Actualizar completo | ✅ | ❌ |
| **PATCH** | Actualizar parcial | ✅ | ❌ |
| **DELETE** | Eliminar recurso | ✅ | ❌ |
| **HEAD** | Headers solamente | ✅ | ✅ |
| **OPTIONS** | Métodos permitidos | ✅ | ✅ |

### Acciones Especiales (Non-CRUD)

Para acciones que no son CRUD, usa un verbo descriptivo:

```
POST   /api/v1/users/123/activate        # Activar usuario
POST   /api/v1/users/123/deactivate      # Desactivar usuario
POST   /api/v1/posts/456/publish         # Publicar post
POST   /api/v1/orders/789/cancel         # Cancelar orden
POST   /api/v1/invoices/101/send         # Enviar factura
```

## 📊 Request/Response Format

### Request Format

#### Query Parameters

```http
GET /api/v1/users?page=1&limit=10&sort=createdAt&order=desc&status=active
```

#### Request Body (JSON)

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  }
}
```

### Response Format

#### Éxito (Success)

```json
{
  "success": true,
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Lista con Paginación

```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "User 1"
    },
    {
      "id": "124",
      "name": "User 2"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

#### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      {
        "field": "email",
        "message": "Email must be a valid email address"
      }
    ]
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 📮 HTTP Status Codes

### 2xx Success

- **200 OK**: Request exitoso (GET, PUT, PATCH)
- **201 Created**: Recurso creado exitosamente (POST)
- **202 Accepted**: Request aceptado para procesamiento asíncrono
- **204 No Content**: Éxito sin contenido en respuesta (DELETE)

### 3xx Redirection

- **301 Moved Permanently**: Recurso movido permanentemente
- **302 Found**: Redirección temporal
- **304 Not Modified**: Recurso no modificado (cache)

### 4xx Client Errors

- **400 Bad Request**: Request malformado o inválido
- **401 Unauthorized**: Autenticación requerida o fallida
- **403 Forbidden**: Autenticado pero sin permisos
- **404 Not Found**: Recurso no encontrado
- **405 Method Not Allowed**: Método HTTP no permitido
- **409 Conflict**: Conflicto con estado actual (ej: duplicado)
- **422 Unprocessable Entity**: Validación fallida
- **429 Too Many Requests**: Rate limit excedido

### 5xx Server Errors

- **500 Internal Server Error**: Error genérico del servidor
- **502 Bad Gateway**: Gateway inválido
- **503 Service Unavailable**: Servicio temporalmente no disponible
- **504 Gateway Timeout**: Gateway timeout

## 📄 Pagination

### Offset-Based Pagination

**Request:**
```http
GET /api/v1/users?page=2&limit=10
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "links": {
    "first": "/api/v1/users?page=1&limit=10",
    "prev": "/api/v1/users?page=1&limit=10",
    "next": "/api/v1/users?page=3&limit=10",
    "last": "/api/v1/users?page=10&limit=10"
  }
}
```

**Pros:**
- Simple de implementar
- Permite saltar a páginas específicas

**Cons:**
- Ineficiente para datasets grandes
- Problemas con datos cambiantes

### Cursor-Based Pagination

**Request:**
```http
GET /api/v1/users?cursor=eyJpZCI6MTIzfQ&limit=10
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "limit": 10,
    "hasNext": true
  },
  "pagination": {
    "nextCursor": "eyJpZCI6MTMzfQ",
    "prevCursor": "eyJpZCI6MTEzfQ"
  }
}
```

**Pros:**
- Eficiente para datasets grandes
- Consistente con datos cambiantes

**Cons:**
- No permite saltar a páginas específicas
- Más complejo de implementar

## 🔍 Filtering & Sorting

### Filtering

**Simple:**
```http
GET /api/v1/users?status=active&role=admin
```

**Advanced:**
```http
GET /api/v1/users?filter[status]=active&filter[role]=admin
GET /api/v1/users?filter=status:active,role:admin
```

**Operators:**
```http
GET /api/v1/users?age[gte]=18&age[lte]=65
GET /api/v1/products?price[gt]=100&price[lt]=1000
GET /api/v1/users?name[like]=John
```

### Sorting

**Simple:**
```http
GET /api/v1/users?sort=createdAt
GET /api/v1/users?sort=-createdAt        # Descendente
```

**Multiple:**
```http
GET /api/v1/users?sort=lastName,firstName
GET /api/v1/users?sort=-createdAt,name
```

### Field Selection (Sparse Fieldsets)

```http
GET /api/v1/users?fields=id,name,email
GET /api/v1/users?fields=id,name&include=posts
```

### Search

```http
GET /api/v1/users?q=john
GET /api/v1/products?search=laptop&category=electronics
```

## 🔐 Authentication

### Bearer Token (JWT)

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Key

```http
X-API-Key: sk_live_abc123xyz789
```

### Basic Auth (solo para desarrollo)

```http
Authorization: Basic base64(username:password)
```

## 📊 GraphQL Design

### Schema Design

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  published: Boolean!
  publishedAt: DateTime
}

type Query {
  user(id: ID!): User
  users(
    limit: Int = 10
    offset: Int = 0
    filter: UserFilter
  ): UserConnection!
  post(id: ID!): Post
  posts(
    limit: Int = 10
    cursor: String
  ): PostConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  
  createPost(input: CreatePostInput!): Post!
  publishPost(id: ID!): Post!
}

type Subscription {
  postPublished: Post!
  userUpdated(id: ID!): User!
}
```

### Input Types

```graphql
input CreateUserInput {
  email: String!
  name: String!
  password: String!
}

input UpdateUserInput {
  email: String
  name: String
}

input UserFilter {
  email: String
  name: String
  status: UserStatus
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

### Connection Type (Relay-style)

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### Error Handling

```graphql
type MutationResponse {
  success: Boolean!
  message: String
  user: User
  errors: [Error!]
}

type Error {
  field: String
  message: String!
  code: String!
}

type Mutation {
  createUser(input: CreateUserInput!): MutationResponse!
}
```

## 📖 Documentación

### OpenAPI/Swagger

```yaml
openapi: 3.0.0
info:
  title: Users API
  version: 1.0.0
  description: API para gestión de usuarios

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging

paths:
  /users:
    get:
      summary: List users
      description: Get a paginated list of users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
            maximum: 100
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimitExceeded'
    
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        createdAt:
          type: string
          format: date-time
    
    CreateUserRequest:
      type: object
      required:
        - email
        - name
        - password
      properties:
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 2
          maxLength: 100
        password:
          type: string
          minLength: 8
    
    UserResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/User'
    
    UserListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          $ref: '#/components/schemas/PaginationMeta'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

## 🎯 Checklist de Diseño

### REST API Checklist

- [ ] URLs descriptivas usando sustantivos (no verbos)
- [ ] Métodos HTTP correctos (GET, POST, PUT, PATCH, DELETE)
- [ ] Códigos de estado HTTP apropiados
- [ ] Formato de respuesta consistente
- [ ] Paginación implementada
- [ ] Filtering y sorting disponibles
- [ ] Versionado de API (/v1, /v2)
- [ ] Rate limiting configurado
- [ ] CORS configurado correctamente
- [ ] Documentación OpenAPI/Swagger
- [ ] Ejemplos de uso documentados
- [ ] Error handling consistente
- [ ] Authentication/Authorization
- [ ] Input validation
- [ ] HTTPS obligatorio

### GraphQL Checklist

- [ ] Schema bien diseñado y tipado
- [ ] Queries eficientes (evitar N+1)
- [ ] DataLoader implementado
- [ ] Pagination (Relay-style connections)
- [ ] Error handling estructurado
- [ ] Query complexity limiting
- [ ] Depth limiting
- [ ] Subscriptions para real-time
- [ ] Documentación de schema
- [ ] Playground/GraphiQL disponible
- [ ] Authentication/Authorization
- [ ] Input validation
- [ ] Persisted queries (producción)

## 📚 Ejemplos Completos

### REST API Example

```typescript
// GET /api/v1/users?page=1&limit=10&status=active
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john@example.com",
      "name": "John Doe",
      "status": "active",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "links": {
    "self": "/api/v1/users?page=1&limit=10&status=active",
    "first": "/api/v1/users?page=1&limit=10&status=active",
    "last": "/api/v1/users?page=1&limit=10&status=active"
  }
}
```

### GraphQL Example

```graphql
# Query
query GetUsers($limit: Int!, $status: UserStatus) {
  users(limit: $limit, filter: { status: $status }) {
    edges {
      node {
        id
        email
        name
        posts {
          id
          title
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

# Variables
{
  "limit": 10,
  "status": "ACTIVE"
}

# Response
{
  "data": {
    "users": {
      "edges": [
        {
          "node": {
            "id": "1",
            "email": "john@example.com",
            "name": "John Doe",
            "posts": [
              {
                "id": "10",
                "title": "My First Post"
              }
            ]
          },
          "cursor": "eyJpZCI6MX0="
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJpZCI6MX0="
      },
      "totalCount": 1
    }
  }
}
```

## 🚀 Recursos Adicionales

- [REST API Tutorial](https://www.restapitutorial.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [API Design Patterns](https://stoplight.io/api-design-guide/basics/)

---

_API Design Guide - Diseñando APIs modernas y escalables_ 🏗️
