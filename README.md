# 🚀 AI Development Starter Template

Un template completo para proyectos con equipos de agentes especializados de IA, configurado con MCPs, herramientas de desarrollo y documentación estructurada.

## 📋 Características

- ✅ **Agentes Especializados**: Backend, Frontend (React/Flutter), UI/UX, Testing, Project Manager
- ✅ **MCPs Integrados**: GitHub, Playwright, MongoDB, Supabase y más
- ✅ **Gestión de Variables**: Configuración centralizada con .env
- ✅ **Sistema de Entornos**: Templates pre-configurados para dev, test, staging, prod y preview
- ✅ **Documentación Estructurada**: Organización automática por carpetas
- ✅ **Flujo de Desarrollo**: Tests automáticos, commits organizados
- ✅ **Plantillas de Código**: Componentes y patrones predefinidos
- ✅ **Biblioteca de Prompts**: Prompts reutilizables organizados por stack tecnológico
- ✅ **Colección de Herramientas**: Sets de herramientas por stack para acelerar desarrollo
- ✅ **Feature Flags**: Sistema completo para control de características
- ✅ **Gestión de Secretos**: Guías y mejores prácticas para seguridad

## 🏗️ Estructura del Proyecto

```
├── agents/                 # Agentes especializados
├── docs/                   # Documentación organizada
├── prompts/                # Biblioteca de prompts reutilizables
├── templates/              # Plantillas de código
├── tools/                  # Herramientas y scripts
├── tests/                  # Tests automatizados
├── .env.example           # Variables de entorno requeridas
└── project-setup.md       # Guía de configuración inicial
```

## 🚀 Inicio Rápido

1. **Configurar Variables de Entorno**

   ```bash
   # Opción 1: Usar template básico
   cp .env.example .env
   
   # Opción 2: Usar template de entorno específico
   cp templates/environments/.env.development .env
   
   # Editar .env con tus claves API
   nano .env
   
   # Validar configuración
   node scripts/validate-env.js
   ```

2. **Revisar Sistema de Configuración**

   ```bash
   # Ver guía completa de configuración de entornos
   # templates/environments/README.md
   
   # Guía de setup paso a paso
   # templates/environments/SETUP_GUIDE.md
   ```

3. **Revisar Agentes Disponibles**

   ```bash
   # Ver la lista completa en agents/README.md
   ```

4. **Seguir la Guía de Planificación**
   ```bash
   # Ver project-setup.md para instrucciones detalladas
   ```

## 📚 Documentación

### 📘 [**INSTRUCTIONS & BEST PRACTICES**](./INSTRUCTIONS.md) - ¡Comienza aquí!
Guía central completa de instrucciones, mejores prácticas y lineamientos de desarrollo.

### Documentación Principal
- [Configuración Inicial](./project-setup.md)
- [Sistema de Entornos](./templates/environments/README.md) - **NUEVO**: Templates para dev, test, staging, prod, preview
- [Gestión de Secretos](./templates/environments/SECRETS_MANAGEMENT.md) - **NUEVO**: Guía completa de seguridad
- [Feature Flags](./templates/feature-flags/README.md) - **NUEVO**: Sistema de banderas de características
- [Agentes Especializados](./agents/README.md)
- [Biblioteca de Prompts](./prompts/README.md)
- [Templates de Código](./templates/README.md)
- [Colección de Herramientas](./tools/README.md)
- [MCPs Disponibles](./docs/mcps/README.md)
- [Flujo de Desarrollo](./docs/workflow/README.md)

### Guías Específicas
- [Setup & Configuración](./docs/setup/README.md) - Instalación y configuración inicial
- [Coding Guidelines](./docs/coding-guidelines/README.md) - Estándares de código
- [AI Collaboration](./docs/ai-collaboration/README.md) - Trabajar con agentes IA
- [Stack Guides](./docs/stack-guides/README.md) - Guías por tecnología
- [QA & Deploy](./docs/qa-deploy/README.md) - Testing y despliegue

## 🤝 Contribución

Este template está diseñado para ser extendido y personalizado según las necesidades del proyecto.

---

_Creado con ❤️ para equipos de desarrollo con IA_
