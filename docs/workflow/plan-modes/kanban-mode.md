# 📊 Kanban Mode - Flujo Continuo

Metodología basada en flujo continuo de trabajo con límites de WIP (Work In Progress).

## 📖 Descripción General

Kanban Mode es ideal para trabajo continuo sin ciclos de tiempo fijos. Enfocado en visualizar el flujo, limitar el trabajo en progreso y optimizar continuamente el proceso.

## ⚙️ Configuración Inicial

### Definir el Sistema Kanban

```yaml
kanban_configuration:
  board_type: "Continuous Flow"
  wip_limits:
    backlog: unlimited
    ready: 10
    in_progress: 5
    review: 3
    testing: 3
    done: unlimited
  policies:
    - "Pull, don't push"
    - "Finish what you start"
    - "Respect WIP limits"
  metrics:
    - Lead Time
    - Cycle Time
    - Throughput
    - Flow Efficiency
```

### Roles del Equipo

- **Service Request Manager** (PM Agent): Gestiona el backlog y priorización
- **Team Members**: Todos los agents especializados
- **No roles fijos**: Los agents toman trabajo según capacidad

## 📋 Board Structure

### Columnas Estándar

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   Backlog   │    Ready    │ In Progress │  In Review  │   Testing   │    Done     │
│             │   WIP: 10   │   WIP: 5    │   WIP: 3    │   WIP: 3    │             │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│             │             │             │             │             │             │
│  Item 15    │   Item 8    │   Item 3    │   Item 1    │   Item A    │   Item X    │
│  Item 16    │   Item 9    │   Item 4    │   Item 2    │   Item B    │   Item Y    │
│  Item 17    │   Item 10   │   Item 5    │             │             │   Item Z    │
│     ...     │     ...     │             │             │             │     ...     │
│             │             │             │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Configuración en GitHub Projects

**Custom Fields**:
```yaml
fields:
  - name: Priority
    type: Single select
    options: [P0-Critical, P1-High, P2-Medium, P3-Low]
  
  - name: Type
    type: Single select
    options: [Feature, Bug, Tech Debt, Support]
  
  - name: Size
    type: Single select
    options: [XS, S, M, L, XL]
  
  - name: Agent
    type: Single select
    options: [Backend, React, Flutter, UI/UX, QA, DevOps]
  
  - name: Lead Time
    type: Number
    description: "Days from backlog to done"
  
  - name: Cycle Time
    type: Number
    description: "Days from in progress to done"
  
  - name: Blocked
    type: Checkbox
    description: "Is this item blocked?"
  
  - name: Blocker Reason
    type: Text
    description: "Why is this blocked?"
```

## 🔄 Workflow

### 1. Backlog Management

**Responsabilidad**: PM Agent

**Actividades**:
- Intake de nuevos requests
- Priorización continua
- Refinamiento de items
- Estimación de tamaño

**Template de Item**:

```markdown
# {{Type}}-{{ID}}: {{Title}}

## 📋 Description
{{Clear description of what needs to be done}}

## 🎯 Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## 📊 Metadata
- **Type**: {{Feature/Bug/Tech Debt/Support}}
- **Priority**: {{P0/P1/P2/P3}}
- **Size**: {{XS/S/M/L/XL}}
- **Estimated Lead Time**: {{days}}

## 🔗 Related Items
- Depends on: #{{issue}}
- Blocks: #{{issue}}

## 📝 Additional Context
{{Links, screenshots, technical details}}
```

### 2. Pull System

**Principio**: Los agents "pull" trabajo cuando tienen capacidad

**Reglas**:
1. Solo pull si tienes capacidad
2. Respeta los WIP limits
3. Termina lo que empezaste antes de tomar más
4. Pull de derecha a izquierda (ayuda a completar antes de empezar)

**Proceso de Pull**:

