# 💾 Caching & Rate Limiting Guide

Guía completa para optimización de rendimiento con caching y protección de APIs con rate limiting.

## 📋 Tabla de Contenidos

1. [Caching Strategies](#caching-strategies)
2. [HTTP Caching](#http-caching)
3. [Application Caching](#application-caching)
4. [CDN Caching](#cdn-caching)
5. [Cache Invalidation](#cache-invalidation)
6. [Rate Limiting](#rate-limiting)
7. [Best Practices](#best-practices)

## 💾 Caching Strategies

### 1. Cache-Aside (Lazy Loading)

El patrón más común. La aplicación verifica el cache antes de la base de datos.

```typescript
class CacheAsideService {
  constructor(
    private cache: RedisClient,
    private database: Database
  ) {}

  async getUser(userId: string): Promise<User> {
    // 1. Intentar obtener del cache
    const cacheKey = `user:${userId}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) {
      console.log('Cache HIT');
      return JSON.parse(cached);
    }

    console.log('Cache MISS');
    
    // 2. Si no está en cache, obtener de database
    const user = await this.database.users.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // 3. Guardar en cache para próximas requests
    await this.cache.setex(
      cacheKey,
      3600,  // TTL: 1 hora
      JSON.stringify(user)
    );

    return user;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    // 1. Actualizar en database
    const user = await this.database.users.update(userId, data);

    // 2. Invalidar cache
    await this.cache.del(`user:${userId}`);

    return user;
  }
}
```

### 2. Write-Through

Escribe en cache y database simultáneamente.

```typescript
class WriteThroughService {
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const cacheKey = `user:${userId}`;

    // 1. Actualizar en database
    const user = await this.database.users.update(userId, data);

    // 2. Actualizar en cache inmediatamente
    await this.cache.setex(
      cacheKey,
      3600,
      JSON.stringify(user)
    );

    return user;
  }
}
```

### 3. Write-Behind (Write-Back)

Escribe en cache primero, database después (asíncrono).

```typescript
class WriteBehindService {
  private writeQueue: Map<string, any> = new Map();

  constructor(
    private cache: RedisClient,
    private database: Database
  ) {
    // Procesar escrituras en batch cada 5 segundos
    setInterval(() => this.flushWrites(), 5000);
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const cacheKey = `user:${userId}`;

    // 1. Obtener usuario actual
    const current = await this.getUser(userId);
    
    // 2. Actualizar en cache inmediatamente
    const updated = { ...current, ...data };
    await this.cache.setex(
      cacheKey,
      3600,
      JSON.stringify(updated)
    );

    // 3. Agregar a cola para escribir en database
    this.writeQueue.set(userId, updated);

    return updated;
  }

  private async flushWrites() {
    if (this.writeQueue.size === 0) return;

    console.log(`Flushing ${this.writeQueue.size} writes to database`);

    const writes = Array.from(this.writeQueue.entries());
    this.writeQueue.clear();

    // Escribir en batch
    await Promise.all(
      writes.map(([userId, data]) =>
        this.database.users.update(userId, data)
      )
    );
  }
}
```

### 4. Refresh-Ahead

Actualiza el cache proactivamente antes de que expire.

```typescript
class RefreshAheadService {
  private refreshThreshold = 0.8; // Refresh al 80% del TTL

  async getUser(userId: string): Promise<User> {
    const cacheKey = `user:${userId}`;
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      // Verificar TTL restante
      const ttl = await this.cache.ttl(cacheKey);
      const originalTTL = 3600; // 1 hora

      // Si TTL < 80% del original, refrescar en background
      if (ttl < originalTTL * this.refreshThreshold) {
        this.refreshCache(userId).catch(console.error);
      }

      return JSON.parse(cached);
    }

    // Si no está en cache, obtener y cachear
    return this.refreshCache(userId);
  }

  private async refreshCache(userId: string): Promise<User> {
    const user = await this.database.users.findById(userId);
    
    await this.cache.setex(
      `user:${userId}`,
      3600,
      JSON.stringify(user)
    );

    return user;
  }
}
```

## 🌐 HTTP Caching

### Cache-Control Headers

```typescript
import express from 'express';

const app = express();

// Cache estático por 1 año
app.get('/static/*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.sendFile(req.path);
});

// Cache de API por 5 minutos, revalidar
app.get('/api/posts', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, must-revalidate');
  res.json(posts);
});

// No cachear
app.get('/api/user/session', (req, res) => {
  res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.json(session);
});

