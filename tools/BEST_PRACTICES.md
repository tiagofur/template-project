# 🎯 Tools Best Practices

Guía completa de mejores prácticas para seleccionar, configurar y usar herramientas de desarrollo.

## 📋 Tabla de Contenidos

- [Selección de Herramientas](#selección-de-herramientas)
- [Gestión de Herramientas](#gestión-de-herramientas)
- [Configuración y Setup](#configuración-y-setup)
- [Integración CI/CD](#integración-cicd)
- [Mantenimiento](#mantenimiento)
- [Seguridad](#seguridad)
- [Performance](#performance)
- [Documentación](#documentación)

## 🎯 Selección de Herramientas

### Criterios de Evaluación

#### 1. Madurez del Proyecto
```
✅ Verificar:
- Años activo
- Frecuencia de releases
- Tamaño de comunidad
- Stars en GitHub
- Respuesta a issues
- Documentación actualizada
```

#### 2. Adopción en la Industria
```
✅ Investigar:
- Empresas que la usan
- Stack Overflow trends
- npm/PyPI downloads
- State of JS/Python surveys
- Comparativas técnicas
```

#### 3. Compatibilidad
```
✅ Validar:
- Compatibilidad con tu stack
- Requisitos de sistema
- Versiones soportadas
- Integraciones disponibles
- Migración desde otras tools
```

#### 4. Costo Total
```
✅ Considerar:
- Licencia (OSS, Comercial, Freemium)
- Costo de learning curve
- Tiempo de setup
- Mantenimiento continuo
- Escalabilidad de precios
```

### Proceso de Evaluación

```markdown
1. **Research Phase** (1-2 días)
   - Identificar opciones
   - Leer documentación
   - Ver demos/tutoriales
   - Comparar features

2. **POC Phase** (3-5 días)
   - Setup básico
   - Implementar caso de uso simple
   - Medir performance
   - Evaluar DX

3. **Decision Phase** (1 día)
   - Crear matriz de decisión
   - Discutir con equipo
   - Documentar elección
   - Planear adopción
```

### Matriz de Decisión

| Herramienta | Madurez | Adopción | Features | Costo | DX | Total |
|-------------|---------|----------|----------|-------|----|----|
| Tool A      | 9/10    | 8/10     | 7/10     | 9/10  | 8/10 | 41/50 |
| Tool B      | 7/10    | 9/10     | 9/10     | 6/10  | 9/10 | 40/50 |
| Tool C      | 8/10    | 7/10     | 8/10     | 8/10  | 7/10 | 38/50 |

## 🗂️ Gestión de Herramientas

### Version Management

#### Node.js - nvm
```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Usar versión específica
nvm install 18.17.0
nvm use 18.17.0
nvm alias default 18.17.0

# .nvmrc en proyecto
echo "18.17.0" > .nvmrc
nvm use
```

#### Python - pyenv
```bash
# Instalar pyenv
curl https://pyenv.run | bash

# Instalar versión
pyenv install 3.11.0
pyenv global 3.11.0

# .python-version en proyecto
echo "3.11.0" > .python-version
```

#### Ruby - rbenv
```bash
# Instalar rbenv
brew install rbenv

# Instalar versión
rbenv install 3.2.0
rbenv global 3.2.0

# .ruby-version en proyecto
echo "3.2.0" > .ruby-version
```

### Package Management

#### Lock Files
```bash
# SIEMPRE commitear lock files
✅ package-lock.json (npm)
✅ yarn.lock (yarn)
✅ pnpm-lock.yaml (pnpm)
✅ Pipfile.lock (Python)
✅ Gemfile.lock (Ruby)
✅ go.sum (Go)
```

#### Dependency Updates
```json
{
  "scripts": {
    "deps:check": "npm outdated",
    "deps:update": "npm update",
    "deps:audit": "npm audit",
    "deps:audit:fix": "npm audit fix"
  }
}
```

### Tool Documentation

```markdown
# tools.md en tu proyecto

## Herramientas Usadas

### Build Tools
- **Node.js**: 18.17.0 (via nvm)
- **npm**: 9.6.7
- **TypeScript**: 5.1.6

### Development
- **ESLint**: 8.45.0
- **Prettier**: 3.0.0
- **Jest**: 29.6.0

### CI/CD
- **GitHub Actions**
- **Docker**: 24.0.0

### Deployment
- **Vercel**

## Setup Instructions
1. Install Node.js 18.17.0 with nvm
2. Run `npm ci`
3. Copy `.env.example` to `.env`
4. Run `npm run dev`

## Common Commands
- `npm run dev` - Start dev server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run lint` - Lint code
```

## ⚙️ Configuración y Setup

### Configuración Compartida

#### EditorConfig
```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.py]
indent_size = 4
```

#### ESLint
```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "root": true
}
```

#### Prettier
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Git Hooks (Husky)

```bash
# Instalar husky
npm install --save-dev husky lint-staged

# Setup
npx husky-init
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm test
```

### Docker Development

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Development mode
CMD ["npm", "run", "dev"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🔄 Integración CI/CD

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test -- --coverage
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm test -- --coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
  only:
    - main

deploy:
  stage: deploy
  script:
    - ./deploy.sh
  only:
    - main
```

## 🔧 Mantenimiento

### Dependency Updates Schedule

```markdown
## Weekly (Automated)
- [ ] Security patches (Dependabot/Renovate)
- [ ] Minor updates (non-breaking)

## Monthly (Manual Review)
- [ ] Major updates
- [ ] Breaking changes
- [ ] Deprecated packages
- [ ] License changes

## Quarterly
- [ ] Full dependency audit
- [ ] Remove unused dependencies
- [ ] Evaluate alternatives
- [ ] Update documentation
```

### Renovate Configuration

```json
// renovate.json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["major-update"]
    }
  ],
  "schedule": ["before 5am on Monday"],
  "timezone": "America/New_York"
}
```

### Health Checks

```bash
#!/bin/bash
# health-check.sh

echo "🔍 Running health checks..."

# Check for outdated dependencies
echo "\n📦 Checking dependencies..."
npm outdated

# Security audit
echo "\n🔒 Security audit..."
npm audit

# Check for unused dependencies
echo "\n🧹 Checking for unused deps..."
npx depcheck

# License check
echo "\n📜 License check..."
npx license-checker --summary

echo "\n✅ Health check complete!"
```

## 🔐 Seguridad

### Secret Management

```bash
# ❌ NUNCA hacer esto
API_KEY=secret123

# ✅ Usar variables de entorno
# .env (NO commitear)
API_KEY=secret123

# .env.example (SI commitear)
API_KEY=your_api_key_here
```

### Pre-commit Security Scan

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for secrets
npx secretlint "**/*"

# Scan dependencies
npm audit --audit-level=moderate

# Lint staged files
npx lint-staged
```

### Security Headers

```javascript
// security-headers.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## ⚡ Performance

### Build Optimization

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  },
  cache: {
    type: 'filesystem'
  }
};
```

### CI/CD Caching

```yaml
# GitHub Actions
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Development Performance

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 📚 Documentación

### README Template

```markdown
# Project Name

Brief description

## Prerequisites

- Node.js 18.x
- npm 9.x
- Docker (optional)

## Installation

\`\`\`bash
git clone https://github.com/user/repo.git
cd repo
npm install
cp .env.example .env
\`\`\`

## Usage

\`\`\`bash
npm run dev      # Development
npm test         # Tests
npm run build    # Production build
\`\`\`

## Tools Used

- **Build**: Vite
- **Testing**: Jest, Playwright
- **Linting**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

### CONTRIBUTING.md

```markdown
# Contributing

## Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm ci`
4. Create a branch: `git checkout -b feature/my-feature`

## Development

- Run tests: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Tests
- `chore:` Maintenance

## Pull Request

1. Update documentation
2. Add tests
3. Run linters
4. Submit PR
```

## 🎯 Checklist de Proyecto

```markdown
## Nuevo Proyecto

### Setup Inicial
- [ ] Inicializar git
- [ ] Setup .gitignore
- [ ] Setup .editorconfig
- [ ] Configurar version manager (nvm, pyenv)
- [ ] Instalar dependencias base

### Calidad de Código
- [ ] Setup linter (ESLint, Pylint)
- [ ] Setup formatter (Prettier, Black)
- [ ] Configurar pre-commit hooks (Husky)
- [ ] Setup testing framework

### CI/CD
- [ ] Configurar GitHub Actions / GitLab CI
- [ ] Setup dependency scanning
- [ ] Setup security scanning
- [ ] Configurar deployment

### Documentación
- [ ] README.md completo
- [ ] CONTRIBUTING.md
- [ ] LICENSE
- [ ] API documentation
- [ ] Architecture docs

### Seguridad
- [ ] Setup secret management
- [ ] Configurar Dependabot
- [ ] Security headers
- [ ] HTTPS everywhere
- [ ] Input validation

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Logging setup
- [ ] Metrics collection
```

## 📖 Recursos

- [12 Factor App](https://12factor.net/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

_Best Practices - Construyendo proyectos de calidad_ 🎯
