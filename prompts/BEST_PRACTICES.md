# 📖 Guía de Mejores Prácticas para Prompts

Guía completa sobre cómo crear, usar y mantener prompts efectivos en la biblioteca.

## 📋 Tabla de Contenidos

- [Principios Fundamentales](#principios-fundamentales)
- [Creación de Prompts](#creación-de-prompts)
- [Uso Efectivo](#uso-efectivo)
- [Optimización](#optimización)
- [Mantenimiento](#mantenimiento)

## 🎯 Principios Fundamentales

### 1. Claridad es Clave

Un prompt efectivo debe ser:
- **Específico:** Define exactamente qué se necesita
- **Claro:** Lenguaje simple y directo
- **Completo:** Incluye todo el contexto necesario
- **Conciso:** Sin información redundante

**Ejemplo:**

❌ **Mal:**
```
Crea un componente de usuario
```

✅ **Bien:**
```
Crea un componente React TypeScript llamado UserCard que muestre:
- Avatar del usuario (imagen)
- Nombre completo
- Email
- Rol (badge con color según rol)
- Botón de acciones (editar/eliminar)

Debe ser responsive y usar Tailwind CSS.
```

### 2. Estructura Consistente

Todos los prompts deben seguir la misma estructura:

```markdown
# [Título Descriptivo]

**Categoría:** [Categoría]
**Nivel:** [Básico/Intermedio/Avanzado]
**Tecnologías:** [Lista de tecnologías]

## Objetivo
[Qué logra este prompt]

## Contexto
[Información necesaria]

## Prompt
```
[El prompt exacto]
```

## Ejemplo de Uso
[Ejemplo práctico]

## Resultados Esperados
[Qué debe producir]

## Tips Adicionales
[Consejos y variaciones]
```

### 3. Variables Descriptivas

Usa variables con nombres claros:

**Convenciones:**
- `{{EntityName}}` - PascalCase para entidades/componentes
- `{{variable_name}}` - snake_case para configuración
- `{{feature-name}}` - kebab-case para features
- `{{CONSTANT}}` - UPPER_CASE para constantes

**Ejemplo:**
```
Crea una API para {{EntityName}} con base de datos {{database_type}}.
Implementa autenticación usando {{auth_method}}.
Deploy en ambiente {{environment}}.
```

### 4. Contexto Apropiado

Proporciona el contexto justo:

**Demasiado poco:**
```
Crea un formulario con validación
```

**Demasiado:**
```
Crea un formulario... [3 páginas de especificaciones detalladas]
```

**Equilibrado:**
```
Crea un formulario de registro con:
- Campos: email, password, confirm password, nombre
- Validación: email válido, password mínimo 8 caracteres
- Submit asíncrono con estados de loading/error/success
- Usar React Hook Form y Zod
```

## 📝 Creación de Prompts

### Proceso de Creación

1. **Identificar Necesidad**
   - ¿Qué problema resuelve?
   - ¿Es reutilizable?
   - ¿Ya existe algo similar?

2. **Definir Alcance**
   - ¿Qué incluye?
   - ¿Qué excluye?
   - ¿Qué variaciones hay?

3. **Escribir Prompt Base**
   - Seguir estructura estándar
   - Incluir requisitos claros
   - Definir variables

4. **Probar y Validar**
   - Ejecutar con agente de IA
   - Verificar resultados
   - Iterar según necesidad

5. **Documentar**
   - Ejemplos claros
   - Casos de uso
   - Tips adicionales

### Checklist de Calidad

Antes de agregar un prompt, verifica:

- [ ] Sigue la estructura estándar
- [ ] Título descriptivo y claro
- [ ] Categoría y nivel correctos
- [ ] Tecnologías listadas
- [ ] Objetivo bien definido
- [ ] Contexto suficiente
- [ ] Prompt formateado correctamente
- [ ] Variables bien nombradas
- [ ] Ejemplo de uso incluido
- [ ] Resultados esperados descritos
- [ ] Tips adicionales útiles
- [ ] Casos de uso listados
- [ ] Tecnologías compatibles listadas
- [ ] Sin errores ortográficos
- [ ] Testeado con agente de IA

## 🚀 Uso Efectivo

### Seleccionar el Prompt Correcto

1. **Identifica tu Necesidad**
   ```
   ¿Qué estoy tratando de hacer?
   - Crear componente → Frontend
   - Implementar API → Backend
   - Configurar CI/CD → DevOps
   - Escribir tests → QA
   - Auditoría de seguridad → Security
   ```

2. **Revisa las Opciones**
   - Busca en la categoría apropiada
   - Lee los objetivos de cada prompt
   - Verifica tecnologías compatibles

3. **Lee el Contexto Completo**
   - Prerequisitos necesarios
   - Nivel de experiencia requerido
   - Tecnologías específicas

### Adaptar el Prompt

1. **Identifica Variables**
   ```
   Encuentra: {{variable_name}}
   ```

2. **Reemplaza con tus Valores**
   ```
   {{EntityName}} → User
   {{database_type}} → PostgreSQL
   {{framework}} → Express.js
   ```

3. **Ajusta según Necesidad**
   - Agrega requisitos específicos
   - Quita funcionalidad no necesaria
   - Adapta a tu stack tecnológico

### Ejecutar con IA

1. **Copia el Prompt Adaptado**
   - Con todas las variables reemplazadas
   - Con ajustes personalizados

2. **Proporciona Contexto Adicional**
   ```
   [Pega el prompt]
   
   Contexto adicional:
   - Proyecto: E-commerce platform
   - Stack: PERN (PostgreSQL, Express, React, Node)
   - Estilo de código: Airbnb ESLint config
   ```

3. **Itera si es Necesario**
   - Revisa resultados
   - Pide ajustes específicos
   - Refina hasta estar satisfecho

## ⚡ Optimización

### Mejorar Resultados

1. **Sé Más Específico**
   
   **Antes:**
   ```
   Crea un botón React
   ```
   
   **Después:**
   ```
   Crea un botón React TypeScript con:
   - Variantes: primary, secondary, danger
   - Tamaños: sm, md, lg
   - Estados: default, hover, active, disabled, loading
   - Soporte para iconos left/right
   - Accessibility completa (ARIA, keyboard)
   - Tests con React Testing Library
   - Tailwind CSS para estilos
   ```

2. **Proporciona Ejemplos**
   ```
   Crea componente similar a este ejemplo:
   [código de ejemplo o link]
   
   Pero con estas diferencias:
   - [diferencia 1]
   - [diferencia 2]
   ```

3. **Define Formato de Salida**
   ```
   Genera:
   1. Componente principal (Button.tsx)
   2. Types (types.ts)
   3. Tests (Button.test.tsx)
   4. Storybook story (Button.stories.tsx)
   5. README con ejemplos de uso
   ```

### Prompts Compuestos

Combina múltiples prompts para tareas complejas:

```
1. Usa "Database Schema Design" para diseñar el modelo
2. Usa "REST API CRUD" para crear los endpoints
3. Usa "React Component" para la interfaz
4. Usa "Integration Test" para las pruebas
```

### Iteración Efectiva

**Primera iteración:**
```
Crea un componente UserCard básico...
```

**Segunda iteración:**
```
Agrega estas funcionalidades al UserCard:
- Dropdown de acciones
- Estados de loading
- Error handling
```

**Tercera iteración:**
```
Optimiza el UserCard para performance:
- React.memo
- useCallback para handlers
- Lazy loading para avatar
```

## 🔧 Mantenimiento

### Actualización de Prompts

Los prompts deben actualizarse cuando:

1. **Nueva versión de tecnología**
   ```
   React 18 → React 19
   Actualizar: hooks, concurrent features, etc.
   ```

2. **Nuevas mejores prácticas**
   ```
   Patrón obsoleto → Patrón moderno
   Actualizar ejemplos y recomendaciones
   ```

3. **Feedback de usuarios**
   ```
   Prompt confuso → Clarificar
   Resultados incorrectos → Ajustar
   Falta funcionalidad → Agregar
   ```

### Versionado

Considera versionar prompts importantes:

```
prompts/
├── backend/
│   ├── api-rest-crud.md        # v2.0 - Current
│   └── archive/
│       └── api-rest-crud-v1.md # v1.0 - Archived
```

### Deprecation

Para deprecar un prompt:

1. Agregar warning al inicio:
   ```markdown
   > ⚠️ **DEPRECATED:** Este prompt será removido en v3.0.
   > Usa [nuevo-prompt.md](./nuevo-prompt.md) en su lugar.
   ```

2. Mantener por al menos 2 versiones

3. Mover a carpeta `archive/`

### Contribuciones

Al contribuir nuevos prompts:

1. **Fork el repositorio**
2. **Crea el prompt** siguiendo la estructura
3. **Prueba el prompt** con un agente
4. **Documenta resultados** en el PR
5. **Solicita review** de mantenedores

## 📊 Métricas de Calidad

### Prompt Efectivo

Un prompt es efectivo cuando:

- ✅ Genera resultados correctos en el primer intento (>80%)
- ✅ Requiere mínima iteración (<3 ajustes)
- ✅ Es usado frecuentemente por el equipo
- ✅ Recibe feedback positivo
- ✅ Ahorra tiempo significativo vs escribir desde cero

### Métricas a Trackear

- **Uso:** Cuántas veces se usa el prompt
- **Éxito:** % de resultados correctos
- **Tiempo ahorrado:** Comparado con desarrollo manual
- **Satisfacción:** Feedback de usuarios

## 🎓 Ejemplos de Evolución

### Versión 1 (Básica)
```
Crea un formulario de login con email y password
```

### Versión 2 (Mejorada)
```
Crea un formulario de login con:
- Campos: email (validación), password (show/hide)
- Submit con loading state
- Error handling
- Usar React Hook Form
```

### Versión 3 (Optimizada)
```
Crea un formulario de login TypeScript con React Hook Form y Zod:

Campos:
- Email: validación de formato
- Password: toggle show/hide, mínimo 8 caracteres

Features:
- Submit asíncrono con loading/error/success states
- Remember me checkbox
- Forgot password link
- Validación en tiempo real
- Accessibility completa

Styling: Tailwind CSS
Tests: React Testing Library
```

## 🆘 Troubleshooting

### Problema: Resultados Incorrectos

**Solución:**
1. Verifica que reemplazaste todas las variables
2. Proporciona más contexto específico
3. Agrega ejemplos de lo que esperas
4. Divide en prompts más pequeños

### Problema: Prompt Muy Genérico

**Solución:**
1. Agrega requisitos específicos
2. Define tecnologías exactas
3. Incluye estructura esperada
4. Proporciona ejemplos

### Problema: Demasiado Complejo

**Solución:**
1. Divide en sub-prompts
2. Ejecuta en orden secuencial
3. Itera sobre los resultados
4. Simplifica requisitos

## 📚 Recursos Adicionales

- [Template para Nuevo Prompt](./PROMPT_TEMPLATE.md)
- [Ejemplos de Prompts Efectivos](./examples/)
- [Guía de Contribución](../CONTRIBUTING.md)

---

_Mejores Prácticas - Creando y usando prompts de calidad_ 📖
