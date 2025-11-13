# 🔌 Integration Architecture Patterns

Complete guide to integration patterns for connecting systems, services, and external APIs.

## Overview

Integration patterns define how different systems, services, and components communicate and work together in a distributed architecture.

---

## 1. API Gateway Pattern

### Description

API Gateway is a single entry point for all clients that sits between clients and backend services. It handles request routing, composition, protocol translation, and cross-cutting concerns like authentication, rate limiting, and logging.

### Structure

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│  Web    │  │ Mobile  │  │  Third  │
│  Client │  │   App   │  │  Party  │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                  │
          ┌───────▼────────┐
          │  API Gateway   │  ← Single entry point
          │                │  ← Auth, Rate limiting
          │                │  ← Request routing
          └───────┬────────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
┌─────▼────┐ ┌───▼────┐ ┌────▼─────┐
│  User    │ │ Order  │ │ Payment  │
│ Service  │ │Service │ │ Service  │
└──────────┘ └────────┘ └──────────┘
```

### When to Use

✅ **Use When:**
- Microservices architecture
- Multiple client types (web, mobile, IoT)
- Need centralized authentication/authorization
- Want to hide internal service complexity
- Need to aggregate multiple service calls
- Rate limiting and throttling required

❌ **Avoid When:**
- Simple monolithic application
- Single client type
- Internal-only services
- Very low latency requirements

### Implementation Example (Node.js + Express)

```typescript
// 1. API Gateway Server
// src/gateway/server.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rate-limit';
import { loggingMiddleware } from './middleware/logging';
import { requestAggregator } from './aggregators/request-aggregator';

const app = express();

// Global middleware
app.use(express.json());
app.use(loggingMiddleware);
app.use(rateLimitMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Authentication endpoint (handled by gateway)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected routes - require authentication
app.use('/api/users', authMiddleware);
app.use('/api/orders', authMiddleware);
app.use('/api/payments', authMiddleware);

// Route to User Service
app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://user-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/users' },
  onProxyReq: (proxyReq, req) => {
    // Forward user information
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.id);
      proxyReq.setHeader('X-User-Role', req.user.role);
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(503).json({ error: 'Service unavailable' });
  },
}));

// Route to Order Service
app.use('/api/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL || 'http://order-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '/orders' },
}));

// Route to Payment Service
app.use('/api/payments', createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '/payments' },
}));

// Aggregated endpoint - combines data from multiple services
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await requestAggregator.getDashboard(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Gateway error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

// 2. Authentication Middleware
// src/gateway/middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 3. Rate Limiting Middleware
// src/gateway/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

export const rateLimitMiddleware = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Per-user rate limiting
export const userRateLimitMiddleware = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:user:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 1000, // Authenticated users get higher limit
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Rate limit exceeded',
});

// 4. Logging Middleware
// src/gateway/middleware/logging.ts
import { v4 as uuidv4 } from 'uuid';

export const loggingMiddleware = (req, res, next) => {
  const requestId = uuidv4();
  const start = Date.now();

  // Attach request ID
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  // Log request
  console.log({
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      requestId,
      statusCode: res.statusCode,
      duration,
    });
  });

  next();
};

// 5. Request Aggregator
// src/gateway/aggregators/request-aggregator.ts
import axios from 'axios';

export class RequestAggregator {
  async getDashboard(userId: string) {
    // Make parallel requests to multiple services
    const [userProfile, recentOrders, accountBalance] = await Promise.all([
      this.getUserProfile(userId),
      this.getRecentOrders(userId),
      this.getAccountBalance(userId),
    ]);

    // Combine and return aggregated data
    return {
      profile: userProfile,
      orders: recentOrders,
      balance: accountBalance,
      summary: {
        totalOrders: recentOrders.length,
        totalSpent: recentOrders.reduce((sum, order) => sum + order.total, 0),
      },
    };
  }

