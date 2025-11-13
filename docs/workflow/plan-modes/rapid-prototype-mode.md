# ⚡ Rapid Prototype Mode - Desarrollo Ágil de Prototipos

Metodología ultra-ágil para validación rápida de ideas, MVPs y proof of concepts.

## 📖 Descripción General

Rapid Prototype Mode es ideal para exploración, validación de ideas y creación rápida de MVPs. Prioriza velocidad y aprendizaje sobre código perfecto y procesos formales.

## ⚙️ Configuración Inicial

### Definir el Prototype

```yaml
prototype_configuration:
  name: "AI-Powered Search MVP"
  type: "MVP"  # MVP / POC / Technical Spike / UI Prototype
  duration: "1-2 weeks"
  goal: "Validate AI search feasibility and user interest"
  success_criteria:
    - Working demo in 2 weeks
    - User feedback from 10 testers
    - Decision on go/no-go for full development
  constraints:
    time: "2 weeks maximum"
    quality: "Good enough to test, not production ready"
    scope: "Minimal viable feature set only"
```

### Team Configuration

- **Small Team**: 2-3 agents máximo
- **Roles Flexibles**: Agents hacen lo necesario
- **Decision Maker**: PM Agent o Product Owner
- **No Overhead**: Mínimas ceremonias y documentación

## 🎯 Prototype Brief

```markdown
# Prototype Brief: {{Name}}

## 🚀 Quick Summary
{{One paragraph: what, why, who, when}}

## 💡 The Hypothesis

### Problem
{{What problem are we trying to solve?}}

### Solution Hypothesis
{{What do we think will solve it?}}

### Learning Goals
What do we want to learn from this prototype?

1. **Technical**: {{Can we build this with current tech stack?}}
2. **User Value**: {{Will users actually use this?}}
3. **Business**: {{Is this worth investing in?}}

### Success Looks Like
- [ ] {{Measurable outcome 1}}
- [ ] {{Measurable outcome 2}}
- [ ] {{Measurable outcome 3}}

## ⏱️ Time Box

- **Start**: {{date}}
- **End**: {{date}}
- **Duration**: {{X}} days (HARD STOP)
- **Demo Date**: {{date}}

## 🎯 Minimum Viable Feature Set

### MUST Have (Non-negotiable)
- [ ] {{Core feature 1}}
- [ ] {{Core feature 2}}
- [ ] {{Core feature 3}}

### WON'T Have (Explicitly out of scope)
- ❌ Authentication (use hardcoded user)
- ❌ Error handling (happy path only)
- ❌ Edge cases
- ❌ Performance optimization
- ❌ Scalability
- ❌ Production deployment
- ❌ Comprehensive tests (basic smoke tests only)
- ❌ Beautiful UI (functional is enough)

## 👥 Team

- **Lead**: @{{agent}} - Makes final decisions
- **Builder(s)**: @{{agent}}, @{{agent}}
- **Tester(s)**: {{names of real users}}

## 🛠️ Tech Stack

### Use What You Know
- **Backend**: {{Quick to build with}}
- **Frontend**: {{Minimal setup required}}
- **Database**: {{Simplest option}}
- **Deployment**: {{Fastest to deploy}}

**Principle**: Speed > Best Practice

### Acceptable Shortcuts
✅ Hardcoded values
✅ Mock data
✅ Third-party services (no-code tools)
✅ Template/starter code
✅ Skip tests (initially)
✅ No CI/CD
✅ Manual deployment
✅ Single environment (dev only)

## 📊 Validation Plan

### User Testing
- **Who**: {{target users}}
- **When**: Days {{X-Y}}
- **How**: {{demo session / survey / analytics}}
- **Questions**:
  1. {{Key question 1}}
  2. {{Key question 2}}
  3. {{Key question 3}}

### Success Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| User Interest | 7/10 average rating | Post-demo survey |
| Task Completion | >80% complete task | Observation |
| Technical Feasibility | Working demo | Does it work? |

## 🚦 Go/No-Go Decision Criteria

### GO (Continue to full development)
- ✅ Users rate >7/10 interest
- ✅ Technical feasibility proven
- ✅ Clear path to production
- ✅ ROI justifies investment

### PIVOT (Change direction)
- 🔄 Some value but needs changes
- 🔄 Technical approach wrong
- 🔄 User needs different than expected

### NO-GO (Stop here)
- ❌ Users rate <5/10 interest
- ❌ Technical blockers discovered
- ❌ ROI doesn't justify cost
- ❌ Better alternatives exist

## 📝 Documentation Requirements

### Minimal Docs (Must Have)
- [ ] This brief
- [ ] Demo video (2-3 minutes)
- [ ] Learnings document (1 page)
- [ ] Go/No-Go recommendation

### Skip (Nice to Have but not required)
- ❌ Detailed technical docs
- ❌ Architecture diagrams
- ❌ API documentation
- ❌ User manuals

---

**Created**: {{date}}
**Owner**: @{{agent}}
**Status**: 🚀 Active / ⏸️ Paused / ✅ Complete / ❌ Cancelled
```

