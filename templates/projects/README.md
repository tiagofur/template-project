# 🚀 Project Templates

Plantillas reutilizables para diferentes stacks tecnológicos, listas para usar en producción con documentación completa, configuraciones y mejores prácticas.

## 📋 Templates Disponibles

| Template | Descripción | Stack Principal | Casos de Uso |
|----------|-------------|-----------------|--------------|
| [**Full-Stack**](./full-stack/README.md) | Aplicación web completa | React + Node.js + PostgreSQL | Web apps, SaaS, dashboards |
| [**Mobile Backend**](./mobile-backend/README.md) | Backend para apps móviles | Node.js + Firebase + WebSocket | Apps iOS/Android |
| [**Flutter Backend**](./flutter-backend/README.md) | Backend optimizado para Flutter | Node.js + Firebase + TypeScript | Apps Flutter multiplataforma |
| [**Microservices**](./microservices/README.md) | Arquitectura de microservicios | Kubernetes + Kafka + Istio | Apps empresariales escalables |
| [**Serverless**](./serverless/README.md) | Arquitectura serverless | AWS Lambda + API Gateway | APIs, webhooks, event-driven |
| [**Monorepo**](./monorepo/README.md) | Repositorio multi-proyecto | Turborepo + pnpm workspaces | Múltiples apps relacionadas |

## 🎯 Cómo Elegir un Template

### Full-Stack
**Elige cuando necesites:**
- ✅ Aplicación web tradicional con frontend y backend
- ✅ Dashboard administrativo
- ✅ SaaS con autenticación y base de datos
- ✅ API REST + interfaz web
- ✅ Despliegue en servidor tradicional o cloud

**Tecnologías:**
- Frontend: React, TypeScript, Vite, TailwindCSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL con Prisma ORM
- DevOps: Docker, Docker Compose, GitHub Actions

---

### Mobile Backend
**Elige cuando necesites:**
- ✅ Backend para app iOS/Android
- ✅ Push notifications (FCM, APNs)
- ✅ Upload de archivos multimedia
- ✅ Real-time messaging
- ✅ Sincronización offline
- ✅ Analytics y tracking

**Tecnologías:**
- Backend: Node.js, Express, TypeScript
- Auth: JWT + OAuth (Google, Apple, Facebook)
- Push: Firebase Cloud Messaging
- Storage: AWS S3 o Firebase Storage
- Real-time: WebSocket, Socket.io

---

### Flutter Backend
**Elige cuando necesites:**
- ✅ Backend específico para Flutter
- ✅ Type-safe API con generación de código Dart
- ✅ Integración completa con Firebase
- ✅ Soporte para iOS, Android, Web, Desktop
- ✅ State sync con Riverpod/Bloc
- ✅ Platform channels

**Tecnologías:**
- Backend: Node.js, TypeScript
- Firebase: Auth, Firestore, Storage, Functions
- Code Gen: OpenAPI → Dart models
- Mobile: Flutter con Riverpod/Bloc

---

### Microservices
**Elige cuando necesites:**
- ✅ Alta escalabilidad horizontal
- ✅ Equipos independientes por servicio
- ✅ Deploy independiente de servicios
- ✅ Resiliencia ante fallos
- ✅ Tecnologías diferentes por servicio
- ✅ Sistema empresarial complejo

**Tecnologías:**
- Orchestration: Kubernetes
- Service Mesh: Istio
- API Gateway: Kong
- Messaging: Kafka, RabbitMQ
- Databases: PostgreSQL, MongoDB, Redis (per service)
- Monitoring: Prometheus, Grafana, Jaeger

---

### Serverless
**Elige cuando necesites:**
- ✅ Escala automática infinita
- ✅ Pay-per-use (costo variable)
- ✅ Zero infrastructure management
- ✅ Event-driven architecture
- ✅ APIs simples y webhooks
- ✅ Procesamiento de trabajos asíncronos

**Tecnologías:**
- Compute: AWS Lambda, Cloud Functions, Azure Functions
- API: API Gateway, HTTP triggers
- Storage: DynamoDB, S3, Firestore
- Events: SQS, SNS, EventBridge
- IaC: Serverless Framework, SAM, Terraform

---

### Monorepo
**Elige cuando necesites:**
- ✅ Múltiples apps relacionadas (web, mobile, API)
- ✅ Compartir código entre proyectos
- ✅ Versioning sincronizado
- ✅ Build y deploy unificado
- ✅ Dependencias compartidas
- ✅ Un solo CI/CD para todo

**Tecnologías:**
- Workspaces: pnpm, npm, Yarn
- Build: Turborepo
- Apps: Next.js, React Native, Express
- Packages: UI components, utils, types
- Testing: Jest, Vitest, Playwright

## 🚀 Guía de Inicio Rápido

### Paso 1: Seleccionar Template

