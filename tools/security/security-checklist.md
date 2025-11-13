# 🔒 Security Checklist

Checklist completo de seguridad para aplicaciones web y móviles modernas.

## 📋 Tabla de Contenidos

- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Input Validation](#input-validation)
- [API Security](#api-security)
- [Frontend Security](#frontend-security)
- [Infrastructure Security](#infrastructure-security)
- [Dependency Security](#dependency-security)
- [Security Monitoring](#security-monitoring)

## 🔐 Authentication & Authorization

### Password Security

- [ ] Passwords hasheadas con bcrypt/argon2 (min 12 rounds)
- [ ] Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y símbolos
- [ ] No almacenar passwords en plain text nunca
- [ ] Implementar rate limiting en login (max 5 intentos/minuto)
- [ ] Prevenir timing attacks en password comparison
- [ ] Password reset con tokens de un solo uso (expiran en 1 hora)
- [ ] Notificar usuarios de cambios de password
- [ ] Implementar breach detection (Have I Been Pwned API)

```typescript
// ✅ Good - Hashing with bcrypt
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

### JWT Security

- [ ] Usar algoritmos seguros (RS256 o HS256)
- [ ] Secret key con mínimo 256 bits de entropía
- [ ] Incluir claims: iss, sub, aud, exp, iat
- [ ] Access tokens cortos (15 minutos)
- [ ] Refresh tokens con rotación
- [ ] Almacenar tokens en httpOnly cookies (web)
- [ ] Implementar token blacklist para logout
- [ ] Validar signature en cada request

```typescript
// ✅ Good - JWT Configuration
import jwt from 'jsonwebtoken';

const config = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  algorithm: 'RS256' as const,
};

function generateAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId, type: 'access' },
    privateKey,
    {
      algorithm: config.algorithm,
      expiresIn: config.accessTokenExpiry,
      issuer: 'myapp.com',
      audience: 'myapp.com',
    }
  );
}
```

### Session Management

- [ ] Regenerar session ID después de login
- [ ] Usar secure cookies (Secure, HttpOnly, SameSite=Strict)
- [ ] Implementar absolute timeout (inactividad)
- [ ] Implementar idle timeout (12 horas max)
- [ ] Logout invalida session en servidor
- [ ] Concurrent sessions controladas
- [ ] CSRF tokens en forms

### Multi-Factor Authentication (MFA)

- [ ] TOTP (Time-based One-Time Password)
- [ ] SMS/Email codes como fallback
- [ ] Recovery codes (guardar hasheados)
- [ ] Permitir múltiples métodos MFA
- [ ] Requerir MFA para acciones sensibles

## 🛡️ Data Protection

### Encryption

- [ ] HTTPS everywhere (TLS 1.3 preferido)
- [ ] Datos sensibles encriptados en reposo (AES-256)
- [ ] Datos sensibles encriptados en tránsito
- [ ] Claves de encriptación rotadas regularmente
- [ ] Usar KMS (Key Management Service) para claves
- [ ] No hardcodear claves en código
- [ ] PII (Personally Identifiable Information) siempre encriptada

```typescript
// ✅ Good - Encryption at rest
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const ivLength = 16;

function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}
```

### Data Minimization

- [ ] Recolectar solo datos necesarios
- [ ] Retention policies definidas
- [ ] Purgar datos expirados automáticamente
- [ ] Anonimizar datos para analytics
- [ ] Implementar "Right to be Forgotten"

### GDPR/Privacy Compliance

- [ ] Privacy policy clara y accesible
- [ ] Cookie consent banner
- [ ] Permitir exportar datos personales
- [ ] Permitir eliminar cuenta y datos
- [ ] Data breach notification plan
- [ ] DPO (Data Protection Officer) designado
- [ ] Privacy by design en features nuevas

## ✅ Input Validation

### Server-Side Validation

- [ ] Validar TODOS los inputs en servidor
- [ ] Nunca confiar en validación client-side
- [ ] Whitelist approach (permitir conocido vs bloquear desconocido)
- [ ] Validar tipos de datos
- [ ] Validar rangos y límites
- [ ] Sanitizar inputs antes de usar

```typescript
// ✅ Good - Input validation with Zod
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(100).regex(/^[a-zA-Z\s]+$/),
  age: z.number().int().min(0).max(150),
  website: z.string().url().optional(),
});

