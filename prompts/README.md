# 💬 Prompts Library

Biblioteca de prompts reutilizables organizados por stack tecnológico para acelerar el desarrollo con IA.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Estructura](#estructura)
- [Categorías](#categorías)
- [Uso](#uso)
- [Formato de Prompts](#formato-de-prompts)
- [Mejores Prácticas](#mejores-prácticas)

## 📖 Descripción

Esta biblioteca contiene prompts cuidadosamente diseñados para diferentes tecnologías y casos de uso. Cada prompt está optimizado para obtener los mejores resultados con agentes de IA especializados.

## 🏗️ Estructura

```
prompts/
├── backend/           # Prompts para desarrollo backend
├── frontend/          # Prompts para desarrollo frontend
├── mobile/            # Prompts para desarrollo móvil
├── devops/            # Prompts para DevOps y CI/CD
├── qa/                # Prompts para testing y QA
├── security/          # Prompts para seguridad
├── code-review/       # Prompts para revisión de código con IA
└── README.md          # Esta guía
```

## 📚 Categorías

### 🔧 Backend
Prompts para desarrollo de APIs, bases de datos, autenticación y lógica de negocio.

**Subcategorías:**
- API Development (REST, GraphQL)
- Database (SQL, NoSQL, Migrations)
- Authentication & Authorization
- Business Logic
- Error Handling
- Performance Optimization

[Ver prompts de Backend →](./backend/README.md)

### 🎨 Frontend
Prompts para desarrollo de interfaces, componentes y experiencia de usuario.

**Subcategorías:**
- React Components
- State Management
- UI/UX Implementation
- Responsive Design
- Performance & SEO
- Accessibility

[Ver prompts de Frontend →](./frontend/README.md)

### 📱 Mobile
Prompts para desarrollo de aplicaciones móviles multiplataforma.

**Subcategorías:**
- Flutter Development
- React Native
- Platform-Specific Features
- Mobile UI/UX
- Performance Optimization
- App Store Deployment

[Ver prompts de Mobile →](./mobile/README.md)

### 🚀 DevOps
Prompts para infraestructura, CI/CD y despliegues.

**Subcategorías:**
- Docker & Containers
- CI/CD Pipelines
- Cloud Deployment
- Monitoring & Logging
- Infrastructure as Code
- Security & Compliance

[Ver prompts de DevOps →](./devops/README.md)

### 🧪 QA
Prompts para testing, calidad y automatización de pruebas.

**Subcategorías:**
- Unit Testing
- Integration Testing
- E2E Testing
- Test Automation
- Performance Testing
- Quality Assurance

[Ver prompts de QA →](./qa/README.md)

### 🔒 Security
Prompts para seguridad, auditorías y mejores prácticas.

**Subcategorías:**
- Security Audits
- Vulnerability Assessment
- Secure Coding Practices
- Authentication & Authorization
- Data Protection
- Compliance

[Ver prompts de Security →](./security/README.md)

### 🔍 Code Review
Prompts para revisión de código asistida por IA.

**Subcategorías:**
- General Code Review
- Security Review
- Performance Review
- Testing Review
- Architecture Review
- Language-Specific Review

[Ver prompts de Code Review →](./code-review/ai-code-review-prompts.md)

## 🚀 Uso

### Estructura de un Prompt

Cada prompt sigue una estructura consistente:

```markdown
# [Título del Prompt]

**Categoría:** [Backend/Frontend/Mobile/DevOps/QA/Security]
**Nivel:** [Básico/Intermedio/Avanzado]
**Tecnologías:** [Lista de tecnologías]

## Objetivo
Descripción clara de lo que el prompt ayuda a lograr.

## Contexto
Información necesaria para ejecutar el prompt efectivamente.

## Prompt
```
[El prompt exacto a usar con el agente de IA]
```

## Ejemplo de Uso
Ejemplo práctico de cómo usar el prompt.

## Resultados Esperados
Descripción de lo que se debe obtener.

## Tips Adicionales
Consejos para optimizar los resultados.
```

### Cómo Usar un Prompt

1. **Selecciona el prompt** adecuado según tu necesidad
2. **Lee el contexto** para entender los requisitos
3. **Copia el prompt** de la sección correspondiente
4. **Adapta las variables** marcadas con `{{variable}}`
5. **Ejecuta con tu agente** de IA preferido
6. **Itera según necesidad** basándote en los tips

### Ejemplo Práctico

```bash
# 1. Navegar a la categoría
cd prompts/backend/

# 2. Elegir un prompt
cat api-rest-crud.md

# 3. Copiar y adaptar el prompt
# Reemplazar {{entity}} con "User"
# Reemplazar {{database}} con "PostgreSQL"

# 4. Usar con tu agente de IA
# El agente generará el código basándose en el prompt
```

## 📝 Formato de Prompts

### Convenciones de Naming

- **Archivos:** `kebab-case.md` (ej: `api-rest-crud.md`)
- **Títulos:** Descriptivos y específicos
- **Variables:** `{{variable_name}}`
- **Categorías:** Una por prompt

### Estructura Obligatoria

Todos los prompts deben incluir:

1. ✅ **Título** claro y descriptivo
2. ✅ **Metadata** (Categoría, Nivel, Tecnologías)
3. ✅ **Objetivo** del prompt
4. ✅ **Contexto** necesario
5. ✅ **Prompt** formateado
6. ✅ **Ejemplo de uso**
7. ✅ **Resultados esperados**
8. ✅ **Tips adicionales**

### Variables en Prompts

Usa variables para personalización:

```markdown
Crea un componente {{ComponentName}} que {{functionality}}.
Debe usar {{technology}} y seguir el patrón {{pattern}}.
```

## 🎯 Mejores Prácticas

### Al Crear Prompts

1. **Sé Específico**
   - Define claramente el objetivo
   - Incluye contexto técnico relevante
   - Especifica el formato de salida esperado

2. **Sé Modular**
   - Un prompt por tarea específica
   - Evita prompts que hacen demasiado
   - Permite composición de prompts

3. **Sé Consistente**
   - Sigue la estructura establecida
   - Usa el mismo estilo de escritura
   - Mantén formato uniforme

4. **Proporciona Ejemplos**
   - Incluye ejemplos de entrada
   - Muestra salida esperada
   - Proporciona casos de uso reales

### Al Usar Prompts

1. **Lee el Contexto Completo**
   - Entiende los prerequisitos
   - Verifica compatibilidad tecnológica
   - Revisa los tips adicionales

2. **Adapta a tu Caso**
   - Personaliza las variables
   - Ajusta al contexto de tu proyecto
   - Modifica según necesidades específicas

3. **Itera y Refina**
   - Ejecuta el prompt
   - Evalúa resultados
   - Ajusta y re-ejecuta si es necesario

4. **Documenta Aprendizajes**
   - Registra qué funcionó bien
   - Nota mejoras posibles
   - Comparte hallazgos con el equipo

### Calidad de Prompts

Un buen prompt debe ser:

- **Claro**: Fácil de entender y usar
- **Completo**: Incluye toda la información necesaria
- **Conciso**: Sin información redundante
- **Reutilizable**: Funciona en múltiples contextos
- **Actualizado**: Refleja las mejores prácticas actuales

## 📊 Niveles de Prompts

### Básico
Prompts para tareas comunes y fundamentales. Ideal para principiantes.

**Características:**
- Instrucciones simples y directas
- Mínimo contexto requerido
- Resultados predecibles
- Ejemplos claros

### Intermedio
Prompts para tareas más complejas que requieren conocimiento del dominio.

**Características:**
- Requiere contexto técnico
- Múltiples consideraciones
- Personalización necesaria
- Ejemplos detallados

### Avanzado
Prompts para escenarios complejos y optimizaciones específicas.

**Características:**
- Conocimiento profundo requerido
- Múltiples variables
- Casos de uso especializados
- Optimizaciones específicas

## 🔄 Contribuir Prompts

### Proceso de Contribución

1. **Crear nuevo prompt** siguiendo la estructura
2. **Clasificar apropiadamente** (categoría y nivel)
3. **Probar el prompt** antes de agregarlo
4. **Documentar ejemplos** y casos de uso
5. **Enviar PR** con descripción clara

### Template para Nuevo Prompt

```markdown
# [Título del Prompt]

**Categoría:** [Categoría]
**Nivel:** [Nivel]
**Tecnologías:** [Tech1, Tech2]

## Objetivo
[¿Qué logra este prompt?]

## Contexto
[¿Qué necesita saber el usuario?]

## Prompt
```
[El prompt exacto]
```

## Ejemplo de Uso
[Ejemplo práctico]

## Resultados Esperados
[Qué debe producir]

## Tips Adicionales
- [Tip 1]
- [Tip 2]
```

## 📖 Recursos Adicionales

- [Guía de Agentes](../agents/README.md)
- [Templates de Código](../templates/README.md)
- [Documentación de MCPs](../docs/mcps/README.md)
- [Flujo de Desarrollo](../docs/workflow/README.md)

## 🆘 Soporte

¿Necesitas ayuda con los prompts?

1. Revisa los ejemplos en cada categoría
2. Consulta la guía de mejores prácticas
3. Verifica la documentación de agentes
4. Abre un issue para feedback o sugerencias

---

_Prompts Library - Acelerando el desarrollo con IA_ 💬
