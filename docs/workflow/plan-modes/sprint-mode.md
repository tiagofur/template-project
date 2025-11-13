# 🏃 Sprint Mode - Planificación Iterativa

Metodología ágil basada en ciclos de tiempo fijos con entregas incrementales.

## 📖 Descripción General

Sprint Mode es ideal para equipos que necesitan estructura, predictibilidad y entregas regulares. Basado en Scrum, organiza el trabajo en ciclos de tiempo fijos (sprints) con ceremonias definidas.

## ⚙️ Configuración Inicial

### Definir Parámetros del Sprint

```yaml
sprint_configuration:
  duration: 2 semanas  # 1-4 semanas típicamente
  team_size: 5-9 personas
  sprint_goal: "Objetivo claro y medible"
  capacity: 40 story points  # Ajustar según velocidad histórica
  ceremonies:
    - Sprint Planning
    - Daily Standup
    - Sprint Review
    - Sprint Retrospective
```

### Roles del Equipo

- **Product Owner** (o PM Agent): Prioriza el backlog
- **Scrum Master** (o PM Agent): Facilita el proceso
- **Development Team**: Backend, Frontend, QA, UI/UX Agents
- **Stakeholders**: Proveen feedback en reviews

## 📋 Workflow del Sprint

### 1. Sprint Planning (Inicio del Sprint)

**Duración**: 2-4 horas para sprint de 2 semanas

**Objetivos**:
- Definir el Sprint Goal
- Seleccionar User Stories del backlog
- Crear el Sprint Backlog
- Estimar y comprometerse con el trabajo

**Template de Planning**:

```markdown
# Sprint {{number}} Planning - {{start_date}}

## 🎯 Sprint Goal
{{Objetivo claro y enfocado del sprint}}

## 📊 Capacidad del Equipo
- **Disponibilidad**: {{X}} días/persona
- **Velocidad histórica**: {{Y}} story points
- **Capacidad planificada**: {{Z}} story points

## 📝 Backlog Seleccionado

### High Priority
- [ ] US-001: {{User Story}} - {{Points}} pts - Asignado a {{Agent}}
- [ ] US-002: {{User Story}} - {{Points}} pts - Asignado a {{Agent}}

### Medium Priority
- [ ] US-003: {{User Story}} - {{Points}} pts - Asignado a {{Agent}}

### Low Priority
- [ ] US-004: {{User Story}} - {{Points}} pts - Asignado a {{Agent}}

## 🎨 Design Tasks
- [ ] DESIGN-001: {{Task}} - Asignado a UI/UX Agent

## 🔧 Technical Tasks
- [ ] TECH-001: {{Task}} - Asignado a Backend Agent
- [ ] TECH-002: {{Task}} - Asignado a React Agent

## 🧪 Testing Tasks
- [ ] TEST-001: {{Task}} - Asignado a QA Agent

## ⚠️ Dependencies & Risks
- {{Dependencia/Riesgo 1}}
- {{Dependencia/Riesgo 2}}

## ✅ Definition of Done
- [ ] Código implementado y revisado
- [ ] Tests unitarios y de integración pasan
- [ ] Documentación actualizada
- [ ] Aprobado por Product Owner
- [ ] Deployable a staging
```

### 2. Daily Standup (Diario)

**Duración**: 15 minutos

**Formato**:

```markdown
# Daily Standup - {{date}}

## 🏗️ Backend Agent
**Yesterday**: Implementé la API de autenticación
**Today**: Voy a agregar validación de tokens
**Blockers**: Necesito acceso a la base de datos de staging

## ⚛️ React Agent
**Yesterday**: Creé el componente de login
**Today**: Integraré con la API de autenticación
**Blockers**: Esperando que Backend termine la API

## 🎨 UI/UX Agent
**Yesterday**: Finalicé wireframes del dashboard
**Today**: Empezaré los mockups de alta fidelidad
**Blockers**: Ninguno

## 🧪 QA Agent
**Yesterday**: Configuré el framework de testing
**Today**: Escribiré tests para el login
**Blockers**: Ninguno

## 🎯 Sprint Progress
- **Completed**: {{X}} story points
- **In Progress**: {{Y}} story points
- **Remaining**: {{Z}} story points
- **Sprint Health**: 🟢 On Track / 🟡 At Risk / 🔴 Off Track
```

