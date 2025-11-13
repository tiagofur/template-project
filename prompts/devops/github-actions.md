# GitHub Actions Workflow

**Categoría:** DevOps  
**Nivel:** Intermedio  
**Tecnologías:** GitHub Actions, CI/CD

## Objetivo

Crear un workflow completo de GitHub Actions para CI/CD que incluya testing, linting, building y deployment automático.

## Contexto

Este prompt genera un pipeline CI/CD completo usando GitHub Actions. Ideal para automatizar el proceso de desarrollo desde el commit hasta el deployment en producción.

## Prompt

```
Crea un GitHub Actions workflow completo para {{project_type}} con {{stack}}.

Requisitos del Workflow:

1. Triggers:
   - Push a branches: main, develop
   - Pull requests a: main
   - Schedule: Daily security scan a las 2 AM UTC
   - Manual dispatch con input de environment

2. Jobs principales:

   **lint-and-format:**
   - Ejecutar linter ({{linter}})
   - Verificar formato de código ({{formatter}})
   - Fallar si hay errores

   **test:**
   - Ejecutar tests unitarios
   - Ejecutar tests de integración
   - Generar reporte de coverage
   - Upload coverage a Codecov
   - Requisito: >80% coverage

   **build:**
   - Compilar aplicación
   - Optimizar para producción
   - Generar artifacts
   - Upload artifacts

   **security:**
   - Dependency vulnerability scan
   - SAST (Static Application Security Testing)
   - Container image scanning si usa Docker

   **deploy-staging:**
   - Trigger: Push a develop
   - Deploy a ambiente staging
   - Run smoke tests
   - Notificar en Slack

   **deploy-production:**
   - Trigger: Push a main
   - Require approval manual
   - Blue-green deployment
   - Rollback automático si falla health check
   - Notificar en Slack

3. Configuración:
   - Use caching para dependencies
   - Matrix strategy para múltiples versiones de Node/Python/etc
   - Secrets para API keys y tokens
   - Environment variables por ambiente
   - Concurrency para cancelar runs obsoletos
   - Retry automático para steps flaky

4. Optimización:
   - Parallel jobs cuando sea posible
   - Cache de dependencies
   - Conditional jobs (no deploy en draft PRs)
   - Artifacts con retention apropiada

5. Notificaciones:
   - Slack notification en failures
   - GitHub status checks
   - Email para deployments a producción

Environment: {{environment}}
Cloud Provider: {{cloud_provider}}
```

## Ejemplo de Uso

### Variables a reemplazar:

- `{{project_type}}`: "Node.js API"
- `{{stack}}`: "Express.js + PostgreSQL"
- `{{linter}}`: "ESLint"
- `{{formatter}}`: "Prettier"
- `{{environment}}`: "AWS"
- `{{cloud_provider}}`: "AWS (ECS)"

## Resultados Esperados

### Workflow File (.github/workflows/ci-cd.yml)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - staging
          - production

env:
  NODE_VERSION: '18.x'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint-and-format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check Prettier formatting
        run: npm run format:check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true
      
      - name: Check coverage threshold
        run: npm run test:coverage:check

  build:
    needs: [lint-and-format, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
          retention-days: 7

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run dependency vulnerability scan
        run: npm audit --audit-level=high
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Run CodeQL analysis
        uses: github/codeql-action/analyze@v2

  deploy-staging:
    needs: [build, security]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to ECS
        run: |
          # Update ECS service
          aws ecs update-service \
            --cluster staging-cluster \
            --service api-service \
            --force-new-deployment
      
      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster staging-cluster \
            --services api-service
      
      - name: Run smoke tests
        run: npm run test:smoke
        env:
          API_URL: https://staging.example.com
      
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()

  deploy-production:
    needs: [build, security]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Blue-Green Deployment
        id: deploy
        run: |
          # Implement blue-green deployment logic
          ./scripts/blue-green-deploy.sh
      
      - name: Health Check
        run: |
          for i in {1..10}; do
            if curl -f https://example.com/health; then
              echo "Health check passed"
              exit 0
            fi
            echo "Health check attempt $i failed, retrying..."
            sleep 10
          done
          echo "Health check failed"
          exit 1
      
      - name: Rollback on failure
        if: failure()
        run: |
          ./scripts/rollback.sh
      
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

## Tips Adicionales

### Para Docker:

```
Agrega job para build y push de Docker image:

docker-build:
  - Build multi-stage image
  - Tag con SHA y latest
  - Push a GitHub Container Registry
  - Scan image con Trivy
```

### Para monorepo:

```
Agrega path filtering:
on:
  push:
    paths:
      - 'apps/api/**'
      - '.github/workflows/api.yml'
```

### Para múltiples environments:

```
Usa matrix strategy para deploy a múltiples regiones:
strategy:
  matrix:
    region: [us-east-1, eu-west-1, ap-southeast-1]
```

## Casos de Uso

- ✅ Node.js applications
- ✅ Python applications
- ✅ Go applications
- ✅ Frontend applications
- ✅ Monorepos
- ✅ Microservices

---

_GitHub Actions - Automatizando CI/CD_ ⚙️