```markdown
## Daily Pull Process

### Morning Check (Each Agent)

1. **Revisa tus items en progreso**
   - ¿Hay algo bloqueado?
   - ¿Qué puedo avanzar hoy?
   - ¿Necesito ayuda?

2. **Chequea WIP limits**
   - ¿Estoy en mi límite?
   - ¿Puedo tomar más trabajo?

3. **Pull from Ready column**
   - Ordena por prioridad
   - Selecciona según tu especialidad
   - Verifica que tienes todo lo necesario
   - Mueve a "In Progress"

4. **Update the board**
   - Asigna el item a ti
   - Agrega comentario de inicio
   - Actualiza status
```

### 3. WIP Limits

**Por qué son importantes**:
- Previenen sobrecarga
- Fuerzan colaboración
- Exponen cuellos de botella
- Mejoran el flujo

**Definición de Límites**:

```yaml
# Configuración Recomendada
wip_limits:
  ready:
    limit: 2x team_size
    rationale: "Buffer suficiente pero no excesivo"
  
  in_progress:
    limit: team_size
    rationale: "Un item por agent como máximo"
  
  in_review:
    limit: team_size / 2
    rationale: "Force quick reviews"
  
  testing:
    limit: team_size / 2
    rationale: "Encourage test automation"
```

**Qué hacer cuando alcanzas el límite**:

```markdown
## WIP Limit Alcanzado - Action Plan

### Opción 1: Help Downstream
- Mira columnas a la derecha
- ¿Puedes ayudar con code review?
- ¿Puedes ayudar con testing?
- ¿Puedes ayudar a resolver blockers?

### Opción 2: Process Improvement
- ¿Por qué estamos en el límite?
- ¿Hay un cuello de botella?
- ¿Necesitamos ajustar WIP limits?
- ¿Necesitamos más capacidad en alguna área?

### Opción 3: Prepare Ahead
- Refina items en backlog
- Mejora documentación
- Actualiza tests
- Reduce technical debt
```

### 4. Flow Metrics

**Métricas Clave**:

#### Lead Time
Tiempo total desde que un item entra al backlog hasta que está done.

```
Lead Time = Done Date - Backlog Entry Date
Target: < 7 days para items S/M
```

#### Cycle Time
Tiempo desde que se empieza a trabajar hasta que está done.

```
Cycle Time = Done Date - In Progress Date
Target: < 3 days para items S/M
```

#### Throughput
Cantidad de items completados por período.

```
Throughput = Count of Done Items / Time Period
Target: > 10 items/week
```

#### Flow Efficiency
Porcentaje de tiempo que un item está siendo trabajado activamente.

```
Flow Efficiency = (Active Time / Lead Time) × 100
Target: > 40%
```

**Dashboard de Métricas**:

```markdown
# Kanban Metrics Dashboard - Week {{X}}

## 📊 Throughput
- **Completed**: {{X}} items
- **In Progress**: {{Y}} items
- **Throughput Rate**: {{Z}} items/week
- **Trend**: 📈/📊/📉

## ⏱️ Lead Time
- **Average**: {{X}} days
- **Median**: {{Y}} days
- **85th Percentile**: {{Z}} days
- **Target**: < 7 days
- **Status**: 🟢 On Target / 🟡 Warning / 🔴 Off Target

## 🔄 Cycle Time
- **Average**: {{X}} days
- **Median**: {{Y}} days
- **85th Percentile**: {{Z}} days
- **Target**: < 3 days
- **Status**: 🟢 On Target / 🟡 Warning / 🔴 Off Target

## 💪 Flow Efficiency
- **Current**: {{X}}%
- **Target**: > 40%
- **Wait Time**: {{Y}} days
- **Active Time**: {{Z}} days

## 🚧 Bottlenecks
- **Review**: {{X}} items waiting > 24h
- **Testing**: {{Y}} items waiting > 12h
- **Blocked**: {{Z}} items total

## 📈 Cumulative Flow Diagram
```
Items
 50 |
    |    ╱Done
 40 |  ╱Testing
    |╱In Review
 30 |In Progress
    |Ready
 20 |Backlog
    |
 10 |
    |
  0 |________________
    Week 1  2  3  4
