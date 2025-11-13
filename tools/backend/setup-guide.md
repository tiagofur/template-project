# 🔧 Backend Project Setup Guide

Guía completa para configurar un proyecto backend desde cero con mejores prácticas.

## 📋 Tabla de Contenidos

- [Decisiones Iniciales](#decisiones-iniciales)
- [Setup Node.js](#setup-nodejs)
- [Setup Python](#setup-python)
- [Estructura de Proyecto](#estructura-de-proyecto)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Setup de Testing](#setup-de-testing)
- [Variables de Entorno](#variables-de-entorno)
- [Checklist Final](#checklist-final)

## 🎯 Decisiones Iniciales

### 1. Seleccionar Stack Principal

#### Node.js Stack
**Cuándo elegir:**
- Aplicación JavaScript full-stack
- Real-time features (WebSockets)
- Microservicios ligeros
- API REST/GraphQL

**Stack recomendado:**
```
Runtime: Node.js 18+ LTS
Framework: Express.js o NestJS
Database: PostgreSQL + Redis
ORM: Prisma
Testing: Jest + Supertest
```

#### Python Stack
**Cuándo elegir:**
- Data science/ML integration
- Scripting complejo
- APIs robustas
- Proyectos científicos

**Stack recomendado:**
```
Runtime: Python 3.11+
Framework: FastAPI o Django
Database: PostgreSQL + Redis
ORM: SQLAlchemy
Testing: Pytest
```

## 🚀 Setup Node.js

### 1. Inicializar Proyecto

```bash
# Crear directorio
mkdir my-backend-api
cd my-backend-api

# Inicializar git
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
echo "coverage/" >> .gitignore

# Inicializar npm
npm init -y
```

### 2. Instalar Dependencias Esenciales

#### Express.js
```bash
npm install express
npm install --save-dev typescript @types/node @types/express
npm install --save-dev nodemon ts-node

# Setup TypeScript
npx tsc --init
```

#### NestJS
```bash
npm i -g @nestjs/cli
nest new my-backend-api
cd my-backend-api
```

### 3. Estructura de Proyecto (Express + TypeScript)

```
my-backend-api/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── utils/
│   │   └── logger.ts
│   └── app.ts
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

### 4. Configurar TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 5. Setup Scripts

```json
// package.json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

### 6. Configurar Express App Básico

```typescript
// src/app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

## 🐍 Setup Python

### 1. Inicializar Proyecto

```bash
# Crear directorio
mkdir my-backend-api
cd my-backend-api

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Inicializar git
git init
echo "venv/" > .gitignore
echo ".env" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
```

### 2. Instalar Dependencias

#### FastAPI
```bash
pip install fastapi uvicorn[standard]
pip install python-dotenv pydantic-settings
pip install sqlalchemy psycopg2-binary
pip install pytest pytest-asyncio httpx

# Guardar dependencias
pip freeze > requirements.txt
```

### 3. Estructura de Proyecto (FastAPI)

```
my-backend-api/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           └── users.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   └── session.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── user.py
│   └── main.py
├── tests/
│   ├── __init__.py
│   └── test_api.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

### 4. Configurar FastAPI App Básico

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {"status": "OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🗄️ Configuración de Base de Datos

### PostgreSQL con Prisma (Node.js)

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

```bash
# Crear migración
npx prisma migrate dev --name init

# Generar cliente
npx prisma generate
```

### PostgreSQL con SQLAlchemy (Python)

```python
# app/db/base.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

```python
# app/models/user.py
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

## 🧪 Setup de Testing

### Jest (Node.js)

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
npx ts-jest config:init
```

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Pytest (Python)

```bash
pip install pytest pytest-asyncio pytest-cov httpx
```

```ini
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --cov=app
    --cov-report=html
    --cov-report=term-missing
    -v
```

## 🔐 Variables de Entorno

### .env.example (Node.js)

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### .env.example (Python)

```bash
# Application
PROJECT_NAME="My API"
API_V1_STR="/api/v1"
DEBUG=True

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Security
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

## ✅ Checklist Final

### Setup Básico
- [ ] Proyecto inicializado con git
- [ ] Dependencias instaladas
- [ ] TypeScript/Python configurado
- [ ] Estructura de directorios creada
- [ ] Scripts npm/make configurados

### Seguridad
- [ ] Variables de entorno configuradas
- [ ] .env en .gitignore
- [ ] Helmet/security headers configurados
- [ ] CORS configurado
- [ ] Rate limiting considerado

### Base de Datos
- [ ] Conexión a base de datos
- [ ] Modelos definidos
- [ ] Migraciones creadas
- [ ] Seeds/fixtures (opcional)

### Testing
- [ ] Framework de testing instalado
- [ ] Tests de ejemplo funcionando
- [ ] Coverage configurado
- [ ] CI setup (opcional)

### Desarrollo
- [ ] Hot reload funcionando
- [ ] Logging configurado
- [ ] Error handling básico
- [ ] Health check endpoint
- [ ] README con instrucciones

### Documentación
- [ ] API documentation (Swagger/OpenAPI)
- [ ] README completo
- [ ] .env.example actualizado
- [ ] Comentarios en código crítico

## 🚀 Próximos Pasos

1. **Implementar Autenticación**
   - JWT tokens
   - Refresh tokens
   - Password hashing

2. **Agregar Validación**
   - Input validation
   - Schema validation
   - Custom validators

3. **Setup CI/CD**
   - GitHub Actions
   - Tests automáticos
   - Deployment pipeline

4. **Monitoring**
   - Logging estructurado
   - Error tracking (Sentry)
   - Performance monitoring

5. **Documentación API**
   - Swagger/OpenAPI spec
   - Postman collection
   - API examples

## 📚 Recursos

- [Backend Tools](./README.md)
- [Best Practices](../BEST_PRACTICES.md)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [12 Factor App](https://12factor.net/)

---

_Backend Setup Guide - Construyendo APIs robustas desde cero_ 🔧