function validateUser(data: unknown) {
  return userSchema.parse(data);
}
```

### SQL Injection Prevention

- [ ] Usar prepared statements/parameterized queries
- [ ] Nunca concatenar SQL strings con user input
- [ ] Usar ORMs con query builders seguros
- [ ] Principio de least privilege en DB users
- [ ] Deshabilitar error messages detallados en producción

```typescript
// ❌ Bad - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good - Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);

// ✅ Good - ORM
const user = await prisma.user.findUnique({
  where: { email },
});
```

### XSS Prevention

- [ ] Escapar outputs en HTML
- [ ] Usar Content Security Policy (CSP)
- [ ] Sanitizar rich text inputs
- [ ] Usar `textContent` en lugar de `innerHTML`
- [ ] Validar y sanitizar URLs
- [ ] HttpOnly cookies para prevenir XSS cookie theft

```typescript
// ❌ Bad - XSS vulnerable
element.innerHTML = userInput;

// ✅ Good - Safe
element.textContent = userInput;

// ✅ Good - With React (auto-escapes)
<div>{userInput}</div>

// ✅ Good - CSP Header
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### Command Injection Prevention

- [ ] Nunca ejecutar comandos shell con user input
- [ ] Si es necesario, usar APIs específicas
- [ ] Whitelist de comandos permitidos
- [ ] Escapar caracteres especiales de shell

```typescript
// ❌ Bad - Command injection vulnerable
const { exec } = require('child_process');
exec(`ls ${userInput}`);

// ✅ Good - Use safe APIs
const fs = require('fs').promises;
const files = await fs.readdir(directory);
```

## 🔌 API Security

### Rate Limiting

- [ ] Implementar rate limiting global
- [ ] Rate limiting por IP
- [ ] Rate limiting por usuario
- [ ] Diferentes límites para endpoints sensibles
- [ ] Responder con 429 Too Many Requests
- [ ] Headers informativos (X-RateLimit-*)

```typescript
// ✅ Good - Express rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later',
});

app.use('/api/', limiter);

// Stricter limits for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

app.use('/api/auth/login', authLimiter);
```

### CORS Configuration

- [ ] Configurar CORS apropiadamente
- [ ] No usar wildcard (*) en producción
- [ ] Whitelist de orígenes permitidos
- [ ] Credentials solo con orígenes específicos
- [ ] Limitar métodos HTTP permitidos

```typescript
// ✅ Good - CORS configuration
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://myapp.com', 'https://www.myapp.com']
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

### API Authentication

- [ ] Todos los endpoints requieren autenticación (excepto públicos)
- [ ] API keys rotadas regularmente
- [ ] OAuth 2.0 para third-party access
- [ ] Scopes granulares para permissions
- [ ] Audit log de API access

### Request Size Limits

- [ ] Límite en body size
- [ ] Límite en file uploads
- [ ] Timeout en requests
- [ ] Protección contra slowloris attacks

```typescript
// ✅ Good - Body size limits
import express from 'express';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

## 🌐 Frontend Security

### Content Security Policy

- [ ] CSP headers configurados
- [ ] Reportar violaciones a endpoint
- [ ] No usar 'unsafe-inline' ni 'unsafe-eval'
- [ ] Nonce o hash para inline scripts necesarios

```typescript
// ✅ Good - CSP configuration
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' https://cdn.example.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://api.example.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );
  next();
});
```

### Security Headers

```typescript
// ✅ Good - Security headers with Helmet
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
}));
```

### Client-Side Storage

- [ ] No almacenar datos sensibles en localStorage
- [ ] Usar sessionStorage para datos temporales
- [ ] Encriptar datos antes de guardar
- [ ] Limpiar storage al logout
- [ ] Validar datos leídos de storage

### Third-Party Scripts

- [ ] Auditar scripts third-party
- [ ] Usar Subresource Integrity (SRI)
- [ ] Sandbox iframes con `sandbox` attribute
- [ ] Minimizar third-party dependencies

```html
<!-- ✅ Good - SRI for CDN scripts -->
<script
  src="https://cdn.example.com/script.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>
```

## 🏗️ Infrastructure Security

### Server Hardening

- [ ] Firewall configurado (UFW, iptables)
- [ ] SSH con key-based authentication
- [ ] Deshabilitar root login
- [ ] Fail2ban instalado
- [ ] Automatic security updates
- [ ] Minimal software instalado
- [ ] Non-standard ports para servicios

