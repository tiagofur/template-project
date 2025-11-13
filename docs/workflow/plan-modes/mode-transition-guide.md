# 🔄 Mode Transition Guide

Guía para transicionar entre diferentes modos de planificación según las necesidades cambiantes del proyecto.

## 📖 Por Qué Cambiar de Modo

Los proyectos evolucionan y sus necesidades cambian. Un modo que funciona bien al inicio puede no ser óptimo más adelante.

### Señales de que Necesitas Cambiar

#### Señales de Cambio desde Sprint Mode

🔴 **A Kanban**:
- Trabajo llega de forma impredecible
- Difícil planear sprints completos
- Muchos cambios de prioridad mid-sprint
- Equipo trabaja en múltiples proyectos simultáneamente
- Overhead de ceremonias se siente excesivo

🔴 **A Feature/Milestone**:
- Necesitas coordinar release grande
- Stakeholders requieren más visibilidad
- Dependencias complejas entre features
- Fecha de entrega fija e inamovible

#### Señales de Cambio desde Kanban Mode

🔴 **A Sprint**:
- Necesitas más predictibilidad
- Equipo pide más estructura
- Stakeholders quieren compromisos de tiempo
- Quieres implementar mejora continua estructurada
- Necesitas métricas de velocidad

🔴 **A Feature/Milestone**:
- Gran release planificado
- Necesitas roadmap visible
- Coordinación entre múltiples equipos
- Presión de stakeholders por fechas

#### Señales de Cambio desde Rapid Prototype

🔴 **A Sprint**:
- Prototipo validado exitosamente (GO decision)
- Necesitas construir versión production-ready
- Equipo crece de 2-3 a 5+ personas
- Necesitas sostenibilidad a largo plazo

🔴 **A Kanban**:
- Prototipo se convierte en producto en mantenimiento
- Trabajo continuo de mejoras pequeñas
- Equipo pequeño permanente

## 🔄 Transiciones Comunes

### 1. Sprint → Kanban

**Cuándo**: Cuando el trabajo se vuelve más continuo y menos predecible.

**Plan de Transición**:

```markdown
# Transición: Sprint → Kanban

## Semana 1: Preparación
- [ ] Comunicar el cambio al equipo
- [ ] Completar sprint actual
- [ ] No iniciar nuevo sprint
- [ ] Configurar board Kanban en GitHub Projects
- [ ] Definir WIP limits iniciales
- [ ] Capacitar equipo en pull system

## Semana 2: Implementación
- [ ] Mover backlog a columna Ready
- [ ] Establecer políticas de pull
- [ ] Iniciar flujo continuo
- [ ] Daily standup adaptado a Kanban
- [ ] Monitorear métricas de flujo

## Semana 3-4: Ajuste
- [ ] Ajustar WIP limits según datos
- [ ] Identificar y resolver bottlenecks
- [ ] Primera weekly review
- [ ] Refinar proceso basado en feedback

## Métricas de Éxito
- WIP limits respetados >90%
- Lead time < 7 días
- Throughput estable
- Equipo cómodo con pull system
```

**Cambios en Ceremonias**:

| Sprint | Kanban |
|--------|--------|
| Sprint Planning (2h cada 2 semanas) | Backlog refinement (30min semanal) |
| Daily Standup (15min) | Daily Standup (15min, enfoque diferente) |
| Sprint Review (1h cada 2 semanas) | Weekly Review (30min) |
| Sprint Retrospective (1h cada 2 semanas) | Weekly Kaizen (30min) |

**Cambios en Métricas**:

| Sprint | Kanban |
|--------|--------|
| Velocity (story points/sprint) | Throughput (items/week) |
| Burndown chart | Cumulative Flow Diagram |
| Sprint goal achievement | Lead time, Cycle time |

### 2. Kanban → Sprint

**Cuándo**: Cuando necesitas más estructura y predictibilidad.

**Plan de Transición**:

```markdown
# Transición: Kanban → Sprint

## Semana 1: Análisis de Datos
- [ ] Analizar throughput de últimas 4 semanas
- [ ] Calcular velocidad promedio
- [ ] Identificar tamaño típico de items
- [ ] Determinar duración de sprint apropiada

## Semana 2: Preparación
- [ ] Comunicar cambio al equipo
- [ ] Configurar sprints en GitHub Projects
- [ ] Estimar items en backlog (story points)
- [ ] Definir Definition of Done
- [ ] Planear primer sprint

## Semana 3: Primer Sprint
- [ ] Sprint Planning
- [ ] Daily standups
- [ ] Tracking de burndown
- [ ] Sprint Review
- [ ] Sprint Retrospective

## Semanas 4-6: Estabilización
- [ ] Refinar estimaciones
- [ ] Ajustar duración si es necesario
- [ ] Mejorar ceremonias basado en retros
- [ ] Establecer velocidad baseline

## Métricas de Éxito
- Sprint goal achievement >80%
- Velocity estable (±20%)
- Equipo cómodo con estimaciones
- Ceremonias productivas
```

