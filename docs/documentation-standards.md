# 📘 Guía de Estándares de Documentación

Esta guía establece los estándares y mejores prácticas para toda la documentación del proyecto.

## 🎯 Principios Fundamentales

### 1. Claridad sobre Brevedad

✅ **Correcto:**
```markdown
Este endpoint permite crear nuevos usuarios en el sistema. Requiere 
autenticación mediante token Bearer y valida que el email no esté 
registrado previamente.
```

❌ **Incorrecto:**
```markdown
Creates users. Needs auth. Checks email.
```

### 2. Audiencia Primero

Escribe pensando en quien va a leer:

- **Desarrolladores Nuevos**: Explica el "por qué", no solo el "qué"
- **Desarrolladores Experimentados**: Incluye detalles técnicos y trade-offs
- **Stakeholders**: Enfócate en valor de negocio y ROI
- **Usuarios Finales**: Lenguaje simple, sin jerga técnica

### 3. Ejemplos Concretos

Siempre incluye ejemplos ejecutables:

```typescript
// ✅ Bueno: Ejemplo completo y funcional
import { UserService } from '@app/services';

const userService = new UserService();
const user = await userService.create({
  email: 'user@example.com',
  name: 'John Doe'
});
console.log(user.id); // Output: "uuid-string"
```

```typescript
// ❌ Malo: Ejemplo incompleto
const user = create(data);
```

### 4. Mantener Actualizado

- Actualiza documentación en el mismo PR que el código
- Marca documentación obsoleta claramente
- Incluye fecha de última actualización
- Remove documentación de features eliminadas

## 📝 Formato y Estilo

### Markdown

#### Headings

```markdown
# H1: Título Principal (solo uno por documento)

## H2: Secciones Principales

### H3: Subsecciones

#### H4: Detalles Específicos

##### H5: Raramente usado

###### H6: Evitar
```

**Reglas:**
- No saltar niveles (H1 → H3 es incorrecto)
- Usar Title Case para H1
- Usar Sentence case para H2+
- Agregar espacio después del `#`

#### Listas

```markdown
## Listas Ordenadas

1. Primer item
2. Segundo item
3. Tercer item
   - Sub-item no ordenado
   - Otro sub-item

## Listas No Ordenadas

- Item con `-`
- Otro item
  - Sub-item (2 espacios de indentación)
  - Otro sub-item

## Listas de Tareas

- [ ] Tarea pendiente
- [x] Tarea completada
```

#### Code Blocks

```markdown
## ✅ Correcto: Siempre especificar lenguaje

\`\`\`typescript
const greeting = (name: string): string => {
  return `Hello, ${name}!`;
};
\`\`\`

## ❌ Incorrecto: Sin lenguaje

\`\`\`
const greeting = name => `Hello, ${name}!`;
\`\`\`
```

**Lenguajes soportados:**
- `typescript`, `javascript`, `tsx`, `jsx`
- `python`, `go`, `rust`, `java`
- `bash`, `shell`, `sh`
- `sql`, `json`, `yaml`, `xml`
- `html`, `css`, `scss`
- `markdown`, `diff`

#### Links

```markdown
## ✅ Correcto: Links descriptivos

Ver la [guía de instalación](./installation.md) para más detalles.

Para configuración avanzada, consulta nuestra 
[documentación de configuración](./configuration.md).

## ❌ Incorrecto: Links genéricos

Para instalar, haz click [aquí](./installation.md).
Más información [aquí](./configuration.md).
```

**Tipos de links:**
- Links relativos para navegación interna: `[texto](./path/to/file.md)`
- Links absolutos para recursos externos: `[texto](https://example.com)`
- Anchors para secciones: `[texto](#section-heading)`

#### Imágenes

```markdown
## Con texto alternativo descriptivo

![Diagrama de arquitectura del sistema mostrando componentes principales](./images/architecture-diagram.png)

## Con caption

![Arquitectura del Sistema](./images/architecture.png)
*Figura 1: Arquitectura general del sistema*
```

#### Tablas

```markdown
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Dato 1    | Dato 2    | Dato 3    |
| Dato 4    | Dato 5    | Dato 6    |

## Con alineación

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left         | Center         | Right         |
```

#### Citas

```markdown
> **Nota:** Información importante que el lector debe saber.

> **Advertencia:** Acción que puede tener consecuencias negativas.

> **Tip:** Sugerencia para mejorar la experiencia.
```

#### Emojis

Usar emojis para mejorar legibilidad:

```markdown
## 📚 Documentación (categoría)
- ✅ Hacer esto (positivo)
- ❌ No hacer esto (negativo)
- 💡 Tip (sugerencia)
- ⚠️ Advertencia (precaución)
- 🚀 Nuevo (feature)
- 🐛 Bug (error)
- 🔒 Seguridad (security)
```

**Emojis comunes:**
- 📖 📚 📝 - Documentación
- ✅ ❌ ⚠️ - Status
- 🚀 🎯 💡 - Features/Ideas
- 🐛 🔥 💥 - Issues
- 🔒 🔐 - Security
- 📊 📈 📉 - Metrics
- 🛠️ ⚙️ 🔧 - Tools/Config
- 👥 👤 - Users/Team

