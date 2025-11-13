# 🚀 Full-Stack Project Template

Template completo para aplicaciones full-stack con React frontend y Node.js backend.

## 📋 Overview

Este template proporciona una base sólida para desarrollar aplicaciones web full-stack modernas con:
- **Frontend**: React 18+ con TypeScript, Vite, y TailwindCSS
- **Backend**: Node.js con Express, TypeScript, y arquitectura limpia
- **Database**: PostgreSQL con Prisma ORM
- **Authentication**: JWT con bcrypt
- **Testing**: Jest para backend, Vitest para frontend
- **DevOps**: Docker, Docker Compose, CI/CD con GitHub Actions

## ✨ Features

### Frontend
- ⚛️ React 18 con TypeScript
- 🎨 TailwindCSS para estilos
- 🚀 Vite para desarrollo rápido
- 📱 Responsive design
- 🔐 Authentication integrada
- 🧪 Testing con Vitest y React Testing Library
- 📊 Estado global con Zustand
- 🌐 React Router para navegación
- 🎯 Formularios con React Hook Form
- ✅ Validación con Zod

### Backend
- 🟢 Node.js con Express y TypeScript
- 🗄️ PostgreSQL con Prisma ORM
- 🔐 Autenticación JWT
- 📝 Validación de datos con Zod
- 🧪 Testing con Jest y Supertest
- 📚 Documentación de API con Swagger
- 🔄 Migraciones de base de datos
- 🛡️ Seguridad con Helmet
- 📊 Logging estructurado
- 🎯 Arquitectura en capas (Controllers, Services, Repositories)

### DevOps
- 🐳 Docker y Docker Compose
- 🔄 CI/CD con GitHub Actions
- 📦 Gestión de dependencias automatizada
- 🧪 Tests automatizados en CI
- 🚀 Deployment scripts
- 📊 Health checks y monitoring

## 🏗️ Estructura del Proyecto

```
full-stack/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API clients
│   │   ├── store/           # Estado global (Zustand)
│   │   ├── utils/           # Utilidades
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Componente principal
│   ├── public/              # Assets estáticos
│   ├── tests/               # Tests
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── services/        # Lógica de negocio
│   │   ├── repositories/    # Acceso a datos
│   │   ├── middlewares/     # Middleware personalizado
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Definición de rutas
│   │   ├── utils/           # Utilidades
│   │   ├── types/           # TypeScript types
│   │   ├── config/          # Configuración
│   │   └── server.ts        # Punto de entrada
│   ├── prisma/              # Esquemas y migraciones
│   ├── tests/               # Tests
│   ├── package.json
│   └── tsconfig.json
│
├── config/                  # Configuración compartida
│   ├── docker/              # Dockerfiles
│   ├── nginx/               # Configuración de Nginx
│   └── ssl/                 # Certificados SSL
│
├── docs/                    # Documentación
│   ├── api/                 # Documentación de API
│   ├── deployment/          # Guías de deployment
│   └── architecture/        # Diagramas de arquitectura
│
├── .github/
│   └── workflows/           # GitHub Actions
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml       # Configuración de Docker Compose
├── .env.example            # Variables de entorno de ejemplo
└── README.md               # Este archivo
```

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+ 
- Docker y Docker Compose
- PostgreSQL (o usar Docker)
- Git

### Instalación

1. **Clonar/Copiar el template**
   ```bash
   # Copiar la carpeta del template a tu nuevo proyecto
   cp -r templates/projects/full-stack/* mi-nuevo-proyecto/
   cd mi-nuevo-proyecto
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Iniciar con Docker Compose (Recomendado)**
   ```bash
   docker-compose up -d
   ```
   
   Esto iniciará:
   - Frontend en http://localhost:5173
   - Backend en http://localhost:3000
   - PostgreSQL en localhost:5432
   - PgAdmin en http://localhost:5050

4. **O instalar manualmente**
   
   **Backend:**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📖 Guías Detalladas

### Configuración

#### Variables de Entorno

**Backend (.env)**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME="Mi Aplicación"
```

### Desarrollo

#### Ejecutar Tests

**Backend**
```bash
cd backend
npm test                  # Todos los tests
npm run test:watch       # Watch mode
npm run test:coverage    # Con cobertura
```