  private async getUserProfile(userId: string) {
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/users/${userId}`
    );
    return response.data;
  }

  private async getRecentOrders(userId: string) {
    const response = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/orders?userId=${userId}&limit=10`
    );
    return response.data;
  }

  private async getAccountBalance(userId: string) {
    const response = await axios.get(
      `${process.env.PAYMENT_SERVICE_URL}/accounts/${userId}/balance`
    );
    return response.data;
  }
}

export const requestAggregator = new RequestAggregator();

// 6. Circuit Breaker Pattern
// src/gateway/circuit-breaker/circuit-breaker.ts
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime?: number;
  private successCount = 0;

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private halfOpenAttempts: number = 3
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - (this.lastFailureTime || 0) > this.timeout) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.halfOpenAttempts) {
        this.state = CircuitState.CLOSED;
      }
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = CircuitState.OPEN;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Usage in proxy
const userServiceCircuitBreaker = new CircuitBreaker();

app.use('/api/users', async (req, res, next) => {
  try {
    await userServiceCircuitBreaker.execute(async () => {
      // Proxy request
      return proxyMiddleware(req, res, next);
    });
  } catch (error) {
    res.status(503).json({ error: 'Service temporarily unavailable' });
  }
});
```

### API Gateway with Kong

```yaml
# docker-compose.yml
version: '3.8'

services:
  kong:
    image: kong:latest
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
      KONG_PG_PASSWORD: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
    ports:
      - "8000:8000"  # Proxy
      - "8001:8001"  # Admin API
    depends_on:
      - kong-database

  kong-database:
    image: postgres:13
    environment:
      POSTGRES_DB: kong
      POSTGRES_USER: kong
      POSTGRES_PASSWORD: kong
    volumes:
      - kong-data:/var/lib/postgresql/data

volumes:
  kong-data:
```

```bash
# Configure Kong routes and services
# Add User Service
curl -i -X POST http://localhost:8001/services/ \
  --data name=user-service \
  --data url=http://user-service:3001

# Add route for User Service
curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data 'paths[]=/api/users' \
  --data name=user-route

# Add authentication plugin
curl -i -X POST http://localhost:8001/routes/user-route/plugins \
  --data name=jwt

# Add rate limiting
curl -i -X POST http://localhost:8001/routes/user-route/plugins \
  --data name=rate-limiting \
  --data config.minute=100 \
  --data config.hour=10000
```

### Pros and Cons

**Pros:**
- ✅ Single entry point for all clients
- ✅ Centralized authentication and authorization
- ✅ Request/response transformation
- ✅ Protocol translation (REST to gRPC)
- ✅ Rate limiting and throttling
- ✅ Request aggregation
- ✅ Service discovery abstraction

**Cons:**
- ❌ Single point of failure
- ❌ Potential performance bottleneck
- ❌ Additional network hop
- ❌ Complexity in configuration
- ❌ Need to maintain gateway code

---

## 2. Service Mesh

### Description

Service Mesh is an infrastructure layer that handles service-to-service communication, providing observability, security, and reliability features without changing application code.

### Structure

```
┌──────────────────────────────────────┐
│         Control Plane                │
│   (Configuration, Policies)          │
└────────────┬─────────────────────────┘
             │
    ┌────────┴────────┬────────────┐
    │                 │            │
┌───▼───┐         ┌───▼───┐    ┌──▼────┐
│Service│◄───────►│Service│◄──►│Service│
│   A   │         │   B   │    │   C   │
│       │         │       │    │       │
│┌─────┐│         │┌─────┐│    │┌─────┐│
││Proxy││         ││Proxy││    ││Proxy││ ← Sidecar
│└─────┘│         │└─────┘│    │└─────┘│
└───────┘         └───────┘    └───────┘
```

### When to Use

✅ **Use When:**
- Kubernetes-based microservices
- Need service-to-service encryption
- Want distributed tracing
- Need advanced traffic management
- Circuit breaking and retries required
- Multiple programming languages

❌ **Avoid When:**
- Monolithic application
- Simple architecture
- Small team without DevOps expertise
- Performance overhead is unacceptable

### Implementation Example (Istio)

```yaml
# 1. Install Istio
# kubectl apply -f https://istio.io/latest/istio-operator.yaml