### Nomenclatura de Archivos

```
# Archivos Principales (UPPERCASE)
README.md
CHANGELOG.md
CONTRIBUTING.md
LICENSE
CODE_OF_CONDUCT.md

# Documentación Regular (kebab-case)
getting-started.md
api-reference.md
deployment-guide.md
troubleshooting.md

# Componentes/Features (PascalCase)
UserProfile.md
AuthenticationFlow.md
PaymentGateway.md

# Configuración (kebab-case)
.env.example
docker-compose.yml
tsconfig.json
```

## 🏗️ Estructura de Documentos

### README.md Template

```markdown
# Título del Proyecto

> Descripción breve en una línea

[![Badges relevantes]]

## Tabla de Contenidos
[Solo para READMEs largos]

## Overview
[2-3 párrafos]

## Features
[Lista de características principales]

## Quick Start
[Pasos mínimos para empezar]

## Installation
[Instalación detallada]

## Usage
[Ejemplos de uso]

## Documentation
[Links a docs detalladas]

## Contributing
[Cómo contribuir]

## License
[Información de licencia]
```

### Documentación Técnica Template

```markdown
# Título Técnico

## Overview
[Qué es y para qué sirve]

## Architecture
[Diseño y componentes]

## Implementation
[Detalles de implementación]

## API Reference
[Si aplica]

## Examples
[Ejemplos de uso]

## Troubleshooting
[Problemas comunes]

## References
[Links relacionados]
```

## 📊 Diagramas

### Mermaid Best Practices

```markdown
## ✅ Correcto: Con título y labels claros

\`\`\`mermaid
graph TD
    title: User Authentication Flow
    
    A[User] -->|Enters credentials| B[Login Form]
    B -->|POST /auth/login| C[Auth Service]
    C -->|Validates| D{Valid?}
    D -->|Yes| E[Generate Token]
    D -->|No| F[Return Error]
    E -->|Return token| G[Store in Cookie]
    F -->|Display error| B
\`\`\`

## ❌ Incorrecto: Sin contexto

\`\`\`mermaid
graph TD
    A --> B
    B --> C
    C --> D
\`\`\`
```

**Tipos de diagramas:**
- `graph TD/LR` - Flowcharts
- `sequenceDiagram` - Sequence diagrams
- `erDiagram` - Entity relationships
- `classDiagram` - Class diagrams
- `stateDiagram-v2` - State machines
- `C4Context/Container/Component` - C4 diagrams

### Cuándo usar qué diagrama

| Tipo | Cuándo Usar | Ejemplo |
|------|-------------|---------|
| Flowchart | Procesos y flujos de decisión | Flujo de checkout |
| Sequence | Interacciones entre sistemas | Autenticación API |
| ERD | Estructura de base de datos | Schema de usuarios |
| C4 | Arquitectura de sistema | Visión general |
| State | Estados y transiciones | Orden de compra |

## ✍️ Guía de Escritura

### Voz y Tono

**✅ Usar:**
- Segunda persona: "Puedes configurar...", "Debes instalar..."
- Voz activa: "El sistema valida los datos" vs "Los datos son validados"
- Presente: "La API devuelve..." vs "La API devolverá..."

**❌ Evitar:**
- Primera persona plural: "Nosotros implementamos..."
- Voz pasiva excesiva
- Futuro cuando no es necesario

### Terminología

Mantener consistencia en términos técnicos:

```markdown
## ✅ Correcto: Términos consistentes

- Usar siempre "endpoint" (no "ruta" o "URL")
- Usar "autenticación" consistentemente (no alternar con "auth")
- Usar nombres completos la primera vez: "REST (Representational State Transfer)"

## ❌ Incorrecto: Términos inconsistentes

- Mezclar "endpoint", "ruta", "URL" indistintamente
- Alternar entre "autenticación" y "auth" sin definir
- Usar acrónimos sin explicar
```

### Longitud de Párrafos

```markdown
## ✅ Correcto: Párrafos cortos y enfocados

Este endpoint permite crear nuevos usuarios. Requiere autenticación 
mediante token Bearer.

La validación incluye verificación de email único y formato válido. 
Los passwords deben cumplir con los requisitos de seguridad.

## ❌ Incorrecto: Párrafos muy largos

Este endpoint permite crear nuevos usuarios y requiere autenticación 
mediante token Bearer y la validación incluye verificación de email 
único y formato válido y los passwords deben cumplir con los 
requisitos de seguridad que están definidos en otra sección y...
```

**Reglas:**
- Máximo 3-4 líneas por párrafo
- Una idea principal por párrafo
- Espacio entre párrafos para legibilidad

## 🔍 Code Examples

### Estilo de Ejemplos

```typescript
// ✅ Correcto: Ejemplo completo y ejecutable

import { UserService } from '@app/services';
import { CreateUserDto } from '@app/dto';

async function createUser() {
  // Initialize service
  const userService = new UserService();
  
  // Prepare data
  const userData: CreateUserDto = {
    email: 'user@example.com',
    name: 'John Doe',
    password: 'SecurePass123!'
  };
  
  try {
    // Create user
    const user = await userService.create(userData);
    console.log('User created:', user.id);
    return user;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}
```