### Docker Security

- [ ] No correr containers como root
- [ ] Minimal base images (alpine)
- [ ] Multi-stage builds
- [ ] Scan images por vulnerabilidades
- [ ] Read-only filesystems donde sea posible
- [ ] Limit resources (CPU, memory)
- [ ] Secrets via environment o secrets management

```dockerfile
# ✅ Good - Secure Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
USER nodejs
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Environment Variables

- [ ] No commitear .env al repo
- [ ] Usar .env.example como template
- [ ] Secrets en secrets management (Vault, AWS Secrets Manager)
- [ ] Diferentes secrets por ambiente
- [ ] Rotar secrets regularmente

### Database Security

- [ ] Connections encriptadas (SSL/TLS)
- [ ] Least privilege para DB users
- [ ] Backups automáticos y encriptados
- [ ] Audit logging habilitado
- [ ] No exponer DB directamente a internet
- [ ] Regular security patches

## 📦 Dependency Security

### Vulnerability Scanning

- [ ] Ejecutar `npm audit` en CI/CD
- [ ] Snyk o Dependabot configurado
- [ ] Fix critical/high vulnerabilities inmediatamente
- [ ] Review medium/low vulnerabilities
- [ ] Pin dependencies a versiones específicas

```bash
# En CI/CD pipeline
npm audit --audit-level=moderate
snyk test --severity-threshold=high
```

### Supply Chain Security

- [ ] Verificar package signatures
- [ ] Revisar maintainers de packages
- [ ] Evitar packages con pocos downloads
- [ ] Lockfiles commiteados (package-lock.json, yarn.lock)
- [ ] Renovate o Dependabot para updates automáticos

## 📊 Security Monitoring

### Logging

- [ ] Log todas las autenticaciones (éxito/fallo)
- [ ] Log accesos a datos sensibles
- [ ] Log cambios de configuración
- [ ] Log errors y exceptions
- [ ] No loggear datos sensibles (passwords, tokens, PII)
- [ ] Centralized logging (ELK, Datadog)
- [ ] Log retention policy

```typescript
// ✅ Good - Security event logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' }),
  ],
});

// Log authentication attempts
logger.info('Login attempt', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  success: true,
  timestamp: new Date(),
});

// Log data access
logger.info('Sensitive data accessed', {
  userId: user.id,
  resource: 'payment_methods',
  action: 'read',
  timestamp: new Date(),
});
```

### Error Handling

- [ ] No exponer stack traces en producción
- [ ] Mensajes de error genéricos al usuario
- [ ] Errors detallados solo en logs
- [ ] Monitoring de error patterns
- [ ] Alerts para error spikes

### Security Scanning

- [ ] SAST en CI/CD (Semgrep, SonarQube)
- [ ] DAST en staging (OWASP ZAP)
- [ ] Dependency scanning (Snyk)
- [ ] Container scanning (Trivy)
- [ ] Regular penetration testing

## 🚨 Incident Response

### Plan de Respuesta

- [ ] Incident response team definido
- [ ] Runbook para incidents comunes
- [ ] Escalation procedures
- [ ] Communication templates
- [ ] Backup y recovery procedures
- [ ] Post-mortem process

### Breach Notification

- [ ] Proceso de notificación definido
- [ ] Timelines legales conocidos (GDPR: 72 horas)
- [ ] Templates de comunicación preparados
- [ ] Contactos legales identificados

## ✅ Security Review Checklist

### Pre-Launch

- [ ] Security architecture review
- [ ] Threat modeling completado
- [ ] Penetration testing ejecutado
- [ ] Code security review
- [ ] Dependencies actualizadas
- [ ] Secrets rotados
- [ ] Backups testeados
- [ ] Incident response plan documentado

### Regular Reviews (Monthly)

- [ ] Dependency updates
- [ ] Security logs review
- [ ] Access permissions audit
- [ ] Expired certificates check
- [ ] Vulnerability scans

### Quarterly Reviews

- [ ] Penetration testing
- [ ] Security training refresh
- [ ] Disaster recovery drill
- [ ] Third-party security audits

## 📚 Recursos

- [Security Tools](./README.md)
- [Best Practices](../BEST_PRACTICES.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

_Security Checklist - Protegiendo tu aplicación en cada capa_ 🔒
