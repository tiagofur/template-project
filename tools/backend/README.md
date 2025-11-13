# 🔧 Backend Tools

Herramientas especializadas para desarrollo backend, APIs, bases de datos y arquitectura de servidor.

## 📋 Tabla de Contenidos

- [Frameworks y Runtimes](#frameworks-y-runtimes)
- [Bases de Datos](#bases-de-datos)
- [API Development](#api-development)
- [Authentication & Security](#authentication--security)
- [Testing](#testing)
- [Performance & Monitoring](#performance--monitoring)
- [Development Tools](#development-tools)
- [Build Tools](#build-tools)

## 🚀 Frameworks y Runtimes

### Node.js Ecosystem

#### Express.js ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Framework web minimalista y flexible para Node.js

**Instalación:**
```bash
npm install express
```

**Casos de Uso:**
- APIs REST rápidas
- Aplicaciones web tradicionales
- Microservicios
- Prototipos rápidos

**Pros:**
- ✅ Minimalista y flexible
- ✅ Enorme ecosistema de middleware
- ✅ Fácil de aprender
- ✅ Gran comunidad

**Contras:**
- ❌ Requiere mucha configuración manual
- ❌ No opinionado (puede ser pro o contra)

**Recursos:**
- [Documentación Oficial](https://expressjs.com/)
- [Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

#### NestJS ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Framework progresivo para aplicaciones Node.js empresariales

**Instalación:**
```bash
npm i -g @nestjs/cli
nest new project-name
```

**Casos de Uso:**
- Aplicaciones enterprise
- Arquitectura modular
- GraphQL APIs
- Microservicios

**Pros:**
- ✅ Arquitectura opinionada
- ✅ TypeScript first
- ✅ Dependency injection
- ✅ Documentación excelente

**Contras:**
- ❌ Curva de aprendizaje
- ❌ Overhead para proyectos simples

**Recursos:**
- [Documentación Oficial](https://nestjs.com/)
- [Recetas y Ejemplos](https://docs.nestjs.com/recipes/sql-typeorm)

---

#### Fastify ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Framework web rápido y de bajo overhead

**Instalación:**
```bash
npm install fastify
```

**Casos de Uso:**
- APIs de alta performance
- Microservicios
- Aplicaciones I/O intensivas

**Pros:**
- ✅ Muy rápido
- ✅ Validación JSON schema integrada
- ✅ Plugins potentes
- ✅ TypeScript support

**Contras:**
- ❌ Ecosistema más pequeño que Express
- ❌ Menos middleware disponible

**Recursos:**
- [Documentación Oficial](https://www.fastify.io/)
- [Plugins](https://www.fastify.io/ecosystem/)

### Python Ecosystem

#### FastAPI ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Framework moderno y rápido para construir APIs con Python

**Instalación:**
```bash
pip install fastapi uvicorn
```

**Casos de Uso:**
- APIs REST modernas
- Aplicaciones async
- Machine Learning APIs
- Microservicios

**Pros:**
- ✅ Muy rápido (Starlette + Pydantic)
- ✅ Auto-documentación (OpenAPI/Swagger)
- ✅ Type hints nativos
- ✅ Async/await support

**Contras:**
- ❌ Relativamente nuevo
- ❌ Ecosistema en crecimiento

**Recursos:**
- [Documentación Oficial](https://fastapi.tiangolo.com/)
- [Tutorial Completo](https://fastapi.tiangolo.com/tutorial/)

---

#### Django ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Framework web full-stack "batteries included"

**Instalación:**
```bash
pip install django
django-admin startproject myproject
```

**Casos de Uso:**
- Aplicaciones web completas
- Admin panels
- CMS
- Aplicaciones enterprise

**Pros:**
- ✅ Completo y maduro
- ✅ ORM potente
- ✅ Admin panel integrado
- ✅ Seguridad by default

**Contras:**
- ❌ Curva de aprendizaje
- ❌ Monolítico para microservicios

**Recursos:**
- [Documentación Oficial](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

#### Flask ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Micro-framework minimalista para Python

**Instalación:**
```bash
pip install flask
```

**Casos de Uso:**
- APIs simples
- Prototipos rápidos
- Microservicios pequeños
- Aplicaciones web ligeras

**Pros:**
- ✅ Minimalista y flexible
- ✅ Fácil de aprender
- ✅ Gran ecosistema de extensiones
- ✅ Perfecto para prototipos

**Contras:**
- ❌ Requiere configuración manual
- ❌ No async nativo (hasta 2.0)

**Recursos:**
- [Documentación Oficial](https://flask.palletsprojects.com/)
- [Flask Extensions](https://flask.palletsprojects.com/en/2.3.x/extensions/)

## 🗄️ Bases de Datos

### Herramientas de Base de Datos

#### PostgreSQL ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Base de datos relacional open-source más avanzada

**Instalación:**
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -d postgres
```

**Casos de Uso:**
- Datos relacionales complejos
- Aplicaciones enterprise
- JSONB para datos semi-estructurados
- Full-text search

**Pros:**
- ✅ Feature-rich
- ✅ ACID compliant
- ✅ Extensiones potentes
- ✅ Excelente performance

**Contras:**
- ❌ Curva de aprendizaje
- ❌ Requiere más recursos que MySQL

**Herramientas Complementarias:**
- pgAdmin - GUI management
- pg_dump/pg_restore - Backups
- pg_stat_statements - Query analysis

---

#### MongoDB ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Base de datos NoSQL orientada a documentos

**Instalación:**
```bash
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Docker
docker run --name mongodb -d mongo
```

**Casos de Uso:**
- Datos semi-estructurados
- Escalabilidad horizontal
- Prototipado rápido
- Real-time analytics

**Pros:**
- ✅ Flexible schema
- ✅ Escalabilidad horizontal
- ✅ Performance en reads
- ✅ Fácil de comenzar

**Contras:**
- ❌ No ACID por defecto
- ❌ Puede usar mucha memoria

**Herramientas Complementarias:**
- MongoDB Compass - GUI
- mongodump/mongorestore - Backups
- MongoDB Atlas - Cloud hosting

---

#### Redis ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** In-memory data store, cache y message broker

**Instalación:**
```bash
# macOS
brew install redis

# Ubuntu/Debian
sudo apt-get install redis

# Docker
docker run --name redis -d redis
```

**Casos de Uso:**
- Caching
- Session storage
- Message queues
- Real-time analytics
- Rate limiting

**Pros:**
- ✅ Extremadamente rápido
- ✅ Estructuras de datos avanzadas
- ✅ Pub/Sub integrado
- ✅ Persistencia opcional

**Contras:**
- ❌ Limitado por RAM
- ❌ Single-threaded

**Herramientas Complementarias:**
- Redis Commander - GUI
- RedisInsight - Debugging
- redis-cli - CLI tool

### ORMs y Query Builders

#### Prisma ⭐⭐⭐
**Nivel:** Esencial (Node.js)  
**Descripción:** ORM de próxima generación para Node.js y TypeScript

**Instalación:**
```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

**Casos de Uso:**
- Type-safe database access
- Auto-completion en queries
- Migraciones automáticas
- Multi-database support

**Pros:**
- ✅ Type-safety completo
- ✅ Auto-completion excelente
- ✅ Prisma Studio (GUI)
- ✅ Migraciones declarativas

**Contras:**
- ❌ Relativamente nuevo
- ❌ Queries complejas pueden ser verbosas

---

#### TypeORM ⭐⭐
**Nivel:** Recomendado (Node.js)  
**Descripción:** ORM para TypeScript y JavaScript

**Instalación:**
```bash
npm install typeorm reflect-metadata
```

**Casos de Uso:**
- Aplicaciones TypeScript
- Active Record pattern
- Multi-database support

**Pros:**
- ✅ Maduro y probado
- ✅ Soporta múltiples DBs
- ✅ Decorators para entities
- ✅ Migrations integradas

**Contras:**
- ❌ Documentación puede mejorar
- ❌ Performance overhead

---

#### SQLAlchemy ⭐⭐⭐
**Nivel:** Esencial (Python)  
**Descripción:** ORM más popular de Python

**Instalación:**
```bash
pip install sqlalchemy
```

**Casos de Uso:**
- Aplicaciones Python
- Queries complejas
- Multiple databases

**Pros:**
- ✅ Muy maduro
- ✅ Flexible (Core + ORM)
- ✅ Excelente documentación
- ✅ Gran comunidad

**Contras:**
- ❌ Curva de aprendizaje
- ❌ Puede ser verbose

## 🔌 API Development

### REST API Tools

#### Swagger/OpenAPI ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Especificación y herramientas para documentar APIs

**Instalación:**
```bash
# Node.js
npm install swagger-jsdoc swagger-ui-express

# Python (FastAPI tiene integración nativa)
pip install fastapi
```

**Casos de Uso:**
- Documentación de APIs
- Contract-first development
- API testing
- Code generation

**Pros:**
- ✅ Estándar de la industria
- ✅ UI interactivo
- ✅ Code generation
- ✅ Validación automática

**Recursos:**
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/)

---

#### Postman ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Plataforma completa para desarrollo y testing de APIs

**Instalación:**
- Descarga desde [postman.com](https://www.postman.com/downloads/)

**Casos de Uso:**
- API testing manual
- Colecciones de requests
- Automated testing
- Documentación compartida

**Pros:**
- ✅ UI intuitivo
- ✅ Colaboración en equipo
- ✅ Scripts de testing
- ✅ Mock servers

**Alternativas:**
- Insomnia
- HTTPie
- curl

### GraphQL Tools

#### Apollo Server ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Servidor GraphQL para Node.js

**Instalación:**
```bash
npm install @apollo/server graphql
```

**Casos de Uso:**
- GraphQL APIs
- Federated schemas
- Real-time subscriptions

**Pros:**
- ✅ Feature-rich
- ✅ Excelente DX
- ✅ Apollo Studio
- ✅ Gran documentación

---

#### Hasura ⭐⭐
**Nivel:** Especializado  
**Descripción:** GraphQL engine instantáneo sobre PostgreSQL

**Instalación:**
```bash
docker run -d -p 8080:8080 hasura/graphql-engine
```

**Casos de Uso:**
- GraphQL instantáneo
- Real-time queries
- Rapid prototyping

**Pros:**
- ✅ Setup instantáneo
- ✅ Real-time subscriptions
- ✅ Auto-schema generation
- ✅ Fine-grained permissions

## 🔐 Authentication & Security

#### JWT Libraries ⭐⭐⭐
**Nivel:** Esencial

**Node.js:**
```bash
npm install jsonwebtoken
```

**Python:**
```bash
pip install pyjwt
```

**Casos de Uso:**
- Stateless authentication
- API tokens
- SSO

---

#### Passport.js ⭐⭐
**Nivel:** Recomendado (Node.js)  
**Descripción:** Middleware de autenticación para Node.js

**Instalación:**
```bash
npm install passport
```

**Casos de Uso:**
- Multiple auth strategies
- OAuth integrations
- Local authentication

**Pros:**
- ✅ 500+ estrategias
- ✅ Flexible
- ✅ Bien documentado

---

#### bcrypt ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Librería para hashing de contraseñas

**Instalación:**
```bash
# Node.js
npm install bcrypt

# Python
pip install bcrypt
```

**Casos de Uso:**
- Password hashing
- Secure password storage

## 🧪 Testing

#### Jest ⭐⭐⭐
**Nivel:** Esencial (Node.js)  
**Descripción:** Framework de testing completo para JavaScript

**Instalación:**
```bash
npm install --save-dev jest
```

**Casos de Uso:**
- Unit testing
- Integration testing
- Mocking
- Code coverage

**Pros:**
- ✅ Zero config
- ✅ Snapshot testing
- ✅ Excelente DX
- ✅ Watch mode

---

#### Pytest ⭐⭐⭐
**Nivel:** Esencial (Python)  
**Descripción:** Framework de testing para Python

**Instalación:**
```bash
pip install pytest
```

**Casos de Uso:**
- Unit testing
- Fixtures
- Parametrized testing

**Pros:**
- ✅ Sintaxis simple
- ✅ Fixtures potentes
- ✅ Plugins extensos
- ✅ Detailed assertions

---

#### Supertest ⭐⭐
**Nivel:** Recomendado (Node.js)  
**Descripción:** Testing HTTP assertions para APIs

**Instalación:**
```bash
npm install --save-dev supertest
```

**Casos de Uso:**
- API testing
- Integration tests
- E2E tests

## 📊 Performance & Monitoring

#### NewRelic ⭐⭐
**Nivel:** Recomendado  
**Descripción:** Application Performance Monitoring

**Casos de Uso:**
- Performance monitoring
- Error tracking
- Transaction tracing

**Alternativas:**
- DataDog
- Dynatrace
- AppDynamics

---

#### Sentry ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Error tracking y monitoring

**Instalación:**
```bash
# Node.js
npm install @sentry/node

# Python
pip install sentry-sdk
```

**Casos de Uso:**
- Error tracking
- Performance monitoring
- Release tracking

**Pros:**
- ✅ Fácil integración
- ✅ Source maps support
- ✅ Release tracking
- ✅ Breadcrumbs

---

#### Clinic.js ⭐⭐
**Nivel:** Especializado (Node.js)  
**Descripción:** Performance profiling para Node.js

**Instalación:**
```bash
npm install -g clinic
```

**Casos de Uso:**
- Performance bottlenecks
- Memory leaks
- Event loop delays

## 🛠️ Development Tools

#### Nodemon ⭐⭐⭐
**Nivel:** Esencial (Node.js)  
**Descripción:** Auto-restart en desarrollo

**Instalación:**
```bash
npm install --save-dev nodemon
```

**Casos de Uso:**
- Development auto-reload
- Watch mode

---

#### dotenv ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Cargar variables de entorno desde .env

**Instalación:**
```bash
# Node.js
npm install dotenv

# Python
pip install python-dotenv
```

**Casos de Uso:**
- Environment variables
- Configuration management
- Secrets management

---

#### ESLint ⭐⭐⭐
**Nivel:** Esencial (JavaScript/TypeScript)  
**Descripción:** Linter para JavaScript y TypeScript

**Instalación:**
```bash
npm install --save-dev eslint
```

**Casos de Uso:**
- Code quality
- Style enforcement
- Bug prevention

---

#### Prettier ⭐⭐⭐
**Nivel:** Esencial  
**Descripción:** Code formatter

**Instalación:**
```bash
npm install --save-dev prettier
```

**Casos de Uso:**
- Code formatting
- Style consistency

## 📚 Recursos Adicionales

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Python Best Practices](https://docs.python-guide.org/)
- [API Design Guidelines](https://swagger.io/resources/articles/best-practices-in-api-design/)
- [Database Design Principles](https://www.postgresql.org/docs/current/tutorial.html)

## 🔗 Links Útiles

- [Tools Collection Home](../README.md)
- [Frontend Tools](../frontend/README.md)
- [DevOps Tools](../devops/README.md)
- [Security Tools](../security/README.md)
- [QA Tools](../qa/README.md)

---

_Backend Tools - Construyendo APIs robustas y escalables_ 🔧
