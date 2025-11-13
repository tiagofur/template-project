# REST API CRUD

**Categoría:** Backend  
**Nivel:** Básico  
**Tecnologías:** Express, NestJS, FastAPI, Spring Boot

## Objetivo

Generar un conjunto completo de endpoints CRUD (Create, Read, Update, Delete) para una entidad específica, siguiendo las mejores prácticas de REST API.

## Contexto

Este prompt crea endpoints REST estándar para operaciones CRUD. Incluye validación, manejo de errores, paginación y documentación básica. Es ideal para crear rápidamente APIs funcionales.

## Prompt

```
Crea una REST API CRUD completa para la entidad {{entity}} usando {{framework}}.

Requisitos:
1. Implementa los siguientes endpoints:
   - GET /api/{{entity_plural}} - Listar todos (con paginación)
   - GET /api/{{entity_plural}}/:id - Obtener por ID
   - POST /api/{{entity_plural}} - Crear nuevo
   - PUT /api/{{entity_plural}}/:id - Actualizar completo
   - PATCH /api/{{entity_plural}}/:id - Actualizar parcial
   - DELETE /api/{{entity_plural}}/:id - Eliminar

2. Características requeridas:
   - Validación de datos de entrada usando {{validation_library}}
   - Manejo de errores consistente con códigos HTTP apropiados
   - Paginación en el listado (page, limit, total)
   - Filtrado básico por campos comunes
   - Respuestas en formato JSON consistente

3. Estructura de respuesta:
   ```json
   {
     "success": true,
     "data": {},
     "message": "Operation completed successfully",
     "pagination": {
       "page": 1,
       "limit": 10,
       "total": 100
     }
   }
   ```

4. Manejo de errores:
   - 200: Success
   - 201: Created
   - 400: Bad Request (validación)
   - 404: Not Found
   - 500: Internal Server Error

5. Incluye:
   - Controller con lógica de endpoints
   - Service layer con lógica de negocio
   - Repository/Model para acceso a datos
   - DTOs para validación
   - Tests básicos para cada endpoint

Base de datos: {{database}}
```

## Ejemplo de Uso

### Variables a reemplazar:

- `{{entity}}`: "Product"
- `{{entity_plural}}`: "products"
- `{{framework}}`: "Express.js"
- `{{validation_library}}`: "joi"
- `{{database}}`: "PostgreSQL"

### Prompt adaptado:

```
Crea una REST API CRUD completa para la entidad Product usando Express.js.

Requisitos:
1. Implementa los siguientes endpoints:
   - GET /api/products - Listar todos (con paginación)
   - GET /api/products/:id - Obtener por ID
   - POST /api/products - Crear nuevo
   - PUT /api/products/:id - Actualizar completo
   - PATCH /api/products/:id - Actualizar parcial
   - DELETE /api/products/:id - Eliminar

[... resto del prompt ...]

Base de datos: PostgreSQL
```

## Resultados Esperados

El agente debe generar:

1. **Controller** (`productController.js`):
   ```javascript
   const productService = require('../services/productService');
   
   exports.getAllProducts = async (req, res) => {
     try {
       const { page = 1, limit = 10 } = req.query;
       const result = await productService.getAll(page, limit);
       res.json({
         success: true,
         data: result.products,
         pagination: {
           page: parseInt(page),
           limit: parseInt(limit),
           total: result.total
         }
       });
     } catch (error) {
       res.status(500).json({
         success: false,
         message: error.message
       });
     }
   };
   // ... más métodos
   ```

2. **Service** (`productService.js`):
   ```javascript
   const productRepository = require('../repositories/productRepository');
   
   exports.getAll = async (page, limit) => {
     const offset = (page - 1) * limit;
     const products = await productRepository.findAll(offset, limit);
     const total = await productRepository.count();
     return { products, total };
   };
   // ... más métodos
   ```

3. **Repository/Model** con acceso a base de datos

4. **Validation DTOs** para cada operación

5. **Routes** configurados

6. **Tests** básicos para cada endpoint

## Tips Adicionales

### Para mejorar la API:

1. **Agregar filtros:**
   ```
   Agrega soporte para filtrar por {{field1}}, {{field2}} y {{field3}}.
   Ejemplo: GET /api/products?category=electronics&minPrice=100
   ```

2. **Agregar ordenamiento:**
   ```
   Implementa ordenamiento dinámico usando query params.
   Ejemplo: GET /api/products?sortBy=price&order=desc
   ```

3. **Agregar búsqueda:**
   ```
   Agrega endpoint de búsqueda: GET /api/products/search?q={{query}}
   Debe buscar en campos: {{field1}}, {{field2}}, {{field3}}
   ```

4. **Optimizar performance:**
   ```
   Implementa caché Redis para el endpoint de listado.
   TTL: 5 minutos. Invalidar cache al crear/actualizar/eliminar.
   ```

5. **Agregar autenticación:**
   ```
   Protege todos los endpoints excepto GET con autenticación JWT.
   Solo usuarios con rol 'admin' pueden eliminar.
   ```

### Variaciones del prompt:

**Para GraphQL:**
```
Convierte estos endpoints REST a un schema GraphQL con queries y mutations equivalentes.
```

**Para microservicios:**
```
Implementa esta API como un microservicio independiente con su propia base de datos.
```

**Para serverless:**
```
Adapta estos endpoints para AWS Lambda con API Gateway.
```

## Casos de Uso

- ✅ CRUD de usuarios
- ✅ CRUD de productos
- ✅ CRUD de órdenes
- ✅ CRUD de categorías
- ✅ Cualquier entidad de negocio estándar

## Tecnologías Compatibles

- **Node.js:** Express, NestJS, Fastify, Koa
- **Python:** FastAPI, Django REST, Flask
- **Go:** Gin, Echo, Fiber
- **Java:** Spring Boot
- **.NET:** ASP.NET Core

---

_REST API CRUD - Creando APIs funcionales rápidamente_ 🚀
