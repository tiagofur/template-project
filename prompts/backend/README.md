# 🔧 Backend Prompts

Prompts especializados para desarrollo backend, APIs, bases de datos y lógica de negocio.

## 📋 Categorías

### API Development
- [REST API CRUD](./api-rest-crud.md) - Crear endpoints CRUD completos
- [GraphQL Schema](./graphql-schema.md) - Diseñar schemas GraphQL
- [API Authentication](./api-authentication.md) - Implementar autenticación JWT
- [API Validation](./api-validation.md) - Validación de datos de entrada
- [API Error Handling](./api-error-handling.md) - Manejo centralizado de errores

### Database
- [Database Schema Design](./database-schema.md) - Diseñar esquemas de base de datos
- [Database Migrations](./database-migrations.md) - Crear migraciones seguras
- [Database Optimization](./database-optimization.md) - Optimizar queries y índices
- [Database Seeding](./database-seeding.md) - Datos iniciales y de prueba

### Authentication & Security
- [JWT Authentication](./jwt-authentication.md) - Sistema de autenticación JWT
- [Role-Based Access Control](./rbac.md) - Control de acceso por roles
- [Password Security](./password-security.md) - Manejo seguro de contraseñas
- [API Rate Limiting](./rate-limiting.md) - Limitar peticiones a la API

### Business Logic
- [Service Layer Pattern](./service-layer.md) - Implementar capa de servicios
- [Repository Pattern](./repository-pattern.md) - Patrón repository para datos
- [Event-Driven Architecture](./event-driven.md) - Arquitectura basada en eventos
- [Background Jobs](./background-jobs.md) - Procesos en background

### Performance & Optimization
- [Caching Strategy](./caching-strategy.md) - Implementar caché efectivo
- [Query Optimization](./query-optimization.md) - Optimizar consultas de BD
- [API Performance](./api-performance.md) - Optimizar rendimiento de APIs
- [Load Balancing](./load-balancing.md) - Balanceo de carga

## 🎯 Guía de Uso

### Selección de Prompt

1. **Identifica tu necesidad:** ¿Qué estás tratando de construir?
2. **Revisa la categoría:** Encuentra la sección relevante
3. **Lee el prompt completo:** Entiende el contexto y requisitos
4. **Adapta a tu stack:** Personaliza según tus tecnologías

### Stack Soportado

Los prompts están diseñados para funcionar con:

- **Node.js:** Express, NestJS, Fastify
- **Python:** Django, FastAPI, Flask
- **Go:** Gin, Echo, Fiber
- **Java:** Spring Boot
- **.NET:** ASP.NET Core
- **Ruby:** Rails, Sinatra

### Variables Comunes

- `{{entity}}`: Nombre de la entidad (ej: User, Product)
- `{{database}}`: Tipo de base de datos (PostgreSQL, MongoDB, MySQL)
- `{{framework}}`: Framework backend (Express, FastAPI, etc.)
- `{{auth_method}}`: Método de autenticación (JWT, OAuth, Session)
- `{{language}}`: Lenguaje de programación

## 💡 Tips Generales

### Desarrollo de APIs

- Siempre incluye validación de entrada
- Implementa manejo de errores consistente
- Documenta tus endpoints (OpenAPI/Swagger)
- Versiona tus APIs desde el inicio
- Implementa rate limiting para seguridad

### Bases de Datos

- Usa migraciones para todos los cambios
- Crea índices para queries frecuentes
- Implementa soft deletes cuando sea apropiado
- Mantén backups regulares
- Usa transacciones para operaciones críticas

### Seguridad

- Nunca almacenes contraseñas en texto plano
- Valida y sanitiza todos los inputs
- Implementa CORS apropiadamente
- Usa HTTPS en producción
- Mantén dependencias actualizadas

### Performance

- Implementa caché para datos frecuentes
- Usa paginación en listados
- Optimiza queries N+1
- Implementa lazy loading cuando sea posible
- Monitorea el rendimiento constantemente

## 📚 Recursos Adicionales

- [Documentación de PostgreSQL](../docs/postgresql/README.md)
- [Testing Best Practices](../docs/testing/README.md)
- [Docker Configuration](../docs/docker/README.md)
- [CI/CD Integration](../docs/cicd/README.md)

---

_Backend Prompts - Construyendo APIs robustas y escalables_ 🔧
