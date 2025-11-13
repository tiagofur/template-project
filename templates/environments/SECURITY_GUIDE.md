# 🔒 Environment Security Guide

Security best practices for environment configuration and deployment.

## 📋 Security Checklist

### Development Environment
- [ ] `.env` file in `.gitignore`
- [ ] Different secrets from production
- [ ] No production data in development
- [ ] Debug mode can be enabled
- [ ] Local SSL certificates for testing
- [ ] Development API keys (not production)

### Test Environment
- [ ] Separate test database
- [ ] Mock external services where possible
- [ ] Test credentials isolated
- [ ] No production secrets
- [ ] Automated cleanup after tests

### Staging Environment
- [ ] Production-like security settings
- [ ] SSL/TLS enabled
- [ ] Separate staging secrets
- [ ] Monitoring and logging enabled
- [ ] Access restricted to team
- [ ] Test payment providers (not live)

### Production Environment
- [ ] All secrets in secrets manager
- [ ] SSL/TLS enforced
- [ ] HTTPS only (redirect HTTP)
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] DDoS protection
- [ ] WAF enabled
- [ ] Regular security audits
- [ ] Automated backups
- [ ] Disaster recovery plan
- [ ] Incident response plan

## 🛡️ Security Configuration

### 1. HTTPS/TLS

**Always enforce HTTPS in production:**

```bash
# Production .env
FORCE_HTTPS=true
SSL_ENABLED=true
HSTS_MAX_AGE=63072000
HSTS_INCLUDE_SUBDOMAINS=true
HSTS_PRELOAD=true
```

```typescript
// Middleware to enforce HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### 2. Security Headers

```bash
HELMET_ENABLED=true
CSP_ENABLED=true
```

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.API_BASE_URL],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: parseInt(process.env.HSTS_MAX_AGE) || 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

### 3. CORS Configuration

```bash
CORS_ORIGIN=https://myapp.com
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
```

```typescript
import cors from 'cors';

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400,
}));
```

### 4. Rate Limiting

```bash
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
```

### 5. Input Validation

```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/users',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('name').trim().escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

### 6. Authentication & Authorization

```bash
# Strong JWT secrets
JWT_SECRET=${STRONG_RANDOM_SECRET_32_CHARS}
JWT_ACCESS_SECRET=${STRONG_RANDOM_SECRET_32_CHARS}
JWT_REFRESH_SECRET=${STRONG_RANDOM_SECRET_32_CHARS}

# Short expiration times
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Session configuration
SESSION_SECRET=${STRONG_RANDOM_SECRET_32_CHARS}
SESSION_MAX_AGE=86400000
SESSION_SECURE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=strict
```

### 7. Database Security

```bash
# Use SSL for production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Separate read/write permissions
DB_READ_ONLY_URL=postgresql://readonly:pass@replica:5432/db?sslmode=require

# Enable query logging in production
DB_LOG_QUERIES=false  # Only for debugging

# Connection limits
DB_POOL_MAX=50
DB_STATEMENT_TIMEOUT=30000
```

### 8. Encryption

```bash
# Field-level encryption
ENCRYPTION_KEY=${64_CHAR_HEX_STRING}
ENCRYPTION_ALGORITHM=aes-256-gcm

# Password hashing
PASSWORD_HASH_ROUNDS=12
PASSWORD_HASH_ALGORITHM=bcrypt
```

## 🔍 Security Monitoring

### 1. Logging

```bash
# Production logging
LOG_LEVEL=warn
LOG_FORMAT=json
LOG_HTTP_REQUESTS=true
LOG_SQL_QUERIES=false

# Centralized logging
CLOUDWATCH_LOG_GROUP=/aws/myapp/production
SENTRY_DSN=${SENTRY_DSN}
SENTRY_ENVIRONMENT=production
```

### 2. Error Handling

```typescript
// Never expose stack traces in production
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;
  
  res.status(statusCode).json({
    error: {
      message,
      // Only include stack in development
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
});
```

### 3. Audit Logging

```typescript
// Log security-relevant events
async function auditLog(event: {
  userId: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
}) {
  await prisma.auditLog.create({
    data: {
      ...event,
      timestamp: new Date(),
    },
  });
  
  // Send critical events to SIEM
  if (isCriticalEvent(event)) {
    await sendToSIEM(event);
  }
}
```

## 🚨 Incident Response

### If Secrets Are Compromised

1. **Immediately revoke compromised credentials**
2. **Generate and deploy new secrets**
3. **Audit access logs**
4. **Notify affected users if needed**
5. **Document incident**
6. **Review and improve security**

### Security Incident Checklist

- [ ] Identify compromised secrets
- [ ] Revoke immediately
- [ ] Generate new secrets
- [ ] Deploy new secrets
- [ ] Check audit logs
- [ ] Verify no unauthorized access
- [ ] Notify stakeholders
- [ ] Document incident
- [ ] Conduct post-mortem
- [ ] Implement preventive measures

## 🔐 Secret Generation

### Generate Strong Secrets

```bash
# JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Encryption Key (32 bytes = 64 hex chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -base64 32
openssl rand -hex 32
```

### Password Requirements

```typescript
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommon: true,
  preventPreviousPasswords: 5,
};
```

## 🔗 Related Documentation

- [Secrets Management](./SECRETS_MANAGEMENT.md)
- [Environment Configuration](./README.md)
- [Database Configuration](./DATABASE_API_CONFIG.md)

---

**Last Updated**: 2025-11-13  
**Maintained By**: Security Team