### 3. Sprint Development (Durante el Sprint)

**Actividades Continuas**:

- Desarrollo de features según el Sprint Backlog
- Code reviews y pair programming
- Testing continuo
- Actualización del board (GitHub Projects)
- Comunicación asíncrona en comentarios de issues

**GitHub Projects Board**:

```
Columnas:
├── Backlog
├── Ready for Development
├── In Progress
├── In Review
├── Testing
└── Done
```

**Workflow Automation**:

```yaml
# .github/workflows/sprint-automation.yml
name: Sprint Automation

on:
  issues:
    types: [opened, labeled]
  pull_request:
    types: [opened, closed]

jobs:
  update_project:
    runs-on: ubuntu-latest
    steps:
      - name: Move issue to In Progress
        if: github.event.action == 'labeled' && github.event.label.name == 'in-progress'
        # Mover a columna "In Progress"
      
      - name: Move PR to Review
        if: github.event.pull_request.action == 'opened'
        # Mover a columna "In Review"
```

### 4. Sprint Review (Final del Sprint)

**Duración**: 1-2 horas

**Objetivos**:
- Demostrar trabajo completado
- Obtener feedback de stakeholders
- Actualizar el Product Backlog

**Template de Review**:

```markdown
# Sprint {{number}} Review - {{date}}

## 🎯 Sprint Goal
{{Sprint Goal original}}

**Status**: ✅ Achieved / ⚠️ Partially / ❌ Not Achieved

## 📊 Métricas del Sprint

### Velocity
- **Planned**: {{X}} story points
- **Completed**: {{Y}} story points
- **Velocity**: {{Y/X * 100}}%

### Calidad
- **Test Coverage**: {{Z}}%
- **Bugs Found**: {{count}}
- **Bugs Fixed**: {{count}}
- **Code Review Comments**: {{count}}

### Tiempo
- **Planned Days**: {{X}}
- **Actual Days**: {{Y}}
- **Efficiency**: {{ratio}}

## ✅ Completed Work

### User Stories
- ✅ US-001: Implementar sistema de login - 8pts - @backend-agent @react-agent
  - Demo: [Link to deployed feature]
  - Notes: Funciona perfectamente con OAuth

- ✅ US-002: Dashboard de usuario - 13pts - @react-agent @ui-ux-agent
  - Demo: [Screenshots/Video]
  - Notes: Incluye métricas en tiempo real

### Technical Achievements
- ✅ Configuración de CI/CD pipeline
- ✅ Implementación de caché Redis
- ✅ Optimización de queries (50% más rápido)

### Design Deliverables
- ✅ Sistema de diseño v1.0
- ✅ Componentes de UI reutilizables
- ✅ Guía de estilo completa

## ⏳ Incomplete Work

- ⚠️ US-003: Integración de pagos - 8pts - 60% completado
  - Razón: Problemas con API de Stripe en sandbox
  - Plan: Mover al próximo sprint con prioridad alta

## 🎨 Demos

### Feature 1: Sistema de Login
- **Descripción**: Login con email/password y OAuth
- **Agentes involucrados**: Backend, React, UI/UX
- **Screenshots**: [Adjuntar capturas]
- **Live Demo**: [Link si está disponible]

### Feature 2: Dashboard
- **Descripción**: Panel de control del usuario
- **Agentes involucrados**: React, UI/UX
- **Screenshots**: [Adjuntar capturas]
- **Métricas mostradas**: Users, Revenue, Engagement

## 💬 Stakeholder Feedback

### Feedback Positivo
- ✅ "El diseño del login es muy intuitivo"
- ✅ "El dashboard carga muy rápido"

### Áreas de Mejora
- 🔄 "Agregar opción de recordar sesión"
- 🔄 "Dashboard necesita filtros por fecha"

### Action Items
- [ ] Implementar "Remember me" checkbox - US-010
- [ ] Agregar filtros de fecha al dashboard - US-011

## 📈 Burndown Chart

```
Story Points
    40 |•
       |  •
    30 |    •
       |      •
    20 |        •••
       |           •
    10 |             ••
       |               •
     0 |_________________•
       Day 1  3  5  7  9 10
       
