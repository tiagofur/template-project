# 🔗 GitHub Projects Integration Guide

Guía completa para integrar los diferentes modos de planificación con GitHub Projects.

## 📖 Descripción General

GitHub Projects es la herramienta principal para visualización y tracking de trabajo en todos los plan modes. Esta guía muestra cómo configurar y automatizar GitHub Projects para cada modo.

## 🚀 Setup Inicial

### 1. Crear un Nuevo Project

```bash
# Via GitHub CLI
gh project create --owner tiagofur --title "Template Project Board"

# O via GitHub Web UI
# 1. Ir a repositorio > Projects > New Project
# 2. Seleccionar template o empezar desde cero
# 3. Elegir layout (Table, Board, Roadmap)
```

### 2. Configurar Custom Fields

Campos comunes para todos los modos:

```yaml
custom_fields:
  - name: "Status"
    type: "Single select"
    options:
      - Backlog
      - Ready
      - In Progress
      - In Review
      - Testing
      - Done
  
  - name: "Priority"
    type: "Single select"
    options:
      - P0 - Critical
      - P1 - High
      - P2 - Medium
      - P3 - Low
  
  - name: "Size"
    type: "Single select"
    options:
      - XS (< 1 day)
      - S (1-2 days)
      - M (3-5 days)
      - L (1-2 weeks)
      - XL (> 2 weeks)
  
  - name: "Agent"
    type: "Single select"
    options:
      - Backend Agent
      - React Agent
      - Flutter Agent
      - UI/UX Agent
      - QA Agent
      - DevOps Agent
      - PM Agent
  
  - name: "Type"
    type: "Single select"
    options:
      - Feature
      - Bug
      - Tech Debt
      - Documentation
      - Research
```

## 📋 Configuración por Modo

### Sprint Mode Configuration

**Campos Adicionales**:

```yaml
sprint_fields:
  - name: "Sprint"
    type: "Iteration"
    duration: 2 weeks
    start_day: Monday
  
  - name: "Story Points"
    type: "Number"
  
  - name: "Sprint Goal"
    type: "Text"
  
  - name: "Acceptance Criteria Met"
    type: "Checkbox"
```

**Vistas Recomendadas**:

#### Vista 1: Sprint Board
```yaml
view: "Sprint Board"
layout: Board
group_by: Status
filter:
  - Sprint = Current Sprint
columns:
  - Backlog
  - Ready
  - In Progress
  - In Review
  - Testing
  - Done
```

#### Vista 2: Burndown Chart
```yaml
view: "Burndown"
layout: Insights
chart_type: Line
x_axis: Days
y_axis: Story Points Remaining
filter:
  - Sprint = Current Sprint
```

#### Vista 3: Team Workload
```yaml
view: "Team Workload"
layout: Table
group_by: Agent
fields:
  - Title
  - Status
  - Story Points
  - Priority
sort_by: Priority (descending)
```

**Automation Workflows**:

```yaml
# .github/workflows/sprint-automation.yml
name: Sprint Automation

on:
  issues:
    types: [opened, labeled, assigned, closed]
  pull_request:
    types: [opened, closed, review_requested]

jobs:
  update_project:
    runs-on: ubuntu-latest
    steps:
      - name: Add new issue to Backlog
        if: github.event.action == 'opened'
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/tiagofur/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Move to In Progress when assigned
        if: github.event.action == 'assigned'
        uses: actions/update-project-item@v0.1.0
        with:
          project-url: https://github.com/orgs/tiagofur/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
          field: Status
          value: In Progress
      
      - name: Move to In Review when PR opened
        if: github.event.pull_request.action == 'opened'
        uses: actions/update-project-item@v0.1.0
        with:
          project-url: https://github.com/orgs/tiagofur/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
          field: Status
          value: In Review
      
      - name: Move to Done when PR merged
        if: github.event.pull_request.merged == true
        uses: actions/update-project-item@v0.1.0
        with:
          project-url: https://github.com/orgs/tiagofur/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
          field: Status
          value: Done
```

### Kanban Mode Configuration

**Campos Adicionales**:

```yaml
kanban_fields:
  - name: "Lead Time"
    type: "Number"
    description: "Days from backlog to done"
  
  - name: "Cycle Time"
    type: "Number"
    description: "Days from in progress to done"
  
  - name: "Blocked"
    type: "Checkbox"
  
  - name: "Blocker Reason"
    type: "Text"
  
  - name: "Class of Service"
    type: "Single select"
    options:
      - Expedite
      - Fixed Date
      - Standard
      - Intangible
```

**WIP Limits Configuration**:

```yaml
wip_limits:
  Ready: 10
  In Progress: 5
  In Review: 3
  Testing: 3
```

**Vistas Recomendadas**:

#### Vista 1: Kanban Board
```yaml
view: "Kanban Flow"
layout: Board
group_by: Status
show_wip_limits: true
columns:
  - Backlog (no limit)
  - Ready (limit: 10)
  - In Progress (limit: 5)
  - In Review (limit: 3)
  - Testing (limit: 3)
  - Done (no limit)
```

#### Vista 2: Cumulative Flow Diagram
```yaml
view: "Cumulative Flow"
layout: Insights
chart_type: Area
x_axis: Date
y_axis: Items Count
stacked_by: Status
date_range: Last 30 days
```

#### Vista 3: Blocked Items
```yaml
view: "Blocked Items"
layout: Table
filter:
  - Blocked = true
fields:
  - Title
  - Blocker Reason
  - Agent
  - Priority
  - Days Blocked
sort_by: Days Blocked (descending)
```

**Automation Workflows**:

```yaml
# .github/workflows/kanban-automation.yml
name: Kanban Automation

on:
  issues:
    types: [opened, labeled, assigned, closed]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  enforce_wip_limits:
    runs-on: ubuntu-latest
    steps:
      - name: Check WIP Limits
        # Count items in each column
        # Alert if limit exceeded
      
      - name: Alert on old items
        # Find items in progress > 3 days
        # Notify team
  
  calculate_metrics:
    runs-on: ubuntu-latest
    steps:
      - name: Calculate Lead Time
        # Done Date - Created Date
      
      - name: Calculate Cycle Time
        # Done Date - In Progress Date
      
      - name: Update Dashboard
        # Post metrics to project or wiki
```

### Feature/Milestone Mode Configuration

**Campos Adicionales**:

```yaml
milestone_fields:
  - name: "Milestone"
    type: "Single select"
    options:
      - v1.0 - Q1 Release
      - v1.1 - Q2 Updates
      - v2.0 - Major Rewrite
  
  - name: "Feature"
    type: "Single select"
    options:
      - Authentication
      - Dashboard
      - Payments
      - Analytics
  
  - name: "Phase"
    type: "Single select"
    options:
      - Planning
      - Development
      - Integration
      - QA
      - Release
  
  - name: "Target Date"
    type: "Date"
  
  - name: "Dependencies"
    type: "Text"
```

**Vistas Recomendadas**:

#### Vista 1: Milestone Roadmap
```yaml
view: "Roadmap"
layout: Roadmap
group_by: Milestone
x_axis: Target Date
swimlanes: Feature
show_dependencies: true
date_range: Next 6 months
```

#### Vista 2: Feature Progress
```yaml
view: "Feature Progress"
layout: Table
group_by: Feature
fields:
  - Title
  - Status
  - Agent
  - Target Date
  - Phase
show_progress_bar: true
filter:
  - Milestone = Current Milestone
```

#### Vista 3: Dependencies View
```yaml
view: "Dependencies"
layout: Graph
show_relationships: true
filter:
  - Milestone = Current Milestone
highlight: Blocking items
```

**Automation Workflows**:

```yaml
# .github/workflows/milestone-automation.yml
name: Milestone Automation

on:
  issues:
    types: [opened, labeled, milestoned]
  schedule:
    - cron: '0 9 * * FRI'  # Weekly report on Fridays

jobs:
  milestone_tracking:
    runs-on: ubuntu-latest
    steps:
      - name: Update milestone progress
        # Calculate % complete
      
      - name: Identify at-risk items
        # Items behind schedule
      
      - name: Generate status report
        # Weekly report for stakeholders
      
      - name: Alert on dependencies
        # Notify if dependency is blocking
```

### Rapid Prototype Mode Configuration

**Campos Adicionales**:

```yaml
prototype_fields:
  - name: "Prototype"
    type: "Single select"
    options:
      - AI Search MVP
      - Mobile Redesign POC
      - Payment Integration Spike
  
  - name: "Hypothesis"
    type: "Text"
  
  - name: "Decision"
    type: "Single select"
    options:
      - Go
      - Pivot
      - No-Go
      - Pending
  
  - name: "Learning"
    type: "Text"
  
  - name: "Demo Date"
    type: "Date"
```

**Vistas Recomendadas**:

#### Vista 1: Active Prototypes
```yaml
view: "Active Prototypes"
layout: Board
group_by: Status
filter:
  - Decision = Pending
columns:
  - To Do
  - Building
  - Testing
  - Validating
```

