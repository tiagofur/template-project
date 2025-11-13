# 🔄 Error Handling & Retries Guide

Guía completa para manejo de errores robusto y estrategias de reintentos en APIs e integraciones.

## 📋 Tabla de Contenidos

1. [Error Taxonomy](#error-taxonomy)
2. [Error Response Format](#error-response-format)
3. [Error Codes](#error-codes)
4. [Retry Strategies](#retry-strategies)
5. [Circuit Breaker Pattern](#circuit-breaker-pattern)
6. [Timeout Handling](#timeout-handling)
7. [Error Logging](#error-logging)
8. [Best Practices](#best-practices)

## 🏷️ Error Taxonomy

### Categorías de Errores

#### 1. Client Errors (4xx)

Errores causados por el cliente - **NO reintentar** automáticamente

```typescript
const ClientErrors = {
  BAD_REQUEST: 400,           // Request malformado
  UNAUTHORIZED: 401,          // No autenticado
  FORBIDDEN: 403,             // Sin permisos
  NOT_FOUND: 404,             // Recurso no existe
  CONFLICT: 409,              // Conflicto (duplicado)
  VALIDATION_ERROR: 422,      // Datos inválidos
  RATE_LIMIT: 429,            // Demasiadas requests
};
```

#### 2. Server Errors (5xx)

Errores del servidor - **SÍ reintentar** con backoff

```typescript
const ServerErrors = {
  INTERNAL_ERROR: 500,        // Error genérico del servidor
  BAD_GATEWAY: 502,           // Gateway inválido
  SERVICE_UNAVAILABLE: 503,   // Servicio no disponible
  GATEWAY_TIMEOUT: 504,       // Gateway timeout
};
```

#### 3. Network Errors

Errores de red - **SÍ reintentar** con backoff

```typescript
const NetworkErrors = [
  'ECONNREFUSED',   // Conexión rechazada
  'ENOTFOUND',      // DNS no resuelve
  'ETIMEDOUT',      // Timeout de conexión
  'ECONNRESET',     // Conexión reseteada
  'ENETUNREACH',    // Red no alcanzable
];
```

## 📝 Error Response Format

### Formato Estándar

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Error code único
    message: string;        // Mensaje user-friendly
    details?: any;          // Detalles adicionales
    field?: string;         // Campo con error (validación)
    timestamp?: string;     // Timestamp del error
    requestId?: string;     // ID para tracking
  };
  meta?: {
    requestId: string;
    timestamp: string;
  };
}
```

### Ejemplos de Errores

#### Error de Validación

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email must be a valid email address",
        "value": "invalid-email"
      },
      {
        "field": "age",
        "message": "Age must be a number between 18 and 120",
        "value": "15"
      }
    ]
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Error de Autenticación

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": "Invalid or expired token"
  },
  "meta": {
    "requestId": "req_def456",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Error de Negocio

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Insufficient funds for this transaction",
    "details": {
      "required": 100.00,
      "available": 50.00,
      "currency": "USD"
    }
  },
  "meta": {
    "requestId": "req_ghi789",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Error del Servidor

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "details": "Database connection failed"
  },
  "meta": {
    "requestId": "req_jkl012",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 🔢 Error Codes

### Catálogo de Error Codes

```typescript
export const ErrorCodes = {
  // Authentication & Authorization (1xxx)
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    status: 401,
    message: 'Authentication required',
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    status: 401,
    message: 'Invalid authentication token',
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    status: 401,
    message: 'Authentication token has expired',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    status: 403,
    message: 'You do not have permission to access this resource',
  },

  // Validation Errors (2xxx)
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    status: 400,
    message: 'Validation failed',
  },
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    status: 400,
    message: 'Invalid input data',
  },
  MISSING_REQUIRED_FIELD: {
    code: 'MISSING_REQUIRED_FIELD',
    status: 400,
    message: 'Required field is missing',
  },

  // Resource Errors (3xxx)
  NOT_FOUND: {
    code: 'NOT_FOUND',
    status: 404,
    message: 'Resource not found',
  },
  ALREADY_EXISTS: {
    code: 'ALREADY_EXISTS',
    status: 409,
    message: 'Resource already exists',
  },
  CONFLICT: {
    code: 'CONFLICT',
    status: 409,
    message: 'Request conflicts with current state',
  },

  // Rate Limiting (4xxx)
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    status: 429,
    message: 'Too many requests, please try again later',
  },
  QUOTA_EXCEEDED: {
    code: 'QUOTA_EXCEEDED',
    status: 429,
    message: 'API quota exceeded',
  },

  // Business Logic (5xxx)
  INSUFFICIENT_FUNDS: {
    code: 'INSUFFICIENT_FUNDS',
    status: 422,
    message: 'Insufficient funds',
  },
  PAYMENT_FAILED: {
    code: 'PAYMENT_FAILED',
    status: 402,
    message: 'Payment processing failed',
  },

  // Server Errors (6xxx)
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: 500,
    message: 'An unexpected error occurred',
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
    message: 'Service temporarily unavailable',
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    status: 500,
    message: 'Database operation failed',
  },

  // External Service Errors (7xxx)
  EXTERNAL_SERVICE_ERROR: {
    code: 'EXTERNAL_SERVICE_ERROR',
    status: 502,
    message: 'External service error',
  },
  GATEWAY_TIMEOUT: {
    code: 'GATEWAY_TIMEOUT',
    status: 504,
    message: 'Gateway timeout',
  },
} as const;
```

### Uso de Error Codes

```typescript
import { ErrorCodes } from './error-codes';

class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromCode(errorCode: keyof typeof ErrorCodes, details?: any) {
    const error = ErrorCodes[errorCode];
    return new ApiError(error.code, error.message, error.status, details);
  }
}