Legend: • Actual  --- Ideal
```

## 🔄 Product Backlog Updates

### Nuevos Items
- US-010: Remember me en login - 3pts
- US-011: Filtros de fecha en dashboard - 5pts

### Re-priorización
- US-005: Moved from Medium to High priority
- US-007: Moved from High to Low priority

## 🎯 Next Sprint Preview

### Tentative Sprint Goal
"Completar el flujo de pagos y agregar notificaciones"

### High Priority Items
- US-003: Integración de pagos (carry-over)
- US-012: Sistema de notificaciones
- US-010: Remember me feature

## 📝 Notes
{{Notas adicionales, observaciones, aprendizajes}}
```

### 5. Sprint Retrospective (Final del Sprint)

**Duración**: 1-1.5 horas

**Objetivos**:
- Reflexionar sobre el proceso
- Identificar mejoras
- Crear action items

**Template de Retrospective**:

```markdown
# Sprint {{number}} Retrospective - {{date}}

## 🌟 What Went Well

### Team Collaboration
- ✅ Excelente comunicación entre Backend y React agents
- ✅ Code reviews fueron rápidos y constructivos
- ✅ Pair programming en la integración compleja fue efectivo

### Technical Achievements
- ✅ CI/CD funcionó sin problemas
- ✅ Zero production bugs
- ✅ Performance mejoró 50%

### Process
- ✅ Daily standups fueron enfocados y breves
- ✅ Sprint planning fue más preciso que el anterior
- ✅ Documentación se mantuvo actualizada

## 😞 What Didn't Go Well

### Challenges
- ❌ Estimaciones muy optimistas en US-003
- ❌ Dependencias externas causaron delays
- ❌ Faltó tiempo para refactoring

### Technical Issues
- ❌ Problemas con el ambiente de staging
- ❌ API de terceros tuvo downtime
- ❌ Tests E2E fueron flakey

### Process Issues
- ❌ Algunos code reviews tomaron >24 horas
- ❌ Documentación de API se atrasó
- ❌ Cambios de último momento en diseño

## 🤔 What We Learned

### Insights
- 💡 Las integraciones con APIs externas deben tener más buffer
- 💡 Necesitamos mejor ambiente de sandbox para testing
- 💡 Los diseños deben estar finalizados antes del sprint
- 💡 El pair programming ahorra tiempo en el largo plazo

### Metrics Insights
- 📊 Velocity promedio es ahora 35 story points
- 📊 Code reviews toman en promedio 8 horas
- 📊 Bug fix ratio: 1 bug por cada 200 líneas de código

## 🚀 Action Items

### High Priority (Implementar en próximo sprint)
- [ ] Crear sandbox environment para APIs externas - @devops-agent - Deadline: Antes de sprint planning
- [ ] Establecer regla: Diseños finalizados 2 días antes del sprint - @pm-agent
- [ ] Configurar alertas para code reviews >12 horas - @pm-agent

### Medium Priority (Implementar en 2-3 sprints)
- [ ] Mejorar tests E2E para reducir flakiness - @qa-agent
- [ ] Crear guía de estimación para el equipo - @pm-agent
- [ ] Implementar design review en sprint N-1 - @ui-ux-agent

### Low Priority (Nice to have)
- [ ] Explorar herramientas de mob programming - @team
- [ ] Crear template de documentación de API - @backend-agent

## 📊 Sprint Health Metrics

### Velocity Trend
```
Sprint 1: 25 pts
Sprint 2: 30 pts
Sprint 3: 35 pts (current)
Trend: 📈 Increasing
```

### Quality Metrics
- **Bug Density**: 0.5 bugs/100 LOC (🟢 Good)
- **Test Coverage**: 85% (🟢 Good)
- **Technical Debt**: 2 days (🟡 Monitor)

### Team Satisfaction
- **Process**: 4.2/5
- **Collaboration**: 4.5/5
- **Tools**: 3.8/5
- **Overall**: 4.2/5

## 🎯 Goals for Next Sprint

### Process Improvements
1. Reduce code review time to <12 hours
2. Finalize designs before sprint starts
3. Improve estimation accuracy

### Technical Goals
1. Increase test coverage to 90%
2. Set up proper staging environment
3. Reduce technical debt by 1 day

### Team Goals
1. Try pair programming on complex features
2. Improve documentation practices
3. Faster feedback loops

## 💬 Team Shoutouts

- 🌟 Excelente trabajo de @react-agent en el dashboard
- 🌟 @backend-agent por la rápida resolución del bug crítico
- 🌟 @ui-ux-agent por el diseño intuitivo
- 🌟 @qa-agent por la cobertura exhaustiva de tests

## 📝 Notes & Follow-ups

{{Notas adicionales, temas para discutir con management, etc.}}

---

**Facilitator**: @pm-agent
**Participants**: All team agents
**Duration**: 90 minutes
**Next Retro**: {{date}}
```

