# 📋 Plan Mode System

Sistema de modos de planificación para flujos de trabajo con IA, diseñado para adaptarse a diferentes metodologías y necesidades de proyecto.

## 🎯 Modos Disponibles

### 1. 🏃 Sprint Mode
Planificación iterativa con ciclos de tiempo fijos (1-4 semanas).

- **Ideal para**: Equipos ágiles, desarrollo iterativo
- **Duración típica**: 2 semanas por sprint
- **Enfoque**: Entregas incrementales y mejora continua
- [Ver Guía Completa](./sprint-mode.md)

### 2. 📊 Kanban Mode
Flujo continuo con límites de trabajo en progreso (WIP).

- **Ideal para**: Trabajo continuo, soporte y mantenimiento
- **Duración**: Sin tiempo fijo, flujo continuo
- **Enfoque**: Visualización y optimización del flujo
- [Ver Guía Completa](./kanban-mode.md)

### 3. 🎯 Feature/Milestone Mode
Planificación orientada a entregables específicos.

- **Ideal para**: Lanzamientos de productos, grandes features
- **Duración**: Variable según el milestone
- **Enfoque**: Objetivos específicos y entregables
- [Ver Guía Completa](./feature-milestone-mode.md)

### 4. ⚡ Rapid Prototype Mode
Desarrollo rápido de prototipos y MVPs.

- **Ideal para**: Validación de ideas, proof of concepts
- **Duración**: 1-2 semanas típicamente
- **Enfoque**: Velocidad y aprendizaje rápido
- [Ver Guía Completa](./rapid-prototype-mode.md)

## 🔄 Selección del Modo Apropiado

### Matriz de Decisión

| Criterio | Sprint | Kanban | Feature/Milestone | Rapid Prototype |
|----------|--------|--------|-------------------|-----------------|
| **Estructura temporal** | Alta | Baja | Media | Alta |
| **Flexibilidad** | Media | Alta | Baja | Muy Alta |
| **Predictibilidad** | Alta | Media | Alta | Baja |
| **Documentación** | Alta | Media | Alta | Baja |
| **Overhead de proceso** | Medio | Bajo | Alto | Muy Bajo |
| **Mejor para equipos** | Medianos/Grandes | Pequeños/Medianos | Grandes | Pequeños |

### ¿Cuándo usar cada modo?

#### Usar Sprint Mode cuando:
- ✅ Tienes un equipo establecido y estable
- ✅ Necesitas predictibilidad en las entregas
- ✅ Quieres ceremonias ágiles (planning, review, retro)
- ✅ El proyecto tiene más de 3 meses de duración
- ✅ Necesitas métricas de velocidad del equipo

#### Usar Kanban Mode cuando:
- ✅ El trabajo llega de forma continua (bugs, soporte)
- ✅ Necesitas máxima flexibilidad en priorización
- ✅ Quieres minimizar ceremonias y overhead
- ✅ El equipo trabaja en múltiples proyectos
- ✅ Necesitas visualizar y optimizar el flujo de trabajo

#### Usar Feature/Milestone Mode cuando:
- ✅ Tienes hitos específicos y fechas de entrega fijas
- ✅ Trabajas en lanzamientos de productos
- ✅ Necesitas coordinar múltiples equipos
- ✅ Los stakeholders requieren visibilidad detallada
- ✅ El proyecto tiene dependencias externas críticas

#### Usar Rapid Prototype Mode cuando:
- ✅ Necesitas validar una idea rápidamente
- ✅ Estás en fase de discovery o exploración
- ✅ Quieres crear un MVP en poco tiempo
- ✅ La experimentación es más importante que el código perfecto
- ✅ Necesitas aprendizaje rápido sobre viabilidad técnica

## 🔗 Integración con GitHub Projects

Todos los modos se integran con GitHub Projects para:

- 📊 **Visualización**: Boards personalizados por modo
- 🔄 **Automatización**: Workflows automáticos
- 📈 **Métricas**: Tracking de progreso y velocidad
- 🔔 **Notificaciones**: Alertas y actualizaciones
- 🤝 **Colaboración**: Sincronización con issues y PRs

Ver [Guía de Integración con GitHub Projects](./github-projects-integration.md)

## 📚 Plantillas Disponibles

Cada modo incluye plantillas específicas en `templates/planning/`:

### Sprint Mode
- Sprint Planning Template
- Sprint Review Template
- Sprint Retrospective Template
- Daily Standup Template
- Sprint Goal Template

### Kanban Mode
- Kanban Board Setup Template
- WIP Limits Guide
- Flow Metrics Template
- Continuous Improvement Template

### Feature/Milestone Mode
- Milestone Planning Template
- Feature Specification Template
- Release Checklist Template
- Stakeholder Communication Template

### Rapid Prototype Mode
- Prototype Brief Template
- Learning Objectives Template
- Quick Validation Checklist
- Pivot or Persevere Template

## 🛠️ Herramientas y Scripts

Scripts de automatización disponibles en `tools/planning/`:

```bash
# Inicializar un nuevo sprint
./tools/planning/init-sprint.sh

# Configurar un Kanban board
./tools/planning/setup-kanban.sh

# Crear un milestone
./tools/planning/create-milestone.sh

# Iniciar un prototype rápido
./tools/planning/start-prototype.sh
```

## 🎓 Mejores Prácticas

### Para todos los modos:

1. **Documentación Clara**
   - Objetivos bien definidos
   - Criterios de aceptación explícitos
   - Documentación actualizada

2. **Comunicación Efectiva**
   - Actualizaciones regulares
   - Transparencia en el progreso
   - Feedback continuo

3. **Adaptabilidad**
   - Revisar y ajustar el proceso
   - Aprender de cada iteración
   - Cambiar de modo si es necesario

4. **Colaboración con IA**
   - Usar agentes especializados apropiadamente
   - Mantener contexto claro para los agentes
   - Documentar decisiones y razonamiento

## 📖 Recursos Adicionales

- [Workflow General](../README.md)
- [Agentes Especializados](../../agents/README.md)
- [Templates de Código](../../templates/README.md)
- [Guía de Configuración](../../project-setup.md)

## 🔄 Transición entre Modos

Es posible cambiar de modo durante el proyecto:

- **Sprint → Kanban**: Cuando el trabajo se vuelve más continuo
- **Kanban → Sprint**: Cuando necesitas más estructura
- **Rapid Prototype → Sprint**: Cuando el prototipo se convierte en producto
- **Sprint → Feature/Milestone**: Para grandes releases

Ver [Guía de Transición entre Modos](./mode-transition-guide.md)

---

_Plan Modes - Adaptando la metodología a las necesidades del proyecto_ 📋