# 2. Service deployment with Istio sidecar injection
# k8s/user-service-deployment.yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - port: 80
      targetPort: 3001
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        version: v1
      annotations:
        sidecar.istio.io/inject: "true"  # Enable Istio sidecar
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: PORT
          value: "3001"

# 3. Virtual Service - Traffic routing
# k8s/user-service-virtualservice.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: user-service
spec:
  hosts:
  - user-service
  http:
  - match:
    - headers:
        user-agent:
          regex: ".*Mobile.*"
    route:
    - destination:
        host: user-service
        subset: v2  # Route mobile users to v2
      weight: 100
  - route:
    - destination:
        host: user-service
        subset: v1
      weight: 90
    - destination:
        host: user-service
        subset: v2
      weight: 10  # Canary deployment: 10% to v2

# 4. Destination Rule - Load balancing, circuit breaking
# k8s/user-service-destinationrule.yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: user-service
spec:
  host: user-service
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        maxRequestsPerConnection: 2
    outlierDetection:  # Circuit breaking
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2

# 5. Service Entry - External services
# k8s/external-api-serviceentry.yaml
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: external-payment-api
spec:
  hosts:
  - api.stripe.com
  ports:
  - number: 443
    name: https
    protocol: HTTPS
  location: MESH_EXTERNAL
  resolution: DNS

# 6. Gateway - Ingress
# k8s/gateway.yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: api-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "api.example.com"
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: api-cert
    hosts:
    - "api.example.com"

# 7. Mutual TLS
# k8s/peer-authentication.yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: default
spec:
  mtls:
    mode: STRICT  # Enforce mTLS

# 8. Authorization Policy
# k8s/authorization-policy.yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: user-service-authz
  namespace: default
spec:
  selector:
    matchLabels:
      app: user-service
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/default/sa/order-service"]
    to:
    - operation:
        methods: ["GET"]
        paths: ["/users/*"]
```

### Monitoring with Istio

```bash
# Install Kiali (Service mesh dashboard)
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/kiali.yaml

# Install Prometheus
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/prometheus.yaml

# Install Grafana
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/grafana.yaml

# Install Jaeger (Distributed tracing)
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/jaeger.yaml

# Access Kiali dashboard
istioctl dashboard kiali
```

### Pros and Cons

**Pros:**
- ✅ Zero code changes for observability
- ✅ Automatic service-to-service encryption
- ✅ Advanced traffic management
- ✅ Distributed tracing out of the box
- ✅ Circuit breaking and retries
- ✅ Works with any language

**Cons:**
- ❌ Operational complexity
- ❌ Performance overhead (sidecar proxy)
- ❌ Steep learning curve
- ❌ Requires Kubernetes
- ❌ Debugging can be difficult

---

## 3. Event-Driven Architecture

### Description

Event-Driven Architecture uses events to trigger and communicate between decoupled services. Producers emit events, consumers react to events, enabling asynchronous and loosely coupled systems.

### Structure

```
┌──────────┐          ┌──────────────┐          ┌──────────┐
│ Producer │─────────►│ Message Bus  │─────────►│ Consumer │
│ Service  │  Publish │(RabbitMQ,    │Subscribe │ Service  │
└──────────┘  Event   │ Kafka, etc.) │  Event   └──────────┘
                      └──────────────┘
```

### When to Use

✅ **Use When:**
- Need asynchronous communication
- Services should be loosely coupled
- Event sourcing is beneficial
- Real-time updates required
- Scalable, distributed systems
- Multiple services react to same event

❌ **Avoid When:**
- Synchronous responses required
- Simple request-response patterns
- Debugging complexity unacceptable
- Team lacks experience with async patterns

### Implementation Example (RabbitMQ + Node.js)

```typescript
// 1. Event Bus using RabbitMQ
// src/infrastructure/events/event-bus.ts
import amqp, { Connection, Channel } from 'amqplib';

export class EventBus {
  private connection?: Connection;
  private channel?: Channel;
  private readonly exchange = 'app_events';