## 🔄 Daily Workflow

### Day-by-Day Breakdown

#### Day 1: Setup & Planning (20%)

```markdown
# Day 1 Checklist

## Morning (3-4 hours)
- [ ] Finalize prototype brief
- [ ] Set up basic project structure
- [ ] Initialize git repo
- [ ] Deploy "Hello World" to hosting
- [ ] Set up basic data source (mock/real)

## Afternoon (3-4 hours)
- [ ] Scaffold main components
- [ ] Create basic UI layout
- [ ] Implement one core feature (simplest)
- [ ] Test it works end-to-end

## End of Day
- [ ] Demo to team (5 min)
- [ ] Note blockers
- [ ] Plan tomorrow

**Goal**: Working skeleton with ONE feature
```

#### Days 2-3: Core Features (40%)

```markdown
# Days 2-3 Checklist

## Focus
Build the 2-3 MUST-have features

## Day 2
- [ ] Feature 2 implementation
- [ ] Basic integration between features
- [ ] Smoke test the flow
- [ ] Quick standup (5 min)

## Day 3
- [ ] Feature 3 implementation
- [ ] Polish the happy path
- [ ] Fix obvious bugs
- [ ] Prepare for internal demo

## End of Day 3
- [ ] Internal demo to team
- [ ] Get feedback
- [ ] Adjust priorities if needed

**Goal**: All core features work (happy path)
```

#### Days 4-5: Polish & User Testing (30%)

```markdown
# Days 4-5 Checklist

## Day 4
- [ ] Fix critical bugs from internal demo
- [ ] Add basic error messages
- [ ] Improve UI/UX (just enough)
- [ ] Prepare demo script
- [ ] Recruit test users (if not done)

## Day 5
- [ ] Final bug fixes
- [ ] Create demo video
- [ ] Conduct user testing sessions
- [ ] Collect feedback
- [ ] Document learnings

**Goal**: Prototype ready for user testing
```

#### Day 6-7: Analysis & Decision (10%)

```markdown
# Days 6-7 Checklist

## Day 6
- [ ] Analyze user feedback
- [ ] Compile metrics
- [ ] Identify patterns
- [ ] Document learnings

## Day 7
- [ ] Create recommendation (Go/Pivot/No-Go)
- [ ] Prepare presentation for stakeholders
- [ ] Demo to stakeholders
- [ ] Get decision
- [ ] Celebrate or move on! 🎉

**Goal**: Clear decision and documented learnings
```

### Quick Daily Standup (5 min)

```markdown
# Quick Sync - {{date}}

**What I built yesterday**:
{{Brief description}}

**What I'm building today**:
{{Brief description}}

**Blockers**:
{{Any blockers or None}}

**Confidence**:
🟢 On track / 🟡 Slight concern / 🔴 Major issue
```

## 🎯 Prototype Execution Principles

### The 10 Commandments of Rapid Prototyping

1. **Time Box is Sacred**
   - Hard stop at deadline
   - Better done than perfect
   - Ship what you have

2. **Scope is Flexible**
   - Cut features aggressively
   - Only MUST-haves
   - Everything else is waste

3. **Speed Over Quality**
   - Shortcuts are encouraged
   - Technical debt is acceptable
   - Refactor only if building for real

4. **Learn, Don't Build**
   - Goal is validation, not production code
   - Data > opinions
   - Fail fast is success

5. **Happy Path Only**
   - Skip edge cases
   - Skip error handling
   - Skip validation (mostly)

6. **Hardcode Everything**
   - Fake data is fine
   - Mock APIs are fine
   - Single user is fine

7. **Use What Exists**
   - Templates over custom
   - Libraries over building
   - Services over infrastructure