```typescript
// ❌ Incorrecto: Ejemplo incompleto

const user = await service.create(data);
```

### Comentarios en Código

```typescript
// ✅ Correcto: Comentarios útiles

// Calculate user discount based on loyalty tier
const discount = calculateDiscount(user.loyaltyPoints);

// Avoid: Comentarios obvios
// Set the name
user.name = 'John';
```

### Outputs Esperados

```typescript
// Always show expected outputs
const result = await api.getUser('123');
console.log(result);
// Output:
// {
//   id: '123',
//   name: 'John Doe',
//   email: 'john@example.com'
// }
```

## 📋 Checklists de Calidad

### Checklist: README.md

- [ ] Título claro y descriptivo
- [ ] Badges de status (build, version, license)
- [ ] Descripción concisa (2-3 párrafos)
- [ ] Lista de features principales
- [ ] Quick start funcional (< 5 min)
- [ ] Prerequisites listados
- [ ] Instrucciones de instalación paso a paso
- [ ] Ejemplos de uso básico
- [ ] Links a documentación detallada
- [ ] Guía de contribución
- [ ] Información de licencia
- [ ] Contacto/soporte

### Checklist: Documentación Técnica

- [ ] Overview claro
- [ ] Diagramas de arquitectura
- [ ] API reference (si aplica)
- [ ] Ejemplos de código funcionales
- [ ] Casos de uso comunes
- [ ] Troubleshooting section
- [ ] Performance considerations
- [ ] Security considerations
- [ ] Links a código fuente
- [ ] Última actualización indicada

### Checklist: Tutorial/Guide

- [ ] Objetivos claros al inicio
- [ ] Prerequisites listados
- [ ] Pasos numerados
- [ ] Screenshots/diagramas
- [ ] Código completo y probado
- [ ] Explicación del "por qué"
- [ ] Sección de troubleshooting
- [ ] Próximos pasos
- [ ] Links a recursos relacionados

## 🧪 Testing de Documentación

### Validación Automática

```bash
# Markdown linting
npx markdownlint-cli2 "**/*.md"

# Link checking
npx markdown-link-check README.md

# Spell checking
npx cspell "**/*.md"

# Style guide enforcement
vale docs/
```

### Configuración Markdownlint

```json
{
  "default": true,
  "MD013": { "line_length": 100 },
  "MD024": { "allow_different_nesting": true },
  "MD033": false,
  "MD041": false
}
```

### Validación Manual

- [ ] Todos los links funcionan
- [ ] Code examples ejecutan correctamente
- [ ] Screenshots están actualizados
- [ ] No hay typos obvios
- [ ] Formato consistente
- [ ] Información actualizada
- [ ] Gramática correcta
- [ ] Accesible y claro para la audiencia

## 📊 Métricas de Calidad

### Coverage de Documentación

```markdown
| Área | Files Documented | Coverage |
|------|------------------|----------|
| API Endpoints | 45/50 | 90% |
| Components | 120/150 | 80% |
| Services | 30/35 | 85% |
| Utils | 25/30 | 83% |
```

### Freshness

```markdown
| Document | Last Updated | Status |
|----------|--------------|--------|
| README.md | 2024-01-15 | 🟢 Fresh |
| API.md | 2023-11-20 | 🟡 Review |
| Deploy.md | 2023-08-10 | 🔴 Stale |
```

**Definiciones:**
- 🟢 Fresh: < 30 días
- 🟡 Review: 30-90 días
- 🔴 Stale: > 90 días

## 🚀 Proceso de Actualización

### Durante Desarrollo

1. **Planificación**
   - Identificar documentación afectada
   - Planear actualizaciones necesarias

2. **Implementación**
   - Actualizar documentación en el mismo PR
   - Agregar nuevos docs si es necesario

3. **Review**
   - Include documentación en code review
   - Verificar ejemplos funcionan

4. **Merge**
   - Documentación actualizada se mergea con código

### Auditoría Regular

```markdown
## Monthly Documentation Audit

- [ ] Revisar y actualizar README principal
- [ ] Verificar todos los links
- [ ] Actualizar screenshots/diagramas
- [ ] Revisar código de ejemplos
- [ ] Actualizar dependencias en docs
- [ ] Verificar información de contacto
- [ ] Revisar changelog
- [ ] Actualizar guías de onboarding
```

## 📚 Recursos

### Style Guides

- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/)
- [GitLab Documentation Style Guide](https://docs.gitlab.com/ee/development/documentation/styleguide/)

### Herramientas

- [Markdownlint](https://github.com/DavidAnson/markdownlint)
- [Vale](https://vale.sh/)
- [Grammarly](https://www.grammarly.com/)
- [Hemingway Editor](http://www.hemingwayapp.com/)

### Referencias

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Mermaid Documentation](https://mermaid.js.org/)

---

_Última actualización: [Fecha]_  
_Mantenido por: Documentation Specialist Team_
