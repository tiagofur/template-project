# 📊 Monitoring & Secrets Management

Guía completa para implementar observabilidad y gestión segura de secretos en aplicaciones modernas.

## 📋 Tabla de Contenidos

- [Monitoring](#monitoring)
  - [Métricas con Prometheus](#métricas-con-prometheus)
  - [Visualización con Grafana](#visualización-con-grafana)
  - [Logging con ELK Stack](#logging-con-elk-stack)
  - [APM y Tracing](#apm-y-tracing)
  - [Alerting](#alerting)
- [Secrets Management](#secrets-management)
  - [HashiCorp Vault](#hashicorp-vault)
  - [AWS Secrets Manager](#aws-secrets-manager)
  - [Azure Key Vault](#azure-key-vault)
  - [Best Practices](#best-practices)

---

## 📊 Monitoring

### ¿Por qué Monitoring?

- ✅ **Visibilidad**: Conocer el estado de la aplicación en tiempo real
- ✅ **Detección Proactiva**: Identificar problemas antes de que afecten usuarios
- ✅ **Optimización**: Identificar bottlenecks y oportunidades de mejora
- ✅ **SLA/SLO**: Medir y garantizar niveles de servicio
- ✅ **Debugging**: Facilitar troubleshooting y root cause analysis

### Los 3 Pilares de Observabilidad

1. **Metrics**: Datos numéricos agregados en el tiempo
2. **Logs**: Eventos discretos con contexto
3. **Traces**: Flujo de ejecución a través de servicios distribuidos

---

## 🔥 Métricas con Prometheus

### Setup Básico

```yaml
# docker-compose.yml
version: '3.9'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
    networks:
      - monitoring

volumes:
  prometheus-data:

networks:
  monitoring:
    driver: bridge
```

### Configuración de Prometheus

```yaml
# prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'production'
    environment: 'prod'

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# Load rules
rule_files:
  - "/etc/prometheus/rules/*.yml"

# Scrape configurations
scrape_configs:
  # Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Application metrics
  - job_name: 'myapp'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
    
  # Node Exporter (system metrics)
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
  
  # PostgreSQL metrics
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
  
  # Redis metrics
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
  
  # Kubernetes service discovery
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
```

### Instrumentación de Aplicación (Node.js)

```typescript
// metrics.ts
import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';
import express from 'express';

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics({ prefix: 'myapp_' });

// Custom metrics
export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

// Business metrics
export const ordersCreated = new Counter({
  name: 'orders_created_total',
  help: 'Total number of orders created',
  labelNames: ['status'],
});

export const revenue = new Counter({
  name: 'revenue_total_cents',
  help: 'Total revenue in cents',
  labelNames: ['currency'],
});

// Metrics middleware
export function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  activeConnections.inc();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestCounter.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });
    
    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode,
      },
      duration
    );
    
    activeConnections.dec();
  });
  
  next();
}

// Metrics endpoint
export function setupMetricsEndpoint(app: express.Application) {
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
}
```

```typescript
// server.ts
import express from 'express';
import { metricsMiddleware, setupMetricsEndpoint, dbQueryDuration, ordersCreated } from './metrics';

const app = express();

// Apply metrics middleware
app.use(metricsMiddleware);

// Setup metrics endpoint
setupMetricsEndpoint(app);

// Example: Track database queries
async function queryDatabase(table: string, operation: string) {
  const end = dbQueryDuration.startTimer({ operation, table });
  
  try {
    // Execute query
    const result = await db.query(/* ... */);
    return result;
  } finally {
    end();
  }
}

// Example: Track business metrics
app.post('/orders', async (req, res) => {
  try {
    const order = await createOrder(req.body);
    
    ordersCreated.inc({ status: 'success' });
    revenue.inc({ currency: 'USD' }, order.amount * 100); // cents
    
    res.json(order);
  } catch (error) {
    ordersCreated.inc({ status: 'failure' });
    res.status(500).json({ error: 'Failed to create order' });
  }
});
```

### Alert Rules

```yaml
# prometheus/rules/alerts.yml
groups:
  - name: application
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.instance }}"

      # High response time
      - alert: HighResponseTime
        expr: |
          histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is {{ $value }}s"

      # Service down
      - alert: ServiceDown
        expr: up{job="myapp"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ $labels.instance }} has been down for more than 2 minutes"

  - name: infrastructure
    interval: 30s
    rules:
      # High CPU
      - alert: HighCPUUsage
        expr: |
          100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value | humanize }}% on {{ $labels.instance }}"

      # High Memory
      - alert: HighMemoryUsage
        expr: |
          (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanize }}%"

      # Disk space low
      - alert: DiskSpaceLow
        expr: |
          (node_filesystem_avail_bytes{fstype!~"tmpfs|fuse.lxcfs"} / node_filesystem_size_bytes) * 100 < 15
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Low disk space"
          description: "Only {{ $value | humanize }}% available"
```

---

## 📈 Visualización con Grafana

### Setup Grafana

```yaml
# docker-compose.yml
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_ROOT_URL=https://grafana.example.com
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    depends_on:
      - prometheus
    networks:
      - monitoring

volumes:
  grafana-data:
```

### Datasource Configuration

```yaml
# grafana/provisioning/datasources/prometheus.yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
```

### Dashboard Configuration

```yaml
# grafana/provisioning/dashboards/dashboard.yml
apiVersion: 1

providers:
  - name: 'Default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
```

### Dashboard JSON (Application Metrics)

```json
{
  "dashboard": {
    "title": "Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time (95th percentile)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{route}}"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "{{route}}"
          }
        ]
      }
    ]
  }
}
```

---

## 📝 Logging con ELK Stack

### ELK Stack Setup

```yaml
# docker-compose.yml
version: '3.9'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    ports:
      - "5044:5044"
      - "9600:9600"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
    depends_on:
      - elasticsearch
    networks:
      - elk

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - elk

volumes:
  elasticsearch-data:

networks:
  elk:
    driver: bridge
```

### Logstash Pipeline

```ruby
# logstash/pipeline/logstash.conf
input {
  tcp {
    port => 5044
    codec => json
  }
}

filter {
  # Parse timestamp
  date {
    match => [ "timestamp", "ISO8601" ]
    target => "@timestamp"
  }

  # Parse log level
  mutate {
    uppercase => [ "level" ]
  }

  # GeoIP for IP addresses
  if [ip] {
    geoip {
      source => "ip"
      target => "geoip"
    }
  }

  # User agent parsing
  if [userAgent] {
    useragent {
      source => "userAgent"
      target => "ua"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "myapp-logs-%{+YYYY.MM.dd}"
  }

  # Debug output
  stdout {
    codec => rubydebug
  }
}
```

### Structured Logging (Node.js)

```typescript
// logger.ts
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
  },
  index: 'myapp-logs',
};

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'myapp',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
    hostname: process.env.HOSTNAME,
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // Elasticsearch transport
    new ElasticsearchTransport(esTransportOpts),
  ],
});

// Request logger middleware
export function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      requestId: req.id,
      userId: req.user?.id,
    });
  });
  
  next();
}

// Usage examples
logger.info('User logged in', { userId: '123', email: 'user@example.com' });
logger.warn('Rate limit exceeded', { ip: '192.168.1.1', endpoint: '/api/users' });
logger.error('Database connection failed', { error: err.message, stack: err.stack });
```

---

## 🔍 APM y Tracing

### Distributed Tracing con Jaeger

```yaml
# docker-compose.yml
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
    networks:
      - monitoring
```

### OpenTelemetry Instrumentation

```typescript
// tracing.ts
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'myapp',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION,
  }),
});

const exporter = new JaegerExporter({
  endpoint: 'http://jaeger:14268/api/traces',
});

provider.addSpanProcessor(
  new BatchSpanProcessor(exporter)
);

provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

export const tracer = trace.getTracer('myapp');
```

---

## 🚨 Alerting

### Alertmanager Configuration

```yaml
# alertmanager/config.yml
global:
  resolve_timeout: 5m
  slack_api_url: '${SLACK_WEBHOOK_URL}'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
      continue: true
    
    - match:
        severity: warning
      receiver: 'slack'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'slack'
    slack_configs:
      - channel: '#monitoring'
        title: 'Warning: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: '${PAGERDUTY_SERVICE_KEY}'
```

---

## 🔐 Secrets Management

### ¿Por qué Secrets Management?

- ✅ **Seguridad**: Evitar secrets en código fuente
- ✅ **Rotación**: Cambiar secrets periódicamente
- ✅ **Auditoría**: Rastrear quién accede a qué
- ✅ **Control de Acceso**: Permisos granulares
- ✅ **Cifrado**: Secrets siempre encriptados

### Principios

1. **Never hardcode secrets**: Nunca en código fuente
2. **Encrypt at rest**: Siempre cifrados en almacenamiento
3. **Encrypt in transit**: Siempre cifrados en tránsito
4. **Least privilege**: Acceso mínimo necesario
5. **Rotate regularly**: Rotación automática
6. **Audit access**: Logging de todos los accesos

---

## 🔑 HashiCorp Vault

### Setup Vault

```yaml
# docker-compose.yml
services:
  vault:
    image: vault:latest
    ports:
      - "8200:8200"
    environment:
      - VAULT_DEV_ROOT_TOKEN_ID=myroot
      - VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200
    cap_add:
      - IPC_LOCK
    volumes:
      - vault-data:/vault/file
    networks:
      - vault-network

volumes:
  vault-data:
```

### Vault Configuration (Production)

```hcl
# vault-config.hcl
storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 0
  tls_cert_file = "/vault/tls/cert.pem"
  tls_key_file  = "/vault/tls/key.pem"
}

api_addr = "https://vault.example.com:8200"
cluster_addr = "https://vault.example.com:8201"
ui = true

telemetry {
  prometheus_retention_time = "30s"
  disable_hostname = true
}
```

### Using Vault (CLI)

```bash
# Initialize Vault
vault operator init

# Unseal Vault (requires threshold of keys)
vault operator unseal <key1>
vault operator unseal <key2>
vault operator unseal <key3>

# Login
vault login <root-token>

# Enable secrets engine
vault secrets enable -path=secret kv-v2

# Write secret
vault kv put secret/myapp/database \
  username=dbuser \
  password=supersecret

# Read secret
vault kv get secret/myapp/database

# List secrets
vault kv list secret/myapp

# Delete secret
vault kv delete secret/myapp/database
```

### Using Vault (Application)

```typescript
// vault.ts
import * as vault from 'node-vault';

const vaultClient = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR || 'http://vault:8200',
  token: process.env.VAULT_TOKEN,
});

export async function getSecret(path: string): Promise<any> {
  try {
    const result = await vaultClient.read(path);
    return result.data.data;
  } catch (error) {
    console.error('Failed to read secret:', error);
    throw error;
  }
}

export async function setSecret(path: string, data: any): Promise<void> {
  try {
    await vaultClient.write(path, { data });
  } catch (error) {
    console.error('Failed to write secret:', error);
    throw error;
  }
}

// Usage
const dbConfig = await getSecret('secret/data/myapp/database');
console.log(dbConfig.username);
console.log(dbConfig.password);
```

---

## ☁️ AWS Secrets Manager

### Create Secret

```bash
# Create secret
aws secretsmanager create-secret \
  --name myapp/production/database \
  --description "Database credentials" \
  --secret-string '{
    "username": "admin",
    "password": "supersecret",
    "host": "db.example.com",
    "port": 5432,
    "database": "myapp"
  }'

# Get secret
aws secretsmanager get-secret-value \
  --secret-id myapp/production/database \
  --query SecretString \
  --output text

# Rotate secret
aws secretsmanager rotate-secret \
  --secret-id myapp/production/database \
  --rotation-lambda-arn arn:aws:lambda:region:account:function:rotateSecret
```

### Using Secrets Manager (Node.js)

```typescript
// secrets.ts
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManager({
  region: process.env.AWS_REGION || 'us-east-1',
});

export async function getSecret(secretName: string): Promise<any> {
  try {
    const response = await client.getSecretValue({
      SecretId: secretName,
    });
    
    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    }
    
    throw new Error('Secret not found');
  } catch (error) {
    console.error('Failed to retrieve secret:', error);
    throw error;
  }
}

// Usage
const dbConfig = await getSecret('myapp/production/database');
const db = new Database({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
});
```

---

## 🔵 Azure Key Vault

### Setup Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name myapp-keyvault \
  --resource-group myapp-rg \
  --location eastus

# Set secret
az keyvault secret set \
  --vault-name myapp-keyvault \
  --name database-password \
  --value "supersecret"

# Get secret
az keyvault secret show \
  --vault-name myapp-keyvault \
  --name database-password \
  --query value \
  --output tsv
```

### Using Key Vault (Node.js)

```typescript
// keyvault.ts
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const vaultUrl = `https://${process.env.KEY_VAULT_NAME}.vault.azure.net`;
const client = new SecretClient(vaultUrl, credential);

export async function getSecret(secretName: string): Promise<string> {
  try {
    const secret = await client.getSecret(secretName);
    return secret.value || '';
  } catch (error) {
    console.error('Failed to retrieve secret:', error);
    throw error;
  }
}

export async function setSecret(secretName: string, value: string): Promise<void> {
  try {
    await client.setSecret(secretName, value);
  } catch (error) {
    console.error('Failed to set secret:', error);
    throw error;
  }
}

// Usage
const dbPassword = await getSecret('database-password');
```

---

## ✅ Best Practices

### Secrets in CI/CD

```yaml
# GitHub Actions
- name: Get secrets
  env:
    DATABASE_PASSWORD: ${{ secrets.DATABASE_PASSWORD }}
    API_KEY: ${{ secrets.API_KEY }}
  run: npm run deploy

# Use environment files
- name: Create .env file
  run: |
    echo "DATABASE_PASSWORD=${{ secrets.DATABASE_PASSWORD }}" >> .env
    echo "API_KEY=${{ secrets.API_KEY }}" >> .env
```

### Secrets in Docker

```bash
# Docker secrets (Swarm mode)
echo "mysecret" | docker secret create db_password -

# Use secret in service
docker service create \
  --name myapp \
  --secret db_password \
  myapp:latest

# Access secret in container
# Secret is mounted at /run/secrets/db_password
cat /run/secrets/db_password
```

### Environment Variables

```typescript
// config.ts - Centralized configuration
import dotenv from 'dotenv';

// Load from .env file (development)
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000'),
  env: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD, // From secret manager
    name: process.env.DB_NAME || 'myapp',
  },
  
  // External APIs
  apis: {
    stripeKey: process.env.STRIPE_SECRET_KEY, // From secret manager
    sendgridKey: process.env.SENDGRID_API_KEY, // From secret manager
  },
  
  // Security
  jwt: {
    secret: process.env.JWT_SECRET, // From secret manager
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};

// Validate required secrets
const required = ['DB_PASSWORD', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

### Secret Rotation

```typescript
// rotation.ts
export async function rotateSecret(secretName: string) {
  // 1. Generate new secret
  const newSecret = generateSecurePassword();
  
  // 2. Store new secret version
  await setSecret(`${secretName}-new`, newSecret);
  
  // 3. Update application configuration
  await updateApplicationConfig(secretName, newSecret);
  
  // 4. Test new secret
  await testSecret(newSecret);
  
  // 5. Replace old secret
  await setSecret(secretName, newSecret);
  
  // 6. Clean up
  await deleteSecret(`${secretName}-new`);
  
  // 7. Log rotation
  logger.info('Secret rotated successfully', { secretName });
}

// Schedule rotation
cron.schedule('0 0 1 * *', async () => {
  // Rotate monthly
  await rotateSecret('database-password');
  await rotateSecret('api-key');
});
```

## 📊 Monitoring Checklist

- [ ] Metrics collection configured
- [ ] Dashboards created
- [ ] Alerts configured
- [ ] Log aggregation setup
- [ ] Distributed tracing implemented
- [ ] SLO/SLI defined
- [ ] On-call rotation established
- [ ] Runbooks documented

## 🔐 Secrets Checklist

- [ ] No secrets in code
- [ ] Secrets manager implemented
- [ ] Rotation schedule defined
- [ ] Access control configured
- [ ] Audit logging enabled
- [ ] Emergency access procedure
- [ ] Backup and recovery plan
- [ ] Secrets documentation

## 📚 Referencias

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [HashiCorp Vault](https://www.vaultproject.io/docs)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/)
- [OpenTelemetry](https://opentelemetry.io/docs/)

---

_Monitoring & Secrets - Observabilidad completa y seguridad garantizada_ 📊🔐