  async connect(): Promise<void> {
    this.connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost'
    );
    this.channel = await this.connection.createChannel();
    
    // Create exchange
    await this.channel.assertExchange(this.exchange, 'topic', {
      durable: true,
    });
  }

  async publish(eventType: string, data: any): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    const event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
      id: generateId(),
    };

    this.channel.publish(
      this.exchange,
      eventType,
      Buffer.from(JSON.stringify(event)),
      { persistent: true }
    );

    console.log(`Published event: ${eventType}`, event);
  }

  async subscribe(
    eventType: string,
    handler: (data: any) => Promise<void>
  ): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    const queue = `${eventType}_queue`;
    
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, this.exchange, eventType);
    
    this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());
        await handler(event.data);
        this.channel!.ack(msg);
      } catch (error) {
        console.error(`Error handling event ${eventType}:`, error);
        // Reject and requeue
        this.channel!.nack(msg, false, true);
      }
    });

    console.log(`Subscribed to event: ${eventType}`);
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}

// 2. Domain Events
// src/domain/events/order-events.ts
export interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}

export interface OrderPaidEvent {
  orderId: string;
  paymentId: string;
  amount: number;
  paidAt: Date;
}

export interface OrderShippedEvent {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  shippedAt: Date;
}

export interface OrderCancelledEvent {
  orderId: string;
  reason: string;
  cancelledAt: Date;
}

// 3. Order Service - Event Producer
// src/services/order-service.ts
import { EventBus } from '../infrastructure/events/event-bus';
import { OrderCreatedEvent, OrderCancelledEvent } from '../domain/events/order-events';

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private eventBus: EventBus
  ) {}

  async createOrder(customerId: string, items: OrderItem[]): Promise<Order> {
    // Create order
    const order = await this.orderRepository.create({
      customerId,
      items,
      status: 'pending',
      total: calculateTotal(items),
    });

    // Publish event
    const event: OrderCreatedEvent = {
      orderId: order.id,
      customerId: order.customerId,
      items: order.items,
      total: order.total,
      createdAt: new Date(),
    };

    await this.eventBus.publish('order.created', event);

    return order;
  }

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    // Update order
    await this.orderRepository.update(orderId, {
      status: 'cancelled',
      cancelledAt: new Date(),
    });

    // Publish event
    const event: OrderCancelledEvent = {
      orderId,
      reason,
      cancelledAt: new Date(),
    };

    await this.eventBus.publish('order.cancelled', event);
  }
}

// 4. Inventory Service - Event Consumer
// src/services/inventory-service.ts
import { EventBus } from '../infrastructure/events/event-bus';
import { OrderCreatedEvent, OrderCancelledEvent } from '../domain/events/order-events';

export class InventoryService {
  constructor(
    private inventoryRepository: InventoryRepository,
    private eventBus: EventBus
  ) {
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    // React to order created event
    this.eventBus.subscribe('order.created', async (data: OrderCreatedEvent) => {
      await this.reserveInventory(data);
    });

    // React to order cancelled event
    this.eventBus.subscribe('order.cancelled', async (data: OrderCancelledEvent) => {
      await this.releaseInventory(data.orderId);
    });
  }

  private async reserveInventory(event: OrderCreatedEvent): Promise<void> {
    console.log(`Reserving inventory for order ${event.orderId}`);

    for (const item of event.items) {
      const inventory = await this.inventoryRepository.findByProduct(item.productId);
      
      if (!inventory || inventory.available < item.quantity) {
        // Publish inventory shortage event
        await this.eventBus.publish('inventory.shortage', {
          orderId: event.orderId,
          productId: item.productId,
          requested: item.quantity,
          available: inventory?.available || 0,
        });
        continue;
      }

      await this.inventoryRepository.reserve(item.productId, item.quantity);
    }
  }

  private async releaseInventory(orderId: string): Promise<void> {
    console.log(`Releasing inventory for order ${orderId}`);
    await this.inventoryRepository.releaseByOrder(orderId);
  }
}

