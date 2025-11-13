# 👋 Guía de Onboarding para Nuevos Desarrolladores

Bienvenido al equipo de **[NOMBRE DEL PROYECTO]**! Esta guía te ayudará a ponerte al día rápidamente.

## 📋 Checklist de Onboarding

### Día 1: Setup y Configuración ✨

- [ ] Acceso al repositorio de GitHub
- [ ] Acceso a herramientas de comunicación (Slack/Discord/etc.)
- [ ] Configuración del entorno de desarrollo local
- [ ] Instalación de herramientas requeridas
- [ ] Configuración de IDE y extensiones
- [ ] Clonar repositorio y ejecutar proyecto localmente
- [ ] Revisar README principal y documentación base
- [ ] Presentación con el equipo

### Semana 1: Familiarización 📚

- [ ] Leer documentación de arquitectura completa
- [ ] Comprender el stack tecnológico
- [ ] Revisar estándares de código y guía de estilo
- [ ] Ejecutar tests y entender coverage
- [ ] Explorar la estructura del proyecto
- [ ] Hacer primer commit (fix typo o pequeña mejora en docs)
- [ ] Participar en daily standup/sync meetings
- [ ] Revisar PRs recientes del equipo

### Semana 2-4: Primeros Tickets 🎯

- [ ] Tomar primer bug fix (good-first-issue)
- [ ] Implementar primera feature pequeña
- [ ] Realizar code review de otros PRs
- [ ] Contribuir a documentación (mejorar algo que encuentres confuso)
- [ ] Participar en sesiones de pair programming
- [ ] Presentar tu trabajo al equipo
- [ ] Proponer una mejora o sugerencia

## 🛠️ Setup del Entorno de Desarrollo

### Prerequisitos

Lista de herramientas que necesitas instalar:

