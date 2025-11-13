# 🔷 Microservices Architecture Template

Template completo para arquitectura de microservicios con orquestación, service mesh y observabilidad.

## 📋 Overview

Arquitectura de microservicios lista para producción con:
- **Service Mesh**: Istio para comunicación entre servicios
- **API Gateway**: Kong o NGINX Gateway
- **Service Discovery**: Consul o Kubernetes DNS
- **Event-Driven**: Kafka o RabbitMQ para mensajería
- **Database per Service**: PostgreSQL, MongoDB, Redis
- **Orchestration**: Kubernetes
- **Observability**: Prometheus, Grafana, Jaeger, ELK

## ✨ Features

### Architecture
- 🏗️ **Microservices Pattern**: Servicios independientes y escalables
- 🚪 **API Gateway**: Punto de entrada único
- 🔍 **Service Discovery**: Registro y descubrimiento automático
- 📨 **Event Bus**: Comunicación asíncrona
- 💾 **Database per Service**: Aislamiento de datos
- 🔄 **CQRS**: Command Query Responsibility Segregation
- 📊 **Event Sourcing**: Historial de eventos
- 🛡️ **Circuit Breaker**: Resiliencia ante fallos

### Services (Example)
- 👤 **User Service**: Gestión de usuarios y autenticación
- 📦 **Product Service**: Catálogo de productos
- 🛒 **Order Service**: Procesamiento de pedidos
- 💳 **Payment Service**: Procesamiento de pagos
- 📧 **Notification Service**: Emails y notificaciones
- 📊 **Analytics Service**: Métricas y analytics

### Infrastructure
- ☸️ **Kubernetes**: Orquestación de contenedores
- 🔀 **Istio**: Service mesh
- 🔌 **Kong**: API Gateway
- 📨 **Kafka**: Event streaming
- 🔍 **Consul**: Service discovery
- 📊 **Prometheus**: Métricas
- 📈 **Grafana**: Visualización
- 🔍 **Jaeger**: Distributed tracing
- 📝 **ELK Stack**: Logging centralizado

## 🏗️ Estructura del Proyecto

```
microservices/
├── services/
│   ├── user-service/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── product-service/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── order-service/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── payment-service/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── notification-service/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── analytics-service/
│       ├── src/
│       ├── tests/
│       ├── Dockerfile
│       └── package.json
│
├── infrastructure/
│   ├── kubernetes/
│   │   ├── base/
│   │   │   ├── namespace.yaml
│   │   │   ├── configmap.yaml
│   │   │   └── secrets.yaml
│   │   ├── services/
│   │   │   ├── user-service.yaml
│   │   │   ├── product-service.yaml
│   │   │   └── ...
│   │   ├── gateway/
│   │   │   └── kong-gateway.yaml
│   │   ├── istio/
│   │   │   ├── virtual-services.yaml
│   │   │   └── destination-rules.yaml
│   │   └── monitoring/
│   │       ├── prometheus.yaml
│   │       ├── grafana.yaml
│   │       └── jaeger.yaml
│   │
│   ├── terraform/
│   │   ├── aws/
│   │   ├── gcp/
│   │   └── azure/
│   │
│   ├── docker-compose/
│   │   ├── docker-compose.yml
│   │   └── docker-compose.prod.yml
│   │
│   └── kafka/
│       └── topics.yaml
│
├── config/
│   ├── kong/
│   ├── istio/
│   └── envoy/
│
├── docs/
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── service-communication.md
│   │   └── data-flow.md
│   ├── services/
│   │   └── [cada servicio]/
│   ├── deployment/
│   └── monitoring/
│
├── scripts/
│   ├── deploy.sh
│   ├── rollback.sh
│   └── scale.sh
│
└── README.md
```

## 🚀 Quick Start

### Prerrequisitos

- Docker y Docker Compose
- Kubernetes cluster (local: minikube/kind, cloud: EKS/GKE/AKS)
- kubectl configurado
- Helm 3+
- Node.js 18+ (para desarrollo local)

### Development Setup (Local)

1. **Copiar template**
   ```bash
   cp -r templates/projects/microservices/* mi-microservices/
   cd mi-microservices
   ```

2. **Iniciar infraestructura local**
   ```bash
   cd infrastructure/docker-compose
   docker-compose up -d
   ```
   
   Esto inicia:
   - PostgreSQL (user-service, product-service)
   - MongoDB (order-service)
   - Redis (cache)
   - Kafka + Zookeeper
   - Kong API Gateway
   - Prometheus + Grafana
   - Jaeger

3. **Ejecutar servicios en desarrollo**
   ```bash
   # Terminal 1 - User Service
   cd services/user-service
   npm install
   npm run dev
   
   # Terminal 2 - Product Service
   cd services/product-service
   npm install
   npm run dev
   
   # Terminal 3 - Order Service
   cd services/order-service
   npm install
   npm run dev
   ```

### Production Deployment (Kubernetes)

1. **Setup cluster**
   ```bash
   # Crear namespace
   kubectl create namespace microservices
   
   # Aplicar configuraciones base
   kubectl apply -f infrastructure/kubernetes/base/
   ```

2. **Deploy servicios**
   ```bash
   # Deploy todos los servicios
   kubectl apply -f infrastructure/kubernetes/services/
   
   # O deploy individual
   kubectl apply -f infrastructure/kubernetes/services/user-service.yaml
   ```