// Cache privado (solo navegador)
app.get('/api/user/profile', (req, res) => {
  res.set('Cache-Control', 'private, max-age=300');
  res.json(profile);
});
```

### Cache-Control Directives

```typescript
const CacheDirectives = {
  // Público - puede ser cacheado por cualquiera (CDN, proxies)
  PUBLIC: 'public',
  
  // Privado - solo navegador del usuario
  PRIVATE: 'private',
  
  // No cachear
  NO_CACHE: 'no-cache',           // Revalidar antes de usar
  NO_STORE: 'no-store',           // No almacenar
  NO_TRANSFORM: 'no-transform',   // No modificar
  
  // TTL
  MAX_AGE: (seconds: number) => `max-age=${seconds}`,
  S_MAXAGE: (seconds: number) => `s-maxage=${seconds}`, // Para CDN/proxies
  
  // Revalidación
  MUST_REVALIDATE: 'must-revalidate',
  PROXY_REVALIDATE: 'proxy-revalidate',
  
  // Inmutable (nunca cambia)
  IMMUTABLE: 'immutable',
};

// Ejemplos
const cacheHeaders = {
  staticAssets: 'public, max-age=31536000, immutable',
  apiPublic: 'public, max-age=300, must-revalidate',
  apiPrivate: 'private, max-age=60',
  noCache: 'private, no-cache, no-store, must-revalidate',
};
```

### ETag (Entity Tag)

```typescript
import crypto from 'crypto';
import express from 'express';

function generateETag(content: any): string {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(content))
    .digest('hex');
}

app.get('/api/posts/:id', async (req, res) => {
  const post = await getPost(req.params.id);
  const etag = generateETag(post);

  // Verificar If-None-Match header
  if (req.headers['if-none-match'] === etag) {
    // Contenido no ha cambiado
    return res.status(304).end();
  }

  res.set('ETag', etag);
  res.set('Cache-Control', 'public, max-age=300');
  res.json(post);
});
```

### Last-Modified

```typescript
app.get('/api/posts/:id', async (req, res) => {
  const post = await getPost(req.params.id);
  const lastModified = new Date(post.updatedAt);

  // Verificar If-Modified-Since header
  if (req.headers['if-modified-since']) {
    const ifModifiedSince = new Date(req.headers['if-modified-since']);
    
    if (lastModified <= ifModifiedSince) {
      // No ha sido modificado
      return res.status(304).end();
    }
  }

  res.set('Last-Modified', lastModified.toUTCString());
  res.set('Cache-Control', 'public, max-age=300');
  res.json(post);
});
```

## 🗄️ Application Caching

### Redis Cache Service

```typescript
import { createClient, RedisClientType } from 'redis';

export class CacheService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this.client.connect();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  /**
   * Delete from cache
   */
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  /**
   * Get TTL of key
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /**
   * Set expiration on key
   */
  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  /**
   * Increment numeric value
   */
  async increment(key: string, by: number = 1): Promise<number> {
    return this.client.incrBy(key, by);
  }

  /**
   * Decrement numeric value
   */
  async decrement(key: string, by: number = 1): Promise<number> {
    return this.client.decrBy(key, by);
  }
}
```

### Cache Decorator

```typescript
function Cache(ttlSeconds: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache = new CacheService();
      
      // Generar cache key desde método y argumentos
      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      
      // Verificar cache
      const cached = await cache.get(cacheKey);
      if (cached) {
        console.log(`Cache HIT: ${cacheKey}`);
        return cached;
      }

      console.log(`Cache MISS: ${cacheKey}`);

      // Ejecutar método original
      const result = await originalMethod.apply(this, args);

      // Guardar en cache
      await cache.set(cacheKey, result, ttlSeconds);

      return result;
    };

    return descriptor;
  };
}

// Uso
class UserService {
  @Cache(300) // Cache por 5 minutos
  async getUser(userId: string): Promise<User> {
    return this.database.users.findById(userId);
  }

  @Cache(60) // Cache por 1 minuto
  async getUserPosts(userId: string): Promise<Post[]> {
    return this.database.posts.findByUser(userId);
  }
}
```

### Memoization (In-Memory Cache)

```typescript
class Memoize {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  memoize<T>(
    fn: (...args: any[]) => T,
    ttlMs: number = 60000
  ): (...args: any[]) => T {
    return (...args: any[]): T => {
      const key = JSON.stringify(args);
      const cached = this.cache.get(key);

      // Verificar si existe y no ha expirado
      if (cached && Date.now() < cached.expiresAt) {
        return cached.value;
      }

      // Ejecutar función
      const result = fn(...args);

      // Guardar en cache
      this.cache.set(key, {
        value: result,
        expiresAt: Date.now() + ttlMs,
      });

      return result;
    };
  }