- **Node.js**: >= [VERSION] ([Usar nvm](https://github.com/nvm-sh/nvm))
- **Package Manager**: [npm/pnpm/yarn]
- **Docker**: [VERSION] ([Instalar](https://docs.docker.com/get-docker/))
- **Git**: >= 2.30
- **[Otras herramientas específicas del proyecto]**

### Instalación de Herramientas

#### Node.js con nvm

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Instalar Node.js
nvm install [VERSION]
nvm use [VERSION]
```

#### Package Manager

```bash
# npm (incluido con Node.js)
npm install -g npm@latest

# O pnpm (recomendado)
npm install -g pnpm

# O yarn
npm install -g yarn
```

#### Docker

```bash
# Verificar instalación
docker --version
docker-compose --version
```

### Configuración de Git

```bash
# Configuración global
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Configuración del proyecto
git config core.autocrlf input  # Linux/Mac
git config core.autocrlf true   # Windows
```

### Extensiones de IDE Recomendadas

#### VS Code

Instala estas extensiones para una mejor experiencia:

- **ESLint** - Linting de JavaScript/TypeScript
- **Prettier** - Formateo de código
- **GitLens** - Supercharge Git
- **Docker** - Soporte para Docker
- **Thunder Client / REST Client** - Testing de APIs
- **Markdown All in One** - Markdown support
- **[Extension específica del stack]**

#### Configuración de VS Code

Crea `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

## 🚀 Configuración Inicial del Proyecto

### 1. Clonar el Repositorio

```bash
# Clone con SSH (recomendado)
git clone git@github.com:[org]/[project].git
cd [project]

# O con HTTPS
git clone https://github.com/[org]/[project].git
cd [project]
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
[npm install / pnpm install / yarn install]

# Verificar que no haya vulnerabilidades
[npm audit / pnpm audit / yarn audit]
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores locales
# Ver documentación de variables en docs/configuration.md
```

Variables comunes a configurar:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API Keys (pedir al equipo)
API_KEY=
API_SECRET=

# Other configurations
PORT=3000
NODE_ENV=development
```

### 4. Iniciar Servicios con Docker

```bash
# Iniciar base de datos y otros servicios
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps
```

### 5. Ejecutar Migraciones de Base de Datos

```bash
# Ejecutar migraciones
[npm run db:migrate / pnpm db:migrate]

# Seed data (opcional, para desarrollo)
[npm run db:seed / pnpm db:seed]
```

### 6. Iniciar el Servidor de Desarrollo

```bash
# Iniciar servidor
[npm run dev / pnpm dev]

# Verificar que esté funcionando
# Abrir: http://localhost:[PORT]
```

### 7. Ejecutar Tests

```bash
# Ejecutar todos los tests
[npm test / pnpm test]

# Tests con coverage
[npm run test:coverage / pnpm test:coverage]

# Tests en modo watch
[npm run test:watch / pnpm test:watch]
```

## 📚 Recursos Esenciales

### Documentación del Proyecto

| Documento | Descripción | Prioridad |
| --------- | ----------- | --------- |
| [Architecture Overview](../architecture/overview.md) | Visión general del sistema | 🔴 Alta |
| [API Documentation](../api/README.md) | Documentación de APIs | 🔴 Alta |
| [Development Guide](../guides/development.md) | Guía de desarrollo | 🔴 Alta |
| [Testing Guide](../guides/testing.md) | Estrategias de testing | 🟡 Media |
| [Deployment Guide](../guides/deployment.md) | Proceso de deployment | 🟢 Baja |

### Estándares de Código

- [Code Style Guide](code-standards.md) - Guía de estilo de código
- [Git Workflow](workflow.md) - Workflow de Git y branches
- [PR Guidelines](../../CONTRIBUTING.md) - Guía para Pull Requests
- [Commit Convention](commit-convention.md) - Convención de commits

### Recursos Externos

- [Documentación de [Stack Principal]]()
- [Best Practices de [Tecnología]]()
- [Design Patterns utilizados]()

## 🔄 Workflow de Desarrollo

### 1. Tomar un Ticket

```bash
# Asegurarse de tener la última versión
git checkout main
git pull origin main

# Crear branch desde main
git checkout -b [tipo]/[ticket-id]-descripcion-corta

# Ejemplos:
# git checkout -b feature/USER-123-add-login
# git checkout -b fix/BUG-456-fix-header-crash
# git checkout -b docs/DOC-789-update-readme
```

### 2. Desarrollo

#### TDD (Test-Driven Development)

```bash
# 1. Escribir test que falle
# 2. Implementar código mínimo para pasar el test
# 3. Refactorizar
# 4. Repetir
```

#### Commits

```bash
# Hacer commits pequeños y frecuentes
git add [archivos]
git commit -m "tipo(scope): descripción"

# Ejemplos de tipos: feat, fix, docs, style, refactor, test, chore
# feat(auth): add login endpoint
# fix(ui): resolve button alignment issue
# docs(readme): update installation steps
```

#### Testing

```bash
# Ejecutar tests relacionados
[npm test -- path/to/test]

# Verificar coverage
[npm run test:coverage]

# Mantener coverage > [X]%
```

### 3. Code Review

#### Crear Pull Request

```bash
# Push de tu branch
git push origin [nombre-branch]

# Crear PR en GitHub con el template
# Completar todos los campos del template
```

#### Checklist antes de crear PR

- [ ] Todos los tests pasan localmente
- [ ] Coverage cumple con el mínimo
- [ ] Código sigue los estándares
- [ ] Documentación actualizada
- [ ] No hay console.logs o debugging code
- [ ] PR description es clara y completa
- [ ] Screenshots si hay cambios UI

#### Durante Code Review

- Responder a comentarios constructivamente
- Hacer cambios solicitados
- Re-request review después de cambios
- Agradecer al reviewer

### 4. Merge y Deploy

```bash
# Después de aprobación
# El PR será merged por el reviewer o tú mismo
# Seguir las instrucciones del equipo para deploy
```

## 🤝 Cultura del Equipo

### Comunicación

- **Daily Standup**: [Horario] ([Formato: sync/async])
- **Sprint Planning**: [Día y horario]
- **Retrospective**: [Día y horario]
- **Office Hours**: [Horarios disponibles para consultas]

### Canales de Comunicación

- **Slack/Discord**: Para comunicación diaria
  - `#general` - Anuncios generales
  - `#development` - Discusiones técnicas
  - `#random` - Chat casual
- **GitHub Discussions**: Para decisiones técnicas que requieren documentación
- **Meetings**: Para planning, retros, sync sessions

### Best Practices del Equipo

- ✅ **Hacer preguntas** - No hay preguntas tontas, todos aprendemos
- ✅ **Documentar decisiones** - ADRs para decisiones arquitectónicas
- ✅ **Compartir conocimiento** - Brown bags, pair programming
- ✅ **Pedir ayuda** - Si estás bloqueado más de 30 min, pide ayuda
- ✅ **Dar feedback constructivo** - Enfocado en el código, no en la persona
- ✅ **Celebrar logros** - Del equipo y individuales
- ✅ **Fail fast, learn faster** - Los errores son oportunidades de aprendizaje

## 🆘 Troubleshooting Común

### Problema: Docker no inicia los servicios

```bash
# Verificar que Docker está corriendo
docker ps

# Limpiar y reiniciar
docker-compose down -v
docker-compose up -d

# Ver logs si hay errores
docker-compose logs -f [service-name]
```

### Problema: Tests fallan localmente pero pasan en CI

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
[package-manager] install

# Verificar versión de Node
node --version  # Debe coincidir con .nvmrc

# Limpiar cache de tests
[npm/pnpm] test -- --clearCache
```

### Problema: Conflictos de merge

```bash
# Actualizar main
git checkout main
git pull origin main

# Rebase tu branch
git checkout [tu-branch]
git rebase main

# Si hay conflictos, resolverlos manualmente
# Luego continuar rebase
git add [archivos-resueltos]
git rebase --continue

# Si algo sale mal, abortar y pedir ayuda
git rebase --abort
```

### Problema: Puerto ya en uso

```bash
# Encontrar proceso usando el puerto
# Linux/Mac:
lsof -i :[PORT]
kill -9 [PID]

# Windows:
netstat -ano | findstr :[PORT]
taskkill /PID [PID] /F

# O cambiar puerto en .env
PORT=[NUEVO_PORT]
```

### Problema: Base de datos con estado inconsistente

```bash
# Reset completo de base de datos
docker-compose down -v
docker-compose up -d
[package-manager] run db:migrate
[package-manager] run db:seed
```

## 📞 Contactos Clave

| Rol | Nombre | Slack/Email | Responsabilidad |
| --- | ------ | ----------- | --------------- |
| Tech Lead | [@tech-lead] | @handle | Arquitectura, decisiones técnicas |
| DevOps | [@devops] | @handle | Infraestructura, CI/CD, deployment |
| PM | [@pm] | @handle | Requerimientos, prioridades |
| QA Lead | [@qa-lead] | @handle | Testing, calidad |
| Frontend Lead | [@frontend] | @handle | Frontend, UI/UX |
| Backend Lead | [@backend] | @handle | Backend, APIs, database |

## 🎯 Objetivos de los Primeros 90 Días

### Mes 1: Fundamentos 🌱

**Objetivo**: Familiarizarte con el código y el equipo

- Entender la arquitectura completa del sistema
- Dominar el workflow de desarrollo
- Completar 5-10 tickets pequeños (bugs, mejoras menores)
- Hacer al menos 5 code reviews
- Participar activamente en team meetings

**Medidas de éxito:**
- Puedes navegar el codebase sin ayuda
- Entiendes cómo deployar tu código
- Has contribuido a conversaciones técnicas

### Mes 2: Contribución Activa 🚀

**Objetivo**: Convertirte en un contributor productivo

- Trabajar en features de complejidad media
- Mejorar documentación existente
- Participar en decisiones de diseño
- Mentorar a otros developers nuevos (si aplica)
- Proponer mejoras al código/proceso

**Medidas de éxito:**
- Completas features end-to-end
- Tus PRs requieren menos iteraciones
- Contribuyes ideas en planning

### Mes 3: Propiedad 🎓

**Objetivo**: Tomar ownership de áreas del código

- Tomar ownership de un módulo/feature
- Liderar una feature pequeña de principio a fin
- Contribuir a decisiones de arquitectura
- Compartir conocimiento con el equipo (tech talk, documentación)
- Identificar y proponer mejoras técnicas

**Medidas de éxito:**
- Eres referente en al menos un área
- Otros te consultan sobre tu área
- Has mejorado procesos o código significativamente

## 📝 Notas Adicionales

### Tips para el Éxito

- **Primeras 2 semanas**: Enfócate en aprender, no en velocidad
- **Anota preguntas**: Lleva un documento de preguntas y respuestas
- **Revisa PRs**: Una de las mejores formas de aprender el codebase
- **Pair programming**: Pide sesiones con diferentes miembros del equipo
- **Documenta mientras aprendes**: Mejora la documentación que encuentres confusa

### Recursos de Aprendizaje

- [Link a curso interno]
- [Link a playlist de videos]
- [Link a documentación externa]
- [Link a blog posts relevantes]

## 📋 Feedback

Tu feedback es valioso para mejorar este proceso de onboarding:

- ¿Qué parte fue más útil?
- ¿Qué faltó o fue confuso?
- ¿Qué mejorarías?

Comparte tu feedback con [persona responsable de onboarding] o en [canal de slack].

---

_¡Bienvenido al equipo! Estamos emocionados de trabajar contigo._ 🚀

**¿Preguntas?** No dudes en preguntar en [#onboarding channel] o contactar directamente a tu buddy asignado: [@buddy-name]
