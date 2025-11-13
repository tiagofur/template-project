# 🤖 CI/CD Integration Guide

Guía completa para integrar testing automatizado en pipelines de CI/CD.

## 🎯 Overview

Esta guía cubre la integración de tests en GitHub Actions, GitLab CI, y otras plataformas populares de CI/CD.

## 📋 Table of Contents

- [GitHub Actions](#github-actions)
- [GitLab CI](#gitlab-ci)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Quality Gates](#quality-gates)
- [Notifications](#notifications)
- [Performance Optimization](#performance-optimization)

## 🐙 GitHub Actions

### Complete Test Pipeline

```yaml
# .github/workflows/test.yml
name: 🧪 Test Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  COVERAGE_THRESHOLD: 85

jobs:
  # Lint Job
  lint:
    name: 🔍 Lint Code
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
      
      - name: Run Prettier
        run: npm run format:check

  # Unit Tests
  unit-tests:
    name: 🔬 Unit Tests
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
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage --maxWorkers=2
      
      - name: Generate coverage report
        run: npm run test:coverage:report
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unit
          name: unit-coverage
      
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "📊 Coverage: $COVERAGE%"
          if (( $(echo "$COVERAGE < $COVERAGE_THRESHOLD" | bc -l) )); then
            echo "❌ Coverage $COVERAGE% is below threshold $COVERAGE_THRESHOLD%"
            exit 1
          fi
          echo "✅ Coverage threshold met"
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: unit-test-results
          path: |
            coverage/
            test-results/

  # Integration Tests
  integration-tests:
    name: 🔗 Integration Tests
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
      
      - name: Seed test data
        run: npm run db:seed:test
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: integration-test-results
          path: test-results/

  # E2E Tests
  e2e-tests:
    name: 🎭 E2E Tests
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm run start &
      
      - name: Wait for server
        run: npx wait-on http://localhost:3000 --timeout 60000
      
      - name: Run E2E tests
        run: npm run test:e2e -- --project=${{ matrix.browser }}
      
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 30
      
      - name: Upload trace files
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-traces-${{ matrix.browser }}
          path: test-results/

  # Performance Tests
  performance-tests:
    name: ⚡ Performance Tests
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    
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
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
      
      - name: Run k6 load tests
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/performance/load-test.js
          cloud: false
      
      - name: Upload performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: |
            .lighthouseci/
            k6-results/

  # Security Tests
  security-tests:
    name: 🔐 Security Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Run npm audit
        run: npm audit --production --audit-level=moderate
      
      - name: Run OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'project-name'
          path: '.'
          format: 'HTML'
      
      - name: Upload security results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: security-reports
          path: reports/

  # Quality Gate
  quality-gate:
    name: 🚦 Quality Gate
    needs: [lint, unit-tests, integration-tests, e2e-tests]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Check job results
        run: |
          if [ "${{ needs.lint.result }}" != "success" ] || \
             [ "${{ needs.unit-tests.result }}" != "success" ] || \
             [ "${{ needs.integration-tests.result }}" != "success" ] || \
             [ "${{ needs.e2e-tests.result }}" != "success" ]; then
            echo "❌ Quality gate failed"
            exit 1
          fi
          echo "✅ All quality checks passed"
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const status = '✅ All quality checks passed! Ready for review.';
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: status
            });
```

### Optimized Workflow (Cache & Parallelization)

```yaml
# .github/workflows/test-optimized.yml
name: 🚀 Optimized Test Pipeline

on: [push, pull_request]

jobs:
  setup:
    name: 📦 Setup & Cache
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js with cache
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Cache node_modules
        uses: actions/cache@v3
        id: cache-node-modules
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: npm ci
      
      - name: Cache build
        uses: actions/cache@v3
        with:
          path: |
            .next
            dist
          key: ${{ runner.os }}-build-${{ github.sha }}

  test:
    name: 🧪 Tests
    needs: setup
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        test-type: [unit, integration]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Restore cache
        uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
      - name: Run ${{ matrix.test-type }} tests
        run: npm run test:${{ matrix.test-type }}
```

## 🦊 GitLab CI

### Complete Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - security
  - deploy

variables:
  NODE_VERSION: "18"
  POSTGRES_DB: test_db
  POSTGRES_USER: test_user
  POSTGRES_PASSWORD: test_password

# Cache configuration
.cache_config: &cache_config
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
      - .npm/

# Lint Job
lint:
  stage: lint
  image: node:${NODE_VERSION}
  <<: *cache_config
  script:
    - npm ci
    - npm run lint
    - npm run format:check
  artifacts:
    reports:
      codequality: gl-code-quality-report.json

# Unit Tests
unit-tests:
  stage: test
  image: node:${NODE_VERSION}
  <<: *cache_config
  script:
    - npm ci
    - npm run test:unit -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/

# Integration Tests
integration-tests:
  stage: test
  image: node:${NODE_VERSION}
  <<: *cache_config
  services:
    - postgres:15
    - redis:7-alpine
  variables:
    DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}"
    REDIS_URL: "redis://redis:6379"
  script:
    - npm ci
    - npm run db:migrate
    - npm run test:integration
  artifacts:
    reports:
      junit: junit.xml

# E2E Tests
e2e-tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  <<: *cache_config
  parallel:
    matrix:
      - BROWSER: [chromium, firefox, webkit]
  script:
    - npm ci
    - npm run build
    - npm run start &
    - npx wait-on http://localhost:3000
    - npm run test:e2e -- --project=$BROWSER
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 30 days

# Security Scan
security-scan:
  stage: security
  image: node:${NODE_VERSION}
  script:
    - npm audit --production --audit-level=moderate
    - npm install -g snyk
    - snyk test --severity-threshold=high
  allow_failure: true
```

## 🪝 Pre-commit Hooks

### Husky Setup

```bash
# Install Husky
npm install --save-dev husky
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "npm run pre-commit"
```

### Pre-commit Script

```json
// package.json
{
  "scripts": {
    "pre-commit": "lint-staged && npm run test:changed",
    "test:changed": "jest --bail --findRelatedTests",
    "lint-staged": "lint-staged"
  }
}
```

### Lint-staged Configuration

```javascript
// .lintstagedrc.js
module.exports = {
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
    'jest --bail --findRelatedTests'
  ],
  '*.{json,md,yml,yaml}': [
    'prettier --write'
  ]
};
```

## 🚦 Quality Gates

### Coverage Gate

```yaml
- name: Enforce Coverage Threshold
  run: |
    #!/bin/bash
    
    THRESHOLD=85
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    
    echo "📊 Current coverage: $COVERAGE%"
    echo "🎯 Threshold: $THRESHOLD%"
    
    if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
      echo "❌ Coverage below threshold"
      exit 1
    fi
    
    echo "✅ Coverage threshold met"
```

### New Code Coverage Gate

```yaml
- name: Check New Code Coverage
  run: |
    #!/bin/bash
    
    # Get changed files
    CHANGED_FILES=$(git diff --name-only origin/main...HEAD | grep -E '\.(ts|tsx|js|jsx)$')
    
    # Check coverage for each new file
    for FILE in $CHANGED_FILES; do
      COVERAGE=$(cat coverage/coverage-summary.json | jq ".[\"$FILE\"].lines.pct // 0")
      
      if (( $(echo "$COVERAGE < 90" | bc -l) )); then
        echo "❌ $FILE has only $COVERAGE% coverage (minimum 90%)"
        exit 1
      fi
      
      echo "✅ $FILE: $COVERAGE% coverage"
    done
```

### Performance Budget Gate

```yaml
- name: Check Performance Budget
  run: |
    #!/bin/bash
    
    LIGHTHOUSE_SCORE=$(cat .lighthouseci/manifest.json | jq '.[0].summary.performance')
    
    if (( $(echo "$LIGHTHOUSE_SCORE < 90" | bc -l) )); then
      echo "❌ Performance score $LIGHTHOUSE_SCORE below 90"
      exit 1
    fi
    
    echo "✅ Performance budget met: $LIGHTHOUSE_SCORE"
```

## 🔔 Notifications

### Slack Notifications

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    payload: |
      {
        "text": "❌ Test pipeline failed for ${{ github.repository }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Test Pipeline Failed*\n*Repository:* ${{ github.repository }}\n*Branch:* ${{ github.ref }}\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}"
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "View Logs"
                },
                "url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
              }
            ]
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Email Notifications

```yaml
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: "❌ Test Pipeline Failed - ${{ github.repository }}"
    to: team@example.com
    from: CI/CD Pipeline
    body: |
      Test pipeline failed for ${{ github.repository }}
      
      Branch: ${{ github.ref }}
      Commit: ${{ github.sha }}
      Author: ${{ github.actor }}
      
      View logs: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

## ⚡ Performance Optimization

### Parallel Execution

```yaml
strategy:
  matrix:
    test-suite: [unit, integration, e2e]
    node-version: [16, 18, 20]
  max-parallel: 6

steps:
  - run: npm run test:${{ matrix.test-suite }}
```

### Caching Strategies

```yaml
# Cache dependencies
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# Cache Playwright browsers
- uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('**/package-lock.json') }}
```

### Conditional Execution

```yaml
# Only run tests on relevant changes
- name: Check for code changes
  id: changes
  uses: dorny/paths-filter@v2
  with:
    filters: |
      src:
        - 'src/**'
      tests:
        - 'tests/**'
        - '__tests__/**'

- name: Run tests
  if: steps.changes.outputs.src == 'true' || steps.changes.outputs.tests == 'true'
  run: npm test
```

## 📊 Reporting

### PR Comment with Results

```yaml
- name: Comment test results on PR
  uses: actions/github-script@v7
  if: github.event_name == 'pull_request'
  with:
    script: |
      const fs = require('fs');
      const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json'));
      
      const comment = `
      ## 🧪 Test Results
      
      | Metric | Coverage |
      |--------|----------|
      | Lines | ${coverage.total.lines.pct}% |
      | Branches | ${coverage.total.branches.pct}% |
      | Functions | ${coverage.total.functions.pct}% |
      | Statements | ${coverage.total.statements.pct}% |
      
      ${coverage.total.lines.pct >= 85 ? '✅' : '❌'} Coverage threshold: 85%
      `;
      
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: comment
      });
```

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Husky Documentation](https://typicode.github.io/husky/)

---

_CI/CD Integration - Automatizando testing con confianza_ 🤖
