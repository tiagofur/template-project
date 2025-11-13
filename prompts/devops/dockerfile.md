# Dockerfile Optimization

**Categoría:** DevOps  
**Nivel:** Intermedio  
**Tecnologías:** Docker, Multi-stage builds

## Objetivo

Crear un Dockerfile optimizado con multi-stage builds, tamaño de imagen reducido, mejor seguridad y tiempo de build más rápido.

## Contexto

Este prompt genera Dockerfiles siguiendo las mejores prácticas de Docker: multi-stage builds, layer caching, security hardening, y optimización de tamaño.

## Prompt

```
Crea un Dockerfile optimizado para una aplicación {{app_type}} usando {{runtime}}.

Requisitos:

1. Multi-stage Build:
   - Stage 1: Dependencies installation
   - Stage 2: Build/compilation
   - Stage 3: Production runtime (minimal)

2. Optimizaciones de Tamaño:
   - Usar imagen base Alpine cuando sea posible
   - Eliminar build dependencies en producción
   - Minimizar layers
   - Usar .dockerignore apropiado
   - Multi-stage para separar build de runtime

3. Seguridad:
   - No usar root user
   - Crear non-root user específico
   - Minimal base image (distroless si es posible)
   - Scan de vulnerabilidades
   - No exponer secrets en layers

4. Performance:
   - Aprovechar layer caching
   - Copiar package files antes que código
   - Parallel builds cuando sea posible
   - Health checks apropiados

5. Best Practices:
   - Versiones específicas de base images (no 'latest')
   - Labels con metadata
   - EXPOSE para documentar puertos
   - HEALTHCHECK para container orchestration
   - ENV para configuración

6. Para {{app_type}}:
   - Instalar solo dependencies de producción
   - Build optimizado
   - Assets servidos eficientemente
   - Logs a stdout/stderr

7. Incluir:
   - Dockerfile optimizado
   - .dockerignore
   - docker-compose.yml para desarrollo
   - Build script
   - Documentación

Target: Production-ready, <100MB si es posible
```

## Ejemplo de Uso

### Variables:
- `{{app_type}}`: "Node.js REST API"
- `{{runtime}}`: "Node.js 18"

## Resultados Esperados

### Dockerfile (Optimized Multi-stage)

```dockerfile
# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:18-alpine AS dependencies

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for build stage)
RUN npm ci --include=dev

# ==========================================
# Stage 2: Build
# ==========================================
FROM node:18-alpine AS build

WORKDIR /app

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# ==========================================
# Stage 3: Production
# ==========================================
FROM node:18-alpine AS production

# Labels for metadata
LABEL maintainer="your-email@example.com"
LABEL version="1.0.0"
LABEL description="Production Node.js API"

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/server.js"]
```

### .dockerignore

```
# Dependencies
node_modules
npm-debug.log
yarn-error.log
package-lock.json
yarn.lock

# Build
dist
build
.next
out

# Tests
coverage
*.test.js
*.spec.js
__tests__
test
tests

# Development
.git
.gitignore
.github
.vscode
.idea
*.md
!README.md

# Environment
.env
.env.local
.env.*.local

# Logs
logs
*.log

# OS
.DS_Store
Thumbs.db

# CI/CD
.gitlab-ci.yml
.travis.yml
azure-pipelines.yml

# Docs
docs
documentation
README.md

# Docker
Dockerfile*
docker-compose*
.dockerignore
```

### docker-compose.yml (Development)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development # Use dev stage
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://postgres:postgres@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

### Build Script (build.sh)

```bash
#!/bin/bash

set -e

# Configuration
IMAGE_NAME="myapp"
VERSION=${1:-"latest"}
REGISTRY=${REGISTRY:-"docker.io/mycompany"}

echo "Building Docker image..."

# Build multi-stage image
docker build \
  --target production \
  --tag ${IMAGE_NAME}:${VERSION} \
  --tag ${IMAGE_NAME}:latest \
  --build-arg NODE_ENV=production \
  --cache-from ${REGISTRY}/${IMAGE_NAME}:latest \
  .

echo "Image built successfully!"

# Show image size
docker images ${IMAGE_NAME}:${VERSION}

# Security scan with Trivy
echo "Running security scan..."
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest \
  image --severity HIGH,CRITICAL \
  ${IMAGE_NAME}:${VERSION}

# Optional: Push to registry
if [[ "${PUSH}" == "true" ]]; then
  echo "Tagging for registry..."
  docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:${VERSION}
  docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest
  
  echo "Pushing to registry..."
  docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}
  docker push ${REGISTRY}/${IMAGE_NAME}:latest
  
  echo "Pushed to registry successfully!"
fi

echo "Done!"
```

### Alternative: Distroless Image

```dockerfile
# Even more secure with distroless
FROM gcr.io/distroless/nodejs18-debian11 AS production

LABEL maintainer="your-email@example.com"

WORKDIR /app

# Copy from build stage
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/package.json ./package.json

# Distroless images already use non-root user 'nonroot'
USER nonroot

EXPOSE 3000

# No shell available in distroless, use exec form
CMD ["dist/server.js"]
```

## Tips Adicionales

### Para Python:
```dockerfile
FROM python:3.11-alpine AS builder
RUN pip install --no-cache-dir poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.11-alpine AS production
COPY --from=builder requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "app:app"]
```

### Para Go:
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /build
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o app

FROM scratch AS production
COPY --from=builder /build/app /app
EXPOSE 8080
CMD ["/app"]
```

### Build optimization:
```
Usa BuildKit para mejor caching:
export DOCKER_BUILDKIT=1

Parallel stage builds:
docker build --target stage1 &
docker build --target stage2 &
wait
```

## Casos de Uso

- ✅ Node.js applications
- ✅ Python applications
- ✅ Go applications
- ✅ Java applications
- ✅ Frontend builds (React, Vue, Angular)

---

_Dockerfile Optimization - Imágenes pequeñas, rápidas y seguras_ 🐳