## 📊 Métricas y Tracking

### Métricas Clave del Sprint

1. **Velocity**: Story points completados por sprint
2. **Sprint Goal Success Rate**: % de sprints donde se logró el goal
3. **Predictability**: Diferencia entre planeado vs completado
4. **Quality**: Bug density, test coverage, tech debt
5. **Team Health**: Satisfaction scores, burnout indicators

### GitHub Projects Integration

**Configurar Custom Fields**:
```yaml
fields:
  - Sprint Number
  - Story Points
  - Sprint Goal
  - Priority (High/Medium/Low)
  - Agent Assigned
  - Status
  - Acceptance Criteria Met (Yes/No)
```

**Vistas Recomendadas**:
- Sprint Board (Kanban view)
- Burndown Chart (Custom view)
- Velocity Chart (Insights)
- Team Workload (Agent view)

## 🎓 Best Practices

### Planning
1. **Sprint Goal primero**: Define el objetivo antes de seleccionar stories
2. **Capacity realista**: Considera vacaciones, días festivos, overhead
3. **Buffer para imprevistos**: Planifica al 80% de capacidad
4. **Dependencies claras**: Identifica y documenta todas las dependencias

### Durante el Sprint
1. **Protect the sprint**: Evita cambios de alcance mid-sprint
2. **Daily standups consistentes**: Mismo horario, mismo formato
3. **Update the board**: Mantén GitHub Projects actualizado
4. **Communicate blockers**: Levanta problemas inmediatamente

### Review & Retro
1. **Show working software**: Demos en vivo, no presentaciones
2. **Accept feedback**: El review es para aprender, no defender
3. **Action items reales**: Solo commits que se puedan implementar
4. **Track improvements**: Hacer seguimiento de action items previos

## 🛠️ Herramientas Recomendadas

- **Planning Poker**: Para estimación colaborativa
- **GitHub Projects**: Para board y tracking
- **Miro/Mural**: Para retrospectives visuales
- **Slack/Discord**: Para comunicación diaria
- **Loom**: Para demos asíncronas

## 📋 Checklists

### Sprint Start Checklist
- [ ] Sprint planning meeting completado
- [ ] Sprint goal definido y comunicado
- [ ] User stories estimadas y asignadas
- [ ] GitHub Project board actualizado
- [ ] Dependencies identificadas
- [ ] Team capacity confirmada

### Sprint End Checklist
- [ ] Sprint review completado
- [ ] Demos grabadas/documentadas
- [ ] Feedback de stakeholders recolectado
- [ ] Sprint retrospective completado
- [ ] Action items documentados y asignados
- [ ] Métricas del sprint calculadas
- [ ] Incomplete work movido al backlog

## 🔗 Templates Relacionados

- [Sprint Planning Template](../../templates/planning/sprint-planning.md)
- [Daily Standup Template](../../templates/planning/daily-standup.md)
- [Sprint Review Template](../../templates/planning/sprint-review.md)
- [Sprint Retrospective Template](../../templates/planning/sprint-retrospective.md)

---

_Sprint Mode - Entregas predecibles con mejora continua_ 🏃