### 3. Rapid Prototype → Sprint

**Cuándo**: Prototipo validado y necesitas construir versión de producción.

**Plan de Transición**:

```markdown
# Transición: Prototype → Production (Sprint Mode)

## Fase 1: Decision & Planning (1 semana)
- [ ] Documentar learnings del prototype
- [ ] Definir production requirements
- [ ] Identificar technical debt del prototype
- [ ] Crear product backlog
- [ ] Estimar esfuerzo total (weeks/months)
- [ ] Definir success metrics

## Fase 2: Team Setup (1 semana)
- [ ] Formar equipo completo (vs prototype team)
- [ ] Definir roles y responsabilidades
- [ ] Setup de repositorio production
- [ ] Configurar CI/CD pipeline
- [ ] Establecer coding standards
- [ ] Setup GitHub Projects para sprints

## Fase 3: Technical Foundation (2-4 semanas)
- [ ] Refactor prototype code (si se reutiliza algo)
- [ ] Setup proper architecture
- [ ] Implement error handling
- [ ] Add comprehensive tests
- [ ] Security hardening
- [ ] Performance optimization

## Fase 4: Sprint Development (ongoing)
- [ ] Start sprint cadence
- [ ] Build features incrementally
- [ ] Maintain quality standards
- [ ] Regular stakeholder demos
- [ ] Continuous improvement

## Diferencias Clave

| Prototype | Production |
|-----------|------------|
| Hardcoded values | Configurable |
| Happy path only | Comprehensive error handling |
| Mock data | Real data with validation |
| No tests | >80% test coverage |
| Quick & dirty | Clean & maintainable |
| 1-2 weeks | Months of development |
```

### 4. Sprint → Feature/Milestone

**Cuándo**: Para grandes releases o proyectos con fechas fijas.

**Plan de Transición**:

```markdown
# Transición: Sprint → Milestone Mode

## Pre-Milestone (2 semanas antes)
- [ ] Completar sprint actual
- [ ] Definir milestone scope
- [ ] Crear milestone charter
- [ ] Identificar features y dependencies
- [ ] Asignar feature leads
- [ ] Comunicar a stakeholders

## Milestone Kickoff
- [ ] Milestone planning meeting
- [ ] Feature breakdown
- [ ] Timeline creation
- [ ] Risk assessment
- [ ] Team assignments
- [ ] Setup GitHub Projects roadmap view

## Durante Milestone
- [ ] Continue sprint cadence DENTRO del milestone
- [ ] Weekly milestone status reports
- [ ] Track against milestone timeline
- [ ] Manage dependencies actively
- [ ] Stakeholder updates

## Post-Milestone
- [ ] Release retrospective
- [ ] Return to regular sprint mode
- [ ] Document lessons learned
- [ ] Celebrate success!

## Nota Importante
Sprint mode continúa DURANTE el milestone. Milestone es una capa adicional de planning, no un reemplazo.
```

### 5. Kanban → Feature/Milestone

**Cuándo**: Similar a Sprint → Milestone, pero desde Kanban.

**Plan de Transición**:

```markdown
# Transición: Kanban → Milestone Mode

## Preparación (2 semanas)
- [ ] Freeze new work intake
- [ ] Complete in-progress items
- [ ] Define milestone scope
- [ ] Create milestone charter
- [ ] Setup milestone tracking

## Durante Milestone
- [ ] Kanban flow continúa
- [ ] Adicionar milestone tracking
- [ ] WIP limits por milestone features
- [ ] Weekly milestone reviews
- [ ] Dependency management

## Post-Milestone
- [ ] Return to regular Kanban
- [ ] Process improvements
- [ ] Lessons learned

## Hybrid Approach
Kanban para day-to-day flow + Milestone para big picture planning
```

## 🎯 Best Practices para Transiciones

### 1. Comunicación Clara

```markdown
# Template: Announcement de Cambio de Modo

**Subject**: Transición a {{New Mode}} - Efectivo {{Date}}

## Por Qué Estamos Cambiando
{{Clear rationale}}

## Qué Cambia
- {{Change 1}}
- {{Change 2}}
- {{Change 3}}

## Qué NO Cambia
- {{Constant 1}}
- {{Constant 2}}

## Timeline
- **Week 1**: {{Activities}}
- **Week 2**: {{Activities}}
- **Week 3**: {{Full transition}}

## Soporte & Questions
{{Contact person}} está disponible para preguntas.

## Training
{{Training sessions scheduled}}
```