3. **Setup API Gateway**
   ```bash
   # Instalar Kong con Helm
   helm repo add kong https://charts.konghq.com
   helm install kong kong/kong -f infrastructure/kubernetes/gateway/values.yaml
   ```

4. **Setup Istio (opcional)**
   ```bash
   istioctl install --set profile=demo -y
   kubectl label namespace microservices istio-injection=enabled
   kubectl apply -f infrastructure/kubernetes/istio/
   ```

5. **Setup Monitoring**
   ```bash
   kubectl apply -f infrastructure/kubernetes/monitoring/
   ```

## 📖 Service Communication

### Synchronous (HTTP/gRPC)

**REST API Call**
```typescript
// user-service calling product-service
import axios from 'axios';

export class ProductClient {
  private baseUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3000';
  
  async getProduct(productId: string) {
    const response = await axios.get(`${this.baseUrl}/products/${productId}`);
    return response.data;
  }
}
```

**gRPC Call** (mejor performance)
```typescript
// product.proto
syntax = "proto3";

service ProductService {
  rpc GetProduct(GetProductRequest) returns (Product);
  rpc ListProducts(ListProductsRequest) returns (ProductList);
}

// Client
import * as grpc from '@grpc/grpc-js';
import { ProductServiceClient } from './generated/product_grpc_pb';

const client = new ProductServiceClient(
  'product-service:50051',
  grpc.credentials.createInsecure()
);
```

### Asynchronous (Event-Driven with Kafka)

**Producer**
```typescript
// order-service publishing event
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});

const producer = kafka.producer();

export const publishOrderCreated = async (order: Order) => {
  await producer.send({
    topic: 'orders.created',
    messages: [{
      key: order.id,
      value: JSON.stringify({
        orderId: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total,
        timestamp: new Date().toISOString()
      })
    }]
  });
};
```

**Consumer**
```typescript
// notification-service consuming event
const consumer = kafka.consumer({ groupId: 'notification-service' });

await consumer.subscribe({ topic: 'orders.created' });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const order = JSON.parse(message.value.toString());
    await sendOrderConfirmationEmail(order);
  }
});
```

## 🔐 API Gateway (Kong)

**Kong Configuration**
```yaml
# infrastructure/kubernetes/gateway/kong-config.yaml
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: rate-limiting
config:
  minute: 100
  policy: local
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway
  annotations:
    konghq.com/plugins: rate-limiting
spec:
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 3000
      - path: /products
        pathType: Prefix
        backend:
          service:
            name: product-service
            port:
              number: 3000
      - path: /orders
        pathType: Prefix
        backend:
          service:
            name: order-service
            port:
              number: 3000
```

## 📊 Observability

### Distributed Tracing (Jaeger)

```typescript
// tracer.ts
import { initTracer } from 'jaeger-client';

export const tracer = initTracer({
  serviceName: 'user-service',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    logSpans: true,
    agentHost: process.env.JAEGER_AGENT_HOST || 'jaeger',
    agentPort: 6831,
  },
}, {
  logger: console,
});

// Usage in service
import { tracer } from './tracer';

export const getUser = async (userId: string) => {
  const span = tracer.startSpan('getUser');
  span.setTag('userId', userId);
  
  try {
    const user = await userRepository.findById(userId);
    span.setTag('found', !!user);
    return user;
  } finally {
    span.finish();
  }
};
```

### Metrics (Prometheus)

```typescript
// metrics.ts
import { register, Counter, Histogram } from 'prom-client';

export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestCounter.inc({ method: req.method, route: req.route?.path, status: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route: req.route?.path, status: res.statusCode }, duration);
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});
```

## 🎯 Best Practices

### Service Design
- ✅ Single Responsibility por servicio
- ✅ Database per service
- ✅ API versionada
- ✅ Idempotencia en operaciones
- ✅ Circuit breaker pattern
- ✅ Retry con backoff exponencial
- ✅ Timeouts configurables

### Data Management
- ✅ Event sourcing para auditoría
- ✅ Saga pattern para transacciones distribuidas
- ✅ CQRS para separar lectura/escritura
- ✅ Eventual consistency
- ✅ Caché distribuido (Redis)

### Security
- ✅ JWT para autenticación
- ✅ mTLS entre servicios (Istio)
- ✅ API Gateway con rate limiting
- ✅ Secrets en Kubernetes Secrets/Vault
- ✅ Network policies

### Deployment
- ✅ Blue-Green deployments
- ✅ Canary releases
- ✅ Rolling updates
- ✅ Health checks
- ✅ Graceful shutdown

## 🧪 Testing

```bash
# Unit tests por servicio
cd services/user-service
npm test

# Integration tests
npm run test:integration

# E2E tests
cd ../../
npm run test:e2e

# Load testing
k6 run scripts/load-test.js
```

## 🚀 Deployment

```bash
# Deploy a Kubernetes
./scripts/deploy.sh production

# Rollback
./scripts/rollback.sh user-service

# Scale service
kubectl scale deployment user-service --replicas=5
```

## 📚 Recursos

- [Architecture Overview](./docs/architecture/overview.md)
- [Service Communication](./docs/architecture/service-communication.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Monitoring Guide](./docs/monitoring/README.md)

---

_Arquitectura de microservicios escalable y resiliente_ 🔷
