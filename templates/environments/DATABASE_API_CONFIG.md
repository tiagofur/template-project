# 🗄️ Database & API Configuration Guide

Comprehensive guide for configuring databases and API connections across all environments.

## 📋 Table of Contents

- [Database Configuration](#database-configuration)
  - [PostgreSQL](#postgresql)
  - [MongoDB](#mongodb)
  - [Redis](#redis)
- [API Configuration](#api-configuration)
- [Connection Pooling](#connection-pooling)
- [Health Checks](#health-checks)
- [Backup & Recovery](#backup--recovery)

## Database Configuration

### PostgreSQL

PostgreSQL is a powerful, open-source relational database system.

#### Environment Variables

```bash
# Basic Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=your_password

# Connection String (Recommended)
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapp_dev

# SSL Configuration (Production)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Connection Pool
DB_POOL_MIN=10
DB_POOL_MAX=50
DB_POOL_ACQUIRE_TIMEOUT=30000
DB_POOL_IDLE_TIMEOUT=30000
```

#### Connection Setup (TypeORM)

```typescript
// config/database.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  
  // SSL Configuration
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/ca.pem').toString(),
  } : false,
  
  // Connection Pool
  poolSize: parseInt(process.env.DB_POOL_MAX) || 50,
  extra: {
    min: parseInt(process.env.DB_POOL_MIN) || 10,
    max: parseInt(process.env.DB_POOL_MAX) || 50,
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_POOL_ACQUIRE_TIMEOUT) || 30000,
  },
  
  // Entities and Migrations
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  
  // Logging
  logging: process.env.DEBUG_SQL === 'true',
  
  // Synchronization (NEVER in production)
  synchronize: process.env.NODE_ENV === 'development',
});
```

#### Connection Setup (Prisma)

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```typescript
// config/database.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.DEBUG_SQL === 'true' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});
```

#### Read Replicas

```bash
# Master (Write)
DATABASE_URL=postgresql://master:pass@master-db:5432/myapp

# Replica (Read)
DATABASE_READ_URL=postgresql://replica:pass@replica-db:5432/myapp
```

```typescript
// Separate connections for read/write
const masterDb = new DataSource({
  url: process.env.DATABASE_URL,
});

const replicaDb = new DataSource({
  url: process.env.DATABASE_READ_URL,
});

// Use replica for read-heavy operations
async function getUsers() {
  return replicaDb.getRepository(User).find();
}

// Use master for writes
async function createUser(data: CreateUserDto) {
  return masterDb.getRepository(User).save(data);
}
```

### MongoDB

MongoDB is a popular NoSQL document database.

#### Environment Variables

```bash
# Development
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=myapp_dev
MONGODB_USERNAME=
MONGODB_PASSWORD=

# Production (Atlas or Self-Hosted)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/myapp?retryWrites=true&w=majority
MONGODB_DATABASE=myapp_production

# Replica Set
MONGODB_URI=mongodb://user:pass@host1:27017,host2:27017,host3:27017/myapp?replicaSet=rs0

# Connection Pool
MONGODB_POOL_SIZE=50
MONGODB_POOL_TIMEOUT=30000
```

#### Connection Setup (Mongoose)

```typescript
// config/mongodb.ts
import mongoose from 'mongoose';

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DATABASE;
  
  const options = {
    dbName,
    
    // Authentication
    auth: {
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
    },
    
    // Connection Pool
    maxPoolSize: parseInt(process.env.MONGODB_POOL_SIZE) || 50,
    minPoolSize: 10,
    socketTimeoutMS: parseInt(process.env.MONGODB_POOL_TIMEOUT) || 30000,
    
    // Retry Logic
    retryWrites: true,
    retryReads: true,
    
    // Compression
    compressors: ['zlib'],
    
    // SSL/TLS
    tls: process.env.NODE_ENV === 'production',
    tlsAllowInvalidCertificates: false,
  };
  
  try {
    await mongoose.connect(uri, options);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
```

### Redis

Redis is an in-memory data structure store used for caching and sessions.

#### Environment Variables

```bash
# Development
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Production
REDIS_URL=rediss://user:pass@redis.example.com:6380
REDIS_PASSWORD=your_redis_password
REDIS_TLS_ENABLED=true

# Cluster
REDIS_CLUSTER_NODES=redis1:6379,redis2:6379,redis3:6379

# Configuration
REDIS_DB=0
REDIS_KEY_PREFIX=myapp:
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY=1000
```

#### Connection Setup (ioredis)

```typescript
// config/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB) || 0,
  
  // Key prefix
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'myapp:',
  
  // Retry strategy
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  
  // TLS Configuration
  tls: process.env.REDIS_TLS_ENABLED === 'true' ? {
    rejectUnauthorized: true,
  } : undefined,
  
  // Connection options
  maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES) || 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  
  // Reconnect on error
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

// Event handlers
redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});
```

#### Redis Cluster

```typescript
import { Cluster } from 'ioredis';

const cluster = new Cluster(
  process.env.REDIS_CLUSTER_NODES.split(',').map(node => {
    const [host, port] = node.split(':');
    return { host, port: parseInt(port) };
  }),
  {
    redisOptions: {
      password: process.env.REDIS_PASSWORD,
      tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined,
    },
    clusterRetryStrategy: (times) => {
      return Math.min(times * 100, 2000);
    },
  }
);
```

## API Configuration

### REST API

#### Environment Variables

```bash
# API URLs
API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=30000
API_MAX_RETRIES=3

# External APIs
OPENAI_API_KEY=sk-...
OPENAI_API_URL=https://api.openai.com/v1
STRIPE_API_KEY=sk_...
STRIPE_API_URL=https://api.stripe.com/v1

# Rate Limiting
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX_REQUESTS=100
```

#### HTTP Client Configuration

```typescript
// config/http-client.ts
import axios, { AxiosInstance } from 'axios';

export function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: parseInt(process.env.API_TIMEOUT) || 30000,
    
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'MyApp/1.0',
    },
  });
  
  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request in debug mode
      if (process.env.DEBUG_API === 'true') {
        console.log(`→ ${config.method.toUpperCase()} ${config.url}`);
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      if (process.env.DEBUG_API === 'true') {
        console.log(`← ${response.status} ${response.config.url}`);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // Retry logic
      if (error.response?.status === 429 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return client(originalRequest);
      }
      
      // Token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const newToken = await refreshAuthToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return client(originalRequest);
      }
      
      return Promise.reject(error);
    }
  );
  
  return client;
}
```

### GraphQL API

```bash
# GraphQL
GRAPHQL_ENDPOINT=http://localhost:3000/graphql
GRAPHQL_SUBSCRIPTIONS_ENDPOINT=ws://localhost:3000/graphql
GRAPHQL_INTROSPECTION=false  # Disable in production
```

```typescript
// config/graphql-client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_ENDPOINT,
  headers: {
    authorization: `Bearer ${getAuthToken()}`,
  },
});

const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_SUBSCRIPTIONS_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getAuthToken(),
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

## Connection Pooling

### Why Connection Pooling?

- Reuse connections instead of creating new ones
- Better performance and resource utilization
- Prevent connection exhaustion
- Handle connection failures gracefully

### PostgreSQL Pool Configuration

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // Pool size
  min: 10,
  max: 50,
  
  // Timeouts
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  
  // Keep connections alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  
  // Statement timeout
  statement_timeout: 30000,
  
  // Query timeout
  query_timeout: 30000,
});

// Monitor pool
pool.on('connect', (client) => {
  console.log('New client connected to pool');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});
```

## Health Checks

### Database Health Check

```typescript
// routes/health.ts
import { Router } from 'express';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {},
  };
  
  try {
    // PostgreSQL check
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = {
      status: 'healthy',
      responseTime: Date.now() - dbStart,
    };
  } catch (error) {
    health.status = 'unhealthy';
    health.checks.database = {
      status: 'unhealthy',
      error: error.message,
    };
  }
  
  try {
    // Redis check
    const redisStart = Date.now();
    await redis.ping();
    health.checks.redis = {
      status: 'healthy',
      responseTime: Date.now() - redisStart,
    };
  } catch (error) {
    health.status = 'unhealthy';
    health.checks.redis = {
      status: 'unhealthy',
      error: error.message,
    };
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
```

## Backup & Recovery

### PostgreSQL Backup

```bash
# Automated daily backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *  # 2 AM daily
BACKUP_RETENTION_DAYS=30
BACKUP_S3_BUCKET=myapp-backups
```

```bash
#!/bin/bash
# scripts/backup-database.sh

DB_NAME="${DB_NAME}"
DB_USER="${DB_USER}"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Create backup
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME | gzip > $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE s3://$BACKUP_S3_BUCKET/

# Clean old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
```

## 🔗 Related Documentation

- [Environment Configuration](./README.md)
- [Secrets Management](./SECRETS_MANAGEMENT.md)
- [Security Guide](../../docs/security/README.md)

---

**Last Updated**: 2025-11-13  
**Maintained By**: DevOps Team
