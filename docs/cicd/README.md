# 🔄 CI/CD - Continuous Integration & Continuous Deployment

Guía completa para implementar pipelines de CI/CD modernos, automatizados y seguros.

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [GitHub Actions](#github-actions)
- [GitLab CI/CD](#gitlab-cicd)
- [Pipeline Best Practices](#pipeline-best-practices)
- [Security en CI/CD](#security-en-cicd)
- [Deployment Strategies](#deployment-strategies)
- [Troubleshooting](#troubleshooting)

## 🎯 Introducción

### ¿Qué es CI/CD?

**Continuous Integration (CI)**: Práctica de integrar cambios de código frecuentemente, con tests automatizados que validan cada integración.

**Continuous Deployment (CD)**: Práctica de desplegar automáticamente cada cambio que pasa todas las etapas del pipeline de producción.

### Beneficios

- ✅ **Detección temprana de errores**: Tests automáticos en cada commit
- ✅ **Despliegues más rápidos**: Automatización completa del proceso
- ✅ **Mayor confiabilidad**: Tests consistentes y reproducibles
- ✅ **Menor riesgo**: Despliegues incrementales y rollback automático
- ✅ **Mejor colaboración**: Feedback rápido para todo el equipo

### Conceptos Clave

- **Pipeline**: Conjunto de etapas automatizadas (build, test, deploy)
- **Workflow**: Definición completa de un pipeline
- **Job**: Unidad de ejecución dentro de un workflow
- **Step**: Acción individual dentro de un job
- **Artifact**: Archivo generado durante el pipeline (binarios, reports)
- **Environment**: Destino de deployment (dev, staging, production)

## 🚀 GitHub Actions

### Estructura Básica

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
```

### Pipeline Completo

```yaml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # 1. Linting y Format Check
  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Type check
        run: npm run type-check

  # 2. Unit & Integration Tests
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-${{ matrix.node-version }}

  # 3. Security Scanning
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run dependency audit
        run: npm audit --audit-level=moderate

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'myapp'
          path: '.'
          format: 'HTML'

  # 4. Build Application
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test, security]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
          retention-days: 7

  # 5. Build Docker Image
  docker:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: build
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha,prefix={{branch}}-

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # 6. E2E Tests
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: docker
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  # 7. Deploy to Staging
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [docker, e2e]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster staging-cluster \
            --service myapp-service \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster staging-cluster \
            --services myapp-service

      - name: Run smoke tests
        run: |
          npm run test:smoke -- --url https://staging.example.com

  # 8. Deploy to Production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [docker, e2e]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to ECS with Blue/Green
        run: |
          aws ecs update-service \
            --cluster production-cluster \
            --service myapp-service \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster production-cluster \
            --services myapp-service

      - name: Run smoke tests
        run: |
          npm run test:smoke -- --url https://example.com

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed! :rocket:'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### Reutilización con Composite Actions

```yaml
# .github/actions/setup-node/action.yml
name: 'Setup Node.js Environment'
description: 'Setup Node.js with caching'

inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'

runs:
  using: 'composite'
  steps:
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      shell: bash
      run: npm ci
```

Uso:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-node
    with:
      node-version: '20'
```

## 🦊 GitLab CI/CD

### Pipeline Básico

```yaml
# .gitlab-ci.yml
image: node:20-alpine

stages:
  - test
  - build
  - deploy

variables:
  NODE_ENV: production

cache:
  paths:
    - node_modules/

before_script:
  - npm ci

# Test Stage
test:lint:
  stage: test
  script:
    - npm run lint

test:unit:
  stage: test
  script:
    - npm run test:unit
  coverage: '/Statements\s+:\s+(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

test:integration:
  stage: test
  services:
    - postgres:16
    - redis:7
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
  script:
    - npm run test:integration

# Build Stage
build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

# Deploy Stage
deploy:staging:
  stage: deploy
  script:
    - npm run deploy:staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy:production:
  stage: deploy
  script:
    - npm run deploy:production
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
```

### Pipeline Completo con Docker

```yaml
# .gitlab-ci.yml
image: docker:24

services:
  - docker:24-dind

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA

stages:
  - test
  - security
  - build
  - deploy

# Test Stage
test:lint:
  image: node:20-alpine
  stage: test
  before_script:
    - npm ci
  script:
    - npm run lint
    - npm run type-check

test:unit:
  image: node:20-alpine
  stage: test
  before_script:
    - npm ci
  script:
    - npm run test:unit -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

# Security Stage
security:dependencies:
  image: node:20-alpine
  stage: security
  before_script:
    - npm ci
  script:
    - npm audit --audit-level=moderate
  allow_failure: true

security:container:
  stage: security
  before_script:
    - apk add --no-cache curl
  script:
    - |
      curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
      trivy image --exit-code 0 --severity HIGH,CRITICAL $IMAGE_TAG
  dependencies:
    - build:docker

# Build Stage
build:docker:
  stage: build
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
    - docker tag $IMAGE_TAG $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
    - develop

# Deploy Stage
deploy:staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
    - curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    - chmod +x kubectl
    - mv kubectl /usr/local/bin/
  script:
    - kubectl config use-context staging
    - kubectl set image deployment/myapp myapp=$IMAGE_TAG
    - kubectl rollout status deployment/myapp
  environment:
    name: staging
    url: https://staging.example.com
    on_stop: stop:staging
  only:
    - develop

deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
    - curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    - chmod +x kubectl
    - mv kubectl /usr/local/bin/
  script:
    - kubectl config use-context production
    - kubectl set image deployment/myapp myapp=$IMAGE_TAG
    - kubectl rollout status deployment/myapp
  environment:
    name: production
    url: https://example.com
    on_stop: stop:production
  only:
    - main
  when: manual

# Rollback jobs
stop:staging:
  stage: deploy
  script:
    - kubectl config use-context staging
    - kubectl rollout undo deployment/myapp
  environment:
    name: staging
    action: stop
  when: manual

stop:production:
  stage: deploy
  script:
    - kubectl config use-context production
    - kubectl rollout undo deployment/myapp
  environment:
    name: production
    action: stop
  when: manual
```

## 📋 Pipeline Best Practices

### 1. Fail Fast

```yaml
# Ejecutar tests rápidos primero
jobs:
  quick-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint        # Rápido
      - run: npm run type-check  # Rápido
  
  slow-tests:
    needs: quick-checks
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e    # Lento
```

### 2. Parallel Execution

```yaml
test:
  strategy:
    matrix:
      node-version: [18, 20]
      os: [ubuntu-latest, windows-latest, macos-latest]
  runs-on: ${{ matrix.os }}
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
```

### 3. Caching

```yaml
# npm cache
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

# Manual cache
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 4. Conditional Execution

```yaml
# Solo en main branch
deploy:
  if: github.ref == 'refs/heads/main'

# Solo en PRs
pr-checks:
  if: github.event_name == 'pull_request'

# Solo si archivo específico cambió
build-frontend:
  if: contains(github.event.head_commit.modified, 'frontend/')
```

### 5. Environment Protection

```yaml
deploy-production:
  environment:
    name: production
    url: https://example.com
  # Requiere aprobación manual en GitHub
```

### 6. Artifacts Management

```yaml
# Upload artifacts
- uses: actions/upload-artifact@v3
  with:
    name: build-files
    path: dist/
    retention-days: 7

# Download artifacts
- uses: actions/download-artifact@v3
  with:
    name: build-files
    path: dist/
```

## 🔐 Security en CI/CD

### Secrets Management

```yaml
# GitHub Actions
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    run: npm run deploy
```

### Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "devops-team"
    assignees:
      - "security-team"
    labels:
      - "dependencies"
      - "security"
```

### Security Scanning

```yaml
security:
  steps:
    # Dependency scanning
    - name: Run npm audit
      run: npm audit --audit-level=moderate
    
    # Container scanning
    - name: Run Trivy
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        severity: 'CRITICAL,HIGH'
    
    # Code scanning
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: javascript
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
```

### SAST (Static Application Security Testing)

```yaml
sast:
  image: returntocorp/semgrep
  script:
    - semgrep --config=auto --json --output=semgrep-report.json
  artifacts:
    reports:
      sast: semgrep-report.json
```

## 🚀 Deployment Strategies

### 1. Rolling Deployment

```yaml
deploy:
  strategy:
    rolling-update:
      max-surge: 1
      max-unavailable: 0
```

Características:
- ✅ Zero downtime
- ✅ Gradual rollout
- ⚠️ Puede tener versiones mixtas temporalmente

### 2. Blue-Green Deployment

```yaml
deploy:
  steps:
    # Deploy to green environment
    - name: Deploy to green
      run: ./deploy-green.sh
    
    # Run smoke tests
    - name: Test green environment
      run: npm run test:smoke -- --url https://green.example.com
    
    # Switch traffic
    - name: Switch to green
      run: ./switch-traffic.sh green
    
    # Keep blue for rollback
    - name: Standby blue
      run: echo "Blue environment on standby"
```

Características:
- ✅ Rollback instantáneo
- ✅ Full testing antes de switch
- ⚠️ Requiere doble de recursos

### 3. Canary Deployment

```yaml
deploy:
  steps:
    # Deploy canary (5% traffic)
    - name: Deploy canary
      run: kubectl set image deployment/myapp-canary myapp=$IMAGE_TAG
    
    # Monitor metrics
    - name: Monitor canary
      run: ./monitor-canary.sh --duration 10m
    
    # Gradual rollout
    - name: Increase to 25%
      run: ./set-traffic.sh --canary 25
    
    - name: Monitor
      run: ./monitor-canary.sh --duration 10m
    
    # Full rollout
    - name: Full deployment
      run: kubectl set image deployment/myapp myapp=$IMAGE_TAG
```

Características:
- ✅ Risk mitigation
- ✅ Real traffic testing
- ⚠️ Más complejo de implementar

### 4. Feature Flags

```typescript
// Feature flag integration
import { FeatureFlags } from './feature-flags';

export async function deploy() {
  // Deploy with feature disabled
  await deployApplication();
  
  // Gradually enable feature
  await FeatureFlags.enable('new-feature', {
    percentage: 10,
    userSegments: ['beta-testers']
  });
  
  // Monitor metrics
  await monitorMetrics('new-feature');
  
  // Full rollout
  await FeatureFlags.enable('new-feature', {
    percentage: 100
  });
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures

```yaml
# Debug build issues
- name: Build with verbose logging
  run: npm run build -- --verbose
  env:
    DEBUG: '*'

# Check environment
- name: Debug environment
  run: |
    node --version
    npm --version
    echo "PATH: $PATH"
    env | sort
```

#### 2. Test Failures

```yaml
# Run tests with debugging
- name: Run tests with debug
  run: npm run test -- --verbose --detectOpenHandles
  env:
    DEBUG: 'test:*'

# Upload test artifacts
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: test-results
    path: |
      test-results/
      screenshots/
```

#### 3. Deployment Issues

```yaml
# Verify deployment
- name: Check deployment status
  run: |
    kubectl get pods -l app=myapp
    kubectl describe deployment myapp
    kubectl logs -l app=myapp --tail=100

# Rollback on failure
- name: Rollback
  if: failure()
  run: kubectl rollout undo deployment/myapp
```

### Monitoring Pipeline Health

```yaml
# Send metrics to monitoring system
- name: Report metrics
  if: always()
  run: |
    curl -X POST https://metrics.example.com/pipeline \
      -d "status=${{ job.status }}" \
      -d "duration=${{ job.duration }}" \
      -d "branch=${{ github.ref }}"
```

## 📊 Métricas y KPIs

### Pipeline Metrics

- **Build Time**: Duración del pipeline completo
- **Success Rate**: Porcentaje de builds exitosos
- **MTTR**: Mean Time To Recovery
- **Deployment Frequency**: Frecuencia de deployments
- **Lead Time**: Tiempo desde commit hasta producción

### Dashboards

```yaml
# Prometheus metrics
pipeline_build_duration_seconds{status="success"} 245
pipeline_build_duration_seconds{status="failure"} 180
pipeline_success_rate 0.95
deployment_frequency_per_day 12
```

## 🎯 Checklist de Calidad

### Pre-Deployment

- [ ] Todos los tests pasan
- [ ] Code review aprobado
- [ ] Security scan limpio
- [ ] Documentation actualizada
- [ ] Changelog actualizado
- [ ] Database migrations verificadas

### Post-Deployment

- [ ] Smoke tests exitosos
- [ ] Metrics normales
- [ ] No errores en logs
- [ ] Performance aceptable
- [ ] Rollback plan probado

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [CircleCI Documentation](https://circleci.com/docs/)
- [Deployment Strategies](https://cloud.google.com/architecture/application-deployment-and-testing-strategies)

---

_CI/CD - Automatización completa del ciclo de vida del software_ 🔄