### 2. Gradual Transition

No cambies todo de golpe:

```markdown
## Enfoque Gradual

### Semana 1: Aprender
- [ ] Educación sobre nuevo modo
- [ ] Review de documentation
- [ ] Q&A sessions

### Semana 2: Experimentar
- [ ] Pilot con subset del equipo
- [ ] Recolectar feedback
- [ ] Ajustar approach

### Semana 3: Implementar
- [ ] Full team adoption
- [ ] Monitor closely
- [ ] Provide support

### Semana 4: Optimizar
- [ ] Gather metrics
- [ ] Identify improvements
- [ ] Refine process
```

### 3. Preserve What Works

No descartes todo del modo anterior:

```markdown
## Qué Mantener en la Transición

### De Sprint a Kanban
✅ Keep: Daily standups (adjust format)
✅ Keep: Retrospectives (change to weekly)
✅ Keep: Definition of Done
❌ Drop: Sprint planning
❌ Drop: Sprint reviews
🔄 Adapt: Metrics and reporting

### De Kanban a Sprint
✅ Keep: WIP limits (per sprint)
✅ Keep: Pull system
✅ Keep: Flow focus
❌ Drop: Continuous intake
🔄 Adapt: Add sprint ceremonies
🔄 Adapt: Add sprint commitments
```

### 4. Measure Success

```markdown
## Metrics de Transición Exitosa

### Semana 1-2 (Expected Dip)
- Productivity: 60-70% of baseline (OK!)
- Team confidence: Low but improving
- Process adherence: Learning phase

### Semana 3-4 (Recovery)
- Productivity: 80-90% of baseline
- Team confidence: Medium
- Process adherence: Good

### Semana 5-8 (Stabilization)
- Productivity: 100%+ of baseline
- Team confidence: High
- Process adherence: Excellent

### Red Flags
🔴 Productivity <50% after week 2
🔴 Team morale declining
🔴 Increased conflict
🔴 Quality degradation
→ Reassess transition plan
```

## 📋 Decision Matrix

### Cuando el Proyecto es Nuevo

```
Start with: Rapid Prototype (if exploring idea)
         → Sprint (if building product)
         → Kanban (if continuous support)
```

### Cuando el Proyecto Madura

```
Early Stage:    Rapid Prototype / Sprint
Growth Stage:   Sprint / Feature/Milestone
Mature Stage:   Kanban / Sprint
Maintenance:    Kanban
```

### Basado en Tamaño de Equipo

```
1-2 agents:     Rapid Prototype / Kanban
3-5 agents:     Sprint / Kanban
6-9 agents:     Sprint
10+ agents:     Feature/Milestone + Sprint
```

### Basado en Tipo de Trabajo

```
Exploratory:    Rapid Prototype
Feature Dev:    Sprint
Continuous:     Kanban
Big Release:    Feature/Milestone
Mixed:          Hybrid (Kanban + Milestones)
```

## 🔧 Hybrid Approaches

A veces la mejor solución es combinar modos:

### Kanban + Milestones

```markdown
## Hybrid: Continuous Flow with Milestone Releases

**Day-to-Day**: Kanban flow
**Releases**: Milestone planning every quarter

### How it Works
- Regular work flows through Kanban
- Quarterly planning for major releases
- Milestones have fixed dates and scope
- Between milestones, pure Kanban

### Benefits
- Flexibility of Kanban
- Predictability of Milestones
- Best of both worlds
```

### Sprint + Rapid Prototyping

```markdown
## Hybrid: Sprints with Prototype Spikes

**Regular Work**: Sprint mode
**Exploration**: Rapid Prototype spikes

### How it Works
- Most work in regular sprints
- 20% capacity for prototype spikes
- Prototypes time-boxed to 1 week
- Results feed back into sprint backlog

### Benefits
- Structure of Sprints
- Innovation through Prototyping
- Balanced approach
```

## 🎓 Lessons Learned

### Common Mistakes

1. **Changing Too Quickly**
   - Give new mode 4-6 weeks minimum
   - Don't flip-flop between modes

2. **All or Nothing**
   - Gradual transitions work better
   - Pilot with subset first

3. **Ignoring Team Feedback**
   - Listen to the team
   - Adjust based on reality

4. **Forgetting to Update Tools**
   - Update GitHub Projects
   - Adjust automation
   - Change reporting

## 🔗 Resources

- [Sprint Mode Guide](./sprint-mode.md)
- [Kanban Mode Guide](./kanban-mode.md)
- [Feature/Milestone Mode Guide](./feature-milestone-mode.md)
- [Rapid Prototype Mode Guide](./rapid-prototype-mode.md)

---

_Mode Transitions - Adaptando el proceso a la realidad del proyecto_ 🔄