  clear() {
    this.cache.clear();
  }
}

// Uso
const memoizer = new Memoize();

const expensiveCalculation = memoizer.memoize(
  (n: number) => {
    console.log('Calculating...');
    return n * n;
  },
  5000 // 5 segundos
);

console.log(expensiveCalculation(5)); // Calculating... 25
console.log(expensiveCalculation(5)); // 25 (desde cache)
```

## 🌍 CDN Caching

### Cloudflare Page Rules

```typescript
// Next.js - Headers para Cloudflare
export async function middleware(request: Request) {
  const response = NextResponse.next();

  // Assets estáticos - cache por 1 año
  if (request.url.includes('/static/') || request.url.includes('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('CDN-Cache-Control', 'max-age=31536000');
  }

  // API - cache por 5 minutos
  if (request.url.includes('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=300');
    response.headers.set('CDN-Cache-Control', 'max-age=300');
  }

  return response;
}
```

### Purge CDN Cache

```typescript
// Cloudflare
async function purgeCDNCache(urls: string[]) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files: urls }),
    }
  );

  return response.json();
}

// Uso
await purgeCDNCache([
  'https://example.com/api/posts',
  'https://example.com/static/image.jpg',
]);
```

## ♻️ Cache Invalidation

### Time-Based Invalidation (TTL)

```typescript
// Expiración automática
await cache.setex('user:123', 3600, userData); // Expira en 1 hora
```

### Event-Based Invalidation

```typescript
class UserService {
  constructor(
    private cache: CacheService,
    private eventEmitter: EventEmitter
  ) {
    // Escuchar eventos de invalidación
    this.eventEmitter.on('user:updated', this.invalidateUserCache.bind(this));
    this.eventEmitter.on('user:deleted', this.invalidateUserCache.bind(this));
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const user = await this.database.users.update(userId, data);

    // Emitir evento
    this.eventEmitter.emit('user:updated', userId);

    return user;
  }

  private async invalidateUserCache(userId: string) {
    // Invalidar cache del usuario
    await this.cache.delete(`user:${userId}`);
    
    // Invalidar caches relacionados
    await this.cache.deletePattern(`user:${userId}:*`);
    await this.cache.deletePattern(`posts:user:${userId}:*`);
  }
}
```

### Tag-Based Invalidation

```typescript
class TaggedCache {
  constructor(private cache: CacheService) {}

  async set(key: string, value: any, tags: string[], ttl: number) {
    // Guardar valor
    await this.cache.set(key, value, ttl);

    // Asociar tags
    for (const tag of tags) {
      await this.cache.set(`tag:${tag}:${key}`, '1', ttl);
    }
  }

  async invalidateByTag(tag: string) {
    const pattern = `tag:${tag}:*`;
    const tagKeys = await this.redis.keys(pattern);

    for (const tagKey of tagKeys) {
      // Extraer clave original
      const originalKey = tagKey.replace(`tag:${tag}:`, '');
      
      // Eliminar valor y tag
      await this.cache.delete(originalKey);
      await this.cache.delete(tagKey);
    }
  }
}

// Uso
const taggedCache = new TaggedCache(cache);

await taggedCache.set(
  'user:123',
  userData,
  ['user', 'user:123', 'active-users'],
  3600
);

// Invalidar todos los usuarios activos
await taggedCache.invalidateByTag('active-users');
```

## 🚦 Rate Limiting

### Fixed Window

```typescript
import rateLimit from 'express-rate-limit';

// Límite global: 100 requests por 15 minutos
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', globalLimiter);
```

### Sliding Window

```typescript
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:',
  }),
  windowMs: 60 * 1000, // 1 minuto
  max: 10,
});

app.use('/api/', limiter);
```

### Token Bucket

```typescript
class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private capacity: number,      // Capacidad máxima
    private refillRate: number,    // Tokens por segundo
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  async consume(tokens: number = 1): Promise<boolean> {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  private refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}

// Uso
const bucket = new TokenBucket(10, 1); // 10 tokens, 1 por segundo

if (await bucket.consume(1)) {
  // Procesar request
} else {
  // Rate limit excedido
  res.status(429).json({ error: 'Rate limit exceeded' });
}
```

### Rate Limiting por Usuario

```typescript
import { RateLimiterRedis } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl:user',
  points: 100,          // Número de requests
  duration: 60,         // Por minuto
});