8. **Document Minimally**
   - Code comments? Maybe
   - Architecture docs? No
   - Learnings doc? YES

9. **Show Early, Show Often**
   - Daily demos to yourself
   - Mid-week team demo
   - Final user demo

10. **Decide and Move On**
    - Go/Pivot/No-Go
    - No limbo
    - Next prototype or next phase

## 📊 Learning Documentation

### Learnings Template

```markdown
# Prototype Learnings: {{Name}}

## 🎯 Original Hypothesis
{{Restate the hypothesis from the brief}}

## ✅ What We Validated

### Technical Feasibility
**Finding**: {{Is it technically possible?}}

**Evidence**:
- {{Specific evidence 1}}
- {{Specific evidence 2}}

**Confidence**: 🟢 High / 🟡 Medium / 🔴 Low

### User Value
**Finding**: {{Do users want this?}}

**Evidence**:
- User feedback quotes
- Usage metrics
- Observed behavior

**Confidence**: 🟢 High / 🟡 Medium / 🔴 Low

### Business Viability
**Finding**: {{Is this worth building for real?}}

**Evidence**:
- Cost estimates
- Revenue potential
- Market size

**Confidence**: 🟢 High / 🟡 Medium / 🔴 Low

## ❌ What We Invalidated

### Assumptions That Were Wrong
1. **Assumption**: {{What we thought}}
   - **Reality**: {{What we learned}}
   - **Impact**: {{How this changes things}}

2. **Assumption**: {{What we thought}}
   - **Reality**: {{What we learned}}
   - **Impact**: {{How this changes things}}

## 💡 Surprises & Insights

### Unexpected Discoveries
- {{Insight 1}}
- {{Insight 2}}
- {{Insight 3}}

### User Quotes (Most Valuable!)
> "{{Actual user quote}}" - User 1

> "{{Actual user quote}}" - User 2

> "{{Actual user quote}}" - User 3

## 🚦 Recommendation

### Decision: 🟢 GO / 🔄 PIVOT / 🔴 NO-GO

### Rationale
{{Clear explanation of why}}

### If GO:
**What to build next**:
1. {{Priority 1}}
2. {{Priority 2}}
3. {{Priority 3}}

**Estimated effort**: {{weeks/months}}

**Team needed**: {{composition}}

**Risks**:
- {{Risk 1}}
- {{Risk 2}}

### If PIVOT:
**What to change**:
- {{Change 1}}
- {{Change 2}}

**New hypothesis to test**:
{{Revised hypothesis}}

**Timeline**: {{X}} weeks for next prototype

### If NO-GO:
**Why stop**:
- {{Reason 1}}
- {{Reason 2}}

**Alternative approaches**:
- {{Alternative 1}}
- {{Alternative 2}}

## 📊 Metrics Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| User Interest | 7/10 | {{X}}/10 | {{🟢/🟡/🔴}} |
| Task Completion | >80% | {{Y}}% | {{🟢/🟡/🔴}} |
| Time to Build | <2 weeks | {{Z}} days | {{🟢/🟡/🔴}} |

## 🎥 Demo Materials

- **Demo Video**: {{link}}
- **Screenshots**: {{link}}
- **Live Prototype**: {{link}} (may expire)

## 👥 Credits

- **Team**: {{agents involved}}
- **Testers**: {{user names}}
- **Sponsor**: {{stakeholder}}

---

**Completed**: {{date}}
**Time Spent**: {{X}} days
**Outcome**: {{Go/Pivot/No-Go}}
```

## 🛠️ Recommended Tech Stack for Speed

### Backend (Pick One)
```yaml
fastest_options:
  - Firebase/Supabase (No backend code needed)
  - Node.js + Express (Minimal setup)
  - Python + FastAPI (Quick API development)
  - Netlify/Vercel Functions (Serverless, zero config)
```

### Frontend (Pick One)
```yaml
fastest_options:
  - Create React App (Standard, well-known)
  - Next.js (If you need SSR)
  - Vite + React (Faster than CRA)
  - HTML/CSS/Vanilla JS (For simple UIs)
```

### Database (Pick One)
```yaml
fastest_options:
  - Firebase Firestore (No setup)
  - Supabase (PostgreSQL as a service)
  - MongoDB Atlas (Cloud, free tier)
  - Local JSON file (For tiny prototypes)
  - In-memory (For demos only)
```