```

## 🎯 Action Items
- [ ] {{Action based on metrics}}
- [ ] {{Action based on metrics}}
```

### 5. Continuous Improvement

**Kaizen (Mejora Continua)**:

**Weekly Review**:

```markdown
# Weekly Kanban Review - {{date}}

## 📊 Metrics Review
- **Throughput**: {{actual}} vs {{target}}
- **Lead Time**: {{actual}} vs {{target}}
- **Cycle Time**: {{actual}} vs {{target}}
- **WIP Violations**: {{count}}

## 🔍 Flow Analysis

### Bottlenecks Identified
1. **Code Review**
   - Issue: Reviews taking >24h
   - Impact: Items stuck, increased cycle time
   - Action: Implement review rotation

2. **Testing**
   - Issue: E2E tests taking too long
   - Impact: Reduced throughput
   - Action: Parallelize tests, improve fixtures

### Flow Improvements
- ✅ Reduced ready column from 15 to 10
- ✅ Added automated status updates
- ✅ Improved item descriptions

## 💡 Insights

### What's Working
- Pull system is natural for the team
- WIP limits preventing overload
- Metrics visibility driving improvements

### What Needs Attention
- Some agents consistently blocked
- Documentation quality varies
- Need better estimation

## 🚀 Experiments to Try

### Experiment 1: Pair Reviews
- **Hypothesis**: Pairing on reviews will reduce time
- **Metric**: Review cycle time
- **Duration**: 2 weeks
- **Success Criteria**: <12h review time

### Experiment 2: Types of Work Colors
- **Hypothesis**: Visual coding will help prioritization
- **Metric**: Priority adherence
- **Duration**: 1 week
- **Success Criteria**: P0/P1 items flow faster

## 📋 Action Items
- [ ] Implement review rotation - @pm-agent
- [ ] Parallelize E2E tests - @qa-agent
- [ ] Update item template with better prompts - @pm-agent
- [ ] Start pair review experiment - @all

## 🎯 Next Week Focus
- Reduce code review time to <12h
- Increase throughput by 10%
- Resolve all blocked items
```

## 🎓 Kanban Principles

### 1. Visualize the Workflow
Todo el trabajo debe ser visible en el board.

### 2. Limit Work in Progress
WIP limits son obligatorios, no sugerencias.

### 3. Manage Flow
Optimiza el flujo completo, no la velocidad de pasos individuales.

### 4. Make Policies Explicit
Documenta y comunica las reglas claramente.

### 5. Implement Feedback Loops
Reviews regulares y métricas visibles.

### 6. Improve Collaboratively
Kaizen basado en datos y experimentación.

## 📋 Templates

### Service Request Template

```markdown
# SR-{{ID}}: {{Title}}

## 🎯 Request Type
{{Bug Report / Feature Request / Support / Technical Debt}}

## 📝 Description
{{What needs to be done}}

## 🔥 Priority Justification
**Priority Level**: {{P0/P1/P2/P3}}

**Rationale**:
- P0: Critical production issue, blocking users
- P1: Important feature, high business value
- P2: Standard improvement
- P3: Nice to have, low priority

## 👤 Requestor
- **Name**: {{name}}
- **Role**: {{role}}
- **Contact**: {{email/slack}}

## 📊 Impact
- **Users Affected**: {{number/percentage}}
- **Business Impact**: {{revenue/reputation/legal}}
- **Urgency**: {{immediate/days/weeks}}

## ✅ Acceptance Criteria
- [ ] {{criterion 1}}
- [ ] {{criterion 2}}

## 📎 Attachments
- Screenshots
- Error logs
- Related issues

## 🏷️ Metadata
- Size: {{XS/S/M/L/XL}}
- Team: {{Agent}}
- Target Lead Time: {{days}}
```

### Class of Service

Diferentes tipos de trabajo tienen diferentes políticas:

