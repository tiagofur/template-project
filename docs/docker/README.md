# 🐳 Docker - Guía Completa de Containerización

Guía definitiva para dockerizar aplicaciones de forma eficiente, segura y escalable.

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Dockerfile Best Practices](#dockerfile-best-practices)
- [Multi-Stage Builds](#multi-stage-builds)
- [Docker Compose](#docker-compose)
- [Optimización de Imágenes](#optimización-de-imágenes)
- [Seguridad](#seguridad)
- [Networking](#networking)
- [Volumes y Persistencia](#volumes-y-persistencia)
- [Production Ready](#production-ready)

## 🎯 Introducción

### ¿Por qué Docker?

- ✅ **Consistencia**: Mismo ambiente en dev, staging y producción
- ✅ **Portabilidad**: "Funciona en mi máquina" → "Funciona en todas las máquinas"
- ✅ **Aislamiento**: Aplicaciones aisladas con sus dependencias
- ✅ **Eficiencia**: Comparte recursos del sistema operativo
- ✅ **Escalabilidad**: Fácil escalar horizontalmente

### Conceptos Básicos

- **Imagen**: Template inmutable para crear containers
- **Container**: Instancia ejecutable de una imagen
- **Dockerfile**: Instrucciones para construir una imagen
- **Registry**: Repositorio de imágenes (Docker Hub, ghcr.io)
- **Volume**: Persistencia de datos fuera del container
- **Network**: Comunicación entre containers

## 📝 Dockerfile Best Practices

### Estructura Básica

```dockerfile
# Usar imagen base oficial y específica
FROM node:20-alpine

# Metadata
LABEL maintainer="team@example.com"
LABEL version="1.0"

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Usuario no root
USER node

# Comando de inicio
CMD ["node", "server.js"]
```

### Dockerfile Optimizado

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy production dependencies
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/server.js"]
```

### Best Practices

#### 1. Orden de Capas (Layer Caching)

```dockerfile
# ❌ Mal - invalida cache con cada cambio de código
COPY . .
RUN npm install

# ✅ Bien - aprovecha cache de dependencias
COPY package*.json ./
RUN npm ci
COPY . .
```

#### 2. .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
coverage
*.md
.vscode
.idea
.DS_Store
```

#### 3. Combinar Comandos RUN

```dockerfile
# ❌ Mal - crea múltiples capas
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# ✅ Bien - una sola capa
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

#### 4. Usar Imágenes Específicas

```dockerfile
# ❌ Mal - tag 'latest' puede cambiar
FROM node:latest

# ✅ Bien - versión específica
FROM node:20.10.0-alpine3.19
```

## 🏗️ Multi-Stage Builds

### Node.js Application

```dockerfile
# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

### Python Application

```dockerfile
# Base stage
FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Dependencies stage
FROM base AS dependencies

COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Production stage
FROM base AS production

RUN useradd -m -u 1001 appuser

COPY --from=dependencies /root/.local /home/appuser/.local
COPY . .

RUN chown -R appuser:appuser /app

USER appuser

ENV PATH=/home/appuser/.local/bin:$PATH

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')"

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Go Application

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM alpine:3.19

RUN apk --no-cache add ca-certificates

WORKDIR /app

RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser

COPY --from=builder --chown=appuser:appuser /app/main .

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./main"]
```

## 🎼 Docker Compose

### Development Environment

```yaml
version: '3.9'

services:
  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network

  # PostgreSQL
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - app-network

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

### Production Environment

```yaml
version: '3.9'

services:
  app:
    image: myapp:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      rollback_config:
        parallelism: 1
        delay: 5s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    secrets:
      - db_password
      - api_key
    networks:
      - app-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    deploy:
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          memory: 2G
    networks:
      - app-network

secrets:
  db_password:
    external: true
  api_key:
    external: true

volumes:
  postgres-data:
    driver: local

networks:
  app-network:
    driver: overlay
    attachable: true
```

### Useful Commands

```bash
# Build and start services
docker-compose up -d

# Build without cache
docker-compose build --no-cache

# View logs
docker-compose logs -f app

# Execute command in container
docker-compose exec app sh

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Scale service
docker-compose up -d --scale app=3
```

## ⚡ Optimización de Imágenes

### 1. Usar Alpine Images

```dockerfile
# Standard image: ~900MB
FROM node:20

# Alpine image: ~180MB
FROM node:20-alpine
```

### 2. Multi-Stage Builds

```dockerfile
# Build stage: todas las herramientas
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Production: solo runtime
FROM node:20-alpine
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

### 3. Minimizar Layers

```dockerfile
# ❌ Múltiples layers (200MB + 150MB + 100MB = 450MB)
RUN npm install
RUN npm run build
RUN npm prune --production

# ✅ Una layer (200MB)
RUN npm install && \
    npm run build && \
    npm prune --production
```

### 4. .dockerignore Efectivo

```
# Build artifacts
dist/
build/
*.log

# Dependencies
node_modules/

# Tests
__tests__/
*.test.js
coverage/

# Documentation
docs/
*.md

# Git
.git/
.gitignore

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db
```

### 5. Herramientas de Análisis

```bash
# Analizar tamaño de imagen
docker images myapp

# Ver capas de imagen
docker history myapp

# Dive - analizar y optimizar
dive myapp:latest

# Tamaño de cada capa
docker history --no-trunc --format "{{.Size}}\t{{.CreatedBy}}" myapp
```

## 🔐 Seguridad

### Security Best Practices

#### 1. No Usar Root

```dockerfile
# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Cambiar ownership
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs
```

#### 2. Security Scanning

```bash
# Trivy - vulnerability scanner
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image myapp:latest

# Snyk
snyk container test myapp:latest

# Docker Scout
docker scout cves myapp:latest
```

#### 3. Secrets Management

```dockerfile
# ❌ Nunca hardcodear secrets
ENV API_KEY=supersecret123

# ✅ Usar Docker secrets o variables de entorno
ENV API_KEY=${API_KEY}
```

```bash
# Usar secrets en runtime
docker run -e API_KEY="${API_KEY}" myapp

# Docker secrets
echo "mysecret" | docker secret create api_key -
docker service create --secret api_key myapp
```

#### 4. Read-Only Filesystem

```dockerfile
# Dockerfile
VOLUME ["/tmp", "/var/cache"]

# Docker run
docker run --read-only --tmpfs /tmp myapp
```

#### 5. Drop Capabilities

```bash
# Remover todas las capabilities innecesarias
docker run --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  myapp
```

### Security Checklist

```yaml
# Docker Bench Security
docker run --rm --net host --pid host --userns host --cap-add audit_control \
  -v /etc:/etc:ro \
  -v /usr/bin/containerd:/usr/bin/containerd:ro \
  -v /usr/bin/runc:/usr/bin/runc:ro \
  -v /usr/lib/systemd:/usr/lib/systemd:ro \
  -v /var/lib:/var/lib:ro \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  docker/docker-bench-security
```

## 🌐 Networking

### Network Types

```bash
# Bridge (default)
docker network create my-bridge

# Host (usa red del host)
docker run --network host myapp

# None (sin networking)
docker run --network none myapp

# Overlay (multi-host)
docker network create -d overlay my-overlay
```

### Network Configuration

```yaml
# docker-compose.yml
version: '3.9'

services:
  frontend:
    image: frontend:latest
    networks:
      - frontend-network
  
  backend:
    image: backend:latest
    networks:
      - frontend-network
      - backend-network
  
  database:
    image: postgres:16
    networks:
      - backend-network

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true  # No acceso externo
```

### DNS Resolution

```bash
# Containers en la misma red se pueden comunicar por nombre
docker network create mynetwork

docker run -d --name db --network mynetwork postgres
docker run -d --name app --network mynetwork \
  -e DATABASE_HOST=db \  # Usa nombre del container
  myapp
```

## 💾 Volumes y Persistencia

### Volume Types

#### 1. Named Volumes

```bash
# Crear volume
docker volume create mydata

# Usar volume
docker run -v mydata:/app/data myapp

# Inspeccionar
docker volume inspect mydata

# Listar
docker volume ls

# Remover
docker volume rm mydata
```

#### 2. Bind Mounts

```bash
# Montar directorio local
docker run -v $(pwd):/app myapp

# Read-only mount
docker run -v $(pwd):/app:ro myapp
```

#### 3. tmpfs Mounts

```bash
# Memoria temporal (no persiste)
docker run --tmpfs /tmp myapp
```

### Docker Compose Volumes

```yaml
version: '3.9'

services:
  app:
    image: myapp
    volumes:
      # Named volume
      - app-data:/app/data
      
      # Bind mount
      - ./config:/app/config:ro
      
      # Anonymous volume
      - /app/node_modules

volumes:
  app-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/on/host
```

### Backup y Restore

```bash
# Backup volume
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/data-backup.tar.gz /data

# Restore volume
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/data-backup.tar.gz -C /
```

## 🚀 Production Ready

### Health Checks

```dockerfile
# Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# OR con Node.js
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

```yaml
# docker-compose.yml
services:
  app:
    image: myapp
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

### Resource Limits

```bash
# Memory limit
docker run -m 512m myapp

# CPU limit
docker run --cpus=1.5 myapp

# Combined
docker run -m 1g --cpus=2 myapp
```

```yaml
# docker-compose.yml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '1'
          memory: 512M
```

### Logging

```bash
# JSON logging driver
docker run --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  myapp

# Syslog
docker run --log-driver syslog \
  --log-opt syslog-address=tcp://192.168.0.42:514 \
  myapp

# Fluentd
docker run --log-driver fluentd \
  --log-opt fluentd-address=192.168.0.42:24224 \
  myapp
```

### Restart Policies

```bash
# No restart
docker run --restart no myapp

# On failure
docker run --restart on-failure:3 myapp

# Always
docker run --restart always myapp

# Unless stopped
docker run --restart unless-stopped myapp
```

### Labels y Metadata

```dockerfile
# Dockerfile
LABEL maintainer="team@example.com"
LABEL version="1.0"
LABEL description="Production-ready Node.js application"
LABEL org.opencontainers.image.source="https://github.com/example/repo"
```

```bash
# Filter por labels
docker ps --filter "label=version=1.0"

# Inspeccionar labels
docker inspect -f '{{json .Config.Labels}}' myapp
```

## 📊 Monitoring

### Container Stats

```bash
# Ver stats en tiempo real
docker stats

# Stats específico
docker stats myapp

# Formato custom
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### Prometheus Metrics

```yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    image: myapp
    labels:
      - "prometheus.scrape=true"
      - "prometheus.port=3000"
      - "prometheus.path=/metrics"
  
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

## 🛠️ Useful Commands

```bash
# Build
docker build -t myapp:latest .
docker build --no-cache -t myapp:latest .

# Run
docker run -d -p 3000:3000 --name myapp myapp:latest
docker run -it --rm myapp sh

# Inspect
docker inspect myapp
docker logs -f myapp
docker exec -it myapp sh

# Cleanup
docker system prune -a
docker volume prune
docker network prune

# Registry
docker tag myapp:latest registry.example.com/myapp:latest
docker push registry.example.com/myapp:latest
docker pull registry.example.com/myapp:latest

# Export/Import
docker save myapp:latest > myapp.tar
docker load < myapp.tar
```

## 📚 Referencias

- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

_Docker - Containerización moderna y eficiente_ 🐳