### Deployment (Pick One)
```yaml
fastest_options:
  - Vercel (Push to deploy)
  - Netlify (Drag and drop)
  - GitHub Pages (Free, simple)
  - Heroku (One-click deploy)
```

### Starter Templates

```bash
# React + Vite (Recommended)
npm create vite@latest my-prototype -- --template react
cd my-prototype
npm install
npm run dev

# Next.js
npx create-next-app@latest my-prototype
cd my-prototype
npm run dev

# Backend - Express
npx express-generator my-api
cd my-api
npm install
npm start
```

## 📋 Prototype Types

### 1. UI/UX Prototype
**Goal**: Validate design and user flow

**Tools**:
- Figma (interactive prototypes)
- HTML/CSS/JS mockup
- React with mock data

**Duration**: 2-3 days

**Output**: Clickable prototype + user feedback

### 2. Technical Proof of Concept
**Goal**: Validate technical feasibility

**Focus**: Can we build this with tech X?

**Duration**: 3-5 days

**Output**: Working code + technical documentation

### 3. MVP (Minimum Viable Product)
**Goal**: Validate product-market fit

**Focus**: Will users pay for this?

**Duration**: 1-2 weeks

**Output**: Working product + user metrics

### 4. Technical Spike
**Goal**: Investigate unknown technical area

**Focus**: Research and experimentation

**Duration**: 1-3 days

**Output**: Report with findings and recommendation

## 🎓 Best Practices

### Do's ✅
- Use templates and starter code
- Hardcode liberally
- Ship something every day
- Demo frequently
- Collect real user feedback
- Document learnings immediately
- Make decision at the end
- Celebrate completion (success or failure!)

### Don'ts ❌
- Don't try to make it production-ready
- Don't add "nice to have" features
- Don't spend time on infrastructure
- Don't write extensive tests
- Don't refactor (unless blocking)
- Don't extend the timeline "just a bit more"
- Don't build without a hypothesis
- Don't continue if hypothesis is invalidated

## 🔧 Quick Tools & Resources

### No-Code/Low-Code Tools
- **Airtable**: Database + Forms
- **Zapier**: Integrations
- **Webflow**: Visual website builder
- **Bubble**: Full app builder
- **Retool**: Internal tools

### AI-Assisted Development
- **GitHub Copilot**: Code completion
- **ChatGPT**: Code generation and debugging
- **v0.dev**: UI component generation

### Quick Design
- **Tailwind CSS**: Utility-first CSS
- **shadcn/ui**: Copy-paste components
- **MUI**: Pre-built React components
- **DaisyUI**: Tailwind components

## 📊 Sample Schedule (2-Week Prototype)

```
Week 1: BUILD
├── Day 1: Setup + Feature 1 (20%)
├── Day 2: Feature 2 (20%)
├── Day 3: Feature 3 + Integration (20%)
├── Day 4: Polish + Internal Demo (15%)
└── Day 5: Bug Fixes (10%)

Week 2: VALIDATE
├── Day 6: User Testing Prep (5%)
├── Day 7: User Testing Session 1 (2%)
├── Day 8: User Testing Session 2 (2%)
├── Day 9: Analysis + Learnings Doc (3%)
└── Day 10: Recommendation + Stakeholder Demo (3%)

Total: 100% of 2 weeks
```

## 🎯 Success Stories

### When to Use Rapid Prototype

**Example 1: New Feature Validation**
- Situation: "Should we add AI-powered recommendations?"
- Prototype: 1-week mock with fake AI (rules-based)
- Outcome: Users loved it → GO to real AI implementation

**Example 2: Technical Feasibility**
- Situation: "Can we integrate with API X?"
- Prototype: 3-day spike with sandbox API
- Outcome: API too limited → NO-GO, found alternative

**Example 3: UI/UX Validation**
- Situation: "Which dashboard layout works better?"
- Prototype: 2 days, 2 Figma prototypes
- Outcome: Layout B won → Design finalized

## 🔗 Templates Relacionados

- [Prototype Brief Template](../../templates/planning/prototype-brief.md)
- [Learnings Document Template](../../templates/planning/prototype-learnings.md)
- [User Testing Script Template](../../templates/planning/user-testing-script.md)
- [Go/No-Go Decision Template](../../templates/planning/go-nogo-decision.md)

---

_Rapid Prototype Mode - Aprende rápido, decide rápido, muévete rápido_ ⚡