```bash
# Navegar a los templates
cd templates/projects

# Ver templates disponibles
ls -la

# Full-Stack
# Mobile-Backend
# Flutter-Backend
# Microservices
# Serverless
# Monorepo
```

### Paso 2: Copiar Template al Proyecto

```bash
# Copiar template elegido
cp -r templates/projects/[TEMPLATE]/* mi-nuevo-proyecto/
cd mi-nuevo-proyecto

# Ejemplo: Full-Stack
cp -r templates/projects/full-stack/* mi-app-fullstack/
cd mi-app-fullstack
```

### Paso 3: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus credenciales
nano .env  # o tu editor favorito
```

### Paso 4: Instalar Dependencias

```bash
# Full-Stack / Mobile-Backend / Flutter-Backend
cd backend && npm install
cd ../frontend && npm install  # Si aplica

# Microservices
cd services/[service-name] && npm install

# Serverless
npm install

# Monorepo
pnpm install  # o npm install
```

### Paso 5: Iniciar Desarrollo

```bash
# Con Docker (recomendado)
docker-compose up -d

# O manualmente
npm run dev
```

## 📖 Estructura de Cada Template

Todos los templates incluyen:

### ✅ Documentación Completa
- `README.md` - Overview y quick start
- `docs/` - Documentación detallada
  - `architecture/` - Diagramas y decisiones de arquitectura
  - `api/` - Documentación de API
  - `deployment/` - Guías de deployment
  - `troubleshooting.md` - Solución de problemas comunes

### ✅ Configuración Lista para Producción
- `.env.example` - Variables de entorno documentadas
- `docker-compose.yml` - Configuración de Docker
- Dockerfiles optimizados
- `tsconfig.json` - TypeScript configurado
- ESLint y Prettier configurados

### ✅ CI/CD Configurado
- `.github/workflows/` - GitHub Actions
  - `ci.yml` - Tests y linting automáticos
  - `deploy.yml` - Deployment automatizado
  - `security.yml` - Security scanning

### ✅ Testing Setup
- Tests unitarios con Jest/Vitest
- Tests de integración
- Tests E2E con Playwright (cuando aplica)
- Coverage configurado

### ✅ Mejores Prácticas
- Estructura de carpetas organizada
- Separation of concerns
- Error handling
- Logging estructurado
- Security best practices
- Performance optimization

## 🎯 Mejores Prácticas Generales

### Antes de Empezar

1. **Lee el README del template** completo antes de empezar
2. **Revisa la documentación** en `/docs`
3. **Entiende la arquitectura** antes de hacer cambios
4. **Configura las variables de entorno** apropiadamente
5. **Ejecuta los tests** para verificar que todo funciona

### Durante el Desarrollo

1. **Sigue la estructura** establecida por el template
2. **Escribe tests** para nuevo código
3. **Documenta cambios** significativos
4. **Usa git** con commits descriptivos
5. **Revisa logs** regularmente

### Antes de Deploy

1. **Ejecuta todos los tests** y asegúrate que pasen
2. **Revisa el linting** y corrige warnings
3. **Actualiza documentación** si cambió funcionalidad
4. **Verifica variables de entorno** de producción
5. **Haz backup** de datos críticos

## 🔧 Customización

Cada template es completamente customizable. Áreas comunes de customización:

### Branding
- Cambiar nombre de la app
- Actualizar logos y assets
- Modificar color scheme
- Personalizar metadata

### Features
- Agregar/remover módulos
- Cambiar proveedores de servicios (ej: Firebase → Supabase)
- Integrar servicios adicionales
- Modificar flujos de autenticación

### Infrastructure
- Cambiar base de datos (PostgreSQL → MongoDB)
- Usar diferente cloud provider
- Modificar configuración de Docker
- Ajustar recursos (CPU, memoria)

## 📚 Recursos Adicionales

### Documentación del Proyecto
- [Biblioteca de Prompts](../../prompts/README.md)
- [Herramientas por Stack](../../tools/README.md)
- [Mejores Prácticas](../../INSTRUCTIONS.md)

### Documentación Externa
- [React Documentation](https://react.dev)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

## 🤝 Contribuir

¿Tienes sugerencias para mejorar estos templates?

1. Abre un issue describiendo la mejora
2. Crea un PR con los cambios propuestos
3. Asegúrate de actualizar documentación
4. Incluye tests si aplica

## 📝 License

Estos templates son open source bajo licencia MIT.

---

## 🎓 Learning Path

### Principiante → Intermedio
1. Empieza con **Full-Stack** template
2. Aprende Docker y CI/CD
3. Practica con **Mobile Backend** o **Flutter Backend**
4. Explora **Serverless** para arquitecturas modernas

### Intermedio → Avanzado
1. Estudia **Microservices** architecture
2. Implementa **Monorepo** para proyectos grandes
3. Combina templates según necesidades
4. Crea tus propios templates basados en estos

---

_Templates diseñados para acelerar tu desarrollo con mejores prácticas desde el día 1_ 🚀