// 5. Notification Service - Event Consumer
// src/services/notification-service.ts
import { EventBus } from '../infrastructure/events/event-bus';
import { OrderCreatedEvent, OrderShippedEvent } from '../domain/events/order-events';

export class NotificationService {
  constructor(
    private emailService: EmailService,
    private eventBus: EventBus
  ) {
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.eventBus.subscribe('order.created', async (data: OrderCreatedEvent) => {
      await this.sendOrderConfirmation(data);
    });

    this.eventBus.subscribe('order.shipped', async (data: OrderShippedEvent) => {
      await this.sendShipmentNotification(data);
    });
  }

  private async sendOrderConfirmation(event: OrderCreatedEvent): Promise<void> {
    const customer = await this.getCustomer(event.customerId);
    
    await this.emailService.send({
      to: customer.email,
      subject: 'Order Confirmation',
      template: 'order-confirmation',
      data: {
        orderId: event.orderId,
        items: event.items,
        total: event.total,
      },
    });
  }

  private async sendShipmentNotification(event: OrderShippedEvent): Promise<void> {
    const order = await this.getOrder(event.orderId);
    const customer = await this.getCustomer(order.customerId);

    await this.emailService.send({
      to: customer.email,
      subject: 'Your Order Has Shipped',
      template: 'shipment-notification',
      data: {
        orderId: event.orderId,
        trackingNumber: event.trackingNumber,
        carrier: event.carrier,
      },
    });
  }
}

// 6. Setup and initialization
// src/index.ts
import { EventBus } from './infrastructure/events/event-bus';
import { OrderService } from './services/order-service';
import { InventoryService } from './services/inventory-service';
import { NotificationService } from './services/notification-service';

async function bootstrap() {
  // Initialize event bus
  const eventBus = new EventBus();
  await eventBus.connect();

  // Initialize services
  const orderService = new OrderService(orderRepository, eventBus);
  const inventoryService = new InventoryService(inventoryRepository, eventBus);
  const notificationService = new NotificationService(emailService, eventBus);

  // Start server
  startServer(orderService);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await eventBus.close();
    process.exit(0);
  });
}

bootstrap();
```

### Kafka Implementation

```typescript
// Event Bus using Kafka
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

export class KafkaEventBus {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'my-group' });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async publish(topic: string, data: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key: data.id || generateId(),
          value: JSON.stringify(data),
          timestamp: Date.now().toString(),
        },
      ],
    });
  }

  async subscribe(
    topic: string,
    handler: (data: any) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const data = JSON.parse(message.value!.toString());
        await handler(data);
      },
    });
  }

  async close(): Promise<void> {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}
```

### Pros and Cons

**Pros:**
- ✅ Loose coupling between services
- ✅ Asynchronous communication
- ✅ Scalable (independent scaling)
- ✅ Resilient (retries, dead letter queues)
- ✅ Multiple consumers for same event
- ✅ Event sourcing enables audit trail

**Cons:**
- ❌ Eventual consistency challenges
- ❌ Debugging complexity
- ❌ Message ordering issues
- ❌ Requires message broker infrastructure
- ❌ Learning curve

---

## Comparison Matrix

| Pattern | Complexity | Use Case | Coupling | Performance |
|---------|-----------|----------|----------|-------------|
| **API Gateway** | Medium | Microservices entry | Medium | Good |
| **Service Mesh** | High | K8s microservices | Low | Medium (overhead) |
| **Event-Driven** | Medium-High | Async workflows | Very Low | Excellent |

## Combining Patterns

These patterns often work together:

```
API Gateway (External clients)
    ↓
Service Mesh (Internal communication)
    ↓
Event-Driven (Async workflows)
```

## Related Documentation

- [Backend Architecture Patterns](./backend-patterns.md)
- [Database Patterns](./database-patterns.md)
- [Microservices Guide](./backend-patterns.md#4-microservices-architecture)
- [API Design Guide](../api/README.md)
- [DevOps Guide](../stack-guides/devops.md)

---

**Last Updated**: 2025-11-13