**Frontend**
```bash
cd frontend
npm test                 # Todos los tests
npm run test:ui          # UI de testing
npm run test:coverage    # Con cobertura
```

#### Linting y Formatting

```bash
# Backend
cd backend
npm run lint            # ESLint
npm run format          # Prettier

# Frontend
cd frontend
npm run lint
npm run format
```

#### Migraciones de Base de Datos

```bash
cd backend

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
npx prisma migrate deploy

# Reset de base de datos (desarrollo)
npx prisma migrate reset

# Generar Prisma Client
npx prisma generate

# Abrir Prisma Studio
npx prisma studio
```

### Build y Deployment

#### Build para Producción

**Backend**
```bash
cd backend
npm run build
npm start  # Ejecutar build
```

**Frontend**
```bash
cd frontend
npm run build
# Los archivos estarán en dist/
```

#### Docker Build

```bash
# Build de imágenes
docker-compose build

# Build específico
docker-compose build frontend
docker-compose build backend

# Build sin caché
docker-compose build --no-cache
```

#### Deploy

Ver la [Guía de Deployment](./docs/deployment/README.md) para instrucciones detalladas sobre:
- Deploy a AWS/Azure/GCP
- Configuración de CI/CD
- Variables de entorno en producción
- Monitoreo y logging
- Backup y recuperación

## 🎯 Best Practices

### Código

1. **TypeScript Strict Mode**: Usar tipado estricto
2. **Componentes Pequeños**: Dividir componentes grandes
3. **Custom Hooks**: Extraer lógica reutilizable
4. **Error Handling**: Manejar errores apropiadamente
5. **Async/Await**: Usar en lugar de callbacks
6. **Validación**: Validar datos de entrada con Zod
7. **Testing**: Mantener cobertura >80%
8. **Comentarios**: Solo cuando sea necesario explicar "por qué"

### Seguridad

1. **No hardcodear secrets**: Usar variables de entorno
2. **Validar inputs**: Siempre validar datos del usuario
3. **Rate Limiting**: Implementado por defecto
4. **CORS**: Configurar apropiadamente
5. **SQL Injection**: Usar Prisma (protección automática)
6. **XSS**: Sanitizar outputs
7. **JWT**: Rotación de tokens
8. **HTTPS**: Siempre en producción

### Performance

1. **Lazy Loading**: Cargar componentes bajo demanda
2. **Memoization**: React.memo para componentes pesados
3. **Code Splitting**: Dividir bundles
4. **Caching**: Implementar estrategias de caché
5. **Optimistic Updates**: Mejorar UX
6. **Database Indexes**: Indexar queries frecuentes
7. **CDN**: Para assets estáticos
8. **Compression**: Gzip/Brotli habilitado

### Git Workflow

1. **Feature Branches**: Crear branch por feature
2. **Conventional Commits**: Seguir estándar de commits
3. **Pull Requests**: Siempre hacer code review
4. **Tests**: No mergear sin tests pasando
5. **Lint**: Código debe pasar linting
6. **Squash Commits**: Mantener historia limpia

## 🔧 Troubleshooting

### Problemas Comunes

#### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar variables de entorno
cat .env | grep DATABASE_URL
```

#### Error: "Port already in use"
```bash
# Cambiar puerto en .env
# O matar proceso en el puerto
lsof -ti:3000 | xargs kill -9
```

#### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Frontend no se conecta al backend
```bash
# Verificar CORS en backend
# Verificar VITE_API_URL en frontend/.env
# Verificar que backend esté corriendo
curl http://localhost:3000/health
```

### Logs y Debugging

```bash
# Ver todos los logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend

# Entrar a contenedor
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 📚 Recursos Adicionales

### Documentación
- [API Documentation](./docs/api/README.md)
- [Architecture](./docs/architecture/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Contributing Guide](./CONTRIBUTING.md)

### Links Útiles
- [React Documentation](https://react.dev)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

## 🤝 Contributing

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para guías de contribución.

## 📝 License

Este template es de código abierto y está disponible bajo la licencia MIT.

---

**¿Necesitas ayuda?** Abre un issue o consulta la documentación en `/docs`.

_Template creado con ❤️ para acelerar el desarrollo full-stack_
