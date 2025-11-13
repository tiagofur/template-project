# 📊 Prompts para Crear Diagramas

Prompts especializados para generar diagramas técnicos usando Mermaid y otros formatos.

## 🎯 C4 Model Diagrams

### Context Diagram

```markdown
Crea un diagrama C4 Context para [NOMBRE_SISTEMA].

Contexto:
- Sistema principal: [DESCRIPCIÓN]
- Usuarios: [LISTA DE USUARIOS/PERSONAS]
- Sistemas externos: [LISTA DE SISTEMAS]

Interacciones:
- [USUARIO] usa [SISTEMA] para [PROPÓSITO]
- [SISTEMA] se integra con [SISTEMA_EXTERNO] mediante [API/PROTOCOLO]

Usa formato Mermaid C4Context.
```

### Container Diagram

```markdown
Crea un diagrama C4 Container para [NOMBRE_SISTEMA].

Containers dentro del sistema:
- [CONTAINER_1]: [Tecnología] - [Descripción]
- [CONTAINER_2]: [Tecnología] - [Descripción]

Bases de datos:
- [DB_1]: [Tipo] - [Propósito]
- [DB_2]: [Tipo] - [Propósito]

Comunicación:
- [CONTAINER_1] -> [CONTAINER_2]: [Protocolo/Método]
- [CONTAINER] -> [DB]: [Protocolo]

Usa formato Mermaid C4Container.
```

### Component Diagram

```markdown
Crea un diagrama C4 Component para [CONTAINER_NAME].

Componentes principales:
- [COMPONENT_1]: [Responsabilidad]
- [COMPONENT_2]: [Responsabilidad]

Dependencias:
- [COMPONENT_1] depende de [COMPONENT_2] para [PROPÓSITO]

Usa formato Mermaid C4Component.
```

## 🔄 Sequence Diagrams

### Authentication Flow

```markdown
Crea un diagrama de secuencia para el flujo de autenticación.

Participantes:
- Usuario
- Frontend/Cliente
- API/Backend
- Servicio de Auth
- Base de datos

Flujo:
1. Usuario ingresa credenciales
2. Frontend envía POST a /auth/login
3. [CONTINUAR CON PASOS ESPECÍFICOS]

Incluye:
- Validaciones
- Generación de tokens
- Manejo de errores
- Redirecciones

Usa formato Mermaid sequenceDiagram.
```

### API Request Flow

```markdown
Crea un diagrama de secuencia para el flujo de request a [ENDPOINT].

Participantes:
- Cliente
- API Gateway
- [Servicio específico]
- Base de datos
- [Servicios externos si aplica]

Flujo normal:
[DESCRIBIR PASOS]

Casos de error:
- [ERROR_CASO_1]
- [ERROR_CASO_2]

Usa formato Mermaid sequenceDiagram.
```

## 📊 Entity Relationship Diagrams (ERD)

### Database Schema

```markdown
Crea un ERD para el esquema de base de datos de [MÓDULO/SISTEMA].

Entidades:
- [ENTITY_1]:
  - id: uuid (PK)
  - [campo1]: [tipo]
  - [campo2]: [tipo]
  
- [ENTITY_2]:
  - id: uuid (PK)
  - [entity1_id]: uuid (FK)
  - [campo1]: [tipo]

Relaciones:
- [ENTITY_1] tiene muchos [ENTITY_2]
- [ENTITY_2] pertenece a [ENTITY_1]

Usa formato Mermaid erDiagram.
```

## 🔀 Flowcharts

### Process Flow

```markdown
Crea un flowchart para el proceso de [NOMBRE_PROCESO].

Inicio: [PUNTO_INICIAL]

Pasos:
1. [PASO_1]
2. Decisión: [CONDICIÓN]
   - Si: [ACCIÓN]
   - No: [ACCIÓN]
3. [PASO_3]

Fin: [ESTADO_FINAL]

Manejo de errores:
- Si [ERROR], entonces [ACCIÓN]

Usa formato Mermaid flowchart.
```

### User Journey

```markdown
Crea un flowchart del user journey para [FUNCIONALIDAD].

Usuario: [TIPO_USUARIO]

Journey:
1. Usuario [ACCIÓN_INICIAL]
2. Sistema valida [VALIDACIÓN]
3. Si válido:
   - [FLUJO_ÉXITO]
4. Si inválido:
   - [FLUJO_ERROR]
   - [RETRY_OPCIÓN]

Estados finales:
- Éxito: [ESTADO]
- Error: [ESTADO]

Usa formato Mermaid flowchart.
```

## 🔄 State Diagrams

### State Machine

```markdown
Crea un diagrama de estados para [ENTIDAD/PROCESO].

Estados:
- [ESTADO_1]: [Descripción]
- [ESTADO_2]: [Descripción]
- [ESTADO_3]: [Descripción]

Transiciones:
- [ESTADO_1] -> [ESTADO_2]: cuando [CONDICIÓN/EVENTO]
- [ESTADO_2] -> [ESTADO_3]: cuando [CONDICIÓN/EVENTO]

Estados iniciales y finales:
- Inicial: [ESTADO]
- Final(es): [ESTADO(S)]

Notas importantes:
- [NOTA_1]
- [NOTA_2]

Usa formato Mermaid stateDiagram-v2.
```

## 🏗️ Architecture Diagrams

### System Architecture