#### Vista 2: Learnings Log
```yaml
view: "Learnings"
layout: Table
fields:
  - Prototype
  - Hypothesis
  - Decision
  - Learning
  - Demo Date
filter:
  - Decision != Pending
sort_by: Demo Date (descending)
```

## 🤖 Advanced Automation

### Auto-Labeling

```yaml
# .github/workflows/auto-label.yml
name: Auto Label

on:
  issues:
    types: [opened]

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - name: Label by keywords
        uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          configuration-path: .github/labeler.yml
```

```yaml
# .github/labeler.yml
'priority:high':
  - '**/*urgent*/**'
  - '**/*critical*/**'
  - '**/*blocker*/**'

'type:bug':
  - '**/*bug*/**'
  - '**/*error*/**'
  - '**/*fix*/**'

'type:feature':
  - '**/*feature*/**'
  - '**/*enhancement*/**'
```

### Automated Metrics

```yaml
# .github/workflows/metrics.yml
name: Project Metrics

on:
  schedule:
    - cron: '0 0 * * *'  # Daily

jobs:
  collect_metrics:
    runs-on: ubuntu-latest
    steps:
      - name: Calculate velocity (Sprint Mode)
        # Story points completed per sprint
      
      - name: Calculate throughput (Kanban Mode)
        # Items completed per week
      
      - name: Calculate lead time
        # Average time from backlog to done
      
      - name: Update dashboard
        # Post to GitHub Wiki or external dashboard
```

### Slack/Discord Integration

```yaml
# .github/workflows/notifications.yml
name: Team Notifications

on:
  issues:
    types: [opened, labeled]
  pull_request:
    types: [opened, review_requested]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify on Slack
        if: github.event.label.name == 'priority:high'
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "High priority issue created: ${{ github.event.issue.title }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*New High Priority Issue*\n<${{ github.event.issue.html_url }}|${{ github.event.issue.title }}>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 📊 Dashboards & Reporting

### Sprint Metrics Dashboard

```markdown
# Sprint Metrics - Sprint {{number}}

## Velocity
- **Planned**: {{X}} points
- **Completed**: {{Y}} points
- **Velocity**: {{Y/X * 100}}%

## Burndown
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
```

## Quality
- **Bug Count**: {{X}}
- **Test Coverage**: {{Y}}%
- **Code Review Time**: {{Z}}h avg

_Auto-generated daily by GitHub Actions_
```

### Kanban Flow Metrics

```markdown
# Kanban Flow Metrics - Week {{number}}

## Throughput
- **Items Completed**: {{X}}
- **Items Started**: {{Y}}
- **Net Flow**: {{X - Y}}

## Lead Time
- **Average**: {{X}} days
- **Median**: {{Y}} days
- **85th Percentile**: {{Z}} days

## Cycle Time
- **Average**: {{X}} days
- **Median**: {{Y}} days
- **85th Percentile**: {{Z}} days

## Bottlenecks
- **In Review**: {{X}} items > 24h
- **Blocked**: {{Y}} items

_Auto-generated weekly by GitHub Actions_
```

## 🎓 Best Practices

### General

1. **Keep It Updated**
   - Automate status updates where possible
   - Manual updates daily minimum
   - Review board health weekly

2. **Use Consistent Labels**
   - Define label taxonomy
   - Use automation for common labels
   - Regular cleanup of unused labels

3. **Leverage Automation**
   - Automate repetitive tasks
   - Set up alerts for important events
   - Generate reports automatically

4. **Make It Visible**
   - Share dashboard links with stakeholders
   - Include metrics in standup meetings
   - Celebrate wins publicly

### Sprint Mode Specific

- Set up iterations properly
- Track story points consistently
- Review burndown daily
- Adjust velocity based on data

### Kanban Mode Specific

- Enforce WIP limits strictly
- Monitor flow metrics weekly
- Identify bottlenecks quickly
- Optimize for flow, not speed

### Feature/Milestone Specific

- Keep roadmap updated
- Track dependencies carefully
- Communicate delays immediately
- Maintain stakeholder visibility

### Rapid Prototype Specific

- Time-box strictly
- Document learnings immediately
- Make decisions quickly
- Archive completed prototypes

## 🔗 Recursos

### GitHub Documentation
- [GitHub Projects Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Actions for Projects](https://github.com/actions/add-to-project)
- [Project Automation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)

### Templates
- [Project Templates](../../templates/planning/)
- [Workflow Templates](../../templates/workflows/)

### Tools
- [GitHub CLI](https://cli.github.com/)
- [Project CLI Extension](https://github.com/github/gh-projects)

---

_GitHub Projects Integration - Visualización y automatización efectiva_ 🔗