// Uso
throw ApiError.fromCode('USER_NOT_FOUND', { userId: '123' });
```

## 🔄 Retry Strategies

### 1. Exponential Backoff

La estrategia más recomendada para la mayoría de los casos.

```typescript
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;      // ms
  maxDelay: number;       // ms
  factor: number;         // multiplicador
  jitter: boolean;        // agregar randomness
}

class ExponentialBackoff {
  constructor(private config: RetryConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // No reintentar si es error del cliente
        if (this.isClientError(error)) {
          throw error;
        }

        // Si es el último intento, lanzar el error
        if (attempt === this.config.maxRetries) {
          throw error;
        }

        // Calcular delay
        const delay = this.calculateDelay(attempt);
        
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private calculateDelay(attempt: number): number {
    // Exponential: baseDelay * (factor ^ attempt)
    let delay = this.config.baseDelay * Math.pow(this.config.factor, attempt);
    
    // Cap al máximo
    delay = Math.min(delay, this.config.maxDelay);
    
    // Agregar jitter si está habilitado
    if (this.config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    return Math.floor(delay);
  }

  private isClientError(error: any): boolean {
    return error.status >= 400 && error.status < 500 && error.status !== 429;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Uso
const retry = new ExponentialBackoff({
  maxRetries: 3,
  baseDelay: 1000,        // 1 segundo
  maxDelay: 30000,        // 30 segundos
  factor: 2,              // doblar cada vez
  jitter: true,
});

const result = await retry.execute(() => apiCall());
```

### 2. Linear Backoff

Incremento constante entre reintentos.

```typescript
class LinearBackoff {
  constructor(
    private maxRetries: number,
    private delayMs: number
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === this.maxRetries) {
          throw error;
        }
        
        const delay = this.delayMs * (attempt + 1);
        await this.sleep(delay);
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Uso: 1s, 2s, 3s delays
const retry = new LinearBackoff(3, 1000);
```

### 3. Fixed Delay

Mismo delay entre cada reintento.

```typescript
class FixedDelayRetry {
  constructor(
    private maxRetries: number,
    private delayMs: number
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === this.maxRetries) {
          throw error;
        }
        
        await this.sleep(this.delayMs);
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 4. Retry con Axios

```typescript
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

const client = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Configurar retry
axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => {
    // Exponential backoff: 1s, 2s, 4s
    return axiosRetry.exponentialDelay(retryCount);
  },
  retryCondition: (error: AxiosError) => {
    // Retry on network errors and 5xx errors
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status >= 500 && error.response?.status < 600)
    );
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
  },
});
```

## 🔌 Circuit Breaker Pattern

Previene llamadas a servicios que están fallando continuamente.

```typescript
import CircuitBreaker from 'opossum';

interface CircuitBreakerConfig {
  timeout: number;                    // Timeout de request (ms)
  errorThresholdPercentage: number;   // % de errores para abrir
  resetTimeout: number;               // Tiempo antes de intentar de nuevo (ms)
  rollingCountTimeout: number;        // Ventana de tiempo para % errores (ms)
  volumeThreshold: number;            // Mínimo requests antes de calcular %
}

const options: CircuitBreakerConfig = {
  timeout: 3000,                      // 3 segundos
  errorThresholdPercentage: 50,       // Abrir si >50% errores
  resetTimeout: 30000,                // Intentar de nuevo en 30s
  rollingCountTimeout: 10000,         // Ventana de 10s
  volumeThreshold: 10,                // Mínimo 10 requests
};

// Crear circuit breaker
const breaker = new CircuitBreaker(asyncFunction, options);

// Event listeners
breaker.on('open', () => {
  console.error('Circuit breaker opened - too many failures');
});

breaker.on('halfOpen', () => {
  console.warn('Circuit breaker half-open - testing if service recovered');
});

breaker.on('close', () => {
  console.info('Circuit breaker closed - service recovered');
});

breaker.on('fallback', (result) => {
  console.log('Fallback executed:', result);
});

// Fallback function
breaker.fallback(() => {
  return { cached: true, data: getCachedData() };
});

// Uso
try {
  const result = await breaker.fire(params);
} catch (error) {
  console.error('Circuit breaker error:', error);
}
```

### Estados del Circuit Breaker

```
┌─────────┐
│ CLOSED  │ ───── Funciona normalmente
└────┬────┘       (requests pasan)
     │
     │ errores > threshold
     │
     ▼
┌─────────┐
│  OPEN   │ ───── Servicio fallando
└────┬────┘       (rechaza requests inmediatamente)
     │
     │ después de resetTimeout
     │
     ▼
┌──────────┐
│ HALF-OPEN│ ───── Probando recuperación
└──────────┘       (permite 1 request de prueba)
     │
     ├─── éxito ────► CLOSED
     │
     └─── fallo ────► OPEN
```

## ⏱️ Timeout Handling

### Request Timeout

```typescript
class TimeoutError extends Error {
  constructor(message: string, public timeout: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage?: string
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new TimeoutError(
        errorMessage || `Operation timed out after ${timeoutMs}ms`,
        timeoutMs
      ));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutHandle!);
  }
}

// Uso
try {
  const result = await withTimeout(
    fetch('https://api.example.com/data'),
    5000,
    'API request timed out'
  );
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('Request timed out after', error.timeout, 'ms');
  }
}
```

### Axios con Timeout

```typescript
const client = axios.create({
  timeout: 5000, // 5 segundos
});

// Por request
await client.get('/endpoint', {
  timeout: 10000, // 10 segundos para este request
});
```

## 📊 Error Logging

### Estructura de Log

```typescript
interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  error: {
    code: string;
    message: string;
    stack?: string;
  };
  request: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response?: {
    status: number;
    body?: any;
  };
  user?: {
    id: string;
    email?: string;
  };
  context?: Record<string, any>;
}
```

### Logger Implementation

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Development logging
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Log error
logger.error('API request failed', {
  error: {
    code: 'EXTERNAL_SERVICE_ERROR',
    message: error.message,
    stack: error.stack,
  },
  request: {
    method: 'POST',
    url: '/api/users',
    body: { email: 'user@example.com' },
  },
  response: {
    status: 502,
  },
});
```

### Error Monitoring (Sentry)

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Capturar error
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'api',
      endpoint: '/users',
    },
    extra: {
      requestId: req.id,
      userId: req.user?.id,
    },
  });
  
  throw error;
}
```

## ✅ Best Practices

### 1. Retry Strategy Selection

```typescript
// ✅ Usar exponential backoff con jitter
const retry = new ExponentialBackoff({
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  factor: 2,
  jitter: true,  // Importante para evitar thundering herd
});

// ❌ No usar fixed delay sin límite
while (true) {
  try {
    await apiCall();
    break;
  } catch (error) {
    await sleep(1000);  // Mala idea
  }
}
```

### 2. Idempotency

```typescript
// ✅ Requests idempotentes pueden reintentar seguro
app.put('/api/users/:id', async (req, res) => {
  // PUT es idempotente - seguro reintentar
  await updateUser(req.params.id, req.body);
});

// ⚠️ POST no es idempotente - usar idempotency key
app.post('/api/payments', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  
  // Check if already processed
  const existing = await findByIdempotencyKey(idempotencyKey);
  if (existing) {
    return res.json(existing);
  }
  
  // Process payment
  const payment = await processPayment(req.body, idempotencyKey);
  res.json(payment);
});
```

### 3. Error Context

```typescript
// ✅ Incluir contexto útil
throw new ApiError('USER_NOT_FOUND', 'User not found', 404, {
  userId: '123',
  attemptedAt: new Date(),
  searchCriteria: { email: 'user@example.com' },
});

// ❌ Error sin contexto
throw new Error('Not found');
```

### 4. Client-Side Error Handling

```typescript
// ✅ Manejo granular de errores
try {
  const user = await api.getUser(userId);
} catch (error) {
  if (error.code === 'USER_NOT_FOUND') {
    // Mostrar mensaje específico
    showNotification('Usuario no encontrado');
  } else if (error.code === 'UNAUTHORIZED') {
    // Redirigir a login
    redirectToLogin();
  } else if (error.status >= 500) {
    // Error del servidor - mostrar mensaje genérico
    showNotification('Error del servidor, intente más tarde');
  } else {
    // Error desconocido
    showNotification('Ocurrió un error inesperado');
  }
}
```

### 5. Graceful Degradation

```typescript
// ✅ Degradación elegante con fallback
async function getUserWithRecommendations(userId: string) {
  try {
    const [user, recommendations] = await Promise.all([
      getUser(userId),
      getRecommendations(userId).catch(() => []), // Fallback a array vacío
    ]);
    
    return { user, recommendations };
  } catch (error) {
    // Si falla user, lanzar error
    // Si falla recommendations, continuar sin ellas
    throw error;
  }
}
```

## 📚 Recursos Adicionales

- [Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Idempotency Keys](https://stripe.com/docs/api/idempotent_requests)
- [Error Handling in Node.js](https://nodejs.org/en/docs/guides/error-handling/)

---

_Error Handling & Retries Guide - Manejo robusto de errores_ 🔄