```markdown
Crea un diagrama de arquitectura del sistema completo.

Capas:
1. Frontend Layer:
   - [COMPONENTE_1]
   - [COMPONENTE_2]

2. API Layer:
   - [COMPONENTE_1]
   - [COMPONENTE_2]

3. Business Logic Layer:
   - [COMPONENTE_1]
   - [COMPONENTE_2]

4. Data Layer:
   - [COMPONENTE_1]
   - [COMPONENTE_2]

Comunicación entre capas:
- [CAPA_1] -> [CAPA_2]: [PROTOCOLO]

Componentes externos:
- [SERVICIO_EXTERNO_1]
- [SERVICIO_EXTERNO_2]

Usa formato Mermaid graph TD.
```

### Microservices Architecture

```markdown
Crea un diagrama de arquitectura de microservicios.

Servicios:
- [SERVICIO_1]: [Responsabilidad]
- [SERVICIO_2]: [Responsabilidad]
- [SERVICIO_3]: [Responsabilidad]

Componentes de infraestructura:
- API Gateway
- Service Discovery
- Message Queue
- Load Balancer

Bases de datos (por servicio):
- [SERVICIO_1] -> [DB_TIPO]
- [SERVICIO_2] -> [DB_TIPO]

Comunicación:
- Síncrona: [SERVICIO] <-> [SERVICIO] via REST/gRPC
- Asíncrona: [SERVICIO] -> Queue -> [SERVICIO]

Usa formato Mermaid graph TD.
```

## 🚀 Deployment Diagrams

### Infrastructure Diagram

```markdown
Crea un diagrama de infraestructura y deployment.

Entornos:
- Development
- Staging  
- Production

Componentes por entorno:
- [COMPONENTE_1]: [CONFIGURACIÓN]
- [COMPONENTE_2]: [CONFIGURACIÓN]

Cloud Services:
- [SERVICIO_1]: [PROPÓSITO]
- [SERVICIO_2]: [PROPÓSITO]

Networking:
- VPC/Subnets
- Load Balancers
- CDN

Usa formato Mermaid graph LR o TD.
```

## 📱 Mobile Architecture

### Mobile App Architecture

```markdown
Crea un diagrama de arquitectura para aplicación móvil [NOMBRE_APP].

Capas:
1. Presentation Layer:
   - Screens/Views
   - ViewModels/Controllers
   
2. Domain Layer:
   - Use Cases
   - Entities
   
3. Data Layer:
   - Repositories
   - Data Sources (Local/Remote)

Librerías clave:
- State Management: [LIBRERÍA]
- Networking: [LIBRERÍA]
- Local Storage: [LIBRERÍA]

Usa formato Mermaid graph TD.
```

## 🔐 Security Architecture

### Security Flow

```markdown
Crea un diagrama del flujo de seguridad para [FUNCIONALIDAD].

Puntos de seguridad:
1. Autenticación: [MÉTODO]
2. Autorización: [MÉTODO]
3. Encriptación: [DÓNDE/CÓMO]
4. Rate Limiting: [CONFIGURACIÓN]

Flujo:
1. Request llega a [PUNTO_ENTRADA]
2. Validación de [SEGURIDAD_1]
3. Si pasa, validación de [SEGURIDAD_2]
4. [CONTINUAR FLUJO]

Manejo de fallos de seguridad:
- [FALLO_1]: [RESPUESTA]
- [FALLO_2]: [RESPUESTA]

Usa formato Mermaid sequenceDiagram o flowchart.
```

## 🎨 Mejores Prácticas para Diagramas

### Claridad

```markdown
## ✅ Bueno
- Nombres descriptivos y consistentes
- Nivel de detalle apropiado
- Agrupación lógica de componentes
- Colores para categorización

## ❌ Malo
- Nombres genéricos (Service1, Service2)
- Demasiado detalle o muy abstracto
- Todo al mismo nivel
- Sin diferenciación visual
```

### Mantenibilidad

```markdown
## ✅ Bueno
- Diagramas como código (Mermaid)
- Versionados en Git
- Cerca del código relevante
- Actualizados con cambios

## ❌ Malo
- Imágenes PNG/JPG
- En herramientas externas
- Desactualizados
- Sin documentar cambios
```

### Formato Mermaid

```markdown
## Tips para Mermaid

1. Usar sintaxis más reciente (stateDiagram-v2, C4)
2. Incluir título con `title`
3. Usar notes para información adicional
4. Mantener indentación consistente
5. Comentar secciones complejas
```

## 📋 Template Completo de Prompt

```markdown
@documentation-specialist crear-diagrama

Tipo de diagrama: [C4 Context / Sequence / ERD / Flowchart / State / etc.]

Sistema/Componente: [NOMBRE]

Propósito del diagrama:
[Explicar qué debe comunicar el diagrama]

Elementos a incluir:
- [ELEMENTO_1]: [Descripción]
- [ELEMENTO_2]: [Descripción]

Interacciones/Relaciones:
- [RELACIÓN_1]
- [RELACIÓN_2]

Contexto adicional:
[Información de background necesaria]

Formato de salida: Mermaid [tipo específico]

Audiencia: [Developers / Arquitectos / Stakeholders / etc.]
```

## 🔍 Validación de Diagramas

Checklist antes de finalizar:

- [ ] Título claro y descriptivo
- [ ] Elementos tienen nombres consistentes
- [ ] Relaciones están etiquetadas
- [ ] Nivel de detalle apropiado
- [ ] Leyenda si es necesario
- [ ] Código Mermaid válido
- [ ] Renderiza correctamente
- [ ] Está actualizado con el sistema actual
- [ ] Tiene notas explicativas si es complejo

---

_Prompts para diagramas técnicos efectivos_ 📊