app.use(async (req, res, next) => {
  const userId = req.user?.id || req.ip;

  try {
    await rateLimiter.consume(userId);
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: error.msBeforeNext / 1000,
    });
  }
});
```

### Rate Limiting por Endpoint

```typescript
const limits = {
  '/api/auth/login': { max: 5, window: 15 * 60 * 1000 },      // 5 por 15min
  '/api/users': { max: 100, window: 60 * 1000 },              // 100 por min
  '/api/posts': { max: 50, window: 60 * 1000 },               // 50 por min
};

function createEndpointLimiter(endpoint: string) {
  const config = limits[endpoint];
  
  return rateLimit({
    windowMs: config.window,
    max: config.max,
    skipSuccessfulRequests: endpoint.includes('/auth'),  // No contar éxitos en auth
  });
}

app.post('/api/auth/login', createEndpointLimiter('/api/auth/login'), loginHandler);
app.get('/api/users', createEndpointLimiter('/api/users'), getUsersHandler);
```

### Rate Limit Headers

```typescript
app.use((req, res, next) => {
  const limit = 100;
  const remaining = 95;
  const reset = Date.now() + 60000;

  res.set({
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.floor(reset / 1000).toString(),
  });

  if (remaining === 0) {
    res.set('Retry-After', '60');
  }

  next();
});
```

## ✅ Best Practices

### Caching Best Practices

```typescript
// ✅ Usar TTL apropiado
const TTL = {
  static: 31536000,      // 1 año - assets inmutables
  api: 300,              // 5 minutos - datos que cambian poco
  realtime: 10,          // 10 segundos - datos en tiempo real
  session: 1800,         // 30 minutos - datos de sesión
};

// ✅ Cache key naming convention
const cacheKeys = {
  user: (id: string) => `user:${id}`,
  userPosts: (id: string) => `user:${id}:posts`,
  post: (id: string) => `post:${id}`,
  postComments: (id: string) => `post:${id}:comments`,
};

// ✅ Handle cache failures gracefully
async function getWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    const cached = await cache.get<T>(key);
    if (cached) return cached;
  } catch (error) {
    console.error('Cache read error:', error);
    // Continuar sin cache
  }

  const data = await fetchFn();

  try {
    await cache.set(key, data, ttl);
  } catch (error) {
    console.error('Cache write error:', error);
    // No fallar si cache write falla
  }

  return data;
}

// ❌ No cachear errores
try {
  const data = await fetchData();
  await cache.set(key, data);
} catch (error) {
  // No guardar error en cache
  throw error;
}
```

### Rate Limiting Best Practices

```typescript
// ✅ Diferentes límites por tier
const rateLimits = {
  free: { requests: 100, window: 3600 },       // 100/hora
  basic: { requests: 1000, window: 3600 },     // 1000/hora
  premium: { requests: 10000, window: 3600 },  // 10000/hora
};

// ✅ Whitelist para IPs confiables
const whitelist = ['192.168.1.1', '10.0.0.1'];

const limiter = rateLimit({
  skip: (req) => whitelist.includes(req.ip),
  // ... resto de config
});

// ✅ Informar al cliente sobre límites
res.status(429).json({
  error: 'Rate limit exceeded',
  limit: 100,
  remaining: 0,
  reset: Math.floor(Date.now() / 1000) + 3600,
  retryAfter: 3600,
});
```

## 📊 Monitoring

### Cache Metrics

```typescript
class CacheMetrics {
  private hits = 0;
  private misses = 0;
  private errors = 0;

  recordHit() {
    this.hits++;
  }

  recordMiss() {
    this.misses++;
  }

  recordError() {
    this.errors++;
  }

  getHitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? this.hits / total : 0;
  }

  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      errors: this.errors,
      hitRate: this.getHitRate(),
    };
  }

  reset() {
    this.hits = 0;
    this.misses = 0;
    this.errors = 0;
  }
}
```

### Rate Limit Monitoring

```typescript
// Loggear cuando se excede rate limit
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (error) {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      endpoint: req.path,
      userAgent: req.headers['user-agent'],
    });
    
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
});
```

## 📚 Recursos Adicionales

- [HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
- [Redis Documentation](https://redis.io/documentation)
- [Rate Limiting Patterns](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
- [Cloudflare Cache](https://developers.cloudflare.com/cache/)

---

_Caching & Rate Limiting Guide - Optimización y protección de APIs_ 💾🚦