```markdown
## Classes of Service

### 🔥 Expedite (P0)
- **Policy**: Stop everything, swarm on this
- **WIP Limit**: 1 at a time
- **SLA**: 4 hours
- **Examples**: Production down, security breach

### ⚡ Fixed Date (P1)
- **Policy**: Must be done by specific date
- **WIP Limit**: 20% of capacity
- **SLA**: Complete by deadline
- **Examples**: Regulatory deadline, customer commitment

### 🎯 Standard (P2)
- **Policy**: Normal flow, respect WIP limits
- **WIP Limit**: 60% of capacity
- **SLA**: 7 days lead time
- **Examples**: Features, improvements

### 🔧 Intangible (P3)
- **Policy**: Work on when capacity available
- **WIP Limit**: 20% of capacity
- **SLA**: None
- **Examples**: Tech debt, refactoring, learning
```

## 🛠️ Automation

### GitHub Actions for Kanban

```yaml
# .github/workflows/kanban-automation.yml
name: Kanban Automation

on:
  issues:
    types: [opened, labeled, assigned]
  pull_request:
    types: [opened, closed, review_requested]
  issue_comment:
    types: [created]

jobs:
  manage_flow:
    runs-on: ubuntu-latest
    steps:
      - name: Add to Backlog
        if: github.event.action == 'opened'
        # Add new issue to Backlog column
        
      - name: Move to Ready
        if: github.event.label.name == 'ready'
        # Move to Ready column
        
      - name: Check WIP Limit
        # Validate WIP limits before moving
        
      - name: Move to In Progress
        if: github.event.action == 'assigned'
        # Move to In Progress when assigned
        
      - name: Move to Review
        if: github.event.pull_request.action == 'opened'
        # Move to Review when PR opened
        
      - name: Track Metrics
        # Calculate and update lead/cycle time
        
      - name: Alert on Blocked
        if: github.event.label.name == 'blocked'
        # Notify team of blocker
```

### Metrics Collection

```yaml
# .github/workflows/kanban-metrics.yml
name: Collect Kanban Metrics

on:
  schedule:
    - cron: '0 0 * * *'  # Daily

jobs:
  collect_metrics:
    runs-on: ubuntu-latest
    steps:
      - name: Calculate Throughput
        # Count items completed in last 7 days
        
      - name: Calculate Lead Time
        # Average time from backlog to done
        
      - name: Calculate Cycle Time
        # Average time from in progress to done
        
      - name: Identify Bottlenecks
        # Find columns with most aged items
        
      - name: Update Dashboard
        # Post metrics to GitHub Project or Wiki
```

## 🎯 Best Practices

### Do's ✅
- Pull only when you have capacity
- Respect WIP limits strictly
- Help downstream before pulling new work
- Update metrics daily
- Make blockers visible immediately
- Focus on flow, not individual speed
- Continuously improve based on data

### Don'ts ❌
- Don't push work onto others
- Don't ignore WIP limits "just this once"
- Don't hoard work
- Don't start new work if items are blocked
- Don't skip metrics tracking
- Don't change process without data

## 📊 Health Indicators

### Healthy Kanban System
- 🟢 Consistent throughput
- 🟢 Predictable lead times
- 🟢 WIP limits respected >95% of time
- 🟢 Few blocked items (<10%)
- 🟢 Smooth flow (no spikes in CFD)

### Unhealthy Kanban System
- 🔴 Erratic throughput
- 🔴 Increasing lead times
- 🔴 Frequent WIP violations
- 🔴 Many blocked items (>20%)
- 🔴 Bulges in CFD (bottlenecks)

## 🔗 Templates Relacionados

- [Service Request Template](../../templates/planning/service-request.md)
- [Kanban Board Setup](../../templates/planning/kanban-board-setup.md)
- [Flow Metrics Dashboard](../../templates/planning/flow-metrics.md)
- [Weekly Review Template](../../templates/planning/kanban-review.md)

---

_Kanban Mode - Flujo continuo y optimización constante_ 📊
